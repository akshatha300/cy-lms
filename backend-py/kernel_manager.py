from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uuid
import os
from typing import Dict, Any, Optional
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import sklearn

import sys
import io
import traceback
import threading
import ast
import base64
import json
import sqlite3
from datetime import datetime
from contextlib import redirect_stdout, redirect_stderr

app = FastAPI()

# Database Setup
DB_FILE = "kernel_submissions.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS submissions (
                    id TEXT PRIMARY KEY,
                    user_id TEXT,
                    question_id TEXT,
                    cells TEXT,
                    score REAL,
                    timestamp DATETIME
                )''')
    conn.commit()
    conn.close()

init_db()

# Store execution sessions: session_id -> {"globals": {}, "user_id": ..., "question_id": ...}
# Using an in-memory dictionary as requested.
sessions: Dict[str, Dict[str, Any]] = {}

class SessionRequest(BaseModel):
    user_id: str
    question_id: str

class SessionResponse(BaseModel):
    session_id: str

class ExecutionRequest(BaseModel):
    session_id: str
    cell_id: str
    code: str

class ExecutionResponse(BaseModel):
    text_output: str = ""
    table_output: Optional[Dict[str, Any]] = None
    image_output: Optional[str] = None
    error: Optional[str] = None

class EvaluationRequest(BaseModel):
    session_id: str
    grading_code: str

class EvaluationResponse(BaseModel):
    score: float
    feedback: str
    error: Optional[str] = None

def validate_code(code: str):
    """
    Analyzes code using AST to block dangerous operations.
    """
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return # Syntax errors will be caught during execution

    for node in ast.walk(tree):
        # Check Imports
        if isinstance(node, ast.Import):
            for n in node.names:
                if n.name.split('.')[0] in ['subprocess', 'requests', 'urllib', 'socket']:
                    raise ValueError("Restricted operation detected")
        
        elif isinstance(node, ast.ImportFrom):
            if node.module and node.module.split('.')[0] in ['subprocess', 'requests', 'urllib', 'socket']:
                raise ValueError("Restricted operation detected")
            if node.module == 'os':
                 for n in node.names:
                    if n.name in ['system', 'popen', 'spawn', 'remove', 'unlink', 'rmdir', 'rename']:
                        raise ValueError("Restricted operation detected")
            if node.module == 'shutil':
                 for n in node.names:
                    if n.name == 'rmtree':
                        raise ValueError("Restricted operation detected")

        # Check Calls
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Attribute):
                # Check for os.system, os.remove, etc.
                if isinstance(node.func.value, ast.Name):
                    if node.func.value.id == 'os' and node.func.attr in ['system', 'popen', 'spawn', 'remove', 'unlink', 'rmdir', 'rename']:
                         raise ValueError("Restricted operation detected")
                    if node.func.value.id == 'shutil' and node.func.attr == 'rmtree':
                         raise ValueError("Restricted operation detected")


@app.post("/create-session", response_model=SessionResponse, status_code=201)
def create_session(request: SessionRequest):
    """
    Creates a new persistent execution session for a user and question.
    If a session already exists for this pair, it returns the existing session_id.
    """
    # Check if a session already exists for this user and question
    for session_id, data in sessions.items():
        if data["user_id"] == request.user_id and data["question_id"] == request.question_id:
            return SessionResponse(session_id=session_id)
            
    # Create new session if one does not exist
    new_session_id = str(uuid.uuid4())
    
    # Calculate absolute path for datasets
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_dir = os.path.join(base_dir, "datasets", request.question_id)
    # Ensure directory exists
    os.makedirs(dataset_dir, exist_ok=True)

    def restricted_open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None):
        # Allow only files within the dataset directory
        # normalizing paths to be safe
        abs_path = os.path.abspath(os.path.join(dataset_dir, file))
        if not abs_path.startswith(os.path.abspath(dataset_dir)):
             raise PermissionError(f"Access denied: You can only access files in {dataset_dir}")
        return open(abs_path, mode, buffering, encoding, errors, newline, closefd, opener)

    # Preload libraries and DATASET_PATH into the session's global scope
    session_globals = {
        "pd": pd,
        "np": np,
        "plt": plt,
        "sklearn": sklearn,
        "DATASET_PATH": dataset_dir + os.sep,
        "open": restricted_open
    }

    sessions[new_session_id] = {
        "globals": session_globals,
        "user_id": request.user_id,
        "question_id": request.question_id,
        "cells": {},
        "readonly": False
    }
    
    return SessionResponse(session_id=new_session_id)

@app.get("/sessions")
def get_sessions():
    """Debug endpoint to view active sessions (optional but helpful)"""
    return {k: {"user_id": v["user_id"], "question_id": v["question_id"]} for k, v in sessions.items()}

@app.post("/run-cell", response_model=ExecutionResponse)
def run_cell(request: ExecutionRequest):
    """
    Executes code within a specific session, capturing output and handling errors.
    """
    session_id = request.session_id
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session_data = sessions[session_id]
    if session_data.get("readonly", False):
         return ExecutionResponse(error="Session is read-only. This question has been submitted.")

    # Security Check
    try:
        validate_code(request.code)
    except ValueError as e:
        return ExecutionResponse(error=str(e))

    session_data = sessions[session_id]
    user_globals = session_data["globals"]
    
    # Results container using a list to be mutable in the internal function
    # [text_output, execution_error, table_output, image_output]
    results = ["", None, None, None]

    def execute_in_thread(code, glb, res):
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()
        try:
            with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
                # AST parsing to check for last expression value
                try:
                    tree = ast.parse(code)
                    last_node = tree.body[-1] if tree.body else None
                    if isinstance(last_node, ast.Expr):
                        body_nodes = tree.body[:-1]
                        code_body = compile(ast.Module(body=body_nodes, type_ignores=[]), "<string>", "exec")
                        code_expr = compile(ast.Expression(body=last_node.value), "<string>", "eval")
                        
                        if body_nodes:
                            exec(code_body, glb)
                        result = eval(code_expr, glb)
                        
                        # Check result type for DataFrame
                        if "pd" in glb and isinstance(result, glb["pd"].DataFrame):
                             res[2] = json.loads(result.head().to_json(orient='split'))
                        elif result is not None:
                             # Emulate REPL: print non-None result
                             print(repr(result))
                    else:
                        exec(code, glb)
                except SyntaxError:
                    exec(code, glb) # Fallback to show syntax error

                # Check for Matplotlib plots
                if "plt" in glb and glb["plt"].get_fignums():
                    fig = glb["plt"].gcf()
                    img_buf = io.BytesIO()
                    fig.savefig(img_buf, format='png')
                    img_buf.seek(0)
                    res[3] = base64.b64encode(img_buf.read()).decode('utf-8')
                    glb["plt"].clf()
                    glb["plt"].close(fig)

            res[0] = stdout_capture.getvalue()
        except Exception:
            res[0] = stdout_capture.getvalue()
            res[1] = traceback.format_exc()

    # Run execution in a separate thread with a timeout
    exec_thread = threading.Thread(target=execute_in_thread, args=(request.code, user_globals, results))
    exec_thread.start()
    exec_thread.join(timeout=120)

    text_output = results[0]
    execution_error = None
    table_output = results[2]
    image_output = results[3]

    if exec_thread.is_alive():
        execution_error = "Execution exceeded time limit"
    else:
        execution_error = results[1]

    # Store cell execution history
    if "cells" not in session_data:
        session_data["cells"] = {}
    
    session_data["cells"][request.cell_id] = {
        "code": request.code,
        "text_output": text_output,
        "table_output": table_output,
        "image_output": image_output,
        "error": execution_error
    }

    return ExecutionResponse(
        text_output=text_output, 
        table_output=table_output, 
        image_output=image_output, 
        error=execution_error
    )

@app.post("/evaluate", response_model=EvaluationResponse)
def evaluate_session(request: EvaluationRequest):
    """
    Runs a hidden grading script inside the session to evaluate the user's work.
    Expects the grading script to set a global variable 'GRADING_RESULT'
    with structure: {"score": float, "feedback": str}
    """
    session_id = request.session_id
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
        
    session_data = sessions[session_id]
    user_globals = session_data["globals"]
    
    # We don't validate grading_code as it's assumed to be trusted system code
    
    stdout_capture = io.StringIO()
    stderr_capture = io.StringIO()
    
    try:
        with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
            exec(request.grading_code, user_globals)
            
        # Extract result
        if "GRADING_RESULT" in user_globals:
            result = user_globals["GRADING_RESULT"]
            # Cleanup to avoid polluting namespace
            del user_globals["GRADING_RESULT"] 
            
            # Helper to safely get values
            score = float(result.get("score", 0.0))
            feedback = str(result.get("feedback", "No feedback provided"))
            
            return EvaluationResponse(score=score, feedback=feedback)
        else:
             return EvaluationResponse(
                score=0.0,
                feedback="Grading script did not set GRADING_RESULT."
            )

    except Exception:
        execution_error = traceback.format_exc()
        return EvaluationResponse(
            score=0.0,
            feedback="Error during grading execution.",
            error=execution_error
        )

class SubmissionRequest(BaseModel):
    session_id: str
    grading_code: str

@app.post("/submit", response_model=EvaluationResponse)
def submit_session(request: SubmissionRequest):
    """
    Evaluates the session, stores the result in the database, 
    and marks the session as read-only.
    """
    # 1. Evaluate
    # Reuse evaluation logic by constructing an EvaluationRequest
    eval_req = EvaluationRequest(session_id=request.session_id, grading_code=request.grading_code)
    eval_result = evaluate_session(eval_req)
    
    if eval_result.error:
         # If evaluation crashed, we might still want to record attempt, or just fail.
         # For now, let's return the error.
         return eval_result

    # 2. Get Session Data
    session_data = sessions[request.session_id]
    
    # 3. Store in DB
    submission_id = str(uuid.uuid4())
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("INSERT INTO submissions (id, user_id, question_id, cells, score, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
              (submission_id, 
               session_data["user_id"], 
               session_data["question_id"], 
               json.dumps(session_data.get("cells", {})), 
               eval_result.score, 
               datetime.now()))
    conn.commit()
    conn.close()

    # 4. Mark Read-only
    session_data["readonly"] = True
    
    return eval_result


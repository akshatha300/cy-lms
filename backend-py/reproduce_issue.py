
import sys
import os
import io
import traceback
import signal
import threading
import _thread
from contextlib import redirect_stdout, redirect_stderr
import ast

# Mocking Flask app context and globals
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXECUTION_ENVIRONMENT = {}

def init_execution_environment():
    global EXECUTION_ENVIRONMENT
    try:
        import sklearn
        EXECUTION_ENVIRONMENT.update({'sklearn': sklearn})
    except ImportError:
        pass

init_execution_environment()

def execute_cell(code, session_id="test_session", timeout=5):
    global EXECUTION_ENVIRONMENT
    
    if not hasattr(execute_cell, 'session_environments'):
        execute_cell.session_environments = {}
    
    if session_id not in execute_cell.session_environments:
        execute_cell.session_environments[session_id] = EXECUTION_ENVIRONMENT.copy()
    
    exec_env = execute_cell.session_environments[session_id]
    
    stdout_buffer = io.StringIO()
    stderr_buffer = io.StringIO()
    
    error = None
    output = ''
    
    try:
        with redirect_stdout(stdout_buffer), redirect_stderr(stderr_buffer):
            # AST parsing logic from app.py
            tree = None
            try:
                tree = ast.parse(code)
            except SyntaxError:
                pass 
            
            last_expr = None
            if tree and tree.body and isinstance(tree.body[-1], ast.Expr):
                last_expr = tree.body.pop()

            if tree:
                if tree.body:
                    exec(compile(tree, filename="<string>", mode="exec"), exec_env)
                
                if last_expr:
                    expr_code = compile(ast.Expression(last_expr.value), filename="<string>", mode="eval")
                    result = eval(expr_code, exec_env)
                    if result is not None:
                        print(result)
            else:
                exec(code, exec_env)
        
        output = stdout_buffer.getvalue()
        stderr_output = stderr_buffer.getvalue()
        if stderr_output:
            output += f"\n[STDERR]\n{stderr_output}"
            
    except Exception:
        error = traceback.format_exc()
        output = stdout_buffer.getvalue()
    
    return {
        'output': output,
        'error': error,
        'success': error is None
    }

# Test Case 1: Define variable
print("Test 1: Definition")
res1 = execute_cell("a = 10")
print(res1)

# Test Case 2: Use undefined variable 'sfs'
print("\nTest 2: Undefined Variable")
res2 = execute_cell("sfs.fit(X, y)")
print(res2)

import multiprocessing
import sys
import io
import traceback
import json
import os
import shutil
import uuid
import sqlite3
import threading
import time
import signal
import warnings
import ast
import base64
import _thread  # For Windows timeout support
from contextlib import redirect_stdout, redirect_stderr
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Base directory for absolute paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(BASE_DIR, "student_submissions.db")

# ---------------- DATABASE ----------------
def init_db():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS submissions (
                    id TEXT,
                    studentId TEXT,
                    questionId INTEGER,
                    cellCodes TEXT,
                    combinedCode TEXT,
                    output TEXT,
                    result TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )''')
    conn.commit()
    conn.close()

init_db()

# Global execution environment dictionary
EXECUTION_ENVIRONMENT = {}

# Initialize execution environment with ML libraries
def init_execution_environment():
    """Initialize the global execution environment with common ML libraries."""
    global EXECUTION_ENVIRONMENT
    
    # Suppress warnings
    warnings.filterwarnings("ignore")
    
    # Pre-import ML libraries with error handling
    try:
        import pandas as pd
        
        # Monkeypatch pd.read_csv to look in datasets folder if file not found locally
        _original_read_csv = pd.read_csv
        
        def _smart_read_csv(filepath_or_buffer, *args, **kwargs):
            # 1. Try path as-is
            if os.path.exists(filepath_or_buffer):
                return _original_read_csv(filepath_or_buffer, *args, **kwargs)
                
            # 2. Try looking in global datasets folder
            if isinstance(filepath_or_buffer, str):
                base_dataset_dir = os.path.join(BASE_DIR, 'datasets')
                possible_path = os.path.join(base_dataset_dir, filepath_or_buffer)
                if os.path.exists(possible_path):
                    return _original_read_csv(possible_path, *args, **kwargs)
            
            # 3. Fallback to original (which will likely raise FileNotFoundError)
            return _original_read_csv(filepath_or_buffer, *args, **kwargs)

        pd.read_csv = _smart_read_csv
        
        # Configure Pandas display options for Notebook output
        pd.set_option('display.max_columns', None)
        pd.set_option('display.width', 1000)
        pd.set_option('display.max_rows', 20)
        
        EXECUTION_ENVIRONMENT['pd'] = pd
        print("pandas imported successfully (with smart path resolution)")
    except ImportError as e:
        print(f"Warning: pandas not available: {e}")
    
    try:
        import numpy as np
        EXECUTION_ENVIRONMENT['np'] = np
        print("numpy imported successfully")
    except ImportError as e:
        print(f"Warning: numpy not available: {e}")
    
    try:
        import matplotlib
        matplotlib.use('Agg') # Force non-interactive backend
        import matplotlib.pyplot as plt
        
        # Monkeypatch plt.show() to prevent clearing figures before we capture them
        def _noop_show(*args, **kwargs):
            pass
        plt.show = _noop_show
        
        EXECUTION_ENVIRONMENT['plt'] = plt
        print("matplotlib imported successfully (Agg backend, show() patched)")
    except ImportError as e:
        print(f"Warning: matplotlib not available: {e}")
    
    try:
        import seaborn as sns
        EXECUTION_ENVIRONMENT['sns'] = sns
        print("seaborn imported successfully")
    except ImportError as e:
        print(f"Warning: seaborn not available: {e}")
    
    try:
        import scipy
        import scipy.cluster.hierarchy as sch
        from scipy.cluster.hierarchy import dendrogram, linkage
        
        EXECUTION_ENVIRONMENT.update({
            'scipy': scipy,
            'dendrogram': dendrogram,
            'linkage': linkage,
            'sch': sch
        })
        print("scipy hierarchy imported successfully")
    except ImportError as e:
         print(f"Warning: scipy not available: {e}")

    try:
        import sklearn
        from sklearn.model_selection import train_test_split, GridSearchCV, RandomizedSearchCV
        from sklearn.metrics import (
            accuracy_score, r2_score, confusion_matrix, classification_report, 
            silhouette_score, mean_squared_error, mean_absolute_error,
            precision_score, recall_score, f1_score
        )
        
        from sklearn.linear_model import LinearRegression, LogisticRegression
        from sklearn.tree import DecisionTreeClassifier
        from sklearn.neighbors import KNeighborsClassifier
        from sklearn.cluster import KMeans, AgglomerativeClustering
        from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor, RandomForestClassifier, RandomForestRegressor, AdaBoostClassifier, AdaBoostRegressor
        
        from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder, OneHotEncoder
        from sklearn.impute import SimpleImputer
        from sklearn.feature_selection import SequentialFeatureSelector

        EXECUTION_ENVIRONMENT.update({
            'sklearn': sklearn,
            'train_test_split': train_test_split,
            'GridSearchCV': GridSearchCV,
            'RandomizedSearchCV': RandomizedSearchCV,
            'accuracy_score': accuracy_score,
            'r2_score': r2_score,
            'confusion_matrix': confusion_matrix,
            'classification_report': classification_report,
            'silhouette_score': silhouette_score,
            'mean_squared_error': mean_squared_error,
            'mean_absolute_error': mean_absolute_error,
            'precision_score': precision_score,
            'recall_score': recall_score,
            'f1_score': f1_score,
            'LinearRegression': LinearRegression,
            'LogisticRegression': LogisticRegression,
            'DecisionTreeClassifier': DecisionTreeClassifier,
            'KNeighborsClassifier': KNeighborsClassifier,
            'RandomForestClassifier': RandomForestClassifier,
            'RandomForestRegressor': RandomForestRegressor,
            'KMeans': KMeans,
            'AgglomerativeClustering': AgglomerativeClustering,
            'GradientBoostingClassifier': GradientBoostingClassifier,
            'GradientBoostingRegressor': GradientBoostingRegressor,
            'AdaBoostClassifier': AdaBoostClassifier,
            'AdaBoostRegressor': AdaBoostRegressor,
            'StandardScaler': StandardScaler,
            'MinMaxScaler': MinMaxScaler,
            'LabelEncoder': LabelEncoder,
            'OneHotEncoder': OneHotEncoder,
            'SimpleImputer': SimpleImputer,
            'SequentialFeatureSelector': SequentialFeatureSelector
        })
        print("sklearn ecosystem imported successfully")
    except ImportError as e:
        print(f"Warning: sklearn ecosystem not available: {e}")
    
    try:
        import xgboost as xgb
        EXECUTION_ENVIRONMENT['xgb'] = xgb
        print("xgboost imported successfully")
    except ImportError as e:
        print(f"Warning: xgboost not available: {e}")
    
    # Add dataset path
    EXECUTION_ENVIRONMENT['DATASET_PATH'] = os.path.join(BASE_DIR, 'datasets')
    EXECUTION_ENVIRONMENT['__builtins__'] = __builtins__

# Initialize the environment
init_execution_environment()

# ---------------- SECURITY RESTRICTIONS ----------------
DANGEROUS_MODULES = {
    'os.system', 'subprocess', 'shutil', 'tempfile', 'pickle', 'marshal',
    'compile', 'eval', 'execfile', '__import__', 'open', 'file', 'input',
    'raw_input', 'reload', 'vars', 'globals', 'locals', 'dir', 'hasattr',
    'getattr', 'setattr', 'delattr', 'callable', 'isinstance', 'issubclass'
}

def sanitize_code(code):
    """
    Analyzes code using AST to block dangerous operations while allowing safe ML code.
    Replaces brittle string matching with precise syntax tree analysis.
    """
    try:
        # If the code is just a comment or empty, it's safe
        if not code.strip():
            return code
            
        tree = ast.parse(code)
    except SyntaxError:
        return code # Let the execution engine handle syntax errors naturally

    for node in ast.walk(tree):
        # 1. Block dangerous imports
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            # Get the module name (for ImportFrom) or create a dummy for Import
            module_name = node.module if isinstance(node, ast.ImportFrom) else None
            
            # Check 'from X import ...'
            if module_name and module_name.split('.')[0] in ['os', 'subprocess', 'shutil', 'sys', 'builtins']:
                 raise ValueError(f"Importing '{module_name}' is restricted.")
            
            # Check 'import X' or 'from ... import X'
            for n in node.names:
                root_pkg = n.name.split('.')[0]
                if root_pkg in ['os', 'subprocess', 'shutil', 'sys', 'builtins']:
                     raise ValueError(f"Importing '{n.name}' is restricted.")

        # 2. Block dangerous function calls
        elif isinstance(node, ast.Call):
            func = node.func
            
            # Direct calls: eval(), exec(), etc.
            if isinstance(func, ast.Name):
                if func.id in ['eval', 'exec', 'open', 'exit', 'quit', 'help', 'app', 'EXECUTION_ENVIRONMENT', '__import__', 'globals', 'locals']:
                    raise ValueError(f"Function '{func.id}()' is restricted.")
            
            # Attribute calls: os.system(), etc.
            elif isinstance(func, ast.Attribute):
                # We can't easily track variable types (e.g. m = os; m.system()), 
                # but we can check for obvious patterns if the module was somehow imported.
                # Since we block imports, this is a secondary defense.
                if isinstance(func.value, ast.Name):
                    if func.value.id == 'os' and func.attr in ['system', 'popen', 'spawn', 'remove', 'rmdir', 'rename']:
                        raise ValueError(f"os.{func.attr}() is restricted.")
    
    return code

# ---------------- EXECUTION ENGINE ----------------
class TimeoutError(Exception):
    pass

def timeout_handler(signum, frame):
    """Handler for timeout signals."""
    raise TimeoutError("Code execution timed out")

def execute_cell(code, session_id="default", timeout=300, context=None, bypass_security=False):
    """
    Execute a single code cell with proper stdout/stderr capturing and timeout.
    
    Args:
        code (str): Python code to execute
        session_id (str): Session identifier for state isolation
        timeout (int): Execution timeout in seconds (Default 300s for large ML)
        context (dict): Additional variables to inject into the environment
        bypass_security (bool): Whether to skip AST sanitization (checking for prohibited functions)
    
    Returns:
        dict: Execution result with output, error, and execution time
    """
    global EXECUTION_ENVIRONMENT
    
    # Sanitize code
    if not bypass_security:
        try:
            code = sanitize_code(code)
        except ValueError as e:
            return {
                'output': '',
                'error': f'Security error: {str(e)}',
                'execution_time': 0,
                'success': False
            }
    
    # Ensure session environment exists
    if not hasattr(execute_cell, 'session_environments'):
        execute_cell.session_environments = {}
    
    # Initialize session with a COPY of the global base environment if new
    if session_id not in execute_cell.session_environments:
        execute_cell.session_environments[session_id] = EXECUTION_ENVIRONMENT.copy()
    
    exec_env = execute_cell.session_environments[session_id]
    
    # Inject context variables (e.g., DATASET_PATH) -> Update session with question-specific context
    if context:
        exec_env.update(context)
    
    # Capture stdout and stderr
    stdout_buffer = io.StringIO()
    stderr_buffer = io.StringIO()
    
    start_time = time.time()
    error = None
    output = ''
    images = [] # Capture plots
    table_data = None # Capture DataFrame structure

    # Setup timeout
    timer = None
    if hasattr(signal, 'alarm'):
        # Unix-based timeout (Requested Requirement)
        signal.signal(signal.SIGALRM, timeout_handler)
        signal.alarm(timeout)
    else:
        # Windows-based timeout using thread interrupt (Environment compatibility)
        timer = threading.Timer(timeout, _thread.interrupt_main)
        timer.start()
    
    try:
        # Execute code with captured output
        with redirect_stdout(stdout_buffer), redirect_stderr(stderr_buffer):
            # AST parsing to support implicit output (Jupyter-like behavior)
            tree = None
            try:
                tree = ast.parse(code)
            except SyntaxError:
                pass  # Let exec() raise the error naturally
            
            last_expr = None
            if tree and tree.body and isinstance(tree.body[-1], ast.Expr):
                last_expr = tree.body.pop()

            if tree:
                # 1. Execute all statements except the last one (if it was an expression)
                if tree.body:
                    exec(compile(tree, filename="<string>", mode="exec"), exec_env)
                
                # 2. Evaluate and print the last expression
                if last_expr:
                    expr_code = compile(ast.Expression(last_expr.value), filename="<string>", mode="eval")
                    result = eval(expr_code, exec_env)
                    if result is not None:
                        # Check if result is a Pandas DataFrame or Series
                        if 'pd' in exec_env and isinstance(result, (exec_env['pd'].DataFrame, exec_env['pd'].Series)):
                            # For large dataframes, we might want to truncate or paginate in future.
                            # For now, converting to a list of dicts or split format.
                            # 'split' gives { index: [], columns: [], data: [] } which is compact.
                            
                            # Convert Series to DataFrame for consistent handling
                            df_result = result.to_frame() if isinstance(result, exec_env['pd'].Series) else result
                            
                            # Limit to 50 rows for performance
                            table_data = df_result.head(50).to_dict(orient='split')
                            
                            # Also print string representation for compatibility
                            print(result)
                        else:
                            print(result)
            else:
                # Fallback: execute raw code
                exec(code, exec_env)
        
        # --- PLOT CAPTURE ---
        # 1. Capture explicitly open figures
        if 'plt' in exec_env:
            plt = exec_env['plt']
            if hasattr(plt, 'get_fignums') and plt.get_fignums():
                for i in plt.get_fignums():
                    fig = plt.figure(i)
                    buf = io.BytesIO()
                    try:
                        fig.savefig(buf, format='png', bbox_inches='tight')
                        buf.seek(0)
                        img_str = base64.b64encode(buf.read()).decode('utf-8')
                        images.append(img_str)
                    finally:
                        plt.close(i) # Close to clear state
                        buf.close()

        # 2. Capture Seaborn/Pandas plots that might not be in plt.get_fignums() but are in the current figure
        # (This is a safety net for some libraries that modify the current figure without registering it in get_fignums properly immediately)
        # However, with Agg backend and the monkeypatch, usually get_fignums() covers it. 
        # But let's check for the "current" figure just in case if no figures were found but something was plotted.
        if 'plt' in exec_env and not images:
             plt = exec_env['plt']
             if plt.get_fignums(): 
                 # This branch is redundant if the above loop works, but let's leave it for now.
                 pass

        output = stdout_buffer.getvalue()
        stderr_output = stderr_buffer.getvalue()
        if stderr_output:
            output += f"\n[STDERR]\n{stderr_output}"
            
    except TimeoutError:
        error = "Execution timed out (300s limit)"
        output = stdout_buffer.getvalue()
    except KeyboardInterrupt:
        error = "Execution timed out (KeyboardInterrupt)"
        output = stdout_buffer.getvalue()
    except Exception:
        # Use traceback for detailed error messages
        error = traceback.format_exc()
        output = stdout_buffer.getvalue()
    finally:
        # Cleanup timeout
        if hasattr(signal, 'alarm'):
            signal.alarm(0)
        elif timer:
            timer.cancel()
            
        execution_time = time.time() - start_time
    
    return {
        'output': output,
        'images': images,
        'table': table_data,
        'error': error,
        'execution_time': round(execution_time, 3),
        'success': error is None
    }

# ---------------- GRADING SCRIPTS ----------------
GRADING_SCRIPTS = {
    "1": """
import json
import numpy as np
import pandas as pd

try:
    grading_score = 0
    grading_feedback = []
    max_score = 10

    # 1. Dataset Loaded (1 pt)
    if "df" in locals() and hasattr(df, "shape") and df.shape[0] > 0:
        grading_score += 1
    else:
        grading_feedback.append("Dataset not loaded correctly or 'df' is empty")

    # 2. Target Created 'FinalScore' (1 pt)
    if "df" in locals() and hasattr(df, "columns") and "FinalScore" in df.columns:
        grading_score += 1
    else:
        grading_feedback.append("Target variable 'FinalScore' not found in DataFrame")

    # 3. Train/Test Split (2 pts)
    required_split = ["X_train", "X_test", "y_train", "y_test"]
    if all(var in locals() for var in required_split):
        grading_score += 2
    else:
        grading_feedback.append("Train-test split missing one or more variables (X_train, X_test, y_train, y_test)")

    # 4. Feature Selection Used (2 pts)
    feature_selection_found = False
    if "selected_features" in locals():
        feature_selection_found = True
    elif "sfs" in locals(): # loose check for SFS object
        feature_selection_found = True
    
    if feature_selection_found:
        grading_score += 2
    else:
        grading_feedback.append("Forward feature selection not detected (expecting 'sfs' object or 'selected_features' variable)")

    # 5. Model Trained (1 pt)
    if "model" in locals() and hasattr(model, "predict"):
        grading_score += 1
    else:
        grading_feedback.append("Model not trained or 'model' variable (with .predict defined) missing")

    # 6. Prediction Done (1 pt)
    if "predictions" in locals():
        grading_score += 1
    else:
        grading_feedback.append("Prediction step missing ('predictions' variable not found)")

    # 7. Evaluation Done / R2 Score (2 pts)
    # Check for 'score', 'r2', or 'accuracy'
    student_metric = None
    if "score" in locals() and isinstance(score, (int, float, np.number)):
        student_metric = float(score)
    elif "r2" in locals() and isinstance(r2, (int, float, np.number)):
        student_metric = float(r2)
    elif "accuracy" in locals() and isinstance(accuracy, (int, float, np.number)):
        student_metric = float(accuracy)

    if student_metric is not None:
        if student_metric >= 0.5:
            grading_score += 2
        else:
             grading_feedback.append(f"Model performance too low (Score: {student_metric:.2f} < 0.5)")
    else:
        grading_feedback.append("Evaluation metric 'score' (or 'r2'/'accuracy') not found")

    result = {
      "total_score": max_score,
      "obtained_score": grading_score,
      "feedback": grading_feedback
    }

    print("---EVAL_START---")
    print(json.dumps(result))
    print("---EVAL_END---")
except Exception as e:
    print(f"GRADING_ERROR: {str(e)}")
"""
}

# ---------------- API ENDPOINTS ----------------

@app.route("/evaluate", methods=["POST"])
def evaluate():
    """
    Evaluate student code by running it, then running a hidden grading script.
    Allows grading scripts to access variables like 'model', 'predictions', 'accuracy'.
    """
    try:
        data = request.json
        student_code = data.get("code", "")
        question_id = str(data.get("questionId", "1")) # Default to 1
        
        # Use a fresh session for evaluation
        session_id = f"eval_{uuid.uuid4()}" 
        
        # 1. Run Student Code
        exec_result = execute_cell(student_code, session_id, timeout=300)
        
        if not exec_result['success']:
            return jsonify({
                "success": False,
                "error": exec_result['error'],
                "output": exec_result['output']
            })

        # 2. Validation Logic (Hidden Grading Script)
        validation_code = GRADING_SCRIPTS.get(question_id)

        if not validation_code:
            # Fallback for unknown questions
            validation_code = GRADING_SCRIPTS.get("1")
        
        # 3. Run Validation
        val_result = execute_cell(validation_code, session_id, timeout=30, bypass_security=True)
        
        # 4. Parse Output
        full_output = val_result['output']
        
        metrics = {}
        if "---EVAL_START---" in full_output:
            try:
                json_part = full_output.split("---EVAL_START---")[1].split("---EVAL_END---")[0].strip()
                metrics = json.loads(json_part)
            except Exception as e:
                metrics = {"error": f"Failed to parse validation output: {str(e)}"}
        elif "GRADING_ERROR" in full_output:
             metrics = {"error": f"Grading script error: {full_output}"}
        else:
             metrics = {"error": "Grading script produced no formatted output", "raw_output": full_output}
        
        # Cleanup temporary session
        if session_id in execute_cell.session_environments:
            del execute_cell.session_environments[session_id]

        return jsonify({
            "success": True,
            "evaluation": metrics,
            "student_output": exec_result['output'],
            # "validation_output": val_result['output'] # debug
        })

    except Exception as e:
        return jsonify({
            "success": False, 
            "error": f"Server error: {str(e)}"
        }), 500

@app.route("/run-cell", methods=["POST"])
def run_single_cell():
    """
    Execute a single code cell.
    
    Request body:
    {
        "code": "print('Hello, World!')",
        "session_id": "optional_session_identifier",
        "questionId": "optional_question_id",
        "datasetName": "optional_dataset_name",
        "timeout": 30  # optional, defaults to 60
    }
    """
    try:
        data = request.json
        if not data or "code" not in data:
            return jsonify({
                "error": "Missing 'code' parameter in request body",
                "success": False
            }), 400
        
        code = data["code"]
        session_id = data.get("session_id")
        timeout = data.get("timeout", 300)
        question_id = data.get("questionId")
        dataset_name = data.get("datasetName")
        
        # Resolve Dataset Path
        # 1. Default global path
        dataset_path = os.path.join(BASE_DIR, 'datasets')
        
        # 2. If questionId provided, check for specific folder
        if question_id:
            specific_path = os.path.join(BASE_DIR, 'datasets', str(question_id))
            if os.path.exists(specific_path):
                dataset_path = specific_path
        
        # Context to inject
        context = {
            "DATASET_PATH": dataset_path + os.sep, # Ensure trailing slash for convenience
        }
        
        if dataset_name:
             context["DATASET_NAME"] = dataset_name
        
        # Execute the cell
        result = execute_cell(code, session_id, timeout, context=context)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "error": f"Server error: {str(e)}",
            "success": False
        }), 500

@app.route("/run-notebook", methods=["POST"])
def run_notebook():
    """
    Execute multiple cells sequentially like a Jupyter notebook.
    
    Request body:
    {
        "cells": [
            {"id": 1, "code": "import pandas as pd"},
            {"id": 2, "code": "df = pd.read_csv('data.csv')"}
        ],
        "session_id": "optional_session_identifier",
        "timeout": 60  # optional, defaults to 60
    }
    """
    try:
        data = request.json
        if not data or "cells" not in data:
            return jsonify({
                "error": "Missing 'cells' parameter in request body",
                "success": False
            }), 400
        
        cells = data["cells"]
        session_id = data.get("session_id")
        timeout = data.get("timeout", 300)
        
        results = []
        
        for cell in cells:
            cell_id = cell.get("id", len(results))
            code = cell.get("code", "")
            
            if not code.strip():
                results.append({
                    "cellId": cell_id,
                    "output": "",
                    "error": None,
                    "execution_time": 0,
                    "success": True
                })
                continue
            
            # Execute the cell
            result = execute_cell(code, session_id, timeout)
            
            results.append({
                "cellId": cell_id,
                "output": result["output"],
                "error": result["error"],
                "execution_time": result["execution_time"],
                "success": result["success"]
            })
            
            # Stop execution on error (Jupyter behavior)
            if not result["success"]:
                break
        
        return jsonify({
            "results": results,
            "total_cells": len(cells),
            "executed_cells": len(results),
            "session_id": session_id
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Server error: {str(e)}",
            "success": False
        }), 500

@app.route("/clear-session", methods=["POST"])
def clear_session():
    """
    Clear a session's execution environment.
    
    Request body:
    {
        "session_id": "session_identifier"
    }
    """
    try:
        data = request.json
        if not data or "session_id" not in data:
            return jsonify({
                "error": "Missing 'session_id' parameter",
                "success": False
            }), 400
        
        session_id = data["session_id"]
        
        if hasattr(execute_cell, 'session_environments'):
            if session_id in execute_cell.session_environments:
                del execute_cell.session_environments[session_id]
        
        return jsonify({
            "message": f"Session {session_id} cleared successfully",
            "success": True
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Server error: {str(e)}",
            "success": False
        }), 500

@app.route("/list-datasets", methods=["GET"])
def list_datasets():
    """
    List available datasets in the datasets folder.
    """
    try:
        datasets_path = os.path.join(BASE_DIR, 'datasets')
        if not os.path.exists(datasets_path):
            return jsonify({
                "datasets": [],
                "message": "Datasets folder not found"
            })
        
        datasets = []
        for file in os.listdir(datasets_path):
            if file.endswith(('.csv', '.json', '.xlsx', '.parquet')):
                file_path = os.path.join(datasets_path, file)
                file_size = os.path.getsize(file_path)
                datasets.append({
                    "name": file,
                    "size": file_size,
                    "path": file_path
                })
        
        return jsonify({
            "datasets": datasets,
            "count": len(datasets)
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Server error: {str(e)}",
            "success": False
        }), 500

@app.route("/run", methods=["POST"])
def run_legacy():
    """Legacy endpoint for backward compatibility."""
    try:
        data = request.json
        code = data.get("code", "")
        
        # Route to new execution logic
        result = execute_cell(code)
        
        return jsonify({
            "output": result["output"],
            "error": result["error"],
            "status": "success" if result["success"] else "error",
            "stdout": result["output"],
            "execution_time": result["execution_time"]
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "output": "",
            "error": f"Server error: {str(e)}"
        }), 500

@app.route("/submit", methods=["POST"])
def submit():
    """Submit notebook results to database."""
    try:
        data = request.json
        student_id = data.get("studentId", "Unknown")
        question_id = data.get("questionId", 1)
        
        # Extract details
        cells = data.get("cells", [])
        
        # Reconstruct state for storage
        cell_codes = [c.get("code", "") for c in cells]
        combined_code = "\n".join(cell_codes)
        combined_output = "\n".join([c.get("output", "") for c in cells])
        
        conn = sqlite3.connect(DB)
        c = conn.cursor()
        c.execute("INSERT INTO submissions (id, studentId, questionId, cellCodes, combinedCode, output, result) VALUES (?,?,?,?,?,?,?)", (
            str(uuid.uuid4()),
            student_id,
            question_id,
            json.dumps(cell_codes),
            combined_code,
            combined_output,
            "Submitted"
        ))
        conn.commit()
        conn.close()

        return jsonify({"success": True, "message": "Notebook submitted successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "message": "Notebook execution engine is running",
        "version": "1.0.0"
    })

@app.route("/", methods=["GET"])
def index():
    """Root endpoint with API information."""
    return jsonify({
        "name": "ML Lab Notebook Execution Engine",
        "version": "1.0.0",
        "endpoints": {
            "POST /run-cell": "Execute a single code cell",
            "POST /run-notebook": "Execute multiple cells sequentially",
            "POST /clear-session": "Clear session execution environment",
            "GET /list-datasets": "List available datasets",
            "POST /submit": "Submit notebook results",
            "GET /health": "Health check",
            "POST /run": "Legacy single code execution"
        },
        "features": [
            "Cell-by-cell execution",
            "Shared variable state",
            "ML library support (pandas, numpy, sklearn, xgboost)",
            "Timeout protection (up to 60s)",
            "Dataset access",
            "Security restrictions"
        ]
    })

if __name__ == "__main__":
    print("info: Starting Notebook Execution Engine...")
    # Ensure dataset is ready
    dataset_file = os.path.join(BASE_DIR, "datasets", "StudentsPerformance.csv")
    if not os.path.exists(dataset_file):
        print(f"Warning: Dataset not found at {dataset_file}")
        
    # Windows Mulitprocessing support
    multiprocessing.freeze_support()
    
    app.run(debug=True, port=5001)



import sys
import os
import io
import json

# Fix imports to allow importing app from current dir
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import execute_cell, init_execution_environment, GRADING_SCRIPTS

def test_grading_q1():
    print("Initializing environment...")
    init_execution_environment()
    
    # Needs a dataset. Assuming StudentsPerformance.csv is available in dataset path or CWD.
    # Since we are running in backend-py, and file structure showed it there.
    
    student_code = """
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, SequentialFeatureSelector
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

# 1. Load Data
try:
    df = pd.read_csv("StudentsPerformance.csv")
except:
    # Create dummy data if file missing for test purposes
    df = pd.DataFrame({
        'math score': np.random.randint(0, 100, 100),
        'reading score': np.random.randint(0, 100, 100),
        'writing score': np.random.randint(0, 100, 100)
    })

# 2. Target Creation
df['FinalScore'] = (df['math score'] + df['reading score'] + df['writing score']) / 3

# 3. Split
X = df[['math score', 'reading score']] # Just using some cols
y = df['FinalScore']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Feature Selection
model = LinearRegression()
sfs = SequentialFeatureSelector(model, n_features_to_select=1)
sfs.fit(X_train, y_train)
selected_features = sfs.get_support()

# 5. Train
model.fit(X_train, y_train)

# 6. Predict
predictions = model.predict(X_test)

# 7. Evaluate
score = r2_score(y_test, predictions)
print(f"Score: {score}")
"""

    session_id = "test_eval_session"
    
    print("\n--- Executing Student Code ---")
    exec_result = execute_cell(student_code, session_id, timeout=30)
    if not exec_result['success']:
        print("Student Code Failed:", exec_result['error'])
        # continue anyway to see what grading says (it should fail all)
    else:
        print("Student Code Output:", exec_result['output'])

    print("\n--- Executing Grading Script ---")
    grading_script = GRADING_SCRIPTS["1"]
    
    # Inject debug print in grading script to see locals
    debug_script = """
print("DEBUG: Keys in locals(): ", list(locals().keys()))
""" + grading_script

    eval_result = execute_cell(debug_script, session_id, timeout=30)
    print("Eval Output:", eval_result['output'])
    
    if eval_result['error']:
        print("Eval Error:", eval_result['error'])

if __name__ == "__main__":
    test_grading_q1()

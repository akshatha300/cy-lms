import sys
import os

# Add the current directory to sys.path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import execute_cell, init_execution_environment

print("Initializing environment...")
init_execution_environment()

code1 = """
import numpy as np
from sklearn.linear_model import LinearRegression
X = np.array([[1, 1], [1, 2], [2, 2], [2, 3]])
y = np.dot(X, np.array([1, 2])) + 3
model = LinearRegression().fit(X, y)
print("Training complete")
"""

code2 = """
pred = model.predict(np.array([[3, 5]]))
print("Prediction:", pred)
"""

print("\n--- Running Cell 1 (Training) ---")
res1 = execute_cell(code1, session_id="test_session")
print(res1)

print("\n--- Running Cell 2 (Prediction & Persistence) ---")
res2 = execute_cell(code2, session_id="test_session")
print(res2)

if res1['success'] and res2['success'] and "Prediction:" in res2['output']:
    print("\nSUCCESS: Model training, persistence, and prediction verified.")
else:
    print("\nFAILURE: Something went wrong.")

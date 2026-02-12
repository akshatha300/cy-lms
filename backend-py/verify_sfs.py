import sys
import os

# Add the current directory to sys.path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import execute_cell, init_execution_environment

print("Initializing environment...")
init_execution_environment()

code = """
from sklearn.feature_selection import SequentialFeatureSelector
from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
knn = KNeighborsClassifier(n_neighbors=3)
sfs = SequentialFeatureSelector(knn, n_features_to_select=2)
sfs.fit(X, y)
print("Selected features indices:", sfs.get_support(indices=True))
"""

print("\n--- Running SFS Verification ---")
res = execute_cell(code, session_id="test_sfs")
print(res)

if res['success'] and "Selected features indices:" in res['output']:
    print("\nSUCCESS: SequentialFeatureSelector is working.")
else:
    print("\nFAILURE: SFS failed.")

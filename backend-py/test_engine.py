#!/usr/bin/env python3
"""
Test script for the ML Lab Notebook Execution Engine.

This script tests all the API endpoints and features of the notebook execution engine.
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test the health check endpoint."""
    print("Testing health check...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_api_info():
    """Test the root endpoint for API information."""
    print("Testing API information...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_single_cell_execution():
    """Test single cell execution."""
    print("Testing single cell execution...")
    
    # Test basic Python code
    data = {
        "code": "print('Hello, World!')\nx = 42\nprint(f'The answer is {x}')",
        "session_id": "test_session_1"
    }
    
    response = requests.post(f"{BASE_URL}/run-cell", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_variable_state_sharing():
    """Test that variables are shared across cells in the same session."""
    print("Testing variable state sharing...")
    
    # First cell - define a variable
    data1 = {
        "code": "import pandas as pd\ndata = {'A': [1, 2, 3], 'B': [4, 5, 6]}\ndf = pd.DataFrame(data)\nprint('DataFrame created:')\nprint(df)",
        "session_id": "test_session_2"
    }
    
    response1 = requests.post(f"{BASE_URL}/run-cell", json=data1)
    print(f"Cell 1 - Status: {response1.status_code}")
    print(f"Cell 1 - Response: {json.dumps(response1.json(), indent=2)}")
    
    # Second cell - use the variable from first cell
    data2 = {
        "code": "print('Using df from previous cell:')\nprint(f'Shape: {df.shape}')\nprint(f'Sum of column A: {df[\"A\"].sum()}')",
        "session_id": "test_session_2"
    }
    
    response2 = requests.post(f"{BASE_URL}/run-cell", json=data2)
    print(f"Cell 2 - Status: {response2.status_code}")
    print(f"Cell 2 - Response: {json.dumps(response2.json(), indent=2)}")
    print()

def test_ml_libraries():
    """Test ML library support."""
    print("Testing ML libraries...")
    
    data = {
        "code": """
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

# Create sample data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

# Train a simple model
model = LinearRegression()
model.fit(X, y)

# Make predictions
y_pred = model.predict(X)
r2 = r2_score(y, y_pred)

print(f"R² Score: {r2:.4f}")
print(f"Coefficient: {model.coef_[0]:.4f}")
print(f"Intercept: {model.intercept_:.4f}")
""",
        "session_id": "test_session_3"
    }
    
    response = requests.post(f"{BASE_URL}/run-cell", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_notebook_execution():
    """Test multi-cell notebook execution."""
    print("Testing notebook execution...")
    
    data = {
        "cells": [
            {
                "id": 1,
                "code": "import pandas as pd\nimport numpy as np\nprint('Libraries imported')"
            },
            {
                "id": 2,
                "code": "# Create sample data\ndata = np.random.randn(100, 3)\ncolumns = ['Feature1', 'Feature2', 'Feature3']\ndf = pd.DataFrame(data, columns=columns)\nprint(f'DataFrame shape: {df.shape}')"
            },
            {
                "id": 3,
                "code": "print('Summary statistics:')\nprint(df.describe())"
            }
        ],
        "session_id": "test_session_4"
    }
    
    response = requests.post(f"{BASE_URL}/run-notebook", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_error_handling():
    """Test error handling."""
    print("Testing error handling...")
    
    # Test syntax error
    data = {
        "code": "print('Hello'\n# Missing closing parenthesis",
        "session_id": "test_session_5"
    }
    
    response = requests.post(f"{BASE_URL}/run-cell", json=data)
    print(f"Syntax Error - Status: {response.status_code}")
    print(f"Syntax Error - Response: {json.dumps(response.json(), indent=2)}")
    
    # Test runtime error
    data2 = {
        "code": "x = 1 / 0\nprint('This will not print')",
        "session_id": "test_session_5"
    }
    
    response2 = requests.post(f"{BASE_URL}/run-cell", json=data2)
    print(f"Runtime Error - Status: {response2.status_code}")
    print(f"Runtime Error - Response: {json.dumps(response2.json(), indent=2)}")
    print()

def test_security_restrictions():
    """Test security restrictions."""
    print("Testing security restrictions...")
    
    # Test dangerous operation
    data = {
        "code": "import os\nos.system('echo This should be blocked')",
        "session_id": "test_session_6"
    }
    
    response = requests.post(f"{BASE_URL}/run-cell", json=data)
    print(f"Security Test - Status: {response.status_code}")
    print(f"Security Test - Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_session_management():
    """Test session management."""
    print("Testing session management...")
    
    # Create a session with a variable
    data1 = {
        "code": "session_var = 'This should persist'\nprint(f'Session variable: {session_var}')",
        "session_id": "test_session_7"
    }
    
    response1 = requests.post(f"{BASE_URL}/run-cell", json=data1)
    print(f"Create Session - Status: {response1.status_code}")
    
    # Clear the session
    data2 = {
        "session_id": "test_session_7"
    }
    
    response2 = requests.post(f"{BASE_URL}/clear-session", json=data2)
    print(f"Clear Session - Status: {response2.status_code}")
    print(f"Clear Session - Response: {json.dumps(response2.json(), indent=2)}")
    
    # Try to access the variable after clearing
    data3 = {
        "code": "print(f'Trying to access: {session_var}')",
        "session_id": "test_session_7"
    }
    
    response3 = requests.post(f"{BASE_URL}/run-cell", json=data3)
    print(f"Access After Clear - Status: {response3.status_code}")
    print(f"Access After Clear - Response: {json.dumps(response3.json(), indent=2)}")
    print()

def test_timeout():
    """Test timeout functionality."""
    print("Testing timeout (this should take 2 seconds)...")
    
    data = {
        "code": "import time\ntime.sleep(2)\nprint('Woke up after 2 seconds')",
        "session_id": "test_session_8",
        "timeout": 5  # 5 second timeout
    }
    
    start_time = time.time()
    response = requests.post(f"{BASE_URL}/run-cell", json=data)
    end_time = time.time()
    
    print(f"Status: {response.status_code}")
    print(f"Execution time: {end_time - start_time:.2f} seconds")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_datasets():
    """Test dataset listing."""
    print("Testing dataset listing...")
    
    response = requests.get(f"{BASE_URL}/list-datasets")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def main():
    """Run all tests."""
    print("=== ML Lab Notebook Execution Engine Test Suite ===\n")
    
    try:
        test_health_check()
        test_api_info()
        test_single_cell_execution()
        test_variable_state_sharing()
        test_ml_libraries()
        test_notebook_execution()
        test_error_handling()
        test_security_restrictions()
        test_session_management()
        test_timeout()
        test_datasets()
        
        print("=== All tests completed ===")
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server.")
        print("Make sure the Flask server is running on http://localhost:5000")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

import sys
import os
import base64

# Add the current directory to sys.path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import execute_cell, init_execution_environment

print("Initializing environment...")
init_execution_environment()

code = """
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(5, 3))
plt.plot(x, y)
plt.title("Sine Wave")
plt.show() # This should be intercepted
"""

print("\n--- Running Plot Verification ---")
res = execute_cell(code, session_id="test_plot")

print("Success:", res['success'])
print("Images captured:", len(res['images']))

if res['success'] and len(res['images']) > 0:
    print("\nSUCCESS: Plot capture system is working.")
    # Check if it looks like a base64 string
    img = res['images'][0]
    if len(img) > 100 and img.isalnum: # Rough check
        print("Image format looks correct (Base64).")
else:
    print("\nFAILURE: No images captured.")

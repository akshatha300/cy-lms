# ML Lab Notebook Execution Engine

A Flask-based backend that provides Jupyter Notebook-like functionality for ML lab platforms. Execute Python code cell-by-cell with shared variable state, ML library support, and security restrictions.

## Features

- **Cell-by-cell execution** - Execute Python code cells sequentially like Jupyter
- **Shared variable state** - Variables persist across cells within a session
- **ML library support** - Pre-loaded with pandas, numpy, sklearn, xgboost, matplotlib, seaborn
- **Timeout protection** - Configurable execution timeouts (up to 60 seconds)
- **Dataset access** - Access datasets from a shared folder
- **Security restrictions** - Prevents dangerous system operations
- **Session management** - Isolated execution environments per session
- **Error handling** - Comprehensive exception handling with traceback

## API Endpoints

### Core Execution

#### `POST /run-cell`
Execute a single code cell.

**Request Body:**
```json
{
  "code": "print('Hello, World!')",
  "session_id": "optional_session_identifier",
  "timeout": 30
}
```

**Response:**
```json
{
  "output": "Hello, World!\n",
  "error": null,
  "execution_time": 0.002,
  "success": true
}
```

#### `POST /run-notebook`
Execute multiple cells sequentially.

**Request Body:**
```json
{
  "cells": [
    {"id": 1, "code": "import pandas as pd"},
    {"id": 2, "code": "df = pd.read_csv('data.csv')"}
  ],
  "session_id": "optional_session_identifier",
  "timeout": 60
}
```

**Response:**
```json
{
  "results": [
    {
      "cellId": 1,
      "output": "",
      "error": null,
      "execution_time": 0.001,
      "success": true
    },
    {
      "cellId": 2,
      "output": "DataFrame loaded successfully\n",
      "error": null,
      "execution_time": 0.045,
      "success": true
    }
  ],
  "total_cells": 2,
  "executed_cells": 2,
  "session_id": "optional_session_identifier"
}
```

### Session Management

#### `POST /clear-session`
Clear a session's execution environment.

**Request Body:**
```json
{
  "session_id": "session_identifier"
}
```

**Response:**
```json
{
  "message": "Session session_identifier cleared successfully",
  "success": true
}
```

### Dataset Management

#### `GET /list-datasets`
List available datasets in the datasets folder.

**Response:**
```json
{
  "datasets": [
    {
      "name": "StudentsPerformance.csv",
      "size": 25288,
      "path": "./datasets/StudentsPerformance.csv"
    }
  ],
  "count": 1
}
```

### Utility Endpoints

#### `GET /health`
Health check endpoint.

#### `GET /`
API information and available endpoints.

#### `POST /submit`
Submit notebook results to database (legacy).

#### `POST /run`
Legacy single code execution endpoint.

## Security Features

The engine includes security restrictions to prevent dangerous operations:

- **Blocked imports**: `os`, `subprocess`, `shutil`, `tempfile`, `pickle`, `marshal`
- **Blocked functions**: `eval()`, `exec()`, `compile()`, `__import__()`, `open()`, `file()`
- **Blocked access**: `globals()`, `locals()`, `vars()`, `dir()`, `hasattr()`, `getattr()`, `setattr()`, `delattr()`

## Pre-loaded Libraries

The execution environment comes with these ML libraries pre-imported:

- `pandas` as `pd`
- `numpy` as `np`
- `matplotlib.pyplot` as `plt`
- `seaborn` as `sns`
- `sklearn` with common functions
- `xgboost` as `xgb`

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## Usage Examples

### Basic Python Execution
```python
# Request
POST /run-cell
{
  "code": "x = 42\nprint(f'The answer is {x}')",
  "session_id": "my_session"
}

# Response
{
  "output": "The answer is 42\n",
  "error": null,
  "execution_time": 0.001,
  "success": true
}
```

### ML Workflow
```python
# Cell 1: Load data
POST /run-cell
{
  "code": "import pandas as pd\ndf = pd.read_csv('datasets/StudentsPerformance.csv')\nprint(df.head())",
  "session_id": "ml_session"
}

# Cell 2: Train model
POST /run-cell
{
  "code": "from sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\n\nX = df[['math score', 'reading score']]\ny = df['writing score']\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\n\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\nprint(f'R² Score: {model.score(X_test, y_test):.4f}')",
  "session_id": "ml_session"
}
```

### Error Handling
```python
# Request with error
POST /run-cell
{
  "code": "print('Hello'\n# Missing closing parenthesis",
  "session_id": "error_test"
}

# Response
{
  "output": "",
  "error": "SyntaxError: unexpected EOF while parsing (<string>, line 1)\nTraceback (most recent call last):\n  ...",
  "execution_time": 0.001,
  "success": false
}
```

## Testing

Run the comprehensive test suite:

```bash
python test_engine.py
```

This will test all endpoints and features including:
- Health checks
- Single and multi-cell execution
- Variable state sharing
- ML library functionality
- Error handling
- Security restrictions
- Session management
- Timeout protection
- Dataset access

## Architecture

### Execution Engine
- **Global Environment**: Shared execution context with pre-loaded libraries
- **Session Environments**: Isolated contexts per session ID
- **Security Layer**: Code sanitization before execution
- **Timeout Protection**: Threading-based timeout mechanism
- **Output Capture**: stdout/stderr redirection using `io.StringIO`

### Security Model
The engine uses a whitelist approach for allowed operations:
- Pre-approved ML libraries are available
- Dangerous modules and functions are blocked
- File system access is restricted to datasets folder
- System commands are prevented

### Session Management
- Each `session_id` gets its own execution environment
- Variables persist across cells within the same session
- Sessions can be cleared to reset state
- Global environment used when no session specified

## Configuration

### Timeout Settings
- Default timeout: 60 seconds
- Configurable per request via `timeout` parameter
- Windows-compatible using threading (not signals)

### Dataset Folder
- Default path: `./datasets/`
- Supported formats: `.csv`, `.json`, `.xlsx`, `.parquet`
- Accessible via `DATASET_PATH` variable in code

### Database
- SQLite database for submissions
- Table: `submissions` with cell codes, outputs, and metadata
- Automatic initialization on startup

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error description",
  "success": false
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad request (missing parameters)
- `408`: Request timeout
- `500`: Server error

## Performance Considerations

- **Memory**: Each session maintains its own variable state
- **Timeout**: Long-running operations are terminated after timeout
- **Concurrency**: Multiple sessions can run simultaneously
- **Security**: Code sanitization adds minimal overhead

## Limitations

- No file writing outside datasets folder
- No network access or external API calls
- No multi-threading or multiprocessing in user code
- Limited to Python standard library and pre-loaded ML packages
- No persistent storage across server restarts (except database)

## Contributing

When extending the engine:
1. Maintain security restrictions
2. Test with the provided test suite
3. Update API documentation
4. Follow the existing code style
5. Add appropriate error handling

## License

This project is part of the CY-LMS ML Lab Platform.

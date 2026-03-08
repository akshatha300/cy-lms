import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Exact Advanced ML Labs as Requested
const exactAdvancedLabs = [
  // CO1: Forward Feature Selection
  {
    name: "ForwardFeatureSelectionKDD",
    title: "Forward Feature Selection - KDD Cup99",
    description: "Using feature forward selection approaches, reduce the dimensionality of the KDD Cup99 dataset. This experiment involves applying the forward feature selection technique, which incrementally selects features that improve model performance. The focus is on reducing irrelevant or redundant features in the KDD Cup99 dataset.",
    difficulty: 4,
    estimatedTime: 90,
    category: "Feature Engineering",
    tags: ["feature-selection", "dimensionality-reduction", "sklearn", "mlxtend", "kdd-cup99"],
    objectives: [
      "Implement forward feature selection algorithm",
      "Apply to KDD Cup99 dataset",
      "Reduce dimensionality while maintaining performance",
      "Evaluate feature importance and model accuracy"
    ],
    prerequisites: [
      "Understanding of feature selection concepts",
      "sklearn and mlxtend libraries",
      "KDD Cup99 dataset familiarity"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from mlxtend.feature_selection import SequentialFeatureSelector
import matplotlib.pyplot as plt

# Load KDD Cup99 dataset
def load_kdd_dataset():
    # In practice, download from: http://kdd.ics.uci.edu/databases/kddcup99/kddcup99.html
    # For demonstration, create sample dataset
    np.random.seed(42)
    n_samples = 1000
    
    # Create sample features similar to KDD Cup99
    data = {
        'duration': np.random.exponential(100, n_samples),
        'protocol_type': np.random.choice(['tcp', 'udp', 'icmp'], n_samples),
        'service': np.random.choice(['http', 'ftp', 'smtp', 'telnet'], n_samples),
        'src_bytes': np.random.exponential(1000, n_samples),
        'dst_bytes': np.random.exponential(800, n_samples),
        'land': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
        'wrong_fragment': np.random.choice([0, 1], n_samples, p=[0.98, 0.02]),
        'urgent': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
        'hot': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
        'num_failed_logins': np.random.poisson(0.1, n_samples),
        'num_compromised': np.random.poisson(0.05, n_samples),
        'root_shell': np.random.choice([0, 1], n_samples, p=[0.99, 0.01]),
        'su_attempted': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
        'num_root': np.random.poisson(0.01, n_samples),
        'num_file_creations': np.random.poisson(2, n_samples),
        'num_shells': np.random.poisson(0.5, n_samples),
        'num_access_files': np.random.poisson(5, n_samples),
        'num_outbound_cmds': np.random.poisson(3, n_samples),
        'is_host_login': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'is_guest_login': np.random.choice([0, 1], n_samples, p=[0.3, 0.7]),
        'count': np.random.exponential(50, n_samples),
        'srv_count': np.random.exponential(2, n_samples),
        'serror_rate': np.random.exponential(0.01, n_samples),
        'rerror_rate': np.random.exponential(0.01, n_samples),
        'same_srv_rate': np.random.exponential(0.5, n_samples),
        'diff_srv_rate': np.random.exponential(0.1, n_samples),
        'srv_diff_host_rate': np.random.exponential(0.1, n_samples),
        'dst_host_count': np.random.exponential(10, n_samples),
        'dst_host_srv_count': np.random.exponential(5, n_samples),
        'dst_host_same_srv_rate': np.random.exponential(0.3, n_samples),
        'dst_host_diff_srv_rate': np.random.exponential(0.1, n_samples),
        'dst_host_serror_rate': np.random.exponential(0.01, n_samples),
        'dst_host_rerror_rate': np.random.exponential(0.01, n_samples),
        'label': np.random.choice([0, 1], n_samples, p=[0.7, 0.3])  # 0=normal, 1=attack
    }
    
    df = pd.DataFrame(data)
    return df

# Load dataset
df = load_kdd_dataset()

print("Forward Feature Selection - KDD Cup99")
print("=" * 50)
print(f"Dataset shape: {df.shape}")
print(f"Features: {df.drop('label', axis=1).columns.tolist()}")

# Separate features and target
X = df.drop('label', axis=1)
y = df['label']

# Convert categorical variables to numerical
X = pd.get_dummies(X, drop_first=True)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

print(f"Training set: {X_train.shape}")
print(f"Test set: {X_test.shape}")

# Initialize base classifier
rf = RandomForestClassifier(n_estimators=100, random_state=42)

# Forward Feature Selection
print("\\nStarting Forward Feature Selection...")

# Sequential Feature Selector
sfs = SequentialFeatureSelector(
    estimator=rf,
    k_features=15,  # Select top 15 features
    forward=True,
    floating=False,
    scoring='accuracy',
    cv=5
)

# Fit selector
sfs = sfs.fit(X_train, y_train)

# Get selected features
selected_features = list(sfs.k_feature_idx_)
selected_feature_names = X_train.columns[selected_features]

print(f"\\nOriginal number of features: {X_train.shape[1]}")
print(f"Selected {len(selected_features)} features:")
for i, feature in enumerate(selected_feature_names):
    print(f"{i+1:2d}. {feature}")

# Transform datasets
X_train_selected = sfs.transform(X_train)
X_test_selected = sfs.transform(X_test)

# Train model with selected features
rf_selected = RandomForestClassifier(n_estimators=100, random_state=42)
rf_selected.fit(X_train_selected, y_train)

# Evaluate with selected features
y_pred_selected = rf_selected.predict(X_test_selected)
accuracy_selected = accuracy_score(y_test, y_pred_selected)

# Train model with all features for comparison
rf_all = RandomForestClassifier(n_estimators=100, random_state=42)
rf_all.fit(X_train, y_train)
y_pred_all = rf_all.predict(X_test)
accuracy_all = accuracy_score(y_test, y_pred_all)

print(f"\\nResults:")
print(f"Accuracy with all features: {accuracy_all:.4f}")
print(f"Accuracy with selected features: {accuracy_selected:.4f}")
print(f"Performance difference: {accuracy_selected - accuracy_all:.4f}")

# Feature importance
feature_importance = rf_selected.feature_importances_
importance_df = pd.DataFrame({
    'feature': selected_feature_names,
    'importance': feature_importance
}).sort_values('importance', ascending=False)

print("\\nTop 10 Selected Features by Importance:")
print(importance_df.head(10))

# Plot feature selection performance
plt.figure(figsize=(12, 6))
plt.plot(range(1, len(sfs.subsets_) + 1), sfs.subsets_, marker='o')
plt.xlabel('Number of Features')
plt.ylabel('Cross-Validation Score')
plt.title('Forward Feature Selection Performance')
plt.grid(True)
plt.show()`,
    solution: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from mlxtend.feature_selection import SequentialFeatureSelector
import matplotlib.pyplot as plt

def load_kdd_dataset():
    """Load actual KDD Cup99 dataset"""
    # Download from: http://kdd.ics.uci.edu/databases/kddcup99/kddcup99.html
    # For this example, we'll use a sample
    np.random.seed(42)
    n_samples = 2000
    
    data = {
        'duration': np.random.exponential(100, n_samples),
        'protocol_type': np.random.choice(['tcp', 'udp', 'icmp'], n_samples),
        'service': np.random.choice(['http', 'ftp', 'smtp', 'telnet', 'domain_u', 'other'], n_samples),
        'src_bytes': np.random.exponential(1000, n_samples),
        'dst_bytes': np.random.exponential(800, n_samples),
        'land': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
        'wrong_fragment': np.random.choice([0, 1], n_samples, p=[0.98, 0.02]),
        'urgent': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
        'hot': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
        'num_failed_logins': np.random.poisson(0.1, n_samples),
        'num_compromised': np.random.poisson(0.05, n_samples),
        'root_shell': np.random.choice([0, 1], n_samples, p=[0.99, 0.01]),
        'su_attempted': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
        'num_root': np.random.poisson(0.01, n_samples),
        'num_file_creations': np.random.poisson(2, n_samples),
        'num_shells': np.random.poisson(0.5, n_samples),
        'num_access_files': np.random.poisson(5, n_samples),
        'num_outbound_cmds': np.random.poisson(3, n_samples),
        'is_host_login': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'is_guest_login': np.random.choice([0, 1], n_samples, p=[0.3, 0.7]),
        'count': np.random.exponential(50, n_samples),
        'srv_count': np.random.exponential(2, n_samples),
        'serror_rate': np.random.exponential(0.01, n_samples),
        'rerror_rate': np.random.exponential(0.01, n_samples),
        'same_srv_rate': np.random.exponential(0.5, n_samples),
        'diff_srv_rate': np.random.exponential(0.1, n_samples),
        'srv_diff_host_rate': np.random.exponential(0.1, n_samples),
        'dst_host_count': np.random.exponential(10, n_samples),
        'dst_host_srv_count': np.random.exponential(5, n_samples),
        'dst_host_same_srv_rate': np.random.exponential(0.3, n_samples),
        'dst_host_diff_srv_rate': np.random.exponential(0.1, n_samples),
        'dst_host_serror_rate': np.random.exponential(0.01, n_samples),
        'dst_host_rerror_rate': np.random.exponential(0.01, n_samples),
        'label': np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
    }
    
    df = pd.DataFrame(data)
    return df

def evaluate_feature_selection(X_train, X_test, y_train, y_test, max_features=20):
    """Evaluate forward feature selection with different numbers of features"""
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    
    # Forward feature selection
    sfs = SequentialFeatureSelector(
        estimator=rf,
        k_features=max_features,
        forward=True,
        floating=False,
        scoring='accuracy',
        cv=5,
        n_jobs=-1
    )
    
    sfs = sfs.fit(X_train, y_train)
    
    # Track performance across different numbers of features
    scores = []
    feature_counts = []
    
    for i in range(1, len(sfs.subsets_) + 1):
        subset_features = list(sfs.subsets_[:i])
        X_train_subset = X_train.iloc[:, subset_features]
        X_test_subset = X_test.iloc[:, subset_features]
        
        rf_subset = RandomForestClassifier(n_estimators=100, random_state=42)
        rf_subset.fit(X_train_subset, y_train)
        y_pred = rf_subset.predict(X_test_subset)
        
        score = accuracy_score(y_test, y_pred)
        scores.append(score)
        feature_counts.append(i)
    
    return sfs, scores, feature_counts

def main():
    print("Forward Feature Selection - KDD Cup99 Dataset")
    print("=" * 60)
    
    # Load dataset
    df = load_kdd_dataset()
    
    # Preprocess
    X = pd.get_dummies(df.drop('label', axis=1), drop_first=True)
    y = df['label']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )
    
    print(f"Dataset shape: {df.shape}")
    print(f"Training set: {X_train.shape}")
    print(f"Test set: {X_test.shape}")
    
    # Evaluate feature selection
    print("\\nPerforming forward feature selection...")
    sfs, scores, feature_counts = evaluate_feature_selection(X_train, X_test, y_train, y_test)
    
    # Get selected features
    selected_features = list(sfs.k_feature_idx_)
    selected_feature_names = X_train.columns[selected_features]
    
    print(f"\\nOriginal features: {X_train.shape[1]}")
    print(f"Selected features: {len(selected_features)}")
    print("\\nSelected features:")
    for i, feature in enumerate(selected_feature_names):
        print(f"{i+1:2d}. {feature}")
    
    # Final evaluation
    X_train_selected = sfs.transform(X_train)
    X_test_selected = sfs.transform(X_test)
    
    rf_final = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_final.fit(X_train_selected, y_train)
    
    y_pred = rf_final.predict(X_test_selected)
    final_accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\\nFinal Accuracy: {final_accuracy:.4f}")
    print("\\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Plot results
    plt.figure(figsize=(10, 6))
    plt.plot(feature_counts, scores, marker='o')
    plt.xlabel('Number of Features')
    plt.ylabel('Accuracy')
    plt.title('Forward Feature Selection Performance')
    plt.grid(True)
    plt.show()

if __name__ == "__main__":
    main()`,
    evaluationCriteria: [
      "Implement forward feature selection using mlxtend",
      "Apply to KDD Cup99 dataset",
      "Reduce features while maintaining performance",
      "Visualize feature selection process",
      "Compare accuracy before and after selection"
    ],
    hints: [
      "Use mlxtend SequentialFeatureSelector",
      "Start with small dataset for faster execution",
      "Monitor cross-validation scores",
      "Analyze feature importance rankings",
      "Consider computational complexity"
    ]
  },

  // CO1: Backward Feature Elimination
  {
    name: "BackwardFeatureEliminationKDD",
    title: "Backward Feature Elimination - KDD Cup99",
    description: "Using feature backward elimination approaches, reduce the dimensionality of the KDD Cup99 dataset. This experiment uses backward feature elimination to iteratively remove features that have minimal impact on model performance. The KDD Cup99 dataset is used as input, and important features are retained while others are eliminated.",
    difficulty: 4,
    estimatedTime: 90,
    category: "Feature Engineering",
    tags: ["feature-elimination", "dimensionality-reduction", "sklearn", "statsmodels", "kdd-cup99"],
    objectives: [
      "Implement backward feature elimination algorithm",
      "Apply to KDD Cup99 dataset",
      "Iteratively remove least important features",
      "Maintain model performance while reducing features"
    ],
    prerequisites: [
      "Understanding of feature elimination concepts",
      "sklearn feature selection methods",
      "Statistical evaluation techniques"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.feature_selection import RFE
import matplotlib.pyplot as plt

# Load KDD Cup99 dataset
def load_kdd_dataset():
    np.random.seed(42)
    n_samples = 1000
    
    data = {
        'duration': np.random.exponential(100, n_samples),
        'protocol_type': np.random.choice(['tcp', 'udp', 'icmp'], n_samples),
        'service': np.random.choice(['http', 'ftp', 'smtp', 'telnet'], n_samples),
        'src_bytes': np.random.exponential(1000, n_samples),
        'dst_bytes': np.random.exponential(800, n_samples),
        'count': np.random.exponential(50, n_samples),
        'serror_rate': np.random.exponential(0.01, n_samples),
        'rerror_rate': np.random.exponential(0.01, n_samples),
        'same_srv_rate': np.random.exponential(0.5, n_samples),
        'diff_srv_rate': np.random.exponential(0.1, n_samples),
        'dst_host_count': np.random.exponential(10, n_samples),
        'dst_host_srv_count': np.random.exponential(5, n_samples),
        'label': np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
    }
    
    df = pd.DataFrame(data)
    return df

# Load dataset
df = load_kdd_dataset()

print("Backward Feature Elimination - KDD Cup99")
print("=" * 50)
print(f"Dataset shape: {df.shape}")

# Separate features and target
X = df.drop('label', axis=1)
y = df['label']

# Convert categorical variables to numerical
X = pd.get_dummies(X, drop_first=True)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

print(f"Training set: {X_train.shape}")
print(f"Test set: {X_test.shape}")

# Initialize model
rf = RandomForestClassifier(n_estimators=100, random_state=42)

# Backward Feature Elimination
print("\\nStarting Backward Feature Elimination...")

# Recursive Feature Elimination
rfe = RFE(
    estimator=rf,
    n_features_to_select=10,  # Select top 10 features
    step=1  # Remove one feature at a time
)

# Fit RFE
rfe.fit(X_train, y_train)

# Get selected features
selected_features = rfe.support_
feature_ranking = rfe.ranking_
selected_feature_names = X_train.columns[selected_features]

print(f"\\nOriginal number of features: {X_train.shape[1]}")
print(f"Selected {len(selected_feature_names)} features:")

# Display feature rankings
feature_rankings = pd.DataFrame({
    'feature': X_train.columns,
    'ranking': feature_ranking
}).sort_values('ranking')

print("\\nFeature Rankings (Lower is Better):")
print(feature_rankings.head(15))

# Transform datasets
X_train_selected = rfe.transform(X_train)
X_test_selected = rfe.transform(X_test)

# Train and evaluate with selected features
rf_selected = RandomForestClassifier(n_estimators=100, random_state=42)
rf_selected.fit(X_train_selected, y_train)
y_pred_selected = rf_selected.predict(X_test_selected)
accuracy_selected = accuracy_score(y_test, y_pred_selected)

# Train and evaluate with all features
rf_all = RandomForestClassifier(n_estimators=100, random_state=42)
rf_all.fit(X_train, y_train)
y_pred_all = rf_all.predict(X_test)
accuracy_all = accuracy_score(y_test, y_pred_all)

print(f"\\nResults:")
print(f"Accuracy with all features: {accuracy_all:.4f}")
print(f"Accuracy with selected features: {accuracy_selected:.4f}")
print(f"Performance difference: {accuracy_selected - accuracy_all:.4f}")

# Plot feature rankings
plt.figure(figsize=(12, 8))
plt.bar(range(len(feature_rankings)), feature_rankings['ranking'])
plt.xlabel('Features')
plt.ylabel('Ranking')
plt.title('Feature Rankings (Lower is Better)')
plt.xticks(range(len(feature_rankings)), feature_rankings['feature'], rotation=45)
plt.tight_layout()
plt.show()`,
    evaluationCriteria: [
      "Implement backward feature elimination using RFE",
      "Remove features iteratively based on importance",
      "Use cross-validation for robust evaluation",
      "Track performance changes during elimination",
      "Compare results with forward selection"
    ],
    hints: [
      "Use sklearn's RFE for automatic elimination",
      "Monitor performance at each elimination step",
      "Consider computational cost of elimination",
      "Use cross-validation for reliable results",
      "Document elimination process"
    ]
  },

  // CO2: Linear Regression
  {
    name: "LinearRegressionHousePrediction",
    title: "Linear Regression - House Price Prediction",
    description: "Write a program to implement a linear regression for house prediction dataset. This experiment requires building a linear regression model to predict house prices using features like square footage, location, and number of rooms. The implementation should include preprocessing, training, and evaluation of the model.",
    difficulty: 3,
    estimatedTime: 75,
    category: "Supervised Learning",
    tags: ["linear-regression", "house-prediction", "sklearn", "boston-housing"],
    objectives: [
      "Implement linear regression model",
      "Preprocess housing dataset",
      "Train model on house features",
      "Evaluate model performance with metrics"
    ],
    prerequisites: [
      "Understanding of linear regression",
      "sklearn library familiarity",
      "Data preprocessing techniques"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Load Boston Housing dataset
def load_boston_housing():
    """Load Boston Housing dataset"""
    # Note: Boston Housing dataset is deprecated, but used for demonstration
    # In practice, use California Housing or create synthetic data
    np.random.seed(42)
    n_samples = 500
    
    data = {
        'crim': np.random.exponential(3.6, n_samples),  # Crime rate
        'zn': np.random.exponential(11.4, n_samples),  # Residential land
        'indus': np.random.exponential(11.1, n_samples),  # Industrial land
        'chas': np.random.choice([0, 1], n_samples, p=[0.93, 0.07]),  # Charles River
        'nox': np.random.exponential(0.55, n_samples),  # NOX concentration
        'rm': np.random.normal(6.3, 0.7, n_samples),  # Average rooms
        'age': np.random.exponential(68.6, n_samples),  # Age of houses
        'dis': np.random.exponential(3.8, n_samples),  # Distance to employment
        'rad': np.random.exponential(9.5, n_samples),  # Highway accessibility
        'tax': np.random.normal(408, 168, n_samples),  # Property tax
        'ptratio': np.random.normal(18.5, 2.2, n_samples),  # Pupil-teacher ratio
        'b': np.random.normal(356.7, 91.3, n_samples),  # Black population
        'lstat': np.random.exponential(12.7, n_samples),  # Lower status
        'medv': np.random.normal(22.5, 9.2, n_samples)  # Median value (target)
    }
    
    df = pd.DataFrame(data)
    return df

# Load dataset
df = load_boston_housing()

print("Linear Regression - House Price Prediction")
print("=" * 50)
print(f"Dataset shape: {df.shape}")
print(f"Features: {df.drop('medv', axis=1).columns.tolist()}")

# Separate features and target
X = df.drop('medv', axis=1)
y = df['medv']

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Training set: {X_train.shape}")
print(f"Test set: {X_test.shape}")

# Feature scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Initialize and train linear regression model
print("\\nTraining Linear Regression model...")
lr = LinearRegression()
lr.fit(X_train_scaled, y_train)

# Make predictions
y_train_pred = lr.predict(X_train_scaled)
y_test_pred = lr.predict(X_test_scaled)

# Evaluate model
train_mse = mean_squared_error(y_train, y_train_pred)
test_mse = mean_squared_error(y_test, y_test_pred)
train_r2 = r2_score(y_train, y_train_pred)
test_r2 = r2_score(y_test, y_test_pred)
train_mae = mean_absolute_error(y_train, y_train_pred)
test_mae = mean_absolute_error(y_test, y_test_pred)

print(f"\\nModel Performance:")
print(f"Training MSE: {train_mse:.2f}")
print(f"Test MSE: {test_mse:.2f}")
print(f"Training R²: {train_r2:.4f}")
print(f"Test R²: {test_r2:.4f}")
print(f"Training MAE: {train_mae:.2f}")
print(f"Test MAE: {test_mae:.2f}")

# Display model coefficients
coefficients = pd.DataFrame({
    'feature': X.columns,
    'coefficient': lr.coef_
}).sort_values('coefficient', key=abs, ascending=False)

print(f"\\nModel Coefficients:")
print(coefficients)

print(f"\\nIntercept: {lr.intercept_:.2f}")

# Example prediction
example_house = np.array([[0.1, 18.0, 2.31, 0, 0.54, 6.58, 65.2, 4.09, 1, 296, 15.3, 396.9, 4.98]])
example_house_scaled = scaler.transform(example_house)
predicted_price = lr.predict(example_house_scaled)

print(f"\\nExample Prediction:")
print(f"Predicted price: {predicted_price[0]:.2f}")

# Visualize predictions vs actual
plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.scatter(y_test, y_test_pred, alpha=0.6)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')
plt.xlabel('Actual Prices')
plt.ylabel('Predicted Prices')
plt.title('Actual vs Predicted Prices')
plt.grid(True)

# Residual plot
plt.subplot(1, 2, 2)
residuals = y_test - y_test_pred
plt.scatter(y_test_pred, residuals, alpha=0.6)
plt.axhline(y=0, color='r', linestyle='--')
plt.xlabel('Predicted Prices')
plt.ylabel('Residuals')
plt.title('Residual Plot')
plt.grid(True)

plt.tight_layout()
plt.show()`,
    evaluationCriteria: [
      "Implement linear regression correctly",
      "Preprocess housing dataset appropriately",
      "Train model and make predictions",
      "Evaluate using MSE, R², MAE",
      "Visualize model performance"
    ],
    hints: [
      "Use feature scaling for better performance",
      "Split data into train/test sets",
      "Evaluate multiple metrics (MSE, R², MAE)",
      "Visualize predictions vs actual values",
      "Interpret model coefficients"
    ]
  },

  // CO2: Logistic Regression
  {
    name: "LogisticRegressionIRISStartups",
    title: "Logistic Regression - IRIS & 50_Startups",
    description: "Write a Python program to implement logistic regression for classification. i. IRIS dataset: This involves classifying flowers into species using features like petal length and sepal width. Evaluate accuracy using metrics such as confusion matrix and F1-score. ii. 50_Startups dataset: Predict the likelihood of success for startups based on features like investment and location.",
    difficulty: 3,
    estimatedTime: 80,
    category: "Supervised Learning",
    tags: ["logistic-regression", "classification", "iris", "startups", "sklearn"],
    objectives: [
      "Implement logistic regression for multi-class classification",
      "Apply to IRIS dataset",
      "Apply to 50_Startups dataset",
      "Evaluate using confusion matrix and F1-score"
    ],
    prerequisites: [
      "Understanding of logistic regression",
      "Classification evaluation metrics",
      "IRIS and 50_Startups datasets"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, f1_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns

# Part I: IRIS Dataset
print("=" * 50)
print("PART I: IRIS DATASET - LOGISTIC REGRESSION")
print("=" * 50)

def load_iris_dataset():
    """Load IRIS dataset"""
    from sklearn.datasets import load_iris
    
    iris = load_iris()
    X = iris.data
    y = iris.target
    
    return X, y, iris.target_names

# Load IRIS data
X_iris, y_iris, target_names = load_iris_dataset()

print(f"IRIS Dataset Shape: {X_iris.shape}")
print(f"Features: {['sepal_length', 'sepal_width', 'petal_length', 'petal_width']}")
print(f"Classes: {target_names}")

# Split IRIS data
X_train_iris, X_test_iris, y_train_iris, y_test_iris = train_test_split(
    X_iris, y_iris, test_size=0.3, random_state=42, stratify=y_iris
)

# Scale IRIS features
scaler_iris = StandardScaler()
X_train_iris_scaled = scaler_iris.fit_transform(X_train_iris)
X_test_iris_scaled = scaler_iris.transform(X_test_iris)

# Train logistic regression on IRIS
print("\\nTraining Logistic Regression on IRIS...")
lr_iris = LogisticRegression(multi_class='multinomial', solver='lbfgs', random_state=42)
lr_iris.fit(X_train_iris_scaled, y_train_iris)

# Predict and evaluate IRIS
y_pred_iris = lr_iris.predict(X_test_iris_scaled)

print("\\nIRIS Classification Report:")
print(classification_report(y_test_iris, y_pred_iris, target_names=target_names))

# IRIS confusion matrix
cm_iris = confusion_matrix(y_test_iris, y_pred_iris)
print(f"\\nIRIS Confusion Matrix:")
print(cm_iris)

# IRIS F1 scores
f1_iris = f1_score(y_test_iris, y_pred_iris, average=None)
print(f"\\nIRIS F1 Scores by Class:")
for i, class_name in enumerate(target_names):
    print(f"{class_name}: {f1_iris[i]:.4f}")

# Part II: 50_Startups Dataset
print("\\n" + "=" * 50)
print("PART II: 50_STARTUPS DATASET - LOGISTIC REGRESSION")
print("=" * 50)

def load_startups_dataset():
    """Load 50_Startups dataset"""
    # Create sample dataset (in practice, load from CSV)
    np.random.seed(42)
    n_samples = 500
    
    data = {
        'rd_spend': np.random.exponential(80000, n_samples),
        'administration': np.random.exponential(25000, n_samples),
        'marketing_spend': np.random.exponential(40000, n_samples),
        'state': np.random.choice(['California', 'New York', 'Florida', 'Texas'], n_samples),
        'profit': np.random.normal(100000, 50000, n_samples),
        'success': np.random.choice([0, 1], n_samples, p=[0.6, 0.4])  # 0=failure, 1=success
    }
    
    df = pd.DataFrame(data)
    return df

# Load startups data
df_startups = load_startups_dataset()

print(f"50_Startups Dataset Shape: {df_startups.shape}")

# Preprocess startups data
X_startups = pd.get_dummies(df_startups.drop('success', axis=1), drop_first=True)
y_startups = df_startups['success']

# Split startups data
X_train_start, X_test_start, y_train_start, y_test_start = train_test_split(
    X_startups, y_startups, test_size=0.3, random_state=42, stratify=y_startups
)

# Scale startups features
scaler_start = StandardScaler()
X_train_start_scaled = scaler_start.fit_transform(X_train_start)
X_test_start_scaled = scaler_start.transform(X_test_start)

# Train logistic regression on startups
print("\\nTraining Logistic Regression on Startups...")
lr_start = LogisticRegression(random_state=42)
lr_start.fit(X_train_start_scaled, y_train_start)

# Predict and evaluate startups
y_pred_start = lr_start.predict(X_test_start_scaled)

print("\\nStartups Classification Report:")
print(classification_report(y_test_start, y_pred_start))

# Startups confusion matrix
cm_start = confusion_matrix(y_test_start, y_pred_start)
print(f"\\nStartups Confusion Matrix:")
print(cm_start)

# Startups F1 scores
f1_start = f1_score(y_test_start, y_pred_start, average=None)
print(f"\\nStartups F1 Scores:")
print(f"Failure (Class 0): {f1_start[0]:.4f}")
print(f"Success (Class 1): {f1_start[1]:.4f}")

# Visualize results
plt.figure(figsize=(15, 6))

# IRIS confusion matrix
plt.subplot(1, 3, 1)
sns.heatmap(cm_iris, annot=True, fmt='d', cmap='Blues', 
            xticklabels=target_names, yticklabels=target_names)
plt.title('IRIS Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('Actual')

# Startups confusion matrix
plt.subplot(1, 3, 2)
sns.heatmap(cm_start, annot=True, fmt='d', cmap='Reds',
            xticklabels=['Failure', 'Success'], yticklabels=['Failure', 'Success'])
plt.title('Startups Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('Actual')

# F1 score comparison
plt.subplot(1, 3, 3)
datasets = ['IRIS', 'Startups']
f1_scores = [np.mean(f1_iris), np.mean(f1_start)]
plt.bar(datasets, f1_scores, color=['blue', 'orange'])
plt.title('Average F1 Score Comparison')
plt.ylabel('F1 Score')
plt.ylim(0, 1)

plt.tight_layout()
plt.show()`,
    evaluationCriteria: [
      "Implement logistic regression for multi-class and binary classification",
      "Apply to both IRIS and 50_Startups datasets",
      "Use proper evaluation metrics",
      "Compare performance with and without scaling",
      "Visualize confusion matrices"
    ],
    hints: [
      "Use appropriate solvers for multi-class problems",
      "Scale features for better convergence",
      "Evaluate using confusion matrix and F1-score",
      "Compare performance between datasets",
      "Consider feature encoding for categorical variables"
    ]
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Exact Advanced Labs Seeder: Connected to MongoDB');
    return conn;
  } catch (error) {
    console.error('❌ Exact Advanced Labs Seeder: MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed exact advanced labs
const seedExactAdvancedLabs = async () => {
  try {
    // Clear existing exact advanced labs
    await mongoose.connection.db.collection('exactadvancedlabs').deleteMany({});
    console.log('🗑️ Cleared existing exact advanced labs');

    // Insert exact advanced labs
    const result = await mongoose.connection.db.collection('exactadvancedlabs').insertMany(exactAdvancedLabs);
    console.log(`✅ Created ${result.insertedCount} exact advanced labs`);

    // Log lab details
    exactAdvancedLabs.forEach((lab, index) => {
      console.log(`\n🔬 Lab ${index + 1}: ${lab.title}`);
      console.log(`   Name: ${lab.name}`);
      console.log(`   Category: ${lab.category}`);
      console.log(`   Difficulty: ${lab.difficulty}/5`);
      console.log(`   Time: ${lab.estimatedTime} minutes`);
      console.log(`   Tags: ${lab.tags.join(', ')}`);
    });

    console.log('\n🎉 Exact advanced labs seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding exact advanced labs:', error);
  }
};

// Main seeder function
const main = async () => {
  await connectDB();
  await seedExactAdvancedLabs();
  process.exit(0);
};

// Run seeder
main();

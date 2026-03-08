import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Advanced ML Labs Seeder
const advancedLabs = [
  // CO1: Forward Feature Selection
  {
    title: "Forward Feature Selection - KDD Cup99",
    description: "Apply forward feature selection to reduce dimensionality of KDD Cup99 dataset while maintaining predictive power",
    difficulty: 4,
    estimatedTime: 90,
    category: "Feature Engineering",
    tags: ["feature-selection", "dimensionality-reduction", "sklearn", "mlxtend"],
    objectives: [
      "Implement forward feature selection algorithm",
      "Analyze KDD Cup99 dataset structure",
      "Evaluate feature importance and model performance",
      "Compare original vs reduced feature sets"
    ],
    prerequisites: [
      "Basic Python programming",
      "Understanding of feature selection concepts",
      "sklearn library familiarity"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from mlxtend.feature_selection import SequentialFeatureSelector
import matplotlib.pyplot as plt

# Load KDD Cup99 dataset (you'll need to download this)
# For demonstration, we'll create a sample dataset
def create_sample_kdd_dataset():
    np.random.seed(42)
    n_samples = 1000
    
    # Simulate network traffic features
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
        'dst_host_same_srv_rate': np.random.exponential(0.3, n_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Create binary target (normal vs attack)
    df['target'] = np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
    
    return df

# Load dataset
df = create_sample_kdd_dataset()

# Separate features and target
X = df.drop('target', axis=1)
y = df['target']

# Convert categorical variables to numerical
X = pd.get_dummies(X, drop_first=True)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Initialize base classifier
rf = RandomForestClassifier(n_estimators=100, random_state=42)

# Forward Feature Selection
print("Starting Forward Feature Selection...")

# Sequential Feature Selector
sfs = SequentialFeatureSelector(
    estimator=rf,
    k_features=10,  # Select top 10 features
    forward=True,
    floating=False,
    scoring='accuracy',
    cv=5
)

# Fit the selector
sfs = sfs.fit(X_train, y_train)

# Get selected features
selected_features = list(sfs.k_feature_idx_)
selected_feature_names = X_train.columns[selected_features]

print(f"Original number of features: {X_train.shape[1]}")
print(f"Selected {len(selected_features)} features:")
for i, feature in enumerate(selected_feature_names):
    print(f"{i+1}. {feature}")

# Transform datasets
X_train_selected = sfs.transform(X_train)
X_test_selected = sfs.transform(X_test)

# Train model with selected features
rf_selected = RandomForestClassifier(n_estimators=100, random_state=42)
rf_selected.fit(X_train_selected, y_train)

# Evaluate with selected features
y_pred_selected = rf_selected.predict(X_test_selected)
accuracy_selected = accuracy_score(y_test, y_pred_selected)

# Train model with all features
rf_all = RandomForestClassifier(n_estimators=100, random_state=42)
rf_all.fit(X_train, y_train)

# Evaluate with all features
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

print("\\nFeature Importance:")
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
    # Load actual KDD Cup99 dataset
    # Download from: http://kdd.ics.uci.edu/databases/kddcup99/kddcup99.html
    df = pd.read_csv('kddcup.data_10_percent.gz', header=None)
    
    # Add column names (simplified version)
    column_names = ['duration', 'protocol_type', 'service', 'flag', 'src_bytes', 'dst_bytes',
                  'land', 'wrong_fragment', 'urgent', 'hot', 'num_failed_logins',
                  'num_compromised', 'root_shell', 'su_attempted', 'num_root',
                  'num_file_creations', 'num_shells', 'num_access_files',
                  'num_outbound_cmds', 'is_host_login', 'is_guest_login',
                  'count', 'srv_count', 'serror_rate', 'rerror_rate',
                  'same_srv_rate', 'diff_srv_rate', 'srv_diff_host_rate',
                  'dst_host_count', 'dst_host_srv_count', 'dst_host_same_src_port_rate',
                  'dst_host_diff_srv_rate', 'dst_host_same_srv_rate', 'dst_host_serror_rate',
                  'dst_host_rerror_rate', 'label']
    
    df.columns = column_names
    
    # Convert labels to binary (normal vs attack)
    df['target'] = df['label'].apply(lambda x: 0 if x == 'normal.' else 1)
    df = df.drop('label', axis=1)
    
    return df

def preprocess_data(df):
    # Handle categorical variables
    categorical_cols = ['protocol_type', 'service', 'flag']
    df_encoded = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
    
    return df_encoded

def evaluate_feature_selection(X_train, X_test, y_train, y_test, max_features=15):
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
    print("Loading KDD Cup99 dataset...")
    df = load_kdd_dataset()
    
    print("Preprocessing data...")
    df_processed = preprocess_data(df)
    
    # Sample subset for faster execution
    df_sample = df_processed.sample(n=5000, random_state=42)
    
    X = df_sample.drop('target', axis=1)
    y = df_sample['target']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )
    
    print("Performing forward feature selection...")
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
      "Reduce dataset from 41+ features to optimal subset",
      "Maintain or improve model performance",
      "Visualize feature selection process",
      "Compare accuracy before and after feature selection"
    ],
    hints: [
      "Start with a small subset of data for faster execution",
      "Use mlxtend library for SequentialFeatureSelector",
      "Monitor cross-validation scores during selection",
      "Consider computational complexity with large datasets",
      "Document which features are most important"
    ]
  },

  // CO1: Backward Feature Elimination
  {
    title: "Backward Feature Elimination - KDD Cup99",
    description: "Apply backward feature elimination to iteratively remove features with minimal impact on model performance",
    difficulty: 4,
    estimatedTime: 90,
    category: "Feature Engineering",
    tags: ["feature-elimination", "dimensionality-reduction", "sklearn", "statsmodels"],
    objectives: [
      "Implement backward feature elimination algorithm",
      "Analyze feature importance and contribution",
      "Iteratively remove least important features",
      "Evaluate model performance at each step"
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

# Create sample dataset (similar to forward selection)
def create_sample_kdd_dataset():
    np.random.seed(42)
    n_samples = 1000
    
    data = {
        'duration': np.random.exponential(100, n_samples),
        'protocol_type': np.random.choice(['tcp', 'udp', 'icmp'], n_samples),
        'service': np.random.choice(['http', 'ftp', 'smtp'], n_samples),
        'src_bytes': np.random.exponential(1000, n_samples),
        'dst_bytes': np.random.exponential(800, n_samples),
        'count': np.random.exponential(50, n_samples),
        'serror_rate': np.random.exponential(0.01, n_samples),
        'rerror_rate': np.random.exponential(0.01, n_samples),
        'same_srv_rate': np.random.exponential(0.5, n_samples),
        'diff_srv_rate': np.random.exponential(0.1, n_samples),
        'dst_host_count': np.random.exponential(10, n_samples),
        'dst_host_srv_count': np.random.exponential(5, n_samples),
        'target': np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
    }
    
    return pd.DataFrame(data)

# Load and preprocess data
df = create_sample_kdd_dataset()
X = pd.get_dummies(df.drop('target', axis=1), drop_first=True)
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

print("Starting Backward Feature Elimination...")

# Initialize the model
rf = RandomForestClassifier(n_estimators=100, random_state=42)

# Recursive Feature Elimination
rfe = RFE(
    estimator=rf,
    n_features_to_select=8,  # Select top 8 features
    step=1  # Remove one feature at a time
)

# Fit RFE
rfe.fit(X_train, y_train)

# Get selected features
selected_features = rfe.support_
feature_ranking = rfe.ranking_
selected_feature_names = X_train.columns[selected_features]

print(f"Original number of features: {X_train.shape[1]}")
print(f"Selected {len(selected_feature_names)} features:")

# Display feature rankings
feature_rankings = pd.DataFrame({
    'feature': X_train.columns,
    'ranking': feature_ranking
}).sort_values('ranking')

print("\\nFeature Rankings:")
print(feature_rankings.head(15))

# Transform datasets
X_train_selected = rfe.transform(X_train)
X_test_selected = rfe.transform(X_test)

# Train and evaluate with selected features
rf_selected = RandomForestClassifier(n_estimators=100, random_state=42)
rf_selected.fit(X_train_selected, y_train)
y_pred = rf_selected.predict(X_test_selected)
accuracy_selected = accuracy_score(y_test, y_pred_selected)

# Train and evaluate with all features
rf_all = RandomForestClassifier(n_estimators=100, random_state=42)
rf_all.fit(X_train, y_train)
y_pred_all = rf_all.predict(X_test)
accuracy_all = accuracy_score(y_test, y_pred_all)

print(f"\\nResults:")
print(f"Accuracy with all features: {accuracy_all:.4f}")
print(f"Accuracy with selected features: {accuracy_selected:.4f}")

# Plot feature rankings
plt.figure(figsize=(12, 8))
plt.bar(range(len(feature_rankings)), feature_rankings['ranking'])
plt.xlabel('Features')
plt.ylabel('Ranking')
plt.title('Feature Rankings (Lower is Better)')
plt.xticks(range(len(feature_rankings)), feature_rankings['feature'], rotation=45)
plt.tight_layout()
plt.show()`,
    solution: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import RFE
from sklearn.linear_model import LogisticRegression
import matplotlib.pyplot as plt

def backward_elimination_with_cv(X_train, y_train, max_features=10):
    """Perform backward elimination with cross-validation"""
    features = list(X_train.columns)
    best_score = 0
    selected_features = features.copy()
    
    print("Starting backward elimination...")
    
    while len(selected_features) > max_features:
        scores = []
        
        # Try removing each feature
        for feature in selected_features:
            temp_features = [f for f in selected_features if f != feature]
            
            if len(temp_features) == 0:
                scores.append(0)
                continue
                
            # Train model without this feature
            rf = RandomForestClassifier(n_estimators=50, random_state=42)
            score = cross_val_score(rf, X_train[temp_features], y_train, cv=3, scoring='accuracy')
            scores.append(score.mean())
        
        # Find feature to remove (highest score when removed)
        scores = np.array(scores)
        feature_to_remove = selected_features[np.argmax(scores)]
        
        print(f"Removing '{feature_to_remove}', CV score: {scores.max():.4f}")
        
        selected_features.remove(feature_to_remove)
        best_score = scores.max()
    
    return selected_features, best_score

def main():
    # Load dataset (same as forward selection)
    df = create_sample_kdd_dataset()
    X = pd.get_dummies(df.drop('target', axis=1), drop_first=True)
    y = df['target']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )
    
    # Perform backward elimination
    final_features, final_score = backward_elimination_with_cv(X_train, y_train, max_features=8)
    
    print(f"\\nFinal selected features ({len(final_features)}):")
    for i, feature in enumerate(final_features):
        print(f"{i+1:2d}. {feature}")
    
    # Train final model
    rf_final = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_final.fit(X_train[final_features], y_train)
    
    # Evaluate
    y_pred = rf_final.predict(X_test[final_features])
    final_accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\\nFinal test accuracy: {final_accuracy:.4f}")
    
    # Compare with all features
    rf_all = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_all.fit(X_train, y_train)
    y_pred_all = rf_all.predict(X_test)
    accuracy_all = accuracy_score(y_test, y_pred_all)
    
    print(f"Accuracy with all features: {accuracy_all:.4f}")
    print(f"Accuracy with selected features: {final_accuracy:.4f}")
    print(f"Improvement: {final_accuracy - accuracy_all:+.4f}")

if __name__ == "__main__":
    main()`,
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
      "Document elimination process and reasoning"
    ]
  },

  // CO2: Linear Regression for House Prediction
  {
    title: "Linear Regression - House Price Prediction",
    description: "Build a linear regression model to predict house prices using features like square footage, location, and number of rooms",
    difficulty: 3,
    estimatedTime: 75,
    category: "Supervised Learning",
    tags: ["linear-regression", "prediction", "housing", "sklearn"],
    objectives: [
      "Implement linear regression from scratch",
      "Preprocess housing dataset features",
      "Train model and evaluate performance",
      "Interpret model coefficients and predictions"
    ],
    prerequisites: [
      "Understanding of linear regression concepts",
      "Basic statistics and probability",
      "Python data analysis skills"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt

# Create sample housing dataset
def create_housing_dataset():
    np.random.seed(42)
    n_samples = 500
    
    # Generate realistic housing data
    data = {
        'sqft_living': np.random.normal(2000, 500, n_samples),
        'bedrooms': np.random.poisson(3, n_samples),
        'bathrooms': np.random.poisson(2, n_samples),
        'stories': np.random.choice([1, 2, 3], n_samples, p=[0.3, 0.5, 0.2]),
        'age': np.random.normal(20, 10, n_samples),
        'distance_city': np.random.exponential(15, n_samples),
        'garage_cars': np.random.poisson(1.5, n_samples),
        'pool': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'price': 50000 + (np.random.normal(2000, 500) * 100) + 
                  (np.random.poisson(3, n_samples) * 10000) +
                  (np.random.poisson(2, n_samples) * 15000) +
                  (np.random.choice([0, 1], n_samples) * 50000)
    }
    
    df = pd.DataFrame(data)
    
    # Add some realistic relationships
    df['price'] += df['sqft_living'] * 100 + df['bedrooms'] * 8000 + df['bathrooms'] * 12000
    df['price'] += np.random.normal(0, 20000, n_samples)  # Add noise
    
    return df

# Load dataset
df = create_housing_dataset()

# Separate features and target
X = df.drop('price', axis=1)
y = df['price']

print("Dataset shape:", X.shape)
print("Features:", X.columns.tolist())

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training Linear Regression model...")

# Create and train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate model
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f"\\nModel Evaluation:")
print(f"Mean Squared Error: {mse:,.2f}")
print(f"Root Mean Squared Error: {rmse:,.2f}")
print(f"R² Score: {r2:.4f}")

# Display coefficients
print("\\nModel Coefficients:")
coefficients = pd.DataFrame({
    'feature': X.columns,
    'coefficient': model.coef_
}).sort_values('coefficient', key=abs, ascending=False)

print(coefficients)
print(f"\\nIntercept: {model.intercept_:,.2f}")

# Visualize predictions
plt.figure(figsize=(12, 5))

# Plot 1: Actual vs Predicted
plt.subplot(1, 2, 1)
plt.scatter(y_test, y_pred, alpha=0.6)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.xlabel('Actual Price')
plt.ylabel('Predicted Price')
plt.title('Actual vs Predicted Prices')

# Plot 2: Residuals
plt.subplot(1, 2, 2)
residuals = y_test - y_pred
plt.scatter(y_pred, residuals, alpha=0.6)
plt.axhline(y=0, color='r', linestyle='--')
plt.xlabel('Predicted Price')
plt.ylabel('Residuals')
plt.title('Residual Plot')

plt.tight_layout()
plt.show()

# Example prediction
example_house = np.array([[2000, 3, 2, 2, 15, 2, 1, 0]])
predicted_price = model.predict(example_house)
print(f"\\nExample Prediction:")
print(f"House features: 2000 sqft, 3 bedrooms, 2 bathrooms, 2 stories, 15 years old, 2 garage cars, pool")
print(f"Predicted price: ${predicted_price[0]:,.2f}")`,
    solution: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

def load_boston_housing():
    """Load Boston Housing dataset"""
    from sklearn.datasets import fetch_california_housing
    
    # Use California Housing (Boston is deprecated)
    housing = fetch_california_housing()
    df = pd.DataFrame(housing.data, columns=housing.feature_names)
    df['price'] = housing.target * 100000  # Convert to dollars
    
    return df

def preprocess_housing_data(df):
    """Preprocess housing data"""
    # Handle missing values
    df = df.dropna()
    
    # Remove outliers (optional)
    Q1 = df['price'].quantile(0.25)
    Q3 = df['price'].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    df = df[(df['price'] >= lower_bound) & (df['price'] <= upper_bound)]
    
    return df

def evaluate_model(model, X_train, X_test, y_train, y_test):
    """Evaluate regression model"""
    y_pred = model.predict(X_test)
    
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    return {
        'mse': mse,
        'rmse': rmse,
        'mae': mae,
        'r2': r2
    }

def main():
    print("Loading housing dataset...")
    df = load_boston_housing()
    
    print("Preprocessing data...")
    df_processed = preprocess_housing_data(df)
    
    X = df_processed.drop('price', axis=1)
    y = df_processed['price']
    
    print(f"Dataset shape: {df_processed.shape}")
    print(f"Features: {X.columns.tolist()}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train different models
    models = {
        'Linear Regression': LinearRegression(),
        'Ridge Regression': Ridge(alpha=1.0),
        'Lasso Regression': Lasso(alpha=1.0)
    }
    
    results = {}
    
    for name, model in models.items():
        print(f"\\nTraining {name}...")
        
        if name == 'Linear Regression':
            model.fit(X_train, y_train)
            X_test_used = X_test
        else:
            model.fit(X_train_scaled, y_train)
            X_test_used = X_test_scaled
        
        # Evaluate
        metrics = evaluate_model(model, X_train, X_test_used, y_train, y_test)
        results[name] = metrics
        
        print(f"{name} Results:")
        print(f"  RMSE: ${metrics['rmse']:,.2f}")
        print(f"  MAE: ${metrics['mae']:,.2f}")
        print(f"  R²: {metrics['r2']:.4f}")
    
    # Feature importance (for linear models)
    best_model = LinearRegression()
    best_model.fit(X_train, y_train)
    
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'coefficient': best_model.coef_
    }).sort_values('coefficient', key=abs, ascending=False)
    
    print("\\nFeature Importance (Linear Regression):")
    print(feature_importance.head(10))
    
    # Visualize results
    plt.figure(figsize=(15, 10))
    
    # Plot 1: Model comparison
    plt.subplot(2, 3, 1)
    model_names = list(results.keys())
    rmse_values = [results[name]['rmse'] for name in model_names]
    plt.bar(model_names, rmse_values)
    plt.title('RMSE Comparison')
    plt.ylabel('RMSE ($)')
    plt.xticks(rotation=45)
    
    # Plot 2: R² comparison
    plt.subplot(2, 3, 2)
    r2_values = [results[name]['r2'] for name in model_names]
    plt.bar(model_names, r2_values)
    plt.title('R² Comparison')
    plt.ylabel('R² Score')
    plt.xticks(rotation=45)
    
    # Plot 3: Feature coefficients
    plt.subplot(2, 3, 3)
    top_features = feature_importance.head(5)
    plt.barh(top_features['feature'], top_features['coefficient'])
    plt.title('Top 5 Features')
    plt.xlabel('Coefficient Value')
    
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    main()`,
    evaluationCriteria: [
      "Implement linear regression model correctly",
      "Preprocess housing data appropriately",
      "Evaluate model using MSE, RMSE, and R²",
      "Interpret model coefficients",
      "Visualize predictions and residuals"
    ],
    hints: [
      "Check for missing values and outliers",
      "Use StandardScaler for better convergence",
      "Try Ridge or Lasso for regularization",
      "Visualize residuals to check assumptions",
      "Consider feature engineering for better performance"
    ]
  },

  // CO2: Logistic Regression for Classification
  {
    title: "Logistic Regression - Classification",
    description: "Implement logistic regression for classification tasks including IRIS and 50_Startups datasets",
    difficulty: 3,
    estimatedTime: 80,
    category: "Supervised Learning",
    tags: ["logistic-regression", "classification", "iris", "startups", "sklearn"],
    objectives: [
      "Implement logistic regression from scratch",
      "Apply to IRIS flower classification",
      "Apply to 50_Startups success prediction",
      "Evaluate using confusion matrix and F1-score",
      "Compare performance with and without feature scaling"
    ],
    prerequisites: [
      "Understanding of logistic regression concepts",
      "Classification evaluation metrics",
      "Probability and statistics basics"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns

# Part I: IRIS Dataset
print("=" * 50)
print("PART I: IRIS DATASET CLASSIFICATION")
print("=" * 50)

# Load IRIS dataset
from sklearn.datasets import load_iris
iris = load_iris()
X_iris = iris.data
y_iris = iris.target

print(f"IRIS Dataset Shape: {X_iris.shape}")
print(f"Classes: {iris.target_names}")

# Split IRIS data
X_train_iris, X_test_iris, y_train_iris, y_test_iris = train_test_split(
    X_iris, y_iris, test_size=0.3, random_state=42, stratify=y_iris
)

# Scale features
scaler_iris = StandardScaler()
X_train_iris_scaled = scaler_iris.fit_transform(X_train_iris)
X_test_iris_scaled = scaler_iris.transform(X_test_iris)

# Train logistic regression on IRIS
print("Training Logistic Regression on IRIS dataset...")
lr_iris = LogisticRegression(random_state=42)
lr_iris.fit(X_train_iris_scaled, y_train_iris)

# Predictions
y_pred_iris = lr_iris.predict(X_test_iris_scaled)

# Evaluate IRIS
accuracy_iris = accuracy_score(y_test_iris, y_pred_iris)
cm_iris = confusion_matrix(y_test_iris, y_pred_iris)

print(f"IRIS Accuracy: {accuracy_iris:.4f}")
print("\\nIRIS Confusion Matrix:")
print(cm_iris)
print("\\nIRIS Classification Report:")
print(classification_report(y_test_iris, y_pred_iris, target_names=iris.target_names))

# Part II: 50_Startups Dataset
print("\\n" + "=" * 50)
print("PART II: 50_STARTUPS DATASET")
print("=" * 50)

# Create sample 50_Startups dataset
def create_startups_dataset():
    np.random.seed(42)
    n_samples = 200
    
    data = {
        'rd_spend': np.random.exponential(50000, n_samples),
        'administration': np.random.exponential(20000, n_samples),
        'marketing_spend': np.random.exponential(30000, n_samples),
        'state': np.random.choice(['California', 'New York', 'Texas', 'Florida'], n_samples),
        'category': np.random.choice(['Software', 'Hardware', 'Biotech', 'E-commerce'], n_samples),
        'funding_rounds': np.random.poisson(2, n_samples),
        'has_patents': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'team_size': np.random.exponential(15, n_samples),
        'years_to_exit': np.random.exponential(5, n_samples),
        'success': np.random.choice([0, 1], n_samples, p=[0.6, 0.4])
    }
    
    df = pd.DataFrame(data)
    
    # Add realistic relationships
    df['success'] = (
        (df['rd_spend'] > 30000).astype(int) * 0.3 +
        (df['funding_rounds'] > 1).astype(int) * 0.2 +
        (df['has_patents'] == 1).astype(int) * 0.2 +
        (df['team_size'] > 10).astype(int) * 0.2 +
        np.random.choice([0, 1], n_samples, p=[0.4, 0.6])
    )
    
    df['success'] = (df['success'] > 0.5).astype(int)
    
    return df

# Load startups dataset
df_startups = create_startups_dataset()

# Preprocess startups data
def preprocess_startups(df):
    # Encode categorical variables
    df_encoded = pd.get_dummies(df, columns=['state', 'category'], drop_first=True)
    
    return df_encoded

df_startups_processed = preprocess_startups(df_startups)
X_startups = df_startups_processed.drop('success', axis=1)
y_startups = df_startups_processed['success']

# Split startups data
X_train_start, X_test_start, y_train_start, y_test_start = train_test_split(
    X_startups, y_startups, test_size=0.3, random_state=42, stratify=y_startups
)

# Compare with and without scaling
print("Comparing with and without feature scaling...")

# Without scaling
print("\\n1. Without Feature Scaling:")
lr_start_no_scale = LogisticRegression(random_state=42)
lr_start_no_scale.fit(X_train_start, y_train_start)
y_pred_no_scale = lr_start_no_scale.predict(X_test_start)
accuracy_no_scale = accuracy_score(y_test_start, y_pred_no_scale)

# With scaling
print("2. With Feature Scaling:")
scaler_start = StandardScaler()
X_train_start_scaled = scaler_start.fit_transform(X_train_start)
X_test_start_scaled = scaler_start.transform(X_test_start)

lr_start_scaled = LogisticRegression(random_state=42)
lr_start_scaled.fit(X_train_start_scaled, y_train_start)
y_pred_scaled = lr_start_scaled.predict(X_test_start_scaled)
accuracy_scaled = accuracy_score(y_test_start, y_pred_scaled)

print(f"Startups Accuracy (No Scaling): {accuracy_no_scale:.4f}")
print(f"Startups Accuracy (With Scaling): {accuracy_scaled:.4f}")
print(f"Improvement with scaling: {accuracy_scaled - accuracy_no_scale:+.4f}")

# Visualize confusion matrix for startups
plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
cm_start = confusion_matrix(y_test_start, y_pred_scaled)
sns.heatmap(cm_start, annot=True, fmt='d', cmap='Blues')
plt.title('Startups Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('Actual')

# Feature importance comparison
plt.subplot(1, 2, 2)
feature_names = ['rd_spend', 'administration', 'marketing_spend', 'funding_rounds', 
                'has_patents', 'team_size', 'years_to_exit']
coefficients = lr_start_scaled.coef_[0][:len(feature_names)]
plt.barh(feature_names, np.abs(coefficients))
plt.title('Feature Importance (Startups)')
plt.xlabel('Absolute Coefficient Value')

plt.tight_layout()
plt.show()`,
    solution: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score, f1_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
import matplotlib.pyplot as plt
import seaborn as sns

def load_iris_dataset():
    """Load and prepare IRIS dataset"""
    from sklearn.datasets import load_iris
    
    iris = load_iris()
    X = iris.data
    y = iris.target
    
    return X, y, iris.target_names

def load_startups_dataset():
    """Load and prepare 50_Startups dataset"""
    # Create realistic startups dataset
    np.random.seed(42)
    n_samples = 500
    
    data = {
        'rd_spend': np.random.exponential(80000, n_samples),
        'administration': np.random.exponential(25000, n_samples),
        'marketing_spend': np.random.exponential(40000, n_samples),
        'state': np.random.choice(['CA', 'NY', 'TX', 'FL', 'WA'], n_samples),
        'category': np.random.choice(['Software', 'Hardware', 'Biotech', 'E-commerce', 'FinTech'], n_samples),
        'funding_rounds': np.random.poisson(3, n_samples),
        'has_patents': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
        'team_size': np.random.exponential(20, n_samples),
        'years_to_exit': np.random.exponential(6, n_samples),
        'success': np.random.choice([0, 1], n_samples, p=[0.5, 0.5])
    }
    
    df = pd.DataFrame(data)
    
    # Create realistic success probability
    success_prob = (
        np.log1p(df['rd_spend']) / 15 +
        np.log1p(df['funding_rounds']) / 3 +
        df['has_patents'] * 0.3 +
        (df['team_size'] > 15) * 0.2 +
        np.random.normal(0, 0.3, n_samples)
    )
    
    df['success'] = (success_prob > 0.5).astype(int)
    
    return df

def evaluate_logistic_regression(X_train, X_test, y_train, y_test, dataset_name):
    """Evaluate logistic regression model"""
    
    # Hyperparameter tuning
    param_grid = {
        'C': [0.001, 0.01, 0.1, 1, 10, 100],
        'penalty': ['l1', 'l2'],
        'solver': ['liblinear', 'lbfgs']
    }
    
    lr = LogisticRegression(random_state=42, max_iter=1000)
    grid_search = GridSearchCV(lr, param_grid, cv=5, scoring='accuracy')
    grid_search.fit(X_train, y_train)
    
    best_lr = grid_search.best_estimator_
    
    # Predictions
    y_pred = best_lr.predict(X_test)
    
    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, average='weighted')
    cm = confusion_matrix(y_test, y_pred)
    
    print(f"\\n{dataset_name} Results:")
    print(f"Best Parameters: {grid_search.best_params_}")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"F1-Score: {f1:.4f}")
    
    return {
        'accuracy': accuracy,
        'f1': f1,
        'confusion_matrix': cm,
        'best_params': grid_search.best_params_,
        'model': best_lr
    }

def visualize_results(iris_results, startups_results):
    """Visualize results for both datasets"""
    
    plt.figure(figsize=(15, 10))
    
    # IRIS Confusion Matrix
    plt.subplot(2, 3, 1)
    sns.heatmap(iris_results['confusion_matrix'], annot=True, fmt='d', cmap='Blues',
                xticklabels=['Setosa', 'Versicolor', 'Virginica'],
                yticklabels=['Setosa', 'Versicolor', 'Virginica'])
    plt.title('IRIS Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    
    # Startups Confusion Matrix
    plt.subplot(2, 3, 2)
    sns.heatmap(startups_results['confusion_matrix'], annot=True, fmt='d', cmap='Reds',
                xticklabels=['Failed', 'Succeeded'],
                yticklabels=['Failed', 'Succeeded'])
    plt.title('Startups Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    
    # Accuracy Comparison
    plt.subplot(2, 3, 3)
    datasets = ['IRIS', 'Startups']
    accuracies = [iris_results['accuracy'], startups_results['accuracy']]
    plt.bar(datasets, accuracies, color=['skyblue', 'lightcoral'])
    plt.title('Accuracy Comparison')
    plt.ylabel('Accuracy')
    plt.ylim(0, 1)
    
    plt.tight_layout()
    plt.show()

def main():
    print("Logistic Regression Classification")
    print("=" * 50)
    
    # IRIS Dataset
    print("\\n1. IRIS Dataset Analysis")
    print("-" * 30)
    
    X_iris, y_iris, target_names = load_iris_dataset()
    X_train_iris, X_test_iris, y_train_iris, y_test_iris = train_test_split(
        X_iris, y_iris, test_size=0.3, random_state=42, stratify=y_iris
    )
    
    # Scale IRIS features
    scaler_iris = StandardScaler()
    X_train_iris_scaled = scaler_iris.fit_transform(X_train_iris)
    X_test_iris_scaled = scaler_iris.transform(X_test_iris)
    
    iris_results = evaluate_logistic_regression(
        X_train_iris_scaled, X_test_iris_scaled, y_train_iris, y_test_iris, "IRIS"
    )
    
    # Startups Dataset
    print("\\n2. 50_Startups Dataset Analysis")
    print("-" * 30)
    
    df_startups = load_startups_dataset()
    
    # Preprocess startups data
    df_startups_encoded = pd.get_dummies(df_startups, columns=['state', 'category'], drop_first=True)
    X_startups = df_startups_encoded.drop('success', axis=1)
    y_startups = df_startups_encoded['success']
    
    X_train_start, X_test_start, y_train_start, y_test_start = train_test_split(
        X_startups, y_startups, test_size=0.3, random_state=42, stratify=y_startups
    )
    
    # Scale startups features
    scaler_start = StandardScaler()
    X_train_start_scaled = scaler_start.fit_transform(X_train_start)
    X_test_start_scaled = scaler_start.transform(X_test_start)
    
    startups_results = evaluate_logistic_regression(
        X_train_start_scaled, X_test_start_scaled, y_train_start, y_test_start, "Startups"
    )
    
    # Visualize results
    visualize_results(iris_results, startups_results)

if __name__ == "__main__":
    main()`,
    evaluationCriteria: [
      "Implement logistic regression correctly",
      "Handle both IRIS and 50_Startups datasets",
      "Apply proper preprocessing and scaling",
      "Evaluate using confusion matrix and F1-score",
      "Compare performance with/without feature scaling"
    ],
    hints: [
      "Use StandardScaler for better convergence",
      "Try different regularization parameters",
      "Handle class imbalance if present",
      "Use cross-validation for robust evaluation",
      "Visualize confusion matrix for interpretation"
    ]
  },

  // CO3: Decision Tree ID3 Algorithm
  {
    title: "Decision Tree - ID3 Algorithm",
    description: "Implement decision tree-based ID3 algorithm for classification using Weather dataset",
    difficulty: 4,
    estimatedTime: 100,
    category: "Supervised Learning",
    tags: ["decision-tree", "id3", "classification", "weather-dataset"],
    objectives: [
      "Implement ID3 algorithm from scratch",
      "Calculate information gain and entropy",
      "Build decision tree structure",
      "Classify new samples based on tree",
      "Display tree structure visually"
    ],
    prerequisites: [
      "Understanding of decision tree concepts",
      "Information theory basics (entropy, information gain)",
      "Recursive algorithm implementation"
    ],
    starterCode: `import pandas as pd
import numpy as np
from collections import Counter
import matplotlib.pyplot as plt
import matplotlib.patches as patches

class DecisionNode:
    def __init__(self, feature=None, threshold=None, value=None, left=None, right=None):
        self.feature = feature
        self.threshold = threshold
        self.value = value
        self.left = left
        self.right = right
        
    def is_leaf(self):
        return self.left is None and self.right is None

class ID3DecisionTree:
    def __init__(self, max_depth=3):
        self.max_depth = max_depth
        self.root = None
    
    def calculate_entropy(self, y):
        """Calculate entropy of a dataset"""
        value_counts = Counter(y)
        probabilities = np.array(list(value_counts.values())) / len(y)
        entropy = -np.sum(probabilities * np.log2(probabilities + 1e-10))
        return entropy
    
    def calculate_information_gain(self, X, y, feature, threshold):
        """Calculate information gain for a split"""
        # Parent entropy
        parent_entropy = self.calculate_entropy(y)
        
        # Split data
        left_mask = X[:, feature] <= threshold
        right_mask = X[:, feature] > threshold
        
        if len(left_mask) == 0 or len(right_mask) == 0:
            return 0
        
        # Child entropy
        left_entropy = self.calculate_entropy(y[left_mask])
        right_entropy = self.calculate_entropy(y[right_mask])
        
        # Weighted average
        n_left, n_right = len(left_mask), len(right_mask)
        n_total = len(y)
        
        child_entropy = (n_left / n_total) * left_entropy + (n_right / n_total) * right_entropy
        
        # Information gain
        return parent_entropy - child_entropy
    
    def find_best_split(self, X, y):
        """Find the best feature and threshold to split"""
        best_gain = 0
        best_feature = None
        best_threshold = None
        
        n_features = X.shape[1]
        
        for feature in range(n_features):
            unique_values = np.unique(X[:, feature])
            
            for threshold in unique_values:
                gain = self.calculate_information_gain(X, y, feature, threshold)
                
                if gain > best_gain:
                    best_gain = gain
                    best_feature = feature
                    best_threshold = threshold
        
        return best_feature, best_threshold, best_gain
    
    def build_tree(self, X, y, depth=0):
        """Recursively build the decision tree"""
        # Stopping conditions
        if depth >= self.max_depth or len(np.unique(y)) == 1:
            leaf_value = Counter(y).most_common(1)[0][0]
            return DecisionNode(value=leaf_value)
        
        # Find best split
        best_feature, best_threshold, best_gain = self.find_best_split(X, y)
        
        # If no improvement, create leaf
        if best_gain == 0:
            leaf_value = Counter(y).most_common(1)[0][0]
            return DecisionNode(value=leaf_value)
        
        # Split data
        left_mask = X[:, best_feature] <= best_threshold
        right_mask = X[:, best_feature] > best_threshold
        
        # Recursively build subtrees
        left_subtree = self.build_tree(X[left_mask], y[left_mask], depth + 1)
        right_subtree = self.build_tree(X[right_mask], y[right_mask], depth + 1)
        
        return DecisionNode(
            feature=best_feature,
            threshold=best_threshold,
            left=left_subtree,
            right=right_subtree
        )
    
    def fit(self, X, y):
        """Train the decision tree"""
        self.root = self.build_tree(np.array(X), np.array(y))
    
    def predict_sample(self, x, node):
        """Predict a single sample"""
        if node.is_leaf():
            return node.value
        
        if x[node.feature] <= node.threshold:
            return self.predict_sample(x, node.left)
        else:
            return self.predict_sample(x, node.right)
    
    def predict(self, X):
        """Predict multiple samples"""
        return [self.predict_sample(x, self.root) for x in X]
    
    def print_tree(self, node=None, depth=0, feature_names=None):
        """Print the tree structure"""
        if node is None:
            node = self.root
        
        indent = "  " * depth
        
        if node.is_leaf():
            print(f"{indent}Predict: {node.value}")
            return
        
        feature_name = f"Feature {node.feature}"
        if feature_names:
            feature_name = feature_names[node.feature]
        
        print(f"{indent}{feature_name} <= {node.threshold}")
        self.print_tree(node.left, depth + 1, feature_names)
        self.print_tree(node.right, depth + 1, feature_names)

# Create Weather dataset
def create_weather_dataset():
    data = {
        'outlook': ['sunny', 'sunny', 'overcast', 'rainy', 'rainy', 'overcast', 'sunny', 'rainy'],
        'temperature': ['hot', 'hot', 'mild', 'cool', 'mild', 'hot', 'cool', 'mild'],
        'humidity': ['high', 'high', 'normal', 'high', 'normal', 'normal', 'high'],
        'windy': ['weak', 'strong', 'weak', 'weak', 'strong', 'weak', 'strong'],
        'play': ['no', 'no', 'yes', 'yes', 'yes', 'no', 'yes']
    }
    
    df = pd.DataFrame(data)
    return df

# Load dataset
df = create_weather_dataset()
print("Weather Dataset:")
print(df)

# Prepare data
feature_names = ['outlook', 'temperature', 'humidity', 'windy']
X = pd.get_dummies(df[feature_names], drop_first=True).values
y = df['play'].apply(lambda x: 1 if x == 'yes' else 0).values

print(f"\\nFeatures: {feature_names}")
print(f"Target: play (yes/no)")

# Split data
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Train ID3 Decision Tree
print("\\nTraining ID3 Decision Tree...")
tree = ID3DecisionTree(max_depth=3)
tree.fit(X_train, y_train)

# Print tree structure
print("\\nDecision Tree Structure:")
print("=" * 30)
tree.print_tree(feature_names=feature_names)
print("=" * 30)

# Make predictions
y_pred = tree.predict(X_test)

# Evaluate
from sklearn.metrics import accuracy_score
accuracy = accuracy_score(y_test, y_pred)
print(f"\\nTest Accuracy: {accuracy:.4f}")

# Test with new samples
print("\\nTesting with new samples:")
test_samples = [
    ['sunny', 'hot', 'high', 'weak'],
    ['overcast', 'mild', 'normal', 'strong'],
    ['rainy', 'cool', 'normal', 'weak']
]

# Convert test samples
test_encoded = []
for sample in test_samples:
    sample_df = pd.DataFrame([sample], columns=feature_names)
    sample_encoded = pd.get_dummies(sample_df, drop_first=True).reindex(columns=pd.get_dummies(df[feature_names], drop_first=True).columns, fill_value=0).values[0]
    test_encoded.append(sample_encoded)

predictions = tree.predict(test_encoded)

for i, (sample, prediction) in enumerate(zip(test_samples, predictions)):
    result = "yes" if prediction == 1 else "no"
    print(f"Sample {i+1}: {sample} -> Predict: {result}")

# Visualize tree structure (simplified)
def plot_decision_tree():
    plt.figure(figsize=(10, 6))
    plt.text(0.5, 0.9, "Decision Tree (ID3)", fontsize=16, ha='center')
    plt.text(0.5, 0.8, "outlook", fontsize=12, ha='center')
    plt.text(0.3, 0.7, "sunny", fontsize=10, ha='center')
    plt.text(0.7, 0.7, "overcast/rainy", fontsize=10, ha='center')
    plt.text(0.3, 0.5, "humidity", fontsize=12, ha='center')
    plt.text(0.7, 0.5, "windy", fontsize=12, ha='center')
    plt.text(0.5, 0.3, "play", fontsize=12, ha='center')
    plt.text(0.3, 0.3, "yes", fontsize=10, ha='center')
    plt.text(0.7, 0.3, "no", fontsize=10, ha='center')
    
    # Draw simple tree structure
    plt.plot([0.5, 0.5], [0.8, 0.6], 'k-', linewidth=2)
    plt.plot([0.3, 0.7], [0.6, 0.4], 'k-', linewidth=2)
    plt.plot([0.7, 0.7], [0.6, 0.4], 'k-', linewidth=2)
    plt.plot([0.3, 0.4], [0.2, 0.1], 'k-', linewidth=2)
    plt.plot([0.7, 0.4], [0.2, 0.1], 'k-', linewidth=2)
    
    plt.xlim(0, 1)
    plt.ylim(0, 1)
    plt.axis('off')
    plt.title('Simplified Decision Tree Structure')
    plt.show()

plot_decision_tree()`,
    solution: `import pandas as pd
import numpy as np
from collections import Counter
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt
import matplotlib.patches as patches

class DecisionNode:
    def __init__(self, feature=None, threshold=None, value=None, left=None, right=None, info_gain=0):
        self.feature = feature
        self.threshold = threshold
        self.value = value
        self.left = left
        self.right = right
        self.info_gain = info_gain
    
    def is_leaf(self):
        return self.left is None and self.right is None

class ID3DecisionTree:
    def __init__(self, max_depth=5, min_samples_split=2):
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.root = None
        self.feature_names = None
    
    def calculate_entropy(self, y):
        """Calculate entropy of dataset"""
        if len(y) == 0:
            return 0
        
        value_counts = Counter(y)
        probabilities = np.array(list(value_counts.values())) / len(y)
        entropy = -np.sum(probabilities * np.log2(probabilities + 1e-10))
        return entropy
    
    def calculate_information_gain(self, X, y, feature, threshold):
        """Calculate information gain for split"""
        n_samples = len(y)
        
        # Split data
        left_indices = X[:, feature] <= threshold
        right_indices = X[:, feature] > threshold
        
        n_left = np.sum(left_indices)
        n_right = np.sum(right_indices)
        
        if n_left == 0 or n_right == 0:
            return 0
        
        # Calculate entropies
        parent_entropy = self.calculate_entropy(y)
        left_entropy = self.calculate_entropy(y[left_indices])
        right_entropy = self.calculate_entropy(y[right_indices])
        
        # Weighted entropy
        child_entropy = (n_left / n_samples) * left_entropy + (n_right / n_samples) * right_entropy
        
        # Information gain
        return parent_entropy - child_entropy
    
    def find_best_split(self, X, y):
        """Find best split for current node"""
        best_gain = 0
        best_feature = None
        best_threshold = None
        
        n_features = X.shape[1]
        
        for feature in range(n_features):
            unique_values = np.unique(X[:, feature])
            
            # Try all possible thresholds
            for threshold in unique_values:
                gain = self.calculate_information_gain(X, y, feature, threshold)
                
                if gain > best_gain:
                    best_gain = gain
                    best_feature = feature
                    best_threshold = threshold
        
        return best_feature, best_threshold, best_gain
    
    def build_tree(self, X, y, depth=0, parent_samples=None):
        """Recursively build decision tree"""
        n_samples = len(y)
        n_classes = len(np.unique(y))
        
        # Stopping conditions
        if (depth >= self.max_depth or 
            n_classes == 1 or 
            n_samples < self.min_samples_split):
            
            leaf_value = Counter(y).most_common(1)[0][0]
            return DecisionNode(value=leaf_value)
        
        # Find best split
        best_feature, best_threshold, best_gain = self.find_best_split(X, y)
        
        # If no information gain, create leaf
        if best_gain == 0:
            leaf_value = Counter(y).most_common(1)[0][0]
            return DecisionNode(value=leaf_value)
        
        # Split data
        left_indices = X[:, best_feature] <= best_threshold
        right_indices = X[:, best_feature] > best_threshold
        
        # Build subtrees
        left_subtree = self.build_tree(
            X[left_indices], y[left_indices], depth + 1, n_samples
        )
        right_subtree = self.build_tree(
            X[right_indices], y[right_indices], depth + 1, n_samples
        )
        
        return DecisionNode(
            feature=best_feature,
            threshold=best_threshold,
            left=left_subtree,
            right=right_subtree,
            info_gain=best_gain
        )
    
    def fit(self, X, y, feature_names=None):
        """Train the decision tree"""
        self.feature_names = feature_names
        self.root = self.build_tree(np.array(X), np.array(y))
    
    def predict_sample(self, x, node):
        """Predict single sample"""
        if node.is_leaf():
            return node.value
        
        if x[node.feature] <= node.threshold:
            return self.predict_sample(x, node.left)
        else:
            return self.predict_sample(x, node.right)
    
    def predict(self, X):
        """Predict multiple samples"""
        return [self.predict_sample(x, self.root) for x in X]
    
    def print_tree(self, node=None, depth=0):
        """Print tree structure"""
        if node is None:
            node = self.root
        
        indent = "  " * depth
        
        if node.is_leaf():
            print(f"{indent}LEAF: {node.value}")
            return
        
        feature_name = f"X{node.feature}"
        if self.feature_names:
            feature_name = self.feature_names[node.feature]
        
        print(f"{indent}{feature_name} <= {node.threshold} (IG: {node.info_gain:.3f})")
        self.print_tree(node.left, depth + 1)
        self.print_tree(node.right, depth + 1)

def load_weather_dataset():
    """Load weather dataset"""
    data = {
        'outlook': ['sunny', 'sunny', 'overcast', 'rainy', 'rainy', 'overcast', 'sunny', 'rainy', 
                   'sunny', 'overcast', 'rainy', 'sunny'],
        'temperature': ['hot', 'hot', 'mild', 'cool', 'mild', 'hot', 'cool', 'mild', 'hot',
                     'mild', 'cool', 'hot', 'mild'],
        'humidity': ['high', 'high', 'normal', 'high', 'normal', 'normal', 'high', 'high',
                   'normal', 'high', 'normal', 'high'],
        'windy': ['weak', 'strong', 'weak', 'weak', 'strong', 'weak', 'strong', 'weak',
                  'strong', 'weak', 'strong', 'weak'],
        'play': ['no', 'no', 'yes', 'yes', 'yes', 'no', 'yes', 'no', 'yes', 'no',
                 'yes', 'no', 'yes', 'no', 'yes']
    }
    
    return pd.DataFrame(data)

def main():
    print("ID3 Decision Tree Algorithm")
    print("=" * 50)
    
    # Load and prepare data
    df = load_weather_dataset()
    
    feature_names = ['outlook', 'temperature', 'humidity', 'windy']
    X = pd.get_dummies(df[feature_names], drop_first=True).values
    y = df['play'].apply(lambda x: 1 if x == 'yes' else 0).values
    
    print(f"Dataset shape: {X.shape}")
    print(f"Features: {feature_names}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )
    
    # Train tree
    print("\\nTraining ID3 Decision Tree...")
    tree = ID3DecisionTree(max_depth=4)
    tree.fit(X_train, y_train, feature_names=feature_names)
    
    # Print tree structure
    print("\\nDecision Tree Structure:")
    print("=" * 40)
    tree.print_tree()
    print("=" * 40)
    
    # Make predictions
    y_pred = tree.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\\nTest Accuracy: {accuracy:.4f}")
    print("\\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Test with new samples
    print("\\nTesting new samples:")
    test_cases = [
        ['sunny', 'hot', 'high', 'weak'],
        ['overcast', 'mild', 'normal', 'strong'],
        ['rainy', 'cool', 'normal', 'weak']
    ]
    
    for i, case in enumerate(test_cases):
        case_df = pd.DataFrame([case], columns=feature_names)
        case_encoded = pd.get_dummies(case_df, drop_first=True)
        case_encoded = case_encoded.reindex(
            columns=pd.get_dummies(df[feature_names], drop_first=True).columns, 
            fill_value=0
        ).values[0]
        
        prediction = tree.predict([case_encoded])[0]
        result = "yes" if prediction == 1 else "no"
        print(f"Case {i+1}: {case} -> {result}")

if __name__ == "__main__":
    main()`,
    evaluationCriteria: [
      "Implement ID3 algorithm correctly",
      "Calculate entropy and information gain",
      "Build decision tree recursively",
      "Handle categorical variables properly",
      "Classify new samples based on tree",
      "Display tree structure clearly"
    ],
    hints: [
      "Start with simple dataset (Weather) for testing",
      "Implement entropy calculation first",
      "Use recursion for tree building",
      "Add stopping conditions to prevent overfitting",
      "Test tree with sample inputs"
    ]
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Advanced Labs Seeder: Connected to MongoDB');
    return conn;
  } catch (error) {
    console.error('❌ Advanced Labs Seeder: MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed advanced labs
const seedAdvancedLabs = async () => {
  try {
    // Clear existing advanced labs
    await mongoose.connection.db.collection('advancedlabs').deleteMany({});
    console.log('🗑️ Cleared existing advanced labs');

    // Insert advanced labs
    const result = await mongoose.connection.db.collection('advancedlabs').insertMany(advancedLabs);
    console.log(`✅ Created ${result.insertedCount} advanced labs`);

    // Log lab details
    advancedLabs.forEach((lab, index) => {
      console.log(`\n🔬 Lab ${index + 1}: ${lab.title}`);
      console.log(`   Category: ${lab.category}`);
      console.log(`   Difficulty: ${lab.difficulty}/5`);
      console.log(`   Time: ${lab.estimatedTime} minutes`);
      console.log(`   Tags: ${lab.tags.join(', ')}`);
    });

    console.log('\n🎉 Advanced labs seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding advanced labs:', error);
  }
};

// Main seeder function
const main = async () => {
  await connectDB();
  await seedAdvancedLabs();
  process.exit(0);
};

// Run seeder
main();

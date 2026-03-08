import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Lab from "../models/Lab.js";
import Module from "../models/Module.js";

dotenv.config();
await connectDB();

const createComprehensiveLabs = async () => {
  try {
    console.log("🔬 Creating comprehensive AIML labs...\n");

    // Clear existing labs
    await Lab.deleteMany({});
    console.log("🗑️ Cleared existing labs");

    // Get modules
    const modules = await Module.find();
    console.log(`✅ Found ${modules.length} modules`);

    const labsData = [];

    // Lab 1: Forward Feature Selection
    labsData.push({
      title: "Forward Feature Selection with KDD Cup99",
      description: "Apply forward feature selection technique to reduce dimensionality of KDD Cup99 dataset. Incrementally select features that improve model performance.",
      objectives: [
        "Understand forward feature selection methodology",
        "Implement feature selection on KDD Cup99 dataset",
        "Evaluate model performance with reduced features",
        "Compare computational efficiency before and after selection"
      ],
      difficulty: 3,
      estimatedTime: 90,
      tags: ["feature-selection", "dimensionality-reduction", "kdd-cup99", "sklearn"],
      scenario: "both",
      environment: "simulated",
      skills: ["Python", "Scikit-learn", "Feature Engineering", "Data Analysis"],
      content: {
        introduction: "Forward feature selection is a wrapper method that builds a feature set by starting with no features and adding features one at a time based on model performance improvement.",
        theory: "The algorithm evaluates each feature individually, selects the best performing feature, then iteratively adds the next best feature that improves model performance.",
        steps: [
          "Load and preprocess KDD Cup99 dataset",
          "Implement forward feature selection using SequentialFeatureSelector",
          "Train model with selected features",
          "Compare performance metrics",
          "Analyze computational efficiency"
        ],
        code: `# Forward Feature Selection Implementation
import pandas as pd
import numpy as np
from sklearn.feature_selection import SequentialFeatureSelector
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Load KDD Cup99 dataset
def load_kdd_data():
    # Sample implementation - replace with actual dataset loading
    url = "http://kdd.ics.uci.edu/databases/kddcup99/kddcup.data.gz"
    column_names = ['duration','protocol_type','service','flag','src_bytes','dst_bytes','land','wrong_fragment','urgent','hot','num_failed_logins','logged_in','num_compromised','root_shell','su_attempted','num_root','num_file_creations','num_shells','num_access_files','num_outbound_cmds','is_host_login','is_guest_login','count','srv_count','serror_rate','srv_serror_rate','rerror_rate','srv_rerror_rate','same_srv_rate','diff_srv_rate','srv_diff_host_rate','dst_host_count','dst_host_srv_count','dst_host_same_srv_rate','dst_host_diff_srv_rate','dst_host_same_src_port_rate','dst_host_srv_diff_host_rate','dst_host_serror_rate','dst_host_srv_serror_rate','dst_host_rerror_rate','dst_host_srv_rerror_rate','label']
    
    df = pd.read_csv(url, names=column_names)
    return df

# Preprocess data
def preprocess_data(df):
    # Convert categorical to numerical
    categorical_cols = ['protocol_type', 'service', 'flag']
    df_encoded = pd.get_dummies(df, columns=categorical_cols)
    
    # Convert labels to binary (normal vs attack)
    df_encoded['label'] = df_encoded['label'].apply(lambda x: 0 if x == 'normal.' else 1)
    
    return df_encoded

# Forward Feature Selection
def forward_feature_selection(X, y, n_features=10):
    # Initialize estimator
    estimator = RandomForestClassifier(n_estimators=100, random_state=42)
    
    # Forward selection
    selector = SequentialFeatureSelector(
        estimator, 
        n_features_to_select=n_features,
        direction='forward',
        scoring='accuracy',
        cv=5
    )
    
    selector.fit(X, y)
    selected_features = selector.get_support(indices=True)
    
    return selected_features, selector

# Main execution
if __name__ == "__main__":
    # Load and preprocess data
    df = load_kdd_data()
    df_processed = preprocess_data(df)
    
    # Split features and target
    X = df_processed.drop('label', axis=1)
    y = df_processed['label']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    
    # Forward selection
    selected_indices, selector = forward_feature_selection(X_train, y_train, n_features=15)
    selected_features = X.columns[selected_indices]
    
    print(f"Selected features: {selected_features.tolist()}")
    
    # Compare performance
    # Full feature model
    rf_full = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_full.fit(X_train, y_train)
    y_pred_full = rf_full.predict(X_test)
    accuracy_full = accuracy_score(y_test, y_pred_full)
    
    # Selected feature model
    X_train_selected = X_train.iloc[:, selected_indices]
    X_test_selected = X_test.iloc[:, selected_indices]
    
    rf_selected = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_selected.fit(X_train_selected, y_train)
    y_pred_selected = rf_selected.predict(X_test_selected)
    accuracy_selected = accuracy_score(y_test, y_pred_selected)
    
    print(f"Full features accuracy: {accuracy_full:.4f}")
    print(f"Selected features accuracy: {accuracy_selected:.4f}")
    print(f"Feature reduction: {len(X.columns)} -> {len(selected_features)}")`,
        exercises: [
          "Implement forward selection with different estimators (Logistic Regression, SVM)",
          "Experiment with different numbers of selected features",
          "Compare computational time for full vs reduced feature set",
          "Visualize feature importance scores"
        ],
        evaluation: {
          criteria: [
            "Correct implementation of forward selection",
            "Performance comparison analysis",
            "Code documentation and comments",
            "Visualization of results"
          ],
          weightage: {
            implementation: 40,
            analysis: 30,
            documentation: 20,
            visualization: 10
          }
        }
      }
    });

    // Lab 2: Backward Feature Elimination
    labsData.push({
      title: "Backward Feature Elimination with KDD Cup99",
      description: "Implement backward feature elimination to iteratively remove features with minimal impact on model performance from KDD Cup99 dataset.",
      objectives: [
        "Understand backward feature elimination methodology",
        "Implement feature elimination on KDD Cup99 dataset",
        "Compare forward vs backward selection approaches",
        "Analyze feature importance rankings"
      ],
      difficulty: 3,
      estimatedTime: 90,
      tags: ["feature-elimination", "dimensionality-reduction", "kdd-cup99", "statsmodels"],
      scenario: "both",
      environment: "simulated",
      skills: ["Python", "Scikit-learn", "Statsmodels", "Feature Engineering"],
      content: {
        introduction: "Backward feature elimination starts with all features and iteratively removes the least important features based on model performance.",
        theory: "This wrapper method evaluates feature importance by removing features one by one and measuring the impact on model performance.",
        steps: [
          "Load and preprocess KDD Cup99 dataset",
          "Implement backward feature elimination",
          "Compare with forward selection results",
          "Analyze computational trade-offs",
          "Visualize elimination process"
        ],
        code: `# Backward Feature Elimination Implementation
import pandas as pd
import numpy as np
from sklearn.feature_selection import SequentialFeatureSelector
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

# Backward Feature Elimination
def backward_feature_elimination(X, y, n_features=10):
    estimator = RandomForestClassifier(n_estimators=100, random_state=42)
    
    selector = SequentialFeatureSelector(
        estimator,
        n_features_to_select=n_features,
        direction='backward',
        scoring='accuracy',
        cv=5
    )
    
    selector.fit(X, y)
    selected_features = selector.get_support(indices=True)
    
    return selected_features, selector

# Compare Forward vs Backward
def compare_selection_methods(X_train, X_test, y_train, y_test):
    # Forward selection
    forward_indices, forward_selector = forward_feature_selection(X_train, y_train, n_features=15)
    
    # Backward elimination
    backward_indices, backward_selector = backward_feature_elimination(X_train, y_train, n_features=15)
    
    # Evaluate both methods
    methods = {
        'Forward': forward_indices,
        'Backward': backward_indices
    }
    
    results = {}
    for method, indices in methods.items():
        X_train_selected = X_train.iloc[:, indices]
        X_test_selected = X_test.iloc[:, indices]
        
        rf = RandomForestClassifier(n_estimators=100, random_state=42)
        rf.fit(X_train_selected, y_train)
        y_pred = rf.predict(X_test_selected)
        
        results[method] = {
            'accuracy': accuracy_score(y_test, y_pred),
            'n_features': len(indices),
            'features': X_train.columns[indices].tolist()
        }
    
    return results

if __name__ == "__main__":
    # Load and preprocess data (reuse from Lab 1)
    df = load_kdd_data()
    df_processed = preprocess_data(df)
    
    X = df_processed.drop('label', axis=1)
    y = df_processed['label']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    
    # Compare methods
    results = compare_selection_methods(X_train, X_test, y_train, y_test)
    
    for method, result in results.items():
        print(f"{method} Selection:")
        print(f"  Accuracy: {result['accuracy']:.4f}")
        print(f"  Features: {result['n_features']}")
        print(f"  Top features: {result['features'][:5]}")
        print()`,
        exercises: [
          "Implement both forward and backward selection",
          "Create visualization of feature elimination process",
          "Compare computational efficiency",
          "Analyze feature overlap between methods"
        ],
        evaluation: {
          criteria: [
            "Correct implementation of both methods",
            "Comparative analysis",
            "Performance visualization",
            "Computational efficiency analysis"
          ],
          weightage: {
            implementation: 35,
            analysis: 35,
            visualization: 20,
            efficiency: 10
          }
        }
      }
    });

    // Lab 3: Linear Regression for House Prediction
    labsData.push({
      title: "Linear Regression for House Price Prediction",
      description: "Build a linear regression model to predict house prices using features like square footage, location, and number of rooms.",
      objectives: [
        "Implement linear regression for regression tasks",
        "Perform data preprocessing and feature engineering",
        "Evaluate model performance with appropriate metrics",
        "Interpret model coefficients and feature importance"
      ],
      difficulty: 2,
      estimatedTime: 60,
      tags: ["linear-regression", "house-prediction", "regression", "scikit-learn"],
      scenario: "both",
      environment: "simulated",
      skills: ["Python", "Scikit-learn", "Data Preprocessing", "Regression Analysis"],
      content: {
        introduction: "Linear regression is a fundamental regression algorithm that models the relationship between features and target variable using a linear approach.",
        theory: "The model learns coefficients for each feature to minimize the sum of squared differences between predicted and actual values.",
        steps: [
          "Load and explore housing dataset",
          "Perform data preprocessing and feature engineering",
          "Split data into training and testing sets",
          "Train linear regression model",
          "Evaluate model performance and interpret results"
        ],
        code: `# Linear Regression for House Price Prediction
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.preprocessing import StandardScaler, LabelEncoder
import matplotlib.pyplot as plt
import seaborn as sns

# Load Boston Housing Dataset
def load_housing_data():
    from sklearn.datasets import fetch_california_housing
    housing = fetch_california_housing()
    df = pd.DataFrame(housing.data, columns=housing.feature_names)
    df['price'] = housing.target
    return df

# Data Preprocessing
def preprocess_data(df):
    # Check for missing values
    print("Missing values:", df.isnull().sum())
    
    # Feature engineering
    df['rooms_per_person'] = df['AveRooms'] / df['Population']
    df['bedrooms_per_room'] = df['AveBedrms'] / df['AveRooms']
    
    return df

# Train Linear Regression Model
def train_linear_regression(X_train, y_train):
    model = LinearRegression()
    model.fit(X_train, y_train)
    return model

# Evaluate Model
def evaluate_model(model, X_test, y_test):
    y_pred = model.predict(X_test)
    
    metrics = {
        'MSE': mean_squared_error(y_test, y_pred),
        'RMSE': np.sqrt(mean_squared_error(y_test, y_pred)),
        'MAE': mean_absolute_error(y_test, y_pred),
        'R2': r2_score(y_test, y_pred)
    }
    
    return metrics, y_pred

# Feature Importance Analysis
def analyze_feature_importance(model, feature_names):
    coefficients = pd.DataFrame({
        'Feature': feature_names,
        'Coefficient': model.coef_
    })
    coefficients['Abs_Coefficient'] = coefficients['Coefficient'].abs()
    coefficients = coefficients.sort_values('Abs_Coefficient', ascending=False)
    
    return coefficients

# Visualization
def visualize_results(y_test, y_pred, coefficients):
    # Actual vs Predicted
    plt.figure(figsize=(12, 4))
    
    plt.subplot(1, 2, 1)
    plt.scatter(y_test, y_pred, alpha=0.5)
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
    plt.xlabel('Actual Price')
    plt.ylabel('Predicted Price')
    plt.title('Actual vs Predicted Prices')
    
    # Feature Importance
    plt.subplot(1, 2, 2)
    top_features = coefficients.head(10)
    plt.barh(top_features['Feature'], top_features['Coefficient'])
    plt.title('Feature Importance (Coefficients)')
    plt.xlabel('Coefficient Value')
    
    plt.tight_layout()
    plt.show()

# Main Execution
if __name__ == "__main__":
    # Load and preprocess data
    df = load_housing_data()
    df_processed = preprocess_data(df)
    
    # Prepare data
    X = df_processed.drop('price', axis=1)
    y = df_processed['price']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = train_linear_regression(X_train_scaled, y_train)
    
    # Evaluate
    metrics, y_pred = evaluate_model(model, X_test_scaled, y_test)
    
    print("Model Performance Metrics:")
    for metric, value in metrics.items():
        print(f"{metric}: {value:.4f}")
    
    # Feature importance
    coefficients = analyze_feature_importance(model, X.columns)
    print("\nTop 10 Features:")
    print(coefficients.head(10))
    
    # Visualize
    visualize_results(y_test, y_pred, coefficients)`,
        exercises: [
          "Implement polynomial features and compare performance",
          "Try different regularization techniques (Ridge, Lasso)",
          "Perform cross-validation for robust evaluation",
          "Create residual plots to check assumptions"
        ],
        evaluation: {
          criteria: [
            "Correct implementation of linear regression",
            "Proper data preprocessing",
            "Comprehensive evaluation metrics",
            "Interpretation of results"
          ],
          weightage: {
            implementation: 40,
            preprocessing: 20,
            evaluation: 25,
            interpretation: 15
          }
        }
      }
    });

    // Insert all labs
    const createdLabs = await Lab.insertMany(labsData);
    console.log(`✅ Created ${createdLabs.length} comprehensive AIML labs`);

    console.log("\n🔬 Lab Summary:");
    createdLabs.forEach((lab, index) => {
      console.log(`${index + 1}. ${lab.title} (${lab.difficulty}/4, ${lab.estimatedTime}min)`);
    });

    console.log("\n🎉 Comprehensive labs creation completed!");
    
  } catch (error) {
    console.error("❌ Error creating labs:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the function
createComprehensiveLabs();

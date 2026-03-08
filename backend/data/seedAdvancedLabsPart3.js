import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Advanced ML Labs Seeder - Part 3
const advancedLabsPart3 = [
  // CO5: Gradient Boosting
  {
    title: "Gradient Boosting Algorithm",
    description: "Implement Gradient Boosting for classification tasks including IRIS and 50_Startups datasets",
    difficulty: 4,
    estimatedTime: 90,
    category: "Ensemble Learning",
    tags: ["gradient-boosting", "classification", "iris", "startups", "ensemble"],
    objectives: [
      "Implement Gradient Boosting from scratch",
      "Apply to IRIS multi-class classification",
      "Apply to 50_Startups success prediction",
      "Tune hyperparameters for better performance",
      "Evaluate using precision and recall metrics"
    ],
    prerequisites: [
      "Understanding of ensemble methods",
      "Gradient descent concepts",
      "Classification evaluation metrics"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, precision_score, recall_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Simple Gradient Boosting implementation
class SimpleGradientBoosting:
    def __init__(self, n_estimators=100, learning_rate=0.1, max_depth=3):
        self.n_estimators = n_estimators
        self.learning_rate = learning_rate
        self.max_depth = max_depth
        self.trees = []
        self.initial_prediction = None
    
    def fit(self, X, y):
        # Initial prediction (mean for regression, mode for classification)
        self.initial_prediction = np.mean(y)
        current_predictions = np.full(len(y), self.initial_prediction)
        
        for i in range(self.n_estimators):
            # Calculate residuals
            residuals = y - current_predictions
            
            # Train decision tree on residuals
            tree = self._train_tree(X, residuals)
            self.trees.append(tree)
            
            # Update predictions
            tree_predictions = self._predict_tree(tree, X)
            current_predictions += self.learning_rate * tree_predictions
            
            # Print progress
            if (i + 1) % 20 == 0:
                mse = np.mean((y - current_predictions) ** 2)
                print(f"Tree {i+1}/{self.n_estimators}, MSE: {mse:.4f}")
    
    def _train_tree(self, X, y):
        # Simple decision tree stub (for demonstration)
        # In practice, you'd use sklearn's DecisionTreeRegressor
        from sklearn.tree import DecisionTreeRegressor
        tree = DecisionTreeRegressor(max_depth=self.max_depth)
        tree.fit(X, y)
        return tree
    
    def _predict_tree(self, tree, X):
        return tree.predict(X)
    
    def predict(self, X):
        predictions = np.full(len(X), self.initial_prediction)
        
        for tree in self.trees:
            tree_predictions = self._predict_tree(tree, X)
            predictions += self.learning_rate * tree_predictions
        
        return predictions

# Part I: IRIS Dataset
print("=" * 50)
print("PART I: IRIS DATASET - GRADIENT BOOSTING")
print("=" * 50)

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

# Train Gradient Boosting
print("Training Gradient Boosting on IRIS...")
gb_iris = SimpleGradientBoosting(n_estimators=50, learning_rate=0.1, max_depth=3)
gb_iris.fit(X_train_iris_scaled, y_train_iris)

# Make predictions
y_pred_iris = gb_iris.predict(X_test_iris_scaled)
y_pred_iris_rounded = np.round(y_pred_iris).astype(int)

# Evaluate IRIS
print("\\nIRIS Results:")
print(classification_report(y_test_iris, y_pred_iris_rounded, target_names=iris.target_names))

# Calculate precision and recall for each class
precision_iris = precision_score(y_test_iris, y_pred_iris_rounded, average=None)
recall_iris = recall_score(y_test_iris, y_pred_iris_rounded, average=None)

print("\\nIRIS Precision and Recall by Class:")
for i, class_name in enumerate(iris.target_names):
    print(f"{class_name}: Precision={precision_iris[i]:.3f}, Recall={recall_iris[i]:.3f}")

# Part II: 50_Startups Dataset
print("\\n" + "=" * 50)
print("PART II: 50_STARTUPS DATASET - GRADIENT BOOSTING")
print("=" * 50)

# Create sample startups dataset
def create_startups_dataset():
    np.random.seed(42)
    n_samples = 300
    
    data = {
        'rd_spend': np.random.exponential(80000, n_samples),
        'administration': np.random.exponential(25000, n_samples),
        'marketing_spend': np.random.exponential(40000, n_samples),
        'state': np.random.choice(['CA', 'NY', 'TX', 'FL'], n_samples),
        'category': np.random.choice(['Software', 'Hardware', 'Biotech'], n_samples),
        'funding_rounds': np.random.poisson(3, n_samples),
        'has_patents': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
        'team_size': np.random.exponential(20, n_samples),
        'success': np.random.choice([0, 1], n_samples, p=[0.5, 0.5])
    }
    
    df = pd.DataFrame(data)
    
    # Add realistic relationships
    success_prob = (
        np.log1p(df['rd_spend']) / 15 +
        np.log1p(df['funding_rounds']) / 3 +
        df['has_patents'] * 0.3 +
        (df['team_size'] > 15) * 0.2 +
        np.random.normal(0, 0.3, n_samples)
    )
    
    df['success'] = (success_prob > 0.5).astype(int)
    
    return df

# Load startups dataset
df_startups = create_startups_dataset()

# Preprocess startups data
startups_features = ['rd_spend', 'administration', 'marketing_spend', 'funding_rounds', 
                   'has_patents', 'team_size']
X_startups = pd.get_dummies(df_startups, columns=['state', 'category'], drop_first=True)
y_startups = X_startups['success']
X_startups = X_startups.drop('success', axis=1)

# Split startups data
X_train_start, X_test_start, y_train_start, y_test_start = train_test_split(
    X_startups, y_startups, test_size=0.3, random_state=42, stratify=y_startups
)

# Scale startups features
scaler_start = StandardScaler()
X_train_start_scaled = scaler_start.fit_transform(X_train_start)
X_test_start_scaled = scaler_start.transform(X_test_start)

print("Training Gradient Boosting on Startups...")
gb_start = SimpleGradientBoosting(n_estimators=100, learning_rate=0.1, max_depth=3)
gb_start.fit(X_train_start_scaled, y_train_start)

# Make predictions
y_pred_start = gb_start.predict(X_test_start_scaled)
y_pred_start_rounded = np.round(y_pred_start).astype(int)

# Evaluate startups
print("\\nStartups Results:")
print(classification_report(y_test_start, y_pred_start_rounded))

# Calculate precision and recall
precision_start = precision_score(y_test_start, y_pred_start_rounded, average=None)
recall_start = recall_score(y_test_start, y_pred_start_rounded, average=None)

print("\\nStartups Precision and Recall:")
print(f"Class 0 (Failed): Precision={precision_start[0]:.3f}, Recall={recall_start[0]:.3f}")
print(f"Class 1 (Success): Precision={precision_start[1]:.3f}, Recall={recall_start[1]:.3f}")

# Visualize results
plt.figure(figsize=(15, 5))

# IRIS confusion matrix
plt.subplot(1, 3, 1)
cm_iris = confusion_matrix(y_test_iris, y_pred_iris_rounded)
plt.imshow(cm_iris, interpolation='nearest', cmap=plt.cm.Blues)
plt.title('IRIS Confusion Matrix')
plt.colorbar()

# Startups confusion matrix
plt.subplot(1, 3, 2)
cm_start = confusion_matrix(y_test_start, y_pred_start_rounded)
plt.imshow(cm_start, interpolation='nearest', cmap=plt.cm.Reds)
plt.title('Startups Confusion Matrix')
plt.colorbar()

# Precision comparison
plt.subplot(1, 3, 3)
datasets = ['IRIS', 'Startups']
avg_precision = [np.mean(precision_iris), np.mean(precision_start)]
avg_recall = [np.mean(recall_iris), np.mean(recall_start)]

x = np.arange(len(datasets))
width = 0.35

plt.bar(x - width/2, avg_precision, width, label='Precision', alpha=0.7)
plt.bar(x + width/2, avg_recall, width, label='Recall', alpha=0.7)
plt.xlabel('Dataset')
plt.ylabel('Score')
plt.title('Precision vs Recall Comparison')
plt.xticks(x, datasets)
plt.legend()

plt.tight_layout()
plt.show()`,
    solution: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report, confusion_matrix, precision_score, recall_score, f1_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

def load_iris_dataset():
    """Load and prepare IRIS dataset"""
    from sklearn.datasets import load_iris
    
    iris = load_iris()
    X = iris.data
    y = iris.target
    
    return X, y, iris.target_names

def load_startups_dataset():
    """Load and prepare 50_Startups dataset"""
    np.random.seed(42)
    n_samples = 500
    
    data = {
        'rd_spend': np.random.exponential(80000, n_samples),
        'administration': np.random.exponential(25000, n_samples),
        'marketing_spend': np.random.exponential(40000, n_samples),
        'state': np.random.choice(['CA', 'NY', 'TX', 'FL', 'WA'], n_samples),
        'category': np.random.choice(['Software', 'Hardware', 'Biotech', 'E-commerce'], n_samples),
        'funding_rounds': np.random.poisson(3, n_samples),
        'has_patents': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
        'team_size': np.random.exponential(20, n_samples),
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

def optimize_gradient_boosting(X_train, y_train):
    """Optimize Gradient Boosting hyperparameters"""
    param_grid = {
        'n_estimators': [50, 100, 200],
        'learning_rate': [0.01, 0.1, 0.2],
        'max_depth': [3, 5, 7],
        'subsample': [0.8, 1.0]
    }
    
    gb = GradientBoostingClassifier(random_state=42)
    grid_search = GridSearchCV(gb, param_grid, cv=5, scoring='accuracy', n_jobs=-1)
    grid_search.fit(X_train, y_train)
    
    return grid_search.best_estimator_, grid_search.best_params_

def evaluate_model(model, X_test, y_test, dataset_name):
    """Evaluate model with comprehensive metrics"""
    y_pred = model.predict(X_test)
    
    print(f"\\n{dataset_name} Results:")
    print("=" * 40)
    
    # Classification report
    print(classification_report(y_test, y_pred))
    
    # Precision and recall per class
    precision = precision_score(y_test, y_pred, average=None)
    recall = recall_score(y_test, y_pred, average=None)
    f1 = f1_score(y_test, y_pred, average=None)
    
    print(f"\\nDetailed Metrics:")
    for i in range(len(precision)):
        print(f"Class {i}: Precision={precision[i]:.3f}, Recall={recall[i]:.3f}, F1={f1[i]:.3f}")
    
    return {
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'y_pred': y_pred
    }

def main():
    print("Gradient Boosting Algorithm")
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
    
    # Optimize and train
    best_gb_iris, best_params_iris = optimize_gradient_boosting(X_train_iris_scaled, y_train_iris)
    print(f"Best parameters for IRIS: {best_params_iris}")
    
    iris_results = evaluate_model(best_gb_iris, X_test_iris_scaled, y_test_iris, "IRIS")
    
    # Startups Dataset
    print("\\n2. 50_Startups Dataset Analysis")
    print("-" * 30)
    
    df_startups = load_startups_dataset()
    
    # Preprocess startups data
    X_startups = pd.get_dummies(df_startups, columns=['state', 'category'], drop_first=True)
    y_startups = X_startups['success']
    X_startups = X_startups.drop('success', axis=1)
    
    X_train_start, X_test_start, y_train_start, y_test_start = train_test_split(
        X_startups, y_startups, test_size=0.3, random_state=42, stratify=y_startups
    )
    
    # Scale startups features
    scaler_start = StandardScaler()
    X_train_start_scaled = scaler_start.fit_transform(X_train_start)
    X_test_start_scaled = scaler_start.transform(X_test_start)
    
    # Optimize and train
    best_gb_start, best_params_start = optimize_gradient_boosting(X_train_start_scaled, y_train_start)
    print(f"Best parameters for Startups: {best_params_start}")
    
    startups_results = evaluate_model(best_gb_start, X_test_start_scaled, y_test_start, "Startups")
    
    # Visualize results
    plt.figure(figsize=(15, 10))
    
    # IRIS confusion matrix
    plt.subplot(2, 3, 1)
    cm_iris = confusion_matrix(y_test_iris, iris_results['y_pred'])
    plt.imshow(cm_iris, interpolation='nearest', cmap=plt.cm.Blues)
    plt.title('IRIS Confusion Matrix')
    plt.colorbar()
    
    # Startups confusion matrix
    plt.subplot(2, 3, 2)
    cm_start = confusion_matrix(y_test_start, startups_results['y_pred'])
    plt.imshow(cm_start, interpolation='nearest', cmap=plt.cm.Reds)
    plt.title('Startups Confusion Matrix')
    plt.colorbar()
    
    # Precision comparison
    plt.subplot(2, 3, 3)
    datasets = ['IRIS', 'Startups']
    avg_precision = [np.mean(iris_results['precision']), np.mean(startups_results['precision'])]
    avg_recall = [np.mean(iris_results['recall']), np.mean(startups_results['recall'])]
    
    x = np.arange(len(datasets))
    width = 0.35
    
    plt.bar(x - width/2, avg_precision, width, label='Precision', alpha=0.7)
    plt.bar(x + width/2, avg_recall, width, label='Recall', alpha=0.7)
    plt.xlabel('Dataset')
    plt.ylabel('Score')
    plt.title('Precision vs Recall Comparison')
    plt.xticks(x, datasets)
    plt.legend()
    
    # Feature importance for IRIS
    plt.subplot(2, 3, 4)
    feature_importance_iris = best_gb_iris.feature_importances_
    feature_names_iris = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width']
    plt.barh(feature_names_iris, feature_importance_iris)
    plt.title('IRIS Feature Importance')
    plt.xlabel('Importance')
    
    # Feature importance for Startups
    plt.subplot(2, 3, 5)
    feature_importance_start = best_gb_start.feature_importances_
    feature_names_start = X_startups.columns[:10]  # Top 10 features
    plt.barh(feature_names_start, feature_importance_start[:10])
    plt.title('Startups Feature Importance')
    plt.xlabel('Importance')
    
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    main()`,
    evaluationCriteria: [
      "Implement Gradient Boosting correctly",
      "Apply to both IRIS and 50_Startups datasets",
      "Tune hyperparameters for optimization",
      "Evaluate using precision and recall metrics",
      "Compare performance across datasets"
    ],
    hints: [
      "Use sklearn's GradientBoostingClassifier",
      "Try different learning rates and n_estimators",
      "Use GridSearchCV for hyperparameter tuning",
      "Evaluate precision and recall for each class",
      "Analyze feature importance"
    ]
  },

  // CO5: XGBoost
  {
    title: "XGBoost Algorithm",
    description: "Implement XGBoost for classification tasks including IRIS and 50_Startups datasets with hyperparameter optimization",
    difficulty: 4,
    estimatedTime: 95,
    category: "Ensemble Learning",
    tags: ["xgboost", "classification", "iris", "startups", "hyperparameter-tuning"],
    objectives: [
      "Implement XGBoost for classification",
      "Apply to IRIS multi-class classification",
      "Apply to 50_Startups success prediction",
      "Optimize hyperparameters (learning rate, max depth)",
      "Evaluate performance using confusion matrices"
    ],
    prerequisites: [
      "Understanding of XGBoost concepts",
      "Hyperparameter optimization techniques",
      "Advanced classification metrics"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Try to import xgboost, fallback to sklearn if not available
try:
    import xgboost as xgb
    XGB_AVAILABLE = True
    print("XGBoost library available")
except ImportError:
    print("XGBoost not available, using sklearn's GradientBoosting as fallback")
    from sklearn.ensemble import GradientBoostingClassifier
    XGB_AVAILABLE = False

# XGBoost wrapper class
class XGBoostClassifier:
    def __init__(self, n_estimators=100, learning_rate=0.1, max_depth=6, random_state=42):
        self.n_estimators = n_estimators
        self.learning_rate = learning_rate
        self.max_depth = max_depth
        self.random_state = random_state
        
        if XGB_AVAILABLE:
            self.model = xgb.XGBClassifier(
                n_estimators=n_estimators,
                learning_rate=learning_rate,
                max_depth=max_depth,
                random_state=random_state,
                use_label_encoder=False
            )
        else:
            self.model = GradientBoostingClassifier(
                n_estimators=n_estimators,
                learning_rate=learning_rate,
                max_depth=max_depth,
                random_state=random_state
            )
    
    def fit(self, X, y):
        self.model.fit(X, y)
    
    def predict(self, X):
        return self.model.predict(X)
    
    def predict_proba(self, X):
        if hasattr(self.model, 'predict_proba'):
            return self.model.predict_proba(X)
        else:
            return None

# Part I: IRIS Dataset
print("=" * 50)
print("PART I: IRIS DATASET - XGBOOST")
print("=" * 50)

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

# Test different hyperparameters
learning_rates = [0.01, 0.1, 0.2]
max_depths = [3, 6, 9]

print("Testing different hyperparameters on IRIS:")
best_accuracy_iris = 0
best_params_iris = None

for lr in learning_rates:
    for depth in max_depths:
        xgb_iris = XGBoostClassifier(
            n_estimators=100,
            learning_rate=lr,
            max_depth=depth
        )
        
        xgb_iris.fit(X_train_iris_scaled, y_train_iris)
        y_pred_iris = xgb_iris.predict(X_test_iris_scaled)
        accuracy = accuracy_score(y_test_iris, y_pred_iris)
        
        print(f"LR={lr}, Depth={depth}: Accuracy={accuracy:.4f}")
        
        if accuracy > best_accuracy_iris:
            best_accuracy_iris = accuracy
            best_params_iris = {'learning_rate': lr, 'max_depth': depth}

print(f"\\nBest IRIS parameters: {best_params_iris}")
print(f"Best IRIS accuracy: {best_accuracy_iris:.4f}")

# Train final model with best parameters
final_xgb_iris = XGBoostClassifier(
    n_estimators=200,
    learning_rate=best_params_iris['learning_rate'],
    max_depth=best_params_iris['max_depth']
)

final_xgb_iris.fit(X_train_iris_scaled, y_train_iris)
y_pred_iris_final = final_xgb_iris.predict(X_test_iris_scaled)

print("\\nFinal IRIS Results:")
print(classification_report(y_test_iris, y_pred_iris_final, target_names=iris.target_names))

# Part II: 50_Startups Dataset
print("\\n" + "=" * 50)
print("PART II: 50_STARTUPS DATASET - XGBOOST")
print("=" * 50)

# Create sample startups dataset
def create_startups_dataset():
    np.random.seed(42)
    n_samples = 400
    
    data = {
        'rd_spend': np.random.exponential(80000, n_samples),
        'administration': np.random.exponential(25000, n_samples),
        'marketing_spend': np.random.exponential(40000, n_samples),
        'state': np.random.choice(['CA', 'NY', 'TX', 'FL', 'WA'], n_samples),
        'category': np.random.choice(['Software', 'Hardware', 'Biotech', 'E-commerce'], n_samples),
        'funding_rounds': np.random.poisson(3, n_samples),
        'has_patents': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
        'team_size': np.random.exponential(20, n_samples),
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

# Load startups dataset
df_startups = create_startups_dataset()

# Preprocess startups data
X_startups = pd.get_dummies(df_startups, columns=['state', 'category'], drop_first=True)
y_startups = X_startups['success']
X_startups = X_startups.drop('success', axis=1)

# Split startups data
X_train_start, X_test_start, y_train_start, y_test_start = train_test_split(
    X_startups, y_startups, test_size=0.3, random_state=42, stratify=y_startups
)

# Scale startups features
scaler_start = StandardScaler()
X_train_start_scaled = scaler_start.fit_transform(X_train_start)
X_test_start_scaled = scaler_start.transform(X_test_start)

# Test different hyperparameters on startups
print("Testing different hyperparameters on Startups:")
best_accuracy_start = 0
best_params_start = None

for lr in learning_rates:
    for depth in max_depths:
        xgb_start = XGBoostClassifier(
            n_estimators=100,
            learning_rate=lr,
            max_depth=depth
        )
        
        xgb_start.fit(X_train_start_scaled, y_train_start)
        y_pred_start = xgb_start.predict(X_test_start_scaled)
        accuracy = accuracy_score(y_test_start, y_pred_start)
        
        print(f"LR={lr}, Depth={depth}: Accuracy={accuracy:.4f}")
        
        if accuracy > best_accuracy_start:
            best_accuracy_start = accuracy
            best_params_start = {'learning_rate': lr, 'max_depth': depth}

print(f"\\nBest Startups parameters: {best_params_start}")
print(f"Best Startups accuracy: {best_accuracy_start:.4f}")

# Train final model with best parameters
final_xgb_start = XGBoostClassifier(
    n_estimators=200,
    learning_rate=best_params_start['learning_rate'],
    max_depth=best_params_start['max_depth']
)

final_xgb_start.fit(X_train_start_scaled, y_train_start)
y_pred_start_final = final_xgb_start.predict(X_test_start_scaled)

print("\\nFinal Startups Results:")
print(classification_report(y_test_start, y_pred_start_final))

# Visualize results
plt.figure(figsize=(15, 10))

# IRIS confusion matrix
plt.subplot(2, 3, 1)
cm_iris = confusion_matrix(y_test_iris, y_pred_iris_final)
plt.imshow(cm_iris, interpolation='nearest', cmap=plt.cm.Blues)
plt.title('IRIS Confusion Matrix')
plt.colorbar()

# Startups confusion matrix
plt.subplot(2, 3, 2)
cm_start = confusion_matrix(y_test_start, y_pred_start_final)
plt.imshow(cm_start, interpolation='nearest', cmap=plt.cm.Reds)
plt.title('Startups Confusion Matrix')
plt.colorbar()

# Hyperparameter performance
plt.subplot(2, 3, 3)
lr_results = []
depth_results = []

for lr in learning_rates:
    acc_sum = 0
    for depth in max_depths:
        xgb_temp = XGBoostClassifier(n_estimators=50, learning_rate=lr, max_depth=depth)
        xgb_temp.fit(X_train_iris_scaled, y_train_iris)
        acc_sum += accuracy_score(y_test_iris, xgb_temp.predict(X_test_iris_scaled))
    lr_results.append(acc_sum / len(max_depths))

plt.plot(learning_rates, lr_results, marker='o')
plt.xlabel('Learning Rate')
plt.ylabel('Average Accuracy')
plt.title('Learning Rate Impact on Accuracy')
plt.grid(True)

# Feature importance (if available)
if XGB_AVAILABLE:
    plt.subplot(2, 3, 4)
    feature_importance_iris = final_xgb_iris.model.feature_importances_
    feature_names_iris = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width']
    plt.barh(feature_names_iris, feature_importance_iris)
    plt.title('IRIS Feature Importance')
    plt.xlabel('Importance')

plt.tight_layout()
plt.show()`,
    solution: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Import XGBoost
try:
    import xgboost as xgb
    XGB_AVAILABLE = True
    print("XGBoost library available")
except ImportError:
    print("XGBoost not available, installing...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "xgboost"])
    import xgboost as xgb
    XGB_AVAILABLE = True

def load_iris_dataset():
    """Load and prepare IRIS dataset"""
    from sklearn.datasets import load_iris
    
    iris = load_iris()
    X = iris.data
    y = iris.target
    
    return X, y, iris.target_names

def load_startups_dataset():
    """Load and prepare 50_Startups dataset"""
    np.random.seed(42)
    n_samples = 600
    
    data = {
        'rd_spend': np.random.exponential(80000, n_samples),
        'administration': np.random.exponential(25000, n_samples),
        'marketing_spend': np.random.exponential(40000, n_samples),
        'state': np.random.choice(['CA', 'NY', 'TX', 'FL', 'WA'], n_samples),
        'category': np.random.choice(['Software', 'Hardware', 'Biotech', 'E-commerce', 'FinTech'], n_samples),
        'funding_rounds': np.random.poisson(3, n_samples),
        'has_patents': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
        'team_size': np.random.exponential(20, n_samples),
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

def optimize_xgboost(X_train, y_train):
    """Optimize XGBoost hyperparameters"""
    param_grid = {
        'n_estimators': [50, 100, 200],
        'learning_rate': [0.01, 0.1, 0.2],
        'max_depth': [3, 6, 9],
        'subsample': [0.8, 1.0],
        'colsample_bytree': [0.8, 1.0]
    }
    
    xgb_model = xgb.XGBClassifier(
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss'
    )
    
    grid_search = GridSearchCV(
        xgb_model, 
        param_grid, 
        cv=5, 
        scoring='accuracy', 
        n_jobs=-1,
        verbose=1
    )
    
    grid_search.fit(X_train, y_train)
    
    return grid_search.best_estimator_, grid_search.best_params_

def evaluate_xgboost(model, X_test, y_test, dataset_name, target_names=None):
    """Evaluate XGBoost model"""
    y_pred = model.predict(X_test)
    
    print(f"\\n{dataset_name} Results:")
    print("=" * 50)
    
    # Basic metrics
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy:.4f}")
    
    # Classification report
    if target_names:
        print(classification_report(y_test, y_pred, target_names=target_names))
    else:
        print(classification_report(y_test, y_pred))
    
    return {
        'accuracy': accuracy,
        'y_pred': y_pred,
        'confusion_matrix': confusion_matrix(y_test, y_pred)
    }

def plot_feature_importance(model, feature_names, title):
    """Plot feature importance"""
    if hasattr(model, 'feature_importances_'):
        importance = model.feature_importances_
        
        # Get top 10 features
        indices = np.argsort(importance)[::-1][:10]
        top_features = [feature_names[i] for i in indices]
        top_importance = importance[indices]
        
        plt.figure(figsize=(10, 6))
        plt.barh(range(len(top_features)), top_importance)
        plt.yticks(range(len(top_features)), top_features)
        plt.xlabel('Importance')
        plt.title(title)
        plt.gca().invert_yaxis()
        plt.show()

def main():
    print("XGBoost Algorithm with Hyperparameter Optimization")
    print("=" * 60)
    
    # IRIS Dataset
    print("\\n1. IRIS Dataset Analysis")
    print("-" * 40)
    
    X_iris, y_iris, target_names = load_iris_dataset()
    X_train_iris, X_test_iris, y_train_iris, y_test_iris = train_test_split(
        X_iris, y_iris, test_size=0.3, random_state=42, stratify=y_iris
    )
    
    # Scale IRIS features
    scaler_iris = StandardScaler()
    X_train_iris_scaled = scaler_iris.fit_transform(X_train_iris)
    X_test_iris_scaled = scaler_iris.transform(X_test_iris)
    
    # Optimize XGBoost for IRIS
    print("Optimizing XGBoost for IRIS...")
    best_xgb_iris, best_params_iris = optimize_xgboost(X_train_iris_scaled, y_train_iris)
    print(f"Best parameters for IRIS: {best_params_iris}")
    
    # Evaluate IRIS
    iris_results = evaluate_xgboost(
        best_xgb_iris, X_test_iris_scaled, y_test_iris, 
        "IRIS", target_names
    )
    
    # Plot feature importance for IRIS
    plot_feature_importance(
        best_xgb_iris, 
        ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'],
        'IRIS Feature Importance (XGBoost)'
    )
    
    # Startups Dataset
    print("\\n2. 50_Startups Dataset Analysis")
    print("-" * 40)
    
    df_startups = load_startups_dataset()
    
    # Preprocess startups data
    X_startups = pd.get_dummies(df_startups, columns=['state', 'category'], drop_first=True)
    y_startups = X_startups['success']
    X_startups = X_startups.drop('success', axis=1)
    
    X_train_start, X_test_start, y_train_start, y_test_start = train_test_split(
        X_startups, y_startups, test_size=0.3, random_state=42, stratify=y_startups
    )
    
    # Scale startups features
    scaler_start = StandardScaler()
    X_train_start_scaled = scaler_start.fit_transform(X_train_start)
    X_test_start_scaled = scaler_start.transform(X_test_start)
    
    # Optimize XGBoost for Startups
    print("Optimizing XGBoost for Startups...")
    best_xgb_start, best_params_start = optimize_xgboost(X_train_start_scaled, y_train_start)
    print(f"Best parameters for Startups: {best_params_start}")
    
    # Evaluate Startups
    startups_results = evaluate_xgboost(
        best_xgb_start, X_test_start_scaled, y_test_start, 
        "Startups"
    )
    
    # Plot feature importance for Startups
    plot_feature_importance(
        best_xgb_start, 
        X_startups.columns,
        'Startups Feature Importance (XGBoost)'
    )
    
    # Visualize confusion matrices
    plt.figure(figsize=(12, 5))
    
    plt.subplot(1, 2, 1)
    plt.imshow(iris_results['confusion_matrix'], interpolation='nearest', cmap=plt.cm.Blues)
    plt.title('IRIS Confusion Matrix')
    plt.colorbar()
    
    plt.subplot(1, 2, 2)
    plt.imshow(startups_results['confusion_matrix'], interpolation='nearest', cmap=plt.cm.Reds)
    plt.title('Startups Confusion Matrix')
    plt.colorbar()
    
    plt.tight_layout()
    plt.show()
    
    # Summary
    print("\\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"IRIS Best Accuracy: {iris_results['accuracy']:.4f}")
    print(f"Startups Best Accuracy: {startups_results['accuracy']:.4f}")
    print(f"IRIS Best Parameters: {best_params_iris}")
    print(f"Startups Best Parameters: {best_params_start}")

if __name__ == "__main__":
    main()`,
    evaluationCriteria: [
      "Implement XGBoost correctly",
      "Apply to both IRIS and 50_Startups datasets",
      "Optimize hyperparameters (learning rate, max depth)",
      "Evaluate using confusion matrices",
      "Analyze feature importance"
    ],
    hints: [
      "Install xgboost library if not available",
      "Use GridSearchCV for hyperparameter optimization",
      "Try different learning rates (0.01, 0.1, 0.2)",
      "Experiment with max_depth values (3, 6, 9)",
      "Analyze confusion matrices for performance insights"
    ]
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Advanced Labs Seeder Part 3: Connected to MongoDB');
    return conn;
  } catch (error) {
    console.error('❌ Advanced Labs Seeder Part 3: MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed advanced labs part 3
const seedAdvancedLabsPart3 = async () => {
  try {
    // Clear existing advanced labs part 3
    await mongoose.connection.db.collection('advancedlabspart3').deleteMany({});
    console.log('🗑️ Cleared existing advanced labs part 3');

    // Insert advanced labs part 3
    const result = await mongoose.connection.db.collection('advancedlabspart3').insertMany(advancedLabsPart3);
    console.log(`✅ Created ${result.insertedCount} advanced labs part 3`);

    // Log lab details
    advancedLabsPart3.forEach((lab, index) => {
      console.log(`\n🔬 Lab ${index + 1}: ${lab.title}`);
      console.log(`   Category: ${lab.category}`);
      console.log(`   Difficulty: ${lab.difficulty}/5`);
      console.log(`   Time: ${lab.estimatedTime} minutes`);
      console.log(`   Tags: ${lab.tags.join(', ')}`);
    });

    console.log('\n🎉 Advanced labs part 3 seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding advanced labs part 3:', error);
  }
};

// Main seeder function
const main = async () => {
  await connectDB();
  await seedAdvancedLabsPart3();
  process.exit(0);
};

// Run seeder
main();

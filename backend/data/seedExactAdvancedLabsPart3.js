import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Exact Advanced ML Labs Part 3 (CO5)
const exactAdvancedLabsPart3 = [
  // CO5: Gradient Boosting
  {
    name: "GradientBoostingIRISStartups",
    title: "Gradient Boosting - IRIS & 50_Startups",
    description: "Write a Python program to implement Gradient Boosting. i. IRIS dataset: Perform multi-class classification using Gradient Boosting. Evaluate metrics such as precision and recall for each class. ii. 50_Startups dataset: Predict outcomes by training a Gradient Boosting classifier and tuning hyperparameters to enhance performance.",
    difficulty: 4,
    estimatedTime: 90,
    category: "Ensemble Learning",
    tags: ["gradient-boosting", "classification", "iris", "startups", "ensemble"],
    objectives: [
      "Implement Gradient Boosting algorithm",
      "Apply to IRIS dataset for multi-class classification",
      "Apply to 50_Startups dataset",
      "Evaluate using precision and recall metrics",
      "Tune hyperparameters for better performance"
    ],
    prerequisites: [
      "Understanding of ensemble methods",
      "Gradient descent concepts",
      "Classification evaluation metrics"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report, confusion_matrix, precision_score, recall_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Part I: IRIS Dataset
print("=" * 50)
print("PART I: IRIS DATASET - GRADIENT BOOSTING")
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

# Train Gradient Boosting on IRIS
print("\\nTraining Gradient Boosting on IRIS...")
gb_iris = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
gb_iris.fit(X_train_iris_scaled, y_train_iris)

# Predict and evaluate IRIS
y_pred_iris = gb_iris.predict(X_test_iris_scaled)

print("\\nIRIS Classification Report:")
print(classification_report(y_test_iris, y_pred_iris, target_names=target_names))

# IRIS precision and recall for each class
precision_iris = precision_score(y_test_iris, y_pred_iris, average=None)
recall_iris = recall_score(y_test_iris, y_pred_iris, average=None)

print("\\nIRIS Precision and Recall by Class:")
for i, class_name in enumerate(target_names):
    print(f"{class_name}: Precision={precision_iris[i]:.3f}, Recall={recall_iris[i]:.3f}")

# Part II: 50_Startups Dataset
print("\\n" + "=" * 50)
print("PART II: 50_STARTUPS DATASET - GRADIENT BOOSTING")
print("=" * 50)

def load_startups_dataset():
    """Load 50_Startups dataset"""
    # Create sample dataset
    np.random.seed(42)
    n_samples = 300
    
    data = {
        'rd_spend': np.random.exponential(80000, n_samples),
        'administration': np.random.exponential(25000, n_samples),
        'marketing_spend': np.random.exponential(40000, n_samples),
        'state': np.random.choice(['California', 'New York', 'Florida', 'Texas'], n_samples),
        'category': np.random.choice(['Software', 'Hardware', 'Biotech'], n_samples),
        'funding_rounds': np.random.poisson(3, n_samples),
        'has_patents': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
        'team_size': np.random.exponential(20, n_samples),
        'success': np.random.choice([0, 1], n_samples, p=[0.5, 0.5])  # 0=failure, 1=success
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

# Load startups data
df_startups = load_startups_dataset()

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

# Train Gradient Boosting on startups
print("\\nTraining Gradient Boosting on Startups...")
gb_start = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
gb_start.fit(X_train_start_scaled, y_train_start)

# Predict and evaluate startups
y_pred_start = gb_start.predict(X_test_start_scaled)

print("\\nStartups Classification Report:")
print(classification_report(y_test_start, y_pred_start))

# Startups precision and recall
precision_start = precision_score(y_test_start, y_pred_start, average=None)
recall_start = recall_score(y_test_start, y_pred_start, average=None)

print("\\nStartups Precision and Recall:")
print(f"Class 0 (Failed): Precision={precision_start[0]:.3f}, Recall={recall_start[0]:.3f}")
print(f"Class 1 (Success): Precision={precision_start[1]:.3f}, Recall={recall_start[1]:.3f}")

# Hyperparameter tuning for startups
print("\\nHyperparameter Tuning for Startups:")

learning_rates = [0.01, 0.1, 0.2]
max_depths = [3, 5, 7]
best_score = 0
best_params = {}

for lr in learning_rates:
    for depth in max_depths:
        gb_temp = GradientBoostingClassifier(
            n_estimators=50, learning_rate=lr, max_depth=depth, random_state=42
        )
        gb_temp.fit(X_train_start_scaled, y_train_start)
        y_pred_temp = gb_temp.predict(X_test_start_scaled)
        score = (y_pred_temp == y_test_start).mean()
        
        print(f"LR={lr}, Depth={depth}: Accuracy={score:.4f}")
        
        if score > best_score:
            best_score = score
            best_params = {'learning_rate': lr, 'max_depth': depth}

print(f"\\nBest Parameters for Startups: {best_params}")
print(f"Best Accuracy: {best_score:.4f}")

# Train final model with best parameters
gb_final = GradientBoostingClassifier(
    n_estimators=100, 
    learning_rate=best_params['learning_rate'], 
    max_depth=best_params['max_depth'], 
    random_state=42
)
gb_final.fit(X_train_start_scaled, y_train_start)

# Final evaluation
y_pred_final = gb_final.predict(X_test_start_scaled)
final_accuracy = (y_pred_final == y_test_start).mean()

print(f"\\nFinal Startups Accuracy: {final_accuracy:.4f}")

# Visualize results
plt.figure(figsize=(15, 5))

# IRIS confusion matrix
plt.subplot(1, 3, 1)
cm_iris = confusion_matrix(y_test_iris, y_pred_iris)
plt.imshow(cm_iris, interpolation='nearest', cmap=plt.cm.Blues)
plt.title('IRIS Confusion Matrix')
plt.colorbar()

# Startups confusion matrix
plt.subplot(1, 3, 2)
cm_start = confusion_matrix(y_test_start, y_pred_start)
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
    evaluationCriteria: [
      "Implement Gradient Boosting correctly",
      "Apply to both IRIS and 50_Startups datasets",
      "Evaluate using precision and recall metrics",
      "Tune hyperparameters for better performance",
      "Compare performance across datasets"
    ],
    hints: [
      "Use sklearn's GradientBoostingClassifier",
      "Try different learning rates and max depths",
      "Evaluate precision and recall for each class",
      "Use cross-validation for robust evaluation",
      "Analyze feature importance"
    ]
  },

  // CO5: XGBoost
  {
    name: "XGBoostIRISStartups",
    title: "XGBoost - IRIS & 50_Startups",
    description: "Write a Python program to implement XGBoost. i. IRIS dataset: Apply XGBoost to classify flower species and evaluate performance using confusion matrices. ii. 50_Startups dataset: Train an XGBoost model to predict success and optimize hyper parameters like learning rate and maximum depth for better accuracy.",
    difficulty: 4,
    estimatedTime: 95,
    category: "Ensemble Learning",
    tags: ["xgboost", "classification", "iris", "startups", "hyperparameter-tuning"],
    objectives: [
      "Implement XGBoost for classification",
      "Apply to IRIS dataset for multi-class classification",
      "Apply to 50_Startups dataset",
      "Optimize hyperparameters (learning rate, max depth)",
      "Evaluate using confusion matrices"
    ],
    prerequisites: [
      "Understanding of XGBoost concepts",
      "Hyperparameter optimization techniques",
      "Advanced classification metrics"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
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

# Test different hyperparameters on IRIS
print("\\nTesting different hyperparameters on IRIS:")
learning_rates = [0.01, 0.1, 0.2]
max_depths = [3, 6, 9]

best_accuracy_iris = 0
best_params_iris = None

for lr in learning_rates:
    for depth in max_depths:
        xgb_iris = XGBoostClassifier(
            n_estimators=50, learning_rate=lr, max_depth=depth
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

# Train final IRIS model
xgb_iris_final = XGBoostClassifier(
    n_estimators=200,
    learning_rate=best_params_iris['learning_rate'],
    max_depth=best_params_iris['max_depth']
)
xgb_iris_final.fit(X_train_iris_scaled, y_train_iris)
y_pred_iris_final = xgb_iris_final.predict(X_test_iris_scaled)

print("\\nFinal IRIS Results:")
print(classification_report(y_test_iris, y_pred_iris_final, target_names=target_names))

# Part II: 50_Startups Dataset
print("\\n" + "=" * 50)
print("PART II: 50_STARTUPS DATASET - XGBOOST")
print("=" * 50)

def load_startups_dataset():
    """Load 50_Startups dataset"""
    np.random.seed(42)
    n_samples = 400
    
    data = {
        'rd_spend': np.random.exponential(80000, n_samples),
        'administration': np.random.exponential(25000, n_samples),
        'marketing_spend': np.random.exponential(40000, n_samples),
        'state': np.random.choice(['California', 'New York', 'Florida', 'Texas'], n_samples),
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

# Load startups data
df_startups = load_startups_dataset()

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

# Hyperparameter optimization for startups
print("\\nOptimizing XGBoost hyperparameters for Startups...")

param_grid = {
    'n_estimators': [50, 100, 200],
    'learning_rate': [0.01, 0.1, 0.2],
    'max_depth': [3, 6, 9],
    'subsample': [0.8, 1.0]
}

if XGB_AVAILABLE:
    xgb_start = xgb.XGBClassifier(
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss'
    )
    
    grid_search = GridSearchCV(
        xgb_start, param_grid, cv=5, scoring='accuracy', n_jobs=-1, verbose=1
    )
    
    grid_search.fit(X_train_start_scaled, y_train_start)
    
    best_params_start = grid_search.best_params_
    best_score_start = grid_search.best_score_
    
    print(f"\\nBest parameters for Startups: {best_params_start}")
    print(f"Best cross-validation accuracy: {best_score_start:.4f}")
else:
    # Fallback to manual search
    best_score_start = 0
    best_params_start = None
    
    for lr in learning_rates:
        for depth in max_depths:
            xgb_start = XGBoostClassifier(
                n_estimators=100, learning_rate=lr, max_depth=depth
            )
            
            xgb_start.fit(X_train_start_scaled, y_train_start)
            y_pred_start = xgb_start.predict(X_test_start_scaled)
            score = accuracy_score(y_test_start, y_pred_start)
            
            if score > best_score_start:
                best_score_start = score
                best_params_start = {'learning_rate': lr, 'max_depth': depth}

# Train final startups model
xgb_start_final = XGBoostClassifier(
    n_estimators=200,
    learning_rate=best_params_start['learning_rate'],
    max_depth=best_params_start['max_depth']
)
xgb_start_final.fit(X_train_start_scaled, y_train_start)
y_pred_start_final = xgb_start_final.predict(X_test_start_scaled)

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
    feature_importance_iris = xgb_iris_final.model.feature_importances_
    feature_names_iris = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width']
    plt.barh(feature_names_iris, feature_importance_iris)
    plt.title('IRIS Feature Importance')
    plt.xlabel('Importance')

plt.tight_layout()
plt.show()

print("\\n" + "=" * 60)
print("XGBoost Implementation Complete")
print("=" * 60)
print(f"\\nIRIS Best Accuracy: {best_accuracy_iris:.4f}")
print(f"Startups Best Accuracy: {best_score_start:.4f}")
print(f"IRIS Best Parameters: {best_params_iris}")
print(f"Startups Best Parameters: {best_params_start}")`,
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
    console.log('✅ Exact Advanced Labs Part 3 Seeder: Connected to MongoDB');
    return conn;
  } catch (error) {
    console.error('❌ Exact Advanced Labs Part 3 Seeder: MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed exact advanced labs part 3
const seedExactAdvancedLabsPart3 = async () => {
  try {
    // Clear existing exact advanced labs part 3
    await mongoose.connection.db.collection('exactadvancedlabspart3').deleteMany({});
    console.log('🗑️ Cleared existing exact advanced labs part 3');

    // Insert exact advanced labs part 3
    const result = await mongoose.connection.db.collection('exactadvancedlabspart3').insertMany(exactAdvancedLabsPart3);
    console.log(`✅ Created ${result.insertedCount} exact advanced labs part 3`);

    // Log lab details
    exactAdvancedLabsPart3.forEach((lab, index) => {
      console.log(`\n🔬 Lab ${index + 1}: ${lab.title}`);
      console.log(`   Name: ${lab.name}`);
      console.log(`   Category: ${lab.category}`);
      console.log(`   Difficulty: ${lab.difficulty}/5`);
      console.log(`   Time: ${lab.estimatedTime} minutes`);
      console.log(`   Tags: ${lab.tags.join(', ')}`);
    });

    console.log('\n🎉 Exact advanced labs part 3 seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding exact advanced labs part 3:', error);
  }
};

// Main seeder function
const main = async () => {
  await connectDB();
  await seedExactAdvancedLabsPart3();
  process.exit(0);
};

// Run seeder
main();

import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Lab from "../models/Lab.js";
import Module from "../models/Module.js";

dotenv.config();
await connectDB();

const createAdvancedLabs = async () => {
  try {
    console.log("🤖 Creating advanced AIML labs...\n");

    await Lab.deleteMany({});
    
    const modules = await Module.find();
    const labsData = [];

    // Lab 4: Logistic Regression
    labsData.push({
      title: "Logistic Regression Classification",
      description: "Implement logistic regression for classification on IRIS and 50_Startups datasets with comprehensive evaluation.",
      difficulty: 2,
      estimatedTime: 75,
      tags: ["logistic-regression", "classification", "iris", "startups"],
      scenario: "both",
      environment: "simulated",
      skills: ["Python", "Scikit-learn", "Classification", "Evaluation Metrics"],
      content: {
        code: `# Logistic Regression Implementation
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns

# IRIS Dataset Classification
def classify_iris():
    from sklearn.datasets import load_iris
    iris = load_iris()
    X, y = iris.data, iris.target
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    model = LogisticRegression(random_state=42)
    model.fit(X_train_scaled, y_train)
    y_pred = model.predict(X_test_scaled)
    
    print("IRIS Classification Results:")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("\\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title('IRIS Confusion Matrix')
    plt.show()

# 50_Startups Dataset
def classify_startups():
    df = pd.read_csv('50_Startups.csv')
    
    # Preprocessing
    X = df.drop('Profit', axis=1)
    y = (df['Profit'] > 0).astype(int)  # Binary classification
    
    X = pd.get_dummies(X, drop_first=True)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Compare with and without scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Without scaling
    model_no_scale = LogisticRegression(random_state=42)
    model_no_scale.fit(X_train, y_train)
    y_pred_no_scale = model_no_scale.predict(X_test)
    
    # With scaling
    model_scaled = LogisticRegression(random_state=42)
    model_scaled.fit(X_train_scaled, y_train)
    y_pred_scaled = model_scaled.predict(X_test_scaled)
    
    print("50_Startups Classification Results:")
    print(f"Without Scaling - Accuracy: {accuracy_score(y_test, y_pred_no_scale):.4f}")
    print(f"With Scaling - Accuracy: {accuracy_score(y_test, y_pred_scaled):.4f}")

if __name__ == "__main__":
    classify_iris()
    classify_startups()`
      }
    });

    // Lab 5: Decision Tree ID3 Algorithm
    labsData.push({
      title: "Decision Tree ID3 Algorithm",
      description: "Implement ID3 decision tree algorithm from scratch using Weather dataset for play prediction.",
      difficulty: 3,
      estimatedTime: 90,
      tags: ["decision-tree", "id3", "classification", "from-scratch"],
      scenario: "both",
      environment: "simulated",
      skills: ["Python", "Algorithm Implementation", "Decision Trees", "Information Theory"],
      content: {
        code: `# ID3 Decision Tree Implementation
import pandas as pd
import numpy as np
from collections import Counter

class DecisionTreeID3:
    def __init__(self, max_depth=None):
        self.max_depth = max_depth
        self.tree = None
    
    def calculate_entropy(self, y):
        counts = Counter(y)
        probabilities = [count/len(y) for count in counts.values()]
        entropy = -sum(p * np.log2(p) for p in probabilities if p > 0)
        return entropy
    
    def calculate_information_gain(self, X, y, feature):
        total_entropy = self.calculate_entropy(y)
        values, counts = np.unique(X[feature], return_counts=True)
        
        weighted_entropy = 0
        for value, count in zip(values, counts):
            subset_y = y[X[feature] == value]
            weighted_entropy += (count/len(y)) * self.calculate_entropy(subset_y)
        
        return total_entropy - weighted_entropy
    
    def find_best_split(self, X, y):
        best_feature = None
        best_gain = 0
        
        for feature in X.columns:
            gain = self.calculate_information_gain(X, y, feature)
            if gain > best_gain:
                best_gain = gain
                best_feature = feature
        
        return best_feature
    
    def build_tree(self, X, y, depth=0):
        # Base cases
        if len(np.unique(y)) == 1:
            return y.iloc[0]
        
        if len(X.columns) == 0 or (self.max_depth and depth >= self.max_depth):
            return Counter(y).most_common(1)[0][0]
        
        # Find best split
        best_feature = self.find_best_split(X, y)
        
        if best_feature is None:
            return Counter(y).most_common(1)[0][0]
        
        # Create tree
        tree = {best_feature: {}}
        remaining_features = [col for col in X.columns if col != best_feature]
        
        for value in X[best_feature].unique():
            subset_X = X[X[best_feature] == value].drop(best_feature, axis=1)
            subset_y = y[X[best_feature] == value]
            tree[best_feature][value] = self.build_tree(subset_X, subset_y, depth + 1)
        
        return tree
    
    def fit(self, X, y):
        self.tree = self.build_tree(X, y)
    
    def predict_sample(self, sample, tree):
        if not isinstance(tree, dict):
            return tree
        
        feature = list(tree.keys())[0]
        value = sample[feature]
        
        if value not in tree[feature]:
            return Counter(y).most_common(1)[0][0]
        
        return self.predict_sample(sample, tree[feature][value])
    
    def predict(self, X):
        return [self.predict_sample(X.iloc[i], self.tree) for i in range(len(X))]

# Weather Dataset
def load_weather_data():
    data = {
        'Outlook': ['Sunny', 'Sunny', 'Overcast', 'Rain', 'Rain', 'Overcast', 'Sunny', 'Sunny', 'Rain'],
        'Temperature': ['Hot', 'Hot', 'Mild', 'Cool', 'Cool', 'Mild', 'Hot', 'Mild', 'Cool'],
        'Humidity': ['High', 'High', 'Normal', 'High', 'Normal', 'High', 'Normal', 'High', 'Normal'],
        'Wind': ['Weak', 'Strong', 'Weak', 'Weak', 'Strong', 'Weak', 'Strong', 'Weak', 'Strong'],
        'Play': ['No', 'No', 'Yes', 'Yes', 'Yes', 'Yes', 'No', 'Yes', 'No']
    }
    return pd.DataFrame(data)

# Main execution
if __name__ == "__main__":
    df = load_weather_data()
    X = df.drop('Play', axis=1)
    y = df['Play']
    
    # Train ID3 tree
    dt = DecisionTreeID3(max_depth=3)
    dt.fit(X, y)
    
    print("Decision Tree Structure:")
    print(dt.tree)
    
    # Predict new sample
    new_sample = pd.DataFrame([{
        'Outlook': 'Sunny',
        'Temperature': 'Mild',
        'Humidity': 'High',
        'Wind': 'Weak'
    }])
    
    prediction = dt.predict(new_sample)
    print(f"Prediction for new sample: {prediction[0]}")`
      }
    });

    // Lab 6: K-Nearest Neighbors
    labsData.push({
      title: "K-Nearest Neighbors (KNN) Algorithm",
      description: "Implement KNN algorithm for IRIS and Car Evaluation datasets with k-optimization.",
      difficulty: 2,
      estimatedTime: 80,
      tags: ["knn", "classification", "iris", "car-evaluation"],
      scenario: "both",
      environment: "simulated",
      skills: ["Python", "Scikit-learn", "Distance Metrics", "Hyperparameter Tuning"],
      content: {
        code: `# KNN Implementation
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# IRIS Classification with KNN
def knn_iris():
    from sklearn.datasets import load_iris
    iris = load_iris()
    X, y = iris.data, iris.target
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Find optimal k
    k_range = range(1, 31)
    scores = []
    
    for k in k_range:
        knn = KNeighborsClassifier(n_neighbors=k)
        knn.fit(X_train_scaled, y_train)
        y_pred = knn.predict(X_test_scaled)
        scores.append(accuracy_score(y_test, y_pred))
    
    optimal_k = k_range[np.argmax(scores)]
    
    plt.plot(k_range, scores)
    plt.xlabel('K Value')
    plt.ylabel('Accuracy')
    plt.title('KNN Accuracy vs K Value')
    plt.show()
    
    print(f"Optimal K: {optimal_k}")
    
    # Train with optimal k
    knn_optimal = KNeighborsClassifier(n_neighbors=optimal_k)
    knn_optimal.fit(X_train_scaled, y_train)
    y_pred = knn_optimal.predict(X_test_scaled)
    
    print(f"IRIS KNN Accuracy: {accuracy_score(y_test, y_pred):.4f}")

# Car Evaluation Dataset
def knn_car_evaluation():
    # Load dataset (simplified example)
    data = {
        'buying': ['vhigh', 'vhigh', 'med', 'low', 'vhigh', 'vhigh', 'med', 'low'],
        'maint': ['vhigh', 'vhigh', 'med', 'high', 'low', 'med', 'low', 'med'],
        'doors': ['2', '3', '4', '5more', '2', '3', '4', '5more'],
        'persons': ['2', '4', 'more', '2', '4', 'more', '2', '4'],
        'lug_boot': ['small', 'med', 'big', 'small', 'med', 'big', 'small', 'med'],
        'safety': ['low', 'med', 'high', 'low', 'med', 'high', 'low', 'high'],
        'acceptability': ['unacc', 'unacc', 'acc', 'good', 'vgood', 'unacc', 'acc', 'good']
    }
    df = pd.DataFrame(data)
    
    # Preprocess categorical features
    X = pd.get_dummies(df.drop('acceptability', axis=1))
    y = df['acceptability']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    
    # Grid search for optimal k
    param_grid = {'n_neighbors': range(1, 21)}
    knn = KNeighborsClassifier()
    grid_search = GridSearchCV(knn, param_grid, cv=5, scoring='accuracy')
    grid_search.fit(X_train, y_train)
    
    best_k = grid_search.best_params_['n_neighbors']
    best_knn = grid_search.best_estimator_
    
    y_pred = best_knn.predict(X_test)
    
    print("Car Evaluation KNN Results:")
    print(f"Best K: {best_k}")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("\\nClassification Report:")
    print(classification_report(y_test, y_pred))

if __name__ == "__main__":
    knn_iris()
    knn_car_evaluation()`
      }
    });

    // Lab 7: Hierarchical Clustering
    labsData.push({
      title: "Hierarchical Clustering with Wholesale Customers",
      description: "Implement agglomerative hierarchical clustering on Wholesale Customers dataset with dendrogram visualization.",
      difficulty: 3,
      estimatedTime: 85,
      tags: ["hierarchical-clustering", "wholesale-customers", "dendrogram", "silhouette"],
      scenario: "both",
      environment: "simulated",
      skills: ["Python", "Scikit-learn", "Clustering", "Visualization"],
      content: {
        code: `# Hierarchical Clustering Implementation
import pandas as pd
import numpy as np
from sklearn.cluster import AgglomerativeClustering
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt
import scipy.cluster.hierarchy as sch

# Load Wholesale Customers Dataset
def load_wholesale_data():
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00292/Wholesale%20customers%20data.csv"
    df = pd.read_csv(url)
    return df

# Preprocess Data
def preprocess_data(df):
    # Remove Channel and Region columns for clustering
    df_numeric = df.drop(['Channel', 'Region'], axis=1)
    
    # Scale features
    scaler = StandardScaler()
    df_scaled = scaler.fit_transform(df_numeric)
    
    return df_scaled, scaler, df_numeric.columns

# Dendrogram Visualization
def plot_dendrogram(data, feature_names):
    plt.figure(figsize=(12, 8))
    dendrogram = sch.dendrogram(sch.linkage(data, method='ward'))
    plt.title('Wholesale Customers Dendrogram')
    plt.xlabel('Customers')
    plt.ylabel('Distance')
    plt.show()

# Hierarchical Clustering Analysis
def hierarchical_clustering_analysis():
    df = load_wholesale_data()
    df_scaled, scaler, feature_names = preprocess_data(df)
    
    # Determine optimal number of clusters using dendrogram
    plot_dendrogram(df_scaled[:50], feature_names)  # Sample for visualization
    
    # Try different number of clusters
    cluster_range = range(2, 11)
    silhouette_scores = []
    
    for n_clusters in cluster_range:
        clustering = AgglomerativeClustering(n_clusters=n_clusters, linkage='ward')
        cluster_labels = clustering.fit_predict(df_scaled)
        score = silhouette_score(df_scaled, cluster_labels)
        silhouette_scores.append(score)
    
    # Plot silhouette scores
    plt.figure(figsize=(10, 6))
    plt.plot(cluster_range, silhouette_scores, 'bo-')
    plt.xlabel('Number of Clusters')
    plt.ylabel('Silhouette Score')
    plt.title('Silhouette Score vs Number of Clusters')
    plt.show()
    
    optimal_clusters = cluster_range[np.argmax(silhouette_scores)]
    print(f"Optimal number of clusters: {optimal_clusters}")
    
    # Final clustering
    final_clustering = AgglomerativeClustering(n_clusters=optimal_clusters, linkage='ward')
    cluster_labels = final_clustering.fit_predict(df_scaled)
    
    # Analyze clusters
    df['Cluster'] = cluster_labels
    cluster_analysis = df.groupby('Cluster').agg({
        'Fresh': ['mean', 'std'],
        'Milk': ['mean', 'std'],
        'Grocery': ['mean', 'std'],
        'Frozen': ['mean', 'std'],
        'Detergents_Paper': ['mean', 'std'],
        'Delicassen': ['mean', 'std']
    })
    
    print("\\nCluster Analysis:")
    print(cluster_analysis)
    
    return cluster_labels, optimal_clusters

if __name__ == "__main__":
    hierarchical_clustering_analysis()`
      }
    });

    // Lab 8: K-Means Clustering
    labsData.push({
      title: "K-Means Clustering with Wholesale Customers",
      description: "Implement K-Means clustering on Wholesale Customers dataset with elbow method optimization.",
      difficulty: 2,
      estimatedTime: 70,
      tags: ["k-means", "clustering", "wholesale-customers", "elbow-method"],
      scenario: "both",
      environment: "simulated",
      skills: ["Python", "Scikit-learn", "Clustering", "Customer Segmentation"],
      content: {
        code: `# K-Means Clustering Implementation
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt

# Load and preprocess data (reuse from Lab 7)
def preprocess_for_kmeans(df):
    df_numeric = df.drop(['Channel', 'Region'], axis=1)
    scaler = StandardScaler()
    df_scaled = scaler.fit_transform(df_numeric)
    return df_scaled, scaler

# Elbow Method
def find_optimal_k(data, max_k=10):
    inertias = []
    k_range = range(1, max_k + 1)
    
    for k in k_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        kmeans.fit(data)
        inertias.append(kmeans.inertia_)
    
    # Plot elbow curve
    plt.figure(figsize=(10, 6))
    plt.plot(k_range, inertias, 'bo-')
    plt.xlabel('Number of Clusters (K)')
    plt.ylabel('Inertia')
    plt.title('Elbow Method For Optimal K')
    plt.show()
    
    # Find elbow point (simplified - look for maximum change)
    differences = np.diff(inertias)
    optimal_k = np.argmin(differences) + 2  # +2 because diff reduces array size
    
    return optimal_k, inertias

# K-Means Analysis
def kmeans_analysis():
    df = load_wholesale_data()
    df_scaled, scaler = preprocess_for_kmeans(df)
    
    # Find optimal K
    optimal_k, inertias = find_optimal_k(df_scaled)
    print(f"Optimal K from elbow method: {optimal_k}")
    
    # Final K-Means clustering
    kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(df_scaled)
    
    # Calculate silhouette score
    silhouette_avg = silhouette_score(df_scaled, cluster_labels)
    print(f"Silhouette Score: {silhouette_avg:.4f}")
    
    # Add cluster labels to original data
    df['Cluster'] = cluster_labels
    
    # Customer segmentation analysis
    cluster_profiles = df.groupby('Cluster').agg({
        'Fresh': ['mean', 'count'],
        'Milk': ['mean'],
        'Grocery': ['mean'],
        'Frozen': ['mean'],
        'Detergents_Paper': ['mean'],
        'Delicassen': ['mean']
    })
    
    print("\\nCustomer Segments:")
    print(cluster_profiles)
    
    # Visualize clusters (2D projection)
    plt.figure(figsize=(12, 8))
    scatter = plt.scatter(df_scaled[:, 0], df_scaled[:, 1], c=cluster_labels, cmap='viridis')
    plt.colorbar(scatter)
    plt.xlabel('Feature 1 (Scaled)')
    plt.ylabel('Feature 2 (Scaled)')
    plt.title('Customer Segments Visualization')
    plt.show()
    
    return kmeans, cluster_labels

if __name__ == "__main__":
    kmeans_analysis()`
      }
    });

    // Lab 9: Gradient Boosting
    labsData.push({
      title: "Gradient Boosting Implementation",
      description: "Implement Gradient Boosting for classification on IRIS and 50_Startups datasets with hyperparameter tuning.",
      difficulty: 4,
      estimatedTime: 95,
      tags: ["gradient-boosting", "ensemble", "classification", "hyperparameter-tuning"],
      scenario: "both",
      environment: "simulated",
      skills: ["Python", "Scikit-learn", "Ensemble Methods", "Performance Tuning"],
      content: {
        code: `# Gradient Boosting Implementation
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report, accuracy_score, precision_score, recall_score
from sklearn.preprocessing import StandardScaler

# Gradient Boosting on IRIS
def gradient_boosting_iris():
    from sklearn.datasets import load_iris
    iris = load_iris()
    X, y = iris.data, iris.target
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    
    # Hyperparameter tuning
    param_grid = {
        'n_estimators': [50, 100, 200],
        'learning_rate': [0.01, 0.1, 0.2],
        'max_depth': [3, 4, 5]
    }
    
    gb = GradientBoostingClassifier(random_state=42)
    grid_search = GridSearchCV(gb, param_grid, cv=5, scoring='accuracy')
    grid_search.fit(X_train, y_train)
    
    best_gb = grid_search.best_estimator_
    y_pred = best_gb.predict(X_test)
    
    print("Gradient Boosting IRIS Results:")
    print(f"Best Parameters: {grid_search.best_params_}")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("\\nPer-Class Performance:")
    
    # Per-class metrics
    for i in range(3):
        class_precision = precision_score(y_test, y_pred, average=None)[i]
        class_recall = recall_score(y_test, y_pred, average=None)[i]
        print(f"Class {i}: Precision={class_precision:.4f}, Recall={class_recall:.4f}")

# Gradient Boosting on 50_Startups
def gradient_boosting_startups():
    df = pd.read_csv('50_Startups.csv')
    
    # Preprocessing
    X = df.drop('Profit', axis=1)
    y = (df['Profit'] > 0).astype(int)
    X = pd.get_dummies(X, drop_first=True)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # More extensive hyperparameter tuning
    param_grid = {
        'n_estimators': [100, 200, 300],
        'learning_rate': [0.05, 0.1, 0.2],
        'max_depth': [3, 5, 7],
        'subsample': [0.8, 0.9, 1.0]
    }
    
    gb = GradientBoostingClassifier(random_state=42)
    grid_search = GridSearchCV(gb, param_grid, cv=5, scoring='f1')
    grid_search.fit(X_train, y_train)
    
    best_gb = grid_search.best_estimator_
    y_pred = best_gb.predict(X_test)
    
    print("\\nGradient Boosting 50_Startups Results:")
    print(f"Best Parameters: {grid_search.best_params_}")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("\\nClassification Report:")
    print(classification_report(y_test, y_pred))

if __name__ == "__main__":
    gradient_boosting_iris()
    gradient_boosting_startups()`
      }
    });

    // Lab 10: XGBoost Implementation
    labsData.push({
      title: "XGBoost Advanced Implementation",
      description: "Implement XGBoost for classification on IRIS and 50_Startups with advanced hyperparameter optimization.",
      difficulty: 4,
      estimatedTime: 100,
      tags: ["xgboost", "ensemble", "classification", "hyperparameter-optimization"],
      scenario: "both",
      environment: "simulated",
      skills: ["Python", "XGBoost", "Ensemble Methods", "Advanced Optimization"],
      content: {
        code: `# XGBoost Implementation
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns

# XGBoost on IRIS Dataset
def xgboost_iris():
    from sklearn.datasets import load_iris
    iris = load_iris()
    X, y = iris.data, iris.target
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    
    # XGBoost parameter grid
    param_grid = {
        'n_estimators': [50, 100, 200],
        'learning_rate': [0.01, 0.1, 0.2],
        'max_depth': [3, 5, 7],
        'subsample': [0.8, 0.9, 1.0],
        'colsample_bytree': [0.8, 0.9, 1.0]
    }
    
    xgb_clf = xgb.XGBClassifier(random_state=42, use_label_encoder=False)
    grid_search = GridSearchCV(xgb_clf, param_grid, cv=5, scoring='accuracy')
    grid_search.fit(X_train, y_train)
    
    best_xgb = grid_search.best_estimator_
    y_pred = best_xgb.predict(X_test)
    
    print("XGBoost IRIS Results:")
    print(f"Best Parameters: {grid_search.best_params_}")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title('XGBoost IRIS Confusion Matrix')
    plt.show()

# XGBoost on 50_Startups
def xgboost_startups():
    df = pd.read_csv('50_Startups.csv')
    
    # Preprocessing
    X = df.drop('Profit', axis=1)
    y = (df['Profit'] > 0).astype(int)
    X = pd.get_dummies(X, drop_first=True)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Advanced XGBoost parameters
    param_grid = {
        'n_estimators': [100, 200, 500],
        'learning_rate': [0.01, 0.05, 0.1],
        'max_depth': [3, 5, 7],
        'min_child_weight': [1, 3, 5],
        'subsample': [0.7, 0.8, 0.9],
        'colsample_bytree': [0.7, 0.8, 0.9],
        'gamma': [0, 0.1, 0.2]
    }
    
    xgb_clf = xgb.XGBClassifier(random_state=42, use_label_encoder=False)
    grid_search = GridSearchCV(xgb_clf, param_grid, cv=5, scoring='f1')
    grid_search.fit(X_train, y_train)
    
    best_xgb = grid_search.best_estimator_
    y_pred = best_xgb.predict(X_test)
    
    print("\\nXGBoost 50_Startups Results:")
    print(f"Best Parameters: {grid_search.best_params_}")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("\\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Feature importance
    feature_importance = best_xgb.feature_importances_
    features = X_train.columns
    
    plt.figure(figsize=(10, 6))
    plt.barh(range(len(feature_importance)), feature_importance)
    plt.yticks(range(len(features)), features)
    plt.xlabel('Feature Importance')
    plt.title('XGBoost Feature Importance')
    plt.show()

if __name__ == "__main__":
    xgboost_iris()
    xgboost_startups()`
      }
    });

    // Insert all labs
    const createdLabs = await Lab.insertMany(labsData);
    console.log(`✅ Created ${createdLabs.length} advanced AIML labs`);

    console.log("\n🔬 Advanced Lab Summary:");
    createdLabs.forEach((lab, index) => {
      console.log(`${index + 1}. ${lab.title} (${lab.difficulty}/4, ${lab.estimatedTime}min)`);
    });

    console.log("\n🎉 Advanced labs creation completed!");
    
  } catch (error) {
    console.error("❌ Error creating labs:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdvancedLabs();

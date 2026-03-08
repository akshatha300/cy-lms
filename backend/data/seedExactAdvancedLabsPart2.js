import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Exact Advanced ML Labs Part 2 (CO3, CO4)
const exactAdvancedLabsPart2 = [
  // CO3: Decision Tree ID3
  {
    name: "DecisionTreeID3Weather",
    title: "Decision Tree ID3 - Weather Dataset",
    description: "Write a Python program to demonstrate the decision tree-based ID3 algorithm. Implement the ID3 algorithm to construct a decision tree for classification using an appropriate dataset. For example, Weather dataset can be used to predict play/no-play outcomes based on weather conditions.",
    difficulty: 4,
    estimatedTime: 85,
    category: "Supervised Learning",
    tags: ["decision-tree", "id3", "classification", "weather-dataset", "entropy"],
    objectives: [
      "Implement ID3 algorithm from scratch",
      "Calculate entropy and information gain",
      "Build decision tree recursively",
      "Predict outcomes for new samples"
    ],
    prerequisites: [
      "Understanding of decision trees",
      "Information theory concepts",
      "Weather dataset structure"
    ],
    starterCode: `import pandas as pd
import numpy as np
from collections import Counter
import math

class ID3DecisionTree:
    def __init__(self, max_depth=None):
        self.max_depth = max_depth
        self.tree = None
    
    def calculate_entropy(self, y):
        """Calculate entropy of a dataset"""
        label_counts = Counter(y)
        entropy = 0.0
        
        for count in label_counts.values():
            probability = count / len(y)
            entropy -= probability * math.log2(probability)
        
        return entropy
    
    def calculate_information_gain(self, X, y, feature_name):
        """Calculate information gain for a feature"""
        total_entropy = self.calculate_entropy(y)
        values, counts = np.unique(X[feature_name], return_counts=True)
        weighted_entropy = 0.0
        
        for i, value in enumerate(values):
            subset_y = y[X[feature_name] == value]
            subset_entropy = self.calculate_entropy(subset_y)
            weight = counts[i] / len(y)
            weighted_entropy += weight * subset_entropy
        
        information_gain = total_entropy - weighted_entropy
        return information_gain
    
    def find_best_feature(self, X, y, features):
        """Find the best feature to split on"""
        best_feature = None
        best_gain = -1
        
        for feature in features:
            gain = self.calculate_information_gain(X, y, feature)
            if gain > best_gain:
                best_gain = gain
                best_feature = feature
        
        return best_feature, best_gain
    
    def build_tree(self, X, y, features, depth=0):
        """Build decision tree recursively"""
        # Base cases
        if len(set(y)) == 1:  # All samples have same label
            return y.iloc[0]
        
        if len(features) == 0 or (self.max_depth and depth >= self.max_depth):
            return Counter(y).most_common(1)[0][0]
        
        # Find best feature to split
        best_feature, best_gain = self.find_best_feature(X, y, features)
        
        if best_gain == 0:  # No information gain
            return Counter(y).most_common(1)[0][0]
        
        # Create tree node
        tree = {best_feature: {}}
        remaining_features = [f for f in features if f != best_feature]
        
        # Split on best feature
        for value in X[best_feature].unique():
            subset_X = X[X[best_feature] == value]
            subset_y = y[X[best_feature] == value]
            
            if len(subset_y) == 0:
                tree[best_feature][value] = Counter(y).most_common(1)[0][0]
            else:
                tree[best_feature][value] = self.build_tree(
                    subset_X, subset_y, remaining_features, depth + 1
                )
        
        return tree
    
    def fit(self, X, y):
        """Fit the decision tree"""
        features = X.columns.tolist()
        self.tree = self.build_tree(X, y, features)
    
    def predict_sample(self, sample, tree=None):
        """Predict single sample"""
        if tree is None:
            tree = self.tree
        
        if not isinstance(tree, dict):
            return tree
        
        feature = list(tree.keys())[0]
        feature_value = sample[feature]
        
        if feature_value in tree[feature]:
            return self.predict_sample(sample, tree[feature][feature_value])
        else:
            # Return most common label if feature value not seen
            return Counter(y).most_common(1)[0][0]
    
    def predict(self, X):
        """Predict multiple samples"""
        predictions = []
        for _, sample in X.iterrows():
            prediction = self.predict_sample(sample)
            predictions.append(prediction)
        return predictions

# Load Weather dataset
def load_weather_dataset():
    """Load Weather dataset"""
    data = {
        'outlook': ['sunny', 'sunny', 'overcast', 'rainy', 'rainy', 'overcast', 'sunny', 'sunny'],
        'temperature': ['hot', 'hot', 'hot', 'mild', 'cool', 'cool', 'mild', 'hot'],
        'humidity': ['high', 'high', 'high', 'normal', 'normal', 'high', 'normal', 'high'],
        'windy': ['weak', 'strong', 'weak', 'weak', 'strong', 'weak', 'strong', 'weak'],
        'play': ['no', 'no', 'yes', 'yes', 'yes', 'yes', 'yes', 'no']
    }
    
    df = pd.DataFrame(data)
    return df

print("Decision Tree ID3 - Weather Dataset")
print("=" * 50)

# Load dataset
df = load_weather_dataset()

print(f"Dataset shape: {df.shape}")
print(f"Features: {df.drop('play', axis=1).columns.tolist()}")
print(f"Target: play")

# Separate features and target
X = df.drop('play', axis=1)
y = df['play']

# Build ID3 decision tree
print("\\nBuilding ID3 Decision Tree...")
id3 = ID3DecisionTree(max_depth=3)
id3.fit(X, y)

print("\\nDecision Tree Structure:")
print(id3.tree)

# Make predictions
predictions = id3.predict(X)

# Calculate accuracy
accuracy = (predictions == y).mean()
print(f"\\nTraining Accuracy: {accuracy:.4f}")

# Test with new samples
print("\\nTesting with new samples:")

test_samples = pd.DataFrame([
    {'outlook': 'sunny', 'temperature': 'hot', 'humidity': 'high', 'windy': 'weak'},
    {'outlook': 'overcast', 'temperature': 'mild', 'humidity': 'normal', 'windy': 'strong'},
    {'outlook': 'rainy', 'temperature': 'cool', 'humidity': 'normal', 'windy': 'weak'}
])

test_predictions = id3.predict(test_samples)

print("\\nTest Predictions:")
for i, (idx, sample) in enumerate(test_samples.iterrows()):
    print(f"Sample {i+1}: {sample.to_dict()} -> Predict: {test_predictions[i]}")

# Display tree in readable format
def print_tree(tree, indent=""):
    """Print tree in readable format"""
    if not isinstance(tree, dict):
        print(f"{indent}Prediction: {tree}")
        return
    
    feature = list(tree.keys())[0]
    print(f"{indent}{feature}?")
    
    for i, (value, subtree) in enumerate(tree[feature].items()):
        print(f"{indent}  {value}:")
        print_tree(subtree, indent + "    ")

print("\\nDecision Tree in readable format:")
print_tree(id3.tree)`,
    evaluationCriteria: [
      "Implement ID3 algorithm correctly",
      "Calculate entropy and information gain",
      "Build decision tree recursively",
      "Display tree structure clearly",
      "Predict outcomes for new samples"
    ],
    hints: [
      "Focus on entropy calculation",
      "Implement recursive tree building",
      "Handle base cases properly",
      "Consider maximum depth to prevent overfitting",
      "Test with various weather conditions"
    ]
  },

  // CO3: KNN
  {
    name: "KNNIRISCarEvaluation",
    title: "K-Nearest Neighbors - IRIS & Car Evaluation",
    description: "Write a Python program to implement K-Nearest Neighbors (KNN) algorithm. i. IRIS dataset: Perform classification to determine species using features like petal width and length. ii. Car Evaluation dataset: Predict the acceptability of car configurations using features like price and safety.",
    difficulty: 3,
    estimatedTime: 80,
    category: "Supervised Learning",
    tags: ["knn", "classification", "iris", "car-evaluation", "distance-metrics"],
    objectives: [
      "Implement KNN algorithm from scratch",
      "Apply to IRIS dataset",
      "Apply to Car Evaluation dataset",
      "Optimize K value for best accuracy"
    ],
    prerequisites: [
      "Understanding of KNN algorithm",
      "Distance metrics knowledge",
      "IRIS and Car Evaluation datasets"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt

class KNN:
    def __init__(self, k=3):
        self.k = k
    
    def euclidean_distance(self, x1, x2):
        """Calculate Euclidean distance between two points"""
        return np.sqrt(np.sum((x1 - x2) ** 2))
    
    def get_neighbors(self, X_train, y_train, test_point):
        """Find k nearest neighbors"""
        distances = []
        
        for i, train_point in enumerate(X_train):
            dist = self.euclidean_distance(test_point, train_point)
            distances.append((dist, i, y_train[i]))
        
        # Sort by distance
        distances.sort(key=lambda x: x[0])
        
        # Get k nearest neighbors
        return distances[:self.k]
    
    def predict(self, X_train, y_train, test_point):
        """Predict class for a single test point"""
        neighbors = self.get_neighbors(X_train, y_train, test_point)
        
        # Get the labels of neighbors
        labels = [neighbor[2] for neighbor in neighbors]
        
        # Majority vote
        most_common = max(set(labels), key=labels.count)
        return most_common
    
    def predict_batch(self, X_train, y_train, X_test):
        """Predict for multiple test points"""
        predictions = []
        
        for test_point in X_test:
            prediction = self.predict(X_train, y_train, test_point)
            predictions.append(prediction)
        
        return predictions

# Part I: IRIS Dataset
print("=" * 50)
print("PART I: IRIS DATASET - KNN")
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

# Test different K values
k_values = [1, 3, 5, 7, 9]
k_accuracies = []

print("\\nTesting different K values on IRIS dataset:")
for k in k_values:
    knn = KNN(k=k)
    y_pred = knn.predict_batch(X_train_iris, y_train_iris, X_test_iris)
    accuracy = accuracy_score(y_test_iris, y_pred)
    k_accuracies.append(accuracy)
    print(f"K={k}: Accuracy = {accuracy:.4f}")

# Find best K
best_k = k_values[np.argmax(k_accuracies)]
print(f"\\nBest K for IRIS: {best_k} (Accuracy: {max(k_accuracies):.4f})")

# Part II: Car Evaluation Dataset
print("\\n" + "=" * 50)
print("PART II: CAR EVALUATION DATASET - KNN")
print("=" * 50)

def load_car_evaluation_dataset():
    """Load Car Evaluation dataset"""
    # Create sample dataset (in practice, load from UCI repository)
    np.random.seed(42)
    n_samples = 300
    
    data = {
        'buying': np.random.choice(['vhigh', 'high', 'med', 'low'], n_samples),
        'maint': np.random.choice(['vhigh', 'high', 'med', 'low'], n_samples),
        'doors': np.random.choice([2, 3, 4, 5], n_samples),
        'persons': np.random.choice([2, 4, 5], n_samples),
        'lug_boot': np.random.choice(['big', 'med', 'small'], n_samples),
        'safety': np.random.choice(['low', 'med', 'high'], n_samples),
        'acceptability': np.random.choice(['unacc', 'acc', 'good', 'vgood'], n_samples)
    }
    
    df = pd.DataFrame(data)
    return df

# Load and preprocess car dataset
df_car = load_car_evaluation_dataset()

car_features = ['buying', 'maint', 'doors', 'persons', 'lug_boot', 'safety']
X_car = pd.get_dummies(df_car[car_features], drop_first=True)
y_car = df_car['acceptability']

# Map target to numerical
acceptability_map = {'unacc': 0, 'acc': 1, 'good': 2, 'vgood': 3}
y_car_num = y_car.map(acceptability_map)

# Split car data
X_train_car, X_test_car, y_train_car, y_test_car = train_test_split(
    X_car, y_car_num, test_size=0.3, random_state=42, stratify=y_car_num
)

# Test different K values on car dataset
print("\\nTesting different K values on Car Evaluation dataset:")
car_accuracies = []

for k in k_values:
    knn = KNN(k=k)
    y_pred_car = knn.predict_batch(X_train_car, y_train_car, X_test_car)
    accuracy_car = accuracy_score(y_test_car, y_pred_car)
    car_accuracies.append(accuracy_car)
    print(f"K={k}: Accuracy = {accuracy_car:.4f}")

# Best K for car dataset
best_k_car = k_values[np.argmax(car_accuracies)]
print(f"\\nBest K for Car: {best_k_car} (Accuracy: {max(car_accuracies):.4f})")

# Visualize results
plt.figure(figsize=(12, 5))

# Plot 1: K vs Accuracy for IRIS
plt.subplot(1, 2, 1)
plt.plot(k_values, k_accuracies, marker='o', label='IRIS')
plt.xlabel('K Value')
plt.ylabel('Accuracy')
plt.title('KNN Performance on IRIS Dataset')
plt.legend()
plt.grid(True)

# Plot 2: K vs Accuracy for Car
plt.subplot(1, 2, 2)
plt.plot(k_values, car_accuracies, marker='s', label='Car Evaluation')
plt.xlabel('K Value')
plt.ylabel('Accuracy')
plt.title('KNN Performance on Car Dataset')
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()

# Final evaluation with best K
print("\\nFinal Evaluation with Best K:")

# IRIS with best K
knn_iris_best = KNN(k=best_k)
y_pred_iris_best = knn_iris_best.predict_batch(X_train_iris, y_train_iris, X_test_iris)
accuracy_iris_best = accuracy_score(y_test_iris, y_pred_iris_best)

print(f"IRIS Best Accuracy (K={best_k}): {accuracy_iris_best:.4f}")
print("\\nIRIS Classification Report:")
print(classification_report(y_test_iris, y_pred_iris_best, target_names=target_names))

# Car with best K
knn_car_best = KNN(k=best_k_car)
y_pred_car_best = knn_car_best.predict_batch(X_train_car, y_train_car, X_test_car)
accuracy_car_best = accuracy_score(y_test_car, y_pred_car_best)

print(f"\\nCar Best Accuracy (K={best_k_car}): {accuracy_car_best:.4f}")
print("\\nCar Classification Report:")
print(classification_report(y_test_car, y_pred_car_best))`,
    evaluationCriteria: [
      "Implement KNN algorithm correctly",
      "Apply to both IRIS and Car Evaluation datasets",
      "Test different K values",
      "Find optimal K for each dataset",
      "Compare performance between datasets"
    ],
    hints: [
      "Implement distance calculation properly",
      "Use majority voting for prediction",
      "Test K values from 1 to 9",
      "Consider computational complexity",
      "Use appropriate evaluation metrics"
    ]
  },

  // CO4: Hierarchical Clustering
  {
    name: "HierarchicalClusteringWholesale",
    title: "Hierarchical Clustering - Wholesale Customers",
    description: "Write a Python program to implement hierarchical clustering with the Wholesale Customers dataset. This experiment involves grouping customers based on purchasing behaviour using agglomerative hierarchical clustering. Visualize the dendrogram to determine the optimal number of clusters.",
    difficulty: 4,
    estimatedTime: 85,
    category: "Unsupervised Learning",
    tags: ["hierarchical-clustering", "agglomerative", "wholesale-customers", "dendrogram", "silhouette"],
    objectives: [
      "Implement hierarchical clustering algorithm",
      "Apply to Wholesale Customers dataset",
      "Create and visualize dendrogram",
      "Determine optimal number of clusters",
      "Evaluate cluster quality using silhouette scores"
    ],
    prerequisites: [
      "Understanding of hierarchical clustering",
      "Dendrogram interpretation",
      "Silhouette analysis"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import scipy.cluster.hierarchy as sch

# Load Wholesale Customers dataset
def load_wholesale_dataset():
    """Load Wholesale Customers dataset"""
    # Create sample dataset (in practice, load from UCI repository)
    np.random.seed(42)
    n_samples = 440
    
    data = {
        'fresh': np.random.lognormal(8, 1, n_samples),
        'milk': np.random.lognormal(6, 0.8, n_samples),
        'grocery': np.random.lognormal(7, 0.9, n_samples),
        'frozen': np.random.lognormal(5, 1.2, n_samples),
        'detergents_paper': np.random.lognormal(4, 0.7, n_samples),
        'delicassen': np.random.lognormal(3, 0.6, n_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Add customer segments (hidden structure)
    segment = np.random.choice([0, 1, 2], n_samples, p=[0.4, 0.3, 0.3])
    
    # Add segment-specific patterns
    df.loc[segment == 0, 'fresh'] *= 1.5  # Restaurant segment
    df.loc[segment == 0, 'milk'] *= 1.3
    df.loc[segment == 1, 'grocery'] *= 1.2  # Retail segment
    df.loc[segment == 1, 'detergents_paper'] *= 1.1
    df.loc[segment == 2, 'frozen'] *= 1.4  # Hotel segment
    df.loc[segment == 2, 'delicassen'] *= 1.6
    
    return df

# Load dataset
df = load_wholesale_dataset()

print("Hierarchical Clustering - Wholesale Customers")
print("=" * 50)
print(f"Dataset Shape: {df.shape}")

# Preprocess data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df)

print("\\nPerforming Hierarchical Clustering...")

# Perform hierarchical clustering
# Try different linkage methods
linkage_methods = ['ward', 'complete', 'average', 'single']
cluster_range = range(2, 11)  # 2 to 10 clusters

results = []

print("Testing different linkage methods and cluster numbers:")
for linkage in linkage_methods:
    for n_clusters in cluster_range:
        # Perform clustering
        clustering = AgglomerativeClustering(
            n_clusters=n_clusters,
            linkage=linkage,
            affinity='euclidean'
        )
        
        cluster_labels = clustering.fit_predict(X_scaled)
        
        # Calculate silhouette score
        silhouette_avg = silhouette_score(X_scaled, cluster_labels)
        
        results.append({
            'linkage': linkage,
            'n_clusters': n_clusters,
            'silhouette_score': silhouette_avg
        })
        
        print(f"Linkage: {linkage:10s}, Clusters: {n_clusters:2d}, Silhouette: {silhouette_avg:.3f}")

# Find best configuration
best_result = max(results, key=lambda x: x['silhouette_score'])
print(f"\\nBest Configuration:")
print(f"Linkage: {best_result['linkage']}")
print(f"Number of Clusters: {best_result['n_clusters']}")
print(f"Best Silhouette Score: {best_result['silhouette_score']:.3f}")

# Perform final clustering with best parameters
final_clustering = AgglomerativeClustering(
    n_clusters=best_result['n_clusters'],
    linkage=best_result['linkage'],
    affinity='euclidean'
)

final_labels = final_clustering.fit_predict(X_scaled)

# Add cluster labels to original data
df['cluster'] = final_labels

# Analyze clusters
print("\\nCluster Analysis:")
for cluster_id in range(best_result['n_clusters']):
    cluster_data = df[df['cluster'] == cluster_id]
    print(f"\\nCluster {cluster_id}:")
    print(f"  Size: {len(cluster_data)} customers")
    print(f"  Fresh: {cluster_data['fresh'].mean():.2f}")
    print(f"  Milk: {cluster_data['milk'].mean():.2f}")
    print(f"  Grocery: {cluster_data['grocery'].mean():.2f}")
    print(f"  Frozen: {cluster_data['frozen'].mean():.2f}")

# Create dendrogram
plt.figure(figsize=(12, 8))
dendrogram = sch.linkage(X_scaled, method=best_result['linkage'])
sch.dendrogram(dendrogram, truncate_mode='lastp', p=best_result['n_clusters'])
plt.title(f'Hierarchical Clustering Dendrogram ({best_result["linkage"]} linkage)')
plt.xlabel('Sample Index')
plt.ylabel('Distance')
plt.show()

# Visualize clusters
plt.figure(figsize=(15, 10))

# Plot 1: Silhouette scores vs number of clusters
plt.subplot(2, 3, 1)
for linkage in linkage_methods:
    linkage_results = [r for r in results if r['linkage'] == linkage]
    clusters = [r['n_clusters'] for r in linkage_results]
    scores = [r['silhouette_score'] for r in linkage_results]
    plt.plot(clusters, scores, marker='o', label=f'{linkage} linkage')

plt.xlabel('Number of Clusters')
plt.ylabel('Silhouette Score')
plt.title('Silhouette Score vs Number of Clusters')
plt.legend()
plt.grid(True)

# Plot 2: Cluster characteristics
plt.subplot(2, 3, 2)
cluster_analysis = []
for cluster_id in range(best_result['n_clusters']):
    cluster_data = df[df['cluster'] == cluster_id]
    cluster_analysis.append([
        cluster_data['fresh'].mean(),
        cluster_data['milk'].mean(),
        cluster_data['grocery'].mean(),
        cluster_data['frozen'].mean()
    ])

cluster_analysis = np.array(cluster_analysis)
x_pos = np.arange(best_result['n_clusters'])
width = 0.6

plt.bar(x_pos, cluster_analysis[:, 0], width, label='Fresh', alpha=0.7)
plt.bar(x_pos + width, cluster_analysis[:, 1], width, label='Milk', alpha=0.7)
plt.bar(x_pos + 2*width, cluster_analysis[:, 2], width, label='Grocery', alpha=0.7)
plt.bar(x_pos + 3*width, cluster_analysis[:, 3], width, label='Frozen', alpha=0.7)

plt.xlabel('Cluster')
plt.ylabel('Average Annual Spending')
plt.title('Cluster Characteristics')
plt.xticks(x_pos + 1.5*width, [f'Cluster {i}' for i in range(best_result['n_clusters'])])
plt.legend()

plt.tight_layout()
plt.show()`,
    evaluationCriteria: [
      "Implement hierarchical clustering correctly",
      "Apply to Wholesale Customers dataset",
      "Create and interpret dendrogram",
      "Use silhouette analysis for cluster evaluation",
      "Determine optimal number of clusters"
    ],
    hints: [
      "Try different linkage methods",
      "Use silhouette score to find optimal clusters",
      "Standardize features before clustering",
      "Interpret clusters based on business context",
      "Use both dendrogram and scatter plots"
    ]
  },

  // CO4: K-Means Clustering
  {
    name: "KMeansClusteringWholesale",
    title: "K-Means Clustering - Wholesale Customers",
    description: "Write a Python program to implement the K-Means clustering algorithm. Cluster customers based on wholesale purchase categories using the K-Means algorithm. Pre-process the Wholesale Customers dataset to normalize features. Determine the optimal number of clusters using the Elbow method.",
    difficulty: 3,
    estimatedTime: 75,
    category: "Unsupervised Learning",
    tags: ["kmeans", "clustering", "wholesale-customers", "elbow-method", "normalization"],
    objectives: [
      "Implement K-Means algorithm",
      "Apply to Wholesale Customers dataset",
      "Normalize features for better clustering",
      "Determine optimal K using Elbow method",
      "Visualize clustering results"
    ],
    prerequisites: [
      "Understanding of K-Means algorithm",
      "Feature normalization techniques",
      "Elbow method for cluster selection"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# K-Means implementation from scratch
class KMeansFromScratch:
    def __init__(self, k=3, max_iters=100):
        self.k = k
        self.max_iters = max_iters
        self.centroids = None
        self.labels = None
    
    def initialize_centroids(self, X):
        """Initialize centroids randomly"""
        n_samples, n_features = X.shape
        np.random.seed(42)
        
        # Random initialization
        indices = np.random.choice(n_samples, self.k, replace=False)
        return X[indices]
    
    def assign_clusters(self, X, centroids):
        """Assign each point to nearest centroid"""
        distances = np.array([
            [np.linalg.norm(x - centroid) for centroid in centroids] 
            for x in X
        ])
        
        return np.argmin(distances, axis=1)
    
    def update_centroids(self, X, labels):
        """Update centroids based on cluster assignments"""
        new_centroids = []
        
        for i in range(self.k):
            cluster_points = X[labels == i]
            if len(cluster_points) > 0:
                new_centroids.append(np.mean(cluster_points, axis=0))
            else:
                new_centroids.append(self.centroids[i])
        
        return np.array(new_centroids)
    
    def calculate_inertia(self, X, labels, centroids):
        """Calculate within-cluster sum of squares"""
        inertia = 0
        
        for i in range(self.k):
            cluster_points = X[labels == i]
            if len(cluster_points) > 0:
                inertia += np.sum((cluster_points - centroids[i]) ** 2)
        
        return inertia
    
    def fit(self, X):
        """Fit K-Means to data"""
        # Initialize centroids
        self.centroids = self.initialize_centroids(X)
        
        for iteration in range(self.max_iters):
            # Assign clusters
            old_labels = self.labels.copy() if self.labels is not None else None
            self.labels = self.assign_clusters(X, self.centroids)
            
            # Update centroids
            self.centroids = self.update_centroids(X, self.labels)
            
            # Check convergence
            if old_labels is not None and np.all(old_labels == self.labels):
                print(f"Converged after {iteration + 1} iterations")
                break
            
            if iteration % 10 == 0:
                inertia = self.calculate_inertia(X, self.labels, self.centroids)
                print(f"Iteration {iteration + 1}: Inertia = {inertia:.2f}")
    
    def predict(self, X):
        """Predict cluster for new data"""
        return self.assign_clusters(X, self.centroids)

# Load Wholesale Customers dataset
def load_wholesale_dataset():
    """Load Wholesale Customers dataset"""
    np.random.seed(42)
    n_samples = 440
    
    data = {
        'fresh': np.random.lognormal(8, 1, n_samples),
        'milk': np.random.lognormal(6, 0.8, n_samples),
        'grocery': np.random.lognormal(7, 0.9, n_samples),
        'frozen': np.random.lognormal(5, 1.2, n_samples),
        'detergents_paper': np.random.lognormal(4, 0.7, n_samples),
        'delicassen': np.random.lognormal(3, 0.6, n_samples)
    }
    
    df = pd.DataFrame(data)
    return df

# Load dataset
df = load_wholesale_dataset()

print("K-Means Clustering - Wholesale Customers")
print("=" * 50)
print(f"Dataset Shape: {df.shape}")

# Preprocess data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df)

print("\\nApplying K-Means Clustering...")

# Find optimal K using Elbow method
print("Finding optimal K using Elbow method...")
k_range = range(1, 11)
inertias = []

for k in k_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)
    print(f"K={k:2d}: Inertia = {kmeans.inertia_:.2f}")

# Plot Elbow curve
plt.figure(figsize=(10, 6))
plt.plot(k_range, inertias, marker='o')
plt.xlabel('Number of Clusters (K)')
plt.ylabel('Inertia')
plt.title('Elbow Method for Optimal K')
plt.grid(True)
plt.show()

# Find optimal K (elbow point)
# Simple elbow detection - find point where rate of decrease slows down
differences = np.diff(inertias)
second_differences = np.diff(differences)
optimal_k = np.argmax(second_differences) + 2

print(f"\\nOptimal K (Elbow Method): {optimal_k}")

# Apply K-Means with optimal K
print(f"\\nApplying K-Means with K={optimal_k}...")

# Compare sklearn vs from scratch implementation
print("\\nComparing sklearn vs from-scratch implementation:")

# Sklearn K-Means
kmeans_sklearn = KMeans(n_clusters=optimal_k, random_state=42)
sklearn_labels = kmeans_sklearn.fit_predict(X_scaled)
sklearn_inertia = kmeans_sklearn.inertia_
sklearn_silhouette = silhouette_score(X_scaled, sklearn_labels)

print(f"Sklearn K-Means:")
print(f"  Inertia: {sklearn_inertia:.2f}")
print(f"  Silhouette Score: {sklearn_silhouette:.3f}")

# From scratch K-Means
kmeans_scratch = KMeansFromScratch(k=optimal_k)
kmeans_scratch.fit(X_scaled)
scratch_inertia = kmeans_scratch.calculate_inertia(X_scaled, kmeans_scratch.labels, kmeans_scratch.centroids)
scratch_silhouette = silhouette_score(X_scaled, kmeans_scratch.labels)

print(f"From Scratch K-Means:")
print(f"  Inertia: {scratch_inertia:.2f}")
print(f"  Silhouette Score: {scratch_silhouette:.3f}")

# Use sklearn results for final analysis
final_labels = sklearn_labels
df['cluster'] = final_labels

# Analyze clusters
print("\\nCluster Analysis:")
for cluster_id in range(optimal_k):
    cluster_data = df[df['cluster'] == cluster_id]
    print(f"\\nCluster {cluster_id} ({len(cluster_data)} customers):")
    print(f"  Fresh: {cluster_data['fresh'].mean():.2f}")
    print(f"  Milk: {cluster_data['milk'].mean():.2f}")
    print(f"  Grocery: {cluster_data['grocery'].mean():.2f}")
    print(f"  Frozen: {cluster_data['frozen'].mean():.2f}")

# Visualize clusters
plt.figure(figsize=(15, 10))

# Plot 1: Cluster scatter plot
plt.subplot(2, 3, 1)
colors = ['red', 'blue', 'green', 'orange', 'purple', 'brown']
for cluster_id in range(optimal_k):
    cluster_points = X_scaled[final_labels == cluster_id]
    plt.scatter(cluster_points[:, 0], cluster_points[:, 1], 
                c=colors[cluster_id], label=f'Cluster {cluster_id}', alpha=0.6)

# Plot centroids
centroids = kmeans_sklearn.cluster_centers_
plt.scatter(centroids[:, 0], centroids[:, 1], 
            c='black', marker='x', s=200, linewidths=3, label='Centroids')

plt.xlabel('Fresh (scaled)')
plt.ylabel('Milk (scaled)')
plt.title('K-Means Clustering Results')
plt.legend()
plt.grid(True)

# Plot 2: Cluster characteristics
plt.subplot(2, 3, 2)
cluster_means = []
for cluster_id in range(optimal_k):
    cluster_data = df[df['cluster'] == cluster_id]
    cluster_means.append([
        cluster_data['fresh'].mean(),
        cluster_data['milk'].mean(),
        cluster_data['grocery'].mean(),
        cluster_data['frozen'].mean()
    ])

cluster_means = np.array(cluster_means)
x_pos = np.arange(optimal_k)
width = 0.6

plt.bar(x_pos, cluster_means[:, 0], width, label='Fresh', alpha=0.7)
plt.bar(x_pos + width, cluster_means[:, 1], width, label='Milk', alpha=0.7)
plt.bar(x_pos + 2*width, cluster_means[:, 2], width, label='Grocery', alpha=0.7)
plt.bar(x_pos + 3*width, cluster_means[:, 3], width, label='Frozen', alpha=0.7)

plt.xlabel('Cluster')
plt.ylabel('Average Annual Spending')
plt.title('Cluster Characteristics')
plt.xticks(x_pos + 1.5*width, [f'Cluster {i}' for i in range(optimal_k)])
plt.legend()

plt.tight_layout()
plt.show()`,
    evaluationCriteria: [
      "Implement K-Means algorithm correctly",
      "Apply to Wholesale Customers dataset",
      "Normalize features for better clustering",
      "Use Elbow method to find optimal K",
      "Visualize clustering results effectively"
    ],
    hints: [
      "Standardize features before clustering",
      "Try different K values (1-10)",
      "Use Elbow method for optimal K",
      "Consider computational complexity",
      "Visualize both elbow curve and cluster assignments"
    ]
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Exact Advanced Labs Part 2 Seeder: Connected to MongoDB');
    return conn;
  } catch (error) {
    console.error('❌ Exact Advanced Labs Part 2 Seeder: MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed exact advanced labs part 2
const seedExactAdvancedLabsPart2 = async () => {
  try {
    // Clear existing exact advanced labs part 2
    await mongoose.connection.db.collection('exactadvancedlabspart2').deleteMany({});
    console.log('🗑️ Cleared existing exact advanced labs part 2');

    // Insert exact advanced labs part 2
    const result = await mongoose.connection.db.collection('exactadvancedlabspart2').insertMany(exactAdvancedLabsPart2);
    console.log(`✅ Created ${result.insertedCount} exact advanced labs part 2`);

    // Log lab details
    exactAdvancedLabsPart2.forEach((lab, index) => {
      console.log(`\n🔬 Lab ${index + 1}: ${lab.title}`);
      console.log(`   Name: ${lab.name}`);
      console.log(`   Category: ${lab.category}`);
      console.log(`   Difficulty: ${lab.difficulty}/5`);
      console.log(`   Time: ${lab.estimatedTime} minutes`);
      console.log(`   Tags: ${lab.tags.join(', ')}`);
    });

    console.log('\n🎉 Exact advanced labs part 2 seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding exact advanced labs part 2:', error);
  }
};

// Main seeder function
const main = async () => {
  await connectDB();
  await seedExactAdvancedLabsPart2();
  process.exit(0);
};

// Run seeder
main();

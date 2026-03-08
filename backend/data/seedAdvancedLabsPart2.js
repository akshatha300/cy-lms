import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Advanced ML Labs Seeder - Part 2
const advancedLabsPart2 = [
  // CO3: K-Nearest Neighbors (KNN) Algorithm
  {
    title: "K-Nearest Neighbors (KNN) Algorithm",
    description: "Implement KNN algorithm for classification tasks including IRIS and Car Evaluation datasets",
    difficulty: 3,
    estimatedTime: 85,
    category: "Supervised Learning",
    tags: ["knn", "classification", "iris", "car-evaluation", "distance-metrics"],
    objectives: [
      "Implement KNN algorithm from scratch",
      "Apply to IRIS flower species classification",
      "Apply to Car Evaluation acceptability prediction",
      "Optimize K value for best accuracy",
      "Compare different distance metrics"
    ],
    prerequisites: [
      "Understanding of distance metrics",
      "Classification concepts",
      "Basic linear algebra"
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
    
    def manhattan_distance(self, x1, x2):
        """Calculate Manhattan distance between two points"""
        return np.sum(np.abs(x1 - x2))
    
    def get_neighbors(self, X_train, y_train, test_point, distance_metric='euclidean'):
        """Find k nearest neighbors"""
        distances = []
        
        for i, train_point in enumerate(X_train):
            if distance_metric == 'euclidean':
                dist = self.euclidean_distance(test_point, train_point)
            else:
                dist = self.manhattan_distance(test_point, train_point)
            
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
print("PART I: IRIS DATASET CLASSIFICATION")
print("=" * 50)

# Load IRIS dataset
from sklearn.datasets import load_iris
iris = load_iris()
X_iris = iris.data
y_iris = iris.target

print(f"IRIS Dataset Shape: {X_iris.shape}")
print(f"Features: {iris.feature_names}")
print(f"Classes: {iris.target_names}")

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

# Plot K vs Accuracy
plt.figure(figsize=(10, 6))
plt.plot(k_values, k_accuracies, marker='o')
plt.xlabel('K Value')
plt.ylabel('Accuracy')
plt.title('KNN Performance on IRIS Dataset')
plt.grid(True)
plt.show()

# Best K
best_k = k_values[np.argmax(k_accuracies)]
print(f"\\nBest K for IRIS: {best_k} (Accuracy: {max(k_accuracies):.4f})")

# Part II: Car Evaluation Dataset
print("\\n" + "=" * 50)
print("PART II: CAR EVALUATION DATASET")
print("=" * 50)

# Create sample Car Evaluation dataset
def create_car_evaluation_dataset():
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
    
    # Add some realistic relationships
    acceptability_scores = {'unacc': 0, 'acc': 1, 'good': 2, 'vgood': 3}
    df['acceptability_score'] = df['acceptability'].map(acceptability_scores)
    
    # Create acceptability based on features
    df['acceptability_score'] = (
        (df['safety'] == 'high').astype(int) * 1.5 +
        (df['persons'] >= 4).astype(int) * 1.0 +
        (df['buying'] == 'low').astype(int) * 0.5 +
        np.random.normal(0, 0.5, n_samples)
    )
    
    df['acceptability'] = df['acceptability_score'].apply(
        lambda x: 'vgood' if x >= 3 else 'good' if x >= 2 else 'acc' if x >= 1 else 'unacc'
    )
    
    return df

# Load and preprocess car dataset
df_car = create_car_evaluation_dataset()

# Encode categorical variables
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

print(f"Car Dataset Shape: {X_car.shape}")
print(f"Target classes: {list(acceptability_map.keys())}")

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
print(f"\\nBest K for Car Dataset: {best_k_car} (Accuracy: {max(car_accuracies):.4f})")

# Compare results
plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.plot(k_values, k_accuracies, marker='o', label='IRIS')
plt.xlabel('K Value')
plt.ylabel('Accuracy')
plt.title('KNN Performance Comparison')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(k_values, car_accuracies, marker='s', label='Car Evaluation')
plt.xlabel('K Value')
plt.ylabel('Accuracy')
plt.legend()

plt.tight_layout()
plt.show()

# Test with different distance metrics
print("\\nTesting different distance metrics on IRIS:")
knn_euclidean = KNN(k=3)
knn_manhattan = KNN(k=3)

# Euclidean distance
y_pred_euclidean = knn_euclidean.predict_batch(X_train_iris, y_train_iris, X_test_iris)
accuracy_euclidean = accuracy_score(y_test_iris, y_pred_euclidean)

# Manhattan distance
y_pred_manhattan = knn_manhattan.predict_batch(X_train_iris, y_train_iris, X_test_iris)
accuracy_manhattan = accuracy_score(y_test_iris, y_pred_manhattan)

print(f"Euclidean Distance Accuracy: {accuracy_euclidean:.4f}")
print(f"Manhattan Distance Accuracy: {accuracy_manhattan:.4f}")`,
    solution: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

class OptimizedKNN:
    def __init__(self, k=3, distance_metric='euclidean'):
        self.k = k
        self.distance_metric = distance_metric
    
    def calculate_distance(self, x1, x2):
        """Calculate distance based on metric"""
        if self.distance_metric == 'euclidean':
            return np.sqrt(np.sum((x1 - x2) ** 2))
        elif self.distance_metric == 'manhattan':
            return np.sum(np.abs(x1 - x2))
        elif self.distance_metric == 'minkowski':
            p = 2  # Can be parameterized
            return np.sum(np.abs(x1 - x2) ** p) ** (1/p)
        else:
            raise ValueError(f"Unknown distance metric: {self.distance_metric}")
    
    def get_neighbors(self, X_train, y_train, test_point):
        """Find k nearest neighbors efficiently"""
        # Calculate all distances
        distances = np.array([
            self.calculate_distance(test_point, train_point) 
            for train_point in X_train
        ])
        
        # Get indices of k smallest distances
        k_indices = np.argpartition(distances, self.k)[:self.k]
        k_indices_sorted = k_indices[np.argsort(distances[k_indices_sorted])]
        
        return k_indices_sorted, y_train[k_indices_sorted]
    
    def predict(self, X_train, y_train, test_point):
        """Predict class for single point"""
        neighbor_indices, neighbor_labels = self.get_neighbors(X_train, y_train, test_point)
        
        # Weighted voting (closer neighbors get more weight)
        weights = 1.0 / (np.arange(1, self.k + 1))
        
        # Get unique classes and their weighted votes
        unique_classes = np.unique(neighbor_labels)
        weighted_votes = np.zeros(len(unique_classes))
        
        for i, class_label in enumerate(unique_classes):
            mask = neighbor_labels == class_label
            weighted_votes[i] = np.sum(weights[mask])
        
        return unique_classes[np.argmax(weighted_votes)]
    
    def predict_batch(self, X_train, y_train, X_test):
        """Predict for multiple points"""
        return [self.predict(X_train, y_train, test_point) for test_point in X_test]

def load_iris_dataset():
    """Load and prepare IRIS dataset"""
    from sklearn.datasets import load_iris
    
    iris = load_iris()
    X = iris.data
    y = iris.target
    
    return X, y, iris.target_names

def load_car_evaluation_dataset():
    """Load Car Evaluation dataset"""
    # Create realistic car evaluation dataset
    np.random.seed(42)
    n_samples = 1000
    
    data = {
        'buying': np.random.choice(['vhigh', 'high', 'med', 'low'], n_samples, p=[0.1, 0.2, 0.4, 0.3]),
        'maint': np.random.choice(['vhigh', 'high', 'med', 'low'], n_samples, p=[0.1, 0.2, 0.4, 0.3]),
        'doors': np.random.choice([2, 3, 4, 5], n_samples, p=[0.2, 0.3, 0.3, 0.2]),
        'persons': np.random.choice([2, 4, 5, 'more'], n_samples, p=[0.2, 0.3, 0.3, 0.2]),
        'lug_boot': np.random.choice(['big', 'med', 'small'], n_samples, p=[0.2, 0.4, 0.4]),
        'safety': np.random.choice(['low', 'med', 'high'], n_samples, p=[0.3, 0.4, 0.3]),
        'acceptability': np.random.choice(['unacc', 'acc', 'good', 'vgood'], n_samples, p=[0.3, 0.3, 0.2, 0.2])
    }
    
    df = pd.DataFrame(data)
    
    # Create realistic acceptability based on features
    acceptability_score = (
        (df['safety'] == 'high').astype(int) * 2 +
        (df['persons'] == 'more').astype(int) * 1.5 +
        (df['buying'] == 'low').astype(int) * 0.8 +
        (df['maint'] == 'low').astype(int) * 0.7 +
        np.random.normal(0, 1, n_samples)
    )
    
    df['acceptability'] = pd.cut(acceptability_score, 
                               bins=[-np.inf, 1, 2, 3, np.inf], 
                               labels=['unacc', 'acc', 'good', 'vgood'])
    
    return df

def optimize_k_parameter(X_train, y_train, X_test, y_test, max_k=15):
    """Find optimal K using cross-validation"""
    k_values = range(1, max_k + 1)
    cv_scores = []
    
    for k in k_values:
        knn = OptimizedKNN(k=k)
        scores = cross_val_score(knn, X_train, y_train, cv=5, scoring='accuracy')
        cv_scores.append(scores.mean())
    
    best_k = k_values[np.argmax(cv_scores)]
    best_score = max(cv_scores)
    
    return best_k, best_score, cv_scores

def main():
    print("K-Nearest Neighbors (KNN) Algorithm")
    print("=" * 50)
    
    # IRIS Dataset
    print("\\n1. IRIS Dataset Analysis")
    print("-" * 30)
    
    X_iris, y_iris, target_names = load_iris_dataset()
    X_train_iris, X_test_iris, y_train_iris, y_test_iris = train_test_split(
        X_iris, y_iris, test_size=0.3, random_state=42, stratify=y_iris
    )
    
    # Scale features
    scaler_iris = StandardScaler()
    X_train_iris_scaled = scaler_iris.fit_transform(X_train_iris)
    X_test_iris_scaled = scaler_iris.transform(X_test_iris)
    
    # Optimize K
    best_k_iris, best_score_iris, cv_scores_iris = optimize_k_parameter(
        X_train_iris_scaled, y_train_iris, X_test_iris_scaled, y_test_iris
    )
    
    print(f"Best K for IRIS: {best_k_iris} (CV Score: {best_score_iris:.4f})")
    
    # Final evaluation
    knn_iris = OptimizedKNN(k=best_k_iris)
    y_pred_iris = knn_iris.predict_batch(X_train_iris_scaled, y_train_iris, X_test_iris_scaled)
    accuracy_iris = accuracy_score(y_test_iris, y_pred_iris)
    
    print(f"Final IRIS Accuracy: {accuracy_iris:.4f}")
    
    # Car Evaluation Dataset
    print("\\n2. Car Evaluation Dataset Analysis")
    print("-" * 30)
    
    df_car = load_car_evaluation_dataset()
    
    # Preprocess car data
    car_features = ['buying', 'maint', 'doors', 'persons', 'lug_boot', 'safety']
    X_car = pd.get_dummies(df_car[car_features], drop_first=True)
    y_car = df_car['acceptability']
    
    # Map target to numerical
    acceptability_map = {'unacc': 0, 'acc': 1, 'good': 2, 'vgood': 3}
    y_car_num = y_car.map(acceptability_map)
    
    X_train_car, X_test_car, y_train_car, y_test_car = train_test_split(
        X_car, y_car_num, test_size=0.3, random_state=42, stratify=y_car_num
    )
    
    # Scale car features
    scaler_car = StandardScaler()
    X_train_car_scaled = scaler_car.fit_transform(X_train_car)
    X_test_car_scaled = scaler_car.transform(X_test_car)
    
    # Optimize K
    best_k_car, best_score_car, cv_scores_car = optimize_k_parameter(
        X_train_car_scaled, y_train_car, X_test_car_scaled, y_test_car
    )
    
    print(f"Best K for Car: {best_k_car} (CV Score: {best_score_car:.4f})")
    
    # Final evaluation
    knn_car = OptimizedKNN(k=best_k_car)
    y_pred_car = knn_car.predict_batch(X_train_car_scaled, y_train_car, X_test_car_scaled)
    accuracy_car = accuracy_score(y_test_car, y_pred_car)
    
    print(f"Final Car Accuracy: {accuracy_car:.4f}")
    
    # Visualize results
    plt.figure(figsize=(15, 10))
    
    # K optimization plots
    plt.subplot(2, 3, 1)
    plt.plot(range(1, 16), cv_scores_iris, marker='o', label='IRIS')
    plt.xlabel('K Value')
    plt.ylabel('Cross-Validation Accuracy')
    plt.title('K Parameter Optimization')
    plt.legend()
    
    plt.subplot(2, 3, 2)
    plt.plot(range(1, 16), cv_scores_car, marker='s', label='Car Evaluation')
    plt.xlabel('K Value')
    plt.legend()
    
    # Confusion matrices
    plt.subplot(2, 3, 3)
    cm_iris = confusion_matrix(y_test_iris, y_pred_iris)
    plt.imshow(cm_iris, interpolation='nearest', cmap=plt.cm.Blues)
    plt.title('IRIS Confusion Matrix')
    plt.colorbar()
    
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    main()`,
    evaluationCriteria: [
      "Implement KNN algorithm correctly",
      "Apply to both IRIS and Car Evaluation datasets",
      "Optimize K parameter for best performance",
      "Compare different distance metrics",
      "Use cross-validation for robust evaluation"
    ],
    hints: [
      "Feature scaling is important for KNN",
      "Try different K values (1, 3, 5, 7, 9)",
      "Use cross-validation to find optimal K",
      "Consider weighted voting for better results",
      "Handle categorical variables properly"
    ]
  },

  // CO4: Hierarchical Clustering with Wholesale Customers
  {
    title: "Hierarchical Clustering - Wholesale Customers",
    description: "Group customers based on purchasing behavior using agglomerative hierarchical clustering",
    difficulty: 4,
    estimatedTime: 90,
    category: "Unsupervised Learning",
    tags: ["hierarchical-clustering", "agglomerative", "wholesale-customers", "dendrogram"],
    objectives: [
      "Implement hierarchical clustering algorithm",
      "Apply to Wholesale Customers dataset",
      "Visualize dendrogram structure",
      "Determine optimal number of clusters",
      "Evaluate cluster quality using silhouette scores"
    ],
    prerequisites: [
      "Understanding of clustering concepts",
      "Distance metrics and linkage methods",
      "Silhouette analysis"
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import scipy.cluster.hierarchy as sch

# Create Wholesale Customers dataset
def create_wholesale_dataset():
    np.random.seed(42)
    n_samples = 440
    
    # Simulate wholesale purchasing behavior
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
df = create_wholesale_dataset()

print("Wholesale Customers Dataset:")
print(df.head())
print(f"\\nDataset Shape: {df.shape}")

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
    solution: `import pandas as pd
import numpy as np
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics import silhouette_score, calinski_harabasz_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import scipy.cluster.hierarchy as sch
import seaborn as sns

def load_wholesale_customers():
    """Load Wholesale Customers dataset"""
    # This is a simplified version - in practice, you'd load from UCI repository
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00292/Wholesale%20customers.csv"
    
    try:
        df = pd.read_csv(url)
        print("Loaded Wholesale Customers dataset from UCI repository")
        return df
    except:
        print("Creating sample Wholesale Customers dataset...")
        return create_sample_wholesale_dataset()

def create_sample_wholesale_dataset():
    """Create sample wholesale dataset for demonstration"""
    np.random.seed(42)
    n_samples = 440
    
    # Simulate wholesale data with realistic patterns
    channel = np.random.choice([1, 2, 3], n_samples, p=[0.3, 0.4, 0.3])  # Horeca, Retail, Cafe
    region = np.random.choice([1, 2, 3], n_samples, p=[0.4, 0.3, 0.3])  # Lisbon, Oporto, Other
    
    data = {
        'fresh': np.random.lognormal(8 + channel * 2, 1 + channel * 0.3, n_samples),
        'milk': np.random.lognormal(6 + channel * 1.5, 0.8 + channel * 0.2, n_samples),
        'grocery': np.random.lognormal(7 + channel * 1.2, 0.9 + channel * 0.1, n_samples),
        'frozen': np.random.lognormal(5 + channel * 0.8, 1.2 + channel * 0.4, n_samples),
        'detergents_paper': np.random.lognormal(4 + channel * 0.5, 0.7 + channel * 0.2, n_samples),
        'delicassen': np.random.lognormal(3 + channel * 0.3, 0.6 + channel * 0.1, n_samples)
    }
    
    df = pd.DataFrame(data)
    return df

def evaluate_clustering(X, labels, n_clusters):
    """Evaluate clustering quality"""
    silhouette_avg = silhouette_score(X, labels)
    ch_score = calinski_harabasz_score(X, labels)
    
    return {
        'silhouette_score': silhouette_avg,
        'calinski_harabasz_score': ch_score
    }

def plot_dendrogram_and_clusters(X, linkage_method, n_clusters):
    """Create comprehensive visualization"""
    fig = plt.figure(figsize=(16, 10))
    
    # Dendrogram
    ax1 = fig.add_subplot(2, 3, 1)
    linkage_matrix = sch.linkage(X, method=linkage_method)
    sch.dendrogram(linkage_matrix, truncate_mode='lastp', p=n_clusters, ax=ax1)
    ax1.set_title(f'Dendrogram ({linkage_method} linkage)')
    ax1.set_xlabel('Sample Index')
    ax1.set_ylabel('Distance')
    
    # Cluster visualization (first two features)
    ax2 = fig.add_subplot(2, 3, 2, projection='3d')
    
    clustering = AgglomerativeClustering(
        n_clusters=n_clusters,
        linkage=linkage_method,
        affinity='euclidean'
    )
    labels = clustering.fit_predict(X)
    
    scatter = ax2.scatter(X[:, 0], X[:, 1], X[:, 2], c=labels, cmap='viridis', s=50)
    ax2.set_xlabel('Fresh')
    ax2.set_ylabel('Milk')
    ax2.set_zlabel('Grocery')
    ax2.set_title('Cluster Visualization (3D)')
    
    plt.colorbar(scatter, ax=ax2)
    
    # Silhouette scores
    ax3 = fig.add_subplot(2, 3, 3)
    
    # Calculate silhouette for different cluster numbers
    cluster_range = range(2, 11)
    silhouette_scores = []
    
    for k in cluster_range:
        temp_clustering = AgglomerativeClustering(n_clusters=k, linkage=linkage_method)
        temp_labels = temp_clustering.fit_predict(X)
        score = silhouette_score(X, temp_labels)
        silhouette_scores.append(score)
    
    ax3.plot(cluster_range, silhouette_scores, marker='o')
    ax3.set_xlabel('Number of Clusters')
    ax3.set_ylabel('Silhouette Score')
    ax3.set_title('Silhouette Analysis')
    ax3.grid(True)
    
    # Mark optimal cluster number
    optimal_k = cluster_range[np.argmax(silhouette_scores)]
    ax3.axvline(x=optimal_k, color='r', linestyle='--', label=f'Optimal: {optimal_k}')
    ax3.legend()
    
    plt.tight_layout()
    plt.show()

def main():
    print("Hierarchical Clustering Analysis")
    print("=" * 50)
    
    # Load dataset
    df = load_wholesale_customers()
    
    print(f"Dataset Shape: {df.shape}")
    print(f"Features: {df.columns.tolist()}")
    
    # Preprocess
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df)
    
    # Test different linkage methods
    linkage_methods = ['ward', 'complete', 'average', 'single']
    cluster_range = range(2, 11)
    
    results = []
    
    print("\\nTesting different configurations:")
    for linkage in linkage_methods:
        for n_clusters in cluster_range:
            clustering = AgglomerativeClustering(
                n_clusters=n_clusters,
                linkage=linkage,
                affinity='euclidean'
            )
            
            labels = clustering.fit_predict(X_scaled)
            metrics = evaluate_clustering(X_scaled, labels, n_clusters)
            
            results.append({
                'linkage': linkage,
                'n_clusters': n_clusters,
                'silhouette_score': metrics['silhouette_score'],
                'ch_score': metrics['calinski_harabasz_score']
            })
            
            print(f"{linkage:10s}, K={n_clusters:2d}: Silhouette={metrics['silhouette_score']:.3f}")
    
    # Find best configuration
    best_result = max(results, key=lambda x: x['silhouette_score'])
    
    print(f"\\nBest Configuration:")
    print(f"Linkage: {best_result['linkage']}")
    print(f"Number of Clusters: {best_result['n_clusters']}")
    print(f"Best Silhouette Score: {best_result['silhouette_score']:.3f}")
    
    # Final clustering and visualization
    final_clustering = AgglomerativeClustering(
        n_clusters=best_result['n_clusters'],
        linkage=best_result['linkage'],
        affinity='euclidean'
    )
    
    final_labels = final_clustering.fit_predict(X_scaled)
    
    # Add cluster information to original data
    df['cluster'] = final_labels
    
    # Analyze clusters
    print("\\nCluster Analysis:")
    for cluster_id in range(best_result['n_clusters']):
        cluster_data = df[df['cluster'] == cluster_id]
        print(f"\\nCluster {cluster_id} ({len(cluster_data)} customers):")
        for feature in df.columns:
            print(f"  Average {feature}: {cluster_data[feature].mean():.2f}")
    
    # Visualization
    plot_dendrogram_and_clusters(X_scaled, best_result['linkage'], best_result['n_clusters'])

if __name__ == "__main__":
    main()`,
    evaluationCriteria: [
      "Implement hierarchical clustering correctly",
      "Apply to Wholesale Customers dataset",
      "Create and interpret dendrogram",
      "Use silhouette analysis for cluster evaluation",
      "Determine optimal number of clusters",
      "Visualize cluster characteristics"
    ],
    hints: [
      "Try different linkage methods (ward, complete, average)",
      "Use silhouette score to find optimal clusters",
      "Standardize features before clustering",
      "Interpret clusters based on business context",
      "Use both dendrogram and scatter plots"
    ]
  },

  // CO4: K-Means Clustering
  {
    title: "K-Means Clustering Algorithm",
    description: "Cluster customers based on wholesale purchase categories using K-Means algorithm",
    difficulty: 3,
    estimatedTime: 75,
    category: "Unsupervised Learning",
    tags: ["kmeans", "clustering", "wholesale-customers", "elbow-method"],
    objectives: [
      "Implement K-Means algorithm from scratch",
      "Apply to Wholesale Customers dataset",
      "Normalize features for better clustering",
      "Determine optimal K using Elbow method",
      "Visualize clustering results"
    ],
    prerequisites: [
      "Understanding of K-Means algorithm",
      "Cluster evaluation metrics",
      "Feature normalization techniques"
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

# Create Wholesale Customers dataset (same as hierarchical clustering)
def create_wholesale_dataset():
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
df = create_wholesale_dataset()

print("Wholesale Customers Dataset:")
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
        cluster_data['grocery'].mean()
    ])

cluster_means = np.array(cluster_means)
x_pos = np.arange(optimal_k)
width = 0.6

plt.bar(x_pos, cluster_means[:, 0], width, label='Fresh', alpha=0.7)
plt.bar(x_pos + width, cluster_means[:, 1], width, label='Milk', alpha=0.7)
plt.bar(x_pos + 2*width, cluster_means[:, 2], width, label='Grocery', alpha=0.7)

plt.xlabel('Cluster')
plt.ylabel('Average Annual Spending')
plt.title('Cluster Characteristics')
plt.xticks(x_pos + width, [f'Cluster {i}' for i in range(optimal_k)])
plt.legend()

plt.tight_layout()
plt.show()`,
    solution: `import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, calinski_harabasz_score, davies_bouldin_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns

def load_wholesale_customers():
    """Load Wholesale Customers dataset"""
    # Try to load from UCI repository
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00292/Wholesale%20customers.csv"
    
    try:
        df = pd.read_csv(url)
        print("Loaded Wholesale Customers dataset from UCI repository")
        return df
    except:
        print("Creating sample Wholesale Customers dataset...")
        return create_sample_dataset()

def create_sample_dataset():
    """Create realistic wholesale dataset"""
    np.random.seed(42)
    n_samples = 440
    
    # Create realistic wholesale data
    data = {
        'fresh': np.random.lognormal(8, 1, n_samples),
        'milk': np.random.lognormal(6, 0.8, n_samples),
        'grocery': np.random.lognormal(7, 0.9, n_samples),
        'frozen': np.random.lognormal(5, 1.2, n_samples),
        'detergents_paper': np.random.lognormal(4, 0.7, n_samples),
        'delicassen': np.random.lognormal(3, 0.6, n_samples)
    }
    
    return pd.DataFrame(data)

def find_optimal_k_elbow(X, max_k=10):
    """Find optimal K using multiple methods"""
    k_range = range(2, max_k + 1)
    inertias = []
    silhouette_scores = []
    ch_scores = []
    db_scores = []
    
    for k in k_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = kmeans.fit_predict(X)
        
        inertias.append(kmeans.inertia_)
        silhouette_scores.append(silhouette_score(X, labels))
        ch_scores.append(calinski_harabasz_score(X, labels))
        db_scores.append(davies_bouldin_score(X, labels))
    
    # Find optimal K based on different metrics
    optimal_k_silhouette = k_range[np.argmax(silhouette_scores)]
    optimal_k_ch = k_range[np.argmax(ch_scores)]
    optimal_k_db = k_range[np.argmin(db_scores)]
    
    return {
        'k_range': list(k_range),
        'inertias': inertias,
        'silhouette_scores': silhouette_scores,
        'ch_scores': ch_scores,
        'db_scores': db_scores,
        'optimal_k_silhouette': optimal_k_silhouette,
        'optimal_k_ch': optimal_k_ch,
        'optimal_k_db': optimal_k_db
    }

def plot_comprehensive_analysis(X, df, analysis_results):
    """Create comprehensive visualization of clustering analysis"""
    fig = plt.figure(figsize=(20, 12))
    
    # Elbow method plot
    ax1 = fig.add_subplot(2, 4, 1)
    ax1.plot(analysis_results['k_range'], analysis_results['inertias'], marker='o')
    ax1.set_xlabel('Number of Clusters (K)')
    ax1.set_ylabel('Inertia')
    ax1.set_title('Elbow Method')
    ax1.grid(True)
    
    # Silhouette analysis
    ax2 = fig.add_subplot(2, 4, 2)
    ax2.plot(analysis_results['k_range'], analysis_results['silhouette_scores'], marker='s', color='green')
    ax2.set_xlabel('Number of Clusters (K)')
    ax2.set_ylabel('Silhouette Score')
    ax2.set_title('Silhouette Analysis')
    ax2.grid(True)
    ax2.axvline(x=analysis_results['optimal_k_silhouette'], color='r', linestyle='--', 
                label=f'Optimal K: {analysis_results["optimal_k_silhouette"]}')
    ax2.legend()
    
    # Calinski-Harabasz score
    ax3 = fig.add_subplot(2, 4, 3)
    ax3.plot(analysis_results['k_range'], analysis_results['ch_scores'], marker='^', color='orange')
    ax3.set_xlabel('Number of Clusters (K)')
    ax3.set_ylabel('Calinski-Harabasz Score')
    ax3.set_title('Calinski-Harabasz Score')
    ax3.grid(True)
    
    # Davies-Bouldin score
    ax4 = fig.add_subplot(2, 4, 4)
    ax4.plot(analysis_results['k_range'], analysis_results['db_scores'], marker='d', color='purple')
    ax4.set_xlabel('Number of Clusters (K)')
    ax4.set_ylabel('Davies-Bouldin Score')
    ax4.set_title('Davies-Bouldin Score')
    ax4.grid(True)
    
    plt.tight_layout()
    plt.show()

def main():
    print("K-Means Clustering Analysis")
    print("=" * 50)
    
    # Load dataset
    df = load_wholesale_customers()
    
    print(f"Dataset Shape: {df.shape}")
    print(f"Features: {df.columns.tolist()}")
    
    # Preprocess
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df)
    
    # Find optimal K
    print("\\nAnalyzing optimal number of clusters...")
    analysis_results = find_optimal_k_elbow(X_scaled)
    
    print(f"Optimal K (Silhouette): {analysis_results['optimal_k_silhouette']}")
    print(f"Optimal K (Calinski-Harabasz): {analysis_results['optimal_k_ch']}")
    print(f"Optimal K (Davies-Bouldin): {analysis_results['optimal_k_db']}")
    
    # Final clustering with optimal K
    optimal_k = analysis_results['optimal_k_silhouette']
    kmeans_final = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
    final_labels = kmeans_final.fit_predict(X_scaled)
    
    # Add cluster information
    df['cluster'] = final_labels
    
    # Analyze final clusters
    print("\\nFinal Cluster Analysis:")
    for cluster_id in range(optimal_k):
        cluster_data = df[df['cluster'] == cluster_id]
        print(f"\\nCluster {cluster_id} ({len(cluster_data)} customers):")
        for feature in df.columns:
            print(f"  {feature}: {cluster_data[feature].mean():.2f}")
    
    # Visualization
    plot_comprehensive_analysis(X_scaled, df, analysis_results)

if __name__ == "__main__":
    main()`,
    evaluationCriteria: [
      "Implement K-Means algorithm correctly",
      "Apply to Wholesale Customers dataset",
      "Use Elbow method to find optimal K",
      "Normalize features for better clustering",
      "Evaluate clusters using multiple metrics",
      "Visualize clustering results effectively"
    ],
    hints: [
      "Standardize features before clustering",
      "Try different K values (2-10)",
      "Use multiple evaluation metrics",
      "Consider business context for cluster interpretation",
      "Visualize both elbow curve and cluster assignments"
    ]
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Advanced Labs Seeder Part 2: Connected to MongoDB');
    return conn;
  } catch (error) {
    console.error('❌ Advanced Labs Seeder Part 2: MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed advanced labs part 2
const seedAdvancedLabsPart2 = async () => {
  try {
    // Clear existing advanced labs part 2
    await mongoose.connection.db.collection('advancedlabspart2').deleteMany({});
    console.log('🗑️ Cleared existing advanced labs part 2');

    // Insert advanced labs part 2
    const result = await mongoose.connection.db.collection('advancedlabspart2').insertMany(advancedLabsPart2);
    console.log(`✅ Created ${result.insertedCount} advanced labs part 2`);

    // Log lab details
    advancedLabsPart2.forEach((lab, index) => {
      console.log(`\n🔬 Lab ${index + 1}: ${lab.title}`);
      console.log(`   Category: ${lab.category}`);
      console.log(`   Difficulty: ${lab.difficulty}/5`);
      console.log(`   Time: ${lab.estimatedTime} minutes`);
      console.log(`   Tags: ${lab.tags.join(', ')}`);
    });

    console.log('\n🎉 Advanced labs part 2 seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding advanced labs part 2:', error);
  }
};

// Main seeder function
const main = async () => {
  await connectDB();
  await seedAdvancedLabsPart2();
  process.exit(0);
};

// Run seeder
main();

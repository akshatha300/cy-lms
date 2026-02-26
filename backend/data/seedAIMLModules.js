import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Module from "../models/Module.js";

dotenv.config();
await connectDB();

const aimlModules = [
  {
    title: "Unit-I: Introduction to Machine Learning",
    description: "Comprehensive introduction to machine learning fundamentals, types, and validation techniques.",
    difficulty: 1,
    tags: ["machine-learning", "introduction", "supervised-learning", "unsupervised-learning", "validation"],
    materials: [
      {
        title: "Machine Learning Basics",
        type: "article",
        content: "Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing computer programs that can access data and use it to learn for themselves."
      },
      {
        title: "Different Types of Machine Learning Techniques",
        type: "article",
        content: "The main types of machine learning are:\n\n1. **Supervised Learning**: Learning from labeled data with known outputs\n2. **Unsupervised Learning**: Finding patterns in unlabeled data\n3. **Semi-Supervised Learning**: Combination of labeled and unlabeled data\n4. **Reinforcement Learning**: Learning through rewards and penalties"
      },
      {
        title: "Supervised Machine Learning",
        type: "article", 
        content: "Supervised learning uses labeled training data to learn mapping functions. It includes classification (predicting categories) and regression (predicting continuous values). Common algorithms include linear regression, logistic regression, decision trees, and support vector machines."
      },
      {
        title: "Unsupervised Machine Learning",
        type: "article",
        content: "Unsupervised learning finds hidden patterns in unlabeled data. Main techniques include clustering (grouping similar data points), dimensionality reduction (reducing features), and association rule mining (finding relationships). Popular algorithms include K-means, hierarchical clustering, and PCA."
      },
      {
        title: "Semi-Supervised Machine Learning",
        type: "article",
        content: "Semi-supervised learning combines small amounts of labeled data with large amounts of unlabeled data. It's useful when labeling data is expensive or time-consuming. Methods include self-training, co-training, and graph-based approaches."
      },
      {
        title: "Overfitting and Underfitting",
        type: "article",
        content: "**Overfitting**: Model learns training data too well, including noise, leading to poor generalization on new data.\n\n**Underfitting**: Model is too simple to capture underlying patterns in data.\n\n**Solutions**: Use cross-validation, regularization, proper feature selection, and appropriate model complexity."
      },
      {
        title: "Model Validation Techniques",
        type: "article",
        content: "Model validation assesses how well models perform on unseen data:\n\n1. **Train-Test Split**: Separate data into training and testing sets\n2. **Cross-Validation**: K-fold, stratified, leave-one-out\n3. **Bootstrapping**: Resampling with replacement\n4. **Holdout Method**: Single train-test split"
      },
      {
        title: "Hyperparameter Tuning",
        type: "article",
        content: "Hyperparameters are settings that control model behavior:\n\n**Tuning Methods**:\n- Grid Search: Exhaustive search over parameter space\n- Random Search: Random sampling of parameters\n- Bayesian Optimization: Probabilistic approach\n- Evolutionary Algorithms: Genetic algorithms for optimization"
      }
    ]
  },

  {
    title: "Unit-II: Feature Selection Techniques in Machine Learning",
    description: "Comprehensive guide to feature selection methods including filter, wrapper, and embedded approaches.",
    difficulty: 2,
    tags: ["feature-selection", "filter-methods", "wrapper-methods", "embedded-methods", "lasso"],
    materials: [
      {
        title: "Introduction to Feature Selection",
        type: "article",
        content: "Feature selection reduces the number of input variables by selecting only the most relevant features. Benefits include reduced overfitting, improved accuracy, shorter training times, and better model interpretability."
      },
      {
        title: "Filter Methods",
        type: "article",
        content: "Filter methods select features based on statistical scores, independent of the machine learning algorithm:\n\n**Common Techniques**:\n- Correlation coefficient\n- Chi-square test\n- Information gain\n- ANOVA F-value\n- Mutual information"
      },
      {
        title: "Wrapper Methods",
        type: "article",
        content: "Wrapper methods use the machine learning algorithm to evaluate feature subsets:\n\n**Forward Feature Selection**: Start with no features and add them one by one\n**Backward Feature Elimination**: Start with all features and remove them one by one\n**Recursive Feature Elimination**: Iteratively remove least important features"
      },
      {
        title: "Forward Feature Selection",
        type: "article",
        content: "Forward selection starts with an empty model and adds features one at a time:\n\n1. Start with no features\n2. Add the feature that improves model performance most\n3. Repeat until no significant improvement\n\nAdvantages: Simple, computationally efficient for small feature sets"
      },
      {
        title: "Backward Feature Elimination",
        type: "article",
        content: "Backward elimination starts with all features and removes them iteratively:\n\n1. Start with all features\n2. Remove the least important feature\n3. Retrain and evaluate\n4. Repeat until performance degrades\n\nAdvantages: Considers feature interactions"
      },
      {
        title: "Recursive Feature Elimination (RFE)",
        type: "article",
        content: "RFE recursively removes features and builds a model:\n\n1. Rank features by importance\n2. Remove least important features\n3. Repeat with remaining features\n4. Select optimal number of features\n\nWorks well with linear models and tree-based algorithms"
      },
      {
        title: "Univariate Selection",
        type: "article",
        content: "Univariate selection evaluates each feature independently:\n\n**Methods**:\n- SelectKBest: Select top k features based on scores\n- SelectPercentile: Select top percentage of features\n- GenericUnivariateSelect: Configurable selection\n\nUses statistical tests like chi-square, ANOVA, or mutual information"
      },
      {
        title: "Random Forest Importance",
        type: "article",
        content: "Random Forest provides feature importance through:\n\n1. **Gini Importance**: Based on impurity decrease\n2. **Permutation Importance**: Based on accuracy decrease\n3. **Mean Decrease Accuracy**: Cross-validation approach\n\nAdvantages: Handles non-linear relationships, robust to outliers"
      },
      {
        title: "Feature Selection with Decision Trees",
        type: "article",
        content: "Decision trees naturally perform feature selection:\n\n**Methods**:\n- Information gain: Based on entropy reduction\n- Gini impurity: Measures node purity\n- Chi-square: Statistical significance\n\nTrees provide interpretable feature hierarchies"
      },
      {
        title: "Embedded Methods",
        type: "article",
        content: "Embedded methods perform feature selection during model training:\n\n**Examples**:\n- LASSO (L1) regularization\n- Ridge (L2) regularization\n- Elastic Net (L1 + L2)\n- Tree-based feature importance\n\nAdvantages: Faster than wrapper methods, considers feature interactions"
      },
      {
        title: "LASSO Regularization",
        type: "article",
        content: "LASSO (Least Absolute Shrinkage and Selection Operator) uses L1 regularization:\n\n**Properties**:\n- Shrinks less important features to zero\n- Performs automatic feature selection\n- Creates sparse models\n\nFormula: λ * Σ|βi| where λ controls regularization strength"
      }
    ]
  },

  {
    title: "Unit-III: Supervised Machine Learning",
    description: "In-depth coverage of supervised learning algorithms including regression and classification methods.",
    difficulty: 2,
    tags: ["supervised-learning", "linear-regression", "logistic-regression", "decision-trees", "naive-bayes", "svm", "knn"],
    materials: [
      {
        title: "Introduction to Supervised Learning",
        type: "article",
        content: "Supervised learning learns from labeled training data to make predictions on new data. Two main types:\n\n1. **Regression**: Predict continuous values (e.g., house prices)\n2. **Classification**: Predict discrete categories (e.g., spam detection)"
      },
      {
        title: "Linear Regression",
        type: "article",
        content: "Linear regression models the relationship between dependent and independent variables:\n\n**Simple Linear Regression**: y = β0 + β1x\n**Multiple Linear Regression**: y = β0 + β1x1 + β2x2 + ... + βnxn\n\n**Assumptions**: Linearity, independence, homoscedasticity, normality"
      },
      {
        title: "Ridge Regression",
        type: "article",
        content: "Ridge regression uses L2 regularization to prevent overfitting:\n\n**Formula**: Minimize Σ(yi - ŷi)² + λΣβj²\n\n**Properties**:\n- Shrinks coefficients toward zero\n- Handles multicollinearity\n- Never eliminates features completely\n- λ controls regularization strength"
      },
      {
        title: "Lasso Method",
        type: "article",
        content: "LASSO uses L1 regularization for both regularization and feature selection:\n\n**Formula**: Minimize Σ(yi - ŷi)² + λΣ|βj|\n\n**Properties**:\n- Can shrink coefficients to exactly zero\n- Performs automatic feature selection\n- Creates sparse models\n- Useful for high-dimensional data"
      },
      {
        title: "Classification: Logistic Regression",
        type: "article",
        content: "Logistic regression models binary classification outcomes:\n\n**Sigmoid Function**: σ(z) = 1/(1 + e^(-z))\n**Decision Boundary**: P(y=1|x) > 0.5\n\n**Advantages**: Interpretable, fast, probabilistic outputs\n**Extensions**: Multinomial logistic regression for multiple classes"
      },
      {
        title: "Philosophy of Decision Trees",
        type: "article",
        content: "Decision trees make decisions by splitting data based on feature values:\n\n**Key Concepts**:\n- Root node, internal nodes, leaf nodes\n- Splitting criteria (Gini, entropy)\n- Pruning to prevent overfitting\n- Ensemble methods (Random Forest, Gradient Boosting)"
      },
      {
        title: "ID3 Algorithm",
        type: "article",
        content: "ID3 (Iterative Dichotomiser 3) builds decision trees using information gain:\n\n**Steps**:\n1. Calculate entropy of dataset\n2. Calculate information gain for each attribute\n3. Select attribute with highest information gain\n4. Split dataset on selected attribute\n5. Repeat recursively"
      },
      {
        title: "Naïve Bayes Algorithm",
        type: "article",
        content: "Naïve Bayes applies Bayes' theorem with strong independence assumptions:\n\n**Formula**: P(y|x) = P(x|y)P(y) / P(x)\n\n**Types**:\n- Gaussian Naïve Bayes (continuous data)\n- Multinomial Naïve Bayes (discrete counts)\n- Bernoulli Naïve Bayes (binary features)\n\nAdvantages: Fast, simple, works well with text data"
      },
      {
        title: "Support Vector Machine (SVM)",
        type: "article",
        content: "SVM finds optimal hyperplane to separate classes:\n\n**Key Concepts**:\n- Maximum margin classifier\n- Support vectors (critical data points)\n- Kernel trick for non-linear separation\n- Soft margin for handling outliers\n\n**Kernels**: Linear, polynomial, RBF, sigmoid"
      },
      {
        title: "K-Nearest Neighbor (KNN)",
        type: "article",
        content: "KNN is a non-parametric algorithm that classifies based on nearest neighbors:\n\n**Algorithm**:\n1. Calculate distances to all training points\n2. Select K nearest neighbors\n3. Majority vote for classification\n4. Average for regression\n\n**Considerations**: Choice of K, distance metric, feature scaling"
      }
    ]
  },

  {
    title: "Unit-IV: Unsupervised Machine Learning",
    description: "Comprehensive coverage of unsupervised learning techniques focusing on clustering algorithms and applications.",
    difficulty: 3,
    tags: ["unsupervised-learning", "clustering", "k-means", "hierarchical-clustering", "density-based-clustering"],
    materials: [
      {
        title: "Introduction to Unsupervised Learning",
        type: "article",
        content: "Unsupervised learning discovers patterns in unlabeled data:\n\n**Main Tasks**:\n1. **Clustering**: Grouping similar data points\n2. **Dimensionality Reduction**: Reducing feature space\n3. **Association Rule Mining**: Finding relationships\n4. **Anomaly Detection**: Identifying outliers"
      },
      {
        title: "Introduction to Segmentation Using Clustering",
        type: "article",
        content: "Clustering segments data into meaningful groups:\n\n**Applications**:\n- Customer segmentation\n- Image segmentation\n- Document clustering\n- Anomaly detection\n\n**Goals**: Maximize intra-cluster similarity, minimize inter-cluster similarity"
      },
      {
        title: "Agglomerative Hierarchical Clustering",
        type: "article",
        content: "Agglomerative clustering builds clusters bottom-up:\n\n**Process**:\n1. Start with each point as its own cluster\n2. Find closest pair of clusters\n3. Merge them into a single cluster\n4. Repeat until one cluster remains\n\n**Linkage Methods**: Single, complete, average, ward"
      },
      {
        title: "Divisive Hierarchical Clustering",
        type: "article",
        content: "Divisive clustering builds clusters top-down:\n\n**Process**:\n1. Start with all points in one cluster\n2. Split cluster into two\n3. Choose best split based on criteria\n4. Repeat recursively\n\n**Advantages**: More computationally efficient for large datasets"
      },
      {
        title: "Clustering by Similarity Aggregation",
        type: "article",
        content: "Similarity aggregation combines multiple similarity measures:\n\n**Methods**:\n- Consensus clustering\n- Cluster ensemble\n- Multiple kernel learning\n- Similarity network fusion\n\n**Benefits**: Robust to noise, combines different perspectives"
      },
      {
        title: "K-Means Clustering",
        type: "article",
        content: "K-means partitions data into K clusters:\n\n**Algorithm**:\n1. Initialize K centroids randomly\n2. Assign points to nearest centroid\n3. Update centroids as cluster means\n4. Repeat until convergence\n\n**Considerations**: Choice of K, initialization, convergence criteria"
      },
      {
        title: "Density Based Clustering Algorithm",
        type: "article",
        content: "DBSCAN (Density-Based Spatial Clustering) finds dense regions:\n\n**Parameters**:\n- ε (epsilon): Neighborhood radius\n- MinPts: Minimum points for dense region\n\n**Advantages**: Handles arbitrary shapes, detects outliers, no need to specify K\n**Limitations**: Sensitive to parameters, struggles with varying densities"
      },
      {
        title: "Applications of Clustering",
        type: "article",
        content: "**Real-world Applications**:\n\n**Business**:\n- Customer segmentation for marketing\n- Market basket analysis\n- Fraud detection\n\n**Science**:\n- Gene expression analysis\n- Image segmentation\n- Pattern recognition\n\n**Technology**:\n- Social network analysis\n- Recommendation systems\n- Anomaly detection"
      }
    ]
  },

  {
    title: "Unit-V: Ensemble Techniques",
    description: "Advanced ensemble methods including bagging, boosting, and state-of-the-art gradient boosting algorithms.",
    difficulty: 4,
    tags: ["ensemble-methods", "bagging", "boosting", "random-forest", "gradient-boosting", "adaboost", "xgboost"],
    materials: [
      {
        title: "Introduction to Ensemble Techniques",
        type: "article",
        content: "Ensemble methods combine multiple models to improve performance:\n\n**Benefits**:\n- Better predictive performance\n- Reduced overfitting\n- Improved stability\n- Better generalization\n\n**Types**: Bagging, Boosting, Stacking, Voting"
      },
      {
        title: "Bagging and Boosting",
        type: "article",
        content: "**Bagging (Bootstrap Aggregating)**:\n- Train models on bootstrap samples\n- Reduce variance\n- Parallel training\n- Example: Random Forest\n\n**Boosting**:\n- Train models sequentially\n- Focus on difficult examples\n- Reduce bias\n- Examples: AdaBoost, Gradient Boosting"
      },
      {
        title: "Random Forest Tree with Hyperparameter Tuning",
        type: "article",
        content: "Random Forest combines multiple decision trees:\n\n**Key Hyperparameters**:\n- n_estimators: Number of trees\n- max_depth: Maximum tree depth\n- min_samples_split: Minimum samples to split\n- max_features: Features to consider at each split\n\n**Tuning**: Grid search, random search, Bayesian optimization"
      },
      {
        title: "Gradient Boost Algorithm with Hyperparameter Tuning",
        type: "article",
        content: "Gradient Boost builds trees sequentially to correct errors:\n\n**Key Hyperparameters**:\n- n_estimators: Number of boosting stages\n- learning_rate: Shrinkage of each contribution\n- max_depth: Tree complexity\n- subsample: Fraction of samples for each tree\n\n**Tuning**: Careful balance between learning rate and number of estimators"
      },
      {
        title: "Ada Boost Algorithm with Hyperparameter Tuning",
        type: "article",
        content: "AdaBoost (Adaptive Boosting) focuses on misclassified examples:\n\n**Algorithm**:\n1. Initialize equal weights\n2. Train weak learner\n3. Calculate error\n4. Update weights (increase for misclassified)\n5. Repeat\n\n**Hyperparameters**: n_estimators, learning_rate, base_estimator"
      },
      {
        title: "XGBoost Algorithm with Hyperparameter Tuning",
        type: "article",
        content: "XGBoost (Extreme Gradient Boosting) is optimized gradient boosting:\n\n**Key Features**:\n- Regularization (L1 and L2)\n- Handling missing values\n- Tree pruning\n- Parallel processing\n\n**Critical Hyperparameters**:\n- eta (learning_rate)\n- max_depth\n- min_child_weight\n- subsample\n- colsample_bytree\n- lambda, alpha (regularization)"
      },
      {
        title: "Hyperparameter Tuning Strategies",
        type: "article",
        content: "**Effective Tuning Approaches**:\n\n**Grid Search**:\n- Exhaustive search\n- Guaranteed best combination\n- Computationally expensive\n\n**Random Search**:\n- Random parameter sampling\n- More efficient\n- Often finds good solutions\n\n**Bayesian Optimization**:\n- Probabilistic approach\n- Balances exploration and exploitation\n- Efficient for expensive functions"
      },
      {
        title: "Ensemble Model Evaluation",
        type: "article",
        content: "**Evaluation Metrics**:\n\n**Classification**:\n- Accuracy, Precision, Recall, F1-score\n- ROC-AUC, Confusion Matrix\n\n**Regression**:\n- MSE, RMSE, MAE, R²\n\n**Cross-Validation**:\n- K-fold, Stratified K-fold\n- Time series cross-validation\n- Out-of-bag evaluation (for bagging)"
      }
    ]
  }
];

async function seedAIMLModules() {
  try {
    // Clear existing AIML modules if any
    await Module.deleteMany({ title: { $regex: /^Unit-/ } });
    console.log("🗑️ Cleared existing AIML modules");

    // Insert new AIML modules
    const insertedModules = await Module.insertMany(aimlModules);
    console.log(`✅ Successfully created ${insertedModules.length} AIML modules`);

    insertedModules.forEach((module, index) => {
      console.log(`📚 Module ${index + 1}: ${module.title}`);
      console.log(`   📖 Materials: ${module.materials.length}`);
      console.log(`   🏷️  Tags: ${module.tags.join(", ")}`);
      console.log(`   📊 Difficulty: ${module.difficulty}`);
      console.log("");
    });

  } catch (error) {
    console.error("❌ Error seeding AIML modules:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAIMLModules();

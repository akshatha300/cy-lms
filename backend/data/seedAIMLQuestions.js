import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
<<<<<<< Updated upstream
import Questions from "../models/Questions.js";
=======
import Question from "../models/Questions.js";
>>>>>>> Stashed changes
import Module from "../models/Module.js";

dotenv.config();
await connectDB();

<<<<<<< Updated upstream
const aimlQuestions = [
  // Unit-I: Introduction to Machine Learning Questions
  {
    moduleId: null, // Will be set after finding the module
    questionText: "What is the main difference between supervised and unsupervised machine learning?",
    options: [
      "Supervised learning uses labeled data, unsupervised uses unlabeled data",
      "Supervised learning is faster than unsupervised learning",
      "Unsupervised learning requires more data than supervised learning",
      "There is no difference between them"
    ],
    correctAnswer: "0",
    explanation: "Supervised learning learns from labeled training data with known outputs, while unsupervised learning finds patterns in unlabeled data without predefined outputs.",
    difficulty: 1
  },
  {
    moduleId: null,
    questionText: "What is overfitting in machine learning?",
    options: [
      "When a model performs well on training data but poorly on new data",
      "When a model performs poorly on both training and test data",
      "When a model is too simple to capture patterns",
      "When a model takes too long to train"
    ],
    correctAnswer: "0",
    explanation: "Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize to new, unseen data.",
    difficulty: 2
  },
  {
    moduleId: null,
    questionText: "Which technique is used to prevent overfitting?",
    options: [
      "Cross-validation",
      "Using more complex models",
      "Training for more epochs",
      "Ignoring validation data"
    ],
    correctAnswer: "0",
    explanation: "Cross-validation helps prevent overfitting by evaluating model performance on multiple subsets of data, ensuring better generalization.",
    difficulty: 2
  },
  {
    moduleId: null,
    questionText: "What is semi-supervised learning?",
    options: [
      "Learning from both labeled and unlabeled data",
      "Learning only from labeled data",
      "Learning only from unlabeled data",
      "A type of reinforcement learning"
    ],
    correctAnswer: "0",
    explanation: "Semi-supervised learning combines small amounts of labeled data with large amounts of unlabeled data, making it useful when labeling is expensive.",
    difficulty: 2
  },
  {
    moduleId: null,
    questionText: "What is the purpose of hyperparameter tuning?",
    options: [
      "To optimize model performance",
      "To increase training time",
      "To reduce model complexity",
      "To add more features"
    ],
    correctAnswer: "0",
    explanation: "Hyperparameter tuning finds the optimal settings for model parameters to achieve the best performance on unseen data.",
    difficulty: 3
  },

  // Unit-II: Feature Selection Techniques Questions
  {
    moduleId: null,
    question: "What is the main advantage of filter methods for feature selection?",
    options: [
      "They are computationally efficient",
      "They consider feature interactions",
      "They always select the best features",
      "They work with any machine learning algorithm"
    ],
    correctAnswer: 0,
    explanation: "Filter methods are computationally efficient because they evaluate features independently of the learning algorithm.",
    difficulty: "medium"
  },
  {
    moduleId: null,
    question: "How does forward feature selection work?",
    options: [
      "Starts with no features and adds them one by one",
      "Starts with all features and removes them one by one",
      "Selects features randomly",
      "Uses all features at once"
    ],
    correctAnswer: 0,
    explanation: "Forward feature selection starts with an empty set and iteratively adds the most beneficial feature until no improvement is seen.",
    difficulty: "medium"
  },
  {
    moduleId: null,
    question: "What is recursive feature elimination (RFE)?",
    options: [
      "Iteratively removes least important features",
      "Adds features recursively",
      "Selects features based on correlation",
      "Uses random forest for selection"
    ],
    correctAnswer: 0,
    explanation: "RFE recursively removes the least important features based on model performance until the optimal number is reached.",
    difficulty: "hard"
  },
  {
    moduleId: null,
    question: "What makes LASSO regularization different from Ridge regression?",
    options: [
      "LASSO can shrink coefficients to exactly zero",
      "LASSO always performs better",
      "Ridge is faster than LASSO",
      "They use the same regularization technique"
    ],
    correctAnswer: 0,
    explanation: "LASSO (L1 regularization) can shrink coefficients to exactly zero, performing automatic feature selection, while Ridge (L2) only shrinks them toward zero.",
    difficulty: "hard"
  },
  {
    moduleId: null,
    question: "Which method evaluates features based on statistical scores?",
    options: [
      "Filter methods",
      "Wrapper methods",
      "Embedded methods",
      "Ensemble methods"
    ],
    correctAnswer: 0,
    explanation: "Filter methods use statistical tests like chi-square, ANOVA, or correlation coefficients to score and select features independently of the learning algorithm.",
    difficulty: "easy"
  },

  // Unit-III: Supervised Machine Learning Questions
  {
    moduleId: null,
    question: "What is the main purpose of linear regression?",
    options: [
      "To predict continuous values",
      "To classify data into categories",
      "To cluster similar data points",
      "To reduce dimensionality"
    ],
    correctAnswer: 0,
    explanation: "Linear regression is used to predict continuous numerical values by modeling the relationship between dependent and independent variables.",
    difficulty: "easy"
  },
  {
    moduleId: null,
    question: "How does logistic regression differ from linear regression?",
    options: [
      "It uses a sigmoid function for binary classification",
      "It only works with continuous data",
      "It always produces better results",
      "It requires more training data"
    ],
    correctAnswer: 0,
    explanation: "Logistic regression uses the sigmoid function to output probabilities between 0 and 1, making it suitable for binary classification tasks.",
    difficulty: "medium"
  },
  {
    moduleId: null,
    question: "What is the main principle behind the ID3 algorithm?",
    options: [
      "Uses information gain for splitting",
      "Uses Gini impurity for splitting",
      "Uses random feature selection",
      "Uses gradient descent"
    ],
    correctAnswer: 0,
    explanation: "ID3 algorithm uses information gain (based on entropy) to decide which feature to split on at each node of the decision tree.",
    difficulty: "medium"
  },
  {
    moduleId: null,
    question: "What assumption does Naïve Bayes make?",
    options: [
      "Features are independent given the class",
      "All features are equally important",
      "Data is normally distributed",
      "Features are correlated"
    ],
    correctAnswer: 0,
    explanation: "Naïve Bayes assumes that all features are independent of each other given the class label, which simplifies calculations but may not hold in reality.",
    difficulty: "medium"
  },
  {
    moduleId: null,
    question: "What is the main advantage of Support Vector Machines?",
    options: [
      "They find the optimal separating hyperplane",
      "They are always the fastest algorithm",
      "They work best with small datasets",
      "They don't require parameter tuning"
    ],
    correctAnswer: 0,
    explanation: "SVMs find the hyperplane that maximizes the margin between classes, providing optimal separation and good generalization.",
    difficulty: "hard"
  },

  // Unit-IV: Unsupervised Machine Learning Questions
  {
    moduleId: null,
    question: "What is the primary goal of clustering?",
    options: [
      "Group similar data points together",
      "Predict target values",
      "Reduce feature dimensions",
      "Classify data into predefined categories"
    ],
    correctAnswer: 0,
    explanation: "Clustering aims to group similar data points together while maximizing the differences between different groups.",
    difficulty: "easy"
  },
  {
    moduleId: null,
    question: "How does K-means clustering work?",
    options: [
      "Iteratively assigns points to nearest centroids and updates centroids",
      "Builds a hierarchy of clusters",
      "Uses density to find clusters",
      "Selects random clusters"
    ],
    correctAnswer: 0,
    explanation: "K-means iteratively assigns each data point to the nearest centroid and then updates the centroids as the mean of assigned points.",
    difficulty: "medium"
  },
  {
    moduleId: null,
    question: "What is the main difference between agglomerative and divisive hierarchical clustering?",
    options: [
      "Agglomerative is bottom-up, divisive is top-down",
      "Agglomerative is faster than divisive",
      "Divisive produces better results",
      "They use different distance metrics"
    ],
    correctAnswer: 0,
    explanation: "Agglomerative clustering starts with individual points and merges them (bottom-up), while divisive starts with all points together and splits them (top-down).",
    difficulty: "medium"
  },
  {
    moduleId: null,
    question: "What is a key advantage of DBSCAN over K-means?",
    options: [
      "It can find arbitrarily shaped clusters",
      "It is always faster",
      "It requires fewer parameters",
      "It works better with high-dimensional data"
    ],
    correctAnswer: 0,
    explanation: "DBSCAN can find clusters of arbitrary shapes and identify outliers, unlike K-means which only finds spherical clusters.",
    difficulty: "hard"
  },
  {
    moduleId: null,
    question: "Which clustering method does not require specifying the number of clusters?",
    options: [
      "DBSCAN",
      "K-means",
      "Agglomerative clustering",
      "All require the number of clusters"
    ],
    correctAnswer: 0,
    explanation: "DBSCAN automatically determines the number of clusters based on density, while K-means and agglomerative clustering typically require specifying K.",
    difficulty: "hard"
  },

  // Unit-V: Ensemble Techniques Questions
  {
    moduleId: null,
    question: "What is the main difference between bagging and boosting?",
    options: [
      "Bagging trains models in parallel, boosting sequentially",
      "Bagging is always better than boosting",
      "Boosting is faster than bagging",
      "They use the same algorithms"
    ],
    correctAnswer: 0,
    explanation: "Bagging trains multiple models independently in parallel, while boosting trains models sequentially with each focusing on the errors of previous ones.",
    difficulty: "medium"
  },
  {
    moduleId: null,
    question: "What is Random Forest?",
    options: [
      "Ensemble of decision trees using bagging",
      "Single decision tree with random features",
      "Clustering algorithm",
      "Neural network ensemble"
    ],
    correctAnswer: 0,
    explanation: "Random Forest is an ensemble method that builds multiple decision trees using bagging and feature randomness to improve performance and reduce overfitting.",
    difficulty: "easy"
  },
  {
    moduleId: null,
    question: "How does AdaBoost work?",
    options: [
      "Focuses on misclassified examples by increasing their weights",
      "Trains all models equally",
      "Uses random sampling",
      "Only works with decision trees"
    ],
    correctAnswer: 0,
    explanation: "AdaBoost increases the weights of misclassified examples, forcing subsequent models to focus more on difficult cases.",
    difficulty: "medium"
  },
  {
    moduleId: null,
    question: "What makes XGBoost different from standard gradient boosting?",
    options: [
      "It includes regularization and parallel processing",
      "It only works with decision trees",
      "It is always more accurate",
      "It requires less tuning"
    ],
    correctAnswer: 0,
    explanation: "XGBoost includes L1/L2 regularization, handles missing values, uses parallel processing, and has advanced tree pruning techniques.",
    difficulty: "hard"
  },
  {
    moduleId: null,
    question: "What is the main purpose of ensemble methods?",
    options: [
      "Combine multiple models to improve performance",
      "Reduce training time",
      "Simplify model interpretation",
      "Reduce the number of features"
    ],
    correctAnswer: 0,
    explanation: "Ensemble methods combine predictions from multiple models to achieve better performance, reduced overfitting, and improved generalization compared to individual models.",
    difficulty: "easy"
  }
];

async function seedAIMLQuestions() {
  try {
    // Get the AIML modules to set moduleId
    const modules = await Module.find({ title: { $regex: /^Unit-/ } }).sort({ title: 1 });
    
    if (modules.length !== 5) {
      console.log("❌ Expected 5 modules, found:", modules.length);
      return;
    }

    // Clear existing AIML questions
    await Questions.deleteMany({ moduleId: { $in: modules.map(m => m._id) } });
    console.log("🗑️ Cleared existing AIML questions");

    // Assign module IDs to questions (5 questions per module)
    let questionIndex = 0;
    const questionsWithModuleId = aimlQuestions.map((question, index) => {
      const moduleIndex = Math.floor(index / 5); // 5 questions per module
      return {
        ...question,
        moduleId: modules[moduleIndex]._id
      };
    });

    // Insert questions
    const insertedQuestions = await Questions.insertMany(questionsWithModuleId);
    console.log(`✅ Successfully created ${insertedQuestions.length} AIML questions`);

    // Display questions by module
    modules.forEach((module, moduleIndex) => {
      const moduleQuestions = insertedQuestions.filter(q => q.moduleId.toString() === module._id.toString());
      console.log(`\n📚 ${module.title}`);
      console.log(`   ❓ Questions: ${moduleQuestions.length}`);
      moduleQuestions.forEach((q, qIndex) => {
        console.log(`   ${qIndex + 1}. ${q.question.substring(0, 50)}...`);
      });
    });

  } catch (error) {
    console.error("❌ Error seeding AIML questions:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

=======
const seedAIMLQuestions = async () => {
  try {
    console.log("📝 Starting AIML questions seed...\n");

    // Clear existing questions
    await Question.deleteMany({});
    console.log("🗑️ Cleared existing questions");

    // Get modules
    const modules = await Module.find();
    console.log(`✅ Found ${modules.length} modules`);

    if (modules.length === 0) {
      console.log("❌ No modules found. Please seed modules first.");
      return;
    }

    const questionsData = [];

    // Questions for Module 1: Introduction to Machine Learning
    if (modules[0]) {
      questionsData.push(
        {
          moduleId: modules[0]._id,
          questionText: "What is the primary goal of machine learning?",
          options: [
            "To program computers explicitly",
            "To enable computers to learn from data", 
            "To create artificial intelligence",
            "To replace human programmers"
          ],
          correctAnswer: "B",
          explanation: "Machine learning aims to enable computers to learn patterns from data without being explicitly programmed.",
          difficulty: 1,
          type: "mcq"
        },
        {
          moduleId: modules[0]._id,
          questionText: "Which type of learning uses labeled data for training?",
          options: [
            "Unsupervised learning",
            "Reinforcement learning", 
            "Supervised learning",
            "Semi-supervised learning"
          ],
          correctAnswer: "C",
          explanation: "Supervised learning uses labeled data where the algorithm learns from input-output pairs.",
          difficulty: 1,
          type: "mcq"
        },
        {
          moduleId: modules[0]._id,
          questionText: "What is overfitting in machine learning?",
          optionsText: "A. When a model performs well on training data but poorly on new data,B. When a model performs poorly on training data,C. When a model has too few parameters,D. When a model converges too quickly",
          correctAnswer: "A",
          explanation: "Overfitting occurs when a model learns the training data too well and fails to generalize to new, unseen data.",
          difficulty: 2,
          type: "mcq"
        },
        {
          moduleId: modules[0]._id,
          questionText: "Which algorithm is commonly used for classification tasks?",
          optionsText: "A. Linear regression,B. K-means clustering,C. Decision trees,D. Principal Component Analysis",
          correctAnswer: "C",
          explanation: "Decision trees are widely used for classification tasks due to their interpretability and ability to handle both numerical and categorical data.",
          difficulty: 1,
          type: "mcq"
        },
        {
          moduleId: modules[0]._id,
          questionText: "What is the purpose of cross-validation?",
          optionsText: "A. To increase model accuracy,B. To evaluate model generalization,C. To reduce training time,D. To create more features",
          correctAnswer: "B",
          explanation: "Cross-validation helps evaluate how well a model will generalize to new, unseen data by using multiple train-test splits.",
          difficulty: 2,
          type: "mcq"
        }
      );
    }

    // Questions for Module 2: Feature Selection Techniques
    if (modules[1]) {
      questionsData.push(
        {
          moduleId: modules[1]._id,
          questionText: "What is feature selection?",
          optionsText: "A. Creating new features from existing ones,B. Selecting the most relevant features for the model,C. Removing all features,D. Normalizing feature values",
          correctAnswer: "B",
          explanation: "Feature selection is the process of selecting a subset of relevant features for use in model construction.",
          difficulty: 1,
          type: "mcq"
        },
        {
          moduleId: modules[1]._id,
          questionText: "Which method removes features based on their statistical properties?",
          optionsText: "A. Wrapper methods,B. Filter methods,C. Embedded methods,D. Ensemble methods",
          correctAnswer: "B",
          explanation: "Filter methods evaluate features based on their statistical properties like correlation, chi-square, or information gain.",
          difficulty: 2,
          type: "mcq"
        },
        {
          moduleId: modules[1]._id,
          questionText: "What is the curse of dimensionality?",
          optionsText: "A. Having too few features,B. Having too many features relative to samples,C. Having categorical features,D. Having missing values",
          correctAnswer: "B",
          explanation: "The curse of dimensionality refers to various phenomena that arise when analyzing and organizing data in high-dimensional spaces.",
          difficulty: 3,
          type: "mcq"
        },
        {
          moduleId: modules[1]._id,
          questionText: "Which technique uses the machine learning model to score feature subsets?",
          optionsText: "A. Filter methods,B. Wrapper methods,C. Statistical methods,D. Domain knowledge methods",
          correctAnswer: "B",
          explanation: "Wrapper methods use the predictive power of a machine learning model to score and select feature subsets.",
          difficulty: 2,
          type: "mcq"
        },
        {
          moduleId: modules[1]._id,
          questionText: "What is Lasso regression primarily used for?",
          optionsText: "A. Classification,B. Clustering,C. Feature selection,D. Dimensionality reduction",
          correctAnswer: "C",
          explanation: "Lasso regression (L1 regularization) is commonly used for feature selection as it can shrink some coefficients to exactly zero.",
          difficulty: 2,
          type: "mcq"
        }
      );
    }

    // Questions for Module 3: Supervised Machine Learning
    if (modules[2]) {
      questionsData.push(
        {
          moduleId: modules[2]._id,
          questionText: "What is the main difference between classification and regression?",
          optionsText: "A. Number of features,B. Type of output variable,C. Training algorithm,D. Data preprocessing",
          correctAnswer: "B",
          explanation: "Classification predicts discrete class labels, while regression predicts continuous numerical values.",
          difficulty: 1,
          type: "mcq"
        },
        {
          moduleId: modules[2]._id,
          questionText: "Which algorithm is non-parametric?",
          optionsText: "A. Linear regression,B. Logistic regression,C. K-Nearest Neighbors,D. Naive Bayes",
          correctAnswer: "C",
          explanation: "K-Nearest Neighbors is non-parametric as it doesn't make assumptions about the underlying data distribution.",
          difficulty: 2,
          type: "mcq"
        },
        {
          moduleId: modules[2]._id,
          questionText: "What is the purpose of the activation function in a neural network?",
          optionsText: "A. To normalize inputs,B. To introduce non-linearity,C. To regularize the model,D. To speed up training",
          correctAnswer: "B",
          explanation: "Activation functions introduce non-linearity, allowing neural networks to learn complex patterns.",
          difficulty: 2,
          type: "mcq"
        },
        {
          moduleId: modules[2]._id,
          questionText: "Which metric is used to evaluate binary classification?",
          optionsText: "A. Mean squared error,B. R-squared,C. Accuracy,D. Silhouette score",
          correctAnswer: "C",
          explanation: "Accuracy is a common metric for evaluating binary classification performance, measuring the proportion of correct predictions.",
          difficulty: 1,
          type: "mcq"
        },
        {
          moduleId: modules[2]._id,
          questionText: "What is bagging in ensemble learning?",
          optionsText: "A. Training models sequentially,B. Training models in parallel on bootstrap samples,C. Combining different algorithms,D. Weighting models by performance",
          correctAnswer: "B",
          explanation: "Bagging (Bootstrap Aggregating) trains multiple models in parallel on different bootstrap samples of the training data.",
          difficulty: 3,
          type: "mcq"
        }
      );
    }

    // Questions for Module 4: Unsupervised Machine Learning
    if (modules[3]) {
      questionsData.push(
        {
          moduleId: modules[3]._id,
          questionText: "What is the primary goal of clustering?",
          optionsText: "A. To predict labels,B. To group similar data points,C. To reduce dimensions,D. To classify data",
          correctAnswer: "B",
          explanation: "Clustering aims to group similar data points together while keeping dissimilar points in different groups.",
          difficulty: 1,
          type: "mcq"
        },
        {
          moduleId: modules[3]._id,
          questionText: "Which clustering algorithm requires the number of clusters to be specified?",
          optionsText: "A. DBSCAN,B. Hierarchical clustering,C. K-means,D. Mean shift",
          correctAnswer: "C",
          explanation: "K-means requires the number of clusters (k) to be specified before the algorithm starts.",
          difficulty: 1,
          type: "mcq"
        },
        {
          moduleId: modules[3]._id,
          questionText: "What is the elbow method used for?",
          optionsText: "A. Determining optimal number of clusters,B. Evaluating clustering quality,C. Selecting features,D. Normalizing data",
          correctAnswer: "A",
          explanation: "The elbow method helps determine the optimal number of clusters by plotting the within-cluster sum of squares against the number of clusters.",
          difficulty: 2,
          type: "mcq"
        },
        {
          moduleId: modules[3]._id,
          questionText: "Which dimensionality reduction technique is linear?",
          optionsText: "A. t-SNE,B. UMAP,C. PCA,D. Isomap",
          correctAnswer: "C",
          explanation: "Principal Component Analysis (PCA) is a linear dimensionality reduction technique.",
          difficulty: 2,
          type: "mcq"
        },
        {
          moduleId: modules[3]._id,
          questionText: "What does PCA stand for?",
          optionsText: "A. Principal Component Analysis,B. Principal Correlation Analysis,C. Primary Component Analysis,D. Predictive Component Analysis",
          correctAnswer: "A",
          explanation: "PCA stands for Principal Component Analysis, a technique for dimensionality reduction.",
          difficulty: 1,
          type: "mcq"
        }
      );
    }

    // Questions for Module 5: Ensemble Techniques
    if (modules[4]) {
      questionsData.push(
        {
          moduleId: modules[4]._id,
          questionText: "What is the main idea behind ensemble methods?",
          optionsText: "A. Using multiple models to improve performance,B. Training a single large model,C. Reducing model complexity,D. Increasing training speed",
          correctAnswer: "A",
          explanation: "Ensemble methods combine multiple models to produce better predictive performance than any single model alone.",
          difficulty: 1,
          type: "mcq"
        },
        {
          moduleId: modules[4]._id,
          questionText: "Which ensemble method trains models sequentially?",
          optionsText: "A. Bagging,B. Random Forest,C. Boosting,D. Stacking",
          correctAnswer: "C",
          explanation: "Boosting trains models sequentially, with each new model focusing on the errors of the previous ones.",
          difficulty: 2,
          type: "mcq"
        },
        {
          moduleId: modules[4]._id,
          questionText: "What is Random Forest?",
          optionsText: "A. A single decision tree,B. An ensemble of decision trees,C. A clustering algorithm,D. A dimensionality reduction technique",
          correctAnswer: "B",
          explanation: "Random Forest is an ensemble learning method that constructs multiple decision trees during training.",
          difficulty: 1,
          type: "mcq"
        },
        {
          moduleId: modules[4]._id,
          questionText: "Which technique combines different types of models?",
          optionsText: "A. Bagging,B. Boosting,C. Stacking,D. Random Forest",
          correctAnswer: "C",
          explanation: "Stacking (Stacked Generalization) combines different types of models by training a meta-model on their predictions.",
          difficulty: 3,
          type: "mcq"
        },
        {
          moduleId: modules[4]._id,
          questionText: "What is the main advantage of AdaBoost?",
          optionsText: "A. It's very fast,B. It reduces bias,C. It handles missing well,D. It's easy to interpret",
          correctAnswer: "B",
          explanation: "AdaBoost primarily reduces bias by focusing on misclassified examples in subsequent iterations.",
          difficulty: 3,
          type: "mcq"
        }
      );
    }

    // Insert questions
    const createdQuestions = await Question.insertMany(questionsData);
    console.log(`✅ Created ${createdQuestions.length} AIML questions`);

    // Display created questions
    console.log("\n📝 Created Questions Summary:");
    modules.forEach((module, index) => {
      const moduleQuestions = createdQuestions.filter(q => 
        q.moduleId.toString() === module._id.toString()
      );
      console.log(`${index + 1}. ${module.title}: ${moduleQuestions.length} questions`);
    });

    console.log("\n🎉 AIML questions seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding AIML questions:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the seed function
>>>>>>> Stashed changes
seedAIMLQuestions();

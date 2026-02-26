import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Questions from "../models/Questions.js";
import Module from "../models/Module.js";

dotenv.config();
await connectDB();

const aimlQuestions = [
  // Unit-I: Introduction to Machine Learning Questions
  {
    moduleId: null,
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
    questionText: "What is the main advantage of filter methods for feature selection?",
    options: [
      "They are computationally efficient",
      "They consider feature interactions",
      "They always select the best features",
      "They work with any machine learning algorithm"
    ],
    correctAnswer: "0",
    explanation: "Filter methods are computationally efficient because they evaluate features independently of the learning algorithm.",
    difficulty: 2
  },
  {
    moduleId: null,
    questionText: "How does forward feature selection work?",
    options: [
      "Starts with no features and adds them one by one",
      "Starts with all features and removes them one by one",
      "Selects features randomly",
      "Uses all features at once"
    ],
    correctAnswer: "0",
    explanation: "Forward feature selection starts with an empty set and iteratively adds the most beneficial feature until no improvement is seen.",
    difficulty: 2
  },
  {
    moduleId: null,
    questionText: "What is recursive feature elimination (RFE)?",
    options: [
      "Iteratively removes least important features",
      "Adds features recursively",
      "Selects features based on correlation",
      "Uses random forest for selection"
    ],
    correctAnswer: "0",
    explanation: "RFE recursively removes the least important features based on model performance until the optimal number is reached.",
    difficulty: 3
  },
  {
    moduleId: null,
    questionText: "What makes LASSO regularization different from Ridge regression?",
    options: [
      "LASSO can shrink coefficients to exactly zero",
      "LASSO always performs better",
      "Ridge is faster than LASSO",
      "They use the same regularization technique"
    ],
    correctAnswer: "0",
    explanation: "LASSO (L1 regularization) can shrink coefficients to exactly zero, performing automatic feature selection, while Ridge (L2) only shrinks them toward zero.",
    difficulty: 3
  },
  {
    moduleId: null,
    questionText: "Which method evaluates features based on statistical scores?",
    options: [
      "Filter methods",
      "Wrapper methods",
      "Embedded methods",
      "Ensemble methods"
    ],
    correctAnswer: "0",
    explanation: "Filter methods use statistical tests like chi-square, ANOVA, or correlation coefficients to score and select features independently of the learning algorithm.",
    difficulty: 1
  },

  // Unit-III: Supervised Machine Learning Questions
  {
    moduleId: null,
    questionText: "What is the main purpose of linear regression?",
    options: [
      "To predict continuous values",
      "To classify data into categories",
      "To cluster similar data points",
      "To reduce dimensionality"
    ],
    correctAnswer: "0",
    explanation: "Linear regression is used to predict continuous numerical values by modeling the relationship between dependent and independent variables.",
    difficulty: 1
  },
  {
    moduleId: null,
    questionText: "How does logistic regression differ from linear regression?",
    options: [
      "It uses a sigmoid function for binary classification",
      "It only works with continuous data",
      "It always produces better results",
      "It requires more training data"
    ],
    correctAnswer: "0",
    explanation: "Logistic regression uses the sigmoid function to output probabilities between 0 and 1, making it suitable for binary classification tasks.",
    difficulty: 2
  },
  {
    moduleId: null,
    questionText: "What is the main principle behind the ID3 algorithm?",
    options: [
      "Uses information gain for splitting",
      "Uses Gini impurity for splitting",
      "Uses random feature selection",
      "Uses gradient descent"
    ],
    correctAnswer: "0",
    explanation: "ID3 algorithm uses information gain (based on entropy) to decide which feature to split on at each node of the decision tree.",
    difficulty: 2
  },
  {
    moduleId: null,
    questionText: "What assumption does Naïve Bayes make?",
    options: [
      "Features are independent given the class",
      "All features are equally important",
      "Data is normally distributed",
      "Features are correlated"
    ],
    correctAnswer: "0",
    explanation: "Naïve Bayes assumes that all features are independent of each other given the class label, which simplifies calculations but may not hold in reality.",
    difficulty: 2
  },
  {
    moduleId: null,
    questionText: "What is the main advantage of Support Vector Machines?",
    options: [
      "They find the optimal separating hyperplane",
      "They are always the fastest algorithm",
      "They work best with small datasets",
      "They don't require parameter tuning"
    ],
    correctAnswer: "0",
    explanation: "SVMs find the hyperplane that maximizes the margin between classes, providing optimal separation and good generalization.",
    difficulty: 3
  },

  // Unit-IV: Unsupervised Machine Learning Questions
  {
    moduleId: null,
    questionText: "What is the primary goal of clustering?",
    options: [
      "Group similar data points together",
      "Predict target values",
      "Reduce feature dimensions",
      "Classify data into predefined categories"
    ],
    correctAnswer: "0",
    explanation: "Clustering aims to group similar data points together while maximizing the differences between different groups.",
    difficulty: 1
  },
  {
    moduleId: null,
    questionText: "How does K-means clustering work?",
    options: [
      "Iteratively assigns points to nearest centroids and updates centroids",
      "Builds a hierarchy of clusters",
      "Uses density to find clusters",
      "Selects random clusters"
    ],
    correctAnswer: "0",
    explanation: "K-means iteratively assigns each data point to the nearest centroid and then updates the centroids as the mean of assigned points.",
    difficulty: 2
  },
  {
    moduleId: null,
    questionText: "What is the main difference between agglomerative and divisive hierarchical clustering?",
    options: [
      "Agglomerative is bottom-up, divisive is top-down",
      "Agglomerative is faster than divisive",
      "Divisive produces better results",
      "They use different distance metrics"
    ],
    correctAnswer: "0",
    explanation: "Agglomerative clustering starts with individual points and merges them (bottom-up), while divisive starts with all points together and splits them (top-down).",
    difficulty: 2
  },
  {
    moduleId: null,
    questionText: "What is a key advantage of DBSCAN over K-means?",
    options: [
      "It can find arbitrarily shaped clusters",
      "It is always faster",
      "It requires fewer parameters",
      "It works better with high-dimensional data"
    ],
    correctAnswer: "0",
    explanation: "DBSCAN can find clusters of arbitrary shapes and identify outliers, unlike K-means which only finds spherical clusters.",
    difficulty: 3
  },
  {
    moduleId: null,
    questionText: "Which clustering method does not require specifying the number of clusters?",
    options: [
      "DBSCAN",
      "K-means",
      "Agglomerative clustering",
      "All require the number of clusters"
    ],
    correctAnswer: "0",
    explanation: "DBSCAN automatically determines the number of clusters based on density, while K-means and agglomerative clustering typically require specifying K.",
    difficulty: 3
  },

  // Unit-V: Ensemble Techniques Questions
  {
    moduleId: null,
    questionText: "What is the main difference between bagging and boosting?",
    options: [
      "Bagging trains models in parallel, boosting sequentially",
      "Bagging is always better than boosting",
      "Boosting is faster than bagging",
      "They use the same algorithms"
    ],
    correctAnswer: "0",
    explanation: "Bagging trains multiple models independently in parallel, while boosting trains models sequentially with each focusing on the errors of previous ones.",
    difficulty: 2
  },
  {
    moduleId: null,
    questionText: "What is Random Forest?",
    options: [
      "Ensemble of decision trees using bagging",
      "Single decision tree with random features",
      "Clustering algorithm",
      "Neural network ensemble"
    ],
    correctAnswer: "0",
    explanation: "Random Forest is an ensemble method that builds multiple decision trees using bagging and feature randomness to improve performance and reduce overfitting.",
    difficulty: 1
  },
  {
    moduleId: null,
    questionText: "How does AdaBoost work?",
    options: [
      "Focuses on misclassified examples by increasing their weights",
      "Trains all models equally",
      "Uses random sampling",
      "Only works with decision trees"
    ],
    correctAnswer: "0",
    explanation: "AdaBoost increases the weights of misclassified examples, forcing subsequent models to focus more on difficult cases.",
    difficulty: 2
  },
  {
    moduleId: null,
    questionText: "What makes XGBoost different from standard gradient boosting?",
    options: [
      "It includes regularization and parallel processing",
      "It only works with decision trees",
      "It is always more accurate",
      "It requires less tuning"
    ],
    correctAnswer: "0",
    explanation: "XGBoost includes L1/L2 regularization, handles missing values, uses parallel processing, and has advanced tree pruning techniques.",
    difficulty: 3
  },
  {
    moduleId: null,
    questionText: "What is the main purpose of ensemble methods?",
    options: [
      "Combine multiple models to improve performance",
      "Reduce training time",
      "Simplify model interpretation",
      "Reduce the number of features"
    ],
    correctAnswer: "0",
    explanation: "Ensemble methods combine predictions from multiple models to achieve better performance, reduced overfitting, and improved generalization compared to individual models.",
    difficulty: 1
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
        console.log(`   ${qIndex + 1}. ${q.questionText.substring(0, 50)}...`);
      });
    });

  } catch (error) {
    console.error("❌ Error seeding AIML questions:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAIMLQuestions();

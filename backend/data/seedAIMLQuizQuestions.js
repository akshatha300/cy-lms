import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Question from "../models/Questions.js";
import Module from "../models/Module.js";

dotenv.config();
await connectDB();

const seedAIMLQuizQuestions = async () => {
  try {
    console.log("📝 Creating AIML quiz questions...\n");

    // Clear existing questions
    await Question.deleteMany({});
    console.log("🗑️ Cleared existing questions");

    // Get modules
    const modules = await Module.find();
    console.log(`✅ Found ${modules.length} modules`);

    const questionsData = [];

    // Questions for each module based on curriculum
    const moduleQuestions = [
      {
        moduleIndex: 0, // Introduction to Machine Learning
        questions: [
          {
            questionText: "What is the primary difference between supervised and unsupervised learning?",
            options: [
              "Supervised learning uses labeled data, unsupervised uses unlabeled data",
              "Supervised learning is faster than unsupervised learning",
              "Unsupervised learning requires more data than supervised learning",
              "Supervised learning only works with numerical data"
            ],
            correctAnswer: "A",
            explanation: "Supervised learning learns from labeled input-output pairs, while unsupervised learning finds patterns in unlabeled data.",
            difficulty: 1
          },
          {
            questionText: "What is overfitting in machine learning?",
            options: [
              "When a model performs well on training data but poorly on new data",
              "When a model performs poorly on training data",
              "When a model has too few parameters",
              "When a model converges too quickly"
            ],
            correctAnswer: "A",
            explanation: "Overfitting occurs when a model learns the training data too well and fails to generalize to new, unseen data.",
            difficulty: 2
          },
          {
            questionText: "Which technique is used to prevent overfitting?",
            options: [
              "Cross-validation",
              "Increasing model complexity",
              "Using more training data only",
              "Decreasing regularization"
            ],
            correctAnswer: "A",
            explanation: "Cross-validation helps evaluate model generalization and prevent overfitting by testing on multiple data splits.",
            difficulty: 2
          },
          {
            questionText: "What is the purpose of hyperparameter tuning?",
            options: [
              "To optimize model performance",
              "To increase training speed",
              "To reduce data size",
              "To simplify the model"
            ],
            correctAnswer: "A",
            explanation: "Hyperparameter tuning finds the optimal settings for model parameters to achieve best performance.",
            difficulty: 1
          },
          {
            questionText: "Which type of learning is used when you have both labeled and unlabeled data?",
            options: [
              "Semi-supervised learning",
              "Supervised learning",
              "Unsupervised learning",
              "Reinforcement learning"
            ],
            correctAnswer: "A",
            explanation: "Semi-supervised learning combines labeled and unlabeled data to improve learning efficiency.",
            difficulty: 1
          }
        ]
      },
      {
        moduleIndex: 1, // Feature Selection Techniques
        questions: [
          {
            questionText: "What is the main goal of feature selection?",
            options: [
              "To select the most relevant features for the model",
              "To increase the number of features",
              "To create new features",
              "To normalize all features"
            ],
            correctAnswer: "A",
            explanation: "Feature selection aims to choose the most relevant features to improve model performance and reduce complexity.",
            difficulty: 1
          },
          {
            questionText: "Which method starts with no features and adds them one by one?",
            options: [
              "Forward feature selection",
              "Backward feature elimination",
              "Recursive feature elimination",
              "LASSO regularization"
            ],
            correctAnswer: "A",
            explanation: "Forward feature selection starts with an empty set and incrementally adds the best features.",
            difficulty: 2
          },
          {
            questionText: "What is backward feature elimination?",
            options: [
              "Starting with all features and removing the least important ones",
              "Adding features one by one based on importance",
              "Creating new features from existing ones",
              "Normalizing all features to the same scale"
            ],
            correctAnswer: "A",
            explanation: "Backward elimination starts with all features and iteratively removes the least important ones.",
            difficulty: 2
          },
          {
            questionText: "Which feature selection method is embedded in the model training process?",
            options: [
              "LASSO regularization",
              "Forward selection",
              "Backward elimination",
              "Filter methods"
            ],
            correctAnswer: "A",
            explanation: "LASSO regularization performs feature selection during model training by shrinking some coefficients to zero.",
            difficulty: 3
          },
          {
            questionText: "What is the advantage of filter methods for feature selection?",
            options: [
              "They are computationally efficient",
              "They consider feature interactions",
              "They optimize for specific models",
              "They always give the best results"
            ],
            correctAnswer: "A",
            explanation: "Filter methods are computationally efficient as they evaluate features independently of any model.",
            difficulty: 2
          }
        ]
      },
      {
        moduleIndex: 2, // Supervised Machine Learning
        questions: [
          {
            questionText: "What is the main difference between linear regression and logistic regression?",
            options: [
              "Linear regression predicts continuous values, logistic regression predicts probabilities",
              "Linear regression is for classification, logistic regression is for regression",
              "Linear regression is faster than logistic regression",
              "Logistic regression can handle more features"
            ],
            correctAnswer: "A",
            explanation: "Linear regression predicts continuous values, while logistic regression predicts class probabilities.",
            difficulty: 1
          },
          {
            questionText: "Which algorithm uses information gain for splitting decisions?",
            options: [
              "ID3 decision tree",
              "Linear regression",
              "K-nearest neighbors",
              "Naive Bayes"
            ],
            correctAnswer: "A",
            explanation: "ID3 uses information gain to determine the best feature for splitting at each node.",
            difficulty: 2
          },
          {
            questionText: "What is the main assumption of Naive Bayes classifier?",
            options: [
              "Features are independent given the class",
              "Features are normally distributed",
              "All features have equal importance",
              "Data is linearly separable"
            ],
            correctAnswer: "A",
            explanation: "Naive Bayes assumes that features are conditionally independent given the class label.",
            difficulty: 2
          },
          {
            questionText: "In SVM, what is the purpose of the kernel trick?",
            options: [
              "To transform data into higher dimensions for linear separation",
              "To reduce the number of features",
              "To speed up training",
              "To handle missing values"
            ],
            correctAnswer: "A",
            explanation: "The kernel trick transforms data into higher dimensions to make it linearly separable.",
            difficulty: 3
          },
          {
            questionText: "How does K-nearest neighbors classify a new data point?",
            options: [
              "By finding the K most similar training examples and voting",
              "By calculating distances to all points and averaging",
              "By building a decision tree",
              "By optimizing a loss function"
            ],
            correctAnswer: "A",
            explanation: "KNN finds the K nearest neighbors and classifies based on majority vote among them.",
            difficulty: 1
          }
        ]
      },
      {
        moduleIndex: 3, // Unsupervised Machine Learning
        questions: [
          {
            questionText: "What is the primary goal of clustering?",
            options: [
              "To group similar data points together",
              "To predict class labels",
              "To reduce dimensionality",
              "To classify data"
            ],
            correctAnswer: "A",
            explanation: "Clustering aims to group similar data points while keeping dissimilar points in different groups.",
            difficulty: 1
          },
          {
            questionText: "Which clustering algorithm builds a tree-like structure of clusters?",
            options: [
              "Agglomerative hierarchical clustering",
              "K-means clustering",
              "DBSCAN",
              "Mean shift"
            ],
            correctAnswer: "A",
            explanation: "Agglomerative hierarchical clustering builds a tree-like structure by merging similar clusters.",
            difficulty: 2
          },
          {
            questionText: "What is the elbow method used for in K-means clustering?",
            options: [
              "To determine the optimal number of clusters",
              "To speed up convergence",
              "To handle outliers",
              "To select initial centroids"
            ],
            correctAnswer: "A",
            explanation: "The elbow method helps determine the optimal number of clusters by plotting within-cluster sum of squares.",
            difficulty: 2
          },
          {
            questionText: "Which clustering algorithm can find arbitrarily shaped clusters?",
            options: [
              "DBSCAN",
              "K-means",
              "Hierarchical clustering",
              "Gaussian mixture models"
            ],
            correctAnswer: "A",
            explanation: "DBSCAN can find arbitrarily shaped clusters based on density connectivity.",
            difficulty: 3
          },
          {
            questionText: "What is a dendrogram used for?",
            options: [
              "To visualize hierarchical clustering results",
              "To plot K-means centroids",
              "To show feature importance",
              "To display confusion matrices"
            ],
            correctAnswer: "A",
            explanation: "A dendrogram visualizes the hierarchical structure of clusters in hierarchical clustering.",
            difficulty: 1
          }
        ]
      },
      {
        moduleIndex: 4, // Ensemble Techniques
        questions: [
          {
            questionText: "What is the main idea behind ensemble methods?",
            options: [
              "To combine multiple models to improve performance",
              "To train a single large model",
              "To reduce model complexity",
              "To speed up training"
            ],
            correctAnswer: "A",
            explanation: "Ensemble methods combine multiple models to achieve better performance than any single model alone.",
            difficulty: 1
          },
          {
            questionText: "Which ensemble method trains models in parallel on different data subsets?",
            options: [
              "Bagging",
              "Boosting",
              "Stacking",
              "Voting"
            ],
            correctAnswer: "A",
            explanation: "Bagging (Bootstrap Aggregating) trains models in parallel on different bootstrap samples.",
            difficulty: 2
          },
          {
            questionText: "How does boosting improve model performance?",
            options: [
              "By training models sequentially, focusing on errors of previous models",
              "By training models independently and averaging results",
              "By using different algorithms and voting",
              "By selecting the best performing model"
            ],
            correctAnswer: "A",
            explanation: "Boosting trains models sequentially, with each new model focusing on the errors of previous ones.",
            difficulty: 2
          },
          {
            questionText: "What is Random Forest?",
            options: [
              "An ensemble of decision trees using bagging",
              "A single deep decision tree",
              "A clustering algorithm",
              "A neural network architecture"
            ],
            correctAnswer: "A",
            explanation: "Random Forest is an ensemble of decision trees trained using bagging and feature randomness.",
            difficulty: 1
          },
          {
            questionText: "Which algorithm is known for its gradient-based optimization?",
            options: [
              "Gradient Boosting",
              "Random Forest",
              "Bagging",
              "Voting classifier"
            ],
            correctAnswer: "A",
            explanation: "Gradient Boosting uses gradient-based optimization to minimize the loss function.",
            difficulty: 2
          }
        ]
      }
    ];

    // Create questions for each module
    moduleQuestions.forEach(({ moduleIndex, questions }) => {
      if (moduleIndex < modules.length) {
        const module = modules[moduleIndex];
        
        questions.forEach(({ questionText, options, correctAnswer, explanation, difficulty }) => {
          questionsData.push({
            moduleId: module._id,
            questionText,
            options,
            correctAnswer,
            explanation,
            difficulty,
            type: "mcq"
          });
        });
      }
    });

    // Insert questions
    const createdQuestions = await Question.insertMany(questionsData);
    console.log(`✅ Created ${createdQuestions.length} AIML quiz questions`);

    // Display created questions
    console.log("\n📝 Created Questions Summary:");
    moduleQuestions.forEach(({ moduleIndex, questions }) => {
      if (moduleIndex < modules.length) {
        const module = modules[moduleIndex];
        console.log(`${moduleIndex + 1}. ${module.title}: ${questions.length} questions`);
      }
    });

    console.log("\n🎉 AIML quiz questions creation completed!");
    
  } catch (error) {
    console.error("❌ Error creating questions:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the seed function
seedAIMLQuizQuestions();

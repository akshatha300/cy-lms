import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Lab from "../models/Lab.js";
import Skill from "../models/Skill.js";

dotenv.config();
await connectDB();

const seedAIMLLabs = async () => {
  try {
    console.log("🤖 Starting AIML lab seed...\n");

    // Clear existing labs
    await Lab.deleteMany({});
    console.log("🗑️ Cleared existing labs");

    // Get existing skills to link labs
    const skills = await Skill.find();
    const skillMap = {};
    skills.forEach((s) => {
      skillMap[s.name] = s._id;
    });

    console.log(`✅ Found ${skills.length} existing skills`);

    const aimlLabsData = [
      {
        name: "Linear Regression Lab",
        description: "Implement linear regression from scratch and predict housing prices",
        skillId: skillMap["Machine Learning Fundamentals"],
        difficulty: 1,
        scenario: "both",
        objectiveText: "Build a linear regression model to predict house prices based on features like square footage, bedrooms, and location",
        environment: "simulated",
        timeLimit: 30,
        requiredTools: ["Python", "NumPy", "Pandas", "Matplotlib"],
        tags: ["linear-regression", "prediction", "basics"],
        isActive: true
      },
      {
        name: "Data Cleaning Workshop",
        description: "Clean and preprocess a messy dataset with missing values and outliers",
        skillId: skillMap["Data Preprocessing"],
        difficulty: 2,
        scenario: "both",
        objectiveText: "Identify and handle missing values, remove outliers, and prepare the dataset for machine learning",
        environment: "simulated",
        timeLimit: 45,
        requiredTools: ["Python", "Pandas", "NumPy", "Seaborn"],
        tags: ["data-cleaning", "missing-values", "outliers"],
        isActive: true
      },
      {
        name: "Feature Selection Challenge",
        description: "Select the best features for a machine learning model using various techniques",
        skillId: skillMap["Feature Engineering"],
        difficulty: 3,
        scenario: "both",
        objectiveText: "Apply correlation analysis, mutual information, and recursive feature elimination to select optimal features",
        environment: "simulated",
        timeLimit: 60,
        requiredTools: ["Python", "Scikit-learn", "Pandas", "NumPy"],
        tags: ["feature-selection", "correlation", "mutual-information"],
        isActive: true
      },
      {
        name: "Classification with Decision Trees",
        description: "Build a decision tree classifier to predict customer churn",
        skillId: skillMap["Supervised Learning"],
        difficulty: 2,
        scenario: "both",
        objectiveText: "Train and evaluate a decision tree model for customer churn prediction with proper hyperparameter tuning",
        environment: "simulated",
        timeLimit: 45,
        requiredTools: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
        tags: ["decision-trees", "classification", "hyperparameter-tuning"],
        isActive: true
      },
      {
        name: "K-Means Clustering",
        description: "Apply K-means clustering to segment customers based on purchasing behavior",
        skillId: skillMap["Unsupervised Learning"],
        difficulty: 2,
        scenario: "both",
        objectiveText: "Implement K-means clustering to identify customer segments and analyze cluster characteristics",
        environment: "simulated",
        timeLimit: 40,
        requiredTools: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
        tags: ["k-means", "clustering", "customer-segmentation"],
        isActive: true
      },
      {
        name: "Neural Network Basics",
        description: "Build a simple neural network for image classification",
        skillId: skillMap["Neural Networks"],
        difficulty: 3,
        scenario: "both",
        objectiveText: "Create a neural network using TensorFlow/Keras to classify handwritten digits from the MNIST dataset",
        environment: "simulated",
        timeLimit: 60,
        requiredTools: ["Python", "TensorFlow", "Keras", "NumPy"],
        tags: ["neural-networks", "tensorflow", "image-classification"],
        isActive: true
      },
      {
        name: "Text Classification with NLP",
        description: "Build a sentiment analysis model using natural language processing techniques",
        skillId: skillMap["Natural Language Processing"],
        difficulty: 3,
        scenario: "both",
        objectiveText: "Preprocess text data and create a sentiment classification model using traditional ML and deep learning approaches",
        environment: "simulated",
        timeLimit: 75,
        requiredTools: ["Python", "NLTK", "Scikit-learn", "TensorFlow"],
        tags: ["sentiment-analysis", "text-preprocessing", "nlp"],
        isActive: true
      },
      {
        name: "Image Recognition with CNN",
        description: "Implement a Convolutional Neural Network for image classification",
        skillId: skillMap["Computer Vision"],
        difficulty: 4,
        scenario: "both",
        objectiveText: "Build and train a CNN to classify images from CIFAR-10 dataset with proper data augmentation",
        environment: "simulated",
        timeLimit: 90,
        requiredTools: ["Python", "TensorFlow", "Keras", "OpenCV"],
        tags: ["cnn", "image-classification", "data-augmentation"],
        isActive: true
      },
      {
        name: "Model Evaluation Metrics",
        description: "Evaluate machine learning models using various performance metrics",
        skillId: skillMap["Model Evaluation"],
        difficulty: 2,
        scenario: "both",
        objectiveText: "Calculate and interpret accuracy, precision, recall, F1-score, and ROC-AUC for classification models",
        environment: "simulated",
        timeLimit: 30,
        requiredTools: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
        tags: ["metrics", "evaluation", "roc-curve"],
        isActive: true
      },
      {
        name: "Random Forest Ensemble",
        description: "Build and optimize a Random Forest model for better performance",
        skillId: skillMap["Ensemble Methods"],
        difficulty: 3,
        scenario: "both",
        objectiveText: "Implement Random Forest classifier and compare its performance with individual decision trees",
        environment: "simulated",
        timeLimit: 50,
        requiredTools: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
        tags: ["random-forest", "ensemble", "bagging"],
        isActive: true
      },
      {
        name: "Logistic Regression Implementation",
        description: "Implement logistic regression from scratch for binary classification",
        skillId: skillMap["Supervised Learning"],
        difficulty: 2,
        scenario: "both",
        objectiveText: "Build logistic regression algorithm using gradient descent and apply it to a binary classification problem",
        environment: "simulated",
        timeLimit: 45,
        requiredTools: ["Python", "NumPy", "Pandas", "Matplotlib"],
        tags: ["logistic-regression", "gradient-descent", "binary-classification"],
        isActive: true
      },
      {
        name: "PCA Dimensionality Reduction",
        description: "Apply Principal Component Analysis to reduce dataset dimensions",
        skillId: skillMap["Unsupervised Learning"],
        difficulty: 3,
        scenario: "both",
        objectiveText: "Implement PCA to reduce feature dimensions while preserving maximum variance in the data",
        environment: "simulated",
        timeLimit: 40,
        requiredTools: ["Python", "Scikit-learn", "NumPy", "Matplotlib"],
        tags: ["pca", "dimensionality-reduction", "variance"],
        isActive: true
      },
      {
        name: "Support Vector Machines",
        description: "Implement SVM for classification with different kernels",
        skillId: skillMap["Supervised Learning"],
        difficulty: 3,
        scenario: "both",
        objectiveText: "Build SVM classifiers with linear, polynomial, and RBF kernels to solve complex classification problems",
        environment: "simulated",
        timeLimit: 50,
        requiredTools: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
        tags: ["svm", "kernels", "classification"],
        isActive: true
      },
      {
        name: "Time Series Forecasting",
        description: "Build time series models to predict future values",
        skillId: skillMap["Machine Learning Fundamentals"],
        difficulty: 4,
        scenario: "both",
        objectiveText: "Apply ARIMA and LSTM models to forecast stock prices or weather data",
        environment: "simulated",
        timeLimit: 75,
        requiredTools: ["Python", "Statsmodels", "TensorFlow", "Pandas"],
        tags: ["time-series", "arima", "lstm", "forecasting"],
        isActive: true
      },
      {
        name: "Cross-Validation Techniques",
        description: "Implement various cross-validation methods for robust model evaluation",
        skillId: skillMap["Model Evaluation"],
        difficulty: 3,
        scenario: "both",
        objectiveText: "Apply k-fold, stratified, and leave-one-out cross-validation to ensure model generalization",
        environment: "simulated",
        timeLimit: 35,
        requiredTools: ["Python", "Scikit-learn", "Pandas", "NumPy"],
        tags: ["cross-validation", "model-selection", "generalization"],
        isActive: true
      }
    ];

    // Insert AIML labs
    const createdLabs = await Lab.insertMany(aimlLabsData);
    console.log(`✅ Created ${createdLabs.length} AIML labs`);

    // Display created labs
    console.log("\n🎯 Created AIML Labs:");
    createdLabs.forEach((lab, index) => {
      console.log(`${index + 1}. ${lab.name} (Difficulty: ${lab.difficulty})`);
      console.log(`   ${lab.description}`);
      console.log(`   Tags: ${lab.tags.join(", ")}`);
      console.log("");
    });

    console.log("🎉 AIML labs seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding AIML labs:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the seed function
seedAIMLLabs();

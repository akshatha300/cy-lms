const mongoose = require('mongoose');
const Module = require('../models/Module.js');

const materials = [
  {
    title: "Introduction to Machine Learning",
    materials: [
      {
        title: "What is Machine Learning?",
        type: "video",
        url: "https://www.youtube.com/watch?v=ukzFI9rgfI",
        content: "Introduction to ML concepts and terminology"
      },
      {
        title: "ML Applications in Real World",
        type: "article",
        content: "Machine Learning is transforming industries worldwide. Key applications include Healthcare (disease diagnosis, drug discovery), Finance (fraud detection, credit scoring), E-commerce (recommendation systems, dynamic pricing), Transportation (route optimization, predictive maintenance), Entertainment (content recommendation, ad targeting), Smart Homes (energy optimization, security monitoring), Social Media (content moderation, trend analysis), Scientific Research (drug discovery, climate modeling), and Manufacturing (quality control, predictive maintenance). Success requires domain knowledge plus technical skills, with ethical considerations being increasingly important."
      },
      {
        title: "Getting Started with Python for ML",
        type: "link",
        url: "https://colab.research.google.com/github/ageron/hands-on-ml",
        content: "Interactive Python notebook for ML beginners"
      }
    ]
  },
  {
    title: "Data Preprocessing & Feature Engineering",
    materials: [
      {
        title: "Data Cleaning Techniques",
        type: "video",
        url: "https://www.youtube.com/watch?v=kh9K5LjEqk",
        content: "Complete guide to handling missing values, outliers, and data quality issues"
      },
      {
        title: "Python Data Preprocessing Code",
        type: "text",
        content: "Data Preprocessing with Python. Import Libraries: pandas, numpy, sklearn. Load and Explore Data: read_csv, head(), info(), describe(). Handle Missing Values: SimpleImputer, drop columns. Handle Categorical Variables: LabelEncoder, get_dummies. Feature Scaling: StandardScaler, MinMaxScaler. Remove Outliers: IQR method. Feature Engineering: interaction features, polynomial features, binning. Save Processed Data: to_csv, joblib.dump. Best Practices: explore data first, document steps, test strategies, consider domain knowledge, validate pipeline."
      }
    ]
  },
  {
    title: "Supervised Learning",
    materials: [
      {
        title: "Linear Regression Complete Guide",
        type: "pdf",
        url: "https://example.com/linear-regression-guide.pdf",
        content: "Comprehensive guide to linear regression with mathematical foundations"
      },
      {
        title: "Decision Trees Explained",
        type: "article",
        content: "Decision trees are supervised learning algorithms that use a tree-like model of decisions. Key concepts: Information Gain, Gini Impurity, Pruning. Advantages: Easy to understand, handles both numerical and categorical data. Disadvantages: Prone to overfitting, can be unstable. Best practices: Limit tree depth, use ensemble methods, consider pruning, handle class imbalance."
      }
    ]
  },
  {
    title: "Unsupervised Learning",
    materials: [
      {
        title: "K-Means Clustering Tutorial",
        type: "video",
        url: "https://www.youtube.com/watch?v=4b5d3muBifc",
        content: "Visual explanation with Python implementation"
      },
      {
        title: "PCA for Dimensionality Reduction",
        type: "article",
        content: "Principal Component Analysis (PCA) transforms high-dimensional data into lower dimensions while preserving variance. Steps: Standardize data, calculate covariance matrix, find eigenvalues and eigenvectors, select principal components. Use cases: Data visualization, removing multicollinearity, noise reduction. Best practices: Always standardize first, check explained variance, consider domain knowledge."
      }
    ]
  },
  {
    title: "Deep Learning",
    materials: [
      {
        title: "Neural Networks Fundamentals",
        type: "video",
        url: "https://www.youtube.com/watch?v=aircAruvnKk",
        content: "3Blue1Brown's comprehensive introduction to neural networks"
      },
      {
        title: "Backpropagation Explained",
        type: "article",
        content: "Backpropagation trains neural networks by calculating gradients of the loss function. Process: Forward pass (input to output), Backward pass (calculate gradients, update weights), repeat until convergence. Key equations: Gradient Descent, Chain Rule. Tips: Use vectorized operations, implement learning rate scheduling, add momentum, use batch normalization."
      }
    ]
  },
  {
    title: "Ensemble Techniques",
    materials: [
      {
        title: "Random Forest Complete Tutorial",
        type: "video",
        url: "https://www.youtube.com/watch?v=J4WdyS3aT0",
        content: "From basics to advanced Random Forest techniques"
      },
      {
        title: "Gradient Boosting Machines",
        type: "article",
        content: "Gradient Boosting builds models sequentially, with each new model correcting previous errors. Popular algorithms: XGBoost (regularization, parallel processing), LightGBM (leaf-wise growth, histogram-based), CatBoost (ordered boosting, categorical features). Best practices: Use cross-validation, monitor training, feature engineering, ensemble multiple algorithms."
      }
    ]
  },
  {
    title: "Model Deployment & MLOps",
    materials: [
      {
        title: "Docker for ML Models",
        type: "video",
        url: "https://www.youtube.com/watch?v=9z--fgfyPon",
        content: "Containerize your ML models for production deployment"
      },
      {
        title: "REST API for ML Models",
        type: "article",
        content: "Building REST APIs involves model servers (Flask/FastAPI), containerization (Docker, Kubernetes), and production considerations (security, performance, scalability). Monitoring: response time, error rate, model drift, resource usage. Tools: AWS SageMaker, Google Cloud AI, Azure ML."
      }
    ]
  }
];

async function addMaterials() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cy-lms');
    console.log('Connected successfully!');

    console.log('Adding learning materials to modules...');
    
    for (const moduleData of materials) {
      const module = await Module.findOne({ title: moduleData.title });
      if (module) {
        await Module.findByIdAndUpdate(module._id, {
          $push: {
            materials: moduleData.materials
          }
        });
        console.log(`✅ Added ${moduleData.materials.length} materials to: ${moduleData.title}`);
      } else {
        console.log(`⚠️ Module not found: ${moduleData.title}`);
      }
    }

    console.log('🎉 Learning materials added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addMaterials();

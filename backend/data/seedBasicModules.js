import mongoose from "mongoose";

// Create a simple module schema for basic modules
const basicModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  estimatedTime: {
    type: Number,
    required: true
  },
  tags: [{
    type: String
  }],
  category: {
    type: String,
    required: true
  },
  objectives: [{
    type: String
  }],
  prerequisites: [{
    type: String
  }],
  materials: [{
    title: String,
    type: {
      type: String,
      enum: ["video", "pdf", "article", "link", "text"]
    },
    url: String,
    content: String
  }],
  order: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const BasicModule = mongoose.model("BasicModule", basicModuleSchema);

const basicModules = [
  {
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of machine learning, including supervised and unsupervised learning, model evaluation, and practical applications.",
    difficulty: 1,
    estimatedTime: 45,
    tags: ["machine learning", "basics", "supervised learning", "unsupervised learning"],
    category: "Fundamentals",
    objectives: [
      "Understand ML concepts and terminology",
      "Differentiate between supervised and unsupervised learning",
      "Learn model evaluation metrics",
      "Explore real-world ML applications"
    ],
    prerequisites: ["Basic Python programming", "Statistics fundamentals"],
    materials: [
      {
        title: "What is Machine Learning?",
        type: "video",
        url: "https://www.youtube.com/watch?v=ukzFI9rgwfM",
        content: "Introduction to ML concepts and terminology"
      },
      {
        title: "ML Fundamentals Guide",
        type: "pdf",
        url: "https://example.com/ml-fundamentals.pdf",
        content: "Comprehensive guide to ML basics"
      },
      {
        title: "Supervised vs Unsupervised Learning",
        type: "article",
        url: "https://towardsdatascience.com/supervised-vs-unsupervised-learning",
        content: "Detailed comparison of learning approaches"
      }
    ],
    order: 1
  },
  
  {
    title: "Data Preprocessing & Feature Engineering",
    description: "Master data cleaning, transformation, and feature engineering techniques to prepare data for machine learning models.",
    difficulty: 2,
    estimatedTime: 60,
    tags: ["data preprocessing", "feature engineering", "data cleaning", "transformation"],
    category: "Data Science",
    objectives: [
      "Handle missing data and outliers",
      "Apply data transformation techniques",
      "Create meaningful features",
      "Use scaling and normalization methods"
    ],
    prerequisites: ["Introduction to Machine Learning", "Python pandas"],
    materials: [
      {
        title: "Data Cleaning Best Practices",
        type: "video",
        url: "https://www.youtube.com/watch?v=3p0D9B_5h4",
        content: "Complete guide to data cleaning"
      },
      {
        title: "Feature Engineering Techniques",
        type: "article",
        url: "https://towardsdatascience.com/feature-engineering",
        content: "Advanced feature engineering methods"
      }
    ],
    order: 2
  },
  
  {
    title: "Supervised Learning",
    description: "Deep dive into supervised learning algorithms including linear regression, logistic regression, decision trees, and ensemble methods.",
    difficulty: 2,
    estimatedTime: 90,
    tags: ["supervised learning", "regression", "classification", "algorithms"],
    category: "Core Algorithms",
    objectives: [
      "Master linear and logistic regression",
      "Understand decision tree algorithms",
      "Learn ensemble methods like random forest",
      "Apply classification and regression techniques"
    ],
    prerequisites: ["Data Preprocessing & Feature Engineering", "Statistics"],
    materials: [
      {
        title: "Linear Regression Explained",
        type: "video",
        url: "https://www.youtube.com/watch?v=nk2CQITm_eo",
        content: "Mathematical foundation of linear regression"
      },
      {
        title: "Classification Algorithms",
        type: "pdf",
        url: "https://example.com/classification-algorithms.pdf",
        content: "Complete guide to classification methods"
      }
    ],
    order: 3
  },
  
  {
    title: "Unsupervised Learning",
    description: "Explore unsupervised learning techniques including clustering, dimensionality reduction, and association rule mining.",
    difficulty: 3,
    estimatedTime: 75,
    tags: ["unsupervised learning", "clustering", "dimensionality reduction", "PCA"],
    category: "Core Algorithms",
    objectives: [
      "Master K-means clustering",
      "Understand hierarchical clustering",
      "Learn PCA and dimensionality reduction",
      "Apply clustering to real datasets"
    ],
    prerequisites: ["Supervised Learning", "Linear algebra"],
    materials: [
      {
        title: "K-Means Clustering Tutorial",
        type: "video",
        url: "https://www.youtube.com/watch?v=4b5d3muBifc",
        content: "Step-by-step K-means implementation"
      },
      {
        title: "PCA and Dimensionality Reduction",
        type: "article",
        url: "https://towardsdatascience.com/pca-explained",
        content: "Understanding principal component analysis"
      }
    ],
    order: 4
  },
  
  {
    title: "Deep Learning",
    description: "Introduction to neural networks, deep learning architectures, and frameworks like TensorFlow and PyTorch.",
    difficulty: 4,
    estimatedTime: 120,
    tags: ["deep learning", "neural networks", "tensorflow", "pytorch"],
    category: "Advanced Topics",
    objectives: [
      "Understand neural network fundamentals",
      "Build deep learning models",
      "Use TensorFlow and PyTorch",
      "Apply deep learning to image and text data"
    ],
    prerequisites: ["Supervised Learning", "Calculus", "Linear algebra"],
    materials: [
      {
        title: "Neural Networks Explained",
        type: "video",
        url: "https://www.youtube.com/watch?v=aircAruvnKk",
        content: "Introduction to neural networks"
      },
      {
        title: "Deep Learning with TensorFlow",
        type: "pdf",
        url: "https://example.com/tensorflow-guide.pdf",
        content: "Complete TensorFlow tutorial"
      }
    ],
    order: 5
  },
  
  {
    title: "Model Deployment & MLOps",
    description: "Learn to deploy machine learning models to production, monitor performance, and maintain ML systems.",
    difficulty: 4,
    estimatedTime: 90,
    tags: ["mlops", "deployment", "production", "monitoring"],
    category: "Engineering",
    objectives: [
      "Deploy ML models as APIs",
      "Implement monitoring and logging",
      "Understand CI/CD for ML",
      "Scale ML systems effectively"
    ],
    prerequisites: ["Deep Learning", "Docker basics"],
    materials: [
      {
        title: "ML Deployment Guide",
        type: "video",
        url: "https://www.youtube.com/watch?v=pAh1Fj5i_k",
        content: "Complete guide to ML deployment"
      },
      {
        title: "MLOps Best Practices",
        type: "article",
        url: "https://towardsdatascience.com/mlops",
        content: "Production ML system design"
      }
    ],
    order: 6
  }
];

export const seedBasicModules = async () => {
  try {
    console.log("📚 Starting basic module seeding...");

    // Clear existing basic modules
    await BasicModule.deleteMany({});
    console.log("🗑️ Cleared existing basic modules");

    let createdCount = 0;

    for (const moduleData of basicModules) {
      const module = new BasicModule(moduleData);
      await module.save();
      createdCount++;
      console.log(`✅ Created basic module: ${moduleData.title}`);
    }

    console.log(`🎉 Basic module seeding completed! Created ${createdCount} modules.`);
    console.log("\n📚 Available Modules:");
    basicModules.forEach((module, index) => {
      console.log(`${index + 1}. ${module.title} (Difficulty: ${module.difficulty}/5)`);
      console.log(`   Category: ${module.category} | Time: ${module.estimatedTime}min`);
      console.log(`   Tags: ${module.tags.join(", ")}`);
      console.log("");
    });
    
    return true;
  } catch (error) {
    console.error("❌ Error seeding basic modules:", error);
    return false;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cy-lms")
    .then(() => {
      console.log("🔗 Connected to MongoDB");
      seedBasicModules()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
    })
    .catch((error) => {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1);
    });
}

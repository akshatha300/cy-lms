import mongoose from "mongoose";
import CareerRoadmap from "../models/CareerRoadmap.js";
import Module from "../models/Module.js";
import Lab from "../models/Lab.js";
import Skill from "../models/Skill.js";
import logger from "../utils/logger.js";

const careerRoadmaps = [
  {
    roleName: "Machine Learning Engineer",
    description: "Design, develop, and deploy machine learning models and systems. Focus on building scalable ML solutions and optimizing model performance.",
    estimatedDuration: 24, // weeks
    difficulty: "intermediate",
    salaryRange: { min: 120000, max: 180000, currency: "USD" },
    icon: "🤖",
    color: "#3b82f6",
    minQuizScore: 75,
    prerequisites: ["Programming fundamentals", "Basic statistics", "Linear algebra"],
    careerOutlook: {
      growth: "High",
      demand: "Very High",
      description: "Strong demand across tech, finance, healthcare, and e-commerce sectors"
    },
    requiredModules: [
      { moduleId: null, moduleName: "Introduction to Machine Learning", order: 1, isOptional: false },
      { moduleId: null, moduleName: "Data Preprocessing & Feature Engineering", order: 2, isOptional: false },
      { moduleId: null, moduleName: "Supervised Learning", order: 3, isOptional: false },
      { moduleId: null, moduleName: "Unsupervised Learning", order: 4, isOptional: false },
      { moduleId: null, moduleName: "Ensemble Techniques", order: 5, isOptional: false },
      { moduleId: null, moduleName: "Model Deployment & MLOps", order: 6, isOptional: false }
    ],
    requiredLabs: [
      { labId: null, labName: "Forward Feature Selection", order: 1, minAccuracy: 70, isOptional: false },
      { labId: null, labName: "Backward Elimination", order: 2, minAccuracy: 70, isOptional: false },
      { labId: null, labName: "Linear Regression", order: 3, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "Logistic Regression", order: 4, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "K-Nearest Neighbors", order: 5, minAccuracy: 70, isOptional: false },
      { labId: null, labName: "K-Means Clustering", order: 6, minAccuracy: 70, isOptional: false },
      { labId: null, labName: "Gradient Boosting", order: 7, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "XGBoost Implementation", order: 8, minAccuracy: 75, isOptional: false }
    ],
    requiredSkills: [
      { skillId: null, skillName: "Feature Engineering", minCompetency: 80, weight: 1.2 },
      { skillId: null, skillName: "Model Evaluation", minCompetency: 75, weight: 1.0 },
      { skillId: null, skillName: "Hyperparameter Tuning", minCompetency: 75, weight: 1.0 },
      { skillId: null, skillName: "Ensemble Methods", minCompetency: 80, weight: 1.1 },
      { skillId: null, skillName: "Python Programming", minCompetency: 85, weight: 1.3 }
    ]
  },
  {
    roleName: "Data Scientist",
    description: "Extract insights from data using statistical analysis, machine learning, and visualization. Focus on data-driven decision making and business intelligence.",
    estimatedDuration: 20,
    difficulty: "intermediate",
    salaryRange: { min: 110000, max: 160000, currency: "USD" },
    icon: "📊",
    color: "#10b981",
    minQuizScore: 70,
    prerequisites: ["Statistics", "Python programming", "Data visualization basics"],
    careerOutlook: {
      growth: "High",
      demand: "Very High",
      description: "Critical role in data-driven organizations across all industries"
    },
    requiredModules: [
      { moduleId: null, moduleName: "Introduction to Machine Learning", order: 1, isOptional: false },
      { moduleId: null, moduleName: "Data Preprocessing & Feature Engineering", order: 2, isOptional: false },
      { moduleId: null, moduleName: "Supervised Learning", order: 3, isOptional: false },
      { moduleId: null, moduleName: "Unsupervised Learning", order: 4, isOptional: false },
      { moduleId: null, moduleName: "Statistical Analysis", order: 5, isOptional: false },
      { moduleId: null, moduleName: "Data Visualization", order: 6, isOptional: false }
    ],
    requiredLabs: [
      { labId: null, labName: "Linear Regression", order: 1, minAccuracy: 70, isOptional: false },
      { labId: null, labName: "Logistic Regression", order: 2, minAccuracy: 70, isOptional: false },
      { labId: null, labName: "K-Means Clustering", order: 3, minAccuracy: 70, isOptional: false },
      { labId: null, labName: "Hierarchical Clustering", order: 4, minAccuracy: 70, isOptional: false },
      { labId: null, labName: "Statistical Analysis", order: 5, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "Data Visualization", order: 6, minAccuracy: 70, isOptional: false }
    ],
    requiredSkills: [
      { skillId: null, skillName: "Statistical Analysis", minCompetency: 80, weight: 1.2 },
      { skillId: null, skillName: "Data Visualization", minCompetency: 75, weight: 1.0 },
      { skillId: null, skillName: "Python Programming", minCompetency: 80, weight: 1.1 },
      { skillId: null, skillName: "Business Intelligence", minCompetency: 70, weight: 1.0 },
      { skillId: null, skillName: "Data Cleaning", minCompetency: 85, weight: 1.3 }
    ]
  },
  {
    roleName: "AI Research Engineer",
    description: "Push the boundaries of artificial intelligence through research and development of novel algorithms and architectures. Focus on cutting-edge AI technologies.",
    estimatedDuration: 36,
    difficulty: "advanced",
    salaryRange: { min: 150000, max: 250000, currency: "USD" },
    icon: "🔬",
    color: "#8b5cf6",
    minQuizScore: 85,
    prerequisites: ["Advanced mathematics", "Deep learning fundamentals", "Research methodology"],
    careerOutlook: {
      growth: "Very High",
      demand: "High",
      description: "Specialized role in research labs, tech giants, and innovative startups"
    },
    requiredModules: [
      { moduleId: null, moduleName: "Supervised Learning", order: 1, isOptional: false },
      { moduleId: null, moduleName: "Deep Learning", order: 2, isOptional: false },
      { moduleId: null, moduleName: "Natural Language Processing", order: 3, isOptional: false },
      { moduleId: null, moduleName: "Computer Vision", order: 4, isOptional: false },
      { moduleId: null, moduleName: "Advanced Neural Networks", order: 5, isOptional: false },
      { moduleId: null, moduleName: "Research Methods", order: 6, isOptional: false }
    ],
    requiredLabs: [
      { labId: null, labName: "Gradient Boosting", order: 1, minAccuracy: 80, isOptional: false },
      { labId: null, labName: "XGBoost Implementation", order: 2, minAccuracy: 80, isOptional: false },
      { labId: null, labName: "CNN Architecture", order: 3, minAccuracy: 85, isOptional: false },
      { labId: null, labName: "RNN/LSTM Networks", order: 4, minAccuracy: 85, isOptional: false },
      { labId: null, labName: "Transformer Models", order: 5, minAccuracy: 85, isOptional: false },
      { labId: null, labName: "GAN Implementation", order: 6, minAccuracy: 80, isOptional: false },
      { labId: null, labName: "Reinforcement Learning", order: 7, minAccuracy: 80, isOptional: false },
      { labId: null, labName: "Research Project", order: 8, minAccuracy: 75, isOptional: false }
    ],
    requiredSkills: [
      { skillId: null, skillName: "Deep Learning", minCompetency: 90, weight: 1.3 },
      { skillId: null, skillName: "Mathematical Modeling", minCompetency: 85, weight: 1.2 },
      { skillId: null, skillName: "Research Methods", minCompetency: 80, weight: 1.0 },
      { skillId: null, skillName: "Algorithm Design", minCompetency: 85, weight: 1.1 },
      { skillId: null, skillName: "Paper Writing", minCompetency: 70, weight: 0.8 }
    ]
  },
  {
    roleName: "MLOps Engineer",
    description: "Bridge the gap between machine learning development and operations. Focus on deploying, monitoring, and maintaining ML systems in production.",
    estimatedDuration: 18,
    difficulty: "intermediate",
    salaryRange: { min: 130000, max: 190000, currency: "USD" },
    icon: "⚙️",
    color: "#f59e0b",
    minQuizScore: 75,
    prerequisites: ["DevOps fundamentals", "Cloud computing", "Containerization"],
    careerOutlook: {
      growth: "Very High",
      demand: "Very High",
      description: "Critical role for companies scaling ML operations and production systems"
    },
    requiredModules: [
      { moduleId: null, moduleName: "Model Deployment & MLOps", order: 1, isOptional: false },
      { moduleId: null, moduleName: "Data Preprocessing & Feature Engineering", order: 2, isOptional: false },
      { moduleId: null, moduleName: "Supervised Learning", order: 3, isOptional: false },
      { moduleId: null, moduleName: "Ensemble Techniques", order: 4, isOptional: false },
      { moduleId: null, moduleName: "Cloud Computing", order: 5, isOptional: false },
      { moduleId: null, moduleName: "Containerization & Orchestration", order: 6, isOptional: false }
    ],
    requiredLabs: [
      { labId: null, labName: "Model API Deployment", order: 1, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "Docker Containerization", order: 2, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "Kubernetes Orchestration", order: 3, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "CI/CD Pipeline", order: 4, minAccuracy: 70, isOptional: false },
      { labId: null, labName: "Model Monitoring", order: 5, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "Performance Optimization", order: 6, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "A/B Testing", order: 7, minAccuracy: 70, isOptional: false },
      { labId: null, labName: "Model Versioning", order: 8, minAccuracy: 75, isOptional: false }
    ],
    requiredSkills: [
      { skillId: null, skillName: "DevOps", minCompetency: 80, weight: 1.2 },
      { skillId: null, skillName: "Cloud Computing", minCompetency: 75, weight: 1.1 },
      { skillId: null, skillName: "Containerization", minCompetency: 80, weight: 1.2 },
      { skillId: null, skillName: "System Architecture", minCompetency: 75, weight: 1.0 },
      { skillId: null, skillName: "Monitoring & Logging", minCompetency: 80, weight: 1.1 }
    ]
  },
  {
    roleName: "NLP Engineer",
    description: "Specialize in natural language processing and understanding. Build systems that can analyze, understand, and generate human language.",
    estimatedDuration: 28,
    difficulty: "advanced",
    salaryRange: { min: 140000, max: 200000, currency: "USD" },
    icon: "💬",
    color: "#06b6d4",
    minQuizScore: 80,
    prerequisites: ["Linguistics basics", "Deep learning", "Text processing"],
    careerOutlook: {
      growth: "Very High",
      demand: "Very High",
      description: "High demand in chatbots, translation, sentiment analysis, and content generation"
    },
    requiredModules: [
      { moduleId: null, moduleName: "Natural Language Processing", order: 1, isOptional: false },
      { moduleId: null, moduleName: "Deep Learning", order: 2, isOptional: false },
      { moduleId: null, moduleName: "Text Preprocessing", order: 3, isOptional: false },
      { moduleId: null, moduleName: "Advanced NLP", order: 4, isOptional: false },
      { moduleId: null, moduleName: "Transformer Models", order: 5, isOptional: false },
      { moduleId: null, moduleName: "NLP Applications", order: 6, isOptional: false }
    ],
    requiredLabs: [
      { labId: null, labName: "Text Classification", order: 1, minAccuracy: 80, isOptional: false },
      { labId: null, labName: "Named Entity Recognition", order: 2, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "Sentiment Analysis", order: 3, minAccuracy: 80, isOptional: false },
      { labId: null, labName: "Machine Translation", order: 4, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "Question Answering", order: 5, minAccuracy: 80, isOptional: false },
      { labId: null, labName: "Text Generation", order: 6, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "BERT Fine-tuning", order: 7, minAccuracy: 80, isOptional: false },
      { labId: null, labName: "GPT Integration", order: 8, minAccuracy: 75, isOptional: false }
    ],
    requiredSkills: [
      { skillId: null, skillName: "Text Processing", minCompetency: 85, weight: 1.2 },
      { skillId: null, skillName: "Transformer Models", minCompetency: 80, weight: 1.3 },
      { skillId: null, skillName: "Linguistics", minCompetency: 70, weight: 0.8 },
      { skillId: null, skillName: "Deep Learning", minCompetency: 85, weight: 1.1 },
      { skillId: null, skillName: "Python Programming", minCompetency: 85, weight: 1.1 }
    ]
  },
  {
    roleName: "Computer Vision Engineer",
    description: "Develop systems that can see and interpret visual information. Work on image processing, object detection, and visual understanding.",
    estimatedDuration: 30,
    difficulty: "advanced",
    salaryRange: { min: 135000, max: 195000, currency: "USD" },
    icon: "👁️",
    color: "#ef4444",
    minQuizScore: 80,
    prerequisites: ["Image processing", "Deep learning", "Computer vision basics"],
    careerOutlook: {
      growth: "Very High",
      demand: "Very High",
      description: "Critical role in autonomous vehicles, medical imaging, security, and AR/VR"
    },
    requiredModules: [
      { moduleId: null, moduleName: "Computer Vision", order: 1, isOptional: false },
      { moduleId: null, moduleName: "Deep Learning", order: 2, isOptional: false },
      { moduleId: null, moduleName: "Image Processing", order: 3, isOptional: false },
      { moduleId: null, moduleName: "Advanced Computer Vision", order: 4, isOptional: false },
      { moduleId: null, moduleName: "3D Vision", order: 5, isOptional: false },
      { moduleId: null, moduleName: "Video Analysis", order: 6, isOptional: false }
    ],
    requiredLabs: [
      { labId: null, labName: "Image Classification", order: 1, minAccuracy: 80, isOptional: false },
      { labId: null, labName: "Object Detection", order: 2, minAccuracy: 80, isOptional: false },
      { labId: null, labName: "Semantic Segmentation", order: 3, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "Face Recognition", order: 4, minAccuracy: 80, isOptional: false },
      { labId: null, labName: "Image Generation", order: 5, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "Style Transfer", order: 6, minAccuracy: 70, isOptional: false },
      { labId: null, labName: "3D Reconstruction", order: 7, minAccuracy: 75, isOptional: false },
      { labId: null, labName: "Video Analysis", order: 8, minAccuracy: 75, isOptional: false }
    ],
    requiredSkills: [
      { skillId: null, skillName: "Image Processing", minCompetency: 85, weight: 1.2 },
      { skillId: null, skillName: "Deep Learning", minCompetency: 85, weight: 1.3 },
      { skillId: null, skillName: "Computer Vision", minCompetency: 80, weight: 1.1 },
      { skillId: null, skillName: "Mathematical Modeling", minCompetency: 75, weight: 1.0 },
      { skillId: null, skillName: "Python Programming", minCompetency: 85, weight: 1.1 }
    ]
  }
];

export const seedCareerRoadmaps = async () => {
  try {
    console.log("🎯 Starting Career Roadmap seeding...");

    // Clear existing roadmaps
    await CareerRoadmap.deleteMany({});
    console.log("🗑️ Cleared existing career roadmaps");

    // Get existing modules, labs, and skills
    const modules = await Module.find({}).select('_id title');
    const labs = await Lab.find({}).select('_id name');
    const skills = await Skill.find({}).select('_id name');

    console.log(`📚 Found ${modules.length} modules, ${labs.length} labs, ${skills.length} skills`);

    // Create module, lab, and skill lookup maps
    const moduleMap = {};
    modules.forEach(module => {
      moduleMap[module.title.toLowerCase()] = module._id;
    });

    const labMap = {};
    labs.forEach(lab => {
      labMap[lab.name.toLowerCase()] = lab._id;
    });

    const skillMap = {};
    skills.forEach(skill => {
      skillMap[skill.name.toLowerCase()] = skill._id;
    });

    // Map and create roadmaps
    for (const roadmapData of careerRoadmaps) {
      // Map modules
      roadmapData.requiredModules = roadmapData.requiredModules.map(module => ({
        ...module,
        moduleId: moduleMap[module.moduleName.toLowerCase()] || null
      }));

      // Map labs
      roadmapData.requiredLabs = roadmapData.requiredLabs.map(lab => ({
        ...lab,
        labId: labMap[lab.labName.toLowerCase()] || null
      }));

      // Map skills
      roadmapData.requiredSkills = roadmapData.requiredSkills.map(skill => ({
        ...skill,
        skillId: skillMap[skill.skillName.toLowerCase()] || null
      }));

      const roadmap = new CareerRoadmap(roadmapData);
      await roadmap.save();
      console.log(`✅ Created roadmap: ${roadmap.roleName}`);
    }

    console.log("🎉 Career Roadmap seeding completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error seeding career roadmaps:", error);
    return false;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cy-lms")
    .then(() => {
      console.log("🔗 Connected to MongoDB");
      seedCareerRoadmaps()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
    })
    .catch((error) => {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1);
    });
}

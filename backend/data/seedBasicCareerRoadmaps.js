import mongoose from "mongoose";

// Create a simple schema for basic career roadmaps
const basicCareerRoadmapSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  estimatedDuration: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true
  },
  minQuizScore: {
    type: Number,
    default: 75
  },
  salaryRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  icon: {
    type: String,
    default: "🎯"
  },
  color: {
    type: String,
    default: "#3b82f6"
  },
  prerequisites: [{
    type: String
  }],
  careerOutlook: {
    growth: String,
    demand: String,
    description: String
  },
  scoreWeights: {
    moduleCompletion: { type: Number, default: 0.3 },
    labCompletion: { type: Number, default: 0.3 },
    quizAverage: { type: Number, default: 0.2 },
    skillCompetency: { type: Number, default: 0.2 }
  },
  requiredModules: [{
    name: String,
    description: String
  }],
  requiredLabs: [{
    name: String,
    description: String
  }],
  requiredSkills: [{
    name: String,
    description: String
  }]
}, { timestamps: true });

const BasicCareerRoadmap = mongoose.model("BasicCareerRoadmap", basicCareerRoadmapSchema);

const basicRoadmaps = [
  {
    roleName: "Machine Learning Engineer",
    description: "Design, build, and deploy machine learning models to solve real-world problems. Work with large datasets, implement algorithms, and optimize model performance.",
    estimatedDuration: 24,
    difficulty: "intermediate",
    minQuizScore: 75,
    salaryRange: { min: 120000, max: 180000 },
    icon: "🤖",
    color: "#3b82f6",
    prerequisites: ["Python programming", "Statistics", "Linear algebra"],
    careerOutlook: {
      growth: "High",
      demand: "Very High",
      description: "Strong demand across tech, finance, healthcare, and automotive industries"
    },
    scoreWeights: {
      moduleCompletion: 0.3,
      labCompletion: 0.3,
      quizAverage: 0.2,
      skillCompetency: 0.2
    },
    requiredModules: [
      { name: "Introduction to Machine Learning", description: "ML fundamentals" },
      { name: "Data Preprocessing & Feature Engineering", description: "Data preparation techniques" },
      { name: "Supervised Learning", description: "Classification and regression" },
      { name: "Unsupervised Learning", description: "Clustering and dimensionality reduction" },
      { name: "Deep Learning", description: "Neural networks and deep architectures" },
      { name: "Model Deployment & MLOps", description: "Production ML systems" }
    ],
    requiredLabs: [
      { name: "Linear Regression Lab", description: "Implement linear regression from scratch" },
      { name: "Logistic Regression Implementation", description: "Binary classification with logistic regression" },
      { name: "K-Means Clustering", description: "Customer segmentation with clustering" },
      { name: "Neural Network Basics", description: "Build simple neural networks" },
      { name: "Gradient Boosting Implementation", description: "Advanced ensemble methods" },
      { name: "Model Evaluation Metrics", description: "Performance measurement techniques" },
      { name: "Cross-Validation Techniques", description: "Robust model evaluation" },
      { name: "Random Forest Ensemble", description: "Ensemble learning methods" }
    ],
    requiredSkills: [
      { name: "Python", description: "Programming language for ML" },
      { name: "Machine Learning", description: "ML algorithms and concepts" },
      { name: "Deep Learning", description: "Neural networks and frameworks" },
      { name: "Data Science", description: "Data analysis and manipulation" },
      { name: "MLOps", description: "Machine learning operations" }
    ]
  },
  
  {
    roleName: "Data Scientist",
    description: "Extract insights from data using statistical analysis, machine learning, and data visualization. Transform raw data into actionable business intelligence.",
    estimatedDuration: 20,
    difficulty: "intermediate",
    minQuizScore: 70,
    salaryRange: { min: 110000, max: 160000 },
    icon: "📊",
    color: "#10b981",
    prerequisites: ["Statistics", "Python", "SQL"],
    careerOutlook: {
      growth: "High",
      demand: "Very High",
      description: "Critical role in data-driven decision making across all industries"
    },
    scoreWeights: {
      moduleCompletion: 0.3,
      labCompletion: 0.3,
      quizAverage: 0.2,
      skillCompetency: 0.2
    },
    requiredModules: [
      { name: "Introduction to Machine Learning", description: "ML fundamentals" },
      { name: "Data Preprocessing & Feature Engineering", description: "Data cleaning and preparation" },
      { name: "Supervised Learning", description: "Predictive modeling" },
      { name: "Unsupervised Learning", description: "Pattern discovery" },
      { name: "Statistics for Data Science", description: "Statistical methods" },
      { name: "Data Visualization", description: "Communicating insights visually" }
    ],
    requiredLabs: [
      { name: "Linear Regression Lab", description: "Predictive modeling" },
      { name: "Logistic Regression Implementation", description: "Classification problems" },
      { name: "K-Means Clustering", description: "Customer segmentation" },
      { name: "Feature Selection Challenge", description: "Choosing the right features" },
      { name: "Model Evaluation Metrics", description: "Assessing model performance" },
      { name: "Data Cleaning Workshop", description: "Handling messy data" }
    ],
    requiredSkills: [
      { name: "Python", description: "Data analysis programming" },
      { name: "Statistics", description: "Statistical analysis" },
      { name: "Data Visualization", description: "Creating insightful charts" },
      { name: "SQL", description: "Database querying" },
      { name: "Business Intelligence", description: "Business context and insights" }
    ]
  },
  
  {
    roleName: "AI Research Engineer",
    description: "Push the boundaries of artificial intelligence through research and innovation. Develop novel algorithms and contribute to cutting-edge AI advancements.",
    estimatedDuration: 36,
    difficulty: "advanced",
    minQuizScore: 85,
    salaryRange: { min: 150000, max: 250000 },
    icon: "🔬",
    color: "#8b5cf6",
    prerequisites: ["Advanced mathematics", "Deep learning", "Research methodology"],
    careerOutlook: {
      growth: "Very High",
      demand: "High",
      description: "Leading AI innovation in tech companies and research institutions"
    },
    scoreWeights: {
      moduleCompletion: 0.25,
      labCompletion: 0.35,
      quizAverage: 0.2,
      skillCompetency: 0.2
    },
    requiredModules: [
      { name: "Supervised Learning", description: "Advanced classification and regression" },
      { name: "Deep Learning", description: "Neural network architectures" },
      { name: "Natural Language Processing", description: "Language understanding and generation" },
      { name: "Computer Vision", description: "Image and video analysis" },
      { name: "Advanced Neural Networks", description: "Cutting-edge architectures" },
      { name: "Research Methods", description: "Scientific research methodology" }
    ],
    requiredLabs: [
      { name: "Neural Network Basics", description: "Foundation of deep learning" },
      { name: "Image Recognition with CNN", description: "Computer vision applications" },
      { name: "Text Classification with NLP", description: "Natural language processing" },
      { name: "Gradient Boosting Implementation", description: "Advanced ensemble methods" },
      { name: "Time Series Forecasting", description: "Sequential data modeling" },
      { name: "Support Vector Machines", description: "Advanced classification techniques" },
      { name: "PCA Dimensionality Reduction", description: "Feature engineering" },
      { name: "Research Project", description: "Independent AI research" }
    ],
    requiredSkills: [
      { name: "Deep Learning", description: "Advanced neural networks" },
      { name: "Mathematical Modeling", description: "Mathematical foundations" },
      { name: "Research Methods", description: "Scientific research skills" },
      { name: "Algorithm Design", description: "Creating novel algorithms" },
      { name: "Paper Writing", description: "Academic communication" }
    ]
  },
  
  {
    roleName: "MLOps Engineer",
    description: "Bridge the gap between machine learning development and production deployment. Build scalable, reliable ML systems and infrastructure.",
    estimatedDuration: 18,
    difficulty: "advanced",
    minQuizScore: 80,
    salaryRange: { min: 130000, max: 190000 },
    icon: "⚙️",
    color: "#f59e0b",
    prerequisites: ["Software engineering", "Cloud computing", "DevOps"],
    careerOutlook: {
      growth: "Very High",
      demand: "Very High",
      description: "Critical role for deploying ML models at scale in production environments"
    },
    scoreWeights: {
      moduleCompletion: 0.3,
      labCompletion: 0.3,
      quizAverage: 0.2,
      skillCompetency: 0.2
    },
    requiredModules: [
      { name: "Model Deployment & MLOps", description: "Production ML systems" },
      { name: "Data Preprocessing & Feature Engineering", description: "Data pipelines" },
      { name: "Supervised Learning", description: "Model understanding" },
      { name: "Ensemble Methods", description: "Production-ready models" },
      { name: "Cloud Computing", description: "Cloud infrastructure" },
      { name: "Containerization", description: "Docker and Kubernetes" }
    ],
    requiredLabs: [
      { name: "Model Deployment Lab", description: "Deploy ML models as APIs" },
      { name: "Docker Containerization", description: "Containerize ML applications" },
      { name: "Kubernetes Orchestration", description: "Scale ML deployments" },
      { name: "CI/CD for ML", description: "Automated ML pipelines" },
      { name: "Model Monitoring", description: "Track model performance" },
      { name: "Performance Optimization", description: "Optimize ML systems" },
      { name: "A/B Testing", description: "Model comparison" },
      { name: "Model Versioning", description: "Track model iterations" }
    ],
    requiredSkills: [
      { name: "DevOps", description: "Development and operations" },
      { name: "Cloud Computing", description: "AWS, GCP, Azure" },
      { name: "Containerization", description: "Docker, Kubernetes" },
      { name: "System Architecture", description: "Designing scalable systems" },
      { name: "Monitoring & Logging", description: "System observability" }
    ]
  },
  
  {
    roleName: "NLP Engineer",
    description: "Specialize in natural language processing to build systems that understand, interpret, and generate human language. Work with text data and language models.",
    estimatedDuration: 28,
    difficulty: "advanced",
    minQuizScore: 80,
    salaryRange: { min: 140000, max: 200000 },
    icon: "💬",
    color: "#06b6d4",
    prerequisites: ["Linguistics", "Deep learning", "Text processing"],
    careerOutlook: {
      growth: "Very High",
      demand: "Very High",
      description: "High demand with the rise of large language models and conversational AI"
    },
    scoreWeights: {
      moduleCompletion: 0.3,
      labCompletion: 0.3,
      quizAverage: 0.2,
      skillCompetency: 0.2
    },
    requiredModules: [
      { name: "Natural Language Processing", description: "NLP fundamentals" },
      { name: "Deep Learning", description: "Neural networks for text" },
      { name: "Text Preprocessing", description: "Text cleaning and preparation" },
      { name: "Advanced NLP", description: "Modern NLP techniques" },
      { name: "Transformers", description: "Attention mechanisms" },
      { name: "NLP Applications", description: "Real-world NLP systems" }
    ],
    requiredLabs: [
      { name: "Text Classification Lab", description: "Categorize text documents" },
      { name: "Named Entity Recognition", description: "Extract entities from text" },
      { name: "Sentiment Analysis", description: "Analyze text sentiment" },
      { name: "Machine Translation", description: "Translate between languages" },
      { name: "Question Answering", description: "Build QA systems" },
      { name: "Text Generation", description: "Generate human-like text" },
      { name: "BERT Fine-tuning", description: "Adapt pre-trained models" },
      { name: "GPT Integration", description: "Work with large language models" }
    ],
    requiredSkills: [
      { name: "Text Processing", description: "Text manipulation and analysis" },
      { name: "Transformer Models", description: "Modern NLP architectures" },
      { name: "Linguistics", description: "Understanding language structure" },
      { name: "Deep Learning", description: "Neural networks for NLP" },
      { name: "Python", description: "NLP programming" }
    ]
  },
  
  {
    roleName: "Computer Vision Engineer",
    description: "Develop systems that can see and interpret visual information. Work with images, videos, and computer vision algorithms to solve real-world problems.",
    estimatedDuration: 30,
    difficulty: "advanced",
    minQuizScore: 80,
    salaryRange: { min: 135000, max: 195000 },
    icon: "👁️",
    color: "#ef4444",
    prerequisites: ["Image processing", "Deep learning", "Linear algebra"],
    careerOutlook: {
      growth: "High",
      demand: "Very High",
      description: "Growing demand in autonomous vehicles, healthcare, and augmented reality"
    },
    scoreWeights: {
      moduleCompletion: 0.3,
      labCompletion: 0.3,
      quizAverage: 0.2,
      skillCompetency: 0.2
    },
    requiredModules: [
      { name: "Computer Vision", description: "CV fundamentals" },
      { name: "Deep Learning", description: "Neural networks for vision" },
      { name: "Image Processing", description: "Image manipulation and analysis" },
      { name: "Advanced Computer Vision", description: "Modern CV techniques" },
      { name: "3D Vision", description: "3D scene understanding" },
      { name: "Video Analysis", description: "Video processing and understanding" }
    ],
    requiredLabs: [
      { name: "Image Classification Lab", description: "Classify images into categories" },
      { name: "Object Detection", description: "Detect objects in images" },
      { name: "Semantic Segmentation", description: "Pixel-level classification" },
      { name: "Face Recognition", description: "Identify faces in images" },
      { name: "Image Generation", description: "Create images with AI" },
      { name: "Style Transfer", description: "Apply artistic styles" },
      { name: "3D Reconstruction", description: "Reconstruct 3D scenes" },
      { name: "Video Analysis", description: "Analyze video content" }
    ],
    requiredSkills: [
      { name: "Image Processing", description: "Digital image manipulation" },
      { name: "Deep Learning", description: "CNNs and vision models" },
      { name: "Computer Vision", description: "CV algorithms and techniques" },
      { name: "Mathematical Modeling", description: "Mathematical foundations" },
      { name: "Python", description: "CV programming with OpenCV" }
    ]
  }
];

export const seedBasicCareerRoadmaps = async () => {
  try {
    console.log("🛤️ Starting basic career roadmap seeding...");

    // Clear existing basic roadmaps
    await BasicCareerRoadmap.deleteMany({});
    console.log("🗑️ Cleared existing basic career roadmaps");

    let createdCount = 0;

    for (const roadmapData of basicRoadmaps) {
      const roadmap = new BasicCareerRoadmap(roadmapData);
      await roadmap.save();
      createdCount++;
      console.log(`✅ Created basic career roadmap: ${roadmapData.roleName}`);
    }

    console.log(`🎉 Basic career roadmap seeding completed! Created ${createdCount} roadmaps.`);
    console.log("\n🛤️ Available Career Paths:");
    basicRoadmaps.forEach((roadmap, index) => {
      console.log(`${index + 1}. ${roadmap.roleName}`);
      console.log(`   Duration: ${roadmap.estimatedDuration} weeks`);
      console.log(`   Difficulty: ${roadmap.difficulty}`);
      console.log(`   Salary: $${roadmap.salaryRange.min.toLocaleString()} - $${roadmap.salaryRange.max.toLocaleString()}`);
      console.log(`   Modules: ${roadmap.requiredModules.length} | Labs: ${roadmap.requiredLabs.length} | Skills: ${roadmap.requiredSkills.length}`);
      console.log("");
    });
    
    return true;
  } catch (error) {
    console.error("❌ Error seeding basic career roadmaps:", error);
    return false;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cy-lms")
    .then(() => {
      console.log("🔗 Connected to MongoDB");
      seedBasicCareerRoadmaps()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
    })
    .catch((error) => {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1);
    });
}

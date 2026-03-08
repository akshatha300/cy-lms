import mongoose from "mongoose";
import Module from "../models/Module.js";
import logger from "../utils/logger.js";

const learningMaterials = {
  "Introduction to Machine Learning": [
    {
      title: "What is Machine Learning?",
      type: "video",
      url: "https://www.youtube.com/watch?v=ukzFI9rgfw",
      content: "Introduction to the fundamental concepts of machine learning, including supervised, unsupervised, and reinforcement learning."
    },
    {
      title: "Machine Learning Basics",
      type: "pdf",
      url: "https://example.com/ml-basics.pdf",
      content: "Comprehensive guide covering ML terminology, types of learning, and basic algorithms."
    },
    {
      title: "Types of Machine Learning",
      type: "article",
      content: `## Types of Machine Learning

### 1. Supervised Learning
- Definition: Learning from labeled data
- Examples: Classification, Regression
- Algorithms: Linear Regression, SVM, Decision Trees

### 2. Unsupervised Learning  
- Definition: Learning from unlabeled data
- Examples: Clustering, Dimensionality Reduction
- Algorithms: K-Means, PCA, Hierarchical Clustering

### 3. Reinforcement Learning
- Definition: Learning through interaction with environment
- Examples: Game playing, Robotics
- Algorithms: Q-Learning, Deep Q Networks

### Key Differences
- **Data Requirements**: Supervised needs labeled data, Unsupervised doesn't
- **Goal**: Supervised predicts outcomes, Unsupervised finds patterns
- **Applications**: Different use cases for each type`
    },
    {
      title: "ML Workflow",
      type: "link",
      url: "https://scikit-learn.org/stable/tutorial/basic/tutorial.html",
      content: "Complete machine learning project workflow from data collection to deployment."
    }
  ],
  
  "Data Preprocessing & Feature Engineering": [
    {
      title: "Data Cleaning Techniques",
      type: "video",
      url: "https://www.youtube.com/watch?v=Gb4_1S8g5t8",
      content: "Learn how to handle missing values, outliers, and data inconsistencies."
    },
    {
      title: "Feature Engineering Guide",
      type: "pdf",
      url: "https://example.com/feature-engineering.pdf",
      content: "Advanced techniques for creating and selecting features for ML models."
    },
    {
      title: "Data Preprocessing Pipeline",
      type: "article",
      content: `## Data Preprocessing Pipeline

### 1. Data Collection
- Identify data sources
- Collect raw data
- Document data provenance

### 2. Data Cleaning
- Handle missing values
- Remove duplicates
- Fix inconsistencies
- Deal with outliers

### 3. Data Transformation
- Normalization (Min-Max, Z-score)
- Standardization
- Log transformations
- Categorical encoding

### 4. Feature Engineering
- Create new features
- Feature selection
- Dimensionality reduction
- Domain-specific features

### 5. Data Splitting
- Train/validation/test split
- Cross-validation setup
- Stratified sampling

### Best Practices
- Always keep a copy of original data
- Document all transformations
- Test preprocessing on small sample first
- Consider production constraints`
    },
    {
      title: "Scikit-learn Preprocessing",
      type: "link",
      url: "https://scikit-learn.org/stable/modules/preprocessing.html",
      content: "Official documentation for data preprocessing tools."
    }
  ],
  
  "Supervised Learning": [
    {
      title: "Supervised Learning Overview",
      type: "video",
      url: "https://www.youtube.com/watch?v=nKW8Ngu7FqM",
      content: "Complete overview of supervised learning algorithms and applications."
    },
    {
      title: "Classification Algorithms",
      type: "pdf",
      url: "https://example.com/classification.pdf",
      content: "Detailed guide to classification algorithms including decision trees, SVM, and neural networks."
    },
    {
      title: "Regression Analysis",
      type: "article",
      content: `## Regression Analysis

### Linear Regression
- Simple Linear Regression: y = mx + b
- Multiple Linear Regression: y = b₀ + b₁x₁ + b₂x₂ + ... + bₙxₙ
- Evaluation Metrics: MSE, RMSE, R²

### Polynomial Regression
- Non-linear relationships
- Feature engineering
- Overfitting considerations

### Regularization
- Ridge Regression (L2)
- Lasso Regression (L1)
- Elastic Net

### Model Selection
- Cross-validation
- Grid search
- Random search
- Bayesian optimization

### Practical Tips
- Check assumptions
- Handle multicollinearity
- Consider feature scaling
- Validate on test data`
    },
    {
      title: "ML Algorithms Comparison",
      type: "link",
      url: "https://scikit-learn.org/stable/auto_examples/classification/plot_classifier_comparison.html",
      content: "Visual comparison of different classification algorithms."
    }
  ],
  
  "Unsupervised Learning": [
    {
      title: "Clustering Algorithms",
      type: "video",
      url: "https://www.youtube.com/watch?v=Xvwt7y2jf5M",
      content: "Understanding clustering algorithms and their applications."
    },
    {
      title: "Dimensionality Reduction",
      type: "pdf",
      url: "https://example.com/dimensionality-reduction.pdf",
      content: "PCA, t-SNE, and other dimensionality reduction techniques."
    },
    {
      title: "Clustering Methods",
      type: "article",
      content: `## Clustering Methods

### K-Means Clustering
- Centroid-based clustering
- Distance metrics
- Elbow method for K selection
- K-means++ initialization

### Hierarchical Clustering
- Agglomerative (bottom-up)
- Divisive (top-down)
- Linkage criteria
- Dendrogram interpretation

### Density-Based Clustering
- DBSCAN algorithm
- Epsilon and MinPts parameters
- Noise handling
- Arbitrary shape detection

### Evaluation Metrics
- Silhouette score
- Davies-Bouldin index
- Calinski-Harabasz index
- Domain-specific metrics

### Applications
- Customer segmentation
- Anomaly detection
- Image segmentation
- Document clustering`
    },
    {
      title: "Clustering Visualization",
      type: "link",
      url: "https://scikit-learn.org/stable/modules/clustering.html",
      content: "Interactive examples of clustering algorithms."
    }
  ],
  
  "Deep Learning": [
    {
      title: "Neural Networks Fundamentals",
      type: "video",
      url: "https://www.youtube.com/watch?v=aircAruvnKk",
      content: "3Blue1Brown's excellent introduction to neural networks."
    },
    {
      title: "Deep Learning Architecture",
      type: "pdf",
      url: "https://example.com/deep-learning-arch.pdf",
      content: "Comprehensive guide to CNN, RNN, LSTM, and Transformer architectures."
    },
    {
      title: "Backpropagation Explained",
      type: "article",
      content: `## Backpropagation Algorithm

### Forward Pass
- Input layer calculations
- Hidden layer activations
- Output layer predictions
- Loss computation

### Backward Pass
- Gradient computation
- Chain rule application
- Weight updates
- Learning rate considerations

### Activation Functions
- Sigmoid: σ(x) = 1/(1 + e^(-x))
- Tanh: tanh(x)
- ReLU: max(0, x)
- Leaky ReLU: max(αx, x)

### Optimization
- Stochastic Gradient Descent
- Adam optimizer
- Learning rate scheduling
- Momentum and Nesterov

### Practical Tips
- Initialize weights properly
- Use batch normalization
- Apply dropout for regularization
- Monitor gradient flow`
    },
    {
      title: "TensorFlow Tutorial",
      type: "link",
      url: "https://www.tensorflow.org/tutorials",
      content: "Official TensorFlow tutorials and guides."
    }
  ],
  
  "Natural Language Processing": [
    {
      title: "NLP Fundamentals",
      type: "video",
      url: "https://www.youtube.com/watch?v=8rXD5-w6m4M",
      content: "Introduction to natural language processing and text analysis."
    },
    {
      title: "Text Processing Techniques",
      type: "pdf",
      url: "https://example.com/text-processing.pdf",
      content: "Tokenization, stemming, lemmatization, and text preprocessing."
    },
    {
      title: "Word Embeddings",
      type: "article",
      content: `## Word Embeddings

### Word2Vec
- Skip-gram model
- Continuous Bag of Words (CBOW)
- Negative sampling
- Vector space representation

### GloVe
- Global vectors
- Co-occurrence matrix
- Dimensionality reduction
- Semantic relationships

### BERT and Transformers
- Attention mechanism
- Contextual embeddings
- Pre-trained models
- Fine-tuning strategies

### Applications
- Text classification
- Sentiment analysis
- Machine translation
- Question answering

### Evaluation
- Similarity measures
- Analogy tasks
- Downstream performance
- Intrinsic vs extrinsic`
    },
    {
      title: "Hugging Face Transformers",
      type: "link",
      url: "https://huggingface.co/learn/nlp-course",
      content: "Free NLP course with hands-on examples."
    }
  ],
  
  "Computer Vision": [
    {
      title: "Computer Vision Basics",
      type: "video",
      url: "https://www.youtube.com/watch?v=iaSUYQ8adGw",
      content: "Introduction to computer vision and image processing."
    },
    {
      title: "CNN Architectures",
      type: "pdf",
      url: "https://example.com/cnn-architectures.pdf",
      content: "LeNet, AlexNet, VGG, ResNet, and modern CNN architectures."
    },
    {
      title: "Image Processing",
      type: "article",
      content: `## Image Processing

### Basic Operations
- Convolution
- Pooling (Max, Average)
- Normalization
- Data augmentation

### CNN Layers
- Convolutional layers
- Activation functions
- Pooling layers
- Fully connected layers

### Popular Architectures
- LeNet-5: Handwritten digits
- AlexNet: ImageNet winner
- VGG: Deep and simple
- ResNet: Residual connections
- EfficientNet: Compound scaling

### Applications
- Image classification
- Object detection
- Semantic segmentation
- Face recognition

### Tools and Frameworks
- OpenCV
- PyTorch
- TensorFlow
- Keras`
    },
    {
      title: "OpenCV Tutorial",
      type: "link",
      url: "https://opencv.org/tutorials/",
      content: "Official OpenCV tutorials and documentation."
    }
  ],
  
  "Model Deployment & MLOps": [
    {
      title: "MLOps Fundamentals",
      type: "video",
      url: "https://www.youtube.com/watch?v=06-AZXmwHjo",
      content: "Introduction to Machine Learning Operations and deployment strategies."
    },
    {
      title: "Docker for ML",
      type: "pdf",
      url: "https://example.com/docker-ml.pdf",
      content: "Containerizing machine learning models for production deployment."
    },
    {
      title: "Deployment Strategies",
      type: "article",
      content: `## Model Deployment

### Deployment Options
- Cloud platforms (AWS, GCP, Azure)
- On-premise servers
- Edge devices
- Serverless functions

### Containerization
- Docker containers
- Kubernetes orchestration
- Environment management
- Scalability considerations

### API Development
- REST API design
- Authentication and security
- Rate limiting
- Monitoring and logging

### CI/CD Pipeline
- Automated testing
- Model versioning
- Blue-green deployment
- Rollback strategies

### Monitoring
- Performance metrics
- Drift detection
- A/B testing
- Alerting systems

### Best Practices
- Start small and iterate
- Monitor everything
- Plan for failures
- Document thoroughly`
    },
    {
      title: "MLflow Tutorial",
      type: "link",
      url: "https://mlflow.org/docs/latest/index.html",
      content: "Open source platform for the ML lifecycle."
    }
  ]
};

export const seedLearningMaterials = async () => {
  try {
    console.log("📚 Starting learning materials seeding...");

    // Get all modules
    const modules = await Module.find({});
    console.log(`📖 Found ${modules.length} modules`);

    let updatedCount = 0;

    for (const module of modules) {
      const materials = learningMaterials[module.title];
      
      if (materials && materials.length > 0) {
        await Module.findByIdAndUpdate(module._id, {
          materials: materials
        });
        updatedCount++;
        console.log(`✅ Added ${materials.length} materials to: ${module.title}`);
      } else {
        console.log(`⚠️ No materials found for: ${module.title}`);
      }
    }

    console.log(`🎉 Learning materials seeding completed! Updated ${updatedCount} modules.`);
    return true;
  } catch (error) {
    console.error("❌ Error seeding learning materials:", error);
    return false;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cy-lms")
    .then(() => {
      console.log("🔗 Connected to MongoDB");
      seedLearningMaterials()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
    })
    .catch((error) => {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1);
    });
}

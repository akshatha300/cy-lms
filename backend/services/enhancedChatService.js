import fetch from "node-fetch";

/**
 * Enhanced AIML Chat Service with specialized knowledge and capabilities
 * Features:
 * - Code generation and debugging
 * - Mathematical explanations
 * - Step-by-step tutorials
 * - Real-world examples
 * - Interactive learning
 */

const AIML_KNOWLEDGE_BASE = {
  concepts: {
    "machine learning": {
      definition: "Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.",
      key_points: [
        "Data-driven decision making",
        "Pattern recognition",
        "Predictive modeling",
        "Automated learning"
      ],
      applications: ["Recommendation systems", "Spam detection", "Medical diagnosis", "Financial forecasting"]
    },
    "deep learning": {
      definition: "Deep Learning is a subset of machine learning that uses neural networks with multiple layers to learn complex patterns.",
      key_points: [
        "Multi-layer neural networks",
        "Hierarchical feature learning",
        "Automatic feature extraction",
        "Large-scale data processing"
      ],
      applications: ["Image recognition", "Natural language processing", "Speech recognition", "Autonomous vehicles"]
    },
    "neural networks": {
      definition: "Neural Networks are computing systems inspired by biological neural networks that constitute animal brains.",
      key_points: [
        "Connected nodes (neurons)",
        "Weighted connections",
        "Activation functions",
        "Backpropagation learning"
      ],
      applications: ["Pattern recognition", "Function approximation", "Classification", "Regression"]
    }
  },
  
  algorithms: {
    "linear regression": {
      description: "Linear regression is a statistical method used to model the relationship between a dependent variable and one or more independent variables.",
      equation: "y = β₀ + β₁x₁ + β₂x₂ + ... + ε",
      use_cases: ["House price prediction", "Sales forecasting", "Trend analysis"],
      code_example: `from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)`,
      evaluation: ["Mean Squared Error", "R² Score", "Mean Absolute Error"]
    },
    "logistic regression": {
      description: "Logistic regression is a statistical method for binary classification that predicts the probability of an outcome.",
      equation: "σ(z) = 1 / (1 + e^(-z))",
      use_cases: ["Spam detection", "Medical diagnosis", "Credit scoring"],
      code_example: `from sklearn.linear_model import LogisticRegression
model = LogisticRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)`,
      evaluation: ["Accuracy", "Precision", "Recall", "F1-Score", "ROC AUC"]
    },
    "decision trees": {
      description: "Decision trees are non-parametric supervised learning methods used for classification and regression.",
      concept: "Tree-like model of decisions and their possible consequences",
      use_cases: ["Customer segmentation", "Risk assessment", "Medical diagnosis"],
      code_example: `from sklearn.tree import DecisionTreeClassifier
model = DecisionTreeClassifier(max_depth=3)
model.fit(X_train, y_train)
predictions = model.predict(X_test)`,
      evaluation: ["Accuracy", "Gini Impurity", "Entropy", "Tree Depth"]
    }
  },

  code_templates: {
    python_basic: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Load data
df = pd.read_csv('your_data.csv')

# Preprocessing
X = df.drop('target', axis=1)
y = df['target']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)`,
    
    model_evaluation: `from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Make predictions
y_pred = model.predict(X_test)

# Calculate metrics
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")

# Classification report
print("\\nClassification Report:")
print(classification_report(y_test, y_pred))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix')
plt.show()`
  },

  troubleshooting: {
    common_errors: {
      "overfitting": {
        problem: "Model performs well on training data but poorly on test data",
        solutions: [
          "Use cross-validation",
          "Add regularization (L1/L2)",
          "Reduce model complexity",
          "Increase training data",
          "Use dropout for neural networks"
        ]
      },
      "underfitting": {
        problem: "Model performs poorly on both training and test data",
        solutions: [
          "Increase model complexity",
          "Add more features",
          "Reduce regularization",
          "Train for more epochs",
          "Use ensemble methods"
        ]
      },
      "data_leakage": {
        problem: "Information from test data accidentally influences training",
        solutions: [
          "Split data before preprocessing",
          "Use pipeline for preprocessing",
          "Ensure temporal split for time series",
          "Validate data splits"
        ]
      }
    }
  }
};

/**
 * Enhanced AIML chat with specialized knowledge
 */
export const enhancedAIMLChat = async ({ userId, message, history = [] }) => {
  const trimmed = (message || "").trim().toLowerCase();
  
  if (!trimmed) {
    return {
      reply: "Hello! I'm your AIML Learning Assistant. How can I help you today?",
      difficulty: "medium",
      sources: ["AIML Knowledge Base"],
      type: "greeting"
    };
  }

  // Check for specific AIML concepts
  const conceptResponse = checkConcept(trimmed);
  if (conceptResponse) {
    return conceptResponse;
  }

  // Check for algorithm explanations
  const algorithmResponse = checkAlgorithm(trimmed);
  if (algorithmResponse) {
    return algorithmResponse;
  }

  // Check for code help
  const codeResponse = checkCodeHelp(trimmed);
  if (codeResponse) {
    return codeResponse;
  }

  // Check for troubleshooting
  const troubleshootingResponse = checkTroubleshooting(trimmed);
  if (troubleshootingResponse) {
    return troubleshootingResponse;
  }

  // Check for mathematical explanations
  const mathResponse = checkMathHelp(trimmed);
  if (mathResponse) {
    return mathResponse;
  }

  // Default to enhanced AI response
  return await generateAIResponse(trimmed, history);
};

const checkConcept = (message) => {
  const concepts = AIML_KNOWLEDGE_BASE.concepts;
  
  for (const [concept, data] of Object.entries(concepts)) {
    if (message.includes(concept)) {
      return {
        reply: `## ${concept.charAt(0).toUpperCase() + concept.slice(1)}

**Definition:** ${data.definition}

**Key Points:**
${data.key_points.map(point => `• ${point}`).join('\n')}

**Real-world Applications:**
${data.applications.map(app => `• ${app}`).join('\n')}

Would you like me to explain any of these concepts in more detail or show you how to implement them?`,
        difficulty: "beginner",
        sources: ["AIML Knowledge Base"],
        type: "concept"
      };
    }
  }
  
  return null;
};

const checkAlgorithm = (message) => {
  const algorithms = AIML_KNOWLEDGE_BASE.algorithms;
  
  for (const [algorithm, data] of Object.entries(algorithms)) {
    if (message.includes(algorithm)) {
      return {
        reply: `## ${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)}

**Description:** ${data.description}

**Mathematical Foundation:**
\`${data.equation}\`

**Common Use Cases:**
${data.use_cases.map(use_case => `• ${use_case}`).join('\n')}

**Python Implementation:**
\`\`\`python
${data.code_example}
\`\`\`

**Evaluation Metrics:**
${data.evaluation.map(metric => `• ${metric}`).join('\n')}

Would you like to see a complete example or learn about hyperparameter tuning?`,
        difficulty: "intermediate",
        sources: ["AIML Algorithm Database"],
        type: "algorithm"
      };
    }
  }
  
  return null;
};

const checkCodeHelp = (message) => {
  if (message.includes("code") || message.includes("implement") || message.includes("example")) {
    const templates = AIML_KNOWLEDGE_BASE.code_templates;
    
    if (message.includes("basic") || message.includes("setup")) {
      return {
        reply: `## Python ML Setup Template

Here's a basic template for getting started with machine learning in Python:

\`\`\`python
${templates.python_basic}
\`\`\`

**Next Steps:**
1. Choose your algorithm (e.g., LinearRegression, RandomForestClassifier)
2. Train your model
3. Evaluate performance
4. Tune hyperparameters

Would you like me to show you a complete example with a specific algorithm?`,
        difficulty: "beginner",
        sources: ["Code Templates"],
        type: "code"
      };
    }
    
    if (message.includes("evaluate") || message.includes("metrics")) {
      return {
        reply: `## Model Evaluation Template

Here's how to evaluate your machine learning models:

\`\`\`python
${templates.model_evaluation}
\`\`\`

**Key Metrics Explained:**
- **Accuracy**: Overall correctness of predictions
- **Precision**: True positive rate (minimize false positives)
- **Recall**: Sensitivity (minimize false negatives)
- **F1-Score**: Harmonic mean of precision and recall
- **ROC AUC**: Model's ability to distinguish between classes

Need help interpreting these metrics for your specific use case?`,
        difficulty: "intermediate",
        sources: ["Evaluation Guidelines"],
        type: "code"
      };
    }
  }
  
  return null;
};

const checkTroubleshooting = (message) => {
  const troubleshooting = AIML_KNOWLEDGE_BASE.troubleshooting.common_errors;
  
  if (message.includes("overfitting")) {
    const solutions = troubleshooting.overfitting.solutions;
    return {
      reply: `## Overfitting Solutions

**Problem:** Model performs well on training data but poorly on test data

**Solutions:**
${solutions.map((solution, index) => `${index + 1}. ${solution}`).join('\n')}

**Quick Fix:**
\`\`\`python
# Add regularization
from sklearn.linear_model import Ridge
model = Ridge(alpha=1.0)  # Adjust alpha as needed
model.fit(X_train, y_train)
\`\`\`

**Prevention Tips:**
- Always use cross-validation
- Monitor training vs validation loss
- Start with simpler models
- Collect more diverse data

Want to dive deeper into any of these solutions?`,
      difficulty: "intermediate",
      sources: ["ML Troubleshooting Guide"],
      type: "troubleshooting"
    };
  }
  
  if (message.includes("underfitting")) {
    const solutions = troubleshooting.underfitting.solutions;
    return {
      reply: `## Underfitting Solutions

**Problem:** Model performs poorly on both training and test data

**Solutions:**
${solutions.map((solution, index) => `${index + 1}. ${solution}`).join('\n')}

**Quick Fix:**
\`\`\`python
# Increase model complexity
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(n_estimators=100, max_depth=10)
model.fit(X_train, y_train)
\`\`\`

**Diagnosis Tips:**
- Check training accuracy (should be high)
- Review feature engineering
- Consider more complex algorithms
- Ensure data quality

Need specific help with your model?`,
      difficulty: "intermediate",
      sources: ["ML Troubleshooting Guide"],
      type: "troubleshooting"
    };
  }
  
  return null;
};

const checkMathHelp = (message) => {
  if (message.includes("math") || message.includes("equation") || message.includes("formula")) {
    return {
      reply: `## Mathematical Foundations in AIML

**Key Mathematical Concepts:**

**1. Linear Algebra**
- Vectors and matrices for data representation
- Matrix operations for transformations
- Eigenvalues and eigenvectors for PCA

**2. Calculus**
- Gradients for optimization (Gradient Descent)
- Partial derivatives for multi-variable functions
- Chain rule for backpropagation

**3. Probability & Statistics**
- Probability distributions (Normal, Bernoulli, etc.)
- Bayes' theorem for Naive Bayes
- Statistical measures (mean, variance, standard deviation)

**4. Optimization**
- Loss functions (MSE, Cross-Entropy)
- Gradient-based optimization
- Regularization (L1, L2)

**Common Equations:**
- **Linear Regression:** y = β₀ + β₁x
- **Logistic Regression:** σ(z) = 1/(1 + e^(-z))
- **Gradient Descent:** θ = θ - α∇J(θ)

**Resources:**
- Khan Academy (Linear Algebra, Calculus)
- 3Blue1Brown (YouTube - Visual explanations)
- Mathematics for Machine Learning (Coursera)

Which mathematical concept would you like me to explain in detail?`,
      difficulty: "intermediate",
      sources: ["Mathematical Foundations"],
      type: "mathematics"
    };
  }
  
  return null;
};

const generateAIResponse = async (message, history) => {
  // If Groq API is available, use it with enhanced prompt
  if (process.env.GROQ_API_KEY) {
    try {
      const conversationText = Array.isArray(history)
        ? history.join("\n")
        : String(history || "");

      const enhancedPrompt = `You are an expert AIML tutor with deep knowledge of machine learning, deep learning, and data science. 

Your expertise includes:
- Machine Learning algorithms and theory
- Deep Learning architectures and training
- Python programming for ML
- Mathematical foundations
- Data preprocessing and feature engineering
- Model evaluation and optimization
- Real-world applications and case studies

AIML Knowledge Base:
${JSON.stringify(AIML_KNOWLEDGE_BASE, null, 2)}

CONVERSATION HISTORY:
${conversationText}

STUDENT QUESTION:
${message}

Provide a comprehensive, educational response that:
1. Directly answers the question
2. Includes relevant code examples when appropriate
3. Explains concepts clearly with mathematical foundations
4. Suggests practical applications
5. Offers follow-up learning suggestions

Format your response with clear headings, code blocks, and examples.`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are an expert AIML tutor specializing in artificial intelligence and machine learning. Provide detailed, educational responses with code examples and mathematical explanations.",
            },
            {
              role: "user",
              content: enhancedPrompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim() || "";

      return {
        reply: reply || "I'm here to help with your AIML learning journey. Could you rephrase your question?",
        difficulty: "medium",
        sources: ["AI Enhanced Response"],
        type: "ai_generated"
      };

    } catch (error) {
      console.error("Enhanced AI response error:", error);
    }
  }

  // Fallback to knowledge base lookup
  return {
    reply: `I'm your AIML Learning Assistant! I can help you with:

🧠 **Core Concepts:**
- Machine Learning fundamentals
- Deep Learning architectures
- Neural Networks
- Data Science principles

💻 **Practical Help:**
- Python code examples
- Algorithm implementation
- Debugging assistance
- Best practices

📊 **Mathematical Foundation:**
- Linear Algebra for ML
- Calculus for optimization
- Probability and Statistics
- Loss functions and gradients

🔧 **Troubleshooting:**
- Overfitting/underfitting issues
- Performance optimization
- Data preprocessing
- Model evaluation

Try asking me about specific concepts like "linear regression", "neural networks", or "how to fix overfitting"!`,
    difficulty: "medium",
    sources: ["AIML Knowledge Base"],
    type: "fallback"
  };
};

export default enhancedAIMLChat;

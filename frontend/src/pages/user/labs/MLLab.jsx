// frontend/src/pages/user/labs/MLLab.jsx
import { useState, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { 
  Brain, 
  ArrowLeft, 
  CheckCircle, 
  Database, 
  Network, 
  GitBranch, 
  Activity,
  Layers,
  Zap,
  Filter,
  TrendingUp,
  Target,
  Play,
  Plus,
  Trash2,
  Code,
  Type,
  Terminal,
  Loader,
  ExternalLink
} from "lucide-react";

/**
 * MLLab Component
 * Displays 10 ML topics as cards.
 * Users click a card to enter a mini-lesson for that topic.
 */
const MLLab = ({ lab, attempt, onComplete, onCancel }) => {
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [completedTopics, setCompletedTopics] = useState([]);
  
  // Define the 10 Topics
  const topics = [
    {
      id: "fs-forward",
      title: "Feature Selection (Forward)",
      category: "Dimensionality Reduction",
      icon: <Filter className="text-blue-500" />,
      description: "Iteratively add features to improve model performance.",
      content: {
        intro: "1. Using feature forward selection approaches, reduce the dimensionality of the KDD Cup99 dataset.\n\nThis experiment involves applying the forward feature selection technique, which incrementally selects features that improve model performance. The focus is on reducing irrelevant or redundant features in the KDD Cup99 dataset. Python libraries like sklearn and mlxtend can be used for implementation. The outcome is a simplified feature set that retains significant predictive power. (CO1)",
         dataset: {
            name: "StudentsPerformance.csv",
            description: "Students Performance in Exams (Kaggle). This file is available in your environment.",
            preview: [
                ["gender","race/ethnicity","parental level of education","lunch","test preparation course","math score","reading score","writing score"],
                ["female","group B","bachelor's degree","standard","none","72","72","74"],
                ["female","group C","some college","standard","completed","69","90","88"],
                ["female","group B","master's degree","standard","none","90","95","93"]
            ]
        },
        expectedOutput: {
            description: "Predict student performance using Forward Feature Selection",
            example: "Selected Features: ['math score', 'reading score']\nR2 Score: 0.72",
            criteria: [
                "✔ Forward Selection Used: 2 Marks",
                "✔ Correct Target Variable: 2 Marks",
                "✔ Important Features Selected: 3 Marks",
                "✔ Model Trained: 1 Mark",
                "✔ R² ≥ 0.60: 2 Marks"
            ]
        }
      }
    },
    {
      id: "fs-backward",
      title: "Feature Selection (Backward)",
      category: "Dimensionality Reduction",
      icon: <Filter className="text-red-500" />,
      description: "Start with all features and remove the least significant ones.",
      content: {
        intro: "2. Using feature backward elimination approaches, reduce the dimensionality of the KDD Cup99 dataset.\n\nThis experiment uses backward feature elimination to iteratively remove features that have minimal impact on model performance. The KDD Cup99 dataset is used as input, and important features are retained while others are eliminated. This approach emphasizes simplifying the dataset while maintaining its effectiveness. Tools like statsmodels or sklearn can assist in automation. (CO1)"
      }
    },
    {
      id: "linear-reg",
      title: "Linear Regression",
      category: "Supervised Learning",
      icon: <TrendingUp className="text-green-500" />,
      description: "Predict a continuous value based on input variables.",
      content: {
        intro: "3. Write a program to implement a linear regression for the house prediction dataset.\n\nThis experiment requires building a linear regression model to predict house prices using features like square footage, location, and number of rooms. The implementation should include preprocessing, training, and evaluation of the model. Datasets like the Boston Housing dataset or a custom housing dataset can be used. The results include model coefficients and predictive accuracy. (CO2)"
      }
    },
    {
      id: "logistic-reg",
      title: "Logistic Regression",
      category: "Supervised Learning",
      icon: <Target className="text-purple-500" />,
      description: "Classify data into two categories (Binary Classification).",
      content: {
        intro: "4. Write a Python program to implement logistic regression for classification.\n\n" +
               "i. IRIS dataset: This involves classifying flowers into species using features like petal length and sepal width. Evaluate accuracy using metrics such as confusion matrix and F1-score.\n\n" +
               "ii. 50_Startups dataset: Predict the likelihood of success for startups based on features like investment and location. Compare the accuracy with and without feature scaling or encoding. (CO2)"
      }
    },
    {
      id: "dt-id3",
      title: "Decision Tree (ID3)",
      category: "Supervised Learning",
      icon: <GitBranch className="text-yellow-500" />,
      description: "Split data into branches based on information gain.",
      content: {
        intro: "5. Write a Python program to demonstrate the decision tree-based ID3 algorithm.\n\nImplement the ID3 algorithm to construct a decision tree for classification using an appropriate dataset. For example, the Weather dataset can be used to predict play/no-play outcomes based on weather conditions. The program should display the tree structure and classify new samples based on user input. (CO3)"
      }
    },
    {
      id: "knn",
      title: "K-Nearest Neighbors",
      category: "Instance-Based Learning",
      icon: <Network className="text-indigo-500" />,
      description: "Classify a sample based on its nearest neighbors.",
      content: {
        intro: "6. Write a Python program to implement the K-Nearest Neighbors (KNN) algorithm.\n\n" +
               "i. IRIS dataset: Perform classification to determine species using features like petal width and length.\n\n" +
               "ii. Car Evaluation dataset: Predict the acceptability of car configurations using features like price and safety. Evaluate the model with different values of k to optimize accuracy. (CO3)"
      }
    },
    {
      id: "hierarchical",
      title: "Hierarchical Clustering",
      category: "Unsupervised Learning",
      icon: <Layers className="text-orange-500" />,
      description: "Build a hierarchy of clusters (Dendrogram).",
      content: {
        intro: "7. Write a Python program to implement hierarchical clustering with the Wholesale Customers dataset.\n\nThis experiment involves grouping customers based on purchasing behaviour using agglomerative hierarchical clustering. Visualize the dendrogram to determine the optimal number of clusters. The Wholesale Customers dataset, available on the UCI repository, serves as input. Evaluate the quality of clusters using silhouette scores. (CO4)"
      }
    },
    {
      id: "kmeans",
      title: "K-Means Clustering",
      category: "Unsupervised Learning",
      icon: <Database className="text-teal-500" />,
      description: "Partition data into K distinct, non-overlapping clusters.",
      content: {
        intro: "8. Write a Python program to implement the K-Means clustering algorithm.\n\nCluster customers based on wholesale purchase categories using the K-Means algorithm. Pre-process the Wholesale Customers dataset to normalize features. Determine the optimal number of clusters using the Elbow method. Visualize results to understand customer segmentation. (CO4)"
      }
    },
    {
      id: "gb",
      title: "Gradient Boosting",
      category: "Ensemble Learning",
      icon: <Activity className="text-pink-500" />,
      description: "Build sequential weak learners that correct previous errors.",
      content: {
        intro: "9. Write a Python program to implement Gradient Boosting\n\n" +
               "i. IRIS dataset: Perform multi-class classification using Gradient Boosting. Evaluate metrics such as precision and recall for each class.\n\n" +
               "ii. 50_Startups dataset: Predict outcomes by training a Gradient Boosting classifier and tuning hyperparameters to enhance performance. (CO5)"
      }
    },
    {
      id: "xgboost",
      title: "XGBoost",
      category: "Ensemble Learning",
      icon: <Zap className="text-yellow-600" />,
      description: "Extreme Gradient Boosting - optimized for speed and performance.",
      content: {
        intro: "10. Write a Python program to implement XGBoost\n\n" +
               "i. IRIS dataset: Apply XGBoost to classify flower species and evaluate performance using confusion matrices.\n\n" +
               "ii. 50_Startups dataset: Train an XGBoost model to predict success and optimize hyper parameters like learning rate and maximum depth for better accuracy. (CO5)"
      }
    }
  ];

  const handleTopicComplete = (topicId) => {
    if (!completedTopics.includes(topicId)) {
      setCompletedTopics([...completedTopics, topicId]);
    }
    // Return to menu
    setSelectedTopicId(null);
  };

  const handleFinishLab = () => {
    // Calculate final score
    const score = Math.round((completedTopics.length / topics.length) * 100);
    onComplete({ score: score, passed: score >= 50 });
  };

  // Render Single Topic View
  if (selectedTopicId) {
    const topic = topics.find(t => t.id === selectedTopicId);
    return (
      <TopicDetail 
        topic={topic} 
        onBack={() => setSelectedTopicId(null)}
        onComplete={() => handleTopicComplete(topic.id)}
      />
    );
  }

  // Render Dashboard Grid
  return (
    <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "12px", minHeight: "80vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", alignItems: "center" }}>
        <div>
           <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 8px 0", color: "#1e293b" }}>
            <Brain size={32} className="text-blue-600" /> 
            Machine Learning Lab
          </h2>
          <p style={{ margin: 0, color: "#64748b" }}>
            Master these {topics.length} core ML concepts to advance your security AI skills.
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
           <div style={{ padding: "8px 16px", backgroundColor: "#e2e8f0", borderRadius: "20px", fontWeight: "bold", color: "#475569" }}>
             Progress: {completedTopics.length} / {topics.length}
           </div>
           <button 
             onClick={onCancel}
             style={{ padding: "8px 16px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "white", cursor: "pointer" }}
           >
             Exit
           </button>
           <button 
             onClick={handleFinishLab}
             className="bg-blue-600 text-white hover:bg-blue-700"
             style={{ padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", backgroundColor: "#2563eb", color: "white" }}
           >
             Finish Lab
           </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: "20px" 
      }}>
        {topics.map((topic) => {
          const isCompleted = completedTopics.includes(topic.id);
          return (
            <div 
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                border: isCompleted ? "2px solid #10b981" : "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
            >
              {isCompleted && (
                <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                  <CheckCircle size={20} className="text-green-500" />
                </div>
              )}
              
              <div style={{ marginBottom: "16px" }}>
                {topic.icon}
              </div>
              
              <div style={{ 
                fontSize: "12px", 
                textTransform: "uppercase", 
                letterSpacing: "0.05em", 
                color: "#64748b",
                fontWeight: "600",
                marginBottom: "8px"
              }}>
                {topic.category}
              </div>
              
              <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 8px 0", color: "#0f172a" }}>
                {topic.title}
              </h3>
              
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.5" }}>
                {topic.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Evaluation Components ---

const EvaluationResultPanel = ({ isOpen, onClose, topic, evaluationResult }) => {
    if (!isOpen) return null;

    // Use passed data or defaults
    const result = evaluationResult || {};
    const passed = result.marks && result.marks >= 7;
    const score = result.marks || 0;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "400px",
            height: "100%",
            backgroundColor: "white",
            boxShadow: "-4px 0 15px rgba(0,0,0,0.1)",
            zIndex: 1100,
            padding: "30px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h2 style={{ margin: 0, fontSize: "24px", color: "#1e293b" }}>Evaluation Results</h2>
                <button 
                    onClick={onClose}
                    style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#94a3b8" }}
                >
                    &times;
                </button>
            </div>

            {/* Score Card */}
            <div style={{ 
                backgroundColor: passed ? "#ecfdf5" : "#fef2f2", 
                border: `1px solid ${passed ? "#10b981" : "#ef4444"}`, 
                borderRadius: "12px", 
                padding: "20px",
                textAlign: "center",
                marginBottom: "30px"
            }}>
                <div style={{ fontSize: "14px", color: passed ? "#047857" : "#b91c1c", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px" }}>
                    Total Score
                </div>
                <div style={{ fontSize: "48px", fontWeight: "bold", color: passed ? "#059669" : "#dc2626" }}>
                    {score}/10
                </div>
                <div style={{ marginTop: "8px", fontWeight: "600", color: passed ? "#047857" : "#b91c1c" }}>
                    {passed ? "PASSED" : "FAILED"}
                </div>
            </div>

             {/* Metrics Panel */}
             <div style={{ marginBottom: "30px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#475569" }}>Detailed Metrics</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
                         <span style={{ color: "#64748b" }}>Accuracy</span>
                         <span style={{ fontWeight: "600", color: "#1e293b" }}>{result.accuracy ? (Number(result.accuracy).toFixed(2)) : "N/A"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
                         <span style={{ color: "#64748b" }}>Model Used</span>
                         <span style={{ fontWeight: "600", color: "#1e293b" }}>{result.model || "Unknown"}</span>
                    </div>
                     <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
                         <span style={{ color: "#64748b" }}>Output Format</span>
                         <span style={{ fontWeight: "600", color: result.formatCorrect ? "#10b981" : "#ef4444" }}>{result.formatCorrect ? "Correct ✅" : "Incorrect ❌"}</span>
                    </div>
                     <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
                         <span style={{ color: "#64748b" }}>Metrics Present</span>
                         <span style={{ fontWeight: "600", color: result.metricsPresent ? "#10b981" : "#ef4444" }}>{result.metricsPresent ? "Yes ✅" : "No ❌"}</span>
                    </div>
                </div>
            </div>

            {/* Mistakes/Analysis */}
            <div>
                 <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#475569" }}>Feedback & Analysis</h3>
                 <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.5" }}>
                     {result.feedback || (score >= 10 ? "Excellent work! Your model implementation is correct." : "Review the metrics above to improve your score so you can submit the assignment.")}
                 </p>
            </div>
            
        </div>
    );
};

// --- Notebook Components ---

const MonacoCodeEditor = ({ value, onChange, onRun }) => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      // Register completions for Python
      const disposable = monaco.languages.registerCompletionItemProvider("python", {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const suggestions = [
            // Python Keywords
            { label: "def", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "def ", range },
            { label: "class", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "class ", range },
            { label: "import", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "import ", range },
            { label: "from", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "from ", range },
            { label: "if", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "if ", range },
            { label: "else", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "else:\n\t", range },
            { label: "elif", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "elif ", range },
            { label: "try", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "try:\n\t", range },
            { label: "except", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "except ", range },
            
            // Libraries
            { label: "pandas", kind: monaco.languages.CompletionItemKind.Module, insertText: "pandas", range },
            { label: "numpy", kind: monaco.languages.CompletionItemKind.Module, insertText: "numpy", range },
            { label: "sklearn", kind: monaco.languages.CompletionItemKind.Module, insertText: "sklearn", range },
            { label: "matplotlib", kind: monaco.languages.CompletionItemKind.Module, insertText: "matplotlib", range },

             // Code Snippets
            {
               label: "for",
               kind: monaco.languages.CompletionItemKind.Snippet,
               insertText: "for ${1:item} in ${2:iterable}:\n\t${3:pass}",
               insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
               range,
               detail: "Python for loop"
            },
            {
               label: "df",
               kind: monaco.languages.CompletionItemKind.Snippet,
               insertText: "df = pd.read_csv(\"${1:file.csv}\")",
               insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
               range,
               detail: "Load CSV into DataFrame"
            },
             {
               label: "train",
               kind: monaco.languages.CompletionItemKind.Snippet,
               insertText: "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nmodel = ${1:Model}()\nmodel.fit(X_train, y_train)\nscore = model.score(X_test, y_test)\nprint(f\"Accuracy: {score}\")",
               insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
               range,
               detail: "Model training block"
            },
            // ML Library specific common methods
             { label: "read_csv", kind: monaco.languages.CompletionItemKind.Function, insertText: "read_csv", range },
             { label: "head", kind: monaco.languages.CompletionItemKind.Function, insertText: "head()", range },
             { label: "fit", kind: monaco.languages.CompletionItemKind.Function, insertText: "fit(${1:X}, ${2:y})", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
             { label: "predict", kind: monaco.languages.CompletionItemKind.Function, insertText: "predict(${1:X})", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
             { label: "train_test_split", kind: monaco.languages.CompletionItemKind.Function, insertText: "train_test_split", range },
             { label: "plot", kind: monaco.languages.CompletionItemKind.Function, insertText: "plot", range },
             { label: "show", kind: monaco.languages.CompletionItemKind.Function, insertText: "show()", range },
          ];
          return { suggestions };
        }
      });
      
      return () => disposable.dispose();
    }
  }, [monaco]);

  const handleEditorDidMount = (editor, monaco) => {
    // Keybinding for Run (Shift+Enter)
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
        if (onRun) onRun();
    });

    const updateHeight = () => {
        const contentHeight = Math.min(Math.max(editor.getContentHeight(), 100), 600);
        editor.getContainerDomNode().style.height = `${contentHeight}px`;
        editor.layout();
    };
    
    editor.onDidContentSizeChange(updateHeight);
  }

  return (
    <div style={{ border: "1px solid #d1d5db", borderRadius: "4px", overflow: "hidden" }}>
      <Editor
        height="100px" 
        width="100%"
        defaultLanguage="python"
        theme="light"
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            autoSurround: "languageDefined",
            matchBrackets: "always",
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            parameterHints: { enabled: true },
            autoIndent: "advanced",
            formatOnType: true,
            formatOnPaste: true,
            multiCursorModifier: "ctrlCmd",
            minimap: { enabled: false },
            lineNumbers: "on",
            folding: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            scrollbar: {
                alwaysConsumeMouseWheel: false 
            },
            fontSize: 14,
            fontFamily: "'Fira Code', monospace"
        }}
      />
    </div>
  );
};

const NotebookCell = ({ cell, index, onUpdate, onDelete, onRun, onAddCell, isAppRunning }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{ position: "relative", marginBottom: "16px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Add New Cell Menu (Top) */}
      <div 
        style={{ 
          position: "absolute", 
          top: "-22px", 
          left: "0", 
          width: "100%", 
          height: "24px", 
          zIndex: 15,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0,
          transition: "opacity 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
      >
        <div style={{ display: "flex", gap: "10px", backgroundColor: "white", padding: "2px 10px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
            <button 
                onClick={() => onAddCell(index, "code")}
                style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", border: "none", background: "none", cursor: "pointer", color: "#2563eb", fontWeight: "600" }}
            >
                <Code size={12} /> Code
            </button>
            <div style={{ width: "1px", height: "16px", backgroundColor: "#e2e8f0" }}></div>
            <button 
                onClick={() => onAddCell(index, "text")}
                style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", border: "none", background: "none", cursor: "pointer", color: "#475569", fontWeight: "600" }}
            >
                <Type size={12} /> Text
            </button>
        </div>
      </div>

      {/* Cell Container */}
      <div style={{ 
        display: "flex", 
        border: "1px solid #e2e8f0", 
        borderRadius: "8px", 
        overflow: "hidden",
        backgroundColor: cell.type === "code" ? "#f8fafc" : "white",
        boxShadow: isHovered ? "0 4px 6px -1px rgba(0, 0, 0, 0.05)" : "none"
      }}>
        
        {/* Play/Gutter for Code */}
        {cell.type === "code" && (
          <div style={{ 
            width: "40px", 
            backgroundColor: "#f1f5f9", 
            borderRight: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "10px"
          }}>
            <button 
              onClick={() => onRun(cell.id)}
              disabled={isAppRunning || cell.isLoading}
              style={{ 
                background: "none", 
                border: "none", 
                cursor: (isAppRunning || cell.isLoading) ? "not-allowed" : "pointer", 
                padding: "6px",
                borderRadius: "50%",
                color: "#2563eb",
                display: "flex", 
                opacity: (isAppRunning && !cell.isLoading) ? 0.5 : 1
              }}
              title="Run cell"
            >
              {cell.isLoading ? <Loader size={16} className="animate-spin" /> : <Play size={16} fill="#2563eb" />}
            </button>
            <span style={{ fontSize: "10px", marginTop: "4px", color: "#94a3b8" }}>[{index + 1}]</span>
            
            {/* Execution Status Indicator */}
            {cell.executed && !cell.isLoading && (
               <div style={{ marginTop: "6px" }} title={cell.success ? "Executed Successfully" : "Execution Failed"}>
                  {cell.success ? (
                    <CheckCircle size={14} className="text-green-500" />
                  ) : (
                    <span style={{ color: "#ef4444", fontSize: "14px", fontWeight: "bold" }}>!</span>
                  )}
               </div>
            )}
          </div>
        )}

        {/* Content Area */}
        <div style={{ flex: 1, padding: "10px" }}>
            <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {cell.type === "code" ? (
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Python Code</span>
                ) : (
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Text / Markdown</span>
                )}
                <button 
                  onClick={() => onDelete(cell.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", opacity: isHovered ? 1 : 0 }}
                  title="Delete cell"
                >
                  <Trash2 size={14} />
                </button>
            </div>
          {cell.type === "code" ? (
              <MonacoCodeEditor 
                  value={cell.content} 
                  onChange={(val) => onUpdate(cell.id, val)}
                  onRun={() => onRun(cell.id)}
              />
          ) : (
            <textarea
              value={cell.content}
              onChange={(e) => onUpdate(cell.id, e.target.value)}
              style={{
                width: "100%",
                minHeight: "60px",
                border: "none",
                background: "transparent",
                resize: "vertical",
                fontFamily: "inherit",
                fontSize: "14px",
                outline: "none",
                color: "#334155"
              }}
              placeholder="Add your text here..."
            />
          )}
        </div>
      </div>

      {/* Output Area (Code only) */}
      {cell.type === "code" && (
        <div style={{ marginLeft: "40px" }}>
            {/* Standard Output */}
            {cell.output && (
                <div style={{ 
                  marginTop: "4px", 
                  padding: "10px", 
                  backgroundColor: "white", 
                  borderLeft: "4px solid #e2e8f0",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  color: "#475569",
                  whiteSpace: "pre-wrap"
                }}>
                  {cell.output}
                </div>
            )}
            
            {/* Image Output (Plots) */}
            {cell.images && cell.images.length > 0 && (
                <div style={{ 
                  marginTop: "10px",
                  padding: "10px", 
                  backgroundColor: "#ffffff", 
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  alignItems: "center"
                }}>
                  {cell.images.map((imgBase64, imgIdx) => (
                       <img 
                          key={imgIdx} 
                          src={`data:image/png;base64,${imgBase64}`} 
                          alt={`Plot ${imgIdx + 1}`}
                          style={{ maxWidth: "100%", maxHeight: "500px", borderRadius: "4px" }} 
                       />
                  ))}
                </div>
            )}

            {/* Error Output */}
            {cell.error && (
                <div style={{ 
                  marginTop: "4px", 
                  padding: "10px", 
                  backgroundColor: "#fef2f2", 
                  borderLeft: "4px solid #ef4444",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  color: "#b91c1c",
                  whiteSpace: "pre-wrap"
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Error:</div>
                  {cell.error}
                </div>
            )}
        </div>
      )}

      {/* Add New Cell Menu (Bottom) */}
      <div 
        style={{ 
          position: "absolute", 
          bottom: "-22px", 
          left: "0", 
          width: "100%", 
          height: "24px", 
          zIndex: 15,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0,
          transition: "opacity 0.2s"
        }}
        className="add-cell-hover-area"
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
      >
        <div style={{ display: "flex", gap: "10px", backgroundColor: "white", padding: "2px 10px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
            <button 
                onClick={() => onAddCell(index + 1, "code")}
                style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", border: "none", background: "none", cursor: "pointer", color: "#2563eb", fontWeight: "600" }}
            >
                <Code size={12} /> Code
            </button>
            <div style={{ width: "1px", height: "16px", backgroundColor: "#e2e8f0" }}></div>
            <button 
                onClick={() => onAddCell(index + 1, "text")}
                style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", border: "none", background: "none", cursor: "pointer", color: "#475569", fontWeight: "600" }}
            >
                <Type size={12} /> Text
            </button>
        </div>
      </div>
    </div>
  );
};

const Notebook = ({ onCellsChange, onRequestRun }) => {
  // Start with a single empty code cell
  const [cells, setCells] = useState([
    { id: 1, type: "code", content: "# Write your code here\n", output: "", error: "" }
  ]);
  const [activeRunId, setActiveRunId] = useState(null);
  const [sessionId] = useState(() => "session-" + Math.random().toString(36).substr(2, 9));

  // Propagate changes up to parent for evaluation
  useEffect(() => {
    if (onCellsChange) {
        onCellsChange(cells);
    }
  }, [cells, onCellsChange]);

  const handleUpdateCell = (id, content) => {
    setCells(cells.map(c => c.id === id ? { ...c, content } : c));
  };

  const handleDeleteCell = async (id) => {
    const remainingCells = cells.filter(c => c.id !== id);
    setCells(remainingCells);
    
    // When a cell is deleted, we must clear the session memory to remove
    // any variables defined in that cell, then re-run dependencies if needed.
    try {
        await fetch('http://localhost:5001/clear-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId })
        });
        
        // Optional: If you want to automatically restore the state of OTHER cells,
        // you would iterate and re-run them here. For now, Clearing is safer.
        // Users can hit "Run" again if they need variables.
        
        // Reset execution status of remaining cells to indicate they need re-run
        // or keep them as is but user knows state is cleared.
        // Let's mark them as 'not executed' so user knows to run them again.
        setCells(prev => prev.map(c => ({ ...c, executed: false, success: false, output: "", error: "" })));
        
    } catch (e) {
        console.error("Failed to clear session", e);
    }
  };

  const handleRunCell = async (id) => {
      setActiveRunId(id);
      
      // Update cell to loading state
      setCells(prev => prev.map(c => c.id === id ? { ...c, isLoading: true, output: "", error: "" } : c));

      // Find the specific cell content to run
      const cellToRun = cells.find(c => c.id === id);

      try {
          if (!cellToRun) throw new Error("Cell not found");

          const response = await fetch('http://localhost:5001/run-cell', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  code: cellToRun.content,
                  session_id: sessionId 
              })
          });

          if (!response.ok) {
              throw new Error("Server not running or returned error");
          }

          const data = await response.json();
          
          setCells(prev => prev.map(c => c.id === id ? { 
              ...c, 
              isLoading: false, 
              output: data.output || "",
              images: data.images || [], 
              error: data.error || "",
              success: data.success,
              executed: true
          } : c));

      } catch (err) {
          setCells(prev => prev.map(c => c.id === id ? { 
              ...c, 
              isLoading: false, 
              error: err.message || "Failed to execute code",
              success: false,
              executed: true
          } : c));
      } finally {
          setActiveRunId(null);
      }
  };

  const handleAddCell = (index, type) => {
    const newCell = {
        id: Date.now(),
        type,
        content: "",
        output: ""
    };
    const newCells = [...cells];
    newCells.splice(index, 0, newCell);
    setCells(newCells);
  };

  return (
    <div style={{ marginTop: "20px" }}>
        {cells.map((cell, index) => (
            <NotebookCell 
                key={cell.id} 
                cell={cell} 
                index={index}
                onUpdate={handleUpdateCell}
                onDelete={handleDeleteCell}
                onRun={handleRunCell}
                onAddCell={handleAddCell}
                isAppRunning={activeRunId !== null}
            />
        ))}

        {cells.length === 0 && (
          <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "center" }}>
            <button 
                onClick={() => handleAddCell(0, "code")}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", backgroundColor: "#eff6ff", color: "#2563eb", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
                <Plus size={14} /> Start Code
            </button>
          </div>
        )}
    </div>
  );
};

// Sub-component for individual topic interaction (Updated)
const TopicDetail = ({ topic, onBack, onComplete }) => {
  const [markedDone, setMarkedDone] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [notebookCells, setNotebookCells] = useState([]);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEvaluate = async () => {
      setIsEvaluating(true);
      setEvaluationResult(null); // Clear previous

      try {
          const codeCells = notebookCells.filter(c => c.type === 'code');
          const fullCode = codeCells.map(c => c.content).join('\n\n');

          const response = await fetch('http://localhost:5000/evaluate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  code: fullCode,
                  questionId: topic.id
              })
          });

          if (!response.ok) throw new Error("Evaluation failed");

          const data = await response.json();
          setEvaluationResult(data);
          setShowEvaluation(true);
      } catch (err) {
          alert("Evaluation service unavailable: " + err.message);
      } finally {
          setIsEvaluating(false);
      }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
        // STEP 1: Auto Evaluate First
        const codeCells = notebookCells.filter(c => c.type === 'code');
        const fullCode = codeCells.map(c => c.content).join('\n\n');

        const evalResponse = await fetch('http://localhost:5000/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                code: fullCode,
                questionId: topic.id
            })
        });

        if (!evalResponse.ok) throw new Error("Auto-evaluation failed. Please try again.");
        const evalResult = await evalResponse.json();

        // Check for runtime errors or low marks blockage if desired (optional per requirement, but checking for output errors is good)
        if (evalResult.error) {
           alert("Fix runtime errors before submission: " + evalResult.error);
           setIsSubmitting(false);
           return;
        }

        // STEP 2: Submit to Database
        const submitResponse = await fetch('http://localhost:5000/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: "123", // Hardcoded per requirement
                questionId: topic.id,
                code: fullCode,
                accuracy: evalResult.accuracy,
                model: evalResult.model,
                marks: evalResult.marks
            })
        });

        if (!submitResponse.ok) throw new Error("Database submission failed.");
        
        // Success
        setEvaluationResult(evalResult); // Update local view too
        setMarkedDone(true);
        
        // Wait briefly then notify completion
        setTimeout(() => {
            onComplete(); 
        }, 1500);

    } catch (err) {
        alert("Submission process failed: " + err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleOpenCsv = async (fileName) => {
    try {
        const response = await fetch(`/datasets/${fileName}`);
        const text = await response.text();
        const newWindow = window.open("", "_blank");
        if (newWindow) {
            newWindow.document.write(`
                <html>
                    <head><title>${fileName}</title></head>
                    <body style="font-family: monospace; padding: 20px; white-space: pre;">${text}</body>
                </html>
            `);
            newWindow.document.close();
        }
    } catch (e) {
        alert("Could not load file for preview");
    }
  };

  return (
    <div style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        width: "100%", 
        height: "100%", 
        backgroundColor: "white", 
        zIndex: 1000, 
        padding: "0", 
        boxSizing: "border-box", 
        overflowY: "auto" 
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px" }}>
        
        {/* Navigation & Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
            <div>
                <button 
                    onClick={onBack}
                    style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "6px", 
                        background: "none", 
                        border: "none", 
                        cursor: "pointer", 
                        color: "#64748b", 
                        marginBottom: "16px",
                        fontSize: "14px"
                    }}
                >
                    <ArrowLeft size={16} /> Back to Topics
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {topic.icon}
                    <h1 style={{ margin: 0, fontSize: "28px", color: "#0f172a" }}>{topic.title}</h1>
                </div>
            </div>
        </div>

        {/* Question / Description Panel */}
        <div style={{ 
            fontSize: "16px", 
            lineHeight: "1.6", 
            color: "#334155", 
            backgroundColor: "#fff1f2", 
            border: "1px solid #fda4af",
            padding: "24px", 
            borderRadius: "12px",
            marginBottom: "40px"
        }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#be123c", display: "flex", alignItems: "center", gap: "8px" }}>
                <Activity size={20} /> Experiment
            </h3>
            <div style={{ whiteSpace: "pre-line" }}>
                {topic.content.intro}
            </div>
        </div>

        {/* Dataset & Expectations Panel (New) */}
        {(topic.content.dataset || topic.content.expectedOutput) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" }}>
                
                {/* Dataset Card */}
                {topic.content.dataset && (
                    <div style={{ 
                        backgroundColor: "#f8fafc", 
                        border: "1px solid #e2e8f0", 
                        borderRadius: "12px", 
                        padding: "20px" 
                    }}>
                        <h4 style={{ margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "8px", color: "#334155" }}>
                            <Database size={18} className="text-blue-500" /> Dataset
                        </h4>
                        <div style={{ fontSize: "14px", fontWeight: "bold", color: "#1e293b", marginBottom: "4px" }}>
                            {topic.content.dataset.name}
                        </div>
                        <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "16px" }}>
                            {topic.content.dataset.description}
                        </div>
                        
                        {topic.content.dataset.preview && (
                            <div style={{ overflowX: "auto", fontSize: "12px", border: "1px solid #cbd5e1", borderRadius: "6px", marginBottom: "16px" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
                                    <thead>
                                        <tr>
                                            {topic.content.dataset.preview[0].map((h, i) => (
                                                <th key={i} style={{ padding: "6px 10px", textAlign: "left", background: "#f1f5f9", borderBottom: "1px solid #cbd5e1", whiteSpace: "nowrap" }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topic.content.dataset.preview.slice(1).map((row, rI) => (
                                            <tr key={rI}>
                                                {row.map((cell, cI) => (
                                                    <td key={cI} style={{ padding: "6px 10px", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        <div style={{ display: "flex", gap: "10px" }}>
                             <a 
                                href={`/datasets/${topic.content.dataset.name}`} 
                                download 
                                style={{
                                    display: "flex", alignItems: "center", gap: "6px",
                                    padding: "8px 12px", backgroundColor: "#3b82f6", color: "white",
                                    borderRadius: "6px", fontSize: "12px", fontWeight: "600",
                                    textDecoration: "none", cursor: "pointer"
                                }}
                            >
                                <Database size={14} /> Download CSV
                            </a>
                            <button 
                                onClick={() => handleOpenCsv(topic.content.dataset.name)}
                                style={{
                                    display: "flex", alignItems: "center", gap: "6px",
                                    padding: "8px 12px", backgroundColor: "white", color: "#334155",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "6px", fontSize: "12px", fontWeight: "600",
                                    textDecoration: "none", cursor: "pointer"
                                }}
                            >
                                <ExternalLink size={14} /> Open in Browser
                            </button>
                        </div>
                    </div>
                )}

                {/* Expected Output Card */}
                {topic.content.expectedOutput && (
                    <div style={{ 
                        backgroundColor: "#f0fdf4", 
                        border: "1px solid #86efac", 
                        borderRadius: "12px", 
                        padding: "20px" 
                    }}>
                        <h4 style={{ margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "8px", color: "#166534" }}>
                            <Target size={18} className="text-green-600" /> Expected Output
                        </h4>
                        
                        <div style={{ fontSize: "14px", color: "#15803d", marginBottom: "12px", fontStyle: "italic" }}>
                           {topic.content.expectedOutput.description}
                        </div>

                        {topic.content.expectedOutput.criteria && (
                            <ul style={{ margin: "0 0 16px 0", padding: "0 0 0 20px", fontSize: "14px", color: "#166534" }}>
                                {topic.content.expectedOutput.criteria.map((c, i) => (
                                    <li key={i} style={{ marginBottom: "4px" }}>{c}</li>
                                ))}
                            </ul>
                        )}

                        <div style={{ 
                            backgroundColor: "#1e293b", 
                            color: "#f8fafc", 
                            padding: "12px", 
                            borderRadius: "6px", 
                            fontFamily: "monospace", 
                            fontSize: "13px",
                            whiteSpace: "pre-wrap"
                        }}>
                            {topic.content.expectedOutput.example}
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Notebook Interface */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "0px" }}>
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                padding: "16px 0",
                borderBottom: "1px solid #e2e8f0"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Terminal size={20} className="text-slate-600" />
                    <span style={{ fontWeight: "bold", color: "#1e293b" }}>Lab Notebook</span>
                    <span style={{ fontSize: "12px", color: "#64748b", backgroundColor: "#f1f5f9", padding: "2px 8px", borderRadius: "12px" }}>Python 3 (Backend)</span>
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                    RAM: 1.2 GB / Disk: 12 GB
                </div>
            </div>
            
            <Notebook key={topic.id} onCellsChange={setNotebookCells} />
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px", paddingBottom: "40px" }}>
            <button 
                onClick={handleEvaluate}
                disabled={isEvaluating}
                style={{ 
                    padding: "10px 24px", 
                    backgroundColor: "#f1f5f9", 
                    color: "#0f172a", 
                    border: "1px solid #cbd5e1", 
                    borderRadius: "8px", 
                    cursor: isEvaluating ? "wait" : "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    opacity: isEvaluating ? 0.7 : 1
                }}
            >
                {isEvaluating ? <Loader size={18} className="animate-spin" /> : <Activity size={18} />} 
                {isEvaluating ? "Evaluating..." : "Evaluate"}
            </button>
            {!markedDone ? (
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{ 
                        padding: "10px 24px", 
                        backgroundColor: "#2563eb", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "8px", 
                        cursor: isSubmitting ? "wait" : "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        opacity: isSubmitting ? 0.7 : 1
                    }}
                >
                    {isSubmitting ? <Loader size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                    {isSubmitting ? "Submitting..." : "Submit"} 
                </button>
            ) : (
                <div style={{ 
                    padding: "10px 24px", 
                    backgroundColor: "#10b981", 
                    color: "white", 
                    borderRadius: "8px", 
                    fontSize: "14px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    Submitted <CheckCircle size={18} />
                </div>
            )}
        </div>
        {/* Evaluation Slide-over Panel */}
        <EvaluationResultPanel 
            isOpen={showEvaluation} 
            onClose={() => setShowEvaluation(false)} 
            topic={topic}
            evaluationResult={evaluationResult}
        />
        
      </div>
    </div>
  );
};

export default MLLab;

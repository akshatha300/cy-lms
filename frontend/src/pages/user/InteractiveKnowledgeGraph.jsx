import { useState, useEffect, useRef } from "react";
import { Network, X, ChevronRight, BookOpen, MessageCircle } from "lucide-react";

const InteractiveKnowledgeGraph = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [visNetwork, setVisNetwork] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Initialize nodes data
  const initialNodes = [
    { id: 1, label: "Machine Learning", category: "root", description: "Core AI discipline teaching computers to learn from data" },
    { id: 2, label: "Supervised Learning", category: "branch", description: "Learning with labeled training data" },
    { id: 3, label: "Unsupervised Learning", category: "branch", description: "Finding patterns in unlabeled data" },
    { id: 4, label: "Linear Regression", category: "algorithm", description: "Predicting continuous values using linear relationships" },
    { id: 5, label: "Logistic Regression", category: "algorithm", description: "Binary classification using sigmoid function" },
    { id: 6, label: "Decision Trees", category: "algorithm", description: "Tree-based decision making with if-else logic" },
    { id: 7, label: "Random Forest", category: "algorithm", description: "Ensemble of decision trees for better accuracy" },
    { id: 8, label: "K-Means Clustering", category: "algorithm", description: "Partitioning data into K clusters" },
    { id: 9, label: "PCA", category: "algorithm", description: "Dimensionality reduction technique" },
    { id: 10, label: "Model Evaluation", category: "metric", description: "Measuring model performance" },
    { id: 11, label: "Accuracy", category: "metric", description: "Ratio of correct predictions to total predictions" },
    { id: 12, label: "Precision", category: "metric", description: "Ratio of true positives to total predicted positives" },
    { id: 13, label: "Recall", category: "metric", description: "Ratio of true positives to total actual positives" },
    { id: 14, label: "F1 Score", category: "metric", description: "Harmonic mean of precision and recall" }
  ];

  const initialEdges = [
    { from: 1, to: 2, label: "branches to" },
    { from: 1, to: 3, label: "branches to" },
    { from: 2, to: 4, label: "includes" },
    { from: 2, to: 5, label: "includes" },
    { from: 2, to: 6, label: "includes" },
    { from: 2, to: 7, label: "includes" },
    { from: 3, to: 8, label: "includes" },
    { from: 3, to: 9, label: "includes" },
    { from: 1, to: 10, label: "requires" },
    { from: 10, to: 11, label: "measures" },
    { from: 10, to: 12, label: "measures" },
    { from: 10, to: 13, label: "measures" },
    { from: 10, to: 14, label: "measures" }
  ];

  useEffect(() => {
    // Load vis-network script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/vis-network/standalone/umd/vis-network.min.js";
    script.async = true;
    
    script.onload = () => {
      setIsScriptLoaded(true);
      initializeNetwork();
    };
    
    script.onerror = () => {
      console.error("Failed to load vis-network script");
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initializeNetwork = () => {
    if (!window.vis) {
      console.error("vis-network not loaded");
      return;
    }

    // Create vis.js data sets
    const nodesDataSet = new window.vis.DataSet(initialNodes);
    const edgesDataSet = new window.vis.DataSet(initialEdges);
    
    const container = document.getElementById("knowledge-graph");
    if (!container) return;

    const data = {
      nodes: nodesDataSet,
      edges: edgesDataSet
    };

    const options = {
      nodes: {
        shape: "dot",
        size: 20,
        font: { 
          size: 16,
          color: "#1f2937"
        },
        borderWidth: 2,
        shadow: true,
        color: {
          border: "#e5e7eb",
          background: (node) => {
            const colors = {
              root: "#3b82f6",
              branch: "#10b981",
              algorithm: "#f59e0b",
              metric: "#ef4444"
            };
            return colors[node.category] || "#6b7280";
          },
          highlight: {
            border: "#2563eb",
            background: "#fbbf24"
          }
        }
      },
      edges: {
        arrows: "to",
        color: {
          color: "#9ca3af",
          highlight: "#2563eb"
        },
        width: 2,
        smooth: {
          type: "continuous"
        }
      },
      physics: {
        stabilization: false,
        barnesHutOptimize: {
          gravitationalConstant: -2000
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        hideEdgesOnDrag: true
      }
    };

    const network = new window.vis.Network(container, data, options);
    setVisNetwork(network);

    // Handle node clicks
    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = initialNodes.find(n => n.id === nodeId);
        setSelectedNode(node);
        setShowPanel(true);
      }
    });

    // Handle hover
    network.on("hoverNode", function (params) {
      if (params.node) {
        document.body.style.cursor = "pointer";
      }
    });

    network.on("blurNode", function () {
      document.body.style.cursor = "default";
    });

    // Highlight specific nodes
    nodesDataSet.update([
      { id: 5, color: { background: "#ef4444" } }, // Highlight Logistic Regression
      { id: 8, color: { background: "#f59e0b" } }  // Highlight K-Means
    ]);
  };

  const closePanel = () => {
    setSelectedNode(null);
    setShowPanel(false);
  };

  const openAITutor = () => {
    // Navigate to voice tutor
    window.location.href = "/voice-tutor";
  };

  const openLearningModule = () => {
    // Navigate to modules
    window.location.href = "/modules";
  };

  const getNodeIcon = (category) => {
    const icons = {
      root: <Network className="w-5 h-5" />,
      branch: <ChevronRight className="w-4 h-4" />,
      algorithm: <BookOpen className="w-4 h-4" />,
      metric: <MessageCircle className="w-4 h-4" />
    };
    return icons[category] || <Network className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Network className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Machine Learning Knowledge Graph</h1>
            </div>
            <button
              onClick={closePanel}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 text-center">
            Explore the relationships between machine learning concepts. Click on any node to learn more.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Knowledge Graph */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Interactive Knowledge Graph</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>Click nodes to explore</span>
                  </div>
                </div>
              </div>
              
              {/* Graph Container */}
              <div 
                id="knowledge-graph" 
                className="w-full h-96 lg:h-[500px] border-2 border-gray-200 rounded-lg bg-gray-50"
              />
              
              {/* Legend */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Legend</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    <span>Core Concepts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                    <span>Algorithms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
                    <span>Metrics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            {showPanel && selectedNode && (
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getNodeIcon(selectedNode.category)}
                    <h3 className="text-xl font-semibold text-gray-900">{selectedNode.label}</h3>
                  </div>
                  <button
                    onClick={closePanel}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedNode.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedNode.category}
                    </span>
                  </div>
                  
                  <div className="pt-4 space-y-3">
                    <h4 className="font-medium text-gray-900">Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={openAITutor}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Ask AI Tutor</span>
                      </button>
                      
                      <button
                        onClick={openLearningModule}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Open Learning Module</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Graph Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Concepts</span>
                  <span className="font-semibold text-gray-900">{initialNodes.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Connections</span>
                  <span className="font-semibold text-gray-900">{initialEdges.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Categories</span>
                  <span className="font-semibold text-gray-900">4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveKnowledgeGraph;

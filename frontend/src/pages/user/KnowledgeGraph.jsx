import { useEffect } from "react";

const KnowledgeGraph = () => {
  useEffect(() => {
    // Load the vis-network script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/vis-network/standalone/umd/vis-network.min.js";
    script.async = true;
    script.onload = () => {
      // Initialize the network once the script is loaded
      initializeNetwork();
    };
    document.body.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  const initializeNetwork = () => {
    // Nodes data
    const nodes = new vis.DataSet([
      { id: 1, label: "Machine Learning" },
      { id: 2, label: "Supervised Learning" },
      { id: 3, label: "Unsupervised Learning" },
      { id: 4, label: "Linear Regression" },
      { id: 5, label: "Logistic Regression" },
      { id: 6, label: "Decision Trees" },
      { id: 7, label: "Random Forest" },
      { id: 8, label: "K-Means Clustering" },
      { id: 9, label: "PCA" },
      { id: 10, label: "Model Evaluation" },
      { id: 11, label: "Accuracy" },
      { id: 12, label: "Precision" },
      { id: 13, label: "Recall" },
      { id: 14, label: "F1 Score" }
    ]);

    // Edges data
    const edges = new vis.DataSet([
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
      { from: 2, to: 7 },
      { from: 3, to: 8 },
      { from: 3, to: 9 },
      { from: 1, to: 10 },
      { from: 10, to: 11 },
      { from: 10, to: 12 },
      { from: 10, to: 13 },
      { from: 10, to: 14 }
    ]);

    const container = document.getElementById("mynetwork");
    if (!container) return;

    const data = {
      nodes: nodes,
      edges: edges
    };

    const options = {
      nodes: {
        shape: "dot",
        size: 18,
        font: { size: 16 }
      },
      edges: {
        arrows: "to"
      },
      physics: {
        stabilization: false
      }
    };

    const network = new vis.Network(container, data, options);

    // Highlight specific node (Logistic Regression)
    nodes.update({
      id: 5,
      color: { background: "red" }
    });

    // Handle click events
    network.on("click", function (params) {
      const nodeId = params.nodes[0];
      if (nodeId === 4) {
        window.location.href = "/labs";
      }
      if (nodeId === 5) {
        window.location.href = "/labs";
      }
    });

    // Highlight specific node
    nodes.update({
      id: 5,
      color: { background: "red" }
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#1f2937" }}>AIML Knowledge Graph</h2>
      <p style={{ marginBottom: "20px", color: "#6b7280" }}>
        Explore the relationships between different machine learning concepts. Click on nodes to navigate to related content.
      </p>
      <div 
        id="mynetwork" 
        style={{ 
          height: "700px", 
          border: "1px solid lightgray", 
          borderRadius: "8px",
          backgroundColor: "#ffffff"
        }}
      />
    </div>
  );
};

export default KnowledgeGraph;

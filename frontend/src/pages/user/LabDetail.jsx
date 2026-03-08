import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getLabById } from "../../api/labApi";
import LabExecution from "../../components/LabExecution";
import { ArrowLeft, Clock, Target, Code } from "lucide-react";

const LabDetail = () => {
  const { labId } = useParams();
  const { user } = useAuth();
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLab();
  }, [labId]);

  const loadLab = async () => {
    try {
      setLoading(true);
      const data = await getLabById(labId);
      setLab(data);
    } catch (err) {
      console.error("Failed to load lab:", err);
      setError("Failed to load lab details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", color: "#fff", textAlign: "center" }}>
        <div>Loading lab details...</div>
      </div>
    );
  }

  if (error || !lab) {
    return (
      <div style={{ padding: "20px", color: "#fff", textAlign: "center" }}>
        <div style={{ color: "#ef4444", marginBottom: "20px" }}>{error}</div>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", color: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <button
          onClick={() => window.history.back()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            backgroundColor: "transparent",
            color: "#9ca3af",
            border: "1px solid #374151",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          <ArrowLeft size={16} />
          Back to Labs
        </button>

        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}>
          {lab.name}
        </h1>
        
        <p style={{ color: "#d1d5db", fontSize: "16px", lineHeight: "1.5", marginBottom: "20px" }}>
          {lab.description}
        </p>

        {/* Lab metadata */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Clock size={16} color="#9ca3af" />
            <span style={{ color: "#9ca3af", fontSize: "14px" }}>
              {lab.estimatedTime} minutes
            </span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Target size={16} color="#9ca3af" />
            <span style={{ 
              color: lab.difficulty <= 2 ? "#10b981" : 
                     lab.difficulty <= 3 ? "#f59e0b" : "#ef4444",
              fontSize: "14px",
              fontWeight: "bold"
            }}>
              Difficulty: {lab.difficulty}/4
            </span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Code size={16} color="#9ca3af" />
            <span style={{ color: "#9ca3af", fontSize: "14px" }}>
              {lab.environment}
            </span>
          </div>
        </div>

        {/* Tags */}
        {lab.tags && lab.tags.length > 0 && (
          <div style={{ marginTop: "15px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {lab.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  padding: "4px 12px",
                  backgroundColor: "#374151",
                  color: "#d1d5db",
                  borderRadius: "20px",
                  fontSize: "12px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Lab Execution Component */}
      <LabExecution lab={lab} user={user} />
    </div>
  );
};

export default LabDetail;

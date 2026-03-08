import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getLabs } from "../../api/labApi";
import { Code, Target, Clock, Play, BarChart3, Trophy } from "lucide-react";

const AIMLLabsPage = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadLabs();
  }, []);

  const loadLabs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getLabs();
      setLabs(data || []);
    } catch (error) {
      console.error("Failed to load labs:", error);
      setError("Failed to load labs. Please try again later.");
      setLabs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLabs = labs.filter(lab => {
    if (filter === "all") return true;
    return (lab.difficulty || 0) <= filter;
  });

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 2) return "#10b981";
    if (difficulty <= 3) return "#f59e0b";
    return "#ef4444";
  };

  const getDifficultyLabel = (difficulty) => {
    if (difficulty <= 2) return "Beginner";
    if (difficulty <= 3) return "Intermediate";
    return "Advanced";
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", color: "#fff", textAlign: "center" }}>
        <div>Loading AIML labs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#fff", textAlign: "center" }}>
        <div style={{ color: "#ef4444", marginBottom: "20px", fontSize: "18px" }}>
          {error}
        </div>
        <button
          onClick={loadLabs}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Retry
        </button>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6b7280",
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
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}>
          AIML Labs
        </h1>
        <p style={{ color: "#d1d5db", fontSize: "16px", lineHeight: "1.5" }}>
          Hands-on machine learning labs to practice and master AIML concepts
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div style={{ backgroundColor: "#1f2937", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <Code size={32} color="#3b82f6" style={{ marginBottom: "10px" }} />
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>{labs.length}</div>
          <div style={{ fontSize: "14px", color: "#9ca3af" }}>Total Labs</div>
        </div>
        <div style={{ backgroundColor: "#1f2937", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <Target size={32} color="#10b981" style={{ marginBottom: "10px" }} />
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
            {labs.filter(lab => (lab.difficulty || 0) <= 2).length}
          </div>
          <div style={{ fontSize: "14px", color: "#9ca3af" }}>Beginner Labs</div>
        </div>
        <div style={{ backgroundColor: "#1f2937", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <BarChart3 size={32} color="#f59e0b" style={{ marginBottom: "10px" }} />
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
            {labs.filter(lab => (lab.difficulty || 0) > 2 && (lab.difficulty || 0) <= 3).length}
          </div>
          <div style={{ fontSize: "14px", color: "#9ca3af" }}>Intermediate Labs</div>
        </div>
        <div style={{ backgroundColor: "#1f2937", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <Trophy size={32} color="#ef4444" style={{ marginBottom: "10px" }} />
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
            {labs.filter(lab => (lab.difficulty || 0) > 3).length}
          </div>
          <div style={{ fontSize: "14px", color: "#9ca3af" }}>Advanced Labs</div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
          <span style={{ color: "#9ca3af", fontSize: "14px" }}>Filter by difficulty:</span>
          {["all", 2, 3, 4].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              style={{
                padding: "8px 16px",
                backgroundColor: filter === level ? "#3b82f6" : "#374151",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {level === "all" ? "All Levels" : getDifficultyLabel(level)}
            </button>
          ))}
        </div>
      </div>

      {/* Labs Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px" }}>
        {filteredLabs.map((lab) => (
          <div
            key={lab._id}
            style={{
              backgroundColor: "#1f2937",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #374151",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: "15px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
                {lab.name || "Untitled Lab"}
              </h3>
              <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.4", marginBottom: "12px" }}>
                {lab.description || "No description available"}
              </p>
              
              {/* Tags */}
              {lab.tags && lab.tags.length > 0 && (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                  {lab.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#374151",
                        color: "#d1d5db",
                        borderRadius: "12px",
                        fontSize: "11px",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {lab.tags.length > 3 && (
                    <span style={{ color: "#9ca3af", fontSize: "11px" }}>+{lab.tags.length - 3} more</span>
                  )}
                </div>
              )}
            </div>

            {/* Metadata */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Clock size={14} color="#9ca3af" />
                <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                  {lab.estimatedTime || 60} min
                </span>
              </div>
              
              <div style={{ 
                padding: "4px 8px", 
                backgroundColor: getDifficultyColor(lab.difficulty || 1) + "20",
                color: getDifficultyColor(lab.difficulty || 1),
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: "bold"
              }}>
                {getDifficultyLabel(lab.difficulty || 1)}
              </div>
            </div>

            {/* Objective */}
            {lab.objectiveText && (
              <div style={{ 
                backgroundColor: "#111827", 
                padding: "12px", 
                borderRadius: "8px", 
                marginBottom: "15px",
                border: "1px solid #374151"
              }}>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Objective:</div>
                <div style={{ fontSize: "13px", color: "#d1d5db", lineHeight: "1.4" }}>
                  {lab.objectiveText.length > 100 
                    ? lab.objectiveText.substring(0, 100) + "..." 
                    : lab.objectiveText}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Link
              to={`/labs/${lab._id}/detail`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 20px",
                backgroundColor: "#3b82f6",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
            >
              <Play size={16} />
              Start Lab
            </Link>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredLabs.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <Code size={48} style={{ marginBottom: "20px", opacity: 0.5 }} />
          <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>No labs found</h3>
          <p>Try adjusting the filter or check back later for new labs.</p>
        </div>
      )}
    </div>
  );
};

export default AIMLLabsPage;

import { useState, useEffect } from "react";
import PhishingLab from "./PhishingLab.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { getLabs, startLabAttempt, getMyLabAttempts, completeLabAttempt } from "../../api/roleBasedApi";
import { useAuthContext } from "../../context/AuthContext";

const LabsPage = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { user: _user } = useAuthContext();
  const [labs, setLabs] = useState([]);
  const [myAttempts, setMyAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState(null);
  const [activeAttempt, setActiveAttempt] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [labsData, attemptsData] = await Promise.all([
        getLabs(),
        getMyLabAttempts(),
      ]);
      setLabs(labsData);
      setMyAttempts(attemptsData);
    } catch (err) {
      console.error("Failed to load labs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLab = async (lab) => {
    try {
      const attempt = await startLabAttempt(lab._id, roleId);
      setActiveAttempt(attempt);
      setSelectedLab(lab);
    } catch (err) {
      alert("Failed to start lab: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCompleteLab = async (status, score) => {
    if (!activeAttempt) return;

    try {
      await completeLabAttempt(activeAttempt._id, {
        status,
        score: score || (status === "success" ? 100 : status === "partial" ? 50 : 0),
        timeTakenSeconds: Math.floor((Date.now() - new Date(activeAttempt.createdAt)) / 1000),
      });

      alert(`Lab ${status === "success" ? "passed" : status === "partial" ? "partially completed" : "failed"}!`);
      setActiveAttempt(null);
      setSelectedLab(null);
      loadData();

      if (roleId) {
        navigate(`/app/role-dashboard/${roleId}`);
      }
    } catch (err) {
      alert("Failed to complete lab: " + (err.response?.data?.message || err.message));
    }
  };

  const getAttemptCount = (labId) => {
    return myAttempts.filter((a) => a.labId?._id === labId).length;
  };

  const getLastAttemptStatus = (labId) => {
    const attempts = myAttempts
      .filter((a) => a.labId?._id === labId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return attempts[0]?.status;
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 2) return "#10b981";
    if (difficulty === 3) return "#f59e0b";
    return "#ef4444";
  };

  const getScenarioIcon = (scenario) => {
    if (scenario === "attack") return "⚔️";
    if (scenario === "defense") return "🛡️";
    return "🔄";
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <p>Loading labs...</p>
      </div>
    );
  }
    if (activeAttempt && selectedLab) {
    // For the phishing lab, show the interactive component
    if (selectedLab.name === "Identify Phishing Indicators") {
      return <PhishingLab onComplete={handleCompleteLab} onCancel={() => {
        setActiveAttempt(null);
        setSelectedLab(null);
      }} />;
    }

    // For other labs, keep the existing display
    return (
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <div
          style={{
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
            backgroundColor: "#f9fafb",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>{selectedLab.name}</h2>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "600",
                backgroundColor: `${getDifficultyColor(selectedLab.difficulty)}20`,
                color: getDifficultyColor(selectedLab.difficulty),
              }}
            >
              Level {selectedLab.difficulty}
            </span>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px", fontSize: "0.9rem", color: "#6b7280" }}>
              <span>{getScenarioIcon(selectedLab.scenario)} {selectedLab.scenario}</span>
              <span>⏱️ {selectedLab.timeLimit} min</span>
              <span>🔧 {selectedLab.requiredTools?.join(", ")}</span>
            </div>

            <div style={{ backgroundColor: "#dbeafe", borderLeft: "4px solid #3b82f6", padding: "16px", marginBottom: "16px" }}>
              <h3 style={{ margin: "0 0 8px", color: "#1e40af", fontWeight: "600" }}>Objective:</h3>
              <p style={{ margin: 0, color: "#1e40af" }}>{selectedLab.objectiveText}</p>
            </div>

            <div style={{ backgroundColor: "#f3f4f6", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
              <h3 style={{ margin: "0 0 8px", fontWeight: "600" }}>Description:</h3>
              <p style={{ margin: 0, color: "#374151" }}>{selectedLab.description}</p>
            </div>

            <div style={{ backgroundColor: "#fef3c7", borderLeft: "4px solid #f59e0b", padding: "16px" }}>
              <p style={{ margin: 0, color: "#92400e", fontSize: "0.9rem" }}>
                📋 In a real environment, you would access a VM, Docker container, or simulation here.
                For this demo, complete the lab in your own environment and record your result below.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => handleCompleteLab("success", 100)}
              style={{
                flex: 1,
                padding: "12px 16px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              ✅ Mark as Passed (100%)
            </button>
            <button
              onClick={() => handleCompleteLab("partial", 50)}
              style={{
                flex: 1,
                padding: "12px 16px",
                backgroundColor: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              ⚠️ Partial Completion (50%)
            </button>
            <button
              onClick={() => handleCompleteLab("failed", 0)}
              style={{
                flex: 1,
                padding: "12px 16px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              ❌ Mark as Failed
            </button>
          </div>

          <button
            onClick={() => {
              setActiveAttempt(null);
              setSelectedLab(null);
            }}
            style={{
              marginTop: "16px",
              width: "100%",
              padding: "12px",
              backgroundColor: "transparent",
              color: "#6b7280",
              border: "none",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }



  return (
    <div style={{ padding: "20px" }}>
      <h2>🔬 Practical Labs</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Complete hands-on labs to build practical skills and improve your job readiness score.
      </p>

      {labs.length === 0 ? (
        <div
          style={{
            border: "2px solid #fbbf24",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            backgroundColor: "#fef3c7",
          }}
        >
          <p style={{ margin: 0, color: "#92400e" }}>No labs available yet. Contact your administrator.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          }}
        >
          {labs.map((lab) => {
            const attemptCount = getAttemptCount(lab._id);
            const lastStatus = getLastAttemptStatus(lab._id);

            return (
              <div
                key={lab._id}
                style={{
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "20px",
                  transition: "all 0.2s",
                  backgroundColor: "#f9fafb",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold" }}>{lab.name}</h3>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      backgroundColor: `${getDifficultyColor(lab.difficulty)}20`,
                      color: getDifficultyColor(lab.difficulty),
                    }}
                  >
                    L{lab.difficulty}
                  </span>
                </div>

                <p style={{ margin: "0 0 16px", color: "#6b7280", fontSize: "0.9rem", lineHeight: "1.4" }}>
                  {lab.description}
                </p>

                <div style={{ fontSize: "0.85rem", color: "#4b5563", marginBottom: "16px" }}>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Scenario:</strong> {getScenarioIcon(lab.scenario)} {lab.scenario}
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Time Limit:</strong> ⏱️ {lab.timeLimit} min
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Tools:</strong> 🔧 {lab.requiredTools?.join(", ") || "None"}
                  </div>
                  <div>
                    <strong>Tags:</strong> 🏷️ {lab.tags?.[0] || "General"}
                  </div>
                </div>

                {attemptCount > 0 && (
                  <div style={{ marginBottom: "12px", fontSize: "0.8rem" }}>
                    <span style={{ color: "#6b7280" }}>Attempts: {attemptCount}</span>
                    {lastStatus && (
                      <span
                        style={{
                          marginLeft: "8px",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          backgroundColor:
                            lastStatus === "success"
                              ? "#10b98120"
                              : lastStatus === "partial"
                              ? "#f59e0b20"
                              : "#ef444420",
                          color:
                            lastStatus === "success"
                              ? "#10b981"
                              : lastStatus === "partial"
                              ? "#f59e0b"
                              : "#ef4444",
                        }}
                      >
                        Last: {lastStatus}
                      </span>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleStartLab(lab)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
                >
                  {attemptCount > 0 ? "Try Again" : "Start Lab"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LabsPage;
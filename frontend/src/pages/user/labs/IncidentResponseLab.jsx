// frontend/src/pages/user/labs/IncidentResponseLab.jsx
import { useState } from "react";
import { AlertTriangle, Shield, CheckCircle, Phone } from "lucide-react";

const IncidentResponseLab = ({ lab, attempt, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedActions, setSelectedActions] = useState([]);
  const [userAnalysis, setUserAnalysis] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const incidentScenarios = [
    {
      id: 1,
      title: "Data Breach Response",
      description: "Respond to suspected data breach incident",
      incident: {
        type: "DATA_BREACH",
        severity: "CRITICAL",
        timestamp: "2024-01-15 09:15:00",
        description: "Suspicious data exfiltration detected from database server",
        affectedSystems: ["Customer Database", "Application Server", "Backup Storage"],
        indicators: ["Unusual data access patterns", "Large outbound transfers", "Off-hours activity"]
      },
      responseOptions: [
        "Isolate affected systems",
        "Preserve forensic evidence",
        "Notify security team",
        "Block external network access",
        "Activate incident response plan"
      ],
      correctActions: ["Preserve forensic evidence", "Block external network access", "Activate incident response plan"],
      hints: ["Act quickly", "Document everything", "Follow incident response procedures"]
    },
    {
      id: 2,
      title: "Malware Outbreak Response",
      description: "Contain and respond to malware infection",
      incident: {
        type: "MALWARE_OUTBREAK",
        severity: "HIGH",
        timestamp: "2024-01-15 14:30:00",
        description: "Ransomware detected on multiple workstations",
        affectedSystems: ["Workstation-01", "Workstation-02", "Workstation-03", "File Server"],
        indicators: ["Multiple simultaneous infections", "Ransom notes", "Network traffic spikes", "File encryption"]
      },
      responseOptions: [
        "Isolate infected systems",
        "Disconnect from network",
        "Preserve malware samples",
        "Activate incident response team",
        "Communicate with stakeholders"
      ],
      correctActions: ["Isolate infected systems", "Disconnect from network", "Preserve malware samples"],
      hints: ["Quick isolation prevents spread", "Preserve evidence for analysis", "Communication is key"]
    }
  ];

  const currentScenario = incidentScenarios[currentStep] || incidentScenarios[0];

  const handleActionSelect = (action) => {
    if (selectedActions.includes(action)) {
      setSelectedActions(selectedActions.filter(a => a !== action));
    } else {
      setSelectedActions([...selectedActions, action]);
    }
  };

  const completeAnalysis = () => {
    const correctActions = currentScenario.correctActions.filter(action => 
      selectedActions.includes(action)
    ).length;
    const totalActions = currentScenario.correctActions.length;
    const accuracy = (correctActions / totalActions) * 100;
    const finalScore = Math.round(accuracy);
    
    setScore(finalScore);
    setShowResults(true);
    
    onComplete({
      status: "completed",
      score: finalScore,
      timeTakenSeconds: 600, // 10 minutes
      evidenceSubmitted: [`Selected ${correctActions}/${totalActions} correct response actions`],
      mentorFeedback: finalScore >= 80 ? 
        ["Excellent incident response!"] : 
        finalScore >= 60 ? 
        ["Good response, improve decision making"] :
        ["Need better incident management training"]
    });
  };

  if (showResults) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ 
          backgroundColor: "#f0f9ff", 
          padding: "30px", 
          borderRadius: "12px", 
          maxWidth: "600px", 
          margin: "0 auto" 
        }}>
          <Phone size={48} color="#10b981" style={{ marginBottom: "20px" }} />
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            Incident Response Complete!
          </h2>
          <div style={{ 
            backgroundColor: "#dcfce7", 
            padding: "20px", 
            borderRadius: "8px", 
            marginBottom: "20px" 
          }}>
            <h3 style={{ color: "#166534", marginBottom: "12px" }}>Response Score</h3>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#166534" }}>
              {score}%
            </div>
          </div>
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <h4 style={{ color: "#374151", marginBottom: "8px" }}>Actions Taken:</h4>
            <ul style={{ color: "#6b7280", lineHeight: "1.6" }}>
              {selectedActions.map((action, index) => (
                <li key={index} style={{ color: "#10b981" }}>✓ {action}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Lab Header */}
      <div style={{ 
        backgroundColor: "#1f2937", 
        color: "white", 
        padding: "24px", 
        borderRadius: "12px", 
        marginBottom: "24px",
        textAlign: "center",
        position: "relative"
      }}>
        <button
          onClick={onCancel}
          style={{
            position: "absolute",
            left: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          ← Back to Labs
        </button>
        <Phone size={48} style={{ marginBottom: "16px" }} />
        <h1 style={{ margin: "0 0 8px", fontSize: "28px" }}>
          Incident Response Lab
        </h1>
        <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
          Practice incident response procedures and decision making
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        {/* Incident Analysis Area */}
        <div style={{ 
          backgroundColor: "#ffffff", 
          padding: "24px", 
          borderRadius: "12px", 
          border: "1px solid #e5e7eb" 
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            {currentScenario.title}
          </h2>
          
          {/* Incident Report */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              🚨 Incident Report
            </h3>
            <div style={{ 
              backgroundColor: "#fef2f2", 
              padding: "16px", 
              borderRadius: "8px", 
              border: "1px solid #ef4444",
              marginBottom: "16px"
            }}>
              <div style={{ marginBottom: "12px" }}>
                <strong>Incident Type:</strong> {currentScenario.incident.type}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Severity:</strong> 
                <span style={{ 
                  color: currentScenario.incident.severity === "CRITICAL" ? "#ef4444" : "#f59e0b",
                  fontWeight: "bold"
                }}>
                  {currentScenario.incident.severity}
                </span>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Timestamp:</strong> {currentScenario.incident.timestamp}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Description:</strong> {currentScenario.incident.description}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Affected Systems:</strong> {currentScenario.incident.affectedSystems.join(", ")}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Key Indicators:</strong> {currentScenario.incident.indicators.join(", ")}
              </div>
            </div>
          </div>

          {/* Response Actions Selection */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              🚨 Select Response Actions:
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {currentScenario.responseOptions.map((action, index) => (
                <div
                  key={index}
                  onClick={() => handleActionSelect(action)}
                  style={{
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: selectedActions.includes(action) ? "#dcfce7" : "#ffffff",
                    transition: "all 0.2s ease"
                  }}
                >
                  {selectedActions.includes(action) ? "✓" : "○"} {action}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Input */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Incident Response Plan:
            </label>
            <textarea
              value={userAnalysis}
              onChange={(e) => setUserAnalysis(e.target.value)}
              placeholder="Document your response actions and incident analysis..."
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px"
              }}
            />
          </div>

          <button
            onClick={completeAnalysis}
            disabled={selectedActions.length === 0}
            style={{
              width: "100%",
              padding: "12px 20px",
              backgroundColor: selectedActions.length === 0 ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: selectedActions.length === 0 ? "not-allowed" : "pointer"
            }}
          >
            Submit Response Plan
          </button>
        </div>

        {/* Sidebar */}
        <div>
          {/* Incident Timeline */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #e5e7eb",
            marginBottom: "20px"
          }}>
            <h3 style={{ color: "#1f2937", marginBottom: "16px" }}>⏰ Incident Timeline</h3>
            <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "12px" }}>
                <strong>9:15 AM</strong> - Incident detected
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>9:20 AM</strong> - Initial assessment
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>9:45 AM</strong> - Response actions selected
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>10:00 AM</strong> - Incident contained
              </div>
            </div>
          </div>

          {/* Response Framework */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #e5e7eb" 
          }}>
            <h3 style={{ color: "#1f2937", marginBottom: "16px" }}>🎯 Response Framework</h3>
            <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "12px" }}>
                <strong>1. Preparation:</strong> Establish incident response team and procedures
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>2. Identification:</strong> Detect and analyze security incidents
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>3. Containment:</strong> Isolate and limit damage
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>4. Eradication:</strong> Remove threats and recover systems
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>5. Recovery:</strong> Return to normal operations
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>6. Lessons Learned:</strong> Document and improve processes
              </p>
            </div>
          </div>

          {/* Response Tips */}
          <div style={{ 
            backgroundColor: "#fef3c7", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #f59e0b" 
          }}>
            <h3 style={{ color: "#92400e", marginBottom: "16px" }}>🚨 Incident Response Tips</h3>
            <div style={{ fontSize: "14px", color: "#92400e", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "12px" }}>
                📞 <strong>Stay calm</strong> - Follow procedures, don't panic
              </p>
              <p style={{ marginBottom: "12px" }}>
                📋 <strong>Document everything</strong> - Create detailed incident logs
              </p>
              <p style={{ marginBottom: "12px" }}>
                🤝 <strong>Communicate clearly</strong> - Keep stakeholders informed
              </p>
              <p>
                ⚡ <strong>Act decisively</strong> - Quick response minimizes damage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentResponseLab;
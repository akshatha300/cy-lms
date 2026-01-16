// frontend/src/pages/user/labs/SIEMLab.jsx
import { useState } from "react";
import { Activity, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";

const SIEMLab = ({ lab, attempt, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [correlationRules, setCorrelationRules] = useState([]);
  const [userAnalysis, setUserAnalysis] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const siemScenarios = [
    {
      id: 1,
      title: "Security Incident Response",
      description: "Analyze and correlate security events",
      events: [
        { timestamp: "2024-01-15 14:23:12", source: "192.168.1.100", event: "LOGIN_FAILED", severity: "MEDIUM", user: "admin" },
        { timestamp: "2024-01-15 14:23:15", source: "192.168.1.100", event: "LOGIN_FAILED", severity: "MEDIUM", user: "admin" },
        { timestamp: "2024-01-15 14:23:18", source: "192.168.1.100", event: "LOGIN_FAILED", severity: "MEDIUM", user: "admin" },
        { timestamp: "2024-01-15 14:23:22", source: "192.168.1.100", event: "LOGIN_SUCCESS", severity: "LOW", user: "admin" },
        { timestamp: "2024-01-15 14:25:45", source: "10.0.0.50", event: "DATA_EXFILTRATION", severity: "CRITICAL", user: "admin", data: "user_records.zip" },
        { timestamp: "2024-01-15 14:26:12", source: "10.0.0.50", event: "UNAUTHORIZED_ACCESS", severity: "HIGH", user: "unknown" }
      ],
      correlationRules: ["Multiple failed logins from same IP", "Login success followed by data access", "Unusual time patterns"],
      hints: ["Look for event patterns", "Correlate by user and IP", "Check for anomalies"]
    }
  ];

  const currentScenario = siemScenarios[currentStep] || siemScenarios[0];

  // Calculate alert statistics for display
  const criticalAlerts = currentScenario.events.filter(e => e.severity === "CRITICAL").length;
  const highAlerts = currentScenario.events.filter(e => e.severity === "HIGH").length;

  const handleAlertSelect = (alert) => {
    if (selectedAlerts.includes(alert)) {
      setSelectedAlerts(selectedAlerts.filter(a => a !== alert));
    } else {
      setSelectedAlerts([...selectedAlerts, alert]);
    }
  };

  const handleCorrelationSelect = (rule) => {
    if (correlationRules.includes(rule)) {
      setCorrelationRules(correlationRules.filter(r => r !== rule));
    } else {
      setCorrelationRules([...correlationRules, rule]);
    }
  };

  const completeAnalysis = () => {
    const criticalAlerts = currentScenario.events.filter(e => e.severity === "CRITICAL").length;
    const highAlerts = currentScenario.events.filter(e => e.severity === "HIGH").length;
    const correctAlerts = selectedAlerts.filter(alert => 
      alert.severity === "CRITICAL" || alert.severity === "HIGH"
    ).length;
    const totalAlerts = currentScenario.events.filter(e => 
      e.severity === "CRITICAL" || e.severity === "HIGH"
    ).length;
    const correctRules = correlationRules.filter(rule => 
      currentScenario.correlationRules.includes(rule)
    ).length;
    const totalRules = currentScenario.correlationRules.length;
    const accuracy = ((correctAlerts + correctRules) / (totalAlerts + totalRules)) * 100;
    const finalScore = Math.round(accuracy);
    
    setScore(finalScore);
    setShowResults(true);
    
    onComplete({
      status: "completed",
      score: finalScore,
      timeTakenSeconds: 540, // 9 minutes
      evidenceSubmitted: [`Identified ${correctAlerts}/${totalAlerts} critical alerts`, `Applied ${correctRules}/${totalRules} correlation rules`],
      mentorFeedback: finalScore >= 80 ? 
        ["Excellent SIEM operations!"] : 
        finalScore >= 60 ? 
        ["Good incident response, improve correlation"] :
        ["Need better pattern recognition and response"]
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
          <Activity size={48} color="#10b981" style={{ marginBottom: "20px" }} />
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            SIEM Analysis Complete!
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
        <BarChart3 size={48} style={{ marginBottom: "16px" }} />
        <h1 style={{ margin: "0 0 8px", fontSize: "28px" }}>
          SIEM Operations Lab
        </h1>
        <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
          Security Information and Event Management
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        {/* Event Analysis Area */}
        <div style={{ 
          backgroundColor: "#ffffff", 
          padding: "24px", 
          borderRadius: "12px", 
          border: "1px solid #e5e7eb" 
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            {currentScenario.title}
          </h2>
          
          {/* Security Events Feed */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              🚨 Security Events Feed
            </h3>
            <div style={{
              backgroundColor: "#000000",
              color: "#00ff00",
              padding: "20px",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "12px",
              height: "300px",
              overflow: "auto",
              marginBottom: "20px"
            }}>
              <div style={{ marginBottom: "8px", color: "#888" }}>
                $ siem events --tail -f --severity=HIGH --format=json
              </div>
              {currentScenario.events.map((event, index) => (
                <div key={index} style={{ marginBottom: "4px", fontSize: "11px" }}>
                  <span style={{ 
                    color: event.severity === "CRITICAL" ? "#ff6b6b" : 
                           event.severity === "HIGH" ? "#f59e0b" : 
                           event.severity === "MEDIUM" ? "#fbbf24" : "#10b981"
                  }}>
                    [{event.timestamp}] {event.severity} {event.event}
                  </span>
                  {event.user && <span> (User: {event.user})</span>}
                  {event.data && <span> (Data: {event.data})</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Alert Selection */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              🚨 Select Critical/High Severity Events:
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {currentScenario.events.filter(event => event.severity === "CRITICAL" || event.severity === "HIGH").map((event, index) => (
                <div
                  key={index}
                  onClick={() => handleAlertSelect(event)}
                  style={{
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: selectedAlerts.includes(event) ? "#fee2e2" : "#ffffff",
                    transition: "all 0.2s ease"
                  }}
                >
                  {selectedAlerts.includes(event) ? "✓" : "○"} [{event.timestamp}] {event.severity}
                </div>
              ))}
            </div>
          </div>

          {/* Correlation Rules */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              🔗 Apply Correlation Rules:
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {currentScenario.correlationRules.map((rule, index) => (
                <div
                  key={index}
                  onClick={() => handleCorrelationSelect(rule)}
                  style={{
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: correlationRules.includes(rule) ? "#fee2e2" : "#ffffff",
                    transition: "all 0.2s ease"
                  }}
                >
                  {correlationRules.includes(rule) ? "✓" : "○"} {rule}
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
              placeholder="Document your incident analysis and response actions..."
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
            disabled={selectedAlerts.length === 0}
            style={{
              width: "100%",
              padding: "12px 20px",
              backgroundColor: selectedAlerts.length === 0 ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: selectedAlerts.length === 0 ? "not-allowed" : "pointer"
            }}
          >
            Submit Incident Report
          </button>
        </div>

        {/* Sidebar */}
        <div>
          {/* Event Statistics */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #e5e7eb",
            marginBottom: "20px"
          }}>
            <h3 style={{ color: "#1f2937", marginBottom: "16px" }}>📊 Event Statistics</h3>
            <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "12px" }}>
                <strong>Total Events:</strong> {currentScenario.events.length}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Critical:</strong> {criticalAlerts}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>High:</strong> {highAlerts}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Response Time:</strong> 2.3 minutes average
              </div>
            </div>
          </div>

          {/* MITRE ATT&CK */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #e5e7eb" 
          }}>
            <h3 style={{ color: "#1f2937", marginBottom: "16px" }}>🎯 MITRE ATT&CK</h3>
            <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "12px" }}>
                <strong>TA0001:</strong> Initial Access
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>TA0002:</strong> Execution
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>TA0003:</strong> Persistence
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>TA0004:</strong> Privilege Escalation
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>TA0005:</strong> Defense Evasion
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>TA0006:</strong> Credential Access
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>TA0007:</strong> Discovery
              </p>
              <p>
                <strong>TA0040:</strong> Lateral Movement
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
            <h3 style={{ color: "#92400e", marginBottom: "16px" }}>🛡️ Incident Response Tips</h3>
            <div style={{ fontSize: "14px", color: "#92400e", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "12px" }}>
                🚨 <strong>Triage quickly</strong> - Prioritize by severity
              </p>
              <p style={{ marginBottom: "12px" }}>
                📊 <strong>Correlate events</strong> - Link related incidents
              </p>
              <p style={{ marginBottom: "12px" }}>
                ⏰ <strong>Document everything</strong> - Create audit trail
              </p>
              <p>
                🚔 <strong>Contain the threat</strong> - Isolate affected systems
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIEMLab;
// frontend/src/pages/user/labs/PasswordSecurityLab.jsx
import { useState } from "react";
import { Lock, Shield, AlertTriangle, CheckCircle, Terminal, Eye } from "lucide-react";

const PasswordSecurityLab = ({ lab, attempt, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [logData, setLogData] = useState([]);
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [userAnalysis, setUserAnalysis] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Simulated log data for brute force attack detection
  const attackScenarios = [
    {
      id: 1,
      title: "SSH Brute Force Attack",
      logs: [
        "2024-01-15 14:23:12 [sshd] Failed password for user admin from 192.168.1.100 port 22",
        "2024-01-15 14:23:15 [sshd] Failed password for user admin from 192.168.1.100 port 22",
        "2024-01-15 14:23:18 [sshd] Failed password for user admin from 192.168.1.100 port 22",
        "2024-01-15 14:23:25 [sshd] Failed password for user admin from 192.168.1.100 port 22",
        "2024-01-15 14:23:32 [sshd] Failed password for user admin from 192.168.1.100 port 22",
        "2024-01-15 14:23:45 [sshd] Successful login for user admin from 192.168.1.100 port 22",
        "2024-01-15 14:24:02 [sshd] ERROR: Unauthorized access detected! System breach in progress...",
        "2024-01-15 14:24:05 [sshd] CRITICAL: Multiple failed attempts from 192.168.1.101 port 22",
        "2024-01-15 14:24:12 [sshd] WARNING: Suspicious activity from 192.168.1.102 port 22"
      ],
      attackIP: "192.168.1.100",
      attackPattern: "Repeated failed attempts followed by success",
      indicators: ["Multiple failed attempts", "Same source IP", "Rapid succession", "Success after failures"],
      timeWindow: "2 minutes"
    },
    {
      id: 2,
      title: "Web Application Attack",
      logs: [
        "2024-01-15 15:45:33 [nginx] POST /login HTTP/1.1 401",
        "2024-01-15 15:45:35 [nginx] POST /login HTTP/1.1 401",
        "2024-01-15 15:45:37 [nginx] POST /login HTTP/1.1 401",
        "2024-01-15 15:45:41 [nginx] POST /login HTTP/1.1 401",
        "2024-01-15 15:45:45 [nginx] POST /login HTTP/1.1 401",
        "2024-01-15 15:45:52 [nginx] POST /login HTTP/1.1 200",
        "2024-01-15 15:46:15 [nginx] GET /admin/dashboard HTTP/1.1 200",
        "2024-01-15 15:46:30 [nginx] POST /api/users/export HTTP/1.1 200",
        "2024-01-15 15:47:00 [nginx] WARNING: Data exfiltration attempt detected"
      ],
      attackIP: "10.0.0.45",
      attackPattern: "Credential stuffing with common passwords",
      indicators: ["HTTP 401 responses", "Success after failures", "Data access attempt", "Multiple endpoints"],
      timeWindow: "3 minutes"
    }
  ];

  const currentScenario = attackScenarios[currentStep] || attackScenarios[0];

  const handleBlockIP = (ip) => {
    if (!blockedIPs.includes(ip)) {
      setBlockedIPs([...blockedIPs, ip]);
    }
  };

  const completeAnalysis = () => {
    const correctIndicators = currentScenario.indicators.filter(indicator => 
      userAnalysis.toLowerCase().includes(indicator.toLowerCase())
    ).length;
    const totalIndicators = currentScenario.indicators.length;
    const blockedCorrect = currentScenario.attackIP && blockedIPs.includes(currentScenario.attackIP);
    const accuracy = ((correctIndicators + (blockedCorrect ? 20 : 0)) / (totalIndicators + 20)) * 100;
    const finalScore = Math.round(accuracy);
    
    setScore(finalScore);
    setShowResults(true);
    
    onComplete({
      status: "completed",
      score: finalScore,
      timeTakenSeconds: 420, // 7 minutes
      evidenceSubmitted: [`Blocked ${blockedIPs.length} IPs`, `Identified ${correctIndicators}/${totalIndicators} indicators`],
      mentorFeedback: finalScore >= 80 ? 
        ["Excellent security response!"] : 
        finalScore >= 60 ? 
        ["Good detection, but faster response needed"] :
        ["Need to improve attack recognition"]
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
          <Shield size={48} color="#10b981" style={{ marginBottom: "20px" }} />
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            Security Analysis Complete!
          </h2>
          <div style={{ 
            backgroundColor: "#dcfce7", 
            padding: "20px", 
            borderRadius: "8px", 
            marginBottom: "20px" 
          }}>
            <h3 style={{ color: "#166534", marginBottom: "12px" }}>Security Score</h3>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#166534" }}>
              {score}%
            </div>
          </div>
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <h4 style={{ color: "#374151", marginBottom: "8px" }}>Actions Taken:</h4>
            <ul style={{ color: "#6b7280", lineHeight: "1.6" }}>
              <li style={{ color: "#10b981" }}>✓ Blocked {blockedIPs.length} suspicious IPs</li>
              <li style={{ color: "#10b981" }}>✓ Identified attack patterns</li>
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
        textAlign: "center"
      }}>
        <Lock size={48} style={{ marginBottom: "16px" }} />
        <h1 style={{ margin: "0 0 8px", fontSize: "28px" }}>
          Password Security Lab
        </h1>
        <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
          Detect and respond to brute force attacks on system authentication
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        {/* Log Analysis Area */}
        <div style={{ 
          backgroundColor: "#ffffff", 
          padding: "24px", 
          borderRadius: "12px", 
          border: "1px solid #e5e7eb" 
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            {currentScenario.title}
          </h2>
          
          {/* Log Terminal */}
          <div style={{
            backgroundColor: "#000000",
            color: "#00ff00",
            padding: "20px",
            borderRadius: "8px",
            fontFamily: "monospace",
            fontSize: "12px",
            minHeight: "300px",
            overflow: "auto",
            marginBottom: "20px"
          }}>
            <div style={{ marginBottom: "8px", color: "#888" }}>
              $ tail -f /var/log/auth.log | grep "Failed password"
            </div>
            {currentScenario.logs.map((log, index) => (
              <div key={index} style={{ marginBottom: "4px" }}>
                <span style={{ color: "#ff6b6b" }}>
                  {log.includes("Failed") || log.includes("ERROR") || log.includes("CRITICAL") ? "❌" : "⚠️"}
                </span>
                <span style={{ color: "#ffffff" }}> {log}</span>
              </div>
            ))}
            <div style={{ marginTop: "12px", color: "#888" }}>
              $ Monitoring for suspicious activity...
            </div>
          </div>

          {/* IP Blocking Interface */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              🚨 Suspicious IPs Detected:
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <div style={{ 
                  padding: "12px", 
                  backgroundColor: "#fef2f2", 
                  borderRadius: "8px", 
                  marginBottom: "12px",
                  border: blockedIPs.includes(currentScenario.attackIP) ? "2px solid #10b981" : "2px solid #ef4444"
                }}>
                  <strong>Attack Source:</strong> {currentScenario.attackIP}
                </div>
                <button
                  onClick={() => handleBlockIP(currentScenario.attackIP)}
                  disabled={blockedIPs.includes(currentScenario.attackIP)}
                  style={{
                    width: "100%",
                    padding: "8px 16px",
                    backgroundColor: blockedIPs.includes(currentScenario.attackIP) ? "#9ca3af" : "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor: blockedIPs.includes(currentScenario.attackIP) ? "not-allowed" : "pointer"
                  }}
                >
                  {blockedIPs.includes(currentScenario.attackIP) ? "✓ Already Blocked" : "🚫 Block IP"}
                </button>
              </div>
              <div>
                <strong>Currently Blocked:</strong>
                <ul style={{ marginTop: "8px" }}>
                  {blockedIPs.map((ip, index) => (
                    <li key={index} style={{ color: "#10b981", marginBottom: "4px" }}>
                      🚫 {ip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Analysis Input */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Security Analysis:
            </label>
            <textarea
              value={userAnalysis}
              onChange={(e) => setUserAnalysis(e.target.value)}
              placeholder="Describe the attack pattern and your response actions..."
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
            disabled={userAnalysis.length === 0}
            style={{
              width: "100%",
              padding: "12px 20px",
              backgroundColor: userAnalysis.length === 0 ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: userAnalysis.length === 0 ? "not-allowed" : "pointer"
            }}
          >
            Submit Security Report
          </button>
        </div>

        {/* Sidebar */}
        <div>
          {/* Attack Indicators */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #e5e7eb",
            marginBottom: "20px"
          }}>
            <h3 style={{ color: "#1f2937", marginBottom: "16px" }}>🔍 Attack Indicators</h3>
            <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
              {currentScenario.indicators.map((indicator, index) => (
                <div
                  key={index}
                  style={{
                    padding: "8px",
                    marginBottom: "8px",
                    borderRadius: "6px",
                    backgroundColor: userAnalysis.toLowerCase().includes(indicator.toLowerCase()) ? "#dcfce7" : "#f3f4f6",
                    border: "1px solid #e5e7eb"
                  }}
                >
                  {userAnalysis.toLowerCase().includes(indicator.toLowerCase()) ? "✓" : "○"} {indicator}
                </div>
              ))}
            </div>
          </div>

          {/* Security Tips */}
          <div style={{ 
            backgroundColor: "#fef3c7", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #f59e0b" 
          }}>
            <h3 style={{ color: "#92400e", marginBottom: "16px" }}>🛡️ Defense Tips</h3>
            <div style={{ fontSize: "14px", color: "#92400e", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "12px" }}>
                ⚡ <strong>Act quickly</strong> - Block IPs within 5 failed attempts
              </p>
              <p style={{ marginBottom: "12px" }}>
                📊 <strong>Monitor logs</strong> - Real-time attack detection
              </p>
              <p style={{ marginBottom: "12px" }}>
                🔐 <strong>Strong passwords</strong> - Enforce complexity requirements
              </p>
              <p>
                🚫 <strong>IP blocking</strong> - Prevent further attacks from sources
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSecurityLab;
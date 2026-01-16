// frontend/src/pages/user/labs/WebSecurityLab.jsx
import { useState } from "react";
import { Globe, Shield, AlertTriangle, CheckCircle, Bug } from "lucide-react";

const WebSecurityLab = ({ lab, attempt, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [exploitAttempted, setExploitAttempted] = useState(false);
  const [userAnalysis, setUserAnalysis] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [hasError, setHasError] = useState(false);

  const webScenarios = [
    {
      id: 1,
      title: "XSS Attack Detection",
      description: "Find Cross-Site Scripting vulnerabilities",
      vulnerableCode: `<div id="user-profile" onclick="alert('XSS detected')">Welcome User!</div>`,
      vulnerabilities: ["Reflected XSS", "DOM manipulation", "Client-side script injection"],
      hints: ["Check input sanitization", "Look for alert() calls", "Test with various payloads"]
    },
    {
      id: 2,
      title: "SQL Injection Prevention",
      description: "Identify and block SQL injection attacks",
      vulnerableQuery: "SELECT * FROM users WHERE id = '" + userInput + "'",
      vulnerabilities: ["Union-based SQLi", "Blind SQL injection", "Authentication bypass"],
      hints: ["Use parameterized queries", "Implement input validation", "Use prepared statements"]
    }
  ];

  const currentScenario = webScenarios[currentStep] || webScenarios[0];

  const handleVulnSelect = (vuln) => {
    if (vulnerabilities.includes(vuln)) {
      setVulnerabilities(vulnerabilities.filter(v => v !== vuln));
    } else {
      setVulnerabilities([...vulnerabilities, vuln]);
    }
  };

  const handleExploit = () => {
    setExploitAttempted(true);
  };

  const completeAnalysis = () => {
    const correctVulns = currentScenario.vulnerabilities.filter(vuln => 
      vulnerabilities.includes(vuln)
    ).length;
    const totalVulns = currentScenario.vulnerabilities.length;
    const exploitCorrect = exploitAttempted && currentScenario.id === 1;
    const accuracy = ((correctVulns + (exploitCorrect ? 10 : 0)) / (totalVulns + 10)) * 100;
    const finalScore = Math.round(accuracy);
    
    setScore(finalScore);
    setShowResults(true);
    
    onComplete({
      status: "completed",
      score: finalScore,
      timeTakenSeconds: 420, // 7 minutes
      evidenceSubmitted: [`Identified ${correctVulns}/${totalVulns} vulnerabilities`, exploitCorrect ? "Exploit attempted" : "No exploit"],
      mentorFeedback: finalScore >= 80 ? 
        ["Excellent web security skills!"] : 
        finalScore >= 60 ? 
        ["Good analysis, but practice secure coding"] :
        ["Need to study OWASP Top 10"]
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
            Web Security Analysis Complete!
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
        <Globe size={48} style={{ marginBottom: "16px" }} />
        <h1 style={{ margin: "0 0 8px", fontSize: "28px" }}>
          Web Security Lab
        </h1>
        <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
          Perform comprehensive vulnerability assessment of a web application
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        {/* Vulnerability Analysis Area */}
        <div style={{ 
          backgroundColor: "#ffffff", 
          padding: "24px", 
          borderRadius: "12px", 
          border: "1px solid #e5e7eb" 
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            {currentScenario.title}
          </h2>
          
          {/* Vulnerable Code Display */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              Vulnerable Application Code:
            </h3>
            <div style={{
              backgroundColor: "#1a1a1a",
              color: "#00ff00",
              padding: "20px",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "12px",
              overflow: "auto"
            }}>
              {currentScenario.vulnerableCode}
            </div>
          </div>

          {/* Vulnerability Selection */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              🐛 Select Security Vulnerabilities:
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {currentScenario.vulnerabilities.map((vuln, index) => (
                <div
                  key={index}
                  onClick={() => handleVulnSelect(vuln)}
                  style={{
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: vulnerabilities.includes(vuln) ? "#fee2e2" : "#ffffff",
                    transition: "all 0.2s ease"
                  }}
                >
                  {vulnerabilities.includes(vuln) ? "✓" : "○"} {vuln}
                </div>
              ))}
            </div>
          </div>

          {/* Exploit Interface */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              🚨 Test Exploit:
            </h3>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                Exploit Payload:
              </label>
              <input
                type="text"
                value={userAnalysis}
                onChange={(e) => setUserAnalysis(e.target.value)}
                placeholder="Enter XSS payload or SQL injection attempt..."
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "monospace"
                }}
              />
            </div>
            <button
              onClick={handleExploit}
              disabled={vulnerabilities.length === 0}
              style={{
                width: "100%",
                padding: "12px 20px",
                backgroundColor: vulnerabilities.length === 0 ? "#9ca3af" : "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: vulnerabilities.length === 0 ? "not-allowed" : "pointer"
              }}
            >
              {exploitAttempted ? "✓ Exploit Tested" : "🚨 Test Exploit"}
            </button>
          </div>

          {/* Analysis Input */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Security Analysis:
            </label>
            <textarea
              value={userAnalysis}
              onChange={(e) => setUserAnalysis(e.target.value)}
              placeholder="Document vulnerabilities and recommended fixes..."
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
            disabled={vulnerabilities.length === 0}
            style={{
              width: "100%",
              padding: "12px 20px",
              backgroundColor: vulnerabilities.length === 0 ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: vulnerabilities.length === 0 ? "not-allowed" : "pointer"
            }}
          >
            Submit Security Report
          </button>
        </div>

        {/* Sidebar */}
        <div>
          {/* OWASP Top 10 */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #e5e7eb",
            marginBottom: "20px"
          }}>
            <h3 style={{ color: "#1f2937", marginBottom: "16px" }}>🛡️ OWASP Top 10</h3>
            <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "12px" }}>
                <strong>A1: Injection</strong> - SQL, NoSQL, LDAP injection
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>A2: Broken Auth</strong> - Authentication, session management
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>A3: Sensitive Data</strong> - Information exposure
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>A4: XML External Entities</strong> - XML injection
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>A5: Broken Access</strong> - Authorization flaws
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>A6: Security Misconfig</strong> - Server configuration
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>A7: XSS</strong> - Cross-site scripting
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>A8: Insecure Deserialization</strong> - Object injection
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>A9: Vulnerable Components</strong> - Known issues
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>A10: Insufficient Logging</strong> - Audit trails
              </p>
            </div>
          </div>

          {/* Security Tips */}
          <div style={{ 
            backgroundColor: "#fef3c7", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #f59e0b" 
          }}>
            <h3 style={{ color: "#92400e", marginBottom: "16px" }}>🌐 Web Security Tips</h3>
            <div style={{ fontSize: "14px", color: "#92400e", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "12px" }}>
                🔍 <strong>Input validation</strong> - Never trust user input
              </p>
              <p style={{ marginBottom: "12px" }}>
                🛡️ <strong>Output encoding</strong> - Encode all responses
              </p>
              <p style={{ marginBottom: "12px" }}>
                📊 <strong>Parameterized queries</strong> - Use prepared statements
              </p>
              <p>
                🔒 <strong>Least privilege</strong> - Minimize permissions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSecurityLab;
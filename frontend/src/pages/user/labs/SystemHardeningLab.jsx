// frontend/src/pages/user/labs/SystemHardeningLab.jsx
import { useState } from "react";
import { Shield, Settings, CheckCircle, Lock } from "lucide-react";

const SystemHardeningLab = ({ lab, attempt, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSettings, setSelectedSettings] = useState([]);
  const [userAnalysis, setUserAnalysis] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const hardeningScenarios = [
    {
      id: 1,
      title: "Linux Security Configuration",
      description: "Secure Linux server against common vulnerabilities",
      currentSettings: {
        "SSH Port": "22 (Default - Change)",
        "Password Policy": "Permissive",
        "Firewall": "Disabled",
        "User Accounts": "5 Default Users",
        "File Permissions": "777 for All Files"
      },
      secureSettings: {
        "SSH Port": "2222",
        "Password Policy": "Complex (12+ chars, numbers, symbols)",
        "Firewall": "Enabled (Block All, Allow Specific)",
        "User Accounts": "Minimal (Required Only)",
        "File Permissions": "750 for Root, 644 for Others"
      },
      vulnerabilities: ["Default SSH port", "Weak password policy", "No firewall", "Excessive user accounts", "Permissive file permissions"],
      hints: ["Change default ports", "Implement strong passwords", "Enable firewall", "Remove unnecessary accounts", "Apply least privilege principle"]
    },
    {
      id: 2,
      title: "Windows Server Security",
      description: "Harden Windows server against attacks",
      currentSettings: {
        "Remote Desktop": "Enabled",
        "Admin Shares": "Everyone Full Access",
        "Windows Firewall": "Basic Profile",
        "User Account Control": "Standard Users",
        "Audit Policy": "No Auditing"
      },
      secureSettings: {
        "Remote Desktop": "Disabled",
        "Admin Shares": "Authenticated Users Only",
        "Windows Firewall": "Advanced Security",
        "User Account Control": "Limited Users + Admin Approval",
        "Audit Policy": "Full Auditing Enabled"
      },
      vulnerabilities: ["RDP enabled", "Unrestricted file sharing", "Basic firewall", "Weak user controls", "No audit trail"],
      hints: ["Disable RDP", "Restrict file sharing", "Configure advanced firewall", "Implement strong user policies", "Enable comprehensive auditing"]
    }
  ];

  const currentScenario = hardeningScenarios[currentStep] || hardeningScenarios[0];

  const handleSettingSelect = (setting) => {
    if (selectedSettings.includes(setting)) {
      setSelectedSettings(selectedSettings.filter(s => s !== setting));
    } else {
      setSelectedSettings([...selectedSettings, setting]);
    }
  };

  const completeAnalysis = () => {
    const correctSettings = currentScenario.secureSettings.filter(setting => 
      selectedSettings.includes(setting)
    ).length;
    const totalSettings = currentScenario.secureSettings.length;
    const accuracy = (correctSettings / totalSettings) * 100;
    const finalScore = Math.round(accuracy);
    
    setScore(finalScore);
    setShowResults(true);
    
    onComplete({
      status: "completed",
      score: finalScore,
      timeTakenSeconds: 480, // 8 minutes
      evidenceSubmitted: [`Secured ${correctSettings}/${totalSettings} settings`],
      mentorFeedback: finalScore >= 80 ? 
        ["Excellent system hardening!"] : 
        finalScore >= 60 ? 
        ["Good security configuration, review missed settings"] :
        ["Need to study security best practices"]
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
            System Hardening Complete!
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
            <h4 style={{ color: "#374151", marginBottom: "8px" }}>Settings Secured:</h4>
            <ul style={{ color: "#6b7280", lineHeight: "1.6" }}>
              {selectedSettings.map((setting, index) => (
                <li key={index} style={{ color: "#10b981" }}>✓ {setting}</li>
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
        <Shield size={48} style={{ marginBottom: "16px" }} />
        <h1 style={{ margin: "0 0 8px", fontSize: "28px" }}>
          System Hardening Lab
        </h1>
        <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
          Configure secure system settings and harden against attacks
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        {/* Configuration Area */}
        <div style={{ 
          backgroundColor: "#ffffff", 
          padding: "24px", 
          borderRadius: "12px", 
          border: "1px solid #e5e7eb" 
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            {currentScenario.title}
          </h2>
          
          {/* Current vs Secure Settings */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              Current Configuration (Insecure):
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {Object.entries(currentScenario.currentSettings).map(([key, value], index) => (
                <div key={index} style={{ 
                  padding: "8px", 
                  backgroundColor: "#fef2f2", 
                  borderRadius: "6px", 
                  border: "1px solid #ef4444",
                  marginBottom: "8px"
                }}>
                  <strong>{key}:</strong> {value}
                </div>
              ))}
            </div>
          </div>

          {/* Secure Settings Selection */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              Secure Configuration (Target):
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {Object.entries(currentScenario.secureSettings).map(([key, value], index) => (
                <div
                  key={index}
                  onClick={() => handleSettingSelect(key)}
                  style={{
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: selectedSettings.includes(key) ? "#dcfce7" : "#ffffff",
                    transition: "all 0.2s ease"
                  }}
                >
                  {selectedSettings.includes(key) ? "✓" : "○"} {key}: {value}
                </div>
              ))}
            </div>
          </div>

          {/* Vulnerability Selection */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              🔍 Select Security Vulnerabilities:
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {currentScenario.vulnerabilities.map((vuln, index) => (
                <div
                  key={index}
                  onClick={() => handleSettingSelect(vuln)}
                  style={{
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: selectedSettings.includes(vuln) ? "#dcfce7" : "#ffffff",
                    transition: "all 0.2s ease"
                  }}
                >
                  {selectedSettings.includes(vuln) ? "✓" : "○"} {vuln}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Input */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Security Analysis Report:
            </label>
            <textarea
              value={userAnalysis}
              onChange={(e) => setUserAnalysis(e.target.value)}
              placeholder="Document vulnerabilities found and security measures implemented..."
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
            disabled={selectedSettings.length === 0}
            style={{
              width: "100%",
              padding: "12px 20px",
              backgroundColor: selectedSettings.length === 0 ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: selectedSettings.length === 0 ? "not-allowed" : "pointer"
            }}
          >
            Apply Security Settings
          </button>
        </div>

        {/* Sidebar */}
        <div>
          {/* Vulnerability Info */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #e5e7eb",
            marginBottom: "20px"
          }}>
            <h3 style={{ color: "#1f2937", marginBottom: "16px" }}>🔍 Security Vulnerabilities</h3>
            <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
              {currentScenario.vulnerabilities.map((vuln, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  <strong>{index + 1}.</strong> {vuln}
                </div>
              ))}
            </div>
          </div>

          {/* Hardening Tips */}
          <div style={{ 
            backgroundColor: "#fef3c7", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #f59e0b" 
          }}>
            <h3 style={{ color: "#92400e", marginBottom: "16px" }}>🛡️ System Hardening Tips</h3>
            <div style={{ fontSize: "14px", color: "#92400e", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "12px" }}>
                🔐 <strong>Principle of least privilege</strong> - Grant minimum necessary permissions
              </p>
              <p style={{ marginBottom: "12px" }}>
                🛡️ <strong>Defense in depth</strong> - Multiple layers of security controls
              </p>
              <p style={{ marginBottom: "12px" }}>
                📊 <strong>Regular auditing</strong> - Monitor and log security events
              </p>
              <p style={{ marginBottom: "12px" }}>
                🔒 <strong>Secure defaults</strong> - Change all default passwords and settings
              </p>
              <p>
                🚫 <strong>Network segmentation</strong> - Isolate critical systems
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHardeningLab;
// frontend/src/pages/user/labs/DigitalForensicsLab.jsx
import { useState } from "react";
import { Search, CheckCircle, Monitor, Database } from "lucide-react";

const DigitalForensicsLab = ({ lab, attempt, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEvidence, setSelectedEvidence] = useState([]);
  const [userAnalysis, setUserAnalysis] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const forensicsScenarios = [
    {
      id: 1,
      title: "File System Analysis",
      description: "Analyze file system for unauthorized access",
      evidence: {
        "Modified Files": [
          { path: "/etc/passwd", modified: "2024-01-15 14:23:45", size: "2.1KB" },
          { path: "/home/user/.bashrc", modified: "2024-01-15 14:25:12", size: "1.5KB" },
          { path: "/var/log/auth.log", modified: "2024-01-15 14:30:00", size: "15.7KB" }
        ],
        "Network Connections": [
          { ip: "192.168.1.100", port: 22, timestamp: "2024-01-15 14:20:00", duration: "45 min" },
          { ip: "10.0.0.50", port: 443, timestamp: "2024-01-15 15:30:00", duration: "12 min" }
        ],
        "User Activity": [
          { user: "john_doe", login: "2024-01-15 08:00:00", logout: "2024-01-15 17:30:00" },
          { user: "jane_smith", login: "2024-01-15 09:15:00", commands: "sudo rm -rf /", logout: "2024-01-15 17:45:00" }
        ],
        "Suspicious Processes": [
          { pid: 1234, name: "malware.exe", cpu: "85%", memory: "120MB", user: "john_doe" },
          { pid: 5678, name: "keylogger.exe", cpu: "12%", memory: "8MB", user: "jane_smith" }
        ]
      },
      suspiciousIndicators: ["Unauthorized file access", "Unusual network connections", "Suspicious process activity", "Off-hours admin access"],
      hints: ["Check file timestamps", "Analyze network logs", "Look for privilege escalation", "Examine running processes"],
      tools: ["File analysis", "Network monitoring", "Process examination", "Log analysis"]
    },
    {
      id: 2,
      title: "Memory Dump Analysis",
      description: "Analyze memory dump for security artifacts",
      memoryDump: {
        file: "memory_dump.raw",
        size: "512MB",
        timestamp: "2024-01-15 16:45:00",
        processes: ["chrome.exe", "word.exe", "explorer.exe"],
        artifacts: ["Potential passwords in memory", "Encryption keys", "Malicious URLs"]
      },
      suspiciousIndicators: ["Unusual process termination", "Memory artifacts present", "Suspicious network activity"],
      hints: ["Look for strings", "Analyze process list", "Check for rootkits", "Examine memory regions"],
      tools: ["Volatility", "WinDbg", "Strings", "Hash analysis"]
    }
  ];

  const currentScenario = forensicsScenarios[currentStep] || forensicsScenarios[0];

  const handleEvidenceSelect = (evidence) => {
    if (selectedEvidence.includes(evidence)) {
      setSelectedEvidence(selectedEvidence.filter(e => e !== evidence));
    } else {
      setSelectedEvidence([...selectedEvidence, evidence]);
    }
  };

  const completeAnalysis = () => {
    const correctEvidence = currentScenario.suspiciousIndicators.filter(indicator => 
      selectedEvidence.includes(indicator)
    ).length;
    const totalEvidence = currentScenario.suspiciousIndicators.length;
    const accuracy = (correctEvidence / totalEvidence) * 100;
    const finalScore = Math.round(accuracy);
    
    setScore(finalScore);
    setShowResults(true);
    
    onComplete({
      status: "completed",
      score: finalScore,
      timeTakenSeconds: 600, // 10 minutes
      evidenceSubmitted: [`Identified ${correctEvidence}/${totalEvidence} suspicious indicators`],
      mentorFeedback: finalScore >= 80 ? 
        ["Excellent digital forensics!"] : 
        finalScore >= 60 ? 
        ["Good analysis, review forensics methodology"] :
        ["Need more practice with forensic tools"]
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
          <Search size={48} color="#10b981" style={{ marginBottom: "20px" }} />
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            Digital Forensics Complete!
          </h2>
          <div style={{ 
            backgroundColor: "#dcfce7", 
            padding: "20px", 
            borderRadius: "8px", 
            marginBottom: "20px" 
          }}>
            <h3 style={{ color: "#166534", marginBottom: "12px" }}>Forensics Score</h3>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#166534" }}>
              {score}%
            </div>
          </div>
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <h4 style={{ color: "#374151", marginBottom: "8px" }}>Evidence Collected:</h4>
            <ul style={{ color: "#6b7280", lineHeight: "1.6" }}>
              {selectedEvidence.map((evidence, index) => (
                <li key={index} style={{ color: "#10b981" }}>✓ {evidence}</li>
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
        <Monitor size={48} style={{ marginBottom: "16px" }} />
        <h1 style={{ margin: "0 0 8px", fontSize: "28px" }}>
          Digital Forensics Lab
        </h1>
        <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
          Analyze digital evidence and identify security artifacts
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        {/* Evidence Analysis Area */}
        <div style={{ 
          backgroundColor: "#ffffff", 
          padding: "24px", 
          borderRadius: "12px", 
          border: "1px solid #e5e7eb" 
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            {currentScenario.title}
          </h2>
          
          {/* Evidence Viewer */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              Digital Evidence Viewer
            </h3>
            <div style={{
              backgroundColor: "#1a1a1a",
              color: "#00ff00",
              padding: "20px",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "12px",
              height: "300px",
              overflow: "auto",
              marginBottom: "20px"
            }}>
              {currentScenario.id === 1 && (
                <div>
                  <div style={{ marginBottom: "12px", color: "#888" }}>
                    $ File System Analysis
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    Modified Files:
                  </div>
                  {currentScenario.evidence["Modified Files"].map((file, index) => (
                    <div key={index} style={{ marginBottom: "4px", fontSize: "11px" }}>
                      📄 {file.path} - {file.modified} ({file.size})
                    </div>
                  ))}
                  <div style={{ marginTop: "12px", color: "#888" }}>
                    Network Connections:
                  </div>
                  {currentScenario.evidence["Network Connections"].map((conn, index) => (
                    <div key={index} style={{ marginBottom: "4px", fontSize: "11px" }}>
                      🌐 {conn.ip}:{conn.port} - {conn.duration} ({conn.timestamp})
                    </div>
                  ))}
                </div>
              )}

              {currentScenario.id === 2 && (
                <div>
                  <div style={{ marginBottom: "12px", color: "#888" }}>
                    $ Memory Dump Analysis
                  </div>
                  <div style={{ marginBottom: "8px", fontSize: "11px" }}>
                    File: {currentScenario.memoryDump.file} ({currentScenario.memoryDump.size})
                  </div>
                  <div style={{ marginBottom: "8px", fontSize: "11px" }}>
                    Timestamp: {currentScenario.memoryDump.timestamp}
                  </div>
                  <div style={{ marginBottom: "8px", fontSize: "11px" }}>
                    Processes: {currentScenario.memoryDump.processes.join(", ")}
                  </div>
                  <div style={{ marginBottom: "8px", fontSize: "11px" }}>
                    Artifacts: {currentScenario.memoryDump.artifacts.join(", ")}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Evidence Selection */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              🔍 Select Suspicious Indicators:
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {currentScenario.suspiciousIndicators.map((indicator, index) => (
                <div
                  key={index}
                  onClick={() => handleEvidenceSelect(indicator)}
                  style={{
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: selectedEvidence.includes(indicator) ? "#dcfce7" : "#ffffff",
                    transition: "all 0.2s ease"
                  }}
                >
                  {selectedEvidence.includes(indicator) ? "✓" : "○"} {indicator}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Input */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Forensic Analysis Report:
            </label>
            <textarea
              value={userAnalysis}
              onChange={(e) => setUserAnalysis(e.target.value)}
              placeholder="Document your forensic findings and analysis..."
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
            disabled={selectedEvidence.length === 0}
            style={{
              width: "100%",
              padding: "12px 20px",
              backgroundColor: selectedEvidence.length === 0 ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: selectedEvidence.length === 0 ? "not-allowed" : "pointer"
            }}
          >
            Submit Forensic Report
          </button>
        </div>

        {/* Sidebar */}
        <div>
          {/* Forensic Tools */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #e5e7eb",
            marginBottom: "20px"
          }}>
            <h3 style={{ color: "#1f2937", marginBottom: "16px" }}>🔧 Forensic Tools</h3>
            <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
              {currentScenario.tools.map((tool, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  <strong>{index + 1}.</strong> {tool}
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Chain */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #e5e7eb" 
          }}>
            <h3 style={{ color: "#1f2937", marginBottom: "16px" }}>🔗 Evidence Chain</h3>
            <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "12px" }}>
                <strong>1. Collection:</strong> Secure evidence gathering
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>2. Preservation:</strong> Maintain evidence integrity
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>3. Analysis:</strong> Systematic examination
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>4. Documentation:</strong> Detailed logging
              </p>
              <p style={{ marginBottom: "12px" }}>
                <strong>5. Presentation:</strong> Clear reporting
              </p>
              <p>
                <strong>6. Chain of Custody:</strong> Maintain evidence trail
              </p>
            </div>
          </div>

          {/* Forensics Tips */}
          <div style={{ 
            backgroundColor: "#fef3c7", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #f59e0b" 
          }}>
            <h3 style={{ color: "#92400e", marginBottom: "16px" }}>🔍 Forensics Tips</h3>
            <div style={{ fontSize: "14px", color: "#92400e", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "12px" }}>
                🔒 <strong>Preserve evidence</strong> - Never modify original data
              </p>
              <p style={{ marginBottom: "12px" }}>
                📋 <strong>Document everything</strong> - Create detailed logs
              </p>
              <p style={{ marginBottom: "12px" }}>
                🔍 <strong>Systematic approach</strong> - Follow forensics methodology
              </p>
              <p>
                ⚖️ <strong>Legal compliance</strong> - Follow proper procedures
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalForensicsLab;
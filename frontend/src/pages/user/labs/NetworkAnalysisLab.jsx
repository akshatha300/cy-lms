// frontend/src/pages/user/labs/NetworkAnalysisLab.jsx
import { useState } from "react";
import { Globe, Activity, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";

const NetworkAnalysisLab = ({ lab, attempt, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnomalies, setSelectedAnomalies] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [userAnalysis, setUserAnalysis] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Simulated network traffic scenarios
  const networkScenarios = [
    {
      id: 1,
      title: "DDoS Attack Detection",
      description: "Analyze network traffic for Distributed Denial of Service attack",
      trafficData: [
        { time: "14:23:12", source: "192.168.1.100", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:13", source: "192.168.1.101", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:14", source: "192.168.1.102", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:15", source: "192.168.1.103", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:16", source: "192.168.1.104", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:17", source: "192.168.1.105", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:18", source: "192.168.1.106", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:19", source: "192.168.1.107", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:20", source: "192.168.1.108", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:21", source: "192.168.1.109", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:22", source: "192.168.1.110", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:23", source: "192.168.1.111", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:24", source: "192.168.1.112", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:25", source: "192.168.1.113", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:26", source: "192.168.1.114", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:27", source: "192.168.1.115", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:28", source: "192.168.1.116", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:29", source: "192.168.1.117", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:30", source: "192.168.1.118", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:31", source: "192.168.1.119", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 },
        { time: "14:23:32", source: "192.168.1.120", dest: "10.0.0.5", protocol: "TCP", port: 80, bytes: 1024 }
      ],
      anomalies: ["Unusual traffic spike", "Multiple source IPs", "High connection count", "Same destination"],
      normalBaseline: 50, // connections per minute
      threatLevel: "High"
    },
    {
      id: 2,
      title: "Data Exfiltration Detection",
      description: "Identify suspicious data transfer patterns",
      trafficData: [
        { time: "09:15:45", source: "10.0.1.50", dest: "203.0.113.7", protocol: "TCP", port: 443, bytes: 5120 },
        { time: "09:15:50", source: "10.0.1.50", dest: "203.0.113.7", protocol: "TCP", port: 443, bytes: 2048 },
        { time: "09:15:55", source: "10.0.1.50", dest: "203.0.113.7", protocol: "TCP", port: 443, bytes: 8192 },
        { time: "09:16:00", source: "10.0.1.50", dest: "203.0.113.7", protocol: "TCP", port: 443, bytes: 4096 },
        { time: "09:16:05", source: "10.0.1.50", dest: "203.0.113.7", protocol: "TCP", port: 443, bytes: 1024 },
        { time: "09:16:10", source: "10.0.1.50", dest: "203.0.113.7", protocol: "TCP", port: 443, bytes: 512 },
        { time: "09:16:15", source: "10.0.1.50", dest: "203.0.113.7", protocol: "TCP", port: 443, bytes: 256 }
      ],
      anomalies: ["Unusual destination", "Large data transfers", "Off-hours activity", "Encrypted traffic"],
      normalBaseline: 100, // bytes per minute
      threatLevel: "Critical"
    }
  ];

  const currentScenario = networkScenarios[currentStep] || networkScenarios[0];

  const handleAnomalySelect = (anomaly) => {
    if (selectedAnomalies.includes(anomaly)) {
      setSelectedAnomalies(selectedAnomalies.filter(a => a !== anomaly));
    } else {
      setSelectedAnomalies([...selectedAnomalies, anomaly]);
    }
  };

  const generateAlert = (anomaly) => {
    const newAlert = {
      id: Date.now(),
      type: "THREAT",
      message: `Suspicious activity detected: ${anomaly}`,
      severity: selectedAnomalies.includes(anomaly) ? "INFO" : "CRITICAL",
      timestamp: new Date().toLocaleTimeString()
    };
    setAlerts([...alerts, newAlert]);
  };

  const completeAnalysis = () => {
    const correctAnomalies = currentScenario.anomalies.filter(anomaly => 
      selectedAnomalies.includes(anomaly)
    ).length;
    const totalAnomalies = currentScenario.anomalies.length;
    const alertsGenerated = selectedAnomalies.length;
    const accuracy = ((correctAnomalies + (alertsGenerated > 0 ? 15 : 0)) / (totalAnomalies + 15)) * 100;
    const finalScore = Math.round(accuracy);
    
    setScore(finalScore);
    setShowResults(true);
    
    onComplete({
      status: "completed",
      score: finalScore,
      timeTakenSeconds: 480, // 8 minutes
      evidenceSubmitted: [`Identified ${correctAnomalies}/${totalAnomalies} anomalies`, `Generated ${alertsGenerated} alerts`],
      mentorFeedback: finalScore >= 80 ? 
        ["Excellent network analysis!"] : 
        finalScore >= 60 ? 
        ["Good detection, but improve response time"] :
        ["Need better pattern recognition"]
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
            Network Analysis Complete!
          </h2>
          <div style={{ 
            backgroundColor: "#dcfce7", 
            padding: "20px", 
            borderRadius: "8px", 
            marginBottom: "20px" 
          }}>
            <h3 style={{ color: "#166534", marginBottom: "12px" }}>Analysis Score</h3>
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
          Network Traffic Analysis Lab
        </h1>
        <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
          Analyze network traffic and detect port scanning activity
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        {/* Traffic Analysis Area */}
        <div style={{ 
          backgroundColor: "#ffffff", 
          padding: "24px", 
          borderRadius: "12px", 
          border: "1px solid #e5e7eb" 
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            {currentScenario.title}
          </h2>
          
          {/* Traffic Visualization */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>Live Traffic Feed</h3>
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
                $ tcpdump -i eth0 -n
              </div>
              {currentScenario.trafficData.map((packet, index) => (
                <div key={index} style={{ marginBottom: "2px", fontSize: "11px" }}>
                  <span style={{ color: "#60a5fa" }}>
                    {packet.time} {packet.protocol} {packet.source}:{packet.port}  {packet.dest}:{packet.port} [{packet.bytes}B]
                  </span>
                  {index % 5 === 0 && (
                    <span style={{ color: "#ef4444", fontWeight: "bold" }}>
                      ⚠️ UNUSUAL TRAFFIC SPIKE
                    </span>
                  )}
                </div>
              ))}
              <div style={{ marginTop: "12px", color: "#888" }}>
                $ Analyzing patterns...
              </div>
            </div>
          </div>

          {/* Anomaly Detection */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              🚨 Select Network Anomalies:
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {currentScenario.anomalies.map((anomaly, index) => (
                <div
                  key={index}
                  onClick={() => handleAnomalySelect(anomaly)}
                  style={{
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: selectedAnomalies.includes(anomaly) ? "#fee2e2" : "#ffffff",
                    transition: "all 0.2s ease"
                  }}
                >
                  {selectedAnomalies.includes(anomaly) ? "✓" : "○"} {anomaly}
                </div>
              ))}
            </div>
          </div>

          {/* Alert Generation */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              🚨 Generate Security Alerts:
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {currentScenario.anomalies.map((anomaly, index) => (
                <div key={index}>
                  <button
                    onClick={() => generateAlert(anomaly)}
                    disabled={!selectedAnomalies.includes(anomaly)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: !selectedAnomalies.includes(anomaly) ? "#9ca3af" : "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      cursor: !selectedAnomalies.includes(anomaly) ? "pointer" : "not-allowed"
                    }}
                  >
                    {selectedAnomalies.includes(anomaly) ? "✓ Alerted" : "🚨 Generate Alert"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Input */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Network Analysis Report:
            </label>
            <textarea
              value={userAnalysis}
              onChange={(e) => setUserAnalysis(e.target.value)}
              placeholder="Document your findings and recommended actions..."
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
            disabled={selectedAnomalies.length === 0}
            style={{
              width: "100%",
              padding: "12px 20px",
              backgroundColor: selectedAnomalies.length === 0 ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: selectedAnomalies.length === 0 ? "not-allowed" : "pointer"
            }}
          >
            Submit Analysis
          </button>
        </div>

        {/* Sidebar */}
        <div>
          {/* Alert Monitor */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #e5e7eb",
            marginBottom: "20px"
          }}>
            <h3 style={{ color: "#1f2937", marginBottom: "16px" }}>🚨 Security Alerts</h3>
            <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6", maxHeight: "200px", overflow: "auto" }}>
              {alerts.length === 0 ? (
                <div style={{ color: "#9ca3af", fontStyle: "italic" }}>No alerts generated</div>
              ) : (
                alerts.map((alert, index) => (
                  <div
                    key={alert.id}
                    style={{
                      padding: "8px",
                      marginBottom: "8px",
                      borderRadius: "6px",
                      backgroundColor: alert.severity === "CRITICAL" ? "#fef2f2" : "#dbeafe",
                      border: `1px solid ${alert.severity === "CRITICAL" ? "#ef4444" : "#3b82f6"}`
                    }}
                  >
                    <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                      [{alert.timestamp}] {alert.type}
                    </div>
                    <div>{alert.message}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Network Stats */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #e5e7eb" 
          }}>
            <h3 style={{ color: "#1f2937", marginBottom: "16px" }}>📊 Traffic Statistics</h3>
            <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "12px" }}>
                <strong>Baseline:</strong> {currentScenario.normalBaseline} connections/min
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Current:</strong> {currentScenario.trafficData.length} connections/min
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Threat Level:</strong> 
                <span style={{ 
                  color: currentScenario.threatLevel === "Critical" ? "#ef4444" : 
                         currentScenario.threatLevel === "High" ? "#f59e0b" : "#10b981",
                  fontWeight: "bold"
                }}>
                  {currentScenario.threatLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Analysis Tips */}
          <div style={{ 
            backgroundColor: "#fef3c7", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #f59e0b" 
          }}>
            <h3 style={{ color: "#92400e", marginBottom: "16px" }}>🌐 Network Analysis Tips</h3>
            <div style={{ fontSize: "14px", color: "#92400e", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "12px" }}>
                📈 <strong>Monitor baselines</strong> - Know your normal traffic patterns
              </p>
              <p style={{ marginBottom: "12px" }}>
                🔍 <strong>Look for anomalies</strong> - Spikes, unusual destinations
              </p>
              <p style={{ marginBottom: "12px" }}>
                ⏰ <strong>Time-based analysis</strong> - Check off-hours activity
              </p>
              <p>
                🚨 <strong>Alert quickly</strong> - Real-time threat response
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkAnalysisLab;
// frontend/src/pages/user/labs/PhishingDetectionLab.jsx
import { useState } from "react";
import { Mail, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const PhishingDetectionLab = ({ lab, attempt, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [userAnalysis, setUserAnalysis] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Real phishing email scenarios
  const emailScenarios = [
    {
      id: 1,
      from: "security@microsoft.com",
      subject: "Suspicious Sign-In Activity",
      body: `We noticed unusual activity on your account. Someone tried to access your Microsoft account from a new device.

Location: Lagos, Nigeria
Device: Unknown Android device
IP Address: 192.168.1.100

If this wasn't you, please verify your identity immediately:
https://bit.ly/microsoft-security-verify

Failure to verify within 24 hours will result in permanent account suspension.

Microsoft Security Team`,
      correctIndicators: ["Bit.ly link", "Urgency tactics", "Generic greeting", "Foreign location"],
      suspiciousElements: ["Unknown device", "Nigeria location", "Shortened URL"]
    },
    {
      id: 2,
      from: "support@amazon.com",
      subject: "Order #AMZ-784291 - Action Required",
      body: `Dear Customer,

Your recent order could not be delivered due to payment verification issues.

Order Details:
- Item: iPhone 15 Pro Max
- Amount: $1,299.99
- Tracking: AMZ784291

To confirm delivery, please verify your payment information:
https://tinyurl.com/amz-payment-confirm

Your package will be shipped after verification.

Amazon Customer Service`,
      correctIndicators: ["TinyURL", "Payment verification request", "High-value item", "Generic greeting"],
      suspiciousElements: ["Unsolicited order", "TinyURL link", "Payment urgency"]
    }
  ];

  const currentEmail = emailScenarios[currentStep] || emailScenarios[0];

  const handleIndicatorSelect = (indicator) => {
    if (selectedIndicators.includes(indicator)) {
      setSelectedIndicators(selectedIndicators.filter(i => i !== indicator));
    } else {
      setSelectedIndicators([...selectedIndicators, indicator]);
    }
  };

  const completeAnalysis = () => {
    const correctSelected = selectedIndicators.filter(i => 
      currentEmail.correctIndicators.includes(i)
    ).length;
    const totalCorrect = currentEmail.correctIndicators.length;
    const accuracy = (correctSelected / totalCorrect) * 100;
    const finalScore = Math.round(accuracy);
    
    setScore(finalScore);
    setShowResults(true);
    
    onComplete({
      status: "completed",
      score: finalScore,
      timeTakenSeconds: 300, // 5 minutes
      evidenceSubmitted: [`Identified ${correctSelected}/${totalCorrect} indicators`],
      mentorFeedback: finalScore >= 80 ? 
        ["Excellent phishing detection skills!"] : 
        finalScore >= 60 ? 
        ["Good analysis, but review missed indicators"] :
        ["Need more practice on email security"]
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
          <CheckCircle size={48} color="#10b981" style={{ marginBottom: "20px" }} />
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            Phishing Analysis Complete!
          </h2>
          <div style={{ 
            backgroundColor: "#dcfce7", 
            padding: "20px", 
            borderRadius: "8px", 
            marginBottom: "20px" 
          }}>
            <h3 style={{ color: "#166534", marginBottom: "12px" }}>Your Score</h3>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#166534" }}>
              {score}%
            </div>
          </div>
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <h4 style={{ color: "#374151", marginBottom: "8px" }}>Correct Indicators Found:</h4>
            <ul style={{ color: "#6b7280", lineHeight: "1.6" }}>
              {selectedIndicators.filter(i => currentEmail.correctIndicators.includes(i)).map((indicator, index) => (
                <li key={index} style={{ color: "#10b981" }}>✓ {indicator}</li>
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
        textAlign: "center"
      }}>
        <Mail size={48} style={{ marginBottom: "16px" }} />
        <h1 style={{ margin: "0 0 8px", fontSize: "28px" }}>
          Phishing Email Detection Lab
        </h1>
        <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
          Analyze suspicious emails and identify phishing indicators
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        {/* Email Analysis Area */}
        <div style={{ 
          backgroundColor: "#ffffff", 
          padding: "24px", 
          borderRadius: "12px", 
          border: "1px solid #e5e7eb" 
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            Email Scenario {currentStep + 1}
          </h2>
          
          {/* Email Display */}
          <div style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
            fontFamily: "monospace",
            fontSize: "12px"
          }}>
            <div style={{ marginBottom: "12px", fontWeight: "bold", color: "#dc2626" }}>
              From: {currentEmail.from}
            </div>
            <div style={{ marginBottom: "12px", fontWeight: "bold", color: "#2563eb" }}>
              Subject: {currentEmail.subject}
            </div>
            <div style={{ whiteSpace: "pre-line", color: "#374151" }}>
              {currentEmail.body}
            </div>
          </div>

          {/* Indicator Selection */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
              Select All Phishing Indicators You Notice:
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                ...currentEmail.correctIndicators,
                ...currentEmail.suspiciousElements
              ].map((indicator, index) => (
                <div
                  key={index}
                  onClick={() => handleIndicatorSelect(indicator)}
                  style={{
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: selectedIndicators.includes(indicator) ? "#dbeafe" : "#ffffff",
                    color: selectedIndicators.includes(indicator) ? "#1e40af" : "#374151",
                    transition: "all 0.2s ease"
                  }}
                >
                  {selectedIndicators.includes(indicator) ? "✓" : "○"} {indicator}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Input */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Your Analysis:
            </label>
            <textarea
              value={userAnalysis}
              onChange={(e) => setUserAnalysis(e.target.value)}
              placeholder="Explain why this email is suspicious or legitimate..."
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
            disabled={selectedIndicators.length === 0}
            style={{
              width: "100%",
              padding: "12px 20px",
              backgroundColor: selectedIndicators.length === 0 ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: selectedIndicators.length === 0 ? "not-allowed" : "pointer"
            }}
          >
            Submit Analysis
          </button>
        </div>

        {/* Sidebar */}
        <div>
          {/* Progress */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #e5e7eb",
            marginBottom: "20px"
          }}>
            <h3 style={{ color: "#1f2937", marginBottom: "16px" }}>Progress</h3>
            <div style={{ marginBottom: "16px" }}>
              {emailScenarios.map((_, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px",
                    marginBottom: "8px",
                    borderRadius: "6px",
                    backgroundColor: index <= currentStep ? "#dcfce7" : "#f3f4f6",
                    color: index <= currentStep ? "#166534" : "#6b7280"
                  }}
                >
                  {index <= currentStep ? (
                    <CheckCircle size={16} style={{ marginRight: "8px" }} />
                  ) : (
                    <div style={{ 
                      width: "16px", 
                      height: "16px", 
                      borderRadius: "50%", 
                      border: "2px solid #d1d5db",
                      marginRight: "8px" 
                    }} />
                  )}
                  <span>Email {index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div style={{ 
            backgroundColor: "#fef3c7", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #f59e0b" 
          }}>
            <h3 style={{ color: "#92400e", marginBottom: "16px" }}>🔍 Phishing Tips</h3>
            <div style={{ fontSize: "14px", color: "#92400e", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "12px" }}>
                💡 <strong>Check sender domain</strong> - Verify official domains
              </p>
              <p style={{ marginBottom: "12px" }}>
                🔗 <strong>Hover over links</strong> - Don't click, check destination
              </p>
              <p style={{ marginBottom: "12px" }}>
                ⏰ <strong>Urgency is suspicious</strong> - Scammers create false deadlines
              </p>
              <p>
                📧 <strong>Grammar matters</strong> - Professional companies have proofreaders
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhishingDetectionLab;
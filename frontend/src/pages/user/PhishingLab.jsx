import { useState } from "react";
import { AlertCircle, CheckCircle, XCircle, Mail, Shield, Eye } from "lucide-react";

const PhishingLab = ({ onComplete, onCancel }) => {
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Sample phishing email content
  const emailContent = {
    from: "security@paypal.com",
    subject: "URGENT: Your Account Has Been Limited",
    body: `Dear Customer,

Your PayPal account has been temporarily limited due to suspicious activity.

To restore your account, please click here immediately:
http://bit.ly/secure-paypal-login-verify

You must verify your identity within 24 hours or your account will be permanently closed.

Required information:
- Full name
- Credit card number
- CVV code
- Social Security number

Thank you for your cooperation.
PayPal Security Team`,
  };

  // Correct phishing indicators
  const correctIndicators = [
    "Suspicious link (bit.ly shortener)",
    "Urgency/threats (24 hours)",
    "Requests sensitive info (SSN, CVV)",
    "Generic greeting (Dear Customer)",
    "Grammar errors",
  ];

  // All possible indicators (some correct, some distractors)
  const allIndicators = [
    ...correctIndicators,
    "Professional signature",
    "Security-related subject",
    "PayPal branding mentioned",
    "Multiple paragraphs",
  ];

  const handleIndicatorToggle = (indicator) => {
    setSelectedIndicators(prev => 
      prev.includes(indicator)
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  const handleSubmit = () => {
    const correct = selectedIndicators.filter(ind => 
      correctIndicators.includes(ind)
    ).length;
    
    const incorrect = selectedIndicators.length - correct;
    const finalScore = Math.max(0, (correct * 20) - (incorrect * 5));
    
    setScore(finalScore);
    setShowResults(true);
  };

  const handleComplete = () => {
    onComplete({
      status: score >= 60 ? "success" : score >= 30 ? "partial" : "failed",
      score: score,
      timeTakenSeconds: 300, // 5 minutes
    });
  };

  if (showResults) {
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
          <h2 style={{ margin: "0 0 16px", fontSize: "1.5rem", fontWeight: "bold" }}>
            Lab Results
          </h2>
          
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: score >= 60 ? "#10b981" : score >= 30 ? "#f59e0b" : "#ef4444" }}>
              Score: {score}/100
            </div>
            <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
              {score >= 60 ? "Excellent! You identified most phishing indicators." :
               score >= 30 ? "Good job! You found some indicators." :
               "Keep learning! Review the correct indicators below."}
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 12px", fontWeight: "600" }}>Correct Indicators:</h3>
            {correctIndicators.map((indicator, index) => (
              <div key={index} style={{ 
                display: "flex", 
                alignItems: "center", 
                marginBottom: "8px",
                padding: "8px 12px",
                backgroundColor: "#10b98120",
                borderRadius: "8px",
                color: "#10b981"
              }}>
                <CheckCircle size={16} style={{ marginRight: "8px" }} />
                {indicator}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 12px", fontWeight: "600" }}>Your Selections:</h3>
            {selectedIndicators.map((indicator, index) => {
              const isCorrect = correctIndicators.includes(indicator);
              return (
                <div key={index} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  marginBottom: "8px",
                  padding: "8px 12px",
                  backgroundColor: isCorrect ? "#10b98120" : "#ef444420",
                  borderRadius: "8px",
                  color: isCorrect ? "#10b981" : "#ef4444"
                }}>
                  {isCorrect ? <CheckCircle size={16} style={{ marginRight: "8px" }} /> : <XCircle size={16} style={{ marginRight: "8px" }} />}
                  {indicator}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleComplete}
              style={{
                flex: 1,
                padding: "12px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Complete Lab
            </button>
            <button
              onClick={() => {
                setShowResults(false);
                setSelectedIndicators([]);
              }}
              style={{
                padding: "12px 16px",
                backgroundColor: "transparent",
                color: "#6b7280",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <Mail size={24} color="#3b82f6" style={{ marginRight: "12px" }} />
          <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
            Identify Phishing Indicators
          </h2>
        </div>

        <div style={{ 
          backgroundColor: "#fef3c7", 
          border: "1px solid #fbbf24", 
          borderRadius: "8px", 
          padding: "16px", 
          marginBottom: "20px" 
        }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <AlertCircle size={20} color="#f59e0b" style={{ marginRight: "8px" }} />
            <strong style={{ color: "#92400e" }}>Objective:</strong>
          </div>
          <p style={{ margin: 0, color: "#92400e" }}>
            Identify at least 3 phishing indicators in the email below. Select all suspicious elements you notice.
          </p>
        </div>

        {/* Email Display */}
        <div style={{
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "24px",
          fontFamily: "monospace",
          fontSize: "0.9rem"
        }}>
          <div style={{ marginBottom: "12px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
            <div><strong>From:</strong> {emailContent.from}</div>
            <div><strong>Subject:</strong> {emailContent.subject}</div>
          </div>
          <div style={{ whiteSpace: "pre-line", lineHeight: "1.5" }}>
            {emailContent.body}
          </div>
        </div>

        {/* Indicator Selection */}
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 16px", fontWeight: "600" }}>
            <Eye size={20} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Select Phishing Indicators:
          </h3>
          <div style={{ display: "grid", gap: "8px" }}>
            {allIndicators.map((indicator, index) => (
              <label
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px",
                  backgroundColor: selectedIndicators.includes(indicator) ? "#dbeafe" : "#f9fafb",
                  border: `2px solid ${selectedIndicators.includes(indicator) ? "#3b82f6" : "#e5e7eb"}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedIndicators.includes(indicator)}
                  onChange={() => handleIndicatorToggle(indicator)}
                  style={{ marginRight: "12px" }}
                />
                <span style={{ fontSize: "0.9rem" }}>{indicator}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleSubmit}
            disabled={selectedIndicators.length === 0}
            style={{
              flex: 1,
              padding: "12px 16px",
              backgroundColor: selectedIndicators.length === 0 ? "#d1d5db" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: selectedIndicators.length === 0 ? "not-allowed" : "pointer",
              fontWeight: "600",
            }}
          >
            Submit Answer ({selectedIndicators.length} selected)
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: "12px 16px",
              backgroundColor: "transparent",
              color: "#6b7280",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhishingLab;
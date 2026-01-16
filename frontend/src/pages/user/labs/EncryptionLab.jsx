// frontend/src/pages/user/labs/EncryptionLab.jsx
import { useState } from "react";
import { Shield, Lock, Key, CheckCircle } from "lucide-react";

const EncryptionLab = ({ lab, attempt, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [userKey, setUserKey] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Encryption scenarios
  const encryptionScenarios = [
    {
      id: 1,
      title: "Caesar Cipher Decryption",
      description: "Break simple substitution cipher",
      originalMessage: "MEET ME AT MIDNIGHT",
      encryptedText: "PHHW PH DIWHU WKHUN",
      shift: 5,
      hints: ["Look for common letters", "Try frequency analysis", "Check for patterns"]
    },
    {
      id: 2,
      title: "AES Key Recovery",
      description: "Find missing AES encryption key",
      encryptedData: "U2FsdGVkZW1uZXJzYW5nZW5zIG9maWQgZGF0YSBhcGlv",
      partialKey: "SECURE_",
      hints: ["Key is 16 characters", "Contains common word", "Mixed case and numbers"]
    }
  ];

  const currentScenario = encryptionScenarios[currentStep] || encryptionScenarios[0];

  const handleDecrypt = () => {
    // Simple Caesar cipher decryption
    if (currentScenario.id === 1) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const shift = currentScenario.shift;
      let decrypted = "";
      
      for (let char of currentScenario.encryptedText) {
        if (alphabet.includes(char.toUpperCase())) {
          const index = alphabet.indexOf(char.toUpperCase());
          const newIndex = (index - shift + 26) % 26;
          decrypted += alphabet[newIndex];
        } else {
          decrypted += char;
        }
      }
      
      setDecryptedMessage(decrypted);
    }
  };

  const completeAnalysis = () => {
    let finalScore = 0;
    
    if (currentScenario.id === 1) {
      // Caesar cipher scoring
      const isCorrect = decryptedMessage.toUpperCase() === currentScenario.originalMessage;
      finalScore = isCorrect ? 100 : 0;
    } else if (currentScenario.id === 2) {
      // AES key scoring
      const isCorrect = userKey.includes(currentScenario.partialKey);
      finalScore = isCorrect ? 100 : 0;
    }
    
    setScore(finalScore);
    setShowResults(true);
    
    onComplete({
      status: "completed",
      score: finalScore,
      timeTakenSeconds: 360, // 6 minutes
      evidenceSubmitted: [`Decrypted message: ${finalScore > 0 ? "Successfully" : "Failed"}`],
      mentorFeedback: finalScore >= 80 ? 
        ["Excellent cryptography skills!"] : 
        finalScore >= 60 ? 
        ["Good attempt, review encryption concepts"] :
        ["Need to study cryptographic algorithms"]
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
          <Key size={48} color="#10b981" style={{ marginBottom: "20px" }} />
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            Cryptography Challenge Complete!
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
            <h4 style={{ color: "#374151", marginBottom: "8px" }}>Solution:</h4>
            <div style={{ 
              backgroundColor: "#f8fafc", 
              padding: "16px", 
              borderRadius: "8px", 
              fontFamily: "monospace",
              fontSize: "14px",
              color: "#1f2937"
            }}>
              {currentScenario.id === 1 && decryptedMessage || currentScenario.id === 2 && userKey}
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
        <Shield size={48} style={{ marginBottom: "16px" }} />
        <h1 style={{ margin: "0 0 8px", fontSize: "28px" }}>
          Encryption Lab
        </h1>
        <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
          Learn and practice encryption/decryption techniques
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        {/* Encryption Challenge Area */}
        <div style={{ 
          backgroundColor: "#ffffff", 
          padding: "24px", 
          borderRadius: "12px", 
          border: "1px solid #e5e7eb" 
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "16px" }}>
            {currentScenario.title}
          </h2>
          
          {/* Challenge Display */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ color: "#1f2937", marginBottom: "8px" }}>Challenge:</h3>
              <div style={{ 
                backgroundColor: "#f8fafc", 
                padding: "16px", 
                borderRadius: "8px", 
                fontFamily: "monospace",
                fontSize: "14px",
                color: "#1f2937"
              }}>
                <div style={{ marginBottom: "8px" }}>
                  <strong>Original:</strong> [HIDDEN]
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <strong>Encrypted:</strong> {currentScenario.encryptedText}
                </div>
              </div>
            </div>

            {currentScenario.id === 1 && (
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
                  Decryption Tool:
                </h3>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                    Shift Value (1-25):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value="5"
                    readOnly
                    style={{
                      width: "100px",
                      padding: "8px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "14px"
                    }}
                  />
                </div>
                <button
                  onClick={handleDecrypt}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  🔓 Decrypt Message
                </button>
              </div>
            )}

            {currentScenario.id === 1 && (
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
                  Decrypted Result:
                </h3>
                <textarea
                  value={decryptedMessage}
                  readOnly
                  placeholder="Decrypted message will appear here..."
                  style={{
                    width: "100%",
                    minHeight: "80px",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "monospace",
                    backgroundColor: decryptedMessage ? "#dcfce7" : "#ffffff"
                  }}
                />
              </div>
            )}

            {currentScenario.id === 2 && (
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>
                  Key Recovery:
                </h3>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                    Recovered Key:
                  </label>
                  <input
                    type="text"
                    value={userKey}
                    onChange={(e) => setUserKey(e.target.value)}
                    placeholder="Enter the missing encryption key..."
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
              </div>
            )}
          </div>

          {/* Hints */}
          <div style={{ 
            backgroundColor: "#fef3c7", 
            padding: "16px", 
            borderRadius: "8px", 
            border: "1px solid #f59e0b" 
          }}>
            <h3 style={{ color: "#92400e", marginBottom: "12px" }}>💡 Hints</h3>
            <div style={{ fontSize: "14px", color: "#92400e" }}>
              {currentScenario.hints.map((hint, index) => (
                <p key={index} style={{ marginBottom: "8px" }}>
                  {index + 1}. {hint}
                </p>
              ))}
            </div>
          </div>

          <button
            onClick={completeAnalysis}
            disabled={(currentScenario.id === 1 && !decryptedMessage) || (currentScenario.id === 2 && !userKey)}
            style={{
              width: "100%",
              padding: "12px 20px",
              backgroundColor: (currentScenario.id === 1 && !decryptedMessage) || (currentScenario.id === 2 && !userKey) ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: (currentScenario.id === 1 && !decryptedMessage) || (currentScenario.id === 2 && !userKey) ? "not-allowed" : "pointer"
            }}
          >
            Submit Solution
          </button>
        </div>

        {/* Sidebar */}
        <div>
          {/* Encryption Info */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #e5e7eb",
            marginBottom: "20px"
          }}>
            <h3 style={{ color: "#1f2937", marginBottom: "16px" }}>🔐 Encryption Info</h3>
            <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "12px" }}>
                <strong>Type:</strong> {currentScenario.id === 1 ? "Caesar Cipher" : "AES-256"}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Key Length:</strong> {currentScenario.id === 1 ? "Variable (1-25)" : "256 bits"}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Security Level:</strong> {currentScenario.id === 1 ? "Low (Educational)" : "High (Military Grade)"}
              </div>
            </div>
          </div>

          {/* Crypto Tips */}
          <div style={{ 
            backgroundColor: "#fef3c7", 
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid #f59e0b" 
          }}>
            <h3 style={{ color: "#92400e", marginBottom: "16px" }}>🔐 Cryptography Tips</h3>
            <div style={{ fontSize: "14px", color: "#92400e", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "12px" }}>
                🔢 <strong>Frequency analysis</strong> - Count letter occurrences
              </p>
              <p style={{ marginBottom: "12px" }}>
                🔑 <strong>Pattern recognition</strong> - Look for repeating sequences
              </p>
              <p style={{ marginBottom: "12px" }}>
                📊 <strong>Statistical methods</strong> - Use probability and analysis
              </p>
              <p>
                🔒 <strong>Modern encryption</strong> - AES is much stronger than Caesar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncryptionLab;
import { useState, useEffect, useRef } from "react";

const VoiceTutor = () => {
  const [isListening, setIsListening] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        console.log('Voice recognition started');
        setIsListening(true);
        setError("");
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('User said:', transcript);
        setQuestion(transcript);
        getAIResponse(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setError(`Error: ${event.error}`);
      };
      
      recognition.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
    }
  }, []);

  const startListening = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const getAIResponse = async (questionText) => {
    try {
      setAnswer("Thinking...");
      setError("");
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to use the voice tutor');
      }
      
      const response = await fetch('/api/enhanced-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: questionText,
          context: 'voice_tutor'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      const aiResponse = data.response || data.message || 'No response received';
      setAnswer(aiResponse);
      
      // Optional: Speak the response
      speakResponse(aiResponse);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      setError(`Error: ${error.message}`);
      setAnswer("");
    }
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      speechSynthesis.speak(utterance);
    } else {
      console.log('Speech synthesis not supported');
    }
  };

  const clearConversation = () => {
    setQuestion("");
    setAnswer("");
    setError("");
  };

  if (!isSupported) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2 style={{ color: "#ef4444", marginBottom: "20px" }}>Voice Tutor Not Supported</h2>
        <p style={{ color: "#6b7280", marginBottom: "20px" }}>
          Speech recognition is not supported in your browser. Please use Chrome or Edge for the best experience.
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "30px", color: "#1f2937", textAlign: "center" }}>
        🎤 AI Voice Tutor
      </h2>
      
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button
          onClick={startListening}
          style={{
            padding: "15px 30px",
            fontSize: "18px",
            backgroundColor: isListening ? "#ef4444" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "0 auto"
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        >
          {isListening ? "🛑 Stop Listening" : "🎤 Ask Question"}
        </button>
        
        {isListening && (
          <div style={{ marginTop: "10px", color: "#6b7280" }}>
            Listening... Speak clearly into your microphone
          </div>
        )}
      </div>

      <div style={{ 
        display: "grid", 
        gap: "20px", 
        gridTemplateColumns: "1fr 1fr",
        marginBottom: "20px"
      }}>
        <div style={{
          padding: "20px",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{ marginBottom: "10px", color: "#1f2937" }}>Your Question:</h3>
          <p style={{ 
            color: "#4b5563", 
            minHeight: "60px",
            fontStyle: question ? "normal" : "italic",
            opacity: question ? 1 : 0.6
          }}>
            {question || "Your question will appear here..."}
          </p>
        </div>

        <div style={{
          padding: "20px",
          backgroundColor: "#f0f9ff",
          borderRadius: "8px",
          border: "1px solid #bae6fd"
        }}>
          <h3 style={{ marginBottom: "10px", color: "#1f2937" }}>AI Response:</h3>
          <p style={{ 
            color: "#4b5563", 
            minHeight: "60px",
            fontStyle: answer ? "normal" : "italic",
            opacity: answer ? 1 : 0.6
          }}>
            {answer || "AI response will appear here..."}
          </p>
        </div>
      </div>

      {error && (
        <div style={{
          padding: "15px",
          backgroundColor: "#fef2f2",
          borderRadius: "8px",
          border: "1px solid #fecaca",
          color: "#dc2626",
          marginBottom: "20px"
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={clearConversation}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          Clear Conversation
        </button>
        
        <button
          onClick={() => window.history.back()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Back to Dashboard
        </button>
      </div>

      <div style={{
        marginTop: "30px",
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        border: "1px solid #e5e7eb"
      }}>
        <h4 style={{ marginBottom: "10px", color: "#1f2937" }}>How to Use:</h4>
        <ul style={{ color: "#6b7280", lineHeight: "1.6" }}>
          <li>Click the "Ask Question" button to start voice recognition</li>
          <li>Speak clearly into your microphone</li>
          <li>The AI will respond both with text and voice</li>
          <li>Make sure your browser has microphone permissions</li>
          <li>Works best in Chrome or Edge browsers</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceTutor;

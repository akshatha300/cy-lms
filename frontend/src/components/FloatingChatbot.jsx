import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Send, Loader2, Minimize2, Bot, User } from "lucide-react";
import { sendChatMessage, fetchChatHistory } from "../api/chatApi";
import useAuth from "../hooks/useAuth";

const FloatingChatbot = () => {
  console.log("🤖 FloatingChatbot rendering");
  
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hi${user?.name ? ` ${user.name}` : ""}! 👋 I'm your AIML AI tutor. Ask me anything about machine learning, deep learning, data science, or any topic from your modules!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Debug: Confirm component is mounting
  useEffect(() => {
    console.log("✅ FloatingChatbot mounted successfully");
    return () => console.log("❌ FloatingChatbot unmounted");
  }, []);

  // Load chat history when opened for the first time
  const loadHistory = useCallback(async () => {
    try {
      const data = await fetchChatHistory();
      if (Array.isArray(data.messages) && data.messages.length > 0) {
        const historyMessages = data.messages.map((m) => ({
          role: m.role,
          text: m.text,
        }));
        setMessages((prev) => [prev[0], ...historyMessages]);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 1) {
      loadHistory();
    }
  }, [isOpen, messages.length, loadHistory]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const content = input.trim();
    setInput("");

    const userMessage = { role: "user", text: content };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const conversationHistory = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role, text: m.text }));

      const response = await sendChatMessage(content, conversationHistory);

      const assistantMessage = {
        role: "assistant",
        text: response.reply || "I'm here to help! Could you rephrase that?",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I'm having trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    console.log("🔵 Rendering chat button (closed state)");
    return (
      <button
        onClick={() => {
          console.log("🎯 Chat button clicked!");
          setIsOpen(true);
        }}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          transform: "scale(1)",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = "0 12px 40px rgba(102, 126, 234, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 8px 32px rgba(102, 126, 234, 0.4)";
        }}
        aria-label="Open chat"
      >
        <MessageSquare style={{ width: "24px", height: "24px" }} />
      </button>
    );
  }

  console.log("🟢 Rendering chat window (open state)");
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: isMinimized ? "320px" : "420px",
        height: isMinimized ? "64px" : "640px",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "16px 16px 0 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <Bot style={{ width: "20px", height: "20px" }} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
              AIML Tutor
            </h3>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.9 }}>
              Always here to help
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              borderRadius: "8px",
              padding: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.2)";
            }}
            aria-label="Minimize"
          >
            <Minimize2 style={{ width: "16px", height: "16px" }} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              borderRadius: "8px",
              padding: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.2)";
            }}
            aria-label="Close chat"
          >
            <X style={{ width: "16px", height: "16px" }} />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              background: "linear-gradient(to bottom, #f8fafc, #f1f5f9)",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "12px 16px",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "white",
                    color: msg.role === "user" ? "white" : "#1f2937",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                  }}
                >
                  {msg.role === "assistant" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#6b7280",
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Bot style={{ width: "12px", height: "12px", color: "white" }} />
                      </div>
                      <span>AI Tutor</span>
                    </div>
                  )}
                  {msg.role === "user" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "rgba(255, 255, 255, 0.9)",
                        justifyContent: "flex-end",
                      }}
                    >
                      <span>You</span>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          background: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <User style={{ width: "12px", height: "12px", color: "white" }} />
                      </div>
                    </div>
                  )}
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "16px" }}>
                <div
                  style={{
                    background: "white",
                    borderRadius: "18px 18px 18px 4px",
                    padding: "12px 16px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Loader2 style={{ width: "16px", height: "16px", color: "#667eea", animation: "spin 1s linear infinite" }} />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "16px 20px",
              background: "white",
              borderTop: "1px solid #e5e7eb",
              borderRadius: "0 0 16px 16px",
            }}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about AIML..."
                disabled={loading}
                                style={{
                  flex: 1,
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.2s ease",
                  background: "#f9fafb",
                  color: "#1f2937",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.background = "white";
                  e.target.style.color = "#1f2937";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.background = "#f9fafb";
                  e.target.style.color = "#1f2937";
                }}
                // Add placeholder styling
                placeholderStyle={{ color: "#9ca3af" }}
                              
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                style={{
                  background: !input.trim() || loading 
                    ? "#e5e7eb" 
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Send message"
              >
                <Send style={{ width: "16px", height: "16px" }} />
              </button>
            </div>
            <p style={{ margin: "8px 0 0 0", fontSize: "11px", color: "#9ca3af", textAlign: "center" }}>
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FloatingChatbot;
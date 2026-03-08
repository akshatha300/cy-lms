import { useState, useEffect, useRef } from "react";
import { sendChatMessage } from "../api/chatApi";
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  BookOpen, 
  Code, 
  Brain, 
  Database,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2
} from "lucide-react";

const AIMLChatbot = ({ isOpen, onToggle, position = "bottom-right" }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "👋 Hi! I'm your AIML Learning Assistant! I can help you with:\n\n🧠 **Machine Learning Concepts**\n💻 **Code & Implementation**\n📊 **Data Analysis**\n🔍 **Problem Solving**\n\nWhat would you like to learn about today?",
      timestamp: new Date(),
      typing: false
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "Explain linear regression",
    "Show me a Python example",
    "What is overfitting?",
    "How to evaluate a model?"
  ]);
  const [currentCategory, setCurrentCategory] = useState("general");
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const categories = [
    { id: "general", name: "General", icon: Brain, color: "#3b82f6" },
    { id: "coding", name: "Coding Help", icon: Code, color: "#10b981" },
    { id: "theory", name: "Theory", icon: BookOpen, color: "#f59e0b" },
    { id: "data", name: "Data Science", icon: Database, color: "#8b5cf6" }
  ];

  const categorySuggestions = {
    general: [
      "What is machine learning?",
      "Explain deep learning",
      "Difference between AI and ML",
      "Career path in AIML"
    ],
    coding: [
      "Python for ML setup",
      "Debug my code",
      "Best practices",
      "Library recommendations"
    ],
    theory: [
      "Explain backpropagation",
      "Types of neural networks",
      "Loss functions",
      "Optimization algorithms"
    ],
    data: [
      "Data preprocessing steps",
      "Handle missing values",
      "Feature engineering",
      "Data visualization"
    ]
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date(),
      typing: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Add typing indicator
    const typingIndicator = {
      id: Date.now() + 1,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      typing: true
    };
    setMessages(prev => [...prev, typingIndicator]);

    try {
      const response = await sendChatMessage(input, messages.filter(m => !m.typing).map(m => m.content));
      
      // Remove typing indicator and add response
      setMessages(prev => {
        const filtered = prev.filter(m => !m.typing);
        return [...filtered, {
          id: Date.now() + 2,
          role: "assistant",
          content: response.reply || "I'm here to help with your AIML learning journey!",
          timestamp: new Date(),
          typing: false,
          difficulty: response.difficulty,
          sources: response.sources
        }];
      });
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        const filtered = prev.filter(m => !m.typing);
        return [...filtered, {
          id: Date.now() + 2,
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again!",
          timestamp: new Date(),
          typing: false
        }];
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const handleCategoryChange = (categoryId) => {
    setCurrentCategory(categoryId);
    setSuggestions(categorySuggestions[categoryId] || []);
  };

  const formatMessage = (content) => {
    // Convert markdown-like formatting to JSX
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={index} style={{ color: "#3b82f6" }}>{line.slice(2, -2)}</strong>;
      }
      if (line.startsWith('🧠') || line.startsWith('💻') || line.startsWith('📊') || line.startsWith('🔍')) {
        return <span key={index} style={{ display: "block", margin: "4px 0", color: "#10b981" }}>{line}</span>;
      }
      return line ? <span key={index} style={{ display: "block", margin: "2px 0" }}>{line}</span> : <br key={index} />;
    });
  };

  const getPositionStyles = () => {
    const baseStyles = {
      position: "fixed",
      zIndex: 1000,
      transition: "all 0.3s ease"
    };

    switch (position) {
      case "bottom-right":
        return {
          ...baseStyles,
          bottom: isMinimized ? "20px" : "80px",
          right: "20px",
          width: isMinimized ? "60px" : "380px",
          height: isMinimized ? "60px" : "600px"
        };
      case "bottom-left":
        return {
          ...baseStyles,
          bottom: isMinimized ? "20px" : "80px",
          left: "20px",
          width: isMinimized ? "60px" : "380px",
          height: isMinimized ? "60px" : "600px"
        };
      default:
        return baseStyles;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 25px rgba(59, 130, 246, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(59, 130, 246, 0.4)";
        }}
      >
        <Bot size={24} />
      </button>
    );
  }

  return (
    <div style={getPositionStyles()}>
      <div style={{
        height: "100%",
        backgroundColor: "#1f2937",
        borderRadius: isMinimized ? "50%" : "16px",
        border: "1px solid #374151",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: "#3b82f6",
          padding: isMinimized ? "15px" : "16px",
          borderRadius: isMinimized ? "50%" : "16px 16px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer"
        }}>
          {!isMinimized && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Bot size={20} />
                <div>
                  <div style={{ color: "#fff", fontWeight: "bold", fontSize: "14px" }}>
                    AIML Assistant
                  </div>
                  <div style={{ color: "#93c5fd", fontSize: "11px" }}>
                    {isTyping ? "Typing..." : "Always here to help"}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px",
                    cursor: "pointer",
                    color: "#fff"
                  }}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px",
                    cursor: "pointer",
                    color: "#fff"
                  }}
                >
                  ×
                </button>
              </div>
            </>
          )}
          {isMinimized && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
              <Bot size={24} />
            </div>
          )}
        </div>

        {!isMinimized && (
          <>
            {/* Categories */}
            <div style={{
              padding: "12px 16px",
              borderBottom: "1px solid #374151",
              backgroundColor: "#111827"
            }}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "6px 10px",
                        backgroundColor: currentCategory === category.id ? category.color : "#374151",
                        color: "#fff",
                        border: "none",
                        borderRadius: "20px",
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <Icon size={12} />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              backgroundColor: "#111827"
            }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: "16px",
                    display: "flex",
                    gap: "12px",
                    alignItems: message.typing ? "center" : "flex-start"
                  }}
                >
                  {message.role === "user" ? (
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#3b82f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <User size={16} color="#fff" />
                    </div>
                  ) : (
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#10b981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <Bot size={16} color="#fff" />
                    </div>
                  )}
                  
                  <div style={{ flex: 1 }}>
                    {message.typing ? (
                      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                        <div style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#10b981",
                          animation: "bounce 1.4s infinite"
                        }} />
                        <div style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#10b981",
                          animation: "bounce 1.4s infinite 0.2s"
                        }} />
                        <div style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#10b981",
                          animation: "bounce 1.4s infinite 0.4s"
                        }} />
                      </div>
                    ) : (
                      <div>
                        <div style={{
                          backgroundColor: message.role === "user" ? "#3b82f6" : "#1f2937",
                          color: "#fff",
                          padding: "12px 16px",
                          borderRadius: "12px",
                          fontSize: "14px",
                          lineHeight: "1.4",
                          maxWidth: "100%",
                          wordBreak: "break-word"
                        }}>
                          {formatMessage(message.content)}
                        </div>
                        
                        {/* Difficulty indicator */}
                        {message.difficulty && (
                          <div style={{
                            marginTop: "4px",
                            fontSize: "11px",
                            color: "#9ca3af"
                          }}>
                            Difficulty: {message.difficulty}
                          </div>
                        )}
                        
                        {/* Timestamp */}
                        <div style={{
                          marginTop: "4px",
                          fontSize: "10px",
                          color: "#6b7280"
                        }}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div style={{
                padding: "12px 16px",
                borderTop: "1px solid #374151",
                backgroundColor: "#111827"
              }}>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>
                  Suggested questions:
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {suggestions.slice(0, 2).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{
                        padding: "6px 10px",
                        backgroundColor: "#374151",
                        color: "#d1d5db",
                        border: "1px solid #4b5563",
                        borderRadius: "16px",
                        fontSize: "11px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#4b5563";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#374151";
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div style={{
              padding: "16px",
              borderTop: "1px solid #374151",
              backgroundColor: "#111827"
            }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about AIML..."
                  disabled={isTyping}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    backgroundColor: "#1f2937",
                    color: "#fff",
                    border: "1px solid #374151",
                    borderRadius: "24px",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    backgroundColor: input.trim() && !isTyping ? "#3b82f6" : "#374151",
                    color: "#fff",
                    border: "none",
                    cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AIMLChatbot;

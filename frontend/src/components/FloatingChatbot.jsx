import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Send, Loader2, Minimize2 } from "lucide-react";
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
      text: `Hi${user?.name ? ` ${user.name}` : ""}! 👋 I'm your cybersecurity AI tutor. Ask me anything about phishing, malware, network security, or any topic from your modules!`,
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
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2563eb 0%, #9333ea 100%)",
          color: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
      className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl z-[9999] transition-all duration-300 ${
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      } flex flex-col border border-gray-200`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">AI Cybersecurity Tutor</h3>
            <p className="text-xs text-blue-100">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-1.5 rounded-lg transition"
            aria-label="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1.5 rounded-lg transition"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">AI</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-600">
                        Tutor
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={loading}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FloatingChatbot;

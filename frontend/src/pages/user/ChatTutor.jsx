import { useState, useEffect, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import { sendChatMessage, fetchChatHistory } from "../../api/chatApi";

const ChatTutor = () => {
  const { user } = useAuth();

  const [messages, setMessages] = useState(() => [
    {
      role: "assistant",
      text: `Hi${
        user?.name ? ` ${user.name}` : ""
      }! I’m your cybersecurity tutor. Ask me about phishing, passwords, malware, or anything from your modules.`,
      meta: { difficulty: "medium" },
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  // Load existing chat history for this user on mount
  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      try {
        const data = await fetchChatHistory();
        if (!isMounted) return;

        if (Array.isArray(data.messages) && data.messages.length > 0) {
          const historyMessages = data.messages.map((m) => ({
            role: m.role,
            text: m.text,
            meta:
              m.role === "assistant"
                ? {
                    difficulty: "medium",
                  }
                : undefined,
          }));

          setMessages((prev) => {
            const [greeting, ..._rest] = prev;
            return [greeting, ...historyMessages];
          });
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const content = input.trim();
    setInput("");
    setError("");

    const userMessage = {
      role: "user",
      text: content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Build simple text history for backend (optional)
      const history = messages.map((m) => `${m.role}: ${m.text}`);
      const data = await sendChatMessage(content, history);

      // Debug: log what we received from backend
      console.log("=== FRONTEND: Received from backend ===");
      console.log("Full data object:", JSON.stringify(data, null, 2));
      console.log("Data.reply type:", typeof data.reply);
      console.log("Data.reply value:", data.reply);
      console.log("Data.reply length:", data.reply?.length);
      console.log("Data.reply === 'generated response':", data.reply === "generated response");
      
      // Validate and sanitize reply
      let replyText = data.reply;
      if (!replyText || typeof replyText !== 'string') {
        console.error("Invalid reply received:", replyText);
        replyText = "I received an invalid response. Please try again.";
      } else if (replyText.trim() === "" || replyText === "generated response") {
        console.error("Empty or placeholder reply detected:", replyText);
        replyText = "I'm having trouble generating a response. Please try rephrasing your question.";
      }

      const tutorMessage = {
        role: "assistant",
        text: replyText,
        meta: {
          difficulty: data.difficulty || "medium",
          sources: Array.isArray(data.sources) ? data.sources : [],
        },
      };
      
      console.log("Final tutorMessage.text:", tutorMessage.text);

      setMessages((prev) => [...prev, tutorMessage]);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Failed to contact tutor. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        color: "white",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2>Chat Tutor</h2>
      <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
        Ask questions about cybersecurity concepts. I’ll tailor answers to your
        level.
      </p>

      {/* Chat Window */}
      <div
        style={{
          flex: 1,
          border: "1px solid #444",
          padding: "10px",
          marginBottom: "10px",
          overflowY: "auto",
          backgroundColor: "#111",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "12px",
                backgroundColor: msg.role === "user" ? "#2563eb" : "#333",
                maxWidth: "70%",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </span>
            {msg.role === "assistant" && (
              <>
                {msg.meta?.difficulty && (
                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                    }}
                  >
                    Difficulty: {msg.meta.difficulty}
                  </div>
                )}
                {Array.isArray(msg.meta?.sources) && msg.meta.sources.length > 0 && (
                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                    }}
                  >
                    <div style={{ fontWeight: "600", marginBottom: "2px" }}>
                      Based on:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "16px" }}>
                      {msg.meta.sources.slice(0, 3).map((src, i) => (
                        <li key={i}>
                          {src.title || "Course material"}{" "}
                          {src.type ? `(${src.type})` : ""}{" "}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: "6px", fontSize: "0.85rem" }}>
          {error}
        </p>
      )}

      {/* Input */}
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            loading
              ? "Waiting for tutor response..."
              : "Type your question about cybersecurity..."
          }
          style={{
            width: "80%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #444",
            backgroundColor: "#000",
            color: "white",
          }}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            padding: "10px 16px",
            marginLeft: "8px",
            borderRadius: "6px",
            backgroundColor: loading ? "#4b5563" : "#2563eb",
            color: "white",
            border: "none",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatTutor;

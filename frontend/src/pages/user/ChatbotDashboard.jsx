import { useState, useEffect } from "react";
import { 
  getEnhancedChatHistory, 
  getChatCategories, 
  getChatAnalytics, 
  clearChatHistory, 
  exportChatHistory 
} from "../../api/enhancedChatApi";
import { 
  MessageSquare, 
  TrendingUp, 
  Download, 
  Trash2, 
  Calendar,
  BarChart3,
  Clock,
  User,
  Bot,
  Filter,
  FileText
} from "lucide-react";

const ChatbotDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("history");

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [historyData, categoriesData, analyticsData] = await Promise.all([
        getEnhancedChatHistory(50, selectedCategory),
        getChatCategories(),
        getChatAnalytics()
      ]);

      setSessions(historyData.sessions || []);
      setCategories(categoriesData.categories || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear your chat history? This action cannot be undone.")) {
      try {
        await clearChatHistory(selectedCategory);
        await loadData();
        alert("Chat history cleared successfully!");
      } catch (error) {
        console.error("Failed to clear history:", error);
        alert("Failed to clear chat history. Please try again.");
      }
    }
  };

  const handleExport = async (format) => {
    try {
      await exportChatHistory(format, selectedCategory);
      alert(`Chat history exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      console.error("Failed to export:", error);
      alert("Failed to export chat history. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getRoleIcon = (role) => {
    return role === "user" ? <User size={16} color="#3b82f6" /> : <Bot size={16} color="#10b981" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: "#3b82f6",
      coding: "#10b981",
      theory: "#f59e0b",
      data: "#8b5cf6"
    };
    return colors[category] || "#6b7280";
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", color: "#fff", textAlign: "center" }}>
        <div>Loading chat dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", color: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}>
          Chat Dashboard
        </h1>
        <p style={{ color: "#d1d5db", fontSize: "16px" }}>
          Manage your AIML learning conversations and track your progress
        </p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "20px", 
          marginBottom: "30px" 
        }}>
          <div style={{ backgroundColor: "#1f2937", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
            <MessageSquare size={32} color="#3b82f6" style={{ marginBottom: "10px" }} />
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
              {analytics.totalMessages}
            </div>
            <div style={{ fontSize: "14px", color: "#9ca3af" }}>Total Messages</div>
          </div>
          
          <div style={{ backgroundColor: "#1f2937", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
            <TrendingUp size={32} color="#10b981" style={{ marginBottom: "10px" }} />
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
              {analytics.sessionCount}
            </div>
            <div style={{ fontSize: "14px", color: "#9ca3af" }}>Chat Sessions</div>
          </div>
          
          <div style={{ backgroundColor: "#1f2937", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
            <BarChart3 size={32} color="#f59e0b" style={{ marginBottom: "10px" }} />
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
              {analytics.categoryCount}
            </div>
            <div style={{ fontSize: "14px", color: "#9ca3af" }}>Categories Used</div>
          </div>
          
          <div style={{ backgroundColor: "#1f2937", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
            <Clock size={32} color="#8b5cf6" style={{ marginBottom: "10px" }} />
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
              {analytics.avgMessagesPerSession}
            </div>
            <div style={{ fontSize: "14px", color: "#9ca3af" }}>Avg Messages/Session</div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "15px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Filter size={16} color="#9ca3af" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              backgroundColor: "#1f2937",
              color: "#fff",
              border: "1px solid #374151",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: "pointer"
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)} ({cat.messageCount})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => handleExport("json")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            <Download size={16} />
            Export JSON
          </button>
          
          <button
            onClick={() => handleExport("csv")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              backgroundColor: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            <FileText size={16} />
            Export CSV
          </button>
          
          <button
            onClick={handleClearHistory}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              backgroundColor: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            <Trash2 size={16} />
            Clear History
          </button>
        </div>
      </div>

      {/* Chat Sessions */}
      <div style={{ backgroundColor: "#1f2937", borderRadius: "12px", padding: "20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <MessageSquare size={20} />
          Chat Sessions
        </h2>

        {sessions.length > 0 ? (
          <div style={{ display: "grid", gap: "20px" }}>
            {sessions.map((session) => (
              <div
                key={session.id}
                style={{
                  backgroundColor: "#111827",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #374151"
                }}
              >
                {/* Session Header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Calendar size={16} color="#9ca3af" />
                    <span style={{ color: "#fff", fontWeight: "500" }}>
                      {session.date}
                    </span>
                    <span
                      style={{
                        padding: "4px 8px",
                        backgroundColor: getCategoryColor(session.category) + "20",
                        color: getCategoryColor(session.category),
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "bold"
                      }}
                    >
                      {session.category}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                    {session.messages.length} messages
                  </div>
                </div>

                {/* Messages Preview */}
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {session.messages.slice(0, 4).map((message, index) => (
                    <div
                      key={message.id}
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "12px",
                        alignItems: "flex-start"
                      }}
                    >
                      {getRoleIcon(message.role)}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          backgroundColor: message.role === "user" ? "#3b82f6" : "#1f2937",
                          color: "#fff",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          lineHeight: "1.4",
                          maxWidth: "100%",
                          wordBreak: "break-word"
                        }}>
                          {message.content.length > 150 
                            ? message.content.substring(0, 150) + "..." 
                            : message.content}
                        </div>
                        <div style={{
                          fontSize: "10px",
                          color: "#6b7280",
                          marginTop: "4px"
                        }}>
                          {formatDate(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {session.messages.length > 4 && (
                    <div style={{
                      textAlign: "center",
                      color: "#9ca3af",
                      fontSize: "12px",
                      fontStyle: "italic",
                      marginTop: "8px"
                    }}>
                      ... and {session.messages.length - 4} more messages
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "40px",
            color: "#9ca3af"
          }}>
            <MessageSquare size={48} style={{ marginBottom: "15px", opacity: 0.5 }} />
            <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>No chat sessions found</h3>
            <p>Start a conversation with the AIML assistant to see your chat history here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotDashboard;

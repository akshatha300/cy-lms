import axiosClient from "./axiosClient";

// Enhanced chat endpoints
export const sendEnhancedChatMessage = async (message, history = [], category = "general") => {
  const response = await axiosClient.post("/enhanced-chat/chat", {
    message,
    history,
    category,
  });
  return response.data;
};

export const getEnhancedChatHistory = async (limit = 50, category = null) => {
  const params = new URLSearchParams();
  if (limit) params.append("limit", limit);
  if (category && category !== "all") params.append("category", category);
  
  const response = await axiosClient.get(`/enhanced-chat/history?${params}`);
  return response.data;
};

export const getChatCategories = async () => {
  const response = await axiosClient.get("/enhanced-chat/categories");
  return response.data;
};

export const clearChatHistory = async (category = null) => {
  const params = new URLSearchParams();
  if (category && category !== "all") params.append("category", category);
  
  const response = await axiosClient.delete(`/enhanced-chat/history?${params}`);
  return response.data;
};

export const getChatAnalytics = async () => {
  const response = await axiosClient.get("/enhanced-chat/analytics");
  return response.data;
};

export const exportChatHistory = async (format = "json", category = null) => {
  const params = new URLSearchParams();
  params.append("format", format);
  if (category && category !== "all") params.append("category", category);
  
  const response = await axiosClient.get(`/enhanced-chat/export?${params}`, {
    responseType: format === "csv" ? "blob" : "json"
  });
  
  if (format === "csv") {
    // Create download link for CSV
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `chat_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return { success: true };
  }
  
  return response.data;
};

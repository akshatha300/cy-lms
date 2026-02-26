import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const quizApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
quizApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Quiz API functions
export const quizApiService = {
  // Get quiz questions for a module
  getQuizQuestions: async (moduleId) => {
    const response = await quizApi.get(`/quiz/${moduleId}/questions`);
    return response.data;
  },

  // Submit quiz answers
  submitQuiz: async (moduleId, answers, timeSpent) => {
    const response = await quizApi.post(`/quiz/${moduleId}/submit`, {
      answers,
      timeSpent,
    });
    return response.data;
  },

  // Get overall quiz progress
  getQuizProgress: async () => {
    const response = await quizApi.get("/quiz/progress");
    return response.data;
  },

  // Get attempts for a specific module
  getModuleAttempts: async (moduleId) => {
    const response = await quizApi.get(`/quiz/${moduleId}/attempts`);
    return response.data;
  },

  // Get quiz leaderboard
  getQuizLeaderboard: async (moduleId = null, limit = 10) => {
    const params = new URLSearchParams();
    if (moduleId) params.append("moduleId", moduleId);
    if (limit !== 10) params.append("limit", limit.toString());
    
    const response = await quizApi.get(`/quiz/leaderboard?${params}`);
    return response.data;
  },
};

export default quizApiService;

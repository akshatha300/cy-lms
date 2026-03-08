import express from "express";
import {
  enhancedChatWithTutor,
  getEnhancedChatHistory,
  getChatCategories,
  clearChatHistory,
  getChatAnalytics,
  exportChatHistory,
} from "../controllers/enhancedChatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Enhanced chat endpoint
router.post("/chat", protect, enhancedChatWithTutor);

// Get enhanced chat history
router.get("/history", protect, getEnhancedChatHistory);

// Get chat categories
router.get("/categories", protect, getChatCategories);

// Clear chat history
router.delete("/history", protect, clearChatHistory);

// Get chat analytics
router.get("/analytics", protect, getChatAnalytics);

// Export chat history
router.get("/export", protect, exportChatHistory);

export default router;

import express from "express";
import { chatWithTutor, getChatHistory } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Chat endpoint
router.post("/", protect, chatWithTutor);

// Get chat history for current user
router.get("/history", protect, getChatHistory);

export default router;

import express from "express";
import {
  getQuizQuestions,
  submitQuiz,
  getQuizProgress,
  getModuleAttempts,
  getQuizLeaderboard,
} from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All quiz routes require authentication
router.use(protect);

// Get quiz questions for a module
router.get("/:moduleId/questions", getQuizQuestions);

// Submit quiz answers
router.post("/:moduleId/submit", submitQuiz);

// Get user's overall quiz progress
router.get("/progress", getQuizProgress);

// Get attempts for a specific module
router.get("/:moduleId/attempts", getModuleAttempts);

// Get quiz leaderboard (optional)
router.get("/leaderboard", getQuizLeaderboard);

export default router;

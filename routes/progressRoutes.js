import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProgress,
  getLeaderboard,
  resetProgress,
} from "../controllers/progressController.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Get current authenticated user's progress summary
router.get("/", protect, getUserProgress);

// Get leaderboard (top users by accuracy / totalCorrect)
router.get("/leaderboard", protect, getLeaderboard);

// Reset the current user's progress
router.post("/reset", protect, resetProgress);

// Admin: reset a specific user's progress
router.post("/reset/:userId", protect, isAdmin, resetProgress);

export default router;

import express from "express";
import {
  executeLabCode,
  getSubmissionStatus,
  getUserLabSubmissions,
  getLabLeaderboard,
} from "../controllers/labExecutionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Execute lab code
router.post("/execute", protect, executeLabCode);

// Get submission status
router.get("/submission/:submissionId", protect, getSubmissionStatus);

// Get user's submissions for a lab
router.get("/submissions/:labId", protect, getUserLabSubmissions);

// Get lab leaderboard
router.get("/leaderboard/:labId", getLabLeaderboard);

export default router;

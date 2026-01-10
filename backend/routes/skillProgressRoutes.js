import express from "express";
import {
  getSkillProgressEndpoint,
  getRoleProgressEndpoint,
  markModuleCompletedEndpoint,
  recordQuizAttemptEndpoint,
  recordLabAttemptEndpoint,
} from "../controllers/skillProgressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All endpoints require authentication

// Get user's progress in a specific skill
router.get("/skills/:skillId/progress", protect, getSkillProgressEndpoint);

// Get user's progress in all skills for a role
router.get("/roles/:roleId/progress", protect, getRoleProgressEndpoint);

// Mark a module as completed
router.post("/skills/:skillId/modules/:moduleId/complete", protect, markModuleCompletedEndpoint);

// Record a quiz attempt
router.post("/skills/:skillId/quiz", protect, recordQuizAttemptEndpoint);

// Record a lab attempt
router.post("/skills/:skillId/labs/:labAttemptId/complete", protect, recordLabAttemptEndpoint);

export default router;

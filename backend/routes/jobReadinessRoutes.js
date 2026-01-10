import express from "express";
import {
  getUserJobReadiness,
  getJobReadinessTimeline,
  recalculateJobReadiness,
} from "../controllers/jobReadinessController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All endpoints require authentication

// Get current job readiness score
router.get("/", protect, getUserJobReadiness);

// Get historical readiness scores
router.get("/timeline", protect, getJobReadinessTimeline);

// Force recalculation
router.post("/recalculate", protect, recalculateJobReadiness);

export default router;

import express from "express";
import {
  platformSummary,
  modulesMetrics,
  leaderboard,
  attemptsTimeSeries
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All endpoints protected; controller also checks admin role
router.get("/summary", protect, platformSummary);
router.get("/modules", protect, modulesMetrics);
router.get("/leaderboard", protect, leaderboard);
router.get("/attempts-timeseries", protect, attemptsTimeSeries);

export default router;

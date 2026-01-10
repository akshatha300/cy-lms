import express from "express";
import {
  getLabs,
  getLabDetail,
  createLabEndpoint,
  createLabAttemptEndpoint,
  completeLabAttemptEndpoint,
  getMyLabAttempts,
} from "../controllers/labController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// List labs (authenticated)
router.get("/", protect, getLabs);

// Admin create lab
router.post("/", protect, isAdmin, createLabEndpoint);

// Get lab detail
router.get("/:labId", protect, getLabDetail);

// Start a lab attempt
router.post("/:labId/attempts", protect, createLabAttemptEndpoint);

// List my attempts
router.get("/attempts/me", protect, getMyLabAttempts);

// Complete a lab attempt (pass/fail/partial)
router.post("/attempts/:attemptId/complete", protect, completeLabAttemptEndpoint);

export default router;

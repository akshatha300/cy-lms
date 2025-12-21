import express from "express";
import { createSimulation } from "../controllers/phishingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate phishing simulation using Gemini
router.post("/simulate", protect, createSimulation);

export default router;

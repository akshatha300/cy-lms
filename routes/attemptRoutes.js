import express from "express";
import { evaluateQuestionAttempt } from "../controllers/attemptController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, evaluateQuestionAttempt);

export default router;

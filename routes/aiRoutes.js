import express from "express";
import { getAIQuestion } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate", getAIQuestion);

export default router;

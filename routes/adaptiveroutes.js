import express from "express";
import { updateDifficulty, getDifficulty } from "../controllers/adaptiveController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/update", protect, updateDifficulty);
router.get("/", protect, getDifficulty);

export default router;

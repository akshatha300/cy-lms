import express from "express";
import { listLogs, createLog } from "../controllers/logController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin: list logs
router.get("/", protect, isAdmin, listLogs);

// Admin: create log entry (manual/debug)
router.post("/", protect, isAdmin, createLog);

export default router;

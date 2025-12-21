import express from "express";
import { ragQuery } from "../controllers/ragController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/query", protect, ragQuery);

export default router;

// backend/routes/certificateRoutes.js
import express from "express";
import { createCertificate } from "../controllers/certificateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/generate", protect, createCertificate);

export default router;

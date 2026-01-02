// backend/routes/certificateRoutes.js
import express from "express";
import {
	createCertificate,
	listCertificates,
	downloadCertificate,
} from "../controllers/certificateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, createCertificate);
router.get("/", protect, listCertificates);
router.get("/:id/download", protect, downloadCertificate);

export default router;

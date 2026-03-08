import express from "express";
import {
  getCareerRoadmaps,
  getRoadmapById,
  getRoadmapProgress,
  createCareerRoadmap,
  updateCareerRoadmap,
  deleteCareerRoadmap,
  updateProgress
} from "../controllers/careerRoadmapController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public routes (all authenticated users)
router.get("/", protect, getCareerRoadmaps);
router.get("/:roleId", protect, getRoadmapById);
router.get("/:roleId/progress", protect, getRoadmapProgress);
router.put("/:roleId/progress", protect, updateProgress);

// Admin only routes
router.post("/", protect, isAdmin, createCareerRoadmap);
router.put("/:roleId", protect, isAdmin, updateCareerRoadmap);
router.delete("/:roleId", protect, isAdmin, deleteCareerRoadmap);

export default router;

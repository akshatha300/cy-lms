import express from "express";
import {
  getCareerRoadmaps,
  getCareerRoadmapById,
  getCareerRoadmapProgress,
  updateCareerRoadmapProgress,
  createCareerRoadmap,
  updateCareerRoadmap,
  deleteCareerRoadmap,
} from "../controllers/basicCareerRoadmapController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.route("/").get(getCareerRoadmaps);
router.route("/:id").get(getCareerRoadmapById);

// Protected routes
router.route("/:id/progress/:userId").get(protect, getCareerRoadmapProgress);
router.route("/:id/progress/:userId").put(protect, updateCareerRoadmapProgress);

// Admin routes
router.route("/").post(protect, isAdmin, createCareerRoadmap);
router.route("/:id").put(protect, isAdmin, updateCareerRoadmap);
router.route("/:id").delete(protect, isAdmin, deleteCareerRoadmap);

export default router;

import express from "express";
import {
  createModule,
  getModules,
  getRoleModules,
  getModuleById,
  updateModule,
  deleteModule,
} from "../controllers/moduleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// GET modules filtered by user's role
router.get("/role-filtered", protect, getRoleModules);

// GET all modules (protected)
router.get("/", protect, getModules);

// GET single module (protected)
router.get("/:id", protect, getModuleById);

// Admin-only create/update/delete
router.post("/", protect, isAdmin, createModule);
router.put("/:id", protect, isAdmin, updateModule);
router.delete("/:id", protect, isAdmin, deleteModule);

export default router;

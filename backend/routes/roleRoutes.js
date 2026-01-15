import express from "express";
import {
  getRoles,
  getRoleDetail,
  createSecurityRole,
  updateSecurityRole,
  selectUserRole,
  getUserRole,
  getRoleSkills,
  getRoleModules,
  updateRoleModules,
  getRoleLearningPath,
  getRoleLabs,
} from "../controllers/roleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: list all roles
router.get("/", getRoles);

// Public: get role detail
router.get("/:roleId", getRoleDetail);

// Public: get role skills
router.get("/:roleId/skills", getRoleSkills);

// User: select a role
router.post("/select", protect, selectUserRole);

// User: get selected role(s)
router.get("/me/role", protect, getUserRole);

// Admin: create role
router.post("/", protect, createSecurityRole);

// Admin: update role
router.put("/:roleId", protect, updateSecurityRole);
router.get("/:roleId/modules", getRoleModules);
router.put("/:roleId/modules", updateRoleModules);
router.get("/:roleId/learning-path", getRoleLearningPath);
router.get("/:roleId/labs", getRoleLabs);
export default router;

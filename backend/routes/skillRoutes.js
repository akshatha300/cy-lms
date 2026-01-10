import express from "express";
import {
  getSkills,
  getSkillDetail,
  createNewSkill,
  updateExistingSkill,
  linkModuleToSkillEndpoint,
} from "../controllers/skillController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: list all skills (optional: filter by tag)
router.get("/", getSkills);

// Public: get skill detail
router.get("/:skillId", getSkillDetail);

// Admin: create skill
router.post("/", protect, createNewSkill);

// Admin: update skill
router.put("/:skillId", protect, updateExistingSkill);

// Admin: link module to skill
router.post("/:skillId/modules/:moduleId", protect, linkModuleToSkillEndpoint);

export default router;

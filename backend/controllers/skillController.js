import {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  linkModuleToSkill,
  getSkillsByTag,
} from "../services/skillService.js";
import asyncHandler from "express-async-handler";

/**
 * GET /api/skills
 * Fetch all available skills
 */
export const getSkills = asyncHandler(async (req, res) => {
  const { tag } = req.query;

  let skills;
  if (tag) {
    skills = await getSkillsByTag(tag);
  } else {
    skills = await getAllSkills();
  }

  res.json({ message: "Skills retrieved", skills });
});

/**
 * GET /api/skills/:skillId
 * Fetch a specific skill with details
 */
export const getSkillDetail = asyncHandler(async (req, res) => {
  const { skillId } = req.params;
  const skill = await getSkillById(skillId);

  res.json({
    message: "Skill details retrieved",
    skill,
  });
});

/**
 * POST /api/skills
 * Create a new skill (admin only)
 */
export const createNewSkill = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Admin only");
  }

  const skill = await createSkill(req.body);

  res.status(201).json({ message: "Skill created", skill });
});

/**
 * PUT /api/skills/:skillId
 * Update a skill (admin only)
 */
export const updateExistingSkill = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Admin only");
  }

  const { skillId } = req.params;
  const skill = await updateSkill(skillId, req.body);

  res.json({ message: "Skill updated", skill });
});

/**
 * POST /api/skills/:skillId/modules/:moduleId
 * Link a module to a skill (admin only)
 */
export const linkModuleToSkillEndpoint = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Admin only");
  }

  const { skillId, moduleId } = req.params;
  const skill = await linkModuleToSkill(skillId, moduleId);

  res.json({ message: "Module linked to skill", skill });
});

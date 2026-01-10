import {
  getSkillProgress,
  updateSkillProgress,
  calculateSkillCompletion,
  getSkillProgressForRole,
  markModuleCompleted,
  recordQuizAttempt,
  recordLabAttempt,
} from "../services/skillProgressService.js";
import asyncHandler from "express-async-handler";

/**
 * GET /api/skills/:skillId/progress
 * Get user's progress in a specific skill
 */
export const getSkillProgressEndpoint = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { skillId } = req.params;

  const progress = await getSkillProgress(userId, skillId);

  res.json({
    message: "Skill progress retrieved",
    progress,
  });
});

/**
 * GET /api/roles/:roleId/progress
 * Get user's progress in all skills for a specific role
 */
export const getRoleProgressEndpoint = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { roleId } = req.params;

  const skillProgresses = await getSkillProgressForRole(userId, roleId);

  const totalSkills = skillProgresses.length;
  const completedSkills = skillProgresses.filter((sp) => sp.status === "completed").length;
  const avgCompletion = totalSkills > 0
    ? Math.round(
        skillProgresses.reduce((sum, sp) => sum + sp.completionPercentage, 0) / totalSkills
      )
    : 0;

  res.json({
    message: "Role progress retrieved",
    roleId,
    userId,
    totalSkills,
    completedSkills,
    avgCompletion,
    skills: skillProgresses,
  });
});

/**
 * POST /api/skills/:skillId/modules/:moduleId/complete
 * Mark a module as completed for a skill
 */
export const markModuleCompletedEndpoint = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { skillId, moduleId } = req.params;

  const progress = await markModuleCompleted(userId, skillId, moduleId);

  res.json({
    message: "Module marked as completed",
    progress,
  });
});

/**
 * POST /api/skills/:skillId/quiz
 * Record a quiz attempt for a skill
 */
export const recordQuizAttemptEndpoint = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { skillId } = req.params;
  const { score } = req.body;

  if (score === undefined || score === null) {
    res.status(400);
    throw new Error("score is required");
  }

  const progress = await recordQuizAttempt(userId, skillId, score);

  res.json({
    message: "Quiz attempt recorded",
    progress,
  });
});

/**
 * POST /api/skills/:skillId/labs/:labAttemptId/complete
 * Record a lab attempt for a skill
 */
export const recordLabAttemptEndpoint = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { skillId, labAttemptId } = req.params;
  const { passed } = req.body;

  const progress = await recordLabAttempt(userId, skillId, labAttemptId, passed);

  res.json({
    message: "Lab attempt recorded",
    progress,
  });
});

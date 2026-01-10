import SkillProgress from "../models/SkillProgress.js";
import Skill from "../models/Skill.js";
import Attempt from "../models/Attempt.js";
import LabAttempt from "../models/LabAttempt.js";

/**
 * Get skill progress for a user and skill
 */
export const getSkillProgress = async (userId, skillId) => {
  try {
    const progress = await SkillProgress.findOne({ userId, skillId })
      .populate("requiredModules")
      .populate("completedModules")
      .populate("labAttempts");

    if (!progress) {
      // Return empty progress if not yet started
      return {
        userId,
        skillId,
        completedModules: [],
        modulesCompleted: 0,
        labsCompleted: 0,
        labsPassed: 0,
        completionPercentage: 0,
        status: "not-started",
      };
    }

    return progress;
  } catch (error) {
    console.error("getSkillProgress error:", error);
    throw error;
  }
};

/**
 * Update skill progress (e.g., when user completes a module or lab)
 */
export const updateSkillProgress = async (userId, skillId, updates) => {
  try {
    const progress = await SkillProgress.findOneAndUpdate(
      { userId, skillId },
      {
        ...updates,
        lastActivityAt: new Date(),
      },
      { new: true, upsert: true, runValidators: true }
    );

    return progress;
  } catch (error) {
    console.error("updateSkillProgress error:", error);
    throw error;
  }
};

/**
 * Calculate completion percentage for a skill
 * Formula: (modulesCompleted + labsCompleted + assessmentScore) / 3
 */
export const calculateSkillCompletion = async (userId, skillId) => {
  try {
    const skill = await Skill.findById(skillId);
    const progress = await SkillProgress.findOne({ userId, skillId });

    if (!skill || !progress) return 0;

    // Component 1: Module completion
    const modulePct = skill.requiredModules.length > 0
      ? (progress.completedModules.length / skill.requiredModules.length) * 100
      : 0;

    // Component 2: Lab completion
    const labPct = skill.requiredLabCount > 0
      ? (progress.labsPassed / skill.requiredLabCount) * 100
      : 0;

    // Component 3: Assessment score
    const assessmentPct = progress.bestQuizScore;

    // Weighted average: modules 40%, labs 35%, assessments 25%
    const completion = Math.round(
      (modulePct * 0.4 + labPct * 0.35 + assessmentPct * 0.25)
    );

    // Update status based on completion
    let status = "not-started";
    if (completion > 0) status = "in-progress";
    if (completion >= 90) status = "completed";

    // Save updated progress
    const updated = await updateSkillProgress(userId, skillId, {
      completionPercentage: completion,
      status,
    });

    return updated;
  } catch (error) {
    console.error("calculateSkillCompletion error:", error);
    throw error;
  }
};

/**
 * Get all skill progress for a user in a specific role
 */
export const getSkillProgressForRole = async (userId, roleId) => {
  try {
    const skillProgresses = await SkillProgress.find({ userId, roleId })
      .populate("skillId")
      .populate("requiredModules")
      .populate("completedModules")
      .populate("labAttempts")
      .sort({ createdAt: 1 });

    return skillProgresses;
  } catch (error) {
    console.error("getSkillProgressForRole error:", error);
    throw error;
  }
};

/**
 * Update progress when user completes a module in a skill
 */
export const markModuleCompleted = async (userId, skillId, moduleId) => {
  try {
    const progress = await SkillProgress.findOne({ userId, skillId });

    if (!progress) {
      throw new Error("Skill progress not found");
    }

    // Add module to completed if not already there
    if (!progress.completedModules.includes(moduleId)) {
      progress.completedModules.push(moduleId);
      progress.modulesCompleted = progress.completedModules.length;
      progress.lastActivityAt = new Date();
      await progress.save();
    }

    // Recalculate completion
    return calculateSkillCompletion(userId, skillId);
  } catch (error) {
    console.error("markModuleCompleted error:", error);
    throw error;
  }
};

/**
 * Record a quiz attempt for a skill
 */
export const recordQuizAttempt = async (userId, skillId, score) => {
  try {
    if (score < 0 || score > 100) {
      throw new Error("Score must be between 0 and 100");
    }

    const progress = await SkillProgress.findOne({ userId, skillId });

    if (!progress) {
      throw new Error("Skill progress not found");
    }

    // Update quiz history
    progress.quizAttempts += 1;
    progress.allQuizScores.push({
      date: new Date(),
      score,
    });

    // Update best score
    if (score > progress.bestQuizScore) {
      progress.bestQuizScore = score;
    }

    progress.lastQuizDate = new Date();
    progress.lastActivityAt = new Date();
    await progress.save();

    // Recalculate completion
    return calculateSkillCompletion(userId, skillId);
  } catch (error) {
    console.error("recordQuizAttempt error:", error);
    throw error;
  }
};

/**
 * Record a lab attempt for a skill
 */
export const recordLabAttempt = async (userId, skillId, labAttemptId, passed = false) => {
  try {
    const progress = await SkillProgress.findOne({ userId, skillId });

    if (!progress) {
      throw new Error("Skill progress not found");
    }

    // Add lab attempt
    if (!progress.labAttempts.includes(labAttemptId)) {
      progress.labAttempts.push(labAttemptId);
      progress.labsCompleted += 1;

      if (passed) {
        progress.labsPassed += 1;
      }
    }

    progress.lastActivityAt = new Date();
    await progress.save();

    // Recalculate completion
    return calculateSkillCompletion(userId, skillId);
  } catch (error) {
    console.error("recordLabAttempt error:", error);
    throw error;
  }
};

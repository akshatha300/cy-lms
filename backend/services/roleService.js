import SecurityRole from "../models/SecurityRole.js";
import Skill from "../models/Skill.js";
import SkillProgress from "../models/SkillProgress.js";

/**
 * Get all active roles with their skills populated
 */
export const getAllRoles = async () => {
  try {
    const roles = await SecurityRole.find({ isActive: true })
      .populate("requiredSkills")
      .sort({ seniority: 1, name: 1 });
    return roles;
  } catch (error) {
    console.error("getAllRoles error:", error);
    throw error;
  }
};

/**
 * Get a specific role with full details
 */
export const getRoleById = async (roleId) => {
  try {
    const role = await SecurityRole.findById(roleId).populate("requiredSkills");
    if (!role) throw new Error("Role not found");
    return role;
  } catch (error) {
    console.error("getRoleById error:", error);
    throw error;
  }
};

/**
 * Get role with skills and additional metadata
 */
export const getRoleWithSkillsAndMetadata = async (roleId) => {
  try {
    const role = await SecurityRole.findById(roleId).populate({
      path: "requiredSkills",
      populate: {
        path: "requiredModules",
        model: "Module",
      },
    });

    if (!role) throw new Error("Role not found");

    return {
      ...role.toObject(),
      skillCount: role.requiredSkills.length,
      estimatedDaysToComplete: Math.ceil(
        role.estimatedHoursToComplete / 8
      ),
    };
  } catch (error) {
    console.error("getRoleWithSkillsAndMetadata error:", error);
    throw error;
  }
};

/**
 * Create a new security role (admin only)
 */
export const createRole = async (data) => {
  try {
    const { name, description, seniority = "entry", requiredSkills = [], requiredLabCount = 0, estimatedHoursToComplete = 40, tags = [] } = data;

    if (!name || !description) {
      throw new Error("Name and description are required");
    }

    const role = new SecurityRole({
      name,
      description,
      seniority,
      requiredSkills,
      requiredLabCount,
      estimatedHoursToComplete,
      tags,
    });

    await role.save();
    return role;
  } catch (error) {
    console.error("createRole error:", error);
    throw error;
  }
};

/**
 * Update a role
 */
export const updateRole = async (roleId, updates) => {
  try {
    const role = await SecurityRole.findByIdAndUpdate(roleId, updates, {
      new: true,
      runValidators: true,
    }).populate("requiredSkills");

    if (!role) throw new Error("Role not found");
    return role;
  } catch (error) {
    console.error("updateRole error:", error);
    throw error;
  }
};

/**
 * Initialize skill progress for a user when they select a role
 */
export const initializeSkillProgressForRole = async (userId, roleId) => {
  try {
    const role = await SecurityRole.findById(roleId);
    if (!role) throw new Error("Role not found");

    const skillProgresses = [];

    for (const skillId of role.requiredSkills) {
      const skill = await Skill.findById(skillId);
      if (!skill) continue;

      // Check if progress already exists
      const existing = await SkillProgress.findOne({ userId, skillId });
      if (existing) continue;

      // Create new skill progress
      const progress = new SkillProgress({
        userId,
        skillId,
        roleId,
        requiredModules: skill.requiredModules,
        completedModules: [],
        status: "not-started",
        completionPercentage: 0,
      });

      await progress.save();
      skillProgresses.push(progress);
    }

    return skillProgresses;
  } catch (error) {
    console.error("initializeSkillProgressForRole error:", error);
    throw error;
  }
};

/**
 * Get all skills for a role
 */
export const getSkillsForRole = async (roleId) => {
  try {
    const role = await SecurityRole.findById(roleId).populate({
      path: "requiredSkills",
      populate: {
        path: "requiredModules",
        model: "Module",
      },
    });

    if (!role) throw new Error("Role not found");
    return role.requiredSkills;
  } catch (error) {
    console.error("getSkillsForRole error:", error);
    throw error;
  }
};

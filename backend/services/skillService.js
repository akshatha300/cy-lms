import Skill from "../models/Skill.js";
import Module from "../models/Module.js";

/**
 * Get all active skills
 */
export const getAllSkills = async () => {
  try {
    const skills = await Skill.find({ isActive: true })
      .populate("requiredModules")
      .sort({ difficulty: 1, name: 1 });
    return skills;
  } catch (error) {
    console.error("getAllSkills error:", error);
    throw error;
  }
};

/**
 * Get a specific skill with full details
 */
export const getSkillById = async (skillId) => {
  try {
    const skill = await Skill.findById(skillId).populate("requiredModules");
    if (!skill) throw new Error("Skill not found");
    return skill;
  } catch (error) {
    console.error("getSkillById error:", error);
    throw error;
  }
};

/**
 * Create a new skill (admin only)
 */
export const createSkill = async (data) => {
  try {
    const {
      name,
      description,
      difficulty = 1,
      requiredModules = [],
      requiredLabCount = 0,
      assessmentType = "both",
      estimatedHours = 8,
      tags = [],
    } = data;

    if (!name || !description) {
      throw new Error("Name and description are required");
    }

    const skill = new Skill({
      name,
      description,
      difficulty,
      requiredModules,
      requiredLabCount,
      assessmentType,
      estimatedHours,
      tags,
    });

    await skill.save();
    return skill;
  } catch (error) {
    console.error("createSkill error:", error);
    throw error;
  }
};

/**
 * Update a skill
 */
export const updateSkill = async (skillId, updates) => {
  try {
    const skill = await Skill.findByIdAndUpdate(skillId, updates, {
      new: true,
      runValidators: true,
    }).populate("requiredModules");

    if (!skill) throw new Error("Skill not found");
    return skill;
  } catch (error) {
    console.error("updateSkill error:", error);
    throw error;
  }
};

/**
 * Link a module to a skill
 */
export const linkModuleToSkill = async (skillId, moduleId) => {
  try {
    const skill = await Skill.findById(skillId);
    const module = await Module.findById(moduleId);

    if (!skill) throw new Error("Skill not found");
    if (!module) throw new Error("Module not found");

    // Add module if not already linked
    if (!skill.requiredModules.includes(moduleId)) {
      skill.requiredModules.push(moduleId);
      await skill.save();
    }

    return skill.populate("requiredModules");
  } catch (error) {
    console.error("linkModuleToSkill error:", error);
    throw error;
  }
};

/**
 * Get skills by tag
 */
export const getSkillsByTag = async (tag) => {
  try {
    const skills = await Skill.find({ tags: tag, isActive: true })
      .populate("requiredModules")
      .sort({ difficulty: 1 });
    return skills;
  } catch (error) {
    console.error("getSkillsByTag error:", error);
    throw error;
  }
};

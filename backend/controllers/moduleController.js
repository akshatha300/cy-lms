import Module from "../models/Module.js";

/**
 * Create a new module (admin)
 */
export const createModule = async (req, res) => {
  try {
    // Optional: require role=admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }

    const {
      title,
      description,
      difficulty = 1,
      tags = [],
      published = true,
      materials = [],
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const mod = await Module.create({
      title,
      description,
      difficulty,
      tags,
      published,
      materials,
    });
    res.status(201).json(mod);
  } catch (err) {
    console.error("createModule error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all modules (list)
 */
export const getModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ difficulty: 1, createdAt: -1 });
    res.json(modules);
  } catch (err) {
    console.error("getModules error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get modules for user's selected role
 */
export const getRoleModules = async (req, res) => {
  try {
    const userId = req.user._id;
    const User = (await import("../models/User.js")).default;
    const Skill = (await import("../models/Skill.js")).default;
    const SecurityRole = (await import("../models/SecurityRole.js")).default;

    const user = await User.findById(userId).populate("primaryRole");
    
    if (!user.primaryRole) {
      // No role selected, return all modules
      const modules = await Module.find().sort({ difficulty: 1, createdAt: -1 });
      return res.json({ modules, roleFiltered: false, roleName: null });
    }

    const role = await SecurityRole.findById(user.primaryRole).populate("requiredSkills");
    
    if (!role) {
      const modules = await Module.find().sort({ difficulty: 1, createdAt: -1 });
      return res.json({ modules, roleFiltered: false, roleName: null });
    }

    // Get all skills for this role
    const skills = await Skill.find({ _id: { $in: role.requiredSkills } }).populate("requiredModules");
    
    // Extract unique module IDs
    const moduleIds = new Set();
    skills.forEach((skill) => {
      skill.requiredModules.forEach((mod) => {
        if (mod && mod._id) moduleIds.add(mod._id.toString());
      });
    });

    // Fetch those modules
    const modules = await Module.find({ _id: { $in: Array.from(moduleIds) } }).sort({ difficulty: 1, createdAt: -1 });
    
    res.json({ 
      modules, 
      roleFiltered: true, 
      roleName: role.name,
      totalSkills: skills.length 
    });
  } catch (err) {
    console.error("getRoleModules error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get single module by id
 */
export const getModuleById = async (req, res) => {
  try {
    const mod = await Module.findById(req.params.id);
    if (!mod) return res.status(404).json({ message: "Module not found" });
    res.json(mod);
  } catch (err) {
    console.error("getModuleById error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update module (admin)
 */
export const updateModule = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }
    const mod = await Module.findById(req.params.id);
    if (!mod) return res.status(404).json({ message: "Module not found" });

    const { title, description, difficulty, tags, published, materials } = req.body;
    if (title !== undefined) mod.title = title;
    if (description !== undefined) mod.description = description;
    if (difficulty !== undefined) mod.difficulty = difficulty;
    if (tags !== undefined) mod.tags = tags;
    if (published !== undefined) mod.published = published;
    if (materials !== undefined) mod.materials = materials;

    const updated = await mod.save();
    res.json(updated);
  } catch (err) {
    console.error("updateModule error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Delete module (admin)
 */
export const deleteModule = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }
    const mod = await Module.findById(req.params.id);
    if (!mod) return res.status(404).json({ message: "Module not found" });
    await mod.deleteOne();
    res.json({ message: "Module removed" });
  } catch (err) {
    console.error("deleteModule error:", err);
    res.status(500).json({ message: err.message });
  }
};
// Admin create (already provided earlier but ensure the role check uses isAdmin middleware or in-controller role)
export const adminCreateModule = async (req, res) => {
  try {
    const { title, description, difficulty = 1, tags = [] } = req.body;
    const mod = await Module.create({ title, description, difficulty, tags });
    res.status(201).json(mod);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const adminUpdateModule = async (req, res) => {
  try {
    const mod = await Module.findById(req.params.id);
    if (!mod) return res.status(404).json({ message: "Module not found" });
    Object.assign(mod, req.body);
    await mod.save();
    res.json(mod);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const adminDeleteModule = async (req, res) => {
  try {
    const mod = await Module.findById(req.params.id);
    if (!mod) return res.status(404).json({ message: "Module not found" });
    await mod.deleteOne();
    res.json({ message: "Module deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


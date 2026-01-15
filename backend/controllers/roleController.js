import {
  getAllRoles,
  getRoleById,
  getRoleWithSkillsAndMetadata,
  createRole,
  updateRole,
  initializeSkillProgressForRole,
  getSkillsForRole,
} from "../services/roleService.js";
import SecurityRole from "../models/SecurityRole.js";
import { calculateJobReadiness } from "../services/jobReadinessService.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

/**
 * GET /api/roles
 * Fetch all available security roles
 */
export const getRoles = asyncHandler(async (req, res) => {
  const roles = await getAllRoles();
  res.json({ message: "Roles retrieved", roles });
});

/**
 * GET /api/roles/:roleId
 * Fetch a specific role with skills
 */
export const getRoleDetail = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const role = await getRoleWithSkillsAndMetadata(roleId);
  res.json({ message: "Role details retrieved", role });
});

/**
 * POST /api/roles
 * Create a new security role (admin only)
 */
export const createSecurityRole = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Admin only");
  }

  const role = await createRole(req.body);
  res.status(201).json({ message: "Role created", role });
});

/**
 * PUT /api/roles/:roleId
 * Update a security role (admin only)
 */
export const updateSecurityRole = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Admin only");
  }

  const { roleId } = req.params;
  const role = await updateRole(roleId, req.body);
  res.json({ message: "Role updated", role });
});

/**
 * POST /api/users/me/role
 * User selects a security role
 */
export const selectUserRole = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { roleId } = req.body;

  if (!roleId) {
    res.status(400);
    throw new Error("roleId is required");
  }

  // Validate role exists
  const role = await getRoleById(roleId);
  if (!role) {
    res.status(404);
    throw new Error("Role not found");
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    userId,
    {
      primaryRole: roleId,
      $addToSet: { selectedRoles: roleId }, // Add to selected roles if not already there
    },
    { new: true }
  ).populate("primaryRole");

  // Initialize skill progress for all skills in the role
  await initializeSkillProgressForRole(userId, roleId);

  // Calculate initial job readiness
  const readiness = await calculateJobReadiness(userId, roleId);

  res.json({
    message: "Role selected successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      primaryRole: user.primaryRole,
      selectedRoles: user.selectedRoles,
    },
    readiness,
  });
});

/**
 * GET /api/users/me/role
 * Get user's selected role(s)
 */
export const getUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("primaryRole")
    .populate("selectedRoles");

  res.json({
    message: "User role information",
    primaryRole: user.primaryRole,
    selectedRoles: user.selectedRoles,
    preferredCareerPath: user.preferredCareerPath,
  });
});

/**
 * GET /api/roles/:roleId/skills
 * Get all skills for a specific role
 */
export const getRoleSkills = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const skills = await getSkillsForRole(roleId);

  res.json({
    message: "Role skills retrieved",
    roleId,
    skills,
  });
});
export const getRoleModules = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  
  console.log("=== DEBUG: getRoleModules ===");
  console.log("Looking for role ID:", roleId);
  
  const role = await SecurityRole.findById(roleId).populate('assignedModules');
  
  console.log("Found role:", role ? role.name : "NOT FOUND");
  console.log("Assigned modules count:", role?.assignedModules?.length || 0);
  console.log("Module count field:", role?.moduleCount);
  
  if (!role) {
    res.status(404);
    throw new Error("Role not found");
  }

  res.json({
    message: "Role modules retrieved",
    roleId,
    roleName: role.name,
    modules: role.assignedModules,
    moduleCount: role.moduleCount
  });
});

 
export const updateRoleModules = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const { moduleIds } = req.body; // Array of module IDs
  
  const role = await SecurityRole.findById(roleId);
  
  if (!role) {
    res.status(404);
    throw new Error("Role not found");
  }

  role.assignedModules = moduleIds;
  role.moduleCount = moduleIds.length;
  
  await role.save();

  res.json({
    message: "Role modules updated",
    roleId,
    modules: role.assignedModules,
    moduleCount: role.moduleCount
  });
});
export const getRoleLearningPath = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  
  const role = await SecurityRole.findById(roleId).populate({
    path: 'assignedModules',
    populate: {
      path: 'prerequisites',
      model: 'Module'
    }
  });
  
  if (!role) {
    res.status(404);
    throw new Error("Role not found");
  }

  res.json({
    message: "Learning path retrieved",
    roleId,
    roleName: role.name,
    description: role.description,
    modules: role.assignedModules,
    estimatedHours: role.estimatedHoursToComplete,
    requiredLabCount: role.requiredLabCount
  });
});
export const getRoleLabs = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  
  console.log("=== DEBUG: getRoleLabs ===");
  console.log("Looking for role ID:", roleId);
  
  const role = await SecurityRole.findById(roleId).populate('assignedLabs');
  
  console.log("Found role:", role ? role.name : "NOT FOUND");
  console.log("Assigned labs count:", role?.assignedLabs?.length || 0);
  console.log("Lab count field:", role?.labCount);
  
  if (!role) {
    res.status(404);
    throw new Error("Role not found");
  }

  res.json({
    message: "Role labs retrieved",
    roleId,
    roleName: role.name,
    labs: role.assignedLabs,
    labCount: role.labCount
  });
});
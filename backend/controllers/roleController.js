import {
  getAllRoles,
  getRoleById,
  getRoleWithSkillsAndMetadata,
  createRole,
  updateRole,
  initializeSkillProgressForRole,
  getSkillsForRole,
} from "../services/roleService.js";
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

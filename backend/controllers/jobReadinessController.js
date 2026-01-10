import {
  calculateJobReadiness,
  getJobReadinessScore,
  updateJobReadinessScore,
  getReadinessTimeline,
} from "../services/jobReadinessService.js";
import asyncHandler from "express-async-handler";

/**
 * GET /api/users/me/job-readiness
 * Get user's current job readiness score for their primary role
 */
export const getUserJobReadiness = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let { roleId } = req.query;

  // If no roleId provided, use user's primary role
  if (!roleId) {
    const user = await require("../models/User.js").default.findById(userId);
    roleId = user?.primaryRole;

    if (!roleId) {
      res.status(400);
      throw new Error("No role selected. Please select a security role first.");
    }
  }

  const readiness = await getJobReadinessScore(userId, roleId);

  res.json({
    message: "Job readiness score retrieved",
    readiness,
  });
});

/**
 * GET /api/users/me/job-readiness/timeline
 * Get historical job readiness scores over time
 */
export const getJobReadinessTimeline = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { roleId, days = 90 } = req.query;

  if (!roleId) {
    res.status(400);
    throw new Error("roleId is required");
  }

  const timeline = await getReadinessTimeline(userId, roleId, parseInt(days));

  res.json({
    message: "Job readiness timeline retrieved",
    roleId,
    days: parseInt(days),
    timeline,
  });
});

/**
 * POST /api/users/me/job-readiness/recalculate
 * Force recalculation of job readiness (e.g., after major milestone)
 */
export const recalculateJobReadiness = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { roleId } = req.body;

  if (!roleId) {
    res.status(400);
    throw new Error("roleId is required");
  }

  const updated = await updateJobReadinessScore(userId, roleId);

  res.json({
    message: "Job readiness recalculated",
    readiness: updated,
  });
});

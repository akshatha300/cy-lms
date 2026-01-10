import Lab from "../models/Lab.js";
import LabAttempt from "../models/LabAttempt.js";
import { recordLabAttempt } from "./skillProgressService.js";
import { updateJobReadinessScore } from "./jobReadinessService.js";

export const listLabs = async () => {
  return Lab.find({ isActive: true }).sort({ createdAt: -1 });
};

export const getLab = async (labId) => {
  const lab = await Lab.findById(labId);
  if (!lab) {
    throw new Error("Lab not found");
  }
  return lab;
};

export const createLab = async (payload) => {
  const lab = new Lab(payload);
  return lab.save();
};

export const createLabAttempt = async (userId, labId, roleId = null) => {
  const lab = await getLab(labId);

  const attempt = await LabAttempt.create({
    userId,
    labId,
    skillId: lab.skillId,
    roleId,
    status: "partial",
    score: 0,
  });

  return attempt;
};

export const completeLabAttempt = async (userId, attemptId, data = {}) => {
  const { status, score, timeTakenSeconds, evidenceSubmitted, mentorFeedback } = data;

  if (!status || !["success", "partial", "failed"].includes(status)) {
    throw new Error("Status must be one of: success, partial, failed");
  }

  const attempt = await LabAttempt.findById(attemptId);
  if (!attempt) {
    throw new Error("Lab attempt not found");
  }

  if (attempt.userId.toString() !== userId.toString()) {
    throw new Error("Not authorized to update this lab attempt");
  }

  attempt.status = status;
  if (score !== undefined) attempt.score = score;
  if (timeTakenSeconds !== undefined) attempt.timeTakenSeconds = timeTakenSeconds;
  if (evidenceSubmitted !== undefined) attempt.evidenceSubmitted = evidenceSubmitted;
  if (mentorFeedback !== undefined) attempt.mentorFeedback = mentorFeedback;
  attempt.completedAt = new Date();

  await attempt.save();

  const progress = await recordLabAttempt(userId, attempt.skillId, attempt._id, status === "success");

  let readiness = null;
  if (attempt.roleId) {
    try {
      readiness = await updateJobReadinessScore(userId, attempt.roleId);
    } catch (err) {
      console.error("completeLabAttempt readiness update error:", err);
    }
  }

  return { attempt, progress, readiness };
};

export const listMyLabAttempts = async (userId) => {
  return LabAttempt.find({ userId }).sort({ createdAt: -1 }).populate("labId");
};

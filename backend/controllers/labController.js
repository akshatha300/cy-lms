import asyncHandler from "express-async-handler";
import {
  listLabs,
  getLab,
  createLab,
  createLabAttempt,
  completeLabAttempt,
  listMyLabAttempts,
} from "../services/labService.js";

export const getLabs = asyncHandler(async (req, res) => {
  const labs = await listLabs();
  res.json({ labs });
});

export const getLabDetail = asyncHandler(async (req, res) => {
  const { labId } = req.params;
  const lab = await getLab(labId);
  res.json({ lab });
});

export const createLabEndpoint = asyncHandler(async (req, res) => {
  const lab = await createLab(req.body);
  res.status(201).json({ message: "Lab created", lab });
});

export const createLabAttemptEndpoint = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { labId } = req.params;
  const { roleId } = req.body;

  const attempt = await createLabAttempt(userId, labId, roleId);
  res.status(201).json({ message: "Lab attempt created", attempt });
});

export const completeLabAttemptEndpoint = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { attemptId } = req.params;
  const { status, score, timeTakenSeconds, evidenceSubmitted, mentorFeedback } = req.body;

  const result = await completeLabAttempt(userId, attemptId, {
    status,
    score,
    timeTakenSeconds,
    evidenceSubmitted,
    mentorFeedback,
  });

  res.json({
    message: "Lab attempt recorded",
    ...result,
  });
});

export const getMyLabAttempts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const attempts = await listMyLabAttempts(userId);
  res.json({ attempts });
});

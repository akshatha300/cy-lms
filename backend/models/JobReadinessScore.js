import mongoose from "mongoose";

const jobReadinessScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SecurityRole",
      required: true,
    },

    // Component scores (0-100 each)
    skillsCompletionPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      // Average of all SkillProgress.completionPercentage in the role
    },
    labSuccessRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      // (labsPassed / requiredLabCount) * 100
    },
    assessmentScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      // Average of all best quiz scores across skills
    },

    // Overall job readiness (weighted average)
    overallReadinessScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      // Weighted: (skillsCompletion * 0.4) + (labSuccess * 0.35) + (assessment * 0.25)
    },
    readinessLevel: {
      type: String,
      enum: ["not-started", "basic", "in-progress", "advanced", "ready"],
      default: "not-started",
      // not-started: 0-15%
      // basic: 15-40%
      // in-progress: 40-75%
      // advanced: 75-95%
      // ready: 95-100%
    },

    // Guidance
    missingSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    estimatedWeeksToReady: {
      type: Number,
      default: 0,
      // Based on: (100 - overallReadinessScore) / estimatedHourPerWeek
    },

    // Historical tracking
    scoreHistory: [
      {
        date: Date,
        score: Number,
      },
    ],
    trend: {
      type: String,
      enum: ["improving", "stable", "declining"],
      default: "stable",
    },

    lastCalculatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Composite unique index: one score per user-role pair
jobReadinessScoreSchema.index({ userId: 1, roleId: 1 }, { unique: true });

export default mongoose.model("JobReadinessScore", jobReadinessScoreSchema);

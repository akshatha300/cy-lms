import mongoose from "mongoose";

const labAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      required: true,
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
      // Denormalized for faster queries
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SecurityRole",
      // Optional: context for which role's learning path this supports
    },

    // Result tracking
    status: {
      type: String,
      enum: ["success", "partial", "failed"],
      required: true,
      // success: user completed objective
      // partial: user made progress but didn't fully complete
      // failed: objective not met
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      // Percentage score based on objectives met
    },
    timeTakenSeconds: {
      type: Number,
      // How long user spent on this attempt
    },

    // Evidence & feedback (for future expansion)
    evidenceSubmitted: {
      type: String,
      // JSON or text: proof of completion
      // e.g., screenshot hash, log excerpt, JSON result
    },
    mentorFeedback: {
      type: String,
      // Feedback from instructor/automated grader
    },

    // For tracking completeness
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("LabAttempt", labAttemptSchema);

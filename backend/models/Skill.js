import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // e.g., "Log Analysis", "Brute Force Detection", "Vulnerability Assessment"
    },
    description: {
      type: String,
      required: true,
      // What this skill entails
    },
    difficulty: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
      // Inherited from linked modules, but can override
    },
    requiredModules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    requiredLabCount: {
      type: Number,
      default: 0,
      // # of labs user must pass to master this skill
    },
    assessmentType: {
      type: String,
      enum: ["quiz", "lab", "both"],
      default: "both",
      // What kind of assessment is needed
    },
    tags: {
      type: [String],
      default: [],
      // e.g., ["logging", "analysis", "network"]
    },
    estimatedHours: {
      type: Number,
      default: 8,
      // Time needed for average learner
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);

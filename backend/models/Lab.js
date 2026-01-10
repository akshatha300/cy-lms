import mongoose from "mongoose";

const labSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // e.g., "Brute Force Detection Lab", "SQL Injection Defense"
    },
    description: {
      type: String,
      required: true,
      // Brief overview
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
      // Which skill this lab teaches
    },
    difficulty: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    scenario: {
      type: String,
      enum: ["attack", "defense", "both"],
      default: "both",
      // attack: simulate an attack, user must detect/defend
      // defense: user must harden systems
      // both: multi-stage
    },
    objectiveText: {
      type: String,
      required: true,
      // What the user needs to accomplish
      // e.g., "Detect the brute force attack in the log file within 5 minutes"
    },

    // Future implementation details (optional for now)
    environment: {
      type: String,
      enum: ["docker", "vm", "cloud", "simulated"],
      default: "simulated",
      // Where/how the lab runs
    },
    timeLimit: {
      type: Number,
      // minutes allowed for this lab
    },
    requiredTools: {
      type: [String],
      default: [],
      // e.g., ["Splunk", "Wireshark", "Linux CLI"]
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lab", labSchema);

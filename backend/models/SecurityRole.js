import mongoose from "mongoose";

const securityRoleSchema = new mongoose.Schema(
  {
    assignedModules: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Module",
  required: true
}],
moduleCount: {
  type: Number,
  default: 5,
  min: 1,
  max: 20
},
 assignedLabs: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Lab",
  required: true
}],
labCount: {
  type: Number,
  default: 0,
  min: 0,
  max: 10},

    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // e.g., "SOC Analyst L1", "Penetration Tester", "Cloud Security Engineer"
    },
    description: {
      type: String,
      required: true,
      // What this role does, career path
    },
    seniority: {
      type: String,
      enum: ["entry", "mid", "senior"],
      default: "entry",
    },
    requiredSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    requiredLabCount: {
      type: Number,
      default: 0,
      // Minimum # of labs user must complete to master this role
    },
    estimatedHoursToComplete: {
      type: Number,
      default: 40,
      // Estimated time for average learner
    },
    tags: {
      type: [String],
      default: [],
      // e.g., ["soc", "network", "detection"], "pentest", "cloud"
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SecurityRole", securityRoleSchema);

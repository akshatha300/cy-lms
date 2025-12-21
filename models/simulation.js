import mongoose from "mongoose";

const simulationSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: false },
  title: { type: String, required: true },
  emailSubject: { type: String, required: true },
  emailBody: { type: String, required: true },
  landingUrl: { type: String },            // simulated malicious URL (informational)
  metadata: { type: Object, default: {} }, // e.g., indicators: ["typo", "suspicious-domain"]
  difficulty: { type: Number, default: 1 },
  generatedByAI: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // admin who created it
}, { timestamps: true });

export default mongoose.model("Simulation", simulationSchema);

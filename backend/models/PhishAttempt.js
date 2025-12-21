import mongoose from "mongoose";

const phishAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  simulationId: { type: mongoose.Schema.Types.ObjectId, ref: "Simulation", required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
  action: { type: String, enum: ["clicked", "reported", "ignored"], required: true },
  isPhish: { type: Boolean }, // whether the simulation was actually phishing (true) or safe (false)
  timeTakenSeconds: { type: Number, default: null },
  notes: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("PhishAttempt", phishAttemptSchema);

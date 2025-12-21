import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true },   // Add this field
  seq: { type: Number, default: 0 }
});

export default mongoose.model("Counter", counterSchema);

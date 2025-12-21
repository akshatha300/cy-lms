import mongoose from "mongoose";

const DocEmbeddingSchema = new mongoose.Schema({
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },  // vector
  metadata: {
    filename: String,
    topic: String,
  },
});

export default mongoose.model("DocEmbedding", DocEmbeddingSchema);

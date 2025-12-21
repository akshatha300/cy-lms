import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    difficulty: { type: Number, default: 1 }, // 1-easy ... 5-hard
    tags: { type: [String], default: [] }, // e.g. ["phishing","passwords"]
    published: { type: Boolean, default: true }, // optional

    // Optional learning materials attached to this module
    // This is additive and does not affect existing modules.
    materials: {
      type: [
        {
          title: { type: String, required: true },
          type: {
            type: String,
            enum: ["video", "pdf", "article", "link", "text"],
            default: "article",
          },
          // For file or external resources
          url: { type: String, default: "" },
          // For inline notes / text content
          content: { type: String, default: "" },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Module", moduleSchema);

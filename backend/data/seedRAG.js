import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Docembbeding from "../models/Docembbeding.js";
import { generateEmbedding } from "../services/embeddingService.js";
import connectDB from "../config/db.js";

dotenv.config();

const docsPath = path.join(process.cwd(), "data/ml_docs");

const seed = async () => {
  await connectDB();
  await Docembbeding.deleteMany({});

  const files = fs.readdirSync(docsPath);
  for (let file of files) {
    const text = fs.readFileSync(path.join(docsPath, file), "utf8");
    const embedding = await generateEmbedding(text);

    await Docembbeding.create({
      text,
      embedding,
      metadata: { filename: file }
    });

    console.log(`Embedded: ${file}`);
  }

  console.log("RAG data loaded.");
  process.exit(0);
};

seed();

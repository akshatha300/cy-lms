import fs from "fs";
import path from "path";
import url from "url";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { getEmbedding } from "../services/embeddingService.js";
import { upsertDocuments } from "../services/vectorStoreChroma.js";

dotenv.config();

// Resolve project root and docs folder
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const docsPath = path.join(__dirname, "..", "data", "cybersecurity_docs");

const CHUNK_SIZE_CHARS = 1200; // ~300–400 tokens rough estimate

const chunkText = (text) => {
  const cleaned = (text || "").replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];

  const chunks = [];
  let start = 0;
  while (start < cleaned.length) {
    const end = Math.min(start + CHUNK_SIZE_CHARS, cleaned.length);
    const slice = cleaned.slice(start, end);
    chunks.push(slice);
    start = end;
  }
  return chunks;
};

const run = async () => {
  try {
    console.log("Connecting to DB (for consistency)...");
    await connectDB();

    const files = fs.readdirSync(docsPath).filter((f) => f.endsWith(".txt"));
    console.log(`Found ${files.length} docs in ${docsPath}`);

    let totalChunks = 0;

    for (const file of files) {
      const fullPath = path.join(docsPath, file);
      const text = fs.readFileSync(fullPath, "utf8");
      const chunks = chunkText(text);

      console.log(`Indexing ${file} with ${chunks.length} chunks...`);

      const ids = [];
      const documents = [];
      const metadatas = [];
      const embeddings = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const id = `doc:${file}:chunk:${i}`;

        ids.push(id);
        documents.push(chunk);
        metadatas.push({
          type: "course_material",
          title: file.replace(/\.txt$/i, ""),
          filename: file,
          chunkIndex: i,
        });

        const embedding = await getEmbedding(chunk);
        embeddings.push(embedding);
      }

      await upsertDocuments({ ids, documents, metadatas, embeddings });
      totalChunks += chunks.length;
    }

    console.log(`Finished indexing. Total chunks: ${totalChunks}`);
    process.exit(0);
  } catch (err) {
    console.error("Error indexing LMS content:", err);
    process.exit(1);
  }
};

run();


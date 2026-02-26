import fs from "fs";
import path from "path";
import url from "url";
import { getEmbedding } from "./embeddingService.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const docsPath = path.join(__dirname, "..", "data", "ml_docs");

const CHUNK_SIZE_CHARS = 1200;
let indexPromise = null;

const chunkText = (text) => {
  const cleaned = (text || "").replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];

  const chunks = [];
  let start = 0;
  while (start < cleaned.length) {
    const end = Math.min(start + CHUNK_SIZE_CHARS, cleaned.length);
    chunks.push(cleaned.slice(start, end));
    start = end;
  }
  return chunks;
};

const cosineSim = (a, b) => {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i++) {
    const va = a[i] || 0;
    const vb = b[i] || 0;
    dot += va * vb;
    na += va * va;
    nb += vb * vb;
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1;
  return dot / denom;
};

const buildIndex = async () => {
  const files = fs.existsSync(docsPath)
    ? fs.readdirSync(docsPath).filter((f) => f.endsWith(".txt"))
    : [];

  const entries = [];

  for (const file of files) {
    const fullPath = path.join(docsPath, file);
    const text = fs.readFileSync(fullPath, "utf8");
    const chunks = chunkText(text);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await getEmbedding(chunk);
      entries.push({
        embedding,
        document: chunk,
        metadata: {
          type: "course_material",
          title: file.replace(/\.txt$/i, ""),
          filename: file,
          chunkIndex: i,
        },
      });
    }
  }

  return entries;
};

export const getLocalRagIndex = async () => {
  if (!indexPromise) {
    indexPromise = buildIndex().catch((err) => {
      console.error("Failed to build local RAG index:", err);
      return [];
    });
  }
  return indexPromise;
};

export const searchLocalRag = async (queryEmbedding, topK = 6) => {
  const entries = await getLocalRagIndex();
  if (!entries.length) return [];

  const scored = entries.map((e) => ({
    ...e,
    score: cosineSim(queryEmbedding, e.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
};


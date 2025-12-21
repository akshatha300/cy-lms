import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazily configure Gemini embeddings model so the app can still boot
// even if GEMINI_API_KEY is missing (we'll fall back gracefully).
let embeddingModel = null;

if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
}

// Simple deterministic fallback embedding if Gemini is not configured.
// This keeps RAG working (with lower quality) instead of throwing.
const fallbackEmbedding = (text) => {
  const cleaned = (text || "").trim();
  const maxLen = 512;
  const input = cleaned.length > maxLen ? cleaned.slice(0, maxLen) : cleaned;

  const dim = 128;
  const vec = new Array(dim).fill(0);

  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    const idx = i % dim;
    vec[idx] = (vec[idx] + code) % 997;
  }

  // Normalize roughly
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
};

/**
 * Low-level helper used by seeding scripts and RAG.
 * Returns a numeric embedding array for the given text.
 */
export const generateEmbedding = async (text) => {
  const cleaned = (text || "").trim();
  if (!cleaned) {
    throw new Error("Cannot generate embedding for empty text.");
  }

  // If Gemini is configured, use high-quality embeddings.
  if (embeddingModel) {
    const MAX_CHARS = 8000;
    const input = cleaned.length > MAX_CHARS ? cleaned.slice(0, MAX_CHARS) : cleaned;
    const result = await embeddingModel.embedContent(input);
    return result.embedding.values;
  }

  // Otherwise, fall back to a deterministic local embedding.
  console.warn(
    "Gemini embeddings model is not configured. Falling back to local hash-based embeddings."
  );
  return fallbackEmbedding(cleaned);
};

/**
 * High-level wrapper matching the plan: getEmbedding(text)
 * so other services can depend on a clear API.
 */
export const getEmbedding = async (text) => {
  return generateEmbedding(text);
};


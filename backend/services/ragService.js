import { getEmbedding } from "./embeddingService.js";
import { searchLocalRag } from "./localRagIndex.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const RAG_TOP_K = Number(process.env.RAG_TOP_K || 6);
const RAG_MAX_CONTEXT_CHARS = Number(process.env.RAG_MAX_CONTEXT_CHARS || 8000);

let geminiModel = null;
if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

const buildContextString = (results) => {
  const pieces = [];
  let totalChars = 0;

  results.forEach((r, idx) => {
    const title = r.metadata?.title || r.metadata?.filename || `Doc ${idx + 1}`;
    const type = r.metadata?.type || "course_material";

    const header = `Source ${idx + 1} [${type}] - ${title}`;
    const body = r.document || "";
    const chunk = `${header}\n${body}\n\n`;

    if (totalChars + chunk.length <= RAG_MAX_CONTEXT_CHARS) {
      pieces.push(chunk);
      totalChars += chunk.length;
    }
  });

  return pieces.join("\n");
};

export const answerWithRAG = async (query, history = []) => {
  const trimmed = (query || "").trim();

  if (!trimmed) {
    return {
      answer:
        "Please ask a question about phishing, passwords, malware, or network security so I can help.",
      sources: [],
    };
  }

  try {
    // 1. Embed query
    const queryEmbedding = await getEmbedding(trimmed);

    // 2. Retrieve most relevant chunks from local index (no external DB needed)
    const results = await searchLocalRag(queryEmbedding, RAG_TOP_K);

    // Map to simple sources structure for the frontend
    const sources = results.map((r) => ({
      title: r.metadata?.title || r.metadata?.filename || "Course material",
      type: r.metadata?.type || "course_material",
      snippet: (r.document || "").slice(0, 300),
      filename: r.metadata?.filename,
      chunkIndex: r.metadata?.chunkIndex,
    }));

    const contextString = buildContextString(results);

    // If we don't have a model, return a simple, friendly answer using any context we have.
    if (!geminiModel) {
      const base =
        "Here's what I can share based on my built‑in cybersecurity knowledge.";
      const withContext =
        contextString && contextString.trim().length > 0
          ? `${base}\n\nHere are some relevant excerpts from your course materials:\n\n${contextString}`
          : base;

      return {
        answer: withContext,
        sources,
      };
    }

    // 3. Build Gemini prompt
    const conversation = Array.isArray(history)
      ? history.join("\n")
      : String(history || "");

//     const prompt = `You are a helpful cybersecurity tutor for an LMS.
// Use ONLY the context from the student's course materials below to answer.
// If the context does not contain the answer, say you are not sure and suggest
// which module or topic they should review.

    const prompt = `You are a friend of mine.

CONTEXT:
${contextString}

CONVERSATION SO FAR:
${conversation}

STUDENT QUESTION:
${trimmed}

Respond in a friendly, clear way that a learner can understand.`;

    // 4. Call Gemini
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    const finalAnswer =
      (text || "").trim() ||
      "Here's a general explanation based on my cybersecurity knowledge. If you need more detail, try asking a more specific question.";

    return {
      answer: finalAnswer,
      sources,
    };
  } catch (err) {
    console.error("answerWithRAG error:", err);
    return {
      answer:
        "Here's a general cybersecurity answer for now. If this doesn't seem right, please try rephrasing your question or checking your course modules.",
      sources: [],
    };
  }
};

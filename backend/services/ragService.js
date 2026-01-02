import { getEmbedding } from "./embeddingService.js";
import { searchLocalRag } from "./localRagIndex.js";
import fetch from "node-fetch";

const RAG_TOP_K = Number(process.env.RAG_TOP_K || 6);
const RAG_MAX_CONTEXT_CHARS = Number(process.env.RAG_MAX_CONTEXT_CHARS || 8000);

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

    // If we don't have Groq API key, return context with fallback message
    if (!process.env.GROQ_API_KEY) {
      const base =
        "Here's what I can share based on my built-in cybersecurity knowledge.";
      const withContext =
        contextString && contextString.trim().length > 0
          ? `${base}\n\nHere are some relevant excerpts from your course materials:\n\n${contextString}`
          : base;

      return {
        answer: withContext,
        sources,
      };
    }

    // 3. Build RAG prompt for Groq
    const conversation = Array.isArray(history)
      ? history.join("\n")
      : String(history || "");

    const prompt = `You are a helpful cybersecurity tutor for an LMS.
Use the context from the student's course materials below to answer their question.
If the context doesn't contain the answer, say you're not sure and suggest which module or topic they should review.

CONTEXT FROM COURSE MATERIALS:
${contextString}

CONVERSATION SO FAR:
${conversation}

STUDENT QUESTION:
${trimmed}

Respond in a friendly, clear way that a learner can understand.`;

    // 4. Call Groq API
    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "You are a helpful cybersecurity tutor using course materials to answer student questions.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.4,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", response.status, errText);
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

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

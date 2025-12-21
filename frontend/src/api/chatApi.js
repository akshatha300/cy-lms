/**
 * 🔒 CHAT API CONTRACT — LOCKED
 *
 * Endpoint:
 *   POST /api/chat
 *
 * Headers:
 *   Authorization: Bearer <JWT>
 *   Content-Type: application/json
 *
 * Request Body:
 *   {
 *     message: string
 *   }
 *
 * Response Body (LOCKED SHAPE):
 *   {
 *     reply: string,
 *     difficulty: "easy" | "medium" | "hard"
 *   }
 *
 * Rules:
 * - ❌ Do NOT rename or remove `reply` or `difficulty`
 * - ✅ You MAY add new fields if required
 * - ❌ Do NOT change request body shape
 *
 * Purpose:
 * - Frontend relies on this exact structure. Any breaking change
 *   must be versioned (e.g., /api/v2/chat).
 */

import axiosClient from "./axiosClient";

export const sendChatMessage = async (message, history = []) => {
  const response = await axiosClient.post("/chat", { message, history });

  // Debug: log raw response
  console.log("=== API: Raw axios response ===");
  console.log("Response:", response);
  console.log("Response.data:", response.data);
  console.log("Response.data.reply:", response.data?.reply);
  console.log("Response.data type:", typeof response.data);

  // Validate response structure
  if (!response.data || typeof response.data !== "object") {
    console.error("Invalid response.data structure:", response.data);
    throw new Error("Invalid response from server");
  }

  if (!response.data.reply || typeof response.data.reply !== "string") {
    console.error("Missing or invalid reply field:", response.data);
    throw new Error("Server response missing reply field");
  }

  return response.data;
};

export const fetchChatHistory = async () => {
  const response = await axiosClient.get("/chat/history");
  return response.data;
};

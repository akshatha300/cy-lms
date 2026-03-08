import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "crypto";

import authRoutes from "./routes/authRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import ragRoutes from "./routes/ragRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import questionRoutes from "./routes/QuestionRoutes.js";
import attemptRoutes from "./routes/attemptRoutes.js";
import adaptiveRoutes from "./routes/adaptiveroutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import skillProgressRoutes from "./routes/skillProgressRoutes.js";
import labRoutes from "./routes/labRoutes.js";
<<<<<<< Updated upstream
import simpleRoleRoutes from "./routes/simpleRoleRoutes.js";
import { runCode, evaluateCode, submitLab } from "./controllers/codeExecController.js";
=======
import labExecutionRoutes from "./routes/labExecutionRoutes.js";
import enhancedChatRoutes from "./routes/enhancedChatRoutes.js";
import basicCareerRoadmapRoutes from "./routes/basicCareerRoadmapRoutes.js";
>>>>>>> Stashed changes

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import logger from "./utils/logger.js";

const parseAllowedOrigins = () => {
  const raw =
    process.env.CORS_ORIGINS ||
    process.env.CORS_ORIGIN ||
    "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174";

  const origins = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return origins;
};

export const createApp = () => {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));

  const allowedOrigins = parseAllowedOrigins();
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") || [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "https://cy-lmsproject-6fm3asp01-akshatha-js-projects.vercel.app",
      "https://cy-lmsproject-git-main-akshatha-js-projects.vercel.app",
      "https://cy-lmsproject-pg08cjudc-akshatha-js-projects.vercel.app",
      "https://cy-lmsproject-git-main-akshatha-js-projects.vercel.app",
    ],
    credentials: true,
  })
);

  app.use((req, res, next) => {
    const id =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : crypto.randomBytes(16).toString("hex");
    req.id = id;
    res.setHeader("X-Request-Id", id);

    const start = process.hrtime.bigint();
    res.on("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
      if (process.env.NODE_ENV !== "test") {
        logger.info("request", {
          id,
          method: req.method,
          path: req.originalUrl,
          status: res.statusCode,
          durationMs: Math.round(durationMs * 100) / 100,
        });
      }
    });

    next();
  });

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 40,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 80,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api", apiLimiter);

  app.use("/api/users", userRoutes);
  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/modules", moduleRoutes);
  app.use("/api/chat", aiLimiter, chatRoutes);
  app.use("/api/rag", aiLimiter, ragRoutes);
  app.use("/api/progress", progressRoutes);
  app.use("/api/questions", questionRoutes);
  app.use("/api/attempts", attemptRoutes);
  app.use("/api/adaptive", adaptiveRoutes);
  app.use("/api/certificates", certificateRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/skills", skillRoutes);
  app.use("/api/skill-progress", skillProgressRoutes);
  app.use("/api/labs", labRoutes);
<<<<<<< Updated upstream
  app.use("/api/roles", simpleRoleRoutes);

  // Python Code Execution Routes
  app.post("/run", runCode);
  app.post("/evaluate", evaluateCode);
  app.post("/submit", submitLab);
=======
  app.use("/api/lab-execution", labExecutionRoutes);
  app.use("/api/enhanced-chat", enhancedChatRoutes);
  app.use("/api/career-roadmap", basicCareerRoadmapRoutes);
>>>>>>> Stashed changes

  app.get("/", (req, res) => {
    res.send("AIML Learning Platform Backend Running");
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

const app = createApp();
export default app;

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "crypto";

import authRoutes from "./routes/authRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import ragRoutes from "./routes/ragRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import questionRoutes from "./routes/QuestionRoutes.js";
import attemptRoutes from "./routes/attemptRoutes.js";
import adaptiveRoutes from "./routes/adaptiveroutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import skillProgressRoutes from "./routes/skillProgressRoutes.js";
import jobReadinessRoutes from "./routes/jobReadinessRoutes.js";
import labRoutes from "./routes/labRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import logger from "./utils/logger.js";

const parseAllowedOrigins = () => {
  const raw =
    process.env.CORS_ORIGINS ||
    process.env.CORS_ORIGIN ||
    "http://localhost:5173,http://127.0.0.1:5173";

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
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes("*")) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("Not allowed by CORS"));
      },
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
  app.use("/api/logs", logRoutes);
  app.use("/api/progress", progressRoutes);
  app.use("/api/questions", questionRoutes);
  app.use("/api/attempts", attemptRoutes);
  app.use("/api/adaptive", adaptiveRoutes);
  app.use("/api/certificates", certificateRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/roles", roleRoutes);
  app.use("/api/skills", skillRoutes);
  app.use("/api/skill-progress", skillProgressRoutes);
  app.use("/api/job-readiness", jobReadinessRoutes);
  app.use("/api/labs", labRoutes);

  app.get("/", (req, res) => {
    res.send("Cybersecurity LMS Backend Running");
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

const app = createApp();
export default app;

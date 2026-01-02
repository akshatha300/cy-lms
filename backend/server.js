import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import ragRoutes from "./routes/ragRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import questionRoutes from "./routes/QuestionRoutes.js";
import attemptRoutes from "./routes/attemptRoutes.js";
import adaptiveRoutes from "./routes/adaptiveroutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";




dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/rag", ragRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/adaptive", adaptiveRoutes);
app.use("/api/certificates", certificateRoutes);


app.get("/", (req, res) => {
  res.send("Cybersecurity LMS Backend Running");
});

// ERROR HANDLERS (LAST)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import matchingRoutes from "./routes/matchingRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import platformRoutes from "./routes/platformRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import collegeStaffRoutes from "./routes/collegeStaffRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded reliably from backend directory, project root, and process.cwd()
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "final_project/backend/.env") });
dotenv.config();

// Ensure uploads directory exists
const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect to MongoDB asynchronously using environment variables
connectDB().catch((err) => {
  console.error(err.message || err);
});

const app = express();
// Use PORT environment variable as required (avoiding 3000 if reserved for frontend)
const PORT = process.env.PORT && process.env.PORT !== "3000" ? process.env.PORT : 5000;

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes("*") || process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    return callback(null, true); // Allow during dev/preview
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

// Health check endpoint (as specified in guidelines)
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "SkillMap API is running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/candidate/profile", profileRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/platform", platformRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/institution", collegeStaffRoutes);
app.use("/api/college-staff", collegeStaffRoutes);
app.use("/api/documents", documentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Centralized error handler
app.use((err, req, res, _next) => {
  if (
    err.name === "MongooseError" ||
    err.name === "MongoNetworkError" ||
    err.name === "MongoServerSelectionError" ||
    (err.message && err.message.includes("buffering timed out")) ||
    (err.message && err.message.includes("ECONNREFUSED"))
  ) {
    console.error("[Database Connection Issue]:", err.message);
    return res.status(503).json({
      success: false,
      message: "Database is currently unavailable. Please verify that MONGO_URI is properly configured and accessible."
    });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", ") || "Validation failed"
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with this unique identifier already exists"
    });
  }

  // Multer file upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    const maxMb = process.env.MAX_FILE_SIZE_MB || "10";
    return res.status(400).json({
      success: false,
      message: `File size exceeds maximum permitted limit (${maxMb}MB).`
    });
  }

  if (err.message && err.message.includes("Invalid file format")) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  console.error("Server Error:", err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(`Skill Map backend running on http://localhost:${PORT}`);
});

export default app;

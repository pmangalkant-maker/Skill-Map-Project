import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  uploadResume,
  getResume,
  deleteResume,
  extractSkills
} from "../controllers/resumeController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const router = Router();
router.use(authMiddleware);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`);
    }
  }),
  limits: {
    fileSize: (Number(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain"
    ];
    const allowedExtensions = [".pdf", ".docx", ".doc", ".txt"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedMimeTypes.includes(file.mimetype) && !allowedExtensions.includes(ext)) {
      return cb(new Error("Invalid file format. Only PDF, DOCX, DOC, and TXT files are supported."));
    }
    cb(null, true);
  }
});

const handleResumeUpload = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        const maxMb = process.env.MAX_FILE_SIZE_MB || "10";
        return res.status(400).json({
          success: false,
          message: `File size exceeds maximum permitted limit (${maxMb}MB).`
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed"
      });
    }
    next();
  });
};

router.get("/", getResume);
router.post("/upload", handleResumeUpload, uploadResume);
router.post("/extract-skills", extractSkills);
router.post("/extract", extractSkills);
router.delete("/", deleteResume);

export default router;

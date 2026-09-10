import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import authMiddleware from "../middleware/authMiddleware.js";
import { listDocuments, uploadDocument, downloadDocument, deleteDocument } from "../controllers/documentController.js";

const router = Router();
const uploadDir = path.resolve(process.cwd(), "uploads", "documents");
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024 }
});

router.use(authMiddleware);
router.get("/", listDocuments);
router.post("/", upload.single("document"), uploadDocument);
router.get("/:id/download", downloadDocument);
router.delete("/:id", deleteDocument);

export default router;

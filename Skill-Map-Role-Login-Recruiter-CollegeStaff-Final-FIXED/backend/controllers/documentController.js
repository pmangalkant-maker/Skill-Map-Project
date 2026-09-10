import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import Document from "../models/Document.js";
import { dataStore } from "../services/dataStore.js";

const ALLOWED = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "image/png",
  "image/jpeg",
  "image/webp"
]);

const CATEGORIES = new Set(["certificate", "internship_report", "academic_record", "portfolio_document", "other"]);

function safeName(name) {
  return path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function listDocuments(req, res, next) {
  try {
    const ownerId = req.userId.toString();
    if (dataStore.isMongoConnected()) {
      const docs = await Document.find({ ownerId }).select("-storagePath").sort({ createdAt: -1 }).lean();
      return res.json({ success: true, documents: docs });
    }
    res.json({ success: true, documents: [] });
  } catch (err) { next(err); }
}

export async function uploadDocument(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Please select a document." });
    if (!ALLOWED.has(req.file.mimetype)) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ success: false, message: "Unsupported document type. Use PDF, DOC/DOCX or PNG/JPG/WEBP." });
    }
    const category = String(req.body.category || "other");
    if (!CATEGORIES.has(category)) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ success: false, message: "Invalid document category." });
    }

    const ownerId = req.userId.toString();
    const ownerRole = req.user?.role || "student";
    const storedName = `${ownerId}-${crypto.randomUUID()}-${safeName(req.file.originalname)}`;

    // Multer wrote a temporary file; move it to an owner-scoped name.
    const finalPath = path.join(path.dirname(req.file.path), storedName);
    await fs.rename(req.file.path, finalPath);

    if (dataStore.isMongoConnected()) {
      const doc = await Document.create({
        ownerId, ownerRole, category,
        originalName: safeName(req.file.originalname),
        storedName,
        mimeType: req.file.mimetype,
        size: req.file.size,
        storagePath: finalPath,
        metadata: { uploadedFrom: "Skill Map document manager" }
      });
      return res.status(201).json({
        success: true,
        message: "Document uploaded securely.",
        document: { ...doc.toObject(), storagePath: undefined }
      });
    }

    // Without MongoDB, retain the file but do not pretend persistence exists.
    await fs.unlink(finalPath).catch(() => {});
    return res.status(503).json({
      success: false,
      message: "Document storage requires MongoDB. Your existing resume flow is unaffected."
    });
  } catch (err) { next(err); }
}

export async function downloadDocument(req, res, next) {
  try {
    const ownerId = req.userId.toString();
    if (!dataStore.isMongoConnected()) {
      return res.status(503).json({ success: false, message: "Document storage is currently unavailable." });
    }
    const doc = await Document.findOne({ _id: req.params.id, ownerId });
    if (!doc) return res.status(404).json({ success: false, message: "Document not found or access denied." });
    res.setHeader("Content-Type", doc.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${safeName(doc.originalName)}"`);
    return res.sendFile(path.resolve(doc.storagePath));
  } catch (err) { next(err); }
}

export async function deleteDocument(req, res, next) {
  try {
    const ownerId = req.userId.toString();
    if (!dataStore.isMongoConnected()) return res.status(503).json({ success: false, message: "Document storage is currently unavailable." });
    const doc = await Document.findOneAndDelete({ _id: req.params.id, ownerId });
    if (!doc) return res.status(404).json({ success: false, message: "Document not found or access denied." });
    await fs.unlink(doc.storagePath).catch(() => {});
    res.json({ success: true, message: "Document deleted." });
  } catch (err) { next(err); }
}

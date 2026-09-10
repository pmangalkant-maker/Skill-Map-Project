import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true, index: true },
  originalName: { type: String, required: true },
  storedName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  extractedText: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
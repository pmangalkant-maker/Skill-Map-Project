import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  ownerId: { type: String, required: true, index: true },
  ownerRole: { type: String, required: true, enum: ["student", "recruiter", "college_staff", "academician", "industry", "institution"] },
  category: {
    type: String,
    required: true,
    enum: ["certificate", "internship_report", "academic_record", "portfolio_document", "other"]
  },
  originalName: { type: String, required: true, trim: true },
  storedName: { type: String, required: true, unique: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  storagePath: { type: String, required: true },
  verificationStatus: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

documentSchema.index({ ownerId: 1, category: 1, createdAt: -1 });

export default mongoose.model("Document", documentSchema);

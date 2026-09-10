import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true },
  candidateId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true },
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, default: "" },
  opportunityId: { type: String, required: true },
  opportunityTitle: { type: String, required: true },
  offerType: { type: String, enum: ["Internship", "Job"], required: true },
  stipendOrSalary: { type: String, required: true },
  durationOrEmployment: { type: String, default: "Full-Time" },
  startDate: { type: Date, required: true },
  status: { type: String, enum: ["Offered", "Accepted", "Rejected", "Pending", "Expired"], default: "Offered" },
  notes: { type: String, default: "" },
  expiresAt: { type: Date }
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);

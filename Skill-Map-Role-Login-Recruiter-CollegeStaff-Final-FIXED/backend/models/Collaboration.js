import mongoose from "mongoose";

const collaborationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["Mentorship", "Workshop", "Guest Lecture", "Innovation Challenge", "Live Project", "Research", "Consultancy", "FDP", "Faculty Internship", "Industrial Training"], required: true },
  organization: { type: String, required: true },
  audience: { type: String, enum: ["Student", "Academician", "Institution", "All"], default: "All" },
  skills: [{ type: String }],
  description: { type: String, default: "" },
  startDate: { type: Date },
  deadline: { type: Date },
  seats: { type: Number, default: 25 },
  partnerInstitution: { type: String, default: "All Partner Institutions" },
  createdBy: { type: mongoose.Schema.Types.Mixed, ref: "User" },
  contactEmail: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Collaboration", collaborationSchema);

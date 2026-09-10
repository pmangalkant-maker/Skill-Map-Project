import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, default: "Industry Partner" },
  salary: { type: String, default: "Competitive" },
  stipend: { type: String },
  duration: { type: String },
  deadline: { type: Date },
  type: { type: String, enum: ["Job", "Internship", "Project"], required: true },
  workMode: { type: String, enum: ["On-site", "Hybrid", "Remote"], default: "Hybrid" },
  employmentType: { type: String, enum: ["Full-time", "Part-time", "Contract", "Internship"], default: "Full-time" },
  requiredSkills: [{ type: String }],
  softSkills: [{ type: String }],
  preferredSkills: [{ type: String }],
  location: { type: String, default: "Hybrid / Remote" },
  experienceLevel: { type: String },
  education: { type: String },
  eligibility: { type: String },
  teamSize: { type: String },
  expectedOutcome: { type: String },
  description: { type: String },
  status: { type: String, enum: ["Active", "Closed", "Draft"], default: "Active" },
  applicantsCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.Mixed, ref: "User" },
  sourceUrl: { type: String },
  isDemo: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Opportunity", opportunitySchema);
import mongoose from "mongoose";

const recruiterProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true, unique: true },
  companyName: { type: String, default: "Apex Global Technologies" },
  industry: { type: String, default: "Software & Cloud Services" },
  website: { type: String, default: "https://apextechnologies.io" },
  companySize: { type: String, default: "250-500 Employees" },
  headquarters: { type: String, default: "San Francisco, CA & Remote" },
  bio: { type: String, default: "Building next-generation cloud infrastructure, developer tools, and intelligent data systems." },
  culture: { type: String, default: "Autonomous teams, continuous learning, high-trust engineering culture, and transparent growth tracks." },
  recruiterName: { type: String, default: "Sarah Jenkins" },
  recruiterTitle: { type: String, default: "Senior Technical Talent Lead" },
  contactEmail: { type: String, default: "recruiter@skillmap.demo" },
  contactPhone: { type: String, default: "+1 (555) 438-9201" },
  hiringLocations: [{ type: String }],
  preferredWorkModes: [{ type: String }]
}, { timestamps: true });

export default mongoose.model("RecruiterProfile", recruiterProfileSchema);

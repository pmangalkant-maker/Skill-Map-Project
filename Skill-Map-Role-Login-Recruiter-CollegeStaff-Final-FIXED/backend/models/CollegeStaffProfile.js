import mongoose from "mongoose";

const collegeStaffProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true, unique: true },
  institutionName: { type: String, default: "Apex Institute of Science & Technology" },
  institutionCode: { type: String, default: "AIST-EDU-1049" },
  accreditation: { type: String, default: "NAAC A++ Grade · NBA Tier-1 · NIRF Top 40" },
  affiliation: { type: String, default: "Autonomous University System · Approved by AICTE / UGC" },
  website: { type: String, default: "https://aist.edu" },
  campusAddress: { type: String, default: "Innovation Park, Tech Corridor, Bengaluru / San Francisco" },
  placementCellName: { type: String, default: "Centre for Career Guidance, Corporate Relations & Placements (CGCR)" },
  headOfPlacement: { type: String, default: "Dr. Rajeshwar K. Sharma, Ph.D." },
  headTitle: { type: String, default: "Dean - Industry Relations & Career Development" },
  contactEmail: { type: String, default: "staff@skillmap.demo" },
  contactPhone: { type: String, default: "+1 (555) 789-3210" },
  establishedYear: { type: String, default: "1998" },
  totalStudents: { type: Number, default: 2486 },
  placementRate: { type: String, default: "91.4%" },
  activeMoUs: { type: Number, default: 52 },
  departments: [{
    name: String,
    code: String,
    studentCount: Number,
    placementRate: String,
    hod: String
  }],
  overview: {
    type: String,
    default: "Premier technological and management institution focused on outcome-based education, continuous industry-aligned skill mapping, experiential capstone projects, and robust corporate placement ecosystems."
  }
}, { timestamps: true });

export default mongoose.model("CollegeStaffProfile", collegeStaffProfileSchema);

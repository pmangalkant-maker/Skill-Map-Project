import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => `sk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
  },
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    trim: true,
    default: "Technical Skills"
  },
  level: {
    type: String,
    trim: true,
    default: "Intermediate"
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 70
  },
  targetScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 85
  },
  status: {
    type: String,
    trim: true,
    default: "Self-Assessed"
  },
  source: {
    type: String,
    trim: true,
    default: "manual"
  },
  isAiExtracted: {
    type: Boolean,
    default: false
  },
  aiConfidence: {
    type: Number,
    min: 0,
    max: 100
  },
  confirmedByCandidate: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  phone: { type: String, trim: true },
  headline: { type: String, trim: true },
  bio: { type: String, trim: true },
  education: { type: String, trim: true },
  degree: { type: String, trim: true },
  department: { type: String, trim: true },
  graduationYear: { type: String, trim: true },
  experienceLevel: { type: String, trim: true },
  targetRole: { type: String, trim: true, default: "Full Stack Cloud Engineer" },
  location: { type: String, trim: true },
  role: { type: String, enum: ["student", "recruiter", "college_staff", "academician", "industry", "institution"], default: "student" },
  portfolio: {
    summary: { type: String, default: "" },
    projects: [{ title: String, description: String, skills: [String], url: String, verified: Boolean }],
    certifications: [{ name: String, issuer: String, year: String, credentialUrl: String, verified: Boolean }],
    achievements: [{ title: String, issuer: String, year: String, verified: Boolean }]
  },
  placementStatus: { type: String, default: "Actively Seeking" },
  readinessScore: { type: Number, default: 78 },
  careerInterests: [{ type: String, trim: true }],
  skills: [skillSchema]
}, { timestamps: true });

export default mongoose.model("User", userSchema);

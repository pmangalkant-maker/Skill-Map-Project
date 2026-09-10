import mongoose from "mongoose";

const skillAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true, index: true },
  targetRole: { type: String, required: true },
  requiredSkills: [{ type: String }],
  matchedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  partialSkills: [{ type: String }],
  matchPercentage: { type: Number, min: 0, max: 100 }
}, { timestamps: true });

export default mongoose.model("SkillAnalysis", skillAnalysisSchema);
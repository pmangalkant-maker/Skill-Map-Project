import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String },
  duration: { type: String },
  completed: { type: Boolean, default: false }
}, { _id: false });

const moduleSchema = new mongoose.Schema({
  moduleId: { type: String, required: true },
  title: { type: String, required: true },
  stage: { type: String, required: true },
  stageNumber: { type: Number, default: 1 },
  skillFocus: { type: String, default: "" },
  description: { type: String, default: "" },
  estimatedHours: { type: Number, default: 20 },
  completedHours: { type: Number, default: 0 },
  modulesCount: { type: Number, default: 4 },
  completedModules: { type: Number, default: 0 },
  skillsGained: [{ type: String }],
  keyTopics: [{ type: String }],
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed", "Upcoming", "not-started", "in-progress", "completed"],
    default: "Not Started"
  },
  lessons: [lessonSchema]
}, { timestamps: true });

const roadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true, unique: true, index: true },
  targetRole: { type: String, default: "Full Stack Cloud Engineer" },
  currentSkillLevel: { type: String, default: "Early Professional / Intermediate" },
  missingSkills: [{ type: String }],
  modules: [moduleSchema]
}, { timestamps: true });

export default mongoose.model("Roadmap", roadmapSchema);

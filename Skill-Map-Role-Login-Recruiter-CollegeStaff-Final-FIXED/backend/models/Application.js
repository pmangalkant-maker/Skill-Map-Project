import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true, index: true },
  recruiterId: { type: mongoose.Schema.Types.Mixed, ref: "User" },
  opportunityId: { type: String, required: true },
  opportunityTitle: { type: String, required: true },
  opportunityType: { type: String, enum: ["Job", "Internship", "Project"], default: "Job" },
  organization: { type: String, default: "Industry Partner" },
  candidateName: { type: String, default: "Candidate" },
  candidateEmail: { type: String, default: "" },
  candidateHeadline: { type: String, default: "" },
  candidateLocation: { type: String, default: "" },
  candidateEducation: { type: String, default: "" },
  status: { type: String, enum: ["Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected", "Completed"], default: "Applied" },
  stage: { type: String, enum: ["Applied", "Reviewed", "Shortlisted", "Interview", "Selected", "Hired", "Rejected"], default: "Applied" },
  matchScore: { type: Number, default: 80 },
  matchedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  interviewDetails: {
    scheduledAt: Date,
    time: String,
    mode: { type: String, default: "Google Meet" },
    interviewer: String,
    meetingLink: String,
    notes: String
  },
  offerDetails: {
    type: { type: String, enum: ["Internship", "Job"] },
    compensation: String,
    startDate: Date,
    status: { type: String, enum: ["Offered", "Accepted", "Rejected", "Pending"], default: "Pending" },
    notes: String
  },
  appliedAt: { type: Date, default: Date.now },
  notes: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);

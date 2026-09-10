import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true },
  candidateId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true },
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, default: "" },
  opportunityId: { type: String, required: true },
  opportunityTitle: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true },
  mode: { type: String, enum: ["Google Meet", "Zoom", "Microsoft Teams", "In-Person", "Phone"], default: "Google Meet" },
  interviewer: { type: String, default: "Technical Hiring Team" },
  meetingLink: { type: String, default: "https://meet.google.com/skm-rec-call" },
  status: { type: String, enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled"], default: "Scheduled" },
  notes: { type: String, default: "" },
  round: { type: String, default: "Technical Screen" }
}, { timestamps: true });

export default mongoose.model("Interview", interviewSchema);

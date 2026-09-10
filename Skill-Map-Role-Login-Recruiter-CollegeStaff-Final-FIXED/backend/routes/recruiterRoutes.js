import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  getOverview,
  listJobs,
  createJob,
  updateJob,
  deleteJob,
  listInternships,
  createInternship,
  updateInternship,
  deleteInternship,
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  searchCandidates,
  matchCandidates,
  listApplications,
  updateApplicationStage,
  scheduleInterview,
  sendOffer,
  listCollaborations,
  createCollaboration,
  getSkillDemand,
  getNotifications,
  markNotificationRead,
  getProfile,
  updateProfile
} from "../controllers/recruiterController.js";

const router = Router();

// Protect all recruiter endpoints: must be authenticated and have recruiter role
router.use(authMiddleware);
router.use(requireRole("recruiter", "industry"));

// Overview
router.get("/overview", getOverview);

// Jobs
router.get("/jobs", listJobs);
router.post("/jobs", createJob);
router.put("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);

// Internships
router.get("/internships", listInternships);
router.post("/internships", createInternship);
router.put("/internships/:id", updateInternship);
router.delete("/internships/:id", deleteInternship);

// Projects
router.get("/projects", listProjects);
router.post("/projects", createProject);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

// Candidate Search & AI Matching
router.get("/candidates", searchCandidates);
router.post("/match", matchCandidates);

// Applications & Pipeline Stages
router.get("/applications", listApplications);
router.patch("/applications/:id/stage", updateApplicationStage);

// Interviews & Offers
router.post("/interviews", scheduleInterview);
router.post("/offers", sendOffer);

// Academia Collaboration
router.get("/collaborations", listCollaborations);
router.post("/collaborations", createCollaboration);

// Skill Demand Analytics
router.get("/skill-demand", getSkillDemand);

// Notifications
router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", markNotificationRead);

// Recruiter & Company Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;

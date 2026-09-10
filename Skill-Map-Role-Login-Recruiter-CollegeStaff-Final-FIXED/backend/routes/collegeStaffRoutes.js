import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  getOverview,
  listStudents,
  getStudentDetail,
  getSkillIntelligence,
  getInternships,
  updateStudentInternshipStage,
  getPlacements,
  getRecruiterConnections,
  inviteRecruiter,
  getFacultyOpportunities,
  applyFacultyOpportunity,
  getIndustryCollaborations,
  proposeCollaboration,
  getReports,
  getNotifications,
  markNotificationRead,
  getProfile,
  updateProfile
} from "../controllers/collegeStaffController.js";

const router = Router();

// Protect all college staff endpoints: must be authenticated and have college_staff/institution role
router.use(authMiddleware);
router.use(requireRole("college_staff", "institution", "academician"));

// Overview
router.get("/overview", getOverview);

// Student Progress & Monitoring
router.get("/students", listStudents);
router.get("/students/:id", getStudentDetail);

// Skill Intelligence & Gaps
router.get("/skill-intelligence", getSkillIntelligence);

// Internships Tracking
router.get("/internships", getInternships);
router.patch("/internships/student/:id/stage", updateStudentInternshipStage);

// Placements Tracking
router.get("/placements", getPlacements);

// Recruiter Connections
router.get("/recruiters", getRecruiterConnections);
router.post("/recruiters/invite", inviteRecruiter);

// Faculty Opportunities
router.get("/faculty-opportunities", getFacultyOpportunities);
router.post("/faculty-opportunities/:id/apply", applyFacultyOpportunity);

// Industry Collaboration
router.get("/collaborations", getIndustryCollaborations);
router.post("/collaborations", proposeCollaboration);

// Reports & Analytics
router.get("/reports", getReports);

// Notifications
router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", markNotificationRead);

// College Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;

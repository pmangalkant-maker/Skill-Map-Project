import { collegeStaffDataService } from "../services/collegeStaffDataService.js";

export async function getOverview(req, res, next) {
  try {
    const data = await collegeStaffDataService.getOverviewStats();
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}

export async function listStudents(req, res, next) {
  try {
    const students = await collegeStaffDataService.getStudents(req.query);
    res.json({
      success: true,
      students,
      count: students.length
    });
  } catch (err) {
    next(err);
  }
}

export async function getStudentDetail(req, res, next) {
  try {
    const { id } = req.params;
    const student = await collegeStaffDataService.getStudentById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student record not found" });
    }
    res.json({ success: true, student });
  } catch (err) {
    next(err);
  }
}

export async function getSkillIntelligence(req, res, next) {
  try {
    const data = await collegeStaffDataService.getSkillIntelligence();
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}

export async function getInternships(req, res, next) {
  try {
    const data = await collegeStaffDataService.getInternshipTracking();
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}

export async function updateStudentInternshipStage(req, res, next) {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    if (!stage) {
      return res.status(400).json({ success: false, message: "Internship stage is required" });
    }
    const result = await collegeStaffDataService.updateStudentInternshipStage(id, stage);
    res.json({ success: true, message: `Internship updated to ${stage}`, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getPlacements(req, res, next) {
  try {
    const data = await collegeStaffDataService.getPlacementTracking();
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}

export async function getRecruiterConnections(req, res, next) {
  try {
    const data = await collegeStaffDataService.getRecruiterConnections();
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}

export async function inviteRecruiter(req, res, next) {
  try {
    const { companyName, recruiterEmail } = req.body;
    if (!companyName || !recruiterEmail) {
      return res.status(400).json({ success: false, message: "Company name and recruiter email are required" });
    }
    const partner = await collegeStaffDataService.inviteRecruiter(req.body);
    res.status(201).json({ success: true, message: `Invitation dispatched to ${recruiterEmail}`, partner });
  } catch (err) {
    next(err);
  }
}

export async function getFacultyOpportunities(req, res, next) {
  try {
    const data = await collegeStaffDataService.getFacultyOpportunities();
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}

export async function applyFacultyOpportunity(req, res, next) {
  try {
    const { id } = req.params;
    const result = await collegeStaffDataService.applyFacultyOpportunity(id, req.body);
    if (!result) {
      return res.status(404).json({ success: false, message: "Faculty opportunity not found" });
    }
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getIndustryCollaborations(req, res, next) {
  try {
    const data = await collegeStaffDataService.getIndustryCollaborations();
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}

export async function proposeCollaboration(req, res, next) {
  try {
    const { title, partnerCompany, category } = req.body;
    if (!title || !partnerCompany) {
      return res.status(400).json({ success: false, message: "Collaboration title and partner company are required" });
    }
    const collaboration = await collegeStaffDataService.proposeCollaboration(req.body);
    res.status(201).json({ success: true, message: "Collaboration proposal created successfully", collaboration });
  } catch (err) {
    next(err);
  }
}

export async function getReports(req, res, next) {
  try {
    const data = await collegeStaffDataService.getReports(req.query);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}

export async function getNotifications(req, res, next) {
  try {
    const notifications = await collegeStaffDataService.getNotifications();
    res.json({ success: true, notifications, count: notifications.length });
  } catch (err) {
    next(err);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    const { id } = req.params;
    await collegeStaffDataService.markNotificationRead(id);
    res.json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const profile = await collegeStaffDataService.getProfile(req.userId);
    res.json({ success: true, profile });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updated = await collegeStaffDataService.updateProfile(req.userId, req.body);
    res.json({ success: true, message: "Institution profile updated successfully", profile: updated });
  } catch (err) {
    next(err);
  }
}

import { recruiterDataService } from "../services/recruiterDataService.js";

export async function getOverview(req, res, next) {
  try {
    const data = await recruiterDataService.getOverviewStats();
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}

export async function listJobs(req, res, next) {
  try {
    const { search, workMode, status } = req.query;
    const jobs = await recruiterDataService.getJobs({ search, workMode, status });
    res.json({ success: true, jobs, count: jobs.length });
  } catch (err) {
    next(err);
  }
}

export async function createJob(req, res, next) {
  try {
    const { title, employmentType, location, workMode, salary, requiredSkills, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Job title is required" });
    }
    const job = await recruiterDataService.createJob(req.body, req.userId);
    res.status(201).json({ success: true, message: "Job posted successfully", job });
  } catch (err) {
    next(err);
  }
}

export async function updateJob(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await recruiterDataService.updateJob(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Job posting not found" });
    }
    res.json({ success: true, message: "Job updated successfully", job: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteJob(req, res, next) {
  try {
    const { id } = req.params;
    await recruiterDataService.deleteJob(id);
    res.json({ success: true, message: "Job closed successfully" });
  } catch (err) {
    next(err);
  }
}

export async function listInternships(req, res, next) {
  try {
    const { search, workMode } = req.query;
    const internships = await recruiterDataService.getInternships({ search, workMode });
    res.json({ success: true, internships, count: internships.length });
  } catch (err) {
    next(err);
  }
}

export async function createInternship(req, res, next) {
  try {
    const { title, duration, stipend } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Internship title is required" });
    }
    const internship = await recruiterDataService.createInternship(req.body, req.userId);
    res.status(201).json({ success: true, message: "Internship posted successfully", internship });
  } catch (err) {
    next(err);
  }
}

export async function updateInternship(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await recruiterDataService.updateInternship(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Internship not found" });
    }
    res.json({ success: true, message: "Internship updated successfully", internship: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteInternship(req, res, next) {
  try {
    const { id } = req.params;
    await recruiterDataService.deleteInternship(id);
    res.json({ success: true, message: "Internship closed successfully" });
  } catch (err) {
    next(err);
  }
}

export async function listProjects(req, res, next) {
  try {
    const { search } = req.query;
    const projects = await recruiterDataService.getProjects({ search });
    res.json({ success: true, projects, count: projects.length });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    const { title, requiredSkills, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Project title is required" });
    }
    const project = await recruiterDataService.createProject(req.body, req.userId);
    res.status(201).json({ success: true, message: "Industry project published successfully", project });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await recruiterDataService.updateProject(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.json({ success: true, message: "Project updated successfully", project: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    await recruiterDataService.deleteProject(id);
    res.json({ success: true, message: "Project archived successfully" });
  } catch (err) {
    next(err);
  }
}

export async function searchCandidates(req, res, next) {
  try {
    const candidates = await recruiterDataService.getCandidates(req.query);
    res.json({
      success: true,
      candidates,
      totalCount: candidates.length,
      filteredCount: candidates.length
    });
  } catch (err) {
    next(err);
  }
}

export async function matchCandidates(req, res, next) {
  try {
    const requirements = req.body || {};
    const matches = await recruiterDataService.matchCandidates(requirements);
    res.json({ success: true, matches, count: matches.length });
  } catch (err) {
    next(err);
  }
}

export async function listApplications(req, res, next) {
  try {
    const { stage, opportunityId, search } = req.query;
    const applications = await recruiterDataService.getApplications({ stage, opportunityId, search });
    res.json({ success: true, applications, count: applications.length });
  } catch (err) {
    next(err);
  }
}

export async function updateApplicationStage(req, res, next) {
  try {
    const { id } = req.params;
    const { stage, notes } = req.body;
    if (!stage) {
      return res.status(400).json({ success: false, message: "New stage is required" });
    }
    const updated = await recruiterDataService.updateApplicationStage(id, stage, notes);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    res.json({ success: true, message: `Candidate moved to ${stage}`, application: updated });
  } catch (err) {
    next(err);
  }
}

export async function scheduleInterview(req, res, next) {
  try {
    const { candidateId, candidateName, opportunityId, opportunityTitle, date, time } = req.body;
    if (!candidateId || !opportunityId || !date || !time) {
      return res.status(400).json({ success: false, message: "Candidate, opportunity, date and time are required" });
    }
    const interview = await recruiterDataService.scheduleInterview(req.body, req.userId);
    res.status(201).json({ success: true, message: "Interview scheduled successfully", interview });
  } catch (err) {
    next(err);
  }
}

export async function sendOffer(req, res, next) {
  try {
    const { candidateId, candidateName, opportunityId, opportunityTitle, offerType, compensation } = req.body;
    if (!candidateId || !opportunityId) {
      return res.status(400).json({ success: false, message: "Candidate and opportunity details are required" });
    }
    const offer = await recruiterDataService.sendOffer(req.body, req.userId);
    res.status(201).json({ success: true, message: `${offerType || "Offer"} extended successfully`, offer });
  } catch (err) {
    next(err);
  }
}

export async function listCollaborations(req, res, next) {
  try {
    const collaborations = await recruiterDataService.getCollaborations();
    res.json({ success: true, collaborations, count: collaborations.length });
  } catch (err) {
    next(err);
  }
}

export async function createCollaboration(req, res, next) {
  try {
    const { title, type, description } = req.body;
    if (!title || !type) {
      return res.status(400).json({ success: false, message: "Title and collaboration type are required" });
    }
    const collab = await recruiterDataService.createCollaboration(req.body, req.userId);
    res.status(201).json({ success: true, message: "Academia collaboration published successfully", collaboration: collab });
  } catch (err) {
    next(err);
  }
}

export async function getSkillDemand(req, res, next) {
  try {
    const demand = recruiterDataService.getSkillDemand();
    res.json({ success: true, skillDemand: demand });
  } catch (err) {
    next(err);
  }
}

export async function getNotifications(req, res, next) {
  try {
    const notifications = recruiterDataService.getNotifications();
    const unreadCount = notifications.filter((n) => !n.read).length;
    res.json({ success: true, notifications, unreadCount });
  } catch (err) {
    next(err);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    const { id } = req.params;
    recruiterDataService.markNotificationRead(id);
    res.json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const profile = recruiterDataService.getProfile();
    res.json({ success: true, profile });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updated = recruiterDataService.updateProfile(req.body);
    res.json({ success: true, message: "Company profile updated successfully", profile: updated });
  } catch (err) {
    next(err);
  }
}

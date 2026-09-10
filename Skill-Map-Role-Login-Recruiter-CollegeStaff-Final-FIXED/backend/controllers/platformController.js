import Application from "../models/Application.js";
import Collaboration from "../models/Collaboration.js";
import Opportunity from "../models/Opportunity.js";
import User from "../models/User.js";
import { dataStore } from "../services/dataStore.js";

const demoCollaborations = [
  { id: "col-1", title: "Cloud Engineering Mentorship", type: "Mentorship", organization: "Cloud Platform Systems", audience: "Student", skills: ["AWS", "Docker", "System Design"], description: "Six-week mentor-led guidance for cloud engineering readiness.", seats: 20 },
  { id: "col-2", title: "Industry 4.0 Guest Lecture Series", type: "Guest Lecture", organization: "Industry Technology Council", audience: "All", skills: ["AI", "Cloud", "Cybersecurity"], description: "Practitioner sessions on current industry practices.", seats: 200 },
  { id: "col-3", title: "Faculty Industry Immersion", type: "FDP", organization: "Enterprise Learning Partners", audience: "Academician", skills: ["DevOps", "Data Engineering"], description: "Hands-on faculty development with industry mentors.", seats: 30 },
  { id: "col-4", title: "Live Industry Project Challenge", type: "Live Project", organization: "Digital Systems Lab", audience: "Student", skills: ["React", "Node.js", "MongoDB"], description: "Build a production-style portal with industry review.", seats: 40 },
  { id: "col-5", title: "Collaborative Applied Research", type: "Research", organization: "Technology Research Network", audience: "Institution", skills: ["AI", "Distributed Systems"], description: "Research collaboration and co-supervised projects.", seats: 12 }
];

export async function applyToOpportunity(req, res, next) {
  try {
    const { opportunityId, opportunityTitle, organization } = req.body;
    if (!opportunityId || !opportunityTitle) return res.status(400).json({ success: false, message: "Opportunity details are required" });
    if (dataStore.isMongoConnected()) {
      const existing = await Application.findOne({ userId: req.userId, opportunityId });
      if (existing) return res.json({ success: true, application: existing, alreadyApplied: true });
      const application = await Application.create({ userId: req.userId, opportunityId, opportunityTitle, organization });
      return res.status(201).json({ success: true, application });
    }
    const applications = dataStore.getMemoryApplications(req.userId);
    const existing = applications.find(a => a.opportunityId === opportunityId);
    if (existing) return res.json({ success: true, application: existing, alreadyApplied: true });
    const application = { id: `app-${Date.now()}`, userId: req.userId, opportunityId, opportunityTitle, organization, status: "Applied", appliedAt: new Date().toISOString() };
    applications.push(application);
    return res.status(201).json({ success: true, application });
  } catch (e) { next(e); }
}

export async function listApplications(req, res, next) {
  try {
    if (dataStore.isMongoConnected()) {
      const applications = await Application.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, applications });
    }
    return res.json({ success: true, applications: dataStore.getMemoryApplications(req.userId) });
  } catch (e) { next(e); }
}

export async function getPortfolio(req, res, next) {
  try {
    const user = await dataStore.findUserById(req.userId);
    res.json({ success: true, portfolio: user?.portfolio || { summary: "", projects: [], certifications: [], achievements: [] }, user: { name: user?.name, targetRole: user?.targetRole, skills: user?.skills || [] } });
  } catch (e) { next(e); }
}

export async function updatePortfolio(req, res, next) {
  try {
    const portfolio = req.body?.portfolio || req.body;
    const user = await dataStore.updateUser(req.userId, { portfolio });
    res.json({ success: true, portfolio: user?.portfolio || portfolio });
  } catch (e) { next(e); }
}

export async function listCollaborations(req, res, next) {
  try {
    let collaborations = demoCollaborations;
    if (dataStore.isMongoConnected()) {
      const db = await Collaboration.find({ isActive: true }).lean();
      if (db.length) collaborations = db.map(x => ({ ...x, id: x._id.toString() }));
    }
    const audience = req.query.audience;
    if (audience && audience !== "All") collaborations = collaborations.filter(x => x.audience === audience || x.audience === "All");
    res.json({ success: true, collaborations });
  } catch (e) { next(e); }
}

export async function createCollaboration(req, res, next) {
  try {
    const item = await Collaboration.create(req.body);
    res.status(201).json({ success: true, collaboration: { ...item.toObject(), id: item._id.toString() } });
  } catch (e) { next(e); }
}

export async function institutionAnalytics(req, res, next) {
  try {
    if (!dataStore.isMongoConnected()) return res.json({ success: true, analytics: { students: 1, verifiedSkills: 6, activeOpportunities: 5, applications: dataStore.getAllMemoryApplications().length, placementReady: 78, internshipsCompleted: 0 } });
    const [students, opportunities, applications, users] = await Promise.all([
      User.countDocuments({ role: "student" }), Opportunity.countDocuments(), Application.countDocuments(), User.find({ role: "student" }).select("skills readinessScore")
    ]);
    const verifiedSkills = users.reduce((sum, u) => sum + (u.skills || []).filter(s => s.confirmedByCandidate).length, 0);
    const placementReady = users.length ? Math.round(users.reduce((sum, u) => sum + (u.readinessScore || 0), 0) / users.length) : 0;
    res.json({ success: true, analytics: { students, verifiedSkills, activeOpportunities: opportunities, applications, placementReady, internshipsCompleted: 0 } });
  } catch (e) { next(e); }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const allowed = ["Applied","Under Review","Shortlisted","Interview","Selected","Rejected","Completed"];
    const status = String(req.body?.status || "");
    if (!allowed.includes(status)) return res.status(400).json({ success:false, message:"Invalid application status" });
    if (dataStore.isMongoConnected()) {
      const application = await Application.findOneAndUpdate({ _id:req.params.id, userId:req.userId }, { status }, { new:true });
      if (!application) return res.status(404).json({success:false,message:"Application not found"});
      return res.json({success:true,application});
    }
    const list = dataStore.getMemoryApplications(req.userId); const item=list.find(a => a.id===req.params.id || a._id===req.params.id);
    if (!item) return res.status(404).json({success:false,message:"Application not found"}); item.status=status; return res.json({success:true,application:item});
  } catch(e){ next(e); }
}

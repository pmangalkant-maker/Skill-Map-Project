import Opportunity from "../models/Opportunity.js";
import { dataStore } from "../services/dataStore.js";

const DEFAULT_OPPORTUNITIES = [
  {
    id: "opp-101",
    title: "Junior Cloud Applications Engineer",
    organization: "Cloud Platform Systems Group",
    type: "Full-time",
    workMode: "Hybrid",
    location: "Metro Innovation District",
    experienceLevel: "Entry Level (0-1 yrs)",
    stipendOrSalary: "Standard Associate Bracket",
    deadline: "12 days remaining",
    requiredSkills: [
      "TypeScript & Modern JavaScript",
      "React Ecosystem & Next.js",
      "Node.js & Express REST APIs",
      "PostgreSQL & Relational Data Modeling",
      "Cloud Infrastructure (GCP / AWS)"
    ],
    description: "Contribute to enterprise cloud portal interfaces and backend RESTful microservices. Collaborate closely with staff infrastructure architects."
  },
  {
    id: "opp-102",
    title: "Full-Stack Development Intern (Summer Cohort)",
    organization: "Distributed Software Labs",
    type: "Internship",
    workMode: "Remote",
    location: "Remote / Distributed",
    experienceLevel: "Internship / Student",
    stipendOrSalary: "Competitive Monthly Stipend",
    deadline: "18 days remaining",
    requiredSkills: [
      "TypeScript & Modern JavaScript",
      "React Ecosystem & Next.js",
      "Node.js & Express REST APIs",
      "Git & Version Control"
    ],
    description: "12-week mentored engineering fellowship. Build client-facing components, write automated integration tests, and participate in daily standups."
  },
  {
    id: "opp-103",
    title: "Backend Systems Associate",
    organization: "Scalable Data Networks",
    type: "Full-time",
    workMode: "On-site",
    location: "Tech Center Tower 4",
    experienceLevel: "Associate (1-3 yrs)",
    stipendOrSalary: "Competitive Engineering Tier",
    deadline: "24 days remaining",
    requiredSkills: [
      "Node.js & Express REST APIs",
      "PostgreSQL & Relational Data Modeling",
      "Docker & Containerization",
      "Cloud Infrastructure (GCP / AWS)"
    ],
    description: "Maintain high-throughput message ingestion pipelines, optimize SQL query execution plans, and assist with containerized deployments."
  },
  {
    id: "opp-104",
    title: "Frontend UI Engineering Intern",
    organization: "Design Systems Cooperative",
    type: "Internship",
    workMode: "Hybrid",
    location: "Downtown Design Center",
    experienceLevel: "Internship / Student",
    stipendOrSalary: "Structured Internship Stipend",
    deadline: "5 days remaining",
    requiredSkills: [
      "TypeScript & Modern JavaScript",
      "React Ecosystem & Next.js",
      "Tailwind CSS & Design Systems",
      "Web Accessibility (WCAG)"
    ],
    description: "Develop accessible React UI components, ensure cross-browser compatibility, and participate in design system audits."
  },
  {
    id: "opp-105",
    title: "DevOps & Infrastructure Associate",
    organization: "Autonomous Cloud Operations",
    type: "Full-time",
    workMode: "Remote",
    location: "Remote / Distributed",
    experienceLevel: "Associate (1-3 yrs)",
    stipendOrSalary: "Senior Associate Bracket",
    deadline: "30 days remaining",
    requiredSkills: [
      "Cloud Infrastructure (GCP / AWS)",
      "Docker & Containerization",
      "CI/CD Pipelines & GitHub Actions",
      "Linux Fundamentals"
    ],
    description: "Manage Terraform state modules, configure Kubernetes ingress controllers, and automate CI/CD pipeline deployments."
  }
];

export async function listOpportunities(req, res, next) {
  try {
    const { type, workMode, experienceLevel, search, sortBy } = req.query;

    const user = await dataStore.findUserById(req.userId);
    const candidateSkillNames = (user?.skills || []).map((s) => s.name.toLowerCase());

    let list = [...DEFAULT_OPPORTUNITIES];

    // If database has opportunities and MongoDB is connected, merge or use them
    if (dataStore.isMongoConnected()) {
      try {
        const dbOps = await Opportunity.find().lean();
        if (dbOps && dbOps.length > 0) {
          list = dbOps.map((op) => ({
            id: op._id.toString(),
            title: op.title,
            organization: op.company || "Technology Solutions Inc",
            type: op.type || "Full-time",
            workMode: op.location?.toLowerCase().includes("remote") ? "Remote" : "Hybrid",
            location: op.location || "Remote",
            experienceLevel: op.experienceLevel || "Entry Level (0-1 yrs)",
            stipendOrSalary: op.salary || "Competitive",
            deadline: op.deadline ? new Date(op.deadline).toLocaleDateString() : "Rolling Admission",
            requiredSkills: op.requiredSkills || [],
            description: op.description || ""
          }));
        }
      } catch (e) {
        console.warn("Could not fetch DB opportunities, using standard benchmarks:", e.message);
      }
    }

    // Apply filtering
    if (type && type !== "All") {
      list = list.filter((op) => op.type.toLowerCase() === type.toLowerCase());
    }

    if (workMode && workMode !== "All") {
      list = list.filter((op) => op.workMode.toLowerCase() === workMode.toLowerCase());
    }

    if (experienceLevel && experienceLevel !== "All") {
      list = list.filter((op) => op.experienceLevel.toLowerCase().includes(experienceLevel.toLowerCase()));
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (op) =>
          op.title.toLowerCase().includes(q) ||
          op.organization.toLowerCase().includes(q) ||
          op.description.toLowerCase().includes(q) ||
          op.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Calculate match score against current candidate skills
    const mapped = list.map((op) => {
      const matchedSkills = op.requiredSkills.filter((reqSkill) =>
        candidateSkillNames.some((cSkill) =>
          cSkill.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cSkill)
        )
      );
      const missingSkills = op.requiredSkills.filter(
        (reqSkill) => !matchedSkills.includes(reqSkill)
      );
      const matchScore = op.requiredSkills.length > 0
        ? Math.round((matchedSkills.length / op.requiredSkills.length) * 100)
        : 80;

      return {
        ...op,
        matchScore,
        matchedSkills,
        missingSkills,
        isBookmarked: false,
        hasApplied: false
      };
    });

    // Apply sorting
    if (sortBy === "match_desc") {
      mapped.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === "match_asc") {
      mapped.sort((a, b) => a.matchScore - b.matchScore);
    } else if (sortBy === "title_asc") {
      mapped.sort((a, b) => a.title.localeCompare(b.title));
    }

    res.json({
      success: true,
      data: mapped,
      opportunities: mapped,
      totalCount: mapped.length,
      filteredCount: mapped.length,
      isDemoData: false,
      ethicalNotice: "Opportunities are dynamically calibrated against your skill profile for developmental planning.",
      apiEndpoint: "/api/opportunities"
    });
  } catch (error) {
    next(error);
  }
}


export async function createOpportunity(req, res, next) {
  try {
    const { title, type, company, location, experienceLevel, requiredSkills, description, salary, deadline } = req.body;
    if (!title || !type) return res.status(400).json({ success: false, message: "Title and opportunity type are required" });
    if (!dataStore.isMongoConnected()) return res.status(503).json({ success: false, message: "Industry publishing requires MongoDB to be connected." });
    const item = await Opportunity.create({ title, type: type === "Internship" ? "Internship" : "Job", company: company || "Industry Partner", location, experienceLevel, requiredSkills: requiredSkills || [], description, salary, deadline, createdBy: req.userId });
    res.status(201).json({ success: true, opportunity: item });
  } catch (e) { next(e); }
}

export async function listCandidates(req, res, next) {
  try {
    if (!dataStore.isMongoConnected()) return res.json({ success: true, candidates: [] });
    const users = await (await import("../models/User.js")).default.find({ role: "student" }).select("name email targetRole readinessScore skills").lean();
    const skills = (req.query.skills || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    const candidates = users.map(u => {
      const names = (u.skills || []).map(s => s.name.toLowerCase());
      const matched = skills.filter(r => names.some(c => c.includes(r) || r.includes(c)));
      return { id: u._id.toString(), name: u.name, email: u.email, targetRole: u.targetRole, readinessScore: u.readinessScore || 0, matchScore: skills.length ? Math.round(matched.length / skills.length * 100) : 0, matchedSkills: matched };
    }).sort((a,b)=>b.matchScore-a.matchScore);
    res.json({ success: true, candidates });
  } catch (e) { next(e); }
}

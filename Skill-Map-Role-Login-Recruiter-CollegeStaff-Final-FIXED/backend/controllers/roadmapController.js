import Roadmap from "../models/Roadmap.js";
import { dataStore } from "../services/dataStore.js";
import { getBenchmarkForRole, findMatchingCandidateSkill } from "./matchingController.js";

/**
 * Builds standard 5-stage personalized learning sequence dynamically calibrated
 * against the candidate's actual identified skill gaps.
 */
export function buildRoadmapModules(targetRole, missingSkills = []) {
  const gapSkill1 = missingSkills[0] || "Cloud Infrastructure (GCP / AWS)";
  const gapSkill2 = missingSkills[1] || "Docker & Containerization";
  const gapSkill3 = missingSkills[2] || "System Design & Scalability";

  return [
    {
      moduleId: "stage-1",
      stage: "Foundation Skills",
      stageNumber: 1,
      title: "Linux Fundamentals, Operating Systems & Network Primitives",
      skillFocus: "Operating Systems & CLI Tooling",
      skillsGained: [
        "Bash Shell & Linux CLI",
        "Process & Memory Models",
        "TCP/IP & DNS Resolution",
        "Git Branching & Rebase Workflows"
      ],
      estimatedHours: 14,
      completedHours: 14,
      modulesCount: 3,
      completedModules: 3,
      status: "Completed",
      priority: "Medium",
      description:
        "Establish core systems foundations: Linux shell scripting, process scheduling, network sockets, and advanced version control needed for infrastructure workflows.",
      lessons: [
        { id: "l-101", title: "Linux Process Scheduling, Signals & Memory Models", duration: "4h", completed: true },
        { id: "l-102", title: "TCP/IP Handshakes, Sockets, HTTP/2 & DNS Resolution", duration: "5h", completed: true },
        { id: "l-103", title: "Advanced Git Rebase, Cherry-Pick & Conflict Resolution", duration: "5h", completed: true }
      ],
      keyTopics: ["Kernel vs User Space", "File Permissions & Systemd", "Network Sockets & TLS", "SSH Key Management"]
    },
    {
      moduleId: "stage-2",
      stage: "Core Technical Skills",
      stageNumber: 2,
      title: `Containerization, Multi-Stage Builds & Database Optimization: ${gapSkill2}`,
      skillFocus: gapSkill2,
      skillsGained: [
        gapSkill2,
        "Dockerfile Layer Caching",
        "Docker Compose Topologies",
        "PostgreSQL Query Optimization & EXPLAIN",
        "Database Migration Pipelines"
      ],
      estimatedHours: 22,
      completedHours: 16,
      modulesCount: 4,
      completedModules: 3,
      status: "In Progress",
      priority: "High",
      description: `Directly target your core technical deficit in ${gapSkill2}. Learn reproducible container topologies, multi-stage builds, and relational database indexing.`,
      lessons: [
        { id: "l-201", title: "Container Lifecycle, Namespace Isolation & Layer Caching", duration: "5h", completed: true },
        { id: "l-202", title: "Multi-Stage Docker Builds for Node.js & React Frontends", duration: "6h", completed: true },
        { id: "l-203", title: "PostgreSQL Index Optimization & Query Execution Plans", duration: "5h", completed: true },
        { id: "l-204", title: "Database Migration Tooling & Zero-Downtime Releases", duration: "6h", completed: false }
      ],
      keyTopics: ["Compute & Storage Provisioning", "Security Groups & Firewalls", "Database Clusters", "Cost Allocation & Observability"]
    },
    {
      moduleId: "stage-3",
      stage: "Advanced Skills",
      stageNumber: 3,
      title: `Distributed Cloud Infrastructure & High-Availability Systems: ${gapSkill1}`,
      skillFocus: `${gapSkill1} & ${gapSkill3}`,
      skillsGained: [
        gapSkill1,
        gapSkill3,
        "Cloud Run & Container Services",
        "VPC Networking & IAM Security",
        "Distributed Caching Patterns (Redis)",
        "CAP Theorem & Eventual Consistency"
      ],
      estimatedHours: 28,
      completedHours: 10,
      modulesCount: 4,
      completedModules: 1,
      status: "In Progress",
      priority: "High",
      description:
        "Master high-level architectural trade-offs: distributed microservices, cloud resource provisioning in GCP/AWS, IAM policies, and caching tiers.",
      lessons: [
        { id: "l-301", title: "Cloud Run, Ingress Routing & SSL Certificate Termination", duration: "7h", completed: true },
        { id: "l-302", title: "Distributed Caching Patterns: Cache-Aside vs Write-Through", duration: "7h", completed: false },
        { id: "l-303", title: "System Design Trade-offs: Latency, Throughput & Partitioning", duration: "7h", completed: false },
        { id: "l-304", title: "SRE Fundamentals: Latency SLOs, Logging & Telemetry Alerts", duration: "7h", completed: false }
      ],
      keyTopics: ["Layer Caching Optimization", "Volume Management", "Non-Root Container Users", "Health Checks & Graceful Shutdowns"]
    },
    {
      moduleId: "stage-4",
      stage: "Projects & Practical Application",
      stageNumber: 4,
      title: `Production ${targetRole} Capstone Project`,
      skillFocus: "End-to-End System Integration",
      skillsGained: [
        "Production Cloud Deployment",
        "Automated CI/CD Pipelines",
        "Resilience & Fault Tolerance",
        "Verified Project Artifacts"
      ],
      estimatedHours: 20,
      completedHours: 0,
      modulesCount: 4,
      completedModules: 0,
      status: "Not Started",
      priority: "High",
      description: `Synthesize everything learned by building and deploying a resilient, containerized application with automated CI/CD pipelines, database persistence, and observability for ${targetRole}.`,
      lessons: [
        { id: "l-401", title: "Capstone Blueprint: Requirements Specification & Schema", duration: "4h", completed: false },
        { id: "l-402", title: "Microservices Implementation with Database & Cache Layers", duration: "6h", completed: false },
        { id: "l-403", title: "Automated CI/CD GitHub Actions Pipeline & Artifact Registry", duration: "5h", completed: false },
        { id: "l-404", title: "Cloud Deployment, Health Check Probes & Public Showcase", duration: "5h", completed: false }
      ],
      keyTopics: ["CAP Theorem Tradeoffs", "Event-Driven Message Brokers", "Idempotency Keys", "Zero-Downtime Migration Patterns"]
    },
    {
      moduleId: "stage-5",
      stage: "Career Readiness",
      stageNumber: 5,
      title: "Technical System Design Interviews, Code Audits & Verification",
      skillFocus: `${targetRole} Technical Defense`,
      skillsGained: [
        "System Design Interview Delivery",
        "STAR Technical Communication",
        "Live Code Walkthroughs",
        "Competency Portfolio Verification"
      ],
      estimatedHours: 12,
      completedHours: 0,
      modulesCount: 4,
      completedModules: 0,
      status: "Not Started",
      priority: "Medium",
      description:
        "Bridge the final mile to career readiness: system design mock interviews, behavioral STAR framing of your projects, code walkthroughs, and portfolio reviews.",
      lessons: [
        { id: "l-501", title: "System Design Interview Practice: Architecture Defense", duration: "3h", completed: false },
        { id: "l-502", title: "Communicating Architecture Trade-offs Under Interview Conditions", duration: "3h", completed: false },
        { id: "l-503", title: "Framing Technical Obstacles via the STAR Methodology", duration: "3h", completed: false },
        { id: "l-504", title: "GitHub Repository Documentation, README Polish & Portfolio Audit", duration: "3h", completed: false }
      ],
      keyTopics: ["System Architecture Diagramming", "Latency Profiling Under Load", "Automated Release Gates", "STAR Framework Interview Prep"]
    }
  ];
}

/**
 * Derives missing skills for the candidate based on target role benchmark and user profile
 */
function deriveMissingSkills(user) {
  const targetRole = (user.targetRole || user.jobTitle || "Full Stack Cloud Engineer").trim();
  const benchmark = getBenchmarkForRole(targetRole);
  const candidateSkills = Array.isArray(user.skills) ? user.skills : [];

  const missing = [];
  for (const reqSkill of benchmark.requiredSkills) {
    const matched = findMatchingCandidateSkill(reqSkill, candidateSkills);
    const score = matched ? (matched.score != null ? Number(matched.score) : 70) : 0;
    if (!matched || score < reqSkill.requiredScore * 0.85) {
      missing.push(reqSkill.name);
    }
  }

  return { targetRole, missingSkills: missing };
}

/**
 * Controller: GET /api/roadmap
 * Returns the personalized learning roadmap for the authenticated user,
 * dynamically generated from their actual skill gaps and persisted in MongoDB.
 */
export async function getRoadmap(req, res, next) {
  const startTime = Date.now();
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const user = await dataStore.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { targetRole, missingSkills } = deriveMissingSkills(user);

    let roadmap = null;
    if (dataStore.isMongoConnected()) {
      try {
        roadmap = await Roadmap.findOne({ userId: req.userId });
      } catch (err) {
        console.warn("MongoDB getRoadmap find error:", err.message);
      }
    }

    if (!roadmap) {
      roadmap = await dataStore.getRoadmap(req.userId);
    }

    // If no roadmap exists yet for this user, generate fresh sequence from their skill gaps
    if (!roadmap) {
      const generatedModules = buildRoadmapModules(targetRole, missingSkills);
      const initialDoc = {
        userId: req.userId,
        targetRole,
        currentSkillLevel: "Early Professional / Intermediate",
        missingSkills,
        modules: generatedModules
      };

      if (dataStore.isMongoConnected()) {
        try {
          roadmap = await Roadmap.create(initialDoc);
        } catch (err) {
          console.warn("MongoDB create roadmap fallback:", err.message);
          roadmap = initialDoc;
        }
      } else {
        roadmap = initialDoc;
      }
      await dataStore.saveRoadmap(req.userId, roadmap);
    } else {
      // If user's targetRole changed, update targetRole and missingSkills
      if (roadmap.targetRole !== targetRole) {
        roadmap.targetRole = targetRole;
        roadmap.missingSkills = missingSkills;
        if (typeof roadmap.save === "function") {
          try {
            await roadmap.save();
          } catch (e) {
            console.warn("Error updating roadmap targetRole:", e.message);
          }
        }
        await dataStore.saveRoadmap(req.userId, roadmap);
      }
    }

    const modules = roadmap.modules || [];
    const totalEstimatedHours = modules.reduce((acc, m) => acc + (m.estimatedHours || 0), 0);
    const totalCompletedHours = modules.reduce((acc, m) => acc + (m.completedHours || 0), 0);
    const overallProgressPercentage =
      totalEstimatedHours > 0 ? Math.round((totalCompletedHours / totalEstimatedHours) * 100) : 0;

    const formattedData = modules.map((m) => ({
      id: m.moduleId || m._id?.toString(),
      stage: m.stage,
      stageNumber: m.stageNumber,
      title: m.title,
      skillFocus: m.skillFocus,
      description: m.description,
      estimatedHours: m.estimatedHours,
      completedHours: m.completedHours,
      modulesCount: m.modulesCount,
      completedModules: m.completedModules,
      status: m.status,
      priority: m.priority,
      skillsGained: m.skillsGained || [],
      keyTopics: m.keyTopics || [],
      lessons: m.lessons || []
    }));

    res.json({
      success: true,
      targetRole: roadmap.targetRole || targetRole,
      currentSkillLevel: roadmap.currentSkillLevel || "Early Professional / Intermediate",
      missingSkillsCount: missingSkills.length,
      missingSkillsList: missingSkills,
      totalEstimatedHours,
      totalCompletedHours,
      overallProgressPercentage,
      data: formattedData,
      ethicalNotice:
        "Learning roadmap recommendations are educational developmental guides and do not represent guaranteed career outcomes.",
      apiEndpoint: "/api/roadmap",
      latencyMs: Math.max(12, Date.now() - startTime)
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller: PUT /api/roadmap/modules/:moduleId
 * Updates progress for a specific roadmap milestone for the authenticated user and saves to MongoDB.
 */
export async function updateModule(req, res, next) {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const { moduleId } = req.params;
    const { completedHours, deltaHours, status, completedModules, lessons } = req.body;

    let roadmap = null;
    if (dataStore.isMongoConnected()) {
      try {
        roadmap = await Roadmap.findOne({ userId: req.userId });
      } catch (err) {
        console.warn("MongoDB find roadmap error:", err.message);
      }
    }

    if (!roadmap) {
      roadmap = await dataStore.getRoadmap(req.userId);
    }

    if (!roadmap) {
      return res.status(404).json({ success: false, message: "Roadmap not found for authenticated user" });
    }

    const mod = roadmap.modules.find(
      (m) => m.moduleId === moduleId || m.id === moduleId || m._id?.toString() === moduleId
    );

    if (!mod) {
      return res.status(404).json({ success: false, message: `Milestone module ${moduleId} not found` });
    }

    // 1. Update lessons if provided
    if (Array.isArray(lessons)) {
      mod.lessons = lessons;
      const finishedLessons = lessons.filter((l) => l.completed).length;
      mod.completedModules = finishedLessons;
      if (completedHours === undefined && deltaHours === undefined) {
        mod.completedHours =
          lessons.length > 0 ? Math.round((finishedLessons / lessons.length) * mod.estimatedHours) : mod.completedHours;
      }
    }

    // 2. Update completed modules count if provided
    if (completedModules !== undefined) {
      mod.completedModules = Math.min(mod.modulesCount, Math.max(0, Number(completedModules)));
    }

    // 3. Update hours
    if (deltaHours !== undefined) {
      mod.completedHours = Math.min(
        mod.estimatedHours,
        Math.max(0, (mod.completedHours || 0) + Number(deltaHours))
      );
    } else if (completedHours !== undefined) {
      mod.completedHours = Math.min(mod.estimatedHours, Math.max(0, Number(completedHours)));
    }

    // 4. Update status
    if (status !== undefined) {
      mod.status = status;
    } else {
      if (mod.completedHours >= mod.estimatedHours) {
        mod.status = "Completed";
        mod.completedModules = mod.modulesCount;
      } else if (mod.completedHours > 0) {
        mod.status = "In Progress";
      } else {
        mod.status = "Not Started";
      }
    }

    // 5. Persist to MongoDB
    if (dataStore.isMongoConnected()) {
      try {
        if (typeof roadmap.save === "function") {
          roadmap.markModified("modules");
          await roadmap.save();
        } else {
          await Roadmap.findOneAndUpdate(
            { userId: req.userId },
            { $set: { modules: roadmap.modules } },
            { new: true }
          );
        }
      } catch (err) {
        console.warn("MongoDB roadmap update warning:", err.message);
      }
    }
    await dataStore.saveRoadmap(req.userId, roadmap);

    const totalEstimatedHours = roadmap.modules.reduce((acc, m) => acc + (m.estimatedHours || 0), 0);
    const totalCompletedHours = roadmap.modules.reduce((acc, m) => acc + (m.completedHours || 0), 0);
    const overallProgressPercentage =
      totalEstimatedHours > 0 ? Math.round((totalCompletedHours / totalEstimatedHours) * 100) : 0;

    res.json({
      success: true,
      message: "Module progress updated successfully",
      module: {
        id: mod.moduleId || moduleId,
        title: mod.title,
        completedHours: mod.completedHours,
        estimatedHours: mod.estimatedHours,
        completedModules: mod.completedModules,
        modulesCount: mod.modulesCount,
        status: mod.status,
        lessons: mod.lessons
      },
      overallProgressPercentage,
      totalCompletedHours
    });
  } catch (error) {
    next(error);
  }
}

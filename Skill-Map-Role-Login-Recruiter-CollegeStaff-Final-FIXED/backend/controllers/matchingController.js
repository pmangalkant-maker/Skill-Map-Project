import { dataStore } from "../services/dataStore.js";
import SkillAnalysis from "../models/SkillAnalysis.js";

// Standard benchmark role definitions
export const BENCHMARK_ROLES = [
  {
    roleName: "Full Stack Cloud Engineer",
    slug: "full-stack-cloud-engineer",
    seniorityLevel: "Associate / Early Career",
    industryDemand: "Very High",
    description: "Designs, deploys, and maintains end-to-end web applications, microservices, cloud resources, and user-facing dashboards.",
    requiredSkills: [
      {
        name: "TypeScript & Modern JavaScript",
        category: "Technical Skills",
        requiredScore: 85,
        requiredLevel: "Advanced",
        weight: "Core Required",
        weightPercentage: 16,
        marketDemandRationale: "Strictly typed foundations for enterprise client and server codebases.",
        estimatedHours: 20
      },
      {
        name: "React Ecosystem & Next.js",
        category: "Technical Skills",
        requiredScore: 85,
        requiredLevel: "Advanced",
        weight: "Core Required",
        weightPercentage: 15,
        marketDemandRationale: "Standard component architecture for responsive cloud frontends.",
        estimatedHours: 25
      },
      {
        name: "Node.js & Express REST APIs",
        category: "Technical Skills",
        requiredScore: 80,
        requiredLevel: "Intermediate",
        weight: "Core Required",
        weightPercentage: 14,
        marketDemandRationale: "High-throughput asynchronous backend service implementation.",
        estimatedHours: 30
      },
      {
        name: "Cloud Infrastructure (GCP / AWS)",
        category: "Tools & Technologies",
        requiredScore: 75,
        requiredLevel: "Intermediate",
        weight: "Core Required",
        weightPercentage: 14,
        marketDemandRationale: "Serverless deployment, IAM roles, storage buckets, and container runtimes.",
        estimatedHours: 40
      },
      {
        name: "Docker & Containerization",
        category: "Tools & Technologies",
        requiredScore: 75,
        requiredLevel: "Intermediate",
        weight: "Important",
        weightPercentage: 10,
        marketDemandRationale: "Standard packaging for repeatable microservices and staging parity.",
        estimatedHours: 25
      },
      {
        name: "PostgreSQL & Relational Data Modeling",
        category: "Other Skills",
        requiredScore: 75,
        requiredLevel: "Intermediate",
        weight: "Important",
        weightPercentage: 10,
        marketDemandRationale: "ACID transactions, relational normalization, and query performance.",
        estimatedHours: 35
      },
      {
        name: "System Design & Distributed Scalability",
        category: "Other Skills",
        requiredScore: 75,
        requiredLevel: "Intermediate",
        weight: "Important",
        weightPercentage: 9,
        marketDemandRationale: "Designing caching layers, rate limiting, and fault-tolerant service APIs.",
        estimatedHours: 50
      },
      {
        name: "CI/CD Pipelines & GitHub Actions",
        category: "Tools & Technologies",
        requiredScore: 70,
        requiredLevel: "Intermediate",
        weight: "Desirable",
        weightPercentage: 6,
        marketDemandRationale: "Automated linting, testing, and continuous deployment workflows.",
        estimatedHours: 20
      },
      {
        name: "Agile & Technical Collaboration",
        category: "Soft Skills",
        requiredScore: 80,
        requiredLevel: "Intermediate",
        weight: "Desirable",
        weightPercentage: 5,
        marketDemandRationale: "Sprint planning, async code reviews, and structured retrospectives.",
        estimatedHours: 15
      }
    ]
  },
  {
    roleName: "Frontend Developer",
    slug: "frontend-developer",
    seniorityLevel: "Associate / Early Career",
    industryDemand: "Very High",
    description: "Builds accessible, responsive, and high-performance client web applications and design systems.",
    requiredSkills: [
      {
        name: "React Ecosystem & Next.js",
        category: "Technical Skills",
        requiredScore: 90,
        requiredLevel: "Advanced",
        weight: "Core Required",
        weightPercentage: 25,
        marketDemandRationale: "Modern component lifecycle, hooks, state management, and SSR.",
        estimatedHours: 30
      },
      {
        name: "TypeScript & Modern JavaScript",
        category: "Technical Skills",
        requiredScore: 88,
        requiredLevel: "Advanced",
        weight: "Core Required",
        weightPercentage: 25,
        marketDemandRationale: "Type-safe UI component properties, API contract validation, and asynchronous logic.",
        estimatedHours: 25
      },
      {
        name: "Tailwind CSS & Design Systems",
        category: "Technical Skills",
        requiredScore: 85,
        requiredLevel: "Advanced",
        weight: "Core Required",
        weightPercentage: 20,
        marketDemandRationale: "Rapid utility-first styling, design token systems, and responsive layout architectures.",
        estimatedHours: 20
      },
      {
        name: "Web Performance & Core Web Vitals",
        category: "Technical Skills",
        requiredScore: 78,
        requiredLevel: "Intermediate",
        weight: "Important",
        weightPercentage: 15,
        marketDemandRationale: "Render optimization, image sizing, bundle reduction, and accessibility compliance.",
        estimatedHours: 25
      },
      {
        name: "Agile & Technical Collaboration",
        category: "Soft Skills",
        requiredScore: 80,
        requiredLevel: "Intermediate",
        weight: "Desirable",
        weightPercentage: 15,
        marketDemandRationale: "Figma design handoffs, cross-functional engineering, and code reviews.",
        estimatedHours: 15
      }
    ]
  },
  {
    roleName: "Cloud Infrastructure & SRE",
    slug: "cloud-infrastructure-sre",
    seniorityLevel: "Associate / Early Career",
    industryDemand: "Very High",
    description: "Ensures reliable, automated, observable cloud infrastructure and high-availability distributed systems.",
    requiredSkills: [
      {
        name: "Cloud Infrastructure (GCP / AWS)",
        category: "Tools & Technologies",
        requiredScore: 90,
        requiredLevel: "Advanced",
        weight: "Core Required",
        weightPercentage: 22,
        marketDemandRationale: "Core operational runtime, networking, VPC peering, and security boundaries.",
        estimatedHours: 45
      },
      {
        name: "Docker & Containerization",
        category: "Tools & Technologies",
        requiredScore: 85,
        requiredLevel: "Advanced",
        weight: "Core Required",
        weightPercentage: 18,
        marketDemandRationale: "Container orchestration, base image optimization, and runtime isolation.",
        estimatedHours: 30
      },
      {
        name: "CI/CD Pipelines & GitHub Actions",
        category: "Tools & Technologies",
        requiredScore: 85,
        requiredLevel: "Advanced",
        weight: "Core Required",
        weightPercentage: 15,
        marketDemandRationale: "Zero-downtime release automation, canary testing, and rollbacks.",
        estimatedHours: 25
      },
      {
        name: "System Design & Distributed Scalability",
        category: "Other Skills",
        requiredScore: 80,
        requiredLevel: "Intermediate",
        weight: "Important",
        weightPercentage: 15,
        marketDemandRationale: "High availability, multi-region failover, load balancing, and SLO tracking.",
        estimatedHours: 40
      },
      {
        name: "Web Security & OWASP Standards",
        category: "Other Skills",
        requiredScore: 75,
        requiredLevel: "Intermediate",
        weight: "Important",
        weightPercentage: 12,
        marketDemandRationale: "Secrets management, encryption-at-rest, and vulnerability scanning.",
        estimatedHours: 30
      },
      {
        name: "Python & Algorithmic Problem Solving",
        category: "Technical Skills",
        requiredScore: 75,
        requiredLevel: "Intermediate",
        weight: "Important",
        weightPercentage: 10,
        marketDemandRationale: "Automation scripting, log ingestion parsers, and incident response tooling.",
        estimatedHours: 25
      },
      {
        name: "Technical Writing & Architecture Documentation",
        category: "Soft Skills",
        requiredScore: 75,
        requiredLevel: "Intermediate",
        weight: "Desirable",
        weightPercentage: 8,
        marketDemandRationale: "Runbooks, post-mortems, disaster recovery protocols, and architecture RFCs.",
        estimatedHours: 20
      }
    ]
  },
  {
    roleName: "Backend Distributed Systems Engineer",
    slug: "backend-distributed-systems",
    seniorityLevel: "Mid-Level",
    industryDemand: "Very High",
    description: "Architects high-performance microservices, event streams, relational and distributed database clusters.",
    requiredSkills: [
      {
        name: "Node.js & Express REST APIs",
        category: "Technical Skills",
        requiredScore: 90,
        requiredLevel: "Advanced",
        weight: "Core Required",
        weightPercentage: 20,
        marketDemandRationale: "Scalable network server loops, concurrency, and async thread management.",
        estimatedHours: 35
      },
      {
        name: "System Design & Distributed Scalability",
        category: "Other Skills",
        requiredScore: 85,
        requiredLevel: "Advanced",
        weight: "Core Required",
        weightPercentage: 20,
        marketDemandRationale: "Partitioning, consensus, message queues, and horizontal sharding.",
        estimatedHours: 60
      },
      {
        name: "PostgreSQL & Relational Data Modeling",
        category: "Other Skills",
        requiredScore: 85,
        requiredLevel: "Advanced",
        weight: "Core Required",
        weightPercentage: 18,
        marketDemandRationale: "Complex indexing, locking strategies, execution plans, and replication.",
        estimatedHours: 40
      },
      {
        name: "TypeScript & Modern JavaScript",
        category: "Technical Skills",
        requiredScore: 80,
        requiredLevel: "Intermediate",
        weight: "Important",
        weightPercentage: 14,
        marketDemandRationale: "Type-safe contracts across service boundaries and SDK interfaces.",
        estimatedHours: 25
      },
      {
        name: "Docker & Containerization",
        category: "Tools & Technologies",
        requiredScore: 75,
        requiredLevel: "Intermediate",
        weight: "Important",
        weightPercentage: 12,
        marketDemandRationale: "Local service mock fabrics and containerized integration test harnesses.",
        estimatedHours: 20
      },
      {
        name: "Web Security & OWASP Standards",
        category: "Other Skills",
        requiredScore: 75,
        requiredLevel: "Intermediate",
        weight: "Desirable",
        weightPercentage: 8,
        marketDemandRationale: "JWT token signing, rate limiting, and SQL injection prevention.",
        estimatedHours: 20
      },
      {
        name: "Cross-Functional Team Leadership",
        category: "Soft Skills",
        requiredScore: 75,
        requiredLevel: "Intermediate",
        weight: "Desirable",
        weightPercentage: 8,
        marketDemandRationale: "Technical alignment with product stakeholders and frontend teams.",
        estimatedHours: 15
      }
    ]
  },
  {
    roleName: "Data Engineering & Analytics Specialist",
    slug: "data-engineering-analytics",
    seniorityLevel: "Associate / Early Career",
    industryDemand: "High",
    description: "Constructs robust ETL/ELT pipelines, data warehouse structures, and transformation jobs for analytics.",
    requiredSkills: [
      {
        name: "Python & Algorithmic Problem Solving",
        category: "Technical Skills",
        requiredScore: 90,
        requiredLevel: "Advanced",
        weight: "Core Required",
        weightPercentage: 25,
        marketDemandRationale: "Data manipulation, vectorized operations, pipeline scripting, and pandas/numpy.",
        estimatedHours: 45
      },
      {
        name: "PostgreSQL & Relational Data Modeling",
        category: "Other Skills",
        requiredScore: 88,
        requiredLevel: "Advanced",
        weight: "Core Required",
        weightPercentage: 22,
        marketDemandRationale: "Star schemas, window functions, analytical aggregations, and query profiling.",
        estimatedHours: 35
      },
      {
        name: "Cloud Infrastructure (GCP / AWS)",
        category: "Tools & Technologies",
        requiredScore: 80,
        requiredLevel: "Intermediate",
        weight: "Core Required",
        weightPercentage: 18,
        marketDemandRationale: "BigQuery / Redshift / S3 storage configurations and IAM security.",
        estimatedHours: 35
      },
      {
        name: "Docker & Containerization",
        category: "Tools & Technologies",
        requiredScore: 75,
        requiredLevel: "Intermediate",
        weight: "Important",
        weightPercentage: 15,
        marketDemandRationale: "Orchestration packaging for batch transform jobs and airflow workers.",
        estimatedHours: 25
      },
      {
        name: "CI/CD Pipelines & GitHub Actions",
        category: "Tools & Technologies",
        requiredScore: 75,
        requiredLevel: "Intermediate",
        weight: "Desirable",
        weightPercentage: 10,
        marketDemandRationale: "Data pipeline integration tests and schema migration regression suites.",
        estimatedHours: 20
      },
      {
        name: "Agile & Technical Collaboration",
        category: "Soft Skills",
        requiredScore: 80,
        requiredLevel: "Intermediate",
        weight: "Desirable",
        weightPercentage: 10,
        marketDemandRationale: "Cross-team data contracts and analytics sprint retrospectives.",
        estimatedHours: 15
      }
    ]
  }
];

// Adaptive benchmark generator for custom or non-standard roles
function generateAdaptiveBenchmark(customRoleName) {
  const normalized = customRoleName.trim();
  const slug = normalized.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    roleName: normalized,
    slug,
    seniorityLevel: "Associate / Early Career",
    industryDemand: "High",
    description: `Specialized competency profile benchmark for ${normalized}. Computed dynamically from core full-stack and systems engineering standards.`,
    requiredSkills: [
      {
        name: "TypeScript & Modern JavaScript",
        category: "Technical Skills",
        requiredScore: 80,
        requiredLevel: "Intermediate",
        weight: "Core Required",
        weightPercentage: 20,
        marketDemandRationale: "Foundational programming language requirement for modern engineering.",
        estimatedHours: 25
      },
      {
        name: "Node.js & Express REST APIs",
        category: "Technical Skills",
        requiredScore: 78,
        requiredLevel: "Intermediate",
        weight: "Core Required",
        weightPercentage: 20,
        marketDemandRationale: "Backend service execution and API contract generation.",
        estimatedHours: 30
      },
      {
        name: "Cloud Infrastructure (GCP / AWS)",
        category: "Tools & Technologies",
        requiredScore: 75,
        requiredLevel: "Intermediate",
        weight: "Important",
        weightPercentage: 18,
        marketDemandRationale: "Cloud-native deployment and compute infrastructure management.",
        estimatedHours: 35
      },
      {
        name: "PostgreSQL & Relational Data Modeling",
        category: "Other Skills",
        requiredScore: 75,
        requiredLevel: "Intermediate",
        weight: "Important",
        weightPercentage: 18,
        marketDemandRationale: "Data persistence, schema design, and transactional queries.",
        estimatedHours: 30
      },
      {
        name: "CI/CD Pipelines & GitHub Actions",
        category: "Tools & Technologies",
        requiredScore: 70,
        requiredLevel: "Intermediate",
        weight: "Desirable",
        weightPercentage: 12,
        marketDemandRationale: "Continuous delivery automation and regression testing.",
        estimatedHours: 20
      },
      {
        name: "Agile & Technical Collaboration",
        category: "Soft Skills",
        requiredScore: 80,
        requiredLevel: "Intermediate",
        weight: "Desirable",
        weightPercentage: 12,
        marketDemandRationale: "Team retrospectives, async documentation, and cross-functional work.",
        estimatedHours: 15
      }
    ]
  };
}

// Select or generate role benchmark
export function getBenchmarkForRole(targetRole) {
  const normalized = targetRole.trim().toLowerCase();

  // 1. Direct or fuzzy match against known benchmarks
  for (const role of BENCHMARK_ROLES) {
    const roleLower = role.roleName.toLowerCase();
    if (
      roleLower === normalized ||
      role.slug === normalized ||
      normalized.includes(roleLower) ||
      roleLower.includes(normalized)
    ) {
      return role;
    }
  }

  // Check aliases: frontend
  if (normalized.includes("front") || normalized.includes("react") || normalized.includes("ui") || normalized.includes("web developer")) {
    const fe = BENCHMARK_ROLES.find((r) => r.slug === "frontend-developer");
    if (fe) return fe;
  }
  // Check aliases: backend
  if (normalized.includes("backend") || normalized.includes("server") || normalized.includes("api")) {
    const be = BENCHMARK_ROLES.find((r) => r.slug === "backend-distributed-systems");
    if (be) return be;
  }
  // Check aliases: devops / sre / cloud
  if (normalized.includes("devops") || normalized.includes("sre") || normalized.includes("infrastructure")) {
    const sre = BENCHMARK_ROLES.find((r) => r.slug === "cloud-infrastructure-sre");
    if (sre) return sre;
  }
  // Check aliases: data
  if (normalized.includes("data") || normalized.includes("etl") || normalized.includes("analytics")) {
    const de = BENCHMARK_ROLES.find((r) => r.slug === "data-engineering-analytics");
    if (de) return de;
  }

  // 2. Generate adaptive benchmark for custom roles
  return generateAdaptiveBenchmark(targetRole);
}

// Find matching skill in candidate's skills list
export function findMatchingCandidateSkill(benchmarkReq, candidateSkills) {
  if (!Array.isArray(candidateSkills) || candidateSkills.length === 0) {
    return null;
  }

  const reqNameLower = benchmarkReq.name.toLowerCase();
  const reqTokens = reqNameLower
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !["and", "the", "for", "with"].includes(t));

  let bestMatch = null;
  let highestScore = -1;

  for (const skill of candidateSkills) {
    if (!skill || !skill.name) continue;
    const skillNameLower = skill.name.toLowerCase();

    // 1. Exact match
    if (skillNameLower === reqNameLower) {
      return skill;
    }

    // 2. Full substring match
    if (skillNameLower.includes(reqNameLower) || reqNameLower.includes(skillNameLower)) {
      if ((skill.score ?? 0) > highestScore) {
        highestScore = skill.score ?? 0;
        bestMatch = skill;
      }
      continue;
    }

    // 3. Significant token overlap (e.g., "React" matches "React Ecosystem & Next.js")
    const skillTokens = skillNameLower
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2 && !["and", "the", "for", "with"].includes(t));

    const tokenOverlap = reqTokens.some((t) => skillTokens.includes(t));
    if (tokenOverlap) {
      if ((skill.score ?? 0) > highestScore) {
        highestScore = skill.score ?? 0;
        bestMatch = skill;
      }
    }
  }

  return bestMatch;
}

/**
 * Controller: POST /api/matching/analyze
 * Analyzes the authenticated user's actual saved skills against target role benchmarks.
 */
export async function analyze(req, res, next) {
  const startTime = Date.now();
  try {
    // 1. Require JWT authentication: req.userId is set by authMiddleware
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    // 2. Fetch authenticated user from persistent storage (scoped strictly to req.userId)
    const user = await dataStore.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User profile not found" });
    }

    // 3. Determine target role from request body or user profile
    const targetRole = (req.body.targetRole || user.targetRole || user.jobTitle || "Full Stack Cloud Engineer").trim();

    // Persist targetRole on user profile if updated
    if (user.targetRole !== targetRole) {
      try {
        await dataStore.updateUser(req.userId, { targetRole });
      } catch (saveErr) {
        console.warn("Failed to persist updated user targetRole:", saveErr.message);
      }
    }

    // 4. Retrieve candidate's actual saved skills
    // We prioritize the database-saved skills, falling back to any provided in body if user has not loaded yet
    const candidateSkills = Array.isArray(user.skills) && user.skills.length > 0
      ? user.skills
      : (Array.isArray(req.body.candidateSkills) ? req.body.candidateSkills : []);

    // 5. Select benchmark definition
    const benchmark = getBenchmarkForRole(targetRole);

    // 6. Evaluate each benchmark requirement against candidate's profile
    const allRequiredSkills = benchmark.requiredSkills.map((reqSkill, idx) => {
      const matchedSkill = findMatchingCandidateSkill(reqSkill, candidateSkills);

      const candidateScore = matchedSkill
        ? (matchedSkill.score != null
            ? Number(matchedSkill.score)
            : matchedSkill.level === "Advanced"
            ? 85
            : matchedSkill.level === "Intermediate"
            ? 70
            : 50)
        : 0;

      const candidateLevel = matchedSkill ? (matchedSkill.level || "Intermediate") : "None";
      const gap = Math.max(0, reqSkill.requiredScore - candidateScore);

      // Match ratio capped at 1.0
      const matchRatio = Math.min(1.0, candidateScore / reqSkill.requiredScore);
      const weightedContribution = Math.round(matchRatio * reqSkill.weightPercentage * 10) / 10;

      // Status classification:
      // Matched: candidateScore >= 85% of benchmark required score
      // Partially Matched: candidateScore > 0 and < 85% of benchmark
      // Missing: candidateScore === 0
      let status = "Missing";
      if (candidateScore >= reqSkill.requiredScore * 0.85) {
        status = "Matched";
      } else if (candidateScore > 0) {
        status = "Partially Matched";
      } else {
        status = "Missing";
      }

      // Priority classification
      let priority = "Low";
      if (reqSkill.weight === "Core Required" || gap > 20) {
        priority = "High";
      } else if (reqSkill.weight === "Important" || gap > 10) {
        priority = "Medium";
      }

      // Potential score boost
      const potentialScoreBoost = Math.round((1.0 - matchRatio) * reqSkill.weightPercentage);

      // Actionable recommendations
      const recommendedActions = [];
      if (status === "Missing") {
        recommendedActions.push(`Add ${reqSkill.name} to your skills profile`);
        recommendedActions.push(`Enroll in the foundations module (${reqSkill.estimatedHours}h estimated)`);
      } else if (status === "Partially Matched") {
        recommendedActions.push(`Bridge deficit of ${gap}% through guided project milestone`);
        recommendedActions.push(`Target minimum passing score of ${reqSkill.requiredScore}%`);
      } else {
        recommendedActions.push("Maintain verified status and review advanced architectural patterns");
      }

      return {
        id: `match-${idx + 1}`,
        name: reqSkill.name,
        category: reqSkill.category,
        weight: reqSkill.weight,
        weightPercentage: reqSkill.weightPercentage,
        requiredScore: reqSkill.requiredScore,
        requiredLevel: reqSkill.requiredLevel,
        candidateScore,
        candidateLevel,
        gap,
        matchRatio: Number(matchRatio.toFixed(2)),
        weightedContribution,
        status,
        priority,
        marketDemandRationale: reqSkill.marketDemandRationale,
        recommendedActions,
        estimatedTimeToBridgeHours: reqSkill.estimatedHours,
        potentialScoreBoost,
        isInCandidateProfile: Boolean(matchedSkill)
      };
    });

    // 7. Partition skills into Matched, Partially Matched, and Missing
    const matchedSkills = allRequiredSkills.filter((s) => s.status === "Matched");
    const partiallyMatchedSkills = allRequiredSkills.filter((s) => s.status === "Partially Matched");
    const missingSkills = allRequiredSkills.filter((s) => s.status === "Missing");

    // 8. Calculate total earned weighted points and overall percentage
    const earnedWeightedPoints = allRequiredSkills.reduce(
      (sum, item) => sum + item.weightedContribution,
      0
    );
    const totalPossible = allRequiredSkills.reduce((sum, item) => sum + item.weightPercentage, 0);
    const overallMatchPercentage = Math.round(
      Math.min(100, (earnedWeightedPoints / (totalPossible || 100)) * 100)
    );

    // 9. Calculate category breakdowns
    const categoriesSet = Array.from(new Set(allRequiredSkills.map((s) => s.category)));
    const categoryScores = categoriesSet.map((cat) => {
      const catSkills = allRequiredSkills.filter((s) => s.category === cat);
      const catEarned = catSkills.reduce((acc, s) => acc + s.weightedContribution, 0);
      const catTotal = catSkills.reduce((acc, s) => acc + s.weightPercentage, 0);
      const rate = Math.round((catEarned / (catTotal || 1)) * 100);

      return {
        category: cat,
        matchRate: Math.min(100, rate),
        totalRequired: catSkills.length,
        matchedCount: catSkills.filter((s) => s.status === "Matched").length,
        partialCount: catSkills.filter((s) => s.status === "Partially Matched").length,
        missingCount: catSkills.filter((s) => s.status === "Missing").length
      };
    });

    // 10. Prioritized recommendations to bridge first
    const actionableSkills = [...partiallyMatchedSkills, ...missingSkills];
    const recommendedToLearnFirst = actionableSkills
      .sort((a, b) => {
        const weightScoreA = a.weight === "Core Required" ? 300 : a.weight === "Important" ? 200 : 100;
        const weightScoreB = b.weight === "Core Required" ? 300 : b.weight === "Important" ? 200 : 100;
        return weightScoreB + b.potentialScoreBoost * 5 - (weightScoreA + a.potentialScoreBoost * 5);
      })
      .slice(0, 4);

    // 11. Structured Score Breakdown for ethical transparency
    const scoreBreakdown = {
      totalPossibleWeightedPoints: totalPossible,
      earnedWeightedPoints: Math.round(earnedWeightedPoints * 10) / 10,
      formula: "Overall Match Score = Σ (min(1.0, CandidateScore / BenchmarkScore) × SkillWeight%)",
      isAutomatedHiringDecision: false,
      transparencyNote:
        "This score reflects current profile calibration against published industry competencies. No recruitment screening, automated rejections, or hidden penalties are applied.",
      categoryScores
    };

    // 12. Save historical record to SkillAnalysis in MongoDB if connected
    if (dataStore.isMongoConnected()) {
      try {
        await SkillAnalysis.create({
          userId: req.userId,
          targetRole,
          requiredSkills: allRequiredSkills.map((s) => s.name),
          matchedSkills: matchedSkills.map((s) => s.name),
          missingSkills: missingSkills.map((s) => s.name),
          partialSkills: partiallyMatchedSkills.map((s) => s.name),
          matchPercentage: overallMatchPercentage
        });
      } catch (saveErr) {
        console.warn("SkillAnalysis historical record skipped:", saveErr.message);
      }
    }

    const latencyMs = Math.max(12, Date.now() - startTime);

    // 13. Return structured response matching requirements:
    // Includes: targetRole, matchedSkills, missingSkills, score, and complete UI properties
    res.json({
      success: true,
      targetRole,
      score: overallMatchPercentage,
      overallMatchPercentage,
      matchedSkills,
      partiallyMatchedSkills,
      missingSkills,
      allRequiredSkills,
      recommendedToLearnFirst,
      scoreBreakdown,
      criticalGapsCount: allRequiredSkills.filter((s) => s.gap > 15).length,
      seniorityLevel: benchmark.seniorityLevel,
      industryDemand: benchmark.industryDemand,
      roleDescription: benchmark.description,
      analyzedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      apiEndpoint: "/api/matching/analyze",
      latencyMs
    });
  } catch (error) {
    next(error);
  }
}

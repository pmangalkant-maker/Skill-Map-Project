import { SkillItem, SkillCategory, ProficiencyLevel } from '../types';
import { apiRequest } from './apiClient';

/**
 * Matching Analysis Service
 * 
 * Provides deterministic competency matching and skill gap computation.
 * Pre-configured for seamless drop-in integration with production backend POST `/api/matching/analyze`.
 * 
 * Ethical Transparency Guarantee:
 * This calculation is purely educational and diagnostic. It explicitly does NOT make automated
 * hiring or employment decisions. All weights, scores, and criteria are fully exposed to the candidate.
 */

export type SkillWeight = 'Core Required' | 'Important' | 'Desirable';
export type MatchStatus = 'Matched' | 'Partially Matched' | 'Missing';

export interface SkillMatchItem {
  id: string;
  name: string;
  category: SkillCategory;
  weight: SkillWeight;
  weightPercentage: number; // e.g., 20%
  requiredScore: number; // 0 - 100 benchmark standard
  requiredLevel: ProficiencyLevel;
  candidateScore: number; // 0 - 100 from profile
  candidateLevel: ProficiencyLevel | 'None';
  gap: number; // Deficit: Math.max(0, requiredScore - candidateScore)
  matchRatio: number; // 0.0 to 1.0 (candidateScore / requiredScore)
  weightedContribution: number; // Points added to overall match
  status: MatchStatus;
  priority: 'High' | 'Medium' | 'Low';
  marketDemandRationale: string;
  recommendedActions: string[];
  estimatedTimeToBridgeHours: number;
  potentialScoreBoost: number; // Approximate overall match score increase upon reaching target
  isInCandidateProfile: boolean;
}

export interface CategoryBreakdown {
  category: string;
  matchRate: number;
  totalRequired: number;
  matchedCount: number;
  partialCount: number;
  missingCount: number;
}

export interface ScoreBreakdown {
  totalPossibleWeightedPoints: number;
  earnedWeightedPoints: number;
  formula: string;
  isAutomatedHiringDecision: false;
  transparencyNote: string;
  categoryScores: CategoryBreakdown[];
}

export interface RoleBenchmarkDefinition {
  roleName: string;
  slug: string;
  seniorityLevel: 'Associate / Early Career' | 'Mid-Level' | 'Senior Specialist';
  industryDemand: 'Very High' | 'High' | 'Moderate';
  description: string;
  requiredSkills: Array<{
    name: string;
    category: SkillCategory;
    requiredScore: number;
    requiredLevel: ProficiencyLevel;
    weight: SkillWeight;
    weightPercentage: number;
    marketDemandRationale: string;
    estimatedHours: number;
  }>;
}

export interface AnalyzeRequest {
  targetRole: string;
  candidateSkills: SkillItem[];
  forceRefresh?: boolean;
  simulateError?: boolean;
}

export interface AnalyzeResponse {
  success: boolean;
  targetRole: string;
  score?: number;
  seniorityLevel: string;
  industryDemand: string;
  roleDescription: string;
  overallMatchPercentage: number;
  matchedSkills: SkillMatchItem[];
  partiallyMatchedSkills: SkillMatchItem[];
  missingSkills: SkillMatchItem[];
  allRequiredSkills: SkillMatchItem[];
  recommendedToLearnFirst: SkillMatchItem[];
  scoreBreakdown: ScoreBreakdown;
  analyzedAt: string;
  apiEndpoint: string;
  latencyMs: number;
}

// Pre-defined industry baseline benchmarks
export const BENCHMARK_ROLES: RoleBenchmarkDefinition[] = [
  {
    roleName: 'Full Stack Cloud Engineer',
    slug: 'full-stack-cloud-engineer',
    seniorityLevel: 'Associate / Early Career',
    industryDemand: 'Very High',
    description:
      'Designs, deploys, and maintains end-to-end web applications, microservices, cloud resources, and user-facing dashboards.',
    requiredSkills: [
      {
        name: 'TypeScript & Modern JavaScript',
        category: 'Technical Skills',
        requiredScore: 85,
        requiredLevel: 'Advanced',
        weight: 'Core Required',
        weightPercentage: 16,
        marketDemandRationale: 'Strictly typed foundations for enterprise client and server codebases.',
        estimatedHours: 20,
      },
      {
        name: 'React Ecosystem & Next.js',
        category: 'Technical Skills',
        requiredScore: 85,
        requiredLevel: 'Advanced',
        weight: 'Core Required',
        weightPercentage: 15,
        marketDemandRationale: 'Standard component architecture for responsive cloud frontends.',
        estimatedHours: 25,
      },
      {
        name: 'Node.js & Express REST APIs',
        category: 'Technical Skills',
        requiredScore: 80,
        requiredLevel: 'Intermediate',
        weight: 'Core Required',
        weightPercentage: 14,
        marketDemandRationale: 'High-throughput asynchronous backend service implementation.',
        estimatedHours: 30,
      },
      {
        name: 'Cloud Infrastructure (GCP / AWS)',
        category: 'Tools & Technologies',
        requiredScore: 75,
        requiredLevel: 'Intermediate',
        weight: 'Core Required',
        weightPercentage: 14,
        marketDemandRationale: 'Serverless deployment, IAM roles, storage buckets, and container runtimes.',
        estimatedHours: 40,
      },
      {
        name: 'Docker & Containerization',
        category: 'Tools & Technologies',
        requiredScore: 75,
        requiredLevel: 'Intermediate',
        weight: 'Important',
        weightPercentage: 10,
        marketDemandRationale: 'Standard packaging for repeatable microservices and staging parity.',
        estimatedHours: 25,
      },
      {
        name: 'PostgreSQL & Relational Data Modeling',
        category: 'Other Skills',
        requiredScore: 75,
        requiredLevel: 'Intermediate',
        weight: 'Important',
        weightPercentage: 10,
        marketDemandRationale: 'ACID transactions, relational normalization, and query performance.',
        estimatedHours: 35,
      },
      {
        name: 'System Design & Distributed Scalability',
        category: 'Other Skills',
        requiredScore: 75,
        requiredLevel: 'Intermediate',
        weight: 'Important',
        weightPercentage: 9,
        marketDemandRationale: 'Designing caching layers, rate limiting, and fault-tolerant service APIs.',
        estimatedHours: 50,
      },
      {
        name: 'CI/CD Pipelines & GitHub Actions',
        category: 'Tools & Technologies',
        requiredScore: 70,
        requiredLevel: 'Intermediate',
        weight: 'Desirable',
        weightPercentage: 6,
        marketDemandRationale: 'Automated linting, testing, and continuous deployment workflows.',
        estimatedHours: 20,
      },
      {
        name: 'Agile & Technical Collaboration',
        category: 'Soft Skills',
        requiredScore: 80,
        requiredLevel: 'Intermediate',
        weight: 'Desirable',
        weightPercentage: 5,
        marketDemandRationale: 'Sprint planning, async code reviews, and structured retrospectives.',
        estimatedHours: 15,
      },
    ],
  },
  {
    roleName: 'Cloud Infrastructure & SRE',
    slug: 'cloud-infrastructure-sre',
    seniorityLevel: 'Associate / Early Career',
    industryDemand: 'Very High',
    description:
      'Ensures reliable, automated, observable cloud infrastructure and high-availability distributed systems.',
    requiredSkills: [
      {
        name: 'Cloud Infrastructure (GCP / AWS)',
        category: 'Tools & Technologies',
        requiredScore: 90,
        requiredLevel: 'Advanced',
        weight: 'Core Required',
        weightPercentage: 22,
        marketDemandRationale: 'Core operational runtime, networking, VPC peering, and security boundaries.',
        estimatedHours: 45,
      },
      {
        name: 'Docker & Containerization',
        category: 'Tools & Technologies',
        requiredScore: 85,
        requiredLevel: 'Advanced',
        weight: 'Core Required',
        weightPercentage: 18,
        marketDemandRationale: 'Container orchestration, base image optimization, and runtime isolation.',
        estimatedHours: 30,
      },
      {
        name: 'CI/CD Pipelines & GitHub Actions',
        category: 'Tools & Technologies',
        requiredScore: 85,
        requiredLevel: 'Advanced',
        weight: 'Core Required',
        weightPercentage: 15,
        marketDemandRationale: 'Zero-downtime release automation, canary testing, and rollbacks.',
        estimatedHours: 25,
      },
      {
        name: 'System Design & Distributed Scalability',
        category: 'Other Skills',
        requiredScore: 80,
        requiredLevel: 'Intermediate',
        weight: 'Important',
        weightPercentage: 15,
        marketDemandRationale: 'High availability, multi-region failover, load balancing, and SLO tracking.',
        estimatedHours: 40,
      },
      {
        name: 'Web Security & OWASP Standards',
        category: 'Other Skills',
        requiredScore: 75,
        requiredLevel: 'Intermediate',
        weight: 'Important',
        weightPercentage: 12,
        marketDemandRationale: 'Secrets management, encryption-at-rest, and vulnerability scanning.',
        estimatedHours: 30,
      },
      {
        name: 'Python & Algorithmic Problem Solving',
        category: 'Technical Skills',
        requiredScore: 75,
        requiredLevel: 'Intermediate',
        weight: 'Important',
        weightPercentage: 10,
        marketDemandRationale: 'Automation scripting, log ingestion parsers, and incident response tooling.',
        estimatedHours: 25,
      },
      {
        name: 'Technical Writing & Architecture Documentation',
        category: 'Soft Skills',
        requiredScore: 75,
        requiredLevel: 'Intermediate',
        weight: 'Desirable',
        weightPercentage: 8,
        marketDemandRationale: 'Runbooks, post-mortems, disaster recovery protocols, and architecture RFCs.',
        estimatedHours: 20,
      },
    ],
  },
  {
    roleName: 'Backend Distributed Systems Engineer',
    slug: 'backend-distributed-systems',
    seniorityLevel: 'Mid-Level',
    industryDemand: 'Very High',
    description:
      'Architects high-performance microservices, event streams, relational and distributed database clusters.',
    requiredSkills: [
      {
        name: 'Node.js & Express REST APIs',
        category: 'Technical Skills',
        requiredScore: 90,
        requiredLevel: 'Advanced',
        weight: 'Core Required',
        weightPercentage: 20,
        marketDemandRationale: 'Scalable network server loops, concurrency, and async thread management.',
        estimatedHours: 35,
      },
      {
        name: 'System Design & Distributed Scalability',
        category: 'Other Skills',
        requiredScore: 85,
        requiredLevel: 'Advanced',
        weight: 'Core Required',
        weightPercentage: 20,
        marketDemandRationale: 'Partitioning, consensus, message queues, and horizontal sharding.',
        estimatedHours: 60,
      },
      {
        name: 'PostgreSQL & Relational Data Modeling',
        category: 'Other Skills',
        requiredScore: 85,
        requiredLevel: 'Advanced',
        weight: 'Core Required',
        weightPercentage: 18,
        marketDemandRationale: 'Complex indexing, locking strategies, execution plans, and replication.',
        estimatedHours: 40,
      },
      {
        name: 'TypeScript & Modern JavaScript',
        category: 'Technical Skills',
        requiredScore: 80,
        requiredLevel: 'Intermediate',
        weight: 'Important',
        weightPercentage: 14,
        marketDemandRationale: 'Type-safe contracts across service boundaries and SDK interfaces.',
        estimatedHours: 25,
      },
      {
        name: 'Docker & Containerization',
        category: 'Tools & Technologies',
        requiredScore: 75,
        requiredLevel: 'Intermediate',
        weight: 'Important',
        weightPercentage: 12,
        marketDemandRationale: 'Local service mock fabrics and containerized integration test harnesses.',
        estimatedHours: 20,
      },
      {
        name: 'Web Security & OWASP Standards',
        category: 'Other Skills',
        requiredScore: 75,
        requiredLevel: 'Intermediate',
        weight: 'Desirable',
        weightPercentage: 8,
        marketDemandRationale: 'JWT token signing, rate limiting, and SQL injection prevention.',
        estimatedHours: 20,
      },
      {
        name: 'Cross-Functional Team Leadership',
        category: 'Soft Skills',
        requiredScore: 75,
        requiredLevel: 'Intermediate',
        weight: 'Desirable',
        weightPercentage: 8,
        marketDemandRationale: 'Technical alignment with product stakeholders and frontend teams.',
        estimatedHours: 15,
      },
    ],
  },
  {
    roleName: 'Data Engineering & Analytics Specialist',
    slug: 'data-engineering-analytics',
    seniorityLevel: 'Associate / Early Career',
    industryDemand: 'High',
    description:
      'Constructs robust ETL/ELT pipelines, data warehouse structures, and transformation jobs for analytics.',
    requiredSkills: [
      {
        name: 'Python & Algorithmic Problem Solving',
        category: 'Technical Skills',
        requiredScore: 90,
        requiredLevel: 'Advanced',
        weight: 'Core Required',
        weightPercentage: 25,
        marketDemandRationale: 'Data manipulation, vectorized operations, pipeline scripting, and pandas/numpy.',
        estimatedHours: 45,
      },
      {
        name: 'PostgreSQL & Relational Data Modeling',
        category: 'Other Skills',
        requiredScore: 88,
        requiredLevel: 'Advanced',
        weight: 'Core Required',
        weightPercentage: 22,
        marketDemandRationale: 'Star schemas, window functions, analytical aggregations, and query profiling.',
        estimatedHours: 35,
      },
      {
        name: 'Cloud Infrastructure (GCP / AWS)',
        category: 'Tools & Technologies',
        requiredScore: 80,
        requiredLevel: 'Intermediate',
        weight: 'Core Required',
        weightPercentage: 18,
        marketDemandRationale: 'BigQuery / Redshift / S3 storage configurations and IAM security.',
        estimatedHours: 35,
      },
      {
        name: 'CI/CD Pipelines & GitHub Actions',
        category: 'Tools & Technologies',
        requiredScore: 70,
        requiredLevel: 'Intermediate',
        weight: 'Important',
        weightPercentage: 12,
        marketDemandRationale: 'Automated testing for schema migrations and data validation checks.',
        estimatedHours: 20,
      },
      {
        name: 'Technical Writing & Architecture Documentation',
        category: 'Soft Skills',
        requiredScore: 75,
        requiredLevel: 'Intermediate',
        weight: 'Important',
        weightPercentage: 13,
        marketDemandRationale: 'Data catalogs, data dictionary maintenance, and lineage diagrams.',
        estimatedHours: 15,
      },
      {
        name: 'System Design & Distributed Scalability',
        category: 'Other Skills',
        requiredScore: 70,
        requiredLevel: 'Intermediate',
        weight: 'Desirable',
        weightPercentage: 10,
        marketDemandRationale: 'Batch processing vs streaming trade-offs and message queue buffering.',
        estimatedHours: 30,
      },
    ],
  },
];

/**
 * Deterministic matching algorithm for candidate skills against a benchmark role.
 * Computes transparent, auditable match scores with zero hidden parameters.
 */
export function computeSkillGapAnalysis(
  targetRoleName: string,
  candidateSkills: SkillItem[]
): AnalyzeResponse {
  // 1. Locate matching benchmark definition, or generate an adaptive role benchmark if custom
  let benchmark = BENCHMARK_ROLES.find(
    (b) => b.roleName.toLowerCase() === targetRoleName.toLowerCase()
  );

  if (!benchmark) {
    // Generate an adaptive role benchmark for the custom entered role
    benchmark = generateAdaptiveBenchmark(targetRoleName);
  }

  // 2. Evaluate each required skill against candidate's profile
  const allRequiredSkills: SkillMatchItem[] = benchmark.requiredSkills.map((req, idx) => {
    // Look up in candidate skills by exact or case-insensitive match
    const candidateMatch = candidateSkills.find(
      (c) =>
        c.name.toLowerCase() === req.name.toLowerCase() ||
        c.name.toLowerCase().includes(req.name.toLowerCase()) ||
        req.name.toLowerCase().includes(c.name.toLowerCase())
    );

    const candidateScore = candidateMatch ? candidateMatch.score : 0;
    const candidateLevel = candidateMatch ? candidateMatch.level : 'None';
    const gap = Math.max(0, req.requiredScore - candidateScore);

    // Compute deterministic match ratio: score/requiredScore, capped at 1.0
    const matchRatio = Math.min(1.0, candidateScore / req.requiredScore);
    const weightedContribution = Math.round(matchRatio * req.weightPercentage * 10) / 10;

    // Status classification:
    // Green: Matched (score >= 85% of benchmark)
    // Amber: Partially Matched (score > 0 and score < 85% of benchmark)
    // Red: Missing (score === 0 or not in profile)
    let status: MatchStatus = 'Missing';
    if (candidateScore >= req.requiredScore * 0.85) {
      status = 'Matched';
    } else if (candidateScore > 0) {
      status = 'Partially Matched';
    } else {
      status = 'Missing';
    }

    // Priority based on weight and gap
    let priority: 'High' | 'Medium' | 'Low' = 'Low';
    if (req.weight === 'Core Required' || gap > 20) {
      priority = 'High';
    } else if (req.weight === 'Important' || gap > 10) {
      priority = 'Medium';
    }

    // Potential score boost if brought to 100% of required score
    const potentialScoreBoost = Math.round((1.0 - matchRatio) * req.weightPercentage);

    const recommendedActions: string[] = [];
    if (status === 'Missing') {
      recommendedActions.push(`Add ${req.name} to your skills profile`);
      recommendedActions.push(`Enroll in the foundations module (${req.estimatedHours}h estimated)`);
    } else if (status === 'Partially Matched') {
      recommendedActions.push(`Bridge deficit of ${gap}% through guided project milestone`);
      recommendedActions.push(`Target minimum passing score of ${req.requiredScore}%`);
    } else {
      recommendedActions.push('Maintain verified status and review advanced architectural patterns');
    }

    return {
      id: `match-${idx + 1}`,
      name: req.name,
      category: req.category,
      weight: req.weight,
      weightPercentage: req.weightPercentage,
      requiredScore: req.requiredScore,
      requiredLevel: req.requiredLevel,
      candidateScore,
      candidateLevel,
      gap,
      matchRatio,
      weightedContribution,
      status,
      priority,
      marketDemandRationale: req.marketDemandRationale,
      recommendedActions,
      estimatedTimeToBridgeHours: req.estimatedHours,
      potentialScoreBoost,
      isInCandidateProfile: Boolean(candidateMatch),
    };
  });

  // 3. Partition into Matched, Partially Matched, and Missing
  const matchedSkills = allRequiredSkills.filter((s) => s.status === 'Matched');
  const partiallyMatchedSkills = allRequiredSkills.filter((s) => s.status === 'Partially Matched');
  const missingSkills = allRequiredSkills.filter((s) => s.status === 'Missing');

  // 4. Calculate total earned weighted points (Sum of all weighted contributions)
  const earnedWeightedPoints = allRequiredSkills.reduce(
    (sum, item) => sum + item.weightedContribution,
    0
  );
  const totalPossible = allRequiredSkills.reduce((sum, item) => sum + item.weightPercentage, 0);
  const overallMatchPercentage = Math.round(
    Math.min(100, (earnedWeightedPoints / (totalPossible || 100)) * 100)
  );

  // 5. Calculate category breakdowns
  const categoriesSet = Array.from(new Set(allRequiredSkills.map((s) => s.category)));
  const categoryScores: CategoryBreakdown[] = categoriesSet.map((cat) => {
    const catSkills = allRequiredSkills.filter((s) => s.category === cat);
    const catEarned = catSkills.reduce((acc, s) => acc + s.weightedContribution, 0);
    const catTotal = catSkills.reduce((acc, s) => acc + s.weightPercentage, 0);
    const rate = Math.round((catEarned / (catTotal || 1)) * 100);

    return {
      category: cat,
      matchRate: Math.min(100, rate),
      totalRequired: catSkills.length,
      matchedCount: catSkills.filter((s) => s.status === 'Matched').length,
      partialCount: catSkills.filter((s) => s.status === 'Partially Matched').length,
      missingCount: catSkills.filter((s) => s.status === 'Missing').length,
    };
  });

  // 6. Generate prioritized recommendations to learn first:
  // Sort missing & partial by (weight priority + gap * weightPercentage)
  const actionableSkills = [...partiallyMatchedSkills, ...missingSkills];
  const recommendedToLearnFirst = actionableSkills
    .sort((a, b) => {
      const weightScoreA = a.weight === 'Core Required' ? 300 : a.weight === 'Important' ? 200 : 100;
      const weightScoreB = b.weight === 'Core Required' ? 300 : b.weight === 'Important' ? 200 : 100;
      return weightScoreB + b.potentialScoreBoost * 5 - (weightScoreA + a.potentialScoreBoost * 5);
    })
    .slice(0, 4);

  return {
    success: true,
    targetRole: benchmark.roleName,
    seniorityLevel: benchmark.seniorityLevel,
    industryDemand: benchmark.industryDemand,
    roleDescription: benchmark.description,
    overallMatchPercentage,
    matchedSkills,
    partiallyMatchedSkills,
    missingSkills,
    allRequiredSkills,
    recommendedToLearnFirst,
    scoreBreakdown: {
      totalPossibleWeightedPoints: totalPossible,
      earnedWeightedPoints: Math.round(earnedWeightedPoints * 10) / 10,
      formula: 'Overall Match Score = Σ (min(1.0, CandidateScore / BenchmarkScore) × SkillWeight%)',
      isAutomatedHiringDecision: false,
      transparencyNote:
        'This score reflects current profile calibration against published industry competencies. No recruitment screening, automated rejections, or hidden penalties are applied.',
      categoryScores,
    },
    analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    apiEndpoint: '/api/matching/analyze',
    latencyMs: 320,
  };
}

/**
 * Adaptive fallback benchmark generator when candidate enters an unlisted custom role
 */
function generateAdaptiveBenchmark(customRoleName: string): RoleBenchmarkDefinition {
  return {
    roleName: customRoleName,
    slug: customRoleName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    seniorityLevel: 'Associate / Early Career',
    industryDemand: 'High',
    description: `Specialized competency profile benchmark for ${customRoleName}. Computed dynamically from core full-stack and systems engineering standards.`,
    requiredSkills: [
      {
        name: 'TypeScript & Modern JavaScript',
        category: 'Technical Skills',
        requiredScore: 80,
        requiredLevel: 'Intermediate',
        weight: 'Core Required',
        weightPercentage: 20,
        marketDemandRationale: 'Foundational programming language requirement for modern engineering.',
        estimatedHours: 25,
      },
      {
        name: 'Node.js & Express REST APIs',
        category: 'Technical Skills',
        requiredScore: 78,
        requiredLevel: 'Intermediate',
        weight: 'Core Required',
        weightPercentage: 20,
        marketDemandRationale: 'Backend service execution and API contract generation.',
        estimatedHours: 30,
      },
      {
        name: 'Cloud Infrastructure (GCP / AWS)',
        category: 'Tools & Technologies',
        requiredScore: 75,
        requiredLevel: 'Intermediate',
        weight: 'Important',
        weightPercentage: 18,
        marketDemandRationale: 'Cloud-native deployment and compute infrastructure management.',
        estimatedHours: 35,
      },
      {
        name: 'PostgreSQL & Relational Data Modeling',
        category: 'Other Skills',
        requiredScore: 75,
        requiredLevel: 'Intermediate',
        weight: 'Important',
        weightPercentage: 18,
        marketDemandRationale: 'Data persistence, schema design, and transactional queries.',
        estimatedHours: 30,
      },
      {
        name: 'CI/CD Pipelines & GitHub Actions',
        category: 'Tools & Technologies',
        requiredScore: 70,
        requiredLevel: 'Intermediate',
        weight: 'Desirable',
        weightPercentage: 12,
        marketDemandRationale: 'Continuous delivery automation and regression testing.',
        estimatedHours: 20,
      },
      {
        name: 'Agile & Technical Collaboration',
        category: 'Soft Skills',
        requiredScore: 80,
        requiredLevel: 'Intermediate',
        weight: 'Desirable',
        weightPercentage: 12,
        marketDemandRationale: 'Team retrospectives, async documentation, and cross-functional work.',
        estimatedHours: 15,
      },
    ],
  };
}

/**
 * Service API layer for client components
 */
export const matchingApi = {
  /**
   * Primary call to analyze skill gap against target role.
   * Mirrors POST `/api/matching/analyze`.
   */
  async analyzeRole(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    if (request.simulateError) {
      throw new Error('Failed to retrieve role benchmark. Upstream analysis service returned a timeout.');
    }

    const startTime = Date.now();
    const response = await apiRequest('/api/matching/analyze', {
      method: 'POST',
      body: JSON.stringify({
        targetRole: request.targetRole,
        candidateSkills: request.candidateSkills,
      }),
    });

    if (response && response.success && response.allRequiredSkills) {
      return {
        ...response,
        score: response.score ?? response.overallMatchPercentage,
        latencyMs: response.latencyMs || Math.max(12, Date.now() - startTime),
        apiEndpoint: response.apiEndpoint || '/api/matching/analyze',
      };
    }

    throw new Error(
      response?.message || 'Failed to retrieve benchmark requirements from /api/matching/analyze.'
    );
  },
};

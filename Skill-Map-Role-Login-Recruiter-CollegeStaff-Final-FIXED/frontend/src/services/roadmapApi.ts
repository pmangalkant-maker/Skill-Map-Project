import { RoadmapMilestone, RoadmapStage, SkillGapMetric, SkillItem } from '../types';
import { apiRequest } from './apiClient';

/**
 * Roadmap API Service
 * 
 * Provides dynamic learning progression calibrated against candidate skill gaps and target role.
 * Pre-configured for future production backend integration with `GET /api/roadmap`.
 * 
 * Ethical Transparency Guarantee:
 * Recommendations are diagnostic developmental paths, not guaranteed career outcomes or hiring promises.
 * Never hardcodes personal names or recruiter guarantees.
 */

export interface RoadmapResponse {
  success: boolean;
  targetRole: string;
  currentSkillLevel: string;
  missingSkillsCount: number;
  missingSkillsList: string[];
  totalEstimatedHours: number;
  totalCompletedHours: number;
  overallProgressPercentage: number;
  data: RoadmapMilestone[];
  ethicalNotice: string;
  apiEndpoint: string;
  latencyMs: number;
}

export interface RoadmapQueryParams {
  targetRole?: string;
  statusFilter?: 'All' | 'Completed' | 'In Progress' | 'Not Started';
  stageFilter?: 'All' | RoadmapStage;
  search?: string;
  simulateError?: boolean;
  simulateEmpty?: boolean;
}

/**
 * Generates the 5-stage recommended learning sequence dynamically based on identified skill gaps
 */
export function generateRoadmapForGaps(
  targetRole: string,
  candidateSkills: SkillItem[],
  gapMetric?: SkillGapMetric
): RoadmapMilestone[] {
  // Extract critical missing or deficit skills
  const deficitSkills = gapMetric?.skills.filter((s) => s.gap > 0) || [];
  const primaryGapNames = deficitSkills.map((s) => s.name);

  // Fallback defaults if no metric provided
  const gapSkill1 = primaryGapNames[0] || 'Cloud Infrastructure (GCP / AWS)';
  const gapSkill2 = primaryGapNames[1] || 'Docker & Containerization';
  const gapSkill3 = primaryGapNames[2] || 'System Design & Scalability';

  return [
    {
      id: 'stage-1',
      stage: 'Foundation Skills',
      stageNumber: 1,
      title: 'Linux Fundamentals, Operating Systems & Network Primitives',
      skillFocus: 'Operating Systems & CLI Tooling',
      skillsGained: [
        'Bash Shell & Linux CLI',
        'Process & Memory Models',
        'TCP/IP & DNS Resolution',
        'Git Branching & Rebase Workflows',
      ],
      estimatedHours: 14,
      completedHours: 14,
      modulesCount: 3,
      completedModules: 3,
      status: 'Completed',
      priority: 'Medium',
      description:
        'Establish core systems foundations: Linux shell scripting, process scheduling, network sockets, and advanced version control needed for infrastructure workflows.',
      lessons: [
        { id: 'l-101', title: 'Linux Process Scheduling, Signals & Memory Models', duration: '4h', completed: true },
        { id: 'l-102', title: 'TCP/IP Handshakes, Sockets, HTTP/2 & DNS Resolution', duration: '5h', completed: true },
        { id: 'l-103', title: 'Advanced Git Rebase, Cherry-Pick & Conflict Resolution', duration: '5h', completed: true },
      ],
    },
    {
      id: 'stage-2',
      stage: 'Core Technical Skills',
      stageNumber: 2,
      title: `Containerization, Multi-Stage Builds & Database Optimization`,
      skillFocus: gapSkill2,
      skillsGained: [
        'Dockerfile Layer Caching',
        'Docker Compose Topologies',
        'PostgreSQL Query Optimization & EXPLAIN',
        'Database Migration Pipelines',
      ],
      estimatedHours: 22,
      completedHours: 16,
      modulesCount: 4,
      completedModules: 3,
      status: 'In Progress',
      priority: 'High',
      description:
        `Directly target your core technical deficit in ${gapSkill2}. Learn reproducible container topologies, multi-stage builds, and relational database indexing.`,
      lessons: [
        { id: 'l-201', title: 'Container Lifecycle, Namespace Isolation & Layer Caching', duration: '5h', completed: true },
        { id: 'l-202', title: 'Multi-Stage Docker Builds for Node.js & React Frontends', duration: '6h', completed: true },
        { id: 'l-203', title: 'PostgreSQL Index Optimization & Query Execution Plans', duration: '5h', completed: true },
        { id: 'l-204', title: 'Database Migration Tooling & Zero-Downtime Releases', duration: '6h', completed: false },
      ],
    },
    {
      id: 'stage-3',
      stage: 'Advanced Skills',
      stageNumber: 3,
      title: `Distributed Cloud Infrastructure & High-Availability Systems`,
      skillFocus: `${gapSkill1} & ${gapSkill3}`,
      skillsGained: [
        'Cloud Run & Container Services',
        'VPC Networking & IAM Security',
        'Distributed Caching Patterns (Redis)',
        'CAP Theorem & Eventual Consistency',
      ],
      estimatedHours: 28,
      completedHours: 10,
      modulesCount: 4,
      completedModules: 1,
      status: 'In Progress',
      priority: 'High',
      description:
        `Master high-level architectural trade-offs: distributed microservices, cloud resource provisioning in GCP/AWS, IAM policies, and caching tiers.`,
      lessons: [
        { id: 'l-301', title: 'Cloud Run, Ingress Routing & SSL Certificate Termination', duration: '7h', completed: true },
        { id: 'l-302', title: 'Distributed Caching Patterns: Cache-Aside vs Write-Through', duration: '7h', completed: false },
        { id: 'l-303', title: 'System Design Trade-offs: Latency, Throughput & Partitioning', duration: '7h', completed: false },
        { id: 'l-304', title: 'SRE Fundamentals: Latency SLOs, Logging & Telemetry Alerts', duration: '7h', completed: false },
      ],
    },
    {
      id: 'stage-4',
      stage: 'Projects & Practical Application',
      stageNumber: 4,
      title: 'Production Full-Stack Cloud Microservices Capstone',
      skillFocus: 'End-to-End System Integration',
      skillsGained: [
        'Production Cloud Deployment',
        'Automated CI/CD Pipelines',
        'Resilience & Fault Tolerance',
        'Verified Project Artifacts',
      ],
      estimatedHours: 20,
      completedHours: 0,
      modulesCount: 4,
      completedModules: 0,
      status: 'Not Started',
      priority: 'High',
      description:
        'Synthesize everything learned by building and deploying a resilient, containerized application with automated CI/CD pipelines, database persistence, and observability.',
      lessons: [
        { id: 'l-401', title: 'Capstone Blueprint: Requirements Specification & Schema', duration: '4h', completed: false },
        { id: 'l-402', title: 'Microservices Implementation with Database & Cache Layers', duration: '6h', completed: false },
        { id: 'l-403', title: 'Automated CI/CD GitHub Actions Pipeline & Artifact Registry', duration: '5h', completed: false },
        { id: 'l-404', title: 'Cloud Deployment, Health Check Probes & Public Showcase', duration: '5h', completed: false },
      ],
    },
    {
      id: 'stage-5',
      stage: 'Career Readiness',
      stageNumber: 5,
      title: 'Technical System Design Interviews, Code Audits & Verification',
      skillFocus: 'Career & Professional Presentation',
      skillsGained: [
        'System Design Interview Delivery',
        'STAR Technical Communication',
        'Live Code Walkthroughs',
        'Competency Portfolio Verification',
      ],
      estimatedHours: 12,
      completedHours: 0,
      modulesCount: 4,
      completedModules: 0,
      status: 'Not Started',
      priority: 'Medium',
      description:
        'Bridge the final mile to career readiness: system design mock interviews, behavioral STAR framing of your projects, code walkthroughs, and portfolio reviews.',
      lessons: [
        { id: 'l-501', title: 'System Design Interview Practice: URL Shortener & Feed Scalability', duration: '3h', completed: false },
        { id: 'l-502', title: 'Communicating Architecture Trade-offs Under Interview Conditions', duration: '3h', completed: false },
        { id: 'l-503', title: 'Framing Technical Obstacles via the STAR Methodology', duration: '3h', completed: false },
        { id: 'l-504', title: 'GitHub Repository Documentation, README Polish & Portfolio Audit', duration: '3h', completed: false },
      ],
    },
  ];
}

/**
 * Primary Roadmap API client
 */
export const roadmapApi = {
  /**
   * Fetches the personalized learning roadmap.
   * Mirrors `GET /api/roadmap`.
   */
  async getRoadmap(
    targetRole: string,
    candidateSkills: SkillItem[],
    gapMetric?: SkillGapMetric,
    params: RoadmapQueryParams = {}
  ): Promise<RoadmapResponse> {
    if (params.simulateError) {
      throw new Error(
        'Failed to retrieve learning roadmap from /api/roadmap. Server returned 500 Internal Error.'
      );
    }

    if (params.simulateEmpty) {
      return {
        success: true,
        targetRole,
        currentSkillLevel: 'Early Professional / Intermediate',
        missingSkillsCount: 0,
        missingSkillsList: [],
        totalEstimatedHours: 0,
        totalCompletedHours: 0,
        overallProgressPercentage: 0,
        data: [],
        ethicalNotice:
          'Learning roadmap recommendations are educational developmental guides and do not represent guaranteed career outcomes.',
        apiEndpoint: '/api/roadmap',
        latencyMs: 120,
      };
    }

    let initialData: RoadmapMilestone[] = [];

    try {
      const response = await apiRequest('/api/roadmap', { method: 'GET' });
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        initialData = response.data;
      }
    } catch (err) {
      console.warn('Backend roadmap fetch failed, using local developmental sequence:', err);
    }

    if (!initialData || initialData.length === 0) {
      initialData = generateRoadmapForGaps(targetRole, candidateSkills, gapMetric);
    }

    let filteredData = [...initialData];

    // Apply status filter
    if (params.statusFilter && params.statusFilter !== 'All') {
      filteredData = filteredData.filter((m) => m.status === params.statusFilter);
    }

    // Apply stage filter
    if (params.stageFilter && params.stageFilter !== 'All') {
      filteredData = filteredData.filter((m) => m.stage === params.stageFilter);
    }

    // Apply search filter
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      filteredData = filteredData.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.skillFocus.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          (m.skillsGained && m.skillsGained.some((s) => s.toLowerCase().includes(q)))
      );
    }

    const totalEst = initialData.reduce((acc, m) => acc + m.estimatedHours, 0);
    const totalComp = initialData.reduce((acc, m) => acc + m.completedHours, 0);
    const overallPct = totalEst > 0 ? Math.round((totalComp / totalEst) * 100) : 0;

    const missingGaps = gapMetric?.skills.filter((s) => s.gap > 0).map((s) => s.name) || [
      'Cloud Infrastructure (GCP / AWS)',
      'Docker & Containerization',
      'System Design & Scalability',
    ];

    return {
      success: true,
      targetRole,
      currentSkillLevel: 'Early Professional / Intermediate (68% baseline)',
      missingSkillsCount: missingGaps.length,
      missingSkillsList: missingGaps,
      totalEstimatedHours: totalEst,
      totalCompletedHours: totalComp,
      overallProgressPercentage: overallPct,
      data: filteredData,
      ethicalNotice:
        'Learning roadmap recommendations are educational developmental guides and do not represent guaranteed career outcomes.',
      apiEndpoint: '/api/roadmap',
      latencyMs: 120,
    };
  },

  /**
   * Update module progress via PUT /api/roadmap/modules/:moduleId
   */
  async updateModuleProgress(
    moduleId: string,
    updates:
      | number
      | {
          deltaHours?: number;
          completedHours?: number;
          status?: string;
          completedModules?: number;
          lessons?: any[];
        }
  ): Promise<any> {
    const payload = typeof updates === 'number' ? { deltaHours: updates } : updates;
    try {
      const res = await apiRequest(`/api/roadmap/modules/${encodeURIComponent(moduleId)}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      return res;
    } catch (err) {
      console.warn('Backend module update failed:', err);
      return { success: false };
    }
  },
};

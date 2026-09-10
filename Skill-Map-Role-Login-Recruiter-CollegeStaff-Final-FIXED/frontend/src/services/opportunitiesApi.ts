import { OpportunityItem, SkillItem } from '../types';
import { apiRequest } from './apiClient';

/**
 * Opportunities API Service
 * 
 * Provides career and internship recommendations calibrated against candidate competencies.
 * Pre-configured for future production backend integration with `GET /api/opportunities`.
 * 
 * Ethical Transparency Guarantee:
 * All recommendations are educational suggestions based on profile skills.
 * Never represents automated hiring decisions, recruitment guarantees, or real corporate entities.
 * Sample opportunities are explicitly tagged and labeled as demo benchmarks.
 */

export type OpportunityType = 'All' | 'Full-time' | 'Internship' | 'Fellowship';
export type WorkMode = 'All' | 'Remote' | 'Hybrid' | 'On-site';
export type ExperienceLevelFilter = 'All' | 'Internship / Student' | 'Entry Level (0-1 yrs)' | 'Associate (1-3 yrs)' | 'Mid-Level (3+ yrs)';
export type MatchScoreFilter = 'All' | '80%+' | '60-79%' | 'Under 60%';
export type SortOption = 'match_desc' | 'match_asc' | 'deadline_asc' | 'title_asc';

export interface OpportunitiesFilterParams {
  search?: string;
  type?: OpportunityType;
  workMode?: WorkMode;
  experienceLevel?: ExperienceLevelFilter;
  matchScoreFilter?: MatchScoreFilter;
  sortBy?: SortOption;
  onlyBookmarked?: boolean;
  simulateError?: boolean;
  simulateEmpty?: boolean;
}

export interface OpportunitiesResponse {
  success: boolean;
  data: OpportunityItem[];
  totalCount: number;
  filteredCount: number;
  isDemoData: boolean;
  ethicalNotice: string;
  apiEndpoint: string;
  latencyMs: number;
}

// Sample benchmark opportunities clearly tagged as demo data
export const SAMPLE_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp-101',
    title: 'Junior Cloud Applications Engineer',
    organization: 'Cloud Platform Systems Group',
    type: 'Full-time',
    workMode: 'Hybrid',
    location: 'Metro Innovation District',
    experienceLevel: 'Entry Level (0-1 yrs)',
    stipendOrSalary: 'Standard Associate Bracket',
    deadline: '12 days remaining',
    matchScore: 89,
    requiredSkills: [
      'TypeScript & Modern JavaScript',
      'React Ecosystem & Next.js',
      'Node.js & Express REST APIs',
      'PostgreSQL & Relational Data Modeling',
      'Cloud Infrastructure (GCP / AWS)',
    ],
    matchedSkills: [
      'TypeScript & Modern JavaScript',
      'React Ecosystem & Next.js',
      'Node.js & Express REST APIs',
      'PostgreSQL & Relational Data Modeling',
    ],
    missingSkills: ['Cloud Infrastructure (GCP / AWS)'],
    description:
      'Collaborate on client-facing distributed cloud dashboards and service integration pipelines. Ideal for early-career developers with strong component fundamentals.',
    responsibilities: [
      'Build responsive UI interfaces in React with strict TypeScript contracts',
      'Integrate RESTful microservices and validate payload consistency',
      'Assist with containerized deployment scripts and staging test suites',
      'Participate in code reviews, design documentation, and sprint retrospectives',
    ],
    perks: [
      'Comprehensive mentorship program',
      'Hardware and home office stipend',
      'Structured professional development budget',
    ],
    isBookmarked: true,
    hasApplied: false,
    isDemoData: true,
  },
  {
    id: 'opp-102',
    title: 'Software Engineering Intern (Backend focus)',
    organization: 'Distributed Data Systems Lab',
    type: 'Internship',
    workMode: 'Remote',
    location: 'National Remote',
    experienceLevel: 'Internship / Student',
    stipendOrSalary: 'Competitive Hourly Stipend',
    deadline: '21 days remaining',
    matchScore: 82,
    requiredSkills: [
      'Node.js & Express REST APIs',
      'PostgreSQL & Relational Data Modeling',
      'Git Version Control & Code Review',
      'Docker & Containerization',
      'System Design & Distributed Scalability',
    ],
    matchedSkills: [
      'Node.js & Express REST APIs',
      'PostgreSQL & Relational Data Modeling',
      'Git Version Control & Code Review',
    ],
    missingSkills: [
      'Docker & Containerization',
      'System Design & Distributed Scalability',
    ],
    description:
      'Build scalable backend microservices, implement database migrations, and support automated pipeline testing across distributed environments.',
    responsibilities: [
      'Write modular endpoints using Express and asynchronous handler routines',
      'Profile SQL query plans and create indexed database migrations',
      'Develop automated unit and integration tests for API services',
    ],
    perks: [
      '1:1 senior engineer mentor pairing',
      'Flexible remote schedule',
      'Potential return offer for graduating students',
    ],
    isBookmarked: false,
    hasApplied: false,
    isDemoData: true,
  },
  {
    id: 'opp-103',
    title: 'Full Stack Associate Developer',
    organization: 'Digital Experience Labs',
    type: 'Full-time',
    workMode: 'On-site',
    location: 'Central Technology Park',
    experienceLevel: 'Associate (1-3 yrs)',
    stipendOrSalary: 'Market Baseline Bracket',
    deadline: '8 days remaining',
    matchScore: 78,
    requiredSkills: [
      'React Ecosystem & Next.js',
      'TypeScript & Modern JavaScript',
      'Git Version Control & Code Review',
      'Agile & Technical Collaboration',
      'System Design & Distributed Scalability',
    ],
    matchedSkills: [
      'React Ecosystem & Next.js',
      'TypeScript & Modern JavaScript',
      'Git Version Control & Code Review',
      'Agile & Technical Collaboration',
    ],
    missingSkills: ['System Design & Distributed Scalability'],
    description:
      'Participate in rapid application prototyping, responsive UI engineering, and backend microservice integration for core platform suites.',
    responsibilities: [
      'Deliver accessible front-end features adhering to WCAG standards',
      'Collaborate with UI/UX designers to translate Figma specs into code',
      'Refactor legacy modules into modern modular TypeScript patterns',
    ],
    perks: [
      'On-site cafeteria and transit pass',
      'Health, dental, and wellness allowance',
      'Annual technical conference travel stipend',
    ],
    isBookmarked: false,
    hasApplied: true,
    isDemoData: true,
  },
  {
    id: 'opp-104',
    title: 'Cloud DevOps & Systems Fellow',
    organization: 'Infrastructure Research Consortium',
    type: 'Fellowship',
    workMode: 'Hybrid',
    location: 'Regional Research Campus',
    experienceLevel: 'Associate (1-3 yrs)',
    stipendOrSalary: 'Research Grant Stipend',
    deadline: '28 days remaining',
    matchScore: 68,
    requiredSkills: [
      'Docker & Containerization',
      'CI/CD Pipelines & GitHub Actions',
      'Cloud Infrastructure (GCP / AWS)',
      'System Design & Distributed Scalability',
    ],
    matchedSkills: [
      'Docker & Containerization',
      'CI/CD Pipelines & GitHub Actions',
    ],
    missingSkills: [
      'Cloud Infrastructure (GCP / AWS)',
      'System Design & Distributed Scalability',
    ],
    description:
      'Hands-on immersion in resilient cloud architectures, container orchestration, telemetry metrics, and high-availability deployment patterns.',
    responsibilities: [
      'Design reproducible Docker build images for laboratory pipelines',
      'Configure automated GitHub Actions linting and continuous deployment',
      'Monitor container uptime, latency alerts, and resource utilization',
    ],
    perks: [
      'Academic publishing co-authorship opportunities',
      'Access to cloud computing credits and testbed clusters',
      'Hybrid office flexibility',
    ],
    isBookmarked: false,
    hasApplied: false,
    isDemoData: true,
  },
  {
    id: 'opp-105',
    title: 'Frontend Engineering Intern',
    organization: 'Interactive Software Foundry',
    type: 'Internship',
    workMode: 'Remote',
    location: 'National Remote',
    experienceLevel: 'Internship / Student',
    stipendOrSalary: 'Standard Internship Stipend',
    deadline: '16 days remaining',
    matchScore: 92,
    requiredSkills: [
      'TypeScript & Modern JavaScript',
      'React Ecosystem & Next.js',
      'Git Version Control & Code Review',
      'Agile & Technical Collaboration',
    ],
    matchedSkills: [
      'TypeScript & Modern JavaScript',
      'React Ecosystem & Next.js',
      'Git Version Control & Code Review',
      'Agile & Technical Collaboration',
    ],
    missingSkills: [],
    description:
      'Assist in engineering high-fidelity web client interfaces, component state architectures, and interactive data visualization widgets.',
    responsibilities: [
      'Implement modular design system components with Tailwind CSS',
      'Ensure cross-browser compatibility and responsive viewport scaling',
      'Write Cypress and Jest test cases for interactive user flows',
    ],
    perks: [
      'Flexible working hours across all time zones',
      'Virtual co-working spaces and mentorship pods',
      'Free software and learning platform subscriptions',
    ],
    isBookmarked: false,
    hasApplied: false,
    isDemoData: true,
  },
  {
    id: 'opp-106',
    title: 'Data Systems & ETL Junior Associate',
    organization: 'Analytical Computing Network',
    type: 'Full-time',
    workMode: 'Hybrid',
    location: 'Metro Innovation District',
    experienceLevel: 'Entry Level (0-1 yrs)',
    stipendOrSalary: 'Associate Tier Salary',
    deadline: '24 days remaining',
    matchScore: 74,
    requiredSkills: [
      'PostgreSQL & Relational Data Modeling',
      'Python & Algorithmic Problem Solving',
      'Git Version Control & Code Review',
      'Cloud Infrastructure (GCP / AWS)',
    ],
    matchedSkills: [
      'PostgreSQL & Relational Data Modeling',
      'Python & Algorithmic Problem Solving',
      'Git Version Control & Code Review',
    ],
    missingSkills: ['Cloud Infrastructure (GCP / AWS)'],
    description:
      'Support automated data pipeline workflows, SQL analytical queries, and cloud data warehouse integration for enterprise analytics.',
    responsibilities: [
      'Maintain scheduled SQL ETL jobs and data validation scripts',
      'Document schema dictionaries and data flow lineage graphs',
      'Collaborate with analytics teams on dashboard reporting feeds',
    ],
    perks: [
      'Tuition reimbursement for technical certifications',
      'Hybrid commute allowance',
      'Annual team innovation hackathon',
    ],
    isBookmarked: false,
    hasApplied: false,
    isDemoData: true,
  },
];

/**
 * Dynamic match calculator: recalculates matched and missing skills against candidate profile
 */
export function recalculateOpportunityMatch(
  opp: OpportunityItem,
  candidateSkills: SkillItem[]
): OpportunityItem {
  if (!opp.requiredSkills || opp.requiredSkills.length === 0) {
    return opp;
  }

  const matched: string[] = [];
  const missing: string[] = [];

  opp.requiredSkills.forEach((req) => {
    const isPresent = candidateSkills.some(
      (c) =>
        c.name.toLowerCase() === req.toLowerCase() ||
        c.name.toLowerCase().includes(req.toLowerCase()) ||
        req.toLowerCase().includes(c.name.toLowerCase())
    );

    if (isPresent) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  });

  const total = opp.requiredSkills.length;
  const matchScore = total > 0 ? Math.round((matched.length / total) * 100) : opp.matchScore;

  return {
    ...opp,
    matchedSkills: matched,
    missingSkills: missing,
    matchScore,
  };
}

/**
 * Primary Opportunities API client
 */
export const opportunitiesApi = {
  /**
   * Fetches opportunities matching candidate skills and filter parameters.
   * Mirrors `GET /api/opportunities`.
   */
  async getOpportunities(
    params: OpportunitiesFilterParams = {},
    candidateSkills: SkillItem[] = []
  ): Promise<OpportunitiesResponse> {
    if (params.simulateError) {
      throw new Error(
        'Failed to load opportunities from /api/opportunities. Upstream service returned 503 Service Unavailable.'
      );
    }

    if (params.simulateEmpty) {
      return {
        success: true,
        data: [],
        totalCount: 0,
        filteredCount: 0,
        isDemoData: false,
        ethicalNotice:
          'Recommendations are educational suggestions and benchmark simulations, not hiring decisions.',
        apiEndpoint: '/api/opportunities',
        latencyMs: 120,
      };
    }

    try {
      const query = new URLSearchParams();
      if (params.search) query.set('search', params.search);
      if (params.type && params.type !== 'All') query.set('type', params.type);
      if (params.workMode && params.workMode !== 'All') query.set('workMode', params.workMode);
      if (params.experienceLevel && params.experienceLevel !== 'All') query.set('experienceLevel', params.experienceLevel);
      if (params.sortBy) query.set('sortBy', params.sortBy);

      const res = await apiRequest(`/api/opportunities?${query.toString()}`, { method: 'GET' });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        let items = res.data.map((opp: OpportunityItem) =>
          recalculateOpportunityMatch(opp, candidateSkills)
        );

        if (params.onlyBookmarked) {
          items = items.filter((opp: OpportunityItem) => opp.isBookmarked);
        }

        return {
          success: true,
          data: items,
          totalCount: items.length,
          filteredCount: items.length,
          isDemoData: false,
          ethicalNotice: 'Recommendations are dynamically calibrated against your active competencies.',
          apiEndpoint: '/api/opportunities',
          latencyMs: 120,
        };
      }
    } catch (err) {
      console.warn('Backend opportunities fetch failed, using local benchmarks:', err);
    }

    // Recalculate match scores based on candidate's live profile
    let items = SAMPLE_OPPORTUNITIES.map((opp) =>
      recalculateOpportunityMatch(opp, candidateSkills)
    );

    // Apply Search
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(
        (opp) =>
          opp.title.toLowerCase().includes(q) ||
          opp.organization.toLowerCase().includes(q) ||
          opp.location.toLowerCase().includes(q) ||
          opp.matchedSkills.some((s) => s.toLowerCase().includes(q)) ||
          opp.missingSkills.some((s) => s.toLowerCase().includes(q)) ||
          (opp.requiredSkills && opp.requiredSkills.some((s) => s.toLowerCase().includes(q)))
      );
    }

    // Apply Type Filter
    if (params.type && params.type !== 'All') {
      items = items.filter((opp) => opp.type === params.type);
    }

    // Apply Work Mode Filter
    if (params.workMode && params.workMode !== 'All') {
      items = items.filter((opp) => opp.workMode === params.workMode);
    }

    // Apply Experience Level Filter
    if (params.experienceLevel && params.experienceLevel !== 'All') {
      items = items.filter((opp) => opp.experienceLevel === params.experienceLevel);
    }

    // Apply Match Score Filter
    if (params.matchScoreFilter && params.matchScoreFilter !== 'All') {
      if (params.matchScoreFilter === '80%+') {
        items = items.filter((opp) => opp.matchScore >= 80);
      } else if (params.matchScoreFilter === '60-79%') {
        items = items.filter((opp) => opp.matchScore >= 60 && opp.matchScore < 80);
      } else if (params.matchScoreFilter === 'Under 60%') {
        items = items.filter((opp) => opp.matchScore < 60);
      }
    }

    // Apply Bookmarked Only Filter
    if (params.onlyBookmarked) {
      items = items.filter((opp) => opp.isBookmarked);
    }

    // Apply Sorting
    const sortBy = params.sortBy || 'match_desc';
    items.sort((a, b) => {
      if (sortBy === 'match_desc') return b.matchScore - a.matchScore;
      if (sortBy === 'match_asc') return a.matchScore - b.matchScore;
      if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
      if (sortBy === 'deadline_asc') return a.deadline.localeCompare(b.deadline);
      return 0;
    });

    return {
      success: true,
      data: items,
      totalCount: SAMPLE_OPPORTUNITIES.length,
      filteredCount: items.length,
      isDemoData: true,
      ethicalNotice:
        'Recommendations are educational suggestions and benchmark simulations, not hiring decisions.',
      apiEndpoint: '/api/opportunities',
      latencyMs: 340,
    };
  },
};

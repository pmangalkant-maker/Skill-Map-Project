import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavItemKey,
  UserProfile,
  SkillItem,
  SkillGapMetric,
  OpportunityItem,
  RoadmapMilestone,
  UploadedResume,
  UserRole,
} from '../types';
import { matchingApi, computeSkillGapAnalysis } from '../services/matchingApi';
import { authApi } from '../services/authApi';
import { skillsApi } from '../services/skillsApi';
import { resumeApi } from '../services/resumeApi';
import { roadmapApi } from '../services/roadmapApi';
import { apiRequest } from '../services/apiClient';

interface AppContextType {
  activeNav: NavItemKey;
  setActiveNav: (key: NavItemKey) => void;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  skills: SkillItem[];
  setSkills: React.Dispatch<React.SetStateAction<SkillItem[]>>;
  refreshSkills: () => Promise<void>;
  addSkill: (skill: Omit<SkillItem, 'id' | 'lastUpdated'>) => Promise<SkillItem>;
  deleteSkill: (id: string) => Promise<void>;
  updateSkillScore: (id: string, newScore: number) => Promise<void>;
  updateSkill: (id: string, updates: Partial<SkillItem>) => Promise<SkillItem>;
  confirmAiSkill: (id: string) => Promise<void>;
  gapMetric: SkillGapMetric;
  updateTargetRole: (role: string) => void;
  opportunities: OpportunityItem[];
  toggleBookmark: (id: string) => void;
  applyToOpportunity: (id: string) => void;
  roadmap: RoadmapMilestone[];
  updateMilestoneProgress: (id: string, deltaHours: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  uploadedResume: UploadedResume | null;
  setUploadedResume: (resume: UploadedResume | null) => void;
  deleteResume: () => Promise<void>;
  // Visual state showcase mode to test loading, empty, error states
  demoState: 'normal' | 'loading' | 'empty' | 'error';
  setDemoState: (mode: 'normal' | 'loading' | 'empty' | 'error') => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  authView: 'landing' | 'login' | 'register';
  setAuthView: (view: 'landing' | 'login' | 'register') => void;
  registeredEmail: string;
  setRegisteredEmail: (email: string) => void;
  login: (credentials: { email: string; password: string; rememberMe?: boolean; role?: UserRole }) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string; targetRole?: string; role?: UserRole }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const initialUser: UserProfile = {
  role: 'student',
  id: 'usr-4091',
  name: 'Candidate User',
  headline: 'Computing & Software Systems Scholar',
  email: 'user.profile@institution.edu',
  education: 'State University of Technology',
  degree: 'B.S. in Computer Science & Engineering',
  graduationYear: '2026',
  targetRole: 'Full Stack Cloud Engineer',
  department: 'Department of Computing',
  experienceLevel: 'Undergraduate / Early Professional',
  bio: 'Specializing in web architectures, modern API development, and distributed systems. Actively mapping technical competency gaps and seeking career pathways.',
  location: 'Tech Hub Campus',
  careerInterests: [
    'Cloud Architectures',
    'Distributed Systems',
    'API Platform Engineering',
    'DevOps & CI/CD',
    'Full Stack Web',
  ],
  readinessScore: 78,
  skillsCount: 12,
  completedRoadmapModules: 14,
  totalRoadmapModules: 20,
};

const initialSkills: SkillItem[] = [
  {
    id: 'sk-1',
    name: 'TypeScript & Modern JavaScript',
    category: 'Technical Skills',
    level: 'Advanced',
    score: 88,
    targetScore: 90,
    status: 'Verified',
    source: 'manually_added',
    isAiExtracted: false,
    confirmedByCandidate: true,
    lastUpdated: '2 days ago',
  },
  {
    id: 'sk-2',
    name: 'React Ecosystem & Next.js',
    category: 'Technical Skills',
    level: 'Advanced',
    score: 84,
    targetScore: 85,
    status: 'Verified',
    source: 'resume_extracted',
    isAiExtracted: true,
    aiConfidence: 94,
    confirmedByCandidate: true,
    lastUpdated: '1 week ago',
  },
  {
    id: 'sk-3',
    name: 'Node.js & Express REST APIs',
    category: 'Technical Skills',
    level: 'Intermediate',
    score: 74,
    targetScore: 85,
    status: 'Self-Assessed',
    source: 'resume_extracted',
    isAiExtracted: true,
    aiConfidence: 89,
    confirmedByCandidate: false,
    notes: 'Extracted from Project section: Microservices backend API development',
    lastUpdated: '3 days ago',
  },
  {
    id: 'sk-4',
    name: 'Python & Algorithmic Problem Solving',
    category: 'Technical Skills',
    level: 'Intermediate',
    score: 72,
    targetScore: 80,
    status: 'Self-Assessed',
    source: 'manually_added',
    isAiExtracted: false,
    confirmedByCandidate: true,
    lastUpdated: '4 days ago',
  },
  {
    id: 'sk-5',
    name: 'Agile & Technical Collaboration',
    category: 'Soft Skills',
    level: 'Advanced',
    score: 85,
    targetScore: 85,
    status: 'Verified',
    source: 'resume_extracted',
    isAiExtracted: true,
    aiConfidence: 92,
    confirmedByCandidate: true,
    lastUpdated: '3 weeks ago',
  },
  {
    id: 'sk-6',
    name: 'Technical Writing & Architecture Documentation',
    category: 'Soft Skills',
    level: 'Intermediate',
    score: 78,
    targetScore: 80,
    status: 'Self-Assessed',
    source: 'manually_added',
    isAiExtracted: false,
    confirmedByCandidate: true,
    lastUpdated: '5 days ago',
  },
  {
    id: 'sk-7',
    name: 'Cross-Functional Team Leadership',
    category: 'Soft Skills',
    level: 'Intermediate',
    score: 75,
    targetScore: 85,
    status: 'Self-Assessed',
    source: 'resume_extracted',
    isAiExtracted: true,
    aiConfidence: 86,
    confirmedByCandidate: false,
    notes: 'Inferred from hackathon lead and campus mentorship experience',
    lastUpdated: '1 week ago',
  },
  {
    id: 'sk-8',
    name: 'Cloud Infrastructure (GCP / AWS)',
    category: 'Tools & Technologies',
    level: 'Intermediate',
    score: 62,
    targetScore: 80,
    status: 'Learning',
    source: 'resume_extracted',
    isAiExtracted: true,
    aiConfidence: 81,
    confirmedByCandidate: false,
    notes: 'Inferred from Google Cloud Run deployment mentions in project descriptions',
    lastUpdated: 'Yesterday',
  },
  {
    id: 'sk-9',
    name: 'Docker & Containerization',
    category: 'Tools & Technologies',
    level: 'Intermediate',
    score: 65,
    targetScore: 75,
    status: 'Self-Assessed',
    source: 'resume_extracted',
    isAiExtracted: true,
    aiConfidence: 91,
    confirmedByCandidate: true,
    lastUpdated: '4 days ago',
  },
  {
    id: 'sk-10',
    name: 'CI/CD Pipelines & GitHub Actions',
    category: 'Tools & Technologies',
    level: 'Intermediate',
    score: 60,
    targetScore: 75,
    status: 'Self-Assessed',
    source: 'manually_added',
    isAiExtracted: false,
    confirmedByCandidate: true,
    lastUpdated: '5 days ago',
  },
  {
    id: 'sk-11',
    name: 'Git Version Control & Code Review',
    category: 'Tools & Technologies',
    level: 'Advanced',
    score: 90,
    targetScore: 90,
    status: 'Verified',
    source: 'manually_added',
    isAiExtracted: false,
    confirmedByCandidate: true,
    lastUpdated: '2 weeks ago',
  },
  {
    id: 'sk-12',
    name: 'PostgreSQL & Relational Data Modeling',
    category: 'Other Skills',
    level: 'Intermediate',
    score: 70,
    targetScore: 80,
    status: 'Self-Assessed',
    source: 'resume_extracted',
    isAiExtracted: true,
    aiConfidence: 87,
    confirmedByCandidate: false,
    notes: 'Extracted from Coursework: Relational Database Systems & Indexing',
    lastUpdated: '2 weeks ago',
  },
  {
    id: 'sk-13',
    name: 'System Design & Distributed Scalability',
    category: 'Other Skills',
    level: 'Beginner',
    score: 48,
    targetScore: 75,
    status: 'Learning',
    source: 'manually_added',
    isAiExtracted: false,
    confirmedByCandidate: true,
    lastUpdated: 'Just now',
  },
  {
    id: 'sk-14',
    name: 'Web Security & OWASP Standards',
    category: 'Other Skills',
    level: 'Beginner',
    score: 52,
    targetScore: 70,
    status: 'Learning',
    source: 'manually_added',
    isAiExtracted: false,
    confirmedByCandidate: true,
    lastUpdated: '6 days ago',
  },
];

const initialGapMetric: SkillGapMetric = {
  targetRole: 'Full Stack Cloud Engineer',
  overallMatchRate: 78,
  criticalGapsCount: 2,
  matchedCount: 5,
  inProgressCount: 5,
  skills: [
    {
      id: 'gap-1',
      name: 'System Design & Scalability',
      category: 'Domain Knowledge',
      currentScore: 48,
      requiredScore: 75,
      gap: 27,
      priority: 'High',
      status: 'Action Needed',
    },
    {
      id: 'gap-2',
      name: 'Cloud Infrastructure (GCP/AWS)',
      category: 'Tools & Systems',
      currentScore: 62,
      requiredScore: 80,
      gap: 18,
      priority: 'High',
      status: 'In Progress',
    },
    {
      id: 'gap-3',
      name: 'Docker & Containerization',
      category: 'Tools & Systems',
      currentScore: 65,
      requiredScore: 75,
      gap: 10,
      priority: 'Medium',
      status: 'In Progress',
    },
    {
      id: 'gap-4',
      name: 'Node.js & Express APIs',
      category: 'Technical',
      currentScore: 74,
      requiredScore: 85,
      gap: 11,
      priority: 'Medium',
      status: 'In Progress',
    },
    {
      id: 'gap-5',
      name: 'TypeScript & JavaScript',
      category: 'Technical',
      currentScore: 88,
      requiredScore: 90,
      gap: 2,
      priority: 'Low',
      status: 'Met',
    },
    {
      id: 'gap-6',
      name: 'React Ecosystem',
      category: 'Technical',
      currentScore: 84,
      requiredScore: 85,
      gap: 1,
      priority: 'Low',
      status: 'Met',
    },
  ],
};

const initialOpportunities: OpportunityItem[] = [
  {
    id: 'job-101',
    title: 'Junior Cloud Applications Engineer',
    organization: 'Cloud Platform Systems',
    type: 'Full-time',
    workMode: 'Hybrid',
    location: 'Metro Innovation District',
    matchScore: 89,
    stipendOrSalary: 'Competitive Standard Rate',
    deadline: '14 days remaining',
    matchedSkills: ['TypeScript', 'React Ecosystem', 'RESTful APIs', 'PostgreSQL'],
    missingSkills: ['Cloud Infrastructure (GCP/AWS)'],
    description:
      'Collaborate on client-facing distributed cloud dashboards and service integration pipelines. Ideal for early-career developers with strong component fundamentals.',
    isBookmarked: true,
    hasApplied: false,
  },
  {
    id: 'job-102',
    title: 'Software Engineering Intern (Backend focus)',
    organization: 'Enterprise Data Solutions',
    type: 'Internship',
    workMode: 'Remote',
    location: 'National Remote',
    matchScore: 82,
    stipendOrSalary: 'Competitive Hourly Stipend',
    deadline: '21 days remaining',
    matchedSkills: ['Node.js & Express APIs', 'PostgreSQL', 'Agile'],
    missingSkills: ['Docker & Containerization', 'System Design'],
    description:
      'Build scalable backend microservices, implement database migrations, and support automated pipeline testing across distributed environments.',
    isBookmarked: false,
    hasApplied: false,
  },
  {
    id: 'job-103',
    title: 'Full Stack Associate Developer',
    organization: 'Digital Experience Labs',
    type: 'Full-time',
    workMode: 'On-site',
    location: 'Central Technology Park',
    matchScore: 79,
    stipendOrSalary: 'Standard Associate Bracket',
    deadline: '7 days remaining',
    matchedSkills: ['React Ecosystem', 'TypeScript', 'Agile'],
    missingSkills: ['System Design & Scalability'],
    description:
      'Participate in rapid application prototyping, responsive UI engineering, and backend microservice integration for core platform suites.',
    isBookmarked: false,
    hasApplied: true,
  },
  {
    id: 'job-104',
    title: 'Cloud DevOps & Systems Fellow',
    organization: 'Infrastructure Research Institute',
    type: 'Fellowship',
    workMode: 'Hybrid',
    location: 'Regional Research Campus',
    matchScore: 68,
    stipendOrSalary: 'Research Grant Allowance',
    deadline: '30 days remaining',
    matchedSkills: ['Docker & Containerization', 'CI/CD Pipelines'],
    missingSkills: ['Cloud Infrastructure (GCP/AWS)', 'System Design'],
    description:
      'Hands-on immersion in resilient cloud architectures, container orchestration, telemetry metrics, and high-availability deployment patterns.',
    isBookmarked: false,
    hasApplied: false,
  },
];

const initialRoadmap: RoadmapMilestone[] = [
  {
    id: 'rd-1',
    title: 'System Design Patterns & Architectural Trade-offs',
    skillFocus: 'System Design & Scalability',
    estimatedHours: 24,
    completedHours: 8,
    modulesCount: 6,
    completedModules: 2,
    status: 'In Progress',
    priority: 'High',
    description:
      'Master microservices communication, caching tiers, load balancing, and CAP theorem trade-offs through targeted case evaluations.',
  },
  {
    id: 'rd-2',
    title: 'Cloud Core & Production Deployment Foundations',
    skillFocus: 'Cloud Infrastructure (GCP/AWS)',
    estimatedHours: 30,
    completedHours: 15,
    modulesCount: 8,
    completedModules: 4,
    status: 'In Progress',
    priority: 'High',
    description:
      'Configure compute instances, VPC networking, managed databases, and IAM access control policies in production sandboxes.',
  },
  {
    id: 'rd-3',
    title: 'Container Orchestration & Multi-Stage Builds',
    skillFocus: 'Docker & Containerization',
    estimatedHours: 16,
    completedHours: 16,
    modulesCount: 4,
    completedModules: 4,
    status: 'Completed',
    priority: 'Medium',
    description:
      'Write optimized Dockerfiles, manage multi-container compose topologies, and minimize production image footprints.',
  },
  {
    id: 'rd-4',
    title: 'Event-Driven Microservices & Queue Pipelines',
    skillFocus: 'Node.js & Express APIs',
    estimatedHours: 20,
    completedHours: 0,
    modulesCount: 5,
    completedModules: 0,
    status: 'Upcoming',
    priority: 'Medium',
    description:
      'Implement asynchronous job queues, webhook consumers, and idempotent data pipelines for decoupled services.',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeNav, setActiveNav] = useState<NavItemKey>('dashboard');
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [gapMetric, setGapMetric] = useState<SkillGapMetric>(initialGapMetric);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(initialOpportunities);
  const [roadmap, setRoadmap] = useState<RoadmapMilestone[]>(initialRoadmap);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [demoState, setDemoState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>('landing');
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const [uploadedResume, setUploadedResume] = useState<UploadedResume | null>(null);

  useEffect(() => {
    authApi.getCurrentSession().then((session) => {
      if (session.authenticated) {
        setIsAuthenticated(true);
        if (session.user) {
          setUser((prev) => ({ ...prev, ...session.user, id: String(session.user.id || prev.id) }));
        }
        // Load real user data from MongoDB backend
        skillsApi.getSkills().then((fetchedSkills) => {
          if (Array.isArray(fetchedSkills)) {
            setSkills(fetchedSkills);
            setUser((prev) => ({ ...prev, skillsCount: fetchedSkills.length }));
          }
        }).catch((err) => {
          console.warn('Backend getSkills error on init:', err);
        });
        resumeApi.getResume().then((res) => {
          if (res) setUploadedResume(res);
        });
        roadmapApi.getRoadmap(session.user?.targetRole || 'Full Stack Cloud Engineer', []).then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setRoadmap(res.data);
          }
        }).catch((err) => {
          console.warn('Backend roadmap fetch error on init:', err);
        });
      }
    });
  }, []);

  const deleteResume = async () => {
    try {
      await resumeApi.deleteResume();
    } catch (err) {
      console.warn('Delete resume error:', err);
    } finally {
      setUploadedResume(null);
    }
  };

  const refreshSkills = async () => {
    try {
      const fetchedSkills = await skillsApi.getSkills();
      if (Array.isArray(fetchedSkills)) {
        setSkills(fetchedSkills);
        setUser((prev) => ({ ...prev, skillsCount: fetchedSkills.length }));
      }
    } catch (err) {
      console.warn('refreshSkills error:', err);
    }
  };

  const login = async (credentials: { email: string; password: string; rememberMe?: boolean; role?: UserRole }): Promise<{ success: boolean; error?: string }> => {
    const result = await authApi.login({ ...credentials, role: credentials.role || 'student' });
    if (!result.success) return { success: false, error: result.error };
    setIsAuthenticated(true);
    setActiveNav('dashboard');
    if (result.user) {
      setUser((prev) => ({ ...prev, ...result.user, id: String(result.user.id || prev.id) }));
    }
    // Fetch user skills and resume upon login from MongoDB
    try {
      const fetchedSkills = await skillsApi.getSkills();
      if (Array.isArray(fetchedSkills)) {
        setSkills(fetchedSkills);
        setUser((prev) => ({ ...prev, skillsCount: fetchedSkills.length }));
      }
    } catch (err) {
      console.warn('Skills fetch after login failed:', err);
    }
    resumeApi.getResume().then((res) => {
      if (res) setUploadedResume(res);
    });
    roadmapApi.getRoadmap(result.user?.targetRole || 'Full Stack Cloud Engineer', []).then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setRoadmap(res.data);
      }
    }).catch((err) => {
      console.warn('Roadmap fetch after login failed:', err);
    });
    return { success: true };
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    targetRole?: string;
    role?: UserRole;
  }): Promise<{ success: boolean; error?: string }> => {
    const result = await authApi.register(data);
    if (!result.success) return { success: false, error: result.error };
    const cleanName = data.name.trim();
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPhone = data.phone?.trim() || '';
    const cleanRole = data.targetRole?.trim() || 'Software Engineer / Architect';
    setUser((prev) => ({
      ...prev,
      ...(result.user || {}),
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      targetRole: cleanRole,
      id: String(result.user?.id || prev.id),
    }));
    setRegisteredEmail(cleanEmail);
    setIsAuthenticated(true);
    setActiveNav('dashboard');
    // Fresh user starts with empty or default skills from MongoDB
    try {
      const fetchedSkills = await skillsApi.getSkills();
      if (Array.isArray(fetchedSkills)) {
        setSkills(fetchedSkills);
        setUser((prev) => ({ ...prev, skillsCount: fetchedSkills.length }));
      }
    } catch (err) {
      console.warn('Skills fetch after register failed:', err);
    }
    roadmapApi.getRoadmap(cleanRole, []).then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setRoadmap(res.data);
      }
    }).catch((err) => {
      console.warn('Roadmap fetch after register failed:', err);
    });
    return { success: true };
  };

  const logout = () => {
    void authApi.logout();
    setIsAuthenticated(false);
    setAuthView('login');
    setActiveNav('dashboard');
    setUser(initialUser);
    setSkills(initialSkills);
    setUploadedResume(null);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addSkill = async (newSkillData: Omit<SkillItem, 'id' | 'lastUpdated'>): Promise<SkillItem> => {
    // Persist to MongoDB backend
    const savedSkill = await skillsApi.createSkill(newSkillData);
    setSkills((prev) => [
      savedSkill,
      ...prev.filter((s) => s.id !== savedSkill.id && s.name.toLowerCase() !== savedSkill.name.toLowerCase()),
    ]);
    setUser((prev) => ({ ...prev, skillsCount: prev.skillsCount + 1 }));
    return savedSkill;
  };

  const deleteSkill = async (id: string): Promise<void> => {
    // Delete from MongoDB
    await skillsApi.deleteSkill(id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
    setUser((prev) => ({ ...prev, skillsCount: Math.max(0, prev.skillsCount - 1) }));
  };

  const updateSkillScore = async (id: string, newScore: number): Promise<void> => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, score: newScore, lastUpdated: 'Just now' } : s))
    );
    try {
      await skillsApi.updateSkill(id, { score: newScore });
    } catch (err) {
      console.warn('Backend skill score update failed:', err);
    }
  };

  const updateSkill = async (id: string, updates: Partial<SkillItem>): Promise<SkillItem> => {
    const updated = await skillsApi.updateSkill(id, updates);
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated, lastUpdated: 'Just now' } : s))
    );
    return updated;
  };

  const confirmAiSkill = async (id: string): Promise<void> => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, confirmedByCandidate: true, status: 'Verified' as const, lastUpdated: 'Just now' } : s))
    );
    try {
      await skillsApi.updateSkill(id, { confirmedByCandidate: true, status: 'Verified' });
    } catch (err) {
      console.warn('Backend AI skill confirmation failed:', err);
    }
  };

  const updateTargetRole = (newRole: string) => {
    setUser((prev) => ({ ...prev, targetRole: newRole }));
    matchingApi
      .analyzeRole({ targetRole: newRole, candidateSkills: skills })
      .then((analysis) => {
        setGapMetric({
          targetRole: newRole,
          overallMatchRate: analysis.overallMatchPercentage,
          criticalGapsCount: analysis.allRequiredSkills.filter((s) => s.gap > 15).length,
          matchedCount: analysis.matchedSkills.length,
          inProgressCount: analysis.partiallyMatchedSkills.length,
          skills: analysis.allRequiredSkills.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            currentScore: item.candidateScore,
            requiredScore: item.requiredScore,
            gap: item.gap,
            priority: item.priority,
            status:
              item.status === 'Matched'
                ? 'Met'
                : item.status === 'Partially Matched'
                ? 'In Progress'
                : 'Action Needed',
          })),
        });
      })
      .catch(() => {
        try {
          const analysis = computeSkillGapAnalysis(newRole, skills);
          setGapMetric({
            targetRole: newRole,
            overallMatchRate: analysis.overallMatchPercentage,
            criticalGapsCount: analysis.allRequiredSkills.filter((s) => s.gap > 15).length,
            matchedCount: analysis.matchedSkills.length,
            inProgressCount: analysis.partiallyMatchedSkills.length,
            skills: analysis.allRequiredSkills.map((item) => ({
              id: item.id,
              name: item.name,
              category: item.category,
              currentScore: item.candidateScore,
              requiredScore: item.requiredScore,
              gap: item.gap,
              priority: item.priority,
              status:
                item.status === 'Matched'
                  ? 'Met'
                  : item.status === 'Partially Matched'
                  ? 'In Progress'
                  : 'Action Needed',
            })),
          });
        } catch {
          setGapMetric((prev) => ({ ...prev, targetRole: newRole }));
        }
      });
  };

  const toggleBookmark = (id: string) => {
    setOpportunities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item))
    );
  };

  const applyToOpportunity = (id: string) => {
    const opportunity = opportunities.find((item) => item.id === id);
    setOpportunities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, hasApplied: true } : item))
    );
    if (opportunity) {
      void apiRequest('/api/platform/applications', {
        method: 'POST',
        body: JSON.stringify({ opportunityId: opportunity.id, opportunityTitle: opportunity.title, organization: opportunity.organization }),
      }).catch((err) => console.warn('Application tracking sync failed:', err));
    }
  };

  const updateMilestoneProgress = (id: string, deltaHours: number) => {
    void roadmapApi.updateModuleProgress(id, deltaHours);
    setRoadmap((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newCompleted = Math.min(m.estimatedHours, Math.max(0, m.completedHours + deltaHours));
          const newStatus =
            newCompleted >= m.estimatedHours
              ? 'Completed'
              : newCompleted > 0
              ? 'In Progress'
              : 'Upcoming';
          return {
            ...m,
            completedHours: newCompleted,
            status: newStatus,
          };
        }
        return m;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeNav,
        setActiveNav,
        user,
        updateUser,
        skills,
        setSkills,
        refreshSkills,
        addSkill,
        deleteSkill,
        updateSkillScore,
        updateSkill,
        confirmAiSkill,
        gapMetric,
        updateTargetRole,
        opportunities,
        toggleBookmark,
        applyToOpportunity,
        roadmap,
        updateMilestoneProgress,
        searchQuery,
        setSearchQuery,
        uploadedResume,
        setUploadedResume,
        deleteResume,
        demoState,
        setDemoState,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        isAuthenticated,
        setIsAuthenticated,
        authView,
        setAuthView,
        registeredEmail,
        setRegisteredEmail,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

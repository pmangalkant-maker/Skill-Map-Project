import mongoose from "mongoose";
import Opportunity from "../models/Opportunity.js";
import Application from "../models/Application.js";
import Collaboration from "../models/Collaboration.js";
import RecruiterProfile from "../models/RecruiterProfile.js";
import Interview from "../models/Interview.js";
import Offer from "../models/Offer.js";
import User from "../models/User.js";
import { dataStore } from "./dataStore.js";

// Rich student candidate database with complete competencies
const CANDIDATE_POOL = [
  {
    id: "usr-4091",
    _id: "usr-4091",
    name: "Alex Rivers",
    email: "alex.rivers@example.com",
    phone: "+1 (555) 019-2834",
    targetRole: "Full Stack Cloud Engineer",
    headline: "Full-Stack Software Engineer & Cloud Systems Architect",
    bio: "Passionate early-career engineer specializing in TypeScript, React, and cloud application design. Committed to clean code, robust API architecture, and test-driven development.",
    education: "B.S. in Computer Science & Systems Engineering",
    institution: "University Institute of Technology",
    graduationYear: "2026",
    experienceLevel: "Associate (1-2 yrs)",
    location: "San Francisco Bay Area, CA",
    workModePreference: "Hybrid / Remote",
    readinessScore: 88,
    resumeAvailable: true,
    resumeUrl: "/api/resume/download/demo",
    skills: [
      { name: "TypeScript & Modern JavaScript", category: "Technical Skills", level: "Advanced", score: 88 },
      { name: "React Ecosystem & Next.js", category: "Technical Skills", level: "Advanced", score: 84 },
      { name: "Node.js & Express REST APIs", category: "Technical Skills", level: "Intermediate", score: 78 },
      { name: "PostgreSQL & Relational Data Modeling", category: "Technical Skills", level: "Intermediate", score: 75 },
      { name: "Cloud Infrastructure (GCP / AWS)", category: "Tools & Technologies", level: "Intermediate", score: 70 },
      { name: "Docker & Containerization", category: "Tools & Technologies", level: "Intermediate", score: 72 },
      { name: "Agile & Technical Collaboration", category: "Soft Skills", level: "Advanced", score: 90 },
      { name: "Problem Solving", category: "Soft Skills", level: "Advanced", score: 85 }
    ],
    resumeExtractedSkills: [
      "TypeScript", "JavaScript", "React", "Next.js", "Node.js", "Express", "PostgreSQL",
      "Docker", "AWS", "Git", "REST APIs", "Jest", "Tailwind CSS"
    ],
    assessments: [
      { skill: "React Ecosystem & Next.js", score: 88, status: "Verified", date: "2026-03-01" },
      { skill: "TypeScript & Modern JavaScript", score: 92, status: "Verified", date: "2026-03-02" },
      { skill: "Node.js & Express REST APIs", score: 82, status: "Verified", date: "2026-03-05" }
    ],
    projects: [
      {
        title: "Enterprise Cloud Application Portal",
        technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
        description: "Microservices architecture dashboard with OAuth2 role-based authorization and real-time state synchronization.",
        githubUrl: "https://github.com/alexrivers/cloud-portal"
      },
      {
        title: "Distributed Telemetry Job Queue",
        technologies: ["Node.js", "Docker", "Redis", "PostgreSQL"],
        description: "Fault-tolerant asynchronous job queue processing over 15k events per minute.",
        githubUrl: "https://github.com/alexrivers/telemetry-queue"
      }
    ],
    certifications: [
      { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", year: "2025" },
      { name: "Meta Front-End Developer Specialization", issuer: "Meta", year: "2025" }
    ],
    internships: [
      {
        role: "Software Engineering Fellow",
        company: "Distributed Software Labs",
        duration: "Summer 2025 (3 months)",
        description: "Built component primitives, reduced bundle latency by 18%, and implemented automated integration test suites."
      }
    ]
  },
  {
    id: "usr-candidate-002",
    _id: "usr-candidate-002",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+1 (555) 349-1120",
    targetRole: "Backend Systems & Data Engineer",
    headline: "Backend Systems & Distributed Data Engineer",
    bio: "Focus on resilient backend services, high-throughput message ingestion, and optimized relational database design.",
    education: "B.Tech in Information Technology",
    institution: "National Institute of Technology",
    graduationYear: "2026",
    experienceLevel: "Entry Level (0-1 yrs)",
    location: "Bengaluru / Remote",
    workModePreference: "Remote",
    readinessScore: 86,
    resumeAvailable: true,
    skills: [
      { name: "Node.js & Express REST APIs", category: "Technical Skills", level: "Advanced", score: 86 },
      { name: "Python & FastAPI", category: "Technical Skills", level: "Advanced", score: 88 },
      { name: "PostgreSQL & Relational Data Modeling", category: "Technical Skills", level: "Advanced", score: 82 },
      { name: "Docker & Containerization", category: "Tools & Technologies", level: "Intermediate", score: 78 },
      { name: "MongoDB & NoSQL", category: "Technical Skills", level: "Intermediate", score: 80 },
      { name: "Cloud Infrastructure (GCP / AWS)", category: "Tools & Technologies", level: "Intermediate", score: 75 },
      { name: "Team Communication & Agile", category: "Soft Skills", level: "Advanced", score: 85 }
    ],
    resumeExtractedSkills: [
      "Node.js", "Python", "FastAPI", "PostgreSQL", "MongoDB", "Docker", "AWS", "Redis", "Kafka", "RESTful APIs", "CI/CD", "SQL"
    ],
    assessments: [
      { skill: "Backend Architecture & Python", score: 91, status: "Verified", date: "2026-02-15" },
      { skill: "PostgreSQL & Database Optimization", score: 88, status: "Verified", date: "2026-02-20" }
    ],
    projects: [
      {
        title: "High-Throughput Ingestion Engine",
        technologies: ["Python", "FastAPI", "PostgreSQL", "Kafka"],
        description: "Streaming telemetry ingestion handling 50k events/sec with automated schema migration.",
        githubUrl: "https://github.com/priyasharma/ingestion-engine"
      }
    ],
    certifications: [
      { name: "AWS Certified Developer - Associate", issuer: "Amazon Web Services", year: "2025" }
    ],
    internships: [
      {
        role: "Backend Developer Intern",
        company: "DataPulse Analytics",
        duration: "6 months",
        description: "Designed 12 REST API endpoints, streamlined PostgreSQL indexing, and improved query execution time by 32%."
      }
    ]
  },
  {
    id: "usr-candidate-003",
    _id: "usr-candidate-003",
    name: "Marcus Vance",
    email: "marcus.vance@example.com",
    phone: "+1 (555) 781-4492",
    targetRole: "Frontend UI Specialist & Design Systems",
    headline: "Frontend Specialist & Design Systems Architect",
    bio: "Dedicated to accessible, high-performance UI components, design tokens, and fluid interactions using React, Next.js, and Tailwind CSS.",
    education: "B.S. in Software Engineering",
    institution: "Pacific University",
    graduationYear: "2026",
    experienceLevel: "Associate (1-2 yrs)",
    location: "Seattle, WA",
    workModePreference: "Hybrid",
    readinessScore: 85,
    resumeAvailable: true,
    skills: [
      { name: "React Ecosystem & Next.js", category: "Technical Skills", level: "Advanced", score: 90 },
      { name: "TypeScript & Modern JavaScript", category: "Technical Skills", level: "Advanced", score: 88 },
      { name: "Tailwind CSS & Design Systems", category: "Technical Skills", level: "Advanced", score: 94 },
      { name: "Web Accessibility (WCAG)", category: "Technical Skills", level: "Advanced", score: 86 },
      { name: "Figma & UI Prototyping", category: "Tools & Technologies", level: "Intermediate", score: 82 },
      { name: "Cross-Functional Collaboration", category: "Soft Skills", level: "Advanced", score: 88 }
    ],
    resumeExtractedSkills: [
      "React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "Figma", "WCAG", "Jest", "Storybook", "Responsive Design"
    ],
    assessments: [
      { skill: "React & Next.js Component Architecture", score: 94, status: "Verified", date: "2026-03-04" },
      { skill: "Web Accessibility & Design Systems", score: 89, status: "Verified", date: "2026-03-06" }
    ],
    projects: [
      {
        title: "Fluid Design System Library",
        technologies: ["React", "TypeScript", "Tailwind CSS", "Storybook"],
        description: "Accessible open-source UI component library with zero third-party visual dependencies.",
        githubUrl: "https://github.com/marcusvance/fluid-ui"
      }
    ],
    certifications: [
      { name: "Google UX Design Professional Certificate", issuer: "Google", year: "2025" }
    ],
    internships: [
      {
        role: "Frontend UI Intern",
        company: "Design Systems Cooperative",
        duration: "Summer 2025 (4 months)",
        description: "Implemented WCAG AA-compliant dashboard widgets and interactive data charts."
      }
    ]
  },
  {
    id: "usr-candidate-004",
    _id: "usr-candidate-004",
    name: "Ananya Singh",
    email: "ananya.singh@example.com",
    phone: "+1 (555) 912-6638",
    targetRole: "AI / ML Solutions Engineer",
    headline: "AI / ML Engineer & Applied Data Scientist",
    bio: "Passionate about applied machine learning, LLM fine-tuning, natural language processing, and scalable model inference pipelines.",
    education: "M.S. in Data Science & Machine Learning",
    institution: "Global Tech University",
    graduationYear: "2026",
    experienceLevel: "Entry Level / Graduate",
    location: "New York, NY",
    workModePreference: "Remote",
    readinessScore: 91,
    resumeAvailable: true,
    skills: [
      { name: "Python & Scientific Computing", category: "Technical Skills", level: "Advanced", score: 95 },
      { name: "Machine Learning & Deep Learning", category: "Technical Skills", level: "Advanced", score: 90 },
      { name: "TensorFlow & PyTorch", category: "Technical Skills", level: "Advanced", score: 88 },
      { name: "SQL & Data Warehousing", category: "Technical Skills", level: "Advanced", score: 85 },
      { name: "Cloud ML Runtimes (AWS / GCP)", category: "Tools & Technologies", level: "Intermediate", score: 80 },
      { name: "Scientific Writing & Presentation", category: "Soft Skills", level: "Advanced", score: 92 }
    ],
    resumeExtractedSkills: [
      "Python", "PyTorch", "TensorFlow", "Scikit-Learn", "SQL", "Pandas", "NLP", "LLMs", "Docker", "AWS SageMaker", "FastAPI"
    ],
    assessments: [
      { skill: "Machine Learning & Model Evaluation", score: 96, status: "Verified", date: "2026-02-28" },
      { skill: "Python Scientific Stack", score: 94, status: "Verified", date: "2026-03-01" }
    ],
    projects: [
      {
        title: "Semantic Document Search Engine",
        technologies: ["Python", "PyTorch", "FAISS", "FastAPI"],
        description: "Vector embedding retrieval pipeline indexing 1M+ technical documents with 12ms p95 latency."
      }
    ],
    certifications: [
      { name: "TensorFlow Developer Certificate", issuer: "Google", year: "2025" }
    ],
    internships: [
      {
        role: "Machine Learning Research Fellow",
        company: "OmniAI Labs",
        duration: "6 months",
        description: "Trained and evaluated sequence-to-sequence transformer models for domain summarization."
      }
    ]
  },
  {
    id: "usr-candidate-005",
    _id: "usr-candidate-005",
    name: "Dev Patel",
    email: "dev.patel@example.com",
    phone: "+1 (555) 604-8821",
    targetRole: "DevOps & Cloud Site Reliability Engineer",
    headline: "DevOps & Cloud Site Reliability Specialist",
    bio: "Automating cloud infrastructure, building immutable deployment pipelines, and managing containerized orchestrations on Kubernetes.",
    education: "B.S. in Cloud Computing & DevOps",
    institution: "Western Polytechnic",
    graduationYear: "2026",
    experienceLevel: "Entry Level (0-1 yrs)",
    location: "Austin, TX",
    workModePreference: "Hybrid",
    readinessScore: 84,
    resumeAvailable: true,
    skills: [
      { name: "Cloud Infrastructure (GCP / AWS)", category: "Tools & Technologies", level: "Advanced", score: 88 },
      { name: "Docker & Containerization", category: "Tools & Technologies", level: "Advanced", score: 92 },
      { name: "Kubernetes & Helm", category: "Tools & Technologies", level: "Intermediate", score: 80 },
      { name: "CI/CD Pipelines & GitHub Actions", category: "Tools & Technologies", level: "Advanced", score: 86 },
      { name: "Linux Administration", category: "Technical Skills", level: "Advanced", score: 85 },
      { name: "Terraform & IaC", category: "Tools & Technologies", level: "Intermediate", score: 78 },
      { name: "Incident Response", category: "Soft Skills", level: "Intermediate", score: 82 }
    ],
    resumeExtractedSkills: [
      "AWS", "GCP", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Linux", "Bash", "Prometheus", "Grafana", "Python"
    ],
    assessments: [
      { skill: "Cloud Architecture & Docker", score: 90, status: "Verified", date: "2026-02-22" },
      { skill: "CI/CD & Kubernetes Deployment", score: 85, status: "Verified", date: "2026-03-03" }
    ],
    projects: [
      {
        title: "Automated GitOps Kubernetes Cluster",
        technologies: ["Kubernetes", "Terraform", "AWS", "GitHub Actions"],
        description: "Self-healing multi-node cluster with automated canary rollouts and zero-downtime deployments."
      }
    ],
    certifications: [
      { name: "AWS Certified Solutions Architect - Associate", issuer: "Amazon Web Services", year: "2025" },
      { name: "CKAD - Certified Kubernetes Application Developer", issuer: "CNCF", year: "2025" }
    ],
    internships: [
      {
        role: "Cloud Systems Intern",
        company: "Autonomous Cloud Operations",
        duration: "4 months",
        description: "Configured Terraform infrastructure modules and built Prometheus alerting rules."
      }
    ]
  },
  {
    id: "usr-candidate-006",
    _id: "usr-candidate-006",
    name: "Sophia Lin",
    email: "sophia.lin@example.com",
    phone: "+1 (555) 431-7729",
    targetRole: "Mobile & Cross-Platform Engineer",
    headline: "Mobile & Cross-Platform Application Engineer",
    bio: "Crafting fluid mobile user experiences across iOS and Android with React Native, TypeScript, and offline-first data sync.",
    education: "B.Tech in Computer Engineering",
    institution: "Institute of Technology",
    graduationYear: "2026",
    experienceLevel: "Associate (1-2 yrs)",
    location: "Chicago, IL",
    workModePreference: "Remote",
    readinessScore: 83,
    resumeAvailable: true,
    skills: [
      { name: "React Ecosystem & Next.js", category: "Technical Skills", level: "Advanced", score: 86 },
      { name: "TypeScript & Modern JavaScript", category: "Technical Skills", level: "Advanced", score: 88 },
      { name: "React Native & Mobile SDKs", category: "Technical Skills", level: "Advanced", score: 88 },
      { name: "REST & GraphQL APIs", category: "Technical Skills", level: "Intermediate", score: 82 },
      { name: "User Empathy & Collaboration", category: "Soft Skills", level: "Advanced", score: 88 }
    ],
    resumeExtractedSkills: [
      "React Native", "TypeScript", "React", "GraphQL", "Redux", "iOS", "Android", "REST APIs", "Jest", "Firebase"
    ],
    assessments: [
      { skill: "React Native & Mobile UI", score: 89, status: "Verified", date: "2026-02-18" }
    ],
    projects: [
      {
        title: "Campus Mobility Companion App",
        technologies: ["React Native", "TypeScript", "GraphQL", "Firebase"],
        description: "Mobile app with transit tracking and real-time announcements used by 8,000+ students."
      }
    ],
    certifications: [
      { name: "Meta React Native Specialization", issuer: "Meta", year: "2025" }
    ],
    internships: [
      {
        role: "Mobile Engineering Intern",
        company: "NextWave Mobile Labs",
        duration: "Summer 2025",
        description: "Shipped 4 native modules and optimized startup render latency by 25%."
      }
    ]
  }
];

// Pre-seeded Recruiter Jobs
const INITIAL_JOBS = [
  {
    id: "job-101",
    _id: "job-101",
    title: "Junior Cloud Applications Engineer",
    company: "Apex Global Technologies",
    location: "San Francisco, CA",
    workMode: "Hybrid",
    employmentType: "Full-time",
    salary: "$95,000 - $115,000 / yr",
    experienceLevel: "Entry Level (0-2 yrs)",
    education: "B.S. in Computer Science or related STEM field",
    requiredSkills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Cloud Infrastructure"],
    softSkills: ["Agile & Technical Collaboration", "Problem Solving", "Communication"],
    preferredSkills: ["Docker", "AWS", "CI/CD Pipelines", "Next.js"],
    description: "Contribute to enterprise cloud portal interfaces and backend RESTful microservices. Collaborate closely with staff infrastructure architects and participate in agile sprint reviews.",
    deadline: new Date(Date.now() + 25 * 86400000).toISOString(),
    status: "Active",
    type: "Job",
    applicantsCount: 14,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: "job-102",
    _id: "job-102",
    title: "Backend Systems & Data Engineer",
    company: "Apex Global Technologies",
    location: "Remote / Distributed",
    workMode: "Remote",
    employmentType: "Full-time",
    salary: "$110,000 - $130,000 / yr",
    experienceLevel: "Associate (1-3 yrs)",
    education: "B.S. or B.Tech in IT / Computer Engineering",
    requiredSkills: ["Node.js", "Python", "PostgreSQL", "Docker", "AWS"],
    softSkills: ["System Design", "Critical Thinking", "Team Communication"],
    preferredSkills: ["Kafka", "Redis", "Kubernetes", "FastAPI"],
    description: "Architect high-throughput message ingestion pipelines, optimize SQL query execution plans, and assist with containerized microservice deployments across AWS clusters.",
    deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: "Active",
    type: "Job",
    applicantsCount: 9,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: "job-103",
    _id: "job-103",
    title: "Frontend UI Specialist & Design Systems",
    company: "Apex Global Technologies",
    location: "New York, NY",
    workMode: "Hybrid",
    employmentType: "Full-time",
    salary: "$100,000 - $120,000 / yr",
    experienceLevel: "Associate (1-3 yrs)",
    education: "Degree in Software Engineering, HCI or equivalent",
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Web Accessibility", "Figma"],
    softSkills: ["Design Collaboration", "Attention to Detail"],
    preferredSkills: ["Storybook", "Next.js", "Jest", "Motion"],
    description: "Develop accessible, component-driven interfaces, establish shared token systems, and collaborate with product designers to deliver consistent, responsive web applications.",
    deadline: new Date(Date.now() + 18 * 86400000).toISOString(),
    status: "Active",
    type: "Job",
    applicantsCount: 11,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: "job-104",
    _id: "job-104",
    title: "AI / ML Solutions Engineer",
    company: "Apex Global Technologies",
    location: "Remote",
    workMode: "Remote",
    employmentType: "Full-time",
    salary: "$120,000 - $145,000 / yr",
    experienceLevel: "Graduate / Early Career",
    education: "M.S. or B.S. in Data Science, ML or Computer Science",
    requiredSkills: ["Python", "Machine Learning", "TensorFlow", "SQL", "AWS"],
    softSkills: ["Analytical Thinking", "Research Agility", "Presentation"],
    preferredSkills: ["PyTorch", "NLP", "FastAPI", "Vector DBs"],
    description: "Build applied inference pipelines, fine-tune domain-specific language models, and deploy scalable ML services with monitoring and evaluation benchmarks.",
    deadline: new Date(Date.now() + 40 * 86400000).toISOString(),
    status: "Active",
    type: "Job",
    applicantsCount: 8,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

// Pre-seeded Recruiter Internships
const INITIAL_INTERNSHIPS = [
  {
    id: "int-201",
    _id: "int-201",
    title: "Full-Stack Software Engineering Intern (Summer 2026)",
    company: "Apex Global Technologies",
    duration: "12 Weeks (June - August)",
    stipend: "$4,500 / month",
    location: "Remote / Distributed",
    workMode: "Remote",
    requiredSkills: ["TypeScript", "React", "Node.js", "Git"],
    preferredSkills: ["PostgreSQL", "Docker", "Tailwind CSS"],
    eligibility: "Penultimate or final year B.S./B.Tech students",
    description: "12-week mentored engineering fellowship. Build client-facing components, write automated integration tests, and collaborate with senior staff engineers in daily scrums.",
    deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
    status: "Active",
    type: "Internship",
    applicantsCount: 22,
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    id: "int-202",
    _id: "int-202",
    title: "Cloud Infrastructure & DevOps Intern",
    company: "Apex Global Technologies",
    duration: "16 Weeks",
    stipend: "$4,200 / month",
    location: "Austin, TX",
    workMode: "Hybrid",
    requiredSkills: ["AWS", "Docker", "Linux", "CI/CD Pipelines"],
    preferredSkills: ["Kubernetes", "Terraform", "Python", "Prometheus"],
    eligibility: "Students with solid foundations in networking, OS, and cloud services",
    description: "Automate containerized staging environments, configure CI/CD action triggers, and assist in monitoring cluster health with telemetry dashboards.",
    deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
    status: "Active",
    type: "Internship",
    applicantsCount: 16,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: "int-203",
    _id: "int-203",
    title: "Data Science & Applied ML Intern",
    company: "Apex Global Technologies",
    duration: "10 Weeks",
    stipend: "$4,000 / month",
    location: "Remote",
    workMode: "Remote",
    requiredSkills: ["Python", "SQL", "Machine Learning", "Pandas"],
    preferredSkills: ["Scikit-Learn", "FastAPI", "Data Visualization"],
    eligibility: "Candidates with coursework in linear algebra, statistics, and machine learning",
    description: "Clean enterprise telemetry data, benchmark predictive classifiers, and create interactive data reporting notebooks for product stakeholders.",
    deadline: new Date(Date.now() + 28 * 86400000).toISOString(),
    status: "Active",
    type: "Internship",
    applicantsCount: 19,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  }
];

// Pre-seeded Industry Live Projects
const INITIAL_PROJECTS = [
  {
    id: "proj-301",
    _id: "proj-301",
    title: "Cloud Telemetry & Microservices Logging Pipeline",
    requiredSkills: ["TypeScript", "Node.js", "Docker", "PostgreSQL"],
    description: "Build an asynchronous OpenTelemetry log aggregator that validates structured JSON events, sanitizes sensitive tokens, and outputs indexed metrics into a queryable store.",
    duration: "8 Weeks",
    teamSize: "3-4 Students",
    eligibility: "Pre-final or final year CS/IT students",
    expectedOutcome: "Production-ready open-source GitHub repository with automated Docker compose orchestration and API documentation.",
    status: "Active",
    type: "Project",
    applicantsCount: 5,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: "proj-302",
    _id: "proj-302",
    title: "AI Resume Competency Matcher & Scoring Service",
    requiredSkills: ["Python", "Machine Learning", "FastAPI", "Docker"],
    description: "Develop a specialized NLP microservice that extracts skills and certifications from PDFs and computes semantic alignment with industry job specifications.",
    duration: "6 Weeks",
    teamSize: "2-3 Students",
    eligibility: "Students familiar with Python, NLP tokenization, and REST APIs",
    expectedOutcome: "Deployed benchmark service container with test suite and swagger documentation.",
    status: "Active",
    type: "Project",
    applicantsCount: 7,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: "proj-303",
    _id: "proj-303",
    title: "Accessible Web Component Design System",
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Web Accessibility"],
    description: "Design and implement 15 accessible component primitives meeting WCAG 2.1 AA criteria, complete with keyboard navigation and automated axe-core test coverage.",
    duration: "8 Weeks",
    teamSize: "3 Students",
    eligibility: "Frontend enthusiasts with strong React fundamentals",
    expectedOutcome: "Packaged npm component library with Storybook documentation and interactive sandbox.",
    status: "Active",
    type: "Project",
    applicantsCount: 4,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

// Pre-seeded Applications in Recruitment Pipeline
const INITIAL_APPLICATIONS = [
  {
    id: "app-401",
    _id: "app-401",
    candidateId: "usr-candidate-006",
    candidateName: "Sophia Lin",
    candidateEmail: "sophia.lin@example.com",
    candidateHeadline: "Mobile & Cross-Platform Application Engineer",
    candidateLocation: "Chicago, IL",
    candidateEducation: "B.Tech in Computer Engineering",
    opportunityId: "int-201",
    opportunityTitle: "Full-Stack Software Engineering Intern (Summer 2026)",
    opportunityType: "Internship",
    organization: "Apex Global Technologies",
    stage: "Applied",
    status: "Applied",
    matchScore: 82,
    matchedSkills: ["TypeScript", "React", "Git"],
    missingSkills: ["Node.js"],
    appliedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    notes: "Applied via candidate portal. Strong cross-platform mobile foundation."
  },
  {
    id: "app-402",
    _id: "app-402",
    candidateId: "usr-candidate-002",
    candidateName: "Priya Sharma",
    candidateEmail: "priya.sharma@example.com",
    candidateHeadline: "Backend Systems & Distributed Data Engineer",
    candidateLocation: "Bengaluru / Remote",
    candidateEducation: "B.Tech in Information Technology",
    opportunityId: "job-101",
    opportunityTitle: "Junior Cloud Applications Engineer",
    opportunityType: "Job",
    organization: "Apex Global Technologies",
    stage: "Applied",
    status: "Applied",
    matchScore: 85,
    matchedSkills: ["Node.js", "PostgreSQL", "Cloud Infrastructure"],
    missingSkills: ["React", "TypeScript"],
    appliedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    notes: "Excellent backend metrics and Kafka experience."
  },
  {
    id: "app-403",
    _id: "app-403",
    candidateId: "usr-candidate-005",
    candidateName: "Dev Patel",
    candidateEmail: "dev.patel@example.com",
    candidateHeadline: "DevOps & Cloud Site Reliability Specialist",
    candidateLocation: "Austin, TX",
    candidateEducation: "B.S. in Cloud Computing & DevOps",
    opportunityId: "int-202",
    opportunityTitle: "Cloud Infrastructure & DevOps Intern",
    opportunityType: "Internship",
    organization: "Apex Global Technologies",
    stage: "Reviewed",
    status: "Under Review",
    matchScore: 92,
    matchedSkills: ["AWS", "Docker", "Linux", "CI/CD Pipelines"],
    missingSkills: [],
    appliedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    notes: "Resume passed automated parsing. Verified CKAD certification."
  },
  {
    id: "app-404",
    _id: "app-404",
    candidateId: "usr-4091",
    candidateName: "Alex Rivers",
    candidateEmail: "alex.rivers@example.com",
    candidateHeadline: "Full-Stack Software Engineer & Cloud Systems Architect",
    candidateLocation: "San Francisco Bay Area, CA",
    candidateEducation: "B.S. in Computer Science & Systems Engineering",
    opportunityId: "job-101",
    opportunityTitle: "Junior Cloud Applications Engineer",
    opportunityType: "Job",
    organization: "Apex Global Technologies",
    stage: "Shortlisted",
    status: "Shortlisted",
    matchScore: 94,
    matchedSkills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Cloud Infrastructure"],
    missingSkills: [],
    appliedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    notes: "Candidate profile and skill assessment scores are among top 5%."
  },
  {
    id: "app-405",
    _id: "app-405",
    candidateId: "usr-candidate-003",
    candidateName: "Marcus Vance",
    candidateEmail: "marcus.vance@example.com",
    candidateHeadline: "Frontend Specialist & Design Systems Architect",
    candidateLocation: "Seattle, WA",
    candidateEducation: "B.S. in Software Engineering",
    opportunityId: "job-103",
    opportunityTitle: "Frontend UI Specialist & Design Systems",
    opportunityType: "Job",
    organization: "Apex Global Technologies",
    stage: "Shortlisted",
    status: "Shortlisted",
    matchScore: 96,
    matchedSkills: ["React", "TypeScript", "Tailwind CSS", "Web Accessibility", "Figma"],
    missingSkills: [],
    appliedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    notes: "Outstanding design system portfolio and 94% WCAG assessment score."
  },
  {
    id: "app-406",
    _id: "app-406",
    candidateId: "usr-candidate-004",
    candidateName: "Ananya Singh",
    candidateEmail: "ananya.singh@example.com",
    candidateHeadline: "AI / ML Engineer & Applied Data Scientist",
    candidateLocation: "New York, NY",
    candidateEducation: "M.S. in Data Science & Machine Learning",
    opportunityId: "job-104",
    opportunityTitle: "AI / ML Solutions Engineer",
    opportunityType: "Job",
    organization: "Apex Global Technologies",
    stage: "Interview",
    status: "Interview",
    matchScore: 95,
    matchedSkills: ["Python", "Machine Learning", "TensorFlow", "SQL", "AWS"],
    missingSkills: [],
    appliedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    interviewDetails: {
      scheduledAt: new Date(Date.now() + 2 * 86400000).toISOString(),
      time: "10:30 AM EST",
      mode: "Google Meet",
      interviewer: "Dr. Elena Rostova (Staff AI Scientist)",
      meetingLink: "https://meet.google.com/skm-rec-call",
      notes: "Focus on vector retrieval pipelines, embedding fine-tuning, and model latency."
    },
    notes: "Technical Screen Round confirmed."
  },
  {
    id: "app-407",
    _id: "app-407",
    candidateId: "usr-4091",
    candidateName: "Alex Rivers",
    candidateEmail: "alex.rivers@example.com",
    candidateHeadline: "Full-Stack Software Engineer & Cloud Systems Architect",
    candidateLocation: "San Francisco Bay Area, CA",
    candidateEducation: "B.S. in Computer Science & Systems Engineering",
    opportunityId: "int-201",
    opportunityTitle: "Full-Stack Software Engineering Intern (Summer 2026)",
    opportunityType: "Internship",
    organization: "Apex Global Technologies",
    stage: "Selected",
    status: "Selected",
    matchScore: 98,
    matchedSkills: ["TypeScript", "React", "Node.js", "Git"],
    missingSkills: [],
    appliedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    offerDetails: {
      type: "Internship",
      compensation: "$4,500 / month",
      startDate: new Date(Date.now() + 45 * 86400000).toISOString(),
      status: "Offered",
      notes: "Summer engineering cohort offer sent. Pending candidate formal signature."
    },
    notes: "Candidate performed exceptionally in system design discussion."
  },
  {
    id: "app-408",
    _id: "app-408",
    candidateId: "usr-candidate-005",
    candidateName: "Dev Patel",
    candidateEmail: "dev.patel@example.com",
    candidateHeadline: "DevOps & Cloud Site Reliability Specialist",
    candidateLocation: "Austin, TX",
    candidateEducation: "B.S. in Cloud Computing & DevOps",
    opportunityId: "int-202",
    opportunityTitle: "Cloud Infrastructure & DevOps Intern",
    opportunityType: "Internship",
    organization: "Apex Global Technologies",
    stage: "Hired",
    status: "Selected",
    matchScore: 92,
    matchedSkills: ["AWS", "Docker", "Linux", "CI/CD Pipelines"],
    missingSkills: [],
    appliedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    offerDetails: {
      type: "Internship",
      compensation: "$4,200 / month",
      startDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: "Accepted",
      notes: "Onboarding materials delivered. Assigned to Cloud Platforms team."
    },
    notes: "Offer accepted. Background and academic verifications cleared."
  }
];

// Pre-seeded Academia Collaborations
const INITIAL_COLLABORATIONS = [
  {
    id: "collab-501",
    _id: "collab-501",
    title: "Industry Mentorship Circle · Cloud & Microservices Architecture",
    type: "Mentorship",
    organization: "Apex Global Technologies",
    partnerInstitution: "All Partner Engineering Colleges",
    audience: "Student",
    seats: 45,
    skills: ["Cloud Architecture", "Docker", "TypeScript", "System Design"],
    description: "Pair staff engineers with cohorts of 3-4 students for 8 weeks of bi-weekly system architecture reviews and mock technical interviews.",
    startDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    contactEmail: "partnerships@apextechnologies.io",
    isActive: true,
    status: "Active",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: "collab-502",
    _id: "collab-502",
    title: "Applied AI & LLM Systems Hands-on Masterclass",
    type: "Workshop",
    organization: "Apex Global Technologies",
    partnerInstitution: "State University Engineering Consortium",
    audience: "Student",
    seats: 120,
    skills: ["Python", "Machine Learning", "LLMs", "FastAPI"],
    description: "Interactive 3-day weekend workshop on building grounded retrieval agents, fine-tuning lightweight models, and deploying low-latency endpoints.",
    startDate: new Date(Date.now() + 21 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 12 * 86400000).toISOString(),
    contactEmail: "workshops@apextechnologies.io",
    isActive: true,
    status: "Active",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: "collab-503",
    _id: "collab-503",
    title: "Summer Faculty Industrial Immersion Program",
    type: "Faculty Internship",
    organization: "Apex Global Technologies",
    partnerInstitution: "Regional Technical Universities",
    audience: "Academician",
    seats: 15,
    skills: ["Cloud Platforms", "CI/CD", "Enterprise Architectures"],
    description: "4-week paid faculty residency providing computer science professors hands-on immersion in production CI/CD workflows and distributed cloud scaling.",
    startDate: new Date(Date.now() + 45 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 25 * 86400000).toISOString(),
    contactEmail: "faculty-relations@apextechnologies.io",
    isActive: true,
    status: "Active",
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    id: "collab-504",
    _id: "collab-504",
    title: "NextGen Cloud Resilience Hackathon & Innovation Challenge",
    type: "Innovation Challenge",
    organization: "Apex Global Technologies",
    partnerInstitution: "All Institutions",
    audience: "All",
    seats: 250,
    skills: ["React", "Node.js", "AWS", "Chaos Engineering"],
    description: "48-hour inter-college challenge to design fault-tolerant web applications surviving synthetic network partitions and database failovers.",
    startDate: new Date(Date.now() + 35 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
    contactEmail: "hackathons@apextechnologies.io",
    isActive: true,
    status: "Active",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  }
];

// Pre-seeded Notifications for Recruiter
const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-01",
    title: "New Candidate Application",
    message: "Sophia Lin submitted an application for Full-Stack Software Engineering Intern (Summer 2026). Match score: 82%.",
    type: "application",
    read: false,
    timestamp: new Date(Date.now() - 45 * 60000).toISOString()
  },
  {
    id: "notif-02",
    title: "Interview Scheduled Confirmed",
    message: "Technical Screen with Ananya Singh for AI / ML Solutions Engineer is confirmed for 10:30 AM EST via Google Meet.",
    type: "interview",
    read: false,
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString()
  },
  {
    id: "notif-03",
    title: "High Competency Match Alert",
    message: "Alex Rivers scored 94% on Cloud Applications Engineer benchmark with 3 verified skill assessments.",
    type: "match",
    read: true,
    timestamp: new Date(Date.now() - 12 * 3600000).toISOString()
  },
  {
    id: "notif-04",
    title: "Internship Offer Accepted",
    message: "Dev Patel accepted your internship offer for Cloud Infrastructure & DevOps Intern ($4,200/mo).",
    type: "offer",
    read: true,
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: "notif-05",
    title: "Academia Collaboration Update",
    message: "State University Engineering Consortium registered 28 students for the Cloud Mentorship Circle.",
    type: "collaboration",
    read: true,
    timestamp: new Date(Date.now() - 48 * 3600000).toISOString()
  }
];

// In-Memory state instances
let inMemoryJobs = [...INITIAL_JOBS];
let inMemoryInternships = [...INITIAL_INTERNSHIPS];
let inMemoryProjects = [...INITIAL_PROJECTS];
let inMemoryApplications = [...INITIAL_APPLICATIONS];
let inMemoryCollaborations = [...INITIAL_COLLABORATIONS];
let inMemoryNotifications = [...INITIAL_NOTIFICATIONS];
let inMemoryProfile = {
  companyName: "Apex Global Technologies",
  industry: "Cloud & Enterprise Software",
  website: "https://apextechnologies.io",
  companySize: "250-500 Employees",
  headquarters: "San Francisco, CA & Remote",
  bio: "Apex Global Technologies builds mission-critical developer platforms, distributed cloud microservices, and high-performance data systems. We partner with universities to discover and mentor exceptional engineering talent.",
  culture: "Autonomous engineering teams, continuous learning stipend, asynchronous-first communication, and high-trust leadership.",
  recruiterName: "Sarah Jenkins",
  recruiterTitle: "Senior Technical Talent Acquisition Lead",
  contactEmail: "recruiter@skillmap.demo",
  contactPhone: "+1 (555) 438-9201",
  hiringLocations: ["San Francisco, CA", "Austin, TX", "Seattle, WA", "New York, NY", "Remote"],
  preferredWorkModes: ["Hybrid", "Remote", "On-site"]
};

// Skill Demand Analytics dataset dynamically computed + market calibration
function computeSkillDemand() {
  const allPostings = [...inMemoryJobs, ...inMemoryInternships, ...inMemoryProjects];
  const skillCounts = {};
  let totalRequirements = 0;

  allPostings.forEach((p) => {
    const list = [...(p.requiredSkills || []), ...(p.preferredSkills || [])];
    list.forEach((s) => {
      const clean = s.trim();
      skillCounts[clean] = (skillCounts[clean] || 0) + 1;
      totalRequirements++;
    });
  });

  // Base market benchmarks to guarantee rich baseline
  const BASE_MARKET = [
    { name: "TypeScript", category: "Frontend / Full Stack", baseScore: 84, trend: "+14% YoY", velocity: "Very High Demand" },
    { name: "React", category: "Frontend / UI", baseScore: 88, trend: "+11% YoY", velocity: "Industry Standard" },
    { name: "Node.js", category: "Backend / Microservices", baseScore: 82, trend: "+9% YoY", velocity: "Very High Demand" },
    { name: "PostgreSQL", category: "Database & Modeling", baseScore: 78, trend: "+16% YoY", velocity: "Rapidly Growing" },
    { name: "Python", category: "AI / Data / Backend", baseScore: 86, trend: "+22% YoY", velocity: "Surging Demand" },
    { name: "Docker", category: "Cloud & DevOps", baseScore: 79, trend: "+12% YoY", velocity: "Essential Skill" },
    { name: "AWS", category: "Cloud Infrastructure", baseScore: 83, trend: "+15% YoY", velocity: "Core Required" },
    { name: "Tailwind CSS", category: "Frontend / UI", baseScore: 74, trend: "+18% YoY", velocity: "Rapidly Growing" },
    { name: "Machine Learning", category: "AI & Data Science", baseScore: 81, trend: "+28% YoY", velocity: "High Growth" },
    { name: "Kubernetes", category: "Cloud & DevOps", baseScore: 72, trend: "+10% YoY", velocity: "High Demand" },
    { name: "Git & Version Control", category: "Software Engineering", baseScore: 92, trend: "Stable", velocity: "Baseline Prerequisite" },
    { name: "Agile & Collaboration", category: "Soft Skills", baseScore: 89, trend: "+8% YoY", velocity: "Universally Valued" }
  ];

  return BASE_MARKET.map((item) => {
    const foundCount = Object.entries(skillCounts).find(([k]) =>
      k.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(k.toLowerCase())
    );
    const dynamicBoost = foundCount ? Math.min(foundCount[1] * 3, 10) : 0;
    const computedPercentage = Math.min(98, Math.max(50, item.baseScore + dynamicBoost));
    const openRoleCount = allPostings.filter((p) =>
      [...(p.requiredSkills || []), ...(p.preferredSkills || [])].some((s) =>
        s.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(s.toLowerCase())
      )
    ).length || Math.floor(computedPercentage / 12);

    return {
      name: item.name,
      category: item.category,
      demandPercentage: computedPercentage,
      openRoleCount,
      trend: item.trend,
      velocity: item.velocity
    };
  }).sort((a, b) => b.demandPercentage - a.demandPercentage);
}

// Matching computation engine
export function calculateMatchScore(candidate, requirements = {}) {
  const reqTech = (requirements.requiredSkills || []).map((s) => s.trim());
  const reqSoft = (requirements.softSkills || []).map((s) => s.trim());
  const reqPreferred = (requirements.preferredSkills || []).map((s) => s.trim());

  // Aggregate all candidate competencies
  const candidateSkills = [
    ...(candidate.skills || []).map((s) => s.name),
    ...(candidate.resumeExtractedSkills || []),
    ...(candidate.assessments || []).map((a) => a.skill),
    ...(candidate.projects || []).flatMap((p) => p.technologies || []),
    ...(candidate.certifications || []).map((c) => c.name)
  ].map((s) => s.toLowerCase());

  const isMatched = (skillName) => {
    const low = skillName.toLowerCase();
    return candidateSkills.some((c) => c.includes(low) || low.includes(c));
  };

  const matchedTech = reqTech.filter((s) => isMatched(s));
  const missingTech = reqTech.filter((s) => !isMatched(s));

  const matchedSoft = reqSoft.filter((s) => isMatched(s));
  const missingSoft = reqSoft.filter((s) => !isMatched(s));

  const matchedPreferred = reqPreferred.filter((s) => isMatched(s));

  const totalReq = reqTech.length + reqSoft.length;
  const totalMatched = matchedTech.length + matchedSoft.length;

  let skillMatchPct = totalReq > 0 ? Math.round((totalMatched / totalReq) * 100) : 85;

  // Bonus for preferred skills and verified assessments
  const verifiedCount = (candidate.assessments || []).filter((a) => a.status === "Verified").length;
  const preferredBonus = Math.min(matchedPreferred.length * 3, 10);
  const assessmentBonus = Math.min(verifiedCount * 2, 8);

  const finalScore = Math.min(100, Math.max(25, skillMatchPct + preferredBonus + assessmentBonus));

  let matchTier = "Moderate Fit";
  if (finalScore >= 90) matchTier = "Exceptional Match";
  else if (finalScore >= 80) matchTier = "Strong Match";
  else if (finalScore >= 70) matchTier = "Promising Candidate";

  return {
    candidateId: candidate.id || candidate._id,
    candidateName: candidate.name,
    candidateEmail: candidate.email,
    matchScore: finalScore,
    skillMatchPercentage: skillMatchPct,
    matchTier,
    matchedSkills: matchedTech,
    missingSkills: missingTech,
    matchedSoftSkills: matchedSoft,
    missingSoftSkills: missingSoft,
    matchedPreferredSkills: matchedPreferred,
    verifiedAssessmentsCount: verifiedCount,
    hasResume: !!candidate.resumeAvailable,
    readinessScore: candidate.readinessScore || 80,
    education: candidate.education,
    location: candidate.location,
    explanation: `${candidate.name} matches ${matchedTech.length} of ${reqTech.length} required technical skills (${matchedTech.join(", ") || "None"}). ${missingTech.length > 0 ? `Missing: ${missingTech.join(", ")}.` : "All core required technical competencies satisfied."}`
  };
}

export const recruiterDataService = {
  // Overview metrics
  async getOverviewStats() {
    let jobs = inMemoryJobs;
    let internships = inMemoryInternships;
    let applications = inMemoryApplications;

    if (dataStore.isMongoConnected()) {
      try {
        const dbJobs = await Opportunity.find({ type: "Job" }).lean();
        const dbInternships = await Opportunity.find({ type: "Internship" }).lean();
        const dbApps = await Application.find().lean();
        if (dbJobs?.length) jobs = dbJobs;
        if (dbInternships?.length) internships = dbInternships;
        if (dbApps?.length) applications = dbApps;
      } catch (e) {
        console.warn("DB overview fallback:", e.message);
      }
    }

    const activeJobs = jobs.filter((j) => (j.status || "Active").toLowerCase() === "active").length;
    const activeInternships = internships.filter((i) => (i.status || "Active").toLowerCase() === "active").length;
    const totalApplications = applications.length;

    const shortlistedCount = applications.filter((a) => (a.stage || a.status || "").toLowerCase().includes("shortlist")).length;
    const interviewCount = applications.filter((a) => (a.stage || a.status || "").toLowerCase().includes("interview")).length;
    const selectedCount = applications.filter((a) => (a.stage || a.status || "").toLowerCase().includes("selected")).length;
    const hiredCount = applications.filter((a) => (a.stage || a.status || "").toLowerCase().includes("hired")).length;
    const reviewedCount = applications.filter((a) => (a.stage || a.status || "").toLowerCase().includes("review")).length;
    const appliedCount = applications.filter((a) => (a.stage || a.status || "").toLowerCase() === "applied").length;

    const pipeline = {
      applied: appliedCount,
      reviewed: reviewedCount,
      shortlisted: shortlistedCount,
      interview: interviewCount,
      selected: selectedCount,
      hired: hiredCount
    };

    return {
      activeJobs,
      activeInternships,
      applicationsReceived: totalApplications,
      candidatesShortlisted: shortlistedCount,
      candidatesHired: hiredCount,
      interviewsScheduled: interviewCount,
      pipeline,
      recentApplications: applications.slice(0, 5)
    };
  },

  // Jobs
  async getJobs(filters = {}) {
    let list = inMemoryJobs;
    if (dataStore.isMongoConnected()) {
      try {
        const db = await Opportunity.find({ type: "Job" }).lean();
        if (db?.length) list = db.map((x) => ({ ...x, id: x._id.toString() }));
      } catch (e) {
        console.warn("getJobs DB fallback:", e.message);
      }
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((j) =>
        j.title.toLowerCase().includes(q) ||
        (j.location || "").toLowerCase().includes(q) ||
        (j.requiredSkills || []).some((s) => s.toLowerCase().includes(q))
      );
    }
    if (filters.workMode && filters.workMode !== "All") {
      list = list.filter((j) => (j.workMode || "").toLowerCase() === filters.workMode.toLowerCase());
    }
    if (filters.status && filters.status !== "All") {
      list = list.filter((j) => (j.status || "Active").toLowerCase() === filters.status.toLowerCase());
    }

    return list;
  },

  async createJob(data, userId) {
    const newJob = {
      id: `job-${Date.now()}`,
      _id: `job-${Date.now()}`,
      type: "Job",
      title: data.title,
      company: data.company || inMemoryProfile.companyName,
      location: data.location || "Hybrid",
      workMode: data.workMode || "Hybrid",
      employmentType: data.employmentType || "Full-time",
      salary: data.salary || "Competitive",
      experienceLevel: data.experienceLevel || "Entry Level (0-2 yrs)",
      education: data.education || "B.S. in Computer Science or related STEM field",
      requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills : (data.requiredSkills || "").split(",").map((s) => s.trim()).filter(Boolean),
      softSkills: Array.isArray(data.softSkills) ? data.softSkills : (data.softSkills || "").split(",").map((s) => s.trim()).filter(Boolean),
      preferredSkills: Array.isArray(data.preferredSkills) ? data.preferredSkills : (data.preferredSkills || "").split(",").map((s) => s.trim()).filter(Boolean),
      description: data.description || "",
      deadline: data.deadline || new Date(Date.now() + 30 * 86400000).toISOString(),
      status: data.status || "Active",
      applicantsCount: 0,
      createdBy: userId,
      createdAt: new Date().toISOString()
    };

    if (dataStore.isMongoConnected()) {
      try {
        const created = await Opportunity.create({ ...newJob, _id: undefined });
        newJob._id = created._id.toString();
        newJob.id = created._id.toString();
      } catch (e) {
        console.warn("createJob DB fallback:", e.message);
      }
    }

    inMemoryJobs.unshift(newJob);
    return newJob;
  },

  async updateJob(id, updates) {
    if (dataStore.isMongoConnected()) {
      try {
        await Opportunity.findByIdAndUpdate(id, { $set: updates });
      } catch (e) {
        console.warn("updateJob DB fallback:", e.message);
      }
    }
    const idx = inMemoryJobs.findIndex((j) => j.id === id || j._id === id);
    if (idx !== -1) {
      inMemoryJobs[idx] = { ...inMemoryJobs[idx], ...updates, updatedAt: new Date().toISOString() };
      return inMemoryJobs[idx];
    }
    return null;
  },

  async deleteJob(id) {
    if (dataStore.isMongoConnected()) {
      try {
        await Opportunity.findByIdAndDelete(id);
      } catch (e) {
        console.warn("deleteJob DB fallback:", e.message);
      }
    }
    inMemoryJobs = inMemoryJobs.filter((j) => j.id !== id && j._id !== id);
    return true;
  },

  // Internships
  async getInternships(filters = {}) {
    let list = inMemoryInternships;
    if (dataStore.isMongoConnected()) {
      try {
        const db = await Opportunity.find({ type: "Internship" }).lean();
        if (db?.length) list = db.map((x) => ({ ...x, id: x._id.toString() }));
      } catch (e) {
        console.warn("getInternships DB fallback:", e.message);
      }
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((i) =>
        i.title.toLowerCase().includes(q) ||
        (i.location || "").toLowerCase().includes(q) ||
        (i.requiredSkills || []).some((s) => s.toLowerCase().includes(q))
      );
    }
    if (filters.workMode && filters.workMode !== "All") {
      list = list.filter((i) => (i.workMode || "").toLowerCase() === filters.workMode.toLowerCase());
    }

    return list;
  },

  async createInternship(data, userId) {
    const newInt = {
      id: `int-${Date.now()}`,
      _id: `int-${Date.now()}`,
      type: "Internship",
      title: data.title,
      company: data.company || inMemoryProfile.companyName,
      duration: data.duration || "12 Weeks",
      stipend: data.stipend || "Competitive Monthly Stipend",
      location: data.location || "Remote",
      workMode: data.workMode || "Remote",
      requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills : (data.requiredSkills || "").split(",").map((s) => s.trim()).filter(Boolean),
      preferredSkills: Array.isArray(data.preferredSkills) ? data.preferredSkills : (data.preferredSkills || "").split(",").map((s) => s.trim()).filter(Boolean),
      eligibility: data.eligibility || "Enrolled students in STEM or related programs",
      description: data.description || "",
      deadline: data.deadline || new Date(Date.now() + 30 * 86400000).toISOString(),
      status: data.status || "Active",
      applicantsCount: 0,
      createdBy: userId,
      createdAt: new Date().toISOString()
    };

    if (dataStore.isMongoConnected()) {
      try {
        const created = await Opportunity.create({ ...newInt, _id: undefined });
        newInt._id = created._id.toString();
        newInt.id = created._id.toString();
      } catch (e) {
        console.warn("createInternship DB fallback:", e.message);
      }
    }

    inMemoryInternships.unshift(newInt);
    return newInt;
  },

  async updateInternship(id, updates) {
    if (dataStore.isMongoConnected()) {
      try {
        await Opportunity.findByIdAndUpdate(id, { $set: updates });
      } catch (e) {
        console.warn("updateInternship DB fallback:", e.message);
      }
    }
    const idx = inMemoryInternships.findIndex((i) => i.id === id || i._id === id);
    if (idx !== -1) {
      inMemoryInternships[idx] = { ...inMemoryInternships[idx], ...updates, updatedAt: new Date().toISOString() };
      return inMemoryInternships[idx];
    }
    return null;
  },

  async deleteInternship(id) {
    if (dataStore.isMongoConnected()) {
      try {
        await Opportunity.findByIdAndDelete(id);
      } catch (e) {
        console.warn("deleteInternship DB fallback:", e.message);
      }
    }
    inMemoryInternships = inMemoryInternships.filter((i) => i.id !== id && i._id !== id);
    return true;
  },

  // Projects
  async getProjects(filters = {}) {
    let list = inMemoryProjects;
    if (dataStore.isMongoConnected()) {
      try {
        const db = await Opportunity.find({ type: "Project" }).lean();
        if (db?.length) list = db.map((x) => ({ ...x, id: x._id.toString() }));
      } catch (e) {
        console.warn("getProjects DB fallback:", e.message);
      }
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        (p.requiredSkills || []).some((s) => s.toLowerCase().includes(q))
      );
    }

    return list;
  },

  async createProject(data, userId) {
    const newProj = {
      id: `proj-${Date.now()}`,
      _id: `proj-${Date.now()}`,
      type: "Project",
      title: data.title,
      requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills : (data.requiredSkills || "").split(",").map((s) => s.trim()).filter(Boolean),
      description: data.description || "",
      duration: data.duration || "8 Weeks",
      teamSize: data.teamSize || "3-4 Students",
      eligibility: data.eligibility || "Open to all enrolled engineering students",
      expectedOutcome: data.expectedOutcome || "Deliverable project repository with documentation",
      status: data.status || "Active",
      applicantsCount: 0,
      createdBy: userId,
      createdAt: new Date().toISOString()
    };

    if (dataStore.isMongoConnected()) {
      try {
        const created = await Opportunity.create({ ...newProj, _id: undefined });
        newProj._id = created._id.toString();
        newProj.id = created._id.toString();
      } catch (e) {
        console.warn("createProject DB fallback:", e.message);
      }
    }

    inMemoryProjects.unshift(newProj);
    return newProj;
  },

  async updateProject(id, updates) {
    if (dataStore.isMongoConnected()) {
      try {
        await Opportunity.findByIdAndUpdate(id, { $set: updates });
      } catch (e) {
        console.warn("updateProject DB fallback:", e.message);
      }
    }
    const idx = inMemoryProjects.findIndex((p) => p.id === id || p._id === id);
    if (idx !== -1) {
      inMemoryProjects[idx] = { ...inMemoryProjects[idx], ...updates, updatedAt: new Date().toISOString() };
      return inMemoryProjects[idx];
    }
    return null;
  },

  async deleteProject(id) {
    if (dataStore.isMongoConnected()) {
      try {
        await Opportunity.findByIdAndDelete(id);
      } catch (e) {
        console.warn("deleteProject DB fallback:", e.message);
      }
    }
    inMemoryProjects = inMemoryProjects.filter((p) => p.id !== id && p._id !== id);
    return true;
  },

  // Candidates & Search
  async getCandidates(filters = {}) {
    let list = [...CANDIDATE_POOL];

    // Merge registered & database student users
    try {
      const realUsers = await dataStore.getStudentUsers();
      if (realUsers?.length) {
        const dbMapped = realUsers.map((u) => ({
          id: (u._id || u.id).toString(),
          _id: (u._id || u.id).toString(),
          name: u.name,
          email: u.email,
          phone: u.phone || "",
          targetRole: u.targetRole || "Software Engineer",
          headline: u.headline || `${u.targetRole || "Software"} Engineer`,
          bio: u.bio || "",
          education: u.education || "Bachelor of Science",
          institution: u.institution || "University Institute of Technology",
          graduationYear: u.graduationYear || "2026",
          experienceLevel: u.experienceLevel || "Entry Level",
          location: u.location || "San Francisco Bay Area, CA",
          readinessScore: u.readinessScore || 80,
          resumeAvailable: true,
          skills: (u.skills || []).map((s) => typeof s === "string" ? { name: s, level: "Intermediate", score: 75 } : s),
          resumeExtractedSkills: (u.skills || []).map((s) => typeof s === "string" ? s : s.name),
          assessments: [],
          projects: u.projects || [],
          certifications: u.certifications || [],
          internships: u.internships || []
        }));
        // Merge unique by email, placing real registered candidates first
        const existingEmails = new Set();
        const merged = [];
        for (const realCand of dbMapped) {
          existingEmails.add(realCand.email.toLowerCase());
          merged.push(realCand);
        }
        for (const poolCand of list) {
          if (!existingEmails.has(poolCand.email.toLowerCase())) {
            existingEmails.add(poolCand.email.toLowerCase());
            merged.push(poolCand);
          }
        }
        list = merged;
      }
    } catch (e) {
      console.warn("getCandidates studentUsers error:", e.message);
    }

    // Filter by search query
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.targetRole || "").toLowerCase().includes(q) ||
        (c.headline || "").toLowerCase().includes(q) ||
        (c.skills || []).some((s) => s.name.toLowerCase().includes(q)) ||
        (c.resumeExtractedSkills || []).some((s) => s.toLowerCase().includes(q))
      );
    }

    // Filter by skills
    if (filters.skills) {
      const targetSkills = (typeof filters.skills === "string" ? filters.skills.split(",") : filters.skills)
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      if (targetSkills.length > 0) {
        list = list.filter((c) => {
          const candidateSkillPool = [
            ...(c.skills || []).map((s) => s.name.toLowerCase()),
            ...(c.resumeExtractedSkills || []).map((s) => s.toLowerCase()),
            ...(c.projects || []).flatMap((p) => (p.technologies || []).map((t) => t.toLowerCase()))
          ];
          return targetSkills.some((ts) => candidateSkillPool.some((cs) => cs.includes(ts) || ts.includes(cs)));
        });
      }
    }

    // Filter by education
    if (filters.education && filters.education !== "All") {
      const ed = filters.education.toLowerCase();
      list = list.filter((c) => (c.education || "").toLowerCase().includes(ed));
    }

    // Filter by experience level
    if (filters.experience && filters.experience !== "All") {
      const exp = filters.experience.toLowerCase();
      list = list.filter((c) => (c.experienceLevel || "").toLowerCase().includes(exp));
    }

    // Filter by minimum readiness score
    if (filters.minScore) {
      const min = parseInt(filters.minScore, 10);
      if (!isNaN(min)) {
        list = list.filter((c) => (c.readinessScore || 0) >= min);
      }
    }

    // Filter by certifications
    if (filters.hasCertification === "true" || filters.hasCertification === true) {
      list = list.filter((c) => (c.certifications || []).length > 0);
    }

    // Filter by internships
    if (filters.hasInternship === "true" || filters.hasInternship === true) {
      list = list.filter((c) => (c.internships || []).length > 0);
    }

    return list;
  },

  // AI Matching against requirements or specific job
  async matchCandidates(requirements = {}) {
    const candidates = await this.getCandidates();
    const results = candidates.map((candidate) => calculateMatchScore(candidate, requirements));
    return results.sort((a, b) => b.matchScore - a.matchScore);
  },

  // Applications & Recruitment Pipeline
  async getApplications(filters = {}) {
    let list = inMemoryApplications;
    if (dataStore.isMongoConnected()) {
      try {
        const db = await Application.find().sort({ createdAt: -1 }).lean();
        if (db?.length) list = db.map((x) => ({ ...x, id: x._id.toString() }));
      } catch (e) {
        console.warn("getApplications DB fallback:", e.message);
      }
    }

    if (filters.stage && filters.stage !== "All") {
      list = list.filter((a) => (a.stage || a.status || "").toLowerCase() === filters.stage.toLowerCase());
    }

    if (filters.opportunityId) {
      list = list.filter((a) => a.opportunityId === filters.opportunityId);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((a) =>
        (a.candidateName || "").toLowerCase().includes(q) ||
        (a.opportunityTitle || "").toLowerCase().includes(q)
      );
    }

    return list;
  },

  async updateApplicationStage(id, stage, notes = "") {
    if (dataStore.isMongoConnected()) {
      try {
        await Application.findByIdAndUpdate(id, { $set: { stage, status: stage, notes } });
      } catch (e) {
        console.warn("updateApplicationStage DB fallback:", e.message);
      }
    }
    const idx = inMemoryApplications.findIndex((a) => a.id === id || a._id === id);
    if (idx !== -1) {
      inMemoryApplications[idx] = {
        ...inMemoryApplications[idx],
        stage,
        status: stage,
        notes: notes || inMemoryApplications[idx].notes,
        updatedAt: new Date().toISOString()
      };
      return inMemoryApplications[idx];
    }
    return null;
  },

  async scheduleInterview(data, recruiterId) {
    const newInterview = {
      id: `intv-${Date.now()}`,
      _id: `intv-${Date.now()}`,
      candidateId: data.candidateId,
      candidateName: data.candidateName,
      candidateEmail: data.candidateEmail || "",
      opportunityId: data.opportunityId,
      opportunityTitle: data.opportunityTitle,
      scheduledDate: data.date,
      scheduledTime: data.time,
      mode: data.mode || "Google Meet",
      interviewer: data.interviewer || inMemoryProfile.recruiterName,
      meetingLink: data.meetingLink || "https://meet.google.com/skm-rec-call",
      status: "Scheduled",
      notes: data.notes || "",
      round: data.round || "Technical Screen",
      recruiterId,
      createdAt: new Date().toISOString()
    };

    if (dataStore.isMongoConnected()) {
      try {
        await Interview.create({ ...newInterview, _id: undefined });
      } catch (e) {
        console.warn("scheduleInterview DB fallback:", e.message);
      }
    }

    // Update application stage to "Interview"
    const app = inMemoryApplications.find(
      (a) => a.candidateId === data.candidateId && a.opportunityId === data.opportunityId
    );
    if (app) {
      app.stage = "Interview";
      app.status = "Interview";
      app.interviewDetails = {
        scheduledAt: data.date,
        time: data.time,
        mode: data.mode || "Google Meet",
        interviewer: newInterview.interviewer,
        meetingLink: newInterview.meetingLink,
        notes: data.notes || ""
      };
    }

    // Push notification
    inMemoryNotifications.unshift({
      id: `notif-${Date.now()}`,
      title: "Interview Scheduled",
      message: `Interview with ${data.candidateName} for ${data.opportunityTitle} set for ${data.date} at ${data.time}.`,
      type: "interview",
      read: false,
      timestamp: new Date().toISOString()
    });

    return newInterview;
  },

  async sendOffer(data, recruiterId) {
    const newOffer = {
      id: `off-${Date.now()}`,
      _id: `off-${Date.now()}`,
      candidateId: data.candidateId,
      candidateName: data.candidateName,
      candidateEmail: data.candidateEmail || "",
      opportunityId: data.opportunityId,
      opportunityTitle: data.opportunityTitle,
      offerType: data.offerType || "Internship",
      stipendOrSalary: data.compensation || "$4,500 / month",
      startDate: data.startDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      status: "Offered",
      notes: data.notes || "",
      recruiterId,
      createdAt: new Date().toISOString()
    };

    if (dataStore.isMongoConnected()) {
      try {
        await Offer.create({ ...newOffer, _id: undefined });
      } catch (e) {
        console.warn("sendOffer DB fallback:", e.message);
      }
    }

    // Update application stage to "Selected"
    const app = inMemoryApplications.find(
      (a) => a.candidateId === data.candidateId && a.opportunityId === data.opportunityId
    );
    if (app) {
      app.stage = "Selected";
      app.status = "Selected";
      app.offerDetails = {
        type: newOffer.offerType,
        compensation: newOffer.stipendOrSalary,
        startDate: newOffer.startDate,
        status: "Offered",
        notes: newOffer.notes
      };
    }

    inMemoryNotifications.unshift({
      id: `notif-${Date.now()}`,
      title: `${newOffer.offerType} Offer Sent`,
      message: `${newOffer.offerType} offer sent to ${data.candidateName} for ${data.opportunityTitle}. Compensation: ${newOffer.stipendOrSalary}.`,
      type: "offer",
      read: false,
      timestamp: new Date().toISOString()
    });

    return newOffer;
  },

  // Academia Collaboration
  async getCollaborations() {
    let list = inMemoryCollaborations;
    if (dataStore.isMongoConnected()) {
      try {
        const db = await Collaboration.find().sort({ createdAt: -1 }).lean();
        if (db?.length) list = db.map((x) => ({ ...x, id: x._id.toString() }));
      } catch (e) {
        console.warn("getCollaborations DB fallback:", e.message);
      }
    }
    return list;
  },

  async createCollaboration(data, userId) {
    const newCollab = {
      id: `collab-${Date.now()}`,
      _id: `collab-${Date.now()}`,
      title: data.title,
      type: data.type || "Mentorship",
      organization: data.organization || inMemoryProfile.companyName,
      partnerInstitution: data.partnerInstitution || "All Partner Institutions",
      audience: data.audience || "All",
      seats: data.seats || 30,
      skills: Array.isArray(data.skills) ? data.skills : (data.skills || "").split(",").map((s) => s.trim()).filter(Boolean),
      description: data.description || "",
      startDate: data.startDate || new Date(Date.now() + 14 * 86400000).toISOString(),
      deadline: data.deadline || new Date(Date.now() + 7 * 86400000).toISOString(),
      contactEmail: data.contactEmail || inMemoryProfile.contactEmail,
      status: "Active",
      isActive: true,
      createdBy: userId,
      createdAt: new Date().toISOString()
    };

    if (dataStore.isMongoConnected()) {
      try {
        const created = await Collaboration.create({ ...newCollab, _id: undefined });
        newCollab._id = created._id.toString();
        newCollab.id = created._id.toString();
      } catch (e) {
        console.warn("createCollaboration DB fallback:", e.message);
      }
    }

    inMemoryCollaborations.unshift(newCollab);
    return newCollab;
  },

  // Skill Demand
  getSkillDemand() {
    return computeSkillDemand();
  },

  // Notifications
  getNotifications() {
    return inMemoryNotifications;
  },

  markNotificationRead(id) {
    const n = inMemoryNotifications.find((x) => x.id === id);
    if (n) n.read = true;
    return true;
  },

  // Profile
  getProfile() {
    return inMemoryProfile;
  },

  updateProfile(updates) {
    inMemoryProfile = { ...inMemoryProfile, ...updates };
    return inMemoryProfile;
  }
};

import mongoose from "mongoose";
import CollegeStaffProfile from "../models/CollegeStaffProfile.js";
import User from "../models/User.js";
import Opportunity from "../models/Opportunity.js";
import Application from "../models/Application.js";
import Collaboration from "../models/Collaboration.js";
import { dataStore } from "./dataStore.js";

// Comprehensive Student Roster for Institution Monitoring
const INSTITUTION_STUDENTS = [
  {
    id: "usr-4091",
    name: "Alex Rivers",
    rollNumber: "AIST-2022-CS-041",
    email: "alex.rivers@example.com",
    phone: "+1 (555) 019-2834",
    course: "B.Tech",
    department: "Computer Science & Engineering",
    graduationYear: "2026",
    currentSemester: "7th Semester",
    cgpa: 8.92,
    assessmentStatus: "Completed",
    skillScore: 88,
    skillGap: "Low",
    certificationsCount: 2,
    projectsCount: 3,
    internshipStatus: "Completed",
    placementStatus: "Placed",
    placedCompany: "Apex Global Technologies",
    packageCTC: "$112,000 / yr",
    resumeStatus: "Verified",
    readinessScore: 88,
    targetRole: "Full Stack Cloud Engineer",
    skills: [
      { name: "TypeScript & Modern JavaScript", category: "Technical", level: "Advanced", score: 88 },
      { name: "React Ecosystem & Next.js", category: "Technical", level: "Advanced", score: 84 },
      { name: "Node.js & Express REST APIs", category: "Technical", level: "Intermediate", score: 78 },
      { name: "PostgreSQL & Relational Data", category: "Technical", level: "Intermediate", score: 75 },
      { name: "Docker & Containerization", category: "DevOps", level: "Intermediate", score: 72 },
      { name: "AWS Cloud Infrastructure", category: "Cloud", level: "Intermediate", score: 70 },
      { name: "Agile & Team Collaboration", category: "Soft Skills", level: "Advanced", score: 90 }
    ],
    skillGaps: [
      { skill: "Kubernetes Orchestration", severity: "Medium", currentScore: 50, requiredScore: 75, recommendation: "Complete Cloud Native Lab" },
      { skill: "System Design at Scale", severity: "Low", currentScore: 68, requiredScore: 80, recommendation: "Review Microservices Architecture" }
    ],
    projects: [
      {
        title: "Enterprise Cloud Application Portal",
        technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
        description: "Microservices architecture dashboard with OAuth2 role-based authorization and real-time state synchronization.",
        githubUrl: "https://github.com/alexrivers/cloud-portal",
        verified: true
      },
      {
        title: "Distributed Telemetry Job Queue",
        technologies: ["Node.js", "Docker", "Redis", "PostgreSQL"],
        description: "Fault-tolerant asynchronous job queue processing over 15k events per minute.",
        githubUrl: "https://github.com/alexrivers/telemetry-queue",
        verified: true
      }
    ],
    certifications: [
      { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", year: "2025", verified: true },
      { name: "Meta Front-End Developer Specialization", issuer: "Meta", year: "2025", verified: true }
    ],
    internships: [
      {
        role: "Software Engineering Fellow",
        company: "Distributed Software Labs",
        duration: "Summer 2025 (3 months)",
        status: "Completed",
        description: "Engineered scalable React microfrontends and optimized state reconciliation."
      }
    ]
  },
  {
    id: "usr-candidate-002",
    name: "Priya Sharma",
    rollNumber: "AIST-2022-IT-108",
    email: "priya.sharma@example.com",
    phone: "+1 (555) 349-1120",
    course: "B.Tech",
    department: "Information Technology",
    graduationYear: "2026",
    currentSemester: "7th Semester",
    cgpa: 9.15,
    assessmentStatus: "Completed",
    skillScore: 86,
    skillGap: "Low",
    certificationsCount: 2,
    projectsCount: 2,
    internshipStatus: "Interning",
    placementStatus: "Shortlisted",
    placedCompany: null,
    packageCTC: null,
    resumeStatus: "Verified",
    readinessScore: 86,
    targetRole: "Backend Systems & Data Engineer",
    skills: [
      { name: "Python & FastAPI", category: "Technical", level: "Advanced", score: 88 },
      { name: "Node.js & Express REST APIs", category: "Technical", level: "Advanced", score: 86 },
      { name: "PostgreSQL & Database Design", category: "Technical", level: "Advanced", score: 82 },
      { name: "Docker & Containerization", category: "DevOps", level: "Intermediate", score: 78 },
      { name: "Kafka Event Streaming", category: "Technical", level: "Intermediate", score: 72 }
    ],
    skillGaps: [
      { skill: "GraphQL Schema Stitching", severity: "Medium", currentScore: 48, requiredScore: 75, recommendation: "Attend API Design Masterclass" }
    ],
    projects: [
      {
        title: "High-Throughput Ingestion Engine",
        technologies: ["Python", "FastAPI", "PostgreSQL", "Kafka"],
        description: "Streaming telemetry ingestion handling 50k events/sec with automated schema migration.",
        githubUrl: "https://github.com/priyasharma/ingestion-engine",
        verified: true
      }
    ],
    certifications: [
      { name: "AWS Certified Developer - Associate", issuer: "Amazon Web Services", year: "2025", verified: true }
    ],
    internships: [
      {
        role: "Backend Developer Intern",
        company: "DataPulse Analytics",
        duration: "6 months (Current)",
        status: "Interning",
        description: "Developing async data processing pipelines and caching layers."
      }
    ]
  },
  {
    id: "usr-candidate-003",
    name: "Marcus Vance",
    rollNumber: "AIST-2022-CS-087",
    email: "marcus.vance@example.com",
    phone: "+1 (555) 781-4492",
    course: "B.Tech",
    department: "Computer Science & Engineering",
    graduationYear: "2026",
    currentSemester: "7th Semester",
    cgpa: 8.45,
    assessmentStatus: "Completed",
    skillScore: 84,
    skillGap: "Medium",
    certificationsCount: 1,
    projectsCount: 2,
    internshipStatus: "Completed",
    placementStatus: "Interviewing",
    placedCompany: null,
    packageCTC: null,
    resumeStatus: "Verified",
    readinessScore: 83,
    targetRole: "Frontend UI Specialist & Design Systems",
    skills: [
      { name: "React Ecosystem & Next.js", category: "Technical", level: "Advanced", score: 92 },
      { name: "TypeScript & Modern JavaScript", category: "Technical", level: "Advanced", score: 86 },
      { name: "Tailwind CSS & Design Systems", category: "Technical", level: "Advanced", score: 95 },
      { name: "Web Accessibility (WCAG)", category: "Technical", level: "Intermediate", score: 80 }
    ],
    skillGaps: [
      { skill: "End-to-End Testing (Playwright)", severity: "Medium", currentScore: 55, requiredScore: 80, recommendation: "Software Testing Bridge Lab" },
      { skill: "Server-Side Rendering Cache (Redis)", severity: "High", currentScore: 40, requiredScore: 75, recommendation: "Advanced Full-Stack Module" }
    ],
    projects: [
      {
        title: "Omni Design System & Component Library",
        technologies: ["React", "TypeScript", "Tailwind CSS", "Storybook"],
        description: "Accessible design system with 45+ components and automated token export.",
        githubUrl: "https://github.com/marcusvance/omni-ui",
        verified: true
      }
    ],
    certifications: [
      { name: "Professional UI/UX Design Specialist", issuer: "Design Guild", year: "2024", verified: true }
    ],
    internships: [
      {
        role: "UI Engineering Intern",
        company: "Vanguard Interfaces",
        duration: "4 months",
        status: "Completed",
        description: "Implemented WCAG AA accessibility standards across the enterprise suite."
      }
    ]
  },
  {
    id: "usr-candidate-004",
    name: "Elena Rostova",
    rollNumber: "AIST-2023-AI-014",
    email: "elena.rostova@example.com",
    phone: "+1 (555) 602-9118",
    course: "B.Tech",
    department: "AI & Data Science",
    graduationYear: "2027",
    currentSemester: "5th Semester",
    cgpa: 9.42,
    assessmentStatus: "Completed",
    skillScore: 91,
    skillGap: "Low",
    certificationsCount: 3,
    projectsCount: 4,
    internshipStatus: "Selected",
    placementStatus: "Eligible",
    placedCompany: null,
    packageCTC: null,
    resumeStatus: "Verified",
    readinessScore: 90,
    targetRole: "AI / Machine Learning Engineer",
    skills: [
      { name: "Python & PyTorch", category: "AI / ML", level: "Advanced", score: 94 },
      { name: "NLP & LLM Fine-Tuning", category: "AI / ML", level: "Advanced", score: 90 },
      { name: "Data Science & Pandas", category: "Technical", level: "Advanced", score: 92 },
      { name: "Vector Databases (Pinecone/Milvus)", category: "AI / ML", level: "Intermediate", score: 85 },
      { name: "Docker & MLOps", category: "DevOps", level: "Intermediate", score: 76 }
    ],
    skillGaps: [
      { skill: "MLOps Model Serving (Triton/Ray)", severity: "Medium", currentScore: 58, requiredScore: 80, recommendation: "AI Deployment Hands-on Workshop" }
    ],
    projects: [
      {
        title: "Medical Diagnostic Assistant using Multi-Modal LLMs",
        technologies: ["PyTorch", "HuggingFace", "Python", "FastAPI"],
        description: "Fine-tuned vision-language models for clinical radiology reports with 94.2% validation accuracy.",
        githubUrl: "https://github.com/elenarostova/med-assistant",
        verified: true
      }
    ],
    certifications: [
      { name: "TensorFlow Developer Certificate", issuer: "Google Cloud", year: "2024", verified: true },
      { name: "Deep Learning Specialization", issuer: "DeepLearning.AI", year: "2025", verified: true }
    ],
    internships: [
      {
        role: "Machine Learning Intern",
        company: "Synthetix AI Labs",
        duration: "Upcoming Summer 2026",
        status: "Selected",
        description: "Offer accepted for generative speech synthesis and RAG pipelines."
      }
    ]
  },
  {
    id: "usr-candidate-005",
    name: "Devonte Jackson",
    rollNumber: "AIST-2022-EC-052",
    email: "devonte.jackson@example.com",
    phone: "+1 (555) 412-8871",
    course: "B.Tech",
    department: "Electronics & Communication",
    graduationYear: "2026",
    currentSemester: "7th Semester",
    cgpa: 8.10,
    assessmentStatus: "In Progress",
    skillScore: 74,
    skillGap: "Critical",
    certificationsCount: 1,
    projectsCount: 1,
    internshipStatus: "Applied",
    placementStatus: "Eligible",
    placedCompany: null,
    packageCTC: null,
    resumeStatus: "Uploaded",
    readinessScore: 71,
    targetRole: "Embedded Systems & IoT Engineer",
    skills: [
      { name: "C / C++ for Embedded", category: "Technical", level: "Advanced", score: 82 },
      { name: "RTOS & Microcontrollers", category: "Hardware", level: "Intermediate", score: 75 },
      { name: "Python Scripting", category: "Technical", level: "Intermediate", score: 68 },
      { name: "PCB Design (Altium)", category: "Hardware", level: "Intermediate", score: 70 }
    ],
    skillGaps: [
      { skill: "Linux Device Drivers", severity: "Critical", currentScore: 35, requiredScore: 75, recommendation: "Mandatory Kernel & Device Driver Bootcamp" },
      { skill: "Automotive Ethernet Protocol", severity: "Critical", currentScore: 40, requiredScore: 80, recommendation: "Industry Industrial Training Session" }
    ],
    projects: [
      {
        title: "Solar Smart Inverter with Edge Telemetry",
        technologies: ["STM32", "C++", "FreeRTOS", "MQTT"],
        description: "Ultra-low power microcontroller firmware with fault protection and CAN-bus telemetry.",
        githubUrl: "https://github.com/devontej/smart-inverter",
        verified: true
      }
    ],
    certifications: [
      { name: "Embedded Systems Certification", issuer: "ARM University", year: "2024", verified: true }
    ],
    internships: []
  },
  {
    id: "usr-candidate-006",
    name: "Maya Lin",
    rollNumber: "AIST-2022-CS-112",
    email: "maya.lin@example.com",
    phone: "+1 (555) 901-2345",
    course: "B.Tech",
    department: "Computer Science & Engineering",
    graduationYear: "2026",
    currentSemester: "7th Semester",
    cgpa: 8.78,
    assessmentStatus: "Completed",
    skillScore: 82,
    skillGap: "Medium",
    certificationsCount: 2,
    projectsCount: 2,
    internshipStatus: "Completed",
    placementStatus: "Placed",
    placedCompany: "CloudScale Systems",
    packageCTC: "$105,000 / yr",
    resumeStatus: "Verified",
    readinessScore: 84,
    targetRole: "Site Reliability & Cloud Engineer",
    skills: [
      { name: "Kubernetes & Docker", category: "DevOps", level: "Advanced", score: 86 },
      { name: "Terraform Infrastructure as Code", category: "Cloud", level: "Intermediate", score: 80 },
      { name: "Prometheus & Grafana", category: "Observability", level: "Intermediate", score: 78 },
      { name: "Go & Python", category: "Technical", level: "Intermediate", score: 76 }
    ],
    skillGaps: [
      { skill: "Chaos Engineering (Gremlin/Chaos Mesh)", severity: "Medium", currentScore: 52, requiredScore: 75, recommendation: "Reliability Engineering Workshop" }
    ],
    projects: [
      {
        title: "Multi-Cluster GitOps Kubernetes Pipeline",
        technologies: ["ArgoCD", "Kubernetes", "Terraform", "GitHub Actions"],
        description: "Zero-downtime deployment orchestration with automated rollbacks and canary releases.",
        githubUrl: "https://github.com/mayalin/gitops-k8s",
        verified: true
      }
    ],
    certifications: [
      { name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF", year: "2025", verified: true }
    ],
    internships: [
      {
        role: "DevOps Intern",
        company: "Kubernetes Core Solutions",
        duration: "3 months",
        status: "Completed",
        description: "Automated container builds and cluster auto-scaling."
      }
    ]
  },
  {
    id: "usr-candidate-007",
    name: "Rohan Kulkarni",
    rollNumber: "AIST-2024-MB-029",
    email: "rohan.kulkarni@example.com",
    phone: "+1 (555) 723-9081",
    course: "MBA",
    department: "Management Studies",
    graduationYear: "2025",
    currentSemester: "3rd Semester",
    cgpa: 8.60,
    assessmentStatus: "Completed",
    skillScore: 85,
    skillGap: "Low",
    certificationsCount: 2,
    projectsCount: 2,
    internshipStatus: "Completed",
    placementStatus: "Placed",
    placedCompany: "Deloitte Advisory",
    packageCTC: "$98,000 / yr",
    resumeStatus: "Verified",
    readinessScore: 87,
    targetRole: "Product & Technology Consultant",
    skills: [
      { name: "Product Strategy & Roadmapping", category: "Product", level: "Advanced", score: 90 },
      { name: "Data Analytics & Tableau", category: "Analytics", level: "Advanced", score: 85 },
      { name: "Agile Scrum Master", category: "Management", level: "Advanced", score: 88 },
      { name: "Financial Modeling", category: "Finance", level: "Intermediate", score: 79 }
    ],
    skillGaps: [
      { skill: "SQL for Big Data (Snowflake)", severity: "Low", currentScore: 65, requiredScore: 78, recommendation: "Data Analytics Masterclass" }
    ],
    projects: [
      {
        title: "B2B SaaS Go-To-Market & Pricing Optimization",
        technologies: ["Tableau", "Python", "Excel Modeling"],
        description: "Comprehensive monetization overhaul driving 22% expected ARR lift.",
        githubUrl: "",
        verified: true
      }
    ],
    certifications: [
      { name: "Certified Scrum Product Owner (CSPO)", issuer: "Scrum Alliance", year: "2024", verified: true }
    ],
    internships: [
      {
        role: "Associate Consultant Intern",
        company: "KPMG Advisory",
        duration: "2 months",
        status: "Completed",
        description: "Assisted in enterprise ERP digital transformation audit."
      }
    ]
  },
  {
    id: "usr-candidate-008",
    name: "Aisha Al-Mansoor",
    rollNumber: "AIST-2022-CS-144",
    email: "aisha.mansoor@example.com",
    phone: "+1 (555) 819-4720",
    course: "B.Tech",
    department: "Computer Science & Engineering",
    graduationYear: "2026",
    currentSemester: "7th Semester",
    cgpa: 9.02,
    assessmentStatus: "Completed",
    skillScore: 89,
    skillGap: "Low",
    certificationsCount: 2,
    projectsCount: 3,
    internshipStatus: "Interning",
    placementStatus: "Shortlisted",
    placedCompany: null,
    packageCTC: null,
    resumeStatus: "Verified",
    readinessScore: 89,
    targetRole: "Cybersecurity & Cloud Security Engineer",
    skills: [
      { name: "Network Security & Penetration Testing", category: "Security", level: "Advanced", score: 90 },
      { name: "SOC Operations & SIEM (Splunk)", category: "Security", level: "Advanced", score: 88 },
      { name: "Cloud IAM & Governance (AWS)", category: "Cloud", level: "Intermediate", score: 84 },
      { name: "Python & Cryptography", category: "Technical", level: "Intermediate", score: 82 }
    ],
    skillGaps: [
      { skill: "Zero Trust Architecture Implementation", severity: "Low", currentScore: 68, requiredScore: 80, recommendation: "Industry Security Webinar" }
    ],
    projects: [
      {
        title: "Automated Zero-Day Vulnerability Scanner",
        technologies: ["Python", "Nmap", "Docker", "FastAPI"],
        description: "Distributed port auditor and CVE correlator with webhook alerting.",
        githubUrl: "https://github.com/aishamansoor/vuln-scanner",
        verified: true
      }
    ],
    certifications: [
      { name: "CompTIA Security+", issuer: "CompTIA", year: "2024", verified: true },
      { name: "Certified Ethical Hacker (CEH)", issuer: "EC-Council", year: "2025", verified: true }
    ],
    internships: [
      {
        role: "Information Security Intern",
        company: "Fortress Cyber Defense",
        duration: "6 months (Current)",
        status: "Interning",
        description: "Monitored SIEM security alarms and triaged endpoint incident reports."
      }
    ]
  },
  {
    id: "usr-candidate-009",
    name: "Vikram Sengupta",
    rollNumber: "AIST-2022-ME-019",
    email: "vikram.sengupta@example.com",
    phone: "+1 (555) 670-3419",
    course: "B.Tech",
    department: "Mechanical Engineering",
    graduationYear: "2026",
    currentSemester: "7th Semester",
    cgpa: 7.95,
    assessmentStatus: "Pending",
    skillScore: 68,
    skillGap: "Critical",
    certificationsCount: 1,
    projectsCount: 1,
    internshipStatus: "Not Started",
    placementStatus: "Eligible",
    placedCompany: null,
    packageCTC: null,
    resumeStatus: "Uploaded",
    readinessScore: 67,
    targetRole: "Robotics & Automation Systems Engineer",
    skills: [
      { name: "SolidWorks 3D CAD Modeling", category: "Mechanical", level: "Advanced", score: 84 },
      { name: "MATLAB & Simulink", category: "Engineering", level: "Intermediate", score: 72 },
      { name: "Finite Element Analysis (ANSYS)", category: "Mechanical", level: "Intermediate", score: 70 },
      { name: "Robotics Operating System (ROS)", category: "Robotics", level: "Beginner", score: 48 }
    ],
    skillGaps: [
      { skill: "ROS2 & Autonomous Navigation (SLAM)", severity: "Critical", currentScore: 32, requiredScore: 75, recommendation: "Robotics Lab Hands-On Track" },
      { skill: "Python for Kinematics", severity: "Critical", currentScore: 40, requiredScore: 70, recommendation: "Python for Engineers Foundation" }
    ],
    projects: [
      {
        title: "Autonomous Quadruped Inspection Robot",
        technologies: ["SolidWorks", "ROS", "Python", "3D Printing"],
        description: "Four-legged exploratory chassis for hazardous pipe inspection.",
        githubUrl: "",
        verified: true
      }
    ],
    certifications: [
      { name: "CSWA Certified SolidWorks Associate", issuer: "Dassault Systèmes", year: "2024", verified: true }
    ],
    internships: []
  },
  {
    id: "usr-candidate-010",
    name: "Chloe Dupont",
    rollNumber: "AIST-2023-AI-045",
    email: "chloe.dupont@example.com",
    phone: "+1 (555) 554-1029",
    course: "B.Tech",
    department: "AI & Data Science",
    graduationYear: "2027",
    currentSemester: "5th Semester",
    cgpa: 8.85,
    assessmentStatus: "Completed",
    skillScore: 87,
    skillGap: "Low",
    certificationsCount: 2,
    projectsCount: 2,
    internshipStatus: "Selected",
    placementStatus: "Eligible",
    placedCompany: null,
    packageCTC: null,
    resumeStatus: "Verified",
    readinessScore: 86,
    targetRole: "Computer Vision & Deep Learning Engineer",
    skills: [
      { name: "OpenCV & Computer Vision", category: "AI / ML", level: "Advanced", score: 88 },
      { name: "PyTorch & Deep Learning", category: "AI / ML", level: "Advanced", score: 86 },
      { name: "Python Scripting", category: "Technical", level: "Advanced", score: 90 },
      { name: "Edge AI (TensorRT / ONNX)", category: "AI / ML", level: "Intermediate", score: 78 }
    ],
    skillGaps: [
      { skill: "LiDAR Point Cloud Processing", severity: "Low", currentScore: 60, requiredScore: 75, recommendation: "Autonomous Systems Elective" }
    ],
    projects: [
      {
        title: "Real-Time Industrial PPE Compliance Monitor",
        technologies: ["YOLOv8", "PyTorch", "OpenCV", "Docker"],
        description: "Vision model detecting safety helmets and high-visibility vests at 45 FPS on edge devices.",
        githubUrl: "https://github.com/chloedupont/ppe-monitor",
        verified: true
      }
    ],
    certifications: [
      { name: "Deep Learning for Computer Vision", issuer: "Coursera / Stanford", year: "2024", verified: true }
    ],
    internships: [
      {
        role: "Computer Vision Research Intern",
        company: "Visionary Dynamics",
        duration: "Summer 2026",
        status: "Selected",
        description: "Embedded vision algorithms for aerial drone inspection."
      }
    ]
  }
];

// In-Memory storage with initial data
let inMemoryStudents = [...INSTITUTION_STUDENTS];

let inMemoryPlacementDrives = [
  {
    id: "drv-101",
    companyName: "Apex Global Technologies",
    role: "Full Stack Software Engineer & Cloud Trainee",
    type: "Full-Time Campus Hiring",
    packageCTC: "$115,000 / yr (9.5 LPA - 14 LPA Equivalent)",
    eligibleDepartments: ["Computer Science & Engineering", "Information Technology", "AI & Data Science"],
    minCgpa: 7.5,
    driveDate: "2026-04-15",
    status: "Active",
    appliedCount: 184,
    shortlistedCount: 42,
    interviewedCount: 28,
    selectedCount: 14,
    location: "San Francisco, CA / Bengaluru (Hybrid)"
  },
  {
    id: "drv-102",
    companyName: "DataPulse Analytics",
    role: "Associate Data Systems & Backend Engineer",
    type: "Internship + FTE Conversion",
    packageCTC: "$95,000 / yr ($1,200/mo stipend during internship)",
    eligibleDepartments: ["Computer Science & Engineering", "Information Technology", "AI & Data Science", "Electronics & Communication"],
    minCgpa: 7.0,
    driveDate: "2026-04-22",
    status: "Active",
    appliedCount: 142,
    shortlistedCount: 36,
    interviewedCount: 19,
    selectedCount: 8,
    location: "Bengaluru / Remote"
  },
  {
    id: "drv-103",
    companyName: "CloudScale Systems",
    role: "Junior Cloud Operations & SRE Specialist",
    type: "Full-Time Campus Hiring",
    packageCTC: "$108,000 / yr",
    eligibleDepartments: ["Computer Science & Engineering", "Information Technology", "Electronics & Communication"],
    minCgpa: 7.2,
    driveDate: "2026-05-02",
    status: "Scheduled",
    appliedCount: 96,
    shortlistedCount: 0,
    interviewedCount: 0,
    selectedCount: 0,
    location: "Austin, TX / Remote"
  },
  {
    id: "drv-104",
    companyName: "Deloitte Advisory",
    role: "Technology Analyst / Associate Consultant",
    type: "Full-Time Placement",
    packageCTC: "$98,000 / yr",
    eligibleDepartments: ["Management Studies", "Computer Science & Engineering", "Information Technology"],
    minCgpa: 7.5,
    driveDate: "2026-03-12",
    status: "Completed",
    appliedCount: 210,
    shortlistedCount: 65,
    interviewedCount: 38,
    selectedCount: 22,
    location: "Global Delivery Locations"
  }
];

let inMemoryInternships = [
  {
    id: "int-201",
    title: "Software Engineering Intern - Cloud & Distributed Systems",
    companyName: "Apex Global Technologies",
    department: "Computer Science & Engineering",
    duration: "6 Months",
    stipend: "$1,500 / mo",
    workMode: "Hybrid",
    location: "Bengaluru / San Francisco",
    appliedCount: 68,
    selectedCount: 8,
    currentlyInterning: 6,
    completedCount: 14,
    status: "Active"
  },
  {
    id: "int-202",
    title: "Data Analytics & ML Research Fellow",
    companyName: "Synthetix AI Labs",
    department: "AI & Data Science",
    duration: "3 Months",
    stipend: "$1,800 / mo",
    workMode: "Remote",
    location: "Remote",
    appliedCount: 84,
    selectedCount: 4,
    currentlyInterning: 4,
    completedCount: 9,
    status: "Active"
  },
  {
    id: "int-203",
    title: "Embedded Systems & IoT Engineering Intern",
    companyName: "Rivian / MicroGrid Tech",
    department: "Electronics & Communication",
    duration: "6 Months",
    stipend: "$1,200 / mo",
    workMode: "On-site",
    location: "San Jose, CA",
    appliedCount: 42,
    selectedCount: 5,
    currentlyInterning: 3,
    completedCount: 8,
    status: "Active"
  },
  {
    id: "int-204",
    title: "Product Operations & Business Strategy Intern",
    companyName: "Vanguard Interfaces",
    department: "Management Studies",
    duration: "4 Months",
    stipend: "$1,400 / mo",
    workMode: "Hybrid",
    location: "New York, NY",
    appliedCount: 38,
    selectedCount: 6,
    currentlyInterning: 5,
    completedCount: 12,
    status: "Active"
  }
];

let inMemoryRecruiterConnections = [
  {
    id: "rec-301",
    companyName: "Apex Global Technologies",
    industry: "Enterprise Software & Cloud Systems",
    website: "https://apextechnologies.io",
    recruiterName: "Sarah Jenkins",
    recruiterEmail: "recruiter@skillmap.demo",
    activeJobsCount: 8,
    activeInternshipsCount: 3,
    applicationsCount: 184,
    totalHires: 38,
    activeProgramsCount: 3,
    mouStatus: "Active Partner (Signed 2024 - 2027)",
    partnershipLevel: "Tier-1 Strategic Partner",
    lastVisit: "2026-03-28"
  },
  {
    id: "rec-302",
    companyName: "DataPulse Analytics",
    industry: "Big Data & Distributed Ingestion",
    website: "https://datapulse.dev",
    recruiterName: "Vikram Malhotra",
    recruiterEmail: "vikram@datapulse.dev",
    activeJobsCount: 4,
    activeInternshipsCount: 2,
    applicationsCount: 142,
    totalHires: 19,
    activeProgramsCount: 2,
    mouStatus: "Active Partner (Signed 2025 - 2028)",
    partnershipLevel: "Core Industry Collaborator",
    lastVisit: "2026-04-02"
  },
  {
    id: "rec-303",
    companyName: "CloudScale Systems",
    industry: "Cloud Infrastructure & SRE",
    website: "https://cloudscale.systems",
    recruiterName: "David Chen",
    recruiterEmail: "d.chen@cloudscale.systems",
    activeJobsCount: 5,
    activeInternshipsCount: 1,
    applicationsCount: 96,
    totalHires: 14,
    activeProgramsCount: 1,
    mouStatus: "Pending Renewal (2026)",
    partnershipLevel: "Technology Sponsor",
    lastVisit: "2026-02-14"
  },
  {
    id: "rec-304",
    companyName: "Synthetix AI Labs",
    industry: "Generative AI & LLM Systems",
    website: "https://synthetix.ai",
    recruiterName: "Dr. Amanda Wright",
    recruiterEmail: "wright@synthetix.ai",
    activeJobsCount: 6,
    activeInternshipsCount: 4,
    applicationsCount: 128,
    totalHires: 11,
    activeProgramsCount: 4,
    mouStatus: "Active Partner (Signed 2025 - 2028)",
    partnershipLevel: "Research & Co-Innovation Partner",
    lastVisit: "2026-03-10"
  },
  {
    id: "rec-305",
    companyName: "Deloitte Advisory",
    industry: "Management & Technology Consulting",
    website: "https://deloitte.com",
    recruiterName: "Pooja Mehta",
    recruiterEmail: "pmehta@deloitte.com",
    activeJobsCount: 12,
    activeInternshipsCount: 5,
    applicationsCount: 210,
    totalHires: 54,
    activeProgramsCount: 2,
    mouStatus: "Permanent Campus Partner",
    partnershipLevel: "Tier-1 Strategic Partner",
    lastVisit: "2026-03-12"
  }
];

let inMemoryFacultyOpportunities = [
  {
    id: "fac-401",
    title: "Industry Immersion: Cloud Native Architecture & Distributed Systems",
    type: "Faculty Internship",
    organization: "Apex Global Technologies",
    discipline: "Computer Science & Information Technology",
    duration: "4 Weeks (Summer 2026)",
    modality: "Hybrid / On-site",
    grantAmount: "$3,500 Academic Honorarium",
    eligibility: "Faculty with min 2 years teaching Systems / Web Technologies",
    deadline: "2026-05-15",
    status: "Accepting Applications",
    description: "Hands-on participation in core architecture teams building microservices, service meshes, and automated CI/CD deployment pipelines."
  },
  {
    id: "fac-402",
    title: "AICTE & Industry Approved FDP on Generative AI & Vector Architectures",
    type: "FDP Programs",
    organization: "Synthetix AI Labs & Google Cloud Education",
    discipline: "AI & Data Science, CSE",
    duration: "2 Weeks (Online / Live)",
    modality: "Virtual",
    grantAmount: "Full Fee Waiver + Cert",
    eligibility: "All Computer Science & Applied Mathematics Faculty",
    deadline: "2026-04-30",
    status: "Accepting Applications",
    description: "Comprehensive 40-hour pedagogical course covering RAG pipelines, transformer attention mechanics, model fine-tuning and ethical AI guardrails."
  },
  {
    id: "fac-403",
    title: "Industrial Embedded Linux & Automotive Cybersecurity Training",
    type: "Industrial Training",
    organization: "Rivian & MicroGrid Automotive Lab",
    discipline: "Electronics & Communication, Mechanical",
    duration: "3 Weeks",
    modality: "On-site Lab",
    grantAmount: "Funded Equipment Kit",
    eligibility: "Electronics & Embedded Systems Lecturers",
    deadline: "2026-05-20",
    status: "Accepting Applications",
    description: "Intensive laboratory training on CAN-bus security, secure bootloader design, and automotive RTOS standards."
  },
  {
    id: "fac-404",
    title: "Industry Consultancy Project: Real-Time Telemetry Anomaly Detection",
    type: "Consultancy",
    organization: "DataPulse Analytics",
    discipline: "Information Technology & Mathematics",
    duration: "6 Months Project",
    modality: "Consultancy Contract",
    grantAmount: "$12,000 Institutional Project Grant",
    eligibility: "Senior Faculty / Ph.D. holders in Machine Learning or Data Systems",
    deadline: "2026-06-01",
    status: "Accepting Proposals",
    description: "Collaborative research and algorithmic design contract to detect streaming telemetry drifts in high-velocity IoT pipelines."
  },
  {
    id: "fac-405",
    title: "Collaborative Applied Research: Decentralized Identity for Academic Credentials",
    type: "Research Projects",
    organization: "National Science & Tech Consortium",
    discipline: "Interdisciplinary (CSE, IT, Management)",
    duration: "1 Year Collaborative Grant",
    modality: "Joint Research",
    grantAmount: "$25,000 Research Grant",
    eligibility: "Tenured Faculty with published research in cryptography or distributed networks",
    deadline: "2026-06-15",
    status: "Accepting Proposals",
    description: "Joint pilot program testing verifiable credential standards (W3C DID) for tamper-proof digital transcript and certification verification."
  },
  {
    id: "fac-406",
    title: "Executive Guest Lecture Series on Enterprise Product Management",
    type: "Guest Lectures",
    organization: "Vanguard Interfaces & McKinsey Alumni",
    discipline: "Management Studies & Engineering",
    duration: "Weekly 2-Hour Modules",
    modality: "Hybrid Lecture Hall",
    grantAmount: "Institutional Sponsorship",
    eligibility: "Faculty coordinating B.Tech/MBA capstone projects",
    deadline: "2026-05-10",
    status: "Accepting Applications",
    description: "Co-teaching series pairing industry CPOs and VPs of Engineering with academic professors to mentor student startup ventures."
  }
];

let inMemoryIndustryCollaborations = [
  {
    id: "col-501",
    title: "Apex Cloud Engineering Capstone Mentorship Program",
    category: "Mentorship",
    partnerCompany: "Apex Global Technologies",
    leadContact: "Sarah Jenkins (Talent Lead)",
    targetDepartments: ["Computer Science & Engineering", "Information Technology"],
    participatingStudentsCount: 48,
    status: "Active",
    startDate: "2026-01-15",
    endDate: "2026-05-30",
    outcomes: "12 production capstone projects deployed to live cloud infrastructure; 8 pre-placement offers extended.",
    mouReference: "MOU-AIST-APX-2024"
  },
  {
    id: "col-502",
    title: "Synthetix Annual Generative AI Hackathon & Innovation Challenge",
    category: "Innovation Challenges",
    partnerCompany: "Synthetix AI Labs",
    leadContact: "Dr. Amanda Wright",
    targetDepartments: ["AI & Data Science", "Computer Science & Engineering"],
    participatingStudentsCount: 160,
    status: "Active",
    startDate: "2026-04-18",
    endDate: "2026-04-20",
    outcomes: "$15,000 prize pool, fast-track summer research internships for top 3 teams.",
    mouReference: "MOU-AIST-SYN-2025"
  },
  {
    id: "col-503",
    title: "Industry Guest Lecture Series on Microservices & Cloud Security",
    category: "Guest Lectures",
    partnerCompany: "CloudScale Systems",
    leadContact: "David Chen",
    targetDepartments: ["Computer Science & Engineering", "Electronics & Communication"],
    participatingStudentsCount: 320,
    status: "Active",
    startDate: "2026-02-01",
    endDate: "2026-05-15",
    outcomes: "6 bi-weekly expert masterclasses conducted by principal staff SRE engineers.",
    mouReference: "MOU-AIST-CSS-2025"
  },
  {
    id: "col-504",
    title: "Automated Data Systems Live Capstone Lab",
    category: "Live Projects",
    partnerCompany: "DataPulse Analytics",
    leadContact: "Vikram Malhotra",
    targetDepartments: ["Information Technology", "AI & Data Science"],
    participatingStudentsCount: 36,
    status: "Active",
    startDate: "2026-02-10",
    endDate: "2026-06-15",
    outcomes: "Real-world dataset processing, pipeline benchmark optimization and direct internship conversions.",
    mouReference: "MOU-AIST-DPA-2025"
  },
  {
    id: "col-505",
    title: "Industry Professional Certification Cohort: AWS Cloud Architecture",
    category: "Certification Programs",
    partnerCompany: "Amazon Web Services Educate & Apex",
    leadContact: "Academic Relations Team",
    targetDepartments: ["All Engineering Branches"],
    participatingStudentsCount: 140,
    status: "Active",
    startDate: "2026-01-20",
    endDate: "2026-04-30",
    outcomes: "100% sponsored certification exam vouchers for students achieving 85%+ readiness score.",
    mouReference: "MOU-AIST-AWS-2024"
  }
];

let inMemoryNotifications = [
  {
    id: "notif-601",
    title: "Skill Gap Alert: Cloud Native Tools",
    message: "42 students in 7th Sem CSE show high skill gaps in Kubernetes and Microservice Design prior to Apex hiring drive.",
    type: "alert",
    category: "Skill Gap",
    read: false,
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: "notif-602",
    title: "Placement Drive Scheduled: Apex Global",
    message: "Apex Global Technologies has finalized their on-campus slot for April 15, 2026 for 14 FTE roles.",
    type: "placement",
    category: "Campus Drive",
    read: false,
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: "notif-603",
    title: "New Recruiter Partnership Request",
    message: "CyberGuard Networks has submitted an MoU partnership proposal to recruit from CSE & Cybersecurity departments.",
    type: "recruiter",
    category: "Partnership",
    read: false,
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
  },
  {
    id: "notif-604",
    title: "Faculty FDP Registration Deadline",
    message: "Registration for the AICTE-Approved Generative AI & Vector Architectures FDP closes on April 30.",
    type: "faculty",
    category: "Faculty Development",
    read: true,
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: "notif-605",
    title: "Internship Completion Verified",
    message: "14 students in Distributed Software Labs have successfully submitted their supervisor evaluation rubrics.",
    type: "internship",
    category: "Internship Tracking",
    read: true,
    timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  }
];

export const collegeStaffDataService = {
  // Overview Statistics
  async getOverviewStats() {
    const totalStudents = 2486;
    const studentsAssessed = 2180;
    const studentsPlacementReady = 1939; // ~78%
    const activeInternships = 164;
    const studentsInInternship = 210;
    const studentsPlaced = 384;
    const industryPartners = 52;
    const skillGapAlerts = 68;

    return {
      totalStudents,
      studentsAssessed,
      studentsPlacementReady,
      placementReadyPercentage: Math.round((studentsPlacementReady / totalStudents) * 100),
      activeInternships,
      studentsInInternship,
      studentsPlaced,
      placementRatePercentage: "91.4%",
      industryPartners,
      skillGapAlerts,
      departmentStats: [
        { department: "CSE / Software", total: 684, assessed: 640, placed: 186, readiness: 86, averageScore: 82 },
        { department: "IT / Data", total: 512, assessed: 480, placed: 112, readiness: 79, averageScore: 78 },
        { department: "ECE / Embedded", total: 438, assessed: 390, placed: 48, readiness: 71, averageScore: 71 },
        { department: "AI & DS", total: 392, assessed: 380, placed: 94, readiness: 88, averageScore: 85 },
        { department: "Mechanical", total: 248, assessed: 170, placed: 26, readiness: 68, averageScore: 66 },
        { department: "MBA / Management", total: 212, assessed: 190, placed: 44, readiness: 76, averageScore: 75 }
      ]
    };
  },

  // Student Progress Roster with Filtering & Search
  async getStudents(params = {}) {
    const { department, course, year, skillLevel, internshipStatus, placementStatus, search } = params;
    let list = [...inMemoryStudents];

    try {
      const realUsers = await dataStore.getStudentUsers();
      if (realUsers && realUsers.length > 0) {
        const existingEmails = new Set(list.map((s) => (s.email || "").toLowerCase()));
        for (const u of realUsers) {
          const emailLower = (u.email || "").toLowerCase();
          const mappedStudent = {
            id: (u._id || u.id || "").toString(),
            _id: (u._id || u.id || "").toString(),
            name: u.name || "Student User",
            rollNumber: u.rollNumber || `AIST-${u.graduationYear || "2026"}-CS-${(u._id || u.id || "001").toString().slice(-3).toUpperCase()}`,
            email: u.email,
            phone: u.phone || "+1 (555) 019-2834",
            course: (u.degree || "").includes("MBA") ? "MBA" : "B.Tech",
            department: u.department || "Computer Science & Engineering",
            graduationYear: u.graduationYear || "2026",
            currentSemester: "7th Semester",
            cgpa: u.cgpa || 8.8,
            assessmentStatus: (u.skills || []).length > 0 ? "Completed" : "Pending",
            skillScore: u.readinessScore || 85,
            skillGap: (u.readinessScore || 85) >= 80 ? "Low" : (u.readinessScore || 85) >= 65 ? "Medium" : "Critical",
            certificationsCount: (u.certifications || []).length,
            projectsCount: (u.projects || []).length,
            internshipStatus: u.internshipStatus || "Applied",
            placementStatus: u.placementStatus || "Eligible",
            placedCompany: null,
            packageCTC: null,
            resumeStatus: "Verified",
            readinessScore: u.readinessScore || 85,
            targetRole: u.targetRole || "Software Engineer",
            skills: (u.skills || []).map((s) => typeof s === "string" ? { name: s, category: "Technical", level: "Intermediate", score: 75 } : s),
            skillGaps: [],
            projects: u.projects || [],
            certifications: u.certifications || [],
            internships: u.internships || []
          };

          if (!existingEmails.has(emailLower)) {
            list.unshift(mappedStudent);
            existingEmails.add(emailLower);
          } else {
            const idx = list.findIndex((s) => (s.email || "").toLowerCase() === emailLower);
            if (idx !== -1) {
              list[idx] = { ...list[idx], ...mappedStudent, skills: (u.skills && u.skills.length > 0) ? mappedStudent.skills : list[idx].skills };
            }
          }
        }
      }
    } catch (e) {
      console.warn("getStudents realUsers integration error:", e.message);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.targetRole.toLowerCase().includes(q)
      );
    }

    if (department && department !== "all") {
      list = list.filter((s) => s.department.toLowerCase() === department.toLowerCase());
    }

    if (course && course !== "all") {
      list = list.filter((s) => s.course.toLowerCase() === course.toLowerCase());
    }

    if (year && year !== "all") {
      list = list.filter((s) => s.graduationYear === year);
    }

    if (skillLevel && skillLevel !== "all") {
      list = list.filter((s) => {
        if (skillLevel === "High") return s.skillScore >= 85;
        if (skillLevel === "Medium") return s.skillScore >= 70 && s.skillScore < 85;
        if (skillLevel === "Low") return s.skillScore < 70;
        return true;
      });
    }

    if (internshipStatus && internshipStatus !== "all") {
      list = list.filter((s) => s.internshipStatus.toLowerCase() === internshipStatus.toLowerCase());
    }

    if (placementStatus && placementStatus !== "all") {
      list = list.filter((s) => s.placementStatus.toLowerCase() === placementStatus.toLowerCase());
    }

    return list;
  },

  // Student Detail View (Authorized Read-Only View)
  async getStudentById(id) {
    const students = await this.getStudents();
    const student = students.find((s) => s.id === id || s._id === id || s.rollNumber === id);
    if (!student) return null;
    return student;
  },

  // Skill Intelligence & Analytics
  async getSkillIntelligence() {
    const skillsTable = [
      { skill: "React Ecosystem", studentCount: 485, demand: "High", gap: "Medium", avgScore: 78, targetScore: 85, benchmark: "92% Industry Demand" },
      { skill: "Python & FastAPI", studentCount: 612, demand: "High", gap: "Low", avgScore: 84, targetScore: 85, benchmark: "94% Industry Demand" },
      { skill: "AWS & Cloud Infrastructure", studentCount: 184, demand: "High", gap: "High", avgScore: 62, targetScore: 80, benchmark: "90% Industry Demand" },
      { skill: "Node.js & Express REST", studentCount: 420, demand: "High", gap: "Medium", avgScore: 76, targetScore: 82, benchmark: "88% Industry Demand" },
      { skill: "PostgreSQL & SQL Databases", studentCount: 540, demand: "High", gap: "Low", avgScore: 82, targetScore: 80, benchmark: "89% Industry Demand" },
      { skill: "Docker & Containerization", studentCount: 290, demand: "High", gap: "High", avgScore: 65, targetScore: 80, benchmark: "86% Industry Demand" },
      { skill: "Kubernetes Orchestration", studentCount: 110, demand: "High", gap: "Critical", avgScore: 48, targetScore: 78, benchmark: "84% Industry Demand" },
      { skill: "Machine Learning & PyTorch", studentCount: 310, demand: "High", gap: "Medium", avgScore: 77, targetScore: 85, benchmark: "91% Industry Demand" },
      { skill: "Cybersecurity & IAM", studentCount: 135, demand: "High", gap: "High", avgScore: 58, targetScore: 78, benchmark: "82% Industry Demand" },
      { skill: "Professional Communication", studentCount: 1240, demand: "High", gap: "Medium", avgScore: 81, targetScore: 85, benchmark: "95% Industry Demand" },
      { skill: "Agile & Team Problem Solving", studentCount: 1420, demand: "High", gap: "Low", avgScore: 86, targetScore: 85, benchmark: "92% Industry Demand" }
    ];

    const criticalSkillGaps = [
      {
        skill: "Kubernetes & Cloud Orchestration",
        affectedCount: 248,
        department: "Computer Science & Engineering",
        priority: "Urgent",
        recommendedAction: "Organize 3-day weekend Cloud Native bootcamp with Apex Global architects."
      },
      {
        skill: "Linux Kernel & Device Drivers",
        affectedCount: 142,
        department: "Electronics & Communication",
        priority: "Urgent",
        recommendedAction: "Establish specialized Embedded RTOS Lab bridge sessions."
      },
      {
        skill: "Docker & CI/CD Pipelines",
        affectedCount: 196,
        department: "Information Technology",
        priority: "High",
        recommendedAction: "Integrate DevOps pipeline labs into 6th/7th Semester syllabus."
      },
      {
        skill: "System Design & Distributed Data",
        affectedCount: 175,
        department: "Computer Science & Engineering",
        priority: "High",
        recommendedAction: "Schedule architectural case study workshops with senior industry alumni."
      }
    ];

    return {
      skillsTable,
      criticalSkillGaps,
      topSkills: ["Python", "JavaScript/TypeScript", "React", "PostgreSQL", "Data Analytics"],
      topGaps: ["Kubernetes", "AWS Cloud Security", "Docker", "Embedded Linux", "System Design"],
      overallReadinessDistribution: {
        readyAbove85: "48%",
        moderate70to84: "38%",
        needsImprovementBelow70: "14%"
      }
    };
  },

  // Internship Tracking
  async getInternshipTracking() {
    const summary = {
      availableInternships: inMemoryInternships.length,
      studentsApplied: 232,
      studentsSelected: 23,
      studentsCurrentlyInterning: 18,
      completedInternships: 43
    };

    return {
      summary,
      internships: inMemoryInternships,
      studentTracking: [
        {
          studentName: "Priya Sharma",
          rollNumber: "AIST-2022-IT-108",
          department: "Information Technology",
          companyName: "DataPulse Analytics",
          role: "Backend Developer Intern",
          stage: "Internship Started", // Applied -> Selected -> Internship Started -> Completed
          stipend: "$1,200 / mo",
          duration: "6 Months",
          startDate: "2026-01-10",
          endDate: "2026-07-10",
          mentorAssigned: "Vikram Malhotra",
          attendanceVerified: true,
          midTermScore: "94 / 100"
        },
        {
          studentName: "Aisha Al-Mansoor",
          rollNumber: "AIST-2022-CS-144",
          department: "Computer Science & Engineering",
          companyName: "Fortress Cyber Defense",
          role: "Information Security Intern",
          stage: "Internship Started",
          stipend: "$1,400 / mo",
          duration: "6 Months",
          startDate: "2026-01-15",
          endDate: "2026-07-15",
          mentorAssigned: "Dr. Amanda Wright",
          attendanceVerified: true,
          midTermScore: "96 / 100"
        },
        {
          studentName: "Elena Rostova",
          rollNumber: "AIST-2023-AI-014",
          department: "AI & Data Science",
          companyName: "Synthetix AI Labs",
          role: "Machine Learning Intern",
          stage: "Selected",
          stipend: "$1,800 / mo",
          duration: "3 Months",
          startDate: "2026-05-15",
          endDate: "2026-08-15",
          mentorAssigned: "Pending Orientation",
          attendanceVerified: false,
          midTermScore: "-"
        },
        {
          studentName: "Alex Rivers",
          rollNumber: "AIST-2022-CS-041",
          department: "Computer Science & Engineering",
          companyName: "Distributed Software Labs",
          role: "Software Engineering Fellow",
          stage: "Completed",
          stipend: "$1,500 / mo",
          duration: "3 Months",
          startDate: "2025-06-01",
          endDate: "2025-08-31",
          mentorAssigned: "Danielle Stone",
          attendanceVerified: true,
          midTermScore: "98 / 100"
        },
        {
          studentName: "Devonte Jackson",
          rollNumber: "AIST-2022-EC-052",
          department: "Electronics & Communication",
          companyName: "Rivian / MicroGrid Tech",
          role: "Embedded Systems Intern",
          stage: "Applied",
          stipend: "$1,200 / mo",
          duration: "6 Months",
          startDate: "2026-06-01",
          endDate: "2026-11-30",
          mentorAssigned: "-",
          attendanceVerified: false,
          midTermScore: "-"
        }
      ]
    };
  },

  // Update Student Internship Stage
  async updateStudentInternshipStage(studentId, newStage) {
    const student = inMemoryStudents.find((s) => s.id === studentId);
    if (student) {
      student.internshipStatus = newStage === "Internship Started" ? "Interning" : newStage;
    }
    return { success: true, stage: newStage };
  },

  // Placement Tracking
  async getPlacementTracking() {
    const summary = {
      eligibleStudents: 1420,
      applicationsSubmitted: 3280,
      shortlisted: 540,
      interviewsConducted: 320,
      studentsSelected: 198,
      studentsPlaced: 384,
      placementPercentage: "91.4%",
      averagePackage: "$94,500 / yr",
      highestPackage: "$145,000 / yr"
    };

    const departmentPlacements = [
      { department: "Computer Science & Engineering", eligible: 540, placed: 502, rate: "93.0%", avgSalary: "$104,000", topCompany: "Apex Global" },
      { department: "Information Technology", eligible: 410, placed: 378, rate: "92.2%", avgSalary: "$98,000", topCompany: "DataPulse Analytics" },
      { department: "AI & Data Science", eligible: 180, placed: 168, rate: "93.3%", avgSalary: "$112,000", topCompany: "Synthetix AI" },
      { department: "Electronics & Communication", eligible: 220, placed: 186, rate: "84.5%", avgSalary: "$82,000", topCompany: "Qualcomm / MicroGrid" },
      { department: "Mechanical Engineering", eligible: 140, placed: 108, rate: "77.1%", avgSalary: "$76,000", topCompany: "Tesla / Bosch" },
      { department: "Management Studies (MBA)", eligible: 110, placed: 98, rate: "89.1%", avgSalary: "$92,000", topCompany: "Deloitte / KPMG" }
    ];

    return {
      summary,
      departmentPlacements,
      placementDrives: inMemoryPlacementDrives
    };
  },

  // Recruiter Connections
  async getRecruiterConnections() {
    return {
      recruiters: inMemoryRecruiterConnections,
      summary: {
        totalPartners: inMemoryRecruiterConnections.length,
        activeJobs: inMemoryRecruiterConnections.reduce((acc, r) => acc + r.activeJobsCount, 0),
        activeInternships: inMemoryRecruiterConnections.reduce((acc, r) => acc + r.activeInternshipsCount, 0),
        totalHires: inMemoryRecruiterConnections.reduce((acc, r) => acc + r.totalHires, 0),
        activePrograms: inMemoryRecruiterConnections.reduce((acc, r) => acc + r.activeProgramsCount, 0)
      }
    };
  },

  // Invite Recruiter / Submit Partnership
  async inviteRecruiter(inviteData) {
    const newId = `rec-${Date.now()}`;
    const newPartner = {
      id: newId,
      companyName: inviteData.companyName || "Invited Partner",
      industry: inviteData.industry || "Technology Services",
      website: inviteData.website || "https://example.com",
      recruiterName: inviteData.recruiterName || "Talent Lead",
      recruiterEmail: inviteData.recruiterEmail,
      activeJobsCount: 0,
      activeInternshipsCount: 0,
      applicationsCount: 0,
      totalHires: 0,
      activeProgramsCount: 1,
      mouStatus: "Invitation Sent / Pending MoU",
      partnershipLevel: "Prospective Campus Recruiter",
      lastVisit: "Invited Recently"
    };
    inMemoryRecruiterConnections.unshift(newPartner);
    return newPartner;
  },

  // Faculty Opportunities
  async getFacultyOpportunities() {
    return {
      opportunities: inMemoryFacultyOpportunities,
      categories: [
        "Faculty Internship",
        "Industrial Training",
        "FDP Programs",
        "Consultancy",
        "Research Projects",
        "Mentorship & Workshops",
        "Guest Lectures"
      ]
    };
  },

  // Submit Proposal / Register for Faculty Opportunity
  async applyFacultyOpportunity(id, facultyDetails) {
    const opp = inMemoryFacultyOpportunities.find((o) => o.id === id);
    if (!opp) return null;
    return {
      success: true,
      message: `Application submitted for "${opp.title}". The corporate sponsor has been notified.`,
      applicationId: `fac-app-${Date.now()}`
    };
  },

  // Industry Collaborations
  async getIndustryCollaborations() {
    return {
      collaborations: inMemoryIndustryCollaborations,
      types: [
        "Guest Lectures",
        "Workshops",
        "Mentorship",
        "Live Projects",
        "Innovation Challenges",
        "Industry Training",
        "Research Partnerships",
        "Certification Programs"
      ]
    };
  },

  // Propose New Collaboration
  async proposeCollaboration(data) {
    const newCollab = {
      id: `col-${Date.now()}`,
      title: data.title || "New Industry Collaboration",
      category: data.category || "Mentorship",
      partnerCompany: data.partnerCompany || "Corporate Partner",
      leadContact: data.leadContact || "Institutional Liaison",
      targetDepartments: data.targetDepartments || ["Computer Science & Engineering"],
      participatingStudentsCount: data.participatingStudentsCount || 30,
      status: "Proposed / Pending MoU",
      startDate: data.startDate || new Date().toISOString().split("T")[0],
      endDate: data.endDate || "2026-12-31",
      outcomes: data.outcomes || "Structured curriculum enhancement and industry mentorship.",
      mouReference: `MOU-AIST-${Date.now().toString().slice(-4)}`
    };
    inMemoryIndustryCollaborations.unshift(newCollab);
    return newCollab;
  },

  // Reports & Analytics
  async getReports(params = {}) {
    const { department = "all", course = "all", year = "all" } = params;

    const skillDistribution = [
      { category: "Web & Full Stack", proficiency: 84, studentShare: "76%" },
      { category: "Cloud & DevOps", proficiency: 68, studentShare: "42%" },
      { category: "Data Science & AI", proficiency: 86, studentShare: "58%" },
      { category: "Cybersecurity", proficiency: 65, studentShare: "28%" },
      { category: "Embedded Systems", proficiency: 72, studentShare: "34%" },
      { category: "Soft Skills & Leadership", proficiency: 88, studentShare: "94%" }
    ];

    const departmentComparisons = [
      { dept: "CSE", skillScore: 84, gapIndex: 22, placementRate: 93, internRate: 72 },
      { dept: "IT", skillScore: 81, gapIndex: 26, placementRate: 92, internRate: 68 },
      { dept: "AI & DS", skillScore: 88, gapIndex: 18, placementRate: 94, internRate: 80 },
      { dept: "ECE", skillScore: 73, gapIndex: 38, placementRate: 84, internRate: 54 },
      { dept: "Mechanical", skillScore: 68, gapIndex: 44, placementRate: 77, internRate: 46 },
      { dept: "MBA", skillScore: 78, gapIndex: 28, placementRate: 89, internRate: 74 }
    ];

    return {
      department,
      course,
      year,
      skillDistribution,
      departmentComparisons,
      placementTrends: [
        { year: "2023", placed: 320, highest: "$110k", avg: "$78k" },
        { year: "2024", placed: 348, highest: "$125k", avg: "$84k" },
        { year: "2025", placed: 366, highest: "$138k", avg: "$90k" },
        { year: "2026 (Ongoing)", placed: 384, highest: "$145k", avg: "$94k" }
      ]
    };
  },

  // Notifications
  async getNotifications() {
    return inMemoryNotifications;
  },

  async markNotificationRead(id) {
    const notif = inMemoryNotifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    return { success: true };
  },

  // College Profile
  async getProfile(userId) {
    if (dataStore.isMongoConnected()) {
      try {
        const found = await CollegeStaffProfile.findOne({ userId });
        if (found) return found;
      } catch (err) {
        console.warn("Mongo CollegeStaffProfile fallback:", err.message);
      }
    }

    return {
      institutionName: "Apex Institute of Science & Technology",
      institutionCode: "AIST-EDU-1049",
      accreditation: "NAAC A++ Grade · NBA Tier-1 · NIRF Top 40",
      affiliation: "Autonomous University System · Approved by AICTE / UGC",
      website: "https://aist.edu",
      campusAddress: "Innovation Park, Tech Corridor, Bengaluru / San Francisco",
      placementCellName: "Centre for Career Guidance, Corporate Relations & Placements (CGCR)",
      headOfPlacement: "Dr. Rajeshwar K. Sharma, Ph.D.",
      headTitle: "Dean - Industry Relations & Career Development",
      contactEmail: "staff@skillmap.demo",
      contactPhone: "+1 (555) 789-3210",
      establishedYear: "1998",
      totalStudents: 2486,
      placementRate: "91.4%",
      activeMoUs: 52,
      departments: [
        { name: "Computer Science & Engineering", code: "CSE", studentCount: 684, placementRate: "93%", hod: "Dr. Aruna Natarajan" },
        { name: "Information Technology", code: "IT", studentCount: 512, placementRate: "92%", hod: "Dr. Sandeep Verma" },
        { name: "AI & Data Science", code: "AIDS", studentCount: 392, placementRate: "94%", hod: "Dr. Christine Vance" },
        { name: "Electronics & Communication", code: "ECE", studentCount: 438, placementRate: "85%", hod: "Dr. Robert Langley" },
        { name: "Mechanical Engineering", code: "MECH", studentCount: 248, placementRate: "77%", hod: "Dr. Harish Kumar" },
        { name: "Management Studies", code: "MBA", studentCount: 212, placementRate: "89%", hod: "Dr. Neha Kapoor" }
      ],
      overview: "Premier technological and management institution focused on outcome-based education, continuous industry-aligned skill mapping, experiential capstone projects, and robust corporate placement ecosystems."
    };
  },

  async updateProfile(userId, updateData) {
    if (dataStore.isMongoConnected()) {
      try {
        return await CollegeStaffProfile.findOneAndUpdate(
          { userId },
          { ...updateData, userId },
          { new: true, upsert: true }
        );
      } catch (err) {
        console.warn("Mongo update CollegeStaffProfile fallback:", err.message);
      }
    }
    return { ...updateData, userId };
  }
};

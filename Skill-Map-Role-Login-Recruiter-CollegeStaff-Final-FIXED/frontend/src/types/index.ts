export type UserRole = 'student' | 'recruiter' | 'college_staff' | 'academician' | 'industry' | 'institution';

export type NavItemKey =
  | 'dashboard'
  | 'my-skills'
  | 'skill-gap'
  | 'jobs'
  | 'roadmap'
  | 'profile'
  | 'resume-upload'
  | 'platform-hub'
  | 'ai-assistant'
  | 'skill-assessment';

export interface UploadedResume {
  id: string;
  name: string;
  size: number;
  formattedSize: string;
  type: string;
  format: 'PDF' | 'DOCX';
  uploadedAt: string;
  status: 'uploaded' | 'ready_for_extraction' | 'extracted';
}

export interface UserProfile {
  role: UserRole;
  id: string;
  name: string;
  headline: string;
  email: string;
  phone?: string;
  education: string;
  degree: string;
  graduationYear: string;
  targetRole: string;
  department: string;
  experienceLevel: string;
  bio: string;
  location: string;
  careerInterests: string[];
  readinessScore: number;
  skillsCount: number;
  completedRoadmapModules: number;
  totalRoadmapModules: number;
}

export type SkillCategory =
  | 'Technical'
  | 'Domain Knowledge'
  | 'Tools & Systems'
  | 'Core & Collaborative'
  | 'Technical Skills'
  | 'Soft Skills'
  | 'Tools & Technologies'
  | 'Other Skills';

export type SkillStatus = 'Verified' | 'Self-Assessed' | 'Learning';
export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type SkillSource = 'resume' | 'manual' | 'resume_extracted' | 'manually_added';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  level: ProficiencyLevel;
  score: number; // 0 - 100
  targetScore: number; // 0 - 100
  status: SkillStatus;
  source?: SkillSource;
  isAiExtracted?: boolean;
  aiConfidence?: number; // 0 - 100
  confirmedByCandidate?: boolean;
  notes?: string;
  lastUpdated: string;
}

export interface SkillGapMetric {
  targetRole: string;
  overallMatchRate: number;
  criticalGapsCount: number;
  matchedCount: number;
  inProgressCount: number;
  averageGap?: number;
  skills: Array<{
    id: string;
    name: string;
    category: SkillCategory;
    currentScore: number;
    requiredScore: number;
    gap: number;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Met' | 'In Progress' | 'Action Needed';
  }>;
}

export interface OpportunityItem {
  id: string;
  title: string;
  organization: string; // neutral placeholder e.g. "Cloud Infrastructure Group"
  type: 'Full-time' | 'Internship' | 'Fellowship';
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  location: string;
  matchScore: number;
  stipendOrSalary: string;
  deadline: string;
  experienceLevel?: 'Internship / Student' | 'Entry Level (0-1 yrs)' | 'Associate (1-3 yrs)' | 'Mid-Level (3+ yrs)';
  requiredSkills?: string[];
  matchedSkills: string[];
  missingSkills: string[];
  description: string;
  responsibilities?: string[];
  perks?: string[];
  isBookmarked?: boolean;
  hasApplied?: boolean;
  isDemoData?: boolean;
}

export type RoadmapStage =
  | 'Foundation Skills'
  | 'Core Technical Skills'
  | 'Advanced Skills'
  | 'Projects & Practical Application'
  | 'Career Readiness';

export interface RoadmapLesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  stage?: RoadmapStage;
  stageNumber?: number;
  skillFocus: string;
  skillsGained?: string[];
  estimatedHours: number;
  completedHours: number;
  modulesCount: number;
  completedModules: number;
  status: 'Completed' | 'In Progress' | 'Not Started' | 'Upcoming';
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  lessons?: RoadmapLesson[];
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline' | 'info' | 'error';
export type BadgeSize = 'sm' | 'md';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

// Recruiter Portal Types
export interface RecruiterJob {
  id: string;
  _id?: string;
  title: string;
  company: string;
  location: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  salary: string;
  experienceLevel: string;
  education?: string;
  requiredSkills: string[];
  softSkills?: string[];
  preferredSkills?: string[];
  description: string;
  deadline?: string;
  status: 'Active' | 'Closed' | 'Draft';
  applicantsCount?: number;
  createdAt?: string;
}

export interface RecruiterInternship {
  id: string;
  _id?: string;
  title: string;
  company: string;
  duration: string;
  stipend: string;
  location: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  requiredSkills: string[];
  preferredSkills?: string[];
  eligibility: string;
  description: string;
  deadline?: string;
  status: 'Active' | 'Closed' | 'Draft';
  applicantsCount?: number;
  createdAt?: string;
}

export interface RecruiterProject {
  id: string;
  _id?: string;
  title: string;
  requiredSkills: string[];
  description: string;
  duration: string;
  teamSize: string;
  eligibility: string;
  expectedOutcome: string;
  status: 'Active' | 'Closed' | 'Draft';
  applicantsCount?: number;
  createdAt?: string;
}

export interface CandidateItem {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  targetRole: string;
  headline: string;
  bio?: string;
  education: string;
  institution?: string;
  graduationYear?: string;
  experienceLevel: string;
  location: string;
  workModePreference?: string;
  readinessScore: number;
  resumeAvailable?: boolean;
  resumeUrl?: string;
  skills: Array<{ name: string; category?: string; level?: string; score?: number }>;
  resumeExtractedSkills?: string[];
  assessments?: Array<{ skill: string; score: number; status: string; date?: string }>;
  projects?: Array<{ title: string; technologies: string[]; description: string; githubUrl?: string }>;
  certifications?: Array<{ name: string; issuer: string; year: string }>;
  internships?: Array<{ role: string; company: string; duration: string; description: string }>;
}

export interface MatchResult {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  matchScore: number;
  skillMatchPercentage: number;
  matchTier: string;
  matchedSkills: string[];
  missingSkills: string[];
  matchedSoftSkills?: string[];
  missingSoftSkills?: string[];
  matchedPreferredSkills?: string[];
  verifiedAssessmentsCount?: number;
  hasResume: boolean;
  readinessScore: number;
  education: string;
  location: string;
  explanation: string;
}

export interface RecruiterApplication {
  id: string;
  _id?: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateHeadline?: string;
  candidateLocation?: string;
  candidateEducation?: string;
  opportunityId: string;
  opportunityTitle: string;
  opportunityType: 'Job' | 'Internship' | 'Project';
  organization?: string;
  stage: 'Applied' | 'Reviewed' | 'Shortlisted' | 'Interview' | 'Selected' | 'Hired' | 'Rejected';
  status?: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  appliedAt: string;
  interviewDetails?: {
    scheduledAt: string;
    time: string;
    mode: string;
    interviewer: string;
    meetingLink?: string;
    notes?: string;
  };
  offerDetails?: {
    type: 'Internship' | 'Job';
    compensation: string;
    startDate: string;
    status: 'Offered' | 'Accepted' | 'Rejected' | 'Pending';
    notes?: string;
  };
  notes?: string;
}

export interface AcademiaCollaboration {
  id: string;
  _id?: string;
  title: string;
  type: 'Mentorship' | 'Workshop' | 'Guest Lecture' | 'Innovation Challenge' | 'Live Project' | 'Research' | 'Consultancy' | 'FDP' | 'Faculty Internship' | 'Industrial Training';
  organization: string;
  partnerInstitution: string;
  audience: 'Student' | 'Academician' | 'Institution' | 'All';
  seats: number;
  skills: string[];
  description: string;
  startDate: string;
  deadline: string;
  contactEmail: string;
  isActive: boolean;
  status: string;
  createdAt?: string;
}

export interface SkillDemandItem {
  name: string;
  category: string;
  demandPercentage: number;
  openRoleCount: number;
  trend: string;
  velocity: string;
}

export interface RecruiterNotification {
  id: string;
  title: string;
  message: string;
  type: 'application' | 'interview' | 'match' | 'offer' | 'collaboration';
  read: boolean;
  timestamp: string;
}

export interface RecruiterCompanyProfile {
  companyName: string;
  industry: string;
  website: string;
  companySize: string;
  headquarters: string;
  bio: string;
  culture: string;
  recruiterName: string;
  recruiterTitle: string;
  contactEmail: string;
  contactPhone: string;
  hiringLocations: string[];
  preferredWorkModes: string[];
}

// ==========================================
// COLLEGE STAFF & INSTITUTION TYPES
// ==========================================

export interface DepartmentStat {
  department: string;
  total: number;
  assessed: number;
  placed: number;
  readiness: number;
  averageScore: number;
}

export interface CollegeStaffOverview {
  totalStudents: number;
  studentsAssessed: number;
  studentsPlacementReady: number;
  placementReadyPercentage: number;
  activeInternships: number;
  studentsInInternship: number;
  studentsPlaced: number;
  placementRatePercentage: string;
  industryPartners: number;
  skillGapAlerts: number;
  departmentStats: DepartmentStat[];
}

export interface StudentSkill {
  name: string;
  category: string;
  level: string;
  score: number;
}

export interface StudentSkillGap {
  skill: string;
  severity: 'Low' | 'Medium' | 'Critical' | 'High';
  currentScore: number;
  requiredScore: number;
  recommendation: string;
}

export interface StudentProject {
  title: string;
  technologies: string[];
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  verified: boolean;
}

export interface StudentCertification {
  name: string;
  issuer: string;
  year: string;
  verified: boolean;
}

export interface StudentInternship {
  role: string;
  company: string;
  duration: string;
  status: string;
  description?: string;
}

export interface InstitutionStudent {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone?: string;
  course: string;
  department: string;
  graduationYear: string;
  currentSemester: string;
  cgpa: number;
  assessmentStatus: 'Completed' | 'In Progress' | 'Pending';
  skillScore: number;
  skillGap: 'Low' | 'Medium' | 'Critical';
  certificationsCount: number;
  projectsCount: number;
  internshipStatus: 'Interning' | 'Applied' | 'Selected' | 'Completed' | 'Not Started';
  placementStatus: 'Placed' | 'Interviewing' | 'Shortlisted' | 'Eligible' | 'Not Eligible';
  placedCompany?: string | null;
  packageCTC?: string | null;
  resumeStatus: 'Verified' | 'Uploaded' | 'Pending';
  readinessScore: number;
  targetRole: string;
  skills: StudentSkill[];
  skillGaps: StudentSkillGap[];
  projects: StudentProject[];
  certifications: StudentCertification[];
  internships: StudentInternship[];
}

export interface SkillIntelligenceItem {
  skill: string;
  studentCount: number;
  demand: 'High' | 'Medium' | 'Emerging';
  gap: 'Low' | 'Medium' | 'High' | 'Critical';
  avgScore: number;
  targetScore: number;
  benchmark: string;
}

export interface CriticalSkillGapAlert {
  skill: string;
  affectedCount: number;
  department: string;
  priority: 'Urgent' | 'High' | 'Medium';
  recommendedAction: string;
}

export interface InternshipTrackingItem {
  id: string;
  title: string;
  companyName: string;
  department: string;
  duration: string;
  stipend: string;
  workMode: string;
  location: string;
  appliedCount: number;
  selectedCount: number;
  currentlyInterning: number;
  completedCount: number;
  status: string;
}

export interface StudentInternshipTracking {
  studentName: string;
  rollNumber: string;
  department: string;
  companyName: string;
  role: string;
  stage: 'Applied' | 'Selected' | 'Internship Started' | 'Completed';
  stipend: string;
  duration: string;
  startDate: string;
  endDate: string;
  mentorAssigned: string;
  attendanceVerified: boolean;
  midTermScore: string;
}

export interface PlacementSummary {
  eligibleStudents: number;
  applicationsSubmitted: number;
  shortlisted: number;
  interviewsConducted: number;
  studentsSelected: number;
  studentsPlaced: number;
  placementPercentage: string;
  averagePackage: string;
  highestPackage: string;
}

export interface DepartmentPlacement {
  department: string;
  eligible: number;
  placed: number;
  rate: string;
  avgSalary: string;
  topCompany: string;
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  role: string;
  type: string;
  packageCTC: string;
  eligibleDepartments: string[];
  minCgpa: number;
  driveDate: string;
  status: 'Scheduled' | 'Active' | 'Completed';
  appliedCount: number;
  shortlistedCount: number;
  interviewedCount: number;
  selectedCount: number;
  location: string;
}

export interface ConnectedRecruiter {
  id: string;
  companyName: string;
  industry: string;
  website: string;
  recruiterName: string;
  recruiterEmail: string;
  activeJobsCount: number;
  activeInternshipsCount: number;
  applicationsCount: number;
  totalHires: number;
  activeProgramsCount: number;
  mouStatus: string;
  partnershipLevel: string;
  lastVisit: string;
}

export interface FacultyOpportunity {
  id: string;
  title: string;
  type: 'Faculty Internship' | 'Industrial Training' | 'FDP Programs' | 'Consultancy' | 'Research Projects' | 'Mentorship & Workshops' | 'Guest Lectures';
  organization: string;
  discipline?: string;
  department?: string;
  duration: string;
  modality?: string;
  mode?: string;
  grantAmount: string;
  eligibility?: string;
  deadline: string;
  status: string;
  description: string;
}

export interface IndustryCollaborationItem {
  id: string;
  title: string;
  category: string;
  partnerCompany: string;
  leadContact: string;
  targetDepartments: string[];
  participatingStudentsCount: number;
  status: string;
  startDate: string;
  endDate: string;
  outcomes: string;
  mouReference: string;
}

export interface CollegeStaffNotification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'placement' | 'recruiter' | 'faculty' | 'internship' | 'drive';
  category?: string;
  read: boolean;
  timestamp: string;
}

export interface CollegeProfileData {
  institutionName: string;
  institutionCode: string;
  accreditation: string;
  affiliation?: string;
  website?: string;
  campusAddress?: string;
  address?: string;
  placementCellName: string;
  headOfPlacement: string;
  headTitle: string;
  contactEmail: string;
  contactPhone?: string;
  phone?: string;
  establishedYear?: string;
  totalStudents?: number;
  placementRate?: string;
  activeMoUs?: number;
  departments?: {
    name: string;
    code?: string;
    studentCount?: number;
    intake?: number;
    programs?: string[];
    placementRate?: string;
    hod?: string;
  }[];
  overview: string;
}

export interface CollegeReportsAnalytics {
  placementTrendsOverTime: { year: string; placed: number; avgSalary: string; placementRate: string }[];
  topRecruitingCompanies: { name: string; hires: number; avgPackage: string; roles: string }[];
  readinessDistribution: {
    readyAbove85: string;
    moderate70to84: string;
    needsImprovementBelow70: string;
  };
}



import React, { useState, useEffect, useMemo } from 'react';
import {
  BriefcaseBusiness,
  Users,
  Search,
  Plus,
  Bell,
  LogOut,
  BarChart3,
  Handshake,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  Filter,
  Eye,
  Send,
  Building,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  UserCheck,
  AlertCircle,
  FileText,
  Video,
  Award,
  BookOpen,
  Code,
  Layers,
  X,
  Edit2,
  Trash2,
  Check,
  Building2,
  MapPin,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { recruiterApi, OverviewData } from '../services/recruiterApi';
import {
  RecruiterJob,
  RecruiterInternship,
  RecruiterProject,
  CandidateItem,
  MatchResult,
  RecruiterApplication,
  AcademiaCollaboration,
  SkillDemandItem,
  RecruiterNotification,
  RecruiterCompanyProfile
} from '../types';

type RecruiterTab =
  | 'overview'
  | 'jobs'
  | 'internships'
  | 'projects'
  | 'candidates'
  | 'matching'
  | 'pipeline'
  | 'interviews'
  | 'offers'
  | 'collaboration'
  | 'analytics'
  | 'profile';

export const RecruiterDashboardView: React.FC = () => {
  const { user, logout } = useApp();
  const [activeTab, setActiveTab] = useState<RecruiterTab>('overview');

  // Core Data States
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [internships, setInternships] = useState<RecruiterInternship[]>([]);
  const [projects, setProjects] = useState<RecruiterProject[]>([]);
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [applications, setApplications] = useState<RecruiterApplication[]>([]);
  const [collaborations, setCollaborations] = useState<AcademiaCollaboration[]>([]);
  const [skillDemand, setSkillDemand] = useState<SkillDemandItem[]>([]);
  const [notifications, setNotifications] = useState<RecruiterNotification[]>([]);
  const [profile, setProfile] = useState<RecruiterCompanyProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search & Filter States
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');
  const [minReadiness, setMinReadiness] = useState<number>(0);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateItem | null>(null);
  const [filterCertOnly, setFilterCertOnly] = useState(false);
  const [filterInternshipOnly, setFilterInternshipOnly] = useState(false);

  // Matching Engine States
  const [matchingJobId, setMatchingJobId] = useState<string>('');
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  // Modals & Action States
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isPostInternshipModalOpen, setIsPostInternshipModalOpen] = useState(false);
  const [isPostProjectModalOpen, setIsPostProjectModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isCollaborationModalOpen, setIsCollaborationModalOpen] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  // Selected Target for Action Modals
  const [targetApplication, setTargetApplication] = useState<RecruiterApplication | null>(null);
  const [targetCandidateForAction, setTargetCandidateForAction] = useState<{ id: string; name: string; email?: string } | null>(null);

  // Form states for posting
  const [newJob, setNewJob] = useState({
    title: '',
    workMode: 'Hybrid' as 'On-site' | 'Hybrid' | 'Remote',
    employmentType: 'Full-time' as 'Full-time' | 'Part-time' | 'Contract',
    location: 'San Francisco, CA',
    salary: '$95,000 - $115,000 / yr',
    experienceLevel: 'Entry Level (0-2 yrs)',
    requiredSkills: 'TypeScript, React, Node.js, PostgreSQL',
    softSkills: 'Communication, Problem Solving, Agile',
    preferredSkills: 'Docker, AWS',
    description: 'We are seeking a proactive engineer to build modern cloud applications and collaborate on full-stack architecture.',
    deadline: '2026-04-30'
  });

  const [newInternship, setNewInternship] = useState({
    title: '',
    duration: '12 Weeks',
    stipend: '$4,500 / month',
    location: 'Remote',
    workMode: 'Remote' as 'On-site' | 'Hybrid' | 'Remote',
    requiredSkills: 'TypeScript, React, Node.js, Git',
    preferredSkills: 'PostgreSQL, Docker',
    eligibility: 'Penultimate or final-year engineering students',
    description: '12-week mentored software engineering internship with senior staff architects.',
    deadline: '2026-04-15'
  });

  const [newProject, setNewProject] = useState({
    title: '',
    requiredSkills: 'TypeScript, Node.js, Docker',
    duration: '8 Weeks',
    teamSize: '3-4 Students',
    eligibility: 'Pre-final and final-year CS/IT students',
    expectedOutcome: 'Tested production-ready microservice module with GitHub documentation.',
    description: 'Architect a containerized telemetry queue with automated data validation and metrics logging.'
  });

  const [newInterview, setNewInterview] = useState({
    date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    time: '10:00 AM',
    mode: 'Google Meet',
    interviewer: user.name || 'Technical Talent Lead',
    meetingLink: 'https://meet.google.com/skm-rec-interview',
    notes: 'Technical architecture review and project discussion.'
  });

  const [newOffer, setNewOffer] = useState({
    offerType: 'Job' as 'Job' | 'Internship',
    compensation: '$105,000 / yr',
    startDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    notes: 'Standard full-time offer including health benefits, continuous learning stipend, and equity package.'
  });

  const [newCollaboration, setNewCollaboration] = useState({
    title: '',
    type: 'Mentorship' as AcademiaCollaboration['type'],
    partnerInstitution: 'All Partner Engineering Colleges',
    audience: 'Student' as AcademiaCollaboration['audience'],
    seats: 40,
    skills: 'Cloud Architecture, TypeScript, System Design',
    description: 'Industry engineers mentor student cohorts for 8 weeks with technical design sessions and mock interviews.',
    startDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  });

  const [editProfile, setEditProfile] = useState<RecruiterCompanyProfile>({
    companyName: 'Apex Global Technologies',
    industry: 'Cloud Infrastructure & Enterprise Systems',
    website: 'https://apextechnologies.io',
    companySize: '250-500 Employees',
    headquarters: 'San Francisco, CA & Distributed',
    bio: 'Apex Global Technologies engineers enterprise developer platforms, distributed cloud microservices, and AI-accelerated data systems.',
    culture: 'Autonomous engineering teams, high empathy, continuous learning stipend, and collaborative problem solving.',
    recruiterName: user.name || 'Sarah Jenkins',
    recruiterTitle: 'Senior Technical Talent Acquisition Partner',
    contactEmail: user.email || 'recruiter@skillmap.demo',
    contactPhone: '+1 (555) 438-9201',
    hiringLocations: ['San Francisco, CA', 'Austin, TX', 'Remote'],
    preferredWorkModes: ['Hybrid', 'Remote', 'On-site']
  });

  // Load All Recruiter Data from Backend
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        overviewRes,
        jobsRes,
        internshipsRes,
        projectsRes,
        candidatesRes,
        appsRes,
        collabsRes,
        demandRes,
        notifsRes,
        profileRes
      ] = await Promise.all([
        recruiterApi.getOverview().catch(() => null),
        recruiterApi.getJobs().catch(() => ({ jobs: [] })),
        recruiterApi.getInternships().catch(() => ({ internships: [] })),
        recruiterApi.getProjects().catch(() => ({ projects: [] })),
        recruiterApi.searchCandidates().catch(() => ({ candidates: [] })),
        recruiterApi.getApplications().catch(() => ({ applications: [] })),
        recruiterApi.getCollaborations().catch(() => ({ collaborations: [] })),
        recruiterApi.getSkillDemand().catch(() => ({ skillDemand: [] })),
        recruiterApi.getNotifications().catch(() => ({ notifications: [], unreadCount: 0 })),
        recruiterApi.getProfile().catch(() => null)
      ]);

      if (overviewRes) setOverview(overviewRes);
      if (jobsRes?.jobs) {
        setJobs(jobsRes.jobs);
        if (jobsRes.jobs.length > 0 && !matchingJobId) {
          setMatchingJobId(jobsRes.jobs[0].id || jobsRes.jobs[0]._id || '');
        }
      }
      if (internshipsRes?.internships) setInternships(internshipsRes.internships);
      if (projectsRes?.projects) setProjects(projectsRes.projects);
      if (candidatesRes?.candidates) setCandidates(candidatesRes.candidates);
      if (appsRes?.applications) setApplications(appsRes.applications);
      if (collabsRes?.collaborations) setCollaborations(collabsRes.collaborations);
      if (demandRes?.skillDemand) setSkillDemand(demandRes.skillDemand);
      if (notifsRes?.notifications) setNotifications(notifsRes.notifications);
      if (profileRes?.profile) {
        setProfile(profileRes.profile);
        setEditProfile(profileRes.profile);
      }
    } catch (err: any) {
      console.warn('Recruiter dashboard data initialization:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Trigger AI Matching when matchingJobId changes
  const runMatching = async (jobId: string) => {
    const job = jobs.find((j) => (j.id === jobId || j._id === jobId));
    if (!job) return;

    setIsMatchingLoading(true);
    try {
      const res = await recruiterApi.matchCandidates({
        requiredSkills: job.requiredSkills || [],
        softSkills: job.softSkills || [],
        preferredSkills: job.preferredSkills || [],
        targetRole: job.title
      });
      if (res?.matches) {
        setMatchResults(res.matches);
      }
    } catch (err) {
      console.warn('AI Matching error:', err);
    } finally {
      setIsMatchingLoading(false);
    }
  };

  useEffect(() => {
    if (matchingJobId && jobs.length > 0) {
      runMatching(matchingJobId);
    }
  }, [matchingJobId, jobs]);

  // Notifications
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const handleMarkNotifRead = async (id: string) => {
    try {
      await recruiterApi.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (e) {
      console.warn(e);
    }
  };

  // Status message helper
  const showFlash = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Action: Create Job
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title.trim()) return;
    try {
      const res = await recruiterApi.createJob({
        ...newJob,
        requiredSkills: newJob.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        softSkills: newJob.softSkills.split(',').map((s) => s.trim()).filter(Boolean),
        preferredSkills: newJob.preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        status: 'Active'
      });
      if (res.job) {
        setJobs((prev) => [res.job, ...prev]);
        setIsPostJobModalOpen(false);
        showFlash(`Job "${newJob.title}" posted successfully!`);
        setNewJob({ ...newJob, title: '' });
      }
    } catch (err: any) {
      showFlash(err.message || 'Failed to post job', 'error');
    }
  };

  // Action: Create Internship
  const handleCreateInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternship.title.trim()) return;
    try {
      const res = await recruiterApi.createInternship({
        ...newInternship,
        requiredSkills: newInternship.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        preferredSkills: newInternship.preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        status: 'Active'
      });
      if (res.internship) {
        setInternships((prev) => [res.internship, ...prev]);
        setIsPostInternshipModalOpen(false);
        showFlash(`Internship "${newInternship.title}" posted successfully!`);
        setNewInternship({ ...newInternship, title: '' });
      }
    } catch (err: any) {
      showFlash(err.message || 'Failed to post internship', 'error');
    }
  };

  // Action: Create Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    try {
      const res = await recruiterApi.createProject({
        ...newProject,
        requiredSkills: newProject.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        status: 'Active'
      });
      if (res.project) {
        setProjects((prev) => [res.project, ...prev]);
        setIsPostProjectModalOpen(false);
        showFlash(`Live Industry Project "${newProject.title}" published!`);
        setNewProject({ ...newProject, title: '' });
      }
    } catch (err: any) {
      showFlash(err.message || 'Failed to publish project', 'error');
    }
  };

  // Action: Move Application Stage
  const handleMoveStage = async (appId: string, stage: RecruiterApplication['stage']) => {
    try {
      const res = await recruiterApi.updateApplicationStage(appId, stage);
      if (res.application) {
        setApplications((prev) => prev.map((a) => (a.id === appId ? res.application : a)));
        showFlash(`Candidate updated to stage: ${stage}`);
      }
    } catch (err: any) {
      showFlash(err.message || 'Could not update stage', 'error');
    }
  };

  // Action: Schedule Interview
  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCandidateForAction) return;
    try {
      const oppTitle = targetApplication?.opportunityTitle || jobs[0]?.title || 'Cloud Engineering Role';
      const oppId = targetApplication?.opportunityId || jobs[0]?.id || 'job-101';

      await recruiterApi.scheduleInterview({
        candidateId: targetCandidateForAction.id,
        candidateName: targetCandidateForAction.name,
        candidateEmail: targetCandidateForAction.email,
        opportunityId: oppId,
        opportunityTitle: oppTitle,
        ...newInterview
      });

      // Update application stage locally
      if (targetApplication) {
        handleMoveStage(targetApplication.id, 'Interview');
      }

      setIsInterviewModalOpen(false);
      showFlash(`Interview scheduled with ${targetCandidateForAction.name} on ${newInterview.date}!`);
      loadData();
    } catch (err: any) {
      showFlash(err.message || 'Failed to schedule interview', 'error');
    }
  };

  // Action: Send Offer
  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCandidateForAction) return;
    try {
      const oppTitle = targetApplication?.opportunityTitle || jobs[0]?.title || 'Cloud Engineering Role';
      const oppId = targetApplication?.opportunityId || jobs[0]?.id || 'job-101';

      await recruiterApi.sendOffer({
        candidateId: targetCandidateForAction.id,
        candidateName: targetCandidateForAction.name,
        candidateEmail: targetCandidateForAction.email,
        opportunityId: oppId,
        opportunityTitle: oppTitle,
        ...newOffer
      });

      if (targetApplication) {
        handleMoveStage(targetApplication.id, 'Selected');
      }

      setIsOfferModalOpen(false);
      showFlash(`${newOffer.offerType} offer sent to ${targetCandidateForAction.name}!`);
      loadData();
    } catch (err: any) {
      showFlash(err.message || 'Failed to send offer', 'error');
    }
  };

  // Action: Create Collaboration
  const handleCreateCollaboration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollaboration.title.trim()) return;
    try {
      const res = await recruiterApi.createCollaboration({
        ...newCollaboration,
        skills: newCollaboration.skills.split(',').map((s) => s.trim()).filter(Boolean),
        status: 'Active',
        isActive: true
      });
      if (res.collaboration) {
        setCollaborations((prev) => [res.collaboration, ...prev]);
        setIsCollaborationModalOpen(false);
        showFlash(`Collaboration "${newCollaboration.title}" published!`);
        setNewCollaboration({ ...newCollaboration, title: '' });
      }
    } catch (err: any) {
      showFlash(err.message || 'Failed to publish collaboration', 'error');
    }
  };

  // Action: Update Profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await recruiterApi.updateProfile(editProfile);
      if (res.profile) {
        setProfile(res.profile);
        showFlash('Company and Recruiter profile saved!');
      }
    } catch (err: any) {
      showFlash(err.message || 'Failed to update profile', 'error');
    }
  };

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const query = candidateSearch.toLowerCase();
      const matchesSearch =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        (c.targetRole || '').toLowerCase().includes(query) ||
        (c.skills || []).some((s) => s.name.toLowerCase().includes(query));

      const matchesSkill =
        !selectedSkillFilter ||
        (c.skills || []).some((s) => s.name.toLowerCase().includes(selectedSkillFilter.toLowerCase())) ||
        (c.resumeExtractedSkills || []).some((s) => s.toLowerCase().includes(selectedSkillFilter.toLowerCase()));

      const matchesScore = !minReadiness || (c.readinessScore || 0) >= minReadiness;
      const matchesCert = !filterCertOnly || (c.certifications || []).length > 0;
      const matchesIntern = !filterInternshipOnly || (c.internships || []).length > 0;

      return matchesSearch && matchesSkill && matchesScore && matchesCert && matchesIntern;
    });
  }, [candidates, candidateSearch, selectedSkillFilter, minReadiness, filterCertOnly, filterInternshipOnly]);

  // Navigation Items
  const navItems = [
    { key: 'overview', label: 'Overview', icon: BarChart3, badge: null },
    { key: 'jobs', label: 'Job Postings', icon: BriefcaseBusiness, badge: jobs.length },
    { key: 'internships', label: 'Internships', icon: Clock, badge: internships.length },
    { key: 'projects', label: 'Industry Projects', icon: Code, badge: projects.length },
    { key: 'candidates', label: 'Candidate Finder', icon: Users, badge: candidates.length },
    { key: 'matching', label: 'AI Match Engine', icon: Sparkles, badge: 'AI' },
    { key: 'pipeline', label: 'Recruitment Pipeline', icon: Layers, badge: applications.length },
    { key: 'interviews', label: 'Interviews & Schedule', icon: Calendar, badge: overview?.interviewsScheduled || 0 },
    { key: 'offers', label: 'Offers & Hiring', icon: Award, badge: overview?.candidatesHired || 0 },
    { key: 'collaboration', label: 'Academia Collaboration', icon: Handshake, badge: collaborations.length },
    { key: 'analytics', label: 'Skill Demand Analytics', icon: TrendingUp, badge: null },
    { key: 'profile', label: 'Company Profile', icon: Building2, badge: null }
  ] as const;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased">
      {/* Recruiter Portal Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <BriefcaseBusiness className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">Skill Map</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  Recruiter Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Industry Talent Acquisition &amp; University Partnership Workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="relative p-2 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <span className="text-sm font-bold text-white">Recruitment Notifications</span>
                    <span className="text-xs text-blue-400 font-medium">{unreadCount} unread</span>
                  </div>
                  <div className="divide-y divide-slate-700/60 max-h-80 overflow-y-auto mt-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkNotifRead(n.id)}
                        className={`py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                          n.read ? 'text-slate-400 hover:bg-slate-700/40' : 'bg-slate-700/30 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-white">
                          <span>{n.title}</span>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-blue-400"></span>}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">{n.message}</p>
                        <span className="text-[9px] text-slate-500 block mt-1">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recruiter User Details */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">{profile?.recruiterName || user.name || 'Recruiter'}</span>
              <span className="text-[10px] text-slate-400">{profile?.companyName || 'Apex Technologies'}</span>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-rose-950/40 hover:border-rose-800/50 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Flash Status Banner */}
      {statusMessage && (
        <div className={`px-4 py-2 text-center text-xs font-medium ${
          statusMessage.type === 'success' ? 'bg-emerald-950/80 border-b border-emerald-800 text-emerald-300' : 'bg-rose-950/80 border-b border-rose-800 text-rose-300'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Navigation Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-slate-800/70 border border-slate-800 rounded-2xl p-2.5 backdrop-blur-sm sticky top-22">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Recruiter Modules
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveTab(item.key as RecruiterTab)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        active
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== null && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            active ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Actions Card */}
              <div className="mt-4 pt-3 border-t border-slate-700/60 px-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Publish Fast</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsPostJobModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Job
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPostInternshipModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Intern
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Body View */}
          <main className="flex-1 min-w-0">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800/60 p-8">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold text-slate-200">Loading recruiter workspace...</p>
                <p className="text-xs text-slate-500 mt-1">Connecting to talent acquisition services</p>
              </div>
            )}

            {!isLoading && statusMessage?.type === 'error' && !overview && (
              <div className="bg-rose-950/30 border border-rose-800/50 rounded-2xl p-8 text-center max-w-lg mx-auto my-12">
                <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">Unable to load data</h3>
                <p className="text-xs text-slate-400 mt-1 mb-5">{statusMessage.text}</p>
                <button
                  type="button"
                  onClick={loadData}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {!isLoading && (overview || statusMessage?.type !== 'error') && (
              <>
                {/* 1. OVERVIEW VIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-white">Talent Acquisition Dashboard</h1>
                      <p className="text-xs text-slate-400 mt-1">
                        Manage active hiring campaigns, candidate pipelines, and university partnerships.
                      </p>
                    </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                  {[
                    { label: 'Active Jobs', value: jobs.filter((j) => j.status === 'Active').length, icon: BriefcaseBusiness, color: 'text-blue-400' },
                    { label: 'Internships', value: internships.filter((i) => i.status === 'Active').length, icon: Clock, color: 'text-purple-400' },
                    { label: 'Applications', value: applications.length, icon: Users, color: 'text-emerald-400' },
                    { label: 'Shortlisted', value: applications.filter((a) => (a.stage || '').includes('Shortlist')).length, icon: UserCheck, color: 'text-amber-400' },
                    { label: 'Interviews', value: applications.filter((a) => (a.stage || '').includes('Interview')).length, icon: Calendar, color: 'text-cyan-400' },
                    { label: 'Offers / Hires', value: applications.filter((a) => (a.stage || '').includes('Selected') || (a.stage || '').includes('Hired')).length, icon: Award, color: 'text-rose-400' },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.label} className="bg-slate-800/80 border border-slate-800 rounded-2xl p-4">
                        <div className="flex items-center justify-between text-slate-400 mb-2">
                          <span className="text-xs font-medium">{m.label}</span>
                          <Icon className={`w-4 h-4 ${m.color}`} />
                        </div>
                        <div className="text-2xl font-bold text-white">{m.value}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Pipeline Flow Visualization */}
                <div className="bg-slate-800/80 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-bold text-white">Recruitment Pipeline Stages</h2>
                      <p className="text-xs text-slate-400">Real-time candidate movement across stages</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('pipeline')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      Open Pipeline <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { name: 'Applied', count: applications.filter((a) => a.stage === 'Applied').length, color: 'bg-blue-500' },
                      { name: 'Reviewed', count: applications.filter((a) => a.stage === 'Reviewed').length, color: 'bg-indigo-500' },
                      { name: 'Shortlisted', count: applications.filter((a) => a.stage === 'Shortlisted').length, color: 'bg-amber-500' },
                      { name: 'Interview', count: applications.filter((a) => a.stage === 'Interview').length, color: 'bg-purple-500' },
                      { name: 'Selected', count: applications.filter((a) => a.stage === 'Selected').length, color: 'bg-cyan-500' },
                      { name: 'Hired', count: applications.filter((a) => a.stage === 'Hired').length, color: 'bg-emerald-500' },
                    ].map((step) => (
                      <div key={step.name} className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-3 text-center">
                        <div className="text-lg font-bold text-white">{step.count}</div>
                        <div className="text-[11px] font-medium text-slate-300 mt-0.5">{step.name}</div>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full ${step.color} rounded-full`}
                            style={{ width: `${Math.min(100, (step.count / Math.max(1, applications.length)) * 100 * 2)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Two Column Section: Recent Applications & Top Market Skills */}
                <div className="grid lg:grid-cols-2 gap-5">
                  {/* Recent Applications */}
                  <div className="bg-slate-800/80 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-bold text-white">Recent Candidate Applications</h2>
                      <button
                        type="button"
                        onClick={() => setActiveTab('pipeline')}
                        className="text-xs text-blue-400 font-medium hover:underline"
                      >
                        View all
                      </button>
                    </div>
                    <div className="divide-y divide-slate-700/50">
                      {applications.slice(0, 4).map((app) => (
                        <div key={app.id} className="py-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{app.candidateName}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                {app.stage}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{app.opportunityTitle}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-emerald-400">{app.matchScore}% Match</span>
                            <span className="text-[10px] text-slate-500 block">
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skill Demand Pulse */}
                  <div className="bg-slate-800/80 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-bold text-white">Industry Skill Demand Benchmark</h2>
                      <button
                        type="button"
                        onClick={() => setActiveTab('analytics')}
                        className="text-xs text-blue-400 font-medium hover:underline"
                      >
                        Detailed report
                      </button>
                    </div>
                    <div className="space-y-3">
                      {skillDemand.slice(0, 5).map((item) => (
                        <div key={item.name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-200 font-medium">{item.name}</span>
                            <span className="text-blue-400 font-bold">{item.demandPercentage}% Demand</span>
                          </div>
                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${item.demandPercentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. JOB POSTINGS VIEW */}
            {activeTab === 'jobs' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-white">Full-Time &amp; Graduate Job Postings</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Publish open engineering roles with structured technical and soft skill benchmarks.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPostJobModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Post New Job
                  </button>
                </div>

                <div className="grid gap-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="bg-slate-800/80 border border-slate-800 rounded-2xl p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h2 className="text-base font-bold text-white">{job.title}</h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {job.status}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-700 text-slate-300">
                              {job.employmentType}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> {job.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location} ({job.workMode})</span>
                            <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>
                            <span>Exp: {job.experienceLevel}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setMatchingJobId(job.id || job._id || '');
                              setActiveTab('matching');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Run AI Match
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTargetCandidateForAction({ id: '', name: 'Selected Candidate' });
                              setActiveTab('pipeline');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-700/60 border border-slate-600 text-slate-200 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
                          >
                            Pipeline ({job.applicantsCount || 0})
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-3">{job.description}</p>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-400 mr-1">Required Skills:</span>
                        {(job.requiredSkills || []).map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-700 text-[11px] text-blue-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. INTERNSHIPS VIEW */}
            {activeTab === 'internships' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-white">Engineering &amp; Research Internships</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Publish structured 8-16 week student internships with monthly stipends and mentors.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPostInternshipModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Post Internship
                  </button>
                </div>

                <div className="grid gap-4">
                  {internships.map((intn) => (
                    <div key={intn.id} className="bg-slate-800/80 border border-slate-800 rounded-2xl p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-white">{intn.title}</h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {intn.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                            <span>Duration: {intn.duration}</span>
                            <span className="text-purple-300 font-semibold">Stipend: {intn.stipend}</span>
                            <span>{intn.location} ({intn.workMode})</span>
                            <span>Eligibility: {intn.eligibility}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setMatchingJobId(intn.id || intn._id || '');
                            setActiveTab('matching');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Match Students
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 mt-2 mb-3">{intn.description}</p>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-400 mr-1">Skills:</span>
                        {(intn.requiredSkills || []).map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-700 text-[11px] text-purple-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. LIVE INDUSTRY PROJECTS VIEW */}
            {activeTab === 'projects' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-white">Live Industry Capstones &amp; Projects</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Sponsor real-world engineering problems for university student teams.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPostProjectModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Sponsor Project
                  </button>
                </div>

                <div className="grid gap-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-slate-800/80 border border-slate-800 rounded-2xl p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-white">{proj.title}</h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                              {proj.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                            <span>Duration: {proj.duration}</span>
                            <span>Team: {proj.teamSize}</span>
                            <span>Eligibility: {proj.eligibility}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-2 mb-2">{proj.description}</p>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs text-slate-300 mb-3">
                        <strong className="text-cyan-400">Expected Deliverable:</strong> {proj.expectedOutcome}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-400 mr-1">Tech Stack:</span>
                        {(proj.requiredSkills || []).map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-700 text-[11px] text-cyan-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. CANDIDATE FINDER VIEW */}
            {activeTab === 'candidates' && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-xl font-bold text-white">Student Candidate Finder</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Search and filter candidates by verified competencies, readiness scores, and projects.
                  </p>
                </div>

                {/* Filter Toolbar */}
                <div className="bg-slate-800/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="relative sm:col-span-2">
                      <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={candidateSearch}
                        onChange={(e) => setCandidateSearch(e.target.value)}
                        placeholder="Search by student name, email, target role, or skills..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <select
                      value={selectedSkillFilter}
                      onChange={(e) => setSelectedSkillFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Filter by Skill (All)</option>
                      <option value="TypeScript">TypeScript</option>
                      <option value="React">React</option>
                      <option value="Node.js">Node.js</option>
                      <option value="Python">Python</option>
                      <option value="Docker">Docker</option>
                      <option value="AWS">AWS</option>
                      <option value="PostgreSQL">PostgreSQL</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterCertOnly}
                        onChange={(e) => setFilterCertOnly(e.target.checked)}
                        className="rounded border-slate-700 text-blue-600 focus:ring-0"
                      />
                      <span>Verified Certifications</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterInternshipOnly}
                        onChange={(e) => setFilterInternshipOnly(e.target.checked)}
                        className="rounded border-slate-700 text-blue-600 focus:ring-0"
                      />
                      <span>Prior Internship Experience</span>
                    </label>

                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-slate-400">Min Readiness:</span>
                      <select
                        value={minReadiness}
                        onChange={(e) => setMinReadiness(Number(e.target.value))}
                        className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value={0}>Any Score</option>
                        <option value={80}>80%+ Ready</option>
                        <option value={85}>85%+ Ready</option>
                        <option value={90}>90%+ Ready</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Candidate Cards Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredCandidates.map((c) => (
                    <div key={c.id} className="bg-slate-800/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 font-bold flex items-center justify-center text-sm">
                              {c.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <h2 className="text-sm font-bold text-white">{c.name}</h2>
                              <p className="text-xs text-blue-400">{c.targetRole}</p>
                              <span className="text-[11px] text-slate-400">{c.education}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-base font-bold text-emerald-400">{c.readinessScore}%</div>
                            <span className="text-[10px] text-slate-400 block">Readiness</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-2 mb-3">{c.bio || c.headline}</p>

                        {/* Verified Skills */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {(c.skills || []).slice(0, 5).map((s) => (
                            <span key={s.name} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] text-slate-300">
                              {s.name}
                            </span>
                          ))}
                          {(c.skills || []).length > 5 && (
                            <span className="text-[10px] text-slate-500 self-center">
                              +{(c.skills || []).length - 5} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setSelectedCandidate(c)}
                          className="text-xs text-slate-300 hover:text-white font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Full Profile
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setTargetCandidateForAction({ id: c.id || c._id || '', name: c.name, email: c.email });
                              setIsInterviewModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white cursor-pointer"
                          >
                            Schedule Call
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTargetCandidateForAction({ id: c.id || c._id || '', name: c.name, email: c.email });
                              setIsOfferModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer"
                          >
                            Offer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. AI MATCH ENGINE VIEW */}
            {activeTab === 'matching' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      AI Competency Match Engine
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Transparent algorithm compares job required skills against student resume competencies, project history, and verified assessments.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Match against:</span>
                    <select
                      value={matchingJobId}
                      onChange={(e) => setMatchingJobId(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                    >
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>{j.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {isMatchingLoading ? (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    Running AI skill alignment scoring across candidate database...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matchResults.map((result) => (
                      <div key={result.candidateId} className="bg-slate-800/80 border border-slate-800 rounded-2xl p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <h2 className="text-sm font-bold text-white">{result.candidateName}</h2>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {result.matchTier}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{result.education} · {result.location}</p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-xl font-extrabold text-emerald-400">{result.matchScore}%</div>
                              <span className="text-[10px] text-slate-400">Match Score</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setTargetCandidateForAction({ id: result.candidateId, name: result.candidateName, email: result.candidateEmail });
                                setIsInterviewModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                            >
                              Fast-Track Interview
                            </button>
                          </div>
                        </div>

                        {/* Matched Skills in Green & Missing in Red */}
                        <div className="grid sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 mb-3 text-xs">
                          <div>
                            <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                              ✓ Matched Skills ({result.matchedSkills.length}):
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {result.matchedSkills.length > 0 ? (
                                result.matchedSkills.map((s) => (
                                  <span key={s} className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-[10px]">
                                    {s}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[11px] text-slate-500">None matched</span>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-[11px] font-bold text-rose-400 block mb-1">
                              ✕ Missing Requirements ({result.missingSkills.length}):
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {result.missingSkills.length > 0 ? (
                                result.missingSkills.map((s) => (
                                  <span key={s} className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-700/50 text-rose-300 text-[10px]">
                                    {s}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[11px] text-emerald-400 font-medium">All core requirements met!</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 italic">{result.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 7. RECRUITMENT PIPELINE VIEW */}
            {activeTab === 'pipeline' && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-xl font-bold text-white">Active Recruitment Pipeline</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Transition candidate applications across stages: Applied, Reviewed, Shortlisted, Interview, Selected, Hired.
                  </p>
                </div>

                <div className="grid gap-3">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-slate-800/80 border border-slate-800 rounded-2xl p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold text-white">{app.candidateName}</h2>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                              {app.stage}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Applied for: <strong className="text-slate-200">{app.opportunityTitle}</strong> ({app.opportunityType})
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {(['Applied', 'Reviewed', 'Shortlisted', 'Interview', 'Selected', 'Hired'] as const).map((stage) => (
                            <button
                              key={stage}
                              type="button"
                              onClick={() => handleMoveStage(app.id, stage)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                app.stage === stage
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                              }`}
                            >
                              {stage}
                            </button>
                          ))}
                        </div>
                      </div>

                      {app.interviewDetails && (
                        <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-300 mb-2 flex items-center justify-between">
                          <span>
                            <strong className="text-white">Interview:</strong> {app.interviewDetails.scheduledAt} at {app.interviewDetails.time} via {app.interviewDetails.mode} ({app.interviewDetails.interviewer})
                          </span>
                          {app.interviewDetails.meetingLink && (
                            <a href={app.interviewDetails.meetingLink} target="_blank" rel="noreferrer" className="text-purple-400 underline font-semibold">
                              Join Call
                            </a>
                          )}
                        </div>
                      )}

                      {app.offerDetails && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 mb-2">
                          <strong className="text-white">Offer Extended:</strong> {app.offerDetails.type} · {app.offerDetails.compensation} · Start Date: {new Date(app.offerDetails.startDate).toLocaleDateString()}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                        <span>Match Rating: <strong className="text-emerald-400">{app.matchScore}%</strong></span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setTargetApplication(app);
                              setTargetCandidateForAction({ id: app.candidateId, name: app.candidateName, email: app.candidateEmail });
                              setIsInterviewModalOpen(true);
                            }}
                            className="text-xs text-blue-400 hover:underline font-medium cursor-pointer"
                          >
                            Schedule Interview
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => {
                              setTargetApplication(app);
                              setTargetCandidateForAction({ id: app.candidateId, name: app.candidateName, email: app.candidateEmail });
                              setIsOfferModalOpen(true);
                            }}
                            className="text-xs text-emerald-400 hover:underline font-medium cursor-pointer"
                          >
                            Send Offer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. INTERVIEWS VIEW */}
            {activeTab === 'interviews' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-white">Scheduled Interviews &amp; Video Screens</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Confirmed technical reviews and discussion calls with candidates.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {applications.filter((a) => a.interviewDetails).map((app) => (
                    <div key={app.id} className="bg-slate-800/80 border border-slate-800 rounded-2xl p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-white">{app.candidateName}</h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              Confirmed
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Role: <strong className="text-slate-200">{app.opportunityTitle}</strong>
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-purple-400" /> {app.interviewDetails?.scheduledAt}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-purple-400" /> {app.interviewDetails?.time}</span>
                            <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5 text-purple-400" /> {app.interviewDetails?.mode}</span>
                            <span>Interviewer: {app.interviewDetails?.interviewer}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {app.interviewDetails?.meetingLink && (
                            <a
                              href={app.interviewDetails.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold inline-flex items-center gap-1"
                            >
                              <Video className="w-3.5 h-3.5" /> Launch Call
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleMoveStage(app.id, 'Selected')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                          >
                            Pass to Offer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {applications.filter((a) => a.interviewDetails).length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No interviews scheduled yet. Open the candidate finder or pipeline to schedule a technical screen.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 9. OFFERS & HIRING VIEW */}
            {activeTab === 'offers' && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-xl font-bold text-white">Offers &amp; Selected Candidates</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Formal job and internship offers extended to candidates with compensation details.
                  </p>
                </div>

                <div className="grid gap-3">
                  {applications.filter((a) => a.offerDetails || a.stage === 'Selected' || a.stage === 'Hired').map((app) => (
                    <div key={app.id} className="bg-slate-800/80 border border-slate-800 rounded-2xl p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-white">{app.candidateName}</h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {app.offerDetails?.status || app.stage}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">Opportunity: {app.opportunityTitle}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2">
                            <span className="font-semibold text-emerald-400">
                              Compensation: {app.offerDetails?.compensation || '$95,000 / yr'}
                            </span>
                            <span>Offer Type: {app.offerDetails?.type || 'Full-time'}</span>
                            {app.offerDetails?.startDate && (
                              <span>Start: {new Date(app.offerDetails.startDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleMoveStage(app.id, 'Hired')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                          >
                            Mark as Hired
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. ACADEMIA COLLABORATION VIEW */}
            {activeTab === 'collaboration' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-white">Academia-Industry Collaborations</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Partner with universities for Guest Lectures, Faculty Internships, Hackathons, and Mentorship.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCollaborationModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Propose Program
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {collaborations.map((collab) => (
                    <div key={collab.id} className="bg-slate-800/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {collab.type}
                          </span>
                          <span className="text-[11px] text-slate-400">{collab.seats} seats</span>
                        </div>
                        <h2 className="text-sm font-bold text-white">{collab.title}</h2>
                        <p className="text-xs text-slate-400 mt-1">Partner: {collab.partnerInstitution}</p>
                        <p className="text-xs text-slate-300 mt-2 mb-3 leading-relaxed">{collab.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                        <span>Target: <strong className="text-white">{collab.audience}</strong></span>
                        <span className="text-emerald-400 font-medium">Status: {collab.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. SKILL DEMAND ANALYTICS VIEW */}
            {activeTab === 'analytics' && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-xl font-bold text-white">Skill Demand &amp; Trend Analytics</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Aggregated industry market intelligence, tech category breakdowns, and hiring velocity.
                  </p>
                </div>

                <div className="bg-slate-800/80 border border-slate-800 rounded-2xl p-5">
                  <div className="divide-y divide-slate-700/60">
                    {skillDemand.map((item, idx) => (
                      <div key={item.name} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-6 text-center text-xs font-bold text-slate-500">#{idx + 1}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{item.name}</span>
                              <span className="px-2 py-0.5 rounded-md bg-slate-700 text-[10px] text-slate-300">
                                {item.category}
                              </span>
                            </div>
                            <span className="text-xs text-emerald-400 mt-0.5 block">{item.trend} · {item.velocity}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 sm:w-64">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                              <span>Demand</span>
                              <strong className="text-blue-400">{item.demandPercentage}%</strong>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.demandPercentage}%` }} />
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">
                            {item.openRoleCount} Open Roles
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 12. COMPANY & RECRUITER PROFILE VIEW */}
            {activeTab === 'profile' && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-xl font-bold text-white">Company &amp; Recruiter Profile</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure public enterprise presence and verified recruitment contact credentials.
                  </p>
                </div>

                <form onSubmit={handleUpdateProfile} className="bg-slate-800/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Company Name</label>
                      <input
                        type="text"
                        value={editProfile.companyName}
                        onChange={(e) => setEditProfile({ ...editProfile, companyName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Industry Sector</label>
                      <input
                        type="text"
                        value={editProfile.industry}
                        onChange={(e) => setEditProfile({ ...editProfile, industry: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Website URL</label>
                      <input
                        type="text"
                        value={editProfile.website}
                        onChange={(e) => setEditProfile({ ...editProfile, website: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Company Size</label>
                      <input
                        type="text"
                        value={editProfile.companySize}
                        onChange={(e) => setEditProfile({ ...editProfile, companySize: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Enterprise Overview &amp; Mission</label>
                    <textarea
                      rows={3}
                      value={editProfile.bio}
                      onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-slate-700/60">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Recruiter Lead Name</label>
                      <input
                        type="text"
                        value={editProfile.recruiterName}
                        onChange={(e) => setEditProfile({ ...editProfile, recruiterName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Recruiter Official Title</label>
                      <input
                        type="text"
                        value={editProfile.recruiterTitle}
                        onChange={(e) => setEditProfile({ ...editProfile, recruiterTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={editProfile.contactEmail}
                        onChange={(e) => setEditProfile({ ...editProfile, contactEmail: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={editProfile.contactPhone}
                        onChange={(e) => setEditProfile({ ...editProfile, contactPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Save Profile Updates
                    </button>
                  </div>
                </form>
              </div>
            )}
            </>
            )}
          </main>
        </div>
      </div>

      {/* MODAL: Candidate Detail View */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedCandidate.name}</h2>
                <p className="text-xs text-blue-400">{selectedCandidate.targetRole}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div>
                <span className="font-semibold text-slate-400 block mb-1">Academic Background:</span>
                <p className="text-white">{selectedCandidate.education} · {selectedCandidate.institution}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-400 block mb-1">Verified Technical &amp; Soft Competencies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedCandidate.skills || []).map((s) => (
                    <span key={s.name} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-blue-300">
                      {s.name} {s.score ? `(${s.score}%)` : ''}
                    </span>
                  ))}
                </div>
              </div>

              {selectedCandidate.projects && selectedCandidate.projects.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-400 block mb-1">Featured Practical Projects:</span>
                  <div className="space-y-2">
                    {selectedCandidate.projects.map((p) => (
                      <div key={p.title} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                        <strong className="text-white">{p.title}</strong>
                        <p className="text-slate-300 mt-0.5">{p.description}</p>
                        <span className="text-[10px] text-blue-400">Tech: {p.technologies.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCandidate.certifications && selectedCandidate.certifications.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-400 block mb-1">Industry Certifications:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.certifications.map((c) => (
                      <span key={c.name} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400">
                        {c.name} ({c.issuer})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-700 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setTargetCandidateForAction({ id: selectedCandidate.id, name: selectedCandidate.name, email: selectedCandidate.email });
                  setSelectedCandidate(null);
                  setIsInterviewModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold"
              >
                Schedule Call
              </button>
              <button
                type="button"
                onClick={() => {
                  setTargetCandidateForAction({ id: selectedCandidate.id, name: selectedCandidate.name, email: selectedCandidate.email });
                  setSelectedCandidate(null);
                  setIsOfferModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Extend Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Post Job */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h2 className="text-base font-bold text-white">Post New Job Opportunity</h2>
              <button type="button" onClick={() => setIsPostJobModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateJob} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Junior Cloud Engineer"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Work Mode</label>
                  <select
                    value={newJob.workMode}
                    onChange={(e) => setNewJob({ ...newJob, workMode: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Required Technical Skills (comma separated)</label>
                <input
                  type="text"
                  value={newJob.requiredSkills}
                  onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Job Description</label>
                <textarea
                  rows={3}
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsPostJobModalOpen(false)} className="px-3 py-1.5 rounded-xl border border-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white">Publish Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Post Internship */}
      {isPostInternshipModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h2 className="text-base font-bold text-white">Post Student Internship</h2>
              <button type="button" onClick={() => setIsPostInternshipModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateInternship} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Internship Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineering Intern"
                  value={newInternship.title}
                  onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Duration</label>
                  <input
                    type="text"
                    value={newInternship.duration}
                    onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Stipend</label>
                  <input
                    type="text"
                    value={newInternship.stipend}
                    onChange={(e) => setNewInternship({ ...newInternship, stipend: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Required Skills</label>
                <input
                  type="text"
                  value={newInternship.requiredSkills}
                  onChange={(e) => setNewInternship({ ...newInternship, requiredSkills: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsPostInternshipModalOpen(false)} className="px-3 py-1.5 rounded-xl border border-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold text-white">Publish Internship</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Post Project */}
      {isPostProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h2 className="text-base font-bold text-white">Sponsor Live Industry Project</h2>
              <button type="button" onClick={() => setIsPostProjectModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateProject} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Ingestion Pipeline"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Required Technologies</label>
                <input
                  type="text"
                  value={newProject.requiredSkills}
                  onChange={(e) => setNewProject({ ...newProject, requiredSkills: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Expected Deliverable</label>
                <input
                  type="text"
                  value={newProject.expectedOutcome}
                  onChange={(e) => setNewProject({ ...newProject, expectedOutcome: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsPostProjectModalOpen(false)} className="px-3 py-1.5 rounded-xl border border-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold text-white">Publish Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Schedule Interview */}
      {isInterviewModalOpen && targetCandidateForAction && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h2 className="text-base font-bold text-white">Schedule Technical Interview</h2>
              <button type="button" onClick={() => setIsInterviewModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleScheduleInterview} className="py-4 space-y-3 text-xs">
              <p className="text-slate-300">Candidate: <strong className="text-white">{targetCandidateForAction.name}</strong></p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newInterview.date}
                    onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="10:00 AM EST"
                    value={newInterview.time}
                    onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Meeting Mode</label>
                <select
                  value={newInterview.mode}
                  onChange={(e) => setNewInterview({ ...newInterview, mode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="Google Meet">Google Meet</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="In-Person / On-site">In-Person / On-site</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Interviewer</label>
                <input
                  type="text"
                  value={newInterview.interviewer}
                  onChange={(e) => setNewInterview({ ...newInterview, interviewer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsInterviewModalOpen(false)} className="px-3 py-1.5 rounded-xl border border-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white">Confirm Interview</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Send Offer */}
      {isOfferModalOpen && targetCandidateForAction && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h2 className="text-base font-bold text-white">Extend Employment Offer</h2>
              <button type="button" onClick={() => setIsOfferModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSendOffer} className="py-4 space-y-3 text-xs">
              <p className="text-slate-300">Candidate: <strong className="text-white">{targetCandidateForAction.name}</strong></p>
              <div>
                <label className="font-semibold block mb-1">Offer Category</label>
                <select
                  value={newOffer.offerType}
                  onChange={(e) => setNewOffer({ ...newOffer, offerType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="Job">Full-Time Job</option>
                  <option value="Internship">Paid Internship</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Compensation / Stipend</label>
                <input
                  type="text"
                  required
                  value={newOffer.compensation}
                  onChange={(e) => setNewOffer({ ...newOffer, compensation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={newOffer.startDate}
                  onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsOfferModalOpen(false)} className="px-3 py-1.5 rounded-xl border border-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-white">Send Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Propose Academia Collaboration */}
      {isCollaborationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h2 className="text-base font-bold text-white">Propose Academia Collaboration</h2>
              <button type="button" onClick={() => setIsCollaborationModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateCollaboration} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Program Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Industry Cloud Architecture Workshop"
                  value={newCollaboration.title}
                  onChange={(e) => setNewCollaboration({ ...newCollaboration, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Type</label>
                  <select
                    value={newCollaboration.type}
                    onChange={(e) => setNewCollaboration({ ...newCollaboration, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Mentorship">Mentorship</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Guest Lecture">Guest Lecture</option>
                    <option value="Innovation Challenge">Innovation Challenge</option>
                    <option value="Live Project">Live Project</option>
                    <option value="Faculty Internship">Faculty Internship</option>
                    <option value="FDP">FDP</option>
                    <option value="Research">Research</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Capacity (Seats)</label>
                  <input
                    type="number"
                    value={newCollaboration.seats}
                    onChange={(e) => setNewCollaboration({ ...newCollaboration, seats: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newCollaboration.description}
                  onChange={(e) => setNewCollaboration({ ...newCollaboration, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsCollaborationModalOpen(false)} className="px-3 py-1.5 rounded-xl border border-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white">Publish Program</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

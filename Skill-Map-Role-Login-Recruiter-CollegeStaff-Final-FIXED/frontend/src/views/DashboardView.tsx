import React, { useState } from 'react';
import { SkillMap3DScene } from '../components/three/SkillMap3DScene';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Briefcase,
  ArrowRight,
  Plus,
  Compass,
  CheckCircle2,
  ExternalLink,
  FileUp,
  FileText,
  Sparkles,
  BookOpen,
  Clock,
  Target,
  AlertCircle,
  RefreshCw,
  Edit3,
  ListFilter,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert, PageError } from '../components/ui/ErrorState';
import { Skeleton, SkeletonCard, Spinner } from '../components/ui/LoadingState';
import { SkillChip } from '../components/ui/SkillChip';
import { UserProfile, UploadedResume, SkillItem, OpportunityItem } from '../types';

export type DashboardStateMode =
  | 'live'
  | 'loading'
  | 'empty-profile'
  | 'no-resume'
  | 'no-skills'
  | 'no-recommendations'
  | 'error';

export const DashboardView: React.FC = () => {
  const {
    user,
    skills,
    gapMetric,
    opportunities,
    roadmap,
    setActiveNav,
    uploadedResume,
    updateUser,
    toggleBookmark,
  } = useApp();

  // State switcher for testing required edge-case states
  const [stateMode, setStateMode] = useState<DashboardStateMode>('live');
  const [dismissedAlerts, setDismissedAlerts] = useState<Record<string, boolean>>({});

  // Dynamic Greeting based on time of day
  const getGreeting = (name: string) => {
    const hour = new Date().getHours();
    let timeGreeting = 'Welcome back';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 18) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    return `${timeGreeting}, ${name || 'Candidate'}!`;
  };

  // Dynamic Profile Completion Calculation (10 key milestones = 100%)
  const computeProfileCompletion = (u: UserProfile, resume: UploadedResume | null, currentSkills: SkillItem[]) => {
    const checklist = [
      { id: 'name', label: 'Full Name', met: Boolean(u.name && u.name.trim().length > 1) },
      { id: 'email', label: 'Institutional Email', met: Boolean(u.email && u.email.includes('@')) },
      { id: 'education', label: 'Education / Institution', met: Boolean(u.education && u.education.trim().length > 1) },
      { id: 'degree', label: 'Degree / Course Program', met: Boolean(u.degree && u.degree.trim().length > 1) },
      { id: 'graduationYear', label: 'Graduation Year', met: Boolean(u.graduationYear && u.graduationYear.trim().length > 0) },
      { id: 'targetRole', label: 'Target Career Role', met: Boolean(u.targetRole && u.targetRole.trim().length > 1) },
      { id: 'location', label: 'Location / Region', met: Boolean(u.location && u.location.trim().length > 1) },
      { id: 'bio', label: 'Candidate Bio & Aspirations', met: Boolean(u.bio && u.bio.trim().length > 5) },
      { id: 'skills', label: 'At least 3 Mapped Skills', met: currentSkills.length >= 3 },
      { id: 'resume', label: 'Resume Uploaded & Staged', met: Boolean(resume) },
    ];

    const completed = checklist.filter((item) => item.met);
    const pending = checklist.filter((item) => !item.met);
    const percentage = Math.round((completed.length / checklist.length) * 100);

    return { percentage, completed, pending };
  };

  // Effective data based on stateMode simulation
  const effectiveUser = stateMode === 'empty-profile'
    ? {
        ...user,
        name: 'New Candidate',
        headline: '',
        education: '',
        degree: '',
        graduationYear: '',
        bio: '',
        location: '',
        careerInterests: [],
      }
    : user;

  const effectiveResume = stateMode === 'no-resume' ? null : uploadedResume;
  const effectiveSkills = stateMode === 'no-skills' ? [] : skills;
  const effectiveOpportunities = stateMode === 'no-recommendations' ? [] : opportunities;

  const profileStats = computeProfileCompletion(effectiveUser, effectiveResume, effectiveSkills);

  // Learning Roadmap Statistics
  const totalRoadmapHours = roadmap.reduce((acc, curr) => acc + curr.estimatedHours, 0);
  const completedRoadmapHours = roadmap.reduce((acc, curr) => acc + curr.completedHours, 0);
  const roadmapPercentage = totalRoadmapHours > 0 ? Math.round((completedRoadmapHours / totalRoadmapHours) * 100) : 0;
  const activeMilestones = roadmap.filter((m) => m.status === 'In Progress');

  // Verified vs In-Progress skills
  const verifiedSkills = effectiveSkills.filter((s) => s.status === 'Verified');

  // RENDER: Error State
  if (stateMode === 'error') {
    return (
      <div className="student-dashboard-page">
        <style>{`
        /* Student portal: complete dark surface override (scoped only to this page). */
        .student-dashboard-page,
        .student-dashboard-page .w-full.max-w-7xl {
          background: #0b1120 !important;
          color: #e2e8f0 !important;
        }
        .student-dashboard-page .bg-white,
        .student-dashboard-page .bg-white\/95,
        .student-dashboard-page .bg-white\/90,
        .student-dashboard-page .bg-white\/80 {
          background-color: #111827 !important;
        }
        .student-dashboard-page .bg-slate-50,
        .student-dashboard-page .bg-slate-50\/60,
        .student-dashboard-page .bg-slate-100,
        .student-dashboard-page .bg-gray-50,
        .student-dashboard-page .bg-gray-100 {
          background-color: #0f172a !important;
        }
        .student-dashboard-page .border-slate-200,
        .student-dashboard-page .border-slate-200\/80,
        .student-dashboard-page .border-slate-100,
        .student-dashboard-page .border-gray-200 {
          border-color: #334155 !important;
        }
        .student-dashboard-page .text-slate-950,
        .student-dashboard-page .text-slate-900,
        .student-dashboard-page .text-gray-900 {
          color: #f1f5f9 !important;
        }
        .student-dashboard-page .text-slate-800,
        .student-dashboard-page .text-slate-700,
        .student-dashboard-page .text-gray-800,
        .student-dashboard-page .text-gray-700 {
          color: #cbd5e1 !important;
        }
        .student-dashboard-page .text-slate-600,
        .student-dashboard-page .text-slate-500,
        .student-dashboard-page .text-gray-600,
        .student-dashboard-page .text-gray-500 {
          color: #94a3b8 !important;
        }
        .student-dashboard-page .divide-slate-200 > :not([hidden]) ~ :not([hidden]),
        .student-dashboard-page .divide-slate-100 > :not([hidden]) ~ :not([hidden]) {
          border-color: #334155 !important;
        }
        .student-dashboard-page input,
        .student-dashboard-page textarea,
        .student-dashboard-page select {
          background-color: #111827 !important;
          color: #e2e8f0 !important;
          border-color: #475569 !important;
        }
        .student-dashboard-page input::placeholder,
        .student-dashboard-page textarea::placeholder {
          color: #64748b !important;
        }
        .student-dashboard-page button.bg-white {
          background-color: #111827 !important;
          color: #cbd5e1 !important;
          border-color: #475569 !important;
        }
        .student-dashboard-page button.bg-white:hover,
        .student-dashboard-page button.bg-transparent:hover {
          background-color: #1e293b !important;
        }
        .student-dashboard-page .border-b,
        .student-dashboard-page .border-t,
        .student-dashboard-page .border {
          border-color: #334155 !important;
        }
      `}</style>
        <PageContainer
        title="Candidate Dashboard"
        description="Career profile, competency benchmarks, and opportunity matching overview."
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-400">
            <span><strong>Showcase State Active:</strong> Error Mode Simulation</span>
            <Button size="sm" variant="outline" onClick={() => setStateMode('live')}>
              Switch to Live State
            </Button>
          </div>

          <PageError
            title="Dashboard Service Unavailable"
            message="Unable to aggregate candidate competencies and match metrics from the backend service. (Simulated 503 error)."
            onRetry={() => setStateMode('live')}
          />
        </div>
        </PageContainer>
      </div>
    );
  }

  // RENDER: Loading State
  if (stateMode === 'loading') {
    return (
      <div className="student-dashboard-page">
        <style>{`
        .student-dashboard-page { min-height: 100%; color: #e2e8f0; }
        .student-dashboard-page > .w-full.max-w-7xl {
          background: #0f172a;
          color: #e2e8f0;
          border-radius: 1rem;
        }
        .student-dashboard-page .bg-white {
          background-color: #111827 !important;
        }
        .student-dashboard-page .bg-slate-50,
        .student-dashboard-page .bg-slate-50\/60 {
          background-color: #0f172a !important;
        }
        .student-dashboard-page .border-slate-200\/80,
        .student-dashboard-page .border-slate-100 {
          border-color: #334155 !important;
        }
        .student-dashboard-page .text-slate-900 { color: #f1f5f9 !important; }
        .student-dashboard-page .text-slate-800 { color: #e2e8f0 !important; }
        .student-dashboard-page .text-slate-700 { color: #cbd5e1 !important; }
        .student-dashboard-page .text-slate-600,
        .student-dashboard-page .text-slate-500 { color: #94a3b8 !important; }
        .student-dashboard-page button.bg-white {
          background-color: #111827 !important;
          color: #cbd5e1 !important;
          border-color: #475569 !important;
        }
        .student-dashboard-page button.bg-white:hover { background-color: #1e293b !important; }
        .student-dashboard-page button.bg-transparent { color: #cbd5e1 !important; }
        .student-dashboard-page button.bg-transparent:hover { background-color: #1e293b !important; color: #f1f5f9 !important; }
        .student-dashboard-page .border-b { border-color: #334155; }
      `}</style>
        <PageContainer
        title="Candidate Dashboard"
        description="Career profile, competency benchmarks, and opportunity matching overview."
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              <strong>Showcase State Active:</strong> Loading State Simulation
            </span>
            <Button size="sm" variant="outline" onClick={() => setStateMode('live')}>
              Switch to Live State
            </Button>
          </div>

          {/* Skeleton Hero */}
          <div className="p-6 rounded-2xl bg-slate-700/70 border border-slate-600 animate-pulse space-y-4">
            <Skeleton width="w-1/3" height="h-7" />
            <Skeleton width="w-1/2" height="h-4" />
          </div>

          {/* Skeleton 6 Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} rows={2} />
            ))}
          </div>

          {/* Skeleton Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <SkeletonCard rows={4} />
              <SkeletonCard rows={4} />
            </div>
            <div className="space-y-6">
              <SkeletonCard rows={3} />
              <SkeletonCard rows={3} />
            </div>
          </div>
        </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="student-dashboard-page">
      <style>{`
        .student-dashboard-page { min-height: 100%; color: #e2e8f0; }
        .student-dashboard-page > .w-full.max-w-7xl {
          background: #0f172a;
          color: #e2e8f0;
          border-radius: 1rem;
        }
        .student-dashboard-page .bg-white {
          background-color: #111827 !important;
        }
        .student-dashboard-page .bg-slate-50,
        .student-dashboard-page .bg-slate-50\/60 {
          background-color: #0f172a !important;
        }
        .student-dashboard-page .border-slate-200\/80,
        .student-dashboard-page .border-slate-100 {
          border-color: #334155 !important;
        }
        .student-dashboard-page .text-slate-900 { color: #f1f5f9 !important; }
        .student-dashboard-page .text-slate-800 { color: #e2e8f0 !important; }
        .student-dashboard-page .text-slate-700 { color: #cbd5e1 !important; }
        .student-dashboard-page .text-slate-600,
        .student-dashboard-page .text-slate-500 { color: #94a3b8 !important; }
        .student-dashboard-page button.bg-white {
          background-color: #111827 !important;
          color: #cbd5e1 !important;
          border-color: #475569 !important;
        }
        .student-dashboard-page button.bg-white:hover { background-color: #1e293b !important; }
        .student-dashboard-page button.bg-transparent { color: #cbd5e1 !important; }
        .student-dashboard-page button.bg-transparent:hover { background-color: #1e293b !important; color: #f1f5f9 !important; }
        .student-dashboard-page .border-b { border-color: #334155; }
      `}</style>
      <PageContainer
      title={getGreeting(effectiveUser.name)}
      description={`Tracking competency alignment for ${effectiveUser.targetRole} with verified skill benchmarks.`}
      badge={
        <Badge variant={effectiveResume ? 'success' : 'warning'} size="md">
          {effectiveResume ? 'Profile Synchronized' : 'Resume Required'}
        </Badge>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Compass className="w-4 h-4" />}
            onClick={() => setActiveNav('skill-gap')}
          >
            Analyze Skill Gap
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Edit3 className="w-4 h-4" />}
            onClick={() => setActiveNav('profile')}
          >
            Update Profile
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* INTERACTIVE STATE SHOWCASE TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-800/90 border border-slate-700/90 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-200">Preview Dashboard States:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: 'live', label: 'Live Normal' },
              { key: 'loading', label: 'Loading' },
              { key: 'empty-profile', label: 'Empty Profile' },
              { key: 'no-resume', label: 'No Resume' },
              { key: 'no-skills', label: 'No Skills' },
              { key: 'no-recommendations', label: 'No Matches' },
              { key: 'error', label: 'Error' },
            ].map((st) => (
              <button
                key={st.key}
                type="button"
                onClick={() => setStateMode(st.key as DashboardStateMode)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  stateMode === st.key
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-950'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* TOP CANDIDATE WELCOME HERO BANNER */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/500/20 text-indigo-300 text-[11px] font-semibold tracking-wide uppercase border border-indigo-400/30">
                Candidate Portfolio
              </span>
              <span className="text-xs text-slate-400">
                Candidate ID: <code className="text-indigo-200">{effectiveUser.id}</code>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {getGreeting(effectiveUser.name)}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Target role is benchmarked to <span className="font-semibold text-indigo-200">{effectiveUser.targetRole}</span>.
              Review your verified proficiencies, address high-priority skill gaps, and explore matched career tracks.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/10 backdrop-blur-xs px-5 py-3 rounded-xl border border-white/15 shrink-0 self-stretch md:self-auto justify-between md:justify-start">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-300 block font-semibold">
                Profile Readiness
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-emerald-400">
                  {effectiveUser.readinessScore}%
                </span>
                <span className="text-[11px] text-emerald-300 font-medium">Ready</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="border-white/30 text-white hover:bg-slate-900/10 text-xs"
              onClick={() => setActiveNav('profile')}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Edit
            </Button>
          </div>
        </div>

        {/* CONDITIONAL BANNER: NO RESUME STAGED */}
        {!effectiveResume && !dismissedAlerts['no-resume'] && (
          <div className="p-4 rounded-xl border border-blue-800 bg-blue-950/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-900/50 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                <FileUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-100">
                  No Resume Currently Uploaded
                </h4>
                <p className="text-xs text-blue-200/90 mt-0.5">
                  Upload your latest CV in PDF or DOCX format to automate competency extraction and enhance match accuracy.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveNav('resume-upload')}
                leftIcon={<FileUp className="w-3.5 h-3.5" />}
              >
                Upload Resume
              </Button>
            </div>
          </div>
        )}

        {/* CONDITIONAL BANNER: EMPTY PROFILE FIELDS */}
        {profileStats.percentage < 50 && (
          <div className="p-4 rounded-xl border border-amber-800 bg-amber-950/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-900/50 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-100">
                  Candidate Profile Incomplete ({profileStats.percentage}%)
                </h4>
                <p className="text-xs text-amber-200/90 mt-0.5">
                  Pending details: {profileStats.pending.slice(0, 3).map((p) => p.label).join(', ')}. Complete your profile to maximize matching potential.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-amber-700 text-amber-200 hover:bg-amber-900/50 shrink-0"
              onClick={() => setActiveNav('profile')}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Complete Profile
            </Button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6 MAIN DASHBOARD METRIC CARDS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Card 1: Profile Completion */}
          <Card className="hover:shadow-xs transition-shadow">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Profile Complete
                </span>
                <div className="p-1.5 rounded-lg bg-indigo-950/50 text-indigo-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-100 tracking-tight">
                  {profileStats.percentage}%
                </span>
                <span className="text-[10px] text-slate-400">
                  ({profileStats.completed.length}/10 items)
                </span>
              </div>
              <ProgressBar
                value={profileStats.percentage}
                size="sm"
                variant={profileStats.percentage >= 80 ? 'success' : 'primary'}
              />
              <p className="text-[11px] text-slate-400 truncate">
                {profileStats.pending.length > 0 ? `Next: ${profileStats.pending[0].label}` : 'All items verified'}
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Total Skills */}
          <Card className="hover:shadow-xs transition-shadow">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Skills
                </span>
                <div className="p-1.5 rounded-lg bg-emerald-950/50 text-emerald-400">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-100 tracking-tight">
                  {effectiveSkills.length}
                </span>
                <Badge variant="success" size="sm">
                  {verifiedSkills.length} Verified
                </Badge>
              </div>
              <ProgressBar
                value={effectiveSkills.length > 0 ? (verifiedSkills.length / effectiveSkills.length) * 100 : 0}
                size="sm"
                variant="success"
              />
              <p className="text-[11px] text-slate-400 truncate">
                {effectiveSkills.length - verifiedSkills.length} self-assessed/learning
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Skill Match Percentage */}
          <Card className="hover:shadow-xs transition-shadow">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Skill Match %
                </span>
                <div className="p-1.5 rounded-lg bg-blue-950/50 text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-100 tracking-tight">
                  {effectiveUser.readinessScore}%
                </span>
                <Badge variant="primary" size="sm">
                  Market Fit
                </Badge>
              </div>
              <ProgressBar value={effectiveUser.readinessScore} size="sm" variant="primary" />
              <p className="text-[11px] text-slate-400 truncate" title={effectiveUser.targetRole}>
                For: <span className="font-medium text-slate-300">{effectiveUser.targetRole}</span>
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Skill Gaps */}
          <Card className="hover:shadow-xs transition-shadow">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Skill Gaps
                </span>
                <div className="p-1.5 rounded-lg bg-amber-950/50 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-100 tracking-tight">
                  {gapMetric.criticalGapsCount}
                </span>
                <Badge variant="warning" size="sm">
                  Priority
                </Badge>
              </div>
              <div className="text-[11px] text-rose-400 font-semibold pt-1">
                Avg Gap: -{gapMetric.averageGap}%
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Targeting benchmark parity
              </p>
            </CardContent>
          </Card>

          {/* Card 5: Recommended Opportunities (Sample Data) */}
          <Card className="hover:shadow-xs transition-shadow">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Recommendations
                </span>
                <div className="p-1.5 rounded-lg bg-purple-950/50 text-purple-400">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-100 tracking-tight">
                  {effectiveOpportunities.length}
                </span>
                <Badge variant="neutral" size="sm">
                  Demo Data
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 truncate pt-1">
                {effectiveOpportunities.filter((o) => o.matchScore >= 80).length} high benchmark fits
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                AI match prototypes
              </p>
            </CardContent>
          </Card>

          {/* Card 6: Learning Progress */}
          <Card className="hover:shadow-xs transition-shadow">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Learning Progress
                </span>
                <div className="p-1.5 rounded-lg bg-teal-950/50 text-teal-400">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-100 tracking-tight">
                  {roadmapPercentage}%
                </span>
                <span className="text-[10px] text-slate-400">
                  {completedRoadmapHours}/{totalRoadmapHours}h
                </span>
              </div>
              <ProgressBar value={roadmapPercentage} size="sm" variant="primary" />
              <p className="text-[11px] text-slate-400 truncate">
                {activeMilestones.length} active roadmap tracks
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* QUICK ACTIONS BAR */}
        {/* ========================================================================= */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Quick Actions
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Direct navigation shortcuts</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="justify-start text-xs h-9"
              onClick={() => setActiveNav('resume-upload')}
              leftIcon={<FileUp className="w-3.5 h-3.5 text-blue-600" />}
            >
              Upload Resume
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="justify-start text-xs h-9"
              onClick={() => setActiveNav('profile')}
              leftIcon={<Edit3 className="w-3.5 h-3.5 text-indigo-400" />}
            >
              Update Profile
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="justify-start text-xs h-9"
              onClick={() => setActiveNav('skill-gap')}
              leftIcon={<Target className="w-3.5 h-3.5 text-amber-400" />}
            >
              Analyze Skill Gap
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="justify-start text-xs h-9"
              onClick={() => setActiveNav('jobs')}
              leftIcon={<Briefcase className="w-3.5 h-3.5 text-purple-400" />}
            >
              View Opportunities
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="justify-start text-xs h-9 col-span-2 sm:col-span-1"
              onClick={() => setActiveNav('roadmap')}
              leftIcon={<BookOpen className="w-3.5 h-3.5 text-emerald-400" />}
            >
              View Learning Roadmap
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN 2-COLUMN SECTION LAYOUT */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLUMNS: Skills Overview, Gaps, Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            {/* SECTION 1: CURRENT SKILLS OVERVIEW */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/50 text-emerald-400 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Current Skills Overview</CardTitle>
                    <CardDescription>
                      Mapped candidate proficiencies with verified competency scores
                    </CardDescription>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveNav('my-skills')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Manage Skills ({effectiveSkills.length})
                </Button>
              </CardHeader>

              <CardContent className="p-5">
                {effectiveSkills.length === 0 ? (
                  <EmptyState
                    icon={<Award className="w-6 h-6 text-slate-400" />}
                    title="No Skills Mapped Yet"
                    description="You haven't recorded any skills in your inventory. Add your technical competencies or upload your resume for automatic parsing."
                    actionLabel="Add First Skill"
                    onAction={() => setActiveNav('my-skills')}
                    secondaryActionLabel="Upload Resume"
                    onSecondaryAction={() => setActiveNav('resume-upload')}
                  />
                ) : (
                  <div className="space-y-4">
                    {/* Reusable Skill Chips Preview */}
                    <div className="flex flex-wrap gap-2">
                      {effectiveSkills.slice(0, 8).map((skill) => (
                        <SkillChip
                          key={skill.id}
                          skill={skill}
                          showLevel={true}
                          showScore={true}
                          onClick={() => setActiveNav('my-skills')}
                        />
                      ))}
                    </div>

                    {/* Compact Proficiency Bars for Top Skills */}
                    <div className="pt-3 border-t border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {effectiveSkills.slice(0, 4).map((skill) => (
                        <div key={skill.id} className="p-3 rounded-lg bg-slate-950 border border-slate-700 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-200">{skill.name}</span>
                            <span className="font-bold text-slate-300">{skill.score}%</span>
                          </div>
                          <ProgressBar value={skill.score} size="xs" variant="primary" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SECTION 2: MISSING / REQUIRED SKILLS (GAP MATRIX PREVIEW) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/50 text-amber-400 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Missing &amp; Required Skills</CardTitle>
                    <CardDescription>
                      Benchmark gaps required for {effectiveUser.targetRole} role parity
                    </CardDescription>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveNav('skill-gap')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Full Gap Matrix
                </Button>
              </CardHeader>

              <CardContent className="p-5 divide-y divide-slate-700">
                {gapMetric.skills.slice(0, 4).map((item) => (
                  <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100">{item.name}</span>
                        <Badge
                          variant={
                            item.priority === 'High'
                              ? 'danger'
                              : item.priority === 'Medium'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {item.priority} Priority
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        Current: <strong className="text-slate-200">{item.currentScore}%</strong> / Target: <strong>{item.requiredScore}%</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-10">
                        <ProgressBar
                          value={item.currentScore}
                          max={item.requiredScore}
                          size="sm"
                          variant={item.gap > 15 ? 'warning' : 'primary'}
                        />
                      </div>
                      <div className="col-span-2 text-right text-xs font-bold text-rose-400">
                        -{item.gap}% Gap
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Showing top {Math.min(4, gapMetric.skills.length)} identified focus competencies
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setActiveNav('roadmap')}
                    leftIcon={<BookOpen className="w-3.5 h-3.5" />}
                  >
                    Add Missing Skills to Roadmap
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 3: LEARNING ROADMAP PROGRESS */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-950/50 text-teal-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Learning Roadmap Progress</CardTitle>
                    <CardDescription>
                      Targeted learning tracks closing your priority skill gaps
                    </CardDescription>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => setActiveNav('roadmap')}
                >
                  View Roadmap
                </Button>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {activeMilestones.length === 0 ? (
                  <EmptyState
                    icon={<BookOpen className="w-6 h-6 text-slate-400" />}
                    title="No In-Progress Tracks"
                    description="You don't have any active learning milestones. Enroll in milestone modules from your personalized roadmap."
                    actionLabel="Open Learning Roadmap"
                    onAction={() => setActiveNav('roadmap')}
                  />
                ) : (
                  activeMilestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-700/70 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-100">{milestone.title}</h4>
                          <span className="text-[11px] text-slate-400 font-medium">
                            Focus: {milestone.skillFocus}
                          </span>
                        </div>
                        <Badge variant="primary" size="sm">
                          {milestone.completedHours} / {milestone.estimatedHours} hrs
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {milestone.description}
                      </p>
                      <ProgressBar
                        value={milestone.completedHours}
                        max={milestone.estimatedHours}
                        size="sm"
                        variant="primary"
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT 1 COLUMN: RESUME STAGING & RECOMMENDED OPPORTUNITIES */}
          <div className="space-y-6">
            {/* RESUME STAGING & STATUS CARD */}
            <Card className={effectiveResume ? 'border-emerald-800 bg-emerald-950/50/20' : 'border-blue-800 bg-blue-950/50/30'}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      effectiveResume ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-900/50 text-blue-300'
                    }`}>
                      {effectiveResume ? <FileText className="w-4 h-4" /> : <FileUp className="w-4 h-4" />}
                    </div>
                    <div>
                      <CardTitle className="text-sm">
                        {effectiveResume ? 'Resume Staged & Ready' : 'Resume Not Staged'}
                      </CardTitle>
                      <CardDescription className="text-[11px]">
                        {effectiveResume ? `${effectiveResume.format} Document` : 'Action required to parse skills'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={effectiveResume ? 'success' : 'warning'} size="sm">
                    {effectiveResume ? 'Staged' : 'Missing'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0 space-y-3">
                {effectiveResume ? (
                  <div className="p-3 rounded-lg bg-slate-900 border border-emerald-800 text-xs space-y-1">
                    <div className="font-semibold text-slate-100 truncate">{effectiveResume.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Size: {effectiveResume.formattedSize}</span>
                      <span>Uploaded: {effectiveResume.uploadedAt}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Uploading your CV enables Skill Map to synchronize verified skills directly into your dashboard.
                  </p>
                )}

                <Button
                  type="button"
                  variant={effectiveResume ? 'outline' : 'primary'}
                  size="sm"
                  className="w-full justify-center text-xs"
                  onClick={() => setActiveNav('resume-upload')}
                  leftIcon={<FileUp className="w-3.5 h-3.5" />}
                >
                  {effectiveResume ? 'Manage Resume File' : 'Upload Resume (.pdf / .docx)'}
                </Button>
              </CardContent>
            </Card>

            {/* SECTION 4: RECOMMENDED JOBS / INTERNSHIPS (DEMO DATA LABELED) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">Recommended Opportunities</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Sample roles aligned with your skill profile
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveNav('jobs')}
                  aria-label="View all opportunities"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                {/* SAMPLE DATA DISCLAIMER BANNER */}
                <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-800 text-[11px] text-amber-200 leading-tight">
                  <span className="font-semibold">Demo / Sample Data Notice:</span> Opportunities are mock simulations for training &amp; roadmap matching. Match scores will be powered by backend AI. No hiring decisions are made.
                </div>

                {effectiveOpportunities.length === 0 ? (
                  <EmptyState
                    icon={<Briefcase className="w-6 h-6 text-slate-400" />}
                    title="No Opportunities Found"
                    description="There are currently no career opportunities matching your criteria or filters. Check back soon as new sample tracks are added."
                    actionLabel="Explore All Opportunities"
                    onAction={() => setActiveNav('jobs')}
                  />
                ) : (
                  effectiveOpportunities.slice(0, 3).map((job) => (
                    <div
                      key={job.id}
                      className="p-3 rounded-xl border border-slate-700 hover:border-blue-300 hover:bg-blue-950/50/20 transition-all space-y-2 bg-slate-900"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-100 leading-tight">
                            {job.title}
                          </h4>
                          <span className="text-[11px] text-slate-400">{job.organization} (Demo)</span>
                        </div>
                        <Badge variant={job.matchScore >= 80 ? 'success' : 'primary'} size="sm">
                          {job.matchScore}% Match
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{job.workMode}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {job.matchedSkills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-700 text-xs">
                        <span className="text-[11px] font-semibold text-slate-300">
                          {job.stipendOrSalary}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleBookmark(job.id)}
                            className="text-[11px] text-slate-400 hover:text-blue-600 px-2 py-0.5 rounded transition-colors"
                          >
                            {job.isBookmarked ? 'Saved' : 'Save'}
                          </button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs py-0.5 px-2 h-7"
                            onClick={() => setActiveNav('jobs')}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setActiveNav('jobs')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Explore All Demo Opportunities ({effectiveOpportunities.length})
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      </PageContainer>
    </div>
  );
};

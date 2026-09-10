import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Filter,
  Award,
  CheckCircle2,
  FileUp,
  Sparkles,
  UserCheck,
  Edit3,
  Search,
  RefreshCw,
  CloudCheck,
  AlertTriangle,
  HelpCircle,
  Code,
  Users,
  Wrench,
  Database,
  ArrowUpDown,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Info,
  Check,
  X,
  Target,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { SearchInput } from '../components/ui/SearchInput';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/ErrorState';
import { SkillChip } from '../components/ui/SkillChip';
import { skillsApi } from '../services/skillsApi';
import {
  SkillItem,
  SkillCategory,
  ProficiencyLevel,
  SkillStatus,
  SkillSource,
} from '../types';

// The 4 main visual sections requested
export type PrimarySkillSection =
  | 'Technical Skills'
  | 'Soft Skills'
  | 'Tools & Technologies'
  | 'Other Skills';

interface SectionConfig {
  title: PrimarySkillSection;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgLight: string;
  borderColor: string;
}

const SECTION_CONFIGS: SectionConfig[] = [
  {
    title: 'Technical Skills',
    description: 'Programming languages, computational architectures, API design, and core engineering paradigms.',
    icon: Code,
    accentColor: 'text-blue-600',
    bgLight: 'bg-blue-50/50',
    borderColor: 'border-blue-200',
  },
  {
    title: 'Soft Skills',
    description: 'Cross-functional collaboration, agile rituals, technical documentation, and team communications.',
    icon: Users,
    accentColor: 'text-amber-600',
    bgLight: 'bg-amber-50/50',
    borderColor: 'border-amber-200',
  },
  {
    title: 'Tools & Technologies',
    description: 'Cloud infrastructure, container runtimes, version control platforms, and CI/CD pipelines.',
    icon: Wrench,
    accentColor: 'text-emerald-600',
    bgLight: 'bg-emerald-50/50',
    borderColor: 'border-emerald-200',
  },
  {
    title: 'Other Skills',
    description: 'Distributed system design, data modeling, relational databases, and cybersecurity standards.',
    icon: Database,
    accentColor: 'text-purple-600',
    bgLight: 'bg-purple-50/50',
    borderColor: 'border-purple-200',
  },
];

// Helper to normalize any historical category strings into the 4 primary visual sections
export const normalizeToPrimarySection = (category: SkillCategory): PrimarySkillSection => {
  if (category === 'Technical' || category === 'Technical Skills') return 'Technical Skills';
  if (category === 'Core & Collaborative' || category === 'Soft Skills') return 'Soft Skills';
  if (category === 'Tools & Systems' || category === 'Tools & Technologies') return 'Tools & Technologies';
  return 'Other Skills';
};

// Autocomplete suggestions for quick addition
const COMMON_SKILL_SUGGESTIONS = [
  { name: 'GraphQL & Apollo', category: 'Technical Skills' as const, level: 'Intermediate' as const },
  { name: 'Kubernetes Orchestration', category: 'Tools & Technologies' as const, level: 'Beginner' as const },
  { name: 'Terraform & IaC', category: 'Tools & Technologies' as const, level: 'Beginner' as const },
  { name: 'Stakeholder Management', category: 'Soft Skills' as const, level: 'Intermediate' as const },
  { name: 'Microservices Architecture', category: 'Other Skills' as const, level: 'Intermediate' as const },
  { name: 'Redis Caching & PubSub', category: 'Other Skills' as const, level: 'Intermediate' as const },
  { name: 'Jest & Unit Testing', category: 'Technical Skills' as const, level: 'Intermediate' as const },
  { name: 'Prompt Engineering & LLM APIs', category: 'Technical Skills' as const, level: 'Intermediate' as const },
];

export const MySkillsView: React.FC = () => {
  const {
    skills,
    addSkill,
    updateSkill,
    deleteSkill,
    confirmAiSkill,
    updateSkillScore,
    setActiveNav,
    user,
    gapMetric,
    refreshSkills,
  } = useApp();

  // Search and Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<'All' | 'ai' | 'manual' | 'unconfirmed'>('All');
  const [viewMode, setViewMode] = useState<'sections' | 'chips' | 'compact'>('sections');
  const [showRoleAlignment, setShowRoleAlignment] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [deletingSkill, setDeletingSkill] = useState<SkillItem | null>(null);

  // Sync state (Cloud backend synchronization)
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Add Skill Form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newCategory, setNewCategory] = useState<PrimarySkillSection>('Technical Skills');
  const [newLevel, setNewLevel] = useState<ProficiencyLevel>('Intermediate');
  const [newScore, setNewScore] = useState<number>(70);
  const [newTargetScore, setNewTargetScore] = useState<number>(85);
  const [newStatus, setNewStatus] = useState<SkillStatus>('Self-Assessed');
  const [newSource, setNewSource] = useState<SkillSource>('manually_added');
  const [newNotes, setNewNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Edit Skill Form state
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<PrimarySkillSection>('Technical Skills');
  const [editLevel, setEditLevel] = useState<ProficiencyLevel>('Intermediate');
  const [editScore, setEditScore] = useState<number>(70);
  const [editTargetScore, setEditTargetScore] = useState<number>(85);
  const [editStatus, setEditStatus] = useState<SkillStatus>('Self-Assessed');
  const [editSource, setEditSource] = useState<SkillSource>('manually_added');
  const [editNotes, setEditNotes] = useState('');
  const [editError, setEditError] = useState('');

  // AI Extraction banner dismissed state
  const [isAiBannerDismissed, setIsAiBannerDismissed] = useState(false);

  // Helpers to detect source
  const isResumeSkill = (s: { source?: string; isAiExtracted?: boolean }) =>
    s.source === 'resume' || s.source === 'resume_extracted' || Boolean(s.isAiExtracted);
  const isManualSkill = (s: { source?: string; isAiExtracted?: boolean }) =>
    (s.source === 'manual' || s.source === 'manually_added') && !s.isAiExtracted;

  // Metrics
  const aiExtractedSkills = skills.filter(isResumeSkill);
  const unconfirmedAiSkills = skills.filter(
    (s) => isResumeSkill(s) && !s.confirmedByCandidate
  );
  const manuallyAddedSkills = skills.filter(isManualSkill);
  const verifiedSkills = skills.filter((s) => s.status === 'Verified');

  // Filter skills based on search, category, level, and source
  const filteredSkills = useMemo(() => {
    return skills.filter((item) => {
      // Search
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(search.toLowerCase()));

      // Category
      const normalizedCategory = normalizeToPrimarySection(item.category);
      const matchesCategory =
        categoryFilter === 'All' || normalizedCategory === categoryFilter;

      // Level
      const matchesLevel = levelFilter === 'All' || item.level === levelFilter;

      // Source
      let matchesSource = true;
      if (sourceFilter === 'ai') {
        matchesSource = isResumeSkill(item);
      } else if (sourceFilter === 'manual') {
        matchesSource = isManualSkill(item);
      } else if (sourceFilter === 'unconfirmed') {
        matchesSource = isResumeSkill(item) && !item.confirmedByCandidate;
      }

      return matchesSearch && matchesCategory && matchesLevel && matchesSource;
    });
  }, [skills, search, categoryFilter, levelFilter, sourceFilter]);

  // Skills grouped by the 4 visual sections
  const skillsBySection = useMemo(() => {
    const groups: Record<PrimarySkillSection, SkillItem[]> = {
      'Technical Skills': [],
      'Soft Skills': [],
      'Tools & Technologies': [],
      'Other Skills': [],
    };

    filteredSkills.forEach((skill) => {
      const sectionKey = normalizeToPrimarySection(skill.category);
      groups[sectionKey].push(skill);
    });

    return groups;
  }, [filteredSkills]);

  // Handle Backend Cloud Synchronization
  const handleSyncWithCloud = async () => {
    setIsSyncing(true);
    try {
      const res = await skillsApi.syncSkills(skills);
      setLastSyncedTime(res.syncedAt);
      setSyncFeedback(res.message);
      setTimeout(() => setSyncFeedback(null), 4000);
    } catch {
      setSyncFeedback('Synchronization failed. Please check network connection.');
      setTimeout(() => setSyncFeedback(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Real Gemini AI extraction of skills from candidate's uploaded resume document
  const handleSimulateExtraction = async () => {
    setIsSyncing(true);
    try {
      const extracted = await skillsApi.extractSkillsFromUploadedDocument();
      // Synchronize state with backend MongoDB user record
      await refreshSkills();
      setSyncFeedback(`Successfully extracted ${extracted.length} skills from your resume via Gemini AI.`);
      setTimeout(() => setSyncFeedback(null), 5000);
    } catch (err: any) {
      setSyncFeedback(err?.message || 'Skill extraction failed. Please ensure a valid resume is uploaded.');
      setTimeout(() => setSyncFeedback(null), 6000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Open Add Modal with optional prefilled values (e.g. from missing role skills)
  const openAddModal = (prefill?: { name?: string; category?: PrimarySkillSection; targetScore?: number }) => {
    setNewSkillName(prefill?.name || '');
    setNewCategory(prefill?.category || 'Technical Skills');
    setNewLevel('Intermediate');
    setNewScore(65);
    setNewTargetScore(prefill?.targetScore || 80);
    setNewStatus('Self-Assessed');
    setNewSource('manually_added');
    setNewNotes('');
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Handle Add Submission
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      setFormError('Please provide a descriptive skill name.');
      return;
    }

    try {
      const isResume = newSource === 'resume_extracted' || newSource === 'resume';
      await addSkill({
        name: newSkillName.trim(),
        category: newCategory,
        level: newLevel,
        score: Number(newScore),
        targetScore: Number(newTargetScore),
        status: newStatus,
        source: isResume ? 'resume' : 'manual',
        isAiExtracted: isResume,
        aiConfidence: isResume ? 88 : undefined,
        confirmedByCandidate: !isResume,
        notes: newNotes.trim() || undefined,
      });

      setIsAddModalOpen(false);
      setSyncFeedback(`Successfully added "${newSkillName.trim()}" to your profile.`);
      setTimeout(() => setSyncFeedback(null), 4000);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to add skill. Please try again.');
    }
  };

  // Open Edit Modal for a skill
  const openEditModal = (skill: SkillItem) => {
    setEditingSkill(skill);
    setEditName(skill.name);
    setEditCategory(normalizeToPrimarySection(skill.category));
    setEditLevel(skill.level);
    setEditScore(skill.score);
    setEditTargetScore(skill.targetScore);
    setEditStatus(skill.status);
    setEditSource(skill.source || (skill.isAiExtracted ? 'resume' : 'manual'));
    setEditNotes(skill.notes || '');
    setEditError('');
  };

  // Handle Edit Submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    if (!editName.trim()) {
      setEditError('Skill name cannot be empty.');
      return;
    }

    try {
      const isResume = editSource === 'resume_extracted' || editSource === 'resume';
      await updateSkill(editingSkill.id, {
        name: editName.trim(),
        category: editCategory,
        level: editLevel,
        score: Number(editScore),
        targetScore: Number(editTargetScore),
        status: editStatus,
        source: isResume ? 'resume' : 'manual',
        isAiExtracted: isResume,
        confirmedByCandidate: true, // Candidate confirmed by editing
        notes: editNotes.trim() || undefined,
      });

      setEditingSkill(null);
      setSyncFeedback(`Successfully updated "${editName.trim()}".`);
      setTimeout(() => setSyncFeedback(null), 4000);
    } catch (err: any) {
      setEditError(err?.message || 'Failed to update skill.');
    }
  };

  // Confirm All AI skills at once
  const handleConfirmAllAiSkills = async () => {
    for (const s of unconfirmedAiSkills) {
      await confirmAiSkill(s.id);
    }
    setSyncFeedback('All AI-extracted skills have been confirmed and verified.');
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  // Helper for visual level badge
  const renderLevelBadge = (level: ProficiencyLevel) => {
    const levelConfigs: Record<
      ProficiencyLevel,
      { label: string; bg: string; dots: number }
    > = {
      Beginner: { label: 'Beginner', bg: 'bg-sky-50 border-sky-200 text-sky-700', dots: 1 },
      Intermediate: { label: 'Intermediate', bg: 'bg-blue-50 border-blue-200 text-blue-700', dots: 2 },
      Advanced: { label: 'Advanced', bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', dots: 3 },
      Expert: { label: 'Expert', bg: 'bg-purple-50 border-purple-200 text-purple-700', dots: 4 },
    };

    const config = levelConfigs[level] || levelConfigs.Intermediate;

    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${config.bg}`}
        title={`Proficiency Level: ${config.label}`}
      >
        <span className="flex items-center gap-0.5" aria-hidden="true">
          {[1, 2, 3, 4].map((dot) => (
            <span
              key={dot}
              className={`w-1.5 h-1.5 rounded-full ${
                dot <= config.dots ? 'bg-current' : 'bg-slate-300'
              }`}
            />
          ))}
        </span>
        <span>{config.label}</span>
      </span>
    );
  };

  // Identify which role benchmark skills are already in inventory vs missing
  const roleAlignment = useMemo(() => {
    const roleSkills = gapMetric.skills || [];
    const matched: typeof roleSkills = [];
    const missing: typeof roleSkills = [];

    roleSkills.forEach((roleItem) => {
      const existsInInventory = skills.some(
        (s) => s.name.toLowerCase() === roleItem.name.toLowerCase()
      );
      if (existsInInventory && roleItem.currentScore >= roleItem.requiredScore * 0.9) {
        matched.push(roleItem);
      } else {
        missing.push(roleItem);
      }
    });

    return { matched, missing };
  }, [gapMetric.skills, skills]);

  return (
    <PageContainer
      title="My Skills Inventory"
      description="View, calibrate, and verify your competencies across full-stack architecture, systems, and professional collaboration."
      badge={
        <Badge variant="primary" size="md">
          {skills.length} Total Competencies
        </Badge>
      }
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {/* Backend Synchronization Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncWithCloud}
            isLoading={isSyncing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />}
            title="Synchronize inventory with backend storage"
          >
            Sync with Cloud
          </Button>

          {/* Upload Resume Shortcut */}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileUp className="w-3.5 h-3.5 text-indigo-600" />}
            onClick={() => setActiveNav('resume-upload')}
            title="Upload resume to extract skills"
          >
            Upload Resume
          </Button>

          {/* Add Skill Button */}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => openAddModal()}
          >
            Add New Skill
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* SYNC NOTIFICATION BANNER */}
        {syncFeedback && (
          <Alert
            variant="success"
            title="Cloud Synchronization"
            message={syncFeedback}
            onDismiss={() => setSyncFeedback(null)}
          />
        )}

        {/* ========================================================================= */}
        {/* SUMMARY STATS BAR */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Stat 1: Total Recorded */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Recorded
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{skills.length}</span>
              <span className="text-xs text-slate-500">skills</span>
            </div>
            <span className="text-[11px] text-slate-400 block truncate">
              Across 4 core domains
            </span>
          </div>

          {/* Stat 2: Verified Skills */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Verified
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600">{verifiedSkills.length}</span>
              <Badge variant="success" size="sm">
                {skills.length > 0 ? Math.round((verifiedSkills.length / skills.length) * 100) : 0}%
              </Badge>
            </div>
            <span className="text-[11px] text-slate-400 block truncate">
              Assessed or certified
            </span>
          </div>

          {/* Stat 3: AI Resume-Extracted */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Resume Extracted (AI)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-indigo-600">{aiExtractedSkills.length}</span>
              {unconfirmedAiSkills.length > 0 ? (
                <Badge variant="warning" size="sm">
                  {unconfirmedAiSkills.length} Review
                </Badge>
              ) : (
                <Badge variant="neutral" size="sm">Audited</Badge>
              )}
            </div>
            <span className="text-[11px] text-slate-400 block truncate">
              {manuallyAddedSkills.length} added manually
            </span>
          </div>

          {/* Stat 4: Target Role Fit */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Target Role Alignment
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-600">{gapMetric.overallMatchRate}%</span>
              <span className="text-xs text-slate-500 font-medium truncate" title={user.targetRole}>
                {user.targetRole}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowRoleAlignment(!showRoleAlignment)}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              {showRoleAlignment ? 'Hide Matched vs Missing' : 'Inspect Matched vs Missing'}
              <ChevronDown className={`w-3 h-3 transition-transform ${showRoleAlignment ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* AI EXTRACTION AUDIT & REVIEW GUARDRAIL BANNER */}
        {/* Addresses: "Skills extracted by AI should be editable by the user. Do not silently treat AI extraction as always correct." */}
        {/* ========================================================================= */}
        {unconfirmedAiSkills.length > 0 && !isAiBannerDismissed && (
          <div className="p-4 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-blue-50/70 to-slate-50 text-slate-900 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-indigo-950">
                      AI Resume Extraction Review ({unconfirmedAiSkills.length} Pending Audit)
                    </h4>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-200 text-indigo-800 rounded-full">
                      Audit Required
                    </span>
                  </div>
                  <p className="text-xs text-indigo-900/90 max-w-3xl leading-relaxed">
                    Automated extraction parsed these competencies from your resume. AI models can infer, misclassify, or overestimate experience levels. Please review each skill, adjust the proficiency score or category, or delete entries that are inaccurate.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiBannerDismissed(true)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-indigo-100 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-indigo-800 font-medium">Pending skills:</span>
                {unconfirmedAiSkills.slice(0, 3).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => openEditModal(s)}
                    className="px-2 py-0.5 bg-white border border-indigo-200 hover:border-indigo-400 rounded-md text-[11px] font-medium text-indigo-900 shadow-2xs transition-colors cursor-pointer"
                  >
                    {s.name} (Edit)
                  </button>
                ))}
                {unconfirmedAiSkills.length > 3 && (
                  <span className="text-[11px] text-indigo-600 font-semibold">
                    +{unconfirmedAiSkills.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-indigo-300 text-indigo-800 hover:bg-indigo-50 text-xs h-7"
                  onClick={() => setSourceFilter('unconfirmed')}
                >
                  Filter Unconfirmed ({unconfirmedAiSkills.length})
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7"
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                  onClick={handleConfirmAllAiSkills}
                >
                  Confirm All as Accurate
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* COLLAPSIBLE ROLE ALIGNMENT: MATCHED VS MISSING SKILLS */}
        {/* Addresses: "Clearly distinguish matched/current skills from missing skills where applicable." */}
        {/* ========================================================================= */}
        {showRoleAlignment && (
          <Card className="border-blue-200 bg-blue-50/20">
            <CardHeader className="pb-3 border-b border-blue-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-slate-900">
                      Target Role Benchmark: {user.targetRole}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Comparison between skills currently in your profile versus required market benchmarks
                    </CardDescription>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => setActiveNav('skill-gap')}
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Open Full Gap Matrix
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Matched Current Skills */}
              <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Current Matched Skills ({roleAlignment.matched.length})
                    </span>
                  </div>
                  <Badge variant="success" size="sm">Satisfies Benchmark</Badge>
                </div>
                <p className="text-[11px] text-slate-500">
                  Skills in your inventory that align with target role proficiency requirements.
                </p>

                <div className="space-y-2 pt-1">
                  {roleAlignment.matched.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No fully benchmarked skills recorded yet.</p>
                  ) : (
                    roleAlignment.matched.map((m) => (
                      <div
                        key={m.id}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-800">{m.name}</span>
                          <span className="text-[10px] text-slate-500 block">
                            Score: <strong>{m.currentScore}%</strong> (Target: {m.requiredScore}%)
                          </span>
                        </div>
                        <Badge variant="success" size="sm">Aligned</Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Missing / High Priority Skills */}
              <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                      Missing / Gap Skills ({roleAlignment.missing.length})
                    </span>
                  </div>
                  <Badge variant="warning" size="sm">Action Recommended</Badge>
                </div>
                <p className="text-[11px] text-slate-500">
                  Required competencies missing from your profile or lagging behind industry standards.
                </p>

                <div className="space-y-2 pt-1">
                  {roleAlignment.missing.length === 0 ? (
                    <p className="text-xs text-emerald-600 font-medium">All benchmark skills satisfied!</p>
                  ) : (
                    roleAlignment.missing.map((m) => (
                      <div
                        key={m.id}
                        className="p-2 rounded-lg bg-amber-50/40 border border-amber-100 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900">{m.name}</span>
                            <span className="text-[10px] text-rose-600 font-bold">-{m.gap}% Gap</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            Current: {m.currentScore}% • Target: {m.requiredScore}%
                          </span>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[11px] bg-white border-amber-300 text-amber-900 hover:bg-amber-100"
                          leftIcon={<Plus className="w-3 h-3" />}
                          onClick={() =>
                            openAddModal({
                              name: m.name,
                              category: normalizeToPrimarySection(m.category),
                              targetScore: m.requiredScore,
                            })
                          }
                        >
                          Add to Skills
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* SEARCH & MULTI-DIMENSIONAL FILTER TOOLBAR */}
        {/* ========================================================================= */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="w-full md:w-80">
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch('')}
                placeholder="Search skills, tools, or notes..."
                sizeVariant="sm"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center justify-between sm:justify-end gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('sections')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                    viewMode === 'sections'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Grouped by the 4 visual sections"
                >
                  Visual Sections
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('chips')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                    viewMode === 'chips'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Compact Skill Chips / Tags view"
                >
                  Skill Chips
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('compact')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                    viewMode === 'compact'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Compact Data List view"
                >
                  List View
                </button>
              </div>

              {/* AI extraction trigger for uploaded resume */}
              <button
                type="button"
                onClick={handleSimulateExtraction}
                disabled={isSyncing}
                className="text-[11px] text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Extract skills from uploaded resume with Gemini AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isSyncing ? 'Extracting Skills...' : 'AI Extract Skills'}</span>
              </button>
            </div>
          </div>

          {/* Filter Pills Row */}
          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100 text-xs">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-semibold text-slate-400 uppercase mr-1">Section:</span>
              {['All', 'Technical Skills', 'Soft Skills', 'Tools & Technologies', 'Other Skills'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all font-medium cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-200 hidden lg:block" />

            {/* Level Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-semibold text-slate-400 uppercase mr-1">Level:</span>
              {['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all font-medium cursor-pointer ${
                    levelFilter === lvl
                      ? 'bg-slate-800 text-white shadow-2xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-200 hidden lg:block" />

            {/* Source Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-semibold text-slate-400 uppercase mr-1">Source:</span>
              {[
                { key: 'All', label: 'All Sources' },
                { key: 'ai', label: `AI Extracted (${aiExtractedSkills.length})` },
                { key: 'manual', label: `Manual (${manuallyAddedSkills.length})` },
                { key: 'unconfirmed', label: `Needs Review (${unconfirmedAiSkills.length})` },
              ].map((src) => (
                <button
                  key={src.key}
                  type="button"
                  onClick={() => setSourceFilter(src.key as typeof sourceFilter)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all font-medium cursor-pointer ${
                    sourceFilter === src.key
                      ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SKILLS PRESENTATION (SECTIONS / CHIPS / COMPACT) */}
        {/* ========================================================================= */}
        {filteredSkills.length === 0 ? (
          <EmptyState
            title="No skills found"
            description={
              search
                ? `No competencies matched "${search}". Try clearing your search term or adjusting filters.`
                : 'No skills match the active category, level, or source filters.'
            }
            actionLabel="Add New Skill"
            onAction={() => openAddModal()}
            secondaryActionLabel={search || categoryFilter !== 'All' || levelFilter !== 'All' || sourceFilter !== 'All' ? 'Reset All Filters' : undefined}
            onSecondaryAction={() => {
              setSearch('');
              setCategoryFilter('All');
              setLevelFilter('All');
              setSourceFilter('All');
            }}
          />
        ) : viewMode === 'chips' ? (
          /* ======================================================================= */
          /* CHIPS VIEW MODE */
          /* ======================================================================= */
          <div className="space-y-6">
            {SECTION_CONFIGS.map((sec) => {
              const sectionSkills = skillsBySection[sec.title];
              if (sectionSkills.length === 0 && categoryFilter !== 'All') return null;

              return (
                <Card key={sec.title}>
                  <CardHeader className="py-3 px-5 border-b border-slate-100 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${sec.bgLight} ${sec.accentColor} flex items-center justify-center`}>
                        <sec.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-slate-900">{sec.title}</CardTitle>
                        <span className="text-[11px] text-slate-500">
                          {sectionSkills.length} competencies recorded
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      leftIcon={<Plus className="w-3 h-3" />}
                      onClick={() => openAddModal({ category: sec.title })}
                    >
                      Add
                    </Button>
                  </CardHeader>

                  <CardContent className="p-5">
                    {sectionSkills.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No skills recorded in this section.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2.5">
                        {sectionSkills.map((skill) => (
                          <div key={skill.id} className="relative group">
                            <SkillChip
                              skill={skill}
                              showLevel={true}
                              showScore={true}
                              showSource={true}
                              onClick={() => openEditModal(skill)}
                              onRemove={() => setDeletingSkill(skill)}
                            />
                            {/* Unconfirmed AI badge indicator on chip */}
                            {(skill.source === 'resume_extracted' || skill.isAiExtracted) && !skill.confirmedByCandidate && (
                              <span
                                className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"
                                title="Needs candidate review"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : viewMode === 'compact' ? (
          /* ======================================================================= */
          /* COMPACT LIST VIEW MODE */
          /* ======================================================================= */
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold">
                    <th className="py-3 px-4">Skill / Competency</th>
                    <th className="py-3 px-4">Section Category</th>
                    <th className="py-3 px-4">Proficiency Level</th>
                    <th className="py-3 px-4">Score / Benchmark</th>
                    <th className="py-3 px-4">Origin / Source</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSkills.map((skill) => {
                    const isAi = skill.source === 'resume_extracted' || skill.isAiExtracted;
                    return (
                      <tr key={skill.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{skill.name}</div>
                          {skill.notes && (
                            <span className="text-[10px] text-slate-400 block truncate max-w-xs">
                              {skill.notes}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-700">
                            {normalizeToPrimarySection(skill.category)}
                          </span>
                        </td>
                        <td className="py-3 px-4">{renderLevelBadge(skill.level)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 tabular-nums">{skill.score}%</span>
                            <span className="text-slate-400 text-[10px]">/ {skill.targetScore}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isAi ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                              <Sparkles className="w-3 h-3 text-indigo-500" />
                              Resume (AI)
                              {!skill.confirmedByCandidate && (
                                <span className="text-[10px] text-amber-600 font-bold ml-0.5">• Review</span>
                              )}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                              <UserCheck className="w-3 h-3 text-slate-500" />
                              Manual
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              skill.status === 'Verified'
                                ? 'success'
                                : skill.status === 'Learning'
                                ? 'primary'
                                : 'neutral'
                            }
                            size="sm"
                            dot
                          >
                            {skill.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {isAi && !skill.confirmedByCandidate && (
                              <button
                                type="button"
                                onClick={() => confirmAiSkill(skill.id)}
                                className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                                title="Confirm accuracy of AI extraction"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => openEditModal(skill)}
                              className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                              title="Edit skill details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingSkill(skill)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Remove skill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          /* ======================================================================= */
          /* PRIMARY SECTION CARD GRID VIEW */
          /* Renders the 4 requested visual sections: Technical Skills, Soft Skills, Tools & Technologies, Other Skills */
          /* ======================================================================= */
          <div className="space-y-8">
            {SECTION_CONFIGS.map((sec) => {
              const sectionSkills = skillsBySection[sec.title];
              // If filtering by specific category and this section has no matches, skip
              if (categoryFilter !== 'All' && categoryFilter !== sec.title) return null;

              const avgScore =
                sectionSkills.length > 0
                  ? Math.round(
                      sectionSkills.reduce((acc, curr) => acc + curr.score, 0) / sectionSkills.length
                    )
                  : 0;

              return (
                <section key={sec.title} className="space-y-3.5">
                  {/* Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${sec.bgLight} ${sec.accentColor} flex items-center justify-center shrink-0`}>
                        <sec.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 tracking-tight">
                            {sec.title}
                          </h3>
                          <Badge variant="neutral" size="sm">
                            {sectionSkills.length} {sectionSkills.length === 1 ? 'skill' : 'skills'}
                          </Badge>
                          {sectionSkills.length > 0 && (
                            <span className="text-xs text-slate-500 font-medium">
                              Avg Proficiency: <strong className="text-slate-800">{avgScore}%</strong>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                          {sec.description}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs shrink-0 self-end sm:self-center"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={() => openAddModal({ category: sec.title })}
                    >
                      Add to {sec.title.split(' ')[0]}
                    </Button>
                  </div>

                  {/* Skills Grid for this section */}
                  {sectionSkills.length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-slate-300 text-center bg-slate-50/50 space-y-2">
                      <p className="text-xs text-slate-500">
                        No competencies currently recorded in {sec.title}.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                        onClick={() => openAddModal({ category: sec.title })}
                      >
                        Record First {sec.title.split(' ')[0]} Competency
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sectionSkills.map((skill) => {
                        const isAi = skill.source === 'resume_extracted' || skill.isAiExtracted;
                        const isUnconfirmed = isAi && !skill.confirmedByCandidate;

                        return (
                          <Card
                            key={skill.id}
                            hoverable
                            className={`flex flex-col justify-between transition-all ${
                              isUnconfirmed
                                ? 'border-indigo-300 ring-1 ring-indigo-200/60 bg-gradient-to-b from-indigo-50/20 to-white'
                                : 'border-slate-200'
                            }`}
                          >
                            <CardContent className="p-4.5 space-y-3">
                              {/* Card Header: Source tag & Status badge */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                  {/* Origin Indication: AI Extracted vs Manually Added */}
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {isAi ? (
                                      <span
                                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                          isUnconfirmed
                                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                        }`}
                                        title={
                                          skill.aiConfidence
                                            ? `Extracted from resume with ${skill.aiConfidence}% AI match confidence.`
                                            : 'Extracted from resume.'
                                        }
                                      >
                                        <Sparkles className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
                                        <span>Resume Extracted</span>
                                        {skill.aiConfidence && (
                                          <span className="text-indigo-500 font-medium">
                                            ({skill.aiConfidence}%)
                                          </span>
                                        )}
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                                        <UserCheck className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                                        <span>Manually Added</span>
                                      </span>
                                    )}

                                    {isUnconfirmed && (
                                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded">
                                        Audit Needed
                                      </span>
                                    )}
                                  </div>

                                  {/* Skill Name */}
                                  <h4 className="text-base font-bold text-slate-900 leading-snug pt-0.5">
                                    {skill.name}
                                  </h4>
                                </div>

                                {/* Verification Status Badge */}
                                <Badge
                                  variant={
                                    skill.status === 'Verified'
                                      ? 'success'
                                      : skill.status === 'Learning'
                                      ? 'primary'
                                      : 'neutral'
                                  }
                                  size="sm"
                                  dot
                                >
                                  {skill.status}
                                </Badge>
                              </div>

                              {/* Proficiency Level Indicator (Beginner / Intermediate / Advanced / Expert) */}
                              <div className="flex items-center justify-between text-xs pt-1">
                                <span className="text-slate-500 font-medium">Level:</span>
                                {renderLevelBadge(skill.level)}
                              </div>

                              {/* Score and Target Progress Meter */}
                              <div className="space-y-1.5 pt-0.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-slate-600 font-medium">Proficiency Score</span>
                                  <div className="flex items-baseline gap-1">
                                    <span className="font-bold text-slate-900 tabular-nums text-sm">
                                      {skill.score}%
                                    </span>
                                    <span className="text-[11px] text-slate-400">
                                      / target {skill.targetScore}%
                                    </span>
                                  </div>
                                </div>

                                <ProgressBar
                                  value={skill.score}
                                  size="sm"
                                  variant={
                                    skill.score >= 80
                                      ? 'success'
                                      : skill.score >= 60
                                      ? 'primary'
                                      : 'warning'
                                  }
                                />
                              </div>

                              {/* AI Extraction Notes or Evidence Snippet if present */}
                              {skill.notes && (
                                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 flex items-start gap-1.5">
                                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                  <span className="line-clamp-2">{skill.notes}</span>
                                </div>
                              )}

                              {/* Last updated footer */}
                              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
                                <span>Updated {skill.lastUpdated}</span>
                                {skill.status === 'Verified' && (
                                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Certified
                                  </span>
                                )}
                              </div>
                            </CardContent>

                            {/* Card Action Controls */}
                            <div className="px-4.5 py-2.5 bg-slate-50/80 rounded-b-xl border-t border-slate-100 flex items-center justify-between">
                              {/* Quick score stepper */}
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => updateSkillScore(skill.id, Math.max(0, skill.score - 5))}
                                  className="w-6 h-6 rounded border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                                  title="Decrease score by 5%"
                                >
                                  -
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateSkillScore(skill.id, Math.min(100, skill.score + 5))}
                                  className="w-6 h-6 rounded border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                                  title="Increase score by 5%"
                                >
                                  +
                                </button>
                                <span className="text-[11px] text-slate-500 ml-1">Calibrate</span>
                              </div>

                              {/* Actions: Confirm AI, Edit, Delete */}
                              <div className="flex items-center gap-1.5">
                                {isUnconfirmed && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-[11px] bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                                    onClick={() => confirmAiSkill(skill.id)}
                                    leftIcon={<Check className="w-3 h-3" />}
                                    title="Confirm accuracy of AI extraction"
                                  >
                                    Verify
                                  </Button>
                                )}

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-slate-600 hover:text-blue-600 text-xs"
                                  onClick={() => openEditModal(skill)}
                                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                                >
                                  Edit
                                </Button>

                                <button
                                  type="button"
                                  onClick={() => setDeletingSkill(skill)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title={`Remove ${skill.name}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ADD SKILL MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormError('');
        }}
        title="Add Competency to Inventory"
        description="Register a technical language, collaborative practice, or systems framework to benchmark your profile."
        maxWidth="md"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setFormError('');
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddSubmit}>
              Save Competency
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {formError && (
            <Alert variant="error" title="Invalid Input" message={formError} />
          )}

          {/* Skill Name */}
          <div className="space-y-1.5">
            <Input
              label="Skill or Competency Name"
              placeholder="e.g., Go Programming, Microservices, Kubernetes"
              value={newSkillName}
              onChange={(e) => {
                setNewSkillName(e.target.value);
                if (formError) setFormError('');
              }}
              required
            />

            {/* Quick autocomplete suggestion chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Suggestions:</span>
              {COMMON_SKILL_SUGGESTIONS.slice(0, 4).map((sugg) => (
                <button
                  key={sugg.name}
                  type="button"
                  onClick={() => {
                    setNewSkillName(sugg.name);
                    setNewCategory(sugg.category);
                    setNewLevel(sugg.level);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-[10px] text-slate-600 transition-colors cursor-pointer"
                >
                  +{sugg.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section Category and Proficiency Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Select
              label="Visual Section Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as PrimarySkillSection)}
              options={[
                { value: 'Technical Skills', label: 'Technical Skills' },
                { value: 'Soft Skills', label: 'Soft Skills' },
                { value: 'Tools & Technologies', label: 'Tools & Technologies' },
                { value: 'Other Skills', label: 'Other Skills' },
              ]}
            />

            <Select
              label="Proficiency Tier"
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value as ProficiencyLevel)}
              options={[
                { value: 'Beginner', label: 'Beginner (Learning fundamentals)' },
                { value: 'Intermediate', label: 'Intermediate (Practical application)' },
                { value: 'Advanced', label: 'Advanced (Production mastery)' },
                { value: 'Expert', label: 'Expert (Architectural authority)' },
              ]}
            />
          </div>

          {/* Current Score and Target Benchmark */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700">Current Score (%)</label>
                <span className="font-bold text-blue-600 tabular-nums">{newScore}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={newScore}
                onChange={(e) => setNewScore(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700">Target Goal (%)</label>
                <span className="font-bold text-slate-700 tabular-nums">{newTargetScore}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={newTargetScore}
                onChange={(e) => setNewTargetScore(Number(e.target.value))}
                className="w-full accent-slate-800 cursor-pointer"
              />
            </div>
          </div>

          {/* Origin and Verification Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Select
              label="Competency Origin"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value as SkillSource)}
              options={[
                { value: 'manually_added', label: 'Manually Added by Candidate' },
                { value: 'resume_extracted', label: 'Resume Extracted (Simulated AI)' },
              ]}
            />

            <Select
              label="Validation Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as SkillStatus)}
              options={[
                { value: 'Self-Assessed', label: 'Self-Assessed' },
                { value: 'Verified', label: 'Verified (Certified / Coursework)' },
                { value: 'Learning', label: 'Learning (Active Study)' },
              ]}
            />
          </div>

          {/* Notes / Evidence */}
          <Input
            label="Notes / Project Evidence (Optional)"
            placeholder="e.g., Applied in distributed microservices project or formal certification."
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
          />
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* EDIT SKILL MODAL */}
      {/* Explicitly supports: "Skills extracted by AI should be editable by the user." */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(editingSkill)}
        onClose={() => {
          setEditingSkill(null);
          setEditError('');
        }}
        title={`Edit Skill: ${editingSkill?.name || ''}`}
        description="Modify competency name, categorization, proficiency level, or adjust calibration."
        maxWidth="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => {
                if (editingSkill) {
                  setDeletingSkill(editingSkill);
                  setEditingSkill(null);
                }
              }}
            >
              Delete
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingSkill(null);
                  setEditError('');
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleEditSubmit}>
                Save Changes
              </Button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {/* AI Extraction Audit Callout if editing an AI skill */}
          {editingSkill && (editingSkill.source === 'resume_extracted' || editingSkill.isAiExtracted) && (
            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Resume Extraction Notice</span>
              </div>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                This skill was originally extracted by automated resume parsing. You have full permission to alter the name, proficiency level, or category if the automated parser inferred incorrect information.
              </p>
            </div>
          )}

          {editError && (
            <Alert variant="error" title="Edit Error" message={editError} />
          )}

          {/* Skill Name */}
          <Input
            label="Skill Name"
            value={editName}
            onChange={(e) => {
              setEditName(e.target.value);
              if (editError) setEditError('');
            }}
            required
          />

          {/* Section Category and Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Select
              label="Visual Section Category"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as PrimarySkillSection)}
              options={[
                { value: 'Technical Skills', label: 'Technical Skills' },
                { value: 'Soft Skills', label: 'Soft Skills' },
                { value: 'Tools & Technologies', label: 'Tools & Technologies' },
                { value: 'Other Skills', label: 'Other Skills' },
              ]}
            />

            <Select
              label="Proficiency Tier"
              value={editLevel}
              onChange={(e) => setEditLevel(e.target.value as ProficiencyLevel)}
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' },
                { value: 'Expert', label: 'Expert' },
              ]}
            />
          </div>

          {/* Current Score and Target Score */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700">Proficiency Score (%)</label>
                <span className="font-bold text-blue-600 tabular-nums">{editScore}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={editScore}
                onChange={(e) => setEditScore(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700">Target Benchmark (%)</label>
                <span className="font-bold text-slate-700 tabular-nums">{editTargetScore}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={editTargetScore}
                onChange={(e) => setEditTargetScore(Number(e.target.value))}
                className="w-full accent-slate-800 cursor-pointer"
              />
            </div>
          </div>

          {/* Origin & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Select
              label="Source Origin"
              value={editSource}
              onChange={(e) => setEditSource(e.target.value as SkillSource)}
              options={[
                { value: 'manually_added', label: 'Manually Added' },
                { value: 'resume_extracted', label: 'Resume Extracted (AI)' },
              ]}
            />

            <Select
              label="Verification Status"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as SkillStatus)}
              options={[
                { value: 'Self-Assessed', label: 'Self-Assessed' },
                { value: 'Verified', label: 'Verified' },
                { value: 'Learning', label: 'Learning' },
              ]}
            />
          </div>

          {/* Notes */}
          <Input
            label="Candidate Notes or Context"
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            placeholder="e.g., Course lab, hackathon project, verified credential"
          />
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(deletingSkill)}
        onClose={() => setDeletingSkill(null)}
        title="Remove Skill Competency"
        description="Are you sure you want to remove this competency from your active skill catalog?"
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDeletingSkill(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                if (deletingSkill) {
                  try {
                    await deleteSkill(deletingSkill.id);
                    setSyncFeedback(`Successfully removed "${deletingSkill.name}" from your profile.`);
                    setTimeout(() => setSyncFeedback(null), 4000);
                  } catch (err: any) {
                    setSyncFeedback(err?.message || 'Failed to remove skill.');
                    setTimeout(() => setSyncFeedback(null), 4000);
                  } finally {
                    setDeletingSkill(null);
                  }
                }
              }}
            >
              Confirm Removal
            </Button>
          </>
        }
      >
        {deletingSkill && (
          <div className="space-y-3 text-xs text-slate-600">
            <p>
              You are removing <strong className="text-slate-900">{deletingSkill.name}</strong> (
              {normalizeToPrimarySection(deletingSkill.category)}).
            </p>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <strong>Notice:</strong> Removing this skill will immediately update your overall profile readiness score and recalculate your benchmark match against <span className="font-semibold">{user.targetRole}</span>.
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

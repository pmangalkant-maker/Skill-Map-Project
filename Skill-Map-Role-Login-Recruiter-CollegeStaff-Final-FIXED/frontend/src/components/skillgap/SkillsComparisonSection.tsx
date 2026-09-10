import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Plus,
  ArrowRight,
  Search,
  BookOpen,
  HelpCircle,
  Clock,
  Layers,
  Check,
  Filter,
} from 'lucide-react';
import { SkillMatchItem, MatchStatus } from '../../services/matchingApi';
import { useApp } from '../../context/AppContext';

interface SkillsComparisonSectionProps {
  matchedSkills: SkillMatchItem[];
  partiallyMatchedSkills: SkillMatchItem[];
  missingSkills: SkillMatchItem[];
  allRequiredSkills: SkillMatchItem[];
  onAddMissingSkill: (skill: SkillMatchItem) => void;
  addedSkillIds: Set<string>;
}

export const SkillsComparisonSection: React.FC<SkillsComparisonSectionProps> = ({
  matchedSkills,
  partiallyMatchedSkills,
  missingSkills,
  allRequiredSkills,
  onAddMissingSkill,
  addedSkillIds,
}) => {
  const { setActiveNav } = useApp();
  const [filterStatus, setFilterStatus] = useState<MatchStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');

  // Filter skills based on search query and status tab
  const filterList = (items: SkillMatchItem[]) => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.marketDemandRationale.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredAll = filterList(allRequiredSkills);
  const filteredMatched = filterList(matchedSkills);
  const filteredPartial = filterList(partiallyMatchedSkills);
  const filteredMissing = filterList(missingSkills);

  const renderSkillRow = (skill: SkillMatchItem) => {
    const isAdded = addedSkillIds.has(skill.id) || skill.isInCandidateProfile;

    // Visual themes strictly adhering to requirements:
    // Green for matched, Amber for partial, Red for missing
    const statusConfig = {
      Matched: {
        container: 'border-emerald-200/80 bg-emerald-50/20 hover:border-emerald-300',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
        accentText: 'text-emerald-700',
        progressVariant: 'success' as const,
        label: 'Benchmark Satisfied',
      },
      'Partially Matched': {
        container: 'border-amber-200/80 bg-amber-50/20 hover:border-amber-300',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
        accentText: 'text-amber-700',
        progressVariant: 'warning' as const,
        label: 'Deficit to Bridge',
      },
      Missing: {
        container: 'border-rose-200/80 bg-rose-50/20 hover:border-rose-300',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
        accentText: 'text-rose-700',
        progressVariant: 'danger' as const,
        label: 'Missing from Profile',
      },
    };

    const config = statusConfig[skill.status];

    return (
      <div
        key={skill.id}
        className={`p-4 rounded-xl border transition-all shadow-xs space-y-3 ${config.container}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          {/* Title & Metadata */}
          <div className="flex items-start gap-3">
            {config.icon}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-slate-900 text-sm">{skill.name}</h4>
                <Badge
                  variant={
                    skill.weight === 'Core Required'
                      ? 'danger'
                      : skill.weight === 'Important'
                      ? 'warning'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {skill.weight} ({skill.weightPercentage}%)
                </Badge>
                <span className="text-xs text-slate-500">• {skill.category}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                {skill.marketDemandRationale}
              </p>
            </div>
          </div>

          {/* Status Badge & Delta */}
          <div className="flex items-center sm:flex-col sm:items-end gap-2 shrink-0">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md border inline-flex items-center gap-1 ${config.badge}`}
            >
              {config.label}
            </span>
            {skill.gap > 0 ? (
              <span className="text-xs font-bold text-rose-600">
                Gap: -{skill.gap}% deficit
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600">
                Surplus: +{Math.max(0, skill.candidateScore - skill.requiredScore)}%
              </span>
            )}
          </div>
        </div>

        {/* Progress & Comparative Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200/60 text-xs">
          {/* Visual Progress Bar */}
          <div className="md:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between font-medium text-slate-600">
              <span>
                Your Score:{' '}
                <strong className={skill.candidateScore > 0 ? 'text-slate-900' : 'text-rose-600'}>
                  {skill.candidateScore}% ({skill.candidateLevel})
                </strong>
              </span>
              <span>
                Required Benchmark:{' '}
                <strong className="text-slate-900">
                  {skill.requiredScore}% ({skill.requiredLevel})
                </strong>
              </span>
            </div>
            <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  skill.status === 'Matched'
                    ? 'bg-emerald-500'
                    : skill.status === 'Partially Matched'
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.round(skill.matchRatio * 100))}%` }}
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            {skill.status === 'Missing' && !isAdded && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onAddMissingSkill(skill)}
                leftIcon={<Plus className="w-3 h-3" />}
              >
                Add to My Skills
              </Button>
            )}

            {isAdded && skill.status === 'Missing' && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-md font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Added to Profile
              </span>
            )}

            {skill.gap > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveNav('roadmap')}
                rightIcon={<ArrowRight className="w-3 h-3" />}
              >
                Bridge Gap
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveNav('my-skills')}
                leftIcon={<Check className="w-3 h-3 text-emerald-600" />}
              >
                View in Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Required Skills &amp; Detailed Alignment</CardTitle>
            <CardDescription>
              All baseline requirements for the target role clearly categorized into matched, partial,
              and missing states.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search required skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('grouped')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  viewMode === 'grouped'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Grouped
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Filtered List
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed Filter Pills */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              filterStatus === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Required ({allRequiredSkills.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('Matched')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filterStatus === 'Matched'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Matched ({matchedSkills.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('Partially Matched')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filterStatus === 'Partially Matched'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Partially Matched ({partiallyMatchedSkills.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('Missing')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filterStatus === 'Missing'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Missing ({missingSkills.length})</span>
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {filteredAll.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-xs text-slate-500">
              No skills match your filter or search query.
            </p>
          </div>
        ) : viewMode === 'grouped' && filterStatus === 'ALL' ? (
          <div className="space-y-8">
            {/* Section 1: Matched Skills (Green) */}
            {filteredMatched.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h3 className="font-bold text-sm text-emerald-950">
                      Matched Skills ({filteredMatched.length})
                    </h3>
                  </div>
                  <span className="text-xs text-emerald-700 font-medium">
                    Profile satisfies benchmark standard
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredMatched.map(renderSkillRow)}
                </div>
              </div>
            )}

            {/* Section 2: Partially Matched Skills (Amber) */}
            {filteredPartial.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h3 className="font-bold text-sm text-amber-950">
                      Partially Matched Skills ({filteredPartial.length})
                    </h3>
                  </div>
                  <span className="text-xs text-amber-700 font-medium">
                    Demonstrated competency below role benchmark
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredPartial.map(renderSkillRow)}
                </div>
              </div>
            )}

            {/* Section 3: Missing Skills (Red) */}
            {filteredMissing.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <h3 className="font-bold text-sm text-rose-950">
                      Missing Skills ({filteredMissing.length})
                    </h3>
                  </div>
                  <span className="text-xs text-rose-700 font-medium">
                    Prerequisites not yet recorded in talent inventory
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredMissing.map(renderSkillRow)}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* List Mode */
          <div className="space-y-3">
            {filteredAll.map(renderSkillRow)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Briefcase,
  MapPin,
  Clock,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Send,
  Layers,
  Sparkles,
} from 'lucide-react';
import { OpportunityItem } from '../../types';

interface OpportunityCardProps {
  opportunity: OpportunityItem;
  onViewDetails: (opp: OpportunityItem) => void;
  onToggleBookmark: (id: string) => void;
  onApply: (opp: OpportunityItem) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onViewDetails,
  onToggleBookmark,
  onApply,
}) => {
  const {
    id,
    title,
    organization,
    type,
    workMode,
    location,
    experienceLevel = 'Entry Level (0-1 yrs)',
    matchScore,
    stipendOrSalary,
    deadline,
    matchedSkills = [],
    missingSkills = [],
    requiredSkills = [],
    description,
    isBookmarked,
    hasApplied,
  } = opportunity;

  // Match score visual themes
  const getScoreTheme = (score: number) => {
    if (score >= 80) {
      return {
        badgeVariant: 'success' as const,
        border: 'hover:border-emerald-300',
        scoreBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        scoreLabel: 'High Alignment',
      };
    }
    if (score >= 60) {
      return {
        badgeVariant: 'warning' as const,
        border: 'hover:border-amber-300',
        scoreBg: 'bg-amber-50 text-amber-700 border-amber-200',
        scoreLabel: 'Moderate Match',
      };
    }
    return {
      badgeVariant: 'danger' as const,
      border: 'hover:border-rose-300',
      scoreBg: 'bg-rose-50 text-rose-700 border-rose-200',
      scoreLabel: 'Bridging Required',
    };
  };

  const theme = getScoreTheme(matchScore);

  return (
    <Card
      className={`transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between ${theme.border}`}
    >
      <CardContent className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Top Bar: Types, Work Mode, Benchmark tag, Bookmark */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge
                variant={type === 'Internship' ? 'primary' : type === 'Full-time' ? 'success' : 'neutral'}
                size="sm"
              >
                {type}
              </Badge>
              <Badge variant="outline" size="sm">
                {workMode}
              </Badge>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                Sample Benchmark
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleBookmark(id)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Save opportunity'}
                title={isBookmarked ? 'Saved to bookmarks' : 'Save opportunity'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Role Title & Organization */}
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-3">
              <h3
                onClick={() => onViewDetails(opportunity)}
                className="font-bold text-slate-900 text-base sm:text-lg hover:text-blue-600 transition-colors cursor-pointer leading-snug"
              >
                {title}
              </h3>

              {/* Match Score Badge */}
              <div className="shrink-0 text-right">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border shadow-2xs ${theme.scoreBg}`}
                  title={`${theme.scoreLabel} based on candidate verified competencies`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{matchScore}% Match</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium">{organization}</p>
          </div>

          {/* Key Metadata: Location, Experience Level, Salary, Deadline */}
          <div className="flex items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 flex-wrap pt-0.5">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{location}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>{experienceLevel}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{deadline}</span>
            </span>
          </div>

          {/* Role Summary */}
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* Relevance Breakdown: Matching vs Missing Skills */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <span>Why This Matches You</span>
              <span>
                {matchedSkills.length} / {matchedSkills.length + missingSkills.length} Skills Met
              </span>
            </div>

            {/* Matching Skills (Green) */}
            {matchedSkills.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mr-0.5">
                  Matched:
                </span>
                {matchedSkills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{skill}</span>
                  </span>
                ))}
                {matchedSkills.length > 3 && (
                  <span className="text-[11px] text-emerald-700 font-medium">
                    +{matchedSkills.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Missing Skills (Red/Amber) */}
            {missingSkills.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider mr-0.5">
                  Missing:
                </span>
                {missingSkills.slice(0, 2).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md"
                  >
                    <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>{skill}</span>
                  </span>
                ))}
                {missingSkills.length > 2 && (
                  <span className="text-[11px] text-rose-700 font-medium">
                    +{missingSkills.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-700">{stipendOrSalary}</span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(opportunity)}
            >
              View Details
            </Button>

            <Button
              variant={hasApplied ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => onApply(opportunity)}
              disabled={hasApplied}
              leftIcon={
                hasApplied ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )
              }
            >
              {hasApplied ? 'Applied' : 'Quick Apply'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

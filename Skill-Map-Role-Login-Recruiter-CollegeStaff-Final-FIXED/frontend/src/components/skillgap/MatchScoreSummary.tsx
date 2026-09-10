import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { AnalyzeResponse } from '../../services/matchingApi';

interface MatchScoreSummaryProps {
  analysis: AnalyzeResponse;
  onOpenExplanation: () => void;
}

export const MatchScoreSummary: React.FC<MatchScoreSummaryProps> = ({
  analysis,
  onOpenExplanation,
}) => {
  const {
    overallMatchPercentage,
    targetRole,
    matchedSkills,
    partiallyMatchedSkills,
    missingSkills,
    scoreBreakdown,
  } = analysis;

  const total = matchedSkills.length + partiallyMatchedSkills.length + missingSkills.length;

  const getMatchTheme = (score: number) => {
    if (score >= 80) {
      return {
        badge: 'Strong Role Alignment',
        badgeVariant: 'success' as const,
        description: 'Your verified proficiencies closely align with baseline industry expectations.',
        strokeColor: '#10b981', // emerald-500
        bgColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      };
    }
    if (score >= 60) {
      return {
        badge: 'Moderate Alignment',
        badgeVariant: 'warning' as const,
        description: 'You meet key prerequisites with a few high-impact skills left to bridge.',
        strokeColor: '#f59e0b', // amber-500
        bgColor: 'bg-amber-50 text-amber-900 border-amber-200',
      };
    }
    return {
      badge: 'Bridging Foundation',
      badgeVariant: 'danger' as const,
      description: 'Foundational learning phase. Focus on high-weighted core technical skills.',
      strokeColor: '#f43f5e', // rose-500
      bgColor: 'bg-rose-50 text-rose-900 border-rose-200',
    };
  };

  const theme = getMatchTheme(overallMatchPercentage);

  // SVG Circular Meter math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallMatchPercentage / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Primary Match Percentage Card */}
      <Card className="lg:col-span-5 flex flex-col justify-between border-blue-200 shadow-xs bg-gradient-to-b from-white to-blue-50/15">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Overall Role Match Score
              </span>
            </div>
            <Badge variant={theme.badgeVariant} size="sm">
              {theme.badge}
            </Badge>
          </div>

          <div className="flex items-center gap-6 pt-1">
            {/* Circular Progress Gauge */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="text-slate-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={theme.strokeColor}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">
                  {overallMatchPercentage}%
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Match</span>
              </div>
            </div>

            <div className="space-y-1.5 flex-1">
              <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                Benchmark for {targetRole}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {theme.description}
              </p>
              <div className="text-[11px] text-slate-500 pt-0.5">
                Earned: <strong>{scoreBreakdown.earnedWeightedPoints}</strong> / {scoreBreakdown.totalPossibleWeightedPoints} weighted pts
              </div>
            </div>
          </div>

          {/* Explain Why Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenExplanation}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer group"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-500 group-hover:text-blue-700" />
              <span>Understand WHY this score was generated</span>
            </button>

            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Auditable Formula
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown Metric Tiles */}
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Matched Tile (Green) */}
        <Card className="border-emerald-200 bg-emerald-50/30 flex flex-col justify-between">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 uppercase tracking-wider">
              <span>Matched Skills</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-emerald-700 tracking-tight">
              {matchedSkills.length}
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Competencies satisfying or exceeding industry baseline requirements.
            </p>
            <div className="pt-2 text-[11px] text-emerald-700 font-medium">
              {Math.round((matchedSkills.length / (total || 1)) * 100)}% of role prerequisites
            </div>
          </CardContent>
        </Card>

        {/* Partially Matched Tile (Amber) */}
        <Card className="border-amber-200 bg-amber-50/30 flex flex-col justify-between">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-900 uppercase tracking-wider">
              <span>Partially Matched</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-amber-700 tracking-tight">
              {partiallyMatchedSkills.length}
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Demonstrated skill present with a measurable proficiency deficit to close.
            </p>
            <div className="pt-2 text-[11px] text-amber-700 font-medium">
              Actionable bridge opportunities
            </div>
          </CardContent>
        </Card>

        {/* Missing Tile (Red) */}
        <Card className="border-rose-200 bg-rose-50/30 flex flex-col justify-between">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-900 uppercase tracking-wider">
              <span>Missing Skills</span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-3xl font-bold text-rose-700 tracking-tight">
              {missingSkills.length}
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              Required benchmark competencies not yet recorded in your candidate profile.
            </p>
            <div className="pt-2 text-[11px] text-rose-700 font-medium">
              Add directly to inventory
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

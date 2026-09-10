import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import {
  Target,
  Award,
  AlertCircle,
  Clock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface RoadmapHeaderSummaryProps {
  targetRole: string;
  currentSkillLevel: string;
  missingSkills: string[];
  totalEstimatedHours: number;
  totalCompletedHours: number;
  overallProgressPercentage: number;
  completedStagesCount: number;
  totalStagesCount: number;
}

export const RoadmapHeaderSummary: React.FC<RoadmapHeaderSummaryProps> = ({
  targetRole,
  currentSkillLevel,
  missingSkills,
  totalEstimatedHours,
  totalCompletedHours,
  overallProgressPercentage,
  completedStagesCount,
  totalStagesCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Ethical Transparency Banner */}
      <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border border-blue-200 bg-blue-50/50 text-xs text-blue-900 leading-relaxed shadow-xs">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-blue-950">
            Educational Career Development Roadmap
          </p>
          <p className="text-blue-800 text-[11px] sm:text-xs">
            This roadmap sequence is algorithmically calibrated against your identified competency
            gaps for <strong>{targetRole}</strong>. Recommendations are developmental guidance and do
            not guarantee employment offers, specific interview results, or corporate hiring outcomes.
          </p>
        </div>
      </div>

      {/* Main Diagnostic & Progress Summary Card */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left: Role Context & Gaps */}
            <div className="space-y-3 max-w-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  <Target className="w-3.5 h-3.5" />
                  <span>Target Role Curriculum</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {targetRole}
                </h2>
                <div className="flex items-center gap-2 pt-0.5 text-xs text-slate-600 flex-wrap">
                  <span className="font-medium text-slate-500">Current Skill Baseline:</span>
                  <Badge variant="neutral" size="sm">
                    <Award className="w-3 h-3 mr-1 text-slate-500" />
                    {currentSkillLevel}
                  </Badge>
                </div>
              </div>

              {/* Missing Skills Identified */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Targeted Skill Gaps Being Bridged ({missingSkills.length}):</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md"
                    >
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Overall Roadmap Progress Metric Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 w-full lg:w-80 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Overall Roadmap Progress
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {overallProgressPercentage}%
                </span>
              </div>

              <ProgressBar
                value={overallProgressPercentage}
                size="md"
                variant={overallProgressPercentage === 100 ? 'success' : 'primary'}
              />

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs border-t border-slate-200/60 text-slate-600">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Hours Logged</span>
                  <p className="font-bold text-slate-800">
                    {totalCompletedHours} / {totalEstimatedHours} hrs
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Stages Passed</span>
                  <p className="font-bold text-slate-800">
                    {completedStagesCount} of {totalStagesCount} stages
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

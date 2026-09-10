import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2, AlertTriangle, AlertCircle, BarChart3, Layers } from 'lucide-react';
import { AnalyzeResponse } from '../../services/matchingApi';

interface SkillGapVisualizerProps {
  analysis: AnalyzeResponse;
}

export const SkillGapVisualizer: React.FC<SkillGapVisualizerProps> = ({ analysis }) => {
  const {
    matchedSkills,
    partiallyMatchedSkills,
    missingSkills,
    allRequiredSkills,
    scoreBreakdown,
  } = analysis;

  const total = allRequiredSkills.length || 1;
  const matchedPercent = Math.round((matchedSkills.length / total) * 100);
  const partialPercent = Math.round((partiallyMatchedSkills.length / total) * 100);
  const missingPercent = Math.max(0, 100 - matchedPercent - partialPercent);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <CardTitle>Skill Gap &amp; Readiness Visualization</CardTitle>
            </div>
            <CardDescription>
              Visual distribution of baseline requirements across completion states and technical domains
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="success" size="sm" dot>
              {matchedSkills.length} Matched ({matchedPercent}%)
            </Badge>
            <Badge variant="warning" size="sm" dot>
              {partiallyMatchedSkills.length} Partial ({partialPercent}%)
            </Badge>
            <Badge variant="danger" size="sm" dot>
              {missingSkills.length} Missing ({missingPercent}%)
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Segmented Distribution Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Overall Requirement Fulfillment Portfolio</span>
            <span className="font-semibold text-slate-900">
              {matchedSkills.length} of {total} Competencies Met
            </span>
          </div>

          <div className="h-4 w-full bg-slate-100 rounded-full flex overflow-hidden p-0.5 gap-0.5 border border-slate-200">
            {matchedPercent > 0 && (
              <div
                style={{ width: `${matchedPercent}%` }}
                className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                title={`Matched: ${matchedSkills.length} skills (${matchedPercent}%)`}
              />
            )}
            {partialPercent > 0 && (
              <div
                style={{ width: `${partialPercent}%` }}
                className={`h-full bg-amber-400 transition-all duration-500 ${
                  matchedPercent === 0 ? 'rounded-l-full' : ''
                } ${missingPercent === 0 ? 'rounded-r-full' : ''}`}
                title={`Partially Matched: ${partiallyMatchedSkills.length} skills (${partialPercent}%)`}
              />
            )}
            {missingPercent > 0 && (
              <div
                style={{ width: `${missingPercent}%` }}
                className="h-full bg-rose-500 rounded-r-full transition-all duration-500"
                title={`Missing: ${missingSkills.length} skills (${missingPercent}%)`}
              />
            )}
          </div>

          <div className="grid grid-cols-3 text-center text-xs pt-1 text-slate-500">
            <div className="flex items-center justify-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                <strong>{matchedSkills.length}</strong> Satisfied
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>
                <strong>{partiallyMatchedSkills.length}</strong> In Progress
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-rose-700">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>
                <strong>{missingSkills.length}</strong> Unaddressed
              </span>
            </div>
          </div>
        </div>

        {/* Domain Category Readiness Progress */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Competency Breakdown by Domain</span>
            </div>
            <span className="text-[11px] text-slate-500 font-normal">Domain Readiness</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {scoreBreakdown.categoryScores.map((cat) => (
              <div
                key={cat.category}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 truncate">{cat.category}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      cat.matchRate >= 80
                        ? 'bg-emerald-100 text-emerald-800'
                        : cat.matchRate >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {cat.matchRate}% Match
                  </span>
                </div>

                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cat.matchRate >= 80
                        ? 'bg-emerald-500'
                        : cat.matchRate >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${cat.matchRate}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    {cat.matchedCount} of {cat.totalRequired} skills met
                  </span>
                  <span>
                    {cat.missingCount > 0 ? (
                      <strong className="text-rose-600">{cat.missingCount} missing</strong>
                    ) : (
                      <span className="text-emerald-600">All present</span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

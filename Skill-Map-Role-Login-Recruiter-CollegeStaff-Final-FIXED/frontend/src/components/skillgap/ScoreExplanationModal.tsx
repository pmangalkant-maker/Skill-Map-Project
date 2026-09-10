import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ShieldCheck, Calculator, Sparkles, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { AnalyzeResponse } from '../../services/matchingApi';

interface ScoreExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalyzeResponse;
}

export const ScoreExplanationModal: React.FC<ScoreExplanationModalProps> = ({
  isOpen,
  onClose,
  analysis,
}) => {
  const { scoreBreakdown, allRequiredSkills, overallMatchPercentage, targetRole } = analysis;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Match Score Transparency & Calculation Model"
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Deterministic Scoring • Zero Black-Box Algorithmic Rejection</span>
          </div>
          <Button variant="primary" size="sm" onClick={onClose}>
            Got it, Close
          </Button>
        </div>
      }
    >
      <div className="space-y-6 text-slate-700 text-xs sm:text-sm">
        {/* Core Formula & Overall Summary */}
        <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-blue-400" />
              <span>Transparent Mathematical Formulation</span>
            </div>
            <span className="text-xl font-bold text-white">{overallMatchPercentage}% Match</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/80 font-mono text-xs text-blue-200 border border-slate-700/60 overflow-x-auto">
            Overall Match Score = ∑ [ min(1.0, CandidateScore / BenchmarkScore) × SkillWeight% ]
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Your score of <strong className="text-white">{overallMatchPercentage}%</strong> for{' '}
            <strong className="text-white">{targetRole}</strong> is calculated by summing the
            weighted proficiency ratios across all {allRequiredSkills.length} required role
            competencies. Each skill's contribution is capped at 100% of its designated weight.
          </p>
        </div>

        {/* Ethical Guarantee & Anti-Bias Assurance */}
        <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/60">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-semibold text-blue-900 text-sm">
              No Hidden Screening or Automated Hiring Decisions
            </h5>
            <p className="text-xs text-blue-800 leading-relaxed">
              Skill Map adheres to open educational transparency guidelines. This calculation does
              not execute black-box filtering, secret candidate rank ordering, or applicant tracking
              rejections. Every parameter and weight used to produce this score is displayed below so
              you have total visibility into your professional growth areas.
            </p>
          </div>
        </div>

        {/* Itemized Mathematical Contribution Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-900 text-sm">
              Competency Point Contribution Matrix
            </h4>
            <span className="text-xs text-slate-500">
              Total Max Weight: {scoreBreakdown.totalPossibleWeightedPoints}%
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50/90 sticky top-0 border-b border-slate-200 z-10">
                  <tr className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Competency</th>
                    <th className="py-2.5 px-2.5">Weight</th>
                    <th className="py-2.5 px-2.5">Req. Score</th>
                    <th className="py-2.5 px-2.5">Your Score</th>
                    <th className="py-2.5 px-2.5">Match Ratio</th>
                    <th className="py-2.5 px-3 text-right">Points Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allRequiredSkills.map((item) => {
                    const ratioPercent = Math.round(item.matchRatio * 100);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2 px-3 font-medium text-slate-900">
                          <div className="flex items-center gap-1.5">
                            {item.status === 'Matched' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : item.status === 'Partially Matched' ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            )}
                            <span className="truncate max-w-[180px] sm:max-w-xs">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-2.5 text-slate-600">
                          <span className="font-semibold text-slate-800">{item.weightPercentage}%</span>
                          <span className="text-[10px] text-slate-400 block">{item.weight}</span>
                        </td>
                        <td className="py-2 px-2.5 text-slate-600">{item.requiredScore}%</td>
                        <td className="py-2 px-2.5 font-medium">
                          {item.candidateScore > 0 ? (
                            <span className="text-slate-900">{item.candidateScore}%</span>
                          ) : (
                            <span className="text-rose-600 font-semibold">0% (Missing)</span>
                          )}
                        </td>
                        <td className="py-2 px-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  ratioPercent >= 85
                                    ? 'bg-emerald-500'
                                    : ratioPercent > 0
                                    ? 'bg-amber-500'
                                    : 'bg-rose-400'
                                }`}
                                style={{ width: `${ratioPercent}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-slate-600">{ratioPercent}%</span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-slate-900">
                          +{item.weightedContribution} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-50/80 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between font-medium text-xs">
              <span className="text-slate-600">Total Cumulative Earned:</span>
              <span className="text-slate-900 font-bold text-sm">
                {scoreBreakdown.earnedWeightedPoints} / {scoreBreakdown.totalPossibleWeightedPoints} points ({overallMatchPercentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* Actionable Strategy to Raise Score */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>How to Rapidly Raise Your Match Score</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs text-emerald-800 leading-relaxed">
            <li>
              <strong>Prioritize Core Required Skills:</strong> Core competencies carry up to 20%
              weight each. Moving a core skill from missing to passing adds immediate double-digit
              gains to your overall readiness.
            </li>
            <li>
              <strong>Close Small Deficits in Partial Matches:</strong> Intermediate skills with
              under 15% gap can be verified quickly via targeted portfolio projects to capture
              their remaining points.
            </li>
            <li>
              <strong>Verify Self-Assessed Skills:</strong> Completing structured milestone
              checklists turns provisional skills into verified assets on your talent profile.
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

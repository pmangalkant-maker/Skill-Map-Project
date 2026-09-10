import React from 'react';
import { Compass, TrendingUp, AlertTriangle, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { SkillIntelligenceItem, CriticalSkillGapAlert } from '../../../types';

interface SkillIntelligenceTabProps {
  skillsTable: SkillIntelligenceItem[];
  criticalGaps: CriticalSkillGapAlert[];
  topSkills: string[];
  topGaps: string[];
  readinessDistribution: {
    readyAbove85: string;
    moderate70to84: string;
    needsImprovementBelow70: string;
  };
  onScheduleIntervention: (skillName: string, dept: string) => void;
}

export const SkillIntelligenceTab: React.FC<SkillIntelligenceTabProps> = ({
  skillsTable,
  criticalGaps,
  topSkills,
  topGaps,
  readinessDistribution,
  onScheduleIntervention
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Institutional Skill Intelligence</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Cross-department skill telemetry, industry demand benchmarks, and curriculum alignment metrics.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <div className="text-xs font-medium text-slate-400">High Placement Readiness (85%+)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{readinessDistribution.readyAbove85}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">1,193 students immediate FTE ready</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <div className="text-xs font-medium text-slate-400">Moderate Readiness (70% - 84%)</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">{readinessDistribution.moderate70to84}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">945 students eligible for internship conversion</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <div className="text-xs font-medium text-slate-400">Skill Intervention Needed (&lt;70%)</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{readinessDistribution.needsImprovementBelow70}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">348 students routed to academic bridge courses</div>
        </div>
      </div>

      {/* Primary Skill Intelligence Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Skill Matrix vs Industry Demand Benchmarks</h3>
            <p className="text-[11px] text-slate-400">Aggregated across all registered student profiles</p>
          </div>
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-full">
            Real-Time Telemetry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/80 bg-slate-850/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Skill Domain</th>
                <th className="py-3 px-4">Proficient Students</th>
                <th className="py-3 px-4">Industry Demand</th>
                <th className="py-3 px-4">Cohort Gap Level</th>
                <th className="py-3 px-4">Average Score</th>
                <th className="py-3 px-4">Target Benchmark</th>
                <th className="py-3 px-4 text-right">Academic Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-xs">
              {skillsTable.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-750/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {item.skill}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-indigo-300">{item.studentCount}</span>
                    <span className="text-[11px] text-slate-400 ml-1">students</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.demand === 'High'
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                          : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {item.demand} Demand
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.gap === 'Low'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : item.gap === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {item.gap} Gap
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{item.avgScore}%</span>
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.avgScore >= 80 ? 'bg-emerald-400' : item.avgScore >= 70 ? 'bg-indigo-400' : 'bg-amber-400'
                          }`}
                          style={{ width: `${item.avgScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="text-[11px]">{item.benchmark}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onScheduleIntervention(item.skill, 'All Relevant Departments')}
                      className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-indigo-600 text-slate-200 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Schedule Session
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

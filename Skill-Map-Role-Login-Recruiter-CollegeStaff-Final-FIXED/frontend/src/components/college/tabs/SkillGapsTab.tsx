import React from 'react';
import { AlertTriangle, Sparkles, BookOpen, Users, Calendar, ArrowRight, ShieldAlert } from 'lucide-react';
import { CriticalSkillGapAlert } from '../../../types';

interface SkillGapsTabProps {
  criticalGaps: CriticalSkillGapAlert[];
  onScheduleIntervention: (skillName: string, dept: string) => void;
}

export const SkillGapsTab: React.FC<SkillGapsTabProps> = ({
  criticalGaps,
  onScheduleIntervention
}) => {
  const departmentGapBreakdown = [
    { dept: 'Computer Science & Engineering', gapScore: '22% Index', priority: 'High', gaps: ['Kubernetes', 'Cloud Security', 'System Design'] },
    { dept: 'Information Technology', gapScore: '26% Index', priority: 'High', gaps: ['Docker CI/CD', 'GraphQL', 'Kafka'] },
    { dept: 'Electronics & Communication', gapScore: '38% Index', priority: 'Critical', gaps: ['Linux Device Drivers', 'Automotive CAN-Bus', 'RTOS'] },
    { dept: 'AI & Data Science', gapScore: '18% Index', priority: 'Medium', gaps: ['MLOps Model Serving', 'Vector DB Optimization'] },
    { dept: 'Mechanical Engineering', gapScore: '44% Index', priority: 'Critical', gaps: ['ROS2 Robotics', 'Python Kinematics', 'FEA ANSYS'] },
    { dept: 'Management Studies (MBA)', gapScore: '28% Index', priority: 'Medium', gaps: ['SQL Big Data Analytics', 'Enterprise ERP'] }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Institutional Skill Gap Alerts &amp; Interventions</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Detect syllabus-to-industry discrepancies and schedule targeted bridge bootcamps before campus recruitment.
        </p>
      </div>

      {/* Critical Gap Alert Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" /> Urgent Campus Drive Gap Warnings ({criticalGaps.length})
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {criticalGaps.map((gap, idx) => (
            <div
              key={idx}
              className="bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white">{gap.skill}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {gap.priority} Priority
                    </span>
                  </div>
                  <div className="text-xs text-indigo-400 font-medium mt-1">{gap.department}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-amber-400">{gap.affectedCount}</div>
                  <div className="text-[10px] text-slate-400">Students Deficient</div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-750 text-xs text-slate-300">
                <span className="font-semibold text-white block mb-0.5">Curriculum Recommendation:</span>
                {gap.recommendedAction}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Intervention format: 16-Hour Intensive Lab</span>
                <button
                  type="button"
                  onClick={() => onScheduleIntervention(gap.skill, gap.department)}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/30 transition-all cursor-pointer flex items-center gap-1"
                >
                  Schedule Bootcamp <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Gap Breakdown */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3">Department Skill Gap Distribution &amp; Primary Deficits</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentGapBreakdown.map((dept, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-850/80 border border-slate-750">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-white">{dept.dept}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    dept.priority === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : dept.priority === 'High'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {dept.gapScore}
                </span>
              </div>
              <div className="mt-3 text-[11px] text-slate-400">
                <div className="text-slate-300 font-medium mb-1">Key Missing Skills:</div>
                <div className="flex flex-wrap gap-1">
                  {dept.gaps.map((g) => (
                    <span key={g} className="px-2 py-0.5 rounded bg-slate-750 text-slate-300 text-[10px]">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

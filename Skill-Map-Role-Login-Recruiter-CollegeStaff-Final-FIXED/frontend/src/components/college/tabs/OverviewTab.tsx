import React from 'react';
import {
  Users,
  CheckCircle2,
  TrendingUp,
  BriefcaseBusiness,
  Award,
  Building2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { CollegeStaffOverview } from '../../../types';

interface OverviewTabProps {
  overview: CollegeStaffOverview | null;
  onNavigateTab: (tab: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ overview, onNavigateTab }) => {
  const stats = [
    {
      title: 'Total Students',
      value: overview?.totalStudents?.toLocaleString() || '2,486',
      sub: 'Enrolled across 6 departments',
      icon: Users,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      title: 'Students Assessed',
      value: overview?.studentsAssessed?.toLocaleString() || '2,180',
      sub: '87.6% assessment completion rate',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Placement Ready',
      value: overview?.studentsPlacementReady?.toLocaleString() || '1,939',
      sub: 'Readiness score ≥ 75%',
      icon: TrendingUp,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Active Internships',
      value: overview?.activeInternships || '164',
      sub: `${overview?.studentsInInternship || 210} students currently interning`,
      icon: BriefcaseBusiness,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      title: 'Students Placed',
      value: overview?.studentsPlaced || '384',
      sub: `${overview?.placementRatePercentage || '91.4%'} placement conversion`,
      icon: Award,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Industry Partners',
      value: overview?.industryPartners || '52',
      sub: 'MoUs & active recruiters',
      icon: Building2,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20'
    },
    {
      title: 'Skill Gap Alerts',
      value: overview?.skillGapAlerts || '68',
      sub: 'Intervention required for drives',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Placement Readiness',
      value: `${overview?.placementReadyPercentage || 78}%`,
      sub: '+8.4% improvement this semester',
      icon: Compass,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900/50 via-slate-800 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Institutional Executive View
              </span>
              <span className="text-xs text-slate-400">Academic Year 2025 - 2026</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1.5">
              College Placement &amp; Skill Intelligence Center
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Real-time monitoring of student competencies, placement drive outcomes, verified skill gaps,
              and strategic corporate MoUs across all departments.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('students')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              Monitor Students <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('placements')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              Campus Drives
            </button>
          </div>
        </div>
      </div>

      {/* 8 Primary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-slate-800/70 border border-slate-700/80 hover:border-slate-600 rounded-2xl p-4 transition-all duration-150"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">{s.title}</div>
                  <div className="text-2xl font-bold text-white mt-1.5">{s.value}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{s.sub}</div>
                </div>
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Department Readiness & Skill Demand Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Department Placement Readiness */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
            <div>
              <h2 className="text-sm font-bold text-white">Department Competency &amp; Readiness</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Cohort skill scoring vs corporate benchmarks</p>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              Analytics <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-4 space-y-3.5">
            {overview?.departmentStats?.map((dept, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">{dept.department}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{dept.total} Students</span>
                    <span className="font-bold text-indigo-400">{dept.readiness}% Ready</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                    style={{ width: `${dept.readiness}%` }}
                  />
                </div>
              </div>
            )) || (
              <div className="text-xs text-slate-400">Loading department statistics...</div>
            )}
          </div>
        </div>

        {/* Quick Strategic Actions & Alerts */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
              <div>
                <h2 className="text-sm font-bold text-white">Institutional Actions &amp; Priorities</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Immediate interventions prior to campus hiring</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Action Required
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-amber-200">Cloud &amp; Kubernetes Gap in 7th Sem CSE</div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    42 students have not met Docker/K8s benchmarks required for Apex Global campus drive.
                  </p>
                  <button
                    onClick={() => onNavigateTab('skill-gaps')}
                    className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 mt-1.5 inline-flex items-center gap-1"
                  >
                    Launch Bridge Bootcamp →
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-800/40 flex items-start gap-3">
                <BriefcaseBusiness className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-indigo-200">Campus Placement Drive: Apex Global</div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Scheduled for April 15, 2026. 184 eligible students verified.
                  </p>
                  <button
                    onClick={() => onNavigateTab('placements')}
                    className="text-[11px] font-semibold text-indigo-300 hover:text-indigo-200 mt-1.5 inline-flex items-center gap-1"
                  >
                    View Registered Candidates →
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-emerald-200">NAAC Accreditation Skill Evidence Ready</div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    All student assessment rubrics and capstone repositories are synchronized and verified.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/60 mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Overall Institution Placement Target: 95%</span>
            <span className="font-bold text-emerald-400">Current: 91.4%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

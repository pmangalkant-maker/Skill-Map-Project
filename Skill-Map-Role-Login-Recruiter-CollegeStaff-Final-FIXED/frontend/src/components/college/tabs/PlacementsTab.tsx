import React from 'react';
import { Award, Users, CheckCircle2, TrendingUp, Calendar, MapPin, Building2, DollarSign } from 'lucide-react';
import { PlacementSummary, DepartmentPlacement, PlacementDrive } from '../../../types';

interface PlacementsTabProps {
  summary: PlacementSummary;
  departmentPlacements: DepartmentPlacement[];
  placementDrives: PlacementDrive[];
}

export const PlacementsTab: React.FC<PlacementsTabProps> = ({
  summary,
  departmentPlacements,
  placementDrives
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Campus Placement Operations &amp; Corporate Drives</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Comprehensive placement funnel, salary benchmarks, department placement rates, and ongoing campus recruitment slots.
        </p>
      </div>

      {/* 6 Funnel Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 shadow-xl">
          <div className="text-[10px] font-bold uppercase text-slate-400">Eligible Cohort</div>
          <div className="text-xl font-bold text-white mt-1">{summary.eligibleStudents?.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Final Year Students</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 shadow-xl">
          <div className="text-[10px] font-bold uppercase text-slate-400">Applications</div>
          <div className="text-xl font-bold text-blue-400 mt-1">{summary.applicationsSubmitted?.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Across 52 Drives</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 shadow-xl">
          <div className="text-[10px] font-bold uppercase text-slate-400">Shortlisted</div>
          <div className="text-xl font-bold text-indigo-400 mt-1">{summary.shortlisted?.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">OA Passed</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 shadow-xl">
          <div className="text-[10px] font-bold uppercase text-slate-400">Interviews</div>
          <div className="text-xl font-bold text-amber-400 mt-1">{summary.interviewsConducted?.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Technical + HR</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 shadow-xl">
          <div className="text-[10px] font-bold uppercase text-slate-400">Selected / Offers</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{summary.studentsSelected?.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400">Offers Extended</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 shadow-xl">
          <div className="text-[10px] font-bold uppercase text-slate-400">Placed Count</div>
          <div className="text-xl font-bold text-cyan-400 mt-1">{summary.studentsPlaced?.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-bold">{summary.placementPercentage} Conversion</div>
        </div>
      </div>

      {/* Department-Wise Placement Rate Analytics */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Department-Wise Placement Statistics (CSE, IT, AI&amp;DS, ECE, MECH, MBA)</h3>
            <p className="text-[11px] text-slate-400">Average package, top recruiting partners and conversion rates</p>
          </div>
          <div className="text-xs text-slate-300">
            Avg Package: <strong className="text-emerald-400">{summary.averagePackage}</strong> · Highest:{' '}
            <strong className="text-indigo-400">{summary.highestPackage}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/80 bg-slate-850/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Academic Department</th>
                <th className="py-3 px-4">Eligible Students</th>
                <th className="py-3 px-4">Placed Students</th>
                <th className="py-3 px-4">Placement Rate</th>
                <th className="py-3 px-4">Average Package (CTC)</th>
                <th className="py-3 px-4">Key Corporate Recruiter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-xs">
              {departmentPlacements.map((dp, idx) => (
                <tr key={idx} className="hover:bg-slate-750/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">{dp.department}</td>
                  <td className="py-3.5 px-4 text-slate-300">{dp.eligible} students</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">{dp.placed} placed</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{dp.rate}</span>
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: dp.rate }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-indigo-300">{dp.avgSalary}</td>
                  <td className="py-3.5 px-4 text-slate-300">{dp.topCompany}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campus Placement Drives List */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Institutional Placement Drives &amp; Recruiter Visits</h3>
            <p className="text-[11px] text-slate-400">Upcoming, active, and completed on-campus drives</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {placementDrives.map((drive) => (
            <div key={drive.id} className="p-4 rounded-xl bg-slate-850 border border-slate-750">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{drive.companyName}</h4>
                  <p className="text-xs text-indigo-400 font-medium">{drive.role}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Drive Date: {drive.driveDate}</span>
                    <span className="text-slate-600">·</span>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{drive.location}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    drive.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : drive.status === 'Scheduled'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {drive.status}
                </span>
              </div>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Package Offered (CTC)</span>
                  <span className="font-bold text-emerald-400">{drive.packageCTC}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Min Academic CGPA</span>
                  <span className="font-bold text-white">{drive.minCgpa} CGPA</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {drive.eligibleDepartments.map((dept) => (
                  <span key={dept} className="px-2 py-0.5 rounded bg-slate-750 text-slate-300 text-[10px]">
                    {dept}
                  </span>
                ))}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Applied</span>
                  <span className="font-semibold text-white">{drive.appliedCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Shortlisted</span>
                  <span className="font-semibold text-indigo-300">{drive.shortlistedCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Interviewed</span>
                  <span className="font-semibold text-amber-300">{drive.interviewedCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Selected</span>
                  <span className="font-bold text-emerald-400">{drive.selectedCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

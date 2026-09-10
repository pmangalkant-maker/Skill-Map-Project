import React from 'react';
import { BriefcaseBusiness, CheckCircle2, Clock, Users, ArrowRight, Building2, MapPin } from 'lucide-react';
import { InternshipTrackingItem, StudentInternshipTracking } from '../../../types';

interface InternshipsTabProps {
  summary: {
    availableInternships: number;
    studentsApplied: number;
    studentsSelected: number;
    studentsCurrentlyInterning: number;
    completedInternships: number;
  };
  internships: InternshipTrackingItem[];
  studentTracking: StudentInternshipTracking[];
  onUpdateStage: (studentId: string, stage: string) => void;
}

export const InternshipsTab: React.FC<InternshipsTabProps> = ({
  summary,
  internships,
  studentTracking,
  onUpdateStage
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Institutional Internship Tracking</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Lifecycle tracking: Applied → Selected → Internship Started → Completed, supervisor feedback &amp; academic credit verification.
        </p>
      </div>

      {/* 5 Funnel / Lifecycle Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <div className="text-[11px] font-medium text-slate-400">Available Internships</div>
          <div className="text-2xl font-bold text-white mt-1">{summary.availableInternships || 164}</div>
          <div className="text-[10px] text-indigo-400 mt-0.5">Corporate partners</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <div className="text-[11px] font-medium text-slate-400">Students Applied</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{summary.studentsApplied || 232}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Applications logged</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <div className="text-[11px] font-medium text-slate-400">Students Selected</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{summary.studentsSelected || 23}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Offers issued</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <div className="text-[11px] font-medium text-slate-400">Currently Interning</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{summary.studentsCurrentlyInterning || 18}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active on-site/remote</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl col-span-2 sm:col-span-1">
          <div className="text-[11px] font-medium text-slate-400">Completed Internships</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">{summary.completedInternships || 43}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Credits awarded</div>
        </div>
      </div>

      {/* Student Internship Stage Lifecycle Tracking Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Student Internship Lifecycle &amp; Supervisor Monitoring</h3>
            <p className="text-[11px] text-slate-400">Stages: Applied → Selected → Internship Started → Completed</p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            Bi-Weekly Supervisor Logs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/80 bg-slate-850/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Student &amp; Roll Number</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Company &amp; Role</th>
                <th className="py-3 px-4">Lifecycle Stage</th>
                <th className="py-3 px-4">Stipend &amp; Duration</th>
                <th className="py-3 px-4">Mentor Feedback</th>
                <th className="py-3 px-4 text-right">Update Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-xs">
              {studentTracking.map((st, idx) => (
                <tr key={idx} className="hover:bg-slate-750/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{st.studentName}</div>
                    <div className="text-[11px] text-slate-400">{st.rollNumber}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{st.department}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-white">{st.companyName}</div>
                    <div className="text-[11px] text-indigo-400">{st.role}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        st.stage === 'Completed'
                          ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                          : st.stage === 'Internship Started'
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                          : st.stage === 'Selected'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {st.stage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div>{st.stipend}</div>
                    <div className="text-[11px] text-slate-400">{st.duration}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-200">{st.mentorAssigned}</div>
                    <div className="text-[11px] text-emerald-400 font-semibold">Evaluation: {st.midTermScore}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={st.stage}
                      onChange={(e) => onUpdateStage(st.rollNumber, e.target.value)}
                      className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Selected">Selected</option>
                      <option value="Internship Started">Internship Started</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Corporate Internship Postings */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3">Partner Company Internship Openings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {internships.map((int) => (
            <div key={int.id} className="p-4 rounded-xl bg-slate-850 border border-slate-750">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-white">{int.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-indigo-400">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{int.companyName}</span>
                    <span className="text-slate-500">·</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-300">{int.location}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {int.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Applied</span>
                  <span className="font-bold text-white">{int.appliedCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Selected</span>
                  <span className="font-bold text-emerald-400">{int.selectedCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Active</span>
                  <span className="font-bold text-cyan-400">{int.currentlyInterning}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>Stipend: <strong className="text-slate-200">{int.stipend}</strong></span>
                <span>Duration: <strong className="text-slate-200">{int.duration}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

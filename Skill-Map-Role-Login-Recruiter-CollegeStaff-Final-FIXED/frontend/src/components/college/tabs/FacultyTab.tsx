import React from 'react';
import { BookOpen, GraduationCap, Building2, Calendar, Award, ArrowRight, DollarSign, CheckCircle2 } from 'lucide-react';
import { FacultyOpportunity } from '../../../types';

interface FacultyTabProps {
  opportunities: FacultyOpportunity[];
  onApply: (opportunity: FacultyOpportunity) => void;
}

export const FacultyTab: React.FC<FacultyTabProps> = ({ opportunities, onApply }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Faculty Upskilling &amp; Industrial Immersion</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Empowering teaching faculty with industrial sabbaticals, funded consultancy projects, AI/Cloud FDPs, and collaborative applied research.
        </p>
      </div>

      {/* Program Categories Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { title: 'Faculty Internships', sub: 'Industry Sabbaticals', icon: Building2 },
          { title: 'Industrial Training', sub: 'Hands-on Labs', icon: GraduationCap },
          { title: 'FDP Programs', sub: 'AICTE / Industry Certs', icon: BookOpen },
          { title: 'Consultancy', sub: 'Corporate Problem Solving', icon: DollarSign },
          { title: 'Applied Research', sub: 'Joint Patents & Grants', icon: Award },
          { title: 'Expert Mentorship', sub: 'Academic Guidance', icon: CheckCircle2 }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 text-center shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 mx-auto flex items-center justify-center mb-2">
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">{item.title}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Faculty Opportunities Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {opp.type}
                  </span>
                  <h3 className="font-bold text-base text-white mt-2">{opp.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-indigo-400">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{opp.organization}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Grant / Stipend</span>
                  <span className="font-bold text-emerald-400 text-xs">{opp.grantAmount}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-3">{opp.description}</p>

              <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Target Department</span>
                  <span className="font-medium text-slate-200">{opp.department || opp.discipline || 'All Engineering'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Duration &amp; Mode</span>
                  <span className="font-medium text-slate-200">{opp.duration} · {opp.mode || opp.modality || 'Hybrid'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-[11px] text-amber-300 font-medium">Apply before: {opp.deadline}</span>
              <button
                type="button"
                onClick={() => onApply(opp)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1"
              >
                Register / Apply <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

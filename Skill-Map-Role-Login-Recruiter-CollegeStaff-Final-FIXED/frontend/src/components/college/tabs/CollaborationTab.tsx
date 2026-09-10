import React from 'react';
import { Handshake, Plus, Users, Calendar, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { IndustryCollaborationItem } from '../../../types';

interface CollaborationTabProps {
  collaborations: IndustryCollaborationItem[];
  onOpenCreateModal: () => void;
}

export const CollaborationTab: React.FC<CollaborationTabProps> = ({
  collaborations,
  onOpenCreateModal
}) => {
  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Institutional Industry Collaborations</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mentorship programs, guest lecture series, live capstone projects, innovation hackathons, and corporate certification cohorts.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Propose Collaboration
        </button>
      </div>

      {/* 6 Category Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {[
          'Mentorship Programs',
          'Guest Lecture Series',
          'Live Capstone Projects',
          'Innovation Hackathons',
          'Research Partnerships',
          'Certification Cohorts'
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center text-xs font-semibold text-slate-300"
          >
            {item}
          </div>
        ))}
      </div>

      {/* Collaboration Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {collaborations.map((collab) => (
          <div
            key={collab.id}
            className="bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {collab.category}
                  </span>
                  <h3 className="font-bold text-base text-white mt-2">{collab.title}</h3>
                  <div className="text-xs text-indigo-400 font-medium mt-0.5">
                    Partner: {collab.partnerCompany}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {collab.status}
                </span>
              </div>

              <div className="mt-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Institutional Lead:</span>
                  <span className="font-medium text-white">{collab.leadContact}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Target Cohort:</span>
                  <span className="font-medium text-white">
                    {collab.targetDepartments.join(', ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Student Capacity:</span>
                  <span className="font-bold text-indigo-300">
                    {collab.participatingStudentsCount} Enrolled
                  </span>
                </div>
              </div>

              <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-white block mb-0.5">Expected Deliverables:</span>
                {collab.outcomes}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>{collab.startDate} — {collab.endDate}</span>
              <span className="text-emerald-400 font-medium">In Progress</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

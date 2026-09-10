import React from 'react';
import { Building2, Plus, ExternalLink, Mail, Handshake, Briefcase, Award } from 'lucide-react';
import { ConnectedRecruiter } from '../../../types';

interface RecruitersTabProps {
  recruiters: ConnectedRecruiter[];
  summary: {
    totalPartners: number;
    activeJobs: number;
    activeInternships: number;
    totalHires: number;
    activePrograms: number;
  };
  onOpenInviteModal: () => void;
}

export const RecruitersTab: React.FC<RecruitersTabProps> = ({
  recruiters,
  summary,
  onOpenInviteModal
}) => {
  return (
    <div className="space-y-6">
      {/* Header & Invite Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Corporate Recruiter &amp; Industry Partnerships</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage institutional MoUs, recruitment drives, hiring pipelines, and campus outreach initiatives.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenInviteModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Invite New Recruiter
        </button>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <div className="text-xs font-medium text-slate-400">Total Partners &amp; MoUs</div>
          <div className="text-2xl font-bold text-white mt-1">{summary.totalPartners || 52}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Tier-1 Corporate Alliances</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <div className="text-xs font-medium text-slate-400">Active Job Postings</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">{summary.activeJobs || 35}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Direct Campus Hiring</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <div className="text-xs font-medium text-slate-400">Total Campus Hires</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{summary.totalHires || 136}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">This Academic Cycle</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <div className="text-xs font-medium text-slate-400">Active Collaborations</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{summary.activePrograms || 12}</div>
          <div className="text-[10px] text-indigo-300 mt-0.5">Mentorship &amp; Labs</div>
        </div>
      </div>

      {/* Recruiter Partners List */}
      <div className="grid md:grid-cols-2 gap-4">
        {recruiters.map((partner) => (
          <div
            key={partner.id}
            className="bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 rounded-2xl p-5 shadow-xl transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-base shrink-0">
                  {partner.companyName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">{partner.companyName}</h3>
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-indigo-400"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-indigo-400 font-medium">{partner.industry}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                {partner.partnershipLevel}
              </span>
            </div>

            {/* Recruiter Contact */}
            <div className="mt-3.5 p-2.5 rounded-xl bg-slate-850 border border-slate-750 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[10px] block">Lead Recruiter</span>
                <span className="font-semibold text-white">{partner.recruiterName}</span>
              </div>
              <a
                href={`mailto:${partner.recruiterEmail}`}
                className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <Mail className="w-3 h-3" /> {partner.recruiterEmail}
              </a>
            </div>

            {/* Metrics Bar */}
            <div className="mt-3.5 grid grid-cols-4 gap-2 text-center text-xs bg-slate-900/60 p-2 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Jobs</span>
                <span className="font-bold text-white">{partner.activeJobsCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Internships</span>
                <span className="font-bold text-cyan-400">{partner.activeInternshipsCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Applications</span>
                <span className="font-bold text-indigo-300">{partner.applicationsCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Hires</span>
                <span className="font-bold text-emerald-400">{partner.totalHires}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-3.5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">{partner.mouStatus}</span>
              <span className="text-[10px] text-slate-400">Last visit: {partner.lastVisit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

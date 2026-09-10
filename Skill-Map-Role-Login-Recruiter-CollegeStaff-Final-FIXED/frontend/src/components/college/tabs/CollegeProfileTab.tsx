import React from 'react';
import { School, ShieldCheck, Mail, Phone, MapPin, Building2, Edit3, Users, Award, BookOpen } from 'lucide-react';
import { CollegeProfileData } from '../../../types';

interface CollegeProfileTabProps {
  profile: CollegeProfileData | null;
  onOpenEditModal: () => void;
}

export const CollegeProfileTab: React.FC<CollegeProfileTabProps> = ({ profile, onOpenEditModal }) => {
  return (
    <div className="space-y-6">
      {/* Header & Edit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Institutional Profile &amp; Placement Cell Credentials</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Accreditation benchmarks, NAAC/NBA metrics, department capacity, and campus placement office contact directory.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenEditModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" /> Edit Profile Details
        </button>
      </div>

      {/* College Identity Card */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-500/20 shrink-0">
              <School className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl font-bold text-white">
                  {profile?.institutionName || 'Apex Institute of Science & Technology'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Code: {profile?.institutionCode || 'AIST-8042'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                {profile?.address || profile?.campusAddress || 'Tech City Knowledge Park, Innovation Corridor, Bangalore - 560100'}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {profile?.accreditation || 'NAAC A++ Grade (CGPA 3.82) · NBA Tier-1'}
                </span>
                <span className="text-xs text-slate-400">NIRF All India Rank: #34 (Engineering)</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-300 leading-relaxed border-t border-slate-700/60 pt-4">
          {profile?.overview ||
            'Premier multidisciplinary institution dedicated to cultivating engineering leadership, cutting-edge software craft, AI innovation, and ethical industry practices. Ranked among top 40 engineering colleges nationwide.'}
        </p>
      </div>

      {/* Placement Cell & Officers */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            Placement Cell &amp; Corporate Relations Leadership
          </h4>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-750">
              <div className="text-[10px] uppercase font-bold text-slate-400">Head of Placement</div>
              <div className="font-bold text-sm text-white mt-0.5">
                {profile?.headOfPlacement || 'Dr. Aruna Natarajan, Ph.D.'}
              </div>
              <div className="text-xs text-indigo-400 font-medium">
                {profile?.headTitle || 'Dean - Industry Relations & Campus Placements'}
              </div>
              <div className="flex items-center gap-4 mt-2 text-slate-300">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {profile?.contactEmail || 'placements@aist.edu'}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {profile?.phone || profile?.contactPhone || '+91 80 4912 8000'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Placement Cell Name:</span>
                <span className="font-semibold text-white">
                  {profile?.placementCellName || 'Corporate Relations & Career Empowerment Cell'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Auditorium / Interview Cabins:</span>
                <span className="font-medium text-white">1,200 Seater Auditorium · 32 Interview Cabins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Online Assessment Labs:</span>
                <span className="font-medium text-white">6 High-Speed Testing Labs (600 Terminals)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Departments & Programs */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Accredited Academic Departments &amp; Cohort Capacities
          </h4>
          <div className="space-y-2.5">
            {profile?.departments?.map((dept, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-850 border border-slate-750 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{dept.name}</div>
                  <div className="text-[10px] text-indigo-400 font-medium">{dept.hod}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-200">{dept.intake || dept.studentCount || 120} Students</span>
                  <span className="text-[10px] text-slate-400 block">{dept.programs?.join(', ') || 'B.Tech, M.Tech'}</span>
                </div>
              </div>
            )) || (
              <div className="text-xs text-slate-400">Loading department list...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

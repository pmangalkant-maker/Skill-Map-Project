import React from 'react';
import {
  X,
  User,
  GraduationCap,
  FileText,
  Sparkles,
  AlertTriangle,
  Award,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Code2,
  Calendar,
  Mail,
  Phone,
  Target
} from 'lucide-react';
import { InstitutionStudent } from '../../types';

interface StudentDetailModalProps {
  student: InstitutionStudent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col text-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-850">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-500/20 shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">{student.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
                  {student.rollNumber}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
                  {student.course} · {student.graduationYear}
                </span>
              </div>
              <p className="text-xs text-indigo-400 font-medium mt-0.5">
                Target Role: {student.targetRole}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {student.email}
                </span>
                {student.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {student.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {student.department}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 divide-y divide-slate-800/80">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
              <div className="text-[11px] font-medium text-slate-400">Placement Readiness</div>
              <div className="text-2xl font-bold text-indigo-400 mt-1">{student.readinessScore}%</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">High Corporate Readiness</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
              <div className="text-[11px] font-medium text-slate-400">Academic CGPA</div>
              <div className="text-2xl font-bold text-white mt-1">{student.cgpa}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Scale of 10.0</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
              <div className="text-[11px] font-medium text-slate-400">Skill Gap Level</div>
              <div className="text-lg font-bold text-amber-400 mt-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {student.skillGap} Gap
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{student.skillGaps?.length || 0} gaps detected</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
              <div className="text-[11px] font-medium text-slate-400">Placement Status</div>
              <div className="text-lg font-bold text-emerald-400 mt-1.5">
                {student.placementStatus}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {student.placedCompany ? student.placedCompany : 'Campus Drive Active'}
              </div>
            </div>
          </div>

          {/* Education & Resume Metadata */}
          <div className="pt-5 grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-2">
                <GraduationCap className="w-4 h-4" /> Academic Records
              </h3>
              <div className="text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-medium text-white">{student.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Degree & Term:</span>
                  <span className="font-medium text-white">{student.course} ({student.currentSemester})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Graduation:</span>
                  <span className="font-medium text-white">{student.graduationYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assessment Status:</span>
                  <span className="font-medium text-emerald-400">{student.assessmentStatus}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-2">
                <FileText className="w-4 h-4" /> Authorized Resume Summary
              </h3>
              <div className="text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Verification Status:</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {student.resumeStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Role:</span>
                  <span className="font-medium text-white">{student.targetRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verified Projects:</span>
                  <span className="font-medium text-white">{student.projects?.length || 0} Capstone Projects</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Certifications:</span>
                  <span className="font-medium text-white">{student.certifications?.length || 0} Industry Credentials</span>
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Verified Skills */}
          <div className="pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-3">
              <Sparkles className="w-4 h-4" /> Verified Skills & Proficiencies
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {student.skills?.map((s, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-white">{s.name}</span>
                    <span className="font-semibold text-indigo-300">{s.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full"
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-400">
                    <span>Category: {s.category}</span>
                    <span className="text-slate-300 font-medium">{s.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gaps & Academic Recommendations */}
          <div className="pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-3">
              <AlertTriangle className="w-4 h-4" /> Skill Gaps & Academic Interventions
            </h3>
            <div className="space-y-2">
              {student.skillGaps?.map((gap, idx) => (
                <div key={idx} className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-amber-200 flex items-center gap-2">
                      <span>{gap.skill}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {gap.severity} Severity
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Recommendation: {gap.recommendation}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-[10px] text-slate-400 block">Current vs Target</span>
                    <span className="font-bold text-amber-300">{gap.currentScore}% / {gap.requiredScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects & Live Work */}
          <div className="pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-3">
              <Code2 className="w-4 h-4" /> Capstone & Industry Projects ({student.projects?.length || 0})
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {student.projects?.map((proj, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{proj.title}</span>
                    {proj.verified && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.technologies.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded text-[9px]">
                        {t}
                      </span>
                    ))}
                  </div>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 mt-2.5 font-medium"
                    >
                      <ExternalLink className="w-3 h-3" /> View Repository
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Internships */}
          <div className="pt-5 grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-2.5">
                <Award className="w-4 h-4" /> Certifications ({student.certifications?.length || 0})
              </h3>
              <div className="space-y-2">
                {student.certifications?.map((c, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs">
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between mt-0.5">
                      <span>{c.issuer}</span>
                      <span>{c.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-2.5">
                <Briefcase className="w-4 h-4" /> Internships ({student.internships?.length || 0})
              </h3>
              <div className="space-y-2">
                {student.internships?.length > 0 ? (
                  student.internships.map((i, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs">
                      <div className="font-semibold text-white">{i.role}</div>
                      <div className="text-[11px] text-indigo-300">{i.company}</div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                        <span>{i.duration}</span>
                        <span className="text-emerald-400 font-medium">{i.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-800 text-center text-xs text-slate-400">
                    No completed external internships yet. Eligible for summer matching.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-850 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Authorized Institution View · Privacy & Data Protection Compliance Active
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
};

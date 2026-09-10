import React from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Briefcase,
  Award,
  ChevronRight,
  User,
  GraduationCap
} from 'lucide-react';
import { InstitutionStudent } from '../../../types';

interface StudentProgressTabProps {
  students: InstitutionStudent[];
  search: string;
  setSearch: (s: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (d: string) => void;
  courseFilter: string;
  setCourseFilter: (c: string) => void;
  yearFilter: string;
  setYearFilter: (y: string) => void;
  skillLevelFilter: string;
  setSkillLevelFilter: (l: string) => void;
  internshipFilter: string;
  setInternshipFilter: (i: string) => void;
  placementFilter: string;
  setPlacementFilter: (p: string) => void;
  onSelectStudent: (student: InstitutionStudent) => void;
}

export const StudentProgressTab: React.FC<StudentProgressTabProps> = ({
  students,
  search,
  setSearch,
  departmentFilter,
  setDepartmentFilter,
  courseFilter,
  setCourseFilter,
  yearFilter,
  setYearFilter,
  skillLevelFilter,
  setSkillLevelFilter,
  internshipFilter,
  setInternshipFilter,
  placementFilter,
  setPlacementFilter,
  onSelectStudent
}) => {
  return (
    <div className="space-y-6">
      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Student Academic &amp; Skill Progress</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor verified competencies, assessment scores, internship stages, and campus placement readiness.
          </p>
        </div>
        <div className="text-xs text-indigo-400 font-semibold bg-indigo-950/40 border border-indigo-800/40 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          Showing {students.length} Student Profiles
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll number, email, or department..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* 6 Multi-Level Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {/* Department */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Information Technology">IT</option>
              <option value="AI & Data Science">AI &amp; DS</option>
              <option value="Electronics & Communication">ECE</option>
              <option value="Mechanical Engineering">Mechanical</option>
              <option value="Management Studies">Management (MBA)</option>
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Course</label>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Courses</option>
              <option value="B.Tech">B.Tech</option>
              <option value="MBA">MBA</option>
              <option value="M.Tech">M.Tech</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Grad Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Years</option>
              <option value="2025">Class of 2025</option>
              <option value="2026">Class of 2026</option>
              <option value="2027">Class of 2027</option>
            </select>
          </div>

          {/* Skill Level */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Skill Score</label>
            <select
              value={skillLevelFilter}
              onChange={(e) => setSkillLevelFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Scores</option>
              <option value="High">High (85%+)</option>
              <option value="Medium">Medium (70-84%)</option>
              <option value="Low">Needs Support (&lt;70%)</option>
            </select>
          </div>

          {/* Internship Status */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Internship</label>
            <select
              value={internshipFilter}
              onChange={(e) => setInternshipFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="Interning">Currently Interning</option>
              <option value="Completed">Completed</option>
              <option value="Selected">Selected</option>
              <option value="Applied">Applied</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>

          {/* Placement Status */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Placement</label>
            <select
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Eligible">Eligible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/80 bg-slate-850/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Student &amp; Roll No</th>
                <th className="py-3 px-4">Course &amp; Dept</th>
                <th className="py-3 px-4">Assessment</th>
                <th className="py-3 px-4">Skill Score</th>
                <th className="py-3 px-4">Skill Gap</th>
                <th className="py-3 px-4">Projects / Certs</th>
                <th className="py-3 px-4">Internship</th>
                <th className="py-3 px-4">Placement</th>
                <th className="py-3 px-4">Resume</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-xs">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => onSelectStudent(student)}
                    className="hover:bg-slate-750/70 transition-colors cursor-pointer"
                  >
                    {/* Student Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{student.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{student.rollNumber}</div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">{student.course}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                        {student.department}
                      </div>
                    </td>

                    {/* Assessment */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          student.assessmentStatus === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : student.assessmentStatus === 'In Progress'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {student.assessmentStatus === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                        {student.assessmentStatus}
                      </span>
                    </td>

                    {/* Skill Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{student.skillScore}%</span>
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${student.skillScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Skill Gap */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          student.skillGap === 'Low'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : student.skillGap === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {student.skillGap === 'Critical' && <AlertTriangle className="w-3 h-3" />}
                        {student.skillGap} Gap
                      </span>
                    </td>

                    {/* Projects & Certifications */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300">
                        {student.projectsCount} Proj · {student.certificationsCount} Cert
                      </div>
                    </td>

                    {/* Internship Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          student.internshipStatus === 'Interning' || student.internshipStatus === 'Completed'
                            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                            : student.internshipStatus === 'Selected'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {student.internshipStatus}
                      </span>
                    </td>

                    {/* Placement Status */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{student.placementStatus}</div>
                      {student.placedCompany && (
                        <div className="text-[10px] text-emerald-400 font-medium truncate max-w-[120px]">
                          {student.placedCompany}
                        </div>
                      )}
                    </td>

                    {/* Resume Status */}
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {student.resumeStatus}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(student);
                        }}
                        className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-indigo-600 hover:text-white text-slate-300 transition-colors"
                        title="View Full Student Detail"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No student records match the active filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

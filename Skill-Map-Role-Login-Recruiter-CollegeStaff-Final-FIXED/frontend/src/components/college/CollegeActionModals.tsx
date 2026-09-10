import React, { useState } from 'react';
import { X, Building2, Handshake, GraduationCap, School, AlertTriangle, Sparkles } from 'lucide-react';
import { CollegeProfileData, FacultyOpportunity } from '../../types';

// ==========================================
// 1. INVITE RECRUITER MODAL
// ==========================================
interface InviteRecruiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    companyName: string;
    industry: string;
    website: string;
    recruiterName: string;
    recruiterEmail: string;
  }) => Promise<void>;
}

export const InviteRecruiterModal: React.FC<InviteRecruiterModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Enterprise Software & Cloud Services');
  const [website, setWebsite] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !recruiterEmail.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ companyName, industry, website, recruiterName, recruiterEmail });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Invite Corporate Recruiter</h3>
              <p className="text-[11px] text-slate-400">Initiate campus placement MoU and drive participation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization *</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Cloud Corp"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Industry Domain</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Enterprise Software & Cloud Services">Enterprise Software & Cloud Services</option>
              <option value="AI / Machine Learning Labs">AI / Machine Learning Labs</option>
              <option value="FinTech & Banking Solutions">FinTech & Banking Solutions</option>
              <option value="Hardware, IoT & Embedded Systems">Hardware, IoT & Embedded Systems</option>
              <option value="Management Consulting & Advisory">Management Consulting & Advisory</option>
              <option value="Healthcare & BioTech">Healthcare & BioTech</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Recruiter Name</label>
              <input
                type="text"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                placeholder="e.g. Jessica Chen"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://acme.io"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Recruiter Contact Email *</label>
            <input
              type="email"
              required
              value={recruiterEmail}
              onChange={(e) => setRecruiterEmail(e.target.value)}
              placeholder="talent@acme.io"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30"
            >
              {isSubmitting ? 'Sending Invitation...' : 'Send Partnership Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 2. PROPOSE COLLABORATION MODAL
// ==========================================
interface ProposeCollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    category: string;
    partnerCompany: string;
    leadContact: string;
    targetDepartments: string[];
    participatingStudentsCount: number;
    outcomes: string;
  }) => Promise<void>;
}

export const ProposeCollaborationModal: React.FC<ProposeCollaborationModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mentorship');
  const [partnerCompany, setPartnerCompany] = useState('Apex Global Technologies');
  const [leadContact, setLeadContact] = useState('Career Services Liaison');
  const [targetDept, setTargetDept] = useState('Computer Science & Engineering');
  const [studentsCount, setStudentsCount] = useState(40);
  const [outcomes, setOutcomes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !partnerCompany.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        category,
        partnerCompany,
        leadContact,
        targetDepartments: [targetDept],
        participatingStudentsCount: Number(studentsCount),
        outcomes
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Handshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Create Industry Collaboration</h3>
              <p className="text-[11px] text-slate-400">Launch live project, mentorship cohort, or innovation challenge</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Collaboration Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Cloud Architecture Mentorship"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Mentorship">Mentorship Program</option>
                <option value="Guest Lectures">Guest Lecture Series</option>
                <option value="Live Projects">Live Capstone Project</option>
                <option value="Innovation Challenges">Innovation Hackathon</option>
                <option value="Research Partnerships">Research Partnership</option>
                <option value="Certification Programs">Certification Cohort</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Industry Partner *</label>
              <input
                type="text"
                required
                value={partnerCompany}
                onChange={(e) => setPartnerCompany(e.target.value)}
                placeholder="e.g. Apex Global Technologies"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Department</label>
              <select
                value={targetDept}
                onChange={(e) => setTargetDept(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Management Studies">Management Studies</option>
                <option value="All Departments">All Departments</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Student Capacity</label>
              <input
                type="number"
                min="5"
                max="500"
                value={studentsCount}
                onChange={(e) => setStudentsCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Deliverables & Outcomes</label>
            <textarea
              rows={2}
              value={outcomes}
              onChange={(e) => setOutcomes(e.target.value)}
              placeholder="e.g. 10 production capstones, guaranteed interview fast-track for top 5 teams."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30"
            >
              {isSubmitting ? 'Submitting...' : 'Register Collaboration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 3. APPLY FACULTY OPPORTUNITY MODAL
// ==========================================
interface ApplyFacultyModalProps {
  opportunity: FacultyOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: { facultyName: string; department: string; email: string; proposalNotes?: string }) => Promise<void>;
}

export const ApplyFacultyModal: React.FC<ApplyFacultyModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [facultyName, setFacultyName] = useState('Dr. Aruna Natarajan');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [email, setEmail] = useState('staff@skillmap.demo');
  const [proposalNotes, setProposalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !opportunity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(opportunity.id, { facultyName, department, email, proposalNotes });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Faculty Opportunity Registration</h3>
              <p className="text-[11px] text-slate-400">{opportunity.type} · {opportunity.organization}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-xs">
            <div className="font-semibold text-white">{opportunity.title}</div>
            <div className="text-[11px] text-indigo-300 mt-0.5">Grant: {opportunity.grantAmount} · Duration: {opportunity.duration}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Faculty / Applicant Name *</label>
            <input
              type="text"
              required
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Statement of Interest / Research Focus</label>
            <textarea
              rows={2}
              value={proposalNotes}
              onChange={(e) => setProposalNotes(e.target.value)}
              placeholder="Outline teaching background, relevant publications, or curriculum integration goals."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30"
            >
              {isSubmitting ? 'Registering...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 4. SCHEDULE GAP INTERVENTION MODAL
// ==========================================
interface ScheduleInterventionModalProps {
  skillName: string;
  departmentName: string;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (details: { skill: string; format: string; dates: string; partner: string }) => void;
}

export const ScheduleInterventionModal: React.FC<ScheduleInterventionModalProps> = ({
  skillName,
  departmentName,
  isOpen,
  onClose,
  onSchedule
}) => {
  const [format, setFormat] = useState('Weekend Intensive Bootcamp');
  const [dates, setDates] = useState('Next Saturday - Sunday (16 Hours)');
  const [partner, setPartner] = useState('Apex Global Technologies Architects');

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule({ skill: skillName, format, dates, partner });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Schedule Skill Intervention</h3>
              <p className="text-[11px] text-slate-400">{skillName} · {departmentName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Intervention Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Weekend Intensive Bootcamp">Weekend Intensive Bootcamp (16 Hours)</option>
              <option value="Industry Bridge Course">Industry Bridge Course (3 Weeks)</option>
              <option value="Hands-On Laboratory Masterclass">Hands-On Laboratory Masterclass</option>
              <option value="Expert Guest Lecture & Code Review">Expert Guest Lecture & Code Review</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Facilitator / Industry Partner</label>
            <input
              type="text"
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Schedule Window</label>
            <input
              type="text"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-amber-600/30"
            >
              Publish Bootcamp Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 5. EDIT COLLEGE PROFILE MODAL
// ==========================================
interface EditCollegeProfileModalProps {
  profile: CollegeProfileData | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<CollegeProfileData>) => Promise<void>;
}

export const EditCollegeProfileModal: React.FC<EditCollegeProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [institutionName, setInstitutionName] = useState(profile?.institutionName || '');
  const [accreditation, setAccreditation] = useState(profile?.accreditation || '');
  const [placementCellName, setPlacementCellName] = useState(profile?.placementCellName || '');
  const [headOfPlacement, setHeadOfPlacement] = useState(profile?.headOfPlacement || '');
  const [headTitle, setHeadTitle] = useState(profile?.headTitle || '');
  const [contactEmail, setContactEmail] = useState(profile?.contactEmail || '');
  const [overview, setOverview] = useState(profile?.overview || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        institutionName,
        accreditation,
        placementCellName,
        headOfPlacement,
        headTitle,
        contactEmail,
        overview
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Update Institution Profile</h3>
              <p className="text-[11px] text-slate-400">Institutional accreditation and placement cell credentials</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Institution Name</label>
            <input
              type="text"
              required
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Accreditation & Approvals</label>
            <input
              type="text"
              value={accreditation}
              onChange={(e) => setAccreditation(e.target.value)}
              placeholder="e.g. NAAC A++ Grade · NBA Tier-1 · NIRF Top 40"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Placement Cell Dean / Head</label>
              <input
                type="text"
                value={headOfPlacement}
                onChange={(e) => setHeadOfPlacement(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Dean Title</label>
              <input
                type="text"
                value={headTitle}
                onChange={(e) => setHeadTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Institutional Overview</label>
            <textarea
              rows={3}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30"
            >
              {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

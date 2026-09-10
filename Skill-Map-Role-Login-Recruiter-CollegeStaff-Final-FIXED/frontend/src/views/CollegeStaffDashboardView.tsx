import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CollegeHeader } from '../components/college/CollegeHeader';
import { CollegeSidebar, CollegeStaffTab } from '../components/college/CollegeSidebar';
import { StudentDetailModal } from '../components/college/StudentDetailModal';
import {
  InviteRecruiterModal,
  ProposeCollaborationModal,
  ApplyFacultyModal,
  ScheduleInterventionModal,
  EditCollegeProfileModal
} from '../components/college/CollegeActionModals';

// Tab Views
import { OverviewTab } from '../components/college/tabs/OverviewTab';
import { StudentProgressTab } from '../components/college/tabs/StudentProgressTab';
import { SkillIntelligenceTab } from '../components/college/tabs/SkillIntelligenceTab';
import { SkillGapsTab } from '../components/college/tabs/SkillGapsTab';
import { InternshipsTab } from '../components/college/tabs/InternshipsTab';
import { PlacementsTab } from '../components/college/tabs/PlacementsTab';
import { RecruitersTab } from '../components/college/tabs/RecruitersTab';
import { FacultyTab } from '../components/college/tabs/FacultyTab';
import { CollaborationTab } from '../components/college/tabs/CollaborationTab';
import { ReportsTab } from '../components/college/tabs/ReportsTab';
import { NotificationsTab } from '../components/college/tabs/NotificationsTab';
import { CollegeProfileTab } from '../components/college/tabs/CollegeProfileTab';

import { collegeStaffApi } from '../services/collegeStaffApi';
import {
  CollegeStaffOverview,
  InstitutionStudent,
  SkillIntelligenceItem,
  CriticalSkillGapAlert,
  InternshipTrackingItem,
  StudentInternshipTracking,
  PlacementSummary,
  DepartmentPlacement,
  PlacementDrive,
  ConnectedRecruiter,
  FacultyOpportunity,
  IndustryCollaborationItem,
  CollegeStaffNotification,
  CollegeProfileData,
  CollegeReportsAnalytics
} from '../types';

export const CollegeStaffDashboardView: React.FC = () => {
  const { user, logout } = useApp();

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<CollegeStaffTab>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState<boolean>(false);

  // Core Data States
  const [overview, setOverview] = useState<CollegeStaffOverview | null>(null);
  const [students, setStudents] = useState<InstitutionStudent[]>([]);
  const [skillsTable, setSkillsTable] = useState<SkillIntelligenceItem[]>([]);
  const [criticalGaps, setCriticalGaps] = useState<CriticalSkillGapAlert[]>([]);
  const [topSkills, setTopSkills] = useState<string[]>([]);
  const [topGaps, setTopGaps] = useState<string[]>([]);
  const [readinessDistribution, setReadinessDistribution] = useState({
    readyAbove85: '48%',
    moderate70to84: '38%',
    needsImprovementBelow70: '14%'
  });

  // Internships
  const [internshipSummary, setInternshipSummary] = useState({
    availableInternships: 164,
    studentsApplied: 232,
    studentsSelected: 23,
    studentsCurrentlyInterning: 18,
    completedInternships: 43
  });
  const [internshipsList, setInternshipsList] = useState<InternshipTrackingItem[]>([]);
  const [studentTracking, setStudentTracking] = useState<StudentInternshipTracking[]>([]);

  // Placements
  const [placementSummary, setPlacementSummary] = useState<PlacementSummary>({
    eligibleStudents: 420,
    applicationsSubmitted: 1284,
    shortlisted: 438,
    interviewsConducted: 312,
    studentsSelected: 184,
    studentsPlaced: 384,
    placementPercentage: '91.4%',
    averagePackage: '$88,500',
    highestPackage: '$165,000'
  });
  const [departmentPlacements, setDepartmentPlacements] = useState<DepartmentPlacement[]>([]);
  const [placementDrives, setPlacementDrives] = useState<PlacementDrive[]>([]);

  // Recruiters
  const [recruiters, setRecruiters] = useState<ConnectedRecruiter[]>([]);
  const [recruiterSummary, setRecruiterSummary] = useState({
    totalPartners: 52,
    activeJobs: 35,
    activeInternships: 28,
    totalHires: 136,
    activePrograms: 12
  });

  // Faculty & Collaborations
  const [facultyOpportunities, setFacultyOpportunities] = useState<FacultyOpportunity[]>([]);
  const [collaborations, setCollaborations] = useState<IndustryCollaborationItem[]>([]);
  const [notifications, setNotifications] = useState<CollegeStaffNotification[]>([]);
  const [profile, setProfile] = useState<CollegeProfileData | null>(null);

  // Filters for Students
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [skillLevelFilter, setSkillLevelFilter] = useState('all');
  const [internshipFilter, setInternshipFilter] = useState('all');
  const [placementFilter, setPlacementFilter] = useState('all');

  // Modals
  const [selectedStudent, setSelectedStudent] = useState<InstitutionStudent | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [selectedFacultyOpp, setSelectedFacultyOpp] = useState<FacultyOpportunity | null>(null);
  const [interventionModal, setInterventionModal] = useState<{ skill: string; dept: string } | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Fetch initial dashboard bundle
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        ovRes,
        studRes,
        skillRes,
        internRes,
        placeRes,
        recRes,
        facRes,
        collabRes,
        notifRes,
        profRes
      ] = await Promise.allSettled([
        collegeStaffApi.getOverview(),
        collegeStaffApi.getStudents(),
        collegeStaffApi.getSkillIntelligence(),
        collegeStaffApi.getInternships(),
        collegeStaffApi.getPlacements(),
        collegeStaffApi.getRecruiters(),
        collegeStaffApi.getFacultyOpportunities(),
        collegeStaffApi.getCollaborations(),
        collegeStaffApi.getNotifications(),
        collegeStaffApi.getProfile()
      ]);

      if (ovRes.status === 'fulfilled') setOverview(ovRes.value);
      if (studRes.status === 'fulfilled') setStudents(studRes.value.students);
      if (skillRes.status === 'fulfilled') {
        setSkillsTable(skillRes.value.skillsTable);
        setCriticalGaps(skillRes.value.criticalSkillGaps);
        setTopSkills(skillRes.value.topSkills);
        setTopGaps(skillRes.value.topGaps);
        setReadinessDistribution(skillRes.value.overallReadinessDistribution);
      }
      if (internRes.status === 'fulfilled') {
        setInternshipSummary(internRes.value.summary);
        setInternshipsList(internRes.value.internships);
        setStudentTracking(internRes.value.studentTracking);
      }
      if (placeRes.status === 'fulfilled') {
        setPlacementSummary(placeRes.value.summary);
        setDepartmentPlacements(placeRes.value.departmentPlacements);
        setPlacementDrives(placeRes.value.placementDrives);
      }
      if (recRes.status === 'fulfilled') {
        setRecruiters(recRes.value.recruiters);
        setRecruiterSummary(recRes.value.summary);
      }
      if (facRes.status === 'fulfilled') setFacultyOpportunities(facRes.value.opportunities);
      if (collabRes.status === 'fulfilled') setCollaborations(collabRes.value.collaborations);
      if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.notifications);
      if (profRes.status === 'fulfilled') setProfile(profRes.value.profile);
    } catch (err: any) {
      console.error('Error loading institution data:', err);
      setError('Unable to load data from academic records services. Please check network connectivity.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Filtered students computation
  const filteredStudents = students.filter((s) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        s.name.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (departmentFilter !== 'all' && s.department !== departmentFilter) return false;
    if (courseFilter !== 'all' && s.course !== courseFilter) return false;
    if (yearFilter !== 'all' && s.graduationYear.toString() !== yearFilter) return false;
    if (skillLevelFilter !== 'all') {
      if (skillLevelFilter === 'High' && s.skillScore < 85) return false;
      if (skillLevelFilter === 'Medium' && (s.skillScore < 70 || s.skillScore >= 85)) return false;
      if (skillLevelFilter === 'Low' && s.skillScore >= 70) return false;
    }
    if (internshipFilter !== 'all' && s.internshipStatus !== internshipFilter) return false;
    if (placementFilter !== 'all' && s.placementStatus !== placementFilter) return false;
    return true;
  });

  // Action Handlers
  const handleUpdateStage = async (rollNumber: string, stage: string) => {
    try {
      await collegeStaffApi.updateStudentInternshipStage(rollNumber, stage);
      setStudentTracking((prev) =>
        prev.map((item) =>
          item.rollNumber === rollNumber
            ? { ...item, stage: stage as StudentInternshipTracking['stage'] }
            : item
        )
      );
    } catch (e) {
      console.error('Could not update stage:', e);
    }
  };

  const handleInviteRecruiter = async (data: {
    companyName: string;
    industry: string;
    website?: string;
    recruiterName?: string;
    recruiterEmail: string;
  }) => {
    const res = await collegeStaffApi.inviteRecruiter(data);
    if (res.partner) {
      setRecruiters((prev) => [res.partner, ...prev]);
      setRecruiterSummary((prev) => ({ ...prev, totalPartners: prev.totalPartners + 1 }));
    }
  };

  const handleProposeCollab = async (data: Partial<IndustryCollaborationItem>) => {
    const res = await collegeStaffApi.proposeCollaboration(data);
    if (res.collaboration) {
      setCollaborations((prev) => [res.collaboration, ...prev]);
    }
  };

  const handleApplyFaculty = async (
    id: string,
    data: { facultyName: string; department: string; email: string; proposalNotes?: string }
  ) => {
    await collegeStaffApi.applyFacultyOpportunity(id, data);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Faculty Opportunity Registered',
        message: `${data.facultyName} has submitted registration for opportunity ID ${id}.`,
        type: 'faculty',
        category: 'Faculty',
        timestamp: new Date().toISOString(),
        read: false
      },
      ...prev
    ]);
  };

  const handleScheduleIntervention = (details: { skill: string; format: string; dates: string; partner: string }) => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Skill Intervention Published: ${details.skill}`,
        message: `${details.format} scheduled (${details.dates}) facilitated by ${details.partner}.`,
        type: 'alert',
        category: 'Skill Gap',
        timestamp: new Date().toISOString(),
        read: false
      },
      ...prev
    ]);
  };

  const handleSaveProfile = async (data: Partial<CollegeProfileData>) => {
    const res = await collegeStaffApi.updateProfile(data);
    if (res.profile) {
      setProfile(res.profile);
    }
  };

  const handleMarkRead = async (id: string) => {
    await collegeStaffApi.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleExportReport = (type: 'csv' | 'pdf') => {
    if (type === 'csv') {
      const headers = 'RollNumber,Name,Course,Department,GradYear,SkillScore,ReadinessScore,Internship,Placement\n';
      const rows = students
        .map(
          (s) =>
            `"${s.rollNumber}","${s.name}","${s.course}","${s.department}",${s.graduationYear},${s.skillScore},${s.readinessScore},"${s.internshipStatus}","${s.placementStatus}"`
        )
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Institution_Skill_Map_Report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // PDF export preview summary trigger
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30">
      {/* Top Navigation */}
      <CollegeHeader
        profile={profile}
        userName={user.name}
        notifications={notifications}
        showNotifications={showNotificationDropdown}
        setShowNotifications={setShowNotificationDropdown}
        onMarkRead={handleMarkRead}
        onLogout={logout}
      />

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <CollegeSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          studentsCount={students.length}
          gapAlertsCount={criticalGaps.length}
          unreadNotifications={notifications.filter((n) => !n.read).length}
        />

        {/* Content Pane */}
        <main className="flex-1 min-w-0">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800/60 p-8">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-semibold text-slate-200">Loading institution records...</p>
              <p className="text-xs text-slate-500 mt-1">Connecting to academic intelligence services</p>
            </div>
          )}

          {!loading && error && !overview && (
            <div className="bg-rose-950/30 border border-rose-800/50 rounded-2xl p-8 text-center max-w-lg mx-auto my-12">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Unable to load data</h3>
              <p className="text-xs text-slate-400 mt-1 mb-5">{error}</p>
              <button
                type="button"
                onClick={fetchAllData}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && (overview || !error) && (
            <>
              {activeTab === 'overview' && (
                <OverviewTab overview={overview} onNavigateTab={(tab) => setActiveTab(tab)} />
              )}

          {activeTab === 'students' && (
            <StudentProgressTab
              students={filteredStudents}
              search={search}
              setSearch={setSearch}
              departmentFilter={departmentFilter}
              setDepartmentFilter={setDepartmentFilter}
              courseFilter={courseFilter}
              setCourseFilter={setCourseFilter}
              yearFilter={yearFilter}
              setYearFilter={setYearFilter}
              skillLevelFilter={skillLevelFilter}
              setSkillLevelFilter={setSkillLevelFilter}
              internshipFilter={internshipFilter}
              setInternshipFilter={setInternshipFilter}
              placementFilter={placementFilter}
              setPlacementFilter={setPlacementFilter}
              onSelectStudent={(s) => setSelectedStudent(s)}
            />
          )}

          {activeTab === 'skill-intelligence' && (
            <SkillIntelligenceTab
              skillsTable={skillsTable}
              criticalGaps={criticalGaps}
              topSkills={topSkills}
              topGaps={topGaps}
              readinessDistribution={readinessDistribution}
              onScheduleIntervention={(skill, dept) => setInterventionModal({ skill, dept })}
            />
          )}

          {activeTab === 'skill-gaps' && (
            <SkillGapsTab
              criticalGaps={criticalGaps}
              onScheduleIntervention={(skill, dept) => setInterventionModal({ skill, dept })}
            />
          )}

          {activeTab === 'internships' && (
            <InternshipsTab
              summary={internshipSummary}
              internships={internshipsList}
              studentTracking={studentTracking}
              onUpdateStage={handleUpdateStage}
            />
          )}

          {activeTab === 'placements' && (
            <PlacementsTab
              summary={placementSummary}
              departmentPlacements={departmentPlacements}
              placementDrives={placementDrives}
            />
          )}

          {activeTab === 'recruiters' && (
            <RecruitersTab
              recruiters={recruiters}
              summary={recruiterSummary}
              onOpenInviteModal={() => setIsInviteModalOpen(true)}
            />
          )}

          {activeTab === 'faculty' && (
            <FacultyTab
              opportunities={facultyOpportunities}
              onApply={(opp) => setSelectedFacultyOpp(opp)}
            />
          )}

          {activeTab === 'collaboration' && (
            <CollaborationTab
              collaborations={collaborations}
              onOpenCreateModal={() => setIsProposeModalOpen(true)}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsTab
              analytics={{
                placementTrendsOverTime: [
                  { year: '2022', placed: 310, avgSalary: '$72,000', placementRate: '82%' },
                  { year: '2023', placed: 342, avgSalary: '$78,500', placementRate: '86%' },
                  { year: '2024', placed: 368, avgSalary: '$84,000', placementRate: '89%' },
                  { year: '2025', placed: 384, avgSalary: '$88,500', placementRate: '91%' },
                  { year: '2026 (Est.)', placed: 405, avgSalary: '$94,000', placementRate: '94%' }
                ],
                topRecruitingCompanies: [
                  { name: 'Apex Global Technologies', hires: 48, avgPackage: '$96,000', roles: 'Software & Cloud' },
                  { name: 'CloudScale Systems', hires: 34, avgPackage: '$92,000', roles: 'DevOps & Backend' },
                  { name: 'Cognitive Data Labs', hires: 26, avgPackage: '$105,000', roles: 'AI & Data Science' },
                  { name: 'Nexus Cyber Defense', hires: 18, avgPackage: '$88,000', roles: 'Security Operations' }
                ],
                readinessDistribution
              }}
              onExportReport={handleExportReport}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab
              notifications={notifications}
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
            />
          )}

          {activeTab === 'profile' && (
            <CollegeProfileTab
              profile={profile}
              onOpenEditModal={() => setIsEditProfileOpen(true)}
            />
          )}
          </>
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={selectedStudent !== null}
        onClose={() => setSelectedStudent(null)}
      />

      <InviteRecruiterModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSubmit={handleInviteRecruiter}
      />

      <ProposeCollaborationModal
        isOpen={isProposeModalOpen}
        onClose={() => setIsProposeModalOpen(false)}
        onSubmit={handleProposeCollab}
      />

      <ApplyFacultyModal
        opportunity={selectedFacultyOpp}
        isOpen={selectedFacultyOpp !== null}
        onClose={() => setSelectedFacultyOpp(null)}
        onSubmit={handleApplyFaculty}
      />

      <ScheduleInterventionModal
        skillName={interventionModal?.skill || ''}
        departmentName={interventionModal?.dept || ''}
        isOpen={interventionModal !== null}
        onClose={() => setInterventionModal(null)}
        onSchedule={handleScheduleIntervention}
      />

      <EditCollegeProfileModal
        profile={profile}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSubmit={handleSaveProfile}
      />
    </div>
  );
};

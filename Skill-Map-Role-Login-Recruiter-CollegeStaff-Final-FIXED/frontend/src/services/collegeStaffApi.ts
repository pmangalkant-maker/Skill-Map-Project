import { apiRequest } from './apiClient';
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
  CollegeProfileData
} from '../types';

export const collegeStaffApi = {
  // 1. Overview
  async getOverview(): Promise<CollegeStaffOverview> {
    return apiRequest<CollegeStaffOverview>('/api/institution/overview');
  },

  // 2. Student Progress
  async getStudents(params?: {
    department?: string;
    course?: string;
    year?: string;
    skillLevel?: string;
    internshipStatus?: string;
    placementStatus?: string;
    search?: string;
  }): Promise<{ students: InstitutionStudent[]; count: number }> {
    const qs = new URLSearchParams();
    if (params?.department) qs.append('department', params.department);
    if (params?.course) qs.append('course', params.course);
    if (params?.year) qs.append('year', params.year);
    if (params?.skillLevel) qs.append('skillLevel', params.skillLevel);
    if (params?.internshipStatus) qs.append('internshipStatus', params.internshipStatus);
    if (params?.placementStatus) qs.append('placementStatus', params.placementStatus);
    if (params?.search) qs.append('search', params.search);
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return apiRequest<{ students: InstitutionStudent[]; count: number }>(`/api/institution/students${query}`);
  },

  // Student Detail (Authorized Read-Only View)
  async getStudentById(id: string): Promise<{ student: InstitutionStudent }> {
    return apiRequest<{ student: InstitutionStudent }>(`/api/institution/students/${id}`);
  },

  // 3 & 4. Skill Intelligence & Gaps
  async getSkillIntelligence(): Promise<{
    skillsTable: SkillIntelligenceItem[];
    criticalSkillGaps: CriticalSkillGapAlert[];
    topSkills: string[];
    topGaps: string[];
    overallReadinessDistribution: {
      readyAbove85: string;
      moderate70to84: string;
      needsImprovementBelow70: string;
    };
  }> {
    return apiRequest('/api/institution/skill-intelligence');
  },

  // 5. Internships Tracking
  async getInternships(): Promise<{
    summary: {
      availableInternships: number;
      studentsApplied: number;
      studentsSelected: number;
      studentsCurrentlyInterning: number;
      completedInternships: number;
    };
    internships: InternshipTrackingItem[];
    studentTracking: StudentInternshipTracking[];
  }> {
    return apiRequest('/api/institution/internships');
  },

  async updateStudentInternshipStage(studentId: string, stage: string): Promise<{ success: boolean; stage: string }> {
    return apiRequest<{ success: boolean; stage: string }>(`/api/institution/internships/student/${studentId}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage })
    });
  },

  // 6. Placements Tracking
  async getPlacements(): Promise<{
    summary: PlacementSummary;
    departmentPlacements: DepartmentPlacement[];
    placementDrives: PlacementDrive[];
  }> {
    return apiRequest('/api/institution/placements');
  },

  // 7. Recruiter Connections
  async getRecruiters(): Promise<{
    recruiters: ConnectedRecruiter[];
    summary: {
      totalPartners: number;
      activeJobs: number;
      activeInternships: number;
      totalHires: number;
      activePrograms: number;
    };
  }> {
    return apiRequest('/api/institution/recruiters');
  },

  async inviteRecruiter(data: {
    companyName: string;
    industry: string;
    website?: string;
    recruiterName?: string;
    recruiterEmail: string;
  }): Promise<{ partner: ConnectedRecruiter }> {
    return apiRequest<{ partner: ConnectedRecruiter }>('/api/institution/recruiters/invite', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // 8. Faculty Opportunities
  async getFacultyOpportunities(): Promise<{
    opportunities: FacultyOpportunity[];
    categories: string[];
  }> {
    return apiRequest('/api/institution/faculty-opportunities');
  },

  async applyFacultyOpportunity(
    id: string,
    data: { facultyName: string; department: string; email: string; proposalNotes?: string }
  ): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/api/institution/faculty-opportunities/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // 9. Industry Collaborations
  async getCollaborations(): Promise<{
    collaborations: IndustryCollaborationItem[];
    types: string[];
  }> {
    return apiRequest('/api/institution/collaborations');
  },

  async proposeCollaboration(data: Partial<IndustryCollaborationItem>): Promise<{ collaboration: IndustryCollaborationItem }> {
    return apiRequest<{ collaboration: IndustryCollaborationItem }>('/api/institution/collaborations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // 10. Reports & Analytics
  async getReports(params?: { department?: string; course?: string; year?: string }): Promise<{
    department: string;
    course: string;
    year: string;
    skillDistribution: { category: string; proficiency: number; studentShare: string }[];
    departmentComparisons: { dept: string; skillScore: number; gapIndex: number; placementRate: number; internRate: number }[];
    placementTrends: { year: string; placed: number; highest: string; avg: string }[];
  }> {
    const qs = new URLSearchParams();
    if (params?.department) qs.append('department', params.department);
    if (params?.course) qs.append('course', params.course);
    if (params?.year) qs.append('year', params.year);
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return apiRequest(`/api/institution/reports${query}`);
  },

  // 11. Notifications
  async getNotifications(): Promise<{ notifications: CollegeStaffNotification[]; count: number }> {
    return apiRequest<{ notifications: CollegeStaffNotification[]; count: number }>('/api/institution/notifications');
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/api/institution/notifications/${id}/read`, {
      method: 'PATCH'
    });
  },

  // 12. College Profile
  async getProfile(): Promise<{ profile: CollegeProfileData }> {
    return apiRequest<{ profile: CollegeProfileData }>('/api/institution/profile');
  },

  async updateProfile(data: Partial<CollegeProfileData>): Promise<{ profile: CollegeProfileData }> {
    return apiRequest<{ profile: CollegeProfileData }>('/api/institution/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};

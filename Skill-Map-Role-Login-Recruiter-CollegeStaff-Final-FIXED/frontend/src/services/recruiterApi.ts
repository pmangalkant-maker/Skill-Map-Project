import { apiRequest } from './apiClient';
import {
  RecruiterJob,
  RecruiterInternship,
  RecruiterProject,
  CandidateItem,
  MatchResult,
  RecruiterApplication,
  AcademiaCollaboration,
  SkillDemandItem,
  RecruiterNotification,
  RecruiterCompanyProfile
} from '../types';

export interface OverviewData {
  activeJobs: number;
  activeInternships: number;
  applicationsReceived: number;
  candidatesShortlisted: number;
  candidatesHired: number;
  interviewsScheduled: number;
  pipeline: {
    applied: number;
    reviewed: number;
    shortlisted: number;
    interview: number;
    selected: number;
    hired: number;
  };
  recentApplications: RecruiterApplication[];
}

export const recruiterApi = {
  // Overview
  async getOverview(): Promise<OverviewData> {
    return apiRequest<OverviewData>('/api/recruiter/overview');
  },

  // Jobs
  async getJobs(params?: { search?: string; workMode?: string; status?: string }): Promise<{ jobs: RecruiterJob[] }> {
    const qs = new URLSearchParams();
    if (params?.search) qs.append('search', params.search);
    if (params?.workMode) qs.append('workMode', params.workMode);
    if (params?.status) qs.append('status', params.status);
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return apiRequest<{ jobs: RecruiterJob[] }>(`/api/recruiter/jobs${query}`);
  },

  async createJob(data: Partial<RecruiterJob>): Promise<{ job: RecruiterJob }> {
    return apiRequest<{ job: RecruiterJob }>('/api/recruiter/jobs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateJob(id: string, data: Partial<RecruiterJob>): Promise<{ job: RecruiterJob }> {
    return apiRequest<{ job: RecruiterJob }>(`/api/recruiter/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteJob(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/api/recruiter/jobs/${id}`, {
      method: 'DELETE'
    });
  },

  // Internships
  async getInternships(params?: { search?: string; workMode?: string }): Promise<{ internships: RecruiterInternship[] }> {
    const qs = new URLSearchParams();
    if (params?.search) qs.append('search', params.search);
    if (params?.workMode) qs.append('workMode', params.workMode);
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return apiRequest<{ internships: RecruiterInternship[] }>(`/api/recruiter/internships${query}`);
  },

  async createInternship(data: Partial<RecruiterInternship>): Promise<{ internship: RecruiterInternship }> {
    return apiRequest<{ internship: RecruiterInternship }>('/api/recruiter/internships', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateInternship(id: string, data: Partial<RecruiterInternship>): Promise<{ internship: RecruiterInternship }> {
    return apiRequest<{ internship: RecruiterInternship }>(`/api/recruiter/internships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteInternship(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/api/recruiter/internships/${id}`, {
      method: 'DELETE'
    });
  },

  // Projects
  async getProjects(params?: { search?: string }): Promise<{ projects: RecruiterProject[] }> {
    const qs = new URLSearchParams();
    if (params?.search) qs.append('search', params.search);
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return apiRequest<{ projects: RecruiterProject[] }>(`/api/recruiter/projects${query}`);
  },

  async createProject(data: Partial<RecruiterProject>): Promise<{ project: RecruiterProject }> {
    return apiRequest<{ project: RecruiterProject }>('/api/recruiter/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateProject(id: string, data: Partial<RecruiterProject>): Promise<{ project: RecruiterProject }> {
    return apiRequest<{ project: RecruiterProject }>(`/api/recruiter/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteProject(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/api/recruiter/projects/${id}`, {
      method: 'DELETE'
    });
  },

  // Candidates & Search
  async searchCandidates(params?: {
    search?: string;
    skills?: string;
    education?: string;
    experience?: string;
    minScore?: number;
    hasCertification?: boolean;
    hasInternship?: boolean;
  }): Promise<{ candidates: CandidateItem[] }> {
    const qs = new URLSearchParams();
    if (params?.search) qs.append('search', params.search);
    if (params?.skills) qs.append('skills', params.skills);
    if (params?.education) qs.append('education', params.education);
    if (params?.experience) qs.append('experience', params.experience);
    if (params?.minScore) qs.append('minScore', params.minScore.toString());
    if (params?.hasCertification) qs.append('hasCertification', 'true');
    if (params?.hasInternship) qs.append('hasInternship', 'true');
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return apiRequest<{ candidates: CandidateItem[] }>(`/api/recruiter/candidates${query}`);
  },

  // AI Matching
  async matchCandidates(requirements: {
    requiredSkills: string[];
    softSkills?: string[];
    preferredSkills?: string[];
    targetRole?: string;
  }): Promise<{ matches: MatchResult[] }> {
    return apiRequest<{ matches: MatchResult[] }>('/api/recruiter/match', {
      method: 'POST',
      body: JSON.stringify(requirements)
    });
  },

  // Applications & Pipeline
  async getApplications(params?: { stage?: string; opportunityId?: string; search?: string }): Promise<{ applications: RecruiterApplication[] }> {
    const qs = new URLSearchParams();
    if (params?.stage) qs.append('stage', params.stage);
    if (params?.opportunityId) qs.append('opportunityId', params.opportunityId);
    if (params?.search) qs.append('search', params.search);
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return apiRequest<{ applications: RecruiterApplication[] }>(`/api/recruiter/applications${query}`);
  },

  async updateApplicationStage(id: string, stage: string, notes?: string): Promise<{ application: RecruiterApplication }> {
    return apiRequest<{ application: RecruiterApplication }>(`/api/recruiter/applications/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage, notes })
    });
  },

  // Schedule Interview
  async scheduleInterview(data: {
    candidateId: string;
    candidateName: string;
    candidateEmail?: string;
    opportunityId: string;
    opportunityTitle: string;
    date: string;
    time: string;
    mode?: string;
    interviewer?: string;
    meetingLink?: string;
    notes?: string;
  }): Promise<{ interview: any }> {
    return apiRequest<{ interview: any }>('/api/recruiter/interviews', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Send Offer (Internship or Job)
  async sendOffer(data: {
    candidateId: string;
    candidateName: string;
    candidateEmail?: string;
    opportunityId: string;
    opportunityTitle: string;
    offerType: 'Internship' | 'Job';
    compensation: string;
    startDate: string;
    notes?: string;
  }): Promise<{ offer: any }> {
    return apiRequest<{ offer: any }>('/api/recruiter/offers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Academia Collaborations
  async getCollaborations(): Promise<{ collaborations: AcademiaCollaboration[] }> {
    return apiRequest<{ collaborations: AcademiaCollaboration[] }>('/api/recruiter/collaborations');
  },

  async createCollaboration(data: Partial<AcademiaCollaboration>): Promise<{ collaboration: AcademiaCollaboration }> {
    return apiRequest<{ collaboration: AcademiaCollaboration }>('/api/recruiter/collaborations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Skill Demand Analytics
  async getSkillDemand(): Promise<{ skillDemand: SkillDemandItem[] }> {
    return apiRequest<{ skillDemand: SkillDemandItem[] }>('/api/recruiter/skill-demand');
  },

  // Notifications
  async getNotifications(): Promise<{ notifications: RecruiterNotification[]; unreadCount: number }> {
    return apiRequest<{ notifications: RecruiterNotification[]; unreadCount: number }>('/api/recruiter/notifications');
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/api/recruiter/notifications/${id}/read`, {
      method: 'PATCH'
    });
  },

  // Profile
  async getProfile(): Promise<{ profile: RecruiterCompanyProfile }> {
    return apiRequest<{ profile: RecruiterCompanyProfile }>('/api/recruiter/profile');
  },

  async updateProfile(data: Partial<RecruiterCompanyProfile>): Promise<{ profile: RecruiterCompanyProfile }> {
    return apiRequest<{ profile: RecruiterCompanyProfile }>('/api/recruiter/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};

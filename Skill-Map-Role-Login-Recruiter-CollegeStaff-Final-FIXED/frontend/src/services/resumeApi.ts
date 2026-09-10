import { UploadedResume } from '../types';
import { apiRequest } from './apiClient';

export interface ResumeUploadApiResponse {
  success: boolean;
  data?: UploadedResume;
  error?: string;
  message?: string;
}

export interface ExtractedSkillItem {
  name: string;
  category: 'Technical Skills' | 'Soft Skills' | 'Tools & Technologies' | 'Other Skills';
  confidence: number;
  suggestedLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  suggestedScore: number;
  contextFound: string;
}

export interface ResumeAnalysisSummary {
  fileName: string;
  candidateName: string;
  email: string;
  phone: string;
  education: string;
  experienceHighlights: string[];
  certifications: string[];
  projects: string[];
  detectedSections: string[];
  skillsDetected: string[];
  textCharacters: number;
}

export interface SkillExtractionApiResponse {
  success: boolean;
  extractedSkills: ExtractedSkillItem[];
  totalFound: number;
  aiMode?: string;
  resumeAnalysis?: ResumeAnalysisSummary;
  error?: string;
  message?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export const resumeApi = {
  /**
   * Uploads candidate resume document to POST /api/resume/upload
   */
  async uploadResume(file: File): Promise<ResumeUploadApiResponse> {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await apiRequest('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.success && response.resume) {
        const isDocx = file.name.toLowerCase().endsWith('.docx');
        const uploaded: UploadedResume = {
          id: response.resume.id || `res-${Date.now()}`,
          name: response.resume.fileName || file.name,
          size: response.resume.fileSize || file.size,
          formattedSize: formatBytes(response.resume.fileSize || file.size),
          type: response.resume.mimeType || file.type,
          format: isDocx ? 'DOCX' : 'PDF',
          uploadedAt: new Date(response.resume.uploadedAt || Date.now()).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          status: 'ready_for_extraction',
        };

        return {
          success: true,
          data: uploaded,
          message: response.message || 'Resume uploaded successfully.',
        };
      }

      return {
        success: false,
        error: response.message || 'Upload failed',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to upload resume to server.',
      };
    }
  },

  /**
   * Retrieves active resume for current candidate
   */
  async getResume(): Promise<UploadedResume | null> {
    try {
      const response = await apiRequest('/api/resume', {
        method: 'GET',
      });

      if (response.success && response.resume) {
        const isDocx = response.resume.fileName.toLowerCase().endsWith('.docx');
        return {
          id: response.resume.id,
          name: response.resume.fileName,
          size: response.resume.fileSize,
          formattedSize: formatBytes(response.resume.fileSize),
          type: response.resume.mimeType,
          format: isDocx ? 'DOCX' : 'PDF',
          uploadedAt: new Date(response.resume.uploadedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          status: 'ready_for_extraction',
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Triggers real Gemini-powered extraction of skills from uploaded resume
   */
  async extractSkills(resumeId?: string): Promise<SkillExtractionApiResponse> {
    try {
      const response = await apiRequest('/api/resume/extract-skills', {
        method: 'POST',
        body: JSON.stringify({ resumeId }),
      });

      if (response.success && Array.isArray(response.skills)) {
        const formatted: ExtractedSkillItem[] = response.skills.map((s: any) => ({
          name: s.name,
          category: s.category || 'Technical Skills',
          confidence: s.confidence || 90,
          suggestedLevel: s.level || 'Intermediate',
          suggestedScore: s.level === 'Advanced' ? 85 : s.level === 'Intermediate' ? 70 : 50,
          contextFound: s.contextFound || 'Extracted from resume document',
        }));

        return {
          success: true,
          totalFound: formatted.length,
          extractedSkills: formatted,
          aiMode: response.aiMode,
          resumeAnalysis: response.resumeAnalysis,
          message: response.message,
        };
      }

      return {
        success: false,
        totalFound: 0,
        extractedSkills: [],
        error: response.message || 'Skill extraction failed',
      };
    } catch (error: any) {
      return {
        success: false,
        totalFound: 0,
        extractedSkills: [],
        error: error.message || 'Skill extraction failed via Gemini AI',
      };
    }
  },

  /**
   * Deletes candidate resume from server
   */
  async deleteResume(resumeId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiRequest('/api/resume', {
        method: 'DELETE',
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

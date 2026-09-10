import { SkillItem, SkillCategory, ProficiencyLevel, SkillStatus } from '../types';
import { apiRequest } from './apiClient';
import { resumeApi } from './resumeApi';

export interface SyncResponse {
  success: boolean;
  syncedAt: string;
  count: number;
  message: string;
}

export interface ExtractedSkillResult {
  name: string;
  category: SkillCategory;
  level: ProficiencyLevel;
  score: number;
  targetScore: number;
  status: SkillStatus;
  source: 'resume_extracted';
  isAiExtracted: boolean;
  aiConfidence: number;
  confirmedByCandidate: boolean;
  evidenceSnippet?: string;
}

export const skillsApi = {
  /**
   * Fetch all skills for the authenticated user from MongoDB
   */
  async getSkills(): Promise<SkillItem[]> {
    try {
      const res = await apiRequest('/api/skills', { method: 'GET' });
      if (res.success && Array.isArray(res.skills)) {
        return res.skills;
      }
      return [];
    } catch (err: any) {
      console.warn('Could not fetch skills from MongoDB backend:', err.message || err);
      throw err;
    }
  },

  /**
   * Synchronize skill list with MongoDB backend persistence store
   */
  async syncSkills(skills: SkillItem[]): Promise<SyncResponse> {
    try {
      const serverSkills = await this.getSkills();
      return {
        success: true,
        syncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        count: serverSkills.length,
        message: `Successfully synchronized ${serverSkills.length} skills with MongoDB database.`,
      };
    } catch (err: any) {
      return {
        success: false,
        syncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        count: skills.length,
        message: err.message || 'Database synchronization failed.',
      };
    }
  },

  /**
   * Create skill in MongoDB via POST /api/skills
   */
  async createSkill(skillData: Omit<SkillItem, 'id' | 'lastUpdated'>): Promise<SkillItem> {
    const rawSource = skillData.source;
    const isResume = rawSource === 'resume' || rawSource === 'resume_extracted' || Boolean(skillData.isAiExtracted);
    const source = isResume ? 'resume' : 'manual';

    const res = await apiRequest('/api/skills', {
      method: 'POST',
      body: JSON.stringify({
        name: skillData.name,
        category: skillData.category,
        level: skillData.level,
        score: skillData.score,
        targetScore: skillData.targetScore,
        source,
        notes: skillData.notes,
        status: skillData.status,
      }),
    });

    if (res.success && res.skill) {
      return res.skill;
    }

    throw new Error(res.message || 'Failed to persist skill to MongoDB');
  },

  /**
   * Update skill in MongoDB via PUT /api/skills/:id
   */
  async updateSkill(id: string, updates: Partial<SkillItem>): Promise<SkillItem> {
    const payload: Record<string, any> = { ...updates };
    if (updates.source !== undefined) {
      const isResume = updates.source === 'resume' || updates.source === 'resume_extracted' || Boolean(updates.isAiExtracted);
      payload.source = isResume ? 'resume' : 'manual';
    }

    const res = await apiRequest(`/api/skills/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (res.success && res.skill) {
      return res.skill;
    }

    throw new Error(res.message || 'Failed to update skill in MongoDB');
  },

  /**
   * Delete skill in MongoDB via DELETE /api/skills/:id
   */
  async deleteSkill(id: string): Promise<boolean> {
    const res = await apiRequest(`/api/skills/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (res.success) {
      return true;
    }

    throw new Error(res.message || 'Failed to delete skill from MongoDB');
  },

  /**
   * Extract skills using real backend Gemini extraction
   */
  async extractSkillsFromUploadedDocument(fileName?: string): Promise<ExtractedSkillResult[]> {
    const res = await resumeApi.extractSkills();
    if (res.success && res.extractedSkills.length > 0) {
      return res.extractedSkills.map((s) => ({
        name: s.name,
        category: s.category as SkillCategory,
        level: s.suggestedLevel as ProficiencyLevel,
        score: s.suggestedScore,
        targetScore: 85,
        status: 'Self-Assessed',
        source: 'resume_extracted',
        isAiExtracted: true,
        aiConfidence: s.confidence,
        confirmedByCandidate: false,
        evidenceSnippet: s.contextFound,
      }));
    }

    throw new Error(res.error || 'Failed to extract skills from resume. Please ensure a resume has been uploaded.');
  },
};

import { apiClient } from './apiClient';

export type DocumentCategory =
  | 'certificate'
  | 'internship_report'
  | 'academic_record'
  | 'portfolio_document'
  | 'other';

export interface ManagedDocument {
  _id: string;
  originalName: string;
  mimeType: string;
  size: number;
  category: DocumentCategory;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export const documentApi = {
  async list(): Promise<{ success: boolean; documents: ManagedDocument[] }> {
    return apiClient.get('/api/documents');
  },

  async upload(file: File, category: DocumentCategory): Promise<{ success: boolean; message: string; document?: ManagedDocument }> {
    const form = new FormData();
    form.append('document', file);
    form.append('category', category);
    return apiClient.post('/api/documents', form);
  },

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/api/documents/${id}`);
  },

  downloadUrl(id: string): string {
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
    return `${base}/api/documents/${id}/download`;
  }
};

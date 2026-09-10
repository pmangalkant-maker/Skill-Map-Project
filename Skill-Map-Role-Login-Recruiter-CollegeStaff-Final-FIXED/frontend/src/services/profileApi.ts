import { UserProfile } from '../types';
import { apiRequest } from './apiClient';

/**
 * Service layer prepared for backend integration with candidate profile GET/PUT APIs.
 * In a full-stack environment with a live server, replace these with fetch('/api/candidate/profile', ...)
 */

export interface ProfileApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: Record<string, string>;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
  education: string;
  degree: string;
  graduationYear: string;
  experienceLevel: string;
  targetRole: string;
  location: string;
  headline: string;
  bio: string;
  careerInterests: string[];
}

/**
 * Validates profile fields prior to transmission
 */
export function validateProfilePayload(payload: UpdateProfilePayload): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!payload.name || payload.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!payload.email || !emailRegex.test(payload.email.trim())) {
    errors.email = 'Please provide a valid institutional or personal email address.';
  }

  if (!payload.education || payload.education.trim().length < 2) {
    errors.education = 'Education / University name is required.';
  }

  if (!payload.degree || payload.degree.trim().length < 2) {
    errors.degree = 'Degree / Course specification is required.';
  }

  const yearNum = parseInt(payload.graduationYear, 10);
  if (!payload.graduationYear || isNaN(yearNum) || yearNum < 1990 || yearNum > 2035) {
    errors.graduationYear = 'Graduation year must be a valid 4-digit year between 1990 and 2035.';
  }

  if (!payload.targetRole || payload.targetRole.trim().length < 2) {
    errors.targetRole = 'Target role objective is required.';
  }

  if (!payload.location || payload.location.trim().length < 2) {
    errors.location = 'Location or campus is required.';
  }

  return errors;
}

/**
 * GET: Retrieves candidate profile information
 * Endpoint: GET /api/profile
 */
export async function getCandidateProfile(userId?: string, currentUser?: UserProfile): Promise<ProfileApiResult<UserProfile>> {
  try {
    const res = await apiRequest('/api/profile', { method: 'GET' });
    if (res.success && res.user) {
      return { success: true, data: res.user };
    }
  } catch (err: any) {
    console.warn('Backend get profile failed, falling back to local user state:', err);
  }

  if (currentUser) {
    return { success: true, data: currentUser };
  }

  return {
    success: false,
    error: 'Candidate profile record could not be retrieved from database.',
  };
}

/**
 * PUT: Updates candidate profile information
 * Endpoint: PUT /api/profile
 */
export async function updateCandidateProfile(
  payload: UpdateProfilePayload,
  simulateError = false
): Promise<ProfileApiResult<UpdateProfilePayload>> {
  // Client-side validation
  const validationErrors = validateProfilePayload(payload);
  if (Object.keys(validationErrors).length > 0) {
    return {
      success: false,
      error: 'Please resolve the highlighted validation errors before saving.',
      validationErrors,
    };
  }

  if (simulateError) {
    return {
      success: false,
      error: 'Backend API Error (500): Database persistence write timeout. Please try again.',
    };
  }

  try {
    const res = await apiRequest('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (res.success) {
      return {
        success: true,
        data: payload,
      };
    }
    return {
      success: false,
      error: res.message || 'Failed to update candidate profile on server.',
    };
  } catch (err: any) {
    console.warn('Backend profile update failed, using local optimistic update:', err);
    return {
      success: true,
      data: payload,
    };
  }
}

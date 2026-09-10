import { UserProfile, UserRole } from '../types';
import { apiRequest, setAuthToken, removeAuthToken, getAuthToken } from './apiClient';

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
  role?: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  targetRole?: string;
  role?: UserRole;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: Partial<UserProfile>;
  error?: string;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email.trim().toLowerCase(),
          password: payload.password,
          role: payload.role || 'student'
        }),
      });

      if (data.token) {
        setAuthToken(data.token);
      }

      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed. Please check your credentials.',
      };
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: payload.name.trim(),
          email: payload.email.trim().toLowerCase(),
          password: payload.password,
          phone: payload.phone?.trim() || '',
          targetRole: payload.targetRole?.trim() || 'Full Stack Cloud Engineer',
          role: payload.role || 'student',
        }),
      });

      if (data.token) {
        setAuthToken(data.token);
      }

      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed. Please check the provided information.',
      };
    }
  },

  async getCurrentSession(): Promise<{ authenticated: boolean; user?: Partial<UserProfile> }> {
    const token = getAuthToken();
    if (!token) {
      return { authenticated: false };
    }

    try {
      const data = await apiRequest('/api/auth/me', {
        method: 'GET',
      });

      if (data.success && data.user) {
        return { authenticated: true, user: data.user };
      }
      removeAuthToken();
      return { authenticated: false };
    } catch (err) {
      removeAuthToken();
      return { authenticated: false };
    }
  },

  async logout(): Promise<{ success: boolean }> {
    removeAuthToken();
    return { success: true };
  },
};

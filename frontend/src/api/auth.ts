import apiClient from './client';
import type { LoginCredentials, AuthResponse, User } from '../types';

export const authApi = {
  // Login with credentials
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Logout (invalidate token on server)
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // Get current user info
  me: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Validate token is still valid
  validateToken: async (): Promise<boolean> => {
    try {
      await apiClient.get('/auth/validate');
      return true;
    } catch {
      return false;
    }
  },
};

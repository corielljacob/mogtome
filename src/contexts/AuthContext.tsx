import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import apiClient from '../api/client';

// Discord user info returned after authentication
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  globalName: string | null;
}

interface CurrentUserResponse {
  user: DiscordUser;
  isAdmin: boolean;
}

interface AuthState {
  user: DiscordUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_TOKEN_KEY = 'mogtome_auth_token';

// Helper to get/set the auth token in localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    isLoading: true,
    isAuthenticated: false,
  });

  // Refresh user data from the API
  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setState({
        user: null,
        isAdmin: false,
        isLoading: false,
        isAuthenticated: false,
      });
      return;
    }

    try {
      const response = await apiClient.get<CurrentUserResponse>('/auth/me');
      if (response.data) {
        setState({
          user: response.data.user,
          isAdmin: response.data.isAdmin,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        clearAuthToken();
        setState({
          user: null,
          isAdmin: false,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch {
      // Failed to get user, clear token
      clearAuthToken();
      setState({
        user: null,
        isAdmin: false,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  // Initial load - check if user is authenticated
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Redirect to Discord OAuth login
  const login = useCallback(() => {
    // Use the API base URL for the login redirect
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const loginUrl = apiBaseUrl ? `${apiBaseUrl}/auth/discord/login` : '/api/auth/discord/login';
    window.location.href = loginUrl;
  }, []);

  // Logout the user
  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Logout might fail if already logged out
    }
    clearAuthToken();
    setState({
      user: null,
      isAdmin: false,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

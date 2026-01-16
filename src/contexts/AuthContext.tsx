import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

// User info extracted from JWT token
export interface User {
  memberName: string;
  memberRank: string;
  memberPortraitUrl: string;
}

// JWT payload structure from our API
interface JwtPayload {
  aud: string;
  iss: string;
  exp: number;
  nbf: number;
  memberName: string;
  memberRank: string;
  memberPortraitUrl: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: () => void;
  logout: () => void;
  refreshUser: () => void;
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

// Decode JWT payload (without verification - server already verified it)
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    // Base64url decode
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Check if token is expired
function isTokenExpired(payload: JwtPayload): boolean {
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Load user from stored JWT token
  const refreshUser = useCallback(() => {
    const token = getAuthToken();
    if (!token) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return;
    }

    const payload = decodeJwtPayload(token);
    
    if (!payload || isTokenExpired(payload)) {
      // Token invalid or expired
      clearAuthToken();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return;
    }

    // Extract user info from JWT payload
    setState({
      user: {
        memberName: payload.memberName,
        memberRank: payload.memberRank,
        memberPortraitUrl: payload.memberPortraitUrl,
      },
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  // Initial load - check if user is authenticated
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Redirect to Discord OAuth login
  const login = useCallback(() => {
    // Redirect back to the auth callback on the current origin (localhost, mogtome.com, etc.)
    const redirectUrl = `${window.location.origin}/auth/callback`;
    
    const loginUrl = new URL('https://api.mogtome.com/auth/discord/login');
    loginUrl.searchParams.set('redirect', redirectUrl);
    
    window.location.href = loginUrl.toString();
  }, []);

  // Logout the user
  const logout = useCallback(() => {
    clearAuthToken();
    setState({
      user: null,
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

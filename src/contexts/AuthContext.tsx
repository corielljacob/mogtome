import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { refreshAuthToken } from '../api/client';

// User info extracted from JWT token
export interface User {
  memberName: string;
  memberRank: string;
  memberPortraitUrl: string;
  hasKnighthood: boolean;
  hasTemporaryKnighthood: boolean;
  /** Date of user's first MogTome login (ISO string), set by backend on first-ever login */
  firstLoginDate?: string;
}

// JWT payload structure from our API
interface JwtPayload {
  aud: string;
  iss: string;
  exp: number;
  nbf: number;
  discordId: string;
  memberName: string;
  memberRank: string;
  memberPortraitUrl: string;
  hasKnighthood: boolean;
  hasTemporaryKnighthood: boolean;
  /** Date of user's first MogTome login (ISO string) - set by backend on first-ever login */
  firstMogTomeLoginDate?: string;
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
const RETURN_URL_KEY = 'mogtome_return_url';

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

// Helper to get/set the return URL for post-login redirect
// Uses localStorage instead of sessionStorage because the OAuth redirect
// to Discord and back can cause sessionStorage to be lost in some browsers
export const getReturnUrl = (): string | null => {
  return localStorage.getItem(RETURN_URL_KEY);
};

export const setReturnUrl = (url: string): void => {
  localStorage.setItem(RETURN_URL_KEY, url);
};

export const clearReturnUrl = (): void => {
  localStorage.removeItem(RETURN_URL_KEY);
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

// Check if token will expire within the given threshold (in seconds)
// Default threshold: 5 minutes before expiration
function isTokenExpiringSoon(payload: JwtPayload, thresholdSeconds: number = 300): boolean {
  const now = Math.floor(Date.now() / 1000);
  return payload.exp - now < thresholdSeconds;
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
  
  // Track the refresh timer so we can clean it up
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track if a refresh is in progress to prevent duplicate calls
  const isRefreshingRef = useRef(false);

  // Clear any existing refresh timer
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // Schedule a proactive token refresh before it expires
  const scheduleTokenRefresh = useCallback((payload: JwtPayload) => {
    clearRefreshTimer();
    
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = payload.exp - now;
    
    // Schedule refresh 5 minutes before expiration, or immediately if less than 5 min left
    // Minimum delay of 10 seconds to prevent tight loops
    const refreshIn = Math.max(10, (expiresIn - 300)) * 1000;
    
    refreshTimerRef.current = setTimeout(async () => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;
      
      try {
        const newToken = await refreshAuthToken();
        if (newToken) {
          // Token refreshed successfully - refreshUser will be called by the event listener
          window.dispatchEvent(new CustomEvent('auth-token-refreshed'));
        }
      } catch {
        // Refresh failed silently - the user will be logged out when the token expires
      } finally {
        isRefreshingRef.current = false;
      }
    }, refreshIn);
  }, [clearRefreshTimer]);

  // Load user from stored JWT token
  const refreshUser = useCallback(() => {
    const token = getAuthToken();
    if (!token) {
      clearRefreshTimer();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return;
    }

    const payload = decodeJwtPayload(token);
    
    if (!payload || isTokenExpired(payload)) {
      // Token invalid or expired - try to refresh it
      clearAuthToken();
      clearRefreshTimer();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return;
    }

    // If token is expiring soon, trigger a refresh in the background
    if (isTokenExpiringSoon(payload)) {
      // Don't block - refresh in background
      if (!isRefreshingRef.current) {
        isRefreshingRef.current = true;
        refreshAuthToken()
          .then((newToken) => {
            if (newToken) {
              window.dispatchEvent(new CustomEvent('auth-token-refreshed'));
            }
          })
          .finally(() => {
            isRefreshingRef.current = false;
          });
      }
    } else {
      // Schedule proactive refresh before token expires
      scheduleTokenRefresh(payload);
    }

    // Extract user info from JWT payload
    setState({
      user: {
        memberName: payload.memberName,
        memberRank: payload.memberRank,
        memberPortraitUrl: payload.memberPortraitUrl,
        hasKnighthood: payload.hasKnighthood,
        hasTemporaryKnighthood: payload.hasTemporaryKnighthood,
        firstLoginDate: payload.firstMogTomeLoginDate,
      },
      isLoading: false,
      isAuthenticated: true,
    });
  }, [clearRefreshTimer, scheduleTokenRefresh]);

  // Initial load - check if user is authenticated
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Listen for token refresh/expiry events from the API client
  useEffect(() => {
    const handleTokenRefreshed = () => {
      refreshUser();
    };

    const handleTokenExpired = () => {
      clearRefreshTimer();
      clearAuthToken();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    };

    window.addEventListener('auth-token-refreshed', handleTokenRefreshed);
    window.addEventListener('auth-token-expired', handleTokenExpired);

    return () => {
      window.removeEventListener('auth-token-refreshed', handleTokenRefreshed);
      window.removeEventListener('auth-token-expired', handleTokenExpired);
      clearRefreshTimer();
    };
  }, [refreshUser, clearRefreshTimer]);

  // Redirect to Discord OAuth login
  const login = useCallback(() => {
    // Save the current URL so we can redirect back after login
    // Only save if we're not already on the auth callback page
    const currentPath = window.location.pathname + window.location.search + window.location.hash;
    if (!currentPath.startsWith('/auth/')) {
      setReturnUrl(currentPath);
    }
    
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

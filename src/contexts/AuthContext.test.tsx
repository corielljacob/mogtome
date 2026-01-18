import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { render, screen } from '../test/test-utils';
import { 
  AuthProvider, 
  useAuth, 
  getAuthToken, 
  setAuthToken, 
  clearAuthToken,
  getReturnUrl,
  setReturnUrl,
  clearReturnUrl,
} from './AuthContext';
import type { ReactNode } from 'react';

// Helper to create a valid JWT token for testing
function createMockJwt(payload: Record<string, unknown>, expiresIn = 3600): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + expiresIn;
  const payloadWithExp = { ...payload, exp };
  const payloadEncoded = btoa(JSON.stringify(payloadWithExp));
  const signature = 'mock-signature';
  return `${header}.${payloadEncoded}.${signature}`;
}

// Create an expired token
function createExpiredJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) - 3600; // Expired 1 hour ago
  const payloadWithExp = { ...payload, exp };
  const payloadEncoded = btoa(JSON.stringify(payloadWithExp));
  const signature = 'mock-signature';
  return `${header}.${payloadEncoded}.${signature}`;
}

const mockUserPayload = {
  memberName: 'Test User',
  memberRank: 'Moogle Guardian',
  memberPortraitUrl: 'https://example.com/portrait.jpg',
  hasKnighthood: true,
  hasTemporaryKnighthood: false,
  // JWT uses firstMogTomeLoginDate, which maps to firstLoginDate in User
  firstMogTomeLoginDate: '2024-01-01T00:00:00Z',
};

describe('Auth Token Helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getAuthToken', () => {
    it('returns null when no token is stored', () => {
      expect(getAuthToken()).toBeNull();
    });

    it('returns stored token', () => {
      localStorage.setItem('mogtome_auth_token', 'test-token');
      expect(getAuthToken()).toBe('test-token');
    });
  });

  describe('setAuthToken', () => {
    it('stores the token in localStorage', () => {
      setAuthToken('my-token');
      expect(localStorage.getItem('mogtome_auth_token')).toBe('my-token');
    });
  });

  describe('clearAuthToken', () => {
    it('removes the token from localStorage', () => {
      localStorage.setItem('mogtome_auth_token', 'test-token');
      clearAuthToken();
      expect(localStorage.getItem('mogtome_auth_token')).toBeNull();
    });
  });
});

describe('Return URL Helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getReturnUrl', () => {
    it('returns null when no URL is stored', () => {
      expect(getReturnUrl()).toBeNull();
    });

    it('returns stored URL', () => {
      localStorage.setItem('mogtome_return_url', '/dashboard');
      expect(getReturnUrl()).toBe('/dashboard');
    });
  });

  describe('setReturnUrl', () => {
    it('stores the URL in localStorage', () => {
      setReturnUrl('/members?page=2');
      expect(localStorage.getItem('mogtome_return_url')).toBe('/members?page=2');
    });
  });

  describe('clearReturnUrl', () => {
    it('removes the URL from localStorage', () => {
      localStorage.setItem('mogtome_return_url', '/test');
      clearReturnUrl();
      expect(localStorage.getItem('mogtome_return_url')).toBeNull();
    });
  });
});

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('starts with loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // After initial render, loading should complete
    expect(result.current.isLoading).toBe(false);
  });

  it('returns unauthenticated state when no token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('returns authenticated state with valid token', async () => {
    const token = createMockJwt(mockUserPayload);
    localStorage.setItem('mogtome_auth_token', token);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
    
    expect(result.current.user).toEqual({
      memberName: 'Test User',
      memberRank: 'Moogle Guardian',
      memberPortraitUrl: 'https://example.com/portrait.jpg',
      hasKnighthood: true,
      hasTemporaryKnighthood: false,
      firstLoginDate: '2024-01-01T00:00:00Z',
    });
  });

  it('clears expired token and returns unauthenticated', async () => {
    const token = createExpiredJwt(mockUserPayload);
    localStorage.setItem('mogtome_auth_token', token);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('mogtome_auth_token')).toBeNull();
  });

  it('clears invalid token format', async () => {
    localStorage.setItem('mogtome_auth_token', 'invalid-not-a-jwt');
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('mogtome_auth_token')).toBeNull();
  });

  it('logout clears auth state', async () => {
    const token = createMockJwt(mockUserPayload);
    localStorage.setItem('mogtome_auth_token', token);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('mogtome_auth_token')).toBeNull();
  });

  it('refreshUser reloads user from token', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Initially not authenticated
    expect(result.current.isAuthenticated).toBe(false);
    
    // Set a token externally
    const token = createMockJwt(mockUserPayload);
    localStorage.setItem('mogtome_auth_token', token);
    
    // Call refreshUser
    act(() => {
      result.current.refreshUser();
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.memberName).toBe('Test User');
  });
});

describe('useAuth hook', () => {
  it('throws error when used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });
});

// Test component that uses auth
function TestAuthComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.memberName}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}

describe('Auth Component Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders login button when not authenticated', async () => {
    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});

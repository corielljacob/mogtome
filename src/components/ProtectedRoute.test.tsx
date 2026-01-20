import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';

// Mock the refreshAuthToken function from api/client to prevent network calls
vi.mock('../api/client', () => ({
  refreshAuthToken: vi.fn().mockResolvedValue(null),
}));

// Helper to create a valid JWT token
function createMockJwt(payload: Record<string, unknown>, expiresIn = 3600): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + expiresIn;
  const payloadWithExp = { ...payload, exp };
  const payloadEncoded = btoa(JSON.stringify(payloadWithExp));
  const signature = 'mock-signature';
  return `${header}.${payloadEncoded}.${signature}`;
}

const mockUserPayload = {
  memberName: 'Test User',
  memberRank: 'Moogle Guardian',
  memberPortraitUrl: 'https://example.com/portrait.jpg',
  hasKnighthood: false,
  hasTemporaryKnighthood: false,
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('shows login prompt when not authenticated', async () => {
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );
    
    // Wait for auth check to complete
    await waitFor(() => {
      expect(screen.getByText("Members Only, Kupo!")).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders protected content when authenticated', async () => {
    const token = createMockJwt(mockUserPayload);
    localStorage.setItem('mogtome_auth_token', token);
    
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
    
    expect(screen.queryByText("Members Only, Kupo!")).not.toBeInTheDocument();
  });

  it('shows Discord login button when not authenticated', async () => {
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /login with discord/i })).toBeInTheDocument();
    });
  });

  it('shows description about members only access', async () => {
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/reserved for Kupo Life! FC members/i)).toBeInTheDocument();
    });
  });

  it('shows feature hints when not authenticated', async () => {
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Live Chronicle')).toBeInTheDocument();
      expect(screen.getByText('Member Features')).toBeInTheDocument();
    });
  });

  it('shows moogle wizard image', async () => {
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByAltText('A moogle wizard guarding the page')).toBeInTheDocument();
    });
  });

  it('renders complex children when authenticated', async () => {
    const token = createMockJwt(mockUserPayload);
    localStorage.setItem('mogtome_auth_token', token);
    
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard</p>
            <button>Click me</button>
          </div>
        </ProtectedRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByText('Welcome to the dashboard')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });
  });
});

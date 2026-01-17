import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import { KnightRoute } from './KnightRoute';
import { AuthProvider } from '../contexts/AuthContext';

// Helper to create a valid JWT token
function createMockJwt(payload: Record<string, unknown>, expiresIn = 3600): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + expiresIn;
  const payloadWithExp = { ...payload, exp };
  const payloadEncoded = btoa(JSON.stringify(payloadWithExp));
  const signature = 'mock-signature';
  return `${header}.${payloadEncoded}.${signature}`;
}

const baseUserPayload = {
  memberName: 'Test User',
  memberRank: 'Mandragora',
  memberPortraitUrl: 'https://example.com/portrait.jpg',
};

describe('KnightRoute', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('shows login prompt when not authenticated', async () => {
    render(
      <AuthProvider>
        <KnightRoute>
          <div>Knight Content</div>
        </KnightRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText("Knights Only, Kupo!")).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Knight Content')).not.toBeInTheDocument();
  });

  it('shows access denied for authenticated non-knight', async () => {
    const token = createMockJwt({
      ...baseUserPayload,
      hasKnighthood: false,
      hasTemporaryKnighthood: false,
    });
    localStorage.setItem('mogtome_auth_token', token);
    
    render(
      <AuthProvider>
        <KnightRoute>
          <div>Knight Content</div>
        </KnightRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Knighthood Required')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Knight Content')).not.toBeInTheDocument();
  });

  it('shows user info when authenticated but not a knight', async () => {
    const token = createMockJwt({
      ...baseUserPayload,
      hasKnighthood: false,
      hasTemporaryKnighthood: false,
    });
    localStorage.setItem('mogtome_auth_token', token);
    
    render(
      <AuthProvider>
        <KnightRoute>
          <div>Knight Content</div>
        </KnightRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Mandragora')).toBeInTheDocument();
    });
  });

  it('renders content for user with permanent knighthood', async () => {
    const token = createMockJwt({
      ...baseUserPayload,
      memberRank: 'Moogle Knight',
      hasKnighthood: true,
      hasTemporaryKnighthood: false,
    });
    localStorage.setItem('mogtome_auth_token', token);
    
    render(
      <AuthProvider>
        <KnightRoute>
          <div>Knight Content</div>
        </KnightRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Knight Content')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Knighthood Required')).not.toBeInTheDocument();
    expect(screen.queryByText("Knights Only, Kupo!")).not.toBeInTheDocument();
  });

  it('renders content for user with temporary knighthood', async () => {
    const token = createMockJwt({
      ...baseUserPayload,
      hasKnighthood: false,
      hasTemporaryKnighthood: true,
    });
    localStorage.setItem('mogtome_auth_token', token);
    
    render(
      <AuthProvider>
        <KnightRoute>
          <div>Knight Content</div>
        </KnightRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Knight Content')).toBeInTheDocument();
    });
  });

  it('renders content for user with both permanent and temporary knighthood', async () => {
    const token = createMockJwt({
      ...baseUserPayload,
      memberRank: 'Moogle Knight',
      hasKnighthood: true,
      hasTemporaryKnighthood: true,
    });
    localStorage.setItem('mogtome_auth_token', token);
    
    render(
      <AuthProvider>
        <KnightRoute>
          <div>Knight Content</div>
        </KnightRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Knight Content')).toBeInTheDocument();
    });
  });

  it('shows Discord login button when not authenticated', async () => {
    render(
      <AuthProvider>
        <KnightRoute>
          <div>Knight Content</div>
        </KnightRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /login with discord/i })).toBeInTheDocument();
    });
  });

  it('shows error message when access denied', async () => {
    const token = createMockJwt({
      ...baseUserPayload,
      hasKnighthood: false,
      hasTemporaryKnighthood: false,
    });
    localStorage.setItem('mogtome_auth_token', token);
    
    render(
      <AuthProvider>
        <KnightRoute>
          <div>Knight Content</div>
        </KnightRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      // Should show the access denied message
      expect(screen.getByText('Knighthood Required')).toBeInTheDocument();
    });
  });

  it('shows moogle wizard image on login prompt', async () => {
    render(
      <AuthProvider>
        <KnightRoute>
          <div>Knight Content</div>
        </KnightRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByAltText('A moogle wizard guarding the page')).toBeInTheDocument();
    });
  });

  it('renders complex children when authorized', async () => {
    const token = createMockJwt({
      ...baseUserPayload,
      hasKnighthood: true,
      hasTemporaryKnighthood: false,
    });
    localStorage.setItem('mogtome_auth_token', token);
    
    render(
      <AuthProvider>
        <KnightRoute>
          <div>
            <h1>Knight Dashboard</h1>
            <p>Welcome, brave knight!</p>
            <button>Manage FC</button>
          </div>
        </KnightRoute>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Knight Dashboard' })).toBeInTheDocument();
      expect(screen.getByText('Welcome, brave knight!')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Manage FC' })).toBeInTheDocument();
    });
  });
});

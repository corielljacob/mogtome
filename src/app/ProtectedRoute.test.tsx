import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/shared/test/test-utils";
import { ProtectedRoute } from "@/app/ProtectedRoute";
import { AuthProvider } from "@/shared/contexts/AuthContext";

// mock refreshAuthToken to keep the auth check off the network
vi.mock("@/shared/api/client", () => ({
  refreshAuthToken: vi.fn().mockResolvedValue(null),
}));

function createMockJwt(
  payload: Record<string, unknown>,
  expiresIn = 3600,
): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + expiresIn;
  const payloadWithExp = { ...payload, exp };
  const payloadEncoded = btoa(JSON.stringify(payloadWithExp));
  const signature = "mock-signature";
  return `${header}.${payloadEncoded}.${signature}`;
}

const mockUserPayload = {
  memberName: "Test User",
  memberRank: "Moogle Guardian",
  memberPortraitUrl: "https://example.com/portrait.jpg",
  hasKnighthood: false,
  hasTemporaryKnighthood: false,
};

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("shows login prompt when not authenticated", async () => {
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Members only")).toBeInTheDocument();
    });

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders protected content when authenticated", async () => {
    const token = createMockJwt(mockUserPayload);
    localStorage.setItem("mogtome_auth_token", token);

    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    expect(screen.queryByText("Members only")).not.toBeInTheDocument();
  });

  it("shows Discord login button when not authenticated", async () => {
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /login with discord/i }),
      ).toBeInTheDocument();
    });
  });

  it("shows description about members only access", async () => {
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Kupo Life FC members/i)).toBeInTheDocument();
    });
  });

  it("shows moogle wizard image", async () => {
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByAltText("A moogle wizard guarding the page"),
      ).toBeInTheDocument();
    });
  });

  it("renders complex children when authenticated", async () => {
    const token = createMockJwt(mockUserPayload);
    localStorage.setItem("mogtome_auth_token", token);

    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard</p>
            <button>Click me</button>
          </div>
        </ProtectedRoute>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Dashboard" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Welcome to the dashboard")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Click me" }),
      ).toBeInTheDocument();
    });
  });

  it("renders a custom signed-out fallback without mounting protected children", async () => {
    const PrivateContent = vi.fn(() => <div>Private content mounted</div>);
    render(
      <AuthProvider>
        <ProtectedRoute signedOut={<p>Sign in to read this Chronicle</p>}>
          <PrivateContent />
        </ProtectedRoute>
      </AuthProvider>,
    );

    expect(
      await screen.findByText("Sign in to read this Chronicle"),
    ).toBeInTheDocument();
    expect(PrivateContent).not.toHaveBeenCalled();
    expect(
      screen.queryByText("Private content mounted"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Members only")).not.toBeInTheDocument();
  });

  it("renders authenticated children instead of a supplied signed-out fallback", async () => {
    localStorage.setItem("mogtome_auth_token", createMockJwt(mockUserPayload));
    render(
      <AuthProvider>
        <ProtectedRoute signedOut={<p>Sign in to read this Chronicle</p>}>
          <div>Private Chronicle content</div>
        </ProtectedRoute>
      </AuthProvider>,
    );

    expect(
      await screen.findByText("Private Chronicle content"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Sign in to read this Chronicle"),
    ).not.toBeInTheDocument();
  });
});

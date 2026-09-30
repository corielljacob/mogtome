import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@/shared/test/test-utils";
import userEvent from "@testing-library/user-event";
import { KnightRoute } from "@/app/KnightRoute";
import * as authContext from "@/shared/contexts/AuthContext";
import { refreshAuthToken } from "@/shared/api/client";

// Auth bootstrap and all sign-in actions stay inside the test environment.
vi.mock("@/shared/api/client", () => ({
  refreshAuthToken: vi.fn().mockResolvedValue(null),
}));

function createMockJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const body = btoa(JSON.stringify({ ...payload, exp }));
  return `${header}.${body}.mock-signature`;
}

const baseUserPayload = {
  memberName: "Test User",
  memberRank: "Mandragora",
  memberPortraitUrl: "https://example.com/portrait.jpg",
  discordId: "123",
};

function renderGate(children: ReactNode = <div>Knight Content</div>) {
  return render(
    <authContext.AuthProvider>
      <KnightRoute>{children}</KnightRoute>
    </authContext.AuthProvider>,
  );
}

function mockAuth(
  overrides: Partial<ReturnType<typeof authContext.useAuth>> = {},
) {
  const value = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
  vi.spyOn(authContext, "useAuth").mockReturnValue(value);
  return value;
}

describe("KnightRoute", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.mocked(refreshAuthToken).mockReset().mockResolvedValue(null);
  });

  it("offers sign-in and a route home without mounting protected content", async () => {
    const content = vi.fn(() => <div>Knight Content</div>);
    const ProtectedContent = content;
    renderGate(<ProtectedContent />);
    expect(
      await screen.findByRole("heading", { level: 1, name: "Knights only" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign in with Discord" }),
    ).toBeEnabled();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("img", { name: "A moogle wizard guarding the page" }),
    ).toBeInTheDocument();
    expect(content).not.toHaveBeenCalled();
  });

  it("explains denied access and gives the signed-in member useful destinations", async () => {
    localStorage.setItem(
      "mogtome_auth_token",
      createMockJwt({
        ...baseUserPayload,
        hasKnighthood: false,
        hasTemporaryKnighthood: false,
      }),
    );
    renderGate();
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Knighthood needed",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/temporary knighthood/i)).toBeInTheDocument();
    expect(screen.getByText(baseUserPayload.memberName)).toBeInTheDocument();
    expect(screen.getByText(baseUserPayload.memberRank)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View my profile" }),
    ).toHaveAttribute("href", "/profile");
    expect(screen.getByRole("link", { name: "Meet the crew" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("img", { name: "A moogle wizard guarding the page" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Sign in with Discord" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Knight Content")).not.toBeInTheDocument();
  });

  it.each(["Moogle Knight", "Moogle Guardian"])(
    "renders protected content for the %s rank through the real auth provider",
    async (memberRank) => {
      localStorage.setItem(
        "mogtome_auth_token",
        createMockJwt({
          ...baseUserPayload,
          memberRank,
          hasKnighthood: false,
          hasTemporaryKnighthood: false,
        }),
      );
      renderGate();
      expect(await screen.findByText("Knight Content")).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: "Knighthood needed" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: "Knights only" }),
      ).not.toBeInTheDocument();
    },
  );

  it.each([
    {
      label: "permanent knighthood",
      hasKnighthood: true,
      hasTemporaryKnighthood: false,
    },
    {
      label: "temporary knighthood only",
      hasKnighthood: false,
      hasTemporaryKnighthood: true,
    },
    {
      label: "both kinds of knighthood",
      hasKnighthood: true,
      hasTemporaryKnighthood: true,
    },
  ])(
    "honors the context permission flags for $label",
    ({ hasKnighthood, hasTemporaryKnighthood }) => {
      mockAuth({
        isAuthenticated: true,
        user: { ...baseUserPayload, hasKnighthood, hasTemporaryKnighthood },
      });
      render(
        <KnightRoute>
          <div>Knight Content</div>
        </KnightRoute>,
      );
      expect(screen.getByText("Knight Content")).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: "Knighthood needed" }),
      ).not.toBeInTheDocument();
    },
  );

  it("passes the existing exact-name permission through to the dashboard", async () => {
    localStorage.setItem(
      "mogtome_auth_token",
      createMockJwt({
        ...baseUserPayload,
        memberName: "W'ren Solei",
        memberRank: "Paissa Trainer",
        hasKnighthood: false,
        hasTemporaryKnighthood: false,
      }),
    );
    renderGate();
    expect(await screen.findByText("Knight Content")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Knighthood needed" }),
    ).not.toBeInTheDocument();
  });

  it("invokes the existing login action from the Discord sign-in button", async () => {
    const auth = mockAuth();
    const user = userEvent.setup();
    render(
      <KnightRoute>
        <div>Knight Content</div>
      </KnightRoute>,
    );
    await user.click(
      screen.getByRole("button", { name: "Sign in with Discord" }),
    );
    expect(auth.login).toHaveBeenCalledOnce();
    expect(screen.queryByText("Knight Content")).not.toBeInTheDocument();
  });

  it("keeps content hidden while auth is checking, then shows the signed-out notice", async () => {
    let finish!: (value: null) => void;
    vi.mocked(refreshAuthToken).mockImplementationOnce(
      () =>
        new Promise<null>((resolve) => {
          finish = resolve;
        }),
    );
    const content = vi.fn(() => <div>Knight Content</div>);
    const ProtectedContent = content;
    renderGate(<ProtectedContent />);
    expect(screen.getByRole("status")).toHaveTextContent(/checking/i);
    expect(
      screen.queryByRole("button", { name: "Sign in with Discord" }),
    ).not.toBeInTheDocument();
    expect(content).not.toHaveBeenCalled();
    await act(async () => finish(null));
    expect(
      await screen.findByRole("heading", { name: "Knights only" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(content).not.toHaveBeenCalled();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  AuthProvider,
  setAuthToken,
  useAuth,
} from "@/shared/contexts/AuthContext";
import { Navbar } from "./Navbar";
import { KnightRoute } from "./KnightRoute";

vi.mock("@/shared/api/client", () => ({
  refreshAuthToken: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/shared/contexts/ThemeContext", () => ({
  useTheme: () => ({
    isDarkMode: false,
    setColorMode: vi.fn(),
    activeEvent: null,
    isEventThemeActive: false,
  }),
}));

// Synthetic, local test data: exercise the real auth mapper without any service.
function lowerRankToken(memberName: string) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      memberName,
      memberRank: "Paissa Trainer",
      memberPortraitUrl: "/test-portrait.png",
      discordId: "test-discord-id",
      hasKnighthood: false,
      hasTemporaryKnighthood: false,
      exp: Math.floor(Date.now() / 1000) + 3600,
    }),
  );
  return `${header}.${payload}.test-signature`;
}

const DashboardContent = vi.fn(() => <h1>Protected dashboard content</h1>);

function SessionControl() {
  const { logout } = useAuth();
  return <button onClick={logout}>End test session</button>;
}

function renderNavigation(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Navbar />
        <SessionControl />
        <Routes>
          <Route path="/" element={<h1>Home content</h1>} />
          <Route
            path="/dashboard"
            element={
              <KnightRoute>
                <DashboardContent />
              </KnightRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

function mainNavigation() {
  return screen.getByRole("navigation", { name: "Main navigation" });
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
});

describe("Knight dashboard navigation with real authentication state", () => {
  it("offers the lower-rank named member a main Dashboard link that opens protected content", async () => {
    const user = userEvent.setup();
    setAuthToken(lowerRankToken("W'ren Solei"));
    renderNavigation();

    const dashboard = await within(mainNavigation()).findByRole("link", {
      name: "Dashboard",
    });
    expect(dashboard).toHaveAttribute("href", "/dashboard");
    expect(
      screen.getByRole("button", { name: "User menu for W'ren Solei" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(dashboard);

    expect(
      await screen.findByRole("heading", {
        name: "Protected dashboard content",
      }),
    ).toBeInTheDocument();
    expect(dashboard).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it.each([
    { memberName: "Another Member", deniedHeading: "Knighthood needed" },
    { memberName: null, deniedHeading: "Knights only" },
  ])(
    "hides Dashboard and denies its direct route for $memberName",
    async ({ memberName, deniedHeading }) => {
      if (memberName) setAuthToken(lowerRankToken(memberName));
      renderNavigation("/dashboard");

      expect(
        await screen.findByRole("heading", { name: deniedHeading }),
      ).toBeInTheDocument();
      expect(
        within(mainNavigation()).queryByRole("link", { name: "Dashboard" }),
      ).not.toBeInTheDocument();
      expect(DashboardContent).not.toHaveBeenCalled();
    },
  );

  it("removes the main Dashboard link and protected content immediately after logout", async () => {
    const user = userEvent.setup();
    setAuthToken(lowerRankToken("W'ren Solei"));
    renderNavigation("/dashboard");
    await screen.findByRole("heading", { name: "Protected dashboard content" });
    expect(
      within(mainNavigation()).getByRole("link", { name: "Dashboard" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "End test session" }));

    expect(
      screen.getByRole("heading", { name: "Knights only" }),
    ).toBeInTheDocument();
    expect(
      within(mainNavigation()).queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Protected dashboard content" }),
    ).not.toBeInTheDocument();
  });

  it("adds and removes Dashboard when a refreshed token changes the named permission", async () => {
    const user = userEvent.setup();
    setAuthToken(lowerRankToken("Another Member"));
    renderNavigation();
    await screen.findByRole("button", { name: "User menu for Another Member" });
    expect(
      within(mainNavigation()).queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();

    act(() => {
      setAuthToken(lowerRankToken("W'ren Solei"));
      window.dispatchEvent(new CustomEvent("auth-token-refreshed"));
    });
    const dashboard = await within(mainNavigation()).findByRole("link", {
      name: "Dashboard",
    });
    await user.click(dashboard);
    await screen.findByRole("heading", { name: "Protected dashboard content" });

    act(() => {
      setAuthToken(lowerRankToken("Another Member"));
      window.dispatchEvent(new CustomEvent("auth-token-refreshed"));
    });

    expect(
      await screen.findByRole("heading", { name: "Knighthood needed" }),
    ).toBeInTheDocument();
    expect(
      within(mainNavigation()).queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Protected dashboard content" }),
    ).not.toBeInTheDocument();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { useAuth, type User } from "@/shared/contexts/AuthContext";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { Navbar } from "./Navbar";

vi.mock("@/shared/contexts/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("@/shared/contexts/ThemeContext", () => ({ useTheme: vi.fn() }));

const login = vi.fn();
const setColorMode = vi.fn();
let auth: ReturnType<typeof useAuth>;
let theme: ReturnType<typeof useTheme>;

function LocationProbe() {
  return <output aria-label="Current route">{useLocation().pathname}</output>;
}

function renderNavbar(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
      <LocationProbe />
    </MemoryRouter>,
  );
}

function signIn(overrides: Partial<User> = {}) {
  vi.mocked(useAuth).mockReturnValue({
    ...auth,
    isAuthenticated: true,
    user: {
      memberName: "Mog Reader",
      memberRank: "Moogle",
      memberPortraitUrl: "/portrait.png",
      discordId: "test-member",
      hasKnighthood: false,
      hasTemporaryKnighthood: false,
      ...overrides,
    },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  auth = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login,
    logout: vi.fn(),
    refreshUser: vi.fn().mockResolvedValue(undefined),
  };
  vi.mocked(useAuth).mockReturnValue(auth);
  theme = {
    settings: {
      colorTheme: "pom-pom",
      colorMode: "light",
      eventThemingDisabled: false,
    },
    isDarkMode: false,
    setColorTheme: vi.fn(),
    setColorMode,
    activeEvent: null,
    nextEvent: null,
    isEventThemeActive: false,
    setEventThemingDisabled: vi.fn(),
    eventOverride: "auto",
    setEventOverride: vi.fn(),
  };
  vi.mocked(useTheme).mockReturnValue(theme);
});

describe("Navbar navigation", () => {
  it.each([
    ["Home", "/"],
    ["Members", "/members"],
    ["Chronicle", "/chronicle"],
    ["About", "/about"],
  ])("opens %s and identifies the current page", async (label, path) => {
    const user = userEvent.setup();
    renderNavbar("/settings");
    const navigation = screen.getByRole("navigation", {
      name: "Main navigation",
    });
    expect(within(navigation).getAllByRole("link")).toHaveLength(4);
    const link = within(navigation).getByRole("link", { name: label });
    expect(link).toHaveAttribute("href", path);
    expect(link).not.toHaveAttribute("aria-current");

    await user.click(link);

    expect(
      screen.getByRole("status", { name: "Current route" }).textContent,
    ).toBe(path);
    expect(link).toHaveAttribute("aria-current", "page");
    expect(
      within(navigation).getAllByRole("link", { current: "page" }),
    ).toEqual([link]);
    expect(screen.getByRole("link", { name: "Settings" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("keeps Members current on a nested member page without marking Home current", () => {
    renderNavbar("/members/123");
    expect(screen.getByRole("link", { name: "Members" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByRole("link", { name: "MogTome home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("opens Settings from the utility link and marks it as current", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(screen.getByRole("link", { name: "Settings" }));

    expect(
      screen.getByRole("status", { name: "Current route" }),
    ).toHaveTextContent("/settings");
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      within(screen.getByRole("navigation")).queryByRole("link", {
        current: "page",
      }),
    ).not.toBeInTheDocument();
  });
});

describe("Navbar account and appearance controls", () => {
  it("starts Discord login from the sign-in button", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(
      screen.getByRole("button", { name: "Sign in with Discord" }),
    );

    expect(login).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("button", { name: /User menu for/ }),
    ).not.toBeInTheDocument();
  });

  it("prevents another login while the account is loading", async () => {
    vi.mocked(useAuth).mockReturnValue({ ...auth, isLoading: true });
    const user = userEvent.setup();
    renderNavbar();
    const loading = screen.getByRole("button", { name: "Loading account" });

    expect(loading).toBeDisabled();
    await user.click(loading);
    expect(login).not.toHaveBeenCalled();
  });

  it.each([
    [false, "dark"],
    [true, "light"],
  ] as const)(
    "switches from dark=%s to %s using the resolved system appearance",
    async (isDarkMode, targetMode) => {
      vi.mocked(useTheme).mockReturnValue({
        ...theme,
        settings: { ...theme.settings, colorMode: "system" },
        isDarkMode,
      });
      const user = userEvent.setup();
      renderNavbar();

      await user.click(
        screen.getByRole("button", { name: `Switch to ${targetMode} mode` }),
      );

      expect(setColorMode).toHaveBeenCalledExactlyOnceWith(targetMode);
    },
  );

  it("lets a member open their profile without exposing knight actions", async () => {
    signIn();
    const user = userEvent.setup();
    renderNavbar();
    expect(
      screen.queryByRole("button", { name: "Sign in with Discord" }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "User menu for Mog Reader" }),
    );

    const menu = screen.getByRole("menu", { name: "User menu" });
    expect(
      within(menu).getByRole("menuitem", { name: "My Profile" }),
    ).toHaveFocus();
    expect(
      within(menu).getByRole("menuitem", { name: "Sign Out" }),
    ).toBeInTheDocument();
    expect(
      within(menu).queryByRole("menuitem", { name: "Knight Dashboard" }),
    ).not.toBeInTheDocument();

    await user.click(
      within(menu).getByRole("menuitem", { name: "My Profile" }),
    );

    expect(
      screen.getByRole("status", { name: "Current route" }),
    ).toHaveTextContent("/profile");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it.each(["hasKnighthood", "hasTemporaryKnighthood"] as const)(
    "opens the knight dashboard for %s",
    async (privilege) => {
      signIn({ [privilege]: true });
      const user = userEvent.setup();
      renderNavbar();

      await user.click(
        screen.getByRole("button", { name: "User menu for Mog Reader" }),
      );
      await user.click(
        screen.getByRole("menuitem", { name: "Knight Dashboard" }),
      );

      expect(
        screen.getByRole("status", { name: "Current route" }),
      ).toHaveTextContent("/dashboard");
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    },
  );

  it("opens the logout route from the account menu", async () => {
    signIn();
    const user = userEvent.setup();
    renderNavbar();

    await user.click(
      screen.getByRole("button", { name: "User menu for Mog Reader" }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Sign Out" }));

    expect(
      screen.getByRole("status", { name: "Current route" }),
    ).toHaveTextContent("/auth/logout");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("supports keyboard menu navigation and returns focus to the trigger on Escape", async () => {
    signIn({ hasKnighthood: true });
    const user = userEvent.setup();
    renderNavbar();
    const trigger = screen.getByRole("button", {
      name: "User menu for Mog Reader",
    });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    trigger.focus();
    await user.keyboard("{Enter}");

    const dashboard = screen.getByRole("menuitem", {
      name: "Knight Dashboard",
    });
    const profile = screen.getByRole("menuitem", { name: "My Profile" });
    const logout = screen.getByRole("menuitem", { name: "Sign Out" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(dashboard).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(profile).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(logout).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(dashboard).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(logout).toHaveFocus();
    await user.keyboard("{Home}");
    expect(dashboard).toHaveFocus();
    await user.keyboard("{End}");
    expect(logout).toHaveFocus();
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
});

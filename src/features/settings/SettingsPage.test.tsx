import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/shared/contexts/ThemeContext";
import { AccessibilityProvider } from "@/shared/contexts/AccessibilityContext";
import { Settings } from "./SettingsPage";

vi.mock("@/shared/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));
vi.mock("@/features/home/components/NookRoomDecor", () => ({
  NookRoomDecor: () => null,
}));
vi.mock("@/features/home/components/NookFairyLights", () => ({
  NookFairyLights: () => null,
}));

function renderSettings() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <AccessibilityProvider>
          <Settings />
        </AccessibilityProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
  document.body.className = "";
});

describe("Settings navigation", () => {
  it("supports arrow, Home, and End keys with only the active tab in the tab order", async () => {
    const user = userEvent.setup();
    renderSettings();
    const appearance = screen.getByRole("tab", { name: /^Appearance/ });
    const accessibility = screen.getByRole("tab", { name: /^Accessibility/ });
    const account = screen.getByRole("tab", { name: /^Account/ });
    appearance.focus();
    await user.keyboard("{ArrowDown}");
    expect(accessibility).toHaveFocus();
    expect(accessibility).toHaveAttribute("aria-selected", "true");
    expect(appearance).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName(/^Accessibility/);
    await user.keyboard("{End}");
    expect(account).toHaveFocus();
    expect(
      screen.getByRole("button", { name: "Sign in with Discord" }),
    ).toBeVisible();
    await user.keyboard("{ArrowDown}");
    expect(appearance).toHaveFocus();
    await user.keyboard("{End}{Home}");
    expect(appearance).toHaveFocus();
  });

  it("preserves immediate preference updates and disclosure state when switching panels", async () => {
    const user = userEvent.setup();
    renderSettings();
    await user.click(screen.getByRole("radio", { name: "Dark" }));
    await user.click(
      screen.getByRole("button", { name: /Seasonal theme calendar/ }),
    );
    await user.click(screen.getByRole("tab", { name: /^Accessibility/ }));
    await user.click(screen.getByRole("switch", { name: "Larger text" }));
    expect(document.documentElement).toHaveClass("large-text");
    expect(screen.getByRole("switch", { name: "Extra dark" })).toBeEnabled();
    await user.click(screen.getByRole("tab", { name: /^Account/ }));
    expect(
      screen.getByRole("heading", { name: "You're signed out." }),
    ).toBeVisible();
    await user.click(screen.getByRole("tab", { name: /^Appearance/ }));
    expect(
      screen.getByRole("radio", { name: "Dark" }),
    ).toBeChecked();
    expect(
      screen.getByRole("button", { name: /Seasonal theme calendar/ }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(JSON.parse(localStorage.getItem("mogtome-theme")!)).toMatchObject({
      colorMode: "dark",
    });
    expect(
      JSON.parse(localStorage.getItem("mogtome-accessibility")!),
    ).toMatchObject({ largeText: true });
    expect(
      within(screen.getByRole("tabpanel")).queryByRole("switch", {
        name: "Larger text",
      }),
    ).not.toBeInTheDocument();
  });
});

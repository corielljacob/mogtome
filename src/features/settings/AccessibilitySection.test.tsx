import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@/shared/test/test-utils";
import userEvent from "@testing-library/user-event";
import { AccessibilitySection } from "./AccessibilitySection";

const theme = vi.hoisted(() => ({ isDarkMode: false }));
vi.mock("@/shared/contexts/ThemeContext", () => ({ useTheme: () => theme }));

const storageKey = "mogtome-accessibility";

describe("Accessibility settings", () => {
  beforeEach(() => {
    theme.isDarkMode = false;
    localStorage.removeItem(storageKey);
    document.documentElement.className = "";
    document.body.className = "";
  });

  afterEach(() => {
    cleanup();
    localStorage.removeItem(storageKey);
    document.documentElement.className = "";
    document.body.className = "";
  });

  it("organizes every toggle into reading, display, and navigation groups", () => {
    render(<AccessibilitySection />);
    const reading = within(screen.getByRole("group", { name: "Reading" }));
    expect(
      reading.getByRole("switch", { name: "Larger text" }),
    ).toBeInTheDocument();
    expect(
      reading.getByRole("switch", { name: "Dyslexia-friendly font" }),
    ).toBeInTheDocument();
    const display = within(screen.getByRole("group", { name: "Display" }));
    expect(
      display.getByRole("switch", { name: "High contrast" }),
    ).toBeInTheDocument();
    expect(
      display.getByRole("switch", { name: "Extra dark" }),
    ).toBeInTheDocument();
    const navigation = within(
      screen.getByRole("group", { name: "Motion & navigation" }),
    );
    expect(
      navigation.getByRole("switch", { name: "Reduce motion" }),
    ).toBeInTheDocument();
    expect(
      navigation.getByRole("switch", { name: "Stronger focus outlines" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("switch")).toHaveLength(6);
  });

  it("applies and persists each setting, with keyboard-operable toggles", async () => {
    theme.isDarkMode = true;
    const user = userEvent.setup();
    render(<AccessibilitySection />);
    const options = [
      { label: "Larger text", key: "largeText", className: "large-text" },
      {
        label: "Dyslexia-friendly font",
        key: "dyslexiaFont",
        className: "dyslexia-font",
        body: true,
      },
      {
        label: "High contrast",
        key: "highContrast",
        className: "high-contrast",
      },
      { label: "Extra dark", key: "extraDark", className: "extra-dark" },
      {
        label: "Reduce motion",
        key: "reducedMotion",
        className: "reduce-motion",
      },
      {
        label: "Stronger focus outlines",
        key: "enhancedFocus",
        className: "enhanced-focus",
      },
    ];
    for (const option of options) {
      const toggle = screen.getByRole("switch", { name: option.label });
      toggle.focus();
      await user.keyboard(" ");
      expect(toggle).toHaveAttribute("aria-checked", "true");
      expect(
        option.body ? document.body : document.documentElement,
      ).toHaveClass(option.className);
      expect(
        JSON.parse(localStorage.getItem(storageKey) ?? "{}")[option.key],
      ).toBe(true);
    }
    await user.click(screen.getByRole("switch", { name: "Reduce motion" }));
    expect(document.documentElement).not.toHaveClass("reduce-motion");
  });

  it("explains disabled extra dark in light mode and preserves its saved preference", async () => {
    localStorage.setItem(storageKey, JSON.stringify({ extraDark: true }));
    const user = userEvent.setup();
    const { rerender } = render(<AccessibilitySection />);
    const toggle = screen.getByRole("switch", { name: "Extra dark" });
    expect(toggle).toBeDisabled();
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).toHaveAccessibleDescription(
      "Choose Dark in Appearance to use extra dark.",
    );
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");

    theme.isDarkMode = true;
    rerender(<AccessibilitySection />);
    expect(toggle).toBeEnabled();
    expect(toggle).not.toHaveAttribute("aria-describedby");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("provides every color vision option in a native select and applies the selected palette", async () => {
    const user = userEvent.setup();
    render(<AccessibilitySection />);
    const select = screen.getByRole("combobox", { name: "Color vision" });
    expect(select.tagName).toBe("SELECT");
    expect(within(select).getAllByRole("option")).toHaveLength(5);
    expect(select).toHaveValue("none");
    await user.selectOptions(select, "deuteranopia");
    expect(select).toHaveValue("deuteranopia");
    expect(select).toHaveAccessibleDescription(
      "Green-blind friendly (blue/yellow palette)",
    );
    expect(document.documentElement).toHaveClass("colorblind-deuteranopia");
    expect(
      JSON.parse(localStorage.getItem(storageKey) ?? "{}").colorblindMode,
    ).toBe("deuteranopia");
    await user.selectOptions(select, "none");
    expect(document.documentElement).not.toHaveClass("colorblind-deuteranopia");
    expect(select).toHaveAccessibleDescription("Default colors");
  });
});

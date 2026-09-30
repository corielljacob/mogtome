import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeContext";

function ThemeControls() {
  const { settings, setEventThemingDisabled } = useTheme();
  return (
    <>
      <output>{settings.colorTheme}</output>
      <button onClick={() => setEventThemingDisabled(true)}>
        Use my theme
      </button>
      <button onClick={() => setEventThemingDisabled(false)}>
        Use seasonal theme
      </button>
    </>
  );
}

describe("seasonal palette precedence", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 22, 12));
    localStorage.clear();
    document.documentElement.className = "";
    localStorage.setItem(
      "mogtome-theme",
      JSON.stringify({
        colorTheme: "endwalker",
        colorMode: "dark",
        eventThemingDisabled: false,
      }),
    );
  });
  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.className = "";
    localStorage.clear();
  });

  it.each([
    [new Date(2026, 9, 22, 12), "event-all-saints-wake"],
    [new Date(2026, 11, 20, 12), "event-starlight"],
  ])(
    "lets the holiday palette replace an expansion palette on %s",
    (date, eventClass) => {
      vi.setSystemTime(date);
      render(
        <ThemeProvider>
          <ThemeControls />
        </ThemeProvider>,
      );
      expect(document.documentElement).toHaveClass("dark", eventClass);
      expect(document.documentElement).not.toHaveClass("theme-endwalker");
      expect(screen.getByRole("status")).toHaveTextContent("endwalker");
    },
  );

  it("restores the chosen theme when seasonal styling is disabled, and can re-enable it", () => {
    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Use my theme" }));
    expect(document.documentElement).toHaveClass("theme-endwalker");
    expect(document.documentElement).not.toHaveClass("event-all-saints-wake");
    fireEvent.click(screen.getByRole("button", { name: "Use seasonal theme" }));
    expect(document.documentElement).toHaveClass("event-all-saints-wake");
    expect(document.documentElement).not.toHaveClass("theme-endwalker");
  });

  it("restores the selected expansion after the holiday ends", () => {
    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    );
    act(() => {
      vi.setSystemTime(new Date(2026, 10, 2, 12));
      vi.advanceTimersByTime(5 * 60 * 1000);
    });
    expect(document.documentElement).toHaveClass("theme-endwalker");
    expect(document.documentElement).not.toHaveClass("event-all-saints-wake");
  });
});

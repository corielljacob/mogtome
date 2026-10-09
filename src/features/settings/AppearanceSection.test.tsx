import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  THEME_DEFINITIONS,
  useTheme,
  type ColorMode,
  type ColorTheme,
  type EventOverride,
} from "@/shared/contexts/ThemeContext";
import {
  SEASONAL_EVENTS,
  type SeasonalEvent,
} from "@/shared/constants/seasonalEvents";
import { AppearanceSection } from "./AppearanceSection";

vi.mock("@/shared/contexts/ThemeContext", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/shared/contexts/ThemeContext")>()),
  useTheme: vi.fn(),
}));

const starlight = SEASONAL_EVENTS.find((event) => event.id === "starlight")!;
const allSaints = SEASONAL_EVENTS.find(
  (event) => event.id === "all-saints-wake",
)!;

function renderAppearance({
  mode = "system",
  theme = "pom-pom",
  activeEvent = null,
  nextEvent = null,
  seasonalDisabled = false,
  systemDark = false,
  eventOverride = "auto",
}: {
  mode?: ColorMode;
  theme?: ColorTheme;
  activeEvent?: SeasonalEvent | null;
  nextEvent?: SeasonalEvent | null;
  seasonalDisabled?: boolean;
  systemDark?: boolean;
  eventOverride?: EventOverride;
} = {}) {
  const calls = {
    setColorMode: vi.fn(),
    setColorTheme: vi.fn(),
    setEventThemingDisabled: vi.fn(),
    setEventOverride: vi.fn(),
  };
  function Harness() {
    const [colorMode, setMode] = useState(mode);
    const [colorTheme, setTheme] = useState(theme);
    const [eventThemingDisabled, setDisabled] = useState(seasonalDisabled);
    const [override, setOverride] = useState(eventOverride);
    const currentEvent =
      override === "auto"
        ? activeEvent
        : override === "none"
          ? null
          : (SEASONAL_EVENTS.find((event) => event.id === override) ?? null);
    vi.mocked(useTheme).mockReturnValue({
      settings: { colorMode, colorTheme, eventThemingDisabled },
      isDarkMode: colorMode === "system" ? systemDark : colorMode === "dark",
      activeEvent: currentEvent,
      nextEvent,
      isEventThemeActive: !!currentEvent && !eventThemingDisabled,
      eventOverride: override,
      setColorMode: (value) => {
        calls.setColorMode(value);
        setMode(value);
      },
      setColorTheme: (value) => {
        calls.setColorTheme(value);
        setTheme(value);
      },
      setEventThemingDisabled: (value) => {
        calls.setEventThemingDisabled(value);
        setDisabled(value);
      },
      setEventOverride: (value) => {
        calls.setEventOverride(value);
        setOverride(value);
      },
    });
    return <AppearanceSection />;
  }
  return { ...render(<Harness />), calls };
}

describe("Appearance settings", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("uses native radios for mode selection and arrow-key navigation while explaining the resolved system mode", async () => {
    const user = userEvent.setup();
    const { calls } = renderAppearance({ systemDark: true });
    const modes = screen.getByRole("group", { name: "Color mode" });
    const system = within(modes).getByRole("radio", { name: "System" });
    expect(system).toBeChecked();
    expect(screen.getByText("System: dark mode.")).toBeInTheDocument();

    await user.click(within(modes).getByRole("radio", { name: "Light" }));
    expect(calls.setColorMode).toHaveBeenLastCalledWith("light");
    expect(within(modes).getByRole("radio", { name: "Light" })).toBeChecked();
    await user.keyboard("{ArrowRight}");

    expect(within(modes).getByRole("radio", { name: "Dark" })).toBeChecked();
    expect(within(modes).getByRole("radio", { name: "Dark" })).toHaveFocus();
    expect(calls.setColorMode).toHaveBeenLastCalledWith("dark");
    await user.keyboard("{ArrowRight}");
    expect(system).toBeChecked();
    expect(calls.setColorMode).toHaveBeenLastCalledWith("system");
    expect(calls.setColorTheme).not.toHaveBeenCalled();
  });

  it("describes all theme choices and changes only the selected base theme", async () => {
    const user = userEvent.setup();
    const { calls } = renderAppearance();
    const themes = screen.getByRole("group", { name: "Base theme" });
    expect(within(themes).getAllByRole("radio")).toHaveLength(
      THEME_DEFINITIONS.length,
    );
    for (const theme of THEME_DEFINITIONS) {
      expect(
        within(themes).getByRole("radio", { name: theme.name }),
      ).toHaveAccessibleDescription(theme.description);
    }
    const original = within(themes).getByRole("radio", {
      name: "MogTome (Default)",
    });
    expect(original).toBeChecked();

    await user.click(
      within(themes).getByRole("radio", { name: "Heavensward" }),
    );

    expect(calls.setColorTheme).toHaveBeenCalledExactlyOnceWith("heavensward");
    expect(
      within(themes).getByRole("radio", { name: "Heavensward" }),
    ).toBeChecked();
    expect(original).not.toBeChecked();
    expect(calls.setColorMode).not.toHaveBeenCalled();
    expect(calls.setEventThemingDisabled).not.toHaveBeenCalled();
  });

  it("keeps every base theme selectable during an event and makes the saved-versus-active choice explicit", async () => {
    const user = userEvent.setup();
    const { calls } = renderAppearance({ activeEvent: allSaints });
    const themes = screen.getByRole("group", { name: "Base theme" });
    for (const radio of within(themes).getAllByRole("radio"))
      expect(radio).toBeEnabled();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Current theme: All Saints' Wake",
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "MogTome (Default) returns after",
    );

    await user.click(within(themes).getByRole("radio", { name: "Endwalker" }));

    expect(calls.setColorTheme).toHaveBeenCalledExactlyOnceWith("endwalker");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Endwalker returns after",
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Current theme: All Saints' Wake",
    );
    expect(within(themes).getByText("Saved base theme")).toBeInTheDocument();
    expect(calls.setEventThemingDisabled).not.toHaveBeenCalled();
    expect(
      within(themes).getByRole("radio", { name: "Endwalker" }),
    ).toHaveFocus();

    screen.getByRole("button", { name: "Use base theme" }).focus();
    await user.keyboard("{Enter}");

    expect(calls.setEventThemingDisabled).toHaveBeenCalledExactlyOnceWith(true);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("Endwalker is active.")).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Seasonal event themes" }),
    ).not.toBeChecked();
    expect(
      screen.getByRole("switch", { name: "Seasonal event themes" }),
    ).toHaveFocus();
    expect(
      within(themes).getByRole("radio", { name: "Endwalker" }),
    ).toBeChecked();
  });

  it("toggles seasonal theming without changing the saved palette and describes its current state", async () => {
    const user = userEvent.setup();
    const { calls } = renderAppearance({ theme: "dawntrail" });
    const toggle = screen.getByRole("switch", {
      name: "Seasonal event themes",
    });
    expect(toggle).toBeChecked();
    expect(toggle).toHaveAccessibleDescription("No seasonal event is active.");

    await user.click(toggle);

    expect(toggle).not.toBeChecked();
    expect(toggle).toHaveAccessibleDescription("Dawntrail is active.");
    expect(calls.setEventThemingDisabled).toHaveBeenCalledExactlyOnceWith(true);
    expect(calls.setColorTheme).not.toHaveBeenCalled();
  });

  it("can opt back into an available event without losing the base theme", async () => {
    const user = userEvent.setup();
    const { calls } = renderAppearance({
      theme: "arr",
      activeEvent: starlight,
      seasonalDisabled: true,
    });
    expect(screen.getByText("A Realm Reborn is active.")).toBeInTheDocument();

    screen
      .getByRole("button", { name: "Use Starlight Celebration theme" })
      .focus();
    await user.keyboard(" ");

    expect(calls.setEventThemingDisabled).toHaveBeenCalledExactlyOnceWith(
      false,
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Current theme: Starlight Celebration",
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "A Realm Reborn returns after",
    );
    expect(screen.getByRole("radio", { name: "A Realm Reborn" })).toBeChecked();
    expect(
      screen.getByRole("switch", { name: "Seasonal event themes" }),
    ).toHaveFocus();
    expect(calls.setColorTheme).not.toHaveBeenCalled();
  });

  it("keeps the calendar collapsed until requested and identifies the active event when opened", async () => {
    const user = userEvent.setup();
    renderAppearance({ activeEvent: allSaints });
    const button = screen.getByRole("button", {
      name: /Seasonal theme calendar/,
    });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();

    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(
      SEASONAL_EVENTS.length,
    );
    expect(
      within(list).getByText("All Saints' Wake").closest("li"),
    ).toHaveTextContent("Active theme");
    expect(list).toBeVisible();
    await user.click(button);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("shows the next theme event without implying that it is currently active", () => {
    renderAppearance({ nextEvent: allSaints });

    expect(screen.getByText(/Next event:/)).toHaveTextContent(
      "All Saints' Wake",
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(
      screen.getByText("No seasonal event is active."),
    ).toBeInTheDocument();
  });

  it("keeps developer previews behind a collapsed disclosure and restores the date-based setting", async () => {
    vi.stubEnv("DEV", true);
    const user = userEvent.setup();
    const { calls } = renderAppearance();
    const hiddenSelect = screen.getByLabelText("Preview a seasonal event");
    expect(hiddenSelect).not.toBeVisible();
    expect(hiddenSelect.closest("details")).not.toHaveAttribute("open");

    await user.click(screen.getByText("Development: event preview"));
    const select = screen.getByRole("combobox", {
      name: "Preview a seasonal event",
    });
    await user.selectOptions(select, "starlight");

    expect(calls.setEventOverride).toHaveBeenLastCalledWith("starlight");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Preview overrides the calendar.",
    );
    await user.selectOptions(select, "none");
    expect(calls.setEventOverride).toHaveBeenLastCalledWith("none");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await user.selectOptions(select, "auto");
    expect(calls.setEventOverride).toHaveBeenLastCalledWith("auto");
    expect(calls.setColorTheme).not.toHaveBeenCalled();
  });

  it("omits developer event controls from production", () => {
    vi.stubEnv("DEV", false);
    renderAppearance();

    expect(
      screen.queryByText("Development: event preview"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { hidden: true }),
    ).not.toBeInTheDocument();
  });
});

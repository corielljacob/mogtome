import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  getActiveEvent,
  getNextEvent,
  SEASONAL_EVENTS,
  type SeasonalEvent,
  type SeasonalEventId,
} from "@/shared/constants/seasonalEvents";
import { THEME_META, THEME_PALETTES } from "@/shared/theme/themePalettes";

export type ColorTheme =
  | "pom-pom" // MogTome default (warm sunset orange/coral)
  | "arr" // A Realm Reborn - Hydaelyn crystal blue
  | "heavensward" // Ishgard ice-blue & frost
  | "stormblood" // Ala Mhigan scarlet & gold
  | "shadowbringers" // amethyst violet, cyan & gold Light
  | "endwalker" // cosmic blue & celestial gold
  | "dawntrail" // Tural dawn - coral, gold & teal
  | "evercold"; // Norse frost - icy blue & aurora

export type ColorMode = "light" | "dark" | "system";

export interface ThemeSettings {
  colorTheme: ColorTheme;
  colorMode: ColorMode;
  eventThemingDisabled: boolean;
}

/**
 * Dev-only override for forcing a specific event.
 * - 'auto': use real date-based detection (default)
 * - 'none': force no active event
 * - SeasonalEventId: force a specific event
 */
export type EventOverride = "auto" | "none" | SeasonalEventId;

interface ThemeContextType {
  settings: ThemeSettings;
  /** resolved from colorMode + system preference */
  isDarkMode: boolean;
  setColorTheme: (theme: ColorTheme) => void;
  setColorMode: (mode: ColorMode) => void;
  activeEvent: SeasonalEvent | null;
  nextEvent: SeasonalEvent | null;
  /** event active and user hasn't opted out */
  isEventThemeActive: boolean;
  setEventThemingDisabled: (disabled: boolean) => void;
  /** dev-only: override which event is active */
  eventOverride: EventOverride;
  setEventOverride: (override: EventOverride) => void;
}

export interface ThemeDefinition {
  id: ColorTheme;
  name: string;
  description: string;
  /** optional themed title font (so the picker can preview it in-font) */
  displayFont?: string;
  /** Preview colors shown in the theme picker */
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

/**
 * The user-selectable themes, derived from the single palette source
 * (src/styles/themePalettes.ts) so the picker swatches always match the
 * generated CSS. Preview colours are each theme's light-mode identity colours.
 */
export const THEME_DEFINITIONS: ThemeDefinition[] = THEME_META.map((meta) => {
  const { primary, secondary, accent } = THEME_PALETTES[meta.id].light;
  return {
    id: meta.id as ColorTheme,
    name: meta.name,
    description: meta.description,
    displayFont: meta.displayFont,
    preview: { primary, secondary, accent },
  };
});

const STORAGE_KEY = "mogtome-theme";
const DEV_EVENT_OVERRIDE_KEY = "mogtome-dev-event-override";

/** re-check the active event every 5 minutes */
const EVENT_CHECK_INTERVAL_MS = 5 * 60 * 1000;

const defaultSettings: ThemeSettings = {
  colorTheme: "pom-pom",
  colorMode: "system",
  eventThemingDisabled: false,
};

const ThemeContext = createContext<ThemeContextType | null>(null);

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveIsDarkMode(
  mode: ColorMode,
  systemPrefersDark: boolean,
): boolean {
  if (mode === "system") {
    return systemPrefersDark;
  }
  return mode === "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    if (typeof window === "undefined") return defaultSettings;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = { ...defaultSettings, ...parsed };
        // a removed theme (e.g. one of the retired non-expansion themes) falls
        // back to the default rather than rendering an unstyled :root.
        if (!THEME_META.some((t) => t.id === merged.colorTheme)) {
          merged.colorTheme = defaultSettings.colorTheme;
        }
        return merged;
      }

      // Migration: check for old 'theme' key (light/dark)
      const oldTheme = localStorage.getItem("theme");
      if (oldTheme === "light" || oldTheme === "dark") {
        return { ...defaultSettings, colorMode: oldTheme };
      }
    } catch {
      // Invalid JSON, use defaults
    }

    return defaultSettings;
  });

  // Only the OS colour-scheme preference is reactive state; isDarkMode is derived
  // from it plus the chosen colorMode (no syncing effect needed).
  const [systemPrefersDark, setSystemPrefersDark] =
    useState(getSystemPrefersDark);
  const isDarkMode = resolveIsDarkMode(settings.colorMode, systemPrefersDark);

  const [eventOverride, setEventOverrideState] = useState<EventOverride>(() => {
    if (!import.meta.env.DEV || typeof window === "undefined") return "auto";
    try {
      const stored = localStorage.getItem(DEV_EVENT_OVERRIDE_KEY);
      if (
        stored &&
        (stored === "auto" ||
          stored === "none" ||
          SEASONAL_EVENTS.some((e) => e.id === stored))
      ) {
        return stored as EventOverride;
      }
    } catch {
      // Ignore
    }
    return "auto";
  });

  const setEventOverride = useCallback((override: EventOverride) => {
    setEventOverrideState(override);
    if (import.meta.env.DEV) {
      try {
        localStorage.setItem(DEV_EVENT_OVERRIDE_KEY, override);
      } catch {
        // Ignore
      }
    }
  }, []);

  const [realActiveEvent, setRealActiveEvent] = useState<SeasonalEvent | null>(
    () => getActiveEvent(),
  );

  // re-check periodically to catch midnight rollovers
  useEffect(() => {
    const check = () => {
      setRealActiveEvent(getActiveEvent());
    };

    const interval = setInterval(check, EVENT_CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // dev override takes precedence over the real date-based event
  const activeEvent = useMemo(() => {
    if (import.meta.env.DEV && eventOverride !== "auto") {
      if (eventOverride === "none") return null;
      return SEASONAL_EVENTS.find((e) => e.id === eventOverride) ?? null;
    }
    return realActiveEvent;
  }, [eventOverride, realActiveEvent]);

  const nextEvent = useMemo(() => {
    if (activeEvent) return null;
    return getNextEvent();
  }, [activeEvent]);

  const isEventThemeActive = useMemo(
    () => activeEvent !== null && !settings.eventThemingDisabled,
    [activeEvent, settings.eventThemingDisabled],
  );

  // apply theme classes to document
  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", isDarkMode);

    THEME_DEFINITIONS.forEach((t) => {
      root.classList.remove(`theme-${t.id}`);
    });
    root.classList.add(`theme-${settings.colorTheme}`);

    SEASONAL_EVENTS.forEach((e) => {
      root.classList.remove(e.cssClass);
    });
    if (activeEvent && !settings.eventThemingDisabled) {
      root.classList.add(activeEvent.cssClass);
    }

    // defer a frame so CSS variables update before we read --bg (flash prevention)
    requestAnimationFrame(() => {
      const bgColor =
        getComputedStyle(root).getPropertyValue("--bg").trim() ||
        (isDarkMode ? "#1A1722" : "#FFF9F5");
      root.style.backgroundColor = bgColor;
      // Keep the browser chrome (address bar / status bar) matching the active
      // theme + mode, so the page edges blend into the device UI natively.
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) themeColorMeta.setAttribute("content", bgColor);
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      localStorage.removeItem("theme"); // drop pre-migration key
    } catch {
      // storage might be full or disabled
    }
  }, [settings, activeEvent, isDarkMode]);

  // track the OS colour-scheme preference; isDarkMode derives from it in 'system' mode
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystemPrefersDark(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const setColorTheme = useCallback((theme: ColorTheme) => {
    setSettings((prev) => ({ ...prev, colorTheme: theme }));
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setSettings((prev) => ({ ...prev, colorMode: mode }));
  }, []);

  const setEventThemingDisabled = useCallback((disabled: boolean) => {
    setSettings((prev) => ({ ...prev, eventThemingDisabled: disabled }));
  }, []);

  // memoize so consumers don't re-render on every ThemeProvider parent re-render
  const contextValue = useMemo<ThemeContextType>(
    () => ({
      settings,
      isDarkMode,
      setColorTheme,
      setColorMode,
      activeEvent,
      nextEvent,
      isEventThemeActive,
      setEventThemingDisabled,
      eventOverride,
      setEventOverride,
    }),
    [
      settings,
      isDarkMode,
      setColorTheme,
      setColorMode,
      activeEvent,
      nextEvent,
      isEventThemeActive,
      setEventThemingDisabled,
      eventOverride,
      setEventOverride,
    ],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

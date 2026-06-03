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
} from "../constants/seasonalEvents";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Available color themes */
export type ColorTheme =
  | "pom-pom" // Classic red/purple (default)
  | "crystal" // Blue/cyan crystal theme
  | "chocobo" // Yellow/gold warm theme
  | "tonberry" // Green/teal theme
  | "cactuar" // Green/lime fresh theme
  | "moogle-cloud" // Soft pink/lavender pastel theme
  | "midnight" // Deep indigo/purple night theme
  | "sunset"; // Orange/coral warm theme

/** Light/Dark/System mode */
export type ColorMode = "light" | "dark" | "system";

export interface ThemeSettings {
  /** The selected color theme palette */
  colorTheme: ColorTheme;
  /** Light/Dark/System mode */
  colorMode: ColorMode;
  /** Whether the user has opted out of seasonal event themes */
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
  /** Whether dark mode is currently active (resolved from mode + system preference) */
  isDarkMode: boolean;
  setColorTheme: (theme: ColorTheme) => void;
  setColorMode: (mode: ColorMode) => void;
  /** Seasonal event state */
  activeEvent: SeasonalEvent | null;
  nextEvent: SeasonalEvent | null;
  /** Whether the event theme is currently being applied */
  isEventThemeActive: boolean;
  /** Toggle event theming on/off */
  setEventThemingDisabled: (disabled: boolean) => void;
  /** Dev-only: override which event is active for testing */
  eventOverride: EventOverride;
  /** Dev-only: set the event override */
  setEventOverride: (override: EventOverride) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Theme Definitions
// ─────────────────────────────────────────────────────────────────────────────

export interface ThemeDefinition {
  id: ColorTheme;
  name: string;
  description: string;
  /** Preview colors shown in the theme picker */
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const THEME_DEFINITIONS: ThemeDefinition[] = [
  {
    id: "pom-pom",
    name: "Pom-Pom Classic",
    description: "Warm reds and soft purples",
    preview: { primary: "#E54B4B", secondary: "#9683B8", accent: "#F28B8B" },
  },
  {
    id: "crystal",
    name: "Crystal Tower",
    description: "Allagan blues & gold",
    preview: { primary: "#245F9E", secondary: "#2BA6BE", accent: "#D2A24A" },
  },
  {
    id: "chocobo",
    name: "Chocobo Gold",
    description: "Golden plumage & warm orange",
    preview: { primary: "#B5800F", secondary: "#D9682B", accent: "#F2C24C" },
  },
  {
    id: "tonberry",
    name: "Tonberry Lantern",
    description: "Murky green & lantern glow",
    preview: { primary: "#3C7A4A", secondary: "#2C6657", accent: "#D89A3A" },
  },
  {
    id: "cactuar",
    name: "Cactuar Fresh",
    description: "Desert greens & sunlit sand",
    preview: { primary: "#33944E", secondary: "#7DA82F", accent: "#E6C257" },
  },
  {
    id: "moogle-cloud",
    name: "Moogle Cloud",
    description: "Soft pom-pink & lavender",
    preview: { primary: "#D9527F", secondary: "#8E72C2", accent: "#F2A6C6" },
  },
  {
    id: "midnight",
    name: "Midnight Realm",
    description: "Deep indigo & starlight",
    preview: { primary: "#3F3AA8", secondary: "#6A3CB0", accent: "#8E9AF0" },
  },
  {
    id: "sunset",
    name: "Costa del Sol",
    description: "Sunset orange & coral",
    preview: { primary: "#DE5F28", secondary: "#D84F6A", accent: "#F2B061" },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "mogtome-theme";
const DEV_EVENT_OVERRIDE_KEY = "mogtome-dev-event-override";

/** How often to re-check the active event (every 5 minutes) */
const EVENT_CHECK_INTERVAL_MS = 5 * 60 * 1000;

const defaultSettings: ThemeSettings = {
  colorTheme: "pom-pom",
  colorMode: "system",
  eventThemingDisabled: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextType | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    if (typeof window === "undefined") return defaultSettings;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultSettings, ...parsed };
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

  // ── Dev-only Event Override ────────────────────────────────────────────────
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

  // ── Seasonal Event State ──────────────────────────────────────────────────
  // Resolve the real date-based event
  const [realActiveEvent, setRealActiveEvent] = useState<SeasonalEvent | null>(
    () => getActiveEvent(),
  );

  // Periodically check for event changes (handles midnight rollovers)
  useEffect(() => {
    const check = () => {
      setRealActiveEvent(getActiveEvent());
    };

    const interval = setInterval(check, EVENT_CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Resolve the effective active event (override takes precedence in dev)
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

  // Apply theme classes to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply dark class (isDarkMode is derived above)
    root.classList.toggle("dark", isDarkMode);

    // Remove all theme classes, then add selected
    THEME_DEFINITIONS.forEach((t) => {
      root.classList.remove(`theme-${t.id}`);
    });
    root.classList.add(`theme-${settings.colorTheme}`);

    // Remove all event classes, then add active event if enabled
    SEASONAL_EVENTS.forEach((e) => {
      root.classList.remove(e.cssClass);
    });
    if (activeEvent && !settings.eventThemingDisabled) {
      root.classList.add(activeEvent.cssClass);
    }

    // Update background color for flash prevention
    // Small delay to let CSS variables update first
    requestAnimationFrame(() => {
      const bgColor =
        getComputedStyle(root).getPropertyValue("--bg").trim() ||
        (isDarkMode ? "#1A1722" : "#FFF9F5");
      root.style.backgroundColor = bgColor;
    });

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      // Remove old theme key if it exists
      localStorage.removeItem("theme");
    } catch {
      // Storage might be full or disabled
    }
  }, [settings, activeEvent, isDarkMode]);

  // Track the OS colour-scheme preference. isDarkMode derives from it (in 'system'
  // mode), and the effect above re-applies the `dark` class when it changes.
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

  // PERFORMANCE: Memoize the context value to prevent all consumers from re-rendering
  // when unrelated parent state changes. Without this, every component using useTheme()
  // re-renders on any ThemeProvider parent re-render.
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

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

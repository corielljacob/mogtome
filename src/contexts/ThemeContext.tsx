import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { getActiveEvent, getNextEvent, SEASONAL_EVENTS, type SeasonalEvent, type SeasonalEventId } from '../constants/seasonalEvents';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Available color themes */
export type ColorTheme = 
  | 'pom-pom'      // Classic red/purple (default)
  | 'crystal'      // Blue/cyan crystal theme
  | 'chocobo'      // Yellow/gold warm theme
  | 'tonberry'     // Green/teal theme
  | 'cactuar'      // Green/lime fresh theme
  | 'moogle-cloud' // Soft pink/lavender pastel theme
  | 'midnight'     // Deep indigo/purple night theme
  | 'sunset';      // Orange/coral warm theme

/** Light/Dark/System mode */
export type ColorMode = 'light' | 'dark' | 'system';

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
export type EventOverride = 'auto' | 'none' | SeasonalEventId;

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
    id: 'pom-pom',
    name: 'Pom-Pom Classic',
    description: 'Warm reds and soft purples',
    preview: { primary: '#E54B4B', secondary: '#9683B8', accent: '#F28B8B' },
  },
  {
    id: 'crystal',
    name: 'Crystal Tower',
    description: 'Cool blues and cyans',
    preview: { primary: '#3B82F6', secondary: '#06B6D4', accent: '#60A5FA' },
  },
  {
    id: 'chocobo',
    name: 'Chocobo Gold',
    description: 'Warm yellows and golds',
    preview: { primary: '#EAB308', secondary: '#F97316', accent: '#FCD34D' },
  },
  {
    id: 'tonberry',
    name: 'Tonberry Lantern',
    description: 'Deep teals and greens',
    preview: { primary: '#14B8A6', secondary: '#059669', accent: '#5EEAD4' },
  },
  {
    id: 'cactuar',
    name: 'Cactuar Fresh',
    description: 'Bright greens and limes',
    preview: { primary: '#22C55E', secondary: '#84CC16', accent: '#86EFAC' },
  },
  {
    id: 'moogle-cloud',
    name: 'Moogle Cloud',
    description: 'Soft pinks and lavenders',
    preview: { primary: '#EC4899', secondary: '#A855F7', accent: '#F9A8D4' },
  },
  {
    id: 'midnight',
    name: 'Midnight Realm',
    description: 'Deep indigos and purples',
    preview: { primary: '#6366F1', secondary: '#8B5CF6', accent: '#A5B4FC' },
  },
  {
    id: 'sunset',
    name: 'Costa del Sol',
    description: 'Warm oranges and corals',
    preview: { primary: '#F97316', secondary: '#EF4444', accent: '#FDBA74' },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'mogtome-theme';
const DEV_EVENT_OVERRIDE_KEY = 'mogtome-dev-event-override';

/** How often to re-check the active event (every 5 minutes) */
const EVENT_CHECK_INTERVAL_MS = 5 * 60 * 1000;

const defaultSettings: ThemeSettings = {
  colorTheme: 'pom-pom',
  colorMode: 'system',
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
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolveIsDarkMode(mode: ColorMode): boolean {
  if (mode === 'system') {
    return getSystemPrefersDark();
  }
  return mode === 'dark';
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    if (typeof window === 'undefined') return defaultSettings;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultSettings, ...parsed };
      }
      
      // Migration: check for old 'theme' key (light/dark)
      const oldTheme = localStorage.getItem('theme');
      if (oldTheme === 'light' || oldTheme === 'dark') {
        return { ...defaultSettings, colorMode: oldTheme };
      }
    } catch {
      // Invalid JSON, use defaults
    }
    
    return defaultSettings;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => resolveIsDarkMode(settings.colorMode));

  // ── Dev-only Event Override ────────────────────────────────────────────────
  const [eventOverride, setEventOverrideState] = useState<EventOverride>(() => {
    if (!import.meta.env.DEV || typeof window === 'undefined') return 'auto';
    try {
      const stored = localStorage.getItem(DEV_EVENT_OVERRIDE_KEY);
      if (stored && (stored === 'auto' || stored === 'none' || SEASONAL_EVENTS.some(e => e.id === stored))) {
        return stored as EventOverride;
      }
    } catch {
      // Ignore
    }
    return 'auto';
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
  const [realActiveEvent, setRealActiveEvent] = useState<SeasonalEvent | null>(() => getActiveEvent());

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
    if (import.meta.env.DEV && eventOverride !== 'auto') {
      if (eventOverride === 'none') return null;
      return SEASONAL_EVENTS.find(e => e.id === eventOverride) ?? null;
    }
    return realActiveEvent;
  }, [eventOverride, realActiveEvent]);

  const nextEvent = useMemo(() => {
    if (activeEvent) return null;
    return getNextEvent();
  }, [activeEvent]);

  const isEventThemeActive = useMemo(
    () => activeEvent !== null && !settings.eventThemingDisabled,
    [activeEvent, settings.eventThemingDisabled]
  );

  // Apply theme classes to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Resolve dark mode
    const dark = resolveIsDarkMode(settings.colorMode);
    setIsDarkMode(dark);
    
    // Apply dark class
    root.classList.toggle('dark', dark);
    
    // Remove all theme classes, then add selected
    THEME_DEFINITIONS.forEach(t => {
      root.classList.remove(`theme-${t.id}`);
    });
    root.classList.add(`theme-${settings.colorTheme}`);

    // Remove all event classes, then add active event if enabled
    SEASONAL_EVENTS.forEach(e => {
      root.classList.remove(e.cssClass);
    });
    if (activeEvent && !settings.eventThemingDisabled) {
      root.classList.add(activeEvent.cssClass);
    }
    
    // Update background color for flash prevention
    // Small delay to let CSS variables update first
    requestAnimationFrame(() => {
      const bgColor = getComputedStyle(root).getPropertyValue('--bento-bg').trim() || (dark ? '#1A1722' : '#FFF9F5');
      root.style.backgroundColor = bgColor;
    });
    
    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      // Remove old theme key if it exists
      localStorage.removeItem('theme');
    } catch {
      // Storage might be full or disabled
    }
  }, [settings, activeEvent]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (settings.colorMode !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const dark = mediaQuery.matches;
      setIsDarkMode(dark);
      document.documentElement.classList.toggle('dark', dark);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [settings.colorMode]);

  const setColorTheme = useCallback((theme: ColorTheme) => {
    setSettings(prev => ({ ...prev, colorTheme: theme }));
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setSettings(prev => ({ ...prev, colorMode: mode }));
  }, []);

  const setEventThemingDisabled = useCallback((disabled: boolean) => {
    setSettings(prev => ({ ...prev, eventThemingDisabled: disabled }));
  }, []);

  // PERFORMANCE: Memoize the context value to prevent all consumers from re-rendering
  // when unrelated parent state changes. Without this, every component using useTheme()
  // re-renders on any ThemeProvider parent re-render.
  const contextValue = useMemo<ThemeContextType>(() => ({
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
  }), [settings, isDarkMode, setColorTheme, setColorMode, activeEvent, nextEvent, isEventThemeActive, setEventThemingDisabled, eventOverride, setEventOverride]);

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
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

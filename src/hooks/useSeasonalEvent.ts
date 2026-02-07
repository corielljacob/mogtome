import { useState, useEffect, useCallback, useMemo } from 'react';
import { getActiveEvent, getNextEvent, type SeasonalEvent } from '../constants/seasonalEvents';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'mogtome-seasonal-event';

/** How often to re-check the active event (every 5 minutes) */
const CHECK_INTERVAL_MS = 5 * 60 * 1000;

interface SeasonalEventPreferences {
  /** Whether the user has opted out of event theming */
  eventThemingDisabled: boolean;
}

const defaultPreferences: SeasonalEventPreferences = {
  eventThemingDisabled: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export interface UseSeasonalEventReturn {
  /** The currently active event, or null if no event is active */
  activeEvent: SeasonalEvent | null;
  /** The next upcoming event (when no event is active) */
  nextEvent: SeasonalEvent | null;
  /** Whether event theming is enabled (event active + user hasn't opted out) */
  isEventThemeActive: boolean;
  /** Whether the user has disabled event theming */
  eventThemingDisabled: boolean;
  /** Toggle event theming on/off */
  setEventThemingDisabled: (disabled: boolean) => void;
}

export function useSeasonalEvent(): UseSeasonalEventReturn {
  const [activeEvent, setActiveEvent] = useState<SeasonalEvent | null>(() => getActiveEvent());
  const [nextEvent, setNextEvent] = useState<SeasonalEvent | null>(() => 
    getActiveEvent() ? null : getNextEvent()
  );

  const [preferences, setPreferences] = useState<SeasonalEventPreferences>(() => {
    if (typeof window === 'undefined') return defaultPreferences;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultPreferences, ...JSON.parse(stored) };
      }
    } catch {
      // Invalid JSON, use defaults
    }
    return defaultPreferences;
  });

  // Periodically check for event changes (handles midnight rollovers)
  useEffect(() => {
    const check = () => {
      const current = getActiveEvent();
      setActiveEvent(current);
      setNextEvent(current ? null : getNextEvent());
    };

    const interval = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Persist preferences
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Storage might be full or disabled
    }
  }, [preferences]);

  const setEventThemingDisabled = useCallback((disabled: boolean) => {
    setPreferences(prev => ({ ...prev, eventThemingDisabled: disabled }));
  }, []);

  const isEventThemeActive = useMemo(
    () => activeEvent !== null && !preferences.eventThemingDisabled,
    [activeEvent, preferences.eventThemingDisabled]
  );

  return {
    activeEvent,
    nextEvent,
    isEventThemeActive,
    eventThemingDisabled: preferences.eventThemingDisabled,
    setEventThemingDisabled,
  };
}

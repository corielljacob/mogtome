import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getActiveEvent,
  getNextEvent,
  type SeasonalEvent,
} from "@/shared/constants/seasonalEvents";

const STORAGE_KEY = "mogtome-seasonal-event";

/** re-check the active event every 5 minutes */
const CHECK_INTERVAL_MS = 5 * 60 * 1000;

interface SeasonalEventPreferences {
  eventThemingDisabled: boolean;
}

const defaultPreferences: SeasonalEventPreferences = {
  eventThemingDisabled: false,
};

export interface UseSeasonalEventReturn {
  activeEvent: SeasonalEvent | null;
  /** next upcoming event, only set when none is currently active */
  nextEvent: SeasonalEvent | null;
  /** event active and user hasn't opted out */
  isEventThemeActive: boolean;
  eventThemingDisabled: boolean;
  setEventThemingDisabled: (disabled: boolean) => void;
}

export function useSeasonalEvent(): UseSeasonalEventReturn {
  const [activeEvent, setActiveEvent] = useState<SeasonalEvent | null>(() =>
    getActiveEvent(),
  );
  const [nextEvent, setNextEvent] = useState<SeasonalEvent | null>(() =>
    getActiveEvent() ? null : getNextEvent(),
  );

  const [preferences, setPreferences] = useState<SeasonalEventPreferences>(
    () => {
      if (typeof window === "undefined") return defaultPreferences;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return { ...defaultPreferences, ...JSON.parse(stored) };
        }
      } catch {
        // Invalid JSON, use defaults
      }
      return defaultPreferences;
    },
  );

  // re-check periodically to catch midnight rollovers
  useEffect(() => {
    const check = () => {
      const current = getActiveEvent();
      setActiveEvent(current);
      setNextEvent(current ? null : getNextEvent());
    };

    const interval = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Storage might be full or disabled
    }
  }, [preferences]);

  const setEventThemingDisabled = useCallback((disabled: boolean) => {
    setPreferences((prev) => ({ ...prev, eventThemingDisabled: disabled }));
  }, []);

  const isEventThemeActive = useMemo(
    () => activeEvent !== null && !preferences.eventThemingDisabled,
    [activeEvent, preferences.eventThemingDisabled],
  );

  return {
    activeEvent,
    nextEvent,
    isEventThemeActive,
    eventThemingDisabled: preferences.eventThemingDisabled,
    setEventThemingDisabled,
  };
}

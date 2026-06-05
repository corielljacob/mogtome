import { useState, useEffect, useCallback } from "react";

// touch capability never changes mid-session, so detect once at module load
const HAS_TOUCH =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/**
 * Detect mobile by viewport width; default breakpoint matches Tailwind's md (768px).
 * Seeds from matchMedia so mobile doesn't flash the desktop layout on first render.
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

export function useHasTouch(): boolean {
  return HAS_TOUCH;
}

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return reducedMotion;
}

export function useHapticFeedback() {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // vibration not supported or blocked
      }
    }
  }, []);

  const lightTap = useCallback(() => vibrate(10), [vibrate]);
  const mediumTap = useCallback(() => vibrate(20), [vibrate]);
  const heavyTap = useCallback(() => vibrate([30, 10, 30]), [vibrate]);
  const success = useCallback(() => vibrate([10, 50, 20]), [vibrate]);
  const error = useCallback(() => vibrate([50, 30, 50, 30, 50]), [vibrate]);

  return { vibrate, lightTap, mediumTap, heavyTap, success, error };
}

/** Lock body scroll while a modal/sheet is open. */
export function useLockBodyScroll(lock: boolean): void {
  useEffect(() => {
    if (!lock) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPosition = window.getComputedStyle(document.body).position;
    const scrollY = window.scrollY;

    // position:fixed + top offset preserves scroll position while locked
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.position = originalPosition;
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [lock]);
}

/**
 * Read the safe-area inset CSS vars. Insets only change on device rotation, so
 * this listens for orientation changes rather than every resize.
 */
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const updateInsets = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      setInsets({
        top: parseInt(
          computedStyle.getPropertyValue("--safe-area-inset-top") || "0",
          10,
        ),
        right: parseInt(
          computedStyle.getPropertyValue("--safe-area-inset-right") || "0",
          10,
        ),
        bottom: parseInt(
          computedStyle.getPropertyValue("--safe-area-inset-bottom") || "0",
          10,
        ),
        left: parseInt(
          computedStyle.getPropertyValue("--safe-area-inset-left") || "0",
          10,
        ),
      });
    };

    updateInsets();

    const orientationQuery = window.matchMedia("(orientation: portrait)");
    orientationQuery.addEventListener("change", updateInsets);

    return () => orientationQuery.removeEventListener("change", updateInsets);
  }, []);

  return insets;
}

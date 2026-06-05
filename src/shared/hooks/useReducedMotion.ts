import { useState, useEffect } from "react";

/**
 * Reduced-motion preference from the `reduce-motion` class (set by
 * AccessibilityContext) OR the system media query. Works without the provider,
 * falling back to the system preference.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;

    if (document.documentElement.classList.contains("reduce-motion")) {
      return true;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = () => {
      const hasReduceMotionClass =
        document.documentElement.classList.contains("reduce-motion");
      const systemPrefers = mediaQuery.matches;
      setPrefersReducedMotion(hasReduceMotionClass || systemPrefers);
    };

    mediaQuery.addEventListener("change", updateMotionPreference);

    // also react to the class toggling (AccessibilityContext)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "class") {
          updateMotionPreference();
          break;
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
      observer.disconnect();
    };
  }, []);

  return prefersReducedMotion;
}

/** Framer Motion props that disable animation when reduced motion is preferred. */
export function getReducedMotionProps(prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    return {
      transition: { duration: 0 },
      initial: false,
    };
  }
  return {};
}

import { useState, useEffect } from 'react';

/**
 * Hook to detect if reduced motion is preferred.
 * 
 * Checks both:
 * 1. The `reduce-motion` class on documentElement (set by AccessibilityContext)
 * 2. The system `prefers-reduced-motion` media query
 * 
 * This can be used outside of AccessibilityProvider (falls back to system preference).
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    // Check for our custom class first
    if (document.documentElement.classList.contains('reduce-motion')) {
      return true;
    }
    
    // Fall back to system preference
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    // Watch for system preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const updateMotionPreference = () => {
      // Check our custom class first, then system preference
      const hasReduceMotionClass = document.documentElement.classList.contains('reduce-motion');
      const systemPrefers = mediaQuery.matches;
      setPrefersReducedMotion(hasReduceMotionClass || systemPrefers);
    };

    // Listen for system preference changes
    mediaQuery.addEventListener('change', updateMotionPreference);
    
    // Also watch for class changes on documentElement (from AccessibilityContext)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          updateMotionPreference();
          break;
        }
      }
    });
    
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      mediaQuery.removeEventListener('change', updateMotionPreference);
      observer.disconnect();
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Get motion props that respect reduced motion preferences.
 * Use this to conditionally disable Framer Motion animations.
 * 
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * const motionProps = getMotionProps(prefersReducedMotion);
 * 
 * <motion.div
 *   initial={motionProps.initial}
 *   animate={motionProps.animate}
 *   {...(!prefersReducedMotion && { 
 *     whileHover: { scale: 1.05 },
 *     transition: { duration: 0.3 }
 *   })}
 * />
 */
export function getReducedMotionProps(prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    return {
      // Disable all animations by setting duration to 0
      transition: { duration: 0 },
      // Skip initial animations
      initial: false,
    };
  }
  return {};
}

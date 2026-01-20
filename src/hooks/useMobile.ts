import { useState, useEffect, useCallback } from 'react';

/**
 * useIsMobile - Hook to detect mobile devices based on viewport width
 * Uses the md breakpoint (768px) to match Tailwind's responsive design
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia(`(max-width: ${breakpoint}px)`).matches);
    };
    
    checkMobile();
    
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    mediaQuery.addEventListener('change', checkMobile);
    
    return () => mediaQuery.removeEventListener('change', checkMobile);
  }, [breakpoint]);
  
  return isMobile;
}

/**
 * useHasTouch - Hook to detect if device has touch capability
 * Useful for enabling/disabling touch-specific features
 */
export function useHasTouch(): boolean {
  const [hasTouch, setHasTouch] = useState(false);
  
  useEffect(() => {
    setHasTouch(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
  }, []);
  
  return hasTouch;
}

/**
 * useReducedMotion - Hook to detect user's motion preferences
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return reducedMotion;
}

/**
 * useHapticFeedback - Hook to trigger haptic feedback on supported devices
 * Falls back to visual feedback on devices without haptic support
 */
export function useHapticFeedback() {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Vibration not supported or blocked
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

/**
 * useLockBodyScroll - Hook to lock body scroll (useful for modals/sheets)
 */
export function useLockBodyScroll(lock: boolean): void {
  useEffect(() => {
    if (!lock) return;
    
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPosition = window.getComputedStyle(document.body).position;
    const scrollY = window.scrollY;
    
    // Lock scroll while preserving scroll position
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.position = originalPosition;
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [lock]);
}

/**
 * useSafeAreaInsets - Hook to get safe area inset values
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
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0', 10),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0', 10),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0', 10),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0', 10),
      });
    };
    
    updateInsets();
    window.addEventListener('resize', updateInsets);
    
    return () => window.removeEventListener('resize', updateInsets);
  }, []);
  
  return insets;
}

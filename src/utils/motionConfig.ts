/**
 * Motion Configuration Utilities
 * 
 * PERFORMANCE: Optimizes Framer Motion animations for mobile devices
 * - Reduces animation complexity on low-powered devices
 * - Disables expensive effects on mobile
 * - Provides simplified variants for better performance
 */

import type { Transition, Variants } from 'motion/react';

// Detect if device is likely mobile/low-powered
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  
  // Check if touch device
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check viewport width (mobile typically < 768px)
  const isSmallScreen = window.innerWidth < 768;
  
  return isTouch && isSmallScreen;
};

// Detect if device prefers reduced motion
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get optimized transition config based on device capabilities
 * Mobile devices get simpler, faster transitions
 */
export function getOptimizedTransition(
  desktopTransition: Transition = { duration: 0.3 },
  mobileTransition?: Transition
): Transition {
  if (prefersReducedMotion()) {
    return { duration: 0.001 };
  }
  
  if (isMobile()) {
    return mobileTransition || {
      ...desktopTransition,
      duration: (desktopTransition.duration as number) * 0.7, // 30% faster on mobile
    };
  }
  
  return desktopTransition;
}

/**
 * Create motion variants optimized for mobile
 * Reduces scale/rotate/complex transforms on mobile devices
 */
export function createOptimizedVariants(variants: Variants): Variants {
  if (prefersReducedMotion()) {
    // No animation for reduced motion
    return Object.keys(variants).reduce((acc, key) => ({
      ...acc,
      [key]: {
        ...(typeof variants[key] === 'object' ? variants[key] : {}),
        transition: { duration: 0 },
      },
    }), {});
  }

  if (!isMobile()) {
    return variants;
  }

  // Simplify animations for mobile
  return Object.keys(variants).reduce((acc, key) => {
    const variant = variants[key];
    if (typeof variant !== 'object') return { ...acc, [key]: variant };

    return {
      ...acc,
      [key]: {
        ...variant,
        // Remove expensive transforms on mobile
        scale: variant.scale ? 1 : undefined,
        rotate: variant.rotate ? 0 : undefined,
        // Keep simple transforms
        opacity: variant.opacity,
        x: variant.x,
        y: variant.y,
        // Faster transitions
        transition: {
          ...(variant.transition as Transition),
          duration: ((variant.transition as Transition)?.duration as number || 0.3) * 0.7,
        },
      },
    };
  }, {});
}

/**
 * Simplified motion props for hover effects
 * Disables hover animations on touch devices (they don't work well anyway)
 */
export function getHoverProps(hoverScale: number = 1.05) {
  if (isMobile() || prefersReducedMotion()) {
    return {};
  }

  return {
    whileHover: { scale: hoverScale },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  };
}

/**
 * Get animation delay multiplier based on device
 * Reduces stagger delays on mobile for faster perceived performance
 */
export function getDelayMultiplier(): number {
  if (prefersReducedMotion()) return 0;
  if (isMobile()) return 0.5; // 2x faster stagger on mobile
  return 1;
}

/**
 * Check if complex animations should be enabled
 * Returns false on mobile or reduced motion preference
 */
export function shouldUseComplexAnimations(): boolean {
  return !isMobile() && !prefersReducedMotion();
}

/**
 * Get layout animation props
 * Disables layout animations on mobile (expensive)
 */
export function getLayoutProps() {
  if (isMobile() || prefersReducedMotion()) {
    return {};
  }

  return {
    layout: true,
    layoutId: undefined, // Can be overridden
  };
}

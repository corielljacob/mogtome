// tones down Framer Motion on mobile / low-powered devices

import type { Transition, Variants } from "motion/react";

const isMobile = () => {
  if (typeof window === "undefined") return false;

  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // mobile is typically < 768px
  const isSmallScreen = window.innerWidth < 768;

  return isTouch && isSmallScreen;
};

/** cached at module load; gate expensive effects (backdrop-blur, glow) on this to avoid re-checks in render */
export const IS_MOBILE: boolean = isMobile();

const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export function getOptimizedTransition(
  desktopTransition: Transition = { duration: 0.3 },
  mobileTransition?: Transition,
): Transition {
  if (prefersReducedMotion()) {
    return { duration: 0.001 };
  }

  if (isMobile()) {
    return (
      mobileTransition || {
        ...desktopTransition,
        duration: (desktopTransition.duration as number) * 0.7, // 30% faster on mobile
      }
    );
  }

  return desktopTransition;
}

/** drops scale/rotate/complex transforms on mobile */
export function createOptimizedVariants(variants: Variants): Variants {
  if (prefersReducedMotion()) {
    return Object.keys(variants).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          ...(typeof variants[key] === "object" ? variants[key] : {}),
          transition: { duration: 0 },
        },
      }),
      {},
    );
  }

  if (!isMobile()) {
    return variants;
  }

  return Object.keys(variants).reduce((acc, key) => {
    const variant = variants[key];
    if (typeof variant !== "object") return { ...acc, [key]: variant };

    return {
      ...acc,
      [key]: {
        ...variant,
        // drop expensive transforms, keep the cheap ones
        scale: variant.scale ? 1 : undefined,
        rotate: variant.rotate ? 0 : undefined,
        opacity: variant.opacity,
        x: variant.x,
        y: variant.y,
        transition: {
          ...(variant.transition as Transition),
          duration:
            (((variant.transition as Transition)?.duration as number) || 0.3) *
            0.7,
        },
      },
    };
  }, {});
}

/** hover doesn't work well on touch devices, so skip it there */
export function getHoverProps(hoverScale: number = 1.05) {
  if (isMobile() || prefersReducedMotion()) {
    return {};
  }

  return {
    whileHover: { scale: hoverScale },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
  };
}

/** shorter stagger on mobile for snappier perceived load */
export function getDelayMultiplier(): number {
  if (prefersReducedMotion()) return 0;
  if (isMobile()) return 0.5; // 2x faster stagger on mobile
  return 1;
}

export function shouldUseComplexAnimations(): boolean {
  return !isMobile() && !prefersReducedMotion();
}

/** layout animations are expensive, so skip them on mobile */
export function getLayoutProps() {
  if (isMobile() || prefersReducedMotion()) {
    return {};
  }

  return {
    layout: true,
    layoutId: undefined, // Can be overridden
  };
}

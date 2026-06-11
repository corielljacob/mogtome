// Mobile / low-power device detection, cached at module load so callers can gate
// expensive effects (glows, particles) without re-checking in render.
//
// NOTE: this file used to hold Framer Motion tuning helpers. Framer Motion was
// removed app-wide (its mount/unmount churned the iOS Safari compositor and
// banded the safe-area edges), so only the device flag remains.

const isMobile = () => {
  if (typeof window === "undefined") return false;

  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  // mobile is typically < 768px
  const isSmallScreen = window.innerWidth < 768;

  return isTouch && isSmallScreen;
};

/** cached at module load; gate expensive effects (glow, particles) on this */
export const IS_MOBILE: boolean = isMobile();

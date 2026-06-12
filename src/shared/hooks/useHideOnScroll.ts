import { useState, useEffect, useRef } from "react";

interface Options {
  /** Stay revealed until scrolled past this many px from the top (default 72). */
  revealAbove?: number;
  /** Min scroll delta before flipping direction - ignores iOS rubber-band jitter
   *  (default 6). */
  delta?: number;
  /** When false the result is pinned to `false` (never hide) - pass the user's
   *  reduced-motion preference here. Default true. */
  enabled?: boolean;
}

/**
 * Auto-hide-on-scroll. Returns `hidden` = true while the user scrolls DOWN, and
 * false while scrolling UP or near the top - the headroom.js pattern for a
 * floating header.
 *
 * Watches the document (window) scroll: the app scrolls the document natively
 * (see App.tsx / base.css), so there is no inner scroll container to attach to.
 * The caller animates the hide with a CSS transform on an always-mounted element
 * (never mount/unmount - that churns the iOS Safari compositor and bands the
 * safe-area edges; see ScrollToTopButton).
 */
export function useHideOnScroll({
  revealAbove = 72,
  delta = 6,
  enabled = true,
}: Options = {}): boolean {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    // Disabled (e.g. reduced motion): attach no listener. The hook returns false
    // below so the header stays pinned - no setState here, since calling it
    // synchronously in an effect triggers cascading renders.
    if (!enabled) return;

    lastY.current = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);

      // near the top: always reveal (and don't let the header hide the first row)
      if (y < revealAbove) {
        setHidden(false);
        lastY.current = y;
        return;
      }

      const diff = y - lastY.current;
      if (Math.abs(diff) < delta) return; // accumulate tiny moves until they matter
      setHidden(diff > 0); // scrolling down -> hide, up -> reveal
      lastY.current = y;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [revealAbove, delta, enabled]);

  return enabled ? hidden : false;
}

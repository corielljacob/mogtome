import { useEffect, type RefObject } from "react";

interface Options {
  /** When false the element is pinned fully revealed (transform cleared) - pass
   *  the user's reduced-motion preference here. Default true. */
  enabled?: boolean;
}

// Extra px past the element's box so its drop-shadow clears the top edge too,
// otherwise a faint shadow line peeks while it's "hidden".
const SHADOW_CLEARANCE = 28;

/**
 * Scroll-linked header reveal - no transition, no animation. Translates `ref` up
 * as the user scrolls DOWN and back down as they scroll UP, tracking the scroll
 * delta 1:1 and clamped to a range: fully revealed at its rest spot (offset 0) ..
 * fully hidden just above the top edge. So it rides off-screen with the content,
 * parks just above the viewport, and rides back in on scroll-up, stopping exactly
 * at its rest position - the "fixed within a range" feel.
 *
 * Drives the transform imperatively (no React state) so it follows every frame
 * without re-rendering. The transform MUST live on this inner element, never on a
 * fixed ancestor: a transform/translate on a fixed element promotes it to an iOS
 * Safari compositor layer and bands the safe-area edge (see Navbar). At rest the
 * transform is cleared entirely, so no lingering layer.
 */
export function useScrollReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { enabled = true }: Options = {},
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!enabled) {
      el.style.transform = "";
      return;
    }

    let offset = 0; // current hide distance in px (0 = fully revealed)
    let lastY = Math.max(0, window.scrollY);
    let maxHide = 0;
    let frame = 0;

    // Distance to park it fully above the top edge = the element's bottom (its
    // distance from the viewport top at rest) plus shadow clearance. Measured with
    // the transform cleared so the current offset doesn't skew the reading.
    const measure = () => {
      const prev = el.style.transform;
      el.style.transform = "";
      maxHide = Math.ceil(el.getBoundingClientRect().bottom) + SHADOW_CLEARANCE;
      el.style.transform = prev;
      // a shrunk range can leave the old offset out of bounds
      offset = Math.min(offset, maxHide);
    };

    const apply = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;
      lastY = y;
      // pinned fully revealed at the very top; otherwise track the scroll 1:1
      offset = y <= 0 ? 0 : Math.min(maxHide, Math.max(0, offset + delta));
      el.style.transform = offset > 0 ? `translateY(${-offset}px)` : "";
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (frame) window.cancelAnimationFrame(frame);
      el.style.transform = "";
    };
  }, [ref, enabled]);
}

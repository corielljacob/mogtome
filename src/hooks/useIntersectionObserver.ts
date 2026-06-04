import { useEffect, useState, useRef } from "react";
import type { RefObject } from "react";

interface IntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  /** Only trigger once when element enters viewport (default: false) */
  triggerOnce?: boolean;
}

/**
 * Tracks whether an element is in the viewport, for lazy-loading and deferring
 * off-screen work.
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  elementRef: RefObject<T | null>,
  options: IntersectionObserverOptions = {},
): boolean {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0px",
    triggerOnce = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // in triggerOnce mode, never re-observe after the first hit
    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);

        if (isVisible && triggerOnce) {
          hasTriggered.current = true;
        }
      },
      { threshold, root, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, triggerOnce]);

  return isIntersecting;
}

/** Lazy-load an image once it nears the viewport. */
export function useLazyImage<T extends Element = HTMLImageElement>(
  options: IntersectionObserverOptions = {},
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const shouldLoad = useIntersectionObserver(ref, {
    ...options,
    triggerOnce: true,
    rootMargin: options.rootMargin || "50px", // start loading just before it scrolls in
  });

  return [ref, shouldLoad];
}

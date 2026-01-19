import { useEffect, useState, useRef } from 'react';
import type { RefObject } from 'react';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  /** Only trigger once when element enters viewport (default: false) */
  triggerOnce?: boolean;
}

/**
 * useIntersectionObserver - Performance hook for detecting when an element is visible
 * 
 * PERFORMANCE BENEFITS:
 * - Lazy load images/content when they enter viewport
 * - Defer expensive animations until element is visible
 * - Reduce initial bundle size by code-splitting below-fold content
 * - Improve mobile performance by not rendering off-screen content
 * 
 * @example
 * ```tsx
 * const ref = useRef(null);
 * const isVisible = useIntersectionObserver(ref, { threshold: 0.1, triggerOnce: true });
 * 
 * return (
 *   <div ref={ref}>
 *     {isVisible && <ExpensiveComponent />}
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  elementRef: RefObject<T | null>,
  options: IntersectionObserverOptions = {}
): boolean {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    triggerOnce = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Skip if already triggered and triggerOnce is enabled
    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);

        if (isVisible && triggerOnce) {
          hasTriggered.current = true;
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, triggerOnce]);

  return isIntersecting;
}

/**
 * useLazyImage - Hook for lazy loading images with intersection observer
 * 
 * @example
 * ```tsx
 * const [ref, shouldLoad] = useLazyImage<HTMLImageElement>();
 * 
 * return (
 *   <img 
 *     ref={ref}
 *     src={shouldLoad ? actualSrc : placeholderSrc}
 *     loading="lazy"
 *   />
 * );
 * ```
 */
export function useLazyImage<T extends Element = HTMLImageElement>(
  options: IntersectionObserverOptions = {}
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const shouldLoad = useIntersectionObserver(ref, {
    ...options,
    triggerOnce: true,
    rootMargin: options.rootMargin || '50px', // Start loading slightly before visible
  });

  return [ref, shouldLoad];
}

import { useEffect, useRef } from 'react';

interface UseElasticScrollOptions {
  /** Whether elastic scroll is enabled (default: true) */
  enabled?: boolean;
  /** Maximum overscroll distance in pixels (default: 80) */
  maxOverscroll?: number;
  /** Resistance factor - higher = harder to pull (default: 2.5) */
  resistance?: number;
  /** Spring back duration in ms (default: 300) */
  springDuration?: number;
}

/**
 * useElasticScroll - Adds iOS-style rubber band bounce to Android devices.
 * 
 * Only applies at the BOTTOM of the page (top is handled by pull-to-refresh).
 * On iOS, this is native behavior so we skip it.
 */
export function useElasticScroll({
  enabled = true,
  maxOverscroll = 80,
  resistance = 2.5,
  springDuration = 300,
}: UseElasticScrollOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isAtBottom = useRef(false);
  const isPulling = useRef(false);
  
  useEffect(() => {
    // Only apply on Android (iOS has native bounce)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS || !enabled) return;
    
    const getScrollInfo = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      
      return {
        isAtBottom: scrollTop + clientHeight >= scrollHeight - 1,
      };
    };
    
    const applyTransform = (y: number) => {
      document.body.style.transform = `translateY(${y}px)`;
      document.body.style.transition = 'none';
    };
    
    const springBack = () => {
      document.body.style.transition = `transform ${springDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      document.body.style.transform = 'translateY(0)';
      
      // Clean up after animation
      setTimeout(() => {
        document.body.style.transition = '';
        document.body.style.transform = '';
      }, springDuration);
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      const scrollInfo = getScrollInfo();
      // Only handle bottom bounce (top is handled by pull-to-refresh)
      isAtBottom.current = scrollInfo.isAtBottom;
      
      if (scrollInfo.isAtBottom) {
        startY.current = e.touches[0].clientY;
        isPulling.current = false;
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isAtBottom.current) return;
      
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;
      
      // Only activate for pulling up at bottom
      const isPullingUp = diff < 0;
      
      if (!isPullingUp) {
        if (isPulling.current) {
          springBack();
          isPulling.current = false;
        }
        return;
      }
      
      isPulling.current = true;
      
      // Apply resistance - pulling becomes harder the further you go
      const absDiff = Math.abs(diff);
      const resistedDiff = -Math.min(
        absDiff / resistance,
        maxOverscroll
      );
      
      // Apply rubber band curve (diminishing returns)
      const rubberBanded = resistedDiff * (1 - Math.abs(resistedDiff) / (maxOverscroll * 2));
      
      applyTransform(rubberBanded);
      
      // Prevent default scroll when overscrolling
      if (absDiff > 10) {
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = () => {
      if (isPulling.current) {
        springBack();
        isPulling.current = false;
      }
      isAtBottom.current = false;
    };
    
    // Use passive: false to allow preventDefault
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      // Clean up any lingering transforms
      document.body.style.transform = '';
      document.body.style.transition = '';
    };
  }, [enabled, maxOverscroll, resistance, springDuration]);
  
  return { containerRef };
}

/**
 * Check if device is iOS (has native bounce)
 */
export function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Check if device is Android
 */
export function isAndroidDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
}

import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePullToRefreshOptions {
  /** Callback when refresh is triggered */
  onRefresh: () => Promise<void>;
  /** Distance in pixels to trigger refresh (default: 80) */
  threshold?: number;
  /** Whether pull-to-refresh is enabled (default: true) */
  enabled?: boolean;
}

interface UsePullToRefreshReturn {
  /** Current pull distance in pixels (0 when not pulling) */
  pullDistance: number;
  /** Whether currently refreshing */
  isRefreshing: boolean;
  /** Whether user is actively pulling */
  isPulling: boolean;
  /** Progress percentage (0-100) based on threshold */
  progress: number;
  /** Ref to attach to the scrollable container */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * usePullToRefresh - Native-like pull-to-refresh gesture hook.
 * 
 * Provides a smooth, spring-based pull-to-refresh experience that feels
 * native on mobile devices.
 * 
 * Usage:
 * ```tsx
 * const { pullDistance, isRefreshing, progress, containerRef } = usePullToRefresh({
 *   onRefresh: async () => {
 *     await refetch();
 *   }
 * });
 * ```
 */
export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  enabled = true,
}: UsePullToRefreshOptions): UsePullToRefreshReturn {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  
  const progress = Math.min((pullDistance / threshold) * 100, 100);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only enable when at top of page
    if (window.scrollY > 0 || isRefreshing || !enabled) return;
    
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    setIsPulling(true);
  }, [isRefreshing, enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || isRefreshing || !enabled) return;
    
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;
    
    // Only allow pulling down, not up
    if (diff < 0) {
      setPullDistance(0);
      return;
    }
    
    // Apply resistance - pulling becomes harder the further you pull
    const resistance = 0.5;
    const adjustedDiff = diff * resistance;
    
    // Cap at 1.5x threshold for visual feedback
    const maxPull = threshold * 1.5;
    const finalDiff = Math.min(adjustedDiff, maxPull);
    
    setPullDistance(finalDiff);
    
    // Prevent default scrolling when pulling
    if (finalDiff > 0 && window.scrollY === 0) {
      e.preventDefault();
    }
  }, [isPulling, isRefreshing, enabled, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || !enabled) return;
    
    setIsPulling(false);
    
    // Trigger refresh if past threshold
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      
      // Keep showing the indicator during refresh
      setPullDistance(threshold);
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      // Spring back
      setPullDistance(0);
    }
  }, [isPulling, enabled, pullDistance, threshold, isRefreshing, onRefresh]);

  useEffect(() => {
    if (!enabled) return;
    
    // Use passive: false to allow preventDefault
    const options: AddEventListenerOptions = { passive: false };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, options);
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    pullDistance,
    isRefreshing,
    isPulling,
    progress,
    containerRef,
  };
}

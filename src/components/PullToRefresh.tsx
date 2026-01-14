import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

interface PullToRefreshProps {
  children: ReactNode;
  /** Called when refresh is triggered - should return a promise */
  onRefresh?: () => Promise<void>;
  /** Whether PTR is enabled (default: true) */
  enabled?: boolean;
  /** Pull distance needed to trigger refresh (default: 80) */
  threshold?: number;
}

/**
 * PullToRefresh - A container component that adds native-style pull-to-refresh.
 */
export function PullToRefresh({ 
  children, 
  onRefresh,
  enabled = true,
  threshold = 80,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentPull = useRef(0);
  const isPulling = useRef(false);
  
  // Motion value for the pull distance
  const pullY = useMotionValue(0);
  
  // ALL useTransform hooks must be called unconditionally at the top level
  const indicatorOpacity = useTransform(pullY, [0, 20, threshold], [0, 0.6, 1]);
  const indicatorY = useTransform(pullY, [0, threshold], [-30, 8]);
  const indicatorScale = useTransform(pullY, [0, threshold], [0.5, 1]);
  const progressOffset = useTransform(pullY, [0, threshold], [2 * Math.PI * 9, 0]);
  const arrowRotation = useTransform(pullY, [0, threshold], [0, 180]);
  
  // Animate to a value with spring physics
  const animateTo = useCallback((value: number) => {
    animate(pullY, value, {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    });
  }, [pullY]);

  // Use native event listeners to properly handle preventDefault
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (!enabled || isRefreshing) return;
      
      // Only track if at top of page
      if (window.scrollY <= 0) {
        startY.current = e.touches[0].clientY;
        currentPull.current = 0;
        isPulling.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!enabled || isRefreshing) return;
      if (startY.current === 0) return;
      
      const scrollTop = window.scrollY;
      const touchY = e.touches[0].clientY;
      const diff = touchY - startY.current;
      
      // Only activate if at top and pulling down
      if (scrollTop <= 0 && diff > 0) {
        if (!isPulling.current && diff > 5) {
          isPulling.current = true;
        }
        
        if (isPulling.current) {
          // Rubber band resistance - gets harder to pull
          const resistance = Math.max(0.3, 0.55 - (diff / 800));
          const resistedPull = diff * resistance;
          const maxPull = threshold * 1.6;
          const finalPull = Math.min(resistedPull, maxPull);
          
          currentPull.current = finalPull;
          pullY.set(finalPull);
          setIsReady(finalPull >= threshold);
          
          // Only preventDefault if the event is cancelable
          // (it won't be cancelable if the browser has already started scrolling)
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      } else if (isPulling.current && scrollTop > 0) {
        // User scrolled away from top
        isPulling.current = false;
        currentPull.current = 0;
        setIsReady(false);
        animateTo(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling.current && !isRefreshing) {
        startY.current = 0;
        return;
      }
      
      const wasReady = currentPull.current >= threshold;
      isPulling.current = false;
      startY.current = 0;
      
      if (wasReady && onRefresh && !isRefreshing) {
        // Trigger refresh - hold at a smaller position
        setIsRefreshing(true);
        setIsReady(false);
        animateTo(50);
        
        try {
          await onRefresh();
        } catch (err) {
          console.error('Refresh failed:', err);
        }
        
        // Reset after refresh completes
        setIsRefreshing(false);
        currentPull.current = 0;
        animateTo(0);
      } else {
        // Spring back
        setIsReady(false);
        currentPull.current = 0;
        animateTo(0);
      }
    };

    // Add event listeners with passive: false to allow preventDefault
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [enabled, isRefreshing, threshold, onRefresh, pullY, animateTo]);

  return (
    <div 
      ref={containerRef}
      className="relative"
    >
      {/* Pull indicator - iOS-style positioned below navbar */}
      <motion.div 
        className="fixed left-0 right-0 flex flex-col items-center pointer-events-none z-40"
        style={{ 
          top: 'calc(env(safe-area-inset-top, 0px) + 3rem + 0.75rem)',
          y: indicatorY,
          opacity: indicatorOpacity,
        }}
      >
        <motion.div
          className={`
            relative w-10 h-10 rounded-full
            bg-[var(--bento-card)] 
            shadow-lg
            border flex items-center justify-center
            transition-colors duration-150
            ${isReady || isRefreshing 
              ? 'border-[var(--bento-primary)]/40 shadow-[var(--bento-primary)]/20' 
              : 'border-[var(--bento-border)]'
            }
          `}
          style={{ scale: indicatorScale }}
        >
          {/* Subtle glow when ready */}
          {(isReady || isRefreshing) && (
            <motion.div 
              className="absolute inset-0 rounded-full bg-[var(--bento-primary)]/15 blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          
          {isRefreshing ? (
            // iOS-style spinner
            <motion.svg 
              className="w-5 h-5 text-[var(--bento-primary)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle 
                cx="12" cy="12" r="9" 
                stroke="currentColor" 
                strokeOpacity="0.15"
                strokeWidth="2"
              />
              <path
                d="M12 3a9 9 0 0 1 9 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </motion.svg>
          ) : (
            // Progress circle with arrow
            <div className="relative w-5 h-5">
              <svg className="w-5 h-5 -rotate-90" viewBox="0 0 24 24">
                {/* Background track */}
                <circle 
                  cx="12" cy="12" r="9" 
                  fill="none"
                  stroke="var(--bento-border)" 
                  strokeWidth="2"
                />
                {/* Progress arc */}
                <motion.circle 
                  cx="12" cy="12" r="9" 
                  fill="none"
                  className={isReady ? 'stroke-[var(--bento-primary)]' : 'stroke-[var(--bento-text-muted)]'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 9}
                  style={{ strokeDashoffset: progressOffset }}
                />
              </svg>
              
              {/* Arrow or checkmark in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isReady ? (
                  <motion.svg 
                    className="w-3 h-3 text-[var(--bento-primary)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <path 
                      d="M5 13l4 4L19 7" 
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                ) : (
                  <motion.svg 
                    className="w-2.5 h-2.5 text-[var(--bento-text-muted)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ rotate: arrowRotation }}
                  >
                    <path 
                      d="M12 5v14M5 12l7-7 7 7" 
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </div>
            </div>
          )}
        </motion.div>
        
        {/* "Release to refresh" label - compact iOS style */}
        {isReady && !isRefreshing && (
          <motion.span
            className="mt-1.5 text-[11px] font-soft font-semibold text-[var(--bento-primary)]"
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            Release
          </motion.span>
        )}
        
        {/* Loading text */}
        {isRefreshing && (
          <motion.span
            className="mt-1.5 text-[11px] font-soft font-medium text-[var(--bento-text-muted)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Updating...
          </motion.span>
        )}
      </motion.div>
      
      {/* Content wrapper - this is what moves */}
      <motion.div style={{ y: pullY }}>
        {children}
      </motion.div>
    </div>
  );
}

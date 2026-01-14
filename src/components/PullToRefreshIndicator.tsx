import { motion } from 'motion/react';
import { RefreshCw, Sparkles } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  progress: number;
  threshold?: number;
}

/**
 * PullToRefreshIndicator - Visual feedback for pull-to-refresh gesture.
 * 
 * Shows a moogle-themed indicator that:
 * - Appears as user pulls down
 * - Spins when refreshing
 * - Fades out when complete
 */
export function PullToRefreshIndicator({
  pullDistance,
  isRefreshing,
  progress,
  threshold = 80,
}: PullToRefreshIndicatorProps) {
  if (pullDistance <= 0 && !isRefreshing) return null;

  const isReady = pullDistance >= threshold;
  const scale = Math.min(pullDistance / threshold, 1);
  const rotation = (pullDistance / threshold) * 180;

  return (
    <motion.div
      className="pull-to-refresh-indicator"
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: Math.min(pullDistance / 2, 40),
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div
        className={`
          flex items-center justify-center gap-2
          px-4 py-2 rounded-full
          bg-[var(--bento-card)] border 
          shadow-lg shadow-[var(--bento-primary)]/10
          ${isReady || isRefreshing 
            ? 'border-[var(--bento-primary)]/30' 
            : 'border-[var(--bento-border)]'
          }
        `}
        animate={{ scale }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <motion.div
          animate={isRefreshing ? { rotate: 360 } : { rotate: rotation }}
          transition={isRefreshing 
            ? { duration: 1, repeat: Infinity, ease: 'linear' }
            : { type: 'spring', stiffness: 200 }
          }
        >
          <RefreshCw 
            className={`w-5 h-5 transition-colors ${
              isReady || isRefreshing 
                ? 'text-[var(--bento-primary)]' 
                : 'text-[var(--bento-text-muted)]'
            }`} 
          />
        </motion.div>
        
        <span className={`text-sm font-soft font-medium transition-colors ${
          isReady || isRefreshing 
            ? 'text-[var(--bento-primary)]' 
            : 'text-[var(--bento-text-muted)]'
        }`}>
          {isRefreshing ? 'Refreshing...' : isReady ? 'Release to refresh' : 'Pull to refresh'}
        </span>
        
        {(isReady || isRefreshing) && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            <Sparkles className="w-4 h-4 text-[var(--bento-secondary)]" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Progress ring (subtle) */}
      <svg 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-30"
        width="80" 
        height="80" 
        viewBox="0 0 80 80"
      >
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="var(--bento-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 36}`}
          strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
          transform="rotate(-90 40 40)"
          className="transition-all duration-100"
        />
      </svg>
    </motion.div>
  );
}

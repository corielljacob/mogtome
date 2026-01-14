import { memo } from 'react';
import { Sparkles, Star } from 'lucide-react';

/**
 * Floating sparkle/star decorations for ambient page effects.
 * Positioned around edges to avoid overlapping center content.
 * 
 * PERFORMANCE: Uses CSS animations instead of Framer Motion for infinite loops.
 */

export interface SparklePosition {
  left: string;
  top: string;
  size?: string;
  color?: string;
}

export interface FloatingSparklesProps {
  /** Custom sparkle positions. Uses default layout if not provided. */
  positions?: SparklePosition[];
  /** Whether to use a minimal set of sparkles */
  minimal?: boolean;
}

const defaultPositions: SparklePosition[] = [
  { left: '5%', top: '12%', size: 'w-4 h-4', color: 'text-[var(--bento-primary)]' },
  { left: '92%', top: '18%', size: 'w-5 h-5', color: 'text-[var(--bento-secondary)]' },
  { left: '8%', top: '75%', size: 'w-4 h-4', color: 'text-[var(--bento-secondary)]' },
  { left: '88%', top: '70%', size: 'w-5 h-5', color: 'text-[var(--bento-primary)]' },
  { left: '15%', top: '45%', size: 'w-3 h-3', color: 'text-[var(--bento-accent)]' },
  { left: '18%', top: '88%', size: 'w-4 h-4', color: 'text-[var(--bento-accent)]' },
  { left: '82%', top: '85%', size: 'w-3 h-3', color: 'text-[var(--bento-primary)]' },
  { left: '3%', top: '35%', size: 'w-4 h-4', color: 'text-[var(--bento-secondary)]' },
];

const minimalPositions: SparklePosition[] = [
  { left: '8%', top: '25%', size: 'w-4 h-4', color: 'text-[var(--bento-primary)]' },
  { left: '92%', top: '18%', size: 'w-4 h-4', color: 'text-[var(--bento-secondary)]' },
  { left: '12%', top: '65%', size: 'w-4 h-4', color: 'text-[var(--bento-secondary)]' },
  { left: '88%', top: '72%', size: 'w-4 h-4', color: 'text-[var(--bento-primary)]' },
];

export const FloatingSparkles = memo(function FloatingSparkles({ 
  positions, 
  minimal = false 
}: FloatingSparklesProps) {
  const sparkles = positions ?? (minimal ? minimalPositions : defaultPositions);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle, i) => (
        <div
          key={i}
          className="absolute animate-float-sparkle will-change-transform"
          style={{ 
            left: sparkle.left, 
            top: sparkle.top,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + i * 0.3}s`,
          }}
        >
          {i % 3 === 0 ? (
            <Star className={`${sparkle.size ?? 'w-4 h-4'} ${sparkle.color ?? 'text-[var(--bento-primary)]'} fill-current`} />
          ) : (
            <Sparkles className={`${sparkle.size ?? 'w-4 h-4'} ${sparkle.color ?? 'text-[var(--bento-primary)]'}`} />
          )}
        </div>
      ))}
    </div>
  );
});

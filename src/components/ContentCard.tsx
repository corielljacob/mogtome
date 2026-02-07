import type { ReactNode } from 'react';
import { IS_MOBILE } from '../utils';

/**
 * Styled content wrapper card.
 * Used for main content sections with consistent styling.
 *
 * PERFORMANCE: Colored shadows are only shown on desktop to avoid
 * expensive GPU compositing that causes jank on lower-powered devices.
 */

export interface ContentCardProps {
  children: ReactNode;
  className?: string;
  /** ARIA role for the card */
  role?: string;
  /** Whether the card content is loading */
  'aria-busy'?: boolean;
  /** ARIA live region behavior */
  'aria-live'?: 'polite' | 'assertive' | 'off';
}

export function ContentCard({ 
  children, 
  className = '', 
  role, 
  'aria-busy': ariaBusy,
  'aria-live': ariaLive,
}: ContentCardProps) {
  return (
    <div 
      className={`
        bg-[var(--bento-card)]/80
        ${IS_MOBILE ? '' : 'shadow-lg shadow-[var(--bento-primary)]/10'}
        border border-[var(--bento-primary)]/10
        rounded-2xl p-4 sm:p-6 md:p-8 
        ${IS_MOBILE ? 'shadow-sm' : ''}
        ${className}
      `}
      role={role}
      aria-busy={ariaBusy}
      aria-live={ariaLive}
    >
      {children}
    </div>
  );
}

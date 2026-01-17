import type { ReactNode } from 'react';

/**
 * Styled content wrapper card with glassmorphism effect.
 * Used for main content sections with consistent styling.
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
        bg-[var(--bento-card)]/80 backdrop-blur-sm 
        border border-[var(--bento-primary)]/10
        rounded-2xl p-4 sm:p-6 md:p-8 
        shadow-lg shadow-[var(--bento-primary)]/5 
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

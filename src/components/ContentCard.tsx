import type { ReactNode } from 'react';

/**
 * Styled content wrapper card with glassmorphism effect.
 * Used for main content sections with consistent styling.
 */

export interface ContentCardProps {
  children: ReactNode;
  className?: string;
}

export function ContentCard({ children, className = '' }: ContentCardProps) {
  return (
    <div className={`
      bg-[var(--bento-card)]/80 backdrop-blur-sm 
      border border-[var(--bento-primary)]/10
      rounded-2xl p-6 md:p-8 
      shadow-lg shadow-[var(--bento-primary)]/5 
      ${className}
    `}>
      {children}
    </div>
  );
}

/**
 * Decorative hand-drawn style divider for storybook aesthetic.
 * Used across pages for visual section breaks.
 */

export interface StoryDividerProps {
  /** Additional CSS classes */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-48 md:w-64 h-5',
  md: 'w-56 md:w-72 h-6',
  lg: 'w-64 md:w-80 h-7',
};

export function StoryDivider({ className = '', size = 'md' }: StoryDividerProps) {
  return (
    <svg 
      viewBox="0 0 200 20" 
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <path 
        d="M10 10 Q 30 5, 50 10 T 90 10 T 130 10 T 170 10 T 190 10" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        className="text-[var(--bento-primary)]/50"
      />
      {/* Decorative dots */}
      <circle cx="100" cy="10" r="4" className="fill-[var(--bento-secondary)]" />
      <circle cx="78" cy="8" r="2.5" className="fill-[var(--bento-primary)]/60" />
      <circle cx="122" cy="8" r="2.5" className="fill-[var(--bento-primary)]/60" />
      <circle cx="58" cy="10" r="1.5" className="fill-[var(--bento-secondary)]/50" />
      <circle cx="142" cy="10" r="1.5" className="fill-[var(--bento-secondary)]/50" />
    </svg>
  );
}

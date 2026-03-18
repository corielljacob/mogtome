/**
 * Elegant decorative divider — botanical vine motif.
 * A delicate center ornament flanked by gentle trailing lines
 * with small leaf and dot accents.
 */

export interface StoryDividerProps {
  /** Additional CSS classes */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-48 md:w-64 h-6',
  md: 'w-56 md:w-72 h-7',
  lg: 'w-64 md:w-80 h-8',
};

export function StoryDivider({ className = '', size = 'md' }: StoryDividerProps) {
  return (
    <svg 
      viewBox="0 0 200 24" 
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      aria-hidden="true"
    >
      {/* Left trailing line */}
      <path 
        d="M8 12 C 30 12, 40 12, 80 12" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeLinecap="round"
        className="text-[var(--border)]"
      />
      {/* Right trailing line */}
      <path 
        d="M120 12 C 160 12, 170 12, 192 12" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeLinecap="round"
        className="text-[var(--border)]"
      />

      {/* Left leaf accent */}
      <path 
        d="M72 12 C 72 8, 78 7, 80 10" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeLinecap="round"
        className="text-[var(--secondary)]/40"
      />
      {/* Right leaf accent (mirrored) */}
      <path 
        d="M128 12 C 128 8, 122 7, 120 10" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeLinecap="round"
        className="text-[var(--secondary)]/40"
      />

      {/* Center ornament — diamond with inner gem */}
      <g transform="translate(100, 12) rotate(45)">
        <rect x="-4.5" y="-4.5" width="9" height="9" rx="2" className="fill-[var(--primary)]/12" />
        <rect x="-2.5" y="-2.5" width="5" height="5" rx="1.5" className="fill-[var(--primary)]/25" />
      </g>

      {/* Small accent dots flanking center */}
      <circle cx="87" cy="12" r="1.5" className="fill-[var(--primary)]/20" />
      <circle cx="113" cy="12" r="1.5" className="fill-[var(--primary)]/20" />
      <circle cx="82" cy="12" r="1" className="fill-[var(--accent)]/15" />
      <circle cx="118" cy="12" r="1" className="fill-[var(--accent)]/15" />
    </svg>
  );
}

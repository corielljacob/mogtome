import { type ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  /**
   * CSS color for the border + label (and dot). Accepts design tokens
   * (e.g. 'var(--primary)', 'var(--warning)') or a raw hex/rgb value
   * (e.g. a per-rank color). Omit for a neutral, muted tag.
   */
  color?: string;
  /** Optional small leading icon — inherits the tag color via currentColor. */
  icon?: ReactNode;
  /** Show a small leading dot in the tag color. Ignored if `icon` is set. */
  dot?: boolean;
  className?: string;
}

/**
 * Tag — a quiet, hand-labeled tag.
 *
 * Hairline border + label in a single semantic color, no fill. Intentionally
 * NOT a filled rounded-full pill — that "badge" look reads generic. Used for
 * ranks, statuses, counts, and small labels across the app.
 */
export function Tag({ children, color, icon, dot = false, className = '' }: TagProps) {
  const tone = color ?? 'var(--text-muted)';
  const borderColor = color
    ? `color-mix(in srgb, ${color} 45%, transparent)`
    : 'var(--border)';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-xs font-soft font-medium leading-none whitespace-nowrap ${className}`}
      style={{ color: tone, borderColor }}
    >
      {icon ? (
        <span className="shrink-0 inline-flex items-center" aria-hidden="true">
          {icon}
        </span>
      ) : dot ? (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: tone }}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </span>
  );
}

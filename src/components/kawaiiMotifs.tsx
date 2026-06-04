import { memo } from "react";

/**
 * Kawaii sticker-book motifs — tiny decorative SVGs (star, sparkle, heart, bow).
 *
 * All use `fill: currentColor`, so tint them with a `text-[...]` class or an
 * inline `color`. Decorative only (aria-hidden). Sprinkle sparingly.
 */

interface MotifProps {
  className?: string;
  /** Optional inline color (otherwise inherits currentColor). */
  color?: string;
}

const svgProps = (className: string) => ({
  viewBox: "0 0 24 24",
  fill: "currentColor" as const,
  className,
  "aria-hidden": true as const,
  focusable: false as const,
});

/** Chunky rounded 5-point star (kira). */
export const KawaiiStar = memo(function KawaiiStar({
  className = "",
  color,
}: MotifProps) {
  return (
    <svg {...svgProps(className)} style={color ? { color } : undefined}>
      <path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.13 5.11c.08.2.27.33.47.35l5.52.44c.5.04.7.66.32.99l-4.2 3.6a.56.56 0 0 0-.19.56l1.29 5.38c.11.49-.42.88-.84.61l-4.73-2.88a.56.56 0 0 0-.58 0l-4.73 2.88c-.42.27-.95-.12-.84-.61l1.29-5.38a.56.56 0 0 0-.19-.56l-4.2-3.6c-.38-.33-.18-.95.32-.99l5.52-.44c.2-.02.39-.15.47-.35L11.48 3.5Z" />
    </svg>
  );
});

/** Four-point twinkle / sparkle. */
export const KawaiiSparkle = memo(function KawaiiSparkle({
  className = "",
  color,
}: MotifProps) {
  return (
    <svg {...svgProps(className)} style={color ? { color } : undefined}>
      <path d="M12 2.5c.4 0 .74.28.83.66l.86 3.6c.2.83.84 1.47 1.67 1.67l3.6.86a.86.86 0 0 1 0 1.66l-3.6.86c-.83.2-1.47.84-1.67 1.67l-.86 3.6a.86.86 0 0 1-1.66 0l-.86-3.6a2.14 2.14 0 0 0-1.67-1.67l-3.6-.86a.86.86 0 0 1 0-1.66l3.6-.86c.83-.2 1.47-.84 1.67-1.67l.86-3.6c.09-.38.43-.66.83-.66Z" />
    </svg>
  );
});

/** Soft heart. */
export const KawaiiHeart = memo(function KawaiiHeart({
  className = "",
  color,
}: MotifProps) {
  return (
    <svg {...svgProps(className)} style={color ? { color } : undefined}>
      <path d="M12 21s-6.7-4.2-9.2-8.4C1.1 9.7 2.4 6.2 5.6 5.8c1.9-.24 4 .9 6.4 3.5 2.4-2.6 4.5-3.74 6.4-3.5 3.2.4 4.5 3.9 2.8 6.8C18.7 16.8 12 21 12 21Z" />
    </svg>
  );
});

/** Cute bow / ribbon. */
export const KawaiiBow = memo(function KawaiiBow({
  className = "",
  color,
}: MotifProps) {
  return (
    <svg {...svgProps(className)} style={color ? { color } : undefined}>
      <path d="M11 12 4.6 8.2c-.7-.4-1.6.1-1.6.9v5.8c0 .8.9 1.3 1.6.9L11 12Zm2 0 6.4-3.8c.7-.4 1.6.1 1.6.9v5.8c0 .8-.9 1.3-1.6.9L13 12Z" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  );
});

/** Puffy fluffy cloud — overlapping bumps that merge into a soft cloud. */
export const KawaiiCloud = memo(function KawaiiCloud({
  className = "",
  color,
}: MotifProps) {
  return (
    <svg
      viewBox="0 0 144 88"
      fill="currentColor"
      className={className}
      style={color ? { color } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      {/* Cute, symmetric puff — a soft wide base with a gentle three-bump top */}
      <ellipse cx="72" cy="64" rx="62" ry="17" />
      <circle cx="44" cy="50" r="22" />
      <circle cx="72" cy="40" r="28" />
      <circle cx="100" cy="50" r="22" />
    </svg>
  );
});

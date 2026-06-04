import type { ReactNode } from "react";

/**
 * Styled content wrapper card.
 *
 * The single cozy card base: `.surface` provides the card background, hairline
 * border, 24px radius, soft `--panel-shadow` and a warm top glow. Do not layer
 * extra rounded-/border-/shadow- utilities on top (see docs/DESIGN.md).
 */

export interface ContentCardProps {
  children: ReactNode;
  className?: string;
  /** ARIA role for the card */
  role?: string;
  /** Whether the card content is loading */
  "aria-busy"?: boolean;
  /** ARIA live region behavior */
  "aria-live"?: "polite" | "assertive" | "off";
}

export function ContentCard({
  children,
  className = "",
  role,
  "aria-busy": ariaBusy,
  "aria-live": ariaLive,
}: ContentCardProps) {
  return (
    <div
      className={`
        relative isolate surface
        p-4 sm:p-6 md:p-8
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

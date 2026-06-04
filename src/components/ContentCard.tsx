import type { ReactNode } from "react";

/**
 * `.surface` is the single card base: background, hairline border, 24px radius,
 * soft `--panel-shadow`, warm top glow. Don't layer extra rounded-/border-/
 * shadow- utilities on top (see docs/DESIGN.md).
 */

export interface ContentCardProps {
  children: ReactNode;
  className?: string;
  role?: string;
  "aria-busy"?: boolean;
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

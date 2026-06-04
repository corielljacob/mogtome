import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface ProfileSectionProps {
  icon: LucideIcon;
  title: string;
  /** Accent color (hex or token) for the sticker icon badge + pin */
  accent: string;
  /** Pushpin color (defaults to the accent) */
  pinColor?: string;
  /** Slight rotation, degrees, for the scrapbook feel */
  tilt?: number;
  /** Optional right-aligned header control (e.g. an edit button) */
  action?: ReactNode;
  children: ReactNode;
}

// shared primitive for every profile section (mirrors Settings' card: pinned
// paper + surface with a sticker header) so the page stays consistent as it grows
export function ProfileSection({
  icon: Icon,
  title,
  accent,
  pinColor,
  tilt = 0,
  action,
  children,
}: ProfileSectionProps) {
  return (
    <section
      className="paper relative"
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      <span
        className="pushpin absolute -top-2 left-8 z-10"
        style={{ "--pin": pinColor ?? accent } as CSSProperties}
        aria-hidden="true"
      />
      <div className="surface p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <span
            className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
            style={{
              backgroundColor: `color-mix(in srgb, ${accent} 18%, var(--card))`,
              border: `2px solid color-mix(in srgb, ${accent} 32%, var(--card))`,
            }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: accent }}
              aria-hidden="true"
            />
          </span>
          <h2 className="font-display font-bold text-lg text-[var(--text)]">
            {title}
          </h2>
          {action && <div className="ml-auto">{action}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}

import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface ProfileSectionProps {
  icon: LucideIcon;
  title: string;
  /** Accent color (hex or token) for the section icon's paper backing */
  accent: string;
  /** Slight rotation, degrees, for the scrapbook feel */
  tilt?: number;
  /** Optional right-aligned header control (e.g. an edit button) */
  action?: ReactNode;
  children: ReactNode;
}

// A small paper note on the shared inner-page sheet.
export function ProfileSection({
  icon: Icon,
  title,
  accent,
  tilt = 0,
  action,
  children,
}: ProfileSectionProps) {
  return (
    <section
      className="profile-section"
      style={
        {
          "--profile-section-accent": accent,
          "--profile-section-tilt": `${tilt}deg`,
        } as CSSProperties
      }
    >
      <div className="profile-section-heading">
        <span className="profile-section-icon" aria-hidden="true">
          <Icon className="w-5 h-5" />
        </span>
        <h2>{title}</h2>
        {action && <div className="profile-section-action">{action}</div>}
      </div>
      <div className="profile-section-body">{children}</div>
    </section>
  );
}

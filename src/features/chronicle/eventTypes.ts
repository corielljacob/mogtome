import type { ComponentType } from "react";
import {
  MemberJoinedStamp,
  MemberRejoinedStamp,
  NameChangedStamp,
  RankPromotedStamp,
  AnnouncementStamp,
  ChronicleEventStamp,
  type ChronicleSvgProps,
} from "./ChronicleIcons";

export interface EventTypeConfig {
  Icon: ComponentType<ChronicleSvgProps>;
  color: string;
  bgColor: string;
  /** CSS color (hex or token) for hairline tags / cozy tinting */
  hex: string;
  label: string;
}

// keys match the backend's PascalCase type values
export const EVENT_TYPE_CONFIG: Record<string, EventTypeConfig> = {
  MemberJoined: {
    Icon: MemberJoinedStamp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    hex: "color-mix(in srgb, var(--scene-leaf) 75%, var(--nook-ink))",
    label: "Member Joined",
  },
  MemberRejoined: {
    Icon: MemberRejoinedStamp,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    hex: "color-mix(in srgb, var(--scene-roof) 65%, var(--nook-ink))",
    label: "Welcome Back",
  },
  NameChanged: {
    Icon: NameChangedStamp,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    hex: "color-mix(in srgb, var(--scene-book-blue) 70%, var(--nook-ink))",
    label: "Name Changed",
  },
  RankPromoted: {
    Icon: RankPromotedStamp,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    hex: "color-mix(in srgb, var(--scene-gold) 55%, var(--nook-ink))",
    label: "Rank Up!",
  },
  Announcement: {
    Icon: AnnouncementStamp,
    color: "text-[var(--primary)]",
    bgColor: "bg-[var(--primary)]/10",
    hex: "color-mix(in srgb, var(--scene-rose) 55%, var(--nook-ink))",
    label: "Announcement",
  },
};

/** fallback for unknown event types */
export const DEFAULT_EVENT_TYPE_CONFIG: EventTypeConfig = {
  Icon: ChronicleEventStamp,
  color: "text-[var(--text-muted)]",
  bgColor: "bg-[var(--bg)]",
  hex: "var(--nook-ink)",
  label: "Event",
};

export function getEventTypeConfig(type: string): EventTypeConfig {
  return EVENT_TYPE_CONFIG[type] ?? DEFAULT_EVENT_TYPE_CONFIG;
}

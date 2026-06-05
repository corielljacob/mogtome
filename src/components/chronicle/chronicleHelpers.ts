import type { ComponentType } from "react";
import {
  KawaiiStar,
  KawaiiHeart,
  KawaiiSparkle,
  KawaiiBow,
} from "@/components/kawaiiMotifs";
import type { ChronicleEvent } from "@/types";

const PLACEHOLDER_TIMESTAMP = 0;
const PLACEHOLDER_CREATION_TIME = "1970-01-01T00:00:00Z";

export function hasValidId(event: ChronicleEvent): boolean {
  return (
    event.id.timestamp !== PLACEHOLDER_TIMESTAMP ||
    event.id.creationTime !== PLACEHOLDER_CREATION_TIME
  );
}

// dedup key for events that lack a real ID
export function getEventSignature(event: ChronicleEvent): string {
  return `${event.createdAt}-${event.type}-${event.text}`;
}

export function getEventKey(event: ChronicleEvent, index: number): string {
  if (hasValidId(event)) {
    return `${event.id.timestamp}-${event.id.creationTime}`;
  }
  // placeholder IDs collide, so disambiguate with the index
  return `${getEventSignature(event)}-${index}`;
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function getDayKey(dateString: string): string {
  const d = new Date(dateString);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// Today / Yesterday / weekday / full date
function getDayLabel(dateString: string): string {
  const d = new Date(dateString);
  const now = new Date();
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / 86_400_000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString("en-US", { weekday: "long" });
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  if (d.getFullYear() !== now.getFullYear()) opts.year = "numeric";
  return d.toLocaleDateString("en-US", opts);
}

export interface EntryItem {
  event: ChronicleEvent;
  isRealtime: boolean;
  isUnseen: boolean;
}

export interface DayGroup {
  key: string;
  label: string;
  items: EntryItem[];
}

// input must already be newest-first; preserves that order within each group
export function buildDayGroups(items: EntryItem[]): DayGroup[] {
  const groups: DayGroup[] = [];
  const index = new Map<string, DayGroup>();
  for (const item of items) {
    const key = getDayKey(item.event.createdAt);
    let group = index.get(key);
    if (!group) {
      group = { key, label: getDayLabel(item.event.createdAt), items: [] };
      index.set(key, group);
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}

type Motif = ComponentType<{ className?: string; color?: string }>;
const DAY_STICKERS: Motif[] = [
  KawaiiHeart,
  KawaiiSparkle,
  KawaiiBow,
  KawaiiStar,
];
const STICKER_COLORS = ["var(--primary)", "var(--secondary)", "var(--accent)"];

// hashed off the day key so the look is stable across re-renders
export function dayDecor(key: string, index: number) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return {
    tilt: ((h % 5) - 2) * 1.1, // ~ -2.2 .. 2.2 deg
    Sticker: DAY_STICKERS[index % DAY_STICKERS.length],
    tapeColor: STICKER_COLORS[h % STICKER_COLORS.length],
    stickerColor: STICKER_COLORS[(h >> 3) % STICKER_COLORS.length],
  };
}

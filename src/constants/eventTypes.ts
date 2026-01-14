import type { LucideIcon } from 'lucide-react';
import {
  PartyPopper,
  HeartHandshake,
  Wand2,
  Crown,
  Scroll,
  Sparkles,
} from 'lucide-react';

/**
 * Configuration for event type display (icon, colors).
 */
export interface EventTypeConfig {
  Icon: LucideIcon;
  color: string;
  bgColor: string;
  label: string;
}

/**
 * Map of event types to their display configuration.
 * Keys match the backend's PascalCase type values.
 */
export const EVENT_TYPE_CONFIG: Record<string, EventTypeConfig> = {
  MemberJoined: { 
    Icon: PartyPopper, 
    color: 'text-green-500', 
    bgColor: 'bg-green-500/10',
    label: 'Member Joined',
  },
  MemberRejoined: { 
    Icon: HeartHandshake, 
    color: 'text-emerald-500', 
    bgColor: 'bg-emerald-500/10',
    label: 'Welcome Back',
  },
  NameChanged: { 
    Icon: Wand2, 
    color: 'text-violet-500', 
    bgColor: 'bg-violet-500/10',
    label: 'Name Changed',
  },
  RankPromoted: { 
    Icon: Crown, 
    color: 'text-amber-500', 
    bgColor: 'bg-amber-500/10',
    label: 'Rank Up!',
  },
  Announcement: { 
    Icon: Scroll, 
    color: 'text-[var(--bento-primary)]', 
    bgColor: 'bg-[var(--bento-primary)]/10',
    label: 'Announcement',
  },
};

/**
 * Default configuration for unknown event types.
 */
export const DEFAULT_EVENT_TYPE_CONFIG: EventTypeConfig = {
  Icon: Sparkles,
  color: 'text-[var(--bento-text-muted)]',
  bgColor: 'bg-[var(--bento-bg)]',
  label: 'Event',
};

/**
 * Get the display configuration for an event type.
 */
export function getEventTypeConfig(type: string): EventTypeConfig {
  return EVENT_TYPE_CONFIG[type] ?? DEFAULT_EVENT_TYPE_CONFIG;
}

// ─────────────────────────────────────────────────────────────────────────────
// FFXIV Seasonal Events
// Defines all seasonal events with date ranges, theme overrides, and
// home page customizations. Events automatically activate based on the
// current date and layer on top of the user's chosen color theme.
// ─────────────────────────────────────────────────────────────────────────────

import type { LucideIcon } from 'lucide-react';
import {
  Sparkles, Star, Gift,
  Heart, Flower,
  Flower2, Ribbon,
  Egg, Rabbit,
  Coins, CircleDollarSign, Dices,
  Sun, Waves, Shell,
  Flame, Gem,
  Ghost, Skull, Moon, FlameKindling,
  Snowflake, TreePine,
} from 'lucide-react';

/** Unique identifier for each seasonal event */
export type SeasonalEventId =
  | 'heavensturn'
  | 'valentiones'
  | 'little-ladies'
  | 'hatching-tide'
  | 'make-it-rain'
  | 'moonfire-faire'
  | 'the-rising'
  | 'all-saints-wake'
  | 'starlight';

/** Date range for an event (month is 1-indexed: January = 1) */
export interface EventDateRange {
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

/** Preview colors for the event theme picker / indicator */
export interface EventThemePreview {
  primary: string;
  secondary: string;
  accent: string;
}

/** Decorative particle configuration for the home page */
export interface EventParticle {
  /** Lucide icon component to render */
  icon: LucideIcon;
  /** Color for the particle icon */
  color: string;
  /** Number of particles */
  count: number;
  /** Min size in px */
  minSize: number;
  /** Max size in px */
  maxSize: number;
  /** Min opacity (0-1) */
  minOpacity: number;
  /** Max opacity (0-1) */
  maxOpacity: number;
}

/** Home page atmosphere configuration during an event */
export interface EventAtmosphere {
  /** CSS gradient for the fixed background overlay */
  backgroundGradient: string;
  /** Center glow color (CSS value with alpha) */
  centerGlowFrom: string;
  centerGlowVia: string;
  /** Fairy light color palette */
  fairyLightColors: string[];
  /** Warm mote color palette */
  moteColors: string[];
}

/** Full definition of a seasonal event */
export interface SeasonalEvent {
  id: SeasonalEventId;
  /** Display name */
  name: string;
  /** Short tagline shown on the home page */
  tagline: string;
  /** Longer description for settings / tooltips */
  description: string;
  /** Lucide icon component representing this event */
  icon: LucideIcon;
  /** When the event is active */
  dateRange: EventDateRange;
  /** Theme preview colors */
  preview: EventThemePreview;
  /** Kupo quotes specific to this event */
  kupoQuotes: string[];
  /** Decorative particles for the home page */
  particles: EventParticle[];
  /** Home page atmosphere overrides */
  atmosphere: EventAtmosphere;
  /** CSS class applied to <html> when event is active */
  cssClass: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Event Definitions
// ─────────────────────────────────────────────────────────────────────────────

export const SEASONAL_EVENTS: SeasonalEvent[] = [
  // ── Heavensturn (January) ─────────────────────────────────────────────────
  {
    id: 'heavensturn',
    name: 'Heavensturn',
    tagline: 'A new year dawns in Eorzea',
    description: 'Held in celebration of the New Year, inspired by the Chinese Zodiac animal of the coming year.',
    icon: Sparkles,
    dateRange: { startMonth: 1, startDay: 1, endMonth: 1, endDay: 15 },
    preview: { primary: '#DC2626', secondary: '#D97706', accent: '#FBBF24' },
    kupoQuotes: [
      "Happy New Year, kupo!",
      "May fortune smile on you, kupo~",
      "A fresh start awaits, kupo!",
      "Let's celebrate together, kupo~",
      "New year, new adventures, kupo!",
      "The stars align for you, kupo~",
      "Wishing you prosperity, kupo!",
      "May your year be blessed, kupo~",
    ],
    particles: [
      { icon: Sparkles, color: '#DC2626', count: 4, minSize: 16, maxSize: 28, minOpacity: 0.15, maxOpacity: 0.35 },
      { icon: Gift, color: '#D97706', count: 3, minSize: 14, maxSize: 22, minOpacity: 0.12, maxOpacity: 0.30 },
      { icon: Star, color: '#FBBF24', count: 5, minSize: 10, maxSize: 16, minOpacity: 0.20, maxOpacity: 0.45 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(220,38,38,0.06), rgba(217,119,6,0.03), rgba(251,191,36,0.05))',
      centerGlowFrom: 'rgba(220,38,38,0.08)',
      centerGlowVia: 'rgba(251,191,36,0.04)',
      fairyLightColors: ['rgba(220,38,38,0.45)', 'rgba(251,191,36,0.50)', 'rgba(217,119,6,0.40)'],
      moteColors: ['rgba(220,38,38,0.30)', 'rgba(251,191,36,0.25)', 'rgba(217,119,6,0.28)'],
    },
    cssClass: 'event-heavensturn',
  },

  // ── Valentione's Day (February) ───────────────────────────────────────────
  {
    id: 'valentiones',
    name: "Valentione's Day",
    tagline: 'Love fills the air in Eorzea',
    description: "The Valentine's event is held every year to celebrate love and romance.",
    icon: Heart,
    dateRange: { startMonth: 2, startDay: 1, endMonth: 2, endDay: 15 },
    preview: { primary: '#E11D48', secondary: '#DB2777', accent: '#FB7185' },
    kupoQuotes: [
      "Happy Valentione's, kupo!",
      "Love is in the air, kupo~",
      "You make my pom-pom flutter, kupo!",
      "Sending you warm wishes, kupo~",
      "Cupid's arrow strikes, kupo!",
      "Be my valentione, kupo~",
      "Love conquers all, kupo!",
      "Sweet as chocolate, kupo~",
    ],
    particles: [
      { icon: Heart, color: '#E11D48', count: 4, minSize: 14, maxSize: 24, minOpacity: 0.15, maxOpacity: 0.35 },
      { icon: Heart, color: '#FB7185', count: 3, minSize: 12, maxSize: 20, minOpacity: 0.12, maxOpacity: 0.30 },
      { icon: Sparkles, color: '#FECDD3', count: 4, minSize: 10, maxSize: 14, minOpacity: 0.20, maxOpacity: 0.40 },
      { icon: Flower, color: '#DB2777', count: 2, minSize: 14, maxSize: 22, minOpacity: 0.10, maxOpacity: 0.25 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(225,29,72,0.06), rgba(219,39,119,0.03), rgba(251,113,133,0.05))',
      centerGlowFrom: 'rgba(225,29,72,0.08)',
      centerGlowVia: 'rgba(251,113,133,0.04)',
      fairyLightColors: ['rgba(225,29,72,0.45)', 'rgba(251,113,133,0.50)', 'rgba(219,39,119,0.40)'],
      moteColors: ['rgba(225,29,72,0.28)', 'rgba(251,113,133,0.25)', 'rgba(219,39,119,0.22)'],
    },
    cssClass: 'event-valentiones',
  },

  // ── Little Ladies' Day (March) ────────────────────────────────────────────
  {
    id: 'little-ladies',
    name: "Little Ladies' Day",
    tagline: 'Cherry blossoms bloom across the realm',
    description: "A Cherry Blossom-themed event celebrating spring's arrival.",
    icon: Flower2,
    dateRange: { startMonth: 3, startDay: 1, endMonth: 3, endDay: 14 },
    preview: { primary: '#EC4899', secondary: '#F9A8D4', accent: '#FDF2F8' },
    kupoQuotes: [
      "Sakura season, kupo!",
      "How lovely the blossoms, kupo~",
      "A day for little ladies, kupo!",
      "Petals dance in the wind, kupo~",
      "Spring has sprung, kupo!",
      "Beauty is everywhere, kupo~",
      "Grace and elegance, kupo!",
      "Flowers bloom for you, kupo~",
    ],
    particles: [
      { icon: Flower2, color: '#EC4899', count: 6, minSize: 14, maxSize: 24, minOpacity: 0.15, maxOpacity: 0.40 },
      { icon: Flower, color: '#F9A8D4', count: 3, minSize: 12, maxSize: 18, minOpacity: 0.10, maxOpacity: 0.25 },
      { icon: Ribbon, color: '#F472B6', count: 2, minSize: 12, maxSize: 18, minOpacity: 0.10, maxOpacity: 0.25 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(236,72,153,0.05), rgba(249,168,212,0.04), rgba(253,242,248,0.06))',
      centerGlowFrom: 'rgba(236,72,153,0.07)',
      centerGlowVia: 'rgba(249,168,212,0.04)',
      fairyLightColors: ['rgba(236,72,153,0.40)', 'rgba(249,168,212,0.45)', 'rgba(244,114,182,0.35)'],
      moteColors: ['rgba(236,72,153,0.25)', 'rgba(249,168,212,0.22)', 'rgba(253,242,248,0.30)'],
    },
    cssClass: 'event-little-ladies',
  },

  // ── Hatching-tide (April) ─────────────────────────────────────────────────
  {
    id: 'hatching-tide',
    name: 'Hatching-tide',
    tagline: 'Colorful eggs and mischief abound',
    description: 'Easter event, usually involving colorful rabbits of mysterious origin.',
    icon: Egg,
    dateRange: { startMonth: 4, startDay: 1, endMonth: 4, endDay: 14 },
    preview: { primary: '#8B5CF6', secondary: '#34D399', accent: '#FBBF24' },
    kupoQuotes: [
      "Happy Hatching-tide, kupo!",
      "Found any eggs yet, kupo~?",
      "Mysterious rabbits about, kupo!",
      "Spring is full of surprises, kupo~",
      "Egg-cellent adventures, kupo!",
      "The spriggan hid them well, kupo~",
      "Colorful treasures await, kupo!",
      "Hop to it, kupo~!",
    ],
    particles: [
      { icon: Egg, color: '#8B5CF6', count: 4, minSize: 14, maxSize: 22, minOpacity: 0.15, maxOpacity: 0.35 },
      { icon: Rabbit, color: '#34D399', count: 3, minSize: 14, maxSize: 20, minOpacity: 0.12, maxOpacity: 0.28 },
      { icon: Flower, color: '#F472B6', count: 3, minSize: 12, maxSize: 18, minOpacity: 0.10, maxOpacity: 0.25 },
      { icon: Sparkles, color: '#FBBF24', count: 4, minSize: 8, maxSize: 14, minOpacity: 0.18, maxOpacity: 0.40 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(139,92,246,0.05), rgba(52,211,153,0.03), rgba(251,191,36,0.04))',
      centerGlowFrom: 'rgba(139,92,246,0.07)',
      centerGlowVia: 'rgba(52,211,153,0.04)',
      fairyLightColors: ['rgba(139,92,246,0.40)', 'rgba(52,211,153,0.45)', 'rgba(251,191,36,0.40)'],
      moteColors: ['rgba(139,92,246,0.25)', 'rgba(52,211,153,0.22)', 'rgba(251,191,36,0.28)'],
    },
    cssClass: 'event-hatching-tide',
  },

  // ── Make It Rain Campaign (June) ──────────────────────────────────────────
  {
    id: 'make-it-rain',
    name: 'Make It Rain Campaign',
    tagline: 'The Gold Saucer glitters with fortune',
    description: 'Increases MGP earned through activities within the Gold Saucer.',
    icon: Coins,
    dateRange: { startMonth: 6, startDay: 1, endMonth: 6, endDay: 14 },
    preview: { primary: '#EAB308', secondary: '#7C3AED', accent: '#FDE047' },
    kupoQuotes: [
      "Jackpot, kupo!",
      "Lady luck smiles on you, kupo~",
      "The Gold Saucer awaits, kupo!",
      "Feeling lucky, kupo~?",
      "Let it rain MGP, kupo!",
      "Fortune favors the bold, kupo~",
      "Roll the dice, kupo!",
      "Winner winner, kupo dinner~!",
    ],
    particles: [
      { icon: Coins, color: '#EAB308', count: 5, minSize: 12, maxSize: 20, minOpacity: 0.15, maxOpacity: 0.35 },
      { icon: CircleDollarSign, color: '#FDE047', count: 3, minSize: 14, maxSize: 22, minOpacity: 0.12, maxOpacity: 0.28 },
      { icon: Dices, color: '#7C3AED', count: 2, minSize: 14, maxSize: 20, minOpacity: 0.10, maxOpacity: 0.25 },
      { icon: Sparkles, color: '#FBBF24', count: 4, minSize: 10, maxSize: 14, minOpacity: 0.20, maxOpacity: 0.45 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(234,179,8,0.06), rgba(124,58,237,0.03), rgba(253,224,71,0.05))',
      centerGlowFrom: 'rgba(234,179,8,0.08)',
      centerGlowVia: 'rgba(253,224,71,0.04)',
      fairyLightColors: ['rgba(234,179,8,0.50)', 'rgba(253,224,71,0.45)', 'rgba(124,58,237,0.35)'],
      moteColors: ['rgba(234,179,8,0.30)', 'rgba(253,224,71,0.25)', 'rgba(124,58,237,0.22)'],
    },
    cssClass: 'event-make-it-rain',
  },

  // ── Moonfire Faire (August, early) ────────────────────────────────────────
  {
    id: 'moonfire-faire',
    name: 'Moonfire Faire',
    tagline: 'Summer celebrations light up the coast',
    description: 'A celebration of all things Summer, usually involves activities at Costa Del Sol.',
    icon: Sun,
    dateRange: { startMonth: 8, startDay: 1, endMonth: 8, endDay: 18 },
    preview: { primary: '#F97316', secondary: '#0EA5E9', accent: '#FDE68A' },
    kupoQuotes: [
      "Summer vibes, kupo!",
      "Beach day, kupo~!",
      "The fireworks are beautiful, kupo!",
      "Surf's up, kupo~",
      "Costa del Sol awaits, kupo!",
      "Catch the waves, kupo~",
      "Moonfire magic, kupo!",
      "Sizzling summer fun, kupo~!",
    ],
    particles: [
      { icon: Sparkles, color: '#F97316', count: 3, minSize: 16, maxSize: 26, minOpacity: 0.15, maxOpacity: 0.35 },
      { icon: Waves, color: '#0EA5E9', count: 3, minSize: 14, maxSize: 22, minOpacity: 0.12, maxOpacity: 0.28 },
      { icon: Sun, color: '#FBBF24', count: 2, minSize: 14, maxSize: 20, minOpacity: 0.15, maxOpacity: 0.30 },
      { icon: Shell, color: '#FDE68A', count: 2, minSize: 12, maxSize: 18, minOpacity: 0.10, maxOpacity: 0.25 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(249,115,22,0.06), rgba(14,165,233,0.03), rgba(253,230,138,0.05))',
      centerGlowFrom: 'rgba(249,115,22,0.08)',
      centerGlowVia: 'rgba(253,230,138,0.04)',
      fairyLightColors: ['rgba(249,115,22,0.45)', 'rgba(253,230,138,0.50)', 'rgba(14,165,233,0.35)'],
      moteColors: ['rgba(249,115,22,0.28)', 'rgba(253,230,138,0.25)', 'rgba(14,165,233,0.22)'],
    },
    cssClass: 'event-moonfire-faire',
  },

  // ── The Rising (August, late) ─────────────────────────────────────────────
  {
    id: 'the-rising',
    name: 'The Rising',
    tagline: 'Remembering the realm reborn',
    description: 'Held to celebrate the anniversary of A Realm Reborn, usually during the last week of August.',
    icon: Flame,
    dateRange: { startMonth: 8, startDay: 22, endMonth: 8, endDay: 31 },
    preview: { primary: '#EF4444', secondary: '#3B82F6', accent: '#F59E0B' },
    kupoQuotes: [
      "The realm is reborn, kupo!",
      "Remember, reflect, rejoice, kupo~",
      "A tale of heroes, kupo!",
      "The crystal's light guides us, kupo~",
      "Anniversary blessings, kupo!",
      "Hear... Feel... Think, kupo~",
      "For the realm, kupo!",
      "Warriors of Light unite, kupo~!",
    ],
    particles: [
      { icon: Flame, color: '#EF4444', count: 3, minSize: 14, maxSize: 22, minOpacity: 0.15, maxOpacity: 0.30 },
      { icon: Gem, color: '#3B82F6', count: 3, minSize: 12, maxSize: 20, minOpacity: 0.12, maxOpacity: 0.28 },
      { icon: Star, color: '#F59E0B', count: 4, minSize: 10, maxSize: 16, minOpacity: 0.18, maxOpacity: 0.40 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(239,68,68,0.05), rgba(59,130,246,0.03), rgba(245,158,11,0.04))',
      centerGlowFrom: 'rgba(239,68,68,0.07)',
      centerGlowVia: 'rgba(59,130,246,0.04)',
      fairyLightColors: ['rgba(239,68,68,0.45)', 'rgba(59,130,246,0.40)', 'rgba(245,158,11,0.40)'],
      moteColors: ['rgba(239,68,68,0.28)', 'rgba(59,130,246,0.22)', 'rgba(245,158,11,0.25)'],
    },
    cssClass: 'event-the-rising',
  },

  // ── All Saints' Wake (October) — FLAGSHIP EVENT ────────────────────────────
  {
    id: 'all-saints-wake',
    name: "All Saints' Wake",
    tagline: 'Spooky spirits stir in Gridania',
    description: 'Halloween event that usually takes place within Gridania for spooky rewards.',
    icon: Ghost,
    dateRange: { startMonth: 10, startDay: 18, endMonth: 10, endDay: 31 },
    preview: { primary: '#F97316', secondary: '#7C3AED', accent: '#22C55E' },
    kupoQuotes: [
      "Boo, kupo!",
      "Spooky season is here, kupo~",
      "Trick or treat, kupo!",
      "The Continental Circus awaits, kupo~",
      "Don't be scared, kupo!",
      "Ghosts and goblins, kupo~",
      "Happy haunting, kupo!",
      "Something wicked this way, kupo~",
      "The veil is thin tonight, kupo...",
      "Can you hear the whispers, kupo~?",
    ],
    particles: [
      { icon: Skull, color: '#F97316', count: 5, minSize: 16, maxSize: 30, minOpacity: 0.18, maxOpacity: 0.45 },
      { icon: Ghost, color: '#A78BFA', count: 5, minSize: 16, maxSize: 28, minOpacity: 0.15, maxOpacity: 0.40 },
      { icon: Moon, color: '#7C3AED', count: 4, minSize: 14, maxSize: 24, minOpacity: 0.12, maxOpacity: 0.35 },
      { icon: FlameKindling, color: '#FBBF24', count: 3, minSize: 12, maxSize: 18, minOpacity: 0.18, maxOpacity: 0.40 },
      { icon: Sparkles, color: '#22C55E', count: 4, minSize: 10, maxSize: 16, minOpacity: 0.15, maxOpacity: 0.35 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(109,40,217,0.10), rgba(12,8,20,0.06), rgba(249,115,22,0.06))',
      centerGlowFrom: 'rgba(109,40,217,0.10)',
      centerGlowVia: 'rgba(249,115,22,0.05)',
      fairyLightColors: [
        'rgba(249,115,22,0.55)', 'rgba(167,139,250,0.50)', 'rgba(34,197,94,0.35)',
        'rgba(251,191,36,0.40)', 'rgba(124,58,237,0.45)',
      ],
      moteColors: [
        'rgba(167,139,250,0.35)', 'rgba(249,115,22,0.30)', 'rgba(74,222,128,0.22)',
        'rgba(251,191,36,0.28)',
      ],
    },
    cssClass: 'event-all-saints-wake',
  },

  // ── Starlight Celebration (December) — FLAGSHIP EVENT ─────────────────────
  {
    id: 'starlight',
    name: 'Starlight Celebration',
    tagline: 'Warmth and joy fill the winter nights',
    description: 'The festive event which celebrates the winter holidays within Eorzea.',
    icon: TreePine,
    dateRange: { startMonth: 12, startDay: 15, endMonth: 12, endDay: 31 },
    preview: { primary: '#DC2626', secondary: '#16A34A', accent: '#FBBF24' },
    kupoQuotes: [
      "Merry Starlight, kupo!",
      "Jingle bells, kupo~!",
      "The starlight shines bright, kupo!",
      "Cozy by the fire, kupo~",
      "Gifts for everyone, kupo!",
      "Winter wonderland, kupo~",
      "Peace and joy, kupo!",
      "Season's greetings, kupo~!",
      "Warmest wishes, kupo~",
      "The starlight guides us home, kupo!",
    ],
    particles: [
      { icon: Snowflake, color: '#93C5FD', count: 6, minSize: 12, maxSize: 24, minOpacity: 0.18, maxOpacity: 0.50 },
      { icon: Star, color: '#FBBF24', count: 5, minSize: 10, maxSize: 18, minOpacity: 0.22, maxOpacity: 0.55 },
      { icon: TreePine, color: '#16A34A', count: 3, minSize: 16, maxSize: 24, minOpacity: 0.14, maxOpacity: 0.32 },
      { icon: Gift, color: '#DC2626', count: 3, minSize: 14, maxSize: 22, minOpacity: 0.12, maxOpacity: 0.30 },
      { icon: Sparkles, color: '#FDE68A', count: 5, minSize: 8, maxSize: 14, minOpacity: 0.25, maxOpacity: 0.55 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(190,26,26,0.08), rgba(21,128,61,0.05), rgba(217,119,6,0.06))',
      centerGlowFrom: 'rgba(217,119,6,0.10)',
      centerGlowVia: 'rgba(190,26,26,0.05)',
      fairyLightColors: [
        'rgba(220,38,38,0.55)', 'rgba(22,163,74,0.50)', 'rgba(251,191,36,0.55)',
        'rgba(255,255,255,0.40)', 'rgba(220,38,38,0.45)',
      ],
      moteColors: [
        'rgba(251,191,36,0.35)', 'rgba(220,38,38,0.28)', 'rgba(22,163,74,0.25)',
        'rgba(253,230,138,0.30)',
      ],
    },
    cssClass: 'event-starlight',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Checks whether a given date falls within an event's date range.
 * Handles events that don't cross year boundaries (all current events are
 * contained within a single year cycle).
 */
export function isDateInEventRange(date: Date, range: EventDateRange): boolean {
  const month = date.getMonth() + 1; // getMonth() is 0-indexed
  const day = date.getDate();

  // Same month range
  if (range.startMonth === range.endMonth) {
    return month === range.startMonth && day >= range.startDay && day <= range.endDay;
  }

  // Cross-month range (e.g., Dec 15 - Jan 5 — not currently used, but supported)
  if (range.startMonth > range.endMonth) {
    // Wraps around the year
    return (
      (month === range.startMonth && day >= range.startDay) ||
      (month > range.startMonth) ||
      (month < range.endMonth) ||
      (month === range.endMonth && day <= range.endDay)
    );
  }

  // Multi-month range within the same year
  return (
    (month === range.startMonth && day >= range.startDay) ||
    (month > range.startMonth && month < range.endMonth) ||
    (month === range.endMonth && day <= range.endDay)
  );
}

/**
 * Returns the currently active seasonal event, or null if none is active.
 * If multiple events overlap (e.g., Moonfire Faire and The Rising in August),
 * the later-starting event takes priority.
 */
export function getActiveEvent(date: Date = new Date()): SeasonalEvent | null {
  const activeEvents = SEASONAL_EVENTS.filter(event =>
    isDateInEventRange(date, event.dateRange)
  );

  if (activeEvents.length === 0) return null;
  if (activeEvents.length === 1) return activeEvents[0];

  // If multiple events are active, prefer the one that started most recently
  return activeEvents.reduce((latest, current) => {
    const latestStart = latest.dateRange.startMonth * 100 + latest.dateRange.startDay;
    const currentStart = current.dateRange.startMonth * 100 + current.dateRange.startDay;
    return currentStart > latestStart ? current : latest;
  });
}

/**
 * Returns the next upcoming event from the given date.
 * Useful for displaying "next event" countdown info.
 */
export function getNextEvent(date: Date = new Date()): SeasonalEvent | null {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const currentDayOfYear = month * 100 + day;

  // Find events that haven't started yet this year
  const upcoming = SEASONAL_EVENTS
    .filter(event => {
      const eventStart = event.dateRange.startMonth * 100 + event.dateRange.startDay;
      return eventStart > currentDayOfYear;
    })
    .sort((a, b) => {
      const aStart = a.dateRange.startMonth * 100 + a.dateRange.startDay;
      const bStart = b.dateRange.startMonth * 100 + b.dateRange.startDay;
      return aStart - bStart;
    });

  // If there are upcoming events this year, return the nearest one
  if (upcoming.length > 0) return upcoming[0];

  // Otherwise, wrap to the first event of next year
  const sorted = [...SEASONAL_EVENTS].sort((a, b) => {
    const aStart = a.dateRange.startMonth * 100 + a.dateRange.startDay;
    const bStart = b.dateRange.startMonth * 100 + b.dateRange.startDay;
    return aStart - bStart;
  });

  return sorted[0] || null;
}

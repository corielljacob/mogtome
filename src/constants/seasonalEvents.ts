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
    preview: { primary: '#C0392B', secondary: '#C8902C', accent: '#E6B84C' },
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
      { icon: Sparkles, color: '#C0392B', count: 4, minSize: 16, maxSize: 28, minOpacity: 0.15, maxOpacity: 0.35 },
      { icon: Gift, color: '#C8902C', count: 3, minSize: 14, maxSize: 22, minOpacity: 0.12, maxOpacity: 0.30 },
      { icon: Star, color: '#E6B84C', count: 5, minSize: 10, maxSize: 16, minOpacity: 0.20, maxOpacity: 0.45 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(192,57,43,0.06), rgba(200,144,44,0.03), rgba(230,184,76,0.05))',
      centerGlowFrom: 'rgba(192,57,43,0.08)',
      centerGlowVia: 'rgba(230,184,76,0.04)',
      fairyLightColors: ['rgba(192,57,43,0.45)', 'rgba(230,184,76,0.50)', 'rgba(200,144,44,0.40)'],
      moteColors: ['rgba(192,57,43,0.30)', 'rgba(230,184,76,0.25)', 'rgba(200,144,44,0.28)'],
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
    preview: { primary: '#D6325C', secondary: '#D14F8C', accent: '#F08AA0' },
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
      { icon: Heart, color: '#D6325C', count: 4, minSize: 14, maxSize: 24, minOpacity: 0.15, maxOpacity: 0.35 },
      { icon: Heart, color: '#F08AA0', count: 3, minSize: 12, maxSize: 20, minOpacity: 0.12, maxOpacity: 0.30 },
      { icon: Sparkles, color: '#F8CAD6', count: 4, minSize: 10, maxSize: 14, minOpacity: 0.20, maxOpacity: 0.40 },
      { icon: Flower, color: '#D14F8C', count: 2, minSize: 14, maxSize: 22, minOpacity: 0.10, maxOpacity: 0.25 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(214,50,92,0.06), rgba(209,79,140,0.03), rgba(240,138,160,0.05))',
      centerGlowFrom: 'rgba(214,50,92,0.08)',
      centerGlowVia: 'rgba(240,138,160,0.04)',
      fairyLightColors: ['rgba(214,50,92,0.45)', 'rgba(240,138,160,0.50)', 'rgba(209,79,140,0.40)'],
      moteColors: ['rgba(214,50,92,0.28)', 'rgba(240,138,160,0.25)', 'rgba(209,79,140,0.22)'],
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
    preview: { primary: '#E06699', secondary: '#EE9CC0', accent: '#F7D9E6' },
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
      { icon: Flower2, color: '#E06699', count: 6, minSize: 14, maxSize: 24, minOpacity: 0.15, maxOpacity: 0.40 },
      { icon: Flower, color: '#EE9CC0', count: 3, minSize: 12, maxSize: 18, minOpacity: 0.10, maxOpacity: 0.25 },
      { icon: Ribbon, color: '#E58CB8', count: 2, minSize: 12, maxSize: 18, minOpacity: 0.10, maxOpacity: 0.25 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(224,102,153,0.05), rgba(238,156,192,0.04), rgba(247,217,230,0.06))',
      centerGlowFrom: 'rgba(224,102,153,0.07)',
      centerGlowVia: 'rgba(238,156,192,0.04)',
      fairyLightColors: ['rgba(224,102,153,0.40)', 'rgba(238,156,192,0.45)', 'rgba(229,140,184,0.35)'],
      moteColors: ['rgba(224,102,153,0.25)', 'rgba(238,156,192,0.22)', 'rgba(247,217,230,0.30)'],
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
    preview: { primary: '#9B7BE0', secondary: '#52C99A', accent: '#F2C94C' },
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
      { icon: Egg, color: '#9B7BE0', count: 4, minSize: 14, maxSize: 22, minOpacity: 0.15, maxOpacity: 0.35 },
      { icon: Rabbit, color: '#52C99A', count: 3, minSize: 14, maxSize: 20, minOpacity: 0.12, maxOpacity: 0.28 },
      { icon: Flower, color: '#EFA8CE', count: 3, minSize: 12, maxSize: 18, minOpacity: 0.10, maxOpacity: 0.25 },
      { icon: Sparkles, color: '#F2C94C', count: 4, minSize: 8, maxSize: 14, minOpacity: 0.18, maxOpacity: 0.40 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(155,123,224,0.05), rgba(82,201,154,0.03), rgba(242,201,76,0.04))',
      centerGlowFrom: 'rgba(155,123,224,0.07)',
      centerGlowVia: 'rgba(82,201,154,0.04)',
      fairyLightColors: ['rgba(155,123,224,0.40)', 'rgba(82,201,154,0.45)', 'rgba(242,201,76,0.40)'],
      moteColors: ['rgba(155,123,224,0.25)', 'rgba(82,201,154,0.22)', 'rgba(242,201,76,0.28)'],
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
    dateRange: { startMonth: 5, startDay: 29, endMonth: 6, endDay: 24 },
    preview: { primary: '#C8911A', secondary: '#7B45C9', accent: '#F2CE4A' },
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
      { icon: Coins, color: '#C8911A', count: 5, minSize: 12, maxSize: 20, minOpacity: 0.15, maxOpacity: 0.35 },
      { icon: CircleDollarSign, color: '#F2CE4A', count: 3, minSize: 14, maxSize: 22, minOpacity: 0.12, maxOpacity: 0.28 },
      { icon: Dices, color: '#7B45C9', count: 2, minSize: 14, maxSize: 20, minOpacity: 0.10, maxOpacity: 0.25 },
      { icon: Sparkles, color: '#F2CE4A', count: 4, minSize: 10, maxSize: 14, minOpacity: 0.20, maxOpacity: 0.45 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(200,145,26,0.06), rgba(123,69,201,0.03), rgba(242,206,74,0.05))',
      centerGlowFrom: 'rgba(200,145,26,0.08)',
      centerGlowVia: 'rgba(242,206,74,0.04)',
      fairyLightColors: ['rgba(200,145,26,0.50)', 'rgba(242,206,74,0.45)', 'rgba(123,69,201,0.35)'],
      moteColors: ['rgba(200,145,26,0.30)', 'rgba(242,206,74,0.25)', 'rgba(123,69,201,0.22)'],
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
    preview: { primary: '#E8602A', secondary: '#1F95C9', accent: '#F2D27A' },
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
      { icon: Sparkles, color: '#E8602A', count: 3, minSize: 16, maxSize: 26, minOpacity: 0.15, maxOpacity: 0.35 },
      { icon: Waves, color: '#1F95C9', count: 3, minSize: 14, maxSize: 22, minOpacity: 0.12, maxOpacity: 0.28 },
      { icon: Sun, color: '#F2D27A', count: 2, minSize: 14, maxSize: 20, minOpacity: 0.15, maxOpacity: 0.30 },
      { icon: Shell, color: '#F8DE96', count: 2, minSize: 12, maxSize: 18, minOpacity: 0.10, maxOpacity: 0.25 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(232,96,42,0.06), rgba(31,149,201,0.03), rgba(242,210,122,0.05))',
      centerGlowFrom: 'rgba(232,96,42,0.08)',
      centerGlowVia: 'rgba(242,210,122,0.04)',
      fairyLightColors: ['rgba(232,96,42,0.45)', 'rgba(242,210,122,0.50)', 'rgba(31,149,201,0.35)'],
      moteColors: ['rgba(232,96,42,0.28)', 'rgba(242,210,122,0.25)', 'rgba(31,149,201,0.22)'],
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
    preview: { primary: '#C73A35', secondary: '#2E63C4', accent: '#E0A340' },
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
      { icon: Flame, color: '#C73A35', count: 3, minSize: 14, maxSize: 22, minOpacity: 0.15, maxOpacity: 0.30 },
      { icon: Gem, color: '#2E63C4', count: 3, minSize: 12, maxSize: 20, minOpacity: 0.12, maxOpacity: 0.28 },
      { icon: Star, color: '#E0A340', count: 4, minSize: 10, maxSize: 16, minOpacity: 0.18, maxOpacity: 0.40 },
    ],
    atmosphere: {
      backgroundGradient: 'linear-gradient(to bottom, rgba(199,58,53,0.05), rgba(46,99,196,0.03), rgba(224,163,64,0.04))',
      centerGlowFrom: 'rgba(199,58,53,0.07)',
      centerGlowVia: 'rgba(46,99,196,0.04)',
      fairyLightColors: ['rgba(199,58,53,0.45)', 'rgba(46,99,196,0.40)', 'rgba(224,163,64,0.40)'],
      moteColors: ['rgba(199,58,53,0.28)', 'rgba(46,99,196,0.22)', 'rgba(224,163,64,0.25)'],
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

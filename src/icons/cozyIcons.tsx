/**
 * Icon adapter — maps the app's icon API (Lucide-compatible names) to
 * Iconify icons, primarily from the `pepicons-pencil` pack (hand-sketched)
 * with `game-icons` for fantasy/RPG icons that need more illustrative flair.
 *
 * The Vite alias `lucide-react` → this file means every component that
 * `import { Heart } from 'lucide-react'` transparently gets sketchy icons.
 */

import { Icon as IconifyIcon } from '@iconify/react';
import type { ReactElement, SVGAttributes } from 'react';

/* ── Public types (consumed by the rest of the app) ────────────────────────── */

export interface IconProps extends SVGAttributes<SVGElement> {
  /** Accessible title – when absent the icon is aria-hidden */
  title?: string;
  /** Ignored (Lucide compat) */
  strokeWidth?: number;
  /** Phosphor compat – ignored in Iconify but keeps TS happy */
  weight?: string;
  /** Iconify compat — passed through to the underlying icon */
  fill?: string;
  size?: number | string;
}

export type LucideIcon = (props: IconProps) => ReactElement;

/* ── Adapter factory ───────────────────────────────────────────────────────── */

function adapt(displayName: string, iconName: string): LucideIcon {
  const Wrapped = ({ title, strokeWidth: _sw, weight: _w, size, width, height, className, style, ...rest }: IconProps) => {
    // Derive dimensions: explicit size > explicit w/h > CSS-only (via className)
    const w = size ?? width;
    const h = size ?? height;

    return (
      <IconifyIcon
        icon={iconName}
        className={className}
        style={style}
        {...(w != null ? { width: w } : {})}
        {...(h != null ? { height: h } : {})}
        aria-hidden={title ? undefined : true}
        {...(title ? { 'aria-label': title } : {})}
        {...rest}
      />
    );
  };

  Wrapped.displayName = displayName;
  return Wrapped;
}

/* ── Icon exports ──────────────────────────────────────────────────────────── */
/* Primary pack: pepicons-pencil  —  hand-sketched pencil aesthetic ✏️
 * Fallbacks:    game-icons       —  fantasy/RPG illustrated icons
 *               pepicons-pop     —  bubbly variant when pencil lacks coverage
 */

// ── Navigation & UI chrome ────────────────────────────────────────────────
export const Home            = adapt('Home',           'pepicons-pencil:house');
export const Settings        = adapt('Settings',       'pepicons-pencil:gear');
export const Search          = adapt('Search',         'pepicons-pencil:loop');
export const X               = adapt('X',              'pepicons-pencil:times');
export const XCircle         = adapt('XCircle',        'pepicons-pencil:times-circle');
export const ChevronDown     = adapt('ChevronDown',    'pepicons-pencil:angle-down');
export const ChevronUp       = adapt('ChevronUp',      'pepicons-pencil:angle-up');
export const ChevronLeft     = adapt('ChevronLeft',    'pepicons-pencil:angle-left');
export const ChevronRight    = adapt('ChevronRight',   'pepicons-pencil:angle-right');
export const ChevronsLeft    = adapt('ChevronsLeft',   'pepicons-pencil:rewind');
export const ChevronsRight   = adapt('ChevronsRight',  'pepicons-pencil:fast-forward');
export const ArrowRight      = adapt('ArrowRight',     'pepicons-pencil:arrow-right');
export const ArrowLeft       = adapt('ArrowLeft',      'pepicons-pencil:arrow-left');
export const ArrowDown       = adapt('ArrowDown',      'pepicons-pencil:arrow-down');
export const ArrowUpDown     = adapt('ArrowUpDown',    'pepicons-pencil:down-up');
export const ExternalLink    = adapt('ExternalLink',   'pepicons-pencil:open');
export const Check           = adapt('Check',          'pepicons-pencil:checkmark');
export const Info            = adapt('Info',           'pepicons-pencil:info');
export const Filter          = adapt('Filter',         'pepicons-pencil:sliders');
export const SlidersHorizontal = adapt('SlidersHorizontal', 'pepicons-pencil:sliders');
export const Monitor         = adapt('Monitor',        'pepicons-pencil:monitor');
export const Eye             = adapt('Eye',            'pepicons-pencil:eye');

// ── User & people ─────────────────────────────────────────────────────────
export const User            = adapt('User',           'pepicons-pencil:person');
export const UserCircle      = adapt('UserCircle',     'pepicons-pencil:person');
export const Users           = adapt('Users',          'pepicons-pencil:people');
export const LogIn           = adapt('LogIn',          'pepicons-pencil:enter');
export const LogOut          = adapt('LogOut',         'pepicons-pencil:leave');

// ── Content & documents ───────────────────────────────────────────────────
export const BookOpen        = adapt('BookOpen',       'pepicons-pencil:book');
export const FileText        = adapt('FileText',       'pepicons-pencil:file');
export const Scroll          = adapt('Scroll',         'pepicons-pencil:book');
export const Pencil          = adapt('Pencil',         'pepicons-pencil:pen');
export const Quote           = adapt('Quote',          'pepicons-pencil:text-bubble');
export const Send            = adapt('Send',           'pepicons-pencil:paper-plane');
export const Inbox           = adapt('Inbox',          'pepicons-pencil:letter-open');
export const MessageCircle   = adapt('MessageCircle',  'pepicons-pencil:text-bubble');
export const MessageSquare   = adapt('MessageSquare',  'pepicons-pencil:text-bubble');
export const MessageCircleHeart = adapt('MessageCircleHeart', 'pepicons-pencil:text-bubble');

// ── Actions & feedback ────────────────────────────────────────────────────
export const RefreshCw       = adapt('RefreshCw',      'pepicons-pencil:repeat');
export const RotateCcw       = adapt('RotateCcw',      'pepicons-pencil:rewind-time');
export const Play            = adapt('Play',           'pepicons-pencil:play');
export const Loader2         = adapt('Loader2',        'pepicons-pencil:arrows-spin');
export const AlertCircle     = adapt('AlertCircle',    'pepicons-pencil:exclamation-circle');
export const AlertTriangle   = adapt('AlertTriangle',  'pepicons-pencil:exclamation');
export const Ban             = adapt('Ban',            'pepicons-pencil:no-entry');
export const Link2           = adapt('Link2',          'pepicons-pencil:chain');
export const Globe           = adapt('Globe',          'pepicons-pencil:internet');
export const Wifi            = adapt('Wifi',           'pepicons-pencil:wifi');
export const WifiOff         = adapt('WifiOff',        'pepicons-pencil:wifi-off');

// ── Decorative & emotional ────────────────────────────────────────────────
export const Heart           = adapt('Heart',          'pepicons-pencil:heart');
export const HeartHandshake  = adapt('HeartHandshake', 'pepicons-pencil:heart');
export const Star            = adapt('Star',           'pepicons-pencil:star');
export const Stars           = adapt('Stars',          'pepicons-pencil:stars');
export const Sparkles        = adapt('Sparkles',       'pepicons-pencil:stars');
export const Zap             = adapt('Zap',            'pepicons-pencil:electricity');
export const Flame           = adapt('Flame',          'pepicons-pencil:fire');
export const FlameKindling   = adapt('FlameKindling',  'pepicons-pencil:fire');
export const PartyPopper     = adapt('PartyPopper',    'pepicons-pencil:gift');

// ── Fantasy / RPG ─────────────────────────────────────────────────────────
export const Crown           = adapt('Crown',          'pepicons-pencil:crown');
export const Shield          = adapt('Shield',         'pepicons-pencil:shield');
export const Sword           = adapt('Sword',          'pepicons-pencil:sword');
export const Swords          = adapt('Swords',         'pepicons-pencil:swords');
export const Wand2           = adapt('Wand2',          'game-icons:fairy-wand');
export const Gem             = adapt('Gem',            'pepicons-pencil:coins');
export const Compass         = adapt('Compass',        'pepicons-pencil:map');

// ── Nature & animals ──────────────────────────────────────────────────────
export const Leaf            = adapt('Leaf',           'pepicons-pencil:leaf');
export const Flower          = adapt('Flower',         'pepicons-pencil:flower');
export const Flower2         = adapt('Flower2',        'pepicons-pencil:flower-bud');
export const TreePine        = adapt('TreePine',       'pepicons-pencil:tree');
export const Cat             = adapt('Cat',            'game-icons:cat');
export const Bird            = adapt('Bird',           'game-icons:bird-twitter');
export const Rabbit          = adapt('Rabbit',         'game-icons:rabbit');
export const Egg             = adapt('Egg',            'game-icons:egg');
export const Shell           = adapt('Shell',          'game-icons:nautilus-shell');
export const Waves           = adapt('Waves',          'pepicons-pencil:water-drop');

// ── Weather & time ────────────────────────────────────────────────────────
export const Sun             = adapt('Sun',            'pepicons-pencil:sun');
export const Moon            = adapt('Moon',           'pepicons-pencil:moon');
export const Snowflake       = adapt('Snowflake',      'pepicons-pencil:comet');
export const Calendar        = adapt('Calendar',       'pepicons-pencil:calendar');
export const CalendarDays    = adapt('CalendarDays',   'pepicons-pencil:calendar');
export const Clock           = adapt('Clock',          'pepicons-pencil:clock');
export const Ghost           = adapt('Ghost',          'game-icons:ghost');
export const Skull           = adapt('Skull',          'game-icons:skull-crossed-bones');
export const Gift            = adapt('Gift',           'pepicons-pencil:gift');

// ── Accessibility ─────────────────────────────────────────────────────────
export const Accessibility   = adapt('Accessibility',  'pepicons-pencil:person');
export const Contrast        = adapt('Contrast',       'pepicons-pencil:circle-filled');
export const Type            = adapt('Type',           'pepicons-pencil:label');
export const Focus           = adapt('Focus',          'pepicons-pencil:pinpoint');

// ── Financial ─────────────────────────────────────────────────────────────
export const Coins           = adapt('Coins',          'pepicons-pencil:coins');
export const CircleDollarSign = adapt('CircleDollarSign', 'pepicons-pencil:dollar');
export const Dices           = adapt('Dices',          'game-icons:perspective-dice-six');

// ── Misc ──────────────────────────────────────────────────────────────────
export const Handshake       = adapt('Handshake',      'pepicons-pencil:handshake');
export const Ribbon          = adapt('Ribbon',         'pepicons-pencil:trophy');
export const Palette         = adapt('Palette',        'pepicons-pencil:paint-pallet');
export const Lightbulb       = adapt('Lightbulb',      'pepicons-pencil:electricity');
export const HelpCircle      = adapt('HelpCircle',     'pepicons-pencil:question');
export const Paintbrush      = adapt('Paintbrush',     'pepicons-pencil:color-picker');
export const Wrench          = adapt('Wrench',         'pepicons-pencil:wrench');
import { Crown, Shield, Heart, Cat, Leaf, Bird, Star, Sparkles, Sword } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED RANK COLOR CONFIG
//
// Single source of truth for FC rank colors used across all UI surfaces.
//
// COLOR GUIDELINES:
// - All hex values sit in the medium-bright range (~50-65% lightness) so they
//   read well on BOTH light (#FFF9F5) and dark (#1A1722) backgrounds.
// - Hues are spread across the spectrum so no two ranks look alike.
// - Colors are chosen to remain distinguishable across all 8 color themes
//   (pom-pom, crystal, chocobo, tonberry, cactuar, moogle-cloud, midnight,
//   sunset) in both light and dark modes.
// ─────────────────────────────────────────────────────────────────────────────

export interface RankColor {
  /** Hex color for inline styles */
  hex: string;
  /** Tailwind text color class */
  text: string;
  /** Tailwind background/10 class */
  bg: string;
  /** RGBA glow for hover/shadow effects */
  glow: string;
  /** Lucide icon component */
  icon: typeof Crown;
  /** Human-readable label (e.g. "FC Leader") */
  label: string;
  /** Description of the rank */
  description: string;
  /** Singular/plural member term */
  memberTerm: { singular: string; plural: string };
}

export const RANK_COLORS: Record<string, RankColor> = {
  // ── Cyan — bright aqua, distinctive leader color ──────────────────────────
  'Moogle Guardian': {
    hex: '#22D3EE',
    text: 'text-[#22D3EE]',
    bg: 'bg-[#22D3EE]/10',
    glow: 'rgba(34, 211, 238, 0.4)',
    icon: Crown,
    label: 'FC Leader',
    description: 'Our Moogle Guardian who leads Kupo Life',
    memberTerm: { singular: 'leader', plural: 'leaders' },
  },
  // ── Violet — rich purple, elevated from the old darker shade ──────────────
  'Moogle Knight': {
    hex: '#A855F7',
    text: 'text-[#A855F7]',
    bg: 'bg-[#A855F7]/10',
    glow: 'rgba(168, 85, 247, 0.4)',
    icon: Shield,
    label: 'Moogle Knights',
    description: 'Our trusted officers who keep things running smoothly',
    memberTerm: { singular: 'knight', plural: 'knights' },
  },
  // ── Teal — warm emerald-teal, brighter than the old dark teal ─────────────
  'Paissa Trainer': {
    hex: '#14B8A6',
    text: 'text-[#14B8A6]',
    bg: 'bg-[#14B8A6]/10',
    glow: 'rgba(20, 184, 166, 0.4)',
    icon: Heart,
    label: 'Paissa Trainers',
    description: 'Exemplary community members hoping to make your day a little brighter',
    memberTerm: { singular: 'trainer', plural: 'trainers' },
  },
  // ── Green — true green, significantly brighter than the old forest green ──
  'Coeurl Hunter': {
    hex: '#22C55E',
    text: 'text-[#22C55E]',
    bg: 'bg-[#22C55E]/10',
    glow: 'rgba(34, 197, 94, 0.4)',
    icon: Cat,
    label: 'Coeurl Hunters',
    description: 'Seasoned adventurers of the FC',
    memberTerm: { singular: 'hunter', plural: 'hunters' },
  },
  // ── Amber — warm golden-orange, similar to original but richer ────────────
  'Mandragora': {
    hex: '#F59E0B',
    text: 'text-[#F59E0B]',
    bg: 'bg-[#F59E0B]/10',
    glow: 'rgba(245, 158, 11, 0.4)',
    icon: Leaf,
    label: 'Mandragoras',
    description: 'Growing members of the FC',
    memberTerm: { singular: 'member', plural: 'members' },
  },
  // ── Blue — vivid sky blue, brighter than the original steel blue ──────────
  'Apkallu Seeker': {
    hex: '#60A5FA',
    text: 'text-[#60A5FA]',
    bg: 'bg-[#60A5FA]/10',
    glow: 'rgba(96, 165, 250, 0.4)',
    icon: Bird,
    label: 'Apkallu Seekers',
    description: 'Curious explorers of the FC',
    memberTerm: { singular: 'seeker', plural: 'seekers' },
  },
  // ── Lime — yellow-green, shifted slightly warm to separate from Hunter ────
  'Kupo Shelf': {
    hex: '#84CC16',
    text: 'text-[#84CC16]',
    bg: 'bg-[#84CC16]/10',
    glow: 'rgba(132, 204, 22, 0.4)',
    icon: Star,
    label: 'Kupo Shelf',
    description: 'Valued members of the FC',
    memberTerm: { singular: 'member', plural: 'members' },
  },
  // ── Gray — cool neutral, barely changed ───────────────────────────────────
  'Bom Boko': {
    hex: '#9CA3AF',
    text: 'text-[#9CA3AF]',
    bg: 'bg-[#9CA3AF]/10',
    glow: 'rgba(156, 163, 175, 0.3)',
    icon: Sparkles,
    label: 'Bom Boko',
    description: 'New members of the FC',
    memberTerm: { singular: 'member', plural: 'members' },
  },
};

export const DEFAULT_RANK_COLOR: RankColor = {
  hex: '#E879A8',
  text: 'text-[#E879A8]',
  bg: 'bg-[#E879A8]/10',
  glow: 'rgba(232, 121, 168, 0.3)',
  icon: Sword,
  label: 'Member',
  description: 'A member of the FC',
  memberTerm: { singular: 'member', plural: 'members' },
};

/** Get rank color config, falling back to the default */
export function getRankColor(rank: string | undefined): RankColor {
  return rank ? (RANK_COLORS[rank] ?? DEFAULT_RANK_COLOR) : DEFAULT_RANK_COLOR;
}

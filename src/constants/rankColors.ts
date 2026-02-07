import { Crown, Shield, Heart, Cat, Leaf, Bird, Star, Sparkles, Sword } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED RANK COLOR CONFIG
//
// Single source of truth for FC rank colors used across all UI surfaces.
// These match the official in-game FC role colors.
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
  'Moogle Guardian': {
    hex: '#2FECE6',
    text: 'text-[#2FECE6]',
    bg: 'bg-[#2FECE6]/10',
    glow: 'rgba(47, 236, 230, 0.4)',
    icon: Crown,
    label: 'FC Leader',
    description: 'Our Moogle Guardian who leads Kupo Life',
    memberTerm: { singular: 'leader', plural: 'leaders' },
  },
  'Moogle Knight': {
    hex: '#8E42CC',
    text: 'text-[#8E42CC]',
    bg: 'bg-[#8E42CC]/10',
    glow: 'rgba(142, 66, 204, 0.4)',
    icon: Shield,
    label: 'Moogle Knights',
    description: 'Our trusted officers who keep things running smoothly',
    memberTerm: { singular: 'knight', plural: 'knights' },
  },
  'Paissa Trainer': {
    hex: '#068167',
    text: 'text-[#068167]',
    bg: 'bg-[#068167]/10',
    glow: 'rgba(6, 129, 103, 0.4)',
    icon: Heart,
    label: 'Paissa Trainers',
    description: 'Exemplary community members hoping to make your day a little brighter',
    memberTerm: { singular: 'trainer', plural: 'trainers' },
  },
  'Coeurl Hunter': {
    hex: '#056D04',
    text: 'text-[#056D04]',
    bg: 'bg-[#056D04]/10',
    glow: 'rgba(5, 109, 4, 0.4)',
    icon: Cat,
    label: 'Coeurl Hunters',
    description: 'Seasoned adventurers of the FC',
    memberTerm: { singular: 'hunter', plural: 'hunters' },
  },
  'Mandragora': {
    hex: '#E67E22',
    text: 'text-[#E67E22]',
    bg: 'bg-[#E67E22]/10',
    glow: 'rgba(230, 126, 34, 0.4)',
    icon: Leaf,
    label: 'Mandragoras',
    description: 'Growing members of the FC',
    memberTerm: { singular: 'member', plural: 'members' },
  },
  'Apkallu Seeker': {
    hex: '#4D88BB',
    text: 'text-[#4D88BB]',
    bg: 'bg-[#4D88BB]/10',
    glow: 'rgba(77, 136, 187, 0.4)',
    icon: Bird,
    label: 'Apkallu Seekers',
    description: 'Curious explorers of the FC',
    memberTerm: { singular: 'seeker', plural: 'seekers' },
  },
  'Kupo Shelf': {
    hex: '#5ABE32',
    text: 'text-[#5ABE32]',
    bg: 'bg-[#5ABE32]/10',
    glow: 'rgba(90, 190, 50, 0.4)',
    icon: Star,
    label: 'Kupo Shelf',
    description: 'Valued members of the FC',
    memberTerm: { singular: 'member', plural: 'members' },
  },
  'Bom Boko': {
    hex: '#a8a29e',
    text: 'text-stone-400',
    bg: 'bg-stone-400/10',
    glow: 'rgba(168, 162, 158, 0.3)',
    icon: Sparkles,
    label: 'Bom Boko',
    description: 'New members of the FC',
    memberTerm: { singular: 'member', plural: 'members' },
  },
};

export const DEFAULT_RANK_COLOR: RankColor = {
  hex: '#c75b7a',
  text: 'text-[var(--bento-primary)]',
  bg: 'bg-[var(--bento-primary)]/10',
  glow: 'rgba(199, 91, 122, 0.3)',
  icon: Sword,
  label: 'Member',
  description: 'A member of the FC',
  memberTerm: { singular: 'member', plural: 'members' },
};

/** Get rank color config, falling back to the default */
export function getRankColor(rank: string | undefined): RankColor {
  return rank ? (RANK_COLORS[rank] ?? DEFAULT_RANK_COLOR) : DEFAULT_RANK_COLOR;
}

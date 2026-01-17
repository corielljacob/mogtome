import { Crown, Shield, Sword, Leaf, Cat, Bird, Star, Heart, Sparkles } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// RANK THEMES
// ─────────────────────────────────────────────────────────────────────────────

export interface RankTheme {
  gradient: string;
  glow: string;
  bg: string;
  icon: typeof Crown;
  accent: string;
}

export const rankThemes: Record<string, RankTheme> = {
  'Moogle Guardian': {
    gradient: 'from-amber-400 via-yellow-400 to-orange-400',
    glow: 'rgba(251, 191, 36, 0.5)',
    bg: 'bg-amber-500/10',
    icon: Crown,
    accent: 'text-amber-400',
  },
  'Moogle Knight': {
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    glow: 'rgba(167, 139, 250, 0.5)',
    bg: 'bg-violet-500/10',
    icon: Shield,
    accent: 'text-violet-400',
  },
  'Paissa Trainer': {
    gradient: 'from-rose-400 via-pink-500 to-rose-500',
    glow: 'rgba(251, 113, 133, 0.5)',
    bg: 'bg-rose-500/10',
    icon: Heart,
    accent: 'text-rose-400',
  },
  'Coeurl Hunter': {
    gradient: 'from-purple-400 via-violet-400 to-indigo-400',
    glow: 'rgba(196, 181, 253, 0.5)',
    bg: 'bg-purple-400/10',
    icon: Cat,
    accent: 'text-purple-300',
  },
  'Mandragora': {
    gradient: 'from-orange-400 via-amber-400 to-rose-400',
    glow: 'rgba(253, 186, 116, 0.5)',
    bg: 'bg-orange-400/10',
    icon: Leaf,
    accent: 'text-orange-300',
  },
  'Apkallu Seeker': {
    gradient: 'from-pink-400 via-rose-400 to-pink-500',
    glow: 'rgba(249, 168, 212, 0.5)',
    bg: 'bg-pink-400/10',
    icon: Bird,
    accent: 'text-pink-300',
  },
  'Kupo Shelf': {
    gradient: 'from-violet-400 via-purple-400 to-violet-500',
    glow: 'rgba(196, 181, 253, 0.45)',
    bg: 'bg-violet-400/10',
    icon: Star,
    accent: 'text-violet-300',
  },
  'Bom Boko': {
    gradient: 'from-stone-400 via-stone-500 to-stone-400',
    glow: 'rgba(168, 162, 158, 0.4)',
    bg: 'bg-stone-400/10',
    icon: Sparkles,
    accent: 'text-stone-300',
  },
};

export const defaultTheme: RankTheme = {
  gradient: 'from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)]',
  glow: 'rgba(199, 91, 122, 0.4)',
  bg: 'bg-[var(--bento-primary)]/10',
  icon: Sword,
  accent: 'text-[var(--bento-primary)]',
};

export function getTheme(rank: string | undefined): RankTheme {
  return rank ? (rankThemes[rank] ?? defaultTheme) : defaultTheme;
}

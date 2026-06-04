import {
  Crown,
  Shield,
  Heart,
  Cat,
  Leaf,
  Bird,
  Star,
  Sparkles,
  Sword,
} from "lucide-react";

// single source of truth for FC rank colors across every UI surface.
// hexes sit ~50-65% lightness so they read on both the light (#FFF9F5) and
// dark (#1A1722) backgrounds, and stay distinguishable across all 8 themes
// in both modes.

export interface RankColor {
  hex: string;
  text: string;
  /** Tailwind background/10 class */
  bg: string;
  /** RGBA glow for hover/shadow effects */
  glow: string;
  icon: typeof Crown;
  /** e.g. "FC Leader" */
  label: string;
  description: string;
  memberTerm: { singular: string; plural: string };
}

export const RANK_COLORS: Record<string, RankColor> = {
  "Moogle Guardian": {
    hex: "#22D3EE",
    text: "text-[#22D3EE]",
    bg: "bg-[#22D3EE]/10",
    glow: "rgba(34, 211, 238, 0.4)",
    icon: Crown,
    label: "FC Leader",
    description: "Our Moogle Guardian who leads Kupo Life",
    memberTerm: { singular: "leader", plural: "leaders" },
  },
  "Moogle Knight": {
    hex: "#A855F7",
    text: "text-[#A855F7]",
    bg: "bg-[#A855F7]/10",
    glow: "rgba(168, 85, 247, 0.4)",
    icon: Shield,
    label: "Moogle Knights",
    description: "Our trusted officers who keep things running smoothly",
    memberTerm: { singular: "knight", plural: "knights" },
  },
  "Paissa Trainer": {
    hex: "#14B8A6",
    text: "text-[#14B8A6]",
    bg: "bg-[#14B8A6]/10",
    glow: "rgba(20, 184, 166, 0.4)",
    icon: Heart,
    label: "Paissa Trainers",
    description:
      "Exemplary community members hoping to make your day a little brighter",
    memberTerm: { singular: "trainer", plural: "trainers" },
  },
  "Coeurl Hunter": {
    hex: "#22C55E",
    text: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
    glow: "rgba(34, 197, 94, 0.4)",
    icon: Cat,
    label: "Coeurl Hunters",
    description: "Seasoned adventurers of the FC",
    memberTerm: { singular: "hunter", plural: "hunters" },
  },
  Mandragora: {
    hex: "#F59E0B",
    text: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]/10",
    glow: "rgba(245, 158, 11, 0.4)",
    icon: Leaf,
    label: "Mandragoras",
    description: "Growing members of the FC",
    memberTerm: { singular: "member", plural: "members" },
  },
  "Apkallu Seeker": {
    hex: "#60A5FA",
    text: "text-[#60A5FA]",
    bg: "bg-[#60A5FA]/10",
    glow: "rgba(96, 165, 250, 0.4)",
    icon: Bird,
    label: "Apkallu Seekers",
    description: "Curious explorers of the FC",
    memberTerm: { singular: "seeker", plural: "seekers" },
  },
  // lime shifted warm so it doesn't read as Hunter's green
  "Kupo Shelf": {
    hex: "#84CC16",
    text: "text-[#84CC16]",
    bg: "bg-[#84CC16]/10",
    glow: "rgba(132, 204, 22, 0.4)",
    icon: Star,
    label: "Kupo Shelf",
    description: "Valued members of the FC",
    memberTerm: { singular: "member", plural: "members" },
  },
  "Bom Boko": {
    hex: "#9CA3AF",
    text: "text-[#9CA3AF]",
    bg: "bg-[#9CA3AF]/10",
    glow: "rgba(156, 163, 175, 0.3)",
    icon: Sparkles,
    label: "Bom Boko",
    description: "New members of the FC",
    memberTerm: { singular: "member", plural: "members" },
  },
};

export const DEFAULT_RANK_COLOR: RankColor = {
  hex: "#E879A8",
  text: "text-[#E879A8]",
  bg: "bg-[#E879A8]/10",
  glow: "rgba(232, 121, 168, 0.3)",
  icon: Sword,
  label: "Member",
  description: "A member of the FC",
  memberTerm: { singular: "member", plural: "members" },
};

export function getRankColor(rank: string | undefined): RankColor {
  return rank ? (RANK_COLORS[rank] ?? DEFAULT_RANK_COLOR) : DEFAULT_RANK_COLOR;
}

import type { MoogleConfig } from "../FloatingMoogles";

// Assets
import wizardMoogle from "../../assets/moogles/wizard moogle.webp";
import flyingMoogles from "../../assets/moogles/moogles flying.webp";
import musicMoogle from "../../assets/moogles/moogle playing music.webp";
import lilGuyMoogle from "../../assets/moogles/lil guy moogle.webp";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_KUPO_QUOTES = [
  "Welcome home, kupo!",
  "Good to see you, kupo~",
  "Ready for adventure, kupo?",
  "Stay cozy, kupo!",
  "You look great today, kupo!",
  "Let's have fun, kupo~",
  "Glad you're here, kupo!",
  "Have a cookie, kupo~",
];

export const floatingMoogles: MoogleConfig[] = [
  {
    src: wizardMoogle,
    position: "top-12 left-3 md:left-14",
    size: "w-20 md:w-28",
    rotate: -10,
    delay: 0,
  },
  {
    src: flyingMoogles,
    position: "top-14 right-0 md:right-8",
    size: "w-24 md:w-36",
    rotate: 8,
    delay: 0.5,
  },
  {
    src: musicMoogle,
    position: "bottom-20 left-2 md:left-14",
    size: "w-16 md:w-24",
    rotate: 5,
    delay: 1,
  },
  {
    src: lilGuyMoogle,
    position: "bottom-14 right-3 md:right-16",
    size: "w-14 md:w-20",
    rotate: -6,
    delay: 1.5,
  },
];

// Default fairy lights — warm twinkling dots
export const DEFAULT_FAIRY_LIGHTS = [
  {
    left: "8%",
    top: "10%",
    size: 4,
    color: "rgba(251,191,36,0.50)",
    delay: 0,
    dur: 3,
  },
  {
    left: "88%",
    top: "14%",
    size: 4,
    color: "rgba(251,191,36,0.45)",
    delay: 1.5,
    dur: 2.8,
  },
  {
    left: "4%",
    top: "48%",
    size: 3,
    color: "rgba(251,191,36,0.35)",
    delay: 2.0,
    dur: 3.8,
  },
  {
    left: "93%",
    top: "44%",
    size: 4,
    color: "rgba(251,113,133,0.30)",
    delay: 1.0,
    dur: 3,
  },
  {
    left: "12%",
    top: "82%",
    size: 3,
    color: "rgba(252,165,165,0.40)",
    delay: 1.2,
    dur: 3.5,
  },
  {
    left: "85%",
    top: "78%",
    size: 4,
    color: "rgba(251,191,36,0.40)",
    delay: 0.5,
    dur: 2.5,
  },
];

// Default warm floating motes
export const DEFAULT_WARM_MOTES = [
  {
    left: "14%",
    size: 3,
    color: "rgba(251,191,36,0.30)",
    duration: 10,
    delay: 0,
    drift: 18,
  },
  {
    left: "52%",
    size: 3,
    color: "rgba(251,191,36,0.25)",
    duration: 11,
    delay: 4,
    drift: 22,
  },
  {
    left: "86%",
    size: 2.5,
    color: "rgba(251,113,133,0.22)",
    duration: 10,
    delay: 6,
    drift: 12,
  },
];

// Faint stars that drift in the hero's deep background — hand-placed, not random
export const COZY_STARS = [
  {
    left: "12%",
    top: "22%",
    size: 30,
    op: 0.07,
    drift: -14,
    spin: 12,
    dur: 13,
    delay: 0,
  },
  {
    left: "82%",
    top: "18%",
    size: 22,
    op: 0.06,
    drift: -10,
    spin: -10,
    dur: 16,
    delay: 1.5,
  },
  {
    left: "74%",
    top: "70%",
    size: 34,
    op: 0.06,
    drift: 12,
    spin: 8,
    dur: 15,
    delay: 0.8,
  },
  {
    left: "18%",
    top: "74%",
    size: 24,
    op: 0.07,
    drift: 10,
    spin: -12,
    dur: 14,
    delay: 2.2,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Time-of-day greeting — makes the page feel alive and personal */
export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning, kupo~";
  if (hour >= 12 && hour < 17) return "Good afternoon, kupo!";
  if (hour >= 17 && hour < 21) return "Good evening, kupo~";
  return "Up late, kupo? ✧";
}

/** Tagline — clear statement of purpose */
export function getTagline(): string {
  return "A companion experience for Kupo Life!";
}

/**
 * Generate fairy lights from event colors instead of defaults.
 * Distributes lights around the viewport edges using event palette.
 */
export function generateEventFairyLights(colors: string[]) {
  const positions = [
    { left: "8%", top: "10%" },
    { left: "22%", top: "5%" },
    { left: "88%", top: "14%" },
    { left: "75%", top: "7%" },
    { left: "4%", top: "48%" },
    { left: "93%", top: "44%" },
    { left: "12%", top: "82%" },
    { left: "85%", top: "78%" },
    { left: "48%", top: "4%" },
    { left: "62%", top: "90%" },
    { left: "35%", top: "93%" },
    { left: "96%", top: "28%" },
  ];

  return positions.map((pos, i) => ({
    ...pos,
    size: i % 2 === 0 ? 4 : 3,
    color: colors[i % colors.length],
    delay: (i * 0.4) % 3,
    dur: 2.5 + (i % 4) * 0.4,
  }));
}

/**
 * Generate warm motes from event colors instead of defaults.
 */
export function generateEventMotes(colors: string[]) {
  const bases = [
    { left: "12%", drift: 18 },
    { left: "30%", drift: -14 },
    { left: "50%", drift: 22 },
    { left: "70%", drift: -18 },
    { left: "88%", drift: 12 },
    { left: "40%", drift: -10 },
  ];

  return bases.map((base, i) => ({
    ...base,
    size: i % 2 === 0 ? 3 : 2.5,
    color: colors[i % colors.length],
    duration: 9 + (i % 4),
    delay: i * 1.5,
  }));
}

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Star,
  CalendarDays,
  Ghost,
  Skull,
  Moon,
  Snowflake,
  TreePine,
  Gift,
} from "lucide-react";

// Shared components
import {
  FloatingMoogles,
  KawaiiStar,
  KawaiiBow,
  KawaiiHeart,
  KawaiiSparkle,
  KawaiiCloud,
  type MoogleConfig,
} from "../components";

// Contexts
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

// Utilities
import { IS_MOBILE } from "../utils";

// PERFORMANCE: Alias for readability in this file
const IS_MOBILE_DEVICE = IS_MOBILE;

// Assets
import welcomingMoogle from "../assets/moogles/mooglef fly transparent.webp";
import wizardMoogle from "../assets/moogles/wizard moogle.webp";
import flyingMoogles from "../assets/moogles/moogles flying.webp";
import musicMoogle from "../assets/moogles/moogle playing music.webp";
import lilGuyMoogle from "../assets/moogles/lil guy moogle.webp";

// Types
import type { SeasonalEvent, EventParticle } from "../constants/seasonalEvents";

// ─────────────────────────────────────────────────────────────────────────────
// PERFORMANCE: Preload hero moogle for instant LCP
// ─────────────────────────────────────────────────────────────────────────────
if (typeof window !== "undefined") {
  const preloadLink = document.createElement("link");
  preloadLink.rel = "preload";
  preloadLink.as = "image";
  preloadLink.href = welcomingMoogle;
  preloadLink.setAttribute("fetchpriority", "high");
  document.head.appendChild(preloadLink);
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_KUPO_QUOTES = [
  "Welcome home, kupo!",
  "Good to see you, kupo~",
  "Ready for adventure, kupo?",
  "Stay cozy, kupo!",
  "You look great today, kupo!",
  "Let's have fun, kupo~",
  "Glad you're here, kupo!",
  "Have a cookie, kupo~",
];

const floatingMoogles: MoogleConfig[] = [
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
const DEFAULT_FAIRY_LIGHTS = [
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
const DEFAULT_WARM_MOTES = [
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
const COZY_STARS = [
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
function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning, kupo~";
  if (hour >= 12 && hour < 17) return "Good afternoon, kupo!";
  if (hour >= 17 && hour < 21) return "Good evening, kupo~";
  return "Up late, kupo? ✧";
}

/** Tagline — clear statement of purpose */
function getTagline(): string {
  return "A companion experience for Kupo Life!";
}

/**
 * Generate fairy lights from event colors instead of defaults.
 * Distributes lights around the viewport edges using event palette.
 */
function generateEventFairyLights(colors: string[]) {
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
function generateEventMotes(colors: string[]) {
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

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Twinkling warm fairy lights — like a string of cozy golden fireflies */
function FairyLights({ lights }: { lights: typeof DEFAULT_FAIRY_LIGHTS }) {
  // PERFORMANCE: Skip fairy lights entirely on mobile — removes animated glow overhead
  if (IS_MOBILE_DEVICE) return null;
  const displayLights = lights;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {displayLights.map((light, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: light.left,
            top: light.top,
            width: light.size,
            height: light.size,
            backgroundColor: light.color,
          }}
          animate={{ opacity: [0.1, 0.85, 0.1], scale: [0.8, 1.3, 0.8] }}
          transition={{
            duration: light.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: light.delay,
          }}
        />
      ))}
    </div>
  );
}

/** Warm floating embers — like sitting by a cozy fireplace */
function WarmMotes({ motes }: { motes: typeof DEFAULT_WARM_MOTES }) {
  // PERFORMANCE: Skip motes entirely on mobile — removes animated glow overhead
  if (IS_MOBILE_DEVICE) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] pointer-events-none"
      aria-hidden="true"
    >
      {motes.map((mote, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: mote.left,
            bottom: -4,
            width: mote.size,
            height: mote.size,
            backgroundColor: mote.color,
          }}
          animate={{
            y: [0, -220 - i * 25],
            x: [0, mote.drift],
            opacity: [0, 0.75, 0],
          }}
          transition={{
            duration: mote.duration,
            repeat: Infinity,
            ease: "easeOut",
            delay: mote.delay,
          }}
        />
      ))}
    </div>
  );
}

/** Warm golden glow aura behind the moogle — adapts to flagship events */
function WarmMoogleAura({ eventId }: { eventId: string | null }) {
  // PERFORMANCE: Skip moogle aura entirely on mobile — removes large blurred element
  if (IS_MOBILE_DEVICE) return null;
  // All Saints' Wake — eerie purple/green flickering glow
  if (eventId === "all-saints-wake") {
    return (
      <>
        <motion.div
          className="absolute inset-0 scale-[2.0]"
          animate={{ scale: [2.0, 2.4, 2.0], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/35 via-orange-500/20 to-green-500/25 blur-3xl" />
        </motion.div>
        <motion.div
          className="absolute inset-0 scale-[1.3]"
          animate={{ rotate: [0, -360], opacity: [0.15, 0.4, 0.15] }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-orange-400/30 via-purple-600/25 to-green-400/20 blur-2xl" />
        </motion.div>
        {/* Extra flickering pulse — mimics candlelight */}
        <motion.div
          className="absolute inset-0 scale-[1.6]"
          animate={{ opacity: [0.1, 0.35, 0.05, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-radial from-orange-400/25 to-transparent blur-2xl" />
        </motion.div>
      </>
    );
  }

  // Starlight Celebration — warm golden/red/green festive glow
  if (eventId === "starlight") {
    return (
      <>
        <motion.div
          className="absolute inset-0 scale-[2.0]"
          animate={{ scale: [2.0, 2.3, 2.0], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500/30 via-amber-400/30 to-green-500/25 blur-3xl" />
        </motion.div>
        <motion.div
          className="absolute inset-0 scale-[1.3]"
          animate={{ rotate: [0, 360], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            rotate: { duration: 16, repeat: Infinity, ease: "linear" },
            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400/30 via-red-400/20 to-green-400/20 blur-2xl" />
        </motion.div>
        {/* Warm golden starlight halo */}
        <motion.div
          className="absolute inset-0 scale-[1.5]"
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [1.5, 1.7, 1.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-radial from-amber-300/25 to-transparent blur-2xl" />
        </motion.div>
      </>
    );
  }

  // Default — a single soft candy glow (light on the GPU)
  return (
    <motion.div
      className="absolute inset-0 scale-[1.6]"
      animate={{ scale: [1.6, 1.85, 1.6], opacity: [0.35, 0.55, 0.35] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <div
        className="w-full h-full rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--primary) 32%, transparent), color-mix(in srgb, var(--accent) 16%, transparent) 45%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

/** Charms that float around the moogle — adapts to flagship events */
function MoogleCharms({ eventId }: { eventId: string | null }) {
  // PERFORMANCE: Skip charms entirely on mobile — they're tiny and not worth the cost
  if (IS_MOBILE_DEVICE) return null;
  // All Saints' Wake — skulls, ghosts, and moons orbit the moogle
  if (eventId === "all-saints-wake") {
    return (
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute -top-1 left-1/4"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Ghost className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute top-1/5 -left-6 md:-left-10"
          animate={{ y: [0, -6, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Skull
            className="w-4 h-4 md:w-5 md:h-5 text-orange-400"
            strokeWidth={1.5}
          />
        </motion.div>

        <motion.div
          className="absolute top-1/4 -right-6 md:-right-10"
          animate={{ y: [0, -5, 0], scale: [1, 1.2, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Moon
            className="w-4 h-4 md:w-5 md:h-5 text-purple-300 fill-purple-300/30"
            strokeWidth={1.5}
          />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 -right-5 md:-right-8"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <Ghost className="w-3.5 h-3.5 text-green-400" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 -left-5 md:-left-8"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Skull className="w-3.5 h-3.5 text-orange-300" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    );
  }

  // Starlight Celebration — snowflakes, gifts, stars, and trees orbit the moogle
  if (eventId === "starlight") {
    return (
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute -top-2 left-1/4"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Snowflake className="w-4 h-4 text-blue-300" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute top-1/5 -left-6 md:-left-10"
          animate={{ y: [0, -5, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Gift
            className="w-4 h-4 md:w-5 md:h-5 text-red-400"
            strokeWidth={1.5}
          />
        </motion.div>

        <motion.div
          className="absolute top-1/4 -right-6 md:-right-10"
          animate={{ y: [0, -4, 0], scale: [1, 1.3, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Star
            className="w-4 h-4 md:w-5 md:h-5 text-amber-300 fill-amber-300"
            strokeWidth={1.5}
          />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 -right-5 md:-right-8"
          animate={{ y: [0, -3, 0], rotate: [0, -8, 0] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <TreePine className="w-4 h-4 text-green-500" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 -left-5 md:-left-8"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 1, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Snowflake className="w-3.5 h-3.5 text-blue-200" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    );
  }

  // Default — a few kawaii stickers floating around the moogle
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute -top-1 left-1/4"
        animate={{ y: [0, -7, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <KawaiiHeart className="w-5 h-5 text-[var(--primary)]" />
      </motion.div>
      <motion.div
        className="absolute top-1/5 -left-6 md:-left-10"
        animate={{ y: [0, -6, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <KawaiiStar className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent)]" />
      </motion.div>
      <motion.div
        className="absolute top-1/4 -right-6 md:-right-10"
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <KawaiiStar className="w-5 h-5 md:w-6 md:h-6 text-[var(--secondary)]" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 -right-4 md:-right-8"
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <KawaiiHeart className="w-4 h-4 text-[var(--secondary)]" />
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Flagship Event Overlays — All Saints' Wake & Starlight Celebration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * All Saints' Wake — Creeping fog that drifts across the bottom of the screen,
 * eerie flickering jack-o-lantern glow, and wandering ghost silhouettes.
 *
 * PERFORMANCE: On mobile, shows only static fog + 1 ghost (instead of ~12 animated elements)
 */
function HalloweenOverlay() {
  // Ghost silhouettes that drift slowly across the screen
  const ghosts = useMemo(
    () => [
      {
        left: "5%",
        delay: 0,
        duration: 22,
        yStart: "60%",
        yEnd: "20%",
        drift: 80,
        size: 32,
        opacity: 0.08,
      },
      {
        left: "70%",
        delay: 6,
        duration: 26,
        yStart: "75%",
        yEnd: "15%",
        drift: -60,
        size: 28,
        opacity: 0.06,
      },
      {
        left: "35%",
        delay: 12,
        duration: 20,
        yStart: "80%",
        yEnd: "25%",
        drift: 50,
        size: 24,
        opacity: 0.07,
      },
      {
        left: "85%",
        delay: 3,
        duration: 24,
        yStart: "55%",
        yEnd: "10%",
        drift: -70,
        size: 30,
        opacity: 0.05,
      },
      {
        left: "20%",
        delay: 9,
        duration: 28,
        yStart: "70%",
        yEnd: "5%",
        drift: 40,
        size: 26,
        opacity: 0.06,
      },
    ],
    [],
  );

  // PERFORMANCE: Minimal version for mobile
  if (IS_MOBILE_DEVICE) {
    return (
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Static fog */}
        <div
          className="absolute bottom-0 inset-x-0 h-[40%] opacity-80"
          style={{
            background:
              "linear-gradient(to top, rgba(109,40,217,0.12), rgba(109,40,217,0.06) 40%, transparent)",
          }}
        />
        {/* Single ghost with CSS animation */}
        <div
          className="absolute animate-float-moogle-subtle"
          style={{
            left: "15%",
            top: "55%",
            animationDuration: "8s",
            opacity: 0.07,
          }}
        >
          <Ghost
            style={{ width: 28, height: 28 }}
            className="text-purple-400/60"
            strokeWidth={1}
          />
        </div>
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(12,8,20,0.18) 100%)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Fog layers — thick gradient mist at the bottom */}
      <motion.div
        className="absolute bottom-0 inset-x-0 h-[40%]"
        style={{
          background:
            "linear-gradient(to top, rgba(109,40,217,0.12), rgba(109,40,217,0.06) 40%, transparent)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 inset-x-0 h-[25%]"
        style={{
          background:
            "linear-gradient(to top, rgba(74,222,128,0.06), rgba(34,197,94,0.03) 50%, transparent)",
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Drifting fog wisps — horizontal movement */}
      <motion.div
        className="absolute bottom-[5%] h-[15%] w-[60%] rounded-full blur-3xl"
        style={{ background: "rgba(167,139,250,0.08)" }}
        animate={{ x: ["-10%", "110%"], opacity: [0, 0.12, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[12%] h-[10%] w-[45%] rounded-full blur-3xl"
        style={{ background: "rgba(249,115,22,0.06)" }}
        animate={{ x: ["110%", "-10%"], opacity: [0, 0.1, 0] }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
          delay: 4,
        }}
      />

      {/* Eerie pulsing vignette — darker around the edges */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(12,8,20,0.18) 100%)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Wandering ghost silhouettes */}
      {ghosts.map((ghost, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: ghost.left, top: ghost.yStart }}
          animate={{
            y: [0, -(parseFloat(ghost.yStart) - parseFloat(ghost.yEnd)) * 4],
            x: [0, ghost.drift],
            opacity: [0, ghost.opacity, ghost.opacity, 0],
          }}
          transition={{
            duration: ghost.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: ghost.delay,
          }}
        >
          <Ghost
            style={{ width: ghost.size, height: ghost.size }}
            className="text-purple-400/60"
            strokeWidth={1}
          />
        </motion.div>
      ))}

      {/* Flickering jack-o-lantern glow spots */}
      {[
        { left: "10%", top: "70%", size: 120 },
        { left: "80%", top: "65%", size: 100 },
        { left: "45%", top: "80%", size: 140 },
      ].map((spot, i) => (
        <motion.div
          key={`lantern-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            left: spot.left,
            top: spot.top,
            width: spot.size,
            height: spot.size,
            background:
              "radial-gradient(circle, rgba(249,115,22,0.15), rgba(251,191,36,0.08), transparent)",
          }}
          animate={{
            opacity: [0.3, 0.7, 0.2, 0.8, 0.3],
            scale: [1, 1.1, 0.95, 1.08, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.2,
          }}
        />
      ))}
    </div>
  );
}

// Christmas string lights — colored bulbs draped in clean U-swoops across the top
const STRING_LIGHT_COLORS = [
  "#EF4444",
  "#22C55E",
  "#FBBF24",
  "#3B82F6",
  "#EF4444",
  "#22C55E",
  "#FBBF24",
  "#3B82F6",
];

/**
 * Starlight Celebration — Gentle snowfall, twinkling christmas lights,
 * warm golden fireplace glow, and festive sparkles.
 *
 * PERFORMANCE: On mobile, shows 6 CSS snowflakes + static glow (instead of 60+ animated elements)
 */
function StarlightOverlay() {
  // Generate snowflake particles with deterministic positions
  const snowflakes = useMemo(() => {
    const flakes: Array<{
      left: string;
      size: number;
      delay: number;
      duration: number;
      drift: number;
      opacity: number;
      variant: "flake" | "dot";
    }> = [];

    for (let i = 0; i < 35; i++) {
      const seed = i * 37 + 13;
      flakes.push({
        left: `${(seed * 53) % 100}%`,
        size: 6 + (seed % 14),
        delay: (seed * 0.17) % 12,
        duration: 8 + (seed % 10),
        drift: ((seed * 11) % 60) - 30,
        opacity: 0.15 + ((seed * 7) % 100) / 250,
        variant: i % 4 === 0 ? "flake" : "dot",
      });
    }
    return flakes;
  }, []);

  const { wirePath, stringLightBulbs } = useMemo(() => {
    // 8 gentle swoops across the top; bulbs ride along the draped wire
    const garland = buildDrapedGarland(8, 5, 13, 17);
    const bulbs = garland.points.map((p, i) => ({
      x: p.x / 10, // 0–100 (the bulb renderer multiplies x by 10)
      y: p.y,
      color: STRING_LIGHT_COLORS[i % STRING_LIGHT_COLORS.length],
      delay: i * 0.22,
      size: 8 + (i % 3) * 2, // 8–12px bulbs
    }));
    return { wirePath: garland.wirePath, stringLightBulbs: bulbs };
  }, []);

  // PERFORMANCE: Minimal version for mobile — CSS-only, no Framer Motion
  if (IS_MOBILE_DEVICE) {
    return (
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* 6 simple CSS snowflakes instead of 35 Framer Motion snowflakes */}
        {[12, 28, 45, 62, 78, 90].map((left, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/60 animate-float-moogle-subtle"
            style={{
              left: `${left}%`,
              top: `${5 + i * 12}%`,
              width: 4 + (i % 3),
              height: 4 + (i % 3),
              animationDuration: `${4 + i}s`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.2,
            }}
          />
        ))}
        {/* Static warm glow from below */}
        <div
          className="absolute bottom-0 inset-x-0 h-[30%] opacity-80"
          style={{
            background:
              "linear-gradient(to top, rgba(217,119,6,0.10), rgba(251,191,36,0.05) 40%, transparent)",
          }}
        />
        {/* Snow accumulation */}
        <div
          className="absolute bottom-0 inset-x-0 h-[3%]"
          style={{
            background:
              "linear-gradient(to top, rgba(255,255,255,0.06), transparent)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Snowfall */}
      {snowflakes.map((flake, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: flake.left, top: "-5%" }}
          animate={{
            y: [
              0,
              typeof window !== "undefined" ? window.innerHeight + 40 : 1000,
            ],
            x: [0, flake.drift, 0],
            rotate: [0, 360],
          }}
          transition={{
            y: {
              duration: flake.duration,
              repeat: Infinity,
              ease: "linear",
              delay: flake.delay,
            },
            x: {
              duration: flake.duration * 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: flake.delay,
            },
            rotate: {
              duration: flake.duration * 2,
              repeat: Infinity,
              ease: "linear",
              delay: flake.delay,
            },
          }}
        >
          {flake.variant === "flake" ? (
            <Snowflake
              style={{
                width: flake.size,
                height: flake.size,
                opacity: flake.opacity,
              }}
              className="text-blue-200"
              strokeWidth={1.5}
            />
          ) : (
            <div
              className="rounded-full bg-white/80"
              style={{
                width: flake.size * 0.4,
                height: flake.size * 0.4,
                opacity: flake.opacity * 0.8,
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Christmas string lights draped across the top —
           Everything lives inside a single SVG so the wire and bulbs
           share the exact same coordinate space. */}
      <svg
        className="absolute top-0 inset-x-0 h-20 sm:h-24"
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        {/* Glow definitions */}
        <defs>
          {stringLightBulbs.map((bulb, i) => (
            <radialGradient key={`glow-${i}`} id={`bulb-glow-${i}`}>
              <stop offset="0%" stopColor={bulb.color} stopOpacity="0.5" />
              <stop offset="40%" stopColor={bulb.color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={bulb.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Wire shadow — dark line behind for depth */}
        <path
          d={wirePath}
          stroke="rgba(0,0,0,0.20)"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Wire — visible cord */}
        <path
          d={wirePath}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Bulbs + glows rendered in SVG space — they sit exactly on the path */}
        {stringLightBulbs.map((bulb, i) => {
          const cx = bulb.x * 10; // match the path's x scale
          const cy = bulb.y;
          const r = bulb.size * 0.4; // radius in SVG units
          return (
            <g key={i}>
              {/* Large outer glow halo */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={r * 5}
                fill={`url(#bulb-glow-${i})`}
                animate={{
                  opacity: [0.35, 0.75, 0.35],
                  r: [r * 4.5, r * 5.5, r * 4.5],
                }}
                transition={{
                  duration: 2.5 + (i % 3) * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bulb.delay,
                }}
              />
              {/* Inner bright glow */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={r * 2}
                fill={bulb.color}
                opacity={0.35}
                style={{ filter: "blur(1px)" }}
                animate={{ opacity: [0.25, 0.45, 0.25] }}
                transition={{
                  duration: 1.8 + (i % 4) * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bulb.delay + 0.1,
                }}
              />
              {/* Bulb body — slightly elongated ellipse */}
              <motion.ellipse
                cx={cx}
                cy={cy + r * 0.15}
                rx={r}
                ry={r * 1.2}
                fill={bulb.color}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{
                  duration: 2 + (i % 3) * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bulb.delay,
                }}
              />
              {/* Specular highlight */}
              <ellipse
                cx={cx - r * 0.25}
                cy={cy - r * 0.35}
                rx={r * 0.3}
                ry={r * 0.2}
                fill="white"
                opacity={0.5}
              />
            </g>
          );
        })}
      </svg>

      {/* Warm golden fireplace glow from below */}
      <motion.div
        className="absolute bottom-0 inset-x-0 h-[30%]"
        style={{
          background:
            "linear-gradient(to top, rgba(217,119,6,0.10), rgba(251,191,36,0.05) 40%, transparent)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft snow accumulation glow at the very bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-[3%]"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,0.06), transparent)",
        }}
      />

      {/* Festive sparkle bursts — brief twinkling stars scattered around */}
      {[
        { left: "15%", top: "20%", delay: 0 },
        { left: "75%", top: "15%", delay: 2 },
        { left: "55%", top: "35%", delay: 4.5 },
        { left: "25%", top: "70%", delay: 1.5 },
        { left: "85%", top: "60%", delay: 3.5 },
        { left: "45%", top: "85%", delay: 5.5 },
      ].map((sparkle, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          style={{ left: sparkle.left, top: sparkle.top }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.5],
            rotate: [0, 180],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: sparkle.delay,
            repeatDelay: 4,
          }}
        >
          <Sparkles className="w-4 h-4 text-amber-300/60" strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Event-specific decorations
// ─────────────────────────────────────────────────────────────────────────────

/** Floating icon particles scattered across the viewport for events */
function EventParticles({ particles }: { particles: EventParticle[] }) {
  // Generate stable positions for each particle
  const items = useMemo(() => {
    const result: Array<{
      Icon: EventParticle["icon"];
      color: string;
      left: string;
      top: string;
      size: number;
      opacity: number;
      delay: number;
      duration: number;
      drift: number;
    }> = [];

    particles.forEach((config, pIdx) => {
      for (let i = 0; i < config.count; i++) {
        // Use deterministic pseudo-random placement based on index
        const seed = pIdx * 100 + i;
        const left = ((seed * 37 + 13) % 90) + 5;
        const top = ((seed * 53 + 7) % 85) + 5;
        const size =
          config.minSize +
          ((seed * 17) % (config.maxSize - config.minSize + 1));
        const opacity =
          config.minOpacity +
          (((seed * 23) % 100) / 100) * (config.maxOpacity - config.minOpacity);

        result.push({
          Icon: config.icon,
          color: config.color,
          left: `${left}%`,
          top: `${top}%`,
          size,
          opacity,
          delay: (seed * 0.3) % 5,
          duration: 4 + (seed % 5),
          drift: ((seed * 11) % 20) - 10,
        });
      }
    });

    return result;
  }, [particles]);

  // PERFORMANCE: Skip event particles on mobile — too many animated elements
  if (IS_MOBILE_DEVICE) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: item.left,
            top: item.top,
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, item.drift, 0],
            opacity: [item.opacity * 0.6, item.opacity, item.opacity * 0.6],
            rotate: [0, item.drift > 0 ? 8 : -8, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          <item.Icon
            style={{ width: item.size, height: item.size, color: item.color }}
            strokeWidth={1.5}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Event spotlight — a bold, themed card announcing the active seasonal event
// ─────────────────────────────────────────────────────────────────────────────

const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "Oct 20 – Nov 1" */
function formatEventDates(range: SeasonalEvent["dateRange"]): string {
  return `${MONTH_ABBR[range.startMonth - 1]} ${range.startDay} – ${MONTH_ABBR[range.endMonth - 1]} ${range.endDay}`;
}

/** Whole days remaining until the event's end (handles year wrap). */
function getEventDaysLeft(range: SeasonalEvent["dateRange"]): number {
  const now = new Date();
  let end = new Date(
    now.getFullYear(),
    range.endMonth - 1,
    range.endDay,
    23,
    59,
    59,
  );
  if (end.getTime() < now.getTime()) {
    end = new Date(
      now.getFullYear() + 1,
      range.endMonth - 1,
      range.endDay,
      23,
      59,
      59,
    );
  }
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86_400_000));
}

function eventCountdownLabel(daysLeft: number): string {
  if (daysLeft <= 0) return "last day to celebrate!";
  if (daysLeft === 1) return "1 day left to celebrate";
  return `${daysLeft} days left to celebrate`;
}

/**
 * Builds a draped "UUUU" garland: a wire that sags in repeated U-swoops between
 * evenly spaced pegs, plus evenly spaced points along the wire to hang bulbs or
 * pennants from. Coordinates use a 0–1000 (x) × 0–100 (y) viewBox — render the
 * wire with preserveAspectRatio="none" and vector-effect="non-scaling-stroke".
 */
function buildDrapedGarland(
  swoops: number,
  pegY: number,
  sagDepth: number,
  count: number,
) {
  const W = 1000;
  const segW = W / swoops;
  const ctrlY = pegY + 2 * sagDepth; // quadratic control point so each dip reaches pegY + sagDepth
  let wirePath = `M 0 ${pegY}`;
  for (let i = 0; i < swoops; i++) {
    const midX = i * segW + segW / 2;
    wirePath += ` Q ${midX} ${ctrlY} ${(i + 1) * segW} ${pegY}`;
  }
  const points: Array<{ x: number; y: number }> = [];
  for (let k = 0; k < count; k++) {
    const x = ((k + 0.5) / count) * W;
    const i = Math.min(swoops - 1, Math.floor(x / segW));
    const t = (x - i * segW) / segW;
    const y = (1 - t) * (1 - t) * pegY + 2 * (1 - t) * t * ctrlY + t * t * pegY;
    points.push({ x, y });
  }
  return { wirePath, points };
}

/**
 * EventBunting — a festive pennant garland strung across the FULL viewport during
 * a seasonal event (mirrors how StarlightOverlay drapes its string lights), with
 * the event name, dates, and countdown centered below. Rendered as a fixed
 * overlay so it spans the whole width — sidebar included.
 */
function EventBunting({ event }: { event: SeasonalEvent }) {
  const EventIcon = event.icon;
  const daysLeft = getEventDaysLeft(event.dateRange);
  const dates = formatEventDates(event.dateRange);
  const countdown = eventCountdownLabel(daysLeft);

  return (
    <div
      className="fixed inset-x-0 top-[calc(3.5rem+env(safe-area-inset-top))] md:top-4 z-20 pointer-events-none flex justify-center px-4 select-none"
      role="status"
      aria-label={`Now celebrating ${event.name}. ${dates}. ${countdown}.`}
    >
      {/* Kawaii sticker banner */}
      <motion.div
        className="relative -rotate-1"
        initial={{ opacity: 0, y: -12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.7, delay: 0.3 }}
      >
        {/* washi tape across the top */}
        <span
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-24 h-6 rotate-[-3deg] rounded-[2px] opacity-80 z-10"
          style={{
            background:
              "repeating-linear-gradient(45deg, color-mix(in srgb, var(--accent) 50%, transparent) 0 7px, color-mix(in srgb, var(--accent) 28%, transparent) 7px 14px)",
          }}
          aria-hidden="true"
        />
        {/* star sticker corner */}
        <KawaiiStar
          className="absolute -top-2 -right-2 w-5 h-5 text-[var(--accent)] rotate-12 z-10"
          aria-hidden="true"
        />

        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl"
          style={{
            background: "color-mix(in srgb, var(--primary) 14%, var(--card))",
            border:
              "2px solid color-mix(in srgb, var(--primary) 45%, var(--card))",
            boxShadow:
              "0 0 0 3px var(--card), 4px 5px 0 0 color-mix(in srgb, var(--primary) 30%, transparent), 0 0 26px -6px color-mix(in srgb, var(--primary) 50%, transparent)",
          }}
        >
          {/* event icon sticker */}
          <span
            className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full"
            style={{
              background: "color-mix(in srgb, var(--primary) 16%, var(--card))",
              color: "var(--primary)",
            }}
          >
            <EventIcon className="w-6 h-6" aria-hidden="true" />
          </span>
          <div className="text-left">
            <p className="eyebrow-script text-base text-[var(--secondary)] leading-none">
              Now celebrating
            </p>
            <h2 className="font-display font-bold text-base sm:text-lg text-[var(--text)] leading-tight">
              {event.name}
            </h2>
            <p className="text-[11px] font-soft text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5 flex-wrap">
              <CalendarDays
                className="w-3 h-3 text-[var(--text-subtle)]"
                aria-hidden="true"
              />
              {dates}
              <span className="text-[var(--text-subtle)]">·</span>
              <span className="font-accent text-sm text-[var(--primary)]">
                {countdown}
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function Home() {
  const { user } = useAuth();
  const { activeEvent, isEventThemeActive } = useTheme();

  // Determine quotes: event-specific or default
  const kupoQuotes = useMemo(
    () =>
      isEventThemeActive && activeEvent
        ? activeEvent.kupoQuotes
        : DEFAULT_KUPO_QUOTES,
    [isEventThemeActive, activeEvent],
  );

  const [quoteIndex, setQuoteIndex] = useState(-1);

  // Time-aware values
  const timeGreeting = useMemo(() => getTimeGreeting(), []);
  const defaultTagline = useMemo(() => getTagline(), []);

  const firstGreeting = user
    ? `Welcome home, ${user.memberName.split(" ")[0]}!`
    : timeGreeting;

  const displayQuote = quoteIndex < 0 ? firstGreeting : kupoQuotes[quoteIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % kupoQuotes.length);
    }, 4500); // slightly slower pace for a relaxed feel
    return () => clearInterval(interval);
  }, [kupoQuotes]);

  const fairyLights = useMemo(() => {
    if (isEventThemeActive && activeEvent) {
      return generateEventFairyLights(activeEvent.atmosphere.fairyLightColors);
    }
    return DEFAULT_FAIRY_LIGHTS;
  }, [isEventThemeActive, activeEvent]);

  const warmMotes = useMemo(() => {
    if (isEventThemeActive && activeEvent) {
      return generateEventMotes(activeEvent.atmosphere.moteColors);
    }
    return DEFAULT_WARM_MOTES;
  }, [isEventThemeActive, activeEvent]);

  // Bespoke ambient layer — soft warm light pools that gently drift (no morphing
  // "blob" shapes) plus a few faint drifting stars, so the background reads as
  // cozy lamplight in a nest rather than a generic SaaS gradient blob.
  const renderCozyAtmosphere = () => {
    const poolA =
      isEventThemeActive && activeEvent?.id === "all-saints-wake"
        ? "#a855f7"
        : isEventThemeActive && activeEvent?.id === "starlight"
          ? "#fbbf24"
          : "var(--primary)";
    const poolB =
      isEventThemeActive && activeEvent?.id === "all-saints-wake"
        ? "#f97316"
        : isEventThemeActive && activeEvent?.id === "starlight"
          ? "#ef4444"
          : "var(--secondary)";
    return (
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none z-0"
        aria-hidden="true"
      >
        {/* Warm light pool — top-left (static for performance) */}
        <div
          className="absolute -top-[12%] -left-[10%] w-[45vw] h-[45vw] min-w-[320px] min-h-[320px] rounded-full blur-[60px] opacity-70"
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, ${poolA} 20%, transparent), transparent 70%)`,
          }}
        />
        {/* Warm light pool — bottom-right (static) */}
        <div
          className="absolute -bottom-[12%] -right-[10%] w-[40vw] h-[40vw] min-w-[300px] min-h-[300px] rounded-full blur-[55px] opacity-65"
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, ${poolB} 18%, transparent), transparent 70%)`,
          }}
        />
        {/* A few faint stars drifting in the deep background */}
        {COZY_STARS.map((s, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: s.left, top: s.top }}
            animate={{
              y: [0, s.drift, 0],
              rotate: [0, s.spin, 0],
              opacity: [s.op * 0.5, s.op, s.op * 0.5],
            }}
            transition={{
              duration: s.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay,
            }}
          >
            <Star
              style={{ width: s.size, height: s.size, color: "var(--accent)" }}
              strokeWidth={1.25}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col relative bg-[var(--bg)] selection:bg-[var(--primary)] selection:text-white overflow-hidden">
      {/* ── Background Atmospherics ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-colors duration-1000"
        style={{
          background:
            isEventThemeActive && activeEvent
              ? activeEvent.atmosphere.backgroundGradient
              : "radial-gradient(ellipse at top left, color-mix(in srgb, var(--primary) 5%, transparent), transparent 70%), radial-gradient(ellipse at bottom right, color-mix(in srgb, var(--secondary) 8%, transparent), transparent 70%)",
        }}
        aria-hidden="true"
      />
      {/* Scrapbook polka-dot page */}
      <div
        className="fixed inset-0 z-0 pointer-events-none kawaii-dots opacity-80"
        aria-hidden="true"
      />
      {!IS_MOBILE_DEVICE && renderCozyAtmosphere()}
      <FairyLights lights={fairyLights} />
      {isEventThemeActive && activeEvent && (
        <EventParticles particles={activeEvent.particles} />
      )}
      {isEventThemeActive && activeEvent?.id === "all-saints-wake" && (
        <HalloweenOverlay />
      )}
      {isEventThemeActive && activeEvent?.id === "starlight" && (
        <StarlightOverlay />
      )}
      <FloatingMoogles moogles={floatingMoogles} opacityRange={[0.15, 0.3]} />
      {isEventThemeActive && activeEvent && (
        <EventBunting event={activeEvent} />
      )}

      {/* ── Main Layout ── */}
      {/* Mobile: pad for fixed top/bottom bars. Desktop: no padding needed (sidebar handles nav) */}
      <div className="flex-1 min-h-0 relative z-10 flex flex-col p-4 sm:p-8 lg:py-8 lg:px-12 pt-[calc(4rem+env(safe-area-inset-top))] md:pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-4">
        {/* ── Hero: text column + moogle column ── */}
        <div className="relative flex-1 min-h-0 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
          {/* Scrapbook stickers scattered across the page (desktop) — fills the center */}
          <div
            className="hidden lg:block absolute inset-0 pointer-events-none z-0"
            aria-hidden="true"
          >
            <KawaiiStar className="absolute left-[47%] top-[14%] w-7 h-7 text-[var(--accent)] rotate-12" />
            <KawaiiHeart className="absolute left-[57%] top-[28%] w-6 h-6 text-[var(--primary)] -rotate-6" />
            <KawaiiBow className="absolute left-[44%] top-[55%] w-9 h-9 text-[var(--secondary)] rotate-6" />
            <KawaiiSparkle className="absolute left-[60%] top-[66%] w-6 h-6 text-[var(--accent)]" />
            <KawaiiStar className="absolute left-[40%] top-[80%] w-5 h-5 text-[var(--primary)] -rotate-12" />
            <KawaiiHeart className="absolute left-[63%] top-[12%] w-5 h-5 text-[var(--secondary)] rotate-12" />
            <KawaiiSparkle className="absolute left-[51%] top-[42%] w-5 h-5 text-[var(--primary)]" />
          </div>

          {/* ── Left Side: Whimsical Text & CTA ── */}
          <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left z-20">
            <motion.div
              initial={{ opacity: 0, x: -40, rotate: -2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
            >
              <p className="eyebrow-script text-2xl sm:text-3xl md:text-5xl text-[var(--secondary)] mb-2 md:mb-4 -rotate-3 ml-2 lg:ml-6 filter drop-shadow-md inline-flex items-center gap-2">
                Welcome to
                <KawaiiStar
                  className="w-5 h-5 sm:w-7 sm:h-7 text-[var(--accent)] rotate-12"
                  aria-hidden="true"
                />
              </p>
            </motion.div>

            {/* Staggered Giant Title */}
            <motion.h1
              className="font-title-latin font-black tracking-tighter leading-[0.8] mb-1 sm:mb-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, staggerChildren: 0.1 }}
            >
              <span className="sticker-text block text-7xl sm:text-8xl md:text-[8rem] lg:text-[10rem] text-[var(--primary)] flex whitespace-nowrap">
                {Array.from("Mog").map((char, i) => (
                  <motion.span
                    key={`mog-${i}`}
                    className="inline-block hover:text-[var(--primary)] transition-colors duration-200 cursor-default"
                    whileHover={{
                      y: -15,
                      rotate: i % 2 === 0 ? -6 : 6,
                      scale: 1.05,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
              <span className="sticker-text block text-7xl sm:text-8xl md:text-[8rem] lg:text-[10rem] text-[var(--secondary)] ml-4 sm:ml-12 lg:ml-24 flex whitespace-nowrap">
                {Array.from("Tome").map((char, i) => (
                  <motion.span
                    key={`tome-${i}`}
                    className="inline-block hover:text-[var(--secondary)] transition-colors duration-200 cursor-default"
                    whileHover={{
                      y: -15,
                      rotate: i % 2 === 0 ? 6 : -6,
                      scale: 1.05,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.div
              className="flex flex-col items-center lg:items-start gap-3 mb-10 ml-4 sm:ml-12 lg:ml-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <p className="text-xl sm:text-2xl md:text-[1.75rem] text-[var(--text-subtle)] font-display italic tracking-wide">
                {defaultTagline.split("Kupo Life!").map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="text-[var(--primary)] font-bold">
                        Kupo Life!
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </motion.div>

            {/* <motion.div
            className="flex items-center justify-center lg:justify-start w-full lg:w-auto z-30 relative ml-0 sm:ml-8 lg:ml-20 mt-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.8 }}
          >
            {!isLoading && !isAuthenticated ? (
              <Button size="lg" onClick={login} className="group gap-2.5 px-8 py-4 text-lg w-full sm:w-auto">
                <DiscordIcon className="w-[1.35rem] h-[1.35rem]" />
                <span>Login with Discord</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            ) : (
              <Link to="/members">
                <Button size="lg" className="group gap-2.5 px-8 py-4 text-lg">
                  <Heart className="w-5 h-5 fill-white/30" />
                  <span>Enter the Book</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
            )}
          </motion.div> */}

            {/* Quick-links scrapbook card (desktop) */}
            <motion.div
              className="relative hidden lg:block mt-9 ml-0 lg:ml-20"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              {/* washi tape */}
              <span
                className="absolute -top-2.5 left-8 w-20 h-6 rotate-[-5deg] rounded-[2px] opacity-80 z-10"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, color-mix(in srgb, var(--accent) 50%, transparent) 0 7px, color-mix(in srgb, var(--accent) 28%, transparent) 7px 14px)",
                }}
                aria-hidden="true"
              />
              <div className="surface inline-block -rotate-1 px-4 py-3">
                <p className="font-display font-bold text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                  <KawaiiStar
                    className="w-3.5 h-3.5 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  Take a peek, kupo
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      to: "/members",
                      label: "Family",
                      color: "var(--secondary)",
                    },
                    {
                      to: "/chronicle",
                      label: "Chronicle",
                      color: "var(--accent)",
                    },
                    { to: "/about", label: "About", color: "#a886d6" },
                  ].map((c) => (
                    <Link
                      key={c.to}
                      to={c.to}
                      className="px-3 py-1 rounded-full font-display font-bold text-sm hover-bounce"
                      style={{
                        background: `color-mix(in srgb, ${c.color} 18%, var(--card))`,
                        color: c.color,
                      }}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right Side: Moogle Showcase ── */}
          <div className="w-full lg:flex-1 lg:h-full relative flex flex-col items-center justify-center mt-4 lg:mt-0 z-10">
            {/* Speech bubble lives ABOVE the moogle in DOM flow */}
            <motion.div
              className="relative z-40 mb-3 sm:mb-4 lg:mb-6 lg:mr-10 xl:mr-20"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ y: [0, -8, 0], opacity: 1, scale: 1 }}
              transition={{
                opacity: { delay: 1, duration: 0.4 },
                scale: { type: "spring", delay: 1, bounce: 0.5 },
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.4,
                },
              }}
              role="region"
              aria-label="Moogle greeting"
            >
              <div
                className="
                relative bg-[var(--card)]
                px-5 sm:px-7 py-3 sm:py-4
                rounded-[2rem] rounded-br-md
                border-2 border-[color:color-mix(in_srgb,var(--primary)_28%,var(--card))]
                shadow-[0_0_0_3px_var(--card),3px_4px_0_0_color-mix(in_srgb,var(--primary)_22%,transparent)]
                max-w-[260px] sm:max-w-[300px]
              "
              >
                {/* Bow tied on the bubble */}
                <KawaiiBow
                  className="absolute -top-3.5 -left-2.5 w-8 h-8 text-[var(--primary)] -rotate-12 drop-shadow-sm"
                  aria-hidden="true"
                />
                {/* Thought bubble dots trailing down toward moogle */}
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-3 w-3.5 h-3.5 bg-[var(--card)]/95 rounded-full shadow-sm border border-[var(--border)]/40"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-7 left-1/2 translate-x-1 w-2.5 h-2.5 bg-[var(--card)]/95 rounded-full shadow-sm border border-[var(--border)]/40"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-10 left-1/2 translate-x-4 w-1.5 h-1.5 bg-[var(--primary)]/60 rounded-full"
                  aria-hidden="true"
                />

                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex < 0 ? "greeting" : quoteIndex}
                    className="font-accent text-base sm:text-lg md:text-xl text-[var(--primary)] text-center leading-snug font-bold"
                    initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.85, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    &ldquo;{displayQuote}&rdquo;
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              className="relative lg:mr-10 xl:mr-20 pointer-events-auto"
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                bounce: 0.5,
                duration: 1.5,
                delay: 0.3,
              }}
            >
              {/* Fluffy cloud the moogle floats on */}
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-[2%] w-[118%] pointer-events-none drop-shadow-[0_10px_12px_rgba(0,0,0,0.18)]"
                aria-hidden="true"
              >
                <KawaiiCloud className="w-full text-white" />
              </div>
              <WarmMoogleAura
                eventId={
                  isEventThemeActive && activeEvent ? activeEvent.id : null
                }
              />
              <MoogleCharms
                eventId={
                  isEventThemeActive && activeEvent ? activeEvent.id : null
                }
              />

              {/* The majestic floating Moogle */}
              <motion.img
                src={welcomingMoogle}
                alt="A magical mogtome moogle"
                className="relative w-40 sm:w-56 md:w-72 lg:w-[22rem] xl:w-[26rem] drop-shadow-2xl z-20 cursor-grab active:cursor-grabbing select-none"
                drag
                dragConstraints={{ left: -20, right: 20, top: -15, bottom: 15 }}
                dragElastic={0.15}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, rotate: -5 }}
                onClick={() =>
                  setQuoteIndex((prev) => (prev + 1) % kupoQuotes.length)
                }
                loading="eager"
                decoding="async"
                fetchPriority="high"
                animate={{
                  y: [-8, 12, -8],
                  rotate: [-1.5, 2.5, -1.5],
                }}
                transition={{
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                }}
              />
              <WarmMotes motes={warmMotes} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

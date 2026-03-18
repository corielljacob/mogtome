import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, ArrowRight, Sparkles, Star,
  LogIn, CalendarDays,
  Ghost, Skull, Moon, Snowflake, TreePine, Gift,
} from 'lucide-react';

// Shared components
import {
  Button, FloatingMoogles, DiscordIcon, StoryDivider, MooglePom, type MoogleConfig,
} from '../components';

// Contexts
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Utilities
import { IS_MOBILE } from '../utils';

// PERFORMANCE: Alias for readability in this file
const IS_MOBILE_DEVICE = IS_MOBILE;

// Assets
import welcomingMoogle from '../assets/moogles/mooglef fly transparent.webp';
import wizardMoogle from '../assets/moogles/wizard moogle.webp';
import flyingMoogles from '../assets/moogles/moogles flying.webp';
import musicMoogle from '../assets/moogles/moogle playing music.webp';
import lilGuyMoogle from '../assets/moogles/lil guy moogle.webp';

// Types
import type { SeasonalEvent, EventParticle } from '../constants/seasonalEvents';

// ─────────────────────────────────────────────────────────────────────────────
// PERFORMANCE: Preload hero moogle for instant LCP
// ─────────────────────────────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'image';
  preloadLink.href = welcomingMoogle;
  preloadLink.setAttribute('fetchpriority', 'high');
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
  { src: wizardMoogle, position: 'top-12 left-3 md:left-14', size: 'w-20 md:w-28', rotate: -10, delay: 0 },
  { src: flyingMoogles, position: 'top-14 right-0 md:right-8', size: 'w-24 md:w-36', rotate: 8, delay: 0.5 },
  { src: musicMoogle, position: 'bottom-20 left-2 md:left-14', size: 'w-16 md:w-24', rotate: 5, delay: 1 },
  { src: lilGuyMoogle, position: 'bottom-14 right-3 md:right-16', size: 'w-14 md:w-20', rotate: -6, delay: 1.5 },
];

// Default fairy lights — warm twinkling dots
const DEFAULT_FAIRY_LIGHTS = [
  { left: '8%', top: '10%', size: 4, color: 'rgba(251,191,36,0.50)', delay: 0, dur: 3 },
  { left: '22%', top: '5%', size: 3, color: 'rgba(251,113,133,0.40)', delay: 0.8, dur: 3.5 },
  { left: '88%', top: '14%', size: 4, color: 'rgba(251,191,36,0.45)', delay: 1.5, dur: 2.8 },
  { left: '75%', top: '7%', size: 3, color: 'rgba(252,165,165,0.40)', delay: 0.3, dur: 3.2 },
  { left: '4%', top: '48%', size: 3, color: 'rgba(251,191,36,0.35)', delay: 2.0, dur: 3.8 },
  { left: '93%', top: '44%', size: 4, color: 'rgba(251,113,133,0.30)', delay: 1.0, dur: 3 },
  { left: '12%', top: '82%', size: 3, color: 'rgba(252,165,165,0.40)', delay: 1.2, dur: 3.5 },
  { left: '85%', top: '78%', size: 4, color: 'rgba(251,191,36,0.40)', delay: 0.5, dur: 2.5 },
  { left: '48%', top: '4%', size: 3, color: 'rgba(251,191,36,0.30)', delay: 1.8, dur: 3.3 },
  { left: '62%', top: '90%', size: 3, color: 'rgba(251,113,133,0.35)', delay: 2.5, dur: 3 },
  { left: '35%', top: '93%', size: 4, color: 'rgba(251,191,36,0.40)', delay: 0.7, dur: 3.6 },
  { left: '96%', top: '28%', size: 3, color: 'rgba(252,165,165,0.35)', delay: 1.4, dur: 2.8 },
];

// Default warm floating motes
const DEFAULT_WARM_MOTES = [
  { left: '12%', size: 3, color: 'rgba(251,191,36,0.30)', duration: 9, delay: 0, drift: 18 },
  { left: '30%', size: 2.5, color: 'rgba(251,113,133,0.25)', duration: 11, delay: 2.5, drift: -14 },
  { left: '50%', size: 3, color: 'rgba(251,191,36,0.25)', duration: 10, delay: 4, drift: 22 },
  { left: '70%', size: 2.5, color: 'rgba(252,165,165,0.28)', duration: 12, delay: 1.5, drift: -18 },
  { left: '88%', size: 2.5, color: 'rgba(251,191,36,0.22)', duration: 10, delay: 6, drift: 12 },
  { left: '40%', size: 2.5, color: 'rgba(251,113,133,0.22)', duration: 11, delay: 3.5, drift: -10 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Time-of-day greeting — makes the page feel alive and personal */
function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning, kupo~';
  if (hour >= 12 && hour < 17) return 'Good afternoon, kupo!';
  if (hour >= 17 && hour < 21) return 'Good evening, kupo~';
  return 'Up late, kupo? ✧';
}

/** Tagline — clear statement of purpose */
function getTagline(): string {
  return 'A companion experience for Kupo Life!';
}

/**
 * Generate fairy lights from event colors instead of defaults.
 * Distributes lights around the viewport edges using event palette.
 */
function generateEventFairyLights(colors: string[]) {
  const positions = [
    { left: '8%', top: '10%' }, { left: '22%', top: '5%' },
    { left: '88%', top: '14%' }, { left: '75%', top: '7%' },
    { left: '4%', top: '48%' }, { left: '93%', top: '44%' },
    { left: '12%', top: '82%' }, { left: '85%', top: '78%' },
    { left: '48%', top: '4%' }, { left: '62%', top: '90%' },
    { left: '35%', top: '93%' }, { left: '96%', top: '28%' },
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
    { left: '12%', drift: 18 }, { left: '30%', drift: -14 },
    { left: '50%', drift: 22 }, { left: '70%', drift: -18 },
    { left: '88%', drift: 12 }, { left: '40%', drift: -10 },
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
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
            ease: 'easeInOut',
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
            ease: 'easeOut',
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
  if (eventId === 'all-saints-wake') {
    return (
      <>
        <motion.div
          className="absolute inset-0 scale-[2.0]"
          animate={{ scale: [2.0, 2.4, 2.0], opacity: [0.25, 0.50, 0.25] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/35 via-orange-500/20 to-green-500/25 blur-3xl" />
        </motion.div>
        <motion.div
          className="absolute inset-0 scale-[1.3]"
          animate={{ rotate: [0, -360], opacity: [0.15, 0.40, 0.15] }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-orange-400/30 via-purple-600/25 to-green-400/20 blur-2xl" />
        </motion.div>
        {/* Extra flickering pulse — mimics candlelight */}
        <motion.div
          className="absolute inset-0 scale-[1.6]"
          animate={{ opacity: [0.1, 0.35, 0.05, 0.30, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-radial from-orange-400/25 to-transparent blur-2xl" />
        </motion.div>
      </>
    );
  }

  // Starlight Celebration — warm golden/red/green festive glow
  if (eventId === 'starlight') {
    return (
      <>
        <motion.div
          className="absolute inset-0 scale-[2.0]"
          animate={{ scale: [2.0, 2.3, 2.0], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500/30 via-amber-400/30 to-green-500/25 blur-3xl" />
        </motion.div>
        <motion.div
          className="absolute inset-0 scale-[1.3]"
          animate={{ rotate: [0, 360], opacity: [0.2, 0.40, 0.2] }}
          transition={{
            rotate: { duration: 16, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400/30 via-red-400/20 to-green-400/20 blur-2xl" />
        </motion.div>
        {/* Warm golden starlight halo */}
        <motion.div
          className="absolute inset-0 scale-[1.5]"
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [1.5, 1.7, 1.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-radial from-amber-300/25 to-transparent blur-2xl" />
        </motion.div>
      </>
    );
  }

  // Default — warm golden cozy lantern
  return (
    <>
      {/* Outer warm pulsing glow */}
      <motion.div
        className="absolute inset-0 scale-[1.8]"
        animate={{ scale: [1.8, 2.1, 1.8], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--primary)]/30 via-amber-400/25 to-[var(--secondary)]/30 blur-3xl" />
      </motion.div>

      {/* Inner rotating warm halo */}
      <motion.div
        className="absolute inset-0 scale-[1.2]"
        animate={{ rotate: [0, 360], opacity: [0.2, 0.35, 0.2] }}
        transition={{
          rotate: { duration: 14, repeat: Infinity, ease: 'linear' },
          opacity: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        aria-hidden="true"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400/25 via-[var(--accent)]/20 to-rose-400/20 blur-2xl" />
      </motion.div>
    </>
  );
}

/** Charms that float around the moogle — adapts to flagship events */
function MoogleCharms({ eventId }: { eventId: string | null }) {
  // PERFORMANCE: Skip charms entirely on mobile — they're tiny and not worth the cost
  if (IS_MOBILE_DEVICE) return null;
  // All Saints' Wake — skulls, ghosts, and moons orbit the moogle
  if (eventId === 'all-saints-wake') {
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
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Ghost className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute top-1/5 -left-6 md:-left-10"
          animate={{ y: [0, -6, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Skull className="w-4 h-4 md:w-5 md:h-5 text-orange-400" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute top-1/4 -right-6 md:-right-10"
          animate={{ y: [0, -5, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <Moon className="w-4 h-4 md:w-5 md:h-5 text-purple-300 fill-purple-300/30" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 -right-5 md:-right-8"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          <Ghost className="w-3.5 h-3.5 text-green-400" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 -left-5 md:-left-8"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <Skull className="w-3.5 h-3.5 text-orange-300" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    );
  }

  // Starlight Celebration — snowflakes, gifts, stars, and trees orbit the moogle
  if (eventId === 'starlight') {
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
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5], rotate: [0, 90, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Snowflake className="w-4 h-4 text-blue-300" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute top-1/5 -left-6 md:-left-10"
          animate={{ y: [0, -5, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Gift className="w-4 h-4 md:w-5 md:h-5 text-red-400" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute top-1/4 -right-6 md:-right-10"
          animate={{ y: [0, -4, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-300 fill-amber-300" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 -right-5 md:-right-8"
          animate={{ y: [0, -3, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          <TreePine className="w-4 h-4 text-green-500" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 -left-5 md:-left-8"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4], rotate: [0, 180, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <Snowflake className="w-3.5 h-3.5 text-blue-200" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    );
  }

  // Default — hearts and stars
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      aria-hidden="true"
    >
      {/* Top — floating heart */}
      <motion.div
        className="absolute -top-1 left-1/4"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <Heart className="w-3.5 h-3.5 text-[var(--primary)] fill-[var(--primary)]" />
      </motion.div>

      {/* Left — warm heart */}
      <motion.div
        className="absolute top-1/5 -left-6 md:-left-10"
        animate={{ y: [0, -5, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Heart className="w-4 h-4 md:w-5 md:h-5 text-rose-400 fill-rose-400" />
      </motion.div>

      {/* Right — golden star */}
      <motion.div
        className="absolute top-1/4 -right-6 md:-right-10"
        animate={{ y: [0, -4, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-400 fill-amber-400" />
      </motion.div>

      {/* Bottom-right — sparkle */}
      <motion.div
        className="absolute bottom-1/4 -right-5 md:-right-8"
        animate={{ y: [0, -3, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
      </motion.div>

      {/* Bottom-left — heart */}
      <motion.div
        className="absolute bottom-1/3 -left-5 md:-left-8"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <Heart className="w-3.5 h-3.5 text-[var(--secondary)] fill-[var(--secondary)]" />
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
  // PERFORMANCE: Minimal version for mobile
  if (IS_MOBILE_DEVICE) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Static fog */}
        <div
          className="absolute bottom-0 inset-x-0 h-[40%] opacity-80"
          style={{
            background: 'linear-gradient(to top, rgba(109,40,217,0.12), rgba(109,40,217,0.06) 40%, transparent)',
          }}
        />
        {/* Single ghost with CSS animation */}
        <div
          className="absolute animate-float-moogle-subtle"
          style={{ left: '15%', top: '55%', animationDuration: '8s', opacity: 0.07 }}
        >
          <Ghost style={{ width: 28, height: 28 }} className="text-purple-400/60" strokeWidth={1} />
        </div>
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 35%, rgba(12,8,20,0.18) 100%)',
          }}
        />
      </div>
    );
  }
  // Ghost silhouettes that drift slowly across the screen
  const ghosts = useMemo(() => [
    { left: '5%', delay: 0, duration: 22, yStart: '60%', yEnd: '20%', drift: 80, size: 32, opacity: 0.08 },
    { left: '70%', delay: 6, duration: 26, yStart: '75%', yEnd: '15%', drift: -60, size: 28, opacity: 0.06 },
    { left: '35%', delay: 12, duration: 20, yStart: '80%', yEnd: '25%', drift: 50, size: 24, opacity: 0.07 },
    { left: '85%', delay: 3, duration: 24, yStart: '55%', yEnd: '10%', drift: -70, size: 30, opacity: 0.05 },
    { left: '20%', delay: 9, duration: 28, yStart: '70%', yEnd: '5%', drift: 40, size: 26, opacity: 0.06 },
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Fog layers — thick gradient mist at the bottom */}
      <motion.div
        className="absolute bottom-0 inset-x-0 h-[40%]"
        style={{
          background: 'linear-gradient(to top, rgba(109,40,217,0.12), rgba(109,40,217,0.06) 40%, transparent)',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 inset-x-0 h-[25%]"
        style={{
          background: 'linear-gradient(to top, rgba(74,222,128,0.06), rgba(34,197,94,0.03) 50%, transparent)',
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Drifting fog wisps — horizontal movement */}
      <motion.div
        className="absolute bottom-[5%] h-[15%] w-[60%] rounded-full blur-3xl"
        style={{ background: 'rgba(167,139,250,0.08)' }}
        animate={{ x: ['-10%', '110%'], opacity: [0, 0.12, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-[12%] h-[10%] w-[45%] rounded-full blur-3xl"
        style={{ background: 'rgba(249,115,22,0.06)' }}
        animate={{ x: ['110%', '-10%'], opacity: [0, 0.10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear', delay: 4 }}
      />

      {/* Eerie pulsing vignette — darker around the edges */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(12,8,20,0.18) 100%)',
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
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
            ease: 'easeInOut',
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
        { left: '10%', top: '70%', size: 120 },
        { left: '80%', top: '65%', size: 100 },
        { left: '45%', top: '80%', size: 140 },
      ].map((spot, i) => (
        <motion.div
          key={`lantern-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            left: spot.left,
            top: spot.top,
            width: spot.size,
            height: spot.size,
            background: 'radial-gradient(circle, rgba(249,115,22,0.15), rgba(251,191,36,0.08), transparent)',
          }}
          animate={{
            opacity: [0.3, 0.7, 0.2, 0.8, 0.3],
            scale: [1, 1.1, 0.95, 1.08, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.2,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Starlight Celebration — Gentle snowfall, twinkling christmas lights,
 * warm golden fireplace glow, and festive sparkles.
 *
 * PERFORMANCE: On mobile, shows 6 CSS snowflakes + static glow (instead of 60+ animated elements)
 */
function StarlightOverlay() {
  // PERFORMANCE: Minimal version for mobile — CSS-only, no Framer Motion
  if (IS_MOBILE_DEVICE) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
            background: 'linear-gradient(to top, rgba(217,119,6,0.10), rgba(251,191,36,0.05) 40%, transparent)',
          }}
        />
        {/* Snow accumulation */}
        <div
          className="absolute bottom-0 inset-x-0 h-[3%]"
          style={{
            background: 'linear-gradient(to top, rgba(255,255,255,0.06), transparent)',
          }}
        />
      </div>
    );
  }
  // Generate snowflake particles with deterministic positions
  const snowflakes = useMemo(() => {
    const flakes: Array<{
      left: string;
      size: number;
      delay: number;
      duration: number;
      drift: number;
      opacity: number;
      variant: 'flake' | 'dot';
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
        variant: i % 4 === 0 ? 'flake' : 'dot',
      });
    }
    return flakes;
  }, []);

  // Christmas string lights — colored bulbs draped across the top
  // Each segment sags between anchor points to create a natural catenary
  const STRING_LIGHT_COLORS = ['#EF4444', '#22C55E', '#FBBF24', '#3B82F6', '#EF4444', '#22C55E', '#FBBF24', '#3B82F6'];

  const stringLightBulbs = useMemo(() => {
    // Define the draped wire shape — anchor points with sag between them
    const anchors = [
      { x: 0, y: 6 },
      { x: 6, y: 18 },
      { x: 12, y: 8 },
      { x: 18, y: 22 },
      { x: 25, y: 10 },
      { x: 32, y: 24 },
      { x: 38, y: 8 },
      { x: 45, y: 20 },
      { x: 52, y: 6 },
      { x: 58, y: 22 },
      { x: 65, y: 10 },
      { x: 72, y: 26 },
      { x: 78, y: 8 },
      { x: 85, y: 20 },
      { x: 92, y: 10 },
      { x: 100, y: 16 },
    ];

    return anchors.map((pt, i) => ({
      x: pt.x,
      y: pt.y,
      color: STRING_LIGHT_COLORS[i % STRING_LIGHT_COLORS.length],
      delay: i * 0.25,
      size: 8 + (i % 3) * 2, // 8–12px bulbs
    }));
  }, []);

  // Build the SVG wire path from anchors (smooth catenary)
  const wirePath = useMemo(() => {
    const pts = stringLightBulbs.map(b => ({ x: b.x * 10, y: b.y })); // scale x to 0-1000
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx = (prev.x + curr.x) / 2;
      // Sag the control point lower for a natural drape
      const cpy = Math.max(prev.y, curr.y) + 8;
      d += ` Q ${cpx} ${cpy}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [stringLightBulbs]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Snowfall */}
      {snowflakes.map((flake, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: flake.left, top: '-5%' }}
          animate={{
            y: [0, typeof window !== 'undefined' ? window.innerHeight + 40 : 1000],
            x: [0, flake.drift, 0],
            rotate: [0, 360],
          }}
          transition={{
            y: { duration: flake.duration, repeat: Infinity, ease: 'linear', delay: flake.delay },
            x: { duration: flake.duration * 0.7, repeat: Infinity, ease: 'easeInOut', delay: flake.delay },
            rotate: { duration: flake.duration * 2, repeat: Infinity, ease: 'linear', delay: flake.delay },
          }}
        >
          {flake.variant === 'flake' ? (
            <Snowflake
              style={{ width: flake.size, height: flake.size, opacity: flake.opacity }}
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
                animate={{ opacity: [0.35, 0.75, 0.35], r: [r * 4.5, r * 5.5, r * 4.5] }}
                transition={{
                  duration: 2.5 + (i % 3) * 0.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
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
                style={{ filter: 'blur(1px)' }}
                animate={{ opacity: [0.25, 0.45, 0.25] }}
                transition={{
                  duration: 1.8 + (i % 4) * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
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
                  ease: 'easeInOut',
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
          background: 'linear-gradient(to top, rgba(217,119,6,0.10), rgba(251,191,36,0.05) 40%, transparent)',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Soft snow accumulation glow at the very bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-[3%]"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.06), transparent)',
        }}
      />

      {/* Festive sparkle bursts — brief twinkling stars scattered around */}
      {[
        { left: '15%', top: '20%', delay: 0 },
        { left: '75%', top: '15%', delay: 2 },
        { left: '55%', top: '35%', delay: 4.5 },
        { left: '25%', top: '70%', delay: 1.5 },
        { left: '85%', top: '60%', delay: 3.5 },
        { left: '45%', top: '85%', delay: 5.5 },
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
            ease: 'easeInOut',
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
  // PERFORMANCE: Skip event particles on mobile — too many animated elements
  if (IS_MOBILE_DEVICE) return null;
  // Generate stable positions for each particle
  const items = useMemo(() => {
    const result: Array<{
      Icon: EventParticle['icon'];
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
        const size = config.minSize + ((seed * 17) % (config.maxSize - config.minSize + 1));
        const opacity = config.minOpacity + ((seed * 23) % 100) / 100 * (config.maxOpacity - config.minOpacity);

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

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
            ease: 'easeInOut',
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

/** Event banner — a subtle pill showing the active event name */
function EventBanner({ event }: { event: SeasonalEvent }) {
  const EventIcon = event.icon;
  return (
    <motion.div
      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/15"
      initial={{ opacity: 0, y: -10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
    >
      <EventIcon className="w-3.5 h-3.5 text-[var(--primary)]" aria-hidden="true" />
      <span className="font-soft font-semibold text-[11px] sm:text-xs text-[var(--primary)]">
        {event.name}
      </span>
      <CalendarDays className="w-3 h-3 text-[var(--primary)]/60" aria-hidden="true" />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function Home() {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const { activeEvent, isEventThemeActive } = useTheme();

  // Determine quotes: event-specific or default
  const kupoQuotes = useMemo(
    () => (isEventThemeActive && activeEvent) ? activeEvent.kupoQuotes : DEFAULT_KUPO_QUOTES,
    [isEventThemeActive, activeEvent]
  );

  const [quoteIndex, setQuoteIndex] = useState(-1);

  // Time-aware values
  const timeGreeting = useMemo(() => getTimeGreeting(), []);
  const defaultTagline = useMemo(() => getTagline(), []);

  const firstGreeting = user
    ? `Welcome home, ${user.memberName.split(' ')[0]}!`
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

  const tagline = (isEventThemeActive && activeEvent)
    ? activeEvent.tagline
    : defaultTagline;

  // Render whimsical background blob
  const renderWhimsicalBlobs = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute w-[45vw] h-[45vw] min-w-[320px] min-h-[320px] opacity-[0.12] filter blur-[80px]"
        style={{
          background: isEventThemeActive && activeEvent?.id === 'all-saints-wake' ? '#a855f7' :
                      isEventThemeActive && activeEvent?.id === 'starlight' ? '#fbbf24' : 'var(--primary)',
          top: '-15%', left: '-8%'
        }}
        animate={{
          rotate: [0, 120, 240, 360],
          borderRadius: [
            "40% 60% 70% 30% / 40% 50% 60% 50%",
            "60% 40% 30% 70% / 50% 60% 40% 50%",
            "50% 50% 40% 60% / 60% 40% 50% 50%",
            "40% 60% 70% 30% / 40% 50% 60% 50%"
          ]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[40vw] h-[40vw] min-w-[280px] min-h-[280px] opacity-[0.10] filter blur-[70px]"
        style={{
          background: isEventThemeActive && activeEvent?.id === 'all-saints-wake' ? '#f97316' :
                      isEventThemeActive && activeEvent?.id === 'starlight' ? '#ef4444' : 'var(--secondary)',
          bottom: '5%', right: '-8%'
        }}
        animate={{
          rotate: [360, 240, 120, 0],
          borderRadius: [
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "40% 60% 70% 30% / 50% 60% 40% 50%",
            "50% 50% 60% 40% / 40% 50% 50% 60%",
            "60% 40% 30% 70% / 60% 30% 70% 40%"
          ]
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col relative bg-[var(--background)] selection:bg-[var(--primary)] selection:text-white overflow-hidden">
      
      {/* ── Background Atmospherics ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-colors duration-1000"
        style={{
          background: (isEventThemeActive && activeEvent)
            ? activeEvent.atmosphere.backgroundGradient
            : 'radial-gradient(ellipse at top left, color-mix(in srgb, var(--primary) 5%, transparent), transparent 70%), radial-gradient(ellipse at bottom right, color-mix(in srgb, var(--secondary) 8%, transparent), transparent 70%)',
        }}
        aria-hidden="true"
      />
      {!IS_MOBILE_DEVICE && renderWhimsicalBlobs()}
      <FairyLights lights={fairyLights} />
      {isEventThemeActive && activeEvent && <EventParticles particles={activeEvent.particles} />}
      {isEventThemeActive && activeEvent?.id === 'all-saints-wake' && <HalloweenOverlay />}
      {isEventThemeActive && activeEvent?.id === 'starlight' && <StarlightOverlay />}
      <FloatingMoogles moogles={floatingMoogles} opacityRange={[0.15, 0.3]} />

      {/* ── Main Layout ── */}
      {/* Mobile: pad for fixed top/bottom bars. Desktop: no padding needed (sidebar handles nav) */}
      <div className="flex-1 min-h-0 relative z-10 flex flex-col lg:flex-row items-center justify-center p-4 sm:p-8 lg:py-8 lg:px-12 pt-[calc(4rem+env(safe-area-inset-top))] md:pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-4">
        
        {/* ── Left Side: Whimsical Text & CTA ── */}
          <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left z-20">
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
          >
            <p className="eyebrow-script text-2xl sm:text-3xl md:text-5xl text-[var(--secondary)] mb-2 md:mb-4 -rotate-3 ml-2 lg:ml-6 filter drop-shadow-md">
              Welcome to
            </p>
          </motion.div>

          {/* Staggered Giant Title */}
          <motion.h1
            className="font-display font-black tracking-tighter leading-[0.8] mb-1 sm:mb-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, staggerChildren: 0.1 }}
          >
            <span className="block text-7xl sm:text-8xl md:text-[8rem] lg:text-[10rem] text-[var(--text)] drop-shadow-sm flex">
              {Array.from("Mog").map((char, i) => (
                <motion.span
                  key={`mog-${i}`}
                  className="inline-block hover:text-[var(--primary)] transition-colors duration-200 cursor-default"
                  whileHover={{ y: -15, rotate: i % 2 === 0 ? -6 : 6, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <span className="block text-7xl sm:text-8xl md:text-[8rem] lg:text-[10rem] text-highlight ml-4 sm:ml-12 lg:ml-24 flex">
              {Array.from("Tome").map((char, i) => (
                <motion.span
                  key={`tome-${i}`}
                  className="inline-block hover:text-[var(--secondary)] transition-colors duration-200 cursor-default"
                  whileHover={{ y: -15, rotate: i % 2 === 0 ? 6 : -6, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          <motion.div
            className="flex flex-col items-center lg:items-start gap-3 mb-10 ml-4 sm:ml-12 lg:ml-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <p className="text-xl sm:text-2xl md:text-[1.75rem] text-[var(--text-subtle)] font-display italic tracking-wide">
              {tagline.split('Kupo Life!').map((part, i, arr) => (
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

            {isEventThemeActive && activeEvent && <EventBanner event={activeEvent} />}
          </motion.div>

          <motion.div
            className="flex items-center justify-center lg:justify-start w-full lg:w-auto z-30 relative ml-0 sm:ml-8 lg:ml-20 mt-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.8 }}
          >
            {!isLoading && !isAuthenticated ? (
              <div className="relative group inline-block focus-visible:outline-none cursor-pointer">
                {/* Wobbly background for CTA */}
                <div className="absolute inset-[-10%] bg-[var(--primary)] opacity-20 rounded-[40%_60%_60%_40%/50%_50%_50%_50%] scale-[0.85] blur-lg group-hover:scale-100 group-hover:opacity-40 group-active:scale-95 transition-all duration-300" aria-hidden="true" />
                <Button
                  size="lg"
                  onClick={login}
                  className="relative gap-2.5 px-8 py-4 text-lg rounded-2xl shadow-lg border-2 border-transparent group-hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-[var(--primary)] text-white overflow-hidden w-full sm:w-auto focus-visible:ring-offset-[var(--background)]"
                >
                  {/* Subtle shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-150%] skew-x-[-45deg] group-hover:animate-shine pointer-events-none" aria-hidden="true" />
                  <DiscordIcon className="w-[1.35rem] h-[1.35rem] opacity-90" />
                  <span className="font-soft font-bold tracking-wide">Login with Discord</span>
                  <ArrowRight className="w-5 h-5 opacity-80 group-hover:opacity-100 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </div>
            ) : (
              <Link to="/members" className="relative group inline-block focus-visible:outline-none">
                {/* Wobbly background for CTA */}
                <div className="absolute inset-[-10%] bg-[var(--primary)] opacity-20 rounded-[40%_60%_60%_40%/50%_50%_50%_50%] scale-[0.85] blur-lg group-hover:scale-100 group-hover:opacity-40 group-active:scale-95 transition-all duration-300" aria-hidden="true" />
                <Button
                  size="lg"
                  className="relative gap-2.5 px-8 py-4 text-lg rounded-2xl shadow-lg border-2 border-transparent group-hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-[var(--primary)] text-white overflow-hidden"
                >
                  {/* Subtle shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-150%] skew-x-[-45deg] group-hover:animate-shine" aria-hidden="true" />
                  <Heart className="w-5 h-5 fill-white/20" />
                  <span className="font-soft font-bold tracking-wide">Enter the Book</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
            )}
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
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.4 }
            }}
            role="region"
            aria-label="Moogle greeting"
          >
            <div
              className="
                relative bg-[var(--card)]/95 backdrop-blur-md
                px-5 sm:px-7 py-3 sm:py-4
                rounded-[2rem] rounded-br-md
                shadow-xl border-2 border-[var(--border)]/60
                max-w-[260px] sm:max-w-[300px]
              "
            >
              {/* Thought bubble dots trailing down toward moogle */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-3 w-3.5 h-3.5 bg-[var(--card)]/95 rounded-full shadow-sm border border-[var(--border)]/40" aria-hidden="true" />
              <div className="absolute -bottom-7 left-1/2 translate-x-1 w-2.5 h-2.5 bg-[var(--card)]/95 rounded-full shadow-sm border border-[var(--border)]/40" aria-hidden="true" />
              <div className="absolute -bottom-10 left-1/2 translate-x-4 w-1.5 h-1.5 bg-[var(--primary)]/60 rounded-full" aria-hidden="true" />

              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex < 0 ? 'greeting' : quoteIndex}
                  className="font-accent text-base sm:text-lg md:text-xl text-[var(--primary)] text-center leading-snug font-bold"
                  initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.85, rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
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
            transition={{ type: "spring", bounce: 0.5, duration: 1.5, delay: 0.3 }}
          >
            <WarmMoogleAura eventId={isEventThemeActive && activeEvent ? activeEvent.id : null} />
            <MoogleCharms eventId={isEventThemeActive && activeEvent ? activeEvent.id : null} />
            
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
              onClick={() => setQuoteIndex(prev => (prev + 1) % kupoQuotes.length)}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              animate={{
                y: [-8, 12, -8],
                rotate: [-1.5, 2.5, -1.5],
              }}
              transition={{
                y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
            <WarmMotes motes={warmMotes} />
          </motion.div>

        </div>
      </div>

      {/* ── Cozy footer signature ── */}
      <div className="shrink-0 w-full flex justify-center py-2 z-10">
        <p className="font-accent text-[11px] text-[var(--text-subtle)] flex items-center gap-1.5">
          Crafted with <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400 animate-pulse" aria-hidden="true" /> inside a cozy nest
        </p>
      </div>

    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Heart, ArrowRight, Sparkles, Star,
  LogIn, BookOpen, Compass, CalendarDays,
  Ghost, Skull, Moon, Snowflake, TreePine, Gift,
} from 'lucide-react';

// Shared components
import {
  Button, FloatingMoogles, DiscordIcon, type MoogleConfig,
} from '../components';

// Contexts
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// PERFORMANCE: Detect mobile once at module level to avoid repeated checks
const IS_MOBILE_DEVICE = typeof window !== 'undefined' && (
  ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 768
);

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

const EXPLORE_LINKS = [
  { to: '/members', icon: Users, label: 'Our Family', color: 'var(--bento-primary)' },
  { to: '/chronicle', icon: BookOpen, label: 'Chronicle', color: 'var(--bento-secondary)' },
  { to: '/about', icon: Compass, label: 'About Us', color: 'var(--bento-accent)' },
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

/** Time-of-day tagline — shifts the vibe with the hour */
function getTimeTagline(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Your cozy morning awaits';
  if (hour >= 12 && hour < 17) return 'Your sunny afternoon awaits';
  if (hour >= 17 && hour < 21) return 'Your cozy evening awaits';
  return 'Your peaceful night awaits';
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
  // PERFORMANCE: On mobile, show only 4 lights with CSS animations instead of 12 Framer Motion instances
  const displayLights = IS_MOBILE_DEVICE ? lights.slice(0, 4) : lights;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {displayLights.map((light, i) => (
        IS_MOBILE_DEVICE ? (
          // Mobile: Use CSS animation (compositor thread) instead of Framer Motion (main thread)
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: light.left,
              top: light.top,
              width: light.size,
              height: light.size,
              backgroundColor: light.color,
              animationDuration: `${light.dur}s`,
              animationDelay: `${light.delay}s`,
            }}
          />
        ) : (
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
        )
      ))}
    </div>
  );
}

/** Warm floating embers — like sitting by a cozy fireplace */
function WarmMotes({ motes }: { motes: typeof DEFAULT_WARM_MOTES }) {
  // PERFORMANCE: On mobile, show only 2 motes instead of 6
  const displayMotes = IS_MOBILE_DEVICE ? motes.slice(0, 2) : motes;

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] pointer-events-none"
      aria-hidden="true"
    >
      {displayMotes.map((mote, i) => (
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
  // PERFORMANCE: On mobile, use a single static glow instead of animated blur layers
  if (IS_MOBILE_DEVICE) {
    return (
      <div
        className="absolute inset-0 scale-[1.8] rounded-full blur-3xl opacity-30"
        style={{
          background: eventId === 'all-saints-wake'
            ? 'radial-gradient(circle, rgba(109,40,217,0.3), rgba(249,115,22,0.15), transparent)'
            : eventId === 'starlight'
              ? 'radial-gradient(circle, rgba(220,38,38,0.25), rgba(251,191,36,0.2), transparent)'
              : 'radial-gradient(circle, var(--bento-primary), rgba(251,191,36,0.2), transparent)',
        }}
        aria-hidden="true"
      />
    );
  }
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
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--bento-primary)]/30 via-amber-400/25 to-[var(--bento-secondary)]/30 blur-3xl" />
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
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400/25 via-[var(--bento-accent)]/20 to-rose-400/20 blur-2xl" />
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
        <Heart className="w-3.5 h-3.5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
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
        <Sparkles className="w-3.5 h-3.5 text-[var(--bento-accent)]" />
      </motion.div>

      {/* Bottom-left — heart */}
      <motion.div
        className="absolute bottom-1/3 -left-5 md:-left-8"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <Heart className="w-3.5 h-3.5 text-[var(--bento-secondary)] fill-[var(--bento-secondary)]" />
      </motion.div>
    </motion.div>
  );
}

/** Discord login CTA — compact */
function DiscordLoginCTA({ onLogin }: { onLogin: () => void }) {
  return (
    <motion.button
      onClick={onLogin}
      className="
        group flex items-center justify-center gap-2.5
        px-6 py-3 sm:py-3.5 rounded-2xl
        bg-[#5865F2] text-white
        font-soft font-semibold text-base sm:text-lg
        shadow-xl shadow-[#5865F2]/30
        sm:hover:bg-[#4752C4] sm:hover:shadow-2xl sm:hover:shadow-[#5865F2]/40
        active:bg-[#4752C4] active:scale-[0.97]
        focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2
        focus-visible:ring-offset-[#5865F2] focus-visible:outline-none
        transition-all duration-150 cursor-pointer touch-manipulation
      "
      whileTap={{ scale: 0.97 }}
    >
      <DiscordIcon className="w-5 h-5" />
      <span>Login with Discord</span>
      <LogIn className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
    </motion.button>
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
      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bento-primary)]/10 border border-[var(--bento-primary)]/15"
      initial={{ opacity: 0, y: -10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
    >
      <EventIcon className="w-3.5 h-3.5 text-[var(--bento-primary)]" aria-hidden="true" />
      <span className="font-soft font-semibold text-[11px] sm:text-xs text-[var(--bento-primary)]">
        {event.name}
      </span>
      <CalendarDays className="w-3 h-3 text-[var(--bento-primary)]/60" aria-hidden="true" />
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

  // Time-aware values — computed once on mount
  const timeGreeting = useMemo(() => getTimeGreeting(), []);
  const timeTagline = useMemo(() => getTimeTagline(), []);

  // Personal greeting for authenticated users, time-based for visitors
  const firstGreeting = user
    ? `Welcome home, ${user.memberName.split(' ')[0]}!`
    : timeGreeting;

  // -1 = personal/time greeting, 0+ = regular quote rotation
  const displayQuote = quoteIndex < 0 ? firstGreeting : kupoQuotes[quoteIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % kupoQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [kupoQuotes]);

  // Event-derived atmosphere
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

  // Event tagline overrides the time-based tagline
  const tagline = (isEventThemeActive && activeEvent)
    ? activeEvent.tagline
    : timeTagline;

  return (
    <div
      className="
        h-[100dvh] w-full overflow-hidden
        flex flex-col relative
        pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0
        pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0
      "
    >
      {/* ── Atmosphere ──────────────────────────────────────────────── */}

      {/* Base theme gradient — uses event colors when active */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: (isEventThemeActive && activeEvent)
            ? activeEvent.atmosphere.backgroundGradient
            : undefined,
        }}
        aria-hidden="true"
      />
      {/* Fallback default gradient when no event is active */}
      {!isEventThemeActive && (
        <div
          className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.06] via-[var(--bento-accent)]/[0.03] to-[var(--bento-secondary)]/[0.05] pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Center glow — adapts to event */}
      <div
        className="
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%]
          w-[min(700px,100vw)] h-[min(700px,100vw)]
          rounded-full blur-3xl pointer-events-none
        "
        style={{
          background: (isEventThemeActive && activeEvent)
            ? `radial-gradient(circle, ${activeEvent.atmosphere.centerGlowFrom}, ${activeEvent.atmosphere.centerGlowVia}, transparent)`
            : undefined,
        }}
        aria-hidden="true"
      />
      {/* Fallback default center glow */}
      {!isEventThemeActive && (
        <div
          className="
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%]
            w-[min(700px,100vw)] h-[min(700px,100vw)]
            rounded-full
            bg-gradient-radial from-amber-400/[0.08] via-orange-300/[0.04] to-transparent
            blur-3xl pointer-events-none
          "
          aria-hidden="true"
        />
      )}

      {/* Soft vignette — draws eye to the warm center */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.08) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Fairy lights — warm twinkling dots (event-aware colors) */}
      <FairyLights lights={fairyLights} />

      {/* Event particles — floating icon decorations during events */}
      {isEventThemeActive && activeEvent && (
        <EventParticles particles={activeEvent.particles} />
      )}

      {/* Flagship event overlays — All Saints' Wake & Starlight get the full treatment */}
      {isEventThemeActive && activeEvent?.id === 'all-saints-wake' && <HalloweenOverlay />}
      {isEventThemeActive && activeEvent?.id === 'starlight' && <StarlightOverlay />}

      {/* Background moogles — slightly more visible for coziness */}
      <FloatingMoogles moogles={floatingMoogles} opacityRange={[0.12, 0.22]} />

      {/* ── Content — fills viewport exactly ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 py-3 md:py-6 min-h-0">

        {/* ── Cozy nest — warm pillowy card that grounds everything ── */}
        <motion.div
          className="
            relative max-w-lg w-full
            bg-gradient-to-b from-[var(--bento-card)]/40 via-[var(--bento-card)]/55 to-[var(--bento-card)]/65
            backdrop-blur-xl
            rounded-[2rem] sm:rounded-[2.5rem]
            px-5 sm:px-7 md:px-9
            pt-3 sm:pt-5 md:pt-6
            pb-5 sm:pb-6 md:pb-8
            border border-[var(--bento-primary)]/[0.12]
          "
          style={{
            boxShadow: isEventThemeActive && activeEvent?.id === 'all-saints-wake'
              ? '0 8px 60px -12px rgba(109,40,217,0.20), 0 0 100px -20px rgba(249,115,22,0.12), 0 0 40px -8px rgba(74,222,128,0.08), 0 2px 20px -4px rgba(0,0,0,0.10)'
              : isEventThemeActive && activeEvent?.id === 'starlight'
                ? '0 8px 60px -12px rgba(220,38,38,0.15), 0 0 100px -20px rgba(251,191,36,0.12), 0 0 40px -8px rgba(22,163,74,0.08), 0 2px 20px -4px rgba(0,0,0,0.06)'
                : '0 8px 50px -12px rgba(251,191,36,0.10), 0 0 80px -20px rgba(251,113,133,0.05), 0 2px 20px -4px rgba(0,0,0,0.06)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Inner glow at top — adapts to flagship events */}
          <div
            className={`absolute top-0 inset-x-0 h-44 rounded-t-[2rem] sm:rounded-t-[2.5rem] bg-gradient-to-b pointer-events-none ${
              isEventThemeActive && activeEvent?.id === 'all-saints-wake'
                ? 'from-purple-500/[0.10] via-orange-400/[0.04] to-transparent'
                : isEventThemeActive && activeEvent?.id === 'starlight'
                  ? 'from-amber-400/[0.10] via-red-400/[0.04] to-transparent'
                  : 'from-amber-400/[0.07] via-amber-400/[0.03] to-transparent'
            }`}
            aria-hidden="true"
          />

          {/* Corner decorations — event-aware */}
          {isEventThemeActive && activeEvent?.id === 'all-saints-wake' ? (
            <>
              <Ghost className="absolute top-3 left-3.5 sm:top-4 sm:left-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400/30" aria-hidden="true" />
              <Skull className="absolute top-3 right-3.5 sm:top-4 sm:right-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400/30" aria-hidden="true" />
              <Moon className="absolute bottom-3 left-3.5 sm:bottom-4 sm:left-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-300/25" aria-hidden="true" />
              <Ghost className="absolute bottom-3 right-3.5 sm:bottom-4 sm:right-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-400/25" aria-hidden="true" />
            </>
          ) : isEventThemeActive && activeEvent?.id === 'starlight' ? (
            <>
              <Snowflake className="absolute top-3 left-3.5 sm:top-4 sm:left-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-300/30" aria-hidden="true" />
              <Star className="absolute top-3 right-3.5 sm:top-4 sm:right-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300/30 fill-amber-300/30" aria-hidden="true" />
              <TreePine className="absolute bottom-3 left-3.5 sm:bottom-4 sm:left-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-400/25" aria-hidden="true" />
              <Gift className="absolute bottom-3 right-3.5 sm:bottom-4 sm:right-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400/25" aria-hidden="true" />
            </>
          ) : (
            <>
              <Heart className="absolute top-3 left-3.5 sm:top-4 sm:left-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--bento-primary)]/25 fill-[var(--bento-primary)]/25" aria-hidden="true" />
              <Heart className="absolute top-3 right-3.5 sm:top-4 sm:right-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--bento-secondary)]/25 fill-[var(--bento-secondary)]/25" aria-hidden="true" />
              <Star className="absolute bottom-3 left-3.5 sm:bottom-4 sm:left-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--bento-secondary)]/20 fill-[var(--bento-secondary)]/20" aria-hidden="true" />
              <Star className="absolute bottom-3 right-3.5 sm:bottom-4 sm:right-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--bento-primary)]/20 fill-[var(--bento-primary)]/20" aria-hidden="true" />
            </>
          )}

          {/* Warm embers drifting upward — fireplace warmth (event-aware) */}
          <WarmMotes motes={warmMotes} />

          <div className="relative flex flex-col items-center text-center">

          {/* ── Event banner (shown during active events) ──────────── */}
          {isEventThemeActive && activeEvent && (
            <div className="mb-1">
              <EventBanner event={activeEvent} />
            </div>
          )}

          {/* ── Moogle mascot with warm glow ─────────────────────────── */}
          <motion.div
            className="relative inline-block mb-1"
            initial={{ opacity: 0, scale: 0.4, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.15 }}
          >
            <WarmMoogleAura eventId={isEventThemeActive && activeEvent ? activeEvent.id : null} />
            <MoogleCharms eventId={isEventThemeActive && activeEvent ? activeEvent.id : null} />

            {/* The moogle — gently floating + happy sway */}
            <motion.img
              src={welcomingMoogle}
              alt="A friendly moogle mascot welcoming you to MogTome"
              className="relative w-32 sm:w-40 md:w-48 lg:w-56 sm:drop-shadow-2xl"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              animate={{
                y: [0, -7, 0],
                rotate: [-1.5, 1.5, -1.5],
              }}
              transition={{
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          </motion.div>

          {/* ── Speech bubble — cozy round shape ─────────────────────── */}
          <motion.div
            className="relative mb-1.5 sm:mb-2"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.35 }}
            role="region"
            aria-label="Moogle greeting"
          >
            <div
              className="
                relative bg-[var(--bento-card)]/90 backdrop-blur-md
                rounded-3xl px-5 sm:px-6 py-3 sm:py-3.5
                border border-[var(--bento-primary)]/10
                max-w-[280px] sm:max-w-[320px] mx-auto
                ${isEventThemeActive && activeEvent?.id === 'all-saints-wake'
                  ? 'shadow-lg shadow-purple-500/[0.12]'
                  : isEventThemeActive && activeEvent?.id === 'starlight'
                    ? 'shadow-lg shadow-amber-500/[0.10]'
                    : 'shadow-lg shadow-amber-500/[0.06]'}
              "
            >
              {/* Rounded bubble tail */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2" aria-hidden="true">
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[14px] border-b-[var(--bento-card)]" />
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex < 0 ? 'greeting' : quoteIndex}
                  className="font-accent text-lg sm:text-xl md:text-2xl text-[var(--bento-text)] text-center leading-snug"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  &ldquo;{displayQuote}&rdquo;
                </motion.p>
              </AnimatePresence>
            </div>
            <p
              className="font-accent text-xs sm:text-sm text-[var(--bento-text-muted)] mt-1.5"
              aria-hidden="true"
            >
              {isEventThemeActive && activeEvent?.id === 'all-saints-wake'
                ? '~ whispers the spooky moogle ~'
                : isEventThemeActive && activeEvent?.id === 'starlight'
                  ? '~ hums the festive moogle ~'
                  : '~ says the friendly moogle ~'}
            </p>
          </motion.div>

          {/* ── Heart divider — handmade decorative touch ────────────── */}
          <div className="flex items-center justify-center gap-2.5 mb-2 sm:mb-3" aria-hidden="true">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-[var(--bento-primary)]/35" />
            <Heart className="w-3 h-3 text-[var(--bento-primary)]/45 fill-[var(--bento-primary)]/45" />
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-[var(--bento-primary)]/35" />
          </div>

          {/* ── Title area ───────────────────────────────────────────── */}
          <motion.div
            className="mb-4 sm:mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Handwritten welcome */}
            <p className="font-accent text-base sm:text-lg md:text-xl text-[var(--bento-secondary)] mb-0.5">
              Welcome to
            </p>

            {/* Main title with warm glow */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-1.5"
              style={{
                textShadow: '0 0 50px color-mix(in srgb, var(--bento-primary), transparent 65%), 0 0 100px rgba(251,191,36,0.08)',
              }}
            >
              <span className="bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent">
                MogTome
              </span>
            </h1>

            {/* Cozy tagline — event or time-based */}
            <p className="text-sm sm:text-base text-[var(--bento-text-muted)] font-soft max-w-xs mx-auto leading-snug flex items-center justify-center gap-1.5">
              {tagline}
              {isEventThemeActive && activeEvent ? (
                <activeEvent.icon className="w-3.5 h-3.5 text-[var(--bento-primary)] shrink-0" aria-hidden="true" />
              ) : (
                <Heart className="w-3.5 h-3.5 text-[var(--bento-primary)] fill-[var(--bento-primary)] shrink-0" aria-hidden="true" />
              )}
            </p>
          </motion.div>

          {/* ── CTA ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
          >
            {!isLoading && !isAuthenticated ? (
              <DiscordLoginCTA onLogin={login} />
            ) : (
              <Link to="/members">
                <Button
                  size="lg"
                  className="gap-2.5 px-7 py-3.5 text-base group shadow-xl shadow-[var(--bento-primary)]/30"
                >
                  <Heart className="w-4 h-4" />
                  <span className="font-soft font-semibold">Meet the Family</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </motion.div>

          </div>
        </motion.div>

        {/* ── Bottom bar — explore + footer ──────────────────────────── */}
        <motion.div
          className="absolute bottom-2 sm:bottom-3 md:bottom-5 inset-x-0 text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {/* Explore pills */}
          <nav
            className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-2"
            aria-label="Quick explore"
          >
            {EXPLORE_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="
                  group inline-flex items-center gap-1.5 px-3 py-1.5
                  bg-[var(--bento-card)]/50 backdrop-blur-sm
                  border border-[var(--bento-border)]/40
                  rounded-full
                  sm:hover:border-[var(--bento-primary)]/30 sm:hover:bg-[var(--bento-card)]/80
                  active:scale-[0.97]
                  transition-all duration-200 touch-manipulation
                  focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                "
              >
                <link.icon
                  className="w-3 h-3"
                  style={{ color: link.color }}
                  aria-hidden="true"
                />
                <span className="font-soft font-medium text-xs sm:text-sm text-[var(--bento-text-muted)]">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Mini footer */}
          <p className="font-accent text-[11px] sm:text-xs text-[var(--bento-text-subtle)] flex items-center justify-center gap-1">
            Made with
            <Heart
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400 fill-rose-400"
              aria-hidden="true"
            />
            <span className="sr-only">love</span>
            by moogles, for moogles
          </p>
        </motion.div>
      </div>
    </div>
  );
}

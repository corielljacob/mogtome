import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Heart, ArrowRight, Sparkles, Star,
  LogIn, BookOpen, Compass,
} from 'lucide-react';

// Shared components
import {
  Button, FloatingMoogles, DiscordIcon, type MoogleConfig,
} from '../components';

// Contexts
import { useAuth } from '../contexts/AuthContext';

// Assets
import welcomingMoogle from '../assets/moogles/mooglef fly transparent.webp';
import wizardMoogle from '../assets/moogles/wizard moogle.webp';
import flyingMoogles from '../assets/moogles/moogles flying.webp';
import musicMoogle from '../assets/moogles/moogle playing music.webp';
import lilGuyMoogle from '../assets/moogles/lil guy moogle.webp';

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

const kupoQuotes = [
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

// Warm twinkling dots positioned around the viewport edges
const FAIRY_LIGHTS = [
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

// Warm floating embers that drift up inside the cozy card — like a fireplace
const WARM_MOTES = [
  { left: '12%', size: 3, color: 'rgba(251,191,36,0.30)', duration: 9, delay: 0, drift: 18 },
  { left: '30%', size: 2.5, color: 'rgba(251,113,133,0.25)', duration: 11, delay: 2.5, drift: -14 },
  { left: '50%', size: 3, color: 'rgba(251,191,36,0.25)', duration: 10, delay: 4, drift: 22 },
  { left: '70%', size: 2.5, color: 'rgba(252,165,165,0.28)', duration: 12, delay: 1.5, drift: -18 },
  { left: '88%', size: 2.5, color: 'rgba(251,191,36,0.22)', duration: 10, delay: 6, drift: 12 },
  { left: '40%', size: 2.5, color: 'rgba(251,113,133,0.22)', duration: 11, delay: 3.5, drift: -10 },
];

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

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Twinkling warm fairy lights — like a string of cozy golden fireflies */
function FairyLights() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {FAIRY_LIGHTS.map((light, i) => (
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
function WarmMotes() {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] pointer-events-none"
      aria-hidden="true"
    >
      {WARM_MOTES.map((mote, i) => (
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

/** Warm golden glow aura behind the moogle — like a cozy lantern */
function WarmMoogleAura() {
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

/** Hearts and stars that float around the moogle */
function MoogleCharms() {
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
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function Home() {
  const [quoteIndex, setQuoteIndex] = useState(-1);
  const { user, isAuthenticated, isLoading, login } = useAuth();

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
  }, []);

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

      {/* Base theme gradient */}
      <div
        className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.06] via-[var(--bento-accent)]/[0.03] to-[var(--bento-secondary)]/[0.05] pointer-events-none"
        aria-hidden="true"
      />

      {/* Warm amber center glow — cozy lantern */}
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

      {/* Soft vignette — draws eye to the warm center */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.08) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Fairy lights — warm twinkling dots */}
      <FairyLights />

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
            boxShadow: '0 8px 50px -12px rgba(251,191,36,0.10), 0 0 80px -20px rgba(251,113,133,0.05), 0 2px 20px -4px rgba(0,0,0,0.06)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Warm inner glow at top — the lantern light */}
          <div
            className="absolute top-0 inset-x-0 h-44 rounded-t-[2rem] sm:rounded-t-[2.5rem] bg-gradient-to-b from-amber-400/[0.07] via-amber-400/[0.03] to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Corner hearts — tiny cozy decorations */}
          <Heart className="absolute top-3 left-3.5 sm:top-4 sm:left-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--bento-primary)]/25 fill-[var(--bento-primary)]/25" aria-hidden="true" />
          <Heart className="absolute top-3 right-3.5 sm:top-4 sm:right-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--bento-secondary)]/25 fill-[var(--bento-secondary)]/25" aria-hidden="true" />
          <Star className="absolute bottom-3 left-3.5 sm:bottom-4 sm:left-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--bento-secondary)]/20 fill-[var(--bento-secondary)]/20" aria-hidden="true" />
          <Star className="absolute bottom-3 right-3.5 sm:bottom-4 sm:right-5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--bento-primary)]/20 fill-[var(--bento-primary)]/20" aria-hidden="true" />

          {/* Warm embers drifting upward — fireplace warmth */}
          <WarmMotes />

          <div className="relative flex flex-col items-center text-center">

          {/* ── Moogle mascot with warm glow ─────────────────────────── */}
          <motion.div
            className="relative inline-block mb-1"
            initial={{ opacity: 0, scale: 0.4, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.15 }}
          >
            <WarmMoogleAura />
            <MoogleCharms />

            {/* The moogle — gently floating + happy sway */}
            <motion.img
              src={welcomingMoogle}
              alt="A friendly moogle mascot welcoming you to MogTome"
              className="relative w-32 sm:w-40 md:w-48 lg:w-56 drop-shadow-2xl"
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
                shadow-lg shadow-amber-500/[0.06]
                border border-[var(--bento-primary)]/10
                max-w-[280px] sm:max-w-[320px] mx-auto
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
              ~ says the friendly moogle ~
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

            {/* Cozy tagline */}
            <p className="text-sm sm:text-base text-[var(--bento-text-muted)] font-soft max-w-xs mx-auto leading-snug flex items-center justify-center gap-1.5">
              {timeTagline}
              <Heart className="w-3.5 h-3.5 text-[var(--bento-primary)] fill-[var(--bento-primary)] shrink-0" aria-hidden="true" />
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

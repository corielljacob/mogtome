import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Heart, ArrowRight, Sparkles, Star, LogIn } from 'lucide-react';

// Shared components
import { Button, StoryDivider, FloatingSparkles, FloatingMoogles, type MoogleConfig } from '../components';

// Contexts
import { useAuth } from '../contexts/AuthContext';

// Assets
import welcomingMoogle from '../assets/moogles/mooglef fly transparent.webp';
import wizardMoogle from '../assets/moogles/wizard moogle.webp';
import flyingMoogles from '../assets/moogles/moogles flying.webp';
import musicMoogle from '../assets/moogles/moogle playing music.webp';
import lilGuyMoogle from '../assets/moogles/lil guy moogle.webp';

// PERFORMANCE: Preload critical hero image
if (typeof window !== 'undefined') {
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'image';
  preloadLink.href = welcomingMoogle;
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
];

const floatingMoogles: MoogleConfig[] = [
  { src: wizardMoogle, position: 'top-16 left-4 md:left-16', size: 'w-24 md:w-36', rotate: -12, delay: 0 },
  { src: flyingMoogles, position: 'top-24 right-0 md:right-8', size: 'w-32 md:w-48', rotate: 8, delay: 0.5 },
  { src: musicMoogle, position: 'bottom-32 left-4 md:left-20', size: 'w-20 md:w-32', rotate: 6, delay: 1 },
  { src: lilGuyMoogle, position: 'bottom-20 right-8 md:right-24', size: 'w-18 md:w-28', rotate: -8, delay: 1.5 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Decorative corner flourishes */
function CornerFlourish({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const positionClasses = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3 scale-x-[-1]',
    'bottom-left': 'bottom-3 left-3 scale-y-[-1]',
    'bottom-right': 'bottom-3 right-3 scale-[-1]',
  };

  return (
    <svg 
      className={`absolute ${positionClasses[position]} w-14 h-14 md:w-20 md:h-20`}
      viewBox="0 0 50 50" 
      fill="none"
      aria-hidden="true"
    >
      <path 
        d="M5 45 Q5 5 45 5" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        className="text-[var(--bento-primary)]/30"
      />
      <circle cx="45" cy="5" r="4" className="fill-[var(--bento-secondary)]/50" />
      <path 
        d="M10 40 Q10 15 35 10" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
        className="text-[var(--bento-secondary)]/35"
      />
      <circle cx="5" cy="45" r="2.5" className="fill-[var(--bento-primary)]/40" />
    </svg>
  );
}

/** Discord brand icon */
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

/** Discord login CTA for unauthenticated users */
function DiscordLoginCTA({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="w-full max-w-sm mx-auto px-2 sm:px-0">
      {/* Discord login button */}
      <motion.button
        onClick={onLogin}
        className="
          group w-full flex items-center justify-center gap-2 sm:gap-3
          px-6 sm:px-8 py-3 sm:py-4 rounded-2xl
          bg-[#5865F2] text-white
          font-soft font-semibold text-base sm:text-lg
          shadow-xl shadow-[#5865F2]/30
          hover:bg-[#4752C4] hover:shadow-2xl hover:shadow-[#5865F2]/40
          focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#5865F2] focus-visible:outline-none
          transition-all duration-200 cursor-pointer
        "
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <DiscordIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        <span>Login with Discord</span>
        <LogIn className="w-4 h-4 sm:w-5 sm:h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </motion.button>

      {/* Feature preview */}
      <p className="mt-3 sm:mt-4 text-center text-sm text-[var(--bento-text-muted)] font-soft">
        Sign in to unlock the full experience
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function Home() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const { isAuthenticated, isLoading, login } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % kupoQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Warm gradient overlay - extends full viewport behind header/nav */}
      <div className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.08] via-[var(--bento-accent)]/[0.04] to-[var(--bento-secondary)]/[0.06] pointer-events-none" />
      
      {/* Floating background moogles */}
      <FloatingMoogles moogles={floatingMoogles} />
      
      {/* Floating sparkles */}
      <FloatingSparkles />

      {/* Main content with decorative frame */}
      <section className="flex-1 flex items-center justify-center px-4 py-8 md:py-16 relative z-10">
        <div className="relative max-w-2xl mx-auto">
          {/* Decorative frame card */}
          <motion.div 
            className="relative bg-[var(--bento-card)]/60 backdrop-blur-sm rounded-3xl p-5 sm:p-8 md:p-12 border border-[var(--bento-primary)]/10 shadow-xl shadow-[var(--bento-primary)]/5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Corner flourishes */}
            <CornerFlourish position="top-left" />
            <CornerFlourish position="top-right" />
            <CornerFlourish position="bottom-left" />
            <CornerFlourish position="bottom-right" />

            <div className="text-center relative">
              {/* "Once upon a time" opener - storybook style */}
              <motion.p
                className="font-accent text-xl sm:text-2xl md:text-3xl text-[var(--bento-secondary)] mb-6 sm:mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                ~ A cozy corner awaits ~
              </motion.p>

              {/* Moogle mascot with decorations */}
              <motion.div 
                className="relative inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                {/* Soft dreamy glow */}
                <div className="absolute inset-0 bg-gradient-radial from-[var(--bento-primary)]/30 via-[var(--bento-accent)]/20 to-transparent blur-3xl scale-[2]" />
                
                {/* Decorative elements - only on sides */}
                <motion.div 
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  {/* Left side */}
                  <motion.div 
                    className="absolute top-1/3 -left-10 md:-left-14"
                    animate={{ y: [0, -6, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Star className="w-5 h-5 text-[var(--bento-secondary)] fill-[var(--bento-secondary)]" />
                  </motion.div>
                  {/* Right side */}
                  <motion.div 
                    className="absolute top-1/3 -right-10 md:-right-14"
                    animate={{ y: [0, -6, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    <Sparkles className="w-5 h-5 text-[var(--bento-primary)]" />
                  </motion.div>
                  {/* Top left accent */}
                  <motion.div 
                    className="absolute top-0 -left-6 md:-left-8"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <Heart className="w-4 h-4 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
                  </motion.div>
                </motion.div>
                
              {/* Main moogle */}
              <motion.img 
                src={welcomingMoogle} 
                alt="A friendly moogle mascot welcoming you to MogTome" 
                className="relative w-36 sm:w-44 md:w-56 lg:w-64 drop-shadow-2xl"
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{ 
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              </motion.div>

              {/* Kupo speech bubble */}
              <motion.div
                className="mb-5 relative -mt-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                role="region"
                aria-label="Moogle greeting"
              >
                {/* Speech bubble */}
                <div className="relative bg-[var(--bento-card)] rounded-2xl px-3 sm:px-6 py-3 sm:py-4 shadow-lg border border-[var(--bento-primary)]/15 w-[calc(100vw-3rem)] max-w-[280px] sm:max-w-[360px] min-h-[60px] sm:min-h-[80px] flex items-center justify-center mx-auto">
                  {/* Bubble tail pointing up */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2" aria-hidden="true">
                    <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[22px] border-b-[var(--bento-card)]" />
                    <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[24px] border-b-[var(--bento-primary)]/15 -z-10" />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={quoteIndex}
                      className="font-accent text-xl sm:text-2xl md:text-3xl text-[var(--bento-text)] text-center leading-tight"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      "{kupoQuotes[quoteIndex]}"
                    </motion.p>
                  </AnimatePresence>
                </div>
                <p className="font-accent text-base sm:text-lg md:text-xl text-[var(--bento-text-muted)] mt-3 sm:mt-4" aria-hidden="true">
                  ~ says the friendly moogle ~
                </p>
              </motion.div>

              {/* Decorative divider */}
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <StoryDivider size="lg" />
              </motion.div>

              {/* Main heading */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-3 sm:mb-4">
                  <span className="text-[var(--bento-primary)]">Mog</span>
                  <span className="text-[var(--bento-secondary)]">Tome</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-[var(--bento-text-muted)] font-soft max-w-md mx-auto leading-relaxed mb-2 sm:mb-3 px-2 sm:px-0">
                  The cozy home of <span className="text-[var(--bento-primary)] font-semibold">Kupo Life!</span> — where moogles gather, 
                  adventures are shared, and everyone belongs.
                </p>
                <p className="font-accent text-lg sm:text-xl text-[var(--bento-secondary)]">
                  ✧ Our Free Company's digital hearth ✧
                </p>
              </motion.div>

              {/* CTA button - Discord login for unauthenticated, Meet the Family for authenticated */}
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {!isLoading && !isAuthenticated ? (
                  <DiscordLoginCTA onLogin={login} />
                ) : (
                  <Link to="/members">
                    <Button 
                      size="lg" 
                      className="gap-2 sm:gap-2.5 px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg group shadow-xl shadow-[var(--bento-primary)]/30 hover:shadow-2xl hover:shadow-[var(--bento-primary)]/40 transition-all duration-300"
                    >
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-soft font-semibold">Meet the Family</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - storybook closing */}
      <footer className="py-8 px-4 relative z-10" style={{ paddingBottom: 'calc(2rem + var(--safe-area-inset-bottom, 0px))' }} role="contentinfo">
        <motion.div 
          className="max-w-md mx-auto text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <StoryDivider className="mx-auto mb-4 opacity-70" />
          <p className="font-accent text-xl text-[var(--bento-text-muted)] flex items-center justify-center gap-2">
            Made with 
            <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" aria-hidden="true" />
            <span className="sr-only">love</span>
            by moogles, for moogles
          </p>
          <p className="font-accent text-lg text-[var(--bento-secondary)] mt-2" aria-hidden="true">
            ~ fin ~
          </p>
        </motion.div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import { Users, Heart, ArrowRight, Sparkles, Star, Scroll, ChevronRight, Sun, Moon } from 'lucide-react';

// Shared components
import { Button, StoryDivider, FloatingSparkles, FloatingMoogles, type MoogleConfig } from '../components';

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

// Desktop floating moogles
const floatingMoogles: MoogleConfig[] = [
  { src: wizardMoogle, position: 'top-16 left-4 md:left-16', size: 'w-24 md:w-36', rotate: -12, delay: 0 },
  { src: flyingMoogles, position: 'top-24 right-0 md:right-8', size: 'w-32 md:w-48', rotate: 8, delay: 0.5 },
  { src: musicMoogle, position: 'bottom-32 left-4 md:left-20', size: 'w-20 md:w-32', rotate: 6, delay: 1 },
  { src: lilGuyMoogle, position: 'bottom-20 right-8 md:right-24', size: 'w-18 md:w-28', rotate: -8, delay: 1.5 },
];

// Mobile quick action cards
const quickActions = [
  {
    to: '/members',
    icon: Users,
    title: 'The Family',
    subtitle: 'Meet your FC crew',
    gradient: 'from-rose-500 to-pink-600',
    delay: 0.1,
  },
  {
    to: '/chronicle',
    icon: Scroll,
    title: 'Chronicle',
    subtitle: 'Recent happenings',
    gradient: 'from-violet-500 to-purple-600',
    delay: 0.2,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Desktop: Decorative corner flourishes */
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

/** Mobile: Premium theme toggle button */
function MobileThemeToggle() {
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const color = isDark ? '#1A1722' : '#FFF9F5';
    const metas = document.querySelectorAll('meta[name="theme-color"]');
    metas.forEach(meta => {
      meta.setAttribute('content', color);
      meta.removeAttribute('media');
    });
  }, [isDark]);

  return (
    <motion.button
      onClick={() => setIsDark(prev => !prev)}
      className="w-10 h-10 rounded-xl bg-[var(--bento-card)]/80 border border-[var(--bento-border)]/30 flex items-center justify-center"
      style={{
        WebkitBackdropFilter: 'blur(12px)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-[var(--bento-secondary)]" />
        ) : (
          <Sun className="w-5 h-5 text-[var(--bento-primary)]" />
        )}
      </motion.div>
    </motion.button>
  );
}

/** Mobile: Premium quick action card with depth and polish */
function QuickActionCard({ 
  to, 
  icon: Icon, 
  title, 
  subtitle, 
  gradient, 
  delay 
}: typeof quickActions[0]) {
  return (
    <Link to={to} className="block flex-1">
      <motion.div
        className={`
          relative overflow-hidden
          bg-gradient-to-br ${gradient}
          rounded-[20px] p-4
        `}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          delay, 
          type: "spring", 
          stiffness: 350, 
          damping: 25,
        }}
        whileTap={{ scale: 0.95, y: 2 }}
        style={{
          boxShadow: '0 8px 24px -4px rgba(0,0,0,0.15), 0 4px 8px -2px rgba(0,0,0,0.1)',
        }}
      >
        {/* Premium glossy overlay with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        
        {/* Subtle noise texture for depth */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} 
        />
        
        {/* Icon with glass effect */}
        <motion.div 
          className="relative w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 border border-white/20"
          whileTap={{ scale: 0.9 }}
          style={{
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Icon className="w-5 h-5 text-white drop-shadow-sm" />
        </motion.div>
        
        <h3 className="relative font-display font-bold text-white text-[15px] leading-tight drop-shadow-sm">{title}</h3>
        <p className="relative text-white/75 text-[12px] font-soft mt-0.5">{subtitle}</p>
        
        {/* Animated chevron with glow */}
        <motion.div 
          className="absolute bottom-4 right-4"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronRight className="w-5 h-5 text-white/50" />
        </motion.div>
        
        {/* Corner shine effect */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </motion.div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function Home() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  // Mobile: bouncy moogle on touch
  const moogleY = useMotionValue(0);
  const moogleScale = useTransform(moogleY, [-20, 0, 20], [0.95, 1, 1.05]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % kupoQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMoogleTap = () => {
    animate(moogleY, [0, -15, 0], {
      type: "spring",
      stiffness: 400,
      damping: 10,
    });
  };

  return (
    <div className="min-h-[100dvh] md:min-h-[calc(100dvh-4.5rem)] flex flex-col relative">
      {/* Warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.08] via-[var(--bento-accent)]/[0.04] to-[var(--bento-secondary)]/[0.06] pointer-events-none" />
      
      {/* Desktop: Floating background moogles */}
      <div className="hidden md:block">
        <FloatingMoogles moogles={floatingMoogles} />
      </div>
      
      {/* Desktop: Floating sparkles */}
      <div className="hidden md:block">
        <FloatingSparkles />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE VIEW (< md breakpoint)
          Award-winning native app-style layout with premium interactions
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden flex-1 flex flex-col relative z-10">
        {/* Minimal floating header - just theme toggle */}
        <div 
          className="sticky top-0 z-40 flex justify-end p-4"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)' }}
        >
          <MobileThemeToggle />
        </div>
        
        <div className="flex-1 flex flex-col px-5 py-4">
          {/* Hero section - centered with staggered animations */}
          <motion.div 
            className="flex-1 flex flex-col items-center justify-center py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tappable moogle with enhanced glow */}
            <motion.div 
              className="relative mb-6"
              style={{ y: moogleY, scale: moogleScale }}
              onTap={handleMoogleTap}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                delay: 0.1,
              }}
            >
              {/* Multi-layer glow effect */}
              <div className="absolute inset-0 bg-gradient-radial from-[var(--bento-primary)]/25 via-transparent to-transparent blur-3xl scale-[2]" />
              <div className="absolute inset-0 bg-gradient-radial from-[var(--bento-secondary)]/15 via-transparent to-transparent blur-2xl scale-150 translate-y-2" />
              
              <motion.img 
                src={welcomingMoogle} 
                alt="Welcoming moogle" 
                className="relative w-32 drop-shadow-2xl"
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                }}
              />
              
              {/* Tap hint animation */}
              <motion.div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[var(--bento-text-muted)] font-soft"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
              >
                tap me!
              </motion.div>
            </motion.div>

            {/* Premium speech bubble with glass effect */}
            <motion.div
              className="w-full max-w-[280px] mb-6"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 350,
                damping: 25,
                delay: 0.25,
              }}
            >
              <div 
                className="relative bg-[var(--bento-card)]/95 rounded-[20px] px-5 py-4 border border-[var(--bento-border)]/40"
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                {/* Speech bubble pointer */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--bento-card)]/95 rotate-45 border-l border-t border-[var(--bento-border)]/40" />
                
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex}
                    className="font-accent text-xl text-[var(--bento-text)] text-center leading-snug"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                  >
                    {kupoQuotes[quoteIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Brand with staggered reveal */}
            <motion.div 
              className="text-center" 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ 
                type: "spring",
                stiffness: 350,
                damping: 25,
                delay: 0.35,
              }}
            >
              <h1 className="text-[2.75rem] font-display font-bold tracking-[-0.02em] mb-1">
                <span className="text-[var(--bento-primary)]">Mog</span>
                <span className="text-[var(--bento-secondary)]">Tome</span>
              </h1>
              <p className="text-[15px] text-[var(--bento-text-muted)] font-soft">
                Your Free Company's cozy hearth
              </p>
            </motion.div>
          </motion.div>

          {/* Quick actions with premium styling */}
          <div className="space-y-3 pb-2">
            <div className="flex gap-3">
              {quickActions.map((action) => (
                <QuickActionCard key={action.to} {...action} />
              ))}
            </div>
            
            {/* Primary CTA button with premium feel */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ 
                type: "spring",
                stiffness: 350,
                damping: 25,
                delay: 0.3,
              }}
            >
              <Link to="/members" className="block">
                <motion.button 
                  className="
                    relative w-full flex items-center justify-center gap-2.5 
                    bg-gradient-to-r from-[var(--bento-primary)] to-[#E86969]
                    text-white font-bold text-[15px] 
                    py-4 px-6 rounded-2xl 
                    overflow-hidden
                  "
                  whileTap={{ scale: 0.97 }}
                  style={{
                    boxShadow: '0 8px 24px -4px rgba(229, 75, 75, 0.35), 0 4px 8px -2px rgba(229, 75, 75, 0.2)',
                  }}
                >
                  {/* Glossy shine */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />
                  
                  <Users className="w-5 h-5 relative" />
                  <span className="relative">Meet the Family</span>
                  <motion.div
                    className="relative"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>
          </div>
          
          {/* Bottom safe area spacer for tab bar */}
          <div className="h-16" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          DESKTOP VIEW (>= md breakpoint)
          Original storybook design with decorative frame
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="hidden md:flex flex-1 items-center justify-center px-4 py-8 md:py-16 relative z-10">
        <div className="relative max-w-2xl mx-auto">
          {/* Decorative frame card */}
          <motion.div 
            className="relative bg-[var(--bento-card)]/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[var(--bento-primary)]/10 shadow-xl shadow-[var(--bento-primary)]/5"
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
              {/* Opener */}
              <motion.p
                className="font-accent text-2xl md:text-3xl text-[var(--bento-secondary)] mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                ~ A cozy corner awaits ~
              </motion.p>

              {/* Moogle with decorations */}
              <motion.div 
                className="relative inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-radial from-[var(--bento-primary)]/30 via-[var(--bento-accent)]/20 to-transparent blur-3xl scale-[2]" />
                <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
                  <motion.div className="absolute top-1/3 -left-14" animate={{ y: [0, -6, 0], rotate: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                    <Star className="w-5 h-5 text-[var(--bento-secondary)] fill-[var(--bento-secondary)]" />
                  </motion.div>
                  <motion.div className="absolute top-1/3 -right-14" animate={{ y: [0, -6, 0], rotate: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                    <Sparkles className="w-5 h-5 text-[var(--bento-primary)]" />
                  </motion.div>
                  <motion.div className="absolute top-0 -left-8" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                    <Heart className="w-4 h-4 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
                  </motion.div>
                </motion.div>
                <motion.img 
                  src={welcomingMoogle} 
                  alt="Welcoming moogle" 
                  className="relative w-44 md:w-56 lg:w-64 drop-shadow-2xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Speech bubble */}
              <motion.div
                className="mb-5 relative -mt-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="relative bg-[var(--bento-card)] rounded-2xl px-6 py-4 shadow-lg border border-[var(--bento-primary)]/15 max-w-[360px] min-h-[80px] flex items-center justify-center mx-auto">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[22px] border-b-[var(--bento-card)]" />
                    <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[24px] border-b-[var(--bento-primary)]/15 -z-10" />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={quoteIndex}
                      className="font-accent text-2xl md:text-3xl text-[var(--bento-text)] text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      "{kupoQuotes[quoteIndex]}"
                    </motion.p>
                  </AnimatePresence>
                </div>
                <p className="font-accent text-lg md:text-xl text-[var(--bento-text-muted)] mt-4">
                  ~ says the friendly moogle ~
                </p>
              </motion.div>

              {/* Divider */}
              <motion.div className="flex justify-center mb-6" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
                <StoryDivider size="lg" />
              </motion.div>

              {/* Heading */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4">
                  <span className="text-[var(--bento-primary)]">Mog</span>
                  <span className="text-[var(--bento-secondary)]">Tome</span>
                </h1>
                <p className="text-lg md:text-xl text-[var(--bento-text-muted)] font-soft max-w-md mx-auto leading-relaxed mb-3">
                  Where moogles gather, adventures are shared, and everyone belongs.
                </p>
                <p className="font-accent text-xl text-[var(--bento-secondary)]">
                  ✧ Your Free Company's cozy hearth ✧
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div className="mt-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}>
                <Link to="/members">
                  <Button 
                    size="lg" 
                    className="gap-2.5 px-10 py-4 text-lg group shadow-xl shadow-[var(--bento-primary)]/30 hover:shadow-2xl hover:shadow-[var(--bento-primary)]/40 transition-all duration-300"
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-soft font-semibold">Meet the Family</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Desktop footer */}
      <footer className="hidden md:block py-8 px-4 relative z-10">
        <motion.div 
          className="max-w-md mx-auto text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <StoryDivider className="mx-auto mb-4 opacity-70" />
          <p className="font-accent text-xl text-[var(--bento-text-muted)] flex items-center justify-center gap-2">
            Made with 
            <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
            by moogles, for moogles
          </p>
          <p className="font-accent text-lg text-[var(--bento-secondary)] mt-2">
            ~ fin ~
          </p>
        </motion.div>
      </footer>
    </div>
  );
}

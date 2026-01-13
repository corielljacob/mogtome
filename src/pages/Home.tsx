import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Heart, ArrowRight, Sparkles, Star } from 'lucide-react';
import { Button } from '../components/Button';
import welcomingMoogle from '../assets/moogles/mooglef fly transparent.webp';

// Rotating kupo quotes
const kupoQuotes = [
  "Welcome home, kupo!",
  "Good to see you, kupo~",
  "Ready for adventure, kupo?",
  "Stay cozy, kupo!",
  "You look great today, kupo!",
  "Let's have fun, kupo~",
  "Glad you're here, kupo!",
];
import wizardMoogle from '../assets/moogles/wizard moogle.webp';
import flyingMoogles from '../assets/moogles/moogles flying.webp';
import musicMoogle from '../assets/moogles/moogle playing music.webp';
import lilGuyMoogle from '../assets/moogles/lil guy moogle.webp';

// Hand-drawn style decorative divider - punchy colors
function StoryDivider({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 20" 
      className={`w-56 md:w-72 h-6 ${className}`}
      fill="none"
    >
      <path 
        d="M10 10 Q 30 5, 50 10 T 90 10 T 130 10 T 170 10 T 190 10" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        className="text-[var(--bento-primary)]/60"
      />
      {/* Little decorative dots - punchy colors */}
      <circle cx="100" cy="10" r="5" className="fill-[var(--bento-secondary)]" />
      <circle cx="76" cy="8" r="3" className="fill-[var(--bento-primary)]/70" />
      <circle cx="124" cy="8" r="3" className="fill-[var(--bento-primary)]/70" />
      <circle cx="55" cy="10" r="2" className="fill-[var(--bento-secondary)]/60" />
      <circle cx="145" cy="10" r="2" className="fill-[var(--bento-secondary)]/60" />
    </svg>
  );
}

// Floating background moogles - more visible
const floatingMoogles = [
  { src: wizardMoogle, position: 'top-16 left-4 md:left-16', size: 'w-24 md:w-36', rotate: -12, delay: 0 },
  { src: flyingMoogles, position: 'top-24 right-0 md:right-8', size: 'w-32 md:w-48', rotate: 8, delay: 0.5 },
  { src: musicMoogle, position: 'bottom-32 left-4 md:left-20', size: 'w-20 md:w-32', rotate: 6, delay: 1 },
  { src: lilGuyMoogle, position: 'bottom-20 right-8 md:right-24', size: 'w-18 md:w-28', rotate: -8, delay: 1.5 },
];

function FloatingBackgroundMoogles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {floatingMoogles.map((moogle, i) => (
        <motion.img
          key={i}
          src={moogle.src}
          alt=""
          aria-hidden
          className={`absolute ${moogle.position} ${moogle.size} object-contain`}
          style={{ rotate: `${moogle.rotate}deg` }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.15, 0.25, 0.15],
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { duration: 4, repeat: Infinity, delay: moogle.delay },
            y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: moogle.delay },
          }}
        />
      ))}
    </div>
  );
}

// Floating sparkle accents - positioned around edges, away from center content
function FloatingSparkles() {
  const sparkleData = [
    { left: '5%', top: '12%', size: 'w-4 h-4', color: 'text-[var(--bento-primary)]' },
    { left: '92%', top: '18%', size: 'w-5 h-5', color: 'text-[var(--bento-secondary)]' },
    { left: '8%', top: '75%', size: 'w-4 h-4', color: 'text-[var(--bento-secondary)]' },
    { left: '88%', top: '70%', size: 'w-5 h-5', color: 'text-[var(--bento-primary)]' },
    { left: '15%', top: '45%', size: 'w-3 h-3', color: 'text-[var(--bento-accent)]' },
    { left: '18%', top: '88%', size: 'w-4 h-4', color: 'text-[var(--bento-accent)]' },
    { left: '82%', top: '85%', size: 'w-3 h-3', color: 'text-[var(--bento-primary)]' },
    { left: '3%', top: '35%', size: 'w-4 h-4', color: 'text-[var(--bento-secondary)]' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkleData.map((sparkle, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: sparkle.left, top: sparkle.top }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [0.9, 1.1, 0.9],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        >
          {i % 3 === 0 ? (
            <Star className={`${sparkle.size} ${sparkle.color} fill-current`} />
          ) : (
            <Sparkles className={`${sparkle.size} ${sparkle.color}`} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Decorative corner flourishes - more visible
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

export function Home() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % kupoQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col relative">
      {/* Warm gradient overlay - more visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.08] via-[var(--bento-accent)]/[0.04] to-[var(--bento-secondary)]/[0.06] pointer-events-none" />
      
      {/* Floating background moogles */}
      <FloatingBackgroundMoogles />
      
      {/* Floating sparkles */}
      <FloatingSparkles />

      {/* Main content with decorative frame */}
      <section className="flex-1 flex items-center justify-center px-4 py-8 md:py-16 relative z-10">
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
              {/* "Once upon a time" opener - storybook style */}
              <motion.p
                className="font-accent text-2xl md:text-3xl text-[var(--bento-secondary)] mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                ~ A cozy corner awaits ~
              </motion.p>

              {/* Moogle mascot - BIGGER with more visible decorations */}
              <motion.div 
                className="relative inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                {/* Soft dreamy glow - more visible */}
                <div className="absolute inset-0 bg-gradient-radial from-[var(--bento-primary)]/30 via-[var(--bento-accent)]/20 to-transparent blur-3xl scale-[2]" />
                
                {/* Decorative elements - only on sides, keeping bottom clear for speech bubble */}
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
                
                {/* Main moogle - BIGGER */}
                <motion.img 
                  src={welcomingMoogle} 
                  alt="Welcoming moogle" 
                  className="relative w-44 md:w-56 lg:w-64 drop-shadow-2xl"
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

              {/* Kupo speech bubble - attached to moogle */}
              <motion.div
                className="mb-5 relative -mt-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {/* Speech bubble - responsive sizing */}
                <div className="relative bg-[var(--bento-card)] rounded-2xl px-4 sm:px-6 py-4 shadow-lg border border-[var(--bento-primary)]/15 w-[calc(100vw-4rem)] max-w-[300px] sm:max-w-[360px] min-h-[70px] sm:min-h-[80px] flex items-center justify-center mx-auto">
                  {/* Bubble tail pointing up - bigger and more prominent */}
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

              {/* Decorative divider - more visible */}
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <StoryDivider />
              </motion.div>

              {/* Main heading - Fredoka rounded */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4">
                  <span className="text-[var(--bento-primary)]">Mog</span>
                  <span className="text-[var(--bento-secondary)]">Tome</span>
                </h1>
                <p className="text-lg md:text-xl text-[var(--bento-text-muted)] font-soft max-w-md mx-auto leading-relaxed mb-3">
                  Where moogles gather, adventures are shared, 
                  and everyone belongs.
                </p>
                <p className="font-accent text-xl text-[var(--bento-secondary)]">
                  ✧ Your Free Company's cozy hearth ✧
                </p>
              </motion.div>

              {/* CTA button */}
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
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

      {/* Footer - storybook closing */}
      <footer className="py-8 px-4 relative z-10" style={{ paddingBottom: 'calc(2rem + var(--safe-area-inset-bottom, 0px))' }}>
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

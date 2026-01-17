import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, X } from 'lucide-react';
import { MembershipCard, getTheme } from '../components/MembershipCard';
import { ContentCard } from '../components';

// Mock user data for testing
const MOCK_USER = {
  memberName: 'Agility Rabbit',
  memberRank: 'Moogle Knight',
  memberPortraitUrl: 'https://img2.finalfantasyxiv.com/f/c0c1a3a3f8e7b1a3c0c1a3a3f8e7b1a3_c0c1a3a3f8e7b1a3c0c1a3a3f8e7b1a3fc0.png',
  memberId: '12345678',
  createdAt: new Date().toISOString(),
};

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// Elegant floating sparkles
const Sparkles = memo(function Sparkles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 20 + Math.random() * 60,
        delay: Math.random() * 0.8,
        duration: 1.5 + Math.random() * 1,
        size: 3 + Math.random() * 5,
        color: i % 3 === 0 ? 'var(--bento-primary)' : i % 3 === 1 ? 'var(--bento-secondary)' : '#FFD700',
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1, 0],
            y: [0, -20 - Math.random() * 30],
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay, 
            ease: [0.23, 1, 0.32, 1],
          }}
        />
      ))}
    </div>
  );
});

// Shine sweep effect for the card
function CardShine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.div
        className="absolute inset-y-0 w-[200%] -left-full"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 60%, transparent 100%)',
        }}
        initial={{ x: '0%' }}
        animate={{ x: '100%' }}
        transition={{
          delay: delay + 0.2,
          duration: 0.8,
          ease: [0.23, 1, 0.32, 1],
        }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD REVEAL PREVIEW
// ─────────────────────────────────────────────────────────────────────────────

function CardRevealPreview({ onClose }: { onClose: () => void }) {
  const theme = getTheme(MOCK_USER.memberRank);
  const [phase, setPhase] = useState(0); // 0: initial, 1: card visible, 2: shine, 3: sparkles, 4: complete
  const [runCount, setRunCount] = useState(0);

  // Orchestrated timeline
  useEffect(() => {
    setPhase(0);
    
    const timers = [
      setTimeout(() => setPhase(1), 300),   // Card starts appearing
      setTimeout(() => setPhase(2), 900),   // Shine sweeps
      setTimeout(() => setPhase(3), 1400),  // Sparkles appear
      setTimeout(() => setPhase(4), 2000),  // Button appears
    ];
    
    return () => timers.forEach(clearTimeout);
  }, [runCount]);

  const replay = useCallback(() => {
    setRunCount(c => c + 1);
  }, []);

  const firstName = MOCK_USER.memberName.split(' ')[0];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bento-bg)]/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bento-card)] border border-[var(--bento-border)] hover:bg-[var(--bento-primary)]/10 transition-colors cursor-pointer z-10"
      >
        <X className="w-5 h-5 text-[var(--bento-text)]" />
      </button>

      {/* Replay button */}
      <button
        onClick={replay}
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bento-card)] border border-[var(--bento-border)] hover:bg-[var(--bento-primary)]/10 transition-colors cursor-pointer z-10"
      >
        <RotateCcw className="w-4 h-4 text-[var(--bento-text)]" />
        <span className="text-sm font-soft text-[var(--bento-text)]">Replay</span>
      </button>

      {/* Phase indicator */}
      <div className="absolute top-16 left-4 text-xs text-[var(--bento-text-muted)] font-mono">
        Phase: {phase}
      </div>

      <div className="w-full max-w-md px-6" key={runCount}>
        <motion.div
          className="text-center py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Welcome header - elegant fade with blur */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ 
              duration: 0.6, 
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            <motion.p 
              className="text-[var(--bento-text-muted)] font-soft text-sm mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Welcome to the family, {firstName}
            </motion.p>
            <motion.p
              className="font-accent text-2xl bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              Your card is ready
            </motion.p>
          </motion.div>

          {/* Card container */}
          <div className="relative mb-6 text-left">
            {/* Ambient glow - pulses subtly */}
            <motion.div
              className="absolute -inset-12 rounded-[2rem] pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${theme.glow} 0%, transparent 70%)`,
                filter: 'blur(40px)',
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ 
                opacity: phase >= 1 ? [0.3, 0.5, 0.4] : 0,
                scale: phase >= 1 ? 1 : 0.6,
              }}
              transition={{ 
                opacity: { duration: 2, repeat: Infinity, repeatType: 'reverse' },
                scale: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
              }}
            />

            {/* The membership card with premium entrance */}
            <motion.div
              className="relative"
              initial={{ 
                opacity: 0, 
                y: 60, 
                scale: 0.85,
                rotateX: 25,
                filter: 'blur(8px)',
              }}
              animate={{ 
                opacity: phase >= 1 ? 1 : 0, 
                y: phase >= 1 ? 0 : 60, 
                scale: phase >= 1 ? 1 : 0.85,
                rotateX: phase >= 1 ? 0 : 25,
                filter: phase >= 1 ? 'blur(0px)' : 'blur(8px)',
              }}
              transition={{ 
                duration: 0.7,
                ease: [0.23, 1, 0.32, 1],
              }}
              style={{ 
                perspective: '1000px',
                transformStyle: 'preserve-3d',
              }}
            >
              <MembershipCard
                name={MOCK_USER.memberName}
                rank={MOCK_USER.memberRank}
                avatarUrl={MOCK_USER.memberPortraitUrl}
                characterId={MOCK_USER.memberId}
                memberSince={MOCK_USER.createdAt}
                compact
              />
              
              {/* Shine sweep overlay */}
              {phase >= 2 && <CardShine delay={0} />}
            </motion.div>
            
            {/* Sparkles */}
            <AnimatePresence>
              {phase >= 3 && <Sparkles />}
            </AnimatePresence>
          </div>

          {/* Bottom section - message and button */}
          <div className="min-h-[5.5rem] flex flex-col items-center justify-center gap-4">
            <AnimatePresence mode="wait">
              {phase >= 3 && (
                <motion.p
                  className="font-accent text-base text-[var(--bento-secondary)]"
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  ✨ You're officially one of us, kupo! ✨
                </motion.p>
              )}
            </AnimatePresence>

            {phase >= 4 && (
              <motion.button
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1],
                }}
                onClick={onClose}
                className="
                  px-8 py-3 rounded-2xl
                  bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)]
                  text-white font-soft font-semibold text-sm
                  shadow-xl shadow-[var(--bento-primary)]/30
                  transition-shadow duration-300
                  hover:shadow-2xl hover:shadow-[var(--bento-primary)]/40
                  cursor-pointer
                "
              >
                Let's go, kupo! →
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEBUG PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function Debug() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="min-h-[100dvh] px-4 pt-[calc(5rem+env(safe-area-inset-top))] pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-[var(--bento-text)] mb-2">
            🛠️ Debug Tools
          </h1>
          <p className="text-[var(--bento-text-muted)] font-soft text-sm">
            Preview animations and test components
          </p>
        </div>

        <ContentCard>
          <h2 className="font-display text-lg font-semibold text-[var(--bento-text)] mb-4">
            First-Time Login Experience
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowPreview(true)}
              className="
                w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)]
                text-white font-soft font-semibold
                shadow-lg shadow-[var(--bento-primary)]/20
                hover:shadow-xl hover:scale-[1.01]
                active:scale-[0.99]
                transition-all cursor-pointer
              "
            >
              <Play className="w-5 h-5" />
              Preview Card Reveal
            </button>

            <p className="text-xs text-[var(--bento-text-subtle)] text-center">
              Uses mock data: {MOCK_USER.memberName} ({MOCK_USER.memberRank})
            </p>
          </div>
        </ContentCard>

        <ContentCard>
          <h2 className="font-display text-lg font-semibold text-[var(--bento-text)] mb-4">
            Membership Card Preview
          </h2>
          
          <MembershipCard
            name={MOCK_USER.memberName}
            rank={MOCK_USER.memberRank}
            avatarUrl={MOCK_USER.memberPortraitUrl}
            characterId={MOCK_USER.memberId}
            memberSince={MOCK_USER.createdAt}
          />
        </ContentCard>
      </div>

      {/* Preview overlay */}
      <AnimatePresence>
        {showPreview && (
          <CardRevealPreview onClose={() => setShowPreview(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

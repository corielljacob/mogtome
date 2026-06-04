import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCcw, X } from "lucide-react";
import { MembershipCard } from "../components/MembershipCard";
import { getTheme } from "../components/membershipCardThemes";
import { ContentCard } from "../components";

const MOCK_USER = {
  memberName: "Agility Rabbit",
  memberRank: "Moogle Knight",
  memberPortraitUrl:
    "https://img2.finalfantasyxiv.com/f/c0c1a3a3f8e7b1a3c0c1a3a3f8e7b1a3_c0c1a3a3f8e7b1a3c0c1a3a3f8e7b1a3fc0.png",
  memberId: "12345678",
  createdAt: new Date().toISOString(),
};

// generated once at module load - cosmetic, so no per-mount randomness and
// Math.random stays out of render.
const DEBUG_SPARKLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: 10 + Math.random() * 80,
  y: 20 + Math.random() * 60,
  delay: Math.random() * 0.8,
  duration: 1.5 + Math.random() * 1,
  size: 3 + Math.random() * 5,
  rise: -20 - Math.random() * 30, // upward drift for the float animation
  color:
    i % 3 === 0
      ? "var(--primary)"
      : i % 3 === 1
        ? "var(--secondary)"
        : "var(--accent)",
}));

const Sparkles = memo(function Sparkles() {
  const particles = DEBUG_SPARKLES;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
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
            y: [0, p.rise],
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

function CardShine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.div
        className="absolute inset-y-0 w-[200%] -left-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 60%, transparent 100%)",
        }}
        initial={{ x: "0%" }}
        animate={{ x: "100%" }}
        transition={{
          delay: delay + 0.2,
          duration: 0.8,
          ease: [0.23, 1, 0.32, 1],
        }}
      />
    </motion.div>
  );
}

function CardRevealPreview({ onClose }: { onClose: () => void }) {
  const theme = getTheme(MOCK_USER.memberRank);
  const [phase, setPhase] = useState(0); // 0: initial, 1: card visible, 2: shine, 3: sparkles, 4: complete
  const [runCount, setRunCount] = useState(0);

  // re-runs on replay via runCount; phase resets to 0 in the replay handler
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 2000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [runCount]);

  const replay = useCallback(() => {
    setPhase(0);
    setRunCount((c) => c + 1);
  }, []);

  const firstName = MOCK_USER.memberName.split(" ")[0];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--primary)]/10 transition-colors cursor-pointer z-10"
      >
        <X className="w-5 h-5 text-[var(--text)]" />
      </button>

      <button
        onClick={replay}
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--primary)]/10 transition-colors cursor-pointer z-10"
      >
        <RotateCcw className="w-4 h-4 text-[var(--text)]" />
        <span className="text-sm font-soft text-[var(--text)]">Replay</span>
      </button>

      <div className="absolute top-16 left-4 text-xs text-[var(--text-muted)] font-mono">
        Phase: {phase}
      </div>

      <div className="w-full max-w-md px-6" key={runCount}>
        <motion.div
          className="text-center py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.6,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            <motion.p
              className="text-[var(--text-muted)] font-soft text-sm mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Welcome to the family, {firstName}
            </motion.p>
            <motion.p
              className="font-accent text-2xl text-[var(--primary)]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.3,
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              Your card is ready
            </motion.p>
          </motion.div>

          <div className="relative mb-6 text-left">
            <motion.div
              className="absolute -inset-12 rounded-[2rem] pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${theme.glow} 0%, transparent 70%)`,
                filter: "blur(40px)",
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: phase >= 1 ? [0.3, 0.5, 0.4] : 0,
                scale: phase >= 1 ? 1 : 0.6,
              }}
              transition={{
                opacity: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
                scale: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
              }}
            />

            <motion.div
              className="relative"
              initial={{
                opacity: 0,
                y: 60,
                scale: 0.85,
                rotateX: 25,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: phase >= 1 ? 1 : 0,
                y: phase >= 1 ? 0 : 60,
                scale: phase >= 1 ? 1 : 0.85,
                rotateX: phase >= 1 ? 0 : 25,
                filter: phase >= 1 ? "blur(0px)" : "blur(8px)",
              }}
              transition={{
                duration: 0.7,
                ease: [0.23, 1, 0.32, 1],
              }}
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
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

              {phase >= 2 && <CardShine delay={0} />}
            </motion.div>

            <AnimatePresence>{phase >= 3 && <Sparkles />}</AnimatePresence>
          </div>

          <div className="min-h-[5.5rem] flex flex-col items-center justify-center gap-4">
            <AnimatePresence mode="wait">
              {phase >= 3 && (
                <motion.p
                  className="font-accent text-base text-[var(--secondary)]"
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
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
                  px-8 py-3 rounded-lg
                  bg-[var(--primary)]
                  text-white font-soft font-semibold text-sm
                  shadow-[2px_2px_0_color-mix(in_srgb,var(--primary)_40%,black)]
                  transition-shadow duration-150
                  hover:shadow-[3px_3px_0_color-mix(in_srgb,var(--primary)_45%,black)]
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

export function Debug() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="min-h-[100dvh] px-4 pt-[calc(5rem+env(safe-area-inset-top))] pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-[var(--text)] mb-2">
            🛠️ Debug Tools
          </h1>
          <p className="text-[var(--text-muted)] font-soft text-sm">
            Preview animations and test components
          </p>
        </div>

        <ContentCard>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-4">
            First-Time Login Experience
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => setShowPreview(true)}
              className="
                w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                bg-[var(--primary)]
                text-white font-soft font-semibold
                shadow-[2px_2px_0_color-mix(in_srgb,var(--primary)_40%,black)]
                hover:shadow-[3px_3px_0_color-mix(in_srgb,var(--primary)_45%,black)] hover:scale-[1.01]
                active:scale-[0.99]
                transition-all cursor-pointer
              "
            >
              <Play className="w-5 h-5" />
              Preview Card Reveal
            </button>

            <p className="text-xs text-[var(--text-subtle)] text-center">
              Uses mock data: {MOCK_USER.memberName} ({MOCK_USER.memberRank})
            </p>
          </div>
        </ContentCard>

        <ContentCard>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-4">
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

      <AnimatePresence>
        {showPreview && (
          <CardRevealPreview onClose={() => setShowPreview(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

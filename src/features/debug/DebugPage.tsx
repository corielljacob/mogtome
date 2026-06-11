import {
  useState,
  useEffect,
  useCallback,
  memo,
  type CSSProperties,
} from "react";
import { Play, RotateCcw, X } from "lucide-react";
import { MembershipCard } from "@/shared/ui/MembershipCard";
import { getTheme } from "@/shared/ui/membershipCardThemes";
import { ContentCard } from "@/shared/ui/ContentCard";

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
        <div
          key={p.id}
          className="absolute rounded-full animate-[popIn_var(--dur)_cubic-bezier(0.23,1,0.32,1)_var(--delay)_both]"
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              "--dur": `${p.duration}s`,
              "--delay": `${p.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
});

function CardShine({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg animate-[fadeIn_0.3s_ease-out_both]"
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className="absolute inset-y-0 w-[200%] -left-full animate-[shimmer_0.8s_cubic-bezier(0.23,1,0.32,1)_both]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 60%, transparent 100%)",
          animationDelay: `${delay + 0.2}s`,
        }}
      />
    </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]/95 animate-[fadeIn_0.3s_ease-out]">
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
        <div className="text-center py-2 animate-[fadeIn_0.3s_ease-out]">
          <div className="mb-8 animate-[fadeSlideIn_0.6s_cubic-bezier(0.23,1,0.32,1)]">
            <p
              className="text-[var(--text-muted)] font-soft text-sm mb-2 animate-[fadeIn_0.5s_ease-out_0.2s_both]"
            >
              Welcome to the family, {firstName}
            </p>
            <p
              className="font-accent text-2xl text-[var(--primary)] animate-[scaleIn_0.5s_cubic-bezier(0.23,1,0.32,1)_0.3s_both]"
            >
              Your card is ready
            </p>
          </div>

          <div className="relative mb-6 text-left">
            <div
              className={`absolute -inset-12 rounded-[2rem] pointer-events-none transition-opacity duration-700 ${
                phase >= 1 ? "opacity-40 animate-float-gentle" : "opacity-0"
              }`}
              style={{
                background: `radial-gradient(ellipse at center, ${theme.glow} 0%, transparent 70%)`,
                filter: "blur(40px)",
              }}
            />

            <div
              className={`relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                phase >= 1 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-[60px] scale-[0.85]"
              }`}
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
            </div>

            {phase >= 3 && <Sparkles />}
          </div>

          <div className="min-h-[5.5rem] flex flex-col items-center justify-center gap-4">
            {phase >= 3 && (
              <p className="font-accent text-base text-[var(--secondary)] animate-[fadeSlideIn_0.5s_cubic-bezier(0.23,1,0.32,1)]">
                ✨ You're officially one of us, kupo! ✨
              </p>
            )}

            {phase >= 4 && (
              <button
                onClick={onClose}
                className="
                  px-8 py-3 rounded-lg
                  bg-[var(--primary)]
                  text-white font-soft font-semibold text-sm
                  shadow-[2px_2px_0_color-mix(in_srgb,var(--primary)_40%,black)]
                  transition-all duration-150
                  hover:shadow-[3px_3px_0_color-mix(in_srgb,var(--primary)_45%,black)] hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.97]
                  cursor-pointer
                  animate-[fadeSlideIn_0.4s_cubic-bezier(0.23,1,0.32,1)]
                "
              >
                Let's go, kupo! →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
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

      {showPreview && (
        <CardRevealPreview onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

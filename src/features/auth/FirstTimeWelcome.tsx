import { useState, useEffect, useCallback } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import type { User } from "@/shared/contexts/AuthContext";
import { MembershipCard } from "@/shared/ui/MembershipCard";
import { getTheme } from "@/shared/ui/membershipCardThemes";
import { CardShine } from "@/features/auth/CardShine";
import { CelebrationSparkles } from "@/features/auth/CelebrationSparkles";
import { AmbientGlow } from "@/features/auth/AmbientGlow";
import { markWelcomeSeen } from "@/features/auth/welcomeSeen";

export function FirstTimeWelcome({
  user,
  onComplete,
}: {
  user: User;
  onComplete: () => void;
}) {
  const theme = getTheme(user.memberRank);
  const [animationState, setAnimationState] = useState<
    "entering" | "card-reveal" | "celebrating" | "complete"
  >("entering");

  // orchestrated timeline - each stage flows into the next
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationState("card-reveal"), 400),
      setTimeout(() => setAnimationState("celebrating"), 1200),
      setTimeout(() => setAnimationState("complete"), 1900),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleContinue = useCallback(() => {
    markWelcomeSeen(user);
    onComplete();
  }, [onComplete, user]);

  const firstName = user.memberName?.split(" ")[0] || "Adventurer";

  const showCard = animationState !== "entering";
  const showCelebration =
    animationState === "celebrating" || animationState === "complete";
  const showButton = animationState === "complete";

  return (
    <div className="text-center py-2 animate-[fadeIn_0.4s_ease-out]">
      <div className="mb-8 animate-[fadeIn_0.5s_ease-out]">
        <p className="text-[var(--text-muted)] font-soft text-sm mb-2 animate-[fadeSlideIn_0.6s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]">
          Welcome to the family, {firstName}
        </p>
        <p className="font-accent text-2xl text-[var(--primary)] animate-[fadeSlideIn_0.7s_cubic-bezier(0.16,1,0.3,1)_0.2s_both]">
          Your card is ready
        </p>
      </div>

      <div className="relative mb-6 text-left">
        <div
          className="absolute -inset-16 rounded-[3rem] pointer-events-none transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(ellipse at center, ${theme.glow} 0%, transparent 65%)`,
            filter: "blur(50px)",
            opacity: showCard ? 0.4 : 0,
            transform: showCard ? "scale(1)" : "scale(0.5)",
          }}
        />

        <div
          className="absolute -inset-10 rounded-[2.5rem] pointer-events-none transition-opacity duration-700 ease-out"
          style={{
            background: `radial-gradient(ellipse at center, ${theme.glow} 0%, transparent 70%)`,
            filter: "blur(35px)",
            opacity: showCard ? 0.35 : 0,
          }}
        />

        <div
          className={`relative transition-all duration-700 ease-out ${
            showCard ? "opacity-100" : "opacity-0"
          }`}
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
            transform: showCard
              ? "translateY(0) scale(1)"
              : "translateY(80px) scale(0.75)",
          }}
        >
          <div>
            <MembershipCard
              name={user.memberName || "Adventurer"}
              rank={user.memberRank || "Member"}
              avatarUrl={user.memberPortraitUrl || ""}
              memberSince={user.firstLoginDate}
              compact
            />
          </div>

          {showCard && <CardShine delay={0.5} intensity="bright" />}
        </div>

        <CelebrationSparkles isActive={showCelebration} />
        <AmbientGlow isActive={showCelebration} />
      </div>

      <div className="min-h-[5.5rem] flex flex-col items-center justify-center gap-4">
        {showCelebration && (
          <p
            key="celebration-text"
            className="font-accent text-base text-[var(--secondary)] animate-[fadeSlideIn_0.5s_cubic-bezier(0.16,1,0.3,1)]"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Welcome to MogTome, kupo!</span>
              <Sparkles className="w-4 h-4" />
            </span>
          </p>
        )}

        {showButton && (
          <button
            key="continue-button"
            onClick={handleContinue}
            className="
              px-8 py-3 rounded-lg
              bg-[var(--primary)]
              text-white font-soft font-semibold text-sm
              shadow-[2px_2px_0_color-mix(in_srgb,var(--primary)_40%,black)]
              cursor-pointer
              animate-[popIn_0.4s_ease-out]
              transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-[0_25px_50px_-12px_rgba(199,91,122,0.5)] active:scale-95
              focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary)] focus-visible:outline-none
            "
          >
            <span className="inline-flex items-center gap-2">
              Let's go, kupo!
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

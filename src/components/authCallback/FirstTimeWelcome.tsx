import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import type { User } from "@/contexts/AuthContext";
import { MembershipCard } from "@/shared/ui/MembershipCard";
import { getTheme } from "@/shared/ui/membershipCardThemes";
import { CardShine } from "@/components/authCallback/CardShine";
import { CelebrationSparkles } from "@/components/authCallback/CelebrationSparkles";
import { AmbientGlow } from "@/components/authCallback/AmbientGlow";
import { markWelcomeSeen } from "@/components/authCallback/welcomeSeen";

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
    <motion.div
      className="text-center py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 0.95,
        filter: "blur(8px)",
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          className="text-[var(--text-muted)] font-soft text-sm mb-2"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          Welcome to the family, {firstName}
        </motion.p>
        <motion.p
          className="font-accent text-2xl text-[var(--primary)]"
          initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.7,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          Your card is ready
        </motion.p>
      </motion.div>

      <div className="relative mb-6 text-left">
        <motion.div
          className="absolute -inset-16 rounded-[3rem] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${theme.glow} 0%, transparent 65%)`,
            filter: "blur(50px)",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: showCard ? 0.4 : 0,
            scale: showCard ? 1 : 0.5,
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        <motion.div
          className="absolute -inset-10 rounded-[2.5rem] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${theme.glow} 0%, transparent 70%)`,
            filter: "blur(35px)",
          }}
          initial={{ opacity: 0 }}
          animate={
            showCard
              ? {
                  opacity: [0.25, 0.45, 0.25],
                  scale: [0.95, 1.02, 0.95],
                }
              : { opacity: 0 }
          }
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        <motion.div
          className="relative"
          initial={{
            opacity: 0,
            y: 80,
            scale: 0.75,
            rotateX: 35,
          }}
          animate={
            showCard
              ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotateX: 0,
                }
              : undefined
          }
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* separate blur into its own layer for smoother rendering */}
          <motion.div
            initial={{ filter: "blur(12px)" }}
            animate={showCard ? { filter: "blur(0px)" } : undefined}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: "easeOut",
            }}
          >
            <MembershipCard
              name={user.memberName || "Adventurer"}
              rank={user.memberRank || "Member"}
              avatarUrl={user.memberPortraitUrl || ""}
              memberSince={user.firstLoginDate}
              compact
            />
          </motion.div>

          {showCard && <CardShine delay={0.5} intensity="bright" />}
        </motion.div>

        <CelebrationSparkles isActive={showCelebration} />
        <AmbientGlow isActive={showCelebration} />
      </div>

      <div className="min-h-[5.5rem] flex flex-col items-center justify-center gap-4">
        <AnimatePresence mode="wait">
          {showCelebration && (
            <motion.p
              key="celebration-text"
              className="font-accent text-base text-[var(--secondary)]"
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Welcome to MogTome, kupo!</span>
                <Sparkles className="w-4 h-4" />
              </span>
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showButton && (
            <motion.button
              key="continue-button"
              initial={{ opacity: 0, y: 20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{
                scale: 1.04,
                y: -3,
                boxShadow: "0 25px 50px -12px rgba(199, 91, 122, 0.5)",
              }}
              whileTap={{ scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              onClick={handleContinue}
              className="
                px-8 py-3 rounded-lg
                bg-[var(--primary)]
                text-white font-soft font-semibold text-sm
                shadow-[2px_2px_0_color-mix(in_srgb,var(--primary)_40%,black)]
                cursor-pointer
                focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary)] focus-visible:outline-none
              "
            >
              <span className="inline-flex items-center gap-2">
                Let's go, kupo!
                <ArrowRight className="w-4 h-4" />
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

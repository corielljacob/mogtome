import { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { User } from "@/contexts/AuthContext";
import { MembershipCard } from "@/components/MembershipCard";

export function ReturningUserWelcome({
  user,
  onComplete,
}: {
  user: User;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"enter" | "display" | "exit">("enter");

  useEffect(() => {
    const displayTimer = setTimeout(() => setPhase("display"), 400);
    const exitTimer = setTimeout(() => setPhase("exit"), 2400);
    const completeTimer = setTimeout(() => onComplete(), 2900);

    return () => {
      clearTimeout(displayTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: phase === "exit" ? 0.4 : 0.3 }}
      className="text-center py-2"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4"
      >
        <p className="text-[var(--text-muted)] font-soft text-sm mb-1">
          Welcome back, kupo!
        </p>
        <motion.p
          className="font-accent text-lg text-[var(--primary)]"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          Good to see you again~
        </motion.p>
      </motion.div>

      <motion.div
        className="mb-5 text-left"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 250, damping: 22, delay: 0.1 }}
      >
        <MembershipCard
          name={user.memberName || "Adventurer"}
          rank={user.memberRank || "Member"}
          avatarUrl={user.memberPortraitUrl || ""}
          memberSince={user.firstLoginDate}
          compact
        />
      </motion.div>

      <motion.div
        className="flex items-center justify-center gap-1.5 text-xs text-[var(--text-subtle)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]" />
        </span>
        <span className="font-soft">Taking you home...</span>
      </motion.div>
    </motion.div>
  );
}

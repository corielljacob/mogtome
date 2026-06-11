import { useState, useEffect } from "react";
import type { User } from "@/shared/contexts/AuthContext";
import { MembershipCard } from "@/shared/ui/MembershipCard";

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
    <div
      className="text-center py-2 animate-[fadeIn_0.3s_ease-out] transition-opacity duration-[400ms]"
      style={{ opacity: phase === "exit" ? 0 : 1 }}
    >
      <div className="mb-4 animate-[fadeSlideIn_0.4s_ease-out_0.1s_both]">
        <p className="text-[var(--text-muted)] font-soft text-sm mb-1">
          Welcome back, kupo!
        </p>
        <p className="font-accent text-lg text-[var(--primary)] animate-[scaleIn_0.3s_ease-out]">
          Good to see you again~
        </p>
      </div>

      <div className="mb-5 text-left animate-[popIn_0.5s_ease-out_0.1s_both]">
        <MembershipCard
          name={user.memberName || "Adventurer"}
          rank={user.memberRank || "Member"}
          avatarUrl={user.memberPortraitUrl || ""}
          memberSince={user.firstLoginDate}
          compact
        />
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--text-subtle)] animate-[fadeIn_0.3s_ease-out_0.5s_both]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]" />
        </span>
        <span className="font-soft">Taking you home...</span>
      </div>
    </div>
  );
}

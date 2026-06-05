import { useMemo } from "react";
import type { User } from "@/shared/contexts/AuthContext";
import { isFirstTimeUser } from "@/features/auth/welcomeSeen";
import { FirstTimeWelcome } from "@/features/auth/FirstTimeWelcome";
import { ReturningUserWelcome } from "@/features/auth/ReturningUserWelcome";

export function SuccessScreen({
  user,
  onComplete,
}: {
  user: User;
  onComplete: () => void;
}) {
  const isFirstTime = useMemo(() => isFirstTimeUser(user), [user]);

  if (isFirstTime) {
    return <FirstTimeWelcome user={user} onComplete={onComplete} />;
  }

  return <ReturningUserWelcome user={user} onComplete={onComplete} />;
}

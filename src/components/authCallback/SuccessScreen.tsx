import { useMemo } from "react";
import type { User } from "@/contexts/AuthContext";
import { isFirstTimeUser } from "@/components/authCallback/welcomeSeen";
import { FirstTimeWelcome } from "@/components/authCallback/FirstTimeWelcome";
import { ReturningUserWelcome } from "@/components/authCallback/ReturningUserWelcome";

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

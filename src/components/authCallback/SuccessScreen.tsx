import { useMemo } from "react";
import type { User } from "../../contexts/AuthContext";
import { isFirstTimeUser } from "./welcomeSeen";
import { FirstTimeWelcome } from "./FirstTimeWelcome";
import { ReturningUserWelcome } from "./ReturningUserWelcome";

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

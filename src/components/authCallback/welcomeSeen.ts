import type { User } from "@/shared/contexts/AuthContext";

const WELCOME_SEEN_KEY = "mogtome_welcome_seen";

// gated on backend firstLoginDate AND a localStorage marker, so the welcome
// doesn't replay on repeat logins. stored value is the firstLoginDate seen, so
// a new account (new date) replays it.
export function isFirstTimeUser(user: User): boolean {
  if (!user.firstLoginDate) {
    // backend hasn't stamped it yet - treat as first time
    return true;
  }

  const seenWelcome = localStorage.getItem(WELCOME_SEEN_KEY);
  if (seenWelcome === user.firstLoginDate) {
    return false;
  }

  // genuinely new only if the first login landed in the last 5 minutes
  const firstLogin = new Date(user.firstLoginDate);
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  return firstLogin >= fiveMinutesAgo;
}

export function markWelcomeSeen(user: User): void {
  if (user.firstLoginDate) {
    localStorage.setItem(WELCOME_SEEN_KEY, user.firstLoginDate);
  }
}

import { LogIn } from "lucide-react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { DiscordIcon } from "@/shared/ui/DiscordIcon";
import "@/shared/styles/journal.css";

interface ProtectedRouteProps {
  children: React.ReactNode;
  signedOut?: React.ReactNode;
}

// Gates a route behind auth, with a friendly login prompt when signed out.
export function ProtectedRoute({ children, signedOut }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, login } = useAuth();
  if (isLoading) {
    return (
      <div
        className="journal-auth-gate"
        role="status"
        aria-label="Checking your membership"
      >
        <div className="w-10 h-10 rounded-full border-3 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) {
    if (signedOut !== undefined) return <>{signedOut}</>;
    return (
      <div className="journal-auth-gate">
        <div className="journal-auth-card">
          <span className="journal-auth-star" aria-hidden="true">
            ✦
          </span>
          <span className="journal-auth-tape" aria-hidden="true" />
          <div className="journal-auth-art">
            <img
              src="/images/moogle-magic.png"
              alt="A moogle wizard guarding the page"
            />
          </div>
          <h1>Members only</h1>
          <p className="journal-auth-description">
            This page is for Kupo Life FC members. Sign in with Discord to
            continue.
          </p>
          <button onClick={login} className="journal-discord-button">
            <DiscordIcon className="w-5 h-5" />
            <span>Login with Discord</span>
            <LogIn className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

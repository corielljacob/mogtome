import { motion } from "motion/react";
import { LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { DiscordIcon } from "./DiscordIcon";
import { KawaiiSparkle, KawaiiBow } from "./kawaiiMotifs";

// Assets
import wizardMoogle from "../assets/moogles/wizard moogle.webp";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps a route to require authentication.
 * Shows a friendly login prompt if the user is not authenticated.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, login } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="w-10 h-10 rounded-full border-3 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-[100dvh] flex items-center justify-center px-4 pt-[calc(4rem+env(safe-area-inset-top)+1rem)] md:pt-10 pb-[calc(5rem+env(safe-area-inset-bottom)+1rem)] md:pb-10">
        <motion.div
          className="relative w-full max-w-md"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {/* Puffy candy card */}
          <div className="surface p-7 sm:p-9 text-center">
            {/* Floating moogle guard */}
            <motion.img
              src={wizardMoogle}
              alt="A moogle wizard guarding the page"
              className="w-28 sm:w-36 mx-auto mb-3 drop-shadow-lg select-none"
              animate={{ y: [0, -6, 0], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Kawaii accent */}
            <div
              className="flex items-center justify-center gap-1.5 mb-2"
              aria-hidden="true"
            >
              <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--accent)]" />
              <KawaiiBow className="w-6 h-6 text-[var(--primary)]" />
              <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--secondary)]" />
            </div>

            <h1 className="editorial-title text-2xl sm:text-3xl font-display font-bold text-[var(--text)] mb-2">
              <span className="text-highlight">Members Only, Kupo!</span>
            </h1>

            <p className="font-soft text-[var(--text-muted)] leading-relaxed mb-7">
              This cozy little corner is just for Kupo Life! FC members. Our
              wizard moogle's keeping watch, but sign in with Discord and he'll
              wave you right in, kupo~
            </p>

            {/* Discord login — candy button in Discord blurple */}
            <button
              onClick={login}
              className="gel hover-bounce w-full flex items-center justify-center gap-2.5 px-6 py-3.5 font-display font-bold text-base sm:text-lg text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none touch-manipulation"
              style={{ "--gel-color": "#5865f2" } as React.CSSProperties}
            >
              <DiscordIcon className="w-6 h-6" />
              <span>Login with Discord</span>
              <LogIn className="w-5 h-5 opacity-80" aria-hidden="true" />
            </button>
          </div>

          {/* Footer note */}
          <p className="eyebrow-script text-xl text-center mt-5 text-[var(--text-muted)]">
            ~ the moogle will let you pass once verified ~
          </p>
        </motion.div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}

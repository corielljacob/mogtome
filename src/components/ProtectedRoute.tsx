import { motion } from "motion/react";
import { LogIn, Scroll, Shield, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { DiscordIcon } from "./DiscordIcon";

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
      <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-b from-[var(--primary)]/[0.06] via-[var(--accent)]/[0.03] to-[var(--secondary)]/[0.05] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] px-4 py-8">
          <motion.div
            className="max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Card container */}
            <div className="bg-[var(--card)] rounded-lg p-8 md:p-10 border border-[var(--border)] shadow-sm text-center">
              {/* Moogle mascot */}
              <motion.div
                className="relative mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.img
                  src={wizardMoogle}
                  alt="A moogle wizard guarding the page"
                  className="relative w-32 md:w-40 mx-auto drop-shadow-lg"
                  animate={{
                    y: [0, -6, 0],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              {/* Shield icon */}
              <motion.div
                className="flex justify-center mb-4"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2, type: "spring" }}
              >
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[var(--primary)]" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-2xl md:text-3xl font-display font-bold text-[var(--text)] mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Members Only, Kupo!
              </motion.h1>

              {/* Description */}
              <motion.p
                className="text-[var(--text-muted)] font-soft mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                This corner of the nest is just for Kupo Life! FC members. Sign
                in with Discord to join the rest of us, kupo!
              </motion.p>

              {/* Discord login button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <motion.button
                  onClick={login}
                  className="
                    group w-full flex items-center justify-center gap-3
                    px-6 py-4 rounded-lg
                    bg-[#5865F2] text-white
                    font-soft font-semibold text-lg
                    shadow-[2px_2px_0_rgba(88,101,242,0.35)]
                    hover:bg-[#4752C4] hover:shadow-[3px_3px_0_rgba(88,101,242,0.4)]
                    focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#5865F2] focus-visible:outline-none
                    transition-all duration-150 cursor-pointer
                  "
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DiscordIcon className="w-6 h-6" />
                  <span>Login with Discord</span>
                  <LogIn className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </motion.button>
              </motion.div>

              {/* Feature hints */}
              <motion.div
                className="mt-6 pt-6 border-t border-[var(--primary)]/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-xs text-[var(--text-subtle)] font-soft mb-3">
                  A few things waiting inside, kupo:
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-[var(--text-muted)] font-soft">
                  <span className="flex items-center gap-1.5">
                    <Scroll className="w-4 h-4 text-[var(--primary)]" />
                    Live Chronicle
                  </span>
                  <span className="text-[var(--border)]">•</span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[var(--secondary)]" />
                    Member Features
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Footer note */}
            <motion.p
              className="text-center mt-6 text-sm text-[var(--text-muted)] font-accent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              ~ The moogle will let you pass once verified ~
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}

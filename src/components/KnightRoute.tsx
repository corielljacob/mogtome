import { motion } from "motion/react";
import { LogIn, Shield, Swords } from "lucide-react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { DiscordIcon } from "@/shared/ui/DiscordIcon";

import wizardMoogle from "@/assets/moogles/wizard moogle.webp";

interface KnightRouteProps {
  children: React.ReactNode;
}

// gates a route behind knighthood - permanent or temporary
export function KnightRoute({ children }: KnightRouteProps) {
  const { user, isAuthenticated, isLoading, login } = useAuth();

  const hasKnighthood = user?.hasKnighthood || user?.hasTemporaryKnighthood;

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="w-10 h-10 rounded-full border-3 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="fixed inset-0 bg-gradient-to-b from-[var(--primary)]/[0.06] via-[var(--accent)]/[0.03] to-[var(--secondary)]/[0.05] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] px-4 py-8">
          <motion.div
            className="max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-[var(--card)] rounded-lg p-8 md:p-10 border border-[var(--border)] shadow-sm text-center">
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

              <motion.div
                className="flex justify-center mb-4"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2, type: "spring" }}
              >
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
                  <Swords className="w-6 h-6 text-[var(--primary)]" />
                </div>
              </motion.div>

              <motion.h1
                className="text-2xl md:text-3xl font-display font-bold text-[var(--text)] mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Knights Only, Kupo!
              </motion.h1>

              <motion.p
                className="text-[var(--text-muted)] font-soft mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                This page is reserved for Moogle Knights. Sign in with Discord
                to verify your knighthood.
              </motion.p>

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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <DiscordIcon className="w-6 h-6" />
                <span>Login with Discord</span>
                <LogIn className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </motion.button>
            </div>

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

  if (!hasKnighthood) {
    return (
      <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="fixed inset-0 bg-gradient-to-b from-[var(--primary)]/[0.06] via-[var(--accent)]/[0.03] to-[var(--secondary)]/[0.05] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] px-4 py-8">
          <motion.div
            className="max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-[var(--card)] rounded-lg p-8 md:p-10 border border-[var(--border)] shadow-sm text-center">
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

              <motion.div
                className="flex justify-center mb-4"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2, type: "spring" }}
              >
                <div className="w-12 h-12 rounded-2xl bg-[var(--warning)]/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[var(--warning)]" />
                </div>
              </motion.div>

              <motion.h1
                className="text-2xl md:text-3xl font-display font-bold text-[var(--text)] mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Knighthood Required
              </motion.h1>

              <motion.p
                className="text-[var(--text-muted)] font-soft mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                This dashboard is only available to Moogle Knights and those
                with temporary knighthood, kupo!
              </motion.p>

              {user && (
                <motion.div
                  className="bg-[var(--bg)]/50 rounded-lg p-4 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.memberPortraitUrl}
                      alt={user.memberName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="text-left">
                      <p className="font-soft font-semibold text-[var(--text)]">
                        {user.memberName}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {user.memberRank}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.p
                className="text-sm text-[var(--text-subtle)] font-soft"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                If you believe this is an error, please contact an officer.
              </motion.p>
            </div>

            <motion.p
              className="text-center mt-6 text-sm text-[var(--text-muted)] font-accent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              ~ Keep striving for knighthood! ~
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

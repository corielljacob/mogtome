import { motion } from 'motion/react';
import { LogIn, Scroll, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Assets
import wizardMoogle from '../assets/moogles/wizard moogle.webp';

/** Discord brand icon */
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

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
      <div className="min-h-[100dvh] flex items-center justify-center pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="w-10 h-10 rounded-full border-3 border-[var(--bento-primary)]/20 border-t-[var(--bento-primary)] animate-spin" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.06] via-[var(--bento-accent)]/[0.03] to-[var(--bento-secondary)]/[0.05] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] px-4 py-8">
          <motion.div
            className="max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Card container */}
            <div className="bg-[var(--bento-card)]/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-[var(--bento-primary)]/15 shadow-xl shadow-[var(--bento-primary)]/5 text-center">
              {/* Moogle mascot */}
              <motion.div
                className="relative mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-radial from-[var(--bento-primary)]/20 to-transparent blur-2xl scale-[1.5]" />
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
                    ease: "easeInOut"
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
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--bento-primary)] to-[var(--bento-secondary)] flex items-center justify-center shadow-lg shadow-[var(--bento-primary)]/25">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-2xl md:text-3xl font-display font-bold text-[var(--bento-text)] mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Members Only, Kupo!
              </motion.h1>

              {/* Description */}
              <motion.p
                className="text-[var(--bento-text-muted)] font-soft mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                This page is reserved for Kupo Life! FC members. Sign in with Discord to access exclusive content.
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
                    px-6 py-4 rounded-2xl
                    bg-[#5865F2] text-white
                    font-soft font-semibold text-lg
                    shadow-lg shadow-[#5865F2]/30
                    hover:bg-[#4752C4] hover:shadow-xl hover:shadow-[#5865F2]/40
                    focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#5865F2] focus-visible:outline-none
                    transition-all duration-200 cursor-pointer
                  "
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DiscordIcon className="w-6 h-6" />
                  <span>Login with Discord</span>
                  <LogIn className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </motion.button>
              </motion.div>

              {/* Feature hints */}
              <motion.div
                className="mt-6 pt-6 border-t border-[var(--bento-primary)]/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-xs text-[var(--bento-text-subtle)] font-soft mb-3">
                  What you'll get access to:
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-[var(--bento-text-muted)] font-soft">
                  <span className="flex items-center gap-1.5">
                    <Scroll className="w-4 h-4 text-[var(--bento-primary)]" />
                    Live Chronicle
                  </span>
                  <span className="text-[var(--bento-border)]">•</span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[var(--bento-secondary)]" />
                    Member Features
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Footer note */}
            <motion.p
              className="text-center mt-6 text-sm text-[var(--bento-text-muted)] font-accent"
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

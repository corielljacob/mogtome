import { motion } from 'motion/react';
import { Shield, Sparkles, MessageCircle, Lightbulb } from 'lucide-react';
import { PendingSubmissions, ContentCard } from '../components';

/**
 * Knight Dashboard - Only accessible to users with knighthood
 * 
 * This dashboard is reserved for Moogle Knights and those with 
 * temporary knighthood permissions. Uses a bento-box layout for
 * multiple dashboard functions.
 */
export function KnightDashboard() {
  return (
    <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.06] via-[var(--bento-accent)]/[0.03] to-[var(--bento-secondary)]/[0.05] pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-[var(--bento-text)]">
                  Knight Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-[var(--bento-text-muted)]">
                  Manage the realm, kupo~
                </p>
              </div>
            </div>
            
            {/* Decorative divider */}
            <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400" aria-hidden="true" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
            </div>
          </motion.div>

          {/* Bento Grid Dashboard */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Pending Biography Submissions */}
            <div className="lg:col-span-1">
              <PendingSubmissions />
            </div>

            {/* Feature Request Card */}
            <div className="lg:col-span-1">
              <ContentCard className="h-full flex flex-col">
                <div className="flex items-start gap-2.5 sm:gap-3 mb-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400/15 to-orange-400/15 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-base sm:text-lg text-[var(--bento-text)]">
                      Have an Idea?
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--bento-text-muted)] mt-0.5">
                      Help shape the dashboard
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center py-6 sm:py-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-400/10 flex items-center justify-center mb-4">
                    <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500" />
                  </div>
                  <p className="text-sm sm:text-base text-[var(--bento-text)] font-soft font-medium mb-2">
                    Want a new dashboard feature?
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--bento-text-muted)] max-w-xs">
                    Discuss it with <span className="text-[var(--bento-primary)] font-semibold">Plane</span> and help us make the Knight Dashboard even better!
                  </p>
                </div>
              </ContentCard>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

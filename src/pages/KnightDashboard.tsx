import { motion } from 'motion/react';
import { Shield, Sparkles } from 'lucide-react';
import { PendingSubmissions } from '../components';

/**
 * Knight Dashboard - Only accessible to users with knighthood
 * 
 * This dashboard is reserved for Moogle Knights and those with 
 * temporary knighthood permissions. Uses a bento-box layout for
 * multiple dashboard functions.
 */
export function KnightDashboard() {
  return (
    <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
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
            {/* Pending Bio Submissions - spans full width on mobile, half on desktop */}
            <div className="lg:col-span-1">
              <PendingSubmissions />
            </div>

            {/* Placeholder for future dashboard cards */}
            {/* Example structure for additional cards:
            <div className="lg:col-span-1">
              <SomeOtherDashboardCard />
            </div>
            
            // Full-width card spanning both columns:
            <div className="lg:col-span-2">
              <WideCard />
            </div>
            */}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

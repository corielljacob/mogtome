import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";

export function ErrorScreen({
  error,
  onReturnHome,
}: {
  error: string;
  onReturnHome: () => void;
}) {
  return (
    <div className="text-center py-4">
      <motion.div
        className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <AlertCircle className="w-8 h-8 text-red-500" />
      </motion.div>
      <h2 className="font-display text-xl font-bold text-[var(--text)] mb-2">
        Oh no, kupo!
      </h2>
      <p className="text-[var(--text-muted)] font-soft text-sm mb-5">{error}</p>
      <button
        onClick={onReturnHome}
        className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white font-soft font-semibold text-sm shadow-[2px_2px_0_color-mix(in_srgb,var(--primary)_40%,black)] hover:shadow-[3px_3px_0_color-mix(in_srgb,var(--primary)_45%,black)] active:scale-[0.98] transition-all"
      >
        Return Home
      </button>
    </div>
  );
}

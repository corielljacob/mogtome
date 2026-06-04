import { motion } from "motion/react";
import { IS_MOBILE } from "../../utils";

export function WarmMoogleAura({ eventId }: { eventId: string | null }) {
  // skip on mobile - drops a large blurred element
  if (IS_MOBILE) return null;
  if (eventId === "all-saints-wake") {
    return (
      <>
        <motion.div
          className="absolute inset-0 scale-[2.0]"
          animate={{ scale: [2.0, 2.4, 2.0], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/35 via-orange-500/20 to-green-500/25 blur-3xl" />
        </motion.div>
        <motion.div
          className="absolute inset-0 scale-[1.3]"
          animate={{ rotate: [0, -360], opacity: [0.15, 0.4, 0.15] }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-orange-400/30 via-purple-600/25 to-green-400/20 blur-2xl" />
        </motion.div>
        <motion.div
          className="absolute inset-0 scale-[1.6]"
          animate={{ opacity: [0.1, 0.35, 0.05, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-radial from-orange-400/25 to-transparent blur-2xl" />
        </motion.div>
      </>
    );
  }

  if (eventId === "starlight") {
    return (
      <>
        <motion.div
          className="absolute inset-0 scale-[2.0]"
          animate={{ scale: [2.0, 2.3, 2.0], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500/30 via-amber-400/30 to-green-500/25 blur-3xl" />
        </motion.div>
        <motion.div
          className="absolute inset-0 scale-[1.3]"
          animate={{ rotate: [0, 360], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            rotate: { duration: 16, repeat: Infinity, ease: "linear" },
            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400/30 via-red-400/20 to-green-400/20 blur-2xl" />
        </motion.div>
        <motion.div
          className="absolute inset-0 scale-[1.5]"
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [1.5, 1.7, 1.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-radial from-amber-300/25 to-transparent blur-2xl" />
        </motion.div>
      </>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 scale-[1.6]"
      animate={{ scale: [1.6, 1.85, 1.6], opacity: [0.35, 0.55, 0.35] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <div
        className="w-full h-full rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--primary) 32%, transparent), color-mix(in srgb, var(--accent) 16%, transparent) 45%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

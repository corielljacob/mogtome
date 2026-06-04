import { motion } from "motion/react";
import { Ghost, Skull, Moon, Snowflake, Gift, Star, TreePine } from "lucide-react";
import { KawaiiHeart, KawaiiStar } from "../kawaiiMotifs";
import { IS_MOBILE } from "../../utils";

/** Little charms orbiting the moogle — kawaii by default, themed during events */
export function MoogleCharms({ eventId }: { eventId: string | null }) {
  // PERFORMANCE: Skip charms entirely on mobile — they're tiny and not worth the cost
  if (IS_MOBILE) return null;
  // All Saints' Wake — skulls, ghosts, and moons orbit the moogle
  if (eventId === "all-saints-wake") {
    return (
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute -top-1 left-1/4"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Ghost className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute top-1/5 -left-6 md:-left-10"
          animate={{ y: [0, -6, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Skull
            className="w-4 h-4 md:w-5 md:h-5 text-orange-400"
            strokeWidth={1.5}
          />
        </motion.div>

        <motion.div
          className="absolute top-1/4 -right-6 md:-right-10"
          animate={{ y: [0, -5, 0], scale: [1, 1.2, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Moon
            className="w-4 h-4 md:w-5 md:h-5 text-purple-300 fill-purple-300/30"
            strokeWidth={1.5}
          />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 -right-5 md:-right-8"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <Ghost className="w-3.5 h-3.5 text-green-400" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 -left-5 md:-left-8"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Skull className="w-3.5 h-3.5 text-orange-300" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    );
  }

  // Starlight Celebration — snowflakes, gifts, stars, and trees orbit the moogle
  if (eventId === "starlight") {
    return (
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute -top-2 left-1/4"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Snowflake className="w-4 h-4 text-blue-300" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute top-1/5 -left-6 md:-left-10"
          animate={{ y: [0, -5, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Gift
            className="w-4 h-4 md:w-5 md:h-5 text-red-400"
            strokeWidth={1.5}
          />
        </motion.div>

        <motion.div
          className="absolute top-1/4 -right-6 md:-right-10"
          animate={{ y: [0, -4, 0], scale: [1, 1.3, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Star
            className="w-4 h-4 md:w-5 md:h-5 text-amber-300 fill-amber-300"
            strokeWidth={1.5}
          />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 -right-5 md:-right-8"
          animate={{ y: [0, -3, 0], rotate: [0, -8, 0] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <TreePine className="w-4 h-4 text-green-500" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 -left-5 md:-left-8"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 1, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Snowflake className="w-3.5 h-3.5 text-blue-200" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    );
  }

  // Default — a few kawaii stickers floating around the moogle
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute -top-1 left-1/4"
        animate={{ y: [0, -7, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <KawaiiHeart className="w-5 h-5 text-[var(--primary)]" />
      </motion.div>
      <motion.div
        className="absolute top-1/5 -left-6 md:-left-10"
        animate={{ y: [0, -6, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <KawaiiStar className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent)]" />
      </motion.div>
      <motion.div
        className="absolute top-1/4 -right-6 md:-right-10"
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <KawaiiStar className="w-5 h-5 md:w-6 md:h-6 text-[var(--secondary)]" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 -right-4 md:-right-8"
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <KawaiiHeart className="w-4 h-4 text-[var(--secondary)]" />
      </motion.div>
    </motion.div>
  );
}

import { motion } from "motion/react";
import { IS_MOBILE } from "../../utils";
import { DEFAULT_WARM_MOTES } from "./homeData";

/** Warm floating embers — like sitting by a cozy fireplace */
export function WarmMotes({ motes }: { motes: typeof DEFAULT_WARM_MOTES }) {
  // PERFORMANCE: Skip motes entirely on mobile — removes animated glow overhead
  if (IS_MOBILE) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] pointer-events-none"
      aria-hidden="true"
    >
      {motes.map((mote, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: mote.left,
            bottom: -4,
            width: mote.size,
            height: mote.size,
            backgroundColor: mote.color,
          }}
          animate={{
            y: [0, -220 - i * 25],
            x: [0, mote.drift],
            opacity: [0, 0.75, 0],
          }}
          transition={{
            duration: mote.duration,
            repeat: Infinity,
            ease: "easeOut",
            delay: mote.delay,
          }}
        />
      ))}
    </div>
  );
}

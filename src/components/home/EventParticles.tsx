import { useMemo } from "react";
import { motion } from "motion/react";
import type { EventParticle } from "@/shared/constants/seasonalEvents";
import { IS_MOBILE } from "@/shared/lib/motionConfig";

export function EventParticles({ particles }: { particles: EventParticle[] }) {
  const items = useMemo(() => {
    const result: Array<{
      Icon: EventParticle["icon"];
      color: string;
      left: string;
      top: string;
      size: number;
      opacity: number;
      delay: number;
      duration: number;
      drift: number;
    }> = [];

    particles.forEach((config, pIdx) => {
      for (let i = 0; i < config.count; i++) {
        // deterministic placement from index - stable across renders
        const seed = pIdx * 100 + i;
        const left = ((seed * 37 + 13) % 90) + 5;
        const top = ((seed * 53 + 7) % 85) + 5;
        const size =
          config.minSize +
          ((seed * 17) % (config.maxSize - config.minSize + 1));
        const opacity =
          config.minOpacity +
          (((seed * 23) % 100) / 100) * (config.maxOpacity - config.minOpacity);

        result.push({
          Icon: config.icon,
          color: config.color,
          left: `${left}%`,
          top: `${top}%`,
          size,
          opacity,
          delay: (seed * 0.3) % 5,
          duration: 4 + (seed % 5),
          drift: ((seed * 11) % 20) - 10,
        });
      }
    });

    return result;
  }, [particles]);

  // skip on mobile - too many animated elements
  if (IS_MOBILE) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: item.left,
            top: item.top,
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, item.drift, 0],
            opacity: [item.opacity * 0.6, item.opacity, item.opacity * 0.6],
            rotate: [0, item.drift > 0 ? 8 : -8, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          <item.Icon
            style={{ width: item.size, height: item.size, color: item.color }}
            strokeWidth={1.5}
          />
        </motion.div>
      ))}
    </div>
  );
}

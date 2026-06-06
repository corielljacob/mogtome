import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IS_MOBILE } from "@/shared/lib/motionConfig";

// Stormblood's fire: a flickering flame glow hugging the bottom of the Home
// backdrop, with warm embers rising and fading on the way up. Home-only; skipped
// on mobile. Under reduced motion only the static glow remains. Seeded placement
// so it never jitters between renders.
const EMBER_COUNT = 36;

export const ThemeEmbers = memo(function ThemeEmbers() {
  const reduceMotion = useReducedMotion();

  const embers = useMemo(
    () =>
      Array.from({ length: EMBER_COUNT }, (_, i) => {
        const seed = i * 47 + 5;
        const dur = 4 + ((seed * 7) % 6); // 4..9s
        return {
          key: i,
          left: (seed * 37) % 100,
          size: 2 + ((seed * 13) % 4), // 2..5px
          rise: 55 + ((seed * 11) % 40), // 55..94vh
          opacity: 0.5 + ((seed * 17) % 45) / 100, // .5..0.95
          dur,
          delay: -((seed * 1.9) % dur), // negative -> start mid-rise
          sway: 8 + ((seed * 5) % 16), // 8..23px
          swayDur: 2.5 + ((seed * 3) % 3), // 2.5..5.5s
        };
      }),
    [],
  );

  if (IS_MOBILE) return null;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* flame glow along the bottom edge */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            "linear-gradient(0deg, color-mix(in srgb, var(--accent) 32%, transparent) 0%, color-mix(in srgb, var(--primary) 24%, transparent) 38%, transparent 78%)",
          filter: "blur(6px)",
        }}
        animate={
          reduceMotion ? undefined : { opacity: [0.75, 1, 0.82, 0.95, 0.75] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* embers rising and fading on the way up */}
      {!reduceMotion &&
        embers.map((e) => (
          <motion.div
            key={e.key}
            className="absolute bottom-0"
            style={{ left: `${e.left}%` }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: `-${e.rise}vh`,
              opacity: [0, e.opacity, e.opacity, 0],
            }}
            transition={{
              duration: e.dur,
              repeat: Infinity,
              ease: "easeOut",
              delay: e.delay,
            }}
          >
            <motion.div
              animate={{ x: [-e.sway / 2, e.sway / 2, -e.sway / 2] }}
              transition={{
                duration: e.swayDur,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span
                className="block rounded-full"
                style={{
                  width: e.size,
                  height: e.size,
                  background:
                    "radial-gradient(circle, #ffe49a, #ff8a3c 60%, transparent)",
                  boxShadow: "0 0 6px 1px rgba(255,140,60,0.6)",
                }}
              />
            </motion.div>
          </motion.div>
        ))}
    </div>
  );
});

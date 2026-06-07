import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IS_MOBILE } from "@/shared/lib/motionConfig";

// Dawntrail's dawn over the sea: a golden sun glowing at the horizon with its
// reflection pillaring down onto the water, and warm pollen drifting up in the
// light. Unlike the other expansions this is a *bright* theme, so it shows in
// light mode too (normal blend, warm tints). Home-only; skipped on mobile;
// reduced motion holds it still.

export const ThemeDawn = memo(function ThemeDawn() {
  const reduceMotion = useReducedMotion();

  const pollen = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const seed = i * 43 + 7;
        const dur = 8 + ((seed * 7) % 8); // 8..15s
        return {
          key: i,
          left: 5 + ((seed * 31) % 90),
          size: 2 + ((seed * 7) % 4), // 2..5px
          color: seed % 3 === 0 ? "var(--primary)" : "var(--accent)",
          op: 0.4 + ((seed * 13) % 50) / 100,
          rise: 50 + ((seed * 11) % 40), // 50..89vh
          dur,
          delay: -((seed * 1.7) % dur),
          sway: 10 + ((seed * 5) % 18),
          swayDur: 3.5 + ((seed * 3) % 4),
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
      {/* the sun's reflection - a soft light pillar down onto the sea */}
      <motion.div
        className="absolute"
        style={{
          left: "60%",
          top: "60%",
          width: "8vmax",
          height: "42%",
          marginLeft: "-4vmax",
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--accent) 52%, transparent) 0%, color-mix(in srgb, var(--accent) 20%, transparent) 38%, transparent 92%)",
          filter: "blur(9px)",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.65 }
            : { opacity: [0.5, 0.78, 0.58, 0.7, 0.5] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* the dawn sun, glowing at the horizon */}
      <motion.div
        className="absolute"
        style={{
          left: "60%",
          top: "60%",
          width: "32vmax",
          height: "32vmax",
          marginLeft: "-16vmax",
          marginTop: "-16vmax",
          background:
            "radial-gradient(circle, rgba(255,250,235,0.85) 0%, color-mix(in srgb, var(--accent) 48%, transparent) 22%, color-mix(in srgb, var(--accent) 16%, transparent) 46%, transparent 66%)",
          filter: "blur(10px)",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.8 }
            : { opacity: [0.68, 0.95, 0.78, 0.68], scale: [1, 1.05, 1] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* warm pollen drifting up in the sunlight */}
      {pollen.map((p) => (
        <motion.div
          key={p.key}
          className="absolute bottom-0"
          style={{ left: `${p.left}%` }}
          initial={{ y: 0, opacity: 0 }}
          animate={
            reduceMotion
              ? { opacity: p.op * 0.6 }
              : { y: `-${p.rise}vh`, opacity: [0, p.op, p.op, 0] }
          }
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: "easeOut",
            delay: p.delay,
          }}
        >
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : { x: [-p.sway / 2, p.sway / 2, -p.sway / 2] }
            }
            transition={{
              duration: p.swayDur,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span
              className="block rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: `radial-gradient(circle, ${p.color}, transparent 70%)`,
                boxShadow: `0 0 ${p.size * 1.8}px ${p.size * 0.5}px ${p.color}`,
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
});

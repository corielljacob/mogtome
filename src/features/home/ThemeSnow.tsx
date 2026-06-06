import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IS_MOBILE } from "@/shared/lib/motionConfig";

// Ishgardian snowfall for the Heavensward theme - soft, frost-tinted flakes drift
// down behind the Home backdrop. Home-only (mounted in BackgroundAtmospherics);
// skipped on mobile and under reduced motion. Placement is deterministic (seeded,
// not Math.random) so it never jitters between renders.
const FLAKE_COUNT = 48;

export const ThemeSnow = memo(function ThemeSnow() {
  const reduceMotion = useReducedMotion();

  const flakes = useMemo(
    () =>
      Array.from({ length: FLAKE_COUNT }, (_, i) => {
        const seed = i * 41 + 7;
        const size = 3 + ((seed * 13) % 11); // 3..13px
        const fallDur = 8 + ((seed * 7) % 9); // 8..16s
        const sway = 14 + ((seed * 5) % 20); // 14..34px
        return {
          key: i,
          left: (seed * 37) % 100,
          size,
          blur: size > 9 ? 2.2 : size > 5 ? 1 : 0.4,
          opacity: 0.4 + ((seed * 17) % 55) / 100, // .4..0.95
          fallDur,
          delay: -((seed * 1.3) % fallDur), // negative -> start mid-fall
          sway,
          swayDur: 3 + ((seed * 3) % 4), // 3..7s
        };
      }),
    [],
  );

  if (IS_MOBILE || reduceMotion) return null;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {flakes.map((f) => (
        <motion.div
          key={f.key}
          className="absolute top-0"
          style={{ left: `${f.left}%` }}
          initial={{ y: "-10vh" }}
          animate={{ y: "110vh" }}
          transition={{
            duration: f.fallDur,
            repeat: Infinity,
            ease: "linear",
            delay: f.delay,
          }}
        >
          <motion.div
            animate={{ x: [-f.sway / 2, f.sway / 2, -f.sway / 2] }}
            transition={{
              duration: f.swayDur,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span
              className="block rounded-full"
              style={{
                width: f.size,
                height: f.size,
                opacity: f.opacity,
                filter: `blur(${f.blur}px)`,
                background:
                  "radial-gradient(circle at 35% 30%, #ffffff, color-mix(in srgb, var(--secondary) 55%, #ffffff))",
                boxShadow:
                  "0 0 6px color-mix(in srgb, var(--secondary) 45%, transparent)",
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
});

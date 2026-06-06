import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IS_MOBILE } from "@/shared/lib/motionConfig";

// A Realm Reborn's Mothercrystal: a radiant blue-white crystal pulsing in deep
// navy space, with slow light rays and drifting crystal sparkles. Screen-blended
// so it glows. Home-only; skipped on mobile; reduced motion holds it still.

// deep-space starfield, tiled - white with faint blue/cyan glints
const STARFIELD =
  "radial-gradient(1.5px 1.5px at 10% 14%, rgba(255,255,255,0.92), transparent 60%)," +
  " radial-gradient(1px 1px at 26% 50%, rgba(200,224,255,0.7), transparent 60%)," +
  " radial-gradient(1.5px 1.5px at 42% 22%, rgba(255,255,255,0.85), transparent 60%)," +
  " radial-gradient(1px 1px at 56% 66%, rgba(190,236,255,0.65), transparent 60%)," +
  " radial-gradient(1.8px 1.8px at 78% 26%, rgba(255,255,255,0.9), transparent 60%)," +
  " radial-gradient(1px 1px at 90% 56%, rgba(205,228,255,0.65), transparent 60%)," +
  " radial-gradient(1.2px 1.2px at 34% 86%, rgba(255,255,255,0.65), transparent 60%)," +
  " radial-gradient(1.4px 1.4px at 84% 84%, rgba(196,232,255,0.65), transparent 60%)";

const SPARK_COLORS = [
  "#ffffff",
  "var(--secondary)",
  "var(--primary)",
  "#ffffff",
  "var(--accent)",
];

// the crystal sits centre-right, clear of the (left-aligned) hero text
const CX = 64;
const CY = 40;

export const ThemeCrystal = memo(function ThemeCrystal() {
  const reduceMotion = useReducedMotion();

  const sparks = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const seed = i * 53 + 11;
        return {
          key: i,
          left: 8 + ((seed * 31) % 84),
          top: 8 + ((seed * 37) % 80),
          size: 2 + ((seed * 7) % 4),
          color: SPARK_COLORS[seed % SPARK_COLORS.length],
          op: 0.4 + ((seed * 13) % 55) / 100,
          bob: 5 + ((seed * 5) % 9),
          dur: 4 + ((seed * 3) % 5),
          delay: -((seed * 1.6) % 6),
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
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: STARFIELD,
          backgroundSize: "300px 300px",
          opacity: 0.5,
        }}
      />

      {/* crystal light rays, slowly turning */}
      <motion.div
        className="absolute"
        style={{
          left: `${CX}%`,
          top: `${CY}%`,
          width: "120vmax",
          height: "120vmax",
          marginLeft: "-60vmax",
          marginTop: "-60vmax",
          background:
            "repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 5deg, color-mix(in srgb, var(--secondary) 14%, transparent) 5deg 6deg, transparent 6deg 11deg)",
          filter: "blur(8px)",
          mixBlendMode: "screen",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.4 }
            : { opacity: [0.3, 0.5, 0.3], rotate: 360 }
        }
        transition={{
          opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 150, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* the radiant crystal core, breathing */}
      <motion.div
        className="absolute"
        style={{
          left: `${CX}%`,
          top: `${CY}%`,
          width: "40vmax",
          height: "40vmax",
          marginLeft: "-20vmax",
          marginTop: "-20vmax",
          background:
            "radial-gradient(circle, rgba(236,246,255,0.85) 0%, color-mix(in srgb, var(--secondary) 48%, transparent) 20%, color-mix(in srgb, var(--primary) 22%, transparent) 44%, transparent 66%)",
          filter: "blur(14px)",
          mixBlendMode: "screen",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.7 }
            : { opacity: [0.55, 0.9, 0.68, 0.55], scale: [1, 1.06, 1] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* drifting, twinkling crystal sparkles */}
      {sparks.map((s) => (
        <motion.div
          key={`s${s.key}`}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: `radial-gradient(circle, ${s.color}, transparent 70%)`,
            boxShadow: `0 0 ${s.size * 1.8}px ${s.size * 0.5}px ${s.color}`,
            mixBlendMode: "screen",
          }}
          animate={
            reduceMotion
              ? { opacity: s.op * 0.7 }
              : {
                  y: [0, -s.bob, 0],
                  opacity: [
                    s.op * 0.25,
                    s.op,
                    s.op * 0.4,
                    s.op * 0.85,
                    s.op * 0.25,
                  ],
                }
          }
          transition={{
            duration: s.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
        />
      ))}
    </div>
  );
});

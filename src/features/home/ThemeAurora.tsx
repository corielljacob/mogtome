import { memo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IS_MOBILE } from "@/shared/lib/motionConfig";

// Shadowbringers' "divided sky": a starfield with the golden Light flickering in
// from BOTH sides, splitting a deep indigo night, and violet/cyan aether beams
// shimmering in the dark gap between. Screen-blended so it glows on the indigo.
// Home-only; skipped on mobile. Under reduced motion everything holds still.

// white / lavender / faint-cyan stars, tiled
const STARFIELD =
  "radial-gradient(1.5px 1.5px at 12% 14%, rgba(255,255,255,0.9), transparent 60%)," +
  " radial-gradient(1px 1px at 30% 56%, rgba(216,200,255,0.7), transparent 60%)," +
  " radial-gradient(1.6px 1.6px at 47% 24%, rgba(255,255,255,0.85), transparent 60%)," +
  " radial-gradient(1px 1px at 64% 70%, rgba(160,210,255,0.6), transparent 60%)," +
  " radial-gradient(2px 2px at 80% 18%, rgba(235,225,255,0.9), transparent 60%)," +
  " radial-gradient(1px 1px at 90% 50%, rgba(210,235,255,0.65), transparent 60%)," +
  " radial-gradient(1.2px 1.2px at 38% 86%, rgba(255,255,255,0.6), transparent 60%)," +
  " radial-gradient(1.4px 1.4px at 8% 76%, rgba(214,205,255,0.7), transparent 60%)";

// violet / cyan aether beams, clustered in the dark centre gap
const BEAMS = [
  {
    left: 36,
    w: 13,
    hue: "var(--primary)",
    rot: -6,
    dur: 9,
    delay: 0,
    max: 0.5,
  },
  {
    left: 50,
    w: 10,
    hue: "var(--secondary)",
    rot: 4,
    dur: 12,
    delay: 1.4,
    max: 0.4,
  },
  {
    left: 62,
    w: 14,
    hue: "var(--primary)",
    rot: -4,
    dur: 10,
    delay: 0.8,
    max: 0.46,
  },
];

export const ThemeAurora = memo(function ThemeAurora() {
  const reduceMotion = useReducedMotion();

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

      {/* golden Light pouring in from the left, flickering */}
      <motion.div
        className="absolute inset-y-[-10%] left-[-10%] w-[42%]"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--accent) 62%, transparent), color-mix(in srgb, var(--accent) 22%, transparent) 42%, transparent 72%)",
          filter: "blur(28px)",
          mixBlendMode: "screen",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.85 }
            : { opacity: [0.62, 0.95, 0.72, 0.9, 0.62] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* ...and from the right */}
      <motion.div
        className="absolute inset-y-[-10%] right-[-10%] w-[42%]"
        style={{
          background:
            "linear-gradient(to left, color-mix(in srgb, var(--accent) 62%, transparent), color-mix(in srgb, var(--accent) 22%, transparent) 42%, transparent 72%)",
          filter: "blur(28px)",
          mixBlendMode: "screen",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.85 }
            : { opacity: [0.72, 0.6, 0.94, 0.68, 0.72] }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      />

      {/* violet / cyan beams in the dark gap */}
      {BEAMS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute top-[-15%] h-[130%]"
          style={{
            left: `${b.left}%`,
            width: `${b.w}%`,
            background: `linear-gradient(to top, transparent 4%, color-mix(in srgb, ${b.hue} 72%, transparent) 48%, color-mix(in srgb, ${b.hue} 26%, transparent) 74%, transparent)`,
            filter: "blur(34px)",
            mixBlendMode: "screen",
          }}
          initial={{ opacity: b.max * 0.7, x: 0, rotate: b.rot }}
          animate={
            reduceMotion
              ? { opacity: b.max * 0.8, rotate: b.rot }
              : {
                  opacity: [
                    b.max * 0.5,
                    b.max,
                    b.max * 0.65,
                    b.max,
                    b.max * 0.5,
                  ],
                  x: [-16, 16, -16],
                  rotate: b.rot,
                }
          }
          transition={{
            duration: b.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: b.delay,
          }}
        />
      ))}
    </div>
  );
});

import { memo, type CSSProperties } from "react";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { IS_MOBILE } from "@/shared/lib/motionConfig";

// Evercold's Norse night: the aurora borealis - broad ribbons of green, cyan and
// violet light slowly undulating across the upper sky (screen-blended so they
// glow on the deep frost-dark), over a cold starfield. Snow falls separately.
// Home-only; skipped on mobile; reduced motion holds the ribbons still.

// cold white / pale-blue stars, tiled
const STARFIELD =
  "radial-gradient(1.4px 1.4px at 12% 16%, rgba(255,255,255,0.9), transparent 60%)," +
  " radial-gradient(1px 1px at 30% 54%, rgba(200,228,255,0.7), transparent 60%)," +
  " radial-gradient(1.5px 1.5px at 48% 26%, rgba(255,255,255,0.85), transparent 60%)," +
  " radial-gradient(1px 1px at 66% 68%, rgba(190,236,245,0.6), transparent 60%)," +
  " radial-gradient(1.8px 1.8px at 82% 20%, rgba(255,255,255,0.9), transparent 60%)," +
  " radial-gradient(1px 1px at 90% 52%, rgba(205,235,255,0.65), transparent 60%)," +
  " radial-gradient(1.2px 1.2px at 38% 88%, rgba(255,255,255,0.6), transparent 60%)," +
  " radial-gradient(1.4px 1.4px at 8% 78%, rgba(196,232,250,0.65), transparent 60%)";

// aurora ribbons (fixed northern-light hues), hanging in the upper sky
const RIBBONS = [
  { top: 6, h: 32, hue: "#45d9a0", dur: 15, delay: 0, max: 0.42 },
  { top: 14, h: 28, hue: "#36c8da", dur: 19, delay: 2.5, max: 0.34 },
  { top: 2, h: 36, hue: "#9385e8", dur: 23, delay: 5, max: 0.26 },
];

export const NorthernLights = memo(function NorthernLights() {
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

      {RIBBONS.map((r, i) => (
        <div
          key={i}
          className="absolute inset-x-0"
          // opacity-only shimmer (no transform) - animating this heavy blurred,
          // screen-blended layer's transform re-rasterizes it every frame and
          // flickers; staggered fades still read as living aurora.
          style={
            reduceMotion
              ? {
                  top: `${r.top}%`,
                  height: `${r.h}%`,
                  background: `linear-gradient(to bottom, transparent 0%, ${r.hue} 50%, transparent 100%)`,
                  filter: "blur(34px)",
                  mixBlendMode: "screen",
                  opacity: r.max * 0.7,
                }
              : ({
                  top: `${r.top}%`,
                  height: `${r.h}%`,
                  background: `linear-gradient(to bottom, transparent 0%, ${r.hue} 50%, transparent 100%)`,
                  filter: "blur(34px)",
                  mixBlendMode: "screen",
                  "--home-op-1": r.max * 0.4,
                  "--home-op-2": r.max,
                  "--home-op-3": r.max * 0.55,
                  "--home-op-4": r.max * 0.85,
                  animation: `home-aurora-shimmer ${r.dur}s ease-in-out ${r.delay}s infinite`,
                } as CSSProperties)
          }
        />
      ))}
    </div>
  );
});

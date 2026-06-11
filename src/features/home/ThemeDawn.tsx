import { memo, useMemo, type CSSProperties } from "react";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
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
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* the sun's reflection - a soft light pillar down onto the sea */}
      <div
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
          ...(reduceMotion
            ? { opacity: 0.65 }
            : { animation: "home-dawn-reflection 5s ease-in-out infinite" }),
        }}
      />

      {/* the dawn sun, glowing at the horizon */}
      <div
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
          ...(reduceMotion
            ? { opacity: 0.8 }
            : { animation: "home-dawn-sun 8s ease-in-out infinite" }),
        }}
      />

      {/* warm pollen drifting up in the sunlight */}
      {pollen.map((p) => (
        <div
          key={p.key}
          className="absolute bottom-0"
          style={
            reduceMotion
              ? { left: `${p.left}%`, opacity: p.op * 0.6 }
              : ({
                  left: `${p.left}%`,
                  opacity: 0,
                  "--home-rise": `${p.rise}vh`,
                  "--home-op": p.op,
                  animation: `home-rise-fade ${p.dur}s ease-out ${p.delay}s infinite`,
                } as CSSProperties)
          }
        >
          <div
            style={
              reduceMotion
                ? undefined
                : ({
                    "--home-sway": `${p.sway}px`,
                    animation: `home-sway ${p.swayDur}s ease-in-out infinite`,
                  } as CSSProperties)
            }
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
          </div>
        </div>
      ))}
    </div>
  );
});

import { memo, useMemo, type CSSProperties } from "react";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { IS_MOBILE } from "@/shared/lib/motionConfig";

// Endwalker's cosmos: a deep starfield with the moon hanging in the upper sky
// (sphere shading + craters + a warm halo), drifting twinkling stardust, and the
// occasional slow comet crossing the dark. Home-only; skipped on mobile. Under
// reduced motion it holds still (no comets, no drift).

// dense deep-space starfield, tiled - white with faint gold + blue glints
const STARFIELD =
  "radial-gradient(1.5px 1.5px at 9% 12%, rgba(255,255,255,0.95), transparent 60%)," +
  " radial-gradient(1px 1px at 22% 44%, rgba(200,220,255,0.7), transparent 60%)," +
  " radial-gradient(1.4px 1.4px at 35% 20%, rgba(255,255,255,0.85), transparent 60%)," +
  " radial-gradient(1px 1px at 48% 64%, rgba(255,236,200,0.7), transparent 60%)," +
  " radial-gradient(1.8px 1.8px at 60% 30%, rgba(255,255,255,0.9), transparent 60%)," +
  " radial-gradient(1px 1px at 72% 54%, rgba(205,222,255,0.65), transparent 60%)," +
  " radial-gradient(1.5px 1.5px at 84% 22%, rgba(255,255,255,0.85), transparent 60%)," +
  " radial-gradient(1px 1px at 92% 60%, rgba(255,232,195,0.6), transparent 60%)," +
  " radial-gradient(1.2px 1.2px at 16% 80%, rgba(255,255,255,0.7), transparent 60%)," +
  " radial-gradient(1px 1px at 40% 90%, rgba(210,225,255,0.6), transparent 60%)," +
  " radial-gradient(1.3px 1.3px at 66% 84%, rgba(255,255,255,0.65), transparent 60%)," +
  " radial-gradient(1px 1px at 88% 88%, rgba(255,238,205,0.6), transparent 60%)";

const MOTE_COLORS = [
  "#ffffff",
  "var(--secondary)",
  "var(--primary)",
  "#ffffff",
  "var(--accent)",
];

// soft craters dappling the moon's surface (positions + sizes as % of the moon)
const CRATERS = [
  { left: 56, top: 24, size: 16 },
  { left: 33, top: 52, size: 12 },
  { left: 64, top: 60, size: 10 },
  { left: 28, top: 32, size: 7 },
  { left: 48, top: 73, size: 8 },
  { left: 72, top: 42, size: 6 },
];

// comets - slow, grand diagonal streaks on a long loop
const COMETS = [
  {
    top: 18,
    left: 6,
    len: 150,
    rot: 19,
    dx: 42,
    dy: 15,
    dur: 2.6,
    gap: 11,
    delay: 3,
  },
  {
    top: 56,
    left: 30,
    len: 110,
    rot: 14,
    dx: 34,
    dy: 10,
    dur: 2.2,
    gap: 16,
    delay: 9,
  },
];

export const ThemeCosmos = memo(function ThemeCosmos() {
  const reduceMotion = useReducedMotion();

  const motes = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const seed = i * 47 + 13;
        return {
          key: i,
          left: 4 + ((seed * 31) % 92),
          top: 6 + ((seed * 37) % 86),
          size: 2 + ((seed * 7) % 4), // 2..5px
          color: MOTE_COLORS[seed % MOTE_COLORS.length],
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
          backgroundSize: "320px 320px",
          opacity: 0.55,
        }}
      />

      {/* the moon, hanging in the upper sky - the heart of Endwalker. A static
          sphere inside a gently drifting wrapper, ringed by a breathing halo. */}
      <div
        className="absolute"
        style={
          reduceMotion
            ? { right: "7%", top: "9%", width: "20vmax", height: "20vmax" }
            : ({
                right: "7%",
                top: "9%",
                width: "20vmax",
                height: "20vmax",
                "--home-bob": "-9px",
                animation: "home-float-bob 13s ease-in-out infinite",
              } as CSSProperties)
        }
      >
        {/* warm halo */}
        <div
          className="absolute inset-[-38%]"
          style={
            reduceMotion
              ? {
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--accent) 42%, transparent) 0%, color-mix(in srgb, var(--secondary) 22%, transparent) 38%, transparent 68%)",
                  filter: "blur(24px)",
                  mixBlendMode: "screen",
                  opacity: 0.6,
                }
              : ({
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--accent) 42%, transparent) 0%, color-mix(in srgb, var(--secondary) 22%, transparent) 38%, transparent 68%)",
                  filter: "blur(24px)",
                  mixBlendMode: "screen",
                  "--home-op-1": 0.42,
                  "--home-op-2": 0.7,
                  "--home-op-3": 0.5,
                  animation: "home-halo-breathe 8s ease-in-out infinite",
                } as CSSProperties)
          }
        />
        {/* moon body - lit from the upper left, shadowed lower right */}
        <div
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, #f7f1e4 0%, #e7d9bd 30%, #c0af90 52%, #8b7e8f 72%, #574f6b 88%, #3a3350 100%)",
            boxShadow:
              "inset -16px -18px 44px rgba(24,18,42,0.72), 0 0 34px color-mix(in srgb, var(--accent) 22%, transparent)",
          }}
        >
          {CRATERS.map((c, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${c.left}%`,
                top: `${c.top}%`,
                width: `${c.size}%`,
                height: `${c.size}%`,
                background:
                  "radial-gradient(circle at 38% 34%, rgba(60,52,88,0.6) 0%, rgba(60,52,88,0.18) 55%, transparent 72%)",
              }}
            />
          ))}

          {/* terminator: a soft shadow falling off toward the lower right, so
              the lit side reads brighter and the dark side recedes */}
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 26%, transparent 0%, transparent 40%, rgba(24,18,44,0.32) 68%, rgba(16,12,32,0.6) 100%)",
            }}
          />
        </div>
      </div>

      {/* drifting, twinkling stardust */}
      {motes.map((m) => (
        <div
          key={`m${m.key}`}
          className="absolute rounded-full"
          style={
            reduceMotion
              ? {
                  left: `${m.left}%`,
                  top: `${m.top}%`,
                  width: m.size,
                  height: m.size,
                  background: `radial-gradient(circle, ${m.color}, transparent 70%)`,
                  boxShadow: `0 0 ${m.size * 1.8}px ${m.size * 0.5}px ${m.color}`,
                  mixBlendMode: "screen",
                  opacity: m.op * 0.7,
                }
              : ({
                  left: `${m.left}%`,
                  top: `${m.top}%`,
                  width: m.size,
                  height: m.size,
                  background: `radial-gradient(circle, ${m.color}, transparent 70%)`,
                  boxShadow: `0 0 ${m.size * 1.8}px ${m.size * 0.5}px ${m.color}`,
                  mixBlendMode: "screen",
                  "--home-bob": `${m.bob}px`,
                  "--home-op": m.op,
                  animation: `home-mote-twinkle ${m.dur}s ease-in-out ${m.delay}s infinite`,
                } as CSSProperties)
          }
        />
      ))}

      {/* slow comets - active fraction folded into the keyframe; period = dur + gap */}
      {!reduceMotion &&
        COMETS.map((c, i) => (
          <div
            key={`c${i}`}
            className="absolute"
            style={
              {
                top: `${c.top}%`,
                left: `${c.left}%`,
                "--home-dx": `${c.dx}vw`,
                "--home-dy": `${c.dy}vh`,
                animation: `home-shooting-star ${c.dur + c.gap}s ease-out ${c.delay}s infinite`,
              } as CSSProperties
            }
          >
            <div
              style={{
                width: c.len,
                height: 2,
                transform: `rotate(${c.rot}deg)`,
                background:
                  "linear-gradient(to left, rgba(255,245,225,0.95), transparent)",
                boxShadow: "0 0 7px rgba(255,238,210,0.7)",
                borderRadius: 2,
              }}
            />
          </div>
        ))}
    </div>
  );
});

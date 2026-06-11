import { memo, useMemo, type CSSProperties } from "react";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { IS_MOBILE } from "@/shared/lib/motionConfig";

// Shadowbringers' "divided sky": the golden Light flickers in from BOTH sides,
// splitting a deep indigo night, with violet/cyan aether beams in the dark gap,
// drifting twinkling aether motes, and the occasional shooting star (the First's
// restored night). Screen-blended so it glows on the indigo. Home-only; skipped
// on mobile. Under reduced motion everything holds still and the streaks stop.

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

const MOTE_COLORS = [
  "#ffffff",
  "var(--primary)",
  "var(--secondary)",
  "var(--accent)",
  "#ffffff",
];

// shooting stars - rare diagonal streaks across the dark sky
const SHOOTING = [
  {
    top: 14,
    left: 10,
    len: 92,
    rot: 20,
    dx: 30,
    dy: 12,
    dur: 1.4,
    gap: 6.5,
    delay: 2,
  },
  {
    top: 28,
    left: 60,
    len: 72,
    rot: 17,
    dx: 24,
    dy: 9,
    dur: 1.2,
    gap: 9,
    delay: 6,
  },
];

export const ThemeAurora = memo(function ThemeAurora() {
  const reduceMotion = useReducedMotion();

  const motes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const seed = i * 53 + 9;
        return {
          key: i,
          left: 18 + ((seed * 29) % 64), // 18..82 - the dark gap
          top: 8 + ((seed * 37) % 80),
          size: 2 + ((seed * 7) % 4), // 2..5px
          color: MOTE_COLORS[seed % MOTE_COLORS.length],
          op: 0.45 + ((seed * 13) % 50) / 100,
          bob: 6 + ((seed * 5) % 10),
          dur: 4 + ((seed * 3) % 5),
          delay: -((seed * 1.7) % 6),
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

      {/* golden Light pouring in from the left, flickering */}
      <div
        className="absolute inset-y-[-10%] left-[-10%] w-[42%]"
        style={
          reduceMotion
            ? {
                background:
                  "linear-gradient(to right, color-mix(in srgb, var(--accent) 62%, transparent), color-mix(in srgb, var(--accent) 22%, transparent) 42%, transparent 72%)",
                filter: "blur(28px)",
                mixBlendMode: "screen",
                opacity: 0.85,
              }
            : ({
                background:
                  "linear-gradient(to right, color-mix(in srgb, var(--accent) 62%, transparent), color-mix(in srgb, var(--accent) 22%, transparent) 42%, transparent 72%)",
                filter: "blur(28px)",
                mixBlendMode: "screen",
                "--home-op-1": 0.62,
                "--home-op-2": 0.95,
                "--home-op-3": 0.72,
                "--home-op-4": 0.9,
                animation: "home-light-flicker 6s ease-in-out infinite",
              } as CSSProperties)
        }
      />
      {/* ...and from the right */}
      <div
        className="absolute inset-y-[-10%] right-[-10%] w-[42%]"
        style={
          reduceMotion
            ? {
                background:
                  "linear-gradient(to left, color-mix(in srgb, var(--accent) 62%, transparent), color-mix(in srgb, var(--accent) 22%, transparent) 42%, transparent 72%)",
                filter: "blur(28px)",
                mixBlendMode: "screen",
                opacity: 0.85,
              }
            : ({
                background:
                  "linear-gradient(to left, color-mix(in srgb, var(--accent) 62%, transparent), color-mix(in srgb, var(--accent) 22%, transparent) 42%, transparent 72%)",
                filter: "blur(28px)",
                mixBlendMode: "screen",
                "--home-op-1": 0.72,
                "--home-op-2": 0.6,
                "--home-op-3": 0.94,
                "--home-op-4": 0.68,
                animation: "home-light-flicker 7s ease-in-out 1.2s infinite",
              } as CSSProperties)
        }
      />

      {/* violet / cyan beams in the dark gap */}
      {BEAMS.map((b, i) => (
        <div
          key={i}
          className="absolute top-[-15%] h-[130%]"
          style={
            reduceMotion
              ? {
                  left: `${b.left}%`,
                  width: `${b.w}%`,
                  background: `linear-gradient(to top, transparent 4%, color-mix(in srgb, ${b.hue} 72%, transparent) 48%, color-mix(in srgb, ${b.hue} 26%, transparent) 74%, transparent)`,
                  filter: "blur(34px)",
                  mixBlendMode: "screen",
                  opacity: b.max * 0.8,
                  transform: `rotate(${b.rot}deg)`,
                }
              : ({
                  left: `${b.left}%`,
                  width: `${b.w}%`,
                  background: `linear-gradient(to top, transparent 4%, color-mix(in srgb, ${b.hue} 72%, transparent) 48%, color-mix(in srgb, ${b.hue} 26%, transparent) 74%, transparent)`,
                  filter: "blur(34px)",
                  mixBlendMode: "screen",
                  "--home-rot": `${b.rot}deg`,
                  "--home-op-1": b.max * 0.5,
                  "--home-op-2": b.max,
                  "--home-op-3": b.max * 0.65,
                  "--home-op-4": b.max,
                  animation: `home-beam-sway ${b.dur}s ease-in-out ${b.delay}s infinite`,
                } as CSSProperties)
          }
        />
      ))}

      {/* drifting, twinkling aether motes */}
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

      {/* shooting stars - active fraction = dur / (dur + gap) folded into the
          keyframe; period = dur + gap */}
      {!reduceMotion &&
        SHOOTING.map((s, i) => (
          <div
            key={`s${i}`}
            className="absolute"
            style={
              {
                top: `${s.top}%`,
                left: `${s.left}%`,
                "--home-dx": `${s.dx}vw`,
                "--home-dy": `${s.dy}vh`,
                animation: `home-shooting-star ${s.dur + s.gap}s ease-out ${s.delay}s infinite`,
              } as CSSProperties
            }
          >
            <div
              style={{
                width: s.len,
                height: 2,
                transform: `rotate(${s.rot}deg)`,
                background:
                  "linear-gradient(to left, rgba(255,255,255,0.95), transparent)",
                boxShadow: "0 0 6px rgba(255,255,255,0.7)",
                borderRadius: 2,
              }}
            />
          </div>
        ))}
    </div>
  );
});

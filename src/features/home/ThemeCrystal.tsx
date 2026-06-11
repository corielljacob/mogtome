import { memo, useMemo, type CSSProperties } from "react";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { IS_MOBILE } from "@/shared/lib/motionConfig";

// A Realm Reborn's Mothercrystal: a large faceted crystal glowing in deep navy
// space with shards slowly circling it, over a starfield. Screen-blended so it
// glows. Home-only; skipped on mobile; reduced motion holds it still.

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
const CY = 42;

// a tall faceted crystal
const CRYSTAL_CLIP = "polygon(50% 0%, 72% 17%, 64% 100%, 36% 100%, 28% 17%)";
// the left facet, caught in the light
const FACET_CLIP = "polygon(50% 0%, 50% 100%, 36% 100%, 28% 17%)";

// rings of shards that circle the crystal
const ORBITS = [
  { radius: 17, count: 6, dur: 48, dir: 1, size: 4, color: "var(--secondary)" },
  { radius: 10.5, count: 4, dur: 34, dir: -1, size: 3, color: "var(--accent)" },
];

export const ThemeCrystal = memo(function ThemeCrystal() {
  const reduceMotion = useReducedMotion();

  const sparks = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
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
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
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

      {/* aura glow behind the crystal, breathing (opacity only) */}
      <div
        className="absolute"
        style={
          reduceMotion
            ? {
                left: `${CX}%`,
                top: `${CY}%`,
                width: "40vmax",
                height: "40vmax",
                marginLeft: "-20vmax",
                marginTop: "-20vmax",
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--secondary) 36%, transparent) 0%, color-mix(in srgb, var(--primary) 18%, transparent) 40%, transparent 66%)",
                filter: "blur(20px)",
                mixBlendMode: "screen",
                opacity: 0.7,
              }
            : ({
                left: `${CX}%`,
                top: `${CY}%`,
                width: "40vmax",
                height: "40vmax",
                marginLeft: "-20vmax",
                marginTop: "-20vmax",
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--secondary) 36%, transparent) 0%, color-mix(in srgb, var(--primary) 18%, transparent) 40%, transparent 66%)",
                filter: "blur(20px)",
                mixBlendMode: "screen",
                "--home-op-1": 0.5,
                "--home-op-2": 0.8,
                "--home-op-3": 0.6,
                animation: "home-halo-breathe 7s ease-in-out infinite",
              } as CSSProperties)
        }
      />

      {/* the crystal itself - static shape inside a gently floating wrapper */}
      <div
        className="absolute"
        style={
          reduceMotion
            ? {
                left: `${CX}%`,
                top: `${CY}%`,
                width: "18vmax",
                height: "30vmax",
                marginLeft: "-9vmax",
                marginTop: "-15vmax",
              }
            : ({
                left: `${CX}%`,
                top: `${CY}%`,
                width: "18vmax",
                height: "30vmax",
                marginLeft: "-9vmax",
                marginTop: "-15vmax",
                "--home-bob": "-10px",
                animation: "home-float-bob 10s ease-in-out infinite",
              } as CSSProperties)
        }
      >
        <div
          className="absolute inset-0"
          style={{
            clipPath: CRYSTAL_CLIP,
            background:
              "linear-gradient(150deg, rgba(234,247,255,0.7) 0%, color-mix(in srgb, var(--secondary) 52%, transparent) 42%, color-mix(in srgb, var(--primary) 46%, transparent) 100%)",
            filter:
              "blur(6px) drop-shadow(0 0 20px color-mix(in srgb, var(--secondary) 55%, transparent))",
            mixBlendMode: "screen",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            clipPath: FACET_CLIP,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.12))",
            filter: "blur(7px)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* shards circling the crystal */}
      {ORBITS.map((ring, ri) => (
        <div
          key={`ring${ri}`}
          className="absolute"
          style={
            reduceMotion
              ? { left: `${CX}%`, top: `${CY}%`, width: 1, height: 1 }
              : ({
                  left: `${CX}%`,
                  top: `${CY}%`,
                  width: 1,
                  height: 1,
                  "--home-rot-to": `${ring.dir * 360}deg`,
                  animation: `home-orbit ${ring.dur}s linear infinite`,
                } as CSSProperties)
          }
        >
          {Array.from({ length: ring.count }).map((_, i) => (
            <span
              key={i}
              className="absolute left-0 top-0 rounded-full"
              style={{
                width: ring.size,
                height: ring.size,
                transform: `translate(-50%, -50%) rotate(${(i * 360) / ring.count}deg) translateY(-${ring.radius}vmax)`,
                background: `radial-gradient(circle, #ffffff, ${ring.color} 60%, transparent)`,
                boxShadow: `0 0 ${ring.size * 2.2}px ${ring.size * 0.7}px ${ring.color}`,
              }}
            />
          ))}
        </div>
      ))}

      {/* drifting, twinkling crystal sparkles */}
      {sparks.map((s) => (
        <div
          key={`s${s.key}`}
          className="absolute rounded-full"
          style={
            reduceMotion
              ? {
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  width: s.size,
                  height: s.size,
                  background: `radial-gradient(circle, ${s.color}, transparent 70%)`,
                  boxShadow: `0 0 ${s.size * 1.8}px ${s.size * 0.5}px ${s.color}`,
                  mixBlendMode: "screen",
                  opacity: s.op * 0.7,
                }
              : ({
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  width: s.size,
                  height: s.size,
                  background: `radial-gradient(circle, ${s.color}, transparent 70%)`,
                  boxShadow: `0 0 ${s.size * 1.8}px ${s.size * 0.5}px ${s.color}`,
                  mixBlendMode: "screen",
                  "--home-bob": `${s.bob}px`,
                  "--home-op": s.op,
                  animation: `home-mote-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
                } as CSSProperties)
          }
        />
      ))}
    </div>
  );
});

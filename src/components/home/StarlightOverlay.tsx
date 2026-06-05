import { useMemo } from "react";
import { motion } from "motion/react";
import { Snowflake, Sparkles } from "lucide-react";
import { IS_MOBILE } from "@/utils/motionConfig";

const STRING_LIGHT_COLORS = [
  "#EF4444",
  "#22C55E",
  "#FBBF24",
  "#3B82F6",
  "#EF4444",
  "#22C55E",
  "#FBBF24",
  "#3B82F6",
];

// Draped "UUUU" garland: a wire sagging in U-swoops between evenly spaced pegs,
// plus evenly spaced points to hang bulbs/pennants. Coords are 0–1000 (x) × 0–100
// (y) viewBox - render the wire with preserveAspectRatio="none" and
// vector-effect="non-scaling-stroke".
function buildDrapedGarland(
  swoops: number,
  pegY: number,
  sagDepth: number,
  count: number,
) {
  const W = 1000;
  const segW = W / swoops;
  const ctrlY = pegY + 2 * sagDepth; // quadratic control point so each dip reaches pegY + sagDepth
  let wirePath = `M 0 ${pegY}`;
  for (let i = 0; i < swoops; i++) {
    const midX = i * segW + segW / 2;
    wirePath += ` Q ${midX} ${ctrlY} ${(i + 1) * segW} ${pegY}`;
  }
  const points: Array<{ x: number; y: number }> = [];
  for (let k = 0; k < count; k++) {
    const x = ((k + 0.5) / count) * W;
    const i = Math.min(swoops - 1, Math.floor(x / segW));
    const t = (x - i * segW) / segW;
    const y = (1 - t) * (1 - t) * pegY + 2 * (1 - t) * t * ctrlY + t * t * pegY;
    points.push({ x, y });
  }
  return { wirePath, points };
}

// Starlight Celebration overlay. mobile gets a CSS-only fallback (6 snowflakes
// + static glow) instead of 60+ animated elements.
export function StarlightOverlay() {
  // deterministic positions - stable across renders
  const snowflakes = useMemo(() => {
    const flakes: Array<{
      left: string;
      size: number;
      delay: number;
      duration: number;
      drift: number;
      opacity: number;
      variant: "flake" | "dot";
    }> = [];

    for (let i = 0; i < 35; i++) {
      const seed = i * 37 + 13;
      flakes.push({
        left: `${(seed * 53) % 100}%`,
        size: 6 + (seed % 14),
        delay: (seed * 0.17) % 12,
        duration: 8 + (seed % 10),
        drift: ((seed * 11) % 60) - 30,
        opacity: 0.15 + ((seed * 7) % 100) / 250,
        variant: i % 4 === 0 ? "flake" : "dot",
      });
    }
    return flakes;
  }, []);

  const { wirePath, stringLightBulbs } = useMemo(() => {
    // 8 swoops, 17 bulbs
    const garland = buildDrapedGarland(8, 5, 13, 17);
    const bulbs = garland.points.map((p, i) => ({
      x: p.x / 10, // bulb renderer multiplies x back by 10
      y: p.y,
      color: STRING_LIGHT_COLORS[i % STRING_LIGHT_COLORS.length],
      delay: i * 0.22,
      size: 8 + (i % 3) * 2,
    }));
    return { wirePath: garland.wirePath, stringLightBulbs: bulbs };
  }, []);

  if (IS_MOBILE) {
    return (
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {[12, 28, 45, 62, 78, 90].map((left, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/60 animate-float-moogle-subtle"
            style={{
              left: `${left}%`,
              top: `${5 + i * 12}%`,
              width: 4 + (i % 3),
              height: 4 + (i % 3),
              animationDuration: `${4 + i}s`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.2,
            }}
          />
        ))}
        <div
          className="absolute bottom-0 inset-x-0 h-[30%] opacity-80"
          style={{
            background:
              "linear-gradient(to top, rgba(217,119,6,0.10), rgba(251,191,36,0.05) 40%, transparent)",
          }}
        />
        <div
          className="absolute bottom-0 inset-x-0 h-[3%]"
          style={{
            background:
              "linear-gradient(to top, rgba(255,255,255,0.06), transparent)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {snowflakes.map((flake, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: flake.left, top: "-5%" }}
          animate={{
            y: [
              0,
              typeof window !== "undefined" ? window.innerHeight + 40 : 1000,
            ],
            x: [0, flake.drift, 0],
            rotate: [0, 360],
          }}
          transition={{
            y: {
              duration: flake.duration,
              repeat: Infinity,
              ease: "linear",
              delay: flake.delay,
            },
            x: {
              duration: flake.duration * 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: flake.delay,
            },
            rotate: {
              duration: flake.duration * 2,
              repeat: Infinity,
              ease: "linear",
              delay: flake.delay,
            },
          }}
        >
          {flake.variant === "flake" ? (
            <Snowflake
              style={{
                width: flake.size,
                height: flake.size,
                opacity: flake.opacity,
              }}
              className="text-blue-200"
              strokeWidth={1.5}
            />
          ) : (
            <div
              className="rounded-full bg-white/80"
              style={{
                width: flake.size * 0.4,
                height: flake.size * 0.4,
                opacity: flake.opacity * 0.8,
              }}
            />
          )}
        </motion.div>
      ))}

      {/* wire and bulbs share one SVG so they live in the same coordinate space */}
      <svg
        className="absolute top-0 inset-x-0 h-20 sm:h-24"
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          {stringLightBulbs.map((bulb, i) => (
            <radialGradient key={`glow-${i}`} id={`bulb-glow-${i}`}>
              <stop offset="0%" stopColor={bulb.color} stopOpacity="0.5" />
              <stop offset="40%" stopColor={bulb.color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={bulb.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* dark line behind the cord for depth */}
        <path
          d={wirePath}
          stroke="rgba(0,0,0,0.20)"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d={wirePath}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.2"
          fill="none"
        />

        {stringLightBulbs.map((bulb, i) => {
          const cx = bulb.x * 10; // undo the /10 from the data def
          const cy = bulb.y;
          const r = bulb.size * 0.4;
          return (
            <g key={i}>
              <motion.circle
                cx={cx}
                cy={cy}
                r={r * 5}
                fill={`url(#bulb-glow-${i})`}
                animate={{
                  opacity: [0.35, 0.75, 0.35],
                  r: [r * 4.5, r * 5.5, r * 4.5],
                }}
                transition={{
                  duration: 2.5 + (i % 3) * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bulb.delay,
                }}
              />
              <motion.circle
                cx={cx}
                cy={cy}
                r={r * 2}
                fill={bulb.color}
                opacity={0.35}
                style={{ filter: "blur(1px)" }}
                animate={{ opacity: [0.25, 0.45, 0.25] }}
                transition={{
                  duration: 1.8 + (i % 4) * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bulb.delay + 0.1,
                }}
              />
              {/* bulb body, slightly elongated */}
              <motion.ellipse
                cx={cx}
                cy={cy + r * 0.15}
                rx={r}
                ry={r * 1.2}
                fill={bulb.color}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{
                  duration: 2 + (i % 3) * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bulb.delay,
                }}
              />
              {/* specular highlight */}
              <ellipse
                cx={cx - r * 0.25}
                cy={cy - r * 0.35}
                rx={r * 0.3}
                ry={r * 0.2}
                fill="white"
                opacity={0.5}
              />
            </g>
          );
        })}
      </svg>

      <motion.div
        className="absolute bottom-0 inset-x-0 h-[30%]"
        style={{
          background:
            "linear-gradient(to top, rgba(217,119,6,0.10), rgba(251,191,36,0.05) 40%, transparent)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute bottom-0 inset-x-0 h-[3%]"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,0.06), transparent)",
        }}
      />

      {[
        { left: "15%", top: "20%", delay: 0 },
        { left: "75%", top: "15%", delay: 2 },
        { left: "55%", top: "35%", delay: 4.5 },
        { left: "25%", top: "70%", delay: 1.5 },
        { left: "85%", top: "60%", delay: 3.5 },
        { left: "45%", top: "85%", delay: 5.5 },
      ].map((sparkle, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          style={{ left: sparkle.left, top: sparkle.top }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.5],
            rotate: [0, 180],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: sparkle.delay,
            repeatDelay: 4,
          }}
        >
          <Sparkles className="w-4 h-4 text-amber-300/60" strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
}

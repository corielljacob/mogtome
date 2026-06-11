import { useMemo, type CSSProperties } from "react";
import { Ghost } from "lucide-react";
import { IS_MOBILE } from "@/shared/lib/motionConfig";

// All Saints' Wake overlay. mobile gets a static fallback (fog + 1 ghost)
// instead of ~12 animated elements.
export function HalloweenOverlay() {
  const ghosts = useMemo(
    () => [
      {
        left: "5%",
        delay: 0,
        duration: 22,
        yStart: "60%",
        yEnd: "20%",
        drift: 80,
        size: 32,
        opacity: 0.08,
      },
      {
        left: "70%",
        delay: 6,
        duration: 26,
        yStart: "75%",
        yEnd: "15%",
        drift: -60,
        size: 28,
        opacity: 0.06,
      },
      {
        left: "35%",
        delay: 12,
        duration: 20,
        yStart: "80%",
        yEnd: "25%",
        drift: 50,
        size: 24,
        opacity: 0.07,
      },
      {
        left: "85%",
        delay: 3,
        duration: 24,
        yStart: "55%",
        yEnd: "10%",
        drift: -70,
        size: 30,
        opacity: 0.05,
      },
      {
        left: "20%",
        delay: 9,
        duration: 28,
        yStart: "70%",
        yEnd: "5%",
        drift: 40,
        size: 26,
        opacity: 0.06,
      },
    ],
    [],
  );

  if (IS_MOBILE) {
    return (
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute bottom-0 inset-x-0 h-[40%] opacity-80"
          style={{
            background:
              "linear-gradient(to top, rgba(109,40,217,0.12), rgba(109,40,217,0.06) 40%, transparent)",
          }}
        />
        <div
          className="absolute animate-float-moogle-subtle"
          style={{
            left: "15%",
            top: "55%",
            animationDuration: "8s",
            opacity: 0.07,
          }}
        >
          <Ghost
            style={{ width: 28, height: 28 }}
            className="text-purple-400/60"
            strokeWidth={1}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(12,8,20,0.18) 100%)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute bottom-0 inset-x-0 h-[40%]"
        style={
          {
            background:
              "linear-gradient(to top, rgba(109,40,217,0.12), rgba(109,40,217,0.06) 40%, transparent)",
            "--home-op-min": 0.6,
            "--home-op-max": 1,
            animation: "home-fog-pulse 8s ease-in-out infinite",
          } as CSSProperties
        }
      />
      <div
        className="absolute bottom-0 inset-x-0 h-[25%]"
        style={
          {
            background:
              "linear-gradient(to top, rgba(74,222,128,0.06), rgba(34,197,94,0.03) 50%, transparent)",
            "--home-op-min": 0.4,
            "--home-op-max": 0.8,
            animation: "home-fog-pulse 6s ease-in-out 2s infinite",
          } as CSSProperties
        }
      />

      <div
        className="absolute bottom-[5%] h-[15%] w-[60%] rounded-full blur-3xl"
        style={
          {
            background: "rgba(167,139,250,0.08)",
            "--home-x-from": "-10%",
            "--home-x-to": "110%",
            "--home-op-max": 0.12,
            animation: "home-fog-sweep 18s linear infinite",
          } as CSSProperties
        }
      />
      <div
        className="absolute bottom-[12%] h-[10%] w-[45%] rounded-full blur-3xl"
        style={
          {
            background: "rgba(249,115,22,0.06)",
            "--home-x-from": "110%",
            "--home-x-to": "-10%",
            "--home-op-max": 0.1,
            animation: "home-fog-sweep 22s linear 4s infinite",
          } as CSSProperties
        }
      />

      <div
        className="absolute inset-0"
        style={
          {
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(12,8,20,0.18) 100%)",
            "--home-op-min": 0.7,
            "--home-op-max": 1,
            animation: "home-fog-pulse 5s ease-in-out infinite",
          } as CSSProperties
        }
      />

      {ghosts.map((ghost, i) => (
        <div
          key={i}
          className="absolute"
          style={
            {
              left: ghost.left,
              top: ghost.yStart,
              "--home-y": `${-(parseFloat(ghost.yStart) - parseFloat(ghost.yEnd)) * 4}px`,
              "--home-drift": `${ghost.drift}px`,
              "--home-op": ghost.opacity,
              animation: `home-ghost-drift ${ghost.duration}s ease-in-out ${ghost.delay}s infinite`,
            } as CSSProperties
          }
        >
          <Ghost
            style={{ width: ghost.size, height: ghost.size }}
            className="text-purple-400/60"
            strokeWidth={1}
          />
        </div>
      ))}

      {[
        { left: "10%", top: "70%", size: 120 },
        { left: "80%", top: "65%", size: 100 },
        { left: "45%", top: "80%", size: 140 },
      ].map((spot, i) => (
        <div
          key={`lantern-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            left: spot.left,
            top: spot.top,
            width: spot.size,
            height: spot.size,
            background:
              "radial-gradient(circle, rgba(249,115,22,0.15), rgba(251,191,36,0.08), transparent)",
            animation: `home-lantern-flicker ${3 + i * 0.5}s ease-in-out ${i * 1.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

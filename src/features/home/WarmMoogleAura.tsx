import { type CSSProperties } from "react";
import { IS_MOBILE } from "@/shared/lib/motionConfig";

export function WarmMoogleAura({ eventId }: { eventId: string | null }) {
  // skip on mobile - drops a large blurred element
  if (IS_MOBILE) return null;
  if (eventId === "all-saints-wake") {
    return (
      <>
        <div
          className="absolute inset-0"
          style={
            {
              "--home-scale-min": 2.0,
              "--home-scale-max": 2.4,
              "--home-op-min": 0.25,
              "--home-op-max": 0.5,
              animation: "home-aura-pulse 3.5s ease-in-out infinite",
            } as CSSProperties
          }
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/35 via-orange-500/20 to-green-500/25 blur-3xl" />
        </div>
        {/* rotate (10s) + opacity breathe (2.5s) ran on separate clocks - split
            across an outer spin wrapper and an inner breathe wrapper */}
        <div
          className="absolute inset-0"
          style={
            {
              "--home-scale": 1.3,
              "--home-rot-from": "0deg",
              "--home-rot-to": "-360deg",
              animation: "home-aura-spin 10s linear infinite",
            } as CSSProperties
          }
          aria-hidden="true"
        >
          <div
            className="w-full h-full"
            style={
              {
                "--home-op-min": 0.15,
                "--home-op-max": 0.4,
                animation: "home-aura-breathe 2.5s ease-in-out infinite",
              } as CSSProperties
            }
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-orange-400/30 via-purple-600/25 to-green-400/20 blur-2xl" />
          </div>
        </div>
        <div
          className="absolute inset-0 scale-[1.6]"
          style={
            {
              "--home-op-a": 0.1,
              "--home-op-b": 0.35,
              "--home-op-c": 0.05,
              "--home-op-d": 0.3,
              animation: "home-aura-flicker 2s ease-in-out infinite",
            } as CSSProperties
          }
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-radial from-orange-400/25 to-transparent blur-2xl" />
        </div>
      </>
    );
  }

  if (eventId === "starlight") {
    return (
      <>
        <div
          className="absolute inset-0"
          style={
            {
              "--home-scale-min": 2.0,
              "--home-scale-max": 2.3,
              "--home-op-min": 0.35,
              "--home-op-max": 0.55,
              animation: "home-aura-pulse 5s ease-in-out infinite",
            } as CSSProperties
          }
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500/30 via-amber-400/30 to-green-500/25 blur-3xl" />
        </div>
        {/* rotate (16s) + opacity breathe (4s) on separate clocks */}
        <div
          className="absolute inset-0"
          style={
            {
              "--home-scale": 1.3,
              "--home-rot-from": "0deg",
              "--home-rot-to": "360deg",
              animation: "home-aura-spin 16s linear infinite",
            } as CSSProperties
          }
          aria-hidden="true"
        >
          <div
            className="w-full h-full"
            style={
              {
                "--home-op-min": 0.2,
                "--home-op-max": 0.4,
                animation: "home-aura-breathe 4s ease-in-out infinite",
              } as CSSProperties
            }
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400/30 via-red-400/20 to-green-400/20 blur-2xl" />
          </div>
        </div>
        <div
          className="absolute inset-0"
          style={
            {
              "--home-scale-min": 1.5,
              "--home-scale-max": 1.7,
              "--home-op-min": 0.15,
              "--home-op-max": 0.35,
              animation: "home-aura-pulse 6s ease-in-out infinite",
            } as CSSProperties
          }
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-radial from-amber-300/25 to-transparent blur-2xl" />
        </div>
      </>
    );
  }

  return (
    <div
      className="absolute inset-0"
      style={
        {
          "--home-scale-min": 1.6,
          "--home-scale-max": 1.85,
          "--home-op-min": 0.35,
          "--home-op-max": 0.55,
          animation: "home-aura-pulse 5s ease-in-out infinite",
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <div
        className="w-full h-full rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--primary) 32%, transparent), color-mix(in srgb, var(--accent) 16%, transparent) 45%, transparent 70%)",
        }}
      />
    </div>
  );
}

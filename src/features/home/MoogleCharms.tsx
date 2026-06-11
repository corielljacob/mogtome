import { type CSSProperties } from "react";
import {
  Ghost,
  Skull,
  Moon,
  Snowflake,
  Gift,
  Star,
  TreePine,
} from "lucide-react";
import { KawaiiHeart, KawaiiStar } from "@/shared/ui/kawaiiMotifs";
import { IS_MOBILE } from "@/shared/lib/motionConfig";

export function MoogleCharms({ eventId }: { eventId: string | null }) {
  // skip on mobile - tiny, not worth the cost
  if (IS_MOBILE) return null;
  if (eventId === "all-saints-wake") {
    return (
      <div
        className="absolute inset-0 pointer-events-none animate-[fadeIn_0.6s_ease-out_0.7s_both]"
        aria-hidden="true"
      >
        <div
          className="absolute -top-1 left-1/4"
          style={
            {
              "--home-scale-max": 1.3,
              "--home-op-min": 0.5,
              "--home-op-max": 1,
              animation: "home-charm-pulse 2s ease-in-out 1s infinite",
            } as CSSProperties
          }
        >
          <Ghost className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
        </div>

        <div
          className="absolute top-1/5 -left-6 md:-left-10"
          style={
            {
              "--home-y": "-6px",
              "--home-rot": "-15deg",
              animation: "home-charm-bob-rot 3.2s ease-in-out infinite",
            } as CSSProperties
          }
        >
          <Skull
            className="w-4 h-4 md:w-5 md:h-5 text-orange-400"
            strokeWidth={1.5}
          />
        </div>

        <div
          className="absolute top-1/4 -right-6 md:-right-10"
          style={
            {
              "--home-y": "-5px",
              "--home-scale-max": 1.2,
              animation: "home-charm-bob-scale 2.5s ease-in-out 0.5s infinite",
            } as CSSProperties
          }
        >
          <Moon
            className="w-4 h-4 md:w-5 md:h-5 text-purple-300 fill-purple-300/30"
            strokeWidth={1.5}
          />
        </div>

        <div
          className="absolute bottom-1/4 -right-5 md:-right-8"
          style={
            {
              "--home-y": "-4px",
              "--home-op-min": 0.4,
              "--home-op-max": 1,
              animation: "home-charm-bob-op 2s ease-in-out 1.5s infinite",
            } as CSSProperties
          }
        >
          <Ghost className="w-3.5 h-3.5 text-green-400" strokeWidth={1.5} />
        </div>

        <div
          className="absolute bottom-1/3 -left-5 md:-left-8"
          style={
            {
              "--home-scale-max": 1.2,
              "--home-rot": "10deg",
              animation: "home-charm-scale-rot 3s ease-in-out 2s infinite",
            } as CSSProperties
          }
        >
          <Skull className="w-3.5 h-3.5 text-orange-300" strokeWidth={1.5} />
        </div>
      </div>
    );
  }

  if (eventId === "starlight") {
    return (
      <div
        className="absolute inset-0 pointer-events-none animate-[fadeIn_0.6s_ease-out_0.7s_both]"
        aria-hidden="true"
      >
        <div
          className="absolute -top-2 left-1/4"
          style={
            {
              "--home-scale-max": 1.3,
              "--home-rot": "90deg",
              "--home-op-min": 0.5,
              "--home-op-max": 1,
              animation: "home-charm-scale-rot-op 3s ease-in-out 1s infinite",
            } as CSSProperties
          }
        >
          <Snowflake className="w-4 h-4 text-blue-300" strokeWidth={1.5} />
        </div>

        <div
          className="absolute top-1/5 -left-6 md:-left-10"
          style={
            {
              "--home-y": "-5px",
              "--home-rot": "12deg",
              animation: "home-charm-bob-rot 3.2s ease-in-out infinite",
            } as CSSProperties
          }
        >
          <Gift
            className="w-4 h-4 md:w-5 md:h-5 text-red-400"
            strokeWidth={1.5}
          />
        </div>

        <div
          className="absolute top-1/4 -right-6 md:-right-10"
          style={
            {
              "--home-y": "-4px",
              "--home-scale-max": 1.3,
              animation: "home-charm-bob-scale 2.5s ease-in-out 0.5s infinite",
            } as CSSProperties
          }
        >
          <Star
            className="w-4 h-4 md:w-5 md:h-5 text-amber-300 fill-amber-300"
            strokeWidth={1.5}
          />
        </div>

        <div
          className="absolute bottom-1/4 -right-5 md:-right-8"
          style={
            {
              "--home-y": "-3px",
              "--home-rot": "-8deg",
              animation: "home-charm-bob-rot 3.5s ease-in-out 1.5s infinite",
            } as CSSProperties
          }
        >
          <TreePine className="w-4 h-4 text-green-500" strokeWidth={1.5} />
        </div>

        <div
          className="absolute bottom-1/3 -left-5 md:-left-8"
          style={
            {
              "--home-scale-max": 1.2,
              "--home-op-min": 0.4,
              "--home-op-max": 1,
              animation: "home-charm-spin-pulse 4s ease-in-out 2s infinite",
            } as CSSProperties
          }
        >
          <Snowflake className="w-3.5 h-3.5 text-blue-200" strokeWidth={1.5} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none animate-[fadeIn_0.6s_ease-out_0.7s_both]"
      aria-hidden="true"
    >
      <div
        className="absolute -top-1 left-1/4"
        style={
          {
            "--home-y": "-7px",
            animation: "home-charm-bob 3s ease-in-out 1s infinite",
          } as CSSProperties
        }
      >
        <KawaiiHeart className="w-5 h-5 text-[var(--primary)]" />
      </div>
      <div
        className="absolute top-1/5 -left-6 md:-left-10"
        style={
          {
            "--home-y": "-6px",
            "--home-rot": "10deg",
            animation: "home-charm-bob-rot 4s ease-in-out infinite",
          } as CSSProperties
        }
      >
        <KawaiiStar className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent)]" />
      </div>
      <div
        className="absolute top-1/4 -right-6 md:-right-10"
        style={
          {
            "--home-y": "-5px",
            animation: "home-charm-bob 3.5s ease-in-out 0.5s infinite",
          } as CSSProperties
        }
      >
        <KawaiiStar className="w-5 h-5 md:w-6 md:h-6 text-[var(--secondary)]" />
      </div>
      <div
        className="absolute bottom-1/4 -right-4 md:-right-8"
        style={
          {
            "--home-y": "-4px",
            animation: "home-charm-bob 3s ease-in-out 1.5s infinite",
          } as CSSProperties
        }
      >
        <KawaiiHeart className="w-4 h-4 text-[var(--secondary)]" />
      </div>
    </div>
  );
}

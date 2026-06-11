import { memo, type CSSProperties } from "react";
import {
  KawaiiStar,
  KawaiiSparkle,
  KawaiiHeart,
} from "@/shared/ui/kawaiiMotifs";

// pure-CSS `bubble-rise` (index.css) so it runs on the compositor; the
// .animate-bubble-rise rule no-ops + hides under prefers-reduced-motion

type Kind = "star" | "sparkle" | "heart";

interface FloatConfig {
  left: string;
  size: number; // px
  tint: string; // theme color token
  opacity: number;
  duration: number; // s
  delay: number; // s
  kind: Kind;
}

const ITEMS: FloatConfig[] = [
  {
    left: "7%",
    size: 22,
    tint: "var(--primary)",
    opacity: 0.5,
    duration: 18,
    delay: 0,
    kind: "star",
  },
  {
    left: "21%",
    size: 15,
    tint: "var(--accent)",
    opacity: 0.55,
    duration: 22,
    delay: 6,
    kind: "sparkle",
  },
  {
    left: "39%",
    size: 18,
    tint: "var(--secondary)",
    opacity: 0.45,
    duration: 19,
    delay: 10,
    kind: "heart",
  },
  {
    left: "61%",
    size: 13,
    tint: "var(--accent)",
    opacity: 0.55,
    duration: 24,
    delay: 3,
    kind: "sparkle",
  },
  {
    left: "79%",
    size: 24,
    tint: "var(--primary)",
    opacity: 0.45,
    duration: 16,
    delay: 12,
    kind: "star",
  },
  {
    left: "91%",
    size: 16,
    tint: "var(--secondary)",
    opacity: 0.5,
    duration: 20,
    delay: 8,
    kind: "heart",
  },
];

const MOTIF = {
  star: KawaiiStar,
  sparkle: KawaiiSparkle,
  heart: KawaiiHeart,
} as const;

export const FloatingBubbles = memo(function FloatingBubbles() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {ITEMS.map((it, i) => {
        const Motif = MOTIF[it.kind];
        return (
          <span
            key={i}
            className="animate-bubble-rise absolute bottom-[-14vh]"
            style={
              {
                left: it.left,
                width: `${it.size}px`,
                height: `${it.size}px`,
                color: it.tint,
                animationDuration: `${it.duration}s`,
                animationDelay: `${it.delay}s`,
                "--bubble-opacity": it.opacity,
              } as CSSProperties
            }
          >
            <Motif className="w-full h-full" />
          </span>
        );
      })}
    </div>
  );
});

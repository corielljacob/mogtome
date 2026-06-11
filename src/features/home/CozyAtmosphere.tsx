import { type CSSProperties } from "react";
import { Star } from "lucide-react";
import { COZY_STARS } from "@/features/home/homeData";

export function CozyAtmosphere({ eventId }: { eventId: string | null }) {
  const poolA =
    eventId === "all-saints-wake"
      ? "#a855f7"
      : eventId === "starlight"
        ? "#fbbf24"
        : "var(--primary)";
  const poolB =
    eventId === "all-saints-wake"
      ? "#f97316"
      : eventId === "starlight"
        ? "#ef4444"
        : "var(--secondary)";
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* fixed size + own GPU layer (translateZ) so a window resize never
          re-rasterizes the 60px blur - viewport-sized blurs re-blurring every
          frame was the main cause of resize jank */}
      <div
        className="absolute -top-40 -left-32 w-[48rem] h-[48rem] rounded-full blur-[60px] opacity-70 [transform:translateZ(0)]"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, ${poolA} 20%, transparent), transparent 70%)`,
        }}
      />
      {/* bottom-right pool, same static treatment */}
      <div
        className="absolute -bottom-40 -right-32 w-[44rem] h-[44rem] rounded-full blur-[55px] opacity-65 [transform:translateZ(0)]"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, ${poolB} 18%, transparent), transparent 70%)`,
        }}
      />
      {COZY_STARS.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={
            {
              left: s.left,
              top: s.top,
              "--home-drift": `${s.drift}px`,
              "--home-spin": `${s.spin}deg`,
              "--home-op": s.op,
              animation: `home-cozy-star ${s.dur}s ease-in-out ${s.delay}s infinite`,
            } as CSSProperties
          }
        >
          <Star
            style={{ width: s.size, height: s.size, color: "var(--accent)" }}
            strokeWidth={1.25}
          />
        </div>
      ))}
    </div>
  );
}

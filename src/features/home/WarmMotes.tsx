import { type CSSProperties } from "react";
import { IS_MOBILE } from "@/shared/lib/motionConfig";
import { DEFAULT_WARM_MOTES } from "@/features/home/homeData";

export function WarmMotes({ motes }: { motes: typeof DEFAULT_WARM_MOTES }) {
  // skip on mobile - drops animated glow overhead
  if (IS_MOBILE) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] pointer-events-none"
      aria-hidden="true"
    >
      {motes.map((mote, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={
            {
              left: mote.left,
              bottom: -4,
              width: mote.size,
              height: mote.size,
              backgroundColor: mote.color,
              opacity: 0,
              "--home-y": `${-220 - i * 25}px`,
              "--home-drift": `${mote.drift}px`,
              animation: `home-warm-mote ${mote.duration}s ease-out ${mote.delay}s infinite`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

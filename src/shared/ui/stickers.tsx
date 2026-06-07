import { memo, type ReactNode } from "react";

// Kawaii scrapbook stickers for page-header banners. Each is absolutely
// positioned (the caller supplies the position + tilt + size via className) and
// purely decorative, so they live inside a header's `stickers` slot.

interface BaseProps {
  /** position / tilt / size utilities, e.g. "left-[4%] top-1/2 -rotate-6 h-12 w-12" */
  className?: string;
  /** accent colour (defaults to --primary) */
  color?: string;
}

// a die-cut chip: chunky white outline + soft drop shadow, holds a motif.
export const Sticker = memo(function Sticker({
  className = "",
  color = "var(--primary)",
  children,
}: BaseProps & { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none absolute inline-flex items-center justify-center rounded-2xl border-[3px] border-white shadow-[0_5px_12px_-4px_rgba(0,0,0,0.3)] ${className}`}
      style={{ background: color }}
    >
      {children}
    </span>
  );
});

// a soft, translucent strip of washi tape.
export const TapeStrip = memo(function TapeStrip({
  className = "",
  color = "var(--secondary)",
}: BaseProps) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-6 w-20 rounded-[2px] ${className}`}
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${color} 44%, transparent), color-mix(in srgb, ${color} 24%, transparent))`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      }}
    />
  );
});

// a little speech-bubble sticker with a tail; children is the (short) text.
export const BubbleSticker = memo(function BubbleSticker({
  className = "",
  color = "var(--primary)",
  children,
}: BaseProps & { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none absolute ${className}`}
    >
      <span className="relative inline-block rounded-2xl border-[3px] border-white bg-[var(--card)] px-3 py-1 shadow-[0_4px_10px_-3px_rgba(0,0,0,0.25)]">
        <span
          className="font-accent text-xl leading-none whitespace-nowrap"
          style={{ color }}
        >
          {children}
        </span>
        <span className="absolute -bottom-[7px] left-5 h-3 w-3 rotate-45 border-b-[3px] border-r-[3px] border-white bg-[var(--card)]" />
      </span>
    </span>
  );
});

// a die-cut circular moogle photo sticker; size comes from the caller (h-/w-).
export const MoogleSticker = memo(function MoogleSticker({
  src,
  className = "",
  ring = "var(--secondary)",
}: {
  src: string;
  className?: string;
  /** tint behind the cut-out (defaults to --secondary) */
  ring?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none absolute block ${className}`}
    >
      <span
        className="block h-full w-full rounded-full border-[3px] border-white p-1 shadow-[0_5px_12px_-4px_rgba(0,0,0,0.3)]"
        style={{ background: `color-mix(in srgb, ${ring} 22%, var(--card))` }}
      >
        <img
          src={src}
          alt=""
          className="h-full w-full object-contain animate-[float-gentle_4s_ease-in-out_infinite]"
        />
      </span>
    </span>
  );
});

// a tiny confetti dot; size comes from the caller (h-/w-).
export const Dot = memo(function Dot({
  className = "",
  color = "var(--primary)",
}: BaseProps) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{ background: color }}
    />
  );
});

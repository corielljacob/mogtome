import { memo, useState, useEffect, useRef } from "react";
import { LogoIcon } from "@/shared/ui/LogoIcon";
import { KawaiiStar, KawaiiHeart } from "@/shared/ui/kawaiiMotifs";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";

// poke-me easter egg, not a nav link - Home already has its own tab
const KUPO_LINES = [
  "Kupo!",
  "Kupopo~",
  "Mog mog!",
  "Pom-pom!",
  "Hi hi, kupo!",
  "Eee~ kupo!",
];
const KUPO_BURST = [
  { x: -18, y: -22, kind: "heart" as const },
  { x: 18, y: -20, kind: "star" as const },
  { x: -22, y: 4, kind: "star" as const },
  { x: 22, y: 2, kind: "heart" as const },
  { x: 0, y: -28, kind: "star" as const },
];

export const MoogleLogoButton = memo(function MoogleLogoButton() {
  const reduceMotion = useReducedMotion();
  const [pokes, setPokes] = useState(0);
  const [say, setSay] = useState<string | null>(null);
  const sayTimer = useRef<number | undefined>(undefined);

  const poke = () => {
    setPokes((n) => n + 1);
    setSay(KUPO_LINES[Math.floor(Math.random() * KUPO_LINES.length)]);
    if (sayTimer.current) window.clearTimeout(sayTimer.current);
    sayTimer.current = window.setTimeout(() => setSay(null), 1400);
  };

  useEffect(
    () => () => {
      if (sayTimer.current) window.clearTimeout(sayTimer.current);
    },
    [],
  );

  return (
    <div className="relative mb-1">
      {say && (
        <span
          key={pokes}
          className="absolute left-full top-1.5 ml-2 z-50 whitespace-nowrap rounded-full border border-[color:color-mix(in_srgb,var(--primary)_30%,var(--card))] bg-[var(--card)] px-2.5 py-1 text-xs font-display font-bold text-[var(--primary)] shadow-[0_3px_8px_-3px_var(--shadow)] pointer-events-none animate-[popIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)]"
        >
          {say}
        </span>
      )}

      <button
        type="button"
        onClick={poke}
        aria-label="Poke the moogle, kupo!"
        className="group relative flex items-center justify-center w-12 h-12 rounded-r-2xl -translate-x-1.5 hover:translate-x-0 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        style={{
          background: "var(--card)",
          boxShadow:
            "0 0 0 3px var(--card), 2px 3px 0 0 color-mix(in srgb, var(--primary) 26%, transparent)",
        }}
      >
        {!reduceMotion && pokes > 0 && (
          <span
            key={pokes}
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            {KUPO_BURST.map((b, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 animate-[popIn_0.75s_ease-out_forwards]"
                style={{ marginLeft: b.x - 6, marginTop: b.y - 6 }}
              >
                {b.kind === "heart" ? (
                  <KawaiiHeart className="w-3 h-3 text-[var(--primary)]" />
                ) : (
                  <KawaiiStar className="w-3 h-3 text-[var(--accent)]" />
                )}
              </span>
            ))}
          </span>
        )}

        <span
          key={pokes}
          className={`relative ${
            reduceMotion || pokes === 0
              ? ""
              : "animate-[wiggle_0.55s_ease-in-out]"
          }`}
        >
          <LogoIcon hovered={false} />
        </span>
      </button>
    </div>
  );
});

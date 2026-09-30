import { useId } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";

const n = (value: number) => value.toFixed(2);

// Fine satin threads drift gently through the color wash. Their long, uneven
// entries avoid a visible grid and stay quiet behind the celestial details.
function threadHeight(x: number, y: number) {
  return (
    y +
    (x - 200) * (-0.08 + Math.sin(y / 90) * 0.035) +
    Math.sin((x - 60) / 110 + y / 160) * 2.5
  );
}

const skyStitches = (() => {
  const bundles: string[][] = [[], [], []];
  for (let row = 0; row < 174; row++) {
    const phase = threadVariation(row, 77) * 14;
    for (let column = 0; column < 13; column++) {
      const stitch = row * 13 + column;
      const x = 27 + column * 29 + phase + threadVariation(stitch, 71) * 1.7;
      const y = 8 + row * 2.65 + threadVariation(stitch, 72) * 0.3;
      const length = 25.5 + threadVariation(stitch, 73) * 3.2;
      const end = x + length;
      const entry = threadHeight(x, y);
      const exit = threadHeight(end, y) + threadVariation(stitch, 74) * 0.38;
      const tension = threadVariation(stitch, 75) * 0.3;
      const tone = Math.min(
        2,
        Math.floor((threadVariation(stitch, 76) + 1) * 1.5),
      );
      bundles[tone].push(
        `M${n(x)} ${n(entry)}Q${n(x + length * 0.48)} ${n((entry + exit) / 2 - 0.35 + tension)} ${n(end)} ${n(exit)}`,
      );
    }
  }
  return bundles.map((bundle) => bundle.join(" "));
})();

const skyColors = [
  [0, "var(--scene-sky)"],
  [0.48, "var(--scene-sky-mid)"],
  [0.72, "var(--scene-horizon)"],
  [1, "var(--scene-horizon)"],
] as const;
const duskColors = [
  [0, "#777598"],
  [0.29, "#bd8d97"],
  [0.5, "#e9af87"],
  [0.66, "#f6ce9a"],
  [1, "#c4a69b"],
] as const;

// Nearly matching shades keep the sheen visible only as a fine fabric grain.
const floss = [
  { name: "cool", amount: 98, tint: "#222641" },
  { name: "base", amount: 99, tint: "#ece0cc" },
  { name: "light", amount: 98, tint: "#ece0cc" },
  { name: "shadow", amount: 87, tint: "#172033" },
  { name: "fiber", amount: 89, tint: "#f0e8d6" },
];

/** A soft color wash and fine silk grain, shared by every lighting state. */
export function NookSkyEmbroidery({ dusk = false }: { dusk?: boolean }) {
  const id = useId().replace(/:/g, "");
  const colors = dusk ? duskColors : skyColors;
  const paint = (name: string) => `url(#${id}-sky-${name})`;

  return (
    <svg
      className="nook-sky-embroidery"
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {floss.map(({ name, amount, tint }) => (
          <linearGradient
            key={name}
            id={`${id}-sky-${name}`}
            gradientUnits="userSpaceOnUse"
            x1="70"
            y1="58"
            x2="70"
            y2="431"
          >
            {colors.map(([offset, color]) => (
              <stop
                key={offset}
                offset={offset}
                stopColor={`color-mix(in srgb, ${color} ${amount}%, ${tint})`}
              />
            ))}
          </linearGradient>
        ))}
        <radialGradient
          id={`${id}-sky-haze`}
          gradientUnits="userSpaceOnUse"
          cx="244"
          cy="168"
          r="180"
        >
          <stop stopColor="#c3b9df" stopOpacity=".065" />
          <stop offset=".55" stopColor="#b0b8d5" stopOpacity=".025" />
          <stop offset="1" stopColor="#b0b8d5" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M70 58H332V431H70Z" fill={paint("base")} />
      {skyStitches.map((d, tone) => (
        <NookThread
          key={tone}
          d={d}
          color={paint(floss[tone].name)}
          shadow={paint("shadow")}
          highlight={paint("fiber")}
          width={1.35 + tone * 0.06}
          relief={0.32}
          opacity={0.58}
        />
      ))}
      <path d="M70 58H332V431H70Z" fill={paint("haze")} />
    </svg>
  );
}

import { useId } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";

const n = (value: number) => value.toFixed(2);

// Broad sewing passes change direction gradually across the blue cloth.
function courseHeight(x: number, y: number) {
  return (
    y +
    Math.sin((x - 50) / 87 + y / 77) * 5.2 +
    (x - 200) * Math.sin(y / 91) * 0.055
  );
}

const skyNeedlework = (() => {
  const bundles: string[][] = [[], [], []];
  const entries: string[] = [];
  for (let row = 0; row < 128; row++) {
    let x = 36 + threadVariation(row, 211) * 18;
    const y = 39 + row * 3.25;
    let column = 0;
    while (x < 346) {
      const index = row * 24 + column;
      const length = 20 + threadVariation(index, 212) * 7;
      const startY = courseHeight(x, y) + threadVariation(index, 213) * 0.55;
      const endY =
        courseHeight(x + length, y) + threadVariation(index, 214) * 0.45;
      const middleY =
        courseHeight(x + length * 0.49, y) -
        0.55 +
        threadVariation(index, 215) * 0.4;
      const tone = Math.min(
        2,
        Math.floor((threadVariation(index, 216) + 1) * 1.5),
      );
      bundles[tone].push(
        `M${n(x)} ${n(startY)}Q${n(x + length * 0.49)} ${n(middleY)} ${n(x + length)} ${n(endY)}`,
      );
      // Occasional tiny entry shadows are irregularly spaced, like needle holes.
      if (threadVariation(index, 217) > 0.25) {
        entries.push(`M${n(x - 0.15)} ${n(startY + 0.5)}l.25 .18`);
      }
      x += length + 1.6 + threadVariation(index, 218) * 0.7;
      column++;
    }
  }
  return {
    bundles: bundles.map((bundle) => bundle.join(" ")),
    entries: entries.join(" "),
  };
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
const floss = [
  { name: "cool", amount: 91, tint: "#41657d", duskTint: "#76516e" },
  { name: "base", amount: 95, tint: "#c4d4d8", duskTint: "#d7bea9" },
  { name: "light", amount: 88, tint: "#d7e2dd", duskTint: "#f1d7b6" },
  { name: "shadow", amount: 78, tint: "#14283e", duskTint: "#362d43" },
  { name: "fiber", amount: 71, tint: "#ebeee1", duskTint: "#f4e8cb" },
];

/** Fixed day, night, and dusk exposures share the same hand-laid satin courses. */
export function NookHeavenswardSkyEmbroidery({
  dusk = false,
}: {
  dusk?: boolean;
}) {
  const id = `${useId().replace(/:/g, "")}-heavensward-sky`;
  const colors = dusk ? duskColors : skyColors;
  const paint = (name: string) => `url(#${id}-${name})`;

  return (
    <svg
      className="nook-sky-embroidery"
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {floss.map(({ name, amount, tint, duskTint }) => (
          <linearGradient
            key={name}
            id={`${id}-${name}`}
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
                stopColor={`color-mix(in srgb, ${color} ${amount}%, ${dusk ? duskTint : tint})`}
              />
            ))}
          </linearGradient>
        ))}
      </defs>
      <path d="M70 58H332V431H70Z" fill={paint("base")} />
      {skyNeedlework.bundles.map((d, tone) => (
        <NookThread
          key={tone}
          d={d}
          color={paint(floss[tone].name)}
          shadow={paint("shadow")}
          highlight={paint("fiber")}
          width={1.78 + tone * 0.1}
          relief={1.2}
          opacity={0.83}
        />
      ))}
      <path
        d={skyNeedlework.entries}
        stroke={paint("shadow")}
        strokeWidth="0.65"
        strokeLinecap="round"
        opacity=".36"
      />
    </svg>
  );
}

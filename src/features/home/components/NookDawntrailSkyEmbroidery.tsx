import { useId } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";

const n = (value: number) => value.toFixed(2);
const courseHeight = (x: number, y: number) =>
  y +
  Math.sin((x - 45) / 105 + y / 94) * 3.1 +
  (x - 195) * Math.sin(y / 121) * 0.025;

// Broad, staggered satin courses open into the warm Turali horizon. Small
// changes in tension keep the fabric quiet, with no tiny chopped stitch noise.
const courses = (() => {
  const tones: string[][] = [[], [], []];
  const entries: string[] = [];
  for (let row = 0; row < 134; row++) {
    const y = 40 + row * 3.05;
    let x = 39 + threadVariation(row, 910) * 18;
    for (let column = 0; x < 350; column++) {
      const index = row * 24 + column;
      const length = 21 + threadVariation(index, 911) * 5.8;
      const start = courseHeight(x, y) + threadVariation(index, 912) * 0.35;
      const end =
        courseHeight(x + length, y) + threadVariation(index, 913) * 0.3;
      const middle =
        courseHeight(x + length * 0.48, y) -
        0.55 +
        threadVariation(index, 914) * 0.2;
      const tone = Math.min(
        2,
        Math.floor((threadVariation(index, 915) + 1) * 1.5),
      );
      tones[tone].push(
        `M${n(x)} ${n(start)}Q${n(x + length * 0.48)} ${n(middle)} ${n(x + length)} ${n(end)}`,
      );
      if (threadVariation(index, 916) > 0.48)
        entries.push(`M${n(x - 0.1)} ${n(start + 0.45)}l.23 .14`);
      x += length + 1.45 + threadVariation(index, 917) * 0.45;
    }
  }
  return {
    tones: tones.map((paths) => paths.join(" ")),
    entries: entries.join(" "),
  };
})();
const sky = [
  [0, "var(--scene-sky)"],
  [0.42, "var(--scene-sky-mid)"],
  [0.76, "var(--scene-horizon)"],
  [1, "var(--scene-horizon)"],
] as const;
const duskSky = [
  [0, "#54838b"],
  [0.33, "#bc9d99"],
  [0.62, "#edaf87"],
  [1, "#f2cf9e"],
] as const;
const floss = [
  ["cool", "#76a6b0", 92],
  ["base", "#e9d7b0", 95],
  ["warm", "#c9d6bd", 92],
  ["shadow", "#294956", 76],
  ["fiber", "#f6ead1", 80],
] as const;

export function NookDawntrailSkyEmbroidery({
  dusk = false,
}: {
  dusk?: boolean;
}) {
  const id = `${useId().replace(/:/g, "")}-turali-sky`;
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
        {floss.map(([name, tint, amount]) => (
          <linearGradient
            key={name}
            id={`${id}-${name}`}
            gradientUnits="userSpaceOnUse"
            x1="70"
            y1="58"
            x2="70"
            y2="431"
          >
            {(dusk ? duskSky : sky).map(([offset, color]) => (
              <stop
                key={offset}
                offset={offset}
                stopColor={`color-mix(in srgb, ${color} ${amount}%, ${tint})`}
              />
            ))}
          </linearGradient>
        ))}
      </defs>
      <path d="M70 58H332V431H70Z" fill={paint("base")} />
      {courses.tones.map((d, i) => (
        <NookThread
          key={i}
          d={d}
          color={paint(floss[i][0])}
          shadow={paint("shadow")}
          highlight={paint("fiber")}
          width={2.02 + i * 0.07}
          relief={1.4}
          opacity={0.86}
        />
      ))}
      <path
        d={courses.entries}
        stroke={paint("shadow")}
        strokeWidth=".58"
        strokeLinecap="round"
        opacity=".29"
      />
    </svg>
  );
}

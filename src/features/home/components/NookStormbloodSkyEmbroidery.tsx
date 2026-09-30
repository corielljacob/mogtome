import { useId } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";

const n = (value: number) => value.toFixed(2);

// The warm wind turns the floss gently across the cloth. Each stitch follows
// that shared flow, with a little uneven tension where the needle enters.
function courseHeight(x: number, y: number) {
  return y + Math.sin(x / 96 + y / 127) * 4 - (x - 190) * 0.07;
}

const skyNeedlework = (() => {
  const tones: string[][] = [[], [], []];
  const entries: string[] = [];
  for (let row = 0; row < 126; row++) {
    const y = 43 + row * 3.2 + threadVariation(row, 600) * 0.2;
    let x = 39 + threadVariation(row, 601) * 23;
    for (let column = 0; x < 351; column++) {
      const i = row * 24 + column;
      const length = 19 + threadVariation(i, 602) * 6.5;
      const start = courseHeight(x, y) + threadVariation(i, 603) * 0.4;
      const end = courseHeight(x + length, y) + threadVariation(i, 604) * 0.4;
      const middle =
        courseHeight(x + length * 0.48, y) -
        0.7 +
        threadVariation(i, 605) * 0.4;
      const tone = Math.min(2, Math.floor((threadVariation(i, 606) + 1) * 1.5));
      tones[tone].push(
        `M${n(x)} ${n(start)}Q${n(x + length * 0.48)} ${n(middle)} ${n(x + length)} ${n(end)}`,
      );
      if (threadVariation(i, 607) > 0.25) {
        entries.push(`M${n(x - 0.12)} ${n(start + 0.48)}l.23 .16`);
      }
      x += length + 1.45 + threadVariation(i, 608) * 0.65;
    }
  }
  return {
    courses: tones.map((paths) => paths.join(" ")),
    entries: entries.join(" "),
  };
})();
const sky = [
  [0, "var(--scene-sky)"],
  [0.48, "var(--scene-sky-mid)"],
  [0.76, "var(--scene-horizon)"],
  [1, "var(--scene-horizon)"],
] as const;
const sunset = [
  [0, "#736880"],
  [0.32, "#bd7c7b"],
  [0.62, "#e8a775"],
  [1, "#e8c595"],
] as const;
const threads = [
  ["clay", "#b98b77", 90],
  ["linen", "#e2c6a1", 93],
  ["sunlit", "#fae3b7", 88],
  ["shadow", "#473e50", 74],
  ["fiber", "#f4dfbd", 69],
] as const;

export function NookStormbloodSkyEmbroidery({
  dusk = false,
}: {
  dusk?: boolean;
}) {
  const id = `${useId().replace(/:/g, "")}-gyr-abania-sky`;
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
        {threads.map(([name, tint, amount]) => (
          <linearGradient
            key={name}
            id={`${id}-${name}`}
            gradientUnits="userSpaceOnUse"
            x1="70"
            y1="58"
            x2="70"
            y2="431"
          >
            {(dusk ? sunset : sky).map(([offset, color]) => (
              <stop
                key={offset}
                offset={offset}
                stopColor={`color-mix(in srgb, ${color} ${amount}%, ${tint})`}
              />
            ))}
          </linearGradient>
        ))}
      </defs>
      <path d="M70 58H332V431H70Z" fill={paint("linen")} />
      {skyNeedlework.courses.map((d, tone) => (
        <NookThread
          key={tone}
          d={d}
          color={paint(threads[tone][0])}
          shadow={paint("shadow")}
          highlight={paint("fiber")}
          width={1.94 + tone * 0.08}
          relief={1.38}
          opacity={0.9}
        />
      ))}
      <path
        d={skyNeedlework.entries}
        stroke={paint("shadow")}
        strokeWidth=".58"
        strokeLinecap="round"
        opacity=".32"
      />
    </svg>
  );
}

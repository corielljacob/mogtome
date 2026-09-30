import { useId } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";

// Long, slightly tilted sewing passes follow the warm wind above Gyr Abania.
// Staggered ends keep the cloth from becoming a repeated screen-door pattern.
const courses = (() => {
  const tones: string[][] = [[], [], []];
  for (let row = 0; row < 126; row++) {
    const y = 43 + row * 3.2;
    let x = 45 + threadVariation(row, 601) * 20;
    for (let column = 0; x < 351; column++) {
      const i = row * 24 + column;
      const length = 19 + threadVariation(i, 602) * 6;
      const height = y + Math.sin(x / 96 + y / 127) * 4 - (x - 190) * 0.07;
      const bend = -0.65 + threadVariation(i, 603) * 0.35;
      tones[(row + column) % 3].push(
        `M${x.toFixed(2)} ${height.toFixed(2)}q${(length / 2).toFixed(2)} ${bend.toFixed(2)} ${length.toFixed(2)} ${(-length * 0.055).toFixed(2)}`,
      );
      x += length + 1.1 + threadVariation(i, 604) * 0.45;
    }
  }
  return tones.map((paths) => paths.join(" "));
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
  ["clay", "#b98b77", 92],
  ["linen", "#e2c6a1", 94],
  ["sunlit", "#fae3b7", 89],
  ["shadow", "#473e50", 80],
  ["fiber", "#f4dfbd", 76],
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
      {courses.map((d, tone) => (
        <NookThread
          key={tone}
          d={d}
          color={paint(threads[tone][0])}
          shadow={paint("shadow")}
          highlight={paint("fiber")}
          width={1.9}
          relief={1.1}
          opacity={0.83}
        />
      ))}
    </svg>
  );
}

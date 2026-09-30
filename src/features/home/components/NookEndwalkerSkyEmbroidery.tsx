import { useId } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";

// Long-and-short rows bend gently across space. Each pass has its own
// staggered ends, leaving a soft cloth field behind the architectural relief.
const courses = (() => {
  const tones: string[][] = [[], [], []];
  for (let row = 0; row < 125; row++) {
    const y = 42 + row * 3.3;
    let x = 43 + threadVariation(row, 810) * 16;
    for (let column = 0; x < 351; column++) {
      const i = row * 24 + column;
      const length = 18 + threadVariation(i, 811) * 7;
      const height = y + Math.sin(x / 117 + row / 29) * 3.3;
      tones[(row + column) % 3].push(
        `M${x.toFixed(2)} ${height.toFixed(2)}q${(length / 2).toFixed(2)} -.8 ${length.toFixed(2)} -.2`,
      );
      x += length + 1.3 + threadVariation(i, 812) * 0.5;
    }
  }
  return tones.map((paths) => paths.join(" "));
})();

const sky = [
  [0, "#121a30"],
  [0.48, "#222d49"],
  [0.76, "#343d59"],
  [1, "#343d59"],
] as const;
const threads = [
  ["blue", "#8ca9b5", 95],
  ["pearl", "#e4e5dd", 94],
  ["silver", "#b6c9d0", 92],
  ["shadow", "#324b61", 82],
  ["fiber", "#e8ece6", 80],
] as const;

export function NookEndwalkerSkyEmbroidery() {
  const id = `${useId().replace(/:/g, "")}-lunar-cloth`;
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
            {sky.map(([offset, color]) => (
              <stop
                key={offset}
                offset={offset}
                stopColor={`color-mix(in srgb, ${color} ${amount}%, ${tint})`}
              />
            ))}
          </linearGradient>
        ))}
      </defs>
      <path d="M70 58H332V431H70Z" fill={paint("pearl")} />
      {courses.map((d, tone) => (
        <NookThread
          key={tone}
          d={d}
          color={paint(threads[tone][0])}
          shadow={paint("shadow")}
          highlight={paint("fiber")}
          width={1.95}
          relief={1.05}
          opacity={0.8}
        />
      ))}
    </svg>
  );
}

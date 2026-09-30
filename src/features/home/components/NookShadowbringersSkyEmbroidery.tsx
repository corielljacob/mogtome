import { useId } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";

// The cloth bends in broad, shallow waves: pearl Light becomes the same sewn
// heavens at night, rather than being replaced with a different background.
const skyCourses = (() => {
  const bundles: string[][] = [[], [], []];
  for (let row = 0; row < 127; row++) {
    const y = 41 + row * 3.18;
    let x = 38 + threadVariation(row, 731) * 20;
    for (let column = 0; x < 351; column++) {
      const i = row * 24 + column;
      const length = 20 + threadVariation(i, 732) * 6.5;
      const start = y + Math.sin(x / 71 + y / 104) * 3.9;
      const end = y + Math.sin((x + length) / 71 + y / 104) * 3.9;
      bundles[(row + column * 2) % 3].push(
        `M${x.toFixed(2)} ${start.toFixed(2)}Q${(x + length * 0.48).toFixed(2)} ${((start + end) / 2 - 0.7).toFixed(2)} ${(x + length).toFixed(2)} ${end.toFixed(2)}`,
      );
      x += length + 1.35 + threadVariation(i, 733) * 0.5;
    }
  }
  return bundles.map((bundle) => bundle.join(" "));
})();

const stars = Array.from({ length: 58 }, (_, i) => ({
  x: 77 + ((i * 67.7) % 250) + threadVariation(i, 741) * 3,
  y: 65 + ((i * 43.3) % 228) + threadVariation(i, 742) * 4,
  size: i % 11 === 0 ? 1.6 : 0.48 + (threadVariation(i, 743) + 1) * 0.22,
}));
const colors = [
  [0, "var(--scene-sky)"],
  [0.44, "var(--scene-sky-mid)"],
  [0.74, "var(--scene-horizon)"],
  [1, "var(--scene-horizon)"],
] as const;
const duskColors = [
  [0, "#696487"],
  [0.32, "#ada0b3"],
  [0.61, "#d2bfba"],
  [1, "#e5d4bd"],
] as const;
const floss = [
  ["pearl", "#e9dfd7", 94],
  ["lilac", "#b9a5c6", 91],
  ["silver", "#cbdcdf", 92],
  ["shadow", "#40364f", 83],
  ["fiber", "#f6ebd7", 76],
] as const;
const lightRibbons = Array.from({ length: 7 }, (_, i) => {
  const y = 84 + i * 3.1;
  return `M57 ${y}Q106 ${y - 12} 156 ${y + 1}T265 ${y - 2}T354 ${y - 12}M47 ${y + 74}Q97 ${y + 58} 147 ${y + 66}T249 ${y + 57}T356 ${y + 58}`;
}).join(" ");

export function NookShadowbringersSkyEmbroidery({
  dusk = false,
}: {
  dusk?: boolean;
}) {
  const id = `${useId().replace(/:/g, "")}-norvrandt-sky`;
  const paint = (name: string) => `url(#${id}-${name})`;
  return (
    <svg
      className="nook-sky-embroidery nook-shb-sky-embroidery"
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
            {(dusk ? duskColors : colors).map(([offset, color]) => (
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
      {skyCourses.map((d, tone) => (
        <NookThread
          key={tone}
          d={d}
          color={paint(floss[tone][0])}
          shadow={paint("shadow")}
          highlight={paint("fiber")}
          width={1.85}
          relief={1.12}
          opacity={0.82}
        />
      ))}
      <g className="nook-shb-light-ribbons">
        <NookThread
          d={lightRibbons}
          color={paint("fiber")}
          shadow={paint("lilac")}
          highlight="#fff6df"
          width={2.05}
          relief={0.7}
          opacity={0.52}
        />
      </g>
      {!dusk && (
        <g className="nook-shb-restored-stars">
          {stars.map(({ x, y, size }, i) => (
            <g
              key={i}
              transform={`translate(${x} ${y})`}
              opacity={i % 3 === 0 ? 0.9 : 0.66}
            >
              {size > 1 ? (
                <NookThread
                  d={`M0 ${-size}V${size}M${-size} 0H${size}`}
                  color="#e2d5b6"
                  shadow="#4b4264"
                  highlight="#fff6dc"
                  width={0.75}
                  relief={0.7}
                />
              ) : (
                <>
                  <path
                    d={`M${-size} 0q0 ${-size * 1.5} ${size} ${-size}t${size} ${size}q0 ${size} ${-size} ${size}T${-size} 0`}
                    fill="#d6d1d7"
                    stroke="#8c91b3"
                    strokeWidth=".3"
                  />
                  <path
                    d={`M${-size * 0.4} ${-size * 0.45}h${size * 0.65}`}
                    stroke="#fff2ce"
                    strokeWidth=".35"
                  />
                </>
              )}
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

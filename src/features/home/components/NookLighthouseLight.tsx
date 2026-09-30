import { useId } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";

// Thread painting: short, overlapping silk stitches share a soft fan shape.
// Entries drift between rows, so the light has no ruled rays or dashed lanes.
const beamStitches = (() => {
  const batches: string[][][] = Array.from({ length: 8 }, () => [[], []]);
  for (let row = 0; row < 31; row++) {
    const across = (row - 15) / 15;
    const edge = Math.abs(across);
    const edgeBand = Math.min(7, Math.floor(edge ** 2.5 * 7.9));
    const reach = 70 - edge ** 1.7 * 14 + threadVariation(row, 111) * 5;
    let start = 1.5 + edge * 3 + (threadVariation(row, 112) + 1) * 3;
    let stitch = 0;
    while (start < reach) {
      const index = row * 24 + stitch;
      const length = 11 + (threadVariation(index, 113) + 1) * 3.5;
      const end = Math.min(reach, start + length);
      const distance = (start + end) / 2;
      const tone = threadVariation(index, 114) > 0 ? 1 : 0;
      const center = (at: number) => -Math.sin(at / 43) * 0.75;
      const spread = (at: number) => 2.3 + at * 0.092;
      const y1 =
        center(start) +
        across * spread(start) +
        threadVariation(index, 115) * 0.15;
      const y2 =
        center(end) + across * spread(end) + threadVariation(index, 116) * 0.15;
      if (end - start > 2) {
        batches[edgeBand][tone].push(
          `M${(-start).toFixed(2)} ${y1.toFixed(2)}Q${(-distance).toFixed(2)} ${((y1 + y2) / 2 + threadVariation(index, 118) * 0.1).toFixed(2)} ${(-end).toFixed(2)} ${y2.toFixed(2)}`,
        );
      }
      // Slight overlaps hide row endings; the last stitches trail off unevenly.
      if (end >= reach) break;
      start = end - 0.8 + threadVariation(index, 119) * 1.25;
      stitch++;
    }
  }
  return batches.map((shades) => shades.map((stitches) => stitches.join(" ")));
})();

/** Pale silk light, sewn from the lantern into the surrounding sky. */
export function NookLighthouseLight({ isDark }: { isDark: boolean }) {
  const id = useId().replace(/:/g, "");
  if (!isDark) return null;

  return (
    <g
      pointerEvents="none"
      fill="none"
      transform="translate(245 198) rotate(24)"
      opacity={0.5}
    >
      <defs>
        <radialGradient
          id={`${id}-silk-fade`}
          gradientUnits="userSpaceOnUse"
          cx="0"
          cy="0"
          r="84"
          gradientTransform="scale(1 .15)"
        >
          <stop stopColor="white" />
          <stop offset=".18" stopColor="white" stopOpacity=".94" />
          <stop offset=".46" stopColor="white" stopOpacity=".6" />
          <stop offset=".72" stopColor="white" stopOpacity=".2" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask
          id={`${id}-silk-mask`}
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
          x="-90"
          y="-22"
          width="102"
          height="44"
        >
          <rect
            x="-90"
            y="-22"
            width="102"
            height="44"
            fill={`url(#${id}-silk-fade)`}
          />
        </mask>
      </defs>
      {/* The fade only controls visibility; every visible mark is a stitch. */}
      <g mask={`url(#${id}-silk-mask)`}>
        {beamStitches.map((shades, edge) => (
          <g
            key={edge}
            opacity={[1, 0.93, 0.82, 0.68, 0.5, 0.33, 0.17, 0.05][edge]}
          >
            {shades.map((d, tone) => (
              <NookThread
                key={tone}
                d={d}
                color={tone ? "#e5cfa3" : "#efddb7"}
                shadow="#cfb887"
                highlight="#f6e7c4"
                width={tone ? 0.39 : 0.44}
                relief={0.3}
              />
            ))}
          </g>
        ))}
      </g>
    </g>
  );
}

import { useId } from "react";
import { NookThread } from "./NookThread";
import type { EvercoldBounds } from "./NookEvercoldPatch";
import type { EvercoldPigments } from "./nookEvercoldPigments";
import { threadVariation } from "./nookNeedlework";

const n = (value: number) => value.toFixed(2);
const mix = (a: string, b: string, amount: number) =>
  `color-mix(in srgb, ${a} ${amount}%, ${b})`;

// Broad, uneven cushions overlap at their feet. Their edges are not a repeated
// scalloped border, and their cotton bends around the individual padded form.
const shapes = [
  "M-26 3Q-31-4-23-10Q-23-19-11-17Q-4-25 6-19Q17-23 22-14Q31-13 29-4Q35 4 26 9Q22 19 11 15Q4 23-6 17Q-18 23-21 14Q-32 13-26 3Z",
  "M-28 6Q-34-3-24-8Q-28-17-15-16Q-11-24 0-18Q10-25 19-15Q30-18 28-7Q36 0 27 8Q28 18 16 15Q7 24-2 18Q-14 24-18 16Q-29 18-28 6Z",
  "M-27 3Q-34-6-23-12Q-18-21-8-17Q1-25 10-17Q23-21 25-10Q35-7 29 2Q34 13 22 14Q13 24 3 17Q-6 23-13 17Q-25 21-25 11Q-34 10-27 3Z",
] as const;

const clumpSilk = shapes.map((_, shape) => {
  const tones: string[][] = [[], [], []];
  // Short curved tufts turn outward from this cushion's foot. Their irregular
  // packing avoids both a repeated chevron tile and long corduroy channels.
  for (let stitch = 0; stitch < 330; stitch++) {
    const turn = stitch * 2.39996 + shape * 0.83;
    const radius = Math.sqrt((stitch + 0.5) / 330);
    const sx =
      Math.cos(turn) * radius * 36 +
      threadVariation(stitch, 1971 + shape) * 0.75;
    const sy =
      Math.sin(turn) * radius * 29 +
      threadVariation(stitch, 1975 + shape) * 0.65;
    const bearing =
      Math.atan2(sy - 28, sx * 0.87) +
      threadVariation(stitch, 1978 + shape) * 0.22;
    const length = 3.3 + threadVariation(stitch, 1981 + shape) * 0.8;
    const dx = Math.cos(bearing) * length;
    const dy = Math.sin(bearing) * length;
    const bow = 0.62 + threadVariation(stitch, 1984 + shape) * 0.23;
    const tone = Math.min(
      2,
      Math.floor((threadVariation(stitch, 1987 + shape) + 1) * 1.5),
    );
    tones[tone].push(
      `M${n(sx)} ${n(sy)}Q${n(sx + dx * 0.46 - Math.sin(bearing) * bow)} ${n(sy + dy * 0.46 + Math.cos(bearing) * bow)} ${n(sx + dx)} ${n(sy + dy)}`,
    );
  }
  return tones.map((paths) => paths.join(" "));
});

// Each arrangement is deliberately sparse at the water's edge. Sizes are
// relative to the supplied bank so foreground patches keep a larger stitch.
const bankClumps = [
  [-0.04, 0.12, 0.92, -8],
  [0.44, 0.14, 1.08, 5],
  [0.91, 0.1, 0.9, -5],
  [0.15, 0.37, 1.04, 8],
  [0.68, 0.36, 1.1, -7],
  [-0.04, 0.62, 1, -5],
  [0.44, 0.62, 1.15, 6],
  [0.98, 0.63, 0.95, -8],
  [0.15, 0.89, 1.06, 5],
  [0.7, 0.91, 1.12, -4],
] as const;
const foregroundClumps = [
  [0.02, 0.16, 1.1, -8],
  [0.61, 0.1, 0.95, 6],
  [0.32, 0.47, 1.1, 3],
  [0.92, 0.6, 0.98, -7],
  [0.08, 0.85, 1.04, -4],
  [0.64, 0.97, 1.07, 7],
] as const;

function MossClump({
  variant,
  p,
  foreground,
}: {
  variant: number;
  p: EvercoldPigments;
  foreground: boolean;
}) {
  const id = `${useId().replace(/:/g, "")}-ec-moss-clump`;
  const shape = variant % shapes.length;
  const d = shapes[shape];
  const color = mix(p.moss, p.mossShade, foreground ? 91 : 82);
  const shade = mix(color, p.mossShade, 50);
  const light = mix(color, p.mossLight, foreground ? 64 : 75);
  const paint = `url(#${id}-padding)`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
        <radialGradient id={`${id}-padding`} cx=".37" cy=".28" r=".78">
          <stop stopColor={light} />
          <stop offset=".44" stopColor={color} />
          <stop offset=".78" stopColor={color} />
          <stop offset="1" stopColor={shade} />
        </radialGradient>
      </defs>
      <path
        d={d}
        fill={p.mossShade}
        transform="translate(.45 1.1)"
        opacity={foreground ? 0.56 : 0.4}
      />
      <path d={d} fill={paint} />
      <g clipPath={`url(#${id})`}>
        {clumpSilk[shape].map((stitches, tone) => (
          <NookThread
            key={tone}
            d={stitches}
            color={tone === 1 ? mix(color, light, 79) : paint}
            shadow={shade}
            highlight={light}
            width={tone === 1 ? 1.18 : 1.32}
            relief={foreground ? 1.65 : 1.4}
            opacity={tone === 1 ? 0.72 : 0.92}
          />
        ))}
        {(foreground || variant % 3 === 1) && (
          <NookThread
            d={
              shape === 0
                ? "M-14 3q-1-2 .6-2q1.8.2.4 1.8q-1 .8-1-.2M-9 6q-1.2-1.7.4-2q1.8 0 .6 1.8q-.8 1-1 .2"
                : shape === 1
                  ? "M12-2q-1.2-1.7.4-2q1.8 0 .6 1.8q-.8 1-1 .2M16 1q-1.1-1.6.3-1.9q1.7.1.7 1.6q-.7.9-1 .3"
                  : "M-4-9q-1.2-1.7.4-2q1.8 0 .6 1.8q-.8 1-1 .2M1-7q-1.1-1.6.3-1.9q1.7.1.7 1.6q-.7.9-1 .3"
            }
            color={mix(p.mossLight, color, 65)}
            shadow={shade}
            highlight={p.mossLight}
            width={0.85}
            relief={1.6}
            opacity={foreground ? 0.62 : 0.36}
          />
        )}
      </g>
      <NookThread
        d="M-25-7Q-23-16-12-15M11-17Q23-19 25-9"
        color={light}
        shadow={shade}
        highlight={p.mossLight}
        width={0.85}
        relief={1.4}
        opacity={foreground ? 0.48 : 0.28}
      />
    </g>
  );
}

/** Rounded moss cushions leave a soft, quiet foundation beneath the city. */
export function EvercoldMossBank({
  d,
  bounds: [x, y, w, h],
  p,
  foreground = false,
}: {
  d: string;
  bounds: EvercoldBounds;
  p: EvercoldPigments;
  foreground?: boolean;
}) {
  const id = `${useId().replace(/:/g, "")}-ec-moss-bank`;
  const clumps = foreground ? foregroundClumps : bankClumps;
  const scaleX = Math.min(foreground ? w * 0.69 : w * 0.57, 87) / 61;
  const scaleY = Math.min(foreground ? h * 0.52 : h * 0.34, 55) / 43;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
      </defs>
      <path
        d={d}
        fill={p.mossShade}
        transform="translate(.4 .8)"
        opacity=".35"
      />
      <path d={d} fill={mix(p.moss, p.mossShade, foreground ? 75 : 61)} />
      <g clipPath={`url(#${id})`}>
        {clumps.map(([u, v, size, angle], index) => (
          <g
            key={index}
            transform={`translate(${n(x + u * w)} ${n(y + v * h)}) rotate(${angle}) scale(${n(scaleX * size)} ${n(scaleY * size)})`}
          >
            <MossClump variant={index} p={p} foreground={foreground} />
          </g>
        ))}
      </g>
    </g>
  );
}

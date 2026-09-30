import { useId, useMemo } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";
import type { DawntrailPigments } from "./nookDawntrailPigments";

export type DawntrailBounds = [number, number, number, number];
export type DawntrailGrain =
  | "cotton"
  | "roof"
  | "binding"
  | "water"
  | "rock"
  | "turf";
const n = (value: number) => value.toFixed(2);
const mix = (color: string, pigment: string, weight: number) =>
  `color-mix(in srgb, ${color} ${weight}%, ${pigment})`;

/** Stitches are laid along the material, with a little slack between each bite. */
function laidFloss(
  [x, y, w, h]: DawntrailBounds,
  grain: DawntrailGrain,
  slant: number,
  ridgeStart: number,
  ridgeEnd: number,
) {
  const bundles: string[][] = [[], [], []];
  const entries: string[] = [];
  const seed = Math.round(x * 7 + y * 11 + w * 3 + h * 5);
  const add = (d: string, index: number, sx: number, sy: number) => {
    const tone = Math.min(
      2,
      Math.floor((threadVariation(index, seed + 17) + 1) * 1.5),
    );
    bundles[tone].push(d);
    if (index % 5 === 0)
      entries.push(`M${n(sx - 0.05)} ${n(sy + 0.3)}l.28 .12`);
  };
  if (grain === "water" || grain === "rock") {
    const pitch = grain === "water" ? 2.35 : 2.45;
    for (let row = 0; row < Math.ceil(h / pitch) + 4; row++) {
      const sy = y - 3 + row * pitch + threadVariation(row, seed) * 0.3;
      let sx = x - 35 + threadVariation(row, seed + 1) * 12;
      for (let col = 0; sx < x + w + 4; col++) {
        const index = row * 61 + col;
        const length =
          (grain === "water" ? 27 : 19) + threadVariation(index, seed + 2) * 5;
        const wave = (at: number) =>
          Math.sin(((at - x) / w) * Math.PI * 1.45 + row * 0.017) *
          (grain === "water" ? 1.15 : 2.2);
        const start = sy + wave(sx);
        const end = sy + wave(sx + length) + slant;
        add(
          `M${n(sx)} ${n(start)}Q${n(sx + length * 0.48)} ${n((start + end) * 0.5 - 0.65)} ${n(sx + length)} ${n(end)}`,
          index,
          sx,
          start,
        );
        sx += length + 1.1 + threadVariation(index, seed + 3) * 0.4;
      }
    }
  } else {
    const columns =
      Math.ceil(w / (grain === "roof" ? 1.65 : grain === "turf" ? 2.2 : 1.75)) +
      2;
    for (let col = 0; col < columns; col++) {
      const u = col / (columns - 1);
      const sx = x - 1 + u * (w + 2) + threadVariation(col, seed + 4) * 0.22;
      if (grain === "roof") {
        // Broad hipped roofs start along their real ridge; side pieces turn
        // from one end of that ridge toward their own curved, upswept hem.
        const top = ridgeStart + u * (ridgeEnd - ridgeStart);
        const reach = sx - top;
        const at = (t: number) => {
          const v = 1 - t;
          return [
            v ** 3 * (top + reach * 0.035) +
              3 * v * v * t * (top + reach * 0.14 + slant * 0.4) +
              3 * v * t * t * (top + reach * 0.66 + slant * 0.2) +
              t ** 3 * sx,
            v ** 3 * (y - 1) +
              3 * v * v * t * (y + h * 0.36) +
              3 * v * t * t * (y + h * 0.81) +
              t ** 3 * (y + h + 1),
          ];
        };
        // Every length is separately laid: the staggered joins follow the fan,
        // rather than cutting identical dashed bands across the roof.
        let t = (-(col % 3) * 2.7) / (h + 2);
        for (let row = 0; t < 1; row++) {
          const index = col * 31 + row;
          const end = Math.min(
            1,
            t + (8.8 + threadVariation(index, seed + 5) * 1.4) / (h + 2),
          );
          const a = at(Math.max(0, t)),
            b = at(end),
            mid = at((Math.max(0, t) + end) * 0.5);
          add(
            `M${n(a[0])} ${n(a[1])}Q${n(mid[0] * 2 - (a[0] + b[0]) * 0.5)} ${n(mid[1] * 2 - (a[1] + b[1]) * 0.5)} ${n(b[0])} ${n(b[1])}`,
            index,
            a[0],
            a[1],
          );
          t = end + (0.65 + threadVariation(index, seed + 6) * 0.2) / (h + 2);
        }
      } else if (grain === "binding") {
        const pull = threadVariation(col, seed + 7) * 0.4;
        add(
          `M${n(sx - 0.6)} ${n(y - 0.8 + pull)}q${n(1.55 + pull)} ${n(h * 0.48)} ${n(0.6 + pull)} ${n(h + 1.6)}`,
          col,
          sx - 0.6,
          y - 0.8,
        );
      } else {
        const pitch = grain === "turf" ? 9.3 : 10.2;
        for (let row = 0; row < Math.ceil(h / pitch) + 3; row++) {
          const index = col * 89 + row;
          const sy =
            y -
            pitch +
            row * pitch +
            ((col % 3) * pitch) / 3 +
            threadVariation(index, seed + 8) * 0.8;
          const length = pitch - 1.15 + threadVariation(index, seed + 9) * 1.1;
          const bow =
            (0.5 - u) * Math.min(w * 0.15, 3.6) +
            threadVariation(index, seed + 10) * 0.5;
          const drift =
            grain === "turf"
              ? -2.3 - u * 2.6 + Math.sin(((sy - y) / h) * Math.PI) * 1.3
              : slant * 0.4 + threadVariation(index, seed + 11) * 0.4;
          const start = sx + ((sy - y) / h) * slant;
          add(
            `M${n(start)} ${n(sy)}q${n(bow + drift * 0.55)} ${n(length * 0.48)} ${n(drift)} ${n(length)}`,
            index,
            start,
            sy,
          );
        }
      }
    }
  }
  return {
    strands: bundles.map((paths) => paths.join(" ")),
    entries: entries.join(" "),
  };
}

/** Soft padded appliqué: raised directional floss and a wrapped, irregular edge. */
export function DawntrailPatch({
  d,
  color,
  bounds,
  p,
  grain = "cotton",
  slant = 0,
  crownX,
  ridge,
  edge = 1,
  quiet = false,
}: {
  d: string;
  color: string;
  bounds: DawntrailBounds;
  p: DawntrailPigments;
  grain?: DawntrailGrain;
  slant?: number;
  /** Absolute local coordinates keep the silk aligned to an asymmetric roof. */
  crownX?: number;
  ridge?: [number, number];
  edge?: number;
  quiet?: boolean;
}) {
  const id = `${useId().replace(/:/g, "")}-turali-cloth`;
  const [x, y, w, h] = bounds;
  const ridgeStart = ridge?.[0] ?? crownX ?? x + w * 0.5;
  const ridgeEnd = ridge?.[1] ?? crownX ?? x + w * 0.5;
  const floss = useMemo(
    () => laidFloss([x, y, w, h], grain, slant, ridgeStart, ridgeEnd),
    [x, y, w, h, grain, slant, ridgeStart, ridgeEnd],
  );
  const quietWater = quiet && grain === "water";
  const shade = mix(color, p.ink, quiet ? (quietWater ? 83 : 77) : 65);
  const light = mix(color, p.paper, quiet ? (quietWater ? 81 : 73) : 61);
  const paint = `url(#${id}-padding)`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} fillRule="evenodd" clipRule="evenodd" />
        </clipPath>
        <linearGradient
          id={`${id}-padding`}
          gradientUnits="userSpaceOnUse"
          x1={
            grain === "binding"
              ? x + w * 0.5
              : grain === "roof"
                ? x + w * 0.2
                : x
          }
          y1={y + h * 0.05}
          x2={
            grain === "binding"
              ? x + w * 0.5
              : grain === "roof"
                ? x + w * 0.65
                : x + w
          }
          y2={y + h * (grain === "binding" || grain === "roof" ? 0.95 : 0.3)}
        >
          <stop stopColor={shade} />
          <stop offset=".16" stopColor={color} />
          <stop offset=".36" stopColor={light} />
          <stop offset=".7" stopColor={color} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill={p.ink}
        fillRule="evenodd"
        transform="translate(.6 1)"
        opacity={quiet ? 0.17 : 0.48}
      />
      <path d={d} fill={paint} fillRule="evenodd" />
      <g clipPath={`url(#${id})`}>
        {floss.strands.map((path, tone) => (
          <NookThread
            key={tone}
            d={path}
            color={tone === 1 ? mix(color, p.paper, quiet ? 92 : 85) : paint}
            shadow={shade}
            highlight={light}
            width={
              grain === "water"
                ? 1.65
                : grain === "turf"
                  ? 1.65
                  : tone === 1
                    ? 1.35
                    : 1.5
            }
            relief={quiet ? (quietWater ? 1.3 : 1.5) : 1.9}
            opacity={quiet ? 0.78 : tone === 1 ? 0.86 : 1}
          />
        ))}
        {!quietWater && (
          <path
            d={floss.entries}
            stroke={shade}
            strokeWidth=".6"
            strokeLinecap="round"
            opacity={quiet ? 0.2 : 0.32}
          />
        )}
      </g>
      {edge > 0 && (
        <>
          <NookThread
            d={d}
            color={paint}
            shadow={shade}
            highlight={light}
            width={edge * 1.4}
            relief={1.8}
          />
          <NookThread
            d={d}
            color={light}
            shadow={shade}
            highlight={p.paper}
            width={edge * 0.7}
            dasharray=".6 2.2"
            opacity={quiet ? 0.35 : 0.7}
          />
        </>
      )}
    </g>
  );
}

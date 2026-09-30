import { useId, useMemo } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";
import type { EvercoldPigments } from "./nookEvercoldPigments";

export type EvercoldBounds = [number, number, number, number];
export type EvercoldGrain =
  | "cotton"
  | "roof"
  | "binding"
  | "water"
  | "stone"
  | "petal"
  | "moss"
  | "bark";
const n = (value: number) => value.toFixed(2);
const mix = (color: string, pigment: string, weight: number) =>
  `color-mix(in srgb, ${color} ${weight}%, ${pigment})`;

function laidFloss(
  [x, y, w, h]: EvercoldBounds,
  grain: EvercoldGrain,
  slant: number,
  crownX: number,
) {
  const bundles: string[][] = [[], [], []];
  if (grain === "moss") {
    // Interlocking short stitches make a soft planted bank. Masonry courses
    // belong to the paths, not the garden's felt underneath them.
    for (let row = 0; row < Math.ceil(h / 3.1) + 3; row++) {
      const sy = y - 4 + row * 3.1;
      for (let col = 0; col < Math.ceil(w / 5.2) + 3; col++) {
        const index = row * 89 + col;
        const sx = x - 7 + col * 5.2 + (row % 2) * 2.6;
        const tilt = (row + col) % 2 ? 1 : -1;
        const jitter = threadVariation(index, 1671) * 0.45;
        const rise = 2.1 + threadVariation(index, 1672) * 0.4;
        bundles[(row + col) % 3].push(
          `M${n(sx)} ${n(sy + jitter)}q${n(tilt * 1.1)} ${n(-rise * 0.68)} ${n(tilt * 3.8)} ${n(-rise)}M${n(sx + 1.1)} ${n(sy + 0.8 + jitter)}q${n(tilt * 1.2)} ${n(-rise * 0.55)} ${n(tilt * 3.8)} ${n(-rise * 0.85)}`,
        );
      }
    }
  } else if (grain === "water" || grain === "stone") {
    const pitch = grain === "water" ? 1.9 : 2.25;
    for (let row = 0; row < Math.ceil(h / pitch) + 4; row++) {
      const sy = y - 3 + row * pitch;
      let sx = x - 24 + threadVariation(row, 1637) * 8;
      for (let col = 0; sx < x + w + 4; col++) {
        const index = row * 59 + col;
        const length = 17 + threadVariation(index, 1639) * 4.8;
        const wave = (at: number) =>
          Math.sin(((at - x) / w) * Math.PI * 1.3 + row * 0.018) *
          (grain === "water" ? 0.65 : 1.7);
        const start = sy + wave(sx);
        const end = sy + wave(sx + length) + slant;
        bundles[(row + col) % 3].push(
          `M${n(sx)} ${n(start)}Q${n(sx + length * 0.48)} ${n((start + end) * 0.5 - 0.65)} ${n(sx + length)} ${n(end)}`,
        );
        sx += length + 1.1 + threadVariation(index, 1640) * 0.3;
      }
    }
  } else {
    const columns = Math.ceil(w / (grain === "roof" ? 1.35 : 1.45)) + 2;
    for (let col = 0; col < columns; col++) {
      const u = col / (columns - 1);
      const sx = x - 1 + u * (w + 2);
      if (grain === "roof") {
        const reach = sx - crownX;
        bundles[col % 3].push(
          `M${n(crownX + reach * 0.055)} ${y - 1}C${n(crownX + reach * 0.14 + slant)} ${n(y + h * 0.38)} ${n(crownX + reach * 0.69 + slant * 0.3)} ${n(y + h * 0.82)} ${n(sx)} ${y + h + 1}`,
        );
      } else if (grain === "petal") {
        const reach = (u - 0.5) * (w + 2);
        bundles[col % 3].push(
          `M${n(sx)} ${y - 1}C${n(sx + reach * 0.12)} ${n(y + h * 0.34)} ${n(x + w * 0.5 + reach * 0.29)} ${n(y + h * 0.7)} ${n(x + w * 0.5 + reach * 0.12)} ${y + h + 1}`,
        );
      } else if (grain === "binding") {
        bundles[col % 3].push(
          `M${n(sx - 0.5)} ${y - 1}q1.45 ${n(h * 0.5)} .5 ${h + 2}`,
        );
      } else {
        const pitch = grain === "bark" ? 16 : 11.2;
        for (let row = 0; row < Math.ceil(h / pitch) + 3; row++) {
          const sy = y - pitch + row * pitch + ((col % 3) * pitch) / 3;
          const length =
            pitch - 0.6 + threadVariation(col * 73 + row, 1643) * 0.45;
          const bow =
            (0.5 - u) * Math.min(w * 0.15, 3.6) +
            threadVariation(col * 73 + row, 1644) * 0.3;
          bundles[(col + row) % 3].push(
            `M${n(sx + ((sy - y) / h) * slant)} ${n(sy)}q${n(bow + slant * 0.18)} ${n(length * 0.5)} ${n(slant * 0.35)} ${n(length)}`,
          );
        }
      }
    }
  }
  return bundles.map((paths) => paths.join(" "));
}

// Sparse couching catches the stone courses without drawing a grid over the cloth.
function couchedDetails([x, y, w, h]: EvercoldBounds, grain: EvercoldGrain) {
  if (grain !== "stone") return "";
  const stitches: string[] = [];
  const pitchX = 12;
  const pitchY = 7.2;
  for (let row = 0; row < Math.ceil(h / pitchY) + 1; row++) {
    for (let col = 0; col < Math.ceil(w / pitchX) + 2; col++) {
      const sx = x - pitchX + col * pitchX + (row % 2) * pitchX * 0.5;
      const sy = y + row * pitchY;
      stitches.push(`M${n(sx)} ${n(sy)}q3.2-.3 6.4 0m-3.2 .2v1.8`);
    }
  }
  return stitches.join(" ");
}

/** Padded cloth with fibers following stone courses, ripples, bark or petal folds. */
export function EvercoldPatch({
  d,
  color,
  bounds,
  p,
  grain = "cotton",
  slant = 0,
  crownX,
  edge = 1,
  quiet = false,
  stitches,
}: {
  d: string;
  color: string;
  bounds: EvercoldBounds;
  p: EvercoldPigments;
  grain?: EvercoldGrain;
  slant?: number;
  /** Roof silk starts at the actual crown, including an asymmetric side panel. */
  crownX?: number;
  edge?: number;
  quiet?: boolean;
  /** Object-specific laid stitches take precedence over a material's fallback. */
  stitches?: readonly string[];
}) {
  const id = `${useId().replace(/:/g, "")}-evercold-cloth`;
  const [x, y, w, h] = bounds;
  const crown = crownX ?? x + w * 0.5;
  const floss = useMemo(
    () => stitches ?? laidFloss([x, y, w, h], grain, slant, crown),
    [x, y, w, h, grain, slant, crown, stitches],
  );
  const couching = useMemo(
    () => (stitches ? "" : couchedDetails([x, y, w, h], grain)),
    [x, y, w, h, grain, stitches],
  );
  const shade = mix(color, p.ink, quiet ? 82 : grain === "moss" ? 77 : 63);
  const light = mix(color, p.paper, quiet ? 82 : grain === "moss" ? 80 : 60);
  const paint = `url(#${id}-padding)`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} fillRule="evenodd" clipRule="evenodd" />
        </clipPath>
        {grain === "moss" ? (
          <radialGradient id={`${id}-padding`} cx=".34" cy=".22" r=".95">
            <stop stopColor={light} />
            <stop offset=".4" stopColor={color} />
            <stop offset="1" stopColor={shade} />
          </radialGradient>
        ) : (
          <linearGradient
            id={`${id}-padding`}
            gradientUnits="userSpaceOnUse"
            x1={x}
            y1={y + h * 0.1}
            x2={x + w}
            y2={y + h * 0.3}
          >
            <stop stopColor={shade} />
            <stop offset=".18" stopColor={color} />
            <stop offset=".38" stopColor={light} />
            <stop offset=".72" stopColor={color} />
            <stop offset="1" stopColor={shade} />
          </linearGradient>
        )}
      </defs>
      <path
        d={d}
        fill={p.ink}
        fillRule="evenodd"
        transform="translate(.6 1)"
        opacity={quiet ? 0.18 : 0.48}
      />
      <path d={d} fill={paint} fillRule="evenodd" />
      <g clipPath={`url(#${id})`}>
        {floss.map((path, tone) => (
          <NookThread
            key={tone}
            d={path}
            color={
              tone === 1
                ? mix(color, p.paper, quiet || grain === "moss" ? 92 : 85)
                : paint
            }
            shadow={shade}
            highlight={light}
            width={
              grain === "water"
                ? 1.5
                : grain === "moss"
                  ? 1.2
                  : tone === 1
                    ? 1.25
                    : 1.35
            }
            relief={quiet ? 1.15 : grain === "moss" ? 1.25 : 1.8}
            opacity={
              quiet ? 0.68 : grain === "moss" ? 0.82 : tone === 1 ? 0.84 : 1
            }
            dasharray={
              grain === "petal" || grain === "roof"
                ? tone === 1
                  ? "8.4 .65 12.1 .55"
                  : "12.2 .55 7.4 .7"
                : undefined
            }
          />
        ))}
        {couching && (
          <NookThread
            d={couching}
            color={mix(color, p.paper, 82)}
            shadow={shade}
            highlight={light}
            width={0.6}
            relief={1.3}
            opacity={quiet ? 0.23 : 0.57}
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
            dasharray=".6 2.35"
            opacity={quiet ? 0.35 : 0.68}
          />
        </>
      )}
    </g>
  );
}

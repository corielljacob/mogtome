import { useId, useMemo } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";
import { endwalkerPigments } from "./nookEndwalkerPigments";

type Pigments = ReturnType<typeof endwalkerPigments>;
type Bounds = [number, number, number, number];
const n = (value: number) => value.toFixed(2);
const mix = (a: string, b: string, weight: number) =>
  `color-mix(in srgb, ${a} ${weight}%, ${b})`;

function curvedFloss(
  [x, y, w, h]: Bounds,
  grain: "hill" | "satin" | "roof",
  bend: number,
) {
  const paths: string[][] = [[], [], []];
  if (grain === "hill") {
    for (let row = 0; row < Math.ceil(h / 1.8) + 5; row++) {
      const sy = y - 5 + row * 1.8;
      let sx = x - 20 + threadVariation(row, 1080) * 8;
      for (let col = 0; sx < x + w + 5; col++) {
        const i = row * 71 + col;
        const length = 12.5 + threadVariation(i, 1081) * 4.2;
        const wave = (v: number) =>
          Math.sin(((v - x) / w) * Math.PI * 1.5 + row * 0.008) * bend;
        const ey = sy + wave(sx + length);
        paths[(row + col) % 3].push(
          `M${n(sx)} ${n(sy + wave(sx))}Q${n(sx + length * 0.5)} ${n((sy + wave(sx) + ey) * 0.5 - 0.85)} ${n(sx + length)} ${n(ey)}`,
        );
        sx += length + 1 + threadVariation(i, 1083) * 0.3;
      }
    }
  } else {
    const count = Math.ceil(w / 1.35) + 2;
    for (let col = 0; col < count; col++) {
      const u = col / (count - 1);
      const sx = x - 1 + u * (w + 2);
      if (grain === "roof") {
        const spread = (u - 0.5) * (w + 2);
        paths[col % 3].push(
          `M${n(x + w * 0.5 + spread * 0.12)} ${y - 1}C${n(x + w * 0.5 + spread * 0.55)} ${n(y + h * 0.22)} ${n(sx)} ${n(y + h * 0.69)} ${n(sx)} ${y + h + 2}`,
        );
      } else {
        for (let row = 0; row < Math.ceil(h / 7.2) + 3; row++) {
          const i = col * 43 + row;
          const sy = y - 8 + row * 7.2 + (col % 3) * 2.4;
          const length = 6.55 + threadVariation(i, 1091) * 0.35;
          const bow =
            (0.5 - u) * Math.min(3, w * 0.13) + threadVariation(i, 1092) * 0.35;
          paths[(row + col) % 3].push(
            `M${n(sx)} ${n(sy)}q${n(bow)} ${n(length * 0.5)} .1 ${n(length)}`,
          );
        }
      }
    }
  }
  return paths.map((path) => path.join(" "));
}

/** Padded lunar appliqué; the raised edge stays close to its needle shadow. */
export function LunarCloth({
  d,
  color,
  bounds,
  p,
  grain = "hill",
  bend = 3,
  edge = 1.2,
  quiet = false,
}: {
  d: string;
  color: string;
  bounds: Bounds;
  p: Pigments;
  grain?: "hill" | "satin" | "roof";
  bend?: number;
  edge?: number;
  quiet?: boolean;
}) {
  const id = `${useId().replace(/:/g, "")}-lunar-cloth`;
  const [x, y, w, h] = bounds;
  const floss = useMemo(
    () => curvedFloss([x, y, w, h], grain, bend),
    [x, y, w, h, grain, bend],
  );
  const shade = mix(color, p.ink, quiet ? 85 : 69);
  const light = mix(color, p.paper, quiet ? 84 : 61);
  const paint = `url(#${id}-pad)`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
        <linearGradient
          id={`${id}-pad`}
          gradientUnits="userSpaceOnUse"
          x1={x}
          y1={y}
          x2={x + w * 0.8}
          y2={y + h * 0.55}
        >
          <stop stopColor={light} />
          <stop offset=".23" stopColor={color} />
          <stop offset=".58" stopColor={color} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill={p.ink}
        transform="translate(.5 1.15)"
        opacity={quiet ? 0.24 : 0.45}
      />
      <path d={d} fill={paint} />
      <g clipPath={`url(#${id})`}>
        {floss.map((path, tone) => (
          <NookThread
            key={tone}
            d={path}
            color={paint}
            shadow={shade}
            highlight={light}
            width={tone === 1 ? 1.3 : 1.4}
            relief={quiet ? 1.1 : 1.7}
            opacity={quiet ? 0.68 : 0.94}
            dasharray={grain === "roof" ? "5.1 .7 7.4 .65" : undefined}
          />
        ))}
      </g>
      {edge > 0 && (
        <>
          <NookThread
            d={d}
            color={paint}
            shadow={shade}
            highlight={light}
            width={edge * 1.25}
            relief={1.8}
          />
          <NookThread
            d={d}
            color={light}
            shadow={shade}
            highlight={p.paper}
            width={edge * 0.7}
            dasharray=".65 2.5"
            opacity={quiet ? 0.4 : 0.65}
          />
        </>
      )}
    </g>
  );
}

/** A small quiet refuge, with a rounded roof and two hand-sewn amber windows. */
export function NookLunarShelter() {
  const p = endwalkerPigments();
  const thread = (d: string, color: string, width = 1.2, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      shadow={p.ink}
      highlight={p.paper}
      width={width}
      opacity={opacity}
      relief={1.7}
    />
  );
  return (
    <g className="nook-lunar-shelter" transform="translate(0 -9)">
      {thread("M92 223Q113 229 143 221", p.groundShade, 4, 0.6)}
      <LunarCloth
        d="M96 202Q114 195 135 201V222Q116 228 97 221Z"
        color={p.shelter}
        bounds={[94, 194, 43, 35]}
        grain="satin"
        p={p}
        edge={1.1}
      />
      <LunarCloth
        d="M124 200 135 201V222L124 225Z"
        color={p.shelterSide}
        bounds={[122, 198, 15, 29]}
        grain="satin"
        p={p}
        edge={0.5}
      />
      <LunarCloth
        d="M93 203C95 191 104 186 114 186C125 187 133 192 138 202Q117 210 93 203Z"
        color={p.roof}
        bounds={[91, 184, 49, 28]}
        grain="roof"
        p={p}
        edge={1.6}
      />
      {thread("M94 204Q116 211 137 203", p.roofLight, 1.7)}
      {thread(
        "M103 190Q113 197 112 207M123 188Q123 198 126 207",
        p.roofLight,
        0.85,
        0.85,
      )}
      {thread("M114 186v-3m-2 2h4", p.gold, 1)}
      <path d="M102 216V209Q105 204 108 209V216Z" fill={p.ink} />
      <path d="M104 214V209Q105 207 106 209V214Z" fill={p.window} />
      {thread("M102 216V209Q105 203 108 209V216", p.shelterSide, 1)}
      {thread("M105 208v6", p.windowLight, 1.7)}
      <path d="M118 220V209Q122 203 126 209V222Z" fill={p.ink} />
      <path d="M120 216V209Q122 207 124 209V217Z" fill={p.window} />
      {thread("M118 220V209Q122 202 126 209V222", p.shelter, 1.3)}
      {thread("M122 208v9M120 212h4", p.windowLight, 1.15)}
      {thread("M117 222h11m-13 2h16", p.shelter, 1.4)}
      {thread("M133 217h2", p.gold, 0.9)}
      {thread("M97 207l1 2m13 0v2m20-3 1 2", p.paper, 0.7, 0.7)}
    </g>
  );
}

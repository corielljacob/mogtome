import { useId, useMemo } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";
import { shadowbringersPigments } from "./nookShadowbringersPigments";

type Pigments = ReturnType<typeof shadowbringersPigments>;
type Bounds = [number, number, number, number];
type Grain =
  | "satin"
  | "glass"
  | "courses"
  | "water"
  | "crystal"
  | "cotton"
  | "binding";
const n = (value: number) => value.toFixed(2);
const mix = (a: string, b: string, amount: number) =>
  `color-mix(in srgb, ${a} ${amount}%, ${b})`;

function surfaceStitches([x, y, w, h]: Bounds, grain: Grain, slant: number) {
  const bundles: string[][] = [[], [], []];
  if (grain === "crystal") {
    // Short laid silk crosses a crystal face, instead of outlining its length.
    // Each cut facet clips its own fan, so the shoulder changes turn the grain.
    for (let row = 0; row < Math.ceil(h / 1.75) + 7; row++) {
      const sy = y - 5 + row * 1.75;
      const tilt = slant + threadVariation(row, 825) * 0.3;
      bundles[row % 3].push(
        `M${x - 2} ${n(sy)}Q${n(x + w * 0.48)} ${n(sy - 1.1 + tilt * 0.35)} ${x + w + 2} ${n(sy + tilt)}`,
      );
    }
  } else if (grain === "courses" || grain === "water") {
    const pitch = grain === "water" ? 2.15 : 1.65;
    for (let row = 0; row < Math.ceil(h / pitch) + 3; row++) {
      const sy = y - 2 + row * pitch;
      const bow = grain === "water" ? 0.65 : 1.6;
      bundles[row % 3].push(
        `M${x - 2} ${n(sy)}C${n(x + w * 0.3)} ${n(sy - bow)} ${n(x + w * 0.55)} ${n(sy + bow)} ${n(x + w * 0.75)} ${n(sy - 0.3)}S${n(x + w * 0.95)} ${n(sy - bow)} ${x + w + 2} ${n(sy)}`,
      );
    }
  } else {
    const columns =
      Math.ceil(
        w / (grain === "cotton" ? 1.65 : grain === "satin" ? 1.35 : 1.5),
      ) + 2;
    for (let col = 0; col < columns; col++) {
      const u = col / (columns - 1);
      const sx = x - 1 + u * (w + 2);
      if (grain === "glass") {
        const bow = (0.5 - u) * Math.min(w * 0.2, 3.2);
        // Silk follows each separate padded bay; it never converges into a
        // dense bundle at the crown of the whole dome.
        bundles[col % 3].push(
          `M${n(sx - slant)} ${y - 2}C${n(sx + bow - slant)} ${n(y + h * 0.25)} ${n(sx + bow)} ${n(y + h * 0.72)} ${n(sx)} ${y + h + 2}`,
        );
      } else if (grain === "binding") {
        bundles[col % 3].push(
          `M${n(sx - 0.55)} ${y - 2}Q${n(sx + 1.5)} ${n(y + h * 0.45)} ${n(sx)} ${y + h + 2}`,
        );
      } else {
        const pitch = grain === "cotton" ? 7.4 : 11;
        for (let row = 0; row < Math.ceil(h / pitch) + 2; row++) {
          const i = col * 83 + row;
          const sy =
            y -
            9 +
            row * pitch +
            (grain === "cotton" ? (col % 3) * pitch * 0.32 : (col % 2) * 5.3);
          const len =
            grain === "cotton"
              ? pitch - 0.65 + threadVariation(i, 782) * 0.45
              : 9.9 + threadVariation(i, 782) * 0.75;
          const bow = (0.5 - u) * Math.min(w * 0.11, 2.1);
          const drift = slant + threadVariation(i, 783) * 0.35;
          bundles[col % 3].push(
            `M${n(sx + ((sy - y) / h) * slant)} ${n(sy)}q${n(bow + drift * 0.5)} ${n(len * 0.49)} ${n(drift)} ${n(len)}`,
          );
        }
      }
    }
  }
  return bundles.map((bundle) => bundle.join(" "));
}

/** Small shaped cloth pieces, with the grain turning through their padded face. */
export function ShadowbringersPatch({
  d,
  color,
  bounds,
  p,
  grain = "satin",
  slant = 0,
  edge = 1,
  relief = 1.5,
  raised = false,
}: {
  d: string;
  color: string;
  bounds: Bounds;
  p: Pigments;
  grain?: Grain;
  slant?: number;
  edge?: number;
  relief?: number;
  raised?: boolean;
}) {
  const id = `${useId().replace(/:/g, "")}-norvrandt-cloth`;
  const [x, y, w, h] = bounds;
  const stitches = useMemo(
    () => surfaceStitches([x, y, w, h], grain, slant),
    [x, y, w, h, grain, slant],
  );
  const shade = mix(color, p.ink, raised ? 55 : 78);
  const light = mix(color, p.paper, raised ? 53 : 76);
  const fill = `url(#${id}-padding)`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
        <linearGradient
          id={`${id}-padding`}
          gradientUnits="userSpaceOnUse"
          x1={x}
          y1={y}
          x2={x + w}
          y2={y + h * 0.23}
        >
          <stop stopColor={shade} />
          <stop offset={raised ? ".16" : ".25"} stopColor={color} />
          <stop offset={raised ? ".34" : ".43"} stopColor={light} />
          <stop offset={raised ? ".67" : ".72"} stopColor={color} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill={raised ? p.ink : shade}
        transform={raised ? "translate(.75 1.25)" : "translate(.35 .6)"}
        opacity={raised ? ".55" : ".48"}
      />
      <path d={d} fill={fill} />
      <g clipPath={`url(#${id})`}>
        {stitches.map((path, tone) => (
          <NookThread
            key={tone}
            d={path}
            color={raised ? fill : tone === 1 ? light : fill}
            shadow={shade}
            highlight={light}
            width={
              grain === "water" ? 1.45 : raised ? (tone === 1 ? 1.2 : 1.3) : 1.2
            }
            relief={raised ? 1.85 : relief}
            opacity={raised ? 1 : tone === 1 ? 0.75 : 0.92}
            dasharray={
              grain === "satin" ||
              grain === "crystal" ||
              grain === "cotton" ||
              grain === "binding"
                ? undefined
                : tone === 1
                  ? "9 .8 14 .6"
                  : "13 .6 8 .75"
            }
          />
        ))}
      </g>
      {edge > 0 && (
        <>
          <NookThread
            d={d}
            color={raised ? fill : color}
            shadow={shade}
            highlight={light}
            width={raised ? edge * 1.25 : edge}
            relief={raised ? 1.8 : relief}
          />
          <NookThread
            d={d}
            color={light}
            shadow={shade}
            highlight={light}
            width={edge * (raised ? 0.8 : 0.55)}
            dasharray={raised ? ".65 2.2" : ".7 3.1"}
            opacity={raised ? 0.72 : 0.45}
          />
        </>
      )}
    </g>
  );
}

/** The tower narrows to an uneven needle; its buttresses crowd the foot. */
const towerFaces: {
  d: string;
  bounds: Bounds;
  tone: "crystal" | "crystalLight" | "crystalMid" | "crystalSide";
  slant: number;
}[] = [
  {
    d: "M175 251 178 224 183 213 183 194 188 182 188 165 192 154 192 136 196 125 196 101 202 79 206 106 207 128 211 139 210 158 216 174 216 194 222 212 224 235 227 251Z",
    bounds: [174, 78, 55, 175],
    tone: "crystal",
    slant: -3,
  },
  {
    d: "M175 251 178 224 183 213 183 194 188 182 188 165 192 154 192 136 196 125 196 101 202 79 199 126 196 151 196 177 192 195 191 221 187 251Z",
    bounds: [173, 78, 31, 175],
    tone: "crystalSide",
    slant: -6,
  },
  {
    d: "M202 79 206 106 207 128 211 139 210 158 216 174 216 194 222 212 224 235 227 251H213L214 223 208 199 207 178 203 154 203 125Z",
    bounds: [198, 78, 31, 175],
    tone: "crystalMid",
    slant: 5,
  },
  {
    d: "M202 79 203 125 203 154 207 178 208 199 214 223 213 251H187L191 221 192 195 196 177 196 151 199 126Z",
    bounds: [185, 78, 31, 175],
    tone: "crystalLight",
    slant: -2,
  },
  {
    d: "M181 251 185 221 186 184 191 168 191 216 195 235 193 251Z",
    bounds: [179, 167, 18, 86],
    tone: "crystal",
    slant: -3,
  },
  {
    d: "M204 230 205 178 209 157 212 182 211 211 216 234 216 251H207Z",
    bounds: [202, 156, 16, 97],
    tone: "crystal",
    slant: 3,
  },
];
const outerRibs = [
  {
    d: "M144 253 152 219 151 203 159 178 160 216Q168 205 181 209L184 216Q166 214 158 231L155 253Z",
    bounds: [142, 177, 44, 78] as Bounds,
    slant: -4,
  },
  {
    d: "M227 253 230 225Q222 210 212 212L214 204Q225 205 231 215L226 192 228 168 235 193 235 215 243 237 247 253Z",
    bounds: [210, 167, 39, 88] as Bounds,
    slant: 5,
  },
];
const rootPinnacles = [
  {
    d: "M158 253 160 228 159 215 166 195 168 224 172 237 170 253Z",
    bounds: [156, 194, 18, 61] as Bounds,
    tone: "crystalMid" as const,
  },
  {
    d: "M168 253 172 215 170 207 174 184 178 168 179 194 184 204 181 222 185 253Z",
    bounds: [166, 167, 21, 88] as Bounds,
    tone: "crystal" as const,
  },
  {
    d: "M219 253 218 222 214 212 216 191 220 178 223 210 229 232 230 253Z",
    bounds: [212, 177, 20, 78] as Bounds,
    tone: "crystal" as const,
  },
  {
    d: "M235 253 237 234 237 222 242 209 246 236 249 253Z",
    bounds: [233, 208, 18, 47] as Bounds,
    tone: "crystalMid" as const,
  },
];

const canopyOutline =
  "M-50 0C-43-16-22-24 0-24C24-24 43-15 50 0L50 7Q0 13-50 7Z";
const canopyRibs =
  "M-50 0Q0 10 50 0M-48 7Q0 13 48 7M0-24V10M-21-21C-31-17-35-8-35 8M-8-24C-16-17-18-7-18 10M8-24C16-17 18-7 18 10M21-21C31-17 35-8 35 8M-43-10Q0-2 43-10";
const canopyBays: {
  d: string;
  bounds: Bounds;
  tone: "glass" | "glassLight" | "glassBlue" | "glassShade";
  slant: number;
}[] = [
  {
    d: "M-50 0C-43-16-28-22-21-21C-31-17-35-8-35 2Q-44 2-50 0Z",
    bounds: [-51, -23, 32, 28],
    tone: "glassShade",
    slant: -8,
  },
  {
    d: "M-21-21-8-24C-16-17-18-7-18 4L-35 2C-35-8-31-17-21-21Z",
    bounds: [-36, -25, 30, 31],
    tone: "glassBlue",
    slant: -5,
  },
  {
    d: "M-8-24H0V5L-18 4C-18-7-16-17-8-24Z",
    bounds: [-19, -25, 21, 32],
    tone: "glass",
    slant: -2,
  },
  {
    d: "M0-24H8C16-17 18-7 18 4L0 5Z",
    bounds: [-1, -25, 21, 32],
    tone: "glassLight",
    slant: 2,
  },
  {
    d: "M8-24 21-21C31-17 35-8 35 2L18 4C18-7 16-17 8-24Z",
    bounds: [6, -25, 31, 31],
    tone: "glassBlue",
    slant: 5,
  },
  {
    d: "M21-21C28-22 43-15 50 0Q44 2 35 2C35-8 31-17 21-21Z",
    bounds: [20, -23, 32, 28],
    tone: "glassShade",
    slant: 8,
  },
];

/** A low conservatory roof. Each silk bay is stitched into dark couched ribs. */
function GlassCanopy({
  x,
  y,
  width = 1,
  height = 1,
  p,
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  p: Pigments;
}) {
  const id = `${useId().replace(/:/g, "")}-crystarium-canopy`;
  const thread = (d: string, color: string, w: number) => (
    <NookThread
      d={d}
      color={color}
      shadow={p.bronzeDeep}
      highlight={p.bronzeLight}
      width={w}
      relief={1.8}
    />
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${width} ${height})`}>
      <defs>
        <clipPath id={id}>
          <path d={canopyOutline} />
        </clipPath>
      </defs>
      <path
        d={canopyOutline}
        fill={p.bronzeDeep}
        transform="translate(.6 1.1)"
      />
      <g clipPath={`url(#${id})`}>
        {canopyBays.map((bay) => (
          <ShadowbringersPatch
            key={bay.d}
            d={bay.d}
            color={p[bay.tone]}
            bounds={bay.bounds}
            grain="glass"
            slant={bay.slant}
            p={p}
            edge={0.5}
            raised
          />
        ))}
        {[-42, -25, -8, 8, 25, 42].map((cx, index) => (
          <ShadowbringersPatch
            key={cx}
            d={`M${cx - 7.5} 0Q${cx} 3 ${cx + 7.5} 0V12H${cx - 7.5}Z`}
            color={index === 0 || index === 5 ? p.glassShade : p.glassBlue}
            bounds={[cx - 8, -1, 17, 15]}
            grain="cotton"
            p={p}
            edge={0.45}
            raised
          />
        ))}
        {[-42, -25, -8, 8, 25, 42].map((cx) => (
          <g key={cx}>
            {thread(
              `M${cx - 5} 12V6Q${cx} 0 ${cx + 5} 6V12M${cx} 3V12`,
              p.bronzeDeep,
              1.1,
            )}
          </g>
        ))}
      </g>
      {thread(canopyOutline, p.bronzeDeep, 2.3)}
      {thread(canopyRibs, p.bronzeDeep, 2.3)}
      {thread(canopyRibs, p.bronze, 1.35)}
      <NookThread
        d={canopyRibs}
        color={p.bronzeLight}
        shadow={p.bronzeDeep}
        highlight={p.paper}
        width={1.6}
        dasharray=".55 2.4"
        opacity={0.65}
        relief={1.2}
      />
      {thread("M-50 7Q0 14 50 7", p.bronze, 2)}
      {thread("M0-24V-29M-21-21l-2-4M21-21l2-4", p.bronzeDeep, 1.2)}
      {thread(
        "M-36-8l2 1m16-6 2 1m15-2v2m17-1-2 2m16 3-2 1",
        p.bronzeLight,
        0.8,
      )}
    </g>
  );
}

const arcadeRibs = [
  { x: 61, y: 225, w: 39, h: 34 },
  { x: 91, y: 228, w: 33, h: 29 },
  { x: 118, y: 230, w: 28, h: 24 },
  { x: 142, y: 232, w: 24, h: 20 },
];
const smallBuildings: {
  x: number;
  y: number;
  w: number;
  h: number;
  roof: number;
}[] = [
  { x: 111, y: 246, w: 22, h: 20, roof: 5 },
  { x: 133, y: 240, w: 20, h: 27, roof: 7 },
  { x: 155, y: 248, w: 23, h: 18, roof: 4 },
  { x: 180, y: 242, w: 18, h: 26, roof: 6 },
  { x: 202, y: 247, w: 18, h: 23, roof: 5 },
  { x: 259, y: 241, w: 21, h: 29, roof: 6 },
  { x: 280, y: 247, w: 21, h: 22, roof: 4 },
  { x: 304, y: 252, w: 29, h: 16, roof: 5 },
];

/** The immense Crystal Tower rises above a low, sprawling city of open ribs. */
export function NookCrystarium({ isDark }: { isDark: boolean }) {
  const p = shadowbringersPigments(isDark);
  const patch = (
    d: string,
    color: string,
    bounds: Bounds,
    grain: Grain = "cotton",
    edge = 1,
    slant = 0,
  ) => (
    <ShadowbringersPatch
      d={d}
      color={color}
      bounds={bounds}
      grain={grain}
      p={p}
      edge={edge}
      slant={slant}
      raised
    />
  );
  const thread = (d: string, color: string, width = 1.3, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      shadow={p.ink}
      highlight={mix(color, p.paper, 70)}
      width={width}
      opacity={opacity}
      relief={1.6}
    />
  );
  return (
    <g className="nook-crystarium">
      {/* Broad empty sky surrounds the high spire; only its roots branch outward. */}
      {outerRibs.map((rib) => (
        <ShadowbringersPatch
          key={rib.d}
          d={rib.d}
          color={p.crystalMid}
          bounds={rib.bounds}
          grain="crystal"
          slant={rib.slant}
          p={p}
          edge={1.1}
          raised
        />
      ))}
      {towerFaces.map((face) => (
        <ShadowbringersPatch
          key={face.d}
          d={face.d}
          color={p[face.tone]}
          bounds={face.bounds}
          grain="crystal"
          slant={face.slant}
          p={p}
          edge={0.85}
          raised
        />
      ))}
      {thread(
        "M201 89 200 122 200 150M198 160l-1 28M202 170l2 24M195 199l-2 27M210 210l2 27M205 114l1 13",
        p.crystalSeam,
        1.3,
        0.95,
      )}
      {thread(
        "M196 125l-3 13m13-8 3 9M190 173v15M217 197l3 16",
        p.crystalSide,
        1.2,
        0.75,
      )}
      <NookThread
        d="M201 89 200 122 200 150M198 160l-1 28M195 199l-2 27"
        color={p.crystalLight}
        shadow={p.crystalSide}
        highlight={p.paper}
        width={1.65}
        dasharray=".65 2.8"
        opacity={0.8}
        relief={1.4}
      />
      {rootPinnacles.map((root) => (
        <ShadowbringersPatch
          key={root.d}
          d={root.d}
          color={p[root.tone]}
          bounds={root.bounds}
          grain="crystal"
          slant={-3}
          p={p}
          edge={0.9}
          raised
        />
      ))}
      {thread(
        "M157 192l-1 22q10-11 22-3M174 187l2 23-3 27M229 180l3 15v25M220 192l1 21 4 18M243 222l2 20",
        p.crystalLight,
        1,
        0.85,
      )}
      {patch(
        "M167 252 176 229 182 221 183 247 188 252ZM203 252 208 232 212 217 217 244 220 252Z",
        p.crystalLight,
        [165, 216, 57, 38],
        "crystal",
        0.8,
        2,
      )}

      {/* Open iron ribs recede along a low bridge; the sky remains between them. */}
      {arcadeRibs.map(({ x, y, w, h }, index) => {
        const arc = `M${x} ${y}C${x + 4} ${y - h * 0.8} ${x + w * 0.56} ${y - h * 1.18} ${x + w * 0.82} ${y - h}Q${x + w + 5} ${y - h * 0.67} ${x + w} ${y}`;
        const inner = `M${x + 3} ${y}C${x + 7} ${y - h * 0.72} ${x + w * 0.58} ${y - h * 1.06} ${x + w * 0.8} ${y - h + 3}Q${x + w + 2} ${y - h * 0.59} ${x + w - 2} ${y}`;
        return (
          <g key={x}>
            {thread(arc, p.bronzeDeep, 2.1)}
            {thread(inner, p.bronze, 1.1)}
            {thread(
              `M${x + w * 0.81} ${y - h + 1}l1-6M${x + 4} ${y - h * 0.23}l4 1M${x + w - 1} ${y - h * 0.23}l-3 1`,
              p.bronze,
              0.95,
            )}
            <NookThread
              d={arc}
              color={p.bronzeLight}
              shadow={p.bronzeDeep}
              highlight={p.paper}
              width={1.35}
              dasharray=".6 3"
              opacity={index ? 0.45 : 0.6}
            />
          </g>
        );
      })}
      {patch(
        "M59 219Q117 225 174 235L176 241Q119 231 59 226Z",
        p.masonrySide,
        [58, 217, 120, 27],
        "binding",
        0.9,
      )}
      {thread("M61 220Q116 226 173 236", p.bronze, 1.8)}
      {thread(
        "M63 228V257M91 232v27M119 237v26M145 242v23M168 245v23M64 253Q72 232 90 254M92 257Q102 236 117 259M120 261Q129 241 144 263M147 263Q154 246 167 267",
        p.masonrySide,
        2.3,
      )}
      {thread(
        "M67 247 79 239l9 12M94 251l11-10 9 13M121 256l10-10 11 12",
        p.masonryLight,
        0.85,
        0.65,
      )}

      {/* Layered low roofs spread sideways, rather than forming a palace plinth. */}
      {patch(
        "M99 253 131 246 157 251 186 247 213 255 241 249 280 252 312 247 348 253V279H97Z",
        p.masonrySide,
        [95, 244, 255, 37],
        "cotton",
        0.8,
      )}
      <GlassCanopy x={163} y={238} width={0.57} height={0.58} p={p} />
      <GlassCanopy x={310} y={231} width={0.71} height={0.61} p={p} />
      {patch(
        "M211 216Q261 223 315 216L317 236Q260 243 210 236Z",
        p.masonrySide,
        [208, 214, 111, 31],
        "cotton",
        0.75,
      )}
      {[-1, 0, 1, 2, 3, 4, 5].map((i) => {
        const x = 220 + i * 14;
        return (
          <g key={i}>
            {patch(
              `M${x} 226V219Q${x + 5} 220 ${x + 10} 219V234H${x}Z`,
              i % 3 === 0 ? p.glassShade : p.glassBlue,
              [x - 1, 217, 13, 19],
              "glass",
              0.5,
            )}
            {thread(
              `M${x - 1} 235V223Q${x + 5} 217 ${x + 11} 223V235`,
              p.bronzeDeep,
              1.4,
            )}
          </g>
        );
      })}
      <GlassCanopy x={261} y={204} p={p} />
      {thread("M209 238Q262 244 318 237", p.bronze, 2)}
      {smallBuildings.map(({ x, y, w, h, roof }, index) => (
        <g key={x}>
          {patch(
            `M${x} ${y}H${x + w}V${y + h}H${x}Z`,
            index % 3 === 1 ? p.masonryLight : p.masonry,
            [x - 1, y - 1, w + 2, h + 2],
            "cotton",
            0.55,
          )}
          {patch(
            `M${x + w - 4} ${y + 1} ${x + w} ${y}V${y + h}H${x + w - 4}Z`,
            p.masonrySide,
            [x + w - 5, y - 1, 7, h + 2],
            "cotton",
            0,
          )}
          {patch(
            `M${x - 2} ${y}Q${x + w * 0.25} ${y - roof} ${x + w * 0.55} ${y - roof}L${x + w + 2} ${y}Z`,
            index % 2 ? p.bronzeDeep : p.bronze,
            [x - 3, y - roof - 1, w + 6, roof + 3],
            "binding",
            0.8,
          )}
          {thread(
            `M${x + w * 0.25} ${y + 7}v4M${x + w * 0.6} ${y + 7}v4`,
            index % 3 === 0 ? p.window : p.glassBlue,
            1.4,
            0.85,
          )}
          {thread(`M${x + 2} ${y + h - 4}h${w - 5}`, p.masonrySide, 0.8, 0.7)}
        </g>
      ))}
      {/* A modest arched passage and broken quay lead down toward Lakeland. */}
      {patch(
        "M220 270V247Q232 238 244 247V270Z",
        p.masonry,
        [219, 241, 27, 31],
        "cotton",
        0.8,
      )}
      <path d="M226 270V250Q232 243 238 250V270Z" fill={p.ink} />
      {thread("M225 267V250Q232 241 239 250V267", p.bronze, 1.25)}
      {thread("M228 249q4-5 8 0", p.glass, 1.4)}
      {patch(
        "M96 269Q134 265 167 271L200 270 220 273 246 270 279 272 311 270 348 277V285H94Z",
        p.masonry,
        [92, 264, 258, 23],
        "cotton",
        0.8,
      )}
      {thread(
        "M99 270q29-4 64 2m8 0 28-1m48 1 31 1m6 0 27-2",
        p.terrace,
        1.5,
        0.85,
      )}
      {patch(
        "M225 267H238L244 283H219Z",
        p.masonrySide,
        [217, 266, 29, 19],
        "cotton",
        0.6,
      )}
      {thread("M224 271h15m-16 4h18m-20 4h22m-24 4h26", p.terrace, 1.2)}
    </g>
  );
}

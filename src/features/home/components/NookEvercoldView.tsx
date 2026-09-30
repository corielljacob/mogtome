import { useId } from "react";
import { EvercoldPatch } from "./NookEvercoldPatch";
import { NookEvercoldCity } from "./NookEvercoldCity";
import { EvercoldMossBank } from "./NookEvercoldMoss";
import { NookThread } from "./NookThread";
import {
  evercoldPigments,
  type EvercoldPigments,
} from "./nookEvercoldPigments";
import { threadVariation } from "./nookNeedlework";
import { evercoldContourStitches } from "./nookEvercoldNeedlework";

const petals: {
  d: string;
  tone: "canopy" | "canopyLight" | "canopyShade";
  tip: [number, number];
  bend: [number, number];
  halfWidth: number;
}[] = [
  {
    d: "M0 4C-23-8-37-29-43-48Q-45-55-38-49C-24-42-11-28 0-7Z",
    tone: "canopyShade",
    tip: [-42, -51],
    bend: [-24, -18],
    halfWidth: 13,
  },
  {
    d: "M0 1C-25-16-31-42-25-59Q-24-66-20-59C-11-46-6-27 0-9Z",
    tone: "canopy",
    tip: [-24, -63],
    bend: [-21, -28],
    halfWidth: 12,
  },
  {
    d: "M0 2C-15-24-15-49-11-64Q-9-74-6-65C2-44 5-19 0 2Z",
    tone: "canopyLight",
    tip: [-9, -70],
    bend: [-5, -33],
    halfWidth: 12,
  },
  {
    d: "M0 2C2-28 10-49 20-59Q25-66 25-57C25-34 13-9 0 2Z",
    tone: "canopy",
    tip: [24, -63],
    bend: [18, -28],
    halfWidth: 12,
  },
  {
    d: "M0 3C20-28 31-44 42-48Q49-51 44-43C37-24 18-6 0 3Z",
    tone: "canopyShade",
    tip: [46, -49],
    bend: [27, -22],
    halfWidth: 13,
  },
  {
    d: "M1 5C-23 0-39-13-44-27Q-48-34-40-30C-26-26-10-14 1 5Z",
    tone: "canopy",
    tip: [-45, -32],
    bend: [-24, -7],
    halfWidth: 12,
  },
  {
    d: "M0 5C18-15 32-24 41-24Q49-25 43-19C33-3 17 6 0 5Z",
    tone: "canopyLight",
    tip: [45, -24],
    bend: [23, -1],
    halfWidth: 12,
  },
];

const n = (value: number) => value.toFixed(2);
const mix = (a: string, b: string, weight: number) =>
  `color-mix(in srgb, ${a} ${weight}%, ${b})`;

// Like the Coerthan slopes and lunar crater rims, the laid silk follows the
// actual form. Every curved course travels from this petal's lip to its shared
// attachment; a rectangular bounding box must not decide that direction.
function petalNeedlework(
  { tip, bend, halfWidth }: (typeof petals)[number],
  seed: number,
) {
  const length = Math.hypot(...tip);
  const dx = -tip[0] / length;
  const dy = -tip[1] / length;
  const px = -dy;
  const py = dx;
  const tones: string[][] = [[], [], []];
  const point = (t: number, lateral: number) => {
    const u = 1 - t;
    const spread =
      0.52 + Math.sin(Math.max(0, Math.min(1, t)) * Math.PI) * 0.48;
    return [
      u * u * tip[0] + 2 * u * t * bend[0] + px * lateral * spread,
      u * u * tip[1] + 2 * u * t * bend[1] + t * t * 3 + py * lateral * spread,
    ];
  };
  const columns = Math.ceil((halfWidth * 2) / 1.65);
  const pitch = 9.8 / length;
  for (let col = 0; col <= columns; col++) {
    const lateral = -halfWidth + (col / columns) * halfWidth * 2;
    for (let row = -1; row < Math.ceil(1 / pitch) + 1; row++) {
      const index = col * 23 + row;
      const t = row * pitch + (col % 2) * pitch * 0.48;
      const end = t + (8.65 + threadVariation(index, seed) * 0.5) / length;
      const startPoint = point(t, lateral);
      const endPoint = point(end, lateral);
      const middle = point((t + end) / 2, lateral);
      const bow = 0.38 + threadVariation(index, seed + 1) * 0.2;
      tones[(col + row + 3) % 3].push(
        `M${n(startPoint[0])} ${n(startPoint[1])}Q${n(middle[0] + px * bow)} ${n(middle[1] + py * bow)} ${n(endPoint[0])} ${n(endPoint[1])}`,
      );
    }
  }
  return tones.map((paths) => paths.join(" "));
}
const petalPieces = petals.map((piece, i) => ({
  ...piece,
  stitches: petalNeedlework(piece, 1721 + i * 3),
}));
const barkStitches = evercoldContourStitches(
  [
    [
      [0, -9],
      [8, 36],
      [-20, 106],
      [-21, 148],
    ],
  ],
  23,
  { seed: 1921 },
);

/** Separate padded lobes with bowed long-and-short silk, not drawn vein lines. */
function PetalCloth({
  piece,
  p,
}: {
  piece: (typeof petalPieces)[number];
  p: EvercoldPigments;
}) {
  const id = `${useId().replace(/:/g, "")}-evercold-petal`;
  const color = p[piece.tone];
  const shade = mix(color, p.canopyShade, 48);
  const light = mix(color, p.flower, 48);
  const padding = `url(#${id}-padding)`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={piece.d} />
        </clipPath>
        <radialGradient id={`${id}-padding`} cx=".35" cy=".28" r=".86">
          <stop stopColor={light} />
          <stop offset=".4" stopColor={color} />
          <stop offset=".72" stopColor={color} />
          <stop offset="1" stopColor={shade} />
        </radialGradient>
      </defs>
      <path
        d={piece.d}
        fill={p.barkShade}
        opacity=".48"
        transform="translate(.65 1.25)"
      />
      <path d={piece.d} fill={padding} />
      <g clipPath={`url(#${id})`}>
        {piece.stitches.map((d, tone) => (
          <NookThread
            key={tone}
            d={d}
            color={
              tone === 1 ? light : tone === 2 ? mix(color, shade, 76) : padding
            }
            shadow={shade}
            highlight={light}
            width={tone === 1 ? 1.45 : 1.55}
            relief={1.85}
            opacity={tone === 1 ? 0.83 : 1}
          />
        ))}
      </g>
      <NookThread
        d={piece.d}
        color={padding}
        shadow={shade}
        highlight={light}
        width={1.35}
        relief={1.8}
      />
      <NookThread
        d={piece.d}
        color={light}
        shadow={color}
        highlight={p.flower}
        width={0.8}
        dasharray=".65 2.4"
        opacity={0.72}
        relief={1.25}
      />
    </g>
  );
}
const frenchKnot = (x: number, y: number, size = 1) =>
  `M${(x - size * 0.6).toFixed(2)} ${y.toFixed(2)}c${-size * 0.3} ${-size} ${size * 1.2} ${-size * 1.4} ${size * 1.3} ${-size * 0.35}c${size * 0.2} ${size * 0.9} ${-size} ${size * 1.2} ${-size * 1.3} ${size * 0.35}Z`;
// Knots gather around bark creases, leaving quiet stretches between the clusters.
const lichenKnots = [
  [-3, 22, 12, 5],
  [-9, 67, 10, 4],
  [-15, 109, 7, 3],
]
  .map(([cx, cy, count, spread], cluster) =>
    Array.from({ length: count }, (_, i) => {
      const x = cx + threadVariation(i, 1681 + cluster) * spread;
      const y = cy + threadVariation(i, 1688 + cluster) * spread * 2.1;
      return frenchKnot(x, y, 0.48 + (i % 3) * 0.14);
    }).join(" "),
  )
  .join(" ");

/** Satin-stitched petals flare from a broad, dark trunk, with tiny lichen knots. */
function PetalTree({
  x,
  y,
  scale = 1,
  flip = false,
  p,
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  p: EvercoldPigments;
}) {
  const thread = (d: string, color: string, width = 1.2, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      width={width}
      shadow={p.barkShade}
      highlight={p.paper}
      relief={1.6}
      opacity={opacity}
    />
  );
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
    >
      <EvercoldPatch
        d="M-7-5C-6 28-18 71-24 139L-31 145-13 143-5 139C-12 102 14 42 8-5Z"
        color={p.bark}
        bounds={[-33, -7, 50, 154]}
        grain="bark"
        stitches={barkStitches}
        p={p}
        edge={1}
      />
      <EvercoldPatch
        d="M4-5C7 35-13 97-15 142L-5 139C-12 102 14 42 8-5Z"
        color={p.barkShade}
        bounds={[-17, -7, 34, 153]}
        grain="bark"
        stitches={barkStitches}
        p={p}
        edge={0.4}
      />
      {thread(
        "M-3 6C0 41-17 92-20 137M-10 35l-4 20m-1 18-6 28M0 15l-2 22m-3 20-7 24",
        p.barkLight,
        1.35,
        0.8,
      )}
      {thread(lichenKnots, p.glass, 0.9, 0.72)}
      {scale > 0.6 &&
        thread(
          "M-1 18q-2 2-1 4m-3 2q-1 3-3 2M-9 61q-2 2-1 4m1 4q-3 1-3 4M-15 105q-1 3-3 4",
          p.mossLight,
          0.85,
          0.7,
        )}
      {petalPieces.map((piece, i) => (
        <PetalCloth key={i} piece={piece} p={p} />
      ))}
      <EvercoldPatch
        d="M-20-4Q-7 2 0 0Q8 2 21-5L7 15 1 24-6 15Z"
        color={p.bark}
        bounds={[-22, -7, 45, 34]}
        grain="petal"
        p={p}
        edge={0.7}
      />
      {thread("M-15-1-4 13M-7 2-1 17M4 3 1 18M12 0 4 12", p.barkLight, 0.85)}
      {thread(
        "M-12 2h.1m6 4h.1m8-1h.1m6-3h.1M-3 18h.1",
        p.glassLight,
        0.9,
        0.65,
      )}
    </g>
  );
}

function GardenLamp({
  x,
  y,
  p,
  scale = 1,
}: {
  x: number;
  y: number;
  p: EvercoldPigments;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <NookThread
        d="M0 4v13m-5 0h10M-7 2Q0 9 7 2"
        color={p.trim}
        width={1.7}
        shadow={p.ink}
        highlight={p.paper}
        relief={1.7}
      />
      <EvercoldPatch
        d="M-7 0a7 7 0 1 1 14 0 7 7 0 1 1-14 0Z"
        color={p.amber}
        bounds={[-9, -9, 18, 18]}
        grain="petal"
        p={p}
        edge={0.75}
      />
      <NookThread
        d="M0-6C-4-3-4 2 0 6M0-6C4-3 4 2 0 6M-6-1Q0 3 6-1"
        color={p.window}
        shadow={p.amber}
        highlight={p.amberLight}
        width={0.65}
        relief={1.25}
        opacity={0.8}
      />
      <NookThread
        d="M-4-4Q-1-7 3-4M-4 1q1 4 5 3"
        color={p.amberLight}
        shadow={p.amber}
        highlight={p.paper}
        width={1.35}
        relief={1.6}
      />
      <NookThread
        d="M-4 7q4 2 8 0M-2 10h4M-3 14h6"
        color={p.trim}
        shadow={p.ink}
        highlight={p.glassLight}
        width={0.85}
        dasharray=".6 1"
      />
    </g>
  );
}

const flowerCenters = [
  [-9, -10],
  [0, -15],
  [10, -3],
] as const;
// Detached chain stitches make cupped petals; a single bundled path keeps them light.
const daisyPetals = flowerCenters
  .map(([x, y], flower) =>
    Array.from({ length: 5 }, (_, i) => {
      const a = (i * Math.PI * 2) / 5 + flower * 0.4;
      const vx = Math.cos(a);
      const vy = Math.sin(a);
      const px = -vy;
      const py = vx;
      const r = flower === 1 ? 4.1 : 3.6;
      return `M${x} ${y}C${x + vx * 1.4 + px * 1.25} ${y + vy * 1.4 + py * 1.25} ${x + vx * r + px * 1.15} ${y + vy * r + py * 1.15} ${x + vx * r} ${y + vy * r}C${x + vx * r - px * 1.15} ${y + vy * r - py * 1.15} ${x + vx * 1.4 - px * 1.25} ${y + vy * 1.4 - py * 1.25} ${x} ${y}Z`;
    }).join(" "),
  )
  .join(" ");
const flowerKnots = flowerCenters
  .map(([x, y]) => frenchKnot(x, y, 0.8))
  .join(" ");

function GardenFlowers({
  x,
  y,
  p,
  scale = 1,
}: {
  x: number;
  y: number;
  p: EvercoldPigments;
  scale?: number;
}) {
  const thread = (d: string, color: string, width = 1.5) => (
    <NookThread
      d={d}
      color={color}
      width={width}
      shadow={p.mossShade}
      highlight={p.paper}
      relief={1.6}
    />
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {thread(
        "M0 16Q-4 0-9-10M-1 16Q5 2 10-3M0 16V-15M-1 17q-9-8-15-7M3 15q7-7 14-6",
        p.mossLight,
        1.25,
      )}
      <path
        d={daisyPetals}
        fill={p.canopyShade}
        transform="translate(.35 .65)"
        opacity=".65"
      />
      <path d={daisyPetals} fill={p.flower} />
      {thread(daisyPetals, p.flower, 1.65)}
      {thread(flowerKnots, p.amberLight, 1.3)}
      {thread(
        "M-3 12Q-12 13-11 6Q-5 5-3 12ZM3 10Q5 2 12 4Q12 10 3 10ZM-3 15q-8-7-10 0q5 3 10 0ZM5 15q7-8 11-4q0 6-11 4Z",
        p.moss,
        1.35,
      )}
      {thread("M-10 7-4 11M11 5 4 9M-12 15h8M7 14l7-2", p.mossLight, 0.65)}
    </g>
  );
}

const leftBank =
  "M60 276H166Q172 291 186 306L184 325Q195 341 211 349Q222 361 205 382L178 410V440H60Z";
const rightBank =
  "M220 280H346V440H269Q248 404 250 384L270 361Q255 340 235 329L215 309Z";
const canalBinding =
  "M184 307 182 325Q193 342 209 351Q218 361 203 381L175 410V440M218 309l19 21q19 9 34 31l-19 24q-4 18 20 55";
const canalSilk = evercoldContourStitches(
  [
    [
      [193, 270],
      [186, 309],
      [209, 323],
      [234, 346],
    ],
    [
      [234, 346],
      [257, 368],
      [233, 389],
      [222, 405],
    ],
    [
      [222, 405],
      [211, 420],
      [219, 438],
      [223, 449],
    ],
  ],
  66,
  { seed: 1931 },
);
const leftWalkSilk = evercoldContourStitches(
  [
    [
      [58, 337],
      [94, 327],
      [138, 329],
      [161, 337],
    ],
    [
      [161, 337],
      [173, 349],
      [186, 353],
      [179, 365],
    ],
    [
      [179, 365],
      [172, 376],
      [160, 388],
      [153, 399],
    ],
  ],
  13,
  { across: true, seed: 1941 },
);
const rightWalkSilk = evercoldContourStitches(
  [
    [
      [350, 335],
      [323, 325],
      [294, 333],
      [279, 347],
    ],
    [
      [279, 347],
      [276, 354],
      [295, 360],
      [296, 367],
    ],
    [
      [296, 367],
      [291, 382],
      [275, 397],
      [275, 407],
    ],
    [
      [275, 407],
      [276, 419],
      [279, 430],
      [281, 446],
    ],
  ],
  14,
  { across: true, seed: 1951 },
);
const gardenKnots = [
  [74, 357],
  [78, 355],
  [82, 359],
  [97, 380],
  [102, 377],
  [109, 364],
  [318, 389],
  [322, 386],
  [326, 388],
  [312, 422],
]
  .map(([x, y], i) => frenchKnot(x, y, 0.6 + (i % 3) * 0.15))
  .join(" ");

/** A sheltered canal garden, reflective water and petal trees beneath the glass roof. */
export function NookEvercoldView({ isDark }: { isDark: boolean }) {
  const p = evercoldPigments(isDark);
  const thread = (d: string, color: string, width = 1.3, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      width={width}
      shadow={p.ink}
      highlight={p.paper}
      relief={1.6}
      opacity={opacity}
    />
  );
  const reflection = (
    d: string,
    color: string,
    width = 1.15,
    opacity = 0.8,
  ) => (
    <NookThread
      d={d}
      color={color}
      width={width}
      shadow={p.waterDeep}
      highlight={mix(color, p.paper, 68)}
      relief={1.4}
      opacity={opacity}
      dasharray="4.2 1.15 6.3 1.05 3.1 1.2"
    />
  );
  return (
    <g
      className="nook-evercold-view"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <EvercoldPatch
        d="M60 279Q209 270 346 282V441H60Z"
        color={p.water}
        bounds={[58, 268, 290, 175]}
        grain="water"
        stitches={canalSilk}
        p={p}
        edge={0}
        quiet
      />
      <EvercoldMossBank d={leftBank} bounds={[58, 274, 159, 169]} p={p} />
      <EvercoldMossBank d={rightBank} bounds={[213, 278, 135, 165]} p={p} />
      <PetalTree x={222} y={279} scale={0.37} p={p} />
      <PetalTree x={119} y={275} scale={0.28} flip p={p} />
      <NookEvercoldCity isDark={isDark} />

      {/* Low clipped terraces establish the canal's curve, with wrapped pale edges. */}
      <EvercoldPatch
        d="M62 329Q110 317 163 329L186 349Q198 357 187 370L163 395H147L169 364 159 346Q111 335 63 344Z"
        color={p.path}
        bounds={[59, 315, 141, 83]}
        grain="stone"
        stitches={leftWalkSilk}
        p={p}
        edge={0.9}
      />
      {thread(
        "M62 330Q111 319 162 331L184 350Q194 357 184 368L160 392M62 344Q111 335 157 347L167 364 146 394",
        p.stoneLight,
        1.2,
      )}
      {thread(
        "M80 329l1 12m19-14v12m19-11-1 12m20-9-2 12m21-6-4 12M174 350l-8 8m17 13-10-6",
        p.stoneSide,
        1.05,
        0.85,
      )}
      <EvercoldPatch
        d="M346 326Q301 316 275 340L269 350 287 367 278 380 267 403 274 440H287L280 405 291 385 304 367 288 350Q308 333 347 342Z"
        color={p.path}
        bounds={[265, 314, 84, 129]}
        grain="stone"
        stitches={rightWalkSilk}
        p={p}
        edge={0.9}
      />
      {thread(
        "M345 328Q307 320 278 342L274 350 291 367 282 381M269 405l6 34",
        p.stoneLight,
        1.2,
      )}
      {thread(
        "M327 326l-2 12m-14-12-3 12m-12-9-7 12m-9 0 8 9M284 360l10-7m-7 28 8 5M273 414h11m-10 12h11",
        p.stoneSide,
        1.1,
        0.8,
      )}
      {thread(canalBinding, p.stoneLight, 1.8)}
      <NookThread
        d={canalBinding}
        color={p.trim}
        shadow={p.stoneSide}
        highlight={p.paper}
        width={0.7}
        dasharray=".55 3.8 .7 3.4"
        relief={1.3}
        opacity={0.85}
      />
      {thread(
        "M183 318l-2 2M187 335l-2 2M202 349l-2 2M210 363h3M198 387l3 2M177 412l-3 1M176 429h-3M236 333l2-2M260 353l2-2M258 377l-2-2M252 398l3-1M263 424l3-1",
        p.stoneSide,
        0.75,
        0.74,
      )}
      {reflection(
        "M188 327q8 9 13 13m7 35-9 12M243 338l14 12m-8 45 4 16",
        p.reflection,
        1.35,
        0.9,
      )}

      {/* Long faint reflections break into short horizontal seams at the waterline. */}
      {reflection(
        "M199 311q4 14 2 21m10 12 2 7m12 18-5 15m-9 9-6 13M231 340q15 25 5 41m-2 12 6 17m3 11 6 12",
        p.waterDeep,
        3.2,
        0.43,
      )}
      {reflection(
        "M192 317l2 12m20 23 3 7m4 8-4 13m-11 16-3 13m1 11 1 12M242 365l-2 14m-2 20 4 13",
        p.reflection,
        1.5,
        0.8,
      )}
      {reflection(
        "M222 354q5-1 12 0m-10 5q7 1 14 0m-9 5q5-1 12 0m-12 5q4 1 9 0m-10 5q5-.8 10 0M213 414q5-1 10 0m-11 6q6 1 12 0m-9 6q4-.7 8 0",
        p.canopy,
        1.15,
        0.55,
      )}
      {reflection(
        "M196 323q3-1 7 0m-5 4h6M225 392q4-1 9 0m-10 5q5 1 12 0M242 423q4-1 8 0m-7 4h6",
        p.amberLight,
        1,
        0.72,
      )}
      <NookThread
        d="M192 313q5-1 10 0M222 339q6 .7 12 0M226 381q6-1 13 0M189 409q7-1 15 0m16 5q7 1 14 0M217 437q9-1 19 0"
        color={p.reflection}
        shadow={p.waterDeep}
        highlight={p.paper}
        width={1.05}
        dasharray="3.2 1.15 5.3 1.1"
        relief={1.25}
        opacity={0.86}
      />

      <PetalTree x={68} y={214} scale={0.84} flip p={p} />
      <PetalTree x={285} y={221} scale={0.94} p={p} />

      {/* Moss, tiny flowers and warm garden orbs sit in pockets between the stone walks. */}
      <EvercoldMossBank
        d="M60 354q14-10 25-5l15-4 21 12-4 16-20 6-11 16-26 2Z"
        bounds={[58, 342, 66, 57]}
        p={p}
        foreground
      />
      <EvercoldMossBank
        d="M290 378q9-13 19-8l15-8 22 9v71h-46l5-31Z"
        bounds={[287, 358, 61, 86]}
        p={p}
        foreground
      />
      {thread(
        "M66 368q10-9 18-5m-13 10 15-2m18-11q5 5 9 5M302 398q10-10 21-8m-17 14 19-6m-12 19q9-5 16-3",
        p.mossLight,
        1.9,
      )}
      {thread(
        "M88 387q4-12 14-14m-9 10 13-4M318 381q7-7 16-5m-13 11 13-3",
        p.canopy,
        2.3,
      )}
      {thread(gardenKnots, p.amberLight, 0.72, 0.8)}
      <GardenFlowers x={91} y={362} scale={0.75} p={p} />
      <GardenFlowers x={139} y={339} scale={0.56} p={p} />
      <GardenFlowers x={324} y={365} scale={0.64} p={p} />
      <GardenFlowers x={304} y={409} scale={0.76} p={p} />
      <GardenLamp x={115} y={352} scale={0.66} p={p} />
      <GardenLamp x={302} y={374} scale={0.88} p={p} />
      {thread("M72 398q9-4 15-2M310 428l12-2", p.flower, 1.6, 0.85)}
    </g>
  );
}

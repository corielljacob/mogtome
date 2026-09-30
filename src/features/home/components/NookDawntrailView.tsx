import { useId } from "react";
import { DawntrailPatch } from "./NookDawntrailPatch";
import { NookTuliyollalCity } from "./NookTuliyollalCity";
import { NookThread } from "./NookThread";
import {
  dawntrailPigments,
  type DawntrailPigments,
} from "./nookDawntrailPigments";
import { threadVariation } from "./nookNeedlework";

const farJungle =
  "M248 299V280Q250 268 254 260Q257 254 261 258L266 246Q271 235 278 243L282 230Q286 219 292 224L298 231Q304 228 307 242L312 252 318 238Q325 229 331 239L335 242 341 232Q345 226 349 231V299Z";
const headland =
  "M59 268 68 253 81 250 91 234 107 242 115 258 135 264 169 276 195 294 188 319H59Z";
const coast =
  "M58 290 83 282 121 290 155 293 183 308 207 309 232 323 246 343Q220 359 196 359L169 372Q150 389 151 405L141 439H58Z";
const sand =
  "M59 318Q103 309 139 316L171 324 196 324 226 335 246 343Q223 359 196 359L169 372Q149 388 151 405L141 439H128L138 397Q141 379 161 364L190 351Q215 351 227 343L193 335 169 335 137 327Q101 319 59 330Z";

type Frond = { cx: number; cy: number; x: number; y: number };
const fronds: Frond[] = [
  { cx: -14, cy: -21, x: -30, y: -5 },
  { cx: -22, cy: -10, x: -37, y: 17 },
  { cx: -7, cy: -26, x: -18, y: -24 },
  { cx: 5, cy: -26, x: 13, y: -28 },
  { cx: 21, cy: -20, x: 35, y: -4 },
  { cx: 28, cy: -2, x: 35, y: 24 },
  { cx: 12, cy: 3, x: 10, y: 31 },
];
const n = (value: number) => value.toFixed(2);
const mix = (a: string, b: string, amount: number) =>
  `color-mix(in srgb, ${a} ${amount}%, ${b})`;

const jungleHills = [
  {
    d: "M247 299 251 276 254 262Q257 253 261 259L266 247Q271 235 277 243L283 256 285 299Z",
    cap: "M251 276 254 262Q257 253 261 259L266 247Q271 235 277 243L281 252 276 250 272 246 267 256 262 265 257 265Z",
    ridge: [
      [248, 280],
      [257, 258],
      [263, 260],
      [272, 241],
      [279, 247],
      [287, 264],
    ],
  },
  {
    d: "M265 299Q274 273 278 251L282 231Q286 219 292 224L298 231Q304 228 307 243L313 282 311 299Z",
    cap: "M278 251 282 231Q286 219 292 224L298 231Q304 228 307 243L305 251 300 240 295 239 290 231 286 235 283 250Z",
    ridge: [
      [265, 278],
      [279, 251],
      [285, 225],
      [291, 224],
      [298, 233],
      [305, 239],
      [313, 267],
    ],
  },
  {
    d: "M298 299 306 275 313 251 319 240Q325 230 331 239L335 242 342 232Q346 226 349 231V300Z",
    cap: "M310 263 314 251 319 240Q325 230 331 239L335 242 342 232Q346 226 349 231V240L344 238 337 251 330 248 325 242 320 247 316 262Z",
    ridge: [
      [298, 287],
      [314, 251],
      [325, 234],
      [334, 245],
      [344, 230],
      [351, 234],
    ],
  },
];
// Short silk courses fan from each real crest into its widening hillside.
// Canopy caps are separate soft pieces rather than one scalloped curtain.
const jungleFloss = jungleHills.map(({ ridge }, hill) => {
  const tones: string[][] = [[], [], []];
  const leaves: string[] = [];
  const left = ridge[0][0],
    right = ridge[ridge.length - 1][0];
  for (let col = 0; col <= Math.ceil((right - left) / 1.6); col++) {
    const x = left + col * 1.6;
    const found = ridge.findIndex(([rx]) => rx >= x);
    const edge = found < 0 ? ridge.length - 1 : found;
    const a = ridge[Math.max(0, edge - 1)],
      b = ridge[Math.max(1, edge)];
    const top = a[1] + (b[1] - a[1]) * Math.min(1, (x - a[0]) / (b[0] - a[0]));
    const lean = ((x - left) / (right - left) - 0.5) * 11;
    for (let row = 0; row < 11; row++) {
      const sy = top - 4 + row * 8.8 + (col % 3) * 2.85;
      if (sy > 304) break;
      const length = 8.1 + threadVariation(col * 13 + row, 1510 + hill) * 0.5;
      const start = x + ((sy - top) / (304 - top)) * lean;
      const dx = (length / (304 - top)) * lean;
      tones[(col + row) % 3].push(
        `M${n(start)} ${n(sy)}q${n(dx * 0.5 + 0.8)} ${n(length * 0.48)} ${n(dx)} ${n(length)}`,
      );
    }
    if (col % 2 === 0) {
      for (let leaf = 0; leaf < 3; leaf++) {
        const y = top + leaf * 3.1;
        leaves.push(`M${n(x - 0.6)} ${n(y)}q-1.7-1.5-1-3m1 3q2.6-1 2-3.1`);
      }
    }
  }
  return {
    tones: tones.map((paths) => paths.join(" ")),
    leaves: leaves.join(" "),
  };
});

function JungleHeadland({ p }: { p: DawntrailPigments }) {
  const id = `${useId().replace(/:/g, "")}-turali-jungle`;
  return (
    <g>
      <path d={farJungle} fill={p.distant} />
      {jungleHills.map(({ d, cap }, hill) => (
        <g key={hill}>
          <defs>
            <clipPath id={`${id}-${hill}`}>
              <path d={d} />
            </clipPath>
            <clipPath id={`${id}-${hill}-cap`}>
              <path d={cap} />
            </clipPath>
            <linearGradient
              id={`${id}-${hill}-pad`}
              x1=".1"
              y1=".2"
              x2=".92"
              y2=".52"
            >
              <stop stopColor={p.distant} />
              <stop offset=".35" stopColor={mix(p.distant, p.cliff, 60)} />
              <stop offset=".7" stopColor={p.cliff} />
              <stop offset="1" stopColor={p.cliffSide} />
            </linearGradient>
          </defs>
          <path
            d={d}
            fill={p.cliffSide}
            transform="translate(.55 1)"
            opacity=".4"
          />
          <path d={d} fill={`url(#${id}-${hill}-pad)`} />
          <g clipPath={`url(#${id}-${hill})`}>
            {jungleFloss[hill].tones.map((path, tone) => (
              <NookThread
                key={tone}
                d={path}
                color={
                  tone === 1
                    ? mix(p.cliff, p.distant, 60)
                    : `url(#${id}-${hill}-pad)`
                }
                shadow={p.cliffSide}
                highlight={p.distant}
                width={1.35}
                relief={1.4}
                opacity={0.85}
              />
            ))}
          </g>
          <NookThread
            d={d}
            color={p.cliff}
            shadow={p.cliffSide}
            highlight={p.distant}
            width={0.85}
            relief={1.4}
          />
          <path d={cap} fill={mix(p.cliff, p.foliage, 72)} />
          <g clipPath={`url(#${id}-${hill}-cap)`}>
            <NookThread
              d={jungleFloss[hill].leaves}
              color={mix(p.distant, p.foliageLight, 78)}
              shadow={p.cliffSide}
              highlight={p.distant}
              width={1.4}
              relief={1.45}
              opacity={0.76}
            />
          </g>
          <NookThread
            d={cap}
            color={p.cliff}
            shadow={p.cliffSide}
            highlight={p.distant}
            width={0.9}
            relief={1.3}
          />
        </g>
      ))}
    </g>
  );
}
const palmFloss = fronds.map(({ cx, cy, x, y }, frond) => {
  const leaves: string[][] = [[], []];
  const silk: string[][] = [[], []];
  for (let i = 0; i < 11; i++) {
    const t = 0.12 + i * 0.077;
    const px = 2 * (1 - t) * t * cx + t * t * x;
    const py = 2 * (1 - t) * t * cy + t * t * y;
    const dx = 2 * (1 - t) * cx + 2 * t * (x - cx);
    const dy = 2 * (1 - t) * cy + 2 * t * (y - cy);
    const length = Math.hypot(dx, dy);
    const tx = dx / length;
    const ty = dy / length;
    const leaf =
      (2.1 + Math.sin(t * Math.PI) * 5) *
      (1 + threadVariation(i, 1360 + frond) * 0.12);
    for (const side of [-1, 1]) {
      const ex = px + tx * leaf * 0.55 - ty * leaf * side;
      const ey = py + ty * leaf * 0.55 + tx * leaf * side + 1.2;
      const tone = side === -1 ? 0 : 1;
      const bendX = (px + ex) * 0.5 - tx;
      const bendY = (py + ey) * 0.5 - 1;
      const curl = 1.15 + Math.sin(t * Math.PI) * 0.55;
      leaves[tone].push(
        `M${n(px)} ${n(py)}Q${n(bendX - tx * curl)} ${n(bendY - ty * curl)} ${n(ex)} ${n(ey)}Q${n(bendX + tx * curl)} ${n(bendY + ty * curl)} ${n(px)} ${n(py)}Z`,
      );
      silk[tone].push(
        `M${n(px)} ${n(py)}Q${n(bendX)} ${n(bendY)} ${n(ex)} ${n(ey)}`,
      );
    }
  }
  return {
    vein: `M0 0Q${cx} ${cy} ${x} ${y}`,
    leaves: leaves.map((paths) => paths.join(" ")),
    silk: silk.map((paths) => paths.join(" ")),
  };
});

const trunk = "M-3 4Q4 38-9 86H-3Q9 38 3 4Z";
const trunkWraps = (() => {
  const bundles: string[][] = [[], [], []];
  for (let i = 0; i < 53; i++) {
    const t = i / 52;
    const u = 1 - t;
    const left = -3 * u * u + 8 * u * t - 9 * t * t;
    const right = 3 * u * u + 18 * u * t - 3 * t * t;
    const y = 4 * u * u + 76 * u * t + 86 * t * t;
    bundles[i % 3].push(
      `M${n(left - 0.4)} ${n(y)}Q${n((left + right) * 0.5)} ${n(y + 1.9)} ${n(right + 0.4)} ${n(y - 0.15)}`,
    );
  }
  return bundles.map((paths) => paths.join(" "));
})();

/** Padded leaflets fan around stitched ribs; trunk floss wraps its actual curve. */
function TuraliPalm({
  x,
  y,
  scale = 1,
  p,
}: {
  x: number;
  y: number;
  scale?: number;
  p: DawntrailPigments;
}) {
  const id = `${useId().replace(/:/g, "")}-turali-palm`;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <clipPath id={id}>
          <path d={trunk} />
        </clipPath>
        <linearGradient id={`${id}-bark`} x1="0" y1=".1" x2="1" y2=".2">
          <stop stopColor={mix(p.wood, p.ink, 68)} />
          <stop offset=".36" stopColor={p.path} />
          <stop offset=".65" stopColor={p.wood} />
          <stop offset="1" stopColor={mix(p.wood, p.ink, 64)} />
        </linearGradient>
        <radialGradient id={`${id}-leaves`} cx=".36" cy=".28" r=".84">
          <stop stopColor={p.foliageLight} />
          <stop offset=".48" stopColor={p.foliage} />
          <stop offset="1" stopColor={p.foliageShade} />
        </radialGradient>
      </defs>
      <path
        d={trunk}
        fill={p.ink}
        opacity=".43"
        transform="translate(.6 1.2)"
      />
      <path d={trunk} fill={`url(#${id}-bark)`} />
      <g clipPath={`url(#${id})`}>
        {trunkWraps.map((d, tone) => (
          <NookThread
            key={tone}
            d={d}
            color={tone === 1 ? p.path : `url(#${id}-bark)`}
            shadow={mix(p.wood, p.ink, 59)}
            highlight={p.path}
            width={tone === 1 ? 1.2 : 1.35}
            relief={1.85}
            opacity={tone === 1 ? 0.82 : 1}
          />
        ))}
      </g>
      <NookThread
        d={trunk}
        color={p.wood}
        shadow={p.ink}
        highlight={p.path}
        width={1.05}
        relief={1.7}
      />
      {palmFloss.map(({ vein, leaves, silk }, i) => (
        <g key={i}>
          <NookThread
            d={vein}
            color={p.foliageShade}
            shadow={p.ink}
            highlight={p.foliageLight}
            width={2.75}
            relief={1.8}
          />
          {leaves.map((d, side) => (
            <g key={side}>
              <path
                d={d}
                fill={p.foliageShade}
                opacity=".66"
                transform="translate(.4 .85)"
              />
              <path
                d={d}
                fill={side && i % 2 ? p.foliage : `url(#${id}-leaves)`}
                stroke={p.foliageShade}
                strokeWidth=".4"
              />
              <NookThread
                d={silk[side]}
                color={side ? p.foliageLight : p.foliage}
                shadow={p.foliageShade}
                highlight={side ? p.paper : p.foliageLight}
                width={side ? 1.25 : 1.45}
                relief={1.9}
                opacity={side ? 0.86 : 1}
              />
            </g>
          ))}
          <NookThread
            d={vein}
            color={p.foliageLight}
            shadow={p.foliageShade}
            highlight={p.paper}
            width={1.05}
            relief={1.7}
          />
        </g>
      ))}
      <NookThread
        d="M-2 5l1 2m5-3 1 3m-1-6h1"
        color={p.gold}
        shadow={p.wood}
        highlight={p.goldLight}
        width={3.7}
        relief={1.8}
      />
    </g>
  );
}

// Opposite edges of the beach ribbon, ordered along the shore's changing bend.
const shoreSections = [
  [58, 318, 58, 330],
  [100, 314, 100, 324],
  [139, 316, 137, 327],
  [171, 324, 169, 335],
  [196, 324, 193, 335],
  [227, 335, 211, 339],
  [246, 343, 227, 343],
  [222, 354, 213, 349],
  [196, 359, 190, 351],
  [169, 372, 161, 364],
  [154, 390, 141, 383],
  [151, 405, 138, 397],
  [141, 441, 128, 441],
];
const shoreFloss = (() => {
  const tones: string[][] = [[], [], []];
  shoreSections.slice(0, -1).forEach((a, section) => {
    const b = shoreSections[section + 1];
    const dx = (b[0] + b[2] - a[0] - a[2]) * 0.5;
    const dy = (b[1] + b[3] - a[1] - a[3]) * 0.5;
    const length = Math.hypot(dx, dy);
    const count = Math.ceil(length / 1.55);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const x1 = a[0] + (b[0] - a[0]) * t;
      const y1 = a[1] + (b[1] - a[1]) * t;
      const x2 = a[2] + (b[2] - a[2]) * t;
      const y2 = a[3] + (b[3] - a[3]) * t;
      tones[(section + i) % 3].push(
        `M${n(x1)} ${n(y1)}Q${n((x1 + x2) * 0.5 + (dx / length) * 1.35)} ${n((y1 + y2) * 0.5 + (dy / length) * 1.35)} ${n(x2)} ${n(y2)}`,
      );
    }
  });
  return tones.map((paths) => paths.join(" "));
})();

/** Short satin runs cross the beach's width and turn with its curved shore. */
function BeachRibbon({ p }: { p: DawntrailPigments }) {
  const id = `${useId().replace(/:/g, "")}-turali-shore`;
  const shade = mix(p.path, p.stoneSide, 65);
  const light = mix(p.path, p.paper, 48);
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={sand} />
        </clipPath>
        <linearGradient id={`${id}-pad`} x1="0" y1="0" x2=".6" y2="1">
          <stop stopColor={light} />
          <stop offset=".46" stopColor={p.path} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
      </defs>
      <path d={sand} fill={p.ink} opacity=".4" transform="translate(.5 1.1)" />
      <path d={sand} fill={`url(#${id}-pad)`} />
      <g clipPath={`url(#${id})`}>
        {shoreFloss.map((d, tone) => (
          <NookThread
            key={tone}
            d={d}
            color={tone === 1 ? light : `url(#${id}-pad)`}
            shadow={shade}
            highlight={light}
            width={tone === 1 ? 1.25 : 1.4}
            relief={1.8}
            opacity={tone === 1 ? 0.78 : 1}
          />
        ))}
      </g>
      <NookThread
        d={sand}
        color={p.path}
        shadow={shade}
        highlight={light}
        width={1.2}
        relief={1.8}
      />
      <NookThread
        d={sand}
        color={light}
        shadow={p.path}
        highlight={p.paper}
        width={0.75}
        dasharray=".65 2.5"
        opacity={0.7}
      />
    </g>
  );
}

const gardenLobe =
  "M-22-4Q-28-10-20-14Q-22-21-13-19Q-8-26-2-20Q6-24 11-18Q20-22 21-13Q29-9 23-2Q29 4 21 8Q22 17 13 15Q6 23 0 16Q-7 23-12 16Q-22 19-21 10Q-29 5-22-4Z";
const gardenLeaves = (() => {
  const leaves: string[][] = [[], [], []];
  const cores: string[] = [];
  for (let i = 0; i < 67; i++) {
    const angle = i * 2.39996;
    const r = Math.sqrt((i + 0.5) / 67);
    const x = Math.cos(angle) * 26 * r;
    const y = Math.sin(angle) * 22 * r;
    const direction = Math.atan2(y - 10, x) + threadVariation(i, 1462) * 0.35;
    const length = 4.3 + threadVariation(i, 1463) * 0.55;
    const dx = Math.cos(direction) * length;
    const dy = Math.sin(direction) * length;
    const sx = -Math.sin(direction) * 1.5;
    const sy = Math.cos(direction) * 1.5;
    leaves[i % 3].push(
      `M${n(x)} ${n(y)}Q${n(x + dx * 0.48 + sx)} ${n(y + dy * 0.48 + sy)} ${n(x + dx)} ${n(y + dy)}Q${n(x + dx * 0.48 - sx)} ${n(y + dy * 0.48 - sy)} ${n(x)} ${n(y)}Z`,
    );
    cores.push(
      `M${n(x)} ${n(y)}q${n(dx * 0.48)} ${n(dy * 0.48)} ${n(dx * 0.87)} ${n(dy * 0.87)}`,
    );
  }
  return {
    leaves: leaves.map((paths) => paths.join(" ")),
    cores: cores.join(" "),
  };
})();

/** Individual cotton lobes carry the same raised leaf bodies as Lakeland's trees. */
function CottonGarden({
  d,
  lobes,
  p,
}: {
  d: string;
  lobes: readonly (readonly [number, number, number])[];
  p: DawntrailPigments;
}) {
  const id = `${useId().replace(/:/g, "")}-turali-cotton`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
        <clipPath id={`${id}-lobe`}>
          <path d={gardenLobe} />
        </clipPath>
        <radialGradient id={`${id}-pad`} cx=".34" cy=".27" r=".85">
          <stop stopColor={p.foliageLight} />
          <stop offset=".48" stopColor={p.foliage} />
          <stop offset="1" stopColor={p.foliageShade} />
        </radialGradient>
      </defs>
      <path d={d} fill={p.ink} opacity=".4" transform="translate(.6 1.2)" />
      <path d={d} fill={p.foliageShade} />
      <g clipPath={`url(#${id})`}>
        {lobes.map(([x, y, scale], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${scale})`}>
            <path
              d={gardenLobe}
              fill={p.foliageShade}
              transform="translate(.6 1.5)"
            />
            <path d={gardenLobe} fill={`url(#${id}-pad)`} />
            <g clipPath={`url(#${id}-lobe)`}>
              {gardenLeaves.leaves.map((path, tone) => (
                <path
                  key={tone}
                  d={path}
                  fill={
                    tone === 1
                      ? p.foliageLight
                      : tone === 2
                        ? mix(p.foliage, p.foliageShade, 72)
                        : p.foliage
                  }
                  stroke={p.foliageShade}
                  strokeWidth=".6"
                  opacity={tone === 1 ? 0.75 : 0.9}
                />
              ))}
              <NookThread
                d={gardenLeaves.cores}
                color={p.foliageLight}
                shadow={p.foliageShade}
                highlight={p.paper}
                width={0.85}
                relief={1.7}
                opacity={0.8}
              />
            </g>
            <NookThread
              d={gardenLobe}
              color={p.foliage}
              shadow={p.foliageShade}
              highlight={p.foliageLight}
              width={1.25}
              relief={1.8}
            />
          </g>
        ))}
      </g>
      <NookThread
        d={d}
        color={p.foliageShade}
        shadow={p.ink}
        highlight={p.foliage}
        width={1.05}
        relief={1.65}
      />
    </g>
  );
}

const flowerPetals = [
  [78, 343],
  [101, 353],
  [118, 344],
]
  .map(([x, y], flower) =>
    Array.from({ length: 5 }, (_, petal) => {
      const angle = petal * Math.PI * 0.4 + flower * 0.4;
      const dx = Math.cos(angle) * 3.6;
      const dy = Math.sin(angle) * 3.6;
      const sx = -Math.sin(angle) * 1.45;
      const sy = Math.cos(angle) * 1.45;
      return `M${x} ${y}Q${n(x + dx * 0.7 + sx)} ${n(y + dy * 0.7 + sy)} ${n(x + dx)} ${n(y + dy)}Q${n(x + dx * 0.7 - sx)} ${n(y + dy * 0.7 - sy)} ${x} ${y}Z`;
    }).join(" "),
  )
  .join(" ");

/** A warm Turali harbor: jungle cliffs, rising palace terraces and palm-fringed water. */
export function NookDawntrailView({ isDark }: { isDark: boolean }) {
  const p = dawntrailPigments(isDark);
  const thread = (d: string, color: string, width = 1.4, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      shadow={p.ink}
      highlight={p.paper}
      width={width}
      opacity={opacity}
      relief={1.6}
    />
  );
  return (
    <g
      className="nook-dawntrail-view"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <DawntrailPatch
        d="M60 277Q208 271 346 278V440H60Z"
        color={p.sea}
        bounds={[58, 271, 291, 171]}
        grain="water"
        p={p}
        edge={0}
        quiet
      />
      <JungleHeadland p={p} />
      {thread("M252 291q21-4 38 0m11-2 35-3", p.foam, 1, 0.55)}
      <DawntrailPatch
        d={headland}
        color={p.cliff}
        bounds={[57, 230, 141, 92]}
        grain="rock"
        p={p}
        edge={0.9}
        quiet
      />
      <DawntrailPatch
        d={coast}
        color={p.cliffSide}
        bounds={[56, 280, 193, 162]}
        grain="cotton"
        p={p}
        edge={1.1}
        slant={1}
      />
      <DawntrailPatch
        d="M60 326Q102 319 130 330L163 339 180 340 191 351 166 365 144 390 134 440H60Z"
        color={p.foliage}
        bounds={[58, 316, 135, 126]}
        grain="turf"
        p={p}
        edge={0.8}
      />
      <BeachRibbon p={p} />
      {thread(
        "M243 346Q220 362 196 362L173 374Q153 390 154 405L145 440",
        p.foam,
        1.9,
        0.95,
      )}
      {thread("M233 354l-15 7m-38 14-8 6m-13 29-5 19", p.foam, 1.15, 0.7)}

      <NookTuliyollalCity isDark={isDark} />
      <TuraliPalm x={81} y={285} scale={0.64} p={p} />
      <TuraliPalm x={226} y={300} scale={0.43} p={p} />

      {/* Deep green garden pockets soften the cut stone without obscuring the stairs. */}
      <CottonGarden
        d="M60 337q9-11 16-5 9-12 16-2 9-4 14 4 13-1 15 10l11 9-8 17-14 5-23-4-27 6Z"
        lobes={[
          [74, 341, 0.85],
          [108, 345, 0.83],
          [88, 363, 1],
        ]}
        p={p}
      />
      <CottonGarden
        d="M58 376q12-7 20 0 8-5 15 2l8 12-9 10-17-2-17 7Z"
        lobes={[
          [67, 389, 0.72],
          [86, 387, 0.53],
        ]}
        p={p}
      />
      <CottonGarden
        d="M91 432q-7-8 1-15 5-8 13-4l9-4 10 9-3 22H88Z"
        lobes={[
          [111, 427, 0.65],
          [94, 435, 0.58],
        ]}
        p={p}
      />
      <path
        d={flowerPetals}
        fill={p.terracottaSide}
        opacity=".7"
        transform="translate(.45 .8)"
      />
      <path d={flowerPetals} fill={p.flower} />
      <NookThread
        d={flowerPetals}
        color={p.flower}
        shadow={p.terracottaSide}
        highlight={p.paper}
        width={1.45}
        relief={1.85}
      />
      {thread(
        "M77.3 343q-.4-1.4 1.3-.9q1.1 1.5-1.3.9M100.3 353q-.4-1.4 1.3-.9q1.1 1.5-1.3.9M117.3 344q-.4-1.4 1.3-.9q1.1 1.5-1.3.9",
        p.goldLight,
        1.3,
      )}

      {/* A small outrigger and low mooring piles establish the scale of the bay. */}
      <DawntrailPatch
        d="M267 346Q280 351 297 346L291 352Q277 356 270 351Z"
        color={p.wood}
        bounds={[265, 344, 35, 13]}
        grain="binding"
        p={p}
        edge={0.85}
      />
      {thread(
        "M271 347q12 3 23 0M275 353l-2 6m16-7 1 6m-20 0q12 4 24-1",
        p.path,
        1.6,
      )}
      <NookThread
        d="M272 352l3 1M273 355l2 .5M287 352l3-.5M288 355h3"
        color={p.goldLight}
        shadow={p.wood}
        highlight={p.paper}
        width={0.9}
        dasharray=".6 .85"
        relief={1.65}
      />
      {thread("M289 346l3-12", p.wood, 1.6)}
      {thread("M287 337l8 1", p.gold, 1.8)}
      {thread("M299 355l17-1M262 363l23 1", p.foam, 1, 0.6)}

      <CottonGarden
        d="M302 342q15-11 25-5l20-2v107h-46q14-27 10-49l-9-24Z"
        lobes={[
          [327, 353, 0.95],
          [326, 383, 1],
          [326, 419, 1.2],
        ]}
        p={p}
      />
      <TuraliPalm x={309} y={279} scale={0.93} p={p} />

      {/* Short, widely spaced highlights leave the water calm at window scale. */}
      {thread(
        "M247 309q9-1 19 0m13 9q8-1 18-1M253 336q5-.8 11 0M230 378q10-2 20-1m18 8q11-2 23-1M183 403q9-1 19-1m15 13q10-2 21-2M269 411q9-1 18-1M242 433q14-2 29-2",
        p.foam,
        1.3,
        0.72,
      )}
      {thread(
        "M254 326l18-1M260 395l22 1M198 426l16-1M279 434l13-1",
        p.seaDeep,
        1.9,
        0.7,
      )}
    </g>
  );
}

import { useId, type ReactNode } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";
import "./nook-evercold-window.css";

const n = (value: number) => value.toFixed(2);

// Short, staggered courses give the sheltered light the same cloth body as
// the other nook skies. The opening and glazing have their own stitch flow.
const cloth = (() => {
  const tones: string[][] = [[], [], []];
  const entries: string[] = [];
  for (let row = 0; row < 127; row++) {
    const y = 39 + row * 3.2;
    let x = 43 + threadVariation(row, 1801) * 17;
    for (let col = 0; x < 354; col++) {
      const index = row * 24 + col;
      const length = 19 + threadVariation(index, 1802) * 6.4;
      const start = y + Math.sin(x / 83 + row / 28) * 3.2;
      const end = y + Math.sin((x + length) / 83 + row / 28) * 3.2;
      const tone = Math.min(
        2,
        Math.floor((threadVariation(index, 1803) + 1) * 1.5),
      );
      tones[tone].push(
        `M${n(x)} ${n(start)}Q${n(x + length * 0.48)} ${n((start + end) / 2 - 0.7)} ${n(x + length)} ${n(end)}`,
      );
      if (threadVariation(index, 1804) > 0.35) {
        entries.push(`M${n(x - 0.1)} ${n(start + 0.5)}l.22 .18`);
      }
      x += length + 1.4 + threadVariation(index, 1805) * 0.55;
    }
  }
  return {
    tones: tones.map((paths) => paths.join(" ")),
    entries: entries.join(" "),
  };
})();

const opening =
  "M186 45 164 100 150 162 186 279 251 281 256 159 231 102 220 45Z";
const pearlSilk = (() => {
  const tones: string[][] = [[], [], []];
  const entries: string[] = [];
  // Slightly fanning satin follows the tall pearl opening instead of laying
  // another translucent gradient over the underlying embroidery.
  const courseX = (x: number, y: number) =>
    204 + (x - 204) * (0.62 + y / 610) + Math.sin(y / 55 + x / 47) * 1.4;
  for (let col = 0; col < 58; col++) {
    const x = 132 + col * 2.55;
    let y = 29 + threadVariation(col, 1821) * 16;
    for (let row = 0; y < 292; row++) {
      const index = col * 23 + row;
      const length = 15 + threadVariation(index, 1822) * 5.5;
      const sx = courseX(x, y);
      const ex = courseX(x, y + length);
      const tone = Math.min(
        2,
        Math.floor((threadVariation(index, 1823) + 1) * 1.5),
      );
      tones[tone].push(
        `M${n(sx)} ${n(y)}Q${n((sx + ex) / 2 - 0.65)} ${n(y + length * 0.48)} ${n(ex)} ${n(y + length)}`,
      );
      if (threadVariation(index, 1824) > 0.5)
        entries.push(`M${n(sx + 0.45)} ${n(y - 0.1)}l.17 .3`);
      y += length + 1.45 + threadVariation(index, 1825) * 0.45;
    }
  }
  return {
    tones: tones.map((paths) => paths.join(" ")),
    entries: entries.join(" "),
  };
})();

const floss = [
  ["cool", "#71989f", 91],
  ["base", "#d1dbd6", 95],
  ["light", "#c8c4dc", 89],
  ["shadow", "#314d63", 77],
  ["fiber", "#f5f2df", 73],
] as const;
const pearlFloss = [
  ["pearl", "#e2e6e7"],
  ["lilac", "#d9d9e5"],
  ["silver", "#e0e8e0"],
  ["shadow", "#bdc7cf"],
  ["fiber", "#f0f1e7"],
] as const;

type Point = readonly [number, number];
type Curve = readonly [Point, Point, Point];
const pointOn = ([a, b, c]: Curve, t: number): Point => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * b[0] + t ** 2 * c[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * b[1] + t ** 2 * c[1],
];
const curvePath = (curves: readonly Curve[]) =>
  curves
    .map(([a, b, c]) => `M${a.join(" ")}Q${b.join(" ")} ${c.join(" ")}`)
    .join(" ");
const supports: readonly Curve[] = [
  [
    [63, 55],
    [106, 104],
    [98, 177],
  ],
  [
    [98, 177],
    [89.5, 228],
    [81, 279],
  ],
  [
    [106, 49],
    [133, 105],
    [124, 164],
  ],
  [
    [124, 164],
    [117, 214.5],
    [110, 265],
  ],
  [
    [145, 43],
    [160, 84],
    [151, 132],
  ],
  [
    [151, 132],
    [143, 194],
    [135, 256],
  ],
  [
    [263, 43],
    [249, 94],
    [262, 141],
  ],
  [
    [262, 141],
    [272.5, 200.5],
    [283, 260],
  ],
  [
    [300, 59],
    [283, 120],
    [299, 182],
  ],
  [
    [299, 182],
    [307.5, 229.5],
    [316, 277],
  ],
];
const crown: readonly Curve[] = [
  [
    [61, 84],
    [111, 35],
    [163, 56],
  ],
  [
    [244, 54],
    [298, 42],
    [341, 105],
  ],
];
const sills: readonly Curve[] = [
  [
    [62, 281],
    [103, 259],
    [138, 255],
  ],
  [
    [280, 259],
    [313, 269],
    [344, 284],
  ],
];
const braces = [
  [0, 0.64, 2, 0.57],
  [2, 0.44, 4, 0.56],
  [0, 0.92, 2, 0.92],
  [6, 0.62, 8, 0.42],
  [6, 0.95, 8, 0.74],
].map(([left, lt, right, rt]): Curve => {
  const a = pointOn(supports[left], lt);
  const c = pointOn(supports[right], rt);
  return [a, [(a[0] + c[0]) / 2, Math.min(a[1], c[1]) - 9], c];
});

// Crosswise satin wraps the curved wooden ribs. Curve tangents determine the
// normal, so the stitches turn around the arch instead of floating across it.
function wrappedFloss(curves: readonly Curve[], width: number, seed: number) {
  const tones: string[][] = [[], [], []];
  const entries: string[] = [];
  curves.forEach((curve, curveIndex) => {
    let previous = pointOn(curve, 0);
    let distance = 0;
    let stitch = 0;
    for (let sample = 1; sample < 181; sample++) {
      const t = sample / 181;
      const p = pointOn(curve, t);
      distance += Math.hypot(p[0] - previous[0], p[1] - previous[1]);
      previous = p;
      const index = curveIndex * 130 + stitch;
      if (distance < 1.8 + threadVariation(index, seed) * 0.2) continue;
      distance = 0;
      const [a, b, c] = curve;
      const dx = 2 * ((1 - t) * (b[0] - a[0]) + t * (c[0] - b[0]));
      const dy = 2 * ((1 - t) * (b[1] - a[1]) + t * (c[1] - b[1]));
      const length = Math.hypot(dx, dy);
      const tx = dx / length,
        ty = dy / length;
      const nx = -ty,
        ny = tx;
      const half = width / 2 - 0.45 + threadVariation(index, seed + 1) * 0.25;
      const sx = p[0] - nx * half - tx * 0.35,
        sy = p[1] - ny * half - ty * 0.35;
      const ex = p[0] + nx * half + tx * 0.35,
        ey = p[1] + ny * half + ty * 0.35;
      tones[stitch % 3].push(
        `M${n(sx)} ${n(sy)}Q${n(p[0] + tx * 0.8)} ${n(p[1] + ty * 0.8)} ${n(ex)} ${n(ey)}`,
      );
      if (stitch % 5 === 0)
        entries.push(`M${n(sx)} ${n(sy)}l${n(nx * 0.22)} ${n(ny * 0.22)}`);
      stitch++;
    }
  });
  return {
    tones: tones.map((paths) => paths.join(" ")),
    entries: entries.join(" "),
  };
}
const supportStitches = wrappedFloss([...supports, ...sills], 7, 1841);
const crownStitches = wrappedFloss(crown, 14, 1851);
const panes = [
  "M65 92Q79 61 94 54L104 172 87 275 62 282Z",
  "M108 58Q120 45 135 40L143 135 127 252 103 265 115 164Z",
  "M276 45Q291 54 302 72L294 173 309 269 285 258 270 139Z",
  "M313 84Q331 103 343 130L346 283 327 277 304 182Z",
];
const paneBounds = [
  [59, 51, 48, 235],
  [100, 38, 46, 230],
  [267, 42, 45, 230],
  [301, 81, 48, 206],
];
const paneSilk = paneBounds.map(([x, y, w, h], pane) => {
  const tones: string[][] = [[], [], []];
  // Short diagonal silk bows with the convex pane. Each piece has its own
  // cadence; the lace is a separate raised layer, not the glass's texture.
  for (let row = 0; row < Math.ceil((h + w) / 1.65); row++) {
    const sy = y - w * 0.5 + row * 1.65;
    let sx = x - 13 + threadVariation(row, 1961 + pane) * 5;
    for (let col = 0; sx < x + w + 4; col++) {
      const index = row * 9 + col;
      const length = 11 + threadVariation(index, 1971 + pane) * 2.8;
      const bend = (at: number) =>
        sy + (at - x) * 0.39 - Math.sin(((at - x) / w) * Math.PI) * 1.5;
      tones[(row + col + pane) % 3].push(
        `M${n(sx)} ${n(bend(sx))}Q${n(sx + length * 0.48)} ${n(bend(sx + length * 0.48) - 0.35)} ${n(sx + length)} ${n(bend(sx + length))}`,
      );
      sx += length + 0.9 + threadVariation(index, 1981 + pane) * 0.15;
    }
  }
  return tones.map((paths) => paths.join(" "));
});

function GlassPane({ index }: { index: number }) {
  const id = `${useId().replace(/:/g, "")}-ec-pane`;
  const d = panes[index];
  const [x, y, w, h] = paneBounds[index];
  const base = "color-mix(in srgb, var(--scene-glass) 76%, #a0c1c7)";
  const shade = "color-mix(in srgb, var(--scene-glass) 65%, #365d76)";
  const light = "color-mix(in srgb, var(--scene-glass) 56%, #dbe7df)";
  const padding = `url(#${id}-padding)`;
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
          y1={y + h * 0.12}
          x2={x + w}
          y2={y + h * 0.17}
        >
          <stop stopColor={shade} />
          <stop offset=".2" stopColor={base} />
          <stop offset=".44" stopColor={light} />
          <stop offset=".7" stopColor={base} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
      </defs>
      <path d={d} fill={shade} transform="translate(.4 .7)" opacity=".14" />
      <path d={d} fill={padding} opacity=".54" />
      <g clipPath={`url(#${id})`}>
        {paneSilk[index].map((course, tone) => (
          <NookThread
            key={tone}
            d={course}
            color={tone === 1 ? base : padding}
            shadow={shade}
            highlight={light}
            width={1.12 + tone * 0.05}
            relief={1.35}
            opacity={tone === 1 ? 0.46 : 0.55}
          />
        ))}
      </g>
      <NookThread
        d={d}
        color={base}
        shadow={shade}
        highlight={light}
        width={1.2}
        relief={1.55}
        opacity={0.75}
      />
      <NookThread
        d={d}
        color={light}
        shadow={base}
        highlight="#e7ede1"
        width={0.65}
        dasharray=".55 2.6 .7 2.2"
        opacity={0.65}
      />
    </g>
  );
}
const glazing = Array.from({ length: 22 }, (_, i) => {
  const x = 64 + i * 13.5;
  return `M${x} 68q-10 28 0 54t0 55t0 56t0 56`;
}).join(" ");
const glassLace = (() => {
  const diamonds: string[] = [];
  const knots: string[] = [];
  for (let col = 0; col < 22; col++) {
    const x = 64 + col * 13.5;
    for (let row = 0; row < 8; row++) {
      const y = 76 + row * 27.5 + (col % 2) * 13.75;
      diamonds.push(`M${x} ${y}q-5.4 7.4 0 14.8q5.4-7.4 0-14.8Z`);
      knots.push(`M${x - 0.8} ${y + 18.5}q1.4-1.4 1.6.2q-.5 1.5-1.6-.2`);
    }
  }
  return { diamonds: diamonds.join(" "), knots: knots.join(" ") };
})();

/** Sheltered blue light, ribbed glass and a pale opening above the garden city. */
export function NookEvercoldSkyEmbroidery({
  dusk = false,
  children,
}: {
  dusk?: boolean;
  children?: ReactNode;
}) {
  const id = `${useId().replace(/:/g, "")}-evercold-glass`;
  const colors = dusk
    ? ["#72788f", "#95a8b0", "#9dbcb9"]
    : ["var(--scene-sky)", "var(--scene-sky-mid)", "var(--scene-horizon)"];
  const paint = (name: string) => `url(#${id}-${name})`;
  return (
    <svg
      className="nook-sky-embroidery nook-ec-vault"
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
            x1="200"
            y1="48"
            x2="200"
            y2="330"
            gradientUnits="userSpaceOnUse"
          >
            {colors.map((color, j) => (
              <stop
                key={j}
                offset={j / 2}
                stopColor={`color-mix(in srgb, ${color} ${amount}%, ${tint})`}
              />
            ))}
          </linearGradient>
        ))}
        {pearlFloss.map(([name, tint]) => (
          <linearGradient
            key={name}
            id={`${id}-opening-${name}`}
            x1="150"
            y1="0"
            x2="256"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={`color-mix(in srgb, ${colors[1]} 84%, ${tint})`} />
            <stop
              offset=".5"
              stopColor={`color-mix(in srgb, ${colors[2]} ${dusk ? 48 : 34}%, ${tint})`}
            />
            <stop
              offset="1"
              stopColor={`color-mix(in srgb, ${colors[1]} 84%, ${tint})`}
            />
          </linearGradient>
        ))}
        <linearGradient
          id={`${id}-opening-fade`}
          x1="150"
          y1="0"
          x2="256"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset=".2" stopColor="white" stopOpacity=".25" />
          <stop offset=".46" stopColor="white" stopOpacity=".8" />
          <stop offset=".62" stopColor="white" stopOpacity=".72" />
          <stop offset=".85" stopColor="white" stopOpacity=".2" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask
          id={`${id}-opening-mask`}
          maskUnits="userSpaceOnUse"
          x="140"
          y="40"
          width="125"
          height="245"
        >
          <path d={opening} fill={paint("opening-fade")} />
        </mask>
        <clipPath id={`${id}-opening`}>
          <path d={opening} />
        </clipPath>
        <clipPath id={`${id}-panes`}>
          {panes.map((d) => (
            <path key={d} d={d} />
          ))}
        </clipPath>
      </defs>
      <path d="M60 48H343V440H60Z" fill={`url(#${id}-base)`} />
      {cloth.tones.map((d, i) => (
        <NookThread
          key={i}
          d={d}
          color={paint(floss[i][0])}
          shadow={paint("shadow")}
          highlight={paint("fiber")}
          width={1.82 + i * 0.08}
          relief={1.22}
          opacity={0.84}
        />
      ))}
      <path
        d={cloth.entries}
        stroke={paint("shadow")}
        strokeWidth=".6"
        strokeLinecap="round"
        opacity=".34"
      />
      <g clipPath={`url(#${id}-opening)`} mask={`url(#${id}-opening-mask)`}>
        <path d={opening} fill={paint("opening-pearl")} opacity=".7" />
        {pearlSilk.tones.map((d, i) => (
          <NookThread
            key={i}
            d={d}
            color={paint(`opening-${pearlFloss[i][0]}`)}
            shadow={paint("opening-shadow")}
            highlight={paint("opening-fiber")}
            width={1.5 + i * 0.08}
            relief={1.05}
            opacity={0.7}
          />
        ))}
        <path
          d={pearlSilk.entries}
          stroke={paint("opening-shadow")}
          strokeWidth=".55"
          strokeLinecap="round"
          opacity=".24"
        />
      </g>
      {/* Weather is seen through the glazing, beneath its lace and curved ribs. */}
      {children}
      {panes.map((d, index) => (
        <GlassPane key={d} index={index} />
      ))}
      <g clipPath={`url(#${id}-panes)`}>
        <NookThread
          d={glassLace.diamonds}
          color="#81aeb8"
          shadow="#416c7e"
          highlight="#d7e9e0"
          width={0.75}
          opacity={0.72}
          relief={1.4}
        />
        <NookThread
          d={glazing}
          color="#bddde0"
          shadow="#597f8f"
          highlight="#e5f0e7"
          width={1.2}
          opacity={0.7}
          relief={1.15}
        />
        <NookThread
          d={glassLace.knots}
          color="#d0e4de"
          shadow="#587e8b"
          highlight="#f1f1dd"
          width={0.8}
          opacity={0.8}
          relief={1.6}
        />
        <NookThread
          d="M56 110 342 172M55 153 343 216M63 194 339 251"
          color="#9ebdc3"
          shadow="#426877"
          highlight="#e3e9dc"
          width={2.6}
          opacity={0.6}
        />
      </g>
      {/* Layered scalloped vaults anchor the glass ribs into the upper arcade. */}
      <NookThread
        d={curvePath(crown)}
        color="#56777b"
        shadow="#2a4954"
        highlight="#91afa5"
        width={14}
        relief={1.7}
        opacity={0.87}
      />
      {crownStitches.tones.map((d, i) => (
        <NookThread
          key={i}
          d={d}
          color={["#7b9b8f", "#668a81", "#91aa98"][i]}
          shadow="#294852"
          highlight="#c6d5b9"
          width={1.03}
          relief={1.55}
          opacity={0.9}
        />
      ))}
      <path
        d={crownStitches.entries}
        stroke="#2d4e56"
        strokeWidth=".66"
        strokeLinecap="round"
        opacity=".5"
      />
      <NookThread
        d="M64 88Q84 60 105 71Q126 46 149 63M258 59Q280 48 299 75Q319 73 341 107"
        color="#7e9b94"
        shadow="#355661"
        highlight="#becfbc"
        width={3.3}
        relief={1.8}
      />
      <NookThread
        d="M62 79Q111 32 164 51M243 49Q297 36 342 99"
        color="#b0c5b9"
        shadow="#4f7277"
        highlight="#e0e5cf"
        width={1.4}
        dasharray=".8 2.4"
        opacity={0.78}
        relief={1.6}
      />
      {/* Curved supports remain at the edges, leaving the central spire visible. */}
      <NookThread
        d={curvePath([...supports, ...sills])}
        color="#436566"
        shadow="#273f47"
        highlight="#789894"
        width={7}
        relief={1.4}
        opacity={0.9}
      />
      {supportStitches.tones.map((d, i) => (
        <NookThread
          key={i}
          d={d}
          color={["#6c8d87", "#527577", "#8aa496"][i]}
          shadow="#2b434d"
          highlight="#c3d1b8"
          width={0.91 + i * 0.06}
          relief={1.5}
          opacity={0.92}
        />
      ))}
      <path
        d={supportStitches.entries}
        stroke="#283f47"
        strokeWidth=".6"
        strokeLinecap="round"
        opacity=".55"
      />
      <NookThread
        d="M67 61Q106 111 95 176L78 276M112 53Q134 105 127 155L113 262M298 63Q286 126 302 180L319 274M70 67Q121 43 158 54M254 56Q300 53 333 99M62 277Q102 255 136 251M282 255Q314 265 344 280"
        color="#799691"
        shadow="#3d6266"
        highlight="#b5c7b7"
        width={1.4}
        opacity={0.6}
      />
      <NookThread
        d="M99 118Q106 149 99 182L84 268M130 103Q134 131 127 168L113 257M270 108Q268 129 277 162L297 251M300 139Q296 160 305 191L320 267"
        color="#b2c7bb"
        shadow="#3d6266"
        highlight="#e5e7cf"
        width={0.85}
        dasharray="1 3.1"
        opacity={0.7}
        relief={1.8}
      />
      <NookThread
        d={curvePath(braces)}
        color="#72999d"
        shadow="#426673"
        highlight="#c2d5cc"
        width={2.4}
        relief={1.5}
        opacity={0.82}
      />
    </svg>
  );
}

/** Tiny suspended fibers and reflected lamplight keep the canal quietly alive. */
export function NookEvercoldAtmosphere() {
  return (
    <svg
      className="nook-cycle-surface nook-ec-atmosphere"
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {[
        [126, 172],
        [221, 141],
        [253, 245],
        [292, 281],
        [105, 278],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className={`nook-ec-mote nook-ec-mote--${i % 3}`}>
            <NookThread
              d="M-.5 0h1"
              color="#dddde2"
              shadow="#3c6069"
              highlight="#fff1dc"
              width={1.2}
            />
          </g>
        </g>
      ))}
      {[
        [244, 351],
        [271, 385],
        [229, 420],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className={`nook-ec-ripple nook-ec-mote--${i}`}>
            <NookThread
              d="M-6 0h8m2 0h3M-2 3h4"
              color="#dacfae"
              shadow="#345d6c"
              highlight="#ece8d2"
              width={0.9}
              opacity={0.75}
            />
          </g>
        </g>
      ))}
    </svg>
  );
}

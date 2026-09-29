import { useId, type CSSProperties } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";
import "./nook-arr-window.css";

const silhouette =
  "M201 80 239 124 258 177 239 258 201 334 154 260 136 190 163 127Z";
const facets = [
  {
    d: "M201 80 181 168 136 190 163 127Z",
    color: "#8dc9d1",
    shine: "#d5efe8",
    shade: "#5b889e",
    bounds: [136, 201, 80, 190],
    slope: -0.3,
    bow: -4,
  },
  {
    d: "M201 80 239 124 258 177 211 183Z",
    color: "#5ba4be",
    shine: "#b9e3e6",
    shade: "#376c91",
    bounds: [201, 258, 80, 183],
    slope: 0.46,
    bow: 6,
  },
  {
    d: "M181 168 201 334 154 260 136 190Z",
    color: "#5593ad",
    shine: "#a5d6de",
    shade: "#355d80",
    bounds: [136, 201, 168, 334],
    slope: 0.34,
    bow: -6,
  },
  {
    d: "M211 183 258 177 239 258 201 334Z",
    color: "#357396",
    shine: "#80bbce",
    shade: "#294867",
    bounds: [201, 258, 177, 334],
    slope: -0.29,
    bow: 6,
  },
  {
    d: "M201 80 211 183 201 334 181 168Z",
    color: "#bdd8df",
    shine: "#edf3e9",
    shade: "#7ca7bf",
    bounds: [181, 211, 80, 334],
    slope: 0.08,
    bow: 2.6,
  },
];

// Long-and-short silk bows over each padded facet like the vase and moogle cotton.
function facetStitches(facet: (typeof facets)[number], seed: number) {
  const [left, right, top, bottom] = facet.bounds;
  const rows = Math.ceil((bottom - top + 25) / 11.5);
  const bundles: string[][] = [[], [], []];
  const holes: string[] = [];
  const at = (x: number, y: number) =>
    x +
    (y - (top + bottom) / 2) * facet.slope +
    Math.sin(((y - top) / (bottom - top)) * Math.PI) * facet.bow;
  for (
    let column = 0;
    column < Math.ceil((right - left + 130) / 2.35);
    column++
  ) {
    const base = left - 65 + column * 2.35;
    for (let row = 0; row < rows; row++) {
      const index = column * rows + row;
      const y =
        top -
        13 +
        row * 11.5 +
        (column % 2) * 5.5 +
        threadVariation(index, seed) * 1.1;
      const length = 9.9 + threadVariation(index, seed + 1) * 1.3;
      const x = at(base, y) + threadVariation(index, seed + 2) * 0.35;
      const end = at(base, y + length);
      const bend =
        at(base, y + length * 0.48) + threadVariation(index, seed + 3) * 0.5;
      const tone = Math.min(
        2,
        Math.floor((threadVariation(index, seed + 4) + 1) * 1.5),
      );
      bundles[tone].push(
        `M${x.toFixed(2)} ${y.toFixed(2)}Q${bend.toFixed(2)} ${(y + length * 0.48).toFixed(2)} ${end.toFixed(2)} ${(y + length).toFixed(2)}`,
      );
      if (index % 5 === 0)
        holes.push(`M${x.toFixed(2)} ${(y + 0.35).toFixed(2)}l.3 .1`);
    }
  }
  return {
    strands: bundles.map((bundle) => bundle.join(" ")),
    holes: holes.join(" "),
  };
}
const stitchedFacets = facets.map((facet, index) => ({
  ...facet,
  stitches: facetStitches(facet, 401 + index * 7),
}));

const indigoCourses = (() => {
  const bundles: string[][] = [[], [], []];
  const height = (x: number, y: number) =>
    y + Math.sin((x - 70) / 95 + y / 119) * 5.5 + (x - 200) * 0.045;
  for (let row = 0; row < 143; row++) {
    let x = 38 + threadVariation(row, 451) * 17;
    const y = 38 + row * 2.85;
    for (let column = 0; x < 348; column++) {
      const index = row * 24 + column;
      const length = 23 + threadVariation(index, 452) * 7;
      const sy = height(x, y) + threadVariation(index, 453) * 0.4;
      const ey = height(x + length, y) + threadVariation(index, 454) * 0.3;
      bundles[index % 3].push(
        `M${x.toFixed(2)} ${sy.toFixed(2)}Q${(x + length * 0.5).toFixed(2)} ${(height(x + length * 0.5, y) - 0.55).toFixed(2)} ${(x + length).toFixed(2)} ${ey.toFixed(2)}`,
      );
      x += length + 1.4 + threadVariation(index, 455) * 0.55;
    }
  }
  return bundles.map((bundle) => bundle.join(" "));
})();

function seamWraps(points: number[][], pitch: number, reach: number) {
  return points
    .slice(1)
    .map(([x2, y2], index) => {
      const [x1, y1] = points[index];
      const length = Math.hypot(x2 - x1, y2 - y1);
      const nx = ((y1 - y2) / length) * reach;
      const ny = ((x2 - x1) / length) * reach;
      return Array.from({ length: Math.floor(length / pitch) }, (_, stitch) => {
        const t = ((stitch + 0.55) * pitch) / length;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        return `M${(x - nx).toFixed(2)} ${(y - ny).toFixed(2)}l${(nx * 2).toFixed(2)} ${(ny * 2).toFixed(2)}`;
      }).join(" ");
    })
    .join(" ");
}
const outerWraps = seamWraps(
  [
    [201, 80],
    [239, 124],
    [258, 177],
    [239, 258],
    [201, 334],
    [154, 260],
    [136, 190],
    [163, 127],
    [201, 80],
  ],
  5.3,
  1.15,
);
const innerWraps = seamWraps(
  [
    [201, 80],
    [181, 168],
    [201, 334],
    [211, 183],
    [201, 80],
  ],
  7.5,
  1.1,
);
const stars =
  "M103 133v6m-3-3h6M290 124v5m-2.5-2.5h5M116 255v5m-2.5-2.5h5M278 304v6m-3-3h6M162 367v4m-2-2h4M306 217v4m-2-2h4M228 391v4m-2-2h4";
const orbits = [
  {
    x: 101,
    y: 30,
    tilt: -19,
    center: 187,
    duration: 9,
    delay: -1.3,
    restX: 91,
    restY: 12,
    color: "#d8eece",
  },
  {
    x: 87,
    y: 42,
    tilt: 24,
    center: 218,
    duration: 11,
    delay: -6.8,
    restX: -85,
    restY: -5,
    color: "#a8dbe8",
  },
  {
    x: 77,
    y: 27,
    tilt: -32,
    center: 147,
    duration: 8,
    delay: -4.7,
    restX: 65,
    restY: 14,
    color: "#e2c7db",
  },
  {
    x: 101,
    y: 33,
    tilt: 9,
    center: 272,
    duration: 12,
    delay: -10.5,
    restX: -93,
    restY: 10,
    color: "#c4c7e6",
  },
  {
    x: 83,
    y: 30,
    tilt: -14,
    center: 301,
    duration: 10,
    delay: -3.8,
    restX: 78,
    restY: 7,
    color: "#b3ddd5",
  },
];

/** A single permanent night scene: the Mothercrystal keeps her own light. */
export function NookArrView() {
  const id = `${useId().replace(/:/g, "")}-mothercrystal`;
  const paint = (name: string) => `url(#${id}-${name})`;
  const thread = (d: string, color: string, width = 1.8, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      shadow="#122738"
      highlight="#e5ead8"
      width={width}
      relief={1.6}
      opacity={opacity}
    />
  );
  const orbitLayer = (depth: "back" | "front") => (
    <g className={`nook-arr-orbits nook-arr-orbits--${depth}`}>
      {orbits.map((orb, index) => (
        <g
          key={index}
          transform={`translate(201 ${orb.center}) rotate(${orb.tilt})`}
        >
          <g
            className={`nook-arr-orb nook-arr-orb--${depth}`}
            style={
              {
                "--orbit-x": `${orb.x}px`,
                "--orbit-y": `${orb.y}px`,
                "--orbit-duration": `${orb.duration}s`,
                "--orbit-delay": `${orb.delay}s`,
                "--orbit-rest-x": `${orb.restX}px`,
                "--orbit-rest-y": `${orb.restY}px`,
                "--orb-color": orb.color,
              } as CSSProperties
            }
          >
            <use href={`#${id}-orb`} />
          </g>
        </g>
      ))}
    </g>
  );

  return (
    <svg
      className="nook-arr-view"
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={`${id}-indigo`} x1="0" y1="0" x2=".3" y2="1">
          <stop stopColor="#121d32" />
          <stop offset=".48" stopColor="#20354b" />
          <stop offset="1" stopColor="#14263b" />
        </linearGradient>
        <radialGradient id={`${id}-aether`}>
          <stop stopColor="#7bb7cb" stopOpacity=".18" />
          <stop offset=".65" stopColor="#4e87a0" stopOpacity=".07" />
          <stop offset="1" stopColor="#1a344c" stopOpacity="0" />
        </radialGradient>
        {stitchedFacets.map((facet, index) => (
          <g key={index}>
            <clipPath id={`${id}-facet-${index}`}>
              <path d={facet.d} />
            </clipPath>
            <linearGradient
              id={`${id}-facet-${index}-silk`}
              gradientUnits="userSpaceOnUse"
              x1={facet.bounds[0]}
              y1={facet.bounds[2] + (facet.bounds[3] - facet.bounds[2]) * 0.15}
              x2={facet.bounds[1]}
              y2={facet.bounds[2] + (facet.bounds[3] - facet.bounds[2]) * 0.7}
            >
              <stop stopColor={facet.shade} />
              <stop offset=".23" stopColor={facet.color} />
              <stop offset=".43" stopColor={facet.shine} />
              <stop offset=".67" stopColor={facet.color} />
              <stop offset="1" stopColor={facet.shade} />
            </linearGradient>
          </g>
        ))}
        <g id={`${id}-orb`}>
          <circle r="7.5" fill="var(--orb-color)" opacity=".055" />
          <ellipse
            cx=".45"
            cy=".85"
            rx="4.5"
            ry="4.2"
            fill="#080f20"
            opacity=".75"
          />
          <path
            d="M-4 .3C-4.7-2.2-2.6-4.1-.2-4Q3.7-4.5 4.2-.5C4.9 2.2 2.8 4.1.2 4.1Q-3.5 4.4-4 .3Z"
            fill="var(--orb-color)"
          />
          <NookThread
            d="M-3 1C-5-2-1.9-4.1.7-3.4C4.2-3.1 4.8.5 2.5 2.5C-.2 5-3.7 2.8-2.4.1C-1.3-2.5 2.3-2 2 .3C1.9 2.2-.9 2.5-.9.4"
            color="var(--orb-color)"
            shadow="#29445b"
            highlight="#edf1dd"
            width={1.35}
            relief={1.2}
          />
          <circle cx=".35" cy=".4" r=".6" fill="#314861" opacity=".75" />
          <NookThread
            d="M-3.2-.8q.6-2 2.5-2.3M-2.9 1.2l1.5 .5M1.5-2.8l.7 1.2M2.8 .9l-1.2 .9"
            color="var(--orb-color)"
            shadow="#29445b"
            highlight="#f3f3e4"
            width={0.8}
            relief={1.2}
          />
          <path
            d="M-1.8-2.4h.65m1.5 1.2h.55"
            stroke="#f2edd7"
            strokeWidth=".8"
            opacity=".85"
          />
        </g>
      </defs>

      <path d="M70 58h262v373H70Z" fill={paint("indigo")} />
      {indigoCourses.map((d, tone) => (
        <NookThread
          key={tone}
          d={d}
          color={["#1c3047", "#263b54", "#22374e"][tone]}
          shadow="#0a1427"
          highlight="#526981"
          width={1.85 + tone * 0.06}
          relief={1.2}
          opacity={0.81}
        />
      ))}
      <ellipse cx="201" cy="201" rx="133" ry="180" fill={paint("aether")} />
      {thread(
        "M68 343Q129 379 231 344T344 272M76 332Q135 365 235 332T337 257M65 98Q121 64 166 79M261 372q52-12 75-43",
        "#50788b",
        1.2,
        0.2,
      )}
      {thread(stars, "#a9c5d1", 1.35, 0.75)}
      {thread(
        "M101.7 134.7l2.6 2.6m0-2.6-2.6 2.6M288.7 125.3l2.6 2.5m0-2.5-2.6 2.5M114.8 256.3l2.4 2.4m0-2.4-2.4 2.4M276.8 306l2.4 2.2m0-2.2-2.4 2.2",
        "#d6e1da",
        0.65,
        0.8,
      )}
      {thread(
        "M91.5 193q-1-1.4 .6-1.6q1.5 .4.1 1.6M276.5 165q-.8-1.5 .8-1.5q1.2 .8-.8 1.5M118.5 321q-1-1.3 .8-1.5q1.2 .6-.8 1.5M293 357q-1.5-1.2 .3-1.8q1.6.4-.3 1.8M257.5 99q-.6-1.5 1-1.3q1 1-.8 1.3M98.5 390q-.8-1.3 .7-1.5q1.2.8-.7 1.5",
        "#a4baca",
        0.95,
        0.65,
      )}

      {orbitLayer("back")}
      <g className="nook-arr-mothercrystal">
        {thread(silhouette, "#52798e", 4, 0.5)}
        {stitchedFacets.map((facet, index) => (
          <g key={index}>
            <path d={facet.d} fill={paint(`facet-${index}-silk`)} />
            <g clipPath={paint(`facet-${index}`)}>
              {facet.stitches.strands.map((d, tone) => (
                <NookThread
                  key={tone}
                  d={d}
                  color={
                    tone === 1
                      ? paint(`facet-${index}-silk`)
                      : `color-mix(in srgb, ${facet.color} ${tone === 0 ? 86 : 77}%, ${tone === 0 ? facet.shade : facet.shine})`
                  }
                  shadow={facet.shade}
                  highlight={facet.shine}
                  width={1.78 + tone * 0.07}
                  relief={1.45}
                  opacity={0.95}
                />
              ))}
              <path
                d={facet.stitches.holes}
                stroke={facet.shade}
                strokeWidth=".7"
                opacity=".5"
              />
            </g>
          </g>
        ))}
        {thread(silhouette, "#8faec0", 2.2)}
        <NookThread
          d={outerWraps}
          color="#d8e6e2"
          shadow="#41667e"
          highlight="#edf3e9"
          width={0.78}
          relief={1.1}
        />
        {thread(
          "M201 80 181 168 201 334M201 80 211 183 201 334M136 190l45-22 30 15 47-6",
          "#d3e3dc",
          1.65,
          0.9,
        )}
        <NookThread
          d={innerWraps}
          color="#edf1e4"
          shadow="#62899f"
          highlight="#f3f5e9"
          width={0.65}
          relief={1.1}
          opacity={0.86}
        />
        {thread(
          "M197 106 188 155M194 184l5 68M217 202l-7 70M158 196l15 47M225 135l17 28",
          "#e3e8cf",
          1.2,
          0.5,
        )}
      </g>
      {orbitLayer("front")}
    </svg>
  );
}

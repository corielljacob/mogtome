import { useId } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";

type Point = [number, number];

// Every stripe and seam follows this same fabric surface. Checks compress over
// the ledge, then open out down the hanging face, including its uneven hem.
function clothPoint(u: number, v: number): Point {
  const drop = (Math.exp(v * 1.15) - 1) / (Math.exp(1.15) - 1);
  return [
    64 + 136 * u + (10 - 6 * u) * drop + Math.sin(u * Math.PI * 4) * 3.2 * drop,
    432 + 90 * drop + Math.sin(u * Math.PI * 3 - 0.35) * 3.6 * drop * drop,
  ];
}

function smoothPath(points: Point[], start = true) {
  let path = start ? `M${points[0].join(" ")}` : "";
  for (let i = 0; i < points.length - 1; i++) {
    const before = points[Math.max(0, i - 1)];
    const from = points[i];
    const to = points[i + 1];
    const after = points[Math.min(points.length - 1, i + 2)];
    path += `C${from[0] + (to[0] - before[0]) / 6} ${from[1] + (to[1] - before[1]) / 6} ${to[0] - (after[0] - from[0]) / 6} ${to[1] - (after[1] - from[1]) / 6} ${to.join(" ")}`;
  }
  return path;
}

function fabricLine(
  u0: number,
  v0: number,
  u1: number,
  v1: number,
  start = true,
) {
  return smoothPath(
    Array.from({ length: 17 }, (_, i) =>
      clothPoint(u0 + ((u1 - u0) * i) / 16, v0 + ((v1 - v0) * i) / 16),
    ),
    start,
  );
}

function fabricPanel(u0: number, v0: number, u1: number, v1: number) {
  return (
    fabricLine(u0, v0, u1, v0) +
    fabricLine(u1, v0, u1, v1, false) +
    fabricLine(u1, v1, u0, v1, false) +
    fabricLine(u0, v1, u0, v0, false) +
    "Z"
  );
}

/** Yarn wanders slightly within the weave while staying on the draped surface. */
function yarnLine(
  u0: number,
  v0: number,
  u1: number,
  v1: number,
  seed: number,
) {
  return smoothPath(
    Array.from({ length: 17 }, (_, i) => {
      const t = i / 16;
      const slack = Math.sin(t * Math.PI);
      return clothPoint(
        u0 + (u1 - u0) * t + threadVariation(i, seed) * 0.0015 * slack,
        v0 + (v1 - v0) * t + threadVariation(i, seed + 1) * 0.002 * slack,
      );
    }),
  );
}

function stitchDashes(length: number, gap: number, seed: number) {
  return Array.from({ length: 4 }, (_, i) =>
    [
      length * (1 + threadVariation(i, seed) * 0.13),
      gap * (1 + threadVariation(i, seed + 1) * 0.17),
    ]
      .map((value) => value.toFixed(2))
      .join(" "),
  ).join(" ");
}

const silhouette = fabricPanel(0, 0, 1, 1);
const columns = Array.from({ length: 8 }, (_, i) =>
  fabricPanel(i / 8, 0, i / 8 + 1 / 16, 1),
);
const rows = Array.from({ length: 7 }, (_, i) =>
  fabricPanel(0, i / 7, 1, i / 7 + 1 / 14),
);
const warpThreads = Array.from({ length: 67 }, (_, i) => {
  const u = (i + 0.5 + threadVariation(i, 41) * 0.16) / 67;
  return { d: yarnLine(u, 0, u, 1, i + 60), dyed: u % 0.125 < 0.0625 };
});
const weftThreads = Array.from({ length: 43 }, (_, i) => {
  const v = (i + 0.5 + threadVariation(i, 42) * 0.16) / 43;
  return { d: yarnLine(0, v, 1, v, i + 140), dyed: v % (1 / 7) < 1 / 14 };
});
const hemStitches = Array.from({ length: 32 }, (_, i) => {
  const u = (i + 0.5 + threadVariation(i, 43) * 0.16) / 32;
  return fabricLine(
    u - 0.006,
    0.949 + threadVariation(i, 44) * 0.003,
    u + 0.003 + threadVariation(i, 45) * 0.002,
    0.992 + threadVariation(i, 46) * 0.002,
  );
}).join(" ");

/** A woven tea cloth tucked beneath the books and draped over the sill. */
export function NookCloth() {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-cloth-${name})`;

  return (
    <g className="nook-shelf-cloth" stroke="none">
      <defs>
        <linearGradient id={`${id}-cloth-folds`} x1="0" x2="1" y1="0" y2=".1">
          <stop stopColor="var(--scene-shadow)" stopOpacity=".2" />
          <stop
            offset=".08"
            stopColor="var(--scene-shadow)"
            stopOpacity=".03"
          />
          <stop offset=".22" stopColor="var(--scene-paper)" stopOpacity=".46" />
          <stop
            offset=".34"
            stopColor="var(--scene-shadow)"
            stopOpacity=".05"
          />
          <stop offset=".39" stopColor="var(--scene-shadow)" stopOpacity=".2" />
          <stop offset=".46" stopColor="var(--scene-paper)" stopOpacity=".16" />
          <stop offset=".63" stopColor="var(--scene-paper)" stopOpacity=".38" />
          <stop
            offset=".74"
            stopColor="var(--scene-shadow)"
            stopOpacity=".04"
          />
          <stop
            offset=".82"
            stopColor="var(--scene-shadow)"
            stopOpacity=".18"
          />
          <stop offset=".94" stopColor="var(--scene-paper)" stopOpacity=".22" />
          <stop offset="1" stopColor="var(--scene-shadow)" stopOpacity=".17" />
        </linearGradient>
        <linearGradient
          id={`${id}-cloth-turn`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="0"
          y1="432"
          y2="469"
        >
          <stop stopColor="var(--scene-shadow)" stopOpacity=".13" />
          <stop offset=".21" stopColor="var(--scene-paper)" stopOpacity=".4" />
          <stop offset=".34" stopColor="var(--scene-paper)" stopOpacity=".56" />
          <stop
            offset=".55"
            stopColor="var(--scene-shadow)"
            stopOpacity=".22"
          />
          <stop offset="1" stopColor="var(--scene-shadow)" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-cloth-outline`}>
          <path d={silhouette} />
        </clipPath>
      </defs>

      {/* The folded cloth casts a close shadow on the wood and a softer hem shadow. */}
      <path
        d={silhouette}
        transform="translate(2 3)"
        fill="var(--scene-shadow)"
        opacity=".15"
      />
      <path
        d={fabricLine(0.06, 1, 0.97, 1)}
        transform="translate(1 3)"
        stroke="var(--scene-shadow)"
        strokeWidth="2.3"
        opacity=".08"
        fill="none"
      />
      <path d={silhouette} fill="var(--scene-paper)" />

      <g clipPath={paint("outline")}>
        {/* Separate dyed warp and weft layers create the darker check intersections. */}
        <g fill="var(--scene-leaf)" opacity=".18">
          {columns.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <g fill="var(--scene-leaf)" opacity=".13">
          {rows.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        {/* Each strand bends with the drape; the small gaps expose the crosswise yarn. */}
        <g>
          {warpThreads.map(({ d, dyed }, i) => (
            <NookThread
              key={i}
              d={d}
              color={dyed ? "var(--scene-leaf-light)" : "var(--scene-paper)"}
              width={0.92 + threadVariation(i, 47) * 0.09}
              opacity={(dyed ? 0.48 : 0.66) + threadVariation(i, 48) * 0.035}
              dasharray={stitchDashes(3.2, 0.8, i + 180)}
            />
          ))}
          {weftThreads.map(({ d, dyed }, i) => (
            <NookThread
              key={i}
              d={d}
              color={dyed ? "var(--scene-leaf)" : "var(--scene-paper)"}
              width={0.85 + threadVariation(i, 49) * 0.08}
              opacity={(dyed ? 0.42 : 0.56) + threadVariation(i, 50) * 0.035}
              dasharray={stitchDashes(1.3, 1.1, i + 250)}
            />
          ))}
        </g>
        <path d={silhouette} fill={paint("folds")} />
        <path d={silhouette} fill={paint("turn")} />

        {/* Narrow folded hems retain the checks, with small running stitches. */}
        <path
          d={fabricPanel(0, 0.945, 1, 1)}
          fill="var(--scene-paper)"
          opacity=".35"
        />
        <NookThread
          d={yarnLine(0.012, 0.95, 0.99, 0.95, 301)}
          color="var(--scene-leaf-light)"
          width={1.3}
          opacity={0.8}
        />
        <NookThread
          d={yarnLine(0.022, 0.975, 0.98, 0.975, 302)}
          color="var(--scene-leaf)"
          width={1}
          dasharray={stitchDashes(2.1, 2.1, 303)}
          opacity={0.85}
        />
        <NookThread
          d={yarnLine(0.035, 0.08, 0.035, 0.958, 304)}
          color="var(--scene-leaf)"
          width={1}
          dasharray={stitchDashes(2, 2.2, 305)}
          opacity={0.8}
        />
        <NookThread
          d={yarnLine(0.968, 0.08, 0.968, 0.958, 306)}
          color="var(--scene-leaf)"
          width={1}
          dasharray={stitchDashes(2, 2.2, 307)}
          opacity={0.8}
        />
        <NookThread
          d={hemStitches}
          color="var(--scene-leaf)"
          width={1.05}
          opacity={0.86}
        />
      </g>
      <path
        d={silhouette}
        stroke="var(--scene-wood-dark)"
        strokeOpacity=".42"
        strokeWidth=".8"
        fill="none"
      />
      <NookThread
        d={
          fabricLine(0, 0.03, 0, 1) +
          fabricLine(0, 1, 1, 1) +
          fabricLine(1, 1, 1, 0.03)
        }
        color="var(--scene-paper)"
        width={1.5}
        opacity={0.84}
      />
      <path
        d={fabricLine(0.045, 0.24, 0.97, 0.24)}
        stroke="var(--scene-paper)"
        strokeWidth="1.15"
        opacity=".4"
        fill="none"
      />
      {/* Just two loose threads at the corners, rather than a rigid fringe. */}
      <path
        d="M75 520q-1 4 1 5m126-1q2 2 0 4"
        stroke="var(--scene-paper)"
        strokeWidth=".7"
        opacity=".65"
        fill="none"
      />
    </g>
  );
}

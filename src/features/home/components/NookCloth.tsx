import { useId } from "react";

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

const silhouette = fabricPanel(0, 0, 1, 1);
const columns = Array.from({ length: 8 }, (_, i) =>
  fabricPanel(i / 8, 0, i / 8 + 1 / 16, 1),
);
const rows = Array.from({ length: 7 }, (_, i) =>
  fabricPanel(0, i / 7, 1, i / 7 + 1 / 14),
);

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
        <g
          stroke="var(--scene-paper)"
          strokeWidth=".45"
          opacity=".42"
          fill="none"
        >
          {Array.from({ length: 15 }, (_, i) => (
            <path
              key={i}
              d={fabricLine((i + 0.5) / 16, 0, (i + 0.5) / 16, 1)}
            />
          ))}
          {Array.from({ length: 13 }, (_, i) => (
            <path
              key={i}
              d={fabricLine(0, (i + 0.5) / 14, 1, (i + 0.5) / 14)}
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
        <path
          d={fabricLine(0.012, 0.95, 0.99, 0.95)}
          stroke="var(--scene-wood)"
          strokeWidth=".7"
          opacity=".34"
          fill="none"
        />
        <path
          d={fabricLine(0.022, 0.975, 0.98, 0.975)}
          stroke="var(--scene-wood-dark)"
          strokeWidth=".55"
          strokeDasharray="1.3 2.3"
          opacity=".48"
          fill="none"
        />
        <path
          d={fabricLine(0.035, 0.08, 0.035, 0.958)}
          stroke="var(--scene-wood)"
          strokeWidth=".55"
          strokeDasharray="1.2 2.4"
          opacity=".35"
          fill="none"
        />
        <path
          d={fabricLine(0.968, 0.08, 0.968, 0.958)}
          stroke="var(--scene-wood)"
          strokeWidth=".55"
          strokeDasharray="1.2 2.4"
          opacity=".35"
          fill="none"
        />
      </g>
      <path
        d={silhouette}
        stroke="var(--scene-wood-dark)"
        strokeOpacity=".42"
        strokeWidth=".8"
        fill="none"
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

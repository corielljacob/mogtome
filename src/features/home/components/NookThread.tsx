interface NookThreadProps {
  d: string;
  color: string;
  width?: number;
  shadow?: string;
  highlight?: string;
  opacity?: number;
  dasharray?: string;
  /** Larger, more separated strand lighting for artwork viewed at small scale. */
  relief?: number;
}

/** Matte floss: a close shadow, colored strand, and an intermittent lit fiber.
 * Geometry is authored by each object so the stitches follow its surface. */
export function NookThread({
  d,
  color,
  width = 1.4,
  shadow = "var(--scene-shadow)",
  highlight = "var(--scene-paper)",
  opacity = 1,
  dasharray,
  relief = 1,
}: NookThreadProps) {
  return (
    <g
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dasharray}
      opacity={opacity}
    >
      <path
        d={d}
        stroke={shadow}
        strokeWidth={width + 0.5 * relief}
        opacity={0.29 * Math.min(relief, 1.4)}
        transform={`translate(${0.25 * relief} ${0.45 * relief})`}
      />
      <path d={d} stroke={color} strokeWidth={width} />
      <path
        d={d}
        stroke={highlight}
        strokeWidth={width * 0.28}
        opacity=".4"
        // A little twist interrupts the sheen. Dashed seams keep their own
        // rhythm so the highlight never bridges a gap between stitches.
        strokeDasharray={dasharray ?? "4.1 .8 2.3 1.1 6.2 .7"}
        transform={`translate(${-0.16 * relief} ${-0.2 * relief})`}
      />
    </g>
  );
}

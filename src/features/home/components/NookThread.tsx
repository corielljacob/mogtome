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

/** Laid floss: a close shadow, colored strand, and a narrow light-facing fiber.
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
        opacity={0.34 * Math.min(relief, 1.4)}
        transform={`translate(${0.25 * relief} ${0.45 * relief})`}
      />
      <path d={d} stroke={color} strokeWidth={width} />
      <path
        d={d}
        stroke={highlight}
        strokeWidth={width * 0.32}
        opacity=".56"
        transform={`translate(${-0.16 * relief} ${-0.2 * relief})`}
      />
    </g>
  );
}

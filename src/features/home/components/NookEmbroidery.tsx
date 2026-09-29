import { useMemo } from "react";

interface NookEmbroideryProps {
  id: string;
  width: number;
  height: number;
  /** Follow the direction of a stitched piece, in SVG degrees. */
  angle?: number;
  /** Thread spacing in the illustration's coordinate space. */
  scale?: number;
  /** Distant scenery uses a lighter relief than foreground needlework. */
  strength?: number;
}

const padding = 24;

// A single vector pattern paints the full filter surface. Rotating the pattern
// inside that surface keeps its staggered stitches seamless at every angle.
function threadSurface(
  width: number,
  height: number,
  angle: number,
  scale: number,
) {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width + padding * 2}" height="${height + padding * 2}" viewBox="-${padding} -${padding} ${width + padding * 2} ${height + padding * 2}">
      <defs>
        <pattern id="thread" width="7.2" height="10.4" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle}) scale(${scale})">
          <g fill="none" stroke-linecap="round">
            <path d="M1.8-1C1.4 1.2 1.55 3.8 1.95 6.8M1.8 9.4C1.4 11.6 1.55 14.2 1.95 17.2M5.4-6.2C5-4 5.15-1.4 5.55 1.6M5.4 4.2C5 6.4 5.15 9 5.55 12"
              stroke="#49383d" stroke-opacity=".23" stroke-width="2.15" transform="translate(.45 .4)"/>
            <path d="M1.8-1C1.4 1.2 1.55 3.8 1.95 6.8M1.8 9.4C1.4 11.6 1.55 14.2 1.95 17.2M5.4-6.2C5-4 5.15-1.4 5.55 1.6M5.4 4.2C5 6.4 5.15 9 5.55 12"
              stroke="#fff5df" stroke-opacity=".31" stroke-width="1.5"/>
            <path d="M1.23-.6C.91 1.5 1.07 3.8 1.4 6.3M1.23 9.8C.91 11.9 1.07 14.2 1.4 16.7M4.83-5.8C4.51-3.7 4.67-1.4 5 1.1M4.83 4.6C4.51 6.7 4.67 9 5 11.5"
              stroke="#fffaf0" stroke-opacity=".34" stroke-width=".55"/>
          </g>
          <g fill="#49383d" fill-opacity=".2">
            <ellipse cx="1.9" cy="7.3" rx=".55" ry=".36"/>
            <ellipse cx="5.5" cy="2.1" rx=".55" ry=".36"/>
          </g>
        </pattern>
      </defs>
      <path fill="url(#thread)" d="M-${padding}-${padding}H${width + padding}V${height + padding}H-${padding}Z"/>
    </svg>
  `)}`;
}

/** Raised satin threads retain every painted shape's original transparency. */
export function NookEmbroidery({
  id,
  width,
  height,
  angle = -12,
  scale = 1,
  strength = 1,
}: NookEmbroideryProps) {
  const threads = useMemo(
    () => threadSurface(width, height, angle, scale),
    [width, height, angle, scale],
  );

  return (
    <filter
      id={id}
      filterUnits="userSpaceOnUse"
      primitiveUnits="userSpaceOnUse"
      x={-padding}
      y={-padding}
      width={width + padding * 2}
      height={height + padding * 2}
      colorInterpolationFilters="sRGB"
    >
      <feImage
        href={threads}
        x={-padding}
        y={-padding}
        width={width + padding * 2}
        height={height + padding * 2}
        preserveAspectRatio="none"
        result="thread-surface"
      />
      <feComponentTransfer in="thread-surface" result="thread-relief">
        <feFuncA type="linear" slope={strength} />
      </feComponentTransfer>
      {/* atop also protects the translucency of steam, fine stems, and glows. */}
      <feComposite in="thread-relief" in2="SourceGraphic" operator="atop" />
    </filter>
  );
}

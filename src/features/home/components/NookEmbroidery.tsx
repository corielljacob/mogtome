interface NookEmbroideryProps {
  id: string;
  width: number;
  height: number;
}

// Wrapped copies keep each staggered thread continuous at the tile boundaries.
// This is a tiny authored SVG, not a bitmap or an external image request.
const threadTile = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="6" height="8" viewBox="0 0 6 8">
    <g fill="none" stroke-linecap="round">
      <path d="M1.5 -1 C1.15 1 1.4 3 1.7 5 M1.5 7 C1.15 9 1.4 11 1.7 13 M4.5 -5 C4.15 -3 4.4 -1 4.7 1 M4.5 3 C4.15 5 4.4 7 4.7 9"
        stroke="#493846" stroke-opacity=".14" stroke-width=".65"/>
      <path d="M1.06 -1.12 C.71 .88 .96 2.88 1.26 4.88 M1.06 6.88 C.71 8.88 .96 10.88 1.26 12.88 M4.06 -5.12 C3.71 -3.12 3.96 -1.12 4.26 .88 M4.06 2.88 C3.71 4.88 3.96 6.88 4.26 8.88"
        stroke="#fff5df" stroke-opacity=".16" stroke-width=".85"/>
    </g>
  </svg>
`)}`;

/** A complete, alpha-preserving thread layer over the existing SVG paint. */
export function NookEmbroidery({ id, width, height }: NookEmbroideryProps) {
  return (
    <filter
      id={id}
      filterUnits="userSpaceOnUse"
      primitiveUnits="userSpaceOnUse"
      x="-24"
      y="-24"
      width={width + 48}
      height={height + 48}
      colorInterpolationFilters="sRGB"
    >
      <feImage
        href={threadTile}
        x="0"
        y="0"
        width="6"
        height="8"
        preserveAspectRatio="none"
        result="thread-tile"
      />
      <feTile
        in="thread-tile"
        x="-24"
        y="-24"
        width={width + 48}
        height={height + 48}
        result="threads"
      />
      {/* atop retains SourceGraphic's alpha, including fine strokes and glows. */}
      <feComposite in="threads" in2="SourceGraphic" operator="atop" />
    </filter>
  );
}

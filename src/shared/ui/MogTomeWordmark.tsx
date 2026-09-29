import { useId } from "react";

interface MogTomeWordmarkProps {
  className?: string;
}

const point = (value: number) => value.toFixed(2);

// Satin stitches cross the stroke, then fan around its bowls. They are drawn
// as strands, rather than a hatch laid across the entire word.
function satinBar(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number,
  spacing = 1.45,
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  const count = Math.ceil(length / spacing);
  const nx = (-dy / length) * width * 0.5;
  const ny = (dx / length) * width * 0.5;
  return Array.from({ length: count + 1 }, (_, index) => {
    const t = index / count;
    const x = x1 + dx * t;
    const y = y1 + dy * t;
    return `M${point(x - nx)} ${point(y - ny)}Q${point(x - 0.18)} ${point(y - 0.22)} ${point(x + nx)} ${point(y + ny)}`;
  }).join(" ");
}

function satinBowl(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  start = 0,
  end = Math.PI * 2,
) {
  const count = Math.ceil(((rx + ry) * (end - start)) / 2.7);
  return Array.from({ length: count }, (_, index) => {
    const angle = start + ((end - start) * index) / count;
    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry;
    return `M${point(cx + x * 0.35)} ${point(cy + y * 0.35)}Q${point(cx + x * 0.7 - 0.16)} ${point(cy + y * 0.7 - 0.2)} ${point(cx + x)} ${point(cy + y)}`;
  }).join(" ");
}

const plum = {
  color: "var(--brand-plum, #764c62)",
  shade: "#493141",
  light: "#d9b8c8",
};
const sage = {
  color: "var(--brand-sage, #50654e)",
  shade: "#2f4230",
  light: "#c3cdae",
};

const letters = [
  {
    name: "M",
    d: "M3 49V46.8C7.3 46.3 8.3 44.9 8.5 40.6L9.2 16.5C9.3 12.7 7.5 11.5 3.3 11V8.5C7.7 9.6 12.1 9.2 16.1 8.2L29.2 38.5L41.8 8.2C45.9 9.3 50.1 9.6 54.2 8.5V11C49.8 11.4 48.3 12.6 48.3 16.3V41.2C48.3 44.9 49.7 46.3 54 46.8V49H35.1V46.8C39.9 46.3 41.2 44.9 41.2 41.2V15.3L27.2 49.2H24.8L12.3 19.8L11.8 40.6C11.7 44.8 13.2 46.3 17.5 46.8V49Z",
    floss: plum,
    stitches: [
      satinBar(10.8, 14, 10.2, 44, 8),
      satinBar(15.3, 12.8, 27, 43.9, 9),
      satinBar(29.5, 40, 41.7, 12, 5),
      satinBar(44.8, 13.5, 44.8, 44.5, 9),
      satinBar(3, 9.5, 54, 9.5, 5),
      satinBar(3, 47.5, 54, 47.5, 5),
    ].join(" "),
  },
  {
    name: "o-mog",
    d: "M70.1 22.1C61.7 22.1 56.2 28.2 56.2 36.1C56.2 44.5 61.5 49.9 69.8 49.9C78.3 49.9 83.7 43.9 83.7 35.9C83.7 27.9 78.5 22.1 70.1 22.1ZM69.4 24.8C64.8 24.8 62.8 29.1 62.8 34.5C62.8 41.8 65.5 47.2 70.5 47.2C75.1 47.2 77.1 43 77.1 37.5C77.1 30.5 74.5 24.8 69.4 24.8Z",
    floss: plum,
    stitches: satinBowl(69.9, 36, 15, 15.5),
  },
  {
    name: "g",
    d: "M99.4 22.1C92.1 22.1 87.5 26.1 87.5 31.6C87.5 35.4 89.7 38.3 93.3 39.8C90.3 41.4 88.9 43.1 88.9 45.3C88.9 47.4 90.5 48.8 93.1 49.7C88.4 51.5 85.8 54.3 85.8 57.5C85.8 62 91.3 64.1 98.6 64.1C108.9 64.1 115.4 59.6 115.4 53.8C115.4 49.1 112.1 46.8 105.6 46.2L97.6 45.5C94.5 45.2 92.9 44.6 92.9 43.3C92.9 42.4 93.8 41.6 95.5 40.8C96.7 41 98 41.1 99.4 41.1C106.7 41.1 111.3 37.2 111.3 31.8C111.3 29.6 110.5 27.6 109.1 26.1C111.9 25.3 112.8 28.1 114.6 27.5C116.1 27 116.8 25.9 116.3 24.5C115.7 22.7 114.1 22.4 112.4 22.9C110.6 23.2 108.8 23.5 107.2 24.5C105 22.8 102.4 22.1 99.4 22.1ZM99 24.8C102.8 24.8 105.2 27.5 105.2 32.3C105.2 36.5 103.3 38.5 99.7 38.5C96 38.5 93.7 35.8 93.7 31C93.7 26.9 95.6 24.8 99 24.8ZM96.6 50.4C98.8 50.6 102.2 50.9 105 51.3C109.4 51.9 111.2 53.1 111.2 55.7C111.2 59.5 106.6 61.6 99.7 61.6C94.1 61.6 91.3 59.9 91.3 56.9C91.3 54.6 93.3 52.1 96.6 50.4Z",
    floss: plum,
    stitches: [
      satinBowl(99.4, 31.6, 13, 11.5),
      satinBowl(100.1, 56.3, 16, 9),
      satinBar(92.7, 42.9, 109.1, 48.4, 6),
      satinBar(108.9, 25.1, 115.5, 24.7, 5, 1.2),
    ].join(" "),
  },
  {
    name: "T",
    d: "M120.8 7.5C126.9 9.6 133 9.3 138.5 9.3C144.1 9.3 150.4 9.6 156.9 7.5L157.6 18.9H155.3C153.4 13.9 150.2 12.5 143.4 12.5H142.1V40.9C142.1 44.9 143.7 46.2 148.5 46.8V49H128.3V46.8C133.1 46.2 134.7 44.9 134.7 40.9V12.5H133.3C126.9 12.5 123.6 14 121.6 18.9H119.4Z",
    floss: sage,
    stitches: [
      satinBar(121, 11.4, 156, 11.4, 17),
      satinBar(138.4, 13.8, 138.4, 45, 10),
      satinBar(128, 47.5, 149, 47.5, 5),
    ].join(" "),
  },
  {
    name: "o-tome",
    d: "M168.3 22.1C159.9 22.1 154.4 28.2 154.4 36.1C154.4 44.5 159.7 49.9 168 49.9C176.5 49.9 181.9 43.9 181.9 35.9C181.9 27.9 176.7 22.1 168.3 22.1ZM167.6 24.8C163 24.8 161 29.1 161 34.5C161 41.8 163.7 47.2 168.7 47.2C173.3 47.2 175.3 43 175.3 37.5C175.3 30.5 172.7 24.8 167.6 24.8Z",
    floss: sage,
    stitches: satinBowl(168.1, 36, 15, 15.5),
  },
  {
    name: "m",
    d: "M184.7 49V47C187.7 46.6 188.6 45.6 188.6 42.5V30.5C188.6 27.6 187.6 26.7 184.4 26.4V24.5C188 24.3 191 23.6 194.4 22.1H195.4L195.1 27.2C197.8 24 200.5 22.1 204 22.1C208.2 22.1 210.4 24.1 211.1 27.3C214.1 23.9 217 22.1 220.6 22.1C226.1 22.1 228.5 25.9 228.5 31.6V42.5C228.5 45.6 229.5 46.6 232.3 47V49H218.6V47C221.1 46.6 221.9 45.6 221.9 42.5V32.8C221.9 28.5 220.7 26.3 217.6 26.3C215.5 26.3 213.3 27.8 211.5 30.2V42.5C211.5 45.6 212.3 46.6 214.9 47V49H201.5V47C204.1 46.6 204.9 45.6 204.9 42.5V32.8C204.9 28.5 203.7 26.3 200.6 26.3C198.5 26.3 196.4 27.8 194.9 30.2V42.5C194.9 45.6 195.7 46.6 198.2 47V49Z",
    floss: sage,
    stitches: [
      satinBar(191.8, 28.5, 191.8, 45, 9),
      satinBar(208.2, 31, 208.2, 45, 9),
      satinBar(225.2, 31, 225.2, 45, 9),
      satinBowl(200.6, 31.5, 11, 10.5, -Math.PI, 0),
      satinBowl(217.5, 31.5, 12, 10.5, -Math.PI, 0),
      satinBar(185, 25.7, 195, 23.8, 5),
      satinBar(184, 47.5, 233, 47.5, 5),
    ].join(" "),
  },
  {
    name: "e",
    d: "M259.3 35.1H241.4C241.8 42.3 245.1 46.2 250.3 46.2C253.6 46.2 256 44.5 258.1 41.9L260.1 43.4C257.3 47.8 253.6 49.9 248.8 49.9C240.3 49.9 234.7 44.4 234.7 36.4C234.7 28.1 240.3 22.1 248.1 22.1C255.7 22.1 259.5 27.2 259.3 35.1ZM241.6 32.3H253C252.8 27.4 251.3 24.8 248 24.8C244.5 24.8 242.1 27.8 241.6 32.3Z",
    floss: sage,
    stitches: [
      satinBowl(248.3, 36, 15, 15.5),
      satinBar(240.5, 33.7, 259.5, 33.7, 4.2),
    ].join(" "),
  },
];

function SatinThread({
  d,
  color,
  shade,
  light,
  width = 0.98,
}: typeof plum & { d: string; width?: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        d={d}
        stroke={shade}
        strokeWidth={width + 0.25}
        opacity=".48"
        transform="translate(.12 .2)"
      />
      <path d={d} stroke={color} strokeWidth={width} />
      <path
        d={d}
        stroke={light}
        strokeWidth={width * 0.29}
        opacity=".66"
        transform="translate(-.12 -.16)"
      />
    </g>
  );
}

// Bespoke book serifs share the open tome's gently lifted page terminals.
// Each glyph keeps its own thread direction, enclosed counters and cord edge.
export function MogTomeWordmark({ className = "" }: MogTomeWordmarkProps) {
  const id = useId();

  return (
    <svg
      className={className}
      viewBox="0 0 264 66"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <g id={`${id}-letters`} fillRule="evenodd">
          {letters.map(({ name, d }) => (
            <path key={name} id={`${id}-${name}`} d={d} />
          ))}
        </g>
        {letters.map(({ name, d }) => (
          <clipPath key={name} id={`${id}-${name}-clip`}>
            <path d={d} clipRule="evenodd" />
          </clipPath>
        ))}
      </defs>
      <use
        className="brand-letter-shadow"
        href={`#${id}-letters`}
        transform="translate(.25 .65)"
        fill="#392b2b"
        stroke="#392b2b"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity=".2"
      />
      {letters.map(({ name, floss }) => (
        <use
          key={name}
          href={`#${id}-${name}`}
          fill={floss.color}
          fillRule="evenodd"
        />
      ))}
      <g className="brand-letter-texture">
        {letters.map(({ name, floss, stitches }) => (
          <g key={name} clipPath={`url(#${id}-${name}-clip)`}>
            <SatinThread d={stitches} {...floss} />
          </g>
        ))}
      </g>
      <g className="brand-letter-stitches">
        {letters.map(({ name, floss }) => (
          <g key={name} strokeLinejoin="round">
            <use
              href={`#${id}-${name}`}
              stroke={floss.shade}
              strokeWidth=".85"
              opacity=".7"
            />
            <use
              href={`#${id}-${name}`}
              stroke={floss.color}
              strokeWidth=".55"
            />
            <use
              href={`#${id}-${name}`}
              stroke={floss.light}
              strokeWidth=".2"
              opacity=".74"
              transform="translate(-.12 -.16)"
            />
          </g>
        ))}
        <SatinThread
          d="M132 57.5C151 53.7 173 54.6 191 59.7C211 54.6 232 53.7 252 57.5M191 59.7V62"
          color="#b59151"
          shade="#856333"
          light="#f1d49a"
          width={1.1}
        />
      </g>
    </svg>
  );
}

import { useId } from "react";
import { NookThread } from "./NookThread";

const scarlet = {
  color: "var(--sb-cloth, #98484a)",
  shadow: "var(--sb-cloth-dark, #64393f)",
  highlight: "var(--sb-cloth-light, #c87c6b)",
};
const gold = {
  color: "var(--sb-gold, #b78749)",
  shadow: "var(--sb-gold-dark, #765432)",
  highlight: "var(--sb-gold-light, #e2c489)",
};
const indigo = {
  color: "var(--sb-indigo, #3e526b)",
  shadow: "var(--sb-indigo-dark, #263a51)",
  highlight: "var(--sb-indigo-light, #8194a3)",
};
const ivory = {
  color: "var(--sb-thread, #f3e4c6)",
  shadow: "#ab9475",
  highlight: "#fff5df",
};
const mix = (a: string, b: string, percent: number) =>
  `color-mix(in srgb, ${a} ${percent}%, ${b})`;
const banner = "M22 49Q59 54 98 49L95 195 61 179 26 196Z";
const cord = "M14 47Q39 33 60 12Q81 34 107 48";
const bannerRows = Array.from({ length: 109 }, (_, i) => {
  const y = 47 + i * 1.4;
  return `M20 ${y}C35 ${y + 2} 41 ${y + 6} 56 ${y + 4}S82 ${y + 6} 100 ${y - 1}`;
}).join(" ");
const featherRows = (x: number, y: number, height: number, drift: number) =>
  Array.from({ length: Math.ceil(height / 1.3) }, (_, i) => {
    const t = (i * 1.3) / height;
    return `M${x + drift * t * t} ${y + i * 1.3}q6-.6 14 4`;
  }).join(" ");

/** Satin follows each cut piece; the seam wraps around its padded edge. */
function SewnPatch({
  d,
  stitches,
  floss,
  folded = false,
  edge = 1.5,
  width = 1.18,
}: {
  d: string;
  stitches: string;
  floss: typeof gold;
  folded?: boolean;
  edge?: number;
  width?: number;
}) {
  const id = `${useId().replace(/:/g, "")}-stormblood-patch`;
  const shade = mix(floss.color, floss.shadow, 68);
  const light = mix(floss.color, floss.highlight, 48);
  const paint = `url(#${id}-padding)`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
        {folded ? (
          <linearGradient id={`${id}-padding`} x2="1" y2=".05">
            <stop stopColor={shade} />
            <stop offset=".18" stopColor={floss.color} />
            <stop offset=".3" stopColor={light} />
            <stop offset=".48" stopColor={shade} />
            <stop offset=".66" stopColor={floss.color} />
            <stop offset=".78" stopColor={light} />
            <stop offset="1" stopColor={shade} />
          </linearGradient>
        ) : (
          <radialGradient id={`${id}-padding`} cx=".3" cy=".25" r=".88">
            <stop stopColor={light} />
            <stop offset=".55" stopColor={floss.color} />
            <stop offset="1" stopColor={shade} />
          </radialGradient>
        )}
      </defs>
      <path
        d={d}
        fill={floss.shadow}
        transform="translate(.45 .7)"
        opacity=".3"
      />
      <path d={d} fill={paint} />
      <g clipPath={`url(#${id})`}>
        <NookThread
          d={stitches}
          color={paint}
          shadow={shade}
          highlight={light}
          width={width}
          relief={1.7}
        />
      </g>
      <NookThread
        d={d}
        color={paint}
        shadow={shade}
        highlight={light}
        width={edge}
        relief={1.5}
      />
      <NookThread
        d={d}
        color={light}
        shadow={floss.color}
        highlight={light}
        width={edge * 0.7}
        dasharray=".7 2.3 .85 2.6"
        opacity={0.68}
      />
    </g>
  );
}

function GoldBinding({ d, width = 2.5 }: { d: string; width?: number }) {
  return (
    <g>
      <NookThread d={d} {...gold} width={width} relief={1.5} />
      <NookThread
        d={d}
        color={gold.highlight}
        shadow={gold.color}
        highlight={ivory.color}
        width={width * 0.64}
        dasharray=".8 2.4"
        opacity={0.82}
      />
    </g>
  );
}

function Tassel({
  x,
  y,
  floss = gold,
}: {
  x: number;
  y: number;
  floss?: typeof gold;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <NookThread d="M0-3q-4 2-2 5q3 3 4 0q2-3-2-5" {...gold} width={1.3} />
      <SewnPatch
        d="M-2 3Q-4 10-5 18Q0 21 5 18Q4 10 2 3Z"
        stitches="M-2 3Q-4 12-5 20M-.7 3Q-2 12-2 21M.6 3V21M2 3Q3 12 3 21M3 6Q4 12 5 20"
        floss={floss}
        edge={0.8}
        width={1.2}
      />
      <NookThread d="M-2.5 4h5M-3 6h6" {...gold} width={1.4} />
      <NookThread
        d="M-5 18l-1 2M-2 20v2M1 20v2M4 19l1 2"
        {...floss}
        width={0.65}
      />
    </g>
  );
}

/** An original griffin-and-sword appliqué, inspired by Ala Mhigan heraldry. */
function ResistanceGriffin() {
  const body =
    "M56 111Q56 104 63 98L61 88 63 80 70 89Q78 87 81 95L87 97 85 103 78 102Q75 108 70 105L69 113 73 120 66 117 68 125Q76 127 75 138Q72 146 61 147Q51 145 48 137Q45 128 51 120Z";
  return (
    <g>
      <NookThread
        d="M55 137C34 149 29 124 36 118Q43 115 40 125"
        {...gold}
        width={3}
      />
      <SewnPatch
        d="M34 119Q26 117 29 108L33 110 33 106Q42 112 40 119L37 122Z"
        stitches="M29 109 37 120M29 112 35 120M33 107 39 117M33 110 39 119"
        floss={ivory}
        edge={1}
      />
      <SewnPatch
        d="M59 125Q39 120 33 100L30 78Q42 84 47 97L43 81Q55 88 60 108L59 92Q69 105 65 123Z"
        stitches={featherRows(29, 78, 49, 18)}
        floss={ivory}
        edge={1.5}
      />
      <SewnPatch
        d="M30 78Q32 109 47 120L59 125Q43 108 40 90Z"
        stitches={featherRows(28, 78, 47, 20)}
        floss={ivory}
        edge={0.8}
      />
      <SewnPatch
        d="M43 81Q43 108 56 122L62 125Q57 99 52 91Z"
        stitches={featherRows(41, 82, 44, 11)}
        floss={ivory}
        edge={0.8}
      />
      <SewnPatch
        d="M59 92Q57 112 65 124Q69 108 59 92Z"
        stitches={featherRows(57, 93, 34, 1)}
        floss={ivory}
        edge={0.8}
      />
      <NookThread
        d="M32 85Q36 108 52 120M45 89Q48 110 59 123M60 99Q63 110 64 119"
        {...ivory}
        width={1.3}
        relief={1.5}
      />
      <SewnPatch
        d="M84 146 89 105 93 94 95 106 88 147Z"
        stitches="M89 103 91 145M90 101 90 146M91.5 99 86 147M93 99 87.5 147"
        floss={indigo}
        edge={1}
        width={0.9}
      />
      <GoldBinding d="M81 146l10 2M85 147l-1 11" width={1.7} />
      <SewnPatch
        d="M55 138 48 146 50 151 44 154 42 158 47 158 50 155 52 158 54 155 57 157 60 151 64 141ZM68 138 66 148 71 152 80 153 84 157 81 160 79 156 76 158 74 155 71 157 65 152 62 145Z"
        stitches="M52 141 58 145M50 143 57 147M48 146 56 150M50 150 54 154M45 155 47 158M50 154 52 158M55 152 57 156M64 142 69 142M65 145 68 145M66 148 69 147M65 151 70 150M69 153 72 151M72 155 75 152M76 154 80 153M79 156 82 155"
        floss={gold}
        edge={1}
      />
      <SewnPatch
        d={body}
        stitches={Array.from(
          { length: 40 },
          (_, i) => `M47 ${91 + i * 1.4}q13-3 37 5`,
        ).join(" ")}
        floss={ivory}
        edge={1.25}
      />
      <SewnPatch
        d="M67 114Q74 118 78 123L88 119 90 122 81 129Q76 131 72 126L64 120Z"
        stitches="M65 114 67 121M68 115 70 123M71 117 73 125M74 119 76 127M77 122 79 130M80 122 82 129M83 121 85 127M86 120 88 125"
        floss={ivory}
        edge={1}
      />
      <NookThread
        d="M85 121l4 1M84 124l4 1M82 127l4 .5"
        {...gold}
        width={1.2}
      />
      <SewnPatch
        d="M79 94 87 97 85 103 83 100 79 99Z"
        stitches="M80 95 86 97M80 97 85 99M80 99 84 101"
        floss={gold}
        edge={0.7}
        width={0.9}
      />
      <NookThread
        d="M63 104l3 2-2 2M61 110l3 2-1 2M52 127q-3 6 4 12M72 92.5l3 1M73 94.3h1.1M46 155l-1 2M51 154l1 2M74 154l1 2M79 154l2 2"
        color={gold.shadow}
        shadow={ivory.shadow}
        highlight={gold.highlight}
        width={0.85}
        opacity={0.82}
      />
    </g>
  );
}

/** Scarlet woven cloth, warm brass, and a raised resistance griffin. */
export function NookStormbloodBanner() {
  return (
    <svg
      className="nook-wall-hanging nook-hanging nook-stormblood-banner"
      viewBox="0 0 120 230"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <GoldBinding d={cord} width={2.1} />
      <GoldBinding
        d="M59 9q-3 2-1 5q4 2 5-1q1-4-4-4M12 48Q59 46 108 49"
        width={3.4}
      />
      {[12, 108].map((x) => (
        <NookThread
          key={x}
          d={`M${x} 46q-3 2-1 5q4 2 4-2q0-3-3-3`}
          {...gold}
          width={1.9}
        />
      ))}
      <path
        d={banner}
        fill={scarlet.shadow}
        opacity=".24"
        transform="translate(2 3)"
      />
      <SewnPatch
        d={banner}
        stitches={bannerRows}
        floss={scarlet}
        folded
        edge={2}
        width={1.2}
      />
      <SewnPatch
        d="M61 179 95 195 93 180 62 173Z"
        stitches={Array.from(
          { length: 25 },
          (_, i) => `M${59 + i * 1.5} 170l-2 27`,
        ).join(" ")}
        floss={indigo}
        edge={1.1}
      />
      <GoldBinding d={banner} width={3.1} />
      <NookThread
        d="M29 60 32 185 61 171 89 184 91 60"
        {...gold}
        width={1.1}
        dasharray=".85 2.6"
      />
      <GoldBinding d="M23 54Q60 60 97 54" width={1.8} />
      {[28, 86].map((x) => (
        <g key={x}>
          <SewnPatch
            d={`M${x} 46q4-4 7 0l-1 15h-7Z`}
            stitches={Array.from(
              { length: 7 },
              (_, i) => `M${x + i * 1.15} 44q-1 8 0 19`,
            ).join(" ")}
            floss={scarlet}
            edge={1.1}
          />
          <GoldBinding
            d={`M${x} 49q3-2 6 0M${x + 2} 58q2-2 3 0q-1 3-3 0`}
            width={1.4}
          />
        </g>
      ))}
      <g transform="translate(-1 0) rotate(-2 60 123)">
        <ResistanceGriffin />
      </g>
      <GoldBinding
        d="M52 164 60 160 68 164 60 168ZM37 66l4 4-4 4M83 66l-4 4 4 4"
        width={1.3}
      />
      <Tassel x={26} y={199} />
      <Tassel x={95} y={198} />
    </svg>
  );
}

const polar = (radius: number, angle: number) => {
  const radians = (angle / 180) * Math.PI;
  return [58 + Math.cos(radians) * radius, 92 + Math.sin(radians) * radius];
};
const point = (radius: number, angle: number) => polar(radius, angle).join(" ");
const fanAngles = Array.from({ length: 11 }, (_, i) => -147 + i * 11.4);

/** A Doman-inspired folded silk fan, tied to the letter with scarlet floss. */
export function NookStormbloodCharm() {
  return (
    <svg
      className="nook-stormblood-charm"
      viewBox="0 0 116 140"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {fanAngles.map((angle) => (
        <GoldBinding
          key={angle}
          d={`M58 94  ${point(64, angle)}`}
          width={1.5}
        />
      ))}
      {fanAngles.slice(0, -1).map((angle, panel) => {
        const end = fanAngles[panel + 1];
        const d = `M${point(64, angle)}A64 64 0 0 1 ${point(64, end)}L${point(23, end)}A23 23 0 0 0 ${point(23, angle)}Z`;
        const stitches = Array.from({ length: 11 }, (_, i) => {
          const a = angle + i * 1.14;
          return `M${point(22, a)}Q${point(43, a + 0.45)} ${point(66, a)}`;
        }).join(" ");
        return (
          <SewnPatch
            key={angle}
            d={d}
            stitches={stitches}
            floss={panel < 2 || panel > 7 ? scarlet : indigo}
            folded
            edge={0.8}
            width={1.15}
          />
        );
      })}
      <SewnPatch
        d="M69 44a11 11 0 1 1-22 0a11 11 0 1 1 22 0Z"
        stitches={Array.from(
          { length: 18 },
          (_, i) => `M${47 + i * 1.3} 32q-2 11 .5 24`,
        ).join(" ")}
        floss={scarlet}
        edge={1}
      />
      <NookThread
        d="M34 62q7-6 12-1q-4 6-11 5m34-7q5-6 11-1q5 4-2 6M43 71q15-6 30 0"
        {...ivory}
        width={1.25}
      />
      {fanAngles.map((angle) => (
        <NookThread
          key={angle}
          d={`M58 94 ${point(63, angle)}`}
          {...gold}
          width={0.85}
          opacity={0.9}
        />
      ))}
      <GoldBinding
        d={`M${point(64, -147)}A64 64 0 0 1 ${point(64, -33)}M${point(23, -147)}A23 23 0 0 1 ${point(23, -33)}`}
        width={1.75}
      />
      <SewnPatch
        d="M54 90q4-3 8 0l-1 7h-6Z"
        stitches="M55 89v9M56.5 89v9M58 89v9M59.5 89v9M61 89v9"
        floss={gold}
        edge={1.1}
        width={1.15}
      />
      <NookThread
        d="M58 95Q42 78 40 91Q42 100 58 95Q71 81 76 89Q79 100 58 95Q47 108 52 116M58 95Q68 105 66 117"
        {...scarlet}
        width={2.4}
        relief={1.7}
      />
      <NookThread d="M55 94q2-4 5-1q2 3-1 5q-4 0-4-4" {...gold} width={1.5} />
      <Tassel x={66} y={116} floss={scarlet} />
    </svg>
  );
}

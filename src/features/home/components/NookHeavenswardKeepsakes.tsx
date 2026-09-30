import { useId } from "react";
import { NookThread } from "./NookThread";

const silver = {
  color: "var(--hw-silver, #c5cfda)",
  shadow: "#52647a",
  highlight: "#eef1ed",
};
const blue = {
  color: "var(--hw-cloth, #354b72)",
  shadow: "#23344e",
  highlight: "var(--hw-cloth-light, #6c80a0)",
};
const wine = {
  color: "var(--hw-wine, #814b5d)",
  shadow: "#543443",
  highlight: "#b38693",
};
const banner = "M23 51Q59 54 97 51L94 164Q91 183 60 209Q28 184 26 166Z";
const wing = "M56 134C40 136 31 112 32 88L39 99L40 85L47 106L49 99L55 119Z";
const hem =
  "M27 59L30 164Q31 181 60 204Q88 181 90 164L94 59L90 61L86 164Q83 179 60 198Q36 179 34 164L31 60Z";
const lining = "M93 160Q90 185 60 209L54 203Q78 185 88 163Z";
const cord = "M16 49Q39 31 60 13Q80 31 104 49";
const pole = "M13 49Q60 47 107 50";
const mix = (a: string, b: string, weight: number) =>
  `color-mix(in srgb, ${a} ${weight}%, ${b})`;

// Rows sag between the two hanging loops and bend around the vertical folds.
const bannerStitches = Array.from({ length: 112 }, (_, i) => {
  const y = 50 + i * 1.45;
  const sag = 2.8 + Math.sin((i / 112) * Math.PI) * 2.2;
  return `M21 ${y}C34 ${y + 1.2} 43 ${y + sag + 2} 56 ${y + sag}S83 ${y + sag + 1} 99 ${y - 0.4}`;
}).join(" ");
const hemWraps = [
  ...Array.from({ length: 35 }, (_, i) => {
    const y = 59 + i * 3;
    const x = 26.7 + i * 0.09;
    return `M${x} ${y}l5.3 .5M${120 - x} ${y}l-5.3 .5`;
  }),
  ...Array.from({ length: 17 }, (_, i) => {
    const t = i / 16;
    const outerX = 30 + 2 * t + 28 * t * t;
    const outerY = 164 + 34 * t + 6 * t * t;
    const innerX = 34 + 4 * t + 22 * t * t;
    const innerY = 164 + 30 * t + 4 * t * t;
    return `M${outerX} ${outerY} ${innerX} ${innerY}M${120 - outerX} ${outerY} ${120 - innerX} ${innerY}`;
  }),
].join(" ");
const featherRows = (x: number, y: number, h: number, drift: number) =>
  Array.from({ length: Math.ceil(h / 1.3) }, (_, i) => {
    const u = (i * 1.3) / h;
    return `M${x + drift * u * u} ${y + i * 1.3}q6-.8 13 4.2`;
  }).join(" ");

/** Each appliqué has its own clipped grain and raised, bound edge. */
function SewnPatch({
  d,
  stitches,
  floss,
  width = 1.5,
  edge = 1.65,
  surface = "padded",
}: {
  d: string;
  stitches: string;
  floss: typeof silver;
  width?: number;
  edge?: number;
  surface?: "padded" | "folded";
}) {
  const id = `${useId().replace(/:/g, "")}-hw-patch`;
  const shade = mix(floss.color, floss.shadow, 72);
  const light = mix(floss.color, floss.highlight, 55);
  const paint = `url(#${id}-padding)`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
        {surface === "folded" ? (
          <linearGradient id={`${id}-padding`} x2="1" y2=".04">
            <stop stopColor={shade} />
            <stop offset=".15" stopColor={floss.color} />
            <stop offset=".27" stopColor={light} />
            <stop offset=".42" stopColor={floss.color} />
            <stop offset=".48" stopColor={shade} />
            <stop offset=".66" stopColor={floss.color} />
            <stop offset=".76" stopColor={light} />
            <stop offset="1" stopColor={shade} />
          </linearGradient>
        ) : (
          <radialGradient id={`${id}-padding`} cx=".32" cy=".24" r=".85">
            <stop stopColor={light} />
            <stop offset=".53" stopColor={floss.color} />
            <stop offset="1" stopColor={shade} />
          </radialGradient>
        )}
      </defs>
      <path
        d={d}
        fill={floss.shadow}
        opacity=".27"
        transform="translate(.4 .7)"
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
        width={edge * 0.72}
        dasharray=".75 2.45 .65 2.8"
        relief={1.2}
        opacity={0.72}
      />
    </g>
  );
}

function HeraldicWing() {
  return (
    <g>
      <SewnPatch
        d={wing}
        stitches={featherRows(30, 85, 50, 15)}
        floss={silver}
        width={1.2}
        edge={1.6}
      />
      <SewnPatch
        d="M32 88Q31 113 44 127Q50 133 56 134Q43 120 39 99Z"
        stitches={featherRows(29, 88, 46, 17)}
        floss={silver}
        width={1.13}
        edge={0.85}
      />
      <SewnPatch
        d="M40 85Q38 108 47 123L56 134Q49 115 47 106Z"
        stitches={featherRows(38, 85, 49, 12)}
        floss={silver}
        width={1.13}
        edge={0.85}
      />
      <SewnPatch
        d="M49 99Q47 118 56 134L55 119Z"
        stitches={featherRows(46, 99, 35, 5)}
        floss={silver}
        width={1.1}
        edge={0.8}
      />
      <NookThread
        d="M33 94Q35 117 51 131M41 92Q43 113 53 130M49 106Q51 122 55 131"
        color={silver.highlight}
        shadow={silver.color}
        highlight={silver.highlight}
        width={0.8}
        opacity={0.72}
      />
    </g>
  );
}

/** Silver wings and a watchful lance, embroidered for a snowy northern home. */
export function NookHeavenswardBanner() {
  return (
    <svg
      className="nook-wall-hanging nook-hw-banner"
      viewBox="0 0 120 230"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <NookThread d={cord} {...silver} width={2.3} />
      <NookThread
        d={cord}
        color={silver.shadow}
        shadow={silver.color}
        highlight={silver.highlight}
        width={1.7}
        dasharray=".65 2.2"
        opacity={0.6}
      />
      <NookThread d="M58 11q0-3 3-2q3 2 0 5q-3 2-3-3" {...silver} width={2.2} />
      {[29, 85].map((x) => (
        <NookThread
          key={x}
          d={`M${x} 55V47q0-5 4-4q5 0 4 6v5`}
          color={silver.shadow}
          shadow={blue.shadow}
          highlight={silver.color}
          width={2.8}
        />
      ))}
      <NookThread d={pole} {...silver} width={4.5} />
      <NookThread
        d={pole}
        color={silver.highlight}
        shadow={silver.color}
        highlight={silver.highlight}
        width={2.1}
        dasharray="1 2.4"
        opacity={0.72}
      />
      {[13, 107].map((x) => (
        <NookThread
          key={x}
          d={`M${x} 47.5q-3 1.5-1 4q3 2 3-1q1-3-2-3`}
          {...silver}
          width={1.7}
        />
      ))}
      <path
        d={banner}
        fill={blue.shadow}
        opacity=".25"
        transform="translate(3 4)"
      />
      <SewnPatch
        d={banner}
        stitches={bannerStitches}
        floss={blue}
        width={1.25}
        edge={2.1}
        surface="folded"
      />
      <SewnPatch
        d={lining}
        stitches={Array.from(
          { length: 30 },
          (_, i) => `M${52 + i * 1.5} 167q4 20 6 45`,
        ).join(" ")}
        floss={wine}
        width={1.25}
        edge={1.2}
      />
      <SewnPatch
        d={hem}
        stitches={hemWraps}
        floss={wine}
        width={1.8}
        edge={1.15}
      />
      <NookThread
        d="M26 54Q60 60 94 54M38 60Q33 86 37 105M82 65Q85 116 80 151"
        color={blue.highlight}
        shadow={blue.color}
        highlight={silver.color}
        width={0.85}
        opacity={0.45}
      />
      <NookThread
        d="M32 62 35 163Q39 180 60 197Q82 178 84 163L88 62"
        {...silver}
        width={1.4}
        dasharray=".95 2.55"
      />
      {[29, 85].map((x) => (
        <g key={x}>
          <SewnPatch
            d={`M${x} 47q3-3 7 0l-1 15q-3 2-6 0Z`}
            stitches={Array.from(
              { length: 7 },
              (_, i) => `M${x + i * 1.15} 45q-1 8 .1 20`,
            ).join(" ")}
            floss={silver}
            width={1.05}
            edge={1.2}
          />
          <NookThread
            d={`M${x + 0.5} 49q3.2-1 6 0M${x + 1} 59h4`}
            {...silver}
            width={1.2}
            dasharray=".7 1.2"
          />
        </g>
      ))}
      <g transform="rotate(-2 60 127)">
        <HeraldicWing />
        <g transform="translate(120 0) scale(-1 1)">
          <HeraldicWing />
        </g>
        <NookThread
          d="M60 93V170M54 153H66M57 157H63"
          {...silver}
          width={2.8}
        />
        <NookThread
          d="M60 97V168M54 153H66"
          color={silver.highlight}
          shadow={silver.color}
          highlight={silver.highlight}
          width={1.75}
          dasharray=".8 2.3"
        />
        <SewnPatch
          d="M60 75 65 90 60 100 55 90Z"
          stitches="M60 76 55 86M60 78 55 88M60 80 55 90M60 82 55 92M60 84 56 94M60 86 57 96M60 88 58 98M60 76 65 86M60 78 65 88M60 80 65 90M60 82 65 92M60 84 64 94M60 86 63 96M60 88 62 98"
          floss={silver}
          width={1.2}
          edge={1.3}
        />
        <NookThread
          d="M60 77V97"
          color={silver.highlight}
          shadow={silver.color}
          highlight={silver.highlight}
          width={0.85}
        />
        <NookThread
          d="M52 140Q60 145 68 140M57 174 60 179 63 174"
          {...wine}
          width={2.1}
        />
      </g>
      <NookThread
        d="M59 206q-4 3-2 6q4 3 6-1q1-3-4-5"
        {...silver}
        width={1.4}
      />
      <SewnPatch
        d="M58 212Q55 217 54 224Q60 227 66 224Q65 217 62 212Z"
        stitches="M58 212 54 225M59.3 212 57 226M60.6 212 60 227M62 212 63 226M63 214 66 225"
        floss={silver}
        width={1.35}
        edge={0.8}
      />
      <NookThread d="M57 213q3 2 6 0M57 215q3 2 6 0" {...wine} width={1.35} />
      <NookThread
        d="M54 224l-1 2M57 225l-.3 2M60 226v2M63 225l.6 2M66 224l1 2"
        {...silver}
        width={0.7}
      />
    </svg>
  );
}

const seal =
  "M49 16Q58 13 64 21Q76 20 80 31Q89 37 84 48Q90 59 81 67Q79 79 66 80Q57 90 47 84Q35 89 29 80Q17 79 16 66Q8 58 14 47Q9 35 20 29Q23 18 36 21Q42 14 49 16Z";

/** A padded wine-red seal with a silver snow-lily and soft ribbon tails. */
export function NookHeavenswardSeal() {
  const stitches = Array.from({ length: 54 }, (_, i) => {
    const x = 11 + i * 1.45;
    return `M${x} 12C${x - 6} 35 ${x - 5} 64 ${x + 1} 89`;
  }).join(" ");
  return (
    <svg
      className="nook-hw-seal"
      viewBox="0 0 100 130"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <SewnPatch
        d="M26 65 48 70 37 124 27 115 16 118Z"
        stitches={Array.from(
          { length: 21 },
          (_, i) => `M${24 + i * 1.3} 63q-2 24-12 64`,
        ).join(" ")}
        floss={blue}
        width={1.15}
        surface="folded"
      />
      <SewnPatch
        d="M52 69 73 64 87 117 76 113 67 123Z"
        stitches={Array.from(
          { length: 21 },
          (_, i) => `M${50 + i * 1.3} 62q10 22 16 64`,
        ).join(" ")}
        floss={blue}
        width={1.15}
        surface="folded"
      />
      <NookThread
        d="M29 79 23 108M69 78 78 106"
        {...silver}
        width={1}
        dasharray="2 2.7"
      />
      <path
        d={seal}
        fill={wine.shadow}
        opacity=".25"
        transform="translate(2 3)"
      />
      <SewnPatch
        d={seal}
        stitches={stitches}
        floss={wine}
        width={1.25}
        edge={2.2}
      />
      <NookThread
        d="M50 24a28 28 0 1 1-.1 0"
        color={wine.color}
        shadow={wine.shadow}
        highlight={wine.highlight}
        width={2.2}
      />
      <NookThread
        d="M50 25a27 27 0 1 1-.1 0"
        {...silver}
        width={1.1}
        dasharray="1.8 2.1"
      />
      <SewnPatch
        d="M50 34Q38 46 50 60Q61 46 50 34ZM47 59Q31 55 29 43Q43 42 47 59ZM53 59Q69 55 71 43Q57 42 53 59Z"
        stitches="M50 34V60M48.5 35q-1 10 0 23M47 36q-1 10 0 21M45.5 39q-1 8 0 15M51.5 35q1 10 0 23M53 36q1 10 0 21M54.5 39q1 8 0 15M29 43q6 3 18 16M29 45q6 3 18 16M30 47q6 3 17 16M31 49q6 3 16 14M32 43q6 3 15 12M35 43q6 3 12 10M71 43q-6 3-18 16M71 45q-6 3-18 16M70 47q-6 3-17 16M69 49q-6 3-16 14M68 43q-6 3-15 12M65 43q-6 3-12 10"
        floss={silver}
        width={1.2}
        edge={1.3}
      />
      <NookThread
        d="M50 58V72M40 64Q50 72 60 64M44 73l6-5 6 5M47 61H53"
        {...silver}
        width={1.5}
      />
    </svg>
  );
}

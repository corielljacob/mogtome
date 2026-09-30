import { useId } from "react";
import { NookThread } from "./NookThread";

const navy = {
  color: "var(--ew-cloth, #526c83)",
  shadow: "var(--ew-cloth-dark, #32485d)",
  highlight: "var(--ew-cloth-light, #94aab8)",
};
const gold = {
  color: "var(--ew-gold, #b5a375)",
  shadow: "var(--ew-gold-dark, #7a7057)",
  highlight: "var(--ew-gold-light, #e3d7b4)",
};
const ivory = {
  color: "var(--ew-thread, #f1efe4)",
  shadow: "#b7b9b6",
  highlight: "var(--ew-paper, #f7f0e2)",
};
const blueSilk = {
  color: "var(--ew-flower, #b8cde0)",
  shadow: "var(--ew-flower-dark, #7e9bac)",
  highlight: "var(--ew-flower-light, #edf3ee)",
};
const whiteSilk = {
  color: blueSilk.highlight,
  shadow: blueSilk.color,
  highlight: "#fffdf0",
};
const mix = (a: string, b: string, weight: number) =>
  `color-mix(in srgb, ${a} ${weight}%, ${b})`;
const rows = (count: number, path: (i: number) => string) =>
  Array.from({ length: count }, (_, i) => path(i)).join(" ");

/** Short satin runs fan from the base of a petal towards its curled lip. */
function fanStitches(
  x: number,
  y: number,
  tx: number,
  ty: number,
  spread: number,
  count: number,
) {
  const length = Math.hypot(tx - x, ty - y);
  const px = -(ty - y) / length;
  const py = (tx - x) / length;
  return rows(count, (i) => {
    const offset = (i / (count - 1) - 0.5) * spread;
    return `M${x + px * offset * 0.2} ${y + py * offset * 0.2}Q${(x + tx) / 2 + px * offset * 0.65} ${(y + ty) / 2 + py * offset * 0.65} ${tx + px * offset} ${ty + py * offset}`;
  });
}

function SewnPatch({
  d,
  stitches,
  floss,
  folded = false,
  edge = 1.3,
  width = 1.1,
}: {
  d: string;
  stitches: string;
  floss: typeof navy;
  folded?: boolean;
  edge?: number;
  width?: number;
}) {
  const id = `${useId().replace(/:/g, "")}-ew-patch`;
  const shade = mix(floss.color, floss.shadow, 69);
  const light = mix(floss.color, floss.highlight, 51);
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
            <stop offset=".16" stopColor={floss.color} />
            <stop offset=".28" stopColor={light} />
            <stop offset=".45" stopColor={shade} />
            <stop offset=".65" stopColor={floss.color} />
            <stop offset=".79" stopColor={light} />
            <stop offset="1" stopColor={shade} />
          </linearGradient>
        ) : (
          <radialGradient id={`${id}-padding`} cx=".32" cy=".25" r=".85">
            <stop stopColor={light} />
            <stop offset=".54" stopColor={floss.color} />
            <stop offset="1" stopColor={shade} />
          </radialGradient>
        )}
      </defs>
      <path
        d={d}
        fill={floss.shadow}
        opacity=".32"
        transform="translate(.45 .75)"
      />
      <path d={d} fill={paint} />
      <g clipPath={`url(#${id})`}>
        <NookThread
          d={stitches}
          color={paint}
          shadow={shade}
          highlight={light}
          width={width}
          relief={1.65}
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
        width={edge * 0.63}
        dasharray=".7 2.15 .85 2.5"
        opacity={0.68}
      />
    </g>
  );
}

function Binding({
  d,
  width = 2.3,
  floss = gold,
}: {
  d: string;
  width?: number;
  floss?: typeof navy;
}) {
  return (
    <g>
      <NookThread d={d} {...floss} width={width} relief={1.6} />
      <NookThread
        d={d}
        color={floss.highlight}
        shadow={floss.color}
        highlight={ivory.highlight}
        width={width * 0.63}
        dasharray=".7 2.1 .85 2.4"
        opacity={0.8}
      />
    </g>
  );
}

const banner = "M23 51Q60 54 97 51L94 191Q60 213 26 191Z";
const face = "M28 59Q60 62 92 59L89 186Q60 203 31 186Z";
const bannerRows = rows(115, (i) => {
  const y = 49 + i * 1.4;
  const sag = 2 + Math.sin((i / 115) * Math.PI) * 2.5;
  return `M21 ${y}C35 ${y + 1} 42 ${y + sag + 2} 58 ${y + sag}S82 ${y + sag + 1} 99 ${y - 0.2}`;
});
const moon =
  "M62 101C43 101 35 117 41 133C46 147 62 153 74 143C58 146 49 133 51 120C52 112 56 106 62 101Z";
const moonGrain = rows(31, (i) => {
  const y = 100 + i * 1.5;
  return `M34 ${y}Q47 ${y - 6} 56 ${y - 2}Q64 ${y + 2} 77 ${y + 1}`;
});

function KnottedStar({
  x,
  y,
  size = 2.5,
}: {
  x: number;
  y: number;
  size?: number;
}) {
  return (
    <g>
      <NookThread
        d={`M${x} ${y - size}v${size * 2}M${x - size} ${y}h${size * 2}`}
        {...ivory}
        width={1.05}
      />
      <NookThread
        d={`M${x - 0.6} ${y - 0.7}q1.6-.8 1.5.8q-.8 1.4-1.5-.8Z`}
        {...gold}
        color={gold.highlight}
        width={1.15}
      />
    </g>
  );
}

/** A padded lunar chart, with an Earth-blue keepsake caught in its couched orbit. */
function CelestialAstrolabe() {
  return (
    <g>
      <SewnPatch
        d="M89 126a29 31 0 1 1-58 0a29 31 0 1 1 58 0Z"
        stitches={rows(
          48,
          (i) => `M29 ${94 + i * 1.4}Q58 ${100 + i * 1.4} 91 ${93 + i * 1.4}`,
        )}
        floss={navy}
        edge={1.6}
        width={1.18}
      />
      <Binding d="M89 126a29 31 0 1 1-58 0a29 31 0 1 1 58 0Z" width={1.8} />
      <NookThread
        d={rows(20, (i) => {
          const a = (i * 18 * Math.PI) / 180;
          return `M${60 + Math.cos(a) * 30} ${126 + Math.sin(a) * 32}l${Math.cos(a) * 2.2} ${Math.sin(a) * 2.2}`;
        })}
        {...gold}
        width={0.75}
      />
      <Binding
        d="M30 143C29 134 49 119 70 115C91 111 99 116 86 129"
        width={1.65}
      />
      <SewnPatch
        d={moon}
        stitches={moonGrain}
        floss={{ ...ivory, shadow: blueSilk.shadow }}
        edge={1.5}
        width={1.18}
      />
      <NookThread
        d="M44 119q-3 1-2 4q2 2 4 0M49 136q-2-1-3 1q0 3 3 3M46 110l.3-.4M56 144h.4"
        {...ivory}
        color={blueSilk.color}
        shadow={blueSilk.shadow}
        width={0.7}
        opacity={0.68}
      />
      <Binding d="M86 129C73 141 42 152 30 143" width={1.65} />
      <SewnPatch
        d="M86 139a9 9 0 1 1-18 0a9 9 0 1 1 18 0Z"
        stitches={rows(
          16,
          (i) => `M${67 + i * 1.3} 129Q${63 + i * 1.5} 137 ${67 + i * 1.3} 149`,
        )}
        floss={{ ...blueSilk, color: mix(blueSilk.color, navy.color, 66) }}
        edge={1.3}
      />
      <SewnPatch
        d="M72 132q4-2 6 0l-2 3 2 3-4 1-2 4-2-3 1-4Z"
        stitches="M70 131l8 2M70 133l8 2M70 135l8 2M69 137l8 2M70 139l6 2M71 141l4 2"
        floss={blueSilk}
        edge={0.5}
        width={0.85}
      />
      <NookThread
        d="M79 143q3-2 5-1M73 132q3-1 5 0"
        {...whiteSilk}
        width={0.75}
        opacity={0.85}
      />
      <KnottedStar x={73} y={108} size={2.4} />
      <KnottedStar x={64} y={122} size={2.1} />
      <NookThread d="M79 121h.2M62 136h.2M39 140h.2" {...ivory} width={1.55} />
      <Binding d="M60 158v6M55 169l5-4 5 4-5 4ZM48 180q12 5 24 0" width={1.3} />
      <KnottedStar x={60} y={184} size={2.4} />
      <SewnPatch
        d="M60 76 62 82 67 84 62 86 60 92 58 86 53 84 58 82Z"
        stitches={fanStitches(60, 88, 60, 76, 16, 16)}
        floss={navy}
        edge={0.85}
      />
      <Binding d="M59.8 81v6M57.5 84h4.5" width={0.8} />
    </g>
  );
}

function Tassel({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Binding d="M0-4q-4 4-1 6q4 0 2-5Z" width={1.3} />
      <SewnPatch
        d="M-2 3Q-4 9-4 17Q0 20 4 17Q4 9 2 3Z"
        stitches="M-2 3Q-4 12-4 19M-.7 3Q-2 12-2 20M.6 3V20M2 3Q3 12 3 19M3 7Q4 13 4 18"
        floss={gold}
        edge={0.7}
      />
      <Binding d="M-2 4h4M-3 6h6" width={1.1} />
    </g>
  );
}

export function NookEndwalkerBanner() {
  return (
    <svg
      className="nook-wall-hanging nook-hanging nook-endwalker-banner"
      viewBox="0 0 120 230"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Binding d="M15 47Q36 34 60 12Q84 34 105 47" width={1.8} />
      <Binding
        d="M59 9q-3 2-1 5q4 2 5-1q1-4-4-4M12 48Q60 46 108 49"
        width={3.3}
      />
      {[12, 108].map((x) => (
        <Binding key={x} d={`M${x} 46q-3 2-1 5q5 2 3-4Z`} width={2} />
      ))}
      <path
        d={banner}
        fill={navy.shadow}
        opacity=".2"
        transform="translate(1.6 2.5)"
      />
      <SewnPatch
        d={banner}
        stitches={bannerRows}
        floss={navy}
        folded
        edge={2}
        width={1.2}
      />
      <SewnPatch
        d={face}
        stitches={bannerRows}
        floss={ivory}
        folded
        edge={1.2}
        width={1.2}
      />
      <Binding d={banner} width={2.6} />
      <NookThread
        d="M28 63 32 187Q60 204 88 187L92 63"
        {...gold}
        width={1.1}
        dasharray=".8 2.3"
      />
      <Binding d="M23 55Q60 60 97 55" width={1.4} />
      {[29, 85].map((x) => (
        <g key={x}>
          <SewnPatch
            d={`M${x} 46q4-4 7 0v15h-7Z`}
            stitches={rows(7, (i) => `M${x + i * 1.2} 43q-2 9 0 20`)}
            floss={navy}
            edge={1}
          />
          <Binding d={`M${x} 49q4-2 7 0M${x + 2} 58h3`} width={1.2} />
        </g>
      ))}
      <CelestialAstrolabe />
      <NookThread
        d="M37 77l2 2-2 2M83 77l-2 2 2 2M40 190q7 5 12 5M68 195q7-1 12-5"
        {...navy}
        width={1.05}
      />
      <Tassel x={27} y={196} />
      <Tassel x={93} y={196} />
    </svg>
  );
}

const petals = [
  {
    d: "M48 62Q30 51 31 32Q38 24 47 36Q54 42 54 56Z",
    x: 49,
    y: 63,
    tx: 34,
    ty: 26,
    spread: 22,
    pale: false,
  },
  {
    d: "M48 59Q42 44 46 26Q53 18 59 26Q66 20 69 29Q73 44 57 59Z",
    x: 52,
    y: 62,
    tx: 58,
    ty: 21,
    spread: 28,
    pale: false,
  },
  {
    d: "M52 60Q57 39 72 34Q79 31 82 40Q85 52 67 61Z",
    x: 51,
    y: 64,
    tx: 82,
    ty: 35,
    spread: 24,
    pale: false,
  },
  {
    d: "M46 65Q28 64 17 51Q16 45 24 43Q35 40 50 58Z",
    x: 52,
    y: 64,
    tx: 17,
    ty: 46,
    spread: 26,
    pale: false,
  },
  {
    d: "M52 63Q67 48 84 49Q91 53 82 61Q69 71 54 69Z",
    x: 50,
    y: 63,
    tx: 88,
    ty: 57,
    spread: 23,
    pale: false,
  },
  {
    d: "M48 65Q33 61 27 50Q27 43 34 46Q42 45 51 58Z",
    x: 50,
    y: 63,
    tx: 29,
    ty: 43,
    spread: 19,
    pale: true,
  },
  {
    d: "M49 59Q42 48 47 37Q52 32 57 39Q64 37 63 46L57 60Z",
    x: 53,
    y: 62,
    tx: 52,
    ty: 34,
    spread: 20,
    pale: true,
  },
  {
    d: "M53 61Q59 46 69 45Q78 46 71 56L60 65Z",
    x: 51,
    y: 63,
    tx: 75,
    ty: 44,
    spread: 18,
    pale: true,
  },
];

/** Cupped Elpis petals are separate satin appliqués, not a flat flower silhouette. */
export function NookEndwalkerCharm() {
  return (
    <svg
      className="nook-endwalker-charm"
      viewBox="0 0 104 140"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Binding d="M51 63Q45 95 49 130" floss={navy} width={2.3} />
      <SewnPatch
        d="M47 99Q30 98 24 78Q43 80 47 99Z"
        stitches={fanStitches(48, 100, 24, 76, 21, 19)}
        floss={blueSilk}
        edge={1}
      />
      <SewnPatch
        d="M48 113Q57 91 80 86Q74 108 48 113Z"
        stitches={fanStitches(47, 115, 81, 84, 25, 24)}
        floss={blueSilk}
        edge={1}
      />
      <NookThread
        d="M27 81Q37 88 46 98M76 89Q66 100 49 111"
        {...navy}
        color={blueSilk.shadow}
        width={0.9}
      />
      <SewnPatch
        d="M40 92Q36 106 36 127L44 122 51 130Q51 109 53 97Z"
        stitches={rows(18, (i) => `M${33 + i * 1.3} 90q-2 19 0 44`)}
        floss={navy}
        folded
        edge={1.15}
      />
      <SewnPatch
        d="M51 93Q58 107 66 119L57 117 55 125Q46 109 44 99Z"
        stitches={rows(20, (i) => `M${39 + i * 1.3} 92q5 15 11 37`)}
        floss={navy}
        folded
        edge={1.05}
      />
      <SewnPatch
        d="M45 96Q27 91 29 83Q35 77 46 90L50 96Z"
        stitches={fanStitches(50, 96, 28, 83, 18, 18)}
        floss={navy}
        edge={1.3}
      />
      <SewnPatch
        d="M48 94Q57 81 64 84Q74 94 51 99Z"
        stitches={fanStitches(48, 97, 65, 85, 17, 18)}
        floss={navy}
        edge={1.3}
      />
      <Binding d="M45 93q4-3 7 0l-1 6h-5Z" width={1.7} />
      <NookThread
        d="M40 112v9M57 111l3 5"
        {...gold}
        width={0.85}
        dasharray=".7 1.8"
      />
      {petals.map((petal) => (
        <SewnPatch
          key={petal.d}
          d={petal.d}
          stitches={fanStitches(
            petal.x,
            petal.y,
            petal.tx,
            petal.ty,
            petal.spread,
            27,
          )}
          floss={petal.pale ? whiteSilk : blueSilk}
          edge={1.05}
          width={1.02}
        />
      ))}
      <SewnPatch
        d="M45 60Q40 56 43 50Q46 46 49 50Q53 45 57 50Q63 50 62 57Q59 65 51 66Z"
        stitches={fanStitches(51, 65, 52, 46, 26, 25)}
        floss={whiteSilk}
        edge={1}
      />
      <NookThread
        d="M48 60 46 51M51 60V47M54 60 57 49M56 61 60 54"
        {...gold}
        color={gold.highlight}
        width={1.1}
      />
      <NookThread
        d="M45.5 50.5l1 1M50.5 47h1M56.5 49l1 .5M59.5 54l1 .5"
        {...whiteSilk}
        width={1.9}
        relief={1.5}
      />
      <SewnPatch
        d="M50 67Q37 69 28 61Q25 56 31 55Q42 54 52 64Z"
        stitches={fanStitches(52, 66, 26, 58, 21, 22)}
        floss={blueSilk}
        edge={1.05}
      />
      <SewnPatch
        d="M50 65Q61 57 72 58Q80 61 71 68Q60 75 50 68Z"
        stitches={fanStitches(49, 66, 75, 64, 20, 22)}
        floss={blueSilk}
        edge={1.05}
      />
      <SewnPatch
        d="M39 65Q49 61 58 65Q65 69 59 74Q48 78 40 73Q35 68 39 65Z"
        stitches={fanStitches(50, 64, 49, 78, 30, 25)}
        floss={whiteSilk}
        edge={1.1}
      />
      <NookThread d="M39 65Q49 62 59 65" {...whiteSilk} width={1.3} />
    </svg>
  );
}

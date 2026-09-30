import { useId } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";

const crystalOutline = "M50 39 72 65 66 103 47 132 29 99 27 66Z";
const pennantOutline = "M23 52Q59 55 96 52L92 179 60 207 25 180Z";
const emblemOutline = "M59 96 71 115 65 138 59 149 48 128 47 113Z";
const goldBorder = "M29 60Q30 117 31 176L60 200 86 175Q88 118 89 61";
const crystal = "var(--arr-crystal)";
const ice = "var(--arr-crystal-light)";
const blue = "var(--arr-crystal-dark)";
const paper = "var(--scene-paper)";
const gold = "var(--scene-gold)";
const brass = "var(--scene-brass)";
const n = (value: number) => value.toFixed(2);
const mix = (a: string, b: string, amount: number) =>
  `color-mix(in srgb, ${a} ${amount}%, ${b})`;

interface SilkFacet {
  name: string;
  d: string;
  bounds: [number, number, number, number];
  tilt: number;
  color: string;
}

// Each plane has its own sewing direction. Rows bow across the padding and
// stop at that facet's seam rather than carrying one grain across the crystal.
function facetSatin({ bounds: [x, y, w, h], tilt }: SilkFacet) {
  const bundles = ["", ""];
  const margin = Math.abs(tilt) + 3;
  const count = Math.ceil((h + margin * 2) / 1.85);
  for (let row = 0; row <= count; row++) {
    const sy = y - margin + row * 1.85;
    const bow = 0.85 + threadVariation(row, 402) * 0.3;
    bundles[row % 2] +=
      `M${n(x - 2)} ${n(sy + tilt)}Q${n(x + w * 0.46)} ${n(sy - bow)} ${n(x + w + 2)} ${n(sy - tilt)} `;
  }
  return bundles;
}

const charmFacets = [
  {
    name: "left",
    d: "M50 39 27 66 29 99 47 132 40 71Z",
    bounds: [27, 39, 23, 93],
    tilt: -7,
    color: ice,
  },
  {
    name: "crown",
    d: "M50 39 40 71 56 69Z",
    bounds: [40, 39, 16, 32],
    tilt: 5,
    color: mix(ice, paper, 75),
  },
  {
    name: "right",
    d: "M50 39 72 65 66 103 56 69Z",
    bounds: [50, 39, 22, 64],
    tilt: 10,
    color: blue,
  },
  {
    name: "heart",
    d: "M40 71 56 69 47 132Z",
    bounds: [40, 69, 16, 63],
    tilt: 2.8,
    color: crystal,
  },
  {
    name: "tip",
    d: "M56 69 66 103 47 132Z",
    bounds: [47, 69, 19, 63],
    tilt: -8,
    color: mix(crystal, blue, 65),
  },
] satisfies SilkFacet[];
const emblemFacets = [
  {
    name: "left-crown",
    d: "M59 96 47 113 58 117Z",
    bounds: [47, 96, 12, 21],
    tilt: -4,
    color: ice,
  },
  {
    name: "left-tip",
    d: "M47 113 48 128 59 149 58 117Z",
    bounds: [47, 113, 12, 36],
    tilt: 3.4,
    color: mix(ice, crystal, 76),
  },
  {
    name: "right-crown",
    d: "M59 96 58 117 71 115Z",
    bounds: [58, 96, 13, 21],
    tilt: 5,
    color: crystal,
  },
  {
    name: "right-tip",
    d: "M58 117 59 149 65 138 71 115Z",
    bounds: [58, 115, 13, 34],
    tilt: -4,
    color: mix(crystal, blue, 68),
  },
] satisfies SilkFacet[];
const sewnCharm = charmFacets.map((facet) => ({
  ...facet,
  satin: facetSatin(facet),
}));
const sewnEmblem = emblemFacets.map((facet) => ({
  ...facet,
  satin: facetSatin(facet),
}));

// The pennant hangs from two loops. Long-and-short cotton follows the soft
// lengthwise folds, with staggered needle entries and a little uneven tension.
const pennantSatin = (() => {
  const bundles = ["", "", ""];
  for (let column = 0; column < 40; column++) {
    const x = 20 + column * 2.05;
    const fold = Math.sin((x - 24) / 11) * 1.8;
    for (let row = 0; row < 12; row++) {
      const index = column * 12 + row;
      const y =
        44 +
        row * 14.2 +
        (column % 2) * 6.6 +
        threadVariation(index, 409) * 1.3;
      const length = 12.9 + threadVariation(index, 410) * 1.4;
      const drift = (x - 60) * 0.014 + fold * 0.3;
      bundles[column % 3] +=
        `M${n(x)} ${n(y)}q${n(fold + threadVariation(index, 411) * 0.3)} ${n(length * 0.47)} ${n(drift)} ${n(length)} `;
    }
  }
  return bundles;
})();
const compassCouching = Array.from({ length: 64 }, (_, i) => {
  const angle = (i / 64) * Math.PI * 2;
  const x = 59 + Math.cos(angle) * 28.7;
  const y = 121 + Math.sin(angle) * 28.7;
  return `M${n(x)} ${n(y)}q${n(Math.cos(angle + 0.25) * 1.9)} ${n(Math.sin(angle + 0.25) * 1.9)} ${n(Math.cos(angle) * 4)} ${n(Math.sin(angle) * 4)}`;
}).join(" ");
const compassKnots = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const x = 59 + Math.cos(angle) * 26.1;
  const y = 121 + Math.sin(angle) * 26.1;
  return `M${n(x - 0.7)} ${n(y)}q-.8-1.5 .8-1.5q1.9 .2 1 1.7q-1.5 1.3-1.8-.2`;
}).join(" ");

function ArrSilkFacet({ facet }: { facet: SilkFacet & { satin: string[] } }) {
  const id = `${useId().replace(/:/g, "")}-arr-silk`;
  const shade = mix(facet.color, blue, 62);
  const light = mix(facet.color, paper, 65);
  const paint = `url(#${id}-padding)`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={facet.d} />
        </clipPath>
        <linearGradient id={`${id}-padding`} x1="0" y1=".1" x2="1" y2=".7">
          <stop stopColor={shade} />
          <stop offset=".24" stopColor={facet.color} />
          <stop offset=".43" stopColor={light} />
          <stop offset=".68" stopColor={facet.color} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
      </defs>
      <path d={facet.d} fill={paint} />
      <g clipPath={`url(#${id})`}>
        {facet.satin.map((d, tone) => (
          <NookThread
            key={tone}
            d={d}
            color={tone ? facet.color : paint}
            shadow={shade}
            highlight={light}
            width={tone ? 1.45 : 1.55}
            relief={1.6}
          />
        ))}
      </g>
    </g>
  );
}

/** A padded cord held by little perpendicular stitches, like the lantern trim. */
function ArrGoldCord({ d, width = 2.5 }: { d: string; width?: number }) {
  return (
    <g>
      <NookThread
        d={d}
        color={gold}
        shadow={brass}
        highlight={paper}
        width={width}
        relief={1.5}
      />
      <NookThread
        d={d}
        color="var(--scene-wood-light)"
        shadow={brass}
        highlight={paper}
        width={width * 0.68}
        dasharray=".75 2.7 1 3.1"
        relief={1.1}
      />
    </g>
  );
}

/** A little crystal, sewn in blue silk and tied to a traveler's letter. */
export function NookArrCrystalCharm() {
  return (
    <svg
      className="nook-arr-crystal-charm"
      viewBox="0 0 100 150"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ArrGoldCord
        d="M5 10Q20 35 48 32Q78 30 95 13M49 33Q52 23 59 23Q65 25 57 31L49 33Q37 18 32 25Q29 32 49 33L39 47M49 33 61 44"
        width={2.4}
      />
      <path
        d={crystalOutline}
        fill="var(--scene-wood-dark)"
        opacity=".2"
        transform="translate(1.5 2)"
      />
      {sewnCharm.map((facet) => (
        <ArrSilkFacet key={facet.name} facet={facet} />
      ))}
      <NookThread
        d={crystalOutline}
        color={ice}
        shadow={blue}
        highlight={paper}
        width={2.1}
        relief={1.55}
      />
      <NookThread
        d="M50 39 40 71 47 132M40 71 56 69M50 39 56 69 66 103M56 69 47 132"
        color={ice}
        shadow={blue}
        highlight={paper}
        width={1.55}
        relief={1.5}
      />
      <NookThread
        d={crystalOutline}
        color={paper}
        shadow={crystal}
        highlight={paper}
        width={1.1}
        dasharray=".65 3.2"
        relief={1.2}
        opacity={0.85}
      />
      <ArrGoldCord
        d="M44 43Q50 46 55 44M43 46Q50 49 58 47M49 34Q45 35 46 40Q48 43 51 39Q54 35 49 34"
        width={2.6}
      />
      <NookThread
        d="M36 56 33 62M35 70 36 84M49 81 50 94"
        color={paper}
        shadow={crystal}
        highlight={paper}
        width={1.2}
        relief={1.3}
        opacity={0.8}
      />
    </svg>
  );
}

/** A stitched wayfinder pennant for the beginning of an Eorzean journey. */
export function NookArrWayfinder() {
  const id = `${useId().replace(/:/g, "")}-wayfinder`;
  const paint = (name: string) => `url(#${id}-${name})`;
  return (
    <svg
      className="nook-wall-hanging nook-arr-wayfinder"
      viewBox="0 0 120 230"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="1" y2=".16">
          <stop stopColor={blue} />
          <stop offset=".19" stopColor={crystal} />
          <stop offset=".3" stopColor={mix(crystal, ice, 80)} />
          <stop offset=".49" stopColor={blue} />
          <stop offset=".73" stopColor={crystal} />
          <stop offset=".84" stopColor={mix(crystal, ice, 77)} />
          <stop offset="1" stopColor={blue} />
        </linearGradient>
        <clipPath id={`${id}-cloth-clip`}>
          <path d={pennantOutline} />
        </clipPath>
      </defs>
      <ArrGoldCord d="M16 49Q44 32 60 13Q78 32 104 49" width={2.5} />
      <circle cx="60" cy="12" r="3" fill={gold} />
      <NookThread
        d="M58.5 12q-1-2 1.5-2q2.5 .5 1 2.5q-2 2-2.5-.5"
        color={gold}
        shadow={brass}
        highlight={paper}
        width={1.7}
        relief={1.4}
      />
      <path
        d={pennantOutline}
        fill="var(--scene-wood-dark)"
        opacity=".22"
        transform="translate(3 4)"
      />
      <path
        d="M13 48Q59 46 107 49L107 54Q60 51 13 53Z"
        fill="var(--scene-wood)"
      />
      <ArrGoldCord d="M13 49Q60 48 107 50" width={2.4} />
      <path d={pennantOutline} fill={paint("cloth")} />
      <g clipPath={paint("cloth-clip")}>
        {pennantSatin.map((d, tone) => (
          <NookThread
            key={tone}
            d={d}
            color={paint("cloth")}
            shadow={mix(blue, "var(--scene-shadow)", 82)}
            highlight={tone === 1 ? ice : crystal}
            width={tone === 1 ? 1.65 : 1.75}
            relief={1.65}
          />
        ))}
      </g>
      <NookThread
        d={pennantOutline}
        color={blue}
        shadow="var(--scene-shadow)"
        highlight={crystal}
        width={2.6}
        relief={1.55}
      />
      <NookThread
        d={pennantOutline}
        color={crystal}
        shadow={blue}
        highlight={ice}
        width={1.65}
        dasharray=".75 2.6"
        relief={1.3}
      />
      <ArrGoldCord d={goldBorder} width={2.8} />
      <NookThread
        d="M34 65 36 174 60 193 81 172 84 65"
        color={ice}
        shadow={blue}
        highlight={paper}
        width={1.4}
        dasharray="1.1 3"
        relief={1.5}
      />
      {[28, 84].map((x) => (
        <g key={x}>
          <path d={`M${x} 47q3-2 6 0v15h-6Z`} fill={paper} />
          <NookThread
            d={`M${x + 1} 47q1 7 0 14M${x + 3} 46q1 8 0 15M${x + 5} 47q1 7 0 14`}
            color={paper}
            shadow={brass}
            highlight="var(--scene-wood-light)"
            width={1.5}
            relief={1.4}
          />
          <ArrGoldCord d={`M${x} 60q3 1 6 0`} width={1.7} />
        </g>
      ))}
      <NookThread
        d={Array.from({ length: 19 }, (_, i) => {
          const y = 66 + i * 6;
          return `M24.5 ${y}q2.5 1.7 5 1M88 ${y}q2.5 .3 5-1`;
        }).join(" ")}
        color={gold}
        shadow={brass}
        highlight={paper}
        width={1.5}
        relief={1.4}
      />
      <g transform="rotate(-3 59 121)">
        <ArrGoldCord d="M59 90a31 31 0 1 1-.1 0" width={3} />
        <NookThread
          d="M59 94a27 27 0 1 1-.1 0"
          color={gold}
          shadow={brass}
          highlight={paper}
          width={1.9}
          relief={1.4}
        />
        <NookThread
          d={compassCouching}
          color="var(--scene-wood-light)"
          shadow={brass}
          highlight={paper}
          width={1.05}
          relief={1.2}
        />
        <NookThread
          d={compassKnots}
          color={gold}
          shadow={brass}
          highlight={paper}
          width={1.45}
          relief={1.55}
        />
        <NookThread
          d="M59 77V91M59 152V166M15 121H28M90 121H103M31 94 39 102M79 141 88 150M31 149 39 141M79 101 87 93"
          color={paper}
          shadow={brass}
          highlight={paper}
          width={2}
          relief={1.5}
        />
        <NookThread
          d="M59 78v10M59 155v10M16 121h10M93 121h9"
          color={gold}
          shadow={brass}
          highlight={paper}
          width={1.3}
          dasharray=".8 2.3"
          relief={1.2}
        />
        <path
          d={emblemOutline}
          fill={blue}
          transform="translate(.7 1)"
          opacity=".65"
        />
        {sewnEmblem.map((facet) => (
          <ArrSilkFacet key={facet.name} facet={facet} />
        ))}
        <NookThread
          d={emblemOutline}
          color={ice}
          shadow={blue}
          highlight={paper}
          width={2}
          relief={1.65}
        />
        <NookThread
          d="M59 96 58 117 59 149M47 113 58 117 71 115"
          color={paper}
          shadow={blue}
          highlight={ice}
          width={1.55}
          relief={1.5}
        />
        <NookThread
          d={emblemOutline}
          color={paper}
          shadow={crystal}
          highlight={paper}
          width={1.2}
          dasharray=".7 2.8"
          relief={1.1}
          opacity={0.8}
        />
      </g>
      <ArrGoldCord d="M50 175 60 181 69 174M54 180 60 185 65 180" width={2} />
      <NookThread
        d="M60 208V218M55 213q3-1 5-5 2 4 5 5M56 217q3-4 4-9 1 5 4 9"
        color={gold}
        shadow={brass}
        highlight={paper}
        width={2}
        relief={1.5}
      />
      <ArrGoldCord d="M57 210q3 1 6 0M56 213q4 1 8 0" width={1.7} />
    </svg>
  );
}

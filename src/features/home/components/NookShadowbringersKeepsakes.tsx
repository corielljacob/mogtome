import { useId } from "react";
import { NookThread } from "./NookThread";

const velvet = {
  color: "var(--shb-cloth, #5d526f)",
  shadow: "var(--shb-cloth-dark, #39354d)",
  highlight: "var(--shb-cloth-light, #9788a5)",
};
const copper = {
  color: "var(--shb-gold, #b19066)",
  shadow: "var(--shb-gold-dark, #776146)",
  highlight: "var(--shb-gold-light, #dfc89e)",
};
const crystal = {
  color: "var(--shb-crystal, #699caa)",
  shadow: "var(--shb-crystal-dark, #416b83)",
  highlight: "var(--shb-crystal-light, #c4e2e0)",
};
const pearl = {
  color: "var(--shb-thread, #eee8d8)",
  shadow: "#b5ada6",
  highlight: "var(--shb-paper, #f5eee0)",
};
const ink = {
  color: "var(--shb-ink, #40394f)",
  shadow: "#242332",
  highlight: "var(--shb-cloth, #5d526f)",
};
const mix = (a: string, b: string, weight: number) =>
  `color-mix(in srgb, ${a} ${weight}%, ${b})`;
const rows = (count: number, path: (i: number) => string) =>
  Array.from({ length: count }, (_, i) => path(i)).join(" ");

/** Each cut piece has its own satin direction, padding and wrapped seam. */
function SewnPatch({
  d,
  stitches,
  floss,
  folded = false,
  edge = 1.3,
  width = 1.12,
}: {
  d: string;
  stitches: string;
  floss: typeof velvet;
  folded?: boolean;
  edge?: number;
  width?: number;
}) {
  const id = `${useId().replace(/:/g, "")}-shb-patch`;
  const shade = mix(floss.color, floss.shadow, 72);
  const light = mix(floss.color, floss.highlight, 52);
  const paint = `url(#${id}-padding)`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
        {folded ? (
          <linearGradient id={`${id}-padding`} x2="1" y2=".04">
            <stop stopColor={shade} />
            <stop offset=".17" stopColor={floss.color} />
            <stop offset=".28" stopColor={light} />
            <stop offset=".45" stopColor={shade} />
            <stop offset=".66" stopColor={floss.color} />
            <stop offset=".79" stopColor={light} />
            <stop offset="1" stopColor={shade} />
          </linearGradient>
        ) : (
          <radialGradient id={`${id}-padding`} cx=".3" cy=".25" r=".88">
            <stop stopColor={light} />
            <stop offset=".52" stopColor={floss.color} />
            <stop offset="1" stopColor={shade} />
          </radialGradient>
        )}
      </defs>
      <path
        d={d}
        fill={floss.shadow}
        transform="translate(.45 .8)"
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
        width={edge * 0.64}
        dasharray=".65 2.2 .8 2.6"
        opacity={0.7}
      />
    </g>
  );
}

function Binding({
  d,
  width = 2.3,
  floss = copper,
}: {
  d: string;
  width?: number;
  floss?: typeof velvet;
}) {
  return (
    <g>
      <NookThread d={d} {...floss} width={width} relief={1.55} />
      <NookThread
        d={d}
        color={floss.highlight}
        shadow={floss.color}
        highlight={pearl.highlight}
        width={width * 0.63}
        dasharray=".7 2.1 .85 2.5"
        opacity={0.78}
      />
    </g>
  );
}

const banner = "M23 51Q60 55 97 51L94 177Q81 190 60 202Q39 190 26 177Z";
const bannerRows = rows(110, (i) => {
  const y = 50 + i * 1.4;
  const sag = 3 + Math.sin((i / 110) * Math.PI) * 2;
  return `M21 ${y}C35 ${y + 1} 44 ${y + sag + 2} 58 ${y + sag}S81 ${y + sag + 1} 99 ${y - 0.3}`;
});
const arch = "M35 166V123Q35 106 60 97Q85 106 85 123V166";

/** The crystal shaft, open flying buttresses and glass dome recall the Crystarium. */
function CrystariumEmbroidery() {
  return (
    <g>
      <Binding d={arch} width={2} />
      <NookThread
        d="M38 165V124Q38 109 60 101Q82 109 82 124V165"
        {...copper}
        width={0.65}
        dasharray=".7 2"
      />
      <SewnPatch
        d="M53 150 52 107 55 105 55 85 60 71 65 87 65 110 68 113 67 150Z"
        stitches={rows(14, (i) => `M${51 + i * 1.3} 70q-.6 37 1 83`)}
        floss={crystal}
        edge={1.35}
      />
      <SewnPatch
        d="M60 71 65 87 63 91 63 148 59 150 59 87Z"
        stitches={rows(9, (i) => `M${57 + i * 1.05} 69q1 40 -.7 84`)}
        floss={{ ...crystal, color: crystal.highlight, shadow: crystal.color }}
        edge={0.7}
        width={0.85}
      />
      <SewnPatch
        d="M40 149Q44 123 44 103L49 89 47 117Q44 129 46 149ZM73 149Q76 130 72 117L71 94 76 107Q76 130 81 149Z"
        stitches={rows(33, (i) => `M${39 + i * 1.3} 88q-3 29 2 64`)}
        floss={crystal}
        edge={1}
      />
      <Binding
        d="M43 129Q50 119 54 126M66 125Q74 120 77 132"
        floss={crystal}
        width={2.1}
      />
      <NookThread
        d="M56 110v33M64 118v27M54 131v14M61 92v47"
        {...crystal}
        color={crystal.highlight}
        width={0.75}
        opacity={0.8}
      />
      <SewnPatch
        d="M39 154Q42 139 60 138Q78 140 81 154L79 170Q60 176 41 170Z"
        stitches={rows(
          30,
          (i) => `M${39 + i * 1.4} 136Q${36 + i * 1.6} 153 ${39 + i * 1.4} 177`,
        )}
        floss={crystal}
        edge={1.1}
      />
      <Binding
        d="M39 154Q60 159 81 154M41 170Q60 175 79 170M39 154Q42 139 60 138Q78 140 81 154"
        width={1.65}
      />
      <Binding
        d="M60 138V173M51 140Q45 152 49 172M69 140Q75 152 71 172"
        width={1.1}
      />
      <NookThread
        d="M42 167v-5q3-7 6 0v9M51 171v-8q4-8 8 0v9M61 172v-9q4-8 8 0v8M73 171v-9q3-7 6 0v5"
        {...copper}
        width={0.85}
      />
      <SewnPatch
        d="M54 173V161Q60 152 66 161V173Z"
        stitches={rows(10, (i) => `M${54 + i * 1.3} 155q-1 8 0 19`)}
        floss={velvet}
        edge={0.8}
        width={0.95}
      />
      <Binding d="M54 173V161Q60 152 66 161V173M59 135v3" width={1.2} />
      <Binding
        d="M60 179q-2 3 0 5q3-2 0-5M44 180q7 3 11 2M65 182q5 1 11-2"
        width={1.1}
      />
    </g>
  );
}

function Star({ x, y, size = 3 }: { x: number; y: number; size?: number }) {
  return (
    <NookThread
      d={`M${x} ${y - size}q-.3 ${size} ${-size} ${size}q${size} .2 ${size} ${size}q.3 ${-size} ${size} ${-size}q${-size} -.3 ${-size} ${-size}Z`}
      {...pearl}
      width={0.8}
      relief={1.2}
    />
  );
}

export function NookShadowbringersBanner() {
  return (
    <svg
      className="nook-wall-hanging nook-hanging nook-shadowbringers-banner"
      viewBox="0 0 120 230"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Binding d="M15 47Q37 34 60 12Q82 34 105 47" width={1.9} />
      <Binding
        d="M59 9q-3 2-1 5q4 2 5-1q1-4-4-4M12 48Q60 46 108 49"
        width={3.4}
      />
      {[12, 108].map((x) => (
        <Binding key={x} d={`M${x} 46q-3 3 0 5q4-1 1-5Z`} width={2} />
      ))}
      <path
        d={banner}
        fill={velvet.shadow}
        opacity=".22"
        transform="translate(1.6 2.6)"
      />
      <SewnPatch
        d={banner}
        stitches={bannerRows}
        floss={velvet}
        folded
        edge={2}
        width={1.2}
      />
      <SewnPatch
        d="M94 168 94 177Q79 190 60 202L56 197Q80 180 94 168Z"
        stitches={rows(30, (i) => `M${53 + i * 1.45} 176l5 29`)}
        floss={ink}
        edge={0.9}
      />
      <Binding d={banner} width={3.1} />
      <NookThread
        d="M29 61 32 173Q44 185 60 195Q77 185 88 173L91 61"
        {...copper}
        width={1}
        dasharray=".75 2.4"
      />
      <Binding d="M23 55Q60 61 97 55" width={1.6} />
      {[29, 85].map((x) => (
        <g key={x}>
          <SewnPatch
            d={`M${x} 46q4-3 7 0v15h-7Z`}
            stitches={rows(7, (i) => `M${x + i * 1.2} 43q-2 9 0 20`)}
            floss={velvet}
            edge={1.1}
          />
          <Binding d={`M${x} 49q4-2 7 0M${x + 2} 58h3`} width={1.3} />
        </g>
      ))}
      <Star x={39} y={78} size={3.1} />
      <Star x={81} y={86} size={2.5} />
      <NookThread d="M78 70h.25M35 95h.2M86 112h.2" {...pearl} width={1.7} />
      <CrystariumEmbroidery />
      <Binding d="M60 203v5q-5 2-3 5q4 3 6-1q1-4-3-4" width={1.5} />
      <SewnPatch
        d="M57 213Q55 218 55 224Q60 228 65 224Q65 218 63 213Z"
        stitches="M57 213Q55 221 55 225M58.4 213Q57 221 57 227M60 213V228M61.5 213Q63 222 63 227M63 213Q65 220 65 225"
        floss={copper}
        edge={0.8}
      />
      <Binding d="M57 214h6M56 216h8" width={1.2} />
    </svg>
  );
}

const mask = "M28 43Q33 29 50 28Q67 29 73 43L69 60 60 73Q50 82 40 73L31 60Z";
const maskRows = rows(40, (i) => {
  const y = 27 + i * 1.3;
  return `M26 ${y}Q39 ${y - 3} 50 ${y + 1}Q61 ${y - 3} 75 ${y}`;
});

/** An Ancient's pale mask, kept quietly on folded mourning-colored ribbon. */
export function NookShadowbringersCharm() {
  return (
    <svg
      className="nook-shadowbringers-charm"
      viewBox="0 0 100 130"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Binding
        d="M49 25Q34 17 37 8Q41 1 48 9Q53 15 50 26Q55 12 64 13Q74 17 65 23Q60 26 50 26"
        width={1.8}
      />
      <SewnPatch
        d="M40 69Q31 84 30 116L41 110 48 119Q51 93 55 77Z"
        stitches={rows(24, (i) => `M${27 + i * 1.3} 64q-1 24 -4 58`)}
        floss={velvet}
        folded
        edge={1.35}
      />
      <SewnPatch
        d="M52 71Q63 78 71 109L60 106 55 116Q47 95 43 79Z"
        stitches={rows(24, (i) => `M${40 + i * 1.3} 70q7 17 12 48`)}
        floss={ink}
        folded
        edge={1.3}
      />
      <NookThread
        d="M35 87q-2 15-2 24M61 88l6 16"
        {...copper}
        width={0.85}
        dasharray=".65 2"
      />
      <SewnPatch
        d="M25 43Q25 27 49 23Q73 26 77 43L73 67Q64 82 50 90Q33 81 26 65Z"
        stitches={rows(45, (i) => {
          const x = 22 + i * 1.3;
          return `M${x} 23Q${x - 5} 51 ${x + 2} 93`;
        })}
        floss={ink}
        edge={2}
      />
      <SewnPatch
        d={mask}
        stitches={maskRows}
        floss={pearl}
        edge={1.6}
        width={1.13}
      />
      <SewnPatch
        d="M28 43Q34 32 45 31Q37 41 36 55L42 70 49 78Q38 74 31 60Z"
        stitches={rows(36, (i) => `M26 ${31 + i * 1.35}q8-2 19 4`)}
        floss={{ ...pearl, color: mix(pearl.color, pearl.shadow, 82) }}
        edge={0.5}
      />
      <SewnPatch
        d="M35 45Q40 42 46 45L44 52Q39 52 36 49Z"
        stitches="M34 43l8 10M36 42l9 11M38 42l9 9M40 42l8 7M42 42l6 5"
        floss={ink}
        edge={1.05}
        width={1}
      />
      <SewnPatch
        d="M55 45Q61 42 67 45L65 49Q62 52 57 52Z"
        stitches="M54 44l9 9M56 43l9 9M58 42l9 9M60 42l9 8M62 43l7 5"
        floss={ink}
        edge={1.05}
        width={1}
      />
      <SewnPatch
        d="M50 43Q47 48 47 56L50 61 54 56Q53 48 50 43Z"
        stitches={rows(10, (i) => `M${45 + i * 1.05} 41q-1 11 2 21`)}
        floss={pearl}
        edge={0.6}
        width={0.85}
      />
      <NookThread
        d="M36 40Q41 38 45 40M56 40Q62 38 66 41"
        {...pearl}
        width={0.8}
        opacity={0.85}
      />
      <Binding d="M47 24q0-4 3-4q4 1 3 5M47 25l6 .2" width={1.6} />
    </svg>
  );
}

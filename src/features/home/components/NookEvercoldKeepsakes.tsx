import { useId } from "react";
import { NookThread } from "./NookThread";

const teal = {
  color: "var(--ec-cloth, #53747d)",
  shadow: "var(--ec-cloth-dark, #354f5b)",
  highlight: "var(--ec-cloth-light, #97aeb7)",
};
const petal = {
  color: "var(--ec-petal, #99819b)",
  shadow: "var(--ec-petal-dark, #69576f)",
  highlight: "var(--ec-petal-light, #c8b6c9)",
};
const silver = {
  color: "var(--ec-silver, #b0bfc3)",
  shadow: "var(--ec-silver-dark, #778e98)",
  highlight: "var(--ec-silver-light, #e7e9e3)",
};
const amber = {
  color: "var(--ec-amber, #c2a06a)",
  shadow: "var(--ec-amber-dark, #8b7250)",
  highlight: "var(--ec-amber-light, #efd7a7)",
};
const pearl = {
  color: "var(--ec-thread, #e7e6df)",
  shadow: silver.color,
  highlight: "var(--ec-paper, #f6f0e4)",
};
const mix = (a: string, b: string, weight: number) =>
  `color-mix(in srgb, ${a} ${weight}%, ${b})`;
const rows = (count: number, path: (i: number) => string) =>
  Array.from({ length: count }, (_, i) => path(i)).join(" ");

/** Satin follows the cut cloth, with a padded edge and intermittent lit fibres. */
function SewnPatch({
  d,
  stitches,
  floss,
  folded = false,
  edge = 1.25,
  width = 1.1,
}: {
  d: string;
  stitches: string;
  floss: typeof teal;
  folded?: boolean;
  edge?: number;
  width?: number;
}) {
  const id = `${useId().replace(/:/g, "")}-ec-patch`;
  const shade = mix(floss.color, floss.shadow, 68);
  const light = mix(floss.color, floss.highlight, 52);
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
            <stop offset=".17" stopColor={floss.color} />
            <stop offset=".29" stopColor={light} />
            <stop offset=".47" stopColor={shade} />
            <stop offset=".66" stopColor={floss.color} />
            <stop offset=".8" stopColor={light} />
            <stop offset="1" stopColor={shade} />
          </linearGradient>
        ) : (
          <radialGradient id={`${id}-padding`} cx=".32" cy=".24" r=".85">
            <stop stopColor={light} />
            <stop offset=".55" stopColor={floss.color} />
            <stop offset="1" stopColor={shade} />
          </radialGradient>
        )}
      </defs>
      <path
        d={d}
        fill={floss.shadow}
        opacity=".3"
        transform="translate(.45 .8)"
      />
      <path d={d} fill={paint} />
      <g clipPath={`url(#${id})`}>
        <NookThread
          d={stitches}
          color={paint}
          shadow={shade}
          highlight={light}
          width={width}
          relief={1.6}
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
        opacity={0.7}
      />
    </g>
  );
}

function Binding({
  d,
  floss = silver,
  width = 2,
}: {
  d: string;
  floss?: typeof teal;
  width?: number;
}) {
  return (
    <g>
      <NookThread d={d} {...floss} width={width} relief={1.5} />
      <NookThread
        d={d}
        color={floss.highlight}
        shadow={floss.color}
        highlight={pearl.highlight}
        width={width * 0.6}
        dasharray=".7 2.15 .85 2.5"
        opacity={0.8}
      />
    </g>
  );
}

const banner = "M23 52Q60 56 97 52L94 188Q78 194 60 207Q42 194 26 188Z";
const bannerFace = "M28 61Q60 65 92 61L89 183Q74 190 60 201Q46 190 31 183Z";
const clothRows = rows(115, (i) => {
  const y = 51 + i * 1.4;
  return `M21 ${y}Q40 ${y + 5} 60 ${y + 4}T99 ${y - 1}`;
});
const longPetal = "M0 3C-9-6-12-20-5-34Q0-39 4-31C10-20 11-6 0 3Z";
const petalRows = rows(17, (i) => {
  const x = -11 + i * 1.35;
  return `M0 4Q${x * 0.7} -9 ${x} -38`;
});

/** The reference's petal canopy and luminous arcade, translated into sewn cloth. */
function PetalArcade() {
  return (
    <g>
      <SewnPatch
        d="M37 165V126Q38 111 60 99Q82 111 83 126V165Z"
        stitches={rows(
          52,
          (i) => `M34 ${97 + i * 1.4}Q60 ${102 + i * 1.4} 86 ${97 + i * 1.4}`,
        )}
        floss={silver}
        edge={1.5}
      />
      <SewnPatch
        d="M42 163V127Q42 116 60 106Q78 116 78 127V163Z"
        stitches={rows(
          43,
          (i) => `M40 ${105 + i * 1.4}Q60 ${108 + i * 1.4} 80 ${105 + i * 1.4}`,
        )}
        floss={{
          ...teal,
          color: mix(teal.highlight, silver.highlight, 60),
          shadow: silver.shadow,
          highlight: pearl.highlight,
        }}
        edge={1}
      />
      <Binding
        d="M60 107V163M42 133H78M42 153H78M42 133 60 115 78 133 60 153Z"
        floss={teal}
        width={1.25}
      />
      <Binding d="M38 165H82M38 169H82" width={1.5} />
      <Binding
        d="M45 178Q52 175 59 178M64 178q7-3 13 0M43 184q8-3 16 0M62 185q6-3 12-1"
        floss={silver}
        width={0.95}
      />
      <NookThread d="M54 145h12M57 148h6" {...amber} width={1.4} />
      <SewnPatch
        d="M56 130Q60 126 64 130L63 141H57Z"
        stitches={rows(12, (i) => `M54 ${127 + i * 1.3}h12`)}
        floss={amber}
        edge={0.8}
        width={0.85}
      />
      <Binding d="M55 129h10M57 142h6M60 127v-3" width={0.85} />
      <g transform="translate(60 104)">
        {[-64, -42, -21, 0, 21, 42, 64].map((angle, i) => (
          <g
            key={angle}
            transform={`rotate(${angle}) scale(${i % 2 ? 0.83 : 0.94} 1)`}
          >
            <SewnPatch
              d={longPetal}
              stitches={petalRows}
              floss={
                i % 2
                  ? petal
                  : { ...petal, color: mix(petal.color, petal.highlight, 76) }
              }
              edge={0.85}
              width={0.85}
            />
            <NookThread
              d="M0 0Q-1-16 0-29"
              {...petal}
              color={petal.highlight}
              width={0.6}
              opacity={0.75}
            />
          </g>
        ))}
        <Binding d="M-11 0Q0 8 11 0" floss={teal} width={1.5} />
      </g>
      <NookThread
        d="M32 117h.2M88 117h.2M34 151h.2M86 151h.2M60 191h.2"
        {...amber}
        width={1.8}
      />
    </g>
  );
}

export function NookEvercoldBanner() {
  return (
    <svg
      className="nook-wall-hanging nook-hanging nook-evercold-banner"
      viewBox="0 0 120 230"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Binding d="M15 47Q37 34 60 12Q83 34 105 47" width={1.75} />
      <Binding
        d="M60 9q-4 0-4 4q2 4 5 1q3-3-1-5M12 49Q60 46 108 49"
        width={2.9}
      />
      <SewnPatch
        d={banner}
        stitches={clothRows}
        floss={teal}
        folded
        edge={1.9}
        width={1.2}
      />
      <SewnPatch
        d={bannerFace}
        stitches={clothRows}
        floss={pearl}
        folded
        edge={1.2}
        width={1.15}
      />
      <Binding d={banner} width={2.5} />
      <NookThread
        d="M32 68 35 181Q47 187 60 196Q73 187 85 181L88 68"
        {...petal}
        width={1.05}
        dasharray=".8 2.4"
      />
      <Binding d="M27 57Q60 61 93 57" floss={petal} width={1.4} />
      {[29, 84].map((x) => (
        <SewnPatch
          key={x}
          d={`M${x} 46q4-3 7 0v15h-7Z`}
          stitches={rows(7, (i) => `M${x + i * 1.2} 44q-2 9 0 20`)}
          floss={teal}
          edge={1.1}
        />
      ))}
      <PetalArcade />
      <Binding d="M60 208v5" width={1.25} />
      <SewnPatch
        d="M58 214q-4 5-4 12q6 3 12 0q0-7-4-12Z"
        stitches={rows(10, (i) => `M${54 + i * 1.3} 211q-2 7 0 19`)}
        floss={petal}
        edge={0.8}
      />
      <Binding d="M57 216h6M56 218h8" width={1.1} />
    </svg>
  );
}

/** A pressed canopy petal tied beside a small, padded amber lantern. */
export function NookEvercoldCharm() {
  return (
    <svg
      className="nook-evercold-charm"
      viewBox="0 0 110 140"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Binding d="M43 62Q43 91 53 123" floss={teal} width={2} />
      <g transform="translate(45 66)">
        {[-41, -13, 19, 43].map((angle, i) => (
          <g
            key={angle}
            transform={`rotate(${angle}) scale(${i === 1 ? 1.25 : 1} ${i === 1 ? 1.55 : 1.2})`}
          >
            <SewnPatch
              d={longPetal}
              stitches={petalRows}
              floss={
                i % 2
                  ? { ...petal, color: mix(petal.color, petal.highlight, 80) }
                  : petal
              }
              edge={0.85}
              width={0.9}
            />
            <NookThread
              d="M0 0Q-1-17 0-31"
              {...silver}
              width={0.6}
              opacity={0.7}
            />
          </g>
        ))}
      </g>
      <SewnPatch
        d="M45 93Q29 90 24 74Q40 76 45 93Z"
        stitches={rows(17, (i) => `M24 ${72 + i * 1.35}l24 6`)}
        floss={teal}
        edge={0.85}
      />
      <Binding
        d="M28 78Q36 86 44 92M47 89Q68 77 76 83Q81 92 76 99"
        width={1.2}
      />
      <SewnPatch
        d="M40 88Q39 104 40 124L47 119 54 124Q48 103 50 91Z"
        stitches={rows(15, (i) => `M${38 + i * 1.3} 85q-1 19 4 42`)}
        floss={teal}
        folded
        edge={1.1}
      />
      <SewnPatch
        d="M47 92Q31 88 31 81Q34 75 43 83L49 89Q52 77 59 80Q69 87 52 94Z"
        stitches={rows(25, (i) => `M${29 + i * 1.35} 77q-2 9 3 20`)}
        floss={teal}
        folded
        edge={1.2}
      />
      <Binding d="M44 88q4-2 7 0l-1 7h-5Z" width={1.5} />
      <Binding d="M72 91Q67 79 75 77Q83 79 80 91" width={1.45} />
      <SewnPatch
        d="M64 94Q76 88 89 94L87 119Q76 126 66 119Z"
        stitches={rows(
          26,
          (i) => `M62 ${90 + i * 1.35}Q76 ${94 + i * 1.35} 92 ${90 + i * 1.35}`,
        )}
        floss={amber}
        edge={1.1}
      />
      <SewnPatch
        d="M69 96Q76 93 84 96L82 117Q76 120 70 117Z"
        stitches={rows(16, (i) => `M${66 + i * 1.3} 93v28`)}
        floss={{
          ...amber,
          color: amber.highlight,
          shadow: amber.color,
          highlight: pearl.highlight,
        }}
        edge={0.8}
        width={1}
      />
      <Binding
        d="M64 94 66 119M89 94 87 119M76 93V123"
        floss={teal}
        width={1.3}
      />
      <SewnPatch
        d="M61 93 69 87H84L93 93 90 97Q76 92 63 97Z"
        stitches={rows(12, (i) => `M59 ${85 + i * 1.2}h36`)}
        floss={teal}
        edge={1.1}
        width={0.85}
      />
      <Binding
        d="M67 88Q76 86 85 89M64 120Q76 127 89 120M71 127h10"
        width={1.4}
      />
      <NookThread
        d="M71 101v10M80 99v7"
        {...pearl}
        width={0.8}
        opacity={0.75}
      />
    </svg>
  );
}

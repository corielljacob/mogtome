import { useId } from "react";
import { NookThread } from "./NookThread";

const jade = {
  color: "var(--dt-cloth, #477f70)",
  shadow: "var(--dt-cloth-dark, #2e554e)",
  highlight: "var(--dt-cloth-light, #93b8a1)",
};
const coral = {
  color: "var(--dt-coral, #c47d64)",
  shadow: "var(--dt-coral-dark, #935646)",
  highlight: "var(--dt-coral-light, #e8b69a)",
};
const gold = {
  color: "var(--dt-gold, #c49b54)",
  shadow: "var(--dt-gold-dark, #8b683c)",
  highlight: "var(--dt-gold-light, #efcf91)",
};
const linen = {
  color: "var(--dt-thread, #f0dfb8)",
  shadow: "var(--dt-gold, #c49b54)",
  highlight: "var(--dt-paper, #fff3d9)",
};
const mix = (a: string, b: string, weight: number) =>
  `color-mix(in srgb, ${a} ${weight}%, ${b})`;
const rows = (count: number, path: (i: number) => string) =>
  Array.from({ length: count }, (_, i) => path(i)).join(" ");

/** Each cut piece is padded and edged with a raised, interrupted strand. */
function SewnPatch({
  d,
  stitches,
  floss,
  folded = false,
  edge = 1.25,
  width = 1.08,
}: {
  d: string;
  stitches: string;
  floss: typeof jade;
  folded?: boolean;
  edge?: number;
  width?: number;
}) {
  const id = `${useId().replace(/:/g, "")}-dt-patch`;
  const shade = mix(floss.color, floss.shadow, 67);
  const light = mix(floss.color, floss.highlight, 50);
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
        opacity={0.7}
      />
    </g>
  );
}

function Binding({
  d,
  floss = gold,
  width = 2,
}: {
  d: string;
  floss?: typeof jade;
  width?: number;
}) {
  return (
    <g>
      <NookThread d={d} {...floss} width={width} relief={1.5} />
      <NookThread
        d={d}
        color={floss.highlight}
        shadow={floss.color}
        highlight={linen.highlight}
        width={width * 0.6}
        dasharray=".7 2.15 .85 2.5"
        opacity={0.8}
      />
    </g>
  );
}

const pennant = "M24 52Q60 56 96 52L93 174Q90 194 60 208Q30 194 27 174Z";
const pennantFace = "M29 62Q60 65 91 62L88 172Q85 189 60 201Q35 189 32 172Z";
const clothRows = rows(115, (i) => {
  const y = 51 + i * 1.4;
  return `M22 ${y}Q41 ${y + 5} 59 ${y + 4}T98 ${y - 1}`;
});

/** Two individually stitched palm sprays frame a couched, warm little sun. */
function SunAndPalms() {
  return (
    <g>
      {[false, true].map((flipped) => (
        <g
          key={String(flipped)}
          transform={flipped ? "translate(120 0) scale(-1 1)" : undefined}
        >
          <Binding d="M58 169Q32 149 40 113" floss={jade} width={1.65} />
          {Array.from({ length: 5 }, (_, i) => {
            const y = 118 + i * 8;
            const x = 38 + Math.max(0, i - 1) * 1.1;
            return (
              <g key={i}>
                <SewnPatch
                  d={`M${x} ${y + 7}Q${x - 12} ${y + 3} ${x - 10} ${y - 7}Q${x + 1} ${y - 2} ${x} ${y + 7}Z`}
                  stitches={rows(
                    9,
                    (j) => `M${x - 11 + j * 1.25} ${y - 9}l3 19`,
                  )}
                  floss={jade}
                  edge={0.65}
                  width={0.82}
                />
                <SewnPatch
                  d={`M${x} ${y + 7}Q${x + 1} ${y - 4} ${x + 9} ${y - 9}Q${x + 13} ${y + 1} ${x} ${y + 7}Z`}
                  stitches={rows(9, (j) => `M${x + j * 1.25} ${y - 10}l-2 20`)}
                  floss={{
                    ...jade,
                    color: mix(jade.color, jade.highlight, 77),
                  }}
                  edge={0.65}
                  width={0.82}
                />
              </g>
            );
          })}
        </g>
      ))}
      <NookThread
        d={rows(16, (i) => {
          const a = (i * Math.PI) / 8;
          return `M${60 + Math.cos(a) * 18} ${115 + Math.sin(a) * 18}l${Math.cos(a) * (i % 2 ? 3 : 5)} ${Math.sin(a) * (i % 2 ? 3 : 5)}`;
        })}
        {...gold}
        width={1.7}
      />
      <SewnPatch
        d="M75 115a15 15 0 1 1-30 0a15 15 0 1 1 30 0Z"
        stitches={rows(
          26,
          (i) =>
            `M43 ${98 + i * 1.35}Q60 ${103 + i * 1.35} 77 ${98 + i * 1.35}`,
        )}
        floss={gold}
        edge={1.6}
      />
      <Binding
        d="M70 115a10 10 0 1 1-20 0a10 10 0 1 1 20 0Z"
        floss={coral}
        width={1.15}
      />
      <NookThread d="M56 113q4-3 8 0M56 119q4 2 8 0" {...linen} width={1.05} />
      <Binding
        d="M46 177q14 6 28 0M51 184q9 4 18 0"
        floss={coral}
        width={1.4}
      />
      <Binding d="M60 75v10M55 80h10M58 78l4 4M62 78l-4 4" width={1.05} />
      <NookThread
        d="M37 82h.2M83 82h.2M43 190h.2M77 190h.2"
        {...gold}
        width={2}
      />
    </g>
  );
}

/** A palm-fibre market souvenir, sewn into the room's familiar hanging shape. */
export function NookDawntrailNoticePin() {
  return (
    <svg
      className="nook-wall-hanging nook-hanging nook-dawntrail-notice-pin"
      viewBox="0 0 120 230"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Binding d="M15 47Q37 34 60 12Q83 34 105 47" width={1.75} />
      <Binding d="M60 9q-4 0-4 4q2 4 5 1q3-3-1-5" width={2.4} />
      <Binding d="M12 49Q60 46 108 49" width={3.2} />
      <SewnPatch
        d={pennant}
        stitches={clothRows}
        floss={jade}
        folded
        edge={1.9}
        width={1.2}
      />
      <SewnPatch
        d={pennantFace}
        stitches={clothRows}
        floss={linen}
        folded
        edge={1.2}
        width={1.16}
      />
      <Binding d={pennant} width={2.5} />
      <NookThread
        d="M33 68 36 171Q40 187 60 195Q80 187 84 171L87 68"
        {...coral}
        width={1.1}
        dasharray="1 2.4"
      />
      <Binding d="M27 57Q60 61 93 57" floss={coral} width={1.6} />
      {[30, 83].map((x) => (
        <SewnPatch
          key={x}
          d={`M${x} 46q4-3 7 0v15h-7Z`}
          stitches={rows(7, (i) => `M${x + i * 1.2} 44q-2 9 0 20`)}
          floss={jade}
          edge={1.15}
        />
      ))}
      <SunAndPalms />
      <Binding d="M60 208v5" width={1.4} />
      <SewnPatch
        d="M58 214q-4 5-4 12q6 3 12 0q0-7-4-12Z"
        stitches={rows(10, (i) => `M${54 + i * 1.3} 211q-2 7 0 19`)}
        floss={coral}
        edge={0.8}
      />
      <Binding d="M57 216h6M56 218h8" width={1.1} />
    </svg>
  );
}

const cup = "M25 65Q49 73 76 65L71 99Q69 108 50 109Q31 108 29 99Z";

/** A warm café cup with a satin hibiscus: a small, everyday memory of Tural. */
export function NookDawntrailCharm() {
  return (
    <svg
      className="nook-dawntrail-charm"
      viewBox="0 0 108 126"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Binding d="M58 19Q75 10 78 21Q78 32 63 39" width={1.5} />
      <SewnPatch
        d="M48 32Q58 32 67 28L75 64 64 59 58 68Z"
        stitches={rows(25, (i) => `M${45 + i * 1.35} 26l9 44`)}
        floss={jade}
        folded
        edge={1.1}
      />
      <SewnPatch
        d="M44 31Q51 33 57 35L41 65 37 56 28 59Z"
        stitches={rows(24, (i) => `M${36 + i * 1.25} 24l-14 44`)}
        floss={jade}
        folded
        edge={1.1}
      />
      <Binding
        d="M39 38Q37 26 45 22Q51 20 55 28Q61 15 67 20Q72 27 61 34M46 34q7-5 15-1"
        floss={gold}
        width={2.6}
      />
      <SewnPatch
        d="M71 74Q89 67 93 80Q97 95 75 101L76 93Q89 89 86 81Q82 77 74 82Z"
        stitches={rows(25, (i) => `M68 ${70 + i * 1.4}l30 4`)}
        floss={coral}
        edge={1.25}
      />
      <SewnPatch
        d="M18 106Q50 99 82 105L88 110Q69 123 27 117L16 112Z"
        stitches={rows(
          13,
          (i) => `M14 ${102 + i * 1.4}Q50 ${110 + i * 1.4} 90 ${101 + i * 1.4}`,
        )}
        floss={jade}
        edge={1.5}
      />
      <Binding d="M22 110Q50 118 83 109" width={1.2} />
      <SewnPatch
        d={cup}
        stitches={rows(
          34,
          (i) => `M23 ${64 + i * 1.4}Q50 ${74 + i * 1.4} 79 ${64 + i * 1.4}`,
        )}
        floss={coral}
        edge={1.7}
      />
      <SewnPatch
        d="M25 65C25 54 77 53 77 64C77 76 25 76 25 65Z"
        stitches={rows(15, (i) => `M22 ${55 + i * 1.2}h57`)}
        floss={linen}
        edge={1.3}
      />
      <SewnPatch
        d="M31 64C33 57 69 57 71 64C71 69 32 70 31 64Z"
        stitches={rows(10, (i) => `M29 ${58 + i * 1.2}q22 3 45 0`)}
        floss={{ color: "#73543d", shadow: "#4d4134", highlight: "#b28c60" }}
        edge={0.7}
        width={0.8}
      />
      <NookThread
        d="M36 64Q47 59 60 63Q67 66 56 66Q44 67 47 63"
        {...linen}
        width={0.9}
      />
      <Binding
        d="M31 85Q50 92 73 84M32 92Q51 99 72 91"
        floss={linen}
        width={1.3}
      />
      <NookThread
        d="M38 89l4 5 4-4 4 5 4-5 4 4 4-5 4 4"
        {...gold}
        width={0.8}
      />
      <Binding
        d="M41 52Q33 46 39 41M52 53Q58 47 53 42"
        floss={linen}
        width={1.1}
      />
      <g transform="translate(79 43)">
        <SewnPatch
          d="M-5 7Q4-12 17-8Q16 5-5 7Z"
          stitches={rows(17, (i) => `M${-5 + i * 1.3} -12l-3 23`)}
          floss={jade}
          edge={0.7}
        />
        {[0, 72, 144, 216, 288].map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <SewnPatch
              d="M0 2Q-12-3-9-12Q-4-16 0-11Q5-16 9-11Q11-3 0 2Z"
              stitches={rows(
                16,
                (i) => `M0 3Q${-10 + i * 1.3} -4 ${-10 + i * 1.3} -16`,
              )}
              floss={linen}
              edge={0.8}
              width={0.8}
            />
          </g>
        ))}
        <SewnPatch
          d="M4 0a4 4 0 1 1-8 0a4 4 0 1 1 8 0Z"
          stitches="M-4-3h8M-5-1h10M-5 1h10M-4 3h8"
          floss={gold}
          edge={0.65}
          width={0.8}
        />
        <Binding d="M0 0q-2 7 3 9" floss={coral} width={0.8} />
        <NookThread d="M2 8h1M3 10h1" {...gold} width={1.35} />
      </g>
    </svg>
  );
}

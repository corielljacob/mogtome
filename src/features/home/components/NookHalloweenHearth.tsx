import { useId } from "react";
import { NookThread } from "./NookThread";

const pumpkinOutline =
  "M45 83C5 89-13 55 1 31C10 15 28 15 42 22C55 10 80 19 87 38C98 67 76 89 45 83Z";

// Each panel is padded separately, so the floss changes direction at the ribs.
const lobes = [
  {
    d: "M24 19C7 15-8 30-7 48C-7 68 9 83 29 85C10 63 10 38 24 19Z",
    x: 8,
    tilt: -0.17,
  },
  {
    d: "M62 18C81 16 96 32 95 49C96 68 79 85 61 85C81 62 78 39 62 18Z",
    x: 78,
    tilt: 0.17,
  },
  {
    d: "M43 22C26 10 11 26 10 49C9 69 23 84 43 85C28 64 29 39 43 22Z",
    x: 26,
    tilt: -0.1,
  },
  {
    d: "M45 23C59 10 78 25 79 47C81 67 66 85 46 85C62 64 62 39 45 23Z",
    x: 63,
    tilt: 0.1,
  },
  {
    d: "M43 22C30 27 25 43 28 60C29 73 36 82 45 84C57 80 64 65 62 48C61 34 54 24 43 22Z",
    x: 45,
    tilt: 0,
  },
];

const ribs =
  "M23 23C7 37 11 65 27 79M42 24C25 34 23 65 42 81M47 24C66 35 66 67 48 81M64 24C80 40 80 64 66 77";
const blanketStitches =
  "M3 31l3 2M0 38l3 1M-1 46h3M0 54l3-.5M3 62l3-1.5M7 69l3-2M13 75l2-2.5M20 80l1-3M29 83l.5-3M38 84v-3M47 83v-3M56 84l-.5-3M65 82l-1-3M74 79l-1.5-3M81 73l-2.5-2M86 66l-3-1M89 58l-3-.5M89 49h-3M86 40l-3 1M83 32l-2.5 2M77 26l-1.5 2.5M70 22l-1 3M60 21v3M52 22l1 2.5M34 21l-.5 3M26 19v3M17 20l1 3M10 24l2 2.5";
const face =
  "m18 44 11-12 6 15Zm36 3 7-15 10 13Zm-13 1 5-6 4 7ZM18 56 31 60 33 56 41 58 43 65 53 62 55 57 68 54Q51 87 29 70Z";

// Long satin stitches bow across each lobe, with a small offset at every row.
const satinRows = lobes.map(({ x, tilt }) =>
  Array.from({ length: 35 }, (_, index) => {
    const y = 19 + index * 1.95;
    const bow = 1.8 + Math.sin(((y - 19) / 68) * Math.PI) * 2.4;
    const start = x - 23;
    const end = x + 23;
    return `M${start} ${(y - 23 * tilt).toFixed(2)}Q${x} ${(y + bow).toFixed(2)} ${end} ${(y + 23 * tilt).toFixed(2)}`;
  }).join(""),
);

const ochre = {
  underlay: "#9c5338",
  panels: ["#ad653e", "#a65a3c", "#cf8349", "#bc6e40", "#d28b4e"],
  floss: ["#d39152", "#c47e47", "#edb56d", "#dc9954", "#edb365"],
  highlight: "#ffdc98",
  border: "#b96f42",
  shadow: "#724331",
};
const ivory = {
  underlay: "#a59878",
  panels: ["#b7ac8d", "#b1a486", "#d5c8a6", "#c6b997", "#d9ccb0"],
  floss: ["#d3c6a6", "#c6b994", "#ede0bf", "#dfd1ad", "#f1e5c9"],
  highlight: "#fff3d8",
  border: "#b4a282",
  shadow: "#7c715c",
};
const russet = {
  underlay: "#91553a",
  panels: ["#9e633f", "#8f543b", "#b67a46", "#a26640", "#bc8250"],
  floss: ["#bd8d56", "#b07c4b", "#d5a362", "#c18c53", "#deb074"],
  highlight: "#f7d89c",
  border: "#9b6643",
  shadow: "#684630",
};

function Pumpkin({
  id,
  palette,
  lantern = false,
}: {
  id: string;
  palette: typeof ochre;
  lantern?: boolean;
}) {
  return (
    <g>
      <defs>
        <clipPath id={`${id}-body`}>
          <path d={pumpkinOutline} />
        </clipPath>
        {lobes.map(({ d }, index) => (
          <clipPath key={index} id={`${id}-lobe-${index}`}>
            <path d={d} />
          </clipPath>
        ))}
        {lantern && (
          <clipPath id={`${id}-face`}>
            <path d={face} />
          </clipPath>
        )}
      </defs>
      <path
        d={pumpkinOutline}
        fill={palette.shadow}
        opacity=".19"
        transform="translate(.6 1.9)"
      />
      <path d={pumpkinOutline} fill={palette.underlay} />
      <g clipPath={`url(#${id}-body)`}>
        {lobes.map(({ d }, index) => (
          <g key={index} clipPath={`url(#${id}-lobe-${index})`}>
            <path d={d} fill={palette.panels[index]} />
            <NookThread
              d={satinRows[index]}
              color={palette.floss[index]}
              shadow={palette.shadow}
              highlight={palette.highlight}
              width={1.35}
              relief={1.35}
            />
          </g>
        ))}
      </g>
      <NookThread
        d={ribs}
        color={palette.border}
        shadow={palette.shadow}
        highlight={palette.highlight}
        width={1.5}
        relief={1.3}
      />
      <NookThread
        d={pumpkinOutline}
        color={palette.border}
        shadow={palette.shadow}
        highlight={palette.highlight}
        width={1.5}
      />
      <NookThread
        d={blanketStitches}
        color={palette.floss[2]}
        shadow={palette.shadow}
        highlight={palette.highlight}
        width={1.15}
        relief={1.2}
      />

      {/* A wrapped stem and split-stitch tendril sit above the satin-filled lobes. */}
      <path d="M40 24C36 17 35 7 43 2L50 5C42 12 45 18 47 24Z" fill="#646346" />
      <NookThread
        d="M41 23Q35 10 44 4M46 23Q41 12 48 6"
        color="#77784d"
        shadow="#494a35"
        highlight="#c0bd7d"
        width={2.6}
        relief={1.3}
      />
      <NookThread
        d="m39 8 7 2m-8 2 7 3m-7 1 8 3m-7 1 8 3"
        color="#a2a36b"
        shadow="#50513b"
        highlight="#d0ca95"
        width={1.4}
      />
      <NookThread
        d="M48 19Q70 4 73 16Q74 25 64 22Q60 20 65 18"
        color="#7e8053"
        shadow="#54513c"
        highlight="#c5bd80"
        width={1.45}
      />
      {lantern && (
        <g className="nook-pumpkin-light">
          <path
            d={face}
            fill="#e5b86c"
            stroke="#71452f"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <g clipPath={`url(#${id}-face)`}>
            <NookThread
              d="M16 33h59M16 35.5h59M16 38h59M16 40.5h59M16 43h59M16 45.5h59M16 48h59M16 50.5h59M16 53h59M16 55.5h59M16 58h59M16 60.5h59M16 63h59M16 65.5h59M16 68h59M16 70.5h59M16 73h59M16 75.5h59"
              color="#ffd98b"
              shadow="#a56b35"
              highlight="#ffedbd"
              width={1.65}
              relief={1.15}
            />
          </g>
          <NookThread
            d={face}
            color="#8b502f"
            shadow="#653b2c"
            highlight="#e8ad61"
            width={1.45}
            relief={1.3}
          />
          <path
            d="m20 44 1-3m5 5 .5-3m5 3-1-3m27 2 1-3m5 3 1-3m-43 17 2-2m3 7 2-2m4 5 1-2.5m5 4 .5-2.5m5 2.5v-2.5m5 1.5-1-2.5m6 .5-1-2.5m5-.5-1.5-2m5-2-2-1.5"
            stroke="#e9ba74"
            strokeWidth=".85"
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
}

const rug =
  "M22 112Q23 108 35 108Q46 103 57 106Q70 101 84 104Q99 100 114 103Q130 100 146 103Q161 100 177 105Q194 103 204 108Q224 107 228 113Q231 117 216 120Q208 125 191 122Q175 127 158 124Q141 128 126 125Q109 128 92 124Q75 127 60 122Q42 124 35 119Q19 119 22 112Z";

/** Small padded pumpkin appliqués sewn onto a flax doily at the foot of the nook. */
export function NookHalloweenHearth() {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className="nook-halloween-hearth"
      viewBox="0 0 250 130"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={`${id}-rug`}>
          <path d={rug} />
        </clipPath>
        <pattern
          id={`${id}-linen`}
          width="4"
          height="3"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 .6h4M.8 0v3"
            stroke="var(--scene-wood)"
            strokeWidth=".45"
            opacity=".25"
          />
          <path
            d="M0 1.4h4M1.6 0v3"
            stroke="var(--scene-paper)"
            strokeWidth=".65"
            opacity=".75"
          />
        </pattern>
      </defs>
      <path
        d={rug}
        fill="var(--scene-shadow)"
        opacity=".13"
        transform="translate(.4 1.7)"
      />
      <path
        d={rug}
        fill="color-mix(in srgb, var(--scene-paper) 80%, var(--scene-wood-light))"
      />
      <path d={rug} fill={`url(#${id}-linen)`} />
      <NookThread
        d={rug}
        color="var(--scene-wood-light)"
        shadow="var(--scene-wood)"
        highlight="var(--scene-paper)"
        width={1.2}
        dasharray="1.1 1.8"
      />
      <g clipPath={`url(#${id}-rug)`}>
        <NookThread
          d="M28 113Q125 138 222 113M27 110Q125 128 222 110"
          color="var(--scene-wood-light)"
          shadow="var(--scene-wood)"
          highlight="var(--scene-paper)"
          width={0.7}
          opacity={0.68}
          dasharray="2 2.5"
        />
      </g>
      <ellipse
        cx="121"
        cy="113"
        rx="81"
        ry="5.1"
        fill="var(--scene-shadow)"
        opacity=".13"
      />
      <g transform="translate(32 68) rotate(-8) scale(.61 .55)">
        <Pumpkin id={`${id}-ivory`} palette={ivory} />
      </g>
      <g transform="translate(78 29)">
        <Pumpkin id={`${id}-lantern`} palette={ochre} lantern />
      </g>
      <g transform="translate(164 63) rotate(8) scale(.58 .57)">
        <Pumpkin id={`${id}-russet`} palette={russet} />
      </g>
      <g
        fill="#a87c4f"
        stroke="#79573d"
        strokeWidth=".8"
        strokeLinejoin="round"
      >
        <path d="m211 112 2-12 4 5 7-3-2 8 6 3-10 6-8-3Z" />
        <path d="m28 112 4-8 4 4 8 1-5 7-11 1Z" />
      </g>
      <NookThread
        d="m209 120 10-12m-5 7-1-5m3 2 5-.5m-3-1 .5-5M27 119l11-8m-6 5 1-6m2 4 5-.5"
        color="#d1ad71"
        shadow="#77543b"
        highlight="#f1d39b"
        width={1.05}
      />
      <NookThread
        d="m212 114 .5-5m2 6 2-8m2 9 4-5M30 114l3-5m1 6 3-5m0 5 3-3"
        color="#c49a61"
        shadow="#77543b"
        highlight="#efd099"
        width={1.1}
      />
    </svg>
  );
}

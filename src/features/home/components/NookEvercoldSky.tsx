import { useId } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";
import "./nook-evercold-window.css";

type SkyLayer = "clouds";
type Floss = { color: string; shade: string; light: string };
const frost: Floss = { color: "#b9ced3", shade: "#708f9f", light: "#e9eee6" };
const n = (value: number) => value.toFixed(2);

function SkyPatch({
  d,
  stitches,
  floss,
  edge = 0.8,
  width = 1.05,
}: {
  d: string;
  stitches: string | string[];
  floss: Floss;
  edge?: number;
  width?: number;
}) {
  const id = `${useId().replace(/:/g, "")}-ec-sky-patch`;
  const paint = `url(#${id}-padding)`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
        <radialGradient id={`${id}-padding`} cx=".38" cy=".2" r=".92">
          <stop stopColor={floss.light} />
          <stop offset=".48" stopColor={floss.color} />
          <stop offset="1" stopColor={floss.shade} />
        </radialGradient>
      </defs>
      <path
        d={d}
        fill={floss.shade}
        opacity=".2"
        transform="translate(.35 .6)"
      />
      <path d={d} fill={paint} />
      <g clipPath={`url(#${id})`}>
        {(typeof stitches === "string" ? [stitches] : stitches).map(
          (course, tone) => (
            <NookThread
              key={tone}
              d={course}
              color={tone === 1 ? floss.color : paint}
              shadow={floss.shade}
              highlight={floss.light}
              width={width}
              relief={1.3}
              opacity={tone === 1 ? 0.78 : 0.9}
            />
          ),
        )}
      </g>
      <NookThread
        d={d}
        color={floss.color}
        shadow={floss.shade}
        highlight={floss.light}
        width={edge}
        relief={1.35}
      />
      <NookThread
        d={d}
        color={floss.light}
        shadow={floss.color}
        highlight={floss.light}
        width={edge * 0.65}
        dasharray=".6 1.7 .8 2.2"
        opacity={0.63}
      />
    </g>
  );
}

// Each replacement is a different cutout, not a rotated copy of one cloud.
const cloudShapes = [
  "M-34 6Q-29-1-20 1Q-18-8-10-7Q-4-17 7-10Q14-11 18-2Q29-5 35 5Q6 11-34 6Z",
  "M-35 5Q-29-3-20 0Q-16-10-9-7Q-1-16 8-9Q16-11 19-1Q29-3 34 6Q3 12-35 5Z",
  "M-33 6Q-28 0-20 2Q-20-7-11-8Q-5-16 6-11Q13-12 18-3Q30-6 36 4Q9 10-33 6Z",
] as const;
const cloudModels = cloudShapes.map((d, frame) => {
  const tones: string[][] = [[], [], []];
  for (let row = 0; row < 18; row++) {
    const y = -15 + row * 1.5;
    let x = -41 + threadVariation(row, 1891 + frame * 31) * 5;
    for (let stitch = 0; x < 39; stitch++) {
      const index = row * 8 + stitch;
      const length = 11 + threadVariation(index, 1894 + frame * 29) * 2.6;
      const arc = (value: number) =>
        y - Math.sin(((value + 35) / 70) * Math.PI) * (1.4 + frame * 0.18);
      const sy = arc(x),
        ey = arc(x + length);
      tones[(row + stitch + frame) % 3].push(
        `M${n(x)} ${n(sy)}Q${n(x + length * 0.48)} ${n((sy + ey) / 2 - 0.45)} ${n(x + length)} ${n(ey)}`,
      );
      x += length + 0.8 + threadVariation(index, 1897 + frame) * 0.18;
    }
  }
  return {
    d,
    stitches: tones.map((paths) => paths.join(" ")),
    tuft: [
      "M-20 2q9-3 15 0M8 2q8-3 14 .1",
      "M-21 1q8-3 15 .5M9 3q8-3 14-.5",
      "M-19 3q8-4 14-.2M7 1q8-3 15 .8",
    ][frame],
  };
});

function Cloud({ index }: { index: number }) {
  return (
    <g
      className={`nook-ec-cloud-drift nook-ec-cloud-drift--${index}`}
      data-cycle="evercold-clouds"
    >
      {cloudModels.map((model, frame) => (
        <g
          key={frame}
          data-cycle-model={frame}
          data-sewn-model={frame}
          opacity={frame === 0 ? 1 : 0}
        >
          <SkyPatch
            d={model.d}
            stitches={model.stitches}
            floss={frost}
            edge={0.9}
            width={1.18}
          />
          <NookThread
            d={model.tuft}
            color="#dce5e0"
            shadow="#91a9b6"
            highlight="#f0f0e5"
            width={0.78}
            opacity={0.68}
          />
        </g>
      ))}
    </g>
  );
}

/** Quiet cotton clouds are replaced only while the exposure changes. */
export function NookEvercoldSky({
  layer,
  embedded = false,
}: {
  layer: SkyLayer;
  embedded?: boolean;
}) {
  const content = (
    <>
      <g transform="translate(207 108) scale(.7)">
        <Cloud index={0} />
      </g>
      <g transform="translate(287 145) scale(.65)">
        <Cloud index={1} />
      </g>
    </>
  );
  if (embedded)
    return (
      <g
        className={`nook-ec-sky nook-ec-${layer}`}
        fill="none"
        aria-hidden="true"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {content}
      </g>
    );
  return (
    <svg
      className={`nook-cycle-surface nook-ec-sky nook-ec-${layer}`}
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {content}
    </svg>
  );
}

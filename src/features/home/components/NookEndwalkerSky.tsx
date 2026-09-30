import { useId } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";
import "./nook-endwalker-window.css";

const oceanRows = Array.from({ length: 60 }, (_, row) => {
  const y = -37 + row * 1.25;
  const half = Math.sqrt(Math.max(0, 37 * 37 - y * y));
  const mid = threadVariation(row, 830) * 7;
  return `M${-half} ${y}Q${-half / 2} ${y - 2.4} ${mid - 0.5} ${y - 1.5}M${mid + 0.6} ${y - 1.5}Q${half / 2} ${y - 2.2} ${half} ${y + 0.4}`;
}).join(" ");
const land = [
  "M-10-36Q-18-29-11-24L-15-17-7-13-12-7-6-2-10 4-4 9 1 6 5-3 2-9 8-13 5-21 13-27 8-35Z",
  "M18-21 23-26 32-21 37-14 31-6 22-5 17-9 12-7 9-13Z",
  "M5 12 10 6 18 8 21 14 18 20 21 25 14 32 10 27 8 20 2 17Z",
  "M-32 3-24 0-17 4-19 10-26 12-28 19-35 14Z",
];
const landSatin = Array.from({ length: 48 }, (_, i) => {
  const y = -37 + i * 1.6;
  return `M-39 ${y}q10-2 18 .2m1 0q8-2 18-.5m1 0q9-2 17-.2m1 0q10-2 23 .4`;
}).join(" ");
const cloudCourses = [
  "M-29-20Q-12-27-1-18T25-17M-27-17Q-12-24-1-15T23-14",
  "M7-29q9-4 14 1m-12-4q9-1 11 3M-8-7q10-6 19-.4q7 6 1 10q-7 2-9-2q0-4 5-3",
  "M-33 0Q-20-9-12 0T10 7M-33 3Q-20-6-12 3T8 10",
  "M-23 22q11-7 22-1t21-4M-20 25q10-6 20-2t15-3M-5 31q9-3 17-6",
  "M28-4q6 8 2 15M30-6q8 10 2 20M-16-31q5-3 9-2",
];
const stars = [
  [151, 81, 0.65],
  [185, 97, 1.2],
  [217, 73, 0.6],
  [220, 113, 0.65],
  [111, 134, 0.7],
  [147, 123, 0.8],
  [177, 153, 1.15],
  [203, 176, 0.7],
  [311, 175, 1.05],
  [290, 189, 0.6],
  [128, 174, 0.7],
  [227, 164, 0.6],
] as const;
const fineStars = Array.from({ length: 28 }, (_, i) => ({
  x: 76 + (threadVariation(i, 841) + 1) * 124,
  y: 62 + (threadVariation(i, 842) + 1) * 66,
  radius: 0.35 + (i % 3) * 0.1,
}));

/** Etheirys is padded blue cloth: laid ocean threads, inset land and cloud silk. */
function Etheirys({ id }: { id: string }) {
  return (
    <g className="nook-ew-etheirys" transform="translate(264 123)">
      <defs>
        <radialGradient id={`${id}-ocean`} cx="76%" cy="28%" r="85%">
          <stop stopColor="#b7d9e1" />
          <stop offset=".32" stopColor="#75aec5" />
          <stop offset=".63" stopColor="#4a7fac" />
          <stop offset="1" stopColor="#263a6a" />
        </radialGradient>
        <radialGradient id={`${id}-glow`}>
          <stop stopColor="#a8d9e8" stopOpacity=".22" />
          <stop offset=".66" stopColor="#83bfd7" stopOpacity=".12" />
          <stop offset="1" stopColor="#709fca" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-land`} x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#6c899f" />
          <stop offset=".5" stopColor="#93b8b9" />
          <stop offset="1" stopColor="#c1d4cc" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="1" x2="1" y2=".2">
          <stop stopColor="#172a53" stopOpacity=".62" />
          <stop offset=".52" stopColor="#254e78" stopOpacity=".12" />
          <stop offset="1" stopColor="#daeef1" stopOpacity=".04" />
        </linearGradient>
        <clipPath id={`${id}-disc`}>
          <circle r="37" />
        </clipPath>
        <clipPath id={`${id}-coast`}>
          {land.map((d) => (
            <path key={d} d={d} />
          ))}
        </clipPath>
      </defs>
      <circle r="58" fill={`url(#${id}-glow)`} />
      <circle cx=".7" cy="1.3" r="38" fill="#101c36" opacity=".45" />
      <circle r="37" fill={`url(#${id}-ocean)`} />
      <g clipPath={`url(#${id}-disc)`}>
        <NookThread
          d={oceanRows}
          color={`url(#${id}-ocean)`}
          shadow="#25375d"
          highlight="#d3eef0"
          width={1.12}
          relief={1.3}
        />
        {land.map((d) => (
          <path key={d} d={d} fill={`url(#${id}-land)`} />
        ))}
        <g clipPath={`url(#${id}-coast)`}>
          <NookThread
            d={landSatin}
            color={`url(#${id}-land)`}
            shadow="#54788f"
            highlight="#e0e9d9"
            width={1.32}
            relief={1.1}
          />
        </g>
        {land.map((d) => (
          <path
            key={d}
            d={d}
            stroke="#acd0d3"
            strokeWidth=".7"
            strokeDasharray="1.3 .7"
            opacity=".7"
          />
        ))}
        {cloudCourses.map((d, i) => (
          <NookThread
            key={i}
            d={d}
            color="#d5e6e3"
            shadow="#658cba"
            highlight="#ffffe9"
            width={i % 2 ? 1.25 : 1.75}
            relief={1.2}
            opacity={0.86}
          />
        ))}
        <circle r="38" fill={`url(#${id}-shade)`} />
      </g>
      <circle
        r="37"
        stroke="#6f9db7"
        strokeWidth="1.9"
        strokeDasharray="1.1 .75"
      />
      <path
        d="M-4-36.5A37 37 0 0 1 25 27"
        stroke="#c1e2e3"
        strokeWidth="1.7"
        strokeDasharray="1.4 .8"
      />
      <path
        d="M10-34.5A36 36 0 0 1 33 13"
        stroke="#e4f1e6"
        strokeWidth=".65"
        opacity=".8"
      />
    </g>
  );
}

/** The room changes light; the lunar window always looks out into space. */
export function NookEndwalkerSky() {
  const id = `${useId().replace(/:/g, "")}-lunar-sky`;
  return (
    <svg
      className="nook-cycle-surface nook-ew-space"
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g fill="#b8c9dc" opacity=".52">
        {fineStars.map(({ x, y, radius }, i) => (
          <circle key={i} cx={x} cy={y} r={radius} />
        ))}
      </g>
      {stars.map(([x, y, scale], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${scale})`}>
          <g className={`nook-ew-star nook-ew-star--${i % 3}`}>
            <NookThread
              d="M-1 .4q-1-2 .7-2.2q2 0 1.2 2q-1 1.1-1.9.2"
              color="#e2dfcb"
              shadow="#131d38"
              highlight="#fff3d4"
              width={1.25}
              relief={1.1}
            />
            {i % 3 === 1 && (
              <path
                d="M-3.2 0h6.4M0-3.2v6.4"
                stroke="#dee2da"
                strokeWidth=".7"
              />
            )}
          </g>
        </g>
      ))}
      <Etheirys id={id} />
    </svg>
  );
}

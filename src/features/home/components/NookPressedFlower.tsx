import { useId } from "react";
import { NookThread } from "./NookThread";

const stems = "M24 96C19 70 28 46 18 14M23 82Q34 62 35 40M23 65Q10 57 9 40";
const petal = "M0 5C-6 1-6-5-3-7Q0-9 2-5C7-6 6 2 0 5Z";
const blossoms = [
  [17, 15, -14],
  [19, 23, 25],
  [15, 30, -30],
  [21, 36, 22],
  [34, 40, 20],
  [31, 48, -18],
  [36, 53, 30],
  [9, 40, -25],
  [12, 48, 10],
];
const petalStitches = [
  "M-3.4-5.7Q-3.7-1.1-.8 2.6",
  "M-2.1-6.5Q-2.2-1.9-.3 3.3",
  "M-.8-6.5Q-.5-1.1.2 3.4",
  "M.5-5.5Q1 .1.5 3.2",
  "M2.7-3.9Q2.4-.5.9 2.8",
  "M4-3Q3.8-.1 1.5 2.4",
];
const leaves = [
  {
    outline: "M23 78C13 75 11 65 13 63Q23 66 23 78Z",
    stitches:
      "M13.1 65.1 16.2 67.8 16.6 66.2M13.3 68 18 70.4 18.8 67.9M14.8 71.2 19.8 73 20.8 70.5M18 74.5 21.6 75.7 22 73.9",
    vein: "M13 63Q17.7 70.4 23 78",
  },
  {
    outline: "M25 71C28 58 37 56 39 57Q37 67 25 71Z",
    stitches:
      "M36.9 57.9 36.3 60.2 38 59.4M33.9 58.4 33.6 62.4 36.7 62.4M30.7 60.5 30.9 65 34.7 65M28.3 63.8 28.2 67.5 31.2 67.4",
    vein: "M25 71Q31.8 64 39 57",
  },
  {
    outline: "M23 58C15 52 13 46 15 43Q23 47 23 58Z",
    stitches:
      "M14.7 45.5 17.3 48 17.6 45.6M15.4 48.5 19.2 50.8 20 48M17.8 52.3 21.2 53.9 21.8 51.4",
    vein: "M15 43Q19 51 23 58",
  },
];

/** A stitched botanical keepsake tied with a few turns of rose-colored floss. */
export function NookPressedFlower() {
  const id = useId().replace(/:/g, "");

  return (
    <svg
      className="nook-pressed-flower"
      viewBox="0 0 48 102"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={`${id}-flower-petal`} x1="0" y1="0" x2="1" y2=".7">
          <stop stopColor="color-mix(in srgb, var(--scene-dried-flower) 62%, var(--scene-paper))" />
          <stop offset=".45" stopColor="var(--scene-dried-flower)" />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-dried-flower) 76%, var(--scene-wood-dark))"
          />
        </linearGradient>
        <linearGradient id={`${id}-flower-leaf`} x1="0" y1="0" x2="1" y2=".8">
          <stop stopColor="var(--scene-leaf-light)" />
          <stop offset=".55" stopColor="var(--scene-leaf)" />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-leaf) 80%, var(--scene-wood-dark))"
          />
        </linearGradient>
      </defs>

      <NookThread
        d={stems}
        color="var(--scene-leaf)"
        highlight="var(--scene-leaf-light)"
        width={1.5}
        relief={1.2}
      />
      <path
        d="M20.3 24.5 21.8 25.7M21.7 32 23.1 33.2M22.9 44.5 24.3 45.4M23 53 24.4 53.8M22.2 71 23.6 71.8M22 90 23.4 90.8M27.1 74 28.2 75.1M32 61 33.2 62.2M13.1 52.5 12.3 53.6"
        stroke="var(--scene-leaf-light)"
        strokeWidth=".55"
        opacity=".8"
      />

      {leaves.map(({ outline, stitches, vein }) => (
        <g key={outline}>
          <path
            d={outline}
            fill="var(--scene-shadow)"
            opacity=".18"
            transform="translate(.65 1)"
          />
          <path
            d={outline}
            fill={`url(#${id}-flower-leaf)`}
            stroke="var(--scene-leaf)"
            strokeWidth=".45"
          />
          <NookThread
            d={stitches}
            color="var(--scene-leaf)"
            highlight="var(--scene-leaf-light)"
            width={0.8}
            relief={0.7}
          />
          <NookThread
            d={vein}
            color="var(--scene-leaf-light)"
            highlight="var(--scene-paper)"
            width={0.65}
            relief={0.65}
          />
        </g>
      ))}

      {blossoms.map(([x, y, angle]) => (
        <g
          key={`${x}-${y}`}
          transform={`translate(${x} ${y}) rotate(${angle})`}
        >
          <path
            d={petal}
            fill="var(--scene-shadow)"
            opacity=".2"
            transform="translate(.5 .85)"
          />
          <path
            d={petal}
            fill={`url(#${id}-flower-petal)`}
            stroke="var(--scene-dried-flower)"
            strokeWidth=".55"
          />
          {petalStitches.map((d) => (
            <NookThread
              key={d}
              d={d}
              color="var(--scene-dried-flower)"
              highlight="var(--scene-paper)"
              shadow="var(--scene-wood-dark)"
              width={0.75}
              relief={0.6}
            />
          ))}
          <NookThread
            d="M-1.5 3.3Q-.2 4.8 1.3 3.5"
            color="var(--scene-gold)"
            width={0.8}
            relief={0.7}
          />
        </g>
      ))}

      <NookThread
        d="M17.5 82.8Q22.8 83.2 28 80.2M17.9 84.4Q23.2 84.6 28.5 81.8M18.4 86Q23.8 86.1 29 83.5"
        color="var(--scene-rose)"
        width={1.25}
        relief={1.2}
      />
      <NookThread
        d="M24 84Q35 75.5 34.5 82.5C34.2 86 28.9 87.1 24 84Q17.6 76.7 15.8 81C14 85.8 20.4 86.7 24 84"
        color="var(--scene-rose)"
        width={1.15}
        relief={1.2}
      />
      <NookThread
        d="M24.8 85.2Q26.3 90.4 29.7 95.6M23.6 85.6Q21.8 90 19.2 93.8"
        color="var(--scene-rose)"
        width={1.15}
        relief={1.2}
      />
      <NookThread
        d="M22.5 84.1Q23.7 82.3 25.1 83.9Q25.6 85.2 24.1 85.6Q22.4 85.4 22.5 84.1"
        color="var(--scene-rose)"
        width={1.2}
        relief={1.1}
      />
      <path
        d="M29.7 95.5 30.5 97M29.5 95.7 29.6 97.3M19.2 93.8 18.1 95M19.4 94 19 95.5"
        stroke="var(--scene-rose)"
        strokeWidth=".45"
      />
    </svg>
  );
}

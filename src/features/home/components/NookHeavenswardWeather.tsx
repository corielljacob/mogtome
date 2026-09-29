import { useId, type ReactNode } from "react";
import { NookThread } from "./NookThread";
import { NookHeavenswardDragon } from "./NookHeavenswardDragon";
import "./nook-heavensward-window.css";

type SnowDepth = "far" | "middle" | "near";

// A repeat taller than the glass keeps each reset beyond the visible frame.
const SNOW_REPEAT = 480;

function scatterFlakes(count: number, seed: number) {
  let state = seed;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  return Array.from({ length: count }, (_, index) => ({
    x: Math.round((40 + next() * 322) * 10) / 10,
    y:
      Math.round(((index + 0.15 + next() * 0.7) / count) * SNOW_REPEAT * 10) /
      10,
    size: 0.75 + next() * 0.65,
    turn: Math.round(next() * 60),
  }));
}

// Stable, vertically staggered scatter: no new positions on a mode change.
const snow = {
  far: [scatterFlakes(24, 3121), scatterFlakes(24, 5929)],
  middle: [scatterFlakes(18, 1747), scatterFlakes(18, 8513)],
  near: [scatterFlakes(8, 7307), scatterFlakes(8, 2341)],
};

function Snowfall({ depth }: { depth: SnowDepth }) {
  const id = `${useId().replace(/:/g, "")}-snow-${depth}`;
  const scale = depth === "near" ? 1.5 : depth === "middle" ? 1.1 : 0.7;
  return (
    <g className={`nook-hw-snow nook-hw-snow--${depth}`}>
      <defs>
        {snow[depth].map((flakes, cohort) => (
          <g id={`${id}-${cohort}`} key={cohort}>
            {flakes.map((flake, index) => (
              <g
                key={index}
                transform={`translate(${flake.x} ${flake.y}) rotate(${flake.turn}) scale(${flake.size * scale})`}
              >
                {depth === "near" && index % 4 === 0 ? (
                  <>
                    <NookThread
                      d="M0-2.6V2.6M-2.25-1.3 2.25 1.3M-2.25 1.3 2.25-1.3"
                      color="var(--hw-snow-thread)"
                      shadow="var(--hw-snow-shadow)"
                      highlight="#fffdf3"
                      width={0.85}
                      relief={0.8}
                    />
                    <circle r=".75" fill="var(--hw-snow-thread)" />
                  </>
                ) : (
                  <>
                    {/* Little irregular French knots, never long rain dashes. */}
                    <path
                      d="M-.9-.55Q-.4-1.15.35-.75 1.15-.5.75.35 .35 1-.35.7-1.15.4-.9-.55Z"
                      fill="var(--hw-snow-thread)"
                      stroke="var(--hw-snow-shadow)"
                      strokeWidth=".35"
                    />
                    {depth !== "far" && (
                      <path
                        d="M-.5-.4 .2-.65"
                        stroke="#fffdf3"
                        strokeWidth=".4"
                      />
                    )}
                  </>
                )}
              </g>
            ))}
          </g>
        ))}
      </defs>
      {snow[depth].map((_, cohort) => (
        <g
          key={cohort}
          className={`nook-hw-snow-gust nook-hw-snow-gust--${cohort}`}
        >
          <g className={`nook-hw-snowfall nook-hw-snowfall--${cohort}`}>
            {[-1, 0, 1].map((tile) => (
              <use
                key={tile}
                href={`#${id}-${cohort}`}
                y={tile * SNOW_REPEAT}
              />
            ))}
          </g>
        </g>
      ))}
    </g>
  );
}

function Atmosphere({
  layer,
  children,
}: {
  layer: "sky" | "front";
  children: ReactNode;
}) {
  return (
    <svg
      className={`nook-hw-atmosphere nook-hw-${layer === "sky" ? "sky" : "weather"}`}
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/** The city can occlude the distant snow and dragon as they pass behind it. */
export function NookHeavenswardSky() {
  return (
    <Atmosphere layer="sky">
      <Snowfall depth="far" />
      <NookHeavenswardDragon />
    </Atmosphere>
  );
}

/** Foreground flurries keep their own clocks outside the fixed painted city. */
export function NookHeavenswardWeather() {
  return (
    <Atmosphere layer="front">
      <Snowfall depth="middle" />
      <Snowfall depth="near" />
    </Atmosphere>
  );
}

import { useId, type CSSProperties } from "react";
import { NookThread } from "./NookThread";
import "./nook-tea-steam.css";

// Replacement embroidery: the two roots stay on the cup while a small curl
// travels through each strand. Neighboring poses share their direction of travel.
const steamFrames = [
  {
    curls:
      "M265 393C260 387 268 384 267 379C266 374 262 372 264 367Q267 364 267 360M277 391C281 387 275 384 276 380Q277 377 279 374",
    stitch: 0,
    exposure: 0,
  },
  {
    curls:
      "M265 393C261 387 269 384 268 379C267 375 263 372 264.5 367Q267.5 364 268 360.5M277 391C280.5 387 274.5 384 275.5 380Q276.5 377 278.5 374.5",
    stitch: 0.2,
    exposure: 1,
  },
  {
    curls:
      "M265 393C262 387.5 269.5 384.5 269 380C268.5 376 264 373 265 368Q268 364.5 269 361M277 391C280 387 274 384.5 275 380.5Q276 377.5 278 375",
    stitch: 0.4,
    exposure: 2,
  },
  {
    curls:
      "M265 393C262 388 269 385 269 381C269 376.5 265 373.5 265.5 368.5Q268.5 365 269.5 361.5M277 391C279.5 387.5 274.5 385 275 381Q275.5 378 277.5 375.5",
    stitch: 0.3,
    exposure: 3,
  },
  {
    curls:
      "M265 393C261.5 388 268 385 268 381C268 376.5 264.5 373 265 368Q268 364.5 269 361M277 391C280 388 275 385 275.5 381Q276 378 278 375",
    stitch: 0.5,
    exposure: 4,
  },
  {
    curls:
      "M265 393C260.5 387.5 267 384.5 267 380C267 375.5 263.5 372.5 264 367.5Q267 364 267.5 360.5M277 391C280.5 388 275.5 385 276 380.5Q277 377.5 279 374.5",
    stitch: 0.1,
    exposure: 6,
  },
  {
    curls:
      "M265 393C259.5 387 266 384 266 379C266 374.5 262 372 263 367Q265.5 363.5 266 359.5M277 391C281.5 387.5 276 384.5 276.5 380Q278 377 279.5 374",
    stitch: 0.3,
    exposure: 7,
  },
  {
    curls:
      "M265 393C259.5 387 267 383.5 266.5 378.5C266 374 261.5 371.5 263.5 366.5Q266 363.5 266.5 359.5M277 391C281.5 387 275.5 384 276.5 379.5Q277.5 376.5 279.5 373.5",
    stitch: 0.1,
    exposure: 8,
  },
];

/** Pale floss is re-laid for each exposure instead of sliding the whole steam. */
export function NookTeaSteam() {
  const id = useId().replace(/:/g, "");

  return (
    <g className="nook-tea-steam" fill="none" opacity=".64">
      <defs>
        <linearGradient
          id={`${id}-tea-steam`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="0"
          y1="359"
          y2="393"
        >
          <stop stopColor="var(--scene-paper)" stopOpacity="0" />
          <stop offset=".45" stopColor="var(--scene-paper)" stopOpacity=".7" />
          <stop offset="1" stopColor="var(--scene-paper)" stopOpacity=".1" />
        </linearGradient>
      </defs>
      {steamFrames.map((frame, index) => (
        <g
          key={index}
          className="nook-tea-steam-frame"
          data-frame={index}
          strokeDashoffset={frame.stitch}
          style={{ "--steam-exposure": frame.exposure } as CSSProperties}
        >
          <NookThread
            d={frame.curls}
            color={`url(#${id}-tea-steam)`}
            shadow="var(--scene-paper)"
            width={1.15}
            dasharray="3.4 1.1"
          />
        </g>
      ))}
    </g>
  );
}

import { NookThread } from "./NookThread";
import "./nook-stormblood-window.css";

// Tiny cloth birds have held wing poses, with the far wing underneath the body.
const wings = [
  ["M0 0Q-4-5-10-5L-7-2-1 2Z", "M0 1Q4-6 10-7L7-2 1 2Z"],
  ["M0 0Q-5-1-11 1L-7 3-1 2Z", "M0 1Q6-2 12 0L7 2 1 3Z"],
  ["M0 0Q-3 4-8 7L-6 8 0 3Z", "M0 1Q5 3 9 7L6 8 0 3Z"],
];

function ClothBird() {
  return (
    <g className="nook-sb-bird">
      {wings.map(([far, near], pose) => (
        <g
          key={pose}
          className={`nook-sb-wing-pose nook-sb-wing-pose--${pose}`}
        >
          <path d={far} fill="#76615e" stroke="#54444e" strokeWidth=".55" />
          <NookThread
            d="M-.5-1Q1-1 1.5 1L.5 4-1 5-1 2"
            color="#b89979"
            shadow="#4e3b43"
            highlight="#ead5ad"
            width={1.6}
            relief={0.7}
          />
          <path d={near} fill="#aa8770" stroke="#614c4e" strokeWidth=".65" />
          <NookThread
            d={near}
            color="#c4a184"
            shadow="#63474b"
            highlight="#e0c29c"
            width={0.75}
            relief={0.8}
          />
          <path d="M.6-.8q1.5-.7 2 .6l-1.5.5" fill="#b89979" />
        </g>
      ))}
    </g>
  );
}

/** Persistent wind and wing clocks sit behind the two fixed landscape exposures. */
export function NookStormbloodSky() {
  return (
    <svg
      className="nook-sb-atmosphere nook-sb-sky"
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g className="nook-sb-flight nook-sb-flight--one">
        <g transform="translate(258 108) scale(.64)">
          <ClothBird />
        </g>
      </g>
      <g className="nook-sb-flight nook-sb-flight--two">
        <g transform="translate(285 124) scale(.43)">
          <ClothBird />
        </g>
      </g>
      <g className="nook-sb-flight nook-sb-flight--three">
        <g transform="translate(235 119) scale(.36)">
          <ClothBird />
        </g>
      </g>
    </svg>
  );
}

const motes = [
  [98, 177],
  [151, 135],
  [212, 205],
  [303, 171],
  [124, 247],
  [269, 264],
  [185, 301],
  [321, 325],
];

/** Sparse golden fiber knots lift on the desert breeze, never a snow-like curtain. */
export function NookStormbloodBreeze() {
  return (
    <svg
      className="nook-sb-atmosphere nook-sb-breeze"
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
    >
      {motes.map(([x, y], i) => (
        <g
          key={i}
          className={`nook-sb-mote nook-sb-mote--${i % 3}`}
          style={{ animationDelay: `${-i * 2.7}s` }}
        >
          <path
            d={`M${x} ${y}q.8-1.1 1.5-.6t-.5 1.2`}
            stroke="#a17b55"
            strokeWidth="1.1"
          />
          <path
            d={`M${x + 0.15} ${y - 0.15}l.65-.35`}
            stroke="#f8ddaa"
            strokeWidth=".65"
          />
        </g>
      ))}
    </svg>
  );
}

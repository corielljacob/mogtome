import { useId } from "react";
import { NookThread } from "./NookThread";
import "./nook-shadowbringers-window.css";

const leaf = "M-7-1Q-3-7 2-5L6-7 5-3Q9 0 5 4L1 7Q-5 4-7-1Z";
const leafSatin = Array.from({ length: 9 }, (_, i) => {
  const y = -5 + i * 1.25;
  return `M${-6 + i * 0.3} ${y - 1}Q-1 ${y + 1.8} ${6 - i * 0.3} ${y - 0.5}`;
}).join(" ");
const leaves = [
  [87, 210, 0.62, -32],
  [309, 241, 0.73, 21],
  [112, 303, 0.5, 67],
  [277, 343, 0.6, -48],
] as const;

/** Sparse drifting aether remains behind the domes and the tower. */
export function NookShadowbringersSky() {
  return (
    <svg
      className="nook-shb-atmosphere nook-shb-sky"
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
    >
      {[
        [103, 121],
        [283, 94],
        [306, 183],
        [85, 279],
        [249, 233],
        [143, 168],
      ].map(([x, y], i) => (
        <g
          key={i}
          className={`nook-shb-aether nook-shb-aether--${i % 2}`}
          style={{ animationDelay: `${-i * 3.7}s` }}
        >
          <NookThread
            d={`M${x} ${y}q1.1-1.6 2-.6t-1.7 1.4`}
            color="#e0d4bd"
            shadow="#7f7393"
            highlight="#fff4dc"
            width={0.85}
            relief={0.7}
          />
        </g>
      ))}
    </svg>
  );
}

/** Each little leaf is a sewn cutout; only the outer carriers move. */
export function NookShadowbringersLeaves() {
  const id = `${useId().replace(/:/g, "")}-lakeland-leaf`;
  return (
    <svg
      className="nook-shb-atmosphere nook-shb-leaves"
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <clipPath id={id}>
          <path d={leaf} />
        </clipPath>
        <linearGradient id={`${id}-padding`} x1="0" y1="0" x2="1" y2=".8">
          <stop stopColor="#d1b5d5" />
          <stop offset=".4" stopColor="#a58ebc" />
          <stop offset="1" stopColor="#71618e" />
        </linearGradient>
        <g id={`${id}-sewn`}>
          <path
            d={leaf}
            fill="#514665"
            opacity=".3"
            transform="translate(.3 .5)"
          />
          <path d={leaf} fill={`url(#${id}-padding)`} />
          <g clipPath={`url(#${id})`}>
            <NookThread
              d={leafSatin}
              color={`url(#${id}-padding)`}
              shadow="#64506f"
              highlight="#e6cede"
              width={1.05}
              relief={0.9}
            />
          </g>
          <NookThread
            d={leaf}
            color="#b8a0c5"
            shadow="#5e4b70"
            highlight="#ead9e1"
            width={0.7}
            relief={0.8}
          />
          <NookThread
            d="M-3 8Q1 2 5-5M0 3-4-1M2 0 5 1"
            color="#dfc9ca"
            shadow="#715d80"
            highlight="#f4e0d3"
            width={0.65}
            relief={0.8}
          />
        </g>
      </defs>
      {leaves.map(([x, y, scale, turn], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g
            className={`nook-shb-leaf-drift nook-shb-leaf-drift--${i % 2}`}
            style={{ animationDelay: `${-i * 7.3}s` }}
          >
            <g transform={`rotate(${turn}) scale(${scale})`}>
              <use href={`#${id}-sewn`} />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}

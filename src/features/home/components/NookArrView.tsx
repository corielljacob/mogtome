import { useId, type CSSProperties } from "react";
import { NookThread } from "./NookThread";
import "./nook-arr-window.css";

const silhouette =
  "M201 80 239 124 258 177 239 258 201 334 154 260 136 190 163 127Z";
const facets = [
  {
    d: "M201 80 181 168 136 190 163 127Z",
    color: "#8dc9d1",
    shine: "#d5efe8",
    slope: -0.3,
  },
  {
    d: "M201 80 239 124 258 177 211 183Z",
    color: "#5ba4be",
    shine: "#b9e3e6",
    slope: 0.46,
  },
  {
    d: "M181 168 201 334 154 260 136 190Z",
    color: "#5593ad",
    shine: "#a5d6de",
    slope: 0.34,
  },
  {
    d: "M211 183 258 177 239 258 201 334Z",
    color: "#357396",
    shine: "#80bbce",
    slope: -0.29,
  },
  {
    d: "M201 80 211 183 201 334 181 168Z",
    color: "#bfdfdc",
    shine: "#f0f0d8",
    slope: 0.08,
  },
];

// Short rows of satin stitches follow each face instead of a smooth glass sheen.
function facetStitches(slope: number) {
  return Array.from({ length: 45 }, (_, column) =>
    Array.from({ length: 18 }, (_, row) => {
      const y = 74 + row * 15 + (column % 3) * 4;
      const x = 112 + column * 3.5 + (y - 200) * slope;
      return `M${x.toFixed(1)} ${y}l${(12 * slope).toFixed(1)} 12`;
    }).join(" "),
  ).join(" ");
}
const stitchedFacets = facets.map((facet) => ({
  ...facet,
  stitches: facetStitches(facet.slope),
}));
const stars =
  "M103 133v6m-3-3h6M290 124v5m-2.5-2.5h5M116 255v5m-2.5-2.5h5M278 304v6m-3-3h6M162 367v4m-2-2h4M306 217v4m-2-2h4M228 391v4m-2-2h4";
const orbits = [
  {
    x: 101,
    y: 30,
    tilt: -19,
    center: 187,
    duration: 9,
    delay: -1.3,
    restX: 91,
    restY: 12,
    color: "#d8eece",
  },
  {
    x: 87,
    y: 42,
    tilt: 24,
    center: 218,
    duration: 11,
    delay: -6.8,
    restX: -85,
    restY: -5,
    color: "#a8dbe8",
  },
  {
    x: 77,
    y: 27,
    tilt: -32,
    center: 147,
    duration: 8,
    delay: -4.7,
    restX: 65,
    restY: 14,
    color: "#e2c7db",
  },
  {
    x: 101,
    y: 33,
    tilt: 9,
    center: 272,
    duration: 12,
    delay: -10.5,
    restX: -93,
    restY: 10,
    color: "#c4c7e6",
  },
  {
    x: 83,
    y: 30,
    tilt: -14,
    center: 301,
    duration: 10,
    delay: -3.8,
    restX: 78,
    restY: 7,
    color: "#b3ddd5",
  },
];

/** A single permanent night scene: the Mothercrystal keeps her own light. */
export function NookArrView() {
  const id = `${useId().replace(/:/g, "")}-mothercrystal`;
  const paint = (name: string) => `url(#${id}-${name})`;
  const thread = (d: string, color: string, width = 1.8, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      shadow="#122738"
      highlight="#e5ead8"
      width={width}
      relief={1.6}
      opacity={opacity}
    />
  );
  const orbitLayer = (depth: "back" | "front") => (
    <g className={`nook-arr-orbits nook-arr-orbits--${depth}`}>
      {orbits.map((orb, index) => (
        <g
          key={index}
          transform={`translate(201 ${orb.center}) rotate(${orb.tilt})`}
        >
          <g
            className={`nook-arr-orb nook-arr-orb--${depth}`}
            style={
              {
                "--orbit-x": `${orb.x}px`,
                "--orbit-y": `${orb.y}px`,
                "--orbit-duration": `${orb.duration}s`,
                "--orbit-delay": `${orb.delay}s`,
                "--orbit-rest-x": `${orb.restX}px`,
                "--orbit-rest-y": `${orb.restY}px`,
                "--orb-color": orb.color,
              } as CSSProperties
            }
          >
            <use href={`#${id}-orb`} />
          </g>
        </g>
      ))}
    </g>
  );

  return (
    <svg
      className="nook-arr-view"
      viewBox="70 58 262 373"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <pattern
          id={`${id}-weave`}
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 1h5M1 0v5"
            stroke="#7ca5b0"
            strokeWidth=".65"
            opacity=".11"
          />
          <path
            d="M0 3.5h5M3.5 0v5"
            stroke="#030d18"
            strokeWidth=".7"
            opacity=".45"
          />
        </pattern>
        <radialGradient id={`${id}-aether`}>
          <stop stopColor="#7bb7cb" stopOpacity=".28" />
          <stop offset=".65" stopColor="#4e87a0" stopOpacity=".11" />
          <stop offset="1" stopColor="#1a344c" stopOpacity="0" />
        </radialGradient>
        {stitchedFacets.map((facet, index) => (
          <clipPath key={index} id={`${id}-facet-${index}`}>
            <path d={facet.d} />
          </clipPath>
        ))}
        <g id={`${id}-orb`}>
          <circle r="8" fill="var(--orb-color)" opacity=".08" />
          <circle r="4" fill="var(--orb-color)" />
          {thread(
            "M-3 1q-1-5 3-4t3 4q-2 4-5 1q-3-3 1-4q4 0 2 3q-2 2-2-1",
            "var(--orb-color)",
            1.8,
          )}
          <path
            d="M-2-2h1m2 1h1"
            stroke="#f2edd7"
            strokeWidth="1.1"
            opacity=".85"
          />
        </g>
      </defs>

      <path d="M70 58h262v373H70Z" fill="#101e32" />
      <ellipse cx="201" cy="201" rx="133" ry="180" fill={paint("aether")} />
      <path d="M70 58h262v373H70Z" fill={paint("weave")} />
      {thread(
        "M68 343Q129 379 231 344T344 272M76 332Q135 365 235 332T337 257M65 98Q121 64 166 79M261 372q52-12 75-43",
        "#50788b",
        1.2,
        0.2,
      )}
      {thread(stars, "#afc7cf", 1.15, 0.6)}
      <path
        d="M92 193h.1M277 165h.1M119 321h.1M293 357h.1M180 111h.1M258 99h.1M99 390h.1"
        stroke="#b1c3c6"
        strokeWidth="1.6"
        opacity=".5"
      />

      {orbitLayer("back")}
      <g className="nook-arr-mothercrystal">
        {thread(silhouette, "#b7dcd9", 4, 0.18)}
        {stitchedFacets.map((facet, index) => (
          <g key={index}>
            <path d={facet.d} fill={facet.color} />
            <g clipPath={paint(`facet-${index}`)}>
              <NookThread
                d={facet.stitches}
                color={facet.color}
                shadow="#153a56"
                highlight={facet.shine}
                width={2.5}
                relief={1.8}
              />
            </g>
          </g>
        ))}
        {thread(silhouette, "#8ebfce", 1.8)}
        {thread(
          "M201 80 181 168 201 334M201 80 211 183 201 334M136 190l45-22 30 15 47-6",
          "#d3e3dc",
          1.35,
          0.9,
        )}
        {thread(
          "M197 106 188 155M194 184l5 68M217 202l-7 70M158 196l15 47M225 135l17 28",
          "#e3e8cf",
          1.2,
          0.5,
        )}
      </g>
      {orbitLayer("front")}
    </svg>
  );
}

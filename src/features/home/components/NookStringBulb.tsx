import { Fragment } from "react";

interface NookStringBulbProps {
  /** ID of the shared paint definitions for this light strand. */
  id: string;
  variant?: number;
}

const glassTones = [
  { edge: "#b58a4e", body: "#ffe6af", heart: "#fff3cc", glow: "#ffd181" },
  { edge: "#b17a37", body: "#ffda94", heart: "#ffebbb", glow: "#ffc271" },
  { edge: "#ba965f", body: "#ffedc4", heart: "#fff7df", glow: "#ffdaa0" },
];

const glassOutline =
  "M-2.7 4.3V6.2C-2.7 8.1-6.8 9.2-6.8 14.1C-6.8 18.8-3.8 22 0 22C3.8 22 6.8 18.8 6.8 14.1C6.8 9.2 2.7 8.1 2.7 6.2V4.3Z";

/** Define each glass tone once, even when bulbs occupy separate SVG viewports. */
export function NookStringBulbDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-socket`} x1="0" x2="1" y1="0" y2=".15">
        <stop stopColor="#59442e" />
        <stop offset=".23" stopColor="#ac8b52" />
        <stop offset=".43" stopColor="#d2b77e" />
        <stop offset=".68" stopColor="#92733f" />
        <stop offset="1" stopColor="#51422f" />
      </linearGradient>
      {glassTones.map((tone, variant) => (
        <Fragment key={variant}>
          <linearGradient
            id={`${id}-${variant}-glass`}
            x1="-6.8"
            y1="11"
            x2="6.8"
            y2="16"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={tone.edge} stopOpacity=".76" />
            <stop offset=".17" stopColor={tone.body} stopOpacity=".84" />
            <stop offset=".38" stopColor={tone.heart} stopOpacity=".72" />
            <stop offset=".67" stopColor={tone.body} stopOpacity=".85" />
            <stop offset="1" stopColor={tone.edge} stopOpacity=".86" />
          </linearGradient>
          <radialGradient
            id={`${id}-${variant}-glass-heart`}
            cx=".47"
            cy=".6"
            r=".6"
          >
            <stop stopColor="#fff9df" stopOpacity=".9" />
            <stop offset=".43" stopColor={tone.heart} stopOpacity=".38" />
            <stop offset="1" stopColor={tone.body} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-${variant}-halo`}>
            <stop stopColor={tone.glow} stopOpacity=".5" />
            <stop offset=".22" stopColor={tone.glow} stopOpacity=".25" />
            <stop offset=".58" stopColor="#ecae58" stopOpacity=".075" />
            <stop offset="1" stopColor="#e9a153" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-${variant}-inner-halo`}>
            <stop stopColor="#fff6cc" stopOpacity=".8" />
            <stop offset=".32" stopColor={tone.glow} stopOpacity=".33" />
            <stop offset="1" stopColor={tone.glow} stopOpacity="0" />
          </radialGradient>
        </Fragment>
      ))}
    </defs>
  );
}

/** A small real glass bulb, anchored at its socket. CSS controls the halo strength. */
export function NookStringBulb({ id, variant = 0 }: NookStringBulbProps) {
  const tone = Math.abs(Math.trunc(variant)) % glassTones.length;
  const paint = (name: string) => `url(#${id}-${tone}-${name})`;

  return (
    <g className="nook-bulb" strokeLinecap="round" strokeLinejoin="round">
      <ellipse
        className="nook-bulb-halo"
        cy="13"
        rx="32"
        ry="38"
        fill={paint("halo")}
        stroke="none"
      />
      <ellipse
        className="nook-bulb-halo nook-bulb-halo--inner"
        cy="14"
        rx="15"
        ry="18"
        fill={paint("inner-halo")}
        stroke="none"
      />

      <path
        className="nook-bulb-glass"
        d={glassOutline}
        fill={paint("glass")}
        stroke="#987444"
        strokeOpacity=".65"
        strokeWidth=".65"
      />
      <path d={glassOutline} fill={paint("glass-heart")} stroke="none" />

      {/* Fine lead wires hold the glowing tungsten loop inside the glass. */}
      <path
        d="M-1.5 5.5-.9 11.7-2 15.3M1.5 5.5.9 11.7 2 15.3"
        fill="none"
        stroke="#9c7645"
        strokeWidth=".5"
        strokeOpacity=".7"
      />
      <g className="nook-bulb-filament" fill="none">
        <path
          d="M-2 15.3q.1 2 1 1.2q1-1 2 0q.9.8 1-1.2"
          stroke="#f5a13e"
          strokeWidth="2.4"
          strokeOpacity=".28"
        />
        <path
          d="M-2 15.3q.1 2 1 1.2q1-1 2 0q.9.8 1-1.2"
          stroke="#ffc96b"
          strokeWidth="1.15"
        />
        <path
          d="M-1.9 15.4q.1 1.6.9 1q1-1 2 0q.8.6.9-1"
          stroke="#fff9dd"
          strokeWidth=".55"
        />
      </g>

      {/* Asymmetric reflected highlights keep the amber envelope glassy. */}
      <path
        d="M-3.4 9.4Q-5.3 11-5.1 14.1"
        fill="none"
        stroke="#fffaf0"
        strokeWidth="1.35"
        strokeOpacity=".88"
      />
      <path
        d="M-4.8 16.5q.35 1.2 1.1 1.8M2.3 20q1.7-.7 2.3-2.5"
        fill="none"
        stroke="#fff1cb"
        strokeWidth=".65"
        strokeOpacity=".7"
      />
      <path
        d="M5.8 12.9Q6.8 18.8 1.5 21"
        fill="none"
        stroke="#aa7f41"
        strokeWidth=".5"
        strokeOpacity=".55"
      />

      {/* The dark insulated neck and brass socket meet the overhead cord. */}
      <path d="M-1.75 0h3.5v1.7h-3.5Z" fill="#554a39" stroke="none" />
      <path
        d="M-3 1Q0 .2 3 1L3.2 4.6Q0 5.6-3.2 4.6Z"
        fill={`url(#${id}-socket)`}
        stroke="#58432e"
        strokeWidth=".6"
      />
      <path
        d="M-2.9 2.4q2.9.8 5.8-.1M-3 3.9q3 .8 6-.1"
        fill="none"
        stroke="#55432e"
        strokeWidth=".65"
        strokeOpacity=".65"
      />
      <path
        d="M-1.6 1.2q1.2-.15 2.2 0M-1.7 4.7l2.1.15"
        fill="none"
        stroke="#e8d2a1"
        strokeWidth=".55"
        strokeOpacity=".74"
      />
    </g>
  );
}

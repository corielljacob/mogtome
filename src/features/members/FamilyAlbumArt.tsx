import { useId, type SVGProps } from "react";

/** The Home moogle illustration in a Polaroid, beside a cloth-bound album. */
export function FamilyAlbumArt(props: SVGProps<SVGSVGElement>) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 350 230"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <defs>
        <pattern
          id={`${id}-cloth`}
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 1h4M1 0v4"
            stroke="var(--nook-paper)"
            strokeWidth=".45"
            opacity=".15"
          />
        </pattern>
      </defs>
      <ellipse
        cx="171"
        cy="206"
        rx="135"
        ry="12"
        fill="var(--scene-shadow)"
        opacity=".1"
      />
      <g
        transform="rotate(-9 150 120)"
        stroke="var(--nook-ink)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="m49 44 163-2 5 160-165 1q-10-1-11-10L39 56q0-10 10-12Z"
          fill="var(--scene-paper)"
          strokeWidth="1.1"
        />
        <path
          d="m53 197 159-1m-160-4 160-1m-160-4 160-1"
          strokeWidth=".6"
          opacity=".4"
        />
        <path
          d="m43 41 164-2q7 0 7 7l2 140q0 7-7 7l-162 2q-12 0-12-11L33 53q0-10 10-12Z"
          fill="var(--scene-leaf)"
          strokeWidth="1.4"
        />
        <path
          d="m43 41 164-2q7 0 7 7l2 140q0 7-7 7l-162 2q-12 0-12-11L33 53q0-10 10-12Z"
          fill={`url(#${id}-cloth)`}
          stroke="none"
        />
        <path
          d="m48 44 2 147M55 45l146-1 2 141-146 1"
          stroke="var(--scene-leaf-light)"
          strokeWidth=".7"
        />
        <path
          d="M39 52 41 183"
          stroke="var(--scene-wood-dark)"
          strokeWidth="2"
          opacity=".3"
        />
        <path
          d="m72 87 108-1 1 52-108 1z"
          fill="var(--nook-paper)"
          strokeWidth="1"
        />
        <path d="m76 91 100-1 1 44-100 1z" strokeWidth=".5" opacity=".55" />
        <path d="M87 123q13-2 24-1m30-1q12-2 26-1" strokeWidth=".7" />
        <path
          d="M126 119c-10-6-8-13-3-12l3 3 3-3c5-2 7 7-3 12Z"
          fill="var(--scene-rose)"
          strokeWidth=".7"
        />
        <text
          x="126"
          y="103"
          textAnchor="middle"
          fontFamily="var(--font-navigation)"
          fontSize="7.5"
          fill="var(--nook-ink)"
          stroke="none"
          letterSpacing="2"
        >
          KUPO LIFE
        </text>
        <path
          d="m170 186 2 27 8-6 7 6-1-29"
          fill="var(--scene-rose)"
          strokeWidth=".8"
        />
        <path
          d="m177 189 2 14"
          stroke="var(--nook-paper)"
          strokeWidth=".6"
          opacity=".6"
        />
      </g>
      <g transform="rotate(11 247 124)">
        <rect
          x="181"
          y="39"
          width="135"
          height="166"
          rx="1"
          fill="var(--scene-shadow)"
          opacity=".16"
          transform="translate(2 4)"
        />
        <rect
          x="181"
          y="39"
          width="135"
          height="166"
          rx="1"
          fill="var(--nook-paper)"
          stroke="var(--nook-ink)"
          strokeOpacity=".16"
          strokeWidth=".7"
        />
        <rect
          x="190"
          y="48"
          width="117"
          height="117"
          fill="var(--nook-paper)"
        />
        <image
          href="/images/moogle-fishing.jpg"
          x="190"
          y="48"
          width="117"
          height="117"
          preserveAspectRatio="xMidYMid meet"
          style={{ mixBlendMode: "multiply" }}
        />
        <rect
          x="190"
          y="48"
          width="117"
          height="117"
          stroke="var(--nook-ink)"
          strokeOpacity=".12"
          strokeWidth=".6"
        />
        <text
          x="248"
          y="187"
          textAnchor="middle"
          fontFamily="var(--font-script)"
          fontSize="13"
          fill="var(--nook-ink)"
        >
          Kupo Life, Zalera
        </text>
        <path
          d="m220 31 46 1-1 18-46-2z"
          fill="var(--scene-rose)"
          opacity=".65"
        />
        <path
          d="m226 32-1 15m9-15-1 16m9-15-1 15m9-15-1 16m9-15-1 15"
          stroke="var(--nook-paper)"
          strokeWidth="3"
          opacity=".22"
        />
      </g>
      <g
        stroke="var(--scene-leaf)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M39 190Q24 134 40 90M34 159 15 125m18 10 23-28"
          strokeWidth="1.3"
        />
        <path
          d="M34 159c-12-1-18-7-17-14 9 0 15 6 17 14ZM33 145c3-11 11-17 17-15-2 9-8 14-17 15ZM34 126c-10-5-13-13-10-18 7 3 11 10 10 18ZM37 107c-4-9-2-17 4-21 4 8 1 15-4 21ZM46 119c-1-10 4-17 10-19 2 9-1 16-10 19ZM23 139c-10-3-14-11-12-16 8 1 12 8 12 16Z"
          fill="var(--scene-leaf-light)"
          strokeWidth=".6"
        />
        <path
          d="M28 171q14-10 12 1-3 7-12-1-13-5-14 2 3 7 14-2Zm0 0 13 17m-13-17-6 20"
          stroke="var(--scene-rose)"
          strokeWidth="1.5"
        />
      </g>
      <path
        d="m318 89 2 5 5 2-5 2-2 5-2-5-5-2 5-2ZM74 20l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z"
        stroke="var(--scene-gold)"
        strokeWidth=".9"
      />
    </svg>
  );
}

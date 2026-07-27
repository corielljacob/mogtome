import { useId } from "react";

/** A hand-stitched linen reminder, hung from a twig and a loop of twine. */
export function NookWallHanging() {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-hanging-${name})`;
  const cloth =
    "M20 48Q39 51 58 49Q80 48 96 51L94 184Q79 193 58 205Q40 195 21 185Z";

  return (
    <svg
      className="nook-wall-hanging"
      viewBox="0 0 120 230"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={`${id}-hanging-linen`} x1="0" y1="0" x2="1" y2=".1">
          <stop stopColor="var(--scene-wood-light)" />
          <stop offset=".11" stopColor="var(--scene-paper)" />
          <stop offset=".24" stopColor="var(--scene-paper)" />
          <stop offset=".34" stopColor="var(--scene-pot)" />
          <stop offset=".46" stopColor="var(--scene-paper)" />
          <stop offset=".77" stopColor="var(--scene-paper)" />
          <stop offset="1" stopColor="var(--scene-wood-light)" />
        </linearGradient>
        <linearGradient id={`${id}-hanging-rod`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="var(--scene-wood-light)" />
          <stop offset=".45" stopColor="var(--scene-wood)" />
          <stop offset="1" stopColor="var(--scene-wood-dark)" />
        </linearGradient>
        <pattern
          id={`${id}-hanging-weave`}
          width="3"
          height="3"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M.4 0V3M0 1.2H3"
            stroke="var(--scene-wood-dark)"
            strokeWidth=".3"
            opacity=".17"
          />
          <path
            d="M1 0V3M0 1.8H3"
            stroke="var(--scene-paper)"
            strokeWidth=".4"
            opacity=".6"
          />
        </pattern>
        <clipPath id={`${id}-hanging-cloth`}>
          <path d={cloth} />
        </clipPath>
        <filter
          id={`${id}-hanging-shadow`}
          x="-30%"
          y="-15%"
          width="160%"
          height="135%"
        >
          <feGaussianBlur stdDeviation="2.3" />
        </filter>
      </defs>

      <path
        d={cloth}
        transform="translate(3 4)"
        fill="var(--scene-shadow)"
        opacity=".3"
        filter={paint("shadow")}
      />

      {/* The slack twine passes behind a small, worn brass nail. */}
      <path
        d="M16 49Q41 35 57 14Q61 9 64 17Q77 37 103 51"
        stroke="var(--scene-shadow)"
        strokeWidth="2.5"
        opacity=".35"
        transform="translate(1 1)"
      />
      <path
        d="M16 49Q41 35 57 14Q61 9 64 17Q77 37 103 51"
        stroke="var(--scene-wood)"
        strokeWidth="1.7"
      />
      <path
        d="M18 47Q41 33 57 14M65 20Q80 38 101 49"
        stroke="var(--scene-wood-light)"
        strokeDasharray="1 3"
        strokeWidth=".7"
      />
      <ellipse
        cx="60"
        cy="12"
        rx="3.3"
        ry="4.2"
        fill="var(--scene-wood-dark)"
        stroke="var(--scene-wood)"
        strokeWidth="1.1"
      />
      <path
        d="M58.2 11Q58 8.5 60.5 8.9"
        stroke="var(--scene-wood-light)"
        strokeWidth=".8"
      />

      <path
        d="M12 47Q55 46 105 49L106 53Q61 52 12 52Z"
        fill={paint("rod")}
        stroke="var(--scene-wood-dark)"
        strokeWidth=".8"
      />
      <ellipse cx="12" cy="49.5" rx="3.4" ry="2.8" fill={paint("rod")} />
      <ellipse cx="105.5" cy="51" rx="3.1" ry="2.7" fill={paint("rod")} />
      <path
        d="M13 48.5H101"
        stroke="var(--scene-wood-light)"
        strokeWidth=".6"
      />

      <path d={cloth} fill={paint("linen")} />
      <path d={cloth} fill="var(--scene-paper)" opacity=".54" />
      <g clipPath={paint("cloth")}>
        <path d={cloth} fill={paint("weave")} />
        <path
          d="M20 52Q54 58 96 54V61Q57 57 20 60ZM20 178Q38 189 58 200Q77 189 95 178V187L58 211 20 188Z"
          fill="var(--scene-wood)"
          opacity=".14"
        />
        <path
          d="M26 60Q23 122 27 182L58 199 89 181Q93 126 89 62"
          stroke="var(--scene-wood)"
          strokeWidth=".8"
          opacity=".5"
        />
        <path
          d="M29 62Q27 122 30 180L58 196 86 179Q89 125 86 64"
          stroke="var(--scene-wood-dark)"
          strokeWidth=".65"
          strokeDasharray="1.2 2.5"
          opacity=".55"
        />
        <path
          d="M35 59Q29 94 33 117M76 60Q80 82 77 101M89 125Q86 157 88 174"
          stroke="var(--scene-paper)"
          strokeWidth="1.1"
          opacity=".7"
        />
      </g>
      <path
        d={cloth}
        stroke="var(--scene-wood-dark)"
        strokeWidth=".7"
        opacity=".4"
      />

      {/* Folded tabs wrap over the rod and give the fabric a little weight. */}
      {[23, 85].map((x) => (
        <g key={x}>
          <path
            d={`M${x} 47q3-2 6 .5l.5 14q-3 2-6 0Z`}
            fill="var(--scene-paper)"
            stroke="var(--scene-wood)"
            strokeWidth=".55"
          />
          <path
            d={`M${x + 2} 49v10`}
            stroke="var(--scene-wood-light)"
            strokeWidth=".6"
          />
        </g>
      ))}

      <g
        fill="var(--scene-ink)"
        fontFamily="var(--font-script)"
        textAnchor="middle"
        fontSize="18"
        opacity=".87"
        transform="rotate(-2 58 126)"
      >
        <text x="58" y="101" fontSize="24">
          Kupo
        </text>
        <text x="57" y="127" fontSize="24">
          Life
        </text>
        <text x="58" y="165" fontSize="16">
          Zalera
        </text>
      </g>

      <path
        d="M23 186l1 4m5-.7.2 3.2m4 .2.3 2.9m5-.3.5 3m5 .1v3m5-.4.6 3.2m5 .1.4 3m5-1.5.3 3m5-6.2.2 3.2m5-6.3.3 3m5-6.4.2 3m5-6.5.2 3m5-6.1.2 3"
        stroke="var(--scene-wood-light)"
        strokeWidth=".7"
        opacity=".85"
      />

      {/* A small bundle of dried stems, tucked into the right fabric loop. */}
      <g stroke="var(--scene-leaf)" strokeWidth="1">
        <path d="M95 79Q90 58 97 29M97 75Q99 47 110 29M94 65Q86 42 86 23" />
        <path
          d="M96 51Q84 49 85 40Q95 42 96 51ZM97 43Q98 32 105 34Q105 41 97 43ZM94 61Q84 62 83 54Q91 53 94 61ZM102 46Q103 36 110 36Q111 43 102 46ZM88 39Q79 39 80 31Q87 31 88 39Z"
          fill="var(--scene-leaf)"
          strokeWidth=".55"
        />
        <path
          d="M87 43 94 49M100 40l3-3M86 57l6 3M105 41l3-3"
          stroke="var(--scene-leaf-light)"
          strokeWidth=".55"
        />
        {[
          [86, 22, -25],
          [96, 28, 18],
          [110, 28, 30],
        ].map(([x, y, angle]) => (
          <g key={x} transform={`translate(${x} ${y}) rotate(${angle})`}>
            <path
              d="M0 5Q-7 1-5-3Q-3-5 0-1Q-1-8 3-7Q7-6 3-1Q9-3 9 1Q7 5 0 5Z"
              fill="var(--scene-dried-flower)"
              stroke="var(--scene-wood)"
              strokeWidth=".5"
            />
            <path
              d="M0 3 2-2M0 3-3-1M1 3 6 1"
              stroke="var(--scene-paper)"
              opacity=".45"
              strokeWidth=".6"
            />
          </g>
        ))}
      </g>
      <path
        d="M90 61 100 59M90 63l10-2M95 62Q82 52 82 61Q84 67 95 62Q109 53 106 62Q103 67 95 62L101 82M95 62Q90 75 91 81"
        stroke="var(--scene-rose)"
        strokeWidth="1.5"
      />
      <path
        d="M91 60 98 58M95 65l4 12"
        stroke="var(--scene-paper)"
        strokeWidth=".45"
        opacity=".55"
      />
    </svg>
  );
}

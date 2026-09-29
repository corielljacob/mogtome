import { useId } from "react";
import { NookThread } from "./NookThread";

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
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M.5 0V4M0 1.3H4"
            stroke="var(--scene-wood-dark)"
            strokeWidth=".5"
            opacity=".14"
          />
          <path
            d="M1.1 0V4M0 2H4"
            stroke="var(--scene-paper)"
            strokeWidth=".75"
            opacity=".75"
          />
        </pattern>
        <g
          id={`${id}-hanging-words`}
          fontFamily="var(--font-script)"
          textAnchor="middle"
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
      <NookThread
        d="M16 49Q41 35 57 14Q61 9 64 17Q77 37 103 51"
        color="var(--scene-wood)"
        highlight="var(--scene-wood-light)"
        width={2.35}
      />
      <path
        d="M18 47Q41 33 57 14M65 20Q80 38 101 49"
        stroke="var(--scene-wood-light)"
        strokeDasharray="1.2 2.5"
        strokeWidth="1.3"
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
      <NookThread
        d="M13 49Q54 48 104 51M14 51Q57 50.3 104 52.5"
        color="var(--scene-wood)"
        highlight="var(--scene-wood-light)"
        width={1.3}
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
        <NookThread
          d="M26 60Q23 122 27 182L58 199 89 181Q93 126 89 62"
          color="var(--scene-wood-light)"
          highlight="var(--scene-paper)"
          width={1.5}
        />
        <NookThread
          d="M29 62Q27 122 30 180L58 196 86 179Q89 125 86 64"
          color="var(--scene-rose)"
          highlight="var(--scene-paper)"
          width={1.5}
          dasharray="2.4 3.2"
          opacity={0.75}
        />
        {/* Each hem stitch catches the edge of this little linen pennant. */}
        {Array.from({ length: 20 }, (_, i) => {
          const y = 65 + i * 6;
          return (
            <NookThread
              key={y}
              d={`M21.5 ${y}q2.3 1.8 5.2 .7M89.3 ${y}q3 1.2 5.2-.7`}
              color="var(--scene-wood-light)"
              highlight="var(--scene-paper)"
              width={1.55}
            />
          );
        })}
        {Array.from({ length: 6 }, (_, i) => {
          const x = 27 + i * 5.1;
          const y = 188 + i * 2.9;
          return (
            <NookThread
              key={x}
              d={`M${x} ${y}l1.3-4.1M${116 - x} ${y}l-1.3-4.1`}
              color="var(--scene-wood-light)"
              highlight="var(--scene-paper)"
              width={1.6}
            />
          );
        })}
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

      <g transform="rotate(-2 58 126)">
        <use
          href={`#${id}-hanging-words`}
          fill="var(--scene-shadow)"
          stroke="var(--scene-shadow)"
          strokeWidth=".8"
          opacity=".22"
          transform="translate(.55 .9)"
        />
        <use
          href={`#${id}-hanging-words`}
          fill="var(--scene-ink)"
          stroke="var(--scene-ink)"
          strokeWidth=".5"
          opacity=".88"
        />
        <use
          href={`#${id}-hanging-words`}
          stroke="var(--scene-paper)"
          strokeWidth=".55"
          strokeDasharray="1 2"
          opacity=".5"
          transform="translate(-.2 -.2)"
        />
      </g>

      <path
        d="M23 186l1 4m5-.7.2 3.2m4 .2.3 2.9m5-.3.5 3m5 .1v3m5-.4.6 3.2m5 .1.4 3m5-1.5.3 3m5-6.2.2 3.2m5-6.3.3 3m5-6.4.2 3m5-6.5.2 3m5-6.1.2 3"
        stroke="var(--scene-wood-light)"
        strokeWidth="1.2"
        opacity=".85"
      />

      {/* A small bundle of dried stems, tucked into the right fabric loop. */}
      <g stroke="var(--scene-leaf)" strokeWidth="1">
        <NookThread
          d="M95 79Q90 58 97 29M97 75Q99 47 110 29M94 65Q86 42 86 23"
          color="var(--scene-leaf)"
          highlight="var(--scene-leaf-light)"
          width={1.6}
        />
        <path
          d="M96 51Q84 49 85 40Q95 42 96 51ZM97 43Q98 32 105 34Q105 41 97 43ZM94 61Q84 62 83 54Q91 53 94 61ZM102 46Q103 36 110 36Q111 43 102 46ZM88 39Q79 39 80 31Q87 31 88 39Z"
          fill="var(--scene-leaf)"
          strokeWidth=".55"
        />
        <NookThread
          d="M87 43 88 46M90 44 91 48M93 46 94 49M86 46 90 45M89 49 93 47M99 39 101 40M100 36 103 37M99 42 100 39M102 40 102 36M86 56 87 59M89 56 90 60M86 60 90 58M105 39 106 41M108 37 108 40M104 43 106 39M81 33 83 36M84 34 86 37M82 37 85 35"
          color="var(--scene-leaf-light)"
          highlight="var(--scene-paper)"
          width={1.2}
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
            <NookThread
              d="M0 3 2-4M2 3 4-4M0 2-4-1M-1 4-4 1M2 4 6 0M3 4 7 2"
              color="var(--scene-dried-flower)"
              highlight="var(--scene-paper)"
              width={1.6}
            />
            <NookThread
              d="M0 3q-1.5-2 .5-2.5q2.5 0 1.5 2q-.6 1.2-1.3 0"
              color="var(--scene-gold)"
              highlight="var(--scene-paper)"
              width={1.5}
            />
          </g>
        ))}
      </g>
      <NookThread
        d="M90 61 100 59M90 63l10-2M95 62Q82 52 82 61Q84 67 95 62Q109 53 106 62Q103 67 95 62L101 82M95 62Q90 75 91 81"
        color="var(--scene-rose)"
        highlight="var(--scene-paper)"
        width={2}
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

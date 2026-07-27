import { useId } from "react";
import { NookLantern } from "./NookLantern";

/** A small pool of lamplight, well-loved books, and a stem gathered on a walk. */
export function NookReadingCorner({ isDark }: { isDark: boolean }) {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-reading-${name})`;

  return (
    <svg
      className="nook-reading-corner"
      viewBox="0 0 220 235"
      fill="none"
      stroke="var(--scene-ink)"
      strokeWidth=".8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-reading-pages`} x2=".1" y2="1">
          <stop stopColor="var(--scene-wood-light)" />
          <stop offset=".24" stopColor="var(--scene-paper)" />
          <stop offset=".7" stopColor="var(--scene-paper)" />
          <stop offset="1" stopColor="var(--scene-wood-light)" />
        </linearGradient>
        <linearGradient id={`${id}-reading-blue`} x2="0" y2="1">
          <stop stopColor="var(--scene-book-blue)" />
          <stop
            offset=".4"
            stopColor="color-mix(in srgb, var(--scene-book-blue) 82%, var(--scene-paper))"
          />
          <stop offset="1" stopColor="var(--scene-book-blue)" />
        </linearGradient>
        <linearGradient id={`${id}-reading-rose`} x2="0" y2="1">
          <stop stopColor="var(--scene-book-rose)" />
          <stop
            offset=".3"
            stopColor="color-mix(in srgb, var(--scene-book-rose) 76%, var(--scene-paper))"
          />
          <stop offset="1" stopColor="var(--scene-book-rose)" />
        </linearGradient>
        <linearGradient id={`${id}-reading-bottle`} x2="1" y2=".2">
          <stop stopColor="var(--scene-book-blue)" />
          <stop offset=".36" stopColor="var(--scene-pot)" />
          <stop offset=".55" stopColor="var(--scene-book-blue)" />
          <stop offset="1" stopColor="var(--scene-ink)" />
        </linearGradient>
        <radialGradient id={`${id}-reading-pool`}>
          <stop
            stopColor="var(--scene-glow)"
            stopOpacity={isDark ? ".23" : ".1"}
          />
          <stop offset="1" stopColor="var(--scene-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse
        cx="139"
        cy="176"
        rx="79"
        ry="47"
        fill={paint("pool")}
        stroke="none"
      />
      <ellipse
        cx="115"
        cy="223"
        rx="100"
        ry="7"
        fill="var(--scene-shadow)"
        opacity=".2"
        stroke="none"
      />

      {/* The tall stem disappears behind the books and curls around their edge. */}
      <g stroke="var(--scene-leaf)" strokeWidth="1.2">
        <path d="M182 218C217 192 198 165 205 139S205 84 194 65M205 132Q187 117 184 98M208 159Q217 142 215 119" />
        {[
          [199, 80, -39],
          [205, 98, 27],
          [205, 119, -35],
          [201, 141, 39],
          [206, 164, -33],
          [202, 188, 29],
          [191, 114, -43],
          [215, 136, 21],
        ].map(([x, y, angle], index) => (
          <g key={index} transform={`translate(${x} ${y}) rotate(${angle})`}>
            <path
              d="M0 0C-10-3-12-13-8-18C-2-15 3-8 0 0Z"
              fill={
                index % 3 === 0
                  ? "var(--scene-leaf-light)"
                  : "var(--scene-leaf)"
              }
              stroke="var(--scene-wood-dark)"
              strokeWidth=".55"
            />
            <path
              d="M-1-2-7-14M-4-8-8-9"
              stroke="var(--scene-leaf-light)"
              strokeWidth=".55"
              opacity=".7"
            />
          </g>
        ))}
        <path
          d="M194 66q-9-6-6-15q8 3 6 15Z"
          fill="var(--scene-leaf-light)"
          strokeWidth=".6"
        />
        <g
          fill="var(--scene-dried-flower)"
          stroke="var(--scene-wood-dark)"
          strokeWidth=".5"
        >
          <path d="M184 100q-7-2-6-7q4-1 6 2q-1-8 3-8q5 4 1 9q6-4 8 0q-2 6-9 6Z" />
          <path d="M194 64q-5-1-5-5q4-2 6 1q0-6 3-5q4 3 1 7q5-2 6 1q-2 4-8 3Z" />
          <circle cx="186" cy="98" r="1.3" fill="var(--scene-gold)" />
          <circle cx="197" cy="63" r="1.1" fill="var(--scene-gold)" />
        </g>
      </g>

      {/* A rounded leather spine, inset gilt panel, and worn raised bands. */}
      <path
        d="M22 198 192 192 206 198V218L193 224 22 223Q14 221 14 211Q14 201 22 198Z"
        fill={paint("blue")}
      />
      <path d="m192 197 11 3v15l-11 5Z" fill={paint("pages")} />
      <path
        d="m195 201 6 1m-6 3 6 1m-6 3 6 1m-6 3 6 1"
        stroke="var(--scene-wood)"
        strokeWidth=".5"
        opacity=".7"
      />
      <path
        d="M24 199 192 194l12 4M24 222 192 223l12-5"
        stroke="var(--scene-book-blue)"
        strokeWidth="2.5"
      />
      <path
        d="M29 203 184 200v18l-155-1Z"
        stroke="var(--scene-gold)"
        opacity=".65"
      />
      <path
        d="M38 201v18m5-18v18m123-21v22m5-22v22"
        stroke="var(--scene-gold)"
        strokeWidth="1.2"
        opacity=".7"
      />
      <path
        d="M48 207q8-6 14 0m-14 5q8 6 14 0m84-6q-8-6-14 0m14 6q-8 6-14 0M72 210h18m22-1h12"
        stroke="var(--scene-gold)"
        strokeWidth=".65"
        opacity=".8"
      />
      <path
        d="M102 204q-7 2-5 8q2 4 6 2q-10 1-8-6q1-5 7-4Z"
        fill="var(--scene-gold)"
        stroke="none"
      />
      <path
        d="m110 204 .7 2.2 2.3.5-2.3.8-.7 2.2-.6-2.2-2.3-.8 2.3-.5Z"
        fill="var(--scene-gold)"
        stroke="none"
      />
      <path
        d="M18 205q-2 8 1 12M49 201l15-.5m98 19h16"
        stroke="var(--scene-paper)"
        opacity=".22"
        strokeWidth=".65"
      />

      {/* The exposed pages have irregular edges, small shadows, and a ribbon. */}
      <path
        d="m33 185 156-7 22 7v14l-168 4q-12-1-12-10Z"
        fill="var(--scene-leaf)"
      />
      <path d="m42 188 166-4v12l-166 5q-7-5 0-13Z" fill={paint("pages")} />
      <path
        d="m48 191 153-4M46 194l160-4M49 197l151-4"
        stroke="var(--scene-wood)"
        strokeWidth=".55"
        opacity=".55"
      />
      <path
        d="m34 184 154-8 23 8-168 6q-7 0-9-6Z"
        fill="var(--scene-leaf-light)"
      />
      <path
        d="m34 186q-6 11 7 16l170-5"
        stroke="var(--scene-leaf)"
        strokeWidth="3"
      />
      <path
        d="m42 184 145-6 14 4-154 5Z"
        stroke="var(--scene-gold)"
        strokeWidth=".55"
        opacity=".65"
      />
      <path
        d="m88 196 1 15 4-3 4 3-2-15Z"
        fill="var(--scene-rose)"
        stroke="var(--scene-book-rose)"
        strokeWidth=".55"
      />
      <path
        d="m91 198 1 9"
        stroke="var(--scene-paper)"
        strokeWidth=".55"
        opacity=".4"
      />

      {/* The upper volume catches the warm light from the lantern above it. */}
      <path
        d="m47 167 132-5 18 8v13l-137 6q-15-1-15-12Z"
        fill={paint("rose")}
      />
      <path
        d="m48 167 130-5 18 7-138 7q-7-1-10-9Z"
        fill="var(--scene-book-rose)"
      />
      <path
        d="m54 167 122-4 11 5-125 6Z"
        stroke="var(--scene-gold)"
        strokeWidth=".55"
        opacity=".7"
      />
      <path
        d="m52 178 132-5v10l-129 4q-6-3-3-9Z"
        stroke="var(--scene-gold)"
        strokeWidth=".6"
        opacity=".65"
      />
      <path
        d="m66 175 .4 12m5-12 .5 12m97-18 .5 15m5-15 .5 14"
        stroke="var(--scene-gold)"
        strokeWidth="1.1"
        opacity=".72"
      />
      <path
        d="m87 179 22-1m18-1 24-1m-51 6 39-2"
        stroke="var(--scene-gold)"
        strokeWidth=".65"
        opacity=".6"
      />
      <path
        d="m116 175 2 3 3 1-3 2-1 3-2-3-3-1 3-2Z"
        fill="var(--scene-gold)"
        stroke="none"
        opacity=".8"
      />
      <path
        d="m47 169q-4 10 3 16m10-10 123-6"
        stroke="var(--scene-paper)"
        strokeWidth=".7"
        opacity=".2"
      />
      <path
        d="m58 188 133-5"
        stroke="var(--scene-shadow)"
        strokeWidth="1.4"
        opacity=".3"
      />

      {/* A stoppered ink bottle makes the books feel used and kept close. */}
      <ellipse
        cx="71"
        cy="165"
        rx="14"
        ry="2.5"
        fill="var(--scene-shadow)"
        opacity=".25"
        stroke="none"
      />
      <path
        d="M65 140v6q-8 3-8 8v9q13 7 27-1v-9q0-5-9-8v-5Z"
        fill={paint("bottle")}
      />
      <path d="M65 139q5-2 10 0v6q-5 2-10 0Z" fill="var(--scene-wood)" />
      <ellipse
        cx="70"
        cy="139"
        rx="5"
        ry="1.5"
        fill="var(--scene-wood-light)"
      />
      <path
        d="M67 141v3m5-3v3M60 152q-1 4 0 8"
        stroke="var(--scene-paper)"
        strokeWidth=".7"
        opacity=".5"
      />
      <path
        d="M63 152q7 2 14 0v9q-7 3-14 0Z"
        fill="var(--scene-paper)"
        stroke="var(--scene-wood-light)"
        strokeWidth=".5"
      />
      <path
        d="m67 155 6-.2m-5 2h4m-5 2h6"
        stroke="var(--scene-wood)"
        strokeWidth=".55"
      />

      <g transform="translate(-327 -384) scale(1.25)">
        <NookLantern isDark={isDark} />
      </g>

      {/* One loose leaf rests against the lowest book. */}
      <path
        d="M192 219q-7 9-23 8m13-2q-10-11-19-6q6 9 19 6m5-4q6-12 16-10q-1 10-16 10"
        stroke="var(--scene-leaf)"
        fill="var(--scene-leaf)"
        strokeWidth=".7"
      />
      <path
        d="m167 221 14 4m10-6 8-5"
        stroke="var(--scene-leaf-light)"
        strokeWidth=".55"
        opacity=".7"
      />
    </svg>
  );
}

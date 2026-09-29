import { useId } from "react";
import { NookLantern } from "./NookLantern";
import { NookThread } from "./NookThread";

const blueBook =
  "M22 198 192 192 206 198V218L193 224 22 223Q14 221 14 211Q14 201 22 198Z";
const greenPages = "m42 188 166-4v12l-166 5q-7-5 0-13Z";
const greenCover = "m34 184 154-8 23 8-168 6q-7 0-9-6Z";
const roseBook = "m47 167 132-5 18 8v13l-137 6q-15-1-15-12Z";
const roseCover = "m48 167 130-5 18 7-138 7q-7-1-10-9Z";
const bottle = "M65 140v6q-8 3-8 8v9q13 7 27-1v-9q0-5-9-8v-5Z";
const leaf = "M0 0C-10-3-12-13-8-18C-2-15 3-8 0 0Z";
const gatheredStems =
  "M182 218C217 192 198 165 205 139S205 84 194 65M205 132Q187 117 184 98M208 159Q217 142 215 119";
const blueThreads = Array.from(
  { length: 61 },
  (_, i) => `M${13 + i * 3.2} 191q-2.5 16 .5 35`,
).join(" ");
const roseThreads = Array.from(
  { length: 49 },
  (_, i) => `M${43 + i * 3.2} 161q-2 12 1.5 30`,
).join(" ");
const coverThreads = Array.from(
  { length: 55 },
  (_, i) => `M${28 + i * 3.4} 159l9 33`,
).join(" ");
const pageThreads = Array.from(
  { length: 7 },
  (_, i) =>
    `M37 ${184.3 + i * 2.6}Q121 ${183.1 + i * 2.6} 210 ${180 + i * 2.6}`,
).join(" ");

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
        {[
          ["blue", blueBook],
          ["green-pages", greenPages],
          ["green-cover", greenCover],
          ["rose", roseBook],
          ["rose-cover", roseCover],
          ["bottle", bottle],
          ["leaf", leaf],
        ].map(([name, d]) => (
          <clipPath key={name} id={`${id}-reading-${name}-clip`}>
            <path d={d} />
          </clipPath>
        ))}
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
        <NookThread
          d={gatheredStems}
          color="var(--scene-leaf)"
          highlight="var(--scene-leaf-light)"
          width={2.6}
          relief={1.8}
        />
        <NookThread
          d={gatheredStems}
          color="var(--scene-leaf-light)"
          width={1.8}
          dasharray=".9 3.5"
        />
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
              d={leaf}
              fill={
                index % 3 === 0
                  ? "var(--scene-leaf-light)"
                  : "var(--scene-leaf)"
              }
              stroke="var(--scene-wood-dark)"
              strokeWidth=".55"
            />
            <g clipPath={paint("leaf-clip")}>
              <NookThread
                d="M-8-16-3-13M-9-13-2-9M-8-9-1-5M-6-5 0-2M-5-15-7-11M-2-11-5-7M0-7-3-3"
                color="var(--scene-leaf-light)"
                shadow="var(--scene-leaf)"
                width={2.35}
                relief={1.8}
              />
            </g>
            <NookThread
              d={leaf}
              color="var(--scene-leaf)"
              highlight="var(--scene-leaf-light)"
              width={1.65}
            />
          </g>
        ))}
        <path
          d="M194 66q-9-6-6-15q8 3 6 15Z"
          fill="var(--scene-leaf-light)"
          strokeWidth=".6"
        />
        <NookThread
          d="M188 54 192 57M188 58 193 61M190 61 194 64M191 54 190 58M193 58 192 62"
          color="var(--scene-leaf-light)"
          shadow="var(--scene-leaf)"
          width={2.2}
          relief={1.8}
        />
        <g
          fill="var(--scene-dried-flower)"
          stroke="var(--scene-wood-dark)"
          strokeWidth=".5"
        >
          <path d="M184 100q-7-2-6-7q4-1 6 2q-1-8 3-8q5 4 1 9q6-4 8 0q-2 6-9 6Z" />
          <path d="M194 64q-5-1-5-5q4-2 6 1q0-6 3-5q4 3 1 7q5-2 6 1q-2 4-8 3Z" />
          <NookThread
            d="M184 98Q176 95 180 93Q185 94 184 98M186 98Q183 87 187 89Q191 94 186 98M188 99Q194 92 195 97Q194 101 188 99M194 63Q188 58 191 59Q194 59 194 63M197 63Q194 54 198 56Q201 59 197 63M199 64Q203 60 204 63Q202 66 199 64"
            color="var(--scene-dried-flower)"
            width={2.25}
            relief={1.8}
          />
          <circle cx="186" cy="98" r="1.3" fill="var(--scene-gold)" />
          <circle cx="197" cy="63" r="1.1" fill="var(--scene-gold)" />
          <NookThread
            d="M185 98q-1-2 1-2q2.5 1 .5 3M196 63q-1-2 1-2q2 1 .5 2.5"
            color="var(--scene-gold)"
            width={1.9}
          />
        </g>
      </g>

      {/* Dense satin crosses the padded blue spine; gold cords couch its decoration. */}
      <path d={blueBook} fill={paint("blue")} />
      <g clipPath={paint("blue-clip")}>
        <NookThread
          d={blueThreads}
          color="var(--scene-book-blue)"
          highlight="color-mix(in srgb, var(--scene-book-blue) 52%, var(--scene-paper))"
          width={2.5}
          relief={1.8}
        />
      </g>
      <NookThread
        d={blueBook}
        color="var(--scene-book-blue)"
        width={2.8}
        relief={1.8}
      />
      <path d="m192 197 11 3v15l-11 5Z" fill={paint("pages")} />
      <NookThread
        d="m194 199 8 2m-8 1 8 2m-8 1 8 2m-8 1 8 2m-8 1 8 2m-8 1 8-1"
        color="var(--scene-paper)"
        shadow="var(--scene-wood)"
        width={1.9}
        relief={1.8}
      />
      <NookThread
        d="M24 199 192 194l12 4M24 222 192 223l12-5"
        color="var(--scene-book-blue)"
        width={3}
        relief={1.8}
      />
      <NookThread
        d="M29 203 184 200v18l-155-1Z"
        color="var(--scene-gold)"
        width={1.5}
        dasharray="2.4 2.1"
      />
      <NookThread
        d="M38 201v18m5-18v18m123-21v22m5-22v22"
        color="var(--scene-gold)"
        width={2.15}
        relief={1.8}
      />
      <NookThread
        d="M48 207q8-6 14 0m-14 5q8 6 14 0m84-6q-8-6-14 0m14 6q-8 6-14 0M72 210h18m22-1h12"
        color="var(--scene-gold)"
        width={1.7}
        relief={1.6}
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
      <NookThread
        d="M102 204q-7 2-5 8q2 4 6 2M110 204v5m-2-2h4"
        color="var(--scene-gold)"
        width={1.9}
        relief={1.7}
      />
      <path
        d="M18 205q-2 8 1 12M49 201l15-.5m98 19h16"
        stroke="var(--scene-paper)"
        opacity=".22"
        strokeWidth=".65"
      />

      {/* Page yarn runs horizontally, underneath a separately sewn green cover. */}
      <path
        d="m33 185 156-7 22 7v14l-168 4q-12-1-12-10Z"
        fill="var(--scene-leaf)"
      />
      <path d={greenPages} fill={paint("pages")} />
      <g clipPath={paint("green-pages-clip")}>
        <NookThread
          d={pageThreads}
          color="var(--scene-paper)"
          shadow="var(--scene-wood)"
          width={2}
          relief={1.8}
          dasharray="12 .9 20 .9"
        />
      </g>
      <path d={greenCover} fill="var(--scene-leaf)" />
      <g clipPath={paint("green-cover-clip")}>
        <NookThread
          d={coverThreads}
          color="var(--scene-leaf-light)"
          shadow="var(--scene-leaf)"
          width={2.5}
          relief={1.8}
        />
      </g>
      <NookThread
        d="m34 186q-6 11 7 16l170-5"
        color="var(--scene-leaf)"
        highlight="var(--scene-leaf-light)"
        width={3.5}
        relief={1.8}
      />
      <NookThread
        d="m42 184 145-6 14 4-154 5Z"
        color="var(--scene-gold)"
        width={1.45}
        dasharray="2 2.6"
      />
      <NookThread
        d="m35 187q-6 11 7 15l167-5"
        color="var(--scene-leaf-light)"
        width={2.5}
        dasharray="1 3.1"
      />
      <path
        d="m88 196 1 15 4-3 4 3-2-15Z"
        fill="var(--scene-rose)"
        stroke="var(--scene-book-rose)"
        strokeWidth=".55"
      />
      <NookThread
        d="m90 197 1 12m2-12 1 11"
        color="var(--scene-rose)"
        width={2.1}
        relief={1.7}
      />
      <NookThread
        d="m90 198 1 10"
        color="var(--scene-paper)"
        width={0.95}
        dasharray="1.1 2"
      />

      {/* The upper volume catches the warm light from the lantern above it. */}
      <path d={roseBook} fill={paint("rose")} />
      <g clipPath={paint("rose-clip")}>
        <NookThread
          d={roseThreads}
          color="var(--scene-book-rose)"
          highlight="color-mix(in srgb, var(--scene-book-rose) 52%, var(--scene-paper))"
          width={2.45}
          relief={1.8}
        />
      </g>
      <path d={roseCover} fill="var(--scene-book-rose)" />
      <g clipPath={paint("rose-cover-clip")}>
        <NookThread
          d={coverThreads}
          color="var(--scene-book-rose)"
          width={2.4}
          relief={1.8}
        />
      </g>
      <NookThread
        d="M47 167Q42 180 51 185L60 189L195 183M49 168 178 163 195 169 59 175"
        color="var(--scene-book-rose)"
        width={2.8}
        relief={1.8}
      />
      <NookThread
        d="m54 167 122-4 11 5-125 6Z"
        color="var(--scene-gold)"
        width={1.5}
        dasharray="2 2.4"
      />
      <NookThread
        d="m52 178 132-5v10l-129 4q-6-3-3-9Z"
        color="var(--scene-gold)"
        width={1.35}
        dasharray="1.7 2"
      />
      <NookThread
        d="m66 175 .4 12m5-12 .5 12m97-18 .5 15m5-15 .5 14"
        color="var(--scene-gold)"
        width={2.1}
        relief={1.8}
      />
      <NookThread
        d="m87 179 22-1m18-1 24-1m-51 6 39-2"
        color="var(--scene-gold)"
        width={1.35}
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

      {/* Curved satin wraps the ink bottle; its linen label has a running seam. */}
      <ellipse
        cx="71"
        cy="165"
        rx="14"
        ry="2.5"
        fill="var(--scene-shadow)"
        opacity=".25"
        stroke="none"
      />
      <path d={bottle} fill={paint("bottle")} />
      <g clipPath={paint("bottle-clip")}>
        <NookThread
          d="M56 142q13 4 30 0M56 145q13 4 30 0M56 148q13 4 30 0M56 151q13 4 30 0M56 154q13 4 30 0M56 157q13 4 30 0M56 160q13 4 30 0M56 163q13 4 30 0"
          color="var(--scene-book-blue)"
          shadow="var(--scene-ink)"
          highlight="var(--scene-pot)"
          width={2.3}
          relief={1.8}
        />
      </g>
      <NookThread
        d={bottle}
        color="var(--scene-book-blue)"
        highlight="var(--scene-pot)"
        width={2}
        relief={1.8}
      />
      <path d="M65 139q5-2 10 0v6q-5 2-10 0Z" fill="var(--scene-wood)" />
      <ellipse
        cx="70"
        cy="139"
        rx="5"
        ry="1.5"
        fill="var(--scene-wood-light)"
      />
      <NookThread
        d="M66 139v5M69 138v7M72 138v7M74 139v5"
        color="var(--scene-wood-light)"
        shadow="var(--scene-wood-dark)"
        width={1.9}
        relief={1.8}
      />
      <path
        d="M63 152q7 2 14 0v9q-7 3-14 0Z"
        fill="var(--scene-paper)"
        stroke="var(--scene-wood-light)"
        strokeWidth=".5"
      />
      <NookThread
        d="M64 154q6 2 12 0M64 157q6 2 12 0M64 160q6 2 12 0"
        color="var(--scene-paper)"
        shadow="var(--scene-wood-light)"
        width={1.9}
      />
      <NookThread
        d="M63 152q7 2 14 0v9q-7 3-14 0Z"
        color="var(--scene-gold)"
        width={1.05}
        dasharray="1.3 1.5"
      />
      <NookThread
        d="m67 155 6-.2m-5 2h4m-5 2h6"
        color="var(--scene-wood)"
        width={1.05}
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
      <NookThread
        d="M192 219q-7 9-23 8m13-2q-10-11-19-6q6 9 19 6m5-4q6-12 16-10q-1 10-16 10"
        color="var(--scene-leaf)"
        highlight="var(--scene-leaf-light)"
        width={1.7}
      />
      <NookThread
        d="m166 219 1 4m3-5 1 6m3-4 1 4m3-2 1 3m-12-3 4-2m-1 4 5-2m14-4 1-4m2 3 2-4m1 3 2-4m-8 6 4 1m-1-4 5 1"
        color="var(--scene-leaf-light)"
        shadow="var(--scene-leaf)"
        width={2}
        relief={1.8}
      />
    </svg>
  );
}

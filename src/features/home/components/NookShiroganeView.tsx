import { useId } from "react";
import { NookNeighbourHouse } from "./NookNeighbourHouse";
import { NookNeighbourLandmarks } from "./NookNeighbourLandmarks";

interface NookShiroganeViewProps {
  isDark: boolean;
}

// The lane beside the FC house, composed from the member-supplied in-game view.
export function NookShiroganeView({ isDark }: NookShiroganeViewProps) {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-neighbourhood-${name})`;
  const stone =
    "color-mix(in srgb, var(--scene-plaster) 67%, var(--scene-rock))";
  const blossom =
    "color-mix(in srgb, var(--scene-paper) 79%, var(--scene-rose))";

  return (
    <g
      className="nook-shirogane-view"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient
          id={`${id}-neighbourhood-sea`}
          x1="0"
          y1="276"
          x2="0"
          y2="348"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="color-mix(in srgb, var(--scene-sea) 62%, var(--scene-horizon))" />
          <stop offset="1" stopColor="var(--scene-sea)" />
        </linearGradient>
        <linearGradient
          id={`${id}-neighbourhood-stone`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop stopColor="var(--scene-rock-light)" />
          <stop offset=".45" stopColor={stone} />
          <stop offset="1" stopColor="var(--scene-rock)" />
        </linearGradient>
        <linearGradient
          id={`${id}-neighbourhood-lane`}
          x1="269"
          y1="289"
          x2="184"
          y2="440"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="color-mix(in srgb, var(--scene-plaster) 80%, var(--scene-rock-light))" />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-plaster) 42%, var(--scene-rock))"
          />
        </linearGradient>
        <linearGradient
          id={`${id}-neighbourhood-beam`}
          x1="245"
          y1="198"
          x2="96"
          y2="198"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--scene-window-light)" stopOpacity=".32" />
          <stop
            offset=".35"
            stopColor="var(--scene-window-light)"
            stopOpacity=".1"
          />
          <stop
            offset="1"
            stopColor="var(--scene-window-light)"
            stopOpacity="0"
          />
        </linearGradient>
        <radialGradient id={`${id}-neighbourhood-lamp`}>
          <stop stopColor="var(--scene-window-light)" stopOpacity=".6" />
          <stop
            offset=".3"
            stopColor="var(--scene-window-light)"
            stopOpacity=".15"
          />
          <stop
            offset="1"
            stopColor="var(--scene-window-light)"
            stopOpacity="0"
          />
        </radialGradient>
        <g id={`${id}-neighbourhood-blossom`}>
          <path
            d="M-5 2C-9-2-5-7-1-5C2-10 8-6 7-2C13 0 10 6 6 6C3 11-2 8-3 5C-8 7-10 3-5 2Z"
            fill={blossom}
          />
          <path
            d="M-4-2q2-2 4 0m3 5q2 2 4 0m-9 2 2 1"
            fill="none"
            stroke="var(--scene-paper)"
            strokeWidth="1"
            opacity=".65"
          />
          <circle cx="2" cy="1" r=".8" fill="var(--scene-rose)" opacity=".45" />
        </g>
        <clipPath id={`${id}-neighbourhood-lane-clip`}>
          <path d="M339 285C305 292 289 311 253 328L70 396V438H156L280 358C309 340 320 317 342 306Z" />
        </clipPath>
      </defs>

      {/* Only a quiet sliver of the bay is visible between the buildings. */}
      <path
        d="M205 277q26-5 50-2q20-1 42 2l19-5 23 5v79H203Z"
        fill={paint("sea")}
      />
      <path
        d="M226 274q22-2 42 1m12 0h25m12 1h20"
        fill="none"
        stroke="var(--scene-surf)"
        strokeWidth=".75"
        opacity=".35"
      />
      <g fill="none" stroke="var(--scene-surf)" strokeWidth=".6">
        <path className="nook-shirogane-wave" d="M237 285h12m7 0h20m13 1h18" />
        <path className="nook-shirogane-wave" d="M219 296h19m7 1h15m18 0h23" />
        <path className="nook-shirogane-wave" d="M232 310h13m14 0h20m8 0h9" />
      </g>
      <path
        d="M292 280 307 272 319 270 338 251 346 288Z"
        fill="var(--scene-distant)"
        opacity=".55"
      />

      {/* The familiar green-roofed beacon above the cherry trees. */}
      <path
        d="M220 288 224 270 233 256 253 252 263 266 268 292Z"
        fill="var(--scene-rock)"
      />
      <path
        d="M224 274 234 258 250 257 242 275 254 288 233 292Z"
        fill="var(--scene-rock-light)"
        opacity=".65"
      />
      <path
        d="m228 277 6-4 8 2m-14 8 8-1 4 5m10-26 4 8"
        fill="none"
        stroke="var(--scene-ink)"
        strokeWidth=".7"
        opacity=".24"
      />
      <g className="nook-shirogane-night" opacity={isDark ? 1 : 0}>
        <g className="nook-lighthouse-beam">
          <path d="M245 195 110 166 110 227 245 201Z" fill={paint("beam")} />
        </g>
        <ellipse cx="245" cy="198" rx="26" ry="23" fill={paint("lamp")} />
      </g>
      <g stroke="var(--scene-roof)" strokeWidth=".7">
        <path
          d="M237 213H252C251 233 253 246 258 261Q245 265 231 262C236 249 238 230 237 213Z"
          fill={paint("stone")}
        />
        <path
          d="M236 236h16m-18 11h20m-15-11v5m9 6v6m-9-26v4"
          fill="none"
          stroke="var(--scene-rock)"
          opacity=".6"
        />
        <path
          d="M242 249v-9q2-3 4 0v9Z"
          fill="var(--scene-roof)"
          strokeWidth=".4"
        />
        <path d="M231 258q14 3 27 0l1 5q-15 4-29 0Z" fill={stone} />
        <path d="M236 188H254V207H236Z" fill="var(--scene-timber)" />
        <path
          d="M239 190H251V205H239Z"
          fill="color-mix(in srgb, var(--scene-window-light) 45%, var(--scene-plaster))"
          stroke="none"
        />
        <path
          className="nook-shirogane-night"
          d="M239 190H251V205H239Z"
          fill="var(--scene-window-light)"
          opacity={isDark ? 1 : 0}
          stroke="none"
        />
        <path
          d="M242 191v13m5-13v13m-8-9h12m-12 5h12"
          fill="none"
          strokeWidth=".8"
        />
        <path
          d="M231 207q8 1 11-2h7q4 3 10 1l-2 6q-12 3-24 0Z"
          fill="var(--scene-roof)"
        />
        <path
          d="M231 186q8-1 11-8h7q4 8 11 8l-2 4q-13 3-25 0Z"
          fill="var(--scene-roof)"
        />
        <path
          d="M233 188q12 3 25 0m-23 22q10 2 21 0m-14-29-3 5m10-5 4 5"
          fill="none"
          stroke="var(--scene-gold)"
          strokeWidth=".65"
          opacity=".8"
        />
        <path
          d="M245 178v-11m-2 5h4"
          stroke="var(--scene-gold)"
          strokeWidth="1"
          fill="none"
        />
        <path d="m242 178 3-3 3 3Z" fill="var(--scene-gold)" stroke="none" />
      </g>

      {/* A paved lane descends diagonally past mossy garden banks. */}
      <path
        d="M332 284 305 295 286 313 244 334 69 393V441H345V279Z"
        fill="var(--scene-pine)"
      />
      <path
        d="M280 360q24-28 59-33v112H153Z"
        fill="color-mix(in srgb, var(--scene-pine) 62%, var(--scene-leaf-light))"
      />
      <path
        d="M340 287C306 294 291 312 255 330L69 399V438H155L280 360C310 342 321 320 342 308Z"
        fill="var(--scene-rock)"
      />
      <path
        d="M339 285C305 292 289 311 253 328L70 396V438H156L280 358C309 340 320 317 342 306Z"
        fill={paint("lane")}
      />
      <g
        clipPath={paint("lane-clip")}
        fill="none"
        stroke="var(--scene-rock)"
        strokeWidth=".8"
        opacity=".6"
      >
        <path d="M52 420 266 341Q315 312 347 293M113 452 278 350Q313 328 345 300" />
        <path d="m282 305 31 11m-41-4 32 16m-44-9 32 21m-49-13 34 21m-54-14 34 24m-59-15 29 26m-59-16 26 33m-61-20 20 42m-64-23 24 47" />
      </g>
      <path
        d="M338 284C304 292 289 310 252 327L72 394M339 307Q316 319 281 359L158 438"
        fill="none"
        stroke="var(--scene-plaster)"
        strokeWidth="2.2"
        opacity=".7"
      />
      <path
        d="m280 360 7 3 7-5 9 1 8-9 15-5m-183 71 5 5m35-24 4 4m34-27 4 4"
        fill="none"
        stroke="var(--scene-leaf-light)"
        strokeWidth="1"
        opacity=".55"
      />

      {/* The house sits on a planted rock bank above the lower edge of the lane. */}
      <path
        d="M61 321Q92 313 124 328L181 326 209 319 249 328 247 334 68 399Z"
        fill="var(--scene-rock)"
      />
      <path
        d="M62 344 80 332 97 335 108 350 102 378 69 391ZM104 338 127 329 148 341 147 357 119 373 104 363ZM146 334 166 327 187 330 195 342 177 353 147 364ZM190 331 210 321 228 326 244 331 212 344 193 347Z"
        fill="var(--scene-rock-light)"
        stroke="var(--scene-rock)"
        strokeWidth="1.1"
      />
      <path
        d="m80 335 7 13 15 5m-14-5-13 21m52-35-6 12 9 14m34-30 8 9-3 12m39-26 6 8 12-2"
        fill="none"
        stroke="var(--scene-rock)"
        strokeWidth=".9"
        opacity=".7"
      />
      <path
        d="M62 335q9-14 22-8l10 9-14 5-11 5ZM113 331q12-9 23-1l9 8-17-1-10 6ZM150 332q14-13 26-1l-10 5-9-1ZM192 330q12-13 24-5l-4 6-12 3Z"
        fill="var(--scene-pine)"
      />
      <path
        d="m75 333 8-1m-14 20 5-4m51-12 6-2m26 3 7-3m40-3 5-3m-101 49 5-4m-13 7-6 2"
        stroke="var(--scene-leaf-light)"
        strokeWidth="1.6"
        fill="none"
        opacity=".55"
      />
      <NookNeighbourHouse isDark={isDark} />

      {/* Pale blossom trees frame the small gap toward the water. */}
      <g stroke="var(--scene-timber)" strokeLinecap="round" fill="none">
        <path
          d="M231 315q7-15 4-33l-8-16m8 19 12-18m-13 20-14-12"
          strokeWidth="3"
        />
        <path d="M239 292q5-7 6-15m-12 19-10-8" strokeWidth="1.3" />
      </g>
      <path
        d="M206 280q-7-10 3-17q1-11 13-10q7-9 17-3q13-3 17 9q10 3 8 14q-2 13-15 15q-14 9-26 2q-13 3-17-10Z"
        fill="color-mix(in srgb, var(--scene-rose) 36%, var(--scene-rock-light))"
      />
      {[
        [212, 269, 0.9],
        [221, 261, 1.1],
        [234, 257, 1],
        [247, 263, 1],
        [254, 273, 0.85],
        [238, 273, 1.15],
        [224, 276, 1.1],
        [213, 279, 0.7],
        [246, 283, 0.7],
        [230, 287, 0.65],
      ].map(([x, y, s]) => (
        <use
          key={`${x}-${y}`}
          href={`#${id}-neighbourhood-blossom`}
          transform={`translate(${x} ${y}) scale(${s})`}
        />
      ))}
      <path
        d="M217 310q6-8 14-6l13 5-5 12-20 4-10-6Z"
        fill="var(--scene-rock-light)"
      />
      <path
        d="m213 314 8 2 6-6m-6 6 3 7m10-15 4 7"
        stroke="var(--scene-rock)"
        strokeWidth=".8"
        fill="none"
      />
      <path d="M211 311q6-9 15-5l4 4-9 2-7 3Z" fill="var(--scene-pine)" />
      <g transform="translate(304 268) scale(.55)">
        <path
          d="M0 44Q9 18 1-5m4 27 17-23m-19 25-16-15"
          fill="none"
          stroke="var(--scene-timber)"
          strokeWidth="3"
        />
        <path
          d="M-27 5Q-38-9-20-19Q-9-31 5-24Q23-29 31-11Q42 0 26 15Q7 25-10 18Q-27 20-27 5Z"
          fill="var(--scene-rose)"
        />
        {[
          [-24, -4, 1],
          [-12, -14, 1],
          [3, -14, 1.1],
          [18, -6, 1.1],
          [24, 5, 1],
          [6, 7, 1.3],
          [-13, 6, 1],
        ].map(([x, y, s]) => (
          <use
            key={x}
            href={`#${id}-neighbourhood-blossom`}
            transform={`translate(${x} ${y}) scale(${s})`}
          />
        ))}
      </g>

      {/* A restrained willow curtain and pine boughs on the right garden edge. */}
      <path
        d="M343 149q-14 22-9 69l5 79"
        fill="none"
        stroke="var(--scene-timber)"
        strokeWidth="3"
      />
      <g fill="none" stroke="var(--scene-pine)" strokeWidth=".7">
        <path d="M338 167q-23 15-24 47m23-40q-13 15-11 58m15-33q-18 16-15 51m16-20q-10 17-7 39" />
        <path
          d="m324 185-7 8m10-12-6 12m0 0-6 10m7-5-5 12m13-19-5 11m5-5-5 11m5-2-4 12m7-4-6 10m8-2-5 11m1 3-5 11m11-8-6 13m6-2-4 10"
          strokeWidth="1.6"
          opacity=".75"
        />
      </g>
      <path
        d="M309 259q-2-14 10-22l17-8m-19 16 15 6m-16-1-10-2"
        fill="none"
        stroke="var(--scene-timber)"
        strokeWidth="1.6"
      />
      <g fill="var(--scene-pine)">
        <path d="M306 243q-8-7 1-9q3-9 10-3q8-2 11 6q-6 8-22 6ZM325 231q-7-8 3-12q7-7 15 1l2 11Z" />
        <path d="M321 254q-9-6-3-11q7-6 13-1q10-2 15 7q-10 9-25 5Z" />
      </g>
      <path
        d="m304 237 9-2m9 14 11-2m-3-22 9-2"
        fill="none"
        stroke="var(--scene-leaf-light)"
        strokeWidth=".8"
        opacity=".55"
      />
      <NookNeighbourLandmarks isDark={isDark} />

      <g fill="var(--scene-rose)" opacity=".75">
        <ellipse
          cx="242"
          cy="321"
          rx="1.8"
          ry=".7"
          transform="rotate(-24 242 321)"
        />
        <ellipse cx="228" cy="337" rx="1.5" ry=".65" />
        <ellipse cx="290" cy="316" rx="1.3" ry=".6" />
        <ellipse
          cx="297"
          cy="336"
          rx="1.8"
          ry=".7"
          transform="rotate(21 297 336)"
        />
      </g>
    </g>
  );
}

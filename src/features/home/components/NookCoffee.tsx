import { useId } from "react";

/** A small hand-glazed cup: a substantial rim, open handle, and warm coffee. */
export function NookCoffee() {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-coffee-${name})`;

  return (
    <g
      className="nook-coffee"
      strokeWidth=".9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient
          id={`${id}-coffee-glaze`}
          x1=".05"
          y1=".15"
          x2="1"
          y2=".65"
        >
          <stop stopColor="var(--scene-pot)" />
          <stop offset=".2" stopColor="var(--scene-paper)" />
          <stop offset=".53" stopColor="var(--scene-paper)" />
          <stop
            offset=".84"
            stopColor="color-mix(in srgb, var(--scene-paper) 62%, var(--scene-pot))"
          />
          <stop offset="1" stopColor="var(--scene-pot)" />
        </linearGradient>
        <linearGradient id={`${id}-coffee-brew`} x2=".15" y2="1">
          <stop stopColor="var(--scene-brass)" />
          <stop
            offset=".45"
            stopColor="color-mix(in srgb, var(--scene-brass) 76%, var(--scene-pot))"
          />
          <stop offset="1" stopColor="var(--scene-pot)" />
        </linearGradient>
        <linearGradient id={`${id}-coffee-steam`} x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="var(--scene-paper)" stopOpacity="0" />
          <stop offset=".55" stopColor="var(--scene-paper)" stopOpacity=".7" />
          <stop offset="1" stopColor="var(--scene-paper)" stopOpacity=".1" />
        </linearGradient>
      </defs>

      {/* A raised saucer lip, recessed well, and close contact shadow. */}
      <ellipse
        cx="272"
        cy="438"
        rx="31"
        ry="3"
        fill="var(--scene-shadow)"
        opacity=".2"
        stroke="none"
      />
      <path
        d="M240 433Q247 440 273 441Q295 440 303 434L301 431 242 430Z"
        fill="var(--scene-pot)"
      />
      <ellipse cx="271.5" cy="432.5" rx="31" ry="6" fill={paint("glaze")} />
      <ellipse
        cx="271"
        cy="432"
        rx="23"
        ry="3.8"
        fill="var(--scene-pot)"
        fillOpacity=".22"
        stroke="var(--scene-gold)"
        strokeWidth=".65"
        strokeOpacity=".6"
      />
      <path
        d="M244 434q23 8 53 1"
        fill="none"
        stroke="var(--scene-paper)"
        strokeWidth="1.3"
        opacity=".75"
      />
      <ellipse
        cx="270"
        cy="434"
        rx="12"
        ry="2.2"
        fill="var(--scene-shadow)"
        opacity=".16"
        stroke="none"
      />

      {/* Both ends extend beneath the bowl, joining the handle into its wall. */}
      <path
        d="M282 405C291 399 303 398 306 404C311 414 298 425 282 430L278 425C290 422 302 414 301 407C300 403 292 405 284 410Z"
        fill={paint("glaze")}
      />
      <path
        d="M291 403Q303 397 304 406Q305 413 297 419"
        fill="none"
        stroke="var(--scene-paper)"
        strokeWidth="1.6"
        opacity=".72"
      />
      <path
        d="M292 409q5-4 8-2"
        fill="none"
        stroke="var(--scene-pot)"
        strokeWidth="1.1"
        opacity=".8"
      />

      {/* Bare clay foot and a slightly uneven, softly tapered porcelain body. */}
      <path
        d="M260 429H280L279 434Q270 437 260 434Z"
        fill="var(--scene-pot)"
        strokeWidth=".7"
      />
      <path
        d="M249 400C247 410 251 425 257 430Q268 438 281 430C288 424 291 408 289 400Z"
        fill={paint("glaze")}
      />
      <path
        d="M253 421Q270 430 286 420L282 429Q270 437 258 429Z"
        fill="var(--scene-leaf-light)"
        opacity=".14"
        stroke="none"
      />
      <path
        d="M254 408Q253 418 259 424"
        stroke="var(--scene-paper)"
        strokeWidth="2.1"
        opacity=".75"
        fill="none"
      />
      <path
        d="M285 410q-1 10-5 15"
        stroke="var(--scene-pot)"
        strokeWidth=".65"
        opacity=".6"
        fill="none"
      />
      <path
        d="M260 431q10 5 19-1"
        stroke="var(--scene-paper)"
        strokeWidth=".85"
        opacity=".6"
        fill="none"
      />

      {/* The back rim, inner wall and coffee sit above the bowl in that order. */}
      <ellipse cx="269" cy="400" rx="20.3" ry="6.1" fill="var(--scene-paper)" />
      <ellipse
        cx="269"
        cy="400.1"
        rx="17.5"
        ry="4.1"
        fill="var(--scene-pot)"
        stroke="var(--scene-wood)"
        strokeWidth=".6"
      />
      <ellipse
        cx="269"
        cy="401"
        rx="16.9"
        ry="3.3"
        fill={paint("brew")}
        stroke="none"
      />
      <path
        d="M253 401q15 5.5 32-1"
        fill="none"
        stroke="var(--scene-gold)"
        strokeWidth=".7"
        opacity=".7"
      />
      <path
        d="M270 403C266 402 261 399 265 398C267 397 269 399 270 399.6C271 397.4 275 397.6 276 399C277 400.4 273 402.3 270 403Z"
        fill="var(--scene-paper)"
        stroke="none"
        opacity=".95"
      />
      <path
        d="M259 400q2-1 4-.8m14 2 3-.5"
        stroke="var(--scene-paper)"
        strokeWidth=".5"
        opacity=".65"
        fill="none"
      />
      <path
        d="M251 402q17 8 36-.1"
        stroke="var(--scene-paper)"
        strokeWidth="1.25"
        fill="none"
      />
      <path
        d="M255 396.6q12-3 23-.4"
        stroke="var(--scene-paper)"
        strokeWidth="1.1"
        opacity=".8"
        fill="none"
      />

      {/* Two tiny painted chamomile flowers and irregular glaze flecks. */}
      <g fill="none" stroke="var(--scene-leaf)" strokeWidth=".65">
        <path d="M269 427q-4-6-5-11m5 11q1-6 5-8" />
        <path
          d="M267 423q-5 0-5-3q4-1 5 3m3 0q5 1 6-2q-4-2-6 2"
          fill="var(--scene-leaf-light)"
        />
      </g>
      {[
        [264, 415.5, 1],
        [275, 418.5, 0.65],
      ].map(([x, y, size]) => (
        <g
          key={x}
          transform={`translate(${x} ${y}) scale(${size})`}
          stroke="var(--scene-rose)"
          strokeOpacity=".5"
          strokeWidth=".4"
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <path
              key={angle}
              transform={`rotate(${angle})`}
              d="M-.8-1C-3-3 .8-5.4 1.2-3Q2-1.4 .2-.5Z"
              fill="var(--scene-paper)"
            />
          ))}
          <circle r="1.3" fill="var(--scene-gold)" stroke="none" />
        </g>
      ))}
      <g fill="var(--scene-pot)" opacity=".48" stroke="none">
        {[
          [256, 413],
          [279, 414],
          [257, 418],
          [263, 426],
          [279, 424],
          [272, 410],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r=".4" />
        ))}
      </g>

      <g
        className="nook-tea-steam"
        fill="none"
        stroke={paint("steam")}
        strokeWidth="1.35"
      >
        <path d="M265 393C258 385 272 381 266 372Q262 366 267 360" />
        <path d="M277 391C282 386 271 381 279 374" />
      </g>
    </g>
  );
}

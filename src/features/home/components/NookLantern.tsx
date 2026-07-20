import { useId } from "react";

/** A little brass candle lantern with an opening door and separate glass panes. */
export function NookLantern({ isDark }: { isDark: boolean }) {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-lantern-${name})`;

  return (
    <g
      className="nook-lantern"
      transform="translate(0 -5)"
      strokeWidth=".8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={`${id}-lantern-brass`} x2="1" y2=".12">
          <stop stopColor="var(--scene-brass)" />
          <stop offset=".2" stopColor="var(--scene-gold)" />
          <stop offset=".34" stopColor="var(--scene-wood-light)" />
          <stop offset=".51" stopColor="var(--scene-gold)" />
          <stop offset=".82" stopColor="var(--scene-brass)" />
          <stop offset="1" stopColor="var(--scene-gold)" />
        </linearGradient>
        <linearGradient id={`${id}-lantern-glass`} x1="0" y1="0" x2=".9" y2="1">
          <stop stopColor="var(--scene-paper)" stopOpacity=".12" />
          <stop offset=".42" stopColor="var(--scene-glass)" stopOpacity=".12" />
          <stop offset="1" stopColor="var(--scene-glass)" stopOpacity=".34" />
        </linearGradient>
        <linearGradient id={`${id}-lantern-wax`} x2="1" y2=".12">
          <stop stopColor="var(--scene-pot)" />
          <stop offset=".24" stopColor="var(--scene-paper)" />
          <stop offset=".58" stopColor="var(--scene-paper)" />
          <stop offset="1" stopColor="var(--scene-gold)" />
        </linearGradient>
        <radialGradient id={`${id}-lantern-halo`}>
          <stop
            stopColor="var(--scene-glow)"
            stopOpacity={isDark ? ".48" : ".13"}
          />
          <stop
            offset=".48"
            stopColor="var(--scene-glow)"
            stopOpacity={isDark ? ".13" : ".04"}
          />
          <stop offset="1" stopColor="var(--scene-glow)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-lantern-light`} cx=".48" cy=".39" r=".7">
          <stop
            stopColor="var(--scene-glow)"
            stopOpacity={isDark ? ".76" : ".4"}
          />
          <stop
            offset=".5"
            stopColor="var(--scene-glow)"
            stopOpacity={isDark ? ".3" : ".12"}
          />
          <stop offset="1" stopColor="var(--scene-glow)" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-lantern-panes`}>
          <path d="M354 386Q375 391 396 386L399 431Q376 440 351 431Z" />
        </clipPath>
      </defs>

      <ellipse
        className="nook-lantern-halo"
        cx="375"
        cy="414"
        rx="58"
        ry="72"
        fill={paint("halo")}
        stroke="none"
      />
      <ellipse
        cx="376"
        cy="444"
        rx="27"
        ry="2.3"
        fill="var(--scene-shadow)"
        opacity=".26"
        stroke="none"
      />
      <path
        d="M353 444q2 1.5 7 0m29 0q4 1 8-.7"
        fill="none"
        stroke="var(--scene-shadow)"
        strokeWidth="1.5"
        opacity=".42"
      />
      <path d="M354 439v5q2 2 5 0v-4m32 0v4q3 2 5-1v-4" fill={paint("brass")} />

      {/* The carrying loop fixes into two small pivots on the ventilated cap. */}
      <path
        d="M362 374C357 364 360 352 374 352C388 352 393 363 388 374"
        fill="none"
        stroke="var(--scene-brass)"
        strokeWidth="3.2"
      />
      <path
        d="M362 370C359 360 364 353 374 353C382 353 386 357 388 363"
        fill="none"
        stroke="var(--scene-gold)"
        strokeWidth="1.25"
      />
      <path
        d="M364 359q3-5 10-5"
        fill="none"
        stroke="var(--scene-paper)"
        opacity=".4"
        strokeWidth=".6"
      />
      <path d="M363 369Q375 365 387 369V376H363Z" fill={paint("brass")} />
      <ellipse cx="375" cy="369" rx="12" ry="2.6" fill={paint("brass")} />
      <path
        d="M367 371v2m5-3v3m6-3v3m5-2v2"
        stroke="var(--scene-brass)"
        strokeWidth="1.8"
      />
      <path
        d="M366 367.8q8-2 16 0"
        fill="none"
        stroke="var(--scene-gold)"
        strokeWidth=".8"
      />
      {[362, 388].map((x) => (
        <g key={x}>
          <circle cx={x} cy="374" r="2.2" fill={paint("brass")} />
          <path
            d={`m${x - 0.6} 373.8h1.2`}
            stroke="var(--scene-brass)"
            strokeWidth=".65"
          />
        </g>
      ))}

      {/* Three clear facets: the darker side panes reveal the depth of the case. */}
      <path
        d="M354 385 363 389 361 434 351 431Z"
        fill="var(--scene-glass)"
        fillOpacity=".22"
      />
      <path
        d="M387 389 396 385 399 431 390 434Z"
        fill="var(--scene-brass)"
        fillOpacity=".23"
      />
      <path
        d="M363 389Q375 392 387 389L390 434Q375 439 361 434Z"
        fill={paint("glass")}
      />
      <path
        d="m361 386 2 41m26-41-2 41M361 430q14-4 28 0"
        fill="none"
        stroke="var(--scene-brass)"
        opacity=".25"
        strokeWidth=".75"
      />
      <g clipPath={`url(#${id}-lantern-panes)`}>
        <ellipse
          className="nook-lantern-halo"
          cx="374"
          cy="409"
          rx="25"
          ry="33"
          fill={paint("light")}
          stroke="none"
        />
        <ellipse
          cx="375"
          cy="433"
          rx="17"
          ry="3.3"
          fill="var(--scene-brass)"
          opacity=".6"
          stroke="none"
        />
        <path
          d="M361 430Q374 427 388 430L386 433Q374 436 363 433Z"
          fill={paint("brass")}
        />
        <path
          d="M363 431q11 4 23 0"
          fill="none"
          stroke="var(--scene-gold)"
          strokeWidth=".7"
        />

        {/* Uneven wax, a recessed pool and drips that end on the candle itself. */}
        <path
          d="M365 412Q368 410 371 412Q376 414 383 410L383 429Q376 434 366 430Z"
          fill={paint("wax")}
          stroke="var(--scene-pot)"
          strokeWidth=".65"
        />
        <path
          d="M366 413q2-1 3 2v6q0 3 2 2q1-1 1-4v-3q2-1 3 1v8q0 3 2 2v-9q0-3 2-3q2 0 3-3"
          fill="none"
          stroke="var(--scene-paper)"
          strokeWidth="2"
        />
        <path
          d="M368 425v3m12-5v5"
          stroke="var(--scene-paper)"
          strokeWidth=".75"
          opacity=".6"
        />
        <path
          d="M365 412Q368 409 372 411Q377 414 383 410Q384 415 376 416Q367 416 365 412Z"
          fill="var(--scene-paper)"
          stroke="var(--scene-pot)"
          strokeWidth=".5"
        />
        <ellipse
          cx="374.5"
          cy="413"
          rx="4.5"
          ry="1.4"
          fill="var(--scene-gold)"
          opacity=".55"
          stroke="none"
        />
        <path
          d="M371 412.5q3-1 6 .3"
          fill="none"
          stroke="var(--scene-glow)"
          strokeWidth=".65"
        />
        <path
          d="M374 413q-1-3 0-5"
          fill="none"
          stroke="var(--scene-ink)"
          strokeWidth=".9"
        />
        <g className="nook-candle-flame" stroke="none">
          <path
            d="M374 410C366 409 367 402 370 398Q374 394 373 390C381 397 383 407 374 410Z"
            fill="#efa956"
          />
          <path
            d="M374 408Q370 407 371 402Q375 398 374 395Q380 404 374 408Z"
            fill="#ffe3a0"
          />
          <path d="M374 408q-2.5-2 0-5q2.5 3 0 5Z" fill="#fff7d7" />
        </g>

        {/* Small separated reflections keep the flame and wax readable. */}
        <path
          d="M358 391 354 407M361 393 354 417M367 392 364 402M392 416l2 11"
          fill="none"
          stroke="var(--scene-paper)"
          strokeWidth="1.15"
          opacity=".28"
        />
        <path
          d="M365 394 363 405"
          fill="none"
          stroke="var(--scene-paper)"
          strokeWidth=".5"
          opacity=".38"
        />
      </g>

      {/* Solid corner posts and the fitted door sit in front of the glass. */}
      <g fill="none" stroke="var(--scene-brass)" strokeWidth="3">
        <path d="M354 386 351 431M363 389 361 434M387 389 390 434M396 386 399 431" />
      </g>
      <g fill="none" stroke="var(--scene-gold)" strokeWidth=".85">
        <path d="M354.3 388 351.7 429M363.2 391 361.6 432M387 391l2.5 41M396 388l2.6 42" />
      </g>
      <path
        d="M365 391Q375 393 385 391L387.5 431Q375 435 363.5 431Z"
        fill="none"
        stroke="var(--scene-gold)"
        opacity=".56"
        strokeWidth=".6"
      />
      {[398, 423].map((y) => (
        <g key={y} transform={`translate(361.6 ${y})`}>
          <rect
            x="-1.1"
            width="2.6"
            height="4.6"
            rx=".7"
            fill={paint("brass")}
            strokeWidth=".5"
          />
          <path d="M.3 1v2.5" stroke="var(--scene-gold)" strokeWidth=".6" />
        </g>
      ))}
      <path d="M388 409h3.7v8H388Z" fill={paint("brass")} strokeWidth=".5" />
      <ellipse
        cx="390.2"
        cy="413.1"
        rx="1.8"
        ry="2.3"
        fill="none"
        stroke="var(--scene-brass)"
        strokeWidth=".9"
      />
      <path
        d="M389.6 411.5q2-1 .8 2.6"
        fill="none"
        stroke="var(--scene-gold)"
        strokeWidth=".65"
      />

      {/* A pressed, ribbed roof overhangs the rolled metal edge. */}
      <path
        d="M350 382Q354 377 363 375Q375 372 387 375Q397 378 400 382L399 385Q375 391 351 385Z"
        fill={paint("brass")}
      />
      <path
        d="M363 375Q358 378 357 383M370 374Q367 379 367 386M380 374Q384 378 385 385M387 376q6 3 7 7"
        fill="none"
        stroke="var(--scene-brass)"
        strokeWidth=".85"
        opacity=".5"
      />
      <path
        d="M361 377q-3 2-3 4m13-5-2 8m11-8 3 7"
        fill="none"
        stroke="var(--scene-gold)"
        strokeWidth=".65"
      />
      <path
        d="M350 382Q374 388 400 382V385Q375 392 350 385Z"
        fill={paint("brass")}
      />
      <path
        d="M352 383q22 6 45 0"
        fill="none"
        stroke="var(--scene-gold)"
        strokeWidth="1.1"
      />
      <path
        d="M353 386q21 5 44 0"
        fill="none"
        stroke="var(--scene-brass)"
        opacity=".7"
        strokeWidth=".8"
      />

      {/* Layered rolled edges form the tray; the small feet touch the ledge. */}
      <path
        d="M351 431Q375 439 399 431L402 437Q376 447 348 437Z"
        fill={paint("brass")}
      />
      <path
        d="M351 433q23 8 47 0"
        fill="none"
        stroke="var(--scene-gold)"
        strokeWidth="1.15"
      />
      <path
        d="M350 437Q375 445 400 437V440Q375 448 350 440Z"
        fill={paint("brass")}
      />
      <path
        d="M353 439q21 6 43 0"
        fill="none"
        stroke="var(--scene-wood-light)"
        strokeWidth=".8"
        opacity=".8"
      />
      <path
        d="M360 442q14 3 29 .1"
        fill="none"
        stroke="var(--scene-brass)"
        strokeWidth=".7"
      />
      <g fill="var(--scene-gold)" stroke="var(--scene-brass)" strokeWidth=".4">
        <circle cx="354" cy="384.5" r=".9" />
        <circle cx="396" cy="384.5" r=".9" />
        <circle cx="353.5" cy="436.5" r=".85" />
        <circle cx="396.5" cy="436.5" r=".85" />
      </g>
    </g>
  );
}

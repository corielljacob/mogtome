import { useId } from "react";
import { NookThread } from "./NookThread";

// Gold satin follows the pressed roof and tray; the panes use airy diagonal silk.
const roofThreads = Array.from({ length: 30 }, (_, i) => {
  const x = 351 + i * 1.65;
  return `M${375 + (x - 375) * 0.65} 373Q${x} 378 ${x} 388`;
}).join(" ");
const trayThreads = Array.from({ length: 32 }, (_, i) => {
  const x = 350 + i * 1.6;
  return `M${x} 432q${(x - 375) * 0.08} 5 0 12`;
}).join(" ");
const paneThreads = Array.from(
  { length: 27 },
  (_, i) => `M${325 + i * 3.3} 387l30 50`,
).join(" ");
const candleThreads = Array.from(
  { length: 12 },
  (_, i) => `M${365 + i * 1.6} 412q-.4 9 .6 20`,
).join(" ");

/** Gold couching, silk panes, and cotton wax make a softly glowing lantern patch. */
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
        <clipPath id={`${id}-lantern-roof`}>
          <path d="M350 382Q354 377 363 375Q375 372 387 375Q397 378 400 382L399 385Q375 391 351 385Z" />
        </clipPath>
        <clipPath id={`${id}-lantern-tray`}>
          <path d="M351 431Q375 439 399 431L402 437Q376 447 348 437Z" />
          <path d="M350 437Q375 445 400 437V440Q375 448 350 440Z" />
        </clipPath>
        <clipPath id={`${id}-lantern-candle`}>
          <path d="M365 412Q368 410 371 412Q376 414 383 410L383 429Q376 434 366 430Z" />
        </clipPath>
        <clipPath id={`${id}-lantern-flame`}>
          <path d="M374 410C366 409 367 402 370 398Q374 394 373 390C381 397 383 407 374 410Z" />
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
      <NookThread
        d="M362 374C357 364 360 352 374 352C388 352 393 363 388 374"
        color="var(--scene-gold)"
        shadow="var(--scene-brass)"
        width={2.8}
      />
      <NookThread
        d="M362 374C357 364 360 352 374 352C388 352 393 363 388 374"
        color="var(--scene-wood-light)"
        shadow="var(--scene-brass)"
        width={1.4}
        dasharray=".8 3.2"
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
      <NookThread
        d="M364 369v6m2-7v7m2-8v8m2-8v8m2-8v8m2-8v8m2-8v8m2-8v8m2-8v8m2-7v7m2-7v7m2-6v6"
        color="var(--scene-gold)"
        shadow="var(--scene-brass)"
        width={1.05}
        opacity={0.8}
      />
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
        <NookThread
          d={paneThreads}
          color="var(--scene-glass)"
          shadow="var(--scene-brass)"
          width={0.95}
          opacity={0.25}
        />
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
        <g clipPath={`url(#${id}-lantern-candle)`}>
          <NookThread
            d={candleThreads}
            color="var(--scene-paper)"
            shadow="var(--scene-pot)"
            width={1.1}
          />
        </g>
        <NookThread
          d="M366 413q2-1 3 2v6q0 3 2 2q1-1 1-4v-3q2-1 3 1v8q0 3 2 2v-9q0-3 2-3q2 0 3-3"
          color="var(--scene-paper)"
          shadow="var(--scene-pot)"
          width={1.4}
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
            fill="var(--scene-gold)"
          />
          <path
            d="M374 408Q370 407 371 402Q375 398 374 395Q380 404 374 408Z"
            fill="var(--scene-glow)"
          />
          <g clipPath={`url(#${id}-lantern-flame)`}>
            <NookThread
              d="M373 391q1 10-5 13M375 393q1 10-5 14M376.5 396q1 9-4 13M378 399q1 7-3 11M379 402l-2 7"
              color="var(--scene-glow)"
              shadow="var(--scene-gold)"
              highlight="var(--scene-paper)"
              width={1.15}
            />
          </g>
          <NookThread
            d="M374 408q-2.5-2 0-5q2.5 3 0 5Z"
            color="var(--scene-paper)"
            shadow="var(--scene-gold)"
            width={1}
          />
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
      <NookThread
        d="M354 386 351 431M363 389 361 434M387 389 390 434M396 386 399 431"
        color="var(--scene-gold)"
        shadow="var(--scene-brass)"
        width={2.5}
      />
      <NookThread
        d="M354 386 351 431M363 389 361 434M387 389 390 434M396 386 399 431"
        color="var(--scene-wood-light)"
        shadow="var(--scene-brass)"
        width={1.35}
        dasharray=".9 3.3"
      />
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
      <g clipPath={`url(#${id}-lantern-roof)`}>
        <NookThread
          d={roofThreads}
          color="var(--scene-gold)"
          shadow="var(--scene-brass)"
          width={1.15}
        />
      </g>
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
      <NookThread
        d="M352 383q22 6 45 0"
        color="var(--scene-gold)"
        shadow="var(--scene-brass)"
        width={2.15}
      />
      <NookThread
        d="M352 383q22 6 45 0"
        color="var(--scene-wood-light)"
        shadow="var(--scene-brass)"
        width={1.2}
        dasharray=".8 2.5"
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
      <g clipPath={`url(#${id}-lantern-tray)`}>
        <NookThread
          d={trayThreads}
          color="var(--scene-gold)"
          shadow="var(--scene-brass)"
          width={1.1}
        />
      </g>
      <NookThread
        d="M352 433q23 8 45 0M350 439q25 8 50 0"
        color="var(--scene-gold)"
        shadow="var(--scene-brass)"
        width={1.9}
      />
      <NookThread
        d="M352 433q23 8 45 0M350 439q25 8 50 0"
        color="var(--scene-wood-light)"
        shadow="var(--scene-brass)"
        width={1.1}
        dasharray=".85 2.4"
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

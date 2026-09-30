import { useId } from "react";
import { NookThread } from "./NookThread";

// The hand-cut cloth follows the ivy, sill, corbels, and hanging tea towel.
// Small changes in the edge keep the backing from reading as another frame.
const clothOutline =
  "M200 10C164 8 134 15 106 32Q95 32 86 44C62 63 44 86 33 110Q22 115 21 132L17 162Q10 173 15 188C17 208 11 231 17 253Q13 270 18 286L16 307Q10 326 12 345L10 376Q12 398 9 419Q1 425 1 438L2 454Q3 469 14 475L28 478L28 497Q29 509 42 510L59 510L62 530Q65 538 82 537C110 541 125 533 140 536C166 542 190 535 207 538Q218 539 218 525L215 491Q215 483 225 484C275 486 318 485 351 482L353 499Q354 511 366 511L392 510Q405 510 405 497L404 479L424 477Q434 476 435 464L436 441Q437 429 426 422L415 417L414 383Q414 367 401 358L379 349L378 303Q383 288 377 273L381 237Q387 222 381 205Q386 185 379 168L377 147Q375 132 365 123C354 87 328 57 298 39Q289 28 275 26C250 15 226 9 200 10Z";

const runningSeam =
  "M200 14C165 12 136 19 108 36Q98 36 89 48C65 66 48 88 37 114Q26 119 25 133L21 164Q14 174 19 189C21 209 15 232 21 253Q17 271 22 286L20 308Q14 327 16 346L14 376Q16 398 13 421Q5 427 5 438L6 454Q7 466 15 471L32 475L32 497Q33 505 43 506L62 506L66 529Q69 534 83 533C110 537 125 529 141 532C166 538 190 531 207 534Q214 535 214 525L211 491Q211 479 225 480C275 482 319 481 354 478L357 499Q358 507 366 507L392 506Q401 506 401 497L400 476L423 473Q430 472 431 464L432 441Q433 431 424 426L411 420L410 383Q410 370 399 362L375 352L374 302Q379 288 373 273L377 236Q383 221 377 205Q382 185 375 169L373 148Q371 134 362 126C351 90 325 60 295 42Q287 32 274 30C249 19 226 13 200 14Z";

// A few longer stitches cross the turned edge where the fabric changes direction.
const blanketStitches =
  "M150 17l-1.3-4M165 14l-.7-4M181 13l-.3-3.8M213 14l.4-4M229 16l.8-4M244 19l1-4M93 45l-2.8-3M67 69l-3.2-2.5M45 98l-3.4-2M26 125l-4-1.1M20 193l-4 .3M20 215l-4-.3M21 273l-3.9-.3M17 328l-4-.8M14 386l-3.7 .2M8 459l-4 1.2M38 505l-.8 4M72 533l-.4 3.8M98 536l.3 3.8M126 533l.1 3.9M155 536l-.1 4M183 534l.3 4M211 530l4.2 1M243 481l-.1 3.8M281 482l.1 3.8M323 481l.2 4M365 507l-.2 3.8M385 506l.3 4M424 472l1.3 3.7M431 454l4 .2M411 390l3.8-.1M405 368l3.1-2.1M377 339l-3.9 .1M375 300l3.8 .5M378 231l4 1M379 189l3.9-.4M369 135l3.6-1.6M351 102l3.5-1.8M329 74l2.8-2.8M307 51l2.6-3.1M283 33l1.8-3.4";

/** Linen gives the whole embroidered scene a small, physically sewn margin. */
export function NookAppliqueBacking() {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-applique-${name})`;

  return (
    <svg
      className="nook-applique-backing"
      viewBox="0 0 440 550"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-applique-linen`}
          x1="42"
          y1="16"
          x2="353"
          y2="535"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--applique-linen, var(--scene-paper))" />
          <stop
            offset=".55"
            stopColor="color-mix(in srgb, var(--applique-linen, var(--scene-paper)) 93%, var(--scene-wood-light))"
          />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--applique-linen, var(--scene-paper)) 86%, var(--scene-wood-light))"
          />
        </linearGradient>
        <pattern
          id={`${id}-applique-weave`}
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M.8 0v5M3.2 0v5"
            stroke="var(--scene-wood-dark)"
            strokeWidth=".55"
            opacity=".11"
          />
          <path
            d="M0 1.2h5M0 3.7h5"
            stroke="var(--scene-wood-dark)"
            strokeWidth=".6"
            opacity=".08"
          />
          <path
            d="M1.35 0v1.2m0 2.5V5M3.75 1.2v2.5M0 .7h.8m2.4 2.5H5"
            stroke="var(--scene-paper)"
            strokeWidth=".55"
            opacity=".65"
          />
        </pattern>
      </defs>

      {/* Close, graduated shadows keep the cloth attached to the same wall. */}
      <path
        d={clothOutline}
        fill="var(--scene-shadow)"
        stroke="var(--scene-shadow)"
        strokeWidth="3"
        opacity=".055"
        transform="translate(1.3 3.2)"
      />
      <path
        d={clothOutline}
        fill="var(--scene-shadow)"
        stroke="var(--scene-shadow)"
        strokeWidth="1.1"
        opacity=".13"
        transform="translate(.6 1.5)"
      />
      <path d={clothOutline} fill={paint("linen")} />
      <path d={clothOutline} fill={paint("weave")} />
      <path
        d={clothOutline}
        stroke="var(--scene-wood-dark)"
        strokeWidth=".8"
        strokeOpacity=".19"
        strokeLinejoin="round"
      />
      <NookThread
        d={clothOutline}
        color="var(--applique-linen, var(--scene-paper))"
        shadow="var(--scene-wood-dark)"
        width={0.95}
        opacity={0.78}
        dasharray="2.1 .6 3.7 .5"
      />
      <NookThread
        d={runningSeam}
        color="var(--applique-thread, var(--scene-wood-light))"
        shadow="var(--scene-wood-dark)"
        width={1.05}
        opacity={0.88}
        dasharray="2.4 2.6 2.9 2.5"
        relief={1.15}
      />
      <NookThread
        d={blanketStitches}
        color="var(--applique-thread, var(--scene-wood-light))"
        shadow="var(--scene-wood-dark)"
        width={0.95}
        opacity={0.75}
      />

      {/* Sparse loose fibers soften the cut edge without making a fringe. */}
      <path
        d="M117 27q-2-2.5-4-2M157 13q-.5-3 1-4M23 129q-3.2.6-4.5-1.5M15 250q-4 .8-4 3.5M11 374q-3-1-4 1.5M80 537q-1 4 1.4 5M193 537q1.6 3 .3 5M406 490q3.5-.6 4.7 1.5M380 182q3-.8 4.2-3M314 51q3.3-1.3 3.4-3.4"
        stroke="var(--applique-linen, var(--scene-paper))"
        strokeWidth=".75"
        strokeLinecap="round"
        opacity=".9"
      />
      <path
        d="M118 27q-3-1.1-4.5-4M14 251q-2.5 2-4.5 1M81 537q1 4-.5 6M381 182q2-2 4-1"
        stroke="var(--applique-thread, var(--scene-wood-light))"
        strokeWidth=".45"
        strokeLinecap="round"
        opacity=".55"
      />
    </svg>
  );
}

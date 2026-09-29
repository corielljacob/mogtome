import { useId } from "react";
import { NookTeaSteam } from "./NookTeaSteam";
import { NookThread } from "./NookThread";

// The cup's stitches fan inward with its tapered bowl; the saucer fans outward.
const bowlThreads = Array.from({ length: 24 }, (_, i) => {
  const x = 249 + i * 1.8;
  const foot = 259 + i * 1.02;
  return `M${x} 401Q${x - 1.5} 420 ${foot} 433`;
}).join(" ");
const saucerThreads = Array.from({ length: 52 }, (_, i) => {
  const angle = (i / 52) * Math.PI * 2;
  return `M${271.5 + Math.cos(angle) * 22} ${432.5 + Math.sin(angle) * 3.4}L${271.5 + Math.cos(angle + 0.018) * 30} ${432.5 + Math.sin(angle + 0.018) * 5.6}`;
}).join(" ");
const handleThreads = Array.from({ length: 15 }, (_, i) => {
  const angle = -1.7 + i * 0.24;
  return `M${291.5 + Math.cos(angle) * 9} ${410 + Math.sin(angle) * 8}L${291.5 + Math.cos(angle + 0.02) * 15} ${410 + Math.sin(angle + 0.02) * 13}`;
}).join(" ");

/** Ivory satin stitches shape the cup; wrapped cords finish each ceramic edge. */
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
        <clipPath id={`${id}-coffee-bowl`}>
          <path d="M249 400C247 410 251 425 257 430Q268 438 281 430C288 424 291 408 289 400Z" />
        </clipPath>
        <clipPath id={`${id}-coffee-handle`}>
          <path d="M282 405C291 399 303 398 306 404C311 414 298 425 282 430L278 425C290 422 302 414 301 407C300 403 292 405 284 410Z" />
        </clipPath>
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
      <NookThread
        d={saucerThreads}
        color="var(--scene-paper)"
        shadow="var(--scene-pot)"
        width={1.2}
        opacity={0.85}
      />
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
      <NookThread
        d="M242 433Q248 438 271.5 438Q294 438 301 433"
        color="var(--scene-paper)"
        shadow="var(--scene-pot)"
        width={1.65}
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
      <g clipPath={`url(#${id}-coffee-handle)`}>
        <NookThread
          d={handleThreads}
          color="var(--scene-paper)"
          shadow="var(--scene-pot)"
          width={1.45}
        />
      </g>
      <NookThread
        d="M285 405C296 399 304 400 305 406Q307 418 282 428"
        color="var(--scene-paper)"
        shadow="var(--scene-pot)"
        width={1.45}
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
      <g clipPath={`url(#${id}-coffee-bowl)`}>
        <NookThread
          d={bowlThreads}
          color="var(--scene-paper)"
          shadow="var(--scene-pot)"
          width={1.2}
          opacity={0.82}
        />
      </g>
      <NookThread
        d="M249.5 405Q249 422 258 430Q270 438 281 430Q288 423 289 405"
        color="var(--scene-paper)"
        shadow="var(--scene-pot)"
        width={1.7}
      />
      <NookThread d="M260 433q10 4 19 0" color="var(--scene-pot)" width={1.4} />

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
      <NookThread
        d="M252.4 401C252.4 397.1 285.6 397.1 285.6 401C285.6 404.9 252.4 404.9 252.4 401ZM256 401C256 398.7 282 398.7 282 401C282 403.3 256 403.3 256 401ZM261 401q8-2.3 16 0q-8 2.3-16 0"
        color="var(--scene-brass)"
        highlight="var(--scene-gold)"
        width={0.95}
        opacity={0.8}
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
      <NookThread
        d="M249 400C249 392 289 392 289 400C289 408 249 408 249 400Z"
        color="var(--scene-paper)"
        shadow="var(--scene-pot)"
        width={1.8}
      />
      <NookThread
        d="M250 400C250 392.8 288 392.8 288 400C288 407.2 250 407.2 250 400Z"
        color="var(--scene-paper)"
        shadow="var(--scene-pot)"
        width={0.8}
        dasharray=".9 1.8"
      />

      {/* Stem stitches, lazy-daisy petals, and small French-knot flower centres. */}
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
            <g key={angle} transform={`rotate(${angle})`}>
              <NookThread
                d="M0-.7Q-2.5-4.4 0-4Q2-3.5 0-.7"
                color="var(--scene-paper)"
                shadow="var(--scene-rose)"
                width={0.85}
              />
            </g>
          ))}
          <circle
            r="1.3"
            fill="var(--scene-gold)"
            stroke="var(--scene-brass)"
          />
          <path d="m-.55-.3.8.6" stroke="var(--scene-paper)" strokeWidth=".7" />
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

      <NookTeaSteam />
    </g>
  );
}

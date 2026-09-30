import { useId } from "react";
import { NookThread } from "./NookThread";

/** Oak-colored thread courses follow the sill's rounded faces and fitted corbels. */
export function NookLedge() {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-ledge-${name})`;

  return (
    <g
      className="nook-ledge"
      strokeWidth=".95"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={`${id}-ledge-top`} x1="0" y1="0" x2=".15" y2="1">
          <stop stopColor="var(--scene-wood)" />
          <stop offset=".35" stopColor="var(--scene-wood-light)" />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-wood-light) 76%, var(--scene-paper))"
          />
        </linearGradient>
        <linearGradient
          id={`${id}-ledge-roundover`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop stopColor="var(--scene-wood-light)" />
          <stop
            offset=".27"
            stopColor="color-mix(in srgb, var(--scene-wood-light) 87%, var(--scene-paper))"
          />
          <stop offset=".62" stopColor="var(--scene-wood)" />
          <stop offset="1" stopColor="var(--scene-wood-dark)" />
        </linearGradient>
        <linearGradient
          id={`${id}-ledge-fascia`}
          x1=".05"
          y1="0"
          x2=".1"
          y2="1"
        >
          <stop stopColor="var(--scene-wood-dark)" />
          <stop offset=".25" stopColor="var(--scene-wood)" />
          <stop offset=".76" stopColor="var(--scene-wood)" />
          <stop offset="1" stopColor="var(--scene-wood-dark)" />
        </linearGradient>
        <linearGradient id={`${id}-ledge-corbel`} x1="0" y1="0" x2="1" y2=".6">
          <stop stopColor="var(--scene-wood-light)" />
          <stop offset=".38" stopColor="var(--scene-wood)" />
          <stop offset="1" stopColor="var(--scene-wood-dark)" />
        </linearGradient>
        <g id={`${id}-ledge-bracket`}>
          {/* The backplate, curved supporting arm, and top bearing are joined. */}
          <path
            d="M1 0H29V7Q20 9 17 20L15 29Q14 33 7 33H1Z"
            fill={paint("corbel")}
          />
          <path
            d="M1 0H6V32H1Z"
            fill="var(--scene-wood-dark)"
            stroke="none"
            opacity=".48"
          />
          <path
            d="M8 9H21Q13 15 12 24V27H8Z"
            fill="var(--scene-wood-dark)"
            strokeWidth=".65"
          />
          <path
            d="M9 10H18Q11 17 11 24"
            fill="none"
            stroke="var(--scene-wood-light)"
            strokeWidth=".65"
            opacity=".85"
          />
          <path
            d="M7 7V29Q11 30 13 27"
            fill="none"
            stroke="var(--scene-paper)"
            strokeWidth=".65"
            opacity=".24"
          />
          <path
            d="M0 28Q7 30 16 28L15 33Q8 35 1 33Z"
            fill="var(--scene-wood)"
            strokeWidth=".8"
          />
          <path
            d="M3 30Q8 31 13 30"
            stroke="var(--scene-wood-light)"
            strokeWidth=".7"
          />
          <path d="M0 0H30V5Q16 7 0 5Z" fill="var(--scene-wood-light)" />
          <path
            d="M2 5H27"
            stroke="var(--scene-wood-dark)"
            strokeWidth=".7"
            opacity=".65"
          />
          <NookThread
            d="M3 2H27M2 4H28M3 8V27M5.2 8V27M3 30Q8 32 13 30M3 32Q8 34 13 32"
            color="var(--scene-wood-light)"
            width={1.15}
          />
          <NookThread
            d="m20 9 5 1m-7 1 5 1m-6 1 4.8 1.2m-6.1 1.2 4.5 1.2m-5.6 1.4 4.1 1m-4.8 1.4 4 .9m-4.7 1.5 4 .7m-4.6 1.6 3.8 .7m-4.2 1.6 3.4 .7"
            color="var(--scene-wood)"
            width={1.35}
          />
          <NookThread
            d="M1.4 6V28M27 6Q19 9 16 20L14 28M7.4 8H21Q13 15 12 24V27H8"
            color="var(--scene-wood-light)"
            width={1.35}
          />
          <NookThread
            d="M7.2 8V28M26 6Q18 10 15 20L13 28"
            color="var(--scene-wood-dark)"
            width={0.85}
            dasharray="1.4 1.6"
            opacity={0.85}
          />
        </g>
      </defs>

      {/* Supports tuck behind the fascia, so no gap opens at the join. */}
      <g fill="var(--scene-shadow)" stroke="none" opacity=".12">
        <path
          d="M40 465H69V476Q60 478 57 489L55 500H41Z"
          transform="translate(2 2)"
        />
        <path
          d="M364 465H393V500H379L377 489Q374 478 364 476Z"
          transform="translate(2 2)"
        />
      </g>
      <use href={`#${id}-ledge-bracket`} transform="translate(39 464)" />
      <use
        href={`#${id}-ledge-bracket`}
        transform="translate(394 464) scale(-1 1)"
      />

      <path
        d="M15 442Q213 438 422 443L419 465Q212 475 20 466Z"
        fill="var(--scene-shadow)"
        opacity=".13"
        stroke="none"
        transform="translate(1 3)"
      />

      {/* The top plane remains continuous beneath the cloth and shelf objects. */}
      <path
        d="M18 431Q208 429 416 432L423 438Q426 441 421 443Q211 448 13 443Q8 442 10 438Z"
        fill={paint("top")}
      />
      <path
        d="M46 432Q201 430 358 432"
        fill="none"
        stroke="var(--scene-wood-dark)"
        strokeWidth="1.15"
        opacity=".33"
      />
      <path
        d="M22 435Q170 432 307 435M326 435q46-1 85 1"
        fill="none"
        stroke="var(--scene-wood)"
        strokeWidth=".65"
        opacity=".36"
      />
      {Array.from({ length: 4 }, (_, i) => (
        <NookThread
          key={`top-${i}`}
          d={`M${20 - i * 2} ${433 + i * 2.1}Q209 ${430 + i * 2.5} ${415 + i * 1.5} ${434 + i * 1.8}`}
          color="var(--scene-wood-light)"
          width={1.1}
          opacity={0.84}
          dasharray={i % 2 ? "12 .9 8 1.1" : "7 1 14 .8"}
        />
      ))}

      {/* A single rounded lip sits over a recessed apron and a small lower bead. */}
      <path
        d="M15 446Q212 452 419 447L416 464Q209 471 20 464Z"
        fill={paint("fascia")}
      />
      <path
        d="M10 439Q209 445 423 439L423 448Q422 452 416 452Q209 459 16 452Q10 451 10 446Z"
        fill={paint("roundover")}
      />
      <path
        d="M14 442Q209 448 420 442"
        fill="none"
        stroke="var(--scene-paper)"
        strokeWidth="1.05"
        opacity=".34"
      />
      <path
        d="M16 452Q210 459 418 452"
        fill="none"
        stroke="var(--scene-wood-dark)"
        strokeWidth="1.15"
        opacity=".75"
      />
      <path
        d="M21 455Q209 462 414 455"
        fill="none"
        stroke="var(--scene-wood-light)"
        strokeWidth=".65"
        opacity=".48"
      />
      <path
        d="M20 463Q209 470 416 463L414 467Q209 474 22 467Z"
        fill={paint("roundover")}
        strokeWidth=".8"
      />
      <path
        d="M24 465Q210 472 411 465"
        fill="none"
        stroke="var(--scene-wood-light)"
        strokeWidth=".7"
        opacity=".74"
      />

      {/* Long laid stitches describe each face; small cross stitches couch the binding. */}
      {Array.from({ length: 7 }, (_, i) => (
        <NookThread
          key={`lip-${i}`}
          d={`M13 ${440.6 + i * 1.62}Q209 ${447.2 + i * 1.68} 420 ${440.6 + i * 1.62}`}
          color={i < 3 ? "var(--scene-wood-light)" : "var(--scene-wood)"}
          width={1.08}
          opacity={0.94}
          dasharray={i % 2 ? "14 .9 9 1.1" : "9 1 13 .9"}
        />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <NookThread
          key={`apron-${i}`}
          d={`M21 ${454.3 + i * 1.6}Q209 ${461.3 + i * 1.6} 415 ${454.3 + i * 1.6}`}
          color={i % 3 ? "var(--scene-wood)" : "var(--scene-wood-light)"}
          width={1}
          opacity={0.78}
          dasharray={i % 2 ? "11 1 15 .8" : "16 .8 10 1"}
        />
      ))}
      <NookThread
        d="M12 440Q209 446 422 440M17 452Q210 459 417 452M22 467Q209 474 414 467"
        color="var(--scene-wood-light)"
        width={1.8}
      />
      <NookThread
        d={Array.from({ length: 53 }, (_, i) => {
          const x = 17 + i * 7.6;
          const u = (x - 17) / 400;
          const y = 452 + 14 * u * (1 - u);
          return `M${x - 0.5} ${y - 1.5}l1 2.8`;
        }).join(" ")}
        color="var(--scene-wood-dark)"
        width={0.9}
        opacity={0.8}
      />
      <NookThread
        d="M23 465Q209 472 413 465"
        color="var(--scene-wood)"
        width={1}
        dasharray="2.1 2.4"
      />

      {/* Quiet grain follows each long face; the ends show the board's thickness. */}
      <g
        fill="none"
        stroke="var(--scene-wood-dark)"
        strokeWidth=".6"
        opacity=".38"
      >
        <path d="M24 447q23 1 44 0M87 449q27 2 44 1M245 450q24 0 43-1M349 447q34 0 58-2" />
        <path d="M27 459q19 1 39 0M244 461q40-2 65-1q14 2 29-1q40-3 65-1" />
        <path d="M314 459q11-6 24-1q-11 5-24 1Z" />
        <path d="M320 458.5q5-2 10-.5" />
        <path d="M14 442q-1 4 2 7M19 444v5M419 442q1 4-2 7" />
      </g>
      <path
        d="M17 445q0 2 1 3M407 457l5-.3"
        fill="none"
        stroke="var(--scene-wood-light)"
        strokeWidth=".75"
        opacity=".66"
      />
    </g>
  );
}

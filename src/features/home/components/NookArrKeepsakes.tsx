import { useId } from "react";
import { NookThread } from "./NookThread";

const crystalOutline = "M50 39 72 65 66 103 47 132 29 99 27 66Z";
const pennantOutline = "M23 52Q59 55 96 52L92 179 60 207 25 180Z";

/** A little crystal, sewn in blue silk and tied to a traveler's letter. */
export function NookArrCrystalCharm() {
  const id = useId().replace(/:/g, "");

  return (
    <svg
      className="nook-arr-crystal-charm"
      viewBox="0 0 100 150"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={`${id}-crystal`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="var(--arr-crystal-light)" />
          <stop offset=".55" stopColor="var(--arr-crystal)" />
          <stop offset="1" stopColor="var(--arr-crystal-dark)" />
        </linearGradient>
        <clipPath id={`${id}-crystal-clip`}>
          <path d={crystalOutline} />
        </clipPath>
      </defs>
      <NookThread
        d="M5 10Q20 35 48 32Q78 30 95 13M49 33Q52 23 59 23Q65 25 57 31L49 33Q37 18 32 25Q29 32 49 33L39 47M49 33 61 44"
        color="var(--scene-gold)"
        width={1.8}
      />
      <path
        d={crystalOutline}
        fill="var(--scene-wood-dark)"
        opacity=".18"
        transform="translate(2 3)"
      />
      <path d={crystalOutline} fill={`url(#${id}-crystal)`} />
      <path
        d="M50 39 40 71 47 132 29 99 27 66Z"
        fill="var(--arr-crystal-light)"
      />
      <path d="M50 39 56 69 66 103 72 65Z" fill="var(--arr-crystal-dark)" />
      <path d="M40 71 56 69 47 132Z" fill="var(--arr-crystal)" />
      <g clipPath={`url(#${id}-crystal-clip)`}>
        {Array.from({ length: 26 }, (_, index) => {
          const y = 46 + index * 3.1;
          return (
            <NookThread
              key={y}
              d={`M27 ${y + 5} 40 ${y} 56 ${y - 2} 72 ${y + 3}`}
              color="var(--arr-crystal-light)"
              highlight="var(--scene-paper)"
              width={0.9}
              opacity={0.55}
            />
          );
        })}
      </g>
      <NookThread
        d={`${crystalOutline}M50 39 40 71 47 132M40 71 27 66M40 71 56 69 72 65M50 39 56 69 66 103 47 132`}
        color="var(--arr-crystal-light)"
        width={1.4}
      />
      <NookThread
        d="M44 43Q50 46 55 44M43 46Q50 49 58 47M49 34Q45 35 46 40Q48 43 51 39Q54 35 49 34"
        color="var(--scene-gold)"
        width={2}
      />
      <NookThread
        d="M36 56 33 62M35 70 36 84M49 81 50 94"
        color="var(--scene-paper)"
        width={1.1}
        opacity={0.85}
      />
    </svg>
  );
}

/** A stitched wayfinder pennant for the beginning of an Eorzean journey. */
export function NookArrWayfinder() {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-wayfinder-${name})`;

  return (
    <svg
      className="nook-wall-hanging nook-arr-wayfinder"
      viewBox="0 0 120 230"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient
          id={`${id}-wayfinder-cloth`}
          x1="0"
          y1="0"
          x2="1"
          y2=".2"
        >
          <stop stopColor="var(--arr-crystal-dark)" />
          <stop offset=".25" stopColor="var(--arr-crystal)" />
          <stop offset=".45" stopColor="var(--arr-crystal-dark)" />
          <stop offset=".7" stopColor="var(--arr-crystal)" />
          <stop offset="1" stopColor="var(--arr-crystal-dark)" />
        </linearGradient>
        <pattern
          id={`${id}-wayfinder-weave`}
          width="3.4"
          height="3.4"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M.4 0V3.4M0 1H3.4"
            stroke="var(--arr-crystal-dark)"
            opacity=".35"
            strokeWidth=".7"
          />
          <path
            d="M1.1 0V3.4M0 1.7H3.4"
            stroke="var(--arr-crystal-light)"
            opacity=".22"
            strokeWidth=".5"
          />
        </pattern>
      </defs>
      <NookThread
        d="M16 49Q44 32 60 13Q78 32 104 49"
        color="var(--scene-gold)"
        width={2}
      />
      <circle
        cx="60"
        cy="12"
        r="3"
        fill="var(--scene-gold)"
        stroke="var(--scene-wood-dark)"
      />
      <path
        d={pennantOutline}
        fill="var(--scene-wood-dark)"
        opacity=".22"
        transform="translate(3 4)"
      />
      <path
        d="M13 48Q59 46 107 49L107 54Q60 51 13 53Z"
        fill="var(--scene-wood)"
      />
      <NookThread
        d="M13 49Q60 48 107 50"
        color="var(--scene-gold)"
        width={2.2}
      />
      <path d={pennantOutline} fill={paint("cloth")} />
      <path d={pennantOutline} fill={paint("weave")} />
      <NookThread
        d="M29 60 31 176 60 200 86 175 89 61"
        color="var(--scene-gold)"
        width={1.6}
      />
      <NookThread
        d="M34 65 36 174 60 193 81 172 84 65"
        color="var(--arr-crystal-light)"
        width={1.1}
        dasharray="2 3.2"
      />
      {[28, 84].map((x) => (
        <g key={x}>
          <path d={`M${x} 47q3-2 6 0v15h-6Z`} fill="var(--scene-paper)" />
          <NookThread
            d={`M${x + 2} 48v12M${x + 4} 48v12`}
            color="var(--scene-gold)"
            width={0.9}
          />
        </g>
      ))}
      {Array.from({ length: 18 }, (_, index) => {
        const y = 66 + index * 6;
        return (
          <NookThread
            key={y}
            d={`M24.5 ${y}l5 1M88 ${y}l5-1`}
            color="var(--scene-gold)"
            width={1.15}
          />
        );
      })}
      <g transform="rotate(-3 59 121)">
        <NookThread
          d="M59 90a31 31 0 1 1-.1 0M59 94a27 27 0 1 1-.1 0"
          color="var(--scene-gold)"
          width={1.45}
        />
        <NookThread
          d="M59 77V91M59 152V166M15 121H28M90 121H103M31 94 39 102M79 141 88 150M31 149 39 141M79 101 87 93"
          color="var(--scene-paper)"
          width={1.5}
        />
        <path
          d="M59 96 71 115 65 138 59 149 48 128 47 113Z"
          fill="var(--arr-crystal-light)"
        />
        <path
          d="M59 96 58 117 59 149 65 138 71 115Z"
          fill="var(--arr-crystal)"
        />
        <NookThread
          d="M54 105 61 103M51 110 64 108M48 115 67 113M48 119 69 117M49 123 68 121M51 127 67 125M53 131 66 129M55 135 64 133M56 139 62 137"
          color="var(--arr-crystal-light)"
          width={1.4}
        />
        <NookThread
          d="M59 96 71 115 65 138 59 149 48 128 47 113ZM59 96 58 117 59 149M47 113 58 117 71 115"
          color="var(--scene-paper)"
          width={1.5}
        />
      </g>
      <NookThread
        d="M50 175 60 181 69 174M54 180 60 185 65 180M60 208V218M55 213l5-5 5 5M56 217l4-9 4 9"
        color="var(--scene-gold)"
        width={1.5}
      />
    </svg>
  );
}

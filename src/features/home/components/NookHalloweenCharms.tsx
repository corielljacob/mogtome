import { useId } from "react";
import { NookThread } from "./NookThread";

const velvet = "var(--scene-halloween-velvet, #574568)";
const velvetLight = "var(--scene-halloween-velvet-light, #9d80ad)";
const brass = "var(--scene-gold)";
const paper = "var(--scene-paper)";

const batOutline =
  "M-3-2-5-8-1-5 2-5 6-8 5-2Q14-11 24-9Q17-5 18 3Q12-2 9 6Q5 3 3 9L0 12-3 9Q-5 3-9 6Q-12-2-18 3Q-17-5-24-9Q-14-11-3-2Z";
const potionOutline =
  "M-4-32H4V-24C4-20 12-20 12-12L11-2Q0 2-11-2L-12-12C-12-20-4-20-4-24Z";
const labelOutline = "M-7-17Q0-19 7-17L6-5Q0-3-6-5Z";
const waxOutline = "M-4-28Q0-30 4-28L5 0Q0 2-5 0Z";
const leftWingThreads = Array.from({ length: 15 }, (_, i) => {
  const y = -17 + i * 1.45;
  return `M-27 ${y}Q-15 ${y - 1} -2 ${y + 11}`;
}).join(" ");
const rightWingThreads = Array.from({ length: 15 }, (_, i) => {
  const y = -17 + i * 1.45;
  return `M27 ${y}Q15 ${y - 1} 2 ${y + 11}`;
}).join(" ");
const bottleThreads = Array.from({ length: 19 }, (_, i) => {
  const x = -13.5 + i * 1.5;
  return `M${x * 0.3} -34V-25Q${x * 0.3} -22 ${x} -18C${x * 1.12} -12 ${x} -5 ${x * 0.83} 1`;
}).join(" ");
const potionThreads = Array.from({ length: 8 }, (_, i) => {
  const y = -12 + i * 1.65;
  return `M-14 ${y}Q0 ${y + 3.5} 14 ${y}`;
}).join(" ");
const labelThreads = Array.from({ length: 12 }, (_, i) => {
  const y = -18 + i * 1.45;
  return `M-9 ${y}Q0 ${y - 1.5} 9 ${y - 3}`;
}).join(" ");

/** Velvet ornaments and amber beads sit just inside the copper-leaf arch. */
export function NookHalloweenWindowCharms() {
  const id = useId().replace(/:/g, "");
  const light = `url(#${id}-charm-glow)`;

  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <clipPath id={`${id}-bat-stitches`}>
          <path d={batOutline} />
        </clipPath>
        <radialGradient id={`${id}-charm-glow`}>
          <stop stopColor="#ffd492" stopOpacity=".64" />
          <stop offset=".35" stopColor="#f5ab62" stopOpacity=".2" />
          <stop offset="1" stopColor="#f5ab62" stopOpacity="0" />
        </radialGradient>
        <g id={`${id}-velvet-bat`}>
          <path d={batOutline} fill={velvet} strokeWidth=".8" />
          <g clipPath={`url(#${id}-bat-stitches)`}>
            <NookThread
              d={leftWingThreads}
              color={velvet}
              shadow="var(--scene-wood-dark)"
              highlight={velvetLight}
              width={1.4}
              relief={1.9}
            />
            <NookThread
              d={rightWingThreads}
              color="color-mix(in srgb, var(--scene-halloween-velvet, #574568) 82%, var(--scene-halloween-velvet-light, #9d80ad))"
              shadow={velvet}
              highlight={velvetLight}
              width={1.4}
              relief={1.9}
            />
            <NookThread
              d="M-4-8Q-2 0-3 9M-2-7Q0 0-1 11M0-5V13M2-5Q1 0 1 11M4-8Q2 0 3 9"
              color={velvet}
              shadow="var(--scene-wood-dark)"
              highlight={velvetLight}
              width={1.4}
              relief={1.9}
            />
          </g>
          <NookThread
            d={batOutline}
            color="color-mix(in srgb, var(--scene-halloween-velvet, #574568) 65%, var(--scene-halloween-velvet-light, #9d80ad))"
            shadow={velvet}
            highlight={velvetLight}
            width={1.3}
            relief={1.9}
          />
          <NookThread
            d={batOutline}
            color={velvetLight}
            shadow={velvet}
            width={0.6}
            dasharray=".4 1.4"
          />
          <path d="m-1.5-.4.1 0m4.2 0 .1 0" stroke={paper} strokeWidth="1.2" />
          <path
            d="M0 3q1 1 2 0"
            fill="none"
            stroke={velvetLight}
            strokeWidth=".6"
          />
        </g>
      </defs>

      <NookThread
        d="M91 83Q125 38 166 41Q204 53 237 42Q280 49 313 87"
        color="var(--scene-wood-dark)"
        highlight={brass}
        width={1}
      />
      {[
        [104, 70],
        [135, 49],
        [170, 43],
        [202, 49],
        [238, 45],
        [274, 59],
        [301, 80],
      ].map(([x, y]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <circle
            className="nook-halloween-spark"
            cy="5"
            r="13"
            fill={light}
            stroke="none"
          />
          <path d="M0 0v3" stroke="var(--scene-wood-dark)" strokeWidth="1.6" />
          <ellipse
            cy="5.3"
            rx="2"
            ry="2.8"
            fill="#f4b867"
            stroke="#b87848"
            strokeWidth=".65"
          />
          <path d="M-.5 4v1.5" stroke="#fff3c8" strokeWidth="1" />
          <NookThread
            d="M-.7 3.6Q-2 5.5-.4 7M.7 3.8Q2 5.5.6 7"
            color="#edbb7c"
            shadow="#bb854f"
            highlight="#ffefc1"
            width={0.85}
            relief={1.6}
          />
        </g>
      ))}

      <NookThread
        d="M164 48v66M204 49q4 16 6 35"
        color={brass}
        width={0.65}
        opacity={0.72}
      />
      <g transform="translate(164 126) rotate(-9)">
        <g className="nook-halloween-bat-charm">
          <path d="M0-10v3" stroke={brass} strokeWidth="1" />
          <use href={`#${id}-velvet-bat`} />
        </g>
      </g>
      <g transform="translate(211 90) rotate(13) scale(.62)">
        <g className="nook-halloween-bat-charm nook-halloween-bat-charm-small">
          <use href={`#${id}-velvet-bat`} />
        </g>
      </g>
      <g fill={brass} stroke="none">
        <path d="m188 73 1.2 3.7 3.8 1.2-3.8 1.1-1.2 3.8-1.1-3.8-3.8-1.1 3.8-1.2Z" />
        <path
          d="m184 147.8.8 2.8 2.8.8-2.8.8-.8 2.8-.8-2.8-2.8-.8 2.8-.8Z"
          opacity=".7"
        />
      </g>
    </g>
  );
}

/** A moon-labelled potion and dripped candle turn the book stack into an apothecary. */
export function NookHalloweenAlchemy() {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-alchemy-${name})`;

  return (
    <g strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <clipPath id={`${id}-alchemy-bottle-stitches`}>
          <path d={potionOutline} />
        </clipPath>
        <clipPath id={`${id}-alchemy-label-stitches`}>
          <path d={labelOutline} />
        </clipPath>
        <clipPath id={`${id}-alchemy-wax-stitches`}>
          <path d={waxOutline} />
        </clipPath>
        <linearGradient
          id={`${id}-alchemy-glass`}
          x1="0"
          x2="1"
          y1=".2"
          y2=".8"
        >
          <stop stopColor={velvetLight} />
          <stop offset=".35" stopColor="#baa4c4" />
          <stop offset="1" stopColor={velvet} />
        </linearGradient>
        <linearGradient id={`${id}-alchemy-wax`} x2="1">
          <stop stopColor="var(--scene-pot)" />
          <stop offset=".35" stopColor={paper} />
          <stop offset="1" stopColor="#dbb77c" />
        </linearGradient>
        <radialGradient id={`${id}-alchemy-glow`}>
          <stop stopColor="#ffd38d" stopOpacity=".48" />
          <stop offset=".4" stopColor="#f0b766" stopOpacity=".18" />
          <stop offset="1" stopColor="#f0b766" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform="translate(82 409)">
        <ellipse
          cy="2"
          rx="8"
          ry="2"
          fill="var(--scene-shadow)"
          opacity=".25"
          stroke="none"
        />
        <path d="M-8-1Q0 2 8-1L6 2Q0 4-6 2Z" fill={brass} />
        <NookThread d="M-7 0Q0 3 7 0" color={brass} width={1} relief={1.4} />
        <path d={waxOutline} fill={paint("wax")} />
        <g clipPath={paint("wax-stitches")}>
          <NookThread
            d="M-4.5-27-5 0M-3-28-3.4 1M-1.5-29-1.7 1M0-29V1M1.5-29 1.7 1M3-28 3.4 1M4.5-27 5 0"
            color={paper}
            shadow="var(--scene-pot)"
            width={1.25}
            relief={1.9}
          />
        </g>
        <NookThread
          d={waxOutline}
          color="color-mix(in srgb, var(--scene-paper) 70%, var(--scene-pot))"
          shadow="var(--scene-pot)"
          width={1.1}
          relief={1.8}
        />
        <NookThread
          d={waxOutline}
          color={paper}
          width={0.55}
          dasharray=".4 1.3"
        />
        <path
          d="M-4-28Q-1-26 1-28L4-28v8q-2 2-2-1v-3q-2-2-3 1v3q-2 3-3 0Z"
          fill={paper}
          stroke="var(--scene-pot)"
          strokeWidth=".45"
        />
        <NookThread
          d="M-3-27v7M-1-27v3M1-27v3M3-27v7"
          color={paper}
          shadow="var(--scene-pot)"
          width={1.1}
          relief={1.3}
        />
        <ellipse cy="-28" rx="4" ry="1.2" fill="var(--scene-pot)" />
        <path d="M0-28v-3" stroke="var(--scene-wood-dark)" />
        <g className="nook-halloween-flame">
          <circle cy="-34" r="24" fill={paint("glow")} stroke="none" />
          <path
            d="M0-42C-1-37-5-35-3-31Q0-28 3-31C6-35 2-37 0-42Z"
            fill="#edab5e"
            stroke="none"
          />
          <path d="M0-37Q-4-31 0-30Q3-32 0-37Z" fill="#fff0bd" stroke="none" />
          <NookThread
            d="M0-39Q-3-33-1-31M1-36Q3-33 1-31"
            color="#ffd38d"
            shadow="#edab5e"
            highlight="#fff0bd"
            width={0.9}
            relief={1.2}
          />
        </g>
      </g>

      <g transform="translate(102 408)">
        <ellipse
          cy="1"
          rx="12"
          ry="2.4"
          fill="var(--scene-shadow)"
          opacity=".24"
          stroke="none"
        />
        <path d={potionOutline} fill={paint("glass")} stroke={velvet} />
        <path d="M-10-12Q0-9 10-12L9-3Q0 0-9-3Z" fill={velvet} stroke="none" />
        <g clipPath={paint("bottle-stitches")}>
          <NookThread
            d={bottleThreads}
            color={velvetLight}
            highlight="#d2b7d3"
            shadow={velvet}
            width={1.3}
            relief={1.9}
          />
          <NookThread
            d={potionThreads}
            color={velvet}
            highlight={velvetLight}
            width={1.35}
            relief={1.8}
          />
        </g>
        <NookThread
          d={potionOutline}
          color={velvet}
          highlight={velvetLight}
          width={1.35}
          relief={1.9}
        />
        <NookThread
          d={potionOutline}
          color={velvetLight}
          shadow={velvet}
          width={0.6}
          dasharray=".4 1.4"
        />
        <path
          d="M-5-33H5L4-28H-4Z"
          fill="var(--scene-wood)"
          stroke="var(--scene-wood-dark)"
          strokeWidth=".7"
        />
        <NookThread
          d="M-3-32-2.5-29M-1-32-.8-29M1-32 .8-29M3-32 2.5-29"
          color="var(--scene-wood)"
          highlight="var(--scene-wood-light)"
          width={1.1}
          relief={1.4}
        />
        <NookThread d="M-4-26H4M-4-24H4" color={brass} width={1.1} />
        <path
          d={labelOutline}
          fill={paper}
          stroke="var(--scene-wood)"
          strokeWidth=".6"
        />
        <g clipPath={paint("label-stitches")}>
          <NookThread
            d={labelThreads}
            color={paper}
            shadow="var(--scene-pot)"
            width={1.2}
            relief={1.9}
          />
        </g>
        <NookThread
          d={labelOutline}
          color="color-mix(in srgb, var(--scene-paper) 70%, var(--scene-pot))"
          shadow="var(--scene-pot)"
          width={1}
          relief={1.8}
        />
        <NookThread
          d={labelOutline}
          color={paper}
          width={0.55}
          dasharray=".4 1.2"
        />
        <path
          d="M1-15C-4-13-3-8 1-7C-6-6-7-16 1-15Z"
          fill={velvet}
          stroke="none"
        />
        <NookThread
          d="M-1-14Q-5-10-1-8"
          color={velvet}
          highlight={velvetLight}
          width={1.5}
          relief={1.5}
        />
        <path d="M3-13v3m-1.5-1.5h3" stroke={velvetLight} strokeWidth=".8" />
        <path
          d="M-7-19q-3 2-3 5M-2-29v2"
          stroke={paper}
          strokeWidth="1.2"
          opacity=".7"
        />
        <path d="M6-23q6 3 7 9" fill="none" stroke={brass} strokeWidth=".65" />
        <path
          d="m11-15 5 1-1 6-5-1Z"
          fill="var(--scene-pumpkin-light, #efbd79)"
          stroke="var(--scene-wood)"
          strokeWidth=".55"
        />
        <NookThread
          d="m12-13 2 .4m-2.4 1.3 2 .4m-2.4 1.3 2 .4"
          color="var(--scene-pumpkin-light, #efbd79)"
          shadow="var(--scene-wood)"
          width={0.95}
          relief={1.4}
        />
      </g>
    </g>
  );
}

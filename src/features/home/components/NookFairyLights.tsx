import { useId } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import { NookStringBulb, NookStringBulbDefs } from "./NookStringBulb";
import { NookThread } from "./NookThread";
import "../nook-lights.css";

type Charm =
  | "pumpkin"
  | "ghost"
  | "star"
  | "bow"
  | "pine"
  | "heart"
  | "blossom"
  | "egg"
  | "lantern"
  | "shell"
  | "coin";

const holidayCharms: Record<SeasonalEventId, readonly [Charm, Charm, Charm]> = {
  "all-saints-wake": ["pumpkin", "ghost", "pumpkin"],
  starlight: ["star", "bow", "pine"],
  heavensturn: ["lantern", "coin", "lantern"],
  valentiones: ["heart", "bow", "heart"],
  "little-ladies": ["blossom", "lantern", "blossom"],
  "hatching-tide": ["egg", "blossom", "egg"],
  "make-it-rain": ["coin", "bow", "coin"],
  "moonfire-faire": ["lantern", "shell", "lantern"],
  "the-rising": ["star", "lantern", "star"],
};

const ink = "var(--scene-ink, #71594d)";
const paper = "var(--scene-paper, #fff4dd)";
const gold = "var(--scene-gold, #dcb878)";
const ribbon = "var(--season-ribbon, var(--scene-rose, #bc8587))";
const primary = "var(--scene-primary, var(--scene-rose, #dba3a0))";
const cord = "M0 12C275 151 672 134 1000 15";
// Sample both axes of the same cubic. The wall can stretch without distorting
// the glass or pulling the sockets away from the gently asymmetric cord.
const cordPoint = (t: number) => {
  const u = 1 - t;
  return {
    left: `${(3 * u * u * t * 275 + 3 * u * t * t * 672 + t ** 3 * 1000) / 10}%`,
    top: `${((u ** 3 * 12 + 3 * u * u * t * 151 + 3 * u * t * t * 134 + t ** 3 * 15) / 140) * 100}%`,
  };
};
const bulbs = [
  [0.025, 8, -4],
  [0.089, 12, 3],
  [0.152, 7, -2],
  [0.218, 14, 4],
  [0.281, 10, -3],
  [0.354, 7, 2],
  [0.42, 13, -2],
  [0.489, 9, 3],
  [0.558, 15, -3],
  [0.629, 8, 2],
  [0.697, 12, -4],
  [0.765, 7, 3],
  [0.832, 13, -2],
  [0.898, 9, 4],
  [0.97, 11, -3],
] as const;

const pumpkinShape =
  "M0 6C-13 1-16 17-9 22Q-5 26 0 24C7 27 14 21 13 13Q12 2 0 6Z";
const ghostShape =
  "M-8 11C-9-3 10-2 9 11L12 23Q8 26 5 21Q1 27-3 22Q-7 26-11 23Z";
const batShape =
  "M-1 8-2 5 0 6 2 5 1 8Q5 9 9 5L8 12Q4 10 2 14L0 13-2 14Q-4 10-8 12L-9 5Q-5 9-1 8Z";
const pumpkinFloss =
  "M-11 3C-17 10-16 21-9 27M-9 3C-15 10-14 21-7 27M-7 3C-13 10-12 21-5 27M-5 3C-11 10-10 21-3 27M-3 3C-9 10-8 21-1 27M-1 3C-7 10-6 21 1 27M0 4C-4 10-4 21 1 27M1 4C-1 10-1 21 1 27M2 4C2 10 2 21 1 27M3 4C5 10 5 21 1 27M4 4C8 10 8 21 2 27M6 3C11 10 11 21 4 27M8 3C14 10 14 21 6 27M10 3C17 10 17 21 8 27M12 3C20 10 20 21 10 27";
const ghostFloss = Array.from({ length: 15 }, (_, index) => {
  const x = -11.9 + index * 1.7;
  return `M${x * 0.68} -3C${x * 0.68} 8 ${x * 0.87} 16 ${x} 27`;
}).join(" ");

/** The filling is sewn before the face, so even tiny eyes stay easy to read. */
function HalloweenCharmFill({
  kind,
  alternate,
}: {
  kind: "pumpkin" | "ghost";
  alternate: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const isPumpkin = kind === "pumpkin";
  return (
    <g strokeOpacity="1">
      <defs>
        <clipPath id={`${id}-felt`}>
          <path d={isPumpkin ? pumpkinShape : ghostShape} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-felt)`}>
        <NookThread
          d={isPumpkin ? pumpkinFloss : ghostFloss}
          color={isPumpkin ? (alternate ? "#d3a365" : "#e4a365") : paper}
          shadow={isPumpkin ? "#a56743" : "var(--scene-pot, #c3a184)"}
          highlight={isPumpkin ? "#f6cd94" : "#fff9e9"}
          width={1.32}
          relief={1.65}
        />
      </g>
    </g>
  );
}

/** Sparse, raised stitches stay legible on these tiny felt ornaments. */
function CharmEmbroidery({
  kind,
  alternate,
}: {
  kind: Charm;
  alternate: boolean;
}) {
  if (kind === "pumpkin" || kind === "ghost") {
    const isPumpkin = kind === "pumpkin";
    return (
      <g strokeOpacity="1">
        <NookThread
          d={
            isPumpkin
              ? "M-1 6C-11 3-15 15-9 21Q-5 25 0 23Q11 26 12 15Q12 5 3 6"
              : "M-7 10C-8-1 9-1 8 10L10 22Q7 24 5 20Q1 25-3 21Q-7 24-10 22Z"
          }
          color={isPumpkin ? "#b9804c" : "var(--scene-pot, #c3a184)"}
          shadow={isPumpkin ? "#8c553d" : "var(--scene-wood, #a17b53)"}
          highlight={isPumpkin ? "#f9cf93" : "#fff7e1"}
          width={0.9}
          dasharray=".85 1.1"
          relief={1.6}
        />
        {isPumpkin ? (
          <NookThread
            d="M0 1Q-2 2 .7 5"
            color={alternate ? "#b78754" : "#c08651"}
            shadow="#985d3f"
            highlight="#f2c17f"
            width={0.7}
            relief={1.25}
          />
        ) : (
          <NookThread
            d="M-8 20Q-6 24-3 20Q1 25 5 19Q8 24 10 22"
            color={paper}
            shadow="var(--scene-pot, #c3a184)"
            highlight="#fff9e9"
            width={0.85}
            relief={1.3}
            dasharray=".7 1"
          />
        )}
      </g>
    );
  }
  const stitches: Record<
    Exclude<Charm, "pumpkin" | "ghost">,
    { d: string; color: string; seam: string }
  > = {
    star: {
      d: "M0 5 0 12M-2 8-1 13M2 8 1 13M-9 11-2 14M9 11 2 14M-4 17-5 21M-2 16-2 20M4 17 5 21M2 16 2 20",
      color: gold,
      seam: "M0 3 3 10 10 11 5 16 6 22 0 19-6 22-5 16-10 11-3 10Z",
    },
    bow: {
      d: "M-4 10Q-10 2-11 7M-4 12Q-10 8-11 12M4 10Q10 2 11 7M4 12Q10 8 11 12M-2 15-4 21M0 15-1 22M5 14 8 21M7 13 10 18M-1 9v3M1 9v3",
      color: ribbon,
      seam: "M-3 9C-15-2-15 18-3 12M3 9C15-2 15 18 3 12M-5 16-6 22M6 15 9 22",
    },
    pine: {
      d: "M0 5-3 9M1 6 4 9M0 11-6 15M1 12 6 16M-1 18-8 22M1 18 8 22M-1 14-3 16M2 19 4 21",
      color: "var(--scene-leaf, #899b78)",
      seam: "M0 3 5 9 2 9 8 16 4 16 10 22Q0 24-10 22L-4 16H-8L-2 9H-5Z",
    },
    heart: {
      d: "M-9 7Q-5 4-2 10M-10 10-2 16M-8 14 0 21M9 6Q5 5 2 11M10 9 2 17M8 14 2 21",
      color: primary,
      seam: "M0 9C-5-1-15 5-10 13Q-7 18 0 23Q8 18 11 11C14 3 5 2 0 9Z",
    },
    blossom: {
      d: "M-2 5-1 10M2 5 1 10M8 9 4 12M10 12 5 14M7 20 3 17M4 23 1 18M-6 22-2 18M-9 19-4 16M-10 11-5 13M-7 8-4 11",
      color: primary,
      seam: "M-3 4 0 6 3 4M8 7 6 11 10 12M9 19 5 18 5 22M-3 24-3 20-7 21M-11 14-7 14-9 10",
    },
    egg: {
      d: "M-2 4-5 10M1 4 1 10M4 6 6 11M-8 20-6 24M-3 21-2 25M2 21 2 25M7 20 5 24",
      color: paper,
      seam: "M0 2C-5 2-9 13-9 18C-9 28 9 28 9 18C9 13 5 2 0 2Z",
    },
    lantern: {
      d: "M-6 7Q-10 13-6 20M-3 7Q-6 13-3 20M0 7V20M3 7Q6 13 3 20M6 7Q10 13 6 20",
      color: alternate ? primary : ribbon,
      seam: "M-5 6Q-12 9-9 18L-5 21H5Q12 18 9 10L5 6ZM-3 23H3",
    },
    shell: {
      d: "M-10 9-4 20M-6 6-2 19M-2 5 0 19M5 5 2 19M9 10 4 20M12 12 6 19",
      color: paper,
      seam: "M-3 23-11 12Q-14 6-6 8Q-6 0 2 6Q7 1 8 9Q15 8 11 15L3 23",
    },
    coin: {
      d: "M-4 6-6 9M-7 11v4M-6 18-3 20M0 20h3M6 18 7 15M7 11 5 7M1 5h-2",
      color: gold,
      seam: "M0 4a9 9 0 1 1 0 18a9 9 0 1 1 0-18ZM-3 10H3V16H-3Z",
    },
  };
  const { d, color, seam } = stitches[kind];

  return (
    <g strokeOpacity="1">
      <NookThread d={d} color={color} width={1.15} relief={1.25} />
      <NookThread
        d={seam}
        color={color}
        width={0.75}
        dasharray="1 1.45"
        relief={1.15}
      />
    </g>
  );
}

/** Each small felt shape hangs from (0, 0), inside a 27 × 26 box. */
function Ornament({ kind, alternate }: { kind: Charm; alternate: boolean }) {
  switch (kind) {
    case "pumpkin":
      return (
        <>
          <path d="M-1 5Q-3 1 1 0L3 1Q0 2 2 6" fill={ribbon} />
          <path d={pumpkinShape} fill={alternate ? "#d3a365" : "#e4a365"} />
          <HalloweenCharmFill kind="pumpkin" alternate={alternate} />
          <g strokeOpacity="1">
            <NookThread
              d="M0 6C-7 6-8 21 0 24M1 6C7 7 8 20 2 24"
              color={alternate ? "#b78754" : "#c08651"}
              shadow="#985d3f"
              highlight="#f2c17f"
              width={0.7}
              relief={1.25}
            />
          </g>
          <path
            d="M-10 18Q-8 24 0 24Q10 25 12 17Q7 22 0 21Q-6 22-10 18Z"
            fill={ink}
            fillOpacity=".1"
            stroke="none"
          />
          <path
            d="M-9 9Q-12 12-10 15"
            fill="none"
            stroke={paper}
            strokeOpacity=".7"
            strokeWidth="1.4"
          />
          <g strokeOpacity="1">
            <NookThread
              d="M-7 13Q-5 10-3 13M3 13Q5 10 7 13M-4 17Q0 21 4 17"
              color={ink}
              shadow="#714736"
              highlight="#bc875c"
              width={1.05}
              relief={1.15}
            />
          </g>
          <path d="M-1 19V17H1V19" fill={paper} stroke="none" />
          <circle
            cx="-8"
            cy="16"
            r="1.2"
            fill="#c4746f"
            fillOpacity=".6"
            stroke="none"
          />
          <circle
            cx="8"
            cy="16"
            r="1.2"
            fill="#c4746f"
            fillOpacity=".6"
            stroke="none"
          />
        </>
      );
    case "ghost":
      return (
        <>
          <path d={ghostShape} fill={paper} />
          <HalloweenCharmFill kind="ghost" alternate={alternate} />
          <path
            d="M6 5Q9 11 9 20L6 21Q9 26 12 23L9 11Q9 7 6 5Z"
            fill={ribbon}
            fillOpacity=".18"
            stroke="none"
          />
          <path
            d="M-5 4Q-8 7-7 10"
            fill="none"
            stroke="#fffaf0"
            strokeWidth="1.4"
          />
          <g strokeOpacity="1">
            <NookThread
              d="M-4 12v1M4 12v1M-2 16Q0 18 2 16"
              color={ink}
              shadow="var(--scene-wood-dark, #71543c)"
              highlight="var(--scene-wood-light, #cfb189)"
              width={1.15}
              relief={1.15}
            />
          </g>
          <circle
            cx="-6"
            cy="15"
            r="1.3"
            fill={ribbon}
            fillOpacity=".4"
            stroke="none"
          />
          <circle
            cx="6"
            cy="15"
            r="1.3"
            fill={ribbon}
            fillOpacity=".4"
            stroke="none"
          />
          <path
            d="M-2 8-6 5-6 9ZM1 8 5 5 5 9Z"
            fill="#a98caa"
            strokeWidth=".5"
          />
          <circle cy="8" r="1.2" fill="#bea1b4" strokeWidth=".5" />
          <g strokeOpacity="1">
            <NookThread
              d="M-5.4 5.8-2.5 7.7M-5.7 7.4-3.5 8.2M4.4 5.9 1.8 7.6M4.6 7.5 2.6 8.2M-.5 7.4v1"
              color="#a98caa"
              shadow="#715771"
              highlight="#d5b7cf"
              width={0.75}
              relief={1.4}
            />
          </g>
        </>
      );
    case "star":
      return (
        <>
          <path
            d="M0 2 4 9 12 10 6 16 7 24 0 20-7 24-6 16-12 10-4 9Z"
            fill={gold}
          />
          <path
            d="M0 4 1 13 10 11M1 13 0 20M1 13-6 22"
            fill="none"
            stroke={paper}
            strokeOpacity=".55"
            strokeWidth=".8"
          />
          <path
            d="m1 13 5 3 1 8-7-4Z"
            fill={ink}
            fillOpacity=".09"
            stroke="none"
          />
          <circle cy="3" r=".8" fill={paper} stroke="none" />
        </>
      );
    case "bow":
      return (
        <>
          <path
            d="M-3 11-7 25-2 22 1 25 3 12M3 11 8 24 10 20 13 21 6 9"
            fill={ribbon}
          />
          <path d="M0 10C-20-6-14 21 0 12C17 21 17-7 0 10Z" fill={ribbon} />
          <path
            d="M-3 10Q-8 4-11 5M3 10Q9 4 11 5M-3 15-5 21"
            fill="none"
            stroke={paper}
            strokeOpacity=".45"
            strokeWidth="1"
          />
          <path d="m-11 14 8-3M10 14 3 11" fill="none" strokeOpacity=".25" />
          <path d="M-3 8Q0 7 3 8L3 13Q0 14-3 13Z" fill={primary} />
        </>
      );
    case "pine":
      return (
        <>
          <path d="M-2 19H2V26H-2Z" fill={gold} />
          <path
            d="M0 1 7 10 4 10 10 17 6 17 12 23Q0 26-12 23L-6 17H-10L-4 10H-7Z"
            fill="var(--scene-leaf, #899b78)"
          />
          <path
            d="M0 5-4 10M1 13-5 16M1 20-7 22"
            fill="none"
            stroke={paper}
            strokeOpacity=".55"
          />
          <path
            d="M1 4 7 10H4L10 17H6L12 23 1 24Z"
            fill={ink}
            fillOpacity=".1"
            stroke="none"
          />
          <circle cx="3" cy="15" r="1.3" fill={gold} stroke="none" />
          <circle cx="-4" cy="20" r="1.3" fill={ribbon} stroke="none" />
        </>
      );
    case "heart":
      return (
        <>
          <path
            d="M0 7C-5-3-17 5-11 14Q-7 20 0 25Q8 20 12 12C16 2 4 0 0 7Z"
            fill={primary}
          />
          <path
            d="M10 6Q14 15 0 25L-3 22Q9 15 10 6Z"
            fill={ink}
            fillOpacity=".1"
            stroke="none"
          />
          <path
            d="M-4 5Q-10 3-10 9"
            fill="none"
            stroke={paper}
            strokeOpacity=".7"
            strokeWidth="1.3"
          />
          <path
            d="m-6 14 1 2m3 2 1 1m5-3 1-2"
            fill="none"
            stroke={paper}
            strokeOpacity=".55"
            strokeWidth=".7"
          />
        </>
      );
    case "blossom":
      return (
        <>
          {[0, 72, 144, 216, 288].map((angle) => (
            <g key={angle} transform={`rotate(${angle} 0 14)`}>
              <path
                d="M0 14C-8 12-8 4-3 3L0 5 3 3C8 4 8 12 0 14Z"
                fill={primary}
              />
              <path
                d="M0 11 1 7"
                fill="none"
                stroke={paper}
                strokeOpacity=".6"
              />
            </g>
          ))}
          <circle cy="14" r="3" fill={gold} strokeWidth=".6" />
          <path d="M-1 13v1m2 1h.2" stroke={paper} strokeWidth="1.2" />
        </>
      );
    case "egg":
      return (
        <>
          <path
            d="M0 1C-6 1-10 12-10 18C-10 29 10 29 10 18C10 12 6 1 0 1Z"
            fill={paper}
          />
          <path
            d="M-9 15Q0 11 9 15L10 19Q0 15-10 19Z"
            fill={primary}
            stroke="none"
          />
          <path
            d="M-7 22 0 19 7 22"
            fill="none"
            stroke={ribbon}
            strokeWidth="1"
          />
          <path
            d="M4 3Q13 18 6 24Q0 28-5 25C10 28 9 11 4 3Z"
            fill={ink}
            fillOpacity=".09"
            stroke="none"
          />
          <circle cx="-3" cy="9" r="1.3" fill={gold} stroke="none" />
          <circle cx="4" cy="10" r="1.1" fill={primary} stroke="none" />
          <path
            d="M-3 4Q-6 7-6 10"
            fill="none"
            stroke="#fffaf2"
            strokeWidth="1.3"
          />
        </>
      );
    case "lantern":
      return (
        <>
          <path d="M-4 2H4L5 5H-5Z" fill={gold} />
          <path
            d="M-5 5C-14 8-12 20-5 22H5C12 20 14 8 5 5Z"
            fill={alternate ? primary : ribbon}
          />
          <path
            d="M-3 6Q-7 13-3 21M3 6Q7 13 3 21M-10 11H10M-10 17H10"
            fill="none"
            stroke={paper}
            strokeOpacity=".45"
            strokeWidth=".6"
          />
          <path
            d="M6 6Q15 17 5 22H1Q9 17 6 6Z"
            fill={ink}
            fillOpacity=".13"
            stroke="none"
          />
          <path d="M-4 22H4V24H-4Z" fill={gold} />
          <path d="M0 24v2m-2-1v1m4-1v1" stroke={ribbon} strokeWidth=".8" />
        </>
      );
    case "shell":
      return (
        <>
          <path
            d="M-3 24-12 13C-15 8-10 4-6 7C-7 1 0 0 2 5C5 0 12 4 9 8C15 7 16 13 11 17L3 24Z"
            fill={paper}
          />
          <path
            d="M-3 22-8 10M0 22-1 7M2 22 6 9M4 22 11 13"
            fill="none"
            stroke={primary}
            strokeWidth="1.1"
          />
          <path d="M-4 22Q0 20 4 22L3 25H-3Z" fill={primary} />
          <path d="M-10 8-10 10M3 5 4 5" stroke="#fffaf2" strokeWidth="1.3" />
        </>
      );
    case "coin":
      return (
        <>
          <circle cy="13" r="10.5" fill={gold} />
          <circle
            cy="13"
            r="8.2"
            fill="none"
            stroke={paper}
            strokeOpacity=".6"
            strokeWidth=".8"
          />
          <path d="M-3 10H3V16H-3Z" fill={paper} />
          <path
            d="M7 6Q16 19 1 23"
            fill="none"
            stroke={ink}
            strokeOpacity=".18"
            strokeWidth="1.5"
          />
          <path
            d="M-5 6-7 8M-6 18-4 20M6 9l1 2M0 5h1"
            fill="none"
            stroke={paper}
            strokeWidth="1.1"
          />
          <path d="M-2 24v2m4-2v2" stroke={ribbon} strokeWidth="1.2" />
        </>
      );
  }
}

export function NookFairyLights({
  eventId,
}: {
  eventId?: SeasonalEventId | null;
}) {
  const id = useId().replace(/:/g, "");
  const ornaments = eventId ? holidayCharms[eventId] : null;

  return (
    <div className="nook-lights" aria-hidden="true">
      <div className="nook-light-wall-wash" />
      <svg
        className="nook-light-strand"
        viewBox="0 0 1000 140"
        preserveAspectRatio="none"
        focusable="false"
      >
        <NookStringBulbDefs id={`${id}-bulb`} />
        <path
          className="nook-light-cord nook-light-cord--shadow"
          d={cord}
          transform="translate(0 3)"
        />
        <path className="nook-light-cord" d={cord} />
        <path
          className="nook-light-cord nook-light-cord--glint"
          d={cord}
          transform="translate(0 -.6)"
        />
      </svg>
      {(["left", "right"] as const).map((side) => (
        <svg
          key={side}
          className={`nook-light-anchor nook-light-anchor--${side}`}
          viewBox="0 0 15 17"
          focusable="false"
          fill="none"
          style={{
            top:
              side === "left" ? `${(12 / 140) * 100}%` : `${(15 / 140) * 100}%`,
          }}
        >
          <path
            d="M0 4h7q4 0 4 4.5T7 13H0Z"
            fill="var(--scene-shadow)"
            opacity=".18"
            transform="translate(1 1)"
          />
          <path
            d="M0 3h6q4 0 4 5.5T6 14H0"
            fill="var(--scene-brass)"
            stroke="var(--scene-wood-dark)"
            strokeWidth=".8"
          />
          <path
            d="M1 4h5q2.5 0 3 3"
            stroke="var(--scene-gold)"
            strokeWidth=".8"
            opacity=".65"
          />
          <circle
            cx="4"
            cy="8.5"
            r="1.8"
            fill="var(--scene-gold)"
            stroke="var(--scene-brass)"
            strokeWidth=".7"
          />
          <path
            d="M3 8.5h2M0 8.5h6q4 0 7 1"
            stroke="var(--scene-wood-light)"
            strokeWidth=".85"
            strokeLinecap="round"
          />
        </svg>
      ))}
      {bulbs.map(([position, drop, tilt], index) => {
        return (
          <svg
            key={index}
            className="nook-light-hanger nook-light-hanger--bulb"
            viewBox="-12 0 24 48"
            preserveAspectRatio="xMidYMin meet"
            focusable="false"
            style={cordPoint(position)}
          >
            <ellipse className="nook-light-clip" cy=".2" rx="2.1" ry="1.4" />
            <g transform={`rotate(${tilt})`}>
              <path
                className="nook-light-cord nook-light-drop"
                d={`M0 0C1 ${drop * 0.25} -1 ${drop * 0.65} 0 ${drop + 1}`}
              />
              <g transform={`translate(0 ${drop})`}>
                <NookStringBulb id={`${id}-bulb`} variant={index % 3} />
              </g>
            </g>
          </svg>
        );
      })}
      {ornaments?.map((kind, index) => {
        const position = [0.185, 0.524, 0.865][index];
        return (
          <svg
            key={`${eventId}-${index}`}
            className="nook-light-hanger nook-light-hanger--charm"
            viewBox="-17 0 34 54"
            preserveAspectRatio="xMidYMin meet"
            focusable="false"
            style={cordPoint(position)}
          >
            <g
              className="nook-light-ornament"
              style={{ animationDelay: `${index * -1.7}s` }}
            >
              <path
                className="nook-light-cord nook-light-charm-tie"
                d="M0 0v21"
              />
              <g
                transform="translate(0 21)"
                stroke={ink}
                strokeWidth=".8"
                strokeOpacity=".6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Ornament kind={kind} alternate={index === 2} />
                <CharmEmbroidery kind={kind} alternate={index === 2} />
              </g>
            </g>
          </svg>
        );
      })}
      {eventId === "all-saints-wake" &&
        [0.319, 0.663].map((position, index) => (
          <svg
            key={position}
            className="nook-light-hanger nook-light-hanger--bat"
            viewBox="-12 0 24 18"
            preserveAspectRatio="xMidYMin meet"
            focusable="false"
            style={cordPoint(position)}
          >
            <defs>
              <clipPath id={`${id}-bat-felt-${index}`}>
                <path d={batShape} />
              </clipPath>
            </defs>
            <g
              className="nook-light-ornament"
              style={{ animationDelay: `${-2.1 - index}s` }}
            >
              <path className="nook-light-cord" d="M0 0v5" />
              <path
                d={batShape}
                fill="#8d748e"
                stroke={ink}
                strokeOpacity=".5"
                strokeWidth=".65"
                strokeLinejoin="round"
              />
              <g clipPath={`url(#${id}-bat-felt-${index})`}>
                <NookThread
                  d="M-1 7-10 4M-1 8-10 6M-1 9-10 8M-1 10-10 10M-1 11-9 12M-1 12-7 14M1 7 10 4M1 8 10 6M1 9 10 8M1 10 10 10M1 11 9 12M1 12 7 14"
                  color="#8d748e"
                  shadow="#5d4867"
                  highlight="#bea3bf"
                  width={0.95}
                  relief={1.5}
                />
              </g>
              <NookThread
                d={batShape}
                color="#a086a3"
                shadow="#604b69"
                highlight="#d0b8ce"
                width={0.6}
                dasharray=".65 .85"
                relief={1.4}
              />
              <NookThread
                d="M-.65 6.5-.7 12M.7 6.5 .7 12"
                color="#78617f"
                shadow="#5d4867"
                highlight="#b99bb9"
                width={0.9}
                relief={1.35}
              />
            </g>
          </svg>
        ))}
    </div>
  );
}

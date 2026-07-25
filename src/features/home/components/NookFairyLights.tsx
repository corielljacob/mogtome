import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
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
// The cord may change its width and sag independently. Each hanging SVG keeps
// its own aspect ratio, anchored to this same quadratic in percentage space.
const cordHeight = (x: number) => 10 + 290 * (x / 1000) * (1 - x / 1000);

/** Each small cut-paper shape hangs from (0, 0), inside a 27 × 26 box. */
function Ornament({ kind, alternate }: { kind: Charm; alternate: boolean }) {
  switch (kind) {
    case "pumpkin":
      return (
        <>
          <path d="M-1 5Q-3 1 1 0L3 1Q0 2 2 6" fill={ribbon} />
          <path
            d="M0 6C-13 1-16 17-9 22Q-5 26 0 24C7 27 14 21 13 13Q12 2 0 6Z"
            fill={alternate ? "#d3a365" : "#e4a365"}
          />
          <path
            d="M0 6C-7 6-8 21 0 24M1 6C7 7 8 20 2 24"
            fill="none"
            strokeOpacity=".3"
          />
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
          <path
            d="M-7 13Q-5 10-3 13M3 13Q5 10 7 13M-4 17Q0 21 4 17"
            fill="none"
            stroke={ink}
            strokeOpacity=".85"
            strokeWidth="1.15"
          />
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
          <path
            d="M-8 11C-9-3 10-2 9 11L12 23Q8 26 5 21Q1 27-3 22Q-7 26-11 23Z"
            fill={paper}
          />
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
          <path
            d="M-4 12v1M4 12v1M-2 16Q0 18 2 16"
            fill="none"
            stroke={ink}
            strokeOpacity=".85"
            strokeWidth="1.3"
          />
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
  const ornaments = eventId ? holidayCharms[eventId] : null;

  return (
    <div className="nook-lights" aria-hidden="true">
      <svg
        className="nook-light-strand"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path
          className="nook-light-cord nook-light-cord--shadow"
          d="M0 10 Q500 155 1000 10"
          transform="translate(0 1)"
        />
        <path className="nook-light-cord" d="M0 10 Q500 155 1000 10" />
      </svg>
      {(["left", "right"] as const).map((side) => (
        <svg
          key={side}
          className={`nook-light-anchor nook-light-anchor--${side}`}
          viewBox="0 0 15 17"
          focusable="false"
          fill="none"
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
      {Array.from({ length: 16 }, (_, index) => {
        const x = ((index + 0.5) / 16) * 1000;
        return (
          <svg
            key={index}
            className="nook-light-hanger nook-light-hanger--bulb"
            viewBox="-6 0 12 19"
            preserveAspectRatio="xMidYMin meet"
            focusable="false"
            style={{ left: `${x / 10}%`, top: `${cordHeight(x)}%` }}
          >
            <path className="nook-light-cord" d="M0 0v7" />
            <g
              className="nook-fairy-light"
              style={{ animationDelay: `${index * -1.3}s` }}
            >
              <ellipse
                className="nook-light-bulb"
                cx="0"
                cy="11"
                rx="3.3"
                ry="5"
              />
            </g>
          </svg>
        );
      })}
      {ornaments?.map((kind, index) => {
        const x = [160, 500, 840][index];
        return (
          <svg
            key={`${eventId}-${index}`}
            className="nook-light-hanger nook-light-hanger--charm"
            viewBox="-17 0 34 36"
            preserveAspectRatio="xMidYMin meet"
            focusable="false"
            style={{ left: `${x / 10}%`, top: `${cordHeight(x)}%` }}
          >
            <g
              className="nook-light-ornament"
              style={{ animationDelay: `${index * -1.7}s` }}
            >
              <path className="nook-light-cord" d="M0 0v6" />
              <g
                transform="translate(0 6)"
                stroke={ink}
                strokeWidth=".8"
                strokeOpacity=".6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Ornament kind={kind} alternate={index === 2} />
              </g>
            </g>
          </svg>
        );
      })}
      {eventId === "all-saints-wake" &&
        [330, 670].map((x, index) => (
          <svg
            key={x}
            className="nook-light-hanger nook-light-hanger--bat"
            viewBox="-12 0 24 18"
            preserveAspectRatio="xMidYMin meet"
            focusable="false"
            style={{ left: `${x / 10}%`, top: `${cordHeight(x)}%` }}
          >
            <g
              className="nook-light-ornament"
              style={{ animationDelay: `${-2.1 - index}s` }}
            >
              <path className="nook-light-cord" d="M0 0v5" />
              <path
                d="M-1 8-2 5 0 6 2 5 1 8Q5 9 9 5L8 12Q4 10 2 14L0 13-2 14Q-4 10-8 12L-9 5Q-5 9-1 8Z"
                fill="#8d748e"
                stroke={ink}
                strokeOpacity=".5"
                strokeWidth=".65"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        ))}
    </div>
  );
}

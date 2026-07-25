import { NookHalloweenDecor } from "./NookHalloweenDecor";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";

interface NookSeasonalDecorProps {
  eventId?: SeasonalEventId | null;
}

const ink = "var(--scene-ink)";
const leaf = "var(--scene-leaf)";
const leafLight = "var(--scene-leaf-light)";
const paper = "var(--scene-paper)";
const rose = "var(--scene-rose)";
const gold = "var(--scene-gold)";
const wood = "var(--scene-wood)";

function Blossom({ x = 0, y = 0, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={rose}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 0 4)`}>
          <path d="M0 4C-7 0-10-6-6-10Q-3-13 0-10Q3-13 6-10C10-6 7 0 0 4Z" />
          <path d="M0 2V-4" fill="none" opacity=".25" />
        </g>
      ))}
      <circle cy="4" r="2.4" fill={gold} stroke="none" />
    </g>
  );
}

function Gift({ x = 0, y = 0, scale = 1, color = rose }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-15-25 15-26 14 0H-14Z" fill={color} />
      <path d="M-16-26 16-27 17-21-16-20Z" fill={paper} />
      <path d="M-2-26H3V0H-2Z" fill={gold} stroke="none" />
      <path d="M0-27C-16-27-11-42-3-31L0-27C12-42 18-28 0-27Z" fill={paper} />
      <path d="M-11-16V-4H-7" fill="none" stroke={paper} opacity=".45" />
    </g>
  );
}

function FlowerPot({ x = 0, y = 0, blossom = false }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0-15Q-6-34-3-45M0-16Q7-35 12-38" fill="none" stroke={leaf} />
      <path
        d="M-2-30C-15-27-17-37-16-40Q-4-39-2-30ZM4-26C17-24 20-33 18-35Q7-35 4-26Z"
        fill={leafLight}
        stroke={leaf}
      />
      {blossom ? (
        <>
          <Blossom x={-3} y={-46} scale={0.54} />
          <Blossom x={12} y={-40} scale={0.4} />
        </>
      ) : (
        <path
          d="M-3-42C-9-46-7-55-3-58Q3-52-3-42Z"
          fill={leafLight}
          stroke={leaf}
        />
      )}
      <path d="M-11-19 11-20 8-2Q0 1-8-2Z" fill={paper} />
      <path d="M-12-21 12-22 12-17-12-16Z" fill={rose} />
      <path d="M-5-13-4-5" fill="none" stroke={wood} opacity=".45" />
    </g>
  );
}

/** Decorations share the room's drawing scale and three permanent anchor points. */
export function NookSeasonalDecor({ eventId }: NookSeasonalDecorProps) {
  if (!eventId) return null;
  if (eventId === "all-saints-wake") return <NookHalloweenDecor />;

  return (
    <g
      className="nook-seasonal-decor"
      data-event={eventId}
      aria-hidden="true"
      fill={paper}
      stroke={ink}
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M296 104Q294 131 296 155" fill="none" stroke={wood} />
      <path d="M293 157Q296 153 299 157" fill="none" />

      {eventId === "starlight" && (
        <>
          <g fill={leaf} stroke={leaf}>
            <path
              d="M83 62Q132 40 178 61T268 57Q301 49 329 68"
              fill="none"
              strokeWidth="2"
            />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <g
                key={i}
                transform={`translate(${92 + i * 25} ${57 + Math.sin(i * 0.9) * 9}) rotate(${i % 2 ? 15 : -9})`}
              >
                <path d="M0 1Q-4-7-12-8L-8-3-15-4-9 1-15 2Q-8 6 0 1Z" />
                <path
                  d="M0 1Q3 12 12 14L9 9 15 10 10 5 16 5Q9 0 0 1Z"
                  fill={leafLight}
                />
              </g>
            ))}
          </g>
          <g transform="translate(296 178)">
            <path
              d="M-1-10C-10-25-24-17-21-5Q-9-5-1 1M1-10C10-25 24-17 21-5Q9-5 1 1"
              fill={rose}
            />
            <path
              d="M-4-2-13 17-5 14-1 20 3 0M3-1 13 14 18 10 13 6Z"
              fill={rose}
            />
            <path
              d="M-12 0-17 4-15 10-21 9-25 14-25 7-30 5-25 1-26-4Q-18-7-12 0ZM10 1 15 4 15 10 21 8 26 12 25 5 30 2 24-1 24-7Q16-6 10 1Z"
              fill={leaf}
            />
            <circle cx="-3" cy="-3" r="3.2" fill={gold} />
            <circle cx="3" cy="-2" r="3.5" fill={gold} />
          </g>
          <Gift x={35} y={434} scale={0.88} />
          <Gift x={403} y={434} scale={0.68} color={leafLight} />
          <Gift x={381} y={434} scale={0.55} />
        </>
      )}

      {eventId === "valentiones" && (
        <>
          <g transform="translate(296 176) rotate(-5)">
            <path
              d="M0-9C-8-22-25-10-17 2Q-11 11 0 20Q14 10 19 0C25-14 8-21 0-9Z"
              fill={rose}
            />
            <path
              d="M-12-7Q-16-3-10 3"
              fill="none"
              stroke={paper}
              strokeWidth="2.2"
              opacity=".75"
            />
            <path d="M-2 20-5 29 0 27 4 30 3 21" fill={gold} />
          </g>
          <FlowerPot x={37} y={435} blossom />
          <g transform="translate(398 426) rotate(-7)">
            <path d="M-18-14 17-14 17 7-18 7Z" />
            <path
              d="m-18-14 18 13 17-13M-18 7-6-5M17 7 6-5"
              fill="none"
              stroke={wood}
            />
            <path d="M0-1C-4-7-10-1-6 3L0 8 6 3C11-2 4-7 0-1Z" fill={rose} />
          </g>
        </>
      )}

      {eventId === "little-ladies" && (
        <>
          <Blossom x={296} y={173} scale={1.65} />
          <path
            d="M296 193Q296 205 292 211M292 211 289 218M292 211 293 219M292 211 297 217"
            fill="none"
            stroke={gold}
            strokeWidth="1.8"
          />
          <FlowerPot x={37} y={435} blossom />
          <FlowerPot x={399} y={435} blossom />
          <path d="M88 69Q110 46 137 48" fill="none" stroke={wood} />
          <Blossom x={108} y={54} scale={0.58} />
          <Blossom x={130} y={47} scale={0.43} />
        </>
      )}

      {eventId === "hatching-tide" && (
        <>
          <g transform="translate(296 178)">
            <path
              d="M-17 3C-16-11-7-24 0-23C9-23 17-7 17 5C17 24-18 24-17 3Z"
              fill={leafLight}
            />
            <path
              d="M-14-6Q-4 0 0-5Q5-10 14-3M-15 8Q-7 2 0 10Q8 15 16 8"
              fill="none"
              stroke={paper}
              strokeWidth="3"
            />
            <circle cx="-4" cy="-13" r="2" fill={gold} stroke="none" />
            <circle cx="5" cy="1" r="2.5" fill={rose} stroke="none" />
          </g>
          <g transform="translate(37 434)">
            <path
              d="M-13-12C-19-20-13-36-7-24C-9-40 3-44 3-24C17-33 24-11 10-6Z"
              fill={paper}
            />
            <path d="M-8-31-6-24M-1-32 0-25" stroke={rose} fill="none" />
            <path d="M-19-13 19-13 14 0H-14Z" fill={wood} />
            <path
              d="M-12-9-9-3M-3-9-2-3M6-9 5-3M13-9 11-3"
              fill="none"
              stroke={paper}
              opacity=".5"
            />
          </g>
          <FlowerPot x={399} y={435} />
        </>
      )}

      {eventId === "make-it-rain" && (
        <>
          <g transform="translate(296 177) rotate(8)">
            <ellipse rx="18" ry="20" fill={gold} />
            <ellipse rx="13" ry="15" fill="none" opacity=".5" />
            <path
              d="M-4-10Q-11-15-11-7Q-9-3-4-4M4-10Q11-15 11-7Q9-3 4-4M-5-5Q0-10 5-5L6 4Q0 9-6 4Z"
              fill={paper}
            />
            <path d="M0 8V11" fill="none" />
          </g>
          <g transform="translate(37 434)" fill={gold}>
            <path d="M-18-5Q-3-12 12-5V-1Q-3 5-18-1Z" />
            <ellipse cx="-3" cy="-5" rx="15" ry="4" />
            <path d="M-13-12Q1-17 15-12V-8Q1-2-13-8Z" />
            <ellipse cx="1" cy="-12" rx="14" ry="4" />
            <path d="M-5-22Q9-28 19-23V-18Q8-13-5-18Z" />
            <ellipse cx="7" cy="-23" rx="12" ry="3.5" />
          </g>
          <Gift x={399} y={434} scale={0.78} color={leafLight} />
        </>
      )}

      {eventId === "moonfire-faire" && (
        <>
          <g transform="translate(296 179)">
            <path
              d="M-4 16C-8 5-30 0-21-13Q-17-19-11-16Q-10-26-2-23Q5-26 10-17Q20-20 23-11C27 1 7 7 4 16Z"
              fill={rose}
            />
            <path
              d="M-4 15-13-12M0 15-2-18M4 15 12-12"
              fill="none"
              stroke={paper}
              strokeWidth="2"
              opacity=".7"
            />
            <path d="M-4 16Q0 22 4 16" fill={paper} />
          </g>
          <g transform="translate(38 426)">
            <path
              d="M-12-5Q-19-13-18-17M12-5Q19-13 18-17M-13 1-20 5M13 1 20 5M-10 6-16 9M10 6 16 9"
              fill="none"
            />
            <path
              d="M-18-14C-29-19-20-29-16-22L-12-25C-9-17-12-14-18-14ZM18-14C29-19 20-29 16-22L12-25C9-17 12-14 18-14Z"
              fill={rose}
            />
            <ellipse rx="15" ry="9" fill={rose} />
            <path d="M-5-4V-10M5-4V-10" fill="none" />
            <circle cx="-5" cy="-11" r="1.8" fill={ink} stroke="none" />
            <circle cx="5" cy="-11" r="1.8" fill={ink} stroke="none" />
            <path d="M-3 3Q0 6 3 3" fill="none" />
          </g>
          <g transform="translate(399 434)">
            <path d="M-9-27 10-27 7 0H-6Z" fill={paper} />
            <path d="M-8-19H9L7 0H-6Z" fill={gold} stroke="none" opacity=".7" />
            <path
              d="M1-6 3-37 10-39"
              fill="none"
              stroke={rose}
              strokeWidth="2.5"
            />
            <path d="M-12-29 12-29 8-26-9-26Z" fill={paper} />
          </g>
        </>
      )}

      {eventId === "the-rising" && (
        <>
          <g transform="translate(296 178)">
            <path
              d="M0-23Q4-7 10-5L21-3Q11 3 9 9L7 20Q0 12-6 15L-17 19Q-13 7-18 2L-24-5Q-8-5-5-11Z"
              fill={gold}
            />
            <path
              d="M-4-5 0 3 8 3"
              fill="none"
              stroke={paper}
              strokeWidth="2"
              opacity=".7"
            />
            <path
              d="M-5 18Q-6 27-16 31M1 20Q3 28-1 35"
              fill="none"
              stroke={rose}
            />
          </g>
          <g transform="translate(37 434)">
            <path d="M-10-28Q0-32 10-28L9-1Q0 2-9-1Z" fill={paper} />
            <ellipse cy="-28" rx="10" ry="3" fill={gold} />
            <path d="M-1-30C-10-39 2-40 0-49C13-37 7-31-1-30Z" fill={gold} />
            <path d="M-1-33Q-3-37 1-41" fill="none" stroke={paper} />
            <path
              d="M-5-23V-18Q-2-14-2-20V-25"
              fill="none"
              stroke={wood}
              opacity=".5"
            />
          </g>
          <FlowerPot x={400} y={435} blossom />
        </>
      )}

      {eventId === "heavensturn" && (
        <>
          <g transform="translate(296 177)">
            <path
              d="M-9-20H9L12-14Q25 0 11 15L8 20H-8L-11 15Q-25 0-12-14Z"
              fill={rose}
            />
            <path
              d="M-7-14Q-15 0-7 14M7-14Q15 0 7 14M0-14V14"
              fill="none"
              stroke={paper}
              opacity=".45"
            />
            <path d="M-10-21H10V-16H-10ZM-9 16H9V21H-9Z" fill={gold} />
            <path
              d="M0 21V30M0 29-4 37M0 29V38M0 29 4 37"
              fill="none"
              stroke={gold}
              strokeWidth="1.8"
            />
          </g>
          <g transform="translate(37 434)">
            <path
              d="M-10-17V-41L-4-45V-17M-2-17V-53L5-57V-17M7-17V-34L13-38V-17"
              fill={leafLight}
              stroke={leaf}
            />
            <path d="M-10-30H-4M-2-38H5M7-25H13" stroke={leaf} />
            <path d="M-17-18 18-18 13 0H-12Z" fill={wood} />
            <path
              d="M-15-12H16M-13-6H14"
              fill="none"
              stroke={paper}
              opacity=".5"
            />
            <path
              d="M-8-17Q-20-24-18-30Q-6-30-8-17M9-17Q24-24 22-31Q8-29 9-17"
              fill={leaf}
            />
          </g>
          <Gift x={399} y={434} scale={0.72} />
        </>
      )}
    </g>
  );
}

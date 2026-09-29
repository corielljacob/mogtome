import { NookHalloweenDecor } from "./NookHalloweenDecor";
import { NookThread } from "./NookThread";
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
          <NookThread
            relief={1.8}
            d="M-6-9Q-8-5-3 0M-4-10Q-6-5-1 2M-1-9Q-3-4 0 2M2-10Q0-4 1 2M5-9Q6-4 2 1"
            color={rose}
            width={1.55}
          />
        </g>
      ))}
      <circle cy="4" r="2.4" fill={gold} stroke="none" />
      <NookThread
        relief={1.8}
        d="M-1 4Q-2 2 0 2.2Q2.5 2.7 1 4.8Q-.3 6-1 4"
        color={gold}
        width={1.5}
      />
    </g>
  );
}

function Gift({ x = 0, y = 0, scale = 1, color = rose }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-15-25 15-26 14 0H-14Z" fill={color} />
      <NookThread
        relief={1.8}
        d="M-11-19-12-2M-7-19-8-2M-3-19-4-2M2-19 1-2M7-19 6-2M11-19 10-2"
        color={color}
        width={2.1}
      />
      <NookThread
        relief={1.8}
        d="M-13-23 13-24 12-2H-12Z"
        color={paper}
        width={1.1}
        dasharray="1.4 2.2"
        opacity={0.8}
      />
      <path d="M-16-26 16-27 17-21-16-20Z" fill={paper} />
      <NookThread
        relief={1.8}
        d="M-13-24-12-22M-9-24-8-22M-5-24-4-22M-1-24 0-22M3-25 4-23M7-25 8-23M11-25 12-23M14-25 15-23"
        color={paper}
        shadow={wood}
        width={1.5}
      />
      <path d="M-2-26H3V0H-2Z" fill={gold} stroke="none" />
      <path d="M0-27C-16-27-11-42-3-31L0-27C12-42 18-28 0-27Z" fill={paper} />
      <NookThread
        relief={1.8}
        d="M-9-34-8-29M-6-34-5-29M-3-31-2-28M4-31 3-28M7-34 6-29M10-34 9-30M12-32 11-30"
        color={paper}
        shadow={wood}
        width={1.5}
      />
      <NookThread
        relief={1.8}
        d="M-1-24V-2M2-24V-2M-14-23 14-24M-2-29Q-13-29-8-34M2-29Q13-30 8-34"
        color={gold}
        width={1.3}
      />
    </g>
  );
}

function FlowerPot({ x = 0, y = 0, blossom = false }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <NookThread
        relief={1.8}
        d="M0-15Q-6-34-3-45M0-16Q7-35 12-38"
        color={leaf}
        highlight={leafLight}
        width={1.6}
      />
      <path
        d="M-2-30C-15-27-17-37-16-40Q-4-39-2-30ZM4-26C17-24 20-33 18-35Q7-35 4-26Z"
        fill={leafLight}
        stroke={leaf}
      />
      <NookThread
        relief={1.8}
        d="M-13-37-11-32M-9-35-7-31M-5-33-3-31M-13-32-10-35M-8-30-6-32M16-32 14-27M12-31 10-27M9-29 7-26M17-29 13-30M12-27 10-29"
        color={leaf}
        highlight={leafLight}
        width={1.35}
      />
      {blossom ? (
        <>
          <Blossom x={-3} y={-46} scale={0.54} />
          <Blossom x={12} y={-40} scale={0.4} />
        </>
      ) : (
        <g>
          <path
            d="M-3-42C-9-46-7-55-3-58Q3-52-3-42Z"
            fill={leafLight}
            stroke={leaf}
          />
          <NookThread
            relief={1.8}
            d="M-5-54-3-51M-6-50-3-47M-5-46-3-43M-1-54-3-51M-1-49-3-46"
            color={leaf}
            highlight={leafLight}
            width={1.25}
          />
        </g>
      )}
      <path d="M-11-19 11-20 8-2Q0 1-8-2Z" fill={paper} />
      <NookThread
        relief={1.8}
        d="M-9-15Q0-12 10-16M-9-12Q0-9 9-13M-8-9Q0-6 9-10M-8-6Q0-3 8-7M-7-3Q0-1 7-4"
        color={paper}
        shadow={wood}
        width={1.5}
      />
      <path d="M-12-21 12-22 12-17-12-16Z" fill={rose} />
      <NookThread
        relief={1.8}
        d="M-10-18 10-19"
        color={rose}
        width={1.75}
        dasharray="1.4 1.7"
      />
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
      <NookThread
        relief={1.8}
        d="M296 104Q294 131 296 155"
        color={wood}
        width={1.7}
      />
      <NookThread
        relief={1.8}
        d="M293 157Q296 153 299 157"
        color={wood}
        width={1.5}
      />

      {eventId === "starlight" && (
        <>
          <g fill={leaf} stroke={leaf}>
            <NookThread
              relief={1.8}
              d="M83 62Q132 40 178 61T268 57Q301 49 329 68"
              color={leaf}
              highlight={leafLight}
              width={2}
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
                <NookThread
                  relief={1.8}
                  d="M-10-5-7-1M-6-4-3 0M-11 2-6-1M-6 3-2 1M3 4 7 4M5 7 10 6M8 10 12 9M4 4 4 8M8 6 8 11"
                  color={leaf}
                  highlight={leafLight}
                  width={1.35}
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
            <NookThread
              relief={1.8}
              d="M-19-13Q-10-17-3-8M-20-10Q-10-13-3-5M-18-7-4-3M19-13Q10-17 3-8M20-10Q10-13 3-5M18-7 4-3M-4 3-9 13M-1 4-5 14M5 3 12 10M7 2 14 8"
              color={rose}
              width={1.7}
            />
            <NookThread
              relief={1.8}
              d="M-24-1-22 5M-20-2-19 3M-27 5-21 4M-23 9-18 4M22-3 21 3M26 0 23 5M16 0 19 4M25 7 20 5"
              color={leafLight}
              highlight={leafLight}
              width={1.35}
            />
            <circle cx="-3" cy="-3" r="3.2" fill={gold} />
            <circle cx="3" cy="-2" r="3.5" fill={gold} />
            <NookThread
              relief={1.8}
              d="M-4-4q-2 3 1 3q2-1 0-2M2-3q-1 3 2 3q2-2-.5-2"
              color={gold}
              width={1.3}
            />
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
            <NookThread
              relief={1.8}
              d="M-16-8Q-20-2-11 5M-13-12Q-17-2-8 8M-10-13Q-13 0-5 12M-7-12Q-10 1-2 15M-3-9Q-7 4 0 18M1-8Q-3 4 2 16M5-12Q0 2 5 13M9-13Q4 0 8 10M13-12Q9-2 11 7M17-9Q14-2 14 3"
              color={rose}
              width={1.65}
            />
            <NookThread
              relief={1.8}
              d="M0-9C-8-22-25-10-17 2Q-11 11 0 20Q14 10 19 0C25-14 8-21 0-9Z"
              color={rose}
              width={1.4}
              dasharray="1.2 2.1"
            />
            <NookThread
              relief={1.8}
              d="M-12-7Q-16-3-10 3"
              color={paper}
              shadow={rose}
              width={1.8}
              opacity={0.85}
            />
            <path d="M-2 20-5 29 0 27 4 30 3 21" fill={gold} />
            <NookThread
              relief={1.8}
              d="M-1 22-3 27M1 22 1 26M2 24 3 28"
              color={gold}
              width={1.4}
            />
          </g>
          <FlowerPot x={37} y={435} blossom />
          <g transform="translate(398 426) rotate(-7)">
            <path d="M-18-14 17-14 17 7-18 7Z" />
            <NookThread
              relief={1.8}
              d="M-15-11H14M-11-8H10M-7-5H6M-15-7V3M-12-5V0M-9-3-10-1M14-7V3M11-5V0M8-3 9-1M-14 5H13M-10 2H10"
              color={paper}
              shadow={wood}
              width={1.6}
            />
            <path
              d="m-18-14 18 13 17-13M-18 7-6-5M17 7 6-5"
              fill="none"
              stroke={wood}
            />
            <NookThread
              relief={1.8}
              d="M-16-12 0 0 15-12M-16 5-7-4M15 5 7-4"
              color={wood}
              width={1.3}
              dasharray="1.3 2"
            />
            <path d="M0-1C-4-7-10-1-6 3L0 8 6 3C11-2 4-7 0-1Z" fill={rose} />
            <NookThread
              relief={1.8}
              d="M-6-1-3 3M-3-2 0 6M0 1 1 5M3-2 3 3M6-1 5 2"
              color={rose}
              width={1.5}
            />
          </g>
        </>
      )}

      {eventId === "little-ladies" && (
        <>
          <Blossom x={296} y={173} scale={1.65} />
          <NookThread
            relief={1.8}
            d="M296 193Q296 205 292 211M292 211 289 218M292 211 293 219M292 211 297 217"
            color={gold}
            width={1.8}
          />
          <FlowerPot x={37} y={435} blossom />
          <FlowerPot x={399} y={435} blossom />
          <NookThread
            relief={1.8}
            d="M88 69Q110 46 137 48"
            color={wood}
            width={1.5}
          />
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
            <NookThread
              relief={1.8}
              d="M-11-12Q-15 0-11 13M-8-17Q-12 0-8 16M-5-20Q-9 0-5 18M-2-21Q-5 0-2 19M1-21Q-1 0 1 19M4-20Q3 0 4 18M7-17Q8 0 7 17M10-13Q12 0 10 15M13-8Q15 0 13 11"
              color={leafLight}
              highlight={paper}
              width={1.7}
            />
            <NookThread
              relief={1.8}
              d="M-14 3C-13-9-6-21 0-20C8-20 14-6 14 5C14 21-15 21-14 3Z"
              color={leaf}
              highlight={leafLight}
              width={1.1}
              dasharray="1.4 2.1"
            />
            <NookThread
              relief={1.8}
              d="M-14-6Q-4 0 0-5Q5-10 14-3M-15 8Q-7 2 0 10Q8 15 16 8"
              color={paper}
              shadow={leaf}
              width={2.4}
            />
            <circle cx="-4" cy="-13" r="2" fill={gold} stroke="none" />
            <circle cx="5" cy="1" r="2.5" fill={rose} stroke="none" />
            <NookThread
              relief={1.8}
              d="M-5-13q0-2 2-1q1 2-1 2"
              color={gold}
              width={1.3}
            />
            <NookThread
              relief={1.8}
              d="M4 0 6 2M4 2 6 0"
              color={rose}
              width={1.3}
            />
          </g>
          <g transform="translate(37 434)">
            <path
              d="M-13-12C-19-20-13-36-7-24C-9-40 3-44 3-24C17-33 24-11 10-6Z"
              fill={paper}
            />
            <NookThread
              relief={1.8}
              d="M-12-27Q-14-21-11-15M-9-27Q-11-20-8-15M-5-30Q-6-22-5-15M-2-36Q-3-24-2-15M1-36Q0-25 1-15M5-23Q2-18 4-14M8-24Q5-18 7-13M11-24Q9-18 10-12M14-22Q12-17 13-13M17-18 16-14"
              color={paper}
              shadow={wood}
              width={1.6}
            />
            <NookThread
              relief={1.8}
              d="M-10-27-8-21M-2-33-2-24"
              color={rose}
              width={1.6}
            />
            <path d="M-19-13 19-13 14 0H-14Z" fill={wood} />
            <NookThread
              relief={1.8}
              d="M-16-10 17-10M-15-7 16-7M-14-4 15-4M-12-11-10-1M-6-11-5-1M0-11V-1M6-11 5-1M12-11 10-1"
              color={wood}
              width={1.3}
            />
            <NookThread
              relief={1.8}
              d="M-12-9-9-3M-3-9-2-3M6-9 5-3M13-9 11-3"
              color={paper}
              shadow={wood}
              width={1.1}
              opacity={0.7}
            />
          </g>
          <FlowerPot x={399} y={435} />
        </>
      )}

      {eventId === "make-it-rain" && (
        <>
          <g transform="translate(296 177) rotate(8)">
            <ellipse rx="18" ry="20" fill={gold} />
            <NookThread
              relief={1.8}
              d="M-11-14Q-19 0-11 14M-8-17Q-15 0-8 17M-5-18Q-10 0-5 18M-2-19Q-5 0-2 19M2-19Q5 0 2 19M5-18Q10 0 5 18M8-17Q15 0 8 17M11-14Q19 0 11 14"
              color={gold}
              width={1.6}
            />
            <NookThread
              relief={1.8}
              d="M0-16A14 16 0 1 1 0 16A14 16 0 1 1 0-16"
              color={gold}
              width={1.4}
              dasharray="1.5 2.1"
            />
            <path
              d="M-4-10Q-11-15-11-7Q-9-3-4-4M4-10Q11-15 11-7Q9-3 4-4M-5-5Q0-10 5-5L6 4Q0 9-6 4Z"
              fill={paper}
            />
            <NookThread
              relief={1.8}
              d="M-9-10-9-7M-6-10-6-7M6-10 6-7M9-10 9-7M-3-4-3 3M0-5V5M3-4 3 3"
              color={paper}
              shadow={wood}
              width={1.55}
            />
            <NookThread relief={1.8} d="M0 8V11" color={wood} width={1.3} />
          </g>
          <g transform="translate(37 434)" fill={gold}>
            <path d="M-18-5Q-3-12 12-5V-1Q-3 5-18-1Z" />
            <ellipse cx="-3" cy="-5" rx="15" ry="4" />
            <NookThread
              relief={1.8}
              d="M-15-5Q-3-9 9-5M-15-3Q-3 1 9-3M-13-2V0M-8 0V1M-3 1V2M2 0V1M7-1V0"
              color={gold}
              width={1.6}
            />
            <path d="M-13-12Q1-17 15-12V-8Q1-2-13-8Z" />
            <ellipse cx="1" cy="-12" rx="14" ry="4" />
            <NookThread
              relief={1.8}
              d="M-10-12Q1-15 12-12M-10-10Q1-6 12-10M-8-9V-7M-3-7V-5M2-7V-5M7-8V-6M12-10V-8"
              color={gold}
              width={1.6}
            />
            <path d="M-5-22Q9-28 19-23V-18Q8-13-5-18Z" />
            <ellipse cx="7" cy="-23" rx="12" ry="3.5" />
            <NookThread
              relief={1.8}
              d="M-2-23Q7-26 16-23M-2-21Q7-18 16-21M-2-20V-18M3-19V-17M8-18V-16M13-19V-17M17-21V-19"
              color={gold}
              width={1.6}
            />
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
            <NookThread
              relief={1.8}
              d="M-19-11Q-19-2-4 13M-16-14Q-17-3-3 13M-12-14Q-12-1-2 13M-8-19-1 13M-5-21 0 13M-1-21 1 13M3-21 2 13M7-18 3 13M11-14 4 13M15-15Q17-3 5 12M19-12Q20-2 6 11"
              color={rose}
              width={1.55}
            />
            <NookThread
              relief={1.8}
              d="M-4 15-13-12M0 15-2-18M4 15 12-12"
              color={paper}
              shadow={rose}
              width={1.5}
              opacity={0.85}
            />
            <path d="M-4 16Q0 22 4 16" fill={paper} />
            <NookThread
              relief={1.8}
              d="M-2 17Q0 19 2 17"
              color={paper}
              width={1.6}
            />
          </g>
          <g transform="translate(38 426)">
            <NookThread
              relief={1.8}
              d="M-12-5Q-19-13-18-17M12-5Q19-13 18-17M-13 1-20 5M13 1 20 5M-10 6-16 9M10 6 16 9"
              color={rose}
              width={1.6}
            />
            <path
              d="M-18-14C-29-19-20-29-16-22L-12-25C-9-17-12-14-18-14ZM18-14C29-19 20-29 16-22L12-25C9-17 12-14 18-14Z"
              fill={rose}
            />
            <NookThread
              relief={1.8}
              d="M-21-22Q-23-19-18-17M-18-21Q-20-18-16-17M-14-22-14-18M21-22Q23-19 18-17M18-21Q20-18 16-17M14-22 14-18"
              color={rose}
              width={1.5}
            />
            <ellipse rx="15" ry="9" fill={rose} />
            <NookThread
              relief={1.8}
              d="M-11-3Q-13 0-11 4M-8-5Q-10 0-8 6M-5-6Q-7 0-5 7M-2-7Q-4 0-2 8M2-7Q4 0 2 8M5-6Q7 0 5 7M8-5Q10 0 8 6M11-3Q13 0 11 4"
              color={rose}
              width={1.35}
            />
            <NookThread
              relief={1.8}
              d="M-5-4V-10M5-4V-10"
              color={rose}
              width={1.4}
            />
            <circle cx="-5" cy="-11" r="1.8" fill={ink} stroke="none" />
            <circle cx="5" cy="-11" r="1.8" fill={ink} stroke="none" />
            <NookThread
              relief={1.8}
              d="M-3 3Q0 6 3 3"
              color={wood}
              width={1.1}
            />
          </g>
          <g transform="translate(399 434)">
            <path d="M-9-27 10-27 7 0H-6Z" fill={paper} />
            <NookThread
              relief={1.8}
              d="M-7-24H8M-7-21H8"
              color={paper}
              shadow={wood}
              width={1.6}
            />
            <path d="M-8-19H9L7 0H-6Z" fill={gold} stroke="none" opacity=".7" />
            <NookThread
              relief={1.8}
              d="M-6-17Q0-14 7-17M-6-13Q0-10 7-13M-5-9Q0-6 6-9M-5-5Q0-2 6-5"
              color={gold}
              width={1.7}
            />
            <NookThread
              relief={1.8}
              d="M1-6 3-37 10-39"
              color={rose}
              width={2.3}
            />
            <path d="M-12-29 12-29 8-26-9-26Z" fill={paper} />
            <NookThread
              relief={1.8}
              d="M-9-28H9"
              color={paper}
              shadow={wood}
              width={1.6}
            />
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
            <NookThread
              relief={1.8}
              d="M-3-10-1 2M-1-17 1 1M1-15 3 1M3-10 5 0M-19-4-2 4M-17-1-2 6M-14 3-3 8M-11 6-4 10M-14 14-3 9M-10 13-1 7M-6 12 1 6M5 15 2 6M7 13 4 6M8 9 5 4M15-2 5 1M13 1 5 3M10 4 5 5"
              color={gold}
              width={1.7}
            />
            <NookThread
              relief={1.8}
              d="M-4-5 0 3 8 3"
              color={paper}
              shadow={gold}
              width={1.5}
              opacity={0.8}
            />
            <NookThread
              relief={1.8}
              d="M-5 18Q-6 27-16 31M1 20Q3 28-1 35"
              color={rose}
              width={1.6}
            />
          </g>
          <g transform="translate(37 434)">
            <path d="M-10-28Q0-32 10-28L9-1Q0 2-9-1Z" fill={paper} />
            <NookThread
              relief={1.8}
              d="M-8-25Q0-22 8-25M-8-21Q0-18 8-21M-8-17Q0-14 8-17M-8-13Q0-10 8-13M-8-9Q0-6 8-9M-8-5Q0-2 8-5"
              color={paper}
              shadow={wood}
              width={1.65}
            />
            <ellipse cy="-28" rx="10" ry="3" fill={gold} />
            <NookThread
              relief={1.8}
              d="M-7-28Q0-30 7-28M-6-27Q0-25 6-27"
              color={gold}
              width={1.5}
            />
            <path d="M-1-30C-10-39 2-40 0-49C13-37 7-31-1-30Z" fill={gold} />
            <NookThread
              relief={1.8}
              d="M-3-36Q-4-38-1-40M0-34Q-1-39 2-44M3-34Q6-38 4-42M-1-32Q2-33 4-36"
              color={gold}
              width={1.5}
            />
            <NookThread
              relief={1.8}
              d="M-1-33Q-3-37 1-41"
              color={paper}
              shadow={gold}
              width={1.3}
            />
            <NookThread
              relief={1.8}
              d="M-5-23V-18Q-2-14-2-20V-25"
              color={paper}
              shadow={wood}
              width={1.7}
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
            <NookThread
              relief={1.8}
              d="M-10-14Q0-11 10-14M-13-10Q0-6 13-10M-15-6Q0-2 15-6M-17-2Q0 2 17-2M-17 2Q0 6 17 2M-15 6Q0 10 15 6M-13 10Q0 14 13 10M-10 14Q0 17 10 14"
              color={rose}
              width={1.85}
            />
            <NookThread
              relief={1.8}
              d="M-7-14Q-15 0-7 14M7-14Q15 0 7 14M0-14V14"
              color={paper}
              shadow={rose}
              width={1.3}
              opacity={0.7}
            />
            <path d="M-10-21H10V-16H-10ZM-9 16H9V21H-9Z" fill={gold} />
            <NookThread
              relief={1.8}
              d="M-8-19V-18M-5-19V-18M-2-19V-18M1-19V-18M4-19V-18M7-19V-18M-7 18V19M-4 18V19M-1 18V19M2 18V19M5 18V19M7 18V19"
              color={gold}
              width={1.65}
            />
            <NookThread
              relief={1.8}
              d="M0 21V30M0 29-4 37M0 29V38M0 29 4 37"
              color={gold}
              width={1.8}
            />
          </g>
          <g transform="translate(37 434)">
            <path
              d="M-10-17V-41L-4-45V-17M-2-17V-53L5-57V-17M7-17V-34L13-38V-17"
              fill={leafLight}
              stroke={leaf}
            />
            <NookThread
              relief={1.8}
              d="M-10-30H-4M-2-38H5M7-25H13"
              color={leaf}
              highlight={leafLight}
              width={1.4}
            />
            <path d="M-17-18 18-18 13 0H-12Z" fill={wood} />
            <NookThread
              relief={1.8}
              d="M-14-15 15-15M-13-11 14-11M-12-7 13-7M-11-3 12-3"
              color={wood}
              width={1.5}
            />
            <NookThread
              relief={1.8}
              d="M-8-40V-20M-5-41V-20M0-51V-20M3-53V-20M9-33V-20M11-35V-20"
              color={leaf}
              highlight={leafLight}
              width={1.5}
            />
            <NookThread
              relief={1.8}
              d="M-15-12H16M-13-6H14"
              color={paper}
              shadow={wood}
              width={1.3}
              opacity={0.75}
            />
            <path
              d="M-8-17Q-20-24-18-30Q-6-30-8-17M9-17Q24-24 22-31Q8-29 9-17"
              fill={leaf}
            />
            <NookThread
              relief={1.8}
              d="M-16-27-12-25M-14-25-10-23M-12-22-9-20M-13-28-13-24M-10-26-11-22M19-28 15-26M18-25 12-23M15-22 11-20M16-28 16-24M13-26 13-22"
              color={leaf}
              highlight={leafLight}
              width={1.5}
            />
          </g>
          <Gift x={399} y={434} scale={0.72} />
        </>
      )}
    </g>
  );
}

import { useId } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";

/** A seasonal wax seal and ribbon clipped to the corner of the family album. */
export function NookHolidayKeepsake({
  eventId,
}: {
  eventId: SeasonalEventId | null;
}) {
  const id = useId().replace(/:/g, "");
  if (!eventId) return null;

  return (
    <svg
      className="nook-holiday-keepsake"
      viewBox="0 0 76 104"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-wax`} cx=".3" cy=".2" r=".85">
          <stop stopColor="var(--season-seal-light)" />
          <stop offset=".65" stopColor="var(--season-seal)" />
          <stop offset="1" stopColor="var(--season-seal-shadow)" />
        </radialGradient>
        <linearGradient id={`${id}-ribbon`} x2="1" y2="0">
          <stop stopColor="var(--season-ribbon)" />
          <stop offset=".45" stopColor="var(--season-seal-light)" />
          <stop offset="1" stopColor="var(--season-ribbon)" />
        </linearGradient>
      </defs>
      <g
        stroke="var(--season-seal-shadow)"
        strokeWidth="1.1"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path
          d="M20 48 43 54 34 98 24 88 12 92ZM39 52 57 49 68 89 54 84 47 96Z"
          fill={`url(#${id}-ribbon)`}
        />
        <path
          d="M24 59 19 85M50 59 58 83"
          stroke="var(--scene-paper)"
          opacity=".5"
        />
        <path
          d="M31 9Q42 4 49 11Q61 8 64 20Q74 24 68 36Q74 48 64 53Q62 64 49 62Q39 70 29 62Q16 66 12 55Q1 51 8 38Q1 29 10 22Q11 9 23 12Z"
          fill={`url(#${id}-wax)`}
        />
        <circle
          cx="38"
          cy="37"
          r="24"
          stroke="var(--scene-paper)"
          strokeOpacity=".3"
        />
        <circle cx="38" cy="37" r="20.5" strokeOpacity=".6" />
        <path
          d="M17 28Q21 17 29 16M50 59Q61 54 63 45"
          stroke="var(--scene-paper)"
          strokeWidth="1.7"
          opacity=".35"
        />
        <g
          transform="translate(38 37)"
          fill="var(--scene-paper)"
          stroke="var(--scene-paper)"
          strokeWidth="1.1"
        >
          {eventId === "all-saints-wake" && (
            <>
              <path
                d="M-11 12V-2C-12-18 12-18 11-2L13 12 7 8 1 12-5 8Z"
                fillOpacity=".9"
              />
              <path
                d="M-6-2Q-4-4-2-2M3-2Q5-4 7-2M-1 4Q2 7 5 3"
                stroke="var(--season-seal-shadow)"
                fill="none"
              />
              <path
                d="M-16-10h4m-2-2v4M13-14h5m-2-2v4"
                fill="none"
                opacity=".6"
              />
            </>
          )}
          {eventId === "starlight" && (
            <>
              <path
                d="M0-15-8-5H-4L-12 4H-6L-15 13H15L6 4H12L4-5H8ZM-2 13v4h4v-4"
                fillOpacity=".75"
              />
              <path
                d="M-4-3 5 0M-7 5 9 8"
                stroke="var(--season-seal-shadow)"
                opacity=".7"
              />
              <circle cy="-14" r="2" fill="var(--scene-gold)" stroke="none" />
            </>
          )}
          {eventId === "valentiones" && (
            <path
              d="M0 14C-27-2-13-23 0-10C13-23 27-2 0 14Z"
              fillOpacity=".75"
            />
          )}
          {eventId === "little-ladies" && (
            <>
              {[0, 72, 144, 216, 288].map((a) => (
                <path
                  key={a}
                  transform={`rotate(${a})`}
                  d="M0 2C-13-5-10-18-4-14L0-11 4-14C10-18 13-5 0 2Z"
                  fillOpacity=".75"
                />
              ))}
              <circle r="3" fill="var(--scene-gold)" stroke="none" />
            </>
          )}
          {eventId === "hatching-tide" && (
            <>
              <path
                d="M0-16C7-16 15 0 13 8C11 20-13 19-13 6C-13-2-6-16 0-16Z"
                fillOpacity=".8"
              />
              <path
                d="M-11 2-5-2 1 3 7-1 12 3M-8 10 0 7 8 11"
                fill="none"
                stroke="var(--season-seal-shadow)"
              />
            </>
          )}
          {eventId === "make-it-rain" && (
            <>
              <circle r="14" fillOpacity=".8" />
              <circle r="11" fill="none" stroke="var(--season-seal-shadow)" />
              <path
                d="m0-8 5 8-5 8-5-8Z"
                fill="var(--season-seal-shadow)"
                stroke="none"
              />
            </>
          )}
          {eventId === "moonfire-faire" && (
            <>
              <path
                d="M-4 12C-7 1-23-1-14-11Q-9-15-5-11Q0-21 5-11Q12-17 16-10C22 1 7 4 4 12Z"
                fillOpacity=".8"
              />
              <path
                d="M-3 10-11-7M0 10V-10M3 10 12-7"
                stroke="var(--season-seal-shadow)"
                fill="none"
              />
              <path d="M-4 12Q0 16 4 12" />
            </>
          )}
          {eventId === "the-rising" && (
            <>
              <path
                d="m0-16 4 11 12 1-9 7 3 12-10-7-10 7 3-12-9-7 12-1Z"
                fillOpacity=".8"
              />
              <path d="M-18 12-4 18M7-18 17-11" fill="none" opacity=".6" />
            </>
          )}
          {eventId === "heavensturn" && (
            <>
              <path d="M-7-12H7Q18 0 7 12H-7Q-18 0-7-12Z" fillOpacity=".8" />
              <path
                d="M-5-10Q-10 0-5 10M5-10Q10 0 5 10M0-10V10"
                stroke="var(--season-seal-shadow)"
                fill="none"
              />
              <path d="M-8-14H8M-8 14H8M0 14V20m-3-1 3-4 3 4" fill="none" />
            </>
          )}
        </g>
      </g>
    </svg>
  );
}

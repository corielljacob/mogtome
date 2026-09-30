import { useId } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import { NookThread } from "./NookThread";

const motifStitches: Record<SeasonalEventId, string> = {
  "all-saints-wake":
    "M-8-5Q-8-10-4-11M-4-6Q-4-10 0-11M1-7Q3-11 5-9M5-6Q8-8 8-4M-8 1V8M-5 2V6M9 1 10 8M-1 8 1 10",
  starlight:
    "M0-11-4-6M1-8 4-5M-3-1-7 3M0 0-3 3M3 1 6 3M-6 7-10 11M-3 8-6 11M0 7-2 11M3 9 4 11M7 10 9 11M0 14v2",
  heavensturn:
    "M-8-8Q-13-1-9 7M-2-9Q-5 0-2 9M2-9Q5 0 2 9M8-8Q13-1 9 7M-5-12H5M-5 12H5",
  valentiones:
    "M-11-10Q-8-14-3-8M-13-7-3 0M-12-2-1 7M-9 3 0 11M11-10Q8-14 3-8M13-7 3 0M12-2 1 7M9 3 2 9",
  "little-ladies":
    "M-6-12-2-3M-2-9 0-3M3-10 2-3M10-9 4-2M11-5 5 0M15-1 5 2M12 6 5 4M8 9 3 5M6 13 1 5M-1 13-1 5M-5 10-3 5M-10 10-5 4M-13 3-5 2M-10-1-5 0M-11-6-4-2",
  "hatching-tide":
    "M-1-13-5-5M2-12 0-4M5-9 4-4M8-5 7-3M-10 4-9 7M-6 3-5 6M-2 5-1 6M3 5 4 6M8 4 9 7M-5 12-3 15M0 11 1 15M5 12 4 14",
  "make-it-rain":
    "M-3-9-6-6M-7-4-9-1M-9 2-6 5M-5 7-2 9M2 9 5 7M6 5 9 2M9-1 7-4M6-6 3-9",
  "moonfire-faire":
    "M-13-8-6 6M-9-10-4 4M-3-12-2 5M2-12 2 5M7-9 4 4M12-9 6 4M-2 12 0 13 2 12",
  "the-rising":
    "M0-12V-3M-2-7-1-2M2-7 1-2M-11-3-2 0M11-3 2 0M-5 6-7 11M-2 4-4 10M5 6 7 11M2 4 4 10",
};

const rosetteStitches = Array.from({ length: 40 }, (_, index) => {
  const angle = (index * Math.PI) / 20;
  const inner = 24.8;
  const outer = 29.5 + (index % 2) * 0.5;
  return `M${38 + Math.cos(angle) * inner} ${37 + Math.sin(angle) * inner}L${38 + Math.cos(angle) * outer} ${37 + Math.sin(angle) * outer}`;
}).join(" ");

const sealStitches = Array.from({ length: 11 }, (_, index) => {
  const y = -18 + index * 3.6;
  const halfWidth = Math.sqrt(20 ** 2 - y ** 2);
  return `M${38 - halfWidth} ${37 + y}Q38 ${35.8 + y} ${38 + halfWidth} ${37 + y}`;
}).join(" ");

/** A stitched seasonal rosette and ribbon clipped to the family album. */
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
        <NookThread
          d="M22 58 16 86M26 59 21 86M30 61 25 84M34 62 29 89M38 62 33 92M43 62 49 89M47 62 53 83M51 61 58 80M55 59 63 84"
          color="var(--season-ribbon)"
          width={2}
          relief={1.35}
        />
        <NookThread
          d="M21 55 14 90 24 86 33 94 40 57M42 56 48 92 53 82 65 87 56 54"
          color="var(--season-seal-light)"
          width={1.05}
          dasharray="1.8 2.2"
          relief={1.2}
        />
        <path
          d="M31 9Q42 4 49 11Q61 8 64 20Q74 24 68 36Q74 48 64 53Q62 64 49 62Q39 70 29 62Q16 66 12 55Q1 51 8 38Q1 29 10 22Q11 9 23 12Z"
          fill={`url(#${id}-wax)`}
        />
        <NookThread
          d={rosetteStitches}
          color="var(--season-seal)"
          shadow="var(--season-seal-shadow)"
          width={1.55}
          relief={1.35}
        />
        <NookThread
          d="M38 13a24 24 0 1 1 0 48a24 24 0 1 1 0-48Z"
          color="var(--season-seal-light)"
          width={1.15}
          dasharray="1.5 2.2"
          relief={1.2}
        />
        <NookThread
          d={sealStitches}
          color="var(--season-seal)"
          shadow="var(--season-seal-shadow)"
          width={1.8}
          opacity={0.7}
          relief={1.2}
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
          <NookThread
            d={motifStitches[eventId]}
            color="var(--scene-paper)"
            shadow="var(--season-seal-shadow)"
            highlight="#fffaf0"
            width={1.6}
            relief={1.35}
          />
        </g>
      </g>
    </svg>
  );
}

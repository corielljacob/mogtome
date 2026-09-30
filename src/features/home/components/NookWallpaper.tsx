import { useId } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import type { ColorTheme } from "@/shared/contexts/ThemeContext";

/** Small repeating motifs printed in the room's own inks. */
export function NookWallpaper({
  eventId,
  colorTheme,
}: {
  eventId?: SeasonalEventId | null;
  colorTheme?: ColorTheme;
}) {
  const id = useId().replace(/:/g, "");

  return (
    <svg
      className="nook-wallpaper"
      width="100%"
      height="100%"
      style={{ fontSize: "var(--layout-unit, 1px)" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <g
          id={`${id}-sprig`}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {!eventId && colorTheme === "arr" ? (
            <>
              <path
                d="M0-14 6-5 4 7 0 14-4 7-6-5Z"
                fill="currentColor"
                fillOpacity=".12"
                strokeWidth=".75"
              />
              <path d="M0-14V14M-6-5 0-1 6-5M-4 7 0-1 4 7" strokeWidth=".55" />
              <ellipse
                cy="2"
                rx="11"
                ry="4"
                transform="rotate(-28)"
                strokeWidth=".7"
              />
              <path
                d="M15-14v5m-2.5-2.5h5"
                stroke="var(--scene-gold)"
                strokeWidth=".75"
              />
            </>
          ) : !eventId && colorTheme === "heavensward" ? (
            <>
              <path
                d="M-7 11V-2Q-6-9 0-15Q6-9 7-2V11ZM-3 9V-2Q-2-6 0-9Q2-6 3-2V9"
                strokeWidth=".7"
              />
              <path
                d="M0-9V14M-10 7Q-16 0-14-5L-9-1-10-8-5-2M10 7Q16 0 14-5L9-1 10-8 5-2"
                strokeWidth=".65"
              />
              <path d="M-10 15H10M0-18v-4m-2 2h4" strokeWidth=".7" />
            </>
          ) : !eventId && colorTheme === "stormblood" ? (
            <>
              <path
                d="M-3 1C-7-5-13-10-19-9Q-17-4-12-1L-17-3Q-14 3-8 4L-12 3Q-9 8-3 7L0 5M3 1C7-5 13-10 19-9Q17-4 12-1L17-3Q14 3 8 4L12 3Q9 8 3 7L0 5"
                fill="currentColor"
                fillOpacity=".1"
                strokeWidth=".7"
              />
              <path
                d="M-3 4Q-7 0-12-3M3 4Q7 0 12-3M0 6V12M-3 10 0 13 3 10"
                strokeWidth=".55"
              />
              <circle
                cy="-7"
                r="4.3"
                fill="var(--scene-gold)"
                fillOpacity=".18"
                stroke="var(--scene-gold)"
                strokeWidth=".75"
              />
              <path
                d="M0-14v-3M-6-12-8-14M6-12 8-14"
                stroke="var(--scene-gold)"
                strokeWidth=".7"
              />
            </>
          ) : !eventId && colorTheme === "shadowbringers" ? (
            <>
              <path
                d="M-12 11Q-12-1 0-1Q12-1 12 11M-13 11H13M-7 10Q-7 2 0-1Q7 2 7 10"
                stroke="var(--scene-gold)"
                strokeWidth=".65"
              />
              <path
                d="M0-18 3-9 2 5 0 10-2 5-3-9Z"
                fill="currentColor"
                fillOpacity=".1"
                strokeWidth=".65"
              />
              <path d="M0-18V10M-3-9 0-6 3-9" strokeWidth=".5" />
              <path
                d="M13-14l.8 2.7 2.7.8-2.7.8-.8 2.7-.8-2.7-2.7-.8 2.7-.8ZM-12-7v3m-1.5-1.5h3"
                strokeWidth=".6"
              />
            </>
          ) : !eventId ||
            !["all-saints-wake", "starlight", "valentiones"].includes(
              eventId,
            ) ? (
            <>
              <path d="M0 12C2 6-2 0 1-8" strokeWidth=".8" />
              <path
                d="M0 5C-6 6-8 1-7-2C-3-2 0 0 0 5ZM1 0C6 1 8-3 7-6C3-5 1-3 1 0Z"
                fill="currentColor"
                fillOpacity=".32"
                strokeWidth=".65"
              />
              <path
                d="M1-7C-3-9-3-12 0-12C2-15 5-11 3-8Z"
                fill="var(--scene-rose)"
                fillOpacity=".55"
                strokeWidth=".65"
              />
            </>
          ) : eventId === "all-saints-wake" ? (
            <>
              <path
                d="M4-12C-8-9-9 6 4 10C-14 14-18-12 4-12Z"
                fill="currentColor"
                fillOpacity=".4"
                strokeWidth=".7"
              />
              <path
                d="m10-5 1 3 3 1-3 1-1 3-1-3-3-1 3-1ZM5-16v4m-2-2h4"
                strokeWidth=".7"
              />
            </>
          ) : eventId === "starlight" ? (
            <>
              <path
                d="M0-12V12M-10-6 10 6M-10 6 10-6M-3-9 0-6 3-9M-3 9 0 6 3 9M-9-2-5-3-6-7M9 2 5 3 6 7M-9 2-5 3-6 7M9-2 5-3 6-7"
                strokeWidth=".8"
              />
            </>
          ) : (
            <>
              <path
                d="M0 10C-21-2-10-17 0-8C10-17 21-2 0 10Z"
                fill="currentColor"
                fillOpacity=".15"
                strokeWidth=".7"
              />
              <path d="M-9 14H9" strokeWidth=".5" />
            </>
          )}
        </g>
        {/* em sizes the tile from the layout unit; its viewBox scales the art with it. */}
        <pattern
          id={`${id}-wall`}
          patternUnits="userSpaceOnUse"
          width="104em"
          height="128em"
          viewBox="0 0 104 128"
        >
          <use href={`#${id}-sprig`} transform="translate(25 30) rotate(-12)" />
          <use href={`#${id}-sprig`} transform="translate(77 94) rotate(12)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-wall)`} />
    </svg>
  );
}

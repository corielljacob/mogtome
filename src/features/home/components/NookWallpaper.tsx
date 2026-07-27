import { useId } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";

/** A small, repeating botanical print, using the room's own leaf and rose inks. */
export function NookWallpaper({
  eventId,
}: {
  eventId?: SeasonalEventId | null;
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
          {!eventId ||
          !["all-saints-wake", "starlight", "valentiones"].includes(eventId) ? (
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

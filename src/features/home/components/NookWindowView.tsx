import { useId, useLayoutEffect, useRef } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { NookShiroganeView } from "./NookShiroganeView";
import { NookWindowSky } from "./NookWindowSky";
import { createDayCycle, setDayCycleTarget } from "./nookDayCycle";
import "./nook-window-cycle.css";

// Uneven needle-entry heights keep the long-and-short sky fill from forming
// rows of tiles. Wrapped strands continue through the pattern boundary.
const skyFloss =
  "M1.5-12q-.7 9 .2 19M1.5 12q-.7 9 .2 19M4.5-6q.7 9-.2 18M4.5 18q.7 9-.2 18M7.5-18q-.6 10 .2 20M7.5 6q-.6 10 .2 20M10.5-9q.6 10-.2 20M10.5 15q.6 10-.2 20M13.5-22q-.5 11 .2 21M13.5 2q-.5 11 .2 21M16.5-15q.6 9-.2 19M16.5 9q.6 9-.2 19";

/** Fixed paint surfaces; only their outer opacity/transform participates in time. */
export function NookWindowView({
  isDark,
  eventId,
}: {
  isDark: boolean;
  eventId: SeasonalEventId | null;
}) {
  const id = useId().replace(/:/g, "");
  const root = useRef<HTMLDivElement>(null);
  const initialDark = useRef(isDark);
  const animations = useRef<Animation[]>([]);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!root.current) return;
    const cycle = createDayCycle(root.current, initialDark.current);
    animations.current = cycle;
    return () => {
      cycle.forEach((animation) => animation.cancel());
      animations.current = [];
    };
  }, []);

  useLayoutEffect(() => {
    setDayCycleTarget(animations.current, isDark, reducedMotion);
  }, [isDark, reducedMotion]);

  return (
    <div
      ref={root}
      className="nook-window-exterior"
      data-mode={isDark ? "dark" : "light"}
      aria-hidden="true"
    >
      <div
        className="nook-cycle-surface nook-cycle-sky nook-cycle-sky--day nook-theme"
        data-mode="light"
        data-scene={eventId ?? undefined}
      />
      <div
        className="nook-cycle-surface nook-cycle-sky nook-cycle-sky--night nook-theme"
        data-cycle="night-sky"
        data-mode="dark"
        data-scene={eventId ?? undefined}
      />
      <div className="nook-cycle-surface nook-cycle-dusk" data-cycle="dusk" />
      <svg
        className="nook-cycle-surface nook-cycle-thread"
        viewBox="70 58 262 373"
        focusable="false"
      >
        <defs>
          <pattern
            id={`${id}-sky-thread`}
            width="18"
            height="24"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-18)"
            fill="none"
          >
            {/* The sky is filled with staggered floss, with rounded needle
                entries and a lit ridge on each strand rather than a fine grid. */}
            <path
              d={skyFloss}
              stroke="#101827"
              strokeWidth="2.65"
              strokeLinecap="round"
              transform="translate(.3 .6)"
              opacity=".24"
            />
            <path
              d={skyFloss}
              stroke="#e7ecdf"
              strokeWidth="1.85"
              strokeLinecap="round"
              opacity=".14"
            />
            <path
              d={skyFloss}
              stroke="#fff6db"
              strokeWidth=".65"
              strokeLinecap="round"
              transform="translate(-.55 -.25)"
              opacity=".3"
            />
          </pattern>
        </defs>
        <path d="M70 58H332V431H70Z" fill={`url(#${id}-sky-thread)`} />
      </svg>
      <NookWindowSky layer="clouds" eventId={eventId} />
      <NookWindowSky layer="sun" eventId={eventId} />
      <NookWindowSky layer="moon" eventId={eventId} />
      <NookWindowSky layer="stars" eventId={eventId} />
      {([false, true] as const).map((night) => (
        <div
          key={String(night)}
          className={`nook-cycle-surface nook-cycle-landscape nook-cycle-landscape--${night ? "night" : "day"}`}
          data-cycle={night ? "night-landscape" : undefined}
        >
          <svg
            className="nook-theme"
            data-mode={night ? "dark" : "light"}
            data-scene={eventId ?? undefined}
            viewBox="70 58 262 373"
            fill="none"
            focusable="false"
          >
            <NookShiroganeView isDark={night} />
          </svg>
        </div>
      ))}
      <div
        className="nook-cycle-surface nook-cycle-golden-hour"
        data-cycle="golden-hour"
      />
    </div>
  );
}

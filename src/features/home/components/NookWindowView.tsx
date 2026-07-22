import { useId, useLayoutEffect, useRef } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { NookEmbroidery } from "./NookEmbroidery";
import { NookShiroganeView } from "./NookShiroganeView";
import { NookWindowSky } from "./NookWindowSky";
import { createDayCycle, setDayCycleTarget } from "./nookDayCycle";
import "./nook-window-cycle.css";

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
      <NookWindowSky layer="clouds" />
      <NookWindowSky layer="sun" />
      <NookWindowSky layer="moon" />
      <NookWindowSky layer="stars" />
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
            <defs>
              <NookEmbroidery
                id={`${id}-exterior-${night}`}
                width={440}
                height={550}
              />
            </defs>
            <g filter={`url(#${id}-exterior-${night})`}>
              <NookShiroganeView isDark={night} />
            </g>
          </svg>
        </div>
      ))}
      <div
        className="nook-cycle-surface nook-cycle-golden-hour"
        data-cycle="golden-hour"
      />
      <svg
        className="nook-cycle-surface nook-cycle-thread"
        viewBox="70 58 262 373"
        focusable="false"
      >
        <defs>
          <pattern
            id={`${id}-sky-thread`}
            width="3"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M.7-.5v5m1.5-2v5"
              stroke="#fff3db"
              strokeWidth=".5"
              opacity=".13"
            />
            <path
              d="M1.3-.5v5m1.5-2v5"
              stroke="#493846"
              strokeWidth=".35"
              opacity=".1"
            />
          </pattern>
        </defs>
        <path d="M70 58H332V431H70Z" fill={`url(#${id}-sky-thread)`} />
      </svg>
    </div>
  );
}

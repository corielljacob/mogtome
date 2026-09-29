import { useLayoutEffect, useRef } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import type { ColorTheme } from "@/shared/contexts/ThemeContext";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { NookShiroganeView } from "./NookShiroganeView";
import { NookArrView } from "./NookArrView";
import { NookWindowSky } from "./NookWindowSky";
import { createDayCycle, setDayCycleTarget } from "./nookDayCycle";
import { NookSkyEmbroidery } from "./NookSkyEmbroidery";
import "./nook-window-cycle.css";

interface NookWindowViewProps {
  isDark: boolean;
  eventId: SeasonalEventId | null;
  colorTheme?: ColorTheme;
}

/** ARR looks into the aether, so the room's light switch never changes its sky. */
export function NookWindowView(props: NookWindowViewProps) {
  if (!props.eventId && props.colorTheme === "arr") {
    return (
      <div
        className="nook-window-exterior nook-arr-exterior"
        aria-hidden="true"
      >
        <NookArrView />
      </div>
    );
  }
  return <NookDayCycleWindow {...props} />;
}

/** Fixed paint surfaces; only their outer opacity/transform participates in time. */
function NookDayCycleWindow({
  isDark,
  eventId,
  colorTheme = "pom-pom",
}: NookWindowViewProps) {
  const root = useRef<HTMLDivElement>(null);
  const initialDark = useRef(isDark);
  const animations = useRef<Animation[]>([]);
  const playback = useRef<{
    time: number;
    rate: number;
    running: boolean;
  } | null>(null);
  const reducedMotion = useReducedMotion();
  const isHalloween = eventId === "all-saints-wake";
  const scene = eventId ?? colorTheme;

  useLayoutEffect(() => {
    if (!root.current) return;
    const cycle = createDayCycle(root.current, initialDark.current);
    // The Halloween sky replaces its model groups. Rebind their tracks at the
    // existing exposure, including a reversed or already settled transition.
    const previous = playback.current;
    if (previous) {
      for (const animation of cycle) {
        animation.currentTime = previous.time;
        animation.updatePlaybackRate(previous.rate);
        if (previous.running) animation.play();
      }
    }
    animations.current = cycle;
    return () => {
      const clock = cycle[0];
      if (clock && typeof clock.currentTime === "number") {
        playback.current = {
          time: clock.currentTime,
          rate: clock.playbackRate,
          running: clock.playState === "running",
        };
      }
      cycle.forEach((animation) => animation.cancel());
      animations.current = [];
    };
  }, [isHalloween]);

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
        data-scene={scene}
      >
        <NookSkyEmbroidery />
      </div>
      <div
        className="nook-cycle-surface nook-cycle-sky nook-cycle-sky--night nook-theme"
        data-cycle="night-sky"
        data-mode="dark"
        data-scene={scene}
      >
        <NookSkyEmbroidery />
      </div>
      <div className="nook-cycle-surface nook-cycle-dusk" data-cycle="dusk">
        <NookSkyEmbroidery dusk />
      </div>
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
            data-scene={scene}
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

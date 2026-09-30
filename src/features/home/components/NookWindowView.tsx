import { useLayoutEffect, useRef } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import type { ColorTheme } from "@/shared/contexts/ThemeContext";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { NookShiroganeView } from "./NookShiroganeView";
import { NookArrView } from "./NookArrView";
import { NookHeavenswardView } from "./NookHeavenswardView";
import {
  NookHeavenswardSky,
  NookHeavenswardWeather,
} from "./NookHeavenswardWeather";
import { NookWindowSky } from "./NookWindowSky";
import { createDayCycle, setDayCycleTarget } from "./nookDayCycle";
import { NookSkyEmbroidery } from "./NookSkyEmbroidery";
import { NookHeavenswardSkyEmbroidery } from "./NookHeavenswardSkyEmbroidery";
import { NookStormbloodView } from "./NookStormbloodView";
import { NookStormbloodSkyEmbroidery } from "./NookStormbloodSkyEmbroidery";
import {
  NookStormbloodSky,
  NookStormbloodBreeze,
} from "./NookStormbloodAtmosphere";
import { NookShadowbringersView } from "./NookShadowbringersView";
import { NookShadowbringersSkyEmbroidery } from "./NookShadowbringersSkyEmbroidery";
import { NookShadowbringersLightParting } from "./NookShadowbringersLightParting";
import {
  NookShadowbringersSky,
  NookShadowbringersLeaves,
} from "./NookShadowbringersAtmosphere";
import { NookEndwalkerView } from "./NookEndwalkerView";
import { NookEndwalkerSkyEmbroidery } from "./NookEndwalkerSkyEmbroidery";
import { NookEndwalkerSky } from "./NookEndwalkerSky";
import { NookDawntrailView } from "./NookDawntrailView";
import { NookDawntrailSkyEmbroidery } from "./NookDawntrailSkyEmbroidery";
import {
  NookDawntrailSky,
  NookDawntrailBirds,
  NookDawntrailTide,
} from "./NookDawntrailSky";
import { NookEvercoldView } from "./NookEvercoldView";
import { NookEvercoldSky } from "./NookEvercoldSky";
import {
  NookEvercoldSkyEmbroidery,
  NookEvercoldAtmosphere,
} from "./NookEvercoldSkyEmbroidery";
import "./nook-window-cycle.css";
import "./nook-ambient-models.css";

interface NookWindowViewProps {
  isDark: boolean;
  eventId: SeasonalEventId | null;
  colorTheme?: ColorTheme;
}

/** Aether and lunar space keep their fixed light when the room changes mode. */
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
  if (!props.eventId && props.colorTheme === "endwalker") {
    return (
      <div
        className="nook-window-exterior nook-ew-exterior"
        data-scene="endwalker"
        aria-hidden="true"
      >
        <NookEndwalkerSkyEmbroidery />
        <NookEndwalkerSky />
        <svg
          className="nook-cycle-surface"
          viewBox="70 58 262 373"
          fill="none"
          focusable="false"
        >
          <NookEndwalkerView />
        </svg>
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
  const isShadowbringers = scene === "shadowbringers";
  const isDawntrail = scene === "dawntrail";
  const isEvercold = scene === "evercold";
  const SkyEmbroidery =
    scene === "heavensward"
      ? NookHeavenswardSkyEmbroidery
      : scene === "stormblood"
        ? NookStormbloodSkyEmbroidery
        : scene === "shadowbringers"
          ? NookShadowbringersSkyEmbroidery
          : isDawntrail
            ? NookDawntrailSkyEmbroidery
            : isEvercold
              ? NookEvercoldSkyEmbroidery
              : NookSkyEmbroidery;

  useLayoutEffect(() => {
    if (!root.current) return;
    const cycle = createDayCycle(root.current, initialDark.current);
    // Expansion and holiday skies own different tracks. Rebind at the existing
    // exposure, including a reversed or settled transition.
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
  }, [isHalloween, isShadowbringers, isDawntrail, isEvercold]);

  useLayoutEffect(() => {
    setDayCycleTarget(animations.current, isDark, reducedMotion);
  }, [isDark, reducedMotion]);

  return (
    <div
      ref={root}
      className="nook-window-exterior"
      data-mode={isDark ? "dark" : "light"}
      data-scene={scene}
      data-reduced-motion={reducedMotion ? "true" : undefined}
      aria-hidden="true"
    >
      <div
        className="nook-cycle-surface nook-cycle-sky nook-cycle-sky--day nook-theme"
        data-mode="light"
        data-scene={scene}
      >
        <SkyEmbroidery>
          {isEvercold && <NookEvercoldSky layer="clouds" embedded />}
        </SkyEmbroidery>
      </div>
      <div
        className="nook-cycle-surface nook-cycle-sky nook-cycle-sky--night nook-theme"
        data-cycle="night-sky"
        data-mode="dark"
        data-scene={scene}
      >
        <SkyEmbroidery>
          {isEvercold && <NookEvercoldSky layer="clouds" embedded />}
        </SkyEmbroidery>
      </div>
      <div className="nook-cycle-surface nook-cycle-dusk" data-cycle="dusk">
        <SkyEmbroidery dusk>
          {isEvercold && <NookEvercoldSky layer="clouds" embedded />}
        </SkyEmbroidery>
      </div>
      {!isEvercold &&
        (["clouds", "sun", "moon", "stars"] as const).map((layer) =>
          isDawntrail ? (
            <NookDawntrailSky key={layer} layer={layer} />
          ) : (
            <NookWindowSky key={layer} layer={layer} eventId={eventId} />
          ),
        )}
      {isShadowbringers && <NookShadowbringersLightParting />}
      {scene === "heavensward" && <NookHeavenswardSky />}
      {scene === "stormblood" && <NookStormbloodSky />}
      {scene === "shadowbringers" && <NookShadowbringersSky />}
      {isDawntrail && <NookDawntrailBirds />}
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
            {scene === "heavensward" ? (
              <NookHeavenswardView isDark={night} />
            ) : scene === "stormblood" ? (
              <NookStormbloodView isDark={night} />
            ) : scene === "shadowbringers" ? (
              <NookShadowbringersView isDark={night} />
            ) : isDawntrail ? (
              <NookDawntrailView isDark={night} />
            ) : isEvercold ? (
              <NookEvercoldView isDark={night} />
            ) : (
              <NookShiroganeView isDark={night} />
            )}
          </svg>
        </div>
      ))}
      <div
        className="nook-cycle-surface nook-cycle-golden-hour"
        data-cycle="golden-hour"
      />
      {scene === "heavensward" && <NookHeavenswardWeather />}
      {scene === "stormblood" && <NookStormbloodBreeze />}
      {scene === "shadowbringers" && <NookShadowbringersLeaves />}
      {isDawntrail && <NookDawntrailTide />}
      {isEvercold && <NookEvercoldAtmosphere />}
    </div>
  );
}

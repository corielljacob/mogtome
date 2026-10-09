import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import type { ComponentType } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import type { ColorTheme } from "@/shared/contexts/ThemeContext";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { NookLandscape } from "./NookLandscape";

type AtmosphereLayers = {
  sky: ComponentType;
  foreground: ComponentType;
};

// The far and near placements share one import, while keeping their own
// boundaries so the fixed sky and city can paint before the weather arrives.
function lazyAtmosphere(load: () => Promise<AtmosphereLayers>) {
  let pending: Promise<AtmosphereLayers> | undefined;
  const layer = (placement: keyof AtmosphereLayers) =>
    lazy(() => {
      pending ??= load();
      return pending.then((layers) => ({ default: layers[placement] }));
    });
  return { sky: layer("sky"), foreground: layer("foreground") };
}

const { sky: NookHeavenswardSky, foreground: NookHeavenswardWeather } =
  lazyAtmosphere(() =>
    import("./NookHeavenswardWeather").then((m) => ({
      sky: m.NookHeavenswardSky,
      foreground: m.NookHeavenswardWeather,
    })),
  );
const { sky: NookStormbloodSky, foreground: NookStormbloodBreeze } =
  lazyAtmosphere(() =>
    import("./NookStormbloodAtmosphere").then((m) => ({
      sky: m.NookStormbloodSky,
      foreground: m.NookStormbloodBreeze,
    })),
  );
const { sky: NookShadowbringersSky, foreground: NookShadowbringersLeaves } =
  lazyAtmosphere(() =>
    import("./NookShadowbringersAtmosphere").then((m) => ({
      sky: m.NookShadowbringersSky,
      foreground: m.NookShadowbringersLeaves,
    })),
  );
const NookArrView = lazy(() =>
  import("./NookArrView").then((m) => ({ default: m.NookArrView })),
);
import { NookWindowSky } from "./NookWindowSky";
import { createDayCycle, setDayCycleTarget } from "./nookDayCycle";
import { isAnimationPausedForVisibility } from "./homeAnimationVisibility";
import { NookSkySurface } from "./NookSkySurface";
const NookShadowbringersLightParting = lazy(() =>
  import("./NookShadowbringersLightParting").then((m) => ({
    default: m.NookShadowbringersLightParting,
  })),
);
const NookEndwalkerSky = lazy(() =>
  import("./NookEndwalkerSky").then((m) => ({ default: m.NookEndwalkerSky })),
);
const NookDawntrailSky = lazy(() =>
  import("./NookDawntrailSky").then((m) => ({ default: m.NookDawntrailSky })),
);
const NookDawntrailBirds = lazy(() =>
  import("./NookDawntrailSky").then((m) => ({ default: m.NookDawntrailBirds })),
);
const NookDawntrailTide = lazy(() =>
  import("./NookDawntrailSky").then((m) => ({ default: m.NookDawntrailTide })),
);
const NookEvercoldSky = lazy(() =>
  import("./NookEvercoldSky").then((m) => ({ default: m.NookEvercoldSky })),
);
const NookEvercoldAtmosphere = lazy(() =>
  import("./NookEvercoldSkyEmbroidery").then((m) => ({
    default: m.NookEvercoldAtmosphere,
  })),
);
import "./nook-window-cycle.css";
import "./nook-ambient-models.css";

interface NookWindowViewProps {
  isDark: boolean;
  eventId: SeasonalEventId | null;
  colorTheme?: ColorTheme;
}

/** Aether and lunar space keep their fixed light when the room changes mode. */
export function NookWindowView(props: NookWindowViewProps) {
  return (
    <Suspense
      fallback={
        <div
          className="nook-window-exterior nook-cycle-sky nook-window-placeholder"
          aria-hidden="true"
        />
      }
    >
      <NookWindowScene {...props} />
    </Suspense>
  );
}

function NookWindowScene(props: NookWindowViewProps) {
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
        <NookSkySurface scene="endwalker" />
        <NookEndwalkerSky />
        <NookLandscape scene="endwalker" className="nook-cycle-surface" />
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
          running:
            clock.playState === "running" ||
            isAnimationPausedForVisibility(clock),
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
        <NookSkySurface scene={scene} active={!isDark}>
          {isEvercold && <NookEvercoldSky layer="clouds" />}
        </NookSkySurface>
      </div>
      <div
        className="nook-cycle-surface nook-cycle-sky nook-cycle-sky--night nook-theme"
        data-cycle="night-sky"
        data-mode="dark"
        data-scene={scene}
      >
        <NookSkySurface scene={scene} exposure="night" active={isDark}>
          {isEvercold && <NookEvercoldSky layer="clouds" />}
        </NookSkySurface>
      </div>
      <div className="nook-cycle-surface nook-cycle-dusk" data-cycle="dusk">
        <NookSkySurface
          scene={scene}
          exposure="dusk"
          isDark={isDark}
          active={false}
        >
          {isEvercold && <NookEvercoldSky layer="clouds" />}
        </NookSkySurface>
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
      {/* Weather has independent clocks; its chunk never delays the glass. */}
      <Suspense fallback={null}>
        {scene === "heavensward" && <NookHeavenswardSky />}
        {scene === "stormblood" && <NookStormbloodSky />}
        {scene === "shadowbringers" && <NookShadowbringersSky />}
      </Suspense>
      {isDawntrail && <NookDawntrailBirds />}
      {([false, true] as const).map((night) => (
        <div
          key={String(night)}
          className={`nook-cycle-surface nook-cycle-landscape nook-cycle-landscape--${night ? "night" : "day"}`}
          data-cycle={night ? "night-landscape" : undefined}
        >
          <NookLandscape
            scene={scene}
            night={night}
            active={night === isDark}
          />
        </div>
      ))}
      <div
        className="nook-cycle-surface nook-cycle-golden-hour"
        data-cycle="golden-hour"
      />
      <Suspense fallback={null}>
        {scene === "heavensward" && <NookHeavenswardWeather />}
        {scene === "stormblood" && <NookStormbloodBreeze />}
        {scene === "shadowbringers" && <NookShadowbringersLeaves />}
      </Suspense>
      {isDawntrail && <NookDawntrailTide />}
      {isEvercold && <NookEvercoldAtmosphere />}
    </div>
  );
}

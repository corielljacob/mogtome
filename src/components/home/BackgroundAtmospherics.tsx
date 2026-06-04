import { useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { IS_MOBILE } from "../../utils";
import { FloatingMoogles } from "../FloatingMoogles";
import {
  DEFAULT_FAIRY_LIGHTS,
  floatingMoogles,
  generateEventFairyLights,
} from "./homeData";
import { CozyAtmosphere } from "./CozyAtmosphere";
import { FairyLights } from "./FairyLights";
import { EventParticles } from "./EventParticles";
import { HalloweenOverlay } from "./HalloweenOverlay";
import { StarlightOverlay } from "./StarlightOverlay";
import { EventBunting } from "./EventBunting";

/**
 * All the fixed, full-viewport background layers for the Home page: the base
 * gradient, polka-dot page, drifting cozy light pools, fairy lights, floating
 * moogles, and (during a flagship event) the themed particles, overlay, and
 * bunting.
 */
export function BackgroundAtmospherics() {
  const { activeEvent, isEventThemeActive } = useTheme();

  const fairyLights = useMemo(() => {
    if (isEventThemeActive && activeEvent) {
      return generateEventFairyLights(activeEvent.atmosphere.fairyLightColors);
    }
    return DEFAULT_FAIRY_LIGHTS;
  }, [isEventThemeActive, activeEvent]);

  const eventId = isEventThemeActive && activeEvent ? activeEvent.id : null;

  return (
    <>
      {/* ── Background Atmospherics ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-colors duration-1000"
        style={{
          background:
            isEventThemeActive && activeEvent
              ? activeEvent.atmosphere.backgroundGradient
              : "radial-gradient(ellipse at top left, color-mix(in srgb, var(--primary) 5%, transparent), transparent 70%), radial-gradient(ellipse at bottom right, color-mix(in srgb, var(--secondary) 8%, transparent), transparent 70%)",
        }}
        aria-hidden="true"
      />
      {/* Scrapbook polka-dot page */}
      <div
        className="fixed inset-0 z-0 pointer-events-none kawaii-dots opacity-80"
        aria-hidden="true"
      />
      {!IS_MOBILE && <CozyAtmosphere eventId={eventId} />}
      <FairyLights lights={fairyLights} />
      {isEventThemeActive && activeEvent && (
        <EventParticles particles={activeEvent.particles} />
      )}
      {isEventThemeActive && activeEvent?.id === "all-saints-wake" && (
        <HalloweenOverlay />
      )}
      {isEventThemeActive && activeEvent?.id === "starlight" && (
        <StarlightOverlay />
      )}
      <FloatingMoogles moogles={floatingMoogles} opacityRange={[0.15, 0.3]} />
      {isEventThemeActive && activeEvent && <EventBunting event={activeEvent} />}
    </>
  );
}

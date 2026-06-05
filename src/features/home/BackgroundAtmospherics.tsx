import { useMemo } from "react";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { IS_MOBILE } from "@/shared/lib/motionConfig";
import { FloatingMoogles } from "@/shared/ui/FloatingMoogles";
import {
  DEFAULT_FAIRY_LIGHTS,
  floatingMoogles,
  generateEventFairyLights,
} from "@/features/home/homeData";
import { CozyAtmosphere } from "@/features/home/CozyAtmosphere";
import { FairyLights } from "@/features/home/FairyLights";
import { EventParticles } from "@/features/home/EventParticles";
import { HalloweenOverlay } from "@/features/home/HalloweenOverlay";
import { StarlightOverlay } from "@/features/home/StarlightOverlay";
import { EventBunting } from "@/features/home/EventBunting";

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
      {isEventThemeActive && activeEvent && (
        <EventBunting event={activeEvent} />
      )}
    </>
  );
}

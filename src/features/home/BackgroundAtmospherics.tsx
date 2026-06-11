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
import { ThemeSnow } from "@/features/home/ThemeSnow";
import { ThemeEmbers } from "@/features/home/ThemeEmbers";
import { ThemeAurora } from "@/features/home/ThemeAurora";
import { ThemeCosmos } from "@/features/home/ThemeCosmos";
import { ThemeDawn } from "@/features/home/ThemeDawn";
import { ThemeCrystal } from "@/features/home/ThemeCrystal";
import { NorthernLights } from "@/features/home/NorthernLights";
import { HalloweenOverlay } from "@/features/home/HalloweenOverlay";
import { StarlightOverlay } from "@/features/home/StarlightOverlay";
import { EventBunting } from "@/features/home/EventBunting";

// A dramatic cold Ishgard sky for the Heavensward theme's Home backdrop: a frost
// glow descending from the top, a steel glow rising from below, and a cool wash.
const HEAVENSWARD_SKY =
  "radial-gradient(135% 100% at 50% -18%, color-mix(in srgb, var(--accent) 32%, transparent), transparent 56%)," +
  " radial-gradient(ellipse at 50% 120%, color-mix(in srgb, var(--primary) 22%, transparent), transparent 60%)," +
  " linear-gradient(180deg, color-mix(in srgb, var(--secondary) 16%, transparent) 0%, transparent 40%)";

// faint tiled starfield for the Heavensward night sky
const HEAVENSWARD_STARS =
  "radial-gradient(1.4px 1.4px at 14% 16%, rgba(255,255,255,0.95), transparent 60%)," +
  " radial-gradient(1px 1px at 32% 58%, rgba(200,225,255,0.7), transparent 60%)," +
  " radial-gradient(1.6px 1.6px at 49% 28%, rgba(255,255,255,0.85), transparent 60%)," +
  " radial-gradient(1px 1px at 66% 72%, rgba(180,215,255,0.6), transparent 60%)," +
  " radial-gradient(2px 2px at 80% 20%, rgba(255,255,255,0.9), transparent 60%)," +
  " radial-gradient(1px 1px at 90% 52%, rgba(210,230,255,0.7), transparent 60%)," +
  " radial-gradient(1.2px 1.2px at 40% 86%, rgba(255,255,255,0.65), transparent 60%)," +
  " radial-gradient(1.4px 1.4px at 7% 78%, rgba(190,220,255,0.7), transparent 60%)";

// A fiery Stormblood sky: the screen burns from the bottom - a gold-white flame
// core, a crimson glow above it, fading up to the deep warm dark.
const STORMBLOOD_SKY =
  "radial-gradient(120% 55% at 50% 125%, color-mix(in srgb, var(--accent) 55%, transparent), transparent 50%)," +
  " radial-gradient(150% 85% at 50% 135%, color-mix(in srgb, var(--primary) 52%, transparent), transparent 60%)," +
  " linear-gradient(180deg, transparent 25%, color-mix(in srgb, var(--primary) 16%, transparent) 100%)";

// The Shadowbringers "divided sky": the golden Light pours in from BOTH sides,
// splitting a deep indigo night down the middle, with a violet glow above. The
// aurora layer adds flickering brightness to the walls + violet beams in the gap.
const SHADOWBRINGERS_SKY =
  "radial-gradient(55% 135% at -6% 50%, color-mix(in srgb, var(--accent) 44%, transparent), transparent 58%)," +
  " radial-gradient(55% 135% at 106% 50%, color-mix(in srgb, var(--accent) 44%, transparent), transparent 58%)," +
  " radial-gradient(85% 60% at 50% 2%, color-mix(in srgb, var(--primary) 20%, transparent), transparent 52%)," +
  " linear-gradient(180deg, transparent 45%, color-mix(in srgb, var(--secondary) 7%, transparent) 100%)";

// Evercold's Norse night: an aurora-green glow and a violet glow up top with an
// icy-blue wash, over the deep frost-dark (the aurora layer + snow do the rest).
const EVERCOLD_SKY =
  "radial-gradient(120% 60% at 50% -5%, color-mix(in srgb, var(--secondary) 22%, transparent), transparent 55%)," +
  " radial-gradient(90% 50% at 72% 6%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 55%)," +
  " linear-gradient(180deg, color-mix(in srgb, var(--primary) 14%, transparent) 0%, transparent 55%)";

// A Realm Reborn's Mothercrystal sky: a radiant blue-white crystal glow centre-
// right over deep navy space (the crystal layer adds the core, rays + sparkles).
const ARR_SKY =
  "radial-gradient(50% 55% at 64% 40%, color-mix(in srgb, var(--secondary) 30%, transparent), transparent 55%)," +
  " radial-gradient(38% 44% at 64% 40%, color-mix(in srgb, var(--primary) 26%, transparent), transparent 50%)," +
  " linear-gradient(180deg, color-mix(in srgb, var(--primary) 12%, transparent) 0%, transparent 52%)";

// Endwalker's cosmos: a warm gold/coral eclipse glow in the upper right, a cool
// blue world glowing lower-left, over deep space (the cosmos layer adds stars).
const ENDWALKER_SKY =
  "radial-gradient(60% 65% at 86% 16%, color-mix(in srgb, var(--secondary) 38%, transparent), transparent 55%)," +
  " radial-gradient(42% 48% at 90% 22%, color-mix(in srgb, var(--accent) 44%, transparent), transparent 50%)," +
  " radial-gradient(72% 82% at 8% 84%, color-mix(in srgb, var(--primary) 32%, transparent), transparent 60%)," +
  " linear-gradient(160deg, transparent 50%, color-mix(in srgb, var(--primary) 10%, transparent) 100%)";

// Dawntrail's dawn over the sea: a coral/peach sky up top, a golden sun glowing
// at the horizon (right of centre), and the muted teal sea along the bottom (the
// dawn layer adds the sun's glow + reflection pillar + pollen).
const DAWNTRAIL_SKY =
  "radial-gradient(46% 30% at 60% 60%, color-mix(in srgb, var(--accent) 52%, transparent), transparent 56%)," +
  " linear-gradient(180deg, color-mix(in srgb, var(--primary) 26%, transparent) 0%, color-mix(in srgb, var(--accent) 14%, transparent) 36%, transparent 56%)," +
  " linear-gradient(0deg, color-mix(in srgb, var(--secondary) 34%, transparent) 0%, transparent 30%)";

// the cozy default backdrop for every non-themed page
const DEFAULT_SKY =
  "radial-gradient(ellipse at top left, color-mix(in srgb, var(--primary) 5%, transparent), transparent 70%), radial-gradient(ellipse at bottom right, color-mix(in srgb, var(--secondary) 8%, transparent), transparent 70%)";

export function BackgroundAtmospherics() {
  const { settings, isDarkMode, activeEvent, isEventThemeActive } = useTheme();
  // theme atmosphere only shows when its theme is actually on screen (an active
  // seasonal event overrides the chosen theme's colours, so suppress it then).
  const heavensward =
    !isEventThemeActive && settings.colorTheme === "heavensward";
  // the full dark Ishgard sky (stars, deepest navy) is a dark-mode experience;
  // light Heavensward stays a cool, snowy day with the usual cozy dots.
  const heavensNight = heavensward && isDarkMode;
  const arr = !isEventThemeActive && settings.colorTheme === "arr";
  // the radiant Mothercrystal in deep space is the dark-mode ARR experience.
  const arrNight = arr && isDarkMode;
  const stormblood =
    !isEventThemeActive && settings.colorTheme === "stormblood";
  // the full fire (embers, no cozy dots) is the dark-mode Stormblood experience.
  const stormNight = stormblood && isDarkMode;
  const shadowbringers =
    !isEventThemeActive && settings.colorTheme === "shadowbringers";
  // the aurora night sky is the dark-mode Shadowbringers experience.
  const shadowNight = shadowbringers && isDarkMode;
  const endwalker = !isEventThemeActive && settings.colorTheme === "endwalker";
  // the deep starry cosmos is the dark-mode Endwalker experience.
  const endwalkerNight = endwalker && isDarkMode;
  // Dawntrail is the bright one - its sun/rays/pollen show in both modes.
  const dawntrail = !isEventThemeActive && settings.colorTheme === "dawntrail";
  const evercold = !isEventThemeActive && settings.colorTheme === "evercold";
  // the aurora + snow over the frost-dark night is the dark-mode Evercold look.
  const evercoldNight = evercold && isDarkMode;
  const themeSky = arr
    ? ARR_SKY
    : heavensward
      ? HEAVENSWARD_SKY
      : stormblood
        ? STORMBLOOD_SKY
        : shadowbringers
          ? SHADOWBRINGERS_SKY
          : endwalker
            ? ENDWALKER_SKY
            : dawntrail
              ? DAWNTRAIL_SKY
              : evercold
                ? EVERCOLD_SKY
                : null;

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
        className="absolute inset-0 pointer-events-none z-0 transition-colors duration-1000"
        style={{
          background:
            isEventThemeActive && activeEvent
              ? activeEvent.atmosphere.backgroundGradient
              : (themeSky ?? DEFAULT_SKY),
        }}
        aria-hidden="true"
      />
      {heavensward && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 82% 74% at 50% 36%, transparent 52%, rgba(6, 10, 20, 0.38) 100%)",
          }}
          aria-hidden="true"
        />
      )}
      {heavensNight && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: HEAVENSWARD_STARS,
            backgroundSize: "260px 260px",
            opacity: 0.55,
          }}
          aria-hidden="true"
        />
      )}
      {/* The cozy dots normally come from the page background on <html> (so they
          cover the whole viewport). During an event the canvas shows the event's
          gradient instead, so render the dots on top here just for events. */}
      {isEventThemeActive && activeEvent && (
        <div
          className="absolute inset-0 z-0 pointer-events-none kawaii-dots opacity-80"
          aria-hidden="true"
        />
      )}
      {!IS_MOBILE && <CozyAtmosphere eventId={eventId} />}
      {(heavensward || evercoldNight) && <ThemeSnow />}
      {evercoldNight && <NorthernLights />}
      {arrNight && <ThemeCrystal />}
      {stormNight && <ThemeEmbers />}
      {shadowNight && <ThemeAurora />}
      {endwalkerNight && <ThemeCosmos />}
      {dawntrail && <ThemeDawn />}
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

import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Heart, Palette } from "lucide-react";
import { useTheme, THEME_DEFINITIONS } from "@/shared/contexts/ThemeContext";
import { NookIllustration } from "./components/NookIllustration";
import { HomeEntrance } from "./components/HomeEntrance";
import { NookAppliqueBacking } from "./components/NookAppliqueBacking";
import { NookMoogleInteraction } from "./components/NookMoogleInteraction";
import { NookHolidayKeepsake } from "./components/NookHolidayKeepsake";
import { NookFairyLights } from "./components/NookFairyLights";
import { NookFloorDecor, NookRoomDecor } from "./components/NookRoomDecor";
import { NookThemeKeepsake } from "./components/NookThemeKeepsake";
import { NookWelcomeHeading } from "./components/NookWelcomeHeading";
import {
  NookPaperclip,
  NookPhotoCorners,
} from "./components/NookStationeryDetails";
import "./home-screen.css";
import "./nook-halloween.css";
import "./nook-arr.css";
import "./nook-heavensward.css";
import "./nook-stormblood.css";
import "./nook-shadowbringers.css";
import "./nook-endwalker.css";
import "./nook-dawntrail.css";
import "./nook-evercold.css";

const NookHalloweenDetails = lazy(
  () => import("./components/NookHalloweenDetails"),
);

function HalloweenBadgeFallback() {
  return (
    <p className="nook-halloween-badge">
      <svg viewBox="-3 -2 37 34" aria-hidden="true" focusable="false" />
      <span className="nook-halloween-badge-label">All Saints’ Wake</span>
      <span className="nook-halloween-badge-star" aria-hidden="true">
        ✦
      </span>
    </p>
  );
}

export function Home() {
  const { activeEvent, isEventThemeActive, settings, isDarkMode } = useTheme();
  const event = isEventThemeActive ? activeEvent : null;
  const isHalloween = event?.id === "all-saints-wake";
  const keepsakeTheme = event ? null : settings.colorTheme;
  const themeName = THEME_DEFINITIONS.find(
    (theme) => theme.id === settings.colorTheme,
  )?.name;

  return (
    <HomeEntrance
      className="home-screen"
      data-mode={isDarkMode ? "dark" : "light"}
      data-scene={event?.id ?? settings.colorTheme}
      data-holiday={event ? "true" : undefined}
    >
      <NookRoomDecor isDark={isDarkMode} includeFloor={false} />
      {isHalloween && (
        <Suspense fallback={null}>
          <NookHalloweenDetails placement="room" />
        </Suspense>
      )}
      <NookFairyLights eventId={event?.id ?? null} />
      <div className="nook-layout">
        <section className="home-nook" aria-label="Welcome to Kupo Life">
          <NookThemeKeepsake theme={keepsakeTheme} placement="wall" />
          <div className="nook-window-scene">
            <NookMoogleInteraction eventId={event?.id ?? null}>
              <NookAppliqueBacking />
              <NookIllustration
                isDark={isDarkMode}
                eventId={event?.id ?? null}
                colorTheme={settings.colorTheme}
              />
            </NookMoogleInteraction>
          </div>

          <header className="nook-welcome">
            <p className="nook-eyebrow">
              Kupo Life <span>·</span> Zalera <span>·</span> Crystal
            </p>
            {isHalloween && (
              <Suspense fallback={<HalloweenBadgeFallback />}>
                <NookHalloweenDetails placement="badge" />
              </Suspense>
            )}
            <NookWelcomeHeading />
          </header>

          <div className="nook-keepsakes">
            <Link
              to="/members"
              className="nook-photo"
              aria-label="Meet the members"
            >
              <span className="nook-photo-seam" aria-hidden="true" />
              <span className="nook-tape" aria-hidden="true" />
              <NookHolidayKeepsake eventId={event?.id ?? null} />
              <div className="nook-photo-image">
                <img
                  src="/images/moogle-fishing.jpg"
                  width="640"
                  height="602"
                  alt="A moogle fishing, illustrated by Toshiyuki Itahana"
                  draggable={false}
                />
                <NookPhotoCorners />
              </div>
              <span className="nook-photo-caption">
                Members <ArrowRight aria-hidden="true" />
              </span>
              <span className="nook-photo-label">
                Kupo Life, Zalera <Heart aria-hidden="true" />
              </span>
            </Link>
            <div className="nook-notes">
              <Link to="/chronicle" className="nook-letter">
                <span className="nook-letter-fold" aria-hidden="true" />
                {isHalloween ? (
                  <Suspense fallback={null}>
                    <NookHalloweenDetails placement="letter" />
                  </Suspense>
                ) : (
                  <NookThemeKeepsake theme={keepsakeTheme} placement="letter" />
                )}
                {!isHalloween &&
                  (!keepsakeTheme || keepsakeTheme === "pom-pom") && (
                    <NookPaperclip />
                  )}
                <span className="nook-letter-title">The Chronicle</span>
                <span className="nook-letter-copy">What’s new in the FC.</span>
                <span className="nook-letter-bottom">
                  Read <ArrowRight aria-hidden="true" />
                </span>
              </Link>
              <Link to="/about" className="nook-about">
                <Heart aria-hidden="true" />
                <span>about the FC</span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
        <footer className="home-footer">
          <div className="home-floor-decor" aria-hidden="true">
            <NookFloorDecor
              isDark={isDarkMode}
              includeReadingCorner={!isHalloween}
            />
            {isHalloween && (
              <Suspense fallback={null}>
                <NookHalloweenDetails placement="hearth" />
              </Suspense>
            )}
          </div>
          <Link
            to="/settings"
            className="home-appearance"
            aria-label={`Change appearance. Current ${event ? "holiday" : "theme"}: ${event?.name ?? themeName}`}
          >
            <Palette aria-hidden="true" />
            <span>Appearance</span>
            <span className="home-palette-preview" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="home-appearance-theme">
              {event?.name ?? themeName}
            </span>
          </Link>
          <div className="home-footer-credits">
            <span>Moogle art © SQUARE ENIX</span>
            <a href="/images/nook/SOURCES.md" target="_blank" rel="noreferrer">
              Art credits <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </footer>
      </div>
    </HomeEntrance>
  );
}

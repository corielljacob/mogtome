import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Palette } from "lucide-react";
import { useTheme, THEME_DEFINITIONS } from "@/shared/contexts/ThemeContext";
import { NookIllustration } from "./components/NookIllustration";
import { NookAppliqueBacking } from "./components/NookAppliqueBacking";
import { NookMoogle } from "./components/NookMoogle";
import { NookPressedFlower } from "./components/NookPressedFlower";
import { NookHolidayKeepsake } from "./components/NookHolidayKeepsake";
import { NookFairyLights } from "./components/NookFairyLights";
import { NookRoomDecor } from "./components/NookRoomDecor";
import { NookWallHanging } from "./components/NookWallHanging";
import {
  NookArrCrystalCharm,
  NookArrWayfinder,
} from "./components/NookArrKeepsakes";
import {
  NookHeavenswardBanner,
  NookHeavenswardSeal,
} from "./components/NookHeavenswardKeepsakes";
import {
  NookStormbloodBanner,
  NookStormbloodCharm,
} from "./components/NookStormbloodKeepsakes";
import {
  NookShadowbringersBanner,
  NookShadowbringersCharm,
} from "./components/NookShadowbringersKeepsakes";
import {
  NookEndwalkerBanner,
  NookEndwalkerCharm,
} from "./components/NookEndwalkerKeepsakes";
import {
  NookDawntrailNoticePin,
  NookDawntrailCharm,
} from "./components/NookDawntrailKeepsakes";
import {
  NookEvercoldBanner,
  NookEvercoldCharm,
} from "./components/NookEvercoldKeepsakes";
import { NookWelcomeHeading } from "./components/NookWelcomeHeading";
import { NookHalloweenRoom } from "./components/NookHalloweenRoom";
import { NookHalloweenHearth } from "./components/NookHalloweenHearth";
import {
  NookHalloweenBadge,
  NookHalloweenNote,
} from "./components/NookHalloweenKeepsakes";
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

export function Home() {
  const [boops, setBoops] = useState(0);
  const [isBooping, setIsBooping] = useState(false);
  useEffect(() => {
    if (boops === 0) return;
    const settle = window.setTimeout(() => setIsBooping(false), 1800);
    return () => window.clearTimeout(settle);
  }, [boops]);
  const { activeEvent, isEventThemeActive, settings, isDarkMode } = useTheme();
  const event = isEventThemeActive ? activeEvent : null;
  const isHalloween = event?.id === "all-saints-wake";
  const isArr = !event && settings.colorTheme === "arr";
  const isHeavensward = !event && settings.colorTheme === "heavensward";
  const isStormblood = !event && settings.colorTheme === "stormblood";
  const isShadowbringers = !event && settings.colorTheme === "shadowbringers";
  const isEndwalker = !event && settings.colorTheme === "endwalker";
  const isDawntrail = !event && settings.colorTheme === "dawntrail";
  const isEvercold = !event && settings.colorTheme === "evercold";
  const themeName = THEME_DEFINITIONS.find(
    (theme) => theme.id === settings.colorTheme,
  )?.name;

  return (
    <div
      className="home-screen"
      data-mode={isDarkMode ? "dark" : "light"}
      data-scene={event?.id ?? settings.colorTheme}
      data-holiday={event ? "true" : undefined}
    >
      <NookRoomDecor isDark={isDarkMode} />
      {isHalloween && <NookHalloweenRoom />}
      <NookFairyLights eventId={event?.id ?? null} />
      <div className="nook-layout">
        <section className="home-nook" aria-label="Welcome to Kupo Life">
          {isHalloween && <NookHalloweenHearth />}
          {isArr ? (
            <NookArrWayfinder />
          ) : isHeavensward ? (
            <NookHeavenswardBanner />
          ) : isStormblood ? (
            <NookStormbloodBanner />
          ) : isShadowbringers ? (
            <NookShadowbringersBanner />
          ) : isEndwalker ? (
            <NookEndwalkerBanner />
          ) : isDawntrail ? (
            <NookDawntrailNoticePin />
          ) : isEvercold ? (
            <NookEvercoldBanner />
          ) : (
            <NookWallHanging />
          )}
          <div className="nook-window-scene">
            <div className="nook-illustration-frame">
              <NookAppliqueBacking />
              <NookIllustration
                isDark={isDarkMode}
                eventId={event?.id ?? null}
                colorTheme={settings.colorTheme}
              />
              <button
                className="nook-moogle"
                onClick={() => {
                  setIsBooping(true);
                  setBoops((count) => count + 1);
                }}
                aria-label="Boop the moogle"
              >
                <NookMoogle
                  key={boops}
                  className={isBooping ? "is-booped" : undefined}
                  booped={isBooping}
                  eventId={event?.id ?? null}
                />
              </button>
            </div>
            <p className="nook-moogle-note" role="status" aria-live="polite">
              {isBooping ? (isHalloween ? "Boo, kupo!" : "kupo!") : ""}
            </p>
          </div>

          <header className="nook-welcome">
            <p className="nook-eyebrow">
              Kupo Life <span>·</span> Zalera <span>·</span> Crystal
            </p>
            {isHalloween && <NookHalloweenBadge />}
            <NookWelcomeHeading isHalloween={isHalloween} />
            {isHalloween && (
              <p className="nook-halloween-welcome">
                The ghosts are friendly, kupo.
              </p>
            )}
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
              <p className="nook-wall-wish" aria-hidden="true">
                <i className="nook-note-pin" />
                <span>
                  {isHalloween ? "Happy haunting!" : "See you in game."}
                </span>
                <svg viewBox="0 0 96 12" fill="none" focusable="false">
                  <path
                    d="M2 6q18-4 35 0m22 0q17-4 35 0M48 1l1.5 3.5L53 6l-3.5 1.5L48 11l-1.5-3.5L43 6l3.5-1.5Z"
                    stroke="currentColor"
                    strokeWidth=".8"
                  />
                </svg>
              </p>
              <Link to="/chronicle" className="nook-letter">
                <span className="nook-letter-fold" aria-hidden="true" />
                {isHalloween ? (
                  <NookHalloweenNote />
                ) : isArr ? (
                  <NookArrCrystalCharm />
                ) : isHeavensward ? (
                  <NookHeavenswardSeal />
                ) : isStormblood ? (
                  <NookStormbloodCharm />
                ) : isShadowbringers ? (
                  <NookShadowbringersCharm />
                ) : isEndwalker ? (
                  <NookEndwalkerCharm />
                ) : isDawntrail ? (
                  <NookDawntrailCharm />
                ) : isEvercold ? (
                  <NookEvercoldCharm />
                ) : (
                  <NookPressedFlower />
                )}
                {!isHalloween &&
                  !isArr &&
                  !isHeavensward &&
                  !isStormblood &&
                  !isShadowbringers &&
                  !isEndwalker &&
                  !isDawntrail &&
                  !isEvercold && <NookPaperclip />}
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
          <Link
            to="/settings"
            className="home-appearance"
            aria-label={`Change appearance. Current ${event ? "holiday" : "theme"}: ${event?.name ?? themeName}`}
          >
            <Palette aria-hidden="true" />
            <span>{event?.name ?? "Appearance"}</span>
            <i />
            <i />
            <i />
          </Link>
          <a href="/images/nook/SOURCES.md" target="_blank" rel="noreferrer">
            Moogle art © SQUARE ENIX · credits
          </a>
        </footer>
      </div>
    </div>
  );
}

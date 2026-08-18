import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Palette } from "lucide-react";
import { useTheme, THEME_DEFINITIONS } from "@/shared/contexts/ThemeContext";
import { NookIllustration } from "./components/NookIllustration";
import { NookMoogle } from "./components/NookMoogle";
import { NookPressedFlower } from "./components/NookPressedFlower";
import { NookHolidayKeepsake } from "./components/NookHolidayKeepsake";
import { NookFairyLights } from "./components/NookFairyLights";
import { NookRoomDecor } from "./components/NookRoomDecor";
import { NookWallHanging } from "./components/NookWallHanging";
import "./home-screen.css";

export function Home() {
  const [boops, setBoops] = useState(0);
  const { activeEvent, isEventThemeActive, settings, isDarkMode } = useTheme();
  const event = isEventThemeActive ? activeEvent : null;
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
      <div className="nook-layout">
        <section className="home-nook" aria-label="Welcome to Kupo Life">
          <NookFairyLights eventId={event?.id ?? null} />
          <NookWallHanging />
          <div className="nook-window-scene">
            <div className="nook-illustration-frame">
              <NookIllustration
                isDark={isDarkMode}
                eventId={event?.id ?? null}
              />
              <button
                className="nook-moogle"
                onClick={() => setBoops((count) => count + 1)}
                aria-label="Boop the moogle"
              >
                <NookMoogle
                  key={boops}
                  className={boops ? "is-booped" : undefined}
                  booped={boops > 0}
                  eventId={event?.id ?? null}
                />
              </button>
            </div>
            <p className="nook-moogle-note" role="status" aria-live="polite">
              {boops > 0 ? "kupo!" : ""}
            </p>
          </div>

          <header className="nook-welcome">
            <p className="nook-eyebrow">
              Kupo Life <span>·</span> Zalera <span>·</span> Crystal
            </p>
            <h1>
              Welcome home, kupo.<span aria-hidden="true">♡</span>
            </h1>
          </header>

          <div className="nook-keepsakes">
            <Link
              to="/members"
              className="nook-photo"
              aria-label="Meet the members"
            >
              <span className="nook-tape" aria-hidden="true" />
              <NookHolidayKeepsake eventId={event?.id ?? null} />
              <div className="nook-photo-image">
                <img
                  src="/images/moogle-fishing.jpg"
                  width="640"
                  height="602"
                  alt="A moogle enjoying a quiet afternoon fishing, illustrated by Toshiyuki Itahana"
                  draggable={false}
                />
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
                <span>See you in game.</span>
                <svg viewBox="0 0 96 12" fill="none" focusable="false">
                  <path
                    d="M2 6q18-4 35 0m22 0q17-4 35 0M48 1l1.5 3.5L53 6l-3.5 1.5L48 11l-1.5-3.5L43 6l3.5-1.5Z"
                    stroke="currentColor"
                    strokeWidth=".8"
                  />
                </svg>
              </p>
              <Link to="/chronicle" className="nook-letter">
                <NookPressedFlower />
                <span className="nook-paperclip" aria-hidden="true" />
                <span className="nook-letter-title">The Chronicle</span>
                <span className="nook-letter-copy">Recent FC activity.</span>
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

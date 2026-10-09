import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { useTheme, THEME_DEFINITIONS } from "@/shared/contexts/ThemeContext";
import { useIsMobile } from "@/shared/hooks/useMobile";
import { useStickyToolbar } from "@/shared/hooks/useStickyToolbar";
import { AppearanceSection } from "./AppearanceSection";
import { AccessibilitySection } from "./AccessibilitySection";
import { AccountSection } from "./AccountSection";
import { SettingsIcon, type SettingsIconName } from "./SettingsIcons";
import gamingMoogle from "@/assets/moogles/gaming moogle.webp";
import "./settings-screen.css";

const SECTIONS: {
  id: string;
  label: string;
  icon: SettingsIconName;
}[] = [
  {
    id: "appearance",
    label: "Appearance",
    icon: "palette",
  },
  {
    id: "accessibility",
    label: "Accessibility",
    icon: "eye",
  },
  {
    id: "account",
    label: "Account",
    icon: "user",
  },
];

export function Settings() {
  const [section, setSection] = useState("appearance");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const layoutRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousSection = useRef(section);
  useStickyToolbar(layoutRef, navRef);
  const isMobile = useIsMobile(760);
  useLayoutEffect(() => {
    if (previousSection.current === section) return;
    previousSection.current = section;
    const panel = panelRef.current;
    if (!panel) return;
    const clearance =
      isMobile && navRef.current?.dataset.stickyDisabled !== "true"
        ? (navRef.current?.getBoundingClientRect().bottom ?? 0) + 16
        : 28;
    const top = panel.getBoundingClientRect().top;
    if (top < clearance || top > window.innerHeight) {
      panel.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [section, isMobile]);
  const { settings, isDarkMode, activeEvent, isEventThemeActive } = useTheme();
  const themeName = isEventThemeActive
    ? activeEvent?.name
    : THEME_DEFINITIONS.find((theme) => theme.id === settings.colorTheme)?.name;
  const changeTabWithKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const previousKey = isMobile ? "ArrowLeft" : "ArrowUp";
    const nextKey = isMobile ? "ArrowRight" : "ArrowDown";
    if (![previousKey, nextKey, "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? SECTIONS.length - 1
          : (index + (event.key === nextKey ? 1 : -1) + SECTIONS.length) %
            SECTIONS.length;
    setSection(SECTIONS[next].id);
    tabs.current[next]?.focus({ preventScroll: true });
  };
  return (
    <div className="settings-screen" data-mode={isDarkMode ? "dark" : "light"}>
      <div className="settings-content">
        <header className="settings-masthead">
          <div>
            <h1>
              Settings <SettingsIcon name="sparkles" size={28} />
            </h1>
          </div>
          <Link to="/" className="settings-home-link">
            Back to home <SettingsIcon name="arrow-right" size={17} />
          </Link>
        </header>
        <div className="settings-layout" ref={layoutRef}>
          <aside className="settings-sidebar">
            <div
              className="settings-nav"
              ref={navRef}
              role="tablist"
              aria-label="Settings sections"
              aria-orientation={isMobile ? "horizontal" : "vertical"}
            >
              {SECTIONS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`settings-tab-${item.id}`}
                  aria-controls={`settings-panel-${item.id}`}
                  aria-selected={section === item.id}
                  tabIndex={section === item.id ? 0 : -1}
                  ref={(element) => {
                    tabs.current[index] = element;
                  }}
                  onClick={() => setSection(item.id)}
                  onKeyDown={(event) => changeTabWithKey(event, index)}
                >
                  <SettingsIcon name={item.icon} size={22} />
                  <span>
                    <strong>{item.label}</strong>
                  </span>
                  <SettingsIcon
                    name="arrow-right"
                    size={16}
                    className="settings-nav-arrow"
                  />
                </button>
              ))}
            </div>
            <div
              className="settings-room-preview"
              aria-label="Current appearance"
            >
              <span className="settings-preview-tape" aria-hidden="true" />
              <div className="settings-preview-window" aria-hidden="true">
                <span className="settings-preview-swatch" />
                <img src={gamingMoogle} alt="" />
                <span className="settings-preview-lines">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <p>{themeName}</p>
              <span>
                {settings.colorMode === "system"
                  ? `Following your device · ${isDarkMode ? "dark" : "light"}`
                  : `${isDarkMode ? "Dark" : "Light"} appearance`}
              </span>
            </div>
          </aside>
          <div className="settings-panels" ref={panelRef}>
            <div
              id="settings-panel-appearance"
              role="tabpanel"
              aria-labelledby="settings-tab-appearance"
              hidden={section !== "appearance"}
              tabIndex={0}
            >
              <AppearanceSection />
            </div>
            <div
              id="settings-panel-accessibility"
              role="tabpanel"
              aria-labelledby="settings-tab-accessibility"
              hidden={section !== "accessibility"}
              tabIndex={0}
            >
              <AccessibilitySection />
            </div>
            <div
              id="settings-panel-account"
              role="tabpanel"
              aria-labelledby="settings-tab-account"
              hidden={section !== "account"}
              tabIndex={0}
            >
              <AccountSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

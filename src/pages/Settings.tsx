import { useState, type ReactNode, type CSSProperties } from "react";
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  LogOut,
  ChevronDown,
  CalendarDays,
  Ban,
  Accessibility,
  Eye,
  User,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  useAccessibility,
  COLORBLIND_MODES,
  type ColorblindMode,
  type ToggleableSettingKey,
} from "../contexts/AccessibilityContext";
import {
  useTheme,
  THEME_DEFINITIONS,
  type ColorMode,
  type EventOverride,
} from "../contexts/ThemeContext";
import { SEASONAL_EVENTS } from "../constants/seasonalEvents";
import {
  PageLayout,
  KawaiiSparkle,
  KawaiiBow,
  KawaiiHeart,
} from "../components";

import gamingMoogle from "../assets/moogles/gaming moogle.webp";
import musicMoogle from "../assets/moogles/moogle playing music.webp";
import lilGuyMoogle from "../assets/moogles/lil guy moogle.webp";

function ToggleSwitch({
  enabled,
  onChange,
  disabled = false,
  label,
}: {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      className={`relative w-[50px] h-[28px] rounded-full shrink-0 cursor-pointer transition-colors duration-200
        focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:outline-none
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${enabled ? "bg-[var(--primary)]" : "bg-[color:color-mix(in_srgb,var(--text-subtle)_28%,transparent)]"}`}
      style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.18)" }}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-md transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${enabled ? "translate-x-[22px]" : "translate-x-0"}`}
      />
    </button>
  );
}

function SettingRow({
  label,
  description,
  children,
  disabled = false,
}: {
  label: string;
  description: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-3 ${disabled ? "opacity-50" : ""}`}
    >
      <div className="min-w-0">
        <p className="font-display font-bold text-sm text-[var(--text)]">
          {label}
        </p>
        <p className="font-soft text-xs text-[var(--text-muted)] leading-relaxed">
          {description}
        </p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Collapsible({
  icon: Icon,
  label,
  value,
  accent = "var(--primary)",
  children,
}: {
  icon: LucideIcon;
  label: string;
  value?: string;
  accent?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t-2 border-dashed border-[color:color-mix(in_srgb,var(--primary)_15%,transparent)] mt-4 pt-3">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center gap-2 cursor-pointer rounded-xl py-0.5 text-left focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
      >
        <Icon
          className="w-4 h-4 shrink-0"
          style={{ color: accent }}
          aria-hidden="true"
        />
        <span className="font-display font-bold text-sm text-[var(--text)]">
          {label}
        </span>
        {value && (
          <span className="font-soft text-xs text-[var(--primary)] truncate">
            {value}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 ml-auto shrink-0 text-[var(--text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="mt-3 animate-[fadeSlideIn_0.25s_ease-out]">
          {children}
        </div>
      )}
    </div>
  );
}

function SettingsCard({
  icon: Icon,
  title,
  accent,
  pinColor,
  tilt = 0,
  children,
}: {
  icon: LucideIcon;
  title: string;
  accent: string;
  pinColor: string;
  tilt?: number;
  children: ReactNode;
}) {
  return (
    <section
      className="paper relative"
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      <span
        className="pushpin absolute -top-2 left-8 z-10"
        style={{ "--pin": pinColor } as CSSProperties}
        aria-hidden="true"
      />
      <div className="surface p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <span
            className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
            style={{
              backgroundColor: `color-mix(in srgb, ${accent} 18%, var(--card))`,
              border: `2px solid color-mix(in srgb, ${accent} 32%, var(--card))`,
            }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: accent }}
              aria-hidden="true"
            />
          </span>
          <h2 className="font-display font-bold text-lg text-[var(--text)]">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function ThemeSection() {
  const { settings, setColorMode, setColorTheme } = useTheme();
  const modeOptions: { value: ColorMode; label: string; icon: LucideIcon }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];
  const currentTheme = THEME_DEFINITIONS.find(
    (t) => t.id === settings.colorTheme,
  );

  return (
    <SettingsCard
      icon={Palette}
      title="Appearance"
      accent="var(--primary)"
      pinColor="var(--secondary)"
      tilt={-0.5}
    >
      <fieldset aria-label="Color mode">
        <legend className="font-soft text-xs text-[var(--text-muted)] mb-2">
          Mode
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {modeOptions.map(({ value, label, icon: Icon }) => {
            const sel = settings.colorMode === value;
            return (
              <button
                key={value}
                onClick={() => setColorMode(value)}
                aria-pressed={sel}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-2xl border-2 font-display font-bold text-xs cursor-pointer transition-all
                  focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
                  ${
                    sel
                      ? "bg-[var(--primary)] text-white border-transparent"
                      : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:border-[color:color-mix(in_srgb,var(--primary)_35%,var(--border))] hover:text-[var(--text)]"
                  }`}
                style={
                  sel
                    ? {
                        boxShadow:
                          "0 3px 0 0 color-mix(in srgb, var(--primary) 55%, #000)",
                      }
                    : undefined
                }
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Collapsible
        icon={Palette}
        label="Color Theme"
        value={currentTheme?.name}
        accent="var(--secondary)"
      >
        <div
          className="grid grid-cols-2 gap-2"
          role="radiogroup"
          aria-label="Color theme options"
        >
          {THEME_DEFINITIONS.map((theme) => {
            const sel = settings.colorTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setColorTheme(theme.id)}
                role="radio"
                aria-checked={sel}
                className={`flex items-center gap-2.5 p-2.5 rounded-2xl border-2 text-left cursor-pointer transition-all
                  focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
                  ${
                    sel
                      ? "border-[var(--primary)] bg-[color:color-mix(in_srgb,var(--primary)_10%,var(--card))]"
                      : "border-[var(--border)] hover:border-[color:color-mix(in_srgb,var(--primary)_30%,var(--border))]"
                  }`}
              >
                <span className="flex items-center gap-0.5 shrink-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: theme.preview.primary }}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: theme.preview.secondary }}
                  />
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.preview.accent }}
                  />
                </span>
                <span
                  className={`font-soft text-sm flex-1 truncate ${sel ? "text-[var(--primary)] font-bold" : "text-[var(--text)]"}`}
                >
                  {theme.name}
                </span>
                {sel && (
                  <Check
                    className="w-4 h-4 text-[var(--primary)] shrink-0"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </Collapsible>
    </SettingsCard>
  );
}

// dev-only event override options for the switcher
const EVENT_OVERRIDE_OPTIONS: {
  value: EventOverride;
  label: string;
  Icon: LucideIcon;
}[] = [
  { value: "auto", label: "Auto (Real Date)", Icon: CalendarDays },
  { value: "none", label: "No Event", Icon: Ban },
  ...SEASONAL_EVENTS.map((e) => ({
    value: e.id as EventOverride,
    label: e.name,
    Icon: e.icon,
  })),
];

function formatDateRange(
  startMonth: number,
  startDay: number,
  endMonth: number,
  endDay: number,
): string {
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (startMonth === endMonth)
    return `${months[startMonth]} ${startDay}–${endDay}`;
  return `${months[startMonth]} ${startDay} – ${months[endMonth]} ${endDay}`;
}

function SeasonalEventSection() {
  const {
    activeEvent,
    nextEvent,
    isEventThemeActive,
    settings,
    setEventThemingDisabled,
    eventOverride,
    setEventOverride,
  } = useTheme();

  return (
    <SettingsCard
      icon={CalendarDays}
      title="Seasonal Events"
      accent="var(--accent)"
      pinColor="var(--primary)"
      tilt={0.5}
    >
      {import.meta.env.DEV && (
        <div className="mb-4 p-3 rounded-2xl border-2 border-dashed border-amber-500/40 bg-amber-500/5">
          <p className="font-display font-bold text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2">
            Dev: Event Override
            {eventOverride !== "auto" && (
              <span className="ml-1.5 font-soft normal-case tracking-normal text-amber-500">
                ({eventOverride})
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {EVENT_OVERRIDE_OPTIONS.map(({ value, label, Icon }) => {
              const sel = eventOverride === value;
              return (
                <button
                  key={value}
                  onClick={() => setEventOverride(value)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-soft cursor-pointer transition-colors
                    focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none
                    ${sel ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold" : "text-[var(--text-muted)] hover:bg-[var(--bg)]"}`}
                >
                  <Icon className="w-3 h-3" aria-hidden="true" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeEvent ? (
        <div className="mb-3 flex items-start gap-2.5 p-3 rounded-2xl bg-[color:color-mix(in_srgb,var(--primary)_9%,var(--card))]">
          <activeEvent.icon
            className="w-4 h-4 mt-0.5 shrink-0 text-[var(--primary)]"
            aria-hidden="true"
          />
          <p className="font-soft text-sm text-[var(--text-muted)]">
            <strong className="text-[var(--primary)] font-bold">
              {activeEvent.name}
            </strong>{" "}
            is here, kupo - {activeEvent.description}
          </p>
        </div>
      ) : nextEvent ? (
        <p className="mb-3 font-soft text-sm text-[var(--text-muted)]">
          Next up:{" "}
          <strong className="text-[var(--text)] font-semibold">
            {nextEvent.name}
          </strong>{" "}
          (
          {formatDateRange(
            nextEvent.dateRange.startMonth,
            nextEvent.dateRange.startDay,
            nextEvent.dateRange.endMonth,
            nextEvent.dateRange.endDay,
          )}
          )
        </p>
      ) : null}

      <SettingRow
        label="Event Themes"
        description={
          isEventThemeActive
            ? "A seasonal theme is dressing up the site"
            : "Automatically dress up the site for events"
        }
      >
        <ToggleSwitch
          label="Event themes"
          enabled={!settings.eventThemingDisabled}
          onChange={() =>
            setEventThemingDisabled(!settings.eventThemingDisabled)
          }
        />
      </SettingRow>

      <Collapsible
        icon={CalendarDays}
        label="Event Calendar"
        accent="var(--accent)"
      >
        <ul className="space-y-1">
          {SEASONAL_EVENTS.map((event) => {
            const isActive = activeEvent?.id === event.id;
            const EventIcon = event.icon;
            return (
              <li
                key={event.id}
                className={`flex items-center gap-2.5 py-1.5 px-2.5 rounded-xl text-sm ${isActive ? "bg-[color:color-mix(in_srgb,var(--primary)_10%,var(--card))]" : ""}`}
              >
                <EventIcon
                  className={`w-4 h-4 shrink-0 ${isActive ? "text-[var(--primary)]" : "text-[var(--text-muted)]"}`}
                  aria-hidden="true"
                />
                <span
                  className={`font-soft ${isActive ? "text-[var(--primary)] font-bold" : "text-[var(--text)]"}`}
                >
                  {event.name}
                </span>
                <span className="font-soft text-xs text-[var(--text-muted)] ml-auto">
                  {formatDateRange(
                    event.dateRange.startMonth,
                    event.dateRange.startDay,
                    event.dateRange.endMonth,
                    event.dateRange.endDay,
                  )}
                </span>
                <span className="flex items-center gap-0.5 shrink-0">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: event.preview.primary }}
                  />
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: event.preview.secondary }}
                  />
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: event.preview.accent }}
                  />
                </span>
              </li>
            );
          })}
        </ul>
      </Collapsible>
    </SettingsCard>
  );
}

interface AccessibilityOption {
  key: ToggleableSettingKey;
  label: string;
  description: string;
  requiresDark?: boolean;
}

const ACCESSIBILITY_OPTIONS: AccessibilityOption[] = [
  {
    key: "highContrast",
    label: "High Contrast",
    description: "Increases color contrast for better visibility",
  },
  {
    key: "extraDark",
    label: "Extra Dark",
    description: "Deeper blacks for OLED screens",
    requiresDark: true,
  },
  {
    key: "largeText",
    label: "Large Text",
    description: "Increases font size across the site",
  },
  {
    key: "reducedMotion",
    label: "Reduce Motion",
    description: "Minimizes animations and transitions",
  },
  {
    key: "enhancedFocus",
    label: "Enhanced Focus",
    description: "More visible focus indicators",
  },
  {
    key: "dyslexiaFont",
    label: "Dyslexia-Friendly",
    description: "Easier-to-read font spacing",
  },
];

function AccessibilitySection() {
  const { settings, toggleSetting, updateSetting } = useAccessibility();
  const { isDarkMode } = useTheme();

  return (
    <SettingsCard
      icon={Accessibility}
      title="Accessibility"
      accent="var(--secondary)"
      pinColor="var(--accent)"
      tilt={-0.4}
    >
      <div className="divide-y divide-[color:color-mix(in_srgb,var(--text-subtle)_16%,transparent)]">
        {ACCESSIBILITY_OPTIONS.map(
          ({ key, label, description, requiresDark }) => {
            const isDisabled = requiresDark && !isDarkMode;
            return (
              <SettingRow
                key={key}
                label={label}
                description={
                  isDisabled ? `${description} (needs dark mode)` : description
                }
                disabled={isDisabled}
              >
                <ToggleSwitch
                  label={label}
                  enabled={settings[key]}
                  onChange={() => toggleSetting(key)}
                  disabled={isDisabled}
                />
              </SettingRow>
            );
          },
        )}
      </div>

      <Collapsible
        icon={Eye}
        label="Colorblind Mode"
        accent="var(--secondary)"
        value={
          settings.colorblindMode !== "none"
            ? COLORBLIND_MODES.find((m) => m.value === settings.colorblindMode)
                ?.label
            : undefined
        }
      >
        <div
          className="space-y-1"
          role="radiogroup"
          aria-label="Colorblind mode options"
        >
          {COLORBLIND_MODES.map(({ value, label, description }) => {
            const sel = settings.colorblindMode === value;
            return (
              <button
                key={value}
                onClick={() =>
                  updateSetting("colorblindMode", value as ColorblindMode)
                }
                role="radio"
                aria-checked={sel}
                className={`w-full flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-left cursor-pointer transition-colors
                  focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
                  ${sel ? "bg-[color:color-mix(in_srgb,var(--primary)_10%,var(--card))]" : "hover:bg-[var(--bg)]"}`}
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${sel ? "border-[var(--primary)] bg-[var(--primary)]" : "border-[color:color-mix(in_srgb,var(--text-muted)_45%,transparent)]"}`}
                >
                  {sel && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={`font-soft text-sm ${sel ? "text-[var(--primary)] font-bold" : "text-[var(--text)]"}`}
                  >
                    {label}
                  </span>
                  <span className="font-soft text-xs text-[var(--text-muted)] ml-1">
                    - {description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Collapsible>
    </SettingsCard>
  );
}

function AccountSection() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();

  return (
    <SettingsCard
      icon={User}
      title="Account"
      accent="var(--primary)"
      pinColor="var(--secondary)"
      tilt={0.5}
    >
      {isLoading ? (
        <p className="font-soft text-sm text-[var(--text-muted)]">Loading…</p>
      ) : !isAuthenticated || !user ? (
        <p className="font-soft text-sm text-[var(--text-muted)]">
          Sign in with Discord using the button in the navigation bar, kupo~
        </p>
      ) : (
        <>
          <div className="flex items-center gap-3.5 mb-4">
            <div className="paper shrink-0 -rotate-3">
              <div className="surface p-1.5">
                <img
                  src={user.memberPortraitUrl}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover"
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-base text-[var(--text)] truncate">
                {user.memberName}
              </p>
              <p className="font-soft text-sm text-[var(--text-muted)]">
                {user.memberRank}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="gel hover-bounce inline-flex items-center gap-2 px-4 py-2 font-display font-bold text-sm text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none touch-manipulation"
            style={{ "--gel-color": "#e8607a" } as CSSProperties}
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Sign Out
          </button>
        </>
      )}
    </SettingsCard>
  );
}

export function Settings() {
  return (
    <PageLayout
      moogles={{ primary: gamingMoogle, secondary: musicMoogle }}
      maxWidth="max-w-2xl"
    >
      <div className="corkboard relative px-3.5 py-7 sm:px-6 sm:py-9 md:px-8 md:py-10">
        <span
          className="pushpin absolute top-3 left-3 sm:top-4 sm:left-4 z-20"
          aria-hidden="true"
        />
        <span
          className="pushpin absolute top-3 right-3 sm:top-4 sm:right-4 z-20"
          style={{ "--pin": "var(--secondary)" } as CSSProperties}
          aria-hidden="true"
        />
        <span
          className="pushpin absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20"
          style={{ "--pin": "var(--accent)" } as CSSProperties}
          aria-hidden="true"
        />
        <span
          className="pushpin absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20"
          style={{ "--pin": "var(--secondary)" } as CSSProperties}
          aria-hidden="true"
        />

        <img
          src={lilGuyMoogle}
          alt=""
          aria-hidden="true"
          className="hidden lg:block absolute -top-7 -right-4 w-20 rotate-[10deg] animate-[float-gentle_4s_ease-in-out_infinite] pointer-events-none select-none z-20"
        />

        <header className="relative w-fit mx-auto mb-7 sm:mb-9 text-center animate-[fadeSlideIn_0.4s_ease-out]">
          <span
            className="pushpin absolute -top-2 left-1/2 -translate-x-1/2 z-10"
            aria-hidden="true"
          />
          <div className="surface paper -rotate-1 px-8 sm:px-12 py-5 sm:py-6">
            <div
              className="flex items-center justify-center gap-1.5 mb-1.5"
              aria-hidden="true"
            >
              <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--accent)]" />
              <KawaiiBow className="w-6 h-6 text-[var(--primary)]" />
              <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--secondary)]" />
            </div>
            <p className="eyebrow-script text-lg sm:text-2xl text-[var(--secondary)]/90 mb-1">
              ~ make it yours, kupo ~
            </p>
            <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[var(--text)]">
              <span className="text-highlight">Settings</span>
            </h1>
          </div>
        </header>

        <div className="space-y-7 sm:space-y-9">
          <ThemeSection />
          <SeasonalEventSection />
          <AccessibilitySection />
          <AccountSection />
        </div>

        <p className="flex items-center justify-center gap-1.5 text-center font-soft text-xs text-[var(--text-subtle)] mt-9">
          <KawaiiHeart className="w-3.5 h-3.5 text-[var(--primary)]" />
          Everything saves to your browser automatically, kupo~
        </p>
      </div>
    </PageLayout>
  );
}

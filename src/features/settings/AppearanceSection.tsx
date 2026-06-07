import { memo } from "react";
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  CalendarDays,
  Ban,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  useTheme,
  THEME_DEFINITIONS,
  type ColorMode,
  type ColorTheme,
  type ThemeDefinition,
  type EventOverride,
} from "@/shared/contexts/ThemeContext";
import { SEASONAL_EVENTS } from "@/shared/constants/seasonalEvents";
import {
  SettingsCard,
  SettingRow,
  Collapsible,
  ToggleSwitch,
} from "@/features/settings/SettingsControls";

// the only theme that stays selectable while an event dresses up the site
const DEFAULT_THEME_ID: ColorTheme = "pom-pom";

const MODE_OPTIONS: { value: ColorMode; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const MONTHS = [
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

function formatDateRange(
  startMonth: number,
  startDay: number,
  endMonth: number,
  endDay: number,
): string {
  if (startMonth === endMonth)
    return `${MONTHS[startMonth]} ${startDay}–${endDay}`;
  return `${MONTHS[startMonth]} ${startDay} – ${MONTHS[endMonth]} ${endDay}`;
}

// a rich preview tile - the theme's identity gradient + its name in its own
// title font, ringed when selected. Disabled while an event theme has the
// site dressed up (only the default stays pickable then).
const ThemeTile = memo(function ThemeTile({
  theme,
  selected,
  disabled = false,
  onSelect,
}: {
  theme: ThemeDefinition;
  selected: boolean;
  disabled?: boolean;
  onSelect: (id: ColorTheme) => void;
}) {
  const { primary, secondary, accent } = theme.preview;
  return (
    <button
      type="button"
      onClick={() => onSelect(theme.id)}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={theme.name}
      className={`group relative overflow-hidden rounded-2xl border-2 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] ${
        disabled
          ? "cursor-not-allowed opacity-45"
          : "cursor-pointer hover:-translate-y-0.5"
      }`}
      style={{
        borderColor: selected
          ? primary
          : "color-mix(in srgb, var(--text-subtle) 22%, transparent)",
        boxShadow: selected
          ? `0 0 0 3px color-mix(in srgb, ${primary} 26%, transparent)`
          : undefined,
      }}
    >
      <div
        className="relative flex h-14 items-center justify-center px-2"
        style={{
          background: `linear-gradient(135deg, ${primary}, ${secondary})`,
        }}
      >
        <span
          className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full"
          style={{
            background: accent,
            boxShadow: "0 0 0 1.5px rgba(255,255,255,0.6)",
          }}
          aria-hidden="true"
        />
        <span
          className="line-clamp-2 text-center font-display text-sm font-bold leading-tight text-white"
          style={{
            fontFamily: theme.displayFont,
            textShadow: "0 1px 3px rgba(0,0,0,0.4)",
            // expansion themes (those with a title font) read all-caps, like
            // their logos and page titles
            textTransform: theme.displayFont ? "uppercase" : undefined,
            letterSpacing: theme.displayFont ? "0.02em" : undefined,
          }}
        >
          {theme.name}
        </span>
        {selected && (
          <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
            <Check className="h-3.5 w-3.5" style={{ color: primary }} />
          </span>
        )}
      </div>
    </button>
  );
});

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

// Unified "Appearance": mode + theme picker + seasonal-event handling in one
// place, with the event override surfaced (events otherwise silently replace the
// chosen theme).
export function AppearanceSection() {
  const {
    settings,
    setColorMode,
    setColorTheme,
    activeEvent,
    nextEvent,
    isEventThemeActive,
    setEventThemingDisabled,
    eventOverride,
    setEventOverride,
  } = useTheme();

  const eventEnd = activeEvent
    ? `${MONTHS[activeEvent.dateRange.endMonth]} ${activeEvent.dateRange.endDay}`
    : "";

  return (
    <SettingsCard
      icon={Palette}
      title="Appearance"
      accent="var(--primary)"
      pinColor="var(--secondary)"
      tilt={-0.5}
    >
      {/* mode */}
      <fieldset aria-label="Color mode">
        <legend className="mb-2 font-soft text-xs text-[var(--text-muted)]">
          Mode
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {MODE_OPTIONS.map(({ value, label, icon: Icon }) => {
            const sel = settings.colorMode === value;
            return (
              <button
                key={value}
                onClick={() => setColorMode(value)}
                aria-pressed={sel}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 py-2.5 font-display text-xs font-bold cursor-pointer transition-all
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]
                  ${
                    sel
                      ? "border-transparent bg-[var(--primary)] text-white"
                      : "border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)] hover:border-[color:color-mix(in_srgb,var(--primary)_35%,var(--border))] hover:text-[var(--text)]"
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
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* active-event banner - explains the override + lets you act on it */}
      {activeEvent && (
        <div
          className="mt-4 flex items-start gap-2.5 rounded-2xl p-3"
          style={{
            background: "color-mix(in srgb, var(--primary) 10%, var(--card))",
            border:
              "2px solid color-mix(in srgb, var(--primary) 22%, transparent)",
          }}
        >
          <activeEvent.icon
            className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]"
            aria-hidden="true"
          />
          <div className="min-w-0">
            {isEventThemeActive ? (
              <>
                <p className="font-soft text-sm text-[var(--text-muted)]">
                  <strong className="font-bold text-[var(--primary)]">
                    {activeEvent.name}
                  </strong>{" "}
                  is dressing up the site, kupo~ Your theme resumes after{" "}
                  {eventEnd}.
                </p>
                <button
                  onClick={() => setEventThemingDisabled(true)}
                  className="mt-1.5 font-display text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer"
                >
                  Keep my theme instead
                </button>
              </>
            ) : (
              <>
                <p className="font-soft text-sm text-[var(--text-muted)]">
                  <strong className="font-bold text-[var(--text)]">
                    {activeEvent.name}
                  </strong>{" "}
                  is here - want it to dress up the site?
                </p>
                <button
                  onClick={() => setEventThemingDisabled(false)}
                  className="mt-1.5 font-display text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer"
                >
                  Dress it up
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* theme picker */}
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="font-soft text-xs text-[var(--text-muted)]">
            Theme
          </span>
          {isEventThemeActive && (
            <span className="font-soft text-xs italic text-[var(--text-subtle)]">
              (paused while {activeEvent?.name} is active)
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {THEME_DEFINITIONS.map((theme) => (
            <ThemeTile
              key={theme.id}
              theme={theme}
              selected={settings.colorTheme === theme.id}
              disabled={isEventThemeActive && theme.id !== DEFAULT_THEME_ID}
              onSelect={setColorTheme}
            />
          ))}
        </div>
      </div>

      {/* seasonal events */}
      <SettingRow
        label="Seasonal event themes"
        description="Let FFXIV seasonal events dress up the whole site"
      >
        <ToggleSwitch
          label="Seasonal event themes"
          enabled={!settings.eventThemingDisabled}
          onChange={() =>
            setEventThemingDisabled(!settings.eventThemingDisabled)
          }
        />
      </SettingRow>

      {!activeEvent && nextEvent && (
        <p className="-mt-1 font-soft text-xs text-[var(--text-muted)]">
          Next up:{" "}
          <strong className="font-semibold text-[var(--text)]">
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
      )}

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
                className={`flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-sm ${isActive ? "bg-[color:color-mix(in_srgb,var(--primary)_10%,var(--card))]" : ""}`}
              >
                <EventIcon
                  className={`h-4 w-4 shrink-0 ${isActive ? "text-[var(--primary)]" : "text-[var(--text-muted)]"}`}
                  aria-hidden="true"
                />
                <span
                  className={`font-soft ${isActive ? "font-bold text-[var(--primary)]" : "text-[var(--text)]"}`}
                >
                  {event.name}
                </span>
                <span className="ml-auto font-soft text-xs text-[var(--text-muted)]">
                  {formatDateRange(
                    event.dateRange.startMonth,
                    event.dateRange.startDay,
                    event.dateRange.endMonth,
                    event.dateRange.endDay,
                  )}
                </span>
                <span className="flex shrink-0 items-center gap-0.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: event.preview.primary }}
                  />
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: event.preview.secondary }}
                  />
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: event.preview.accent }}
                  />
                </span>
              </li>
            );
          })}
        </ul>
      </Collapsible>

      {import.meta.env.DEV && (
        <div className="mt-4 rounded-2xl border-2 border-dashed border-amber-500/40 bg-amber-500/5 p-3">
          <p className="mb-2 font-display text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
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
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-soft text-xs cursor-pointer transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500
                    ${sel ? "bg-amber-500/20 font-bold text-amber-700 dark:text-amber-300" : "text-[var(--text-muted)] hover:bg-[var(--bg)]"}`}
                >
                  <Icon className="h-3 w-3" aria-hidden="true" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </SettingsCard>
  );
}

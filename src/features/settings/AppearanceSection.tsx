import { useId, useRef } from "react";
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
} from "./SettingsControls";
import { SettingsIcon, type SettingsIconName } from "./SettingsIcons";
import "./settings-appearance.css";

const MODE_OPTIONS: {
  value: ColorMode;
  label: string;
  icon: SettingsIconName;
}[] = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "system", label: "System", icon: "monitor" },
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

function PaletteSwatches({ preview }: { preview: ThemeDefinition["preview"] }) {
  return (
    <span className="settings-palette-swatches" aria-hidden="true">
      <span style={{ backgroundColor: preview.primary }} />
      <span style={{ backgroundColor: preview.secondary }} />
      <span style={{ backgroundColor: preview.accent }} />
    </span>
  );
}

function ThemeTile({
  theme,
  selected,
  groupName,
  savedForLater,
  onSelect,
}: {
  theme: ThemeDefinition;
  selected: boolean;
  groupName: string;
  savedForLater: boolean;
  onSelect: (id: ColorTheme) => void;
}) {
  const id = useId();
  return (
    <label className="settings-theme-tile" data-selected={selected}>
      <span className="settings-theme-tile-top">
        <PaletteSwatches preview={theme.preview} />
        <input
          className="settings-appearance-radio"
          type="radio"
          name={groupName}
          value={theme.id}
          checked={selected}
          onChange={() => onSelect(theme.id)}
          aria-labelledby={`${id}-name`}
          aria-describedby={`${id}-description`}
        />
      </span>
      <span
        className="settings-theme-name"
        id={`${id}-name`}
        style={
          theme.displayFont ? { fontFamily: theme.displayFont } : undefined
        }
      >
        {theme.name}
      </span>
      <span className="settings-theme-description" id={`${id}-description`}>
        {theme.description}
      </span>
      <span className="settings-theme-selected" aria-hidden="true">
        {selected && (
          <>
            <SettingsIcon name="check" size={15} />
            {savedForLater ? "Saved base theme" : "Selected"}
          </>
        )}
      </span>
    </label>
  );
}

export function AppearanceSection() {
  const id = useId();
  const seasonalSwitchRef = useRef<HTMLButtonElement>(null);
  const {
    settings,
    isDarkMode,
    setColorMode,
    setColorTheme,
    activeEvent,
    nextEvent,
    isEventThemeActive,
    setEventThemingDisabled,
    eventOverride,
    setEventOverride,
  } = useTheme();
  const savedTheme = THEME_DEFINITIONS.find(
    (theme) => theme.id === settings.colorTheme,
  );
  const savedThemeName = savedTheme?.name ?? "Your base theme";
  const isDevelopmentPreview = import.meta.env.DEV && eventOverride !== "auto";
  const eventEnd = activeEvent
    ? `${MONTHS[activeEvent.dateRange.endMonth]} ${activeEvent.dateRange.endDay}`
    : "";
  const changeSeasonalTheme = (disabled: boolean) => {
    setEventThemingDisabled(disabled);
    seasonalSwitchRef.current?.focus({ preventScroll: true });
  };

  return (
    <SettingsCard
      icon="palette"
      title="Appearance"
      description="Choose your colors and seasonal decorations."
    >
      <div className="settings-appearance">
        <fieldset
          className="settings-fieldset"
          aria-describedby={`${id}-mode-help`}
        >
          <legend className="settings-subheading">Color mode</legend>
          <div className="settings-mode-options">
            {MODE_OPTIONS.map(({ value, label, icon }) => (
              <label
                className="settings-mode-option"
                data-selected={settings.colorMode === value}
                key={value}
              >
                <SettingsIcon name={icon} size={22} aria-hidden="true" />
                <span id={`${id}-mode-${value}`}>{label}</span>
                <input
                  className="settings-appearance-radio"
                  type="radio"
                  name={`${id}-mode`}
                  value={value}
                  checked={settings.colorMode === value}
                  onChange={() => setColorMode(value)}
                  aria-labelledby={`${id}-mode-${value}`}
                />
              </label>
            ))}
          </div>
          <p
            className="settings-help settings-mode-help"
            id={`${id}-mode-help`}
          >
            {settings.colorMode === "system"
              ? `Following your device. ${isDarkMode ? "Dark" : "Light"} mode is active now.`
              : `${settings.colorMode === "dark" ? "Dark" : "Light"} mode stays on until you change it. System follows your device.`}
          </p>
        </fieldset>

        <fieldset
          className="settings-fieldset settings-base-theme"
          aria-describedby={`${id}-theme-help`}
        >
          <legend className="settings-subheading">Base theme</legend>
          <p className="settings-description" id={`${id}-theme-help`}>
            Pick the colors you want between seasonal events.
          </p>

          {isEventThemeActive && activeEvent && (
            <div
              className="settings-event-notice"
              role="status"
              aria-live="polite"
            >
              <SettingsIcon name="calendar" size={23} aria-hidden="true" />
              <div>
                <p className="settings-event-notice-title">
                  On screen: {activeEvent.name}
                </p>
                <p>
                  {isDevelopmentPreview
                    ? `${savedThemeName} is saved as your base theme. A development preview is overriding the calendar.`
                    : `${savedThemeName} is saved and returns after ${eventEnd}. You can choose a different base theme below.`}
                </p>
                <button
                  type="button"
                  className="settings-button settings-event-action"
                  onClick={() => changeSeasonalTheme(true)}
                >
                  Use my base theme now
                  <SettingsIcon
                    name="arrow-right"
                    size={16}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          )}

          <div className="settings-theme-grid">
            {THEME_DEFINITIONS.map((theme) => (
              <ThemeTile
                key={theme.id}
                theme={theme}
                selected={settings.colorTheme === theme.id}
                groupName={`${id}-theme`}
                savedForLater={isEventThemeActive}
                onSelect={setColorTheme}
              />
            ))}
          </div>
        </fieldset>

        <div className="settings-seasonal-group">
          <SettingRow
            label="Seasonal event themes"
            description="Change colors for FFXIV seasonal events, then return to your base theme."
          >
            <ToggleSwitch
              buttonRef={seasonalSwitchRef}
              label="Seasonal event themes"
              enabled={!settings.eventThemingDisabled}
              onChange={() =>
                setEventThemingDisabled(!settings.eventThemingDisabled)
              }
              describedBy={`${id}-seasonal-status`}
            />
          </SettingRow>

          <div
            className="settings-seasonal-status"
            id={`${id}-seasonal-status`}
          >
            <SettingsIcon name="calendar" size={19} aria-hidden="true" />
            <div>
              <p>
                {isEventThemeActive && activeEvent
                  ? `${activeEvent.name} is active${isDevelopmentPreview ? " as a development preview" : ` through ${eventEnd}`}.`
                  : settings.eventThemingDisabled
                    ? `Seasonal themes are off. ${savedThemeName} stays active.`
                    : "Your base theme is active between seasonal events."}
              </p>
              {activeEvent && !isEventThemeActive && (
                <>
                  <p>You can use the {activeEvent.name} theme now.</p>
                  <button
                    type="button"
                    className="settings-button settings-event-action"
                    onClick={() => changeSeasonalTheme(false)}
                  >
                    Use {activeEvent.name} theme
                    <SettingsIcon
                      name="arrow-right"
                      size={16}
                      aria-hidden="true"
                    />
                  </button>
                </>
              )}
              {!activeEvent && nextEvent && (
                <p>
                  Next on the theme calendar: <strong>{nextEvent.name}</strong>,{" "}
                  {formatDateRange(
                    nextEvent.dateRange.startMonth,
                    nextEvent.dateRange.startDay,
                    nextEvent.dateRange.endMonth,
                    nextEvent.dateRange.endDay,
                  )}
                  .
                </p>
              )}
            </div>
          </div>

          <Collapsible
            icon="calendar"
            label="Seasonal theme calendar"
            value={`${SEASONAL_EVENTS.length} events`}
          >
            <p className="settings-help settings-calendar-help">
              MogTome uses these dates for its seasonal themes each year.
            </p>
            <ul className="settings-event-calendar">
              {SEASONAL_EVENTS.map((event) => {
                const isCurrent = activeEvent?.id === event.id;
                return (
                  <li key={event.id} data-current={isCurrent}>
                    <PaletteSwatches preview={event.preview} />
                    <span className="settings-event-calendar-name">
                      {event.name}
                      {isCurrent && (
                        <span className="settings-calendar-badge">
                          {isEventThemeActive
                            ? "Active theme"
                            : "Available now"}
                        </span>
                      )}
                    </span>
                    <span className="settings-event-calendar-date">
                      {formatDateRange(
                        event.dateRange.startMonth,
                        event.dateRange.startDay,
                        event.dateRange.endMonth,
                        event.dateRange.endDay,
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Collapsible>
        </div>

        {import.meta.env.DEV && (
          <details className="settings-event-dev">
            <summary>
              <SettingsIcon name="sliders" size={17} aria-hidden="true" />
              Development: event preview
              <SettingsIcon
                name="chevron"
                className="settings-event-dev-chevron"
                size={16}
                aria-hidden="true"
              />
            </summary>
            <div className="settings-event-dev-body">
              <label htmlFor={`${id}-event-override`}>
                Preview a seasonal event
              </label>
              <select
                id={`${id}-event-override`}
                value={eventOverride}
                onChange={(event) =>
                  setEventOverride(event.target.value as EventOverride)
                }
                aria-describedby={`${id}-event-dev-help`}
              >
                <option value="auto">Follow the real date</option>
                <option value="none">No active event</option>
                {SEASONAL_EVENTS.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
              <p className="settings-help" id={`${id}-event-dev-help`}>
                Overrides the calendar for development. Seasonal themes must be
                on to display an event preview.
              </p>
            </div>
          </details>
        )}
      </div>
    </SettingsCard>
  );
}

import { CalendarDays, Ban } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme, type EventOverride } from "@/contexts/ThemeContext";
import { SEASONAL_EVENTS } from "@/constants/seasonalEvents";
import {
  SettingsCard,
  SettingRow,
  Collapsible,
  ToggleSwitch,
} from "@/components/settings/SettingsControls";

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

export function SeasonalEventSection() {
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

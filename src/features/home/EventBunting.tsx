import { CalendarDays } from "lucide-react";
import { KawaiiStar } from "@/shared/ui/kawaiiMotifs";
import type { SeasonalEvent } from "@/shared/constants/seasonalEvents";
import {
  getEventDaysLeft,
  eventCountdownLabel,
} from "@/features/home/homeData";

const MONTH_ABBR = [
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

/** "Oct 20 – Nov 1" */
function formatEventDates(range: SeasonalEvent["dateRange"]): string {
  return `${MONTH_ABBR[range.startMonth - 1]} ${range.startDay} – ${MONTH_ABBR[range.endMonth - 1]} ${range.endDay}`;
}

// fixed overlay so it spans the full width, sidebar included. Desktop only - on
// phones the dashboard (MobileHome) shows its own compact event ribbon instead.
export function EventBunting({ event }: { event: SeasonalEvent }) {
  const EventIcon = event.icon;
  const daysLeft = getEventDaysLeft(event.dateRange);
  const dates = formatEventDates(event.dateRange);
  const countdown = eventCountdownLabel(daysLeft);

  return (
    <div
      className="fixed inset-x-0 md:top-4 z-20 pointer-events-none hidden md:flex justify-center px-4 select-none"
      role="status"
      aria-label={`Now celebrating ${event.name}. ${dates}. ${countdown}.`}
    >
      <div className="relative -rotate-1 animate-[fadeIn_0.7s_ease-out_0.3s_both]">
        {/* washi tape */}
        <span
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-24 h-6 rotate-[-3deg] rounded-[2px] opacity-80 z-10"
          style={{
            background:
              "repeating-linear-gradient(45deg, color-mix(in srgb, var(--accent) 50%, transparent) 0 7px, color-mix(in srgb, var(--accent) 28%, transparent) 7px 14px)",
          }}
          aria-hidden="true"
        />
        <KawaiiStar
          className="absolute -top-2 -right-2 w-5 h-5 text-[var(--accent)] rotate-12 z-10"
          aria-hidden="true"
        />

        <div
          className="flex items-center gap-2.5 px-3 py-1.5 sm:py-2 rounded-2xl"
          style={{
            background: "color-mix(in srgb, var(--primary) 14%, var(--card))",
            border:
              "2px solid color-mix(in srgb, var(--primary) 45%, var(--card))",
            boxShadow:
              "0 0 0 3px var(--card), 4px 5px 0 0 color-mix(in srgb, var(--primary) 30%, transparent), 0 0 26px -6px color-mix(in srgb, var(--primary) 50%, transparent)",
          }}
        >
          <span
            className="shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full"
            style={{
              background: "color-mix(in srgb, var(--primary) 16%, var(--card))",
              color: "var(--primary)",
            }}
          >
            <EventIcon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
          </span>
          <div className="text-left">
            <p className="eyebrow-script text-sm text-[var(--secondary)] leading-none">
              Now celebrating
            </p>
            <h2 className="font-display font-bold text-sm sm:text-base text-[var(--text)] leading-tight">
              {event.name}
            </h2>
            <p className="text-[10px] font-soft text-[var(--text-muted)] flex items-center gap-1 mt-0.5 flex-wrap">
              <CalendarDays
                className="w-3 h-3 text-[var(--text-subtle)]"
                aria-hidden="true"
              />
              {dates}
              <span className="text-[var(--text-subtle)]">·</span>
              <span className="font-accent text-xs text-[var(--primary)]">
                {countdown}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

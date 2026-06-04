import { motion } from "motion/react";
import { CalendarDays } from "lucide-react";
import { KawaiiStar } from "../kawaiiMotifs";
import type { SeasonalEvent } from "../../constants/seasonalEvents";

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

/** Whole days remaining until the event's end (handles year wrap). */
function getEventDaysLeft(range: SeasonalEvent["dateRange"]): number {
  const now = new Date();
  let end = new Date(
    now.getFullYear(),
    range.endMonth - 1,
    range.endDay,
    23,
    59,
    59,
  );
  if (end.getTime() < now.getTime()) {
    end = new Date(
      now.getFullYear() + 1,
      range.endMonth - 1,
      range.endDay,
      23,
      59,
      59,
    );
  }
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86_400_000));
}

function eventCountdownLabel(daysLeft: number): string {
  if (daysLeft <= 0) return "last day to celebrate!";
  if (daysLeft === 1) return "1 day left to celebrate";
  return `${daysLeft} days left to celebrate`;
}

/**
 * EventBunting — a festive pennant garland strung across the FULL viewport during
 * a seasonal event (mirrors how StarlightOverlay drapes its string lights), with
 * the event name, dates, and countdown centered below. Rendered as a fixed
 * overlay so it spans the whole width — sidebar included.
 */
export function EventBunting({ event }: { event: SeasonalEvent }) {
  const EventIcon = event.icon;
  const daysLeft = getEventDaysLeft(event.dateRange);
  const dates = formatEventDates(event.dateRange);
  const countdown = eventCountdownLabel(daysLeft);

  return (
    <div
      className="fixed inset-x-0 top-[calc(3.5rem+env(safe-area-inset-top))] md:top-4 z-20 pointer-events-none flex justify-center px-4 select-none"
      role="status"
      aria-label={`Now celebrating ${event.name}. ${dates}. ${countdown}.`}
    >
      {/* Kawaii sticker banner */}
      <motion.div
        className="relative -rotate-1"
        initial={{ opacity: 0, y: -12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.7, delay: 0.3 }}
      >
        {/* washi tape across the top */}
        <span
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-24 h-6 rotate-[-3deg] rounded-[2px] opacity-80 z-10"
          style={{
            background:
              "repeating-linear-gradient(45deg, color-mix(in srgb, var(--accent) 50%, transparent) 0 7px, color-mix(in srgb, var(--accent) 28%, transparent) 7px 14px)",
          }}
          aria-hidden="true"
        />
        {/* star sticker corner */}
        <KawaiiStar
          className="absolute -top-2 -right-2 w-5 h-5 text-[var(--accent)] rotate-12 z-10"
          aria-hidden="true"
        />

        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl"
          style={{
            background: "color-mix(in srgb, var(--primary) 14%, var(--card))",
            border:
              "2px solid color-mix(in srgb, var(--primary) 45%, var(--card))",
            boxShadow:
              "0 0 0 3px var(--card), 4px 5px 0 0 color-mix(in srgb, var(--primary) 30%, transparent), 0 0 26px -6px color-mix(in srgb, var(--primary) 50%, transparent)",
          }}
        >
          {/* event icon sticker */}
          <span
            className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full"
            style={{
              background: "color-mix(in srgb, var(--primary) 16%, var(--card))",
              color: "var(--primary)",
            }}
          >
            <EventIcon className="w-6 h-6" aria-hidden="true" />
          </span>
          <div className="text-left">
            <p className="eyebrow-script text-base text-[var(--secondary)] leading-none">
              Now celebrating
            </p>
            <h2 className="font-display font-bold text-base sm:text-lg text-[var(--text)] leading-tight">
              {event.name}
            </h2>
            <p className="text-[11px] font-soft text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5 flex-wrap">
              <CalendarDays
                className="w-3 h-3 text-[var(--text-subtle)]"
                aria-hidden="true"
              />
              {dates}
              <span className="text-[var(--text-subtle)]">·</span>
              <span className="font-accent text-sm text-[var(--primary)]">
                {countdown}
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

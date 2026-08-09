import { useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  chronicleDayId,
  formatChronicleDay,
  type DayGroup,
} from "./chronicleHelpers";
import { ChronicleIcon } from "./ChronicleIcons";
import { useChronicleActiveDay } from "./useChronicleActiveDay";
import "./chronicle-day-index.css";

function dayLabel(group: DayGroup) {
  if (group.label === "Today" || group.label === "Yesterday")
    return group.label;
  const date = new Date(group.items[0]?.event.createdAt ?? "");
  return Number.isNaN(date.getTime())
    ? group.label
    : date.toLocaleDateString("en-US", { weekday: "long" });
}

export function ChronicleDayIndex({
  groups,
  onBackToSearch,
}: {
  groups: DayGroup[];
  onBackToSearch?: () => void;
}) {
  const panelId = useId();
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const activeKey = useChronicleActiveDay(groups);
  const activeGroup =
    groups.find((group) => group.key === activeKey) ?? groups[0];

  useEffect(() => {
    if (!isOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [isOpen]);

  if (groups.length < 2) return null;

  const months: { label: string; days: DayGroup[] }[] = [];
  for (const group of groups) {
    const date = new Date(group.items[0]?.event.createdAt ?? "");
    const label = Number.isNaN(date.getTime())
      ? "Other dates"
      : date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const lastMonth = months.at(-1);
    if (lastMonth?.label === label) lastMonth.days.push(group);
    else months.push({ label, days: [group] });
  }

  const jumpToDay = (key: string) => {
    const heading = document.getElementById(chronicleDayId(key));
    if (!heading) return;
    // Collapse before measuring the target so the mobile panel cannot shift it.
    flushSync(() => setIsOpen(false));
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ behavior: "instant", block: "start" });
  };

  return (
    <nav
      ref={navRef}
      className={`chronicle-day-index${isOpen ? " is-open" : ""}`}
      aria-label="Days in this view"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setIsOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !isOpen) return;
        event.preventDefault();
        setIsOpen(false);
        toggleRef.current?.focus();
      }}
    >
      <header className="chronicle-index-heading">
        <ChronicleIcon name="calendar" size={21} />
        <div>
          <h3>Jump to a day</h3>
          <p>{groups.length} days in this view</p>
        </div>
      </header>
      <button
        ref={toggleRef}
        className="chronicle-index-toggle"
        type="button"
        aria-label="Jump to a day"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <ChronicleIcon name="calendar" size={23} />
        <span>
          <strong>Jump to a day</strong>
          <small>
            {dayLabel(activeGroup)} · {formatChronicleDay(activeGroup)}
          </small>
        </span>
        <ChronicleIcon
          name="chevron-down"
          className="chronicle-index-chevron"
          size={16}
        />
      </button>
      <div className="chronicle-index-panel" id={panelId}>
        <div className="chronicle-index-months">
          {months.map((month) => (
            <section
              className="chronicle-index-month"
              key={month.label}
              aria-label={month.label}
            >
              <h4>{month.label}</h4>
              <ol>
                {month.days.map((group) => {
                  const date = new Date(group.items[0]?.event.createdAt ?? "");
                  const count = `${group.items.length} ${group.items.length === 1 ? "entry" : "entries"}`;
                  return (
                    <li key={group.key}>
                      <button
                        className="chronicle-index-day"
                        type="button"
                        aria-label={`${dayLabel(group)}, ${formatChronicleDay(group)}, ${count}`}
                        aria-current={
                          group.key === activeKey ? "date" : undefined
                        }
                        onClick={() => jumpToDay(group.key)}
                      >
                        <span
                          className="chronicle-index-number"
                          aria-hidden="true"
                        >
                          {Number.isNaN(date.getTime())
                            ? "—"
                            : date.getDate().toString().padStart(2, "0")}
                        </span>
                        <span className="chronicle-index-day-copy">
                          <strong>{dayLabel(group)}</strong>
                          <small>{count}</small>
                        </span>
                        <ChronicleIcon
                          name="bookmark"
                          className="chronicle-index-marker"
                          size={16}
                        />
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
        <footer className="chronicle-index-footer">
          <p>Loaded days · Newest first</p>
          {onBackToSearch && (
            <button
              className="chronicle-index-back"
              type="button"
              onClick={() => {
                flushSync(() => setIsOpen(false));
                onBackToSearch();
              }}
            >
              <ChronicleIcon name="up" size={15} /> Back to search
            </button>
          )}
        </footer>
      </div>
    </nav>
  );
}

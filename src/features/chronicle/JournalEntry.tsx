import { memo, useId, useState, type CSSProperties } from "react";
import { getEventTypeConfig } from "@/features/chronicle/eventTypes";
import {
  getEventKey,
  type EntryItem,
} from "@/features/chronicle/chronicleHelpers";
import { ChronicleIcon } from "./ChronicleIcons";
import "./chronicle-entry.css";

function AnnouncementText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const textId = useId();
  // Slice the original string so line endings and member-written copy survive.
  // Counting code points keeps the preview from splitting an emoji in half.
  const characterEnd = Array.from(text).slice(0, 400).join("").length;
  const fifthLineEnd = Array.from(text.matchAll(/\r\n|\r|\n/g))[4]?.index;
  const previewEnd = Math.min(characterEnd, fifthLineEnd ?? text.length);
  const canExpand = previewEnd < text.length;
  const showPreview = canExpand && !expanded;

  return (
    <>
      <p
        id={textId}
        className={`chronicle-entry-text${showPreview ? " chronicle-entry-text--preview" : ""}`}
      >
        {showPreview ? text.slice(0, previewEnd) : text}
        {showPreview && <span aria-hidden="true">…</span>}
      </p>
      {canExpand && (
        <button
          type="button"
          className="chronicle-entry-expand"
          aria-expanded={expanded}
          aria-controls={textId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show less" : "Read full announcement"}
          <ChronicleIcon name="chevron-down" size={14} />
        </button>
      )}
    </>
  );
}

export const JournalEntry = memo(function JournalEntry({
  item,
}: {
  item: EntryItem;
}) {
  const { event, isRealtime, isUnseen } = item;
  const { Icon, hex, label } = getEventTypeConfig(event.type);
  const isAnnouncement = event.type === "Announcement";
  const eventDate = new Date(event.createdAt);
  const hasValidDate = !Number.isNaN(eventDate.getTime());
  const fullDate = hasValidDate
    ? eventDate.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : "Date unavailable";
  const localTime = hasValidDate
    ? eventDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : fullDate;

  return (
    <li
      className="chronicle-entry"
      tabIndex={-1}
      data-chronicle-entry-key={getEventKey(event, 0)}
      data-new={isUnseen || undefined}
      data-announcement={isAnnouncement || undefined}
      data-arriving={(isRealtime && isUnseen) || undefined}
      style={{ "--chronicle-entry-accent": hex } as CSSProperties}
    >
      <span className="chronicle-entry-stamp" aria-hidden="true">
        <Icon size={26} />
      </span>
      <div className="chronicle-entry-content">
        <div className="chronicle-entry-meta">
          <span className="chronicle-entry-type">{label}</span>
          {isUnseen && (
            <span className="chronicle-entry-new">
              New<span className="sr-only"> entry</span>
            </span>
          )}
          <time
            className="chronicle-entry-time"
            dateTime={hasValidDate ? event.createdAt : undefined}
            title={fullDate}
            aria-label={fullDate}
          >
            {localTime}
          </time>
        </div>
        {isAnnouncement ? (
          <AnnouncementText key={event.text} text={event.text} />
        ) : (
          <p className="chronicle-entry-text">{event.text}</p>
        )}
      </div>
    </li>
  );
});

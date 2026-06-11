import { memo } from "react";
import { Tag } from "@/shared/ui/Tag";
import { getEventTypeConfig } from "@/features/chronicle/eventTypes";
import { formatRelativeTime } from "@/shared/lib/dateFormatters";
import type { EntryItem } from "@/features/chronicle/chronicleHelpers";

export const JournalEntry = memo(function JournalEntry({
  item,
}: {
  item: EntryItem;
}) {
  const { event, isRealtime, isUnseen } = item;
  const { Icon, hex, label } = getEventTypeConfig(event.type);

  return (
    <li
      className={`relative flex gap-3 sm:gap-4 py-4 sm:py-5 first:pt-0${
        isRealtime && isUnseen ? " animate-[fadeSlideIn_0.4s_ease-out]" : ""
      }`}
    >
      <span
        className="icon-badge w-9 h-9 shrink-0 mt-0.5"
        style={{
          color: hex,
          background: `color-mix(in srgb, ${hex} 12%, var(--card))`,
          borderColor: `color-mix(in srgb, ${hex} 30%, var(--border))`,
        }}
      >
        <Icon className="w-4 h-4" aria-hidden="true" />
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <Tag color={hex}>{label}</Tag>
          {isUnseen && (
            <Tag color="var(--primary)" dot>
              just in
            </Tag>
          )}
          <time
            className="ml-auto shrink-0 text-xs text-[var(--text-subtle)] font-soft"
            dateTime={event.createdAt}
          >
            {formatRelativeTime(event.createdAt)}
          </time>
        </div>
        <p className="text-[var(--text)] font-soft text-[15px] sm:text-[17px] leading-loose">
          {event.text}
        </p>
      </div>
    </li>
  );
});

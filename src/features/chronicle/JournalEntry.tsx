import { memo } from "react";
import { motion } from "motion/react";
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
    <motion.li
      className="relative flex gap-2.5 sm:gap-3 py-3.5 sm:py-4 first:pt-0"
      initial={isRealtime && isUnseen ? { opacity: 0, y: -8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
    >
      <span
        className="icon-badge w-7 h-7 shrink-0 mt-0.5"
        style={{
          color: hex,
          background: `color-mix(in srgb, ${hex} 12%, var(--card))`,
          borderColor: `color-mix(in srgb, ${hex} 30%, var(--border))`,
        }}
      >
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
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
    </motion.li>
  );
});

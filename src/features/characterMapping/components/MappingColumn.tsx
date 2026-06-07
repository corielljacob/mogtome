import { type ReactNode } from "react";
import { SearchInput } from "@/features/characterMapping/components/SearchInput";

// Shared chrome for the two side-by-side picker columns (Characters / Discord):
// icon + title + count pill, a search box, and a scroll area holding `children`
// (the item list) or an empty message.
export function MappingColumn({
  icon,
  title,
  count,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  isEmpty,
  emptyMessage,
  children,
}: {
  icon: ReactNode;
  title: string;
  count: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-0">
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        {icon}
        <h3 className="font-display font-bold text-sm text-[var(--text)]">
          {title}
        </h3>
        <span className="px-2 py-0.5 rounded-full text-xs font-soft font-bold bg-[color:color-mix(in_srgb,var(--primary)_12%,var(--card))] text-[var(--text-muted)]">
          {count}
        </span>
      </div>
      <SearchInput
        value={searchValue}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />
      {/* phone: cap each list so both columns (and their search boxes) stay
          reachable without one pushing the other far down the sheet. desktop:
          fill the column and scroll internally. */}
      <div className="space-y-2 overflow-y-auto overscroll-contain max-h-[38vh] lg:max-h-none lg:flex-1 lg:min-h-0 pr-1">
        {isEmpty ? (
          <p className="text-sm text-[var(--text-muted)] font-soft text-center py-6">
            {emptyMessage}
          </p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

import { type CSSProperties, type RefObject } from "react";
import { motion } from "motion/react";
import { Search, X, ArrowUpDown } from "lucide-react";
import { Dropdown } from "@/shared/ui/Dropdown";
import {
  SORT_OPTIONS,
  type SortOption,
} from "@/features/members/useMemberFilters";

export function MembersToolbar({
  searchInputRef,
  inputValue,
  setInputValue,
  setSearchQuery,
  validSortBy,
  setSortBy,
}: {
  searchInputRef: RefObject<HTMLInputElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  setSearchQuery: (query: string) => void;
  validSortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
}) {
  return (
    <motion.section
      className="sticky top-[calc(4rem+env(safe-area-inset-top))] md:top-4 z-30 mb-4 sm:mb-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <span
        className="pushpin absolute -top-2 left-8 z-10"
        style={{ "--pin": "var(--secondary)" } as CSSProperties}
        aria-hidden="true"
      />
      <span
        className="pushpin absolute -top-2 right-8 z-10"
        style={{ "--pin": "var(--primary)" } as CSSProperties}
        aria-hidden="true"
      />
      <div className="surface paper p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <label htmlFor="member-search" className="sr-only">
              Search members by name or rank
            </label>
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--primary)]/70 pointer-events-none"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              id="member-search"
              type="search"
              inputMode="search"
              enterKeyHint="search"
              placeholder="Find a friend, kupo~"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              aria-describedby="search-results-count"
              className="
                  w-full pl-11 pr-11 py-3
                  bg-[var(--bg)] rounded-full
                  border-2 border-[color:color-mix(in_srgb,var(--primary)_16%,var(--card))]
                  focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20
                  font-soft text-base text-[var(--text)] placeholder:text-[var(--text-subtle)]
                  focus:outline-none transition-all touch-manipulation
                "
              style={{ fontSize: "16px" }}
            />
            {!inputValue && (
              <kbd
                className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-md bg-[color:color-mix(in_srgb,var(--primary)_12%,var(--card))] border border-[color:color-mix(in_srgb,var(--primary)_22%,var(--card))] text-[var(--text-subtle)] text-xs font-mono pointer-events-none"
                aria-hidden="true"
              >
                /
              </kbd>
            )}
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue("");
                  setSearchQuery("");
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-[var(--primary)]/12 active:bg-[var(--primary)]/30 sm:hover:bg-[var(--primary)]/20 transition-colors cursor-pointer touch-manipulation"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-[var(--primary)]" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:flex items-center gap-1.5 text-sm font-display font-bold text-[var(--text-muted)] pl-1">
              <ArrowUpDown
                className="w-4 h-4 text-[var(--secondary)]"
                aria-hidden="true"
              />
              Sort
            </span>
            <Dropdown
              options={SORT_OPTIONS}
              value={validSortBy}
              onChange={setSortBy}
              icon={<ArrowUpDown className="w-4 h-4" />}
              menuClassName="paper"
              className="w-full sm:w-44"
              aria-label="Sort members by"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

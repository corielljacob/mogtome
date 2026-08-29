import { type RefObject } from "react";
import {
  SORT_OPTIONS,
  type SortOption,
} from "@/features/members/useMemberFilters";
import { FamilyIcon } from "./FamilyIcons";
import "./family-controls.css";
import "./family-filters.css";

export function MembersToolbar({
  searchInputRef,
  inputValue,
  setInputValue,
  setSearchQuery,
  validSortBy,
  setSortBy,
  disabled = false,
}: {
  searchInputRef: RefObject<HTMLInputElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  setSearchQuery: (query: string) => void;
  validSortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  disabled?: boolean;
}) {
  const clearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    searchInputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="family-toolbar family-toolbar-refined">
      <div className="family-search-field">
        <label htmlFor="member-search">Search members</label>
        <div className="family-search">
          <FamilyIcon name="search" size={21} />
          <input
            ref={searchInputRef}
            id="member-search"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            placeholder="Name or rank…"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return;
              if (event.key === "Escape") {
                event.preventDefault();
                clearSearch();
              } else if (event.key === "Enter") {
                event.preventDefault();
                setSearchQuery(inputValue);
              }
            }}
            aria-describedby="search-results-count"
            aria-keyshortcuts="/"
            disabled={disabled}
          />
          {inputValue ? (
            <button
              type="button"
              onClick={clearSearch}
              disabled={disabled}
              aria-label="Clear search"
            >
              <FamilyIcon name="close" size={17} />
            </button>
          ) : (
            <kbd aria-hidden="true" title="Press / to search">
              /
            </kbd>
          )}
        </div>
      </div>
      <div className="family-sort-field">
        <label htmlFor="member-sort">Sort by</label>
        <div className="family-sort">
          <FamilyIcon name="sort" size={19} />
          <select
            id="member-sort"
            value={validSortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            disabled={disabled}
            aria-label="Sort members by"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FamilyIcon name="chevron-down" size={15} />
        </div>
      </div>
    </div>
  );
}

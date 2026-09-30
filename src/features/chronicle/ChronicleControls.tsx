import { useId, type RefObject } from "react";
import type { ChronicleEventFilter } from "@/shared/types";
import type { useChronicle } from "./useChronicle";
import { ChronicleIcon } from "./ChronicleIcons";
import "./chronicle-controls.css";

export type ChronicleControlsModel = Pick<
  ReturnType<typeof useChronicle>,
  | "searchInput"
  | "setSearchInput"
  | "activeFilter"
  | "setActiveFilter"
  | "searchInputRef"
  | "status"
  | "unseenCount"
  | "reconnect"
  | "markAllAsSeen"
  | "hasActiveQuery"
  | "handleClearSearch"
  | "handleClearAll"
  | "handleToggleFilter"
  | "commitSearch"
  | "canViewNameChanges"
>;

const eventFilters: { value: ChronicleEventFilter; label: string }[] = [
  { value: "Announcement", label: "Announcements" },
  { value: "MemberJoined", label: "New members" },
  { value: "MemberRejoined", label: "Returning members" },
  { value: "RankPromoted", label: "Rank changes" },
  { value: "NameChanged", label: "Name changes" },
];

export function ChronicleControls({
  model,
  disabled = false,
  toolbarRef,
}: {
  model: ChronicleControlsModel;
  disabled?: boolean;
  toolbarRef?: RefObject<HTMLElement | null>;
}) {
  const {
    searchInput,
    setSearchInput,
    activeFilter,
    setActiveFilter,
    searchInputRef,
    hasActiveQuery,
    handleClearSearch,
    handleClearAll,
    commitSearch,
    canViewNameChanges,
  } = model;
  const searchId = useId();
  const filterId = useId();
  const searchHintId = useId();
  const canClear =
    searchInput.length > 0 || activeFilter !== null || hasActiveQuery;

  return (
    <section
      ref={toolbarRef}
      className="chronicle-toolbar"
      role="search"
      aria-label="Chronicle search and filters"
    >
      <div className="chronicle-search-field">
        <label htmlFor={searchId}>Search the Chronicle</label>
        <div className="chronicle-search-box">
          <ChronicleIcon name="search" size={21} />
          <input
            ref={searchInputRef}
            id={searchId}
            type="search"
            inputMode="search"
            enterKeyHint="search"
            aria-keyshortcuts="/"
            aria-describedby={searchHintId}
            placeholder="Member name or event…"
            value={searchInput}
            disabled={disabled}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return;
              if (event.key === "Enter") {
                event.preventDefault();
                commitSearch();
              } else if (event.key === "Escape") {
                event.preventDefault();
                handleClearSearch();
              }
            }}
          />
          {searchInput ? (
            <button
              type="button"
              onClick={handleClearSearch}
              disabled={disabled}
              aria-label="Clear search"
              className="chronicle-clear-search"
            >
              <ChronicleIcon name="close" size={17} />
            </button>
          ) : (
            <kbd className="chronicle-search-shortcut" aria-hidden="true">
              /
            </kbd>
          )}
        </div>
      </div>

      <div className="chronicle-type-select-field">
        <label htmlFor={filterId}>Activity type</label>
        <div className="chronicle-type-select-wrap">
          <select
            id={filterId}
            value={activeFilter ?? "all"}
            disabled={disabled}
            onChange={(event) =>
              setActiveFilter(
                event.target.value === "all"
                  ? null
                  : (event.target.value as ChronicleEventFilter),
              )
            }
          >
            <option value="all">All activity</option>
            {eventFilters
              .filter(
                ({ value }) => value !== "NameChanged" || canViewNameChanges,
              )
              .map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
          </select>
          <ChronicleIcon name="chevron-down" size={17} />
        </div>
      </div>
      {canClear && (
        <button
          type="button"
          className="chronicle-clear-all"
          onClick={handleClearAll}
          disabled={disabled}
        >
          <ChronicleIcon name="close" size={14} />
          Clear all
        </button>
      )}
      <p className="chronicle-search-hint" id={searchHintId}>
        Results update as you type.
      </p>
    </section>
  );
}

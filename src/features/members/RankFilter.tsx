import { useId, useRef, useState } from "react";
import { FC_RANKS } from "@/shared/types";
import { FamilyIcon, FamilyRankIcon } from "./FamilyIcons";
import "./family-controls.css";
import "./family-filters.css";

export function RankFilter({
  selectedRanks,
  toggleRank,
  clearRanks,
  rankCounts,
  filteredCount,
  disabled = false,
  loading = false,
}: {
  selectedRanks: string[];
  toggleRank: (rankName: string) => void;
  /** Resets ranks only, preserving the current search. */
  clearRanks?: () => void;
  /** Results and clear-all are rendered by the directory's results summary. */
  clearFilters?: () => void;
  hasActiveFilters?: boolean;
  filteredCount?: number;
  totalCount?: number;
  rankCounts: Record<string, number>;
  disabled?: boolean;
  loading?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectionSummary =
    selectedRanks.length > 0 ? `${selectedRanks.length} selected` : "All ranks";
  const resultsLabel =
    filteredCount === undefined || loading || disabled
      ? "Show results"
      : filteredCount === 0
        ? "View results"
        : `Show ${filteredCount} ${filteredCount === 1 ? "member" : "members"}`;

  return (
    <div className="family-rank-disclosure">
      <button
        ref={triggerRef}
        type="button"
        className="family-rank-trigger"
        aria-label={`Filter by rank, ${selectionSummary}`}
        aria-expanded={expanded}
        aria-controls={panelId}
        disabled={disabled}
        onClick={() => setExpanded((previous) => !previous)}
      >
        <FamilyIcon name="people" size={18} />
        <span>Filter by rank</span>
        <span className="family-rank-selection-count">{selectionSummary}</span>
        <FamilyIcon
          name="chevron-down"
          size={14}
          className="family-rank-disclosure-arrow"
        />
      </button>
      <div
        id={panelId}
        className="family-rank-panel"
        hidden={!expanded}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || event.nativeEvent.isComposing) return;
          event.preventDefault();
          setExpanded(false);
          triggerRef.current?.focus({ preventScroll: true });
        }}
      >
        <div className="family-rank-panel-heading">
          <p>Choose one or more ranks.</p>
          <button
            type="button"
            className="family-all-ranks"
            onClick={clearRanks}
            aria-pressed={selectedRanks.length === 0}
            disabled={disabled || (selectedRanks.length > 0 && !clearRanks)}
          >
            <FamilyIcon name="people" size={16} />
            All ranks
            {selectedRanks.length === 0 && (
              <FamilyIcon name="check" size={13} />
            )}
          </button>
        </div>
        <div
          className="family-rank-list"
          role="group"
          aria-label="Choose member ranks"
        >
          {FC_RANKS.map((rank) => {
            const count = rankCounts[rank.name] || 0;
            const isSelected = selectedRanks.includes(rank.name);
            return (
              <button
                key={rank.name}
                type="button"
                onClick={() => toggleRank(rank.name)}
                aria-pressed={isSelected}
                disabled={disabled}
                className="family-rank-chip"
              >
                <FamilyRankIcon rank={rank.name} size={19} />
                <span>{rank.name}</span>
                <span className="family-rank-count" aria-hidden="true">
                  {loading || disabled ? "–" : count}
                </span>
                <span className="sr-only">
                  {loading || disabled
                    ? ""
                    : `, ${count} ${count === 1 ? "member" : "members"}`}
                </span>
                {isSelected && (
                  <FamilyIcon
                    name="check"
                    size={12}
                    className="family-rank-check"
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="family-rank-panel-actions">
          <button
            type="button"
            className="family-rank-show-results"
            onClick={() => {
              setExpanded(false);
              triggerRef.current?.focus({ preventScroll: true });
              triggerRef.current?.scrollIntoView({
                block: "nearest",
                behavior: "instant",
              });
            }}
          >
            {resultsLabel}
            <FamilyIcon name="arrow-right" size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { DashboardIcon } from "@/features/knights/DashboardIcons";
import { PairCard } from "./PairCard";
import { EmptyState } from "./EmptyState";
import { pairKey } from "../hooks/useCharacterMapping";
import type { MatchPair } from "../types";
import "../suggestion-browsing.css";

function SuggestionGroup({
  id,
  title,
  pairs,
  busy,
  confirmingPairKey,
  onConfirm,
  onSkip,
}: {
  id: string;
  title: string;
  pairs: MatchPair[];
  busy: boolean;
  confirmingPairKey: string | null;
  onConfirm: (pair: MatchPair) => void;
  onSkip: (pair: MatchPair) => void;
}) {
  return (
    <section className="dash-mapping-browse-group" aria-labelledby={id}>
      <h3 id={id}>{title}</h3>
      <div className="dash-mapping-pairs">
        {pairs.map((pair) => (
          <PairCard
            key={pairKey(pair)}
            pair={pair}
            isConfirming={confirmingPairKey === pairKey(pair)}
            disabled={busy}
            onConfirm={() => onConfirm(pair)}
            onSkip={() => onSkip(pair)}
          />
        ))}
      </div>
    </section>
  );
}

export function SuggestedPairs({
  pairs,
  exactCount,
  confirmingPairKey,
  isConfirmingAll,
  disabled = false,
  onConfirm,
  onSkip,
  onConfirmAllExact,
  onGoManual,
}: {
  pairs: MatchPair[];
  exactCount: number;
  confirmingPairKey: string | null;
  isConfirmingAll: boolean;
  disabled?: boolean;
  onConfirm: (pair: MatchPair) => void;
  onSkip: (pair: MatchPair) => void;
  onConfirmAllExact: () => void;
  onGoManual: () => void;
}) {
  const [search, setSearch] = useState("");
  const [skippedName, setSkippedName] = useState("");
  const searchId = useId();
  const input = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLParagraphElement>(null);
  const pendingSkipFocus = useRef<{
    key: string;
    control: HTMLElement;
  } | null>(null);
  const busy = disabled || isConfirmingAll || confirmingPairKey !== null;
  const query = search.trim().toLowerCase();
  const visiblePairs = pairs.filter(
    ({ character, discordUser }) =>
      !query ||
      character.name.toLowerCase().includes(query) ||
      discordUser.serverNickName.toLowerCase().includes(query) ||
      discordUser.discordId.toLowerCase().includes(query),
  );
  const groups = [
    {
      id: `${searchId}-exact`,
      title: "Exact name matches",
      pairs: visiblePairs.filter((pair) => pair.confidence === "exact"),
    },
    {
      id: `${searchId}-other`,
      title: "Other suggestions",
      pairs: visiblePairs.filter((pair) => pair.confidence !== "exact"),
    },
  ];

  useEffect(() => {
    const cancelWhenFocusMoves = (event: FocusEvent) => {
      if (event.target !== pendingSkipFocus.current?.control) {
        pendingSkipFocus.current = null;
      }
    };
    const cancel = () => {
      pendingSkipFocus.current = null;
    };
    const cancelOnTab = (event: KeyboardEvent) => {
      if (event.key === "Tab") cancel();
    };
    document.addEventListener("focusin", cancelWhenFocusMoves);
    document.addEventListener("pointerdown", cancel);
    document.addEventListener("keydown", cancelOnTab);
    return () => {
      document.removeEventListener("focusin", cancelWhenFocusMoves);
      document.removeEventListener("pointerdown", cancel);
      document.removeEventListener("keydown", cancelOnTab);
    };
  }, []);

  useEffect(() => {
    const request = pendingSkipFocus.current;
    if (!request || pairs.some((pair) => pairKey(pair) === request.key)) return;
    pendingSkipFocus.current = null;
    if (
      document.activeElement === request.control ||
      document.activeElement === document.body
    ) {
      results.current?.focus({ preventScroll: true });
    }
  }, [pairs]);

  const clearSearch = () => {
    setSearch("");
    setSkippedName("");
    input.current?.focus();
  };
  const handleSkip = useCallback(
    (pair: MatchPair) => {
      if (busy) return;
      const control = document.activeElement;
      pendingSkipFocus.current =
        control instanceof HTMLElement &&
        control.getAttribute("aria-label") ===
          `Skip the match for ${pair.character.name}`
          ? { key: pairKey(pair), control }
          : null;
      setSkippedName(pair.character.name);
      onSkip(pair);
    },
    [busy, onSkip],
  );
  return (
    <div className="dash-mapping-suggestions">
      {pairs.length > 0 && (
        <div className="dash-mapping-suggestions-intro">
          <p>
            Exact matches contain the character's first and last name. Other
            suggestions use similar names. Check each pair before linking.
          </p>
          {exactCount > 0 && !query && (
            <button
              type="button"
              className="dash-mapping-button dash-mapping-bulk"
              onClick={onConfirmAllExact}
              disabled={busy}
            >
              <DashboardIcon
                name={isConfirmingAll ? "refresh" : "check"}
                size={17}
              />
              {isConfirmingAll
                ? "Linking exact matches…"
                : `Link ${exactCount} exact ${exactCount === 1 ? "match" : "matches"}`}
            </button>
          )}
        </div>
      )}
      {(pairs.length > 0 || search) && (
        <div className="dash-mapping-browse-search">
          <label htmlFor={searchId}>Find a suggested pair</label>
          <div className="dash-mapping-browse-input">
            <DashboardIcon name="search" size={18} />
            <input
              ref={input}
              id={searchId}
              type="search"
              value={search}
              disabled={busy}
              placeholder="Character, Discord name, or ID…"
              onChange={(event) => {
                setSearch(event.target.value);
                setSkippedName("");
              }}
              onKeyDown={(event) => {
                if (
                  event.key === "Escape" &&
                  search &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  event.stopPropagation();
                  clearSearch();
                }
              }}
            />
            {search && (
              <button
                type="button"
                disabled={busy}
                aria-label="Clear suggested pair search"
                onClick={clearSearch}
              >
                <DashboardIcon name="close" size={17} />
              </button>
            )}
          </div>
        </div>
      )}
      <p
        ref={results}
        className="dash-mapping-browse-status"
        role="status"
        aria-label="Suggestion results"
        aria-atomic="true"
        tabIndex={-1}
      >
        {skippedName && <span>Skipped the match for {skippedName}. </span>}
        {visiblePairs.length} of {pairs.length} shown
      </p>
      {query && exactCount > 0 && (
        <p className="dash-mapping-browse-hint">
          Clear the search to review and link all exact matches together.
        </p>
      )}
      {!pairs.length ? (
        <EmptyState
          icon={<DashboardIcon name="search" size={28} />}
          title="No suggestions to review"
          subtitle="Choose a character and Discord account by hand, or refresh to bring back skipped suggestions."
          action={
            <button
              type="button"
              className="dash-mapping-button"
              onClick={onGoManual}
              disabled={busy}
            >
              <DashboardIcon name="people" size={17} />
              Choose by hand
            </button>
          }
        />
      ) : !visiblePairs.length ? (
        <EmptyState
          icon={<DashboardIcon name="search" size={28} />}
          title="No matching suggestions"
          subtitle="Try another character name, Discord name, or Discord ID."
          action={
            <button
              type="button"
              className="dash-mapping-button"
              onClick={clearSearch}
              disabled={busy}
            >
              Clear search
            </button>
          }
        />
      ) : (
        groups.map((group) =>
          group.pairs.length > 0 ? (
            <SuggestionGroup
              key={group.id}
              {...group}
              busy={busy}
              confirmingPairKey={confirmingPairKey}
              onConfirm={onConfirm}
              onSkip={handleSkip}
            />
          ) : null,
        )
      )}
      {pairs.length > 0 && (
        <p className="dash-mapping-footnote">
          Skipped pairs return when you refresh. No accounts are changed by
          skipping.
        </p>
      )}
    </div>
  );
}

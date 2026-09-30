import {
  useId,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { SearchInput } from "./SearchInput";
export function MappingColumn({
  icon,
  title,
  count,
  totalCount,
  platform,
  inputRef,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchLabel,
  rankingKey,
  disabled,
  isEmpty,
  emptyMessage,
  children,
}: {
  icon: ReactNode;
  title: string;
  count: number;
  totalCount: number;
  platform: "ffxiv" | "discord";
  inputRef?: RefObject<HTMLInputElement | null>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchLabel?: string;
  rankingKey?: string;
  disabled?: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}) {
  const titleId = useId();
  const resultsId = useId();
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const fallbackInput = useRef<HTMLInputElement>(null);
  const input = inputRef ?? fallbackInput;

  // A new query or opposite-side selection puts the best results at the top.
  // Reset only this inventory so searching never moves the surrounding page.
  useLayoutEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [searchValue, rankingKey]);

  const clearSearch = () => {
    onSearchChange("");
    input.current?.focus();
  };
  return (
    <section
      className="dash-mapping-column"
      aria-labelledby={titleId}
      data-platform={platform}
    >
      <header>
        {icon}
        <h3 id={titleId}>{title}</h3>
      </header>
      <p
        id={resultsId}
        className="dash-mapping-column-count"
        role="status"
        aria-label={`${title} results`}
        aria-atomic="true"
      >
        {searchValue.trim()
          ? `${count} of ${totalCount} shown`
          : `${totalCount} available`}
      </p>
      <SearchInput
        value={searchValue}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
        label={searchLabel}
        disabled={disabled}
        inputRef={input}
        describedBy={resultsId}
        controls={listId}
      />
      <div id={listId} ref={listRef} className="dash-mapping-list">
        {isEmpty ? (
          <div className="dash-mapping-list-empty">
            <p>{emptyMessage}</p>
            {searchValue.trim() && totalCount > 0 && (
              <button
                type="button"
                className="dash-mapping-text-button"
                disabled={disabled}
                onClick={clearSearch}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

import { useId, type ReactNode, type RefObject } from "react";
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
  disabled?: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}) {
  const titleId = useId();
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
      <p className="dash-mapping-column-count" aria-live="polite">
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
        inputRef={inputRef}
      />
      <div className="dash-mapping-list">
        {isEmpty ? (
          <p className="dash-mapping-list-empty" role="status">
            {emptyMessage}
          </p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

import { useId, useRef, type RefObject } from "react";
import { DashboardIcon } from "@/features/knights/DashboardIcons";
export function SearchInput({
  value,
  onChange,
  placeholder,
  label,
  disabled = false,
  inputRef,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  disabled?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}) {
  const id = useId();
  const fallbackInput = useRef<HTMLInputElement>(null);
  const input = inputRef ?? fallbackInput;
  const clear = () => {
    onChange("");
    input.current?.focus();
  };
  return (
    <div className="dash-mapping-search">
      <label htmlFor={id}>{label ?? placeholder}</label>
      <div className="dash-mapping-search-box">
        <DashboardIcon name="search" size={18} />
        <input
          ref={input}
          id={id}
          type="search"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === "Escape" && !event.nativeEvent.isComposing) {
              event.preventDefault();
              clear();
            }
          }}
        />
        {value && (
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            aria-label={`Clear ${label?.toLowerCase() ?? "search"}`}
          >
            <DashboardIcon name="close" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

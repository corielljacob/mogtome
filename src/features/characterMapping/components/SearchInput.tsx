import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: SearchInputProps) {
  return (
    <div className="relative mb-3 flex-shrink-0">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--primary)]/70 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-4 py-3 rounded-xl
          bg-[color:color-mix(in_srgb,var(--bg)_80%,var(--card))]
          border-2 border-[color:color-mix(in_srgb,var(--primary)_14%,var(--card))]
          text-sm font-soft text-[var(--text)] placeholder:text-[var(--text-subtle)]
          transition-all duration-200
          focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 focus:bg-[var(--card)]
        "
        style={{ fontSize: "16px" }}
      />
    </div>
  );
}

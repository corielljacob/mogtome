import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="relative mb-3 flex-shrink-0">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--bento-text-muted)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-4 py-2 rounded-xl
          bg-[var(--bento-bg)]/50 border border-[var(--bento-border)]
          text-sm text-[var(--bento-text)] placeholder:text-[var(--bento-text-muted)]
          focus:outline-none focus:border-[var(--bento-primary)]/40 transition-colors
        "
      />
    </div>
  );
}

import { useState, type ReactNode, type CSSProperties } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

export function ToggleSwitch({
  enabled,
  onChange,
  disabled = false,
  label,
}: {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      className={`relative w-[50px] h-[28px] rounded-full shrink-0 cursor-pointer transition-colors duration-200
        focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:outline-none
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${enabled ? "bg-[var(--primary)]" : "bg-[color:color-mix(in_srgb,var(--text-subtle)_28%,transparent)]"}`}
      style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.18)" }}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-md transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${enabled ? "translate-x-[22px]" : "translate-x-0"}`}
      />
    </button>
  );
}

export function SettingRow({
  label,
  description,
  children,
  disabled = false,
}: {
  label: string;
  description: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-3 ${disabled ? "opacity-50" : ""}`}
    >
      <div className="min-w-0">
        <p className="font-display font-bold text-sm text-[var(--text)]">
          {label}
        </p>
        <p className="font-soft text-xs text-[var(--text-muted)] leading-relaxed">
          {description}
        </p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function Collapsible({
  icon: Icon,
  label,
  value,
  accent = "var(--primary)",
  children,
}: {
  icon: LucideIcon;
  label: string;
  value?: string;
  accent?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t-2 border-dashed border-[color:color-mix(in_srgb,var(--primary)_15%,transparent)] mt-4 pt-3">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center gap-2 cursor-pointer rounded-xl py-0.5 text-left focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
      >
        <Icon
          className="w-4 h-4 shrink-0"
          style={{ color: accent }}
          aria-hidden="true"
        />
        <span className="font-display font-bold text-sm text-[var(--text)]">
          {label}
        </span>
        {value && (
          <span className="font-soft text-xs text-[var(--primary)] truncate">
            {value}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 ml-auto shrink-0 text-[var(--text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="mt-3 animate-[fadeSlideIn_0.25s_ease-out]">
          {children}
        </div>
      )}
    </div>
  );
}

export function SettingsCard({
  icon: Icon,
  title,
  accent,
  pinColor,
  tilt = 0,
  children,
}: {
  icon: LucideIcon;
  title: string;
  accent: string;
  pinColor: string;
  tilt?: number;
  children: ReactNode;
}) {
  return (
    <section
      className="paper relative"
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      <span
        className="pushpin absolute -top-2 left-8 z-10"
        style={{ "--pin": pinColor } as CSSProperties}
        aria-hidden="true"
      />
      <div className="surface p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <span
            className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
            style={{
              backgroundColor: `color-mix(in srgb, ${accent} 18%, var(--card))`,
              border: `2px solid color-mix(in srgb, ${accent} 32%, var(--card))`,
            }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: accent }}
              aria-hidden="true"
            />
          </span>
          <h2 className="font-display font-bold text-lg text-[var(--text)]">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

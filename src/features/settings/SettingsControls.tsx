import { useId, useState, type ReactNode, type RefObject } from "react";
import { SettingsIcon, type SettingsIconName } from "./SettingsIcons";

export function ToggleSwitch({
  enabled,
  onChange,
  disabled = false,
  label,
  describedBy,
  buttonRef,
}: {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
  label: string;
  describedBy?: string;
  buttonRef?: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={onChange}
      disabled={disabled}
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      aria-describedby={describedBy}
      className="settings-toggle"
    >
      <span className="settings-toggle-track" aria-hidden="true">
        <span>{enabled && <SettingsIcon name="check" size={12} />}</span>
      </span>
      <span className="settings-toggle-state" aria-hidden="true">
        {enabled ? "On" : "Off"}
      </span>
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
  description?: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="setting-row" data-disabled={disabled || undefined}>
      <div className="setting-row-copy">
        <p>{label}</p>
        {description && <p>{description}</p>}
      </div>
      <div className="setting-row-control">{children}</div>
    </div>
  );
}

export function Collapsible({
  icon,
  label,
  value,
  children,
}: {
  icon: SettingsIconName;
  label: string;
  value?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="settings-disclosure">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
      >
        <SettingsIcon name={icon} size={19} />
        <span>{label}</span>
        {value && <small>{value}</small>}
        <SettingsIcon
          name="chevron"
          size={17}
          className="settings-disclosure-chevron"
        />
      </button>
      <div id={id} hidden={!open} className="settings-disclosure-content">
        {children}
      </div>
    </div>
  );
}

export function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: SettingsIconName;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <section className="settings-card" aria-labelledby={id}>
      <header className="settings-card-header">
        <span className="settings-card-icon">
          <SettingsIcon name={icon} size={25} />
        </span>
        <div>
          <h2 id={id}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </header>
      <div className="settings-card-content">{children}</div>
    </section>
  );
}

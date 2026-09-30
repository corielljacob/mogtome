import type { ReactNode } from "react";
export function EmptyState({
  icon,
  title,
  subtitle,
  action,
  className = "",
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`dash-mapping-empty ${className}`}>
      <span className="dash-mapping-empty-icon" aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      {action && <div className="dash-mapping-empty-action">{action}</div>}
    </div>
  );
}

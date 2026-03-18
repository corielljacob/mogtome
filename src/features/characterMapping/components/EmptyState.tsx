interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-8 sm:py-12 text-center ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-sm text-[var(--text)] font-soft font-semibold mb-1">
        {title}
      </p>
      {subtitle && (
        <p className="text-xs text-[var(--text-muted)] max-w-xs">
          {subtitle}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

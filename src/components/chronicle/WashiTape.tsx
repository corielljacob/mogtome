export function WashiTape({
  className = "",
  color = "var(--accent)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none rounded-[2px] ${className}`}
      style={{
        background: `repeating-linear-gradient(45deg, color-mix(in srgb, ${color} 42%, transparent) 0 6px, color-mix(in srgb, ${color} 20%, transparent) 6px 12px)`,
      }}
    />
  );
}

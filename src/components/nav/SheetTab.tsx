import { memo, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { Tab } from "@/components/nav/tabs";

export const SheetTab = memo(function SheetTab({
  tab,
  isActive,
  onNavigate,
}: {
  tab: Tab;
  isActive: boolean;
  onNavigate: () => void;
}) {
  const { path, label, icon: Icon, color } = tab;
  return (
    <Link
      to={path}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl font-display font-bold text-xs active:scale-95 transition-transform"
      style={
        isActive
          ? ({
              background: color,
              color: "#fff",
              boxShadow: `0 3px 0 0 color-mix(in srgb, ${color} 55%, black)`,
            } as CSSProperties)
          : ({
              background: `color-mix(in srgb, ${color} 16%, var(--card))`,
              color,
              boxShadow: `0 2px 0 0 color-mix(in srgb, ${color} 26%, transparent)`,
            } as CSSProperties)
      }
    >
      <Icon className="w-6 h-6" />
      <span>{label}</span>
    </Link>
  );
});

import { memo, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { Tab } from "@/components/nav/tabs";

export const MobileTab = memo(function MobileTab({
  tab,
  isActive,
}: {
  tab: Tab;
  isActive: boolean;
}) {
  const { path, label, icon: Icon, color } = tab;
  return (
    <Link
      to={path}
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
      className={`relative flex flex-col items-center gap-0.5 px-2.5 pt-2 pb-2 rounded-t-2xl font-display font-bold text-[10px] leading-none shrink-0 transition-transform duration-150 active:scale-90
        ${isActive ? "-translate-y-1.5" : ""}`}
      style={
        isActive
          ? ({
              background: color,
              color: "#fff",
              boxShadow: `0 0 0 2px var(--card), 0 3px 0 0 color-mix(in srgb, ${color} 55%, black)`,
            } as CSSProperties)
          : ({
              background: `color-mix(in srgb, ${color} 16%, var(--card))`,
              color,
            } as CSSProperties)
      }
    >
      <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
      <span>{label}</span>
    </Link>
  );
});

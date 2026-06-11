import { memo, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { Tab } from "@/shared/nav/tabs";

// One item in the floating bottom pill. Inactive tabs are an icon-only circle in
// their own colour; the active tab fills with that colour and smoothly expands to
// reveal its label (an iOS-style "pill" indicator).
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
      className="relative flex h-11 items-center justify-center rounded-full px-3 font-display font-bold text-[13px] leading-none transition-[background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-90"
      style={
        isActive
          ? ({
              background: color,
              color: "#fff",
              boxShadow: `0 4px 12px -3px color-mix(in srgb, ${color} 70%, transparent)`,
            } as CSSProperties)
          : ({ color } as CSSProperties)
      }
    >
      <Icon
        className="w-[22px] h-[22px] shrink-0"
        strokeWidth={isActive ? 2.6 : 2.1}
      />
      {/* label expands in on the active tab */}
      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isActive ? "max-w-[7rem] opacity-100 ml-1.5" : "max-w-0 opacity-0"
        }`}
      >
        {label}
      </span>
    </Link>
  );
});

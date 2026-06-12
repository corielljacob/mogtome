import { memo, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { Tab } from "@/shared/nav/tabs";

// One item in the floating bottom pill. The active FILL is a single sliding
// indicator drawn behind the row (see MobileNav), so a tab only colours its own
// icon/label - white when active (it sits over the coloured indicator), its tab
// colour otherwise - and expands its label. The data-nav-* attrs let the indicator
// find + measure the active tab. `isActive` is the VISUAL state (the highlight can
// temporarily move to the More button); `isCurrent` is the actual current page and
// only drives aria-current. All durations are 250ms to stay in lockstep with the
// indicator's slide (see NAV_MS in MobileNav).
export const MobileTab = memo(function MobileTab({
  tab,
  isActive,
  isCurrent = false,
}: {
  tab: Tab;
  isActive: boolean;
  isCurrent?: boolean;
}) {
  const { path, label, icon: Icon, color } = tab;
  return (
    <Link
      to={path}
      data-nav-active={isActive ? "true" : undefined}
      data-nav-color={color}
      aria-current={isCurrent ? "page" : undefined}
      aria-label={label}
      className="relative z-10 flex h-11 items-center justify-center rounded-full px-3 font-display font-bold text-[13px] leading-none transition-[color] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-90 touch-manipulation"
      style={{ color: isActive ? "#fff" : color } as CSSProperties}
    >
      <Icon
        className="w-[22px] h-[22px] shrink-0"
        strokeWidth={isActive ? 2.6 : 2.1}
      />
      {/* label expands in on the active tab. Animates grid-template-columns
          (0fr -> 1fr), which tweens to the label's REAL width across the whole
          duration. (A max-width cap can't: the expanding label hits its true width
          early while the collapsing one only starts shrinking once the cap drops
          below its width - mid-switch both are fully out, so the whole pill bulges
          wider and snaps back on every tab change.) */}
      <span
        className={`grid transition-[grid-template-columns,opacity,margin] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isActive
            ? "grid-cols-[1fr] opacity-100 ml-1.5"
            : "grid-cols-[0fr] opacity-0"
        }`}
      >
        <span className="overflow-hidden whitespace-nowrap min-w-0">
          {label}
        </span>
      </span>
    </Link>
  );
});

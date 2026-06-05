import { memo, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { KawaiiStar } from "../kawaiiMotifs";
import type { Tab } from "./tabs";
import lilGuyMoogle from "../../assets/moogles/lil guy moogle.webp";

export const DesktopTab = memo(function DesktopTab({
  tab,
  isActive,
}: {
  tab: Tab;
  isActive: boolean;
}) {
  const { path, label, icon: Icon, color } = tab;
  const activeStyle: CSSProperties = {
    background: color,
    color: "#fff",
    boxShadow: `0 0 0 3px var(--card), 4px 5px 0 0 color-mix(in srgb, ${color} 55%, black)`,
  };
  const idleStyle: CSSProperties = {
    background: `color-mix(in srgb, ${color} 18%, var(--card))`,
    color,
    boxShadow: `0 0 0 3px var(--card), 2px 3px 0 0 color-mix(in srgb, ${color} 28%, transparent)`,
  };
  return (
    <Link
      to={path}
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
      className={`group relative flex items-center h-12 rounded-r-2xl pl-4 pr-3 font-display font-bold text-sm
        transition-[transform] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]
        ${isActive ? "translate-x-0" : "-translate-x-1.5 hover:translate-x-0"}`}
      style={isActive ? activeStyle : idleStyle}
    >
      <Icon className="w-5 h-5 shrink-0 group-hover:-rotate-6 transition-transform" />
      <span className="overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-200 max-w-0 opacity-0 ml-0 group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-2.5">
        {label}
      </span>
      {isActive && (
        <KawaiiStar className="w-3.5 h-3.5 shrink-0 ml-1 text-white/90 animate-pop-in" />
      )}
      {isActive && (
        <img
          src={lilGuyMoogle}
          alt=""
          aria-hidden="true"
          className="absolute -top-6 -right-2 w-9 rotate-12 pointer-events-none select-none drop-shadow-[0_3px_4px_rgba(0,0,0,0.18)] animate-pop-in"
        />
      )}
    </Link>
  );
});

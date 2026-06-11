import { useState, type CSSProperties } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/shared/contexts/ThemeContext";
import type { Tab } from "@/shared/nav/tabs";
import { MobileTab } from "@/app/nav/MobileTab";
import { SheetTab } from "@/app/nav/SheetTab";

function MoreIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid grid-cols-2 place-content-center gap-[3px] ${className}`}
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="w-[7px] h-[7px] rounded-full bg-current" />
      ))}
    </span>
  );
}

export function MobileNav({
  tabs,
  currentPath,
}: {
  tabs: Tab[];
  currentPath: string;
}) {
  const { isDarkMode, setColorMode } = useTheme();
  const [moreOpen, setMoreOpen] = useState(false);
  const isActive = (path: string) => currentPath === path;

  // Mobile: keep ~4 core tabs in the bar; everything else lives in the More
  // menu - so the bar stays fixed-size as more features are added.
  const CORE_PRIORITY = ["/", "/members", "/chronicle", "/profile", "/about"];
  const coreTabs: Tab[] = [];
  for (const p of CORE_PRIORITY) {
    const t = tabs.find((tab) => tab.path === p);
    if (t) coreTabs.push(t);
    if (coreTabs.length === 4) break;
  }
  const corePaths = new Set(coreTabs.map((t) => t.path));
  const moreTabs = tabs.filter((t) => !corePaths.has(t.path));
  const moreActive = moreOpen || moreTabs.some((t) => isActive(t.path));
  const MORE_COLOR = "#9b8cce";

  // shared "floating bubble" styling for the pill + the More card, so they read
  // as one nav. Solid fill (NOT backdrop-filter - that goes stale on iOS scroll).
  const floatStyle: CSSProperties = {
    background: "var(--card)",
    border: "2px solid color-mix(in srgb, var(--primary) 16%, var(--card))",
    boxShadow: "0 12px 30px -10px var(--shadow), 0 4px 10px -4px var(--shadow)",
  };

  return (
    /* mobile: a floating pill that hovers above the home indicator, so the page
       background runs edge-to-edge underneath it. The <nav> spans the width but is
       click-through; only the pill + More card catch taps.

       CRITICAL: offset UP from the bottom edge (bottom-[...safe...]), never flush.
       iOS Safari treats ANY fixed element whose box reaches a screen edge as a bar
       it must keep above its toolbar, which stops content scrolling behind the
       toolbar and leaves a chrome-coloured band on non-scrolling pages. The nav is
       offset off the bottom AND only as tall as its content (column-stacked card +
       pill), so it never reaches an edge. This is why the "More" menu is a card
       inside the nav, NOT a separate full-screen overlay/backdrop. */
    <nav
      className="md:hidden fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] z-50 flex flex-col items-center gap-2 px-3 pointer-events-none"
      aria-label="Mobile navigation"
    >
      {/* "More" menu - pops up directly above the pill, no dimmed backdrop. */}
      {moreOpen && (
        <div
          className="pointer-events-auto w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl p-2.5"
          style={{ ...floatStyle, animation: "fadeSlideIn 0.2s ease-out" }}
          role="menu"
          aria-label="More navigation"
        >
          <div className="grid grid-cols-3 gap-2">
            {moreTabs.map((tab) => (
              <SheetTab
                key={tab.path}
                tab={tab}
                isActive={isActive(tab.path)}
                onNavigate={() => setMoreOpen(false)}
              />
            ))}
            <button
              type="button"
              onClick={() => setColorMode(isDarkMode ? "light" : "dark")}
              className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl font-display font-bold text-xs cursor-pointer active:scale-95 transition-transform"
              style={{
                background:
                  "color-mix(in srgb, var(--accent) 16%, var(--card))",
                color: "var(--accent)",
                boxShadow:
                  "0 2px 0 0 color-mix(in srgb, var(--accent) 26%, transparent)",
              }}
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
              <span>{isDarkMode ? "Light" : "Dark"}</span>
            </button>
          </div>
        </div>
      )}

      {/* the floating pill */}
      <div
        className="pointer-events-auto flex items-center gap-0.5 p-1.5 max-w-full"
        style={{ ...floatStyle, borderRadius: "9999px" }}
      >
        {coreTabs.map((tab) => (
          <MobileTab key={tab.path} tab={tab} isActive={isActive(tab.path)} />
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={moreOpen}
          aria-label="More"
          className="relative flex h-11 items-center justify-center rounded-full px-3 font-display font-bold text-[13px] leading-none cursor-pointer transition-[background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-90"
          style={
            moreActive
              ? ({
                  background: MORE_COLOR,
                  color: "#fff",
                  boxShadow: `0 4px 12px -3px color-mix(in srgb, ${MORE_COLOR} 70%, transparent)`,
                } as CSSProperties)
              : ({ color: MORE_COLOR } as CSSProperties)
          }
        >
          <MoreIcon className="w-[22px] h-[22px]" />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              moreActive
                ? "max-w-[5rem] opacity-100 ml-1.5"
                : "max-w-0 opacity-0"
            }`}
          >
            More
          </span>
        </button>
      </div>
    </nav>
  );
}

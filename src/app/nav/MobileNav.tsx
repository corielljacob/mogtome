import {
  useState,
  useRef,
  type CSSProperties,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { Sun, Moon, X } from "lucide-react";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { KawaiiStar } from "@/shared/ui/kawaiiMotifs";
import type { Tab } from "@/app/nav/tabs";
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const isActive = (path: string) => currentPath === path;

  // swipe-to-dismiss for the "More" sheet (replaces Framer's drag - Framer Motion
  // was removed app-wide because its mount/unmount churned the iOS compositor).
  const [dragY, setDragY] = useState(0);
  const dragStartY = useRef<number | null>(null);
  const onHandleTouchStart = (e: ReactTouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };
  const onHandleTouchMove = (e: ReactTouchEvent) => {
    if (dragStartY.current === null) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    setDragY(dy > 0 ? dy : 0);
  };
  const onHandleTouchEnd = () => {
    if (dragStartY.current === null) return;
    const shouldClose = dragY > 100;
    dragStartY.current = null;
    setDragY(0);
    if (shouldClose) setSheetOpen(false);
  };

  // Mobile: keep ~4 core tabs in the bar; everything else lives in the More
  // sheet - so the bar stays fixed-size as more features are added.
  const CORE_PRIORITY = ["/", "/members", "/chronicle", "/profile", "/about"];
  const coreTabs: Tab[] = [];
  for (const p of CORE_PRIORITY) {
    const t = tabs.find((tab) => tab.path === p);
    if (t) coreTabs.push(t);
    if (coreTabs.length === 4) break;
  }
  const corePaths = new Set(coreTabs.map((t) => t.path));
  const moreTabs = tabs.filter((t) => !corePaths.has(t.path));
  const moreActive = sheetOpen || moreTabs.some((t) => isActive(t.path));
  const MORE_COLOR = "#9b8cce";

  return (
    <>
      {/* mobile: a floating pill that hovers above the home indicator, so the
          page background runs edge-to-edge underneath it. The <nav> spans the
          width but is click-through; only the pill itself catches taps.

          CRITICAL: this is offset UP from the bottom edge (bottom-[...safe...])
          rather than pinned flush (bottom-0 + matching pb). iOS Safari treats a
          fixed element touching bottom:0 as a bottom bar it must keep above its
          toolbar, which stops page content from scrolling behind the toolbar
          (verified by bisection). Keeping the fixed box off the edge preserves
          the native toolbar-collapse / content-behind-toolbar behaviour. */}
      <nav
        className="md:hidden fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] z-50 flex justify-center px-3 pointer-events-none"
        aria-label="Mobile navigation"
      >
        <div
          className="pointer-events-auto flex items-center gap-0.5 p-1.5 max-w-full"
          style={{
            borderRadius: "9999px",
            // Solid (opaque) pill - NOT a backdrop-filter frost. On iOS Safari
            // `backdrop-filter` is a GPU compositor layer that stops re-sampling
            // mid-scroll and goes stale/blank during the toolbar collapse/expand
            // repaint, which banded the nav area on long pages. A solid fill
            // repaints instantly and never bands.
            background: "var(--card)",
            border:
              "2px solid color-mix(in srgb, var(--primary) 16%, var(--card))",
            boxShadow:
              "0 12px 30px -10px var(--shadow), 0 4px 10px -4px var(--shadow)",
          }}
        >
          {coreTabs.map((tab) => (
            <MobileTab key={tab.path} tab={tab} isActive={isActive(tab.path)} />
          ))}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
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

      {/* mobile: "More" bottom sheet */}
      {sheetOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/45"
            style={
              dragY
                ? { opacity: Math.max(0, 1 - dragY / 300) }
                : { animation: "fadeIn 0.2s ease-out" }
            }
            onClick={() => setSheetOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0"
            style={
              dragY
                ? { transform: `translateY(${dragY}px)` }
                : {
                    animation:
                      "sheetSlideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                  }
            }
            role="dialog"
            aria-modal="true"
            aria-label="More navigation"
          >
            <div className="surface rounded-t-2xl px-4 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              {/* grab handle - swipe down here to dismiss */}
              <div
                onTouchStart={onHandleTouchStart}
                onTouchMove={onHandleTouchMove}
                onTouchEnd={onHandleTouchEnd}
                style={{ touchAction: "none" }}
                className="-mt-1 mb-2 flex justify-center pt-1 pb-2 cursor-grab active:cursor-grabbing"
              >
                <div
                  className="h-1.5 w-10 rounded-full bg-[color:color-mix(in_srgb,var(--text-subtle)_40%,transparent)]"
                  aria-hidden="true"
                />
              </div>
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="flex items-center gap-1.5 font-display font-bold text-base text-[var(--text)]">
                  <KawaiiStar
                    className="w-4 h-4 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  More, kupo~
                </p>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--primary)_12%,transparent)] text-[var(--text-muted)] cursor-pointer active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {moreTabs.map((tab) => (
                  <SheetTab
                    key={tab.path}
                    tab={tab}
                    isActive={isActive(tab.path)}
                    onNavigate={() => setSheetOpen(false)}
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
          </div>
        </div>
      )}
    </>
  );
}

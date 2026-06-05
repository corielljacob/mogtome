import { useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { KawaiiStar } from "../kawaiiMotifs";
import type { Tab } from "./tabs";
import { MobileTab } from "./MobileTab";
import { SheetTab } from "./SheetTab";

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
      {/* mobile: bottom bar - core tabs + "More" */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 px-2 pb-[env(safe-area-inset-bottom)] pointer-events-none"
        aria-label="Mobile navigation"
      >
        <div className="pointer-events-auto flex items-end justify-center gap-1.5 px-1 pt-2">
          {coreTabs.map((tab) => (
            <MobileTab key={tab.path} tab={tab} isActive={isActive(tab.path)} />
          ))}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            aria-label="More"
            className={`relative flex flex-col items-center gap-0.5 px-2.5 pt-2 pb-2 rounded-t-2xl font-display font-bold text-[10px] leading-none shrink-0 cursor-pointer transition-transform duration-150 active:scale-90 ${moreActive ? "-translate-y-1.5" : ""}`}
            style={
              moreActive
                ? ({
                    background: MORE_COLOR,
                    color: "#fff",
                    boxShadow: `0 0 0 2px var(--card), 0 3px 0 0 color-mix(in srgb, ${MORE_COLOR} 55%, black)`,
                  } as CSSProperties)
                : ({
                    background: `color-mix(in srgb, ${MORE_COLOR} 16%, var(--card))`,
                    color: MORE_COLOR,
                  } as CSSProperties)
            }
          >
            <MoreIcon className="w-5 h-5" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* mobile: "More" bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <div className="md:hidden fixed inset-0 z-[60]">
            <motion.div
              className="absolute inset-0 bg-black/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              className="absolute inset-x-0 bottom-0"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) setSheetOpen(false);
              }}
              role="dialog"
              aria-modal="true"
              aria-label="More navigation"
            >
              <div className="surface rounded-t-2xl px-4 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                <div
                  className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[color:color-mix(in_srgb,var(--text-subtle)_40%,transparent)]"
                  aria-hidden="true"
                />
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

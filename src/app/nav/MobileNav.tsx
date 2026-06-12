import { useState, useRef, useLayoutEffect, type CSSProperties } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/shared/contexts/ThemeContext";
import type { Tab } from "@/shared/nav/tabs";
import { MobileTab } from "@/app/nav/MobileTab";
import { SheetTab } from "@/app/nav/SheetTab";

// 4 core tabs stay in the bar; everything else lives in the More menu, so the bar
// stays a fixed size as features grow.
const CORE_PRIORITY = ["/", "/members", "/chronicle", "/profile", "/about"];
const MORE_COLOR = "#9b8cce";

// Shared "frosted bubble" styling for the pill + the More card (one cohesive nav):
// translucent fill + a light backdrop blur, no drop shadow. Hoisted to module scope
// (all values static - the CSS vars resolve at paint, so theme changes still apply)
// so it isn't reallocated every render. The blur is an inline style, not a
// backdrop-blur-* class (base.css strips those on mobile), and kept modest: a fixed
// bar re-blurs the page behind it every scroll frame, so a small radius + a single
// pass (no saturate) keeps scrolling smooth on phones.
const FLOAT_STYLE: CSSProperties = {
  background: "color-mix(in srgb, var(--card) 72%, transparent)",
  border: "2px solid color-mix(in srgb, var(--primary) 16%, var(--card))",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};
const PILL_STYLE: CSSProperties = { ...FLOAT_STYLE, borderRadius: "9999px" };
const MORE_CARD_STYLE: CSSProperties = {
  ...FLOAT_STYLE,
  animation: "fadeSlideIn 0.2s ease-out",
};

// The single active "highlight" that slides + morphs between tabs.
//
// Position/size are driven by an exponential-follow rAF loop (see the effect), NOT
// CSS transitions: while a label expands, the target box changes every frame, and
// re-targeting a CSS transition each frame restarts its easing - the highlight
// stutters ("jumpy"). The follow loop instead moves a fraction toward the live
// target each frame, so velocity stays continuous no matter how the target moves,
// and the integer rounding of offsetWidth gets filtered out. Colour/opacity still
// morph via CSS here - they're one-shot changes, which transitions handle well.
const INDICATOR_STYLE: CSSProperties = {
  width: 0,
  height: 0,
  opacity: 0,
  transition:
    "background-color 250ms ease, box-shadow 250ms ease, opacity 150ms ease",
};

// follow time-constant: ~95% of the remaining distance is covered in 3x this, so
// a tab-to-tab glide settles in roughly a quarter second. Smaller = tighter glue.
const FOLLOW_TAU_MS = 60;

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

  // Close the More menu on any route change. The menu has no backdrop, so the user
  // can navigate while it's open (a core tab, or any link on the page behind it) -
  // and a lingering open menu keeps the More button claimed as the highlight on the
  // new view. Adjust-state-during-render (not an effect): the close happens in the
  // same render as the navigation, so the stale menu never paints.
  const [prevPath, setPrevPath] = useState(currentPath);
  if (prevPath !== currentPath) {
    setPrevPath(currentPath);
    setMoreOpen(false);
  }

  // split the tabs into the core bar + the overflow ("More") menu
  const coreTabs: Tab[] = [];
  for (const p of CORE_PRIORITY) {
    const t = tabs.find((tab) => tab.path === p);
    if (t) coreTabs.push(t);
    if (coreTabs.length === 4) break;
  }
  const corePaths = new Set(coreTabs.map((t) => t.path));
  const moreTabs = tabs.filter((t) => !corePaths.has(t.path));
  const moreActive = moreOpen || moreTabs.some((t) => isActive(t.path));

  // The active highlight follows the [data-nav-active] item with an exponential
  // pursuit: each rAF it reads the tab's live box and closes a time-based fraction
  // of the remaining gap, then puts itself to sleep once settled. Smooth no matter
  // how the target moves (slide between tabs, label expanding underneath, both at
  // once), and entirely imperative - tracking never re-renders the nav.
  const pillRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  // the highlight's current box; null = not placed (first placement snaps instead
  // of gliding - MobileNav mounts fresh whenever the user leaves home, and without
  // the snap it would visibly fly in from the pill's corner on every mount).
  const boxRef = useRef<{ x: number; w: number } | null>(null);
  useLayoutEffect(() => {
    const pill = pillRef.current;
    const ind = indicatorRef.current;
    if (!pill || !ind) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let raf = 0;
    let prevTime = 0;
    let settledFrames = 0;
    let lastColor = "";

    const step = (now: number) => {
      raf = 0;
      const active = pill.querySelector<HTMLElement>(
        '[data-nav-active="true"]',
      );
      if (!active) {
        ind.style.opacity = "0";
        boxRef.current = null; // reappear with a snap, not a glide
        return;
      }
      // offset* (not getBoundingClientRect) on purpose: it ignores transforms, so
      // the active:scale-90 press squish doesn't shrink the highlight.
      const tx = active.offsetLeft;
      const tw = active.offsetWidth;
      const color = active.dataset.navColor || "var(--primary)";

      const dt = Math.min(64, now - prevTime || 16);
      prevTime = now;

      let box = boxRef.current;
      if (!box || reduceMotion) {
        box = { x: tx, w: tw }; // snap: first placement / reduced motion
        boxRef.current = box;
      } else {
        const a = 1 - Math.exp(-dt / FOLLOW_TAU_MS);
        box.x += (tx - box.x) * a;
        box.w += (tw - box.w) * a;
      }

      ind.style.opacity = "1";
      ind.style.height = `${active.offsetHeight}px`;
      ind.style.transform = `translate3d(${box.x}px, ${active.offsetTop}px, 0)`;
      ind.style.width = `${box.w}px`;
      if (color !== lastColor) {
        lastColor = color;
        ind.style.background = color;
        ind.style.boxShadow = `0 3px 10px -4px color-mix(in srgb, ${color} 45%, transparent)`;
      }

      // sleep once glued to a resting target for a few frames
      if (Math.abs(tx - box.x) < 0.5 && Math.abs(tw - box.w) < 0.5) {
        if (++settledFrames >= 3) {
          box.x = tx;
          box.w = tw;
          ind.style.transform = `translate3d(${tx}px, ${active.offsetTop}px, 0)`;
          ind.style.width = `${tw}px`;
          return;
        }
      } else {
        settledFrames = 0;
      }
      raf = requestAnimationFrame(step);
    };

    const wake = () => {
      if (!raf) {
        prevTime = performance.now();
        settledFrames = 0;
        raf = requestAnimationFrame(step);
      }
    };

    wake();
    // wake on geometry changes the loop can't see coming (orientation, font load,
    // auth tabs appearing). Observe the tabs, not the indicator - observing the
    // element the loop itself resizes would feed back into an endless wake cycle.
    const ro = new ResizeObserver(wake);
    ro.observe(pill);
    for (const child of Array.from(pill.children)) {
      if (child !== ind) ro.observe(child);
    }
    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [currentPath, moreActive, tabs]);

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
          style={MORE_CARD_STYLE}
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
        ref={pillRef}
        className="pointer-events-auto relative flex items-center gap-0.5 p-1.5 max-w-full"
        style={PILL_STYLE}
      >
        {/* single active highlight that slides + morphs between tabs (behind them) */}
        <div
          ref={indicatorRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-0 rounded-full"
          style={INDICATOR_STYLE}
        />
        {coreTabs.map((tab) => (
          <MobileTab
            key={tab.path}
            tab={tab}
            // while the More menu is open the single highlight moves to the More
            // button, so the page's own tab goes visually inactive - exactly ONE
            // [data-nav-active] exists at any time (two would leave one as white
            // text with no highlight under it).
            isActive={!moreOpen && isActive(tab.path)}
            isCurrent={isActive(tab.path)}
          />
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={moreOpen}
          aria-label="More"
          data-nav-active={moreActive ? "true" : undefined}
          data-nav-color={MORE_COLOR}
          className="relative z-10 flex h-11 items-center justify-center rounded-full px-3 font-display font-bold text-[13px] leading-none cursor-pointer transition-[color] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-90 touch-manipulation"
          style={
            moreActive
              ? ({ color: "#fff" } as CSSProperties)
              : ({ color: MORE_COLOR } as CSSProperties)
          }
        >
          <MoreIcon className="w-[22px] h-[22px]" />
          {/* same grid 0fr->1fr label reveal as MobileTab (no max-width bulge) */}
          <span
            className={`grid transition-[grid-template-columns,opacity,margin] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              moreActive
                ? "grid-cols-[1fr] opacity-100 ml-1.5"
                : "grid-cols-[0fr] opacity-0"
            }`}
          >
            <span className="overflow-hidden whitespace-nowrap min-w-0">
              More
            </span>
          </span>
        </button>
      </div>
    </nav>
  );
}

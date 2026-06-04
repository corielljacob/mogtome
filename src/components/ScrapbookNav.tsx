import { memo, useState, useEffect, useRef, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Home,
  Users,
  Scroll,
  Info,
  Settings,
  UserCircle,
  Crown,
  Sun,
  Moon,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { LogoIcon } from "./LogoIcon";
import { KawaiiStar, KawaiiHeart } from "./kawaiiMotifs";
import lilGuyMoogle from "../assets/moogles/lil guy moogle.webp";

// whole-site nav as index tabs on the page edge.
// desktop (md+): vertical stack on the left. mobile (<md): horizontal strip along the bottom.

interface Tab {
  path: string;
  label: string;
  icon: LucideIcon;
  /** theme token or hex */
  color: string;
}

const MAIN_TABS: Tab[] = [
  { path: "/", label: "Home", icon: Home, color: "var(--primary)" },
  { path: "/members", label: "Family", icon: Users, color: "var(--secondary)" },
  {
    path: "/chronicle",
    label: "Chronicle",
    icon: Scroll,
    color: "var(--accent)",
  },
  { path: "/about", label: "About", icon: Info, color: "#a886d6" },
];

function useTabs(): Tab[] {
  const { isAuthenticated, user } = useAuth();
  const hasKnighthood = user?.hasKnighthood || user?.hasTemporaryKnighthood;
  return [
    ...MAIN_TABS,
    ...(isAuthenticated
      ? [
          {
            path: "/profile",
            label: "Profile",
            icon: UserCircle,
            color: "var(--secondary)",
          } as Tab,
        ]
      : []),
    ...(isAuthenticated && hasKnighthood
      ? [
          {
            path: "/dashboard",
            label: "Dashboard",
            icon: Crown,
            color: "#eaa53a",
          } as Tab,
        ]
      : []),
    { path: "/settings", label: "Settings", icon: Settings, color: "#7fb1cc" },
  ];
}

const DesktopTab = memo(function DesktopTab({
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

const ThemeToggleSticker = memo(function ThemeToggleSticker() {
  const { isDarkMode, setColorMode } = useTheme();
  return (
    <button
      onClick={() => setColorMode(isDarkMode ? "light" : "dark")}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative flex items-center justify-center w-12 h-12 rounded-r-2xl -translate-x-1.5 hover:translate-x-0 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
      style={{
        background: "color-mix(in srgb, var(--accent) 20%, var(--card))",
        color: "var(--accent)",
        boxShadow:
          "0 0 0 3px var(--card), 2px 3px 0 0 color-mix(in srgb, var(--accent) 28%, transparent)",
      }}
    >
      <Sun
        className="absolute w-5 h-5 transition-all duration-300"
        style={{
          transform: isDarkMode
            ? "rotate(90deg) scale(0)"
            : "rotate(0deg) scale(1)",
          opacity: isDarkMode ? 0 : 1,
        }}
      />
      <Moon
        className="absolute w-5 h-5 transition-all duration-300"
        style={{
          transform: isDarkMode
            ? "rotate(0deg) scale(1)"
            : "rotate(-90deg) scale(0)",
          opacity: isDarkMode ? 1 : 0,
        }}
      />
    </button>
  );
});

// poke-me easter egg, not a nav link - Home already has its own tab
const KUPO_LINES = [
  "Kupo!",
  "Kupopo~",
  "Mog mog!",
  "Pom-pom!",
  "Hi hi, kupo!",
  "Eee~ kupo!",
];
const KUPO_BURST = [
  { x: -18, y: -22, kind: "heart" as const },
  { x: 18, y: -20, kind: "star" as const },
  { x: -22, y: 4, kind: "star" as const },
  { x: 22, y: 2, kind: "heart" as const },
  { x: 0, y: -28, kind: "star" as const },
];

const MoogleLogoButton = memo(function MoogleLogoButton() {
  const reduceMotion = useReducedMotion();
  const [pokes, setPokes] = useState(0);
  const [say, setSay] = useState<string | null>(null);
  const sayTimer = useRef<number | undefined>(undefined);

  const poke = () => {
    setPokes((n) => n + 1);
    setSay(KUPO_LINES[Math.floor(Math.random() * KUPO_LINES.length)]);
    if (sayTimer.current) window.clearTimeout(sayTimer.current);
    sayTimer.current = window.setTimeout(() => setSay(null), 1400);
  };

  useEffect(
    () => () => {
      if (sayTimer.current) window.clearTimeout(sayTimer.current);
    },
    [],
  );

  return (
    <div className="relative mb-1">
      <AnimatePresence>
        {say && (
          <motion.span
            key={pokes}
            initial={{ opacity: 0, x: -6, scale: 0.6 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -6, scale: 0.6 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.4 }}
            className="absolute left-full top-1.5 ml-2 z-50 whitespace-nowrap rounded-full border border-[color:color-mix(in_srgb,var(--primary)_30%,var(--card))] bg-[var(--card)] px-2.5 py-1 text-xs font-display font-bold text-[var(--primary)] shadow-[0_3px_8px_-3px_var(--shadow)] pointer-events-none"
          >
            {say}
          </motion.span>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={poke}
        aria-label="Poke the moogle, kupo!"
        className="group relative flex items-center justify-center w-12 h-12 rounded-r-2xl -translate-x-1.5 hover:translate-x-0 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        style={{
          background: "var(--card)",
          boxShadow:
            "0 0 0 3px var(--card), 2px 3px 0 0 color-mix(in srgb, var(--primary) 26%, transparent)",
        }}
      >
        {!reduceMotion && pokes > 0 && (
          <span
            key={pokes}
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            {KUPO_BURST.map((b, i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: b.x,
                  y: b.y,
                  scale: [0.4, 1, 0.6],
                }}
                transition={{ duration: 0.75, ease: "easeOut" }}
              >
                {b.kind === "heart" ? (
                  <KawaiiHeart className="w-3 h-3 text-[var(--primary)]" />
                ) : (
                  <KawaiiStar className="w-3 h-3 text-[var(--accent)]" />
                )}
              </motion.span>
            ))}
          </span>
        )}

        <motion.span
          key={pokes}
          animate={
            reduceMotion || pokes === 0
              ? { rotate: 0, scale: 1 }
              : { rotate: [0, -14, 12, -6, 0], scale: [1, 1.18, 1] }
          }
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="relative"
        >
          <LogoIcon hovered={false} />
        </motion.span>
      </button>
    </div>
  );
});

const MobileTab = memo(function MobileTab({
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

const SheetTab = memo(function SheetTab({
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

export function ScrapbookNav() {
  const location = useLocation();
  const tabs = useTabs();
  const { isDarkMode, setColorMode } = useTheme();
  const [sheetOpen, setSheetOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

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
      {/* desktop: left-edge tabs */}
      <nav
        className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-40 flex-col items-start gap-2.5 max-h-screen py-2"
        aria-label="Main navigation"
      >
        <MoogleLogoButton />

        {tabs.map((tab) => (
          <DesktopTab key={tab.path} tab={tab} isActive={isActive(tab.path)} />
        ))}

        <ThemeToggleSticker />
      </nav>

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

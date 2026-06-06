import { memo, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronsLeft } from "lucide-react";
import { LogoIcon } from "@/shared/ui/LogoIcon";
import { KawaiiStar, KawaiiSparkle } from "@/shared/ui/kawaiiMotifs";
import type { Tab } from "@/app/nav/tabs";
import { useNavExpanded } from "@/shared/contexts/NavExpandedContext";
import lilGuyMoogle from "@/assets/moogles/lil guy moogle.webp";

const DASHED_RULE =
  "repeating-linear-gradient(90deg, color-mix(in srgb, var(--primary) 32%, transparent) 0 5px, transparent 5px 10px)";

// alternating "stuck on by hand" tilt for the sticker badges
const tiltFor = (i: number) => (i % 2 === 0 ? "-rotate-6" : "rotate-6");

// the nav rows cascade in one after another when the panel swings open
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.09 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -18, scale: 0.94 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", damping: 20, stiffness: 360 },
  },
};

// A full nav row: a tilted sticker icon badge + label. The active row fills in
// with the tab's colour and gets a little candy lip + a trailing kira star.
const PanelTab = memo(function PanelTab({
  tab,
  isActive,
  index,
}: {
  tab: Tab;
  isActive: boolean;
  index: number;
}) {
  const { path, label, icon: Icon, color } = tab;
  const activeStyle: CSSProperties = {
    background: color,
    color: "#fff",
    boxShadow: `0 0 0 2px var(--card), 3px 4px 0 0 color-mix(in srgb, ${color} 52%, black)`,
  };
  const idleStyle = {
    color: "var(--text-muted)",
    "--row-tint": `color-mix(in srgb, ${color} 14%, transparent)`,
  } as CSSProperties;
  return (
    <Link
      to={path}
      aria-current={isActive ? "page" : undefined}
      className={`group relative flex items-center gap-3 rounded-2xl pl-2 pr-3 py-2 font-display font-bold text-sm
        transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]
        ${isActive ? "" : "hover:bg-[var(--row-tint)] hover:text-[var(--text)] hover:translate-x-0.5"}`}
      style={isActive ? activeStyle : idleStyle}
    >
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-0 group-hover:scale-110 ${tiltFor(index)}`}
        style={
          isActive
            ? {
                background: "rgba(255,255,255,0.22)",
                color: "#fff",
                boxShadow: "0 0 0 2px rgba(255,255,255,0.28)",
              }
            : {
                background: `color-mix(in srgb, ${color} 18%, var(--card))`,
                color,
                boxShadow: `0 0 0 2px var(--card), 0 1px 3px -1px var(--shadow)`,
              }
        }
      >
        <Icon className="w-[18px] h-[18px]" />
      </span>
      <span className="truncate">{label}</span>
      {isActive && (
        <KawaiiStar className="w-3.5 h-3.5 shrink-0 ml-auto text-white/95 animate-pop-in" />
      )}
    </Link>
  );
});

// Expanded sidebar (pinned, full-height): the slim rail's contents re-laid as a
// kawaii scrapbook page - sticker title, taped brand plate, stuck-on tabs and a
// moogle keeping watch at the foot. Slides out from the left edge.
export function DesktopNavPanel({
  tabs,
  currentPath,
}: {
  tabs: Tab[];
  currentPath: string;
}) {
  const { toggle } = useNavExpanded();

  return (
    <motion.nav
      aria-label="Main navigation"
      initial={{ opacity: 0, x: -48, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{
        opacity: 0,
        x: -30,
        scale: 0.97,
        transition: { duration: 0.16, ease: "easeIn" },
      }}
      transition={{ type: "spring", damping: 26, stiffness: 280, mass: 0.9 }}
      style={{ transformOrigin: "left center" }}
      className="hidden md:flex fixed inset-y-0 left-0 z-40 items-stretch p-2"
    >
      <div className="surface relative w-60 flex flex-col rounded-3xl p-2.5 overflow-hidden">
        {/* faint sticker-book polka dots wash behind everything */}
        <span
          className="kawaii-dots absolute inset-0 opacity-40 pointer-events-none"
          aria-hidden="true"
        />

        {/* header: a little brand plate, taped to the board with two washi strips */}
        <div
          className="relative flex items-center gap-2.5 rounded-2xl px-2.5 py-2.5 mb-2.5 shrink-0"
          style={{
            background: "color-mix(in srgb, var(--primary) 10%, var(--card))",
            boxShadow:
              "inset 0 0 0 1.5px color-mix(in srgb, var(--primary) 16%, transparent)",
          }}
        >
          <span
            className="absolute -top-2 left-4 w-9 h-4 -rotate-[10deg] rounded-[2px] opacity-85 z-10 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(45deg, color-mix(in srgb, var(--primary) 48%, transparent) 0 5px, color-mix(in srgb, var(--primary) 26%, transparent) 5px 10px)",
            }}
            aria-hidden="true"
          />
          <span
            className="absolute -top-2 right-4 w-9 h-4 rotate-[10deg] rounded-[2px] opacity-85 z-10 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(45deg, color-mix(in srgb, var(--accent) 48%, transparent) 0 5px, color-mix(in srgb, var(--accent) 26%, transparent) 5px 10px)",
            }}
            aria-hidden="true"
          />
          <div className="-rotate-3">
            <LogoIcon hovered={false} />
          </div>
          <span className="min-w-0 flex flex-col gap-1">
            <span
              className="sticker-text font-title-latin font-black text-2xl leading-none tracking-tight"
              style={{ textShadow: "none" }}
            >
              <span className="text-[var(--primary)]">Mog</span>
              <span className="text-[var(--secondary)]">Tome</span>
            </span>
            <span className="eyebrow-script text-lg leading-none text-[var(--secondary)] -rotate-2 inline-flex items-center gap-1">
              Kupo Life! FC
              <KawaiiStar
                className="w-3 h-3 text-[var(--accent)] rotate-12"
                aria-hidden="true"
              />
            </span>
          </span>
        </div>

        {/* handwritten section label */}
        <p
          className="eyebrow-script text-lg leading-none text-[var(--text-subtle)] pl-2 mb-1 shrink-0 inline-flex items-center gap-1.5"
          aria-hidden="true"
        >
          <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--accent)]" />
          explore~
        </p>

        {/* nav rows - grow to fill; the moogle settles at the foot of the list.
            They cascade in one by one when the panel swings open. */}
        <motion.div
          className="relative flex-1 flex flex-col gap-1 py-0.5"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          {tabs.map((tab, i) => (
            <motion.div key={tab.path} variants={itemVariants}>
              <PanelTab
                tab={tab}
                isActive={currentPath === tab.path}
                index={i}
              />
            </motion.div>
          ))}

          {/* mascot keeping watch, fills the tall panel's quiet middle */}
          <motion.div
            variants={itemVariants}
            className="mt-auto pt-4 flex flex-col items-center gap-1 pointer-events-none select-none"
          >
            <img
              src={lilGuyMoogle}
              alt=""
              aria-hidden="true"
              className="w-10 rotate-6 opacity-90 drop-shadow-[0_3px_4px_rgba(0,0,0,0.16)]"
            />
            <span className="eyebrow-script text-base leading-none text-[var(--text-subtle)] -rotate-3">
              kupo~
            </span>
          </motion.div>
        </motion.div>

        <span
          className="mx-1 mt-1.5 mb-1.5 h-px rounded-full shrink-0"
          style={{ background: DASHED_RULE }}
          aria-hidden="true"
        />

        {/* shrink back to the slim rail */}
        <button
          type="button"
          onClick={toggle}
          aria-label="Collapse navigation menu"
          aria-expanded
          className="group flex items-center gap-3 rounded-2xl pl-2 pr-3 py-2 font-display font-bold text-sm text-[var(--text-muted)] cursor-pointer shrink-0
            transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:text-[var(--text)] hover:bg-[var(--row-tint)] hover:translate-x-0.5
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]"
          style={
            {
              "--row-tint":
                "color-mix(in srgb, var(--primary) 14%, transparent)",
            } as CSSProperties
          }
        >
          <span
            className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0 rotate-6 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-0 group-hover:-translate-x-0.5"
            style={{
              background: "color-mix(in srgb, var(--primary) 18%, var(--card))",
              color: "var(--primary)",
              boxShadow: "0 0 0 2px var(--card), 0 1px 3px -1px var(--shadow)",
            }}
          >
            <ChevronsLeft className="w-[18px] h-[18px]" />
          </span>
          <span>Collapse</span>
        </button>
      </div>
    </motion.nav>
  );
}

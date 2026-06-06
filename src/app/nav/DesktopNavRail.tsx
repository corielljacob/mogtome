import { type CSSProperties } from "react";
import { motion } from "motion/react";
import { ChevronsRight } from "lucide-react";
import type { Tab } from "@/app/nav/tabs";
import { MoogleLogoButton } from "@/app/nav/MoogleLogoButton";
import { DesktopTab } from "@/app/nav/DesktopTab";
import { useNavExpanded } from "@/shared/contexts/NavExpandedContext";

// The "pull me out" handle that swaps the slim rail for the expanded sidebar.
// Styled like an idle DesktopTab so it sits naturally at the foot of the rail.
function ExpandHandle() {
  const { toggle } = useNavExpanded();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Expand navigation menu"
      aria-expanded={false}
      className="group relative flex items-center h-12 rounded-r-2xl pl-4 pr-3 font-display font-bold text-sm cursor-pointer
        -translate-x-1.5 hover:translate-x-0 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
      style={
        {
          background: "color-mix(in srgb, var(--primary) 16%, var(--card))",
          color: "var(--primary)",
          boxShadow:
            "0 0 0 3px var(--card), 2px 3px 0 0 color-mix(in srgb, var(--primary) 28%, transparent)",
        } as CSSProperties
      }
    >
      <ChevronsRight className="w-5 h-5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
      <span className="overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-200 max-w-0 opacity-0 ml-0 group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2.5">
        Menu
      </span>
    </button>
  );
}

// Slim edge rail (default): a stack of "bookmark" tabs poking out of the left
// edge. Slides off to the left when the expanded panel takes over.
export function DesktopNavRail({
  tabs,
  currentPath,
}: {
  tabs: Tab[];
  currentPath: string;
}) {
  return (
    <motion.nav
      aria-label="Main navigation"
      initial={{ opacity: 0, x: -22, scale: 0.9, y: "-50%" }}
      animate={{ opacity: 1, x: 0, scale: 1, y: "-50%" }}
      exit={{
        opacity: 0,
        x: -18,
        scale: 0.88,
        y: "-50%",
        transition: { duration: 0.14, ease: "easeIn" },
      }}
      transition={{ type: "spring", damping: 24, stiffness: 320 }}
      style={{ transformOrigin: "left center" }}
      className="hidden md:flex fixed left-0 top-1/2 z-40 flex-col items-start gap-2.5 max-h-screen py-2"
    >
      <MoogleLogoButton />

      {tabs.map((tab) => (
        <DesktopTab
          key={tab.path}
          tab={tab}
          isActive={currentPath === tab.path}
        />
      ))}

      <ExpandHandle />
    </motion.nav>
  );
}

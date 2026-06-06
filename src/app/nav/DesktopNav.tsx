import { AnimatePresence } from "motion/react";
import type { Tab } from "@/app/nav/tabs";
import { DesktopNavRail } from "@/app/nav/DesktopNavRail";
import { DesktopNavPanel } from "@/app/nav/DesktopNavPanel";
import { useNavExpanded } from "@/shared/contexts/NavExpandedContext";

// Two shapes for the desktop nav: the slim edge rail (default) and a pinned,
// expanded sidebar. Toggling crossfades one out as the other slides in - both
// are fixed to the same left edge, so they swap in place.
export function DesktopNav({
  tabs,
  currentPath,
}: {
  tabs: Tab[];
  currentPath: string;
}) {
  const { expanded } = useNavExpanded();

  return (
    <AnimatePresence initial={false}>
      {expanded ? (
        <DesktopNavPanel key="panel" tabs={tabs} currentPath={currentPath} />
      ) : (
        <DesktopNavRail key="rail" tabs={tabs} currentPath={currentPath} />
      )}
    </AnimatePresence>
  );
}

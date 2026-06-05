import type { Tab } from "./tabs";
import { MoogleLogoButton } from "./MoogleLogoButton";
import { DesktopTab } from "./DesktopTab";
import { ThemeToggleSticker } from "./ThemeToggleSticker";

export function DesktopNav({
  tabs,
  currentPath,
}: {
  tabs: Tab[];
  currentPath: string;
}) {
  return (
    <nav
      className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-40 flex-col items-start gap-2.5 max-h-screen py-2"
      aria-label="Main navigation"
    >
      <MoogleLogoButton />

      {tabs.map((tab) => (
        <DesktopTab
          key={tab.path}
          tab={tab}
          isActive={currentPath === tab.path}
        />
      ))}

      <ThemeToggleSticker />
    </nav>
  );
}

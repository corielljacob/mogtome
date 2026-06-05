import type { Tab } from "@/app/nav/tabs";
import { MoogleLogoButton } from "@/app/nav/MoogleLogoButton";
import { DesktopTab } from "@/app/nav/DesktopTab";
import { ThemeToggleSticker } from "@/app/nav/ThemeToggleSticker";

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

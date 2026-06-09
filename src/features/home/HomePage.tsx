import { useTheme } from "@/shared/contexts/ThemeContext";
import { BackgroundAtmospherics } from "@/features/home/BackgroundAtmospherics";
import { ScatteredStickers } from "@/features/home/ScatteredStickers";
import { HeroText } from "@/features/home/HeroText";
import { HeroMoogle } from "@/features/home/HeroMoogle";

export function Home() {
  const { activeEvent, isEventThemeActive } = useTheme();
  const eventActive = isEventThemeActive && activeEvent;

  return (
    <div className="min-h-[100lvh] w-full flex flex-col relative selection:bg-[var(--primary)] selection:text-white overflow-hidden">
      <BackgroundAtmospherics />

      {/* mobile pads for the fixed top/bottom bars; desktop nav is the sidebar */}
      <div
        className={`flex-1 relative z-10 flex flex-col p-4 sm:p-8 lg:py-8 lg:px-12 ${
          eventActive
            ? "pt-[calc(8.5rem+env(safe-area-inset-top))]"
            : "pt-[calc(4rem+env(safe-area-inset-top))]"
        } md:pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-4`}
      >
        {/* my-auto centers the hero when it fits one screen, but lets it grow
            (so the page scrolls) instead of being clipped under the nav on
            shorter phones. */}
        <div className="relative my-auto w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
          <ScatteredStickers />
          <HeroText />
          <HeroMoogle />
        </div>
      </div>
    </div>
  );
}

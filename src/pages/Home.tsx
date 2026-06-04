import { useTheme } from "../contexts/ThemeContext";
import {
  BackgroundAtmospherics,
  ScatteredStickers,
  HeroText,
  HeroMoogle,
} from "../components/home";

export function Home() {
  const { activeEvent, isEventThemeActive } = useTheme();
  const eventActive = isEventThemeActive && activeEvent;

  return (
    <div className="h-full w-full flex flex-col relative bg-[var(--bg)] selection:bg-[var(--primary)] selection:text-white overflow-hidden">
      <BackgroundAtmospherics />

      {/* ── Main Layout ── */}
      {/* Mobile: pad for fixed top/bottom bars. Desktop: no padding needed (sidebar handles nav) */}
      <div
        className={`flex-1 min-h-0 relative z-10 flex flex-col p-4 sm:p-8 lg:py-8 lg:px-12 ${
          eventActive
            ? "pt-[calc(8.5rem+env(safe-area-inset-top))]"
            : "pt-[calc(4rem+env(safe-area-inset-top))]"
        } md:pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-4`}
      >
        {/* ── Hero: text column + moogle column ── */}
        <div className="relative flex-1 min-h-0 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
          <ScatteredStickers />
          <HeroText />
          <HeroMoogle />
        </div>
      </div>
    </div>
  );
}

import { BackgroundAtmospherics } from "@/features/home/BackgroundAtmospherics";
import { ScatteredStickers } from "@/features/home/ScatteredStickers";
import { HeroText } from "@/features/home/HeroText";
import { HeroMoogle } from "@/features/home/HeroMoogle";
import { MobileHome } from "@/features/home/MobileHome";

export function Home() {
  return (
    <div className="h-[100dvh] md:h-auto md:min-h-[100lvh] w-full flex flex-col relative selection:bg-[var(--primary)] selection:text-white overflow-x-clip">
      {/* Atmospherics are desktop-only. On phones the home just uses the flat
          page background (the <html> canvas), which the browser paints across
          the whole screen behind the iOS chrome - no fixed/absolute layer to
          bound or band, full height for free. */}
      <div className="hidden md:block" aria-hidden="true">
        <BackgroundAtmospherics />
      </div>

      {/* Phones: a dedicated app-style dashboard, sized to fit one screen. */}
      <MobileHome />

      {/* Tablet/desktop: the full scrapbook hero (unchanged). */}
      <div className="hidden md:flex flex-1 min-h-0 relative z-10 flex-col p-4 sm:p-8 lg:py-8 lg:px-12 md:pt-4 md:pb-4">
        <div className="relative my-auto w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
          <ScatteredStickers />
          <HeroText />
          <HeroMoogle />
        </div>
      </div>
    </div>
  );
}

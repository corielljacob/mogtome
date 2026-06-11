import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { KawaiiBow, KawaiiCloud } from "@/shared/ui/kawaiiMotifs";
import { WarmMoogleAura } from "@/features/home/WarmMoogleAura";
import { MoogleCharms } from "@/features/home/MoogleCharms";
import { WarmMotes } from "@/features/home/WarmMotes";
import {
  DEFAULT_KUPO_QUOTES,
  DEFAULT_WARM_MOTES,
  generateEventMotes,
  getTimeGreeting,
} from "@/features/home/homeData";

import welcomingMoogle from "@/assets/moogles/mooglef fly transparent.webp";

// preload hero moogle for LCP
if (typeof window !== "undefined") {
  const preloadLink = document.createElement("link");
  preloadLink.rel = "preload";
  preloadLink.as = "image";
  preloadLink.href = welcomingMoogle;
  preloadLink.setAttribute("fetchpriority", "high");
  document.head.appendChild(preloadLink);
}

export function HeroMoogle() {
  const { user } = useAuth();
  const { activeEvent, isEventThemeActive } = useTheme();

  const kupoQuotes = useMemo(
    () =>
      isEventThemeActive && activeEvent
        ? activeEvent.kupoQuotes
        : DEFAULT_KUPO_QUOTES,
    [isEventThemeActive, activeEvent],
  );

  const [quoteIndex, setQuoteIndex] = useState(-1);

  // shown first, before the quote rotation kicks in
  const timeGreeting = useMemo(() => getTimeGreeting(), []);
  const firstGreeting = user
    ? `Welcome home, ${user.memberName.split(" ")[0]}!`
    : timeGreeting;
  const displayQuote = quoteIndex < 0 ? firstGreeting : kupoQuotes[quoteIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % kupoQuotes.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [kupoQuotes]);

  const warmMotes = useMemo(() => {
    if (isEventThemeActive && activeEvent) {
      return generateEventMotes(activeEvent.atmosphere.moteColors);
    }
    return DEFAULT_WARM_MOTES;
  }, [isEventThemeActive, activeEvent]);

  const eventId = isEventThemeActive && activeEvent ? activeEvent.id : null;

  return (
    <div className="w-full lg:flex-1 lg:h-full relative flex flex-col items-center justify-center mt-1 lg:mt-0 z-10">
      {/* bubble sits above the moogle in DOM flow. Outer = entrance (scale/fade),
          inner = perpetual gentle bob (separate transform layers so they don't
          fight). */}
      <div
        className="pointer-events-none relative z-40 mb-2 sm:mb-4 lg:mb-7 lg:mr-10 xl:mr-20 animate-[scaleIn_0.4s_ease-out_1s_both]"
        role="region"
        aria-label="Moogle greeting"
      >
        <div
          style={{ animation: "home-bubble-bob 4s ease-in-out 1.4s infinite" }}
        >
          <div
            className="
          relative bg-[var(--card)]
          px-5 sm:px-7 py-2.5 sm:py-3.5
          rounded-[1.9rem]
          border-2 border-[color:color-mix(in_srgb,var(--primary)_28%,var(--card))]
          shadow-[0_0_0_3px_var(--card),3px_4px_0_0_color-mix(in_srgb,var(--primary)_22%,transparent)]
          w-[15rem] sm:w-[18rem] min-h-[3.25rem] sm:min-h-[4.25rem]
          flex items-center justify-center
        "
          >
            <KawaiiBow
              className="absolute -top-3.5 -left-2.5 w-8 h-8 text-[var(--primary)] -rotate-12 drop-shadow-sm"
              aria-hidden="true"
            />
            {/* tail: card-colored body covers the bubble's bottom border (hides
              the seam), the two bordered outer edges form the pointed tip */}
            <div
              className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-[18px] h-[18px] bg-[var(--card)] border-b-2 border-r-2 border-[color:color-mix(in_srgb,var(--primary)_28%,var(--card))] rotate-45 rounded-br-[6px]"
              aria-hidden="true"
            />

            <p
              key={quoteIndex < 0 ? "greeting" : quoteIndex}
              className="font-accent text-base sm:text-lg md:text-xl text-[var(--primary)] text-center leading-snug font-bold animate-[home-quote-in_0.28s_cubic-bezier(0.4,0,0.2,1)]"
              aria-live="polite"
              aria-atomic="true"
            >
              &ldquo;{displayQuote}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* scale via CSS transform only - doesn't affect flex layout, so the
          speech bubble above stays exactly put */}
      <div className="origin-center scale-[0.82] sm:scale-100 md:scale-[1.15] lg:scale-[1.25] xl:scale-[1.32] lg:mr-10 xl:mr-20">
        <div className="relative pointer-events-auto animate-[popIn_1.5s_ease-out_0.3s_both]">
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-[2%] w-[116%] pointer-events-none drop-shadow-[0_12px_14px_rgba(0,0,0,0.15)]"
            aria-hidden="true"
          >
            <KawaiiCloud className="w-full text-white" />
          </div>
          <WarmMoogleAura eventId={eventId} />
          <MoogleCharms eventId={eventId} />

          {/* idle bob/sway runs on a wrapper so the hover/tap transform on the
              img below isn't overridden by the perpetual keyframes */}
          <div
            className="relative z-20"
            style={{ animation: "home-moogle-idle 5s ease-in-out infinite" }}
          >
            <img
              src={welcomingMoogle}
              alt="A magical mogtome moogle"
              className="relative w-52 sm:w-64 md:w-80 lg:w-[22rem] xl:w-[26rem] drop-shadow-2xl cursor-pointer select-none transition-transform duration-200 hover:scale-105 active:scale-95 active:-rotate-3"
              onClick={() =>
                setQuoteIndex((prev) => (prev + 1) % kupoQuotes.length)
              }
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <WarmMotes motes={warmMotes} />
        </div>
      </div>
    </div>
  );
}

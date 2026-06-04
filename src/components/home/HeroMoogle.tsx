import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { KawaiiBow, KawaiiCloud } from "../kawaiiMotifs";
import { WarmMoogleAura } from "./WarmMoogleAura";
import { MoogleCharms } from "./MoogleCharms";
import { WarmMotes } from "./WarmMotes";
import {
  DEFAULT_KUPO_QUOTES,
  DEFAULT_WARM_MOTES,
  generateEventMotes,
  getTimeGreeting,
} from "./homeData";

// Assets
import welcomingMoogle from "../../assets/moogles/mooglef fly transparent.webp";

// ─────────────────────────────────────────────────────────────────────────────
// PERFORMANCE: Preload hero moogle for instant LCP
// ─────────────────────────────────────────────────────────────────────────────
if (typeof window !== "undefined") {
  const preloadLink = document.createElement("link");
  preloadLink.rel = "preload";
  preloadLink.as = "image";
  preloadLink.href = welcomingMoogle;
  preloadLink.setAttribute("fetchpriority", "high");
  document.head.appendChild(preloadLink);
}

/**
 * Right hero column — the draggable floating moogle on its cloud, its warm aura
 * and charms, and the speech bubble that cycles through kupo quotes.
 */
export function HeroMoogle() {
  const { user } = useAuth();
  const { activeEvent, isEventThemeActive } = useTheme();

  // Determine quotes: event-specific or default
  const kupoQuotes = useMemo(
    () =>
      isEventThemeActive && activeEvent
        ? activeEvent.kupoQuotes
        : DEFAULT_KUPO_QUOTES,
    [isEventThemeActive, activeEvent],
  );

  const [quoteIndex, setQuoteIndex] = useState(-1);

  // Time-aware greeting shown before the rotation kicks in
  const timeGreeting = useMemo(() => getTimeGreeting(), []);
  const firstGreeting = user
    ? `Welcome home, ${user.memberName.split(" ")[0]}!`
    : timeGreeting;
  const displayQuote = quoteIndex < 0 ? firstGreeting : kupoQuotes[quoteIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % kupoQuotes.length);
    }, 4500); // slightly slower pace for a relaxed feel
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
    <div className="w-full lg:flex-1 lg:h-full relative flex flex-col items-center justify-center mt-4 lg:mt-0 z-10">
      {/* Speech bubble lives ABOVE the moogle in DOM flow */}
      <motion.div
        className="pointer-events-none relative z-40 mb-4 sm:mb-5 lg:mb-7 lg:mr-10 xl:mr-20"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ y: [0, -8, 0], opacity: 1, scale: 1 }}
        transition={{
          opacity: { delay: 1, duration: 0.4 },
          scale: { type: "spring", delay: 1, bounce: 0.5 },
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.4,
          },
        }}
        role="region"
        aria-label="Moogle greeting"
      >
        <div
          className="
          relative bg-[var(--card)]
          px-5 sm:px-7 py-3 sm:py-4
          rounded-[1.9rem]
          border-2 border-[color:color-mix(in_srgb,var(--primary)_28%,var(--card))]
          shadow-[0_0_0_3px_var(--card),3px_4px_0_0_color-mix(in_srgb,var(--primary)_22%,transparent)]
          w-[16rem] sm:w-[18rem] min-h-[3.75rem] sm:min-h-[4.25rem]
          flex items-center justify-center
        "
        >
          {/* Bow tied on the bubble */}
          <KawaiiBow
            className="absolute -top-3.5 -left-2.5 w-8 h-8 text-[var(--primary)] -rotate-12 drop-shadow-sm"
            aria-hidden="true"
          />
          {/* Speech-bubble tail — points down to the moogle. The card-colored
              body sits over the bubble's bottom border (hiding the seam); the
              two bordered outer edges form the pointed tip. */}
          <div
            className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-[18px] h-[18px] bg-[var(--card)] border-b-2 border-r-2 border-[color:color-mix(in_srgb,var(--primary)_28%,var(--card))] rotate-45 rounded-br-[6px]"
            aria-hidden="true"
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={quoteIndex < 0 ? "greeting" : quoteIndex}
              className="font-accent text-base sm:text-lg md:text-xl text-[var(--primary)] text-center leading-snug font-bold"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              aria-live="polite"
              aria-atomic="true"
            >
              &ldquo;{displayQuote}&rdquo;
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Scale the moogle visually only — a CSS transform doesn't affect
          the flex layout, so the speech bubble above stays exactly put. */}
      <div className="origin-center scale-105 sm:scale-110 md:scale-[1.15] lg:scale-[1.25] xl:scale-[1.32] lg:mr-10 xl:mr-20">
        <motion.div
          className="relative pointer-events-auto"
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            bounce: 0.5,
            duration: 1.5,
            delay: 0.3,
          }}
        >
          {/* Cute cloud the moogle floats on */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-[2%] w-[116%] pointer-events-none drop-shadow-[0_12px_14px_rgba(0,0,0,0.15)]"
            aria-hidden="true"
          >
            <KawaiiCloud className="w-full text-white" />
          </div>
          <WarmMoogleAura eventId={eventId} />
          <MoogleCharms eventId={eventId} />

          {/* The majestic floating Moogle */}
          <motion.img
            src={welcomingMoogle}
            alt="A magical mogtome moogle"
            className="relative w-60 sm:w-72 md:w-80 lg:w-[22rem] xl:w-[26rem] drop-shadow-2xl z-20 cursor-grab active:cursor-grabbing select-none"
            drag
            dragConstraints={{
              left: -20,
              right: 20,
              top: -15,
              bottom: 15,
            }}
            dragElastic={0.15}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: -5 }}
            onClick={() =>
              setQuoteIndex((prev) => (prev + 1) % kupoQuotes.length)
            }
            loading="eager"
            decoding="async"
            fetchPriority="high"
            animate={{
              y: [-8, 12, -8],
              rotate: [-1.5, 2.5, -1.5],
            }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              rotate: {
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
          <WarmMotes motes={warmMotes} />
        </motion.div>
      </div>
    </div>
  );
}

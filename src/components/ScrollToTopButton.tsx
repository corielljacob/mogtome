import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp } from "lucide-react";
import { APP_SCROLL_ID, scrollAppToTop } from "../utils/scroll";

interface ScrollToTopButtonProps {
  /** Show once the scroll container has scrolled past this many px (default 420). */
  threshold?: number;
}

/**
 * A little candy "back to top" nub that fades in once you've scrolled down a bit.
 * Watches (and scrolls) the app's scroll container, not the window.
 */
export function ScrollToTopButton({ threshold = 420 }: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(APP_SCROLL_ID);
    if (!el) return;
    const onScroll = () => setVisible(el.scrollTop > threshold);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const handleClick = useCallback(() => scrollAppToTop(), []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
          className="gel hover-bounce fixed right-4 md:right-6 bottom-[5.75rem] md:bottom-6 z-40 flex items-center justify-center w-12 h-12 text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none touch-manipulation"
        >
          <ChevronUp className="w-6 h-6" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

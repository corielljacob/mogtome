import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp } from "lucide-react";
import { scrollAppToTop } from "@/shared/lib/scroll";

interface ScrollToTopButtonProps {
  /** Show once the page has scrolled past this many px (default 420). */
  threshold?: number;
}

// watches (and scrolls) the document
export function ScrollToTopButton({ threshold = 420 }: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
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
          className="gel hover-bounce fixed right-4 md:right-6 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] md:bottom-6 z-40 flex items-center justify-center w-12 h-12 text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none touch-manipulation"
        >
          <ChevronUp className="w-6 h-6" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

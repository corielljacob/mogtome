import { useState, useEffect, useCallback } from "react";
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

  // CSS-only fade on an ALWAYS-mounted button - deliberately NOT Framer Motion +
  // AnimatePresence. Mounting/unmounting a motion element right at the scroll
  // threshold (~the page header) made iOS Safari create/destroy a compositor
  // layer mid-scroll, which flashed blank bands at the safe-area edges every time
  // you scrolled through that exact spot. A persistent element that only fades
  // has nothing to mount/unmount, so there's no churn.
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`gel hover-bounce fixed right-4 md:right-6 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] md:bottom-6 z-40 flex items-center justify-center w-12 h-12 text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none touch-manipulation transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-75 pointer-events-none"
      }`}
    >
      <ChevronUp className="w-6 h-6" aria-hidden="true" />
    </button>
  );
}

import {
  memo,
  useEffect,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { X } from "lucide-react";

interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "auto" | "half" | "full";
  showCloseButton?: boolean;
  swipeToDismiss?: boolean;
}

// Native-feeling bottom sheet. CSS slide-up entrance + a plain touch-driven
// swipe-to-dismiss on the grab handle (Framer Motion was removed app-wide - its
// mount/unmount churned the iOS Safari compositor).
export const MobileSheet = memo(function MobileSheet({
  isOpen,
  onClose,
  title,
  children,
  size = "auto",
  showCloseButton = true,
  swipeToDismiss = true,
}: MobileSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // swipe-to-dismiss: follow the finger downward from the handle; close on a
  // long-enough drag, else snap back. The sheet + backdrop fade with the drag.
  const [dragY, setDragY] = useState(0);
  const dragStartY = useRef<number | null>(null);

  const onTouchStart = (e: ReactTouchEvent) => {
    if (!swipeToDismiss) return;
    dragStartY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e: ReactTouchEvent) => {
    if (dragStartY.current === null) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    setDragY(dy > 0 ? dy : 0);
  };
  const onTouchEnd = () => {
    if (dragStartY.current === null) return;
    const shouldClose = dragY > 150;
    dragStartY.current = null;
    setDragY(0);
    if (shouldClose) onClose();
  };

  // lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const originalStyle = document.body.style.cssText;

    document.body.style.cssText = `
      overflow: hidden;
      position: fixed;
      top: -${scrollY}px;
      width: 100%;
    `;

    return () => {
      document.body.style.cssText = originalStyle;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const sizeClasses = {
    auto: "max-h-[90dvh]",
    half: "h-[50dvh]",
    full: "h-[calc(100dvh-2rem)]",
  };

  if (!isOpen) return null;

  // fade the sheet + dim with the drag (matches the old useTransform mapping)
  const dragFade = Math.max(0, 1 - dragY / 300);

  return (
    <>
      {/* z-[60] to sit above the bottom nav (z-50) */}
      <div
        className="fixed inset-x-0 top-0 h-[100dvh] z-[60] bg-black md:hidden"
        style={
          dragY
            ? { opacity: 0.5 * dragFade }
            : { opacity: 0.5, animation: "fadeIn 0.2s ease-out" }
        }
        onClick={onClose}
        aria-hidden="true"
      />

      {/* z-[60] to sit above the bottom nav (z-50) */}
      <div
        ref={sheetRef}
        className="fixed inset-x-0 bottom-0 z-[60] md:hidden"
        style={
          dragY
            ? { transform: `translateY(${dragY}px)`, opacity: dragFade }
            : { animation: "sheetSlideUp 0.34s cubic-bezier(0.22, 1, 0.36, 1)" }
        }
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div
          className={`
              bg-[var(--card)] rounded-t-3xl border-t border-x border-[var(--border)]
              flex flex-col
              ${sizeClasses[size]}
            `}
        >
          {/* drag handle - swipe down here to dismiss */}
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: "none" }}
            className="flex justify-center pt-4 pb-3 flex-shrink-0 cursor-grab active:cursor-grabbing"
          >
            <div className="w-12 h-1.5 rounded-full bg-[var(--text-subtle)]/30" />
          </div>

          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-5 pb-4 border-b border-[var(--border)] flex-shrink-0">
              {title ? (
                <h2 className="font-display font-bold text-xl text-[var(--text)]">
                  {title}
                </h2>
              ) : (
                <div />
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2.5 -mr-2 rounded-full text-[var(--text-muted)] active:bg-[var(--bg)] active:text-[var(--text)] active:scale-90 transition-transform cursor-pointer touch-manipulation"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          )}

          {/* extra bottom padding clears the safe area + where the nav sits */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+5rem)]">
            {children}
          </div>
        </div>
      </div>
    </>
  );
});

export default MobileSheet;

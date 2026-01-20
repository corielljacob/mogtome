import { memo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import type { PanInfo } from 'motion/react';
import { X } from 'lucide-react';

interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Height of the sheet: 'auto' | 'half' | 'full' */
  size?: 'auto' | 'half' | 'full';
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Whether the sheet can be dismissed by swiping down */
  swipeToDismiss?: boolean;
}

/**
 * MobileSheet - A native-feeling bottom sheet for mobile interactions
 * 
 * Features:
 * - Swipe-to-dismiss gesture
 * - Backdrop tap to close
 * - Body scroll lock
 * - Safe area support
 * - Spring animations for natural feel
 * - Only renders on mobile (hidden on md+)
 */
export const MobileSheet = memo(function MobileSheet({
  isOpen,
  onClose,
  title,
  children,
  size = 'auto',
  showCloseButton = true,
  swipeToDismiss = true,
}: MobileSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);
  const backdropOpacity = useTransform(y, [0, 300], [0.5, 0]);
  
  // Lock body scroll when sheet is open
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

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!swipeToDismiss) return;
    
    // Close if velocity is high or dragged past threshold
    if (info.velocity.y > 500 || info.offset.y > 150) {
      onClose();
    }
  };

  const sizeClasses = {
    auto: 'max-h-[90dvh]',
    half: 'h-[50dvh]',
    full: 'h-[calc(100dvh-2rem)]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - z-[60] to be above bottom nav (z-50) */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black md:hidden"
            style={{ opacity: backdropOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Sheet - z-[60] to be above bottom nav (z-50) */}
          <motion.div
            ref={sheetRef}
            className="fixed inset-x-0 bottom-0 z-[60] md:hidden"
            style={{ y, opacity }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag={swipeToDismiss ? 'y' : false}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className={`
              bg-[var(--bento-card)] rounded-t-3xl shadow-2xl 
              flex flex-col
              ${sizeClasses[size]}
            `}>
              {/* Drag handle - larger touch area */}
              <div className="flex justify-center pt-4 pb-3 flex-shrink-0">
                <div className="w-12 h-1.5 rounded-full bg-[var(--bento-text-subtle)]/30" />
              </div>
              
              {/* Header - only if title or close button */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-5 pb-4 border-b border-[var(--bento-border)] flex-shrink-0">
                  {title ? (
                    <h2 className="font-display font-bold text-xl text-[var(--bento-text)]">
                      {title}
                    </h2>
                  ) : (
                    <div />
                  )}
                  {showCloseButton && (
                    <motion.button
                      onClick={onClose}
                      className="p-2.5 -mr-2 rounded-xl text-[var(--bento-text-muted)] active:bg-[var(--bento-bg)] active:text-[var(--bento-text)] cursor-pointer touch-manipulation"
                      whileTap={{ scale: 0.9 }}
                      aria-label="Close"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  )}
                </div>
              )}
              
              {/* Content - extra padding at bottom for safe area + space above where nav would be */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+5rem)]">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

export default MobileSheet;

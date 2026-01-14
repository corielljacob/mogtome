import { type ReactNode, useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
}

// Route hierarchy for determining transition direction
const routeOrder = ['/', '/members', '/chronicle'];

/**
 * PageTransition - Premium native-style page transitions
 * 
 * Features:
 * - Directional awareness (slides left/right based on navigation)
 * - Spring physics for buttery smooth feel
 * - Respects reduced motion preferences
 * - Staggered content reveal for polish
 */
export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const previousPath = useRef(location.pathname);
  
  // Determine transition direction
  const currentIndex = routeOrder.indexOf(location.pathname);
  const previousIndex = routeOrder.indexOf(previousPath.current);
  const direction = currentIndex > previousIndex ? 1 : -1;
  
  useEffect(() => {
    previousPath.current = location.pathname;
  }, [location.pathname]);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, x: direction * 20, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: direction * -10, scale: 0.99 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 35,
        mass: 0.8,
        opacity: { duration: 0.18 },
        scale: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hook to track if header should be collapsed
 * Uses hysteresis to prevent jittering at transition points
 */
function useHeaderCollapse() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lastScrollY = useRef(0);
  const peakScrollY = useRef(0);    // Highest point scrolled while collapsed
  const troughScrollY = useRef(0);  // Lowest point scrolled while expanded
  const ticking = useRef(false);

  useEffect(() => {
    const COLLAPSE_THRESHOLD = 60;  // Scroll down this much to collapse
    const EXPAND_THRESHOLD = 30;    // Scroll up this much to expand
    const TOP_ZONE = 30;            // Always expanded when near top

    const updateCollapse = () => {
      const scrollY = window.scrollY;
      const scrollingDown = scrollY > lastScrollY.current;
      const scrollingUp = scrollY < lastScrollY.current;
      
      // Always expand when near top
      if (scrollY < TOP_ZONE) {
        setIsCollapsed(false);
        troughScrollY.current = scrollY;
        lastScrollY.current = scrollY;
        ticking.current = false;
        return;
      }

      if (!isCollapsed) {
        // Currently expanded
        if (scrollingDown) {
          // Track the lowest point (trough) while expanded
          // If we scroll down past threshold from trough, collapse
          if (scrollY > troughScrollY.current + COLLAPSE_THRESHOLD) {
            setIsCollapsed(true);
            peakScrollY.current = scrollY;
          }
        } else if (scrollingUp) {
          // Update trough to current position when scrolling up
          troughScrollY.current = Math.min(troughScrollY.current, scrollY);
        }
      } else {
        // Currently collapsed
        if (scrollingUp) {
          // Track the highest point (peak) while collapsed
          // If we scroll up past threshold from peak, expand
          if (scrollY < peakScrollY.current - EXPAND_THRESHOLD) {
            setIsCollapsed(false);
            troughScrollY.current = scrollY;
          }
        } else if (scrollingDown) {
          // Update peak to current position when scrolling down
          peakScrollY.current = Math.max(peakScrollY.current, scrollY);
        }
      }
      
      lastScrollY.current = scrollY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateCollapse);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isCollapsed]);

  return isCollapsed;
}

/**
 * MobileHeader - Award-winning collapsible header
 * 
 * Inspired by iOS native apps, Linear, and Arc Browser
 * - Collapses on scroll down, expands on scroll up
 * - Gradient accent line for brand identity
 * - Floating glass pill for actions
 * - Spring physics for buttery smooth animations
 */
export function MobileHeader({ 
  title,
  leftContent,
  rightContent,
  children,
  className = '',
  collapsible = true,
}: { 
  title: string;
  /** Optional left side content (e.g., back button) */
  leftContent?: ReactNode;
  /** Optional right side content (e.g., action buttons) */
  rightContent?: ReactNode;
  /** Additional content below the title bar (e.g., search, filters) */
  children?: ReactNode;
  className?: string;
  /** Whether the header should collapse on scroll (default: true) */
  collapsible?: boolean;
}) {
  const shouldCollapse = useHeaderCollapse();
  
  // Only collapse if collapsible prop is true
  const isCollapsed = collapsible && shouldCollapse;
  
  return (
    <motion.header 
      className={`
        md:hidden sticky top-0 z-40 
        bg-[var(--bento-bg)]/85
        ${className}
      `}
      style={{ 
        paddingTop: 'env(safe-area-inset-top, 0px)',
        WebkitBackdropFilter: 'saturate(180%) blur(16px)',
        backdropFilter: 'saturate(180%) blur(16px)',
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Gradient accent line at top - always visible */}
      <div className="h-[3px] bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)]" />
      
      {/* Compact header - always visible */}
      <motion.div 
        className="px-5"
        style={{ 
          paddingLeft: 'max(1.25rem, env(safe-area-inset-left, 0px))', 
          paddingRight: 'max(1.25rem, env(safe-area-inset-right, 0px))' 
        }}
        initial={false}
        animate={{
          paddingTop: isCollapsed ? 8 : 16,
          paddingBottom: isCollapsed ? 8 : 12,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      >
        {/* Title row with actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {leftContent}
            <motion.h1 
              className="font-display font-bold text-[var(--bento-text)] tracking-[-0.02em] leading-none"
              initial={false}
              animate={{
                fontSize: isCollapsed ? '18px' : '26px',
              }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            >
              {title}
            </motion.h1>
          </div>
          
          {/* Floating action pill - always visible */}
          {rightContent && (
            <motion.div 
              className="flex items-center gap-2 px-1 py-1 rounded-2xl bg-[var(--bento-card)] border border-[var(--bento-border)]/40 shadow-sm"
              initial={false}
              animate={{
                scale: isCollapsed ? 0.9 : 1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {rightContent}
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Collapsible content (search, filters, etc.) */}
      <AnimatePresence initial={false}>
        {children && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 35,
              opacity: { duration: 0.15 }
            }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bottom shadow gradient for depth */}
      <motion.div 
        className="bg-gradient-to-b from-[var(--bento-bg)]/50 to-transparent pointer-events-none"
        initial={false}
        animate={{ height: isCollapsed ? 8 : 16 }}
        transition={{ duration: 0.15 }}
      />
    </motion.header>
  );
}

/**
 * MobilePageHeader - Premium large title header (like iOS Settings)
 * 
 * Features smooth collapse/expand with spring physics
 */
export function MobilePageHeader({ 
  title, 
  subtitle,
  trailing,
  isCollapsed = false 
}: { 
  title: string; 
  subtitle?: string;
  trailing?: ReactNode;
  isCollapsed?: boolean;
}) {
  return (
    <motion.div 
      className="overflow-hidden"
      initial={false}
      animate={{
        opacity: isCollapsed ? 0 : 1,
        height: isCollapsed ? 0 : 'auto',
        marginBottom: isCollapsed ? 0 : 8,
      }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 35,
        opacity: { duration: 0.15 }
      }}
    >
      <div className="flex items-end justify-between gap-3">
        <motion.h1 
          className="text-[2rem] font-display font-bold text-[var(--bento-text)] leading-[1.05] tracking-[-0.02em]"
          initial={false}
          animate={{ 
            scale: isCollapsed ? 0.92 : 1,
            y: isCollapsed ? -8 : 0,
            opacity: isCollapsed ? 0 : 1,
          }}
          transition={{ 
            type: "spring",
            stiffness: 350,
            damping: 30,
          }}
        >
          {title}
        </motion.h1>
        {trailing && (
          <motion.div
            initial={false}
            animate={{ 
              opacity: isCollapsed ? 0 : 1,
              scale: isCollapsed ? 0.9 : 1,
            }}
            transition={{ duration: 0.15 }}
          >
            {trailing}
          </motion.div>
        )}
      </div>
      {subtitle && (
        <motion.p 
          className="text-[15px] text-[var(--bento-text-muted)] font-soft mt-1"
          initial={false}
          animate={{ 
            opacity: isCollapsed ? 0 : 0.8,
            y: isCollapsed ? -4 : 0,
          }}
          transition={{ duration: 0.15, delay: 0.02 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

/**
 * StickyMobileHeader - Sticky header container with native blur effect
 */
export function StickyMobileHeader({ 
  children,
  className = '',
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <div 
      className={`
        sticky z-30 
        bg-[var(--bento-bg)]/95 
        border-b border-[var(--bento-border)]/50
        ${className}
      `}
      style={{ 
        top: 'calc(4.5rem)',
        paddingTop: 'var(--safe-area-inset-top, 0px)',
        // Enable backdrop blur only on capable devices
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        backdropFilter: 'saturate(180%) blur(20px)',
      }}
    >
      {children}
    </div>
  );
}

/**
 * ScrollFadeHeader - Header that fades out title as user scrolls
 * Mimics iOS large title behavior
 */
export function ScrollFadeHeader({
  title,
  subtitle,
  scrollProgress = 0,
  children,
}: {
  title: string;
  subtitle?: string;
  scrollProgress: number; // 0-1, where 0 is top and 1 is fully scrolled
  children?: ReactNode;
}) {
  // Calculate opacity based on scroll progress
  const titleOpacity = Math.max(0, 1 - scrollProgress * 2);
  const titleScale = Math.max(0.9, 1 - scrollProgress * 0.1);
  
  return (
    <div className="px-5 py-4 space-y-3">
      <motion.div
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          transformOrigin: 'left center',
        }}
        className="transition-transform duration-75"
      >
        <h1 className="text-[2rem] font-display font-bold text-[var(--bento-text)] leading-[1.1] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[var(--bento-text-muted)] font-soft mt-0.5">
            {subtitle}
          </p>
        )}
      </motion.div>
      {children}
    </div>
  );
}

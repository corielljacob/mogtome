import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * PageTransition - Wraps page content with native-style transitions
 * 
 * Provides iOS-like slide and fade transitions between pages.
 * Uses spring physics for that native bounce feel.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 30,
        mass: 0.8,
        opacity: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * MobileHeader - Native-style header bar for mobile pages
 * 
 * This replaces the global navbar on mobile. Each page uses this
 * to show its title and any relevant controls (search, filters, etc.)
 * 
 * Features:
 * - Safe area padding for notched devices
 * - Sticky positioning
 * - Subtle border
 */
export function MobileHeader({ 
  title,
  leftContent,
  rightContent,
  children,
  className = '',
}: { 
  title: string;
  /** Optional left side content (e.g., back button) */
  leftContent?: ReactNode;
  /** Optional right side content (e.g., action buttons) */
  rightContent?: ReactNode;
  /** Additional content below the title bar (e.g., search, filters) */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header 
      className={`
        md:hidden sticky top-0 z-40 
        bg-[var(--bento-bg)]
        ${className}
      `}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {/* Title bar */}
      <div 
        className="flex items-center justify-between h-12 px-4 border-b border-[var(--bento-border)]/30"
        style={{ 
          paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))', 
          paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))' 
        }}
      >
        {/* Left side */}
        <div className="flex items-center gap-2 min-w-0">
          {leftContent}
          <h1 className="text-lg font-display font-bold text-[var(--bento-text)] truncate">
            {title}
          </h1>
        </div>
        
        {/* Right side */}
        {rightContent && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {rightContent}
          </div>
        )}
      </div>
      
      {/* Additional content (search, filters, etc.) - only render if children has content */}
      {children}
    </header>
  );
}

/**
 * MobilePageHeader - For pages that want a larger title area (like Home)
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
      className="transition-all duration-200 ease-out"
      animate={{
        opacity: isCollapsed ? 0 : 1,
        height: isCollapsed ? 0 : 'auto',
        marginBottom: isCollapsed ? 0 : 4,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-end justify-between gap-3">
        <motion.h1 
          className="text-[2rem] font-display font-bold text-[var(--bento-text)] leading-[1.1] tracking-tight"
          animate={{ 
            scale: isCollapsed ? 0.95 : 1,
            y: isCollapsed ? -4 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h1>
        {trailing}
      </div>
      {subtitle && (
        <motion.p 
          className="text-sm text-[var(--bento-text-muted)] font-soft mt-0.5"
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.15 }}
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

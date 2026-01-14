import { useRef, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { Home, Users, Scroll, Sparkles } from 'lucide-react';
import { haptics } from '../hooks';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/members', label: 'Family', icon: Users },
  { path: '/chronicle', label: 'Chronicle', icon: Scroll },
];

/**
 * MobileNav - Bottom navigation bar for mobile devices.
 * 
 * Provides a native app-like bottom tab bar with:
 * - Fixed position at bottom with safe area padding
 * - Active state animations with shared layout
 * - Haptic feedback on tap (Android)
 * - Native-style spring animations
 * - Compact but tappable 44px+ touch targets
 */
export function MobileNav() {
  const location = useLocation();
  const lastTap = useRef<string | null>(null);

  // Handle tap with haptic feedback
  const handleTap = useCallback((path: string, isCurrentlyActive: boolean) => {
    // Only trigger haptic if navigating to a new tab
    if (!isCurrentlyActive && lastTap.current !== path) {
      haptics.selection();
    }
    lastTap.current = path;
  }, []);

  return (
    <nav 
      className="
        md:hidden fixed bottom-0 left-0 right-0 z-50
        bg-[var(--bento-card)]/98
        border-t border-[var(--bento-primary)]/10
        shadow-[0_-2px_24px_rgba(0,0,0,0.08)]
      "
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        // Enable GPU acceleration for smoother animations
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Subtle frosted glass effect line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--bento-primary)]/15 to-transparent" />
      
      <div className="flex items-stretch justify-around px-1 py-1.5">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          
          return (
            <NavLink
              key={path}
              to={path}
              className="flex-1 max-w-[5.5rem]"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => handleTap(path, isActive)}
            >
              {({ isActive: linkActive }) => (
                <NavItem 
                  label={label}
                  Icon={Icon}
                  isActive={linkActive}
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * NavItem - Individual nav item with iOS-style press animation
 */
function NavItem({ 
  label, 
  Icon, 
  isActive 
}: { 
  label: string; 
  Icon: typeof Home; 
  isActive: boolean;
}) {
  // Motion values for press animation
  const scale = useMotionValue(1);
  const iconY = useMotionValue(0);
  
  // Transform scale to background opacity for active state emphasis
  const bgOpacity = useTransform(scale, [0.92, 1], [0.15, isActive ? 0.1 : 0]);

  const handleTapStart = useCallback(() => {
    // Quick, snappy scale down
    animate(scale, 0.92, { duration: 0.1, ease: "easeOut" });
    if (!isActive) {
      animate(iconY, 1, { duration: 0.1, ease: "easeOut" });
    }
  }, [scale, iconY, isActive]);

  const handleTapEnd = useCallback(() => {
    // Bouncy spring back
    animate(scale, 1, { 
      type: "spring", 
      stiffness: 500, 
      damping: 25,
      mass: 0.8
    });
    animate(iconY, 0, { 
      type: "spring", 
      stiffness: 400, 
      damping: 20 
    });
  }, [scale, iconY]);

  return (
    <motion.div
      className={`
        relative flex flex-col items-center justify-center
        py-2 px-2 rounded-2xl
        ${isActive 
          ? 'text-[var(--bento-primary)]' 
          : 'text-[var(--bento-text-muted)]'
        }
      `}
      style={{ scale }}
      onTapStart={handleTapStart}
      onTap={handleTapEnd}
      onTapCancel={handleTapEnd}
    >
      {/* Active indicator background with animated opacity */}
      <motion.div
        className="absolute inset-0 bg-[var(--bento-primary)] rounded-2xl"
        style={{ opacity: bgOpacity }}
      />
      
      {/* Shared layout indicator pill for active state */}
      {isActive && (
        <motion.div
          className="absolute inset-x-2 top-0 h-[3px] bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-primary)] rounded-full"
          layoutId="mobile-nav-indicator"
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 35,
            mass: 0.8
          }}
        />
      )}
      
      {/* Icon container */}
      <motion.div
        className="relative z-10 mb-1"
        style={{ y: iconY }}
        animate={isActive ? { y: -1 } : { y: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Icon 
          className={`w-[22px] h-[22px] transition-all duration-100 ${
            isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'
          }`} 
        />
        
        {/* Sparkle decoration on active - subtle and elegant */}
        {isActive && (
          <motion.div
            className="absolute -top-1 -right-1.5"
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 600, 
              damping: 20,
              delay: 0.1
            }}
          >
            <Sparkles className="w-2.5 h-2.5 text-[var(--bento-secondary)]" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Label with improved typography */}
      <span
        className={`relative z-10 text-[11px] font-soft font-semibold leading-none tracking-tight ${
          isActive ? 'text-[var(--bento-primary)]' : 'text-[var(--bento-text-subtle)]'
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}

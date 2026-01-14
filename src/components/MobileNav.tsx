import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Users, Scroll, Sparkles } from 'lucide-react';

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
 * - Active state animations
 * - Haptic-like visual feedback on tap
 * - Compact but tappable 44px+ touch targets
 */
export function MobileNav() {
  const location = useLocation();

  return (
    <nav 
      className="
        md:hidden fixed bottom-0 left-0 right-0 z-50
        bg-[var(--bento-card)]/95 backdrop-blur-xl
        border-t border-[var(--bento-primary)]/10
        shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
      "
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--bento-primary)]/20 to-transparent" />
      
      <div className="flex items-stretch justify-around px-2 py-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          
          return (
            <NavLink
              key={path}
              to={path}
              className="flex-1 max-w-24"
              aria-current={isActive ? 'page' : undefined}
            >
              {({ isActive: linkActive }) => (
                <motion.div
                  className={`
                    relative flex flex-col items-center justify-center
                    py-2 px-1 rounded-xl
                    transition-colors duration-150
                    ${linkActive 
                      ? 'text-[var(--bento-primary)]' 
                      : 'text-[var(--bento-text-muted)]'
                    }
                  `}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {/* Active indicator background */}
                  {linkActive && (
                    <motion.div
                      className="absolute inset-0 bg-[var(--bento-primary)]/10 rounded-xl"
                      layoutId="mobile-nav-active"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  {/* Icon container */}
                  <motion.div
                    className="relative z-10 mb-0.5"
                    animate={linkActive ? { y: -2 } : { y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Icon 
                      className={`w-6 h-6 transition-all duration-150 ${
                        linkActive ? 'stroke-[2.5px]' : 'stroke-[2px]'
                      }`} 
                    />
                    
                    {/* Sparkle decoration on active */}
                    {linkActive && (
                      <motion.div
                        className="absolute -top-1 -right-1"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      >
                        <Sparkles className="w-2.5 h-2.5 text-[var(--bento-secondary)]" />
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {/* Label */}
                  <motion.span
                    className={`relative z-10 text-[10px] font-soft font-semibold leading-none ${
                      linkActive ? 'text-[var(--bento-primary)]' : 'text-[var(--bento-text-subtle)]'
                    }`}
                    animate={linkActive ? { 
                      opacity: 1,
                      y: 0 
                    } : { 
                      opacity: 0.8,
                      y: 0 
                    }}
                  >
                    {label}
                  </motion.span>
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

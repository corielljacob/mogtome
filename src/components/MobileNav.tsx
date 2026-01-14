import { useCallback, useRef, useState, useLayoutEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Users, Scroll } from 'lucide-react';
import { haptics } from '../hooks';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/members', label: 'Family', icon: Users },
  { path: '/chronicle', label: 'Chronicle', icon: Scroll },
];

/**
 * MobileNav - Premium bottom tab bar with floating pill indicator
 * 
 * Features:
 * - Smooth sliding pill that follows active tab
 * - Proper proportions - wider, shorter pill
 * - Spring physics for natural feel
 * - Premium glass background
 */
export function MobileNav() {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  
  // Calculate pill position based on active tab
  useLayoutEffect(() => {
    if (!navRef.current) return;
    
    const activeIndex = navItems.findIndex(item => item.path === location.pathname);
    if (activeIndex === -1) return;
    
    const navLinks = navRef.current.querySelectorAll('a');
    const activeLink = navLinks[activeIndex] as HTMLElement;
    
    if (activeLink) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      
      setPillStyle({
        left: linkRect.left - navRect.left + 8,
        width: linkRect.width - 16,
      });
    }
  }, [location.pathname]);

  const handleTap = useCallback((isCurrentlyActive: boolean) => {
    if (!isCurrentlyActive) {
      haptics.selection();
    }
  }, []);

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Glass background */}
      <div 
        className="bg-[var(--bento-card)]/85 border-t border-[var(--bento-border)]/30"
        style={{
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          backdropFilter: 'saturate(180%) blur(20px)',
        }}
      >
        <div ref={navRef} className="relative flex items-center h-[52px]">
          {/* Sliding pill indicator */}
          <motion.div
            className="absolute top-[6px] h-[40px] rounded-2xl bg-[var(--bento-primary)]/[0.08]"
            initial={false}
            animate={{
              left: pillStyle.left,
              width: pillStyle.width,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />
          
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            
            return (
              <NavLink
                key={path}
                to={path}
                className="relative flex-1 flex flex-col items-center justify-center h-full z-10"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleTap(isActive)}
              >
                {/* Icon */}
                <motion.div
                  initial={false}
                  whileTap={{ scale: 0.85 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                  }}
                >
                  <Icon 
                    className={`w-[23px] h-[23px] transition-colors duration-150 ${
                      isActive 
                        ? 'text-[var(--bento-primary)]' 
                        : 'text-[var(--bento-text-muted)]'
                    }`}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                </motion.div>
                
                {/* Label */}
                <span
                  className={`text-[10px] font-semibold mt-1 transition-colors duration-150 ${
                    isActive 
                      ? 'text-[var(--bento-primary)]' 
                      : 'text-[var(--bento-text-muted)]'
                  }`}
                >
                  {label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

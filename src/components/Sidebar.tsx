import { useState, useEffect, memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Home, Users, Scroll, Info, Crown, Settings,
  ChevronLeft, ChevronRight, UserCircle, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LogoIcon } from './LogoIcon';

// Sidebar width constants - adjusted for floating design with margin
const SIDEBAR_WIDTH_EXPANDED = 232;
const SIDEBAR_WIDTH_COLLAPSED = 84;

// Nav items configuration
const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/members', label: 'Family', icon: Users },
  { path: '/chronicle', label: 'Chronicle', icon: Scroll },
  { path: '/about', label: 'About', icon: Info },
];

interface NavItemProps {
  path: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  isCollapsed: boolean;
  accentColor?: string;
}

// PERFORMANCE: Memoized to prevent re-renders when sidebar state changes
const NavItem = memo(function NavItem({ path, label, icon: Icon, isActive, isCollapsed, accentColor }: NavItemProps) {
  return (
    <Link
      to={path}
      aria-current={isActive ? 'page' : undefined}
      className={`
        group relative flex items-center py-2.5 rounded-lg
        font-soft text-sm font-semibold
        transition-[transform,background-color,color,border-color,box-shadow] duration-150
        focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
        ${isActive
          ? `surface ${accentColor || 'text-[var(--primary)]'} border-[color:color-mix(in_srgb,var(--primary)_18%,var(--border))]`
          : 'text-[var(--text-muted)] border border-transparent hover:text-[var(--text)] hover:bg-[var(--bg)] hover:border-[var(--border)]'
        }
        ${isCollapsed ? 'justify-center px-1 gap-0' : 'px-3 gap-3'}
      `}
    >
      <motion.span
        className={`icon-badge ${isCollapsed ? 'w-10 h-10' : 'w-9 h-9'} shrink-0 ${isActive ? accentColor || 'text-[var(--primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--primary)]'}
          transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
        style={{ transform: isActive ? 'scale(1.05)' : 'scale(1)' }}
      >
        <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? '' : 'group-hover:scale-110'} transition-transform`} />
      </motion.span>
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Tooltip when collapsed */}
      {isCollapsed && (
        <div className="
          absolute left-full ml-3 px-3 py-1.5 
          bg-[var(--card)]
          border border-[var(--border)]
          rounded-lg shadow-[var(--panel-shadow)]
          text-sm text-[var(--text)] whitespace-nowrap
          opacity-0 group-hover:opacity-100 pointer-events-none
          transition-opacity z-50
        ">
          {label}
        </div>
      )}
    </Link>
  );
});

// PERFORMANCE: Memoized to prevent re-renders
const ProfileItem = memo(function ProfileItem({ isCollapsed }: { isCollapsed: boolean }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) return null;
  
  const isActive = location.pathname === '/profile';
  
  return (
    <NavItem
      path="/profile"
      label="My Profile"
      icon={UserCircle}
      isActive={isActive}
      isCollapsed={isCollapsed}
      accentColor="text-[var(--secondary)]"
    />
  );
});

// PERFORMANCE: Memoized to prevent re-renders
const KnightDashboardItem = memo(function KnightDashboardItem({ isCollapsed }: { isCollapsed: boolean }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  const hasKnighthood = user?.hasKnighthood || user?.hasTemporaryKnighthood;
  
  if (!isAuthenticated || !hasKnighthood) return null;
  
  const isActive = location.pathname === '/dashboard';
  
  return (
    <NavItem
      path="/dashboard"
      label="Dashboard"
      icon={Crown}
      isActive={isActive}
      isCollapsed={isCollapsed}
      accentColor="text-amber-500"
    />
  );
});

// Theme toggle component with animated sun/moon
// PERFORMANCE: Memoized to prevent re-renders
const ThemeToggle = memo(function ThemeToggle({ isCollapsed }: { isCollapsed: boolean }) {
  const { isDarkMode, setColorMode } = useTheme();
  
  const toggleTheme = () => {
    setColorMode(isDarkMode ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        group relative flex items-center py-2.5 rounded-xl
        text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg)]
        border border-transparent hover:border-[var(--border)]
        font-soft text-sm font-semibold
        transition-[transform,background-color,color,border-color] duration-200 cursor-pointer
        active:scale-[0.97]
        focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
        ${isCollapsed ? 'justify-center w-full px-1 gap-0' : 'w-full px-3 gap-3'}
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Icon */}
      <span
        className={`icon-badge ${isCollapsed ? 'w-10 h-10' : 'w-9 h-9'} flex-shrink-0 relative`}
      >
        {/* Sun icon */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{
            transform: isDarkMode ? 'rotate(90deg) scale(0)' : 'rotate(0deg) scale(1)',
            opacity: isDarkMode ? 0 : 1,
          }}
        >
          <Sun className="w-5 h-5" strokeWidth={1.75} />
        </div>
        
        {/* Moon icon */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{
            transform: isDarkMode ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0)',
            opacity: isDarkMode ? 1 : 0,
          }}
        >
          <Moon className="w-5 h-5" strokeWidth={1.75} />
        </div>
      </span>

      {/* Label */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="whitespace-nowrap overflow-hidden"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Tooltip when collapsed */}
      {isCollapsed && (
        <div className="
          absolute left-full ml-3 px-3 py-1.5 
          bg-[var(--card)]
          border border-[var(--border)]
          rounded-lg shadow-[var(--panel-shadow)]
          text-sm text-[var(--text)] whitespace-nowrap
          opacity-0 group-hover:opacity-100 pointer-events-none
          transition-opacity z-50
        ">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </div>
      )}
    </button>
  );
});

export function Sidebar() {
  const location = useLocation();
  // Sidebar state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Persist collapse state
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [logoHovered, setLogoHovered] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Memoize callbacks to prevent unnecessary re-renders
  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);
  const toggleCollapsed = useCallback(() => setIsCollapsed((prev: boolean) => !prev), []);
  const handleLogoMouseEnter = useCallback(() => setLogoHovered(true), []);
  const handleLogoMouseLeave = useCallback(() => setLogoHovered(false), []);
  
  const sidebarWidth = isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  return (
    <>
      {/* Sidebar - in document flow so it naturally respects the flex container height */}
      <aside
        className="group/sidebar hidden md:flex flex-shrink-0 ml-3 mr-3 my-4 z-40 flex-col surface rounded-2xl border-[var(--border)] overflow-hidden transition-[width] duration-200 ease-in-out"
        style={{ width: sidebarWidth - 24 }}
        aria-label="Main navigation"
      >
        {/* Spotlight overlay - removed for cozy indie feel */}

          {/* Logo section */}
          <div className={`relative z-10 h-[72px] flex items-center justify-center ${isCollapsed ? 'px-0' : 'px-3'} overflow-hidden transition-all duration-200`}>
            <Link 
              to="/" 
              className={`flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none rounded-xl p-1.5 ${isCollapsed ? 'w-full justify-center' : ''}`}
              aria-label="MogTome - Go to home page"
              onMouseEnter={handleLogoMouseEnter}
              onMouseLeave={handleLogoMouseLeave}
            >
            <LogoIcon hovered={logoHovered} />
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col justify-center overflow-hidden"
                  aria-hidden="true"
                >
                  {/* Main logo text */}
                  <div className="flex items-baseline gap-0.5">
                    <span 
                      className="font-display font-bold text-lg leading-tight transition-colors duration-200"
                      style={{ color: logoHovered ? 'var(--primary)' : 'var(--text)' }}
                    >
                      Mog
                    </span>
                    <span className="font-display font-bold text-lg leading-tight text-highlight">
                      Tome
                    </span>
                  </div>
                  
                  {/* Subtitle */}
                  <span className="eyebrow-script text-sm text-[var(--secondary)] whitespace-nowrap">
                    Kupo Life!~
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Decorative divider */}
        <div className="mx-3 divider" />

        {/* Navigation section */}
        <nav className={`relative z-10 flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden transition-[padding] duration-200 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {/* Main nav items */}
          <div className="space-y-1">
            {navItems.map(({ path, label, icon }) => (
              <NavItem
                key={path}
                path={path}
                label={label}
                icon={icon}
                isActive={isActive(path)}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>

          {/* Profile & Dashboard (conditional based on auth) */}
          <div className="pt-3 mt-3 space-y-1">
            <div className="mx-0 mb-2 divider" />
            <ProfileItem isCollapsed={isCollapsed} />
            <KnightDashboardItem isCollapsed={isCollapsed} />
          </div>
        </nav>

        {/* Bottom section - Theme Toggle + Settings + Collapse toggle */}
        <div className={`relative z-10 py-3 space-y-1.5 overflow-hidden transition-[padding] duration-200 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {/* Decorative divider */}
          <div className="mx-0 mb-2 divider" />
          
          {/* Theme Toggle */}
          <ThemeToggle isCollapsed={isCollapsed} />
          
          {/* Settings */}
          <NavItem
            path="/settings"
            label="Settings"
            icon={Settings}
            isActive={isActive('/settings')}
            isCollapsed={isCollapsed}
          />

          {/* Collapse toggle button */}
          <button
            onClick={toggleCollapsed}
            className={`
              w-full flex items-center py-2.5 rounded-xl
              text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg)]
              border border-transparent hover:border-[var(--border)]
              font-soft text-sm font-semibold
              transition-[transform,background-color,color,border-color] duration-200 cursor-pointer
              active:scale-[0.97]
              focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
              ${isCollapsed ? 'justify-center px-1 gap-0' : 'px-3 gap-3'}
            `}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
          >
            <div>
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

      </aside>
    </>
  );
}

// Export constants for use in other components
export { SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED };

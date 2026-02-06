import { useState, useEffect, memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Users, Scroll, Info, Crown, Settings,
  ChevronLeft, ChevronRight, UserCircle, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import lilGuyMoogle from '../assets/moogles/lil guy moogle.webp';

// Sidebar width constants - adjusted for floating design with margin
const SIDEBAR_WIDTH_EXPANDED = 232;
const SIDEBAR_WIDTH_COLLAPSED = 84;

// Floating pom-pom with Framer Motion
// PERFORMANCE: Memoized to prevent re-renders
const FloatingPom = memo(function FloatingPom({ isHovered }: { isHovered: boolean }) {
  return (
    <motion.div 
      className="absolute -top-2 -right-2 z-10"
      initial={{ y: -20, scale: 0.5, opacity: 0 }}
      animate={{ 
        y: isHovered ? -3 : 0, 
        scale: isHovered ? 1.15 : 1, 
        rotate: isHovered ? 10 : 0,
        opacity: 1 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 15,
        delay: 0.2
      }}
    >
      <div className="relative">
        {/* Pom glow */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-[var(--bento-primary)]/40 blur-sm"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Main pom */}
        <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-primary)] border-2 border-[var(--bento-card)] shadow-lg shadow-[var(--bento-primary)]/30">
          <div className="absolute top-0.5 left-1 w-2 h-1.5 rounded-full bg-white/40" />
        </div>
        {/* Tiny antenna line */}
        <div className="absolute -bottom-1 left-1/2 w-px h-2 bg-gradient-to-b from-[var(--bento-text-subtle)] to-transparent -translate-x-1/2" />
      </div>
    </motion.div>
  );
});

// Logo icon with hover effects
// PERFORMANCE: Memoized to prevent re-renders
const LogoIcon = memo(function LogoIcon({ hovered = false }: { hovered?: boolean }) {
  return (
    <div className="relative flex-shrink-0">
      {/* Soft glow behind on hover */}
      <motion.div 
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--bento-primary)]/30 to-[var(--bento-secondary)]/30 blur-xl"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Main icon container */}
      <motion.div 
        className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[var(--bento-primary)] to-[var(--bento-secondary)] flex items-center justify-center shadow-lg shadow-[var(--bento-primary)]/25"
        animate={{ 
          scale: hovered ? 1.1 : 1,
          rotate: hovered ? -3 : 0
        }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Inner white container */}
        <div className="w-9 h-9 rounded-xl bg-[var(--bento-card)] flex items-center justify-center overflow-hidden">
          <motion.img 
            src={lilGuyMoogle} 
            alt="MogTome" 
            className="w-8 h-8 object-contain"
            animate={{ 
              scale: hovered ? 1.1 : 1,
              y: hovered ? -2 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          />
        </div>
      </motion.div>
      
      {/* Floating pom-pom */}
      <FloatingPom isHovered={hovered} />
    </div>
  );
});

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
        group relative flex items-center py-2.5 rounded-xl
        font-soft text-sm font-medium
        transition-all duration-200
        focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
        ${isActive
          ? `bg-gradient-to-r from-[var(--bento-primary)]/20 to-[var(--bento-primary)]/10 ${accentColor || 'text-[var(--bento-primary)]'} shadow-sm`
          : 'text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] hover:bg-[var(--bento-bg)]/60'
        }
        ${isCollapsed ? 'justify-center px-1 gap-0' : 'px-3 gap-3'}
      `}
    >
      <motion.div
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? '' : 'group-hover:scale-110'} transition-transform`} />
      </motion.div>
      
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
          bg-[var(--bento-card)]/95 backdrop-blur-sm 
          border border-[var(--bento-primary)]/10
          rounded-xl shadow-lg shadow-[var(--bento-primary)]/5
          text-sm text-[var(--bento-text)] whitespace-nowrap
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
      accentColor="text-[var(--bento-secondary)]"
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
    <motion.button
      onClick={toggleTheme}
      className={`
        group relative flex items-center py-2.5 rounded-xl
        text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] hover:bg-[var(--bento-bg)]/60
        font-soft text-sm font-medium
        transition-all duration-200 cursor-pointer
        focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
        ${isCollapsed ? 'justify-center w-full px-1 gap-0' : 'w-full px-3 gap-3'}
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      whileTap={{ scale: 0.97 }}
    >
      {/* Icon */}
      <motion.div
        className="w-5 h-5 flex-shrink-0 relative"
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Sun icon */}
        <motion.div
          initial={false}
          animate={{ 
            rotate: isDarkMode ? 90 : 0,
            scale: isDarkMode ? 0 : 1,
            opacity: isDarkMode ? 0 : 1
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="w-5 h-5" strokeWidth={1.75} />
        </motion.div>
        
        {/* Moon icon */}
        <motion.div
          initial={false}
          animate={{ 
            rotate: isDarkMode ? 0 : -90,
            scale: isDarkMode ? 1 : 0,
            opacity: isDarkMode ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon className="w-5 h-5" strokeWidth={1.75} />
        </motion.div>
      </motion.div>

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
          bg-[var(--bento-card)]/95 backdrop-blur-sm 
          border border-[var(--bento-primary)]/10
          rounded-xl shadow-lg shadow-[var(--bento-primary)]/5
          text-sm text-[var(--bento-text)] whitespace-nowrap
          opacity-0 group-hover:opacity-100 pointer-events-none
          transition-opacity z-50
        ">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </div>
      )}
    </motion.button>
  );
});

export function Sidebar() {
  const location = useLocation();
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
      {/* Sidebar - floating pill design matching site aesthetic */}
      <motion.aside
        className="hidden md:flex fixed left-3 top-3 bottom-3 z-40 flex-col 
          bg-[var(--bento-card)]/80 backdrop-blur-xl 
          border border-[var(--bento-primary)]/10 
          rounded-2xl shadow-lg shadow-[var(--bento-primary)]/10"
        initial={false}
        animate={{ width: sidebarWidth - 24 }} // Account for margins
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        aria-label="Main navigation"
      >
          {/* Logo section */}
          <div className={`h-[72px] flex items-center justify-center ${isCollapsed ? 'px-0' : 'px-3'} overflow-hidden transition-all duration-200`}>
            <Link 
              to="/" 
              className={`flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none rounded-xl p-1.5 ${isCollapsed ? 'w-full justify-center' : ''}`}
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
                    <motion.span 
                      className="font-display font-bold text-lg leading-tight text-[var(--bento-text)]"
                      animate={{ color: logoHovered ? 'var(--bento-primary)' : 'var(--bento-text)' }}
                      transition={{ duration: 0.2 }}
                    >
                      Mog
                    </motion.span>
                    <span className="font-display font-bold text-lg leading-tight bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent">
                      Tome
                    </span>
                  </div>
                  
                  {/* Subtitle */}
                  <span className="font-accent text-xs text-[var(--bento-secondary)] whitespace-nowrap">
                    Kupo Life!~
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Decorative divider */}
        <div className="mx-3 h-px bg-gradient-to-r from-transparent via-[var(--bento-primary)]/20 to-transparent" />

        {/* Navigation section */}
        <nav className={`flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden transition-[padding] duration-200 ${isCollapsed ? 'px-2' : 'px-3'}`}>
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
            <div className="mx-0 mb-2 h-px bg-gradient-to-r from-transparent via-[var(--bento-primary)]/15 to-transparent" />
            <ProfileItem isCollapsed={isCollapsed} />
            <KnightDashboardItem isCollapsed={isCollapsed} />
          </div>
        </nav>

        {/* Bottom section - Theme Toggle + Settings + Collapse toggle */}
        <div className={`py-3 space-y-1.5 overflow-hidden transition-[padding] duration-200 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {/* Decorative divider */}
          <div className="mx-0 mb-2 h-px bg-gradient-to-r from-transparent via-[var(--bento-primary)]/20 to-transparent" />
          
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
          <motion.button
            onClick={toggleCollapsed}
            className={`
              w-full flex items-center py-2.5 rounded-xl
              text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] hover:bg-[var(--bento-bg)]/60
              font-soft text-sm font-medium
              transition-all duration-200 cursor-pointer
              focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
              ${isCollapsed ? 'justify-center px-1 gap-0' : 'px-3 gap-3'}
            `}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </motion.div>
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
          </motion.button>
        </div>

      </motion.aside>

      {/* Spacer to push content - this prevents content from going under the sidebar */}
      <motion.div
        className="hidden md:block flex-shrink-0"
        initial={false}
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        aria-hidden="true"
      />
    </>
  );
}

// Export constants for use in other components
export { SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED };

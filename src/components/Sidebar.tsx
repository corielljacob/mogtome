import { useState, useEffect, memo, useCallback, type CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Home, Users, Scroll, Info, Crown, Settings,
  ChevronLeft, ChevronRight, UserCircle, Sun, Moon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LogoIcon } from './LogoIcon';
import { KawaiiStar } from './kawaiiMotifs';

// Sidebar width constants - adjusted for floating design with margin
const SIDEBAR_WIDTH_EXPANDED = 232;
const SIDEBAR_WIDTH_COLLAPSED = 84;

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/members', label: 'Family', icon: Users },
  { path: '/chronicle', label: 'Chronicle', icon: Scroll },
  { path: '/about', label: 'About', icon: Info },
];

// Shared label fade for the collapse animation
function CollapsibleLabel({ collapsed, children }: { collapsed: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.15 }}
          className="whitespace-nowrap overflow-hidden"
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// Cute collapsed-only tooltip (puffy sticker)
function CollapsedTip({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <div className="absolute left-full ml-3 px-3 py-1.5 surface rounded-xl text-sm font-display font-bold text-[var(--text)] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
      {children}
    </div>
  );
}

interface NavItemProps {
  path: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  isCollapsed: boolean;
  /** CSS color used for the candy pill / icon tint (default theme primary). */
  accent?: string;
}

// PERFORMANCE: Memoized to prevent re-renders when sidebar state changes
const NavItem = memo(function NavItem({ path, label, icon: Icon, isActive, isCollapsed, accent = 'var(--primary)' }: NavItemProps) {
  return (
    <Link
      to={path}
      aria-current={isActive ? 'page' : undefined}
      className={`
        group relative flex items-center py-2 rounded-full hover-bounce
        font-display font-bold text-sm
        transition-[background-color,color] duration-150
        focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] focus-visible:outline-none
        ${isActive
          ? 'gel'
          : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[color:color-mix(in_srgb,var(--primary)_9%,transparent)]'
        }
        ${isCollapsed ? 'justify-center px-1 gap-0' : 'px-2 gap-2.5'}
      `}
      style={isActive ? ({ '--gel-color': accent } as CSSProperties) : undefined}
    >
      {/* Icon in a round candy badge */}
      <span
        className={`shrink-0 flex items-center justify-center rounded-full transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isCollapsed ? 'w-10 h-10' : 'w-9 h-9'} ${isActive ? 'bg-white/25 text-white' : 'group-hover:-rotate-6 group-hover:scale-110'}`}
        style={!isActive ? ({ color: accent, background: `color-mix(in srgb, ${accent} 14%, var(--card))` } as CSSProperties) : undefined}
      >
        <Icon className="w-[18px] h-[18px]" />
      </span>

      <CollapsibleLabel collapsed={isCollapsed}>{label}</CollapsibleLabel>

      {/* Active sticker star */}
      {isActive && !isCollapsed && (
        <KawaiiStar className="ml-auto shrink-0 w-4 h-4 text-white/90 animate-pop-in" />
      )}

      <CollapsedTip show={isCollapsed}>{label}</CollapsedTip>
    </Link>
  );
});

const ProfileItem = memo(function ProfileItem({ isCollapsed }: { isCollapsed: boolean }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return null;
  return (
    <NavItem
      path="/profile"
      label="My Profile"
      icon={UserCircle}
      isActive={location.pathname === '/profile'}
      isCollapsed={isCollapsed}
      accent="var(--secondary)"
    />
  );
});

const KnightDashboardItem = memo(function KnightDashboardItem({ isCollapsed }: { isCollapsed: boolean }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const hasKnighthood = user?.hasKnighthood || user?.hasTemporaryKnighthood;
  if (!isAuthenticated || !hasKnighthood) return null;
  return (
    <NavItem
      path="/dashboard"
      label="Dashboard"
      icon={Crown}
      isActive={location.pathname === '/dashboard'}
      isCollapsed={isCollapsed}
      accent="#eaa53a"
    />
  );
});

// Ghost row — shared style for the non-routed controls (theme, collapse)
const GHOST_ROW =
  'group relative flex items-center py-2 rounded-full w-full hover-bounce ' +
  'font-display font-bold text-sm text-[var(--text-muted)] ' +
  'hover:text-[var(--text)] hover:bg-[color:color-mix(in_srgb,var(--primary)_9%,transparent)] ' +
  'transition-[background-color,color] duration-150 cursor-pointer ' +
  'focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] focus-visible:outline-none';

const ThemeToggle = memo(function ThemeToggle({ isCollapsed }: { isCollapsed: boolean }) {
  const { isDarkMode, setColorMode } = useTheme();
  const toggleTheme = () => setColorMode(isDarkMode ? 'light' : 'dark');

  return (
    <button
      onClick={toggleTheme}
      className={`${GHOST_ROW} ${isCollapsed ? 'justify-center px-1 gap-0' : 'px-2 gap-2.5'}`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className={`relative shrink-0 flex items-center justify-center rounded-full ${isCollapsed ? 'w-10 h-10' : 'w-9 h-9'}`}
        style={{ color: 'var(--accent)', background: 'color-mix(in srgb, var(--accent) 14%, var(--card))' }}
      >
        <Sun
          className="absolute w-[18px] h-[18px] transition-all duration-300"
          style={{ transform: isDarkMode ? 'rotate(90deg) scale(0)' : 'rotate(0deg) scale(1)', opacity: isDarkMode ? 0 : 1 }}
        />
        <Moon
          className="absolute w-[18px] h-[18px] transition-all duration-300"
          style={{ transform: isDarkMode ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0)', opacity: isDarkMode ? 1 : 0 }}
        />
      </span>
      <CollapsibleLabel collapsed={isCollapsed}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</CollapsibleLabel>
      <CollapsedTip show={isCollapsed}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</CollapsedTip>
    </button>
  );
});

// Cute dashed candy divider
function Divider({ className = '' }: { className?: string }) {
  return (
    <div
      className={`border-t-2 border-dashed border-[color:color-mix(in_srgb,var(--primary)_18%,transparent)] ${className}`}
      aria-hidden="true"
    />
  );
}

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [logoHovered, setLogoHovered] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);
  const toggleCollapsed = useCallback(() => setIsCollapsed((prev: boolean) => !prev), []);
  const handleLogoMouseEnter = useCallback(() => setLogoHovered(true), []);
  const handleLogoMouseLeave = useCallback(() => setLogoHovered(false), []);

  const sidebarWidth = isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  return (
    <aside
      className="group/sidebar hidden md:flex flex-shrink-0 ml-3 mr-3 my-4 z-40 flex-col surface rounded-2xl overflow-hidden transition-[width] duration-200 ease-in-out"
      style={{ width: sidebarWidth - 24 }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className={`h-[72px] flex items-center justify-center ${isCollapsed ? 'px-0' : 'px-3'} overflow-hidden transition-all duration-200`}>
        <Link
          to="/"
          className={`flex items-center gap-2.5 rounded-2xl p-1.5 hover-bounce focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none ${isCollapsed ? 'w-full justify-center' : ''}`}
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
                <div className="flex items-baseline gap-0.5">
                  <span
                    className="font-display font-bold text-lg leading-tight transition-colors duration-200"
                    style={{ color: logoHovered ? 'var(--primary)' : 'var(--text)' }}
                  >
                    Mog
                  </span>
                  <span className="font-display font-bold text-lg leading-tight text-highlight">Tome</span>
                </div>
                <span className="eyebrow-script text-sm text-[var(--secondary)] whitespace-nowrap flex items-center gap-1">
                  Kupo Life!~
                  <KawaiiStar className="w-3 h-3 text-[var(--accent)]" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <Divider className="mx-3" />

      {/* Navigation */}
      <nav className={`flex-1 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden transition-[padding] duration-200 ${isCollapsed ? 'px-2' : 'px-2.5'}`}>
        <div className="space-y-1.5">
          {navItems.map(({ path, label, icon }) => (
            <NavItem key={path} path={path} label={label} icon={icon} isActive={isActive(path)} isCollapsed={isCollapsed} />
          ))}
        </div>

        <div className="pt-3 mt-3 space-y-1.5">
          <Divider className="mb-3" />
          <ProfileItem isCollapsed={isCollapsed} />
          <KnightDashboardItem isCollapsed={isCollapsed} />
        </div>
      </nav>

      {/* Bottom controls */}
      <div className={`py-3 space-y-1.5 overflow-hidden transition-[padding] duration-200 ${isCollapsed ? 'px-2' : 'px-2.5'}`}>
        <Divider className="mb-3" />

        <ThemeToggle isCollapsed={isCollapsed} />

        <NavItem
          path="/settings"
          label="Settings"
          icon={Settings}
          isActive={isActive('/settings')}
          isCollapsed={isCollapsed}
        />

        {/* Collapse toggle */}
        <button
          onClick={toggleCollapsed}
          className={`${GHOST_ROW} ${isCollapsed ? 'justify-center px-1 gap-0' : 'px-2 gap-2.5'}`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
        >
          <span
            className="shrink-0 flex items-center justify-center rounded-full w-9 h-9 group-hover:-rotate-6 transition-transform"
            style={{ color: 'var(--text-muted)', background: 'color-mix(in srgb, var(--text-muted) 12%, var(--card))' }}
          >
            {isCollapsed ? <ChevronRight className="w-[18px] h-[18px]" /> : <ChevronLeft className="w-[18px] h-[18px]" />}
          </span>
          <CollapsibleLabel collapsed={isCollapsed}>Collapse</CollapsibleLabel>
        </button>
      </div>
    </aside>
  );
}

export { SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED };

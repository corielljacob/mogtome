import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Menu, X, Heart, BookOpen, Sparkles, Moon, Sun } from 'lucide-react';

// Theme toggle that honors system preference
function ThemeToggleButton() {
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    if (document.documentElement.classList.contains('dark')) return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <button
      onClick={toggle}
      className="p-2.5 rounded-xl text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] hover:bg-[var(--bento-bg)] dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

// Logo mark with a little pom accent
function LogoIcon({ hovered = false }: { hovered?: boolean }) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    // Short delay so page settles, then pom drops in
    const timer = setTimeout(() => setShouldAnimate(true), 250);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <div className={`
        w-10 h-10 rounded-xl
        bg-gradient-to-br from-[var(--bento-primary)] to-[var(--bento-secondary)]
        flex items-center justify-center
        shadow-lg shadow-[var(--bento-primary)]/20
        transition-all duration-300 ease-out
        ${hovered ? 'scale-105 shadow-xl shadow-[var(--bento-primary)]/30' : ''}
      `}>
        <BookOpen className={`
          w-5 h-5 text-white 
          transition-transform duration-300 ease-out
          ${hovered ? 'scale-105' : ''}
        `} />
      </div>
      
      {/* Floating pom-pom on top - bounces once on first load */}
      <div 
        className={`
          absolute -top-1.5 -right-1.5 
          transition-transform duration-300 ease-out
          ${shouldAnimate ? 'animate-pom-land' : 'opacity-0'}
        `}
        style={{ transform: hovered ? 'translateY(-2px) scale(1.1)' : 'translateY(0) scale(1)' }}
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-pink-500 border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-red-300/60 -translate-x-0.5 -translate-y-0.5" />
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home, accentIcon: Sparkles },
    { path: '/members', label: 'Family', icon: Users, accentIcon: Heart },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-[var(--bento-border)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand mark */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <LogoIcon hovered={logoHovered} />
            
            <div className="hidden sm:block">
              <div className="flex items-baseline gap-0.5">
                <span className="font-display font-bold text-xl text-[var(--bento-text)] group-hover:text-[var(--bento-primary)] transition-colors duration-200">
                  Mog
                </span>
                <span className="font-display font-bold text-xl bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] bg-clip-text text-transparent pb-0.5">
                  Tome
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon, accentIcon: AccentIcon }) => (
              <Link
                key={path}
                to={path}
                className={`
                  relative flex items-center gap-2 px-4 py-2 rounded-xl
                  font-soft text-sm font-semibold
                  transition-all duration-200
                  group/item
                  ${isActive(path)
                    ? 'bg-[var(--bento-primary)]/10 text-[var(--bento-primary)]'
                    : 'text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] hover:bg-[var(--bento-bg)]'
                  }
                `}
              >
                <Icon className={`
                  w-4 h-4 transition-all duration-200 
                  group-hover/item:scale-110 
                  ${isActive(path) ? 'text-[var(--bento-primary)]' : ''}
                `} />
                <span>{label}</span>
                
                <AccentIcon className={`
                  absolute -top-1 -right-0.5 w-3 h-3
                  text-[var(--bento-secondary)]
                  transition-all duration-200 
                  opacity-0 scale-50 group-hover/item:opacity-100 group-hover/item:scale-100
                  pointer-events-none
                `} />
              </Link>
            ))}
          </div>

          {/* Right-side controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20">
              <Heart className="w-3 h-3 text-pink-500 fill-pink-500 animate-pulse" />
              <span className="font-accent text-sm text-pink-600 dark:text-pink-400">kupo!</span>
            </div>

            <ThemeToggleButton />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`
                md:hidden p-2.5 rounded-xl 
                text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] 
                hover:bg-[var(--bento-bg)] 
                transition-all duration-200
                active:scale-95
              `}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--bento-border)]">
            <div className="space-y-1">
              {navItems.map(({ path, label, icon: Icon, accentIcon: AccentIcon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3.5 rounded-xl
                    font-soft text-base font-semibold
                    transition-all duration-200
                    active:scale-[0.98]
                    ${isActive(path)
                      ? 'bg-[var(--bento-primary)]/10 text-[var(--bento-primary)]'
                      : 'text-[var(--bento-text-muted)] active:bg-[var(--bento-bg)]'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-9 h-9 rounded-lg flex items-center justify-center
                      ${isActive(path) 
                        ? 'bg-[var(--bento-primary)]/20' 
                        : 'bg-[var(--bento-bg)]'
                      }
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {label}
                  </div>
                  <AccentIcon className="w-4 h-4 text-[var(--bento-text-subtle)]" />
                </Link>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-[var(--bento-border)] px-4">
              <div className="flex items-center justify-center gap-2 text-[var(--bento-text-subtle)]">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                <span className="font-accent text-base">Happy adventuring, kupo!</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Users, Heart, Sparkles, Moon, Sun, Wand2, Star, Scroll, Clock } from 'lucide-react';
import lilGuyMoogle from '../assets/moogles/lil guy moogle.webp';
import pusheenMoogle from '../assets/moogles/ffxiv-pusheen.webp';

// Floating navbar sparkles for whimsy
function NavbarSparkles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[
        { left: '10%', top: '20%', delay: 0 },
        { left: '25%', top: '60%', delay: 0.5 },
        { left: '70%', top: '30%', delay: 1 },
        { left: '85%', top: '50%', delay: 1.5 },
        { left: '50%', top: '25%', delay: 2 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: pos.left, top: pos.top }}
          animate={{
            y: [0, -4, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            delay: pos.delay,
            ease: "easeInOut",
          }}
        >
          {i % 2 === 0 ? (
            <Sparkles className="w-3 h-3 text-[var(--bento-primary)]/40" />
          ) : (
            <Star className="w-2.5 h-2.5 text-[var(--bento-secondary)]/30 fill-[var(--bento-secondary)]/30" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Theme colors for dynamic meta tag updates (matches CSS variables)
const THEME_COLORS = {
  light: '#FFF9F5', // --bento-bg light
  dark: '#1A1722',  // --bento-bg dark
};

// Update the theme-color meta tag for iOS Safari and Android Chrome
function updateThemeColorMeta(isDark: boolean) {
  const color = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
  
  // Find existing theme-color meta tags and update them, or create one
  const existingMetas = document.querySelectorAll('meta[name="theme-color"]');
  
  if (existingMetas.length > 0) {
    // Update all existing theme-color metas to the same color
    // This overrides the media query based ones when user manually toggles
    existingMetas.forEach(meta => {
      meta.setAttribute('content', color);
      // Remove media attribute so it applies universally
      meta.removeAttribute('media');
    });
  } else {
    // Create a new meta tag if none exist
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = color;
    document.head.appendChild(meta);
  }
}

// Quirky snappy toggle - bouncy flip matching navbar style
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
    // Update browser chrome color to match theme
    updateThemeColorMeta(isDark);
  }, [isDark]);
  
  // Also update on mount to ensure meta tag matches saved preference
  useEffect(() => {
    updateThemeColorMeta(isDark);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.button
      onClick={() => setIsDark((prev) => !prev)}
      className="relative w-10 h-10 md:w-9 md:h-9 rounded-xl bg-[var(--bento-card)]/80 border border-[var(--bento-primary)]/15 cursor-pointer shadow-sm"
      style={{ perspective: 600 }}
      aria-label="Toggle theme"
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* The flipper */}
      <motion.div
        className="absolute inset-1.5 md:inset-1 rounded-lg"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isDark ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 800, damping: 30 }}
      >
        {/* Sun face (front) */}
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-[var(--bento-primary)] to-[var(--bento-accent)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Sun className="w-4 h-4 text-white" />
        </div>
        
        {/* Moon face (back) */}
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-[var(--bento-secondary)] to-[var(--bento-text-muted)]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Moon className="w-4 h-4 text-white" />
        </div>
      </motion.div>
    </motion.button>
  );
}

// Floating pom-pom with Framer Motion
function FloatingPom({ isHovered }: { isHovered: boolean }) {
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
}

// Logo mark with moogle and floating pom
function LogoIcon({ hovered = false }: { hovered?: boolean }) {
  return (
    <div className="relative">
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
}


// Fun kupo phrases for the easter egg
const kupoEasterEggPhrases = [
  "Kupo kupo kupo~! ✨",
  "You found me, kupo! 💕",
  "Pom-pom power! 🎀",
  "That tickles, kupo~! 🌟",
  "Moogle magic! ✨",
  "Best friends forever~! 💕",
  "You're my favorite, kupo! 💖",
  "*wiggles pom-pom* ✨",
  "Kupopopo~! 🎵",
  "Secret moogle club! 🤫",
];

// Whimsical "kupo!" badge with occasional wiggle and easter egg
function KupoBadge() {
  const [wiggleKey, setWiggleKey] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number; type: 'sparkle' | 'heart' }>>([]);
  const [easterEggPhrase, setEasterEggPhrase] = useState("");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setWiggleKey(k => k + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    const randomPhrase = kupoEasterEggPhrases[Math.floor(Math.random() * kupoEasterEggPhrases.length)];
    setEasterEggPhrase(randomPhrase);
    setIsActivated(true);
    
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 100 + 40,
      delay: Math.random() * 0.3,
      type: (Math.random() > 0.5 ? 'sparkle' : 'heart') as 'sparkle' | 'heart',
    }));
    setSparkles(newSparkles);
    
    setTimeout(() => {
      setIsActivated(false);
      setSparkles([]);
    }, 3500);
  };

  return (
    <div className="relative">
      {/* Easter egg popup */}
      <AnimatePresence>
        {isActivated && (
          <motion.div
            className="absolute top-full mt-4 right-0 z-50"
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="relative bg-[var(--bento-card)] rounded-2xl p-4 shadow-2xl shadow-[var(--bento-primary)]/20 border border-[var(--bento-primary)]/20">
              <div className="absolute -top-2 right-6 w-4 h-4 bg-[var(--bento-card)] rotate-45 border-l border-t border-[var(--bento-primary)]/20" />
              
              <motion.div
                className="relative"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src={pusheenMoogle} 
                  alt="Pusheen and Moogle being best friends" 
                  className="w-28 h-28 object-contain"
                />
              </motion.div>
              
              <motion.div 
                className="mt-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white font-accent text-sm text-center whitespace-nowrap shadow-lg"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {easterEggPhrase}
              </motion.div>
              
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{ left: `${20 + i * 30}%`, top: '10%' }}
                  animate={{ 
                    y: [0, -15, 0],
                    opacity: [0.6, 1, 0.6],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{ 
                    duration: 1.5 + i * 0.3, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut" 
                  }}
                >
                  <Heart className="w-3 h-3 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparkles burst */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute top-1/2 left-1/2 pointer-events-none z-40"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ 
              x: sparkle.x, 
              y: sparkle.y, 
              scale: [0, 1.2, 0],
              opacity: [1, 1, 0],
              rotate: [0, 180, 360],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: sparkle.delay, ease: "easeOut" }}
          >
            {sparkle.type === 'sparkle' ? (
              <Sparkles className="w-4 h-4 text-[var(--bento-primary)]" />
            ) : (
              <Heart className="w-3 h-3 text-[var(--bento-secondary)] fill-[var(--bento-secondary)]" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main badge */}
      <motion.button 
        key={wiggleKey}
        onClick={handleClick}
        className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--bento-card)]/80 border border-[var(--bento-primary)]/20 shadow-md shadow-[var(--bento-primary)]/10 cursor-pointer select-none"
        initial={wiggleKey > 0 ? { rotate: 0 } : false}
        animate={isActivated ? { 
          scale: [1, 1.2, 0.9, 1.1, 1],
          rotate: [0, -10, 10, -5, 0],
        } : wiggleKey > 0 ? { 
          rotate: [0, -5, 4, -3, 2, -1, 0],
        } : {}}
        transition={{ duration: isActivated ? 0.5 : 0.5, ease: "easeInOut" }}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={isActivated ? { 
            scale: [1, 1.5, 1],
            rotate: [0, 360],
          } : { scale: [1, 1.2, 1] }}
          transition={isActivated ? { duration: 0.5 } : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-4 h-4 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
        </motion.div>
        <span className="font-accent text-lg text-[var(--bento-primary)] leading-none">kupo!</span>
        <motion.div
          animate={isActivated ? { rotate: [0, 360] } : { rotate: [0, 10, -10, 0] }}
          transition={isActivated ? { duration: 0.5 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Wand2 className="w-3.5 h-3.5 text-[var(--bento-secondary)]" />
        </motion.div>
      </motion.button>
    </div>
  );
}

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { path: '/', label: 'Home', icon: Home, accentIcon: Sparkles },
    { path: '/members', label: 'Family', icon: Users, accentIcon: Heart },
    { path: '/chronicle', label: 'Chronicle', icon: Scroll, accentIcon: Clock },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300" style={{ paddingTop: 'var(--safe-area-inset-top)' }}>
      {/* Storybook-style backdrop with warmth - extends to cover safe area */}
      {/* Note: backdrop-blur disabled on mobile via CSS for performance */}
      <div className="absolute inset-0 bg-[var(--bento-card)]/95 md:bg-[var(--bento-card)]/90 md:backdrop-blur-xl" style={{ top: 'calc(-1 * var(--safe-area-inset-top))' }} />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bento-primary)]/[0.03] via-[var(--bento-accent)]/[0.02] to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
      
      {/* Floating whimsical sparkles */}
      <NavbarSparkles />
      
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--bento-primary)]/30 to-transparent" />
      
      {/* Bottom border with storybook style */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--bento-primary)]/25 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8" style={{ paddingLeft: 'max(1rem, var(--safe-area-inset-left, 0px))', paddingRight: 'max(1rem, var(--safe-area-inset-right, 0px))' }}>
        <div className="flex items-center justify-between h-[4.5rem]">
          {/* Brand mark */}
          <Link 
            to="/" 
            className="flex items-center gap-3.5 group"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <LogoIcon hovered={logoHovered} />
            
            <div className="hidden sm:block">
              <div className="flex items-baseline gap-0.5">
                <motion.span 
                  className="font-display font-bold text-xl text-[var(--bento-text)]"
                  animate={{ color: logoHovered ? 'var(--bento-primary)' : 'var(--bento-text)' }}
                  transition={{ duration: 0.2 }}
                >
                  Mog
                </motion.span>
                <span className="font-display font-bold text-xl bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent pb-0.5">
                  Tome
                </span>
              </div>
              {/* Storybook tagline on hover */}
              <motion.span 
                className="block text-xs font-accent text-[var(--bento-secondary)]"
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: logoHovered ? 'auto' : 0, 
                  opacity: logoHovered ? 1 : 0 
                }}
                transition={{ duration: 0.2 }}
              >
                ~ Where moogles gather ~
              </motion.span>
            </div>
          </Link>

          {/* Desktop nav - storybook styled */}
          <div className="hidden md:flex items-center gap-1.5 bg-[var(--bento-card)]/80 px-3 py-2 rounded-2xl border border-[var(--bento-primary)]/15 shadow-lg shadow-[var(--bento-primary)]/5">
            {/* Decorative star on left */}
            <Star className="w-3 h-3 text-[var(--bento-secondary)]/50 fill-[var(--bento-secondary)]/50 mr-1" />
            
            {navItems.map(({ path, label, icon: Icon, accentIcon: AccentIcon }) => {
              const active = isActive(path);
              const hovered = hoveredNav === path;
              
              return (
                <Link
                  key={path}
                  to={path}
                  onMouseEnter={() => setHoveredNav(path)}
                  onMouseLeave={() => setHoveredNav(null)}
                  className={`
                    relative flex items-center gap-2.5 px-4 py-2 rounded-xl
                    font-soft text-sm font-semibold
                    transition-all duration-200
                    ${active
                      ? 'bg-gradient-to-r from-[var(--bento-primary)]/15 to-[var(--bento-secondary)]/15 text-[var(--bento-primary)] shadow-sm border border-[var(--bento-primary)]/10'
                      : 'text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] hover:bg-[var(--bento-bg)]/50'
                    }
                  `}
                >
                  <motion.div
                    animate={{ 
                      scale: hovered && !active ? 1.2 : 1,
                      rotate: hovered && !active ? -10 : 0,
                      y: hovered && !active ? -2 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[var(--bento-primary)]' : ''}`} />
                  </motion.div>
                  
                  <span className="relative">
                    {label}
                    {/* Animated underline on active */}
                    <motion.span 
                      className="absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)]"
                      initial={false}
                      animate={{ width: active ? "100%" : "0%" }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </span>
                  
                  {/* Floating accent icon on hover */}
                  {!active && (
                    <motion.div
                      className="absolute -top-3 right-0 pointer-events-none"
                      initial={{ opacity: 0, scale: 0, rotate: -20, y: 5 }}
                      animate={{ 
                        opacity: hovered ? 1 : 0, 
                        scale: hovered ? 1 : 0,
                        rotate: hovered ? 15 : -20,
                        y: hovered ? 0 : 5,
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <AccentIcon className="w-4 h-4 text-[var(--bento-secondary)]" />
                    </motion.div>
                  )}
                </Link>
              );
            })}
            
            {/* Decorative star on right */}
            <Star className="w-3 h-3 text-[var(--bento-secondary)]/50 fill-[var(--bento-secondary)]/50 ml-1" />
          </div>

          {/* Right-side controls */}
          <div className="flex items-center gap-3">
            <KupoBadge />
            <ThemeToggleButton />

            {/* Mobile menu button - optimized hamburger animation */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative w-11 h-11 rounded-xl bg-[var(--bento-card)]/80 border border-[var(--bento-primary)]/10 active:scale-95 transition-transform duration-150"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {/* Animated hamburger lines - pure CSS transforms for 60fps */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                <span 
                  className={`block w-5 h-0.5 rounded-full bg-current transition-all duration-200 ease-out origin-center
                    ${mobileMenuOpen 
                      ? 'translate-y-2 rotate-45 bg-[var(--bento-primary)]' 
                      : 'bg-[var(--bento-text-muted)]'
                    }`}
                />
                <span 
                  className={`block w-5 h-0.5 rounded-full bg-current transition-all duration-200 ease-out
                    ${mobileMenuOpen 
                      ? 'opacity-0 scale-x-0' 
                      : 'opacity-100 scale-x-100 bg-[var(--bento-text-muted)]'
                    }`}
                />
                <span 
                  className={`block w-5 h-0.5 rounded-full bg-current transition-all duration-200 ease-out origin-center
                    ${mobileMenuOpen 
                      ? '-translate-y-2 -rotate-45 bg-[var(--bento-primary)]' 
                      : 'bg-[var(--bento-text-muted)]'
                    }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu - GPU-accelerated slide animation */}
        <div 
          className={`
            md:hidden fixed inset-x-0 top-[4.5rem] bottom-0 z-40
            transition-all duration-300 ease-out
            ${mobileMenuOpen 
              ? 'opacity-100 pointer-events-auto' 
              : 'opacity-0 pointer-events-none'
            }
          `}
          style={{ 
            paddingTop: 'var(--safe-area-inset-top)',
            top: 'calc(4.5rem + var(--safe-area-inset-top, 0px))'
          }}
        >
          {/* Backdrop overlay */}
          <div 
            className={`
              absolute inset-0 bg-[var(--bento-bg)]/95 
              transition-opacity duration-300
              ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}
            `}
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu content - slides up from bottom */}
          <div 
            className={`
              relative h-full flex flex-col
              transition-transform duration-300 ease-out
              ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-4'}
            `}
          >
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-6">
              {/* Nav items */}
              <div className="space-y-3">
                {navItems.map(({ path, label, icon: Icon, accentIcon: AccentIcon }, index) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center justify-between px-4 py-4 rounded-2xl
                      font-soft text-base font-semibold
                      active:scale-[0.98] transition-transform duration-150
                      ${isActive(path)
                        ? 'bg-gradient-to-r from-[var(--bento-primary)]/15 to-[var(--bento-secondary)]/15 text-[var(--bento-primary)] border border-[var(--bento-primary)]/10'
                        : 'text-[var(--bento-text-muted)] bg-[var(--bento-card)]/60 active:bg-[var(--bento-card)]'
                      }
                    `}
                    style={{ 
                      transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                      transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-8px)',
                      opacity: mobileMenuOpen ? 1 : 0,
                      transition: 'transform 200ms ease-out, opacity 200ms ease-out'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center
                        ${isActive(path) 
                          ? 'bg-gradient-to-br from-[var(--bento-primary)]/20 to-[var(--bento-secondary)]/20 shadow-sm' 
                          : 'bg-[var(--bento-bg)]'
                        }
                      `}>
                        <Icon className={`w-6 h-6 ${isActive(path) ? 'text-[var(--bento-primary)]' : ''}`} />
                      </div>
                      <span className="text-lg">{label}</span>
                    </div>
                    <AccentIcon className={`w-5 h-5 ${isActive(path) ? 'text-[var(--bento-secondary)]' : 'text-[var(--bento-text-subtle)]'}`} />
                  </Link>
                ))}
              </div>
              
              {/* Decorative moogle section */}
              <div 
                className="mt-8 pt-6 border-t border-[var(--bento-primary)]/10"
                style={{ 
                  opacity: mobileMenuOpen ? 1 : 0,
                  transition: 'opacity 300ms ease-out 150ms'
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <img 
                    src={lilGuyMoogle} 
                    alt="" 
                    className="w-16 h-16 object-contain opacity-60"
                    aria-hidden="true"
                  />
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
                    <span className="font-accent text-xl text-[var(--bento-secondary)]">
                      ~ Happy adventuring, kupo! ~
                    </span>
                    <Star className="w-4 h-4 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom safe area padding */}
            <div style={{ paddingBottom: 'var(--safe-area-inset-bottom, 0px)' }} />
          </div>
        </div>
      </div>
    </nav>
  );
}

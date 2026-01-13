import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Users, Menu, X, Heart, Sparkles, Moon, Sun, Wand2 } from 'lucide-react';
import lilGuyMoogle from '../assets/moogles/lil guy moogle.webp';
import pusheenMoogle from '../assets/moogles/ffxiv-pusheen.webp';

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
  }, [isDark]);

  return (
    <motion.button
      onClick={() => setIsDark((prev) => !prev)}
      className="relative w-9 h-9 rounded-xl bg-[var(--bento-bg)]/60 dark:bg-slate-800/40 border border-[var(--bento-border)] cursor-pointer"
      style={{ perspective: 600 }}
      aria-label="Toggle theme"
      whileHover={{ scale: 1.1, rotate: 3 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* The flipper */}
      <motion.div
        className="absolute inset-1 rounded-lg"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isDark ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 800, damping: 30 }}
      >
        {/* Sun face (front) - warm coral/pink from theme */}
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-[var(--bento-primary)] to-pink-500"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Sun className="w-4 h-4 text-white" />
        </div>
        
        {/* Moon face (back) - cool purple from theme */}
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-[var(--bento-secondary)] to-violet-600"
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
          className="absolute inset-0 rounded-full bg-pink-400/40 blur-sm"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Main pom */}
        <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-red-400 via-pink-500 to-rose-600 border-2 border-white dark:border-slate-800 shadow-lg shadow-pink-500/30">
          <div className="absolute top-0.5 left-1 w-2 h-1.5 rounded-full bg-white/40" />
        </div>
        {/* Tiny antenna line */}
        <div className="absolute -bottom-1 left-1/2 w-px h-2 bg-gradient-to-b from-slate-400 to-transparent -translate-x-1/2" />
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
        <div className="w-9 h-9 rounded-xl bg-white/95 dark:bg-slate-100 flex items-center justify-center overflow-hidden">
          <motion.img 
            src={lilGuyMoogle} 
            alt="MogTome" 
            className="w-8 h-8 object-contain"
            animate={{ scale: hovered ? 1.1 : 1 }}
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
    // Pick a random phrase
    const randomPhrase = kupoEasterEggPhrases[Math.floor(Math.random() * kupoEasterEggPhrases.length)];
    setEasterEggPhrase(randomPhrase);
    setIsActivated(true);
    
    // Create sparkles burst - spread around
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 100 + 40,
      delay: Math.random() * 0.3,
      type: (Math.random() > 0.5 ? 'sparkle' : 'heart') as 'sparkle' | 'heart',
    }));
    setSparkles(newSparkles);
    
    // Reset after animation
    setTimeout(() => {
      setIsActivated(false);
      setSparkles([]);
    }, 3500);
  };

  return (
    <div className="relative">
      {/* Easter egg popup with Pusheen & Moogle gif */}
      <AnimatePresence>
        {isActivated && (
          <motion.div
            className="absolute top-full mt-4 right-0 z-50"
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Card container */}
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl shadow-pink-500/20 border border-pink-200 dark:border-pink-500/30">
              {/* Little tail pointing up */}
              <div className="absolute -top-2 right-6 w-4 h-4 bg-white dark:bg-slate-800 rotate-45 border-l border-t border-pink-200 dark:border-pink-500/30" />
              
              {/* Pusheen & Moogle gif */}
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
              
              {/* Speech bubble with phrase */}
              <motion.div 
                className="mt-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-accent text-sm text-center whitespace-nowrap shadow-lg"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {easterEggPhrase}
              </motion.div>
              
              {/* Floating hearts around the card */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{ 
                    left: `${20 + i * 30}%`, 
                    top: '10%',
                  }}
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
                  <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
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
            transition={{ 
              duration: 1, 
              delay: sparkle.delay,
              ease: "easeOut" 
            }}
          >
            {sparkle.type === 'sparkle' ? (
              <Sparkles className="w-4 h-4 text-amber-400" />
            ) : (
              <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main badge */}
      <motion.button 
        key={wiggleKey}
        onClick={handleClick}
        className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-400/20 dark:border-pink-500/20 shadow-sm shadow-pink-500/10 cursor-pointer select-none"
        initial={wiggleKey > 0 ? { rotate: 0 } : false}
        animate={isActivated ? { 
          scale: [1, 1.2, 0.9, 1.1, 1],
          rotate: [0, -10, 10, -5, 0],
        } : wiggleKey > 0 ? { 
          rotate: [0, -5, 4, -3, 2, -1, 0],
        } : {}}
        transition={{ duration: isActivated ? 0.5 : 0.5, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={isActivated ? { 
            scale: [1, 1.5, 1],
            rotate: [0, 360],
          } : { scale: [1, 1.2, 1] }}
          transition={isActivated ? { duration: 0.5 } : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
        </motion.div>
        <span className="font-accent text-base text-pink-600 dark:text-pink-400 leading-none">kupo!</span>
        <motion.div
          animate={isActivated ? { rotate: [0, 360] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Wand2 className="w-3 h-3 text-pink-400/60" />
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

  const navItems = [
    { path: '/', label: 'Home', icon: Home, accentIcon: Sparkles, color: 'amber' },
    { path: '/members', label: 'Family', icon: Users, accentIcon: Heart, color: 'pink' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300">
      {/* Soft gradient backdrop */}
      <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl" />
      
      {/* Subtle bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--bento-border)] to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
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
                <span className={`
                  font-display font-bold text-xl 
                  text-[var(--bento-text)] 
                  transition-all duration-300
                  ${logoHovered ? 'text-[var(--bento-primary)]' : ''}
                `}>
                  Mog
                </span>
                <span className="font-display font-bold text-xl bg-gradient-to-r from-[var(--bento-primary)] via-pink-500 to-[var(--bento-secondary)] bg-clip-text text-transparent pb-0.5">
                  Tome
                </span>
              </div>
              {/* Subtle tagline on hover */}
              <span className={`
                block text-xs font-accent text-[var(--bento-text-subtle)]
                transition-all duration-300 overflow-hidden
                ${logoHovered ? 'max-h-4 opacity-100' : 'max-h-0 opacity-0'}
              `}>
                ✨ Where moogles gather
              </span>
            </div>
          </Link>

          {/* Desktop nav - cloud-like container */}
          <div className="hidden md:flex items-center gap-1 bg-[var(--bento-bg)]/60 dark:bg-slate-800/40 px-2 py-1.5 rounded-2xl border border-[var(--bento-border)]">
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
                    transition-colors duration-200
                    ${active
                      ? 'bg-white dark:bg-slate-700 text-[var(--bento-primary)] shadow-sm'
                      : 'text-[var(--bento-text-muted)] hover:text-[var(--bento-text)]'
                    }
                  `}
                >
                  <motion.div
                    animate={{ 
                      scale: hovered && !active ? 1.15 : 1,
                      rotate: hovered && !active ? -8 : 0
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[var(--bento-primary)]' : ''}`} />
                  </motion.div>
                  
                  <span className="relative">
                    {label}
                    {/* Animated underline on active */}
                    <motion.span 
                      className="absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)]"
                      initial={false}
                      animate={{ width: active ? "100%" : "0%" }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </span>
                  
                  {/* Floating accent icon on hover */}
                  {!active && (
                    <motion.div
                      className="absolute -top-2 right-1 pointer-events-none"
                      initial={{ opacity: 0, scale: 0, rotate: -20 }}
                      animate={{ 
                        opacity: hovered ? 1 : 0, 
                        scale: hovered ? 1 : 0,
                        rotate: hovered ? 12 : -20
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <AccentIcon className="w-3 h-3 text-[var(--bento-secondary)]" />
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right-side controls */}
          <div className="flex items-center gap-3">
            <KupoBadge />
            <ThemeToggleButton />

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative p-2.5 rounded-xl text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] bg-[var(--bento-bg)]/50 hover:bg-[var(--bento-bg)] transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu - animated with Framer Motion */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="py-4 border-t border-[var(--bento-border)]">
                <div className="space-y-2">
                  {navItems.map(({ path, label, icon: Icon, accentIcon: AccentIcon }, index) => (
                    <motion.div
                      key={path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.2 }}
                    >
                      <Link
                        to={path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          flex items-center justify-between px-4 py-4 rounded-2xl
                          font-soft text-base font-semibold
                          transition-colors duration-200
                          active:scale-[0.98]
                          ${isActive(path)
                            ? 'bg-gradient-to-r from-[var(--bento-primary)]/10 to-[var(--bento-secondary)]/10 text-[var(--bento-primary)]'
                            : 'text-[var(--bento-text-muted)] active:bg-[var(--bento-bg)]'
                          }
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`
                            w-10 h-10 rounded-xl flex items-center justify-center
                            ${isActive(path) 
                              ? 'bg-gradient-to-br from-[var(--bento-primary)]/20 to-[var(--bento-secondary)]/20 shadow-sm' 
                              : 'bg-[var(--bento-bg)]'
                            }
                          `}>
                            <Icon className={`w-5 h-5 ${isActive(path) ? 'text-[var(--bento-primary)]' : ''}`} />
                          </div>
                          <span>{label}</span>
                        </div>
                        <AccentIcon className={`w-4 h-4 ${isActive(path) ? 'text-[var(--bento-secondary)]' : 'text-[var(--bento-text-subtle)]'}`} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                {/* Mobile footer message */}
                <motion.div 
                  className="mt-6 pt-4 border-t border-[var(--bento-border)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-center gap-2 py-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-accent text-lg text-[var(--bento-text-subtle)]">
                      Happy adventuring, kupo!
                    </span>
                    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

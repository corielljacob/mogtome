import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Users, Heart, Sparkles, Wand2, Star, Scroll, Clock, LogIn, LogOut, ChevronDown, Settings } from 'lucide-react';
import lilGuyMoogle from '../assets/moogles/lil guy moogle.webp';
import pusheenMoogle from '../assets/moogles/ffxiv-pusheen.webp';
import { useAuth } from '../contexts/AuthContext';

// Settings button for navbar
function SettingsButton() {
  const location = useLocation();
  const isActive = location.pathname === '/settings';

  return (
    <Link
      to="/settings"
      className={`
        relative w-10 h-10 md:w-9 md:h-9 rounded-xl 
        bg-[var(--bento-card)]/80 border cursor-pointer shadow-sm
        flex items-center justify-center
        transition-colors duration-200
        focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
        ${isActive 
          ? 'border-[var(--bento-primary)]/30 text-[var(--bento-primary)]' 
          : 'border-[var(--bento-primary)]/15 text-[var(--bento-text-muted)] hover:text-[var(--bento-text)]'
        }
      `}
      aria-label="Settings"
      aria-current={isActive ? 'page' : undefined}
    >
      <Settings className="w-5 h-5" />
    </Link>
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

// Discord icon for the login button
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

// User menu dropdown for authenticated users
function UserMenu() {
  const { user, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || !user) return null;

  const avatarUrl = user.avatar 
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || '0') % 5}.png`;

  const displayName = user.globalName || user.username;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-[var(--bento-card)]/80 border border-[var(--bento-primary)]/15 cursor-pointer shadow-sm hover:shadow-md transition-shadow focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`User menu for ${displayName}`}
      >
        <img
          src={avatarUrl}
          alt=""
          className="w-7 h-7 rounded-lg object-cover"
        />
        <span className="hidden sm:block font-soft text-sm font-medium text-[var(--bento-text)] max-w-[100px] truncate" aria-hidden="true">
          {displayName}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          <ChevronDown className="w-4 h-4 text-[var(--bento-text-muted)]" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close menu */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            
            <motion.div
              className="absolute right-0 top-full mt-2 z-50 min-w-[180px]"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              role="menu"
              aria-label="User menu"
            >
              <div className="bg-[var(--bento-card)] rounded-2xl border border-[var(--bento-primary)]/15 shadow-xl overflow-hidden">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-[var(--bento-primary)]/10">
                  <p className="font-soft font-semibold text-[var(--bento-text)] truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-[var(--bento-text-muted)] truncate">
                    @{user.username}
                  </p>
                </div>

                {/* Menu items */}
                <div className="p-2">
                  <button
                    onClick={async () => {
                      setIsOpen(false);
                      await logout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] hover:bg-[var(--bento-bg)] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    <span className="font-soft text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Discord login button for unauthenticated users
function LoginButton() {
  const { login, isLoading, isAuthenticated } = useAuth();

  if (isLoading || isAuthenticated) return null;

  return (
    <motion.button
      onClick={login}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#5865F2] text-white font-soft text-sm font-semibold cursor-pointer shadow-md shadow-[#5865F2]/25 hover:shadow-lg hover:bg-[#4752C4] transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#5865F2] focus-visible:outline-none"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Login with Discord"
    >
      <DiscordIcon className="w-4 h-4" aria-hidden="true" />
      <span className="hidden sm:inline">Login</span>
      <LogIn className="w-4 h-4 sm:hidden" aria-hidden="true" />
    </motion.button>
  );
}

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

// Bottom navigation item for mobile
function BottomNavItem({ 
  path, 
  label, 
  icon: Icon, 
  isActive 
}: { 
  path: string; 
  label: string; 
  icon: React.ElementType; 
  isActive: boolean;
}) {
  return (
    <Link
      to={path}
      aria-current={isActive ? 'page' : undefined}
      className={`
        relative flex flex-col items-center justify-center gap-1.5 py-3 px-3 min-w-[64px]
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-inset rounded-xl
        ${isActive 
          ? 'text-[var(--bento-primary)]' 
          : 'text-[var(--bento-text-muted)] active:text-[var(--bento-text)]'
        }
      `}
    >
      <motion.div
        animate={{ 
          scale: isActive ? 1.1 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      
      <span className={`text-[10px] font-soft font-semibold leading-none ${isActive ? 'opacity-100' : 'opacity-70'}`}>
        {label}
      </span>
    </Link>
  );
}

// Bottom navigation bar for mobile
function MobileBottomNav({ navItems }: { navItems: Array<{ path: string; label: string; icon: React.ElementType; accentIcon: React.ElementType }> }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: 'var(--safe-area-inset-bottom)' }}
      aria-label="Mobile navigation"
    >
      {/* Background with blur - extends into safe area at bottom behind home indicator */}
      <div className="absolute inset-x-0 top-0 -bottom-[env(safe-area-inset-bottom)] bg-[var(--bento-card)]/80 backdrop-blur-xl" />
      
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--bento-primary)]/25 to-transparent" />
      
      {/* Nav items container */}
      <div 
        className="relative flex items-center justify-around px-2 py-1"
        style={{ 
          paddingLeft: 'max(0.5rem, var(--safe-area-inset-left, 0px))', 
          paddingRight: 'max(0.5rem, var(--safe-area-inset-right, 0px))' 
        }}
      >
        {navItems.map(({ path, label, icon }) => (
          <BottomNavItem
            key={path}
            path={path}
            label={label}
            icon={icon}
            isActive={isActive(path)}
          />
        ))}
        
        {/* Settings in bottom nav */}
        <BottomNavItem
          path="/settings"
          label="Settings"
          icon={Settings}
          isActive={isActive('/settings')}
        />
      </div>
    </nav>
  );
}

export function Navbar() {
  const location = useLocation();
  const [logoHovered, setLogoHovered] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const navItems = [
    { path: '/', label: 'Home', icon: Home, accentIcon: Sparkles },
    { path: '/members', label: 'Family', icon: Users, accentIcon: Heart },
    { path: '/chronicle', label: 'Chronicle', icon: Scroll, accentIcon: Clock },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top)]" aria-label="Main navigation">
        {/* Storybook-style backdrop with warmth - extends into safe area behind Dynamic Island */}
        <div className="absolute inset-0 -top-[env(safe-area-inset-top)] bg-[var(--bento-card)]/80 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bento-primary)]/[0.03] via-[var(--bento-accent)]/[0.02] to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
        
        {/* Decorative top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--bento-primary)]/30 to-transparent" />
        
        {/* Bottom border with storybook style */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--bento-primary)]/25 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8" style={{ paddingLeft: 'max(1rem, var(--safe-area-inset-left, 0px))', paddingRight: 'max(1rem, var(--safe-area-inset-right, 0px))' }}>
          <div className="flex items-center justify-between h-[4.5rem]">
            {/* Brand mark */}
            <Link 
              to="/" 
              className="flex items-center gap-3.5 group focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-offset-2 focus-visible:outline-none rounded-lg"
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
              aria-label="MogTome - Go to home page"
            >
              <LogoIcon hovered={logoHovered} />
              
              <div className="hidden sm:block" aria-hidden="true">
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
            <div className="hidden md:flex items-center gap-1.5 bg-[var(--bento-card)]/80 px-3 py-2 rounded-2xl border border-[var(--bento-primary)]/15 shadow-lg shadow-[var(--bento-primary)]/5" role="navigation" aria-label="Main menu">
              {/* Decorative star on left */}
              <Star className="w-3 h-3 text-[var(--bento-secondary)]/50 fill-[var(--bento-secondary)]/50 mr-1" aria-hidden="true" />
              
              {navItems.map(({ path, label, icon: Icon, accentIcon: AccentIcon }) => {
                const active = isActive(path);
                const hovered = hoveredNav === path;
                
                return (
                  <Link
                    key={path}
                    to={path}
                    onMouseEnter={() => setHoveredNav(path)}
                    onMouseLeave={() => setHoveredNav(null)}
                    aria-current={active ? 'page' : undefined}
                    className={`
                      relative flex items-center gap-2.5 px-4 py-2 rounded-xl
                      font-soft text-sm font-semibold
                      transition-all duration-200
                      focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
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
                      aria-hidden="true"
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
              <Star className="w-3 h-3 text-[var(--bento-secondary)]/50 fill-[var(--bento-secondary)]/50 ml-1" aria-hidden="true" />
            </div>

            {/* Right-side controls */}
            <div className="flex items-center gap-2 md:gap-3">
              <KupoBadge />
              <LoginButton />
              <UserMenu />
              {/* Settings button - hidden on mobile since it's in bottom nav */}
              <div className="hidden md:block">
                <SettingsButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile bottom navigation */}
      <MobileBottomNav navItems={navItems} />
    </>
  );
}

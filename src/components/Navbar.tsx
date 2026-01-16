import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Users, Heart, Sparkles, Wand2, Scroll, Clock, LogIn, LogOut, ChevronDown, Settings, Search, X, Info, Crown } from 'lucide-react';
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

// Mobile search bar for Members page - syncs with URL params
function MobileHeaderSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(searchQuery);
  
  // Sync input value when URL changes (e.g., back button, clear from page)
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);
  
  // Debounce search input to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchParams(prev => {
          const next = new URLSearchParams(prev);
          if (inputValue.trim()) {
            next.set('q', inputValue);
          } else {
            next.delete('q');
          }
          // Reset page when searching
          next.delete('page');
          return next;
        }, { replace: true });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, searchQuery, setSearchParams]);

  const handleClear = () => {
    setInputValue('');
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('q');
      next.delete('page');
      return next;
    }, { replace: true });
  };

  return (
    <div className="relative flex-1 min-w-0">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-[var(--bento-text-muted)]" />
      </div>
      <input
        type="search"
        placeholder="Search members..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="
          w-full pl-9 pr-8 py-2 text-sm font-soft
          bg-[var(--bento-bg)]/80 
          border border-[var(--bento-border)]
          rounded-xl
          text-[var(--bento-text)] placeholder:text-[var(--bento-text-subtle)]
          focus:outline-none focus:border-[var(--bento-primary)] focus:ring-1 focus:ring-[var(--bento-primary)]/20
          transition-colors
        "
        aria-label="Search members"
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-2.5 cursor-pointer"
          aria-label="Clear search"
        >
          <span className="p-1 rounded-md bg-[var(--bento-primary)]/10 hover:bg-[var(--bento-primary)]/20 transition-colors">
            <X className="w-3 h-3 text-[var(--bento-primary)]" />
          </span>
        </button>
      )}
    </div>
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
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || !user) return null;

  const avatarUrl = user.memberPortraitUrl;
  const displayName = user.memberName;

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
                    {user.memberRank}
                  </p>
                </div>

                {/* Menu items */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/auth/logout');
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

// Bottom navigation bar for mobile - floating pill style
function MobileBottomNav({ navItems }: { navItems: Array<{ path: string; label: string; icon: React.ElementType; accentIcon: React.ElementType }> }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] px-3 pointer-events-none"
      aria-label="Mobile navigation"
    >
      <div className="relative max-w-md mx-auto pointer-events-auto">
        {/* Pill background */}
        <div className="absolute inset-0 bg-[var(--bento-card)]/85 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/10 border border-[var(--bento-primary)]/10" />
        
        {/* Nav items container */}
        <div className="relative flex items-center justify-around px-2 py-1">
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
    { path: '/about', label: 'About', icon: Info, accentIcon: Crown },
  ];

  const isActive = (path: string) => location.pathname === path;

  const isMembersPage = location.pathname === '/members';

  return (
    <>
      {/* Mobile floating header */}
      <nav 
        className="md:hidden fixed top-0 left-0 right-0 z-50 pt-[calc(env(safe-area-inset-top)+0.5rem)] px-3 pointer-events-none"
        aria-label="Mobile header"
      >
        {/* Single unified header bar on Members page with search */}
        {isMembersPage ? (
          <div className="pointer-events-auto flex items-center gap-2 p-2 bg-[var(--bento-card)]/85 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-[var(--bento-primary)]/10 max-w-full overflow-hidden">
            {/* Compact logo */}
            <Link 
              to="/" 
              className="flex-shrink-0 focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none rounded-xl"
              aria-label="MogTome - Go to home page"
            >
              <LogoIcon hovered={false} />
            </Link>
            
            {/* Search input */}
            <MobileHeaderSearch />
            
            {/* Auth controls */}
            <div className="flex-shrink-0 flex items-center gap-1">
              <LoginButton />
              <UserMenu />
            </div>
          </div>
        ) : (
          /* Default: Split logo left, controls right */
          <div className="flex items-center justify-between">
            {/* Logo - floating pill */}
            <Link 
              to="/" 
              className="pointer-events-auto flex items-center gap-2 p-2 bg-[var(--bento-card)]/85 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-[var(--bento-primary)]/10 focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none"
              aria-label="MogTome - Go to home page"
            >
              <LogoIcon hovered={false} />
            </Link>

            {/* Right side controls - floating pill */}
            <div className="pointer-events-auto flex items-center gap-2 p-2 bg-[var(--bento-card)]/85 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-[var(--bento-primary)]/10">
              <LoginButton />
              <UserMenu />
            </div>
          </div>
        )}
      </nav>

      {/* Desktop floating pill navbar - 3 separate pills */}
      <nav 
        className="hidden md:block fixed top-0 left-0 right-0 z-50 pt-4 pointer-events-none"
        aria-label="Main navigation"
      >
        <div className="relative mx-4 lg:mx-6 flex items-center justify-between h-14">
          {/* Left pill - Brand */}
          <Link 
            to="/" 
            className="pointer-events-auto h-full flex items-center gap-3 pl-3 pr-4 bg-[var(--bento-card)]/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/8 border border-white/10 focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none transition-shadow hover:shadow-xl hover:shadow-black/10"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            aria-label="MogTome - Go to home page"
          >
            <LogoIcon hovered={logoHovered} />
            
            <div aria-hidden="true" className="flex flex-col justify-center">
              <div className="flex items-baseline gap-0.5">
                <motion.span 
                  className="font-display font-bold text-xl text-[var(--bento-text)]"
                  animate={{ color: logoHovered ? 'var(--bento-primary)' : 'var(--bento-text)' }}
                  transition={{ duration: 0.2 }}
                >
                  Mog
                </motion.span>
                <span className="font-display font-bold text-xl bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent">
                  Tome
                </span>
              </div>
            </div>
          </Link>

          {/* Center pill - Navigation (absolutely positioned for true centering) */}
          <div 
            className="pointer-events-auto absolute left-1/2 -translate-x-1/2 h-full flex items-center gap-1 px-2 bg-[var(--bento-card)]/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/8 border border-white/10"
            role="navigation" 
            aria-label="Main menu"
          >
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
                    relative flex items-center gap-2 px-3.5 py-2 rounded-xl
                    font-soft text-sm font-medium
                    transition-all duration-200
                    focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                    ${active
                      ? 'bg-[var(--bento-primary)]/15 text-[var(--bento-primary)]'
                      : 'text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] hover:bg-white/5'
                    }
                  `}
                >
                  <motion.div
                    animate={{ 
                      scale: hovered && !active ? 1.15 : 1,
                      rotate: hovered && !active ? -8 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    aria-hidden="true"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                  
                  <span>{label}</span>
                  
                  {/* Floating accent icon on hover */}
                  <AnimatePresence>
                    {hovered && !active && (
                      <motion.div
                        className="absolute -top-2 -right-1 pointer-events-none"
                        initial={{ opacity: 0, scale: 0, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotate: 12 }}
                        exit={{ opacity: 0, scale: 0, y: 4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      >
                        <AccentIcon className="w-3.5 h-3.5 text-[var(--bento-secondary)]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>

          {/* Right pill - Controls */}
          <div className="pointer-events-auto h-full flex items-center gap-2 px-3 bg-[var(--bento-card)]/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/8 border border-white/10">
            <KupoBadge />
            <LoginButton />
            <UserMenu />
            <SettingsButton />
          </div>
        </div>
      </nav>

      {/* Mobile bottom navigation */}
      <MobileBottomNav navItems={navItems} />
    </>
  );
}

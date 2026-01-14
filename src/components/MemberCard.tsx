import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { FreeCompanyMember } from '../types';
import { ExternalLink, Crown, Shield, Sword, Leaf, Cat, Bird, Star, Heart, Sparkles } from 'lucide-react';
import { haptics } from '../hooks';
import pixelMoogle from '../assets/moogles/moogle-pixel-art-maker-first-aid-pac-man-text-graphics-transparent-png-2112085.webp';

interface MemberCardProps {
  member: FreeCompanyMember;
  index?: number;
}

// Rank theming - enhanced with mobile-optimized colors
const rankThemes: Record<string, { 
  gradient: string; 
  glow: string; 
  bg: string;
  bgMobile: string;
  icon: typeof Crown;
  accent: string;
}> = {
  'Moogle Guardian': { gradient: 'from-amber-400 to-orange-400', glow: 'rgba(251, 191, 36, 0.4)', bg: 'bg-amber-500/10', bgMobile: 'bg-amber-500/15', icon: Crown, accent: 'text-amber-500' },
  'Moogle Knight': { gradient: 'from-violet-400 to-purple-500', glow: 'rgba(167, 139, 250, 0.4)', bg: 'bg-violet-500/10', bgMobile: 'bg-violet-500/15', icon: Shield, accent: 'text-violet-500' },
  'Paissa Trainer': { gradient: 'from-rose-400 to-pink-500', glow: 'rgba(251, 113, 133, 0.4)', bg: 'bg-rose-500/10', bgMobile: 'bg-rose-500/15', icon: Heart, accent: 'text-rose-500' },
  'Coeurl Hunter': { gradient: 'from-purple-300 to-violet-400', glow: 'rgba(196, 181, 253, 0.4)', bg: 'bg-purple-400/10', bgMobile: 'bg-purple-400/15', icon: Cat, accent: 'text-purple-400' },
  'Mandragora': { gradient: 'from-orange-300 to-rose-400', glow: 'rgba(253, 186, 116, 0.4)', bg: 'bg-orange-400/10', bgMobile: 'bg-orange-400/15', icon: Leaf, accent: 'text-orange-400' },
  'Apkallu Seeker': { gradient: 'from-pink-300 to-rose-400', glow: 'rgba(249, 168, 212, 0.4)', bg: 'bg-pink-400/10', bgMobile: 'bg-pink-400/15', icon: Bird, accent: 'text-pink-400' },
  'Kupo Shelf': { gradient: 'from-violet-300 to-purple-400', glow: 'rgba(196, 181, 253, 0.35)', bg: 'bg-violet-400/10', bgMobile: 'bg-violet-400/15', icon: Star, accent: 'text-violet-400' },
  'Bom Boko': { gradient: 'from-stone-300 to-stone-400', glow: 'rgba(168, 162, 158, 0.3)', bg: 'bg-stone-400/10', bgMobile: 'bg-stone-400/15', icon: Sparkles, accent: 'text-stone-400' },
};

const defaultTheme = {
  gradient: 'from-[var(--bento-primary)] to-[var(--bento-secondary)]',
  glow: 'rgba(199, 91, 122, 0.3)',
  bg: 'bg-[var(--bento-primary)]/10',
  bgMobile: 'bg-[var(--bento-primary)]/15',
  icon: Sword,
  accent: 'text-[var(--bento-primary)]',
};

/**
 * MemberCard - Award-winning responsive member card
 * 
 * Mobile: Premium native-feel with:
 * - Smooth image reveal animation
 * - Spring-based press feedback
 * - Haptic feedback on tap
 * - Subtle rank glow effect
 * 
 * Desktop: Rich hover effects and animations
 */
export const MemberCard = memo(function MemberCard({ member, index = 0 }: MemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const theme = rankThemes[member.freeCompanyRank] || defaultTheme;
  const RankIcon = theme.icon;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;
  
  const shouldAnimateEntrance = index < 20;
  
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  
  const handleTouchStart = useCallback(() => {
    setIsPressed(true);
    haptics.light();
  }, []);
  
  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
  }, []);

  return (
    <motion.div 
      className="group relative w-full"
      initial={shouldAnimateEntrance ? { opacity: 0, y: 16, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={shouldAnimateEntrance ? { 
        type: "spring",
        stiffness: 400,
        damping: 30,
        delay: Math.min(index * 0.025, 0.5),
      } : undefined}
    >
      {/* Desktop: Hover glow effect */}
      <motion.div 
        className="hidden md:block absolute -inset-2 rounded-3xl blur-xl pointer-events-none"
        style={{ backgroundColor: theme.glow }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.8 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Mobile: Subtle ambient glow - always visible */}
      <div 
        className="md:hidden absolute -inset-1 rounded-2xl blur-xl pointer-events-none opacity-30"
        style={{ backgroundColor: theme.glow }}
      />
      
      <motion.a
        href={lodestoneUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          block relative w-full h-[230px]
          bg-[var(--bento-card)]
          border border-[var(--bento-border)]/40
          rounded-2xl overflow-hidden
          shadow-sm
          md:hover:shadow-xl
          md:active:opacity-100
        "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        initial={false}
        animate={{ 
          y: isHovered ? -6 : 0,
          scale: isPressed ? 0.96 : 1,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
          mass: 0.8,
        }}
        style={{
          boxShadow: isPressed 
            ? '0 2px 8px rgba(0,0,0,0.1)' 
            : '0 4px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        {/* Gradient rank banner - animated on mobile */}
        <motion.div 
          className={`h-1 md:h-1 bg-gradient-to-r ${theme.gradient}`}
          initial={false}
          animate={{ 
            scaleX: isPressed ? 0.95 : 1,
            opacity: isPressed ? 0.8 : 1,
          }}
          style={{ originX: 0.5 }}
          transition={{ duration: 0.1 }}
        />
        
        {/* Avatar */}
        <div className="relative overflow-hidden">
          {/* Premium loading shimmer */}
          <AnimatePresence>
            {!imageLoaded && (
              <motion.div 
                className="absolute inset-0 premium-shimmer"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
          
          <motion.img
            src={member.avatarLink}
            alt={member.name}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            className="w-full h-[160px] object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ 
              opacity: imageLoaded ? 1 : 0, 
              scale: imageLoaded ? (isHovered ? 1.08 : 1) : 1.05,
              filter: imageLoaded ? 'blur(0px)' : 'blur(4px)',
            }}
            transition={{ 
              opacity: { duration: 0.4, ease: "easeOut" },
              scale: { type: "spring", stiffness: 300, damping: 25 },
              filter: { duration: 0.3 },
            }}
          />
          
          {/* Mobile: Premium external link badge */}
          <motion.div 
            className="md:hidden absolute bottom-2 right-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.8 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <ExternalLink className="w-3 h-3 text-white" />
            </div>
          </motion.div>
          
          {/* Desktop: Hover overlay with Lodestone chip */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent items-end justify-center pb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.span 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bento-card)]/95 backdrop-blur-md rounded-full text-xs font-soft font-semibold text-[var(--bento-text)] shadow-lg border border-[var(--bento-primary)]/20"
                  initial={{ y: 12, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 8, opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <ExternalLink className="w-3 h-3 text-[var(--bento-primary)]" />
                  <span>Lodestone</span>
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Desktop: Decorative corner moogle on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="hidden md:block absolute top-1 right-1 pointer-events-none"
                initial={{ opacity: 0, scale: 0, rotate: -20, y: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 20, y: -5 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <motion.img 
                  src={pixelMoogle} 
                  alt="" 
                  className="w-7 h-7 drop-shadow-lg"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Member info - tighter on mobile with spring animations */}
        <div className="p-2.5 md:p-3 text-center space-y-1.5">
          <motion.h3 
            className="font-semibold text-[13px] md:text-sm text-[var(--bento-text)] truncate leading-tight"
            initial={false}
            animate={{ scale: isPressed ? 0.98 : 1 }}
            transition={{ duration: 0.1 }}
          >
            {member.name}
          </motion.h3>
          
          {/* Rank badge - enhanced for mobile */}
          <motion.div 
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full md:${theme.bg} ${theme.bgMobile} md:${theme.bgMobile}`}
            initial={false}
            animate={{ 
              scale: isHovered ? 1.05 : (isPressed ? 0.95 : 1),
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {member.freeCompanyRankIcon ? (
              <motion.img 
                src={member.freeCompanyRankIcon} 
                alt="" 
                className="w-3.5 h-3.5" 
                animate={isHovered ? { rotate: [0, -8, 8, 0] } : {}}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <RankIcon className={`w-3 h-3 ${theme.accent}`} />
            )}
            <span className={`text-[10px] font-bold ${theme.accent} truncate max-w-[70px]`}>
              {member.freeCompanyRank}
            </span>
          </motion.div>
        </div>
      </motion.a>
    </motion.div>
  );
});

/**
 * MemberCardSkeleton - Loading placeholder
 */
export function MemberCardSkeleton() {
  return (
    <div className="w-full h-[230px] bg-[var(--bento-card)] border border-[var(--bento-primary)]/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="h-1 bg-gradient-to-r from-[var(--bento-primary)]/20 via-[var(--bento-secondary)]/30 to-[var(--bento-primary)]/20 animate-shimmer" />
      <div className="w-full h-[160px] bg-gradient-to-br from-[var(--bento-bg)] to-[var(--bento-card)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--bento-primary)]/10 to-transparent animate-shimmer" />
      </div>
      <div className="p-2.5 space-y-2">
        <div className="h-3 bg-[var(--bento-bg)] rounded-full animate-pulse mx-auto w-4/5" />
        <div className="h-4 bg-[var(--bento-primary)]/10 rounded-full animate-pulse mx-auto w-3/5" />
      </div>
    </div>
  );
}

/**
 * MemberCardCompact - Compact list-style variant
 */
export function MemberCardCompact({ member }: { member: FreeCompanyMember }) {
  const theme = rankThemes[member.freeCompanyRank] || defaultTheme;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;

  return (
    <motion.a
      href={lodestoneUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex items-center gap-3 p-2 pr-4
        bg-[var(--bento-card)]
        border border-[var(--bento-primary)]/10
        rounded-xl
        shadow-sm
        hover:shadow-md hover:shadow-[var(--bento-primary)]/10
        active:bg-[var(--bento-bg)]
        transition-all duration-200
        group
      "
      whileHover={{ y: -2, x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative rounded-lg overflow-hidden ring-2 ring-offset-2 ring-offset-[var(--bento-card)]" style={{ '--tw-ring-color': theme.glow } as React.CSSProperties}>
        <img src={member.avatarLink} alt={member.name} className="w-10 h-10 object-cover" loading="lazy" />
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${theme.gradient}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate">{member.name}</p>
        <p className={`text-[10px] font-soft font-medium ${theme.accent} truncate`}>{member.freeCompanyRank}</p>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-[var(--bento-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.a>
  );
}

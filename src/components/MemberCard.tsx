import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { FreeCompanyMember } from '../types';
import { ExternalLink, Crown, Shield, Sword, Leaf, Cat, Bird, Star, Heart, Sparkles } from 'lucide-react';
import pixelMoogle from '../assets/moogles/moogle-pixel-art-maker-first-aid-pac-man-text-graphics-transparent-png-2112085.webp';

interface MemberCardProps {
  member: FreeCompanyMember;
  index?: number; // For staggered animations
}

// Rank theming - cozy palette that matches the storybook coral/lavender theme
const rankThemes: Record<string, { 
  gradient: string; 
  glow: string; 
  bg: string;
  icon: typeof Crown;
  accent: string;
}> = {
  'Moogle Guardian': { 
    // Golden/warm - special leader rank
    gradient: 'from-amber-400 to-orange-400',
    glow: 'rgba(251, 191, 36, 0.4)',
    bg: 'bg-amber-500/10',
    icon: Crown,
    accent: 'text-amber-500',
  },
  'Moogle Knight': { 
    // Rich purple - royal/noble feel
    gradient: 'from-violet-400 to-purple-500',
    glow: 'rgba(167, 139, 250, 0.4)',
    bg: 'bg-violet-500/10',
    icon: Shield,
    accent: 'text-violet-500',
  },
  'Paissa Trainer': { 
    // Warm coral/rose - matches primary
    gradient: 'from-rose-400 to-pink-500',
    glow: 'rgba(251, 113, 133, 0.4)',
    bg: 'bg-rose-500/10',
    icon: Heart,
    accent: 'text-rose-500',
  },
  'Coeurl Hunter': { 
    // Dusty lavender - matches secondary
    gradient: 'from-purple-300 to-violet-400',
    glow: 'rgba(196, 181, 253, 0.4)',
    bg: 'bg-purple-400/10',
    icon: Cat,
    accent: 'text-purple-400',
  },
  'Mandragora': { 
    // Warm peach/coral
    gradient: 'from-orange-300 to-rose-400',
    glow: 'rgba(253, 186, 116, 0.4)',
    bg: 'bg-orange-400/10',
    icon: Leaf,
    accent: 'text-orange-400',
  },
  'Apkallu Seeker': { 
    // Soft mauve/pink
    gradient: 'from-pink-300 to-rose-400',
    glow: 'rgba(249, 168, 212, 0.4)',
    bg: 'bg-pink-400/10',
    icon: Bird,
    accent: 'text-pink-400',
  },
  'Kupo Shelf': { 
    // Soft lilac
    gradient: 'from-violet-300 to-purple-400',
    glow: 'rgba(196, 181, 253, 0.35)',
    bg: 'bg-violet-400/10',
    icon: Star,
    accent: 'text-violet-400',
  },
  'Bom Boko': { 
    // Warm taupe/neutral
    gradient: 'from-stone-300 to-stone-400',
    glow: 'rgba(168, 162, 158, 0.3)',
    bg: 'bg-stone-400/10',
    icon: Sparkles,
    accent: 'text-stone-400',
  },
};

const defaultTheme = {
  gradient: 'from-[var(--bento-primary)] to-[var(--bento-secondary)]',
  glow: 'rgba(199, 91, 122, 0.3)',
  bg: 'bg-[var(--bento-primary)]/10',
  icon: Sword,
  accent: 'text-[var(--bento-primary)]',
};

/**
 * MemberCard - Refined member card with delightful hover effects.
 * Matches the Soft Bento design system.
 * 
 * PERFORMANCE: Memoized to prevent re-renders when parent updates.
 */
export const MemberCard = memo(function MemberCard({ member, index = 0 }: MemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const theme = rankThemes[member.freeCompanyRank] || defaultTheme;
  const RankIcon = theme.icon;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;
  
  // Only animate entrance for first ~20 cards (visible on load) for performance
  const shouldAnimateEntrance = index < 20;
  
  // Memoize callbacks to prevent unnecessary child re-renders
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <motion.div 
      className="group relative w-full max-w-[10rem] sm:max-w-[11rem] md:max-w-[12rem]"
      initial={shouldAnimateEntrance ? { opacity: 0, y: 20, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={shouldAnimateEntrance ? { 
        duration: 0.4, 
        delay: Math.min(index * 0.03, 0.6),
        ease: [0.25, 0.46, 0.45, 0.94]
      } : undefined}
    >
      {/* Hover glow effect - rank colored, appears smoothly */}
      <motion.div 
        className="absolute -inset-2 rounded-3xl blur-xl pointer-events-none"
        style={{ backgroundColor: theme.glow }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.8 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.div 
        className="
          relative w-full
          bg-[var(--bento-card)]
          border border-[var(--bento-primary)]/10
          rounded-2xl overflow-hidden shadow-sm
        "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={isHovered ? { 
          y: -6,
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
        } : {
          y: 0,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }}
      >
        {/* Gradient rank banner */}
        <div className={`h-1 bg-gradient-to-r ${theme.gradient}`} />
        
        {/* Avatar with Lodestone link */}
        <a 
          href={lodestoneUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block relative overflow-hidden group/avatar"
        >
          {/* Loading shimmer */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bento-bg)] via-[var(--bento-card)] to-[var(--bento-bg)] animate-shimmer" />
          )}
          
          <motion.img
            src={member.avatarLink}
            alt={member.name}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            className={`w-full aspect-square object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
          
          {/* Subtle vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />
          
          {/* Hover overlay with Lodestone chip */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center pb-3"
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
          
          {/* Decorative corner moogle on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute top-1 right-1 pointer-events-none"
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
        </a>

        {/* Member info */}
        <div className="p-3 text-center space-y-2">
          {/* Name with subtle hover underline */}
          <h3 className="font-soft font-bold text-sm text-[var(--bento-text)] truncate leading-tight">
            {member.name}
          </h3>
          
          {/* Rank badge - pill style matching the design system */}
          <motion.div 
            className={`
              inline-flex items-center justify-center gap-1.5 
              px-2.5 py-1 rounded-full 
              ${theme.bg}
              border border-transparent
              transition-colors duration-200
            `}
            animate={{ 
              scale: isHovered ? 1.05 : 1,
              borderColor: isHovered ? theme.glow : 'transparent',
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
            <span className={`text-[10px] font-soft font-semibold ${theme.accent} truncate max-w-[80px]`}>
              {member.freeCompanyRank}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
});

/**
 * MemberCardSkeleton - Loading placeholder that matches MemberCard.
 */
export function MemberCardSkeleton() {
  return (
    <div className="w-40 sm:w-44 md:w-48 bg-[var(--bento-card)] border border-[var(--bento-primary)]/10 rounded-2xl overflow-hidden shadow-sm">
      {/* Rank banner skeleton */}
      <div className="h-1 bg-gradient-to-r from-[var(--bento-primary)]/20 via-[var(--bento-secondary)]/30 to-[var(--bento-primary)]/20 animate-shimmer" />
      
      {/* Avatar skeleton */}
      <div className="w-full aspect-square bg-gradient-to-br from-[var(--bento-bg)] to-[var(--bento-card)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--bento-primary)]/10 to-transparent animate-shimmer" />
      </div>
      
      {/* Info skeleton */}
      <div className="p-3 space-y-2.5">
        <div className="h-4 bg-[var(--bento-bg)] rounded-full animate-pulse mx-auto w-4/5" />
        <div className="h-5 bg-[var(--bento-primary)]/10 rounded-full animate-pulse mx-auto w-3/5" />
      </div>
    </div>
  );
}

/**
 * MemberCardCompact - A more compact variant for dense layouts.
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
        transition-shadow duration-200
        group
      "
      whileHover={{ y: -2, x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Avatar */}
      <div className={`relative rounded-lg overflow-hidden ring-2 ring-offset-2 ring-offset-[var(--bento-card)]`} style={{ '--tw-ring-color': theme.glow } as React.CSSProperties}>
        <img 
          src={member.avatarLink} 
          alt={member.name}
          className="w-10 h-10 object-cover"
          loading="lazy"
        />
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${theme.gradient}`} />
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate">
          {member.name}
        </p>
        <p className={`text-[10px] font-soft font-medium ${theme.accent} truncate`}>
          {member.freeCompanyRank}
        </p>
      </div>
      
      {/* Arrow on hover */}
      <motion.div
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
        animate={{ x: 0 }}
        whileHover={{ x: 2 }}
      >
        <ExternalLink className="w-3.5 h-3.5 text-[var(--bento-text-muted)]" />
      </motion.div>
    </motion.a>
  );
}

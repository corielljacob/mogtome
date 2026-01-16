import { useState, memo, useCallback } from 'react';
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
 * PERFORMANCE OPTIMIZATIONS:
 * - Memoized to prevent re-renders when parent updates
 * - Uses CSS transitions instead of Framer Motion for hover states
 * - Entrance animations only on first 12 cards (above fold)
 * - No AnimatePresence (removes mount/unmount overhead)
 * - Image hover overlays use CSS transforms/opacity only
 */
export const MemberCard = memo(function MemberCard({ member, index = 0 }: MemberCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const theme = rankThemes[member.freeCompanyRank] || defaultTheme;
  const RankIcon = theme.icon;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;
  
  // Animate all cards with staggered entrance
  const shouldAnimateEntrance = true;
  
  // Memoize callback
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <div 
      className="group relative w-full max-w-[10rem] sm:max-w-[11rem] md:max-w-[12rem]"
      style={shouldAnimateEntrance ? {
        animation: `fadeSlideIn 0.35s ease-out ${Math.min(index * 0.025, 0.5)}s both`,
      } : undefined}
    >
      {/* Hover glow effect - CSS transition for performance */}
      <div 
        className="
          absolute -inset-2 rounded-3xl blur-xl pointer-events-none
          opacity-0 group-hover:opacity-80
          transition-opacity duration-300
        "
        style={{ backgroundColor: theme.glow }}
      />
      
      <div 
        className="
          relative w-full
          bg-[var(--bento-card)]
          border border-[var(--bento-primary)]/10
          rounded-2xl overflow-hidden shadow-sm
          transition-all duration-200 ease-out
          group-hover:-translate-y-1.5 group-hover:shadow-xl
          active:scale-[0.98]
        "
      >
        {/* Gradient rank banner */}
        <div className={`h-1 bg-gradient-to-r ${theme.gradient}`} />
        
        {/* Avatar with Lodestone link */}
        <a 
          href={lodestoneUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block relative overflow-hidden"
        >
          {/* Loading shimmer */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bento-bg)] via-[var(--bento-card)] to-[var(--bento-bg)] animate-shimmer" />
          )}
          
          <img
            src={member.avatarLink}
            alt={member.name}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            className={`
              w-full aspect-square object-cover 
              transition-all duration-300 ease-out
              group-hover:scale-105
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
          />
          
          {/* Hover overlay with Lodestone chip - CSS only */}
          <div 
            className="
              absolute inset-0 
              bg-gradient-to-t from-black/70 via-black/30 to-transparent 
              flex items-end justify-center pb-3
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
            "
          >
            <span 
              className="
                flex items-center gap-1.5 px-3 py-1.5 
                bg-[var(--bento-card)]/95 backdrop-blur-md rounded-full 
                text-xs font-soft font-semibold text-[var(--bento-text)] 
                shadow-lg border border-[var(--bento-primary)]/20
                translate-y-2 group-hover:translate-y-0
                transition-transform duration-200 ease-out
              "
            >
              <ExternalLink className="w-3 h-3 text-[var(--bento-primary)]" />
              <span>Lodestone</span>
            </span>
          </div>
          
          {/* Decorative corner moogle on hover - CSS only */}
          <div
            className="
              absolute top-1 right-1 pointer-events-none
              opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100
              transition-all duration-200 ease-out
            "
          >
            <img 
              src={pixelMoogle} 
              alt="" 
              className="w-7 h-7 drop-shadow-lg animate-float-gentle"
            />
          </div>
        </a>

        {/* Member info */}
        <div className="p-3 text-center space-y-2">
          {/* Name */}
          <h3 className="font-soft font-bold text-sm text-[var(--bento-text)] truncate leading-tight">
            {member.name}
          </h3>
          
          {/* Rank badge - simplified, no animation */}
          <div 
            className={`
              inline-flex items-center justify-center gap-1.5 
              px-2.5 py-1 rounded-full 
              ${theme.bg}
              transition-transform duration-200
              group-hover:scale-105
            `}
          >
            {member.freeCompanyRankIcon ? (
              <img 
                src={member.freeCompanyRankIcon} 
                alt="" 
                className="w-3.5 h-3.5" 
              />
            ) : (
              <RankIcon className={`w-3 h-3 ${theme.accent}`} />
            )}
            <span className={`text-[10px] font-soft font-semibold ${theme.accent} truncate max-w-[80px]`}>
              {member.freeCompanyRank}
            </span>
          </div>
        </div>
      </div>
    </div>
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
 * Uses CSS-only animations for performance.
 */
export function MemberCardCompact({ member }: { member: FreeCompanyMember }) {
  const theme = rankThemes[member.freeCompanyRank] || defaultTheme;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;

  return (
    <a
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
        hover:-translate-y-0.5 hover:translate-x-0.5
        active:scale-[0.98]
        transition-all duration-200
        group
      "
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
      <div className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200">
        <ExternalLink className="w-3.5 h-3.5 text-[var(--bento-text-muted)]" />
      </div>
    </a>
  );
}

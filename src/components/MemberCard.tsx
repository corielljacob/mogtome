import { useState, memo, useCallback } from 'react';
import type { FreeCompanyMember } from '../types';
import { ExternalLink, Crown, Shield, Sword, Leaf, Cat, Bird, Star, Heart, Sparkles } from 'lucide-react';
import pixelMoogle from '../assets/moogles/moogle-pixel-art-maker-first-aid-pac-man-text-graphics-transparent-png-2112085.webp';

interface MemberCardProps {
  member: FreeCompanyMember;
  index?: number; // For staggered animations
}

// Rank theming - using official FC role colors (solid colors, no gradients)
const rankThemes: Record<string, { 
  glow: string; 
  bg: string;
  icon: typeof Crown;
  accent: string;
  color: string; // hex color for custom styling
}> = {
  'Moogle Guardian': { 
    // Leader - Cyan #2FECE6
    glow: 'rgba(47, 236, 230, 0.4)',
    bg: 'bg-[#2FECE6]/10',
    icon: Crown,
    accent: 'text-[#2FECE6]',
    color: '#2FECE6',
  },
  'Moogle Knight': { 
    // Knight - Purple #8E42CC
    glow: 'rgba(142, 66, 204, 0.4)',
    bg: 'bg-[#8E42CC]/10',
    icon: Shield,
    accent: 'text-[#8E42CC]',
    color: '#8E42CC',
  },
  'Paissa Trainer': { 
    // Paissa - Teal #068167
    glow: 'rgba(6, 129, 103, 0.4)',
    bg: 'bg-[#068167]/10',
    icon: Heart,
    accent: 'text-[#068167]',
    color: '#068167',
  },
  'Coeurl Hunter': { 
    // Coeurl - Green #056D04
    glow: 'rgba(5, 109, 4, 0.4)',
    bg: 'bg-[#056D04]/10',
    icon: Cat,
    accent: 'text-[#056D04]',
    color: '#056D04',
  },
  'Mandragora': { 
    // Mandragora - Orange #E67E22
    glow: 'rgba(230, 126, 34, 0.4)',
    bg: 'bg-[#E67E22]/10',
    icon: Leaf,
    accent: 'text-[#E67E22]',
    color: '#E67E22',
  },
  'Apkallu Seeker': { 
    // Apkallu - Blue #4D88BB
    glow: 'rgba(77, 136, 187, 0.4)',
    bg: 'bg-[#4D88BB]/10',
    icon: Bird,
    accent: 'text-[#4D88BB]',
    color: '#4D88BB',
  },
  'Kupo Shelf': { 
    // Shelf - Lime Green #5ABE32
    glow: 'rgba(90, 190, 50, 0.4)',
    bg: 'bg-[#5ABE32]/10',
    icon: Star,
    accent: 'text-[#5ABE32]',
    color: '#5ABE32',
  },
  'Bom Boko': { 
    // Default/neutral for non-ranked
    glow: 'rgba(168, 162, 158, 0.3)',
    bg: 'bg-stone-400/10',
    icon: Sparkles,
    accent: 'text-stone-400',
    color: '#a8a29e',
  },
};

const defaultTheme = {
  glow: 'rgba(199, 91, 122, 0.3)',
  bg: 'bg-[var(--bento-primary)]/10',
  icon: Sword,
  accent: 'text-[var(--bento-primary)]',
  color: '#c75b7a',
};

/**
 * MemberCard - Refined member card with delightful hover effects.
 * Matches the Soft Bento design system.
 * 
 * ACCESSIBILITY:
 * - Links have descriptive accessible names
 * - Images have meaningful alt text
 * - Decorative elements are hidden from screen readers
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
    <article 
      className="group relative w-full max-w-[11rem] sm:max-w-[10.5rem] md:max-w-[11rem] lg:max-w-[12rem] touch-manipulation"
      style={shouldAnimateEntrance ? {
        animation: `fadeSlideIn 0.35s ease-out ${Math.min(index * 0.025, 0.5)}s both`,
      } : undefined}
      aria-label={`${member.name}, ${member.freeCompanyRank}`}
    >
      <div 
        className="
          relative w-full
          bg-[var(--bento-card)]/80 backdrop-blur-md
          border border-[var(--bento-primary)]/10
          rounded-2xl overflow-hidden shadow-sm
          transition-all duration-300 ease-out
          sm:group-hover:-translate-y-1.5 sm:group-hover:shadow-xl
          active:scale-[0.97] active:shadow-none sm:active:scale-[0.98]
        "
        style={{ '--tw-shadow-color': theme.glow } as React.CSSProperties}
      >
        {/* Solid rank banner - slightly thicker on mobile for better visibility */}
        <div className="h-1.5 sm:h-1" style={{ backgroundColor: theme.color }} aria-hidden="true" />
        
        {/* Avatar with Lodestone link */}
        <a 
          href={lodestoneUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block relative overflow-hidden focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-inset focus:outline-none"
          aria-label={`View ${member.name}'s Lodestone profile (opens in new tab)`}
        >
          {/* Loading shimmer */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bento-bg)] via-[var(--bento-card)] to-[var(--bento-bg)] animate-shimmer" aria-hidden="true" />
          )}
          
          <img
            src={member.avatarLink}
            alt=""
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
          
          {/* Mobile tap indicator - always visible subtle hint */}
          <div 
            className="
              absolute bottom-2 right-2 sm:hidden
              flex items-center justify-center
              w-7 h-7 rounded-full
              bg-black/40 backdrop-blur-sm
              opacity-60
            "
            aria-hidden="true"
          >
            <ExternalLink className="w-3.5 h-3.5 text-white" />
          </div>
          
          {/* Hover overlay with Lodestone chip - desktop only */}
          <div 
            className="
              absolute inset-0 hidden sm:flex
              bg-gradient-to-t from-black/70 via-black/30 to-transparent 
              items-end justify-center pb-3
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
            "
            aria-hidden="true"
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
          
          {/* Decorative corner moogle on hover - desktop only */}
          <div
            className="
              absolute top-1 right-1 pointer-events-none hidden sm:block
              opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100
              transition-all duration-200 ease-out
            "
            aria-hidden="true"
          >
            <img 
              src={pixelMoogle} 
              alt="" 
              className="w-7 h-7 drop-shadow-lg animate-float-gentle"
            />
          </div>
        </a>

        {/* Member info - larger touch target and better mobile sizing */}
        <div className="p-3 sm:p-3 text-center space-y-2 sm:space-y-2">
          {/* Name - larger on mobile for readability */}
          <h3 className="font-soft font-bold text-xs sm:text-sm text-[var(--bento-text)] truncate leading-tight">
            {member.name}
          </h3>
          
          {/* Rank badge - larger touch target on mobile */}
          <div 
            className={`
              inline-flex items-center justify-center gap-1.5 
              px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-full 
              ${theme.bg}
              transition-transform duration-200
              sm:group-hover:scale-105
            `}
          >
            {member.freeCompanyRankIcon ? (
              <img 
                src={member.freeCompanyRankIcon} 
                alt="" 
                className="w-4 h-4 sm:w-3.5 sm:h-3.5"
                aria-hidden="true"
              />
            ) : (
              <RankIcon className={`w-3.5 h-3.5 sm:w-3 sm:h-3 ${theme.accent}`} aria-hidden="true" />
            )}
            <span className={`text-[11px] sm:text-[10px] font-soft font-semibold ${theme.accent} truncate max-w-[80px] sm:max-w-[80px]`}>
              {member.freeCompanyRank}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
});

/**
 * MemberCardSkeleton - Loading placeholder that matches MemberCard.
 */
export function MemberCardSkeleton() {
  return (
    <div className="w-36 sm:w-40 md:w-44 lg:w-48 bg-[var(--bento-card)] border border-[var(--bento-primary)]/10 rounded-2xl overflow-hidden shadow-sm">
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
 * Accessibility: Links have descriptive accessible names.
 */
export function MemberCardCompact({ member }: { member: FreeCompanyMember }) {
  const theme = rankThemes[member.freeCompanyRank] || defaultTheme;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;

  return (
    <a
      href={lodestoneUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${member.name}'s Lodestone profile, ${member.freeCompanyRank} (opens in new tab)`}
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
        focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
        group
      "
    >
      {/* Avatar */}
      <div className={`relative rounded-lg overflow-hidden ring-2 ring-offset-2 ring-offset-[var(--bento-card)]`} style={{ '--tw-ring-color': theme.glow } as React.CSSProperties}>
        <img 
          src={member.avatarLink} 
          alt=""
          className="w-10 h-10 object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: theme.color }} aria-hidden="true" />
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
      <div className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" aria-hidden="true">
        <ExternalLink className="w-3.5 h-3.5 text-[var(--bento-text-muted)]" />
      </div>
    </a>
  );
}

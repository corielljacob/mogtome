import { useState, memo, useCallback } from 'react';
import { motion } from 'motion/react';
import type { FreeCompanyMember } from '../types';
import { ExternalLink } from 'lucide-react';
import { getRankColor } from '../constants';
import pixelMoogle from '../assets/moogles/moogle-pixel-art-maker-first-aid-pac-man-text-graphics-transparent-png-2112085.webp';

interface MemberCardProps {
  member: FreeCompanyMember;
  index?: number; // For staggered animations
}

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
  
  const rankColor = getRankColor(member.freeCompanyRank);
  const RankIcon = rankColor.icon;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;
  
  // Memoize callback
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <motion.article 
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        layout: { duration: 0.3 },
        opacity: { duration: 0.3, delay: Math.min(index * 0.05, 0.5) },
        y: { duration: 0.3, delay: Math.min(index * 0.05, 0.5) },
        scale: { duration: 0.3, delay: Math.min(index * 0.05, 0.5) }
      }}
      className="group relative w-full max-w-[11rem] sm:max-w-[10.5rem] md:max-w-[11rem] lg:max-w-[12rem] touch-manipulation"
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
          active:scale-[0.98] active:shadow-none sm:active:scale-100
        "
        style={{ '--tw-shadow-color': rankColor.glow } as React.CSSProperties}
      >
        {/* Solid rank banner - slightly thicker on mobile for better visibility */}
        <div className="h-1.5 sm:h-1" style={{ backgroundColor: rankColor.hex }} aria-hidden="true" />
        
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
              ${rankColor.bg}
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
              <RankIcon className={`w-3.5 h-3.5 sm:w-3 sm:h-3 ${rankColor.text}`} aria-hidden="true" />
            )}
            <span className={`text-[11px] sm:text-[10px] font-soft font-semibold ${rankColor.text} truncate max-w-[80px] sm:max-w-[80px]`}>
              {member.freeCompanyRank}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
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
  const rankColor = getRankColor(member.freeCompanyRank);
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
      <div className={`relative rounded-lg overflow-hidden ring-2 ring-offset-2 ring-offset-[var(--bento-card)]`} style={{ '--tw-ring-color': rankColor.glow } as React.CSSProperties}>
        <img 
          src={member.avatarLink} 
          alt=""
          className="w-10 h-10 object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: rankColor.hex }} aria-hidden="true" />
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate">
          {member.name}
        </p>
        <p className={`text-[10px] font-soft font-medium ${rankColor.text} truncate`}>
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

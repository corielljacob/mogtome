import { useState, memo, useCallback, type CSSProperties } from 'react';
import type { FreeCompanyMember } from '../types';
import { ExternalLink } from 'lucide-react';
import { getRankColor } from '../constants';

interface MemberCardProps {
  member: FreeCompanyMember;
  index?: number;
}

const WASHI_TAPE_COLORS = [
  '#fbd5d5', // soft red
  '#fef08a', // soft yellow
  '#bbf7d0', // soft green
  '#bfdbfe', // soft blue
  '#e9d5ff', // soft purple
  '#fbcfe8', // soft pink
  '#fed7aa', // soft orange
];

/**
 * MemberCard — Cozy polaroid-style member card.
 *
 * PERFORMANCE: Uses CSS animations for entry (compositor thread).
 * Gentle tilt on hover via CSS transforms for scrapbook feel.
 */
export const MemberCard = memo(function MemberCard({ member, index = 0 }: MemberCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const rankColor = getRankColor(member.freeCompanyRank);
  const RankIcon = rankColor.icon;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  // Gentle pseudo-random properties (deterministic from index)
  const baseTilt = ((index * 7 + 3) % 5) - 2; // -2 to 2 degrees
  const hoverTilt = ((index * 13 + 7) % 7) - 3; // -3 to 3 degrees
  const hoverY = -((index * 5 + 3) % 8 + 12); // -12px to -19px (more whimsy float!)
  const hoverX = ((index * 11 + 2) % 7) - 3; // -3px to 3px
  const tapeColor = WASHI_TAPE_COLORS[index % WASHI_TAPE_COLORS.length];

  const currentTransform = isHovered 
    ? `translate(${hoverX}px, ${hoverY}px) rotate(${hoverTilt}deg)`
    : `translate(0px, 0px) rotate(${baseTilt}deg)`;

  // Group hover utilities handles the transform beautifully without needing `onMouseEnter` logic 
  // or interfering with the fade slide-in animation.
  return (
    <article
      className="group relative w-full max-w-[11rem] sm:max-w-[10.5rem] md:max-w-[11rem] lg:max-w-[12rem] touch-manipulation cursor-pointer
        active:scale-[0.97] active:duration-100"
      style={{
        animation: `fadeSlideIn 0.4s ease-out ${Math.min(index * 0.04, 0.4)}s both`,
        '--card-glow': rankColor.glow,
        '--card-hex': rankColor.hex,
      } as CSSProperties}
      aria-label={`${member.name}, ${member.freeCompanyRank}`}
    >
      {/* 
        Applying hover motion securely inside the animated parent. 
        This prevents `fadeSlideIn` animation transforms from stomping over our hover translations!
      */}
      <div 
        className="w-full transition-[transform,box-shadow,z-index] duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] relative z-0 group-hover:z-20 group-hover:shadow-[0_16px_32px_-8px_var(--shadow)]"
        style={{
           transform: `translate(0px, 0px) rotate(${baseTilt}deg)`,
           ...(isHovered ? { transform: `translate(${hoverX}px, ${hoverY}px) rotate(${hoverTilt}deg)` } : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card surface — warm paper feel with washi tape */}
        <div
          className="
            relative w-full
            bg-[var(--card)]
            border border-[var(--border)]
            p-2.5 sm:p-3 pb-6 sm:pb-8
            rounded-sm
            shadow-md sm:shadow-lg
            overflow-visible
          "
        >

        {/* ── Avatar ──────────────────────────────────────────────── */}
        <a
          href={lodestoneUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            block relative overflow-hidden aspect-square rounded-sm shadow-inner
            bg-[var(--bg)]
            focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--primary)]
            focus:outline-none
          "
          aria-label={`View ${member.name}'s Lodestone profile (opens in new tab)`}
        >
          {/* Loading shimmer */}
          {!imageLoaded && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--card)] to-[var(--bg)] animate-shimmer"
              aria-hidden="true"
            />
          )}

          {/* Avatar image */}
          <img
            src={member.avatarLink}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            className={`
              block w-full h-full object-cover rounded-xl
              transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:scale-[1.06]
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
          />

          {/* Rank sticker badge — top-left */}
          <div className="absolute top-1.5 left-1.5 pointer-events-none z-10">
            <div
              className="flex items-center justify-center size-6 sm:size-5 rounded-full shadow-sm"
              style={{
                backgroundColor: `color-mix(in srgb, ${rankColor.hex} 20%, var(--card))`,
                border: `2px solid color-mix(in srgb, ${rankColor.hex} 30%, var(--card))`,
              }}
            >
              {member.freeCompanyRankIcon ? (
                <img
                  src={member.freeCompanyRankIcon}
                  alt=""
                  className="w-3.5 h-3.5 sm:w-3 sm:h-3"
                  aria-hidden="true"
                />
              ) : (
                <RankIcon
                  className="w-3.5 h-3.5 sm:w-3 sm:h-3"
                  style={{ color: rankColor.hex }}
                  aria-hidden="true"
                />
              )}
            </div>
          </div>

          {/* Mobile tap indicator */}
          <div
            className="
              absolute bottom-2 right-2 sm:hidden
              flex items-center justify-center
              size-6 rounded-full
              bg-black/25
            "
            aria-hidden="true"
          >
            <ExternalLink className="w-3 h-3 text-white/80" />
          </div>

          {/* Desktop hover overlay */}
          <div
            className="
              absolute -inset-px hidden sm:flex
              items-center justify-center
              bg-black/30
              rounded-xl
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
              pointer-events-none
            "
            aria-hidden="true"
          >
            <span
              className="
                flex items-center gap-1.5 px-3 py-1.5
                bg-[var(--card)] rounded-full
                text-xs font-soft font-bold text-[var(--text)]
                shadow-sm border border-[var(--border)]
                scale-90 group-hover:scale-100
                transition-transform duration-300 ease-out
              "
            >
              <ExternalLink className="w-3 h-3" style={{ color: rankColor.hex }} />
              Lodestone
            </span>
          </div>
        </a>

        {/* ── Member info ─────────────────────────────────────────── */}
        <div className="pt-4 text-center space-y-0.5">
          <h3 className="font-accent font-bold text-lg sm:text-xl text-[var(--text)] truncate leading-snug">
            {member.name}
          </h3>
          <p
            className="text-[10px] sm:text-[11px] font-soft font-medium uppercase tracking-wider truncate"
            style={{ color: rankColor.hex }}
          >
            {member.freeCompanyRank}
          </p>
        </div>
      </div>
        {/* Whimsy Washi Tape — z-10 ensures it renders above card surface */}
        <svg
          className="absolute -top-3 inset-x-0 mx-auto w-12 sm:w-16 h-5 sm:h-6 z-10 pointer-events-none overflow-visible"
          viewBox="0 0 64 24"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: `rotate(${((index * 3) % 5) - 2}deg)` }}
          aria-hidden="true"
        >
          <defs>
            <pattern id={`washi-${index}`} patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
              <rect width="5" height="5" fill="transparent" />
              <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
            </pattern>
          </defs>
          {/* Tape body — subtle 2-arc wave (±1px) */}
          <path
            d="M 0,2 Q 16,1 32,2 Q 48,3 64,2 L 64,22 Q 48,23 32,22 Q 16,21 0,22 Z"
            fill={tapeColor}
            opacity="0.82"
          />
          {/* Diagonal stripe texture */}
          <path
            d="M 0,2 Q 16,1 32,2 Q 48,3 64,2 L 64,22 Q 48,23 32,22 Q 16,21 0,22 Z"
            fill={`url(#washi-${index})`}
          />
          {/* Subtle top-half sheen */}
          <path
            d="M 0,2 Q 16,1 32,2 Q 48,3 64,2 L 64,12 Q 48,13 32,12 Q 16,11 0,12 Z"
            fill="rgba(255,255,255,0.15)"
          />
        </svg>
     </div>
    </article>
  );
});

/**
 * MemberCardSkeleton — Loading placeholder matching MemberCard dimensions.
 */
export function MemberCardSkeleton() {
  return (
    <div className="w-full max-w-[11rem] sm:max-w-[10.5rem] md:max-w-[11rem] lg:max-w-[12rem]">
      <div className="relative">
        <div className="relative bg-[var(--card)] border border-[var(--border)] p-2.5 sm:p-3 pb-6 sm:pb-8 rounded-sm shadow-md sm:shadow-lg overflow-visible">
          {/* Avatar placeholder */}
          <div className="relative aspect-square rounded-sm bg-[var(--bg)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--primary)]/8 to-transparent animate-shimmer" />
            {/* Rank badge placeholder */}
            <div className="absolute top-1.5 left-1.5">
              <div className="size-5 rounded-lg bg-[var(--bg)] animate-pulse" />
            </div>
          </div>
          {/* Info placeholder */}
          <div className="pt-4 space-y-2">
            <div className="h-3.5 bg-[var(--bg)] rounded-full animate-pulse mx-auto w-4/5" />
            <div className="h-2.5 bg-[var(--primary)]/8 rounded-full animate-pulse mx-auto w-3/5" />
          </div>
        </div>
        {/* Whimsy Washi Tape (Skeleton) */}
        <svg
          className="absolute -top-3 inset-x-0 mx-auto w-12 sm:w-16 h-5 sm:h-6 z-10 pointer-events-none overflow-visible opacity-40"
          viewBox="0 0 64 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M 0,2 Q 16,1 32,2 Q 48,3 64,2 L 64,22 Q 48,23 32,22 Q 16,21 0,22 Z"
            fill="var(--border)"
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * MemberCardCompact — Horizontal compact variant for dense layouts.
 */
export function MemberCardCompact({ member }: { member: FreeCompanyMember }) {
  const rankColor = getRankColor(member.freeCompanyRank);
  const RankIcon = rankColor.icon;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;

  return (
    <a
      href={lodestoneUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${member.name}'s Lodestone profile, ${member.freeCompanyRank} (opens in new tab)`}
      className="
        group flex items-center gap-3 p-2 pr-4
        bg-[var(--card)]
        border-2 border-[var(--border)]
        rounded-2xl shadow-sm
        hover:shadow-md hover:-translate-y-0.5
        active:scale-[0.98]
        transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
      "
      style={{
        '--compact-glow': rankColor.glow,
      } as CSSProperties}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className="
            size-10 rounded-lg overflow-hidden
            ring-1.5 ring-offset-2 ring-offset-[var(--card)]
            transition-[ring-color] duration-200
          "
          style={{
            '--tw-ring-color': `color-mix(in srgb, ${rankColor.hex} 40%, transparent)`,
          } as CSSProperties}
        >
          <img
            src={member.avatarLink}
            alt=""
            className="block size-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        {/* Rank icon overlay */}
        <div
          className="
            absolute -bottom-0.5 -right-0.5
            flex items-center justify-center
            size-4 rounded-md shadow-sm
          "
          style={{
            backgroundColor: `color-mix(in srgb, ${rankColor.hex} 20%, var(--card))`,
            border: `1px solid color-mix(in srgb, ${rankColor.hex} 30%, transparent)`,
          }}
          aria-hidden="true"
        >
          {member.freeCompanyRankIcon ? (
            <img src={member.freeCompanyRankIcon} alt="" className="w-2.5 h-2.5" />
          ) : (
            <RankIcon className="w-2.5 h-2.5" style={{ color: rankColor.hex }} />
          )}
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-sm text-[var(--text)] truncate">
          {member.name}
        </p>
        <p
          className="text-[10px] font-soft font-semibold truncate"
          style={{ color: rankColor.hex }}
        >
          {member.freeCompanyRank}
        </p>
      </div>

      {/* External link indicator */}
      <div
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-hidden="true"
      >
        <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
      </div>
    </a>
  );
}

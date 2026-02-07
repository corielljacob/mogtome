import { useState, memo, useCallback } from 'react';
import { motion } from 'motion/react';
import type { FreeCompanyMember } from '../types';
import { ExternalLink } from 'lucide-react';
import { getRankColor } from '../constants';

interface MemberCardProps {
  member: FreeCompanyMember;
  index?: number;
}

/**
 * MemberCard — Modern glassmorphic member profile card.
 *
 * HOVER ARCHITECTURE:
 * - Outer `motion.article` handles lift + glow shadow via Framer Motion.
 *   No overflow-hidden here, so transforms never clip children.
 * - A gradient ring div sits behind the card (absolute, -inset-[1px])
 *   and fades in on hover for a rank-colored border glow.
 * - The inner card div has overflow-hidden + rounded corners for visual
 *   clipping. Its border goes transparent on hover to reveal the ring.
 * - The avatar scales inside its own overflow container.
 * - Overlay elements use opacity / scale CSS transitions.
 */
export const MemberCard = memo(function MemberCard({ member, index = 0 }: MemberCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const rankColor = getRankColor(member.freeCompanyRank);
  const RankIcon = rankColor.icon;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        boxShadow: `0 0 0 1.5px ${rankColor.hex}50, 0 0 14px 0 ${rankColor.glow}, 0 20px 40px -12px ${rankColor.glow}`,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      transition={{
        opacity: { duration: 0.4, delay: Math.min(index * 0.04, 0.4) },
        y: { duration: 0.4, delay: Math.min(index * 0.04, 0.4) },
      }}
      className="group relative w-full max-w-[11rem] sm:max-w-[10.5rem] md:max-w-[11rem] lg:max-w-[12rem] rounded-2xl touch-manipulation cursor-pointer"
      aria-label={`${member.name}, ${member.freeCompanyRank}`}
    >
      {/* Card surface */}
      <div
        className="
          relative w-full
          bg-[var(--bento-card)]/90 backdrop-blur-md
          border border-[var(--bento-border)]
          rounded-2xl overflow-hidden
          shadow-sm
        "
      >
        {/* ── Avatar ──────────────────────────────────────────────── */}
        <a
          href={lodestoneUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            block relative overflow-hidden aspect-square
            bg-[var(--bento-bg)]
            focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--bento-primary)]
            focus:outline-none
          "
          aria-label={`View ${member.name}'s Lodestone profile (opens in new tab)`}
        >
          {/* Loading shimmer */}
          {!imageLoaded && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-[var(--bento-bg)] via-[var(--bento-card)] to-[var(--bento-bg)] animate-shimmer"
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
              block w-full h-full object-cover
              transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:scale-[1.08]
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
          />

          {/* Rank icon badge — floating top-left */}
          <div className="absolute top-1.5 left-1.5 pointer-events-none z-10">
            <div
              className="flex items-center justify-center size-6 sm:size-5 rounded-lg shadow-sm backdrop-blur-md"
              style={{
                backgroundColor: `color-mix(in srgb, ${rankColor.hex} 18%, var(--bento-card))`,
                border: `1px solid color-mix(in srgb, ${rankColor.hex} 25%, transparent)`,
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
              bg-black/30 backdrop-blur-sm
            "
            aria-hidden="true"
          >
            <ExternalLink className="w-3 h-3 text-white/80" />
          </div>

          {/* Desktop hover overlay + Lodestone chip.
              -inset-px oversizes by 1px so sub-pixel rounding during
              the card's y-translate never leaves a hairline gap. */}
          <div
            className="
              absolute -inset-px hidden sm:flex
              items-center justify-center
              bg-black/35 backdrop-blur-[2px]
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
              pointer-events-none
            "
            aria-hidden="true"
          >
            <span
              className="
                flex items-center gap-1.5 px-3 py-1.5
                bg-[var(--bento-card)]/95 backdrop-blur-md rounded-full
                text-xs font-soft font-bold text-[var(--bento-text)]
                shadow-lg border border-[var(--bento-border)]
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
        <div className="px-3 py-2.5 text-center space-y-1">
          <h3 className="font-display font-bold text-xs sm:text-sm text-[var(--bento-text)] truncate leading-snug">
            {member.name}
          </h3>
          <p
            className="text-[10px] sm:text-[11px] font-soft font-semibold truncate"
            style={{ color: rankColor.hex }}
          >
            {member.freeCompanyRank}
          </p>
        </div>

        {/* Bottom accent gradient */}
        <div
          className="h-0.5 opacity-50 group-hover:opacity-90 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${rankColor.hex}, transparent)`,
          }}
          aria-hidden="true"
        />
      </div>
    </motion.article>
  );
});

/**
 * MemberCardSkeleton — Loading placeholder matching MemberCard dimensions.
 */
export function MemberCardSkeleton() {
  return (
    <div className="w-full max-w-[11rem] sm:max-w-[10.5rem] md:max-w-[11rem] lg:max-w-[12rem]">
      <div className="bg-[var(--bento-card)] border border-[var(--bento-border)] rounded-2xl overflow-hidden shadow-sm">
        {/* Avatar placeholder */}
        <div className="relative aspect-square bg-gradient-to-br from-[var(--bento-bg)] to-[var(--bento-card)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--bento-primary)]/8 to-transparent animate-shimmer" />
          {/* Rank badge placeholder */}
          <div className="absolute top-1.5 left-1.5">
            <div className="size-5 rounded-lg bg-[var(--bento-bg)] animate-pulse" />
          </div>
        </div>
        {/* Info placeholder */}
        <div className="px-3 py-2.5 space-y-2">
          <div className="h-3.5 bg-[var(--bento-bg)] rounded-full animate-pulse mx-auto w-4/5" />
          <div className="h-2.5 bg-[var(--bento-primary)]/8 rounded-full animate-pulse mx-auto w-3/5" />
        </div>
        {/* Bottom accent placeholder */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-[var(--bento-primary)]/15 to-transparent" />
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
        bg-[var(--bento-card)]/90 backdrop-blur-md
        border border-[var(--bento-border)]
        rounded-xl shadow-sm
        hover:shadow-lg hover:border-transparent
        active:scale-[0.98]
        transition-all duration-200
        focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
      "
      style={{
        '--compact-glow': rankColor.glow,
      } as React.CSSProperties}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className="
            size-10 rounded-lg overflow-hidden
            ring-1.5 ring-offset-2 ring-offset-[var(--bento-card)]
            transition-[ring-color] duration-200
          "
          style={{
            '--tw-ring-color': `color-mix(in srgb, ${rankColor.hex} 40%, transparent)`,
          } as React.CSSProperties}
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
            backgroundColor: `color-mix(in srgb, ${rankColor.hex} 20%, var(--bento-card))`,
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
        <p className="font-display font-bold text-sm text-[var(--bento-text)] truncate">
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
        <ExternalLink className="w-3.5 h-3.5 text-[var(--bento-text-muted)]" />
      </div>
    </a>
  );
}

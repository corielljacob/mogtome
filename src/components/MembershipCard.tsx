import { useRef, useState, useCallback } from 'react';
import { Star, ExternalLink } from 'lucide-react';

import lilGuyMoogle from '../assets/moogles/lil guy moogle.webp';
import { rankThemes, defaultTheme } from './membershipCardThemes';

// ─────────────────────────────────────────────────────────────────────────────
// MEMBERSHIP CARD — Warm illustrated badge, no 3D effects
// ─────────────────────────────────────────────────────────────────────────────

export interface MembershipCardProps {
  name: string;
  rank: string;
  avatarUrl: string;
  characterId?: string;
  memberSince?: Date | string;
  compact?: boolean;
}

export function MembershipCard({
  name,
  rank,
  avatarUrl,
  characterId,
  compact = false,
}: MembershipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const theme = rankThemes[rank] || defaultTheme;
  const RankIcon = theme.icon;
  const lodestoneUrl = characterId
    ? `https://na.finalfantasyxiv.com/lodestone/character/${characterId}`
    : null;

  const formattedDate = (() => {
    // No memberSince prop used here — we use it from the parent
    return 'Member';
  })();

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const sizeClasses = compact
    ? 'max-w-[340px] sm:max-w-[360px]'
    : 'max-w-[360px]';
  const paddingClass = compact ? 'p-4 sm:p-5' : 'p-5';
  const avatarSize = compact ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-14 h-14';
  const nameSize = compact ? 'text-sm sm:text-base' : 'text-base';
  const moogleSize = compact ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-12 h-12';

  return (
    <div className={compact ? '' : 'py-4'}>
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative w-full ${sizeClasses} mx-auto aspect-[1.6/1] rounded-2xl overflow-hidden
          border-2 border-[var(--border)]
          shadow-[0_4px_16px_-4px_var(--shadow)]
          transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          hover:-translate-y-1 hover:shadow-[0_8px_28px_-6px_var(--shadow)]`}
        style={{
          background: `linear-gradient(135deg, 
            hsl(340, 50%, 12%) 0%, 
            hsl(330, 45%, 8%) 50%,
            hsl(320, 40%, 10%) 100%)`,
        }}
      >
        {/* Subtle dot texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Warm accent border glow */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            boxShadow: `inset 0 0 30px -10px ${theme.glow}`,
            opacity: isHovered ? 0.6 : 0.25,
          }}
        />

        {/* Card content */}
        <div className={`relative h-full ${paddingClass} flex flex-col`}>
          {/* Top: Branding */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}
                >
                  <Star className="w-3.5 h-3.5 text-white fill-white/50" />
                </div>
                <span className="font-display font-bold text-white/90 text-sm tracking-wide">
                  MOGTOME
                </span>
              </div>
              <p className="font-accent text-[var(--primary)] text-lg -mt-0.5 ml-7">
                Membership
              </p>
            </div>

            {/* Moogle — gentle float via CSS */}
            <div className="relative animate-float-gentle">
              <img
                src={lilGuyMoogle}
                alt=""
                className={`${moogleSize} object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]`}
              />
            </div>
          </div>

          <div className="flex-1" />

          {/* Bottom: Member info */}
          <div className="flex items-end gap-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className={`absolute -inset-0.5 rounded-xl bg-gradient-to-br ${theme.gradient} opacity-60`}
              />
              <img src={avatarUrl} alt="" className={`relative ${avatarSize} rounded-lg object-cover`} />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 pb-0.5">
              <h3 className={`font-display font-bold text-white ${nameSize} truncate leading-tight`}>
                {name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${theme.bg}`}>
                  <RankIcon className={`w-3 h-3 ${theme.accent}`} />
                  <span className={`font-soft font-semibold text-[10px] ${theme.accent} uppercase tracking-wide`}>
                    {rank}
                  </span>
                </div>
                <span className="text-white/40 text-[10px]">•</span>
                <span className="font-accent text-[11px] text-[var(--primary)]">Kupo Life!</span>
              </div>
            </div>

            {/* Lodestone link */}
            {lodestoneUrl && (
              <a
                href={lodestoneUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-white/40 hover:text-[var(--primary)] transition-colors flex-shrink-0 pb-0.5"
              >
                <ExternalLink className="w-2.5 h-2.5" />
                <span>Lodestone</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

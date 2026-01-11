import type { FreeCompanyMember } from '../types';
import { ExternalLink } from 'lucide-react';

interface MemberCardProps {
  member: FreeCompanyMember;
}

const rankColors: Record<string, string> = {
  'Moogle Guardian': 'from-[#94EBDE] to-[#6BC5B8]',
  'Moogle Knight': 'from-[#945FE0] to-[#7A4DBD]',
  'Paissa Trainer': 'from-[#1ABC9C] to-[#16A085]',
  'Coeurl Hunter': 'from-[#1F8B4C] to-[#186A3B]',
  'Mandragora': 'from-[#E57E1E] to-[#C96A15]',
  'Apkallu Seeker': 'from-[#4D88BB] to-[#3D6F99]',
  'Kupo Shelf': 'from-[#5ABE32] to-[#4A9D29]',
  'Bom Boko': 'from-[#E8DDD0] to-[#D4C4B0]',
};

/**
 * MemberCard - KUPO BIT styled member card with Lodestone link affordance.
 */
export function MemberCard({ member }: MemberCardProps) {
  const gradient = rankColors[member.freeCompanyRank] || 'from-stone-300 to-stone-400';
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;

  return (
    <div className="group">
      <div className="
        w-44 md:w-52
        bg-white dark:bg-slate-900
        border border-[var(--bento-border)]
        rounded-2xl
        overflow-hidden
        shadow-sm
        hover:shadow-xl hover:shadow-[var(--bento-primary)]/10
        dark:hover:shadow-[var(--bento-primary)]/20
        transition-all duration-300
        hover:-translate-y-1
      ">
        {/* Gradient rank banner */}
        <div className={`h-1.5 md:h-2 bg-gradient-to-r ${gradient}`} />
        
        {/* Avatar with Lodestone link */}
        <a 
          href={lodestoneUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block relative overflow-hidden"
        >
          <img
            src={member.avatarLink}
            alt={member.name}
            className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Hover overlay with Lodestone chip */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 rounded-lg text-xs font-inter font-medium text-[var(--bento-text)]">
              <ExternalLink className="w-3 h-3" />
              Lodestone
            </span>
          </div>
        </a>

        {/* Member info */}
        <div className="p-3 md:p-4 text-center">
          <h3 className="font-inter font-semibold text-sm md:text-base text-[var(--bento-text)] truncate mb-1.5">
            {member.name}
          </h3>
          <div className="flex items-center justify-center gap-1.5">
            {member.freeCompanyRankIcon && (
              <img src={member.freeCompanyRankIcon} alt="" className="w-4 h-4" />
            )}
            <span className="text-[10px] md:text-xs text-[var(--bento-text-muted)] font-inter font-medium truncate">
              {member.freeCompanyRank}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * MemberCardSkeleton - Loading placeholder for MemberCard.
 */
export function MemberCardSkeleton() {
  return (
    <div className="w-44 md:w-52 bg-white dark:bg-slate-900 border border-[var(--bento-border)] rounded-2xl overflow-hidden">
      <div className="h-1.5 md:h-2 bg-stone-200 dark:bg-slate-700" />
      <div className="w-full aspect-square bg-stone-200 dark:bg-slate-800 animate-pulse" />
      <div className="p-3 md:p-4 space-y-2">
        <div className="h-4 bg-stone-200 dark:bg-slate-700 rounded animate-pulse mx-auto w-3/4" />
        <div className="h-3 bg-stone-200 dark:bg-slate-700 rounded animate-pulse mx-auto w-1/2" />
      </div>
    </div>
  );
}

import type { FreeCompanyMember } from '../types';
import { Card } from './Card';

interface MemberCardProps {
  member: FreeCompanyMember;
}

const rankColors: Record<string, string> = {
  'Moogle Guardian': 'from-rank-guardian to-emerald-300',
  'Moogle Knight': 'from-rank-knight to-purple-400',
  'Paissa Trainer': 'from-rank-paissa to-teal-400',
  'Coeurl Hunter': 'from-rank-hunter to-green-400',
  'Mandragora': 'from-rank-mandragora to-orange-300',
  'Apkallu Seeker': 'from-rank-seeker to-blue-400',
  'Kupo Shelf': 'from-rank-shelf to-lime-400',
  'Bom Boko': 'from-rank-bom-boko to-amber-100',
};

export function MemberCard({ member }: MemberCardProps) {
  const gradientClass = rankColors[member.freeCompanyRank] || 'from-gray-200 to-gray-300';
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;

  return (
    <Card className="overflow-hidden group w-56">
      {/* Rank color banner */}
      <div className={`h-2 bg-gradient-to-r ${gradientClass}`} />
      
      {/* Avatar */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Hover overlay with "View on Lodestone" */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white/90 text-text-dark text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
            View on Lodestone ↗
          </span>
        </div>
      </a>

      {/* Info */}
      <div className="p-4 text-center">
        <h3 className="font-bold text-text-dark text-lg leading-tight mb-1 truncate">
          {member.name}
        </h3>
        <div className="flex items-center justify-center gap-2">
          {member.freeCompanyRankIcon && (
            <img
              src={member.freeCompanyRankIcon}
              alt=""
              className="w-5 h-5"
            />
          )}
          <span className="text-sm text-text-light font-medium">
            {member.freeCompanyRank}
          </span>
        </div>
      </div>
    </Card>
  );
}

import { motion } from 'motion/react';
import type { FreeCompanyMember } from '../types';

interface MemberCardProps {
  member: FreeCompanyMember;
}

const rankColors: Record<string, string> = {
  'Moogle Guardian': 'from-[#94EBDE] to-emerald-300',
  'Moogle Knight': 'from-[#945FE0] to-purple-400',
  'Paissa Trainer': 'from-[#1ABC9C] to-teal-400',
  'Coeurl Hunter': 'from-[#1F8B4C] to-green-400',
  'Mandragora': 'from-[#E57E1E] to-orange-300',
  'Apkallu Seeker': 'from-[#4D88BB] to-blue-400',
  'Kupo Shelf': 'from-[#5ABE32] to-lime-400',
  'Bom Boko': 'from-[#F6EBE0] to-amber-100',
};

export function MemberCard({ member }: MemberCardProps) {
  const gradientClass = rankColors[member.freeCompanyRank] || 'from-gray-200 to-gray-300';
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card bg-base-100 shadow-lg overflow-hidden w-56 cursor-pointer group"
    >
      {/* Rank color banner */}
      <div className={`h-2 bg-gradient-to-r ${gradientClass}`} />
      
      {/* Avatar */}
      <a
        href={lodestoneUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden"
      >
        <motion.img
          src={member.avatarLink}
          alt={member.name}
          className="w-full aspect-square object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="badge badge-neutral gap-1">
            View Lodestone
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </span>
        </div>
      </a>

      {/* Info */}
      <div className="card-body p-4 text-center">
        <h3 className="font-bold text-base-content text-lg leading-tight truncate">
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
          <span className="text-sm text-base-content/70 font-medium">
            {member.freeCompanyRank}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

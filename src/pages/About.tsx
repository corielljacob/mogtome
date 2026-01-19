import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ExternalLink, Heart, Sparkles, RefreshCw, Crown, Shield, Star, Pencil } from 'lucide-react';
import { membersApi } from '../api/members';
import { StoryDivider, FloatingSparkles, SimpleFloatingMoogles, ContentCard } from '../components';
import { useAuth } from '../contexts/AuthContext';
import type { StaffMember } from '../types';
import { FC_RANKS } from '../types';

// Rank order lookup for sorting (same as Members page)
const RANK_ORDER = new Map<string, number>(FC_RANKS.map((r, i) => [r.name, i]));

// Assets
import wizardMoogle from '../assets/moogles/wizard moogle.webp';
import flyingMoogles from '../assets/moogles/moogles flying.webp';
import pushingMoogles from '../assets/moogles/moogles pushing.webp';
import deadMoogle from '../assets/moogles/dead moogle.webp';

// Simple rank config - uses official FC role colors (solid colors, no gradients)
const rankConfig: Record<string, { 
  icon: typeof Crown;
  color: string;
  bg: string;
  glow: string;
  label: string;
  description: string;
  memberTerm: { singular: string; plural: string };
  hexColor: string;
}> = {
  'Moogle Guardian': { 
    // Leader - Cyan #2FECE6
    icon: Crown,
    color: 'text-[#2FECE6]',
    bg: 'bg-[#2FECE6]/10',
    glow: 'rgba(47, 236, 230, 0.4)',
    label: 'FC Leader',
    description: 'Our Moogle Guardian who leads Kupo Life',
    memberTerm: { singular: 'leader', plural: 'leaders' },
    hexColor: '#2FECE6',
  },
  'Moogle Knight': { 
    // Knight - Purple #8E42CC
    icon: Shield,
    color: 'text-[#8E42CC]',
    bg: 'bg-[#8E42CC]/10',
    glow: 'rgba(142, 66, 204, 0.4)',
    label: 'Moogle Knights',
    description: 'Our trusted officers who keep things running smoothly',
    memberTerm: { singular: 'knight', plural: 'knights' },
    hexColor: '#8E42CC',
  },
  'Paissa Trainer': { 
    // Paissa - Teal #068167
    icon: Star,
    color: 'text-[#068167]',
    bg: 'bg-[#068167]/10',
    glow: 'rgba(6, 129, 103, 0.4)',
    label: 'Paissa Trainers',
    description: 'Exemplary community members hoping to make your day a little brighter',
    memberTerm: { singular: 'trainer', plural: 'trainers' },
    hexColor: '#068167',
  },
};

const defaultRankConfig = {
  icon: Star,
  color: 'text-[var(--bento-primary)]',
  bg: 'bg-[var(--bento-primary)]/10',
  glow: 'rgba(199, 91, 122, 0.3)',
  label: 'Leadership',
  description: 'Helping guide our FC',
  memberTerm: { singular: 'member', plural: 'members' },
  hexColor: '#c75b7a',
};

interface StaffCardProps {
  member: StaffMember;
  index?: number;
  isCurrentUser?: boolean;
}

/**
 * FeaturedLeaderCard - A special prominent card for the FC Leader (Moogle Guardian)
 */
const FeaturedLeaderCard = memo(function FeaturedLeaderCard({ member, isCurrentUser = false }: { member: StaffMember; isCurrentUser?: boolean }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const config = rankConfig[member.freeCompanyRank] || defaultRankConfig;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;
  
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <motion.article 
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-label={`${member.name}, FC Leader`}
    >
      {/* Ambient glow */}
      <div 
        className="
          absolute -inset-4 rounded-3xl blur-2xl pointer-events-none
          opacity-40 group-hover:opacity-60
          transition-opacity duration-500
        "
        style={{ backgroundColor: config.glow }}
        aria-hidden="true"
      />
      
      <div 
        className="
          relative flex flex-col items-center text-center
          p-4 sm:p-6 md:p-8
          bg-[var(--bento-card)]/95 backdrop-blur-md
          border-2 border-amber-400/30 rounded-3xl
          shadow-xl shadow-amber-500/10
          hover:shadow-2xl hover:border-amber-400/50
          transition-all duration-300
        "
      >
        {/* Decorative crown accent */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2" aria-hidden="true">
          <div 
            className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg flex items-center gap-1.5 sm:gap-2"
            style={{ backgroundColor: config.hexColor, boxShadow: `0 10px 15px -3px ${config.glow}` }}
          >
            <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            <span className="text-[10px] sm:text-xs font-soft font-bold text-white uppercase tracking-wide">
              FC Leader
            </span>
          </div>
        </div>
        
        {/* Avatar */}
        <a 
          href={lodestoneUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="
            relative mt-4 mb-3 sm:mb-4
            focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none rounded-2xl
          "
          aria-label={`View ${member.name}'s Lodestone profile (opens in new tab)`}
        >
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-xl ring-4 ring-amber-400/20">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--bento-bg)] via-[var(--bento-card)] to-[var(--bento-bg)] animate-shimmer" aria-hidden="true" />
            )}
            
            <img
              src={member.avatarLink}
              alt=""
              loading="eager"
              decoding="async"
              onLoad={handleImageLoad}
              className={`
                w-full h-full object-cover 
                transition-all duration-300 ease-out
                group-hover:scale-105
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
            />
            
            {/* Hover overlay */}
            <div 
              className="
                absolute inset-0 
                bg-gradient-to-t from-black/70 to-transparent 
                flex items-end justify-center pb-2
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
              "
              aria-hidden="true"
            >
              <span className="flex items-center gap-1 px-2.5 py-1 bg-white/95 rounded-full text-[10px] font-soft font-bold text-gray-800 shadow-sm">
                <ExternalLink className="w-2.5 h-2.5" />
                Lodestone
              </span>
            </div>
          </div>
        </a>
        
        {/* Name */}
        <h3 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-[var(--bento-text)] mb-2 sm:mb-3">
          {member.name}
        </h3>
        
        {/* Biography */}
        <p className="text-[var(--bento-text-muted)] font-soft text-sm sm:text-base leading-relaxed max-w-md px-1 sm:px-0">
          {member.biography || (
            <span className="italic opacity-75">Leading Kupo Life with heart and dedication, kupo~</span>
          )}
        </p>
        
        {/* Edit Bio button for current user */}
        {isCurrentUser && (
          <Link
            to="/profile"
            className="
              inline-flex items-center gap-1.5 mt-3 sm:mt-4
              px-3 py-2 rounded-xl
              bg-amber-500/10 hover:bg-amber-500/20
              text-amber-600 dark:text-amber-400 font-soft font-semibold text-sm
              transition-colors
              focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none
            "
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
            Edit Your Bio
          </Link>
        )}
      </div>
    </motion.article>
  );
});

/**
 * LeaderCard - A horizontal card that features the leader's bio prominently
 * Distinct from MemberCard's square grid layout
 */
const LeaderCard = memo(function LeaderCard({ member, index = 0, isCurrentUser = false }: StaffCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const config = rankConfig[member.freeCompanyRank] || defaultRankConfig;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;
  
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <article 
      className="group relative"
      style={{
        animation: `fadeSlideIn 0.4s ease-out ${Math.min(index * 0.04, 0.5)}s both`,
      }}
      aria-label={`${member.name}, ${member.freeCompanyRank}`}
    >
      {/* Hover glow */}
      <div 
        className="
          absolute -inset-2 rounded-2xl blur-xl pointer-events-none
          opacity-0 group-hover:opacity-60
          transition-opacity duration-300
        "
        style={{ backgroundColor: config.glow }}
        aria-hidden="true"
      />
      
      <div 
        className="
          relative flex flex-col sm:flex-row gap-3 sm:gap-4
          p-3 sm:p-4 md:p-5
          bg-[var(--bento-card)]/90 backdrop-blur-sm
          border border-[var(--bento-border)] rounded-2xl
          shadow-sm hover:shadow-lg hover:border-[var(--bento-primary)]/20
          transition-all duration-200
        "
      >
        {/* Left side: Avatar with Lodestone link */}
        <a 
          href={lodestoneUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="
            relative flex-shrink-0 self-center sm:self-start
            focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none rounded-xl
          "
          aria-label={`View ${member.name}'s Lodestone profile (opens in new tab)`}
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shadow-md">
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
                w-full h-full object-cover 
                transition-all duration-300 ease-out
                group-hover:scale-105
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
            />
            
            {/* Hover overlay */}
            <div 
              className="
                absolute inset-0 
                bg-gradient-to-t from-black/70 to-transparent 
                flex items-end justify-center pb-1.5
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
              "
              aria-hidden="true"
            >
              <span className="flex items-center gap-1 px-2 py-0.5 bg-white/95 rounded-full text-[9px] font-soft font-bold text-gray-800 shadow-sm">
                <ExternalLink className="w-2 h-2" />
                Lodestone
              </span>
            </div>
          </div>
        </a>
        
        {/* Right side: Info & Bio */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          {/* Header row: Name + badges */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <h3 className="font-display font-bold text-sm sm:text-base md:text-lg text-[var(--bento-text)] truncate">
              {member.name}
            </h3>
            
            <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              {/* Rank badge */}
              <span className={`
                inline-flex items-center gap-1 sm:gap-1.5
                px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-soft font-semibold
                ${config.bg} ${config.color}
              `}>
                {member.freeCompanyRankIcon ? (
                  <img 
                    src={member.freeCompanyRankIcon} 
                    alt="" 
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                    aria-hidden="true"
                  />
                ) : (
                  <config.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
                )}
                {member.freeCompanyRank.replace('Moogle ', '')}
              </span>
              
              {/* New badge */}
              {member.recentlyPromoted && (
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-soft font-semibold bg-[var(--bento-secondary)]/15 text-[var(--bento-secondary)]">
                  New!
                </span>
              )}
            </div>
          </div>
          
          {/* Biography - the star of the show */}
          <p className="text-[var(--bento-text-muted)] font-soft text-xs sm:text-sm leading-relaxed">
            {member.biography || (
              <span className="italic opacity-75">Helping keep the FC magical, kupo~</span>
            )}
          </p>
          
          {/* Edit Bio button for current user */}
          {isCurrentUser && (
            <Link
              to="/profile"
              className="
                inline-flex items-center gap-1.5 mt-2.5 sm:mt-3
                px-2.5 py-1.5 rounded-lg
                bg-[var(--bento-primary)]/10 hover:bg-[var(--bento-primary)]/20
                text-[var(--bento-primary)] font-soft font-semibold text-xs
                transition-colors
                focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
              "
            >
              <Pencil className="w-3 h-3" aria-hidden="true" />
              Edit Your Bio
            </Link>
          )}
        </div>
      </div>
    </article>
  );
});

interface RankSectionProps {
  rank: string;
  members: StaffMember[];
  startIndex: number;
  currentUserName?: string;
}

/**
 * RankSection - Groups staff by rank with a stylized header
 * Uses a 2-column grid for horizontal leader cards
 */
const RankSection = memo(function RankSection({ rank, members, startIndex, currentUserName }: RankSectionProps) {
  const config = rankConfig[rank] || defaultRankConfig;
  const RankIcon = config.icon;

  return (
    <section className="mb-8 sm:mb-10 last:mb-0" aria-labelledby={`rank-${rank.replace(/\s+/g, '-').toLowerCase()}`}>
      {/* Rank header */}
      <motion.div
        className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: startIndex * 0.02 }}
      >
        <div 
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-lg shadow-black/10"
          style={{ backgroundColor: config.hexColor }}
        >
          <RankIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 
            id={`rank-${rank.replace(/\s+/g, '-').toLowerCase()}`}
            className="font-display font-bold text-base sm:text-lg text-[var(--bento-text)]"
          >
            {config.label}
          </h3>
          <p className="text-[10px] sm:text-xs text-[var(--bento-text-muted)] font-soft">
            {config.description}
          </p>
        </div>
        <span className={`
          flex-shrink-0 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-soft font-semibold
          ${config.bg} ${config.color}
        `}>
          {members.length} {members.length === 1 ? config.memberTerm.singular : config.memberTerm.plural}
        </span>
      </motion.div>

      {/* Members - responsive 1-2 column grid for horizontal cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {members.map((member, idx) => (
          <LeaderCard 
            key={member.characterId} 
            member={member} 
            index={startIndex + idx}
            isCurrentUser={currentUserName === member.name}
          />
        ))}
      </div>
    </section>
  );
});

export function About() {
  const { user, isAuthenticated } = useAuth();
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['staff'],
    queryFn: () => membersApi.getStaff(),
    staleTime: 1000 * 60 * 5,
  });
  
  // Get current user's name for highlighting their card
  const currentUserName = isAuthenticated ? user?.memberName : undefined;

  // Sort staff by rank order (same ordering as Members page)
  const staff = useMemo(() => {
    const rawStaff = data?.staff ?? [];
    return [...rawStaff].sort((a, b) => {
      const rankDiff = (RANK_ORDER.get(a.freeCompanyRank) ?? 999) - (RANK_ORDER.get(b.freeCompanyRank) ?? 999);
      return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name);
    });
  }, [data?.staff]);

  // Separate FC Leader from officers
  const { fcLeader, officers } = useMemo(() => {
    const leader = staff.find(m => m.freeCompanyRank === 'Moogle Guardian');
    const rest = staff.filter(m => m.freeCompanyRank !== 'Moogle Guardian');
    return { fcLeader: leader, officers: rest };
  }, [staff]);

  // Group officers by rank for sectioned display
  const officersByRank = useMemo(() => {
    const grouped = new Map<string, StaffMember[]>();
    for (const member of officers) {
      const existing = grouped.get(member.freeCompanyRank);
      if (existing) {
        existing.push(member);
      } else {
        grouped.set(member.freeCompanyRank, [member]);
      }
    }
    return grouped;
  }, [officers]);

  return (
    <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Background decorations - extends full viewport behind header/nav */}
      <div className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
      <SimpleFloatingMoogles primarySrc={wizardMoogle} secondarySrc={flyingMoogles} />
      <FloatingSparkles minimal />

      <div className="relative py-6 sm:py-8 md:py-12 px-3 sm:px-4 z-10">
        <div className="max-w-5xl mx-auto">
          {/* Page header */}
          <motion.header 
            className="text-center mb-6 sm:mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Decorative opener */}
            <motion.p
              className="font-accent text-lg sm:text-xl md:text-2xl text-[var(--bento-secondary)] mb-3 sm:mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              ~ The ones who guide us ~
            </motion.p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent">
                About Us
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--bento-text-muted)] font-soft flex items-center justify-center gap-2 mb-3 sm:mb-4">
              Meet the moogles keeping things magical
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
            </p>

            <StoryDivider className="mx-auto" size="sm" />
          </motion.header>

          {/* About section */}
          <motion.section
            className="mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <ContentCard className="text-center">
              <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-[var(--bento-text)] mb-3 sm:mb-4">
                Welcome to Kupo Life!
              </h2>
              <p className="text-[var(--bento-text-muted)] font-soft text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-3 sm:mb-4 px-1 sm:px-0">
                We're a cozy Free Company on the Crystal Data Center, where adventurers become family. 
                Whether you're new to Eorzea or a seasoned Warrior of Light, there's always a warm hearth 
                and friendly moogles waiting for you here.
              </p>
              <p className="font-accent text-lg sm:text-xl text-[var(--bento-secondary)]">
                ~ Kupo! ~
              </p>
            </ContentCard>
          </motion.section>

          {/* Leadership section */}
          <section aria-labelledby="leadership-heading">
            <motion.div
              className="flex items-center gap-3 px-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4 text-[var(--bento-primary)]" aria-hidden="true" />
              <h2 
                id="leadership-heading"
                className="text-sm font-soft font-semibold text-[var(--bento-primary)]"
              >
                Our Team
              </h2>
              {staff.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-soft font-medium bg-[var(--bento-primary)]/10 text-[var(--bento-primary)]">
                  {staff.length} members
                </span>
              )}
              <div className="flex-1 h-px bg-gradient-to-r from-[var(--bento-primary)]/30 to-transparent" aria-hidden="true" />
            </motion.div>

            {/* Staff list */}
            {isLoading ? (
              <ContentCard className="text-center py-16" aria-busy={true} aria-live="polite">
                <motion.img 
                  src={pushingMoogles} 
                  alt="" 
                  className="w-40 md:w-52 mx-auto mb-4"
                  animate={{ 
                    x: [0, 4, -4, 4, 0],
                    rotate: [0, 1.5, -1.5, 1.5, 0],
                  }}
                  transition={{ 
                    duration: 0.7, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  aria-hidden="true"
                />
                <motion.p 
                  className="font-accent text-2xl text-[var(--bento-text-muted)]"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  role="status"
                >
                  Gathering the leadership, kupo...
                </motion.p>
              </ContentCard>
            ) : isError ? (
              <ContentCard className="text-center py-12 md:py-16" role="alert">
                <img 
                  src={deadMoogle} 
                  alt="" 
                  className="w-40 h-40 mx-auto mb-5 object-contain"
                  aria-hidden="true"
                />
                <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">
                  Something went wrong
                </p>
                <p className="font-accent text-2xl text-[var(--bento-text-muted)] mb-6">
                  A moogle fell over, kupo...
                </p>
                <motion.button
                  onClick={() => refetch()}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="
                    inline-flex items-center justify-center gap-2
                    px-6 py-3 rounded-xl
                    bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)]
                    text-white font-soft font-semibold
                    shadow-lg shadow-[var(--bento-primary)]/25
                    hover:shadow-xl hover:shadow-[var(--bento-primary)]/30
                    transition-all cursor-pointer
                    focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bento-primary)] focus-visible:outline-none
                  "
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  Try Again
                </motion.button>
              </ContentCard>
            ) : staff.length === 0 ? (
              <ContentCard className="text-center py-12">
                <p className="font-accent text-xl text-[var(--bento-text-muted)]">
                  No leadership data available yet, kupo~
                </p>
              </ContentCard>
            ) : (
              <div className="space-y-10">
                {/* FC Leader - Featured prominently */}
                {fcLeader && (
                  <div className="max-w-xl mx-auto">
                    <FeaturedLeaderCard 
                      member={fcLeader} 
                      isCurrentUser={currentUserName === fcLeader.name}
                    />
                  </div>
                )}
                
                {/* Officers - Grouped by rank */}
                {officers.length > 0 && (
                  <div>
                    {(() => {
                      let runningIndex = 0;
                      return Array.from(officersByRank.entries()).map(([rank, members]) => {
                        const startIndex = runningIndex;
                        runningIndex += members.length;
                        return (
                          <RankSection
                            key={rank}
                            rank={rank}
                            members={members}
                            startIndex={startIndex}
                            currentUserName={currentUserName}
                          />
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Footer */}
          {!isLoading && !isError && staff.length > 0 && (
            <footer className="text-center mt-16 pt-8" style={{ paddingBottom: 'calc(2rem + var(--safe-area-inset-bottom, 0px))' }}>
              <StoryDivider className="mx-auto mb-6" size="sm" />
              <p className="font-accent text-xl text-[var(--bento-text-muted)] flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
                Leading with love, kupo!
                <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
              </p>
              <p className="font-accent text-lg text-[var(--bento-secondary)] mt-2">
                ~ fin ~
              </p>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

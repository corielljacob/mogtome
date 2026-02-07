import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ExternalLink, Crown, Pencil } from 'lucide-react';
import { membersApi } from '../api/members';
import { ContentCard, PageLayout, PageHeader, PageFooter, SectionLabel, LoadingState, ErrorState, EmptyState } from '../components';
import { getRankColor } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import type { StaffMember } from '../types';
import { FC_RANKS } from '../types';

// Rank order lookup for sorting (same as Members page)
const RANK_ORDER = new Map<string, number>(FC_RANKS.map((r, i) => [r.name, i]));

// Assets
import wizardMoogle from '../assets/moogles/wizard moogle.webp';
import flyingMoogles from '../assets/moogles/moogles flying.webp';
import moogleMail from '../assets/moogles/moogle mail.webp';

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
  
  const rankColor = getRankColor(member.freeCompanyRank);
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;
  
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <motion.article 
      className="group relative touch-manipulation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-label={`${member.name}, FC Leader`}
    >
      {/* Ambient glow - hidden on mobile for performance */}
      <div 
        className="
          absolute -inset-4 rounded-3xl blur-2xl pointer-events-none
          opacity-40 group-hover:opacity-60
          transition-opacity duration-500 hidden sm:block
        "
        style={{ backgroundColor: rankColor.glow }}
        aria-hidden="true"
      />
      
      <div 
        className="
          relative flex flex-col items-center text-center
          p-5 sm:p-6 md:p-8
          bg-[var(--bento-card)]/80 backdrop-blur-xl
          border-2 border-amber-400/30 rounded-3xl
          shadow-xl shadow-amber-500/10
          sm:hover:shadow-2xl sm:hover:border-amber-400/50
          active:scale-[0.98] sm:active:scale-100
          transition-all duration-300
        "
      >
        {/* Decorative crown accent */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2" aria-hidden="true">
          <div 
            className="px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2"
            style={{ backgroundColor: rankColor.hex, boxShadow: `0 10px 15px -3px ${rankColor.glow}` }}
          >
            <Crown className="w-4 h-4 text-white" />
            <span className="text-xs font-soft font-bold text-white uppercase tracking-wide">
              FC Leader
            </span>
          </div>
        </div>
        
        {/* Avatar - larger on mobile */}
        <a 
          href={lodestoneUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="
            relative mt-5 mb-4 sm:mt-4 sm:mb-4
            focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none rounded-2xl
          "
          aria-label={`View ${member.name}'s Lodestone profile (opens in new tab)`}
        >
          <div className="relative w-28 h-28 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-xl ring-4 ring-amber-400/20">
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
            
            {/* Mobile tap indicator */}
            <div 
              className="
                absolute bottom-2 right-2 sm:hidden
                flex items-center justify-center
                w-7 h-7 rounded-full
                bg-black/40 backdrop-blur-sm
              "
              aria-hidden="true"
            >
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </div>
            
            {/* Desktop hover overlay */}
            <div 
              className="
                absolute inset-0 hidden sm:flex
                bg-gradient-to-t from-black/70 to-transparent 
                items-end justify-center pb-2
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
        <h3 className="font-display font-bold text-xl sm:text-xl md:text-2xl text-[var(--bento-text)] mb-3">
          {member.name}
        </h3>
        
        {/* Biography - better line height on mobile */}
        <p className="text-[var(--bento-text-muted)] font-soft text-sm sm:text-base leading-relaxed max-w-md px-2 sm:px-0">
          {member.biography || (
            <span className="italic opacity-75">Leading Kupo Life with heart and dedication, kupo~</span>
          )}
        </p>
        
        {/* Edit Bio button for current user - larger touch target on mobile */}
        {isCurrentUser && (
          <Link
            to="/profile"
            className="
              inline-flex items-center gap-2 mt-4 sm:mt-4
              px-4 py-3 sm:px-3 sm:py-2 rounded-xl
              bg-amber-500/10 active:bg-amber-500/20 sm:hover:bg-amber-500/20
              text-amber-600 dark:text-amber-400 font-soft font-semibold text-sm
              transition-colors touch-manipulation
              focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none
            "
          >
            <Pencil className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
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
  
  const rankColor = getRankColor(member.freeCompanyRank);
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;
  
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <article 
      className="group relative touch-manipulation"
      style={{
        animation: `fadeSlideIn 0.4s ease-out ${Math.min(index * 0.04, 0.5)}s both`,
      }}
      aria-label={`${member.name}, ${member.freeCompanyRank}`}
    >
      {/* Hover glow - desktop only */}
      <div 
        className="
          absolute -inset-2 rounded-2xl blur-xl pointer-events-none
          opacity-0 sm:group-hover:opacity-60
          transition-opacity duration-300 hidden sm:block
        "
        style={{ backgroundColor: rankColor.glow }}
        aria-hidden="true"
      />
      
      <div 
        className="
          relative flex flex-row gap-4 sm:gap-4
          p-4 sm:p-4 md:p-5
          bg-[var(--bento-card)]/80 backdrop-blur-md
          border border-[var(--bento-border)] rounded-2xl
          shadow-sm sm:hover:shadow-lg sm:hover:border-[var(--bento-primary)]/20
          active:scale-[0.98] sm:active:scale-100
          transition-all duration-150
        "
      >
        {/* Left side: Avatar with Lodestone link */}
        <a 
          href={lodestoneUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="
            relative flex-shrink-0 self-start
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
            
            {/* Mobile tap indicator */}
            <div 
              className="
                absolute bottom-1 right-1 sm:hidden
                flex items-center justify-center
                w-5 h-5 rounded-full
                bg-black/40 backdrop-blur-sm
              "
              aria-hidden="true"
            >
              <ExternalLink className="w-2.5 h-2.5 text-white" />
            </div>
            
            {/* Desktop hover overlay */}
            <div 
              className="
                absolute inset-0 hidden sm:flex
                bg-gradient-to-t from-black/70 to-transparent 
                items-end justify-center pb-1.5
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
        <div className="flex-1 min-w-0 text-left">
          {/* Header row: Name + badges */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2">
            <h3 className="font-display font-bold text-base sm:text-base md:text-lg text-[var(--bento-text)] truncate">
              {member.name}
            </h3>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Rank badge - larger on mobile */}
              <span className={`
                inline-flex items-center gap-1.5
                px-2 py-1 sm:px-2 sm:py-0.5 rounded-full text-[11px] sm:text-xs font-soft font-semibold
                ${rankColor.bg} ${rankColor.text}
              `}>
                {member.freeCompanyRankIcon ? (
                  <img 
                    src={member.freeCompanyRankIcon} 
                    alt="" 
                    className="w-3 h-3 sm:w-3 sm:h-3"
                    aria-hidden="true"
                  />
                ) : (
                  <rankColor.icon className="w-3 h-3 sm:w-3 sm:h-3" aria-hidden="true" />
                )}
                {member.freeCompanyRank.replace('Moogle ', '')}
              </span>
              
              {/* New badge */}
              {member.recentlyPromoted && (
                <span className="px-2 py-1 sm:px-2 sm:py-0.5 rounded-full text-[11px] sm:text-xs font-soft font-semibold bg-[var(--bento-secondary)]/15 text-[var(--bento-secondary)]">
                  New!
                </span>
              )}
            </div>
          </div>
          
          {/* Biography - the star of the show - larger on mobile */}
          <p className="text-[var(--bento-text-muted)] font-soft text-sm sm:text-sm leading-relaxed">
            {member.biography || (
              <span className="italic opacity-75">Helping keep the FC magical, kupo~</span>
            )}
          </p>
          
          {/* Edit Bio button for current user */}
          {isCurrentUser && (
            <Link
              to="/profile"
              className="
                inline-flex items-center gap-2 mt-3 sm:mt-3
                px-3 py-2 sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-lg
                bg-[var(--bento-primary)]/10 active:bg-[var(--bento-primary)]/20 sm:hover:bg-[var(--bento-primary)]/20
                text-[var(--bento-primary)] font-soft font-semibold text-sm sm:text-xs
                transition-colors touch-manipulation
                focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
              "
            >
              <Pencil className="w-3.5 h-3.5 sm:w-3 sm:h-3" aria-hidden="true" />
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
  const rankColor = getRankColor(rank);
  const RankIcon = rankColor.icon;

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
          style={{ backgroundColor: rankColor.hex }}
        >
          <RankIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 
            id={`rank-${rank.replace(/\s+/g, '-').toLowerCase()}`}
            className="font-display font-bold text-base sm:text-lg text-[var(--bento-text)]"
          >
            {rankColor.label}
          </h3>
          <p className="text-[10px] sm:text-xs text-[var(--bento-text-muted)] font-soft">
            {rankColor.description}
          </p>
        </div>
        <span className={`
          flex-shrink-0 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-soft font-semibold
          ${rankColor.bg} ${rankColor.text}
        `}>
          {members.length} {members.length === 1 ? rankColor.memberTerm.singular : rankColor.memberTerm.plural}
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
    <PageLayout moogles={{ primary: wizardMoogle, secondary: flyingMoogles }} maxWidth="max-w-5xl">
          <PageHeader
            opener="~ The ones who guide us ~"
            title="About Us"
            subtitle="Meet the moogles keeping things magical"
          />

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
            <SectionLabel 
              label="Our Team"
              badge={staff.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-soft font-medium bg-[var(--bento-primary)]/10 text-[var(--bento-primary)]">
                  {staff.length} members
                </span>
              ) : undefined}
            />

            {/* Staff list */}
            {isLoading ? (
              <LoadingState message="Gathering the leadership, kupo..." />
            ) : isError ? (
              <ErrorState message="A moogle fell over, kupo..." onRetry={() => refetch()} />
            ) : staff.length === 0 ? (
              <EmptyState
                title="No leadership data"
                message="No leadership data available yet, kupo~"
                imageSrc={moogleMail}
              />
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

          {!isLoading && !isError && staff.length > 0 && (
            <PageFooter message="Leading with love, kupo!" />
          )}
    </PageLayout>
  );
}

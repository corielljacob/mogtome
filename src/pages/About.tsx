import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Heart, Sparkles, RefreshCw, Crown, Shield, Star } from 'lucide-react';
import { membersApi } from '../api/members';
import { StoryDivider, FloatingSparkles, SimpleFloatingMoogles, ContentCard } from '../components';
import type { StaffMember } from '../types';
import { FC_RANKS } from '../types';

// Rank order lookup for sorting (same as Members page)
const RANK_ORDER = new Map<string, number>(FC_RANKS.map((r, i) => [r.name, i]));

// Assets
import wizardMoogle from '../assets/moogles/wizard moogle.webp';
import flyingMoogles from '../assets/moogles/moogles flying.webp';
import pushingMoogles from '../assets/moogles/moogles pushing.webp';
import deadMoogle from '../assets/moogles/dead moogle.webp';

// Simple rank config - matches MemberCard patterns
const rankConfig: Record<string, { 
  icon: typeof Crown;
  color: string;
  bg: string;
}> = {
  'Moogle Guardian': { 
    icon: Crown,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  'Moogle Knight': { 
    icon: Shield,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
};

const defaultRankConfig = {
  icon: Star,
  color: 'text-[var(--bento-primary)]',
  bg: 'bg-[var(--bento-primary)]/10',
};

interface StaffCardProps {
  member: StaffMember;
  index?: number;
}

/**
 * StaffCard - Consistent card design matching the app's style
 */
const StaffCard = memo(function StaffCard({ member, index = 0 }: StaffCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const config = rankConfig[member.freeCompanyRank] || defaultRankConfig;
  const RankIcon = config.icon;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;
  
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <motion.article 
      className="group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      aria-label={`${member.name}, ${member.freeCompanyRank}`}
    >
      <div 
        className="
          relative flex gap-4 p-4 md:p-5
          bg-[var(--bento-card)]/80 backdrop-blur-sm
          border border-[var(--bento-border)] rounded-2xl
          shadow-sm hover:shadow-md hover:border-[var(--bento-primary)]/20
          transition-all duration-200
        "
      >
        {/* Avatar */}
        <a 
          href={lodestoneUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative flex-shrink-0 focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none rounded-xl"
          aria-label={`View ${member.name}'s Lodestone profile (opens in new tab)`}
        >
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shadow-md">
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
                bg-gradient-to-t from-black/60 to-transparent 
                flex items-end justify-center pb-1.5
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
              "
              aria-hidden="true"
            >
              <span className="flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full text-[10px] font-soft font-bold text-gray-800">
                <ExternalLink className="w-2.5 h-2.5" />
                Lodestone
              </span>
            </div>
          </div>
        </a>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Rank badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`
                  inline-flex items-center gap-1.5
                  px-2 py-0.5 rounded-full text-xs font-soft font-semibold
                  ${config.bg} ${config.color}
                `}>
                  {member.freeCompanyRankIcon ? (
                    <img 
                      src={member.freeCompanyRankIcon} 
                      alt="" 
                      className="w-3.5 h-3.5"
                      aria-hidden="true"
                    />
                  ) : (
                    <RankIcon className="w-3 h-3" aria-hidden="true" />
                  )}
                  {member.freeCompanyRank}
                </span>
                {member.recentlyPromoted && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-soft font-semibold bg-[var(--bento-secondary)]/10 text-[var(--bento-secondary)]">
                    New!
                  </span>
                )}
              </div>

              {/* Name */}
              <h3 className="font-display font-bold text-lg md:text-xl text-[var(--bento-text)] mb-1">
                {member.name}
              </h3>
              
              {/* Biography */}
              <p className="text-[var(--bento-text-muted)] font-soft text-sm leading-relaxed line-clamp-2">
                {member.biography || "Helping keep the FC magical, kupo~"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

export function About() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['staff'],
    queryFn: () => membersApi.getStaff(),
    staleTime: 1000 * 60 * 5,
  });

  // Sort staff by rank order (same ordering as Members page)
  const staff = useMemo(() => {
    const rawStaff = data?.staff ?? [];
    return [...rawStaff].sort((a, b) => {
      const rankDiff = (RANK_ORDER.get(a.freeCompanyRank) ?? 999) - (RANK_ORDER.get(b.freeCompanyRank) ?? 999);
      return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name);
    });
  }, [data?.staff]);

  return (
    <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Background decorations - extends full viewport behind header/nav */}
      <div className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
      <SimpleFloatingMoogles primarySrc={wizardMoogle} secondarySrc={flyingMoogles} />
      <FloatingSparkles minimal />

      <div className="relative py-8 md:py-12 px-4 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <motion.header 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Decorative opener */}
            <motion.p
              className="font-accent text-xl md:text-2xl text-[var(--bento-secondary)] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              ~ The ones who guide us ~
            </motion.p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3">
              <span className="bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent">
                About Us
              </span>
            </h1>

            <p className="text-lg text-[var(--bento-text-muted)] font-soft flex items-center justify-center gap-2 mb-4">
              Meet the moogles keeping things magical
              <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
            </p>

            <StoryDivider className="mx-auto" size="sm" />
          </motion.header>

          {/* About section */}
          <motion.section
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <ContentCard className="text-center">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-[var(--bento-text)] mb-4">
                Welcome to Kupo Life!
              </h2>
              <p className="text-[var(--bento-text-muted)] font-soft text-lg leading-relaxed max-w-2xl mx-auto mb-4">
                We're a cozy Free Company on the Crystal Data Center, where adventurers become family. 
                Whether you're new to Eorzea or a seasoned Warrior of Light, there's always a warm hearth 
                and friendly moogles waiting for you here.
              </p>
              <p className="font-accent text-xl text-[var(--bento-secondary)]">
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
                Our Leadership
              </h2>
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
              <div className="space-y-4">
                {staff.map((member, index) => (
                  <StaffCard 
                    key={member.characterId} 
                    member={member} 
                    index={index} 
                  />
                ))}
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

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, Crown, Pencil, 
  Users, Swords, Heart, PartyPopper,
  Handshake, Sun, BookOpen, MessageCircleHeart,
  Quote, CalendarDays, Sparkles
} from 'lucide-react';
import { membersApi } from '../api/members';
import { ContentCard, PageLayout, PageHeader, PageFooter, SectionLabel, LoadingState, ErrorState, EmptyState, StoryDivider, SpotlightCard } from '../components';
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
import illustratedMoogle from '../assets/moogles/illustrated moogle.webp';

// ─────────────────────────────────────────────────────────────────────────────
// Value pillars for the FC — displayed as a feature grid
// ─────────────────────────────────────────────────────────────────────────────

const FC_VALUES = [
  {
    icon: Users,
    title: 'Welcoming Community',
    description: 'New or veteran, sprout or mentor — everyone finds a home here.',
    color: 'var(--bento-primary)',
  },
  {
    icon: Swords,
    title: 'All Playstyles',
    description: 'Raiding, crafting, glamour, housing — we do it all, kupo!',
    color: 'var(--bento-secondary)',
  },
  {
    icon: PartyPopper,
    title: 'Regular Events',
    description: 'Screenshot contests, treasure hunts, giveaways, and more.',
    color: 'var(--bento-accent)',
  },
  {
    icon: Handshake,
    title: 'Helpful Mentors',
    description: 'Friendly officers ready to guide you through any content.',
    color: 'var(--bento-primary)',
  },
  {
    icon: Sun,
    title: 'Cozy Atmosphere',
    description: 'A drama-free, positive space to relax after a long day.',
    color: 'var(--bento-secondary)',
  },
  {
    icon: MessageCircleHeart,
    title: 'Active Discord',
    description: 'Stay connected with FC mates even when you\'re not in-game.',
    color: 'var(--bento-accent)',
  },
] as const;

// Varied placeholder bios for officers without one
const PLACEHOLDER_BIOS = [
  'Helping keep the FC magical, kupo~',
  'Dedicated to making everyone\'s adventure brighter!',
  'Always ready to lend a helping paw, kupo~',
  'Keeping the good vibes flowing since day one!',
  'A pillar of the Kupo Life community~',
  'Making Eorzea a cozier place, one day at a time!',
];

function getPlaceholderBio(index: number): string {
  return PLACEHOLDER_BIOS[index % PLACEHOLDER_BIOS.length];
}

/** Format a date string into a readable "Joined Mon YYYY" label */
function formatPromotionDate(dateStr?: string): string | null {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface StaffCardProps {
  member: StaffMember;
  index?: number;
  isCurrentUser?: boolean;
}

/**
 * ValueCard - A single FC value/pillar displayed in the feature grid
 */
const ValueCard = memo(function ValueCard({ 
  icon: Icon, title, description, color, index 
}: typeof FC_VALUES[number] & { index: number }) {
  return (
    <SpotlightCard
      spotlightColor={`color-mix(in srgb, ${color} 15%, transparent)`}
      className="rounded-2xl"
    >
      <motion.div
        className="
          relative h-full
          p-5 sm:p-6
          bg-[var(--bento-card)]/60
          border border-[var(--bento-border)]
          rounded-2xl
          transition-colors duration-300
        "
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
      >
        {/* Icon circle */}
        <div 
          className="
            w-11 h-11 sm:w-12 sm:h-12 rounded-xl mb-4
            flex items-center justify-center
            shadow-lg shadow-black/5
          "
          style={{ 
            backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
          }}
        >
          <Icon 
            className="w-5 h-5 sm:w-6 sm:h-6" 
            style={{ color }} 
            aria-hidden="true" 
          />
        </div>

        <h3 className="font-display font-bold text-base sm:text-lg text-[var(--bento-text)] mb-1.5">
          {title}
        </h3>
        <p className="font-soft text-sm text-[var(--bento-text-muted)] leading-relaxed">
          {description}
        </p>
      </motion.div>
    </SpotlightCard>
  );
});

/**
 * FeaturedLeaderCard - Grand showcase card for the FC Leader (Moogle Guardian)
 * Full-width with large avatar, decorative accents, and prominent bio
 */
const FeaturedLeaderCard = memo(function FeaturedLeaderCard({ member, isCurrentUser = false }: { member: StaffMember; isCurrentUser?: boolean }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const rankColor = getRankColor(member.freeCompanyRank);
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;
  const promotionLabel = formatPromotionDate(member.promotionDate);
  
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <motion.article 
      className="group relative touch-manipulation"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      aria-label={`${member.name}, FC Leader`}
    >
      {/* Ambient glow */}
      <div 
        className="
          absolute -inset-6 rounded-[2rem] blur-3xl pointer-events-none
          opacity-30 group-hover:opacity-50
          transition-opacity duration-700 hidden sm:block
        "
        style={{ background: `radial-gradient(ellipse at center, ${rankColor.glow}, transparent 70%)` }}
        aria-hidden="true"
      />
      
      <SpotlightCard
        spotlightColor="rgba(255, 255, 255, 0.06)"
        spotlightSize={500}
        className="rounded-3xl"
      >
        <div 
          className="
            relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8
            p-6 sm:p-8 md:p-10
            bg-[var(--bento-card)]/80
            border-2 rounded-3xl
            shadow-xl
            sm:hover:shadow-2xl
            active:scale-[0.99] sm:active:scale-100
            transition-all duration-300
            overflow-hidden
          "
          style={{ 
            borderColor: `color-mix(in srgb, ${rankColor.hex} 30%, transparent)`,
            boxShadow: `0 20px 40px -12px ${rankColor.glow.replace('0.4', '0.15')}`,
          }}
        >
          {/* Background decorative pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" aria-hidden="true">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 30%, ${rankColor.hex}, transparent 50%), radial-gradient(circle at 80% 70%, var(--bento-secondary), transparent 50%)`,
              }}
            />
          </div>

          {/* Crown badge - floats at top on mobile, top-right on desktop */}
          <div className="sm:absolute sm:top-5 sm:right-6 z-10" aria-hidden="true">
            <div 
              className="px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
              style={{ backgroundColor: rankColor.hex, boxShadow: `0 8px 20px -4px ${rankColor.glow}` }}
            >
              <Crown className="w-4 h-4 text-white" />
              <span className="text-xs font-soft font-bold text-white uppercase tracking-wider">
                FC Leader
              </span>
            </div>
          </div>

          {/* Avatar column */}
          <a 
            href={lodestoneUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="
              relative flex-shrink-0
              focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none rounded-2xl
            "
            aria-label={`View ${member.name}'s Lodestone profile (opens in new tab)`}
          >
            <div 
              className="
                relative w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 
                rounded-2xl overflow-hidden shadow-2xl
              "
              style={{ 
                boxShadow: `0 20px 40px -8px ${rankColor.glow.replace('0.4', '0.3')}`,
              }}
            >
              {/* Animated ring */}
              <div 
                className="absolute -inset-[3px] rounded-2xl z-[-1]"
                style={{
                  background: `linear-gradient(135deg, ${rankColor.hex}, transparent 40%, transparent 60%, ${rankColor.hex})`,
                  opacity: 0.5,
                }}
                aria-hidden="true"
              />

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
                  transition-all duration-500 ease-out
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
                  bg-gradient-to-t from-black/70 via-transparent to-transparent 
                  items-end justify-center pb-3
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                "
                aria-hidden="true"
              >
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 rounded-full text-xs font-soft font-bold text-gray-800 shadow-md">
                  <ExternalLink className="w-3 h-3" />
                  Lodestone
                </span>
              </div>
            </div>
          </a>
          
          {/* Info column */}
          <div className="flex-1 min-w-0 text-center sm:text-left sm:pt-1">
            {/* Name */}
            <h3 className="font-display font-bold text-2xl sm:text-2xl md:text-3xl text-[var(--bento-text)] mb-1">
              {member.name}
            </h3>

            {/* Meta row: Rank title + promotion date */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
              <span 
                className="font-soft font-semibold text-sm"
                style={{ color: rankColor.hex }}
              >
                Moogle Guardian
              </span>
              {promotionLabel && (
                <>
                  <span className="text-[var(--bento-text-muted)]/40 hidden sm:inline" aria-hidden="true">&middot;</span>
                  <span className="flex items-center gap-1 text-xs text-[var(--bento-text-muted)] font-soft">
                    <CalendarDays className="w-3 h-3" aria-hidden="true" />
                    Since {promotionLabel}
                  </span>
                </>
              )}
            </div>

            {/* Biography with decorative quote marks */}
            <div className="relative">
              <Quote 
                className="absolute -top-1 -left-1 sm:-left-2 w-5 h-5 sm:w-6 sm:h-6 opacity-15 rotate-180" 
                style={{ color: rankColor.hex }}
                aria-hidden="true" 
              />
              <p className="text-[var(--bento-text-muted)] font-soft text-sm sm:text-base md:text-lg leading-relaxed pl-4 sm:pl-5 max-w-lg">
                {member.biography || (
                  <span className="italic opacity-75">Leading Kupo Life with heart and dedication, kupo~</span>
                )}
              </p>
            </div>
            
            {/* Edit Bio button for current user */}
            {isCurrentUser && (
              <Link
                to="/profile"
                className="
                  inline-flex items-center gap-2 mt-5
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
        </div>
      </SpotlightCard>
    </motion.article>
  );
});

/**
 * OfficerCard - Vertical card with large avatar, rank flair, and bio section.
 * Unified design language with the FeaturedLeaderCard.
 */
const OfficerCard = memo(function OfficerCard({ member, index = 0, isCurrentUser = false }: StaffCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const rankColor = getRankColor(member.freeCompanyRank);
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;
  const promotionLabel = formatPromotionDate(member.promotionDate);
  
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <SpotlightCard
      spotlightColor={`${rankColor.glow.replace('0.4', '0.08')}`}
      spotlightSize={400}
      className="rounded-2xl"
    >
      <motion.article 
        className="group/card relative touch-manipulation h-full"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.4) }}
        aria-label={`${member.name}, ${member.freeCompanyRank}`}
      >
        <div 
          className="
            relative flex flex-col items-center text-center h-full
            p-5 sm:p-6
            bg-[var(--bento-card)]/80
            border rounded-2xl
            shadow-sm
            sm:hover:shadow-xl
            active:scale-[0.98] sm:active:scale-100
            transition-all duration-300
            overflow-hidden
          "
          style={{ 
            borderColor: `color-mix(in srgb, ${rankColor.hex} 15%, var(--bento-border))`,
          }}
        >
          {/* Top gradient accent bar */}
          <div 
            className="absolute top-0 inset-x-0 h-1 rounded-t-2xl"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${rankColor.hex}, transparent)`,
              opacity: 0.5,
            }}
            aria-hidden="true"
          />

          {/* Subtle background radial */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-[0.04] pointer-events-none"
            style={{ backgroundColor: rankColor.hex }}
            aria-hidden="true"
          />

          {/* Avatar */}
          <a 
            href={lodestoneUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="
              relative mt-2 mb-4
              focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none rounded-xl
            "
            aria-label={`View ${member.name}'s Lodestone profile (opens in new tab)`}
          >
            <div 
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shadow-lg"
              style={{ 
                boxShadow: `0 12px 24px -6px ${rankColor.glow.replace('0.4', '0.2')}`,
              }}
            >
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
                  group-hover/card:scale-110
                  ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                `}
              />
              
              {/* Mobile tap indicator */}
              <div 
                className="
                  absolute bottom-1.5 right-1.5 sm:hidden
                  flex items-center justify-center
                  w-6 h-6 rounded-full
                  bg-black/40 backdrop-blur-sm
                "
                aria-hidden="true"
              >
                <ExternalLink className="w-3 h-3 text-white" />
              </div>
              
              {/* Desktop hover overlay */}
              <div 
                className="
                  absolute inset-0 hidden sm:flex
                  bg-gradient-to-t from-black/70 via-transparent to-transparent 
                  items-end justify-center pb-2
                  opacity-0 group-hover/card:opacity-100
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
          <h3 className="font-display font-bold text-lg sm:text-xl text-[var(--bento-text)] mb-2">
            {member.name}
          </h3>
          
          {/* Badges row */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
            {/* Rank badge */}
            <span 
              className="
                inline-flex items-center gap-1.5
                px-2.5 py-1 rounded-full text-xs font-soft font-semibold
              "
              style={{
                backgroundColor: `color-mix(in srgb, ${rankColor.hex} 12%, transparent)`,
                color: rankColor.hex,
              }}
            >
              {member.freeCompanyRankIcon ? (
                <img 
                  src={member.freeCompanyRankIcon} 
                  alt="" 
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                />
              ) : (
                <rankColor.icon className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {member.freeCompanyRank.replace('Moogle ', '')}
            </span>
            
            {/* Recently promoted */}
            {member.recentlyPromoted && (
              <span className="
                inline-flex items-center gap-1
                px-2 py-1 rounded-full text-xs font-soft font-semibold 
                bg-[var(--bento-secondary)]/12 text-[var(--bento-secondary)]
              ">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                New!
              </span>
            )}
          </div>

          {/* Promotion date */}
          {promotionLabel && (
            <p className="flex items-center justify-center gap-1 text-[11px] text-[var(--bento-text-muted)]/70 font-soft mb-3">
              <CalendarDays className="w-3 h-3" aria-hidden="true" />
              Since {promotionLabel}
            </p>
          )}
          
          {/* Divider */}
          <div 
            className="w-10 h-px rounded-full mb-3 opacity-25"
            style={{ backgroundColor: rankColor.hex }}
            aria-hidden="true"
          />

          {/* Biography */}
          <p className="text-[var(--bento-text-muted)] font-soft text-sm leading-relaxed flex-1 px-1">
            {member.biography || (
              <span className="italic opacity-60">{getPlaceholderBio(index)}</span>
            )}
          </p>
          
          {/* Edit Bio button for current user */}
          {isCurrentUser && (
            <Link
              to="/profile"
              className="
                inline-flex items-center gap-2 mt-4
                px-3 py-2 rounded-xl
                bg-[var(--bento-primary)]/10 active:bg-[var(--bento-primary)]/20 sm:hover:bg-[var(--bento-primary)]/20
                text-[var(--bento-primary)] font-soft font-semibold text-sm
                transition-colors touch-manipulation
                focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
              "
            >
              <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
              Edit Your Bio
            </Link>
          )}
        </div>
      </motion.article>
    </SpotlightCard>
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
 * Uses a responsive grid of vertical officer cards
 */
const RankSection = memo(function RankSection({ rank, members, startIndex, currentUserName }: RankSectionProps) {
  const rankColor = getRankColor(rank);
  const RankIcon = rankColor.icon;

  return (
    <section className="mb-10 sm:mb-12 last:mb-0" aria-labelledby={`rank-${rank.replace(/\s+/g, '-').toLowerCase()}`}>
      {/* Rank header */}
      <motion.div
        className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div 
          className="
            w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center 
            shadow-lg shadow-black/10
          "
          style={{ backgroundColor: rankColor.hex }}
        >
          <RankIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 
            id={`rank-${rank.replace(/\s+/g, '-').toLowerCase()}`}
            className="font-display font-bold text-lg sm:text-xl text-[var(--bento-text)]"
          >
            {rankColor.label}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--bento-text-muted)] font-soft">
            {rankColor.description}
          </p>
        </div>
        <span 
          className="
            flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-soft font-semibold
          "
          style={{
            backgroundColor: `color-mix(in srgb, ${rankColor.hex} 12%, transparent)`,
            color: rankColor.hex,
          }}
        >
          {members.length} {members.length === 1 ? rankColor.memberTerm.singular : rankColor.memberTerm.plural}
        </span>
      </motion.div>

      {/* Members - responsive grid of vertical cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {members.map((member, idx) => (
          <OfficerCard 
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

// ─────────────────────────────────────────────────────────────────────────────
// Main About Page
// ─────────────────────────────────────────────────────────────────────────────

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

      {/* ── Welcome Hero Section ──────────────────────────────────────── */}
      <motion.section
        className="mb-10 sm:mb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <ContentCard className="relative overflow-hidden text-center">
          {/* Subtle gradient background accent */}
          <div 
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 30% 20%, var(--bento-primary), transparent 60%), radial-gradient(ellipse at 70% 80%, var(--bento-secondary), transparent 60%)',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            {/* Decorative moogle */}
            <motion.img
              src={illustratedMoogle}
              alt=""
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 object-contain drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 200 }}
              aria-hidden="true"
            />

            <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-[var(--bento-text)] mb-3 sm:mb-4">
              Welcome to Kupo Life!
            </h2>
            <p className="text-[var(--bento-text-muted)] font-soft text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-2 px-1 sm:px-0">
              We're a cozy Free Company on <strong className="text-[var(--bento-text)] font-semibold">Zalera</strong>, part of the <strong className="text-[var(--bento-text)] font-semibold">Crystal Data Center</strong>, where adventurers become family. 
              Whether you're new to Eorzea or a seasoned Warrior of Light, there's always a warm hearth 
              and friendly moogles waiting for you here.
            </p>
            <p className="font-accent text-lg sm:text-xl text-[var(--bento-secondary)]">
              ~ Kupo! ~
            </p>
          </div>
        </ContentCard>
      </motion.section>

      {/* ── FC Values / Feature Grid ──────────────────────────────────── */}
      <motion.section 
        className="mb-10 sm:mb-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.3 }}
        aria-labelledby="values-heading"
      >
        <SectionLabel 
          label="What We're About"
          icon={<BookOpen className="w-4 h-4 text-[var(--bento-primary)]" aria-hidden="true" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {FC_VALUES.map((value, idx) => (
            <ValueCard key={value.title} {...value} index={idx} />
          ))}
        </div>
      </motion.section>

      {/* ── Visual break ──────────────────────────────────────────────── */}
      <div className="flex justify-center mb-10 sm:mb-14">
        <StoryDivider size="md" />
      </div>

      {/* ── Leadership Section ────────────────────────────────────────── */}
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
          <div className="space-y-10 sm:space-y-12">
            {/* FC Leader - Featured prominently */}
            {fcLeader && (
              <FeaturedLeaderCard 
                member={fcLeader} 
                isCurrentUser={currentUserName === fcLeader.name}
              />
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

      {/* ── Join Us CTA ───────────────────────────────────────────────── */}
      {!isLoading && !isError && (
        <motion.section
          className="mt-14 sm:mt-16 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          aria-labelledby="join-heading"
        >
          <ContentCard className="relative overflow-hidden text-center">
            {/* Gradient accent */}
            <div 
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, var(--bento-primary), transparent 70%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              <Heart 
                className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-[var(--bento-primary)] fill-[var(--bento-primary)]" 
                aria-hidden="true" 
              />
              <h2 
                id="join-heading"
                className="font-display font-bold text-xl sm:text-2xl text-[var(--bento-text)] mb-2"
              >
                Want to Join the Family?
              </h2>
              <p className="text-[var(--bento-text-muted)] font-soft text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-5">
                We're always looking for new friends! If Kupo Life sounds like home, 
                come say hi in our Discord or find us on Zalera.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/members"
                  className="
                    inline-flex items-center justify-center gap-2
                    px-6 py-3 rounded-xl
                    bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)]
                    text-white font-soft font-semibold text-sm
                    shadow-lg shadow-[var(--bento-primary)]/25
                    hover:shadow-xl hover:shadow-[var(--bento-primary)]/30
                    hover:brightness-110
                    active:scale-[0.97]
                    transition-all duration-200
                    touch-manipulation
                    focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bento-primary)] focus-visible:outline-none
                  "
                >
                  <Users className="w-4 h-4" aria-hidden="true" />
                  Meet Our Members
                </Link>
              </div>
            </div>
          </ContentCard>
        </motion.section>
      )}

      {!isLoading && !isError && staff.length > 0 && (
        <PageFooter message="Leading with love, kupo!" />
      )}
    </PageLayout>
  );
}

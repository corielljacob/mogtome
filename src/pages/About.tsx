import { memo, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Heart, Quote } from 'lucide-react';
import { membersApi } from '../api/members';
import { PageLayout, PageHeader, PageFooter, SectionLabel, LoadingState, ErrorState, EmptyState, StoryDivider, Tag } from '../components';
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
// StaffCard - compact, uniform card for a single staff member.
// Deliberately quiet: small avatar, name, a rank tag, and an optional one-line
// bio. The FC leader gets only a soft "leads Kupo Life" note, no showcase.
// ─────────────────────────────────────────────────────────────────────────────

const StaffCard = memo(function StaffCard({
  member,
  isLeader = false,
  isCurrentUser = false,
}: {
  member: StaffMember;
  isLeader?: boolean;
  isCurrentUser?: boolean;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const rankColor = getRankColor(member.freeCompanyRank);
  const RankIcon = rankColor.icon;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;

  return (
    <motion.article
      className="surface hover-lift flex flex-col items-center text-center p-4 h-full"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.35 }}
    >
      {/* Avatar (links to the Lodestone, kept subtle) */}
      <a
        href={lodestoneUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group/avatar relative rounded-full focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
        aria-label={`${member.name} on the Lodestone (opens in new tab)`}
      >
        <div
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden"
          style={{ boxShadow: `0 0 0 2px color-mix(in srgb, ${rankColor.hex} 35%, transparent)` }}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--card)] to-[var(--bg)] animate-shimmer" aria-hidden="true" />
          )}
          <img
            src={member.avatarLink}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
        <span
          className="absolute -bottom-0.5 -right-0.5 opacity-0 group-hover/avatar:opacity-100 transition-opacity"
          aria-hidden="true"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
        </span>
      </a>

      {/* Name */}
      <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text)] mt-3 max-w-full truncate">
        {member.name}
      </h3>

      {/* Rank */}
      <Tag
        color={rankColor.hex}
        icon={<RankIcon className="w-3 h-3" aria-hidden="true" />}
        className="mt-1.5"
      >
        {member.freeCompanyRank.replace('Moogle ', '')}
      </Tag>

      {isLeader && (
        <p className="text-[11px] text-[var(--text-subtle)] font-soft mt-1">leads Kupo Life</p>
      )}

      {/* Optional bio (no placeholders) */}
      {member.biography && (
        <p className="text-xs text-[var(--text-muted)] font-soft leading-relaxed mt-2 line-clamp-2">
          {member.biography}
        </p>
      )}

      {isCurrentUser && (
        <p className="text-[10px] text-[var(--primary)] font-soft mt-2">that's you, kupo</p>
      )}
    </motion.article>
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

  const currentUserName = isAuthenticated ? user?.memberName : undefined;

  // Sort staff by rank order (leader first), then name
  const staff = useMemo(() => {
    const rawStaff = data?.staff ?? [];
    return [...rawStaff].sort((a, b) => {
      const rankDiff = (RANK_ORDER.get(a.freeCompanyRank) ?? 999) - (RANK_ORDER.get(b.freeCompanyRank) ?? 999);
      return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name);
    });
  }, [data?.staff]);

  const leaderName = useMemo(
    () => staff.find(m => m.freeCompanyRank === 'Moogle Guardian')?.name,
    [staff]
  );

  const hasStaff = !isLoading && !isError && staff.length > 0;

  return (
    <PageLayout moogles={{ primary: wizardMoogle, secondary: flyingMoogles }} maxWidth="max-w-5xl">
      <PageHeader opener="~ pull up a chair, kupo ~" title="Who We Are" />

      {/* ── What we are: a warm, general intro ─────────────────────────── */}
      <motion.section
        className="mb-12 sm:mb-16 max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.img
          src={illustratedMoogle}
          alt=""
          className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 object-contain drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25, type: 'spring', stiffness: 200 }}
          aria-hidden="true"
        />

        <div className="space-y-4 text-[var(--text-muted)] font-soft text-base sm:text-lg leading-relaxed">
          <p>
            Kupo Life is a cozy Free Company on{' '}
            <strong className="text-[var(--text)] font-semibold">Zalera</strong>, over in the{' '}
            <strong className="text-[var(--text)] font-semibold">Crystal</strong> data center.
            More than anything, it's a place to log in and not be alone, kupo.
          </p>
          <p>
            There's no quota to hit and no pressure to perform. Raid if you raid, craft if you craft,
            or park a retainer and just chat. Whatever you're into, odds are someone here is into it too.
          </p>
          <p>
            We do the occasional silly thing, screenshot competitions, treasure hunts, a giveaway here and there,
            and the Discord stays lively even when the servers are down. Mostly though, it's just home.
          </p>
        </div>

        {/* Pull-quote */}
        <figure className="mt-9">
          <Quote className="w-6 h-6 mx-auto mb-2 text-[var(--primary)]/40 rotate-180" aria-hidden="true" />
          <p className="font-accent text-2xl sm:text-3xl text-[var(--secondary)] leading-snug">
            A warm corner of Eorzea to come back to, kupo.
          </p>
        </figure>
      </motion.section>

      <div className="flex justify-center mb-10 sm:mb-14">
        <StoryDivider size="md" />
      </div>

      {/* ── The people ─────────────────────────────────────────────────── */}
      <section>
        <SectionLabel
          label="The folks who keep it cozy"
          icon={<Heart className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />}
          badge={staff.length > 0 ? <Tag color="var(--primary)">{staff.length}</Tag> : undefined}
        />

        {isLoading ? (
          <LoadingState message="Rounding everyone up, kupo..." />
        ) : isError ? (
          <ErrorState message="A moogle fell over, kupo..." onRetry={() => refetch()} />
        ) : staff.length === 0 ? (
          <EmptyState
            title="Nobody home yet"
            message="No one to show just yet, kupo~"
            imageSrc={moogleMail}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {staff.map((member) => (
              <StaffCard
                key={member.characterId}
                member={member}
                isLeader={member.name === leaderName}
                isCurrentUser={currentUserName === member.name}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Quiet close (members already belong here, no recruitment) ───── */}
      {hasStaff && (
        <motion.p
          className="flex items-center justify-center gap-2 text-center font-accent text-xl sm:text-2xl text-[var(--text-muted)] mt-14 sm:mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <Heart className="w-5 h-5 shrink-0 text-[var(--primary)] fill-[var(--primary)]" aria-hidden="true" />
          However long you've been here, we're glad you're part of it, kupo.
        </motion.p>
      )}

      {hasStaff && <PageFooter message="Glad you're here, kupo!" />}
    </PageLayout>
  );
}

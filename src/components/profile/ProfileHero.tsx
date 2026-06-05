import { Globe } from "lucide-react";
import { Tag } from "@/shared/ui/Tag";
import { getRankColor } from "@/constants/rankColors";
import { formatMemberSince } from "@/shared/lib/dateFormatters";
import type { ProfileData } from "@/types";

interface ProfileHeroProps {
  profile: ProfileData;
}

// identity is read-only (sourced from FFXIV/Discord); only the bio, in its own
// section below, is editable
export function ProfileHero({ profile }: ProfileHeroProps) {
  const rankColor = getRankColor(profile.rank);
  const RankIcon = rankColor.icon;
  const since = profile.memberSince
    ? formatMemberSince(profile.memberSince)
    : null;

  return (
    <section className="relative w-fit mx-auto animate-[fadeSlideIn_0.4s_ease-out]">
      <span
        className="pushpin absolute -top-2 left-1/2 -translate-x-1/2 z-10"
        aria-hidden="true"
      />
      <div className="surface paper -rotate-1 p-3 sm:p-4 w-[16.5rem] sm:w-80">
        <div className="relative">
          <img
            src={profile.avatarUrl}
            alt=""
            className="w-full aspect-square rounded-xl object-cover border-2 border-[color:color-mix(in_srgb,var(--primary)_16%,var(--card))]"
          />
          <div
            className="absolute top-2 left-2 flex items-center justify-center w-8 h-8 rounded-full shadow-sm"
            style={{
              backgroundColor: `color-mix(in srgb, ${rankColor.hex} 22%, var(--card))`,
              border: `2px solid color-mix(in srgb, ${rankColor.hex} 36%, var(--card))`,
            }}
            aria-hidden="true"
          >
            <RankIcon className="w-4 h-4" style={{ color: rankColor.hex }} />
          </div>
          {profile.lodestoneUrl && (
            <a
              href={profile.lodestoneUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
              aria-label={`View ${profile.name} on the Lodestone (opens in a new tab)`}
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </div>

        <div className="pt-3 pb-1 text-center">
          <h1 className="font-display font-bold text-xl sm:text-2xl text-[var(--text)] leading-tight">
            {profile.name}
          </h1>
          <div className="mt-2 flex justify-center">
            <Tag
              color={rankColor.hex}
              icon={<RankIcon className="w-3 h-3" aria-hidden="true" />}
            >
              {profile.rank}
            </Tag>
          </div>
          {since && (
            <p className="mt-2.5 font-accent text-lg text-[var(--text-muted)]">
              MogTome member since {since}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

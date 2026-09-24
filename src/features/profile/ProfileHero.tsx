import { Globe } from "lucide-react";
import profileMoogle from "@/assets/moogles/moogle playing music.webp";
import { Tag } from "@/shared/ui/Tag";
import { getRankColor } from "@/shared/constants/rankColors";
import { formatMemberSince } from "@/shared/lib/dateFormatters";
import type { ProfileData } from "@/shared/types";

interface ProfileHeroProps {
  profile: ProfileData;
}

// Identity is sourced from FFXIV/Discord; biography editing lives below.
export function ProfileHero({ profile }: ProfileHeroProps) {
  const rankColor = getRankColor(profile.rank);
  const RankIcon = rankColor.icon;
  const since = profile.memberSince
    ? formatMemberSince(profile.memberSince)
    : null;
  return (
    <section className="journal-profile-hero">
      <span className="journal-header-tape" aria-hidden="true" />
      <div className="journal-profile-portrait">
        <span className="journal-auth-tape" aria-hidden="true" />
        <img src={profile.avatarUrl} alt="" />
      </div>
      <div className="journal-profile-identity">
        <h1>{profile.name}</h1>
        <Tag
          color={rankColor.hex}
          icon={<RankIcon className="w-3 h-3" aria-hidden="true" />}
        >
          {profile.rank}
        </Tag>
        {since && (
          <p className="journal-profile-since">MogTome member since {since}</p>
        )}
        {profile.lodestoneUrl && (
          <a
            href={profile.lodestoneUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="journal-profile-link"
            aria-label={`View ${profile.name} on the Lodestone (opens in a new tab)`}
          >
            <Globe size={14} aria-hidden="true" />
            Visit the Lodestone<span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
      <img
        className="journal-profile-moogle"
        src={profileMoogle}
        alt=""
        aria-hidden="true"
      />
      <span className="journal-profile-heart" aria-hidden="true">
        ♡
      </span>
    </section>
  );
}

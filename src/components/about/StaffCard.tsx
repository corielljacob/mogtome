import { memo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Tag } from "@/shared/ui/Tag";
import { KawaiiSparkle } from "@/shared/ui/kawaiiMotifs";
import { getRankColor } from "@/constants/rankColors";
import type { StaffMember } from "@/types";
import { StickyBioNote } from "@/components/about/StickyBioNote";

// deterministic per-member tilt, stable across renders (a hash, not Math.random,
// so it never jitters). photo + note tilt independently in both directions for a
// messy hand-pinned scatter rather than an orderly opposing lean.
function scrapbookTilt(seed: string): { photo: number; note: number } {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h >>>= 0;
  return {
    photo: ((h % 1000) / 1000) * 11 - 5.5, // ≈ -5.5 .. +5.5
    note: (((h >>> 11) % 1000) / 1000) * 11 - 5.5, // ≈ -5.5 .. +5.5
  };
}

export const StaffCard = memo(function StaffCard({
  member,
  isLeader = false,
  isCurrentUser = false,
  isOwnEditable = false,
}: {
  member: StaffMember;
  isLeader?: boolean;
  isCurrentUser?: boolean;
  isOwnEditable?: boolean;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const rankColor = getRankColor(member.freeCompanyRank);
  const RankIcon = rankColor.icon;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;
  const shortRank = member.freeCompanyRank.replace("Moogle ", "");
  const tilt = scrapbookTilt(member.characterId);

  return (
    <article className="relative flex items-start">
      {/* polaroid */}
      <a
        href={lodestoneUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="paper group relative z-10 shrink-0 focus-visible:outline-none"
        style={{ transform: `rotate(${tilt.photo}deg)` }}
        aria-label={`${member.name} on the Lodestone (opens in new tab)`}
      >
        <span
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-11 h-4 -rotate-6 rounded-[2px] opacity-80 z-10"
          style={{
            background: `repeating-linear-gradient(45deg, color-mix(in srgb, ${rankColor.hex} 45%, transparent) 0 5px, color-mix(in srgb, ${rankColor.hex} 24%, transparent) 5px 10px)`,
          }}
          aria-hidden="true"
        />
        <div className="surface p-2 pb-2.5 w-28 sm:w-32">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-[var(--bg)]">
            {!imageLoaded && (
              <div
                className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--card)] to-[var(--bg)] animate-shimmer"
                aria-hidden="true"
              />
            )}
            <img
              src={member.avatarLink}
              alt=""
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            />
            <div
              className="absolute top-1 left-1 flex items-center justify-center w-5 h-5 rounded-full"
              style={{
                backgroundColor: `color-mix(in srgb, ${rankColor.hex} 22%, var(--card))`,
                border: `2px solid color-mix(in srgb, ${rankColor.hex} 34%, var(--card))`,
              }}
            >
              <RankIcon
                className="w-3 h-3"
                style={{ color: rankColor.hex }}
                aria-hidden="true"
              />
            </div>
            <span
              className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            >
              <ExternalLink className="w-4 h-4 text-white" />
            </span>
          </div>
          <p className="font-accent font-bold text-sm text-center text-[var(--text)] truncate mt-1.5">
            {member.name}
          </p>
          <div className="flex justify-center mt-1.5">
            <Tag
              color={rankColor.hex}
              icon={<RankIcon className="w-3 h-3" aria-hidden="true" />}
            >
              {shortRank}
            </Tag>
          </div>
          {(isLeader || member.recentlyPromoted || isCurrentUser) && (
            <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 mt-1.5 text-[10px] font-display font-bold leading-none">
              {isLeader && (
                <span className="text-[var(--secondary)]">leads</span>
              )}
              {member.recentlyPromoted && (
                <span className="inline-flex items-center gap-0.5 text-[color:color-mix(in_srgb,var(--accent)_70%,var(--text))]">
                  <KawaiiSparkle className="w-2.5 h-2.5" />
                  promoted
                </span>
              )}
              {isCurrentUser && (
                <span className="text-[var(--primary)]">that's you!</span>
              )}
            </div>
          )}
        </div>
      </a>

      <StickyBioNote
        bio={member.biography}
        rankHex={rankColor.hex}
        editable={isOwnEditable}
        tilt={tilt.note}
      />
    </article>
  );
});

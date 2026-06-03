import type { CSSProperties } from "react";
import { Star, ExternalLink } from "lucide-react";

import lilGuyMoogle from "../assets/moogles/lil guy moogle.webp";
import { getRankColor } from "../constants";
import { formatMemberSince } from "../utils";
import { KawaiiStar, KawaiiHeart, KawaiiSparkle } from "./kawaiiMotifs";

// ─────────────────────────────────────────────────────────────────────────────
// MEMBERSHIP CARD — a kawaii FC member card: matte candy paper, sticker rank
// badge, scattered motifs and a peeking moogle. Theme-tinted via color-mix, so
// it adapts to every palette + dark mode. No gloss, no 3D.
// ─────────────────────────────────────────────────────────────────────────────

export interface MembershipCardProps {
  name: string;
  rank: string;
  avatarUrl: string;
  characterId?: string;
  /** MogTome first-login date (NOT the FC join date); shown as "MogTome member since …" */
  memberSince?: Date | string;
  compact?: boolean;
}

export function MembershipCard({
  name,
  rank,
  avatarUrl,
  characterId,
  memberSince,
  compact = false,
}: MembershipCardProps) {
  const rankColor = getRankColor(rank);
  const RankIcon = rankColor.icon;
  const lodestoneUrl = characterId
    ? `https://na.finalfantasyxiv.com/lodestone/character/${characterId}`
    : null;
  const since = memberSince ? formatMemberSince(memberSince) : null;

  const sizeClass = compact ? "max-w-[340px] sm:max-w-[360px]" : "max-w-[360px]";
  const padding = compact ? "p-4 sm:p-[1.15rem]" : "p-5";
  const avatarSize = compact ? "w-14 h-14 sm:w-16 sm:h-16" : "w-16 h-16";
  const nameSize = compact ? "text-base" : "text-base sm:text-lg";
  const moogleSize = compact ? "w-14 sm:w-16" : "w-16";

  return (
    <div className={compact ? "" : "py-4"}>
      <div
        className={`group relative w-full ${sizeClass} mx-auto aspect-[1.6/1] overflow-hidden
          rounded-[1.75rem] border-2
          transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          hover:-translate-y-1`}
        style={
          {
            borderColor: "color-mix(in srgb, var(--primary) 22%, var(--card))",
            background: `linear-gradient(140deg,
              color-mix(in srgb, var(--primary) 18%, var(--card)) 0%,
              color-mix(in srgb, var(--secondary) 13%, var(--card)) 52%,
              color-mix(in srgb, var(--accent) 15%, var(--card)) 100%)`,
            boxShadow: "var(--panel-shadow)",
          } as CSSProperties
        }
      >
        {/* Candy polka-dot texture */}
        <div
          className="absolute inset-0 opacity-[0.5] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--primary) 22%, transparent) 1.5px, transparent 1.6px)",
            backgroundSize: "15px 15px",
          }}
          aria-hidden="true"
        />

        {/* Rank-tinted glow, warms on hover */}
        <div
          className="absolute inset-0 rounded-[1.75rem] pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-300"
          style={{ boxShadow: `inset 0 0 34px -10px ${rankColor.glow}` }}
          aria-hidden="true"
        />

        {/* Scattered sticker motifs */}
        <KawaiiStar className="absolute top-9 right-3 w-3.5 h-3.5 text-[var(--accent)] opacity-50 rotate-12" />
        <KawaiiHeart className="absolute bottom-3 right-4 w-3 h-3 text-[var(--primary)] opacity-40 -rotate-6" />

        {/* Content */}
        <div className={`relative h-full ${padding} flex flex-col`}>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span
                className="flex items-center justify-center w-7 h-7 rounded-xl shrink-0"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--primary) 80%, var(--card))",
                  border:
                    "2px solid color-mix(in srgb, var(--primary) 90%, #fff)",
                }}
                aria-hidden="true"
              >
                <Star className="w-3.5 h-3.5 text-white fill-white/70" />
              </span>
              <div className="leading-none">
                <p className="font-display font-bold text-[var(--text)] text-sm tracking-wide">
                  Kupo Life
                </p>
                <p className="font-accent text-[var(--primary)] text-lg leading-tight">
                  ~ member card ~
                </p>
              </div>
            </div>

            {/* Peeking moogle */}
            <img
              src={lilGuyMoogle}
              alt=""
              aria-hidden="true"
              className={`${moogleSize} object-contain -mt-1 -mr-1 rotate-[6deg] animate-float-gentle drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] select-none`}
            />
          </div>

          <div className="flex-1" />

          {/* Member */}
          <div className="flex items-end gap-3">
            <div className="relative shrink-0">
              {/* Candy ring */}
              <div
                className="absolute -inset-1 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${rankColor.hex}, color-mix(in srgb, var(--accent) 70%, var(--card)))`,
                  opacity: 0.7,
                }}
                aria-hidden="true"
              />
              <img
                src={avatarUrl}
                alt=""
                className={`relative ${avatarSize} rounded-2xl object-cover border-2 border-[color:color-mix(in_srgb,var(--card)_85%,#fff)]`}
              />
              {/* Rank sticker badge */}
              <span
                className="absolute -bottom-1.5 -right-1.5 flex items-center justify-center w-6 h-6 rounded-full"
                style={{
                  backgroundColor: `color-mix(in srgb, ${rankColor.hex} 26%, var(--card))`,
                  border: `2px solid color-mix(in srgb, ${rankColor.hex} 42%, var(--card))`,
                }}
                aria-hidden="true"
              >
                <RankIcon className="w-3 h-3" style={{ color: rankColor.hex }} />
              </span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 pb-0.5">
              <h3
                className={`font-display font-bold text-[var(--text)] ${nameSize} truncate leading-tight`}
              >
                {name}
              </h3>
              <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-soft font-semibold"
                  style={{
                    color: rankColor.hex,
                    backgroundColor: `color-mix(in srgb, ${rankColor.hex} 16%, var(--card))`,
                    border: `1.5px solid color-mix(in srgb, ${rankColor.hex} 32%, var(--card))`,
                  }}
                >
                  <RankIcon className="w-2.5 h-2.5" aria-hidden="true" />
                  {rank}
                </span>
                {lodestoneUrl && (
                  <a
                    href={lodestoneUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-[var(--text-subtle)] hover:text-[var(--primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none rounded"
                  >
                    <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
                    Lodestone
                  </a>
                )}
              </div>
            </div>

            {/* Sparkle flourish */}
            <KawaiiSparkle className="w-4 h-4 text-[var(--accent)] opacity-70 shrink-0 mb-1" />
          </div>

          {/* MogTome member-since stamp */}
          {since && (
            <p className="mt-3 text-center font-accent text-base text-[var(--text-subtle)] leading-none">
              MogTome member since {since}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import { memo, type CSSProperties } from "react";
import { motion } from "motion/react";
import { Check, X, Loader2, Heart, Sparkles, Link2 } from "lucide-react";
import { DiscordIcon } from "@/shared/ui/DiscordIcon";
import { ConfidenceBadge } from "@/features/characterMapping/components/ConfidenceBadge";
import type { MatchPair, MatchConfidence } from "@/features/characterMapping/types";
import FfxivIcon from "@/assets/icons/ffxiv.png";

// per-confidence accent (green when we're sure → orange when we're guessing)
const ACCENT: Record<MatchConfidence, string> = {
  exact: "#22c55e",
  high: "#10b981",
  medium: "#f59e0b",
  low: "#f97316",
};

interface PairCardProps {
  pair: MatchPair;
  onConfirm: () => void;
  onSkip: () => void;
  /** this pair's link is in flight */
  isConfirming: boolean;
  /** something else is busy (e.g. bulk confirm) - lock the buttons */
  disabled?: boolean;
}

// A single suggested pairing the knight can lock in with one happy click. The
// character sits on the left, its Discord match on the right, joined by a heart
// (exact) or a link (fuzzier). Confirm stamps it; skip dismisses it. On confirm
// the row pops away via the parent's AnimatePresence.
export const PairCard = memo(function PairCard({
  pair,
  onConfirm,
  onSkip,
  isConfirming,
  disabled = false,
}: PairCardProps) {
  const { character, discordUser, confidence } = pair;
  const isExact = confidence === "exact";
  const accent = ACCENT[confidence];
  const busy = isConfirming || disabled;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 340, damping: 27 }}
      className="surface relative px-3 pt-4 pb-3 sm:px-4"
      style={{ borderColor: `color-mix(in srgb, ${accent} 34%, var(--card))` }}
    >
      {/* confidence ribbon, pinned to the top edge */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
        {isExact ? (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-display font-bold text-white shadow-sm"
            style={{ background: accent }}
          >
            <Sparkles className="w-3 h-3" aria-hidden="true" /> Perfect match!
          </span>
        ) : (
          <ConfidenceBadge confidence={confidence} />
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* character */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {character.avatarLink ? (
            <img
              src={character.avatarLink}
              alt=""
              className="w-9 h-9 rounded-xl object-cover shrink-0 border-2 border-[color:color-mix(in_srgb,var(--primary)_18%,var(--card))]"
            />
          ) : (
            <span className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 border-2 border-[color:color-mix(in_srgb,var(--primary)_18%,var(--card))] flex items-center justify-center shrink-0">
              <img src={FfxivIcon} alt="" className="w-8 h-8" />
            </span>
          )}
          <div className="min-w-0">
            <p className="font-display font-bold text-sm text-[var(--text)] truncate">
              {character.name}
            </p>
            {character.freeCompanyRank && (
              <p className="text-[11px] text-[var(--text-subtle)] truncate">
                {character.freeCompanyRank}
              </p>
            )}
          </div>
        </div>

        {/* connector */}
        <span
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full"
          style={{
            background: `color-mix(in srgb, ${accent} 16%, var(--card))`,
            color: accent,
          }}
          aria-hidden="true"
        >
          {isExact ? (
            <Heart className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Link2 className="w-3.5 h-3.5" />
          )}
        </span>

        {/* discord */}
        <div className="flex items-center gap-2 min-w-0 flex-1 justify-end text-right">
          <div className="min-w-0">
            <p className="font-display font-bold text-sm text-[var(--text)] truncate">
              {discordUser.serverNickName}
            </p>
            <p className="text-[11px] text-[var(--text-subtle)] truncate">
              Discord
            </p>
          </div>
          <span className="w-9 h-9 rounded-xl bg-[#5865F2]/15 border-2 border-[#5865F2]/25 flex items-center justify-center shrink-0">
            <DiscordIcon className="h-5 text-[#5865F2]" aria-hidden="true" />
          </span>
        </div>
      </div>

      {/* actions */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onConfirm}
          disabled={busy}
          aria-label={`Confirm ${character.name} with ${discordUser.serverNickName}`}
          className="gel hover-bounce flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 font-display font-bold text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--gel-color)]"
          style={{ "--gel-color": accent } as CSSProperties}
        >
          {isConfirming ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Check className="w-4 h-4" aria-hidden="true" />
          )}
          {isConfirming ? "Linking..." : "Confirm"}
        </button>
        <button
          onClick={onSkip}
          disabled={busy}
          aria-label={`Skip the match for ${character.name}`}
          className="shrink-0 inline-flex items-center justify-center gap-1 rounded-full border-2 border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-soft font-semibold text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[color:color-mix(in_srgb,var(--primary)_30%,var(--border))] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer touch-manipulation transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]"
        >
          <X className="w-4 h-4" aria-hidden="true" />
          Skip
        </button>
      </div>
    </motion.div>
  );
});

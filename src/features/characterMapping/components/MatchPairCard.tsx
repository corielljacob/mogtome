import { motion } from 'motion/react';
import { Loader2, Check, X, ArrowDown } from 'lucide-react';
import type { MatchPair } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import FfxivIcon from "../../../assets/icons/ffxiv.png";
import { DiscordIcon } from "../../../../src/components/DiscordIcon"

interface MatchPairCardProps {
  pair: MatchPair;
  onConfirm: (pair: MatchPair) => void;
  onDismiss: (pair: MatchPair) => void;
  isConfirming: boolean;
}

export function MatchPairCard({
  pair,
  onConfirm,
  onDismiss,
  isConfirming,
}: MatchPairCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="
        bg-[var(--bento-bg)]/50
        border border-[var(--bento-border)]
        rounded-xl p-3
        hover:border-[var(--bento-primary)]/20
        transition-colors
        flex flex-col
      "
    >
      {/* Character */}
      <div className="flex items-center gap-2.5 mb-2">
        {pair.character.avatarLink ? (
          <img
            src={pair.character.avatarLink}
            alt=""
            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-[var(--bento-primary)]/10 flex items-center justify-center flex-shrink-0">
            <img src={FfxivIcon} className="w-7 h-7 text-[var(--bento-primary)]" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate leading-tight">
            {pair.character.name}
          </p>
          <p className="text-[10px] font-mono text-[var(--bento-text-muted)]/50 truncate leading-tight">
            {pair.character.characterId}
          </p>
          {pair.character.freeCompanyRank && (
            <p className="text-[10px] text-[var(--bento-text-muted)] truncate leading-tight">
              {pair.character.freeCompanyRank}
            </p>
          )}
        </div>
      </div>

      {/* Connector */}
      <div className="flex items-center gap-2 pl-2 mb-2">
        <ArrowDown className="w-3.5 h-3.5 text-[var(--bento-text-muted)]" />
        <ConfidenceBadge confidence={pair.confidence} />
      </div>

      {/* Discord */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#5865F2]/15 flex items-center justify-center flex-shrink-0">
          <DiscordIcon className="h-6 text-[#5865F2]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate leading-tight">
            {pair.discordUser.serverNickName}
          </p>
          <p className="text-[10px] font-mono text-[var(--bento-text-muted)]/50 truncate leading-tight">
            {pair.discordUser.discordId}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={() => onConfirm(pair)}
          disabled={isConfirming}
          className="
            flex-1 flex items-center justify-center gap-1.5 
            px-3 py-2 rounded-lg text-xs font-soft font-semibold
            bg-green-500 hover:bg-green-600 text-white
            transition-colors cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:outline-none
          "
        >
          {isConfirming ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
          Confirm
        </button>
        <button
          onClick={() => onDismiss(pair)}
          disabled={isConfirming}
          className="
            p-2 rounded-lg
            text-[var(--bento-text-muted)] hover:text-[var(--bento-text)]
            hover:bg-[var(--bento-bg)] transition-colors cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
          "
          aria-label="Skip this match"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

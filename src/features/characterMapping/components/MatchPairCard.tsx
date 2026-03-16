import { motion } from 'motion/react';
import { Link2, User, MessageSquare, Loader2, Check } from 'lucide-react';
import type { MatchPair } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';

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
      exit={{ opacity: 0, x: -20 }}
      className="
        bg-[var(--bento-bg)]/50
        border border-[var(--bento-border)]
        rounded-2xl sm:rounded-xl p-4 sm:p-3
        sm:hover:border-[var(--bento-primary)]/20
        transition-colors
      "
    >
      {/* Match info row */}
      <div className="flex items-center gap-3 mb-3">
        {/* Character side */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {pair.character.avatarLink ? (
            <img
              src={pair.character.avatarLink}
              alt=""
              className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-[var(--bento-primary)]/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-[var(--bento-primary)]" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate">
              {pair.character.name}
            </p>
            {pair.character.freeCompanyRank && (
              <p className="text-xs text-[var(--bento-text-muted)] truncate">
                {pair.character.freeCompanyRank}
              </p>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 flex items-center gap-1.5">
          <div className="w-6 h-px bg-[var(--bento-border)]" />
          <Link2 className="w-4 h-4 text-[var(--bento-text-muted)]" />
          <div className="w-6 h-px bg-[var(--bento-border)]" />
        </div>

        {/* Discord side */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <div className="min-w-0 text-right">
            <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate">
              {pair.discordUser.serverNickName}
            </p>
            <p className="text-xs text-[var(--bento-text-muted)]">Discord</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#5865F2]/15 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4 text-[#5865F2]" />
          </div>
        </div>
      </div>

      {/* Confidence + actions row */}
      <div className="flex items-center justify-between gap-2">
        <ConfidenceBadge confidence={pair.confidence} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDismiss(pair)}
            disabled={isConfirming}
            className="
              px-3 py-1.5 rounded-lg text-xs font-soft font-medium
              text-[var(--bento-text-muted)] hover:text-[var(--bento-text)]
              hover:bg-[var(--bento-bg)] transition-colors cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
            "
          >
            Skip
          </button>
          <button
            onClick={() => onConfirm(pair)}
            disabled={isConfirming}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-soft font-semibold
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
        </div>
      </div>
    </motion.div>
  );
}

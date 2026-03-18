import { motion } from 'motion/react';
import { User, MessageSquare, Loader2, Check, X, ArrowDown } from 'lucide-react';
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
      exit={{ opacity: 0, scale: 0.95 }}
      className="
        bg-[var(--bg)]/50
        border border-[var(--border)]
        rounded-xl p-3
        hover:border-[var(--primary)]/20
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
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-[var(--primary)]" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-soft font-semibold text-sm text-[var(--text)] truncate leading-tight">
            {pair.character.name}
          </p>
          <p className="text-[10px] font-mono text-[var(--text-muted)]/50 truncate leading-tight">
            {pair.character.characterId}
          </p>
          {pair.character.freeCompanyRank && (
            <p className="text-[10px] text-[var(--text-muted)] truncate leading-tight">
              {pair.character.freeCompanyRank}
            </p>
          )}
        </div>
      </div>

      {/* Connector */}
      <div className="flex items-center gap-2 pl-3 mb-2">
        <ArrowDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        <ConfidenceBadge confidence={pair.confidence} />
      </div>

      {/* Discord */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#5865F2]/15 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-4 h-4 text-[#5865F2]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-soft font-semibold text-sm text-[var(--text)] truncate leading-tight">
            {pair.discordUser.serverNickName}
          </p>
          <p className="text-[10px] font-mono text-[var(--text-muted)]/50 truncate leading-tight">
            {pair.discordUser.discordId}
          </p>
          <p className="text-[10px] text-[var(--text-muted)] leading-tight">
            Discord
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
            text-[var(--text-muted)] hover:text-[var(--text)]
            hover:bg-[var(--bg)] transition-colors cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
          "
          aria-label="Skip this match"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

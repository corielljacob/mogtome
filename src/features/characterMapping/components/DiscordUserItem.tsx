import { memo } from 'react';
import { MessageSquare, Check } from 'lucide-react';
import type { UnmappedDiscordUser, MatchInfo } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';

interface DiscordUserItemProps {
  user: UnmappedDiscordUser;
  isSelected: boolean;
  matchInfo?: MatchInfo;
  onClick: () => void;
  disabled?: boolean;
}

export const DiscordUserItem = memo(function DiscordUserItem({
  user,
  isSelected,
  matchInfo,
  onClick,
  disabled,
}: DiscordUserItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl
        border transition-colors cursor-pointer touch-manipulation text-left
        focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isSelected
            ? 'bg-[var(--primary)]/15 border-[var(--primary)]/40'
            : matchInfo
              ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50'
              : 'bg-[var(--bg)]/50 border-[var(--border)] hover:border-[var(--primary)]/30'
        }
      `}
    >
      <div className="w-10 h-10 rounded-lg bg-[#5865F2]/15 flex items-center justify-center flex-shrink-0">
        <MessageSquare className="w-5 h-5 text-[#5865F2]" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-soft font-semibold text-sm text-[var(--text)] truncate">
          {user.serverNickName}
        </p>
        <p className="text-[10px] font-mono text-[var(--text-muted)]/50 truncate">
          {user.discordId}
        </p>
      </div>
      {matchInfo && !isSelected && (
        <ConfidenceBadge confidence={matchInfo.confidence} />
      )}
      {isSelected && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </button>
  );
});

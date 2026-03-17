import { memo } from 'react';
import { Check } from 'lucide-react';
import type { UnmappedCharacter, MatchInfo } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import FfxivIcon from "../../../assets/icons/ffxiv.png";

interface CharacterItemProps {
  character: UnmappedCharacter;
  isSelected: boolean;
  matchInfo?: MatchInfo;
  onClick: () => void;
  disabled?: boolean;
}

export const CharacterItem = memo(function CharacterItem({
  character,
  isSelected,
  matchInfo,
  onClick,
  disabled,
}: CharacterItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl
        border transition-colors cursor-pointer touch-manipulation text-left
        focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isSelected
            ? 'bg-[var(--bento-primary)]/15 border-[var(--bento-primary)]/40'
            : matchInfo
              ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50'
              : 'bg-[var(--bento-bg)]/50 border-[var(--bento-border)] hover:border-[var(--bento-primary)]/30'
        }
      `}
    >
      {character.avatarLink ? (
        <img
          src={character.avatarLink}
          alt=""
          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-[var(--bento-primary)]/10 flex items-center justify-center flex-shrink-0">
          <img src={FfxivIcon} className="w-9 h-9 text-[var(--bento-primary)]" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate">
          {character.name}
        </p>
        <p className="text-[10px] font-mono text-[var(--bento-text-muted)]/50 truncate">
          {character.characterId}
        </p>
        {character.freeCompanyRank && (
          <p className="text-xs text-[var(--bento-text-muted)] truncate">
            {character.freeCompanyRank}
          </p>
        )}
      </div>
      {matchInfo && !isSelected && (
        <ConfidenceBadge confidence={matchInfo.confidence} />
      )}
      {isSelected && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--bento-primary)] flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </button>
  );
});

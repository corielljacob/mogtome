import { memo } from "react";
import { Check } from "lucide-react";
import type {
  UnmappedCharacter,
  MatchInfo,
} from "@/features/characterMapping/types";
import { ConfidenceBadge } from "@/features/characterMapping/components/ConfidenceBadge";
import FfxivIcon from "@/assets/icons/ffxiv.png";

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
        w-full flex items-center gap-3 p-3 rounded-2xl
        bg-[var(--card)] border-2 transition-colors cursor-pointer touch-manipulation text-left
        focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isSelected
            ? "border-[var(--primary)] bg-[color:color-mix(in_srgb,var(--primary)_12%,var(--card))]"
            : matchInfo
              ? "border-[color:color-mix(in_srgb,#f59e0b_36%,var(--card))] bg-[color:color-mix(in_srgb,#f59e0b_10%,var(--card))] hover:border-[color:color-mix(in_srgb,#f59e0b_52%,var(--card))]"
              : "border-[color:color-mix(in_srgb,var(--primary)_12%,var(--card))] hover:border-[color:color-mix(in_srgb,var(--primary)_30%,var(--card))]"
        }
      `}
    >
      {character.avatarLink ? (
        <img
          src={character.avatarLink}
          alt=""
          className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border-2 border-[color:color-mix(in_srgb,var(--primary)_16%,var(--card))]"
        />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 border-2 border-[color:color-mix(in_srgb,var(--primary)_16%,var(--card))] flex items-center justify-center flex-shrink-0">
          <img src={FfxivIcon} alt="" className="w-9 h-9" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-sm text-[var(--text)] truncate">
          {character.name}
        </p>
        {character.freeCompanyRank && (
          <p className="text-xs text-[var(--text-subtle)] truncate">
            {character.freeCompanyRank}
          </p>
        )}
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

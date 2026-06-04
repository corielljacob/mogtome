import { memo } from "react";
import { Check } from "lucide-react";
import type { UnmappedDiscordUser, MatchInfo } from "../types";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { DiscordIcon } from "../../../../src/components/DiscordIcon";

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
      <div className="w-10 h-10 rounded-xl bg-[#5865F2]/15 border-2 border-[#5865F2]/25 flex items-center justify-center flex-shrink-0">
        <DiscordIcon className="h-6 text-[#5865F2]" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-sm text-[var(--text)] truncate">
          {user.serverNickName}
        </p>
        <p className="text-[10px] font-mono text-[var(--text-subtle)] truncate">
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

import { memo } from "react";
import { DashboardIcon } from "@/features/knights/DashboardIcons";
import type { UnmappedDiscordUser, MatchInfo } from "../types";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { MappingPlatformIcon } from "./MappingPlatformIcon";
export const DiscordUserItem = memo(function DiscordUserItem({
  user,
  isSelected,
  matchInfo,
  onClick,
  disabled,
}: {
  user: UnmappedDiscordUser;
  isSelected: boolean;
  matchInfo?: MatchInfo;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="dash-mapping-person"
      aria-pressed={isSelected}
      aria-label={`Select Discord account ${user.serverNickName}`}
    >
      <span className="dash-mapping-avatar dash-mapping-discord-avatar">
        <MappingPlatformIcon platform="discord" size={25} />
      </span>
      <span className="dash-mapping-person-copy dash-mapping-identity-copy">
        <strong>{user.serverNickName}</strong>
        <small className="dash-mapping-discord-id">ID {user.discordId}</small>
        {matchInfo && !isSelected && (
          <ConfidenceBadge confidence={matchInfo.confidence} />
        )}
      </span>
      {isSelected && (
        <DashboardIcon
          name="check"
          size={19}
          className="dash-mapping-selected"
        />
      )}
    </button>
  );
});

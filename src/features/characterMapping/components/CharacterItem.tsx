import { memo } from "react";
import { DashboardIcon } from "@/features/knights/DashboardIcons";
import type { UnmappedCharacter, MatchInfo } from "../types";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { MappingCharacterPortrait } from "./MappingPlatformIcon";
export const CharacterItem = memo(function CharacterItem({
  character,
  isSelected,
  matchInfo,
  onClick,
  disabled,
}: {
  character: UnmappedCharacter;
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
      aria-label={`Select character ${character.name}`}
    >
      <MappingCharacterPortrait src={character.avatarLink} />
      <span className="dash-mapping-person-copy dash-mapping-identity-copy">
        <strong>{character.name}</strong>
        <small className="dash-mapping-identity-detail">
          {character.freeCompanyRank}
        </small>
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

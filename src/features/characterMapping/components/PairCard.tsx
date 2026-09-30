import { memo } from "react";
import { DashboardIcon } from "@/features/knights/DashboardIcons";
import { ConfidenceBadge } from "./ConfidenceBadge";
import {
  MappingCharacterPortrait,
  MappingPlatformIcon,
} from "./MappingPlatformIcon";
import type { MatchPair } from "../types";
export const PairCard = memo(function PairCard({
  pair,
  onConfirm,
  onSkip,
  isConfirming,
  disabled = false,
}: {
  pair: MatchPair;
  onConfirm: () => void;
  onSkip: () => void;
  isConfirming: boolean;
  disabled?: boolean;
}) {
  const { character, discordUser, confidence } = pair;
  const busy = isConfirming || disabled;
  return (
    <article
      className="dash-mapping-pair"
      aria-label={`${character.name} and ${discordUser.serverNickName}`}
    >
      <div className="dash-mapping-pair-heading">
        <ConfidenceBadge confidence={confidence} />
      </div>
      <div className="dash-mapping-pair-people">
        <div className="dash-mapping-pair-person">
          <MappingCharacterPortrait src={character.avatarLink} />
          <span className="dash-mapping-identity-copy">
            <small className="dash-mapping-identity-label">
              <MappingPlatformIcon platform="ffxiv" size={15} />
              FFXIV character
            </small>
            <strong>{character.name}</strong>
            <small className="dash-mapping-identity-detail">
              {character.freeCompanyRank}
            </small>
          </span>
        </div>
        <DashboardIcon
          name="link"
          size={22}
          className="dash-mapping-pair-connector"
        />
        <div className="dash-mapping-pair-person">
          <span className="dash-mapping-avatar dash-mapping-discord-avatar">
            <MappingPlatformIcon platform="discord" size={25} />
          </span>
          <span className="dash-mapping-identity-copy">
            <small className="dash-mapping-identity-label">
              <MappingPlatformIcon platform="discord" size={15} />
              Discord account
            </small>
            <strong>{discordUser.serverNickName}</strong>
            <small className="dash-mapping-discord-id">
              ID {discordUser.discordId}
            </small>
          </span>
        </div>
      </div>
      <div className="dash-mapping-pair-actions">
        <button
          type="button"
          className="dash-mapping-text-button"
          disabled={busy}
          onClick={onSkip}
          aria-label={`Skip the match for ${character.name}`}
        >
          <DashboardIcon name="close" size={16} />
          Skip for now
        </button>
        <button
          type="button"
          className="dash-mapping-button"
          disabled={busy}
          onClick={onConfirm}
          aria-label={`Link ${character.name} to ${discordUser.serverNickName}`}
        >
          <DashboardIcon name={isConfirming ? "refresh" : "link"} size={17} />
          {isConfirming ? "Linking…" : "Link accounts"}
        </button>
      </div>
    </article>
  );
});

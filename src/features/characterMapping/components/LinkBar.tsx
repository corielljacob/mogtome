import { useId, type RefObject } from "react";
import { DashboardIcon } from "@/features/knights/DashboardIcons";
import { MappingPlatformIcon } from "./MappingPlatformIcon";

export function LinkBar({
  characterName,
  discordName,
  discordId,
  canLink,
  isMapping,
  onClear,
  onChangeCharacter,
  onChangeDiscord,
  onLink,
  containerRef,
}: {
  characterName: string | undefined;
  discordName: string | undefined;
  discordId?: string;
  canLink: boolean;
  isMapping: boolean;
  onClear: () => void;
  onChangeCharacter: () => void;
  onChangeDiscord: () => void;
  onLink: () => void;
  containerRef?: RefObject<HTMLDivElement | null>;
}) {
  const hintId = useId();
  const selectedCount =
    Number(Boolean(characterName)) + Number(Boolean(discordName));
  return (
    <div
      className="dash-mapping-selection"
      role="group"
      aria-label="Selected accounts"
      ref={containerRef}
      tabIndex={-1}
      data-ready={canLink}
    >
      <div className="dash-mapping-selection-heading">
        <h3>Your selected pair</h3>
        <span>{selectedCount} of 2 selected</span>
      </div>
      <div className="dash-mapping-selection-names">
        <div className="dash-mapping-selected-account" data-platform="ffxiv">
          <span className="dash-mapping-selected-platform">
            <MappingPlatformIcon platform="ffxiv" size={22} />
            <small>FFXIV character</small>
          </span>
          <strong>{characterName ?? "No character selected"}</strong>
          <button
            className="dash-mapping-text-button"
            type="button"
            onClick={onChangeCharacter}
            disabled={isMapping}
            aria-label={
              characterName ? "Change selected character" : "Choose a character"
            }
          >
            {characterName ? "Change" : "Choose"}
            <DashboardIcon name="arrow-right" size={15} />
          </button>
        </div>
        <DashboardIcon
          name="link"
          size={21}
          className="dash-mapping-selection-connector"
        />
        <div className="dash-mapping-selected-account" data-platform="discord">
          <span className="dash-mapping-selected-platform">
            <MappingPlatformIcon platform="discord" size={22} />
            <small>Discord account</small>
          </span>
          <strong>{discordName ?? "No Discord account selected"}</strong>
          {discordName && (
            <small className="dash-mapping-selected-id">ID {discordId}</small>
          )}
          <button
            className="dash-mapping-text-button"
            type="button"
            onClick={onChangeDiscord}
            disabled={isMapping}
            aria-label={
              discordName
                ? "Change selected Discord account"
                : "Choose a Discord account"
            }
          >
            {discordName ? "Change" : "Choose"}
            <DashboardIcon name="arrow-right" size={15} />
          </button>
        </div>
      </div>
      <div className="dash-mapping-selection-footer">
        <p id={hintId}>
          {canLink
            ? "Check both names, then link this pair."
            : characterName
              ? "Choose the Discord account that belongs to this character."
              : discordName
                ? "Choose the FFXIV character for this Discord account."
                : "Choose one character and one Discord account from the lists below."}
        </p>
        <div className="dash-mapping-selection-actions">
          {selectedCount > 0 && (
            <button
              type="button"
              className="dash-mapping-text-button"
              onClick={onClear}
              disabled={isMapping}
            >
              <DashboardIcon name="close" size={16} />
              Clear selection
            </button>
          )}
          <button
            type="button"
            className="dash-mapping-button"
            onClick={onLink}
            disabled={!canLink || isMapping}
            aria-describedby={hintId}
          >
            <DashboardIcon name={isMapping ? "refresh" : "link"} size={18} />
            {isMapping ? "Linking…" : "Link accounts"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { Inbox, MessageSquare } from "lucide-react";
import type { UnmappedCharacter, UnmappedDiscordUser } from "../types";
import { CharacterItem } from "./CharacterItem";
import { DiscordUserItem } from "./DiscordUserItem";
import { SearchInput } from "./SearchInput";
import FfxivIcon from "../../../assets/icons/ffxiv.png";

interface ManualPickerTabProps {
  // Selection state
  selectedCharacter: UnmappedCharacter | null;
  selectedDiscordUser: UnmappedDiscordUser | null;

  // Search
  characterSearch: string;
  discordSearch: string;
  onCharacterSearchChange: (value: string) => void;
  onDiscordSearchChange: (value: string) => void;

  // Lists
  sortedCharacters: UnmappedCharacter[];
  sortedDiscordUsers: UnmappedDiscordUser[];

  // Actions
  onSelectCharacter: (character: UnmappedCharacter) => void;
  onSelectDiscordUser: (user: UnmappedDiscordUser) => void;
}

export function ManualPickerTab({
  selectedCharacter,
  selectedDiscordUser,
  characterSearch,
  discordSearch,
  onCharacterSearchChange,
  onDiscordSearchChange,
  sortedCharacters,
  sortedDiscordUsers,
  onSelectCharacter,
  onSelectDiscordUser,
}: ManualPickerTabProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Two column picker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Characters column */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-3 flex-shrink-0">
            <img src={FfxivIcon} alt="" className="w-5 h-5" />
            <h3 className="font-soft font-semibold text-sm text-[var(--text)]">
              Characters
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-soft bg-[var(--bg)] text-[var(--text-muted)]">
              {sortedCharacters.length}
            </span>
          </div>

          <SearchInput
            value={characterSearch}
            onChange={onCharacterSearchChange}
            placeholder="Search characters..."
          />

          <div className="flex-1 overflow-y-auto pr-1 min-h-0">
            {sortedCharacters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Inbox className="w-8 h-8 text-[var(--text-muted)] mb-2" />
                <p className="text-sm text-[var(--text-muted)]">
                  {characterSearch
                    ? "No characters match, kupo~"
                    : "Every character is linked, kupo!"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedCharacters.map((character) => (
                  <CharacterItem
                    key={character.characterId}
                    character={character}
                    isSelected={
                      selectedCharacter?.characterId === character.characterId
                    }
                    onClick={() => onSelectCharacter(character)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Discord users column */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-3 flex-shrink-0">
            <MessageSquare className="w-4 h-4 text-[#5865F2]" />
            <h3 className="font-soft font-semibold text-sm text-[var(--text)]">
              Discord Accounts
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-soft bg-[var(--bg)] text-[var(--text-muted)]">
              {sortedDiscordUsers.length}
            </span>
          </div>

          <SearchInput
            value={discordSearch}
            onChange={onDiscordSearchChange}
            placeholder="Search Discord users..."
          />

          <div className="flex-1 overflow-y-auto pr-1 min-h-0">
            {sortedDiscordUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Inbox className="w-8 h-8 text-[var(--text-muted)] mb-2" />
                <p className="text-sm text-[var(--text-muted)]">
                  {discordSearch
                    ? "No accounts match, kupo~"
                    : "Every account is linked, kupo!"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedDiscordUsers.map((user) => (
                  <DiscordUserItem
                    key={user.discordId}
                    user={user}
                    isSelected={
                      selectedDiscordUser?.discordId === user.discordId
                    }
                    onClick={() => onSelectDiscordUser(user)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

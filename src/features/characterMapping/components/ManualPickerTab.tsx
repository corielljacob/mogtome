import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Inbox } from 'lucide-react';
import type { UnmappedCharacter, UnmappedDiscordUser } from '../types';
import { CharacterItem } from './CharacterItem';
import { DiscordUserItem } from './DiscordUserItem';
import { SearchInput } from './SearchInput';
import { DiscordIcon } from "../../../../src/components/DiscordIcon"
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

const ITEM_HEIGHT = 64; // p-3 (24px padding) + 40px content
const ITEM_GAP = 8; // space-y-2

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
  const characterScrollRef = useRef<HTMLDivElement>(null);
  const discordScrollRef = useRef<HTMLDivElement>(null);

  const characterVirtualizer = useVirtualizer({
    count: sortedCharacters.length,
    getScrollElement: () => characterScrollRef.current,
    estimateSize: () => ITEM_HEIGHT + ITEM_GAP,
    overscan: 10,
  });

  const discordVirtualizer = useVirtualizer({
    count: sortedDiscordUsers.length,
    getScrollElement: () => discordScrollRef.current,
    estimateSize: () => ITEM_HEIGHT + ITEM_GAP,
    overscan: 10,
  });

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Two column picker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Characters column */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-3 flex-shrink-0">
            <img src={FfxivIcon} className="w-6 h-6 text-[var(--bento-primary)]" />
            <h3 className="font-soft font-semibold text-sm text-[var(--bento-text)]">
              Characters
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-soft bg-[var(--bento-bg)] text-[var(--bento-text-muted)]">
              {sortedCharacters.length}
            </span>
          </div>

          <SearchInput
            value={characterSearch}
            onChange={onCharacterSearchChange}
            placeholder="Search characters..."
          />

          <div
            ref={characterScrollRef}
            className="flex-1 overflow-y-auto pr-1 min-h-0"
          >
            {sortedCharacters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Inbox className="w-8 h-8 text-[var(--bento-text-muted)] mb-2" />
                <p className="text-sm text-[var(--bento-text-muted)]">
                  {characterSearch
                    ? 'No characters match your search'
                    : 'No unmapped characters'}
                </p>
              </div>
            ) : (
              <div
                style={{
                  height: `${characterVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {characterVirtualizer.getVirtualItems().map((virtualItem) => {
                  const character = sortedCharacters[virtualItem.index];
                  return (
                    <div
                      key={character.characterId}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <CharacterItem
                        character={character}
                        isSelected={
                          selectedCharacter?.characterId === character.characterId
                        }
                        onClick={() => onSelectCharacter(character)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Discord users column */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-3 flex-shrink-0">
            <DiscordIcon className="w-5 text-[#5865F2]" />
            <h3 className="font-soft font-semibold text-sm text-[var(--bento-text)]">
              Discord Accounts
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-soft bg-[var(--bento-bg)] text-[var(--bento-text-muted)]">
              {sortedDiscordUsers.length}
            </span>
          </div>

          <SearchInput
            value={discordSearch}
            onChange={onDiscordSearchChange}
            placeholder="Search Discord users..."
          />

          <div
            ref={discordScrollRef}
            className="flex-1 overflow-y-auto pr-1 min-h-0"
          >
            {sortedDiscordUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Inbox className="w-8 h-8 text-[var(--bento-text-muted)] mb-2" />
                <p className="text-sm text-[var(--bento-text-muted)]">
                  {discordSearch
                    ? 'No users match your search'
                    : 'No unmapped Discord users'}
                </p>
              </div>
            ) : (
              <div
                style={{
                  height: `${discordVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {discordVirtualizer.getVirtualItems().map((virtualItem) => {
                  const user = sortedDiscordUsers[virtualItem.index];
                  return (
                    <div
                      key={user.discordId}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <DiscordUserItem
                        user={user}
                        isSelected={
                          selectedDiscordUser?.discordId === user.discordId
                        }
                        onClick={() => onSelectDiscordUser(user)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

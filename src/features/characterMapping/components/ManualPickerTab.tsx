import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  User,
  MessageSquare,
  Loader2,
  Link2,
  X,
  Sparkles,
  Inbox,
} from 'lucide-react';
import type { UnmappedCharacter, UnmappedDiscordUser } from '../types';
import { CharacterItem } from './CharacterItem';
import { DiscordUserItem } from './DiscordUserItem';
import { SearchInput } from './SearchInput';

interface ManualPickerTabProps {
  // Selection state
  selectedCharacter: UnmappedCharacter | null;
  selectedDiscordUser: UnmappedDiscordUser | null;
  canConfirm: boolean;

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
  onReset: () => void;
  onConfirm: () => void;

  // Mutation state
  isMapping: boolean;
  mappingError: Error | null;
}

const ITEM_HEIGHT = 64; // p-3 (24px padding) + 40px content
const ITEM_GAP = 8; // space-y-2

export function ManualPickerTab({
  selectedCharacter,
  selectedDiscordUser,
  canConfirm,
  characterSearch,
  discordSearch,
  onCharacterSearchChange,
  onDiscordSearchChange,
  sortedCharacters,
  sortedDiscordUsers,
  onSelectCharacter,
  onSelectDiscordUser,
  onReset,
  onConfirm,
  isMapping,
  mappingError,
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
      {/* Selection indicator */}
      {(selectedCharacter || selectedDiscordUser) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-2 mb-4 p-3 rounded-xl bg-[var(--bento-primary)]/10 border border-[var(--bento-primary)]/20"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-[var(--bento-primary)] flex-shrink-0" />
            <p className="text-sm text-[var(--bento-text)] truncate">
              {selectedCharacter && selectedDiscordUser ? (
                <>
                  <strong>{selectedCharacter.name}</strong> &rarr;{' '}
                  <strong>{selectedDiscordUser.serverNickName}</strong>
                </>
              ) : selectedCharacter ? (
                <>
                  <strong>{selectedCharacter.name}</strong> &rarr; Pick a Discord
                  account
                </>
              ) : selectedDiscordUser ? (
                <>
                  <strong>{selectedDiscordUser.serverNickName}</strong> &rarr; Pick
                  a character
                </>
              ) : null}
            </p>
          </div>
          <button
            onClick={onReset}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-[var(--bento-bg)]/50 text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] transition-colors cursor-pointer"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Two column picker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Characters column */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-3 flex-shrink-0">
            <User className="w-4 h-4 text-[var(--bento-primary)]" />
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
            className="flex-1 overflow-y-auto pr-1 min-h-0 max-h-[300px] lg:max-h-[400px]"
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
            <MessageSquare className="w-4 h-4 text-[#5865F2]" />
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
            className="flex-1 overflow-y-auto pr-1 min-h-0 max-h-[300px] lg:max-h-[400px]"
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

      {/* Manual confirm button */}
      <AnimatePresence>
        {canConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 flex-shrink-0"
          >
            <button
              onClick={onConfirm}
              disabled={isMapping}
              className="
                w-full flex items-center justify-center gap-2
                px-4 py-3.5 sm:py-3 rounded-xl
                bg-gradient-to-r from-blue-500 to-cyan-500
                active:from-blue-600 active:to-cyan-600
                sm:hover:from-blue-600 sm:hover:to-cyan-600
                text-white font-soft font-semibold text-sm
                transition-all cursor-pointer touch-manipulation
                disabled:opacity-50 disabled:cursor-not-allowed
                focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none
                shadow-lg shadow-blue-500/25
              "
            >
              {isMapping ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Link...
                </>
              ) : (
                <>
                  <Link2 className="w-5 h-5" />
                  Link {selectedCharacter?.name} to{' '}
                  {selectedDiscordUser?.serverNickName}
                </>
              )}
            </button>

            {mappingError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-500 text-center"
              >
                Failed to create link. Please try again.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

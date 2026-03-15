import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import {
  Link2,
  User,
  MessageSquare,
  Loader2,
  AlertCircle,
  RefreshCw,
  Check,
  ChevronRight,
  Search,
  X,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { characterMappingApi } from '../api/characterMapping';
import type {
  UnmappedCharacter,
  UnmappedDiscordUser,
} from '../api/characterMapping';
import { ContentCard } from './ContentCard';

type SelectionMode = 'none' | 'character' | 'discord';

interface CharacterItemProps {
  character: UnmappedCharacter;
  isSelected: boolean;
  isSuggested: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function CharacterItem({
  character,
  isSelected,
  isSuggested,
  onClick,
  disabled,
}: CharacterItemProps) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl
        border transition-all cursor-pointer touch-manipulation
        text-left
        focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isSelected
            ? 'bg-[var(--bento-primary)]/15 border-[var(--bento-primary)]/40'
            : isSuggested
            ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50'
            : 'bg-[var(--bento-bg)]/50 border-[var(--bento-border)] hover:border-[var(--bento-primary)]/30'
        }
      `}
    >
      <img
        src={character.avatarLink}
        alt=""
        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate">
          {character.name}
        </p>
        <p className="text-xs text-[var(--bento-text-muted)] truncate">
          {character.freeCompanyRank}
        </p>
      </div>
      {isSuggested && !isSelected && (
        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-soft font-medium bg-amber-500/15 text-amber-600 dark:text-amber-400">
          Suggested
        </span>
      )}
      {isSelected && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--bento-primary)] flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.button>
  );
}

interface DiscordUserItemProps {
  user: UnmappedDiscordUser;
  isSelected: boolean;
  isSuggested: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function DiscordUserItem({
  user,
  isSelected,
  isSuggested,
  onClick,
  disabled,
}: DiscordUserItemProps) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl
        border transition-all cursor-pointer touch-manipulation
        text-left
        focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isSelected
            ? 'bg-[var(--bento-primary)]/15 border-[var(--bento-primary)]/40'
            : isSuggested
            ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50'
            : 'bg-[var(--bento-bg)]/50 border-[var(--bento-border)] hover:border-[var(--bento-primary)]/30'
        }
      `}
    >
      <div className="w-10 h-10 rounded-lg bg-[#5865F2]/15 flex items-center justify-center flex-shrink-0">
        <MessageSquare className="w-5 h-5 text-[#5865F2]" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate">
          {user.discordUsername}
        </p>
        <p className="text-xs text-[var(--bento-text-muted)]">Discord Account</p>
      </div>
      {isSuggested && !isSelected && (
        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-soft font-medium bg-amber-500/15 text-amber-600 dark:text-amber-400">
          Suggested
        </span>
      )}
      {isSelected && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--bento-primary)] flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.button>
  );
}

/**
 * CharacterMapping - Knight Dashboard component for mapping characters to Discord accounts
 *
 * Allows officers to link unmapped FC characters with their Discord accounts.
 * Flow:
 * 1. Load both unmapped characters and Discord users
 * 2. User selects either a character OR Discord account first
 * 3. System fetches suggestions for the opposite list
 * 4. User selects from the suggested/all list
 * 5. Confirm to create the mapping
 */
export function CharacterMapping() {
  const queryClient = useQueryClient();

  // Selection state
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('none');
  const [selectedCharacter, setSelectedCharacter] =
    useState<UnmappedCharacter | null>(null);
  const [selectedDiscordUser, setSelectedDiscordUser] =
    useState<UnmappedDiscordUser | null>(null);

  // Search filters
  const [characterSearch, setCharacterSearch] = useState('');
  const [discordSearch, setDiscordSearch] = useState('');

  // Initial fetch of unmapped characters (no suggestions)
  const {
    data: charactersData,
    isLoading: isLoadingCharacters,
    isError: isCharactersError,
    refetch: refetchCharacters,
  } = useQuery({
    queryKey: ['unmapped-characters'],
    queryFn: () => characterMappingApi.getUnmappedCharacters(),
    staleTime: 1000 * 30,
  });

  // Initial fetch of unmapped Discord users (no suggestions)
  const {
    data: discordUsersData,
    isLoading: isLoadingDiscordUsers,
    isError: isDiscordUsersError,
    refetch: refetchDiscordUsers,
  } = useQuery({
    queryKey: ['unmapped-discord-users'],
    queryFn: () => characterMappingApi.getUnmappedDiscordUsers(),
    staleTime: 1000 * 30,
  });

  // Fetch characters with suggestions when a Discord user is selected
  const { data: suggestedCharactersData, isLoading: isLoadingSuggestedCharacters } =
    useQuery({
      queryKey: [
        'unmapped-characters',
        'suggestions',
        selectedDiscordUser?.discordUsername,
      ],
      queryFn: () =>
        characterMappingApi.getUnmappedCharacters(
          selectedDiscordUser!.discordUsername
        ),
      enabled: selectionMode === 'discord' && !!selectedDiscordUser,
      staleTime: 1000 * 30,
    });

  // Fetch Discord users with suggestions when a character is selected
  const { data: suggestedDiscordUsersData, isLoading: isLoadingSuggestedDiscord } =
    useQuery({
      queryKey: [
        'unmapped-discord-users',
        'suggestions',
        selectedCharacter?.name,
      ],
      queryFn: () =>
        characterMappingApi.getUnmappedDiscordUsers(selectedCharacter!.name),
      enabled: selectionMode === 'character' && !!selectedCharacter,
      staleTime: 1000 * 30,
    });

  // Map mutation
  const mapMutation = useMutation({
    mutationFn: () =>
      characterMappingApi.mapCharacter(
        selectedCharacter!.characterId,
        selectedDiscordUser!.discordId
      ),
    onSuccess: () => {
      // Reset state
      setSelectionMode('none');
      setSelectedCharacter(null);
      setSelectedDiscordUser(null);
      setCharacterSearch('');
      setDiscordSearch('');
      // Invalidate queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['unmapped-characters'] });
      queryClient.invalidateQueries({ queryKey: ['unmapped-discord-users'] });
      // Also invalidate members since mapping affects member data
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });

  // Determine which data to show
  const characters = useMemo(() => {
    if (selectionMode === 'discord' && suggestedCharactersData) {
      return suggestedCharactersData;
    }
    return charactersData ?? { suggested: [], all: [] };
  }, [selectionMode, suggestedCharactersData, charactersData]);

  const discordUsers = useMemo(() => {
    if (selectionMode === 'character' && suggestedDiscordUsersData) {
      return suggestedDiscordUsersData;
    }
    return discordUsersData ?? { suggested: [], all: [] };
  }, [selectionMode, suggestedDiscordUsersData, discordUsersData]);

  // Filter characters by search
  const filteredCharacters = useMemo(() => {
    const searchLower = characterSearch.toLowerCase().trim();
    if (!searchLower) {
      return {
        suggested: characters.suggested,
        all: characters.all,
      };
    }
    return {
      suggested: characters.suggested.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.freeCompanyRank.toLowerCase().includes(searchLower)
      ),
      all: characters.all.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.freeCompanyRank.toLowerCase().includes(searchLower)
      ),
    };
  }, [characters, characterSearch]);

  // Filter Discord users by search
  const filteredDiscordUsers = useMemo(() => {
    const searchLower = discordSearch.toLowerCase().trim();
    if (!searchLower) {
      return {
        suggested: discordUsers.suggested,
        all: discordUsers.all,
      };
    }
    return {
      suggested: discordUsers.suggested.filter((u) =>
        u.discordUsername.toLowerCase().includes(searchLower)
      ),
      all: discordUsers.all.filter((u) =>
        u.discordUsername.toLowerCase().includes(searchLower)
      ),
    };
  }, [discordUsers, discordSearch]);

  // Create sets for quick lookup of suggested IDs
  const suggestedCharacterIds = useMemo(
    () => new Set(characters.suggested.map((c) => c.characterId)),
    [characters.suggested]
  );
  const suggestedDiscordIds = useMemo(
    () => new Set(discordUsers.suggested.map((u) => u.discordId)),
    [discordUsers.suggested]
  );

  // Handlers
  const handleCharacterSelect = (character: UnmappedCharacter) => {
    if (selectionMode === 'none' || selectionMode === 'character') {
      // Starting with character selection
      setSelectionMode('character');
      setSelectedCharacter(character);
      setSelectedDiscordUser(null);
    } else if (selectionMode === 'discord') {
      // Completing selection after picking Discord user first
      setSelectedCharacter(character);
    }
  };

  const handleDiscordUserSelect = (user: UnmappedDiscordUser) => {
    if (selectionMode === 'none' || selectionMode === 'discord') {
      // Starting with Discord selection
      setSelectionMode('discord');
      setSelectedDiscordUser(user);
      setSelectedCharacter(null);
    } else if (selectionMode === 'character') {
      // Completing selection after picking character first
      setSelectedDiscordUser(user);
    }
  };

  const handleReset = () => {
    setSelectionMode('none');
    setSelectedCharacter(null);
    setSelectedDiscordUser(null);
    setCharacterSearch('');
    setDiscordSearch('');
  };

  const handleRefresh = () => {
    handleReset();
    refetchCharacters();
    refetchDiscordUsers();
  };

  const canConfirm = selectedCharacter && selectedDiscordUser;
  const isLoading = isLoadingCharacters || isLoadingDiscordUsers;
  const isError = isCharactersError || isDiscordUsersError;

  // Check if there are any unmapped items
  const hasUnmappedCharacters =
    (charactersData?.all?.length ?? 0) > 0 ||
    (charactersData?.suggested?.length ?? 0) > 0;
  const hasUnmappedDiscordUsers =
    (discordUsersData?.all?.length ?? 0) > 0 ||
    (discordUsersData?.suggested?.length ?? 0) > 0;
  const hasAnyUnmapped = hasUnmappedCharacters || hasUnmappedDiscordUsers;

  return (
    <ContentCard className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4 sm:mb-6 flex-shrink-0">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-400/15 to-cyan-400/15 flex items-center justify-center flex-shrink-0">
            <Link2
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500"
              aria-hidden="true"
            />
          </div>
          <div>
            <h2 className="font-display font-semibold text-base sm:text-lg text-[var(--bento-text)]">
              Character Mapping
            </h2>
            <p className="text-xs sm:text-sm text-[var(--bento-text-muted)] mt-0.5">
              Link characters to Discord accounts
            </p>
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="
            p-3 sm:p-2 rounded-xl sm:rounded-lg
            bg-[var(--bento-bg)] active:bg-[var(--bento-primary)]/10 sm:hover:bg-[var(--bento-primary)]/10
            text-[var(--bento-text-muted)] active:text-[var(--bento-primary)] sm:hover:text-[var(--bento-primary)]
            transition-colors cursor-pointer touch-manipulation
            disabled:opacity-50
            focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
          "
          aria-label="Refresh unmapped lists"
        >
          <RefreshCw
            className={`w-5 h-5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 flex-1">
          <Loader2 className="w-8 h-8 text-[var(--bento-primary)] animate-spin mb-3" />
          <p className="text-sm text-[var(--bento-text-muted)] font-soft">
            Loading unmapped accounts...
          </p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 flex-1">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <p className="text-sm text-[var(--bento-text)] font-soft font-semibold mb-1">
            Failed to load unmapped accounts
          </p>
          <p className="text-xs text-[var(--bento-text-muted)] mb-4">
            Something went wrong, kupo...
          </p>
          <button
            onClick={handleRefresh}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-[var(--bento-primary)] text-white
              font-soft font-semibold text-sm
              cursor-pointer
              focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-offset-2 focus-visible:outline-none
            "
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      ) : !hasAnyUnmapped ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 flex-1">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-[var(--bento-text)] font-soft font-semibold mb-1">
            All accounts mapped!
          </p>
          <p className="text-xs text-[var(--bento-text-muted)]">
            Every character is linked to a Discord account, kupo~
          </p>
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Selection state indicator */}
          {selectionMode !== 'none' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-2 mb-4 p-3 rounded-xl bg-[var(--bento-primary)]/10 border border-[var(--bento-primary)]/20"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-[var(--bento-primary)] flex-shrink-0" />
                <p className="text-sm text-[var(--bento-text)] truncate">
                  {selectionMode === 'character' && selectedCharacter && (
                    <>
                      Selected: <strong>{selectedCharacter.name}</strong>
                      {selectedDiscordUser ? (
                        <>
                          {' '}
                          → <strong>{selectedDiscordUser.discordUsername}</strong>
                        </>
                      ) : (
                        ' → Now pick a Discord account'
                      )}
                    </>
                  )}
                  {selectionMode === 'discord' && selectedDiscordUser && (
                    <>
                      Selected: <strong>{selectedDiscordUser.discordUsername}</strong>
                      {selectedCharacter ? (
                        <>
                          {' '}
                          → <strong>{selectedCharacter.name}</strong>
                        </>
                      ) : (
                        ' → Now pick a character'
                      )}
                    </>
                  )}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-[var(--bento-bg)]/50 text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] transition-colors cursor-pointer"
                aria-label="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
            {/* Characters column */}
            <div className="flex flex-col min-h-0">
              <div className="flex items-center justify-between gap-2 mb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[var(--bento-primary)]" />
                  <h3 className="font-soft font-semibold text-sm text-[var(--bento-text)]">
                    Characters
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-soft bg-[var(--bento-bg)] text-[var(--bento-text-muted)]">
                    {filteredCharacters.suggested.length + filteredCharacters.all.length}
                  </span>
                </div>
                {isLoadingSuggestedCharacters && (
                  <Loader2 className="w-4 h-4 text-[var(--bento-primary)] animate-spin" />
                )}
              </div>

              {/* Search input */}
              <div className="relative mb-3 flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--bento-text-muted)]" />
                <input
                  type="text"
                  value={characterSearch}
                  onChange={(e) => setCharacterSearch(e.target.value)}
                  placeholder="Search characters..."
                  className="
                    w-full pl-9 pr-4 py-2 rounded-xl
                    bg-[var(--bento-bg)]/50 border border-[var(--bento-border)]
                    text-sm text-[var(--bento-text)]
                    placeholder:text-[var(--bento-text-muted)]
                    focus:outline-none focus:border-[var(--bento-primary)]/40
                    transition-colors
                  "
                />
              </div>

              {/* Character list */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0 max-h-[300px] lg:max-h-none">
                <AnimatePresence mode="popLayout">
                  {/* Suggested characters first */}
                  {filteredCharacters.suggested.map((character) => (
                    <CharacterItem
                      key={character.characterId}
                      character={character}
                      isSelected={
                        selectedCharacter?.characterId === character.characterId
                      }
                      isSuggested={true}
                      onClick={() => handleCharacterSelect(character)}
                      disabled={
                        selectionMode === 'character' &&
                        selectedCharacter?.characterId !== character.characterId &&
                        !selectedDiscordUser
                      }
                    />
                  ))}
                  {/* All characters (excluding suggested) */}
                  {filteredCharacters.all
                    .filter((c) => !suggestedCharacterIds.has(c.characterId))
                    .map((character) => (
                      <CharacterItem
                        key={character.characterId}
                        character={character}
                        isSelected={
                          selectedCharacter?.characterId === character.characterId
                        }
                        isSuggested={false}
                        onClick={() => handleCharacterSelect(character)}
                        disabled={
                          selectionMode === 'character' &&
                          selectedCharacter?.characterId !== character.characterId &&
                          !selectedDiscordUser
                        }
                      />
                    ))}
                  {filteredCharacters.suggested.length === 0 &&
                    filteredCharacters.all.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Inbox className="w-8 h-8 text-[var(--bento-text-muted)] mb-2" />
                        <p className="text-sm text-[var(--bento-text-muted)]">
                          {characterSearch ? 'No characters match your search' : 'No unmapped characters'}
                        </p>
                      </div>
                    )}
                </AnimatePresence>
              </div>
            </div>

            {/* Arrow indicator between columns (desktop only) */}
            <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-[var(--bento-bg)] border border-[var(--bento-border)] flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-[var(--bento-text-muted)]" />
              </div>
            </div>

            {/* Discord users column */}
            <div className="flex flex-col min-h-0">
              <div className="flex items-center justify-between gap-2 mb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#5865F2]" />
                  <h3 className="font-soft font-semibold text-sm text-[var(--bento-text)]">
                    Discord Accounts
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-soft bg-[var(--bento-bg)] text-[var(--bento-text-muted)]">
                    {filteredDiscordUsers.suggested.length + filteredDiscordUsers.all.length}
                  </span>
                </div>
                {isLoadingSuggestedDiscord && (
                  <Loader2 className="w-4 h-4 text-[var(--bento-primary)] animate-spin" />
                )}
              </div>

              {/* Search input */}
              <div className="relative mb-3 flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--bento-text-muted)]" />
                <input
                  type="text"
                  value={discordSearch}
                  onChange={(e) => setDiscordSearch(e.target.value)}
                  placeholder="Search Discord users..."
                  className="
                    w-full pl-9 pr-4 py-2 rounded-xl
                    bg-[var(--bento-bg)]/50 border border-[var(--bento-border)]
                    text-sm text-[var(--bento-text)]
                    placeholder:text-[var(--bento-text-muted)]
                    focus:outline-none focus:border-[var(--bento-primary)]/40
                    transition-colors
                  "
                />
              </div>

              {/* Discord user list */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0 max-h-[300px] lg:max-h-none">
                <AnimatePresence mode="popLayout">
                  {/* Suggested Discord users first */}
                  {filteredDiscordUsers.suggested.map((user) => (
                    <DiscordUserItem
                      key={user.discordId}
                      user={user}
                      isSelected={
                        selectedDiscordUser?.discordId === user.discordId
                      }
                      isSuggested={true}
                      onClick={() => handleDiscordUserSelect(user)}
                      disabled={
                        selectionMode === 'discord' &&
                        selectedDiscordUser?.discordId !== user.discordId &&
                        !selectedCharacter
                      }
                    />
                  ))}
                  {/* All Discord users (excluding suggested) */}
                  {filteredDiscordUsers.all
                    .filter((u) => !suggestedDiscordIds.has(u.discordId))
                    .map((user) => (
                      <DiscordUserItem
                        key={user.discordId}
                        user={user}
                        isSelected={
                          selectedDiscordUser?.discordId === user.discordId
                        }
                        isSuggested={false}
                        onClick={() => handleDiscordUserSelect(user)}
                        disabled={
                          selectionMode === 'discord' &&
                          selectedDiscordUser?.discordId !== user.discordId &&
                          !selectedCharacter
                        }
                      />
                    ))}
                  {filteredDiscordUsers.suggested.length === 0 &&
                    filteredDiscordUsers.all.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Inbox className="w-8 h-8 text-[var(--bento-text-muted)] mb-2" />
                        <p className="text-sm text-[var(--bento-text-muted)]">
                          {discordSearch ? 'No users match your search' : 'No unmapped Discord users'}
                        </p>
                      </div>
                    )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Confirm button */}
          <AnimatePresence>
            {canConfirm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-4 flex-shrink-0"
              >
                <button
                  onClick={() => mapMutation.mutate()}
                  disabled={mapMutation.isPending}
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
                  {mapMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Link...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-5 h-5" />
                      Link {selectedCharacter?.name} to{' '}
                      {selectedDiscordUser?.discordUsername}
                    </>
                  )}
                </button>

                {mapMutation.isError && (
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
      )}
    </ContentCard>
  );
}

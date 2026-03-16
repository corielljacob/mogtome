import { useState, useMemo, useCallback, useDeferredValue } from 'react';
import type { UnmappedCharacter, UnmappedDiscordUser } from '../types';

// --- Types -------------------------------------------------------------------

export interface UseManualPickerResult {
  // Selections
  selectedCharacter: UnmappedCharacter | null;
  selectedDiscordUser: UnmappedDiscordUser | null;
  canConfirm: boolean;

  // Search
  characterSearch: string;
  discordSearch: string;
  setCharacterSearch: (value: string) => void;
  setDiscordSearch: (value: string) => void;

  // Filtered lists
  sortedCharacters: UnmappedCharacter[];
  sortedDiscordUsers: UnmappedDiscordUser[];

  // Actions
  selectCharacter: (character: UnmappedCharacter) => void;
  selectDiscordUser: (user: UnmappedDiscordUser) => void;
  reset: () => void;
}

interface UseManualPickerOptions {
  allCharacters: UnmappedCharacter[];
  allDiscordUsers: UnmappedDiscordUser[];
}

// --- Hook --------------------------------------------------------------------

export function useManualPicker({
  allCharacters,
  allDiscordUsers,
}: UseManualPickerOptions): UseManualPickerResult {
  // -- Selection state --------------------------------------------------------

  const [selectedCharacter, setSelectedCharacter] = useState<UnmappedCharacter | null>(null);
  const [selectedDiscordUser, setSelectedDiscordUser] = useState<UnmappedDiscordUser | null>(null);

  // -- Search state -----------------------------------------------------------

  const [characterSearch, setCharacterSearch] = useState('');
  const [discordSearch, setDiscordSearch] = useState('');
  const deferredCharSearch = useDeferredValue(characterSearch);
  const deferredDiscordSearch = useDeferredValue(discordSearch);

  // -- Filtering --------------------------------------------------------------

  const sortedCharacters = useMemo(() => {
    const searchLower = deferredCharSearch.toLowerCase().trim();
    if (!searchLower) return allCharacters;
    return allCharacters.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        (c.freeCompanyRank && c.freeCompanyRank.toLowerCase().includes(searchLower))
    );
  }, [allCharacters, deferredCharSearch]);

  const sortedDiscordUsers = useMemo(() => {
    const searchLower = deferredDiscordSearch.toLowerCase().trim();
    if (!searchLower) return allDiscordUsers;
    return allDiscordUsers.filter((u) =>
      u.serverNickName.toLowerCase().includes(searchLower)
    );
  }, [allDiscordUsers, deferredDiscordSearch]);

  // -- Actions ----------------------------------------------------------------

  const selectCharacter = useCallback((character: UnmappedCharacter) => {
    setSelectedCharacter((prev) =>
      prev?.characterId === character.characterId ? null : character
    );
  }, []);

  const selectDiscordUser = useCallback((user: UnmappedDiscordUser) => {
    setSelectedDiscordUser((prev) =>
      prev?.discordId === user.discordId ? null : user
    );
  }, []);

  const reset = useCallback(() => {
    setSelectedCharacter(null);
    setSelectedDiscordUser(null);
    setCharacterSearch('');
    setDiscordSearch('');
  }, []);

  // -- Return -----------------------------------------------------------------

  return {
    selectedCharacter,
    selectedDiscordUser,
    canConfirm: Boolean(selectedCharacter && selectedDiscordUser),
    characterSearch,
    discordSearch,
    setCharacterSearch,
    setDiscordSearch,
    sortedCharacters,
    sortedDiscordUsers,
    selectCharacter,
    selectDiscordUser,
    reset,
  };
}

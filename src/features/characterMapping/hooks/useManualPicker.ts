import { useState, useMemo, useCallback, useDeferredValue } from 'react';
import type { UnmappedCharacter, UnmappedDiscordUser, MatchInfo } from '../types';

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

  // Filtered & sorted lists
  sortedCharacters: UnmappedCharacter[];
  sortedDiscordUsers: UnmappedDiscordUser[];

  // Match info maps (when a selection exists)
  characterMatchInfo: Map<string, MatchInfo>;
  discordMatchInfo: Map<string, MatchInfo>;

  // Actions
  selectCharacter: (character: UnmappedCharacter) => void;
  selectDiscordUser: (user: UnmappedDiscordUser) => void;
  reset: () => void;
}

interface UseManualPickerOptions {
  allCharacters: UnmappedCharacter[];
  allDiscordUsers: UnmappedDiscordUser[];
  getRankedDiscordUsers: (
    character: UnmappedCharacter | null
  ) => Array<UnmappedDiscordUser & MatchInfo> | null;
  getRankedCharacters: (
    discordUser: UnmappedDiscordUser | null
  ) => Array<UnmappedCharacter & MatchInfo> | null;
}

// --- Hook --------------------------------------------------------------------

export function useManualPicker({
  allCharacters,
  allDiscordUsers,
  getRankedDiscordUsers,
  getRankedCharacters,
}: UseManualPickerOptions): UseManualPickerResult {
  // -- Selection state --------------------------------------------------------

  const [selectedCharacter, setSelectedCharacter] = useState<UnmappedCharacter | null>(null);
  const [selectedDiscordUser, setSelectedDiscordUser] = useState<UnmappedDiscordUser | null>(null);

  // -- Search state -----------------------------------------------------------

  const [characterSearch, setCharacterSearch] = useState('');
  const [discordSearch, setDiscordSearch] = useState('');
  const deferredCharSearch = useDeferredValue(characterSearch);
  const deferredDiscordSearch = useDeferredValue(discordSearch);

  // -- Ranking based on selection ---------------------------------------------

  const rankedDiscordUsers = useMemo(
    () => getRankedDiscordUsers(selectedCharacter),
    [selectedCharacter, getRankedDiscordUsers]
  );

  const rankedCharacters = useMemo(
    () => getRankedCharacters(selectedDiscordUser),
    [selectedDiscordUser, getRankedCharacters]
  );

  // Build lookup maps for match info
  const discordMatchInfo = useMemo(() => {
    if (!rankedDiscordUsers) return new Map<string, MatchInfo>();
    return new Map(
      rankedDiscordUsers.map((u) => [
        u.discordId,
        { confidence: u.confidence, score: u.score },
      ])
    );
  }, [rankedDiscordUsers]);

  const characterMatchInfo = useMemo(() => {
    if (!rankedCharacters) return new Map<string, MatchInfo>();
    return new Map(
      rankedCharacters.map((c) => [
        c.characterId,
        { confidence: c.confidence, score: c.score },
      ])
    );
  }, [rankedCharacters]);

  // -- Filtering --------------------------------------------------------------

  const filteredCharacters = useMemo(() => {
    const searchLower = deferredCharSearch.toLowerCase().trim();
    if (!searchLower) return allCharacters;
    return allCharacters.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        (c.freeCompanyRank && c.freeCompanyRank.toLowerCase().includes(searchLower))
    );
  }, [allCharacters, deferredCharSearch]);

  const filteredDiscordUsers = useMemo(() => {
    const searchLower = deferredDiscordSearch.toLowerCase().trim();
    if (!searchLower) return allDiscordUsers;
    return allDiscordUsers.filter((u) =>
      u.serverNickName.toLowerCase().includes(searchLower)
    );
  }, [allDiscordUsers, deferredDiscordSearch]);

  // -- Sorting (matched items first when selection exists) --------------------

  const sortedCharacters = useMemo(() => {
    if (!selectedDiscordUser || characterMatchInfo.size === 0) return filteredCharacters;
    return [...filteredCharacters].sort((a, b) => {
      const sa = characterMatchInfo.get(a.characterId)?.score ?? 0;
      const sb = characterMatchInfo.get(b.characterId)?.score ?? 0;
      return sb - sa;
    });
  }, [filteredCharacters, selectedDiscordUser, characterMatchInfo]);

  const sortedDiscordUsers = useMemo(() => {
    if (!selectedCharacter || discordMatchInfo.size === 0) return filteredDiscordUsers;
    return [...filteredDiscordUsers].sort((a, b) => {
      const sa = discordMatchInfo.get(a.discordId)?.score ?? 0;
      const sb = discordMatchInfo.get(b.discordId)?.score ?? 0;
      return sb - sa;
    });
  }, [filteredDiscordUsers, selectedCharacter, discordMatchInfo]);

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
    characterMatchInfo,
    discordMatchInfo,
    selectCharacter,
    selectDiscordUser,
    reset,
  };
}

import { useState, useMemo, useCallback, useDeferredValue } from "react";
import type {
  UnmappedCharacter,
  UnmappedDiscordUser,
  MatchPair,
  MatchInfo,
  MatchConfidence,
} from "@/features/characterMapping/types";

// Sort priority for the resting lists: exact first, then close, then the rest.
const CONF_ORDER: Record<MatchConfidence, number> = {
  exact: 0,
  high: 1,
  medium: 2,
  low: 3,
};

interface UseSmartPickerArgs {
  allCharacters: UnmappedCharacter[];
  allDiscordUsers: UnmappedDiscordUser[];
  /** The system's confident pairings (visible exact + suggested). */
  suggestedPairs: MatchPair[];
  getRankedDiscordUsers: (
    character: UnmappedCharacter | null,
  ) => Array<UnmappedDiscordUser & MatchInfo> | null;
  getRankedCharacters: (
    discordUser: UnmappedDiscordUser | null,
  ) => Array<UnmappedCharacter & MatchInfo> | null;
}

export interface CharacterRow {
  character: UnmappedCharacter;
  matchInfo?: MatchInfo;
}
export interface DiscordRow {
  user: UnmappedDiscordUser;
  matchInfo?: MatchInfo;
}

export interface UseSmartPickerResult {
  selectedCharacter: UnmappedCharacter | null;
  selectedDiscordUser: UnmappedDiscordUser | null;
  canLink: boolean;
  characterSearch: string;
  discordSearch: string;
  setCharacterSearch: (v: string) => void;
  setDiscordSearch: (v: string) => void;
  characterRows: CharacterRow[];
  discordRows: DiscordRow[];
  selectCharacter: (c: UnmappedCharacter) => void;
  selectDiscordUser: (u: UnmappedDiscordUser) => void;
  clearCharacter: () => void;
  clearDiscordUser: () => void;
  reset: () => void;
}

const info = (confidence: MatchInfo["confidence"], score = 0): MatchInfo => ({
  confidence,
  score,
});

/**
 * useSmartPicker - the smarts behind the side-by-side board. Selecting one side
 * re-sorts the other column by the system's match ranking (best first).
 * Both accounts must be chosen explicitly; ranking never changes a selection.
 */
export function useSmartPicker({
  allCharacters,
  allDiscordUsers,
  suggestedPairs,
  getRankedDiscordUsers,
  getRankedCharacters,
}: UseSmartPickerArgs): UseSmartPickerResult {
  const [selectedCharacter, setSelectedCharacter] =
    useState<UnmappedCharacter | null>(null);
  const [selectedDiscordUser, setSelectedDiscordUser] =
    useState<UnmappedDiscordUser | null>(null);
  const [characterSearch, setCharacterSearch] = useState("");
  const [discordSearch, setDiscordSearch] = useState("");
  const charQ = useDeferredValue(characterSearch);
  const discQ = useDeferredValue(discordSearch);

  // An account linked elsewhere can disappear while this picker stays mounted.
  // Use the current lists for both the visible choices and their match ranking.
  const currentCharacter =
    allCharacters.find(
      (character) => character.characterId === selectedCharacter?.characterId,
    ) ?? null;
  const currentDiscordUser =
    allDiscordUsers.find(
      (user) => user.discordId === selectedDiscordUser?.discordId,
    ) ?? null;

  // Confident pairing lookups (a character/discord's own best match).
  const byChar = useMemo(() => {
    const m = new Map<string, MatchPair>();
    suggestedPairs.forEach((p) => m.set(p.character.characterId, p));
    return m;
  }, [suggestedPairs]);
  const byDiscord = useMemo(() => {
    const m = new Map<string, MatchPair>();
    suggestedPairs.forEach((p) => m.set(p.discordUser.discordId, p));
    return m;
  }, [suggestedPairs]);

  // Ranking of the OPPOSITE column relative to the current single selection.
  const discordRank = useMemo(() => {
    if (!currentCharacter) return null;
    const ranked = getRankedDiscordUsers(currentCharacter) ?? [];
    const m = new Map<string, { order: number; info: MatchInfo }>();
    ranked.forEach((u, i) =>
      m.set(u.discordId, { order: i, info: info(u.confidence, u.score) }),
    );
    return m;
  }, [currentCharacter, getRankedDiscordUsers]);

  const characterRank = useMemo(() => {
    if (!currentDiscordUser) return null;
    const ranked = getRankedCharacters(currentDiscordUser) ?? [];
    const m = new Map<string, { order: number; info: MatchInfo }>();
    ranked.forEach((c, i) =>
      m.set(c.characterId, { order: i, info: info(c.confidence, c.score) }),
    );
    return m;
  }, [currentDiscordUser, getRankedCharacters]);

  const characterRows = useMemo<CharacterRow[]>(() => {
    const q = charQ.toLowerCase().trim();
    const filtered = allCharacters.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.freeCompanyRank ?? "").toLowerCase().includes(q),
    );
    if (characterRank) {
      return [...filtered]
        .sort(
          (a, b) =>
            (characterRank.get(a.characterId)?.order ?? 1e9) -
            (characterRank.get(b.characterId)?.order ?? 1e9),
        )
        .map((c) => ({
          character: c,
          matchInfo: characterRank.get(c.characterId)?.info,
        }));
    }
    const priority = (c: UnmappedCharacter) => {
      const sug = byChar.get(c.characterId);
      return sug ? CONF_ORDER[sug.confidence] : 4;
    };
    return [...filtered]
      .sort((a, b) => priority(a) - priority(b))
      .map((c) => {
        const sug = byChar.get(c.characterId);
        return {
          character: c,
          matchInfo: sug ? info(sug.confidence) : undefined,
        };
      });
  }, [allCharacters, charQ, characterRank, byChar]);

  const discordRows = useMemo<DiscordRow[]>(() => {
    const q = discQ.toLowerCase().trim();
    const filtered = allDiscordUsers.filter(
      (u) =>
        !q ||
        u.serverNickName.toLowerCase().includes(q) ||
        u.discordId.toLowerCase().includes(q),
    );
    if (discordRank) {
      return [...filtered]
        .sort(
          (a, b) =>
            (discordRank.get(a.discordId)?.order ?? 1e9) -
            (discordRank.get(b.discordId)?.order ?? 1e9),
        )
        .map((u) => ({
          user: u,
          matchInfo: discordRank.get(u.discordId)?.info,
        }));
    }
    const priority = (u: UnmappedDiscordUser) => {
      const sug = byDiscord.get(u.discordId);
      return sug ? CONF_ORDER[sug.confidence] : 4;
    };
    return [...filtered]
      .sort((a, b) => priority(a) - priority(b))
      .map((u) => {
        const sug = byDiscord.get(u.discordId);
        return { user: u, matchInfo: sug ? info(sug.confidence) : undefined };
      });
  }, [allDiscordUsers, discQ, discordRank, byDiscord]);

  const selectCharacter = useCallback(
    (c: UnmappedCharacter) => {
      setSelectedCharacter(
        currentCharacter?.characterId === c.characterId
          ? null
          : (allCharacters.find(
              (character) => character.characterId === c.characterId,
            ) ?? null),
      );
    },
    [currentCharacter, allCharacters],
  );

  const selectDiscordUser = useCallback(
    (u: UnmappedDiscordUser) => {
      setSelectedDiscordUser(
        currentDiscordUser?.discordId === u.discordId
          ? null
          : (allDiscordUsers.find((user) => user.discordId === u.discordId) ??
              null),
      );
    },
    [currentDiscordUser, allDiscordUsers],
  );

  const clearCharacter = useCallback(() => setSelectedCharacter(null), []);
  const clearDiscordUser = useCallback(() => setSelectedDiscordUser(null), []);

  const reset = useCallback(() => {
    setSelectedCharacter(null);
    setSelectedDiscordUser(null);
    setCharacterSearch("");
    setDiscordSearch("");
  }, []);

  return {
    selectedCharacter: currentCharacter,
    selectedDiscordUser: currentDiscordUser,
    canLink: Boolean(currentCharacter && currentDiscordUser),
    characterSearch,
    discordSearch,
    setCharacterSearch,
    setDiscordSearch,
    characterRows,
    discordRows,
    selectCharacter,
    selectDiscordUser,
    clearCharacter,
    clearDiscordUser,
    reset,
  };
}

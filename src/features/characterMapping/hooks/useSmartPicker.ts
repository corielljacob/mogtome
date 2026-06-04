import { useState, useMemo, useCallback, useDeferredValue } from "react";
import type {
  UnmappedCharacter,
  UnmappedDiscordUser,
  MatchPair,
  MatchInfo,
  MatchConfidence,
} from "../types";

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
  reset: () => void;
}

const info = (confidence: MatchInfo["confidence"], score = 0): MatchInfo => ({
  confidence,
  score,
});

/**
 * useSmartPicker - the smarts behind the side-by-side board. Selecting one side
 * re-sorts the other column by the system's match ranking (best first) and
 * pre-fills the confident counterpart, so the knight is guided to the pair
 * instead of hunting both lists.
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
    if (!selectedCharacter) return null;
    const ranked = getRankedDiscordUsers(selectedCharacter) ?? [];
    const m = new Map<string, { order: number; info: MatchInfo }>();
    ranked.forEach((u, i) =>
      m.set(u.discordId, { order: i, info: info(u.confidence, u.score) }),
    );
    return m;
  }, [selectedCharacter, getRankedDiscordUsers]);

  const characterRank = useMemo(() => {
    if (!selectedDiscordUser) return null;
    const ranked = getRankedCharacters(selectedDiscordUser) ?? [];
    const m = new Map<string, { order: number; info: MatchInfo }>();
    ranked.forEach((c, i) =>
      m.set(c.characterId, { order: i, info: info(c.confidence, c.score) }),
    );
    return m;
  }, [selectedDiscordUser, getRankedCharacters]);

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
      (u) => !q || u.serverNickName.toLowerCase().includes(q),
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
      if (selectedCharacter?.characterId === c.characterId) {
        setSelectedCharacter(null);
        setSelectedDiscordUser(null);
        return;
      }
      setSelectedCharacter(c);
      // Pre-fill the confident Discord suggestion (or clear for a manual pick).
      const sug = byChar.get(c.characterId);
      setSelectedDiscordUser(sug ? sug.discordUser : null);
    },
    [selectedCharacter, byChar],
  );

  const selectDiscordUser = useCallback(
    (u: UnmappedDiscordUser) => {
      if (selectedDiscordUser?.discordId === u.discordId) {
        setSelectedDiscordUser(null);
        return;
      }
      setSelectedDiscordUser(u);
      // If no character is chosen yet, pre-fill the suggested character.
      if (!selectedCharacter) {
        const sug = byDiscord.get(u.discordId);
        if (sug) setSelectedCharacter(sug.character);
      }
    },
    [selectedDiscordUser, selectedCharacter, byDiscord],
  );

  const reset = useCallback(() => {
    setSelectedCharacter(null);
    setSelectedDiscordUser(null);
    setCharacterSearch("");
    setDiscordSearch("");
  }, []);

  return {
    selectedCharacter,
    selectedDiscordUser,
    canLink: Boolean(selectedCharacter && selectedDiscordUser),
    characterSearch,
    discordSearch,
    setCharacterSearch,
    setDiscordSearch,
    characterRows,
    discordRows,
    selectCharacter,
    selectDiscordUser,
    reset,
  };
}

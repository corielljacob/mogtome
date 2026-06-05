import { useMemo, useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { characterMappingApi } from "@/api/characterMapping";
import {
  computeMatches,
  rankMatchesForCharacter,
  rankMatchesForDiscordUser,
} from "@/utils/characterMatching";
import type {
  UnmappedCharacter,
  UnmappedDiscordUser,
  MatchPair,
  MatchInfo,
} from "@/features/characterMapping/types";

// --- Types -------------------------------------------------------------------

export interface UseCharacterMappingResult {
  // Data
  allCharacters: UnmappedCharacter[];
  allDiscordUsers: UnmappedDiscordUser[];
  matchResults: ReturnType<typeof computeMatches>;

  // Visible matches (excluding dismissed)
  visibleExactMatches: MatchPair[];
  visibleSuggestedMatches: MatchPair[];
  totalMatches: number;

  // Loading/error state
  isLoading: boolean;
  isError: boolean;

  // Actions
  confirmPair: (pair: MatchPair) => void;
  dismissPair: (pair: MatchPair) => void;
  mapManually: (characterId: string, discordId: string) => Promise<void>;
  confirmAllExact: () => Promise<void>;
  refresh: () => void;

  // Mutation state
  confirmingPairKey: string | null;
  isMapping: boolean;
  isConfirmingAll: boolean;
  mappingError: Error | null;

  // Per-selection ranking for manual picker
  getRankedDiscordUsers: (
    character: UnmappedCharacter | null,
  ) => Array<UnmappedDiscordUser & MatchInfo> | null;
  getRankedCharacters: (
    discordUser: UnmappedDiscordUser | null,
  ) => Array<UnmappedCharacter & MatchInfo> | null;
}

// --- Utilities ---------------------------------------------------------------

export const pairKey = (p: MatchPair) =>
  `${p.character.characterId}::${p.discordUser.discordId}`;

function dedupeById<T extends { characterId: string } | { discordId: string }>(
  items: T[],
  getId: (item: T) => string,
): T[] {
  const map = new Map<string, T>();
  for (const item of items) {
    map.set(getId(item), item);
  }
  return Array.from(map.values());
}

// --- Hook --------------------------------------------------------------------

export function useCharacterMapping(): UseCharacterMappingResult {
  const queryClient = useQueryClient();

  // Track dismissed (skipped) pairs locally (doesn't persist across refreshes)
  const [dismissedPairs, setDismissedPairs] = useState<Set<string>>(new Set());
  const [confirmingPairKey, setConfirmingPairKey] = useState<string | null>(
    null,
  );
  // Track linked ids so a row vanishes instantly on link (before the refetch lands).
  const [linkedCharacterIds, setLinkedCharacterIds] = useState<Set<string>>(
    new Set(),
  );
  const [linkedDiscordIds, setLinkedDiscordIds] = useState<Set<string>>(
    new Set(),
  );
  const [isConfirmingAll, setIsConfirmingAll] = useState(false);

  const markLinked = useCallback((characterId: string, discordId: string) => {
    setLinkedCharacterIds((prev) => new Set(prev).add(characterId));
    setLinkedDiscordIds((prev) => new Set(prev).add(discordId));
  }, []);

  // -- Data fetching ----------------------------------------------------------

  const {
    data: charactersData,
    isLoading: isLoadingCharacters,
    isError: isCharactersError,
    refetch: refetchCharacters,
  } = useQuery({
    queryKey: ["unmapped-characters"],
    queryFn: () => characterMappingApi.getUnmappedCharacters(),
    staleTime: 1000 * 30,
  });

  const {
    data: discordUsersData,
    isLoading: isLoadingDiscordUsers,
    isError: isDiscordUsersError,
    refetch: refetchDiscordUsers,
  } = useQuery({
    queryKey: ["unmapped-discord-users"],
    queryFn: () => characterMappingApi.getUnmappedDiscordUsers(),
    staleTime: 1000 * 30,
  });

  const isLoading = isLoadingCharacters || isLoadingDiscordUsers;
  const isError = isCharactersError || isDiscordUsersError;

  // -- Normalize data ---------------------------------------------------------

  const allCharacters = useMemo(() => {
    if (!charactersData) return [];
    return dedupeById(
      [
        ...charactersData.suggestedCharacters,
        ...charactersData.unmappedCharacters,
      ],
      (c) => c.characterId,
    ).filter((c) => !linkedCharacterIds.has(c.characterId));
  }, [charactersData, linkedCharacterIds]);

  const allDiscordUsers = useMemo(() => {
    if (!discordUsersData) return [];
    return dedupeById(
      [
        ...discordUsersData.suggestedDiscordUsers,
        ...discordUsersData.unmappedDiscordUsers,
      ],
      (u) => u.discordId,
    ).filter((u) => !linkedDiscordIds.has(u.discordId));
  }, [discordUsersData, linkedDiscordIds]);

  // -- Matching ---------------------------------------------------------------

  const matchResults = useMemo(
    () => computeMatches(allCharacters, allDiscordUsers),
    [allCharacters, allDiscordUsers],
  );

  const visibleExactMatches = useMemo(
    () =>
      matchResults.exactMatches.filter((p) => !dismissedPairs.has(pairKey(p))),
    [matchResults.exactMatches, dismissedPairs],
  );

  const visibleSuggestedMatches = useMemo(
    () =>
      matchResults.suggestedMatches.filter(
        (p) => !dismissedPairs.has(pairKey(p)),
      ),
    [matchResults.suggestedMatches, dismissedPairs],
  );

  const totalMatches =
    visibleExactMatches.length + visibleSuggestedMatches.length;

  // -- Per-selection ranking --------------------------------------------------

  const getRankedDiscordUsers = useCallback(
    (character: UnmappedCharacter | null) => {
      if (!character) return null;
      return rankMatchesForCharacter(character, allDiscordUsers);
    },
    [allDiscordUsers],
  );

  const getRankedCharacters = useCallback(
    (discordUser: UnmappedDiscordUser | null) => {
      if (!discordUser) return null;
      return rankMatchesForDiscordUser(discordUser, allCharacters);
    },
    [allCharacters],
  );

  // -- Mutations --------------------------------------------------------------

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["unmapped-characters"] });
    queryClient.invalidateQueries({ queryKey: ["unmapped-discord-users"] });
    queryClient.invalidateQueries({ queryKey: ["members"] });
  }, [queryClient]);

  const mapMutation = useMutation({
    mutationFn: ({
      characterId,
      discordId,
    }: {
      characterId: string;
      discordId: string;
    }) => characterMappingApi.mapCharacter(characterId, discordId),
    onSuccess: invalidateAll,
  });

  // -- Actions ----------------------------------------------------------------

  const confirmPair = useCallback(
    (pair: MatchPair) => {
      const key = pairKey(pair);
      setConfirmingPairKey(key);
      mapMutation.mutate(
        {
          characterId: pair.character.characterId,
          discordId: pair.discordUser.discordId,
        },
        {
          onSettled: () => setConfirmingPairKey(null),
          onSuccess: () => {
            // Remove the row immediately, before the refetch lands.
            markLinked(pair.character.characterId, pair.discordUser.discordId);
          },
        },
      );
    },
    [mapMutation, markLinked],
  );

  const dismissPair = useCallback((pair: MatchPair) => {
    setDismissedPairs((prev) => new Set(prev).add(pairKey(pair)));
  }, []);

  const mapManually = useCallback(
    async (characterId: string, discordId: string) => {
      await mapMutation.mutateAsync({ characterId, discordId });
      markLinked(characterId, discordId);
    },
    [mapMutation, markLinked],
  );

  // Bulk-confirm every (visible, exact) match in one go.
  const confirmAllExact = useCallback(async () => {
    if (isConfirmingAll) return;
    setIsConfirmingAll(true);
    try {
      for (const pair of visibleExactMatches) {
        try {
          await mapMutation.mutateAsync({
            characterId: pair.character.characterId,
            discordId: pair.discordUser.discordId,
          });
          markLinked(pair.character.characterId, pair.discordUser.discordId);
        } catch {
          // Skip a failed pair and keep going with the rest.
        }
      }
    } finally {
      setIsConfirmingAll(false);
    }
  }, [isConfirmingAll, visibleExactMatches, mapMutation, markLinked]);

  const refresh = useCallback(() => {
    setDismissedPairs(new Set());
    setLinkedCharacterIds(new Set());
    setLinkedDiscordIds(new Set());
    refetchCharacters();
    refetchDiscordUsers();
  }, [refetchCharacters, refetchDiscordUsers]);

  // -- Return -----------------------------------------------------------------

  return {
    allCharacters,
    allDiscordUsers,
    matchResults,
    visibleExactMatches,
    visibleSuggestedMatches,
    totalMatches,
    isLoading,
    isError,
    confirmPair,
    dismissPair,
    mapManually,
    confirmAllExact,
    isConfirmingAll,
    refresh,
    confirmingPairKey,
    isMapping: mapMutation.isPending,
    mappingError: mapMutation.error,
    getRankedDiscordUsers,
    getRankedCharacters,
  };
}

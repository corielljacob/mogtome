import { useState, useMemo, useCallback } from 'react';
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
  Search,
  X,
  Sparkles,
  Inbox,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { characterMappingApi } from '../api/characterMapping';
import type {
  UnmappedCharacter,
  UnmappedDiscordUser,
} from '../api/characterMapping';
import { ContentCard } from './ContentCard';
import {
  computeMatches,
  rankMatchesForCharacter,
  rankMatchesForDiscordUser,
  type MatchPair,
  type MatchConfidence,
} from '../utils/characterMatching';

// --- Tab types ---------------------------------------------------------------

type TabId = 'matches' | 'manual';

// --- Confidence badge --------------------------------------------------------

const confidenceConfig: Record<
  MatchConfidence,
  { label: string; className: string }
> = {
  exact: {
    label: 'Exact Match',
    className: 'bg-green-500/15 text-green-600 dark:text-green-400',
  },
  high: {
    label: 'High',
    className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  medium: {
    label: 'Medium',
    className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
  low: {
    label: 'Low',
    className: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  },
};

function ConfidenceBadge({ confidence }: { confidence: MatchConfidence }) {
  const cfg = confidenceConfig[confidence];
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-soft font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

// --- Match pair card ---------------------------------------------------------

interface MatchPairCardProps {
  pair: MatchPair;
  onConfirm: (pair: MatchPair) => void;
  onDismiss: (pair: MatchPair) => void;
  isConfirming: boolean;
}

function MatchPairCard({
  pair,
  onConfirm,
  onDismiss,
  isConfirming,
}: MatchPairCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="
        bg-[var(--bento-bg)]/50
        border border-[var(--bento-border)]
        rounded-2xl sm:rounded-xl p-4 sm:p-3
        sm:hover:border-[var(--bento-primary)]/20
        transition-colors
      "
    >
      {/* Match info row */}
      <div className="flex items-center gap-3 mb-3">
        {/* Character side */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {pair.character.avatarLink ? (
            <img
              src={pair.character.avatarLink}
              alt=""
              className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-[var(--bento-primary)]/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-[var(--bento-primary)]" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate">
              {pair.character.name}
            </p>
            {pair.character.freeCompanyRank && (
              <p className="text-xs text-[var(--bento-text-muted)] truncate">
                {pair.character.freeCompanyRank}
              </p>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 flex items-center gap-1.5">
          <div className="w-6 h-px bg-[var(--bento-border)]" />
          <Link2 className="w-4 h-4 text-[var(--bento-text-muted)]" />
          <div className="w-6 h-px bg-[var(--bento-border)]" />
        </div>

        {/* Discord side */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <div className="min-w-0 text-right">
            <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate">
              {pair.discordUser.serverNickName}
            </p>
            <p className="text-xs text-[var(--bento-text-muted)]">Discord</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#5865F2]/15 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4 text-[#5865F2]" />
          </div>
        </div>
      </div>

      {/* Confidence + actions row */}
      <div className="flex items-center justify-between gap-2">
        <ConfidenceBadge confidence={pair.confidence} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDismiss(pair)}
            disabled={isConfirming}
            className="
              px-3 py-1.5 rounded-lg text-xs font-soft font-medium
              text-[var(--bento-text-muted)] hover:text-[var(--bento-text)]
              hover:bg-[var(--bento-bg)] transition-colors cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
            "
          >
            Skip
          </button>
          <button
            onClick={() => onConfirm(pair)}
            disabled={isConfirming}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-soft font-semibold
              bg-green-500 hover:bg-green-600 text-white
              transition-colors cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:outline-none
            "
          >
            {isConfirming ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            Confirm
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- Item components for manual picker ---------------------------------------

interface CharacterItemProps {
  character: UnmappedCharacter;
  isSelected: boolean;
  matchInfo?: { confidence: MatchConfidence; score: number };
  onClick: () => void;
  disabled?: boolean;
}

function CharacterItem({
  character,
  isSelected,
  matchInfo,
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
        border transition-all cursor-pointer touch-manipulation text-left
        focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isSelected
            ? 'bg-[var(--bento-primary)]/15 border-[var(--bento-primary)]/40'
            : matchInfo
            ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50'
            : 'bg-[var(--bento-bg)]/50 border-[var(--bento-border)] hover:border-[var(--bento-primary)]/30'
        }
      `}
    >
      {character.avatarLink ? (
        <img
          src={character.avatarLink}
          alt=""
          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-[var(--bento-primary)]/10 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-[var(--bento-primary)]" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate">
          {character.name}
        </p>
        {character.freeCompanyRank && (
          <p className="text-xs text-[var(--bento-text-muted)] truncate">
            {character.freeCompanyRank}
          </p>
        )}
      </div>
      {matchInfo && !isSelected && (
        <ConfidenceBadge confidence={matchInfo.confidence} />
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
  matchInfo?: { confidence: MatchConfidence; score: number };
  onClick: () => void;
  disabled?: boolean;
}

function DiscordUserItem({
  user,
  isSelected,
  matchInfo,
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
        border transition-all cursor-pointer touch-manipulation text-left
        focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isSelected
            ? 'bg-[var(--bento-primary)]/15 border-[var(--bento-primary)]/40'
            : matchInfo
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
          {user.serverNickName}
        </p>
        <p className="text-xs text-[var(--bento-text-muted)]">Discord Account</p>
      </div>
      {matchInfo && !isSelected && (
        <ConfidenceBadge confidence={matchInfo.confidence} />
      )}
      {isSelected && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--bento-primary)] flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.button>
  );
}

// --- Main component ----------------------------------------------------------

export function CharacterMapping() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>('matches');

  // Track pairs the user explicitly dismissed so they stop showing
  const [dismissedPairs, setDismissedPairs] = useState<Set<string>>(new Set());
  // Track which pair is currently being confirmed
  const [confirmingPairKey, setConfirmingPairKey] = useState<string | null>(
    null,
  );

  // Manual picker state
  const [selectedCharacter, setSelectedCharacter] =
    useState<UnmappedCharacter | null>(null);
  const [selectedDiscordUser, setSelectedDiscordUser] =
    useState<UnmappedDiscordUser | null>(null);
  const [characterSearch, setCharacterSearch] = useState('');
  const [discordSearch, setDiscordSearch] = useState('');

  // Collapsible sections in matches tab
  const [exactExpanded, setExactExpanded] = useState(true);
  const [suggestedExpanded, setSuggestedExpanded] = useState(true);

  // -- Data fetching ----------------------------------------------------------

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

  const isLoading = isLoadingCharacters || isLoadingDiscordUsers;
  const isError = isCharactersError || isDiscordUsersError;

  // All unmapped items (combine API suggested + unmapped into one flat list)
  const allCharacters = useMemo(() => {
    if (!charactersData) return [];
    const map = new Map<string, UnmappedCharacter>();
    for (const c of charactersData.suggestedCharacters)
      map.set(c.characterId, c);
    for (const c of charactersData.unmappedCharacters)
      map.set(c.characterId, c);
    return Array.from(map.values());
  }, [charactersData]);

  const allDiscordUsers = useMemo(() => {
    if (!discordUsersData) return [];
    const map = new Map<string, UnmappedDiscordUser>();
    for (const u of discordUsersData.suggestedDiscordUsers)
      map.set(u.discordId, u);
    for (const u of discordUsersData.unmappedDiscordUsers)
      map.set(u.discordId, u);
    return Array.from(map.values());
  }, [discordUsersData]);

  // -- FE matching engine -----------------------------------------------------

  const matchResults = useMemo(
    () => computeMatches(allCharacters, allDiscordUsers),
    [allCharacters, allDiscordUsers],
  );

  // Filter out dismissed pairs
  const pairKey = (p: MatchPair) =>
    `${p.character.characterId}::${p.discordUser.discordId}`;

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

  // -- Per-selection ranking (for manual tab) ---------------------------------

  const rankedDiscordUsers = useMemo(() => {
    if (!selectedCharacter) return null;
    return rankMatchesForCharacter(selectedCharacter, allDiscordUsers);
  }, [selectedCharacter, allDiscordUsers]);

  const rankedCharacters = useMemo(() => {
    if (!selectedDiscordUser) return null;
    return rankMatchesForDiscordUser(selectedDiscordUser, allCharacters);
  }, [selectedDiscordUser, allCharacters]);

  // Build lookup maps for match info
  const discordMatchInfo = useMemo(() => {
    if (!rankedDiscordUsers)
      return new Map<string, { confidence: MatchConfidence; score: number }>();
    return new Map(
      rankedDiscordUsers.map((u) => [
        u.discordId,
        { confidence: u.confidence, score: u.score },
      ]),
    );
  }, [rankedDiscordUsers]);

  const characterMatchInfo = useMemo(() => {
    if (!rankedCharacters)
      return new Map<string, { confidence: MatchConfidence; score: number }>();
    return new Map(
      rankedCharacters.map((c) => [
        c.characterId,
        { confidence: c.confidence, score: c.score },
      ]),
    );
  }, [rankedCharacters]);

  // -- Filtered lists for manual picker ---------------------------------------

  const filteredCharacters = useMemo(() => {
    const searchLower = characterSearch.toLowerCase().trim();
    if (!searchLower) return allCharacters;
    return allCharacters.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        (c.freeCompanyRank &&
          c.freeCompanyRank.toLowerCase().includes(searchLower)),
    );
  }, [allCharacters, characterSearch]);

  const filteredDiscordUsers = useMemo(() => {
    const searchLower = discordSearch.toLowerCase().trim();
    if (!searchLower) return allDiscordUsers;
    return allDiscordUsers.filter((u) =>
      u.serverNickName.toLowerCase().includes(searchLower),
    );
  }, [allDiscordUsers, discordSearch]);

  // Sort filtered lists: matched items first when a selection exists
  const sortedCharacters = useMemo(() => {
    if (!selectedDiscordUser || characterMatchInfo.size === 0)
      return filteredCharacters;
    return [...filteredCharacters].sort((a, b) => {
      const sa = characterMatchInfo.get(a.characterId)?.score ?? 0;
      const sb = characterMatchInfo.get(b.characterId)?.score ?? 0;
      return sb - sa;
    });
  }, [filteredCharacters, selectedDiscordUser, characterMatchInfo]);

  const sortedDiscordUsers = useMemo(() => {
    if (!selectedCharacter || discordMatchInfo.size === 0)
      return filteredDiscordUsers;
    return [...filteredDiscordUsers].sort((a, b) => {
      const sa = discordMatchInfo.get(a.discordId)?.score ?? 0;
      const sb = discordMatchInfo.get(b.discordId)?.score ?? 0;
      return sb - sa;
    });
  }, [filteredDiscordUsers, selectedCharacter, discordMatchInfo]);

  // -- Mutations --------------------------------------------------------------

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['unmapped-characters'] });
    queryClient.invalidateQueries({ queryKey: ['unmapped-discord-users'] });
    queryClient.invalidateQueries({ queryKey: ['members'] });
  }, [queryClient]);

  const mapMutation = useMutation({
    mutationFn: ({
      characterId,
      discordId,
    }: {
      characterId: string;
      discordId: string;
    }) => characterMappingApi.mapCharacter(characterId, discordId),
    onSuccess: () => {
      invalidateAll();
    },
  });

  // -- Handlers ---------------------------------------------------------------

  const handleConfirmPair = useCallback(
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
            // Also dismiss to avoid flash while query invalidates
            setDismissedPairs((prev) => new Set(prev).add(key));
          },
        },
      );
    },
    [mapMutation],
  );

  const handleDismissPair = useCallback((pair: MatchPair) => {
    setDismissedPairs((prev) => new Set(prev).add(pairKey(pair)));
  }, []);

  const handleManualConfirm = useCallback(() => {
    if (!selectedCharacter || !selectedDiscordUser) return;
    mapMutation.mutate(
      {
        characterId: selectedCharacter.characterId,
        discordId: selectedDiscordUser.discordId,
      },
      {
        onSuccess: () => {
          setSelectedCharacter(null);
          setSelectedDiscordUser(null);
          setCharacterSearch('');
          setDiscordSearch('');
        },
      },
    );
  }, [selectedCharacter, selectedDiscordUser, mapMutation]);

  const handleCharacterSelect = (character: UnmappedCharacter) => {
    if (selectedCharacter?.characterId === character.characterId) {
      setSelectedCharacter(null);
    } else {
      setSelectedCharacter(character);
    }
  };

  const handleDiscordUserSelect = (user: UnmappedDiscordUser) => {
    if (selectedDiscordUser?.discordId === user.discordId) {
      setSelectedDiscordUser(null);
    } else {
      setSelectedDiscordUser(user);
    }
  };

  const handleReset = () => {
    setSelectedCharacter(null);
    setSelectedDiscordUser(null);
    setCharacterSearch('');
    setDiscordSearch('');
  };

  const handleRefresh = () => {
    handleReset();
    setDismissedPairs(new Set());
    refetchCharacters();
    refetchDiscordUsers();
  };

  const hasAnyUnmapped =
    allCharacters.length > 0 || allDiscordUsers.length > 0;
  const canManualConfirm = selectedCharacter && selectedDiscordUser;

  // -- Render -----------------------------------------------------------------

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

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="
            p-3 sm:p-2 rounded-xl sm:rounded-lg
            bg-[var(--bento-bg)] active:bg-[var(--bento-primary)]/10 sm:hover:bg-[var(--bento-primary)]/10
            text-[var(--bento-text-muted)] active:text-[var(--bento-primary)] sm:hover:text-[var(--bento-primary)]
            transition-colors cursor-pointer touch-manipulation disabled:opacity-50
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bento-primary)] text-white font-soft font-semibold text-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
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
          {/* Tab bar */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bento-bg)]/50 mb-4 flex-shrink-0">
            <button
              onClick={() => setActiveTab('matches')}
              className={`
                flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                text-sm font-soft font-medium transition-all cursor-pointer
                focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                ${
                  activeTab === 'matches'
                    ? 'bg-[var(--bento-card)] text-[var(--bento-text)] shadow-sm'
                    : 'text-[var(--bento-text-muted)] hover:text-[var(--bento-text)]'
                }
              `}
            >
              <Zap className="w-4 h-4" />
              Smart Matches
              {totalMatches > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs bg-green-500/15 text-green-600 dark:text-green-400">
                  {totalMatches}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`
                flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                text-sm font-soft font-medium transition-all cursor-pointer
                focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                ${
                  activeTab === 'manual'
                    ? 'bg-[var(--bento-card)] text-[var(--bento-text)] shadow-sm'
                    : 'text-[var(--bento-text-muted)] hover:text-[var(--bento-text)]'
                }
              `}
            >
              <Search className="w-4 h-4" />
              Manual
              <span className="px-1.5 py-0.5 rounded-full text-xs bg-[var(--bento-bg)] text-[var(--bento-text-muted)]">
                {allCharacters.length + allDiscordUsers.length}
              </span>
            </button>
          </div>

          {/* -- Smart Matches Tab --------------------------------------------- */}
          {activeTab === 'matches' && (
            <div className="flex-1 overflow-y-auto min-h-0 space-y-4">
              {totalMatches === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--bento-primary)]/10 flex items-center justify-center mb-3">
                    <HelpCircle className="w-7 h-7 text-[var(--bento-primary)]" />
                  </div>
                  <p className="text-sm text-[var(--bento-text)] font-soft font-semibold mb-1">
                    No matches found
                  </p>
                  <p className="text-xs text-[var(--bento-text-muted)] max-w-xs">
                    The matching engine couldn&apos;t find any likely pairs. Use
                    the Manual tab to link accounts by hand.
                  </p>
                </div>
              ) : (
                <>
                  {/* Exact matches section */}
                  {visibleExactMatches.length > 0 && (
                    <div>
                      <button
                        onClick={() => setExactExpanded(!exactExpanded)}
                        className="flex items-center gap-2 mb-3 w-full text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none rounded-lg"
                      >
                        {exactExpanded ? (
                          <ChevronDown className="w-4 h-4 text-green-500" />
                        ) : (
                          <ChevronUp className="w-4 h-4 text-green-500" />
                        )}
                        <Sparkles className="w-4 h-4 text-green-500" />
                        <span className="font-soft font-semibold text-sm text-[var(--bento-text)]">
                          Exact Matches
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-soft bg-green-500/15 text-green-600 dark:text-green-400">
                          {visibleExactMatches.length}
                        </span>
                      </button>
                      <AnimatePresence mode="popLayout">
                        {exactExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 overflow-hidden"
                          >
                            {visibleExactMatches.map((pair) => (
                              <MatchPairCard
                                key={pairKey(pair)}
                                pair={pair}
                                onConfirm={handleConfirmPair}
                                onDismiss={handleDismissPair}
                                isConfirming={
                                  confirmingPairKey === pairKey(pair)
                                }
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Suggested matches section */}
                  {visibleSuggestedMatches.length > 0 && (
                    <div>
                      <button
                        onClick={() =>
                          setSuggestedExpanded(!suggestedExpanded)
                        }
                        className="flex items-center gap-2 mb-3 w-full text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none rounded-lg"
                      >
                        {suggestedExpanded ? (
                          <ChevronDown className="w-4 h-4 text-amber-500" />
                        ) : (
                          <ChevronUp className="w-4 h-4 text-amber-500" />
                        )}
                        <HelpCircle className="w-4 h-4 text-amber-500" />
                        <span className="font-soft font-semibold text-sm text-[var(--bento-text)]">
                          Suggested Matches
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-soft bg-amber-500/15 text-amber-600 dark:text-amber-400">
                          {visibleSuggestedMatches.length}
                        </span>
                      </button>
                      <AnimatePresence mode="popLayout">
                        {suggestedExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 overflow-hidden"
                          >
                            {visibleSuggestedMatches.map((pair) => (
                              <MatchPairCard
                                key={pairKey(pair)}
                                pair={pair}
                                onConfirm={handleConfirmPair}
                                onDismiss={handleDismissPair}
                                isConfirming={
                                  confirmingPairKey === pairKey(pair)
                                }
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Unmatched summary */}
                  {(matchResults.unmatchedCharacters.length > 0 ||
                    matchResults.unmatchedDiscordUsers.length > 0) && (
                    <div className="pt-2 border-t border-[var(--bento-border)]">
                      <p className="text-xs text-[var(--bento-text-muted)] font-soft">
                        {matchResults.unmatchedCharacters.length} character
                        {matchResults.unmatchedCharacters.length !== 1
                          ? 's'
                          : ''}{' '}
                        and {matchResults.unmatchedDiscordUsers.length} Discord
                        user
                        {matchResults.unmatchedDiscordUsers.length !== 1
                          ? 's'
                          : ''}{' '}
                        couldn&apos;t be auto-matched.{' '}
                        <button
                          onClick={() => setActiveTab('manual')}
                          className="text-[var(--bento-primary)] font-semibold hover:underline cursor-pointer"
                        >
                          Link them manually &rarr;
                        </button>
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* -- Manual Tab ---------------------------------------------------- */}
          {activeTab === 'manual' && (
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
                          <strong>
                            {selectedDiscordUser.serverNickName}
                          </strong>
                        </>
                      ) : selectedCharacter ? (
                        <>
                          <strong>{selectedCharacter.name}</strong> &rarr; Pick
                          a Discord account
                        </>
                      ) : selectedDiscordUser ? (
                        <>
                          <strong>
                            {selectedDiscordUser.serverNickName}
                          </strong>{' '}
                          &rarr; Pick a character
                        </>
                      ) : null}
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
                      {filteredCharacters.length}
                    </span>
                  </div>

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
                        text-sm text-[var(--bento-text)] placeholder:text-[var(--bento-text-muted)]
                        focus:outline-none focus:border-[var(--bento-primary)]/40 transition-colors
                      "
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0 max-h-[300px] lg:max-h-none">
                    <AnimatePresence mode="popLayout">
                      {sortedCharacters.map((character) => (
                        <CharacterItem
                          key={character.characterId}
                          character={character}
                          isSelected={
                            selectedCharacter?.characterId ===
                            character.characterId
                          }
                          matchInfo={
                            selectedDiscordUser
                              ? characterMatchInfo.get(character.characterId)
                              : undefined
                          }
                          onClick={() => handleCharacterSelect(character)}
                        />
                      ))}
                      {filteredCharacters.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <Inbox className="w-8 h-8 text-[var(--bento-text-muted)] mb-2" />
                          <p className="text-sm text-[var(--bento-text-muted)]">
                            {characterSearch
                              ? 'No characters match your search'
                              : 'No unmapped characters'}
                          </p>
                        </div>
                      )}
                    </AnimatePresence>
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
                      {filteredDiscordUsers.length}
                    </span>
                  </div>

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
                        text-sm text-[var(--bento-text)] placeholder:text-[var(--bento-text-muted)]
                        focus:outline-none focus:border-[var(--bento-primary)]/40 transition-colors
                      "
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0 max-h-[300px] lg:max-h-none">
                    <AnimatePresence mode="popLayout">
                      {sortedDiscordUsers.map((user) => (
                        <DiscordUserItem
                          key={user.discordId}
                          user={user}
                          isSelected={
                            selectedDiscordUser?.discordId === user.discordId
                          }
                          matchInfo={
                            selectedCharacter
                              ? discordMatchInfo.get(user.discordId)
                              : undefined
                          }
                          onClick={() => handleDiscordUserSelect(user)}
                        />
                      ))}
                      {filteredDiscordUsers.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <Inbox className="w-8 h-8 text-[var(--bento-text-muted)] mb-2" />
                          <p className="text-sm text-[var(--bento-text-muted)]">
                            {discordSearch
                              ? 'No users match your search'
                              : 'No unmapped Discord users'}
                          </p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Manual confirm button */}
              <AnimatePresence>
                {canManualConfirm && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-4 flex-shrink-0"
                  >
                    <button
                      onClick={handleManualConfirm}
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
                          {selectedDiscordUser?.serverNickName}
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
        </div>
      )}
    </ContentCard>
  );
}

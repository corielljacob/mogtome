import { useState, useCallback } from 'react';
import {
  Link2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Check,
  Search,
  Zap,
} from 'lucide-react';
import { ContentCard } from '../../components/ContentCard';
import { useCharacterMapping, useManualPicker } from './hooks';
import { EmptyState, SmartMatchesTab, ManualPickerTab } from './components';
import type { TabId } from './types';

export function CharacterMapping() {
  const [activeTab, setActiveTab] = useState<TabId>('matches');

  // -- Custom hooks -----------------------------------------------------------

  const {
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
    refresh,
    confirmingPairKey,
    isMapping,
    mappingError,
    getRankedDiscordUsers,
    getRankedCharacters,
  } = useCharacterMapping();

  const {
    selectedCharacter,
    selectedDiscordUser,
    canConfirm,
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
    reset: resetPicker,
  } = useManualPicker({
    allCharacters,
    allDiscordUsers,
    getRankedDiscordUsers,
    getRankedCharacters,
  });

  // -- Handlers ---------------------------------------------------------------

  const handleManualConfirm = useCallback(async () => {
    if (!selectedCharacter || !selectedDiscordUser) return;
    try {
      await mapManually(selectedCharacter.characterId, selectedDiscordUser.discordId);
      resetPicker();
    } catch {
      // Error is surfaced via mappingError from the hook
    }
  }, [selectedCharacter, selectedDiscordUser, mapManually, resetPicker]);

  const handleRefresh = useCallback(() => {
    resetPicker();
    refresh();
  }, [resetPicker, refresh]);

  const handleSwitchToManual = useCallback(() => {
    setActiveTab('manual');
  }, []);

  const hasAnyUnmapped = allCharacters.length > 0 || allDiscordUsers.length > 0;

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
        <EmptyState
          icon={<AlertCircle className="w-7 h-7 text-red-500" />}
          title="Failed to load unmapped accounts"
          subtitle="Something went wrong, kupo..."
          className="flex-1"
          action={
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bento-primary)] text-white font-soft font-semibold text-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          }
        />
      ) : !hasAnyUnmapped ? (
        <EmptyState
          icon={<Check className="w-7 h-7 text-green-500" />}
          title="All accounts mapped!"
          subtitle="Every character is linked to a Discord account, kupo~"
          className="flex-1"
        />
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

          {/* Tab content */}
          {activeTab === 'matches' && (
            <SmartMatchesTab
              visibleExactMatches={visibleExactMatches}
              visibleSuggestedMatches={visibleSuggestedMatches}
              totalMatches={totalMatches}
              unmatchedCharacters={matchResults.unmatchedCharacters}
              unmatchedDiscordUsers={matchResults.unmatchedDiscordUsers}
              confirmingPairKey={confirmingPairKey}
              onConfirmPair={confirmPair}
              onDismissPair={dismissPair}
              onSwitchToManual={handleSwitchToManual}
            />
          )}

          {activeTab === 'manual' && (
            <ManualPickerTab
              selectedCharacter={selectedCharacter}
              selectedDiscordUser={selectedDiscordUser}
              canConfirm={canConfirm}
              characterSearch={characterSearch}
              discordSearch={discordSearch}
              onCharacterSearchChange={setCharacterSearch}
              onDiscordSearchChange={setDiscordSearch}
              sortedCharacters={sortedCharacters}
              sortedDiscordUsers={sortedDiscordUsers}
              characterMatchInfo={characterMatchInfo}
              discordMatchInfo={discordMatchInfo}
              onSelectCharacter={selectCharacter}
              onSelectDiscordUser={selectDiscordUser}
              onReset={resetPicker}
              onConfirm={handleManualConfirm}
              isMapping={isMapping}
              mappingError={mappingError}
            />
          )}
        </div>
      )}
    </ContentCard>
  );
}

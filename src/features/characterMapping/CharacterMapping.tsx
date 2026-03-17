import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Link2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Check,
  Search,
  Zap,
  X,
  Sparkles,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { ContentCard } from '../../components/ContentCard';
import { useCharacterMapping, useManualPicker } from './hooks';
import { EmptyState, AutoMatchesTab, ManualPickerTab } from './components';
import type { TabId } from './types';

export function CharacterMapping() {
  const [isOpen, setIsOpen] = useState(false);
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
    selectCharacter,
    selectDiscordUser,
    reset: resetPicker,
  } = useManualPicker({
    allCharacters,
    allDiscordUsers,
  });

  // -- Effects ----------------------------------------------------------------

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

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

  // -- Render: Trigger card (sits in the bento grid) -------------------------

  const triggerCard = (
    <div
      onClick={() => setIsOpen(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen(true);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Open Character Mapping"
      className="cursor-pointer group"
    >
      <ContentCard className="h-full flex flex-col group-hover:border-[var(--bento-primary)]/25 transition-colors">
        <div className="flex items-start justify-between gap-3">
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
          <ChevronRight className="w-5 h-5 text-[var(--bento-text-muted)] group-hover:text-[var(--bento-primary)] transition-colors mt-2" />
        </div>

        <div className="flex-1 flex items-center justify-center py-6 sm:py-8">
          {isLoading ? (
            <Loader2 className="w-6 h-6 text-[var(--bento-primary)] animate-spin" />
          ) : isError ? (
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-[var(--bento-text-muted)] font-soft">
                Error loading data
              </p>
            </div>
          ) : !hasAnyUnmapped ? (
            <div className="text-center">
              <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-[var(--bento-text-muted)] font-soft">
                All accounts mapped!
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-6 text-center">
              <div>
                <p className="text-2xl font-display font-bold text-[var(--bento-text)]">
                  {allCharacters.length}
                </p>
                <p className="text-xs text-[var(--bento-text-muted)] font-soft">
                  Unmapped Characters
                </p>
              </div>
              {totalMatches > 0 && (
                <>
                  <div className="w-px h-8 bg-[var(--bento-border)]" />
                  <div>
                    <p className="text-2xl font-display font-bold text-green-500">
                      {totalMatches}
                    </p>
                    <p className="text-xs text-[var(--bento-text-muted)] font-soft">
                      Auto Matches
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </ContentCard>
    </div>
  );

  // -- Render: Full-screen overlay --------------------------------------------

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col bg-[var(--bento-bg)]"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex-shrink-0 border-b border-[var(--bento-border)]/50 bg-[var(--bento-bg)]/80 backdrop-blur-lg">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="
                    p-2 -ml-2 rounded-xl
                    text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] hover:bg-[var(--bento-card)]
                    transition-colors cursor-pointer
                    focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                  "
                  aria-label="Close"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400/15 to-cyan-400/15 flex items-center justify-center">
                    <Link2
                      className="w-4 h-4 text-blue-500"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h1 className="font-display font-semibold text-base sm:text-lg text-[var(--bento-text)]">
                      Character Mapping
                    </h1>
                    <p className="text-xs text-[var(--bento-text-muted)] hidden sm:block">
                      Link characters to Discord accounts
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="
                  p-2.5 sm:p-2 rounded-xl sm:rounded-lg
                  bg-[var(--bento-card)] hover:bg-[var(--bento-primary)]/10
                  text-[var(--bento-text-muted)] hover:text-[var(--bento-primary)]
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
          </div>

          {/* Content area — fills remaining viewport */}
          <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 w-full flex-1 flex flex-col min-h-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
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
                />
              ) : (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Tab bar */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bento-card)]/50 mb-4 sm:mb-6 max-w-xs flex-shrink-0">
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
                      Auto
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
                    </button>
                  </div>

                  {/* Tab content */}
                  {activeTab === 'matches' && (
                    <AutoMatchesTab
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
                      characterSearch={characterSearch}
                      discordSearch={discordSearch}
                      onCharacterSearchChange={setCharacterSearch}
                      onDiscordSearchChange={setDiscordSearch}
                      sortedCharacters={sortedCharacters}
                      sortedDiscordUsers={sortedDiscordUsers}
                      onSelectCharacter={selectCharacter}
                      onSelectDiscordUser={selectDiscordUser}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Fixed bottom bar — selection indicator + Link button */}
          <AnimatePresence>
            {(selectedCharacter || selectedDiscordUser) && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative z-10 flex-shrink-0 border-t border-[var(--bento-border)]/50 bg-[var(--bento-bg)]/80 backdrop-blur-lg"
              >
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
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
                            <strong>{selectedCharacter.name}</strong> &rarr;{' '}
                            Pick a Discord account
                          </>
                        ) : (
                          <>
                            <strong>
                              {selectedDiscordUser!.serverNickName}
                            </strong>{' '}
                            &rarr; Pick a character
                          </>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={resetPicker}
                      className="flex-shrink-0 p-1.5 rounded-lg hover:bg-[var(--bento-card)] text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] transition-colors cursor-pointer"
                      aria-label="Clear selection"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {canConfirm && (
                    <div>
                      <button
                        onClick={handleManualConfirm}
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
                        <p className="mt-2 text-sm text-red-500 text-center">
                          Failed to create link. Please try again.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {triggerCard}
      {createPortal(overlay, document.body)}
    </>
  );
}

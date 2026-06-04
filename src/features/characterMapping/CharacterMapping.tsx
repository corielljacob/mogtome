import { useState, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Link2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Check,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  X,
} from "lucide-react";
import { ContentCard } from "../../components/ContentCard";
import { Button, IconButton } from "../../components/Button";
import { DiscordIcon } from "../../components/DiscordIcon";
import { useCharacterMapping, useSmartPicker } from "./hooks";
import {
  EmptyState,
  CharacterItem,
  DiscordUserItem,
  SearchInput,
} from "./components";
import FfxivIcon from "../../assets/icons/ffxiv.png";

export function CharacterMapping() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    allCharacters,
    allDiscordUsers,
    visibleExactMatches,
    visibleSuggestedMatches,
    totalMatches,
    isLoading,
    isError,
    mapManually,
    confirmAllExact,
    isConfirmingAll,
    isMapping,
    refresh,
    getRankedDiscordUsers,
    getRankedCharacters,
  } = useCharacterMapping();

  const suggestedPairs = useMemo(
    () => [...visibleExactMatches, ...visibleSuggestedMatches],
    [visibleExactMatches, visibleSuggestedMatches],
  );

  const {
    selectedCharacter,
    selectedDiscordUser,
    canLink,
    characterSearch,
    discordSearch,
    setCharacterSearch,
    setDiscordSearch,
    characterRows,
    discordRows,
    selectCharacter,
    selectDiscordUser,
    reset: resetPicker,
  } = useSmartPicker({
    allCharacters,
    allDiscordUsers,
    suggestedPairs,
    getRankedDiscordUsers,
    getRankedCharacters,
  });

  // -- Effects ----------------------------------------------------------------

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  // -- Handlers ---------------------------------------------------------------

  const handleRefresh = useCallback(() => {
    resetPicker();
    refresh();
  }, [resetPicker, refresh]);

  const handleLink = useCallback(async () => {
    if (!selectedCharacter || !selectedDiscordUser) return;
    try {
      await mapManually(
        selectedCharacter.characterId,
        selectedDiscordUser.discordId,
      );
      resetPicker();
    } catch {
      // surfaced via the hook's mapping state
    }
  }, [selectedCharacter, selectedDiscordUser, mapManually, resetPicker]);

  const hasAnyUnmapped = allCharacters.length > 0 || allDiscordUsers.length > 0;
  const exactCount = visibleExactMatches.length;

  // -- Render: Trigger card ---------------------------------------------------

  const triggerCard = (
    <div
      onClick={() => setIsOpen(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Open Character Mapping"
      className="cursor-pointer group"
    >
      <ContentCard className="h-full flex flex-col group-hover:border-[var(--primary)]/25 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <span className="icon-badge w-10 h-10 shrink-0 text-[var(--primary)]">
              <Link2 className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-[var(--text)]">
                Character Mapping
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
                Link characters to Discord accounts
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors mt-2" />
        </div>

        <div className="flex-1 flex items-center justify-center py-6 sm:py-8">
          {isLoading ? (
            <Loader2 className="w-6 h-6 text-[var(--primary)] animate-spin" />
          ) : isError ? (
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-[var(--text-muted)] font-soft">
                Error loading data
              </p>
            </div>
          ) : !hasAnyUnmapped ? (
            <div className="text-center">
              <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-[var(--text-muted)] font-soft">
                All accounts mapped!
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-6 text-center">
              <div>
                <p className="text-2xl font-display font-bold text-[var(--text)]">
                  {allCharacters.length}
                </p>
                <p className="text-xs text-[var(--text-muted)] font-soft">
                  To Link
                </p>
              </div>
              {totalMatches > 0 && (
                <>
                  <div className="w-px h-8 bg-[var(--border)]" />
                  <div>
                    <p className="text-2xl font-display font-bold text-green-500">
                      {totalMatches}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] font-soft">
                      Suggested
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

  const countPill = (n: number) => (
    <span className="px-2 py-0.5 rounded-full text-xs font-soft font-bold bg-[color:color-mix(in_srgb,var(--primary)_12%,var(--card))] text-[var(--text-muted)]">
      {n}
    </span>
  );

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/[0.05] via-transparent to-[var(--secondary)]/[0.04] pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex-shrink-0 border-b border-[var(--border)]/50 bg-[var(--bg)]/80">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <IconButton
                  variant="ghost"
                  size="md"
                  icon={<ArrowLeft className="w-5 h-5" />}
                  aria-label="Close"
                  onClick={() => setIsOpen(false)}
                  className="-ml-1"
                />
                <div className="flex items-center gap-2.5">
                  <span className="icon-badge w-9 h-9 shrink-0 text-[var(--primary)]">
                    <Link2 className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h1 className="font-display font-bold text-base sm:text-lg text-[var(--text)]">
                      Character Mapping
                    </h1>
                    <p className="text-xs text-[var(--text-muted)] hidden sm:block">
                      Link characters to Discord accounts
                    </p>
                  </div>
                </div>
              </div>

              <IconButton
                variant="ghost"
                size="md"
                icon={
                  <RefreshCw
                    className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                  />
                }
                aria-label="Refresh unmapped lists"
                onClick={handleRefresh}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex-1 flex flex-col min-h-0">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5 w-full flex-1 flex flex-col min-h-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center flex-1 py-16">
                  <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin mb-3" />
                  <p className="text-sm text-[var(--text-muted)] font-soft">
                    Loading unmapped accounts...
                  </p>
                </div>
              ) : isError ? (
                <EmptyState
                  icon={<AlertCircle className="w-7 h-7 text-red-500" />}
                  title="Failed to load unmapped accounts"
                  subtitle="Something went wrong, kupo..."
                  action={
                    <Button variant="primary" size="sm" onClick={handleRefresh}>
                      <RefreshCw className="w-4 h-4" aria-hidden="true" />
                      Try Again
                    </Button>
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
                  {/* Action bar */}
                  <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4 flex-shrink-0">
                    <p className="text-sm font-soft text-[var(--text-muted)]">
                      Pick a character, then its Discord account, kupo~
                    </p>
                    {exactCount > 0 && (
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={isConfirmingAll}
                        onClick={() => confirmAllExact()}
                        className="shrink-0"
                      >
                        {!isConfirmingAll && (
                          <Check className="w-4 h-4" aria-hidden="true" />
                        )}
                        Confirm {exactCount} exact{" "}
                        {exactCount === 1 ? "match" : "matches"}
                      </Button>
                    )}
                  </div>

                  {/* Two columns */}
                  <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto lg:overflow-visible">
                    {/* Characters */}
                    <div className="flex flex-col min-h-0">
                      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                        <img src={FfxivIcon} alt="" className="w-5 h-5" />
                        <h3 className="font-display font-bold text-sm text-[var(--text)]">
                          Characters
                        </h3>
                        {countPill(characterRows.length)}
                      </div>
                      <SearchInput
                        value={characterSearch}
                        onChange={setCharacterSearch}
                        placeholder="Search characters..."
                      />
                      <div className="space-y-2 lg:flex-1 lg:overflow-y-auto lg:min-h-0 pr-1">
                        {characterRows.length === 0 ? (
                          <p className="text-sm text-[var(--text-muted)] font-soft text-center py-6">
                            {characterSearch
                              ? "No characters match, kupo~"
                              : "Every character is linked, kupo!"}
                          </p>
                        ) : (
                          characterRows.map(({ character, matchInfo }) => (
                            <CharacterItem
                              key={character.characterId}
                              character={character}
                              isSelected={
                                selectedCharacter?.characterId ===
                                character.characterId
                              }
                              matchInfo={matchInfo}
                              onClick={() => selectCharacter(character)}
                              disabled={isMapping}
                            />
                          ))
                        )}
                      </div>
                    </div>

                    {/* Discord accounts */}
                    <div className="flex flex-col min-h-0">
                      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                        <DiscordIcon
                          className="h-4 text-[#5865F2]"
                          aria-hidden="true"
                        />
                        <h3 className="font-display font-bold text-sm text-[var(--text)]">
                          Discord Accounts
                        </h3>
                        {countPill(discordRows.length)}
                      </div>
                      <SearchInput
                        value={discordSearch}
                        onChange={setDiscordSearch}
                        placeholder="Search Discord users..."
                      />
                      <div className="space-y-2 lg:flex-1 lg:overflow-y-auto lg:min-h-0 pr-1">
                        {discordRows.length === 0 ? (
                          <p className="text-sm text-[var(--text-muted)] font-soft text-center py-6">
                            {discordSearch
                              ? "No accounts match, kupo~"
                              : "Every account is linked, kupo!"}
                          </p>
                        ) : (
                          discordRows.map(({ user, matchInfo }) => (
                            <DiscordUserItem
                              key={user.discordId}
                              user={user}
                              isSelected={
                                selectedDiscordUser?.discordId === user.discordId
                              }
                              matchInfo={matchInfo}
                              onClick={() => selectDiscordUser(user)}
                              disabled={isMapping}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Link bar */}
          <AnimatePresence>
            {(selectedCharacter || selectedDiscordUser) && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 26, stiffness: 320 }}
                className="relative z-10 flex-shrink-0 border-t border-[var(--border)]/60 bg-[var(--bg)]/90"
              >
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1 text-sm">
                    <span className="font-display font-semibold text-[var(--text)] truncate">
                      {selectedCharacter?.name ?? "Pick a character"}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[var(--text-subtle)] shrink-0" />
                    <span
                      className={`font-display font-semibold truncate ${selectedDiscordUser ? "text-[var(--text)]" : "text-[var(--text-subtle)]"}`}
                    >
                      {selectedDiscordUser?.serverNickName ??
                        "Pick a Discord account"}
                    </span>
                  </div>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon={<X className="w-4 h-4" />}
                    aria-label="Clear selection"
                    onClick={resetPicker}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={isMapping}
                    disabled={!canLink}
                    onClick={handleLink}
                    className="shrink-0"
                  >
                    {!isMapping && (
                      <Link2 className="w-4 h-4" aria-hidden="true" />
                    )}
                    Link
                  </Button>
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

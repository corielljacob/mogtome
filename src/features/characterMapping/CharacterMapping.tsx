import { useState, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, AlertCircle, RefreshCw, Check } from "lucide-react";
import { Button } from "../../components/Button";
import { DiscordIcon } from "../../components/DiscordIcon";
import { useCharacterMapping } from "./hooks/useCharacterMapping";
import { useSmartPicker } from "./hooks/useSmartPicker";
import { EmptyState } from "./components/EmptyState";
import { CharacterItem } from "./components/CharacterItem";
import { DiscordUserItem } from "./components/DiscordUserItem";
import { TriggerCard } from "./components/TriggerCard";
import { OverlayHeader } from "./components/OverlayHeader";
import { MappingColumn } from "./components/MappingColumn";
import { LinkBar } from "./components/LinkBar";
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

          <OverlayHeader
            onClose={() => setIsOpen(false)}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />

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

                  <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto lg:overflow-visible">
                    <MappingColumn
                      icon={<img src={FfxivIcon} alt="" className="w-5 h-5" />}
                      title="Characters"
                      count={characterRows.length}
                      searchValue={characterSearch}
                      onSearchChange={setCharacterSearch}
                      searchPlaceholder="Search characters..."
                      isEmpty={characterRows.length === 0}
                      emptyMessage={
                        characterSearch
                          ? "No characters match, kupo~"
                          : "Every character is linked, kupo!"
                      }
                    >
                      {characterRows.map(({ character, matchInfo }) => (
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
                      ))}
                    </MappingColumn>

                    <MappingColumn
                      icon={
                        <DiscordIcon
                          className="h-4 text-[#5865F2]"
                          aria-hidden="true"
                        />
                      }
                      title="Discord Accounts"
                      count={discordRows.length}
                      searchValue={discordSearch}
                      onSearchChange={setDiscordSearch}
                      searchPlaceholder="Search Discord users..."
                      isEmpty={discordRows.length === 0}
                      emptyMessage={
                        discordSearch
                          ? "No accounts match, kupo~"
                          : "Every account is linked, kupo!"
                      }
                    >
                      {discordRows.map(({ user, matchInfo }) => (
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
                      ))}
                    </MappingColumn>
                  </div>
                </div>
              )}
            </div>
          </div>

          <LinkBar
            show={Boolean(selectedCharacter || selectedDiscordUser)}
            characterName={selectedCharacter?.name}
            discordName={selectedDiscordUser?.serverNickName}
            canLink={canLink}
            isMapping={isMapping}
            onClear={resetPicker}
            onLink={handleLink}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <TriggerCard
        onOpen={() => setIsOpen(true)}
        isLoading={isLoading}
        isError={isError}
        hasAnyUnmapped={hasAnyUnmapped}
        charactersCount={allCharacters.length}
        totalMatches={totalMatches}
      />
      {createPortal(overlay, document.body)}
    </>
  );
}

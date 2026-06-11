import { useState, useCallback, useMemo, type ReactNode } from "react";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Wand2,
  Link2,
} from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import { DiscordIcon } from "@/shared/ui/DiscordIcon";
import { useCharacterMapping } from "@/features/characterMapping/hooks/useCharacterMapping";
import { useSmartPicker } from "@/features/characterMapping/hooks/useSmartPicker";
import { EmptyState } from "@/features/characterMapping/components/EmptyState";
import { CharacterItem } from "@/features/characterMapping/components/CharacterItem";
import { DiscordUserItem } from "@/features/characterMapping/components/DiscordUserItem";
import { TriggerCard } from "@/features/characterMapping/components/TriggerCard";
import { MappingColumn } from "@/features/characterMapping/components/MappingColumn";
import { LinkBar } from "@/features/characterMapping/components/LinkBar";
import { SuggestedPairs } from "@/features/characterMapping/components/SuggestedPairs";
import FfxivIcon from "@/assets/icons/ffxiv.png";
import happyMoogle from "@/assets/moogles/illustrated moogle.webp";

type Tab = "suggested" | "manual";

// segmented tab pill
function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-display font-bold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
        active
          ? "bg-[var(--primary)] text-white shadow-[0_2px_0_0_color-mix(in_srgb,var(--primary)_55%,#000)]"
          : "text-[var(--text-muted)] hover:text-[var(--text)]"
      }`}
    >
      {icon}
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={`ml-0.5 rounded-full px-1.5 text-xs font-bold ${
            active
              ? "bg-white/25 text-white"
              : "bg-[color:color-mix(in_srgb,var(--primary)_14%,var(--card))] text-[var(--text-muted)]"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function CharacterMapping() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("suggested");

  const {
    allCharacters,
    allDiscordUsers,
    visibleExactMatches,
    visibleSuggestedMatches,
    totalMatches,
    isLoading,
    isError,
    confirmPair,
    dismissPair,
    confirmingPairKey,
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

  const goManual = useCallback(() => setTab("manual"), []);

  const hasAnyUnmapped = allCharacters.length > 0 || allDiscordUsers.length > 0;
  const exactCount = visibleExactMatches.length;
  const showTabs = !isLoading && !isError && hasAnyUnmapped;

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

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        size="xl"
        padded={false}
        scroll={false}
        icon={<Link2 className="w-5 h-5" aria-hidden="true" />}
        title="Character Mapping"
        eyebrow="~ pair up our moogles, kupo ~"
        headerActions={
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Refresh unmapped lists"
            className="shrink-0 grid place-items-center w-9 h-9 rounded-full border-2 border-white bg-[color:color-mix(in_srgb,var(--primary)_18%,var(--card))] text-[var(--primary)] shadow-[0_3px_8px_-3px_var(--shadow)] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 hover:rotate-[-12deg] active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        }
        footer={
          <LinkBar
            show={
              tab === "manual" &&
              Boolean(selectedCharacter || selectedDiscordUser)
            }
            characterName={selectedCharacter?.name}
            discordName={selectedDiscordUser?.serverNickName}
            canLink={canLink}
            isMapping={isMapping}
            onClear={resetPicker}
            onLink={handleLink}
          />
        }
      >
        <div className="flex flex-1 min-h-0 flex-col">
          {showTabs && (
            <div className="shrink-0 px-4 pt-3 pb-1">
              <div className="mx-auto flex w-fit gap-1 rounded-full border-2 border-[color:color-mix(in_srgb,var(--primary)_14%,var(--border))] bg-[var(--card)] p-1 shadow-[0_2px_8px_-5px_var(--shadow)]">
                <TabButton
                  active={tab === "suggested"}
                  onClick={() => setTab("suggested")}
                  icon={<Sparkles className="w-4 h-4" aria-hidden="true" />}
                  label="Suggested"
                  count={suggestedPairs.length}
                />
                <TabButton
                  active={tab === "manual"}
                  onClick={() => setTab("manual")}
                  icon={<Wand2 className="w-4 h-4" aria-hidden="true" />}
                  label="By hand"
                />
              </div>
            </div>
          )}

          <div className="flex-1 min-h-0 flex flex-col px-4 sm:px-5 pt-2 pb-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center flex-1 py-16">
                <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin mb-3" />
                <p className="text-sm text-[var(--text-muted)] font-soft">
                  Loading unmapped accounts...
                </p>
              </div>
            ) : isError ? (
              <EmptyState
                className="flex-1"
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
              <div className="flex flex-1 flex-col items-center justify-center text-center py-10">
                <img
                  src={happyMoogle}
                  alt=""
                  aria-hidden="true"
                  className="w-24 sm:w-28 mb-3 object-contain animate-[float-gentle_4s_ease-in-out_infinite]"
                />
                <p className="font-display font-bold text-lg text-[var(--text)]">
                  All accounts mapped!
                </p>
                <p className="font-soft text-sm text-[var(--text-muted)] mt-1">
                  Every character is linked to a Discord account, kupo~
                </p>
              </div>
            ) : tab === "suggested" ? (
              <SuggestedPairs
                pairs={suggestedPairs}
                exactCount={exactCount}
                confirmingPairKey={confirmingPairKey}
                isConfirmingAll={isConfirmingAll}
                onConfirm={confirmPair}
                onSkip={dismissPair}
                onConfirmAllExact={confirmAllExact}
                onGoManual={goManual}
              />
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <p className="text-sm font-soft text-[var(--text-muted)] mb-3 shrink-0">
                  Pick a character, then its Discord account, kupo~
                </p>

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
      </Modal>
    </>
  );
}

import { useCallback, useMemo, useRef, useState } from "react";
import { Modal } from "@/shared/ui/Modal";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { DashboardIcon } from "@/features/knights/DashboardIcons";
import {
  useCharacterMapping,
  type UseCharacterMappingResult,
} from "./hooks/useCharacterMapping";
import { useSmartPicker } from "./hooks/useSmartPicker";
import { EmptyState } from "./components/EmptyState";
import { CharacterItem } from "./components/CharacterItem";
import { DiscordUserItem } from "./components/DiscordUserItem";
import { TriggerCard } from "./components/TriggerCard";
import { MappingColumn } from "./components/MappingColumn";
import { LinkBar } from "./components/LinkBar";
import { SuggestedPairs } from "./components/SuggestedPairs";
import { MappingPlatformIcon } from "./components/MappingPlatformIcon";
import type { MatchPair } from "./types";
import "./character-mapping.css";

type MappingTab = "suggested" | "manual";
interface CharacterMappingProps {
  embedded?: boolean;
  initialTab?: MappingTab;
  mapping?: UseCharacterMappingResult;
  tab?: MappingTab;
  onTabChange?: (tab: MappingTab) => void;
}

export function CharacterMapping(props: CharacterMappingProps) {
  return props.mapping ? (
    <MappingWorkspace {...props} mapping={props.mapping} />
  ) : (
    <ConnectedMapping {...props} />
  );
}

function ConnectedMapping(props: CharacterMappingProps) {
  const mapping = useCharacterMapping();
  return <MappingWorkspace {...props} mapping={mapping} />;
}

function MappingWorkspace({
  embedded = false,
  initialTab = "suggested",
  mapping,
  tab: controlledTab,
  onTabChange,
}: CharacterMappingProps & { mapping: UseCharacterMappingResult }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localTab, setLocalTab] = useState<MappingTab>(initialTab);
  const [success, setSuccess] = useState("");
  const reducedMotion = useReducedMotion();
  const characterInput = useRef<HTMLInputElement>(null);
  const discordInput = useRef<HTMLInputElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const tab = controlledTab ?? localTab;
  const {
    allCharacters,
    allDiscordUsers,
    visibleExactMatches,
    visibleSuggestedMatches,
    totalMatches,
    isLoading,
    isError,
    isFetching,
    confirmPair,
    dismissPair,
    confirmingPairKey,
    mapManually,
    confirmAllExact,
    isConfirmingAll,
    isMapping,
    mappingError,
    refresh,
    getRankedDiscordUsers,
    getRankedCharacters,
  } = mapping;
  const busy = isMapping || isConfirmingAll || confirmingPairKey !== null;
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
    clearCharacter,
    clearDiscordUser,
    reset: resetPicker,
  } = useSmartPicker({
    allCharacters,
    allDiscordUsers,
    suggestedPairs,
    getRankedDiscordUsers,
    getRankedCharacters,
  });
  const chooseTab = (next: MappingTab) => {
    if (busy) return;
    setLocalTab(next);
    onTabChange?.(next);
  };
  const handleRefresh = useCallback(() => {
    if (busy || isFetching) return;
    setSuccess("");
    resetPicker();
    refresh();
  }, [busy, isFetching, resetPicker, refresh]);
  const focusFeedback = (trigger: Element | null, failed = false) => {
    requestAnimationFrame(() => {
      if (
        document.activeElement === trigger ||
        (!trigger?.isConnected && document.activeElement === document.body)
      ) {
        (failed ? errorRef.current : feedbackRef.current)?.focus({
          preventScroll: !failed,
        });
      }
    });
  };
  const handleLink = async () => {
    if (!selectedCharacter || !selectedDiscordUser || !canLink || busy) return;
    setSuccess("");
    const trigger = document.activeElement;
    try {
      await mapManually(
        selectedCharacter.characterId,
        selectedDiscordUser.discordId,
      );
      setSuccess(
        `Linked ${selectedCharacter.name} to ${selectedDiscordUser.serverNickName}.`,
      );
      resetPicker();
      focusFeedback(trigger);
    } catch {
      focusFeedback(trigger, true);
    }
  };
  const handleConfirm = async (pair: MatchPair) => {
    if (busy) return;
    const trigger = document.activeElement;
    setSuccess("");
    try {
      await confirmPair(pair);
      setSuccess(
        `Linked ${pair.character.name} to ${pair.discordUser.serverNickName}.`,
      );
      focusFeedback(trigger);
    } catch {
      focusFeedback(trigger, true);
    }
  };
  const changeCharacter = () => {
    clearCharacter();
    setCharacterSearch("");
    setSuccess("");
    characterInput.current?.focus();
  };
  const changeDiscord = () => {
    clearDiscordUser();
    setDiscordSearch("");
    setSuccess("");
    discordInput.current?.focus();
  };
  const hasAnyUnmapped = allCharacters.length > 0 || allDiscordUsers.length > 0;
  const content = (
    <section className="dash-mapping" aria-label="Character linking">
      <div className="dash-mapping-toolbar">
        <div
          className="dash-mapping-segments"
          role="group"
          aria-label="Linking method"
        >
          <button
            type="button"
            aria-pressed={tab === "suggested"}
            disabled={busy}
            onClick={() => chooseTab("suggested")}
          >
            <DashboardIcon name="sparkles" size={17} /> Suggestions
            {totalMatches > 0 && (
              <span className="dash-mapping-count">{totalMatches}</span>
            )}
          </button>
          <button
            type="button"
            aria-pressed={tab === "manual"}
            disabled={busy}
            onClick={() => chooseTab("manual")}
          >
            <DashboardIcon name="people" size={17} /> Choose by hand
          </button>
        </div>
        <button
          type="button"
          className="dash-mapping-text-button"
          onClick={handleRefresh}
          disabled={isLoading || isFetching || busy}
          aria-label="Refresh unlinked accounts"
        >
          <DashboardIcon name="refresh" size={17} />
          {isFetching && !isLoading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <p className="dash-mapping-summary" role="status" aria-atomic="true">
        {busy
          ? "Linking accounts…"
          : isLoading
            ? "Loading unlinked accounts…"
            : isError
              ? "Account lists unavailable"
              : `${allCharacters.length} ${allCharacters.length === 1 ? "character" : "characters"} and ${allDiscordUsers.length} Discord ${allDiscordUsers.length === 1 ? "account" : "accounts"} to link`}
      </p>
      <p
        className="dash-mapping-success"
        hidden={!success}
        role="status"
        aria-atomic="true"
        ref={feedbackRef}
        tabIndex={-1}
      >
        {success && (
          <>
            <DashboardIcon name="check" size={18} />
            <span>{success}</span>
          </>
        )}
      </p>
      {mappingError && (
        <div
          className="dash-mapping-error"
          role="alert"
          ref={errorRef}
          tabIndex={-1}
        >
          <DashboardIcon name="alert" size={20} />
          <p>{mappingError.message || "Couldn't save the link. Try again."}</p>
        </div>
      )}
      {isLoading ? (
        <div className="dash-mapping-loading" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      ) : isError ? (
        <EmptyState
          icon={<DashboardIcon name="alert" size={27} />}
          title="Couldn't load the accounts"
          subtitle="Try loading the character and Discord lists again."
          action={
            <button
              type="button"
              className="dash-mapping-button"
              onClick={handleRefresh}
              disabled={isFetching}
            >
              {" "}
              <DashboardIcon name="refresh" size={17} />
              {isFetching ? "Trying again…" : "Try again"}
            </button>
          }
        />
      ) : !hasAnyUnmapped ? (
        <EmptyState
          icon={<DashboardIcon name="check" size={28} />}
          title="All accounts linked"
          subtitle="There are no unlinked characters or Discord accounts in these lists."
        />
      ) : tab === "suggested" ? (
        <SuggestedPairs
          pairs={suggestedPairs}
          exactCount={visibleExactMatches.length}
          confirmingPairKey={confirmingPairKey}
          isConfirmingAll={isConfirmingAll}
          disabled={busy}
          onConfirm={(pair) => void handleConfirm(pair)}
          onSkip={(pair) => {
            setSuccess("");
            dismissPair(pair);
          }}
          onConfirmAllExact={() => {
            setSuccess("");
            void confirmAllExact();
          }}
          onGoManual={() => chooseTab("manual")}
        />
      ) : (
        <>
          <p className="dash-mapping-help">
            Choose one FFXIV character and one Discord account. Similar names
            move to the top of the other list; you choose both sides.
          </p>
          <LinkBar
            containerRef={selectionRef}
            characterName={selectedCharacter?.name}
            discordName={selectedDiscordUser?.serverNickName}
            discordId={selectedDiscordUser?.discordId}
            canLink={canLink}
            isMapping={busy}
            onClear={() => {
              resetPicker();
              setSuccess("");
              characterInput.current?.focus();
            }}
            onChangeCharacter={changeCharacter}
            onChangeDiscord={changeDiscord}
            onLink={() => void handleLink()}
          />
          <div className="dash-mapping-columns">
            <MappingColumn
              icon={<MappingPlatformIcon platform="ffxiv" size={27} />}
              title="FFXIV characters"
              platform="ffxiv"
              count={characterRows.length}
              totalCount={allCharacters.length}
              inputRef={characterInput}
              searchValue={characterSearch}
              onSearchChange={setCharacterSearch}
              searchPlaceholder="Name or rank…"
              searchLabel="Search characters"
              disabled={busy}
              isEmpty={characterRows.length === 0}
              emptyMessage={
                characterSearch.trim()
                  ? "No characters match this search."
                  : "No unlinked characters."
              }
            >
              {characterRows.map(({ character, matchInfo }) => (
                <CharacterItem
                  key={character.characterId}
                  character={character}
                  isSelected={
                    selectedCharacter?.characterId === character.characterId
                  }
                  matchInfo={matchInfo}
                  onClick={() => {
                    setSuccess("");
                    selectCharacter(character);
                  }}
                  disabled={busy}
                />
              ))}
            </MappingColumn>
            <MappingColumn
              icon={<MappingPlatformIcon platform="discord" size={27} />}
              title="Discord accounts"
              platform="discord"
              count={discordRows.length}
              totalCount={allDiscordUsers.length}
              inputRef={discordInput}
              searchValue={discordSearch}
              onSearchChange={setDiscordSearch}
              searchPlaceholder="Name or Discord ID…"
              searchLabel="Search Discord accounts"
              disabled={busy}
              isEmpty={discordRows.length === 0}
              emptyMessage={
                discordSearch.trim()
                  ? "No accounts match this search."
                  : "No unlinked Discord accounts."
              }
            >
              {discordRows.map(({ user, matchInfo }) => (
                <DiscordUserItem
                  key={user.discordId}
                  user={user}
                  isSelected={selectedDiscordUser?.discordId === user.discordId}
                  matchInfo={matchInfo}
                  onClick={() => {
                    setSuccess("");
                    selectDiscordUser(user);
                  }}
                  disabled={busy}
                />
              ))}
            </MappingColumn>
          </div>
          {canLink && (
            <div className="dash-mapping-review-return">
              <p>Both accounts are selected.</p>
              <button
                type="button"
                className="dash-mapping-button"
                disabled={busy}
                onClick={() => {
                  selectionRef.current?.focus();
                  selectionRef.current?.scrollIntoView({
                    block: "center",
                    behavior: reducedMotion ? "auto" : "smooth",
                  });
                }}
              >
                <DashboardIcon name="check" size={18} />
                Review selected pair
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
  if (embedded) return content;
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
        onClose={() => {
          if (!busy) setIsOpen(false);
        }}
        size="xl"
        padded={false}
        icon={<DashboardIcon name="link" size={21} />}
        title="Character linking"
        eyebrow="Link characters to Discord accounts"
      >
        <div className="nook-theme dash-mapping-modal">{content}</div>
      </Modal>
    </>
  );
}

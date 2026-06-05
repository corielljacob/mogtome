import { type CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wifi, Loader2, Search, X } from "lucide-react";

import {
  PageLayout,
  PageHeader,
  PageFooter,
  LoadingState,
  ErrorState,
  EmptyState,
} from "../components/PageShell";
import { KawaiiStar } from "../components/kawaiiMotifs";
import { EVENT_TYPE_CONFIG } from "../constants/eventTypes";
import type { ChronicleEventFilter } from "../types";

import { useChronicle } from "../components/chronicle/useChronicle";
import { LiveStatus } from "../components/chronicle/LiveStatus";
import { JournalEntry } from "../components/chronicle/JournalEntry";
import { WashiTape } from "../components/chronicle/WashiTape";
import {
  dayDecor,
  getEventKey,
} from "../components/chronicle/chronicleHelpers";

const EVENT_FILTERS: { value: ChronicleEventFilter; label: string }[] = (
  Object.keys(EVENT_TYPE_CONFIG) as ChronicleEventFilter[]
).map((key) => ({
  value: key,
  label: EVENT_TYPE_CONFIG[key].label,
}));

import flyingMoogles from "../assets/moogles/moogles flying.webp";
import moogleMail from "../assets/moogles/moogle mail.webp";

export function Chronicle() {
  const {
    searchInput,
    setSearchInput,
    activeFilter,
    setActiveFilter,
    deferredSearchQuery,
    searchInputRef,
    isSearching,
    hasActiveFilter,
    hasActiveQuery,
    status,
    unseenCount,
    reconnect,
    markAllAsSeen,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    apiEvents,
    displayedEvents,
    totalCount,
    dayGroups,
    isTransitioning,
    sentinelRef,
    handleClearSearch,
    handleClearAll,
    handleToggleFilter,
  } = useChronicle();

  return (
    <PageLayout
      moogles={{ primary: flyingMoogles, secondary: moogleMail }}
      maxWidth="max-w-3xl"
    >
      <div className="corkboard relative px-3.5 py-7 sm:px-6 sm:py-9 md:px-8 md:py-10">
        <span
          className="pushpin absolute top-3 left-3 sm:top-4 sm:left-4 z-20"
          aria-hidden="true"
        />
        <span
          className="pushpin absolute top-3 right-3 sm:top-4 sm:right-4 z-20"
          style={{ "--pin": "var(--secondary)" } as CSSProperties}
          aria-hidden="true"
        />
        <span
          className="pushpin absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20"
          style={{ "--pin": "var(--accent)" } as CSSProperties}
          aria-hidden="true"
        />
        <span
          className="pushpin absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20"
          style={{ "--pin": "var(--secondary)" } as CSSProperties}
          aria-hidden="true"
        />

        <PageHeader
          opener="~ a little logbook of our days ~"
          title="The Chronicle"
          subtitle="what the FC has been up to lately"
        />

        <motion.section
          className="surface p-3 sm:p-5 mb-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative group">
            <label htmlFor="chronicle-search" className="sr-only">
              Search chronicle events
            </label>
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--primary)]/70 pointer-events-none"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              id="chronicle-search"
              type="search"
              inputMode="search"
              enterKeyHint="search"
              placeholder="Search the chronicle, kupo~"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="
              w-full pl-11 pr-11 py-3
              bg-[var(--bg)] rounded-2xl
              border-2 border-[color:color-mix(in_srgb,var(--primary)_16%,var(--card))]
              focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20
              font-soft text-base text-[var(--text)] placeholder:text-[var(--text-subtle)]
              focus:outline-none transition-all touch-manipulation
            "
              style={{ fontSize: "16px" }}
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-[var(--primary)]/12 active:bg-[var(--primary)]/30 sm:hover:bg-[var(--primary)]/20 transition-colors cursor-pointer touch-manipulation"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-[var(--primary)]" />
              </button>
            )}
          </div>

          <div
            className="mt-4 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by event type"
          >
            {EVENT_FILTERS.map(({ value, label }) => {
              const config = EVENT_TYPE_CONFIG[value];
              const isActive = activeFilter === value;
              return (
                <button
                  key={value}
                  onClick={() => handleToggleFilter(value)}
                  aria-pressed={isActive}
                  className={`
                  inline-flex items-center gap-1.5
                  px-3.5 py-1.5 rounded-full text-sm font-display font-bold
                  cursor-pointer transition-colors duration-200 touch-manipulation
                  focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
                  ${isActive ? "gel text-white" : "bg-[var(--card)] border-2 text-[var(--text)]"}
                `}
                  style={
                    isActive
                      ? ({ "--gel-color": config.hex } as CSSProperties)
                      : ({
                          borderColor: `color-mix(in srgb, ${config.hex} 32%, var(--card))`,
                        } as CSSProperties)
                  }
                >
                  <config.Icon
                    className="w-3.5 h-3.5"
                    style={{ color: isActive ? "#fff" : config.hex }}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </button>
              );
            })}
            {hasActiveFilter && (
              <button
                onClick={() => setActiveFilter(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-display font-bold text-[var(--text-muted)] hover:text-[var(--primary)] active:text-[var(--primary)] cursor-pointer transition-colors touch-manipulation"
                aria-label="Clear filter"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {hasActiveQuery && !isLoading && (
            <p
              className="mt-3 px-1 font-soft text-sm text-[var(--text-muted)]"
              aria-live="polite"
            >
              {isTransitioning ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2
                    className="w-3.5 h-3.5 animate-spin"
                    aria-hidden="true"
                  />
                  Looking...
                </span>
              ) : (
                <>
                  Found{" "}
                  <span className="font-bold text-[var(--primary)]">
                    {displayedEvents.length}
                  </span>{" "}
                  entr{displayedEvents.length !== 1 ? "ies" : "y"}
                </>
              )}
            </p>
          )}
          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-3 min-h-6">
            <LiveStatus status={status} />
            <div className="flex items-center gap-4">
              {(status === "disconnected" || status === "error") && (
                <button
                  onClick={reconnect}
                  className="inline-flex items-center gap-1.5 text-xs font-soft font-medium text-[var(--primary)] hover:underline cursor-pointer touch-manipulation"
                >
                  <Wifi className="w-3.5 h-3.5" aria-hidden="true" />
                  reconnect
                </button>
              )}
              {!hasActiveQuery && unseenCount > 0 && (
                <button
                  onClick={markAllAsSeen}
                  className="text-xs font-soft font-medium text-[var(--text-muted)] hover:text-[var(--primary)] cursor-pointer touch-manipulation"
                >
                  mark all read
                </button>
              )}
            </div>
          </div>
        </motion.section>

        <AnimatePresence mode="wait">
          {isLoading && apiEvents.length === 0 ? (
            <motion.div
              key="loading"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LoadingState
                message="Gathering the chronicles, kupo..."
                imageSrc={flyingMoogles}
              />
            </motion.div>
          ) : isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ErrorState
                message="The chronicle tome got lost, kupo..."
                onRetry={() => refetch()}
              />
            </motion.div>
          ) : totalCount === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {hasActiveQuery ? (
                <EmptyState
                  title="Nothing here"
                  message={
                    isSearching
                      ? "Kupo? Nothing matches that search..."
                      : "No entries of that kind yet, kupo..."
                  }
                  imageSrc={moogleMail}
                  onClear={handleClearAll}
                  clearLabel={
                    isSearching && hasActiveFilter
                      ? "Clear search & filter"
                      : isSearching
                        ? "Clear search"
                        : "Clear filter"
                  }
                />
              ) : (
                <EmptyState
                  title="No entries yet"
                  message="The chronicle awaits its first entry, kupo~"
                  imageSrc={moogleMail}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`content-${activeFilter ?? "all"}-${deferredSearchQuery.trim()}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`journal relative pl-10 sm:pl-12 pr-5 sm:pr-7 py-9 sm:py-12 transition-opacity duration-200 ${isTransitioning ? "opacity-50" : "opacity-100"}`}
              role="feed"
              aria-label="Chronicle timeline"
            >
              <WashiTape
                color="var(--accent)"
                className="absolute -top-3 left-10 w-20 h-7 -rotate-3 opacity-85 z-10"
              />
              <WashiTape
                color="var(--secondary)"
                className="absolute -top-3 right-12 w-16 h-7 rotate-2 opacity-85 z-10"
              />

              {dayGroups.map((group, gi) => {
                const { tilt, Sticker, tapeColor, stickerColor } = dayDecor(
                  group.key,
                  gi,
                );
                return (
                  <section
                    key={group.key}
                    className={
                      gi > 0
                        ? "mt-11 pt-9 border-t-2 border-dashed border-[color:color-mix(in_srgb,var(--primary)_18%,transparent)]"
                        : ""
                    }
                    aria-label={`Entries from ${group.label}`}
                  >
                    <header className="relative mb-5 sm:mb-6 flex items-center gap-2.5">
                      <div
                        className="relative inline-flex items-center gap-1.5"
                        style={{ transform: `rotate(${tilt}deg)` }}
                      >
                        <WashiTape
                          color={tapeColor}
                          className="absolute -top-2.5 left-2 w-9 h-3.5 -rotate-6 opacity-85"
                        />
                        <KawaiiStar className="relative w-4 h-4 shrink-0 text-[var(--accent)]" />
                        <h2 className="relative font-accent font-bold text-2xl sm:text-3xl text-[var(--primary)] leading-none">
                          {group.label}
                        </h2>
                        <span className="relative font-accent text-lg text-[var(--text-subtle)] leading-none">
                          · {group.items.length}
                        </span>
                      </div>
                      <span
                        className="shrink-0"
                        style={{ transform: `rotate(${-tilt * 2.5}deg)` }}
                        aria-hidden="true"
                      >
                        <Sticker className="w-5 h-5" color={stickerColor} />
                      </span>
                      <span
                        className="flex-1 self-center border-b-2 border-dashed border-[color:color-mix(in_srgb,var(--primary)_20%,transparent)]"
                        aria-hidden="true"
                      />
                    </header>

                    <ol className="divide-y divide-[color:color-mix(in_srgb,var(--primary)_10%,transparent)]">
                      {group.items.map((item, i) => (
                        <JournalEntry
                          key={`${item.isRealtime ? "rt" : "h"}-${getEventKey(item.event, i)}`}
                          item={item}
                        />
                      ))}
                    </ol>
                  </section>
                );
              })}

              {hasNextPage && (
                <div
                  ref={sentinelRef}
                  className="flex items-center justify-center py-8"
                  aria-hidden={!isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2.5 text-[var(--text-muted)]"
                      role="status"
                    >
                      <Loader2
                        className="w-5 h-5 animate-spin text-[var(--primary)]"
                        aria-hidden="true"
                      />
                      <span className="font-soft text-sm font-medium">
                        Turning the page...
                      </span>
                    </motion.div>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]/50">
                      &#8203;
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && !isError && totalCount > 0 && !hasNextPage && (
          <PageFooter
            message="Every moment tells a story, kupo!"
            closing="~ to be continued ~"
          />
        )}
      </div>
    </PageLayout>
  );
}

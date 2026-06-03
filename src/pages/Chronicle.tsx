import { useState, useMemo, useCallback, useEffect, useRef, memo, useDeferredValue } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, Loader2, Search, X } from 'lucide-react';

// Shared components
import { PageLayout, PageHeader, PageFooter, LoadingState, ErrorState, EmptyState, Tag } from '../components';
import { useEventsHub, type ConnectionStatus } from '../hooks';

// Utils & Constants
import { formatRelativeTime } from '../utils';
import { getEventTypeConfig, EVENT_TYPE_CONFIG } from '../constants';

// API
import { eventsApi } from '../api/events';
import type { ChronicleEvent, ChronicleEventFilter } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Filter options derived from the event type config
// ─────────────────────────────────────────────────────────────────────────────

const EVENT_FILTERS: { value: ChronicleEventFilter; label: string }[] = (
  Object.keys(EVENT_TYPE_CONFIG) as ChronicleEventFilter[]
).map((key) => ({
  value: key,
  label: EVENT_TYPE_CONFIG[key].label,
}));

// Assets
import flyingMoogles from '../assets/moogles/moogles flying.webp';
import moogleMail from '../assets/moogles/moogle mail.webp';

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

const PLACEHOLDER_TIMESTAMP = 0;
const PLACEHOLDER_CREATION_TIME = '1970-01-01T00:00:00Z';

/** Check if an event has a valid (non-placeholder) ID */
function hasValidId(event: ChronicleEvent): boolean {
  return event.id.timestamp !== PLACEHOLDER_TIMESTAMP ||
         event.id.creationTime !== PLACEHOLDER_CREATION_TIME;
}

/** Get a signature for deduplication (createdAt + type + text) */
function getEventSignature(event: ChronicleEvent): string {
  return `${event.createdAt}-${event.type}-${event.text}`;
}

/** Get unique key for React list rendering */
function getEventKey(event: ChronicleEvent, index: number): string {
  if (hasValidId(event)) {
    return `${event.id.timestamp}-${event.id.creationTime}`;
  }
  // Fallback for placeholder IDs: use signature + index
  return `${getEventSignature(event)}-${index}`;
}

// ── Day grouping ──────────────────────────────────────────────────────────────

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** Stable key for the calendar day an event belongs to. */
function getDayKey(dateString: string): string {
  const d = new Date(dateString);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Friendly label for a day: Today / Yesterday / weekday / full date. */
function getDayLabel(dateString: string): string {
  const d = new Date(dateString);
  const now = new Date();
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / 86_400_000);
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return d.toLocaleDateString('en-US', { weekday: 'long' });
  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  if (d.getFullYear() !== now.getFullYear()) opts.year = 'numeric';
  return d.toLocaleDateString('en-US', opts);
}

interface EntryItem {
  event: ChronicleEvent;
  isRealtime: boolean;
  isUnseen: boolean;
}

interface DayGroup {
  key: string;
  label: string;
  items: EntryItem[];
}

/** Bucket an ordered (newest-first) list of entries into day groups. */
function buildDayGroups(items: EntryItem[]): DayGroup[] {
  const groups: DayGroup[] = [];
  const index = new Map<string, DayGroup>();
  for (const item of items) {
    const key = getDayKey(item.event.createdAt);
    let group = index.get(key);
    if (!group) {
      group = { key, label: getDayLabel(item.event.createdAt), items: [] };
      index.set(key, group);
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Quiet, theme-tinted "live" indicator (replaces the old status pill). */
const LiveStatus = memo(function LiveStatus({ status }: { status: ConnectionStatus }) {
  const config: Record<ConnectionStatus, { tone: string; label: string; pulse: boolean }> = {
    connected: { tone: 'var(--primary)', label: 'live', pulse: true },
    connecting: { tone: 'var(--accent)', label: 'connecting', pulse: true },
    reconnecting: { tone: 'var(--accent)', label: 'reconnecting', pulse: true },
    disconnected: { tone: 'var(--text-subtle)', label: 'offline', pulse: false },
    error: { tone: 'var(--text-subtle)', label: 'offline', pulse: false },
  };
  const { tone, label, pulse } = config[status];

  return (
    <span
      className="inline-flex items-center gap-2 text-xs font-soft text-[var(--text-muted)]"
      role="status"
      aria-live="polite"
      aria-label={`Live updates: ${label}`}
    >
      <span className="relative flex w-2 h-2" aria-hidden="true">
        {pulse && (
          <span
            className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping"
            style={{ background: tone }}
          />
        )}
        <span className="relative inline-flex w-2 h-2 rounded-full" style={{ background: tone }} />
      </span>
      {label}
    </span>
  );
});

/** A single journal entry sitting on the day's timeline thread. */
const JournalEntry = memo(function JournalEntry({ item, isLast }: { item: EntryItem; isLast: boolean }) {
  const { event, isRealtime, isUnseen } = item;
  const { Icon, hex, label } = getEventTypeConfig(event.type);

  return (
    <motion.li
      className="relative flex gap-3 sm:gap-4"
      initial={isRealtime && isUnseen ? { opacity: 0, y: -8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
    >
      {/* Timeline node + connecting thread */}
      <div className="relative flex flex-col items-center">
        <span
          className="icon-badge w-9 h-9 shrink-0 z-10"
          style={{
            color: hex,
            background: `color-mix(in srgb, ${hex} 10%, var(--bg))`,
            borderColor: `color-mix(in srgb, ${hex} 28%, var(--border))`,
          }}
        >
          <Icon className="w-4 h-4" aria-hidden="true" />
        </span>
        {!isLast && <span className="w-px flex-1 bg-[var(--border)] mt-1" aria-hidden="true" />}
      </div>

      {/* Entry content */}
      <div className={`flex-1 min-w-0 ${isLast ? 'pb-1' : 'pb-6'}`}>
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <Tag color={hex}>{label}</Tag>
          {isUnseen && <Tag color="var(--primary)" dot>just in</Tag>}
          <time
            className="ml-auto shrink-0 text-xs text-[var(--text-subtle)] font-soft"
            dateTime={event.createdAt}
          >
            {formatRelativeTime(event.createdAt)}
          </time>
        </div>
        <p className="text-[var(--text)] font-soft text-sm sm:text-base leading-relaxed">
          {event.text}
        </p>
      </div>
    </motion.li>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function Chronicle() {
  const [searchInput, setSearchInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<ChronicleEventFilter | null>(null);
  const deferredSearchQuery = useDeferredValue(searchInput);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Derived booleans
  const isSearching = deferredSearchQuery.trim().length > 0;
  const hasActiveFilter = activeFilter !== null;
  const hasActiveQuery = isSearching || hasActiveFilter;

  // Realtime events (SignalR)
  const { status, realtimeEvents, unseenCount, reconnect, markAllAsSeen } = useEventsHub();

  // ── API query ─────────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['chronicle-events', deferredSearchQuery.trim(), activeFilter],
    queryFn: ({ pageParam }) =>
      eventsApi.getEvents({
        cursor: pageParam,
        limit: 20,
        query: deferredSearchQuery.trim() || undefined,
        filter: activeFilter ?? undefined,
      }),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 1000 * 60 * 2,
  });

  // ── Infinity scroll via callback ref ──────────────────────────────────
  const [sentinelVisible, setSentinelVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!node) {
      setSentinelVisible(false);
      return;
    }
    observerRef.current = new IntersectionObserver(
      ([entry]) => setSentinelVisible(entry.isIntersecting),
      { rootMargin: '300px', threshold: 0 },
    );
    observerRef.current.observe(node);
  }, []);

  useEffect(() => () => { observerRef.current?.disconnect(); }, []);

  useEffect(() => {
    if (sentinelVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [sentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ── Derived event lists ───────────────────────────────────────────────
  // Flatten all pages from the API into a single array, deduplicating
  // events that may appear on multiple pages due to cursor shifts.
  const apiEvents = useMemo(() => {
    if (!data?.pages) return [];
    const seen = new Set<string>();
    return data.pages.flatMap((page) => page.events).filter((event) => {
      const key = hasValidId(event)
        ? `${event.id.timestamp}-${event.id.creationTime}`
        : getEventSignature(event);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  // When searching or filtering, display ONLY the API results.
  // On the default view, deduplicate against realtime events so items
  // don't appear twice.
  const displayedEvents = useMemo(() => {
    if (hasActiveQuery) return apiEvents;
    const rtSignatures = new Set(realtimeEvents.map(getEventSignature));
    return apiEvents.filter((e) => !rtSignatures.has(getEventSignature(e)));
  }, [apiEvents, hasActiveQuery, realtimeEvents]);

  // Realtime events are only shown on the default (unfiltered) view. Memoized so
  // the reference stays stable for the dayGroups dependency list below.
  const visibleRealtimeEvents = useMemo(
    () => (hasActiveQuery ? [] : realtimeEvents),
    [hasActiveQuery, realtimeEvents]
  );
  const totalCount = visibleRealtimeEvents.length + displayedEvents.length;

  // Merge realtime (newest) + historical into one ordered list, then bucket
  // into day groups. Live items sit at the top of "Today" with a gentle marker.
  const dayGroups = useMemo(() => {
    const items: EntryItem[] = [
      ...visibleRealtimeEvents.map((event, i) => ({ event, isRealtime: true, isUnseen: i < unseenCount })),
      ...displayedEvents.map((event) => ({ event, isRealtime: false, isUnseen: false })),
    ];
    return buildDayGroups(items);
  }, [visibleRealtimeEvents, displayedEvents, unseenCount]);

  // True while the search input is ahead of the deferred value
  const isTransitioning = searchInput !== deferredSearchQuery;

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    searchInputRef.current?.focus();
  }, []);

  const handleClearAll = useCallback(() => {
    setSearchInput('');
    setActiveFilter(null);
    searchInputRef.current?.focus();
  }, []);

  const handleToggleFilter = useCallback((filter: ChronicleEventFilter) => {
    setActiveFilter((prev) => prev === filter ? null : filter);
  }, []);

  return (
    <PageLayout moogles={{ primary: flyingMoogles, secondary: moogleMail }} maxWidth="max-w-3xl">
      <PageHeader
        opener="~ a little logbook of our days ~"
        title="The Chronicle"
        subtitle="what the FC has been up to lately"
      />

      {/* Search & filters */}
      <motion.section
        className="surface p-3 sm:p-5 mb-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative group">
          <label htmlFor="chronicle-search" className="sr-only">Search chronicle events</label>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-subtle)] group-focus-within:text-[var(--primary)] transition-colors"
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            id="chronicle-search"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            placeholder="Search the chronicle..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="
              w-full pl-11 pr-10 py-3
              bg-[var(--bg)]/60 hover:bg-[var(--bg)]
              rounded-xl border border-[var(--border)]
              focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20
              font-soft text-base text-[var(--text)] placeholder:text-[var(--text-subtle)]
              focus:outline-none transition-all duration-300 touch-manipulation
            "
            style={{ fontSize: '16px' }}
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[var(--text-subtle)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors cursor-pointer touch-manipulation"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter chips — hairline toggles tinted per event type */}
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by event type">
          {EVENT_FILTERS.map(({ value, label }) => {
            const config = EVENT_TYPE_CONFIG[value];
            const isActive = activeFilter === value;
            return (
              <button
                key={value}
                onClick={() => handleToggleFilter(value)}
                aria-pressed={isActive}
                className="
                  inline-flex items-center gap-1.5
                  px-3 py-1.5 rounded-md border text-sm font-soft font-medium
                  cursor-pointer transition-colors duration-200 touch-manipulation
                  focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
                "
                style={isActive
                  ? {
                      color: config.hex,
                      borderColor: `color-mix(in srgb, ${config.hex} 45%, transparent)`,
                      background: `color-mix(in srgb, ${config.hex} 12%, transparent)`,
                    }
                  : {
                      color: 'var(--text-muted)',
                      borderColor: 'var(--border)',
                    }}
              >
                <config.Icon
                  className="w-3.5 h-3.5"
                  style={{ color: config.hex }}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </button>
            );
          })}
          {hasActiveFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-soft font-medium text-[var(--text-subtle)] hover:text-[var(--primary)] cursor-pointer transition-colors touch-manipulation"
              aria-label="Clear filter"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Search/filter results count */}
        {hasActiveQuery && !isLoading && (
          <p className="mt-3 px-1 font-soft text-sm text-[var(--text-muted)]" aria-live="polite">
            {isTransitioning ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                Looking...
              </span>
            ) : (
              <>
                Found <span className="font-bold text-[var(--primary)]">{displayedEvents.length}</span> entr{displayedEvents.length !== 1 ? 'ies' : 'y'}
              </>
            )}
          </p>
        )}
      </motion.section>

      {/* Quiet status row: live indicator + reconnect / mark-as-read */}
      <div className="flex items-center justify-between gap-3 mb-6 px-1 min-h-6">
        <LiveStatus status={status} />
        <div className="flex items-center gap-4">
          {(status === 'disconnected' || status === 'error') && (
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

      {/* Timeline */}
      <AnimatePresence mode="wait">
        {isLoading && apiEvents.length === 0 ? (
          <motion.div key="loading" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <LoadingState message="Gathering the chronicles, kupo..." imageSrc={flyingMoogles} />
          </motion.div>
        ) : isError ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <ErrorState message="The chronicle tome got lost, kupo..." onRetry={() => refetch()} />
          </motion.div>
        ) : totalCount === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {hasActiveQuery ? (
              <EmptyState
                title="Nothing here"
                message={isSearching ? 'Kupo? Nothing matches that search...' : 'No entries of that kind yet, kupo...'}
                imageSrc={moogleMail}
                onClear={handleClearAll}
                clearLabel={isSearching && hasActiveFilter ? 'Clear search & filter' : isSearching ? 'Clear search' : 'Clear filter'}
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
            key={`content-${activeFilter ?? 'all'}-${deferredSearchQuery.trim()}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`space-y-6 sm:space-y-8 transition-opacity duration-200 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
            role="feed"
            aria-label="Chronicle timeline"
          >
            {dayGroups.map((group) => (
              <section
                key={group.key}
                className="surface p-4 sm:p-6"
                aria-label={`Entries from ${group.label}`}
              >
                {/* Day header */}
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-display font-bold text-base sm:text-lg text-[var(--text)] whitespace-nowrap">
                    {group.label}
                  </h2>
                  <span className="divider flex-1" aria-hidden="true" />
                  <Tag>{group.items.length}</Tag>
                </div>

                {/* Entries on a connecting thread */}
                <ol>
                  {group.items.map((item, i) => (
                    <JournalEntry
                      key={`${item.isRealtime ? 'rt' : 'h'}-${getEventKey(item.event, i)}`}
                      item={item}
                      isLast={i === group.items.length - 1}
                    />
                  ))}
                </ol>
              </section>
            ))}

            {/* Infinity scroll sentinel + loading indicator */}
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
                    <Loader2 className="w-5 h-5 animate-spin text-[var(--primary)]" aria-hidden="true" />
                    <span className="font-soft text-sm font-medium">Turning the page...</span>
                  </motion.div>
                ) : (
                  <span className="text-xs text-[var(--text-muted)]/50">&#8203;</span>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && !isError && totalCount > 0 && !hasNextPage && (
        <PageFooter message="Every moment tells a story, kupo!" closing="~ to be continued ~" />
      )}
    </PageLayout>
  );
}

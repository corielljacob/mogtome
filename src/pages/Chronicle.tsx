import { useState, useMemo, useCallback, useEffect, useRef, memo, useDeferredValue } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Heart,
  ChevronDown,
  Sparkles,
  Loader2,
  Search,
  X,
} from 'lucide-react';

// Shared components
import { StoryDivider, FloatingSparkles, ContentCard, SimpleFloatingMoogles } from '../components';
import { useEventsHub, type ConnectionStatus } from '../hooks';

// Utils & Constants
import { formatRelativeTime, formatFullDate } from '../utils';
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
import deadMoogle from '../assets/moogles/dead moogle.webp';

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

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Connection status indicator - memoized since status changes infrequently */
const ConnectionIndicator = memo(function ConnectionIndicator({ status }: { status: ConnectionStatus }) {
  const statusConfig: Record<ConnectionStatus, { color: string; label: string; Icon: typeof Wifi; ariaLabel: string }> = {
    connected: { color: 'text-green-500', label: 'Live', Icon: Wifi, ariaLabel: 'Real-time connection active' },
    connecting: { color: 'text-yellow-500', label: 'Connecting...', Icon: Wifi, ariaLabel: 'Connecting to real-time updates' },
    reconnecting: { color: 'text-yellow-500', label: 'Reconnecting...', Icon: Wifi, ariaLabel: 'Reconnecting to real-time updates' },
    disconnected: { color: 'text-[var(--bento-text-muted)]', label: 'Offline', Icon: WifiOff, ariaLabel: 'Disconnected from real-time updates' },
    error: { color: 'text-red-500', label: 'Error', Icon: WifiOff, ariaLabel: 'Error connecting to real-time updates' },
  };

  const { color, label, Icon, ariaLabel } = statusConfig[status];

  return (
    <div 
      className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[var(--bento-card)]/80 border border-[var(--bento-border)] ${color} ${
        status === 'connecting' || status === 'reconnecting' ? 'animate-pulse' : ''
      }`}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
      <span className="text-xs sm:text-sm font-soft font-medium">{label}</span>
      {status === 'connected' && (
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-ping-slow" aria-hidden="true" />
      )}
    </div>
  );
});

/** Single timeline event card - memoized for performance */
const TimelineEventCard = memo(function TimelineEventCard({ 
  event, 
  isRealtime = false 
}: { 
  event: ChronicleEvent; 
  isRealtime?: boolean 
}) {
  const { Icon, color, bgColor, label } = getEventTypeConfig(event.type);
  
  return (
    <motion.div
      initial={isRealtime ? { opacity: 0, y: -20, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={isRealtime ? { type: "spring", stiffness: 300, damping: 25 } : { duration: 0 }}
      className={`
        relative flex gap-3 sm:gap-4 p-4 sm:p-4 md:p-5
        bg-[var(--bento-card)]/80 backdrop-blur-sm
        border border-[var(--bento-border)] rounded-2xl
        shadow-sm sm:hover:shadow-md sm:hover:border-[var(--bento-primary)]/20
        active:scale-[0.99] sm:active:scale-100
        transition-all duration-200 touch-manipulation
        ${isRealtime ? 'ring-2 ring-[var(--bento-primary)]/30 ring-offset-2 ring-offset-[var(--bento-bg)]' : ''}
      `}
    >
      {/* Event type icon - larger on mobile for better visual hierarchy */}
      <div className={`
        flex-shrink-0 w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl
        flex items-center justify-center
        ${bgColor} ${color}
      `}>
        <Icon className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </div>

      {/* Event content */}
      <div className="flex-1 min-w-0">
        {/* Mobile: stacked layout for better readability */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            {/* Event type badge + timestamp on mobile */}
            <div className="flex items-center justify-between sm:justify-start gap-2 mb-2 sm:mb-1.5">
              <div className="flex items-center gap-2">
                <span className={`
                  px-2 py-1 sm:px-2 sm:py-0.5 rounded-full text-[11px] sm:text-xs font-soft font-semibold
                  ${bgColor} ${color}
                `}>
                  {label}
                </span>
                {isRealtime && (
                  <motion.span
                    className="px-2 py-1 sm:px-2 sm:py-0.5 rounded-full text-[11px] sm:text-xs font-soft font-semibold bg-[var(--bento-primary)] text-white"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    New!
                  </motion.span>
                )}
              </div>
              {/* Mobile timestamp - inline with badge */}
              <span className="text-[11px] sm:hidden font-soft font-medium text-[var(--bento-primary)]">
                {formatRelativeTime(event.createdAt)}
              </span>
            </div>

            {/* Event text - larger on mobile */}
            <p className="text-[var(--bento-text)] font-soft text-sm sm:text-sm md:text-base leading-relaxed">
              {event.text}
            </p>
          </div>

          {/* Desktop timestamp */}
          <div className="flex-shrink-0 text-right hidden sm:block">
            <p className="text-xs font-soft font-medium text-[var(--bento-primary)]">
              {formatRelativeTime(event.createdAt)}
            </p>
            <p className="text-xs text-[var(--bento-text-muted)] mt-0.5">
              {formatFullDate(event.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline connector line (for visual continuity) - hidden on mobile */}
      <div className="absolute left-7 sm:left-7 md:left-8 top-full w-0.5 h-4 bg-gradient-to-b from-[var(--bento-border)] to-transparent hidden sm:block" />
    </motion.div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function Chronicle() {
  const [showRealtimeEvents, setShowRealtimeEvents] = useState(true);
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
  // Flatten all pages from the API into a single array.
  const apiEvents = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.events);
  }, [data]);

  // When searching or filtering, display ONLY the API results.
  // When on the default view (no search, no filter), deduplicate against
  // realtime events so items don't appear twice.
  const displayedEvents = useMemo(() => {
    if (hasActiveQuery) return apiEvents;
    const rtSignatures = new Set(realtimeEvents.map(getEventSignature));
    return apiEvents.filter((e) => !rtSignatures.has(getEventSignature(e)));
  }, [apiEvents, hasActiveQuery, realtimeEvents]);

  // Realtime events are only shown on the default (unfiltered) view.
  const visibleRealtimeEvents = hasActiveQuery ? [] : realtimeEvents;
  const totalCount = visibleRealtimeEvents.length + displayedEvents.length;

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
    <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Background decorations - extends full viewport behind header/nav */}
      <div className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
      <SimpleFloatingMoogles primarySrc={flyingMoogles} secondarySrc={moogleMail} />
      <FloatingSparkles minimal />

      <div className="relative py-6 sm:py-8 md:py-12 px-3 sm:px-4 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <motion.header 
            className="text-center mb-6 sm:mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Decorative opener */}
            <motion.p
              className="font-accent text-lg sm:text-xl md:text-2xl text-[var(--bento-secondary)] mb-3 sm:mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              ~ The story of our adventures ~
            </motion.p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent">
                The Chronicle
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--bento-text-muted)] font-soft flex items-center justify-center gap-2 mb-3 sm:mb-4 px-2 sm:px-0">
              Every tale from our FC, unfolding in real-time
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
            </p>

            <StoryDivider className="mx-auto" size="sm" />
          </motion.header>

          {/* Search bar */}
          <motion.section
            className="mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="bg-[var(--bento-card)] border border-[var(--bento-border)] rounded-2xl shadow-lg shadow-[var(--bento-primary)]/5 p-3 sm:p-4">
              <div className="relative">
                <label htmlFor="chronicle-search" className="sr-only">Search chronicle events</label>
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--bento-text-subtle)] pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  id="chronicle-search"
                  type="search"
                  inputMode="search"
                  enterKeyHint="search"
                  placeholder="Search the chronicles..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="
                    w-full pl-11 pr-10 py-3
                    bg-[var(--bento-bg)] rounded-xl
                    border border-[var(--bento-border)]
                    focus:border-[var(--bento-primary)] focus:ring-2 focus:ring-[var(--bento-primary)]/20
                    font-soft text-base text-[var(--bento-text)] placeholder:text-[var(--bento-text-subtle)]
                    focus:outline-none transition-all
                    touch-manipulation
                  "
                  style={{ fontSize: '16px' }}
                />
                {searchInput && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 sm:p-1.5 rounded-lg bg-[var(--bento-primary)]/10 active:bg-[var(--bento-primary)]/30 sm:hover:bg-[var(--bento-primary)]/20 transition-colors cursor-pointer touch-manipulation"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 text-[var(--bento-primary)]" />
                  </button>
                )}
              </div>

              {/* Filter chips */}
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by event type">
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
                        px-3 py-2 sm:px-3 sm:py-1.5 rounded-xl text-sm font-soft font-medium
                        cursor-pointer transition-all duration-150 touch-manipulation
                        focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                        active:scale-[0.97]
                        ${isActive
                          ? `${config.bgColor} ${config.color} border border-current/20 shadow-sm`
                          : 'bg-[var(--bento-bg)] border border-[var(--bento-border)] text-[var(--bento-text)] sm:hover:border-[var(--bento-primary)]/30 sm:hover:bg-[var(--bento-primary)]/5'
                        }
                      `}
                    >
                      <config.Icon className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{label}</span>
                    </button>
                  );
                })}
                {/* Clear filter button */}
                {hasActiveFilter && (
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="
                      inline-flex items-center gap-1.5
                      px-3 py-2 sm:px-3 sm:py-1.5 rounded-xl text-sm font-soft font-medium
                      text-[var(--bento-text-muted)] active:text-[var(--bento-primary)] sm:hover:text-[var(--bento-primary)]
                      bg-[var(--bento-bg)] border border-[var(--bento-border)] sm:hover:border-[var(--bento-primary)]/20
                      cursor-pointer transition-all touch-manipulation active:scale-[0.97]
                    "
                    aria-label="Clear filter"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear
                  </button>
                )}
              </div>

              {/* Search/filter results count */}
              {(isSearching || hasActiveFilter) && !isLoading && (
                <p className="mt-2.5 px-1 font-soft text-sm text-[var(--bento-text-muted)]" aria-live="polite">
                  {isTransitioning ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      Loading...
                    </span>
                  ) : (
                    <>
                      Found <span className="font-bold text-[var(--bento-primary)]">{displayedEvents.length}</span> event{displayedEvents.length !== 1 ? 's' : ''}
                    </>
                  )}
                </p>
              )}
            </div>
          </motion.section>

          {/* Controls bar - mobile-optimized layout */}
          <motion.div
            className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Top row on mobile: connection status + reconnect */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <ConnectionIndicator status={status} />
              
              {/* Reconnect button (only if disconnected/error) */}
              {(status === 'disconnected' || status === 'error') && (
                <motion.button
                  onClick={reconnect}
                  className="flex items-center gap-2 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-2xl sm:rounded-full text-sm font-soft font-semibold bg-[var(--bento-primary)] text-white active:bg-[var(--bento-primary)]/80 sm:hover:bg-[var(--bento-primary)]/90 transition-all cursor-pointer touch-manipulation"
                  whileTap={{ scale: 0.95 }}
                >
                  <Wifi className="w-4 h-4" />
                  Reconnect
                </motion.button>
              )}
            </div>

            {/* Bottom row on mobile: live events controls (hidden when searching/filtering) */}
            {!isSearching && !hasActiveFilter && (realtimeEvents.length > 0 || unseenCount > 0) && (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Toggle realtime events visibility */}
                {realtimeEvents.length > 0 && (
                  <button
                    onClick={() => setShowRealtimeEvents(!showRealtimeEvents)}
                    className={`
                      flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-3 sm:py-1.5 rounded-2xl sm:rounded-full text-sm font-soft font-medium
                      transition-all cursor-pointer touch-manipulation active:scale-[0.97]
                      ${showRealtimeEvents 
                        ? 'bg-[var(--bento-primary)]/10 text-[var(--bento-primary)] border border-[var(--bento-primary)]/20' 
                        : 'bg-[var(--bento-card)] text-[var(--bento-text-muted)] border border-[var(--bento-border)]'
                      }
                    `}
                  >
                    <Sparkles className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    {unseenCount > 0 ? `${unseenCount} new` : `${realtimeEvents.length} live`}
                    <ChevronDown className={`w-4 h-4 sm:w-3.5 sm:h-3.5 transition-transform ${showRealtimeEvents ? 'rotate-180' : ''}`} />
                  </button>
                )}

                {/* Mark as read button - only show when there are unseen events */}
                {unseenCount > 0 && (
                  <button
                    onClick={markAllAsSeen}
                    className="flex-1 sm:flex-none px-4 py-3 sm:px-3 sm:py-1.5 rounded-2xl sm:rounded-full text-sm font-soft font-medium text-[var(--bento-text-muted)] active:text-[var(--bento-primary)] sm:hover:text-[var(--bento-primary)] bg-[var(--bento-card)] border border-[var(--bento-border)] sm:hover:border-[var(--bento-primary)]/20 transition-all cursor-pointer touch-manipulation active:scale-[0.97]"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Events timeline */}
          <AnimatePresence mode="wait">
            {isLoading && apiEvents.length === 0 ? (
              <motion.div
                key="loading"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ContentCard className="text-center py-16" aria-busy={true} aria-live="polite">
                  <motion.img 
                    src={flyingMoogles} 
                    alt="" 
                    className="w-40 md:w-52 mx-auto mb-4"
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 2, -2, 0],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    aria-hidden="true"
                  />
                  <motion.p 
                    className="font-accent text-2xl text-[var(--bento-text-muted)]"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    role="status"
                  >
                    Gathering the chronicles, kupo...
                  </motion.p>
                </ContentCard>
              </motion.div>
            ) : isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ContentCard className="text-center py-12 md:py-16" role="alert">
                  <img 
                    src={deadMoogle} 
                    alt="" 
                    className="w-40 h-40 mx-auto mb-5 object-contain"
                    aria-hidden="true"
                  />
                  <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">
                    Something went wrong
                  </p>
                  <p className="font-accent text-2xl text-[var(--bento-text-muted)] mb-6">
                    The chronicle tome got lost, kupo...
                  </p>
                  <motion.button
                    onClick={() => refetch()}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="
                      inline-flex items-center justify-center gap-2
                      px-6 py-3 rounded-xl
                      bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)]
                      text-white font-soft font-semibold
                      shadow-lg shadow-[var(--bento-primary)]/25
                      hover:shadow-xl hover:shadow-[var(--bento-primary)]/30
                      transition-all cursor-pointer
                      focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bento-primary)] focus-visible:outline-none
                    "
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                    Try Again
                  </motion.button>
                </ContentCard>
              </motion.div>
            ) : totalCount === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ContentCard className="text-center py-12 md:py-16" aria-live="polite">
                  <img 
                    src={moogleMail} 
                    alt="" 
                    className="w-40 h-40 mx-auto mb-5 object-contain"
                    aria-hidden="true"
                  />
                  {(isSearching || hasActiveFilter) ? (
                    <>
                      <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">
                        No events found
                      </p>
                      <p className="font-accent text-2xl text-[var(--bento-text-muted)] mb-5">
                        {isSearching
                          ? 'Kupo? Nothing matches that search...'
                          : 'No events of that type yet, kupo...'}
                      </p>
                      <motion.button
                        onClick={handleClearAll}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="
                          inline-flex items-center justify-center gap-2
                          px-5 py-2.5 rounded-xl
                          bg-transparent border border-[var(--bento-primary)]/30
                          text-[var(--bento-primary)] font-soft font-semibold
                          hover:bg-[var(--bento-primary)]/10
                          transition-all cursor-pointer
                          focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                        "
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                        {isSearching && hasActiveFilter ? 'Clear search & filter' : isSearching ? 'Clear search' : 'Clear filter'}
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">
                        No events yet
                      </p>
                      <p className="font-accent text-2xl text-[var(--bento-text-muted)]">
                        The chronicle awaits its first entry, kupo~
                      </p>
                    </>
                  )}
                </ContentCard>
              </motion.div>
            ) : (
              <motion.div
                key={`content-${activeFilter ?? 'all'}-${deferredSearchQuery.trim()}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`space-y-4 transition-opacity duration-200 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
                role="feed"
                aria-label="Chronicle events timeline"
              >
                {/* Realtime events section (hidden when searching) */}
                <AnimatePresence mode="wait">
                {showRealtimeEvents && visibleRealtimeEvents.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                    aria-live="polite"
                    aria-label={`${unseenCount} new live updates`}
                  >
                    <div className="flex items-center gap-3 px-2">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-[var(--bento-primary)]"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-soft font-semibold text-[var(--bento-primary)]">
                        Live Updates
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-[var(--bento-primary)]/30 to-transparent" aria-hidden="true" />
                    </div>
                    
                    {visibleRealtimeEvents.map((event, index) => (
                      <TimelineEventCard
                        key={`rt-${getEventKey(event, index)}`}
                        event={event}
                        isRealtime={index < unseenCount}
                      />
                    ))}

                    <div className="flex items-center gap-3 px-2 pt-2">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--bento-border)] to-transparent" />
                      <span className="text-xs font-soft text-[var(--bento-text-muted)]">
                        Earlier events
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--bento-border)] to-transparent" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Historical events */}
              {displayedEvents.map((event, index) => (
                <TimelineEventCard 
                  key={`hist-${getEventKey(event, index)}`} 
                  event={event} 
                />
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
                      className="flex items-center gap-2.5 text-[var(--bento-text-muted)]"
                      role="status"
                    >
                      <Loader2 className="w-5 h-5 animate-spin text-[var(--bento-primary)]" aria-hidden="true" />
                      <span className="font-soft text-sm font-medium">Loading more events...</span>
                    </motion.div>
                  ) : (
                    <span className="text-xs text-[var(--bento-text-muted)]/50">&#8203;</span>
                  )}
                </div>
              )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer - shown only when all events have been loaded */}
          {!isLoading && !isError && totalCount > 0 && !hasNextPage && (
            <footer className="text-center mt-16 pt-8" style={{ paddingBottom: 'calc(2rem + var(--safe-area-inset-bottom, 0px))' }}>
              <StoryDivider className="mx-auto mb-6" size="sm" />
              <p className="font-accent text-xl text-[var(--bento-text-muted)] flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
                Every moment tells a story, kupo!
                <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
              </p>
              <p className="font-accent text-lg text-[var(--bento-secondary)] mt-2">
                ~ to be continued ~
              </p>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

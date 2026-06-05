import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useDeferredValue,
} from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEventsHub } from "../../hooks/useEventsHub";
import { eventsApi } from "../../api/events";
import type { ChronicleEventFilter } from "../../types";
import {
  hasValidId,
  getEventSignature,
  buildDayGroups,
  type EntryItem,
} from "./chronicleHelpers";

export function useChronicle() {
  const [searchInput, setSearchInput] = useState("");
  const [activeFilter, setActiveFilter] = useState<ChronicleEventFilter | null>(
    null,
  );
  const deferredSearchQuery = useDeferredValue(searchInput);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isSearching = deferredSearchQuery.trim().length > 0;
  const hasActiveFilter = activeFilter !== null;
  const hasActiveQuery = isSearching || hasActiveFilter;

  // realtime feed over SignalR
  const { status, realtimeEvents, unseenCount, reconnect, markAllAsSeen } =
    useEventsHub();

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["chronicle-events", deferredSearchQuery.trim(), activeFilter],
    queryFn: ({ pageParam }) =>
      eventsApi.getEvents({
        cursor: pageParam,
        limit: 20,
        query: deferredSearchQuery.trim() || undefined,
        filter: activeFilter ?? undefined,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 1000 * 60 * 2,
  });

  // infinite scroll via a callback-ref IntersectionObserver
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
      { rootMargin: "300px", threshold: 0 },
    );
    observerRef.current.observe(node);
  }, []);

  useEffect(
    () => () => {
      observerRef.current?.disconnect();
    },
    [],
  );

  useEffect(() => {
    if (sentinelVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [sentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // flatten pages, dropping dups that cursor shifts can surface across pages
  const apiEvents = useMemo(() => {
    if (!data?.pages) return [];
    const seen = new Set<string>();
    return data.pages
      .flatMap((page) => page.events)
      .filter((event) => {
        const key = hasValidId(event)
          ? `${event.id.timestamp}-${event.id.creationTime}`
          : getEventSignature(event);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [data]);

  // filtered/searching: API results only. default view: drop API events that
  // the realtime feed already covers so they don't show twice.
  const displayedEvents = useMemo(() => {
    if (hasActiveQuery) return apiEvents;
    const rtSignatures = new Set(realtimeEvents.map(getEventSignature));
    return apiEvents.filter((e) => !rtSignatures.has(getEventSignature(e)));
  }, [apiEvents, hasActiveQuery, realtimeEvents]);

  // only on the default view; memoized for a stable ref in dayGroups' deps
  const visibleRealtimeEvents = useMemo(
    () => (hasActiveQuery ? [] : realtimeEvents),
    [hasActiveQuery, realtimeEvents],
  );
  const totalCount = visibleRealtimeEvents.length + displayedEvents.length;

  // realtime (newest) ahead of historical, then bucketed by day
  const dayGroups = useMemo(() => {
    const items: EntryItem[] = [
      ...visibleRealtimeEvents.map((event, i) => ({
        event,
        isRealtime: true,
        isUnseen: i < unseenCount,
      })),
      ...displayedEvents.map((event) => ({
        event,
        isRealtime: false,
        isUnseen: false,
      })),
    ];
    return buildDayGroups(items);
  }, [visibleRealtimeEvents, displayedEvents, unseenCount]);

  // true while the input is ahead of the deferred (debounced) value
  const isTransitioning = searchInput !== deferredSearchQuery;

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    searchInputRef.current?.focus();
  }, []);

  const handleClearAll = useCallback(() => {
    setSearchInput("");
    setActiveFilter(null);
    searchInputRef.current?.focus();
  }, []);

  const handleToggleFilter = useCallback((filter: ChronicleEventFilter) => {
    setActiveFilter((prev) => (prev === filter ? null : filter));
  }, []);

  return {
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
  };
}

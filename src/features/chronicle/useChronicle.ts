import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEventsHub } from "@/shared/realtime/useEventsHub";
import { useAuth } from "@/shared/contexts/AuthContext";
import { eventsApi } from "@/features/chronicle/events";
import type { ChronicleEvent, ChronicleEventFilter } from "@/shared/types";
import {
  hasValidId,
  buildDayGroups,
  type EntryItem,
} from "@/features/chronicle/chronicleHelpers";

function eventIdentity(event: ChronicleEvent): string | undefined {
  const creationTime = Date.parse(event.id.creationTime);
  // Live events may use an epoch placeholder with either ISO spelling.
  if (!hasValidId(event) || (event.id.timestamp === 0 && creationTime === 0))
    return undefined;
  return JSON.stringify([
    event.id.timestamp,
    Number.isFinite(creationTime) ? creationTime : event.id.creationTime,
  ]);
}

function eventSignature(event: ChronicleEvent): string {
  const createdAt = Date.parse(event.createdAt);
  return JSON.stringify([
    Number.isFinite(createdAt) ? createdAt : event.createdAt,
    event.type,
    event.text,
  ]);
}

/** Keep real IDs authoritative; match an ID-less live copy by its exact content. */
function mergeEntries(items: EntryItem[]): EntryItem[] {
  const byId = new Map<string, EntryItem>();
  const bySignature = new Map<string, EntryItem[]>();
  const merged: EntryItem[] = [];

  for (const item of items) {
    const id = eventIdentity(item.event);
    const signature = eventSignature(item.event);
    const signatureMatches = bySignature.get(signature) ?? [];
    const existing =
      (id ? byId.get(id) : undefined) ??
      signatureMatches.find((match) => !id || !eventIdentity(match.event));

    if (existing) {
      existing.isRealtime ||= item.isRealtime;
      existing.isUnseen ||= item.isUnseen;
      if (!eventIdentity(existing.event) && id) existing.event = item.event;
      if (id) byId.set(id, existing);
      if (!signatureMatches.includes(existing)) {
        bySignature.set(signature, [...signatureMatches, existing]);
      }
    } else {
      const entry = { ...item };
      merged.push(entry);
      if (id) byId.set(id, entry);
      bySignature.set(signature, [...signatureMatches, entry]);
    }
  }

  const timestamp = (event: ChronicleEvent) => {
    const value = Date.parse(event.createdAt);
    return Number.isFinite(value) ? value : 0;
  };
  return merged.sort((a, b) => timestamp(b.event) - timestamp(a.event));
}

export function useChronicle() {
  const { user } = useAuth();
  const canViewNameChanges =
    user?.memberRank === "Paissa Trainer" ||
    user?.memberRank === "Moogle Knight" ||
    user?.memberRank === "Moogle Guardian";
  const [searchInput, setSearchInput] = useState("");
  const [selectedFilter, setActiveFilter] =
    useState<ChronicleEventFilter | null>(null);
  // Recheck access every render, including when a member's rank changes.
  const activeFilter =
    selectedFilter === "NameChanged" && !canViewNameChanges
      ? null
      : selectedFilter;
  // Keep the public name for callers; this is the committed, debounced query.
  const [deferredSearchQuery, setDeferredSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelPendingSearch = useCallback(() => {
    if (searchTimerRef.current !== null) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const query = searchInput.trim();
    if (query === deferredSearchQuery) return;
    searchTimerRef.current = setTimeout(() => {
      searchTimerRef.current = null;
      setDeferredSearchQuery(query);
    }, 300);
    return cancelPendingSearch;
  }, [searchInput, deferredSearchQuery, cancelPendingSearch]);

  const commitSearch = useCallback(() => {
    cancelPendingSearch();
    setDeferredSearchQuery(searchInput.trim());
  }, [cancelPendingSearch, searchInput]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "/" ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.defaultPrevented ||
        event.isComposing
      )
        return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.matches("input, textarea, select") ||
          target.isContentEditable ||
          target.closest(
            '[contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"]',
          ))
      )
        return;
      if (!searchInputRef.current || searchInputRef.current.disabled) return;
      event.preventDefault();
      searchInputRef.current.focus();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isSearching = deferredSearchQuery.length > 0;
  const hasActiveFilter = activeFilter !== null;
  const hasActiveQuery = isSearching || hasActiveFilter;
  const isTransitioning = searchInput.trim() !== deferredSearchQuery;

  const {
    status,
    realtimeEvents,
    unseenCount: hubUnseenCount,
    reconnect,
    markAllAsSeen,
  } = useEventsHub();

  const {
    data,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "chronicle-events",
      user?.discordId,
      canViewNameChanges,
      deferredSearchQuery,
      activeFilter,
    ],
    queryFn: ({ pageParam }) =>
      eventsApi.getEvents({
        cursor: pageParam,
        limit: 20,
        query: deferredSearchQuery || undefined,
        filter: activeFilter ?? undefined,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore && lastPage.nextCursor ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 1000 * 60 * 2,
  });

  // Pagination is always an explicit action. A failed older page leaves the
  // loaded pages intact and can be retried by pressing the same button.
  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetching || isTransitioning) return;
    return fetchNextPage({ cancelRefetch: false });
  }, [hasNextPage, isFetching, isTransitioning, fetchNextPage]);

  const apiItems = useMemo(
    () =>
      mergeEntries(
        (data?.pages.flatMap((page) => page.events) ?? [])
          .filter((event) => canViewNameChanges || event.type !== "NameChanged")
          .map((event) => ({
            event,
            isRealtime: false,
            isUnseen: false,
          })),
      ),
    [data, canViewNameChanges],
  );
  const apiEvents = useMemo(
    () => apiItems.map((item) => item.event),
    [apiItems],
  );

  const realtimeItems = useMemo(
    () =>
      mergeEntries(
        realtimeEvents
          .map((event, index) => ({
            event,
            isRealtime: true,
            isUnseen: index < hubUnseenCount,
          }))
          .filter(
            ({ event }) => canViewNameChanges || event.type !== "NameChanged",
          ),
      ),
    [realtimeEvents, hubUnseenCount, canViewNameChanges],
  );
  const unseenCount = realtimeItems.filter((item) => item.isUnseen).length;

  const entries = useMemo(
    () =>
      hasActiveQuery ? apiItems : mergeEntries([...realtimeItems, ...apiItems]),
    [hasActiveQuery, apiItems, realtimeItems],
  );
  const displayedEvents = useMemo(
    () => entries.filter((item) => !item.isRealtime).map((item) => item.event),
    [entries],
  );
  // This is the unique loaded count; the API does not provide a grand total.
  const totalCount = entries.length;
  const dayGroups = useMemo(() => buildDayGroups(entries), [entries]);

  const handleClearSearch = useCallback(() => {
    cancelPendingSearch();
    setSearchInput("");
    setDeferredSearchQuery("");
    searchInputRef.current?.focus();
  }, [cancelPendingSearch]);

  const handleClearAll = useCallback(() => {
    cancelPendingSearch();
    setSearchInput("");
    setDeferredSearchQuery("");
    setActiveFilter(null);
    searchInputRef.current?.focus();
  }, [cancelPendingSearch]);

  const handleToggleFilter = useCallback((filter: ChronicleEventFilter) => {
    setActiveFilter((prev) => (prev === filter ? null : filter));
  }, []);

  return {
    canViewNameChanges,
    searchInput,
    setSearchInput,
    activeFilter,
    setActiveFilter,
    deferredSearchQuery,
    searchInputRef,
    commitSearch,
    isSearching,
    hasActiveFilter,
    hasActiveQuery,
    status,
    unseenCount,
    reconnect,
    markAllAsSeen,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    loadMore,
    refetch,
    apiEvents,
    displayedEvents,
    totalCount,
    dayGroups,
    isTransitioning,
    handleClearSearch,
    handleClearAll,
    handleToggleFilter,
  };
}

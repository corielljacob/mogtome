import {
  useState,
  useMemo,
  useRef,
  useDeferredValue,
  useEffect,
  useCallback,
} from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { membersApi } from "../../api/members";
import { FC_RANKS } from "../../types";

// for validating rank names that arrive via the URL
const VALID_RANK_NAMES: Set<string> = new Set(FC_RANKS.map((r) => r.name));

const RANK_ORDER = new Map<string, number>(FC_RANKS.map((r, i) => [r.name, i]));

export type SortOption = "name-asc" | "name-desc" | "rank-asc";
export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "rank-asc", label: "Rank" },
  { value: "name-asc", label: "Name (A → Z)" },
  { value: "name-desc", label: "Name (Z → A)" },
];
const DEFAULT_SORT: SortOption = "rank-asc";

export function useMemberFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // search/filter/sort state lives in the URL
  const searchQuery = searchParams.get("q") || "";
  const ranksParam = searchParams.get("ranks");

  const selectedRanks = useMemo(() => {
    if (!ranksParam) return [];
    return ranksParam.split(",").filter((r) => VALID_RANK_NAMES.has(r));
  }, [ranksParam]);

  const sortBy = (searchParams.get("sort") as SortOption) || DEFAULT_SORT;
  const validSortBy = SORT_OPTIONS.some((o) => o.value === sortBy)
    ? sortBy
    : DEFAULT_SORT;

  const setSearchQuery = useCallback(
    (query: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (query.trim()) {
            next.set("q", query);
          } else {
            next.delete("q");
          }
          // back to page 1 when the result set changes
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSelectedRanks = useCallback(
    (updater: string[] | ((prev: string[]) => string[])) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const currentRanks =
            prev
              .get("ranks")
              ?.split(",")
              .filter((r) => VALID_RANK_NAMES.has(r)) || [];
          const newRanks =
            typeof updater === "function" ? updater(currentRanks) : updater;

          if (newRanks.length > 0) {
            next.set("ranks", newRanks.join(","));
          } else {
            next.delete("ranks");
          }
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSortBy = useCallback(
    (sort: SortOption) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (sort === DEFAULT_SORT) {
            next.delete("sort"); // omit default to keep the URL clean
          } else {
            next.set("sort", sort);
          }
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // local state for snappy typing; debounced into the URL below
  const [inputValue, setInputValue] = useState(searchQuery);

  // re-sync when the URL changes out from under us (e.g. back button)
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, searchQuery, setSearchQuery]);

  // Press "/" anywhere to jump to the search box
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/") return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      )
        return;
      e.preventDefault();
      searchInputRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const deferredSearchQuery = useDeferredValue(searchQuery);
  const deferredSelectedRanks = useDeferredValue(selectedRanks);
  const isFiltering =
    searchQuery !== deferredSearchQuery ||
    selectedRanks !== deferredSelectedRanks;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["members-all"],
    queryFn: () => membersApi.getMembers({ pageSize: 1000 }),
    staleTime: 1000 * 60 * 5,
  });

  const allMembers = useMemo(() => data?.items ?? [], [data]);

  const filteredMembers = useMemo(() => {
    let result = allMembers;

    if (deferredSearchQuery.trim()) {
      const query = deferredSearchQuery.toLowerCase();
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.freeCompanyRank.toLowerCase().includes(query),
      );
    }

    if (deferredSelectedRanks.length > 0) {
      result = result.filter((member) =>
        deferredSelectedRanks.includes(member.freeCompanyRank),
      );
    }

    result = [...result].sort((a, b) => {
      switch (validSortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "rank-asc":
        default: {
          // rank hierarchy, then alphabetical within a rank
          const rankDiff =
            (RANK_ORDER.get(a.freeCompanyRank) ?? 999) -
            (RANK_ORDER.get(b.freeCompanyRank) ?? 999);
          return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name);
        }
      }
    });

    return result;
  }, [allMembers, deferredSearchQuery, deferredSelectedRanks, validSortBy]);

  // single-pass grouping: O(n) instead of O(n * ranks)
  const membersByRank = useMemo(() => {
    const rankOrder = new Map<string, number>(
      FC_RANKS.map((r, i) => [r.name, i]),
    );

    const grouped = new Map<string, typeof filteredMembers>();
    for (const member of filteredMembers) {
      const existing = grouped.get(member.freeCompanyRank);
      if (existing) {
        existing.push(member);
      } else {
        grouped.set(member.freeCompanyRank, [member]);
      }
    }

    // rebuild in rank order - Map preserves insertion order
    const sorted = new Map<string, typeof filteredMembers>();
    const sortedEntries = Array.from(grouped.entries()).sort(
      ([a], [b]) => (rankOrder.get(a) ?? 999) - (rankOrder.get(b) ?? 999),
    );
    for (const [rank, members] of sortedEntries) {
      sorted.set(rank, members);
    }

    return sorted;
  }, [filteredMembers]);

  const toggleRank = useCallback(
    (rankName: string) => {
      setSelectedRanks((prev) =>
        prev.includes(rankName)
          ? prev.filter((r) => r !== rankName)
          : [...prev, rankName],
      );
    },
    [setSelectedRanks],
  );

  const clearFilters = useCallback(() => {
    setInputValue("");
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("q");
        next.delete("ranks");
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const hasActiveFilters = searchQuery.length > 0 || selectedRanks.length > 0;

  // single-pass O(n) instead of O(n * ranks)
  const rankCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const member of allMembers) {
      counts[member.freeCompanyRank] =
        (counts[member.freeCompanyRank] || 0) + 1;
    }
    return counts;
  }, [allMembers]);

  return {
    searchInputRef,
    inputValue,
    setInputValue,
    setSearchQuery,
    selectedRanks,
    validSortBy,
    setSortBy,
    toggleRank,
    clearFilters,
    hasActiveFilters,
    deferredSearchQuery,
    deferredSelectedRanks,
    isFiltering,
    isLoading,
    isError,
    refetch,
    allMembers,
    filteredMembers,
    membersByRank,
    rankCounts,
  };
}

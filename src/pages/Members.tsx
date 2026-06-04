import {
  useState,
  useMemo,
  useRef,
  useDeferredValue,
  useEffect,
  useCallback,
  type CSSProperties,
} from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Search, Users, X, ArrowUpDown } from "lucide-react";
import { membersApi } from "../api/members";
import { PaginatedMemberGrid } from "../components/PaginatedMemberGrid";
import { Dropdown } from "../components/Dropdown";
import {
  PageLayout,
  LoadingState,
  ErrorState,
  EmptyState,
} from "../components/PageShell";
import { ScrollToTopButton } from "../components/ScrollToTopButton";
import {
  KawaiiSparkle,
  KawaiiBow,
  KawaiiHeart,
} from "../components/kawaiiMotifs";
import { getRankColor } from "../constants/rankColors";
import { FC_RANKS } from "../types";
import grumpyMoogle from "../assets/moogles/just-the-moogle-cartoon-mammal-animal-wildlife-rabbit-transparent-png-2967816.webp";
import wizardMoogle from "../assets/moogles/wizard moogle.webp";
import musicMoogle from "../assets/moogles/moogle playing music.webp";
import lilGuyMoogle from "../assets/moogles/lil guy moogle.webp";

// for validating rank names that arrive via the URL
const VALID_RANK_NAMES: Set<string> = new Set(FC_RANKS.map((r) => r.name));

const RANK_ORDER = new Map<string, number>(FC_RANKS.map((r, i) => [r.name, i]));

type SortOption = "name-asc" | "name-desc" | "rank-asc";
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "rank-asc", label: "Rank" },
  { value: "name-asc", label: "Name (A → Z)" },
  { value: "name-desc", label: "Name (Z → A)" },
];
const DEFAULT_SORT: SortOption = "rank-asc";

export function Members() {
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

  const hasActiveFilters = searchQuery || selectedRanks.length > 0;

  // single-pass O(n) instead of O(n * ranks)
  const rankCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const member of allMembers) {
      counts[member.freeCompanyRank] =
        (counts[member.freeCompanyRank] || 0) + 1;
    }
    return counts;
  }, [allMembers]);

  return (
    <PageLayout moogles={{ primary: wizardMoogle, secondary: musicMoogle }}>
      <div className="corkboard relative px-3.5 py-7 sm:px-6 sm:py-9 md:px-9 md:py-11">
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

        <img
          src={lilGuyMoogle}
          alt=""
          aria-hidden="true"
          className="hidden lg:block absolute -top-7 -right-4 w-20 rotate-[10deg] animate-[float-gentle_4s_ease-in-out_infinite] pointer-events-none select-none z-20"
        />

        <header className="relative w-fit mx-auto mb-7 sm:mb-9 text-center animate-[fadeSlideIn_0.4s_ease-out]">
          <span
            className="pushpin absolute -top-2 left-1/2 -translate-x-1/2 z-10"
            aria-hidden="true"
          />
          <div className="surface paper -rotate-1 px-7 sm:px-12 py-5 sm:py-6">
            <div
              className="flex items-center justify-center gap-1.5 mb-1.5"
              aria-hidden="true"
            >
              <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--accent)]" />
              <KawaiiBow className="w-6 h-6 text-[var(--primary)]" />
              <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--secondary)]" />
            </div>
            <p className="eyebrow-script text-lg sm:text-2xl text-[var(--secondary)]/90 mb-1">
              ~ the whole moogle pile ~
            </p>
            <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[var(--text)]">
              <span className="text-highlight">Our Family</span>
            </h1>
            <div className="inline-flex items-center gap-1.5 mt-2 text-[var(--text-muted)]">
              <Users
                className="w-4 h-4 text-[var(--secondary)]"
                aria-hidden="true"
              />
              <span className="font-soft text-sm">
                <span className="font-display font-bold text-[var(--text)]">
                  {allMembers.length}
                </span>{" "}
                members
              </span>
            </div>
          </div>
        </header>

        {/* sticky so the shelf scrolls under it */}
        <motion.section
          className="sticky top-[calc(4rem+env(safe-area-inset-top))] md:top-4 z-30 mb-4 sm:mb-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span
            className="pushpin absolute -top-2 left-8 z-10"
            style={{ "--pin": "var(--secondary)" } as CSSProperties}
            aria-hidden="true"
          />
          <span
            className="pushpin absolute -top-2 right-8 z-10"
            style={{ "--pin": "var(--primary)" } as CSSProperties}
            aria-hidden="true"
          />
          <div className="surface paper p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <label htmlFor="member-search" className="sr-only">
                  Search members by name or rank
                </label>
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--primary)]/70 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  id="member-search"
                  type="search"
                  inputMode="search"
                  enterKeyHint="search"
                  placeholder="Find a friend, kupo~"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  aria-describedby="search-results-count"
                  className="
                  w-full pl-11 pr-11 py-3
                  bg-[var(--bg)] rounded-full
                  border-2 border-[color:color-mix(in_srgb,var(--primary)_16%,var(--card))]
                  focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20
                  font-soft text-base text-[var(--text)] placeholder:text-[var(--text-subtle)]
                  focus:outline-none transition-all touch-manipulation
                "
                  style={{ fontSize: "16px" }}
                />
                {!inputValue && (
                  <kbd
                    className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-md bg-[color:color-mix(in_srgb,var(--primary)_12%,var(--card))] border border-[color:color-mix(in_srgb,var(--primary)_22%,var(--card))] text-[var(--text-subtle)] text-xs font-mono pointer-events-none"
                    aria-hidden="true"
                  >
                    /
                  </kbd>
                )}
                {inputValue && (
                  <button
                    onClick={() => {
                      setInputValue("");
                      setSearchQuery("");
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-[var(--primary)]/12 active:bg-[var(--primary)]/30 sm:hover:bg-[var(--primary)]/20 transition-colors cursor-pointer touch-manipulation"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 text-[var(--primary)]" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:flex items-center gap-1.5 text-sm font-display font-bold text-[var(--text-muted)] pl-1">
                  <ArrowUpDown
                    className="w-4 h-4 text-[var(--secondary)]"
                    aria-hidden="true"
                  />
                  Sort
                </span>
                <Dropdown
                  options={SORT_OPTIONS}
                  value={validSortBy}
                  onChange={setSortBy}
                  icon={<ArrowUpDown className="w-4 h-4" />}
                  menuClassName="paper"
                  className="w-full sm:w-44"
                  aria-label="Sort members by"
                />
              </div>
            </div>
          </div>
        </motion.section>

        <section className="relative mb-7 sm:mb-9">
          <span
            className="pushpin absolute -top-2 left-8 z-10"
            style={{ "--pin": "var(--accent)" } as CSSProperties}
            aria-hidden="true"
          />
          <span
            className="pushpin absolute -top-2 right-8 z-10"
            style={{ "--pin": "var(--secondary)" } as CSSProperties}
            aria-hidden="true"
          />
          <div className="surface paper p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <KawaiiBow className="w-5 h-5 text-[var(--primary)]" />
                <span className="font-display font-bold text-sm text-[var(--text)]">
                  Pick a rank, kupo!
                </span>
                {hasActiveFilters && (
                  <span
                    id="search-results-count"
                    aria-live="polite"
                    className="text-xs font-soft text-[var(--text-muted)]"
                  >
                    ·{" "}
                    <span className="font-display font-bold text-[var(--primary)]">
                      {filteredMembers.length}
                    </span>
                    /{allMembers.length}
                  </span>
                )}
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm font-display font-bold text-[var(--text-muted)] hover:text-[var(--primary)] active:text-[var(--primary)] transition-colors cursor-pointer touch-manipulation"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by rank"
            >
              {FC_RANKS.map((rank) => {
                const count = rankCounts[rank.name] || 0;
                const isSelected = selectedRanks.includes(rank.name);
                const rankColor = getRankColor(rank.name);
                const RankIcon = rankColor.icon;
                return (
                  <motion.button
                    key={rank.name}
                    onClick={() => toggleRank(rank.name)}
                    aria-pressed={isSelected}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`
                      inline-flex items-center gap-1.5
                      pl-1.5 pr-3 py-1.5 rounded-full text-sm font-display font-bold
                      cursor-pointer transition-colors duration-200 touch-manipulation
                      focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
                      ${isSelected ? "gel text-white" : "bg-[var(--card)] border-2 text-[var(--text)]"}
                    `}
                    style={
                      isSelected
                        ? ({ "--gel-color": rankColor.hex } as CSSProperties)
                        : ({
                            borderColor: `color-mix(in srgb, ${rankColor.hex} 32%, var(--card))`,
                          } as CSSProperties)
                    }
                  >
                    <span
                      className="flex items-center justify-center w-6 h-6 rounded-full shrink-0"
                      style={
                        isSelected
                          ? { background: "rgba(255,255,255,0.22)" }
                          : {
                              background: `color-mix(in srgb, ${rankColor.hex} 16%, var(--card))`,
                            }
                      }
                    >
                      <RankIcon
                        className="w-3.5 h-3.5"
                        style={{ color: isSelected ? "#fff" : rankColor.hex }}
                        aria-hidden="true"
                      />
                    </span>
                    <span>{rank.name}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full leading-none ${isSelected ? "bg-white/25" : "bg-[var(--bg)] text-[var(--text-muted)]"}`}
                    >
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="paper">
            <LoadingState message="Fetching members, kupo..." />
          </div>
        ) : isError ? (
          <div className="paper">
            <ErrorState
              message="A moogle fell over, kupo..."
              onRetry={() => refetch()}
            />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="paper">
            <EmptyState
              title="No members found"
              message="Kupo? We couldn't find anyone by that name..."
              imageSrc={grumpyMoogle}
              onClear={hasActiveFilters ? clearFilters : undefined}
              clearLabel="Clear filters"
            />
          </div>
        ) : (
          <div
            className={`transition-opacity duration-200 ${isFiltering ? "opacity-50" : "opacity-100"}`}
          >
            <PaginatedMemberGrid
              members={filteredMembers}
              membersByRank={membersByRank}
              showGrouped={
                deferredSelectedRanks.length === 0 &&
                !deferredSearchQuery &&
                validSortBy === "rank-asc"
              }
              pageSize={24}
            />
          </div>
        )}

        {!isLoading && !isError && filteredMembers.length > 0 && (
          <div className="text-center mt-10 pt-7">
            <p className="eyebrow-script text-2xl text-[var(--text-muted)] inline-flex items-center justify-center gap-2.5">
              <KawaiiHeart className="w-5 h-5 text-[var(--primary)]" />
              Every member makes us stronger, kupo!
              <KawaiiHeart className="w-5 h-5 text-[var(--primary)]" />
            </p>
          </div>
        )}
      </div>

      <ScrollToTopButton />
    </PageLayout>
  );
}

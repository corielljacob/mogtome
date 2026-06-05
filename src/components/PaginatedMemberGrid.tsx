import {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useTransition,
  type CSSProperties,
} from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { FreeCompanyMember } from "@/shared/types";
import { MemberCard } from "@/components/MemberCard";
import { KawaiiStar } from "@/shared/ui/kawaiiMotifs";
import { getRankColor } from "@/shared/constants/rankColors";
import { scrollAppToTop } from "@/shared/lib/scroll";

interface PaginatedMemberGridProps {
  members: FreeCompanyMember[];
  /** when set, members render grouped by rank with section headers */
  membersByRank?: Map<string, FreeCompanyMember[]>;
  showGrouped?: boolean;
  pageSize?: number;
  pageParam?: string;
}

// matches Tailwind's default breakpoints
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

function getColumnCount(width: number): number {
  if (width >= BREAKPOINTS.xl) return 6;
  if (width >= BREAKPOINTS.lg) return 5;
  if (width >= BREAKPOINTS.md) return 4;
  if (width >= BREAKPOINTS.sm) return 3;
  return 2;
}

function useResponsiveColumns(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const [columnCount, setColumnCount] = useState(4);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateColumns = () => {
      const width = container.offsetWidth;
      setColumnCount(getColumnCount(width));
    };

    updateColumns();
    const resizeObserver = new ResizeObserver(updateColumns);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  return columnCount;
}

function RankHeader({
  rankName,
  memberCount,
}: {
  rankName: string;
  memberCount: number;
}) {
  const rankColor = getRankColor(rankName);
  const RankIcon = rankColor.icon;

  return (
    <div className="flex items-center gap-3 py-3 sm:py-4">
      <div
        className="sticker px-3 py-1.5"
        style={{
          backgroundColor: `color-mix(in srgb, ${rankColor.hex} 15%, var(--card))`,
          border: `2px solid color-mix(in srgb, ${rankColor.hex} 34%, var(--card))`,
        }}
      >
        <span
          className="flex items-center justify-center w-5 h-5 rounded-full shrink-0"
          style={{ backgroundColor: rankColor.hex }}
        >
          <RankIcon className="w-3 h-3 text-white" aria-hidden="true" />
        </span>
        <h2 className="font-display font-bold text-sm sm:text-base text-[var(--text)] leading-none">
          {rankColor.label}
        </h2>
        <span
          className="text-xs font-display font-bold px-1.5 py-0.5 rounded-full leading-none"
          style={{
            backgroundColor: `color-mix(in srgb, ${rankColor.hex} 22%, var(--card))`,
            color: `color-mix(in srgb, ${rankColor.hex} 62%, var(--text))`,
          }}
          aria-label={`${memberCount} members`}
        >
          {memberCount}
        </span>
      </div>
      <div
        className="flex-1 border-t-2 border-dashed"
        style={{
          borderColor: `color-mix(in srgb, ${rankColor.hex} 28%, transparent)`,
        }}
        aria-hidden="true"
      />
      <KawaiiStar className="w-4 h-4 shrink-0" color={rankColor.hex} />
    </div>
  );
}

// non-virtualized so form state survives in biography-edit mode (virtual rows would unmount).
// pagination is URL-synced (bookmarkable, back-button works).
export function PaginatedMemberGrid({
  members,
  membersByRank,
  showGrouped = false,
  pageSize = 24,
  pageParam = "page",
}: PaginatedMemberGridProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const columnCount = useResponsiveColumns(containerRef);

  const totalPages = Math.ceil(members.length / pageSize);

  // URL page is 1-indexed for users; convert to 0-indexed and clamp
  const urlPage = parseInt(searchParams.get(pageParam) || "1", 10);
  const currentPage = Math.max(0, Math.min(totalPages - 1, urlPage - 1));

  // re-sync URL when the page falls out of bounds (e.g. filtering shrinks the list)
  useEffect(() => {
    if (totalPages === 0) return;

    const maxPageIdx = totalPages - 1;
    const urlPageIdx = urlPage - 1;
    const clampedPageIdx = Math.max(0, Math.min(maxPageIdx, urlPageIdx));

    if (clampedPageIdx !== urlPageIdx) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (clampedPageIdx === 0) {
            next.delete(pageParam);
          } else {
            next.set(pageParam, String(clampedPageIdx + 1));
          }
          return next;
        },
        { replace: true },
      );
    }
  }, [urlPage, totalPages, pageParam, setSearchParams]);

  // reset to page 1 when the list content changes. track the first member's id
  // too, since count alone misses same-size filter swaps.
  const prevFirstMemberId = useRef<string | undefined>(undefined);
  const prevMemberCount = useRef(members.length);

  useEffect(() => {
    const firstMemberId = members[0]?.characterId;
    const countChanged = members.length !== prevMemberCount.current;
    const contentChanged = firstMemberId !== prevFirstMemberId.current;

    if ((countChanged || contentChanged) && currentPage !== 0) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete(pageParam);
          return next;
        },
        { replace: true },
      );
    }

    prevFirstMemberId.current = firstMemberId;
    prevMemberCount.current = members.length;
  }, [members, currentPage, pageParam, setSearchParams]);

  const paginatedMembers = useMemo(() => {
    const start = currentPage * pageSize;
    return members.slice(start, start + pageSize);
  }, [members, currentPage, pageSize]);

  const paginatedByRank = useMemo(() => {
    if (!showGrouped || !membersByRank) return null;

    // flatten across ranks so pagination cuts at a global offset, then regroup
    const allWithRank: { member: FreeCompanyMember; rank: string }[] = [];
    for (const [rankName, rankMembers] of membersByRank) {
      for (const member of rankMembers) {
        allWithRank.push({ member, rank: rankName });
      }
    }

    const start = currentPage * pageSize;
    const paginated = allWithRank.slice(start, start + pageSize);

    const grouped = new Map<string, FreeCompanyMember[]>();
    for (const { member, rank } of paginated) {
      const existing = grouped.get(rank) || [];
      existing.push(member);
      grouped.set(rank, existing);
    }

    return grouped;
  }, [showGrouped, membersByRank, currentPage, pageSize]);

  // Scroll the app container to the top AFTER an explicit page change commits, so
  // the smooth scroll isn't interrupted by the content swap. The flag keeps it from
  // firing on filter-induced page resets - toggling a rank keeps you in place.
  const scrollOnPageChange = useRef(false);
  useEffect(() => {
    if (scrollOnPageChange.current) {
      scrollOnPageChange.current = false;
      scrollAppToTop();
    }
  }, [currentPage]);

  const navigateToPage = useCallback(
    (page: number) => {
      scrollOnPageChange.current = true;
      startTransition(() => {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (page === 0) {
            next.delete(pageParam); // keep page 1 out of the URL
          } else {
            next.set(pageParam, String(page + 1));
          }
          return next;
        });
      });
    },
    [pageParam, setSearchParams],
  );

  const handlePrevPage = useCallback(() => {
    if (currentPage > 0) navigateToPage(currentPage - 1);
  }, [currentPage, navigateToPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) navigateToPage(currentPage + 1);
  }, [currentPage, totalPages, navigateToPage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ignore arrows while typing in a field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "ArrowLeft" && currentPage > 0) {
        e.preventDefault();
        navigateToPage(currentPage - 1);
      } else if (e.key === "ArrowRight" && currentPage < totalPages - 1) {
        e.preventDefault();
        navigateToPage(currentPage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, navigateToPage]);

  return (
    <div ref={containerRef} className="w-full">
      {showGrouped && paginatedByRank ? (
        <div className="space-y-2">
          {Array.from(paginatedByRank.entries()).map(
            ([rankName, rankMembers]) => (
              <div key={rankName}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RankHeader
                    rankName={rankName}
                    memberCount={rankMembers.length}
                  />
                </motion.div>
                <div
                  className="grid gap-2.5 sm:gap-4 md:gap-5 lg:gap-6 justify-items-center py-1.5"
                  style={{
                    gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                  }}
                >
                  {rankMembers.map((member, idx) => (
                    <MemberCard
                      key={member.characterId}
                      member={member}
                      index={idx}
                    />
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        <div
          className="grid gap-2.5 sm:gap-4 md:gap-5 lg:gap-6 justify-items-center py-1.5"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
          }}
        >
          {paginatedMembers.map((member, idx) => (
            <MemberCard key={member.characterId} member={member} index={idx} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          className="mt-8 sm:mt-10 pt-7 flex items-center justify-center gap-2.5 sm:gap-4"
          aria-label="Pagination"
        >
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0 || isPending}
            aria-label="Go to previous page"
            className="
              flex items-center justify-center gap-1.5 h-11 px-4 sm:px-5
              gel hover-bounce text-white font-display font-bold text-sm
              disabled:opacity-35 disabled:cursor-not-allowed
              focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none
              cursor-pointer touch-manipulation
            "
            style={{ "--gel-color": "var(--secondary)" } as CSSProperties}
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div
            className="inline-flex items-center gap-2 h-11 px-4 sm:px-5 rounded-full bg-[var(--card)] border-2 border-[color:color-mix(in_srgb,var(--primary)_18%,var(--card))]"
            role="status"
            aria-live="polite"
          >
            {isPending && (
              <Loader2
                className="w-4 h-4 text-[var(--primary)] animate-spin"
                aria-hidden="true"
              />
            )}
            <span
              className="font-display font-bold text-sm text-[var(--text)] whitespace-nowrap"
              aria-label={`Page ${currentPage + 1} of ${totalPages}`}
            >
              <span className="text-[var(--primary)]">{currentPage + 1}</span>
              <span className="text-[var(--text-subtle)] font-soft px-0.5">
                /
              </span>
              {totalPages}
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1 || isPending}
            aria-label="Go to next page"
            className="
              flex items-center justify-center gap-1.5 h-11 px-4 sm:px-5
              gel hover-bounce text-white font-display font-bold text-sm
              disabled:opacity-35 disabled:cursor-not-allowed
              focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none
              cursor-pointer touch-manipulation
            "
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  );
}

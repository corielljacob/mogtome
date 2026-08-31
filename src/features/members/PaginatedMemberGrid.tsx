import { useMemo, useRef, useEffect, useCallback, useTransition } from "react";
import { useSearchParams } from "react-router-dom";
import type { FreeCompanyMember } from "@/shared/types";
import { MemberCard } from "@/features/members/MemberCard";
import { FamilyIcon, FamilyRankIcon } from "./FamilyIcons";
import "./family-controls.css";
import "./family-pagination.css";

interface PaginatedMemberGridProps {
  members: FreeCompanyMember[];
  /** When set, members render grouped by rank with section headers. */
  membersByRank?: Map<string, FreeCompanyMember[]>;
  showGrouped?: boolean;
  pageSize?: number;
  pageParam?: string;
}

function visiblePages(current: number, total: number): (number | string)[] {
  if (total <= 5) return Array.from({ length: total }, (_, index) => index);

  const pages = [...new Set([0, current - 1, current, current + 1, total - 1])]
    .filter((page) => page >= 0 && page < total)
    .sort((a, b) => a - b);
  const items: (number | string)[] = [];
  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) {
      items.push(`gap-${page}`);
    }
    items.push(page);
  });
  return items;
}

function RankHeader({
  rankName,
  memberCount,
}: {
  rankName: string;
  memberCount: number;
}) {
  return (
    <div className="family-rank-header">
      <span className="family-rank-seal" aria-hidden="true">
        <FamilyRankIcon rank={rankName} size={23} />
      </span>
      <h3>{rankName}</h3>
      <span className="family-rank-rule" aria-hidden="true" />
      <span className="family-rank-page-count">
        {memberCount} <span>on this page</span>
      </span>
    </div>
  );
}

// Keep cards mounted within a page, and keep each page bookmarkable.
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
  const totalPages = Math.max(1, Math.ceil(members.length / pageSize));
  const pageValue = searchParams.get(pageParam);
  const parsedPage = Number(pageValue ?? 1);
  const urlPage =
    Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const currentPage = Math.min(totalPages, urlPage) - 1;

  // Filtering resets the page in useMemberFilters. Only normalize invalid or
  // out-of-range values here so a direct link to a later page survives mounting.
  useEffect(() => {
    if (pageValue === null || pageValue === String(currentPage + 1)) return;

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (currentPage === 0) next.delete(pageParam);
        else next.set(pageParam, String(currentPage + 1));
        return next;
      },
      { replace: true },
    );
  }, [pageValue, currentPage, pageParam, setSearchParams]);

  const startIndex = currentPage * pageSize;
  const paginatedMembers = members.slice(startIndex, startIndex + pageSize);

  const paginatedByRank = useMemo(() => {
    if (!showGrouped || !membersByRank) return null;

    const allWithRank: { member: FreeCompanyMember; rank: string }[] = [];
    for (const [rankName, rankMembers] of membersByRank) {
      for (const member of rankMembers) {
        allWithRank.push({ member, rank: rankName });
      }
    }

    const grouped = new Map<string, FreeCompanyMember[]>();
    for (const { member, rank } of allWithRank.slice(
      startIndex,
      startIndex + pageSize,
    )) {
      const existing = grouped.get(rank) || [];
      existing.push(member);
      grouped.set(rank, existing);
    }
    return grouped;
  }, [showGrouped, membersByRank, startIndex, pageSize]);

  const scrollOnPageChange = useRef(false);
  useEffect(() => {
    if (!scrollOnPageChange.current) return;
    scrollOnPageChange.current = false;
    const album = containerRef.current;
    if (!album) return;

    // Return to the portraits after turning a page, without revisiting the hero.
    album.focus({ preventScroll: true });
    album.scrollIntoView({
      behavior:
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.classList.contains("reduce-motion")
          ? "instant"
          : "smooth",
      block: "start",
    });
  }, [currentPage]);

  const navigateToPage = useCallback(
    (page: number) => {
      if (page === currentPage || page < 0 || page >= totalPages) return;
      scrollOnPageChange.current = true;
      startTransition(() => {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (page === 0) next.delete(pageParam);
          else next.set(pageParam, String(page + 1));
          return next;
        });
      });
    },
    [currentPage, totalPages, pageParam, setSearchParams],
  );

  const range = `Members ${startIndex + 1}–${Math.min(startIndex + pageSize, members.length)} of ${members.length}`;
  const numberedPages = visiblePages(currentPage, totalPages);

  function pageTurn(direction: "previous" | "next", top = false) {
    const previous = direction === "previous";
    return (
      <button
        type="button"
        onClick={() => navigateToPage(currentPage + (previous ? -1 : 1))}
        disabled={
          isPending ||
          (previous ? currentPage === 0 : currentPage === totalPages - 1)
        }
        aria-label={`Go to ${direction} page${top ? ", top" : ""}`}
        className={`family-page-turn family-page-${direction}${top ? " family-page-turn-top" : ""}`}
      >
        {previous && <FamilyIcon name="arrow-left" size={19} />}
        <span>{previous ? "Previous" : "Next"}</span>
        {!previous && <FamilyIcon name="arrow-right" size={19} />}
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="family-album-pages"
      tabIndex={-1}
      role="region"
      aria-label={`Members, page ${currentPage + 1} of ${totalPages}`}
      aria-busy={isPending}
    >
      {totalPages > 1 ? (
        <nav className="family-pagination-top" aria-label="Member pages, top">
          <p className="family-page-summary">{range}</p>
          <div className="family-page-tools">
            {pageTurn("previous", true)}
            <div className="family-page-jump">
              <span>Page</span>
              <span className="family-page-select">
                <select
                  aria-label="Go to page"
                  value={currentPage + 1}
                  disabled={isPending}
                  onChange={(event) =>
                    navigateToPage(Number(event.target.value) - 1)
                  }
                >
                  {Array.from({ length: totalPages }, (_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
                <FamilyIcon name="chevron-down" size={12} />
              </span>
              <span>of {totalPages}</span>
            </div>
            {pageTurn("next", true)}
          </div>
        </nav>
      ) : members.length > 0 ? (
        <p className="family-page-single-count">
          {members.length} {members.length === 1 ? "member" : "members"}
        </p>
      ) : null}

      {showGrouped && paginatedByRank ? (
        <div
          key={currentPage}
          className="family-rank-sections family-page-enter"
        >
          {Array.from(paginatedByRank.entries()).map(
            ([rankName, rankMembers]) => (
              <section key={rankName} className="family-rank-section">
                <RankHeader
                  rankName={rankName}
                  memberCount={rankMembers.length}
                />
                <div className="family-member-grid">
                  {rankMembers.map((member, index) => (
                    <MemberCard
                      key={member.characterId}
                      member={member}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            ),
          )}
        </div>
      ) : (
        <div key={currentPage} className="family-member-grid family-page-enter">
          {paginatedMembers.map((member, index) => (
            <MemberCard
              key={member.characterId}
              member={member}
              index={index}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          className="family-pagination-bottom"
          aria-label="Member pages, bottom"
        >
          <div
            className="family-page-bottom-summary"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span>{range}</span>
            <span>
              Page {currentPage + 1} of {totalPages}
            </span>
          </div>
          <div className="family-page-navigation">
            {pageTurn("previous")}
            <ol className="family-page-numbers">
              {numberedPages.map((page) => (
                <li
                  key={page}
                  aria-hidden={typeof page === "string" || undefined}
                >
                  {typeof page === "number" ? (
                    <button
                      type="button"
                      onClick={() => navigateToPage(page)}
                      aria-label={`Go to page ${page + 1}`}
                      aria-current={page === currentPage ? "page" : undefined}
                      disabled={isPending}
                      className="family-page-number"
                    >
                      {page + 1}
                    </button>
                  ) : (
                    <span className="family-page-ellipsis" aria-hidden="true">
                      …
                    </span>
                  )}
                </li>
              ))}
            </ol>
            {pageTurn("next")}
          </div>
        </nav>
      )}
    </div>
  );
}

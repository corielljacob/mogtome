import { useState, useMemo, useRef, useEffect, useCallback, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';
import type { FreeCompanyMember } from '../types';
import { MemberCard } from './MemberCard';

interface PaginatedMemberGridProps {
  members: FreeCompanyMember[];
  /** If provided, members will be grouped by rank with section headers */
  membersByRank?: Map<string, FreeCompanyMember[]>;
  /** Whether we're showing grouped view (by rank) or flat filtered view */
  showGrouped?: boolean;
  /** Items per page (default 24) */
  pageSize?: number;
  /** Query param name for page (default 'page') */
  pageParam?: string;
}

// Breakpoint configuration matching Tailwind's defaults
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

function useResponsiveColumns(containerRef: React.RefObject<HTMLDivElement | null>) {
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

function RankHeader({ rankName, memberCount }: { rankName: string; memberCount: number }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="flex items-center gap-2.5">
        <Star className="w-4 h-4 text-[var(--bento-secondary)] fill-[var(--bento-secondary)]" />
        <h2 className="font-display font-bold text-xl md:text-2xl text-[var(--bento-text)]">
          {rankName}
        </h2>
        <span className="
          px-3 py-1 rounded-full 
          bg-gradient-to-r from-[var(--bento-primary)]/15 to-[var(--bento-secondary)]/15
          text-[var(--bento-primary)] text-sm font-soft font-bold
          border border-[var(--bento-primary)]/15
        ">
          {memberCount}
        </span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-[var(--bento-primary)]/20 via-[var(--bento-secondary)]/10 to-transparent" />
    </div>
  );
}

// Height of navbar (~72px) + sticky search bar (~80px compact) + breathing room
const SCROLL_OFFSET = 180;

/**
 * PaginatedMemberGrid - Non-virtualized grid with pagination.
 * Better for bio editing mode where form state needs to persist.
 * 
 * FEATURES:
 * - URL-synced pagination (bookmarkable, shareable, back-button works)
 * - Smooth transitions between pages with loading indicator
 * - Keyboard navigation (← →)
 * - Accessible with ARIA labels
 */
export function PaginatedMemberGrid({ 
  members, 
  membersByRank,
  showGrouped = false,
  pageSize = 24,
  pageParam = 'page',
}: PaginatedMemberGridProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const columnCount = useResponsiveColumns(containerRef);
  
  const totalPages = Math.ceil(members.length / pageSize);
  
  // Read page from URL, defaulting to 1 (displayed as 1-indexed to users)
  const urlPage = parseInt(searchParams.get(pageParam) || '1', 10);
  // Convert to 0-indexed and clamp to valid range
  const currentPage = Math.max(0, Math.min(totalPages - 1, urlPage - 1));
  
  // Update URL when page would be out of bounds (e.g., after filtering reduces results)
  useEffect(() => {
    const clampedPage = Math.max(0, Math.min(totalPages - 1, urlPage - 1));
    if (clampedPage !== urlPage - 1 && totalPages > 0) {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (clampedPage === 0) {
          next.delete(pageParam); // Clean URL for page 1
        } else {
          next.set(pageParam, String(clampedPage + 1));
        }
        return next;
      }, { replace: true });
    }
  }, [urlPage, totalPages, pageParam, setSearchParams]);
  
  // Reset to page 1 when member count changes significantly (filtering)
  const prevMemberCount = useRef(members.length);
  useEffect(() => {
    if (Math.abs(members.length - prevMemberCount.current) > pageSize / 2) {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.delete(pageParam);
        return next;
      }, { replace: true });
    }
    prevMemberCount.current = members.length;
  }, [members.length, pageSize, pageParam, setSearchParams]);
  
  const paginatedMembers = useMemo(() => {
    const start = currentPage * pageSize;
    return members.slice(start, start + pageSize);
  }, [members, currentPage, pageSize]);

  // For grouped view, we paginate by rank groups
  const paginatedByRank = useMemo(() => {
    if (!showGrouped || !membersByRank) return null;
    
    // Flatten all members with their rank info for pagination
    const allWithRank: { member: FreeCompanyMember; rank: string }[] = [];
    for (const [rankName, rankMembers] of membersByRank) {
      for (const member of rankMembers) {
        allWithRank.push({ member, rank: rankName });
      }
    }
    
    const start = currentPage * pageSize;
    const paginated = allWithRank.slice(start, start + pageSize);
    
    // Regroup paginated results
    const grouped = new Map<string, FreeCompanyMember[]>();
    for (const { member, rank } of paginated) {
      const existing = grouped.get(rank) || [];
      existing.push(member);
      grouped.set(rank, existing);
    }
    
    return grouped;
  }, [showGrouped, membersByRank, currentPage, pageSize]);

  // Scroll to top of grid with offset for sticky header
  const scrollToGrid = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      const targetScroll = absoluteTop - SCROLL_OFFSET;
      window.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
    }
  }, []);

  // Navigate to a specific page (0-indexed internally, 1-indexed in URL)
  const navigateToPage = useCallback((page: number) => {
    // Scroll first, before the transition starts
    scrollToGrid();
    
    startTransition(() => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (page === 0) {
          next.delete(pageParam); // Keep URL clean for page 1
        } else {
          next.set(pageParam, String(page + 1));
        }
        return next;
      });
    });
  }, [pageParam, setSearchParams, scrollToGrid]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 0) navigateToPage(currentPage - 1);
  }, [currentPage, navigateToPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) navigateToPage(currentPage + 1);
  }, [currentPage, totalPages, navigateToPage]);

  const handleFirstPage = useCallback(() => {
    navigateToPage(0);
  }, [navigateToPage]);

  const handleLastPage = useCallback(() => {
    navigateToPage(totalPages - 1);
  }, [totalPages, navigateToPage]);

  const handlePageClick = useCallback((page: number) => {
    navigateToPage(page);
  }, [navigateToPage]);

  // Keyboard navigation - directly calls navigateToPage to ensure scroll happens
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === 'ArrowLeft' && currentPage > 0) {
        e.preventDefault();
        navigateToPage(currentPage - 1);
      } else if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
        e.preventDefault();
        navigateToPage(currentPage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, navigateToPage]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible + 2) {
      // Show all pages
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(0);
      
      if (currentPage > 2) pages.push('ellipsis');
      
      // Show pages around current
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 3) pages.push('ellipsis');
      
      // Always show last page
      pages.push(totalPages - 1);
    }
    
    return pages;
  };

  return (
    <div ref={containerRef} className="w-full">
      {/* Grouped view */}
      {showGrouped && paginatedByRank ? (
        <div className="space-y-2">
          {Array.from(paginatedByRank.entries()).map(([rankName, rankMembers]) => (
            <div key={rankName}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RankHeader rankName={rankName} memberCount={rankMembers.length} />
              </motion.div>
              <div 
                className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-items-center py-1.5"
                style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
              >
                {rankMembers.map((member, idx) => (
                  <MemberCard key={member.characterId} member={member} index={idx} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Flat view */
        <div 
          className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-items-center py-1.5"
          style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
        >
          {paginatedMembers.map((member, idx) => (
            <MemberCard key={member.characterId} member={member} index={idx} />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-10 pt-8 border-t border-[var(--bento-border)]">
          {/* Page info header with loading indicator */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--bento-primary)]/20 to-transparent" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bento-card)] border border-[var(--bento-border)] shadow-sm">
              {isPending ? (
                <Loader2 className="w-4 h-4 text-[var(--bento-primary)] animate-spin" />
              ) : (
                <Star className="w-4 h-4 text-[var(--bento-secondary)] fill-[var(--bento-secondary)]" />
              )}
              <span className="font-soft font-medium text-sm text-[var(--bento-text)]">
                Page <span className="text-[var(--bento-primary)] font-bold">{currentPage + 1}</span> of <span className="font-bold">{totalPages}</span>
              </span>
              <span className="text-[var(--bento-text-muted)] text-xs">
                ({members.length} members)
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--bento-primary)]/20 to-transparent" />
          </div>

          {/* Main pagination controls */}
          <nav 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            aria-label="Pagination"
            role="navigation"
          >
            {/* Navigation buttons group */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* First page button */}
              <button
                onClick={handleFirstPage}
                disabled={currentPage === 0 || isPending}
                aria-label="Go to first page"
                className="
                  flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 rounded-xl
                  bg-[var(--bento-card)] border border-[var(--bento-border)]
                  text-[var(--bento-text-muted)]
                  hover:border-[var(--bento-primary)]/30 hover:bg-[var(--bento-primary)]/5 hover:text-[var(--bento-primary)]
                  active:scale-95
                  disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[var(--bento-card)] disabled:hover:text-[var(--bento-text-muted)] disabled:hover:border-[var(--bento-border)]
                  transition-all cursor-pointer
                "
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Previous button */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0 || isPending}
                aria-label="Go to previous page"
                className="
                  flex items-center gap-1.5 px-4 py-2.5 h-11 sm:h-10 rounded-xl
                  bg-[var(--bento-card)] border border-[var(--bento-border)]
                  text-[var(--bento-text)] font-soft font-medium text-sm
                  hover:border-[var(--bento-primary)]/30 hover:bg-[var(--bento-primary)]/5
                  active:scale-95
                  disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[var(--bento-card)] disabled:hover:border-[var(--bento-border)]
                  transition-all cursor-pointer
                "
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page numbers - hidden on very small screens */}
              <div className="hidden xs:flex items-center gap-1 mx-1">
                {getPageNumbers().map((page, idx) => (
                  page === 'ellipsis' ? (
                    <span 
                      key={`ellipsis-${idx}`} 
                      className="w-8 text-center text-[var(--bento-text-muted)] font-soft select-none"
                      aria-hidden="true"
                    >
                      ···
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      disabled={isPending}
                      aria-label={`Go to page ${page + 1}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                      className={`
                        w-11 h-11 sm:w-10 sm:h-10 rounded-xl font-soft font-semibold text-sm
                        transition-all cursor-pointer
                        active:scale-95
                        disabled:cursor-wait
                        ${currentPage === page
                          ? 'bg-gradient-to-br from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white shadow-lg shadow-[var(--bento-primary)]/30'
                          : 'bg-[var(--bento-card)] border border-[var(--bento-border)] text-[var(--bento-text)] hover:border-[var(--bento-primary)]/40 hover:bg-[var(--bento-primary)]/10 hover:text-[var(--bento-primary)]'
                        }
                      `}
                    >
                      {page + 1}
                    </button>
                  )
                ))}
              </div>

              {/* Mobile page indicator (shows on very small screens) */}
              <span className="xs:hidden px-3 font-soft font-medium text-sm text-[var(--bento-text-muted)]">
                {currentPage + 1} / {totalPages}
              </span>

              {/* Next button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1 || isPending}
                aria-label="Go to next page"
                className="
                  flex items-center gap-1.5 px-4 py-2.5 h-11 sm:h-10 rounded-xl
                  bg-[var(--bento-card)] border border-[var(--bento-border)]
                  text-[var(--bento-text)] font-soft font-medium text-sm
                  hover:border-[var(--bento-primary)]/30 hover:bg-[var(--bento-primary)]/5
                  active:scale-95
                  disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[var(--bento-card)] disabled:hover:border-[var(--bento-border)]
                  transition-all cursor-pointer
                "
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last page button */}
              <button
                onClick={handleLastPage}
                disabled={currentPage === totalPages - 1 || isPending}
                aria-label="Go to last page"
                className="
                  flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 rounded-xl
                  bg-[var(--bento-card)] border border-[var(--bento-border)]
                  text-[var(--bento-text-muted)]
                  hover:border-[var(--bento-primary)]/30 hover:bg-[var(--bento-primary)]/5 hover:text-[var(--bento-primary)]
                  active:scale-95
                  disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[var(--bento-card)] disabled:hover:text-[var(--bento-text-muted)] disabled:hover:border-[var(--bento-border)]
                  transition-all cursor-pointer
                "
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </nav>

          {/* Keyboard hint - hidden on touch devices */}
          <p className="hidden sm:block text-center mt-4 text-xs text-[var(--bento-text-subtle)] font-soft">
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bento-bg)] border border-[var(--bento-border)] text-[var(--bento-text-muted)] font-mono text-[10px]">←</kbd>
            {' '}
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bento-bg)] border border-[var(--bento-border)] text-[var(--bento-text-muted)] font-mono text-[10px]">→</kbd>
            {' '}to navigate pages
          </p>
        </div>
      )}
    </div>
  );
}

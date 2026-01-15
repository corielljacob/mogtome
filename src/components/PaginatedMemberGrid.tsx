import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
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

/**
 * PaginatedMemberGrid - Non-virtualized grid with pagination.
 * Better for bio editing mode where form state needs to persist.
 */
export function PaginatedMemberGrid({ 
  members, 
  membersByRank,
  showGrouped = false,
  pageSize = 24,
}: PaginatedMemberGridProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const columnCount = useResponsiveColumns(containerRef);

  // Reset to first page when members change (e.g., filtering)
  useEffect(() => {
    setCurrentPage(0);
  }, [members.length]);

  const totalPages = Math.ceil(members.length / pageSize);
  
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

  const handlePrevPage = () => {
    setCurrentPage(p => Math.max(0, p - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setCurrentPage(p => Math.min(totalPages - 1, p + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[var(--bento-border)]">
          {/* Previous button */}
          <motion.button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              flex items-center gap-1 px-3 py-2 rounded-xl
              bg-[var(--bento-card)] border border-[var(--bento-border)]
              text-[var(--bento-text)] font-soft font-medium text-sm
              hover:border-[var(--bento-primary)]/30 hover:bg-[var(--bento-primary)]/5
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--bento-card)]
              transition-colors cursor-pointer
            "
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </motion.button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, idx) => (
              page === 'ellipsis' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-[var(--bento-text-muted)]">...</span>
              ) : (
                <motion.button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`
                    w-9 h-9 rounded-xl font-soft font-semibold text-sm
                    transition-all cursor-pointer
                    ${currentPage === page
                      ? 'bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white shadow-lg shadow-[var(--bento-primary)]/25'
                      : 'bg-[var(--bento-card)] border border-[var(--bento-border)] text-[var(--bento-text)] hover:border-[var(--bento-primary)]/30 hover:bg-[var(--bento-primary)]/5'
                    }
                  `}
                >
                  {page + 1}
                </motion.button>
              )
            ))}
          </div>

          {/* Next button */}
          <motion.button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              flex items-center gap-1 px-3 py-2 rounded-xl
              bg-[var(--bento-card)] border border-[var(--bento-border)]
              text-[var(--bento-text)] font-soft font-medium text-sm
              hover:border-[var(--bento-primary)]/30 hover:bg-[var(--bento-primary)]/5
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--bento-card)]
              transition-colors cursor-pointer
            "
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>

          {/* Page info */}
          <span className="ml-3 text-sm font-soft text-[var(--bento-text-muted)]">
            Page {currentPage + 1} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

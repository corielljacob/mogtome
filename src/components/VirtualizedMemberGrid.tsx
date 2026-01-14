import { useRef, useEffect, useState, memo, useCallback, useMemo } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import type { FreeCompanyMember } from '../types';
import { MemberCard } from './MemberCard';

// MemberCard is already memoized internally

interface VirtualizedMemberGridProps {
  members: FreeCompanyMember[];
  /** If provided, members will be grouped by rank with section headers */
  membersByRank?: Map<string, FreeCompanyMember[]>;
  /** Whether we're showing grouped view (by rank) or flat filtered view */
  showGrouped?: boolean;
}

// Breakpoint configuration matching Tailwind's defaults
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// Column counts at each breakpoint (matching: grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6)
function getColumnCount(width: number): number {
  if (width >= BREAKPOINTS.xl) return 6;
  if (width >= BREAKPOINTS.lg) return 5;
  if (width >= BREAKPOINTS.md) return 4;
  if (width >= BREAKPOINTS.sm) return 3;
  return 2;
}

// Hook to track container width and column count
function useResponsiveColumns(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [columnCount, setColumnCount] = useState(4);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateColumns = () => {
      const width = container.offsetWidth;
      setContainerWidth(width);
      setColumnCount(getColumnCount(width));
    };

    // Initial measurement
    updateColumns();

    // Observe resize
    const resizeObserver = new ResizeObserver(updateColumns);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  return { columnCount, containerWidth };
}

// Row item types for the virtualizer
type RowItem = 
  | { type: 'header'; rankName: string; memberCount: number }
  | { type: 'memberRow'; members: FreeCompanyMember[]; startIndex: number };

// Build flat list of rows from grouped members
function buildGroupedRows(
  membersByRank: Map<string, FreeCompanyMember[]>,
  columnCount: number
): RowItem[] {
  const rows: RowItem[] = [];
  let globalIndex = 0;

  for (const [rankName, members] of membersByRank) {
    // Add section header
    rows.push({ type: 'header', rankName, memberCount: members.length });
    
    // Chunk members into rows
    for (let i = 0; i < members.length; i += columnCount) {
      rows.push({
        type: 'memberRow',
        members: members.slice(i, i + columnCount),
        startIndex: globalIndex + i,
      });
    }
    globalIndex += members.length;
  }

  return rows;
}

// Build flat rows from member array (filtered view)
function buildFlatRows(
  members: FreeCompanyMember[],
  columnCount: number
): RowItem[] {
  const rows: RowItem[] = [];
  
  for (let i = 0; i < members.length; i += columnCount) {
    rows.push({
      type: 'memberRow',
      members: members.slice(i, i + columnCount),
      startIndex: i,
    });
  }

  return rows;
}

// Section header component - responsive
function RankHeader({ rankName, memberCount }: { rankName: string; memberCount: number }) {
  return (
    <div className="flex items-center gap-2 sm:gap-4 pt-4 pb-2 sm:pt-5 sm:pb-3">
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--bento-secondary)] fill-[var(--bento-secondary)] flex-shrink-0" />
        <h2 className="font-display font-bold text-base sm:text-xl md:text-2xl text-[var(--bento-text)] truncate">
          {rankName}
        </h2>
        <span className="
          px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex-shrink-0
          bg-gradient-to-r from-[var(--bento-primary)]/15 to-[var(--bento-secondary)]/15
          text-[var(--bento-primary)] text-xs sm:text-sm font-soft font-bold
          border border-[var(--bento-primary)]/15
        ">
          {memberCount}
        </span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-[var(--bento-primary)]/20 via-[var(--bento-secondary)]/10 to-transparent" />
    </div>
  );
}

// Member row component - renders a horizontal row of member cards
const MemberRow = memo(function MemberRow({ 
  members, 
  startIndex,
  columnCount,
}: { 
  members: FreeCompanyMember[]; 
  startIndex: number;
  columnCount: number;
}) {
  return (
    <div 
      className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-items-center py-2"
      style={{ 
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
      }}
    >
      {members.map((member, idx) => (
        <MemberCard 
          key={member.characterId} 
          member={member} 
          index={startIndex + idx} 
        />
      ))}
    </div>
  );
});

export function VirtualizedMemberGrid({ 
  members, 
  membersByRank,
  showGrouped = false,
}: VirtualizedMemberGridProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const { columnCount } = useResponsiveColumns(listRef);

  // PERFORMANCE: Memoize row calculations to avoid rebuilding on every render
  const rows = useMemo(() => {
    return showGrouped && membersByRank
      ? buildGroupedRows(membersByRank, columnCount)
      : buildFlatRows(members, columnCount);
  }, [showGrouped, membersByRank, members, columnCount]);

  // Static row heights - cards use fixed CSS heights
  const estimateSize = useCallback((index: number) => {
    const row = rows[index];
    if (row.type === 'header') return 56;
    // Fixed card height: 230px + row padding (16px)
    return 246;
  }, [rows]);

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize,
    overscan: 5, // Render 5 extra rows above/below viewport for smoother scrolling
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  // Re-measure when column count changes (rows are restructured)
  useEffect(() => {
    virtualizer.measure();
  }, [columnCount, virtualizer]);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div ref={listRef} className="w-full">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => {
          const row = rows[virtualRow.index];
          
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start - (listRef.current?.offsetTop ?? 0)}px)`,
              }}
            >
              {row.type === 'header' ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RankHeader rankName={row.rankName} memberCount={row.memberCount} />
                </motion.div>
              ) : (
                <MemberRow 
                  members={row.members} 
                  startIndex={row.startIndex}
                  columnCount={columnCount}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

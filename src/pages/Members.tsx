import { useState, useMemo, useRef, useDeferredValue, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, RefreshCw, Users, X, Heart, Sparkles, 
  ArrowUpDown, Filter, SlidersHorizontal 
} from 'lucide-react';
import { membersApi } from '../api/members';
import { PaginatedMemberGrid, StoryDivider, FloatingSparkles, SimpleFloatingMoogles, ContentCard, Dropdown } from '../components';
import { FC_RANKS } from '../types';
import pushingMoogles from '../assets/moogles/moogles pushing.webp';
import grumpyMoogle from '../assets/moogles/just-the-moogle-cartoon-mammal-animal-wildlife-rabbit-transparent-png-2967816.webp';
import deadMoogle from '../assets/moogles/dead moogle.webp';
import wizardMoogle from '../assets/moogles/wizard moogle.webp';
import musicMoogle from '../assets/moogles/moogle playing music.webp';

// Valid rank names for URL validation (typed as Set<string> for flexibility)
const VALID_RANK_NAMES: Set<string> = new Set(FC_RANKS.map(r => r.name));

// Rank order lookup for sorting
const RANK_ORDER = new Map<string, number>(FC_RANKS.map((r, i) => [r.name, i]));

// Sort options
type SortOption = 'name-asc' | 'name-desc' | 'rank-asc';
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'rank-asc', label: 'Rank' },
  { value: 'name-asc', label: 'Name (A → Z)' },
  { value: 'name-desc', label: 'Name (Z → A)' },
];
const DEFAULT_SORT: SortOption = 'rank-asc';

export function Members() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Read search/filter/sort state from URL
  const searchQuery = searchParams.get('q') || '';
  const selectedRanks = useMemo(() => {
    const ranksParam = searchParams.get('ranks');
    if (!ranksParam) return [];
    // Validate that ranks are valid FC ranks
    return ranksParam.split(',').filter(r => VALID_RANK_NAMES.has(r));
  }, [searchParams]);
  const sortBy = (searchParams.get('sort') as SortOption) || DEFAULT_SORT;
  // Validate sort option
  const validSortBy = SORT_OPTIONS.some(o => o.value === sortBy) ? sortBy : DEFAULT_SORT;
  
  
  // Update URL when search changes (debounced via input)
  const setSearchQuery = useCallback((query: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (query.trim()) {
        next.set('q', query);
      } else {
        next.delete('q');
      }
      // Reset page when searching
      next.delete('page');
      return next;
    }, { replace: true });
  }, [setSearchParams]);
  
  // Update URL when ranks change
  const setSelectedRanks = useCallback((updater: string[] | ((prev: string[]) => string[])) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      const currentRanks = prev.get('ranks')?.split(',').filter(r => VALID_RANK_NAMES.has(r)) || [];
      const newRanks = typeof updater === 'function' ? updater(currentRanks) : updater;
      
      if (newRanks.length > 0) {
        next.set('ranks', newRanks.join(','));
      } else {
        next.delete('ranks');
      }
      // Reset page when filtering
      next.delete('page');
      return next;
    }, { replace: true });
  }, [setSearchParams]);
  
  // Update URL when sort changes
  const setSortBy = useCallback((sort: SortOption) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (sort === DEFAULT_SORT) {
        next.delete('sort'); // Keep URL clean for default
      } else {
        next.set('sort', sort);
      }
      // Reset page when sorting changes
      next.delete('page');
      return next;
    }, { replace: true });
  }, [setSearchParams]);
  
  
  // For input field, we use local state that syncs to URL on change
  const [inputValue, setInputValue] = useState(searchQuery);
  
  // Sync input value when URL changes (e.g., back button)
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);
  
  // Debounce search input to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, searchQuery, setSearchQuery]);
  
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const deferredSelectedRanks = useDeferredValue(selectedRanks);
  const isFiltering = searchQuery !== deferredSearchQuery || selectedRanks !== deferredSelectedRanks;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['members-all'],
    queryFn: () => membersApi.getMembers({ pageSize: 1000 }),
    staleTime: 1000 * 60 * 5,
  });

  const allMembers = useMemo(() => data?.items ?? [], [data]);

  const filteredMembers = useMemo(() => {
    let result = allMembers;

    // Filter by search query
    if (deferredSearchQuery.trim()) {
      const query = deferredSearchQuery.toLowerCase();
      result = result.filter(member => 
        member.name.toLowerCase().includes(query) ||
        member.freeCompanyRank.toLowerCase().includes(query)
      );
    }

    // Filter by selected ranks
    if (deferredSelectedRanks.length > 0) {
      result = result.filter(member => 
        deferredSelectedRanks.includes(member.freeCompanyRank)
      );
    }
    
    // Sort results
    result = [...result].sort((a, b) => {
      switch (validSortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'rank-asc':
        default: {
          // Sort by rank hierarchy, then alphabetically within each rank
          const rankDiff = (RANK_ORDER.get(a.freeCompanyRank) ?? 999) - (RANK_ORDER.get(b.freeCompanyRank) ?? 999);
          return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name);
        }
      }
    });

    return result;
  }, [allMembers, deferredSearchQuery, deferredSelectedRanks, validSortBy]);

  // Single-pass grouping: O(n) instead of O(n * ranks)
  const membersByRank = useMemo(() => {
    // Build a lookup for rank order (use string key for type safety)
    const rankOrder = new Map<string, number>(FC_RANKS.map((r, i) => [r.name, i]));
    
    // Group members in a single pass
    const grouped = new Map<string, typeof filteredMembers>();
    for (const member of filteredMembers) {
      const existing = grouped.get(member.freeCompanyRank);
      if (existing) {
        existing.push(member);
      } else {
        grouped.set(member.freeCompanyRank, [member]);
      }
    }
    
    // Sort the map by rank order (Map iteration order is insertion order)
    const sorted = new Map<string, typeof filteredMembers>();
    const sortedEntries = Array.from(grouped.entries()).sort(
      ([a], [b]) => (rankOrder.get(a) ?? 999) - (rankOrder.get(b) ?? 999)
    );
    for (const [rank, members] of sortedEntries) {
      sorted.set(rank, members);
    }
    
    return sorted;
  }, [filteredMembers]);

  const toggleRank = useCallback((rankName: string) => {
    setSelectedRanks((prev) =>
      prev.includes(rankName) ? prev.filter((r) => r !== rankName) : [...prev, rankName]
    );
  }, [setSelectedRanks]);

  const clearFilters = useCallback(() => {
    setInputValue('');
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('q');
      next.delete('ranks');
      next.delete('page');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters = searchQuery || selectedRanks.length > 0;

  const rankCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    FC_RANKS.forEach(rank => {
      counts[rank.name] = allMembers.filter(m => m.freeCompanyRank === rank.name).length;
    });
    return counts;
  }, [allMembers]);

  return (
    <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 overflow-x-hidden">
      {/* Background decorations - extends full viewport behind header/nav */}
      <div className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
      <SimpleFloatingMoogles primarySrc={wizardMoogle} secondarySrc={musicMoogle} />
      <FloatingSparkles minimal />

      <div className="relative py-6 sm:py-8 md:py-12 px-3 sm:px-4 z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* ═══════════════════════════════════════════════════════════════════
              HERO HEADER - Clean, focused intro
          ═══════════════════════════════════════════════════════════════════ */}
          <motion.header 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-3">
              <span className="bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent">
                Our Family
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--bento-text-muted)] font-soft flex items-center justify-center gap-2 mb-4">
              The wonderful members who make our FC special
              <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
            </p>

            {/* Member count badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bento-card)] border border-[var(--bento-border)] shadow-sm">
              <Users className="w-4 h-4 text-[var(--bento-secondary)]" />
              <span className="font-soft font-semibold text-[var(--bento-text)]">
                {allMembers.length} <span className="text-[var(--bento-text-muted)] font-normal">members</span>
              </span>
            </div>
          </motion.header>

          {/* ═══════════════════════════════════════════════════════════════════
              SEARCH & FILTER SECTION - Unified, intuitive controls
          ═══════════════════════════════════════════════════════════════════ */}
          <motion.section 
            className="mb-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Main search bar - always visible */}
            <div className="bg-[var(--bento-card)] border border-[var(--bento-border)] rounded-2xl shadow-lg shadow-[var(--bento-primary)]/5 overflow-hidden">
              
              {/* Search input row */}
              <div className="p-3 sm:p-4 flex items-center gap-3">
                <div className="relative flex-1">
                  <label htmlFor="member-search" className="sr-only">Search members by name or rank</label>
                  <Search 
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--bento-text-subtle)] pointer-events-none" 
                    aria-hidden="true" 
                  />
                  <input
                    ref={searchInputRef}
                    id="member-search"
                    type="search"
                    placeholder="Search by name or rank..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    aria-describedby="search-results-count"
                    className="
                      w-full pl-11 pr-10 py-3 
                      bg-[var(--bento-bg)] rounded-xl
                      border border-[var(--bento-border)] 
                      focus:border-[var(--bento-primary)] focus:ring-2 focus:ring-[var(--bento-primary)]/20
                      font-soft text-[var(--bento-text)] placeholder:text-[var(--bento-text-subtle)]
                      focus:outline-none transition-all
                    "
                  />
                  {inputValue && (
                    <button
                      onClick={() => { setInputValue(''); setSearchQuery(''); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-[var(--bento-primary)]/10 hover:bg-[var(--bento-primary)]/20 transition-colors cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4 text-[var(--bento-primary)]" />
                    </button>
                  )}
                </div>

                {/* Filter toggle button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  aria-expanded={showFilters}
                  aria-controls="filter-panel"
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl
                    font-soft font-medium text-sm
                    transition-all cursor-pointer
                    focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                    ${showFilters 
                      ? 'bg-[var(--bento-primary)] text-white shadow-lg shadow-[var(--bento-primary)]/25' 
                      : 'bg-[var(--bento-bg)] border border-[var(--bento-border)] text-[var(--bento-text)] hover:border-[var(--bento-primary)]/30 hover:bg-[var(--bento-primary)]/5'
                    }
                  `}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {selectedRanks.length > 0 && (
                    <span className={`
                      px-1.5 py-0.5 text-xs font-bold rounded-full min-w-[1.25rem] text-center
                      ${showFilters ? 'bg-white/25 text-white' : 'bg-[var(--bento-primary)] text-white'}
                    `}>
                      {selectedRanks.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Expandable filter panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    id="filter-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 sm:px-4 pb-4 pt-1 border-t border-[var(--bento-border)]">
                      
                      {/* Sort & Filter controls */}
                      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 lg:gap-6 pt-4">
                        
                        {/* Sort dropdown */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <ArrowUpDown className="w-4 h-4 text-[var(--bento-secondary)]" />
                            <span className="font-soft font-semibold text-sm text-[var(--bento-text)]">Sort by</span>
                          </div>
                          <Dropdown
                            options={SORT_OPTIONS}
                            value={validSortBy}
                            onChange={setSortBy}
                            icon={<ArrowUpDown className="w-4 h-4" />}
                            className="w-full"
                            aria-label="Sort members by"
                          />
                        </div>

                        {/* Rank filter chips */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Filter className="w-4 h-4 text-[var(--bento-secondary)]" />
                              <span className="font-soft font-semibold text-sm text-[var(--bento-text)]">Filter by rank</span>
                              {selectedRanks.length > 0 && (
                                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[var(--bento-primary)] text-white">
                                  {selectedRanks.length}
                                </span>
                              )}
                            </div>
                            {selectedRanks.length > 0 && (
                              <button
                                onClick={() => setSelectedRanks([])}
                                className="text-xs font-soft font-medium text-[var(--bento-text-muted)] hover:text-[var(--bento-primary)] transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <X className="w-3 h-3" />
                                Clear
                              </button>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by rank">
                            {FC_RANKS.map((rank) => {
                              const count = rankCounts[rank.name] || 0;
                              const isSelected = selectedRanks.includes(rank.name);
                              return (
                                <button
                                  key={rank.name}
                                  onClick={() => toggleRank(rank.name)}
                                  aria-pressed={isSelected}
                                  className={`
                                    inline-flex items-center gap-1.5
                                    px-3 py-2 rounded-lg text-sm font-soft font-medium
                                    cursor-pointer transition-all duration-150
                                    focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                                    ${isSelected 
                                      ? 'bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white shadow-md' 
                                      : 'bg-[var(--bento-bg)] border border-[var(--bento-border)] hover:border-[var(--bento-primary)]/30 hover:bg-[var(--bento-primary)]/5 text-[var(--bento-text)]'
                                    }
                                  `}
                                >
                                  <span>{rank.name}</span>
                                  <span className={`
                                    text-xs px-1.5 py-0.5 rounded-full
                                    ${isSelected 
                                      ? 'bg-white/20' 
                                      : 'bg-[var(--bento-card)] text-[var(--bento-text-muted)]'
                                    }
                                  `}>
                                    {count}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active filters summary bar - shows when filters active but panel closed */}
              {hasActiveFilters && !showFilters && (
                <div className="px-3 sm:px-4 pb-3 flex items-center justify-between gap-3 border-t border-[var(--bento-border)] pt-3">
                  <p id="search-results-count" className="font-soft text-sm text-[var(--bento-text)]" aria-live="polite">
                    Showing <span className="font-bold text-[var(--bento-primary)]">{filteredMembers.length}</span> of {allMembers.length} members
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-sm font-soft font-medium text-[var(--bento-primary)] hover:text-[var(--bento-primary)]/80 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </motion.section>

          {/* ═══════════════════════════════════════════════════════════════════
              QUICK RANK CHIPS - Popular ranks for one-tap filtering (desktop)
          ═══════════════════════════════════════════════════════════════════ */}
          {!showFilters && !hasActiveFilters && (
            <motion.div 
              className="hidden md:flex items-center justify-center gap-2 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-sm font-soft text-[var(--bento-text-muted)] mr-2">Quick filter:</span>
              {FC_RANKS.slice(0, 4).map((rank) => (
                <button
                  key={rank.name}
                  onClick={() => toggleRank(rank.name)}
                  className="
                    px-3 py-1.5 rounded-full text-sm font-soft font-medium
                    bg-[var(--bento-card)] border border-[var(--bento-border)] 
                    hover:border-[var(--bento-primary)]/30 hover:bg-[var(--bento-primary)]/5
                    text-[var(--bento-text)] cursor-pointer transition-all
                    focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                  "
                >
                  {rank.name}
                </button>
              ))}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              CONTENT AREA - Loading, Error, Empty, or Grid
          ═══════════════════════════════════════════════════════════════════ */}
          
          <StoryDivider className="mx-auto mb-8" />
          
          {isLoading ? (
            <ContentCard className="text-center py-16" aria-busy={true} aria-live="polite">
              <motion.img 
                src={pushingMoogles} 
                alt="" 
                className="w-40 md:w-52 mx-auto mb-4"
                animate={{ 
                  x: [0, 4, -4, 4, 0],
                  rotate: [0, 1.5, -1.5, 1.5, 0],
                }}
                transition={{ 
                  duration: 0.7, 
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
                Fetching members, kupo...
              </motion.p>
            </ContentCard>
          ) : isError ? (
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
                A moogle fell over, kupo...
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
          ) : filteredMembers.length === 0 ? (
            <ContentCard className="text-center py-12 md:py-16" aria-live="polite">
              <img 
                src={grumpyMoogle} 
                alt="" 
                className="w-40 h-40 mx-auto mb-5 object-contain"
                aria-hidden="true"
              />
              <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">No members found</p>
              <p className="font-accent text-2xl text-[var(--bento-text-muted)] mb-5">
                Kupo? We couldn't find anyone by that name...
              </p>
              {hasActiveFilters && (
                <motion.button
                  onClick={clearFilters}
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
                  Clear filters
                </motion.button>
              )}
            </ContentCard>
          ) : (
            <div className={`transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
              <PaginatedMemberGrid
                members={filteredMembers}
                membersByRank={membersByRank}
                showGrouped={deferredSelectedRanks.length === 0 && !deferredSearchQuery && validSortBy === 'rank-asc'}
                pageSize={24}
              />
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              FOOTER
          ═══════════════════════════════════════════════════════════════════ */}
          {!isLoading && !isError && filteredMembers.length > 0 && (
            <footer className="text-center mt-16 pt-8" style={{ paddingBottom: 'calc(2rem + var(--safe-area-inset-bottom, 0px))' }}>
              <StoryDivider className="mx-auto mb-6" />
              <p className="font-accent text-xl text-[var(--bento-text-muted)] flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--bento-secondary)]" />
                Every member makes us stronger, kupo!
                <Sparkles className="w-5 h-5 text-[var(--bento-secondary)]" />
              </p>
              <p className="font-accent text-lg text-[var(--bento-primary)] mt-2">
                ~ fin ~
              </p>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo, useRef, useDeferredValue, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { Search, RefreshCw, Users, X, Heart, Sparkles, ChevronDown, Star, ArrowUpDown, ArrowUp } from 'lucide-react';
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
  const [isCompact, setIsCompact] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
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
  
  const isCompactRef = useRef(isCompact);
  
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Hysteresis: use different thresholds to prevent oscillation
          // Enter compact at 120px, exit compact at 60px
          const shouldBeCompact = isCompactRef.current 
            ? scrollY > 60   // Already compact: stay compact until scroll is well above threshold
            : scrollY > 120; // Not compact: only become compact after scrolling past threshold
          
          if (shouldBeCompact !== isCompactRef.current) {
            isCompactRef.current = shouldBeCompact;
            setIsCompact(shouldBeCompact);
            if (shouldBeCompact) {
              setShowFilters(false);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          {/* Page header - storybook style */}
          <motion.header 
            className="text-center mb-6 sm:mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Decorative opener */}
            <motion.p
              className="font-accent text-lg sm:text-xl md:text-2xl text-[var(--bento-secondary)] mb-3 sm:mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              ~ The ones who make it special ~
            </motion.p>

            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[var(--bento-primary)]/10 border border-[var(--bento-primary)]/20 text-[var(--bento-primary)] text-xs sm:text-sm font-soft font-medium">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {allMembers.length} members
              </span>
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent">
                The Family
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--bento-text-muted)] font-soft flex items-center justify-center gap-2 mb-3 sm:mb-4">
              Our wonderful FC crew
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
            </p>

            <StoryDivider className="mx-auto" />
          </motion.header>

          {/* Search/filter bar - storybook styled */}
          {/* On mobile: sticky with overlay filter panel */}
          {/* On desktop: sticky with full search + filter bar */}
          <div 
            ref={searchContainerRef}
            className={`sticky z-30 mb-6 sm:mb-8 pt-2 transition-[margin] duration-200 ${isCompact ? 'mx-2 sm:mx-4 md:mx-8' : ''}`}
            style={{ top: 'calc(4.5rem + var(--safe-area-inset-top, 0px))' }}
          >
                <div 
                  className={`
                    relative bg-[var(--bento-card)]/95
                    backdrop-blur-xl border border-[var(--bento-primary)]/10 rounded-2xl
                    transition-all duration-200 ${isCompact ? 'p-2.5 sm:p-3 shadow-lg' : 'p-3 sm:p-4 md:p-6 shadow-xl shadow-[var(--bento-primary)]/5'}
                  `}
                >
              {/* Decorative background blob - desktop only */}
              <div 
                className={`
                  absolute top-0 right-0 w-48 h-48 
                  bg-gradient-to-br from-[var(--bento-primary)]/10 to-[var(--bento-secondary)]/10 rounded-full 
                  -translate-y-1/2 translate-x-1/2 blur-3xl 
                  pointer-events-none transition-opacity duration-200
                  hidden md:block
                  ${isCompact ? 'opacity-0' : 'opacity-100'}
                `}
              />
              
              {/* Desktop: Full search bar row */}
              <div className="relative hidden md:flex items-center gap-2 md:gap-3">
                {/* Search icon badge */}
                <div 
                  className={`
                    bg-gradient-to-br from-[var(--bento-primary)] to-[var(--bento-secondary)]
                    flex items-center justify-center flex-shrink-0 
                    shadow-lg shadow-[var(--bento-primary)]/25
                    rounded-xl transition-all duration-200 ease-out
                    ${isCompact ? 'w-8 h-8' : 'w-9 h-9 md:w-10 md:h-10'}
                  `}
                >
                  <Search className={`text-white transition-all duration-200 ${isCompact ? 'w-4 h-4' : 'w-4 h-4 md:w-5 md:h-5'}`} />
                </div>
                
                {/* Header text - hide when compact */}
                <div 
                  className={`
                    flex-shrink-0 origin-left
                    transition-[opacity,transform] duration-200 ease-out
                    ${isCompact ? 'w-0 opacity-0 scale-95 overflow-hidden pointer-events-none' : 'opacity-100 scale-100'}
                  `}
                >
                  <h3 className="font-display font-semibold text-lg text-[var(--bento-text)] whitespace-nowrap">Find Members</h3>
                  <p className="text-sm text-[var(--bento-text-muted)] font-accent whitespace-nowrap">Search by name or filter by rank, kupo~</p>
                </div>
                
                {/* Search input */}
                <div className="relative flex-1 min-w-0">
                  {/* Screen reader only label */}
                  <label htmlFor="member-search" className="sr-only">Search members by name or rank</label>
                  
                  {/* Search icon inside input */}
                  <div 
                    className={`
                      absolute inset-y-0 left-0 flex items-center 
                      pointer-events-none text-[var(--bento-text-muted)]
                      transition-all duration-200 ease-out
                      ${isCompact ? 'pl-3 opacity-100' : 'pl-4 opacity-100'}
                    `}
                    aria-hidden="true"
                  >
                    <Search className={`transition-all duration-200 ${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />
                  </div>
                  
                  <input
                    ref={searchInputRef}
                    id="member-search"
                    type="search"
                    placeholder="Search members..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    aria-describedby="search-results-count"
                    className={`
                      w-full font-soft text-[var(--bento-text)] placeholder:text-[var(--bento-text-subtle)] 
                      focus:outline-none bg-[var(--bento-bg)]
                      border border-[var(--bento-border)] 
                      focus:border-[var(--bento-primary)] focus:ring-2 focus:ring-[var(--bento-primary)]/20
                      transition-all duration-200 ease-out
                      ${isCompact 
                        ? 'pl-10 pr-10 py-2 text-sm rounded-xl' 
                        : 'pl-12 pr-12 py-3 text-base rounded-xl'
                      }
                    `}
                  />
                  
                  {/* Clear button */}
                  <button
                    onClick={() => { setInputValue(''); setSearchQuery(''); }}
                    className={`
                      absolute inset-y-0 right-0 flex items-center cursor-pointer pr-3
                      transition-all duration-150
                      ${inputValue ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}
                    `}
                    tabIndex={inputValue ? 0 : -1}
                    aria-label="Clear search"
                  >
                    <span className={`bg-[var(--bento-primary)]/10 hover:bg-[var(--bento-primary)]/20 rounded-lg transition-colors ${isCompact ? 'p-1' : 'p-1.5'}`}>
                      <X className={`text-[var(--bento-primary)] ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} aria-hidden="true" />
                    </span>
                  </button>
                </div>
                
                {/* Filter badge - compact mode */}
                <div 
                  className={`
                    flex items-center gap-2 flex-shrink-0
                    transition-all duration-200 ease-out
                    ${isCompact ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}
                  `}
                >
                  {selectedRanks.length > 0 && (
                    <button
                      onClick={() => setSelectedRanks([])}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--bento-primary)]/10 text-[var(--bento-primary)] text-xs font-soft font-semibold hover:bg-[var(--bento-primary)]/20 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{selectedRanks.length}</span>
                    </button>
                  )}
                </div>
                
                {/* Back to top button - only shows when scrolled down (compact mode) */}
                {isCompact && (
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="
                      flex-shrink-0 w-9 h-9 rounded-xl
                      flex items-center justify-center
                      bg-[var(--bento-bg)] 
                      hover:bg-[var(--bento-primary)]/10 
                      text-[var(--bento-text-muted)] hover:text-[var(--bento-primary)] 
                      cursor-pointer transition-colors duration-200
                    "
                    title="Back to top"
                    aria-label="Scroll to top"
                  >
                    <ChevronDown className="w-4 h-4 rotate-180" />
                  </button>
                )}
                
              </div>
              
              {/* Mobile: Tappable filter/sort toggle (search is in header) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="relative flex md:hidden items-center gap-2.5 sm:gap-3 w-full text-left cursor-pointer"
                aria-expanded={showFilters}
                aria-controls="mobile-filter-panel"
              >
                {/* Filter icon badge */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[var(--bento-primary)] to-[var(--bento-secondary)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[var(--bento-primary)]/25 rounded-xl">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                
                {/* Filter info */}
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-xs sm:text-sm text-[var(--bento-text)]">Filters & Sort</p>
                  <p className="text-[10px] sm:text-xs text-[var(--bento-text-muted)] font-accent truncate">
                    {hasActiveFilters 
                      ? `${filteredMembers.length} of ${allMembers.length} members` 
                      : 'Tap to filter by rank, kupo~'
                    }
                  </p>
                </div>
                
                {/* Active filter badges + chevron */}
                <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                  {searchQuery && (
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-[var(--bento-primary)]/10 text-[var(--bento-primary)] text-xs font-soft font-semibold">
                      <Search className="w-3 h-3" />
                    </span>
                  )}
                  {selectedRanks.length > 0 && (
                    <span className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-[var(--bento-primary)]/10 text-[var(--bento-primary)] text-xs font-soft font-semibold">
                      {selectedRanks.length}
                    </span>
                  )}
                  <motion.div
                    animate={{ rotate: showFilters ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--bento-text-muted)]" />
                  </motion.div>
                </div>
              </button>
              
              {/* Expanded content - filter section */}
              {/* Mobile: absolute overlay panel */}
              {/* Desktop: inline, controlled by compact mode */}
              
              {/* Desktop filter section - inline */}
              <div 
                className={`
                  hidden md:grid transition-all duration-300 ease-out
                  ${isCompact ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}
                `}
              >
                <div className="overflow-hidden">
                  <div className="pt-6">
                    {/* Two-column layout for sort + filter sections */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                      {/* Sort section */}
                      <div className="lg:w-56 flex-shrink-0">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--bento-secondary)]/20 to-[var(--bento-primary)]/10 flex items-center justify-center">
                            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--bento-secondary)]" />
                          </div>
                          <span className="font-soft font-semibold text-[var(--bento-text)] text-sm">
                            Sort by
                          </span>
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

                      {/* Filter section */}
                      <div className="flex-1">
                        {/* Rank filter header */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--bento-primary)]/20 to-[var(--bento-secondary)]/10 flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-[var(--bento-primary)]" />
                          </div>
                          <span className="font-soft font-semibold text-[var(--bento-text)] text-sm">
                            Filter by Rank
                          </span>
                          {selectedRanks.length > 0 && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="px-2 py-0.5 text-xs font-bold rounded-full bg-[var(--bento-primary)] text-white min-w-[1.5rem] text-center"
                            >
                              {selectedRanks.length}
                            </motion.span>
                          )}
                          {selectedRanks.length > 0 && (
                            <button
                              onClick={() => setSelectedRanks([])}
                              className="ml-auto text-xs font-soft font-medium text-[var(--bento-text-muted)] hover:text-[var(--bento-primary)] transition-colors cursor-pointer flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[var(--bento-primary)]/5"
                            >
                              <X className="w-3 h-3" />
                              Clear
                            </button>
                          )}
                        </div>

                        {/* Rank chips */}
                        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by rank">
                          {FC_RANKS.map((rank) => {
                            const count = rankCounts[rank.name] || 0;
                            const isSelected = selectedRanks.includes(rank.name);
                            return (
                              <motion.button
                                key={rank.name}
                                onClick={() => toggleRank(rank.name)}
                                aria-pressed={isSelected}
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                                  inline-flex items-center gap-2
                                  px-3.5 py-2.5 rounded-xl text-sm font-soft font-medium
                                  cursor-pointer transition-all duration-150
                                  focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                                  ${isSelected 
                                    ? 'bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white shadow-lg shadow-[var(--bento-primary)]/25' 
                                    : 'bg-[var(--bento-bg)] border border-[var(--bento-border)] hover:border-[var(--bento-primary)]/40 hover:bg-[var(--bento-primary)]/5 hover:shadow-md text-[var(--bento-text)]'
                                  }
                                `}
                              >
                                <span>{rank.name}</span>
                                <span className={`
                                  text-xs px-2 py-0.5 rounded-full transition-colors duration-150
                                  ${isSelected 
                                    ? 'bg-white/25' 
                                    : 'bg-[var(--bento-card)] text-[var(--bento-text-muted)]'
                                  }
                                `} aria-label={`${count} members`}>
                                  {count}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Results summary - also used for screen reader announcement */}
                    <motion.div 
                      initial={false}
                      animate={{ 
                        height: hasActiveFilters ? 'auto' : 0,
                        opacity: hasActiveFilters ? 1 : 0,
                        marginTop: hasActiveFilters ? 24 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center justify-between pt-5 border-t border-[var(--bento-border)]">
                        <p id="search-results-count" className="font-soft text-sm text-[var(--bento-text)]" aria-live="polite" aria-atomic="true">
                          Showing <span className="font-bold text-[var(--bento-primary)]">{filteredMembers.length}</span> of {allMembers.length} members
                        </p>
                        <motion.button
                          onClick={clearFilters}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="text-sm font-soft font-semibold text-white bg-gradient-to-r from-[var(--bento-primary)]/80 to-[var(--bento-secondary)]/80 hover:from-[var(--bento-primary)] hover:to-[var(--bento-secondary)] px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none"
                          tabIndex={hasActiveFilters ? 0 : -1}
                          aria-label="Clear all filters"
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                          Clear all filters
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
            
              {/* Mobile: Overlay filter panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    id="mobile-filter-panel"
                    className="md:hidden absolute left-0 right-0 top-full mt-2 z-40"
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <div className="bg-[var(--bento-card)]/98 backdrop-blur-2xl border border-[var(--bento-primary)]/15 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
                      {/* Handle bar for visual swipe hint */}
                      <div className="flex justify-center pt-3 pb-1">
                        <div className="w-10 h-1 rounded-full bg-[var(--bento-border)]" />
                      </div>
                      
                      <div className="p-4 pt-2">
                        {/* Section: Sort */}
                        <div className="mb-5">
                          <div className="flex items-center gap-2 mb-2.5">
                            <ArrowUpDown className="w-4 h-4 text-[var(--bento-secondary)]" />
                            <span className="font-soft font-semibold text-[var(--bento-text)] text-sm">
                              Sort by
                            </span>
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

                        {/* Section: Filter by Rank */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-[var(--bento-secondary)]" />
                            <span className="font-soft font-semibold text-[var(--bento-text)] text-sm">
                              Filter by Rank
                            </span>
                            {selectedRanks.length > 0 && (
                              <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-2 py-0.5 text-xs font-bold rounded-full bg-[var(--bento-primary)] text-white min-w-[1.5rem] text-center"
                              >
                                {selectedRanks.length}
                              </motion.span>
                            )}
                          </div>

                          {/* Rank chips - 2 column grid for better touch targets */}
                          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Filter by rank">
                            {FC_RANKS.map((rank) => {
                              const count = rankCounts[rank.name] || 0;
                              const isSelected = selectedRanks.includes(rank.name);
                              return (
                                <motion.button
                                  key={rank.name}
                                  onClick={() => toggleRank(rank.name)}
                                  aria-pressed={isSelected}
                                  whileTap={{ scale: 0.95 }}
                                  className={`
                                    flex items-center justify-between
                                    px-3 py-3 rounded-xl text-sm font-soft font-medium
                                    cursor-pointer transition-all duration-150
                                    focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                                    ${isSelected 
                                      ? 'bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white shadow-lg shadow-[var(--bento-primary)]/25' 
                                      : 'bg-[var(--bento-bg)] border border-[var(--bento-border)] active:border-[var(--bento-primary)]/30 active:bg-[var(--bento-primary)]/10 text-[var(--bento-text)]'
                                    }
                                  `}
                                >
                                  <span className="truncate">{rank.name}</span>
                                  <span className={`
                                    text-xs px-1.5 py-0.5 rounded-full transition-colors duration-150 flex-shrink-0 ml-1
                                    ${isSelected 
                                      ? 'bg-white/20' 
                                      : 'bg-[var(--bento-card)] text-[var(--bento-text-muted)]'
                                    }
                                  `} aria-label={`${count} members`}>
                                    {count}
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Results summary + actions */}
                        <div className="mt-5 pt-4 border-t border-[var(--bento-border)]">
                          <div className="flex items-center justify-between mb-4">
                            <p className="font-soft text-sm text-[var(--bento-text)]">
                              Showing <span className="font-bold text-[var(--bento-primary)]">{filteredMembers.length}</span> of {allMembers.length} members
                            </p>
                            {hasActiveFilters && (
                              <button
                                onClick={clearFilters}
                                className="text-sm font-soft font-medium text-[var(--bento-primary)] active:text-[var(--bento-primary)]/70 transition-colors cursor-pointer flex items-center gap-1.5 px-2 py-1 -mr-2 rounded-lg active:bg-[var(--bento-primary)]/10"
                              >
                                <X className="w-3.5 h-3.5" />
                                Clear
                              </button>
                            )}
                          </div>
                          
                          {/* Done button - full width, prominent */}
                          <motion.button
                            onClick={() => setShowFilters(false)}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white text-base font-soft font-bold shadow-lg shadow-[var(--bento-primary)]/25 cursor-pointer active:shadow-md transition-shadow"
                          >
                            Show Results
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
          
          {/* Backdrop for mobile filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="md:hidden fixed inset-0 bg-black/20 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          {/* Member list */}
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

          {/* Footer - storybook style */}
          {!isLoading && !isError && filteredMembers.length > 0 && (
            <footer className="text-center mt-16 pt-8" style={{ paddingBottom: 'calc(2rem + var(--safe-area-inset-bottom, 0px))' }}>
              <StoryDivider className="mx-auto mb-6" />
              <p className="font-accent text-xl text-[var(--bento-text-muted)] flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
                Every member makes us stronger, kupo!
                <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
              </p>
              <p className="font-accent text-lg text-[var(--bento-secondary)] mt-2">
                ~ fin ~
              </p>
            </footer>
          )}
        </div>
      </div>
      
      {/* Mobile scroll-to-top button - appears when scrolled down */}
      <AnimatePresence>
        {isCompact && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="
              md:hidden fixed right-4 z-40
              w-12 h-12 rounded-full
              bg-gradient-to-br from-[var(--bento-primary)] to-[var(--bento-secondary)]
              text-white
              shadow-xl shadow-[var(--bento-primary)]/30
              flex items-center justify-center
              cursor-pointer
              active:scale-95
              focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bento-primary)] focus-visible:outline-none
            "
            style={{ 
              bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px) + 0.75rem)'
            }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

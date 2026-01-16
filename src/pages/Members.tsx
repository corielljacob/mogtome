import { useState, useMemo, useRef, useDeferredValue, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Search, RefreshCw, Users, X, Heart, Sparkles, ChevronDown, Star, ArrowUpDown } from 'lucide-react';
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
    <div className="min-h-screen relative">
      {/* Background decorations - use shared CSS-animated components for performance */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
      <SimpleFloatingMoogles primarySrc={wizardMoogle} secondarySrc={musicMoogle} />
      <FloatingSparkles minimal />

      <div className="relative py-8 md:py-12 px-4 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Page header - storybook style */}
          <motion.header 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Decorative opener */}
            <motion.p
              className="font-accent text-xl md:text-2xl text-[var(--bento-secondary)] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              ~ The ones who make it special ~
            </motion.p>

            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bento-primary)]/10 border border-[var(--bento-primary)]/20 text-[var(--bento-primary)] text-sm font-soft font-medium">
                <Users className="w-4 h-4" />
                {allMembers.length} members
              </span>
              <Star className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3">
              <span className="bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent">
                The Family
              </span>
            </h1>

            <p className="text-lg text-[var(--bento-text-muted)] font-soft flex items-center justify-center gap-2 mb-4">
              Our wonderful FC crew
              <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
            </p>

            <StoryDivider className="mx-auto" />
          </motion.header>

          {/* Sticky search bar - storybook styled */}
          <div 
            ref={searchContainerRef}
            className={`sticky z-30 mb-8 pt-2 transition-[margin] duration-200 ${isCompact ? 'mx-4 md:mx-8' : ''}`}
            style={{ top: 'calc(4.5rem + var(--safe-area-inset-top, 0px))' }}
          >
                <div 
                  className={`
                    relative overflow-hidden bg-[var(--bento-card)]/95
                    backdrop-blur-xl border border-[var(--bento-primary)]/10 rounded-2xl
                    transition-all duration-200 ${isCompact ? 'p-3 shadow-lg' : 'p-4 md:p-6 shadow-xl shadow-[var(--bento-primary)]/5'}
                  `}
                >
              {/* Decorative background blob */}
              <div 
                className={`
                  absolute top-0 right-0 w-48 h-48 
                  bg-gradient-to-br from-[var(--bento-primary)]/10 to-[var(--bento-secondary)]/10 rounded-full 
                  -translate-y-1/2 translate-x-1/2 blur-3xl 
                  pointer-events-none transition-opacity duration-200
                  ${isCompact ? 'opacity-0' : 'opacity-100'}
                `}
              />
              
              <div className="relative flex items-center gap-2 md:gap-3">
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
                
                {/* Header text - hide when compact AND on mobile */}
                <div 
                  className={`
                    flex-shrink-0 origin-left hidden md:block
                    transition-[opacity,transform] duration-200 ease-out
                    ${isCompact ? 'md:w-0 md:opacity-0 md:scale-95 md:overflow-hidden md:pointer-events-none' : 'md:opacity-100 md:scale-100'}
                  `}
                >
                  <h3 className="font-display font-semibold text-lg text-[var(--bento-text)] whitespace-nowrap">Find Members</h3>
                  <p className="text-sm text-[var(--bento-text-muted)] font-accent whitespace-nowrap">Search by name or filter by rank, kupo~</p>
                </div>
                
                {/* Search input */}
                <div className="relative flex-1 min-w-0">
                  {/* Screen reader only label */}
                  <label htmlFor="member-search" className="sr-only">Search members by name or rank</label>
                  
                  {/* Search icon inside input - hidden on mobile since we have badge */}
                  <div 
                    className={`
                      absolute inset-y-0 left-0 items-center 
                      pointer-events-none text-[var(--bento-text-muted)]
                      transition-all duration-200 ease-out
                      hidden md:flex
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
                        : 'pl-4 pr-10 py-2.5 md:pl-12 md:pr-12 md:py-3 text-sm md:text-base rounded-xl'
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
              
              {/* Expanded content - filter section */}
              <div 
                className={`
                  grid transition-all duration-200 ease-out
                  ${isCompact ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}
                `}
              >
                <div className="overflow-hidden">
                  <div className="pt-5">
                    {/* Filter and Sort row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Rank filter toggle */}
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="
                          flex-1 flex items-center justify-between
                          px-4 py-3 rounded-xl
                          bg-[var(--bento-bg)]
                          border border-[var(--bento-border)]
                          hover:border-[var(--bento-primary)]/20 hover:bg-[var(--bento-primary)]/5
                          transition-colors cursor-pointer
                          group
                        "
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[var(--bento-secondary)]" />
                          <span className="font-soft font-medium text-[var(--bento-text)] text-sm">
                            Ranks
                          </span>
                          {selectedRanks.length > 0 && (
                            <span className="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-[var(--bento-primary)] text-white min-w-[1.25rem] text-center">
                              {selectedRanks.length}
                            </span>
                          )}
                        </div>
                        <motion.div
                          animate={{ rotate: showFilters ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 text-[var(--bento-text-muted)] group-hover:text-[var(--bento-primary)] transition-colors" />
                        </motion.div>
                      </button>
                      
                      {/* Sort dropdown */}
                      <Dropdown
                        options={SORT_OPTIONS}
                        value={validSortBy}
                        onChange={setSortBy}
                        icon={<ArrowUpDown className="w-4 h-4" />}
                        className="flex-1 sm:flex-none sm:min-w-[180px]"
                        aria-label="Sort members by"
                      />
                    </div>

                    {/* Rank chips */}
                    <div 
                      className={`
                        grid transition-all duration-200 ease-out
                        ${showFilters ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
                      `}
                    >
                      <div className="overflow-hidden">
                        <div className="pt-4 mt-4 border-t border-[var(--bento-border)]">
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
                                    inline-flex items-center gap-2
                                    px-4 py-2.5 rounded-xl text-sm font-soft font-medium
                                    cursor-pointer transition-all duration-150
                                    active:scale-95
                                    focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                                    ${isSelected 
                                      ? 'bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white shadow-lg shadow-[var(--bento-primary)]/25' 
                                      : 'bg-[var(--bento-card)] border border-[var(--bento-border)] hover:border-[var(--bento-primary)]/30 hover:bg-[var(--bento-primary)]/5 text-[var(--bento-text)]'
                                    }
                                  `}
                                >
                                  <span>{rank.name}</span>
                                  <span className={`
                                    text-xs px-2 py-0.5 rounded-full transition-colors duration-150
                                    ${isSelected 
                                      ? 'bg-white/20' 
                                      : 'bg-[var(--bento-bg)] text-[var(--bento-text-muted)]'
                                    }
                                  `} aria-label={`${count} members`}>
                                    {count}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          
                          {/* Clear all button */}
                          <div 
                            className={`
                              mt-3 pt-3 border-t border-[var(--bento-border)]
                              transition-all duration-150
                              ${selectedRanks.length > 0 ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 overflow-hidden mt-0 pt-0 border-t-0'}
                            `}
                          >
                            <button
                              onClick={() => setSelectedRanks([])}
                              className="text-sm font-soft text-[var(--bento-primary)] hover:text-[var(--bento-primary)]/80 transition-colors cursor-pointer flex items-center gap-1.5"
                              tabIndex={selectedRanks.length > 0 ? 0 : -1}
                            >
                              <X className="w-3.5 h-3.5" />
                              Clear rank filters
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Results summary - also used for screen reader announcement */}
                    <div 
                      className={`
                        transition-all duration-150 ease-out overflow-hidden
                        ${hasActiveFilters ? 'opacity-100 max-h-20 pt-4 mt-4' : 'opacity-0 max-h-0 pt-0 mt-0'}
                      `}
                    >
                      <div className={`flex items-center justify-between ${hasActiveFilters ? 'border-t border-[var(--bento-border)] pt-4' : ''}`}>
                        <p id="search-results-count" className="font-soft text-sm text-[var(--bento-text-muted)]" aria-live="polite" aria-atomic="true">
                          Showing <span className="font-semibold text-[var(--bento-primary)]">{filteredMembers.length}</span> of {allMembers.length} members
                        </p>
                        <button
                          onClick={clearFilters}
                          className="text-sm font-soft font-medium text-[var(--bento-primary)] hover:text-[var(--bento-primary)]/80 transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none rounded"
                          tabIndex={hasActiveFilters ? 0 : -1}
                          aria-label="Clear all filters"
                        >
                          <X className="w-3.5 h-3.5" aria-hidden="true" />
                          Clear all
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
    </div>
  );
}

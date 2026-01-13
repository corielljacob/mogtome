import { useState, useMemo, memo, useRef, useDeferredValue, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Search, RefreshCw, Users, X, Heart, Sparkles, ChevronDown } from 'lucide-react';
import { membersApi } from '../api/members';
import { MemberCard } from '../components/MemberCard';
import { FC_RANKS } from '../types';
import pushingMoogles from '../assets/moogles/moogles pushing.webp';
import grumpyMoogle from '../assets/moogles/just-the-moogle-cartoon-mammal-animal-wildlife-rabbit-transparent-png-2967816.webp';
import deadMoogle from '../assets/moogles/dead moogle.webp';

// Memoized member card wrapper to prevent unnecessary re-renders
const MemoizedMemberCard = memo(MemberCard);

// Simplified content card for results area
function ContentCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`
      bg-white dark:bg-slate-800/90 border border-[var(--bento-border)]
      rounded-2xl p-6 md:p-8 shadow-sm ${className}
    `}>
      {children}
    </div>
  );
}

export function Members() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRanks, setSelectedRanks] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // Use deferred values so filter changes don't block the UI
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const deferredSelectedRanks = useDeferredValue(selectedRanks);
  
  // Track if we're in a pending transition for visual feedback
  const isFiltering = searchQuery !== deferredSearchQuery || selectedRanks !== deferredSelectedRanks;
  
  // Track scroll position for compact mode - throttled for performance
  const isCompactRef = useRef(isCompact);
  
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        // Use requestAnimationFrame to throttle updates
        requestAnimationFrame(() => {
          const shouldBeCompact = window.scrollY > 120;
          // Only update state if value actually changed
          if (shouldBeCompact !== isCompactRef.current) {
            isCompactRef.current = shouldBeCompact;
            setIsCompact(shouldBeCompact);
            // Close filters when compacting
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
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch all members once; paginate client-side for now
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['members-all'],
    queryFn: () => membersApi.getMembers({ pageSize: 1000 }),
    staleTime: 1000 * 60 * 5,
  });

  const allMembers = useMemo(() => data?.items ?? [], [data]);

  // Client-side filter controls - use deferred values for the expensive computation
  const filteredMembers = useMemo(() => {
    let result = allMembers;

    if (deferredSearchQuery.trim()) {
      const query = deferredSearchQuery.toLowerCase();
      result = result.filter(member => 
        member.name.toLowerCase().includes(query) ||
        member.freeCompanyRank.toLowerCase().includes(query)
      );
    }

    if (deferredSelectedRanks.length > 0) {
      result = result.filter(member => 
        deferredSelectedRanks.includes(member.freeCompanyRank)
      );
    }

    return result;
  }, [allMembers, deferredSearchQuery, deferredSelectedRanks]);

  // Group members by rank for grouped view
  const membersByRank = useMemo(() => {
    const grouped = new Map<string, typeof filteredMembers>();
    
    FC_RANKS.forEach(rank => {
      const membersInRank = filteredMembers.filter(m => m.freeCompanyRank === rank.name);
      if (membersInRank.length > 0) {
        grouped.set(rank.name, membersInRank);
      }
    });
    
    return grouped;
  }, [filteredMembers]);

  const toggleRank = useCallback((rankName: string) => {
    setSelectedRanks((prev) =>
      prev.includes(rankName) ? prev.filter((r) => r !== rankName) : [...prev, rankName]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedRanks([]);
  }, []);

  // Use immediate values for UI state (buttons, badges) but deferred for the list
  const hasActiveFilters = searchQuery || selectedRanks.length > 0;

  // Memoize rank counts to avoid recalculating on every render
  const rankCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    FC_RANKS.forEach(rank => {
      counts[rank.name] = allMembers.filter(m => m.freeCompanyRank === rank.name).length;
    });
    return counts;
  }, [allMembers]);

  return (
    <div className="min-h-screen relative">
      <div className="relative py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <motion.header 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bento-primary)]/10 text-[var(--bento-primary)] text-sm font-soft font-medium mb-4">
              <Users className="w-4 h-4" />
              {allMembers.length} members
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-2 text-[var(--bento-text)]">
              The Family
            </h1>
            <p className="text-[var(--bento-text-muted)] font-soft flex items-center justify-center gap-2">
              Our wonderful FC crew
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            </p>
          </motion.header>

          {/* Sticky search bar */}
          <div 
            ref={searchContainerRef}
            className={`sticky top-[5rem] z-30 mb-8 pt-2 transition-[margin] duration-200 ${isCompact ? 'mx-4 md:mx-8' : ''}`}
          >
            <div 
              className={`
                relative overflow-hidden bg-white/95 dark:bg-slate-900/95 
                backdrop-blur-xl border border-[var(--bento-border)] rounded-2xl
                transition-all duration-200 ${isCompact ? 'p-3 shadow-lg' : 'p-6 shadow-sm'}
              `}
            >
              {/* Decorative background blob - only when expanded */}
              <div 
                className={`
                  absolute top-0 right-0 w-48 h-48 
                  bg-[var(--bento-primary)]/5 rounded-full 
                  -translate-y-1/2 translate-x-1/2 blur-3xl 
                  pointer-events-none transition-opacity duration-200
                  ${isCompact ? 'opacity-0' : 'opacity-100'}
                `}
              />
              
              <div className="relative flex items-center gap-3">
                {/* Search icon badge */}
                <div 
                  className={`
                    bg-gradient-to-br from-[var(--bento-primary)] to-rose-500 
                    flex items-center justify-center flex-shrink-0 
                    shadow-lg shadow-[var(--bento-primary)]/25
                    rounded-xl transition-all duration-200 ease-out
                    ${isCompact ? 'w-8 h-8' : 'w-10 h-10'}
                  `}
                >
                  <Search className={`text-white transition-all duration-200 ${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />
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
                  <p className="text-sm text-[var(--bento-text-muted)] font-soft whitespace-nowrap">Search by name or filter by rank</p>
                </div>
                
                {/* Search input - always flex-1 */}
                <div className="relative flex-1 min-w-0">
                  {/* Search icon inside input - hide when compact */}
                  <div 
                    className={`
                      absolute inset-y-0 left-0 flex items-center 
                      pointer-events-none text-[var(--bento-text-muted)]
                      transition-all duration-200 ease-out
                      ${isCompact ? 'pl-3 opacity-100' : 'pl-4 opacity-100'}
                    `}
                  >
                    <Search className={`transition-all duration-200 ${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />
                  </div>
                  
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`
                      w-full font-soft text-[var(--bento-text)] placeholder:text-[var(--bento-text-subtle)] 
                      focus:outline-none bg-white dark:bg-slate-800
                      border border-[var(--bento-border)] 
                      focus:border-[var(--bento-primary)] focus:ring-2 focus:ring-[var(--bento-primary)]/10
                      transition-all duration-200 ease-out
                      ${isCompact 
                        ? 'pl-10 pr-10 py-2 text-sm rounded-xl' 
                        : 'pl-12 pr-12 py-3 text-base rounded-xl'
                      }
                    `}
                  />
                  
                  {/* Clear button */}
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`
                      absolute inset-y-0 right-0 flex items-center cursor-pointer pr-3
                      transition-all duration-150
                      ${searchQuery ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}
                    `}
                    tabIndex={searchQuery ? 0 : -1}
                  >
                    <span className={`bg-[var(--bento-primary)]/10 hover:bg-[var(--bento-primary)]/20 rounded-lg transition-colors ${isCompact ? 'p-1' : 'p-1.5'}`}>
                      <X className={`text-[var(--bento-primary)] ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    </span>
                  </button>
                </div>
                
                {/* Filter badge - show when compact and filters active */}
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
                
                {/* Back to top - show when compact */}
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className={`
                    flex-shrink-0 p-2 rounded-xl
                    bg-stone-100 dark:bg-slate-700 
                    hover:bg-stone-200 dark:hover:bg-slate-600 
                    text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] 
                    cursor-pointer transition-all duration-200 ease-out
                    ${isCompact ? 'opacity-100' : 'opacity-0 w-0 p-0 overflow-hidden'}
                  `}
                  title="Back to top"
                >
                  <ChevronDown className="w-4 h-4 rotate-180" />
                </button>
                
                {/* Refresh button - hide when compact */}
                <motion.button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className={`
                    flex-shrink-0 p-2.5 rounded-xl
                    bg-stone-100 dark:bg-slate-700 
                    hover:bg-stone-200 dark:hover:bg-slate-600 
                    text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] 
                    cursor-pointer disabled:opacity-50 
                    transition-all duration-200 ease-out
                    ${isCompact ? 'opacity-0 w-0 p-0 overflow-hidden' : 'opacity-100'}
                  `}
                  whileHover={!isCompact ? { scale: 1.05 } : undefined}
                  whileTap={!isCompact ? { scale: 0.95 } : undefined}
                >
                  <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${isFetching ? 'animate-spin' : ''}`} />
                </motion.button>
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
                {/* Rank filter toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="
                    w-full flex items-center justify-between
                    px-4 py-3 rounded-2xl
                    bg-stone-50 dark:bg-slate-800/50
                    border border-[var(--bento-border)]
                    hover:bg-stone-100 dark:hover:bg-slate-700/50
                    transition-colors cursor-pointer
                    group
                  "
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[var(--bento-secondary)]" />
                    <span className="font-soft font-medium text-[var(--bento-text)]">
                      Filter by Rank
                    </span>
                    {selectedRanks.length > 0 && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--bento-primary)] text-white">
                        {selectedRanks.length} selected
                      </span>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: showFilters ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-[var(--bento-text-muted)] group-hover:text-[var(--bento-text)] transition-colors" />
                  </motion.div>
                </button>

                {/* Rank chips - CSS grid transition for smooth height */}
                <div 
                  className={`
                    grid transition-all duration-200 ease-out
                    ${showFilters ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
                  `}
                >
                  <div className="overflow-hidden">
                    <div className="pt-4 mt-4 border-t border-[var(--bento-border)]">
                      <div className="flex flex-wrap gap-2">
                        {FC_RANKS.map((rank) => {
                          const count = rankCounts[rank.name] || 0;
                          const isSelected = selectedRanks.includes(rank.name);
                          return (
                            <button
                              key={rank.name}
                              onClick={() => toggleRank(rank.name)}
                              className={`
                                inline-flex items-center gap-2
                                px-4 py-2.5 rounded-xl text-sm font-soft font-medium
                                cursor-pointer transition-all duration-150
                                active:scale-95
                                ${isSelected 
                                  ? 'bg-gradient-to-r from-[var(--bento-primary)] to-rose-500 text-white shadow-lg shadow-[var(--bento-primary)]/25' 
                                  : 'bg-white dark:bg-slate-700 border border-[var(--bento-border)] hover:border-[var(--bento-primary)]/30 hover:bg-[var(--bento-primary)]/5 text-[var(--bento-text)]'
                                }
                              `}
                            >
                              <span>{rank.name}</span>
                              <span className={`
                                text-xs px-2 py-0.5 rounded-full transition-colors duration-150
                                ${isSelected 
                                  ? 'bg-white/20' 
                                  : 'bg-stone-100 dark:bg-slate-600 text-[var(--bento-text-muted)]'
                                }
                              `}>
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

                {/* Results summary - CSS transition for instant feel */}
                <div 
                  className={`
                    transition-all duration-150 ease-out overflow-hidden
                    ${hasActiveFilters ? 'opacity-100 max-h-20 pt-4 mt-4' : 'opacity-0 max-h-0 pt-0 mt-0'}
                  `}
                >
                  <div className={`flex items-center justify-between ${hasActiveFilters ? 'border-t border-[var(--bento-border)] pt-4' : ''}`}>
                    <p className="font-soft text-sm text-[var(--bento-text-muted)]">
                      Showing <span className="font-semibold text-[var(--bento-text)]">{filteredMembers.length}</span> of {allMembers.length} members
                    </p>
                    <button
                      onClick={clearFilters}
                      className="text-sm font-soft font-medium text-[var(--bento-primary)] hover:text-[var(--bento-primary)]/80 transition-colors cursor-pointer flex items-center gap-1.5"
                      tabIndex={hasActiveFilters ? 0 : -1}
                    >
                      <X className="w-3.5 h-3.5" />
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
            <div className="flex flex-col items-center justify-center py-16">
              <motion.img 
                src={pushingMoogles} 
                alt="Moogles working hard" 
                className="w-36 md:w-44 -mb-3"
                animate={{ 
                  x: [0, 4, -4, 4, 0],
                  rotate: [0, 1.5, -1.5, 1.5, 0],
                }}
                transition={{ 
                  duration: 0.7, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.p 
                className="font-accent text-xl text-[var(--bento-text-muted)]"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Fetching members, kupo...
              </motion.p>
            </div>
          ) : isError ? (
            <ContentCard className="text-center py-12 md:py-16">
              <motion.img 
                src={deadMoogle} 
                alt="Moogle down" 
                className="w-36 h-36 mx-auto mb-5 object-contain"
                animate={{ rotate: [0, -3, 3, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">
                Something went wrong
              </p>
              <p className="font-accent text-xl text-[var(--bento-text-muted)] mb-6">
                A moogle fell over, kupo...
              </p>
              <motion.button
                onClick={() => refetch()}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="
                  inline-flex items-center justify-center gap-2
                  px-6 py-3 rounded-xl
                  bg-gradient-to-r from-[var(--bento-primary)] to-rose-500
                  text-white font-soft font-semibold
                  shadow-lg shadow-[var(--bento-primary)]/25
                  hover:shadow-xl hover:shadow-[var(--bento-primary)]/30
                  transition-all cursor-pointer
                "
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </motion.button>
            </ContentCard>
          ) : filteredMembers.length === 0 ? (
            <ContentCard className="text-center py-12 md:py-16">
              <motion.img 
                src={grumpyMoogle} 
                alt="Confused moogle" 
                className="w-36 h-36 mx-auto mb-5 object-contain"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">No members found</p>
              <p className="font-accent text-xl text-[var(--bento-text-muted)] mb-5">
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
                    bg-transparent border border-[var(--bento-border)]
                    text-[var(--bento-text)] font-soft font-semibold
                    hover:bg-stone-100 dark:hover:bg-slate-700
                    hover:border-[var(--bento-primary)]/30
                    transition-all cursor-pointer
                  "
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </motion.button>
              )}
            </ContentCard>
          ) : (
            <div className={`space-y-12 transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
              {deferredSelectedRanks.length === 0 && !deferredSearchQuery ? (
                // Grouped view by rank when no filters
                // Use cumulative index for staggered animation across all cards
                (() => {
                  let cumulativeIndex = 0;
                  return Array.from(membersByRank.entries()).map(([rankName, members], sectionIdx) => {
                    const startIndex = cumulativeIndex;
                    cumulativeIndex += members.length;
                    
                    return (
                      <motion.section 
                        key={rankName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: sectionIdx * 0.1 }}
                      >
                        {/* Rank header - refined style */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center gap-2.5">
                            <h2 className="font-display font-bold text-lg md:text-xl text-[var(--bento-text)]">
                              {rankName}
                            </h2>
                            <span className="
                              px-2.5 py-1 rounded-full 
                              bg-gradient-to-r from-[var(--bento-primary)]/10 to-[var(--bento-secondary)]/10
                              text-[var(--bento-primary)] text-sm font-soft font-bold
                              border border-[var(--bento-primary)]/10
                            ">
                              {members.length}
                            </span>
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-[var(--bento-border)] to-transparent" />
                        </div>
                        
                        {/* Members grid - responsive with better spacing */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
                          {members.map((member, idx) => (
                            <MemoizedMemberCard key={member.characterId} member={member} index={startIndex + idx} />
                          ))}
                        </div>
                      </motion.section>
                    );
                  });
                })()
              ) : (
                // Flat grid when filters are active - centered with better responsiveness
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 lg:gap-6 justify-items-center">
                  {filteredMembers.map((member, idx) => (
                    <MemoizedMemberCard key={member.characterId} member={member} index={idx} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer message */}
          {!isLoading && !isError && filteredMembers.length > 0 && (
            <footer className="text-center mt-16 pt-8 border-t border-[var(--bento-border)]">
              <p className="font-accent text-lg text-[var(--bento-text-subtle)]">
                <Heart className="w-4 h-4 text-pink-500 inline mr-2" />
                Every member makes us stronger, kupo!
                <Heart className="w-4 h-4 text-pink-500 inline ml-2" />
              </p>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo, useRef, useDeferredValue, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Search, RefreshCw, Users, X, Heart, Sparkles, ChevronDown, Star } from 'lucide-react';
import { membersApi } from '../api/members';
import { VirtualizedMemberGrid } from '../components/VirtualizedMemberGrid';
import { FC_RANKS } from '../types';
import pushingMoogles from '../assets/moogles/moogles pushing.webp';
import grumpyMoogle from '../assets/moogles/just-the-moogle-cartoon-mammal-animal-wildlife-rabbit-transparent-png-2967816.webp';
import deadMoogle from '../assets/moogles/dead moogle.webp';
import wizardMoogle from '../assets/moogles/wizard moogle.webp';
import musicMoogle from '../assets/moogles/moogle playing music.webp';

// Storybook divider matching home page
function StoryDivider({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 20" 
      className={`w-48 md:w-64 h-5 ${className}`}
      fill="none"
    >
      <path 
        d="M10 10 Q 30 5, 50 10 T 90 10 T 130 10 T 170 10 T 190 10" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
        className="text-[var(--bento-primary)]/40"
      />
      <circle cx="100" cy="10" r="3" className="fill-[var(--bento-secondary)]" />
      <circle cx="80" cy="8" r="2" className="fill-[var(--bento-primary)]/50" />
      <circle cx="120" cy="8" r="2" className="fill-[var(--bento-primary)]/50" />
    </svg>
  );
}

// Floating background moogles for this page
function FloatingBackgroundMoogles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.img
        src={wizardMoogle}
        alt=""
        aria-hidden
        className="absolute top-32 left-4 md:left-16 w-20 md:w-28 object-contain"
        style={{ rotate: '-10deg' }}
        animate={{ 
          opacity: [0.08, 0.14, 0.08],
          y: [0, -12, 0],
        }}
        transition={{
          opacity: { duration: 4, repeat: Infinity },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.img
        src={musicMoogle}
        alt=""
        aria-hidden
        className="absolute top-48 right-4 md:right-16 w-16 md:w-24 object-contain"
        style={{ rotate: '8deg' }}
        animate={{ 
          opacity: [0.08, 0.14, 0.08],
          y: [0, -10, 0],
        }}
        transition={{
          opacity: { duration: 4, repeat: Infinity, delay: 1 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
      />
    </div>
  );
}

// Floating sparkles
function FloatingSparkles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[
        { left: '5%', top: '20%' },
        { left: '90%', top: '15%' },
        { left: '15%', top: '60%' },
        { left: '85%', top: '70%' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={pos}
          animate={{
            y: [0, -8, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeInOut",
          }}
        >
          {i % 2 === 0 ? (
            <Sparkles className="w-4 h-4 text-[var(--bento-primary)]" />
          ) : (
            <Star className="w-4 h-4 text-[var(--bento-secondary)] fill-[var(--bento-secondary)]" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Content card with storybook styling
function ContentCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`
      bg-[var(--bento-card)]/80 backdrop-blur-sm border border-[var(--bento-primary)]/10
      rounded-2xl p-6 md:p-8 shadow-lg shadow-[var(--bento-primary)]/5 ${className}
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
  
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const deferredSelectedRanks = useDeferredValue(selectedRanks);
  const isFiltering = searchQuery !== deferredSearchQuery || selectedRanks !== deferredSelectedRanks;
  
  const isCompactRef = useRef(isCompact);
  
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const shouldBeCompact = window.scrollY > 120;
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
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
      <FloatingBackgroundMoogles />
      <FloatingSparkles />

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
                  {/* Search icon inside input - hidden on mobile since we have badge */}
                  <div 
                    className={`
                      absolute inset-y-0 left-0 items-center 
                      pointer-events-none text-[var(--bento-text-muted)]
                      transition-all duration-200 ease-out
                      hidden md:flex
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
                    {/* Rank filter toggle */}
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="
                        w-full flex items-center justify-between
                        px-4 py-3 rounded-2xl
                        bg-[var(--bento-bg)]
                        border border-[var(--bento-border)]
                        hover:border-[var(--bento-primary)]/20 hover:bg-[var(--bento-primary)]/5
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
                        <ChevronDown className="w-5 h-5 text-[var(--bento-text-muted)] group-hover:text-[var(--bento-primary)] transition-colors" />
                      </motion.div>
                    </button>

                    {/* Rank chips */}
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

                    {/* Results summary */}
                    <div 
                      className={`
                        transition-all duration-150 ease-out overflow-hidden
                        ${hasActiveFilters ? 'opacity-100 max-h-20 pt-4 mt-4' : 'opacity-0 max-h-0 pt-0 mt-0'}
                      `}
                    >
                      <div className={`flex items-center justify-between ${hasActiveFilters ? 'border-t border-[var(--bento-border)] pt-4' : ''}`}>
                        <p className="font-soft text-sm text-[var(--bento-text-muted)]">
                          Showing <span className="font-semibold text-[var(--bento-primary)]">{filteredMembers.length}</span> of {allMembers.length} members
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
            <ContentCard className="text-center py-16">
              <motion.img 
                src={pushingMoogles} 
                alt="Moogles working hard" 
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
              />
              <motion.p 
                className="font-accent text-2xl text-[var(--bento-text-muted)]"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Fetching members, kupo...
              </motion.p>
            </ContentCard>
          ) : isError ? (
            <ContentCard className="text-center py-12 md:py-16">
              <img 
                src={deadMoogle} 
                alt="Moogle down" 
                className="w-40 h-40 mx-auto mb-5 object-contain"
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
                "
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </motion.button>
            </ContentCard>
          ) : filteredMembers.length === 0 ? (
            <ContentCard className="text-center py-12 md:py-16">
              <img 
                src={grumpyMoogle} 
                alt="Confused moogle" 
                className="w-40 h-40 mx-auto mb-5 object-contain"
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
                  "
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </motion.button>
              )}
            </ContentCard>
          ) : (
            <div className={`transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
              <VirtualizedMemberGrid
                members={filteredMembers}
                membersByRank={membersByRank}
                showGrouped={deferredSelectedRanks.length === 0 && !deferredSearchQuery}
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

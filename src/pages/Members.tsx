import { useState, useMemo, useRef, useDeferredValue, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { Search, RefreshCw, Users, X, Heart, Sparkles, ChevronDown, Star, Filter, ChevronUp } from 'lucide-react';
import { membersApi } from '../api/members';
import { VirtualizedMemberGrid, StoryDivider, FloatingSparkles, SimpleFloatingMoogles, ContentCard, MobileHeader } from '../components';
import { FC_RANKS } from '../types';
import pushingMoogles from '../assets/moogles/moogles pushing.webp';
import grumpyMoogle from '../assets/moogles/just-the-moogle-cartoon-mammal-animal-wildlife-rabbit-transparent-png-2967816.webp';
import deadMoogle from '../assets/moogles/dead moogle.webp';
import wizardMoogle from '../assets/moogles/wizard moogle.webp';
import musicMoogle from '../assets/moogles/moogle playing music.webp';

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Mobile: Compact search field */
function MobileSearchField({ 
  value, 
  onChange, 
  onClear,
  placeholder = "Search",
  inputRef,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-[var(--bento-text-muted)]" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-8 py-2
          bg-[var(--bento-card)] 
          border border-[var(--bento-border)]
          rounded-lg
          text-sm font-soft text-[var(--bento-text)]
          placeholder:text-[var(--bento-text-subtle)]
          focus:outline-none focus:border-[var(--bento-primary)] focus:ring-1 focus:ring-[var(--bento-primary)]/20
          transition-all duration-100
        "
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center cursor-pointer"
        >
          <div className="w-4 h-4 rounded-full bg-[var(--bento-text-muted)]/20 flex items-center justify-center">
            <X className="w-2.5 h-2.5 text-[var(--bento-text-muted)]" />
          </div>
        </button>
      )}
    </div>
  );
}

/** Mobile: Horizontal scrolling filter chips - compact */
function MobileFilterChips({ 
  ranks, 
  selectedRanks, 
  rankCounts,
  onToggle,
  onClearAll,
}: {
  ranks: typeof FC_RANKS;
  selectedRanks: string[];
  rankCounts: Record<string, number>;
  onToggle: (rank: string) => void;
  onClearAll: () => void;
}) {
  return (
    <div className="relative -mx-4">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[var(--bento-bg)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[var(--bento-bg)] to-transparent z-10 pointer-events-none" />
      
      <div className="flex gap-1.5 px-4 overflow-x-auto scrollbar-none scroll-smooth">
        {/* Clear button */}
        {selectedRanks.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--bento-primary)] text-white text-[11px] font-soft font-semibold active:scale-95 transition-transform"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
        
        {ranks.map((rank) => {
          const isSelected = selectedRanks.includes(rank.name);
          const count = rankCounts[rank.name] || 0;
          
          return (
            <button
              key={rank.name}
              onClick={() => onToggle(rank.name)}
              className={`
                flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-soft font-medium
                active:scale-95 transition-all duration-100
                ${isSelected 
                  ? 'bg-[var(--bento-primary)] text-white' 
                  : 'bg-[var(--bento-card)] text-[var(--bento-text)] border border-[var(--bento-border)]'
                }
              `}
            >
              <span className="whitespace-nowrap">{rank.name}</span>
              <span className={`text-[10px] tabular-nums ${isSelected ? 'text-white/70' : 'text-[var(--bento-text-muted)]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Back to top floating button */
function BackToTopButton({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-4 z-40 md:hidden w-12 h-12 rounded-full bg-[var(--bento-card)] border border-[var(--bento-border)] shadow-xl shadow-black/10 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronUp className="w-5 h-5 text-[var(--bento-text)]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function Members() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRanks, setSelectedRanks] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const deferredSelectedRanks = useDeferredValue(selectedRanks);
  const isFiltering = searchQuery !== deferredSearchQuery || selectedRanks !== deferredSelectedRanks;
  
  // Track scroll
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 60);
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
      result = result.filter(member => deferredSelectedRanks.includes(member.freeCompanyRank));
    }
    return result;
  }, [allMembers, deferredSearchQuery, deferredSelectedRanks]);

  const membersByRank = useMemo(() => {
    const grouped = new Map<string, typeof filteredMembers>();
    FC_RANKS.forEach(rank => {
      const membersInRank = filteredMembers.filter(m => m.freeCompanyRank === rank.name);
      if (membersInRank.length > 0) grouped.set(rank.name, membersInRank);
    });
    return grouped;
  }, [filteredMembers]);

  const toggleRank = useCallback((rankName: string) => {
    setSelectedRanks((prev) => prev.includes(rankName) ? prev.filter((r) => r !== rankName) : [...prev, rankName]);
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
      {/* Desktop: Background decorations */}
      <div className="hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
        <SimpleFloatingMoogles primarySrc={wizardMoogle} secondarySrc={musicMoogle} />
        <FloatingSparkles minimal />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE VIEW (< md breakpoint)
          Dynamic header with title + search/filters
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden">
        {/* Page header with search */}
        <MobileHeader 
          title="Family"
          rightContent={
            <span className="px-2 py-0.5 rounded-full bg-[var(--bento-primary)]/10 text-[var(--bento-primary)] text-xs font-soft font-bold tabular-nums">
              {hasActiveFilters ? filteredMembers.length : allMembers.length}
            </span>
          }
        >
          {/* Search and filters */}
          <div className="px-4 py-2 space-y-2 border-b border-[var(--bento-border)]/30">
            <MobileSearchField
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search members..."
              inputRef={searchInputRef}
            />
            
            {/* Filter row */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-soft font-medium active:scale-95 transition-all ${showFilters || selectedRanks.length > 0 ? 'bg-[var(--bento-primary)]/10 text-[var(--bento-primary)]' : 'text-[var(--bento-text-muted)] bg-[var(--bento-card)]'}`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Rank</span>
                {selectedRanks.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[var(--bento-primary)] text-white text-[10px] font-bold">
                    {selectedRanks.length}
                  </span>
                )}
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-soft font-medium text-[var(--bento-text-muted)] active:scale-95 transition-all"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
            
            {/* Filter chips */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }} 
                  transition={{ duration: 0.15 }}
                >
                  <MobileFilterChips ranks={FC_RANKS} selectedRanks={selectedRanks} rankCounts={rankCounts} onToggle={toggleRank} onClearAll={() => setSelectedRanks([])} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </MobileHeader>

        {/* Content */}
        <div className="px-3 py-2 pb-24">
          {isLoading ? (
            <ContentCard className="text-center py-16 mt-4">
              <motion.img src={pushingMoogles} alt="Moogles working hard" className="w-32 mx-auto mb-4" animate={{ x: [0, 4, -4, 4, 0], rotate: [0, 1.5, -1.5, 1.5, 0] }} transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }} />
              <motion.p className="font-accent text-xl text-[var(--bento-text-muted)]" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>Fetching members, kupo...</motion.p>
            </ContentCard>
          ) : isError ? (
            <ContentCard className="text-center py-12 mt-4">
              <img src={deadMoogle} alt="Moogle down" className="w-32 h-32 mx-auto mb-4 object-contain" />
              <p className="text-lg font-display font-semibold mb-1 text-[var(--bento-text)]">Something went wrong</p>
              <p className="font-accent text-lg text-[var(--bento-text-muted)] mb-5">A moogle fell over, kupo...</p>
              <motion.button onClick={() => refetch()} whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bento-primary)] text-white font-soft font-semibold text-sm shadow-lg shadow-[var(--bento-primary)]/25 active:brightness-95 transition-all cursor-pointer">
                <RefreshCw className="w-4 h-4" />Try Again
              </motion.button>
            </ContentCard>
          ) : filteredMembers.length === 0 ? (
            <ContentCard className="text-center py-12 mt-4">
              <img src={grumpyMoogle} alt="Confused moogle" className="w-32 h-32 mx-auto mb-4 object-contain" />
              <p className="text-lg font-display font-semibold mb-1 text-[var(--bento-text)]">No members found</p>
              <p className="font-accent text-lg text-[var(--bento-text-muted)] mb-4">Kupo? We couldn't find anyone...</p>
              {hasActiveFilters && (
                <motion.button onClick={clearFilters} whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[var(--bento-card)] border border-[var(--bento-border)] text-[var(--bento-text)] font-soft font-medium text-sm active:bg-[var(--bento-bg)] transition-all cursor-pointer">
                  <X className="w-4 h-4" />Clear filters
                </motion.button>
              )}
            </ContentCard>
          ) : (
            <motion.div className={`pt-4 transition-opacity duration-200 ${isFiltering ? 'opacity-60' : 'opacity-100'}`}>
              <VirtualizedMemberGrid members={filteredMembers} membersByRank={membersByRank} showGrouped={deferredSelectedRanks.length === 0 && !deferredSearchQuery} />
            </motion.div>
          )}
        </div>
        
        <BackToTopButton show={isScrolled && !isLoading && filteredMembers.length > 0} />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          DESKTOP VIEW (>= md breakpoint)
          Original storybook design with decorated search card
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block relative py-8 md:py-12 px-4 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Page header - storybook style */}
          <motion.header className="text-center mb-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <motion.p className="font-accent text-xl md:text-2xl text-[var(--bento-secondary)] mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              ~ The ones who make it special ~
            </motion.p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bento-primary)]/10 border border-[var(--bento-primary)]/20 text-[var(--bento-primary)] text-sm font-soft font-medium">
                <Users className="w-4 h-4" />{allMembers.length} members
              </span>
              <Star className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3">
              <span className="bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent">The Family</span>
            </h1>
            <p className="text-lg text-[var(--bento-text-muted)] font-soft flex items-center justify-center gap-2 mb-4">
              Our wonderful FC crew
              <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
            </p>
            <StoryDivider className="mx-auto" />
          </motion.header>

          {/* Sticky search bar - storybook styled */}
          <div ref={searchContainerRef} className={`sticky z-30 mb-8 pt-2 transition-[margin] duration-200 ${isScrolled ? 'mx-4 md:mx-8' : ''}`} style={{ top: 'calc(4.5rem + var(--safe-area-inset-top, 0px))' }}>
            <div className={`relative overflow-hidden bg-[var(--bento-card)]/95 backdrop-blur-xl border border-[var(--bento-primary)]/10 rounded-2xl transition-all duration-200 ${isScrolled ? 'p-3 shadow-lg' : 'p-4 md:p-6 shadow-xl shadow-[var(--bento-primary)]/5'}`}>
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[var(--bento-primary)]/10 to-[var(--bento-secondary)]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none transition-opacity duration-200 ${isScrolled ? 'opacity-0' : 'opacity-100'}`} />
              
              <div className="relative flex items-center gap-2 md:gap-3">
                <div className={`bg-gradient-to-br from-[var(--bento-primary)] to-[var(--bento-secondary)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[var(--bento-primary)]/25 rounded-xl transition-all duration-200 ease-out ${isScrolled ? 'w-8 h-8' : 'w-9 h-9 md:w-10 md:h-10'}`}>
                  <Search className={`text-white transition-all duration-200 ${isScrolled ? 'w-4 h-4' : 'w-4 h-4 md:w-5 md:h-5'}`} />
                </div>
                
                <div className={`flex-shrink-0 origin-left transition-[opacity,transform] duration-200 ease-out ${isScrolled ? 'w-0 opacity-0 scale-95 overflow-hidden pointer-events-none' : 'opacity-100 scale-100'}`}>
                  <h3 className="font-display font-semibold text-lg text-[var(--bento-text)] whitespace-nowrap">Find Members</h3>
                  <p className="text-sm text-[var(--bento-text-muted)] font-accent whitespace-nowrap">Search by name or filter by rank, kupo~</p>
                </div>
                
                <div className="relative flex-1 min-w-0">
                  <div className={`absolute inset-y-0 left-0 items-center pointer-events-none text-[var(--bento-text-muted)] transition-all duration-200 ease-out flex ${isScrolled ? 'pl-3 opacity-100' : 'pl-4 opacity-100'}`}>
                    <Search className={`transition-all duration-200 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full font-soft text-[var(--bento-text)] placeholder:text-[var(--bento-text-subtle)] focus:outline-none bg-[var(--bento-bg)] border border-[var(--bento-border)] focus:border-[var(--bento-primary)] focus:ring-2 focus:ring-[var(--bento-primary)]/20 transition-all duration-200 ease-out ${isScrolled ? 'pl-10 pr-10 py-2 text-sm rounded-xl' : 'pl-12 pr-12 py-3 text-base rounded-xl'}`}
                  />
                  <button onClick={() => setSearchQuery('')} className={`absolute inset-y-0 right-0 flex items-center cursor-pointer pr-3 transition-all duration-150 ${searchQuery ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`} tabIndex={searchQuery ? 0 : -1}>
                    <span className={`bg-[var(--bento-primary)]/10 hover:bg-[var(--bento-primary)]/20 rounded-lg transition-colors ${isScrolled ? 'p-1' : 'p-1.5'}`}>
                      <X className={`text-[var(--bento-primary)] ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    </span>
                  </button>
                </div>
                
                {selectedRanks.length > 0 && isScrolled && (
                  <button onClick={() => setSelectedRanks([])} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--bento-primary)]/10 text-[var(--bento-primary)] text-xs font-soft font-semibold hover:bg-[var(--bento-primary)]/20 transition-colors cursor-pointer whitespace-nowrap">
                    <Sparkles className="w-3 h-3" /><span>{selectedRanks.length}</span>
                  </button>
                )}
                
                {isScrolled && (
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--bento-bg)] hover:bg-[var(--bento-primary)]/10 text-[var(--bento-text-muted)] hover:text-[var(--bento-primary)] cursor-pointer transition-colors duration-200" title="Back to top">
                    <ChevronDown className="w-4 h-4 rotate-180" />
                  </button>
                )}
              </div>
              
              {/* Expanded filter section */}
              <div className={`grid transition-all duration-200 ease-out ${isScrolled ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
                <div className="overflow-hidden">
                  <div className="pt-5">
                    <button onClick={() => setShowFilters(!showFilters)} className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[var(--bento-bg)] border border-[var(--bento-border)] hover:border-[var(--bento-primary)]/20 hover:bg-[var(--bento-primary)]/5 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-[var(--bento-secondary)]" />
                        <span className="font-soft font-medium text-[var(--bento-text)]">Filter by Rank</span>
                        {selectedRanks.length > 0 && <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--bento-primary)] text-white">{selectedRanks.length} selected</span>}
                      </div>
                      <motion.div animate={{ rotate: showFilters ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-5 h-5 text-[var(--bento-text-muted)] group-hover:text-[var(--bento-primary)] transition-colors" />
                      </motion.div>
                    </button>

                    <div className={`grid transition-all duration-200 ease-out ${showFilters ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="pt-4 mt-4 border-t border-[var(--bento-border)]">
                          <div className="flex flex-wrap gap-2">
                            {FC_RANKS.map((rank) => {
                              const count = rankCounts[rank.name] || 0;
                              const isSelected = selectedRanks.includes(rank.name);
                              return (
                                <button key={rank.name} onClick={() => toggleRank(rank.name)} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-soft font-medium cursor-pointer transition-all duration-150 active:scale-95 ${isSelected ? 'bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white shadow-lg shadow-[var(--bento-primary)]/25' : 'bg-[var(--bento-card)] border border-[var(--bento-border)] hover:border-[var(--bento-primary)]/30 hover:bg-[var(--bento-primary)]/5 text-[var(--bento-text)]'}`}>
                                  <span>{rank.name}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full transition-colors duration-150 ${isSelected ? 'bg-white/20' : 'bg-[var(--bento-bg)] text-[var(--bento-text-muted)]'}`}>{count}</span>
                                </button>
                              );
                            })}
                          </div>
                          <div className={`mt-3 pt-3 border-t border-[var(--bento-border)] transition-all duration-150 ${selectedRanks.length > 0 ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 overflow-hidden mt-0 pt-0 border-t-0'}`}>
                            <button onClick={() => setSelectedRanks([])} className="text-sm font-soft text-[var(--bento-primary)] hover:text-[var(--bento-primary)]/80 transition-colors cursor-pointer flex items-center gap-1.5" tabIndex={selectedRanks.length > 0 ? 0 : -1}>
                              <X className="w-3.5 h-3.5" />Clear rank filters
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`transition-all duration-150 ease-out overflow-hidden ${hasActiveFilters ? 'opacity-100 max-h-20 pt-4 mt-4' : 'opacity-0 max-h-0 pt-0 mt-0'}`}>
                      <div className={`flex items-center justify-between ${hasActiveFilters ? 'border-t border-[var(--bento-border)] pt-4' : ''}`}>
                        <p className="font-soft text-sm text-[var(--bento-text-muted)]">Showing <span className="font-semibold text-[var(--bento-primary)]">{filteredMembers.length}</span> of {allMembers.length} members</p>
                        <button onClick={clearFilters} className="text-sm font-soft font-medium text-[var(--bento-primary)] hover:text-[var(--bento-primary)]/80 transition-colors cursor-pointer flex items-center gap-1.5" tabIndex={hasActiveFilters ? 0 : -1}>
                          <X className="w-3.5 h-3.5" />Clear all
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
              <motion.img src={pushingMoogles} alt="Moogles working hard" className="w-40 md:w-52 mx-auto mb-4" animate={{ x: [0, 4, -4, 4, 0], rotate: [0, 1.5, -1.5, 1.5, 0] }} transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }} />
              <motion.p className="font-accent text-2xl text-[var(--bento-text-muted)]" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>Fetching members, kupo...</motion.p>
            </ContentCard>
          ) : isError ? (
            <ContentCard className="text-center py-12 md:py-16">
              <img src={deadMoogle} alt="Moogle down" className="w-40 h-40 mx-auto mb-5 object-contain" />
              <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">Something went wrong</p>
              <p className="font-accent text-2xl text-[var(--bento-text-muted)] mb-6">A moogle fell over, kupo...</p>
              <motion.button onClick={() => refetch()} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white font-soft font-semibold shadow-lg shadow-[var(--bento-primary)]/25 hover:shadow-xl hover:shadow-[var(--bento-primary)]/30 transition-all cursor-pointer">
                <RefreshCw className="w-4 h-4" />Try Again
              </motion.button>
            </ContentCard>
          ) : filteredMembers.length === 0 ? (
            <ContentCard className="text-center py-12 md:py-16">
              <img src={grumpyMoogle} alt="Confused moogle" className="w-40 h-40 mx-auto mb-5 object-contain" />
              <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">No members found</p>
              <p className="font-accent text-2xl text-[var(--bento-text-muted)] mb-5">Kupo? We couldn't find anyone by that name...</p>
              {hasActiveFilters && (
                <motion.button onClick={clearFilters} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-transparent border border-[var(--bento-primary)]/30 text-[var(--bento-primary)] font-soft font-semibold hover:bg-[var(--bento-primary)]/10 transition-all cursor-pointer">
                  <X className="w-4 h-4" />Clear filters
                </motion.button>
              )}
            </ContentCard>
          ) : (
            <div className={`transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
              <VirtualizedMemberGrid members={filteredMembers} membersByRank={membersByRank} showGrouped={deferredSelectedRanks.length === 0 && !deferredSearchQuery} />
            </div>
          )}

          {/* Footer */}
          {!isLoading && !isError && filteredMembers.length > 0 && (
            <footer className="text-center mt-16 pt-8" style={{ paddingBottom: 'calc(2rem + var(--safe-area-inset-bottom, 0px))' }}>
              <StoryDivider className="mx-auto mb-6" />
              <p className="font-accent text-xl text-[var(--bento-text-muted)] flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
                Every member makes us stronger, kupo!
                <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
              </p>
              <p className="font-accent text-lg text-[var(--bento-secondary)] mt-2">~ fin ~</p>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

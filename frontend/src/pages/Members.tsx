import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, RefreshCw, Users, X, Sparkles, Heart } from 'lucide-react';
import { membersApi } from '../api/members';
import { MemberCard, MemberCardSkeleton } from '../components/MemberCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FC_RANKS } from '../types';

// Simple card component
function ContentCard({ children, className = '', padding = 'md' }: { children: React.ReactNode; className?: string; padding?: 'sm' | 'md' | 'lg' }) {
  const paddingClass = {
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  }[padding];

  return (
    <div className={`
      bg-white dark:bg-slate-800/90
      border border-[var(--bento-border)]
      rounded-2xl ${paddingClass}
      shadow-sm
      ${className}
    `}>
      {children}
    </div>
  );
}

export function Members() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRanks, setSelectedRanks] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch ALL members once - no pagination
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['members-all'],
    queryFn: () => membersApi.getMembers({ pageSize: 1000 }),
    staleTime: 1000 * 60 * 5,
  });

  const allMembers = data?.items || [];

  // Client-side filtering
  const filteredMembers = useMemo(() => {
    let result = allMembers;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(member => 
        member.name.toLowerCase().includes(query) ||
        member.freeCompanyRank.toLowerCase().includes(query)
      );
    }

    if (selectedRanks.length > 0) {
      result = result.filter(member => 
        selectedRanks.includes(member.freeCompanyRank)
      );
    }

    return result;
  }, [allMembers, searchQuery, selectedRanks]);

  // Group members by rank for display
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

  const toggleRank = (rankName: string) => {
    setSelectedRanks((prev) =>
      prev.includes(rankName) ? prev.filter((r) => r !== rankName) : [...prev, rankName]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRanks([]);
  };

  const hasActiveFilters = searchQuery || selectedRanks.length > 0;

  return (
    <div className="min-h-screen relative">
      <div className="relative py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8 md:mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bento-primary)]/10 text-[var(--bento-primary)] text-sm font-soft font-medium mb-4">
              <Users className="w-4 h-4" />
              {allMembers.length} members
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 text-[var(--bento-text)]">
              The Family
            </h1>
            <p className="text-[var(--bento-text-muted)] text-base md:text-lg font-soft flex items-center justify-center gap-2">
              Our wonderful FC crew
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ContentCard className="mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name or rank..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="w-5 h-5" />}
                    rightElement={
                      searchQuery ? (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="p-1 hover:bg-[var(--bento-bg)] rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-[var(--bento-text-muted)]" />
                        </button>
                      ) : undefined
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={showFilters ? 'primary' : 'ghost'} 
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Ranks</span>
                    {selectedRanks.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-white/20">
                        {selectedRanks.length}
                      </span>
                    )}
                  </Button>
                  <Button variant="ghost" onClick={() => refetch()} disabled={isFetching}>
                    <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                  </Button>
                  {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearFilters}>
                      <X className="w-4 h-4" />
                      <span className="hidden sm:inline">Clear</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Filter Pills */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    className="pt-4 border-t border-[var(--bento-border)] mt-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex flex-wrap gap-2">
                      {FC_RANKS.map((rank) => {
                        const count = allMembers.filter(m => m.freeCompanyRank === rank.name).length;
                        const isSelected = selectedRanks.includes(rank.name);
                        return (
                          <button
                            key={rank.name}
                            onClick={() => toggleRank(rank.name)}
                            className={`
                              inline-flex items-center gap-2
                              px-3 py-2 rounded-xl text-sm font-soft font-medium
                              transition-all duration-200 active:scale-95
                              ${isSelected 
                                ? 'bg-[var(--bento-primary)] text-white shadow-md shadow-[var(--bento-primary)]/20' 
                                : 'bg-stone-100 dark:bg-slate-700 hover:bg-stone-200 dark:hover:bg-slate-600 text-[var(--bento-text-muted)]'
                              }
                            `}
                          >
                            <span>{rank.name}</span>
                            <span className={`
                              text-xs px-1.5 py-0.5 rounded-full
                              ${isSelected ? 'bg-white/20' : 'bg-stone-200 dark:bg-slate-600'}
                            `}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results count */}
              {hasActiveFilters && (
                <div className="pt-4 border-t border-[var(--bento-border)] mt-4">
                  <p className="font-soft text-sm text-[var(--bento-text-muted)]">
                    Showing <span className="font-semibold text-[var(--bento-text)]">{filteredMembers.length}</span> of {allMembers.length} members
                  </p>
                </div>
              )}
            </ContentCard>
          </motion.div>

          {/* Members Display */}
          {isLoading ? (
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
              {Array.from({ length: 12 }).map((_, i) => (
                <MemberCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <ContentCard padding="lg" className="text-center py-16 md:py-24">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 mb-6 font-soft font-medium">
                Failed to load members
              </div>
              <div>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            </ContentCard>
          ) : filteredMembers.length === 0 ? (
            <ContentCard padding="lg" className="text-center py-16 md:py-24">
              <Sparkles className="w-12 h-12 text-[var(--bento-text-subtle)] mx-auto mb-4" />
              <p className="text-xl font-display font-medium mb-2 text-[var(--bento-text)]">No members found</p>
              <p className="text-[var(--bento-text-muted)] font-soft mb-4">Try adjusting your search or filters</p>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters}>Clear filters</Button>
              )}
            </ContentCard>
          ) : (
            <motion.div 
              className="space-y-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {selectedRanks.length === 0 && !searchQuery ? (
                // Grouped view
                Array.from(membersByRank.entries()).map(([rankName, members]) => (
                  <div key={rankName}>
                    {/* Rank Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="font-display font-semibold text-lg text-[var(--bento-text)]">
                        {rankName}
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-[var(--bento-primary)]/10 text-[var(--bento-primary)] text-sm font-soft font-medium">
                        {members.length}
                      </span>
                      <div className="flex-1 h-px bg-[var(--bento-border)]" />
                    </div>
                    
                    {/* Members Grid */}
                    <div className="flex flex-wrap gap-4 md:gap-5">
                      {members.map((member) => (
                        <div 
                          key={member.characterId}
                          className="transition-transform duration-200 hover:-translate-y-1"
                        >
                          <MemberCard member={member} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Flat view when searching/filtering
                <div className="flex flex-wrap gap-4 md:gap-5 justify-center">
                  {filteredMembers.map((member) => (
                    <div 
                      key={member.characterId}
                      className="transition-transform duration-200 hover:-translate-y-1"
                    >
                      <MemberCard member={member} />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Fun footer message */}
          {!isLoading && !isError && filteredMembers.length > 0 && (
            <div className="text-center mt-12 pt-8 border-t border-[var(--bento-border)]">
              <p className="font-accent text-lg text-[var(--bento-text-subtle)] flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                Every member makes us stronger, kupo!
                <Heart className="w-4 h-4 text-pink-500" />
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

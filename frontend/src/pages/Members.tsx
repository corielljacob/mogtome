import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { membersApi } from '../api/members';
import { MemberCard } from '../components/MemberCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FC_RANKS } from '../types';

export function Members() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRanks, setSelectedRanks] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch members
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['members', currentPage, pageSize, searchQuery, selectedRanks],
    queryFn: () =>
      membersApi.getMembers({
        page: currentPage,
        pageSize,
        search: searchQuery,
        ranks: selectedRanks,
      }),
  });

  // Handle rank filter toggle
  const toggleRank = (rankName: string) => {
    setSelectedRanks((prev) =>
      prev.includes(rankName)
        ? prev.filter((r) => r !== rankName)
        : [...prev, rankName]
    );
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRanks([]);
    setCurrentPage(1);
  };

  const totalPages = data?.totalPages || 1;
  const totalCount = data?.totalCount || 0;
  const members = data?.items || [];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text-moogle">FC Members</span>
          </h1>
          <p className="text-base-content/70">
            {totalCount} wonderful adventurers in our Free Company
          </p>
        </motion.div>

        {/* Search and Filter Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-base-100 shadow-lg mb-8"
        >
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder="Search by name or rank..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={showFilters ? 'secondary' : 'ghost'}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {selectedRanks.length > 0 && (
                    <span className="badge badge-primary badge-sm ml-1">
                      {selectedRanks.length}
                    </span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                {(searchQuery || selectedRanks.length > 0) && (
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-base-200 mt-4">
                    <p className="text-sm font-semibold mb-3">Filter by Rank</p>
                    <div className="flex flex-wrap gap-2">
                      {FC_RANKS.map((rank) => (
                        <motion.button
                          key={rank.name}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleRank(rank.name)}
                          className={`badge badge-lg cursor-pointer transition-colors ${
                            selectedRanks.includes(rank.name)
                              ? 'badge-primary'
                              : 'badge-outline'
                          }`}
                        >
                          {rank.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-base-200 mt-4">
              <div className="flex items-center gap-4 text-sm text-base-content/70">
                <span>Showing {members.length} of {totalCount}</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="select select-bordered select-sm"
                >
                  {[10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size} per page
                    </option>
                  ))}
                </select>
              </div>

              <div className="join">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="join-item"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="join-item btn btn-ghost btn-sm no-animation">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="join-item"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Members Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary mb-4" />
            <p className="text-base-content/70">Loading members, kupo...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <div className="alert alert-error max-w-md mx-auto mb-4">
              <span>Failed to load members</span>
            </div>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg mb-2">No members found 😢</p>
            <p className="text-base-content/60">Try adjusting your search or filters</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-6 justify-center"
          >
            {members.map((member, index) => (
              <motion.div
                key={member.characterId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <MemberCard member={member} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

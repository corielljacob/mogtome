import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { membersApi } from '../api/members';
import { MemberCard } from '../components/MemberCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
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

  // Pagination info
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.totalCount || 0;
  const members = data?.items || [];

  // Page size options
  const pageSizeOptions = [10, 20, 50, 100];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-moogle-purple to-moogle-pink bg-clip-text text-transparent">
              FC Members
            </span>
          </h1>
          <p className="text-text-light">
            {totalCount} wonderful adventurers in our Free Company
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-8 p-4">
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
                variant="ghost"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-moogle-lavender/50' : ''}
              >
                <Filter className="w-4 h-4" />
                Filters
                {selectedRanks.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-moogle-purple text-white text-xs rounded-full">
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
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-moogle-lavender/30">
              <p className="text-sm font-semibold text-text-dark mb-3">Filter by Rank</p>
              <div className="flex flex-wrap gap-2">
                {FC_RANKS.map((rank) => (
                  <button
                    key={rank.name}
                    onClick={() => toggleRank(rank.name)}
                    className={`
                      px-3 py-1.5 rounded-full text-sm font-medium
                      transition-all duration-200
                      ${
                        selectedRanks.includes(rank.name)
                          ? 'bg-moogle-purple text-white shadow-md'
                          : 'bg-moogle-lavender/30 text-text hover:bg-moogle-lavender/50'
                      }
                    `}
                  >
                    {rank.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="mt-4 pt-4 border-t border-moogle-lavender/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-text-light">
              <span>
                Showing {members.length} of {totalCount} members
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 bg-surface border border-moogle-lavender/40 rounded-lg focus:outline-none focus:border-moogle-purple"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-4 py-1.5 bg-moogle-lavender/30 rounded-lg text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Members Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-moogle-lavender border-t-moogle-purple rounded-full animate-spin mb-4" />
            <p className="text-text-light">Loading members, kupo...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">Failed to load members</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-light text-lg mb-2">No members found</p>
            <p className="text-text-light/60">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {members.map((member) => (
              <MemberCard key={member.characterId} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

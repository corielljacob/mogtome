import { type CSSProperties } from "react";
import { Users } from "lucide-react";
import { PaginatedMemberGrid } from "@/components/PaginatedMemberGrid";
import {
  PageLayout,
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/PageShell";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import {
  KawaiiSparkle,
  KawaiiBow,
  KawaiiHeart,
} from "@/components/kawaiiMotifs";
import { useMemberFilters } from "@/components/members/useMemberFilters";
import { MembersToolbar } from "@/components/members/MembersToolbar";
import { RankFilter } from "@/components/members/RankFilter";

import grumpyMoogle from "@/assets/moogles/just-the-moogle-cartoon-mammal-animal-wildlife-rabbit-transparent-png-2967816.webp";
import wizardMoogle from "@/assets/moogles/wizard moogle.webp";
import musicMoogle from "@/assets/moogles/moogle playing music.webp";
import lilGuyMoogle from "@/assets/moogles/lil guy moogle.webp";

export function Members() {
  const {
    searchInputRef,
    inputValue,
    setInputValue,
    setSearchQuery,
    selectedRanks,
    validSortBy,
    setSortBy,
    toggleRank,
    clearFilters,
    hasActiveFilters,
    deferredSearchQuery,
    deferredSelectedRanks,
    isFiltering,
    isLoading,
    isError,
    refetch,
    allMembers,
    filteredMembers,
    membersByRank,
    rankCounts,
  } = useMemberFilters();

  return (
    <PageLayout moogles={{ primary: wizardMoogle, secondary: musicMoogle }}>
      <div className="corkboard relative px-3.5 py-7 sm:px-6 sm:py-9 md:px-9 md:py-11">
        <span
          className="pushpin absolute top-3 left-3 sm:top-4 sm:left-4 z-20"
          aria-hidden="true"
        />
        <span
          className="pushpin absolute top-3 right-3 sm:top-4 sm:right-4 z-20"
          style={{ "--pin": "var(--secondary)" } as CSSProperties}
          aria-hidden="true"
        />
        <span
          className="pushpin absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20"
          style={{ "--pin": "var(--accent)" } as CSSProperties}
          aria-hidden="true"
        />
        <span
          className="pushpin absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20"
          style={{ "--pin": "var(--secondary)" } as CSSProperties}
          aria-hidden="true"
        />

        <img
          src={lilGuyMoogle}
          alt=""
          aria-hidden="true"
          className="hidden lg:block absolute -top-7 -right-4 w-20 rotate-[10deg] animate-[float-gentle_4s_ease-in-out_infinite] pointer-events-none select-none z-20"
        />

        <header className="relative w-fit mx-auto mb-7 sm:mb-9 text-center animate-[fadeSlideIn_0.4s_ease-out]">
          <span
            className="pushpin absolute -top-2 left-1/2 -translate-x-1/2 z-10"
            aria-hidden="true"
          />
          <div className="surface paper -rotate-1 px-7 sm:px-12 py-5 sm:py-6">
            <div
              className="flex items-center justify-center gap-1.5 mb-1.5"
              aria-hidden="true"
            >
              <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--accent)]" />
              <KawaiiBow className="w-6 h-6 text-[var(--primary)]" />
              <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--secondary)]" />
            </div>
            <p className="eyebrow-script text-lg sm:text-2xl text-[var(--secondary)]/90 mb-1">
              ~ the whole moogle pile ~
            </p>
            <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[var(--text)]">
              <span className="text-highlight">Our Family</span>
            </h1>
            <div className="inline-flex items-center gap-1.5 mt-2 text-[var(--text-muted)]">
              <Users
                className="w-4 h-4 text-[var(--secondary)]"
                aria-hidden="true"
              />
              <span className="font-soft text-sm">
                <span className="font-display font-bold text-[var(--text)]">
                  {allMembers.length}
                </span>{" "}
                members
              </span>
            </div>
          </div>
        </header>

        <MembersToolbar
          searchInputRef={searchInputRef}
          inputValue={inputValue}
          setInputValue={setInputValue}
          setSearchQuery={setSearchQuery}
          validSortBy={validSortBy}
          setSortBy={setSortBy}
        />

        <RankFilter
          selectedRanks={selectedRanks}
          toggleRank={toggleRank}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          filteredCount={filteredMembers.length}
          totalCount={allMembers.length}
          rankCounts={rankCounts}
        />

        {isLoading ? (
          <div className="paper">
            <LoadingState message="Fetching members, kupo..." />
          </div>
        ) : isError ? (
          <div className="paper">
            <ErrorState
              message="A moogle fell over, kupo..."
              onRetry={() => refetch()}
            />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="paper">
            <EmptyState
              title="No members found"
              message="Kupo? We couldn't find anyone by that name..."
              imageSrc={grumpyMoogle}
              onClear={hasActiveFilters ? clearFilters : undefined}
              clearLabel="Clear filters"
            />
          </div>
        ) : (
          <div
            className={`transition-opacity duration-200 ${isFiltering ? "opacity-50" : "opacity-100"}`}
          >
            <PaginatedMemberGrid
              members={filteredMembers}
              membersByRank={membersByRank}
              showGrouped={
                deferredSelectedRanks.length === 0 &&
                !deferredSearchQuery &&
                validSortBy === "rank-asc"
              }
              pageSize={24}
            />
          </div>
        )}

        {!isLoading && !isError && filteredMembers.length > 0 && (
          <div className="text-center mt-10 pt-7">
            <p className="eyebrow-script text-2xl text-[var(--text-muted)] inline-flex items-center justify-center gap-2.5">
              <KawaiiHeart className="w-5 h-5 text-[var(--primary)]" />
              Every member makes us stronger, kupo!
              <KawaiiHeart className="w-5 h-5 text-[var(--primary)]" />
            </p>
          </div>
        )}
      </div>

      <ScrollToTopButton />
    </PageLayout>
  );
}

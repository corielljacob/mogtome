import { type CSSProperties } from "react";
import { Users } from "lucide-react";
import { PaginatedMemberGrid } from "@/features/members/PaginatedMemberGrid";
import {
  PageLayout,
  PageHeader,
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/shared/ui/PageShell";
import { ScrollToTopButton } from "@/shared/ui/ScrollToTopButton";
import { KawaiiHeart } from "@/shared/ui/kawaiiMotifs";
import {
  Sticker,
  MoogleSticker,
  BubbleSticker,
  TapeStrip,
  Dot,
} from "@/shared/ui/stickers";
import { useMemberFilters } from "@/features/members/useMemberFilters";
import { MembersToolbar } from "@/features/members/MembersToolbar";
import { RankFilter } from "@/features/members/RankFilter";

import grumpyMoogle from "@/assets/moogles/just-the-moogle-cartoon-mammal-animal-wildlife-rabbit-transparent-png-2967816.webp";
import wizardMoogle from "@/assets/moogles/wizard moogle.webp";
import musicMoogle from "@/assets/moogles/moogle playing music.webp";

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
    <PageLayout
      bleed
      moogles={{ primary: wizardMoogle, secondary: musicMoogle }}
    >
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

        <PageHeader
          opener="~ the whole moogle pile ~"
          title="Our Family"
          stickers={
            <>
              <TapeStrip className="top-4 left-[7%] -rotate-[14deg]" />
              <MoogleSticker
                src={musicMoogle}
                ring="var(--primary)"
                className="hidden md:block left-[4%] top-1/2 -translate-y-1/2 h-16 w-16 -rotate-[8deg]"
              />
              <Sticker
                className="hidden sm:flex right-[5%] top-1/2 -translate-y-1/2 h-12 w-12 rotate-[12deg]"
                color="var(--accent)"
              >
                <KawaiiHeart className="w-6 h-6 text-white" />
              </Sticker>
              <BubbleSticker className="hidden lg:block right-[14%] top-6 -rotate-[5deg]">
                welcome!
              </BubbleSticker>
              <Dot
                className="hidden md:block left-[17%] bottom-5 h-2.5 w-2.5"
                color="var(--secondary)"
              />
              <Dot
                className="hidden lg:block right-[3%] top-7 h-2 w-2"
                color="var(--primary)"
              />
            </>
          }
        >
          <div className="inline-flex items-center gap-1.5 mt-3 text-[var(--text-muted)]">
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
        </PageHeader>

        {/* sticky search + filter rail beside the member grid on large screens */}
        <div className="lg:grid lg:grid-cols-[19rem_1fr] lg:gap-6 xl:gap-8 lg:items-start">
          <aside className="space-y-4 sm:space-y-5 mb-5 sm:mb-7 lg:mb-0 lg:sticky lg:top-4">
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
          </aside>

          <div className="min-w-0">
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
        </div>
      </div>

      <ScrollToTopButton />
    </PageLayout>
  );
}

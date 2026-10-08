import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { PaginatedMemberGrid } from "./PaginatedMemberGrid";
import { MemberCardSkeleton } from "./MemberCard";
import { useMemberFilters } from "./useMemberFilters";
import { MembersToolbar } from "./MembersToolbar";
import { RankFilter } from "./RankFilter";
import { FamilyIcon, FamilyRankIcon } from "./FamilyIcons";
import { FamilyAlbumArt } from "./FamilyAlbumArt";
import { scrollAppToTop } from "@/shared/lib/scroll";
import { useStickyToolbar } from "@/shared/hooks/useStickyToolbar";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { NookPressedFlower } from "@/features/home/components/NookPressedFlower";
import "./family-screen.css";

export function Members() {
  const { isDarkMode } = useTheme();
  const {
    searchInputRef,
    searchQuery,
    inputValue,
    setInputValue,
    setSearchQuery,
    selectedRanks,
    validSortBy,
    setSortBy,
    toggleRank,
    clearFilters,
    clearRanks,
    groupByRank,
    setGroupByRank,
    hasActiveFilters,
    isFiltering,
    isLoading,
    isError,
    refetch,
    allMembers,
    filteredMembers,
    membersByRank,
    rankCounts,
    searchMatchCount,
  } = useMemberFilters();
  const resultsSummaryRef = useRef<HTMLParagraphElement>(null);
  const albumRef = useRef<HTMLElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  useStickyToolbar(albumRef, toolbarRef);
  const filterKey = JSON.stringify([
    searchQuery,
    selectedRanks,
    validSortBy,
    groupByRank,
  ]);
  const previousFilters = useRef(filterKey);
  useEffect(() => {
    if (isFiltering || previousFilters.current === filterKey) return;
    previousFilters.current = filterKey;
    const summary = resultsSummaryRef.current;
    const toolbar = toolbarRef.current;
    // A search started while browsing lower rows should reveal the new results.
    // Keep focus in the field so typing can continue without interruption.
    if (
      summary &&
      toolbar &&
      summary.getBoundingClientRect().top <
        Math.max(0, toolbar.getBoundingClientRect().bottom)
    ) {
      summary.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [filterKey, isFiltering]);
  const clearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    searchInputRef.current?.focus();
  };
  const resetFilters = () => {
    clearFilters();
    searchInputRef.current?.focus();
  };

  return (
    <div className="family-screen" data-mode={isDarkMode ? "dark" : "light"}>
      <div className="family-content">
        <header className="family-cover">
          <div className="family-cover-copy">
            <p className="family-eyebrow">
              Kupo Life <span aria-hidden="true">·</span> Zalera{" "}
              <span aria-hidden="true">·</span> Crystal
            </p>
            <h1>
              Members
              <FamilyIcon name="heart" className="family-title-heart" />
            </h1>
            <p className="family-cover-description">
              Find a familiar face, or meet someone new.
            </p>
            <div className="family-cover-details">
              <span className="family-member-total">
                <FamilyIcon name="people" size={19} />
                {isLoading ? (
                  "Loading members…"
                ) : isError ? (
                  "Our Free Company"
                ) : (
                  <>
                    <strong>{allMembers.length}</strong>
                    {allMembers.length === 1 ? "member" : "members"}
                  </>
                )}
              </span>
            </div>
          </div>
          <div className="family-cover-art" aria-hidden="true">
            <FamilyAlbumArt />
          </div>
        </header>

        <section
          ref={albumRef}
          className="family-album"
          aria-label="Member directory"
        >
          <h2 className="sr-only">Member directory</h2>
          <div className="family-sticky-toolbar" ref={toolbarRef}>
            <span className="family-note-tape" aria-hidden="true" />
            <span className="family-note-flower" aria-hidden="true">
              <NookPressedFlower />
              <span className="family-note-paperclip" />
            </span>
            <MembersToolbar
              searchInputRef={searchInputRef}
              inputValue={inputValue}
              setInputValue={setInputValue}
              setSearchQuery={setSearchQuery}
              validSortBy={validSortBy}
              setSortBy={setSortBy}
              disabled={isLoading || isError}
            />
          </div>
          <div className="family-filter-note">
            <div className="family-browse-controls">
              <RankFilter
                selectedRanks={selectedRanks}
                toggleRank={toggleRank}
                clearFilters={clearFilters}
                clearRanks={clearRanks}
                hasActiveFilters={hasActiveFilters}
                filteredCount={filteredMembers.length}
                totalCount={allMembers.length}
                rankCounts={rankCounts}
                disabled={isLoading || isError}
                loading={isLoading}
              />
              {!isLoading && !isError && validSortBy === "rank-asc" && (
                <label className="family-group-toggle">
                  <input
                    type="checkbox"
                    checked={groupByRank}
                    onChange={(event) => setGroupByRank(event.target.checked)}
                  />
                  Group by rank
                </label>
              )}
            </div>

            {hasActiveFilters && !isLoading && !isError && (
              <div
                className="family-active-filters"
                aria-label="Active filters"
              >
                {searchQuery.trim() && (
                  <button
                    className="family-active-chip"
                    onClick={clearSearch}
                    aria-label={`Remove search: ${searchQuery.trim()}`}
                  >
                    <FamilyIcon name="search" size={15} />
                    <span>“{searchQuery.trim()}”</span>
                    <FamilyIcon name="close" size={14} />
                  </button>
                )}
                {selectedRanks.map((rank) => (
                  <button
                    key={rank}
                    className="family-active-chip"
                    aria-label={`Remove ${rank} filter`}
                    onClick={() => {
                      toggleRank(rank);
                      resultsSummaryRef.current?.focus({ preventScroll: true });
                    }}
                  >
                    <FamilyRankIcon rank={rank} size={17} />
                    <span>{rank}</span>
                    <FamilyIcon name="close" size={14} />
                  </button>
                ))}
                <button className="family-clear-all" onClick={resetFilters}>
                  Clear all
                </button>
              </div>
            )}

            <div className="family-results-meta">
              <p
                id="search-results-count"
                className="family-results-summary"
                ref={resultsSummaryRef}
                tabIndex={-1}
                role="status"
                aria-atomic="true"
              >
                {isLoading ? (
                  "Loading members…"
                ) : isError ? (
                  "Member list unavailable."
                ) : isFiltering ? (
                  "Updating results…"
                ) : (
                  <>
                    <strong>{filteredMembers.length}</strong>{" "}
                    {filteredMembers.length === 1 ? "member" : "members"}
                    {hasActiveFilters ? " found" : " in Kupo Life"}
                  </>
                )}
              </p>
              {!isLoading && !isError && filteredMembers.length > 0 && (
                <p className="family-profile-hint">
                  <FamilyIcon name="external" size={14} /> Portraits open
                  Lodestone in a new tab.
                </p>
              )}
            </div>
          </div>
          <div className="family-results" aria-busy={isFiltering}>
            {isLoading ? (
              <div className="family-loading">
                <p className="family-loading-message" role="status">
                  <FamilyIcon name="album" size={22} />
                  Rounding everyone up, kupo...
                </p>
                <div
                  className="family-loading-grid"
                  aria-hidden="true"
                  aria-busy="true"
                >
                  {Array.from({ length: 8 }, (_, index) => (
                    <MemberCardSkeleton key={index} />
                  ))}
                </div>
              </div>
            ) : isError ? (
              <div className="family-message" role="alert">
                <span className="family-message-icon">
                  <FamilyIcon name="album" size={38} />
                </span>
                <h2>Couldn’t load the member list</h2>
                <p>Please try again in a moment.</p>
                <button
                  className="family-paper-button"
                  onClick={() => void refetch()}
                >
                  <FamilyIcon name="refresh" size={18} />
                  Try again
                </button>
              </div>
            ) : isFiltering && filteredMembers.length === 0 ? (
              <div className="family-message">
                <p>Looking for matching members…</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="family-message" role="status">
                <span className="family-message-icon">
                  <FamilyIcon
                    name={hasActiveFilters ? "search" : "album"}
                    size={38}
                  />
                </span>
                <h2>
                  {hasActiveFilters ? "No members found" : "No members yet"}
                </h2>
                <p>
                  {hasActiveFilters
                    ? selectedRanks.length > 0 && searchMatchCount > 0
                      ? "Your search matches members in other ranks. Try searching all ranks."
                      : "Try part of a name or search by rank."
                    : "The member list is empty for now. Check back later."}
                </p>
                {hasActiveFilters && (
                  <div className="family-message-actions">
                    {selectedRanks.length > 0 && searchMatchCount > 0 && (
                      <button
                        className="family-paper-button"
                        onClick={() => {
                          clearRanks();
                          resultsSummaryRef.current?.focus({
                            preventScroll: true,
                          });
                        }}
                      >
                        <FamilyIcon name="people" size={18} />
                        Search all ranks
                      </button>
                    )}
                    <button
                      className="family-paper-button"
                      onClick={resetFilters}
                    >
                      <FamilyIcon name="close" size={17} />
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="family-results-content">
                <PaginatedMemberGrid
                  members={filteredMembers}
                  membersByRank={membersByRank}
                  showGrouped={groupByRank}
                  pageSize={24}
                />
              </div>
            )}
          </div>
          <div className="family-album-end" aria-hidden="true">
            <span />
            <FamilyIcon name="flower" size={22} />
            <span />
          </div>
        </section>

        <footer className="family-footer">
          <Link to="/">
            <FamilyIcon name="arrow-left" size={18} />
            Back home
          </Link>
          <button onClick={scrollAppToTop}>
            Back to top
            <FamilyIcon name="up" size={18} />
          </button>
          <a
            className="family-art-credit"
            href="/images/nook/SOURCES.md"
            target="_blank"
            rel="noreferrer"
          >
            Moogle illustration by Toshiyuki Itahana · © SQUARE ENIX · credits
          </a>
        </footer>
      </div>
    </div>
  );
}

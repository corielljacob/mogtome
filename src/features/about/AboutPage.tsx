import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { staffQuery } from "@/shared/api/memberQueries";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { FC_RANKS, type StaffMember } from "@/shared/types";
import { scrollAppToTop } from "@/shared/lib/scroll";
import { useStickyToolbar } from "@/shared/hooks/useStickyToolbar";
import { NookPressedFlower } from "@/features/home/components/NookPressedFlower";
import { StaffCard } from "./StaffCard";
import { AboutIcon } from "./AboutIcons";
import illustratedMoogle from "@/assets/moogles/illustrated moogle.webp";
import "./about-screen.css";

const RANK_ORDER = new Map<string, number>(
  FC_RANKS.map((rank, index) => [rank.name, index]),
);

export function About() {
  const { user, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const [search, setSearch] = useState("");
  const [rank, setRank] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const rosterRef = useRef<HTMLElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  useStickyToolbar(rosterRef, toolbarRef);
  const { data, isLoading, isError, isFetching, refetch } =
    useQuery(staffQuery);
  const currentUserName = isAuthenticated ? user?.memberName : undefined;
  const canEditOwn = isAuthenticated && user?.hasKnighthood === true;
  const staff = useMemo(
    () =>
      [...(data?.staff ?? [])].sort((a, b) => {
        const rankDiff =
          (RANK_ORDER.get(a.freeCompanyRank) ?? 999) -
          (RANK_ORDER.get(b.freeCompanyRank) ?? 999);
        return (
          rankDiff ||
          a.freeCompanyRank.localeCompare(b.freeCompanyRank) ||
          a.name.localeCompare(b.name)
        );
      }),
    [data?.staff],
  );
  const leaderName = staff.find(
    (member) => member.freeCompanyRank === "Moogle Guardian",
  )?.name;
  const ranks = [...new Set(staff.map((member) => member.freeCompanyRank))];
  const query = search.trim().replace(/\s+/g, " ").toLocaleLowerCase();
  const hasFilters = Boolean(query || rank);
  const filteredStaff = staff.filter(
    (member) =>
      (!rank || member.freeCompanyRank === rank) &&
      (!query ||
        `${member.name} ${member.biography ?? ""}`
          .replace(/\s+/g, " ")
          .toLocaleLowerCase()
          .includes(query)),
  );
  const groups: { rank: string; members: StaffMember[] }[] = [];
  for (const member of filteredStaff) {
    const lastGroup = groups.at(-1);
    if (lastGroup?.rank === member.freeCompanyRank)
      lastGroup.members.push(member);
    else groups.push({ rank: member.freeCompanyRank, members: [member] });
  }
  const clearFilters = () => {
    setSearch("");
    setRank("");
    searchRef.current?.focus({ preventScroll: true });
  };
  const clearSearch = () => {
    setSearch("");
    searchRef.current?.focus({ preventScroll: true });
  };
  const filterKey = JSON.stringify([query, rank]);
  const previousFilters = useRef(filterKey);
  useEffect(() => {
    if (previousFilters.current === filterKey) return;
    previousFilters.current = filterKey;
    const results = resultsRef.current;
    const toolbar = toolbarRef.current;
    if (
      results &&
      toolbar &&
      results.getBoundingClientRect().top <
        Math.max(0, toolbar.getBoundingClientRect().bottom)
    ) {
      results.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [filterKey]);

  return (
    <div className="about-screen" data-mode={isDarkMode ? "dark" : "light"}>
      <div className="about-content">
        <header className="about-masthead">
          <h1>
            About Kupo Life <AboutIcon name="heart" />
          </h1>
          <p>A bit about our Free Company and the people in it.</p>
        </header>

        <section
          className="about-welcome"
          aria-labelledby="about-welcome-title"
        >
          <div className="about-welcome-note">
            <span className="about-washi" aria-hidden="true" />
            <p className="about-location">
              <AboutIcon name="crystal" size={18} /> Zalera{" "}
              <span aria-hidden="true">·</span> Crystal Data Center
            </p>
            <h2 id="about-welcome-title">Play at your own pace.</h2>
            <p className="about-story">
              Kupo Life is our FFXIV Free Company on Zalera. Come raid, craft,
              or just hang out in chat.
            </p>
            <p className="about-story">
              There’s no activity quota or pressure to raid.
            </p>
            <a className="about-button" href="#about-crew-title">
              <AboutIcon name="people" size={18} /> Meet the crew{" "}
              <AboutIcon name="arrow-right" size={18} />
            </a>
          </div>
          <figure className="about-keepsake">
            <span className="about-washi" aria-hidden="true" />
            <div className="about-keepsake-image">
              <img
                src={illustratedMoogle}
                width="320"
                height="300"
                alt="A little moogle waving hello"
              />
            </div>
            <figcaption>
              <span>Kupo Life, Zalera</span>
              <AboutIcon name="heart" size={19} />
            </figcaption>
            <span className="about-keepsake-flower" aria-hidden="true">
              <NookPressedFlower />
            </span>
          </figure>
        </section>

        <section className="about-life" aria-labelledby="about-life-title">
          <div className="about-section-heading about-life-heading">
            <h2 id="about-life-title">Life around the FC</h2>
            <span aria-hidden="true" />
          </div>
          <div className="about-life-grid">
            <article>
              <span className="about-life-icon">
                <AboutIcon name="treasure" size={30} />
              </span>
              <div>
                <h3>A little adventure</h3>
                <p>
                  Come along for raids and treasure hunts whenever you feel like
                  it.
                </p>
              </div>
            </article>
            <article>
              <span className="about-life-icon">
                <AboutIcon name="camera" size={30} />
              </span>
              <div>
                <h3>A creative streak</h3>
                <p>
                  Crafting, screenshot competitions, and the occasional
                  giveaway.
                </p>
              </div>
            </article>
            <article>
              <span className="about-life-icon">
                <AboutIcon name="chat" size={30} />
              </span>
              <div>
                <h3>Good company</h3>
                <p>
                  We hang out in chat and keep in touch on Discord when we’re
                  not in game.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section
          className="about-roster"
          ref={rosterRef}
          aria-labelledby="about-crew-title"
        >
          <header className="about-section-heading about-roster-heading">
            <div>
              <h2 id="about-crew-title" tabIndex={-1}>
                Our crew
              </h2>
              <p>A few familiar faces, with notes in their own words.</p>
            </div>
            {!isLoading && staff.length > 0 && (
              <span className="about-staff-total">
                <AboutIcon name="people" size={17} /> {staff.length} crew
                members
              </span>
            )}
          </header>
          {staff.length > 0 && (
            <div className="about-roster-tools" ref={toolbarRef}>
              <div className="about-roster-search">
                <label htmlFor="about-crew-search">Search the crew</label>
                <div>
                  <AboutIcon name="search" size={19} />
                  <input
                    ref={searchRef}
                    id="about-crew-search"
                    type="search"
                    inputMode="search"
                    enterKeyHint="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.nativeEvent.isComposing) return;
                      if (event.key === "Escape" && search) {
                        event.preventDefault();
                        event.stopPropagation();
                        clearSearch();
                      }
                    }}
                    aria-describedby="about-crew-results"
                    placeholder="Name or bio…"
                    autoComplete="off"
                  />
                  {search && (
                    <button
                      type="button"
                      aria-label="Clear crew search"
                      onClick={clearSearch}
                    >
                      <AboutIcon name="close" size={16} />
                    </button>
                  )}
                </div>
              </div>
              <div className="about-roster-rank">
                <label htmlFor="about-crew-rank">Rank</label>
                <div>
                  <select
                    id="about-crew-rank"
                    value={rank}
                    onChange={(event) => setRank(event.target.value)}
                  >
                    <option value="">All ranks</option>
                    {ranks.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <AboutIcon name="chevron-down" size={16} />
                </div>
              </div>
              <div className="about-roster-results">
                <p id="about-crew-results" role="status" aria-atomic="true">
                  {filteredStaff.length} of {staff.length} crew members shown
                </p>
                {hasFilters && (
                  <button type="button" onClick={clearFilters}>
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="about-roster-content" ref={resultsRef}>
            {isLoading && staff.length === 0 ? (
              <div className="about-roster-state" role="status">
                <AboutIcon name="people" size={32} />
                <p>Rounding everyone up, kupo...</p>
                <div className="about-roster-skeleton" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ) : isError && staff.length === 0 ? (
              <div className="about-roster-state" role="alert">
                <AboutIcon name="people" size={32} />
                <h3>Couldn’t load the crew.</h3>
                <p>Please try again in a moment.</p>
                <button
                  className="about-button"
                  type="button"
                  disabled={isFetching}
                  onClick={() => void refetch()}
                >
                  <AboutIcon name="refresh" size={18} />
                  {isFetching ? "Trying again…" : "Try again"}
                </button>
              </div>
            ) : staff.length === 0 ? (
              <div className="about-roster-state">
                <AboutIcon name="people" size={32} />
                <h3>No crew profiles yet</h3>
                <p>Profiles will appear here when they’re added.</p>
              </div>
            ) : (
              <>
                {isError && (
                  <div className="about-roster-refresh-error" role="alert">
                    <p>
                      Couldn’t refresh the crew. You can still read the profiles
                      below.
                    </p>
                    <button
                      type="button"
                      disabled={isFetching}
                      onClick={() => void refetch()}
                    >
                      {isFetching ? "Trying again…" : "Try again"}
                    </button>
                  </div>
                )}
                {filteredStaff.length === 0 ? (
                  <div className="about-roster-state">
                    <AboutIcon name="search" size={32} />
                    <h3>No matching crew members</h3>
                    <p>
                      Try another name or a word from their bio, or change the
                      rank filter.
                    </p>
                    <button
                      className="about-button"
                      type="button"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="about-staff-groups">
                    {groups.map((group) => (
                      <section
                        className="about-staff-group"
                        key={group.rank}
                        aria-label={group.rank}
                        data-leader={
                          group.rank === "Moogle Guardian" ? "true" : undefined
                        }
                      >
                        <header>
                          <h3>{group.rank}</h3>
                          <span>{group.members.length}</span>
                          <i aria-hidden="true" />
                        </header>
                        <div className="about-staff-grid">
                          {group.members.map((member) => (
                            <StaffCard
                              key={member.characterId}
                              member={member}
                              isLeader={member.name === leaderName}
                              isCurrentUser={currentUserName === member.name}
                              isOwnEditable={
                                currentUserName === member.name && canEditOwn
                              }
                            />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="about-next" aria-label="More from Kupo Life">
          <Link to="/members">
            <AboutIcon name="people" size={26} />
            <span>
              <strong>Members</strong>
              <small>Meet the rest of Kupo Life.</small>
            </span>
            <AboutIcon name="arrow-right" size={20} />
          </Link>
          <Link to="/chronicle">
            <AboutIcon name="compass" size={26} />
            <span>
              <strong>The Chronicle</strong>
              <small>Catch up on recent FC activity.</small>
            </span>
            <AboutIcon name="arrow-right" size={20} />
          </Link>
        </section>
        <footer className="about-footer">
          <Link to="/">
            <AboutIcon name="arrow-left" size={17} /> Back home
          </Link>
          <button type="button" onClick={scrollAppToTop}>
            Back to top <AboutIcon name="up" size={17} />
          </button>
        </footer>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import { DiscordIcon } from "@/shared/ui/DiscordIcon";
import { useStickyToolbar } from "@/shared/hooks/useStickyToolbar";
import { useChronicle } from "./useChronicle";
import { ChronicleControls } from "./ChronicleControls";
import { ChronicleIcon } from "./ChronicleIcons";
import { JournalEntry } from "./JournalEntry";
import { getEventKey } from "./chronicleHelpers";
import { LiveStatus } from "./LiveStatus";
import { ChronicleDayIndex } from "./ChronicleDayIndex";
import { ChronicleDayHeading } from "./ChronicleDayHeading";
import moogleMail from "@/assets/moogles/moogle mail.webp";

interface PageFocusRequest {
  button: HTMLButtonElement;
  query: string;
  previousKeys: Set<string>;
  newKeys?: Set<string>;
  hasNextPage?: boolean;
}

export function ChronicleAccessNotice() {
  const { login } = useAuth();
  return (
    <section
      className="chronicle-access chronicle-paper"
      aria-labelledby="chronicle-access-title"
    >
      <span className="chronicle-washi" aria-hidden="true" />
      <div className="chronicle-access-art" aria-hidden="true">
        <img src={moogleMail} alt="" />
      </div>
      <div className="chronicle-access-copy">
        <span className="chronicle-note-label">
          <ChronicleIcon name="book" size={17} /> For our FC members
        </span>
        <h2 id="chronicle-access-title">What’s new in the FC?</h2>
        <p>
          Sign in with Discord to read FC announcements and see who’s joined or
          moved up a rank.
        </p>
        <button
          className="chronicle-paper-button chronicle-sign-in"
          onClick={login}
        >
          <DiscordIcon /> Sign in with Discord{" "}
          <ChronicleIcon name="arrow-right" size={18} />
        </button>
        <Link to="/members" className="chronicle-access-family">
          Meet the members <ChronicleIcon name="arrow-right" size={16} />
        </Link>
      </div>
    </section>
  );
}

export function Chronicle() {
  const model = useChronicle();
  return <ChronicleView model={model} />;
}

/** Presentation is separate so loading, recovery, and sample layouts can be tested. */
export function ChronicleView({
  model,
}: {
  model: ReturnType<typeof useChronicle>;
}) {
  const {
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    refetch,
    loadMore,
    totalCount,
    dayGroups,
    isTransitioning,
    hasActiveQuery,
    handleClearAll,
    searchInput,
    activeFilter,
    status,
    unseenCount,
    reconnect,
    markAllAsSeen,
    deferredSearchQuery,
    apiEvents,
    canViewNameChanges,
  } = model;
  const initialLoading = isLoading && totalCount === 0;
  const initialError = isError && !isFetchNextPageError && totalCount === 0;
  const canReconnect = status === "disconnected" || status === "error";
  const hasDayIndex = dayGroups.length > 1;
  const workspaceRef = useRef<HTMLElement>(null);
  const toolbarRef = useRef<HTMLElement>(null);
  useStickyToolbar(workspaceRef, toolbarRef);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const emptyHeadingRef = useRef<HTMLHeadingElement>(null);
  const entriesRef = useRef<HTMLDivElement>(null);
  const endnoteRef = useRef<HTMLParagraphElement>(null);
  const pageFocusRef = useRef<PageFocusRequest | null>(null);
  const [completedPage, setCompletedPage] = useState<PageFocusRequest | null>(
    null,
  );
  const query = JSON.stringify([
    searchInput,
    deferredSearchQuery,
    activeFilter,
    canViewNameChanges,
  ]);
  const resultQuery = JSON.stringify([deferredSearchQuery, activeFilter]);
  const previousResultQuery = useRef(resultQuery);

  useEffect(() => {
    if (
      isTransitioning ||
      initialLoading ||
      previousResultQuery.current === resultQuery
    )
      return;
    previousResultQuery.current = resultQuery;
    const heading = headingRef.current;
    const toolbar = toolbarRef.current;
    // Filtering from the sticky controls should reveal the new results without
    // taking focus away from the field. Older-page loads keep their own place.
    if (
      heading &&
      toolbar &&
      heading.getBoundingClientRect().top <
        Math.max(0, toolbar.getBoundingClientRect().bottom)
    ) {
      heading.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [resultQuery, isTransitioning, initialLoading]);

  useEffect(() => {
    // A disabled or removed button can drop focus onto body. Track intentional
    // navigation separately so finishing a request never pulls the reader back.
    const cancelForFocus = (event: FocusEvent | PointerEvent) => {
      const request = pageFocusRef.current;
      if (
        request &&
        event.type === "focusin" &&
        event.target === document.body &&
        (request.button.disabled || !request.button.isConnected)
      )
        return;
      if (request && !request.button.contains(event.target as Node)) {
        pageFocusRef.current = null;
      }
    };
    const cancelForTab = (event: KeyboardEvent) => {
      if (event.key === "Tab") pageFocusRef.current = null;
    };
    document.addEventListener("focusin", cancelForFocus);
    document.addEventListener("pointerdown", cancelForFocus);
    document.addEventListener("keydown", cancelForTab);
    return () => {
      pageFocusRef.current = null;
      document.removeEventListener("focusin", cancelForFocus);
      document.removeEventListener("pointerdown", cancelForFocus);
      document.removeEventListener("keydown", cancelForTab);
    };
  }, []);

  useEffect(() => {
    const request = pageFocusRef.current;
    if (!request) return;
    if (request.query !== query) {
      pageFocusRef.current = null;
      return;
    }
    if (completedPage !== request || isFetching || !request.newKeys) return;
    const newKeys = request.newKeys;

    const firstNewItem = dayGroups
      .flatMap((group) => group.items)
      .find(
        (item) => !item.isRealtime && newKeys.has(getEventKey(item.event, 0)),
      );
    const entry = firstNewItem
      ? Array.from(
          entriesRef.current?.querySelectorAll<HTMLElement>(
            "[data-chronicle-entry-key]",
          ) ?? [],
        ).find(
          (element) =>
            element.dataset.chronicleEntryKey ===
            getEventKey(firstNewItem.event, 0),
        )
      : undefined;
    const endnote =
      !hasNextPage && request.hasNextPage === false
        ? (endnoteRef.current ?? emptyHeadingRef.current)
        : null;

    // The query result can settle before React commits its new rows.
    if (
      !entry &&
      !endnote &&
      newKeys.size > 0 &&
      !apiEvents.some((event) => newKeys.has(getEventKey(event, 0)))
    )
      return;
    if (!entry && !endnote && request.hasNextPage === false) return;

    pageFocusRef.current = null;
    if (
      document.activeElement !== request.button &&
      document.activeElement !== document.body
    )
      return;
    const target = entry ?? endnote;
    if (target) {
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: "instant", block: "nearest" });
    } else if (request.button.isConnected) {
      request.button.focus({ preventScroll: true });
    }
  }, [query, completedPage, isFetching, dayGroups, hasNextPage, apiEvents]);

  const handleLoadOlder = (event: MouseEvent<HTMLButtonElement>) => {
    if (isFetching || isTransitioning || !hasNextPage) return;
    const request: PageFocusRequest = {
      button: event.currentTarget,
      query,
      previousKeys: new Set(
        dayGroups.flatMap((group) =>
          group.items.map((item) => getEventKey(item.event, 0)),
        ),
      ),
    };
    pageFocusRef.current = request;
    const result = loadMore();
    if (!result) {
      pageFocusRef.current = null;
      return;
    }
    void result
      .then((page) => {
        if (pageFocusRef.current !== request) return;
        if (!page.isSuccess || !page.data) {
          pageFocusRef.current = null;
          return;
        }
        request.newKeys = new Set(
          page.data.pages.flatMap((page) =>
            page.events
              .filter(
                (entry) => canViewNameChanges || entry.type !== "NameChanged",
              )
              .map((entry) => getEventKey(entry, 0))
              .filter((key) => !request.previousKeys.has(key)),
          ),
        );
        request.hasNextPage = page.hasNextPage;
        setCompletedPage(request);
      })
      .catch(() => {
        if (pageFocusRef.current === request) pageFocusRef.current = null;
      });
  };

  return (
    <section
      ref={workspaceRef}
      className="chronicle-workspace"
      aria-label="Company activity"
    >
      <span className="chronicle-washi" aria-hidden="true" />
      <ChronicleControls model={model} toolbarRef={toolbarRef} />
      <header className="chronicle-workspace-heading">
        <div>
          <h2 ref={headingRef} tabIndex={-1}>
            {hasActiveQuery ? "Matching entries" : "Recent activity"}
          </h2>
          <p role="status" aria-atomic="true">
            {initialLoading
              ? hasActiveQuery
                ? "Searching…"
                : "Opening the Chronicle…"
              : initialError
                ? hasActiveQuery
                  ? "Search unavailable"
                  : "Entries unavailable"
                : isTransitioning
                  ? "Searching…"
                  : `${totalCount} ${totalCount === 1 ? "entry" : "entries"} loaded`}
          </p>
        </div>
        <div className="chronicle-workspace-actions">
          <div
            className="chronicle-connection"
            role="group"
            aria-label="Live connection"
          >
            <LiveStatus status={status} compact />
            {canReconnect && (
              <button
                type="button"
                className="chronicle-text-action"
                onClick={reconnect}
              >
                <ChronicleIcon name="refresh" size={16} /> Reconnect
              </button>
            )}
          </div>
          {unseenCount > 0 && (
            <div className="chronicle-unread-notice">
              <strong>
                {unseenCount} new {unseenCount === 1 ? "entry" : "entries"}
              </strong>
              <button
                type="button"
                className="chronicle-text-action"
                onClick={
                  hasActiveQuery
                    ? handleClearAll
                    : () => {
                        markAllAsSeen();
                        headingRef.current?.focus({ preventScroll: true });
                      }
                }
              >
                {hasActiveQuery ? "View new entries" : "Mark all read"}
              </button>
            </div>
          )}
        </div>
      </header>
      {deferredSearchQuery && (
        <p className="chronicle-search-context">
          Results for <strong>“{deferredSearchQuery}”</strong>
        </p>
      )}
      <div
        className={`chronicle-reading-layout${hasDayIndex ? " has-day-index" : ""}`}
      >
        {hasDayIndex && (
          <ChronicleDayIndex
            groups={dayGroups}
            onBackToSearch={() => {
              const input = model.searchInputRef.current;
              input?.focus({ preventScroll: true });
              input?.scrollIntoView({ behavior: "instant", block: "center" });
            }}
          />
        )}
        <section className="chronicle-timeline" aria-label="Chronicle timeline">
          <div aria-busy={isTransitioning || initialLoading}>
            {initialLoading ? (
              <div className="chronicle-loading">
                <p>
                  <ChronicleIcon name="book" size={24} />{" "}
                  {hasActiveQuery
                    ? "Finding matching entries…"
                    : "Catching up on the FC…"}
                </p>
                <div className="chronicle-loading-lines" aria-hidden="true">
                  {[0, 1, 2].map((index) => (
                    <div key={index}>
                      <span />
                      <span />
                      <span />
                    </div>
                  ))}
                </div>
              </div>
            ) : initialError ? (
              <div className="chronicle-message" role="alert">
                <ChronicleIcon name="book" className="chronicle-message-icon" />
                <h3>
                  {hasActiveQuery
                    ? "Couldn't load matching entries"
                    : "Couldn't open the Chronicle"}
                </h3>
                <p>
                  {hasActiveQuery
                    ? "Try again, or clear your search and filters."
                    : "Please try again in a moment."}
                </p>
                <button
                  type="button"
                  className="chronicle-paper-button"
                  disabled={isFetching}
                  onClick={() => void refetch()}
                >
                  <ChronicleIcon name="refresh" size={18} />{" "}
                  {isFetching ? "Trying again…" : "Try again"}
                </button>
              </div>
            ) : totalCount === 0 ? (
              <div className="chronicle-message">
                <ChronicleIcon
                  name={hasActiveQuery ? "search" : "book"}
                  className="chronicle-message-icon"
                />
                <h3 ref={emptyHeadingRef} tabIndex={-1}>
                  {hasNextPage
                    ? hasActiveQuery
                      ? "No matching entries on this page"
                      : "No entries on this page"
                    : hasActiveQuery
                      ? "No matching entries"
                      : "The first page is waiting"}
                </h3>
                <p>
                  {hasNextPage
                    ? hasActiveQuery
                      ? "Try loading older entries, or clear your search and filters."
                      : "Try loading older entries."
                    : hasActiveQuery
                      ? "Try another member name or event type, or clear your filters."
                      : "FC activity will appear here as it happens."}
                </p>
                {(hasActiveQuery || searchInput || activeFilter) && (
                  <button
                    type="button"
                    className="chronicle-paper-button"
                    onClick={handleClearAll}
                  >
                    <ChronicleIcon name="close" size={17} /> Clear search and
                    filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {isError && !isFetchNextPageError && (
                  <div className="chronicle-update-error" role="alert">
                    <p>
                      We couldn't refresh the Chronicle. You can still read the
                      entries below.
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
                <div className="chronicle-day-pages" ref={entriesRef}>
                  {dayGroups.map((group) => (
                    <section
                      className="chronicle-day-page"
                      key={group.key}
                      aria-label={`Entries from ${group.label}`}
                    >
                      <ChronicleDayHeading group={group} />
                      <ol className="chronicle-entries">
                        {group.items.map((item, index) => (
                          <JournalEntry
                            key={getEventKey(item.event, index)}
                            item={item}
                          />
                        ))}
                      </ol>
                    </section>
                  ))}
                </div>
              </>
            )}
            {!initialLoading &&
              !initialError &&
              (totalCount > 0 || hasNextPage || isFetchNextPageError) && (
                <div className="chronicle-load-older">
                  {isFetchNextPageError && (
                    <p className="chronicle-pagination-error" role="alert">
                      Couldn't load older entries. You can try again.
                    </p>
                  )}
                  {hasNextPage || isFetchNextPageError ? (
                    <>
                      <button
                        type="button"
                        className="chronicle-paper-button"
                        onClick={handleLoadOlder}
                        disabled={isFetching || isTransitioning || !hasNextPage}
                      >
                        <ChronicleIcon
                          name={
                            isFetchingNextPage || isFetchNextPageError
                              ? "refresh"
                              : "chevron-down"
                          }
                          size={18}
                        />
                        {isFetchingNextPage
                          ? "Loading older entries…"
                          : isFetchNextPageError
                            ? "Try loading again"
                            : "Load older entries"}
                      </button>
                      <p>
                        Showing {totalCount} loaded{" "}
                        {totalCount === 1 ? "entry" : "entries"} · Newest first
                      </p>
                    </>
                  ) : isLoading ? (
                    <p className="chronicle-endnote" role="status">
                      <ChronicleIcon name="book" size={18} /> Loading earlier
                      entries…
                    </p>
                  ) : !isError ? (
                    <p
                      className="chronicle-endnote"
                      ref={endnoteRef}
                      tabIndex={-1}
                    >
                      <ChronicleIcon name="check" size={18} />{" "}
                      {hasActiveQuery
                        ? "That's every matching entry."
                        : "You've reached the beginning of the Chronicle."}
                    </p>
                  ) : null}
                  <span className="sr-only" role="status">
                    {isFetchingNextPage ? "Loading older entries" : ""}
                  </span>
                </div>
              )}
          </div>
        </section>
      </div>
    </section>
  );
}

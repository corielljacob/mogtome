import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ChronicleEvent } from "@/shared/types";
import type { useChronicle } from "./useChronicle";
import { ChronicleView } from "./ChroniclePage";
const welcome: ChronicleEvent = {
  id: { timestamp: 1, creationTime: "2026-09-28T18:00:00Z" },
  createdAt: "2026-09-28T18:00:00Z",
  type: "MemberJoined",
  text: "Ada Bloom joined Kupo Life.",
};
const older: ChronicleEvent = {
  id: { timestamp: 2, creationTime: "2026-09-27T18:00:00Z" },
  createdAt: "2026-09-27T18:00:00Z",
  type: "Announcement",
  text: "An earlier FC announcement.",
};
const hiddenNameChange: ChronicleEvent = {
  id: { timestamp: 3, creationTime: "2026-09-26T18:00:00Z" },
  createdAt: "2026-09-26T18:00:00Z",
  type: "NameChanged",
  text: "A member changed their name.",
};

type OlderPageResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useChronicle>["loadMore"]>>
>;

function deferredOlderPage() {
  let resolve!: (result: OlderPageResult) => void;
  const promise = new Promise<OlderPageResult>((settle) => {
    resolve = settle;
  });
  return {
    loadMore: vi.fn(() => promise),
    finish: async (
      events: ChronicleEvent[],
      hasNextPage: boolean,
      failed = false,
    ) => {
      await act(async () => {
        resolve({
          isSuccess: !failed,
          isError: failed,
          hasNextPage,
          data: {
            pages: [{ events, hasMore: hasNextPage }],
            pageParams: [undefined],
          },
        } as OlderPageResult);
      });
    },
  };
}

function withOlderEntry(
  model: ReturnType<typeof useChronicle>,
  hasNextPage = false,
) {
  return {
    ...model,
    totalCount: 2,
    hasNextPage,
    isFetching: false,
    isFetchingNextPage: false,
    apiEvents: [welcome, older],
    dayGroups: [
      ...model.dayGroups,
      {
        key: "2026-8-27",
        label: "September 27",
        items: [{ event: older, isRealtime: false, isUnseen: false }],
      },
    ],
  };
}

function createModel(
  overrides: Partial<ReturnType<typeof useChronicle>> = {},
): ReturnType<typeof useChronicle> {
  return {
    searchInput: "",
    setSearchInput: vi.fn(),
    activeFilter: null,
    setActiveFilter: vi.fn(),
    deferredSearchQuery: "",
    searchInputRef: createRef<HTMLInputElement>(),
    commitSearch: vi.fn(),
    canViewNameChanges: false,
    isSearching: false,
    hasActiveFilter: false,
    hasActiveQuery: false,
    status: "connected",
    unseenCount: 0,
    reconnect: vi.fn(),
    markAllAsSeen: vi.fn(),
    isLoading: false,
    isError: false,
    isFetching: false,
    isFetchingNextPage: false,
    isFetchNextPageError: false,
    hasNextPage: false,
    loadMore: vi.fn(),
    refetch: vi.fn(),
    apiEvents: [welcome],
    displayedEvents: [welcome],
    totalCount: 1,
    dayGroups: [
      {
        key: "2026-09-28",
        label: "September 28",
        items: [{ event: welcome, isRealtime: false, isUnseen: false }],
      },
    ],
    isTransitioning: false,
    handleClearSearch: vi.fn(),
    handleClearAll: vi.fn(),
    handleToggleFilter: vi.fn(),
    ...overrides,
  };
}

function createEmptyModel(
  overrides: Partial<ReturnType<typeof useChronicle>> = {},
) {
  return createModel({
    totalCount: 0,
    apiEvents: [],
    displayedEvents: [],
    dayGroups: [],
    ...overrides,
  });
}

describe("Chronicle page states", () => {
  it("reveals settled search and filter results below the sticky controls without moving input focus", () => {
    const model = createModel();
    const { rerender } = render(<ChronicleView model={model} />);
    const search = screen.getByRole("searchbox");
    const activity = screen.getByRole("combobox", { name: "Activity type" });
    const heading = screen.getByRole("heading", { name: "Recent activity" });
    const toolbar = screen.getByRole("search");
    vi.spyOn(heading, "getBoundingClientRect").mockReturnValue({
      ...heading.getBoundingClientRect(),
      top: -400,
    });
    vi.spyOn(toolbar, "getBoundingClientRect").mockReturnValue({
      ...toolbar.getBoundingClientRect(),
      top: 12,
      bottom: 150,
      height: 138,
    });
    search.focus();
    vi.mocked(Element.prototype.scrollIntoView).mockClear();

    rerender(
      <ChronicleView
        model={{ ...model, searchInput: "Ada", isTransitioning: true }}
      />,
    );
    const searched = {
      ...model,
      searchInput: "Ada",
      deferredSearchQuery: "Ada",
      hasActiveQuery: true,
    };
    rerender(
      <ChronicleView
        model={{ ...searched, totalCount: 0, dayGroups: [], isLoading: true }}
      />,
    );
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();

    rerender(<ChronicleView model={searched} />);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledOnce();
    expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({
      block: "start",
      behavior: "instant",
    });
    expect(search).toHaveFocus();

    // A cached filter result can appear without a loading state or page shrink.
    activity.focus();
    const filtered = { ...searched, activeFilter: "Announcement" as const };
    rerender(<ChronicleView model={filtered} />);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(2);
    expect(activity).toHaveFocus();

    rerender(<ChronicleView model={withOlderEntry(filtered)} />);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(2);
    expect(activity).toHaveFocus();
  });

  it("does not scroll search results that are already below the toolbar", () => {
    const model = createModel();
    const { rerender } = render(<ChronicleView model={model} />);
    const heading = screen.getByRole("heading", { name: "Recent activity" });
    vi.spyOn(heading, "getBoundingClientRect").mockReturnValue({
      ...heading.getBoundingClientRect(),
      top: 400,
    });
    vi.mocked(Element.prototype.scrollIntoView).mockClear();
    rerender(
      <ChronicleView
        model={{ ...model, activeFilter: "Announcement", hasActiveQuery: true }}
      />,
    );

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    "focuses the first new older entry after an explicit load (more pages: %s)",
    async (hasNextPage) => {
      const user = userEvent.setup();
      const request = deferredOlderPage();
      const model = createModel({
        hasNextPage: true,
        loadMore: request.loadMore,
      });
      const { rerender } = render(<ChronicleView model={model} />);
      const button = screen.getByRole("button", { name: "Load older entries" });
      button.focus();
      await user.keyboard("{Enter}");
      rerender(
        <ChronicleView
          model={{ ...model, isFetching: true, isFetchingNextPage: true }}
        />,
      );
      vi.mocked(Element.prototype.scrollIntoView).mockClear();

      // The request can finish before React commits its new rows.
      await request.finish([welcome, older], hasNextPage);
      expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
      rerender(<ChronicleView model={withOlderEntry(model, hasNextPage)} />);

      const entry = screen.getByText(older.text).closest("li");
      await waitFor(() => expect(entry).toHaveFocus());
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledOnce();
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: "instant",
        block: "nearest",
      });
      expect(model.markAllAsSeen).not.toHaveBeenCalled();
    },
  );

  it("does not focus a live arrival instead of the requested older entry", async () => {
    const user = userEvent.setup();
    const request = deferredOlderPage();
    const model = createModel({
      hasNextPage: true,
      loadMore: request.loadMore,
    });
    const { rerender } = render(<ChronicleView model={model} />);
    await user.click(
      screen.getByRole("button", { name: "Load older entries" }),
    );
    const live = {
      ...welcome,
      id: { timestamp: 3, creationTime: "2026-09-28T19:00:00Z" },
      text: "A new live welcome.",
    };
    const loaded = withOlderEntry(model);
    loaded.dayGroups = [
      {
        ...loaded.dayGroups[0],
        items: [
          { event: live, isRealtime: true, isUnseen: true },
          ...loaded.dayGroups[0].items,
        ],
      },
      ...loaded.dayGroups.slice(1),
    ];
    rerender(<ChronicleView model={loaded} />);
    await request.finish([welcome, older], false);

    expect(screen.getByText(older.text).closest("li")).toHaveFocus();
    expect(screen.getByText(live.text).closest("li")).not.toHaveFocus();
    expect(model.markAllAsSeen).not.toHaveBeenCalled();
  });

  it("focuses the endnote when the final page contains no new unique entries", async () => {
    const user = userEvent.setup();
    const request = deferredOlderPage();
    const model = createModel({
      hasNextPage: true,
      loadMore: request.loadMore,
    });
    const { rerender } = render(<ChronicleView model={model} />);
    await user.click(
      screen.getByRole("button", { name: "Load older entries" }),
    );
    rerender(<ChronicleView model={{ ...model, hasNextPage: false }} />);
    await request.finish([welcome, welcome], false);

    expect(
      screen.getByText("You've reached the beginning of the Chronicle."),
    ).toHaveFocus();
    expect(model.markAllAsSeen).not.toHaveBeenCalled();
  });

  it("keeps the reader's new focus position when a pending older page finishes", async () => {
    const user = userEvent.setup();
    const request = deferredOlderPage();
    const model = createModel({
      hasNextPage: true,
      loadMore: request.loadMore,
    });
    const { rerender } = render(<ChronicleView model={model} />);
    await user.click(
      screen.getByRole("button", { name: "Load older entries" }),
    );
    const search = screen.getByRole("searchbox", {
      name: "Search the Chronicle",
    });
    await user.click(search);
    vi.mocked(Element.prototype.scrollIntoView).mockClear();
    rerender(<ChronicleView model={withOlderEntry(model)} />);
    await request.finish([welcome, older], false);

    expect(search).toHaveFocus();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    expect(model.markAllAsSeen).not.toHaveBeenCalled();
  });

  it.each(["search", "filter"])(
    "cancels the pending focus handoff when the %s changes",
    async (change) => {
      const user = userEvent.setup();
      const request = deferredOlderPage();
      const model = createModel({
        hasNextPage: true,
        loadMore: request.loadMore,
      });
      const { rerender } = render(<ChronicleView model={model} />);
      await user.click(
        screen.getByRole("button", { name: "Load older entries" }),
      );
      const changed = {
        ...model,
        ...(change === "search"
          ? { searchInput: "Ada", isTransitioning: true }
          : { activeFilter: "Announcement" as const, hasActiveQuery: true }),
      };
      rerender(<ChronicleView model={changed} />);
      vi.mocked(Element.prototype.scrollIntoView).mockClear();
      rerender(<ChronicleView model={withOlderEntry(changed)} />);
      await request.finish([welcome, older], false);

      expect(screen.getByText(older.text).closest("li")).not.toHaveFocus();
      expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
      expect(model.markAllAsSeen).not.toHaveBeenCalled();
    },
  );

  it("leaves retry focused after an older-page failure without moving the reader", async () => {
    const user = userEvent.setup();
    const request = deferredOlderPage();
    const model = createModel({
      hasNextPage: true,
      loadMore: request.loadMore,
    });
    const { rerender } = render(<ChronicleView model={model} />);
    await user.click(
      screen.getByRole("button", { name: "Load older entries" }),
    );
    vi.mocked(Element.prototype.scrollIntoView).mockClear();
    rerender(
      <ChronicleView
        model={{ ...model, isError: true, isFetchNextPageError: true }}
      />,
    );
    await request.finish([welcome], true, true);

    const retry = screen.getByRole("button", { name: "Try loading again" });
    expect(retry).toBeEnabled();
    expect(retry).toHaveFocus();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    expect(model.markAllAsSeen).not.toHaveBeenCalled();
  });

  it("focuses the new entry after retry succeeds even while the previous error persists during fetching", async () => {
    const user = userEvent.setup();
    const request = deferredOlderPage();
    const model = createModel({
      hasNextPage: true,
      isError: true,
      isFetchNextPageError: true,
      loadMore: request.loadMore,
    });
    const { rerender } = render(<ChronicleView model={model} />);
    await user.click(screen.getByRole("button", { name: "Try loading again" }));
    rerender(
      <ChronicleView
        model={{ ...model, isFetching: true, isFetchingNextPage: true }}
      />,
    );
    await request.finish([welcome, older], false);
    rerender(
      <ChronicleView
        model={{
          ...withOlderEntry(model),
          isError: false,
          isFetchNextPageError: false,
        }}
      />,
    );

    expect(screen.getByText(older.text).closest("li")).toHaveFocus();
    expect(model.markAllAsSeen).not.toHaveBeenCalled();
  });

  it("announces the initial load before presenting an empty Chronicle", () => {
    render(<ChronicleView model={createEmptyModel({ isLoading: true })} />);

    expect(screen.getByText("Opening the Chronicle…")).toHaveAttribute(
      "role",
      "status",
    );
    expect(
      screen.getByText("Catching up on the FC…").closest('[aria-busy="true"]'),
    ).not.toBeNull();
    expect(
      screen.queryByRole("heading", { name: "The first page is waiting" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("offers retry when the first request fails", async () => {
    const user = userEvent.setup();
    const model = createEmptyModel({ isError: true });
    render(<ChronicleView model={model} />);
    const error = screen.getByRole("alert");

    expect(error).toHaveTextContent("Please try again in a moment.");
    await user.click(within(error).getByRole("button", { name: "Try again" }));
    expect(model.refetch).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole("heading", { name: "The first page is waiting" }),
    ).not.toBeInTheDocument();
  });

  it("keeps the query visible and announces search while matching entries load", () => {
    render(
      <ChronicleView
        model={createEmptyModel({
          searchInput: "Ada",
          deferredSearchQuery: "Ada",
          hasActiveQuery: true,
          isLoading: true,
        })}
      />,
    );

    expect(screen.getByText("Searching…")).toHaveAttribute("role", "status");
    expect(screen.getByText("“Ada”")).toBeInTheDocument();
    expect(
      screen
        .getByText("Finding matching entries…")
        .closest('[aria-busy="true"]'),
    ).not.toBeNull();
    expect(
      screen.queryByText("Opening the Chronicle…"),
    ).not.toBeInTheDocument();
  });

  it("keeps search controls available for recovery when a search fails", async () => {
    const user = userEvent.setup();
    const model = createEmptyModel({
      searchInput: "Ada",
      deferredSearchQuery: "Ada",
      hasActiveQuery: true,
      isError: true,
    });
    render(<ChronicleView model={model} />);

    const error = screen.getByRole("alert");
    expect(error).toHaveTextContent("Couldn't load matching entries");
    expect(screen.getByText("“Ada”")).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toHaveValue("Ada");
    await user.click(within(error).getByRole("button", { name: "Try again" }));
    expect(model.refetch).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(model.handleClearAll).toHaveBeenCalledOnce();
  });

  it("does not declare a search exhausted when an empty visible page has older pages", () => {
    render(
      <ChronicleView
        model={createEmptyModel({
          searchInput: "Ada",
          deferredSearchQuery: "Ada",
          hasActiveQuery: true,
          hasNextPage: true,
        })}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "No matching entries on this page" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Load older entries" }),
    ).toBeEnabled();
    expect(
      screen.queryByRole("heading", { name: "No matching entries" }),
    ).not.toBeInTheDocument();
  });

  it("offers clear filters for an empty search without treating it as a new Chronicle", async () => {
    const user = userEvent.setup();
    const model = createEmptyModel({
      searchInput: "Nobody",
      deferredSearchQuery: "Nobody",
      isSearching: true,
      hasActiveQuery: true,
    });
    render(<ChronicleView model={model} />);

    expect(
      screen.getByRole("heading", { name: "No matching entries" }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Clear search and filters" }),
    );
    expect(model.handleClearAll).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole("heading", { name: "The first page is waiting" }),
    ).not.toBeInTheDocument();
  });

  it("explains an empty unfiltered Chronicle without an unnecessary clear action", () => {
    render(<ChronicleView model={createEmptyModel()} />);

    expect(
      screen.getByRole("heading", { name: "The first page is waiting" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("FC activity will appear here as it happens."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Clear search and filters" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Load older entries" }),
    ).not.toBeInTheDocument();
  });

  it("loads older entries explicitly when the current page has no visible entries", async () => {
    const user = userEvent.setup();
    const request = deferredOlderPage();
    const model = createEmptyModel({
      hasNextPage: true,
      loadMore: request.loadMore,
    });
    const { rerender } = render(<ChronicleView model={model} />);

    expect(
      screen.getByRole("heading", { name: "No entries on this page" }),
    ).toBeInTheDocument();
    expect(model.loadMore).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole("button", { name: "Load older entries" }),
    );
    expect(model.loadMore).toHaveBeenCalledOnce();
    rerender(
      <ChronicleView
        model={{ ...model, isFetching: true, isFetchingNextPage: true }}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Loading older entries…" }),
    ).toBeDisabled();
    await request.finish([hiddenNameChange, welcome], false);
    rerender(
      <ChronicleView model={createModel({ loadMore: request.loadMore })} />,
    );

    expect(screen.getByText(welcome.text).closest("li")).toHaveFocus();
    expect(model.loadMore).toHaveBeenCalledOnce();
  });

  it("retries an older page without restarting the Chronicle when no entries are visible", async () => {
    const user = userEvent.setup();
    const request = deferredOlderPage();
    const model = createEmptyModel({
      hasNextPage: true,
      loadMore: request.loadMore,
    });
    const { rerender } = render(<ChronicleView model={model} />);
    await user.click(
      screen.getByRole("button", { name: "Load older entries" }),
    );
    rerender(
      <ChronicleView
        model={{ ...model, isError: true, isFetchNextPageError: true }}
      />,
    );
    await request.finish([hiddenNameChange], true, true);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Couldn't load older entries. You can try again.",
    );
    expect(
      screen.queryByRole("heading", { name: "Couldn't open the Chronicle" }),
    ).not.toBeInTheDocument();
    const retry = screen.getByRole("button", { name: "Try loading again" });
    expect(retry).toHaveFocus();
    await user.click(retry);
    expect(model.loadMore).toHaveBeenCalledTimes(2);
    expect(model.refetch).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    "settles focus after an older page contains only hidden name changes (more pages: %s)",
    async (hasNextPage) => {
      const user = userEvent.setup();
      const request = deferredOlderPage();
      const model = createEmptyModel({
        hasNextPage: true,
        loadMore: request.loadMore,
      });
      const { rerender } = render(<ChronicleView model={model} />);
      await user.click(
        screen.getByRole("button", { name: "Load older entries" }),
      );
      rerender(
        <ChronicleView
          model={{ ...model, isFetching: true, isFetchingNextPage: true }}
        />,
      );
      // Disabled buttons can drop browser focus onto the document body.
      (document.activeElement as HTMLElement).blur();
      await request.finish([hiddenNameChange], hasNextPage);
      rerender(<ChronicleView model={{ ...model, hasNextPage }} />);

      expect(
        hasNextPage
          ? screen.getByRole("button", { name: "Load older entries" })
          : screen.getByRole("heading", { name: "The first page is waiting" }),
      ).toHaveFocus();
      expect(model.loadMore).toHaveBeenCalledOnce();
      expect(screen.queryByText(hiddenNameChange.text)).not.toBeInTheDocument();
      await user.click(screen.getByRole("searchbox"));
      rerender(<ChronicleView model={{ ...model, hasNextPage }} />);
      expect(screen.getByRole("searchbox")).toHaveFocus();
    },
  );

  it("retains visible entries and focuses the endnote after a hidden-only final page", async () => {
    const user = userEvent.setup();
    const request = deferredOlderPage();
    const model = createModel({
      hasNextPage: true,
      loadMore: request.loadMore,
    });
    const { rerender } = render(<ChronicleView model={model} />);
    await user.click(
      screen.getByRole("button", { name: "Load older entries" }),
    );
    rerender(<ChronicleView model={{ ...model, hasNextPage: false }} />);
    await request.finish([welcome, hiddenNameChange], false);

    expect(screen.getByText(welcome.text)).toBeInTheDocument();
    expect(
      screen.getByText("You've reached the beginning of the Chronicle."),
    ).toHaveFocus();
  });

  it("renders entries in their day group and loads older activity only on request", async () => {
    const user = userEvent.setup();
    const model = createModel({ hasNextPage: true });
    render(<ChronicleView model={model} />);
    const day = screen.getByRole("region", {
      name: "Entries from September 28",
    });

    expect(within(day).getByText(welcome.text)).toBeInTheDocument();
    expect(within(day).getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("1 entry loaded")).toBeInTheDocument();
    expect(model.loadMore).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole("button", { name: "Load older entries" }),
    );
    expect(model.loadMore).toHaveBeenCalledOnce();
  });

  it("keeps loaded entries available while an older page loads", () => {
    render(
      <ChronicleView
        model={createModel({
          hasNextPage: true,
          isFetching: true,
          isFetchingNextPage: true,
        })}
      />,
    );

    expect(screen.getByText(welcome.text)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Loading older entries…" }),
    ).toBeDisabled();
    expect(
      screen.queryByText("Catching up on the FC…"),
    ).not.toBeInTheDocument();
  });

  it.each(["loading", "error"])(
    "keeps early live entries without claiming history is complete during an initial %s",
    (state) => {
      render(
        <ChronicleView
          model={createModel({
            isLoading: state === "loading",
            isError: state === "error",
          })}
        />,
      );

      expect(screen.getByText(welcome.text)).toBeInTheDocument();
      expect(
        screen.queryByText("You've reached the beginning of the Chronicle."),
      ).not.toBeInTheDocument();
      if (state === "loading") {
        expect(screen.getByText("Loading earlier entries…")).toHaveAttribute(
          "role",
          "status",
        );
      }
    },
  );

  it("retains entries after pagination fails and retries that older page", async () => {
    const user = userEvent.setup();
    const model = createModel({
      hasNextPage: true,
      isError: true,
      isFetchNextPageError: true,
    });
    render(<ChronicleView model={model} />);

    expect(screen.getByText(welcome.text)).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Couldn't load older entries. You can try again.",
    );
    expect(
      screen.queryByRole("heading", { name: "Couldn't open the Chronicle" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try loading again" }));
    expect(model.loadMore).toHaveBeenCalledOnce();
    expect(model.refetch).not.toHaveBeenCalled();
  });

  it("keeps cached activity on a refresh error and retries the refresh", async () => {
    const user = userEvent.setup();
    const model = createModel({ isError: true });
    render(<ChronicleView model={model} />);

    expect(screen.getByText(welcome.text)).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "You can still read the entries below.",
    );
    await user.click(
      within(screen.getByRole("alert")).getByRole("button", {
        name: "Try again",
      }),
    );
    expect(model.refetch).toHaveBeenCalledOnce();
    expect(model.loadMore).not.toHaveBeenCalled();
  });

  it("exposes connection recovery in the workspace header while keeping loaded activity readable", async () => {
    const user = userEvent.setup();
    const model = createModel({ status: "disconnected" });
    render(<ChronicleView model={model} />);
    const connection = screen.getByRole("group", {
      name: "Live connection",
    });

    expect(
      within(connection).getByRole("status", { name: "Live updates offline" }),
    ).toBeInTheDocument();
    await user.click(
      within(connection).getByRole("button", { name: "Reconnect" }),
    );
    expect(model.reconnect).toHaveBeenCalledOnce();
    expect(screen.getByText(welcome.text)).toBeInTheDocument();
  });

  it("marks live entries read only when explicitly requested in all activity", async () => {
    const user = userEvent.setup();
    const model = createModel({ unseenCount: 2 });
    render(<ChronicleView model={model} />);

    expect(screen.getByText("2 new entries")).toBeInTheDocument();
    expect(model.markAllAsSeen).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: "View new entries" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Mark all read" }));

    expect(model.markAllAsSeen).toHaveBeenCalledOnce();
    expect(model.handleClearAll).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: "Recent activity" }),
    ).toHaveFocus();
  });

  it("returns from filtered results to new live entries without marking them read", async () => {
    const user = userEvent.setup();
    const model = createModel({
      unseenCount: 1,
      activeFilter: "MemberJoined",
      hasActiveFilter: true,
      hasActiveQuery: true,
    });
    render(<ChronicleView model={model} />);

    expect(screen.getByText("1 new entry")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Mark all read" }),
    ).not.toBeInTheDocument();
    expect(model.markAllAsSeen).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "View new entries" }));

    expect(model.handleClearAll).toHaveBeenCalledOnce();
    expect(model.markAllAsSeen).not.toHaveBeenCalled();
  });

  it("offers no read action when there are no unseen live entries", () => {
    render(<ChronicleView model={createModel()} />);

    expect(
      screen.queryByRole("button", { name: "Mark all read" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "View new entries" }),
    ).not.toBeInTheDocument();
  });

  it("moves keyboard focus to a loaded day without marking entries read or loading more", async () => {
    const user = userEvent.setup();
    const model = createModel({ unseenCount: 1, hasNextPage: true });
    const earlier: ChronicleEvent = {
      ...welcome,
      id: { timestamp: 2, creationTime: "2026-09-27T18:00:00Z" },
      createdAt: "2026-09-27T18:00:00Z",
      text: "An earlier welcome.",
    };
    model.totalCount = 2;
    model.dayGroups = [
      ...model.dayGroups,
      {
        key: "2026-8-27",
        label: "September 27",
        items: [{ event: earlier, isRealtime: false, isUnseen: false }],
      },
    ];
    render(<ChronicleView model={model} />);
    const index = screen.getByRole("navigation", { name: "Days in this view" });

    await user.click(
      within(index).getByRole("button", {
        name: "Sunday, Sep 27, 2026, 1 entry",
      }),
    );

    expect(screen.getByRole("heading", { name: "September 27" })).toHaveFocus();
    expect(model.markAllAsSeen).not.toHaveBeenCalled();
    expect(model.handleClearAll).not.toHaveBeenCalled();
    expect(model.loadMore).not.toHaveBeenCalled();
    expect(screen.getByText("1 new entry")).toBeInTheDocument();
  });

  it("omits the day index when only one loaded day is available", () => {
    render(<ChronicleView model={createModel({ hasNextPage: true })} />);

    expect(
      screen.queryByRole("navigation", { name: "Days in this view" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Jump to a day" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Load older entries" }),
    ).toBeEnabled();
  });

  it("returns keyboard focus to search without changing the query, filters, or unread state", async () => {
    const user = userEvent.setup();
    const model = createModel({
      searchInput: "Ada",
      deferredSearchQuery: "Ada",
      isSearching: true,
      activeFilter: "MemberJoined",
      hasActiveFilter: true,
      hasActiveQuery: true,
      unseenCount: 2,
      hasNextPage: true,
      totalCount: 2,
    });
    model.dayGroups.push({
      key: "2026-8-27",
      label: "September 27",
      items: [
        {
          event: {
            ...welcome,
            id: { timestamp: 2, creationTime: "2026-09-27T18:00:00Z" },
            createdAt: "2026-09-27T18:00:00Z",
          },
          isRealtime: false,
          isUnseen: false,
        },
      ],
    });
    render(<ChronicleView model={model} />);
    const index = screen.getByRole("navigation", { name: "Days in this view" });
    const input = screen.getByRole("searchbox", {
      name: "Search the Chronicle",
    });
    const back = within(index).getByRole("button", { name: "Back to search" });
    back.focus();

    await user.keyboard("{Enter}");

    expect(input).toHaveFocus();
    expect(input).toHaveValue("Ada");
    expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({
      behavior: "instant",
      block: "center",
    });
    expect(screen.getByRole("combobox", { name: "Activity type" })).toHaveValue(
      "MemberJoined",
    );
    expect(screen.getByText("2 new entries")).toBeInTheDocument();
    expect(model.setSearchInput).not.toHaveBeenCalled();
    expect(model.commitSearch).not.toHaveBeenCalled();
    expect(model.setActiveFilter).not.toHaveBeenCalled();
    expect(model.handleToggleFilter).not.toHaveBeenCalled();
    expect(model.handleClearSearch).not.toHaveBeenCalled();
    expect(model.handleClearAll).not.toHaveBeenCalled();
    expect(model.markAllAsSeen).not.toHaveBeenCalled();
    expect(model.loadMore).not.toHaveBeenCalled();
  });
});

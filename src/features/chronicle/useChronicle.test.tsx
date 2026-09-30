import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ChronicleEvent } from "@/shared/types";
import { useEventsHub } from "@/shared/realtime/useEventsHub";
import { useAuth, type User } from "@/shared/contexts/AuthContext";
import { eventsApi } from "./events";
import { useChronicle } from "./useChronicle";

vi.mock("./events", () => ({ eventsApi: { getEvents: vi.fn() } }));
vi.mock("@/shared/realtime/useEventsHub", () => ({ useEventsHub: vi.fn() }));
vi.mock("@/shared/contexts/AuthContext", () => ({ useAuth: vi.fn() }));

const makeEvent = (
  timestamp: number,
  createdAt: string,
  text = `Event ${timestamp}`,
): ChronicleEvent => ({
  id: { timestamp, creationTime: createdAt },
  createdAt,
  text,
  type: "MemberJoined",
});
const newest = makeEvent(3, "2026-09-28T15:00:00Z");
const older = makeEvent(2, "2026-09-27T15:00:00Z");
const oldest = makeEvent(1, "2026-09-26T15:00:00Z");
let hub: ReturnType<typeof useEventsHub>;
const attachedElements: HTMLElement[] = [];

function mockViewer(memberRank: string | null, overrides: Partial<User> = {}) {
  vi.mocked(useAuth).mockReturnValue({
    user:
      memberRank === null
        ? null
        : {
            memberName: "Test Member",
            memberRank,
            memberPortraitUrl: "",
            discordId: "viewer",
            hasKnighthood: false,
            hasTemporaryKnighthood: false,
            ...overrides,
          },
    isLoading: false,
    isAuthenticated: memberRank !== null,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockViewer("Coeurl Hunter");
  hub = {
    status: "connected",
    realtimeEvents: [],
    unseenCount: 0,
    reconnect: vi.fn(),
    markAllAsSeen: vi.fn(),
    clearEvents: vi.fn(),
  };
  vi.mocked(useEventsHub).mockImplementation(() => hub);
  vi.mocked(eventsApi.getEvents).mockResolvedValue({
    events: [newest],
    nextCursor: "older-page",
    hasMore: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
  attachedElements.splice(0).forEach((element) => element.remove());
});

function renderChronicle() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return renderHook(() => useChronicle(), { wrapper });
}

function attachElement<T extends keyof HTMLElementTagNameMap>(tag: T) {
  const element = document.createElement(tag);
  document.body.append(element);
  attachedElements.push(element);
  return element;
}

describe("Chronicle name-change visibility", () => {
  const savedNameChange = { ...oldest, type: "NameChanged" };
  const liveNameChange = { ...newest, type: "NameChanged" };

  it.each([
    "Coeurl Hunter",
    "Mandragora",
    "Apkallu Seeker",
    "Kupo Shelf",
    "Bom Boko",
    "Unknown rank",
    "",
    null,
  ])("hides saved and live name changes for rank %s", async (rank) => {
    mockViewer(rank);
    hub.realtimeEvents = [liveNameChange];
    hub.unseenCount = 1;
    vi.mocked(eventsApi.getEvents).mockResolvedValue({
      events: [older, savedNameChange],
      hasMore: false,
    });
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.canViewNameChanges).toBe(false);
    expect(result.current.apiEvents).toEqual([older]);
    expect(result.current.displayedEvents).toEqual([older]);
    expect(result.current.totalCount).toBe(1);
    expect(result.current.unseenCount).toBe(0);
    expect(result.current.dayGroups).toHaveLength(1);
    expect(result.current.dayGroups[0].items.map((item) => item.event)).toEqual(
      [older],
    );
  });

  it.each(["Paissa Trainer", "Moogle Knight", "Moogle Guardian"])(
    "shows saved and live name changes for %s and permits filtering them",
    async (rank) => {
      mockViewer(rank);
      hub.realtimeEvents = [liveNameChange];
      hub.unseenCount = 1;
      vi.mocked(eventsApi.getEvents).mockResolvedValue({
        events: [savedNameChange],
        hasMore: false,
      });
      const { result } = renderChronicle();
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.canViewNameChanges).toBe(true);
      expect(result.current.apiEvents).toEqual([savedNameChange]);
      expect(result.current.totalCount).toBe(2);
      expect(result.current.unseenCount).toBe(1);
      expect(result.current.dayGroups).toHaveLength(2);
      act(() => result.current.setActiveFilter("NameChanged"));
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(eventsApi.getEvents).toHaveBeenLastCalledWith(
        expect.objectContaining({ filter: "NameChanged" }),
      );
      expect(result.current.apiEvents).toEqual([savedNameChange]);
    },
  );

  it("uses actual rank even when a lower rank has site or temporary knighthood", async () => {
    mockViewer("Coeurl Hunter", {
      hasKnighthood: true,
      hasTemporaryKnighthood: true,
    });
    vi.mocked(eventsApi.getEvents).mockResolvedValue({
      events: [savedNameChange],
      hasMore: false,
    });
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.canViewNameChanges).toBe(false);
    expect(result.current.totalCount).toBe(0);

    act(() => result.current.setActiveFilter("NameChanged"));
    expect(result.current.activeFilter).toBeNull();
    expect(result.current.hasActiveQuery).toBe(false);
    expect(eventsApi.getEvents).toHaveBeenCalledTimes(1);
  });

  it("preserves the read status of visible live events after hiding name changes", async () => {
    hub.realtimeEvents = [liveNameChange, older, savedNameChange, oldest];
    hub.unseenCount = 2;
    vi.mocked(eventsApi.getEvents).mockResolvedValue({
      events: [],
      hasMore: false,
    });
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.unseenCount).toBe(1);
    expect(
      result.current.dayGroups.flatMap((group) =>
        group.items.map((item) => [item.event, item.isUnseen]),
      ),
    ).toEqual([
      [older, true],
      [oldest, false],
    ]);
  });

  it("filters search results and later pages while keeping hidden-only pages pageable", async () => {
    vi.mocked(eventsApi.getEvents).mockResolvedValue({
      events: [savedNameChange],
      nextCursor: "older-page",
      hasMore: true,
    });
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.totalCount).toBe(0);
    expect(result.current.hasNextPage).toBe(true);

    act(() => result.current.setSearchInput("former name"));
    act(() => result.current.commitSearch());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasActiveQuery).toBe(true);
    expect(result.current.apiEvents).toEqual([]);
    expect(result.current.dayGroups).toEqual([]);
    vi.mocked(eventsApi.getEvents).mockResolvedValueOnce({
      events: [savedNameChange, older],
      hasMore: false,
    });
    await act(async () => {
      await result.current.loadMore();
    });
    await waitFor(() => expect(result.current.totalCount).toBe(1));
    expect(result.current.apiEvents).toEqual([older]);
    expect(result.current.hasNextPage).toBe(false);
  });

  it("immediately removes name changes and a selected name filter after rank loss", async () => {
    mockViewer("Paissa Trainer");
    hub.realtimeEvents = [liveNameChange];
    hub.unseenCount = 1;
    vi.mocked(eventsApi.getEvents).mockResolvedValue({
      events: [savedNameChange],
      hasMore: false,
    });
    const { result, rerender } = renderChronicle();
    await waitFor(() => expect(result.current.totalCount).toBe(2));
    act(() => result.current.setActiveFilter("NameChanged"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockViewer("Coeurl Hunter");
    rerender();
    expect(result.current.canViewNameChanges).toBe(false);
    expect(result.current.activeFilter).toBeNull();
    expect(result.current.totalCount).toBe(0);
    expect(result.current.unseenCount).toBe(0);
    expect(result.current.dayGroups).toEqual([]);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.apiEvents).toEqual([]);
    expect(eventsApi.getEvents).toHaveBeenLastCalledWith(
      expect.objectContaining({ filter: undefined }),
    );
  });
});

describe("Chronicle queries and pagination", () => {
  it("loads the first page without automatically fetching older entries", async () => {
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.totalCount).toBe(1));
    expect(eventsApi.getEvents).toHaveBeenCalledWith({
      cursor: undefined,
      limit: 20,
      query: undefined,
      filter: undefined,
    });
    expect(result.current.hasNextPage).toBe(true);

    vi.useFakeTimers();
    await act(() => vi.advanceTimersByTimeAsync(5000));
    expect(eventsApi.getEvents).toHaveBeenCalledTimes(1);
  });

  it("waits for 300ms of quiet typing before sending the trimmed search", async () => {
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    vi.useFakeTimers();

    act(() => result.current.setSearchInput(" mo "));
    await act(() => vi.advanceTimersByTimeAsync(200));
    act(() => result.current.setSearchInput(" moogle "));
    await act(() => vi.advanceTimersByTimeAsync(299));
    expect(eventsApi.getEvents).toHaveBeenCalledTimes(1);
    expect(result.current.isTransitioning).toBe(true);

    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(eventsApi.getEvents).toHaveBeenLastCalledWith({
      cursor: undefined,
      limit: 20,
      query: "moogle",
      filter: undefined,
    });
    expect(result.current.deferredSearchQuery).toBe("moogle");
    expect(result.current.isTransitioning).toBe(false);
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(eventsApi.getEvents).toHaveBeenCalledTimes(2);
  });

  it("commits Enter immediately and cancels the pending debounce", async () => {
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    vi.useFakeTimers();
    act(() => result.current.setSearchInput("Ada"));
    await act(() => vi.advanceTimersByTimeAsync(100));
    act(() => result.current.commitSearch());

    expect(result.current.deferredSearchQuery).toBe("Ada");
    expect(eventsApi.getEvents).toHaveBeenLastCalledWith({
      cursor: undefined,
      limit: 20,
      query: "Ada",
      filter: undefined,
    });
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(eventsApi.getEvents).toHaveBeenCalledTimes(2);
  });

  it("clears committed and pending search immediately, preserving the selected event type", async () => {
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const search = attachElement("input");
    result.current.searchInputRef.current = search;
    act(() => result.current.setActiveFilter("Announcement"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    vi.useFakeTimers();
    act(() => result.current.setSearchInput("Ada"));
    act(() => result.current.commitSearch());
    act(() => result.current.setSearchInput("Never submit this"));
    act(() => result.current.handleClearSearch());

    expect(result.current.searchInput).toBe("");
    expect(result.current.deferredSearchQuery).toBe("");
    expect(result.current.activeFilter).toBe("Announcement");
    expect(search).toHaveFocus();
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(
      vi
        .mocked(eventsApi.getEvents)
        .mock.calls.some(([params]) => params?.query === "Never submit this"),
    ).toBe(false);
  });

  it("clears all filters and cancels a pending search without marking entries read", async () => {
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const search = attachElement("input");
    result.current.searchInputRef.current = search;
    vi.useFakeTimers();
    act(() => {
      result.current.setSearchInput("Pending");
      result.current.handleToggleFilter("MemberJoined");
    });
    act(() => result.current.handleClearAll());
    await act(() => vi.advanceTimersByTimeAsync(1000));

    expect(result.current.activeFilter).toBeNull();
    expect(result.current.hasActiveQuery).toBe(false);
    expect(result.current.searchInput).toBe("");
    expect(search).toHaveFocus();
    expect(
      vi
        .mocked(eventsApi.getEvents)
        .mock.calls.some(([params]) => params?.query === "Pending"),
    ).toBe(false);
    expect(hub.markAllAsSeen).not.toHaveBeenCalled();
  });

  it("loads older entries on request and deduplicates overlapping cursor pages", async () => {
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.totalCount).toBe(1));
    vi.mocked(eventsApi.getEvents).mockResolvedValueOnce({
      events: [newest, oldest, older],
      hasMore: false,
    });
    await act(async () => {
      await result.current.loadMore();
    });
    await waitFor(() => expect(result.current.totalCount).toBe(3));

    expect(eventsApi.getEvents).toHaveBeenLastCalledWith({
      cursor: "older-page",
      limit: 20,
      query: undefined,
      filter: undefined,
    });
    expect(result.current.apiEvents.map((event) => event.text)).toEqual([
      "Event 3",
      "Event 2",
      "Event 1",
    ]);
    expect(result.current.hasNextPage).toBe(false);
    act(() => {
      void result.current.loadMore();
    });
    expect(eventsApi.getEvents).toHaveBeenCalledTimes(2);
  });

  it("keeps loaded entries after an older-page error and retries only when requested", async () => {
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.totalCount).toBe(1));
    vi.mocked(eventsApi.getEvents).mockRejectedValueOnce(
      new Error("Older page unavailable"),
    );
    await act(async () => {
      await result.current.loadMore();
    });
    await waitFor(() => expect(result.current.isFetchNextPageError).toBe(true));

    expect(result.current.totalCount).toBe(1);
    expect(
      result.current.dayGroups
        .flatMap((group) => group.items)
        .map((item) => item.event),
    ).toEqual([newest]);
    vi.useFakeTimers();
    await act(() => vi.advanceTimersByTimeAsync(10000));
    expect(eventsApi.getEvents).toHaveBeenCalledTimes(2);
    vi.useRealTimers();

    vi.mocked(eventsApi.getEvents).mockResolvedValueOnce({
      events: [older],
      hasMore: false,
    });
    await act(async () => {
      await result.current.loadMore();
    });
    await waitFor(() => expect(result.current.totalCount).toBe(2));
    expect(result.current.isFetchNextPageError).toBe(false);
    expect(eventsApi.getEvents).toHaveBeenCalledTimes(3);
  });

  it("does not duplicate an older-page request when load more is activated twice", async () => {
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.totalCount).toBe(1));
    let resolvePage: (page: {
      events: ChronicleEvent[];
      hasMore: boolean;
    }) => void = () => {};
    vi.mocked(eventsApi.getEvents).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolvePage = resolve;
        }),
    );
    act(() => {
      void result.current.loadMore();
      void result.current.loadMore();
    });
    expect(eventsApi.getEvents).toHaveBeenCalledTimes(2);
    await act(async () => {
      resolvePage({ events: [older], hasMore: false });
    });
    await waitFor(() => expect(result.current.totalCount).toBe(2));
  });

  it("does not offer another page when a response has no usable cursor", async () => {
    vi.mocked(eventsApi.getEvents).mockResolvedValueOnce({
      events: [newest],
      nextCursor: "",
      hasMore: true,
    });
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.totalCount).toBe(1));

    expect(result.current.hasNextPage).toBe(false);
    act(() => {
      void result.current.loadMore();
    });
    expect(eventsApi.getEvents).toHaveBeenCalledTimes(1);
  });

  it("distinguishes an initial request failure from a next-page failure", async () => {
    vi.mocked(eventsApi.getEvents).mockRejectedValueOnce(
      new Error("Unavailable"),
    );
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isFetchNextPageError).toBe(false);
    expect(result.current.totalCount).toBe(0);
    expect(hub.markAllAsSeen).not.toHaveBeenCalled();
  });

  it("does not start an older-page request while a new search is pending", async () => {
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.totalCount).toBe(1));
    vi.useFakeTimers();
    act(() => result.current.setSearchInput("Ada"));
    act(() => {
      void result.current.loadMore();
    });

    expect(eventsApi.getEvents).toHaveBeenCalledTimes(1);
  });
});

describe("Chronicle live and historical entries", () => {
  it("merges live/history duplicates, preserves unseen flags, and groups in chronological order", async () => {
    const liveCopy = {
      ...older,
      id: { timestamp: 0, creationTime: "1970-01-01T00:00:00.000Z" },
      createdAt: "2026-09-27T15:00:00.000Z",
    };
    hub.realtimeEvents = [liveCopy, liveCopy, oldest];
    hub.unseenCount = 2;
    vi.mocked(eventsApi.getEvents).mockResolvedValueOnce({
      events: [newest, older, oldest],
      hasMore: false,
    });
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.apiEvents).toHaveLength(3));
    const items = result.current.dayGroups.flatMap((group) => group.items);

    expect(items.map((item) => item.event.text)).toEqual([
      "Event 3",
      "Event 2",
      "Event 1",
    ]);
    expect(items[1]).toMatchObject({
      event: older,
      isRealtime: true,
      isUnseen: true,
    });
    expect(items[2].isUnseen).toBe(false);
    expect(result.current.totalCount).toBe(3);
    expect(result.current.unseenCount).toBe(1);
    expect(result.current.displayedEvents).toEqual([newest]);
    expect(hub.markAllAsSeen).not.toHaveBeenCalled();
  });

  it("does not merge distinct stable IDs solely because their text and time match", async () => {
    const distinctEvent = { ...newest, id: { ...newest.id, timestamp: 4 } };
    hub.realtimeEvents = [newest];
    hub.unseenCount = 1;
    vi.mocked(eventsApi.getEvents).mockResolvedValueOnce({
      events: [newest, distinctEvent],
      hasMore: false,
    });
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.apiEvents).toHaveLength(2));

    expect(result.current.totalCount).toBe(2);
    expect(result.current.displayedEvents).toEqual([distinctEvent]);
  });

  it("shows API results only while filtered, and restores live entries without marking them read", async () => {
    hub.realtimeEvents = [newest];
    hub.unseenCount = 1;
    vi.mocked(eventsApi.getEvents).mockResolvedValue({
      events: [older],
      hasMore: false,
    });
    const { result } = renderChronicle();
    await waitFor(() => expect(result.current.totalCount).toBe(2));
    act(() => result.current.handleToggleFilter("Announcement"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.totalCount).toBe(1);
    expect(
      result.current.dayGroups
        .flatMap((group) => group.items)
        .every((item) => !item.isRealtime),
    ).toBe(true);
    expect(result.current.unseenCount).toBe(1);
    act(() => result.current.handleToggleFilter("Announcement"));
    expect(result.current.totalCount).toBe(2);
    expect(hub.markAllAsSeen).not.toHaveBeenCalled();
    act(() => result.current.markAllAsSeen());
    expect(hub.markAllAsSeen).toHaveBeenCalledOnce();
  });
});

describe("Chronicle keyboard search", () => {
  it("focuses search with slash while respecting native fields and editable descendants", () => {
    const { result } = renderChronicle();
    const search = attachElement("input");
    result.current.searchInputRef.current = search;
    expect(fireEvent.keyDown(document.body, { key: "/" })).toBe(false);
    expect(search).toHaveFocus();

    for (const tag of ["input", "textarea", "select"] as const) {
      const field = attachElement(tag);
      field.focus();
      expect(fireEvent.keyDown(field, { key: "/" })).toBe(true);
      expect(field).toHaveFocus();
    }
    const editor = attachElement("div");
    editor.contentEditable = "true";
    editor.setAttribute("contenteditable", "true");
    editor.tabIndex = 0;
    const child = document.createElement("span");
    editor.append(child);
    editor.focus();
    expect(fireEvent.keyDown(child, { key: "/" })).toBe(true);
    expect(editor).toHaveFocus();
  });

  it.each([
    { ctrlKey: true },
    { metaKey: true },
    { altKey: true },
    { isComposing: true },
  ])(
    "does not intercept modified or composing slash events: %j",
    (modifier) => {
      const { result } = renderChronicle();
      const search = attachElement("input");
      result.current.searchInputRef.current = search;

      expect(fireEvent.keyDown(document.body, { key: "/", ...modifier })).toBe(
        true,
      );
      expect(search).not.toHaveFocus();
    },
  );
});

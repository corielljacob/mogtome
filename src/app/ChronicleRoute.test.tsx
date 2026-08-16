import { createRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import type { ChronicleEvent } from "@/shared/types";
import { useChronicle } from "@/features/chronicle/useChronicle";
import { ChronicleRoute } from "./ChronicleRoute";

vi.mock("@/features/chronicle/useChronicle", () => ({ useChronicle: vi.fn() }));
vi.mock("@/shared/contexts/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("@/shared/contexts/ThemeContext", () => ({
  useTheme: () => ({
    isDarkMode: false,
    activeEvent: null,
    isEventThemeActive: false,
  }),
}));
const welcome: ChronicleEvent = {
  id: { timestamp: 1, creationTime: "2026-09-28T18:00:00Z" },
  createdAt: "2026-09-28T18:00:00Z",
  type: "MemberJoined",
  text: "Ada Bloom joined Kupo Life.",
};

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

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
  });
  vi.mocked(useChronicle).mockReturnValue(createModel());
});

describe("Chronicle route access", () => {
  it("shows the Chronicle sign-in note without mounting the private feed", async () => {
    const user = userEvent.setup();
    const auth = vi.mocked(useAuth).getMockImplementation()!();
    render(
      <MemoryRouter>
        <ChronicleRoute />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "The Chronicle", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "A little catch-up awaits." }),
    ).toBeInTheDocument();
    expect(useChronicle).not.toHaveBeenCalled();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Meet the members" }),
    ).toHaveAttribute("href", "/members");
    await user.click(
      screen.getByRole("button", { name: "Sign in with Discord" }),
    );
    expect(auth.login).toHaveBeenCalledOnce();
  });

  it("does not mount the feed while authentication is being checked", () => {
    vi.mocked(useAuth).mockReturnValue({
      ...vi.mocked(useAuth).getMockImplementation()!(),
      isLoading: true,
    });
    render(
      <MemoryRouter>
        <ChronicleRoute />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("status", { name: "Checking your membership" }),
    ).toBeInTheDocument();
    expect(useChronicle).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: "Sign in with Discord" }),
    ).not.toBeInTheDocument();
  });

  it("mounts the private feed for an authenticated member", () => {
    vi.mocked(useAuth).mockReturnValue({
      ...vi.mocked(useAuth).getMockImplementation()!(),
      isAuthenticated: true,
    });
    render(
      <MemoryRouter>
        <ChronicleRoute />
      </MemoryRouter>,
    );

    expect(useChronicle).toHaveBeenCalledOnce();
    expect(screen.getByText(welcome.text)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Sign in with Discord" }),
    ).not.toBeInTheDocument();
  });
});

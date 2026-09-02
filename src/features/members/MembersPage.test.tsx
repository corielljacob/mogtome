import { createRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { FreeCompanyMember } from "@/shared/types";
import { useMemberFilters } from "./useMemberFilters";
import { Members } from "./MembersPage";

vi.mock("@/shared/contexts/ThemeContext", () => ({
  useTheme: () => ({
    isDarkMode: false,
    activeEvent: null,
    isEventThemeActive: false,
  }),
}));

vi.mock("./useMemberFilters", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./useMemberFilters")>()),
  useMemberFilters: vi.fn(),
}));

const member: FreeCompanyMember = {
  characterId: "123",
  name: "Ada Bloom",
  freeCompanyRank: "Moogle Guardian",
  freeCompanyRankIcon: "",
  activeMember: true,
  lastUpdatedDate: "2026-09-28",
  avatarLink: "/avatar.png",
};

let filters: ReturnType<typeof useMemberFilters>;

beforeEach(() => {
  filters = {
    searchInputRef: createRef<HTMLInputElement>(),
    searchQuery: "",
    inputValue: "",
    setInputValue: vi.fn(),
    setSearchQuery: vi.fn(),
    selectedRanks: [],
    validSortBy: "rank-asc",
    setSortBy: vi.fn(),
    toggleRank: vi.fn(),
    clearFilters: vi.fn(),
    clearRanks: vi.fn(),
    groupByRank: false,
    setGroupByRank: vi.fn(),
    hasActiveFilters: false,
    deferredSearchQuery: "",
    deferredSelectedRanks: [],
    isFiltering: false,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    allMembers: [member],
    filteredMembers: [member],
    membersByRank: new Map([[member.freeCompanyRank, [member]]]),
    rankCounts: { [member.freeCompanyRank]: 1 },
    searchMatchCount: 1,
  };
});

function renderPage(overrides: Partial<typeof filters> = {}) {
  Object.assign(filters, overrides);
  vi.mocked(useMemberFilters).mockReturnValue(filters);
  return render(
    <MemoryRouter>
      <Members />
    </MemoryRouter>,
  );
}

describe("Members page states", () => {
  it("announces loading without showing an empty directory or enabled filters", () => {
    renderPage({ isLoading: true, allMembers: [], filteredMembers: [] });

    const loadingMessage = screen.getByText("Rounding everyone up, kupo...");
    expect(loadingMessage).toHaveAttribute("role", "status");
    expect(loadingMessage.closest('[aria-busy="true"]')).toBeNull();
    expect(screen.getByRole("searchbox")).toBeDisabled();
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.queryByText("No members yet")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an actionable load error and retries the member request", () => {
    renderPage({ isError: true, allMembers: [], filteredMembers: [] });
    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent(
      "We couldn’t load the member list. Please try again.",
    );
    expect(screen.getByText("Member list unavailable.")).toBeInTheDocument();
    expect(screen.queryByText("Loading members…")).not.toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeDisabled();
    fireEvent.click(within(alert).getByRole("button", { name: "Try again" }));
    expect(filters.refetch).toHaveBeenCalledOnce();
  });

  it("lets members clear a search that returns no matching portraits", () => {
    renderPage({
      inputValue: "Nobody",
      searchQuery: "Nobody",
      deferredSearchQuery: "Nobody",
      hasActiveFilters: true,
      filteredMembers: [],
      searchMatchCount: 0,
    });
    const emptyMessage = screen
      .getByText("No members found")
      .closest('[role="status"]');

    expect(emptyMessage).not.toBeNull();
    fireEvent.click(
      within(emptyMessage as HTMLElement).getByRole("button", {
        name: "Clear filters",
      }),
    );
    expect(filters.clearFilters).toHaveBeenCalledOnce();
    expect(screen.getByRole("searchbox")).not.toBeDisabled();
    expect(screen.getByRole("searchbox")).toHaveFocus();
    expect(
      screen.queryByRole("button", { name: "Search all ranks" }),
    ).not.toBeInTheDocument();
  });

  it("distinguishes a truly empty directory from filters with no matches", () => {
    renderPage({
      allMembers: [],
      filteredMembers: [],
      membersByRank: new Map(),
      rankCounts: {},
    });

    expect(
      screen.getByRole("heading", { name: "No members yet" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Clear filters" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("No members found")).not.toBeInTheDocument();
  });

  it("keeps existing portraits available while deferred filters settle", () => {
    renderPage({ isFiltering: true });
    const link = screen.getByRole("link", {
      name: /View Ada Bloom.*Lodestone/,
    });

    expect(link).toHaveAttribute(
      "href",
      "https://na.finalfantasyxiv.com/lodestone/character/123",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.closest('[aria-busy="true"]')).not.toBeNull();
    expect(screen.getByText("Updating results…")).toHaveAttribute(
      "role",
      "status",
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows a continuous directory by default and groups portraits only when selected", () => {
    const { rerender } = renderPage();
    const groupToggle = screen.getByRole("checkbox", { name: "Group by rank" });

    expect(groupToggle).not.toBeChecked();
    expect(
      screen.queryByRole("heading", { name: "Moogle Guardian" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /View Ada Bloom.*Lodestone/ }),
    ).toBeInTheDocument();

    fireEvent.click(groupToggle);
    expect(filters.setGroupByRank).toHaveBeenCalledWith(true);
    filters.groupByRank = true;
    rerender(
      <MemoryRouter>
        <Members />
      </MemoryRouter>,
    );

    expect(groupToggle).toBeChecked();
    expect(
      screen.getByRole("heading", { name: "Moogle Guardian" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /View Ada Bloom.*Lodestone/ }),
    ).toBeInTheDocument();
  });

  it("removes an active rank chip without clearing the current search", () => {
    renderPage({
      inputValue: "Ada",
      searchQuery: "Ada",
      selectedRanks: ["Moogle Guardian"],
      hasActiveFilters: true,
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Remove Moogle Guardian filter" }),
    );

    expect(filters.toggleRank).toHaveBeenCalledWith("Moogle Guardian");
    expect(filters.setSearchQuery).not.toHaveBeenCalled();
    expect(filters.clearFilters).not.toHaveBeenCalled();
    expect(screen.getByRole("searchbox")).toHaveValue("Ada");
    expect(screen.getByText(/member found/)).toHaveFocus();
  });

  it("removes the active search chip and returns focus to search without clearing ranks", () => {
    renderPage({
      inputValue: "Ada",
      searchQuery: "Ada",
      selectedRanks: ["Moogle Guardian"],
      hasActiveFilters: true,
    });

    fireEvent.click(screen.getByRole("button", { name: "Remove search: Ada" }));

    expect(filters.setInputValue).toHaveBeenCalledWith("");
    expect(filters.setSearchQuery).toHaveBeenCalledWith("");
    expect(filters.clearRanks).not.toHaveBeenCalled();
    expect(filters.clearFilters).not.toHaveBeenCalled();
    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  it("broadens an empty result to all ranks while retaining a matching search", () => {
    renderPage({
      inputValue: "Ada",
      searchQuery: "Ada",
      selectedRanks: ["Moogle Knight"],
      hasActiveFilters: true,
      filteredMembers: [],
      membersByRank: new Map(),
      searchMatchCount: 1,
    });

    expect(
      screen.getByRole("heading", { name: "No members found" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your search matches members in other ranks. Try searching all ranks.",
      ),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Search all ranks" }));

    expect(filters.clearRanks).toHaveBeenCalledOnce();
    expect(filters.setSearchQuery).not.toHaveBeenCalled();
    expect(filters.setInputValue).not.toHaveBeenCalled();
    expect(filters.clearFilters).not.toHaveBeenCalled();
    expect(screen.getByRole("searchbox")).toHaveValue("Ada");
  });
});

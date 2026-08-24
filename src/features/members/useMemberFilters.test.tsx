import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import type { FreeCompanyMember } from "@/shared/types";
import { useMemberFilters, type SortOption } from "./useMemberFilters";

const members: FreeCompanyMember[] = [
  ["1", "Zora Willow", "Moogle Knight"],
  ["2", "Ada Bloom", "Moogle Guardian"],
  ["3", "Bram Fern", "Moogle Knight"],
  ["4", "Cora Mist", "Mandragora"],
].map(([characterId, name, freeCompanyRank]) => ({
  characterId,
  name,
  freeCompanyRank,
  freeCompanyRankIcon: "",
  activeMember: true,
  lastUpdatedDate: "2026-09-28",
  avatarLink: `/avatars/${characterId}.png`,
}));

function FilterHarness() {
  const {
    searchInputRef,
    inputValue,
    setInputValue,
    validSortBy,
    setSortBy,
    toggleRank,
    clearFilters,
    clearRanks,
    groupByRank,
    setGroupByRank,
    filteredMembers,
    selectedRanks,
    hasActiveFilters,
    isFiltering,
    rankCounts,
    searchMatchCount,
  } = useMemberFilters();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <input
        aria-label="Search members"
        ref={searchInputRef}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <select
        aria-label="Sort members"
        value={validSortBy}
        onChange={(event) => setSortBy(event.target.value as SortOption)}
      >
        <option value="rank-asc">Rank</option>
        <option value="name-asc">Name ascending</option>
        <option value="name-desc">Name descending</option>
      </select>
      <button onClick={() => toggleRank("Moogle Knight")}>
        Toggle Knights
      </button>
      <button onClick={clearFilters}>Clear filters</button>
      <button onClick={clearRanks}>Clear ranks</button>
      <button
        onClick={() => setGroupByRank(!groupByRank)}
        aria-pressed={groupByRank}
      >
        Group by rank
      </button>
      <button onClick={() => navigate(-1)}>Back</button>
      <output aria-label="URL parameters">{location.search}</output>
      <output aria-label="Matching members">
        {filteredMembers.map((member) => member.name).join(", ")}
      </output>
      <output aria-label="Selected ranks">{selectedRanks.join(", ")}</output>
      <output aria-label="Filters active">{String(hasActiveFilters)}</output>
      <output aria-label="Filtering pending">{String(isFiltering)}</output>
      <output aria-label="Rank counts">{JSON.stringify(rankCounts)}</output>
      <output aria-label="Search match count">{searchMatchCount}</output>
      <input aria-label="Other input" />
      <textarea aria-label="Notes" />
      <div
        contentEditable
        suppressContentEditableWarning
        tabIndex={0}
        aria-label="Editable note"
      >
        <span data-testid="editable-child">A note</span>
      </div>
    </>
  );
}

function renderFilters(entries = ["/members"]) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  client.setQueryData(["members-all"], {
    items: members,
    totalCount: members.length,
    page: 1,
    pageSize: 1000,
    totalPages: 1,
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={entries} initialIndex={entries.length - 1}>
        <FilterHarness />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function urlParams() {
  return new URLSearchParams(
    screen.getByLabelText("URL parameters").textContent ?? "",
  );
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useMemberFilters", () => {
  it("reads bookmarked search and valid ranks, ignoring unknown ranks and sort values", () => {
    renderFilters([
      "/members?q=moogle&ranks=Moogle%20Knight,Unknown&sort=invalid&page=2",
    ]);

    expect(screen.getByLabelText("Search members")).toHaveValue("moogle");
    expect(screen.getByLabelText("Selected ranks")).toHaveTextContent(
      "Moogle Knight",
    );
    expect(screen.getByLabelText("Selected ranks")).not.toHaveTextContent(
      "Unknown",
    );
    expect(screen.getByLabelText("Sort members")).toHaveValue("rank-asc");
    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      "Bram Fern, Zora Willow",
    );
    expect(urlParams().get("page")).toBe("2");
  });

  it("debounces a search, resets pagination, and retains unrelated URL parameters", () => {
    renderFilters(["/members?page=3&source=album&sort=name-desc"]);
    fireEvent.change(screen.getByLabelText("Search members"), {
      target: { value: "Bram" },
    });

    expect(urlParams().has("q")).toBe(false);
    expect(screen.getByLabelText("Filtering pending")).toHaveTextContent(
      "true",
    );
    act(() => vi.advanceTimersByTime(299));
    expect(urlParams().get("page")).toBe("3");
    act(() => vi.advanceTimersByTime(1));

    expect(urlParams().get("q")).toBe("Bram");
    expect(urlParams().has("page")).toBe(false);
    expect(urlParams().get("source")).toBe("album");
    expect(urlParams().get("sort")).toBe("name-desc");
    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      /^Bram Fern$/,
    );
    expect(screen.getByLabelText("Filtering pending")).toHaveTextContent(
      "false",
    );
  });

  it("deduplicates bookmarked ranks and removes the entire selection when toggled", () => {
    renderFilters([
      "/members?ranks=Moogle%20Knight,Unknown,Moogle%20Knight,Moogle%20Knight",
    ]);

    expect(screen.getByLabelText("Selected ranks")).toHaveTextContent(
      /^Moogle Knight$/,
    );
    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      "Bram Fern, Zora Willow",
    );
    fireEvent.click(screen.getByRole("button", { name: "Toggle Knights" }));
    expect(urlParams().has("ranks")).toBe(false);
    expect(screen.getByLabelText("Filters active")).toHaveTextContent("false");
  });

  it("clears only ranks while retaining search, sort, and unrelated parameters", () => {
    renderFilters([
      "/members?q=moogle&ranks=Mandragora&sort=name-desc&page=2&source=album",
    ]);
    expect(screen.getByLabelText("Matching members")).toBeEmptyDOMElement();
    fireEvent.click(screen.getByRole("button", { name: "Clear ranks" }));
    act(() => vi.advanceTimersByTime(300));

    expect(screen.getByLabelText("Search members")).toHaveValue("moogle");
    expect(screen.getByLabelText("Filters active")).toHaveTextContent("true");
    expect([...urlParams().entries()]).toEqual([
      ["q", "moogle"],
      ["sort", "name-desc"],
      ["source", "album"],
    ]);
    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      "Zora Willow, Bram Fern, Ada Bloom",
    );
  });

  it("counts ranks within the search independently of selected ranks", () => {
    renderFilters(["/members?q=moogle&ranks=Moogle%20Guardian"]);

    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      /^Ada Bloom$/,
    );
    expect(screen.getByLabelText("Search match count")).toHaveTextContent("3");
    expect(
      JSON.parse(screen.getByLabelText("Rank counts").textContent!),
    ).toEqual({
      "Moogle Knight": 2,
      "Moogle Guardian": 1,
    });

    fireEvent.change(screen.getByLabelText("Search members"), {
      target: { value: "Bram" },
    });
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByLabelText("Matching members")).toBeEmptyDOMElement();
    expect(screen.getByLabelText("Search match count")).toHaveTextContent("1");
    expect(
      JSON.parse(screen.getByLabelText("Rank counts").textContent!),
    ).toEqual({
      "Moogle Knight": 1,
    });
  });

  it("starts ungrouped and persists an explicit grouping choice while resetting the page", () => {
    renderFilters(["/members?q=moogle&page=2&source=album"]);
    const groupButton = screen.getByRole("button", { name: "Group by rank" });
    expect(groupButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(groupButton);
    expect(groupButton).toHaveAttribute("aria-pressed", "true");
    expect(urlParams().get("group")).toBe("rank");
    expect(urlParams().has("page")).toBe(false);
    expect(urlParams().get("q")).toBe("moogle");
    expect(urlParams().get("source")).toBe("album");

    fireEvent.click(groupButton);
    expect(groupButton).toHaveAttribute("aria-pressed", "false");
    expect(urlParams().has("group")).toBe(false);
  });

  it("restores bookmarked grouping and clears it when changing to a name sort", () => {
    renderFilters(["/members?group=rank&page=2&source=album"]);
    const groupButton = screen.getByRole("button", { name: "Group by rank" });
    expect(groupButton).toHaveAttribute("aria-pressed", "true");

    fireEvent.change(screen.getByLabelText("Sort members"), {
      target: { value: "name-asc" },
    });
    expect(groupButton).toHaveAttribute("aria-pressed", "false");
    expect(urlParams().has("group")).toBe(false);
    expect(urlParams().has("page")).toBe(false);
    expect(urlParams().get("sort")).toBe("name-asc");
    expect(urlParams().get("source")).toBe("album");
    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      "Ada Bloom, Bram Fern, Cora Mist, Zora Willow",
    );
  });

  it("matches pasted names without surrounding whitespace or case sensitivity", () => {
    renderFilters(["/members?q=%20%20bRaM%20%20"]);

    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      /^Bram Fern$/,
    );
  });

  it("toggles rank filters without losing the query, sort, or unrelated parameters", () => {
    renderFilters(["/members?q=moogle&sort=name-desc&page=2&source=album"]);
    fireEvent.click(screen.getByRole("button", { name: "Toggle Knights" }));

    expect(urlParams().get("ranks")).toBe("Moogle Knight");
    expect(urlParams().get("q")).toBe("moogle");
    expect(urlParams().get("sort")).toBe("name-desc");
    expect(urlParams().get("source")).toBe("album");
    expect(urlParams().has("page")).toBe(false);
    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      "Zora Willow, Bram Fern",
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle Knights" }));
    expect(urlParams().has("ranks")).toBe(false);
    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      "Zora Willow, Bram Fern, Ada Bloom",
    );
  });

  it("changes sort and resets pagination, omitting the default rank sort from the URL", () => {
    renderFilters(["/members?page=2&source=album"]);
    fireEvent.change(screen.getByLabelText("Sort members"), {
      target: { value: "name-desc" },
    });

    expect(urlParams().get("sort")).toBe("name-desc");
    expect(urlParams().has("page")).toBe(false);
    expect(urlParams().get("source")).toBe("album");
    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      "Zora Willow, Cora Mist, Bram Fern, Ada Bloom",
    );

    fireEvent.change(screen.getByLabelText("Sort members"), {
      target: { value: "rank-asc" },
    });
    expect(urlParams().has("sort")).toBe(false);
    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      "Ada Bloom, Bram Fern, Zora Willow, Cora Mist",
    );
  });

  it("clears search and ranks while retaining the chosen sort and unrelated parameters", () => {
    renderFilters([
      "/members?q=Bram&ranks=Moogle%20Knight&sort=name-desc&page=2&source=album",
    ]);
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    act(() => vi.advanceTimersByTime(300));

    expect(screen.getByLabelText("Search members")).toHaveValue("");
    expect(screen.getByLabelText("Filters active")).toHaveTextContent("false");
    expect([...urlParams().entries()]).toEqual([
      ["sort", "name-desc"],
      ["source", "album"],
    ]);
    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      "Zora Willow, Cora Mist, Bram Fern, Ada Bloom",
    );
  });

  it("synchronizes the search field after browser Back and cancels any pending search", () => {
    renderFilters(["/members?q=Ada&page=2", "/members?q=Bram"]);
    fireEvent.change(screen.getByLabelText("Search members"), {
      target: { value: "Unsubmitted" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    act(() => vi.advanceTimersByTime(300));

    expect(screen.getByLabelText("Search members")).toHaveValue("Ada");
    expect(urlParams().get("q")).toBe("Ada");
    expect(urlParams().get("page")).toBe("2");
    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      /^Ada Bloom$/,
    );
  });

  it("cancels a draft when Back restores different filters with the same query", () => {
    renderFilters([
      "/members?q=moogle&ranks=Moogle%20Knight&sort=name-desc&page=2",
      "/members?q=moogle&ranks=Moogle%20Guardian&sort=name-asc&page=3",
    ]);
    fireEvent.change(screen.getByLabelText("Search members"), {
      target: { value: "Unsubmitted" },
    });
    act(() => vi.advanceTimersByTime(200));
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    act(() => vi.advanceTimersByTime(500));

    expect(screen.getByLabelText("Search members")).toHaveValue("moogle");
    expect(urlParams().get("q")).toBe("moogle");
    expect(urlParams().get("ranks")).toBe("Moogle Knight");
    expect(urlParams().get("sort")).toBe("name-desc");
    expect(urlParams().get("page")).toBe("2");
    expect(screen.getByLabelText("Filtering pending")).toHaveTextContent(
      "false",
    );
    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      "Zora Willow, Bram Fern",
    );
  });

  it("preserves a pending draft through an ordinary rank change", () => {
    renderFilters(["/members?q=moogle"]);
    fireEvent.change(screen.getByLabelText("Search members"), {
      target: { value: "Bram" },
    });
    act(() => vi.advanceTimersByTime(150));
    fireEvent.click(screen.getByRole("button", { name: "Toggle Knights" }));

    expect(screen.getByLabelText("Search members")).toHaveValue("Bram");
    expect(screen.getByLabelText("Filtering pending")).toHaveTextContent(
      "true",
    );
    act(() => vi.advanceTimersByTime(300));
    expect(urlParams().get("q")).toBe("Bram");
    expect(urlParams().get("ranks")).toBe("Moogle Knight");
    expect(screen.getByLabelText("Matching members")).toHaveTextContent(
      /^Bram Fern$/,
    );
  });

  it("focuses member search with the slash shortcut", () => {
    renderFilters();
    expect(fireEvent.keyDown(document.body, { key: "/" })).toBe(false);
    expect(screen.getByLabelText("Search members")).toHaveFocus();
  });

  it.each(["Other input", "Notes", "Sort members"])(
    "does not steal slash from %s",
    (label) => {
      renderFilters();
      const field = screen.getByLabelText(label);
      field.focus();

      expect(fireEvent.keyDown(field, { key: "/" })).toBe(true);
      expect(field).toHaveFocus();
    },
  );

  it("does not steal slash from a descendant of a contenteditable region", () => {
    renderFilters();
    const editor = screen.getByLabelText("Editable note");
    editor.focus();

    expect(
      fireEvent.keyDown(screen.getByTestId("editable-child"), { key: "/" }),
    ).toBe(true);
    expect(editor).toHaveFocus();
  });

  it.each([
    { ctrlKey: true },
    { metaKey: true },
    { altKey: true },
    { isComposing: true },
  ])(
    "leaves modified and composing keyboard events untouched: %j",
    (modifier) => {
      renderFilters();
      expect(fireEvent.keyDown(document.body, { key: "/", ...modifier })).toBe(
        true,
      );
      expect(screen.getByLabelText("Search members")).not.toHaveFocus();
    },
  );

  it("respects keyboard events already handled by another control", () => {
    renderFilters();
    const event = new KeyboardEvent("keydown", {
      key: "/",
      bubbles: true,
      cancelable: true,
    });
    event.preventDefault();
    fireEvent(document.body, event);

    expect(screen.getByLabelText("Search members")).not.toHaveFocus();
  });
});

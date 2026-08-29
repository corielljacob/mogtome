import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MembersToolbar } from "./MembersToolbar";
import { RankFilter } from "./RankFilter";

function toolbarProps() {
  return {
    searchInputRef: createRef<HTMLInputElement>(),
    inputValue: "Moogle",
    setInputValue: vi.fn(),
    setSearchQuery: vi.fn(),
    validSortBy: "rank-asc" as const,
    setSortBy: vi.fn(),
  };
}

describe("Member directory controls", () => {
  it("clears both search states and returns focus to search", async () => {
    const user = userEvent.setup();
    const props = toolbarProps();
    render(<MembersToolbar {...props} />);

    expect(
      screen.getByRole("searchbox", { name: "Search members" }),
    ).toHaveAttribute("placeholder", "Name or rank…");
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(props.setInputValue).toHaveBeenCalledWith("");
    expect(props.setSearchQuery).toHaveBeenCalledWith("");
    expect(screen.getByRole("searchbox")).toHaveFocus();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Sort members by" }),
      "name-desc",
    );
    expect(props.setSortBy).toHaveBeenCalledWith("name-desc");
  });

  it("clears search with Escape and applies it immediately with Enter", async () => {
    const user = userEvent.setup();
    const props = toolbarProps();
    render(<MembersToolbar {...props} />);
    const search = screen.getByRole("searchbox");
    search.focus();

    await user.keyboard("{Enter}");
    expect(props.setSearchQuery).toHaveBeenLastCalledWith("Moogle");
    await user.keyboard("{Escape}");
    expect(props.setInputValue).toHaveBeenLastCalledWith("");
    expect(props.setSearchQuery).toHaveBeenLastCalledWith("");
    expect(search).toHaveFocus();
  });

  it.each(["Escape", "Enter"])("leaves %s alone during composition", (key) => {
    const props = toolbarProps();
    render(<MembersToolbar {...props} />);
    fireEvent.keyDown(screen.getByRole("searchbox"), {
      key,
      isComposing: true,
    });
    expect(props.setInputValue).not.toHaveBeenCalled();
    expect(props.setSearchQuery).not.toHaveBeenCalled();
  });

  it("starts with ranks collapsed and reveals selections and counts on request", async () => {
    const user = userEvent.setup();
    const toggleRank = vi.fn();
    render(
      <RankFilter
        selectedRanks={["Moogle Guardian"]}
        toggleRank={toggleRank}
        clearRanks={vi.fn()}
        rankCounts={{ "Moogle Guardian": 1, "Moogle Knight": 4 }}
      />,
    );
    const trigger = screen.getByRole("button", {
      name: "Filter by rank, 1 selected",
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("button", { name: "Moogle Guardian, 1 member" }),
    ).not.toBeInTheDocument();
    expect(
      document.getElementById(trigger.getAttribute("aria-controls")!),
    ).toHaveAttribute("hidden");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Choose one or more ranks.")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Moogle Guardian, 1 member" }),
    ).toHaveAttribute("aria-pressed", "true");
    await user.click(
      screen.getByRole("button", { name: "Moogle Knight, 4 members" }),
    );
    expect(toggleRank).toHaveBeenCalledWith("Moogle Knight");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("group", { name: "Choose member ranks" }),
    ).not.toBeInTheDocument();
  });

  it("resets ranks without clearing the search or invoking clear-all", async () => {
    const user = userEvent.setup();
    const searchProps = toolbarProps();
    const clearRanks = vi.fn();
    const clearFilters = vi.fn();
    render(
      <>
        <MembersToolbar {...searchProps} />
        <RankFilter
          selectedRanks={["Moogle Guardian", "Moogle Knight"]}
          toggleRank={vi.fn()}
          clearRanks={clearRanks}
          clearFilters={clearFilters}
          hasActiveFilters
          filteredCount={1}
          totalCount={5}
          rankCounts={{ "Moogle Guardian": 1, "Moogle Knight": 4 }}
        />
      </>,
    );
    await user.click(
      screen.getByRole("button", { name: "Filter by rank, 2 selected" }),
    );
    await user.click(screen.getByRole("button", { name: "All ranks" }));
    expect(clearRanks).toHaveBeenCalledOnce();
    expect(clearFilters).not.toHaveBeenCalled();
    expect(searchProps.setSearchQuery).not.toHaveBeenCalled();
    expect(screen.getByRole("searchbox")).toHaveValue("Moogle");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("closes the rank panel with Escape and returns focus to its trigger", async () => {
    const user = userEvent.setup();
    render(
      <RankFilter
        selectedRanks={[]}
        toggleRank={vi.fn()}
        clearRanks={vi.fn()}
        rankCounts={{}}
      />,
    );
    const trigger = screen.getByRole("button", {
      name: "Filter by rank, All ranks",
    });
    await user.click(trigger);
    screen.getByRole("button", { name: "All ranks" }).focus();
    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("keeps the disclosure unavailable until members can be filtered", () => {
    render(
      <RankFilter
        selectedRanks={[]}
        toggleRank={vi.fn()}
        rankCounts={{}}
        disabled
      />,
    );
    expect(
      screen.getByRole("button", { name: "Filter by rank, All ranks" }),
    ).toBeDisabled();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("shows matching members and closes the panel with keyboard focus restored", async () => {
    const user = userEvent.setup();
    const toggleRank = vi.fn();
    const clearRanks = vi.fn();
    render(
      <RankFilter
        selectedRanks={["Moogle Guardian"]}
        toggleRank={toggleRank}
        clearRanks={clearRanks}
        rankCounts={{ "Moogle Guardian": 3 }}
        filteredCount={3}
      />,
    );
    const trigger = screen.getByRole("button", {
      name: "Filter by rank, 1 selected",
    });
    await user.click(trigger);
    screen.getByRole("button", { name: "Show 3 members" }).focus();
    await user.keyboard("{Enter}");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
    expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({
      block: "nearest",
      behavior: "instant",
    });
    expect(toggleRank).not.toHaveBeenCalled();
    expect(clearRanks).not.toHaveBeenCalled();
  });

  it.each([
    [1, "Show 1 member"],
    [0, "View results"],
    [undefined, "Show results"],
  ] as const)(
    "labels the results action for a count of %s",
    async (count, label) => {
      const user = userEvent.setup();
      render(
        <RankFilter
          selectedRanks={[]}
          toggleRank={vi.fn()}
          rankCounts={{}}
          filteredCount={count}
        />,
      );
      await user.click(
        screen.getByRole("button", { name: "Filter by rank, All ranks" }),
      );
      expect(screen.getByRole("button", { name: label })).toBeVisible();
    },
  );
});

import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  ChronicleControls,
  type ChronicleControlsModel,
} from "./ChronicleControls";

function createModel(
  overrides: Partial<ChronicleControlsModel> = {},
): ChronicleControlsModel {
  return {
    searchInput: "",
    setSearchInput: vi.fn(),
    activeFilter: null,
    setActiveFilter: vi.fn(),
    searchInputRef: createRef<HTMLInputElement>(),
    status: "connected",
    unseenCount: 0,
    reconnect: vi.fn(),
    markAllAsSeen: vi.fn(),
    hasActiveQuery: false,
    handleClearSearch: vi.fn(),
    handleClearAll: vi.fn(),
    handleToggleFilter: vi.fn(),
    commitSearch: vi.fn(),
    canViewNameChanges: false,
    ...overrides,
  };
}

describe("Chronicle controls", () => {
  it("labels search clearly, accepts edits, commits on Enter and clears on Escape", async () => {
    const user = userEvent.setup();
    const model = createModel({ searchInput: "Ada" });
    render(<ChronicleControls model={model} />);
    const search = screen.getByRole("searchbox", {
      name: "Search the Chronicle",
    });

    expect(search).toHaveAttribute("placeholder", "Member name or event…");
    expect(search).toHaveAttribute("aria-keyshortcuts", "/");
    expect(search).toHaveAccessibleDescription("Results update as you type.");
    expect(
      screen.getByRole("search", { name: "Chronicle search and filters" }),
    ).toContainElement(search);
    fireEvent.change(search, { target: { value: "Ada Bloom" } });
    expect(model.setSearchInput).toHaveBeenCalledWith("Ada Bloom");

    search.focus();
    await user.keyboard("{Enter}");
    expect(model.commitSearch).toHaveBeenCalledOnce();
    await user.keyboard("{Escape}");
    expect(model.handleClearSearch).toHaveBeenCalledOnce();
  });

  it.each(["Enter", "Escape"])(
    "does not consume %s while composing search text",
    (key) => {
      const model = createModel({ searchInput: "Ada" });
      render(<ChronicleControls model={model} />);
      fireEvent.keyDown(screen.getByRole("searchbox"), {
        key,
        isComposing: true,
      });
      expect(model.commitSearch).not.toHaveBeenCalled();
      expect(model.handleClearSearch).not.toHaveBeenCalled();
    },
  );

  it("clears the search independently from clearing all filters", async () => {
    const user = userEvent.setup();
    const model = createModel({
      searchInput: "Ada",
      activeFilter: "MemberJoined",
      hasActiveQuery: true,
    });
    render(<ChronicleControls model={model} />);

    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(model.handleClearSearch).toHaveBeenCalledOnce();
    expect(model.handleClearAll).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(model.handleClearAll).toHaveBeenCalledOnce();
  });

  it("offers all six activity choices to members who can view name changes", () => {
    const model = createModel({ canViewNameChanges: true });
    render(<ChronicleControls model={model} />);
    const activity = screen.getByRole("combobox", { name: "Activity type" });

    expect(activity).toHaveValue("all");
    expect(
      within(activity)
        .getAllByRole("option")
        .map((option) => option.textContent),
    ).toEqual([
      "All activity",
      "Announcements",
      "New members",
      "Returning members",
      "Rank changes",
      "Name changes",
    ]);
    expect(
      screen.queryByRole("button", { name: "All activity" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Announcements" }),
    ).not.toBeInTheDocument();
  });

  it("omits name changes when the viewer does not have access", () => {
    render(<ChronicleControls model={createModel()} />);

    expect(
      screen.queryByRole("option", { name: "Name changes" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("option").map((option) => option.textContent),
    ).toEqual([
      "All activity",
      "Announcements",
      "New members",
      "Returning members",
      "Rank changes",
    ]);
  });

  it("keeps the selected activity in sync and preserves search when selecting All activity", async () => {
    const user = userEvent.setup();
    const model = createModel({
      searchInput: "Ada",
      activeFilter: "MemberJoined",
    });
    const { rerender } = render(<ChronicleControls model={model} />);
    const activity = screen.getByRole("combobox", { name: "Activity type" });

    expect(activity).toHaveValue("MemberJoined");
    expect(
      within(activity).getByRole("option", {
        name: "New members",
        selected: true,
      }),
    ).toBeInTheDocument();
    await user.selectOptions(activity, "Announcement");
    expect(model.setActiveFilter).toHaveBeenCalledWith("Announcement");
    rerender(
      <ChronicleControls model={{ ...model, activeFilter: "Announcement" }} />,
    );
    expect(activity).toHaveValue("Announcement");
    await user.selectOptions(activity, "all");
    expect(model.setActiveFilter).toHaveBeenLastCalledWith(null);
    expect(model.handleClearSearch).not.toHaveBeenCalled();
    expect(model.handleClearAll).not.toHaveBeenCalled();
    expect(screen.getByRole("searchbox")).toHaveValue("Ada");
  });

  it("only offers Clear all when a search or category is active", () => {
    const model = createModel();
    const { rerender } = render(<ChronicleControls model={model} />);
    expect(
      screen.queryByRole("button", { name: "Clear all" }),
    ).not.toBeInTheDocument();

    rerender(
      <ChronicleControls model={{ ...model, activeFilter: "RankPromoted" }} />,
    );
    expect(
      screen.getByRole("button", { name: "Clear all" }),
    ).toBeInTheDocument();
    rerender(<ChronicleControls model={{ ...model, hasActiveQuery: true }} />);
    expect(
      screen.getByRole("button", { name: "Clear all" }),
    ).toBeInTheDocument();
  });

  it("disables search, activity selection, and clearing together", async () => {
    const user = userEvent.setup();
    const model = createModel({ searchInput: "Ada" });
    render(<ChronicleControls model={model} disabled />);

    expect(screen.getByRole("searchbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Clear search" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Clear all" })).toBeDisabled();
    const activity = screen.getByRole("combobox", { name: "Activity type" });
    expect(activity).toBeDisabled();
    await user.selectOptions(activity, "Announcement");
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(model.setActiveFilter).not.toHaveBeenCalled();
    expect(model.handleClearAll).not.toHaveBeenCalled();
  });
});

import { describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import type { FreeCompanyMember } from "@/shared/types";
import { PaginatedMemberGrid } from "./PaginatedMemberGrid";

vi.mock("./MemberCard", () => ({
  MemberCard: ({ member }: { member: FreeCompanyMember }) => (
    <a href={`#${member.characterId}`}>{member.name}</a>
  ),
}));

const members: FreeCompanyMember[] = Array.from({ length: 5 }, (_, index) => ({
  name: `Member ${index + 1}`,
  characterId: String(index + 1),
  freeCompanyRank: index < 3 ? "Moogle Guardian" : "Moogle Knight",
  freeCompanyRankIcon: "",
  avatarLink: "",
  activeMember: true,
  lastUpdatedDate: "2026-09-01",
}));

function HistoryControls() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output aria-label="Current query">{location.search}</output>
      <button onClick={() => navigate(-1)}>Browser back</button>
      <select aria-label="Unrelated sort">
        <option>Rank</option>
        <option>Name</option>
      </select>
    </>
  );
}

function renderGrid(query = "", items = members, grouped = false) {
  const byRank = new Map<string, FreeCompanyMember[]>([
    [
      "Moogle Guardian",
      items.filter((member) => member.freeCompanyRank === "Moogle Guardian"),
    ],
    [
      "Moogle Knight",
      items.filter((member) => member.freeCompanyRank === "Moogle Knight"),
    ],
  ]);
  return render(
    <MemoryRouter initialEntries={[`/members${query}`]}>
      <HistoryControls />
      <PaginatedMemberGrid
        members={items}
        pageSize={2}
        showGrouped={grouped}
        membersByRank={byRank}
      />
    </MemoryRouter>,
  );
}

describe("Members pages", () => {
  it("preserves a direct link to a later page and browser back navigation", async () => {
    const user = userEvent.setup();
    renderGrid("?page=2&sort=name-asc");

    expect(screen.getByRole("link", { name: "Member 3" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Member 1" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("Members 3–4 of 5")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Go to next page" }));
    expect(screen.getByRole("link", { name: "Member 5" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to next page" }),
    ).toBeDisabled();
    expect(screen.getByLabelText("Current query")).toHaveTextContent(
      "page=3&sort=name-asc",
    );
    expect(
      screen.getByRole("region", { name: "Members, page 3 of 3" }),
    ).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Browser back" }));
    expect(screen.getByRole("link", { name: "Member 3" })).toBeInTheDocument();
  });

  it.each(["banana", "-2", "1.5", "Infinity"])(
    "recovers from an invalid page query: %s",
    async (page) => {
      renderGrid(`?page=${page}&q=Member`);
      expect(
        screen.getByRole("link", { name: "Member 1" }),
      ).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByLabelText("Current query")).toHaveTextContent(
          "?q=Member",
        );
      });
      expect(screen.getByLabelText("Current query")).not.toHaveTextContent(
        "page=",
      );
    },
  );

  it("clamps a page that falls beyond the last member", async () => {
    renderGrid("?page=999");
    expect(screen.getByRole("link", { name: "Member 5" })).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByLabelText("Current query")).toHaveTextContent(
        "?page=3",
      ),
    );
    expect(screen.getAllByText("Members 5–5 of 5")).toHaveLength(2);
  });

  it("paginates across rank boundaries using the official names", () => {
    renderGrid("?page=2", members, true);
    expect(
      screen.getByRole("heading", { name: "Moogle Guardian" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Moogle Knight" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(
      ["Member 3", "Member 4"],
    );
  });

  it("leaves arrow keys alone in native selects and other focused controls", () => {
    renderGrid();
    const select = screen.getByRole("combobox", { name: "Unrelated sort" });
    select.focus();
    expect(fireEvent.keyDown(select, { key: "ArrowRight" })).toBe(true);
    expect(screen.getByRole("link", { name: "Member 1" })).toBeInTheDocument();
    expect(screen.getByLabelText("Current query")).toHaveTextContent("");
  });

  it("honors the manual reduced-motion setting when turning a page", async () => {
    const user = userEvent.setup();
    document.documentElement.classList.add("reduce-motion");
    try {
      renderGrid();
      await user.click(screen.getByRole("button", { name: "Go to next page" }));
      expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({
        behavior: "instant",
        block: "start",
      });
    } finally {
      document.documentElement.classList.remove("reduce-motion");
    }
  });

  it("jumps to any members page while retaining filters and supports browser back", async () => {
    const user = userEvent.setup();
    const manyMembers = Array.from({ length: 35 }, (_, index) => ({
      ...members[0],
      name: `Member ${index + 1}`,
      characterId: String(index + 1),
    }));
    renderGrid("?page=2&q=Member&sort=name-desc&source=album", manyMembers);
    const jump = screen.getByRole("combobox", { name: "Go to page" });
    expect(within(jump).getAllByRole("option")).toHaveLength(18);

    await user.selectOptions(jump, "18");
    expect(screen.getByRole("link", { name: "Member 35" })).toBeInTheDocument();
    expect(screen.getAllByText("Members 35–35 of 35")).toHaveLength(2);
    expect(screen.getByLabelText("Current query")).toHaveTextContent(
      "?page=18&q=Member&sort=name-desc&source=album",
    );
    expect(
      screen.getByRole("region", { name: "Members, page 18 of 18" }),
    ).toHaveFocus();
    expect(
      screen.getByRole("button", { name: "Go to page 18" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("button", { name: "Go to next page, top" }),
    ).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Browser back" }));
    expect(jump).toHaveValue("2");
    expect(screen.getByRole("link", { name: "Member 3" })).toBeInTheDocument();
  });

  it("offers compact first, last, and neighboring page buttons with the current page marked", async () => {
    const user = userEvent.setup();
    const manyMembers = Array.from({ length: 36 }, (_, index) => ({
      ...members[0],
      name: `Member ${index + 1}`,
      characterId: String(index + 1),
    }));
    renderGrid("?page=9", manyMembers);
    const bottom = screen.getByRole("navigation", {
      name: "Member pages, bottom",
    });
    expect(within(bottom).getAllByRole("listitem")).toHaveLength(5);
    for (const page of [1, 8, 9, 10, 18]) {
      expect(
        within(bottom).getByRole("button", { name: `Go to page ${page}` }),
      ).toBeInTheDocument();
    }
    expect(
      within(bottom).getByRole("button", { name: "Go to page 9" }),
    ).toHaveAttribute("aria-current", "page");
    expect(within(bottom).getAllByText("…")).toHaveLength(2);

    await user.click(
      within(bottom).getByRole("button", { name: "Go to page 1" }),
    );
    expect(screen.getByRole("link", { name: "Member 1" })).toBeInTheDocument();
    expect(screen.getByLabelText("Current query").textContent).toBe("");
    expect(
      within(bottom).getByRole("button", { name: "Go to page 1" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("turns pages from the top without requiring a scroll to the bottom", async () => {
    const user = userEvent.setup();
    renderGrid();
    const top = screen.getByRole("navigation", { name: "Member pages, top" });
    expect(
      within(top).getByRole("button", { name: "Go to previous page, top" }),
    ).toBeDisabled();

    await user.click(
      within(top).getByRole("button", { name: "Go to next page, top" }),
    );
    expect(screen.getByRole("link", { name: "Member 3" })).toBeInTheDocument();
    expect(within(top).getByText("Members 3–4 of 5")).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("status")
        .filter((status) => status.getAttribute("aria-live") === "polite"),
    ).toHaveLength(1);
  });

  it("shows only a count when every member fits on one page", () => {
    renderGrid("", members.slice(0, 2));

    expect(screen.getByText("2 members")).toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: "Go to page" }),
    ).not.toBeInTheDocument();
  });

  it("does not navigate or scroll when the current page number is selected", async () => {
    const user = userEvent.setup();
    vi.mocked(Element.prototype.scrollIntoView).mockClear();
    renderGrid("?page=2");
    await user.click(screen.getByRole("button", { name: "Go to page 2" }));

    expect(screen.getByLabelText("Current query")).toHaveTextContent("?page=2");
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
});

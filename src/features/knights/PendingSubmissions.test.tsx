import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { biographyApi } from "@/shared/api/biography";
import { membersApi } from "@/shared/api/members";
import type { BiographySubmission, StaffMember } from "@/shared/types";
import { PendingSubmissions } from "./PendingSubmissions";

vi.mock("@/shared/api/biography", () => ({
  biographyApi: {
    getPendingSubmissions: vi.fn(),
    approveSubmission: vi.fn(),
    rejectSubmission: vi.fn(),
  },
}));

vi.mock("@/shared/api/members", () => ({
  membersApi: { getStaff: vi.fn() },
}));

const ada: StaffMember = {
  name: "Ada Bloom",
  discordId: "discord-ada",
  characterId: "character-ada",
  freeCompanyRank: "Moogle Knight",
  freeCompanyRankIcon: "",
  activeMember: true,
  lastUpdatedDate: "2026-09-28T12:00:00Z",
  avatarLink: "",
  biography: "My current note.\nI enjoy crafting.",
};
const bea: StaffMember = {
  ...ada,
  name: "Bea Branch",
  discordId: "discord-bea",
  characterId: "character-bea",
  biography: undefined,
};
const submittedBiography =
  "  I like exploring Eorzea with friends. ".repeat(8) +
  "\nAsk me about fishing!\nSee you in game.  ";
const firstSubmission: BiographySubmission = {
  id: { timestamp: 123, creationTime: "2026-09-20T18:30:00Z" },
  submissionId: "submission-ada",
  submittedByDiscordId: "discord-ada",
  biography: submittedBiography,
  status: "Pending",
  submittedAt: "2026-09-20T18:30:00Z",
};
const secondSubmission: BiographySubmission = {
  ...firstSubmission,
  submissionId: "submission-bea",
  submittedByDiscordId: "discord-bea",
  biography: "I enjoy gardening and dungeons.",
  submittedAt: "2026-09-22T11:15:00Z",
};
let serverSubmissions: BiographySubmission[];

function renderReviews() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  const invalidate = vi.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { ...render(<PendingSubmissions />, { wrapper }), client, invalidate };
}

describe("Biography review workspace", () => {
  beforeEach(() => {
    vi.mocked(biographyApi.getPendingSubmissions).mockReset();
    vi.mocked(biographyApi.approveSubmission).mockReset();
    vi.mocked(biographyApi.rejectSubmission).mockReset();
    vi.mocked(membersApi.getStaff).mockReset();
    serverSubmissions = [{ ...firstSubmission }, { ...secondSubmission }];
    vi.mocked(biographyApi.getPendingSubmissions).mockImplementation(
      async () => [...serverSubmissions],
    );
    vi.mocked(biographyApi.approveSubmission).mockImplementation(async (id) => {
      serverSubmissions = serverSubmissions.filter(
        (item) => item.submissionId !== id,
      );
    });
    vi.mocked(biographyApi.rejectSubmission).mockImplementation(async (id) => {
      serverSubmissions = serverSubmissions.filter(
        (item) => item.submissionId !== id,
      );
    });
    vi.mocked(membersApi.getStaff).mockResolvedValue({
      totalCount: 2,
      staff: [ada, bea],
    });
  });

  it("shows full submitted prose unchanged, author, rank, and local date, with current text available for comparison", async () => {
    const user = userEvent.setup();
    renderReviews();
    const article = await screen.findByRole("article", { name: "Ada Bloom" });
    const prose = article.querySelector(".dash-bio-proposed .dash-bio-prose");

    expect(prose?.textContent).toBe(submittedBiography);
    expect(within(article).getByText("Moogle Knight")).toBeInTheDocument();
    expect(article.querySelector("time")).toHaveAttribute(
      "datetime",
      "2026-09-20T18:30:00.000Z",
    );
    expect(article.querySelector("time")).toHaveAttribute(
      "title",
      new Date(firstSubmission.submittedAt).toLocaleString(),
    );
    expect(
      screen.getByText("2 biographies waiting for review"),
    ).toBeInTheDocument();
    const compare = within(article).getByText("Compare with current biography");
    expect(compare.closest("details")).not.toHaveAttribute("open");

    await user.click(compare);

    expect(compare.closest("details")).toHaveAttribute("open");
    expect(
      article.querySelector(".dash-bio-current .dash-bio-prose")?.textContent,
    ).toBe(ada.biography);
    expect(biographyApi.approveSubmission).not.toHaveBeenCalled();
    expect(biographyApi.rejectSubmission).not.toHaveBeenCalled();
  });

  it("reviews only pending entries and sorts the queue oldest or newest, leaving invalid dates last", async () => {
    const user = userEvent.setup();
    serverSubmissions.push(
      {
        ...firstSubmission,
        submissionId: "already-approved",
        status: "Approved",
        biography: "Already approved.",
      },
      {
        ...firstSubmission,
        submissionId: "invalid-date",
        submittedByDiscordId: "unknown",
        submittedAt: "invalid",
      },
    );
    renderReviews();
    await screen.findByRole("article", { name: "Ada Bloom" });

    expect(
      screen
        .getAllByRole("article")
        .map((node) => node.querySelector("h3")?.textContent),
    ).toEqual(["Ada Bloom", "Bea Branch", "Discord ID: unknown"]);
    expect(screen.queryByText("Already approved.")).not.toBeInTheDocument();
    expect(screen.getByText("Date unavailable")).toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Review order" }),
      "newest",
    );

    expect(
      screen
        .getAllByRole("article")
        .map((node) => node.querySelector("h3")?.textContent),
    ).toEqual(["Bea Branch", "Ada Bloom", "Discord ID: unknown"]);
  });

  it("filters by member name, biography, or Discord ID and offers a focused clear action for no matches", async () => {
    const user = userEvent.setup();
    renderReviews();
    await screen.findByRole("article", { name: "Ada Bloom" });
    const search = screen.getByRole("searchbox", { name: "Find a biography" });
    fireEvent.change(search, { target: { value: "  ADA  " } });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("1 of 2 pending biographies")).toBeInTheDocument();
    fireEvent.change(search, { target: { value: "GARDENING" } });
    expect(
      screen.getByRole("article", { name: "Bea Branch" }),
    ).toBeInTheDocument();
    fireEvent.change(search, { target: { value: "discord-ada" } });
    expect(
      screen.getByRole("article", { name: "Ada Bloom" }),
    ).toBeInTheDocument();
    fireEvent.change(search, { target: { value: "no matching note" } });
    expect(screen.getByText("No matching biographies")).toBeInTheDocument();
    expect(screen.queryByText("All caught up")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear search" }));

    expect(search).toHaveValue("");
    expect(search).toHaveFocus();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("clears search with Escape without changing the review order or interrupting text composition", async () => {
    const user = userEvent.setup();
    renderReviews();
    const search = await screen.findByRole("searchbox", {
      name: "Find a biography",
    });
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Review order" }),
      "newest",
    );
    await user.type(search, "Ada");
    expect(search).toHaveAccessibleDescription("1 of 2 pending biographies");

    fireEvent.keyDown(search, { key: "Escape", isComposing: true });
    expect(search).toHaveValue("Ada");
    await user.keyboard("{Escape}");

    expect(search).toHaveValue("");
    expect(search).toHaveFocus();
    expect(
      screen.getByRole("status", { name: "Biography results" }),
    ).toHaveTextContent("2 biographies waiting for review");
    expect(screen.getByRole("combobox", { name: "Review order" })).toHaveValue(
      "newest",
    );
    expect(screen.getAllByRole("article")[0]).toHaveAccessibleName(
      "Bea Branch",
    );
  });

  it("approves by submissionId once, blocks conflicting decisions while pending, updates caches, and keeps success feedback", async () => {
    const user = userEvent.setup();
    let finishApproval!: () => void;
    vi.mocked(biographyApi.approveSubmission).mockImplementation(
      (id) =>
        new Promise<void>((resolve) => {
          finishApproval = () => {
            serverSubmissions = serverSubmissions.filter(
              (item) => item.submissionId !== id,
            );
            resolve();
          };
        }),
    );
    const { client, invalidate } = renderReviews();
    const approve = await screen.findByRole("button", {
      name: "Approve biography for Ada Bloom",
    });

    await user.click(approve);

    expect(biographyApi.approveSubmission).toHaveBeenCalledExactlyOnceWith(
      "submission-ada",
    );
    expect(approve).toHaveTextContent("Approving…");
    expect(approve).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Reject biography for Ada Bloom" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Approve biography for Bea Branch" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Refresh biography submissions" }),
    ).toBeDisabled();
    await user.click(approve);
    await user.click(
      screen.getByRole("button", { name: "Reject biography for Ada Bloom" }),
    );
    expect(biographyApi.approveSubmission).toHaveBeenCalledOnce();
    expect(biographyApi.rejectSubmission).not.toHaveBeenCalled();

    await act(async () => finishApproval());

    await waitFor(() =>
      expect(
        screen.queryByRole("article", { name: "Ada Bloom" }),
      ).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("status", { name: "" })).toHaveTextContent(
      "Ada Bloom's biography approved.",
    );
    expect(screen.getByRole("status", { name: "" })).toHaveFocus();
    expect(
      client
        .getQueryData<BiographySubmission[]>(["biography-submissions"])
        ?.map((item) => item.submissionId),
    ).toEqual(["submission-bea"]);
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["biography-submissions"],
    });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["staff"] });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["user-submission", "discord-ada"],
    });
    await waitFor(() =>
      expect(
        screen.getByRole("button", {
          name: "Approve biography for Bea Branch",
        }),
      ).toBeEnabled(),
    );
  });

  it("rejects by submissionId, refreshes the pending and member submission caches, and shows the empty queue", async () => {
    const user = userEvent.setup();
    serverSubmissions = [{ ...firstSubmission }];
    const { invalidate } = renderReviews();
    await user.click(
      await screen.findByRole("button", {
        name: "Reject biography for Ada Bloom",
      }),
    );

    expect(await screen.findByText("All caught up")).toBeInTheDocument();
    expect(biographyApi.rejectSubmission).toHaveBeenCalledExactlyOnceWith(
      "submission-ada",
    );
    expect(biographyApi.approveSubmission).not.toHaveBeenCalled();
    expect(screen.getByRole("status", { name: "" })).toHaveTextContent(
      "Ada Bloom's biography rejected.",
    );
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["biography-submissions"],
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["user-submission", "discord-ada"],
    });
    expect(invalidate).not.toHaveBeenCalledWith({ queryKey: ["staff"] });
  });

  it.each(["approve", "reject"] as const)(
    "keeps a failed %s available with an inline error and allows retry",
    async (decision) => {
      const user = userEvent.setup();
      const api =
        decision === "approve"
          ? biographyApi.approveSubmission
          : biographyApi.rejectSubmission;
      vi.mocked(api).mockRejectedValueOnce(new Error("Unavailable"));
      renderReviews();
      const buttonName = `${decision === "approve" ? "Approve" : "Reject"} biography for Ada Bloom`;
      await user.click(await screen.findByRole("button", { name: buttonName }));

      const error = await screen.findByRole("alert");
      expect(error).toHaveTextContent(
        `Couldn't ${decision} Ada Bloom's biography. Try again.`,
      );
      expect(
        screen.getByRole("article", { name: "Ada Bloom" }),
      ).toHaveAccessibleDescription(error.textContent!);
      expect(screen.getByRole("button", { name: buttonName })).toBeEnabled();
      expect(
        screen
          .getByRole("article", { name: "Ada Bloom" })
          .querySelector(".dash-bio-proposed .dash-bio-prose")?.textContent,
      ).toBe(submittedBiography);

      await user.click(screen.getByRole("button", { name: buttonName }));

      await waitFor(() =>
        expect(
          screen.queryByRole("article", { name: "Ada Bloom" }),
        ).not.toBeInTheDocument(),
      );
      expect(api).toHaveBeenCalledTimes(2);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByRole("status", { name: "" })).toHaveTextContent(
        `${decision === "approve" ? "approved" : "rejected"}.`,
      );
    },
  );

  it("keeps search focus if the reviewer moves there while a decision finishes", async () => {
    const user = userEvent.setup();
    let finish!: () => void;
    vi.mocked(biographyApi.approveSubmission).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finish = () => {
            serverSubmissions = [secondSubmission];
            resolve();
          };
        }),
    );
    renderReviews();
    await user.click(
      await screen.findByRole("button", {
        name: "Approve biography for Ada Bloom",
      }),
    );
    const search = screen.getByRole("searchbox", { name: "Find a biography" });
    await user.click(search);

    await act(async () => finish());

    await waitFor(() =>
      expect(
        screen.queryByRole("article", { name: "Ada Bloom" }),
      ).not.toBeInTheDocument(),
    );
    expect(search).toHaveFocus();
  });

  it("handles unavailable member names without hiding the review queue", async () => {
    vi.mocked(membersApi.getStaff).mockRejectedValue(new Error("Unavailable"));
    renderReviews();

    expect(
      await screen.findByRole("article", { name: "Discord ID: discord-ada" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "Member names couldn't load. Submissions show Discord IDs instead.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Approve biography for Discord ID: discord-ada",
      }),
    ).toBeEnabled();
  });

  it("distinguishes loading errors from an empty queue and lets the reviewer refresh", async () => {
    const user = userEvent.setup();
    vi.mocked(biographyApi.getPendingSubmissions).mockRejectedValueOnce(
      new Error("Unavailable"),
    );
    renderReviews();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Couldn't load biography submissions. Try refreshing.",
    );
    expect(screen.queryByText("All caught up")).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Refresh biography submissions" }),
    );

    expect(
      await screen.findByRole("article", { name: "Ada Bloom" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

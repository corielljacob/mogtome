import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { ComponentProps } from "react";
import type { StaffMember, StaffResponse, User } from "@/shared/types";
import { membersApi } from "@/shared/api/members";
import { useAuth } from "@/shared/contexts/AuthContext";
import type { StaffCard } from "./StaffCard";
import { About } from "./AboutPage";

vi.mock("@/shared/api/members", () => ({
  membersApi: { getStaff: vi.fn() },
}));

vi.mock("@/shared/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/shared/contexts/ThemeContext", () => ({
  useTheme: () => ({
    isDarkMode: false,
    activeEvent: null,
    isEventThemeActive: false,
  }),
}));

vi.mock("./StaffCard", () => ({
  StaffCard: ({
    member,
    isLeader,
    isCurrentUser,
    isOwnEditable,
  }: ComponentProps<typeof StaffCard>) => (
    <article
      aria-label={member.name}
      data-leader={String(isLeader)}
      data-current-user={String(isCurrentUser)}
      data-editable={String(isOwnEditable)}
    >
      <h4>{member.name}</h4>
      <p>{member.freeCompanyRank}</p>
      <p>{member.biography}</p>
    </article>
  ),
}));

function staffMember(
  characterId: string,
  name: string,
  freeCompanyRank: string,
): StaffMember {
  return {
    characterId,
    name,
    freeCompanyRank,
    freeCompanyRankIcon: "",
    activeMember: true,
    lastUpdatedDate: "2026-09-28",
    avatarLink: `/avatars/${characterId}.png`,
    biography: `${name}'s own words.`,
  };
}

const staff = [
  staffMember("1", "Zoe Petal", "Moogle Knight"),
  staffMember("2", "Aster Cloud", "Paissa Trainer"),
  staffMember("3", "Zed Pom", "Moogle Guardian"),
  staffMember("4", "Ada Bloom", "Moogle Knight"),
  staffMember("5", "Unknown Friend", "A future rank"),
];

const currentUser: User = {
  memberName: "Ada Bloom",
  memberRank: "Moogle Knight",
  memberPortraitUrl: "/ada.png",
  hasKnighthood: true,
  hasTemporaryKnighthood: false,
  discordId: "ada-discord",
};

const queryClients: QueryClient[] = [];
let auth: ReturnType<typeof useAuth>;

beforeEach(() => {
  vi.mocked(membersApi.getStaff).mockReset();
  auth = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
  };
  vi.mocked(useAuth).mockImplementation(() => auth);
});

afterEach(() => {
  queryClients.splice(0).forEach((client) => client.clear());
});

function renderAbout() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  queryClients.push(client);
  const view = render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <About />
      </MemoryRouter>
    </QueryClientProvider>,
  );
  return { ...view, client };
}

function staffRegion() {
  return screen.getByRole("region", { name: "Our crew" });
}

describe("About Kupo Life", () => {
  it("loads public staff without signing in and sorts by rank, then member name", async () => {
    const response: StaffResponse = {
      totalCount: staff.length,
      staff: [...staff],
    };
    vi.mocked(membersApi.getStaff).mockResolvedValue(response);
    renderAbout();

    await within(staffRegion()).findByRole("article", { name: "Ada Bloom" });

    expect(
      within(staffRegion())
        .getAllByRole("article")
        .map((card) => card.getAttribute("aria-label")),
    ).toEqual([
      "Zed Pom",
      "Ada Bloom",
      "Zoe Petal",
      "Aster Cloud",
      "Unknown Friend",
    ]);
    expect(response.staff).toEqual(staff);
    expect(membersApi.getStaff).toHaveBeenCalledOnce();
    expect(auth.login).not.toHaveBeenCalled();
  });

  it("marks the Guardian as leader without labeling other staff as leaders", async () => {
    vi.mocked(membersApi.getStaff).mockResolvedValue({
      totalCount: staff.length,
      staff,
    });
    renderAbout();

    const leader = await within(staffRegion()).findByRole("article", {
      name: "Zed Pom",
    });
    expect(leader).toHaveAttribute("data-leader", "true");
    for (const card of within(staffRegion()).getAllByRole("article")) {
      if (card !== leader) expect(card).toHaveAttribute("data-leader", "false");
    }
  });

  it("keeps unfamiliar ranks in distinct groups after known ranks even when names would interleave", async () => {
    const mixedRanks = [
      staffMember("unknown-a-last", "Zeta Cloud", "Unknown A"),
      staffMember("unknown-b", "Beta Leaf", "Unknown B"),
      staffMember("known", "Known Knight", "Moogle Knight"),
      staffMember("unknown-a-first", "Alpha Bloom", "Unknown A"),
    ];
    vi.mocked(membersApi.getStaff).mockResolvedValue({
      totalCount: mixedRanks.length,
      staff: mixedRanks,
    });
    renderAbout();
    await within(staffRegion()).findByRole("article", { name: "Alpha Bloom" });

    expect(
      within(staffRegion())
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(["Moogle Knight", "Unknown A", "Unknown B"]);
    const groupA = within(staffRegion()).getByRole("region", {
      name: "Unknown A",
    });
    expect(
      within(groupA)
        .getAllByRole("article")
        .map((card) => card.getAttribute("aria-label")),
    ).toEqual(["Alpha Bloom", "Zeta Cloud"]);
    const groupB = within(staffRegion()).getByRole("region", {
      name: "Unknown B",
    });
    expect(within(groupB).getAllByRole("article")).toHaveLength(1);
    expect(
      within(groupB).getByRole("article", { name: "Beta Leaf" }),
    ).toBeInTheDocument();
  });

  it("does not assign leadership to a lower rank when no Guardian is listed", async () => {
    const withoutGuardian = staff.filter(
      (member) => member.freeCompanyRank !== "Moogle Guardian",
    );
    vi.mocked(membersApi.getStaff).mockResolvedValue({
      totalCount: withoutGuardian.length,
      staff: withoutGuardian,
    });
    renderAbout();

    await within(staffRegion()).findByRole("article", { name: "Ada Bloom" });
    for (const card of within(staffRegion()).getAllByRole("article")) {
      expect(card).toHaveAttribute("data-leader", "false");
    }
  });

  it.each([
    {
      description: "permanent knight",
      isAuthenticated: true,
      hasKnighthood: true,
      hasTemporaryKnighthood: false,
      editable: true,
    },
    {
      description: "temporary knight",
      isAuthenticated: true,
      hasKnighthood: false,
      hasTemporaryKnighthood: true,
      editable: false,
    },
    {
      description: "ordinary member",
      isAuthenticated: true,
      hasKnighthood: false,
      hasTemporaryKnighthood: false,
      editable: false,
    },
    {
      description: "signed-out visitor with stale user data",
      isAuthenticated: false,
      hasKnighthood: true,
      hasTemporaryKnighthood: false,
      editable: false,
    },
  ])(
    "grants only the current member's permitted biography editing for a $description",
    async ({
      isAuthenticated,
      hasKnighthood,
      hasTemporaryKnighthood,
      editable,
    }) => {
      auth = {
        ...auth,
        isAuthenticated,
        user: { ...currentUser, hasKnighthood, hasTemporaryKnighthood },
      };
      vi.mocked(membersApi.getStaff).mockResolvedValue({
        totalCount: staff.length,
        staff,
      });
      renderAbout();

      const ownCard = await within(staffRegion()).findByRole("article", {
        name: "Ada Bloom",
      });
      expect(ownCard).toHaveAttribute(
        "data-current-user",
        String(isAuthenticated),
      );
      expect(ownCard).toHaveAttribute("data-editable", String(editable));
      for (const card of within(staffRegion()).getAllByRole("article")) {
        if (card === ownCard) continue;
        expect(card).toHaveAttribute("data-current-user", "false");
        expect(card).toHaveAttribute("data-editable", "false");
      }
    },
  );

  it("shows public content and a staff loading announcement while auth is still resolving", () => {
    auth = { ...auth, isLoading: true };
    vi.mocked(membersApi.getStaff).mockReturnValue(new Promise(() => {}));
    renderAbout();

    expect(
      screen.getByRole("heading", { level: 1, name: "About Kupo Life" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Our crew" }),
    ).toBeInTheDocument();
    expect(within(staffRegion()).getByRole("status")).toHaveTextContent(
      "Rounding everyone up, kupo...",
    );
    expect(
      within(staffRegion()).queryByRole("article"),
    ).not.toBeInTheDocument();
    expect(within(staffRegion()).queryByRole("alert")).not.toBeInTheDocument();
    expect(membersApi.getStaff).toHaveBeenCalledOnce();
    expect(auth.login).not.toHaveBeenCalled();
  });

  it("keeps public story facts available after a staff error and retries the staff request", async () => {
    const user = userEvent.setup();
    vi.mocked(membersApi.getStaff)
      .mockRejectedValueOnce(new Error("Staff unavailable"))
      .mockResolvedValueOnce({ totalCount: 1, staff: [staff[0]] });
    renderAbout();

    const alert = await within(staffRegion()).findByRole("alert");
    expect(alert).toHaveTextContent("Couldn’t load the crew.");
    expect(
      screen.getByRole("heading", { level: 1, name: "About Kupo Life" }),
    ).toBeInTheDocument();
    expect(document.body).toHaveTextContent("Zalera");
    expect(document.body).toHaveTextContent("Crystal");
    expect(document.body).toHaveTextContent(/screenshot competitions/i);
    expect(document.body).toHaveTextContent(/treasure hunts/i);
    expect(document.body).toHaveTextContent(/Discord/);
    expect(
      within(staffRegion()).queryByRole("article"),
    ).not.toBeInTheDocument();

    await user.click(within(alert).getByRole("button", { name: /try again/i }));

    expect(
      await within(staffRegion()).findByRole("article", { name: "Zoe Petal" }),
    ).toBeInTheDocument();
    await waitFor(() => expect(membersApi.getStaff).toHaveBeenCalledTimes(2));
    expect(within(staffRegion()).queryByRole("alert")).not.toBeInTheDocument();
    expect(auth.login).not.toHaveBeenCalled();
  });

  it("explains an empty staff roster without reporting an error or hiding the About page", async () => {
    vi.mocked(membersApi.getStaff).mockResolvedValue({
      totalCount: 0,
      staff: [],
    });
    renderAbout();

    expect(
      await within(staffRegion()).findByRole("heading", {
        name: "No crew profiles yet",
      }),
    ).toBeInTheDocument();
    expect(within(staffRegion()).queryByRole("alert")).not.toBeInTheDocument();
    expect(
      within(staffRegion()).queryByRole("article"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "About Kupo Life" }),
    ).toBeInTheDocument();
  });

  it("retains loaded staff when a background refresh fails and offers another retry", async () => {
    const user = userEvent.setup();
    const response = { totalCount: staff.length, staff };
    vi.mocked(membersApi.getStaff)
      .mockResolvedValueOnce(response)
      .mockRejectedValueOnce(new Error("Refresh unavailable"))
      .mockResolvedValueOnce(response);
    const { client } = renderAbout();
    await within(staffRegion()).findByRole("article", { name: "Ada Bloom" });

    await act(async () => {
      await client.invalidateQueries({ queryKey: ["staff"] });
    });

    const alert = await within(staffRegion()).findByRole("alert");
    expect(alert).toHaveTextContent("Couldn’t refresh the crew.");
    expect(within(staffRegion()).getAllByRole("article")).toHaveLength(5);
    expect(
      screen.getByRole("searchbox", { name: "Search the crew" }),
    ).toBeEnabled();
    await user.click(within(alert).getByRole("button", { name: "Try again" }));

    await waitFor(() => {
      expect(
        within(staffRegion()).queryByRole("alert"),
      ).not.toBeInTheDocument();
    });
    expect(within(staffRegion()).getAllByRole("article")).toHaveLength(5);
    expect(membersApi.getStaff).toHaveBeenCalledTimes(3);
  });

  it("searches staff names and biographies without another API request", async () => {
    const user = userEvent.setup();
    const searchableStaff = staff.map((member) =>
      member.name === "Zoe Petal"
        ? { ...member, biography: "Ask me about crafting and treasure maps." }
        : member,
    );
    vi.mocked(membersApi.getStaff).mockResolvedValue({
      totalCount: searchableStaff.length,
      staff: searchableStaff,
    });
    renderAbout();
    await within(staffRegion()).findByRole("article", { name: "Zoe Petal" });
    const search = screen.getByRole("searchbox", { name: "Search the crew" });

    await user.type(search, "crafting");

    await waitFor(() => {
      expect(within(staffRegion()).getAllByRole("article")).toHaveLength(1);
    });
    expect(
      within(staffRegion()).getByRole("article", { name: "Zoe Petal" }),
    ).toBeInTheDocument();
    expect(
      within(staffRegion()).getByText("1 of 5 crew members shown"),
    ).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "ADA");

    await waitFor(() => {
      expect(within(staffRegion()).getAllByRole("article")).toHaveLength(1);
    });
    expect(
      within(staffRegion()).getByRole("article", { name: "Ada Bloom" }),
    ).toBeInTheDocument();
    expect(membersApi.getStaff).toHaveBeenCalledOnce();
  });

  it("combines rank and search filters and clears an empty result back to the full roster", async () => {
    const user = userEvent.setup();
    vi.mocked(membersApi.getStaff).mockResolvedValue({
      totalCount: staff.length,
      staff,
    });
    renderAbout();
    await within(staffRegion()).findByRole("article", { name: "Ada Bloom" });
    const rank = screen.getByRole("combobox", { name: "Rank" });
    const search = screen.getByRole("searchbox", { name: "Search the crew" });

    await user.selectOptions(rank, "Moogle Knight");
    await waitFor(() => {
      expect(within(staffRegion()).getAllByRole("article")).toHaveLength(2);
    });
    expect(
      within(staffRegion()).getByText("2 of 5 crew members shown"),
    ).toBeInTheDocument();

    await user.type(search, "Zed");

    expect(
      await within(staffRegion()).findByRole("heading", {
        name: "No matching crew members",
      }),
    ).toBeInTheDocument();
    expect(
      within(staffRegion()).queryByRole("article"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "About Kupo Life" }),
    ).toBeInTheDocument();
    await user.click(
      within(staffRegion()).getAllByRole("button", {
        name: "Clear filters",
      })[0],
    );

    expect(search).toHaveValue("");
    expect(rank).toHaveValue("");
    await waitFor(() => {
      expect(within(staffRegion()).getAllByRole("article")).toHaveLength(5);
    });
    expect(
      within(staffRegion()).getByText("5 of 5 crew members shown"),
    ).toBeInTheDocument();
    expect(
      within(staffRegion()).queryByRole("heading", {
        name: "No matching crew members",
      }),
    ).not.toBeInTheDocument();
    expect(membersApi.getStaff).toHaveBeenCalledOnce();
  });
});

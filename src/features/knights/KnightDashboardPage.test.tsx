import { useState, type ComponentProps, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { biographyApi } from "@/shared/api/biography";
import type { BiographySubmission } from "@/shared/types";
import {
  useCharacterMapping,
  type UseCharacterMappingResult,
} from "@/features/characterMapping/hooks/useCharacterMapping";
import type { CharacterMapping as CharacterMappingComponent } from "@/features/characterMapping/CharacterMapping";
import { KnightDashboard } from "./KnightDashboardPage";

const { mappingProps } = vi.hoisted(() => ({ mappingProps: vi.fn() }));

vi.mock("@/shared/api/biography", () => ({
  biographyApi: { getPendingSubmissions: vi.fn() },
}));

vi.mock("@/shared/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { memberName: "Ada Bloom" } }),
}));

vi.mock("@/shared/contexts/ThemeContext", () => ({
  useTheme: () => ({
    isDarkMode: false,
    activeEvent: null,
    isEventThemeActive: false,
  }),
}));

vi.mock("@/features/home/components/NookRoomDecor", () => ({
  NookRoomDecor: () => null,
}));

vi.mock("@/features/home/components/NookFairyLights", () => ({
  NookFairyLights: () => null,
}));

vi.mock("@/features/characterMapping/hooks/useCharacterMapping", () => ({
  useCharacterMapping: vi.fn(),
}));

vi.mock("./PendingSubmissions", () => ({
  PendingSubmissions: function PendingSubmissions() {
    const [draft, setDraft] = useState("");
    return (
      <input
        aria-label="Biography review draft"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
    );
  },
}));

vi.mock("@/features/characterMapping/CharacterMapping", () => ({
  CharacterMapping: function CharacterMapping(
    props: ComponentProps<typeof CharacterMappingComponent>,
  ) {
    const [draft, setDraft] = useState("");
    mappingProps(props);
    return (
      <div>
        <p>Current mapping mode: {props.tab}</p>
        <input
          aria-label="Character search draft"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="button" onClick={() => props.onTabChange?.("suggested")}>
          Show suggested pairs
        </button>
      </div>
    );
  },
}));

function submission(id: string, status: string): BiographySubmission {
  return {
    id: { timestamp: 123, creationTime: "2026-09-28T12:00:00Z" },
    submissionId: id,
    submittedByDiscordId: `discord-${id}`,
    biography: `A biography from ${id}.`,
    submittedAt: "2026-09-28T12:00:00Z",
    status,
  };
}

function emptyMapping(): UseCharacterMappingResult {
  return {
    allCharacters: [],
    allDiscordUsers: [],
    matchResults: {
      exactMatches: [],
      suggestedMatches: [],
      unmatchedCharacters: [],
      unmatchedDiscordUsers: [],
    },
    visibleExactMatches: [],
    visibleSuggestedMatches: [],
    totalMatches: 0,
    isLoading: false,
    isError: false,
    isFetching: false,
    confirmPair: vi.fn(),
    dismissPair: vi.fn(),
    mapManually: vi.fn().mockResolvedValue(undefined),
    confirmAllExact: vi.fn().mockResolvedValue(undefined),
    refresh: vi.fn(),
    confirmingPairKey: null,
    isMapping: false,
    isConfirmingAll: false,
    mappingError: null,
    getRankedDiscordUsers: vi.fn().mockReturnValue(null),
    getRankedCharacters: vi.fn().mockReturnValue(null),
  };
}

const queryClients: QueryClient[] = [];
let mapping: UseCharacterMappingResult;

beforeEach(() => {
  vi.mocked(biographyApi.getPendingSubmissions)
    .mockReset()
    .mockResolvedValue([]);
  mappingProps.mockClear();
  mapping = emptyMapping();
  vi.mocked(useCharacterMapping)
    .mockReset()
    .mockImplementation(() => mapping);
  vi.mocked(Element.prototype.scrollIntoView).mockClear();
});

afterEach(() => {
  queryClients.splice(0).forEach((client) => client.clear());
  vi.restoreAllMocks();
});

function renderDashboard() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  queryClients.push(client);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
  return render(<KnightDashboard />, { wrapper });
}

describe("Knight dashboard workspace", () => {
  it("shows loading counts without announcing an empty desk before data arrives", () => {
    vi.mocked(biographyApi.getPendingSubmissions).mockReturnValue(
      new Promise<BiographySubmission[]>(() => {}),
    );
    mapping.isLoading = true;
    renderDashboard();

    expect(
      screen.getByRole("heading", { level: 1, name: "Knight dashboard" }),
    ).toBeVisible();
    for (const label of [
      "Biographies",
      "Characters to link",
      "Suggested links",
    ]) {
      expect(
        screen.getByRole("button", {
          name: new RegExp(`^${label}: loading\\.`),
        }),
      ).toBeVisible();
      expect(
        screen.queryByRole("button", { name: new RegExp(`^${label}: 0\\.`) }),
      ).not.toBeInTheDocument();
    }
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it.each(["biographies", "mapping"] as const)(
    "does not treat a failed %s request as a known zero or an all-clear",
    async (failedSource) => {
      if (failedSource === "biographies") {
        vi.mocked(biographyApi.getPendingSubmissions).mockRejectedValue(
          new Error("Unavailable"),
        );
      } else {
        mapping.isError = true;
      }
      renderDashboard();

      await screen.findByRole("button", {
        name:
          failedSource === "biographies"
            ? /^Biographies: unavailable\./
            : /^Biographies: 0\./,
      });
      const failedLabels =
        failedSource === "biographies"
          ? ["Biographies"]
          : ["Characters to link", "Suggested links"];
      for (const label of failedLabels) {
        expect(
          screen.getByRole("button", {
            name: new RegExp(`^${label}: unavailable\\.`),
          }),
        ).toHaveTextContent("Couldn’t load");
        expect(
          screen.queryByRole("button", { name: new RegExp(`^${label}: 0\\.`) }),
        ).not.toBeInTheDocument();
      }
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    },
  );

  it("counts pending biographies only, excluding approved and rejected submissions", async () => {
    vi.mocked(biographyApi.getPendingSubmissions).mockResolvedValue([
      submission("ada", "Pending"),
      submission("bea", "Approved"),
      submission("cedar", "Rejected"),
      submission("dara", "Pending"),
    ]);
    renderDashboard();

    await screen.findByRole("button", {
      name: "Biographies: 2. Open biography reviews.",
    });
    expect(
      screen.getByRole("tab", { name: "Biography reviews 2" }),
    ).toHaveAttribute("aria-selected", "true");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(biographyApi.getPendingSubmissions).toHaveBeenCalledOnce();
  });

  it("keeps outstanding Discord-only accounts visible instead of declaring all tasks finished", async () => {
    mapping.allDiscordUsers = [
      { discordId: "discord-ada", serverNickName: "Ada Bloom" },
    ];
    renderDashboard();

    await screen.findByRole("button", { name: /^Biographies: 0\./ });
    expect(
      screen.getByRole("button", { name: /^Characters to link: 0\./ }),
    ).toHaveTextContent("1 Discord account also unlinked");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("announces all caught up only once both queues are known to be empty", async () => {
    vi.mocked(biographyApi.getPendingSubmissions).mockResolvedValue([
      submission("ada", "Approved"),
    ]);
    renderDashboard();

    expect(await screen.findByRole("status")).toHaveTextContent(
      "All caught up, kupo.",
    );
    expect(
      screen.getByRole("button", { name: /^Biographies: 0\./ }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: /^Characters to link: 0\./ }),
    ).toBeVisible();
  });

  it("supports arrow, Home, and End keys while preserving drafts in both mounted panels", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await screen.findByRole("button", { name: /^Biographies: 0\./ });
    const biographyTab = screen.getByRole("tab", { name: "Biography reviews" });
    const linksTab = screen.getByRole("tab", { name: "Character links" });
    const biographyPanel = document.getElementById(
      "dashboard-panel-biographies",
    )!;
    const linksPanel = document.getElementById("dashboard-panel-links")!;
    const biographyDraft = screen.getByRole("textbox", {
      name: "Biography review draft",
    });
    await user.type(biographyDraft, "Keep the member’s words");
    expect(linksPanel).toHaveAttribute("hidden");
    expect(
      screen.queryByRole("textbox", { name: "Character search draft" }),
    ).not.toBeInTheDocument();

    biographyTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(linksTab).toHaveFocus();
    expect(linksTab).toHaveAttribute("aria-selected", "true");
    expect(linksTab).toHaveAttribute("tabindex", "0");
    expect(biographyTab).toHaveAttribute("tabindex", "-1");
    expect(biographyPanel).toHaveAttribute("hidden");
    expect(linksPanel).not.toHaveAttribute("hidden");
    const characterDraft = screen.getByRole("textbox", {
      name: "Character search draft",
    });
    await user.type(characterDraft, "Ada");

    linksTab.focus();
    await user.keyboard("{Home}");
    expect(biographyTab).toHaveFocus();
    expect(biographyDraft).toBeVisible();
    expect(biographyDraft).toHaveValue("Keep the member’s words");
    await user.keyboard("{End}");
    expect(linksTab).toHaveFocus();
    expect(characterDraft).toBeVisible();
    expect(characterDraft).toHaveValue("Ada");
    await user.keyboard("{ArrowLeft}");
    expect(biographyTab).toHaveFocus();
    expect(screen.getAllByRole("tabpanel")).toEqual([biographyPanel]);
    expect(screen.getAllByRole("tabpanel", { hidden: true })).toHaveLength(2);
  });

  it("reveals a newly selected panel behind the sticky tabs and keeps keyboard focus on the tabs", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await screen.findByRole("button", { name: /^Biographies: 0\./ });
    const biographyTab = screen.getByRole("tab", { name: "Biography reviews" });
    const linksTab = screen.getByRole("tab", { name: "Character links" });
    const toolbar = screen.getByRole("tablist", { name: "Dashboard tools" });
    const biographyPanel = document.getElementById(
      "dashboard-panel-biographies",
    )!;
    const linksPanel = document.getElementById("dashboard-panel-links")!;
    vi.spyOn(toolbar, "getBoundingClientRect").mockReturnValue({
      bottom: 74,
    } as DOMRect);
    const biographyRect = vi
      .spyOn(biographyPanel, "getBoundingClientRect")
      .mockReturnValue({
        top: -500,
      } as DOMRect);
    const linksRect = vi
      .spyOn(linksPanel, "getBoundingClientRect")
      .mockReturnValue({
        top: -500,
      } as DOMRect);
    const scroll = vi.mocked(Element.prototype.scrollIntoView);

    await user.click(linksTab);
    expect(scroll).toHaveBeenCalledExactlyOnceWith({
      block: "start",
      behavior: "instant",
    });
    expect(scroll.mock.instances[0]).toBe(linksPanel);
    expect(linksTab).toHaveFocus();

    scroll.mockClear();
    await user.keyboard("{ArrowLeft}");
    expect(scroll).toHaveBeenCalledExactlyOnceWith({
      block: "start",
      behavior: "instant",
    });
    expect(scroll.mock.instances[0]).toBe(biographyPanel);
    expect(biographyTab).toHaveFocus();

    scroll.mockClear();
    linksRect.mockReturnValue({ top: 80 } as DOMRect);
    await user.keyboard("{End}");
    expect(scroll).toHaveBeenCalledOnce();
    expect(linksTab).toHaveFocus();

    scroll.mockClear();
    biographyRect.mockReturnValue({ top: 200 } as DOMRect);
    await user.keyboard("{Home}");
    expect(scroll).not.toHaveBeenCalled();
    expect(biographyTab).toHaveFocus();

    linksRect.mockReturnValue({ top: window.innerHeight + 100 } as DOMRect);
    await user.click(linksTab);
    expect(scroll).toHaveBeenCalledOnce();
    expect(linksTab).toHaveFocus();
  });

  it("opens the chosen mapping mode from summaries and shares its model without performing a link", async () => {
    const user = userEvent.setup();
    mapping.allCharacters = [
      {
        characterId: "ada",
        name: "Ada Bloom",
        avatarLink: "",
        freeCompanyRank: "Paissa",
      },
    ];
    mapping.totalMatches = 1;
    renderDashboard();
    await screen.findByRole("button", { name: /^Biographies: 0\./ });

    await user.click(
      screen.getByRole("button", { name: /^Characters to link: 1\./ }),
    );
    const linksPanel = screen.getByRole("tabpanel", {
      name: "Character links",
    });
    await waitFor(() => expect(linksPanel).toHaveFocus());
    expect(
      within(linksPanel).getByText("Current mapping mode: manual"),
    ).toBeVisible();
    expect(mappingProps).toHaveBeenLastCalledWith(
      expect.objectContaining({ mapping, tab: "manual", embedded: true }),
    );
    expect(mappingProps.mock.lastCall?.[0].mapping).toBe(mapping);
    expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({
      behavior: "smooth",
      block: "start",
    });

    await user.click(
      screen.getByRole("button", { name: "Show suggested pairs" }),
    );
    expect(
      within(linksPanel).getByText("Current mapping mode: suggested"),
    ).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: /^Characters to link: 1\./ }),
    );
    await waitFor(() => expect(linksPanel).toHaveFocus());
    await user.click(
      screen.getByRole("button", { name: /^Suggested links: 1\./ }),
    );
    await waitFor(() => expect(linksPanel).toHaveFocus());
    expect(
      within(linksPanel).getByText("Current mapping mode: suggested"),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: /^Biographies: 0\./ }));
    await waitFor(() =>
      expect(
        screen.getByRole("tabpanel", { name: "Biography reviews" }),
      ).toHaveFocus(),
    );
    expect(mapping.mapManually).not.toHaveBeenCalled();
    expect(mapping.confirmPair).not.toHaveBeenCalled();
    expect(mapping.confirmAllExact).not.toHaveBeenCalled();
    expect(mapping.dismissPair).not.toHaveBeenCalled();
  });

  it("uses immediate summary scrolling for reduced motion and reflects the current shared model", async () => {
    const user = userEvent.setup();
    vi.mocked(window.matchMedia).mockReturnValueOnce({
      ...window.matchMedia("(prefers-reduced-motion: reduce)"),
      matches: true,
    });
    mapping.totalMatches = 2;
    const view = renderDashboard();
    await screen.findByRole("button", { name: /^Biographies: 0\./ });
    await user.click(
      screen.getByRole("button", { name: /^Suggested links: 2\./ }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("tabpanel", { name: "Character links" }),
      ).toHaveFocus(),
    );
    expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({
      behavior: "auto",
      block: "start",
    });

    mapping = { ...mapping, totalMatches: 1 };
    view.rerender(<KnightDashboard />);
    expect(
      screen.getByRole("button", { name: /^Suggested links: 1\./ }),
    ).toBeVisible();
    expect(mappingProps.mock.lastCall?.[0].mapping).toBe(mapping);
    expect(
      screen.getByRole("tab", { name: "Character links" }),
    ).toHaveAttribute("aria-selected", "true");
  });
});

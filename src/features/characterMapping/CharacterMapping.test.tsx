import { useState } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen, waitFor, within } from "@/shared/test/test-utils";
import userEvent from "@testing-library/user-event";
import { CharacterMapping } from "./CharacterMapping";
import { useCharacterMapping } from "./hooks/useCharacterMapping";
import { characterMappingApi } from "./api";

vi.mock("./api", () => ({
  characterMappingApi: {
    getUnmappedCharacters: vi.fn(),
    getUnmappedDiscordUsers: vi.fn(),
    mapCharacter: vi.fn(),
  },
}));
const characters = [
  {
    characterId: "1",
    name: "Ada Bloom",
    avatarLink: "",
    freeCompanyRank: "Moogle Knight",
  },
  {
    characterId: "2",
    name: "Bram Fern",
    avatarLink: "",
    freeCompanyRank: "Mandragora",
  },
];
const accounts = [
  { discordId: "10", serverNickName: "Ada Bloom" },
  { discordId: "20", serverNickName: "Bram Fern" },
];
function seedLists() {
  vi.mocked(characterMappingApi.getUnmappedCharacters).mockResolvedValue({
    suggestedCharacters: [],
    unmappedCharacters: characters,
  });
  vi.mocked(characterMappingApi.getUnmappedDiscordUsers).mockResolvedValue({
    suggestedDiscordUsers: [],
    unmappedDiscordUsers: accounts,
  });
}
const chooseManual = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(
    within(screen.getByRole("group", { name: "Linking method" })).getByRole(
      "button",
      { name: "Choose by hand" },
    ),
  );

describe("Character linking workspace", () => {
  beforeEach(() => {
    vi.mocked(characterMappingApi.getUnmappedCharacters).mockReset();
    vi.mocked(characterMappingApi.getUnmappedDiscordUsers).mockReset();
    vi.mocked(characterMappingApi.mapCharacter)
      .mockReset()
      .mockResolvedValue(undefined);
    seedLists();
  });

  it("renders embedded loading without a modal or trigger", () => {
    vi.mocked(characterMappingApi.getUnmappedCharacters).mockReturnValue(
      new Promise(() => {}),
    );
    render(<CharacterMapping embedded />);
    expect(screen.getByText("Loading unlinked accounts…")).toHaveAttribute(
      "role",
      "status",
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Open Character Mapping" }),
    ).not.toBeInTheDocument();
  });

  it("retains the standalone trigger and opens the linking dialog", async () => {
    const user = userEvent.setup();
    render(<CharacterMapping />);
    await user.click(
      screen.getByRole("button", { name: "Open Character Mapping" }),
    );
    expect(
      screen.getByRole("dialog", { name: "Character linking" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", {
        name: "Link Ada Bloom to Ada Bloom",
      }),
    ).toBeInTheDocument();
  });

  it("recovers an account-list error with an explicit retry", async () => {
    const user = userEvent.setup();
    vi.mocked(characterMappingApi.getUnmappedCharacters).mockRejectedValueOnce(
      new Error("Unavailable"),
    );
    render(<CharacterMapping embedded />);
    expect(
      await screen.findByRole("heading", {
        name: "Couldn't load the accounts",
      }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(
      await screen.findByRole("button", {
        name: "Link Ada Bloom to Ada Bloom",
      }),
    ).toBeInTheDocument();
    expect(characterMappingApi.getUnmappedCharacters).toHaveBeenCalledTimes(2);
  });

  it("explains an empty list without offering a link action", async () => {
    vi.mocked(characterMappingApi.getUnmappedCharacters).mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [],
    });
    vi.mocked(characterMappingApi.getUnmappedDiscordUsers).mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [],
    });
    render(<CharacterMapping embedded />);
    expect(
      await screen.findByRole("heading", { name: "All accounts linked" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Link accounts" }),
    ).not.toBeInTheDocument();
    expect(characterMappingApi.mapCharacter).not.toHaveBeenCalled();
  });

  it("skips a suggestion locally and restores it on refresh without linking", async () => {
    const user = userEvent.setup();
    render(<CharacterMapping embedded />);
    await user.click(
      await screen.findByRole("button", {
        name: "Skip the match for Ada Bloom",
      }),
    );
    expect(
      screen.queryByRole("button", { name: "Link Ada Bloom to Ada Bloom" }),
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Refresh unlinked accounts" }),
    );
    expect(
      await screen.findByRole("button", {
        name: "Link Ada Bloom to Ada Bloom",
      }),
    ).toBeInTheDocument();
    expect(characterMappingApi.mapCharacter).not.toHaveBeenCalled();
  });

  it("locks all competing actions while a suggested link is saving", async () => {
    const user = userEvent.setup();
    let finish!: () => void;
    vi.mocked(characterMappingApi.mapCharacter).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    render(<CharacterMapping embedded />);
    await user.click(
      await screen.findByRole("button", {
        name: "Link Ada Bloom to Ada Bloom",
      }),
    );
    expect(
      screen.getByRole("button", { name: "Link Bram Fern to Bram Fern" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Skip the match for Bram Fern" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Link 2 exact matches" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Choose by hand" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Refresh unlinked accounts" }),
    ).toBeDisabled();
    await user.click(
      screen.getByRole("button", { name: "Link Bram Fern to Bram Fern" }),
    );
    expect(characterMappingApi.mapCharacter).toHaveBeenCalledExactlyOnceWith(
      "1",
      "10",
    );
    await act(async () => finish());
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Link Ada Bloom to Ada Bloom" }),
      ).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole("button", { name: "Link Bram Fern to Bram Fern" }),
    ).toBeEnabled();
  });

  it("keeps failed bulk pairs visible and reports failure after later links succeed", async () => {
    const user = userEvent.setup();
    vi.mocked(characterMappingApi.mapCharacter).mockRejectedValueOnce(
      new Error("Unavailable"),
    );
    render(<CharacterMapping embedded />);
    await user.click(
      await screen.findByRole("button", { name: "Link 2 exact matches" }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "1 link couldn't be saved. Successful links are complete; retry the remaining pairs.",
    );
    expect(
      screen.queryByRole("button", { name: "Link Bram Fern to Bram Fern" }),
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Link Ada Bloom to Ada Bloom" }),
    );
    expect(
      await screen.findByRole("heading", { name: "All accounts linked" }),
    ).toBeInTheDocument();
    expect(characterMappingApi.mapCharacter).toHaveBeenCalledTimes(3);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("requires both choices, keeps the selected pair visible, and clears search with Escape", async () => {
    const user = userEvent.setup();
    render(<CharacterMapping embedded initialTab="manual" />);
    const characterSearch = await screen.findByRole("searchbox", {
      name: "Search characters",
    });
    expect(
      screen.getByRole("searchbox", { name: "Search Discord accounts" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Selected accounts" }),
    ).toHaveTextContent("0 of 2 selected");
    expect(
      screen.getByRole("button", { name: "Link accounts" }),
    ).toBeDisabled();
    await user.type(characterSearch, "Ada");
    expect(
      screen.queryByRole("button", { name: "Select character Bram Fern" }),
    ).not.toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(characterSearch).toHaveValue("");
    expect(characterSearch).toHaveFocus();
    await user.click(
      screen.getByRole("button", { name: "Select character Ada Bloom" }),
    );
    expect(
      screen.getByRole("button", { name: "Select character Ada Bloom" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Select Discord account Ada Bloom" }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("button", { name: "Link accounts" }),
    ).toBeDisabled();
    await user.click(
      screen.getByRole("button", { name: "Select Discord account Ada Bloom" }),
    );
    expect(screen.getByRole("button", { name: "Link accounts" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(
      screen.getByRole("group", { name: "Selected accounts" }),
    ).toHaveTextContent("0 of 2 selected");
    expect(
      screen.getByRole("button", { name: "Link accounts" }),
    ).toBeDisabled();
    expect(characterMappingApi.mapCharacter).not.toHaveBeenCalled();
  });

  it("retains a failed manual selection for retry and clears it after success", async () => {
    const user = userEvent.setup();
    vi.mocked(characterMappingApi.mapCharacter).mockRejectedValueOnce(
      new Error("Unavailable"),
    );
    render(<CharacterMapping embedded initialTab="manual" />);
    await user.click(
      await screen.findByRole("button", { name: "Select character Ada Bloom" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Select Discord account Bram Fern" }),
    );
    await user.click(screen.getByRole("button", { name: "Link accounts" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Your selection is still here.",
    );
    expect(
      screen.getByRole("group", { name: "Selected accounts" }),
    ).toHaveTextContent("Ada Bloom");
    await user.click(screen.getByRole("button", { name: "Link accounts" }));
    await waitFor(() =>
      expect(
        screen.getByRole("group", { name: "Selected accounts" }),
      ).toHaveTextContent("0 of 2 selected"),
    );
    expect(
      screen
        .getByText("Linked Ada Bloom to Bram Fern.")
        .closest('[role="status"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Link accounts" }),
    ).toBeDisabled();
    expect(characterMappingApi.mapCharacter).toHaveBeenNthCalledWith(
      1,
      "1",
      "20",
    );
    expect(characterMappingApi.mapCharacter).toHaveBeenNthCalledWith(
      2,
      "1",
      "20",
    );
  });

  it("accepts the parent's shared model and controlled method without losing skipped pairs", async () => {
    function SharedMapping() {
      const mapping = useCharacterMapping();
      const [tab, setTab] = useState<"suggested" | "manual">("suggested");
      return (
        <>
          <button onClick={() => setTab("manual")}>Open manual linking</button>
          <CharacterMapping
            embedded
            mapping={mapping}
            tab={tab}
            onTabChange={setTab}
          />
        </>
      );
    }
    const user = userEvent.setup();
    render(<SharedMapping />);
    await user.click(
      await screen.findByRole("button", {
        name: "Skip the match for Ada Bloom",
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Open manual linking" }),
    );
    expect(
      screen.getByRole("searchbox", { name: "Search characters" }),
    ).toBeInTheDocument();
    await user.click(
      within(screen.getByRole("group", { name: "Linking method" })).getByRole(
        "button",
        { name: /Suggestions/ },
      ),
    );
    expect(
      screen.queryByRole("button", { name: "Link Ada Bloom to Ada Bloom" }),
    ).not.toBeInTheDocument();
    expect(characterMappingApi.getUnmappedCharacters).toHaveBeenCalledOnce();
    expect(characterMappingApi.getUnmappedDiscordUsers).toHaveBeenCalledOnce();
  });

  it("changes either selected account without clearing the other choice or its search", async () => {
    const user = userEvent.setup();
    render(<CharacterMapping embedded initialTab="manual" />);
    const characterSearch = await screen.findByRole("searchbox", {
      name: "Search characters",
    });
    const discordSearch = screen.getByRole("searchbox", {
      name: "Search Discord accounts",
    });
    await user.click(
      screen.getByRole("button", { name: "Select character Ada Bloom" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Select Discord account Bram Fern" }),
    );
    await user.type(characterSearch, "Ada");
    await user.type(discordSearch, "20");

    await user.click(
      screen.getByRole("button", { name: "Change selected character" }),
    );
    expect(characterSearch).toHaveFocus();
    expect(characterSearch).toHaveValue("");
    expect(discordSearch).toHaveValue("20");
    expect(
      screen.getByRole("group", { name: "Selected accounts" }),
    ).toHaveTextContent("No character selected");
    expect(
      screen.getByRole("group", { name: "Selected accounts" }),
    ).toHaveTextContent("Bram Fern");
    expect(
      screen.getByRole("button", { name: "Link accounts" }),
    ).toBeDisabled();

    await user.click(
      screen.getByRole("button", { name: "Select character Ada Bloom" }),
    );
    await user.type(characterSearch, "Ada");
    await user.click(
      screen.getByRole("button", { name: "Change selected Discord account" }),
    );
    expect(discordSearch).toHaveFocus();
    expect(discordSearch).toHaveValue("");
    expect(characterSearch).toHaveValue("Ada");
    expect(
      screen.getByRole("group", { name: "Selected accounts" }),
    ).toHaveTextContent("Ada Bloom");
    expect(
      screen.getByRole("group", { name: "Selected accounts" }),
    ).toHaveTextContent("No Discord account selected");
    expect(
      screen.getByRole("button", { name: "Link accounts" }),
    ).toBeDisabled();
    expect(characterMappingApi.mapCharacter).not.toHaveBeenCalled();
  });

  it("respects app-level reduced motion when returning to the selected pair", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <CharacterMapping embedded initialTab="manual" />,
    );
    await user.click(
      await screen.findByRole("button", { name: "Select character Ada Bloom" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Select Discord account Bram Fern" }),
    );
    const selection = screen.getByRole("group", { name: "Selected accounts" });
    const scroll = vi.spyOn(selection, "scrollIntoView");
    try {
      expect(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      ).toBe(false);
      await act(async () => {
        document.documentElement.classList.add("reduce-motion");
      });
      await user.click(
        screen.getByRole("button", { name: "Review selected pair" }),
      );
      expect(selection).toHaveFocus();
      expect(scroll).toHaveBeenCalledExactlyOnceWith({
        block: "center",
        behavior: "auto",
      });
      expect(characterMappingApi.mapCharacter).not.toHaveBeenCalled();
    } finally {
      unmount();
      scroll.mockRestore();
      document.documentElement.classList.remove("reduce-motion");
    }
  });

  it("finds a same-named Discord account by ID and links only the explicit pair", async () => {
    const user = userEvent.setup();
    vi.mocked(characterMappingApi.getUnmappedDiscordUsers).mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: accounts.map((account) => ({
        ...account,
        serverNickName: "Shared Nickname",
      })),
    });
    render(<CharacterMapping embedded initialTab="manual" />);
    const discordSearch = await screen.findByRole("searchbox", {
      name: "Search Discord accounts",
    });
    expect(
      screen.getAllByRole("button", {
        name: "Select Discord account Shared Nickname",
      }),
    ).toHaveLength(2);
    await user.type(discordSearch, " 20 ");
    const account = screen.getByRole("button", {
      name: "Select Discord account Shared Nickname",
    });
    expect(account).toHaveTextContent("ID 20");
    await user.click(account);
    expect(
      screen.getByRole("button", { name: "Link accounts" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("group", { name: "Selected accounts" }),
    ).toHaveTextContent("No character selected");
    await user.click(
      screen.getByRole("button", { name: "Select character Ada Bloom" }),
    );
    await user.click(screen.getByRole("button", { name: "Link accounts" }));
    await waitFor(() =>
      expect(characterMappingApi.mapCharacter).toHaveBeenCalledExactlyOnceWith(
        "1",
        "20",
      ),
    );
  });

  it("keeps both manual choices when searches hide them and linking methods change", async () => {
    const user = userEvent.setup();
    render(<CharacterMapping embedded />);
    await screen.findByRole("button", { name: "Link Ada Bloom to Ada Bloom" });
    await chooseManual(user);
    await user.click(
      screen.getByRole("button", { name: "Select character Ada Bloom" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Select Discord account Bram Fern" }),
    );
    await user.type(
      screen.getByRole("searchbox", { name: "Search characters" }),
      "Bram",
    );
    await user.type(
      screen.getByRole("searchbox", { name: "Search Discord accounts" }),
      "10",
    );
    expect(
      screen.queryByRole("button", { name: "Select character Ada Bloom" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "Select Discord account Bram Fern",
      }),
    ).not.toBeInTheDocument();
    await user.click(
      within(screen.getByRole("group", { name: "Linking method" })).getByRole(
        "button",
        { name: /Suggestions/ },
      ),
    );
    await chooseManual(user);
    expect(
      screen.getByRole("group", { name: "Selected accounts" }),
    ).toHaveTextContent("Ada Bloom");
    expect(
      screen.getByRole("group", { name: "Selected accounts" }),
    ).toHaveTextContent("Bram Fern");
    expect(screen.getByRole("button", { name: "Link accounts" })).toBeEnabled();
    expect(
      screen.getByRole("searchbox", { name: "Search characters" }),
    ).toHaveValue("Bram");
    expect(
      screen.getByRole("searchbox", { name: "Search Discord accounts" }),
    ).toHaveValue("10");
    expect(characterMappingApi.mapCharacter).not.toHaveBeenCalled();
  });

  it("drops a manual selection if those accounts are linked from suggestions", async () => {
    const user = userEvent.setup();
    render(<CharacterMapping embedded initialTab="manual" />);
    await user.click(
      await screen.findByRole("button", { name: "Select character Ada Bloom" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Select Discord account Ada Bloom" }),
    );
    await user.click(
      within(screen.getByRole("group", { name: "Linking method" })).getByRole(
        "button",
        { name: /Suggestions/ },
      ),
    );
    await user.click(
      screen.getByRole("button", { name: "Link Ada Bloom to Ada Bloom" }),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Link Ada Bloom to Ada Bloom" }),
      ).not.toBeInTheDocument(),
    );
    await chooseManual(user);

    expect(
      screen.getByRole("group", { name: "Selected accounts" }),
    ).toHaveTextContent("0 of 2 selected");
    expect(
      screen.getByRole("button", { name: "Link accounts" }),
    ).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "Select character Ada Bloom" }),
    ).not.toBeInTheDocument();
    expect(characterMappingApi.mapCharacter).toHaveBeenCalledOnce();
  });
});

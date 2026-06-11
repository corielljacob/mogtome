import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/shared/test/test-utils";
import userEvent from "@testing-library/user-event";
import { CharacterMapping } from "@/features/characterMapping/CharacterMapping";
import { characterMappingApi } from "@/features/characterMapping/api";

vi.mock("@/features/characterMapping/api", () => ({
  characterMappingApi: {
    getUnmappedCharacters: vi.fn(),
    getUnmappedDiscordUsers: vi.fn(),
    mapCharacter: vi.fn(),
  },
}));

const mockCharacterMappingApi = characterMappingApi as {
  getUnmappedCharacters: ReturnType<typeof vi.fn>;
  getUnmappedDiscordUsers: ReturnType<typeof vi.fn>;
  mapCharacter: ReturnType<typeof vi.fn>;
};

describe("CharacterMapping", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    const user = userEvent.setup();
    mockCharacterMappingApi.getUnmappedCharacters.mockReturnValue(
      new Promise(() => {}),
    );
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockReturnValue(
      new Promise(() => {}),
    );

    render(<CharacterMapping />);

    await user.click(
      screen.getByRole("button", { name: /character mapping/i }),
    );

    expect(screen.getByText(/loading unmapped accounts/i)).toBeInTheDocument();
  });

  it("renders the component header", async () => {
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [],
    });

    render(<CharacterMapping />);

    await waitFor(() => {
      expect(screen.getByText("Character Mapping")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Link characters to Discord accounts"),
    ).toBeInTheDocument();
  });

  it("renders empty state when no unmapped accounts", async () => {
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [],
    });

    render(<CharacterMapping />);

    await waitFor(() => {
      expect(screen.getByText("All accounts mapped!")).toBeInTheDocument();
    });
  });

  it("shows the Characters and Discord columns on the By hand tab", async () => {
    const user = userEvent.setup();
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [
        {
          characterId: "1",
          name: "Test Character",
          avatarLink: "",
          freeCompanyRank: "Knight",
        },
      ],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [{ discordId: "123", serverNickName: "SomeUser" }],
    });

    render(<CharacterMapping />);

    await user.click(
      screen.getByRole("button", { name: /character mapping/i }),
    );

    await user.click(await screen.findByRole("button", { name: "By hand" }));

    await waitFor(() => {
      expect(screen.getByText("Characters")).toBeInTheDocument();
      expect(screen.getByText("Discord Accounts")).toBeInTheDocument();
    });
  });

  it("renders the character and Discord lists side by side", async () => {
    const user = userEvent.setup();
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [
        {
          characterId: "1",
          name: "Test Character",
          avatarLink: "https://example.com/avatar.png",
          freeCompanyRank: "Moogle Knight",
        },
      ],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [
        { discordId: "123", serverNickName: "TestDiscordUser" },
      ],
    });

    render(<CharacterMapping />);

    await user.click(
      screen.getByRole("button", { name: /character mapping/i }),
    );

    await user.click(await screen.findByRole("button", { name: "By hand" }));

    await waitFor(() => {
      expect(screen.getByText("Characters")).toBeInTheDocument();
      expect(screen.getByText("Discord Accounts")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Character")).toBeInTheDocument();
    expect(screen.getByText("TestDiscordUser")).toBeInTheDocument();
  });

  it("surfaces an exact match as a confirmable pair + bulk-confirm button", async () => {
    const user = userEvent.setup();
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [
        {
          characterId: "1",
          name: "Miko Cocoa",
          avatarLink: "",
          freeCompanyRank: "Knight",
        },
      ],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [{ discordId: "10", serverNickName: "Miko Cocoa" }],
    });

    render(<CharacterMapping />);

    await user.click(
      screen.getByRole("button", { name: /character mapping/i }),
    );

    // the Suggested tab is the default - the exact match shows up there with a
    // one-click confirm and a bulk "confirm all exact" button.
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /confirm 1 exact match/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getByText("Perfect match!")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /confirm miko cocoa with miko cocoa/i,
      }),
    ).toBeInTheDocument();
  });

  it("shows both column search inputs on the By hand tab", async () => {
    const user = userEvent.setup();
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [
        {
          characterId: "1",
          name: "Test Char",
          avatarLink: "",
          freeCompanyRank: "Knight",
        },
      ],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [{ discordId: "1", serverNickName: "TestUser" }],
    });

    render(<CharacterMapping />);

    await user.click(
      screen.getByRole("button", { name: /character mapping/i }),
    );

    await user.click(await screen.findByRole("button", { name: "By hand" }));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search characters..."),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Search Discord users..."),
      ).toBeInTheDocument();
    });
  });

  it("has a refresh button", async () => {
    const user = userEvent.setup();
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [],
    });

    render(<CharacterMapping />);

    await user.click(
      screen.getByRole("button", { name: /character mapping/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByLabelText("Refresh unmapped lists"),
      ).toBeInTheDocument();
    });
  });
});

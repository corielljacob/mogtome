import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { MatchPair } from "../types";
import { useSmartPicker } from "./useSmartPicker";

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
  { discordId: "101", serverNickName: "Ada Bloom" },
  { discordId: "202", serverNickName: "Bram Fern" },
];
const suggestedPairs: MatchPair[] = characters.map((character, index) => ({
  character,
  discordUser: accounts[index],
  confidence: "exact",
  score: 1,
}));

function pickerArgs() {
  return {
    allCharacters: characters,
    allDiscordUsers: accounts,
    suggestedPairs,
    getRankedDiscordUsers: vi.fn(() =>
      [...accounts]
        .reverse()
        .map((user) => ({ ...user, confidence: "high" as const, score: 0.8 })),
    ),
    getRankedCharacters: vi.fn(() =>
      [...characters].reverse().map((character) => ({
        ...character,
        confidence: "high" as const,
        score: 0.8,
      })),
    ),
  };
}

describe("useSmartPicker", () => {
  it("requires an explicit choice on each side even when an exact match exists", () => {
    const { result } = renderHook(() => useSmartPicker(pickerArgs()));
    act(() => result.current.selectCharacter(characters[0]));
    expect(result.current.selectedCharacter).toEqual(characters[0]);
    expect(result.current.selectedDiscordUser).toBeNull();
    expect(result.current.canLink).toBe(false);

    act(() => result.current.reset());
    act(() => result.current.selectDiscordUser(accounts[0]));
    expect(result.current.selectedCharacter).toBeNull();
    expect(result.current.selectedDiscordUser).toEqual(accounts[0]);
    expect(result.current.canLink).toBe(false);

    act(() => result.current.selectCharacter(characters[1]));
    expect(result.current.selectedCharacter).toEqual(characters[1]);
    expect(result.current.selectedDiscordUser).toEqual(accounts[0]);
    expect(result.current.canLink).toBe(true);
  });

  it("toggles and replaces only the account that was chosen", () => {
    const { result } = renderHook(() => useSmartPicker(pickerArgs()));
    act(() => {
      result.current.selectCharacter(characters[0]);
      result.current.selectDiscordUser(accounts[0]);
    });
    act(() => result.current.selectCharacter(characters[1]));
    expect(result.current.selectedDiscordUser).toEqual(accounts[0]);
    act(() => result.current.selectCharacter(characters[1]));
    expect(result.current.selectedCharacter).toBeNull();
    expect(result.current.selectedDiscordUser).toEqual(accounts[0]);

    act(() => result.current.selectCharacter(characters[0]));
    act(() => result.current.selectDiscordUser(accounts[1]));
    expect(result.current.selectedCharacter).toEqual(characters[0]);
    act(() => result.current.selectDiscordUser(accounts[1]));
    expect(result.current.selectedDiscordUser).toBeNull();
    expect(result.current.selectedCharacter).toEqual(characters[0]);
  });

  it("clears either side without changing the other choice or searches; reset clears everything", () => {
    const { result } = renderHook(() => useSmartPicker(pickerArgs()));
    act(() => {
      result.current.selectCharacter(characters[0]);
      result.current.selectDiscordUser(accounts[1]);
      result.current.setCharacterSearch("Ada");
      result.current.setDiscordSearch("202");
    });
    act(() => result.current.clearCharacter());
    expect(result.current.selectedCharacter).toBeNull();
    expect(result.current.selectedDiscordUser).toEqual(accounts[1]);
    expect(result.current.characterSearch).toBe("Ada");
    expect(result.current.discordSearch).toBe("202");

    act(() => result.current.selectCharacter(characters[0]));
    act(() => result.current.clearDiscordUser());
    expect(result.current.selectedCharacter).toEqual(characters[0]);
    expect(result.current.selectedDiscordUser).toBeNull();
    expect(result.current.characterSearch).toBe("Ada");
    expect(result.current.discordSearch).toBe("202");

    act(() => result.current.reset());
    expect(result.current.selectedCharacter).toBeNull();
    expect(result.current.selectedDiscordUser).toBeNull();
    expect(result.current.characterSearch).toBe("");
    expect(result.current.discordSearch).toBe("");
  });

  it("finds same-named Discord accounts by ID as well as a trimmed case-insensitive name", () => {
    const args = pickerArgs();
    args.allDiscordUsers = accounts.map((account) => ({
      ...account,
      serverNickName: "Shared Nickname",
    }));
    const { result } = renderHook(() => useSmartPicker(args));
    act(() => result.current.setDiscordSearch("  202  "));
    expect(
      result.current.discordRows.map(({ user }) => user.discordId),
    ).toEqual(["202"]);
    act(() => result.current.setDiscordSearch(" SHARED nick "));
    expect(result.current.discordRows).toHaveLength(2);
    expect(result.current.selectedDiscordUser).toBeNull();
  });

  it("keeps explicit selections when search hides their rows", () => {
    const { result } = renderHook(() => useSmartPicker(pickerArgs()));
    act(() => {
      result.current.selectCharacter(characters[0]);
      result.current.selectDiscordUser(accounts[1]);
      result.current.setCharacterSearch("Bram");
      result.current.setDiscordSearch("101");
    });
    expect(
      result.current.characterRows.map(
        ({ character }) => character.characterId,
      ),
    ).toEqual(["2"]);
    expect(
      result.current.discordRows.map(({ user }) => user.discordId),
    ).toEqual(["101"]);
    expect(result.current.selectedCharacter).toEqual(characters[0]);
    expect(result.current.selectedDiscordUser).toEqual(accounts[1]);
    expect(result.current.canLink).toBe(true);
  });

  it("stops using a removed character for ranking while retaining the available Discord choice", () => {
    const args = pickerArgs();
    const { result, rerender } = renderHook((props) => useSmartPicker(props), {
      initialProps: args,
    });
    act(() => {
      result.current.selectCharacter(characters[0]);
      result.current.selectDiscordUser(accounts[1]);
    });
    expect(
      result.current.discordRows.map(({ user }) => user.discordId),
    ).toEqual(["202", "101"]);
    expect(args.getRankedDiscordUsers).toHaveBeenCalledExactlyOnceWith(
      characters[0],
    );

    rerender({ ...args, allCharacters: [characters[1]] });
    expect(result.current.selectedCharacter).toBeNull();
    expect(result.current.selectedDiscordUser).toEqual(accounts[1]);
    expect(result.current.canLink).toBe(false);
    expect(
      result.current.discordRows.map(({ user }) => user.discordId),
    ).toEqual(["101", "202"]);
    expect(args.getRankedDiscordUsers).toHaveBeenCalledOnce();
    act(() => result.current.selectCharacter(characters[0]));
    expect(result.current.selectedCharacter).toBeNull();
    expect(args.getRankedDiscordUsers).toHaveBeenCalledOnce();
    act(() => result.current.selectCharacter(characters[1]));
    expect(result.current.canLink).toBe(true);
    expect(args.getRankedDiscordUsers).toHaveBeenLastCalledWith(characters[1]);
  });

  it("stops using a removed Discord account for ranking while retaining the available character", () => {
    const args = pickerArgs();
    const { result, rerender } = renderHook((props) => useSmartPicker(props), {
      initialProps: args,
    });
    act(() => {
      result.current.selectCharacter(characters[1]);
      result.current.selectDiscordUser(accounts[0]);
    });
    expect(
      result.current.characterRows.map(
        ({ character }) => character.characterId,
      ),
    ).toEqual(["2", "1"]);

    rerender({ ...args, allDiscordUsers: [accounts[1]] });
    expect(result.current.selectedCharacter).toEqual(characters[1]);
    expect(result.current.selectedDiscordUser).toBeNull();
    expect(result.current.canLink).toBe(false);
    expect(
      result.current.characterRows.map(
        ({ character }) => character.characterId,
      ),
    ).toEqual(["1", "2"]);
    expect(args.getRankedCharacters).toHaveBeenCalledExactlyOnceWith(
      accounts[0],
    );
    act(() => result.current.selectDiscordUser(accounts[0]));
    expect(result.current.selectedDiscordUser).toBeNull();
    expect(args.getRankedCharacters).toHaveBeenCalledOnce();
    act(() => result.current.selectDiscordUser(accounts[1]));
    expect(result.current.canLink).toBe(true);
    expect(args.getRankedCharacters).toHaveBeenLastCalledWith(accounts[1]);
  });
});

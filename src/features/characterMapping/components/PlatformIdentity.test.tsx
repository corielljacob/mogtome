import { fireEvent, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ffxivIcon from "@/assets/icons/ffxiv.png";
import type { MatchPair } from "../types";
import { CharacterItem } from "./CharacterItem";
import { DiscordUserItem } from "./DiscordUserItem";
import { MappingPlatformIcon } from "./MappingPlatformIcon";
import { PairCard } from "./PairCard";

const pair: MatchPair = {
  character: {
    characterId: "character-ada",
    name: "Ada Bloom",
    avatarLink: "https://example.com/ada.jpg",
    freeCompanyRank: "Moogle Knight",
  },
  discordUser: {
    discordId: "123456789012345678",
    serverNickName: "Ada | gathering and crafting",
  },
  confidence: "exact",
  score: 1,
};

describe("Character linking identities", () => {
  it("uses the existing FFXIV image and decorative Discord SVG without adding names to the accessibility tree", () => {
    const { container } = render(
      <>
        <MappingPlatformIcon
          platform="ffxiv"
          size={24}
          className="custom-icon"
        />
        <MappingPlatformIcon platform="discord" />
      </>,
    );

    const ffxiv = container.querySelector('[data-platform="ffxiv"]');
    const discord = container.querySelector('[data-platform="discord"]');
    expect(ffxiv).toHaveAttribute("aria-hidden", "true");
    expect(ffxiv).toHaveClass("dash-mapping-platform-icon", "custom-icon");
    expect(ffxiv?.querySelector("img")).toHaveAttribute("src", ffxivIcon);
    expect(ffxiv?.querySelector("img")).toHaveAttribute("alt", "");
    expect(discord).toHaveAttribute("aria-hidden", "true");
    expect(discord?.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 0 24 24",
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("keeps available portraits, falls back after failure, and retries portraits when their URL changes", () => {
    const onClick = vi.fn();
    const { container, rerender } = render(
      <CharacterItem
        character={pair.character}
        isSelected={false}
        onClick={onClick}
      />,
    );
    const portrait = container.querySelector("img")!;
    expect(portrait).toHaveAttribute("src", pair.character.avatarLink);
    fireEvent.error(portrait);
    expect(container.querySelector("img")).toHaveAttribute("src", ffxivIcon);
    expect(
      screen.getByRole("button", { name: "Select character Ada Bloom" }),
    ).toBeEnabled();

    rerender(
      <CharacterItem
        character={{
          ...pair.character,
          avatarLink: "https://example.com/new-ada.jpg",
        }}
        isSelected={false}
        onClick={onClick}
      />,
    );
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://example.com/new-ada.jpg",
    );
    fireEvent.error(container.querySelector("img")!);
    rerender(
      <CharacterItem
        character={pair.character}
        isSelected={false}
        onClick={onClick}
      />,
    );
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      pair.character.avatarLink,
    );
  });

  it("clearly labels both platforms in a suggested pair and preserves confidence and action names", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onSkip = vi.fn();
    const { rerender } = render(
      <PairCard
        pair={pair}
        onConfirm={onConfirm}
        onSkip={onSkip}
        isConfirming={false}
      />,
    );
    const article = screen.getByRole("article", {
      name: "Ada Bloom and Ada | gathering and crafting",
    });

    expect(within(article).getByText("FFXIV character")).toBeInTheDocument();
    expect(within(article).getByText("Discord account")).toBeInTheDocument();
    expect(within(article).getByText("Exact name match")).toBeInTheDocument();
    expect(
      within(article).getByText(`ID ${pair.discordUser.discordId}`),
    ).toBeInTheDocument();
    const portrait = article.querySelector(".dash-mapping-portrait-image")!;
    fireEvent.error(portrait);
    expect(article.querySelector(".dash-mapping-portrait img")).toHaveAttribute(
      "src",
      ffxivIcon,
    );
    await user.click(
      screen.getByRole("button", {
        name: "Link Ada Bloom to Ada | gathering and crafting",
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Skip the match for Ada Bloom" }),
    );
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onSkip).toHaveBeenCalledOnce();

    rerender(
      <PairCard
        pair={pair}
        onConfirm={onConfirm}
        onSkip={onSkip}
        isConfirming
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Link Ada Bloom to Ada | gathering and crafting",
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Skip the match for Ada Bloom" }),
    ).toBeDisabled();
  });

  it("uses Discord's icon for account rows while preserving full identity and selection behavior", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(
      <DiscordUserItem
        user={pair.discordUser}
        isSelected={false}
        onClick={onClick}
      />,
    );
    const button = screen.getByRole("button", {
      name: "Select Discord account Ada | gathering and crafting",
    });

    expect(
      button.querySelector('[data-platform="discord"] svg'),
    ).toBeInTheDocument();
    expect(
      within(button).getByText(pair.discordUser.serverNickName),
    ).toBeInTheDocument();
    expect(
      within(button).getByText(`ID ${pair.discordUser.discordId}`),
    ).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
      <DiscordUserItem
        user={pair.discordUser}
        isSelected
        onClick={onClick}
        disabled
      />,
    );

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});

import { useState, type ComponentProps } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { MatchPair } from "../types";
import { SuggestedPairs } from "./SuggestedPairs";

const pairs: MatchPair[] = [
  {
    character: {
      characterId: "ada",
      name: "Ada Bloom",
      avatarLink: "",
      freeCompanyRank: "Moogle Knight",
    },
    discordUser: { discordId: "11223344", serverNickName: "Bloom's garden" },
    confidence: "exact",
    score: 1,
  },
  {
    character: {
      characterId: "bram",
      name: "Bram Fern",
      avatarLink: "",
      freeCompanyRank: "Mandragora",
    },
    discordUser: { discordId: "55667788", serverNickName: "Bram Fern" },
    confidence: "exact",
    score: 1,
  },
  {
    character: {
      characterId: "cedar",
      name: "Cedar Rain",
      avatarLink: "",
      freeCompanyRank: "Paissa",
    },
    discordUser: { discordId: "99001122", serverNickName: "Rainy days" },
    confidence: "medium",
    score: 0.5,
  },
];

function makeProps(
  overrides: Partial<ComponentProps<typeof SuggestedPairs>> = {},
): ComponentProps<typeof SuggestedPairs> {
  return {
    pairs,
    exactCount: 2,
    confirmingPairKey: null,
    isConfirmingAll: false,
    onConfirm: vi.fn(),
    onSkip: vi.fn(),
    onConfirmAllExact: vi.fn(),
    onGoManual: vi.fn(),
    ...overrides,
  };
}

const getSearch = () =>
  screen.getByRole("searchbox", { name: "Find a suggested pair" });
const getResults = () =>
  screen.getByRole("status", { name: "Suggestion results" });

describe("Suggested pair browsing", () => {
  it.each(["  ADA BLOOM  ", "garden", "223344"])(
    "finds a pair by character name, Discord name, or Discord ID: %s",
    async (query) => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<SuggestedPairs {...props} />);
      await user.type(getSearch(), query);

      expect(screen.getAllByRole("article")).toHaveLength(1);
      expect(
        screen.getByRole("article", { name: "Ada Bloom and Bloom's garden" }),
      ).toBeVisible();
      expect(getResults()).toHaveTextContent("1 of 3 shown");
      expect(
        screen.queryByRole("button", { name: "Link 2 exact matches" }),
      ).not.toBeInTheDocument();
      await user.click(
        screen.getByRole("button", {
          name: "Link Ada Bloom to Bloom's garden",
        }),
      );
      expect(props.onConfirm).toHaveBeenCalledExactlyOnceWith(pairs[0]);
      expect(props.onConfirmAllExact).not.toHaveBeenCalled();
    },
  );

  it("groups exact and other suggestions, hiding empty groups as search narrows the results", async () => {
    const user = userEvent.setup();
    render(<SuggestedPairs {...makeProps()} />);
    expect(
      within(
        screen.getByRole("region", { name: "Exact name matches" }),
      ).getAllByRole("article"),
    ).toHaveLength(2);
    expect(
      within(
        screen.getByRole("region", { name: "Other suggestions" }),
      ).getAllByRole("article"),
    ).toHaveLength(1);

    await user.type(getSearch(), "rainy");
    expect(
      screen.queryByRole("region", { name: "Exact name matches" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Other suggestions" }),
    ).toBeVisible();
    expect(getResults()).toHaveTextContent("1 of 3 shown");
  });

  it("clears filtering back to the full queue and returns focus to the search", async () => {
    const user = userEvent.setup();
    const props = makeProps();
    render(<SuggestedPairs {...props} />);
    await user.type(getSearch(), "Ada");
    expect(
      screen.getByText(
        "Clear the search to review and link all exact matches together.",
      ),
    ).toBeVisible();

    await user.click(
      screen.getByRole("button", { name: "Clear suggested pair search" }),
    );
    expect(getSearch()).toHaveFocus();
    expect(getSearch()).toHaveValue("");
    expect(getResults()).toHaveTextContent("3 of 3 shown");
    expect(screen.getAllByRole("article")).toHaveLength(3);
    await user.click(
      screen.getByRole("button", { name: "Link 2 exact matches" }),
    );
    expect(props.onConfirmAllExact).toHaveBeenCalledOnce();
    expect(props.onConfirm).not.toHaveBeenCalled();
  });

  it("clears search with Escape while respecting text composition and treating whitespace as no filter", async () => {
    const user = userEvent.setup();
    render(<SuggestedPairs {...makeProps()} />);
    await user.type(getSearch(), "Ada");
    fireEvent.keyDown(getSearch(), { key: "Escape", isComposing: true });
    expect(getSearch()).toHaveValue("Ada");
    await user.keyboard("{Escape}");
    expect(getSearch()).toHaveValue("");
    expect(getSearch()).toHaveFocus();

    await user.type(getSearch(), "   ");
    expect(getResults()).toHaveTextContent("3 of 3 shown");
    expect(
      screen.getByRole("button", { name: "Link 2 exact matches" }),
    ).toBeEnabled();
  });

  it("distinguishes no search results from an empty queue and offers the appropriate recovery", async () => {
    const user = userEvent.setup();
    const props = makeProps();
    const view = render(<SuggestedPairs {...props} />);
    await user.type(getSearch(), "no such person");
    expect(
      screen.getByRole("heading", { name: "No matching suggestions" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "No suggestions to review" }),
    ).not.toBeInTheDocument();
    expect(getResults()).toHaveTextContent("0 of 3 shown");
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(getSearch()).toHaveFocus();
    expect(getResults()).toHaveTextContent("3 of 3 shown");

    view.rerender(<SuggestedPairs {...props} pairs={[]} exactCount={0} />);
    expect(
      screen.getByRole("heading", { name: "No suggestions to review" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "No matching suggestions" }),
    ).not.toBeInTheDocument();
    expect(getResults()).toHaveTextContent("0 of 0 shown");
    await user.click(screen.getByRole("button", { name: "Choose by hand" }));
    expect(props.onGoManual).toHaveBeenCalledOnce();
  });

  it("keeps keyboard focus on the results and announces a skip, including the final remaining pair", async () => {
    const user = userEvent.setup();
    const props = makeProps();
    function SkippableQueue() {
      const [remaining, setRemaining] = useState([pairs[0]]);
      return (
        <SuggestedPairs
          {...props}
          pairs={remaining}
          exactCount={remaining.length}
          onSkip={(pair) => {
            props.onSkip(pair);
            setRemaining((current) =>
              current.filter((candidate) => candidate !== pair),
            );
          }}
        />
      );
    }
    render(<SkippableQueue />);
    screen
      .getByRole("button", { name: "Skip the match for Ada Bloom" })
      .focus();
    await user.keyboard("{Enter}");

    expect(getResults()).toHaveFocus();
    expect(getResults()).toHaveTextContent(
      "Skipped the match for Ada Bloom. 0 of 0 shown",
    );
    expect(
      screen.getByRole("heading", { name: "No suggestions to review" }),
    ).toBeVisible();
    expect(props.onSkip).toHaveBeenCalledExactlyOnceWith(pairs[0]);
    expect(props.onConfirm).not.toHaveBeenCalled();
    expect(props.onConfirmAllExact).not.toHaveBeenCalled();
  });

  it("does not steal focus when the user moves away before a skipped pair disappears", async () => {
    const user = userEvent.setup();
    const props = makeProps();
    const view = render(<SuggestedPairs {...props} />);
    await user.click(
      screen.getByRole("button", { name: "Skip the match for Ada Bloom" }),
    );
    await user.click(getSearch());
    await user.type(getSearch(), "Bram");

    view.rerender(
      <SuggestedPairs {...props} pairs={pairs.slice(1)} exactCount={1} />,
    );
    expect(getSearch()).toHaveFocus();
    expect(getSearch()).toHaveValue("Bram");
    expect(getResults()).toHaveTextContent("1 of 2 shown");
    expect(getResults()).not.toHaveTextContent("Skipped");
  });

  it("locks search, clear, skip, and link actions while a pair is saving", async () => {
    const user = userEvent.setup();
    const props = makeProps();
    const view = render(<SuggestedPairs {...props} />);
    await user.type(getSearch(), "Ada");
    view.rerender(
      <SuggestedPairs {...props} confirmingPairKey="ada::11223344" />,
    );

    expect(getSearch()).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Clear suggested pair search" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Skip the match for Ada Bloom" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Link Ada Bloom to Bloom's garden" }),
    ).toBeDisabled();
    await user.click(
      screen.getByRole("button", { name: "Skip the match for Ada Bloom" }),
    );
    expect(props.onSkip).not.toHaveBeenCalled();
  });
});

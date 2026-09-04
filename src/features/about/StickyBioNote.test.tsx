import type { ComponentProps, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { biographyApi } from "@/shared/api/biography";
import { StickyBioNote } from "./StickyBioNote";

vi.mock("@/shared/api/biography", () => ({
  biographyApi: { setBiography: vi.fn() },
}));

const defaultProps: ComponentProps<typeof StickyBioNote> = {
  bio: "I like gathering and helping new members.",
  rankHex: "#71836a",
  editable: true,
  tilt: 0,
  memberName: "Ada Bloom",
};

function renderBio(
  overrides: Partial<ComponentProps<typeof StickyBioNote>> = {},
) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  const invalidate = vi.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return {
    ...render(<StickyBioNote {...defaultProps} {...overrides} />, { wrapper }),
    invalidate,
  };
}

describe("Staff biography note", () => {
  beforeEach(() => {
    vi.mocked(biographyApi.setBiography).mockReset();
    vi.mocked(biographyApi.setBiography).mockResolvedValue(undefined);
  });

  it("preserves the complete biography and offers an accessible expander for long notes", async () => {
    const user = userEvent.setup();
    const bio =
      "I enjoy exploring Eorzea with friends. ".repeat(10) +
      "\nSee you in game!";
    renderBio({ bio, editable: false });
    const region = screen.getByRole("region", {
      name: "Ada Bloom's biography",
    });
    const expand = screen.getByRole("button", { name: "Read full bio" });
    const content = document.getElementById(
      expand.getAttribute("aria-controls")!,
    );

    expect(region).toContainElement(content);
    expect(content?.textContent).toBe(bio);
    expect(expand).toHaveAttribute("aria-expanded", "false");
    await user.click(expand);
    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(content?.textContent).toBe(bio);
    await user.click(screen.getByRole("button", { name: "Show less" }));
    expect(expand).toHaveAttribute("aria-expanded", "false");
    expect(biographyApi.setBiography).not.toHaveBeenCalled();
  });

  it("does not offer editing when the member is not allowed to edit", () => {
    renderBio({ editable: false });

    expect(screen.getByText(defaultProps.bio!)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /my bio/ }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Read full bio" }),
    ).not.toBeInTheDocument();
    expect(biographyApi.setBiography).not.toHaveBeenCalled();
  });

  it("allows adding an empty biography and focuses the labeled editor", async () => {
    const user = userEvent.setup();
    renderBio({ bio: undefined });

    await user.click(screen.getByRole("button", { name: "Add my bio" }));

    const editor = screen.getByRole("textbox", { name: "Your biography" });
    expect(editor).toHaveFocus();
    expect(editor).toHaveValue("");
    expect(editor).toHaveAttribute("maxlength", "500");
    expect(editor).toHaveAccessibleDescription("0 / 500 characters");
  });

  it("keeps the character counter in sync and limits new input to 500 characters", async () => {
    const user = userEvent.setup();
    renderBio({ bio: "x".repeat(499) });
    await user.click(screen.getByRole("button", { name: "Edit my bio" }));
    const editor = screen.getByRole("textbox", {
      name: "Your biography",
    }) as HTMLTextAreaElement;
    editor.setSelectionRange(499, 499);

    await user.type(editor, "yz");

    expect(editor).toHaveValue("x".repeat(499) + "y");
    expect(editor).toHaveAccessibleDescription("500 / 500 characters");
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
  });

  it("saves through the existing API, prevents repeat submits, refreshes staff, and returns focus", async () => {
    const user = userEvent.setup();
    let resolveSave!: () => void;
    vi.mocked(biographyApi.setBiography).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        }),
    );
    const { invalidate } = renderBio();
    await user.click(screen.getByRole("button", { name: "Edit my bio" }));
    const editor = screen.getByRole("textbox", { name: "Your biography" });
    fireEvent.change(editor, {
      target: {
        value: "  Gathering, crafting, and helping.\nAsk me about fishing!  ",
      },
    });

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(biographyApi.setBiography).toHaveBeenCalledExactlyOnceWith(
      "Gathering, crafting, and helping.\nAsk me about fishing!",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Saving your bio…");
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(editor).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Saving…" }));
    expect(biographyApi.setBiography).toHaveBeenCalledOnce();
    await act(async () => resolveSave());

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Edit my bio" })).toHaveFocus(),
    );
    expect(
      screen.getByRole("region", { name: "Ada Bloom's biography" }).textContent,
    ).toBe("Gathering, crafting, and helping.\nAsk me about fishing!");
    expect(screen.getByRole("status")).toHaveTextContent("Bio saved.");
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["staff"] });
  });

  it("keeps failed changes available for a successful retry", async () => {
    const user = userEvent.setup();
    vi.mocked(biographyApi.setBiography).mockRejectedValueOnce(
      new Error("Unavailable"),
    );
    renderBio();
    await user.click(screen.getByRole("button", { name: "Edit my bio" }));
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "A new note." },
    });
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Couldn't save your bio. Your changes are still here. Try again.",
    );
    expect(screen.getByRole("textbox")).toHaveValue("A new note.");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Edit my bio" })).toHaveFocus(),
    );
    expect(biographyApi.setBiography).toHaveBeenCalledTimes(2);
    expect(biographyApi.setBiography).toHaveBeenLastCalledWith("A new note.");
    expect(screen.getByText("A new note.")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("discards edits and old errors on Cancel, restores focus, and reopens with the saved biography", async () => {
    const user = userEvent.setup();
    vi.mocked(biographyApi.setBiography).mockRejectedValueOnce(
      new Error("Unavailable"),
    );
    renderBio();
    await user.click(screen.getByRole("button", { name: "Edit my bio" }));
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Unsaved changes." },
    });
    await user.click(screen.getByRole("button", { name: "Save" }));
    await screen.findByRole("alert");

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByRole("button", { name: "Edit my bio" })).toHaveFocus();
    expect(screen.getByText(defaultProps.bio!)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Edit my bio" }));
    expect(screen.getByRole("textbox")).toHaveValue(defaultProps.bio);
    expect(screen.getByRole("textbox")).toHaveFocus();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(biographyApi.setBiography).toHaveBeenCalledOnce();
  });

  it("uses fresh server text for the next edit and hides editing if permission is removed", async () => {
    const user = userEvent.setup();
    const { rerender } = renderBio();
    rerender(
      <StickyBioNote {...defaultProps} bio="Updated on another page." />,
    );
    await user.click(screen.getByRole("button", { name: "Edit my bio" }));
    expect(screen.getByRole("textbox")).toHaveValue("Updated on another page.");

    rerender(
      <StickyBioNote
        {...defaultProps}
        bio="Updated on another page."
        editable={false}
      />,
    );

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /my bio/ }),
    ).not.toBeInTheDocument();
    expect(biographyApi.setBiography).not.toHaveBeenCalled();
  });
});

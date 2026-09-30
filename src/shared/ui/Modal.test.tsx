import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Modal } from "./Modal";

vi.mock("@/shared/hooks/useMobile", () => ({
  useIsMobile: () => false,
}));

function ModalHarness({
  onClose = () => {},
  consumeEscape = false,
}: {
  onClose?: (value: string) => void;
  consumeEscape?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <>
      <button onClick={() => setOpen(true)}>Edit note</button>
      <Modal
        open={open}
        title="Member note"
        onClose={() => {
          onClose(value);
          setOpen(false);
        }}
      >
        <input
          aria-label="Note"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (consumeEscape && event.key === "Escape") event.preventDefault();
          }}
        />
      </Modal>
    </>
  );
}

afterEach(() => {
  cleanup();
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
});

describe("Modal keyboard and focus behavior", () => {
  it("preserves typing focus across callback changes and closes with the latest value", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ModalHarness onClose={onClose} />);
    const trigger = screen.getByRole("button", { name: "Edit note" });
    await user.click(trigger);

    expect(screen.getByRole("dialog", { name: "Member note" })).toHaveFocus();
    const note = screen.getByRole("textbox", { name: "Note" });
    await user.type(note, "A familiar face");

    expect(note).toHaveValue("A familiar face");
    expect(note).toHaveFocus();
    expect(onClose).not.toHaveBeenCalled();

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledExactlyOnceWith("A familiar face");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("leaves an Escape consumed by a child control available to that control", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ModalHarness onClose={onClose} consumeEscape />);
    await user.click(screen.getByRole("button", { name: "Edit note" }));
    const note = screen.getByRole("textbox", { name: "Note" });
    await user.click(note);
    await user.keyboard("{Escape}");

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(note).toHaveFocus();
  });

  it("does not dismiss the dialog while Escape is part of text composition", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ModalHarness onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "Edit note" }));
    const note = screen.getByRole("textbox", { name: "Note" });
    note.focus();

    fireEvent.keyDown(note, { key: "Escape", isComposing: true });

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(note).toHaveFocus();
  });

  it("restores the page scroll settings and trigger focus when dismissed", async () => {
    const user = userEvent.setup();
    document.documentElement.style.overflow = "clip";
    document.body.style.overflow = "auto";
    render(<ModalHarness />);
    const trigger = screen.getByRole("button", { name: "Edit note" });
    await user.click(trigger);

    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(document.documentElement.style.overflow).toBe("clip");
    expect(document.body.style.overflow).toBe("auto");
    expect(trigger).toHaveFocus();
  });
});

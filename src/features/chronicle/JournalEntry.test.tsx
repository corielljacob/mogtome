import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { JournalEntry } from "./JournalEntry";
import { LiveStatus } from "./LiveStatus";
import type { EntryItem } from "./chronicleHelpers";
import type { ConnectionStatus } from "@/shared/realtime/useEventsHub";

const item: EntryItem = {
  event: {
    id: { timestamp: 1, creationTime: "2026-09-28T12:00:00Z" },
    type: "MemberJoined",
    text: "Ada Bloom joined Kupo Life.\nWelcome, <kupo> & friends!",
    createdAt: "2026-09-28T12:00:00Z",
  },
  isRealtime: true,
  isUnseen: true,
};

describe("JournalEntry", () => {
  it("preserves event text and shows a local clock time with a complete date label", () => {
    const { container } = render(
      <ul>
        <JournalEntry item={item} />
      </ul>,
    );
    expect(screen.getByText("Member Joined")).toBeInTheDocument();
    expect(container.querySelector(".chronicle-entry-text")?.textContent).toBe(
      item.event.text,
    );
    expect(container.querySelector("kupo")).not.toBeInTheDocument();
    const timestamp = container.querySelector("time");
    expect(timestamp).toHaveAttribute("dateTime", item.event.createdAt);
    expect(timestamp).toHaveTextContent(
      new Date(item.event.createdAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    );
    expect(timestamp?.textContent).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
    expect(timestamp?.getAttribute("title")).toContain("2026");
    expect(timestamp?.getAttribute("title")).toContain("September");
    expect(timestamp).toHaveAttribute(
      "aria-label",
      timestamp?.getAttribute("title"),
    );
  });

  it("expands a long announcement verbatim and preserves expansion when marked seen", () => {
    const text =
      "A longer note for everyone. ".repeat(18) +
      "Keep this final detail.\n<kupo> & friends!";
    const announcement = {
      ...item,
      event: { ...item.event, type: "Announcement", text },
    };
    const { container, rerender } = render(
      <ul>
        <JournalEntry item={announcement} />
      </ul>,
    );
    const expand = screen.getByRole("button", {
      name: "Read full announcement",
    });
    expect(expand).toHaveAttribute("aria-expanded", "false");
    expect(expand).toHaveAttribute(
      "aria-controls",
      container.querySelector("p")?.id,
    );
    expect(
      screen.queryByText(/Keep this final detail/),
    ).not.toBeInTheDocument();

    fireEvent.click(expand);
    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(container.querySelector("p")?.textContent).toBe(text);
    expect(container.querySelector("kupo")).not.toBeInTheDocument();

    rerender(
      <ul>
        <JournalEntry item={{ ...announcement, isUnseen: false }} />
      </ul>,
    );
    expect(container.querySelector("p")?.textContent).toBe(text);
    fireEvent.click(screen.getByRole("button", { name: "Show less" }));
    expect(
      screen.getByRole("button", { name: "Read full announcement" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByText(/Keep this final detail/),
    ).not.toBeInTheDocument();
  });

  it("collapses announcements longer than five lines even when fewer than 400 characters", () => {
    const text =
      "First line\r\nSecond line\r\nThird line\r\nFourth line\r\nFifth line\r\nSixth line";
    const { container } = render(
      <ul>
        <JournalEntry
          item={{
            ...item,
            event: { ...item.event, type: "Announcement", text },
          }}
        />
      </ul>,
    );
    expect(screen.queryByText(/Sixth line/)).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Read full announcement" }),
    );
    expect(container.querySelector("p")?.textContent).toBe(text);
  });

  it("leaves short announcements and long ordinary event text fully visible", () => {
    const shortAnnouncement = {
      ...item,
      event: {
        ...item.event,
        type: "Announcement",
        text: "Welcome to the FC.",
      },
    };
    const { container, rerender } = render(
      <ul>
        <JournalEntry item={shortAnnouncement} />
      </ul>,
    );
    expect(screen.getByText("Welcome to the FC.")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    const longEvent = "A long event detail. ".repeat(30);
    rerender(
      <ul>
        <JournalEntry
          item={{ ...item, event: { ...item.event, text: longEvent } }}
        />
      </ul>,
    );
    expect(container.querySelector("p")?.textContent).toBe(longEvent);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("removes the new indicator when an entry is marked seen without removing its text", () => {
    const { rerender } = render(
      <ul>
        <JournalEntry item={item} />
      </ul>,
    );
    expect(screen.getByText("New")).toBeInTheDocument();
    rerender(
      <ul>
        <JournalEntry item={{ ...item, isUnseen: false }} />
      </ul>,
    );
    expect(screen.queryByText("New")).not.toBeInTheDocument();
    expect(screen.getByText(/Ada Bloom joined Kupo Life/)).toBeInTheDocument();
  });

  it("keeps unknown events readable and handles an invalid timestamp", () => {
    const { container } = render(
      <ul>
        <JournalEntry
          item={{
            ...item,
            event: { ...item.event, type: "FutureEvent", createdAt: "invalid" },
          }}
        />
      </ul>,
    );
    expect(screen.getByText("Event")).toBeInTheDocument();
    expect(screen.getByText("Date unavailable")).toBeInTheDocument();
    expect(container.querySelector("time")).not.toHaveAttribute("dateTime");
  });
});

describe("LiveStatus", () => {
  it.each<[ConnectionStatus, string]>([
    ["connected", "Live updates connected"],
    ["connecting", "Connecting…"],
    ["reconnecting", "Reconnecting…"],
    ["disconnected", "Live updates offline"],
    ["error", "Live updates offline"],
  ])("describes the %s connection state accurately", (status, label) => {
    render(<LiveStatus status={status} />);
    expect(screen.getByRole("status")).toHaveTextContent(label);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });
});

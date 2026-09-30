import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { chronicleDayId, type DayGroup } from "./chronicleHelpers";
import { ChronicleDayIndex } from "./ChronicleDayIndex";

// JSDOM does not evaluate responsive media queries; test both navigation modes' behavior.
vi.mock("./chronicle-day-index.css", () => ({}));
const { activeDayMock } = vi.hoisted(() => ({ activeDayMock: vi.fn() }));
vi.mock("./useChronicleActiveDay", () => ({
  useChronicleActiveDay: activeDayMock,
  default: activeDayMock,
}));

function dayGroup(date: string, label: string, count = 1): DayGroup {
  const createdAt = `${date}T12:00:00`;
  const localDate = new Date(createdAt);
  return {
    key: `${localDate.getFullYear()}-${localDate.getMonth()}-${localDate.getDate()}`,
    label,
    items: Array.from({ length: count }, (_, index) => ({
      event: {
        id: { timestamp: index + 1, creationTime: createdAt },
        createdAt,
        type: "MemberJoined",
        text: `Member ${index + 1} joined Kupo Life.`,
      },
      isRealtime: false,
      isUnseen: false,
    })),
  };
}

const groups = [
  dayGroup("2026-09-28", "Today", 2),
  dayGroup("2026-09-27", "Yesterday"),
];

function IndexedDays({
  days = groups,
  onBackToSearch,
}: {
  days?: DayGroup[];
  onBackToSearch?: () => void;
}) {
  return (
    <>
      <ChronicleDayIndex groups={days} onBackToSearch={onBackToSearch} />
      {days.map((group) => (
        <h2 key={group.key} id={chronicleDayId(group.key)} tabIndex={-1}>
          {group.label}
        </h2>
      ))}
    </>
  );
}

describe("Chronicle loaded day navigation", () => {
  beforeEach(() => {
    vi.mocked(Element.prototype.scrollIntoView).mockClear();
    activeDayMock.mockReturnValue(groups[0].key);
  });

  it("marks the currently read day without moving focus or scrolling", () => {
    const { rerender } = render(<IndexedDays />);
    const today = screen.getByRole("button", {
      name: "Today, Sep 28, 2026, 2 entries",
    });
    const yesterday = screen.getByRole("button", {
      name: "Yesterday, Sep 27, 2026, 1 entry",
    });
    expect(today).toHaveAttribute("aria-current", "date");
    expect(yesterday).not.toHaveAttribute("aria-current");

    activeDayMock.mockReturnValue(groups[1].key);
    rerender(<IndexedDays />);

    expect(today).not.toHaveAttribute("aria-current");
    expect(yesterday).toHaveAttribute("aria-current", "date");
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    expect(yesterday).not.toHaveFocus();
  });

  it("organizes only loaded days under their month and year in newest-first order", () => {
    const days = [
      ...groups,
      dayGroup("2026-08-31", "August 31"),
      dayGroup("2025-09-28", "September 28, 2025"),
    ];
    render(<IndexedDays days={days} />);
    const index = within(
      screen.getByRole("navigation", { name: "Days in this view" }),
    );

    expect(
      index.getByRole("heading", { name: "Jump to a day" }),
    ).toBeInTheDocument();
    expect(
      index
        .getAllByRole("heading", { level: 4 })
        .map((heading) => heading.textContent),
    ).toEqual(["September 2026", "August 2026", "September 2025"]);
    expect(
      index
        .getAllByRole("button", { name: /, \d+ entr(?:y|ies)$/ })
        .map((button) => button.getAttribute("aria-label")),
    ).toEqual([
      "Today, Sep 28, 2026, 2 entries",
      "Yesterday, Sep 27, 2026, 1 entry",
      "Monday, Aug 31, 2026, 1 entry",
      "Sunday, Sep 28, 2025, 1 entry",
    ]);
    expect(
      within(
        index.getByRole("region", { name: "September 2026" }),
      ).getAllByRole("button"),
    ).toHaveLength(2);
    expect(
      within(index.getByRole("region", { name: "August 2026" })).getByRole(
        "button",
        { name: "Monday, Aug 31, 2026, 1 entry" },
      ),
    ).toBeInTheDocument();
    expect(
      within(index.getByRole("region", { name: "September 2025" })).getByRole(
        "button",
        { name: "Sunday, Sep 28, 2025, 1 entry" },
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it("moves keyboard focus and scroll position to a day chosen from the index", async () => {
    const user = userEvent.setup();
    render(<IndexedDays />);
    const index = within(
      screen.getByRole("navigation", { name: "Days in this view" }),
    );
    index
      .getByRole("button", { name: "Yesterday, Sep 27, 2026, 1 entry" })
      .focus();

    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("heading", { name: "Yesterday", level: 2 }),
    ).toHaveFocus();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledOnce();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: "instant",
      block: "start",
    });
  });

  it("closes the day chooser after a selection and allows choosing the same day again", async () => {
    const user = userEvent.setup();
    render(<IndexedDays />);
    const chooser = screen.getByRole("button", { name: "Jump to a day" });
    expect(chooser).toHaveAttribute("aria-expanded", "false");

    await user.click(chooser);
    expect(chooser).toHaveAttribute("aria-expanded", "true");
    const panelId = chooser.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    const panel = document.getElementById(panelId!);
    expect(panel).not.toBeNull();
    await user.click(
      within(panel!).getByRole("button", {
        name: "Yesterday, Sep 27, 2026, 1 entry",
      }),
    );

    expect(chooser).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("heading", { name: "Yesterday", level: 2 }),
    ).toHaveFocus();
    await user.click(chooser);
    await user.click(
      within(panel!).getByRole("button", {
        name: "Yesterday, Sep 27, 2026, 1 entry",
      }),
    );
    expect(chooser).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("heading", { name: "Yesterday", level: 2 }),
    ).toHaveFocus();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(2);
  });

  it("closes the open panel on Escape and returns focus to Jump to a day", async () => {
    const user = userEvent.setup();
    render(<IndexedDays />);
    const chooser = screen.getByRole("button", { name: "Jump to a day" });
    await user.click(chooser);
    screen
      .getByRole("button", { name: "Yesterday, Sep 27, 2026, 1 entry" })
      .focus();

    await user.keyboard("{Escape}");

    expect(chooser).toHaveAttribute("aria-expanded", "false");
    expect(chooser).toHaveFocus();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it("updates available days when loaded groups change without moving the reader", () => {
    const { rerender } = render(<IndexedDays />);
    const yesterdayHeading = screen.getByRole("heading", {
      name: "Yesterday",
      level: 2,
    });
    yesterdayHeading.focus();
    const older = dayGroup("2026-08-31", "August 31");

    rerender(<IndexedDays days={[groups[1], older]} />);

    const index = within(
      screen.getByRole("navigation", { name: "Days in this view" }),
    );
    expect(
      index.queryByRole("button", { name: /Today,/ }),
    ).not.toBeInTheDocument();
    expect(
      index.getByRole("button", { name: "Monday, Aug 31, 2026, 1 entry" }),
    ).toBeInTheDocument();
    expect(
      index.getByRole("heading", { name: "August 2026", level: 4 }),
    ).toBeInTheDocument();
    expect(yesterdayHeading).toHaveFocus();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it("closes on an outside click without stealing focus from the clicked control", async () => {
    const user = userEvent.setup();
    render(
      <>
        <IndexedDays />
        <button type="button">Search the Chronicle</button>
      </>,
    );
    const chooser = screen.getByRole("button", { name: "Jump to a day" });
    const outside = screen.getByRole("button", {
      name: "Search the Chronicle",
    });
    await user.click(chooser);
    expect(chooser).toHaveAttribute("aria-expanded", "true");

    await user.click(outside);

    expect(chooser).toHaveAttribute("aria-expanded", "false");
    expect(outside).toHaveFocus();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it("closes when tabbing out of the index and lets focus continue forward", async () => {
    const user = userEvent.setup();
    render(
      <>
        <IndexedDays />
        <button type="button">Load older entries</button>
      </>,
    );
    const chooser = screen.getByRole("button", { name: "Jump to a day" });
    await user.click(chooser);
    screen
      .getByRole("button", { name: "Yesterday, Sep 27, 2026, 1 entry" })
      .focus();

    await user.tab();

    expect(chooser).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("button", { name: "Load older entries" }),
    ).toHaveFocus();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it("delegates Back to search to its callback without jumping to a day", async () => {
    const user = userEvent.setup();
    const onBackToSearch = vi.fn();
    render(<IndexedDays onBackToSearch={onBackToSearch} />);
    const chooser = screen.getByRole("button", { name: "Jump to a day" });
    await user.click(chooser);

    await user.click(screen.getByRole("button", { name: "Back to search" }));

    expect(onBackToSearch).toHaveBeenCalledOnce();
    expect(chooser).toHaveAttribute("aria-expanded", "false");
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: "Today", level: 2 }),
    ).not.toHaveFocus();
  });

  it.each([0, 1])("omits navigation for %i loaded days", (count) => {
    render(<ChronicleDayIndex groups={groups.slice(0, count)} />);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Jump to a day" }),
    ).not.toBeInTheDocument();
  });
});

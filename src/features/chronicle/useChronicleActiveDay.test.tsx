import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { chronicleDayId, type DayGroup } from "./chronicleHelpers";
import { useChronicleActiveDay } from "./useChronicleActiveDay";

const makeGroups = (...keys: string[]): DayGroup[] =>
  keys.map((key) => ({ key, label: key, items: [] }));

function Reader({ groups }: { groups: DayGroup[] }) {
  const activeKey = useChronicleActiveDay(groups);
  return (
    <>
      <output aria-label="Currently reading">{activeKey ?? "none"}</output>
      {groups.map((group) => (
        <h3 key={group.key} id={chronicleDayId(group.key)} tabIndex={-1}>
          {group.label}
        </h3>
      ))}
    </>
  );
}

let frames: Map<number, FrameRequestCallback>;
let nextFrame: number;
let headingTops: Record<string, number>;
let scrollTop: number;
let documentHeight: number;
let viewportHeight: number;

function flushFrame() {
  act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(0));
  });
}

beforeEach(() => {
  frames = new Map();
  nextFrame = 0;
  headingTops = {};
  scrollTop = 0;
  documentHeight = 3000;
  viewportHeight = 800;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    const id = ++nextFrame;
    frames.set(id, callback);
    return id;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
    frames.delete(id);
  });
  vi.spyOn(window, "scrollY", "get").mockImplementation(() => scrollTop);
  vi.spyOn(window, "innerHeight", "get").mockImplementation(
    () => viewportHeight,
  );
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockImplementation(
    () => documentHeight,
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      const top = headingTops[this.id] ?? 500;
      return {
        x: 0,
        y: top,
        top,
        right: 100,
        bottom: top + 30,
        left: 0,
        width: 100,
        height: 30,
        toJSON: () => ({}),
      };
    },
  );
});

afterEach(() => vi.restoreAllMocks());

describe("useChronicleActiveDay", () => {
  it("follows headings below the measured sticky toolbar and releases its space when disabled", () => {
    const groups = makeGroups("today", "yesterday");
    headingTops = {
      [chronicleDayId("today")]: -300,
      [chronicleDayId("yesterday")]: 208,
    };
    render(
      <section className="chronicle-workspace">
        <div data-view-toolbar style={{ top: 12 }} />
        <Reader groups={groups} />
      </section>,
    );
    const toolbar = document.querySelector<HTMLElement>("[data-view-toolbar]")!;
    Object.defineProperty(toolbar, "getBoundingClientRect", {
      value: vi.fn(() => ({
        top: 12,
        bottom: 192,
        height: 180,
      })),
    });
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "yesterday",
    );

    toolbar.dataset.stickyDisabled = "true";
    fireEvent.resize(window);
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "today",
    );
  });

  it("starts at the first day before the feed and follows the last heading above the reading line", () => {
    const groups = makeGroups("today", "yesterday", "monday");
    headingTops = {
      [chronicleDayId("today")]: 400,
      [chronicleDayId("yesterday")]: 900,
      [chronicleDayId("monday")]: 1400,
    };
    render(<Reader groups={groups} />);
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "today",
    );

    headingTops = {
      [chronicleDayId("today")]: -450,
      [chronicleDayId("yesterday")]: 96,
      [chronicleDayId("monday")]: 500,
    };
    fireEvent.scroll(window);
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "today",
    );
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "yesterday",
    );

    headingTops[chronicleDayId("yesterday")] = 97;
    fireEvent.scroll(window);
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "today",
    );
  });

  it("chooses the last day at document bottom even when its heading cannot reach the reading line", () => {
    const groups = makeGroups("today", "yesterday");
    headingTops[chronicleDayId("today")] = -1200;
    headingTops[chronicleDayId("yesterday")] = 300;
    scrollTop = 2199;
    render(<Reader groups={groups} />);
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "yesterday",
    );

    scrollTop = 2100;
    fireEvent.scroll(window);
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "today",
    );
  });

  it("keeps the first day as fallback in a document that does not scroll", () => {
    documentHeight = viewportHeight;
    render(<Reader groups={makeGroups("today", "yesterday")} />);
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "today",
    );
  });

  it("keeps a focused day jump active when the document bottom clamps its scroll position", () => {
    const groups = makeGroups("today", "yesterday", "saturday");
    viewportHeight = 844;
    scrollTop = documentHeight - viewportHeight;
    headingTops = {
      [chronicleDayId("today")]: -700,
      [chronicleDayId("yesterday")]: 106.8,
      [chronicleDayId("saturday")]: 401,
    };
    render(<Reader groups={groups} />);
    flushFrame();
    // Without a chosen target, the first visible day near the reading line wins.
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "yesterday",
    );

    act(() => screen.getByRole("heading", { name: "saturday" }).focus());
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "saturday",
    );
    // Same scroll position: focus alone must be enough to update the day.
    act(() => screen.getByRole("heading", { name: "yesterday" }).focus());
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "yesterday",
    );

    act(() => screen.getByRole("heading", { name: "saturday" }).focus());
    flushFrame();
    scrollTop -= 200;
    fireEvent.scroll(window);
    flushFrame();
    // Normal scrolling uses the reading line, not a previously focused heading.
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "today",
    );
  });

  it("ignores a focused heading outside the viewport at the document bottom", () => {
    scrollTop = documentHeight - viewportHeight;
    headingTops = {
      [chronicleDayId("today")]: -200,
      [chronicleDayId("yesterday")]: 120,
      [chronicleDayId("saturday")]: 450,
    };
    render(<Reader groups={makeGroups("today", "yesterday", "saturday")} />);
    act(() => screen.getByRole("heading", { name: "today" }).focus());
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "yesterday",
    );
  });

  it("drops a removed active key immediately and measures newly loaded groups", () => {
    const initialGroups = makeGroups("today", "yesterday");
    headingTops[chronicleDayId("today")] = -600;
    headingTops[chronicleDayId("yesterday")] = 50;
    const { rerender } = render(<Reader groups={initialGroups} />);
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "yesterday",
    );

    rerender(<Reader groups={[]} />);
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "none",
    );
    const nextGroups = makeGroups("monday", "sunday");
    headingTops[chronicleDayId("monday")] = -400;
    headingTops[chronicleDayId("sunday")] = 40;
    rerender(<Reader groups={nextGroups} />);
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "monday",
    );
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "sunday",
    );

    headingTops[chronicleDayId("saturday")] = 80;
    rerender(<Reader groups={[...nextGroups, ...makeGroups("saturday")]} />);
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "saturday",
    );
  });

  it("batches scroll and resize work in one frame and cancels listeners and frames on cleanup", () => {
    const addListener = vi.spyOn(window, "addEventListener");
    const removeListener = vi.spyOn(window, "removeEventListener");
    const addDocumentListener = vi.spyOn(document, "addEventListener");
    const removeDocumentListener = vi.spyOn(document, "removeEventListener");
    const { unmount } = render(
      <Reader groups={makeGroups("today", "yesterday")} />,
    );
    expect(frames.size).toBe(1);
    fireEvent.scroll(window);
    fireEvent.resize(window);
    expect(frames.size).toBe(1);
    flushFrame();

    headingTops[chronicleDayId("yesterday")] = 70;
    fireEvent.resize(window);
    expect(frames.size).toBe(1);
    flushFrame();
    expect(screen.getByLabelText("Currently reading")).toHaveTextContent(
      "yesterday",
    );

    fireEvent.scroll(window);
    const pendingFrame = [...frames.keys()][0];
    unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(pendingFrame);
    expect(frames.size).toBe(0);
    for (const name of ["scroll", "resize"]) {
      const listener = addListener.mock.calls.find(
        ([type]) => type === name,
      )?.[1];
      expect(removeListener).toHaveBeenCalledWith(name, listener);
    }
    const focusListener = addDocumentListener.mock.calls.find(
      ([type]) => type === "focusin",
    )?.[1];
    expect(removeDocumentListener).toHaveBeenCalledWith(
      "focusin",
      focusListener,
    );
    fireEvent.scroll(window);
    fireEvent.resize(window);
    fireEvent.focusIn(document.body);
    expect(frames.size).toBe(0);
  });
});

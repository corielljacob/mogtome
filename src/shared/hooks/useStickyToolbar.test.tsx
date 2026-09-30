import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { useStickyToolbar } from "./useStickyToolbar";

const observers: TestResizeObserver[] = [];
const originalResizeObserver = window.ResizeObserver;
let toolbarHeight = 80;

class TestResizeObserver implements ResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    observers.push(this);
  }

  resize() {
    this.callback([], this);
  }
}

function ToolbarHarness({ visible = true }: { visible?: boolean }) {
  const scopeRef = useRef<HTMLElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  useStickyToolbar(scopeRef, toolbarRef);

  return (
    <section ref={scopeRef} aria-label="Directory">
      {visible && (
        <div ref={toolbarRef} role="toolbar" aria-label="Search controls">
          Search and filters
        </div>
      )}
    </section>
  );
}

beforeEach(() => {
  observers.length = 0;
  toolbarHeight = 80;
  window.ResizeObserver = TestResizeObserver;
  vi.stubGlobal("innerHeight", 800);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => new DOMRect(0, 0, 600, toolbarHeight),
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.ResizeObserver = originalResizeObserver;
});

describe("useStickyToolbar", () => {
  it("updates scroll clearance when wrapping controls change height", () => {
    toolbarHeight = 83.25;
    render(<ToolbarHarness />);
    const scope = screen.getByRole("region", { name: "Directory" });
    const toolbar = screen.getByRole("toolbar");

    expect(scope.style.getPropertyValue("--view-toolbar-height")).toBe("84px");
    expect(toolbar).toHaveAttribute("data-view-toolbar", "true");
    expect(toolbar).toHaveAttribute("data-sticky-disabled", "false");
    expect(observers[0].observe).toHaveBeenCalledWith(toolbar);

    toolbarHeight = 145.2;
    act(() => observers[0].resize());

    expect(scope.style.getPropertyValue("--view-toolbar-height")).toBe("146px");
    expect(scope).toHaveAttribute("data-toolbar-sticky-disabled", "false");
  });

  it("lets controls scroll normally when they exceed 40% of the viewport", () => {
    vi.stubGlobal("innerHeight", 600);
    toolbarHeight = 240;
    render(<ToolbarHarness />);
    const scope = screen.getByRole("region", { name: "Directory" });
    const toolbar = screen.getByRole("toolbar");

    expect(toolbar).toHaveAttribute("data-sticky-disabled", "false");
    expect(scope.style.getPropertyValue("--view-toolbar-height")).toBe("240px");

    toolbarHeight = 241;
    act(() => observers[0].resize());

    expect(toolbar).toHaveAttribute("data-sticky-disabled", "true");
    expect(scope).toHaveAttribute("data-toolbar-sticky-disabled", "true");
    expect(scope.style.getPropertyValue("--view-toolbar-height")).toBe("0px");

    toolbarHeight = 200;
    act(() => observers[0].resize());

    expect(toolbar).toHaveAttribute("data-sticky-disabled", "false");
    expect(scope.style.getPropertyValue("--view-toolbar-height")).toBe("200px");
  });

  it("reconsiders stickiness when the viewport shrinks or grows", () => {
    toolbarHeight = 260;
    render(<ToolbarHarness />);
    const scope = screen.getByRole("region", { name: "Directory" });
    const toolbar = screen.getByRole("toolbar");
    expect(toolbar).toHaveAttribute("data-sticky-disabled", "false");

    vi.stubGlobal("innerHeight", 600);
    fireEvent(window, new Event("resize"));
    expect(toolbar).toHaveAttribute("data-sticky-disabled", "true");
    expect(scope.style.getPropertyValue("--view-toolbar-height")).toBe("0px");

    vi.stubGlobal("innerHeight", 1000);
    fireEvent(window, new Event("resize"));
    expect(toolbar).toHaveAttribute("data-sticky-disabled", "false");
    expect(scope.style.getPropertyValue("--view-toolbar-height")).toBe("260px");
  });

  it("measures controls appearing after loading and cleans up when they disappear", () => {
    const { rerender, unmount } = render(<ToolbarHarness visible={false} />);
    const scope = screen.getByRole("region", { name: "Directory" });
    expect(observers).toHaveLength(0);

    rerender(<ToolbarHarness />);
    const toolbar = screen.getByRole("toolbar");
    expect(scope.style.getPropertyValue("--view-toolbar-height")).toBe("80px");
    expect(observers).toHaveLength(1);

    rerender(<ToolbarHarness visible={false} />);
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    expect(scope.style.getPropertyValue("--view-toolbar-height")).toBe("");
    expect(scope).not.toHaveAttribute("data-toolbar-sticky-disabled");
    expect(toolbar).not.toHaveAttribute("data-view-toolbar");
    expect(toolbar).not.toHaveAttribute("data-sticky-disabled");
    fireEvent(window, new Event("resize"));
    expect(scope.style.getPropertyValue("--view-toolbar-height")).toBe("");

    rerender(<ToolbarHarness />);
    expect(observers).toHaveLength(2);
    expect(scope.style.getPropertyValue("--view-toolbar-height")).toBe("80px");

    unmount();
    expect(observers[1].disconnect).toHaveBeenCalledOnce();
    expect(scope.style.getPropertyValue("--view-toolbar-height")).toBe("");
    fireEvent(window, new Event("resize"));
    expect(scope.style.getPropertyValue("--view-toolbar-height")).toBe("");
  });
});

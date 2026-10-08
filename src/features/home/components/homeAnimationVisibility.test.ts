import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { observeHomeAnimationVisibility } from "./homeAnimationVisibility";

let root: HTMLDivElement;
let region: HTMLDivElement;
let visibility: DocumentVisibilityState;
let intersect: IntersectionObserverCallback;
let stop: (() => void) | undefined;
const disconnect = vi.fn();
const originalObserver = window.IntersectionObserver;

function clock(target: Element, running = true) {
  const animation = {
    currentTime: 1200,
    playbackRate: 1,
    playState: running ? "running" : "paused",
    effect: { target, getComputedTiming: () => ({ endTime: 4800 }) },
    pause: vi.fn(() => {
      animation.playState = "paused";
    }),
    play: vi.fn(() => {
      animation.playState = "running";
    }),
  };
  return animation;
}

function changeVisibility(next: DocumentVisibilityState) {
  visibility = next;
  document.dispatchEvent(new Event("visibilitychange"));
}

function changeIntersection(visible: boolean) {
  intersect(
    [
      {
        target: region,
        isIntersecting: visible,
        time: 0,
        rootBounds: null,
        boundingClientRect: region.getBoundingClientRect(),
        intersectionRect: region.getBoundingClientRect(),
        intersectionRatio: visible ? 1 : 0,
      },
    ],
    {} as IntersectionObserver,
  );
}

beforeEach(() => {
  visibility = "visible";
  vi.spyOn(document, "visibilityState", "get").mockImplementation(
    () => visibility,
  );
  window.IntersectionObserver = class {
    constructor(callback: IntersectionObserverCallback) {
      intersect = callback;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = disconnect;
  } as unknown as typeof IntersectionObserver;
  root = document.createElement("div");
  region = document.createElement("div");
  region.className = "nook-window-scene";
  root.append(region);
  document.body.append(root);
  disconnect.mockClear();
});

afterEach(() => {
  stop?.();
  stop = undefined;
  root.remove();
  vi.restoreAllMocks();
  window.IntersectionObserver = originalObserver;
});

it("freezes hidden transitions at their current exposure and leaves settled tracks alone", () => {
  const moving = clock(region);
  const settled = clock(region, false);
  const css = { ...clock(region), animationName: "ivy-sway" };
  Object.defineProperty(root, "getAnimations", {
    value: () => [moving, settled, css],
  });
  stop = observeHomeAnimationVisibility(root);

  changeVisibility("hidden");
  expect(root).toHaveAttribute("data-animation-paused", "true");
  expect(moving.pause).toHaveBeenCalledOnce();
  expect(moving.currentTime).toBe(1200);
  expect(settled.pause).not.toHaveBeenCalled();
  expect(css.pause).not.toHaveBeenCalled();

  changeVisibility("visible");
  expect(root).not.toHaveAttribute("data-animation-paused");
  expect(moving.play).toHaveBeenCalledOnce();
  expect(moving.currentTime).toBe(1200);
  expect(settled.play).not.toHaveBeenCalled();
});

it("keeps an offscreen region paused when the tab becomes visible", () => {
  const moving = clock(region);
  Object.defineProperty(region, "getAnimations", { value: () => [moving] });
  Object.defineProperty(root, "getAnimations", { value: () => [moving] });
  stop = observeHomeAnimationVisibility(root);

  changeIntersection(false);
  expect(region).toHaveAttribute("data-animation-paused", "true");
  expect(moving.pause).toHaveBeenCalledOnce();
  changeVisibility("hidden");
  changeVisibility("visible");
  expect(moving.play).not.toHaveBeenCalled();

  changeIntersection(true);
  expect(region).not.toHaveAttribute("data-animation-paused");
  expect(moving.play).toHaveBeenCalledOnce();
});

it("pauses a new script animation mounted while the tab is hidden", async () => {
  const moving = clock(region);
  const animations: ReturnType<typeof clock>[] = [];
  Object.defineProperty(root, "getAnimations", { value: () => animations });
  stop = observeHomeAnimationVisibility(root);
  changeVisibility("hidden");

  animations.push(moving);
  region.append(document.createElement("svg"));
  await Promise.resolve();

  expect(moving.pause).toHaveBeenCalledOnce();
  changeVisibility("visible");
  expect(moving.play).toHaveBeenCalledOnce();
});

it("resumes a pending pause after the browser advances to its last exposure", () => {
  const moving = clock(region);
  Object.defineProperty(root, "getAnimations", { value: () => [moving] });
  stop = observeHomeAnimationVisibility(root);
  changeVisibility("hidden");
  moving.currentTime += 16;

  changeVisibility("visible");

  expect(moving.play).toHaveBeenCalledOnce();
  expect(moving.currentTime).toBe(1216);
});

it.each(["endpoint", "reduced-motion", "cancelled"])(
  "does not revive a hidden track changed by %s",
  (change) => {
    const moving = clock(region);
    Object.defineProperty(root, "getAnimations", { value: () => [moving] });
    stop = observeHomeAnimationVisibility(root);
    changeVisibility("hidden");
    if (change === "endpoint") moving.currentTime = 4800;
    if (change === "reduced-motion")
      region.setAttribute("data-reduced-motion", "true");
    if (change === "cancelled") moving.playState = "idle";

    changeVisibility("visible");

    expect(moving.play).not.toHaveBeenCalled();
  },
);

it("cleans up observers and pause markers without leaving the mounted scene frozen", () => {
  const moving = clock(region);
  Object.defineProperty(region, "getAnimations", { value: () => [moving] });
  stop = observeHomeAnimationVisibility(root);
  changeIntersection(false);

  stop();
  stop = undefined;

  expect(disconnect).toHaveBeenCalledOnce();
  expect(root).not.toHaveAttribute("data-animation-paused");
  expect(region).not.toHaveAttribute("data-animation-paused");
  expect(moving.play).toHaveBeenCalledOnce();
  changeVisibility("hidden");
  expect(root).not.toHaveAttribute("data-animation-paused");
});

it("still pauses background work when IntersectionObserver is unavailable", () => {
  window.IntersectionObserver =
    undefined as unknown as typeof IntersectionObserver;
  stop = observeHomeAnimationVisibility(root);

  changeVisibility("hidden");
  expect(root).toHaveAttribute("data-animation-paused", "true");
  changeVisibility("visible");
  expect(root).not.toHaveAttribute("data-animation-paused");
});

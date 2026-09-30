import { render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NookWindowView } from "./NookWindowView";

const motion = vi.hoisted(() => ({ reduced: false }));
vi.mock("@/shared/hooks/useReducedMotion", () => ({
  useReducedMotion: () => motion.reduced,
}));
vi.mock("./NookEvercoldView", () => ({
  NookEvercoldView: ({ isDark }: { isDark: boolean }) => (
    <g data-testid={isDark ? "evercold-night" : "evercold-day"} />
  ),
}));
vi.mock("./NookDawntrailView", () => ({ NookDawntrailView: () => null }));
vi.mock("./NookShiroganeView", () => ({ NookShiroganeView: () => null }));

class Playback {
  currentTime = 0;
  playbackRate = 1;
  playState: AnimationPlayState = "running";
  pause = vi.fn(() => {
    this.playState = "paused";
  });
  play = vi.fn(() => {
    this.playState = "running";
  });
  updatePlaybackRate = vi.fn((rate: number) => {
    this.playbackRate = rate;
  });
  cancel = vi.fn(() => {
    this.playState = "idle";
    this.currentTime = 0;
  });
}
const tracks: { element: Element; playback: Playback }[] = [];
const originalAnimate = Object.getOwnPropertyDescriptor(
  Element.prototype,
  "animate",
);
beforeEach(() => {
  tracks.length = 0;
  motion.reduced = false;
  Object.defineProperty(Element.prototype, "animate", {
    configurable: true,
    value: function (this: Element) {
      const playback = new Playback();
      tracks.push({ element: this, playback });
      return playback as unknown as Animation;
    },
  });
});
afterEach(() => {
  if (originalAnimate)
    Object.defineProperty(Element.prototype, "animate", originalAnimate);
  else Reflect.deleteProperty(Element.prototype, "animate");
});

function expectSkyModels(container: HTMLElement) {
  expect(container.querySelector(".nook-ec-clouds")).not.toBeNull();
  expect(
    container.querySelector(".nook-ec-birds, .nook-ec-bird-flight"),
  ).toBeNull();
  expect(container.querySelector("[data-ambient-model]")).toBeNull();
  const clouds = Array.from(
    container.querySelectorAll('[data-cycle="evercold-clouds"]'),
  );
  expect(clouds.length).toBeGreaterThan(0);
  const cloudModels: Element[] = [];
  clouds.forEach((cloud) => {
    expect(cloud.closest(".nook-ec-clouds")).not.toBeNull();
    expect(cloud.closest(".nook-cycle-landscape")).toBeNull();
    expect(cloud.querySelector("[data-ambient-model]")).toBeNull();
    expect(tracks.some(({ element }) => element === cloud)).toBe(true);
    const poses = Array.from(cloud.querySelectorAll("[data-cycle-model]"));
    expect(poses.map((pose) => pose.getAttribute("data-cycle-model"))).toEqual([
      "0",
      "1",
      "2",
    ]);
    poses.forEach((pose) => {
      expect(pose.hasAttribute("data-ambient-model")).toBe(false);
      expect(tracks.some(({ element }) => element === pose)).toBe(true);
    });
    cloudModels.push(...poses);
  });
  return [...clouds, ...cloudModels];
}

function expectRetainedModels(container: HTMLElement, previous: Element[]) {
  const current = expectSkyModels(container);
  expect(current).toHaveLength(previous.length);
  current.forEach((model, index) => expect(model).toBe(previous[index]));
}

it("replaces the outdoor sky with sheltered glass while preserving and reversing exposure", () => {
  const { container, getByTestId, queryByTestId, rerender } = render(
    <NookWindowView isDark={false} eventId={null} colorTheme="dawntrail" />,
  );
  rerender(<NookWindowView isDark eventId={null} colorTheme="dawntrail" />);
  tracks.forEach(({ playback }) => {
    playback.currentTime = 1800;
  });
  const oldTracks = tracks.splice(0);
  rerender(<NookWindowView isDark eventId={null} colorTheme="evercold" />);
  oldTracks.forEach(({ playback }) =>
    expect(playback.cancel).toHaveBeenCalledOnce(),
  );
  expect(container.querySelector(".nook-ec-vault")).not.toBeNull();
  const models = expectSkyModels(container);
  expect(
    container.querySelector(
      '[data-cycle="sun"], [data-cycle="moon"], [data-cycle="stars"], [data-cycle="clouds"]',
    ),
  ).toBeNull();
  const initialCount = tracks.length;
  tracks.forEach(({ element, playback }) => {
    expect(element.isConnected).toBe(true);
    expect(playback.currentTime).toBe(1800);
    expect(playback.playbackRate).toBe(1);
    expect(playback.playState).toBe("running");
  });
  const city = getByTestId("evercold-day");
  rerender(
    <NookWindowView isDark={false} eventId={null} colorTheme="evercold" />,
  );
  expect(getByTestId("evercold-day")).toBe(city);
  expectRetainedModels(container, models);
  expect(tracks).toHaveLength(initialCount);
  tracks.forEach(({ playback }) => expect(playback.playbackRate).toBe(-1));
  const indoorTracks = tracks.splice(0);
  rerender(
    <NookWindowView
      isDark={false}
      eventId="all-saints-wake"
      colorTheme="evercold"
    />,
  );
  expect(queryByTestId("evercold-night")).toBeNull();
  expect(container.querySelector(".nook-ec-atmosphere")).toBeNull();
  expect(container.querySelector(".nook-ec-clouds, .nook-ec-birds")).toBeNull();
  expect(container.querySelector("[data-ambient-model]")).toBeNull();
  models.forEach((model) => expect(model.isConnected).toBe(false));
  expect(container.querySelector('[data-cycle="moon"]')).not.toBeNull();
  indoorTracks.forEach(({ playback }) =>
    expect(playback.cancel).toHaveBeenCalledOnce(),
  );
  tracks.forEach(({ playback }) => {
    expect(playback.currentTime).toBe(1800);
    expect(playback.playbackRate).toBe(-1);
  });
});

it.each([false, true])(
  "settles Evercold at the selected reduced-motion exposure (dark: %s)",
  (isDark) => {
    motion.reduced = true;
    const { container, rerender } = render(
      <NookWindowView isDark={isDark} eventId={null} colorTheme="pom-pom" />,
    );
    tracks.length = 0;
    rerender(
      <NookWindowView isDark={isDark} eventId={null} colorTheme="evercold" />,
    );
    expect(container.querySelector(".nook-window-exterior")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expectSkyModels(container);
    expect(tracks.length).toBeGreaterThan(0);
    tracks.forEach(({ playback }) => {
      expect(playback.currentTime).toBe(isDark ? 4800 : 0);
      expect(playback.playState).toBe("paused");
      expect(playback.play).not.toHaveBeenCalled();
    });
  },
);

it("retains the sheltered sky while settling a reversed transition for reduced motion", () => {
  const { container, rerender } = render(
    <NookWindowView isDark eventId={null} colorTheme="evercold" />,
  );
  const models = expectSkyModels(container);
  const initialCount = tracks.length;
  tracks.forEach(({ playback }) => {
    expect(playback.currentTime).toBe(4800);
    expect(playback.playState).toBe("paused");
  });
  rerender(
    <NookWindowView isDark={false} eventId={null} colorTheme="evercold" />,
  );
  tracks.forEach(({ playback }) => {
    playback.currentTime = 1800;
  });

  motion.reduced = true;
  rerender(
    <NookWindowView isDark={false} eventId={null} colorTheme="evercold" />,
  );
  expectRetainedModels(container, models);
  expect(tracks).toHaveLength(initialCount);
  expect(container.querySelector(".nook-window-exterior")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  tracks.forEach(({ playback }) => {
    expect(playback.currentTime).toBe(0);
    expect(playback.playState).toBe("paused");
  });
});

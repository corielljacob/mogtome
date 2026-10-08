import { render } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, expect, it, vi } from "vitest";
import { NookWindowView } from "./NookWindowView";
import { warmWindowThemes } from "./windowTestUtils";

beforeAll(
  () =>
    warmWindowThemes([
      "arr",
      "heavensward",
      "stormblood",
      "shadowbringers",
      "endwalker",
      "dawntrail",
      "evercold",
    ]),
  20000,
);

const motion = vi.hoisted(() => ({ reduced: false }));
vi.mock("@/shared/hooks/useReducedMotion", () => ({
  useReducedMotion: () => motion.reduced,
}));
vi.mock("./NookLandscape", () => ({
  NookLandscape: ({
    scene,
    night,
    className,
  }: {
    scene: string;
    night?: boolean;
    className?: string;
  }) => {
    const labels: Record<string, string> = {
      heavensward: "ishgard",
      stormblood: "ala-mhigo",
      shadowbringers: "crystarium",
      dawntrail: "tuliyollal",
      evercold: "evercold",
    };
    return (
      <img
        className={className}
        alt=""
        data-testid={
          scene === "endwalker"
            ? "lunar-surface"
            : labels[scene]
              ? `${labels[scene]}-${night ? "night" : "day"}`
              : undefined
        }
      />
    );
  },
}));

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
  const models = Array.from(container.querySelectorAll("[data-ambient-model]"));
  expect(models.length).toBeGreaterThan(0);
  models.forEach((model) => {
    expect(model.closest(".nook-dt-birds")).not.toBeNull();
    expect(model.hasAttribute("data-cycle-model")).toBe(false);
    expect(model.hasAttribute("data-cycle")).toBe(false);
    expect(model.closest(".nook-cycle-landscape")).toBeNull();
    expect(tracks.some(({ element }) => element === model)).toBe(false);
    expect(model.getAttribute("opacity")).toBe(
      model.getAttribute("data-ambient-model") === "0" ? "1" : "0",
    );
  });
  for (const family of new Set(models.map((model) => model.parentElement!))) {
    const poses = Array.from(family.children).filter((child) =>
      child.hasAttribute("data-ambient-model"),
    );
    expect(
      poses.map((pose) => pose.getAttribute("data-ambient-model")),
    ).toEqual(["0", "1", "2"]);
  }
  const skyModels: Element[] = [];
  for (const layer of ["sun", "moon", "clouds"]) {
    const surface = container.querySelector(`.nook-dt-${layer}`)!;
    expect(surface.getAttribute("data-cycle")).toBe(layer);
    expect(surface.querySelector("[data-ambient-model]")).toBeNull();
    expect(tracks.some(({ element }) => element === surface)).toBe(true);
    const poses = Array.from(surface.querySelectorAll("[data-cycle-model]"));
    expect(poses.map((pose) => pose.getAttribute("data-cycle-model"))).toEqual([
      "0",
      "1",
      "2",
    ]);
    poses.forEach((pose) => {
      expect(pose.hasAttribute("data-ambient-model")).toBe(false);
      expect(tracks.some(({ element }) => element === pose)).toBe(true);
    });
    skyModels.push(...poses);
  }
  return [...models, ...skyModels];
}

function expectRetainedModels(container: HTMLElement, previous: Element[]) {
  const current = expectSkyModels(container);
  expect(current).toHaveLength(previous.length);
  current.forEach((model, index) => expect(model).toBe(previous[index]));
}

it("retains the reversible Dawntrail exposure across theme and holiday changes", () => {
  const { container, getByTestId, queryByTestId, rerender } = render(
    <NookWindowView isDark={false} eventId={null} colorTheme="dawntrail" />,
  );
  const city = getByTestId("tuliyollal-day");
  const sun = container.querySelector(".nook-dt-sun");
  const models = expectSkyModels(container);
  const birds = container.querySelector(".nook-dt-birds");
  expect(birds).not.toBeNull();
  expect(birds!.closest("[data-cycle]")).toBeNull();
  expect(birds!.querySelector("[data-ambient-model]")).not.toBeNull();
  const initialCount = tracks.length;
  tracks.forEach(({ playback }) => {
    expect(playback.currentTime).toBe(0);
    expect(playback.playState).toBe("paused");
  });
  rerender(<NookWindowView isDark eventId={null} colorTheme="dawntrail" />);
  expect(getByTestId("tuliyollal-day")).toBe(city);
  expect(container.querySelector(".nook-dt-sun")).toBe(sun);
  expect(container.querySelector(".nook-dt-birds")).toBe(birds);
  expectRetainedModels(container, models);
  expect(tracks).toHaveLength(initialCount);
  tracks.forEach(({ playback }) => {
    playback.currentTime = 1800;
  });
  rerender(
    <NookWindowView isDark={false} eventId={null} colorTheme="dawntrail" />,
  );
  expectRetainedModels(container, models);
  tracks.forEach(({ playback }) => expect(playback.playbackRate).toBe(-1));

  for (const scene of [
    "pom-pom",
    "dawntrail",
    "starlight",
    "dawntrail",
    "all-saints-wake",
  ] as const) {
    const oldTracks = tracks.splice(0);
    const oldModels = Array.from(
      container.querySelectorAll("[data-ambient-model], [data-cycle-model]"),
    );
    const holiday = scene === "starlight" || scene === "all-saints-wake";
    rerender(
      <NookWindowView
        isDark={false}
        eventId={holiday ? scene : null}
        colorTheme={holiday ? "dawntrail" : scene}
      />,
    );
    oldTracks.forEach(({ playback }) =>
      expect(playback.cancel).toHaveBeenCalledOnce(),
    );
    oldModels.forEach((model) => expect(model.isConnected).toBe(false));
    expect(tracks.length).toBeGreaterThan(0);
    tracks.forEach(({ element, playback }) => {
      expect(element.isConnected).toBe(true);
      expect(playback.currentTime).toBe(1800);
      expect(playback.playbackRate).toBe(-1);
      expect(playback.playState).toBe("running");
    });
    expect(Boolean(queryByTestId("tuliyollal-night"))).toBe(
      scene === "dawntrail",
    );
    expect(Boolean(container.querySelector(".nook-dt-tide"))).toBe(
      scene === "dawntrail",
    );
    expect(Boolean(container.querySelector(".nook-dt-birds"))).toBe(
      scene === "dawntrail",
    );
    if (scene === "dawntrail") expectSkyModels(container);
    else expect(container.querySelector("[data-ambient-model]")).toBeNull();
    container
      .querySelectorAll("[data-cycle-model]")
      .forEach((element) =>
        expect(tracks.some((track) => track.element === element)).toBe(true),
      );
  }
});

it.each([false, true])(
  "settles new Dawntrail sky models with reduced motion (dark: %s)",
  (isDark) => {
    motion.reduced = true;
    const { container, rerender } = render(
      <NookWindowView isDark={isDark} eventId={null} colorTheme="pom-pom" />,
    );
    tracks.length = 0;
    rerender(
      <NookWindowView isDark={isDark} eventId={null} colorTheme="dawntrail" />,
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

it("settles an active transition without replacing sky models when motion is disabled", () => {
  const { container, rerender } = render(
    <NookWindowView isDark={false} eventId={null} colorTheme="dawntrail" />,
  );
  const models = expectSkyModels(container);
  const initialCount = tracks.length;
  rerender(<NookWindowView isDark eventId={null} colorTheme="dawntrail" />);
  tracks.forEach(({ playback }) => {
    playback.currentTime = 1800;
  });

  motion.reduced = true;
  rerender(<NookWindowView isDark eventId={null} colorTheme="dawntrail" />);
  expectRetainedModels(container, models);
  expect(tracks).toHaveLength(initialCount);
  expect(container.querySelector(".nook-window-exterior")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  tracks.forEach(({ playback }) => {
    expect(playback.currentTime).toBe(4800);
    expect(playback.playState).toBe("paused");
  });

  motion.reduced = false;
  rerender(<NookWindowView isDark eventId={null} colorTheme="dawntrail" />);
  expectRetainedModels(container, models);
  expect(container.querySelector(".nook-window-exterior")).not.toHaveAttribute(
    "data-reduced-motion",
  );
  tracks.forEach(({ playback }) => {
    expect(playback.currentTime).toBe(4800);
    expect(playback.playState).toBe("paused");
  });
});

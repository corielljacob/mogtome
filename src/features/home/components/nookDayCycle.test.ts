import { describe, expect, it, vi } from "vitest";
import {
  createDayCycle,
  DAY_CYCLE_DURATION,
  dayCycleFrames,
  setDayCycleTarget,
} from "./nookDayCycle";

// jsdom has no Web Animations clock. This small double models elapsed playback
// and the endpoint rewind that play() performs, so an accidental replay is visible.
class AnimationClock {
  currentTime = 0;
  playbackRate = 1;
  playState: AnimationPlayState = "running";
  duration: number;

  constructor(duration: number) {
    this.duration = duration;
  }

  pause = vi.fn(() => {
    this.playState = "paused";
  });

  play = vi.fn(() => {
    if (this.playbackRate > 0 && this.currentTime >= this.duration) {
      this.currentTime = 0;
    } else if (this.playbackRate < 0 && this.currentTime <= 0) {
      this.currentTime = this.duration;
    }
    this.playState = "running";
  });

  updatePlaybackRate = vi.fn((rate: number) => {
    this.playbackRate = rate;
  });

  advance(milliseconds: number) {
    if (this.playState !== "running") return;
    this.currentTime = Math.max(
      0,
      Math.min(
        this.duration,
        this.currentTime + milliseconds * this.playbackRate,
      ),
    );
    if (this.currentTime === 0 || this.currentTime === this.duration) {
      this.playState = "finished";
    }
  }
}

function makeScene(isDark = false, scene = "spring") {
  const root = document.createElement("div");
  root.dataset.scene = scene;
  root.innerHTML = `
    <div data-cycle="night-sky"></div>
    <svg data-cycle="sun"></svg>
    <div data-cycle="night-landscape"></div>
  `;
  if (scene === "shadowbringers") {
    root.innerHTML += `
      <div data-cycle="shb-light-left"></div>
      <div data-cycle="shb-light-right"></div>
      <div data-cycle="shb-light-edge-left"></div>
      <div data-cycle="shb-light-edge-right"></div>
    `;
  }
  const clocks: AnimationClock[] = [];
  const tracks = new Map<
    string,
    { frames: Keyframe[]; options: KeyframeAnimationOptions }
  >();
  for (const layer of root.querySelectorAll<HTMLElement>("[data-cycle]")) {
    Object.defineProperty(layer, "animate", {
      value: vi.fn((frames: Keyframe[], options: KeyframeAnimationOptions) => {
        const clock = new AnimationClock(Number(options.duration));
        clocks.push(clock);
        tracks.set(layer.dataset.cycle!, { frames, options });
        return clock as unknown as Animation;
      }),
    });
  }
  const animations = createDayCycle(root, isDark);
  return { root, clocks, animations, tracks };
}

describe("day-cycle playback", () => {
  it.each([false, true])(
    "opens at the saved dark=%s endpoint without replaying the transition",
    (isDark) => {
      const { clocks, animations } = makeScene(isDark);
      expect(animations).toHaveLength(3);

      setDayCycleTarget(animations, isDark, false);

      for (const clock of clocks) {
        expect(clock.currentTime).toBe(isDark ? DAY_CYCLE_DURATION : 0);
        expect(clock.playState).toBe("paused");
        expect(clock.play).not.toHaveBeenCalled();
        clock.advance(DAY_CYCLE_DURATION);
        expect(clock.currentTime).toBe(isDark ? DAY_CYCLE_DURATION : 0);
      }
    },
  );

  it.each(["spring", "shadowbringers"])(
    "retraces %s through rapid sunset, dawn, and sunset toggles",
    (scene) => {
      const { clocks, animations } = makeScene(false, scene);

      setDayCycleTarget(animations, true, false);
      clocks.forEach((clock) => clock.advance(1200));
      setDayCycleTarget(animations, false, false);

      for (const clock of clocks) {
        expect(clock.currentTime).toBe(1200);
        expect(clock.playbackRate).toBe(-1);
        clock.advance(350);
        expect(clock.currentTime).toBe(850);
      }

      setDayCycleTarget(animations, true, false);
      for (const clock of clocks) {
        expect(clock.currentTime).toBe(850);
        expect(clock.playbackRate).toBe(1);
        clock.advance(DAY_CYCLE_DURATION - 850);
        expect(clock.currentTime).toBe(DAY_CYCLE_DURATION);
        expect(clock.playState).toBe("finished");
      }
    },
  );

  it.each([false, true])(
    "does not restart a completed transition to dark=%s",
    (isDark) => {
      const { clocks, animations } = makeScene(!isDark);
      setDayCycleTarget(animations, isDark, false);
      clocks.forEach((clock) => clock.advance(DAY_CYCLE_DURATION));

      setDayCycleTarget(animations, isDark, false);

      for (const clock of clocks) {
        expect(clock.currentTime).toBe(isDark ? DAY_CYCLE_DURATION : 0);
        expect(clock.play).toHaveBeenCalledTimes(1);
        expect(clock.playState).toBe("paused");
      }
    },
  );

  it.each([
    ["spring", false],
    ["spring", true],
    ["shadowbringers", false],
    ["shadowbringers", true],
  ] as const)(
    "jumps a running %s transition directly to dark=%s when reduced motion is enabled",
    (scene, isDark) => {
      const { clocks, animations } = makeScene(!isDark, scene);
      setDayCycleTarget(animations, isDark, false);
      clocks.forEach((clock) => clock.advance(700));

      setDayCycleTarget(animations, isDark, true);

      for (const clock of clocks) {
        expect(clock.currentTime).toBe(isDark ? DAY_CYCLE_DURATION : 0);
        expect(clock.playState).toBe("paused");
        expect(clock.play).toHaveBeenCalledTimes(1);
        clock.advance(DAY_CYCLE_DURATION);
        expect(clock.currentTime).toBe(isDark ? DAY_CYCLE_DURATION : 0);
      }
    },
  );

  it("keeps a reduced-motion endpoint settled until the next actual mode change", () => {
    const { clocks, animations } = makeScene();
    setDayCycleTarget(animations, true, true);
    setDayCycleTarget(animations, true, false);

    for (const clock of clocks) {
      expect(clock.currentTime).toBe(DAY_CYCLE_DURATION);
      expect(clock.play).not.toHaveBeenCalled();
    }

    setDayCycleTarget(animations, false, false);
    for (const clock of clocks) {
      expect(clock.currentTime).toBe(DAY_CYCLE_DURATION);
      clock.advance(300);
      expect(clock.currentTime).toBe(DAY_CYCLE_DURATION - 300);
    }
  });

  it("leaves unsupported animation surfaces available to the static CSS fallback", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <div data-cycle="sun"></div>
      <div data-cycle="unrelated-decoration"></div>
    `;
    const unsupported = root.querySelector('[data-cycle="sun"]')!;
    Object.defineProperty(unsupported, "animate", { value: undefined });
    const unrelated = root.querySelector(
      '[data-cycle="unrelated-decoration"]',
    )!;
    const animate = vi.fn();
    Object.defineProperty(unrelated, "animate", { value: animate });

    const animations = createDayCycle(root, true);

    expect(animations).toEqual([]);
    expect(animate).not.toHaveBeenCalled();
    expect(() => setDayCycleTarget(animations, false, true)).not.toThrow();
  });
});

function cutoutPose(frame: Keyframe) {
  const values = String(frame.transform).match(
    /^translateX\((-?\d+(?:\.\d+)?)%\) skewX\((-?\d+(?:\.\d+)?)deg\)$/,
  );
  expect(values).not.toBeNull();
  const shift = Number(values![1]);
  const angle = Number(values![2]);
  const shear = Math.tan((angle * Math.PI) / 180);
  return {
    shift,
    angle,
    // The CSS cutout starts at x50%, around a y55% origin in a262x373 view.
    edgeAt: (y: number) => 50 + shift + shear * (y - 0.55) * (373 / 262) * 100,
  };
}

describe("Shadowbringers Light parting", () => {
  it("opens the cutouts from the top and clears the entire window at night", () => {
    const { tracks } = makeScene(false, "shadowbringers");
    const sky = tracks.get("night-sky")!;
    const left = tracks.get("shb-light-left")!;
    const right = tracks.get("shb-light-right")!;
    const first = cutoutPose(left.frames[0]);
    const middle = cutoutPose(
      left.frames.find((frame) => Number(frame.offset) >= 0.4)!,
    );
    const finalLeft = cutoutPose(left.frames.at(-1)!);
    const finalRight = cutoutPose(right.frames.at(-1)!);

    for (const y of [0, 0.55, 1]) {
      expect(first.edgeAt(y)).toBe(50);
      expect(finalLeft.edgeAt(y)).toBeLessThan(0);
      expect(finalRight.edgeAt(y)).toBeGreaterThan(100);
    }
    expect(middle.edgeAt(0)).toBeLessThan(50);
    expect(middle.edgeAt(0.55)).toBe(50);
    expect(middle.edgeAt(1)).toBeGreaterThan(50);
    expect(sky.frames[0].opacity).toBe(0);
    expect(
      sky.frames
        .filter((frame) => Number(frame.offset) >= 0.12)
        .every((frame) => frame.opacity === 1),
    ).toBe(true);
    expect(tracks.get("night-landscape")!.frames).toEqual(
      dayCycleFrames["night-landscape"],
    );
    expect(tracks.get("night-landscape")!.options.easing).toBe("linear");
  });

  it("moves mirrored gold and violet cutouts together without animating a clip path", () => {
    const { tracks } = makeScene(false, "shadowbringers");
    const sky = tracks.get("night-sky")!;
    const left = tracks.get("shb-light-left")!;
    const right = tracks.get("shb-light-right")!;
    const leftEdge = tracks.get("shb-light-edge-left")!;
    const rightEdge = tracks.get("shb-light-edge-right")!;
    for (const track of [left, right, leftEdge, rightEdge]) {
      expect(track.options).toEqual(sky.options);
      expect(track.options.duration).toBe(DAY_CYCLE_DURATION);
      expect(track.options.easing).toMatch(/^steps\(\d+, end\)$/);
      expect(track.frames).toHaveLength(sky.frames.length);
      expect(track.frames[0].opacity).toBe(0);
      expect(track.frames.at(-1)!.opacity).toBe(0);
      expect(track.frames.some((frame) => Number(frame.opacity) > 0.9)).toBe(
        true,
      );
    }

    sky.frames.forEach((frame, exposure) => {
      for (const track of [sky, left, right, leftEdge, rightEdge]) {
        const pose = track.frames[exposure];
        expect(pose.offset).toBe(frame.offset);
        expect(pose).not.toHaveProperty("clipPath");
        expect(pose).not.toHaveProperty("clip-path");
        expect(Number(pose.opacity)).toBeGreaterThanOrEqual(0);
        expect(Number(pose.opacity)).toBeLessThanOrEqual(1);
      }
      const goldLeft = cutoutPose(left.frames[exposure]);
      const goldRight = cutoutPose(right.frames[exposure]);
      expect(
        [
          goldLeft.shift,
          goldLeft.angle,
          goldRight.shift,
          goldRight.angle,
        ].every(Number.isFinite),
      ).toBe(true);
      expect(goldLeft.shift).toBeCloseTo(-goldRight.shift, 3);
      expect(goldLeft.angle).toBeCloseTo(-goldRight.angle, 4);
      expect(left.frames[exposure]).toEqual(leftEdge.frames[exposure]);
      expect(right.frames[exposure]).toEqual(rightEdge.frames[exposure]);
      for (const y of [0, 0.55, 1]) {
        expect(goldLeft.edgeAt(y) + goldRight.edgeAt(y)).toBeCloseTo(100, 3);
      }
      if (Number(frame.offset) >= 0.12 && Number(frame.offset) <= 0.96) {
        expect(left.frames[exposure].opacity).toBe(1);
        expect(right.frames[exposure].opacity).toBe(1);
      }
    });
  });

  it.each([false, true])(
    "opens with every Shadowbringers track settled at saved dark=%s",
    (isDark) => {
      const { clocks, animations } = makeScene(isDark, "shadowbringers");
      expect(animations).toHaveLength(7);
      setDayCycleTarget(animations, isDark, false);
      for (const clock of clocks) {
        expect(clock.currentTime).toBe(isDark ? DAY_CYCLE_DURATION : 0);
        expect(clock.playState).toBe("paused");
        expect(clock.play).not.toHaveBeenCalled();
      }
    },
  );

  it("leaves the established sky fade unchanged for other scenes", () => {
    const { tracks } = makeScene(false, "heavensward");
    expect(tracks.get("night-sky")!.frames).toEqual(
      dayCycleFrames["night-sky"],
    );
    expect(tracks.get("night-sky")!.options.easing).toBe("linear");
  });
});

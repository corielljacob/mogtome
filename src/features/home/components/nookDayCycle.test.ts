import { describe, expect, it, vi } from "vitest";
import {
  createDayCycle,
  DAY_CYCLE_DURATION,
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

function makeScene(isDark = false) {
  const root = document.createElement("div");
  root.innerHTML = `
    <div data-cycle="night-sky"></div>
    <svg data-cycle="sun"></svg>
    <div data-cycle="night-landscape"></div>
  `;
  const clocks: AnimationClock[] = [];
  for (const layer of root.querySelectorAll("[data-cycle]")) {
    Object.defineProperty(layer, "animate", {
      value: vi.fn((_frames: Keyframe[], options: KeyframeAnimationOptions) => {
        const clock = new AnimationClock(Number(options.duration));
        clocks.push(clock);
        return clock as unknown as Animation;
      }),
    });
  }
  const animations = createDayCycle(root, isDark);
  return { root, clocks, animations };
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

  it("retraces the current scene through rapid sunset, dawn, and sunset toggles", () => {
    const { clocks, animations } = makeScene();

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
  });

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

  it.each([false, true])(
    "jumps a running transition directly to dark=%s when reduced motion is enabled",
    (isDark) => {
      const { clocks, animations } = makeScene(!isDark);
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
